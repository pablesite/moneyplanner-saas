# SaaS backend — Phase 2: Thin views

## Title
SaaS backend — extraction of business logic to services (thin views)

## Context
`saas/auth_views.py` has 319 lines and mixes HTTP logic (input validation,
dispatch, response) with business logic (registration flow orchestration, linking
Core account, construction of the `/me` payload). This mix makes the services
difficult to test in isolation and the views are difficult to read. The goal
es que cada view sea un adaptador de HTTP puro: valida la request, delega al service, y
retorna la respuesta serializada.

**Prerequisito:** Phase 1 completada (cobertura ≥80% garantiza que el refactor no rompe comportamiento).

## Area
`backend`

## Stack
`saas`

## Scope

### En scope
1. Extract business logic from `auth_views.py` to `auth_services.py`.
2. Extract business logic from `admin_views.py` to `rbac_services.py` where appropriate.
3. `auth_views.py` ≤ 150 lines upon completion.
4. `admin_views.py` ≤ 100 lines upon completion.
5. Add unit tests for functions extracted to services.
6. Verificar que todos los tests de API siguen pasando sin cambios.

### Fuera de scope
1. API contract changes (endpoints, response shapes, error codes).
2. Cambios en models, serializers o URLs.
3. Phase 3 logic (exception handler).

## Plan

### 1. Diagnosis: map logic to extract from `auth_views.py`

Review each class/function in `auth_views.py` and identify which logic is not HTTP:

| View / method | Logic to extract | Destination |
|---------------|-----------------|---------|
| `SaasRegisterAPIView.post` | User creation + bootstrap + subscription creation + RBAC profile creation | `auth_services.register_saas_user()` |
| `SaasMeAPIView.get` | Construcción del payload (user + role + subscription + link status) | `auth_services.build_me_payload()` |
| `SaasCoreAccountLinkAPIView.post` | Validation + linking + replay management | `auth_services.link_core_account()` (`SaasCoreAccountLink` already exists; expand) |
| `SaasCoreAccountUnlinkAPIView.post` | Unlink + audit | `auth_services.unlink_core_account()` |
| `SaasCoreLinkByTokenAPIView.post` | Token verification + linking | `auth_services.link_core_account_by_token()` |

### 2. Extraer a `auth_services.py`

Crear / ampliar `saas/auth_services.py` con las funciones identificadas:

```python
def register_saas_user(*, email: str, password: str) -> tuple[User, SaasSubscription]:
    """Crea usuario, perfil RBAC, suscripción trial y dispara Core bootstrap.
    Lanza ValidationError si el email ya existe.
    Lanza CoreBootstrapError si el Core no responde.
    """
    ...

def build_me_payload(*, user: User) -> dict:
    """Construye el payload para GET /api/auth/me/."""
    ...

def link_core_account(*, user: User, core_username: str, core_password: str) -> SaasCoreAccountLink:
    """Vincula cuenta Core via credenciales directas."""
    ...

def unlink_core_account(*, user: User) -> None:
    """Desvincula cuenta Core del usuario."""
    ...

def link_core_account_by_token(*, user: User, token: str) -> SaasCoreAccountLink:
    """Vincula cuenta Core via token firmado. Verifica replay protection."""
    ...
```

### 3. Actualizar `auth_views.py`

Cada view queda como:
```python
class SaasRegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, subscription = register_saas_user(**serializer.validated_data)
        return Response({"message": "registered"}, status=201)
```

### 4. Revisar `admin_views.py`

`admin_views.py` (164 lines) already delegates enough to `rbac_services.py`. Verify that:
- No hay queries directas al ORM en las views
- All business validation (last-admin check) is in `rbac_services.py`
- If there is residual business logic, move it to `rbac_services.py`

Target: `admin_views.py` ≤ 100 lines.

### 5. Add unit tests for extracted services

En `saas_access/tests/test_auth.py` o nuevo `saas_access/tests/test_auth_services.py`:

```python
class RegisterSaasUserServiceTests(TestCase):
    def test_register_creates_user_profile_and_subscription(self): ...
    def test_register_raises_if_email_exists(self): ...
    def test_register_calls_core_bootstrap(self): ...
    def test_register_rolls_back_if_bootstrap_fails(self): ...

class BuildMePayloadTests(TestCase):
    def test_returns_user_role_subscription_and_link_status(self): ...
    def test_linked_user_shows_core_linked_true(self): ...
    def test_unlinked_user_shows_core_linked_false(self): ...
```

### 6. Verificar que todos los tests de API siguen pasando

```bash
docker compose exec saas_backend python manage.py test saas_access
```

## Validation

```bash
# 1. Suite completa pasa (sin cambios de comportamiento)
docker compose exec saas_backend python manage.py test saas_access

# 2. Calidad
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .

# 3. Verificar tamaño de views (manual)
# auth_views.py ≤ 150 líneas
# admin_views.py ≤ 100 líneas
```

Resultados esperados:
- Todos los tests pasan sin cambios en comportamiento externo
- `ruff` y `mypy` en verde
- `auth_views.py` ≤ 150 lines
- `admin_views.py` ≤ 100 lines

## Required Documentation Updates

- [x] `docs/roadmap/saas-backend-refactor-roadmap.md` — marcar Phase 2 completada
- [x] `docs/project-status.md` — update task status

## Risks

1. **`register_saas_user` orquesta 3 operaciones** (crear user, bootstrap Core, crear subscription): asegurarse de que la atomicidad es correcta — si bootstrap falla, no debe quedar el user creado en SaaS sin un Core account.
2. **mypy can detect implicit types** in services that were hidden inside views: fix them at this stage.
3. **`build_me_payload` can have lazy creation logic** (create SaasAccessProfile if it does not exist): verify that it still works by moving it to the service.

## Completion Criteria

- [x] `auth_views.py` ≤ 150 lines, no relevant business logic
- [x] `admin_views.py` ≤ 100 lines, no relevant business logic
- [x] `auth_services.py` has the functions extracted with type annotations
- [x] Unit tests para `register_saas_user` y `build_me_payload` existen
- [x] `python manage.py test saas_access --keepdb --noinput` pasa sin errores
- [x] `ruff check .`, `ruff format --check .` y `mypy .` limpios
- [x] Spec movida a `terminados/`
- [ ] Commit: `refactor(saas): extract business logic from views to auth_services`

## Resultado real

- `auth_views.py` remained at 122 lines and `admin_views.py` at 96 lines.
- Las views de linking se separaron en `saas/auth_link_views.py` para mantener `auth_views.py` enfocado.
- Se extrajeron payloads y operaciones de auth a `saas/auth_services.py`:
  `register_saas_user`, `build_auth_mode_payload`, `build_me_payload`,
  `link_core_account`, `unlink_core_account_with_audit`,
  `link_core_account_by_token`, `build_auth_ops_metrics_payload`.
- Se extrajeron operaciones admin a `saas_access/rbac_services.py`:
  `list_admin_users_with_roles`, `create_admin_user`, `update_admin_user_role`,
  `update_admin_user_status`, `delete_admin_user`.
- Added unit tests for extracted functions and kept API tests green.
