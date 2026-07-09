# Financial Plan — Fase 4: Cimientos, cierre mensual y recomendaciones (SaaS frontend)

## Title
Conectar cimientos reales, recomendaciones y el impacto del cierre mensual a la UI.

## Context
Fase 4 del módulo `financial-plan` (ver `core/docs/tasks/financial-plan/README.md` y `spec.md` §6.5, §6.8-6.10). Requiere el backend de Fase 4. Usar skill `frontend-system` antes de empezar.

## Area
`frontend`

## Stack
`saas`

## Scope

### In scope
1. `PlanFoundations` real en `/plan` (FR-UI-PLAN-004) desde `GET /api/plan/foundations/`: flujo de caja, fondo de emergencia, deuda, aportación mensual, calidad de datos. Sustituye al placeholder de Fase 2.
2. `PlanRecommendationCard` (FR-UI-PLAN-006): máximo una recomendación principal y una secundaria, con explicabilidad expandible (motivo, datos, impacto, alternativas, regla). Acciones: aceptar, descartar, **simular** (abre `/plan/escenarios/:id` con el borrador creado por el backend), posponer.
3. Sección de impacto en plan dentro de `/cierre-mensual` (FR-CLOSE-003..005): al finalizar un cierre, mostrar variación de capital productivo, estado de trayectoria, cambio de fecha proyectada solo si es material, máx. 2 hallazgos y 1 acción propuesta. Consumir `GET /api/budget/monthly-closes/{id}/plan-impact/`; si el usuario no tiene plan, la sección no aparece (integración no invasiva con el flujo de cierre validado).
4. Estado en `usePlanStore`: foundations, findings, recommendations, plan-impact.

### Out of scope
- Retirada de `/estado-financiero` (Fase 5).
- Cálculo de métricas en Vue (todo viene del backend).

## Plan
1. **Diagnosis** — Contratos reales de foundations/findings/recommendations/plan-impact; revisar composición actual de `/cierre-mensual` (`useBudgetDashboardPage.ts` y vista de cierre) para insertar la sección sin perturbar el flujo.
2. **Change implementation** — Foundations → recomendaciones → sección de cierre.
3. **Validation** — Lint/typecheck + manual.

## Validation
```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```
Manual: finalizar un cierre mensual en dev → sección de impacto visible con ≤2 hallazgos y 1 acción; "simular" desde una recomendación abre el escenario preconfigurado; `/plan` muestra cimientos reales; usuario sin plan → cierre mensual intacto sin sección.

## Required Documentation Updates
- [ ] `docs/frontend/domain-map.md` — integración plan ↔ cierre mensual
- [ ] `docs/project-status.md` — estado de la fase

## Risks
- `/cierre-mensual` es un flujo validado manualmente: la sección nueva debe ser aditiva y no alterar pasos existentes; smoke manual del cierre completo tras el cambio.

## Completion Criteria
- [ ] AC-E05-001..004 verificados end-to-end desde la UI
- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits, `feat(frontend): ...`)
