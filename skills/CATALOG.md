# Engineering Skills Library

Version: 1.2.0

This is a portable, vendor-neutral instruction library for LLMs working with software projects. Each Skill is a directory containing a required `SKILL.md`; it can be connected to Codex, Claude Code, GitHub Copilot, and other systems that support Markdown instructions.

Each Skill contains `references/source-index.md`. This is not a copy of standards; it is an index of authoritative sources with the boundaries of the decisions each source supports. Recheck standard and vendor-document versions when updating the library.

The provenance and results of the integration audit are recorded in [VALIDATION-REPORT.md](VALIDATION-REPORT.md).

## Application model

Always load the four core Skills:

1. `engineering-discovery` — understand the task and the existing system before changing it.
2. `engineering-implementation` — implement the change in architectural compatibility with the system.
3. `engineering-verification` — establish correctness through checks and tests.
4. `engineering-review` — independently audit the result.

The persistent project context is `AGENTS.md`, created from this library's template. Skills do not replace project facts: commands, dependencies, module boundaries, and constraints must be verified in the repository itself.

## Conditional catalog

| Skill | Load when | Primary responsibility |
|---|---|---|
| `security` | auth, secrets, sensitive data, a public boundary, or a threat is involved | threats, abuse cases, protection, and security verification |
| `performance` | latency, throughput, memory, cost, or an SLO is involved | measurement, profiling, and safe optimization |
| `database` | schemas, queries, transactions, or persistence change | data integrity, queries, and transaction boundaries |
| `distributed-systems` | multiple processes, queues, events, retries, or eventual consistency are involved | delivery semantics, failure handling, and coordination |
| `frontend` | UI, browser code, accessibility, or client state changes | UI correctness, state, accessibility, and browser behavior |
| `backend` | APIs, services, workers, or server logic change | API contracts, validation, lifecycle, and service behavior |
| `cloud` | managed cloud resources or deployment are affected | cloud boundaries, IAM, configuration, and rollback |
| `kubernetes` | manifests, controllers, pods, probes, or rollout behavior changes | workload lifecycle, scheduling, and operational safety |
| `documentation` | user or developer documentation is created or changed | source fidelity, examples, and documentation maintainability |
| `github` | a branch, commit, PR, issue, or review workflow is needed | precise GitHub change management and evidence |
| `observability` | logs, metrics, traces, alerts, or dashboards change | diagnosability, correlation, and actionable signals |
| `data-migration` | data must be transformed, moved, or made backward-compatible | expand/migrate/contract, reconciliation, and rollback |
| `ai-llm` | model calls, RAG, agents, tools, or evals are involved | model boundaries, grounding, evals, safety, and cost |

Load only conditional Skills that are genuinely applicable. Their presence in a project does not authorize external changes, deployment, publication, or data deletion.

## Instruction priority

1. System/developer instructions and environment constraints.
2. The user's explicit requirement.
3. Project facts and rules from `AGENTS.md`.
4. Core Skills.
5. Conditional Skills.
6. Local conventions and conclusions verified by the code.

If instructions conflict, do not hide the conflict: name it, preserve the user's scope, and choose the smallest safe solution or request a decision when proceeding without one could damage the architecture.

## Definition of done

The task is complete only when:

- the change matches the goal, scope, and acceptance criteria;
- existing contracts, lifecycle, and ownership have not been bypassed without a demonstrated reason;
- types, errors, boundaries, and side effects have been checked;
- tests cover the behavior, including important failures and boundary cases;
- available type-check, lint, build, and relevant tests have been run;
- the diff contains no unrelated changes;
- the result and limitations are described honestly;
- deployment is not reported as verified without an actual post-deployment check.

## Guarantee limitation

No Skill can guarantee absolute correctness or a literally exhaustive set of tests. The library defines a mandatory evidence-gathering process; final confidence depends on the quality of the original requirements, code, environment, and observability.
