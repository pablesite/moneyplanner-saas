# Mapa de Dominios Frontend SaaS

El frontend SaaS (`frontend/src/domains/`) está organizado en dominios funcionales. La mayoría son mirrors del Core frontend que acceden a las APIs de Core directamente. El dominio `auth` es el único 100% SaaS.

## Clientes Axios disponibles

| Cliente | Importación | Apunta a | Usar cuando |
|---------|-------------|---------|-------------|
| `api` | `@/lib/api` | SaaS backend (8001) | Operaciones SaaS: login, me, subscription, admin |
| `coreApi` | `@/lib/api` | Core backend (8000) | Todo lo que es producto: patrimonio, movimientos, personas, etc. |

Ambos tienen interceptores de auth (Bearer + refresh automático).

---

## Dominios

### `auth` — Autenticación SaaS
**Origen:** SaaS (no tiene equivalente en Core frontend)
**Cliente:** `api` (SaaS backend)
**Ruta:** `/login`

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | `AuthApiAdapter`: `login()` → `POST /api/auth/token/`, `validateSession()` → `GET /api/auth/me/`. Exporta `authApi = coreAuthApi` (alias). |
| `session.ts` | Gestión de tokens en localStorage: `getAccessToken`, `setAccessToken`, `getRefreshToken`, `setRefreshToken`, `clearAuthTokens`. |
| `composables.ts` | Composables de Vue para estado de sesión. |
| `guard.ts` | `registerAuthGuard(router)`: redirige a `/login` si no hay sesión activa. |
| `components/AppHeader.vue` | Cabecera de la app con navegación y estado de sesión. |

**Nota:** `api.ts` define un `AuthApiAdapter` con forma de adaptador. Actualmente `authApi = coreAuthApi` apunta al SaaS backend, pero la interfaz permite intercambiar la implementación sin cambiar los consumidores.

---

### `capabilities` — Sistema de capacidades
**Origen:** Core (estático en frontend, no hay llamada a API)
**Cliente:** ninguno

| Archivo | Contenido |
|---------|-----------|
| `index.ts` | Tipos `AppCapabilitiesV2`, `AppCapabilities`. Objeto `capabilities` con la configuración actual. Helpers: `hasCapability()`, `canUseGuide()`, `canUsePeople()`, `canUseOwnership()`, `canUseFamilyMode()`, `canUseAdminInternal()`. |

**Estado actual:** `deploymentMode: 'self_hosted'`, `planCode: 'community_core'`. Las capacidades SaaS (`saas.*`) están todas en `false`.

**Regla:** usar siempre los helpers `canUse*()` en lugar de acceder directamente a `capabilities.xxx`. Ver `docs/architecture/capabilities-matrix.md`.

---

### `net-worth` — Patrimonio neto
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** `/patrimonio`

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | Llamadas a Core: items de patrimonio, grupos, subgrupos. |
| `store.ts` | Pinia store: estado de items, grupos, operaciones CRUD. |
| `composables.ts` | Composables para consumir el store desde vistas/componentes. |
| `models.ts` | Tipos TypeScript del dominio (NetWorthItem, Group, etc.). |
| `ownership.ts` | Lógica de propiedad (ownership) de items patrimoniales. |
| `charts.ts` | Datos y configuración para gráficos de patrimonio. |
| `extensions.ts` | Extensiones del modelo base. |
| `components/` | Componentes: `ItemCategoryHeader`, `ItemSubgroupHeader`, `ItemDisplayRow`, `ItemList`, `ItemForm`. |

---

### `people` — Personas / Familia
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** `/people`

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | Llamadas a Core: family members, ownership entries. |
| `store.ts` | Pinia store: lista de miembros, operaciones CRUD. |
| `composables.ts` | Composables para gestión de personas. |
| `types.ts` | Tipos TypeScript: `FamilyMember`, `OwnershipEntry`, etc. |
| `errors.ts` | Errores tipados del dominio. |
| `components/FamilyMemberManager.vue` | UI para gestionar miembros de la familia. |
| `components/OwnershipLabel.vue` | Badge/etiqueta de propiedad. |
| `components/OwnershipManager.vue` | UI para asignar ownership. |

**Requiere:** `canUsePeople()` → `core.familyLogicalModel`. Actualmente `true`.

---

### `data-input` — Dominio compartido de entradas anuales (sin ruta propia)
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** _sin ruta de página_

Estado actual del flujo: la ruta legacy de Introducción de Datos fue retirada. La gestión anual de ingresos y gastos se ejecuta desde `Presupuesto` en flujo contextual por categoría/subcategoría; y la revisión de gasto generado por pasivo está integrada en `Patrimonio`.

| Archivo | Contenido |
|---------|-----------|
| `index.ts` | Re-exportaciones del dominio. |
| `annualIncomeStore.ts` | Pinia store: entradas de ingresos anuales. |
| `annualExpenseStore.ts` | Pinia store: entradas de gastos anuales. |
| `annualEntryUtils.ts` | Utilidades para validación y cálculo de entradas. |
| `incomeTaxonomy.ts` | Taxonomía de categorías de ingresos (ver `docs/architecture/annual-income-taxonomy.md`). |
| `expenseTaxonomy.ts` | Taxonomía de categorías de gastos (ver `docs/architecture/annual-expense-taxonomy.md`). |

---

### `portable-data` — Exportación/importación portable
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** `/account`

Dominio dedicado para mover/copiar la base de datos entre instancias. Se extrajo de `data-input` para que la portabilidad deje de depender del nombre legacy de Introducción de Datos.

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | Cliente Core y mapeo de errores para endpoints portable data. |
| `portableBundle.ts` | Tipos, normalización, validación y parsing del bundle portable. |
| `usePortableDataTransfer.ts` | Composable de export/import/replace usado por `AccountView`. |

---

### `accounting` — Movimientos contables
**Origen:** Core (mirror, añadido recientemente)
**Cliente:** `coreApi`
**Ruta:** `/movimientos`

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | Llamadas a Core: CRUD + listado paginado por cursor (`results`, `next_cursor`, `total_count`) con filtros server-side. |
| `store.ts` | Pinia store: datos globales livianos (`accounts`, `monthlySummary`, `accountBalancesSummary`) + `fetchTransactionsPage()` request-scoped. |
| `composables.ts` | Composables para el workspace de movimientos con paginación server-side en tabs "Todos" y "Cuentas" (debounce de búsqueda en "Todos"). |
| `models.ts` | Tipos TypeScript: `AccountingMovement`, `MovementCategory`, etc. |

**Requiere:** `core.accountingBasic: true` (activo). `core.accountingMovementsManual: false` (desactivado).

---

### `guide` — Guía financiera / Coach
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** `/guia/fases/:phaseId`

| Archivo | Contenido |
|---------|-----------|
| `phases.ts` | Definición de fases financieras. |
| `scoreVisuals.ts` | Visualizaciones de puntuación por fase. |
| `phaseDiagnostics.ts` | Lógica de diagnóstico de fase actual. |

**Requiere:** `canUseGuide()` → `core.coachV1 || pro.guide`. Actualmente `true`.

---

### `aux-data` — Datos auxiliares (FX, IPC)
**Origen:** Core (mirror)
**Cliente:** `coreApi`
**Ruta:** `/data`

| Archivo | Contenido |
|---------|-----------|
| `api.ts` | Llamadas a Core: tipos de cambio (FX), índices IPC. |
| `composables.ts` | Composables para acceder a datos auxiliares. |
| `types.ts` | Tipos TypeScript del dominio. |

Incluye redirecciones: `/data/fx` y `/data/ipc` → `/data`.

---

### `ui` — Utilidades de UI
**Origen:** SaaS (shared)
**Cliente:** ninguno

Módulo de utilidades y primitivas de UI compartidas. No tiene ruta propia.

---

## Rutas del frontend SaaS

| Ruta | Nombre | Vista | Dominio principal |
|------|--------|-------|-------------------|
| `/login` | `login` | `LoginView` | `auth` |
| `/` | `home` | `HomeView` | — |
| `/guia/fases/:phaseId` | `guide-phase` | `GuidePhaseDetailView` | `guide` |
| `/patrimonio` | `networth` | `NetWorthView` | `net-worth` |
| `/presupuesto` | `budget-dashboard` | `BudgetDashboardView` | Incluye gestión anual contextual por categoría/subcategoría, modales de líneas con errores backend persistentes, dashboard basado en summaries mensuales canónicos y visibilidad de gasto fuera de presupuesto con CTA `Anadir al presupuesto` para subcategorías detectadas |
| `/cierre-mensual` | `monthly-close` | `BudgetDashboardView` (mode=monthly-close) | — |
| `/data` | `aux-data` | `AuxDataView` | `aux-data` |
| `/account` | `account` | `AccountView` | `auth` + portable data (export/import/replace) (home canónico) |
| `/people` | `people` | `PeopleView` | `people` |
| `/movimientos` | `accounting-movements` | `AccountingMovementsView` | `accounting` |

---

## Convención para añadir un nuevo dominio

1. Crear `frontend/src/domains/<nombre>/` con al menos: `index.ts`, `api.ts`
2. Si hay estado: añadir `store.ts` (Pinia)
3. Si hay lógica reutilizable de Vue: añadir `composables.ts`
4. Si hay tipos compartidos: añadir `types.ts`
5. Añadir la ruta en `router.ts`
6. Actualizar este documento
7. Verificar si la capacidad requerida existe en `capabilities/index.ts`
