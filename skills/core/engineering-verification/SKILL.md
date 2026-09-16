---
name: engineering-verification
description: Establish and execute evidence-based verification for software changes or release claims, from requirements and risk through test selection, failure analysis, and an explicit completion report; do not use for feature design, implementation, or generic testing tutorials.
---

# Engineering Verification

Determine whether a scoped software change satisfies its stated contract and acceptance criteria. Verification is an evidence-producing activity: a green command is one observation, not a guarantee that the system is defect-free.

This skill is vendor-neutral. Treat ISO/IEC/IEEE 29119 and ISTQB terminology as reference vocabulary and process guidance, not as an automatic claim of compliance or a universal release gate. Read [references/source-index.md](references/source-index.md) when terminology, source provenance, or a vendor-specific example matters.

## Activation boundaries

Use this skill when the request involves one or more of the following:

- validating a code or configuration change against requirements, contracts, risks, or acceptance criteria;
- designing or extending tests as part of a scoped change;
- running repository checks before declaring work complete;
- investigating a failed, flaky, skipped, empty, or misleading test run;
- assessing release evidence, regression evidence, or post-deployment behavior.

Do not use it as the primary skill for:

- discovering repository architecture, ownership, scope, or acceptance criteria; use `engineering-discovery`;
- implementing production behavior or changing an API; use `engineering-implementation`;
- independently approving or rejecting a change; use `engineering-review`, which may consume this skill's evidence;
- generic testing education detached from a real change or repository.

If the request combines these activities, preserve the handoff boundaries below rather than silently taking ownership of the other skill's responsibility.

## Responsibilities

The verification agent owns:

1. Translating the stated scope into observable verification claims.
2. Identifying the test basis, expected-result source (test oracle), risk, and applicable test level for each claim.
3. Selecting the narrowest meaningful check and adding a cross-boundary check when a lower-level check cannot prove the claim.
4. Preparing a safe, representative test environment and data without changing production state unless explicitly authorized.
5. Executing repository-defined checks, preserving exact outcomes and artifacts.
6. Investigating failures enough to classify them as product, test, environment, infrastructure, or unresolved; never silently converting one class into another.
7. Reporting what the evidence establishes, what it does not establish, and the residual risk.

The agent does not own requirements interpretation, production implementation, defect fixing, deployment approval, or a claim of exhaustive correctness.

## Mandatory controls and optional recommendations

### Mandatory controls

- Establish the change boundary and acceptance criteria from repository and task evidence before deciding that verification is complete.
- Record a test basis and an oracle for every pass/fail claim. If the expected behavior is ambiguous or no trustworthy oracle exists, mark the claim unresolved or inconclusive; do not invent an expected result.
- Ensure asynchronous work, callbacks, subprocesses, retries, and cleanup are actually awaited or otherwise observed before declaring a test complete.
- Detect and report zero-test discovery, filtered-out scope, disabled checks, skipped tests, and fail-open commands as non-passing evidence.
- Run the repository's documented or configured checks at the smallest useful scope first, then broaden according to risk and acceptance criteria.
- Preserve the first failure and its environment when retrying. A retry can supply diagnostic evidence but cannot erase the initial failure or prove determinism.
- Report exact commands, scope, result, skipped/blocked checks, relevant environment/configuration, and artifact locations. Separate local, CI/test-environment, staging, and post-deployment evidence.
- Keep test data isolated and reversible. Do not use live or shared destructive data without explicit authorization and a recovery plan.

### Optional recommendations

Use these only when their cost and risk justify them:

- property-based, fuzz, mutation, model-based, differential, metamorphic, exploratory, performance, accessibility, resilience, or security testing;
- coverage thresholds, repeated runs, sharding, parallel execution, traces, screenshots, videos, or structured test reports;
- independent review of high-impact or difficult-to-oracle results;
- a test-only fixture, harness, or helper that removes a real observability or isolation gap.

An optional technique never substitutes for a missing oracle, an unmet acceptance criterion, or a failing mandatory check.

## Decision rules

### 1. Basis and oracle before execution

For each claim, identify:

- **test basis:** the requirements, contract, design, risk assessment, model, invariant, migration rule, user workflow, or other source from which the claim is derived;
- **observable:** the output, state, event, side effect, timing, resource behavior, or error to inspect;
- **oracle:** the trusted rule, specification, independent calculation, invariant, approved baseline, reference implementation, or human judgment used to determine the expected result;
- **evidence:** the test, command output, report, trace, log, or inspection that records the observation.

Do not use the implementation under test as its own independent oracle. If a reference implementation shares the same defect or assumptions, label the result as limited differential evidence rather than proof. For nondeterministic or probabilistic behavior, define an explicit tolerance, distributional property, rubric, or invariant and report its limits.

### 2. Risk determines depth, not habit

Prioritize verification by plausible impact and uncertainty. Increase independence, environment fidelity, data realism, negative-path coverage, repeatability, and recovery testing for changes involving:

- data loss, money, safety, privacy, security, authorization, compliance, or irreversible side effects;
- public API or schema compatibility, migrations, persistence, concurrency, retries, or distributed boundaries;
- externally observable behavior or a critical user journey;
- high uncertainty, weak requirements, new infrastructure, or a history of escaped defects.

Do not use a universal numeric risk formula unless the project defines one. State the factors and the resulting test depth.

### 3. Select the test level that can prove the claim

- Use **unit/component checks** for deterministic local rules, transformations, and error mapping.
- Use **integration checks** for storage, network, process, framework, serialization, clock, queue, or dependency behavior.
- Use **contract checks** for public interfaces, schemas, protocol compatibility, and consumer/provider assumptions.
- Use **system/E2E checks** for critical behavior across deployed components, permissions, browser/device boundaries, or user workflows.
- Use **static/review checks** for requirements, configuration, types, schemas, security rules, and other artifacts where execution is unnecessary or insufficient.

If a claim crosses a boundary, a passing lower-level test is supporting evidence only. Add a check at the boundary or explicitly state why the boundary is out of scope.

### 4. Design from behavior and models

Derive cases from requirements and an explicit test model, not from implementation lines alone. Cover applicable:

- representative valid behavior and the default path;
- invalid, malformed, missing, empty, null, duplicate, oversized, and unexpected inputs;
- equivalence classes and boundary values, including just-inside and just-outside limits;
- state transitions, ordering, replay, idempotency, concurrency, and cancellation;
- dependency errors, timeouts, retries, rate limits, partial failure, process restart, and cleanup;
- authorization, tenant/data isolation, privacy, compatibility, migration, rollback, and observability;
- regression behavior for previously fixed or acceptance-critical failures.

Do not force every category into a trivial feature. Mark a category not applicable with a reason.

### 5. Treat asynchronous completion as part of correctness

A test is incomplete if the runner can finish before the behavior or assertion has executed. Return or await promises, await asynchronous matchers, observe callback execution, and assert the expected number of callback/branch assertions when a missing callback could produce a false pass. Apply the same rule to timers, event listeners, workers, subprocesses, polling, and teardown.

Vendor examples are implementation details, not general requirements: Jest requires returned/awaited async work and supports assertion counting for this hazard; Vitest documents awaiting async matchers and `hasAssertions`/`assertions` for callbacks and branches. Consult the linked vendor references only when that runner is in scope.

### 6. Retries diagnose; they do not heal

Do not add or increase retries merely to obtain green status. On a retry, retain the original failure, attempt number, seed, worker, environment, logs, and artifacts. Classify the outcome as:

- **pass:** the required check completed and its oracle held;
- **fail:** the oracle did not hold or the check itself failed;
- **flaky/inconsistent:** repeated equivalent attempts disagree and the cause is not yet resolved;
- **blocked:** the check could not run or produce trustworthy evidence because of an external prerequisite;
- **inconclusive:** the check ran but the oracle, observability, or data quality was insufficient;
- **not applicable:** the risk/category is genuinely outside the change, with a reason.

`flaky`, `blocked`, and `inconclusive` are not `pass`.

### 7. Coverage is scoped evidence

Coverage answers what the instrumented run observed under a defined denominator and metric. It does not prove requirements, data combinations, concurrency, oracle quality, or production behavior. Report the named scope, metric, exclusions, configuration, and threshold. Never use an unqualified “100%” to imply exhaustive correctness.

### 8. Test doubles must preserve the claim

Mock or stub only at a boundary whose behavior is outside the test's claim. A mocked dependency cannot prove the real protocol, serialization, persistence, timeout, authorization, or failure behavior. Pair mocks with an integration or contract check when that boundary is material.

### 9. Keep verification safe and repeatable

Control time, randomness, locale, environment variables, network destinations, seeds, fixture versions, and dependency versions where they affect the result. Make tests order-independent, isolate parallel data, clean up on success and failure, and avoid relying on undeclared machine state. If the check intentionally depends on a live service or shared state, record that dependency and its impact on confidence.

## Verification workflow

### 1. Establish scope and baseline

Read the task, applicable `AGENTS.md`, repository manifests, test configuration, CI commands, relevant code/tests, and the active diff. Identify the target behavior, changed boundary, intended test environment, and existing commands. Preserve unrelated user changes. If discovery is missing, create a concise verification boundary record; do not silently redefine the task.

### 2. Build the verification matrix

For each acceptance criterion or material risk, record at least:

| Claim | Basis and oracle | Observable check | Level | Command/evidence | Result |
| --- | --- | --- | --- | --- | --- |
| What must be true | Where it comes from and how correctness is decided | What is observed | Unit, integration, contract, E2E, or static | Exact command and artifact | Pass, fail, blocked, inconclusive, or N/A |

Trace tests back to claims. A test without a claim may be useful diagnostic coverage but is not acceptance evidence.

### 3. Choose checks and test data

Start with the narrowest check that can disprove the highest-risk claim. Add broader checks for integration, compatibility, user-critical flows, and production-like conditions. Prepare fixtures that include boundary, negative, duplicate, concurrent, and partial-failure cases when applicable. Confirm cleanup and recovery before running destructive scenarios.

### 4. Execute in an evidence-preserving order

Run, in order appropriate to the repository:

1. focused checks for changed behavior and its direct regressions;
2. type-checking, static analysis, lint/format, generated-code, schema, and build/package checks defined by the project;
3. relevant unit, integration, contract, system, E2E, and non-functional checks;
4. CI-equivalent or environment-specific checks when local evidence cannot establish the claim;
5. optional exploratory, property, fuzz, mutation, or repeatability checks selected by risk.

Do not skip a configured check just because another suite is green. If a check cannot run, report the blocker and the unverified claim.

### 5. Investigate failures and anomalies

For each failure, preserve the first reproducible command and artifact. Compare expected versus actual behavior, inspect the changed path and test harness, and determine whether the cause is product, test, environment, infrastructure, data, or unknown. Retry or isolate only to test a stated hypothesis. Do not weaken assertions, broaden timeouts, increase retries, delete evidence, or change the acceptance criterion without an explicit decision and record.

### 6. Make the completion decision

Re-read the acceptance criteria and matrix. A completion claim requires every in-scope mandatory claim to be `pass`, or an explicitly accepted exception naming the owner, rationale, impact, and follow-up. Any `fail`, `blocked`, or `inconclusive` item remains visible. `not applicable` requires a reason tied to the change boundary.

### 7. Handoff the result

Return the evidence report described below. If verification exposes a requirement ambiguity, missing ownership, production defect, or architectural concern, hand it to the owning core skill instead of silently fixing or re-scoping it.

## Failure modes and required responses

| Failure mode | Signal | Required response |
| --- | --- | --- |
| False green from no discovery | Exit code is zero but no tests/checks ran, or a pass-with-no-tests flag was used | Mark the scope unverified; fix discovery/configuration or explain the intentional empty scope. |
| False green from unobserved async work | Callback/assertion may execute after the test returns | Await/return the work or count assertions; rerun the focused case. |
| Circular oracle | Expected value is produced by the same code/path as the actual value | Replace or qualify the oracle with a specification, invariant, independently derived value, or approved baseline. |
| Over-mocked boundary | All dependency behavior is simulated while the claim concerns the real boundary | Add a contract/integration check or reduce the claim. |
| Retry hides a defect | First attempt fails and a later retry passes | Report inconsistency and retain first-failure evidence; investigate before release. |
| Coverage theater | Threshold passes but acceptance paths, branches, states, or boundaries are absent | Expand the matrix; report coverage only as scoped supplemental evidence. |
| Environment mismatch | Local result depends on versions, services, flags, data, or permissions unlike the target environment | Re-run in the relevant environment or mark the claim unverified and document the mismatch. |
| Stale or mutable artifact | Snapshot, golden file, generated output, or fixture changed without an independent review | Verify the baseline's provenance and review the change before accepting it. |
| Test contamination | Order-dependent result, shared data, leaked state, or parallel interference | Isolate/reset state, reproduce with a controlled order/seed, and fix the test or product cause. |
| Unbounded verification | An expensive suite is run without a stop condition or safety limit | Define scope, timeout, budget, and artifact retention; stop when evidence is sufficient for the claim. |

## Evidence and reporting rules

Use a compact report with these fields:

- **Scope:** commit/ref or working-tree state, changed components, and in/out-of-scope behavior.
- **Basis and risks:** acceptance criteria, source documents, key risk factors, and any unresolved ambiguity.
- **Checks:** exact commands, working directory/configuration, test selection, and relevant tool/runtime versions.
- **Results:** pass/fail/blocked/inconclusive/N/A, counts where available, and links or paths to logs, reports, traces, screenshots, coverage, and diffs.
- **Failures:** first failure, reproduction command, classification, impact, and whether a retry changed the outcome.
- **Environment:** local, CI, test/staging, or post-deployment; include external dependencies and data assumptions.
- **Residual risk:** untested boundaries, weak oracles, skipped checks, flakiness, coverage limits, and required follow-up.
- **Conclusion:** `VERIFIED`, `NOT VERIFIED`, or `VERIFIED WITH EXPLICIT EXCEPTIONS`, with the exact claims supported by the evidence.

State facts separately from inferences. “Command exited 0” is a fact; “safe to release” is a conclusion requiring the matrix and risk decision. Do not report “all tests pass” when only a subset ran, when tests were skipped, or when a retry masked an inconsistent result.

## Boundaries with the four core skills

- **`engineering-discovery`:** supplies repository facts, scope, ownership, constraints, risks, and acceptance criteria. Verification consumes and checks these artifacts; it may flag missing or contradictory basis, but does not invent requirements or replace architectural discovery.
- **`engineering-implementation`:** owns production changes and the implementation's contracts, types, lifecycle, and error behavior. Verification may identify the failing claim and propose the smallest missing check; it does not change production code to make a check pass or weaken the test without an explicit implementation handoff.
- **`engineering-review`:** owns the independent PASS/FAIL judgment on the actual diff and architecture. Verification supplies reproducible execution evidence; a green suite does not prevent review from rejecting an unsupported contract, unsafe design, or missing acceptance evidence.
- **`engineering-verification` (this skill):** owns the test basis/oracle mapping, test selection, execution evidence, failure classification, and verification conclusion. When the result reveals a requirements, implementation, or review responsibility, hand it back to the corresponding skill rather than creating a duplicate workflow.

## Acceptance criteria for this skill

The skill has been applied successfully only when:

- every in-scope acceptance criterion has a named observable, oracle, check, and result;
- the selected test level can actually observe the claimed behavior;
- applicable negative, boundary, failure, state, compatibility, security, and recovery risks were considered and either tested or explicitly marked with rationale;
- async completion, test discovery, isolation, retries, and cleanup cannot produce an unreported false pass;
- exact evidence and environment scope are recorded, including skipped, blocked, and inconclusive checks;
- the conclusion does not claim more than the evidence supports and identifies residual risk.
