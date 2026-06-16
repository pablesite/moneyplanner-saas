# Fase 1 (REHACER) — Patrimonio (NetWorthView) con Design System "Direction A"

> **Esta fase se rehace (2ª vez).** El 1er intento produjo UI híbrida; el 2º quedó sin híbridos pero
> **se desvió de la fidelidad visual** (hero simplificado, donut sin clavar el prototipo, tabla
> reinterpretada). Ver ambos post-mortem en `docs/tasks/frontend-redesign-direction-a/README.md`.
>
> **Prioridad de este rework: FIDELIDAD LITERAL al prototipo (Regla 0).** El resultado debe
> **coincidir** con `handoff/Moneyplanner Refinement.html` / `handoff/direction-a.jsx`, no "ser
> equivalente". Reconstruir la presentación ≠ rediseñar. Mantener además: separar lógica/presentación,
> contrato de composición primero, clasificar componentes, reconciliar funcionalidad, cero híbridos,
> gate de fidelidad visual.

## Title

Reimplementación visual íntegra de `NetWorthView` sobre "Direction A", preservando la lógica y toda
la funcionalidad, sin dejar bloques heredados en el render.

## Context

Vista de referencia: `handoff/README.md` sección "Patrimonio"; `handoff/direction-a.jsx` →
`ANetWorthView`; prototipo `handoff/Moneyplanner Refinement.html`. Depende de la Fase 0.

Estado actual de la rama (a corregir): `NetWorthView.vue` y `net-worth-view.css` mezclan
`.page`/`APageHead`/`AContextBar`/tabla nueva con bloques heredados (`ui-nw-timeline-*`,
`NetWorthCategoryWorkspace` lateral, `NetWorthTimelineMain`, tailwind en el modal, `ui-state-block`,
`ui-status-line`). **No se parchea sobre esto: se reconstruye la capa de presentación de la vista.**

Se conserva de lo ya hecho: Fase 0 (tokens/fuentes/topbar) y las primitivas `APageHead/ASectHead/
AContextBar/AKindChip/ARowMenu`. Los charts (`NetWorthDonut`, `NetWorthTimelineChart`,
`NetWorthDeltaChart`) **no se dan por buenos solo por estar recoloreados**: deben llevarse a la
estética del prototipo (ver clasificación).

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope:
   - Reconstrucción íntegra del `<template>` de `frontend/src/views/NetWorthView.vue`.
   - Reescritura de `frontend/src/domains/net-worth/net-worth-view.css` a clases del sistema
     (eliminando las `ui-nw-*` heredadas que no pertenezcan a Direction A).
   - Remaquetado de los componentes presentacionales de la vista (ver tabla de clasificación).
   - Extracción de lógica a composables donde un componente "gordo" lo requiera (preservando comportamiento).
2. Out of scope:
   - Cambiar el comportamiento de la capa de lógica (composables/stores/api/modelos).
   - Otras vistas.

## Contrato de composición (árbol final, de arriba abajo)

```
.page  (dir-a)
├─ APageHead  title="Patrimonio"
│   ├─ meta: ADateSelector (fecha histórica) · "Base EUR" · botón "Archivadas N" (ghost)
│   └─ actions: "+ Añadir cuenta" (primary)
├─ AContextBar
│   ├─ Titularidad (ownershipFilter)
│   ├─ Moneda (baseCurrency / currencies)
│   └─ Valoración: seg Nominal/Real (valueMode, gated canShowReal)
├─ Hero (.hero, fila flex wrap) — REPLICAR layout exacto del prototipo, no simplificar
│   ├─ izq: eyebrow "Patrimonio neto" + cifra grande 72px (summaryNetWorth) + delta line
│   ├─ centro: Donut centrado con proporciones/grosor del prototipo; centro "CAPITAL PROPIO · 75%";
│   │          leyenda y pesos visuales como el handoff; hover sobre slice actualiza el centro
│   └─ der: DOS columnas marcadas Activos / Pasivos (listas clickables, toggle → filtra timeline)
├─ section "Evolución" (ASectHead)
│   └─ TimelineChart (línea suave + eje Y 8 ticks) + DeltaChart (barras delta) a ancho completo
├─ section "Balance" (ASectHead)
│   └─ table.tbl con el ritmo del prototipo: cabeceras de grupo ACTIVOS(--pos)/PASIVOS(--neg),
│      densidad de fila, hairlines, swatch 4×20px, jerarquía nombre/subcategoría, titular,
│      valor (mono, --muted), ARowMenu ⋯. Replicar tipografía y espaciado, no aproximar.
└─ modales: Añadir/Editar cuenta (.sheet + campos underline) · preview gasto pasivo generado
```

**No hay panel/workspace lateral en Direction A.** El donut va al hero; el timeline es su propia
sección a ancho completo. La interacción por categoría se hace clicando slices del donut o filas de
la tabla.

**Referencia literal:** antes de maquetar el hero, el donut y la tabla, abrir el bloque
correspondiente en `handoff/direction-a.jsx` (`ANetWorthView`, `Donut`, patrón de tabla balance) y
el prototipo HTML, y reproducir proporciones, leyenda, densidad y ritmo tipográfico tal cual.

## Clasificación de componentes (Regla 3 del README)

| Componente | Cat. | Acción |
| ---------- | ---- | ------ |
| `NetWorthDonut` | B | **Reescrito a SVG** según `handoff/shared.jsx` (`size 200`, `thickness 14`, anillo de fondo, 3 sectores estructurales capital propio/deuda respaldada/no respaldada con tonos `NW_STRUCTURE`, centro "CAPITAL PROPIO · %", **hover sobre sector actualiza el centro**). Se eliminó la dependencia de Chart.js y el panel de composición lateral previo. |
| `NetWorthTimelineChart`, `NetWorthDeltaChart` | A | **Conservados** (los reutiliza `AccountingMovementsView`, fase 3). Su CSS de envoltorio (`a-nw-line-chart*` / `a-nw-delta-chart*`) vive en `app.css` global. |
| `NetWorthEvolutionChart` (nuevo) | — | **Nuevo SVG a medida** (patrón `AInteractiveChart` del handoff): línea suave Catmull-Rom, eje Y de 8 ticks, barras de variación integradas y crosshair + tooltip al hover. Sustituye a Timeline+Delta en la sección "Evolución" de Patrimonio. Sin Chart.js. |
| `NetWorthHeroSection` | B | Remaquetar al hero exacto: cifra grande izq + donut centrado + **dos columnas** Activos/Pasivos. Replicar layout, no simplificar. |
| `ItemList` + `ItemCategoryHeader`/`ItemSubgroupHeader`/`ItemDisplayRow`/`EditableItemRow` | C/D | **Sustituidos** por la tabla `.tbl`/`.grp-*`/`.swatch`/`ARowMenu` construida inline en la vista (lógica en `useNetWorthPageMetrics`). Conservan ownership y archivadas; edición vía modal (`ARowMenu → Editar`), sin edición inline ni subgrupos (fidelidad al prototipo). Componentes y sus specs **eliminados** del dominio. |
| `NetWorthItemModals` + `ItemForm` | B | Aplicar `.sheet` + campos underline + header DSL; conservar `submitAsset`/`submitEdit`/validación. |
| `NetWorthTimelineMain` | D | Descomponer: donut → hero, charts → sección "Evolución". El feed de actividad → ver reconciliación. |
| `NetWorthCategoryWorkspace` (lateral) | D | Eliminar del render. Sus funciones → ver reconciliación. |
| `SettingsPopover` | D | **Eliminado** del dominio: sus filtros (titularidad/moneda/valoración) viven ahora en la `AContextBar`. |

## Reconciliación de funcionalidad (Regla 4 — anti pérdida)

Cada comportamiento actual debe tener destino en la composición nueva:

- Filtros titularidad/moneda/Nominal-Real → **context bar**.
- Selector de fecha histórica → **meta del page-head**.
- Alta/edición/duplicado/archivado/eliminado de cuentas → **"+ Añadir cuenta"** + **ARowMenu** + modales.
- Donut interactivo + timeline + delta + filtrado cruzado (fila/categoría → timeline) → **hero + sección Evolución**.
- Moneda extranjera `(6.000 USD)` + valor EUR → **celda de valor de la tabla**.
- Toggle de archivadas (hoy en el workspace) → **botón "Archivadas N"** del page-head.
- Edición / subgrupos de `ItemList` → **filas de la tabla balance**. Por **fidelidad al prototipo
  (Regla 0)**, la tabla balance del handoff **no tiene edición inline ni cabeceras de subgrupo**: las
  filas son clicables (filtran la evolución) y la edición se hace vía `ARowMenu → Editar` (modal).
  Se sustituye la edición inline de `ItemList` por edición en modal; los subgrupos se omiten. El
  comportamiento (editar/archivar/eliminar/duplicar) se conserva, cambia solo el punto de entrada.
- Preview de gasto de pasivo generado (`showGeneratedLiabilityExpenseModal`) → **modal propio**.
- Estados loading/empty/error → estados del sistema (no `ui-state-block`/`ui-status-line` viejos).

**Decisiones de reconciliación (resueltas con el usuario — fijadas):**

1. **"Crear posición dentro de una categoría seleccionada"** (del workspace lateral) → **se cubre con
   "+ Añadir cuenta"**, preseleccionando la categoría desde la fila/grupo cuando aplique. No se añade
   una entrada extra.
2. **Selector de posición + feed de actividad** de `NetWorthTimelineMain`/`Workspace` (movimientos
   contables/posición de una cuenta) → **se omite en Patrimonio**. No se replica como panel lateral.
   La consulta de movimientos de una cuenta queda fuera de esta vista.

## Plan

1. Definir el contrato de composición (arriba) y validar el mapeo de cada bloque a estado existente.
2. Aplicar las decisiones de reconciliación ya fijadas (crear vía "+ Añadir cuenta"; feed de actividad/selector de posición omitidos en Patrimonio).
3. Reconstruir presentación de arriba abajo: page-head → context-bar → hero → Evolución → Balance → modales.
4. Eliminar del render y del CSS todo bloque/clase heredado (`ui-nw-*`, tailwind de layout, `ui-state-block`, `ui-status-line`).
5. Validación visual completa (gate del README) + lint/typecheck/tests.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- Tests: `frontend/src/domains/net-worth/__tests__` en verde.
- **Gate de fidelidad visual (obligatorio, Regla 0 + Regla 6):** levantar la app, abrir `/patrimonio`
  **junto al prototipo** `handoff/Moneyplanner Refinement.html` y comparar elemento por elemento
  (hero de 2 columnas, donut con su centro/leyenda/pesos, ritmo de la tabla balance). Anotar y
  corregir **cada desviación**; el criterio es "coincide", no "es coherente". Capturas pantalla+prototipo adjuntas.
- Recorrer el checklist de reconciliación e interacciones (hover del donut, filtrado cruzado, edición inline).
- **Grep anti-híbrido:** `grep -rn "ui-nw-\|ui-state-block\|ui-status-line\|ui-pro-\|ui-section-card" src/views/NetWorthView.vue src/domains/net-worth/` no debe devolver clases en el render final de la vista.

## Required Documentation Updates

- [ ] `docs/frontend/frontend-visual-contract.md` — primitivas y patrón tabla balance
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón de la vista Patrimonio
- [ ] `docs/frontend/domain-map.md` — si cambian primitivas/fronteras de componentes
- [ ] `docs/project-status.md` — actualizar estado de la tarea
- [ ] `docs/tasks/frontend-redesign-direction-a/README.md` — marcar Fase 1 ✅

## Risks

- **Riesgo principal: volver a desviarse de la fidelidad.** Tentación de "adaptación productiva"
  (simplificar hero, donut aproximado, tabla a criterio propio). Mitigación: maquetar con el
  prototipo abierto al lado y validar contra él, no contra "se ve coherente".
- Donut con fidelidad: si Chart.js no alcanza el centro/leyenda/pesos del prototipo, escalar a SVG
  sin bloquearse en tweaks infinitos de Chart.js.
- Reconstrucción amplia (hero, donut, timeline, tabla con edición inline, modales): mantener
  comportamiento exige extraer lógica con cuidado; validar cada interacción del checklist.
- Datos mock del prototipo (cifras, "Marta/Alex"): enlazar a datos reales del store, no hardcodear.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests)
- [ ] **Gate de fidelidad visual en verde:** hero (2 columnas), donut (centro/leyenda/pesos) y tabla balance **coinciden** con el prototipo; cero desviaciones sin aprobar. Capturas pantalla+prototipo adjuntas
- [ ] **Grep anti-híbrido limpio**
- [x] Puntos de reconciliación resueltos con el usuario (crear vía "+ Añadir cuenta"; actividad/selector de posición omitidos en Patrimonio)
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
