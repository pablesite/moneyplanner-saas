# Fase 1 (PWA) — Instalable + rápida (app shell)

## Title

Hacer el frontend SaaS instalable como PWA: manifest, iconos, service worker de precache del shell y
aviso de actualización, sin tocar la capa de API.

## Context

El frontend (`frontend/`, Vue 3.5 + Vite 7) se sirve estático por nginx pero no es instalable ni
cachea su shell: cada carga depende de la red. Esta fase lo convierte en una PWA instalable
(móvil/escritorio) y de arranque rápido, **sin cachear API autenticada** (JWT en `localStorage`,
multi-tenant). Es la base de la Fase 2 (offline). Ver `docs/tasks/pwa/README.md` para las
restricciones transversales.

## Area

`frontend`

## Stack

`saas`

## Scope

1. In scope:
   - Añadir `vite-plugin-pwa` (Workbox, `generateSW`, `registerType: 'prompt'`) a `vite.config.ts`.
   - Web App Manifest: `name`/`short_name` "The Arkenstone", `display: standalone`,
     `theme_color`/`background_color` desde tokens `.dir-a`, `start_url: '/'`, `scope: '/'`, `lang`.
   - Set de iconos (192, 512, **maskable**) + `apple-touch-icon`. Placeholders si no hay logo origen.
   - Meta en `index.html`: `theme-color`, `apple-mobile-web-app-capable`,
     `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, link al manifest.
   - Service worker: **precache de los assets del build** (JS/CSS/HTML) + runtime
     `StaleWhileRevalidate` solo para estáticos del propio origen (imágenes/iconos).
   - **Exclusión explícita de `/api/*`** del runtime caching y de `navigateFallbackDenylist`.
   - Componente de aviso de actualización (toast Direction A) cableado a `onNeedRefresh`/`onOfflineReady`
     vía `registerSW` (virtual `virtual:pwa-register/vue`).
   - nginx (`nginx.prod.conf`): `sw.js` y `manifest.webmanifest` con `Cache-Control: no-cache`.
   - Flag de build `VITE_PWA_ENABLED` para activar/desactivar el plugin.
2. Out of scope:
   - Offline real de navegación / fallback offline (Fase 2).
   - Auto-hospedar fuentes (Fase 2).
   - Cualquier caching de datos de API (prohibido por diseño).
   - Push notifications / background sync (Fase 3).

## Plan

1. Diagnóstico: confirmar versión de `vite-plugin-pwa` compatible con Vite 7; revisar `index.html`,
   `vite.config.ts`, `main.ts` (punto de registro), `nginx.prod.conf` y el patrón de toasts/UI
   compartida para el aviso de update.
2. Implementación: plugin + manifest + iconos + meta + registro del SW con prompt + toast + headers
   nginx + flag de build.
3. Validación: build de producción, auditoría Lighthouse PWA (installable), verificación de que el SW
   no intercepta `/api`, y prueba de instalación en Chrome (escritorio) y Android.

## Validation

- `docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint` → sin errores
- `... npm run format:check` → sin errores
- `... npm run typecheck` → sin errores
- `... npm run test` (vitest) → en verde
- `... npm run build` → genera `sw.js` + `manifest.webmanifest` en `dist/`
- **Lighthouse (categoría PWA)**: "Installable" en verde; manifest e iconos válidos.
- **Comprobación de seguridad**: en DevTools → Application → Service Workers, confirmar que las
  peticiones a `/api/*` van siempre a red (no aparecen en Cache Storage).
- Instalación manual: "Instalar app" en Chrome escritorio y "Añadir a pantalla de inicio" en Android;
  arranca en modo `standalone` con el theme color correcto.

## Required Documentation Updates

- [ ] `docs/tasks/pwa/README.md` — marcar Fase 1 ✅ y fijar decisiones resueltas (scope, iconos)
- [ ] `docs/frontend/frontend-visual-guide.md` — nota del toast de actualización y comportamiento standalone
- [ ] `docs/operations/dev-setup.md` — cómo activar/desactivar la PWA (`VITE_PWA_ENABLED`) y servir el SW
- [ ] `docs/architecture/architecture.md` — mención del service worker y la política de no-cache de API
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

- **Fuga de datos por cache de API**: si Workbox cachea por error respuestas autenticadas, se filtran
  datos entre sesiones/tenants. Mitigación: denylist explícita de `/api/*`, sin runtime caching de
  API, y verificación en Cache Storage durante la validación.
- **SW cacheado por nginx/CDN**: un `sw.js` cacheado deja a los usuarios clavados en una versión.
  Mitigación: `Cache-Control: no-cache` para `sw.js`/manifest y `registerType: 'prompt'` con toast.
- **Estado perdido al actualizar**: autorecargar a mitad de edición. Mitigación: prompt manual, no recarga forzada.
- **Compatibilidad iOS**: sin `beforeinstallprompt`; install solo manual. Mitigación: meta apple-* y
  no depender del evento de install.

## Completion Criteria

- [ ] All validation commands pass (lint/format/typecheck/tests/build + Lighthouse installable)
- [ ] El SW **no** intercepta ni cachea `/api/*` (verificado en DevTools)
- [ ] App instalable en escritorio y Android, arranque `standalone` con theme Direction A
- [ ] Toast de actualización funcional (`onNeedRefresh`)
- [ ] All required documentation updates done
- [ ] Spec moved to `terminados/`
- [ ] Commit created (Conventional Commits)
