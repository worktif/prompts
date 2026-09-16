# Kubernetes source index

This is a routing and evidence guide for the Kubernetes skill. The links are official Kubernetes documentation and were checked on 2026-09-15; the documentation site currently exposes Kubernetes 1.37 as the latest minor version. Read the linked page for the target cluster version before making a version-sensitive claim. These sources describe Kubernetes behavior, not the behavior of a cloud provider, ingress/gateway, service mesh, CNI/CSI plugin, container runtime, registry, admission policy, GitOps tool, Helm, or third-party operator.

## Control loops and workload ownership

- **Source:** [Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) and [Workload Management](https://kubernetes.io/docs/concepts/workloads/controllers/)
- **Supports:** The control-loop model: controllers observe shared state and move current state toward desired state; workload controllers manage Pods through the appropriate higher-level resource. It supports explicit owner/selector analysis and idempotent reconciliation design.
- **Do not use for:** A guarantee of convergence, a particular controller's availability, operator behavior, or proof that a custom controller is correct. Those require target controller code, status and events.

## Pod lifecycle, phases and termination

- **Source:** [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- **Supports:** Pod phases and container states, one-time scheduling/binding, restart-policy behavior, readiness effects, deletion/termination flow, SIGTERM/graceful shutdown and forceful termination boundaries.
- **Do not use for:** Durable Pod identity, application health, external load-balancer draining, exact cross-container shutdown order, or a promise that a replacement Pod preserves local state.

## Probes

- **Source:** [Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
- **Supports:** Probe execution and fields; startup gating of liveness/readiness; liveness/startup failure restart behavior; readiness failure keeping the container running and removing its endpoint from matching Services; probe-induced failure and restart risks.
- **Do not use for:** A universal health-check contract, business correctness, end-to-end traffic success, or an external router's interpretation of readiness. Probe paths and thresholds remain workload-specific.

## Services and endpoint membership

- **Source:** [Service](https://kubernetes.io/docs/concepts/services-networking/service/) and [EndpointSlices](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/)
- **Supports:** Service selector-to-backend discovery, EndpointSlice as the current endpoint API, endpoint `ready`/`serving`/`terminating` conditions, and the relation between Pod `Ready` and Service endpoint eligibility.
- **Do not use for:** A claim that every ingress, gateway, service mesh, external load balancer, client or DNS path honors endpoint state identically; verify those components separately. Do not use the deprecated Endpoints API as the current default.

## Declarative application and `kubectl apply`

- **Source:** [Declarative Management of Kubernetes Objects Using Configuration Files](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/), [kubectl apply reference](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/), and [Introduction to kubectl](https://kubernetes.io/docs/reference/kubectl/introduction/)
- **Supports:** Declarative create/update from configuration, `kubectl diff` as a change preview, server interaction through the API, and the distinction between configuration management and workload observation.
- **Do not use for:** A claim that `apply` proves reconciliation, readiness, rollout completion, endpoint publication, application correctness or external traffic health. Those require observed status, endpoints and a semantic request test.

## Deployments and rollout control

- **Source:** [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- **Supports:** Deployment-to-ReplicaSet rollout behavior, `RollingUpdate`/`Recreate`, `maxSurge`, `maxUnavailable`, readiness/availability, `minReadySeconds`, progress conditions/deadlines, rollout status, revision history and `rollout undo`.
- **Do not use for:** A guarantee that a rollout is safe for database/schema changes, a guarantee of zero failed requests, an automatic rollback guarantee, or provider-specific canary/blue-green behavior. `progressDeadlineSeconds` reports stalled progress; it is not an automatic repair mechanism.

## Compute resources and scheduling

- **Source:** [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) and [Assign Memory Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/)
- **Supports:** CPU/memory/ephemeral-storage requests and limits, scheduler capacity checks based on requests, runtime handoff/enforcement, namespace defaults/quotas references, and memory-over-limit termination/OOM evidence.
- **Do not use for:** Universal sizing values, provider/node capacity, autoscaler behavior, exact CPU throttling or eviction policy, or an availability/SLO claim from requests and limits alone. Measure the workload and inspect the target cluster.

## Security context and Pod Security Standards

- **Source:** [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/), [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/), and [Linux kernel security constraints for Pods and containers](https://kubernetes.io/docs/concepts/security/linux-kernel-security-constraints/)
- **Supports:** Pod/container security-context scope and override rules; UID/GID, filesystem group, capabilities, privilege escalation, seccomp and related Linux controls; and the documented Privileged, Baseline and Restricted policy profiles.
- **Do not use for:** A universal requirement to use Restricted, a claim of isolation independent of the node OS/runtime, a proof that an image works as non-root, or cloud/IAM/network security. Verify admission, image behavior, node support and policy enforcement.

## RBAC and API authorization

- **Source:** [Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) and [Role Based Access Control Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/)
- **Supports:** Role, ClusterRole, RoleBinding and ClusterRoleBinding; additive/no-deny semantics; namespace scope; ServiceAccount authorization; least privilege; and the risk of wildcards and broad bindings.
- **Do not use for:** Application-user authorization, cloud-provider IAM, network policy, admission, secret encryption, or proof that a permission is effective without `kubectl auth can-i`/API evidence as the intended identity.

## Disruptions and PodDisruptionBudgets

- **Source:** [Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
- **Supports:** Voluntary versus involuntary disruptions, PDB selection and availability budgeting, eviction-aware behavior, and the fact that direct Pod/Deployment deletion and several failure modes are not constrained by PDBs.
- **Do not use for:** A guarantee against node failure, resource pressure, forced deletion, bad deployments, or traffic correctness. PDBs complement replication, topology, capacity and readiness; they do not replace them.

## Container lifecycle hooks and graceful shutdown

- **Source:** [Container Lifecycle Hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) and the [Pod termination flow](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-flow)
- **Supports:** PostStart/PreStop timing, PreStop-before-TERM behavior, shared termination-grace budget, hook timeout failure mode and the kubelet/runtime termination boundary.
- **Do not use for:** Exact hook execution ordering across containers, guaranteed external connection draining, or a substitute for application SIGTERM handling. Test the real process and routing path.

## API semantics, compatibility and deprecation

- **Source:** [Kubernetes API Concepts](https://kubernetes.io/docs/reference/using-api/api-concepts/), [The Kubernetes API](https://kubernetes.io/docs/concepts/overview/kubernetes-api/), [Kubernetes Deprecation Policy](https://kubernetes.io/docs/reference/deprecation-policy/), and [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/)
- **Supports:** Versioned API representations, server-managed concurrency metadata such as `resourceVersion`, API stability/deprecation/removal rules, supported component version skew and the need to inspect the target server.
- **Do not use for:** Compatibility of a particular CRD/operator/admission webhook/client library, support for an unobserved feature gate, or a claim that the current docs apply unchanged to an older distribution. Check served resources, `kubectl explain`, extension release notes and cluster configuration.

## Validation boundary

The official docs support commands such as `kubectl version`, `kubectl explain`, `kubectl diff`, dry-run validation, `kubectl rollout status/history`, `kubectl get/describe`, event/log inspection, endpoint inspection and `kubectl auth can-i`. A command result is evidence only for the named resource, identity, namespace, cluster version, time and path. Static validation cannot establish runtime convergence or healthy traffic; a successful API write cannot establish either.

## Research limitations

- The research used official Kubernetes documentation pages available on 2026-09-15 and did not inspect a live cluster, repository-specific manifests, CRDs, admission configuration, cloud integrations, container runtime, service mesh, external load balancer or application behavior.
- Kubernetes documentation describes supported semantics, not every implementation detail or failure timing. Feature gates, minor-version differences, distribution patches, runtime/OS behavior and extension controllers can change the observed result.
- Resource sizing, probe thresholds, rollout budgets, PDB values, security exceptions, migration ordering and rollback safety require workload-specific measurements, policy decisions and controlled tests.
