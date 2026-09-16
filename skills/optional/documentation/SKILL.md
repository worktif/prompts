---
name: documentation
description: Create or maintain source-faithful technical documentation for APIs, users, developers, and operators, including docs-as-code workflows, executable examples, versioned releases, localization, and rendered-output verification; do not use for generic prose editing without a product or authoritative-source boundary.
---

# Documentation

Use this skill when documentation is part of a real software product, interface, release, support, or operational workflow. The repository, product behavior, adopted contracts, and explicit user requirements are the source of truth for claims about the system. Read [references/source-index.md](references/source-index.md) when the task needs the standards and guidance summarized there; it is a source map, not a license to copy standards text or to claim compliance.

## Activation boundaries

Activate for:

- creating or updating technical, developer, API, user, troubleshooting, runbook, deployment, or operational documentation;
- documenting a public interface, schema, CLI, configuration, workflow, error, lifecycle, compatibility rule, deprecation, or release;
- changing docs in a repository where build, generation, localization, link checking, examples, or rendered output can fail;
- assessing whether existing documentation is accurate, complete for a stated audience, or aligned with an implementation or contract.

Do not activate for a self-contained spelling or formatting edit with no product claim, a generic writing lesson, or a design/code change whose documentation impact is explicitly out of scope. If a small edit changes an API, security, operations, compatibility, or user-facing guarantee, activate this skill and the relevant core skill.

## Authority and source fidelity

Before writing, establish a source map for each material claim:

1. explicit user requirements and acceptance criteria;
2. applicable repository instructions, project conventions, adopted specifications, public contracts, and release policy;
3. current executable/configured behavior, schemas, generated artifacts, tests, and safe command observations;
4. approved design or product documents for intended behavior, clearly labeled as intent;
5. external guidance for terminology, information architecture, and writing technique.

Current code/configuration and observed behavior describe what the product does now. A stale README, issue, comment, or historical commit does not override them. A requirement or design document may describe what the product should do, but it is not evidence that the behavior is implemented. When sources conflict, report the conflict and its scope; do not silently choose a convenient claim.

For every non-trivial page or section, preserve the distinction between:

- `[SOURCE REQUIREMENT]` — requested or adopted requirement;
- `[PROJECT FACT]` — verified from current project evidence;
- `[INTENDED BEHAVIOR]` — approved target not yet proven in the current product;
- `[EXAMPLE]` — illustrative or synthetic content, never an implicit promise;
- `[UNKNOWN]` or `[LIMITATION]` — unresolved or inaccessible evidence.

Do not invent supported versions, metrics, limits, security properties, deployment state, compatibility, commands, output, owners, or recovery guarantees. If a claim cannot be traced to a source, narrow it, mark it, or remove it.

## Documentation design

Start with the audience, task, scope, prerequisites, and expected outcome. Choose the smallest document set that lets that audience complete the task or understand the stated subject. Use the project's established information architecture and style guide when present. Use Diátaxis as a non-normative organizing lens, not as a mandatory site taxonomy:

- **Tutorial**: a guided learning path with a known starting point and working result;
- **How-to**: a focused procedure for a user who has a concrete goal;
- **Reference**: complete, lookup-oriented facts about a contract, option, command, schema, or API;
- **Explanation**: context, rationale, trade-offs, limits, and conceptual behavior.

These forms may be separate or combined only when the repository's information architecture calls for it. Do not turn reference material into a tutorial, or hide essential procedure and failure behavior in explanation prose.

### API and developer documentation

When an adopted OpenAPI Description exists, inspect and use the project-adopted version of it as the API contract. Validate that paths, methods, parameters, request/response schemas, status codes, security requirements, examples, callbacks/webhooks, deprecations, and server URLs match the implementation and tests in scope. Keep generated reference pages derived from the contract; put task-oriented setup and workflows in a separate guide when that is how the project is organized.

Do not treat an OpenAPI file as proof that an endpoint is deployed or behaves as described. If the implementation and description disagree, state which is current, which is intended, and whether the task updates the contract, the implementation, or only the prose. Do not document internal functions as public API unless the project exposes and supports them.

### User documentation

Explain what the user can accomplish, prerequisites, inputs, steps, expected result, important choices, failure or recovery behavior, and how to verify success. Name the intended user and context. Keep task steps ordered and observable. Include safety, data-loss, permissions, and irreversible-action warnings only when supported by product behavior or an authoritative requirement.

### Operations and support documentation

For runbooks, deployment notes, troubleshooting, and incident procedures, document only the environment and responsibility boundary established by the project. Include prerequisites, safe inspection, decision points, actionable commands, expected observations, escalation/rollback conditions, and post-action verification when those are part of the supported workflow. Separate local, CI, staging, production, and post-deployment evidence. Never imply that a command is safe, idempotent, reversible, or production-ready without evidence.

## Docs-as-code workflow

When documentation is maintained in a repository, treat its source files, generators, schemas, fixtures, translations, and site configuration as a dependency graph:

1. locate applicable instructions, manifest, docs entry points, generators, templates, navigation, versioning, localization, and CI checks;
2. identify the canonical source and generated-output boundary before editing;
3. make the smallest change in the canonical source; do not hand-edit generated output unless the project explicitly makes it canonical;
4. preserve front matter, anchors, navigation, admonition syntax, code-fence language, links, and local style;
5. run the narrowest configured documentation, example, schema, link, lint, build, localization, and render checks that cover the change;
6. inspect the diff and generated/rendered result, then report checks that were run, skipped, blocked, or only planned.

There is no universal docs-as-code toolchain. Infer commands from repository configuration and documented workflows; if no check exists, perform the strongest safe inspection available and record the limitation. Do not add a new documentation framework, generator, or CI gate merely because it is familiar.

## Commands, code, and examples

For each command or example, establish whether it is executable, illustrative, generated, or copied from a verified project fixture. Executable examples must use the documented shell/context, supported names, current flags, valid inputs, and safe non-secret data. Run them when the environment and side effects permit; otherwise state exactly what was not run and why. Do not include credentials, private URLs, destructive production commands, or fabricated output.

Prefer short examples that prove one useful idea. Keep sample code accurate, clear, bounded, and commented where the reader needs the rationale. Include anti-examples only when they clarify a likely failure. If output is shown, label it as observed or illustrative and keep it consistent with the command and version. A code block that merely parses is not proof that the workflow succeeds.

Use RFC 2119/8174 requirement keywords only when the document intentionally defines a standards-style requirement vocabulary. In that case, use the uppercase forms with their defined meaning and state the governing BCP 14 references near the document's beginning. Lowercase “must,” “should,” and “may” retain ordinary English meaning; do not accidentally create a protocol requirement through capitalization.

## Versioning, compatibility, and localization

Record the relevant product, API, documentation, schema, dependency, and specification versions separately. For OpenAPI, do not confuse the `openapi` field (the specification version) with `info.version` (the description version) or the API version. Resolve `latest` links to the project-adopted version when reproducibility matters. Tie version-specific behavior, examples, deprecations, migration notes, and navigation to the release/versioning mechanism actually used by the repository.

For localization and internationalization:

- identify the source language, supported locales, translation source, locale fallback, and whether the task changes source or translated content;
- preserve code, identifiers, placeholders, URLs, commands, units, and machine-readable values exactly unless the product explicitly localizes them;
- distinguish translation from regional adaptation, and verify date, time, number, sorting, text direction, screenshots, and UI labels where they affect the task;
- do not assume that an English style rule transfers unchanged to another language; use the project's locale-specific guidance or mark the gap;
- check that localized pages remain reachable, render correctly, and do not lag behind a changed source claim.

## Validation and acceptance

Build a compact documentation acceptance matrix before declaring completion:

| Claim or artifact | Source/oracle | Observable check | Result |
| --- | --- | --- | --- |
| Behavior, contract, or limit | Current implementation, config, adopted schema/spec, test, or approved requirement | Inspection, contract check, safe command, or test | PASS / FAIL / BLOCKED / UNKNOWN |
| Audience and task fit | User request, project information architecture, or approved style guide | Content review against scope and prerequisites | PASS / FAIL |
| Command or example | Fixture, implementation, schema, or observed run | Execute safely or verify syntax/data/expected result | PASS / ILLUSTRATIVE / NOT RUN |
| Link, anchor, image, navigation, or generated reference | Docs source and site/build configuration | Link checker, build, or targeted inspection | PASS / FAIL / BLOCKED |
| Rendered output | Built site, preview, PDF, or project renderer | Inspect representative pages and changed visual areas | PASS / FAIL / NOT AVAILABLE |
| Version/localization claim | Release and locale configuration | Check version scope, source/translation status, and locale rendering | PASS / FAIL / UNKNOWN |

At minimum, re-read the result against the source map; check headings, terminology, code fences, commands, examples, links, anchors, images, navigation, version labels, and warnings. When the project renders docs, inspect the rendered output, not only the Markdown. If rendering or external-link checks cannot run, report the exact limitation and do not call the result fully verified.

## Failure modes and required responses

| Failure mode | Required response |
| --- | --- |
| Documentation describes intent as current behavior | Trace the claim to executable/configured evidence; label intent or correct the claim. |
| README, contract, generated docs, and implementation disagree | Identify the canonical source for the task, preserve the conflict in the report, and update only the authorized boundary. |
| Generated output is edited as if canonical | Find the generator/source; change the source and regenerate, or record why the project explicitly permits direct output edits. |
| Example is plausible but unverified | Run it safely or label it illustrative; never present fabricated output as observed. |
| Command has hidden destructive or environment-specific behavior | Add prerequisites and scope, use a safe fixture/dry run if supported, or narrow/omit the command. |
| API example/schema/status/security detail drifts | Compare the adopted API description, implementation, tests, and version; fail the check or mark the unsupported field unknown. |
| RFC keywords are ambiguous | Use ordinary lowercase prose, or define uppercase BCP 14 semantics with RFC 2119 and RFC 8174. |
| Version labels or links point to moving “latest” content | Pin the project-adopted version where reproducibility matters and verify the link target. |
| Translation changes identifiers or stale localized content | Restore machine-readable tokens, update the correct locale source, and compare localized claims with the source language. |
| Links pass but rendered docs are broken | Inspect the built/preview output for anchors, navigation, overflow, missing assets, code wrapping, and unreadable warnings. |
| Check exits successfully without testing the changed scope | Inspect discovery/counts/artifacts; classify as unverified rather than PASS. |
| External source is inaccessible or only partially public | Record the access boundary; use only the available authoritative content and do not claim full standard compliance. |

## Interaction with core skills

Documentation is a content and evidence boundary, not a replacement for the core engineering workflow:

- **`engineering-discovery`** establishes repository context, ownership, scope, requirements, risks, and acceptance criteria. Documentation consumes that evidence and may return a documentation-specific ambiguity; it does not invent product requirements.
- **`engineering-implementation`** owns authorized changes to product code, configuration, tests, and canonical documentation sources. Documentation identifies the smallest source boundary and required contract updates; it does not bypass the existing generator or lifecycle.
- **`engineering-verification`** owns executing and reporting checks. Documentation supplies documentation claims, oracles, example/link/render requirements, and environment limits; it must not report planned checks as passed.
- **`engineering-review`** independently judges the actual documentation/code diff and evidence. Documentation can expose source drift or unsupported claims; review decides whether the result is acceptable.

If a documentation change changes an API, schema, security guarantee, operational procedure, data behavior, compatibility promise, or release process, hand the affected boundary to the corresponding core skill and keep the documentation update traceable to that decision. Do not create a second contract, verification system, or release process inside the docs.

## Completion criteria

The documentation task is complete only when all applicable criteria are satisfied or explicitly reported as blocked/unknown:

- the audience, task, scope, prerequisites, and document type are clear;
- every material product claim is traced to current evidence, an adopted contract, or explicitly labeled intent/example;
- API, user, developer, and operational content uses the correct source and does not expose unsupported internals;
- commands and examples are safe, version-appropriate, internally consistent, and either executed or clearly labeled;
- canonical versus generated files, navigation, versioning, and localization boundaries are preserved;
- relevant link, syntax, build, example, localization, and rendered-output checks were run or their limits are recorded;
- the final diff contains no invented requirements, fabricated output, stale version claim, secret, or unreviewed generated artifact;
- the report separates local evidence from CI, deployment, production, and post-deployment evidence, and states residual risk.
