# Estado del Proyecto

Estado actual de funcionalidades por área. Actualizar cuando cambie el estado de una funcionalidad.

**Última revisión:** 2026-05-17 | **Versión SaaS:** 0.20.41 | **Versión Core:** 0.23.2

---

## Tareas del Core

Ver `core/docs/project-status.md` para el estado y las próximas tareas de los módulos del producto.

---

## Pendiente SaaS — pre-producción

| Área | Prioridad | Estado | Descripción |
|------|-----------|--------|-------------|
| Deployment a producción | Alta | 🔄 | Definir estrategia y entorno final de despliegue. No iniciado: diseñar antes de implementar. |
| Gestión de secretos en producción | Alta | ⚪ | Variables sensibles en producción (gestor de secretos, variables del proveedor cloud). A decidir junto con el deployment. |
| Sistema de usuarios trial | Alta | ⚪ | Crear usuario root, flujo de acceso controlado para early adopters. |
| Admin UI | Media | ⚪ | Las ops de admin son solo backend por ahora; pendiente de crear interfaz. |
| Capabilities dinámicas (desde backend) | Media | ⚪ | Actualmente hardcoded en frontend; conectar con backend. |
| Limpieza legacy residual Core/SaaS | Media | 🔄 | Core mantiene inventario vivo en `core/docs/roadmap/product-roadmap.md`. Avance espejado: `portable-data` y `budget/annual-entries` extraídos de `data-input`; quedan taxonomías/filtros legacy, fallback Budget/check-ins, `investment_purchase`, facade `net_worth.services`, portable compatibility y `compat.*`. |
| Consolidación funcional v1 (módulos espejo Core) | Alta | ✅ | Vista de movimientos cerrada v1. Importador MoneyWiz ad-hoc retirado; trazabilidad de importados conservada en contabilidad. Presupuesto v1 y Cierre mensual espejados y validados manualmente. |
| Refactor backend SaaS — Phase 1 | Alta | ✅ | Test coverage baseline completado: suite reorganizada por dominio, rollback real en registro si falla bootstrap Core, 138 tests y 96% de coverage sobre `saas` + `saas_access`. Spec: `docs/tasks/backend-refactor/terminados/phase-1-test-coverage-baseline/backend.md` |
| Refactor backend SaaS — Phase 2 | Media | ✅ | Thin views completado: `auth_views.py` en 122 líneas, `admin_views.py` en 96, lógica extraída a `saas/auth_services.py`, `saas/auth_link_views.py` y `saas_access/rbac_services.py`. Spec: `docs/tasks/backend-refactor/terminados/phase-2-thin-views/backend.md` |
| Refactor backend SaaS — Phase 3 | Media | ✅ | Exception handler canónico completado: contrato `{code, message, details}` en todos los endpoints y contract tests de error shape. Spec: `docs/tasks/backend-refactor/terminados/phase-3-error-standardization/backend.md` |
| Revisión auth SaaS | Alta | ⚪ | Revisar login, permisos, RBAC y flujos reales (registro, sesión, expiración). |
| Auditoría de seguridad | Alta | ⚪ | Vulnerabilidades backend SaaS, CVEs en dependencias, validación auth/permisos/inputs. |
| CI/CD deployment | Alta | ⚪ | Pipeline de despliegue automático a producción (build, test, deploy). Complementa la infraestructura cloud; diseñar junto con el deployment. |
| PWA — frontend adaptado | Media | ⚪ | Adaptar el frontend a Progressive Web App como primer paso hacia móvil. Paso previo a cualquier desarrollo de app nativa. |
| Validación pre-lanzamiento | Alta | ⚪ | Tests con early adopters tras cerrar la consolidación funcional v1; feedback sobre UX, comprensión y valor real — crítico antes de MVP. |
| Open Source — repo Core listo | Media | ⚪ | Licencia (EUPL u otra), guía de contribución, documentación técnica, guía de despliegue. |

---

## Backend SaaS

### Auth y sesión
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Login (JWT) | ✅ Implementado | `POST /api/auth/token/` |
| Token refresh | ✅ Implementado | `POST /api/auth/refresh/` |
| Registro de usuario | ✅ Implementado | `POST /api/auth/register/` + bootstrap Core automático |
| Perfil usuario autenticado (`/me`) | ✅ Implementado | Incluye role, subscription_status, account_link |
| Auth mode endpoint | ✅ Implementado | `GET /api/auth/mode/` |
| Throttling por scope | ✅ Implementado | `auth_login`, `auth_register`, `auth_me`, etc. |
| Audit log de eventos auth | ✅ Implementado | BD + log file |

### Subscripciones
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Estado trial por defecto | ✅ Implementado | Todos los usuarios nuevos → `trial` |
| Endpoint de consulta | ✅ Implementado | `GET /api/auth/subscription/` |
| Billing / pagos | ⛔ Fuera de alcance | Piloto sin billing. Pendiente de definir. |
| Cambio de plan | ⛔ Fuera de alcance | Pendiente de definir. |

### RBAC
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Roles `saas_admin` / `saas_member` | ✅ Implementado | |
| Protección de admin sin dejar la plataforma sin admins | ✅ Implementado | |
| Restricción de acceso al producto para `saas_admin` | ⚪ No iniciado | Admin puede técnicamente llamar a Core APIs. Pendiente de controlar. |
| Niveles de privilegio dentro de `saas_member` | ⚪ No iniciado | Por definir según requisitos futuros |

### Admin (operaciones internas)
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Listar usuarios | ✅ Implementado | `GET /api/admin/users/` |
| Crear usuario (admin) | ✅ Implementado | `POST /api/admin/users/` + bootstrap Core |
| Cambiar rol de usuario | ✅ Implementado | `PATCH /api/admin/users/{id}/role/` |
| Activar/desactivar usuario | ✅ Implementado | `PATCH /api/admin/users/{id}/status/` |
| Eliminar usuario | ✅ Implementado | `DELETE /api/admin/users/{id}/` |
| Métricas de operaciones | ✅ Implementado | `GET /api/auth/ops/metrics/` |

### Integración Core
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Bootstrap automático al registrar | ✅ Implementado | Síncrono, falla si Core no disponible |
| Core Link manual | ✅ Implementado | Requiere `ACCOUNT_LINKING_ENABLED=True` |
| Core Link via token firmado | ✅ Implementado | Requiere `CORE_LINKING_SHARED_SECRET` |
| Acceso frontend a APIs Core (JWT compartido) | ✅ Implementado | Mismo `JWT_SIGNING_KEY` |

---

## Frontend SaaS

### Refactor frontend
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Refactor frontend SaaS | ✅ Completado | Core-first mirror cerrado; fases 0-6 completadas, ver `docs/roadmap/frontend-refactor-roadmap.md` y las specs archivadas en Core. |

### Auth
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Login view | ✅ Implementado | `/login` |
| Refresh automático de token | ✅ Implementado | Interceptor en `lib/api.ts` |
| Redirect a login por sesión expirada | ✅ Implementado | `?reason=session_expired` |
| Auth guard en router | ✅ Implementado | `domains/auth/guard.ts` |
| Account view | ✅ Implementado | `/account` |

### Dominios de producto (mirrors de Core)
| Dominio | Estado | Ruta | Notas |
|---------|--------|------|-------|
| Net Worth (patrimonio) | ✅ Implementado | `/patrimonio` | |
| Data Input (introducción datos) | ✅ Retirado | — | Ruta/módulo eliminados. Funciones reubicadas en Presupuesto, Patrimonio y Cuenta. |
| Budget (presupuesto) | ✅ Implementado | `/presupuesto` | Flujo integrado de edición/alta/borrado por categoría/subcategoría, espejado desde Core. Evolución ejecutada (barras) funcional en ingresos y gastos, reactiva al filtro recurrente/puntual. Barras YTD de categoría/subcategoría funcionales para ambas secciones con selector de mes independiente (defecto: mes actual). Se muestra ejecución fuera de presupuesto en ingresos y gastos con CTA contextual (`Anadir al presupuesto`) y KPIs separados (`executed_budgeted` / `executed_unbudgeted`). Revisión manual completada el 2026-05-14. |
| Monthly Close (cierre mensual) | ✅ Implementado | `/cierre-mensual` | Modo dual espejado desde Core y revisión manual completada el 2026-05-14. |
| People (personas/familia) | ✅ Implementado | `/people` | |
| Guide (guía financiera) | ✅ Implementado | `/guia/fases/:phaseId` | |
| Aux Data (FX, IPC) | ✅ Implementado | `/data` | |
| Accounting Movements (movimientos) | ✅ Implementado | `/movimientos` | Vista cerrada v1. Soporte multimoneda en alta y edición de inversiones. Importador MoneyWiz ad-hoc retirado; trazabilidad de importados conservada. |

### SaaS-específico
| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Capabilities system | ✅ Implementado | Estático en `community_core` |
| Capabilities dinámicas (desde backend) | ⚪ No iniciado | Actualmente hardcoded en frontend |
| Admin UI | ⚪ No iniciado | Las ops de admin son solo backend por ahora |
| Billing UI | ⛔ Fuera de alcance piloto | |

---

## Infraestructura y operaciones

| Área | Estado | Notas |
|------|--------|-------|
| Docker Compose local (SaaS) | ✅ Implementado | `docker-compose.yml` raíz |
| Docker Compose local (Core) | ✅ Implementado | `core/docker-compose.yml` |
| Pre-commit hooks (ruff, eslint, prettier) | ✅ Implementado | `.pre-commit-config.yaml` |
| CI quality checks SaaS | ✅ Implementado | `.github/workflows/quality-saas.yml` |
| Deployment cloud | 🔄 En progreso | Objetivo del piloto |
| Support runbook | 🔄 En progreso | Pendiente de completar para piloto |
| Smoke test end-to-end | 🔄 En progreso | Ver `docs/roadmap/saas-pilot-integration-checklist.md` |

---

---

## Core (`core/`) — Estado por área

Ver `core/docs/project-status.md`.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado y funcionando |
| 🔄 | En progreso |
| ⚪ | No iniciado (en scope futuro) |
| ⛔ | Fuera de alcance explícito (decisión tomada) |
