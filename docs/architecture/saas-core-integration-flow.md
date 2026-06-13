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

## 4. Lectura administrativa de usuarios Core desde SaaS

El panel de admin del SaaS tambien consulta todos los usuarios existentes en Core. Esto permite distinguir:

1. usuarios creados nativamente en Core,
2. usuarios provisionados automaticamente desde SaaS via `ExternalIdentity`,
3. usuarios enlazados manualmente mediante `SaasCoreAccountLink`.

```
SaaS Backend
  │
  └─ GET {CORE_API_BASE_URL}/api/auth/admin/users/
       X-SaaS-Bridge-Secret: {CORE_LINKING_SHARED_SECRET}
          │
          └─ Core Backend
               ├─ valida el header compartido
               └─ devuelve usuarios Core + external_identities
```

Con esa respuesta, el backend SaaS cruza:

1. `ExternalIdentity.external_user_id` -> `auth.User.id` del SaaS para detectar bootstrap
2. `SaasCoreAccountLink.core_user_ref=core_user:{id}` para detectar vinculos manuales

Y expone en `GET /api/admin/users/` dos colecciones:

1. `saas_users`
2. `core_users`

---

## 5. Acceso del frontend a Core

El frontend mantiene dos clientes Axios (`lib/api.ts`):

| Cliente | Variable | Destino | Usado por |
|---------|----------|---------|-----------|
| `api` | `VITE_API_BASE_URL` | SaaS backend (8001) | `auth`, operaciones SaaS |
| `coreApi` | `VITE_CORE_API_BASE_URL` | Core backend (8000) | Todos los dominios de producto |

Ambos clientes tienen instalados los mismos interceptores de auth (request: inyecta Bearer, response: gestiona 401 y refresh). El mismo token sirve para ambos porque comparten `JWT_SIGNING_KEY`.

### Production routing

In the private SaaS production deployment, both frontend clients use the same public origin:

```bash
VITE_API_BASE_URL=""
VITE_CORE_API_BASE_URL=""
```

The public URL is `https://arkenstone.app`. Traffic reaches the server through Cloudflare Tunnel, then Traefik, then Docker services attached to the external `proxy` network.

Traefik path routing owns the split:
1. SaaS backend: `/api/auth`, `/api/admin`, `/api/schema`, `/api/docs`, `/admin`.
2. Core backend auth exceptions with higher priority: `/api/auth/settings`, `/api/auth/link-token`.
3. Core backend product paths: `/api/net-worth`, `/api/budget`, `/api/accounting`, `/api/core`, `/api/family-members`, `/api/ownerships`, `/api/ownership-links`.
4. SaaS frontend: all remaining paths.

The Core frontend is not deployed as part of SaaS production.

---

## 6. Variables de entorno relevantes

| Variable | Where | Description |
|----------|-------|-------------|
| `JWT_SIGNING_KEY` | SaaS backend + Core backend | **Debe ser igual** en ambos stacks |
| `CORE_API_BASE_URL` | SaaS backend | URL del Core backend (server-to-server, ej: `http://core_backend:8000`) |
| `CORE_API_HOST_HEADER` | SaaS backend | Host header opcional para llamadas SaaS -> Core. En el dev integrado de este repo debe ir vacio; en produccion normalmente vacio tambien. |
| `AUTH_ACCEPT_EXTERNAL_TOKENS` | Core backend | Must be `1` in SaaS production so Core accepts SaaS-issued JWTs |
| `EXTERNAL_JWT_ISSUER` | Core backend | Must match SaaS JWT issuer (`moneyplanner-saas` by default) |
| `EXTERNAL_JWT_AUDIENCE` | Core backend | Must match SaaS JWT audience (`moneyplanner-saas-api` by default) |
| `EXTERNAL_JWT_SIGNING_KEY` | Core backend | Should match `JWT_SIGNING_KEY` for SaaS-issued JWT validation |
| `CORE_BOOTSTRAP_TIMEOUT_SECONDS` | SaaS backend | Timeout de la llamada de bootstrap (default: 5s) |
| `ACCOUNT_LINKING_ENABLED` | SaaS backend | Habilita endpoints de core-link (default: False) |
| `CORE_LINKING_SHARED_SECRET` | SaaS backend + Core backend | Secreto compartido para tokens de linking y para el bridge administrativo SaaS -> Core |
| `CORE_LINKING_TOKEN_MAX_AGE_SECONDS` | SaaS backend | TTL de los tokens de linking (default: 300s) |
| `VITE_CORE_API_BASE_URL` | SaaS frontend | URL del Core backend desde el navegador |
| `SAAS_PUBLIC_REGISTRATION_ENABLED` | SaaS backend | Must be `0` for the initial private production pilot |

---

## 6.1 Configuracion recomendada por entorno

### Desarrollo local

En el entorno integrado de este repo raiz, SaaS y Core corren en la misma red Docker:

1. SaaS backend:
   - `CORE_API_BASE_URL=http://core_backend:8000`
   - `CORE_API_HOST_HEADER=localhost`
   - `CORE_API_X_FORWARDED_PROTO=`
2. Core backend:
   - `DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,core_backend`
   - `AUTH_ACCEPT_EXTERNAL_TOKENS=1`
   - issuer/audience/signing key alineados con SaaS

### Produccion

1. `CORE_API_BASE_URL` debe apuntar a la URL real alcanzable desde SaaS
2. `CORE_API_HOST_HEADER` debe quedarse vacio salvo necesidad explicita de proxy
3. Core debe aceptar el host publico real en `ALLOWED_HOSTS`
4. Core debe aceptar JWTs emitidos por SaaS con issuer/audience/signing key alineados

## 6.2 Regla operativa

Si cambia cualquier `.env` usado por Docker, hay que recrear el contenedor correspondiente. `docker restart` no recarga variables.

---

## 7. Quick diagnosis of integration problems

| Symptom | Probable cause | Action |
|---------|---------------|--------|
| Registration fails with "Could not connect to Core" | `CORE_API_BASE_URL` misconfigured or Core down | Check `docker compose ps` in Core, check `CORE_API_BASE_URL` |
| Frontend does not load asset/movement data | `VITE_CORE_API_BASE_URL` wrong or CORS | Review `.env.dev`, review CORS in Core |
| 401 en llamadas a Core desde frontend | Tokens distintos (`JWT_SIGNING_KEY` diferente) | Verificar que ambos stacks usen el mismo `JWT_SIGNING_KEY` |
| Token de linking rechazado | `CORE_LINKING_SHARED_SECRET` no coincide o token expirado | Verificar secret, generar nuevo token |
| Admin SaaS no puede ver usuarios Core | `CORE_LINKING_SHARED_SECRET` ausente o distinto entre SaaS y Core | Verificar el secret compartido y recrear contenedores si cambió `.env.dev` |
| Root URL works but API returns the SPA | Traefik path rule or priority mismatch | Review production labels and route priorities |
| Net Worth or portable-data settings fail only in production | `/api/auth/settings/` routed to SaaS instead of Core | Review the higher-priority Core auth exception router |
