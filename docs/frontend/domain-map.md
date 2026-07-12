# Mapa de Dominios Frontend SaaS

El frontend SaaS (`frontend/src/domains/`) está organizado en dominios funcionales propios. Varios dominios consumen APIs de Core directamente, pero el frontend SaaS ya no se mantiene como espejo obligatorio de `core/frontend/`.

## Clientes Axios disponibles

| Cliente   | Importación | Apunta a            | Usar cuando                                                      |
| --------- | ----------- | ------------------- | ---------------------------------------------------------------- |
| `api`     | `@/lib/api` | SaaS backend (8001) | Operaciones SaaS: login, me, subscription, admin                 |
| `coreApi` | `@/lib/api` | Core backend (8000) | Todo lo que es producto: patrimonio, movimientos, personas, etc. |

Ambos tienen interceptores de auth (Bearer + refresh automático).

---

## Dominios

### `auth` — Autenticación SaaS

**Origen:** SaaS (no tiene equivalente en Core frontend)
**Cliente:** `api` (SaaS backend)
**Ruta:** `/login`

| Archivo                    | Contenido                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `api.ts`                   | `AuthApiAdapter`: `login()` → `POST /api/auth/token/`, `validateSession()` → `GET /api/auth/me/`. Exporta `authApi = coreAuthApi` (alias). |
| `session.ts`               | Gestión de tokens en localStorage: `getAccessToken`, `setAccessToken`, `getRefreshToken`, `setRefreshToken`, `clearAuthTokens`.            |
| `composables.ts`           | Composables de Vue para estado de sesión.                                                                                                  |
| `guard.ts`                 | `registerAuthGuard(router)`: redirige a `/login` si no hay sesión activa.                                                                  |
| `components/AppHeader.vue` | Cabecera de la app con navegación y estado de sesión.                                                                                      |

**Nota:** `api.ts` define un `AuthApiAdapter` con forma de adaptador. Actualmente `authApi = coreAuthApi` apunta al SaaS backend, pero la interfaz permite intercambiar la implementación sin cambiar los consumidores.

---

### `admin` — Administración interna SaaS

**Origen:** SaaS
**Cliente:** `api` (SaaS backend)
**Ruta:** `/account` (panel embebido para `saas_admin`)

| Archivo  | Contenido                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api.ts` | Cliente para `GET/POST /api/admin/users/`, `PATCH /api/admin/users/{id}/role/`, `PATCH /api/admin/users/{id}/status/`, `DELETE /api/admin/users/{id}/`. |

**Nota:** este dominio gestiona exclusivamente usuarios y roles del SaaS. No depende de UI espejo de Core.

---

### `capabilities` — Sistema de capacidades

**Origen:** Core (estático en frontend, no hay llamada a API)
**Cliente:** ninguno

| Archivo    | Contenido                                                                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts` | Tipos `AppCapabilitiesV2`, `AppCapabilities`. Objeto `capabilities` con la configuración actual. Helpers: `hasCapability()`, `canUsePlan()`, `canUseGuide()` (alias compatible hacia `core.plan`), `canUsePeople()`, `canUseOwnership()`, `canUseFamilyMode()`, `canUseAdminInternal()`. |

**Status actual:** `deploymentMode: 'self_hosted'`, `planCode: 'community_core'`. Las capacidades SaaS (`saas.*`) están todas en `false`.

**Regla:** usar siempre los helpers `canUse*()` en lugar de acceder directamente a `capabilities.xxx`. Ver `docs/architecture/capabilities-matrix.md`.

---

### `plan` — Mi Plan

**Origen:** Core-backed
**Cliente:** `coreApi`
**Rutas:** `/plan`, `/plan/setup`, `/plan/activos`, `/plan/escenarios`, `/plan/escenarios/:id`

| Archivo            | Contenido                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `api.ts`           | Llamadas a Core `/api/plan/*`: plan idempotente, proyección, recálculo, histórico, miembros, overrides, escenarios, eventos, cimientos, hallazgos y recomendaciones. |
| `store.ts`         | Pinia store `usePlanStore`: plan, proyección activa, escenarios, comparación, eventos, cimientos, hallazgos, recomendaciones, clasificación de activos, timeline de patrimonio y estados de carga/error/guardado. |
| `composables.ts`   | `usePlan()` para consumir el store desde vistas.                                                                              |
| `usePlanEvents.ts` | Composable compartido y ligero para leer `GET /api/plan/events/` y exponer marcadores de timeline sin acoplar otros dominios al store del plan. |
| `types.ts`         | Tipos TypeScript del contrato Core de plan, proyección, escenarios y eventos.                                                  |
| `scenarioTemplates.ts` | Plantillas frontend para defaults editables de escenarios; el cálculo final vive en backend.                              |
| `components/`      | `PlanHero`, `ProductiveCapitalProgress`, `ProjectedDateCard`, `NetWorthTrajectoryChart`, `PlanFoundations`, `DataQualityCard`, `ProjectionAssumptionsDrawer`, `PlanEventsTimeline`, `PlanRecommendationCard`, `ScenarioComparison`. |
| `plan.css`         | Estilos Direction A del dominio, sin tocar `core/frontend/`.                                                                  |

**Requiere:** `canUsePlan()` → `core.plan`. Desde Fase 5 ocupa la primera entrada de navegación primaria ("Mi Plan") y absorbe el antiguo Estado financiero del SaaS. Los deep-links `/estado-financiero` y `/estado-financiero/ambitos/:phaseId` redirigen a `/plan`.

Desde la Fase 9, `/plan` aplica revelación progresiva: fecha proyectada, acción principal y trayectoria forman el primer nivel; progreso, acción secundaria, Cimientos/calidad y acontecimientos quedan en «Ver el diagnóstico completo». `/plan/escenarios` prioriza la lista navegable y abre el simulador bajo demanda; el detalle incorporado consume `GET /api/plan/events/{id}/budget-lines/`. `/plan/activos` mantiene búsqueda sticky y grupos colapsables para móvil.

La Fase 6 completa el ciclo de vida: `PlanEventsTimeline` confirma la baja mediante `POST /api/plan/events/{id}/close/`, actualiza evento y proyección desde el store y conserva el marcador histórico. El detalle del escenario refleja `effective_end_date`; la baja del activo real sigue haciéndose en Patrimonio.

---

### `net-worth` — Patrimonio neto

**Origen:** Core-backed
**Cliente:** `coreApi`
**Ruta:** `/patrimonio`

| Archivo          | Contenido                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `api.ts`         | Llamadas a Core: items de patrimonio, grupos, subgrupos.                                           |
| `store.ts`       | Pinia store: estado de items, grupos, operaciones CRUD.                                            |
| `composables.ts` | Composables para consumir el store desde vistas/componentes.                                       |
| `models.ts`      | Tipos TypeScript del dominio (NetWorthItem, Group, etc.).                                          |
| `ownership.ts`   | Lógica de propiedad (ownership) de items patrimoniales.                                            |
| `charts.ts`      | Datos y configuración para gráficos de patrimonio.                                                 |
| `extensions.ts`  | Extensiones del modelo base.                                                                       |
| `components/`    | Componentes: `ItemForm`, `NetWorthItemModals`, `NetWorthDonut` y `NetWorthEvolutionChart`. `NetWorthView` organiza Patrimonio con tabs internos `General` / `Evolución` / `Balance` sincronizados con `?tab=`. La cabecera de Patrimonio usa una context rail compacta de una fila para titularidad/moneda/valoración, sin labels visibles, sin moneda duplicada y sin chip `Hoy` permanente; la fecha base solo se muestra si aporta contexto real. El alta queda fuera del page head y las archivadas aparecen como metadato accionable. General incluye hero con comparativas agrupadas Mes/Año desde `timeline.comparisons` de Core (`vs cierre anterior` y fecha equivalente explícita, p. ej. `vs 28 de mayo`), ratio de capital propio explicado por tooltip como metadato discreto bajo la cifra y composición Activos/Pasivos; Evolución abre directamente con último valor + delta del rango + gráfico, ámbito inline junto al KPI y presets/rango exacto debajo del gráfico; no expone granularidad como control independiente porque Total es mensual y Operativo es diario. La vista mensual Total muestra marcadores de eventos aceptados del plan vía `usePlanEvents`, sin acoplar `net-worth` al store de `plan`; los marcadores se ocultan en Operativo, filtros de categoría, titularidad parcial o detalle de posición para no mezclar ámbitos. El hero y Balance se construyen inline sobre `useNetWorthPageMetrics`. En móvil, Balance usa lista compacta con buscador/segmento sticky, sheet de detalle por posición y FAB de alta; en desktop conserva tabla agrupada. |

---

### `people` — Personas / Familia

**Origen:** Core-backed
**Cliente:** `coreApi`
**Ruta:** `/people`

| Archivo                              | Contenido                                                |
| ------------------------------------ | -------------------------------------------------------- |
| `api.ts`                             | Llamadas a Core: family members, ownership entries.      |
| `store.ts`                           | Pinia store: lista de miembros, operaciones CRUD.        |
| `composables.ts`                     | Composables para gestión de personas.                    |
| `types.ts`                           | Tipos TypeScript: `FamilyMember`, `OwnershipEntry`, etc. |
| `errors.ts`                          | Errores tipados del dominio.                             |
| `components/FamilyMemberManager.vue` | UI para gestionar miembros de la familia.                |
| `components/OwnershipLabel.vue`      | Badge/etiqueta de propiedad.                             |
| `components/OwnershipManager.vue`    | UI para asignar ownership.                               |

**Requiere:** `canUsePeople()` → `core.familyLogicalModel`. Actualmente `true`.

---

### `budget` — Presupuesto

**Origen:** Core-backed
**Cliente:** `coreApi`
**Ruta:** `/presupuesto` y `/cierre-mensual`

Gestiona el presupuesto anual por categoría/subcategoría, el cierre mensual, las líneas anuales de ingresos/gastos y sus taxonomías. Las entradas anuales viven en `budget/annual-entries` porque ya se editan desde Presupuesto y Patrimonio, no desde la antigua ruta de Introducción de Datos. En Fase 4 de Mi Plan, `/cierre-mensual` consume `GET /api/budget/monthly-closes/{id}/plan-impact/` de forma aditiva: si el usuario no tiene plan, la sección no aparece y el flujo de cierre queda intacto.

Desde la Fase 8, las líneas con `is_plan_managed` pertenecen a Mi Plan: Presupuesto las identifica mediante `plan_event_id`/`plan_event_name`, las muestra sin acciones de edición/borrado y enlaza de vuelta a `/plan`. El formulario manual no expone `event_group`; su camino normal deja que Core derive el perfil estructural y el rol desde la taxonomía, manteniendo la clasificación avanzada bajo revelación progresiva.

| Archivo                                              | Contenido                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `api.ts`                                             | Llamadas a Core para presupuesto, summaries mensuales y cierre.                          |
| `annual-entries/annualIncomeStore.ts`                | Pinia store: entradas de ingresos anuales.                                               |
| `annual-entries/annualExpenseStore.ts`               | Pinia store: entradas de gastos anuales.                                                 |
| `annual-entries/annualEntryUtils.ts`                 | Utilidades para validación y cálculo de entradas anuales.                                |
| `annual-entries/components/AnnualEntryModalForm.vue` | Formulario/modal reutilizable para crear y editar líneas anuales.                        |
| `taxonomy/incomeTaxonomy.ts`                         | Taxonomía de categorías de ingresos (ver `docs/architecture/annual-income-taxonomy.md`). |
| `taxonomy/expenseTaxonomy.ts`                        | Taxonomía de categorías de gastos (ver `docs/architecture/annual-expense-taxonomy.md`).  |
| `useBudgetAnnualEntriesPage.ts`                      | Composable de la gestión anual contextual usada por Presupuesto.                         |
| `useBudgetAnnualEntriesFilters.ts`                   | Filtros de titularidad/visibilidad para entradas anuales.                                |
| `components/`                                        | Componentes Direction A: `BudgetHero`/`BudgetYearStrip`, `BudgetAnnualSection` + `BudgetBarCell` (tabla `bdg-row`), `MonthlyCloseHero` y las 4 secciones `BudgetMonthlyClose{Liquidity,Income,Expense,Result}Section`, además de los modales de líneas. Estilos por vista en `styles/budget.css` y `styles/monthly-close.css`. |

---

### `portable-data` — Exportación/importación portable

**Origen:** Core-backed
**Cliente:** `coreApi`
**Ruta:** `/account`

Dominio dedicado para mover/copiar la base de datos entre instancias. Se extrajo de `data-input` para que la portabilidad deje de depender del nombre legacy de Introducción de Datos.

| Archivo                      | Contenido                                                       |
| ---------------------------- | --------------------------------------------------------------- |
| `api.ts`                     | Cliente Core y mapeo de errores para endpoints portable data.   |
| `portableBundle.ts`          | Tipos, normalización, validación y parsing del bundle portable. |
| `usePortableDataTransfer.ts` | Composable de export/import/replace usado por `AccountView`.    |

---

### `accounting` — Operativa contable diaria

**Origen:** Core-backed
**Cliente:** `coreApi`
**Rutas:** `/contabilidad` + `/contabilidad/cuentas`; `/movimientos` redirige preservando filtros.

| Archivo          | Contenido                                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `api.ts`         | Llamadas a Core: CRUD + listado paginado por cursor (`results`, `next_cursor`, `total_count`) con filtros server-side.                    |
| `store.ts`       | Pinia store: datos globales livianos (`accounts`, `monthlySummary`, `accountBalancesSummary`) + `fetchTransactionsPage()` request-scoped. |
| `composables.ts` | Motor de alta/edición, listado por cursor, filtros server-side, cola calculada `needs_review` y detalle por cuenta. |
| `models.ts`      | Contratos de cuentas, asientos, clasificación funcional y series diarias. |
| `components/`    | Libro agrupado por fecha, detalle avanzado Debe/Haber, sheets de alta/edición, catálogo de cuentas y `AccountingTabs` (conmutador Movimientos/Cuentas). |

**Requiere:** `core.accountingBasic: true` (activo). `core.accountingMovementsManual: false` (desactivado).

**UX móvil (primero móvil, usable en PC):** `AccountingTabs` conmuta entre `/contabilidad` (Movimientos) y `/contabilidad/cuentas` (Cuentas) bajo el título. En Movimientos la lista es de una sola línea (icono de tipo + concepto/cuenta + importe) y el detalle/acciones viven en el sheet al pulsar; la toolbar flotante (sticky) integra buscador, panel de filtros y un **selector de cuenta** (fuera de "Filtros") que muestra el saldo actual de la cuenta seleccionada y dirige el filtro `account_id`. La pantalla de Cuentas agrupa Activos/Pasivos de forma colapsable.

---

### `aux-data` — Datos auxiliares (FX, IPC)

**Origen:** Core-backed
**Cliente:** `coreApi`
**Ruta:** `/data`

| Archivo          | Contenido                                           |
| ---------------- | --------------------------------------------------- |
| `api.ts`         | Llamadas a Core: tipos de cambio (FX), índices IPC. |
| `composables.ts` | Composables para acceder a datos auxiliares.        |
| `types.ts`       | Tipos TypeScript del dominio.                       |

Incluye redirecciones: `/data/fx` y `/data/ipc` → `/data`.

---

### `ui` — Utilidades de UI

**Origen:** SaaS (shared)
**Cliente:** ninguno

Módulo de utilidades y primitivas de UI compartidas. No tiene ruta propia. Barrel en `domains/ui/index.ts`.

Primitivas Direction A: `APageHead`, `ASectHead`, `AContextBar`, `ASelect`, `ARowMenu`, `AKindChip`, `AInfoHint`, `AStepper`, `ASparkline`, `BaseModal`, y las nuevas `AButton` (botón con variantes/`loading`), `AHero` (bloque de figura del hero), `AKpiBand` (rejilla de KPIs), `AMetaPill` (pill de metadato, unifica los `*-meta-pill` por vista) `AState` (bloque de estado loading/empty/error/success, layouts `inline`/`panel`, unifica `a-nw-state`/`a-mov-state`/`bdg-loading`) y `ADonut` (donut SVG genérico por `slices`, usado por `NetWorthDonut`). `AHero`/`AKpiBand` consolidan los heroes de Presupuesto, Cierre, Patrimonio y Contabilidad.

---

### `pwa` — Progressive Web App

**Origen:** SaaS (shared)
**Cliente:** ninguno (no toca API)
**Ruta:** ninguna (chrome global montado en `App.vue`)

Soporte PWA: registro del service worker, instalación y resiliencia offline del shell. Barrel en `domains/pwa/index.ts`.

| Archivo                          | Contenido                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/PwaUpdatePrompt.vue` | Toast de actualización (`onNeedRefresh`/`onOfflineReady`, `registerType: 'prompt'`).                                                       |
| `components/PwaInstallPrompt.vue`| Banner de instalación: `beforeinstallprompt` (Android/escritorio) + mini-guía iOS Safari.                                                  |
| `components/OfflineBanner.vue`   | Indicador "sin conexión" global.                                                                                                           |
| `useOnlineStatus.ts`             | Composable de conectividad (`navigator.onLine` + eventos `online`/`offline`). Devuelve `online` (readonly).                                |

**Nota:** el SW (Workbox `generateSW`, config en `vite.config.ts`) precachea el shell estático y las fuentes Geist auto-hospedadas, pero **nunca cachea `/api/*`**.

---

## Rutas del frontend SaaS

| Ruta                   | Nombre                 | Vista                                      | Dominio principal                                                                                                                                                                                                                                                            |
| ---------------------- | ---------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`               | `login`                | `LoginView`                                | `auth`                                                                                                                                                                                                                                                                       |
| `/estado-financiero`   | —                      | redirect                                   | Alias compatible hacia `/plan`; Estado financiero queda absorbido por Mi Plan. |
| `/estado-financiero/ambitos/:phaseId` | —                      | redirect                                   | Deep-link compatible hacia `/plan`; los antiguos ámbitos quedan representados por cimientos, hallazgos y recomendaciones. |
| `/patrimonio`          | `networth`             | `NetWorthView`                             | `net-worth`                                                                                                                                                                                                                                                                  |
| `/presupuesto`         | `budget-dashboard`     | `BudgetView`                               | Vista Direction A independiente sobre `useBudgetView` (fija mode `budget` del motor compartido `useBudgetDashboardPage`). Hero + context-bar + tab Sugerencias + tabla `bdg-row` con gestión anual contextual, modales de líneas, cobertura YTD y CTA para subcategorías detectadas |
| `/cierre-mensual`      | `monthly-close`        | `MonthlyCloseView`                         | Vista Direction A independiente sobre `useMonthlyCloseView` (fija mode `monthly-close`). `APageHead` + `AStepper` (4 pasos) + `MonthlyCloseHero` + secciones Liquidez/Ingresos/Gastos/Resultado                                                                              |
| `/data`                | `aux-data`             | `AuxDataView`                              | `aux-data`                                                                                                                                                                                                                                                                   |
| `/account`             | `account`              | `AccountView`                              | `auth` + `admin` para `saas_admin` + portable data para `saas_member`                                                                                                                                                                                                        |
| `/people`              | `people`               | `PeopleView`                               | `people`                                                                                                                                                                                                                                                                     |
| `/plan`                | `plan`                 | `PlanView`                                 | Mi Plan: dashboard de proyección Core, trayectoria, calidad de datos, cimientos reales, hallazgos/recomendaciones y acontecimientos incorporados. |
| `/plan/setup`          | `plan-setup`           | `PlanSetupView`                            | Onboarding/edición del plan financiero. |
| `/plan/activos`        | `plan-assets`          | `PlanAssetsView`                           | Clasificación de funciones de activos (`GET/PUT /api/plan/asset-functions/`): resumen de capital por función y override manual por activo con vuelta a la inferida. |
| `/plan/escenarios`     | `plan-scenarios`       | `PlanScenariosView`                        | Laboratorio de escenarios: lista y creación de simulaciones. |
| `/plan/escenarios/:id` | `plan-scenario-detail` | `PlanScenarioDetailView`                   | Detalle, comparación plan vigente vs simulado e incorporación/descartado. |
| `/contabilidad`        | `accounting-movements` | `AccountingMovementsView`                  | Libro diario operativo: búsqueda, filtros URL, revisión de clasificación y alta/edición. |
| `/contabilidad/cuentas` | `accounting-accounts` | `AccountingAccountsView`                   | Catálogo de cuentas operativo y técnico con retorno al libro conservando contexto. |
| `/movimientos`         | —                      | redirect                                   | Alias compatible hacia `/contabilidad`; `tab=cuentas` se traduce a `/contabilidad/cuentas`. |

---

## Convención para añadir un nuevo dominio

1. Crear `frontend/src/domains/<nombre>/` con al menos: `index.ts`, `api.ts`
2. Si hay estado: añadir `store.ts` (Pinia)
3. Si hay lógica reutilizable de Vue: añadir `composables.ts`
4. Si hay tipos compartidos: añadir `types.ts`
5. Añadir la ruta en `router.ts`
6. Actualizar este documento
7. Verificar si la capacidad requerida existe en `capabilities/index.ts`
