# Project Documentation

## Objective
Keep documentation centralized, consistent, and easy to navigate.

## Structure
1. `docs/architecture/`: platform boundaries, technical architecture, and API contracts.
2. `docs/operations/`: setup, runbook, recovery, and release checklists.
3. `docs/roadmap/`: global roadmap, milestone plans, and release summaries.
4. `docs/frontend/`: visual/UI system and frontend CSS workflow.
5. `docs/standards/`: coding standards, glossary, and task templates.

## Canonical Documents
1. Platform boundaries: `docs/architecture/architecture.md`
2. Functional architecture: `docs/architecture/product-architecture.md`
3. API contracts: `docs/architecture/api-contracts.md`
4. Operations and troubleshooting: `docs/operations/runbook.md`
5. Development setup and quality matrix: `docs/operations/dev-setup.md`
6. Product roadmap: `docs/roadmap/roadmap.md`
7. Current release roadmap: `docs/roadmap/roadmap-hito-04-refactor.md`
8. Release summary (current): `docs/roadmap/release-summary-v2.md`
9. Code-quality conventions: `docs/standards/code-quality-conventions.md`

## Maintenance Rules
1. If a rule impacts daily operation, update `docs/operations/runbook.md`.
2. If a rule impacts setup or quality checks, update `docs/operations/dev-setup.md`.
3. If a rule impacts platform boundaries/contracts, update `docs/architecture/`.
4. If a decision impacts planning or sequencing, update `docs/roadmap/`.
