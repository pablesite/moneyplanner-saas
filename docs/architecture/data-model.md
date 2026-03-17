# Modelo de Datos SaaS

Este documento describe los modelos de datos del backend SaaS (`backend/saas_access/models.py`) y sus relaciones. No incluye los modelos de Core, que son canónicos en `core/docs/`.

## Entidades

### Django User (built-in)
Modelo de usuario estándar de Django. Es el ancla de todo el resto de entidades SaaS. Cada usuario SaaS tiene asociados exactamente un `SaasAccessProfile`, una `SaasSubscription`, y opcionalmente un `SaasCoreAccountLink`.

### SaasAccessProfile
Define el rol del usuario dentro de la plataforma SaaS.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | OneToOne → User | Propietario del perfil |
| `role` | CharField | `saas_admin` o `saas_member` (default: `saas_member`) |
| `created_at` | DateTimeField | Creación automática |
| `updated_at` | DateTimeField | Última modificación |

**Roles:**
- `saas_admin`: gestor de la plataforma. Solo para operaciones de administración (CRUD de usuarios, métricas, etc.). **No es un usuario del producto** — no debería tener acceso a las vistas de Core ni `FamilyMember` en Core.
- `saas_member`: usuario del producto. Puede usar la app. Recibe bootstrap en Core al crearse.

**Invariante crítica:** siempre debe existir al menos un `saas_admin` activo. `rbac_services.ensure_user_can_lose_admin_role` lo garantiza antes de cualquier degradación o desactivación.

**Deuda conocida:** la restricción que impide a un `saas_admin` acceder a las vistas de producto no está implementada. Técnicamente puede llamar a las APIs de Core con su JWT.

---

### SaasSubscription
Estado de la suscripción del usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | OneToOne → User | Propietario |
| `status` | CharField | `trial`, `active`, `past_due`, `canceled` (default: `trial`) |
| `started_at` | DateTimeField | Creación automática |
| `updated_at` | DateTimeField | Última modificación |

**`is_premium_enabled()`** devuelve `True` si `status` es `trial` o `active`. Durante el piloto, todos los usuarios son `trial`.

---

### SaasCoreAccountLink
Registro del vínculo entre un usuario SaaS y su correspondiente usuario en Core.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | OneToOne → User | Usuario SaaS vinculado |
| `core_user_ref` | CharField(128) | Identificador único del usuario en Core (unique) |
| `core_username` | CharField(150) | Username en Core (informativo) |
| `core_email` | EmailField | Email en Core (informativo) |
| `is_active` | BooleanField | Si el vínculo está activo |
| `linked_at` | DateTimeField | Creación automática |
| `updated_at` | DateTimeField | Última modificación |

Un `core_user_ref` solo puede estar vinculado a un usuario SaaS a la vez (unique constraint).

---

### SaasConsumedCoreLinkToken
Registro de tokens de vinculación ya utilizados. Implementa idempotencia: un token de linking solo puede usarse una vez.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | FK → User | Usuario que consumió el token |
| `jti` | CharField(64) | JWT ID del token consumido (unique) |
| `consumed_at` | DateTimeField | Creación automática |

---

### SaasAuthAuditEvent
Log de eventos de autenticación y operaciones administrativas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `event` | CharField(64) | Tipo de evento (ver tabla de eventos más abajo) |
| `outcome` | CharField(16) | `success` o `failed` |
| `actor_user` | FK → User (nullable) | Usuario que ejecutó la acción |
| `metadata` | JSONField | Datos adicionales del evento |
| `created_at` | DateTimeField | Creación automática |

**Eventos auditados:**

| `event` | Descripción |
|---------|-------------|
| `login` | Intento de login |
| `core_account_link` | Vinculación manual de cuenta Core |
| `core_account_unlink` | Desvinculación de cuenta Core |
| `core_account_link_from_token` | Vinculación via token compartido |
| `saas_admin_user_create` | Admin crea un usuario |
| `saas_admin_role_change` | Admin cambia el rol de un usuario |
| `saas_admin_status_change` | Admin activa/desactiva un usuario |
| `saas_admin_user_delete` | Admin elimina un usuario |

---

## Ciclo de vida de un usuario

```
Registro (POST /api/auth/register/)
    │
    ├─ create_user()                        → Django User creado
    ├─ get_or_create_subscription()         → SaasSubscription (status=trial)
    ├─ get_or_create_access_profile()       → SaasAccessProfile (role=saas_member)
    └─ ensure_primary_family_member_in_core_for_saas_user()
                                            → POST Core /api/family-members/ensure-primary/
                                            → (falla si Core no está disponible)

Estado normal (piloto)
    │
    ├─ role: saas_member
    ├─ subscription: trial
    └─ core_link: presente (creado durante registro)

Operaciones admin
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

> Nota: los nombres de tabla tienen prefijo `memberships_` por razones históricas aunque el app ahora se llame `saas_access`. No renombrar sin una migración cuidadosa.