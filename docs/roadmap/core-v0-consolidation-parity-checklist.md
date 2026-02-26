# Core v0 Consolidation + SaaS Mirror Checklist

## Objetivo
Consolidar una primera version estable de `Core` (backend + frontend) y, en paralelo, dejar el SaaS ejecutando exactamente la misma base funcional para un piloto gratuito con usuarios reales.

## Contexto (decision actual)
1. El frontend SaaS esta hoy mas avanzado que `core/frontend` en algunos flujos/UX.
2. Para esta iteracion de consolidacion, se toma el frontend SaaS como base de trabajo para trasladar mejoras al frontend Core.
3. Despues de esa consolidacion, `core/frontend` vuelve a ser la referencia canonica del baseline compartido.

## Resultado esperado del hito
1. `Core v0` definido y congelado (scope explicito).
2. `core/backend` y `core/frontend` alineados con ese scope.
3. SaaS en modo piloto gratis con el mismo baseline funcional del Core.
4. Diferencias SaaS limitadas a:
   - infraestructura/operacion
   - auth/cuenta/admin interno
   - extensiones cloud futuras ocultas o desactivadas
5. Documentacion lista para comunidad (incluyendo roadmap especifico del Core).

## No objetivos (en este hito)
1. Billing/pagos.
2. Packaging comercial definitivo.
3. Completar `Cartera de inversion` v1 si no llega con calidad.
4. Completar `Coach Fase 5` si compromete fecha.
5. Rehacer toda la arquitectura de planes/capabilities en backend SaaS.

## Secuencia real de trabajo (orden obligatorio)
### Fase 1 - Congelar `Core v0` (scope)
1. Crear y cerrar una checklist de alcance funcional `Core v0`.
2. Marcar explicitamente:
   - `entra`
   - `entra parcial`
   - `diferido`
3. Usar como criterio el valor real para comunidad + piloto SaaS.

### Fase 2 - Inventario de paridad `Core` vs `SaaS`
1. Levantar una matriz de paridad de frontend (rutas/vistas/UX).
2. Levantar una matriz de paridad de backend (endpoints/contratos/comportamiento).
3. Clasificar cada diferencia:
   - `trasladar a Core`
   - `mantener solo en SaaS (infra/admin)`
   - `ocultar en piloto SaaS`
   - `diferir`

### Fase 3 - Traslado frontend SaaS -> Core (bootstrap)
1. Mover al Core las mejoras de frontend SaaS que pertenecen al baseline funcional.
2. Resolver divergencias de rutas, copy, estados vacios y UX.
3. Dejar SaaS consumiendo ese baseline (no al reves) una vez consolidado.

### Fase 4 - SaaS mirror (piloto gratis)
1. Configurar/forzar SaaS para exponer el baseline Core como experiencia principal.
2. Ocultar extras no esenciales del piloto.
3. Mantener auth/cuenta/admin interno solo donde haga falta para operar.

### Fase 5 - Validacion y corte
1. Validar flujos base en Core.
2. Validar los mismos flujos en SaaS.
3. Congelar `Core v0` y abrir paso a:
   - publicacion `core/`
   - onboarding manual de testers SaaS

## Checklist de scope `Core v0` (rellenar y cerrar)
### A. Funcionalidad objetivo (producto)
1. `Patrimonio` (CRUD activos/pasivos + resumen + snapshots basicos) [entra ]
2. `Presupuesto` (planificado + ejecutado si `Milestone 14` minimo esta integrado) [entra ]
3. `Contabilidad` v1 (annual entries + check-ins/cierre mensual v1) [entra ]
4. `Introduccion de datos` (flujo usable de alta y edicion) [entra ]
5. `Coach financiero` base usable con fases actuales (sin exigir Fase 5) [ entra]
6. `Data portability` basica (export/import portable actual) [ entra]

### B. Puede entrar parcial (si llega con calidad)
1. `Onboarding asistido` / checklist (sin wizard completo) [diferido ]
2. `Cartera de inversion` v1 basica [ diferido]
3. `Simulador financiero` v1 local [diferido ]

### C. Diferido (documentar explicitamente)
1. `Coach Fase 5` [diferido ]
2. Billing/pagos SaaS [ diferido]
3. PWA completa/offline [diferido ]
4. Benchmarking/LLM cloud/ASTRA [diferido ]
5. Familia cloud avanzada (multi-login + privacidad por miembro) [ diferido]

## Matriz de paridad - Frontend (primera version, basada en rutas actuales)
Columnas recomendadas:
1. `Area`
2. `Core frontend (estado)`
3. `SaaS frontend (estado)`
4. `Decision`
5. `Accion`
6. `Owner`
7. `Estado`

### Matriz inicial (rellenada)
| Area | Core frontend (estado) | SaaS frontend (estado) | Decision | Accion | Owner | Estado |
|---|---|---|---|---|---|---|
| `Home / shell / navigation` | Existe; rutas base mas simples (`/`, `/inicio` diferencias menores) | Mas avanzado; shell con rutas extra (`/account`, admin, settings, monthly-close) | `igualar con SaaS` (excepto admin) | Alinear rutas/base shell/nav de Core con SaaS para que ambos frontends queden iguales de momento, excluyendo `Admin users` | `Pablo` | `en progreso (rutas + App shell + HomeView mapa de fases portados; falta QA visual final)` |
| `Patrimonio` | Existe (`NetWorthView`) | Existe (`NetWorthView`), probable UX mas madura por iteraciones SaaS | `trasladar a Core` | Comparar vista + componentes + composables/stores y portar mejoras de UX/estados vacios | `Pablo` | `en progreso (NetWorthView SaaS portada y compilando)` |
| `Presupuesto` | Existe (`/presupuesto`) | Existe (`/presupuesto`) + soporte `monthly-close` en misma vista | `trasladar a Core` (baseline) | Portar mejoras UX de presupuesto; decidir si `monthly-close` entra en Core v0 como modo o ruta | `Pablo` | `pendiente` |
| `Cierre mensual` | No expuesto como ruta dedicada | Ruta `/cierre-mensual` en SaaS (modo de `BudgetDashboardView`) | `trasladar a Core` | Replicar modo/ruta en Core y alinear flujo/copy con SaaS | `Pablo` | `pendiente` |
| `Introduccion de datos` | Existe (`DataInputView`) | Existe (`DataInputView`), posible UX mas madura | `trasladar a Core` | Comparar UX y portar mejoras del flujo de captura al Core | `Pablo` | `en progreso (DataInputView SaaS portado + adaptacion Core basica)` |
| `Guia / coach` | Existe (`GuidePhaseDetailView`, ruta `guide-phase-detail`) | Existe (`GuidePhaseDetailView`, ruta `guide-phase`) | `trasladar a Core` (UX/nombres/rutas) | Unificar nombres/rutas/copy y llevar al Core la variante mas madura; mantener SaaS mirror igual | `Pablo` | `hecho (vista + componentes + diagnostics en paridad)` |
| `Data / auxiliares` | Existe ruta `/data` (vista general) | Existe `/data` + subrutas `/data/fx` y `/data/ipc` | `trasladar a Core` | Trasladar tal cual a Core (`/data`, `/data/fx`, `/data/ipc`) y mantener paridad con SaaS | `Pablo` | `pendiente` |
| `Auth` | Existe `LoginView` + guard sobre backend Django Core | Existe `LoginView` + guard + contexto SaaS (sesion/cuenta) | `igualar UX` + `mantener backend auth distinto` | Mantener login Core contra backend Django Core; trasladar UX/flujo comun donde aplique. La gestion de miembros/familia en Core no cambia el mecanismo de login base | `Pablo` | `pendiente` |
| `Account` | No existe | Existe `AccountView` (`/account`) | `trasladar a Core` | Portar `AccountView`/ruta a Core y adaptar acciones para contexto Core (sin acoplar a billing SaaS) | `Pablo` | `pendiente` |
| `Admin users` | No existe | Existe `AdminUsersView` (`/admin/users`) | `mantener solo en SaaS (infra/admin)` | Mantener solo para uso interno; excluir de experiencia piloto de usuario final | `Pablo` | `pendiente` |
| `People / ownership` | No existe como vista/ruta | Existe `PeopleView` y ruta condicional por `capabilities.people` | `trasladar a Core` | Portar `PeopleView` y flujo de ownership a Core desde ya; despues dejar SaaS y Core con el mismo comportamiento base | `Pablo` | `pendiente` |

### Diferencias de rutas detectadas ya (para arrancar la auditoria)
1. `Core` usa `/` como `networth` y `/inicio` como `home`; `SaaS` usa `/` como `home` y `/patrimonio` como `networth`.
2. `SaaS` anade `/cierre-mensual`, `/data/fx`, `/data/ipc`, `/account`, `/admin/users`, `/people` (condicional); segun decisiones actuales, todas salvo `admin/users` pasan a Core.
3. `Guia` tiene mismo componente pero distinto nombre de ruta (`guide-phase-detail` vs `guide-phase`).

### Criterio de decision (frontend)
1. Si es UX base y aporta a Core -> `trasladar a Core`
2. Si es shell/infra SaaS -> `mantener solo en SaaS`
3. Si existe pero no entra en piloto -> `ocultar en SaaS` y/o `diferir`

## Matriz de paridad - Backend (rellenar durante la auditoria)
Columnas recomendadas:
1. `Dominio`
2. `Core backend`
3. `SaaS backend`
4. `Decision`
5. `Accion`
6. `Riesgo`
7. `Estado`

### Filas iniciales sugeridas
1. `net_worth`
2. `budget`
3. `data input / annual entries`
4. `monthly check-ins / cierres`
5. `auth`
6. `memberships (family/ownership)`
7. `rbac/admin`
8. `subscription/profile access`

### Criterio de decision (backend)
1. Dominio financiero base -> debe existir/estabilizarse en `Core`
2. Infra/auth/rbac/admin -> `SaaS`
3. Familia logica local -> objetivo `Core` (puede requerir bridge temporal)
4. Colaboracion cloud/privacidad -> `SaaS`

## Traslado frontend SaaS -> Core (plan tecnico)
### Paso T1 - Inventario de divergencias (sin editar)
1. Comparar rutas `core/frontend/src/router.ts` vs `frontend/src/router.ts`.
2. Comparar vistas baseline:
   - `Home`
   - `Patrimonio`
   - `Presupuesto`
   - `Introduccion de datos`
   - `Guia`
3. Comparar dominios/composables/stores compartidos.

### Resultado T1 (primera pasada, codigo actual)
#### Rutas / shell detectadas
1. Diferencias de routing a trasladar a Core:
   - `/` -> `home` (SaaS) vs `networth` (Core)
   - `/inicio` -> redirect a `/` (SaaS) vs ruta `home` real (Core)
   - `/patrimonio` (SaaS) falta en Core
   - `/cierre-mensual` (SaaS) falta en Core
   - `/data/fx` y `/data/ipc` (SaaS) faltan en Core
   - `/account` (SaaS) falta en Core
   - `/people` (SaaS, condicional) falta en Core
2. Ruta que NO pasa a Core:
   - `/admin/users` (solo SaaS interno)
3. Diferencia menor a unificar:
   - nombre de ruta `Guia`: `guide-phase` (SaaS) vs `guide-phase-detail` (Core)

#### Slice 1 - `Home / shell / navigation`
##### Archivos a revisar/trasladar
1. `frontend/src/router.ts` -> base de alineacion de rutas en Core (con exclusion de `admin/users`)
2. `core/frontend/src/router.ts` -> destino del traslado
3. `frontend/src/domains/auth/components/AppHeader.vue` y `core/frontend/src/domains/auth/components/AppHeader.vue` -> comparar UX/header (si difieren)

##### Decision de T1
1. Trasladar a Core el esquema de rutas/base shell de SaaS (excepto `admin/users`).
2. Mantener `admin/users` solo en SaaS.

#### Slice 2 - `Cierre mensual`
##### Archivos a revisar/trasladar
1. `frontend/src/router.ts` (ruta `/cierre-mensual`)
2. `frontend/src/views/BudgetDashboardView.vue` (modo `monthly-close`)
3. `core/frontend/src/views/BudgetDashboardView.vue` (destino)

##### Hallazgo T1
1. `BudgetDashboardView.vue` de SaaS es claramente mas avanzada (incluye `mode: 'monthly-close'` y logica de check-ins/resumen mensual).
2. Esta vista es candidata directa a traslado SaaS -> Core (con adaptaciones de API si aparecieran).

#### Slice 3 - `Data / auxiliares` (trasladar tal cual a Core)
##### Archivos a trasladar (UI/rutas)
1. `frontend/src/views/AuxDataView.vue` -> `core/frontend/src/views/AuxDataView.vue`
2. `frontend/src/views/SettingsFxView.vue` -> nuevo en `core/frontend/src/views/SettingsFxView.vue`
3. `frontend/src/views/SettingsIpcView.vue` -> nuevo en `core/frontend/src/views/SettingsIpcView.vue`
4. `frontend/src/router.ts` -> portar rutas `/data/fx` y `/data/ipc`

##### Dependencias de dominio
1. `frontend/src/domains/aux-data/*` ya tiene paridad estructural con `core/frontend/src/domains/aux-data/*`
2. La diferencia principal esta en vistas/rutas y en la integracion de familia dentro de `AuxDataView`

##### Nota T1
1. `frontend/src/views/AuxDataView.vue` incorpora `FamilyMemberManager` y `OwnershipManager`; al pasar `People/ownership` a Core, este traslado encaja con tu decision.

#### Slice 4 - `People / ownership` (traspasar a Core desde ya)
##### Archivos base a trasladar
1. `frontend/src/views/PeopleView.vue` -> nuevo en `core/frontend/src/views/PeopleView.vue`
2. `frontend/src/domains/people/**` -> nuevo dominio en `core/frontend/src/domains/people/`
3. `frontend/src/stores/people.ts` -> `core/frontend/src/stores/people.ts`

##### Dependencias adicionales (muy importantes)
1. `frontend/src/lib/netWorthOwnership.ts` -> `core/frontend/src/lib/netWorthOwnership.ts`
2. Integracion en `frontend/src/domains/net-worth/*` (API/store/composables/extensions/components) con ownership
3. Ruta `/people` en router Core (sin gating condicional, salvo que decidas mantenerlo por compat)

##### Hallazgo T1
1. No es solo "copiar `PeopleView`"; el soporte de ownership ya toca `net-worth` en SaaS.
2. El traslado correcto requiere portar tambien la capa de integracion de ownership en `net-worth`.
3. El slice no queda funcional end-to-end hasta portar/activar endpoints de `family-members` y `ownerships` en `core/backend`.

#### Slice 5 - `Account` (trasladar a Core con adaptacion)
##### Archivos UI a trasladar
1. `frontend/src/views/AccountView.vue` -> nuevo en `core/frontend/src/views/AccountView.vue`
2. Ruta `/account` desde `frontend/src/router.ts` -> `core/frontend/src/router.ts`

##### Dependencias SaaS-especificas (NO copiar tal cual)
1. `frontend/src/domains/auth/accountApi.ts` (usa endpoints SaaS `/api/auth/mode`, `/api/auth/me`, `/api/auth/subscription`, `/api/auth/core-link`)
2. `frontend/src/domains/auth/composables.ts` -> `useSaasAccountPage()` depende de APIs SaaS y de conceptos de suscripcion/role SaaS
3. `frontend/src/domains/auth/adminApi.ts` y `useSaasAdminUsersPage()` (solo SaaS)

##### Adaptacion requerida en Core
1. Crear una variante `useCoreAccountPage()` o `useAccountPage()` compatible con endpoints Core reales.
2. Reutilizar `AccountView` como base de UX, pero con campos/acciones soportados por Core.
3. No arrastrar logica de admin SaaS ni billing al Core.

#### Slice 6 - `Auth` (matiz confirmado)
##### Hallazgo T1
1. `useLoginForm()` existe en ambos lados y es muy parecido.
2. En SaaS, `auth/composables.ts` incluye ademas `useSaasAccountPage()` y `useSaasAdminUsersPage()`.
3. El login Core debe seguir autenticando contra backend Django Core (`core/frontend/src/domains/auth/api.ts`), aunque el Core tenga `People/ownership`.

##### Accion T1
1. Unificar UX de login donde sea util.
2. Mantener backend auth separado (`Core` vs `SaaS`).

### Paso T2 - Definir paquete de traslado
1. Lista de archivos SaaS que pasan a Core tal cual.
2. Lista de archivos que pasan con adaptacion por capabilities.
3. Lista de archivos que se quedan solo en SaaS (`Account`, `Admin`, cloud-only).

### Resultado T2 (paquete de traslado inicial)
#### A. Pasa a Core "tal cual" (primera ola)
1. `frontend/src/views/SettingsFxView.vue` -> `core/frontend/src/views/SettingsFxView.vue`
2. `frontend/src/views/SettingsIpcView.vue` -> `core/frontend/src/views/SettingsIpcView.vue`
3. Rutas Core para `/data/fx` y `/data/ipc` (copiando esquema SaaS)
4. Ajustes de routing base (`/`, `/inicio`, `/patrimonio`) para aproximar shell/nav a SaaS

#### B. Pasa a Core con adaptacion (segunda ola inmediata)
1. `frontend/src/views/AccountView.vue` (UX base) -> adaptar a endpoints/auth del Core
2. `frontend/src/views/BudgetDashboardView.vue` -> traslado a Core para soportar `monthly-close` y mejoras de presupuesto
3. `frontend/src/views/AuxDataView.vue` -> trasladar cuando tambien entre `domains/people` en Core

#### C. Pasa a Core con adaptacion amplia (slice grande)
1. `frontend/src/views/PeopleView.vue`
2. `frontend/src/domains/people/**`
3. `frontend/src/stores/people.ts`
4. `frontend/src/lib/netWorthOwnership.ts`
5. Integracion ownership en `frontend/src/domains/net-worth/**`

#### D. Se queda solo en SaaS
1. `frontend/src/views/AdminUsersView.vue`
2. `frontend/src/domains/auth/adminApi.ts`
3. `useSaasAdminUsersPage()` en `frontend/src/domains/auth/composables.ts`

#### E. Orden de ejecucion recomendado (codigo)
1. `T3.1` Router Core + `SettingsFxView` + `SettingsIpcView` + `AccountView` (adaptado Core) [hecho]
2. `T3.2` `BudgetDashboardView` SaaS -> Core (para `cierre mensual`) [hecho]
3. `T3.3` `People/ownership` + integracion en `net-worth` [hecho: frontend + backend Core portados, smoke backend `memberships` OK y validacion funcional en Core confirmada]
4. `T3.4` `AuxDataView` SaaS -> Core (ya con `people` disponible) [hecho]
5. `T3.5` Paridad de vistas base (`NetWorthView`, `GuidePhaseDetailView`, `DataInputView`) [hecho: vistas SaaS portadas en Core, `typecheck` OK, filtro de titularidad restaurado en `Balance patrimonial` (`ItemList`) y pasada visual rapida completada]

### Paso T3 - Ejecutar traslado por slices pequenos
1. Shell/nav
2. Vistas de valor (`Patrimonio`, `Presupuesto`, `Data Input`)
3. `Guia`
4. Utilidades/composables compartidos

### Paso T4 - Revalidar y re-sincronizar
1. Una vez consolidado, volver a declarar `core/frontend` como baseline canonico.
2. Documentar divergencias SaaS aceptadas.

## SaaS piloto gratis (mirror del Core) - checklist
1. Login/registro operativos [ ]
2. Acceso a vistas baseline Core [en progreso]
3. Backend SaaS `family/ownership` alineado a Core (sin gating premium; solo `IsAuthenticated`) [x]
4. Rutas/menus de extras cloud no esenciales ocultos [ ]
5. Pantallas admin solo para uso interno [ ]
6. Sin billing visible al usuario final [ ]
7. Seed/onboarding manual de testers definido [ ]
8. Runbook minimo de soporte piloto preparado [ ]

## Validacion (antes de cerrar el hito)
### Core
1. Smoke de `Patrimonio` [ ]
2. Smoke de `Introduccion de datos` [ ]
3. Smoke de `Presupuesto` [ ]
4. Smoke de `Guia/coach` [ ]
5. Smoke de `cierre mensual` / check-ins si entra en corte [ ]
6. Smoke backend `family/ownership` (`/api/family-members`, `/api/ownerships`, `/api/ownership-links/sync`) [x]
7. Smoke UI Core observado en logs backend (lecturas y escrituras en `people`, `ownerships`, `data`, `budget`, `net-worth`) [x]

### SaaS (mismo baseline)
1. Login [ ]
2. Mismos flujos base que Core [ ]
3. Rutas extra ocultas/no expuestas segun piloto [ ]
4. QA rapido con usuarios seed [ ]

## Documentacion a producir al cerrar este hito
1. `Roadmap Core (comunidad)` especifico
2. `Release summary` de `Core v0`
3. `Piloto SaaS (gratis)` checklist operativo y soporte
4. Matriz de paridad cerrada (este documento)

## Referencias
1. `docs/roadmap/roadmap.md`
2. `docs/architecture/core-saas-boundaries.md`
3. `docs/architecture/capabilities-matrix.md`
4. `frontend/src/router.ts`
5. `core/frontend/src/router.ts`
