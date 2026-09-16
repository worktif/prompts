---
name: engineering-implementation
description: Implement an approved, scoped software change in an existing repository while preserving its contracts, ownership, lifecycle, failure semantics, and evidence trail; do not use for discovery-only, review-only, verification-only, deployment, or migration work.
---

# Engineering Implementation

Use this skill when the user has authorized an actual code, test, configuration, or documentation change and the change boundary is known. It turns a discovery record into the smallest correct repository change. It applies to application code, libraries, services, scripts, and tests; the repository's language and tooling remain the source of truth.

Do not activate for an explanation, exploration, architecture proposal, independent review, verification-only request, deployment/release operation, or data migration whose mutation and recovery plan have not been separately established. When a request combines implementation with one of those activities, this skill owns construction of the change; the corresponding core skill owns its separate activity.

Read [references/source-index.md](references/source-index.md) when a decision depends on the documented type-system, DDD, HTTP, error-format, or cancellation rationale. The references are decision support, not a replacement for repository evidence or a universal coding standard.

## Authority, scope, and responsibilities

Use this order of authority:

1. The user's explicit request and acceptance criteria.
2. Repository `AGENTS.md`, manifests, architecture documentation, public contracts, source, tests, and CI configuration.
3. The discovery handoff and decisions made during the current task.
4. External references, only for general semantics or a source explicitly named by the task.

Before editing, record or recover:

- the goal and in-scope behavior;
- selected files and the existing abstraction that owns the behavior;
- inputs, outputs, invariants, compatibility expectations, and acceptance criteria;
- current worktree changes that belong to the user;
- assumptions, unresolved questions, failure modes, and the cheapest sufficient checks.

If the discovery handoff conflicts with current repository evidence, pause implementation at the conflict, explain it, and resolve the ownership or scope question. Do not silently implement against stale assumptions.

This skill is responsible for:

- extending the existing dependency, state, lifecycle, and orchestration path;
- preserving or deliberately changing the public contract within the approved scope;
- translating untrusted inputs at system boundaries into validated internal values;
- keeping domain decisions, side effects, and adapters at the correct ownership boundary;
- making timeout, cancellation, retry, idempotency, cleanup, and error behavior explicit when applicable;
- documenting public and non-obvious behavior accurately;
- adding the focused regression coverage and seams needed for verification;
- reporting exactly what changed and what remains unverified.

It is not responsible for independently approving its own work, declaring deployment success, or replacing the repository's release, migration, security, or verification process.

## Mandatory controls

The implementation is not complete unless all applicable controls below are satisfied or explicitly reported as blocked/skipped with a reason.

1. **Scope and ownership.** Extend the existing abstraction and dependency flow. Add a new abstraction only after confirming that no existing owner can express the behavior or that the existing owner is demonstrably insufficient. Do not create a second execution path, state model, cache, lifecycle, or orchestration layer for the same responsibility.
2. **Contract preservation.** Preserve public names, signatures, wire formats, error meanings, default behavior, and lifecycle guarantees unless the request explicitly authorizes a change. If compatibility changes, identify each affected consumer and update the contract, tests, and migration/documentation requirements that are in scope.
3. **Boundary validation.** Treat data from a user, file, network, process, plugin, database, environment, or untyped library as untrusted until it has been parsed and validated. A static type annotation, cast, non-null assertion, or deserialization call alone is not runtime validation.
4. **Failure semantics.** Every fallible boundary must have an intentional outcome for failure. Do not swallow errors, turn an unknown result into success, or silently convert cancellation into a generic failure. Preserve useful causal information without exposing internal details through a public boundary.
5. **Lifecycle and cleanup.** Every acquired resource, listener, timer, lock, subscription, temporary file, transaction, or child process must have an owner and a cleanup path for success, failure, cancellation, and partial initialization. Cleanup must be safe when invoked more than once if the surrounding lifecycle can race or repeat it.
6. **Evidence.** Run the relevant repository checks, inspect the final diff, and report exact commands and outcomes. Separate repository facts, implementation decisions, assumptions, skipped checks, and unverified external/deployment behavior.

## Decision rules

### Choose the change seam

- Trace the changed behavior from input to output, including state transitions, dependency direction, side effects, error paths, and lifecycle boundaries.
- Prefer a narrow seam that can be tested without real external systems. Inject or adapt an existing boundary when the repository already has a seam; do not introduce a new framework or service locator merely to make a test convenient.
- Keep pure transformations and domain rules independent of I/O where the current architecture supports that separation. Do not force a clean-architecture rewrite into a localized change.
- Preserve user-owned unrelated changes. Never reset, overwrite, or reformat unrelated files to simplify the patch.

### Model contracts with the strongest local mechanism

Use the project's language and compiler settings; do not change them just to suppress an implementation error.

For TypeScript or JavaScript:

- At a boundary, use `unknown` or the equivalent raw representation, validate it, and only then construct the internal type. Keep any unavoidable `any` or assertion narrow, justified, and contained at the adapter.
- Use a discriminated union and exhaustive handling when the set of variants is closed and the repository can update all producers/consumers together. Use an open extension strategy when variants are owned by independent producers; do not fake exhaustiveness with an unsafe default.
- Treat `strict` and related compiler checks as evidence that improves static guarantees, not proof that runtime inputs, side effects, concurrency, or external systems are correct.
- Make invalid combinations unrepresentable when doing so does not break the existing public contract. Otherwise preserve the contract and validate at the boundary.

For other languages, apply the strongest equivalent type, schema, parser, and compiler mechanisms already supported by the project. Do not import TypeScript-specific patterns into a different language without a concrete benefit.

### Keep domain meaning coherent

Use domain-driven design concepts only when the code has meaningful domain rules, competing vocabularies, or explicit context boundaries:

- Keep a domain model internally coherent within its existing bounded context.
- Translate between contexts at an explicit boundary rather than sharing a type merely because its fields look similar.
- Put a rule with the state and language that own it; keep an application service focused on coordination and an adapter focused on translation/I/O where those roles exist in the repository.
- Do not create entities, value objects, aggregates, repositories, or domain services as ceremony for a simple transformation. A named pattern is justified only by the concrete ownership, consistency, lifecycle, construction, or extensibility problem it solves.

DDD is a modeling option, not a requirement for every codebase or a guarantee of correctness.

### Decide side-effect and retry behavior

For each process, network, storage, queue, or other fallible boundary, write down the operation's observable effect and its unknown-outcome behavior before adding retries.

| Situation | Required implementation decision |
| --- | --- |
| Pure/local deterministic work | Return or report the local error. Do not add retries that only hide a programming error. |
| Read-only or explicitly idempotent operation | A bounded retry may be used for classified transient failures if the repository/client contract supports it. Keep the attempt limit and delay policy observable and testable. |
| State-changing operation with an idempotency key, deduplication, or equivalent proof | Retry only through that contract; verify the deduplication scope and what response is returned for a repeated request. |
| State-changing operation with unknown application outcome | Do not blindly retry. Reconcile, query an authoritative status, use an approved deduplication mechanism, or surface an explicit ambiguous outcome. |
| Validation, authorization, invariant, or deterministic conflict failure | Do not retry unless the domain contract explicitly says the condition can change and defines the retry boundary. |
| Timeout or cancellation | Decide whether the caller stops waiting, whether the underlying operation is actually interrupted, and how an already-applied side effect is discovered. Never equate timeout with rollback. |

Retries must be bounded. Backoff, jitter, server hints, rate limits, and concurrency limits are optional mechanisms selected from the existing client/operation contract; they are not universal defaults. For HTTP, do not infer retry safety from a method name alone when the application semantics make a non-idempotent operation repeatable or a nominally safe operation unsafe; document the actual contract.

### Define cancellation and cleanup

Cancellation is a control signal, not evidence that work has been undone. The implementation must specify:

- how cancellation enters the operation;
- whether it is observed before work, between attempts, during I/O, and during long loops;
- what error/result identifies cancellation;
- which resources and child operations are stopped;
- whether the caller may retry or must reconcile an unknown outcome.

For an API using `AbortSignal` or an equivalent signal, handle an already-cancelled signal before registering work, propagate the signal to cancellable dependencies, remove listeners or use the platform's one-shot facility after completion, and ensure late aborts cannot mutate completed state. Do not claim that a signal cancels an underlying dependency unless that dependency's API supports it.

### Design errors at the right boundary

- Use the repository's existing error/result contract. Prefer stable machine-readable categories or codes plus safe human context when callers need to branch on failure.
- Preserve the original cause or diagnostic context for internal handling when the language supports it; do not leak credentials, tokens, private data, stack traces, or implementation topology through a public response.
- Translate infrastructure errors at the adapter/application boundary; do not make domain code depend on a vendor-specific exception unless the domain contract truly owns it.
- If the boundary is HTTP, preserve the semantics of the status code and existing error format. Use Problem Details only where it fits the API; it is an interface format, not a debugging dump and not a reason to replace an established domain-specific format.
- Do not return a successful value with missing, defaulted, or partially applied data unless that behavior is part of the existing contract and is tested.

### Preserve state and lifecycle invariants

Make these invariants explicit in code or tests when applicable:

- one authoritative owner determines mutable state and valid transitions;
- a published terminal result is immutable, and late callbacks/events cannot publish another result or mutate completed state;
- every resource acquisition has one corresponding release/close path, including partial initialization;
- retrying cannot create a second externally visible effect unless the contract proves idempotency or deduplication;
- cancellation stops or detaches the owned work according to the contract, but does not masquerade as rollback;
- a value crosses from untrusted to trusted representation only through the validation gate;
- public documentation describes actual behavior, including errors, side effects, lifecycle, and invariants.

Do not assert an invariant merely because a type or test name suggests it; prove it through control flow, runtime checks, or a meaningful test.

## Implementation workflow

1. **Reconcile the handoff.** Read the repository instructions and current diff. Confirm the goal, selected files, owner, constraints, acceptance criteria, and applicable optional skills. If the handoff is absent or stale, perform bounded discovery before editing.
2. **Trace the contract.** Identify callers/producers, consumers, state owner, side-effect boundaries, public/wire formats, lifecycle, and failure paths. Record any unknown that can change architecture, data safety, or compatibility.
3. **Choose the smallest seam.** Extend the existing abstraction. Decide which code is pure, which code translates/validates, and which code owns I/O or lifecycle. Write the changed behavior and non-obvious invariants in implementation terms before coding.
4. **Implement the normal path.** Keep control flow and naming consistent with the repository. Use the strongest local types and runtime validation. Avoid speculative abstractions, unrelated cleanup, and silent behavior changes.
5. **Implement failure and lifecycle paths.** Handle malformed input, empty/boundary values, dependency failure, partial initialization, timeout, cancellation, retry, duplicate delivery, concurrency, and cleanup cases that the operation can actually encounter. Add only the cases relevant to the changed boundary; do not manufacture unsupported scenarios.
6. **Update the contract surface.** Update public types, schemas, error mappings, configuration, migration notes, and accurate JSDoc/docstrings only as required. Keep comments focused on rationale, ownership, lifecycle, or invariants that are not obvious from the code.
7. **Add focused regression coverage.** Test observable behavior and contracts at the narrowest meaningful layer. Add a seam or fixture when needed; do not weaken production behavior or assertions just to make a test pass.
8. **Verify and inspect.** Run the smallest relevant checks first, then the repository-defined type, lint/format, build/package, and test commands required by risk. Inspect the complete diff for accidental API changes, duplicate logic, dead code, swallowed errors, unsafe defaults, inaccurate documentation, and unrelated edits.
9. **Report the handoff.** Provide changed files and reasons, implementation facts, exact checks and results, skipped checks with reasons, assumptions, unverified external/deployment boundaries, and remaining risks. Do not claim deployment, production behavior, or exhaustive correctness without evidence.

## Common failure modes and required response

| Failure mode | Required response |
| --- | --- |
| New helper/service duplicates an existing owner | Stop, trace ownership, and extend or replace the existing path only with explicit scope. |
| Type cast/assertion accepts external data | Move parsing/validation to the boundary; add malformed-input coverage. |
| `any`, non-null assertion, or broad default hides a real state | Narrow the value or document a contained, justified exception; never use it to silence an unresolved contract. |
| Retry duplicates a write or masks an unknown outcome | Remove blind retry; add idempotency/deduplication or reconciliation, or return an explicit ambiguous result. |
| Timeout is treated as rollback | Separate caller wait termination from operation state; define reconciliation and recovery. |
| Abort/cancel listener or timer survives completion | Make registration/removal part of the lifecycle and test repeated completion/cancellation. |
| Error is swallowed, reclassified incorrectly, or exposes internals | Preserve cause internally, map only at the owned boundary, and test the public error contract. |
| State is updated after completion or from two owners | Establish one owner and guard terminal transitions; test late and concurrent signals. |
| Comment promises behavior not implemented | Rewrite or remove it; documentation is part of the contract and must be verified against code. |
| Green local check is presented as deployment proof | Report local/test-environment evidence separately from deployment or production evidence. |

## Verification and acceptance criteria

The implementation handoff is acceptable only when:

- the approved behavior exists in the existing ownership/dependency path;
- the diff is minimal and unrelated user changes are preserved;
- public and wire contracts are unchanged or every intentional change is identified;
- applicable untrusted inputs are runtime-validated before use;
- applicable error, timeout, cancellation, retry, idempotency, duplicate, concurrency, and cleanup semantics are defined and covered;
- changed domain rules and boundary translations have focused behavioral tests or a documented, evidence-based reason a test is not feasible;
- public/non-obvious API documentation matches the implementation;
- relevant repository checks were run and their exact outcomes are reported;
- the remaining assumptions and unverified boundaries are visible.

Optional recommendations—not gates unless the repository or task requires them—include property/fuzz testing for broad input spaces, mutation testing for high-value invariants, additional contract/E2E coverage for cross-component risk, and stricter compiler/linter settings adopted as a separately justified change.

## Interaction with the four core skills

| Core skill | Owns | Implementation boundary |
| --- | --- | --- |
| `engineering-discovery` | Repository investigation, scope, architecture, ownership, constraints, risks, and acceptance criteria before change | Consume its handoff. Re-open discovery when current evidence contradicts it; do not edit through an unresolved architectural or data-safety conflict. |
| `engineering-implementation` | The approved patch, contract-preserving construction, lifecycle/error behavior, focused regression changes, and implementation evidence | This skill does not replace discovery, independent review, or full verification. |
| `engineering-verification` | Risk-based test design, repository checks, failure/boundary coverage, and completion verification | Provide testable seams and focused tests; run or hand off the required checks with exact results. Never mark a behavior correct solely because implementation checks are green. |
| `engineering-review` | Independent inspection and PASS/FAIL verdict on the actual diff, compatibility, architecture, security, failure modes, and scope | Treat review as independent. Implement accepted corrections, then request/re-run review as required; do not self-approve or rewrite findings into assumptions. |

When the task explicitly invokes an optional domain skill, keep that skill's domain constraints in force while this skill owns code construction. If constraints conflict, surface the conflict rather than silently weakening either contract.

## Evidence and reporting format

Use a compact report with these labels:

- **Changed:** absolute or repository-resolvable file paths and the reason for each change.
- **Implemented:** observable behavior and contract/lifecycle decisions, stated as facts supported by the diff.
- **Validated:** exact commands/checks, result, and relevant scope.
- **Skipped:** exact check not run and why; include environment or authorization blockers.
- **Assumptions:** decisions not established by repository or user evidence.
- **Unverified:** external services, deployment state, production traffic, migrations, or other boundaries not exercised locally.
- **Risks:** remaining failure modes and the next bounded verification or follow-up.

Use `PASS` only when the applicable acceptance criteria and checks are actually satisfied. Otherwise report the incomplete or blocked state plainly; do not convert uncertainty into a success claim.
