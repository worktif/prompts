import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { GitSkillsCatalog } from './catalog.js';
import type { ModuleConfig } from './contracts.js';
import { resolveGitSnapshot } from './git-source.js';

const DEFAULT_REPOSITORY = 'https://github.com/worktif/prompts.git';
const DEFAULT_REF = 'main';
const DEFAULT_SKILLS_PATH = 'skills';

function environment(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

function configuration(): ModuleConfig {
  return {
    repository: environment('GIT_SKILLS_REPOSITORY', DEFAULT_REPOSITORY),
    ref: environment('GIT_SKILLS_REF', DEFAULT_REF),
    skillsPath: environment('GIT_SKILLS_PATH', DEFAULT_SKILLS_PATH),
    cacheDirectory: process.env.GIT_SKILLS_CACHE?.trim() || undefined,
    sourceLabel: `${environment('GIT_SKILLS_REPOSITORY', DEFAULT_REPOSITORY)}#${environment('GIT_SKILLS_REF', DEFAULT_REF)}:${environment('GIT_SKILLS_PATH', DEFAULT_SKILLS_PATH)}`,
  };
}

function toolError(message: string): { content: [{ type: 'text'; text: string }]; isError: true } {
  return { content: [{ type: 'text', text: message }], isError: true };
}

/**
 * Start the Git-backed MCP module.
 *
 * MCPX launches this file as a normal Node.js module. STDOUT is owned exclusively by the
 * MCP SDK transport; diagnostics are written to STDERR so JSON-RPC framing is never polluted.
 */
export async function startGitSkillsModule(): Promise<void> {
  const config = configuration();
  const snapshot = await resolveGitSnapshot(config);
  const catalog = await GitSkillsCatalog.create(snapshot);
  const server = new McpServer(
    { name: 'git-skills', version: '1.0.0' },
    { capabilities: { tools: {} } },
  );

  server.registerTool('list_skills', {
    description: `List skills from ${config.sourceLabel}`,
    inputSchema: {},
  }, async () => ({ content: [{ type: 'text', text: JSON.stringify(catalog.list()) }] }));

  server.registerTool('read_skill', {
    description: 'Read the exact SKILL.md content from the pinned Git commit',
    inputSchema: { skill: z.string().min(1) },
  }, async ({ skill }) => {
    try { return { content: [{ type: 'text', text: await catalog.readSkill(skill) }] }; }
    catch (error) { return toolError(`read_skill: ${error instanceof Error ? error.message : String(error)}`); }
  });

  server.registerTool('list_references', {
    description: 'List reference files for a Git-backed skill',
    inputSchema: { skill: z.string().min(1) },
  }, async ({ skill }) => {
    try { return { content: [{ type: 'text', text: JSON.stringify(catalog.listReferences(skill)) }] }; }
    catch (error) { return toolError(`list_references: ${error instanceof Error ? error.message : String(error)}`); }
  });

  server.registerTool('read_reference', {
    description: 'Read a reference file from the pinned Git commit',
    inputSchema: { skill: z.string().min(1), reference: z.string().min(1) },
  }, async ({ skill, reference }) => {
    try { return { content: [{ type: 'text', text: await catalog.readReference(skill, reference) }] }; }
    catch (error) { return toolError(`read_reference: ${error instanceof Error ? error.message : String(error)}`); }
  });

  server.registerTool('search_skills', {
    description: 'Search Git-backed skills by name, metadata, or content',
    inputSchema: { query: z.string().min(1) },
  }, async ({ query }) => {
    if (!query.trim()) return toolError('search_skills: query must not be empty');
    return { content: [{ type: 'text', text: JSON.stringify(await catalog.search(query)) }] };
  });

  process.stderr.write(`git-skills: serving ${catalog.list().length} skill(s) from ${config.sourceLabel} @ ${snapshot.commit}\n`);
  await server.connect(new StdioServerTransport());
}

const entrypoint = process.argv[1];
const isEntrypoint = entrypoint !== undefined
  && import.meta.url === pathToFileURL(resolve(entrypoint)).href;

if (isEntrypoint) {
  startGitSkillsModule().catch((error: unknown) => {
    process.stderr.write(`git-skills: fatal: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
