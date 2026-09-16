---
name: observability
description: Design, review, or implement production telemetry and operational evidence—metrics, logs, traces, context propagation, sampling, SLI/SLOs, alerts, dashboards, and pipeline validation—without confusing observability with mere monitoring.
---

# Observability

Use this skill when a change must make a production system diagnosable, measurable against a service objective, or actionable for an operator. Read [references/source-index.md](references/source-index.md) when a source-sensitive definition, propagation rule, or validation claim is needed.

## Mission and boundary

Use the following working distinction and state it in the design when terminology could be ambiguous:

- **Observability** is the ability to investigate system behavior, including novel failure modes, from externally visible telemetry without first changing the system to add missing questions.
- **Monitoring** is the collection, processing, aggregation, display, and alerting of known quantitative conditions.

This is an operational distinction, not a claim that the industry has one universal vocabulary. A dashboard, log line, or tracing library is not proof of observability. The proof is an operator-relevant question that can be answered with the emitted, retained, queryable, and correlated evidence.

This skill owns telemetry contracts, signal selection, correlation, dimensions, sampling, SLI/SLO/error-budget measurement, alert design, and validation of the telemetry path. It does not silently invent product targets, privacy/retention policy, incident process, deployment topology, or backend-specific features. Use the project’s existing core engineering, security, privacy, incident-management, and deployment mechanisms for those responsibilities.

## Operating workflow

1. Inspect the existing instrumentation, propagation, collectors/agents, exporters, backend schemas, dashboards, alert rules, runbooks, ownership, and tests before changing them. Preserve the project’s established abstraction and lifecycle.
2. Start from operator and user questions: what failed, for whom, where, when, how often, how slowly, with which dependency, and what action should follow? Turn each question into an acceptance check.
3. Enumerate failure modes before selecting signals. At minimum consider success, validation/client failure, server failure, timeout, cancellation, retry, partial completion, dependency failure, queue lag/dead-lettering, saturation/resource exhaustion, deploy/configuration change, and telemetry-pipeline failure. Add domain-specific correctness, freshness, or data-quality failures.
4. Define a small telemetry contract: event/operation name, outcome, duration, stable resource identity, dependency identity, relevant dimensions, correlation fields, redaction rules, sampling policy, retention/access assumptions, owner, and query/runbook location.
5. Implement or extend the existing instrumentation and propagation path. Prefer OpenTelemetry semantic conventions and the project’s supported W3C Trace Context propagator for HTTP; document any protocol-specific limitation.
6. Validate the complete path—not only emission—then report observed evidence, unverified assumptions, and remaining blind spots separately.

## Signals and their jobs

Choose a signal because it answers a question, not because a product advertises a signal count.

| Signal | Best evidence | Production rules |
| --- | --- | --- |
| Metrics | Aggregated rates, counts, sizes, durations, distributions, resource levels, and SLI numerator/denominator | Keep dimensions bounded and aggregatable. Use histograms/quantiles appropriate to the backend; do not use a metric as a per-request event store. |
| Traces | Causal path of one request/run through services, dependencies, retries, queues, and spans | Name operations with stable route/operation templates. Record status, duration, dependency outcome, and useful span events. Treat trace data as sample-aware. |
| Logs | Discrete state transitions, decisions, exceptions, audit-relevant events, and detail needed to explain a metric or span | Emit structured records with stable event names and severity. Avoid duplicating high-volume metrics in logs. Link records to active trace/span context when available. |
| Profiles | Code-level resource usage when the supported stack and backend provide it | Optional. Treat as a separate data class with its own access, retention, and privacy review. |

Context is the correlation mechanism across signals and services; it is not a replacement for any signal. Use trace context for causal identity, and add a request, job, workflow, or business-operation identifier only when it represents a distinct domain boundary that operators actually need to search.

## Correlation and propagation

- For HTTP, use the W3C `traceparent` and optional `tracestate` format through the project’s supported propagator. On receive, validate or safely discard malformed context; on send, create or continue the current context and propagate it to the next trusted hop.
- Preserve parent/child relationships across synchronous calls. For queues, schedulers, batches, and asynchronous fan-out, use the project’s supported carrier/links model and test producer-to-consumer correlation explicitly; do not assume HTTP header behavior applies unchanged.
- Put trace ID and span ID in structured logs when an active context exists. Keep service, deployment, environment, operation, and dependency identities stable enough to join metrics, logs, and traces.
- Treat inbound context as untrusted input and outbound context as potential information disclosure. Never use trace headers or baggage for credentials, API keys, PII, secrets, or business-sensitive payloads. Do not expose internal trace context to public or cross-origin consumers unless the boundary explicitly permits it.
- A correlation ID must not be confused with a user/account ID. If a business identifier is needed, classify it, minimize it, protect it, and keep it out of metric labels unless bounded and explicitly approved.

## Semantic conventions and schema discipline

- Use the applicable OpenTelemetry semantic convention before creating a custom attribute or event name. Record the convention/version or local schema version when compatibility matters.
- Keep operation names, route templates, status categories, dependency names, deployment identity, and environment identity stable. Never use raw URLs, request bodies, exception text, user input, or unbounded IDs as metric dimensions.
- Document required, optional, and forbidden attributes. A missing attribute must have a deliberate meaning; do not silently encode missing, unknown, empty, and redacted as the same value when that changes aggregation or diagnosis.
- Treat telemetry schema changes as compatibility changes: review dashboards, recording rules, alerts, retention/cost effects, and consumers before renaming or changing types.

## Cardinality, cost, and privacy

For each metric, estimate the number of unique combinations of all attributes and the resulting series/storage/query cost. Prefer bounded dimensions such as service, region, route template, operation, outcome class, dependency, and deployment. Use exemplars, trace/log lookup, or sampled detail for high-entropy investigation instead of putting high-entropy values into metric labels.

Apply data minimization at instrumentation and at the pipeline boundary:

- Do not emit secrets, tokens, credentials, raw authentication material, or unreviewed payloads.
- Scrub URLs and query parameters that may contain credentials, location, identifiers, or other sensitive values. Redact exception messages and user-controlled strings when their content is not required for diagnosis.
- Define classification, access control, retention, deletion, regional-routing, and encryption requirements with the project’s security/privacy owners. A backend filter is not a substitute for source-side prevention.
- Bound log size, attribute length, event rate, and collection cost. Make redaction observable without recording the sensitive value.
- Enforce and monitor metric cardinality limits/overflow behavior. A limit that silently collapses data can make a dashboard appear healthy; surface the overflow and document its effect.

## Sampling

State what is sampled, where the decision is made, why the loss is acceptable, and what must be preserved. Head sampling is efficient and makes an early decision, but cannot select a trace based on a later error or latency. Tail sampling can retain traces based on complete-trace properties such as error or overall latency, but is stateful, operationally expensive, and itself needs capacity/drop monitoring.

Use a deliberate policy, commonly including a representative baseline plus protected classes such as errors, high latency, important workflows, and new deployments when the data policy permits. Do not assume a sampled trace set is a complete incident record. Do not derive exact SLI numerators/denominators from sampled traces unless the design includes a proven correction; record SLI measurements from an unsampled or statistically valid source.

Validate that sampling decisions are consistent across a trace, that the W3C sampled flag is treated as a recording hint rather than a guarantee, and that overload/fallback behavior is visible. Reassess sampling as traffic, failure modes, and cost change.

## SLI, SLO, and error budget

Start with user-visible or business-relevant reliability, then choose the measurement. Define each SLI with:

- population and valid event definition;
- good-event and total-event rules, or an explicitly defined measurement such as a latency distribution;
- aggregation and time window;
- client/server measurement point and known exclusions;
- target, owner, data source, query, and review cadence.

Prefer ratios of good events to total events where appropriate. Include availability, latency, throughput, freshness, and correctness only when each represents a real user expectation. Server metrics alone can miss client-side or end-to-end failures. Do not equate HTTP success, process uptime, or “no exception logged” with business correctness without evidence.

An SLO is the target and measurement contract; an SLA adds an explicit consequence. The error budget is the allowed bad-event rate or unreliability over the SLO window. Make the budget computable and show remaining budget, consumption rate, and data freshness. Avoid 100% targets unless the consequences and measurement are genuinely justified.

## Alert design

Classify outputs as page, ticket, or informational. Page only when a human action is required now or the service is consuming reliability budget at a materially dangerous rate. Alert on user-facing objectives or actionable service symptoms; retain lower-level evidence for drill-down. Do not page every host, log line, retry, or isolated dependency blip.

Every actionable alert must identify the service/scope, symptom, current value, start time, SLI/SLO or reason for urgency, owner, runbook, relevant dashboard/query, and safe first action. Define evaluation window, pending/for-duration behavior, low-traffic guardrails, deduplication, grouping, inhibition, escalation, and recovery/reset behavior. Evaluate precision, recall, detection time, and reset time. The exact thresholds and burn-rate windows are service-specific decisions, not universal constants.

Keep the alert path independent enough to detect observability failure: monitor receiver/exporter errors, queue/backpressure, rejected/dropped data, backend write/query failures, clock/ingestion lag, and sampler overload. “No data” must be distinguishable from “no traffic” using a heartbeat, black-box check, or equivalent source of truth.

## Failure-mode coverage matrix

For each important failure mode, record:

| Failure mode | Detection metric/SLI | Trace/log evidence | Operator action and owner | Test evidence |
| --- | --- | --- | --- | --- |
| Success and normal load | Request/job rate and good-event rate | Representative trace and structured completion event | No action; baseline/dashboard | Happy-path probe |
| Error, timeout, cancellation, retry | Error/timeout/retry ratio and latency distribution | Status, exception class, dependency, retry attempt, timeout budget | Triage dependency or rollback/fix | Inject each condition |
| Partial/async failure | Completion/freshness/queue and dead-letter measures | Producer/consumer context, item/batch outcome, links | Replay, quarantine, or repair according to runbook | Force partial batch and consumer lag |
| Saturation/resource exhaustion | Capacity, queue depth, throttling, rejection, and tail latency | Resource/dependency spans and shedding decision | Scale, shed, or remediate bottleneck | Controlled load/resource limit |
| Deploy/configuration regression | SLI segmented by version/rollout and change markers | Version/config/deployment attributes | Halt, roll back, or compare cohort | Staged change test |
| Telemetry-pipeline failure | Receive/export/drop/retry/lag and backend availability | Collector/exporter self-telemetry and diagnostics | Restore telemetry path; do not infer service health from absence | Block destination or overload pipeline |

Adapt the matrix to the domain. A row is complete only when the evidence can locate the fault and the action has an owner; a log line without a queryable path is not coverage.

## Validate the telemetry pipeline

Validate the path end to end:

`operation → instrumentation → context carrier → receiver/collector → processors/sampler → exporter → backend storage/index → query/dashboard → alert/notification`

For a controlled request or job, verify at each hop:

1. the expected record/span/metric is emitted with correct operation, resource, timestamp, status, duration, and schema;
2. context is continued across every supported boundary and logs can be joined to the trace;
3. processors preserve required fields, apply redaction, and produce the intended sampling/cardinality result;
4. receivers, queues, retries, exporters, backend ingestion, and query results show no unexplained drops, duplication, reordering, or lag;
5. an injected failure produces the intended metric, trace, log, dashboard state, and alert, and recovery clears it within the defined reset behavior;
6. self-telemetry exposes receiver/exporter failures, queue pressure, rejected data, sampler pressure, and backend unavailability;
7. queries work against the actual production-shaped schema and retention window, not only against local console output.

Use at least one happy-path, one server/dependency error, one timeout or retry, one async/queue path when applicable, one redaction case, and one destination/backpressure failure. Verify clock assumptions and ingestion delay when ordering or latency matters. State clearly which checks were local, staging, synthetic-production, or live-production; never claim deployed validation from unit tests alone.

## Core-skill boundaries and handoff

- Ask the core engineering skill to own repository architecture, code quality, tests, deployment, migrations, and lifecycle. This skill specifies the telemetry behavior those changes must expose.
- Ask security/privacy owners or the applicable core skill to decide classification, legal basis, access, retention, encryption, and regional policy. This skill enforces the resulting telemetry constraints.
- Use the incident-management process for command, communications, escalation, and post-incident work. This skill supplies reliable evidence, links, and alert semantics.
- Keep product analytics and audit logging distinct from service reliability telemetry unless the system requirement explicitly joins them. Do not copy an analytics event taxonomy into operational metric labels without reviewing cardinality and purpose.

## Acceptance criteria

A production-grade observability change is complete only when:

- the operator questions and covered failure modes are explicit;
- each signal has a defined purpose, schema, owner, and backend query path;
- context correlation is preserved across all in-scope boundaries and malformed/untrusted context is handled safely;
- semantic conventions or a justified versioned local schema are used;
- metric dimensions are bounded, cardinality/cost is estimated, and overflow is detectable;
- privacy, redaction, access, retention, and propagation risks are addressed without emitting secrets or sensitive context;
- sampling policy, protected classes, loss characteristics, and overload behavior are documented;
- SLI/SLO/error-budget definitions are user-relevant, computable, and tied to an explicit data source;
- alerts have actionable ownership, runbooks, evaluation/reset behavior, and appropriate page/ticket/information routing;
- telemetry generation, transport, processing, export, storage/query, dashboard, and alert behavior are validated with controlled success and failure cases;
- operations evidence distinguishes observed facts, assumptions, inferred causes, and unknowns;
- limitations are documented, and no claim exceeds the actual environment or validation scope.

## Limitations

OpenTelemetry is a vendor-neutral instrumentation and telemetry framework, not an SLO catalog, privacy policy, incident process, or guarantee that a backend retains or correlates every record. Semantic conventions and signal support evolve and have maturity levels. W3C Trace Context standardizes HTTP propagation; other protocols require their own supported carrier and testing. Sampling makes absence of a trace ambiguous. Metrics can hide outliers and high-cardinality detail. Telemetry can be delayed, dropped, redacted, mis-sampled, or itself unavailable. Instrumentation can expose what happened without proving that the result was semantically correct. Treat these as design limitations and communicate them with the delivered evidence.
