/** A validated Git-backed skills source selected for one server process. */
export interface GitSkillsSourceConfig {
  /** Git URL or local repository path. */
  readonly repository: string;
  /** Branch, tag, or commit accepted by Git. */
  readonly ref: string;
  /** Repository-relative directory containing skill directories. */
  readonly skillsPath: string;
  /** Optional cache directory for the shallow Git checkout. */
  readonly cacheDirectory?: string;
}

/** The immutable source snapshot used by every read in a server process. */
export interface GitSkillsSnapshot {
  /** Canonical absolute path of the local Git cache. */
  readonly repositoryDirectory: string;
  /** Commit ID resolved from {@link GitSkillsSourceConfig.ref}. */
  readonly commit: string;
  /** Normalized repository-relative skills directory. */
  readonly skillsPath: string;
}

/** A serialized skill address; the source content is deliberately not copied here. */
export interface SerializedSkill {
  /** Stable MCP address, including category when the source is categorized. */
  readonly id: string;
  /** Skill directory name from frontmatter or the Git path. */
  readonly name: string;
  /** First path segment below the configured skills directory. */
  readonly category: string;
  /** Repository-relative directory containing SKILL.md and references. */
  readonly sourceDirectory: string;
  /** Repository-relative SKILL.md path. */
  readonly skillPath: string;
  /** Frontmatter description, if present. */
  readonly description: string;
  /** All non-SKILL.md files below the skill directory. */
  readonly references: readonly string[];
}

/** Public MCP metadata returned by list_skills. */
export interface SkillSummary {
  readonly skill: string;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly source: string;
  readonly commit: string;
  readonly references: readonly string[];
}

/** Deterministic search result returned by the search_skills MCP tool. */
export interface SkillSearchResult {
  readonly skill: string;
  readonly score: number;
  readonly description: string;
}

/** Runtime configuration resolved from process environment. */
export interface ModuleConfig extends GitSkillsSourceConfig {
  readonly sourceLabel: string;
}
