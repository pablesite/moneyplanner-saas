# Core / SaaS Boundaries

## Objective

Define the integration boundaries between `The Arkenstone Core` and the SaaS stack.

## Boundary Rule

1. Core owns product behavior and shared domain logic.
2. SaaS owns platform behavior, managed access, and cloud-specific operation.
3. SaaS must reference Core docs instead of duplicating Core product documentation.

## What Lives In Core

1. Product modules and domain behavior
2. Core backend domain APIs
3. Core frontend product UX
4. Functional documentation for the open-source product
5. Product roadmaps and scoring models

Core canonical documentation lives in:

1. `../../core/README.md`
2. `../../core/docs/README.md`

## What Lives In SaaS

1. Authentication and account access
2. RBAC
3. Subscription and trial state
4. SaaS administration
5. SaaS-to-Core linking
6. Cloud deployment and managed operations
7. SaaS packaging and platform capabilities

## Integration Rules

1. Core domain modules must not be duplicated in the SaaS backend.
2. SaaS documentation must not restate Core product behavior unless strictly necessary for integration.
3. If packaging or capability exposure changes, update `capabilities-matrix.md`.
4. If Core-facing integration flows change, update this document and the relevant operational docs.
5. SaaS frontend is not maintained as a mirror of `core/frontend/`. It may reuse Core APIs and concepts, but its navigation, UX, and component decisions are owned by the SaaS product.

## Current Integration Points

1. SaaS backend calls Core APIs for Core-owned functionality and bootstrap flows.
2. SaaS frontend can expose Core-backed user flows through managed SaaS access.
3. Family and ownership bootstrap is executed in Core through the relevant Core endpoint.

## Related Documents

1. `architecture.md`
2. `capabilities-matrix.md`
3. `../operations/dev-setup.md`
4. `../roadmap/roadmap.md`
