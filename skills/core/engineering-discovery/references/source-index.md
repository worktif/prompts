# Engineering Discovery source index

Use these sources to justify terminology and evidence controls in `engineering-discovery`. They are not universal project requirements. The notes below state exactly what each source supports; they intentionally paraphrase rather than reproduce copyrighted standards text.

Checked 2026-09-15.

## Requirements engineering

1. [ISO/IEC/IEEE 29148:2018 — Requirements engineering](https://www.iso.org/standard/72089.html) — The published international standard defines requirements-engineering processes across the life cycle, the requirements-related information items those processes produce, their expected content, and guidance on format. The ISO page identifies the 2018 edition as published and reviewed/confirmed in 2024, while also showing a draft revision in progress. This supports using the published edition as a reference and explicitly avoiding claims that a draft is normative.

2. [ISO/IEC/IEEE 29148:2018, ISO Online Browsing Platform](https://www.iso.org/obp/ui?_escaped_fragment_=iso%3Astd%3Aiso-iec-ieee%3A29148%3Aed-2%3Av1%3Aen) — The accessible preview supports the distinctions used by the skill: a requirement expresses a need with constraints and conditions; requirements engineering includes discovering, eliciting, developing, analyzing, verifying, validating, communicating, documenting, and managing requirements; and verification checks whether requirements are well-formed. It also supports keeping requirements verification distinct from product/system verification and validation.

## Architecture description

3. [ISO/IEC/IEEE 42010:2022 — Architecture description](https://www.iso.org/standard/74393.html) — The current published architecture-description standard distinguishes an architecture from the description that expresses it and specifies requirements for architecture-description structure and expression, including frameworks, languages, viewpoints, and model kinds. It explicitly does not prescribe a particular process, notation, tool, or media. This supports the skill’s purpose- and stakeholder-driven, vendor-neutral architecture record and its prohibition on treating one diagram format as universal.

4. [NASA Software Engineering Handbook, 7.07 — Software Architecture Description](https://swehb.nasa.gov/spaces/7150/pages/16450571/7.07%2B-%2BSoftware%2BArchitecture%2BDescription) — NASA’s public handbook applies 42010 terminology and explains the relationship among system, environment, stakeholder, concern, view, viewpoint, and rationale. It supports requiring context and stakeholder concerns for architecture findings, while remaining project guidance rather than a universal mandate.

5. [SEBoK — System Architecture Design Definition](https://sebokwiki.org/wiki/System_Architecture_Design_Definition) — The INCOSE/IEEE Systems Engineering Body of Knowledge describes project scope and system boundaries, traceability from stakeholder needs to requirements, and multiple views tailored to stakeholder viewpoints and concerns. It supports the skill’s traceability and tailored-view guidance; it does not establish a mandatory software-project template.

## Requirements quality and verification evidence

6. [NASA Appendix C — How to Write a Good Requirement](https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/) — NASA guidance supports checking who/what a requirement applies to, consistent terminology, measurable values/tolerances where applicable, and separation of required behavior from implementation method. It also distinguishes normative “shall” statements from facts or goals in its own guidance. The skill uses these as review prompts only when appropriate to the project, not as a universal syntax rule.

7. [NASA Appendix D — Requirements Verification Matrix](https://www.nasa.gov/reference/appendix-d-requirements-verification-matrix/) — This public guidance supports assigning a unique identifier and source to each applicable requirement and recording how it will be verified. The skill generalizes that idea into an acceptance-criterion-to-proof mapping and preserves the source/project boundary.

## Git and project-state evidence

8. [Git `status` documentation](https://git-scm.com/docs/git-status) — The official manual distinguishes differences between `HEAD`/index, index/worktree, and untracked files, and documents stable porcelain output for machine-readable status. This supports capturing staged, unstaged, and untracked state separately.

9. [Git `diff` documentation](https://git-scm.com/docs/git-diff) — The official manual documents comparisons between worktree and index, staged changes and `HEAD`, arbitrary revisions, and path-limited diffs. This supports a read-only baseline and targeted diff inspection without conflating unrelated changes.

10. [Git `log` documentation](https://git-scm.com/docs/git-log) — The official manual documents commit history, path-limited history, `--follow` across renames, and name/status reporting. This supports using history to understand evolution and intent while keeping it separate from evidence of current behavior.
