---
name: frontend
description: Build or change browser or client UI when user-visible interaction, rendering, forms, navigation, accessibility, client state, or browser APIs are in scope; do not activate for backend-only, infrastructure-only, copy-only, or generic review work unless the frontend contract or behavior changes.
---

# Frontend

Design, implement, or investigate user-visible browser/client behavior at the UI boundary. Preserve the application’s existing framework, component, routing, styling, data-fetching, and state-management abstractions. This skill is optional domain guidance: the four core engineering skills still own discovery, implementation, verification, and independent review.

Read [references/source-index.md](references/source-index.md) when a task needs the cited accessibility criteria, WAI-ARIA interaction pattern, browser API behavior, or performance/security evidence. Treat those sources as guidance or standards references; they do not by themselves establish that the product conforms.

## Activation boundary

Activate when the requested work changes or diagnoses any of the following:

- rendered UI, component behavior, layout, responsive/reflow behavior, styling that changes interaction, or hydration/client rendering;
- forms, validation, focus, keyboard/pointer/touch interaction, menus, dialogs, tabs, comboboxes, drag-and-drop, live updates, or other custom widgets;
- client routing, URL/query/fragment state, browser history, deep links, refresh/back/forward behavior, or navigation guards;
- browser-side data loading, caching, optimistic updates, retries, cancellation, persistence, service workers, permissions, or browser APIs; or
- frontend-specific accessibility, compatibility, responsiveness, performance, privacy, or security behavior.

Do not activate for backend-only or infrastructure-only changes, content-only edits with no UI behavior, a purely visual asset/document edit, or a generic performance/security/review request with no frontend boundary. Activate alongside the relevant optional skill when the same change crosses a backend, security, performance, distributed-systems, AI/LLM, cloud, database, or migration boundary. If a shared module changes an API consumed by the UI, treat the affected UI contract as in scope.

## Operating contract

Before editing, identify:

1. The user-visible outcome, affected route/component/flow, supported input modalities, and explicit exclusions.
2. The current entry point, rendering lifecycle, data source, state owner, existing abstraction to extend, and relevant tests/build configuration.
3. The state transitions and failure behavior for initial load, loading, success, empty, validation error, authorization error, server error, network failure, retry, cancellation, refresh, navigation, and unmount where applicable.
4. The applicable accessibility criteria and interaction pattern, supported browser/device matrix, performance/security risks, and acceptance evidence.

Use the smallest architecture-preserving change. Do not create a second router, cache, state store, request path, validation model, or lifecycle mechanism when the application already has one. Do not replace a native control or established framework abstraction with a custom implementation without an evidence-backed need.

## UI state and data ownership

Make ownership explicit before adding state. Keep these categories distinct:

- **Remote/server data** — authoritative records returned by an API or server render. Normalize at the boundary, preserve its loading/error/freshness semantics, and update it through the existing data access/cache owner.
- **URL/navigation state** — route, query, fragment, or history state that must survive refresh, back/forward, or sharing. Use the existing router/history owner; make each URL transition reproducible by direct load and back/forward.
- **Local UI state** — transient visibility, focus-related state, selected tab, expanded section, pending interaction, and other view concerns. Keep it close to the component or existing UI-state owner.
- **Form/draft state** — user-entered values and dirty/submitting status. Preserve values through validation and recoverable failures unless the product contract says otherwise; do not treat client validation as a security control.
- **Persisted client state** — storage, IndexedDB, service-worker, or offline state. Define its schema, lifetime, privacy sensitivity, quota/error behavior, invalidation, and migration/rollback path before using it.
- **Derived state** — values calculable from authoritative state. Compute it; do not store a second mutable copy unless a measured performance or lifecycle constraint justifies it.

For asynchronous work, associate each result with the request/route/input that started it. Abort or ignore work that is no longer relevant, prevent stale responses from overwriting newer state, clean up listeners/timers/observers on disposal, and define duplicate-submit and retry semantics. Optimistic UI is a product decision: specify the pending, confirmation, rollback, conflict, and retry behavior rather than assuming success.

Keep rendering, user intent, side effects, and data access at their existing boundaries. A component may display a snapshot and emit an intent; the established controller/hook/service/store owns the side effect and authoritative update. Do not read from a second source merely to make one view convenient.

## Accessibility requirements

Use the applicable WCAG 2.2 success criteria as the conformance target named by the product or policy. At minimum, inspect the relevant criteria for keyboard operation and traps, focus order/visibility/obscuration, semantics and accessible name/role/value, labels/instructions, error identification, status messages, contrast, reflow/zoom, pointer gestures, dragging alternatives, target size, timing, and motion. The applicable level and exceptions must be stated; do not imply that every criterion applies identically to every component.

- Prefer semantic HTML and native controls (`button`, `a`, form controls, headings, lists, landmarks) before ARIA. Use ARIA to express a real semantic relationship or custom pattern, not to make a non-control behave like a control by declaration alone.
- Make every operation available without a specific pointer gesture. Provide visible, non-obscured keyboard focus, a logical focus order, and no keyboard trap. Do not suppress browser text-editing, zoom, selection, or assistive-technology interaction without a documented product need.
- Give every control an accurate accessible name. Associate labels, instructions, groups, required state, current value, and errors with the control. Preserve user input when validation fails; identify the error and provide a correction path. For dynamically inserted errors or important non-interactive updates, use a suitably scoped status/live mechanism without stealing focus for passive information.
- For a custom widget, select the closest WAI-ARIA APG pattern and implement its roles, states, properties, focus model, and keyboard behavior as a coherent unit. Do not mix keyboard conventions from unrelated patterns. Prefer a native equivalent when it meets the requirement.
- For dialogs, move focus into the dialog, contain focus while modal, provide an explicit close operation and an appropriate Escape behavior, make the dialog identifiable, and return focus to the invoking or next logical control. Prefer native `<dialog>` behavior where the application’s browser support and styling constraints permit it; test the actual implementation rather than assuming the element solves all content-labeling needs.
- Respect zoom, reflow, high-contrast/forced-colors, reduced-motion, text expansion, and touch/keyboard differences when they affect the flow. Do not communicate meaning by color, motion, hover, or pointer-only feedback.
- Test the accessibility tree and interaction, not only DOM attributes or visual appearance. Automated checks are a filter for detectable issues, not proof of WCAG conformance. Report the browser, assistive technology, operating system, viewport/zoom, input modality, and tested flows.

## Browser behavior and failure modes

Model browser and network behavior explicitly. The UI must expose a usable state for each applicable row, not leave a blank area, spinner, disabled control, or stale result as the only signal.

| Boundary | Required behavior to define and test |
| --- | --- |
| First load, refresh, hydration, or JavaScript unavailable | Establish the supported fallback or a clear failure message. Avoid duplicate submissions and hydration-time state replacement; preserve server-rendered content when the architecture supports it. |
| Slow or offline network | Show progress without blocking unrelated work, preserve entered data, allow retry/cancel as appropriate, and avoid retry storms. Distinguish offline/unreachable from an application-level response when the user can act differently. |
| HTTP error or malformed payload | Treat non-success responses and invalid data as failures at the boundary; show a safe, actionable state. Do not assume `fetch()` rejects for an HTTP error, and do not render unvalidated server data as trusted markup. |
| Cancellation, unmount, route change, or superseded input | Abort work where supported or ignore its result. Do not announce cancellation as a server failure, update an unmounted view, or let an old search/navigation result win. |
| Duplicate activation, retry, timeout, or partial success | Define idempotency and user feedback with the API owner. Keep the user informed about pending/confirmed/unknown outcome; never silently issue unbounded retries for a non-idempotent action. |
| Back/forward, direct deep link, and missing route | Restore or fetch the state represented by the URL. Handle initial history state and `popstate` through the existing router; do not rely only on an intercepted click. |
| Storage unavailable, quota exceeded, stale schema, or private browsing behavior | Treat storage as fallible. Fall back to an in-memory path where safe, avoid losing the active task, and do not persist sensitive data merely for convenience. |
| Missing/blocked browser feature, permission, media, font, image, or third-party resource | Feature-detect where needed, provide a supported fallback, reserve layout space, and make the primary task usable when optional content cannot load. |
| Resize, orientation, zoom, text expansion, reduced motion, forced colors, and touch | Re-evaluate layout and interaction without losing state or focus. Test at supported boundaries, not only the developer viewport. |

Use browser-native behavior where it supplies a correct fallback, then add only the required enhancement. Treat compatibility tables and the project’s supported-browser policy as evidence for a feature decision; do not claim universal browser support from a single local run.

## Testing matrix

Derive the matrix from the changed flow and risk. Test observable behavior at the component or browser boundary, not private implementation details alone.

| Area | Minimum applicable evidence |
| --- | --- |
| Rendering and state | Initial, loading, success, empty, validation, authorization, failure, retry, cancellation, stale-result, duplicate-action, unmount, and refresh transitions. Assert preserved input and the final authoritative state. |
| Interaction | Keyboard-only traversal and activation; focus entry, visibility, order, containment, return, and Escape behavior; pointer/touch; zoom/reflow; and any pattern-specific keys. Include disabled, unavailable, and long-label cases. |
| Accessibility | Semantic/accessibility-tree inspection, automated rules as a first pass, and manual screen-reader checks for changed flows. Check labels, headings/landmarks, errors, status announcements, dialogs, and custom widgets. Do not report “accessible” without naming scope and environment. |
| Navigation | Direct URL load, internal navigation, query/fragment changes, refresh, browser back/forward, open-in-new-tab where supported, route failure, and restoration of URL-owned state. |
| Browser/responsive | Project-supported browser engines and versions, at least one narrow/touch viewport and one wide/keyboard viewport, device pixel ratio/zoom cases where layout matters, and feature-disabled or permission-denied cases when relevant. |
| Network/data | Offline or blocked request, slow response, HTTP 4xx/5xx, malformed/partial response, timeout, abort, out-of-order response, retry, and duplicate submission. Validate that no sensitive data enters UI errors or logs. |
| Performance | Measure the affected user flow under representative device/network conditions. Inspect critical rendering, main-thread work, layout stability, interaction latency, resource loading, memory/listener cleanup, and field versus lab evidence when available. |
| Security/privacy | Trace untrusted input and server data through DOM, URL, CSS, storage, logs, navigation, and third-party sinks. Verify safe output handling, URL allow-listing, authorization-dependent UI behavior, secret exclusion, and CSP/Trusted Types controls where adopted. Client checks never replace server validation or authorization. |

Choose the cheapest test level that proves the criterion, then add browser E2E or manual assistive-technology checks where component tests cannot observe the platform boundary. Record skipped cases and why they are not applicable; do not convert “not tested” into “passed.”

## Performance and security boundaries

### Performance

Optimize measured user impact, not an abstract score. Keep critical rendering and interaction work small; avoid unnecessary JavaScript, layout/paint churn, synchronous main-thread work, duplicate fetches, and unbounded lists. Reserve dimensions for media and late content to reduce layout movement. Use native lazy loading for genuinely off-screen images/iframes when appropriate; do not lazy-load likely above-the-fold/LCP content, and do not add JavaScript where the browser already provides the required capability. Clean up observers, timers, event handlers, subscriptions, and in-flight work.

Use project-defined budgets and the relevant Core Web Vitals or product metrics only when their scope, population, measurement method, and threshold are named. Lab traces help diagnose a revision; field data describes real users. Neither alone proves every device, route, or interaction is fast.

### Security and privacy

Treat URL parameters, fragments, form input, API responses, storage, postMessage data, and third-party content as untrusted unless the owning contract proves otherwise.

- Render untrusted values as text or through the framework’s safe data-binding path. For HTML, URL, CSS, and script contexts, use context-appropriate validation/encoding or a vetted sanitizer; avoid string-built markup, `document.write`, dynamic code execution, unsafe event-handler attributes, and unvalidated `href`/`src`/redirects.
- Keep secrets and authorization decisions out of client-only code. Do not put tokens, sensitive data, or internal error details in URLs, local storage, analytics, or console/error messages unless the product’s security design explicitly allows it. UI gating is not authorization.
- Treat Content Security Policy and Trusted Types as defense-in-depth controls that complement safe DOM construction; do not use them to excuse unsafe sinks. Coordinate cookies, CSRF, CORS, authentication, authorization, headers, rate limits, and server-side validation with the backend/security owner.
- Minimize third-party scripts and permissions. Record their data access, origin, loading/failure behavior, and trust decision when the change introduces or modifies them.

If the change requires a threat model, cryptographic decision, authentication/authorization design, server-side validation, security headers, dependency/supply-chain assessment, or penetration test, activate or hand off to the security skill. Frontend evidence can show a client behavior; it cannot certify the system’s security boundary.

## Evidence and reporting

Report only what was observed or can be traced to an explicit source. For each material claim, separate:

- **Requirement** — user, product, policy, or adopted project contract;
- **Project fact** — current code, configuration, test, build output, or observed browser behavior;
- **External guidance** — a linked WCAG/WAI/WHATWG/MDN/other authoritative recommendation or specification;
- **Inference/assumption** — reasoning or a safe local choice that is not directly proven; and
- **Unknown/limitation** — unsupported browser, assistive technology, deployment, field-data, or test boundary.

For implementation or verification, record the affected flow and state owner, files/components changed, exact checks and results, browser/device/AT and network conditions, and remaining risk. Separate local, CI, staging, production, lab, and field evidence. Cite the exact source URL when a standard or browser behavior influenced a decision; do not copy long source text, and do not claim WCAG conformance, browser universality, security, or performance without a scoped proof target.

For a defect, report the user scenario, preconditions, action sequence, expected/observed result, affected state or boundary, reproducibility, evidence, and smallest correction or follow-up. Preserve unknowns rather than filling them with plausible framework behavior.

## Interaction with the four core skills

- **`engineering-discovery`** establishes the change boundary, current architecture, data/control flow, state ownership, risks, requirements, and acceptance criteria. Frontend adds the UI state machine, browser/assistive-technology boundaries, and interaction-specific failure modes; it does not silently turn external standards into project requirements.
- **`engineering-implementation`** owns product edits within the authorized boundary. Frontend supplies the component/routing/data-flow and accessibility decisions; implementation must extend existing abstractions and return a changed boundary or ownership conflict to discovery rather than creating a parallel path.
- **`engineering-verification`** owns running and reporting checks. Frontend defines the applicable rendering, keyboard, accessibility, responsive, browser, network, performance, and security matrix; it must not report a planned or partially executed check as passed.
- **`engineering-review`** independently judges the actual diff/design and evidence. Frontend supplies the relevant contracts, patterns, browser limitations, and residual risks; review may reject unsupported claims or insufficient evidence and does not replace implementation or verification.

Normal sequence: discovery bounds the UI change; implementation changes it; verification exercises the browser-visible contract; review independently challenges the result. Re-enter discovery when a UI state owner, public contract, supported-browser boundary, security boundary, or acceptance criterion changes.

## References

Use [references/source-index.md](references/source-index.md) for the maintained source map and routing notes.
