# Documentation source index

This index records the primary sources used by the `documentation` skill. It summarizes how each source informs decisions; it does not reproduce the sources and does not make a project compliant with any standard.

## Normative or standards-oriented sources

- [ISO/IEC/IEEE 26514:2022 — Design and development of information for users (ISO Online Browsing Platform)](https://www.iso.org/obp/ui?_escaped_fragment_=iso%3Astd%3Aiso-iec-ieee%3A26514%3Aed-1%3Av1%3Aen) — informs audience and task analysis, information architecture, development/review/release/maintenance, version/change control, information quality, API/reference versus developer-guide distinctions, and translation/localization considerations.
  - Boundary: the public page exposes informative content only; the complete standard is not reproduced here. Use it as guidance unless the project has formally adopted the standard and has access to the applicable normative text. Do not claim ISO/IEC/IEEE 26514 conformance from this skill alone.
  - Edition check: the source page identifies the 2022 edition and notes that it replaced the 2008 edition. Check the current edition and amendments when a formal standards claim matters.

- [OpenAPI Specification — latest published specification](https://spec.openapis.org/oas/latest.html) and [OpenAPI Specification v3.2.1](https://spec.openapis.org/oas/v3.2.1.html) — normative source for OpenAPI Description structure and semantics when the project adopts OpenAPI; informs API reference fidelity, reusable components, schemas, security, examples, links, deprecation, and version distinctions.
  - Boundary: OpenAPI describes HTTP API interfaces; it does not prove that an implementation is deployed, reachable, secure, or behaviorally conformant without project evidence. Resolve the project-adopted OAS version rather than silently using `latest`.
  - Version distinction used by the skill: the specification version in `openapi` is distinct from the described document version in `info.version` and from the API version.

- [RFC 2119 — Key words for use in RFCs to Indicate Requirement Levels](https://www.rfc-editor.org/rfc/rfc2119) — defines the requirement-level meanings of `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`, and related terms in standards-style documents.
  - Boundary: these meanings are not automatically imposed on ordinary product documentation. The force depends on the document in which the terms are used.

- [RFC 8174 — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words](https://www.rfc-editor.org/rfc/rfc8174) — updates RFC 2119 by clarifying that the special meanings apply when the key words appear in all capitals; lowercase words keep their normal meaning. Use RFC 2119 and RFC 8174 together when defining BCP 14 semantics.
  - Boundary: uppercase keywords are optional and do not make otherwise non-normative prose normative by themselves.

## Non-normative writing and information-architecture guidance

- [Google Technical Writing](https://developers.google.com/tech-writing) — practical guidance for audience and scope, consistent terminology, active and concise prose, document organization, task-oriented headings, and readable lists and paragraphs.
- [Google Technical Writing One objectives](https://developers.google.com/tech-writing/one) — supports audience analysis, scope statements, terminology consistency, concise sentences, list selection, and clear document openings.
- [Google Technical Writing Two summary](https://developers.google.com/tech-writing/two/summary) — supports progressive organization, task headings, captions, useful sample code, anti-examples, and separating documentation for different user types.
- [Google guidance on using LLMs in technical writing](https://developers.google.com/tech-writing/two/llms) — supports using an LLM for drafts, revision, formatting, and summaries only with careful human checking for factual and logical errors. It does not replace source verification.
- [Diátaxis](https://diataxis.fr/) — non-normative model that distinguishes tutorials, how-to guides, technical reference, and explanation according to documentation-user needs. Use it to choose or diagnose information forms; do not impose its taxonomy when the project has another architecture.

## Local engineering application

- **Docs-as-code, link checks, render checks, and acceptance matrices** are workflow controls in this skill, not universal requirements asserted by ISO, Google, OpenAPI, RFC 2119/8174, or Diátaxis. Derive exact commands, generators, renderers, CI gates, and release steps from the repository and report unavailable evidence.
- **API, user, developer, and operations documentation** are content boundaries chosen from the audience and product workflow. The named sources inform their structure and terminology; they do not authorize claims about a particular implementation.
- **Localization** is evidence-driven: ISO/IEC/IEEE 26514 publicly identifies translation/localization considerations and distinguishes the concepts; Google cautions that English recommendations may not transfer unchanged across languages. Project locale configuration and approved translation guidance remain authoritative.

## Research limits

- Sources were checked on 2026-09-15. `latest` pages and external standards can change; pin a version for reproducible release or compliance work.
- The ISO public browsing page is partial and informative. The full normative text, licensed access, adopted project policies, and current implementation evidence may be unavailable.
- External guidance cannot establish current product behavior, deployment status, compatibility, security, performance, or compliance. Those claims require project evidence or an explicitly adopted authoritative contract.
