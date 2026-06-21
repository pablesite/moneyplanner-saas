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
7. In Patrimonio, Direction A should read as one continuous surface: page head, context bar, hero, timeline, and balance table without lateral workspaces or nested analytics cards. The hero is a single row: big net-worth figure + delta (este mes / YTD) on the left, the structural SVG donut centered (hover updates its center), and two columns Activos / Pasivos on the right that cross-filter the timeline.
8. Presupuesto (`/presupuesto`) y Cierre mensual (`/cierre-mensual`) son **dos vistas independientes** (presentación desacoplada) que comparten el motor `useBudgetDashboardPage` vía composables finos (`useBudgetView` / `useMonthlyCloseView`); no se reintroduce una vista única por modos.
9. Presupuesto se lee como una sola superficie: page head + context bar (Año fiscal · Titularidad · Tipo de partida · Vista · Importes) + hero (balance previsto + tasa de ahorro + 3 KPIs | year-strip) + tabla jerárquica `bdg-row` (categoría → subcategoría → partidas) con barra de ejecución, columna Evol. (sparkline), cobertura YTD, gráfico de evolución y rollup. La pestaña Sugerencias muestra los ajustes derivados con acciones Aplicar/Ignorar deshabilitadas (aún sin backing en el motor).
10. Cierre mensual se lee como un flujo de 4 pasos: page head `Cierre · {mes}` + context bar (Mes · Titularidad) + `AStepper` (Liquidez/Ingresos/Gastos/Resultado, clicables) + `MonthlyCloseHero` (residual grande + variación de liquidez + 3 KPIs) + contenido del paso activo (conciliación con chips de estado). Se preserva toda la funcionalidad real del cierre (check-ins, coverage, ajuste manual, lock/reopen/finalize, severidad del residual) reskineada a Direction A.
11. Contabilidad (`/movimientos`) presenta los asientos con lenguaje operativo: cuenta/origen, destino cuando existe, categoría/subcategoría e impacto monetario. `Debe`/`Haber` queda reservado para el detalle avanzado; al filtrar por cuenta, el importe expresa la variación de esa cuenta.
12. Guía (`/guia`) presenta la ruta financiera como un strip de cinco fases con puntuaciones reales y grades A–E; el foco actual y los extremos (mayor tensión / mejor posicionada) preceden al mapa sin convertirlo en un dashboard de tarjetas.
13. El detalle de Guía (`/guia/fases/:phaseId`) conserva el mismo strip para mantener contexto y se organiza en una superficie a dos columnas: puntuación y palancas a la izquierda, diagnóstico contextual a la derecha. Los colores de grade explican estado y progreso; no son decoración ni sustituyen el texto.

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
