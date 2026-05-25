# SaaS backend — Phase 3: Error handling standardization

## Title
SaaS backend — exception handler canónico y contract tests de error shapes

## Context
El backend Core tiene un `custom_exception_handler` en `core/config/exceptions.py` que
normaliza todas las respuestas de error a `{code, message, details}`. El backend SaaS no
tiene un handler equivalente, lo que significa que sus respuestas de error pueden tener
shapes distintos según el endpoint (DRF por defecto, responses manuales ad-hoc, etc.).
En producción, el frontend SaaS y los clientes de la API necesitan un contrato de error
predecible en todos los endpoints.

**Prerequisito:** Phase 2 completada.

## Area
`backend`

## Stack
`saas`

## Scope

### En scope
1. Crear `saas/exception_handler.py` con handler canónico equivalente al de Core.
2. Registrarlo en `saas/settings.py` bajo `REST_FRAMEWORK.EXCEPTION_HANDLER`.
3. Verificar que todos los endpoints retornan `{code, message, details}` consistente.
4. Añadir contract tests para shapes de error en endpoints críticos.

### Fuera de scope
1. Cambios en lógica de negocio.
2. Cambios en modelos o migraciones.
3. Añadir nuevos endpoints.

## Plan

### 1. Revisar el handler de Core como referencia

Leer `core/backend/config/exceptions.py` (64 líneas) y replicar su estructura:
- Captura `APIException` y `ValidationError` de DRF
- Normaliza a `{code: str, message: str, details: dict | None}`
- Mapea códigos HTTP a semantic codes (`authentication_failed`, `not_found`, `validation_error`, etc.)
- Convierte `ErrorDetail` objects a strings

### 2. Crear `saas/exception_handler.py`

```python
# saas/exception_handler.py
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    # Normalizar a contrato canónico: {code, message, details}
    ...
    return Response(
        {"code": code, "message": message, "details": details},
        status=response.status_code,
    )
```

Codes semánticos a mapear:
- 400 → `validation_error`
- 401 → `authentication_failed`
- 403 → `permission_denied`
- 404 → `not_found`
- 405 → `method_not_allowed`
- 429 → `throttled`
- 500 → `internal_error`

### 3. Registrar en settings

```python
# saas/settings.py
REST_FRAMEWORK = {
    ...
    "EXCEPTION_HANDLER": "saas.exception_handler.custom_exception_handler",
}
```

### 4. Auditoría de responses manuales

Buscar responses manuales con shapes ad-hoc en views:
```bash
grep -r 'Response({' backend/saas/ --include="*.py" -n
grep -r 'return Response(' backend/saas/ --include="*.py" -n
```

Identificar y corregir cualquier response de error que no use el contrato canónico.

### 5. Contract tests en `saas_access/tests/`

Añadir en `test_auth.py` y `test_admin.py`:

```python
class ErrorShapeContractTests(APITestCase):
    """Verifica que todos los endpoints de error retornan {code, message, details}."""

    def test_login_failure_returns_canonical_shape(self):
        resp = self.client.post('/api/auth/token/', {'username': 'bad', 'password': 'bad'})
        self.assertEqual(resp.status_code, 401)
        self.assertIn('code', resp.data)
        self.assertIn('message', resp.data)

    def test_register_duplicate_email_returns_canonical_shape(self): ...
    def test_unauthenticated_me_returns_canonical_shape(self): ...
    def test_forbidden_admin_endpoint_returns_canonical_shape(self): ...
    def test_not_found_returns_canonical_shape(self): ...
    def test_throttled_returns_canonical_shape(self): ...
    def test_validation_error_returns_canonical_shape(self): ...
```

### 6. Verificar todos los tests pasan

```bash
docker compose exec saas_backend python manage.py test saas_access
docker compose exec saas_backend mypy .
```

## Validation

```bash
# 1. Suite completa pasa
docker compose exec saas_backend python manage.py test saas_access

# 2. Calidad
docker compose exec saas_backend ruff check .
docker compose exec saas_backend ruff format --check .
docker compose exec saas_backend mypy .

# 3. Verificar handler registrado (manual)
# saas/settings.py debe tener EXCEPTION_HANDLER definido en REST_FRAMEWORK

# 4. Smoke test manual (opcional, si el entorno está corriendo):
# curl -X POST http://localhost:8001/api/auth/token/ \
#   -d '{"username":"bad","password":"bad"}' \
#   -H 'Content-Type: application/json'
# → debe retornar {"code": "authentication_failed", "message": "...", "details": null}
```

Resultados esperados:
- Todos los tests pasan
- `ruff` y `mypy` en verde
- Todos los endpoints de error retornan `{code, message, details}`

## Required Documentation Updates

- [ ] `docs/roadmap/saas-backend-refactor-roadmap.md` — marcar Phase 3 completada y refactor como cerrado
- [ ] `docs/project-status.md` — update task status

## Risks

1. **Existing tests that check the old error shape**: if any previous test did `assertEqual(resp.data, {'detail': '...'})`, it will fail when changing the handler. Update those tests to use the new contract.
2. **Core handler uses `ErrorDetail`**: verify that the conversion of `ErrorDetail` to string works the same in SaaS (same version of DRF).
3. **Throttle responses**: DRF retorna un `Retry-After` header en 429. Asegurarse de que el handler lo preserva.

## Completion Criteria

- [ ] `saas/exception_handler.py` exists and is registered in settings
- [ ] Todos los endpoints retornan `{code, message, details}` en error paths
- [ ] Contract tests de error shape existen (≥7 casos cubiertos)
- [ ] No existing test broken (or updated if they used old shape)
- [ ] `python manage.py test saas_access` pasa sin errores
- [ ] `ruff check .` y `mypy .` limpios
- [ ] Spec movida a `terminados/`
- [ ] Commit: `feat(saas): add canonical exception handler for consistent error shapes`
