# Registro de APIs

## APIs del Backend SaaS (`http://localhost:8001`)

### Auth — `/api/auth/`

| Método | Ruta | Vista | Auth | Throttle | Descripción |
|--------|------|-------|------|----------|-------------|
| `POST` | `/api/auth/token/` | `SaasTokenObtainPairView` | Ninguna | `auth_login` | Login. Devuelve `access` y `refresh` JWT. |
| `POST` | `/api/auth/refresh/` | `SaasTokenRefreshView` | Ninguna | `auth_refresh` | Refresca el `access` token usando el `refresh`. |
| `POST` | `/api/auth/register/` | `SaasRegisterAPIView` | Ninguna | `auth_register` | Registra un usuario nuevo. Crea subscription (trial), perfil (saas_member) y dispara bootstrap en Core. |
| `GET` | `/api/auth/me/` | `SaasMeAPIView` | Bearer | `auth_me` | Devuelve datos del usuario autenticado: id, username, email, role, subscription_status, premium_enabled, account_link. |
| `GET` | `/api/auth/subscription/` | `SaasSubscriptionAPIView` | Bearer | `auth_subscription` | Devuelve el estado de suscripción del usuario. |
| `GET` | `/api/auth/mode/` | `SaasAuthModeAPIView` | Ninguna | — | Devuelve configuración de auth mode (saas_local, account_linking_enabled, transition_mode). |
| `GET` | `/api/auth/ops/metrics/` | `SaasAuthOpsMetricsAPIView` | Bearer + Admin | `auth_ops_metrics` | Métricas de operaciones: totales de usuarios, subscripciones, links, RBAC. Solo `saas_admin`. |
| `GET` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Devuelve el vínculo Core activo del usuario. 204 si no existe. Requiere `ACCOUNT_LINKING_ENABLED=True`. |
| `POST` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Crea o actualiza manualmente un vínculo Core (`core_user_ref`, `core_username`, `core_email`). |
| `DELETE` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Elimina el vínculo Core del usuario. |
| `POST` | `/api/auth/core-link/from-token/` | `SaasCoreAccountLinkFromTokenAPIView` | Bearer | `auth_core_link_token` | Vincula cuenta Core usando un token firmado con `CORE_LINKING_SHARED_SECRET`. Token de un solo uso. |

### Admin — `/api/admin/`
Todos los endpoints requieren `Bearer` + rol `saas_admin`. Throttle: `saas_admin_api`.

| Método | Ruta | Vista | Descripción |
|--------|------|-------|-------------|
| `GET` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Lista todos los usuarios con sus roles. |
| `POST` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Crea un usuario. Si es `saas_member`, dispara bootstrap en Core. |
| `PATCH` | `/api/admin/users/{id}/role/` | `SaasAdminUserRoleAPIView` | Cambia el rol. Si pasa a `saas_member`, dispara bootstrap en Core. |
| `PATCH` | `/api/admin/users/{id}/status/` | `SaasAdminUserStatusAPIView` | Activa o desactiva un usuario. |
| `DELETE` | `/api/admin/users/{id}/` | `SaasAdminUserDeleteAPIView` | Elimina un usuario. No permite dejar la plataforma sin admins activos. |

### Utilidades

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/schema/` | OpenAPI schema (drf-spectacular) |
| `GET` | `/api/docs/` | Swagger UI interactivo |

---

## APIs del Backend Core (`http://localhost:8000`)

El Core backend expone su propia API completa. El frontend SaaS la consume directamente con el mismo JWT.

### Auth — `/api/auth/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/token/` | Login Core (no usado en SaaS — SaaS usa su propio token) |
| `POST` | `/api/auth/refresh/` | Refresh token Core |
| `GET` | `/api/auth/me/` | Perfil del usuario Core: `base_currency`, settings |
| `GET/PATCH` | `/api/auth/settings/` | Configuración del usuario (misma vista que `/me/`) |
| `GET` | `/api/auth/mode/` | Auth mode Core |
| `GET` | `/api/auth/ops/metrics/` | Métricas de operaciones (admin) |
| `POST` | `/api/auth/link-token/` | Genera un token firmado para vincular cuenta con SaaS |

### Memberships (familia y propiedad) — `/api/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/family-members/` | Lista y crea miembros familiares |
| `GET/PATCH/DELETE` | `/api/family-members/{id}/` | Detalle de miembro |
| `POST` | `/api/family-members/ensure-primary/` | **Usado por SaaS bootstrap.** Crea el miembro primario si no existe. Idempotente. |
| `GET/POST` | `/api/ownerships/` | Lista y crea relaciones de propiedad |
| `GET/PATCH/DELETE` | `/api/ownerships/{id}/` | Detalle de propiedad |
| `GET/POST` | `/api/ownership-links/` | Vínculos de ownership (activo↔persona) |
| `GET/PATCH/DELETE` | `/api/ownership-links/{id}/` | Detalle de vínculo |

### Net Worth — `/api/net-worth/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/net-worth/assets/` | Activos |
| `GET/POST` | `/api/net-worth/liabilities/` | Pasivos |
| `GET/POST` | `/api/net-worth/asset-valuations/` | Valoraciones de activos |
| `GET/POST` | `/api/net-worth/liability-valuations/` | Valoraciones de pasivos |
| `GET/POST` | `/api/net-worth/investment-events/` | Eventos de inversión |
| `GET/POST` | `/api/net-worth/liability-events/` | Eventos de pasivo (amortizaciones, etc.) |
| `GET/POST` | `/api/net-worth/liquidity-events/` | Eventos de liquidez |
| `GET/POST` | `/api/net-worth/liquidity-checkins/` | Check-ins mensuales de liquidez |
| `GET/POST` | `/api/net-worth/snapshots/` | Snapshots patrimoniales |
| `GET` | `/api/net-worth/summary/` | Resumen agregado de patrimonio |
| `GET` | `/api/net-worth/timeline/` | Línea de tiempo patrimonial |
| `GET` | `/api/net-worth/liquidity/monthly-summary/` | Resumen mensual de liquidez |

### Budget — `/api/budget/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/budget/annual-income/` | Entradas anuales de ingresos |
| `GET/POST` | `/api/budget/annual-expense/` | Entradas anuales de gastos |
| `GET` | `/api/budget/annual-income/monthly-summary/` | Resumen mensual ingreso previsto vs ejecutado + cobertura presupuestaria (`executed_budgeted`, `executed_unbudgeted`, `executed_total`) y `income_execution_breakdown` por categoria/subcategoria |
| `GET` | `/api/budget/annual-expense/monthly-summary/` | Resumen mensual gasto previsto vs ejecutado + cobertura presupuestaria (`executed_budgeted`, `executed_unbudgeted`, `executed_total`) y `expense_execution_breakdown` por categorÃ­a/subcategorÃ­a |
| `GET/POST` | `/api/budget/annual-income-checkins/` | Check-ins mensuales de ingresos |
| `GET/POST` | `/api/budget/annual-expense-checkins/` | Check-ins mensuales de gastos |

### Accounting — `/api/accounting/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET/POST` | `/api/accounting/accounts/` | Cuentas contables (LedgerAccount) |
| `GET/PATCH/DELETE` | `/api/accounting/accounts/{id}/` | Detalle de cuenta |
| `GET/POST` | `/api/accounting/transactions/` | Transacciones (LedgerTransaction) |
| `GET/PATCH/DELETE` | `/api/accounting/transactions/{id}/` | Detalle de transacción |
| `GET/POST` | `/api/accounting/entries/` | Entradas de movimiento (LedgerEntry) |
| `GET/PATCH/DELETE` | `/api/accounting/entries/{id}/` | Detalle de entrada |

### Core (datos auxiliares, portabilidad) — `/api/core/`
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/core/fx-rates/` | Tipos de cambio FX |
| `GET` | `/api/core/inflation/` | Índices IPC (nacional + CCAA) |
| `GET` | `/api/core/market-data/status/` | Estado de sincronización de datos de mercado |
| `GET` | `/api/core/portable-data/meta/` | Metadatos del bundle portable (versión, etc.) |
| `POST` | `/api/core/portable-data/import/` | Importación de datos portables |

---

## APIs de Core que consume el backend SaaS (server-to-server)

El SaaS llama a Core directamente servidor-a-servidor usando un JWT generado en nombre del usuario (`AccessToken.for_user(user)`). Solo es posible si Core y SaaS comparten la misma `JWT_SIGNING_KEY`.

| Método | Ruta Core | Llamado desde | Cuándo | Descripción |
|--------|-----------|---------------|--------|-------------|
| `POST` | `/api/family-members/ensure-primary/` | `core_bootstrap.ensure_primary_family_member_in_core_for_saas_user()` | Registro de usuario / creación admin / asignación de rol `saas_member` | Garantiza que el usuario tenga un `FamilyMember` primario en Core. Idempotente. |

> **Nota:** si `CORE_API_BASE_URL` no está configurado o Core no responde, el registro de usuario falla con error 400. Ver [flujo de integración](./saas-core-integration-flow.md) para detalles.

---

## APIs de Core que consume el frontend SaaS

El frontend SaaS accede directamente a Core a través de `coreApi` (Axios con `VITE_CORE_API_BASE_URL`). El mismo JWT de sesión SaaS se usa para autenticarse en Core.

Estos endpoints son canónicos en `core/docs/`. Los dominios frontend que los consumen:

| Dominio | Cliente Axios | APIs Core consumidas |
|---------|--------------|---------------------|
| `net-worth` | `coreApi` | Net worth items, grupos, subgrupos |
| `people` | `coreApi` | Family members, ownership |
| `data-input` | `coreApi` | Annual income/expense entries |
| `accounting` | `coreApi` | Accounting movements |
| `aux-data` | `coreApi` | FX rates, IPC data |
| `guide` | `coreApi` | Financial phases, scoring |
| `auth` | `api` (SaaS) | Login, me, refresh |

> El dominio `auth` usa el cliente `api` (SaaS backend), no `coreApi`.

---

## Configuración requerida

| Variable | Backend SaaS | Frontend SaaS | Descripción |
|----------|-------------|---------------|-------------|
| `CORE_API_BASE_URL` | ✓ | — | URL del backend Core (server-to-server) |
| `JWT_SIGNING_KEY` | ✓ | — | Debe coincidir con el de Core |
| `ACCOUNT_LINKING_ENABLED` | ✓ | — | Habilita endpoints de core-link manual |
| `CORE_LINKING_SHARED_SECRET` | ✓ | — | Secreto para tokens de linking |
| `VITE_API_BASE_URL` | — | ✓ | URL del backend SaaS (default: `http://localhost:8001`) |
| `VITE_CORE_API_BASE_URL` | — | ✓ | URL del backend Core desde el navegador (default: `http://localhost:8000`) |
