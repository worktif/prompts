# Source index

Checked 15 September 2026. These are source links for decisions in `SKILL.md`; they are not a claim that the project adopts every recommendation or conforms to every criterion.

## Accessibility standards and WAI guidance

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) — normative success criteria and conformance language for keyboard operation, focus, semantics/name-role-value, contrast, reflow, input modalities, timing, errors, status messages, and the WCAG 2.2 additions. Use the specific criterion and conformance level applicable to the product; do not turn the index into a checklist of universal requirements.
- [WCAG 2.2 changes](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) — identifies the nine new WCAG 2.2 success criteria and the removal of 4.1.1 Parsing; useful when deciding whether a requirement is specifically about WCAG 2.2.
- [WAI Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/) — labels, grouping, instructions, validation, notifications, custom controls, and time limits; use for form-flow design alongside the applicable WCAG criteria.
- [WAI Labeling Controls](https://www.w3.org/WAI/tutorials/forms/labels/) — explicit/implicit label association, button labels, and mobile form-control labeling.
- [WAI Validating Input](https://www.w3.org/WAI/tutorials/forms/validation/) — native and custom validation, forgiving input, confirmation/undo, and the boundary that client validation does not provide security.
- [WAI User Notification](https://www.w3.org/WAI/tutorials/forms/notifications/) — concise success/error feedback, error summaries, links to invalid controls, focus after validation, and dynamic `alert` handling.
- [WAI Page Structure Tutorial](https://www.w3.org/WAI/tutorials/page-structure/) — page regions/landmarks, headings, meaningful content structure, and navigation/orientation.
- [WAI-ARIA APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) — pattern selection and the APG catalog; read the specific pattern instead of inventing a keyboard model.
- [APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — modal focus entry/containment/return, Escape, close control, labeling, and when not to flatten structured content into `aria-describedby`.
- [APG Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — menu-button roles/states and Enter/Space/arrow behavior.
- [APG Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — editable/select-only distinction, popup behavior, accessible name/value, and keyboard interaction.
- [APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — tablist focus movement, activation models, and panel relationship.

## Browser and platform behavior

- [WHATWG HTML: dialog element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element) — normative dialog, modal, focus, close, and `formmethod="dialog"` behavior. Check the project’s browser support before relying on a feature.
- [WHATWG HTML: session history and navigation](https://html.spec.whatwg.org/multipage/browsing-the-web.html#history-traversal) — browser navigation/session-history model; use with the project router when reasoning about refresh and back/forward.
- [WHATWG HTML: Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html) — origin-scoped `localStorage`/`sessionStorage` behavior and persistence boundary; storage is not assumed available or suitable for sensitive data.
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — network rejection versus HTTP response handling, `Response.ok/status`, CORS modes, response-body failures, and `AbortController` cancellation.
- [MDN: Working with the History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API) — SPA `pushState`/`replaceState`, `popstate`, initial-state restoration, and back/forward handling.
- [MDN: `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) — implementation and accessibility details for native dialogs, focus, Escape, inert background, close controls, and form return values.
- [MDN: ARIA live regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) — announcing dynamic non-focus updates, choosing urgency, and avoiding unnecessary focus movement.
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — detecting the user’s reduced-motion preference in CSS.

## Performance and security boundaries

- [web.dev: Web Vitals](https://web.dev/articles/vitals) — Core Web Vitals measurement, the distinction between field and lab data, and limits of CrUX versus application telemetry.
- [web.dev: Lazy-load images and iframes](https://web.dev/learn/performance/lazy-load-images-and-iframe-elements) — native `loading`, why above-the-fold/LCP images should not be lazy-loaded, and when JavaScript lazy loading is justified.
- [MDN: Performance data](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Performance_data) — browser performance entries and asynchronous `PerformanceObserver` measurement.
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) — CSP as defense in depth and Trusted Types directives for DOM XSS sinks; not a substitute for safe data handling.
- [OWASP: Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — context-sensitive output encoding/validation, safe URL handling, DOM XSS boundaries, CSP, and Trusted Types.
- [OWASP: DOM based XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html) — client-side DOM sinks, treating untrusted data as text, and safer DOM construction patterns.

## Research boundary

Use WCAG for normative conformance claims, WAI/APG for accessibility patterns, WHATWG for platform semantics, MDN for implementation-oriented browser behavior and compatibility notes, web.dev for performance measurement guidance, and OWASP for security prevention guidance. Framework documentation is intentionally absent: this skill preserves the project’s chosen framework rather than prescribing one. Automated accessibility/performance tools cover only the dimensions they actually exercise; keyboard, assistive-technology, failure-mode, and representative-environment checks remain necessary when those boundaries are in scope.
