# Milestone 09 Roadmap: Fase 1 Deuda (Guide Detail Diagnostic)

## Objective
Define and deliver the first debt diagnostic score in `Guia` for Fase 1 (`Deuda`) using current net-worth liabilities data, with the same UX shell introduced for Fase 4.

## Scope
1. Add a dedicated Fase 1 diagnostic panel in `GuidePhaseDetailView`.
2. Reuse the existing phase-detail score UI (summary cards, global badge, global meter, score cards, KPI bars).
3. Compute debt indicators from current frontend net-worth store data (`summary`, `liabilities`).
4. Keep non-Fase-1 and non-Fase-4 phases as placeholders.

## Out Of Scope
1. Backend-specific guide endpoints.
2. Debt payoff recommendations / amortization strategy engine.
3. Automatic liability monthly payment calculation (`cuota mensual`) from amortization metadata.
4. Home (`Inicio`) phase-card donut sync for Fase 1 (follow-up if desired).
5. Core frontend parity (SaaS-first delivery).

## Functional Requirements
1. Fase 1 detail (`/guia/fases/1`) must render a live diagnostic panel instead of placeholder content.
2. Diagnostic must consume current liabilities data and debt metadata (`annual_interest_tae`, asset backing summary).
3. Global phase score (`0-100`) must be continuous and update with live data.
4. Visual grading (A/B/C/D/E) must match score color mapping.
5. Diagnostic should remain resilient when TAE data is missing (show values as `-` and penalize score via TAE coverage KPI).

## Scoring Model (Fase 1)
All mappings use clamped linear formulas to avoid hard-step jumps.

### Score 1: Coste y visibilidad de deuda (`0-100`)
1. `TAE maxima de pasivos` (inverse score)
2. `TAE media ponderada` por importe de pasivo (inverse score)
3. `% cuota/ingresos` (debt service ratio, inverse score) using manual monthly payment per liability
   in current delivery

Internal weighting:
1. `0.40 * TAE maxima`
2. `0.40 * TAE media ponderada`
3. `0.20 * % cuota/ingresos`

Current score thresholds:
1. `TAE maxima`: `<= 0.5%` => 100, `>= 10%` => 0 (linear inverse)
2. `TAE media ponderada`: `<= 0.5%` => 100, `>= 10%` => 0 (linear inverse)
3. `% cuota/ingresos`: `<= 10%` => 100, `>= 50%` => 0 (linear inverse)

### Score 2: Riesgo estructural de deuda (`0-100`)
1. `% deuda sin respaldo / pasivos` (inverse score)
2. `Concentracion top pasivo` (inverse score)
3. `% deuda con TAE >= 8%` (inverse score)

Internal weighting:
1. `0.40 * deuda sin respaldo`
2. `0.30 * concentracion top pasivo`
3. `0.30 * deuda cara`

Current score thresholds:
1. `% deuda sin respaldo / pasivos`: `<= 1%` => 100, `>= 50%` => 0 (linear inverse)
2. `Concentracion top pasivo`: `<= 25%` => 100, `>= 95%` => 0 (linear inverse)
3. `% deuda con TAE >= 8%`: `<= 5%` => 100, `>= 60%` => 0 (linear inverse)

### Score global Fase 1 (`0-100`)
1. `0.50 * Coste y visibilidad`
2. `0.50 * Riesgo estructural`

## UX Notes
1. Reuse the Fase 4 phase-detail visual language to keep cross-phase consistency.
2. Keep summary cards debt-centric (pasivos, deuda sin respaldo, deuda cara, TAE maxima).
3. `Dispersion de TAE` is shown as informative KPI (summary card) and does not affect score.
4. Scores are displayed as percentages (`66%`) instead of `/100` labels in phase detail UI.
5. Keep color semantics aligned with grade letters and bar colors.
6. Show a debt-state badge (`Deuda saneada/controlada/en vigilancia/critica`) using score-based coloring.

## Acceptance Criteria
1. Fase 1 opens a diagnostic panel with global score and score cards.
2. KPIs update from current data without backend changes.
3. Missing TAE values do not break rendering.
4. Fase 4 remains unchanged functionally.
5. SaaS frontend lint/format/typecheck pass in Docker.

## Validation Plan
1. `docker compose exec -T saas_frontend npm run lint`
2. `docker compose exec -T saas_frontend npm run format:check`
3. `docker compose exec -T saas_frontend npm run typecheck`

## Risks and Mitigations
1. Risk: score logic grows inside `GuidePhaseDetailView`.
   - Mitigation: extract per-phase scoring utils in a follow-up (`frontend/src/domains/guide/scoring/`).
2. Risk: incomplete TAE data distorts debt-cost score.
   - Mitigation: required TAE for key debt categories and explicit debt-cost KPIs (`TAE maxima`, `TAE media ponderada`).
3. Risk: category-level liability charts hide item-level debt concentration.
   - Mitigation: Fase 1 concentration uses individual liabilities (`store.liabilities`) instead of chart aggregation.
4. Risk: manual `cuota mensual` can be stale/inaccurate.
   - Mitigation: roadmap follow-up to model amortization metadata and compute quota automatically.

## Deliverables
1. Fase 1 debt diagnostic in `GuidePhaseDetailView`.
2. Milestone 09 roadmap document.
3. Release summary for milestone 09 delivery.
