# SaaS Documentation

Canonical documentation for the MoneyPlanner SaaS stack.

## Scope
This documentation covers only SaaS-specific concerns:

1. SaaS architecture
2. Core-to-SaaS integration boundaries
3. SaaS capabilities and packaging
4. SaaS local and cloud operations
5. SaaS pilot and rollout planning

Core product functionality is documented in `core/README.md` and `core/docs/README.md`.

## Read First
1. `architecture/architecture.md` -> current SaaS architecture
2. `architecture/core-saas-boundaries.md` -> integration contract between Core and SaaS
3. `architecture/capabilities-matrix.md` -> SaaS capabilities and packaging rules
4. `architecture/data-model.md` -> SaaS data model, entities and user lifecycle
5. `architecture/saas-core-integration-flow.md` -> technical integration flow SaaS↔Core (JWT, bootstrap, linking)
6. `architecture/api-registry.md` -> all SaaS API endpoints and Core APIs consumed
7. `architecture/glossary.md` -> canonical definitions for project terminology
8. `operations/dev-setup.md` -> local setup, diagnostics, and validation
9. `roadmap/roadmap.md` -> current SaaS roadmap
10. `project-status.md` -> current implementation status by feature area

## Active Documents
1. `architecture/`
   - SaaS architecture
   - Core/SaaS integration boundaries
   - capabilities and packaging
   - **data model and entity lifecycle** (`data-model.md`)
   - **SaaS↔Core integration flow** (`saas-core-integration-flow.md`)
   - **API registry** (`api-registry.md`)
   - **glossary** (`glossary.md`)
2. `operations/`
   - local development and SaaS operations
3. `roadmap/`
   - SaaS roadmap
   - pilot integration checklist
4. `frontend/`
   - SaaS frontend visual and UX guidance
   - frontend visual contract
   - **domain map** (`domain-map.md`)
5. `project-status.md` — implementation status by feature area

## Usage Rule
1. This directory is the canonical source for SaaS-specific documentation.
2. Core product behavior must be documented in `core/docs/`.
3. If a SaaS document needs to mention Core functionality, it should link to the corresponding Core document instead of duplicating it.
