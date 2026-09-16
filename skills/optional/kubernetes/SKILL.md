---
name: kubernetes
description: Design, review, validate, or change Kubernetes workloads, manifests, controllers, Services, probes, resources, security, disruption policy, termination, or rollout behavior; do not activate for application-only changes with no Kubernetes contract impact.
---

# Kubernetes

Use this skill when a change or investigation crosses the Kubernetes API or runtime boundary: Pod templates, Deployments, StatefulSets, DaemonSets, Jobs/CronJobs, custom controllers/operators, Services/EndpointSlices, probes, scheduling and resources, security context or RBAC, PodDisruptionBudgets, graceful termination, or Kubernetes API/version compatibility. Activate for YAML, Kustomize, Helm or generated manifests when their rendered Kubernetes behavior is in scope, and for application changes whose startup, readiness, shutdown or resource contract is expressed through Kubernetes.

Do not activate for an application-only change that has no Kubernetes-facing contract, or for formatting-only manifest changes whose rendered objects and behavior are proven unchanged. Do not infer cloud-provider, ingress, service-mesh, CNI, CSI, container-runtime, registry, admission-policy, GitOps, Helm, or operator behavior from Kubernetes documentation alone. Bring those systems into scope only when the task names them and their authoritative documentation and observed configuration are available.

This skill is vendor-neutral. Use Kubernetes API and control-plane semantics as the baseline. Mark distribution-, version-, runtime-, controller-, admission-, and network-provider-specific behavior separately. A successful API write is not proof that a workload is scheduled, ready, available, reachable, serving correct responses, or safe to roll back.

## Operating model and ownership

1. Establish the desired state, current state, owner, reconciler, dependency graph, and evidence boundary before editing. Kubernetes controllers watch cluster state and repeatedly move current state toward desired state; reconciliation is asynchronous and may be interrupted or never converge because of quota, scheduling, admission, dependency or controller failures.
2. Prefer the existing workload controller. A Pod is a disposable execution unit, not a durable identity or a deployment mechanism. Pods are scheduled once; rescheduling creates a replacement Pod. Persist identity and storage through the appropriate workload abstraction, not through Pod names or local filesystem state.
3. Make ownership and selectors unambiguous. Common built-in ownership is Deployment → ReplicaSet → Pod; a Service selects Pods and the EndpointSlice controller represents its endpoints; a PDB selects Pods but does not own or replace them. Do not create overlapping controller selectors or hand-edit controller-owned replicas, Pods, EndpointSlices or status.
4. For a custom controller/operator, reconcile from observed state, make retries and duplicate events safe, preserve other writers' fields, handle update conflicts, and publish status that distinguishes observed generation, progress, readiness and failure. Do not use a controller-local cache or a successful create/update as the source of truth for health.
5. Keep configuration, status and runtime health distinct. `spec` expresses desired state; `status`, Pod conditions, container state, controller conditions and Service endpoints are observations with different meanings and lag. Define what evidence is required for the user-visible outcome.

## Lifecycle and probes

Trace the path `image/configuration → admission → scheduling → container start → startup → readiness/endpoints → serving → termination → replacement/rollback`. For each transition, define the owner, signal, timeout, retry behavior and failure action.

| Mechanism | Kubernetes meaning | Required design boundary |
| --- | --- | --- |
| Startup probe | Runs during initialization. Until it succeeds, configured liveness and readiness probes do not run. Repeated failure causes the kubelet to kill the container and the Pod restart policy applies. | Budget startup for image initialization, migrations, cache/data loading and dependency setup. Do not let a slow but valid startup be killed by an un-gated liveness probe. |
| Liveness probe | Detects that the container is unhealthy after startup. Repeated failure causes the kubelet to restart that container. It does not wait for readiness. | Check an intrinsic, recoverable process condition. Keep it cheap and conservative; do not make transient dependency failure or overload trigger restart cascades unless that restart is explicitly the recovery design. |
| Readiness probe | Determines whether the container should receive Service traffic. Failure keeps the container running, sets Pod `Ready` false and causes the EndpointSlice controller to remove the Pod IP from matching Service endpoints. It runs throughout the container lifecycle. | Check whether the workload can correctly serve the intended request, including required dependencies when that is part of the service contract. Use it for temporary overload, maintenance and drain state. |

Probe rules:

- Use separate endpoints or checks when process liveness and traffic readiness have different failure domains. A liveness check that requires a flaky database can restart every replica; a readiness check can instead remove the replica from normal Service traffic while it recovers.
- Derive `initialDelaySeconds`, `periodSeconds`, `timeoutSeconds`, `failureThreshold`, `successThreshold` and any probe-level grace period from measured startup and recovery behavior. Document the total startup budget and the consequence of a failed check.
- Treat a passing probe as evidence only for the check it performs. It does not prove business correctness, schema compatibility, authorization, external load-balancer health, end-to-end routing, or acceptable latency.
- Validate the exact traffic path. Kubernetes Service/EndpointSlice readiness is not a universal claim about an Ingress, gateway, service mesh, external load balancer, DNS cache, client retry policy or provider health check. Check `publishNotReadyAddresses`, terminating endpoints and any external routing policy when applicable.
- Do not use probe success or `kubectl apply` as the sole release gate. Combine observed controller conditions, ready/available replicas, endpoint membership and a safe semantic request test.

## Deployments, rollouts and rollback

Use a Deployment for a continuously running stateless workload when its ownership and update semantics fit. Let it own ReplicaSets and let ReplicaSets own Pods. Pin an immutable image identity where the delivery system supports it, make the Pod-template change intentional, and keep selectors stable and non-overlapping.

For every rollout, record:

- the target API version, image/configuration identity, intended replica count, availability objective and dependency/schema compatibility;
- the strategy (`RollingUpdate` or `Recreate`), `maxSurge`, `maxUnavailable`, `minReadySeconds`, progress deadline, termination grace period and any topology constraints;
- the capacity required for surge replicas and the effect of quota, autoscaling, PDBs, admission, scheduling and dependency failures;
- the retained revision history and a tested undo path. A `revisionHistoryLimit` of zero removes the retained history needed for Deployment rollback.

Rollout safety rules:

1. Preview rendered objects and server-side validation/admission where possible before changing the cluster. Check that the new Pod template, selector, Service selector, ServiceAccount, probes, resources, security context and policy selectors agree.
2. Apply only through the repository's declared delivery owner. Then observe the new revision with `kubectl rollout status`, Deployment conditions, ReplicaSets, Pod events/logs, ready/available counts and Service EndpointSlices. A rollout marked complete still requires an application-level request or smoke test for the intended path.
3. Set a progress deadline that is longer than the expected image-pull, scheduling, startup and readiness budget but finite enough to surface a stalled rollout. A deadline reports stalled progress; it does not automatically repair the application or automatically roll it back.
4. Roll back to a known compatible revision with `kubectl rollout history` and `kubectl rollout undo` when the rollback owner authorizes it. Check data/schema and configuration compatibility first; a Deployment rollback changes the Pod template and does not undo external side effects or database migrations.
5. Stop and diagnose on partial rollout, CrashLoopBackOff, image-pull failure, unschedulable replicas, quota/admission rejection, readiness failure, endpoint loss, unexpected error rate, or insufficient termination capacity. Do not repeatedly restart or apply until the failure signal is understood.

`kubectl apply` means that the requested object configuration was accepted or updated by the API path that handled the command. It does not mean that reconciliation completed, Pods started, probes passed, endpoints were published, external traffic arrived, or responses are correct.

## Resources and scheduling

- Set CPU, memory and applicable ephemeral-storage requests from measured workload behavior. Requests participate in scheduling; the scheduler checks aggregate requests against node capacity, not current instantaneous usage.
- Set limits deliberately and explain the failure behavior. The kubelet passes requests and limits to the runtime; on Linux, cgroups typically enforce CPU and memory limits. Memory over a limit can terminate the container and produce `OOMKilled`; an absent limit can allow unbounded node consumption or interact with namespace defaults.
- Account for every container, init container, sidecar and Pod-level resource feature supported by the target cluster. Include surge capacity, daemon/system overhead, autoscaling assumptions, quota and LimitRange defaults in the capacity calculation.
- Do not invent universal CPU/memory numbers or assume a QoS class, eviction order, CPU throttling behavior, node capacity, autoscaler, metrics pipeline or storage limit without target-cluster evidence. Test at representative concurrency and failure load.
- Treat `Pending`, `Unschedulable`, eviction, OOM, throttling and quota rejection as different failure modes. Diagnose events and node/resource state before changing probes or replicas.

## Security context, ServiceAccounts and RBAC

1. Name the workload ServiceAccount explicitly. If the workload does not call the Kubernetes API, assess disabling automatic token mounting; if it does, document the exact API resources, verbs, namespaces and failure behavior it needs.
2. Set Pod- and container-level `securityContext` intentionally. Container settings override overlapping Pod settings. For ordinary application containers, assess `runAsNonRoot: true`, a non-root UID/GID, `allowPrivilegeEscalation: false`, an appropriate `seccompProfile` (normally `RuntimeDefault` where supported), and dropping unnecessary Linux capabilities. Keep exceptions narrow, documented and enforced by the target namespace policy.
3. Use Pod Security Standards and Pod Security Admission as policy references and observed enforcement, not as proof that every workload can use the Restricted profile. Windows and Linux fields and runtime support differ.
4. Model RBAC as an allow-only, additive policy. Prefer an application-specific ServiceAccount, namespace-scoped `Role` and `RoleBinding` where possible. Avoid wildcard resources/verbs and ClusterRoleBindings unless the cross-namespace or cluster-wide requirement is proven. Test both allowed and denied actions with the intended identity.
5. Do not confuse container isolation with API authorization. RBAC controls Kubernetes API requests; it does not grant application-user permissions inside the service or replace network, admission, secret, node or cloud IAM controls.

## Disruptions and graceful termination

- Use a PodDisruptionBudget for a replicated application only when voluntary disruptions are in scope. A PDB limits simultaneous voluntary disruption through eviction-aware mechanisms; it does not protect against node failure, resource pressure, all controllers, direct Pod/Deployment deletion, or a bad rollout. It is not a substitute for replicas, topology spread, capacity or a correct readiness contract.
- Check PDB selector coverage, replica count, `minAvailable`/`maxUnavailable`, unhealthy-Pod policy where supported, and whether the workload can make progress when an eviction is blocked. Do not combine percentages and small replica counts without calculating the rounded result.
- On deletion, expect a deletion timestamp and a finite grace period. Kubernetes normally marks the endpoint as not ready/terminating, asks the runtime to send TERM/SIGTERM and eventually force-kills after the grace period. Container stop requests can be processed asynchronously; do not rely on an order between containers.
- Make the application handle SIGTERM: stop accepting new work, drain or finish bounded in-flight work, close resources, and exit before the grace period. `PreStop` runs before TERM and consumes the same total termination budget; a hanging hook can exhaust the budget. Keep hooks short, idempotent and observable, and do not use them as a substitute for application shutdown handling.
- Verify provider or external load-balancer draining separately. Kubernetes endpoint state reduces normal Service routing, but the external path may have its own propagation delay, connection reuse and termination semantics.

## API and versioning discipline

Separate these concerns:

- **Object API version:** use the stable API version served by the target cluster; check deprecations and removed versions before changing manifests or clients.
- **Object revision/concurrency:** preserve server-managed metadata and use the project's established update/field-ownership mechanism. Do not overwrite newer state based on a stale read; handle `resourceVersion` conflicts and multiple writers explicitly.
- **Workload revision:** identify the Deployment/ReplicaSet revision and immutable application artifact separately from the Kubernetes API version.
- **Cluster component skew:** verify control-plane, kubelet, client and extension compatibility against the target cluster's version-skew policy. A current documentation page is not evidence that an older cluster serves a field or runs a feature gate.

Do not rely on alpha APIs or deprecated resources for a production path without an explicit compatibility and removal plan. CRDs, operators, admission webhooks and delivery tools have their own versioning and upgrade contracts; inspect those contracts rather than treating them as core Kubernetes behavior.

## Validation and evidence

Run the narrowest checks that answer the risk, in a disposable or explicitly authorized namespace/cluster. Substitute real paths and names; do not mutate a production cluster as a validation shortcut.

### Before applying

```sh
kubectl version
kubectl api-resources
kubectl explain deployment.spec --recursive
kubectl apply --dry-run=server -f rendered.yaml
kubectl diff -f rendered.yaml
kubectl auth can-i <verb> <resource> -n <namespace> --as=system:serviceaccount:<namespace>:<serviceaccount>
```

Record the cluster/server versions, rendered manifest identity, admission result, diff, effective namespace policy, and identity used. Use a schema/lint tool already adopted by the repository when available; its pass is evidence about that tool and configuration only.

### After applying or during a controlled test

```sh
kubectl get deployment/<name> -n <namespace> -o yaml
kubectl rollout status deployment/<name> -n <namespace> --timeout=<duration>
kubectl rollout history deployment/<name> -n <namespace>
kubectl get rs,pods -n <namespace> -l <selector> -o wide
kubectl describe pod/<name> -n <namespace>
kubectl get events -n <namespace> --sort-by=.lastTimestamp
kubectl get endpointslice -n <namespace> -l kubernetes.io/service-name=<service>
kubectl get pdb -n <namespace>
kubectl logs pod/<name> -n <namespace> --all-containers --previous
```

Capture observed generation/revision, controller conditions, ready/available replicas, Pod conditions and container last state, endpoint membership, events, logs, PDB disruption allowance, and the result of a safe semantic request through the intended path. `kubectl top` is optional evidence and depends on a working metrics pipeline; absence of metrics is not proof of low usage.

Evidence labels:

- **FACT:** read from the repository, rendered object, target API, or authoritative project policy;
- **TESTED:** reproduced by a named test or controlled command with scope and versions recorded;
- **ASSUMPTION:** required because a provider, controller, runtime, policy or external path was not observed;
- **UNVERIFIED:** expected but not demonstrated;
- **RESIDUAL:** remaining failure or operational risk with owner/follow-up.

## Test matrix and acceptance criteria

Derive tests from the actual workload and change. The applicable set normally includes:

- valid create/update plus idempotent re-apply and reconciliation after controller/kubelet interruption;
- image-pull, admission, RBAC, quota, `Pending`/unschedulable, insufficient CPU/memory, OOM, eviction and dependency-unavailable failures;
- slow startup, startup-probe failure, liveness failure, readiness withdrawal, overload/maintenance drain and endpoint convergence;
- rollout with available surge capacity, no-surge or quota pressure, partial readiness, stalled progress, termination during update, and an authorized rollback;
- Service selector/EndpointSlice correctness and a semantic request through the intended internal/external route;
- allowed and denied ServiceAccount actions, security-policy rejection, non-root/capability/seccomp behavior where applicable;
- voluntary eviction with PDB, involuntary disruption, SIGTERM handling, bounded drain, `PreStop` failure/timeout and forced termination;
- target-version API validation, deprecated/removed API detection, stale update/resource-version conflict and extension/controller compatibility.

The work is accepted only when:

1. Activation and non-activation boundaries, Kubernetes/vendor boundaries and ownership are explicit.
2. The changed workload has a traceable controller, selector, ServiceAccount, configuration source, dependency and failure owner.
3. Probe semantics match the application contract, and readiness, rollout completion and application correctness are validated separately.
4. Resource requests/limits, security context/RBAC, disruption policy and termination behavior are intentional or explicitly recorded as unresolved.
5. Rollout, stall detection, rollback prerequisites and irreversible data/schema effects are documented and tested at the applicable level.
6. The exact validation commands/evidence and target versions are recorded; no claim equates `apply` with healthy traffic.
7. Tests cover the applicable normal, boundary, failure, recovery, authorization and compatibility cases, with external/provider evidence clearly marked.
8. The source index is consulted for source-sensitive claims and all remaining limitations are reported.

Read [references/source-index.md](references/source-index.md) when a decision depends on the authoritative Kubernetes behavior or a version-sensitive boundary. It is a source map, not a replacement for target-cluster evidence.
