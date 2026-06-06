# URAI Genesis Implementation Order

This document outlines the high-level plan for implementing Passes 1 through 48, respecting the specified tier structure.

## Implementation Tiers

The implementation will proceed in five distinct tiers. Each tier must be completed and its gates verified before the next tier begins. This ensures a stable foundation for subsequent work.

### TIER 1 — Foundation + Repo Normalization (Passes 1-9)
**Goal**: Establish a stable and consistent repository, normalize the visual and technical foundations, and implement the core Genesis scene and early UI architecture.

### TIER 2 — Core Genesis Product (Passes 10-22)
**Goal**: Build out the primary user-facing features of the Genesis experience, including Companion, Passport, and the main reflective systems (Life Map, Ground, Mirror, etc.), all gated by permissions.

### TIER 3 — Backend, Auth, AI, Privacy + Safety (Passes 23-29)
**Goal**: Integrate backend services, primarily Firebase for auth and data persistence. Wire up the AI Companion to a functional backend path and implement critical privacy and safety controls.

### TIER 4 — Demo, Launch, Admin, Tests + Deployment (Passes 30-43)
**Goal**: Prepare the application for a public-facing demo and eventual launch. This includes creating admin controls, test harnesses, deployment pipelines, and all necessary launch-related documentation and copy.

### TIER 5 — Post-V1 Expansion Foundations (Passes 44-48)
**Goal**: Implement the foundational architecture for next-generation features without fully enabling them. This includes the passive data pipeline, the intelligence engine, spatial/AR capabilities, and mobile/PWA readiness, all in a disabled or draft-only state.

## Process Within Tiers

For each pass within a tier, the autonomous agent will:

1.  **Analyze**: Read the pass requirements and inspect the current repository for existing equivalents.
2.  **Plan**: Create a minimal implementation plan that adapts the pass to the real codebase.
3.  **Implement**: Write the necessary code, components, and documentation.
4.  **Verify**: Run automated checks (lint, typecheck, tests) and perform static analysis.
5.  **Inspect**: Visually check user-facing changes where the environment allows.
6.  **Report**: Produce a summary report for the pass.

After all passes in a tier are complete, a full tier report will be generated, and all privacy and stability gates will be verified before proceeding.
