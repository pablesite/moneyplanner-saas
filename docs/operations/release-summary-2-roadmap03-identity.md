# Release Summary Hito 05 (Roadmap 03)

## Fecha
2026-02-17

## Alcance Del Hito
- Arquitectura de identidad separada completada:
  - `core` standalone con auth local.
  - `saas` con auth local propia + suscripcion premium.
- Linking opcional implementado en dos modos:
  - directo (`/api/auth/core-link/`)
  - token temporal one-time (`/api/auth/core-link/from-token/`).
- Endurecimiento de seguridad y operacion:
  - throttling por scope,
  - auditoria `auth.audit`,
  - metricas operativas separadas (`/api/auth/ops/metrics/`).

## Cambios Relevantes
- Core:
  - `GET /api/auth/mode/` con `exit_criteria` y `exit_ready`.
  - `GET /api/auth/link-token/` para token temporal de linking.
  - `GET /api/auth/ops/metrics/`.
  - Rotacion de refresh + blacklist + politica de password reforzada.
  - JWT con `ISSUER`/`AUDIENCE` propios de core.
- SaaS:
  - `POST /api/auth/register/`, `GET /api/auth/me/`, `GET /api/auth/subscription/`.
  - Premium gating por estado de suscripcion (`trial|active` permitido).
  - `POST/GET/DELETE /api/auth/core-link/`.
  - `POST /api/auth/core-link/from-token/` (one-time, anti-replay por `jti`).
  - `GET /api/auth/ops/metrics/`.
  - JWT con `ISSUER`/`AUDIENCE` propios de saas.

## Smoke Tests Ejecutados (Fase 7)
Core:
1. Crear usuario smoke local en core.
2. `POST /api/auth/token/` -> `200`.
3. `GET /api/auth/settings/` con bearer -> `200`.
4. `POST /api/auth/refresh/` -> `200`.
5. `GET /api/auth/mode/` -> `exit_ready=true`.
6. `GET /api/auth/ops/metrics/` -> `service=core`.

SaaS:
1. `POST /api/auth/register/` usuario smoke -> `201`.
2. `POST /api/auth/token/` -> `200`.
3. `GET /api/auth/me/` -> `200`.
4. `GET /api/auth/subscription/` -> `trial`, `premium_enabled=true`.
5. `GET /api/family-members/` con bearer saas -> `200`.
6. `POST /api/auth/refresh/` -> `200`.
7. `GET /api/auth/mode/` -> `exit_ready=true`.
8. `GET /api/auth/ops/metrics/` -> `service=saas`.

Separacion de identidad (validacion cruzada):
1. Token emitido por `core` contra endpoint protegido de `saas` -> `401`.

## Verificacion De Calidad Ejecutada
- `docker compose -f core/docker-compose.yml exec backend python manage.py test accounts`
- `docker compose exec saas_backend python manage.py test memberships`
- `docker compose -f core/docker-compose.yml exec backend ruff check accounts config/settings.py`
- `docker compose exec saas_backend ruff check memberships saas/*`
- `docker compose -f core/docker-compose.yml exec backend mypy accounts`
- `docker compose exec saas_backend mypy memberships saas`

## Estado De Cierre
- Fase 7: completada.
- Hito 05: validado funcionalmente para identidad separada `core`/`saas`.

## Riesgos Residuales
- En local se mantiene `DJANGO_SECRET_KEY` corta por defecto (warning de seguridad); recomendado definir secret robusta en `.env`.
- Pendiente futuro (fuera de Hito 05): automatizar dashboards visuales con origen en `/api/auth/ops/metrics/`.
