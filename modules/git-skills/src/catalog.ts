import type {
  GitSkillsSnapshot,
  SerializedSkill,
  SkillSearchResult,
  SkillSummary,
} from './contracts.js';
import { listGitFiles, readGitFile } from './git-source.js';
import { serializeSkills } from './serializer.js';

/** In-memory Git-backed catalog whose membership is fixed to one commit. */
export class GitSkillsCatalog {
  private readonly skillsById: ReadonlyMap<string, SerializedSkill>;

  private constructor(
    private readonly snapshot: GitSkillsSnapshot,
    skills: readonly SerializedSkill[],
  ) {
    this.skillsById = new Map(skills.map((skill) => [skill.id, skill]));
  }

  /** Build a catalog from Git tree metadata and SKILL.md frontmatter. */
  public static async create(snapshot: GitSkillsSnapshot): Promise<GitSkillsCatalog> {
    const files = await listGitFiles(snapshot, snapshot.skillsPath);
    const skillPaths = files.filter((file) => file.endsWith('/SKILL.md'));
    const contents = new Map<string, string>();
    await Promise.all(skillPaths.map(async (file) => contents.set(file, await readGitFile(snapshot, file))));
    return new GitSkillsCatalog(snapshot, serializeSkills(snapshot.skillsPath, files, contents));
  }

  /** Return deterministic metadata without exposing the local checkout path. */
  public list(): readonly SkillSummary[] {
    return [...this.skillsById.values()].map((skill) => ({
      skill: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      source: skill.skillPath,
      commit: this.snapshot.commit,
      references: skill.references,
    }));
  }

  /** Read a complete SKILL.md byte-for-byte as decoded UTF-8 text. */
  public async readSkill(id: string): Promise<string> {
    return readGitFile(this.snapshot, this.skill(id).skillPath);
  }

  /** List references belonging to exactly one skill directory. */
  public listReferences(id: string): readonly string[] {
    return this.skill(id).references;
  }

  /** Read one reference from the same immutable commit as its SKILL.md. */
  public async readReference(id: string, reference: string): Promise<string> {
    if (!reference || reference.includes('..') || reference.startsWith('/')) {
      throw new Error('Invalid reference path: traversal is not allowed.');
    }
    const skill = this.skill(id);
    const file = `${this.snapshot.skillsPath}/${skill.sourceDirectory}/references/${reference}`;
    if (!skill.references.includes(reference)) throw new Error(`Reference not found: ${reference}`);
    return readGitFile(this.snapshot, file);
  }

  /** Deterministic token search over IDs, metadata, and exact Git-backed skill bodies. */
  public async search(query: string): Promise<readonly SkillSearchResult[]> {
    const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    if (terms.length === 0) return [];
    const results: SkillSearchResult[] = [];
    for (const skill of this.skillsById.values()) {
      const body = (await this.readSkill(skill.id)).toLowerCase();
      const fields = [skill.id, skill.name, skill.description].map((field) => field.toLowerCase());
      const score = terms.reduce((total, term) => {
        if (fields.some((field) => field.includes(term))) return total + 3;
        return total + (body.includes(term) ? 1 : 0);
      }, 0);
      if (score > 0) results.push({ skill: skill.id, score, description: skill.description });
    }
    return results.sort((left, right) => Number(right.score) - Number(left.score) || String(left.skill).localeCompare(String(right.skill)));
  }

  private skill(id: string): SerializedSkill {
    const skill = this.skillsById.get(id);
    if (!skill) throw new Error(`Skill not found: ${id}`);
    return skill;
  }
}
