# SaaS backend — Phase 1: Test coverage baseline

## Title
SaaS backend — test coverage baseline (prerequisito de refactor)

## Context
El backend SaaS tiene ~1,849 líneas de código de producción y solo 447 líneas de tests
consolidados en un único fichero `saas_access/tests.py` (~24% de cobertura). Esta
cobertura es insuficiente para un backend que gestiona autenticación, RBAC y acceso al
producto en producción. Antes de cualquier refactor estructural, necesitamos una red de
seguridad que cubra ≥80% de cada módulo, con todos los endpoints probados y los flujos
críticos protegidos por tests de error path.

Esta fase no cambia comportamiento funcional.

## Area
`backend`

## Stack
`saas`

## Scope

### En scope
1. Reorganizar `saas_access/tests.py` en ficheros de dominio.
2. Añadir tests para todos los error paths (bootstrap failure, duplicate register,
   invalid tokens, throttling, unauthorized access).
3. Añadir tests para flujos de Core integration (success + failure).
4. Añadir edge cases en RBAC, audit y suscripciones.
5. Llegar a ≥80% statement coverage en los módulos afectados y cubrir los endpoints/flujos críticos con tests explícitos.

### Fuera de scope
1. Cualquier cambio de código de producción.
2. Cambios de contrato API.

## Plan

### 1. Nueva estructura de tests

Crear `saas_access/tests/` como paquete y mover tests existentes:

```
backend/saas_access/tests/
  __init__.py
  test_auth.py         ← login, register, /me, token refresh, mode endpoint, subscription
  test_admin.py        ← admin CRUD, role/status changes, ops metrics
  test_rbac.py         ← role assignment, last-admin protection, profile creation
  test_bootstrap.py    ← Core integration: success, failure, linking flows
  test_audit.py        ← audit event creation and content verification
```

**Regla de migración**: mover sin alterar los tests existentes; solo añadir tests nuevos.

### 2. `test_auth.py` — ampliar cobertura

Tests existentes a migrar: `SaasAuthRoadmap03ApiTests` (subset auth).

Añadir tests para:
- **Login correcto** → 200, tokens presentes, refresh válido
- **Login con credenciales inválidas** → 401, shape `{code, message}`
- **Login con usuario inactivo** → 401
- **Registro con email ya existente** → 400, shape `{code, message, details}`
- **Registro con password débil** → 400 (si hay validación)
- **Token refresh con refresh_token caducado** → 401
- **`/me` sin autenticación** → 401
- **`/me` con usuario sin SaasAccessProfile** → debe crear perfil on-demand o 500 controlado
- **`/subscription/` sin autenticación** → 401
- **`/mode/` sin autenticación** → debe ser público (verificar)
- **Throttling**: verificar que los scopes están declarados (no requiere saturar el servidor)

### 3. `test_admin.py` — ampliar cobertura

Tests existentes a migrar: `SaasAdminUsersApiTests`.

Añadir tests para:
- **Listar usuarios como saas_member** → 403
- **Crear usuario con email ya existente** → 400
- **Crear usuario — Core bootstrap falla** → rollback en SaaS (no queda usuario sin Core)
- **Cambiar rol a admin cuando ya hay otro admin** → 200
- **Cambiar rol a member del único admin** → 400, error descriptivo
- **Desactivar usuario no admin** → 200
- **Desactivar el único admin activo** → 400
- **Eliminar usuario con datos** → 200 (verificar cascade si aplica)
- **`/ops/metrics/` como saas_member** → 403

### 4. `test_rbac.py` — ampliar cobertura

Tests existentes a migrar: `SaasRbacServicesTests`.

Add tests for:
- **`assign_role` to user who already has that role** → idempotent
- **`has_admin_role` with profile not created** → must return False without exception
- **`get_or_create_access_profile` para superuser** → crea perfil ADMIN
- **`get_or_create_access_profile` para user normal** → crea perfil MEMBER
- **Number of admins: exactly 1** → downgrade blocked
- **Number of admins: 2** → downgrade allowed
- **Number of admins: 0** (limiting case) → verify that it cannot occur

### 5. `test_bootstrap.py` — ampliar cobertura

Tests existentes a migrar: `SaasAuthRoadmap03ApiTests` (subset Core integration).

Add tests for:
- **Bootstrap en registro — Core no disponible** → registro falla con error 503 o similar
- **Bootstrap in admin creation — Core not available** → rollback in SaaS
- **Core Link manual con `ACCOUNT_LINKING_ENABLED=False`** → 403 con error descriptivo
- **Core Link via token — token ya consumido** → 400, replay protection
- **Core Link via token — another user's token** → 400
- **Unlink — user without previous link** → error or consistent no-op
- **`/me` — user with Core link shows `core_linked: true`**
- **`/me` — user without Core link shows `core_linked: false`**

### 6. `test_audit.py` — add content checks

Tests existentes a migrar: `SaasAuthAuditAndThrottleTests`.

Add tests for:
- **Login exitoso** → evento `LOGIN_SUCCESS` con actor correcto
- **Successful registration** → event `REGISTER_SUCCESS` with user metadata
- **Cambio de rol exitoso** → evento `ROLE_CHANGE` con old_role y new_role en metadata
- **User deletion** → event `USER_DELETE`
- **Verify that the events do not have sensitive data** (no passwords in metadata)

### 7. Medir cobertura

```bash
docker compose exec saas_backend \
  python -m pytest --cov=saas --cov=saas_access \
    --cov-report=term-missing --cov-fail-under=80 \
  || python manage.py test saas_access
```

## Validation

```bash
# 1. Suite completa pasa
docker compose exec saas_backend python manage.py test saas_access

# 2. Calidad
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .
```

Resultados esperados:
- `manage.py test saas_access` → 0 errores, 0 fallos
- `ruff check` → sin errores
- `mypy` → sin errores
- Cobertura ≥80%
- All critical endpoints covered with relevant happy path + auth failure + validation/error path

## Required Documentation Updates

- [x] `docs/roadmap/saas-backend-refactor-roadmap.md` — marcar Phase 1 completada
- [x] `docs/project-status.md` — update task status

## Risks

1. **`saas_access/tests.py` exists as a module and as a directory at the same time**: delete the original file once the directory with `__init__.py` exists, or Django will not recognize the package tests.
2. **Tests de bootstrap con mock de Core**: verificar que `@patch('saas_access.core_bootstrap.requests.post')` sigue funcionando correctamente con la nueva estructura de ficheros.
3. **Throttling tests**: scope declaration tests are sufficient; Do not try to overwhelm the server with automated tests.

## Completion Criteria

- [x] `saas_access/tests.py` eliminado; reemplazado por `saas_access/tests/` con 5 ficheros
- [x] Coverage ≥80% in affected modules (`saas` + `saas_access`)
- [x] All critical endpoints have relevant happy path + auth failure + validation/error path
- [x] Bootstrap failure path cubierto con mock
- [x] `python manage.py test saas_access --keepdb --noinput` pasa sin errores
- [x] `ruff check .`, `ruff format --check .` y `mypy .` limpios
- [x] Spec movida a `terminados/`
- [ ] Commit: `test(saas): expand coverage baseline for backend refactor`

## Resultado real

- Suite reorganizada en `backend/saas_access/tests/` por dominios: auth, admin, RBAC, bootstrap y audit.
- Cobertura medida en Docker con `coverage.py`: 138 tests y 96% total sobre `saas` + `saas_access`.
- Added explicit protection for actual rollback in SaaS registration when bootstrap Core fails.
- Se cubrieron helpers de bootstrap, permissions, settings helpers, audit persistence, linking y contratos de error.
