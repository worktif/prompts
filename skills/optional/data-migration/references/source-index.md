# Data migration source index

Checked 2026-09-15. These are source anchors for decisions in `SKILL.md`, not a substitute for repository evidence or an operational runbook. Notes identify the supported claim and its boundary. Do not copy normative or copyrighted text; consult the linked source for the full rule and the version that applies to the target system.

## Primary implementation sources: PostgreSQL

1. [PostgreSQL 18, Data Definition](https://www.postgresql.org/docs/current/ddl.html) — Defines PostgreSQL’s data-definition area and links the command-specific DDL behavior. Supports treating DDL as engine/version-specific. It does not define a universal migration workflow or prove that every DDL command is transaction-safe.

2. [PostgreSQL 18, ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html) — Documents that `ALTER TABLE` lock requirements vary by subform and that `ACCESS EXCLUSIVE` is the default unless explicitly noted; it also documents `NOT VALID` constraint addition/validation behavior and constraint-specific locks. Use the exact subform and target version; do not generalize one `ALTER TABLE` form to another engine or command.

3. [PostgreSQL 18, Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) — Defines table/row lock modes, conflicts, transaction-held locks, and deadlock behavior. Supports inspecting lock impact, using consistent lock ordering, and retrying a complete failed transaction. It does not provide the migration’s workload-specific lock budget.

4. [PostgreSQL 18, Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) — Defines PostgreSQL’s isolation behavior, including the need to retry serialization failures and the non-rollback behavior of sequence changes. Supports choosing isolation from a named anomaly and documenting retry behavior. It does not make a business invariant safe without the required predicates, locks, or constraints.

5. [PostgreSQL 18, Transactions tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html) — Documents explicit `BEGIN`/`COMMIT`/`ROLLBACK` transaction blocks and implicit per-statement transactions when no block is used. Supports making batch transaction boundaries explicit. It is introductory and does not specify a safe batch size or application driver cleanup policy.

6. [PostgreSQL 18, CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) — Documents concurrent index-build behavior, reduced write blocking, extra scans/waits, failure residue, and the restriction that `CREATE INDEX CONCURRENTLY` cannot run inside a transaction block. Supports classifying this as a separate migration step with its own cleanup and retry path. It is PostgreSQL-specific.

7. [PostgreSQL 18, Client Connection Defaults](https://www.postgresql.org/docs/current/runtime-config-client.html) — Documents `lock_timeout` and `statement_timeout`, including that lock timeout applies while waiting for locks and that settings affect statements rather than proving overall migration success. Supports deliberate session-scoped timeouts and explicit reconciliation after timeout. It does not prescribe values.

8. [PostgreSQL 18, Backup and Restore](https://www.postgresql.org/docs/current/backup.html) — Distinguishes SQL dump, file-system-level backup, and continuous archiving as different approaches with different properties. Supports choosing and naming the recovery mechanism instead of treating “backup” as one guarantee.

9. [PostgreSQL 18, SQL Dump](https://www.postgresql.org/docs/current/backup-dump.html) — Documents that a SQL dump recreates the database state represented by the dump and describes restore transaction choices and their partial-restore trade-off. Supports testing the actual logical restore path and not assuming a dump automatically provides point-in-time or table-level rollback.

10. [PostgreSQL 18, pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html) — Documents consistent exports during concurrent database use, no blocking of ordinary readers/writers, logical versus archive formats, and the limitation that `pg_dump` is generally not the regular production-backup choice except in simple cases. Supports using it for an appropriate logical-export/dry-run purpose, not as an unqualified production recovery claim.

11. [PostgreSQL 18, pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) — Documents restore error handling, selective/sectioned restore, `--exit-on-error`, single-transaction behavior, transaction-size trade-offs, and the need for post-restore statistics/validation. Supports an explicit restore verification and error policy. It does not verify application consumers.

12. [PostgreSQL 18, Continuous Archiving and Point-in-Time Recovery](https://www.postgresql.org/docs/current/continuous-archiving.html) — Documents WAL archiving, base backups, point-in-time recovery, required WAL coverage, and that this mechanism restores an entire cluster rather than an arbitrary subset. Supports stating the recovery point, retention/WAL prerequisites, and scope limitations.

## Evolutionary database design

13. [Martin Fowler and Pramod Sadalage, Evolutionary Database Design](https://martinfowler.com/articles/evodb.html) — Supports version-controlling database artifacts with application code, representing changes as uniquely tracked migrations with sequencing metadata, testing migrations against database copies, and coordinating schema, data, and access-code changes. It also discusses parallel change/multiple live versions and consumer contracts. This is experience-based design guidance, not a PostgreSQL guarantee or a universal requirement to use a particular migration tool.

## Google SRE data-pipeline guidance

14. [Google SRE Book, Data Processing Pipelines](https://sre.google/sre-book/data-processing-pipelines/) — Describes operational fragility from uneven chunks, overlapping periodic runs, resource exhaustion, missing checkpointing, weak monitoring, and naive or absent retry logic. Supports bounded work units, progress telemetry, overlap control, checkpointing, and carefully designed retries. The chapter’s examples concern large-scale pipeline systems; adapt the principles to the actual workload rather than copying its architecture.

15. [Google SRE Workbook, Improve and Optimize Data Processing Pipelines](https://sre.google/workbook/data-processing/) — Recommends production-shaped staging data, end-to-end integration checks, A/B comparison with known-good output, dry runs/canaries/partial data rollout, tested backup/restore, health and SLO monitoring, idempotent mutations, two-phase mutation with verification before apply, and checkpointing for resumability. Supports the dry-run, consumer-verification, idempotency, checkpoint, and recovery gates in `SKILL.md`. The percentages and examples in the source are illustrative, not mandatory thresholds.

## Synthesis used by this skill

The following are deliberate operational synthesis, not quotations or single-source mandates:

- inventory plus an explicit mapping/invariant contract before mutation;
- expand/migrate/contract with a compatibility matrix and a window that covers deployment, retries, queues, caches, replicas, and offline clients;
- stable-key batching, durable checkpoints, idempotent replay, reconciliation, and stopping on unknown outcomes;
- separating runner/schema/data rollback from compensation or forward fix;
- treating malformed, duplicate, conflicting, already-migrated, partial-failure, and consumer cases as distinct test and reporting categories;
- requiring destructive-action approval and tested recovery evidence before contract cleanup.

These controls combine the cited PostgreSQL mechanics, Fowler’s evolutionary/parallel-change practices, Google SRE pipeline reliability guidance, and general engineering risk reasoning. The actual thresholds, tolerances, lease mechanism, batch size, isolation level, backup policy, and approval authority must come from the repository, workload, database version, and operating organization.

## Research limitations

- No project schema, migration runner, driver, production topology, workload profile, consumer inventory, or restore environment was available in this skill directory, so this index cannot validate any project-specific claim.
- PostgreSQL links target the current documentation version as of the check date; older server versions can differ in syntax, lock behavior, and available options. Pin and verify the target server version before execution.
- Fowler’s article is an authoritative primary essay for the named design practice but is not a formal standard and does not prove safety for a particular deployment.
- Google SRE material is guidance and experience, not a database transaction specification; it does not establish exactly-once behavior for an arbitrary runner.
- Counts, checksums, snapshots, logical dumps, replicas, and successful process exits each cover different failure modes. None alone proves semantic equivalence, consumer correctness, or a tested restore.
