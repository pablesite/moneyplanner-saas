# Frontend Visual Guide

## Objective
Define how to build a frontend that feels coherent, elegant, modern, and easy to use across `core` and `saas`.

## What Good Looks Like
1. The interface should feel calm, clear, and financially credible.
2. UX quality matters more than decorative visuals.
3. Visual polish should support comprehension, not compete with it.
4. Every screen should feel like part of the same product family.

## Visual Direction
1. Prefer elegant minimalism over dense or flashy layouts.
2. Keep information density controlled: rich enough to be useful, never crowded.
3. Use strong hierarchy through spacing, typography, and grouping before adding extra color or ornament.
4. Aim for a modern look: clean surfaces, restrained accents, subtle contrast, and deliberate layout rhythm.
5. Avoid UI that feels generic, noisy, or inconsistent between views.

## Design Principles
1. Consistency over local one-off styles.
2. Shared tokens first, component-level style second.
3. Navigation clarity over visual cleverness.
4. One primary action per screen context whenever possible.
5. Clear states for loading, empty, error, and success.
6. Desktop and mobile behavior must both be intentional, never incidental.

## UX Priorities
1. The user should quickly understand where they are, what they are seeing, and what to do next.
2. Important flows should reduce friction instead of demanding too much precision up front.
3. Complex financial views should stay understandable by exposing detail progressively.
4. Interactions should happen in the most relevant visual context instead of forcing unnecessary page changes.
5. Empty states, errors, and partial-data states must guide the user, not just report status.

## Working With an Agent
1. Start by defining the UX problem, not the final component structure.
2. Describe the user goal, the screen in scope, and what should feel easier after the change.
3. Ask the agent first for structure and interaction proposals before polishing details.
4. Validate one thing at a time:
   - information architecture,
   - interaction model,
   - visual hierarchy,
   - responsive behavior,
   - edge states.
5. Prefer iterative changes in the real app over isolated mockups disconnected from production code.
6. When in doubt, ask the agent to simplify the flow rather than add more UI.

## Layout
1. Prefer stable page shells and predictable section order.
2. Use a consistent max width and grid rhythm across major views.
3. Keep sections visually separated, but avoid fragmented dashboards made of too many unrelated cards.
4. Use proximity and spacing to show relationships before introducing borders or heavy backgrounds.

## Typography and Spacing
1. Use shared typography and spacing tokens from app styles.
2. Direction A foundation uses `Geist` / `Geist Mono` with `system-ui` fallback via the SaaS shell.
3. Keep heading hierarchy clear and predictable.
4. Avoid ad-hoc spacing in single components.
5. Use typography to mark importance, not just size differences.
6. Long screens should still feel scannable in a few seconds.

## Components
1. Reuse shared UI primitives where available.
2. Keep visual behavior aligned across `core` and `saas` base components.
3. Prefer simple cards, clean tables, and charts without unnecessary visual noise.
4. Avoid introducing new component variants unless they solve a clear UX problem.
5. Do not duplicate components when composition or extension is enough.
6. The shell navigation for Direction A should favor a horizontal topbar with brand, primary nav, and account actions before introducing view-level redesigns.
7. In Patrimonio, Direction A should read as one continuous surface controlled by internal tabs: General, Evolución, and Balance. The header stays compact: no primary create CTA, no visible labels for the obvious read controls, no duplicated currency copy, and no permanent `Hoy` chip; show a dated base only when it adds real context. Ownership/currency/valuation controls stay in a single-row context rail that can scroll horizontally on narrow mobile. Archived positions appear as quiet actionable metadata, not as a primary action. General contains the hero: big net-worth figure on the left with tooltip-backed comparison groups for Mes/Año, each separating `vs cierre anterior` from an explicit equivalent-date label such as `vs 28 de mayo` when Core can calculate the reference date, plus capital-owned ratio as quiet metadata under the figure. The Activos / Pasivos composition columns are the main explanatory element; do not reintroduce the capital-own donut or a redundant KPI strip below. Evolución starts directly with the latest value, period delta and chart; Ámbito (Total / Operativo) sits beside that KPI, while the range presets (3m, 6m, 1a, 3a, 5a, Todo, Fechas) sit directly below the chart as the only timeline control. Do not expose granularity as an independent choice: Total is monthly and Operativo is daily/accounting-backed. Balance owns the grouped table on desktop and the operational compact list on mobile, with sticky search/type controls, per-position detail sheet, and thumb-reachable create action.
8. Presupuesto (`/presupuesto`) y Cierre mensual (`/cierre-mensual`) son **dos vistas independientes** (presentación desacoplada) que comparten el motor `useBudgetDashboardPage` vía composables finos (`useBudgetView` / `useMonthlyCloseView`); no se reintroduce una vista única por modos.
9. Presupuesto se lee como una sola superficie: page head + context bar (Año fiscal · Titularidad · Tipo de partida · Vista · Importes) + hero (balance previsto + tasa de ahorro + 3 KPIs | year-strip) + tabla jerárquica `bdg-row` (categoría → subcategoría → partidas) con barra de ejecución, columna Evol. (sparkline), cobertura YTD, gráfico de evolución y rollup. La pestaña Sugerencias muestra los ajustes derivados con acciones Aplicar/Ignorar deshabilitadas (aún sin backing en el motor).
10. Cierre mensual se lee como un flujo de 4 pasos: page head `Cierre · {mes}` + context bar (Mes · Titularidad) + `AStepper` (Liquidez/Ingresos/Gastos/Resultado, clicables) + `MonthlyCloseHero` (residual grande + variación de liquidez + 3 KPIs) + contenido del paso activo (conciliación con chips de estado). Se preserva toda la funcionalidad real del cierre (check-ins, coverage, ajuste manual, lock/reopen/finalize, severidad del residual) reskineada a Direction A.
11. Contabilidad (`/contabilidad`) es exclusivamente operativa: resumen de resultados/revisión, filtros compartibles, libro agrupado por fecha y alta/edición contextual. Saldos, composición y evolución viven en Patrimonio; el catálogo vive en `/contabilidad/cuentas`. `Debe`/`Haber` queda reservado al detalle del asiento y, al filtrar por cuenta, el importe expresa su variación.
12. Patrimonio conserva la valoración mensual para Total y ofrece saldo contable diario para Operativo. Operativo se limita a posiciones vinculadas a contabilidad; las posiciones manuales no se interpolan para aparentar granularidad diaria. El rango temporal permite presets y una selección exacta desde/hasta.
13. Mi Plan (`/plan`) absorbe el antiguo Estado financiero del SaaS: el diagnóstico vive en cimientos, hallazgos y recomendaciones Core-backed; `/estado-financiero` y `/estado-financiero/ambitos/:phaseId` son redirects compatibles.
14. Los antiguos ámbitos del Estado financiero ya no tienen pantalla propia en SaaS. Si en el futuro se reintroduce una lectura por ámbitos, debe nacer desde `core.plan` y no desde el dominio retirado `guide/`.
15. El cierre transversal de Direction A deja una librería de primitivas compartidas en `@/domains/ui`; antes de crear markup/CSS local para botones, selects, heroes, estados o KPI bands, hay que intentar composición sobre esas primitivas.
16. Si un control necesita comportamiento especial y no puede ser `ASelect` (por ejemplo un rango de fechas), debe seguir el mismo lenguaje visual del resto de filtros: mismo trigger, mismo borde/radio, misma tipografía y mismo tratamiento del popover.
17. Mi Plan sigue el patrón de vista principal de Patrimonio y Movimientos: una única cabecera y pestañas sticky `Resumen`, `Trayectoria` y `Decisiones`, sincronizadas con la URL. El Resumen absorbe el diagnóstico completo (hero con causas, progreso de capital, recomendaciones y cimientos a 0 clicks); la simulación de decisiones debe ser visible desde la cabecera y desde su pestaña; los acontecimientos se agrupan por intención, no en una secuencia vertical indiferenciada.
18. Los estados de escenarios se expresan con chips semánticos discretos (`draft`, `accepted`, `discarded`) dentro de una fila completa navegable. El chip informa; no sustituye el enlace ni añade una acción competidora.

## Styling Rules
1. Do not introduce inline styles unless there is a clear, temporary reason.
2. Favor shared classes, tokens, and reusable patterns.
3. Keep shadows, borders, and accent colors restrained.
4. Avoid saturated colors, thick borders, and decorative effects that reduce trust or readability.

## Interaction and States
1. Loading: visible and non-blocking where possible.
2. Empty: explicit explanation and next action.
3. Error: clear message, no hidden failures.
4. Success: concise positive feedback.
5. Filters and drilldowns should preserve user context whenever possible.
6. Responsive changes should adapt hierarchy, not just stack everything mechanically.
7. **PWA update toast:** cuando hay una versión nueva del service worker, se muestra un toast
   Direction A fijo abajo-centro (`PwaUpdatePrompt`, tokens `--bg`/`--line-strong`/`--accent`) con
   acción primaria **Actualizar** y secundaria **Después**. No autorecarga: el usuario decide
   cuándo recargar para no perder estado de formularios.
8. **Standalone (instalada):** la app arranca en modo `standalone` con `theme_color`/`background_color`
   `#0c0d10` (Direction A oscuro). El shell topbar/footer debe seguir siendo coherente sin la barra
   del navegador.
9. **PWA install banner:** banner proactivo descartable abajo-centro (`PwaInstallPrompt`, mismas
   primitivas que el update toast) que reduce la fricción de instalación. En Android/escritorio
   captura `beforeinstallprompt` y ofrece **Instalar**; en iOS Safari (sin evento) muestra la
   mini-guía "Compartir → Añadir a pantalla de inicio". Se oculta si ya está instalada (`standalone`)
   y se recuerda el descarte 30 días en `localStorage`.
10. **Indicador "sin conexión" (offline):** `OfflineBanner` (basado en `useOnlineStatus`) muestra un
    aviso Direction A discreto abajo-centro cuando se pierde la red y desaparece al volver. Es
    indicativo (no bloquea acciones). El shell sigue navegando offline gracias al precache del SW
    (Fase 1) y a las fuentes Geist auto-hospedadas; los datos en vivo de `/api` no se cachean.

## Responsive System
1. **Target:** the layout must stay usable and intentional from `360px` (small modern phone) up to wide desktop. `360px` is the minimum supported width; never let primary content overflow horizontally below it.
2. **Two query mechanisms, one decision rule:**
   - **View content** (everything rendered inside `.dir-a .page`) responds with `@container page (...)`. The `page` container is `.dir-a` (`container-type: inline-size`), so view CSS reacts to the available content width, not the raw viewport.
   - **Global shell** (topbar, mobile nav, footer, account menu in `app.css`) responds with `@media (...)` because it lives outside the `page` container.
3. **Canonical breakpoints.** Use these values; do not invent new intermediate cutoffs unless a specific layout genuinely needs one (document it if so):

   | Token | Width   | Mechanism      | Intent                                                            |
   | ----- | ------- | -------------- | ----------------------------------------------------------------- |
   | `lg`  | 1180px  | `@container`   | Roomy desktop → reduce density, 3-col → 2-col, relax padding.     |
   | `md`  | 820px   | `@container`   | Tablet → major collapse: side-by-side → stacked, 2-col → 1-col.   |
   | `sm`  | 560px   | `@container`   | Phone → single column, data tables become cards, hide secondary.  |
   | `xs`  | 400px   | `@container`   | Small phone (covers 360 target) → final spacing/typography trims. |

4. CSS query conditions **cannot** read `var()`, so these are a documented convention of literal pixel values, not CSS custom properties. Keep them consistent; consolidate stray values (900/920/980/600/620/520…) toward the nearest canonical token when touching a file.
5. **Shell exceptions:** the topbar switches from desktop horizontal navigation to a fixed bottom tab bar at `@media (max-width: 960px)` (driven by horizontal nav width, not content) and trims brand/account labels at `@media (max-width: 520px)`. The hamburger drawer is not used for primary product sections; `/account` and `/data` remain in the account menu. These are intentional shell-specific cutoffs.
6. Responsive changes must adapt hierarchy (reflow, promote/demote, collapse), not just stack everything mechanically. Wide data tables should degrade to a card/stacked layout under `sm`, keeping `overflow-x:auto` only as a fallback.

## Review Checklist
1. Is the primary task obvious within a few seconds?
2. Is the visual hierarchy clearer than before?
3. Does the screen match the rest of the product?
4. Is the flow simpler, not just prettier?
5. Are desktop and mobile both intentionally designed?
6. Are loading, empty, error, and success states covered?

## Workflow Reference
1. For iterative UX implementation from zero context, use:
   - `docs/frontend/frontend-ux-iteration-playbook.md`
2. For the minimum shared pattern contract, use:
   - `docs/frontend/frontend-visual-contract.md`
3. For the SaaS-only Direction A foundation, use:
   - `frontend/src/styles/design-system.css`
