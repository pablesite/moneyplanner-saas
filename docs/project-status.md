# Estado del Proyecto

Estado actual de funcionalidades por área. Actualizar cuando cambie el estado de una funcionalidad.

**Última revisión:** 2026-03-17 | **Versión SaaS:** 0.20.40 | **Versión Core:** 0.22.0

---

## En curso y próximas tareas

> Convención de tipo de tarea:
> - **(Manual)** — requiere guía directa del usuario; la dirección se define sobre la marcha. No delegable a un agente sin esa guía.
> - **(Agente)** — delegable; requiere un plan maestro pero no decisiones continuas del usuario.

### En curso

| Módulo | Tipo | Descripción |
|--------|------|-------------|
| Contabilidad | Manual | Revisión de la experiencia de uso del módulo para decidir mejoras y orientación funcional. Ver `core/docs/roadmap/product-roadmap.md`. |

### Siguiente tarea disponible

Seleccionar según disponibilidad: ejecutar tareas **(Agente)** cuando haya capacidad para delegar; **(Manual)** cuando haya tiempo para guiar.

| Módulo | Tipo | Descripción | Spec |
|--------|------|-------------|------|
| Importador MoneyWiz | Agente | Importar movimientos desde MoneyWiz con mapeo de tipos. | Pendiente de diseñar tras revisión del módulo de contabilidad. |
| Presupuesto | Manual | Revisión integral de experiencia de uso del módulo. | Se define durante la revisión. |

### Pendiente de diseñar

| Área | Descripción |
|------|-------------|
| Deployment a producción | Definir estrategia y entorno final de despliegue. No iniciado: hay que diseñarlo antes de implementar. |
| Gestión de secretos en producción | Definir cómo se gestionan variables sensibles en producción (gestor de secretos, variables del proveedor cloud, etc.). A decidir junto con el deployment. |

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

Ver `core/docs/project-status.md`.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado y funcionando |
| 🔄 | En progreso |
| ⚪ | No iniciado (en scope futuro) |
| ⛔ | Fuera de alcance explícito (decisión tomada) |