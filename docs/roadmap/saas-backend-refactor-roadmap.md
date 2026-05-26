# Roadmap: backend refactor (SaaS) - professional coverage and clean architecture

## Aim
Llevar el backend SaaS a un nivel profesional de mantenibilidad y cobertura de tests,
preparing it for production. No functional behavior or API contract changes.

## Actual status (2026-03-18)

### Inventory by module

| Module | Main surface | Code lines | Test lines | Est coverage |
|--------|---------------------|---------------|--------------|----------------|
| `saas/` | Auth views, admin views, services, settings, URLs | ~1,070 | — | Baja |
| `saas_access/` | Models, permissions, services, bootstrap, tests | ~779 | 447 | ~24% |
| **Total** | | **~1,849** | **447** | **~24%** |

### Hotspots detectados

| Archive | Lines | Risk | Reason |
|---------|--------|--------|--------|
| `saas/auth_views.py` | 319 | Medium | Business logic mixed with HTTP |
| `saas_access/tests.py` | 447 | High | Single file, ~24% coverage, no separation by domain |
| `saas/auth_services.py` | 95 | Medium | Incomplete; part of the logic follows in views |

### Feature ya estable
- Login JWT, token refresh, registro, `/me`, `/mode`
- Throttling por scope
- Audit log de eventos auth
- Suscripciones (trial por defecto)
- RBAC: `saas_admin` / `saas_member`, last admin protection
- Admin CRUD: users, roles, status, metrics
- Core integration: automatic bootstrap, manual linking, token linking

## Principios de trabajo
1. Small, reversible PRs with clear scope.
2. Sin cambios de comportamiento no intencionales.
3. Primero cobertura de tests; luego refactor estructural.
4. Cada fase deja el backend ejecutable y con todos los tests en verde.
5. Validation within Docker.

## Alcance
1. `saas/` — auth views, admin views, services, settings
2. `saas_access/` — models, permissions, services, bootstrap, tests

## Fuera de alcance
1. Product changes (new endpoints, billing, dynamic capabilities).
2. Frontend SaaS.
3. Infraestructura y deployment.

## Fases activas

| Phase | Title | Spec | State |
|------|--------|------|--------|
| 1 | Test coverage baseline (≥80%) | `docs/tasks/backend-refactor/terminados/phase-1-test-coverage-baseline/backend.md` | ✅ |
| 2 | Thin views (extraction from business to services) | `docs/tasks/backend-refactor/terminados/phase-2-thin-views/backend.md` | ✅ |
| 3 | Canonical exception handler | `docs/tasks/backend-refactor/terminados/phase-3-error-standardization/backend.md` | ✅ |

## Detalle de fases

### Fase 1 — Test coverage baseline
**Goal:** Go from ~24% to ≥80% coverage. Safety net before moving code.

Trabajo:
- Reorganizar `saas_access/tests.py` en paquete `saas_access/tests/` con ficheros por dominio:
  - `test_auth.py`, `test_admin.py`, `test_rbac.py`, `test_bootstrap.py`, `test_audit.py`
- Añadir error paths: bootstrap failure, duplicate register, invalid tokens
- Añadir edge cases: last-admin protection, subscription state, throttle scopes
- Target: ≥80% statement coverage per affected module and all critical endpoints covered with happy path, auth failure and validation/error path.

Actual status 2026-03-18:
- Completada
- `saas_access/tests.py` reemplazado por paquete `saas_access/tests/`
- `create_saas_user()` ahora hace rollback real cuando falla el bootstrap Core
- Validation in Docker: `python manage.py test saas_access --keepdb --noinput`, `ruff check .`, `ruff format --check .`, `mypy .`
- Coverage measurement: 138 tests, 96% total on `saas` + `saas_access`

### Fase 2 — Thin views
**Purpose:** Views as pure HTTP adapters; business in services.

Trabajo:
- `auth_views.py` (319 → ≤150 lines): extract to `auth_services.py`:
  - `register_saas_user()`
  - `build_me_payload()`
  - `link_core_account()` / `unlink_core_account()`
  - `link_core_account_by_token()`
- `admin_views.py` (164 → ≤100 lines): delegate completely to `rbac_services.py`
- Añadir unit tests para funciones extraídas

Status real 2026-03-18:
- Completada
- `auth_views.py` reducido a 122 líneas y `admin_views.py` a 96 líneas
- Views de account linking separadas en `saas/auth_link_views.py`
- Lógica de auth movida a `saas/auth_services.py` y lógicas admin a `saas_access/rbac_services.py`
- Validación en Docker: `python manage.py test saas_access --keepdb --noinput`, `ruff check .`, `ruff format --check .`, `mypy .`

### Fase 3 — Exception handler canónico
**Objetivo:** Contrato de error `{code, message, details}` en todos los endpoints.

Trabajo:
- Crear `saas/exception_handler.py` equivalente a `core/config/exceptions.py`
- Registrar en `REST_FRAMEWORK.EXCEPTION_HANDLER` en settings
- Añadir contract tests para shapes de error en todos los endpoints críticos
- Eliminar respuestas ad-hoc que no usen el contrato canónico

Status real 2026-03-18:
- Completada
- Handler canónico movido a `saas/exception_handler.py` y registrado en `REST_FRAMEWORK.EXCEPTION_HANDLER`
- Todos los error paths del backend SaaS responden con `{code, message, details}`
- El account linking deja de emitir responses manuales ad-hoc y entra por el mismo pipeline de excepciones
- Contract tests añadidos para 400, 401, 403, 404, 405 y 429, preservando `Retry-After` en throttling

## Secuencia de ejecución
1. Fase 1 (test baseline) — prerrequisito de seguridad
2. Fase 2 (thin views) — depende de Fase 1
3. Fase 3 (error handler) — depende de Fase 2

## Matriz de validación por PR (Docker)

```bash
# Calidad
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .

# Tests
docker compose exec saas_backend python manage.py test saas_access
```

## Checklist de PR de refactor

- [ ] Hay test de regresión para el comportamiento que se protege o mueve.
- [ ] No cambia el contrato API sin documentarlo.
- [ ] La lógica de negocio se mueve hacia services, no hacia views.
- [ ] El diff evita refactors cosméticos fuera de alcance.
- [ ] Validado con calidad y tests dentro de Docker.
- [ ] Commit con Conventional Commits.

## Definición de cobertura profesional
- ≥80% statement coverage por módulo
- 100% de endpoints con: happy path + auth failure + validation error
- Bootstrap failure cubierto con mock
- Todos los flujos de RBAC cubiertos (assign, protect, downgrade)
- Contract tests de error shape en todos los endpoints críticos

## Criterio de éxito
1. El backend SaaS pasa de ~24% a ≥80% de cobertura.
2. Las views son adaptadores HTTP; la lógica de negocio vive en services.
3. Todos los endpoints retornan errores con `{code, message, details}`.
4. Otra persona puede entender y modificar el backend sin contexto oral.
