# Roadmap: backend refactor (SaaS) - cobertura profesional y arquitectura limpia

## Objetivo
Llevar el backend SaaS a un nivel profesional de mantenibilidad y cobertura de tests,
preparándolo para producción. Sin cambios de comportamiento funcional ni de contrato API.

## Estado real (2026-03-18)

### Inventario por módulo

| Módulo | Superficie principal | Líneas código | Líneas tests | Cobertura est. |
|--------|---------------------|---------------|--------------|----------------|
| `saas/` | Auth views, admin views, services, settings, URLs | ~1,070 | — | Baja |
| `saas_access/` | Models, permissions, services, bootstrap, tests | ~779 | 447 | ~24% |
| **Total** | | **~1,849** | **447** | **~24%** |

### Hotspots detectados

| Archivo | Líneas | Riesgo | Motivo |
|---------|--------|--------|--------|
| `saas/auth_views.py` | 319 | Medio | Lógica de negocio mezclada con HTTP |
| `saas_access/tests.py` | 447 | Alto | Único fichero, cobertura ~24%, sin separación por dominio |
| `saas/auth_services.py` | 95 | Medio | Incompleto; parte de la lógica sigue en views |

### Funcionalidad ya estable
- Login JWT, token refresh, registro, `/me`, `/mode`
- Throttling por scope
- Audit log de eventos auth
- Suscripciones (trial por defecto)
- RBAC: `saas_admin` / `saas_member`, protección de último admin
- Admin CRUD: usuarios, roles, status, métricas
- Integración Core: bootstrap automático, linking manual, linking por token

## Principios de trabajo
1. PRs pequeñas, reversibles y con alcance claro.
2. Sin cambios de comportamiento no intencionales.
3. Primero cobertura de tests; luego refactor estructural.
4. Cada fase deja el backend ejecutable y con todos los tests en verde.
5. Validación dentro de Docker.

## Alcance
1. `saas/` — auth views, admin views, services, settings
2. `saas_access/` — models, permissions, services, bootstrap, tests

## Fuera de alcance
1. Cambios de producto (nuevos endpoints, billing, capabilities dinámicas).
2. Frontend SaaS.
3. Infraestructura y deployment.

## Fases activas

| Fase | Título | Spec | Estado |
|------|--------|------|--------|
| 1 | Test coverage baseline (≥80%) | `docs/tasks/backend-refactor/phase-1-test-coverage-baseline/backend.md` | ⚪ |
| 2 | Thin views (extracción de negocio a services) | `docs/tasks/backend-refactor/phase-2-thin-views/backend.md` | ⚪ |
| 3 | Exception handler canónico | `docs/tasks/backend-refactor/phase-3-error-standardization/backend.md` | ⚪ |

## Detalle de fases

### Fase 1 — Test coverage baseline
**Objetivo:** Pasar de ~24% a ≥80% de cobertura. Red de seguridad antes de mover código.

Trabajo:
- Reorganizar `saas_access/tests.py` en paquete `saas_access/tests/` con ficheros por dominio:
  - `test_auth.py`, `test_admin.py`, `test_rbac.py`, `test_bootstrap.py`, `test_audit.py`
- Añadir error paths: bootstrap failure, duplicate register, invalid tokens
- Añadir edge cases: last-admin protection, subscription state, throttle scopes
- Target: ≥150 test methods, todos los endpoints cubiertos

### Fase 2 — Thin views
**Objetivo:** Views como adaptadores HTTP puros; negocio en services.

Trabajo:
- `auth_views.py` (319 → ≤150 líneas): extraer a `auth_services.py`:
  - `register_saas_user()`
  - `build_me_payload()`
  - `link_core_account()` / `unlink_core_account()`
  - `link_core_account_by_token()`
- `admin_views.py` (164 → ≤100 líneas): delegar completamente a `rbac_services.py`
- Añadir unit tests para funciones extraídas

### Fase 3 — Exception handler canónico
**Objetivo:** Contrato de error `{code, message, details}` en todos los endpoints.

Trabajo:
- Crear `saas/exception_handler.py` equivalente a `core/config/exceptions.py`
- Registrar en `REST_FRAMEWORK.EXCEPTION_HANDLER` en settings
- Añadir contract tests para shapes de error en todos los endpoints críticos
- Eliminar respuestas ad-hoc que no usen el contrato canónico

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
