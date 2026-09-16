# Installation and use

The library is intentionally vendor-neutral. Copy `AGENTS.md` to the project root, then merge the project-specific facts from `AGENTS.md.template` into that project contract. Copy the four directories under `core/` into the tool's project or user Skills directory. Copy only applicable directories under `optional/`.

## Codex-compatible layout

```text
<skills-root>/
  engineering-discovery/SKILL.md
  engineering-implementation/SKILL.md
  engineering-verification/SKILL.md
  engineering-review/SKILL.md
  security/SKILL.md                 # only when applicable
  ...
```

Do not rename the `name` in frontmatter. If a host uses a different skill directory convention, preserve each `SKILL.md` and adapt only the outer installation path or metadata format required by that host.

## Operating rule

Load all four core Skills for engineering changes. Load optional Skills by applicability. If a host cannot automatically discover Skills, include the relevant Skill paths in the task prompt. The project `AGENTS.md` remains the source of project-specific facts.

## Updates

Treat this library as versioned infrastructure. Review changes to core Skills as potentially behavior-changing. Validate every changed Skill, test it on a realistic task, and record the version used by each project.
