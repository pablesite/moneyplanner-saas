# Core/SaaS Boundaries

## Objective
Definir boundaries coherentes con la estrategia `Open-Core + SaaS`:
1. `Core` como baseline funcional real (sin bloqueos artificiales)
2. `SaaS` como infraestructura/operacion
3. `SaaS` como valor centralizado y colaboracion cloud

## Rebaseline (2026-02-26)
### Regla principal
1. Si una capacidad puede ejecutarse localmente sin perder valor esencial, debe tender a `Core`.
2. Si requiere servidor central, datos agregados o escala/operacion continua, debe ir a `SaaS`.

## Boundary target (alto nivel)
### Core (source of truth del baseline funcional)
1. `Patrimonio`
2. `Presupuesto`
3. `Contabilidad` (incluyendo cierres v1)
4. `Introduccion de datos` y asistentes
5. `Coach financiero` v1 (base)
6. `Familia` como modelo logico local (hogar/titularidad)
7. `Simulador` basico local (cuando entre)
8. `Cartera de inversion` basica (cuando entre)

### SaaS (infra/operacion)
1. Hosting gestionado
2. Backups automaticos
3. Acceso multidispositivo
4. PWA y canal mobile cloud
5. Observabilidad / despliegues / seguridad operativa

### SaaS (valor centralizado y cloud-native)
1. Benchmark anonimo con dataset agregado
2. Simulacion intensiva (Montecarlo / calculo pesado)
3. LLM conversacional cloud
4. ASTRA cloud-native
5. Familia cloud avanzada (multi-login, privacidad por miembro)

## Estado actual del codigo (gap de boundary)
1. `core/frontend` ya contiene parte importante del baseline funcional (`Guia`, `Patrimonio`, `Presupuesto`, `Introduccion de datos`).
2. `frontend` (SaaS) extiende con `People`/`ownership`, `Account`, `Admin`.
3. `backend/memberships` concentra hoy `FamilyMember`, `Ownership`, `OwnershipLink` (SaaS).
4. `core/backend/net_worth` ya no contiene el modelo de titularidad/familia (quedo retirado de Core).
5. El gating SaaS sigue apoyado en `premium` binario, lo que mezcla boundary tecnico con packaging historico.

## Primera reorganizacion obligatoria (R0)
### 1. Separar familia en dos capas
1. `Core`: modelo logico de hogar/titularidad (single-user local, ownership assignment, vistas conjuntas/individuales).
2. `SaaS`: colaboracion cloud (miembros con login, privacidad, permisos y vistas compartidas).

### 2. Mantener compatibilidad temporal
1. No romper `memberships` ni endpoints actuales de golpe.
2. Introducir bridge/adapters mientras se mueve la logica base.
3. Mantener `compat.people` / `compat.ownership` en frontend mientras migra el gating.

### 3. Evitar duplicacion estructural
1. `core/frontend` debe ser el baseline de UI para features base.
2. `frontend` (SaaS) debe extender por capabilities y rutas extra, no duplicar vistas completas salvo necesidad real.
3. Documentar divergencias aceptadas.

## Data Boundaries (target)
### Core-owned data
1. Entidades financieras base (assets, liabilities, budget, accounting, snapshots).
2. Modelo logico de familia/titularidad local.
3. Datos de coach y simulador local (cuando existan).

### SaaS-owned data
1. Usuarios SaaS, auth, RBAC, admin.
2. Suscripciones/planes/billing.
3. Relaciones cloud de colaboracion familiar (miembros-login, privacidad, permisos).
4. Datos agregados anonimizados y workloads centralizados.

## API Boundaries (target)
1. Endpoints base de producto en `Core`.
2. Endpoints cloud de operacion/identity/billing en `SaaS`.
3. Endpoints cloud de valor centralizado en `SaaS`.
4. Adapters explicitamente separados en frontend (`coreApi` vs cloud/premium adapters).

## Frontend Boundaries (target)
1. `core/frontend` = implementacion canonica de experiencia base.
2. `frontend` (SaaS) = shell cloud + extensiones + features cloud.
3. Gating por helpers/capabilities, no por checks dispersos (`isPremium` como fuente principal).

## Synchronization
1. Canonical sync direction: `core -> saas` para baseline compartido.
2. Sync manifest: `scripts/frontend-sync-manifest.txt`.
3. Sync script: `scripts/sync_frontend_from_core.ps1`.
4. Toda divergencia en SaaS debe estar justificada por capability/boundary.

## Decision checklist (antes de crear/mover una feature)
1. Se puede ejecutar localmente y entregar valor esencial? -> `Core`
2. Requiere servidor central o dataset agregado? -> `SaaS`
3. Es colaboracion multiusuario cloud con permisos/privacidad? -> `SaaS`
4. Es UX base compartida por Core y SaaS? -> implementar primero en `core/frontend`

## Referencias
1. `docs/roadmap/roadmap.md`
2. `docs/architecture/capabilities-matrix.md`
3. `backend/memberships/models.py`
4. `frontend/src/domains/capabilities/index.ts`
5. `core/frontend/src/domains/capabilities/index.ts`
