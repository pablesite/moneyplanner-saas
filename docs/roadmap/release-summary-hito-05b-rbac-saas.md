# Release Summary Hito 05B (RBAC SaaS + Acceso Cross-Stack)

## Fecha
2026-02-17

## Alcance Del Hito
- RBAC SaaS multirol implementado (`saas_admin`, `saas_member`) en backend y frontend.
- Endpoints administrativos SaaS operativos con permisos finos y auditoria.
- UX SaaS adaptada por rol (ruta admin protegida y visibilidad condicional).
- Interoperabilidad SaaS -> Core habilitada:
  - usuarios SaaS pueden consumir API de Core con JWT SaaS valido,
  - mapeo seguro de identidad externa sin colision de `user_id`.
- Onboarding funcional:
  - nuevos `saas_member` crean automaticamente su miembro primario de familia (`adult`) con titularidad individual.

## Entregables Cerrados Por Fase
1. Fase 5B.0:
- Matriz de roles/capacidades y contrato RBAC documentado.

2. Fase 5B.1:
- Modelo `SaasAccessProfile` + servicios RBAC (`assign_role`, guardias de ultimo admin).

3. Fase 5B.2:
- API admin SaaS:
  - `GET/POST /api/admin/users/`
  - `PATCH /api/admin/users/{id}/role/`
  - `PATCH /api/admin/users/{id}/status/`
  - `DELETE /api/admin/users/{id}/`
- Errores estables: `permission_denied`, `subscription_blocked`.

4. Fase 5B.3:
- `frontend`:
  - vista `AdminUsersView`,
  - guarda `requiresSaasAdmin`,
  - UX condicional por rol desde `Cuenta SaaS`.

5. Fase 5B.3B:
- `core` acepta JWT SaaS cuando `AUTH_ACCEPT_SAAS_TOKENS=1`.
- Modelo `ExternalIdentity` para mapear `provider + external_user_id -> user core`.
- Autoprovision de usuario local core al primer acceso SaaS.

6. Fase 5B.4:
- Auditoria admin estructurada:
  - `saas_admin_user_create`
  - `saas_admin_role_change`
  - `saas_admin_status_change`
  - `saas_admin_user_delete`
- Snapshot RBAC en `/api/auth/ops/metrics/`.
- Runbook actualizado con troubleshooting RBAC.

7. Fase 5B.5:
- Tests backend/frontend reforzados.
- Matriz de calidad ejecutada en contenedores.

## Evidencia De Validacion Ejecutada
- Backend SaaS:
  - `docker compose exec saas_backend python manage.py test memberships`
  - `docker compose exec saas_backend ruff check .`
  - `docker compose exec saas_backend mypy .`
- Frontend SaaS:
  - tests RBAC focalizados (`guard`, `AccountView`, `AdminUsersView`) en contenedor.
  - `docker compose exec saas_frontend npm run typecheck`
- Backend Core:
  - `docker compose exec backend python manage.py test accounts` (en `core/`)
  - smoke real: token SaaS contra `GET /api/auth/settings/` de Core -> `200`.

## Riesgos Residuales / Deuda Tecnica
- Existen fallos de calidad de baseline fuera del alcance funcional de 5B:
  - `lint` en frontends por reglas de complejidad en specs e2e legacy.
  - `format --check` en backend por archivos historicos ya existentes.
- Recomendacion:
  - abrir tarea de hardening de calidad para normalizar esos archivos y dejar `lint/format` completamente verdes en CI local.

## Estado Final
- Hito 05B: completado funcionalmente.
- DoD de 05B: satisfecho.
