# PWA — Progressive Web App para el frontend SaaS

Convertir el frontend SaaS (`frontend/`, Vue 3.5 + Vite 7, servido estático por nginx) en una
**Progressive Web App** instalable y con resiliencia offline del shell, **sin romper la seguridad
multi-tenant** ni el flujo de auth por JWT.

## Estado

| Fase | Alcance | Estado |
| ---- | ------- | ------ |
| 1 | Instalable + rápida (manifest, iconos, service worker de precache del shell, toast de update) | ✅ completada (2026-06-23) |
| 2 | Resiliencia offline (fallback offline, fuentes auto-hospedadas, estados "sin conexión") | ✅ completada (2026-06-23) |
| 3 | (Futuro/opcional) Push notifications + background sync — requiere trabajo de backend Django | ⚪ no planificada |

v1 acordada = **Fases 1 + 2**. Orden de ejecución: 1 → 2.

## Restricciones de diseño (transversales a todas las fases)

1. **El service worker NUNCA cachea respuestas de API autenticadas.** Auth por JWT en `localStorage`
   (`src/domains/auth/session.ts`). Cachear `/api/*` filtraría datos entre sesiones/tenants y serviría
   datos rancios. Solo se precachea/runtime-cachea el **shell estático del propio origen**.
2. **`registerType: 'prompt'`** (no autorecarga): avisar al usuario cuando hay versión nueva y dejar
   que recargue. Evita perder estado de formularios a mitad de edición.
3. **Servido por nginx** (`frontend/nginx.prod.conf`, `Dockerfile.prod`): `sw.js` y
   `manifest.webmanifest` deben servirse con `Cache-Control: no-cache` (el SW no se debe cachear).
4. **HTTPS obligatorio** en producción (los SW solo corren en https o `localhost`).
5. **Coherencia visual Direction A**: `theme_color`/`background_color` del manifest y cualquier UI
   nueva (toast de update, banner offline) usan tokens `.dir-a`. Usar skill `frontend-system`.
6. Sugerencia: meter la PWA **detrás de un flag de build** (`VITE_PWA_ENABLED`) hasta validar en el
   piloto, para poder desactivarla sin revertir código.

## Herramienta

`vite-plugin-pwa` (Workbox) en modo `generateSW`. Versión compatible con Vite 7 (línea `1.x`).

## Decisiones resueltas (Fase 1)

- **Scope del SW**: `scope: '/'` (incluye la zona admin SaaS `/account`). El SW solo precachea el
  shell estático y no toca `/api/*`, por lo que incluir admin no implica cachear datos sensibles.
- **Iconos**: no había logo de origen, así que se generan **placeholders** programáticos (gema teal
  Direction A) con `frontend/scripts/generate-pwa-icons.mjs` → `frontend/public/icons/`
  (192/512/maskable + apple-touch + `icon.svg` favicon). Sustituir por el logo definitivo cuando exista.
- **Flag de build**: `VITE_PWA_ENABLED` (activada por defecto; `=false` la desactiva sin tocar código).
- **Registro/update**: `registerType: 'prompt'` + componente `PwaUpdatePrompt` montado en `App.vue`.
- **Install UX (refinamiento post-deploy)**: banner proactivo descartable `PwaInstallPrompt` para
  bajar la fricción de instalación — botón `beforeinstallprompt` en Android/escritorio y mini-guía
  "Compartir → Añadir a inicio" en iOS Safari. Se oculta en `standalone` y recuerda el descarte 30 días.
