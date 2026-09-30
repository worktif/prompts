# Git-backed Skills MCPX Module

This module serves skills from a Git repository over MCP stdio. The repository's local
`skills/` directory is not read by the module; it is only the default repository-relative
path used when resolving the configured Git source.

## Run through MCPX

Build the module and launch it through the MCPX module manifest:

```bash
yarn build
MCPX_ROOT="$PWD" \
GIT_SKILLS_REPOSITORY=https://github.com/worktif/prompts.git \
GIT_SKILLS_REF=main \
GIT_SKILLS_PATH=skills \
mcpx run git-skills
```

The module resolves `GIT_SKILLS_REF` to one commit and serves every document from that
commit. `GIT_SKILLS_REPOSITORY` may be a remote URL or a local Git repository path. The
optional `GIT_SKILLS_CACHE` variable selects the shallow checkout directory.

## Runtime address mapping

For a Git file such as:

```text
skills/core/engineering-review/SKILL.md
```

the MCP skill address is `core/engineering-review`. The serializer changes only this
address mapping. `read_skill` returns the original Git blob content without Markdown
rewriting or line-ending normalization. Reference paths are relative to the skill's
`references/` directory, matching the `@stdiobus/skills` MCP surface.

## MCP surface

The module exposes `list_skills`, `read_skill`, `list_references`, `read_reference`, and
`search_skills` over JSON-RPC/NDJSON stdio. All diagnostics go to stderr; stdout remains
reserved for the MCP protocol.

## End-to-end verification

```bash
yarn test:e2e
```

The test creates an ignored `sandbox/draft` Git repository, launches this module through
the actual `mcpx run git-skills` command, and validates the MCP handshake, tool surface,
Git commit provenance, exact skill content, and reference content.
