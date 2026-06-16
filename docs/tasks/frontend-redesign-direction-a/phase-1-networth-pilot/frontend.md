# Fase 1 — Piloto Patrimonio (NetWorthView) con Design System "Direction A"

## Title

Portar `NetWorthView` al sistema "Direction A" preservando el 100% de la funcionalidad.

## Context

Vista de referencia del handoff (`handoff/README.md` sección "Patrimonio";
`handoff/direction-a.jsx` → `ANetWorthView`; `handoff/COMPONENTS.md`). Se reescribe **solo la capa
visual** (`<template>` + CSS) sobre los composables/stores/charts existentes. Depende de la Fase 0
(tokens `.dir-a`, fuentes y topbar ya en su sitio).

**Restricción dura:** no perder funcionalidad. **No se toca lógica de stores/composables/api/
modelos.** Cualquier control del prototipo sin estado equivalente en el código se **confirma antes
de inventar lógica**; los datos mock del prototipo se enlazan a datos reales del store, nunca se
hardcodean.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope (solo `<template>` + CSS, sin cambiar bindings/lógica):
   - `frontend/src/views/NetWorthView.vue` y componentes de presentación:
     `NetWorthHeroSection`, `NetWorthCategoryWorkspace`, `NetWorthTimelineMain`, `ItemList`,
     `ItemCategoryHeader`, `ItemDisplayRow`, `ItemSubgroupHeader`, `SettingsPopover`,
     `NetWorthItemModals`.
   - `frontend/src/domains/net-worth/net-worth-view.css` → reescribir hacia las clases del sistema
     (`.page`, `.page-head`, `.context-bar`, `.hero-*`, `.tbl`, `.grp-*`, `.swatch`, `.row-menu`),
     todo bajo `.dir-a`.
   - Recolor de Chart.js a paleta oklch en `NetWorthDonut`, `NetWorthTimelineChart`,
     `NetWorthDeltaChart` (sin tocar su lógica/interacción).
   - Primitivas UI reutilizables nuevas en `frontend/src/domains/ui/components/`: `APageHead`,
     `ASectHead`, `AContextBar`, `AKindChip`, `ARowMenu` (solo presentación, props/slots).
   - Modal "Añadir cuenta": aplicar el CSS del sistema (campos underline, header DSL, `.sheet`)
     sobre `BaseModal` + `NetWorthItemModals`/`ItemForm` existentes. **NO** portar `AAddAssetSheet`
     verbatim.
2. Out of scope:
   - Reimplementar charts en SVG puro (se reusa Chart.js recoloreado).
   - Tocar lógica de stores/composables/api/modelos.
   - Otras vistas (Presupuesto, Cierre, Movimientos, Guía) — fases posteriores.

## Plan

1. Diagnosis: mapear cada bloque del prototipo al estado/props ya existentes
   (`useNetWorthViewState`, `useNetWorthOwnership`, `useNetWorthPageMetrics`,
   `useNetWorthTimeline*`, `useNetWorthPageActions`).
2. Change implementation por bloques (markup nuevo ← estado existente, sin cambiar el binding):
   - **Page head:** title "Patrimonio"; meta = selector de fecha histórica + "Base EUR" + botón
     "Archivadas N" (ghost); actions = `+ Añadir cuenta`.
   - **Context bar:** Titularidad (`ownershipFilter`), Moneda (`baseCurrency` / `currencies`),
     Valoración segmented Nominal/Real (`valueMode`, gated por `canShowReal`). Fuera del área de
     "actions".
   - **Hero:** eyebrow + cifra 72px (`summaryNetWorth`) + delta line; Donut recoloreado (Capital
     propio / Deuda respaldada / Deuda no respaldada usando `summaryAssetBackedLiabilities` /
     `summaryUnbackedLiabilities`); listas Activos/Pasivos clickables.
   - **Evolución:** `NetWorthTimelineChart` + `NetWorthDeltaChart` recoloreados; mantener el
     filtrado cruzado (fila/categoría → timeline).
   - **Balance:** tabla `.tbl` con `grp-kind-asset` / `grp-kind-liability`, `swatch`,
     `account-value`, `ARowMenu` (Editar / Duplicar / Ver movimientos / Archivar / Eliminar con
     confirmación 2 clics); reusar `useNetWorthPageActions`, `PositionRow`.
   - **Moneda extranjera:** `(6.000 USD)` en `--faint` a la izquierda del valor EUR.
   - **Modal alta/edición** sobre componentes existentes (`submitAsset` / `submitEdit` /
     validación intactos).
3. Validation: checklist de NO pérdida + lint/format/typecheck + tests del dominio.

## Validation

List exact commands and expected outcomes.

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck` → sin errores
- Tests: `frontend/src/domains/net-worth/__tests__` en verde.
- Manual en `/patrimonio` (checklist NO pérdida — todos deben seguir operativos e idénticos en comportamiento):
  - Filtros titularidad / moneda / Nominal-Real (incl. gating `canShowReal`).
  - Selector de fecha histórica.
  - Alta / edición / duplicado / archivado / eliminado de cuentas (modales + confirmaciones 2 clics).
  - Donut interactivo + timeline + delta + filtrado cruzado fila/categoría → timeline.
  - Cuentas en moneda extranjera (`(6.000 USD)` + valor EUR).
  - Preview de gasto de pasivo generado (`showGeneratedLiabilityExpenseModal`) + store anual.
  - Estados loading / empty / error (`prettyError`, `toApiErrorMessage`).
  - Capabilities (`canUse...`) intactas; sin checks directos de plan nuevos.

## Required Documentation Updates

List every canonical doc that MUST be updated before closing this task.

- [ ] `docs/frontend/frontend-visual-contract.md` — primitivas (`APageHead`, `ASectHead`, `AContextBar`, `AKindChip`, `ARowMenu`) y patrón de tabla balance
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón de la vista Patrimonio
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas UI compartidas
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- Pérdida de funcionalidad al reescribir templates: mitigado por el checklist NO pérdida obligatorio.
- Controles del prototipo sin backing real (p.ej. "Guardar borrador", presets concretos del date
  selector): **CONFIRMAR antes de inventar lógica**; si no hay estado, omitir o dejar no-op
  declarado. No simular datos.
- Datos mock del prototipo (cifras, titulares "Marta/Alex"): enlazar a datos reales del store, no
  hardcodear.
- El recolor de Chart.js altera la interacción: validar hover/tooltips/filtrado tras el cambio.

## Completion Criteria

- [ ] All validation commands pass
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
