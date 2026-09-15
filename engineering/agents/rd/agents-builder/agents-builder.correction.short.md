Refactor the agent implementation to comply with the existing product architecture.

The authoritative mechanism for agent construction and execution is:

{{AGENT_BUILDER_FILE_PATH}}

Placeholder definition:
{{AGENT_BUILDER_FILE_PATH}} = path to the existing product-level Agent Builder implementation that must be used as the single source of truth for agent construction and execution.

Inspect this builder first. Then find and eliminate every direct or ad-hoc agent implementation that bypasses it.

Use the builder as the single source of truth for agent creation, configuration, delegation, lifecycle handling, and execution flow.

Do not create a parallel mechanism. Do not vibe-code around the existing system. Do not replace the product architecture with local custom logic.

If functionality is missing, extend the builder according to the existing specification instead of bypassing it.

The result is valid only if all agent-related implementation is normalized back into the already built system and no duplicated orchestration or construction path remains.
