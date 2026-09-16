---
name: cloud
description: Design or change cloud infrastructure, managed services, IAM, deployment configuration, networking, or cloud-runtime behavior with explicit ownership, plan/apply safety, rollback, and deployment evidence.
---

# Cloud

Use this skill when a change can create, update, delete, expose, authorize, configure, deploy, scale, or operate a cloud resource or cloud-hosted workload. This includes infrastructure as code (IaC), managed services, networking, workload identities, provider policies, environment configuration, release automation, and runtime changes whose correctness depends on a cloud boundary.

Do not use it for application-only changes with no cloud contract, deployment, identity, configuration, or operational effect. If that boundary is uncertain, inspect the repository and deployment path before deciding.

Read [references/source-index.md](references/source-index.md) when the provider, pillar guidance, IAM rule, IaC preview/apply behavior, rollback behavior, or deployment-verification claim matters. The index is a routing map, not a substitute for the current provider and tool documentation.

## Responsibilities

The cloud workstream is responsible for:

- mapping resource, data, identity, configuration, dependency, and lifecycle ownership;
- identifying trust boundaries, provider/account/project/subscription scope, regions, zones, quotas, failure domains, and cost drivers;
- extending the repository's existing IaC, deployment, policy, secret, observability, and rollback abstractions rather than creating parallel paths;
- making the smallest safe change, previewing its effect, obtaining the required approval, applying only the approved change, and verifying both control-plane state and workload behavior;
- producing evidence that distinguishes repository facts, plan output, test results, environment observations, deployment evidence, assumptions, and residual risk.

It does not own business risk acceptance, provider availability guarantees, organizational IAM governance, production incident command, or approval to make a destructive or production mutation. Name the existing owner when those decisions are outside the repository or current authorization.

## Hard boundaries

1. **Provider first.** Identify the provider and the exact service, API, resource type, region, account/project/subscription, and IaC/deployment tool before using provider-specific advice. AWS guidance is authoritative only for AWS. For GCP or Azure, read the current primary sources for that provider and service; do not translate AWS account, IAM, region, policy, or rollback semantics into another provider.
2. **Repository before mutation.** Read `AGENTS.md`, manifests and lockfiles, deployment/IaC entry points, policy and secret references, CI/CD workflows, tests, environment selection, and the complete active diff. Preserve unrelated worktree changes.
3. **No unreviewed apply.** A plan, change set, preview, diff, or equivalent is an inspection artifact. It is not approval. Never apply when the target, identity, scope, destructive actions, replacement behavior, or approval record is unclear.
4. **No false deployment claim.** `apply` success proves only what the tool and its result cover. Verify the resulting resource state, intended configuration, routing/identity bindings, and an applicable service or workload health path. If the target environment is not observable, report deployment state as unverified.
5. **No convenience privilege.** Do not add administrator, wildcard, public, cross-account, cross-project, cross-subscription, or broad network access to make a deployment pass. Resolve the missing permission at the narrowest identity, action, resource, condition, and scope; record an explicit exception when the provider cannot express the intended constraint.
6. **No invented guarantees.** A managed service, multi-zone placement, backup, encryption setting, policy check, test, or green deployment does not by itself prove a business RTO/RPO, availability, security, performance, cost, or compliance outcome. State the measured or documented scope.

## Ownership and system model

Before design or implementation, create a compact record for every changed or depended-on boundary:

| Boundary | Record |
| --- | --- |
| Resource | Provider type, stable identifier, account/project/subscription, region/zone, environment, owner, lifecycle, and whether replacement or deletion is possible |
| Data | Classification, persistence location, encryption/key owner, retention, backup/restore owner, replication, and migration or corruption risk |
| Identity | Human, workload, deployer, service-linked, or external principal; credential source; trust/assumption path; actions; resources; conditions; maximum-permission guardrails; review owner |
| Configuration | Repository/IaC, provider default, environment variable, parameter store, secret manager, policy, feature flag, or manual setting; source of truth; precedence; change owner; recovery path |
| Dependency | Upstream/downstream service, hard or soft dependency, protocol, timeout, retry/idempotency behavior, quota, failure signal, and fallback |
| Deployment | Artifact/template/plan identity, target selector, release owner, approval, rollout strategy, health signal, rollback unit, rollback trigger, and rollback verifier |

Do not collapse resource identity, workload identity, and deployer identity. A resource ARN/ID identifies an object; it does not prove who may access it. A deployer that can create a role or policy is a privilege-management boundary and needs separate review. A provider-managed service, a customer-managed configuration, and an application-level behavior have different owners even when they appear in one template.

Classify configuration as one of the following before changing it:

- **Immutable artifact:** versioned code, image, package, or migration bundle. Record digest/version and the known-good predecessor.
- **Declarative infrastructure:** provider resources, relationships, policies, and parameters managed by the repository's IaC tool. Record state ownership and drift policy.
- **Environment configuration:** non-secret values and bindings selected per target. Record source, precedence, and whether rollback is independent of the artifact.
- **Secret or key material:** reference only the existing secret/key-management boundary. Never place secret values in source, plans, logs, output, or evidence.
- **Runtime or out-of-band state:** console edits, provider defaults, autoscaling state, data, or operational changes. Treat it as a dependency or drift risk, not as repository truth.

## Failure domains, change units, and rollback

Enumerate the smallest provider-relevant failure domains: organization/tenant, account/project/subscription, region, availability zone or equivalent location, network boundary, cluster/node pool, service/resource, deployment batch, data store, identity/policy plane, and external dependency. Use only domains that exist for the selected provider and service. For each domain, state what fails together, what remains available, the detection signal, and the recovery owner. Do not infer independence merely from different resource names or zones.

For every mutating change, define:

- the smallest rollback unit: artifact, resource set, policy version, configuration version, deployment revision, or data operation;
- a named known-good target and how it is retrieved;
- whether rollback is automatic, manual, or unavailable;
- the trigger and authority to roll back;
- non-reversible effects such as data deletion, schema changes, key rotation, resource replacement, or external side effects;
- the verification that the rollback restored the intended control-plane state and workload behavior.

Rollback is not automatically an undo. Provider tools may redeploy a previous revision, restore a prior template, or return a stack to a prior state; these can differ from reversing every side effect. If rollback is impossible or only partially effective, stop before apply unless the responsible owner explicitly accepts the residual risk.

## Provider and pillar review

When the target is AWS, use the five requested AWS Well-Architected pillars below as a review lens and read the linked primary source pages for the applicable workload. The AWS framework has a sixth Sustainability pillar; this skill does not silently assess it unless the task or repository makes it relevant.

- **Operational excellence:** identify business and operational outcomes, ownership, runbooks, alarms, change procedures, operational readiness, and feedback from incidents and metrics. Prefer repeatable, observable, automated changes, and verify that the team can operate the workload after release.
- **Security:** apply the shared-responsibility model to the selected service. Review identity foundations, authorization, traceability, network and data protection, incident response, and application controls. Treat customer configuration and access management as customer-owned unless the service documentation explicitly assigns another owner.
- **Reliability:** model quotas, dependencies, fault isolation, demand changes, timeouts, retries, idempotency, backups, restore, recovery objectives, failure management, and change safety. Test the stated recovery behavior; do not substitute a service feature or topology label for evidence.
- **Performance efficiency:** start from measured functional and non-functional requirements. Review architecture, compute, data, networking, scaling, capacity, cost/performance trade-offs, and monitoring. Benchmark or load-test when the change can affect a stated performance requirement.
- **Cost optimization:** identify resource and usage drivers, ownership tags or equivalent attribution, budgets/alerts, lifecycle and cleanup, right-sizing, scaling, and rate choices. Record the trade-off when reliability, security, or performance changes cost. Never claim lowest cost without a defined workload, price scope, and comparison.

For GCP, use the Google Cloud Well-Architected Framework and the current Google Cloud IAM and Infrastructure Manager documentation. For Azure, use the Azure Well-Architected Framework and Microsoft Entra/Azure RBAC and ARM/Bicep deployment documentation. These are provider-specific evidence paths, not interchangeable checklists; read the service-level documentation for the actual resource and deployment mechanism.

## IAM and permission guardrails

Build an effective-permissions map before changing access:

`principal → authentication/assumption path → identity policy → resource policy → conditions → boundary/organization guardrail → effective actions/resources → audit and review evidence`

For every new or changed permission:

- grant only the actions and resources required for the task, with conditions and narrow scope where the provider supports them;
- separate human, workload, deployer, break-glass, and provider-managed identities; prefer the provider's supported short-lived credential mechanism for humans and workloads;
- review trust/assume/impersonation paths and delegation rights such as role creation, policy attachment, pass-role, role assignment, or service-account impersonation;
- treat resource policies, cross-boundary access, public access, network authorization, and data-plane permissions as part of the same decision;
- run the provider's policy syntax/best-practice validation and a negative test for an unauthorized action or resource when the boundary is testable;
- review unused or unexplained permissions on a lifecycle-appropriate schedule; do not remove access solely from an analyzer recommendation without testing the workload and owner impact.

For AWS specifically, use IAM Access Analyzer policy validation for applicable policies and consider custom/new-access or access-preview checks for high-impact changes. Use AWS Organizations service control policies or resource control policies, where in scope, and IAM permissions boundaries to cap delegated maximum permissions. These guardrails constrain what can be granted; they do not grant permissions on their own. Confirm the applicable account/OU/organization coverage and remember that organization guardrails do not automatically govern external principals.

For GCP or Azure, do not use AWS terms such as SCP, permission boundary, or resource policy as if they were provider semantics. Use the current GCP IAM/organization-policy or Azure RBAC/Entra/PIM/Policy documentation for the exact control and test its effective scope.

## IaC and deployment workflow

Use the repository's existing tool and state backend. Do not add a second state store, deployer, environment selector, or rollback mechanism. Follow this sequence, adapting names to the provider and tool:

1. **Discover.** Identify the command, version, working directory, backend/state, provider credentials, target selector, variable sources, artifact source, and whether the action can create, replace, delete, or mutate data. Confirm the selected identity has only the required read/plan or apply permissions.
2. **Validate locally or in the tool's safe mode.** Parse/compile/render templates, validate provider schemas, resolve modules/providers, run policy checks, and run repository tests. Do not confuse syntax validation with permission, quota, drift, or runtime validation.
3. **Preview.** Generate the tool's plan, diff, preview, or CloudFormation change set against the intended target. Record its identity, timestamp, source revision, inputs, target, and expiry/staleness assumptions. Inspect creates, updates, replacements, deletes, permissions, public/cross-boundary changes, data operations, and estimated cost where available.
4. **Review and approve.** Compare the preview with the requested change and ownership record. Require the repository's normal review and production approval for destructive, privileged, data, network-boundary, or high-blast-radius changes. Reject unexpected changes and investigate drift instead of hiding it.
5. **Apply the approved unit.** Apply the exact approved plan/change set/preview when the tool supports it. If the provider or tool regenerates a plan at apply time, re-preview and re-approve the changed result. Never pass an unreviewed auto-approval flag merely to make automation non-interactive.
6. **Observe completion.** Wait for the provider operation to reach a terminal state; collect operation/resource events and status reasons. Handle partial failure, asynchronous cleanup, locks, rate limits, quota errors, and rollback-failed states explicitly. Do not start a second apply while the first operation or rollback is active.
7. **Verify behavior.** Query the target resource and relevant identity/configuration state. Then run the narrowest safe functional smoke test, health/readiness check, synthetic request, migration invariant, or service-specific verification. Check logs, metrics, alarms, routing, permissions, and cost signals relevant to the change.
8. **Record and hand off.** Save sanitized evidence linking source revision, plan/change-set identity, approval, operation result, resource identifiers, behavior checks, rollback result if used, and unresolved limitations. Mark external boundaries as `UNVERIFIED` when not observed.

Provider-specific examples are evidence, not universal commands:

- AWS CloudFormation change sets preview stack changes; stack events and stack status explain update and rollback outcomes; drift detection covers only supported and observable properties. Use the resource/service documentation for gaps.
- Terraform's `plan` is non-mutating, and a saved plan can be applied as the exact planned change; plan files can contain sensitive data and must not be committed or exposed. This is Terraform behavior, not a guarantee of every IaC tool.
- Google Cloud Infrastructure Manager previews execute Terraform planning and retain deployment/revision evidence; read the current service documentation for service-account permissions, preview limitations, and deployment state.
- Azure ARM/Bicep `what-if` previews predicted changes without changing existing resources; its documented limits and `Ignore`/uncertain results require review. Use deployment history and operation details for post-apply evidence; redeploying a previous deployment is not necessarily a perfect inverse.

## Verification requirements and acceptance criteria

Select checks proportionally to blast radius. The record must state exact commands or UI/API queries, tool/provider versions where relevant, target scope, result, and evidence location. Cover applicable cases:

- template/module compile, schema validation, formatting/lint, policy/static checks, dependency and provider lock verification;
- plan/preview inspection with expected counts and explicit review of destructive, replacement, IAM, network, data, and cost effects;
- unauthorized, wrong-scope, public/cross-boundary, missing-condition, and missing-credential permission cases;
- invalid configuration, missing dependency, quota exhaustion, timeout, transient provider error, retry/duplicate apply, lock contention, and partial completion;
- deployment health, routing, startup/readiness, representative functional behavior, logs/metrics/alarms, and configuration/secret resolution;
- backup/restore, failover, recovery, or rollback tests when the change claims or depends on those properties;
- drift or out-of-band change detection when the tool supports it and the resource is mutable outside IaC.

Acceptance criteria are met only when:

1. ownership and target scope are identified for each changed boundary;
2. the selected provider and tool primary documentation supports the claimed semantics;
3. the preview was reviewed and the applied change matches the approved scope, or the difference was re-reviewed;
4. effective permissions are bounded, necessary, and tested to the available scope;
5. failure, partial completion, rollback, and non-reversible effects have an owner and explicit handling;
6. post-apply queries prove the relevant resource/configuration state, and behavior checks prove only the behavior they actually exercise;
7. evidence, assumptions, residual risks, skipped checks, and unverified external boundaries are reported without secrets.

## Failure modes to actively check

- An account, project, subscription, region, workspace, state backend, or credential is selected by an implicit default.
- A resource is changed through a console or second tool while the repository remains the claimed source of truth.
- Plan output is stale, generated from different variables/provider versions, or applied to a different target.
- A preview hides replacement, deletion, permission broadening, data movement, cost, or provider-default changes.
- A successful control-plane operation is treated as proof that traffic, authentication, data integrity, or business behavior works.
- A provider feature is mistaken for a workload guarantee, or a service's failure domain is assumed rather than documented.
- An IAM guardrail is treated as a grant; a role-creation or impersonation path bypasses the intended least-privilege review; or a resource policy grants access not visible in the identity policy.
- A rollback redeploys an old artifact but leaves data, external side effects, secrets, policies, DNS, queues, or out-of-band state changed.
- An update is retried while the provider is still operating, producing duplicate resources, conflicting state, or a second destructive action.
- A drift detector reports `NOT_CHECKED`, `UNKNOWN`, or incomplete properties and the result is reported as full configuration proof.
- A plan, log, generated artifact, error, or evidence record exposes secret values or sensitive topology.
- Cost is evaluated without workload volume, retention, regions, commitments, egress, or shared-resource allocation; or cost reduction silently weakens a stated reliability/security requirement.

## Evidence and reporting

Use these labels:

- **FACT:** observed in repository files, tool output, provider API/UI, or a cited primary document;
- **TESTED:** reproduced by a named test, validation, controlled failure, smoke test, or rollback exercise, with scope;
- **ASSUMPTION:** required because an owner, environment, provider behavior, or external dependency was not observable;
- **UNVERIFIED:** expected or claimed but not demonstrated;
- **RESIDUAL:** remaining failure, security, cost, performance, recovery, or operational risk, with owner where known.

For each changed boundary, report:

`change → owner/source of truth → target identity/scope → preview or plan → approval → apply/operation result → post-apply state → behavior test → rollback path → evidence → residual/unverified limitation`

Do not include secrets, private keys, bearer tokens, sensitive plan contents, or unnecessary personal data. A green validator or test suite is evidence only for its inputs, assertions, versions, and environment.

## Interaction with the core engineering skills

- **Engineering Discovery** establishes goal, scope, architecture, ownership, constraints, assumptions, risks, and general acceptance criteria. Cloud adds provider/resource/identity/configuration/failure-domain and deployment evidence; it must not invent missing repository facts.
- **Engineering Implementation** owns the architecture-preserving change and public contracts. Cloud supplies the cloud control points, lifecycle, permission, plan/apply, and rollback constraints; implementation does not bypass the existing IaC or deployment abstraction.
- **Engineering Verification** owns execution and the final verification record. Cloud supplies provider-specific negative, failure, plan, rollback, and live-state checks and separates local, test-environment, and deployed evidence.
- **Engineering Review** owns the independent verdict on the actual diff and evidence. Cloud surfaces scope drift, unsafe privilege, destructive or unreviewed changes, unsupported provider claims, and missing deployment proof; cloud guidance does not self-approve a production mutation.

When a core skill or required external owner is unavailable, state the missing handoff or evidence explicitly and stop at the safe boundary.
