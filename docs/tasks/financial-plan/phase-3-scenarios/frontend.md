# Financial Plan — Fase 3: Laboratorio de escenarios (SaaS frontend)

## Title
UI de simulación de decisiones: crear, comparar e incorporar escenarios; marcadores en trayectoria y Patrimonio.

## Context
Fase 3 del módulo `financial-plan` (ver `core/docs/tasks/financial-plan/README.md` y `spec.md` §6.7, Journey J-003). Requiere el backend de Fase 3 terminado. Usar skill `frontend-system` antes de empezar.

## Area
`frontend`

## Stack
`saas`

## Scope

### In scope
1. Rutas: `/plan/escenarios` (lista + creación) y `/plan/escenarios/:id` (detalle + comparación), gateadas por `canUsePlan()`.
2. `ScenarioForm`: plantillas (vivienda, vehículo, estudios, reforma, excedencia, reducción de jornada, negocio, amortización de deuda, genérico) que solo preconfiguran campos del formulario común (FR-SCEN-002); campos de FR-SCEN-001.
3. `ScenarioComparison`: plan vigente vs simulado con los indicadores de FR-SCEN-003; selector de escenario de hipótesis; copy prudente (NFR-007).
4. Acciones incorporar (con confirmación explícita — PP-006) y descartar.
5. `PlanEventsTimeline` en `/plan` (FR-UI-PLAN-005): acontecimientos incorporados con fecha, tipo e impactos.
6. Marcadores en gráficas (FR-PATR-003/004):
   - Tramo proyectado de `NetWorthTrajectoryChart` en `/plan`: marcadores de eventos, fecha objetivo e inicio de pensiones.
   - Gráfica de evolución de `/patrimonio` (`net-worth`): marcadores de decisiones pasadas/futuras con tooltip (nombre, fecha, impacto previsto/real, activo/deuda creada, impacto en fecha objetivo). Integración ligera: leer de `GET /api/plan/events/`; no acoplar el dominio `net-worth` al store del plan (composable compartido en `plan/`).
7. Estado en `usePlanStore`: escenarios, comparaciones, eventos.

### Out of scope
- Recomendaciones → simular (botón llega en Fase 4).
- Registro automático del impacto real (edición manual mínima vía API si se necesita).

## Plan
1. **Diagnosis** — Contrato real de la API de escenarios; patrones de formularios/moldes (`ASelect`, sheets) en dominios existentes.
2. **Change implementation** — Rutas → formulario → comparación → timeline → marcadores.
3. **Validation** — Lint/typecheck + manual.

## Validation
```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```
Manual: crear escenario "compra de coche" → comparar (cambio de fecha y patrimonio visibles) → incorporar → evento visible en timeline de `/plan` y como marcador en `/patrimonio` con tooltip completo; descartar un borrador no altera nada.

## Required Documentation Updates
- [ ] `docs/frontend/domain-map.md` — rutas nuevas del dominio `plan`
- [ ] `docs/project-status.md` — estado de la fase

## Risks
- Sobrecarga visual de marcadores en Patrimonio: empezar con densidad mínima y tooltip bajo demanda.
- No duplicar cálculo de comparación en Vue: la comparación viene calculada del backend.

## Completion Criteria
- [ ] AC-E04-001..005 verificados end-to-end desde la UI
- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits, `feat(frontend): ...`)
