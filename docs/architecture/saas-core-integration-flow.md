# Flujo de Integración SaaS ↔ Core

## Principio fundamental

SaaS y Core comparten la misma `JWT_SIGNING_KEY`. Esto permite que un token emitido por SaaS sea aceptado por Core sin ninguna negociación adicional. Es el mecanismo que hace posible tanto el bootstrap servidor-a-servidor como el acceso del frontend SaaS a las APIs de Core.

---

## 1. Flujo de login

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

**Gestión de expiración** (`lib/api.ts`): cuando cualquier petición devuelve 401, el frontend intenta refresh automático via `/api/auth/refresh/`. Si el refresh falla, limpia tokens y redirige a `/login?reason=session_expired`. Las peticiones pendientes durante el refresh se encolan y se reintentan con el nuevo token.

---

## 2. Flujo de registro (bootstrap automático)

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

> **Riesgo conocido:** el bootstrap es síncrono y sin reintentos. Si Core no está disponible, el registro falla completamente. No hay estado "usuario SaaS sin bootstrap pendiente". Es una decisión deliberada: la consistencia se prioriza sobre la disponibilidad en el registro.

El mismo bootstrap se ejecuta también cuando:
- Un admin crea un usuario con `POST /api/admin/users/` (si rol = `saas_member`)
- Un admin cambia el rol a `saas_member` con `PATCH /api/admin/users/{id}/role/`

La operación es idempotente en Core: si el `FamilyMember` primario ya existe, no falla ni duplica.

---

## 3. Vinculación de cuentas (Core Link)

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
Para flujos donde Core inicia el linking (p.ej., migración self-hosted → cloud):

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

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `JWT_SIGNING_KEY` | SaaS backend + Core backend | **Debe ser igual** en ambos stacks |
| `CORE_API_BASE_URL` | SaaS backend | URL del Core backend (server-to-server, ej: `http://core-backend:8000`) |
| `CORE_BOOTSTRAP_TIMEOUT_SECONDS` | SaaS backend | Timeout de la llamada de bootstrap (default: 5s) |
| `ACCOUNT_LINKING_ENABLED` | SaaS backend | Habilita endpoints de core-link (default: False) |
| `CORE_LINKING_SHARED_SECRET` | SaaS backend | Secreto para tokens de linking via token |
| `CORE_LINKING_TOKEN_MAX_AGE_SECONDS` | SaaS backend | TTL de los tokens de linking (default: 300s) |
| `VITE_CORE_API_BASE_URL` | SaaS frontend | URL del Core backend desde el navegador |

---

## 6. Diagnóstico rápido de problemas de integración

| Síntoma | Causa probable | Acción |
|---------|---------------|--------|
| Registro falla con "No se pudo conectar con Core" | `CORE_API_BASE_URL` mal configurado o Core caído | Verificar `docker compose ps` en Core, revisar `CORE_API_BASE_URL` |
| Frontend no carga datos de patrimonio/movimientos | `VITE_CORE_API_BASE_URL` incorrecto o CORS | Revisar `.env` del frontend SaaS, revisar CORS en Core |
| 401 en llamadas a Core desde frontend | Tokens distintos (`JWT_SIGNING_KEY` diferente) | Verificar que ambos stacks usen el mismo `JWT_SIGNING_KEY` |
| Token de linking rechazado | `CORE_LINKING_SHARED_SECRET` no coincide o token expirado | Verificar secret, generar nuevo token |