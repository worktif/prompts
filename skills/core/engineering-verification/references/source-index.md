# Engineering verification source index

This index records the authoritative sources used to shape `engineering-verification`. Notes summarize only the claims used by the skill; they are not substitutes for the source text. ISO pages expose abstracts and selected previews, while the full standards remain protected publications. Accessed 2026-09-15.

## Standards and terminology

1. [ISO/IEC/IEEE 29119 series overview](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html) — Establishes the series' vendor- and lifecycle-independent purpose; distinguishes Part 1 concepts, Part 2 processes, Part 3 documentation, Part 4 techniques, and static review coverage in ISO/IEC 20246. Supports the skill's standards-as-reference boundary and routing of process, documentation, and technique guidance.

2. [ISO/IEC/IEEE 29119-1:2022 — General concepts](https://www.iso.org/standard/81291.html) and [public preview](https://www.iso.org/obp/ui?_escaped_fragment_=iso%3Astd%3Aiso-iec-ieee%3A29119%3A-1%3Aed-2%3Av1%3Aen) — Supports the vocabulary and concepts used here: testing as part of verification and validation, sampling rather than exhaustive testing, the test basis and test oracle, risk-based testing, test models, test levels, regression/retesting, environments, data, reporting, and the distinction between informative Part 1 and normative parts. The skill paraphrases these concepts and does not claim conformance.

3. [ISO/IEC/IEEE 29119-2:2021 — Test processes](https://www.iso.org/standard/79428.html?browse=tc) — Supports treating verification as a process that can govern, manage, and implement testing across software-development lifecycles. It is the basis for the workflow's planning/analysis/design/implementation/execution/monitoring/completion shape, adapted here to a repository task rather than copied as a compliance template.

4. [ISO/IEC/IEEE 29119-3:2021 — Test documentation](https://www.iso.org/standard/79429.html?browse=tc) — Supports recording verification outputs and using documentation proportional to the activity. It specifically describes documentation templates as outputs of Part 2 processes; the skill therefore requires an evidence report but does not require every template.

5. [ISO/IEC/IEEE 29119-4:2021 — Test techniques](https://www.iso.org/standard/79430.html?browse=tc) — Supports deriving test design from test techniques rather than source lines alone. The skill keeps equivalence/boundary/state-oriented design and optional property, fuzz, model-based, differential, and metamorphic approaches vendor-neutral and risk-selected.

6. [ISO/IEC/TR 29119-6:2021 — Agile guidance](https://www.iso.org/standard/81293.html) — Supports tailoring testing processes and documentation to agile lifecycles. It is used to avoid imposing a waterfall-only sequence; the skill still requires traceable evidence and rationale for tailoring.

7. [ISTQB Testing Body of Knowledge user guide](https://tbok.istqb.org/help) — Identifies the official ISTQB Glossary as the authoritative reference for testing terminology. Use the [official glossary](https://glossary.istqb.org/) for current term definitions rather than relying on secondary glossaries.

8. [ISTQB CTAL Test Analyst syllabus v4.0](https://istqb.org/wp-content/uploads/sdm-uploads/ISTQB-CTAL-TA-Syllabus-v4.0-EN.pdf) — Supports the test-oracle rule and the test-oracle problem: an oracle determines expected results, but a cost-effective oracle may be unavailable for complex, nondeterministic, probabilistic, data-heavy, or underspecified behavior. This directly supports the skill's `inconclusive` status and explicit tolerance/invariant requirement.

## Runner-specific evidence examples

These sources support only the narrowly scoped examples in the async and evidence rules. They do not make Jest, Vitest, or Playwright prerequisites.

9. [Jest — Testing asynchronous code](https://jestjs.io/docs/tutorial-async) — Supports returning/awaiting asynchronous work and using assertion counting when a fulfilled promise or missing callback assertion could otherwise produce a false pass.

10. [Vitest — Testing asynchronous code](https://vitest.dev/guide/learn/async) and [`expect` API](https://vitest.dev/api/expect.html) — Supports awaiting async matchers, using `expect.hasAssertions()`/`expect.assertions(n)` for callbacks and branches, and treating unawaited asynchronous assertions as a correctness hazard. These are examples of the general async-completion invariant.

11. [Vitest — Coverage guide](https://vitest.dev/guide/coverage) and [coverage configuration](https://vitest.dev/config/coverage) — Supports the claim that coverage depends on a selected provider, included/excluded file set, metric, and threshold; the skill therefore requires reporting the denominator and configuration instead of treating a percentage as proof.

12. [Playwright — Trace viewer](https://playwright.dev/docs/trace-viewer) and [test CLI](https://playwright.dev/docs/test-cli) — Supports retaining trace artifacts for failed or retried browser tests and treating retries as diagnostic evidence. It also documents that retries are a configured maximum, not evidence that a first failure did not happen.

## Deliberate limitations

- The skill does not reproduce ISO or ISTQB definitions at length and does not assert that any project conforms to those standards.
- The sources do not define a universal numeric risk score, coverage threshold, retry count, timeout, or release gate; the skill deliberately requires project- and risk-specific decisions instead.
- Jest, Vitest, and Playwright examples cover only documented runner mechanics. Teams using other tools must apply the underlying invariants using their own authoritative documentation.
