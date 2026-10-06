import { normalizeGitPath } from './git-source.js';
import type { SerializedSkill } from './contracts.js';

function frontmatterValue(markdown: string, key: string): string {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.+?)(?:\\n|$)`, 'm'));
  if (match?.[1] && match[1] !== '>') return match[1].trim().replace(/^['"]|['"]$/g, '');

  const block = markdown.match(new RegExp(`^${key}:\\s*>\\s*\\n((?:[ \\t]+.*(?:\\n|$))*)`, 'm'));
  return block?.[1]
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ') ?? '';
}

function categoryAndName(relativeDirectory: string): { category: string; name: string; id: string } {
  const parts = normalizeGitPath(relativeDirectory).split('/').filter(Boolean);
  const name = parts.at(-1);
  if (!name) throw new Error(`Cannot derive a skill name from path: ${relativeDirectory}`);
  const category = parts.at(0) ?? 'root';
  const id = parts.length > 1 ? parts.join('/') : name;
  return { category, name, id };
}

/**
 * Convert Git file paths into stable MCP skill addresses.
 *
 * This is the only path/name adapter. It does not rewrite Markdown, normalize line endings,
 * or copy files. A category is retained in the public ID (`core/example`) to make duplicate
 * skill directory names from different categories deterministic and addressable.
 */
export function serializeSkills(
  skillsPath: string,
  files: readonly string[],
  contents: ReadonlyMap<string, string>,
): readonly SerializedSkill[] {
  const prefix = `${normalizeGitPath(skillsPath)}/`;
  const skillFiles = files.filter((file) => file.startsWith(prefix) && file.endsWith('/SKILL.md'));

  return skillFiles
    .map((skillPath) => {
      const relativeSkillPath = skillPath.slice(prefix.length);
      const sourceDirectory = relativeSkillPath.slice(0, -'/SKILL.md'.length);
      const { category, name, id } = categoryAndName(sourceDirectory);
      const skillDirectoryPrefix = skillPath.slice(0, -'SKILL.md'.length);
      const referencesPrefix = `${skillDirectoryPrefix}references/`;
      const references = files
        .filter((file) => file.startsWith(referencesPrefix))
        .map((file) => file.slice(referencesPrefix.length))
        .filter((file) => file !== '.gitkeep')
        .sort();
      const markdown = contents.get(skillPath) ?? '';

      return {
        id,
        name: frontmatterValue(markdown, 'name') || name,
        category,
        sourceDirectory,
        skillPath,
        description: frontmatterValue(markdown, 'description'),
        references,
      } satisfies SerializedSkill;
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
