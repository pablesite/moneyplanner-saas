# Financial Plan — Fase 2: Mi Plan UI + onboarding (SaaS frontend)

## Title
Crear el dominio frontend `plan/`, el onboarding del plan y la pantalla Mi Plan sobre la API de la Fase 1.

## Context
Segunda fase del módulo `financial-plan` (ver `core/docs/tasks/financial-plan/README.md` y `spec.md`). La Fase 1 debe estar terminada: la API `/api/plan/*` de Core es el contrato. Esta fase entrega la experiencia visible: setup (Journey J-001) y pantalla `/plan` con resumen, progreso, trayectoria y calidad de datos. Usar obligatoriamente la skill `frontend-system` antes de empezar; seguir Direction A y las primitivas compartidas de `@/domains/ui`.

## Area
`frontend`

## Stack
`saas`

## Scope

### In scope
1. Dominio `frontend/src/domains/plan/`: `index.ts`, `api.ts` (vía `coreApi`), `store.ts` (Pinia `usePlanStore`), `composables.ts`, `components/`.
2. Capability: añadir `core.plan` en `frontend/src/domains/capabilities/index.ts` + helper `canUsePlan()`. Gatear rutas y navegación con él (NFR-006).
3. Rutas en `frontend/src/router.ts`: `/plan` y `/plan/setup` (guard de auth existente + capability).
4. Onboarding J-001 en `/plan/setup` (crear/editar, idempotente):
   - Tipo de unidad (`single|family`), adultos (máx. 2, sobre `FamilyMember` extendido: edad/nacimiento, fin de ingresos laborales, inicio y cuantía de pensión).
   - Fecha/año objetivo, nivel de vida mensual en euros actuales, otros ingresos futuros, patrimonio mínimo a preservar (opcional).
   - Si ya hay plan, el flujo edita (FR-PLAN-001/004).
5. Pantalla `/plan` (FR-UI-PLAN-001..004 parcial):
   - `PlanHero`: fecha objetivo vs proyectada, nivel de vida objetivo, renta sostenible aproximada (copy prudente: "estimado", "según las hipótesis" — NFR-007).
   - `ProductiveCapitalProgress`: barra con capital productivo actual vs requerido (NUNCA patrimonio neto total — AC-E03-002) e hitos estándar (FR-UI-PLAN-003) derivados de categorías agregadas de presupuesto.
   - `ProjectedDateCard`: diferencia entre fecha deseada y proyectada.
   - `NetWorthTrajectoryChart`: histórico desde `GET /api/net-worth/timeline/` (existente) + tramo proyectado desde `GET /api/plan/projection/`; distinguir visualmente ambos tramos; selector de escenario (esperado destacado).
   - `PlanFoundations`: placeholder compacto (datos reales en Fase 4).
   - `DataQualityCard` (FR-DATA-003): nivel + qué dato falta y qué mejora al completarlo.
   - `ProjectionAssumptionsDrawer`: hipótesis del escenario activo, solo lectura.
6. Estados vacíos/incompletos: usuario sin plan → CTA a `/plan/setup`; usuario sin datos patrimoniales → guiar a `/patrimonio` (AC-E03-001 con datos, render digno sin ellos).
7. Registrar el dominio en `docs/frontend/domain-map.md`.

### Out of scope
- Escenarios (Fase 3), cimientos reales y recomendaciones (Fase 4), retirada de `/estado-financiero` (Fase 5).
- Cambios en `core/frontend/`.
- Edición de hipótesis.

## Plan
1. **Diagnosis** — Leer skill `frontend-system`, `docs/frontend/frontend-visual-guide.md`, `docs/frontend/domain-map.md`; revisar patrones de dominio existentes (`net-worth`, `budget`) y el contrato real de la API de Fase 1.
2. **Change implementation** — Dominio + capability + rutas + setup + pantalla, componente a componente reutilizando primitivas `@/domains/ui` (heroes, KPI bands, estados).
3. **Validation** — Lint/typecheck + validación visual manual (happy path) en dev.

## Validation
```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```
Manual (dev, usuario con datos reales): crear plan en `/plan/setup` → `/plan` muestra proyección, progreso con capital productivo, trayectoria histórico+proyección y calidad de datos; editar objetivo → recálculo visible; responsive móvil (NFR-008) y accesibilidad básica (NFR-009).

## Required Documentation Updates
- [ ] `docs/frontend/domain-map.md` — dominio `plan`, rutas y clientes API
- [ ] `docs/architecture/capabilities-matrix.md` — `core.plan` ya listado; confirmar estado de exposición
- [ ] `docs/project-status.md` — estado de la fase

## Risks
- Contrato de proyección aún fresco: cualquier ambigüedad se resuelve contra la Fase 1, no adaptando el frontend con lógica financiera propia (prohibido duplicar cálculo en Vue).
- Gráfica con dos tramos (histórico/proyección): validar con el selector de escenarios para evitar mezclas de unidades (euros actuales vs nominales) — el backend indica la unidad de cada serie.

## Completion Criteria
- [ ] AC-E03-001..005 cumplidos (ver `core/docs/tasks/financial-plan/spec.md` §12)
- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits, `feat(frontend): ...`)
