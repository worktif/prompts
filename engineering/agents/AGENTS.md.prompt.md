Prompt: Generate a complete AGENTS.md from the given template

You are an AI coding agent.
Your task is to produce a final, production-ready AGENTS.md file for a concrete repository, based strictly on the AGENTS.md template provided below.

The template is:

# AGENTS.md

## 0. Agent scope & identity

- You are an AI coding agent working **inside this repository only**.
- Your primary goals:
    - Implement features and fixes as requested.
    - Preserve existing architecture and public contracts.
    - Maintain reliability, security, and performance.
- You must:
    - Prefer small, reviewable changes.
    - Explain non-trivial decisions in comments or commit messages (if available).
    - Ask for clarification when a change would break explicit constraints below.

---

## 1. Project overview

- Purpose of this repo:
    - ...
- Core domains / bounded contexts:
    - ...
- Critical invariants:
    - ...

---

## 2. Environment & assumptions

- Runtime:
    - Node.js: ...
    - TypeScript: ...
- Package manager:
    - `pnpm` / `npm` / `yarn` (choose one and stay consistent).
- Local services:
    - ...
- Do **not** assume internet access unless explicitly granted.

---

## 3. Setup & commands

Always use these commands when working with the project:

- Install dependencies:
    - `...`
- Run dev server:
    - `...`
- Run unit tests:
    - `...`
- Run integration/e2e tests:
    - `...`
- Lint / format:
    - `...`
- Build:
    - `...`
- Database / migrations (if any):
    - `...`

**Rule:**  
Before you propose final changes, run all relevant tests and lint commands from this section.

---

## 4. Repository & architecture map

High-level structure:

- `.../` — core backend logic
- `.../` — frontend
- `.../` — shared models/types
- `.../` — infra (CDK/SST/Terraform/etc.)
- `.../tests` — test suites (unit/integration/e2e)

Key entrypoints:

- Backend:
    - `...`
- Frontend:
    - `...`
- Infra:
    - `...`

---

## 5. Coding conventions

- Language:
    - TypeScript strict mode: `true` (do not weaken typings).
- Style:
    - Quotes: `'single'` / `"double"`; no semicolons / with semicolons.
    - Import order and grouping: `...`
    - Prefer pure functions where possible; side effects in adapters/handlers.
- Error handling:
    - Use `...` for domain errors; avoid throwing raw strings.
- Logging:
    - Use `...` logger; do not log secrets or PII.

---

## 6. Testing strategy

When you change code:

- **Always** add or update tests covering:
    - Happy path.
    - Relevant edge cases.
    - Regressions you are fixing.
- Test locations:
    - Unit: `...`
    - Integration: `...`
    - e2e: `...`

Commands:

- Unit tests:
    - `...`
- Integration tests:
    - `...`
- e2e tests:
    - `...`

If tests fail, fix them or revert the change. Do **not** silence or delete failing tests without reason.

---

## 7. Workflow rules

- Branching:
    - Use branches like `feature/...`, `fix/...`.
- Commits:
    - Keep commits small and focused.
    - Examples:
        - `feat: ...`
        - `fix: ...`
        - `chore: ...`
- Pull requests:
    - Title format: `[scope] short description`.
    - PR must include:
        - Summary of changes.
        - Risks and mitigations.
        - How to test (commands + steps).

---

## 8. Safety, secrets & destructive operations

- **Never** hardcode secrets, tokens or passwords.
- Do **not** read or modify:
    - `.env*` files, secret stores, or credentials in CI configs.
- Destructive operations (data loss, dropping tables, truncating logs, deleting resources) are **forbidden** unless:
    - The user explicitly asks for such operations **and** confirms understanding of the risk.
- Do not add code that:
    - Sends production data to external services not already configured.
    - Weakens authentication or authorization checks.

If you are unsure whether a change might be destructive, **ask before proceeding**.

---

## 9. Tooling & integrations (MCP / CLI / external)

If available, use these tools instead of reinventing functionality:

- Internal CLI:
    - `...` — purpose and example usage.
- MCP / skills:
    - `...` — what it does, when to use it.
- Cloud / platform tools (e.g. AWS CDK, SST):
    - `...`

Do not introduce new tools or services without a clear justification and minimal footprint.

---

## 10. Constraints / do-not-touch areas

Do **not** change, unless a task explicitly requires it:

- Public API contracts:
    - HTTP endpoint shapes (paths, methods, request/response formats).
    - GraphQL schema fields that are already in use.
- Infra boundaries:
    - VPC / network topology.
    - IAM policies beyond small scoped additions.
- Shared libraries with many dependants, unless:
    - Changes are backwards compatible; and
    - Tests are added or updated across all affected packages.

Generated or vendor files:

- Do not manually edit:
    - `...` (generated code)
    - `...` (lockfiles, unless the change is a direct result of dependency install).

---

## 11. Performance & resource guidelines

- Avoid algorithms worse than `O(n log n)` for large collections unless justified.
- Be mindful of:
    - Additional network roundtrips.
    - Additional DB queries.
    - Additional cold-start overhead in serverless functions.

If a task touches performance-critical paths (`...`), summarize your reasoning and trade-offs.

---

## 12. Monorepo & nested AGENTS.md

- This repository **may contain nested `AGENTS.md` files** in subdirectories.
- **Rule:** follow the instructions of the closest `AGENTS.md` to the file you are editing.
- If a nested `AGENTS.md` conflicts with this one:
    - Local (nested) rules take precedence for that subproject.
    - Global constraints in this root file still apply for:
        - Security.
        - Secrets handling.
        - Destructive operations.

---

## 13. Multi-agent / personas (if applicable)

If you are a specialized agent, follow your persona rules **in addition** to this file:

- `@dev-agent`:
    - focus on implementation and tests.
- `@test-agent`:
    - focus on test coverage and edge cases; do not change runtime code unless fixing flakiness.
- `@security-agent`:
    - focus on security review and hardening; minimize functional changes.

If rules conflict, security > correctness > convenience.

---

## 14. Definition of Done (checklist)

Before considering a task complete, ensure:

- [ ] Code compiles, and the project builds: `...`
- [ ] Tests pass: `...`
- [ ] Lint/format pass: `...`
- [ ] No constraints from section 10 are violated.
- [ ] New/changed behavior is covered by tests.
- [ ] Changes are documented (changelog/docs/PR description).
- [ ] No secrets or sensitive data added to the repo.

If any item is not satisfied, the task is **not done**.

Your goal

Using this template and the actual project information, generate a complete, fully concrete AGENTS.md that:
•	Is oriented to end users of this repository (people running AI coding agents here), not to developers of the AGENTS.md framework.
•	Contains no placeholders such as ..., "...", or similar.
•	Contains no “CUSTOMIZE” or TODO comments.
•	Is internally consistent, precise, and safe.

Available information

Use:
1.	The repository itself (file tree, package.json, scripts, configs, infra code, tests) to infer:
•	Project purpose.
•	Commands (install/dev/test/lint/build/migrations).
•	Repository structure and key entrypoints.
•	Technology stack (Node/TS versions, SST/CDK, etc.).
•	Testing layout and strategy.
2.	Any additional natural-language description of the project that is provided in the prompt.

If any critical information is completely missing and cannot be inferred from the repo, ask one focused clarification question, then proceed with a best-effort safe default.

Section-by-section requirements

For each section in the template:
•	0. Agent scope & identity
Keep the structure and wording, adjusting only if necessary to reflect the real repo context.
•	1. Project overview
Replace each ... with concrete, short bullet points:
•	What this repo does and for whom.
•	Main domains/bounded contexts.
•	Critical invariants (e.g. “licensing checks must never be bypassed”).
•	2. Environment & assumptions
Fill in:
•	Actual Node.js and TypeScript versions (from configs or engines or tsconfig).
•	The real package manager (pnpm / npm / yarn) that this repo uses.
•	Any local services that must be running (DBs, queues, emulators).
•	Keep the rule about not assuming internet access unless the product explicitly depends on it.
•	3. Setup & commands
For each command:
•	Map to concrete package.json scripts or Makefile/CLI commands.
•	If a command type doesn’t exist (e.g. no dev server), either:
•	omit that bullet entirely, or
•	provide a sensible explanation (e.g. “No dev server; use integration tests instead”).
•	Ensure the “Rule” paragraph stays and matches the commands you specify.
•	4. Repository & architecture map
Replace .../ and bullets with:
•	Actual top-level directories and their roles (backend, frontend, shared, infra, tests).
•	Key entrypoints (handlers, main app files, infra entry stacks).
•	5. Coding conventions
Fill in:
•	Style rules (quotes, semicolons, import/style preferences).
•	Error handling patterns (custom error types, result types, etc.).
•	Logging approach (which logger, what to avoid logging).
•	6. Testing strategy
Describe:
•	Where unit / integration / e2e tests live.
•	Which commands run each type of tests.
•	Any important patterns (e.g. naming conventions, fixtures).
•	7. Workflow rules
Adapt:
•	Branch naming patterns actually used (if obvious).
•	Commit message style (conventional commits or similar).
•	PR requirements (summary, risks, how-to-test instructions).
•	8. Safety, secrets & destructive operations
Make this section concrete and conservative:
•	Mention specific sources of secrets (.env, cloud secret managers, CI vars).
•	Clarify forbidden destructive actions relevant to this repo (dropping DBs, altering prod infra).
•	Keep the requirement to ask before destructive changes.
•	9. Tooling & integrations
Fill in:
•	Internal CLIs with their purposes and examples.
•	MCP tools or skills if present.
•	Cloud tooling (CDK, SST, Terraform, etc.) and when to use them.
•	10. Constraints / do-not-touch areas
State clearly:
•	Which API contracts are “frozen” and must not change without explicit instruction.
•	Which infra aspects are off-limits (network topology, IAM beyond scoped additions).
•	Which generated/vendor files must not be edited manually.
•	11. Performance & resource guidelines
Tailor:
•	Which parts of the code are performance-critical (e.g. hot paths, Lambda handlers).
•	Any known constraints (cold-start sensitivity, DB call limits).
•	Expectation to summarize trade-offs when touching those parts.
•	12. Monorepo & nested AGENTS.md
If the repo is a monorepo:
•	Explain how root and nested AGENTS.md files interact.
•	Clarify precedence and global constraints.
If it is not a monorepo, keep the rules but you may briefly note that nested files are not currently used.
•	13. Multi-agent / personas
If the system uses specialized agents:
•	Describe @dev-agent, @test-agent, @security-agent, etc., as appropriate.
If not, you can either:
•	keep the generic text, or
•	adapt it to a default single-agent scenario while preserving the safety ordering (security > correctness > convenience).
•	14. Definition of Done (checklist)
Replace ... with:
•	Concrete build/test/lint commands from section 3.
•	Any additional repo-specific criteria (docs updated, e2e run, etc.).

Output requirements
•	Output only the final AGENTS.md file content, as Markdown.
•	Do not include explanations, comments, or meta-text around it.
•	Ensure:
•	No ... remains anywhere in the file.
•	No “CUSTOMIZE”, “TODO” or similar markers remain.
•	All commands and paths you reference actually exist or are valid for this repository.
•	The result is coherent, minimal, and strictly oriented toward helping AI coding agents work safely and correctly in this repo.
