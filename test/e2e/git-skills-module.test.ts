import assert from 'node:assert/strict';
import { type ChildProcessWithoutNullStreams, execFileSync, spawn } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

const repositoryRoot = resolve(import.meta.dirname, '../..');
const draftRoot = join(repositoryRoot, 'sandbox', 'draft');
const cacheRoot = join(repositoryRoot, 'sandbox', 'draft-cache');
const skillId = 'core/e2e-skill';
const exactSkill = '---\nname: e2e-skill\ndescription: Exact fixture\n---\n\n# Exact\n\nLine 2.\n';
let server: ChildProcessWithoutNullStreams | undefined;
let responseLines: string[] = [];
let responseWaiters: Array<(value: Record<string, unknown>) => void> = [];

function request(method: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> {
  return new Promise((resolveResponse) => {
    responseWaiters.push(resolveResponse);
    server?.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: responseLines.length + 1, method, params })}\n`);
  });
}

function notify(method: string, params: Record<string, unknown> = {}): void {
  server?.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);
}

before(async () => {
  await rm(draftRoot, { recursive: true, force: true });
  await rm(cacheRoot, { recursive: true, force: true });
  await mkdir(join(draftRoot, 'skills', 'core', 'e2e-skill', 'references'), { recursive: true });
  await writeFile(join(draftRoot, 'skills', 'core', 'e2e-skill', 'SKILL.md'), exactSkill);
  await writeFile(join(draftRoot, 'skills', 'core', 'e2e-skill', 'references', 'guide.md'), '# Guide\n');
  execFileSync('git', ['init', '--quiet'], { cwd: draftRoot });
  execFileSync('git', ['config', 'user.email', 'e2e@example.invalid'], { cwd: draftRoot });
  execFileSync('git', ['config', 'user.name', 'e2e'], { cwd: draftRoot });
  execFileSync('git', ['add', 'skills'], { cwd: draftRoot });
  execFileSync('git', ['commit', '--quiet', '-m', 'fixture'], { cwd: draftRoot });

  server = spawn(resolve(repositoryRoot, 'node_modules', '.bin', 'mcpx'), ['run', 'git-skills'], {
    cwd: repositoryRoot,
    env: {
      ...process.env,
      MCPX_ROOT: repositoryRoot,
      GIT_SKILLS_REPOSITORY: draftRoot,
      GIT_SKILLS_REF: 'HEAD',
      GIT_SKILLS_PATH: 'skills',
      GIT_SKILLS_CACHE: cacheRoot,
    },
    stdio: 'pipe',
  });
  server.stdout.setEncoding('utf8');
  server.stdout.on('data', (chunk: string) => {
    for (const line of chunk.split('\n').filter(Boolean)) {
      const value = JSON.parse(line) as Record<string, unknown>;
      responseLines.push(line);
      responseWaiters.shift()?.(value);
    }
  });
});

after(async () => {
  server?.kill('SIGTERM');
  await new Promise<void>((done) => server?.once('close', () => done()) ?? done());
  await rm(draftRoot, { recursive: true, force: true });
  await rm(cacheRoot, { recursive: true, force: true });
});

test('serves an immutable Git skill through MCPX and stdio MCP', async () => {
  const initialized = await request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'e2e', version: '1.0.0' },
  });
  assert.equal((initialized.result as Record<string, unknown>).protocolVersion, '2025-06-18');

  notify('notifications/initialized');
  const tools = await request('tools/list');
  const toolNames = ((tools.result as { tools: Array<{ name: string }> }).tools).map((tool) => tool.name);
  assert.deepEqual(toolNames, ['list_skills', 'read_skill', 'list_references', 'read_reference', 'search_skills']);

  const listed = await request('tools/call', { name: 'list_skills', arguments: {} });
  const listedText = ((listed.result as { content: Array<{ text: string }> }).content[0]).text;
  const summary = JSON.parse(listedText) as Array<{ skill: string; commit: string }>;
  assert.equal(summary[0]?.skill, skillId);
  assert.match(summary[0]?.commit ?? '', /^[0-9a-f]{40}$/);

  const read = await request('tools/call', { name: 'read_skill', arguments: { skill: skillId } });
  assert.equal(((read.result as { content: Array<{ text: string }> }).content[0]).text, exactSkill);

  const references = await request('tools/call', { name: 'list_references', arguments: { skill: skillId } });
  assert.deepEqual(JSON.parse(((references.result as {
    content: Array<{ text: string }>
  }).content[0]).text), ['guide.md']);

  const reference = await request('tools/call', {
    name: 'read_reference',
    arguments: { skill: skillId, reference: 'guide.md' },
  });
  assert.equal(((reference.result as { content: Array<{ text: string }> }).content[0]).text, '# Guide\n');

  const search = await request('tools/call', { name: 'search_skills', arguments: { query: 'exact fixture' } });
  assert.equal(JSON.parse(((search.result as { content: Array<{ text: string }> }).content[0]).text)[0].skill, skillId);

  const traversal = await request('tools/call', { name: 'read_reference', arguments: { skill: skillId, reference: '../SKILL.md' } });
  assert.equal((traversal.result as { isError: boolean }).isError, true);
});
