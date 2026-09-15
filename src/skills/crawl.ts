#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, type Page } from "playwright";

const BASE_URL = "https://mcpmarket.com";
const OUTPUT_DIRECTORY = path.resolve(process.cwd(), process.env.OUT_DIR ?? "mcpmarket-skills");
const MAX_SKILLS = parseNonNegativeInteger(process.env.MAX_SKILLS, 0);
const DELAY_MS = parseNonNegativeInteger(process.env.DELAY_MS, 350);
const HEADLESS = process.env.HEADLESS !== "0";

interface SourceLocation {
  owner: string;
  repo: string;
  ref: string;
  subpath: string;
}

interface GitHubTreeEntry {
  type: string;
  path: string;
  sha: string;
}

interface GitHubTreeResponse {
  truncated: boolean;
  tree: GitHubTreeEntry[];
}

function parseNonNegativeInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function cleanName(value: string): string {
  return value
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "unnamed";
}

function isSkillUrl(href: string): boolean {
  try {
    const url = new URL(href, BASE_URL);
    const slug = url.pathname.split("/").at(-1);
    return url.origin === BASE_URL
      && /^\/tools\/skills\/[a-z0-9][a-z0-9-]*$/.test(url.pathname)
      && slug !== undefined
      && !["all", "leaderboard", "categories"].includes(slug);
  } catch {
    return false;
  }
}

async function crawlCatalog(page: Page): Promise<string[]> {
  await page.goto(`${BASE_URL}/tools/skills/all`, { waitUntil: "domcontentloaded" });
  const found = new Map<string, true>();
  let unchangedRounds = 0;

  for (let round = 0; round < 1000 && unchangedRounds < 8; round += 1) {
    const sizeBefore = found.size;
    const links = await page.locator('a[href*="/tools/skills/"]').all();
    for (const link of links) {
      const href = await link.getAttribute("href");
      if (href && isSkillUrl(href)) found.set(new URL(href, BASE_URL).href, true);
    }
    if (MAX_SKILLS > 0 && found.size >= MAX_SKILLS) break;
    unchangedRounds = found.size === sizeBefore ? unchangedRounds + 1 : 0;
    await page.mouse.wheel(0, 5000);
    await sleep(DELAY_MS);
  }

  return [...found.keys()].slice(0, MAX_SKILLS || undefined);
}

async function extractSourceUrl(page: Page, skillUrl: string): Promise<string | null> {
  await page.goto(skillUrl, { waitUntil: "domcontentloaded" });
  await page.locator('[role="tabpanel"]').first().waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);

  const pageText = await page.locator("html").textContent();
  if (/Vercel Security Checkpoint|We're verifying your browser/.test(pageText ?? "")) {
    throw new Error("MCP Market returned a browser security checkpoint");
  }

  const embeddedSource = await page.locator("html").evaluate((element) => {
    const urls = [...element.outerHTML.matchAll(/https?:\/\/github\.com\/[^"'<>\s]+/g)]
      .map((match) => match[0].replaceAll("\\/", "/"));
    return urls.find((url) => /github\.com\/[^/]+\/[^/]+\/tree\/[0-9a-f]{7,}\/[^/"'<>\s]/i.test(url)) ?? null;
  });
  if (embeddedSource) return embeddedSource;

  const downloadButton = page.getByRole("button", { name: "Download skill" }).first();
  if (await downloadButton.count()) {
    await downloadButton.click();
    await page.waitForTimeout(700);
    const redirectedUrl = page.url();
    if (/github\.com\/[^/]+\/[^/]+\/tree\/[0-9a-f]{7,}\/[^/"'<>\s]/i.test(redirectedUrl)) {
      return redirectedUrl;
    }
    const decodedUrl = decodeURIComponent(redirectedUrl);
    const match = decodedUrl.match(/https?:\/\/github\.com\/[^&]+\/tree\/[0-9a-f]{7,}\/[^&/][^&]*/i);
    if (match) return match[0];
  }
  return null;
}

function parseTreeUrl(sourceUrl: string): SourceLocation {
  const match = sourceUrl.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/?(.*)$/i);
  if (!match) throw new Error(`Unsupported GitHub source: ${sourceUrl}`);
  return { owner: match[1], repo: match[2], ref: match[3], subpath: decodeURIComponent(match[4] || "") };
}

async function githubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "mcpmarket-skills-catalog/1.0",
      ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${url}`);
  return response.json() as Promise<T>;
}

async function downloadTree(sourceUrl: string, destination: string): Promise<number> {
  const source = parseTreeUrl(sourceUrl);
  const treeUrl = `https://api.github.com/repos/${source.owner}/${source.repo}/git/trees/${encodeURIComponent(source.ref)}?recursive=1`;
  const root = await githubJson<GitHubTreeResponse>(treeUrl);
  if (root.truncated) throw new Error("GitHub tree is truncated; use a GitHub token or a narrower source tree");

  const prefix = source.subpath.replace(/^\/+|\/+$/g, "");
  const files = root.tree.filter((entry) => entry.type === "blob"
    && (!prefix || entry.path === prefix || entry.path.startsWith(`${prefix}/`)));
  if (!files.length) throw new Error(`No files found under ${prefix || "/"}`);

  const resolvedDestination = path.resolve(destination);
  for (const file of files) {
    const relativePath = prefix ? file.path.slice(prefix.length).replace(/^\//, "") : file.path;
    const target = path.resolve(destination, relativePath);
    if (!target.startsWith(`${resolvedDestination}${path.sep}`)) throw new Error("Unsafe GitHub path");
    await fs.mkdir(path.dirname(target), { recursive: true });
    const blobUrl = `https://api.github.com/repos/${source.owner}/${source.repo}/git/blobs/${file.sha}`;
    const blob = await githubJson<{ content: string }>(blobUrl);
    await fs.writeFile(target, Buffer.from(blob.content.replace(/\n/g, ""), "base64"));
  }
  return files.length;
}

async function main(): Promise<void> {
  await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });
  const launchOptions: Parameters<typeof chromium.launch>[0] = {
    headless: HEADLESS,
    args: ["--disable-crash-reporter"],
  };
  const installedChrome = process.env.BROWSER_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  try {
    await fs.access(installedChrome);
    launchOptions.executablePath = installedChrome;
  } catch {
    // Fall back to Playwright's managed browser when it is installed.
  }

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const failures: Array<{ skillUrl: string; error: string }> = [];

  try {
    console.log("Reading public MCP Market catalog…");
    const skillUrls = await crawlCatalog(page);
    console.log(`Found ${skillUrls.length} public skill pages.`);

    for (let index = 0; index < skillUrls.length; index += 1) {
      const skillUrl = skillUrls[index];
      const slug = new URL(skillUrl).pathname.split("/").at(-1) ?? "unnamed";
      process.stdout.write(`[${index + 1}/${skillUrls.length}] ${slug} … `);
      try {
        const categoryText = await page.locator('a[href*="/categories/"]').first().textContent().catch(() => "Other");
        const sourceUrl = await extractSourceUrl(page, skillUrl);
        if (!sourceUrl) throw new Error("No public immutable GitHub source found");
        const source = parseTreeUrl(sourceUrl);
        const destination = path.join(OUTPUT_DIRECTORY, cleanName(categoryText || "Other"), cleanName(slug));
        const fileCount = await downloadTree(sourceUrl, destination);
        await fs.writeFile(
          path.join(destination, ".mcpmarket-source.json"),
          `${JSON.stringify({ skillUrl, sourceUrl, fetchedAt: new Date().toISOString(), ...source }, null, 2)}\n`,
        );
        console.log(`saved ${fileCount} file(s)`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ skillUrl, error: message });
        console.log(`SKIPPED: ${message}`);
      }
      await sleep(DELAY_MS);
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(path.join(OUTPUT_DIRECTORY, "_crawl-errors.json"), `${JSON.stringify(failures, null, 2)}\n`);
  console.log(`Done. Output: ${OUTPUT_DIRECTORY}`);
  if (failures.length) console.log(`${failures.length} skill(s) need review in _crawl-errors.json.`);
}

main().catch((error: unknown) => {
  console.error(`Fatal: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
