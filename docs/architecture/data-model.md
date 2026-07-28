# SaaS Data Model

This document describes the SaaS backend data models (`backend/saas_access/models.py`) and their relationships. Does not include Core models, which are canonical in `core/docs/`.

## Entidades

### Django User (built-in)
Django standard user model. It is the anchor for all other SaaS entities. Each SaaS user is associated with exactly one `SaasAccessProfile`, one `SaasSubscription`, and optionally one `SaasCoreAccountLink`.

### SaasAccessProfile
Defines the user's role within the SaaS platform.

| Field | Type | Description |
|-------|------|-------------|
| `user` | OneToOne → User | Propietario del perfil |
| `role` | CharField | `saas_admin` o `saas_member` (default: `saas_member`) |
| `must_change_password` | BooleanField | Marca credenciales temporales creadas por un admin y bloquea cualquier API de producto hasta que el propio usuario complete el cambio de contraseña |
| `created_at` | DateTimeField | Automatic creation |
| `updated_at` | DateTimeField | Last modified |

**Roles:**
- `saas_admin`: platform manager. For administration operations only (user CRUD, metrics, etc.). **You are not a product user** — you should not have access to Core views or `FamilyMember` in Core.
- `saas_member`: product user. You can use the app. Receives bootstrap in Core upon creation.

**Critical invariant:** There must always be at least one active `saas_admin`. `rbac_services.ensure_user_can_lose_admin_role` guarantees this before any downgrade or deactivation.

**Known Debt:** The restriction that prevents a `saas_admin` from accessing product views is not implemented. Technically you can call the Core APIs with your JWT.

---

### SaasSubscription
User subscription status.

| Field | Type | Description |
|-------|------|-------------|
| `user` | OneToOne → User | Propietario |
| `status` | CharField | `trial`, `active`, `past_due`, `canceled` (default: `trial`) |
| `started_at` | DateTimeField | Automatic creation |
| `updated_at` | DateTimeField | Last modified |

**`is_premium_enabled()`** devuelve `True` si `status` es `trial` o `active`. Durante el piloto, todos los usuarios son `trial`.

---

### SaasCoreAccountLink
Registration of the link between a SaaS user and its corresponding user in Core.

| Field | Type | Description |
|-------|------|-------------|
| `user` | OneToOne → User | Linked SaaS User |
| `core_user_ref` | CharField(128) | Unique identifier of the user in Core (unique) |
| `core_username` | CharField(150) | Username en Core (informativo) |
| `core_email` | EmailField | Email en Core (informativo) |
| `is_active` | BooleanField | If the link is active |
| `linked_at` | DateTimeField | Automatic creation |
| `updated_at` | DateTimeField | Last modified |

A `core_user_ref` can only be linked to one SaaS user at a time (unique constraint).

---

### SaasConsumedCoreLinkToken
Record of binding tokens already used. Implements idempotence: a linking token can only be used once.

| Field | Type | Description |
|-------|------|-------------|
| `user` | FK → User | User who consumed the token |
| `jti` | CharField(64) | JWT ID del token consumido (unique) |
| `consumed_at` | DateTimeField | Automatic creation |

---

### SaasAuthAuditEvent
Log of authentication events and administrative operations.

| Field | Type | Description |
|-------|------|-------------|
| `event` | CharField(64) | Event type (see events table below) |
| `outcome` | CharField(16) | `success` o `failed` |
| `actor_user` | FK → User (nullable) | User who executed the action |
| `metadata` | JSONField | Additional event information |
| `created_at` | DateTimeField | Automatic creation |

**Eventos auditados:**

| `event` | Description |
|---------|-------------|
| `login` | Intento de login |
| `core_account_link` | Manual Core Account Linking |
| `core_account_unlink` | Core account unlinking |
| `core_account_link_from_token` | Linking via shared token |
| `password_change` | User changes their own SaaS password |
| `logout` | User explicitly revokes the current refresh session |

### SaasLoginThrottleState

Stores only a SHA-256 hash of a normalized username plus the current failed-login window. After the configured threshold, authentication remains blocked temporarily while returning the same generic `401` response used for invalid credentials.

| Field | Type | Description |
|-------|------|-------------|
| `username_hash` | CharField(unique) | One-way identifier; the username is never persisted here |
| `failed_attempts` | PositiveSmallIntegerField | Failures in the active window |
| `first_failed_at` | DateTimeField | Start of the active failure window |
| `blocked_until` | DateTimeField(nullable) | End of the temporary account lock |
| `saas_admin_user_create` | Admin creates a user |
| `saas_admin_role_change` | Admin changes a user's role |
| `saas_admin_status_change` | Admin activates/deactivates a user |
| `saas_admin_user_delete` | Admin deletes a user |

---

## Lifecycle of a user

```
Registro (POST /api/auth/register/)
    │
    ├─ create_user()                        → Django User creado
    ├─ get_or_create_subscription()         → SaasSubscription (status=trial)
    ├─ get_or_create_access_profile()       → SaasAccessProfile (role=saas_member)
    └─ ensure_primary_family_member_in_core_for_saas_user()
                                            → POST Core /api/family-members/ensure-primary/
                                            → (falla si Core no está disponible)

Status normal (piloto)
    │
    ├─ role: saas_member
    ├─ subscription: trial
    └─ core_link: presente (creado durante registro)

Operaciones admin
    ├─ Crear usuario: POST /api/admin/users/  → `must_change_password=true`
    ├─ Primer login del usuario creado por admin
    │   ├─ GET /api/auth/me/                  → informa `must_change_password=true`
    │   ├─ Cualquier API de producto/Core     → rechazada hasta cambiar la contraseña
    │   └─ POST /api/auth/password/change/    → limpia `must_change_password`, revoca sesiones previas y entrega una nueva sesión
    ├─ Cambiar rol: PATCH /api/admin/users/{id}/role/
    ├─ Activar/desactivar: PATCH /api/admin/users/{id}/status/
    └─ Eliminar: DELETE /api/admin/users/{id}/
```

## Tabla de nombres de tablas en BD

| Modelo | Tabla |
|--------|-------|
| User | `auth_user` |
| SaasAccessProfile | `memberships_saasaccessprofile` |
| SaasSubscription | `memberships_saassubscription` |
| SaasCoreAccountLink | `memberships_saascoreaccountlink` |
| SaasConsumedCoreLinkToken | `memberships_saasconsumedcorelinktoken` |
| SaasAuthAuditEvent | `memberships_saasauthauditevent` |
| SaasLoginThrottleState | `memberships_saasloginthrottlestate` |

> Note: table names are prefixed with `memberships_` for historical reasons even though the app is now called `saas_access`. Do not rename without careful migration.
