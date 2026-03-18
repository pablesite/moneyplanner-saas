# SaaS backend — Phase 2: Thin views

## Title
SaaS backend — extracción de lógica de negocio a services (thin views)

## Context
`saas/auth_views.py` tiene 319 líneas y mezcla lógica de HTTP (validación de input,
dispatch, respuesta) con lógica de negocio (orquestación del flujo de registro, linking
de cuenta Core, construcción del payload de `/me`). Esta mezcla hace que los services sean
difíciles de probar de forma aislada y que los views sean difíciles de leer. El objetivo
es que cada view sea un adaptador de HTTP puro: valida la request, delega al service, y
retorna la respuesta serializada.

**Prerequisito:** Phase 1 completada (cobertura ≥80% garantiza que el refactor no rompe comportamiento).

## Area
`backend`

## Stack
`saas`

## Scope

### En scope
1. Extraer lógica de negocio de `auth_views.py` a `auth_services.py`.
2. Extraer lógica de negocio de `admin_views.py` a `rbac_services.py` donde corresponda.
3. `auth_views.py` ≤ 150 líneas al finalizar.
4. `admin_views.py` ≤ 100 líneas al finalizar.
5. Añadir unit tests para las funciones extraídas a services.
6. Verificar que todos los tests de API siguen pasando sin cambios.

### Fuera de scope
1. Cambios de contrato API (endpoints, shapes de respuesta, códigos de error).
2. Cambios en models, serializers o URLs.
3. Lógica de Phase 3 (exception handler).

## Plan

### 1. Diagnóstico: mapear lógica a extraer de `auth_views.py`

Revisar cada clase/función en `auth_views.py` e identificar qué lógica no es HTTP:

| View / método | Lógica a extraer | Destino |
|---------------|-----------------|---------|
| `SaasRegisterAPIView.post` | Creación de usuario + bootstrap + creación de suscripción + creación de perfil RBAC | `auth_services.register_saas_user()` |
| `SaasMeAPIView.get` | Construcción del payload (user + role + subscription + link status) | `auth_services.build_me_payload()` |
| `SaasCoreAccountLinkAPIView.post` | Validación + linking + manejo de replay | `auth_services.link_core_account()` (ya existe `SaasCoreAccountLink`; ampliar) |
| `SaasCoreAccountUnlinkAPIView.post` | Unlink + audit | `auth_services.unlink_core_account()` |
| `SaasCoreLinkByTokenAPIView.post` | Verificación de token + linking | `auth_services.link_core_account_by_token()` |

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

`admin_views.py` (164 líneas) ya delega bastante a `rbac_services.py`. Verificar que:
- No hay queries directas al ORM en las views
- Toda validación de negocio (last-admin check) está en `rbac_services.py`
- Si hay lógica de negocio residual, moverla a `rbac_services.py`

Target: `admin_views.py` ≤ 100 líneas.

### 5. Añadir unit tests para services extraídos

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
- `auth_views.py` ≤ 150 líneas
- `admin_views.py` ≤ 100 líneas

## Required Documentation Updates

- [x] `docs/roadmap/saas-backend-refactor-roadmap.md` — marcar Phase 2 completada
- [x] `docs/project-status.md` — actualizar estado de la tarea

## Risks

1. **`register_saas_user` orquesta 3 operaciones** (crear user, bootstrap Core, crear subscription): asegurarse de que la atomicidad es correcta — si bootstrap falla, no debe quedar el user creado en SaaS sin un Core account.
2. **mypy puede detectar tipos implícitos** en services que estaban ocultos dentro de las views: corregirlos en esta fase.
3. **`build_me_payload` puede tener lógica de lazy creation** (crear SaasAccessProfile si no existe): verificar que sigue funcionando al moverla al service.

## Completion Criteria

- [x] `auth_views.py` ≤ 150 líneas, sin lógica de negocio relevante
- [x] `admin_views.py` ≤ 100 líneas, sin lógica de negocio relevante
- [x] `auth_services.py` tiene las funciones extraídas con type annotations
- [x] Unit tests para `register_saas_user` y `build_me_payload` existen
- [x] `python manage.py test saas_access --keepdb --noinput` pasa sin errores
- [x] `ruff check .`, `ruff format --check .` y `mypy .` limpios
- [x] Spec movida a `terminados/`
- [ ] Commit: `refactor(saas): extract business logic from views to auth_services`

## Resultado real

 - `auth_views.py` quedó en 122 líneas y `admin_views.py` en 96 líneas.
- Las views de linking se separaron en `saas/auth_link_views.py` para mantener `auth_views.py` enfocado.
- Se extrajeron payloads y operaciones de auth a `saas/auth_services.py`:
  `register_saas_user`, `build_auth_mode_payload`, `build_me_payload`,
  `link_core_account`, `unlink_core_account_with_audit`,
  `link_core_account_by_token`, `build_auth_ops_metrics_payload`.
- Se extrajeron operaciones admin a `saas_access/rbac_services.py`:
  `list_admin_users_with_roles`, `create_admin_user`, `update_admin_user_role`,
  `update_admin_user_status`, `delete_admin_user`.
- Se añadieron tests unitarios para las funciones extraídas y se mantuvieron verdes los tests de API.
