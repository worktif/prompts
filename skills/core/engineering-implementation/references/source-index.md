# Engineering Implementation Source Index

These sources were consulted for specific rules in `SKILL.md`. They are not a generic reading list. Repository contracts and the language/runtime actually used by the project take precedence.

## TypeScript and static/runtime boundaries

- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing) — supports using discriminated unions for closed variants and `never`-based exhaustiveness checks. It also supports treating the type encoding as the thing that enables narrowing; the skill therefore does not claim that a type annotation validates external runtime data.
- [TypeScript TSConfig: `strict`](https://www.typescriptlang.org/tsconfig/strict) — supports treating strict compiler checks as stronger static checking while recognizing that future compiler versions can add checks. The skill uses this as conditional guidance and does not require changing a repository's compiler settings.
- [TypeScript Handbook: Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) — supports containing `any` and preferring `unknown` when a value is not yet known. The skill narrows this to boundary code and does not ban justified migration or compatibility exceptions.

## Domain modeling

- [Martin Fowler: Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) — supports using a rich model for domain processes and rules, and treating DDD concepts as conceptual rather than tied to one programming style. The skill uses this to avoid making entities, value objects, or aggregates mandatory ceremony.
- [Martin Fowler: Bounded Context](https://martinfowler.com/bliki/BoundedContext.html) — supports keeping a model internally unified within a bounded context and making relationships between contexts explicit instead of forcing one unified model across a large system. The skill uses this only where the repository has meaningful domain/context boundaries.

## Boundary semantics and error contracts

- [RFC 9110: HTTP Semantics, Section 9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods) — supports the HTTP-specific distinction between idempotent intended effects and retry behavior when a response is not received. The skill does not generalize HTTP method rules to non-HTTP operations or assume that a retry is safe merely because a method is named `POST`, `PUT`, or similar.
- [RFC 9457: Problem Details for HTTP APIs, Section 4](https://www.rfc-editor.org/rfc/rfc9457.html#name-defining-new-problem-types) — supports treating problem details as an HTTP interface format rather than an implementation-debugging dump, preserving existing domain-specific error formats where appropriate, and documenting a new problem type's type URI, title, and status code. It does not require Problem Details for every API.

## Cancellation and resource lifecycle

- [WHATWG DOM Standard: `AbortSignal`](https://dom.spec.whatwg.org/#interface-AbortSignal) — supports the semantics of an abort reason, already-aborted signals, `throwIfAborted()`, dependent signals, and abort algorithms. The skill derives the cleanup rule from the explicit add/remove lifecycle and requires checking the actual dependency API before claiming that cancellation interrupts underlying work.

## Security-sensitive implementation work

- [NIST SP 800-218, Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final) — supports treating secure development practices as recommendations that can be integrated into an SDLC and using a common vocabulary for security work. It is intentionally an optional reference here: it does not make this general implementation skill a security certification or replace the library's security skill and repository-specific controls.
