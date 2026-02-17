# Contratos API (Core + SaaS)

## Objetivo
Consolidar el contrato actual de endpoints backend para reducir ambigüedad entre frontend, `core` y `saas`.

## Convenciones Comunes
1. Autenticación:
- Endpoints protegidos requieren `Authorization: Bearer <token>`.
 - Tokens de `core` y `saas` no son intercambiables (issuer/audience distintos por stack).
2. Rate limiting:
- Endpoints de autenticación y linking aplican throttle por scope.
- Si se excede el límite: `429 Too Many Requests`.
3. Formato de error normalizado:
```json
{
  "error": {
    "code": "validation_error",
    "message": "Request failed.",
    "details": {
      "campo": ["motivo"]
    }
  }
}
```
4. Códigos `error.code` más frecuentes:
- `validation_error`, `unauthorized`, `forbidden`, `not_found`, `server_error`, `api_error`.

## Core API
Base local habitual: `http://localhost:8000`.

### Auth y settings
Prefijo: `/api/auth/`

1. `POST /api/auth/token/`
- Input: credenciales (`username`, `password`).
- Output: tokens JWT.
2. `POST /api/auth/refresh/`
- Input: `refresh`.
- Output: nuevo `access`.
3. `GET /api/auth/settings/`
- Output:
```json
{ "base_currency": "EUR" }
```
4. `PUT /api/auth/settings/`
- Input:
```json
{ "base_currency": "USD" }
```
- Output: mismo shape persistido.

### Core domain (FX / inflación)
Prefijo: `/api/core/`

1. `GET/POST/PUT/PATCH/DELETE /api/core/fx-rates/`
- Campos: `id`, `rate_date`, `from_currency`, `to_currency`, `rate`, `updated_at`.
2. `GET/POST/PUT/PATCH/DELETE /api/core/inflation/`
- Campos: `id`, `region`, `period`, `index`, `created_at`, `updated_at`.

### Patrimonio (net worth)
Prefijo: `/api/net-worth/`

1. `GET/POST/PUT/PATCH/DELETE /api/net-worth/assets/`
- Campos principales:
`id`, `name`, `category`, `subcategory`, `tracking_mode`, `accounting_account_id`, `currency`, `amount`, `amount_base`, `is_active`, `created_at`, `updated_at`.
2. `GET/POST/PUT/PATCH/DELETE /api/net-worth/liabilities/`
- Campos principales:
`id`, `name`, `category`, `tracking_mode`, `accounting_account_id`, `currency`, `amount`, `amount_base`, `is_active`, `is_asset_backed`, `financed_asset_id`, `financed_asset_ref`, `financed_asset_detail`, `notes`, `created_at`, `updated_at`.
3. `GET /api/net-worth/summary/`
- Output: totales de patrimonio, desglose por categoría/subcategoría y, cuando aplica, valores ajustados por inflación.
4. `GET /api/net-worth/snapshots/`
- Output: lista de snapshots (`id`, `snapshot_date`, `base_currency`, `total_assets`, `total_liabilities`, `net_worth`, `created_at`).
5. `POST /api/net-worth/snapshots/from-current/`
- Output:
```json
{
  "created": true,
  "snapshot": {
    "id": 1,
    "snapshot_date": "2026-02-14",
    "base_currency": "EUR",
    "total_assets": "1000.00",
    "total_liabilities": "200.00",
    "net_worth": "800.00",
    "created_at": "2026-02-14T10:00:00Z"
  }
}
```
- Status: `201` si crea, `200` si actualiza snapshot del día.
6. `DELETE /api/net-worth/snapshots/{id}/`

## SaaS API
Base local habitual: `http://localhost:8001`.

### Auth
Prefijo: `/api/auth/`

1. `POST /api/auth/token/`
2. `POST /api/auth/refresh/`

### Titularidad premium (Ownership)
Prefijo: `/api/`

1. `GET/POST/PUT/PATCH/DELETE /api/family-members/`
- Campos:
`id`, `name`, `role`, `is_active`.
2. `GET/POST/PUT/PATCH/DELETE /api/ownerships/`
- Lectura:
`id`, `kind`, `member`, `splits`, `is_in_use`.
- Escritura:
`id`, `kind`, `member`, `splits`.
- Regla actual:
`kind=individual` exige `member` y no permite `splits`.
`kind=shared` exige `member=null` y `splits` válidos sumando 100.
3. `GET /api/ownership-links/`
- Campos:
`id`, `target_type`, `target_id`, `ownership_id`, `updated_at`.
4. `POST /api/ownership-links/sync/`
- Input:
```json
{
  "target_type": "asset",
  "target_id": 101,
  "ownership_id": 12
}
```
- `ownership_id: null` elimina enlace.
- Output:
```json
{ "ok": true, "ownership_id": 12 }
```

## Cambios Relevantes Del Refactor (Fase 1)
1. Se estandarizó formato de errores en `core` y `saas`.
2. Se movió lógica de negocio desde vistas/serializers hacia `services` en:
- `core/backend/accounts`
- `core/backend/net_worth`
- `backend/memberships`
3. No se introdujeron cambios rompientes de rutas en endpoints ya publicados.

## Actualizacion Hito 05 (Identidad Separada)

### Core API (`/api/auth/`)
5. `GET /api/auth/mode/`
- Output:
```json
{
  "auth_mode": "core_local",
  "auth_mode_enabled": true,
  "standalone": true,
  "transition_mode": "stable",
  "session_compat_enabled": true,
  "exit_criteria": {
    "transition_mode_stable": true,
    "session_compat_enabled": true,
    "core_local_auth_enabled": true
  },
  "exit_ready": true
}
```
6. `GET /api/auth/ops/metrics/`
- Requiere autenticación.
- Output operativo para dashboard de `core`:
```json
{
  "service": "core",
  "users_total": 1,
  "users_active": 1,
  "jwt_outstanding_tokens": 3,
  "auth_mode": "core_local"
}
```
7. `GET /api/auth/link-token/`
- Requiere autenticación y `CORE_LINKING_SHARED_SECRET` configurado.
- Output:
```json
{
  "link_token": "<signed_token>",
  "expires_in_seconds": 300,
  "core_user_ref": "core_user:1"
}
```

### SaaS API (`/api/auth/`)
3. `POST /api/auth/register/`
- Input: `username`, `password`, `email` (opcional).
- Output: usuario creado (`id`, `username`, `email`).

4. `GET /api/auth/me/`
- Output: usuario autenticado y `account_link` (si existe).
 - Incluye: `role`, `subscription_status` y `premium_enabled`.

5. `GET /api/auth/subscription/`
- Output: estado de suscripcion del usuario (`trial|active|past_due|canceled`) y bandera `premium_enabled`.

6. `GET /api/auth/mode/`
- Output:
```json
{
  "auth_mode": "saas_local",
  "auth_mode_enabled": true,
  "account_linking_enabled": false,
  "transition_mode": "stable",
  "session_compat_enabled": true,
  "exit_criteria": {
    "transition_mode_stable": true,
    "session_compat_enabled": true,
    "saas_local_auth_enabled": true
  },
  "exit_ready": true
}
```

7. `GET/POST/DELETE /api/auth/core-link/`
- Requiere `ACCOUNT_LINKING_ENABLED=true`.
- `POST` crea o actualiza enlace opcional con cuenta `core`.
- `DELETE` elimina el enlace sin afectar login local de `saas`.
8. `POST /api/auth/core-link/from-token/`
- Requiere `ACCOUNT_LINKING_ENABLED=true` y `CORE_LINKING_SHARED_SECRET`.
- Input:
```json
{ "link_token": "<signed_token>" }
```
- Reglas:
  - token temporal con expiración.
  - uso one-time (anti-replay por `jti`).
9. `GET /api/auth/ops/metrics/`
- Requiere autenticación con rol `saas_admin`.
- Output operativo para dashboard de `saas`:
```json
{
  "service": "saas",
  "users_total": 2,
  "users_active": 2,
  "jwt_outstanding_tokens": 4,
  "subscriptions": {
    "trial": 1,
    "active": 1,
    "past_due": 0,
    "canceled": 0
  },
  "core_links_total": 1,
  "auth_mode": "saas_local"
}
```

### Regla De Acceso Premium (SaaS)
- Endpoints de `memberships` (`/api/family-members`, `/api/ownerships`, `/api/ownership-links`) solo permiten acceso cuando la suscripcion esta en `trial` o `active`.
- Estados `past_due` y `canceled` devuelven `403 forbidden`.

## Actualizacion Hito 05B (RBAC SaaS)

### Roles y claims (contrato objetivo)
1. Roles soportados:
- `saas_admin`
- `saas_member`
2. Claim recomendado en token o contexto de sesion:
- `role`: uno de los valores anteriores.
3. Politica por defecto:
- nuevos usuarios => `saas_member`.

### Reglas de autorizacion
1. Endpoints de administracion de usuarios/permisos:
- requieren `saas_admin`.
2. Endpoints funcionales premium:
- requieren rol valido (`saas_admin` o `saas_member`) y suscripcion con premium habilitado.
3. Endpoints operativos de auth (`/api/auth/ops/metrics/`):
- restringidos a `saas_admin` en la version inicial.

### Codigos de error RBAC (contrato)
1. `403 permission_denied`:
- usuario autenticado sin rol/capacidad para la accion.
2. `403 subscription_blocked`:
- usuario con rol valido pero suscripcion sin acceso premium.
3. `401 unauthorized`:
- token ausente, invalido o expirado.

### Endpoints administrativos RBAC v1
Prefijo: `/api/admin/users/`

1. `GET /api/admin/users/`
- lista usuarios SaaS y su rol.
- permiso: `saas_admin`.
2. `POST /api/admin/users/`
- alta de usuario SaaS con rol inicial.
- permiso: `saas_admin`.
3. `PATCH /api/admin/users/{id}/role/`
- cambio de rol entre `saas_admin` y `saas_member`.
- permiso: `saas_admin`.
4. `PATCH /api/admin/users/{id}/status/`
- activar/desactivar usuario.
- permiso: `saas_admin`.
