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
9. Direction A net-worth donut: bespoke SVG (`size 200`, `thickness 14`, background ring, structural slices capital/backed/unbacked) with center text that the hovered slice overrides; no chart library, no legend (the two hero comp columns act as legend).
10. Direction A net-worth evolution chart: bespoke SVG (smooth Catmull-Rom line + area, 8-tick Y axis with compact labels, integrated monthly-delta bars sharing the X axis, hover crosshair + marker + floating tooltip). Scales via a fixed `viewBox` at `width:100%`. The Chart.js `NetWorthTimelineChart`/`NetWorthDeltaChart` remain only for `AccountingMovementsView` until Phase 3.
11. Direction A stepper (`AStepper`, `domains/ui`): top-border step rail (`.stepper` / `.stepper-step`) with eyebrow `Paso N`, label, optional meta and a done check (`✓`); `is-active`/`is-done` use the accent top border. Props `steps`/`activeId`/`eyebrowPrefix`, emits `change`. Used by the monthly-close flow (`/cierre-mensual`) and reusable in Phase 4.
12. Direction A sparkline (`ASparkline`, `domains/ui`): bespoke 64×18 SVG line of a 12-month series with active-month dot; flat baseline when there is no data. Classes `.sparkline` / `.dot-now` in `design-system.css`.
13. Direction A budget table pattern (`/presupuesto`, `budget.css`): hierarchical `bdg-row` grid (`Partida | Previsto | Ejecución | Evol. | Ejecutado | menú`) at category (`bdg-row-cat`, with `bdg-kind` asset/liability label) → subcategory (`bdg-row-sub`) → item levels; execution column is `BudgetBarCell` (`.prog` bar + ratio/deviation meta, `prog-good/warn/danger/neutral`, `prog-over` tick); the `Previsto`/`Ejecutado` columns show YTD-prorated planned and YTD executed. Section-level coverage KPIs (`.bdg-coverage`), previsto-vs-ejecutado evolution chart (`.bdg-evolution`) and rollup bar (`.bdg-rollup` / `.bdg-richbar`) precede the table. `Evol.` column uses `ASparkline`; per-row history is not exposed by the engine, so only the section-total row plots a real series (cat/sub show the baseline placeholder — approved fidelity exception).
14. Direction A monthly-close step pattern (`/cierre-mensual`, `monthly-close.css`): `MonthlyCloseHero` (big residual + liquidity delta + 3 KPIs) and four step sections sharing `.mc-step` (ASectHead + `.kpis` band + collapsible category blocks `.mc-block` → `.mc-row` reconciliation rows with `.mc-metrics`, manual-adjust `.mc-adjust`/`.mc-input` and `AKindChip` status). The Resultado step adds `.mc-result-hero` cards, the `.mc-bridge` reconciliation and `.mc-diag` residual scale.
15. Direction A accounting movement table (`/movimientos`): columns `Cuenta / origen`, `Destino`, `Categoría` and `Importe` replace ledger-side `Debe`/`Haber`. Transfers and investments show their moved amount as neutral without an account filter; with an account filter, every row shows the signed impact and currency of that account. Income, expense, investment and debt rows expose category/subcategory; transfers show classification as not applicable. Below `620px`, each movement becomes a labelled vertical record (without horizontal table scrolling); filters use one or two columns depending on available width, account rows hide the redundant type column, and tabs remain horizontally reachable.
16. Direction A financial-state strip (`/estado-financiero` and `/estado-financiero/ambitos/:phaseId`): five equal-width steps with a 2px top hairline, eyebrow `Ámbito N`, scope label, mono score (`N/100`) and a compact A–E grade badge. Completed/current scopes are fully opaque; pending scopes stay muted. Grade colors use the unified `oklch(0.74 0.13 H)` scale (`A 148`, `B 115`, `C 80`, `D 45`, `E 24`).
17. Direction A financial-state detail: page head + scope strip + two-column score/diagnostic surface. The score column uses a large grade-colored `N/100`, a native styled progress element, remaining percentage, summary band and scored indicators. Loading, API error, unknown scope and not-yet-supported scope states keep the same continuous, hairline-led surface instead of legacy cards.
18. Direction A hero (`AHero` + `AKpiBand`, `domains/ui`): `AHero` renderiza el bloque de figura común (`.a-hero-figure`: eyebrow muted + `.hero-value` grande + slot `#delta` con `.hero-delta`); para valores no triviales usar el slot `#value`. `AKpiBand` renderiza la rejilla `.kpis` de celdas `label`/`value`/`meta` (prop `items`; deltas coloreados vía slots `meta-<i>`). El grid exterior y el contenido lateral (year-strip, donut, columnas) los aporta cada vista, pero la **alineación vertical** se comparte vía `.a-hero-shell` (`display: grid; align-items: start`) para que la cifra caiga en el mismo lugar entre vistas; cada vista define solo `grid-template-columns` y `gap`. Patrimonio mantiene un layout flex de 3 partes (figura · donut · columnas) por su reflow responsive, pero replica la misma alineación y sin offset superior. Las clases `.hero-value`, `.hero-delta`, `.hero-delta-sep` y `.kpi-meta .pos/.neg` viven en `design-system.css` bajo `.dir-a`; las vistas solo añaden overrides responsive scoped (`.mc-hero`, `.hero`, etc.). Consumido por `BudgetHero`, `MonthlyCloseHero` y el hero de Patrimonio; el hero de Contabilidad sigue en `ui-pro-*` (legacy) hasta su retirada.

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
