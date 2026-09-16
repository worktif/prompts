---
name: data-migration
description: Plan, implement, or verify data transformations, backfills, imports, exports, schema transitions, dual writes, or compatibility migrations where integrity, resumability, and recovery matter.
---

# Data Migration

Use when existing data or its consumers change. A migration is complete only when the target data satisfies explicit invariants and all relevant readers/writers behave correctly.

## Inventory and invariants

Record source and target schemas, owners, identifiers, cardinality, null/unknown rules, encoding, ordering, timestamps, retention, volume, sensitive fields, consumers, writers, locks and compatibility window. Define conservation or transformation invariants: counts, uniqueness, referential integrity, checksums, domain totals and permitted loss/duplication. Preserve the original data and an auditable mapping unless deletion is explicitly required.

## Safe transition

For rolling deployments, use expand/migrate/contract: introduce compatible schema/capability, deploy readers/writers that tolerate both forms, migrate in bounded batches, reconcile, then remove the old form only after consumers are proven clear. Make each batch idempotent and resumable with checkpoints, stable ordering, rate/lock bounds and a durable progress record. Define pause, retry, compensation, rollback and operator stop conditions. Do not combine an irreversible destructive step with an unverified transformation.

## Verification

Perform a dry run or sampled rehearsal against representative data. Test empty, malformed, duplicate, maximal, missing-reference, already-migrated, partially-migrated and concurrent-write cases. Compare source and target counts plus domain invariants/checksums; verify old and new consumer behavior and backup/restore or rollback feasibility. Process exit status proves only that a process exited; it does not prove data correctness.

## Evidence

Report the exact source/target versions, migration algorithm, batch and lock limits, checkpoint/resume behavior, reconciliation results, failed records, compensation/rollback path, data-retention implications and unverified live boundaries. Do not run destructive migration or delete the old representation without explicit authorization and a recoverable plan.

Read [references/source-index.md](references/source-index.md) for database, evolutionary-schema and data-pipeline sources.
