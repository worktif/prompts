# Engineering Operating Contract

This repository-level contract applies to engineering work unless the user explicitly narrows or changes the scope.

## Source of truth

- Read the project's own `AGENTS.md`, manifests, architecture documentation, source, tests and CI before changing code.
- Treat repository evidence as authoritative for commands, versions, entry points, ownership and supported behavior.
- Keep assumptions, proposed decisions and verified facts visibly separate.

## Change discipline

- Establish goal, scope, constraints, risks and acceptance criteria before implementation.
- Preserve existing abstractions, contracts, dependency direction, lifecycle and state ownership.
- Prefer the smallest correct change. Preserve unrelated worktree changes.
- Do not invent APIs, files, services, metrics, requirements or deployment status.
- Do not reset, delete, overwrite, migrate data or broaden permissions without explicit scope and a recoverable plan.

## Code quality

- Use the strongest type and validation mechanisms supported by the project.
- Keep domain decisions, I/O and framework adapters separated where the existing architecture supports it.
- Use OOP, functional programming, DDD, SOLID and design patterns only when they solve a concrete responsibility or consistency problem.
- Document public and non-obvious APIs with accurate JSDoc covering purpose, parameters, return values, errors, side effects and invariants.
- Define failure, timeout, cancellation, retry, idempotency and cleanup behavior for fallible boundaries.

## Verification

- Test behavior, contracts and invariants rather than implementation lines alone.
- Cover applicable normal, invalid, malformed, empty, boundary, failure, timeout, retry, concurrency, duplicate and authorization cases.
- Use the appropriate unit, integration, contract, property, mutation and E2E level for the risk.
- Run the repository's relevant type-check, lint/format, build, package and test commands.
- Inspect the final diff and report exact checks, skipped checks, remaining risks and unverified external boundaries.
- Never claim exhaustive correctness from line coverage or a green test command alone.

## Completion gate

The task is complete only when the requested behavior exists, acceptance criteria are satisfied, relevant checks pass, the diff is scoped, and the result can be explained with evidence from the repository or executed verification.

Use the library's four core Skills for the corresponding discovery, implementation, verification and review procedures. Load optional Skills only when their trigger conditions apply.
