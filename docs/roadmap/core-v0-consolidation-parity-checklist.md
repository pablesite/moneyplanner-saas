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
1. `Patrimonio` (CRUD activos/pasivos + resumen + snapshots basicos) [ ]
2. `Presupuesto` (planificado + ejecutado si `Milestone 14` minimo esta integrado) [ ]
3. `Contabilidad` v1 (annual entries + check-ins/cierre mensual v1) [ ]
4. `Introduccion de datos` (flujo usable de alta y edicion) [ ]
5. `Coach financiero` base usable con fases actuales (sin exigir Fase 5) [ ]
6. `Data portability` basica (export/import portable actual) [ ]

### B. Puede entrar parcial (si llega con calidad)
1. `Onboarding asistido` / checklist (sin wizard completo) [ ]
2. `Cartera de inversion` v1 basica [ ]
3. `Simulador financiero` v1 local [ ]

### C. Diferido (documentar explicitamente)
1. `Coach Fase 5` [ ]
2. Billing/pagos SaaS [ ]
3. PWA completa/offline [ ]
4. Benchmarking/LLM cloud/ASTRA [ ]
5. Familia cloud avanzada (multi-login + privacidad por miembro) [ ]

## Matriz de paridad - Frontend (rellenar durante la auditoria)
Columnas recomendadas:
1. `Area`
2. `Core frontend (estado)`
3. `SaaS frontend (estado)`
4. `Decision`
5. `Accion`
6. `Owner`
7. `Estado`

### Filas iniciales sugeridas
1. `Home / shell / navigation`
2. `Patrimonio`
3. `Presupuesto`
4. `Cierre mensual` (si hoy vive como modo en SaaS)
5. `Introduccion de datos`
6. `Guia / coach`
7. `Data / auxiliares`
8. `Auth`
9. `Account`
10. `Admin users`
11. `People / ownership`

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

### Paso T2 - Definir paquete de traslado
1. Lista de archivos SaaS que pasan a Core tal cual.
2. Lista de archivos que pasan con adaptacion por capabilities.
3. Lista de archivos que se quedan solo en SaaS (`Account`, `Admin`, cloud-only).

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
2. Acceso a vistas baseline Core [ ]
3. Extras cloud no listos ocultos [ ]
4. Pantallas admin solo para uso interno [ ]
5. Sin billing visible al usuario final [ ]
6. Seed/onboarding manual de testers definido [ ]
7. Runbook minimo de soporte piloto preparado [ ]

## Validacion (antes de cerrar el hito)
### Core
1. Smoke de `Patrimonio` [ ]
2. Smoke de `Introduccion de datos` [ ]
3. Smoke de `Presupuesto` [ ]
4. Smoke de `Guia/coach` [ ]
5. Smoke de `cierre mensual` / check-ins si entra en corte [ ]

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
