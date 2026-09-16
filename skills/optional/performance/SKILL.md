---
name: performance
description: Measure, diagnose, or change software where latency, throughput, capacity, resource usage, scalability, tail behavior, or operating cost is a requirement; do not use for optimization claims without a workload and baseline.
---

# Performance Engineering

Use when performance is part of the acceptance criteria or when an observed bottleneck, saturation, regression or cost problem is being investigated. Performance is a property of a workload in an environment, not an intrinsic label attached to a code fragment.

## Establish the experiment

Record the workload model, input distribution, concurrency, request mix, dataset size, warm/cold state, hardware/runtime versions, deployment topology, external dependencies, measurement window, metric definitions and acceptance thresholds. Define whether the objective is response-time percentile, throughput, resource headroom, capacity, cost per operation or a combination. Preserve a reproducible baseline.

## Diagnose before changing

Trace the critical path and measure the dominant constraint: algorithmic complexity, CPU, allocation/GC, memory growth, lock contention, queueing, I/O, serialization, network, database plan, rate limit or external service. Use profiling, tracing, query plans and load tests appropriate to the runtime. Inspect distributions and tail latency; averages can hide saturation and bimodal behavior. Separate successful and failed request latency.

## Change safely

- Prefer a measured bottleneck removal or architectural correction over speculative micro-optimization.
- Preserve semantics, ordering, authorization, error behavior, cancellation, idempotency and resource cleanup.
- Bound queues and in-flight work; define backpressure and fail-fast behavior where overload can amplify latency or failures.
- Re-run the same workload against baseline and candidate, with enough repetitions to make variance visible.
- Check CPU, memory, I/O, network, cost and downstream effects; an improvement in one metric may regress another.

## Verification and evidence

Add a benchmark, load test, profile or capacity experiment when it can provide stable regression evidence. Report environment, workload, baseline, candidate, percentile/throughput/resource results, variance, statistical limitations and the exact command or harness. Do not claim scalability from a single local run, or performance improvement without comparable before/after measurements. For SLO-bound services, connect the measured metric to user-visible SLIs and the stated error budget.

Read [references/source-index.md](references/source-index.md) for the source boundaries behind SLOs, overload, monitoring and cloud efficiency.
