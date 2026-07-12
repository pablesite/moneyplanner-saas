# Financial Plan — Fase 6: Ciclo de vida de acontecimientos (SaaS frontend)

## Title
UI para dar de baja un acontecimiento incorporado (venta/desguace del activo) desde Mi Plan, con confirmación y trazabilidad de lo retirado.

## Context
Contrapartida frontend del spec backend de esta fase (`core/docs/tasks/financial-plan/phase-6-event-lifecycle/backend.md`). Los gastos recurrentes de un acontecimiento incorporado son indefinidos hasta que el usuario da de baja el activo; el backend expone `POST /api/plan/events/{id}/close/` que retira las líneas de presupuesto desde la fecha efectiva y recalcula la proyección. La UI debe ofrecer esa acción donde el usuario ve el acontecimiento, con el patrón de confirmación ya usado en incorporar/descartar escenario (commit 993ceee).

## Area
`frontend`

## Stack
`saas`

## Scope

### In scope
1. `domains/plan/api.ts` + `types.ts`: `closeEvent(id, {effective_date, note?})`; `PlanEvent.effective_end_date`.
2. `PlanEventsTimeline`: los eventos activos ofrecen acción "Dar de baja" (menú o botón secundario); los cerrados muestran estado diferenciado ("Cerrado el {fecha}") y dejan de ofrecer la acción.
3. Flujo de baja con confirmación inline (patrón `plan-scenario-notice`):
   - Input de fecha efectiva (default hoy) y nota opcional.
   - Copy explícito de consecuencias: "Se retiran del presupuesto sus gastos recurrentes desde esa fecha y la proyección deja de aplicar el acontecimiento. El histórico presupuestado se conserva. No modifica Patrimonio: si el activo real existe, dale de baja en Patrimonio."
   - Éxito: banner con resumen (líneas retiradas/ajustadas, del `actual_impact_json`) y enlaces "Ver presupuesto" / "Ver Mi Plan".
   - Error API: banner abierto para reintentar (patrón del detalle de escenario).
4. Detalle de escenario incorporado (`PlanScenarioDetailView`): si su evento está cerrado, reflejarlo en la nota de estado.
5. Store: acción `closePlanEvent` que actualiza `events` y `projection` con la respuesta.
6. Marcadores de Patrimonio (`usePlanEvents`): los eventos cerrados mantienen el marcador histórico si `planned_date` ya pasó; si la baja es anterior a `planned_date` (evento cancelado antes de ocurrir), el marcador desaparece. Confirmar contrato con backend.

### Out of scope
- Alta/baja de activos reales en Patrimonio.
- Reabrir eventos cerrados.
- Edición de la fecha efectiva a posteriori.

## Plan
1. **Diagnosis** — Revisar `PlanEventsTimeline`, patrón de confirmación de `PlanScenarioDetailView` y contrato real del endpoint una vez entregado el backend.
2. **Change implementation** — api/types → store → timeline + flujo de confirmación → estados.
3. **Validation** — Comandos abajo + validación en navegador real (Playwright en `saas_frontend`) cubriendo confirmar, cancelar, éxito y error.

## Validation
```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
```

## Required Documentation Updates
- [x] `docs/frontend/domain-map.md` — acción de cierre en el dominio `plan`
- [x] `docs/architecture/api-registry.md` — consumo del endpoint de cierre
- [x] `docs/project-status.md` — estado de la fase

## Risks
- Acción destructiva sobre presupuesto real: la confirmación debe explicitar consecuencias y el flujo no debe ejecutarse a un click (regla del bloque UX 8).
- Desincronización con marcadores de Patrimonio: verificar en navegador con un evento cerrado.

## Completion Criteria
- [x] All validation commands pass
- [x] All required documentation updates done
- [x] Spec moved to `terminados/`
- [x] Commit created (Conventional Commits)

## Completion note (2026-07-12)

- Confirmación inline con fecha mínima, nota, consecuencias explícitas, reintento y resumen de líneas ajustadas/retiradas.
- Los eventos cerrados mantienen marcador histórico y muestran «Cerrado el …» sin volver a ofrecer la acción.
- Playwright validó apertura y cancelación sobre «Coche Ana» sin mutar sus datos; éxito y error quedan cubiertos por tests de componente/API.
