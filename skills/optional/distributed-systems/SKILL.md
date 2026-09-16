---
name: distributed-systems
description: Design, implement, or review systems involving multiple processes, unreliable networks, queues, events, webhooks, replicas, retries, eventual consistency, or distributed coordination.
---

# Distributed Systems

Use when correctness depends on more than one independently failing component. Start by naming participants, state owners, communication channels, trust boundaries, failure domains and the exact guarantee required by the product.

## Contract first

For each message or request define schema/version, producer and consumer, acknowledgement point, delivery semantics, ordering scope, deduplication key, deadline, retry policy, maximum attempts, backoff/jitter, poison-message handling, dead-letter/replay policy and observability identifiers. State whether the system provides at-most-once, at-least-once or an effectively-once outcome under a named boundary. Never infer exactly-once from a successful API call or a queue name.

## State and failure

Identify the durable source of truth and when state becomes visible. Define behavior for lost, duplicated, delayed, reordered and partially processed messages; dependency timeout; process crash before/after acknowledgement; restart/resume; concurrent writers; partition or stale reads; and operator replay. Make handlers idempotent or use a durable deduplication mechanism. Bound queues and in-flight work, apply backpressure and avoid retries that amplify overload. Reconciliation must detect divergence rather than assume eventual convergence.

## Implementation and testing

Preserve explicit lifecycle ownership and cancellation. Do not acknowledge work before the required durable transition. Keep retryable and non-retryable errors distinct. Test normal flow plus duplicate, lost, delayed, reordered, malformed, oversized, expired, unauthorized, dependency-failure, timeout, retry-exhaustion, restart and concurrent-update cases. Test the real protocol and persistence boundary when the guarantee depends on it.

## Evidence

Report the exact guarantees, their scope and assumptions; message and state diagrams when needed; retry/dead-letter policy; tests executed; fault-injection results; and unresolved recovery or operational dependencies. Do not call a system “reliable” because one component passed a unit test.

Read [references/source-index.md](references/source-index.md) for RFC, SRE and AWS source boundaries.
