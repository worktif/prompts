# Source index

Authoritative primary sources used for the `observability` skill. Links were checked on 2026-09-15. The skill uses these sources for definitions and constraints; recommendations that require local policy or architecture are explicitly marked as project decisions.

## Evidence map

| Area | Primary source | What it supports in the skill |
| --- | --- | --- |
| Observability vs. monitoring | [OpenTelemetry Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | Observability as asking questions about system behavior, including novel problems; instrumentation as the source of signals; telemetry, user-oriented reliability, SLI/SLO, logs, spans, and distributed traces. The distinction from monitoring is a synthesis with the Google definition below, not a claim of one universal vocabulary. |
| Monitoring vocabulary and purpose | [Google SRE: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) | Monitoring as collecting, processing, aggregating, and displaying quantitative system data; white-box/black-box monitoring; dashboards and alert classes; guidance to alert on meaningful service-level conditions while retaining drill-down detail. |
| Signals | [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/) | Signal as a system output; traces, metrics, logs, baggage, and the current concepts-page status of profiles. The skill treats metrics, logs, and traces as the primary operational signals and profiles as optional. |
| Context and correlation | [OpenTelemetry: Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/) | Context correlates signals; trace/span identity connects service calls; propagation serializes context across service/process boundaries; the default propagator uses W3C Trace Context; inbound/outbound trust and disclosure cautions; baggage must not carry credentials, API keys, or PII. |
| HTTP trace propagation | [W3C Trace Context Recommendation](https://www.w3.org/TR/trace-context/) | `traceparent`/`tracestate` purpose and processing model; allowed propagation mutations; sampled flag as a recommendation rather than a guarantee; invalid-context handling; privacy, information-exposure, and denial-of-service considerations; `traceparent` and `tracestate` must not contain PII or sensitive information. |
| Naming and interoperability | [OpenTelemetry: Semantic Conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/) | Common names for operations/data and their benefit across codebases, libraries, and platforms; conventions exist for traces, metrics, logs, profiles, and resources. |
| Cardinality | [OpenTelemetry Glossary: Cardinality](https://opentelemetry.io/docs/concepts/glossary/) and [OpenTelemetry Metrics SDK: Cardinality Limits](https://opentelemetry.io/docs/specs/otel/metrics/sdk/) | Cardinality as the number of unique attribute values/combinations; performance, storage, backend, and SDK-memory impact; configurable metric cardinality limits, filtering before limits, and overflow behavior. |
| Privacy at collection | [OpenTelemetry URL Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/url/) | URLs and components can create security risk; user/password information must not be recorded; known-sensitive query parameters must be scrubbed; consumers should scrub or redact when sensitivity cannot be identified. |
| Trace sampling | [OpenTelemetry: Sampling](https://opentelemetry.io/docs/concepts/sampling/) | Representativeness and cost trade-offs; head sampling is early, efficient, and unable to inspect whole-trace outcomes; tail sampling can select on errors, latency, and span attributes but is stateful, operationally difficult, and must be monitored; head and tail sampling can be combined. |
| Telemetry pipeline | [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) | Collector as a vendor-neutral receive/process/export layer with receivers, processors, exporters, connectors, and extensions; agent/gateway and backend-neutral architectural context. |
| Pipeline troubleshooting | [OpenTelemetry Collector Troubleshooting](https://opentelemetry.io/docs/collector/troubleshooting/) | Per-hop verification; common causes of dropped data; receiver configuration/pipeline enablement checks; exporter destination slowness/unavailability; queued retry and sending-queue mitigation; diagnostic tools. |
| Data quality, governance, and redaction | [OpenTelemetry: Transforming Telemetry](https://opentelemetry.io/docs/collector/transforming-telemetry/) | Collector-side transformation/filtering for data quality, governance, cost, and security; explicit warning that processor configuration can affect performance. The skill still requires source-side prevention for secrets and sensitive payloads. |
| Observing the observer | [OpenTelemetry Self-Observability Specification](https://opentelemetry.io/docs/specs/otel/self-observability/) | SDK self-observability should describe processors, exporters, metric readers, and other pipeline behavior; startup/shutdown telemetry is best-effort; pipeline health needs its own evidence. This specification is marked Development, so treat implementation support as stack-dependent. |
| SLI/SLO/error budget | [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) | User-relevant SLIs, explicit SLO measurement conditions, client-side versus server-side collection, careful aggregation, correctness, and error budgets as allowed SLO miss rate. Also distinguishes SLOs from SLAs by explicit consequences. |
| Alerting principles | [Google SRE: Practical Alerting from Time-Series Data](https://sre.google/sre-book/practical-alerting/) | High-level objectives with component-level drill-down; distributions/tails rather than averages alone; aggregation over individual-machine noise; alert duration to reduce flapping; routing to pages, tickets, or informational dashboards; deduplication, inhibition, and grouping. |
| Alert quality and SLO burn | [Google SRE Workbook: Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) | Actionable alerts based on significant error-budget consumption; precision, recall, detection time, and reset time; low-traffic sensitivity; SLI good/total framing; alert-strategy trade-offs. |

## How to use the sources

- Use OpenTelemetry and W3C sources for telemetry data models, propagation, semantic naming, and sampling mechanics. They do not select the project’s SLO target, retention, access policy, on-call owner, or incident workflow.
- Use Google SRE sources for operational measurement and alerting reasoning. They are principles and examples, not universal thresholds, burn-rate windows, page policies, or a replacement for the service’s product and risk decisions.
- Treat current OpenTelemetry page status and maturity labels as time-sensitive. Before implementing a stack-specific feature, check the relevant current language SDK, Collector distribution, backend, and protocol documentation.
- Treat a source-backed recommendation as a design constraint only when the local architecture can satisfy it. Otherwise document the gap, its operational consequence, and the compensating evidence or limitation.

## Explicit limitations of the evidence

These sources do not by themselves establish:

- legal/regulatory requirements, data classification, retention/deletion periods, access controls, encryption, or regional-routing policy;
- a universal definition of observability or a complete list of signals;
- application-specific correctness, business KPIs, SLI populations, SLO targets, error-budget policy, escalation policy, or runbook ownership;
- guaranteed delivery, ordering, sampling completeness, clock synchronization, backend query semantics, or alert notification delivery;
- protocol-specific propagation behavior for every queue, broker, scheduler, RPC implementation, or vendor intermediary;
- proof that emitted telemetry reached the production backend or that the absence of telemetry means service health.

Those are local requirements to resolve, test, and report separately from the standards and practices cited above.
