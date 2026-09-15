Create the implementation specification for the epic before implementation begins.

The implementation shall use object-oriented programming as the primary architectural model.

The implementation shall use generics where type-safe contracts, extensible abstractions, reusable component relationships, or compile-time correctness are required.

The implementation shall use standalone functions only when the function is a simple stateless utility or when the relevant module is explicitly designed according to functional programming principles.

When selecting design patterns, the specification shall map every selected pattern to a concrete architectural responsibility.

The specification shall treat Factory and Singleton as exceptional patterns. They shall be used only when a specific construction, lifecycle, or instance-control requirement proves their necessity.

The specification shall prevent ad-hoc implementation by defining:

* object responsibilities;
* interfaces;
* generic contracts;
* lifecycle boundaries;
* dependency boundaries;
* accepted patterns;
* rejected patterns;
* implementation constraints;
* acceptance criteria.

The result is valid only if the future implementation can be built from the specification without introducing loose procedural code, unjustified factories, singleton-based global access, or vibe-coded architecture.
