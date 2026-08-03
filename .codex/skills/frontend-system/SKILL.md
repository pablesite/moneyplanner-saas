---
name: frontend-system
description: Workflow for implementing or refining frontend UI in this repo with visual coherence across core and saas. Use when changing layouts, views, components, CSS, interaction flows, or UX behavior in frontend code.
---

# Frontend System

Use this skill when working on `core/frontend/` or `frontend/`.

## Goal

Keep the SaaS UI coherent across screens while respecting the current separation between `core` and `saas`.

## Required Read Order

1. `AGENTS.md`
2. `docs/frontend/frontend-visual-guide.md`
3. `docs/frontend/frontend-visual-contract.md`
4. `docs/frontend/frontend-ux-iteration-playbook.md`
5. `docs/frontend/frontend-css-workflow.md`

## Source Of Truth

1. **Primitivas antes que CSS.** La librería de componentes compartidos vive en `frontend/src/domains/ui` (barrel `@/domains/ui`). Es la primera parada: casi todo el chrome de una vista (botones, selects, cabeceras, estados, menús, modales, heroes) ya existe ahí. Ver la tabla de abajo.
2. El design system Direction A (tokens `.dir-a` y clases base: `.page`, `.sect`, `.btn`, `.input`, `.kpis`, `.a-state`, `.stepper`, `.context-bar`) vive en `frontend/src/styles/design-system.css`. Es el fichero canónico para patrones compartidos nuevos.
3. `frontend/src/styles/app.css` es la capa **legacy** (`ui-*`, `card`, `ui-pro-*`) más el shell global. No añadir ahí patrones Direction A nuevos; solo tocarlo para el shell (topbar, nav móvil, `--shell-bottom-inset`).
4. Trabajar directamente en `frontend/` cuando el scope sea SaaS.
5. Consultar `core/frontend/` solo como referencia visual o funcional cuando ayude a entender un flujo que consume APIs de Core. **`core/frontend/src/styles/app.css` no es fuente canónica del SaaS**: está congelado y no refleja Direction A.
6. No asumir espejo obligatorio con Core: cualquier adaptación del frontend SaaS se decide por producto SaaS, no por sincronización automática.

## Librería de primitivas (`@/domains/ui`)

Antes de escribir markup o CSS para cualquiera de estas cosas, usar la primitiva. El catálogo completo con props está en `docs/frontend/frontend-visual-contract.md`.

| Necesitas | Usa | No escribas |
| --- | --- | --- |
| Botón | `AButton` (`variant`, `size`, `loading`) | `<button class="btn btn-ghost">` |
| Select | `ASelect` (obligatorio, también en formularios) | `<select>` nativo |
| Cabecera de página | `APageHead` | `.page-head` a mano |
| Cabecera de sección | `ASectHead` (`eyebrow`/`title`/`subtitle`, slots `#hint`/`#actions`) | `<div class="sect-head">` a mano |
| Loading / empty / error / success | `AState` (`status`, `layout="inline"` o `"panel"`) | clases de estado propias del dominio |
| Confirmación de éxito | `AToast` | avisos inline ad-hoc |
| Menú de acciones (fila o página) | `ARowMenu` | popover propio + listener de click fuera |
| Indicador de colapso | `AChevron` + `useCollapsibleGroups` (`@/lib`) | `Set` propio + texto "Ver/Ocultar" |
| Hero + KPIs | `AHero` + `AKpiBand` | `.hero-*` a mano |
| Modal | `BaseModal` | chrome de modal propio |
| Chip semántico, pill, hint, stepper, donut, sparkline, rango de fechas | `AKindChip`, `AMetaPill`, `AInfoHint`, `AStepper`, `ADonut`, `ASparkline`, `ADateRange` | equivalentes locales |

Helpers (no son componentes): `@/lib/format` (`formatMoney`, `formatNumber`, `formatPct`, `currencySymbol`…), `@/lib/dates`, `@/lib/useCollapsibleGroups`. Preferirlos sobre reimplementaciones locales.

Crear una primitiva nueva solo si ≥2 pantallas la usarían, y documentarla en el visual-contract.

## Workflow

1. Antes de tocar cualquier fichero, localizar la vista o componente equivalente dentro de `frontend/` y revisar el shell y las primitivas compartidas del SaaS.
2. Recorrer la tabla de primitivas de arriba contra lo que vas a construir. Lo que ya exista, se consume; no se reimplementa.
3. Define the UX problem in terms of:
   - page structure,
   - interaction model,
   - visual hierarchy,
   - loading/empty/error/success states.
4. Prefer changing shared primitives and shared classes over adding per-view styling.
5. Reuse the visual contract classes before creating new variants.
6. Avoid local CSS when a shared class or token can solve the issue.
7. If a new pattern is genuinely reusable, add it to `frontend/src/styles/design-system.css` (bajo `.dir-a`) o promuévelo a primitiva en `frontend/src/domains/ui`, y documéntalo en `docs/frontend/frontend-visual-contract.md`.

## Rules

1. Do not introduce inline `style=` in Vue templates.
2. Do not add new `<style scoped>` blocks unless there is a clear component-isolation reason and the change cannot live in shared styles.
3. Prefer tokens and shared classes over hardcoded spacing, widths, and radii.
4. Keep one clear primary action per screen context where possible.
5. Cover loading, empty, error, and success states when touching a user flow.

## Review Checklist

1. ¿La vista reimplementa algo que ya existe en `@/domains/ui` o en `@/lib`? Grep de control antes de cerrar:
   - `<button` con `class="btn` → debería ser `AButton`
   - `class="sect-head"` a mano → debería ser `ASectHead`
   - clases de estado propias del dominio (`*-empty`, `*-muted`, `*-inline-error`) → debería ser `AState`
   - `Set` propio para colapsar grupos → debería ser `useCollapsibleGroups` + `AChevron`
2. Does the page use the shared page shell and section patterns when applicable?
3. Is the layout rhythm consistent with surrounding screens?
4. Are typography and spacing driven by shared classes or tokens?
5. ¿Los elementos anclados abajo usan `--shell-bottom-inset` en vez de números mágicos?
6. ¿La solución respeta los patrones compartidos del SaaS sin depender de un espejo manual con Core?
7. Are Docker validations run for the affected frontend stack?
