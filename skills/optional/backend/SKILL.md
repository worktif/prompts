---
name: backend
description: Build or change production server APIs, services, workers, jobs, domain logic, adapters, or request-processing pipelines with explicit contracts, failure behavior, and verification evidence.
---

# Backend

Use this skill when work crosses a server entry point, service boundary, background worker, job, adapter, or request-processing pipeline. Read [references/source-index.md](references/source-index.md) when a claim depends on HTTP semantics, problem details, API security, runtime behavior, or telemetry conventions.

This skill is framework- and runtime-neutral. A framework default, middleware, client library, queue, database, proxy, identity provider, or deployment setting is not a guarantee until its exact version, configuration, coverage, and failure behavior are verified. Standards are marked **[STANDARD]**; OWASP material is **[SECURITY BASELINE]**; rules introduced by this skill are **[SYNTHESIS]**.

## Mission and boundary

Own the backend behavior required to make an operation correct and diagnosable at its real public entry point. Keep transport parsing, authentication, authorization, domain decisions, persistence, external calls, and response mapping at explicit boundaries already present in the project. Extend the existing lifecycle, dependency, error, configuration, and observability abstractions; do not create a parallel execution path or hidden state model.

The result of backend work is not merely a handler that returns a value. It is a contract covering:

- request and job inputs, outputs, validation, side effects, and versioning;
- authentication context and the separate authorization decision for the function, resource, tenant, and returned or mutable properties;
- success, rejection, conflict, partial, timeout, cancellation, overload, dependency-failure, duplicate, and restart behavior;
- ownership and cleanup of every resource, task, connection, stream, lease, and idempotency record;
- bounded work, retries, concurrency, telemetry, compatibility, and evidence that the real boundary was exercised.

Do not claim “exactly once”, “zero downtime”, “safe to retry”, “backward-compatible”, “secure”, or “observable” without naming the boundary and evidence that supports the claim.

## Required operation contract

Write or update this record for every route, RPC, message consumer, scheduled job, or public service method. If a field is not applicable, mark it `N/A` with the reason; do not leave it implicit.

| Contract field | Required decision | Acceptance evidence |
| --- | --- | --- |
| Identity | Stable operation name, public version, route/method or trigger, owner, sync/async behavior | Route/registration, handler or consumer, and owner are traced from the real entry point |
| Request | Path/query/header/body or message schema, content type, encoding, required/optional/unknown fields, maximum size/depth/cardinality, pagination and batch rules | Contract/schema test rejects malformed, oversized, ambiguous, and out-of-range inputs |
| Success | Status, representation schema, headers, location/monitor for created or asynchronous work, and whether the result is authoritative or eventually consistent | Boundary test asserts status, headers, body, and side-effect state |
| Side effects | Writes, emitted messages, external calls, caches, notifications, and commit/ack/response ordering | Failure and duplicate tests show which effects occur and how they reconcile |
| Identity context | Authentication mechanism, principal shape, issuer/audience/expiry or equivalent validation, and trusted versus client-controlled fields | Missing, malformed, expired, forged, wrong-audience, and cross-principal tests |
| Authorization | Explicit decision for function, tenant, object, action, and response/mutable property; default-deny behavior | Allowed, wrong-tenant/object, wrong-role, alternate-method, bulk/export, and direct-entry tests |
| Errors | Status mapping, stable problem type/code, safe client detail, internal classification, retryability, and whether resource existence is intentionally hidden | Error matrix, redaction test, and client contract test |
| Time | Admission, queue, request, each dependency, total deadline, and shutdown-drain budgets | Controlled slow-client, slow-dependency, queue, and shutdown tests |
| Retry/idempotency | Retryable failure classes, attempt/time cap, backoff, idempotency key or conditional request semantics, duplicate outcome, and reconciliation | Fault-injection and replay tests, including connection loss after a possible commit |
| Resource limits | Body/page/batch/fan-out/memory/file/concurrency/queue limits and overload response | Boundary load or controlled admission tests show a finite limit and explicit rejection |
| Lifecycle | Startup, readiness, drain, shutdown, resource ownership, in-flight work, leases, and restart recovery | Start/stop/restart test confirms no leaked work or resource and a recoverable state |
| Observability | Structured event fields, trace/metric dimensions, redaction, sampling, retention owner, and actionable failure signals | Success/failure/timeout/cancel/duplicate telemetry is emitted, correlated, bounded, and redacted |
| Compatibility | Supported clients/producers/consumers, additive versus breaking changes, deprecation, rollout order, and old/new overlap | Contract fixtures or integration tests cover the compatibility window |

For HTTP APIs, the method is the primary source of request semantics **[STANDARD: RFC 9110 §9.1]**. Define whether a custom method is safe, idempotent, cacheable, and how content and status codes work before implementation.

## Architecture and request flow

Start with repository evidence: entry points, routing/registration, dependency injection, configuration, existing context/deadline type, auth middleware, error mapper, persistence/transaction boundary, client adapters, worker lifecycle, telemetry, tests, CI, and deployment configuration. Inspect the current diff before editing.

Preserve the existing direction of dependencies. A typical flow is:

1. **Receive and bound.** Establish a request/job context, reject unsupported protocol input, enforce early size and admission limits, and attach the request/trace identity without logging credentials.
2. **Parse and validate.** Parse exactly once into a typed input. Canonicalize the representation that will be authorized, stored, queried, or interpreted. Validate syntax, semantics, encoding, size, cardinality, and resource cost before expensive work.
3. **Authenticate.** Validate credentials at the transport or identity boundary. Produce a trusted principal or an explicit unauthenticated result. Never treat a client-supplied user ID, tenant ID, role, object ID, or decoded-but-unverified token claim as authorization truth.
4. **Authorize.** Check the principal against the requested function, tenant, object, action, and every returned or mutable sensitive property at the server-side enforcement point. A route name, UI check, upstream check, or user/object-ID equality is not sufficient coverage.
5. **Admit bounded work.** Apply per-operation, per-principal/tenant, and global concurrency/fan-out/queue budgets. Do not create unbounded tasks, batches, streams, retries, or memory growth.
6. **Execute through ports.** Keep domain rules independent from HTTP, queue, database, and vendor types where the project architecture permits. Pass cancellation and deadline context to every fallible downstream operation.
7. **Commit and publish deliberately.** Define which state is durable before an acknowledgement, response, event, or external call. On uncertain outcome, reconcile by the operation's durable identity rather than blindly repeating a non-idempotent side effect.
8. **Map and clean up.** Return one final response or acknowledgement, map the classified error, emit safe telemetry, and release/close/cancel every owned resource on success, failure, timeout, cancellation, and shutdown.

This flow is a design synthesis. Its ordering may be adapted for streaming, authentication handshakes, transactions, or asynchronous consumers only when the altered ownership and failure semantics are documented and tested.

## Validation and data boundaries

- Validate all externally controlled fields at the first trusted boundary and again at a different domain boundary only when the domain invariant requires it. Avoid validating one representation and using another.
- Enforce maximum body/header size, string length, numeric range, array/object cardinality, nesting/decompression cost, page size, batch size, upload size, and query/fan-out cost. Limits must be finite, configurable through the existing configuration boundary, and observable when exceeded **[SECURITY BASELINE: OWASP API4:2023]**.
- Use allowlists for finite methods, enum values, schemes, hosts, ports, redirects, content types, and administrative actions. Use a maintained URL parser for user-supplied URLs; isolate fetching, disable redirects unless explicitly allowed, and never return raw upstream responses **[SECURITY BASELINE: OWASP API7:2023]**.
- Treat third-party responses as untrusted input. Require secure transport, validate and sanitize before passing data to another parser, query, template, command, or domain operation, and bound the resources consumed by the response **[SECURITY BASELINE: OWASP API10:2023]**.
- Validate response shapes as an additional control when the endpoint can expose sensitive object properties. Return only explicitly selected properties and accept only explicitly mutable properties; do not use generic object serialization or mass assignment **[SECURITY BASELINE: OWASP API3:2023]**.
- If validation fails, do not perform the domain side effect. Preserve a stable field-location convention such as JSON Pointer for JSON bodies when the project contract uses it; the convention is an application decision, not a universal requirement.

## Authentication and authorization boundary

Authentication establishes who or what is making the request. Authorization decides whether that principal may perform this exact function on this tenant/resource/object/property in the current state. Keep the two decisions separate.

- For a protected HTTP resource without valid credentials, use `401 Unauthorized` and include at least one applicable `WWW-Authenticate` challenge **[STANDARD: RFC 9110 §§11.3, 11.6.1, 15.5.2]**. Do not use `401` as a generic business denial.
- For valid credentials that are insufficient, use `403 Forbidden` or the project’s documented resource-hiding policy **[STANDARD: RFC 9110 §15.5.4]**. Do not reveal object existence where the security contract requires concealment.
- Check object-level authorization in every function that uses a client-provided object identifier; checking only that the principal is logged in or that a user ID matches is not a complete object-level check **[SECURITY BASELINE: OWASP API1:2023]**.
- Apply explicit grants to every function, with default deny, including alternate methods, administrative actions, bulk operations, exports, callbacks, internal routes, and background jobs **[SECURITY BASELINE: OWASP API5:2023]**.
- Check property-level read/write permissions and construct response DTOs from an allowlisted property set **[SECURITY BASELINE: OWASP API3:2023]**.
- Keep bearer credentials, passwords, reset tokens, API keys, and raw authorization headers out of URLs, logs, traces, metrics, problem details, fixtures, and error messages. Do not invent an authentication scheme. Use the project’s established identity provider and verify its exact token, key, session, or mTLS behavior.
- Protect login, reset, recovery, token refresh, and other authentication flows with the project’s anti-brute-force controls. OWASP explicitly distinguishes API-client authentication from user authentication; an API key is not automatically user authentication **[SECURITY BASELINE: OWASP API2:2023]**.

## HTTP success and error contract

Use the most specific standard status semantics that fit the operation. Do not redefine a standard status code to carry an unrelated business meaning **[STANDARD: RFC 9110 §§3.4, 15]**.

| Condition | Default HTTP mapping | Required handling |
| --- | --- | --- |
| Malformed request syntax or framing | `400 Bad Request` | Reject before domain work; record a bounded reason category |
| Missing/invalid authentication | `401 Unauthorized` | Send `WWW-Authenticate` challenge when the resource is protected |
| Authenticated but not permitted | `403 Forbidden` | Do not leak policy or resource data |
| Resource absent or intentionally hidden | `404 Not Found` | Apply the project’s documented existence-hiding policy consistently |
| State or uniqueness conflict | `409 Conflict` | Return a stable conflict type and make the current state/reconciliation action clear |
| Failed HTTP precondition | `412 Precondition Failed` | Use with verified conditional-request semantics such as `If-Match` where applicable |
| Content too large | `413 Content Too Large` | Enforce the limit before expensive parsing/storage |
| Unsupported request media type | `415 Unsupported Media Type` | Do not infer an unsafe media type from content |
| Semantically invalid well-formed content | `422 Unprocessable Content` | Identify safe field/domain errors; do not perform side effects |
| Rate or admission limit exceeded | `429 Too Many Requests` when adopted | Include a safe explanation and `Retry-After` only when a meaningful delay is known **[STANDARD: RFC 6585 §4]** |
| Temporary overload or maintenance | `503 Service Unavailable` | Optionally include `Retry-After` with a truthful delay **[STANDARD: RFC 9110 §§10.2.3, 15.6.4]** |
| Upstream/gateway deadline exceeded | `504 Gateway Timeout` when acting as a gateway | Stop/cancel the downstream operation and identify the dependency internally |

The exact mapping is a project contract; status codes do not replace domain semantics or a safe error body.

When the project adopts Problem Details, use `Content-Type: application/problem+json` and a JSON object with the RFC-defined members `type`, `title`, `status`, `detail`, and `instance` as applicable **[STANDARD: RFC 9457 §§3.1–3.2]**. `type` is the primary problem identifier; prefer an absolute URI that resolves to documentation. If `status` is present, it is advisory in the body but must match the actual HTTP response status. Extensions such as `errors`, `code`, or `retryable` are application-defined and must be documented per problem type.

Problem details describe the HTTP interface, not the debugging internals. Scrutinize `detail`, `instance`, extensions, and logs for secrets, stack traces, SQL, filesystem paths, token material, object existence, and exploitable implementation information **[STANDARD: RFC 9457 §5]**. Prefer one most relevant problem when unrelated problems cannot be represented coherently.

## Lifecycle, cancellation, and time

Make ownership explicit for servers, clients, pools, transactions, file handles, streams, timers, queues, leases, workers, and telemetry exporters.

- Startup initializes dependencies, validates configuration, and exposes readiness only after the real serving boundary is usable. Startup failure is explicit and leaves no partially owned resource behind.
- Drain stops new admission, marks readiness appropriately, lets bounded in-flight work finish, cancels work past the drain budget, closes listeners/consumers, and waits for owned resources to release. Shutdown must be idempotent.
- A request disconnect, caller cancellation, deadline expiry, or process shutdown must propagate through the existing context/cancellation abstraction to parsers, domain work, transactions, streams, and outbound calls. Cancellation is not a successful result and is not retryable by default.
- Define separate finite budgets for connection/header/body receipt, queue wait, handler/domain work, each dependency, total operation, and graceful drain. A downstream timeout must not outlive the caller’s remaining deadline. Avoid relying on a framework default or a zero value that means “unlimited”.
- Distinguish incomplete client receipt (`408 Request Timeout` semantics), upstream deadline (`504` when acting as a gateway), local overload (`503` or the project’s admission response), and caller cancellation. These are different operational facts.
- Make the commit boundary explicit. Cancellation before commit must prevent the side effect where the underlying abstraction guarantees that; cancellation after commit must return or reconcile the durable result rather than claim that no effect occurred.
- Verify the target runtime’s official cancellation and timeout primitives. For example, Node.js documents `AbortSignal` composition and abort-listener cleanup, and documents that HTTP server request/header timeouts have distinct behavior; those are Node-specific implementation facts, not portable backend rules **[IMPLEMENTATION: Node.js official docs]**.

## Retry, idempotency, and conditional state changes

RFC 9110 defines an idempotent method by intended server effect and identifies safe methods, `PUT`, and `DELETE` as idempotent. It permits automatic repetition after communication failure for idempotent requests and advises against retrying non-idempotent requests without application evidence **[STANDARD: RFC 9110 §9.2.2]**.

Apply this decision sequence:

1. Name the intended side effect and whether repeating the same logical operation is safe.
2. Retry only an explicitly classified transient failure, within a total deadline, attempt cap, and bounded backoff with jitter **[SYNTHESIS]**.
3. Do not retry a non-idempotent request merely because the connection failed before the response was read. First reconcile whether the original effect committed.
4. Honor a truthful `Retry-After` delay where the status and project policy support it. `Retry-After` can be an HTTP date or non-negative delay seconds **[STANDARD: RFC 9110 §10.2.3]**.
5. Never multiply retries across layers without an explicit combined budget. Emit attempt count and final outcome without exposing request content or credentials.

An application-level idempotency key is not defined by RFC 9110. If the operation needs one, define and test this contract as **[SYNTHESIS]**:

- scope the key to operation/version and the authenticated principal or tenant;
- bind it to a canonical request fingerprint and reject a same-key/different-request reuse;
- store the claim and final outcome in a durable, uniqueness-enforced owner; an in-memory map is not sufficient across instances or restart;
- define the in-flight duplicate response, replayed success response, replayed terminal failure, retention/expiry, and recovery of an unknown or abandoned claim;
- record the outcome only at the proven side-effect boundary, and reconcile when the caller loses the response after a possible commit;
- keep the replay response compatible with the original contract and never replay another principal’s result.

For lost-update protection, use HTTP validators and preconditions where they fit. `ETag`/`If-Match` and `412` are standard conditional-request semantics; do not describe an application idempotency key as an ETag or vice versa **[STANDARD: RFC 9110 §§8.8.3, 13.1.1, 13.2]**.

## Bounded concurrency and overload

Treat every user-controlled or dependency-controlled multiplier as a resource budget: concurrent requests, queue depth, batch items, pages, fan-out calls, open streams, bytes, memory, CPU, file descriptors, database connections, worker processes, and paid third-party operations. OWASP identifies missing execution, memory, upload, batch, pagination, and provider-cost limits as API resource-consumption risk **[SECURITY BASELINE: OWASP API4:2023]**.

- Admit work before allocating expensive resources. Use finite queue depth and queue-wait deadline; reject or shed work explicitly when saturated.
- Set separate global, operation, dependency, and principal/tenant limits when the threat or fairness model requires them. Document whether limits are process-local or coordinated across instances.
- Preserve backpressure. Do not use unbounded queues, unbounded `Promise.all`/task spawning, recursive retries, unlimited pagination, or a stream that has no cancellation and byte budget.
- Choose fairness and priority deliberately; privileged or health traffic must not become an unbounded bypass of safety limits.
- Make overload observable with saturation, queue, rejection, and dropped-work signals. A `503`/`429` response without a bounded admission mechanism is not overload protection.

## Observability contract

Emit structured, correlated telemetry at the operation and dependency boundaries. Prefer the project’s existing instrumentation and stable semantic conventions. If OpenTelemetry is used, its HTTP semantic conventions provide stable names for HTTP spans and require low-cardinality route targets rather than raw URI paths for span naming **[IMPLEMENTATION CONVENTION: OpenTelemetry HTTP semantic conventions]**.

At minimum, define bounded fields for:

- service/version/instance, operation and route template, protocol method, outcome class, status, latency, and payload/result size category;
- request/trace/correlation identity, principal class/tenant class rather than raw identity, and authorization decision category;
- queue wait, active concurrency, retry attempt, idempotency outcome, timeout/cancellation reason, dependency name/operation/status, and circuit/admission result;
- exception type and safe internal error category, with sensitive values redacted before emission.

Metrics and labels must have a cardinality owner and limit. Do not put raw URLs, object IDs, tokens, email addresses, arbitrary error text, or request bodies in metric labels. Logs and traces are not proof that a domain operation was correct; they are evidence of observed execution. Verify that failure, cancellation, timeout, duplicate, and overload paths emit the same correlation fields as success paths.

## Compatibility and rollout

Define compatibility for all consumers: HTTP clients, SDKs, browsers, queues, scheduled invocations, webhooks, internal services, stored idempotency results, telemetry consumers, and operational dashboards.

- Prefer additive fields and endpoints. Do not silently change method meaning, required fields, enum meaning, status semantics, error type, retryability, or authorization scope.
- Treat response removal, request-required-field changes, type narrowing, enum meaning, status remapping, authentication changes, and idempotency replay changes as breaking unless the project contract proves otherwise.
- Keep old and new readers/writers compatible during overlap; document rollout order, feature flags, deprecation date, migration/reconciliation, and rollback or forward-fix path.
- Inventory every public host, version, environment, endpoint, integrated service, data flow, authentication mode, error, redirect, rate limit, and CORS policy. Retire old endpoints and debug surfaces deliberately **[SECURITY BASELINE: OWASP API9:2023]**.
- Generate or update contract documentation from the project’s authoritative source and run it in CI where that mechanism exists. Documentation availability is itself an access-control decision.

## Test matrix and acceptance evidence

Derive tests from the operation contract and report exact command, version, environment, boundary, result, and limitation. The minimum applicable matrix is:

| Case | Required assertion |
| --- | --- |
| Valid request/job | Correct status/ack, representation, side effects, and telemetry |
| Empty, null, malformed, wrong encoding/media type | Rejected before side effect with stable safe error |
| Boundary and oversized input | Exact size/cardinality/depth/page/batch limit is enforced |
| Unknown or extra fields | Rejected, ignored, or preserved according to documented compatibility policy |
| Unauthenticated | Auth boundary rejects and emits the required challenge where applicable |
| Expired/forged/wrong-audience credential | No principal or privilege is accepted |
| Wrong function/role/tenant/object/property | Server-side authorization denies; no existence or sensitive property leak |
| Conflict/precondition/duplicate key | Stable conflict outcome; no unintended second side effect |
| Same idempotency key, same request | Defined in-flight/replay behavior and identical safe result |
| Same idempotency key, different request/principal | Rejected and isolated by scope/fingerprint |
| Transient dependency failure | Only allowed retries occur; backoff/deadline/attempt cap and final mapping are asserted |
| Permanent dependency failure | No retry storm; safe error and cleanup |
| Slow dependency/client and caller cancellation | Downstream cancellation, bounded resource lifetime, correct classification |
| Queue/global/tenant saturation | Finite admission, explicit overload response, fairness, and telemetry |
| Disconnect after possible commit | Outcome is reconciled or explicitly unknown; no unsafe blind retry |
| Startup/readiness/drain/restart | No new work after drain, bounded in-flight completion, closed resources, recoverable state |
| Old/new contract overlap | Supported old consumers and new consumers both behave as documented |
| Observability and redaction | Correlation and outcome fields exist; secrets, tokens, raw IDs, and sensitive details are absent |
| Public boundary | Test invokes the route/RPC/consumer/job entry point, not only an internal function |

Evidence labels:

- **FACT:** observed in repository code, configuration, tests, deployment, or an authoritative project document;
- **STANDARD:** behavior required or defined by the cited RFC;
- **SECURITY BASELINE:** OWASP risk/control guidance applied to the modeled API boundary;
- **IMPLEMENTATION:** behavior verified in the exact framework/runtime/library version;
- **TESTED:** reproduced by a named check with scope and result;
- **ASSUMPTION:** needed because an external boundary or environment was not observable;
- **UNVERIFIED:** expected or claimed but not demonstrated;
- **LIMITATION:** what the evidence cannot establish.

Never use a green unit test, type check, coverage percentage, schema file, mock, or framework decorator as proof of the real HTTP/queue/runtime/identity/persistence boundary unless that boundary was exercised.

## Workflow

1. **Discover.** Read project instructions, manifests, entry points, route/consumer registration, existing abstractions, configuration, tests, CI, and current diff. Identify owners and external boundaries.
2. **Write the contract.** Complete every applicable field above, including status/error, auth, side effects, deadline, duplicate, resource, lifecycle, telemetry, and compatibility decisions.
3. **Trace failures.** For each fallible boundary, name the error class, whether work may have committed, cleanup owner, retryability, client response, telemetry, and reconciliation path.
4. **Implement minimally.** Extend the established handler/service/adapter/lifecycle abstraction. Keep public names and unrelated changes. Do not bypass the project’s context, transaction, auth, error, or instrumentation mechanisms.
5. **Verify the matrix.** Run the narrowest relevant unit, integration, contract, failure-injection, concurrency, compatibility, and end-to-end checks. Exercise the public entry point.
6. **Inspect evidence.** Re-read the contract and diff. Separate local results from deployment/provider/runtime evidence. Record skipped checks and why.
7. **Report.** Return changed files, contract decisions, implementation summary, exact validation, acceptance result, assumptions, residual risk, and limitations. Use `PASS` only when all applicable acceptance criteria in the observed scope are met.

## Non-negotiable failure controls

- Do not swallow an error, turn partial success into success, or return an uncommitted result as durable.
- Do not use client-controlled identity, role, tenant, object, or property values as authorization truth.
- Do not retry an unknown non-idempotent outcome without reconciliation or a proven idempotency contract.
- Do not leave timeouts, retries, queues, fan-out, streams, pages, batches, or resource allocation unbounded.
- Do not leak implementation internals or secrets through errors or telemetry.
- Do not claim an RFC defines an application idempotency key, validation schema, retry algorithm, concurrency limit, auth scheme, or observability backend.
- Do not claim compatibility from an additive-looking JSON field alone; check old clients, status/error behavior, persistence, queued messages, and rollout overlap.

## Limitations

RFC 9110 defines HTTP semantics, not a framework architecture, authentication scheme, application validation language, idempotency-key protocol, retry algorithm, queue policy, or service-level objective. RFC 9457 defines a problem-details representation, not which errors an API must expose or how it stores them. OWASP API Security Top 10 2023 is an awareness and risk reference, not an exhaustive security assessment or a substitute for an application threat model. Runtime and framework defaults vary by version and deployment topology. Local tests cannot establish provider, proxy, identity-provider, multi-instance, production-load, or disaster-recovery behavior unless those boundaries are actually exercised. State each limitation instead of upgrading synthesis into a guarantee.

## Interaction with core skills

- `engineering-discovery` owns repository scope, architecture, ownership, assumptions, and general acceptance criteria; this skill adds the backend contract and failure map.
- `engineering-implementation` owns the code change; this skill supplies backend boundary, lifecycle, error, retry, concurrency, and compatibility requirements.
- `engineering-verification` owns execution and evidence reporting; this skill supplies the backend test matrix and prevents internal-only verification from being mistaken for public-boundary proof.
- `engineering-review` owns the independent final verdict; this skill surfaces backend-specific blockers, unsupported guarantees, and residual risks.
