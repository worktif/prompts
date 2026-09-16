# Database skill source index

Checked 2026-09-15. These are source anchors for decisions in `SKILL.md`, not tutorials. Notes state exactly what each source supports and where its scope ends. Do not copy normative or copyrighted text; consult the linked source for the full rule.

## Standards and research

1. [ISO/IEC 9075-1:2023, SQL/Framework](https://www.iso.org/standard/76583.html) — Defines the conceptual framework, terminology, notation, and processing model used by the SQL series. Supports using “SQL standard” as a scoped reference rather than treating one engine’s dialect as the standard. The public page is a scope record, not the full normative text.

2. [ISO/IEC 9075-2:2023, SQL/Foundation](https://www.iso.org/standard/76584.html) — Identifies the current published Foundation part for SQL data structures and operations. Supports checking the applicable standard edition and separating standard SQL from vendor extensions. It does not establish that a particular engine implements every feature.

3. [ISO/IEC 9075-11:2023, SQL/Schemata](https://www.iso.org/standard/76586.html?browse=tc) — Specifies the Information Schema and Definition Schema scope, including SQL-data structure, integrity constraints, authorization specifications, feature support, and sizing information. Supports inspecting implementation metadata and distinguishing declared standard feature support from assumptions.

4. [Berenson et al., “A Critique of ANSI SQL Isolation Levels,” Proceedings of the 1995 ACM SIGMOD International Conference (1995)](https://doi.org/10.1145/223784.223785) — Primary concurrency research showing that the ANSI phenomena descriptions do not fully characterize several implemented isolation behaviors, and defining snapshot isolation and additional anomalies. Supports naming anomalies and not choosing an isolation level from its label alone. It is research, not a universal prescription for every engine.

5. [Fekete et al., “Making Snapshot Isolation Serializable,” ACM Transactions on Database Systems (2005)](https://doi.org/10.1145/1071610.1071615) — Primary research on when snapshot isolation can admit non-serializable executions and how serialization can be detected/achieved. Supports treating snapshot-style isolation as distinct from serializability and considering write-skew-style conflicts. The results do not imply identical implementation behavior across products.

## PostgreSQL implementation references

6. [PostgreSQL 18, Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) — Documents PostgreSQL’s Read Committed, Repeatable Read, and Serializable behavior; snapshot timing; retryable serialization failures; predicate-lock implementation details; and the fact that sequence changes are not rolled back like ordinary row changes. Supports PostgreSQL-specific verification only; do not generalize it to other engines.

7. [PostgreSQL 18, Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) — Documents table/row lock modes, lock duration, deadlocks from table or row operations, automatic deadlock detection/abort, consistent lock ordering, bounded transaction duration, and advisory-lock semantics. Supports the lock/retry rules in the skill when PostgreSQL is the selected implementation.

8. [PostgreSQL 18, Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) — Documents check, not-null, unique, primary-key, foreign-key, and exclusion constraints; check expressions accepting true or null; restrictions on cross-row check constraints; and foreign-key indexing considerations. Supports database-enforced integrity and null/cross-row cautions for PostgreSQL, not a claim that every engine has the same syntax or behavior.

9. [PostgreSQL 18, Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) — Documents plan trees, scan/join choices, estimates, statistics, machine-readable formats, and `EXPLAIN ANALYZE` caveats. Supports requiring representative plans and measurements instead of assuming an index or reading estimated cost as wall-clock latency.

10. [PostgreSQL 18, CREATE INDEX](https://www.postgresql.org/docs/current/sql-createindex.html) — Documents index access methods, partial/expression indexes, uniqueness, included columns, write/storage trade-offs, and `CREATE INDEX CONCURRENTLY` lock, transaction, wait, and invalid-index failure behavior. Supports vendor-specific online-index decisions and cleanup plans; it is not a portable online-DDL rule.

11. [PostgreSQL 18, Backup and Restore](https://www.postgresql.org/docs/current/backup.html) — Distinguishes SQL dumps, file-system-level backups, and continuous archiving/PITR, and states that each has different strengths, weaknesses, and assumptions. Supports requiring a restore test for recoverability claims; it does not define an application’s RPO/RTO.

## Security boundary

12. [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) — Recommends prepared/parameterized statements, safe stored procedures, and allow-list validation for SQL structure such as table/column names or sort direction; explains why escaping alone is fragile. Supports the mandatory query-input control. It does not replace the repository’s authorization, secret-management, or threat-modeling work.

## How to use this index

- Use ISO sources for standard scope and terminology; use the research papers for concurrency/anomaly reasoning; use PostgreSQL docs only when PostgreSQL is the selected engine; use OWASP for the query-injection boundary.
- Record the engine/version and source URL in the report when a vendor behavior affects the decision.
- When sources disagree or the task spans multiple engines, stop treating the behavior as universal. Test the actual target or document the unresolved limitation.
