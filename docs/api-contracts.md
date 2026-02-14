# Contratos API (Core + SaaS)

## Objetivo
Consolidar el contrato actual de endpoints backend para reducir ambigüedad entre frontend, `core` y `saas`.

## Convenciones Comunes
1. Autenticación:
- Endpoints protegidos requieren `Authorization: Bearer <token>`.
2. Formato de error normalizado:
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
3. Códigos `error.code` más frecuentes:
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
