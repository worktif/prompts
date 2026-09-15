Stop and re-evaluate the current implementation against the existing product architecture.

The current direction appears to bypass the already implemented Agent Builder:

{{AGENT_BUILDER_FILE_PATH}}

Placeholder definition:
{{AGENT_BUILDER_FILE_PATH}} = path to the existing Agent Builder file that defines the approved product-level mechanism for agent creation, configuration, delegation, lifecycle handling, and execution flow.

This is not acceptable in a product system. The project already contains the abstraction that must be used to construct and coordinate agents according to our specification.

Your task:
Refactor the implementation so that agent creation, configuration, delegation, execution flow, and lifecycle handling are performed through the existing Agent Builder mechanism instead of direct custom logic.

Required method:

1. Read and understand {{AGENT_BUILDER_FILE_PATH}}.
2. Identify the exact responsibilities already covered by the builder.
3. Compare those responsibilities with the current direct agent implementation.
4. Mark every duplicated or bypassed responsibility as an architectural defect.
5. Refactor the code to use the builder as the single source of truth.
6. Remove redundant custom wiring unless it represents a real missing capability.
7. If a real builder gap exists, extend the builder itself instead of bypassing it.

Forbidden output:
Do not provide a cosmetic refactor.
Do not add another abstraction layer.
Do not manually wire agents outside the builder.
Do not preserve duplicated orchestration logic.
Do not explain generic design patterns instead of fixing the architecture.

Final output must include:

* files changed;
* defects found;
* how each defect bypassed {{AGENT_BUILDER_FILE_PATH}};
* exact refactoring performed;
* confirmation that the implementation now stays inside the existing product architecture.
