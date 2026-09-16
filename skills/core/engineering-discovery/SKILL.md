---
name: engineering-discovery
description: Establish an evidence-bounded change boundary for non-trivial software work by inspecting requirements, project structure, architecture, ownership, risks, and verification before implementation; do not use for trivial edits, standalone explanations, or independent code review.
---

# Engineering Discovery

Establish what is known, what is requested, what is affected, and what must be proven before implementation. This skill is a discovery and handoff activity; it does not silently become implementation, review, or a claim that tests passed.

Read [references/source-index.md](references/source-index.md) when the task requires requirements quality, architecture-description terminology, or a defensible explanation of repository evidence. The references summarize sources; do not copy standards text into project artifacts.

## Activation boundaries

Activate before a change that can alter behavior, public or internal contracts, data shape or integrity, security boundaries, lifecycle, concurrency, deployment/operations, repository structure, tests/CI, or architecture. Also activate for a migration, refactor, architectural decision, ambiguous bug, or task whose acceptance criteria are incomplete.

Do not activate for a self-contained typo or formatting-only edit, a simple explanation with no repository change, or a review of an already-scoped change. Use `engineering-review` for an independent verdict on an actual diff and `engineering-verification` for executing and reporting checks. If a seemingly trivial request crosses a contract or behavior boundary, activate this skill.

## Responsibilities and limits

Mandatory responsibilities:

- Establish the requested outcome, explicit scope, affected behavior, inputs, outputs, constraints, compatibility expectations, and acceptance criteria.
- Inspect repository evidence before describing current behavior: applicable `AGENTS.md` instructions, manifests, entry points, relevant modules, tests, CI/build configuration, generated-code boundaries, and operational/configuration artifacts.
- Identify the current data flow, control flow, dependency direction, lifecycle, state owner, public boundaries, and the existing abstraction that should be extended.
- Inspect the active worktree and separate staged, unstaged, untracked, and unrelated user changes before forming a baseline.
- Map every material acceptance criterion and risk to an observable verification method or mark it blocked/unknown.
- Produce a concise discovery record and handoff. Preserve unknowns instead of filling them with plausible project behavior.

This skill may read files, repository metadata, history, and run non-mutating inspection or analysis commands. It must not edit product code, rewrite project architecture, reset/stash/checkout user changes, weaken tests, or invent requirements. A requested implementation begins only after the discovery boundary is clear and belongs to `engineering-implementation`.

## Evidence model

Label statements in the discovery record:

- `[SOURCE REQUIREMENT]` — directly stated by the user, issue, specification, contract, or adopted project standard.
- `[PROJECT FACT]` — directly observed in current code, configuration, tests, CI, generated artifacts, or command output.
- `[HISTORY]` — evidence from version-control history; useful for intent and evolution, not proof of current runtime behavior.
- `[INFERENCE]` — reasoned relationship supported by cited facts.
- `[ASSUMPTION]` — a temporary choice made because the task can proceed safely without clarification.
- `[UNKNOWN]` — information not established from available evidence.
- `[LIMITATION]` — an access, tooling, repository-state, environment, or scope limitation.

Evidence rules:

- A filename, directory name, symbol name, diagram, or comment alone does not establish ownership or behavior; trace it to executable code, configuration, tests, or an explicit project document.
- Current executable/configured behavior outranks stale documentation or history for describing what the system does now. Report the conflict; do not silently “fix” the documentation or treat intent as behavior.
- A passing test demonstrates only the exercised behavior in that environment. It does not prove untested acceptance criteria, deployment state, or universal correctness.
- Standards and external guidance are references unless the project explicitly adopts them or the user makes them a requirement. Do not present a standard’s terminology as a project mandate.
- Absence from a search is not proof of absence. State the search boundary and remaining uncertainty.

## Mandatory workflow

1. **Classify the request.** Record the goal, desired outcome, change type, and whether the request is behavior-, contract-, data-, architecture-, or operations-sensitive. Define explicit out-of-scope areas. If the requested outcome is materially ambiguous, stop and ask one bounded question rather than choosing an architecture.

2. **Locate the project boundary.** Determine the repository or project root from repository metadata where available; otherwise use the nearest authoritative project manifest and instructions. Read applicable `AGENTS.md` files from the relevant scope, then the project manifest(s), entry points, and task-specific documentation. If no Git repository is present, continue with available project evidence and record the missing history/worktree limitation.

3. **Capture the baseline.** For Git projects, inspect branch/upstream context and all four relevant states: staged changes, unstaged changes, untracked files, and the current commit. Use read-only status and diff views; inspect history for affected paths when intent or compatibility matters. Never treat a dirty worktree as a clean baseline and never overwrite unrelated changes. For another SCM, use its equivalent and name the evidence source.

4. **Translate the request into checkable requirements.** Separate source requirements from design choices. For each material requirement, record the subject/system, required behavior or quality, conditions, constraints, priority if stated, source, and an acceptance observation. Keep one independently checkable outcome per criterion where practical. Preserve explicit TBD/TBR items; do not disguise them as decisions.

5. **Trace the current system.** Follow the real entry point through control flow, data transformations, side effects, dependency boundaries, error paths, concurrency, and lifecycle. Identify who owns mutable state and which existing contract, builder, adapter, service, repository, or test seam is the correct extension point. For architecture-scoped work, record the purpose and scope of the architecture description, system/context boundaries, relevant stakeholders and concerns, selected views/viewpoints or models, and decision rationale; tailor the record to the task rather than producing diagrams by default.

6. **Resolve the change boundary.** Prefer the smallest architecture-preserving change that satisfies the source requirements. Ask for clarification only when the missing fact can change public compatibility, data safety, security, lifecycle/state ownership, irreversible scope, or the selected architecture. Otherwise choose the smallest safe assumption and label it. If requirements, code, tests, and history disagree, distinguish current behavior from intended behavior and escalate when the choice affects the contract.

7. **Derive risks and verification.** For each affected behavior and high-impact assumption, identify likely failure modes, affected boundaries, and the cheapest sufficient evidence: inspection, analysis, unit/integration/contract/E2E test, build/package check, migration rehearsal, or operational observation. Include invalid, boundary, failure, retry, timeout, cancellation, duplicate, concurrency, partial-failure, authorization, and rollback cases when applicable. Do not prescribe a test type where a lower-cost direct check proves the criterion.

8. **Handoff without scope drift.** Return the discovery record before implementation. If implementation or verification reveals a changed requirement, ownership conflict, or new risk, return to discovery for a bounded update rather than silently expanding the diff.

## Non-obvious invariants

- The change boundary follows behavior and ownership, not the apparent directory or the first matching symbol.
- Requirements state the needed outcome and constraints; architecture and implementation state how it is achieved. A design detail becomes mandatory only when supported by a source requirement or an explicit project constraint.
- Every accepted criterion has an observable proof target, or is explicitly `[UNKNOWN]`/`[LIMITATION]`; “looks right” is not a verification result.
- A dirty worktree is part of the evidence. Staged and unstaged changes are different baselines and must not be conflated.
- Version-control history explains evolution and intent. It cannot override current code/configuration as evidence of present behavior.
- State ownership, lifecycle, and dependency direction must be identified before proposing an abstraction. A local workaround is not an acceptable substitute for an existing lifecycle or orchestration mechanism without evidence that it is insufficient.
- Architecture documentation is purpose- and stakeholder-driven. A diagram without its scope, concern addressed, source of truth, and rationale is not a complete architecture finding.
- Verification planning is not verification execution. Discovery may specify exact checks; `engineering-verification` owns running and reporting them.

## Decision rules

- **Ask:** the answer could alter data migration semantics, security/privacy, public API or compatibility, ownership/lifecycle, irreversible operations, or the set of affected systems.
- **Assume and label:** the gap is local, reversible, low-risk, and does not change the chosen abstraction or acceptance meaning. State the assumption and the evidence that makes it safe.
- **Inspect more:** evidence is contradictory, generated code obscures the source, a boundary crosses process/network/storage, or the claimed behavior is not covered by an executable or configuration path.
- **Narrow scope:** a request says “all,” “complete,” or “support” without defining the universe. Define the relevant official project surface and ask if multiple materially different universes remain.
- **Do not infer adoption:** an ISO/IEEE, NASA, or other external source can inform terminology and controls but does not make a project compliant or impose a process unless adoption is evidenced.
- **Do not use tool availability as proof:** `command -v`, a remembered command, or a green local command is not evidence of the project’s active runtime, deployment, or acceptance unless the project path and result are established.

## Failure modes and response

| Failure mode | Required response |
| --- | --- |
| A path or name is treated as the owner | Trace callers, configuration, lifecycle, and tests; label unresolved ownership. |
| Requirements, assumptions, and design are mixed | Rewrite the record with evidence labels and separate “what” from “how.” |
| Dirty, staged, or untracked changes are missed | Re-capture repository state; state exactly which states were inspected and which were inaccessible. |
| History is used as current behavior | Verify against current code/configuration and report the historical claim only as `[HISTORY]`. |
| A diagram or document is accepted without stakeholder concerns | Identify purpose, scope, concerns, views/viewpoints, and rationale, or mark the architecture evidence incomplete. |
| Acceptance criteria have no proof target | Add a direct observation or mark the criterion blocked; do not declare discovery complete. |
| Repository is not Git or is partially inaccessible | Use available project evidence, record the limitation, and avoid claims requiring missing history or worktree state. |
| Discovery starts implementing or broadens the task | Stop, restore the handoff boundary, and send the implementation question or scope change back through the appropriate core skill. |

## Verification of the discovery record

Before handoff, confirm:

- the source request and explicit project constraints are represented without invented requirements;
- relevant instructions, manifests, entry points, affected modules, tests, CI, configuration, and repository state were inspected or their absence is recorded;
- current behavior, state ownership, lifecycle, dependency direction, and extension point are supported by project evidence;
- scope, exclusions, compatibility assumptions, risks, failure modes, and unresolved questions are explicit;
- each acceptance criterion maps to an observable verification method, with environment/deployment checks separated from local checks;
- unrelated user changes are identified and preserved;
- the next skill can implement or verify without having to rediscover a material architectural decision.

This is a completeness check for discovery, not a product-quality verdict and not a substitute for the verification or review skills.

## Required handoff format

Use a concise record with these fields, retaining the evidence labels:

1. **Goal and outcome**
2. **In scope / out of scope**
3. **Evidence inspected** — paths, documents, commands, and relevant revisions/dates
4. **Current behavior and architecture** — data/control flow, lifecycle, state ownership, dependencies, extension point
5. **Requirements and acceptance criteria** — each linked to its source and proof target
6. **Assumptions, unknowns, contradictions, and limitations**
7. **Risks and failure modes** — impact and mitigations/checks
8. **Implementation boundary** — files/modules or behavior boundary to change, plus explicit exclusions
9. **Verification plan** — exact checks, expected evidence, and what remains post-deployment

Report facts, inferences, assumptions, and unverified external behavior separately. If no repository or Git evidence was available, say so plainly.

## Boundaries with the four core skills

- **`engineering-discovery` (this skill):** owns pre-change context, evidence classification, scope, architecture/ownership analysis, risks, acceptance criteria, and the handoff. It does not own product edits or final PASS/FAIL decisions.
- **`engineering-implementation`:** consumes the handoff and owns the minimal code/configuration/documentation change. If implementation discovers a changed boundary or ownership conflict, it returns the issue to discovery instead of inventing a second path.
- **`engineering-verification`:** consumes acceptance criteria and risks and owns executing checks, interpreting results, and reporting local, environment, and post-deployment evidence separately. Discovery defines proof targets but must not report unrun checks as passed.
- **`engineering-review`:** independently examines the actual proposed or completed diff/design against the request, architecture, compatibility, security, failure modes, and tests. It may reject an incomplete discovery or unsupported completion claim; it does not replace repository discovery or verification execution.

Normal sequence: discovery establishes the boundary; implementation changes it; verification proves applicable behavior; review independently challenges the result. Re-enter discovery whenever requirements, ownership, architecture, or scope materially changes.
