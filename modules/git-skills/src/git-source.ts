import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import type { GitSkillsSnapshot, GitSkillsSourceConfig } from './contracts.js';

const execFileAsync = promisify(execFile);
const MAX_GIT_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Error raised when a Git source cannot be resolved safely or completely. */
export class GitSourceError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'GitSourceError';
  }
}

function normalizeRepositoryPath(value: string): string {
  const normalized = value.replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized || normalized === '.' || normalized.startsWith('/') || normalized.includes('..')) {
    throw new GitSourceError(`GIT_SKILLS_PATH must be a repository-relative path: ${value}`);
  }
  return normalized.replace(/\/$/, '');
}

function cacheDirectoryFor(config: GitSkillsSourceConfig): string {
  if (config.cacheDirectory) return resolve(config.cacheDirectory);
  const repositoryName = basename(config.repository.replace(/\/$/, '')) || 'repository';
  const repositoryKey = createHash('sha256').update(config.repository).digest('hex').slice(0, 16);
  return join(tmpdir(), 'stdiobus-git-skills', `${repositoryName}-${repositoryKey}`);
}

async function runGit(
  args: readonly string[],
  cwd?: string,
): Promise<string> {
  try {
    const result = await execFileAsync('git', [...args], {
      cwd,
      encoding: 'utf8',
      maxBuffer: MAX_GIT_OUTPUT_BYTES,
    });
    return result.stdout.trimEnd();
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new GitSourceError(`git ${args.join(' ')} failed: ${detail}`, { cause });
  }
}

async function runGitRaw(
  args: readonly string[],
  cwd?: string,
): Promise<string> {
  try {
    const result = await execFileAsync('git', [...args], {
      cwd,
      encoding: 'utf8',
      maxBuffer: MAX_GIT_OUTPUT_BYTES,
    });
    return result.stdout;
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new GitSourceError(`git ${args.join(' ')} failed: ${detail}`, { cause });
  }
}

/**
 * Resolve a Git repository and ref to one immutable local snapshot.
 *
 * The checkout is intentionally shallow and has no working tree. Subsequent reads use
 * `git show <commit>:<path>`, so all files served by this process come from the same commit.
 */
export async function resolveGitSnapshot(
  config: GitSkillsSourceConfig,
): Promise<GitSkillsSnapshot> {
  const skillsPath = normalizeRepositoryPath(config.skillsPath);
  const repositoryDirectory = cacheDirectoryFor(config);
  await mkdir(repositoryDirectory, { recursive: true });

  const gitDirectory = join(repositoryDirectory, '.git');
  try {
    await realpath(gitDirectory);
  } catch {
    await runGit(['clone', '--no-checkout', '--filter=blob:none', '--quiet', config.repository, repositoryDirectory]);
  }

  await runGit(['fetch', '--depth=1', '--quiet', 'origin', config.ref], repositoryDirectory);
  const commit = await runGit(['rev-parse', 'FETCH_HEAD^{commit}'], repositoryDirectory);
  if (!/^[0-9a-f]{40}$/i.test(commit)) {
    throw new GitSourceError(`Git resolved an invalid commit for ref "${config.ref}": ${commit}`);
  }

  return { repositoryDirectory, commit, skillsPath };
}

/** Read a UTF-8 file from the immutable snapshot using Git object storage. */
export async function readGitFile(
  snapshot: GitSkillsSnapshot,
  repositoryPath: string,
): Promise<string> {
  const normalized = normalizeRepositoryPath(repositoryPath);
  return runGitRaw(['show', `${snapshot.commit}:${normalized}`], snapshot.repositoryDirectory);
}

/** List tracked files below a repository path at the immutable snapshot. */
export async function listGitFiles(
  snapshot: GitSkillsSnapshot,
  repositoryPath: string,
): Promise<readonly string[]> {
  const normalized = normalizeRepositoryPath(repositoryPath);
  const output = await runGit(
    ['ls-tree', '-r', '--name-only', snapshot.commit, '--', normalized],
    snapshot.repositoryDirectory,
  );
  if (!output) return [];
  return output
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Confirm that a derived path remains within a configured Git directory. */
export function isRepositoryChild(parent: string, child: string): boolean {
  const parentPath = resolve(parent);
  const childPath = resolve(child);
  const childRelative = relative(parentPath, childPath);
  return childRelative === '' || (!childRelative.startsWith(`..${sep}`) && childRelative !== '..' && !isAbsolute(childRelative));
}

/** Normalize a POSIX Git path without permitting traversal. */
export function normalizeGitPath(value: string): string {
  const normalized = normalize(value).replaceAll('\\', '/');
  if (normalized === '.' || normalized.startsWith('../') || normalized.includes('/../') || normalized.startsWith('/')) {
    throw new GitSourceError(`Unsafe Git path: ${value}`);
  }
  return normalized;
}
