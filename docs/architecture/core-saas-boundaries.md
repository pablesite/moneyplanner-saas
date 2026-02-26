# Fronteras Core / SaaS

## Principio rector
1. Core = herramienta completa, inteligente y sin fricción.
2. SaaS = infraestructura, potencia centralizada y ecosistema.
3. Se monetiza lo que requiere servidor central o escalabilidad.

## Qué vive en Core (actual)
1. Patrimonio (`net worth`)
2. Presupuesto y cierre mensual
3. Introducción de datos
4. Guía / coach financiero v1
5. Familia / titularidad (`memberships` en `core/backend`)
6. Simulación y módulos base del dominio (según roadmap)

## Qué vive en SaaS backend (actual)
1. Auth SaaS
2. RBAC (`saas_admin`, `saas_member`)
3. Suscripción/estado (`trial`, `active`, ...)
4. Administración de usuarios SaaS
5. Linking SaaS <-> Core
6. Auditoría de auth/admin

## Qué consume el frontend SaaS desde Core
1. `net-worth`
2. `budget`
3. `core` (guía/score)
4. `family/ownership`

## Despliegue SaaS (piloto y producción)
1. `core/backend` desplegado
2. `backend` SaaS desplegado
3. `frontend` SaaS desplegado
4. Configurar `CORE_API_BASE_URL` en backend SaaS

## Nota
1. `backend/memberships` fue eliminado del SaaS.
2. El bootstrap de familia al crear usuarios SaaS se ejecuta en Core vía endpoint `ensure-primary`.
