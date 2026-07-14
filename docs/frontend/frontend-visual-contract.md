# Frontend Visual Contract

## Objective

Turn the visual guide into a small operational contract for reusable frontend work across `core` and `saas`.

## Rules

1. Shared patterns and design tokens are defined in `core/frontend/src/styles/app.css`.
2. `core/frontend/src/styles/app.css` is the canonical source; SaaS synchronization is explicit and should only happen when the scope includes SaaS.
3. Direction A SaaS experimentation can live in `frontend/src/styles/design-system.css` as long as it remains namespaced under `.dir-a`.
4. New page-level layout patterns must use shared classes before introducing local CSS.
5. Inline `style=` is not allowed in Vue templates.
6. New `<style scoped>` blocks require explicit justification; default to shared styles.
7. Loading, empty, error, and success states must use the shared state pattern when possible.
8. Direction A views may define local reusable page patterns in `frontend/src/domains/*/*.css` when they are still stabilizing, but those patterns must stay namespaced and documented here once reused.

## Design Tokens

1. Semantic color tokens:
   - `--color-canvas`, `--color-canvas-subtle`
   - `--color-surface`, `--color-surface-muted`, `--color-surface-strong`
   - `--color-border`, `--color-border-strong`
   - `--color-text`, `--color-text-muted`, `--color-text-soft`
   - `--color-accent`, `--color-accent-muted`, `--color-accent-alt`
   - `--color-positive`, `--color-negative`, `--color-info`, `--color-warning`
2. Layout and shape tokens:
   - `--container-max`
   - `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`
   - `--radius-sm`, `--radius-md`, `--radius-lg`
   - `--shadow-surface`, `--shadow-surface-soft`
3. Compatibility aliases:
   - `--bg`, `--panel`, `--border`, `--text`, `--muted`
   - These remain available for existing CSS, but new shared styles should prefer semantic tokens.

## Required Shared Patterns

1. Page shell:
   - `ui-page-shell`
   - `ui-page-head`
   - `ui-page-eyebrow`
   - `ui-page-title`
   - `ui-page-lead`
   - `ui-page-actions`
2. Section shell:
   - `ui-section-card`
   - `ui-section-card-padded`
   - `ui-section-head`
   - `ui-section-copy`
   - `ui-section-title`
   - `ui-section-subtitle`
   - `ui-section-actions`
3. Surface variants:
   - `ui-surface-muted`
   - `ui-surface-strong`
4. Action rows:
   - `ui-action-bar`
5. State blocks:
   - `ui-state-block`
   - `ui-state-empty`
   - `ui-state-error`
   - `ui-state-success`
   - `ui-state-loading`
6. Controls:
   - `AButton` (`domains/ui`) — primitiva de botón Direction A. Props `variant` (`default`/`primary`/`ghost`/`icon`), `size` (`md`/`sm`), `type`, `disabled`, `loading` (spinner + `aria-busy`), `block`. Envuelve las clases `.btn / .btn-primary / .btn-ghost / .btn-icon`; preferirla sobre `<button>` crudos.
   - `btn`
   - `btn-primary`
   - `btn-ghost`
   - `btn-sm`
   - `icon-btn`
   - `input`
   - `textarea`
   - `ASelect` for all Direction A selects (filtros, formularios y modales). No quedan `<select>` nativos en el frontend SaaS: usar siempre `ASelect` con `options: ASelectItem[]` (búsqueda automática si la lista supera 8 opciones; `:searchable="false"` para enums fijos). `ASelect` reenvía `$attrs` al botón trigger (tiene dos root nodes por el `Teleport`), así que las clases del consumidor (`.filter-ctrl`, `.select`) y `aria-label` aplican sobre el control visible.
7. Modal shell:
   - `ui-modal-backdrop`
   - `ui-modal-panel`
   - `ui-modal-head`
   - `ui-modal-title`
   - `ui-modal-close`
   - `ui-modal-body`
8. Direction A balance table pattern:
   - grouped rows with semantic kind labels (`ACTIVOS` / `PASIVOS`); liability group totals shown negative (`−`)
   - first column with vertical swatch + primary name only; subcategory lives in its own column (no duplicated secondary line)
   - foreign-currency hint rendered before the base-currency amount
   - rows are clickable to filter the timeline; row edit/archive/delete via `ARowMenu` (no inline editing)
   - active/filter state expressed by row background and section-level filter copy, not nested cards
9. Direction A net-worth composition: Patrimonio General uses the Activos / Pasivos composition columns as the primary explanatory element. The previous capital-own donut is not part of the default General hero because it duplicates the same story with much lower information density; `NetWorthDonut` can remain available for future focused contexts, but should not be reintroduced in the hero without a concrete user decision it improves.
10. Direction A net-worth evolution chart: bespoke SVG (smooth Catmull-Rom line + area, 8-tick Y axis with compact labels, integrated delta bars, hover crosshair + marker + floating tooltip). It supports monthly valuation and daily ledger-backed points; manual positions are never interpolated into the daily series.
11. Direction A stepper (`AStepper`, `domains/ui`): top-border step rail (`.stepper` / `.stepper-step`) with eyebrow `Paso N`, label, optional meta and a done check (`✓`); `is-active`/`is-done` use the accent top border. Props `steps`/`activeId`/`eyebrowPrefix`, emits `change`. Used by the monthly-close flow (`/cierre-mensual`) and reusable in Phase 4.
12. Direction A sparkline (`ASparkline`, `domains/ui`): bespoke 64×18 SVG line of a 12-month series with active-month dot; flat baseline when there is no data. Classes `.sparkline` / `.dot-now` in `design-system.css`.
13. Direction A budget table pattern (`/presupuesto`, `budget.css`): hierarchical `bdg-row` grid (`Partida | Previsto | Ejecución | Evol. | Ejecutado | menú`) at category (`bdg-row-cat`, with `bdg-kind` asset/liability label) → subcategory (`bdg-row-sub`) → item levels; execution column is `BudgetBarCell` (`.prog` bar + ratio/deviation meta, `prog-good/warn/danger/neutral`, `prog-over` tick); the `Previsto`/`Ejecutado` columns show YTD-prorated planned and YTD executed. Section-level coverage KPIs (`.bdg-coverage`), previsto-vs-ejecutado evolution chart (`.bdg-evolution`) and rollup bar (`.bdg-rollup` / `.bdg-richbar`) precede the table. `Evol.` column uses `ASparkline`; per-row history is not exposed by the engine, so only the section-total row plots a real series (cat/sub show the baseline placeholder — approved fidelity exception). La vista alinea el chrome común con Patrimonio/Movimientos: barra de tabs `.tabs/.tab` (`Detalle anual` / `Sugerencias`) bajo el `APageHead`, `AContextBar` (año fiscal · titularidad · tipo de partida), feedback de éxito con `AToast` y errores con `AState status="error"`, y FAB de alta móvil (`.bdg-mobile-create`) con menú Ingreso/Gasto replicado en el head. Importes en símbolo `€` (`currencySymbol`). El estado de la vista se pasa a `BudgetAnnualSection` como objeto único `:page` (`BudgetPageState`), igual que `AccountingMovementsPageState`.
14. Direction A monthly-close step pattern (`/cierre-mensual`, `monthly-close.css`): `MonthlyCloseHero` (big residual + liquidity delta + 3 KPIs) and four step sections sharing `.mc-step` (ASectHead + `AKpiBand` band con `mc-step-kpis` + collapsible category blocks `.mc-block` → `.mc-row` reconciliation rows with `.mc-metrics`, manual-adjust `.mc-adjust`/`.mc-input` and `AKindChip` status). La banda KPI de cada paso usa `AKpiBand` con `cellClass` para el coloreado de la desviación (`mc-kpi-dev-good`/`mc-kpi-dev-danger`); los estados loading/empty usan `AState` inline. Las 4 secciones se mantienen como componentes de dominio independientes (props divergentes), no se colapsan. El Resultado step adds `.mc-result-hero` cards, the `.mc-bridge` reconciliation and `.mc-diag` residual scale.
15. Direction A accounting workspace (`/contabilidad`): the operational band precedes a sticky search/filter bar and a date-grouped ledger with `Fecha y concepto / Origen → destino / Clasificación / Importe`. `needs_review` is an actionable classification chip, not a persisted transaction status. Transfers and investments stay neutral without an account filter; account filtering shows signed impact. At `sm` each row becomes a labelled vertical record without horizontal scrolling; secondary filters move into an adaptive sheet and the create action stays thumb-reachable.
16. Legacy financial-state strip/detail (`/estado-financiero` and `/estado-financiero/ambitos/:phaseId`) was retired from SaaS in Financial Plan Phase 5. Those routes redirect to `/plan`; new diagnostic UI should compose on Mi Plan foundations, findings and recommendations.
17. Direction A diagnostic surfaces now belong to Mi Plan rather than the removed `guide/` domain. Keep loading, empty, error and success states on the shared `AState`/section patterns.
18. Direction A hero (`AHero` + `AKpiBand`, `domains/ui`): `AHero` renderiza el bloque de figura común (`.a-hero-figure`: eyebrow muted + `.hero-value` grande + slot `#delta` con `.hero-delta`); para valores no triviales usar el slot `#value`. `AKpiBand` renderiza la rejilla `.kpis` de celdas `label`/`value`/`meta` (prop `items`; deltas coloreados vía slots `meta-<i>`). El grid exterior y el contenido lateral (year-strip, columnas, KPIs) los aporta cada vista, pero la **alineación vertical** se comparte vía `.a-hero-shell` (`display: grid; align-items: start`) para que la cifra caiga en el mismo lugar entre vistas; cada vista define solo `grid-template-columns` y `gap`. Patrimonio mantiene un layout flex de 2 partes (figura · columnas Activos/Pasivos) por su reflow responsive, pero replica la misma alineación y sin offset superior. Las clases `.hero-value`, `.hero-delta`, `.hero-delta-copy`, `.hero-delta-sep`, `.hero-breakdown`, `.hero-comp-*`, `.comp-*` y `.kpi-meta .pos/.neg` viven en `design-system.css` bajo `.dir-a`; las vistas solo añaden overrides responsive scoped (`.mc-hero`, `.hero`, etc.). Consumido por `BudgetHero`, `MonthlyCloseHero`, el hero de Patrimonio y el de Contabilidad (el hero `ui-pro-*` legacy se retiró en Fase F).
19. Direction A custom period picker (`/contabilidad`): cuando un filtro no puede ser `ASelect` por necesitar rango libre, debe respetar el mismo chrome base (`.filter-ctrl`, borde, radio, tipografía, espaciado y popover surface). El picker de período de Contabilidad es la referencia.
20. Accounting sheets: row selection opens a read-first detail sheet with operational language and advanced Debe/Haber; create/edit sheets reveal fields progressively, trap focus, restore the trigger and protect dirty forms from accidental dismissal.
21. Direction A guided-question pattern (`/plan/setup`, `plan.css`): cuando una decisión del usuario se recoge mejor como pregunta que como campo, usar `AStepper` (una pregunta por paso, avance bloqueado hasta que el paso es válido, retroceso libre) + tarjetas de respuesta `.plan-choice` dentro de `.plan-choice-grid` (`.is-on` + `aria-pressed` para la selección; `.plan-choice-sm` para respuestas cortas tipo edad; `.plan-choice-grid-stack` para opciones largas). Los valores técnicos no se piden: se derivan de la respuesta y se muestran como `.plan-derived-field`. El paso final resume el plan en prosa (`.plan-summary`) con los valores derivados en `.plan-summary-facts`. Si el patrón se reutiliza fuera de Mi Plan, promover las clases a `design-system.css`.
22. Direction A budget equalizer (`PlanExpenseEqualizer`, `plan.css` `.plan-eq-*`): reparto de un total entre categorías con sliders verticales nativos (`input[type=range]` con `writing-mode: vertical-lr; direction: rtl`, `accent-color` del tema), cabecera Ingresos · Asignado · Libre con `aria-live`, clamp al restante (subir una barra nunca rebasa el total; las demás no se mueven solas) y campo numérico de ajuste fino bajo cada barra. El tablero es un grid de columnas con scroll horizontal en móvil.

## Usage Guidance

1. Use `ui-page-shell` for top-level views instead of composing ad hoc page spacing.
2. Use `ui-section-card` for grouped content that should read like the same product family; add `ui-section-card-padded` when the section does not provide its own internal spacing.
3. Use `ui-action-bar` for filter rows, secondary actions, and header controls.
4. Use `ui-state-block` variants for non-happy-path states instead of one-off alert cards.
5. If a view needs a special visual treatment, layer it on top of the contract rather than replacing the base shell.
6. Treat `card` and `ui-pro-*` as compatibility classes while views migrate to `ui-page-*`, `ui-section-*`, and token-driven controls.
7. Use the `ui-modal-*` shell for shared modal chrome; domain-specific modal classes should only style the modal content or adjust panel width.

## Change Policy

1. Add a new shared pattern only if at least two screens would benefit from it.
2. Update this document when shared visual behavior changes.
3. Keep the contract small; it is a guardrail, not a full design system specification.
4. Direction A phase 0 introduces these shell-level reusable classes: `.topbar`, `.topnav-brand`, `.topnav-list`, `.topnav-item`, `.topnav-right`, and `.avatar`.
5. Mobile shell navigation uses the shared `.ui-shell-bottom-nav` tab bar for the five primary product sections (`Estado`, `Patrimonio`, `Presupuesto`, `Movimientos`, `Cierre`) at `max-width: 960px`; primary product navigation must not be hidden behind a hamburger drawer. `/account` and `/data` stay in the account menu.

## Librería de componentes (primitivas Direction A)

Primitivas reutilizables en `frontend/src/domains/ui` (barrel `@/domains/ui`). Preferirlas siempre sobre markup ad-hoc.

| Componente           | Para qué                                                                          | Props / slots clave                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AButton`            | Botón. Sustituye `<button>` crudos.                                               | `variant` (`default`/`primary`/`ghost`/`icon`), `size` (`md`/`sm`), `type`, `disabled`, `loading` (spinner + `aria-busy`), `block`.                                   |
| `ASelect`            | **Todos** los selects (filtros, formularios, modales). No usar `<select>` nativo. | `modelValue`, `options: ASelectItem[]` (opción o grupo; `disabled` por opción para placeholders), `disabled`, `searchable` (auto si >8). Reenvía `$attrs` al trigger. |
| `AHero`              | Bloque de figura del hero (eyebrow + cifra + delta).                              | props `eyebrow`, `value`; slots `#value` (valor no trivial), `#delta`, default. Grid exterior por vista; alineación compartida vía `.a-hero-shell`.                   |
| `AKpiBand`           | Rejilla de KPIs (`.kpis`).                                                        | `items: AKpiItem[]` (`label`/`value`/`meta`/`cellClass`); slots `#meta-<i>` para meta rica.                                                                           |
| `AMetaPill`          | Pill de metadato corto (año fiscal, fecha…).                                      | slot.                                                                                                                                                                 |
| `AState`             | Bloque de estado loading/empty/error/success.                                     | `status` (`neutral`/`loading`/`empty`/`error`/`success`), `layout` (`inline`/`panel`); slot.                                                                          |
| `ADonut`             | Donut SVG genérico (sin librería).                                                | `slices: ADonutSlice[]` (`value`/`color`/`label`/`hoverValue`), `centerEyebrow`, `centerValue`, `size`, `thickness`.                                                  |
| `AKindChip`          | Chip semántico (kind asset/liability/muted).                                      | `tone`, `active`; slot.                                                                                                                                               |
| `ASectHead`          | Cabecera de sección.                                                              | `eyebrow`, `title`, `subtitle`; slots `#hint`, `#actions`.                                                                                                            |
| `APageHead`          | Cabecera de página.                                                               | `title`; slots `#meta`, `#actions`.                                                                                                                                   |
| `AContextBar`        | Barra de contexto/filtros bajo la page head.                                      | slot (campos `.context-field`).                                                                                                                                       |
| `AInfoHint`          | Icono de ayuda con tooltip.                                                       | `label`; slot.                                                                                                                                                        |
| `AStepper`           | Rail de pasos (cierre mensual).                                                   | `steps`, `activeId`, `eyebrowPrefix`; emite `change`.                                                                                                                 |
| `ASparkline`         | Mini-serie 12 meses.                                                              | serie + mes activo.                                                                                                                                                   |
| `ARowMenu`           | Menú de fila (editar/archivar/borrar).                                            | `items`; emite `select`.                                                                                                                                              |
| `AToast`             | Toast de confirmación transitorio (teleport a body, auto-descarte).               | `open`, `message`/slot, `tone` (`success`/`error`), `duration`, `icon`; emite `close`.                                                                                |
| `AChevron`           | Indicador de colapso ▾/▸ para listas agrupadas.                                   | `expanded`.                                                                                                                                                           |
| `ADateRange`         | Par de inputs de fecha "Desde/Hasta" para rangos personalizados (presentacional). | `from`, `to`; emite `update:from`/`update:to` (v-model:from/to).                                                                                                      |
| `BaseModal`          | Chrome de modal compartido.                                                       | `open`, `title`, `variant` (`default`/`sheet`); slots `#header`, default (cuerpo con scroll) y `#footer` (footer fijo del panel, fuera del scroll). Footer con `.ui-modal-foot` + `.ui-modal-foot-actions`. |
Reglas: una primitiva nueva solo si ≥2 pantallas la usarían (Change Policy). No acoplar `domains/ui` a dominios retirados o a lógica de scoring que ya vive en backend.

Helpers compartidos asociados (no son componentes):

- `useCollapsibleGroups` (`@/lib/useCollapsibleGroups`): estado de colapso por Set de claves para listas agrupadas; acompaña a `AChevron`. Usado por catálogo de cuentas y balance de patrimonio.
- Formato/números: `@/lib/format` (`toNumber`, `formatNumber`, `formatPct`, `formatCompact`, `formatAmount`, `formatMoney`, `currencySymbol`, `getMaxDecimals`, `normalizeNumberInput`). Fechas: `@/lib/dates` (`parseIsoToDate`, `dateToIso`, `formatMonthYearLabel`). Preferirlos sobre reimplementaciones locales.

Notas de cierre de Fase 5:

- Las primitivas Direction A compartidas quedan consolidadas en `frontend/src/domains/ui` y son la vía por defecto para botones, selects, heroes, KPI bands, estados, pills y donuts.
- `ASelect` es obligatorio tanto en filtros como en formularios/modales. El trigger visible recibe `$attrs` del consumidor y el panel dimensiona a contenido (`width/height: auto`) para evitar regresiones de tamaño.
- Las clases compartidas de heroes y breakdowns (`.a-hero-shell`, `.hero-*`, `.comp-*`, `.kpi-*`) viven en `frontend/src/styles/design-system.css`; no se permite importar CSS cross-dominio solo para reutilizarlas.
