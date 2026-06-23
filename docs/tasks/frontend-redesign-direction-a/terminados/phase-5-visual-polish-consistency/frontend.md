# Fase 5 — Gate visual + consistencia transversal de componentes básicos

## Title

Cierre visual transversal del redesign "Direction A": validación happy-path contra handoff y
unificación de detalles compartidos entre las vistas ya portadas.

## Context

Las fases 1-4 del redesign se consideran cerradas por decisión de producto. Queda una última fase
transversal para rematar dos frentes comunes:

1. el **gate visual** de las vistas Direction A ya aceptadas,
2. la **consistencia fina** entre sus componentes básicos compartidos.

Esta fase no reabre el scope funcional de Patrimonio, Presupuesto, Cierre mensual, Contabilidad ni
Estado financiero. Su objetivo es reducir diferencias de acabado entre vistas y dejar un lenguaje
visual más uniforme antes del cierre definitivo del módulo.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope:
   - comparación visual happy-path de las vistas Direction A contra el handoff,
   - ajuste fino de primitivas y patrones compartidos,
   - homogeneización de detalles básicos entre vistas ya migradas.
2. Out of scope:
   - cambios de lógica de dominio,
   - nuevas capacidades funcionales,
   - reabrir el rediseño estructural completo de una vista ya cerrada salvo bug visual claro.

## Plan

1. Revisar las cinco vistas Direction A ya cerradas con datos reales y capturas comparativas.
2. Identificar diferencias repetidas en componentes básicos compartidos.
3. Ajustar tokens, clases y primitivas transversales antes que aplicar parches locales.
4. Revalidar todas las vistas afectadas y documentar el cierre final del módulo.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- `... npm run test:unit` → en verde
- Gate visual manual en happy-path para:
  - `/`
  - `/presupuesto`
  - `/cierre-mensual`
  - `/movimientos`
  - `/estado-financiero`
  - `/estado-financiero/ambitos/:phaseId`
- Verificación manual adicional en vistas/formularios tocados por las primitivas compartidas:
  - `/aux-data`
  - `/account`
  - `ItemForm`
  - `AnnualEntryModalForm`
  - `FamilyMemberManager`
- Comparación lado a lado con `handoff/Moneyplanner Refinement.html` y los `.jsx` de referencia.

## Required Documentation Updates

- [x] `docs/frontend/frontend-visual-contract.md` — consolidar primitivas y patrones transversales finales
- [x] `docs/frontend/frontend-visual-guide.md` — reflejar los criterios finales de consistencia
- [x] `docs/frontend/domain-map.md` — sin cambios de fronteras; no requiere actualización
- [x] `docs/project-status.md` — marcar Fase 5 ✅ y cierre final del módulo
- [x] `docs/tasks/frontend-redesign-direction-a/README.md` — marcar Fase 5 ✅ y el módulo completo

## Risks

- Ajustes “pequeños” en primitivas compartidas pueden generar regresiones visuales en varias vistas a la vez.
- El gate visual puede destapar diferencias estructurales que conviene tratar como defectos concretos, no como una reapertura informal de fases ya cerradas.
- Sin datos reales estables en local, el happy-path visual puede quedar parcialmente bloqueado.

## Completion Criteria

- [x] All validation commands pass
- [x] Gate visual happy-path completado en todas las vistas Direction A
- [x] Consistencia básica transversal revisada en page heads, context bars, tablas, chips, botones, sheets y estados
- [x] All required documentation updates done
- [x] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
