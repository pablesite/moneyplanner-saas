# Milestone 13 Roadmap: Guia de fases y detalle de diagnostico

## Objective
Convert `Guia` into the generic phase hub and add per-phase detail views, starting with Fase 4 (`Salud patrimonial`) by moving the current patrimonio diagnostic panel into the new phase-detail surface.

## Scope
1. `Guia` acts as a generic roadmap view with clickable phase cards.
2. New route and view for phase detail (`/guia/fases/:phaseId`).
3. Fase 4 detail includes the full balance-health diagnostic currently drafted in `Patrimonio`.
4. `Patrimonio` keeps operational KPIs and charts, but no longer owns the phase diagnostic block.

## First Increment (Current Delivery)
1. Update `Inicio` (`Guia`) to expose cards that open each phase detail.
2. Create a reusable detail shell for all phases.
3. Move the risk/score diagnostic card from `Patrimonio` to Fase 4 detail.
4. Keep non-Fase-4 details as structured placeholders to expand in future milestones.

## Out Of Scope
1. New scoring models for phases 1, 2, 3, and 5.
2. Backend changes for new guide-specific endpoints.
3. Automated recommendations engine.

## Functional Requirements
1. Every phase card in `Guia` must navigate to its detail view.
2. Phase detail must show phase context (title, focus, objective, progress).
3. Fase 4 detail must display:
   - Balance health score (`0-100`)
   - Risk tone label
   - Meter bar
   - Four dimensions: apalancamiento, deuda sin respaldo, concentracion, liquidez
4. The diagnostic must consume current patrimonio data (assets, liabilities, category composition).
5. `Patrimonio` must remain fully usable after removing the diagnostic block.

## UX Notes
1. `Guia` becomes the strategic view (what stage and why).
2. Each phase detail is tactical (where you stand in that phase and what to improve).
3. Keep mobile-first behavior for phase cards and diagnostic panels.

## Acceptance Criteria
1. Sidebar `Guia` opens the generic roadmap with clickable phases.
2. Clicking any phase opens `/guia/fases/:phaseId`.
3. Fase 4 detail renders the moved diagnostic panel and uses live net-worth data.
4. `Patrimonio` no longer renders the diagnostic score panel.
5. Frontend quality gates pass in Docker for SaaS stack.

## Validation Plan
1. `docker compose exec -T saas_frontend npm run lint`
2. `docker compose exec -T saas_frontend npm run format:check`
3. `docker compose exec -T saas_frontend npm run typecheck`

## Risks and Mitigations
1. Risk: duplicated metric logic between `Patrimonio` and phase detail.
   - Mitigation: centralize score logic in shared domain utility in a follow-up refinement.
2. Risk: phase details without complete diagnostics may look unfinished.
   - Mitigation: explicit placeholder copy and phased rollout communication.

## Deliverables
1. Updated `HomeView` as generic guide roadmap.
2. New `GuidePhaseDetailView` route and UI.
3. Diagnostic panel moved from `NetWorthView` to Fase 4 detail.
4. Milestone 13 roadmap document.
