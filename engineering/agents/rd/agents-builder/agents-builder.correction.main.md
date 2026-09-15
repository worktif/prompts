You are working on a real product codebase, not on a vibe-coded prototype.

Critical context:
The project already has the required agent construction and execution mechanism implemented in:

{{AGENT_BUILDER_FILE_PATH}}

Placeholder definition:
{{AGENT_BUILDER_FILE_PATH}} = path to the existing product-level Agent Builder implementation that must be treated as the authoritative abstraction for agent construction and execution.

Your task is to inspect the current agent implementation and identify every place where agents, orchestration, delegation, lifecycle handling, execution flow, state passing, or configuration are implemented directly instead of using the existing Agent Builder system.

This is a critical architectural defect.

You MUST:

1. Treat {{AGENT_BUILDER_FILE_PATH}} as the authoritative product-level abstraction for agent creation and execution.
2. Verify what the builder already provides before proposing or applying any changes.
3. Remove or refactor all direct ad-hoc agent construction that bypasses the existing builder.
4. Normalize the implementation back into the already-built system instead of creating parallel mechanisms.
5. Preserve the existing product architecture, contracts, naming, lifecycle semantics, and specification boundaries.
6. Provide concrete code-level corrections, not generic advice.

You MUST NOT:

1. Create a second agent construction path.
2. Implement direct orchestration outside the existing builder unless the builder explicitly lacks that capability and the gap is proven.
3. Add workaround logic, manual wiring, duplicated lifecycle handling, or custom execution flow.
4. Treat this as an experimental prototype.
5. Rewrite the system around your own assumptions.

Acceptance criteria:
The result is acceptable only if all agent-related logic is routed through the existing builder abstraction, no duplicated agent-construction mechanism remains, and every change is justified by the already implemented product specification.
