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
5. Llegar a ≥80% statement coverage y ≥150 test methods.

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

Añadir tests para:
- **`assign_role` a usuario que ya tiene ese rol** → idempotente
- **`has_admin_role` con perfil no creado** → debe retornar False sin excepción
- **`get_or_create_access_profile` para superuser** → crea perfil ADMIN
- **`get_or_create_access_profile` para user normal** → crea perfil MEMBER
- **Número de admins: exactamente 1** → downgrade bloqueado
- **Número de admins: 2** → downgrade permitido
- **Número de admins: 0** (caso límite) → verificar que no puede ocurrir

### 5. `test_bootstrap.py` — ampliar cobertura

Tests existentes a migrar: `SaasAuthRoadmap03ApiTests` (subset Core integration).

Añadir tests para:
- **Bootstrap en registro — Core no disponible** → registro falla con error 503 o similar
- **Bootstrap en creación de admin — Core no disponible** → rollback en SaaS
- **Core Link manual con `ACCOUNT_LINKING_ENABLED=False`** → 403 con error descriptivo
- **Core Link via token — token ya consumido** → 400, replay protection
- **Core Link via token — token de otro usuario** → 400
- **Unlink — usuario sin link previo** → error o no-op consistente
- **`/me` — usuario con Core link muestra `core_linked: true`**
- **`/me` — usuario sin Core link muestra `core_linked: false`**

### 6. `test_audit.py` — añadir verificaciones de contenido

Tests existentes a migrar: `SaasAuthAuditAndThrottleTests`.

Añadir tests para:
- **Login exitoso** → evento `LOGIN_SUCCESS` con actor correcto
- **Registro exitoso** → evento `REGISTER_SUCCESS` con metadata de usuario
- **Cambio de rol exitoso** → evento `ROLE_CHANGE` con old_role y new_role en metadata
- **Eliminación de usuario** → evento `USER_DELETE`
- **Verificar que los eventos no tienen datos sensibles** (no passwords en metadata)

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
- ≥150 test methods en total
- Cobertura ≥80%

## Required Documentation Updates

- [ ] `docs/roadmap/saas-backend-refactor-roadmap.md` — marcar Phase 1 completada
- [ ] `docs/project-status.md` — actualizar estado de la tarea

## Risks

1. **`saas_access/tests.py` existe como módulo y como directorio a la vez**: eliminar el fichero original una vez que el directorio con `__init__.py` existe, o Django no reconocerá los tests del paquete.
2. **Tests de bootstrap con mock de Core**: verificar que `@patch('saas_access.core_bootstrap.requests.post')` sigue funcionando correctamente con la nueva estructura de ficheros.
3. **Tests de throttling**: los tests de declaración de scope son suficientes; no intentar saturar el servidor en tests automatizados.

## Completion Criteria

- [ ] `saas_access/tests.py` eliminado; reemplazado por `saas_access/tests/` con 5 ficheros
- [ ] ≥150 test methods en total
- [ ] Todos los endpoints tienen happy path + auth failure + validation error
- [ ] Bootstrap failure path cubierto con mock
- [ ] `python manage.py test saas_access` pasa sin errores
- [ ] `ruff check .` y `mypy .` limpios
- [ ] Spec movida a `terminados/`
- [ ] Commit: `test(saas): expand coverage baseline for backend refactor`
