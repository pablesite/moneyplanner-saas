# PWA — Progressive Web App para el frontend SaaS

Convertir el frontend SaaS (`frontend/`, Vue 3.5 + Vite 7, servido estático por nginx) en una
**Progressive Web App** instalable y con resiliencia offline del shell, **sin romper la seguridad
multi-tenant** ni el flujo de auth por JWT.

## Estado

| Fase | Alcance | Estado |
| ---- | ------- | ------ |
| 1 | Instalable + rápida (manifest, iconos, service worker de precache del shell, toast de update) | ⚪ pendiente |
| 2 | Resiliencia offline (fallback offline, fuentes auto-hospedadas, estados "sin conexión") | ⚪ pendiente |
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

## Decisiones abiertas (confirmar antes/while implementando)

- **Scope del SW vs zona admin SaaS (`/account`, panel `isSaasAdmin`)**: ¿entra en el scope PWA o se
  excluye? Por defecto, scope `/` (incluye todo) salvo indicación.
- **Iconos**: hace falta el SVG/PNG de origen del logo "The Arkenstone" para generar el set
  (incluido **maskable**). En Fase 1 se usan placeholders si no está disponible.
