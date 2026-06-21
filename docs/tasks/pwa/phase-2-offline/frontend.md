# Fase 2 (PWA) — Resiliencia offline del shell

## Title

Hacer que la PWA funcione sin red para el shell: fallback de navegación offline, fuentes
auto-hospedadas y estados "sin conexión" en la UI, manteniendo la prohibición de cachear API.

## Context

Tras la Fase 1 (instalable + precache del shell), la app aún depende de la red para navegar y para
las fuentes (Geist por CDN de Google). Esta fase añade resiliencia offline **del shell** (no de los
datos): una pantalla de fallback cuando no hay red, fuentes servidas desde el propio origen
(cacheables por el SW) y feedback claro de "sin conexión" en las vistas. Depende de la Fase 1. Ver
`docs/tasks/pwa/README.md` para las restricciones transversales (sigue prohibido cachear `/api`).

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope:
   - **Navigation fallback offline**: cuando una navegación falla por red, servir un documento de
     fallback (app shell precacheado o página `offline.html` Direction A), con `navigateFallback` y su
     `navigateFallbackDenylist` (excluye `/api/*`).
   - **Auto-hospedar las fuentes Geist** (mover de la CDN de Google a `frontend/` y precachearlas) para
     que la tipografía no dependa de la red.
   - **Estado global "sin conexión"**: composable `useOnlineStatus` (eventos `online`/`offline`) +
     banner/indicador Direction A reutilizable; las vistas que dependen de datos muestran un estado
     "sin conexión" en lugar de spinners colgados o errores crudos.
   - Revisar estados loading/empty/error de las vistas ya portadas (Patrimonio) para degradar con
     gracia offline.
2. Out of scope:
   - Cachear datos de API o permitir trabajar con datos offline (no se cachea contenido autenticado).
   - Mutaciones offline / cola de reintentos (background sync → Fase 3).
   - Push notifications (Fase 3).

## Plan

1. Diagnóstico: revisar cómo se cargan hoy las fuentes (`index.html`, CDN), el patrón de estados
   loading/empty/error de las vistas Direction A, y la config Workbox de la Fase 1.
2. Implementación: self-host de fuentes + precache; `navigateFallback` + `offline.html`; composable de
   estado online + banner; integración de estados offline en las vistas.
3. Validación: simular offline en DevTools y verificar navegación con fallback, fuentes presentes y
   banners; reconfirmar que `/api` sigue yendo a red y no se cachea.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- `... npm run test` (vitest) → en verde (incluye test del composable `useOnlineStatus`)
- `... npm run build` → SW incluye fuentes y `offline.html` en el precache
- **Offline (DevTools → Network → Offline)**: recargar una ruta ya visitada muestra el shell; una ruta
  nueva muestra el fallback offline; las fuentes Geist se ven (no fallback del sistema); el banner
  "sin conexión" aparece y desaparece al volver la red.
- **Seguridad**: con SW activo, `/api/*` nunca se sirve desde cache (verificado en DevTools).

## Required Documentation Updates

- [ ] `docs/tasks/pwa/README.md` — marcar Fase 2 ✅
- [ ] `docs/frontend/frontend-visual-guide.md` — patrón del banner "sin conexión" y fallback offline
- [ ] `docs/frontend/frontend-visual-contract.md` — si el banner offline se vuelve primitiva reutilizable
- [ ] `docs/frontend/domain-map.md` — si se añade composable/clase compartida (`useOnlineStatus`)
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- **Fallback offline desincronizado**: una `offline.html` separada puede divergir del shell. Mitigación:
  preferir el fallback al app shell precacheado; si se usa `offline.html`, mantenerla mínima.
- **Fuentes auto-hospedadas pesadas**: subfijar/recortar pesos para no inflar el precache.
- **Falsos "sin conexión"**: `navigator.onLine` no garantiza conectividad real. Mitigación: tratar el
  banner como indicativo y no bloquear acciones solo por el flag.
- **Romper la regla de no-cache de API** al ampliar Workbox. Mitigación: tests/checklist de seguridad
  en cada cambio de config del SW.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests/build + prueba offline)
- [ ] Navegación con fallback offline funcional; fuentes Geist disponibles sin red
- [ ] Banner/estado "sin conexión" integrado en las vistas portadas
- [ ] El SW sigue **sin** cachear `/api/*` (verificado en DevTools)
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
