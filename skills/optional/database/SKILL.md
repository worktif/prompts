---
name: database
description: Design, review, or implement database-backed changes involving schemas, SQL, indexes, transactions, locking, consistency, persistence, or storage contracts; do not activate for purely in-memory data or transport-only work.
---

# Database

Treat the database as a compatibility, integrity, and concurrency boundary. Establish what the repository and the database implementation actually guarantee before proposing SQL, schema changes, or persistence behavior.

Read [references/source-index.md](references/source-index.md) when a decision depends on a standard term, an isolation/concurrency claim, a PostgreSQL behavior, or a security control. PostgreSQL references are implementation evidence, not vendor-neutral guarantees.

## Activation boundary

Activate this skill when the task changes or evaluates any of the following:

- relational or non-relational schema, keys, cardinality, nullability, defaults, generated values, constraints, retention, or storage format;
- SQL or database queries, query builders, ORMs, query plans, indexes, pagination, or connection behavior;
- transaction boundaries, isolation, MVCC/snapshot behavior, optimistic or pessimistic concurrency, locks, deadlocks, retries, or consistency;
- a database-backed API, job, cache-aside flow, event record, or persistence failure/recovery behavior;
- backup/restore, replication/read-after-write behavior, or a claim about durable data.

Do not activate for a purely in-memory data structure, a transport-only API change with no persistence contract, or a generic performance change where database behavior is not in scope. Combine with `data-migration` for backfills, imports/exports, dual writes, or schema/data rollout execution; this skill defines the storage and concurrency contract, while that skill defines transformation safety and reconciliation.

## Responsibilities

This skill owns the database-specific part of the work:

1. Establish the current storage contract from repository evidence: engine and version, schema/migrations, access layer, transaction wrapper, connection/pool lifecycle, readers and writers, replicas, and relevant tests or operational runbooks.
2. Make data invariants explicit: identity, ownership, cardinality, null meaning, allowed states, uniqueness scope, referential integrity, ordering, time semantics, retention, and whether a value is authoritative or derived.
3. Map each invariant to its enforcement point. Prefer a database constraint or atomic database operation for invariants that concurrent writers can violate; do not rely on a racy read-then-write check.
4. Define the transaction boundary, isolation assumption, lock behavior, retry policy, idempotency behavior, and outcome when the client loses the connection after the server may have committed.
5. Evaluate query correctness and access paths using representative data and the target engine. Indexes are a workload decision: account for selectivity, ordering, write cost, space, maintenance, and plan stability.
6. Preserve compatibility across schema evolution. Identify old and new readers/writers, deployment order, lock exposure, rollback or forward-fix plan, and cleanup of transitional structures.
7. Report facts, source-backed implementation behavior, assumptions, recommendations, and unknowns separately.

This skill does not decide transport status codes, user-facing authorization policy, general service orchestration, cloud topology, or non-database business policy. It supplies the persistence contract and evidence those decisions depend on.

## Decision rules

### Evidence before design

Before editing, record:

- goal, in-scope and out-of-scope behavior, affected data, and acceptance criteria;
- the authoritative schema and migration path, including naming and compatibility conventions;
- every relevant reader/writer and the ownership of each state transition;
- engine/version, dialect, isolation default, replication mode, driver behavior, and known operational limits;
- expected cardinality, write/read mix, hot keys, latency/error targets, retention, and recovery requirements;
- assumptions that cannot be verified locally and the cheapest verification for each.

If the schema, transaction wrapper, or migration mechanism is not found, say so and do not invent one. A query written against an imagined schema is not an implementation.

### Integrity and schema

- Use `NOT NULL`, unique/primary-key, foreign-key, check, exclusion, or equivalent engine constraints for invariants the database can enforce. Application validation remains useful for clear errors, but it is not a concurrency guarantee.
- Distinguish “missing”, “unknown”, “not applicable”, and “empty” before choosing nullability or sentinel values. Do not infer `NOT NULL` from a check expression; three-valued logic and null treatment are engine-specific at important edges.
- Define uniqueness precisely: key columns, tenant/namespace scope, active-row scope, case/collation rules, and null behavior. A preflight `SELECT` followed by an insert is not sufficient under concurrent writers.
- Keep derived data, denormalized copies, and caches tied to an owner, refresh rule, staleness bound, and reconciliation path. Do not call a projection authoritative without evidence.
- Treat generated identifiers as identifiers, not business sequence numbers. Gaplessness, ordering, and rollback/reuse behavior must be verified for the selected engine.

### Queries and indexes

- Bind values through the driver/query abstraction. If a value must affect an identifier, operator, sort direction, or other SQL structure that cannot be bound, map it through a closed allow-list; never concatenate unchecked external input.
- Specify ordering for pagination. Offset pagination requires a stable, unique tie-breaker; keyset pagination requires a matching seek predicate and ordering contract. Verify behavior across inserts/deletes between pages.
- Analyze the actual query shape, predicates, joins, sort/group operations, returned columns, and expected result size before adding an index. An index that helps one read can slow writes, increase storage, or be ignored by the planner.
- Inspect a plan with representative statistics and data. Treat estimated rows/costs as estimates, not latency proof; measure the safe form of `EXPLAIN ANALYZE` only where its side effects are controlled.
- For a vendor-specific index feature or online DDL mode, document lock level, transaction restrictions, failure residue, concurrent-write behavior, and cleanup procedure. Do not generalize a PostgreSQL index or planner detail to another engine.

### Transactions and concurrency

- Put all state changes that must succeed or fail together in one transaction, and keep the transaction no wider than the integrity requirement. External calls, user interaction, and unbounded work do not belong inside it unless the design explicitly accounts for the lock and failure consequences.
- Choose isolation from the anomaly the operation must prevent, not from the label alone. Name the relevant read/write set and whether dirty reads, non-repeatable reads, phantoms, write skew, lost updates, or serialization anomalies are acceptable.
- Prefer one atomic statement when it expresses the invariant. Otherwise use a documented lock/order/isolation strategy. A stable snapshot does not by itself make a cross-row business rule serializable.
- Treat uniqueness/conflict, deadlock, serialization failure, lock timeout, statement timeout, cancellation, and connection loss as distinct outcomes. Retry only errors proven safe to retry, and retry the complete transaction from its beginning with bounded backoff and an attempt limit.
- Make transaction cleanup explicit: rollback or discard the connection after failure according to driver semantics, release pooled connections on every path, and prevent “idle in transaction” leakage.
- Acquire locks on multiple objects in a consistent order. Do not assume deadlocks require explicit `LOCK`; row-level operations can deadlock. A deadlock retry must rerun the whole transaction, not only the failed statement.
- If a response or message must correspond to a committed row, define the commit/ack ordering and idempotency key. A database commit and an external message/API response are not one atomic action unless the architecture proves that they are.
- Treat replica reads as a separate consistency contract. If read-after-write is required, route or fence the read accordingly; do not infer freshness from successful primary commit.

### Schema changes and recovery

- For a live system, use an expand/compatibility/migrate/contract shape unless a coordinated breaking change is explicitly authorized. New readers must tolerate old data and old writers where deployment overlap exists.
- Before a destructive or high-lock operation, define a recoverable plan: backup or snapshot evidence, rollback/forward-fix path, lock and duration budget, abort criteria, monitoring, and post-change invariant checks. “The migration command exited zero” is not recovery evidence.
- Separate schema rollback from data rollback. A backward schema change may not restore transformed or deleted data. If rollback is impossible, state the compensating or forward-fix procedure.
- Test the restore path when the task claims recoverability or durable disaster recovery. State what was restored, to which version, with what data-loss window, and which application checks passed.

## Mandatory controls versus optional recommendations

The following are mandatory unless the task explicitly proves they do not apply:

- parameterized values and allow-listed SQL structure;
- explicit transaction boundaries for multi-step integrity changes;
- a database-enforced uniqueness/referential/state invariant where concurrent writers can violate it;
- defined behavior for duplicate delivery, conflict, rollback, timeout/cancellation, connection loss, and retry;
- connection cleanup after transaction failure and bounded retry attempts;
- a compatibility and recovery plan for live schema changes;
- tests at the real storage boundary for constraints and applicable transaction/concurrency behavior.

These are conditional recommendations, not defaults:

- `SERIALIZABLE` isolation, explicit row/table/advisory locks, optimistic version columns, or compare-and-swap;
- partial, covering, expression, clustered, partition-local, or vendor-specific indexes;
- read replicas, caching, denormalization, partitioning, sharding, online DDL, or an outbox/CDC mechanism;
- stronger backup, encryption, auditing, retention, or compliance controls beyond the stated contract.

Choose an optional control only when the invariant, workload, failure mode, or operational requirement justifies it, and record its cost and new failure modes.

## Workflow

1. **Classify the boundary.** Decide whether this is schema, query, transaction/concurrency, persistence/recovery, or a combination. Identify whether `data-migration` or `backend` also applies.
2. **Discover the current system.** Read `AGENTS.md`, manifests, schema/migrations, access-layer code, transaction helpers, callers, tests, CI, and operational documentation. Inspect staged and unstaged changes before editing.
3. **Write the contract.** Record entities/records, ownership, invariants, null/default/generated semantics, query inputs/outputs, transaction scope, isolation, conflict/retry outcomes, compatibility, retention, and recovery.
4. **Trace competing executions.** For each read-then-write or multi-row rule, enumerate concurrent interleavings. Choose atomic DML, a constraint, lock ordering, version check, or a verified isolation level. Explain why the chosen mechanism prevents the named anomaly.
5. **Evaluate access paths.** Use representative cardinalities and distributions. Check plan shape, row estimates, sort/join behavior, index maintenance cost, and whether the access layer preserves parameter binding and stable ordering.
6. **Design the smallest change.** Extend the existing repository abstraction and migration mechanism. Preserve public names and unrelated worktree changes. Do not create a second persistence or transaction path.
7. **Verify before claiming completion.** Run storage-boundary, failure, concurrency, compatibility, and plan/recovery checks that correspond to the risks. Inspect the final diff and record skipped checks.

## Failure modes and required handling

| Failure or ambiguity | Required response |
| --- | --- |
| Duplicate request or redelivery | Define an idempotency key and durable uniqueness/claim rule, or state why the operation is intentionally non-idempotent. Test replay. |
| Unique/conflict error | Map the constraint to the domain outcome; do not treat “already exists” as a successful create without a documented contract. |
| Deadlock or serialization failure | Abort the transaction, classify the error, retry the complete transaction only within a bounded policy, and emit evidence of attempts/final outcome. |
| Lock or statement timeout | Roll back/cleanup the connection, surface a retryable or terminal result explicitly, and investigate lock ownership and transaction duration. |
| Connection lost after commit may have occurred | Treat outcome as unknown; query by idempotency key or use a verified reconciliation path before retrying a non-idempotent operation. |
| Replica is stale or unavailable | Use the declared consistency path or return an explicit unavailable/stale result; never silently substitute stale data for an authoritative read. |
| Schema version skew | Keep old/new readers and writers compatible or stop the rollout; do not assume deployment order from migration filenames. |
| Failed online/index operation leaves residue | Inspect engine-specific catalog state, remove or repair invalid artifacts according to documented recovery, and rerun invariant/plan checks. |
| Backup exists but restore is untested | Report recoverability as unverified and perform or schedule a restore validation before claiming it. |
| Unsafe dynamic SQL or missing schema evidence | Stop implementation of that path, replace with the existing safe abstraction or obtain the missing evidence. |

## Verification requirements

Derive checks from the contract and failure table. At minimum, where applicable:

- validate malformed, boundary, empty, null, duplicate, maximal, and old-version inputs;
- assert every relevant constraint and error mapping, including concurrent uniqueness and foreign-key behavior;
- run integration tests against the target engine/version or a documented equivalent; mocks do not prove transaction semantics;
- exercise competing transactions with controlled barriers, covering lost updates, write skew/phantoms, deadlocks, lock timeouts, serialization failures, rollback, retry, and cancellation as applicable;
- verify connection/pool cleanup after statement and transaction failure;
- inspect plans with representative data/statistics and compare measured latency/error behavior at the relevant scale;
- test old/new schema compatibility, migration rerun/partial failure behavior, rollback or forward-fix, and reconciliation;
- if persistence/recovery is in scope, perform a restore test and validate application invariants after restore;
- re-read the acceptance criteria and inspect the final diff for accidental schema/API changes, unsafe defaults, unbounded retries, swallowed errors, and unsupported claims.

Do not use unit-test success, a green migration process, a single plan, or a backup-file listing as proof of real transaction, performance, or recovery guarantees.

## Evidence and reporting

Report:

- **Verified facts:** repository paths, schema/engine/version, observed behavior, exact commands, test environment, and results.
- **Source-backed behavior:** the standard, paper, or vendor documentation and the exact implementation/version it describes.
- **Assumptions:** workload, deployment order, driver semantics, replica freshness, or operational controls not verified.
- **Decision:** selected invariant enforcement, transaction/isolation/lock strategy, index/query change, compatibility plan, and why alternatives were rejected.
- **Limitations:** skipped tests, unavailable database/version, unmeasured production load, untested restore, or unresolved ambiguity.

Use precise outcomes such as `PASS`, `FAIL`, `VERIFIED LOCALLY`, `UNVERIFIED IN PRODUCTION`, or `BLOCKED BY MISSING EVIDENCE`. Never report “transaction-safe”, “serializable”, “durable”, “zero-downtime”, or “backward-compatible” without naming the tested boundary and evidence.

## Interaction with the four core skills

- **`engineering-discovery`:** discovery owns overall repository scope, architecture, ownership, constraints, and acceptance criteria. This skill adds the persistence-specific contract, schema/data-flow trace, concurrency risks, and recovery questions; it does not replace discovery.
- **`engineering-implementation`:** implementation owns code changes and public API/lifecycle integration. This skill supplies storage invariants, SQL/query/transaction contracts, migration compatibility, and database-specific error behavior; it does not create a parallel repository or transaction abstraction.
- **`engineering-review`:** review owns the independent PASS/FAIL verdict over the actual diff and repository state. This skill supplies database review questions and evidence expectations; it does not approve a change merely because a query or migration looks plausible.
- **`engineering-verification`:** verification owns execution and reporting of the risk-based checks. This skill identifies the storage-boundary, concurrency, plan, compatibility, and recovery tests required by the database contract; it does not claim production verification from local tests.
