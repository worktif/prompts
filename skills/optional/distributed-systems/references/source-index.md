# Source index

- [Google SRE: Handling Overload](https://sre.google/sre-book/handling-overload/) — supports bounded concurrency, overload response and avoiding retries that amplify failure.
- [Google SRE: Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) — supports queue bounds, deadlines, fail-fast behavior and recognizing resource exhaustion.
- [AWS Builders Library](https://aws.amazon.com/builders-library/) — primary AWS engineering guidance for retries, timeouts, idempotency and distributed-service behavior; use individual articles for exact claims.
- [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) — supports HTTP method and status semantics where an HTTP boundary is involved.

Research boundary: “exactly once” and global ordering are not default properties; state the mechanism and scope that establish any claimed guarantee.
