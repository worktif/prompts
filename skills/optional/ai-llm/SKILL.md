---
name: ai-llm
description: Design, implement, review, or operate production systems that use language or multimodal models, prompts/context, structured outputs, tools, RAG, agents, evals, or AI safety controls. Do not activate for ordinary deterministic software work or copywriting that only mentions AI.
---

# AI and LLM systems

Use this skill when model behavior is part of a product contract, execution path, security boundary, or measurable production outcome. The model is a probabilistic component inside a deterministic system; its text, tool choice, retrieved content, and claimed completion are untrusted until the application validates them and verifies the resulting state.

Read [references/source-index.md](references/source-index.md) when the task depends on current provider behavior, current model/tool support, MCP, OWASP, NIST, pricing, data handling, or source attribution. The source index is a routing and provenance aid, not a substitute for the live documentation.

## Activation boundary

Activate for:

- selecting, routing, pinning, upgrading, or benchmarking models;
- designing prompts, context windows, multimodal inputs, memory, or conversation state;
- parsing structured output or function/tool calls;
- building RAG, search, citations, grounding, or knowledge ingestion;
- implementing agent loops, handoffs, approvals, checkpoints, cancellation, recovery, or multi-agent orchestration;
- adding guardrails, moderation, privacy controls, red-team coverage, or threat models;
- defining evals, regression gates, latency/cost budgets, or production evidence.

Do not use it to turn a deterministic rule into an LLM call, to treat a vendor feature name as an architecture, or to claim accuracy, safety, autonomy, compliance, or production readiness without evidence.

## Operating contract

Before changing code or proposing architecture, establish:

1. **Outcome:** the user/business result, the allowed failure behavior, and what counts as completion.
2. **Model boundary:** what the model may infer or generate, what must remain deterministic, and which provider/model/API/snapshot/configuration is in scope.
3. **Trust boundary:** trusted instructions and data, user-controlled content, retrieved documents, tool descriptions/results, memory, credentials, and external side effects.
4. **State owner:** which component owns conversation history, run state, checkpoints, approvals, retries, idempotency, and final verification.
5. **Evidence plan:** offline evals, adversarial cases, traces, service metrics, and environment-state checks.
6. **Acceptance criteria:** measurable quality, safety, availability, latency, cost, and recovery thresholds. If a threshold is missing, mark it `[SET THRESHOLD]`; do not invent one.

Label statements in design notes and reviews:

- **Vendor fact:** behavior or limitation stated by a provider document for a named API/model/version.
- **Protocol/spec fact:** behavior required or recommended by a versioned protocol such as MCP.
- **Engineering synthesis:** a design recommendation derived from the facts and the risk of this system.
- **Measured evidence:** an observed result with dataset, environment, configuration, and time window.
- **Assumption / unknown:** a condition not established by code, documentation, or measurement.

Do not silently convert one label into another. A successful transcript is not proof of a successful side effect; a schema-valid object is not proof of a correct decision; and a vendor recommendation is not a guarantee.

## Reference architecture

Keep these responsibilities explicit, even if the implementation combines some of them:

`request -> identity/policy -> context builder -> model -> parse/schema/semantic validation -> tool policy -> tool execution -> checkpoint/state -> outcome verification -> response`

The model can propose text, a structured result, or a tool call. The application decides whether that proposal is allowed, executes authorized effects, records what happened, and verifies the result against the source system. Never use a prompt as the only authorization, validation, transaction, or termination mechanism.

## Model boundary and prompt/context

- Choose a model against the actual task: modality, reasoning difficulty, context size, structured-output support, tool behavior, throughput, latency, cost, data controls, and deployment constraints. Record the exact model/snapshot, API surface, parameters, system/developer instructions, tool registry, and retrieval configuration used for evaluation and release.
- Pin versions where reproducibility matters. Re-run representative evals after model, snapshot, prompt, schema, tool, retrieval-index, policy, or dependency changes; do not assume models in one family are behaviorally interchangeable.
- Keep stable instructions, examples, schemas, and policy before dynamic user/history/retrieval content when this improves caching or context control. Treat token limits as an engineering constraint, not as permission to drop untracked context.
- Separate instructions from data with typed fields or explicit delimiters and provenance. Mark user text, web pages, files, memory, retrieved chunks, and tool results as untrusted data. Prompt-injection resistance is defense in depth, not a property that prompting alone can guarantee.
- Minimize context to what is relevant and authorized. Apply tenant/user/record-level access checks before retrieval or assembly; do not rely on the model to filter secrets or unauthorized documents.
- Define ambiguity behavior: ask a question, abstain, route to a human, use a deterministic fallback, or refuse. Make this behavior observable and test it as a first-class outcome.

## Schemas and output validation

- Use a provider's structured-output or function-schema mode when the selected model/API supports the required subset. Treat provider-specific strictness, refusal behavior, unsupported schema features, truncation, and API defaults as versioned facts; verify them against the source index before implementation.
- Validate locally after every model response: transport status, refusal/error state, complete output, JSON/schema shape, types/ranges/enums, cross-field invariants, authorization-relevant values, and business rules. Use a typed parser rather than string matching.
- Use function/tool calling for an application action or data access; use a structured response for data that the application will render or process. A valid schema constrains representation, not truth, intent, permissions, or side-effect safety.
- Fail closed on malformed, incomplete, refused, stale, or semantically invalid output. A bounded repair/retry may be used only when it has a clear budget and cannot repeat a side effect. Preserve the original failure for diagnosis.
- Version schemas and migration behavior. Reject unknown versions explicitly or provide a tested compatibility path; never silently coerce a dangerous value.

## Tools, permissions, and MCP

- Give the model the smallest typed tool surface that can accomplish the task. Prefer narrow read tools and staged plans over broad shell, database, filesystem, payment, messaging, or administrative capabilities.
- Enforce identity, tenant scope, authorization, input validation, policy, rate/concurrency limits, timeout, idempotency, and audit logging in the executor. Re-check authorization at execution time; a model proposal is not user consent.
- Separate read, preview, commit, and irreversible operations. Require explicit approval or an equivalent policy decision for high-impact actions. Show the exact target, arguments, identity, and expected effect to the reviewer. Fail closed when approval is denied, ambiguous, unavailable, or expired.
- Validate and sanitize tool results before returning them to the model or user. Classify tool failures as transient, validation, authorization, business, or permanent; retry only transient failures with bounded backoff and idempotency protection.
- Decide deliberately whether parallel calls are safe. Parallelism is appropriate only for independent, bounded work; disable it when ordering, quotas, locking, or side effects make zero-or-one execution safer.
- When MCP is in scope, pin the MCP specification version, negotiate lifecycle/capabilities, treat server-provided names/descriptions/annotations/results as untrusted unless the server is trusted, validate input and output schemas, apply least-privilege authorization, use request timeouts, and record tool use. Follow the MCP authorization rules for the selected transport; do not pass through client tokens to downstream services.
- Do not describe a tool call as success merely because the model emitted it. Record at least: proposed call, authorization decision, execution status, returned data, side effect identifier, and postcondition check.

## RAG, retrieval, and grounding

Define the knowledge contract before choosing a vector store or embedding model:

- **Corpus:** owner, source system, version/freshness, ACLs, deletion policy, document types, and poisoning/quality controls.
- **Ingestion:** parsing, normalization, chunking, metadata, embedding/index version, deduplication, and re-indexing triggers.
- **Query:** identity-aware filters, query rewriting policy, lexical/semantic/hybrid retrieval, reranking, top-k/threshold, and context budget.
- **Answer:** source identifiers, citation format, quote/span policy, uncertainty/abstention behavior, and what happens when evidence is missing or conflicting.

Measure retrieval separately from generation. At minimum distinguish retrieval relevance/recall, ACL leakage, freshness, grounding/entailment, citation correctness/completeness, answer correctness, abstention, latency, and cost. A retrieved chunk is evidence to inspect, not an instruction to follow and not proof that the final answer is correct. Verify citations against the stored source and preserve document version identifiers.

## Agent state, stop, and recovery

Model an agent as a bounded state machine, not as an unbounded autonomous actor. Persist a run identifier, objective, actor/tenant, state version, step history, pending approval, tool-call status, budgets, checkpoint, and terminal reason.

Define stop conditions before execution:

- goal/postcondition verified;
- user cancellation, approval rejection, policy violation, or required input missing;
- maximum steps, model/tool tokens, wall-clock time, retries, parallel work, or spend reached;
- no-progress/repeated-error threshold reached;
- dependency, provider, or environment failure that cannot be safely recovered.

Checkpoint before a side effect when possible, make side effects idempotent, and record an operation key. After interruption or disconnect, resume from the durable checkpoint or retrieve the authoritative run state; do not replay an uncertain commit blindly. On recovery, reconcile pending effects with the source system, compensate where supported, or escalate to a human. A completed turn, a final text response, or an idle session alone does not prove that all tool calls or environmental work succeeded.

For handoffs or multiple agents, define ownership of the objective, authority, state, budget, and final acceptance. Do not use extra agents to hide an unresolved responsibility boundary.

## Evals and regression

Build a versioned evaluation set from representative traffic, edge cases, known incidents, adversarial inputs, refusals, ambiguity, long context, missing/incorrect retrieval, tool validation failures, timeouts, duplicate delivery, cancellation, and recovery. Keep secrets and unnecessary personal data out of fixtures.

Use the simplest reliable grader for each property:

- deterministic checks for schema, policy, exact fields, tool allowlists, citations, and postconditions;
- calibrated model-based grading only for qualities that require judgment, with examples, inter-rater checks, and periodic human review;
- trace/workflow grading for routing, tool sequence, guardrails, handoffs, retries, and stop behavior;
- environment assertions for actual database/file/API state, not just the transcript.

Run regression gates on every material change and compare quality, safety, refusal/abstention, tool precision, retrieval metrics, p50/p95/p99 latency, error/timeout rate, tokens, requests, cost per request and cost per successful task. Keep baseline configuration, dataset version, grader version, model/snapshot, prompt/schema/tool/retriever versions, and environment identifiers with the result.

Do not report one aggregate score as proof of production readiness. Investigate slices and severe failures; a low-frequency high-impact failure can block release even when the average score improves.

## Safety, privacy, and governance

- Threat-model prompt injection, insecure output handling, data/training or retrieval poisoning, denial of service/resource exhaustion, supply-chain/plugin risk, sensitive-information disclosure, excessive agency, overreliance, and model or credential theft. Map controls to the concrete data flow and side effects; do not copy a risk label without testing the corresponding failure mode.
- Use input/output moderation or a domain-specific policy layer where appropriate, adversarial testing, abuse controls, rate limits, and human review for high-impact decisions and irreversible actions. Safety filters are not complete authorization or compliance controls.
- Minimize sensitive data, redact before model/tool transmission where feasible, isolate tenants, restrict logs, set retention/deletion rules, protect credentials, and document every processor and data flow. Provider data controls do not remove the application's privacy, access-control, or regulatory obligations; confirm current terms and account configuration for the deployment.
- Use a risk register with affected people/systems, foreseeable misuse, severity/likelihood, control owner, evidence, residual risk, and rollback/escalation path. The NIST AI RMF functions—Govern, Map, Measure, Manage—are a useful organizing framework, not a certification or guarantee.

## Latency, cost, and operations

- Instrument the whole path: queue time, model time-to-first-token and completion time, input/output/reasoning tokens where available, number and duration of tool/retrieval calls, retries, cache hit/miss, moderation, failures, and human wait time.
- Optimize from measured bottlenecks: avoid unnecessary model calls, shorten generated output, reduce or filter massive context, parallelize only independent work, cache only when authorization and freshness are safe, and choose a smaller model only after quality and safety remain within the release thresholds.
- Set per-request and per-run budgets for model calls, tokens, retrieval, tool invocations, wall-clock time, concurrency, and spend. Make limit exhaustion a typed, user-visible terminal outcome with recovery guidance.
- Separate interactive from batch workloads. Streaming can improve perceived responsiveness but does not make partial output safe to act on; moderate or validate before display/commit where required.
- Monitor provider/API changes, model deprecations, rate limits, price changes, index drift, tool-registry changes, and incident signals. Keep rollback and kill-switch procedures tested.

## Failure-mode review

For every component, record **trigger -> detection -> containment -> recovery -> evidence**. Cover at least:

| Failure | Required treatment |
| --- | --- |
| Prompt injection or poisoned retrieval/tool content | isolate as data, deny unauthorized action, log provenance, test adversarially |
| Hallucinated or stale answer | require evidence/abstention, validate citations, use a deterministic source of truth where available |
| Valid-but-wrong structured output | semantic/business validation, invariant checks, human review for high impact |
| Unauthorized or over-broad tool call | executor-side authorization, least privilege, approval, deny by default |
| Tool timeout, duplicate, or partial side effect | timeout, idempotency key, reconcile source state, bounded retry/compensation |
| Refusal, truncation, malformed output, or provider error | typed failure, no side effect, bounded fallback or escalation |
| Agent loop or state loss | budgets, no-progress stop, durable checkpoint, resume/reconcile rather than replay |
| Regression or environment drift | pinned versions, trace/eval comparison, canary/rollback, postcondition verification |
| Data leakage or unsafe logging | minimization, redaction, access-controlled retention, deletion and incident response |

## Acceptance criteria

A production change is acceptable only when the evidence package shows, for the stated scope:

- the model/API/version and configuration are explicit;
- trusted versus untrusted inputs, data access, tools, permissions, and side effects are mapped;
- outputs and tool arguments/results are parsed and validated outside the model;
- RAG quality and grounding are measured separately when retrieval exists;
- stop, approval, cancellation, checkpoint, retry, and recovery behavior are tested;
- representative, adversarial, refusal, regression, and failure-path evals pass their recorded thresholds;
- latency, error, throughput, and cost budgets are measured in a representative environment;
- claims about external work are backed by source-system or environment-state evidence;
- privacy, safety, residual risks, rollback, and human escalation owners are documented.

If any item is unverified, report the exact gap and its release consequence. Do not fill it with a vendor claim, a successful demo, or a transcript assertion.

## Limitations

This skill provides provider-aware engineering discipline, not a universal framework, security certification, legal advice, or a guarantee of model behavior. APIs, model capabilities, prices, retention controls, MCP revisions, and OWASP guidance change. Re-check the linked primary sources and the deployed configuration at implementation and release time. Thresholds, privacy requirements, threat severity, and human-review obligations remain system- and jurisdiction-specific.
