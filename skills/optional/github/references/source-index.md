# Git/GitHub source index

Primary documentation reviewed 2026-09-15. URLs are intentionally kept as direct official documentation links so the skill can be refreshed when command semantics, GitHub policy, or Actions security guidance changes.

## Git command semantics

- [git-status](https://git-scm.com/docs/git-status) — working-tree versus index versus `HEAD`, untracked files, branch/upstream information, and stable porcelain output. Grounds the initial status snapshot and the requirement to inspect staged and unstaged changes separately.
- [git-diff](https://git-scm.com/docs/git-diff) — working-tree/index/tree comparisons and the meaning of two-dot and three-dot forms. Grounds `git diff --cached`, scoped diffs, and the merge-base PR comparison procedure.
- [git-branch](https://git-scm.com/docs/git-branch) — listing, creating, renaming, deleting, and tracking branches. Grounds branch existence/upstream inspection and the prohibition on silently changing branch state.
- [git-commit](https://git-scm.com/docs/git-commit) — commits record the index, path arguments can constrain content, and hooks can run during commit. Grounds staging-only-intended-paths, pre-commit staged-diff review, full-SHA recording, and hook failure handling.
- [git-fetch](https://git-scm.com/docs/git-fetch) — fetch downloads objects/refs and updates remote-tracking branches and `FETCH_HEAD`. Grounds the stale-ref warning and narrow-fetch rule.
- [git-push](https://git-scm.com/docs/git-push) — push updates remote refs, defaults depend on upstream/configuration, and branch/tag update safety rules differ. Grounds explicit remote/refspec verification and the force-push boundary.
- [git-remote](https://git-scm.com/docs/git-remote) — remote names, fetch/push URLs, tracking configuration, and remote inspection. Grounds repository identity and remote mapping checks.

## Pull requests, reviews, ownership, and merge gates

- [Creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request) — selecting the base and compare branches, choosing draft versus ready-for-review, and adding commits after opening a PR. Grounds PR target verification and draft-state boundary.
- [Requesting a pull request review](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/requesting-a-pull-request-review) — review requests to individuals and teams. Grounds named-reviewer verification and separation of request from approval.
- [REST API endpoints for pull request reviews](https://docs.github.com/en/rest/pulls/reviews) — review events and API behavior. Grounds treating approval, request-changes, comment, dismissal, and review retrieval as distinct operations.
- [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) — CODEOWNERS locations and search order, base-branch semantics, syntax/case sensitivity, owner access, invalid lines, size limit, last-match precedence, and protecting CODEOWNERS itself. Grounds the base-branch CODEOWNERS procedure.
- [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches) — review, code-owner, status-check, conversation, signed-commit, linear-history, merge-queue, deployment, bypass, push, force-push, and deletion settings; strict versus loose required checks. Grounds effective-rule inspection and stopping on policy rejection.
- [Status checks](https://docs.github.com/en/pull-requests/reference/status-checks) — checks versus commit statuses, providers, conclusions, required-check merge behavior, and the fact that skipped jobs report success. Grounds exact-SHA/provider/conclusion evidence and the caution against treating skipped validation as proof of coverage.
- [Branches](https://docs.github.com/en/pull-requests/reference/branches) — PR base/head comparison and protected-branch overview. Grounds explicit base/head confirmation.
- [Managing and standardizing pull requests](https://docs.github.com/en/pull-requests/reference/managing-and-standardizing-pull-requests) — using CODEOWNERS and protected branches to enforce review/check conditions on important branches. Grounds the scope boundary for production and release branches.

## Releases and release permissions

- [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) — releases are deployable software iterations based on Git tags, with notes and optional assets; visibility and management permissions differ. Grounds the release-versus-deployment distinction.
- [Managing releases in a repository](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) — create/edit/delete lifecycle, draft-first guidance for immutable releases, target/tag selection, notes, assets, prerelease/latest state, and CLI/API paths. Grounds release preflight and publish boundary.
- [REST API endpoints for releases](https://docs.github.com/en/rest/releases/releases) — release permissions and the special workflow-permission requirement when the resolved target commit changes `.github/workflows/`; documents that the Actions `GITHUB_TOKEN` cannot authorize that release API case. Grounds release permission failure reporting.

## GitHub Actions permissions and untrusted content

- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — workflow/job `permissions`, available token scopes, permission calculation, fork behavior, job naming, and `pull_request_target` token behavior. Grounds least-privilege and job-level permission inspection.
- [Use GITHUB_TOKEN for authentication in workflows](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token) — per-job token, `permissions` key, minimum required access, and alternatives when the built-in token is insufficient. Grounds token-scope analysis and no-automatic-credential-expansion.
- [GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token) — token lifecycle, repository scope, and workflow-created PR behavior. Grounds the distinction between repository-local authentication and broader credentials.
- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) — least privilege, secret handling, untrusted checkout risks, avoiding unnecessary privileged triggers, full-length SHA pinning, and third-party action risk. Grounds workflow hardening requirements.
- [Script injections](https://docs.github.com/en/actions/concepts/security/script-injections) — attacker-controlled GitHub context fields, flexible branch names, and expression substitution into runner shell scripts. Grounds the rule against direct interpolation into `run` and other executable contexts.
- [Securely using pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target) — privilege difference between `pull_request` and `pull_request_target`, unsafe fork checkout/execution, pwn-request shapes, artifact risk, cache/runner controls, and `allow-unsafe-checkout`. Grounds privileged-trigger and untrusted-code stop conditions.

## What the sources cannot prove

Official documentation defines semantics and available controls; it does not establish the live facts of a particular repository. The agent must inspect the actual checkout and GitHub state for:

- repository identity, remote URLs, current branch, exact refs, merge-base, dirty/staged files, local hooks, and test results;
- effective branch protection/rulesets, bypass actors, required check names/providers, review freshness, CODEOWNERS validity on the selected base, and merge-queue state;
- credentials, token scopes, organization/repository Actions defaults, environment approvals, runner trust, secrets, caches, external action provenance, and deployment records;
- whether a push, PR, review, merge, deployment, tag, release, asset upload, or publication actually succeeded;
- project-specific naming, compatibility, release, rollback, and deployment conventions.

Do not convert a documentation rule into evidence about the live repository. Do not convert a local green test, a release page, a historical check, a remote-tracking ref, or a successful API response into a stronger state claim than it supports.
