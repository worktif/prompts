---
name: security
description: Assess and implement security controls for software changes that cross a trust boundary, expose or change a security-sensitive interface, process sensitive data, or modify dependencies, build, release, or security operations; do not activate for purely cosmetic or behavior-preserving work unless security review is explicitly requested.
---

# Security

Use this skill when the requested work can change who may act, what an actor may reach, what data or secrets may be exposed, how untrusted input is interpreted, how software is built or delivered, or how a security event is detected and handled. Activate it for an explicit security review, threat model, hardening request, vulnerability fix, or security acceptance decision even when the code change appears small.

Do not activate for a change that is demonstrably cosmetic, documentation-only, or behavior-preserving with no effect on a trust boundary, sensitive data, dependency/build/release path, or security-relevant observability. If that conclusion cannot be established from repository evidence, inspect first and treat the uncertainty as a security-scope question rather than assuming safety.

This skill is vendor-neutral. Name a vendor, product, protocol, standard, or compliance regime only when the task or repository makes it in scope. Do not claim certification, compliance, complete coverage, absence of vulnerabilities, or production safety from a checklist, tool result, type, or test name.

## Responsibilities

The security workstream is responsible for:

- defining the security scope, assets, actors, trust boundaries, entry points, sensitive data flows, abuse cases, security properties, and residual risks;
- selecting controls at the existing enforcement and ownership points, with an explicit reason each control addresses a modeled abuse case;
- identifying the minimum evidence needed to establish that an applicable control is implemented and effective in the tested scope;
- supplying security-specific negative, boundary, failure, and abuse tests to the verification workstream;
- reporting facts, assumptions, unverified external controls, deployment dependencies, and residual risk separately.

It does not own business risk acceptance, legal interpretation, organizational policy, production deployment, incident command, or a final independent review. Assign those decisions to the existing owner and state when evidence or approval is outside the current task.

## Decision rules

1. Start from repository and task evidence. Establish the changed data flow, control flow, dependency flow, lifecycle, and ownership before selecting a control. Extend the existing security abstraction or policy enforcement point; do not create a parallel middleware, identity model, secret store, audit path, or configuration source.
2. Model risk before choosing mechanisms. Record the asset, actor, trust boundary, entry point, attacker capability, abuse case, impact to confidentiality/integrity/availability/authenticity, existing control, proposed control, owner, and verification evidence. Prioritize by credible impact and attack path, not by the order of a catalogue.
3. Treat authentication and authorization as different decisions. Authentication establishes an identity or principal; authorization must independently decide whether that principal may perform the requested operation on this resource and tenant/context at the server-side enforcement point. Never rely on a client-side check, route naming, hidden UI, or an upstream check whose coverage is not demonstrated.
4. Default security decisions to deny or fail closed when identity, policy, input interpretation, integrity, or a required dependency is missing, malformed, timed out, or exceptional. Preserve availability requirements explicitly; do not silently convert an unavailable policy decision into access.
5. Validate untrusted input for the operation’s syntax, semantics, size, cardinality, encoding, and resource cost before it reaches a sensitive sink. Canonicalize consistently before validation and authorization, and avoid validating one representation while using another. Use parameterization for structured interpreters and contextual output encoding at the final sink; validation is not a substitute for either.
6. Keep secrets, credentials, bearer tokens, private keys, recovery material, and unnecessary personal data out of source, test fixtures, URLs, logs, traces, errors, crash dumps, artifacts, and assistant output. Redaction must be verified against the actual emitted fields and failure paths, not inferred from a logger name.
7. Use established cryptographic primitives and the project’s existing key-management boundary. Do not design cryptography, invent algorithms, weaken verification, or label data “encrypted” without identifying algorithm/configuration, key ownership, lifecycle, failure behavior, and the property provided. Treat confidentiality, integrity, authenticity, and freshness as separate properties.
8. Make token, session, credential, and signed-message lifecycle explicit where applicable: issuance, audience/context binding, expiry, rotation, revocation or invalidation, replay resistance, logout/reset behavior, storage, and failure behavior. Do not infer replay protection from a timestamp or from signing alone.
9. Preserve security state transitions atomically. A failed authorization, validation, callback, transaction, or downstream operation must not leave a partially applied privilege, ownership, balance, workflow state, or audit record. For retries and duplicate delivery, define idempotency and the security effect of reprocessing.
10. Bound work as well as input. Consider payload size, nesting, decompression, parsing, fan-out, pagination, retries, concurrency, file dimensions, query cost, and external-call budgets. Rate limits and resource controls are conditional controls, required when the threat model or business operation makes abuse plausible; never invent thresholds without evidence.
11. Treat errors and exceptional conditions as security behavior. Do not leak secrets, stack traces, policy details, or existence information unnecessarily. Ensure rejected, malformed, missing, timeout, partial, and unavailable states have deterministic handling, appropriate logging, and alerting where the operational owner can act.
12. Treat dependencies, build inputs, generated code, artifacts, update channels, and configuration as part of the attack surface when the change touches them. Record the exact component/version or artifact identity, source/provenance evidence, vulnerability disposition, and any exception owner. A vulnerability scan is evidence about the scan, not proof that the supply chain is safe.

### Control disposition

The following are mandatory work products for every activated security task. They are process requirements of this skill, not a universal claim that every software system needs every listed product control.

- a bounded security scope and threat-model record;
- a decision for every modeled high-impact abuse case: implemented control, accepted residual risk with owner, or blocked/unknown status;
- negative or abuse-oriented verification for each changed security boundary and each applicable invariant;
- evidence that distinguishes repository facts, tests run, environment/configuration checks, deployment assumptions, and unavailable evidence;
- a final report that names residual risk and does not overstate what was verified.

Product controls are conditionally mandatory when their corresponding boundary exists: server-side authorization, safe input-to-sink handling, secret protection, secure error behavior, correct token/session handling, integrity/provenance checks, and resource-abuse controls. Cryptography, replay protection, SSRF defenses, path restrictions, rate limiting, file controls, and security alerting are not universal checkboxes; require them when the data flow, protocol, threat model, or operational dependency makes them applicable.

Automated SAST/DAST/IAST, dependency and secret scanning, fuzzing, property or mutation testing, penetration testing, formal analysis, and external review are optional assurance activities unless the repository, contract, policy, or risk owner makes one mandatory. Select the narrowest activity that can answer the risk question and report its scope and blind spots.

## Non-obvious invariants

Preserve these invariants unless a stronger, explicitly documented system policy applies:

- A principal being authenticated never implies permission for a resource or operation.
- Every externally reachable path to a protected operation enforces the same effective policy, including alternate methods, background jobs, internal endpoints, bulk operations, exports, callbacks, and administrative paths.
- Unknown, malformed, stale, conflicting, or unavailable security inputs do not grant privilege or weaken integrity.
- The representation used for validation, authorization, logging, storage, and interpretation is either the same canonical representation or has an explicit, verified conversion boundary.
- Authorization is decided from trusted server-side state; client claims are inputs to validate, not policy truth.
- A security-relevant side effect cannot commit without the required security decision, and a failed multi-step operation cannot leave a more privileged or more valuable intermediate state.
- A secret is not safe merely because it is absent from the happy-path log; rejected input, exceptions, retries, traces, metrics, test reports, and generated artifacts must be considered.
- A signed or encrypted value is not automatically bound to the intended audience, context, key, freshness, or lifecycle.
- Security telemetry is useful only if the event is emitted at the relevant decision point, avoids sensitive content, preserves enough context for action, and reaches an owner who can respond. Logging without a response path is not incident detection.
- A passing scanner or test covers only its named inputs, configuration, version, environment, and assertions. It cannot establish properties outside that scope.

## Workflow

1. **Establish the boundary.** Read the discovery handoff, `AGENTS.md`, manifests, relevant entry points, policy/configuration, tests, CI/build/release files, and the complete active diff. Identify what is in scope, what is not, what is owned by another system, and what cannot be observed. Do not begin with a generic vulnerability list.
2. **Build the security model.** Trace actors, assets, trust boundaries, entry points, data and control flows, privileged operations, external dependencies, and lifecycle transitions. Write concrete abuse cases with attacker capability, preconditions, impact, and affected security property. Use the NIST threat-modeling source in [references/source-index.md](references/source-index.md) for risk-modeling boundaries; it is an initial public draft, not a final universal methodology.
3. **Select controls and owners.** For each abuse case, choose the existing enforcement point and the smallest control that removes or reduces the attack path. For web applications and services, use versioned OWASP ASVS 5.0.0 requirement identifiers when they sharpen a testable requirement; record the level and scope rather than saying “ASVS compliant.” Use OWASP Top 10:2025 only to frame awareness and risk vocabulary, never as an exhaustive control list. Use NIST SSDF v1.1 to frame lifecycle, artifact, release, and vulnerability-response work.
4. **Implement through existing architecture.** Keep policy decisions close to the protected resource or operation, keep parsing/validation separate from authorization where the design does, preserve public contracts, and make failures explicit. If a control requires deployment, identity-provider, gateway, key-management, network, runtime, or monitoring configuration outside the repository, document the dependency instead of simulating it in code.
5. **Verify the abuse cases.** Derive tests from the threat model and invariants. At minimum, cover the valid case plus applicable unauthorized, wrong-tenant/resource, missing/expired/forged/replayed credential, malformed/canonicalization-conflict, oversized/resource-cost, duplicate/retry, timeout/unavailable, partial-failure, and error-redaction cases. Add integration or contract tests when the control boundary is outside a pure unit. Use safe test data and isolated environments; do not exploit production or expose real secrets.
6. **Inspect evidence.** Run the smallest relevant repository checks, then required type/lint/build/package and security checks, followed by wider suites justified by the risk. Inspect changed behavior, reports, generated artifacts, and configuration. Record exact commands, versions, scope, results, skipped checks and reasons, and whether each result is local, test-environment, or post-deployment evidence.
7. **Report and hand off.** Return a concise security record containing scope, threat model summary, controls and owners, changed files, tests and evidence, residual risks, deployment/configuration dependencies, and unresolved limitations. Use `PASS` only when all applicable acceptance criteria in the observed scope are met; use `FAIL` for a blocking defect or missing mandatory control; use `BLOCKED` when a required boundary or evidence source cannot be inspected. A `PASS` never means “no vulnerabilities” or “secure in every environment.”

## Failure modes to actively check

- A green scanner is treated as proof that business-logic authorization, insecure design, logging/alerting, or exceptional-condition behavior is correct.
- Authorization exists in one route or UI path but is absent from a bulk, export, callback, job, alternate protocol, or direct resource path.
- A middleware, gateway, type, decorator, test name, or framework default is assumed to enforce a control without tracing its coverage and failure behavior.
- Input is sanitized for one parser and then interpreted by another parser, or output is encoded for the wrong sink/context.
- A security decision fails open during timeout, cache miss, parsing error, partial outage, or exception.
- A secret or personal datum leaks through an error, retry, trace, metric label, URL, fixture, artifact, or debug branch.
- Token signing is mistaken for audience binding, expiry, revocation, freshness, or replay resistance.
- A dependency is “patched” by suppressing a finding, upgrading without compatibility/provenance evidence, or scanning only direct dependencies.
- A transaction, permission change, webhook, or retry leaves a partial side effect or allows duplicate security-sensitive processing.
- A control is implemented in application code while the effective boundary is deployment configuration, or deployment configuration is claimed without environment evidence.
- OWASP Top 10 categories are used as a complete checklist, an old ASVS identifier is cited without a version, or draft guidance is presented as a finalized requirement.
- Security scope expands into unrelated refactoring, compliance/legal advice, incident response, or production mutation without explicit authorization and ownership.

## Verification and evidence record

For each applicable control, record:

`control or invariant` → `enforcement point` → `abuse case addressed` → `test/check and exact scope` → `result` → `evidence owner` → `residual risk or deployment dependency`.

Use these evidence labels:

- **FACT:** observed in code, configuration, repository history, or an authoritative project document;
- **TESTED:** reproduced by a named check, test, review, or controlled experiment, including its scope;
- **ASSUMPTION:** required because an external boundary or environment was not observable;
- **UNVERIFIED:** expected or claimed but not demonstrated;
- **RESIDUAL:** remaining likelihood/impact, accepted exception, or follow-up owner.

Never include secret values, exploit payloads that are not necessary to explain the finding, or unnecessary personal data in the report. Include enough sanitized input shape, resource identity, privilege context, and failure mode to reproduce the security decision. Link versioned source requirements and project evidence; do not use an unversioned “latest” citation for a durable claim.

## Interaction with the core engineering skills

- **Engineering Discovery** owns repository reconnaissance, architecture, scope, ownership, assumptions, and general acceptance criteria. Security consumes that handoff and adds the security model, abuse cases, security properties, and security-specific acceptance criteria; it must not duplicate discovery or invent facts absent from it.
- **Engineering Implementation** owns the code change and its architecture-preserving implementation. Security specifies the required control outcome and enforcement boundary, reviews security-sensitive implementation choices, and prevents parallel policy/state/lifecycle paths; implementation remains responsible for maintainable code, public contracts, and ordinary error/lifecycle design.
- **Engineering Verification** owns execution of repository checks and the final verification record. Security supplies abuse cases, applicable invariants, negative/boundary/failure tests, and evidence interpretation; verification reports exact commands and separates local, test-environment, and deployment evidence.
- **Engineering Review** owns the independent PASS/FAIL review of the actual diff and repository state. Security surfaces blockers, residual risks, unsupported security claims, and missing evidence for that review; it must not self-approve a change merely because its own checks pass.

When a core skill is not available, preserve its responsibility in the handoff record and state the missing evidence or review explicitly rather than silently taking credit for it.

## Focused sources

Read [references/source-index.md](references/source-index.md) when selecting or citing the source families used by this skill. The index records the stable version, scope, exact support, and non-use boundary for each source; it is intentionally not a tutorial or a substitute for the source documents.
