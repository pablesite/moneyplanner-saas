# Milestone 13 Roadmap: Guia de fases y detalle de diagnostico

## Objective
Convert `Guia` into the generic phase hub and add per-phase detail views, starting with Fase 4 (`Salud patrimonial`) by moving the current patrimonio diagnostic panel into the new phase-detail surface.

## Scope
1. `Guia` acts as a generic roadmap view with clickable phase cards.
2. New route and view for phase detail (`/guia/fases/:phaseId`).
3. Fase 4 detail includes a dedicated structural net-worth diagnostic model (phase-specific).
4. `Patrimonio` keeps operational KPIs and charts, but no longer owns the phase diagnostic block.

## First Increment (Current Delivery)
1. Update `Inicio` (`Guia`) to expose cards that open each phase detail.
2. Create a reusable detail shell for all phases.
3. Replace the initial moved diagnostic with a phase-4-specific scoring model (3 scores + global score).
4. Keep non-Fase-4 details as structured placeholders to expand in future milestones.

## Out Of Scope
1. New scoring models for phases 1, 2, 3, and 5.
2. Backend changes for new guide-specific endpoints.
3. Automated recommendations engine.

## Functional Requirements
1. Every phase card in `Guia` must navigate to its detail view.
2. Phase detail must show phase context (title, focus, objective, progress).
3. Fase 4 detail must display:
   - Score Solidez estructural (`0-100`)
   - Score Calidad de la estructura (`0-100`)
   - Score Distribucion del riesgo (`0-100`)
   - Score global Fase 4 (`0-100`) as weighted aggregate
4. Each score must be built from two related KPIs (continuous formulas, no hard steps).
5. Score changes must be continuous point-by-point (1 percentage point change in KPI must impact score).
6. The diagnostic must consume current patrimonio data (assets, liabilities, category composition).
7. `Patrimonio` must remain fully usable after removing the diagnostic block.

## Scoring Model (Fase 4)
All score components are computed with linear/clamped mappings so values move continuously.

1. Score Solidez estructural:
   - KPI A: `equity_ratio = net_worth / total_assets` (higher is better)
   - KPI B: `debt_to_assets = total_liabilities / total_assets` (lower is better)
   - Internal weighting: 60% equity, 40% debt-to-assets
2. Score Calidad de la estructura:
   - KPI A: `% activos productivos` (proxy from available categories; higher is better)
   - KPI B: `% activos iliquidos` (lower is better)
   - Internal weighting: 50% / 50%
3. Score Distribucion del riesgo:
   - KPI A: `% concentracion top activo` (lower is better)
   - KPI B: `indice de diversificacion` (from HHI normalized; higher is better)
   - Internal weighting: 50% / 50%
4. Score global Fase 4:
   - `0.40 * Solidez + 0.30 * Calidad + 0.30 * Distribucion`

## UX Notes
1. `Guia` becomes the strategic view (what stage and why).
2. Each phase detail is tactical (where you stand in that phase and what to improve).
3. Keep mobile-first behavior for phase cards and diagnostic panels.
4. KPI bars in phase detail use solid fill color mapped by KPI score (`0`=red, `100`=green), while width keeps representing progress.

## Acceptance Criteria
1. Sidebar `Guia` opens the generic roadmap with clickable phases.
2. Clicking any phase opens `/guia/fases/:phaseId`.
3. Fase 4 detail renders 3 phase-specific scores plus global score using live net-worth data.
4. Each score shows its two related KPIs and updates continuously with underlying values.
5. `Patrimonio` no longer renders the diagnostic score panel.
6. Frontend quality gates pass in Docker for SaaS stack.

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
3. Fase 4 diagnostic panel redesigned around 3 domain scores + global score.
4. Milestone 13 roadmap document.
