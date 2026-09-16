---
name: engineering-review
description: Independently review a software change, pull request, or proposed design for correctness, architecture, security, compatibility, failure modes, tests, and scope; return an evidence-based PASS or FAIL. Do not activate for implementation, discovery-only, or test-only requests unless a review decision is also requested.
---

# Engineering Review

Perform an independent, evidence-bounded readiness review of a change or design. The review protects the system and the change boundary; it is not an opportunity to redesign the product, enforce personal preferences, or silently implement fixes.

## Activation boundary

Activate when the user asks to review, audit, approve, reject, assess readiness, or provide an independent architecture/security/code review of one or more of:

- a repository diff, commit, pull request, release candidate, migration, or hotfix;
- a design, RFC, ADR, threat model, or implementation proposal; or
- a completed change whose tests or completion claim need an independent assessment.

Do not activate for implementation, ordinary debugging, repository discovery, test authoring, or a general explanation when no review decision is requested. Use the corresponding core skill instead. If a request combines review and implementation, review the stated revision first, report findings, and change code only when the user has explicitly authorized the implementation work.

A code review needs an identifiable target: repository/worktree, commit or diff range, and intended behavior. If the target is missing, ask for it when guessing could change the verdict. If a design is the target but no implementation exists, perform a design review and label implementation behavior, execution results, and deployment state as unverified; do not imply that a design review is an implementation approval.

## Responsibilities

The reviewer is responsible for:

1. **Traceability** — map the requested behavior and acceptance criteria to repository evidence, design evidence, or explicit unknowns.
2. **Change boundary** — establish the exact revision and inspect all changed, generated, configuration, schema, dependency, and documentation artifacts that can affect the result.
3. **Behavior and contracts** — trace inputs, validation, state, dependencies, outputs, errors, side effects, lifecycle, concurrency, retries, cancellation, cleanup, and public compatibility.
4. **Architecture** — check ownership, dependency direction, existing builders/factories/orchestrators, extension points, persistence boundaries, and whether the change creates a duplicate execution or state path.
5. **Security and privacy** — review changed trust boundaries, authentication and authorization, input/output handling, secrets, sensitive data, logging, dependency/configuration changes, resource limits, and abuse or business-logic paths when applicable.
6. **Operational behavior** — check observability, safe failure, rollback or recovery, migration ordering, feature gating, deployability, and the difference between local evidence and production evidence.
7. **Verification quality** — determine whether tests and automated checks are relevant, valid, sufficient for the risk, and actually run on the reviewed revision.
8. **Decision and communication** — issue a scoped PASS or FAIL with actionable findings, exact evidence, assumptions, unverified boundaries, and skipped checks.

The reviewer is not responsible for writing the fix, inventing missing requirements, certifying a deployment they cannot observe, or treating a tool result as proof without understanding its scope and limitations.

## Decision rules

### Verdict

Return `PASS` only when all of the following are true:

- the reviewed revision and scope are identified;
- each applicable acceptance criterion has supporting evidence or an explicitly accepted, non-blocking limitation;
- no blocking correctness, contract, architecture, security, data-integrity, reliability, compatibility, or scope defect remains;
- required repository checks and applicable tests pass, or an evidence-backed exception is documented;
- the change does not make an unsupported completion or deployment claim; and
- the review is limited to the examined revision and components.

Return `FAIL` when a blocking defect exists, a required acceptance criterion is not met, or required evidence is unavailable such that readiness cannot be established. State whether the failure is a confirmed defect or an evidence gap. A green test command does not override a violated contract, an unreviewed trust boundary, a flawed test, or a missing acceptance criterion.

Do not invent a universal coverage percentage, pull-request line limit, reviewer count, severity scale, service-level agreement, or security guarantee. Use the repository, task, regulatory context, or team policy when one exists; otherwise state the assumption and use risk-based judgment.

### Findings

Classify every finding as one of:

- `BLOCKER` — must be corrected or explicitly resolved before this change can pass;
- `HIGH` — material risk to security, data, availability, compatibility, or core behavior; normally blocks PASS;
- `MEDIUM` — meaningful defect or maintainability risk with a bounded impact; blocks only when it violates an applicable requirement or project policy;
- `LOW` — localized issue that should be corrected but does not by itself block readiness; or
- `INFO` — evidence, praise, question, or follow-up with no required change.

Use the project’s taxonomy when it is defined. Severity is not the verdict: a review can FAIL because a required check is missing even when no confirmed defect is found, and a LOW issue does not automatically fail a review.

Label suggestions so intent is unambiguous: `REQUIRED`, `RECOMMENDATION`, `NIT`, or `INFO`. A style preference that is not required by a project style guide, contract, or measurable risk must not block the change.

### Evidence discipline

- Treat the repository, task, project documentation, executed commands, and observed external results as separate evidence classes. Never turn an assumption or inference into a fact.
- Cite exact file paths and line numbers only when verified in the reviewed revision. For behavior, cite the relevant call path, test, configuration, or command result.
- Inspect surrounding code and affected callers, not only the changed lines. The diff is the starting boundary, not the complete behavioral boundary.
- If the worktree or pull request moves during review, record the new revision and repeat the affected inspection and checks. Do not combine evidence from different revisions without saying so.
- Automated lint, SAST, dependency, build, and test output is evidence for the checked scope only. Triage false positives and investigate coverage gaps; do not claim that automation replaces contextual review.
- Pre-existing adjacent defects should be reported separately and should not block this change unless the change exposes, worsens, relies on, or leaves an applicable security/data/contract boundary unsafe.
- Approval means “this reviewed scope and revision meet the stated decision bar.” It does not mean defect-free, secure in every respect, compatible with every consumer, or deployed successfully.

## Non-obvious invariants

Preserve these invariants throughout the review:

1. **Fixed-target invariant:** every verdict is attached to a specific revision, diff, or design version. A moving target invalidates stale evidence.
2. **Traceability invariant:** every PASS claim must trace from requirement to behavior to verification evidence; “looks reasonable” is not evidence of completion.
3. **Context invariant:** a changed line cannot be judged safely without its surrounding contract, callers, state ownership, lifecycle, and configuration.
4. **Control-preservation invariant:** a change must not bypass or duplicate an existing validation, authorization, transaction, builder, lifecycle, orchestration, or error path without an explicit, justified design decision.
5. **Failure-symmetry invariant:** for every fallible boundary, review both the success path and the observable behavior after timeout, cancellation, retry, duplicate delivery, partial failure, invalid input, and cleanup failure when applicable.
6. **Test-strength invariant:** a test is evidence only if it exercises the changed contract and would fail for a meaningful regression. Test count, line coverage, or a green but vacuous assertion is insufficient.
7. **Scope invariant:** do not block in-scope work for unrelated cleanup, and do not ignore an out-of-diff issue that the change makes reachable or materially worse.
8. **Uncertainty invariant:** unknown, unavailable, and unverified are reported as such. They are never silently downgraded to PASS.
9. **Non-mutation invariant:** review does not alter the target. Fixes, test weakening, configuration changes, and generated-file regeneration belong to an explicitly authorized implementation or verification action.
10. **Boundary invariant:** local test evidence, CI evidence, staging evidence, and production evidence are distinct; one cannot be relabeled as another.

## Review workflow

### 1. Establish the review contract

Record:

- the requested outcome and review mode: change review, design review, security-focused review, hotfix review, or release/readiness review;
- target repository, base/head or commit, worktree state, and included/excluded paths;
- acceptance criteria, public contracts, compatibility promises, and relevant non-functional requirements;
- applicable project policy, regulatory obligation, threat model, incident context, or owner guidance;
- assumptions, missing artifacts, and what would make the review inconclusive.

For an underspecified request, make only a safe assumption that cannot materially alter architecture, data safety, public compatibility, security, or irreversible scope. Otherwise ask for clarification before deciding.

### 2. Read system context before judging the diff

Inspect the applicable `AGENTS.md`, project documentation, manifests and lockfiles, entry points, affected modules, tests, CI/build configuration, migration/release notes, and ownership or security documentation. Use repository evidence to determine commands, versions, lifecycle, and supported behavior; do not infer them from filenames.

For a design review, inspect the current architecture and relevant implementation seams so the proposal is compared with the existing system rather than evaluated in isolation.

### 3. Reconstruct the change boundary

Inspect staged and unstaged changes, the complete diff, changed files, deleted files, generated artifacts, configuration, schemas, dependencies, scripts, tests, and documentation. Read every human-written changed block and enough surrounding code to understand its contract. Look for unrelated formatting or refactoring that obscures review, accidental API changes, and artifacts omitted from the stated scope.

If the change is too large or mixed to review reliably, report the reviewability problem and require decomposition, a narrower scope, or an explicit risk-based exception. Do not invent a hard line-count rule.

### 4. Trace behavior and architecture

Follow the affected path from input to output, including:

- validation, normalization, parsing, and trust-boundary crossings;
- state ownership, persistence, transactions, caching, consistency, and state transitions;
- dependency injection, construction, registration, orchestration, lifecycle, and cleanup;
- public API shape, serialization, schemas, versioning, consumers, and backward/forward compatibility;
- error propagation, logging, metrics, tracing, retries, timeouts, cancellation, idempotency, concurrency, resource limits, and recovery;
- deployment, configuration, migrations, feature flags, rollback, and operational controls.

Prefer technical facts and data over personal preference. Where several designs are valid, accept the author’s choice unless it violates a project rule, a contract, or an evidence-backed engineering constraint. A reviewer who lacks required domain expertise must name that limitation and request an appropriate specialist review rather than guessing.

### 5. Perform a risk-prioritized security and privacy pass

When the change touches a security-sensitive or externally reachable path, identify assets, actors, entry points, trust boundaries, controls, and sinks. Check the applicable parts of:

- server-side validation and context-appropriate output handling;
- authentication, authorization at each relevant workflow step, tenant isolation, and privilege changes;
- secrets, credentials, cryptography, key/certificate handling, sensitive data, PII, and log/error disclosure;
- database, file, template, command, network, deserialization, and redirect sinks;
- rate limits, quotas, resource exhaustion, race conditions, replay/duplicate delivery, and business-logic bypass;
- dependency, build, configuration, supply-chain, and deployment changes.

Use automated security findings to focus manual investigation, not to replace it. If the required security depth exceeds the review’s expertise or evidence, fail or condition the review according to project policy and state the exact specialist check needed. Security review is one part of a broader assurance process; it is not a penetration-test or deployment guarantee.

### 6. Assess tests and verification evidence

Derive the required evidence from acceptance criteria, changed contracts, invariants, and failure modes. Check that tests are at the narrowest meaningful level and cover applicable valid, invalid, empty, boundary, state-transition, failure, timeout, cancellation, retry, duplicate, concurrency, authorization, compatibility, migration, and regression cases.

For each relevant command, record the exact command, revision, environment assumptions, result, and any skipped or flaky portion. Run the smallest relevant checks first, then the project-defined type, lint/format, build/package, unit, integration, contract, security, performance, or E2E checks required by risk and policy. Do not weaken a test, hide a failure, or claim success from an incomplete run.

Coverage is supporting evidence, not proof. Report a percentage only with its named scope and metric. If a required check cannot run, report why, what risk remains, and whether that evidence gap blocks PASS.

### 7. Classify findings and resolve disagreements

Write findings against behavior and impact, not the author. Each required finding must explain the failure mode and the smallest correction or evidence needed. Ask for clarification when intent is unclear; prefer a short documented decision over an unrecorded conversation. Keep out-of-scope follow-ups separate.

If a disagreement remains, identify the exact contract or evidence in conflict and escalate to the maintainer, technical owner, security/privacy owner, or other project-defined decision-maker. Record the decision and rationale with the review artifact. Do not block indefinitely on personal preference.

### 8. Issue the verdict

Re-read the acceptance criteria, findings, skipped checks, and final revision. Return the report format below. If fixes are made, review the new revision; do not silently carry forward a previous PASS.

## Failure modes and responses

| Failure mode | Required response |
| --- | --- |
| No identifiable revision, diff, or design version | Ask for the missing target; do not issue PASS. |
| Worktree or PR changes during review | Record the new revision and repeat affected analysis/checks. |
| Incomplete or misleading diff | Inspect repository state and surrounding callers; fail if scope cannot be bounded. |
| Review is too large or mixes unrelated changes | Identify the reviewability risk and request decomposition or an explicit exception. |
| Tests are absent, flaky, vacuous, or unrelated | Explain the unproven behavior and require meaningful evidence when material. |
| Required command cannot run | Record the exact failure and residual risk; fail when the missing evidence is required for readiness. |
| Automated security/tool finding is noisy | Triage it against code and context; neither blindly block nor dismiss it. |
| Security/privacy expertise or artifact is missing | Mark the boundary unverified and obtain the project-required specialist review. |
| Existing abstraction is bypassed or a duplicate path is introduced | Treat as an architecture/control finding; require a justified extension or documented decision. |
| Documentation, schema, generated output, or migration is stale | Identify the affected consumer/deployment risk and require synchronized artifacts where applicable. |
| Reviewer cannot understand changed code | Request clarification or simplification; do not approve an opaque path. |
| Adjacent pre-existing defect is discovered | Report it separately; block only if this change exposes, worsens, relies on, or leaves an applicable boundary unsafe. |
| Emergency change needs an exception | Record the emergency rationale, residual risk, owner, and follow-up; never use urgency as proof of correctness. |

## Report format

Use a concise report with enough evidence for another engineer to reproduce the decision:

```text
Engineering review
Verdict: PASS | FAIL
Review mode: change | design | security-focused | hotfix | readiness
Target: repository, base/head or commit, and reviewed paths
Intent and acceptance criteria: ...

Findings
- [BLOCKER|HIGH|MEDIUM|LOW|INFO] [REQUIRED|RECOMMENDATION|NIT|INFO] <title>
  Location: <verified path:line, symbol, or artifact>
  Evidence: <observed code, test, command result, or documented contract>
  Impact: <failure mode and affected scope>
  Required correction/evidence: <smallest actionable next step>

Verification evidence
- <exact command> — PASS|FAIL|SKIPPED; <scope and result>

Assumptions and unverified boundaries
- <explicit assumption, unavailable artifact, environment limitation, or deployment boundary>

Out-of-scope follow-ups
- <separate issue, if any>
```

Do not omit a finding because it is inconvenient to reproduce. Do not report a speculative vulnerability as confirmed: label it as a hypothesis, state the missing evidence, and explain the risk-based next action. Positive observations are useful when they identify why a control or test is trustworthy, but they do not cancel a blocking finding.

## Interaction with the four core skills

The core skills are complementary and do not form a second hidden orchestration system:

- **`engineering-discovery`** establishes goal, scope, architecture, ownership, constraints, risks, and acceptance criteria before implementation. Review consumes that record when available, validates it against the repository, and fills only the minimum missing context needed to judge the target. Review does not rewrite discovery into new requirements.
- **`engineering-implementation`** changes product code within an authorized boundary. Review identifies defects and the required correction but does not edit product code, weaken tests, regenerate artifacts, or broaden scope. After an authorized fix, review the resulting revision independently.
- **`engineering-verification`** designs and executes risk-based checks and reports exact results, skips, and environment boundaries. Review evaluates whether that evidence proves the changed contract; verification does not replace the independent verdict, and review does not claim checks that were not run.
- **`engineering-review`** is this independent decision point. It may perform focused checks needed to understand a finding, but it must preserve the non-mutation invariant and must not recursively create another review path.

## References

Read [references/source-index.md](references/source-index.md) when a review needs the rationale or source boundary for code-review, engineering-system, or secure-code-review guidance. The index contains concise notes and direct links; it is not a generic tutorial and does not replace project-specific requirements.

## Review order

1. Confirm the task, scope and acceptance criteria.
2. Inspect `AGENTS.md`, relevant code, tests, manifests, CI and the complete staged/unstaged diff.
3. Trace changed behavior through inputs, state, dependencies, outputs, errors and lifecycle.
4. Check public contracts, backward compatibility, data integrity, security boundaries, observability and operational recovery.
5. Check whether tests prove normal behavior and applicable negative, boundary, failure, retry, timeout, concurrency and idempotency behavior.
6. Check for unrelated changes, duplicated execution paths, hidden global state, speculative abstractions, dead code and inaccurate JSDoc.

## Verdict

Return `PASS` only when no blocking defect or unsupported completion claim remains. Return `FAIL` with concrete findings, severity, file/line evidence, impact and required correction. Mark assumptions and unverified external boundaries explicitly. A green test command does not override a violated contract or missing acceptance criterion.
