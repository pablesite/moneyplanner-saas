# SaaS ↔ Core Integration Flow

## Principio fundamental

SaaS and Core share the same `JWT_SIGNING_KEY`. This allows a SaaS-issued token to be accepted by Core without any additional negotiation. It is the mechanism that makes possible both server-to-server bootstrap and SaaS frontend access to Core APIs.

---

## 1. Flow of login

```
Browser
  │
  ├─ POST /api/auth/token/  →  SaaS Backend
  │                              │
  │                              └─ Valida credenciales Django
  │                                 Devuelve {access, refresh} JWT
  │
  ├─ Guarda tokens en localStorage (authSession.ts)
  │
  └─ Futuras peticiones:
       ├─ api (SaaS)    → Authorization: Bearer {access}   →  SaaS Backend (8001)
       └─ coreApi (Core) → Authorization: Bearer {access}  →  Core Backend (8000)
             (mismo token, aceptado por Core porque comparten JWT_SIGNING_KEY)
```

**Expiry Management** (`lib/api.ts`): When any request returns 401, the frontend tries to automatically refresh via `/api/auth/refresh/`. If the refresh fails, clear tokens and redirect to `/login?reason=session_expired`. Requests pending during the refresh are queued and retried with the new token.

---

## 2. Registration flow (automatic bootstrap)

```
Browser
  │
  └─ POST /api/auth/register/ {username, password, email}
          │
          └─ SaaS Backend (auth_services.create_saas_user)
                │
                ├─ 1. create_user()                → Django User creado
                ├─ 2. get_or_create_subscription() → SaasSubscription (trial)
                ├─ 3. get_or_create_access_profile() → SaasAccessProfile (saas_member)
                └─ 4. ensure_primary_family_member_in_core_for_saas_user()
                            │
                            ├─ Genera AccessToken.for_user(user)  [JWT SaaS]
                            └─ POST {CORE_API_BASE_URL}/api/family-members/ensure-primary/
                                    Authorization: Bearer {jwt}
                                    │
                                    └─ Core acepta el token (misma JWT_SIGNING_KEY)
                                       Crea FamilyMember primario si no existe
                                       Devuelve 200
                                       │
                            Si Core devuelve != 200 → DRFValidationError (registro falla)
                            Si Core no responde     → DRFValidationError (registro falla)
```

> **Known risk:** the bootstrap is synchronous and retry-free. If Core is not available, registration fails completely. There is no "pending non-bootstrap SaaS user" status. It's a deliberate decision: consistency is prioritized over availability in the registry.

The same bootstrap is also executed when:
- An admin creates a user with `POST /api/admin/users/` (si rol = `saas_member`)
- Un admin cambia el rol a `saas_member` con `PATCH /api/admin/users/{id}/role/`

The operation is idempotent in Core: if the parent `FamilyMember` already exists, it does not fail or duplicate.

---

## 3. Linking accounts (Core Link)

Existen dos mecanismos de linking. Ambos requieren `ACCOUNT_LINKING_ENABLED=True`.

### 3a. Linking manual (admin/directo)
```
POST /api/auth/core-link/  {core_user_ref, core_username, core_email}
    │
    └─ auth_services.upsert_core_account_link()
          │
          ├─ Verifica que core_user_ref no esté vinculado a otro usuario SaaS
          └─ Crea o actualiza SaasCoreAccountLink
```

### 3b. Linking via token firmado
For flows where Core initiates linking (e.g. self-hosted → cloud migration):

```
Core genera: signing.dumps({jti, core_user_ref, core_username, core_email}, key=CORE_LINKING_SHARED_SECRET, salt="core-link-token")
    │
    └─ Usuario recibe link_token (QR, URL, etc.)
          │
          └─ POST /api/auth/core-link/from-token/  {link_token}
                  │
                  └─ auth_services.link_core_account_from_token()
                        │
                        ├─ signing.loads() con CORE_LINKING_SHARED_SECRET + max_age check
                        ├─ Verifica que jti no esté en SaasConsumedCoreLinkToken (idempotencia)
                        ├─ upsert_core_account_link()
                        └─ Registra jti en SaasConsumedCoreLinkToken (token de un solo uso)
```

Requiere adicionalmente `CORE_LINKING_SHARED_SECRET` en el backend SaaS.

---

## 4. Acceso del frontend a Core

El frontend mantiene dos clientes Axios (`lib/api.ts`):

| Cliente | Variable | Destino | Usado por |
|---------|----------|---------|-----------|
| `api` | `VITE_API_BASE_URL` | SaaS backend (8001) | `auth`, operaciones SaaS |
| `coreApi` | `VITE_CORE_API_BASE_URL` | Core backend (8000) | Todos los dominios de producto |

Ambos clientes tienen instalados los mismos interceptores de auth (request: inyecta Bearer, response: gestiona 401 y refresh). El mismo token sirve para ambos porque comparten `JWT_SIGNING_KEY`.

---

## 5. Variables de entorno relevantes

| Variable | Where | Description |
|----------|-------|-------------|
| `JWT_SIGNING_KEY` | SaaS backend + Core backend | **Debe ser igual** en ambos stacks |
| `CORE_API_BASE_URL` | SaaS backend | URL del Core backend (server-to-server, ej: `http://core-backend:8000`) |
| `CORE_BOOTSTRAP_TIMEOUT_SECONDS` | SaaS backend | Timeout de la llamada de bootstrap (default: 5s) |
| `ACCOUNT_LINKING_ENABLED` | SaaS backend | Habilita endpoints de core-link (default: False) |
| `CORE_LINKING_SHARED_SECRET` | SaaS backend | Secreto para tokens de linking via token |
| `CORE_LINKING_TOKEN_MAX_AGE_SECONDS` | SaaS backend | TTL de los tokens de linking (default: 300s) |
| `VITE_CORE_API_BASE_URL` | SaaS frontend | URL del Core backend desde el navegador |

---

## 6. Quick diagnosis of integration problems

| Symptom | Probable cause | Action |
|---------|---------------|--------|
| Registration fails with "Could not connect to Core" | `CORE_API_BASE_URL` misconfigured or Core down | Check `docker compose ps` in Core, check `CORE_API_BASE_URL` |
| Frontend does not load asset/movement data | `VITE_CORE_API_BASE_URL` wrong or CORS | Review `.env` of the SaaS frontend, review CORS in Core |
| 401 en llamadas a Core desde frontend | Tokens distintos (`JWT_SIGNING_KEY` diferente) | Verificar que ambos stacks usen el mismo `JWT_SIGNING_KEY` |
| Token de linking rechazado | `CORE_LINKING_SHARED_SECRET` no coincide o token expirado | Verificar secret, generar nuevo token |