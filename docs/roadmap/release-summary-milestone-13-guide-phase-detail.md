# Release Summary Milestone 13 (Guide Phase Detail)

## Date
2026-02-21

## Milestone Scope
- Convert `Guia` into the strategic phase hub with clickable phase cards.
- Add a dedicated detail route per phase (`/guia/fases/:phaseId`).
- Move the net-worth diagnostic from `Patrimonio` into Fase 4 detail.
- Implement a phase-specific Fase 4 health score model focused on:
  - `Respaldo patrimonial`
  - `Distribucion del riesgo`

## Closed Deliverables
1. Guide navigation and phase detail shell:
- `Inicio` now acts as phase roadmap with direct links to each phase detail.
- New detail view scaffolding for all phases.
- Non-Fase-4 phases render structured placeholders for future diagnostics.

2. Fase 4 health diagnostic redesign:
- Removed previous structural/productivity-centered composition from this phase.
- Introduced a 2-score model:
  - `Respaldo patrimonial (0-100)`:
    - `% deuda sin respaldo / activos` (inverse)
    - `% activos iliquidos` (inverse)
  - `Distribucion del riesgo (0-100)`:
    - `% concentracion top activo` (inverse)
    - `indice de diversificacion` (HHI normalized)
- Global score:
  - `0.50 * Respaldo + 0.50 * Distribucion`

3. Productive/liquidity rule alignment for this milestone:
- `annual_interest_tae` for assets is now required in cash subcategories:
  - `bank_account`
  - `crypto_spot_earn`
  - `cash:other`
- Illiquid assets now include:
  - Category-based: `real_estate`, `furnishings`, `other`
  - Illiquid investment subcategories: `pension_plans`, `real_estate_crowd`, `crowdlending`, `investments:other`
  - `cash:other` when `annual_interest_tae > 0`

4. UX refinements:
- KPI and score bars use solid red-to-green color mapping by score.
- A/B/C/D/E grading is rendered across Fase 4 global meter, score cards, and KPI bars.
- Home (`Inicio`) Fase 4 donut now uses the same computed Fase 4 health score and tone color.

5. Documentation updates:
- `docs/roadmap/roadmap-milestone-13-guide-phase-detail.md`
- `docs/roadmap/roadmap.md`
- `docs/README.md`

## Validation Evidence
- SaaS backend:
  - `docker compose exec -T saas_backend ruff check .`
  - `docker compose exec -T saas_backend ruff format --check .`
  - `docker compose exec -T saas_backend mypy .`
  - `docker compose exec -T saas_backend python manage.py test memberships`

- Core backend:
  - `cd core; docker compose exec -T backend ruff check .`
  - `cd core; docker compose exec -T backend ruff format --check .`
  - `cd core; docker compose exec -T backend mypy .`
  - `cd core; docker compose exec -T backend python manage.py test`

- SaaS frontend:
  - `docker compose exec -T saas_frontend npm run lint`
  - `docker compose exec -T saas_frontend npm run format:check`
  - `docker compose exec -T saas_frontend npm run typecheck`
  - `docker compose exec -T saas_frontend npm run test:unit`

- Core frontend:
  - `cd core; docker compose exec -T frontend npm run lint`
  - `cd core; docker compose exec -T frontend npm run format:check`
  - `cd core; docker compose exec -T frontend npm run typecheck`

## Residual Risks / Follow-Ups
- Score logic remains duplicated between `GuidePhaseDetailView` and `HomeView` for Fase 4 and should be extracted into a shared domain utility.
- Home cards for non-Fase-4 phases still use static roadmap progress until their dedicated score models are implemented.

## Final Status
- Milestone 13: completed.
- Deliverables accepted and documented.
