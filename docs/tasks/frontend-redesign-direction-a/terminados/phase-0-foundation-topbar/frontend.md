# Fase 0 — Fundación del Design System "Direction A" + Topbar

## Title

Fundación visual (tokens Geist/oklch) y migración del shell a topbar, sin regresión.

## Context

El handoff en `handoff/` define el sistema visual "Direction A" (superficie plana, header DSL,
context bars, paleta semántica oklch, tipografía Geist/Geist Mono, navegación superior). Los
`.jsx`/`.html` del handoff son **prototipos de diseño, no código de producción**: hay que
reimplementarlos sobre el Vue existente (`frontend/`) preservando toda la funcionalidad.

Antes de portar pantallas hay que asentar tokens, fuentes y navegación. El `handoff/tokens.css`
ya está **namespaced bajo `.dir-a`**, por lo que el sistema convive con el `app.css` actual sin
romper las vistas todavía no portadas. La migración es **pantalla a pantalla**: en esta fase solo
cambia el chrome de navegación (sidebar → topbar) y la fundación; las vistas de contenido quedan
visualmente intactas.

**Restricción dura:** no perder funcionalidad. **Solo se tocan `<template>` y CSS, nunca
composables/stores/api/lógica.** Cualquier duda funcional se confirma antes de tocar.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope:
   - Nuevo `frontend/src/styles/design-system.css` con el bloque `.dir-a` de `handoff/tokens.css`,
     importado una sola vez (vía `main.ts` o `app.css`). No editar los tokens globales actuales;
     conviven bajo el namespace.
   - Fuentes Geist / Geist Mono (`@font-face` o link a Google Fonts:
     `Geist:wght@300..800&family=Geist+Mono:wght@400..600`) en `index.html` o CSS, con fallback
     `system-ui`.
   - `frontend/src/shell/AppShellLayout.vue`: sustituir el `<aside>` sidebar por una topbar
     horizontal (`.topbar` = brand "TA" + `.topnav-list` con los 5 `navItems` + `.topnav-right`
     con buscar/notif/menú de cuenta).
   - Montar el wrapper `.dir-a` en `.ui-shell-content` / `<main>` para que las vistas portadas
     hereden tokens y tipografía.
2. Out of scope:
   - Cambiar la lógica de `useAppShell.ts` o `appShellNav.ts` (labels, hints, rutas, handlers).
     Solo se permite el ajuste imprescindible para el render de la topbar.
   - Portar cualquier vista de contenido (eso es Fase 1+).
   - Cambiar el branding: se mantiene **"The Arkenstone / SaaS financiero"**. El "Moneyplanner/MP"
     del handoff es placeholder del prototipo y se ignora.

## Plan

1. Diagnosis:
   - Revisar `AppShellLayout.vue` y `useAppShell.ts`: `navItems`, `isNavItemActive`, menú de cuenta
     (`accountMenuOpen`, `toggleAccountMenu`, `logout`), `isSaasAdmin` (oculta la nav), responsive.
   - Revisar `app.css` (tokens/clases globales actuales) y `handoff/tokens.css` (bloque `.dir-a`).
2. Change implementation:
   - Crear `design-system.css` (todo namespaced `.dir-a`) e importarlo una vez.
   - Añadir fuentes Geist / Geist Mono con fallback.
   - Reescribir solo el `<template>` y los estilos del shell hacia topbar; **preservar intacta** la
     lógica de `useAppShell` (menú cuenta, logout, admin, responsive, cierre por Escape/click fuera).
   - Estado activo de nav: `.topnav-item.on` con `border-bottom: 1.5px solid var(--accent)`.
   - Montar `.dir-a` en el contenedor de contenido.
3. Validation: lint/format/typecheck verdes; vistas no portadas visualmente intactas; topbar
   operativa en todas las rutas; menú de cuenta, logout, vista admin (`isSaasAdmin` oculta nav) y
   responsive OK.

## Validation

List exact commands and expected outcomes.

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check` → sin errores
- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck` → sin errores
- Tests del shell: `frontend/src/shell/__tests__` en verde.
- Manual: navegar todas las rutas; menú de cuenta + logout + vista admin (`saas_admin`); responsive
  (móvil/desktop); las vistas no portadas se ven igual que antes.

## Required Documentation Updates

List every canonical doc that MUST be updated before closing this task.

- [x] `docs/frontend/frontend-visual-guide.md` — tokens, tipografía Geist, topbar
- [x] `docs/frontend/frontend-visual-contract.md` — clases base del sistema introducidas
- [x] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- Colisión de tokens globales con `.dir-a`: mitigado por el namespacing; no editar los tokens
  globales actuales.
- Pérdida de funciones del shell (admin, capabilities, responsive, cierre de menús): cubrir con el
  checklist manual de validación.
- La carga de fuentes rompe vistas no portadas: verificar fallback `system-ui` y FOUT aceptable.

## Completion Criteria

- [x] All validation commands pass
- [x] All required documentation updates done
- [x] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
