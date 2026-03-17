# Estado del Proyecto

Estado actual de funcionalidades por área. Actualizar cuando cambie el estado de una funcionalidad.

**Última revisión:** 2026-03-17 | **Versión SaaS:** 0.20.40 | **Versión Core:** 0.22.0

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
| Data Input (introducción datos) | ✅ Implementado | `/introduccion-datos` | |
| Budget (presupuesto) | ✅ Implementado | `/presupuesto` | |
| Monthly Close (cierre mensual) | ✅ Implementado | `/cierre-mensual` | |
| People (personas/familia) | ✅ Implementado | `/people` | |
| Guide (guía financiera) | ✅ Implementado | `/guia/fases/:phaseId` | |
| Aux Data (FX, IPC) | ✅ Implementado | `/data` | |
| Accounting Movements (movimientos) | ✅ Implementado | `/movimientos` | Añadido recientemente |

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

> La fuente canónica del estado de Core es `core/docs/roadmap/community-roadmap.md`. Esta sección es un resumen para orientación rápida desde el repo SaaS.

### Funcionalidades implementadas y estables
| Área | Estado | Notas |
|------|--------|-------|
| Net Worth (activos, pasivos, liquidez, snapshots) | ✅ | Completo |
| Budget (ingresos/gastos anuales, check-ins mensuales) | ✅ | Completo |
| Cierre mensual | ✅ | Integrado con budget y accounting |
| Data Input (entradas anuales) | ✅ | Completo |
| Guía financiera / Coach v1 | ✅ | Fases 1-4 con scoring implementado |
| Family & Ownership (FamilyMember, OwnershipLink) | ✅ | Completo |
| Accounting Movements (LedgerAccount/Transaction/Entry) | ✅ | Fases 1-5 completas |
| Market data sync (FX, IPC nacional + CCAA) | ✅ | Fases 1-6 completas, worker `market_data_sync` |
| Portable data (export/import) | ✅ | Con versionado y validación |
| Scoring financiero fases 1-4 | ✅ | Deuda, flujo de caja, fondo emergencia, salud patrimonial |
| Auth Core (JWT, link-token para SaaS) | ✅ | Incluyendo generación de token para linking con SaaS |

### En progreso activo
| Área | Estado | Roadmap canónico |
|------|--------|-----------------|
| Accounting-budget separation | 🔄 Fase 1 hecha, 2+ pendientes | `core/docs/roadmap/accounting-category-budget-separation-roadmap.md` |

### Deliberadamente aparcado (funcionalidad primero)
| Área | Estado | Notas |
|------|--------|-------|
| Frontend refactor | ⏸ Aparcado | `core/docs/roadmap/frontend-refactor-roadmap.md`. No se aborda hasta que la funcionalidad esté completa. BudgetDashboardView ~4836 líneas, NetWorthView ~3218 líneas — deuda técnica conocida y aceptada. |
| Backend refactor | ⏸ Aparcado | Mismo criterio. El roadmap está definido pero no es prioritario frente a funcionalidad. |
| Scoring fase 5 (independencia financiera) | ⚪ | Modelo documentado, sin runtime |
| Investment portfolio básico | ⚪ | En capabilities pero no implementado |
| Financial simulator básico | ⚪ | En capabilities pero no implementado |

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado y funcionando |
| 🔄 | En progreso |
| ⚪ | No iniciado (en scope futuro) |
| ⛔ | Fuera de alcance explícito (decisión tomada) |