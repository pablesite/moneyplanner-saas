# Glosario del proyecto

Terms with specific meaning in The Arkenstone. Consult this glossary before naming new entities or writing documentation.

---

## Architecture and structure

**Core**
The open-source personal finance product. Lives in `core/` as a Git submodule. It is canonical for all product logic: heritage, budget, movements, guide, family. The SaaS does not reimplement Core functionality.

**SaaS**
The platform layer that adds managed service capabilities: self-authentication, RBAC, subscriptions, account management, cloud operations. It lives in `backend/` and `frontend/` in the root of the repo.

**Submodule**
`core/` is a Git submodule pointing to `https://github.com/pablesite/moneyplanner-core.git`. The SaaS repo stores a *pointer* (commit SHA) to the Core state. To update Core: update the pointer and commit to the SaaS repo.

**Stack SaaS**
The set `backend/` (Django 8001) + `frontend/` (Vue 5174) from the root repo.

**Stack Core**
El conjunto `core/backend/` (Django 8000) + `core/frontend/` (Vue 5173).

---

## Usuarios y roles

**SaaS User**
Account in the Django system of the SaaS backend. Identified by `username`/`email`. It has associated: `SaasAccessProfile` (role), `SaasSubscription` (state), and optionally `SaasCoreAccountLink`.

**saas_admin**
Platform management role. Access to management operations: create/edit/delete users, change roles, view ops metrics. The platform guarantees that there is always at least one active admin.

**Intention:** the admin is a pure manager of the platform, not a user of the product. You should not have access to product views (assets, movements, etc.) nor have a `FamilyMember` in Core. That's why bootstrap doesn't run for admins.

**Current status:** Product access restriction for admins is not implemented. Technically a `saas_admin` can call Core APIs with its JWT. Pending control.

**saas_member**
Product user role. You can log in and use all app functionalities supported by Core. Receives automatic bootstrap upon creation (→ `FamilyMember` primary in Core). Privilege levels within this role are yet to be defined.

**Core User**
Account in the Django system of the Core backend. It is created automatically during bootstrap when signing up for SaaS. Identified in the SaaS link by `core_user_ref` (string, usually the Core username).

---

## Integration

**JWT_SIGNING_KEY**
Secret key shared between SaaS and Core to sign and verify JWT tokens. Having it be the same in both stacks is the mechanism that allows the SaaS frontend to call Core with the same token, and the SaaS backend to bootstrap on behalf of the user.

**Bootstrap (Core bootstrap)**
Process that runs automatically when creating a SaaS user with role `saas_member`. Call `POST /api/family-members/ensure-primary/` in Core using the user's JWT. Ensures that the user has a primary `FamilyMember` in Core before they can use the product. It is synchronous and fails if Core is not available.

**Core Link / SaasCoreAccountLink**
Record that links a SaaS user to its Core user (`core_user_ref`). It is usually created during bootstrap. It can also be created manually (admin) or via signed token. Without this link, the SaaS frontend can call Core with the JWT but there is no explicit reference to the Core user in the SaaS DB.

**Core Link Token**
Token signed with `CORE_LINKING_SHARED_SECRET` that Core can generate for a user to link to SaaS. Single use (registered in `SaasConsumedCoreLinkToken` by its JTI). Mechanism for self-hosted → cloud migrations.

**ACCOUNT_LINKING_ENABLED**
Feature flag (backend SaaS) que activa los endpoints `/api/auth/core-link/`. Deshabilitado por defecto. Durante el piloto, el linking ocurre via bootstrap, no via estos endpoints.

**CORE_API_BASE_URL**
URL del backend Core accesible desde el backend SaaS (server-to-server). Diferente de `VITE_CORE_API_BASE_URL` que es la URL accesible desde el navegador.

---

## Suscripciones y capacidades

**Trial**
Default state for all new users. `is_premium_enabled()` returns `True`. During the pilot, all users are `trial` indefinitely. There is no billing visible.

**Premium enabled**
The user has access to premium features. It is calculated in backend: `status in {trial, active}`. It is not an explicit field.

**Capabilities (capacidades)**
System that separates commercial packaging from technical functionalities. Defined in `frontend/src/domains/capabilities/index.ts`. The backend defines the effective capabilities; the frontend consumes them via helpers `canUse*()`. See `docs/architecture/capabilities-matrix.md`.

**plan_code**
Trading plan identifier (`community_core`, `cloud_basic`, `cloud_pro`, `cloud_premium`). Different from `capabilities`: The same `plan_code` can have different capabilities depending on the configuration. The frontend should not do direct checks for `plan_code`.

**compat**
Compatibility section in `AppCapabilities`. Temporary bridge while the UI migrates from plan checks to capabilities checks. Do not add new logic that depends on `compat.*`.

---

## Producto (Core)

**Patrimonio neto / Net Worth**
Core module that manages the balance of the user's assets and liabilities. Frontend in domain `net-worth`.

**Presupuesto / Budget**
Core module for budget planning and monthly closing. Frontend: views `BudgetDashboardView` (path `/presupuesto`) and monthly close (`/cierre-mensual`).

**Movimientos contables / Accounting Movements**
Core module for recording daily movements. Added in phase 3. Frontend in domain `accounting`, path `/movimientos`.

**Data entry / Data Input**
Core module for entering annual income and expenses. Frontend in domain `data-input`.

**Financial State / Coach v1**
Legacy financial scoring module by scopes. In SaaS it was absorbed by Mi Plan in Financial Plan Phase 5: legacy routes `/estado-financiero` and `/estado-financiero/ambitos/:phaseId` now redirect to `/plan`, where Core-backed foundations, findings and recommendations carry the diagnostic.

**Family Logical Model**
Core model that represents the user's family structure: `FamilyMember` (people) and ownership (ownership of assets/liabilities). Base for the `people` module in frontend.

**FamilyMember primario**
The `FamilyMember` that represents the user themselves in Core. It is created during bootstrap. Entry point for ownership assignment.

---

## Modelos de dominio Core

**FamilyMember**
Person within the user's family model. The "primary member" represents the user themselves (created in bootstrap). More members can be added to represent the family. Used to assign ownership to assets/liabilities.

**Ownership / OwnershipLink**
Relationship between a `FamilyMember` and an asset or liability (percentage of ownership). It allows the assets to be distributed among household members.

**Asset / Liability**
Activo y pasivo patrimonial respectivamente. Son los bloques base del Net Worth. Un `Asset` puede tener `AssetValuation` (valor en el tiempo), `InvestmentAssetEvent` (compras/ventas) o `LiquidityAssetEvent` (movimientos de liquidez).

**LedgerAccount**
Accounting account in the accounting module. Represents a financial entity (bank account, investment portfolio, loan, etc.). Links to `Asset` or `Liability` of the net worth (auto-link/auto-create/needs_review relationship).

**LedgerTransaction**
Transacción contable. Agrupa una o más `LedgerEntry`. Representa un movimiento completo (ej: un gasto, una transferencia, una compra de inversión).

**LedgerEntry**
Apunte contable individual dentro de una `LedgerTransaction`. Referencia una `LedgerAccount` con un importe y signo (débito/crédito). Modelo de partida doble.

**flow_family / category_key / subcategory_key**
Clasificación de un `LedgerTransaction` que conecta accounting (ejecución) con budget (plan). `flow_family` puede ser `income`, `expense`, `transfer`, `investment`, `debt`. Definido en la fase 1 del roadmap de separación accounting-budget.

**AnnualIncomeEntry / AnnualExpenseEntry**
Entradas de ingresos y gastos planificados anualmente. Pertenecen al dominio `budget`. Son el "plan"; los `LedgerTransaction` son la "ejecución".

**Monthly Checkin / Cierre mensual**
Revisión mensual del presupuesto donde se registra lo real vs. lo planificado. Genera `AnnualIncomeMonthlyCheckin` y `AnnualExpenseMonthlyCheckin`. El accounting puede alimentar el cierre vía ledger o como fallback legacy.

**FxRate**
Tipo de cambio diario entre pares de divisas. Sincronizado por `market_data_sync`. Consumido por el frontend en `/data` y por el net worth para valoraciones multi-divisa.

**InflationIndex**
Índice IPC mensual (nacional + CCAA de España). Sincronizado por `market_data_sync`. Usado para valoraciones en términos reales.

**MarketDataSyncState**
Modelo que registra el estado de cobertura de los datasets de mercado (FX, IPC). Consultable via `GET /api/core/market-data/status/`.

**Portable Data**
Bundle de exportación/importación de todos los datos del usuario. Incluye versión de la app que exportó. La importación es atómica (todo o nada) y valida la versión antes de proceder. Útil para migración entre instancias (self-hosted → cloud).

**Scoring financiero (ámbitos 1-5)**
Sistema de diagnóstico financiero por áreas:
- Ámbito 1: Deuda (coste y riesgo estructural)
- Ámbito 2: Flujo de caja (salud operativa recurrente)
- Ámbito 3: Fondo de emergencia (meses cubiertos, liquidez)
- Ámbito 4: Salud patrimonial (respaldo e iliquidez, distribución)
- Ámbito 5: Independencia financiera (sin runtime aún)

**auto-link / auto-create / needs_review**
Statuss de la relación entre un `LedgerAccount` y un `Asset`/`Liability`:
- `auto-link`: el ledger account se vinculó automáticamente a una posición existente en net worth
- `auto-create`: no existía posición, se creó automáticamente
- `needs_review`: no se pudo vincular/crear sin ambigüedad, requiere revisión manual

---

## Operaciones

**Piloto**
Fase actual del proyecto. Objetivo: plataforma desplegada y usable por testers reales con auth fiable, trial por defecto, admin operativo, Core accesible. Sin billing expuesto. Ver `docs/roadmap/roadmap.md`.

**Smoke test**
Validación mínima end-to-end que verifica que los flujos críticos funcionan en un deployment real. Definida en `docs/roadmap/saas-pilot-integration-checklist.md`.

**Calidad local**
Conjunto de checks que deben pasar antes de cerrar cualquier tarea: `ruff check`, `ruff format --check`, `mypy` (backend); `eslint`, `prettier:check`, `typecheck` (frontend). Siempre dentro de Docker.
