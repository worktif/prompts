Define the architecture gate for the upcoming epic.

Goal:
Prepare a product-grade architectural specification that prevents ad-hoc implementation and gives a precise object-oriented structure for the future code.

Primary design rule:
The solution must be modeled through object-oriented programming, with clear ownership, responsibilities, interfaces, lifecycle boundaries, and dependency boundaries.

Generic design rule:
Generics are mandatory where the architecture requires type-safe contracts, reusable abstractions, polymorphic relationships, or extensible implementation variants.

Function rule:
Standalone functions are allowed only as simple stateless utilities or inside an explicitly functional-programming module. Functions must not replace object ownership or architectural responsibility.

Pattern rule:
Use design patterns only when they directly resolve a concrete design force. Factory and Singleton are exceptions, not defaults. They require explicit proof of necessity.

Architecture gate output:

* target architectural model;
* object model;
* generic contracts;
* responsibility map;
* lifecycle and dependency boundaries;
* selected patterns and reasons;
* rejected patterns and reasons;
* implementation constraints;
* acceptance criteria.

Reject the result if it allows vibe-coding, loose functions as architecture, unjustified Factory usage, Singleton/global-state access, or pattern-name listing without concrete architectural responsibility.
