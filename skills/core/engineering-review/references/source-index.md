# Engineering Review source index

Purpose: record the authoritative guidance used to shape `engineering-review`. These sources support decision principles and review techniques; they do not create universal requirements for every repository. Project policy, contractual obligations, applicable law, and the task remain the controlling sources for a particular review.

Accessed: 2026-09-15

## Google Engineering Practices

### The Standard of Code Review

Source: [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)

Supports:

- balancing forward progress with improving code health rather than demanding perfection;
- preferring technical facts, data, applicable style guidance, and engineering principles over personal preference;
- resolving disputes through documented consensus or escalation.

Applied here as: the PASS bar rejects material defects without turning polish or taste into blockers. The source’s Google-specific process and terminology are not imported as universal policy.

### What to look for in a code review

Source: [Google Engineering Practices — What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)

Supports:

- checking meaningful tests, documentation affected by behavior changes, consistency, and every human-written changed line;
- reading surrounding context and obtaining qualified review for specialized concerns;
- keeping broad formatting or unrelated cleanup separate from functional changes and not blocking on unsupported style preference.

Applied here as: the review workflow reconstructs the behavioral boundary around the diff and treats reviewability and specialized expertise as explicit evidence concerns.

### How to write code review comments

Source: [Google Engineering Practices — How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html)

Supports:

- explaining why a change is needed and commenting on code rather than the person;
- distinguishing required changes from optional, nit, and informational feedback;
- keeping the author responsible for the fix while providing useful, proportionate guidance.

Applied here as: findings carry severity, action labels, impact, and required correction/evidence; the reviewer does not silently implement the fix.

## Microsoft Engineering Fundamentals Playbook

### Reviewer Guidance

Source: [Microsoft Engineering Fundamentals Playbook — Reviewer Guidance](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/process-guidance/reviewer-guidance/)

Supports:

- human attention on business-logic correctness, changed-test correctness, architecture, readability, and maintainability when mechanical checks are automated;
- reading changed code with enough surrounding context to understand it;
- keeping the review focused on the task scope and using respectful, actionable feedback;
- checking design interactions, complexity, errors, concurrency, security, privacy, and edge cases.

Applied here as: the reviewer owns contextual judgment and evidence quality, while project automation handles repeatable mechanical checks where available.

### Process Guidance

Source: [Microsoft Engineering Fundamentals Playbook — Code review process guidance](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/process-guidance/)

Supports:

- integrating code review into the engineering process;
- using automation to reduce mechanical review noise and focus people on design and functionality;
- treating oversized changes as a review-effectiveness risk without imposing a universal line-count limit.

Applied here as: mixed or unreviewable changes are a reviewability finding, and exact project checks are preferred over invented thresholds.

### Pull Requests

Source: [Microsoft Engineering Fundamentals Playbook — Pull Requests](https://microsoft.github.io/code-with-engineering-playbook/code-reviews/pull-requests/)

Supports:

- using change review to inspect code and qualify it with build, lint, unit, and integration checks where the workflow requires them;
- keeping a change focused, consistent, buildable, and accompanied by related tests and documentation;
- using decomposition, feature flags, or layered changes as possible ways to reduce review size when the product design permits.

Applied here as: the skill checks repository-defined qualification gates and scope coherence, while leaving the decomposition mechanism to the project.

## OWASP

### Secure Code Review Cheat Sheet

Source: [OWASP Secure Code Review Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)

Supports:

- distinguishing baseline reviews from diff-based reviews and choosing the depth from the change context;
- preparing with architecture, business requirements, threat models, critical assets, security requirements, and prior findings;
- reviewing changed controls and trust boundaries, including validation, authentication/authorization, data flow, business logic, cryptography, errors, configuration, and deployment;
- using SAST, dependency scanning, and other tools as complementary inputs that require human triage;
- considering state transitions, race conditions, transaction integrity, resource limits, and workflow bypasses in business-logic review.

Applied here as: security review is risk-prioritized and contextual, with manual analysis required where automated coverage is incomplete. The checklist is not treated as an exhaustive or universal security standard.

### OWASP Web Security Testing Guide — Code Reviews

Source: [OWASP Web Security Testing Guide — Code Reviews](https://owasp.github.io/www-project-web-security-testing-guide/stable/3-The_OWASP_Testing_Framework/0-The_Web_Security_Testing_Framework)

Supports:

- validating code against business security requirements, applicable technical checklists, language/framework issues, and industry-specific obligations;
- treating static code review as one component of a broader assurance process alongside other testing and deployment/configuration checks;
- avoiding the claim that code review alone catches every issue.

Applied here as: the report separates reviewed code from unverified deployment, penetration testing, runtime configuration, and other external assurance boundaries.

### OWASP Code Review Guide v2

Source: [OWASP Code Review Guide v2 (PDF)](https://owasp.org/www-project-code-review-guide/assets/OWASP_Code_Review_Guide_v2.pdf)

Supports:

- contextual, white-box reasoning about likelihood, impact, and the relevance of a potential security issue;
- attention to safe failure, exception handling, and tests for security controls;
- using manual review alongside automated analysis and penetration testing.

Applied here as: security findings require an observed path, impact, and evidence boundary. This guide is a technical reference, not a current universal process mandate; the newer OWASP Cheat Sheet and project-specific controls take precedence where they differ.
