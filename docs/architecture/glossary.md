# Glosario del proyecto

Términos con significado específico en MoneyPlanner. Consultar este glosario antes de nombrar nuevas entidades o escribir documentación.

---

## Arquitectura y estructura

**Core**
El producto de finanzas personales open-source. Vive en `core/` como submódulo de Git. Es canónico para toda la lógica de producto: patrimonio, presupuesto, movimientos, guía, familia. El SaaS no reimplementa funcionalidad de Core.

**SaaS**
La capa de plataforma que añade capacidades de servicio gestionado: autenticación propia, RBAC, subscripciones, gestión de cuentas, operaciones cloud. Vive en `backend/` y `frontend/` en la raíz del repo.

**Submodule**
`core/` es un submódulo Git apuntando a `https://github.com/pablesite/moneyplanner-core.git`. El repo SaaS almacena un *puntero* (commit SHA) al estado de Core. Para actualizar Core: actualizar el puntero y hacer commit en el repo SaaS.

**Stack SaaS**
El conjunto `backend/` (Django 8001) + `frontend/` (Vue 5174) del repo raíz.

**Stack Core**
El conjunto `core/backend/` (Django 8000) + `core/frontend/` (Vue 5173).

---

## Usuarios y roles

**Usuario SaaS**
Cuenta en el sistema Django del backend SaaS. Identificado por `username`/`email`. Tiene asociados: `SaasAccessProfile` (rol), `SaasSubscription` (estado), y opcionalmente `SaasCoreAccountLink`.

**saas_admin**
Rol de gestión de plataforma. Acceso a operaciones de administración: crear/editar/borrar usuarios, cambiar roles, ver métricas de ops. La plataforma garantiza que siempre haya al menos un admin activo.

**Intención:** el admin es un gestor puro de la plataforma, no un usuario del producto. No debería tener acceso a las vistas de producto (patrimonio, movimientos, etc.) ni disponer de un `FamilyMember` en Core. Por eso el bootstrap no se ejecuta para admins.

**Estado actual:** la restricción de acceso al producto para admins no está implementada. Técnicamente un `saas_admin` puede llamar a las APIs de Core con su JWT. Pendiente de controlar.

**saas_member**
Rol de usuario del producto. Puede iniciar sesión y usar todas las funcionalidades de la app respaldadas por Core. Recibe bootstrap automático al crearse (→ `FamilyMember` primario en Core). Los niveles de privilegio dentro de este rol están pendientes de definir.

**Usuario Core**
Cuenta en el sistema Django del backend Core. Se crea automáticamente durante el bootstrap al registrarse en SaaS. Identificado en el vínculo SaaS por `core_user_ref` (string, normalmente el username de Core).

---

## Integración

**JWT_SIGNING_KEY**
Clave secreta compartida entre SaaS y Core para firmar y verificar tokens JWT. Que sea la misma en ambos stacks es el mecanismo que permite al frontend SaaS llamar a Core con el mismo token, y al SaaS backend hacer bootstrap en nombre del usuario.

**Bootstrap (Core bootstrap)**
Proceso que se ejecuta automáticamente al crear un usuario SaaS con rol `saas_member`. Llama a `POST /api/family-members/ensure-primary/` en Core usando el JWT del usuario. Garantiza que el usuario tenga un `FamilyMember` primario en Core antes de que pueda usar el producto. Es síncrono y falla si Core no está disponible.

**Core Link / SaasCoreAccountLink**
Registro que vincula un usuario SaaS con su usuario en Core (`core_user_ref`). Normalmente se crea durante el bootstrap. También puede crearse manualmente (admin) o via token firmado. Sin este vínculo, el frontend SaaS puede llamar a Core con el JWT pero no hay referencia explícita al usuario Core en la BD SaaS.

**Core Link Token**
Token firmado con `CORE_LINKING_SHARED_SECRET` que Core puede generar para que un usuario se vincule a SaaS. De un solo uso (se registra en `SaasConsumedCoreLinkToken` por su JTI). Mecanismo para migraciones self-hosted → cloud.

**ACCOUNT_LINKING_ENABLED**
Feature flag (backend SaaS) que activa los endpoints `/api/auth/core-link/`. Deshabilitado por defecto. Durante el piloto, el linking ocurre via bootstrap, no via estos endpoints.

**CORE_API_BASE_URL**
URL del backend Core accesible desde el backend SaaS (server-to-server). Diferente de `VITE_CORE_API_BASE_URL` que es la URL accesible desde el navegador.

---

## Suscripciones y capacidades

**Trial**
Estado por defecto de todos los usuarios nuevos. `is_premium_enabled()` devuelve `True`. Durante el piloto, todos los usuarios son `trial` indefinidamente. No hay billing visible.

**Premium enabled**
El usuario tiene acceso a funcionalidades premium. Se calcula en backend: `status in {trial, active}`. No es un campo explícito.

**Capabilities (capacidades)**
Sistema que separa el packaging comercial de las funcionalidades técnicas. Definido en `frontend/src/domains/capabilities/index.ts`. El backend define las capacidades efectivas; el frontend las consume via helpers `canUse*()`. Ver `docs/architecture/capabilities-matrix.md`.

**plan_code**
Identificador del plan comercial (`community_core`, `cloud_basic`, `cloud_pro`, `cloud_premium`). Diferente de `capabilities`: el mismo `plan_code` puede tener distintas capacidades según la configuración. El frontend no debe hacer checks directos de `plan_code`.

**compat**
Sección de compatibilidad en `AppCapabilities`. Puente temporal mientras la UI migra de checks de plan a checks de capabilities. No añadir nueva lógica que dependa de `compat.*`.

---

## Producto (Core)

**Patrimonio neto / Net Worth**
Módulo de Core que gestiona el balance de activos y pasivos del usuario. Frontend en dominio `net-worth`.

**Presupuesto / Budget**
Módulo de Core para planificación presupuestaria y cierre mensual. Frontend: vistas `BudgetDashboardView` (ruta `/presupuesto`) y monthly close (`/cierre-mensual`).

**Movimientos contables / Accounting Movements**
Módulo de Core para registro de movimientos diarios. Añadido en fase 3. Frontend en dominio `accounting`, ruta `/movimientos`.

**Introducción de datos / Data Input**
Módulo de Core para entrada de ingresos y gastos anuales. Frontend en dominio `data-input`.

**Guía / Coach v1**
Módulo de scoring financiero por fases. Frontend en dominio `guide`.

**Family Logical Model**
Modelo de Core que representa la estructura familiar del usuario: `FamilyMember` (personas) y ownership (propiedad de activos/pasivos). Base para el módulo `people` en frontend.

**FamilyMember primario**
El `FamilyMember` que representa al propio usuario en Core. Se crea durante el bootstrap. Punto de entrada para asignación de ownership.

---

## Modelos de dominio Core

**FamilyMember**
Persona dentro del modelo familiar del usuario. El "miembro primario" representa al propio usuario (creado en bootstrap). Se pueden añadir más miembros para representar a la familia. Usado para asignar ownership a activos/pasivos.

**Ownership / OwnershipLink**
Relación entre un `FamilyMember` y un activo o pasivo (porcentaje de propiedad). Permite distribuir el patrimonio entre miembros del hogar.

**Asset / Liability**
Activo y pasivo patrimonial respectivamente. Son los bloques base del Net Worth. Un `Asset` puede tener `AssetValuation` (valor en el tiempo), `InvestmentAssetEvent` (compras/ventas) o `LiquidityAssetEvent` (movimientos de liquidez).

**LedgerAccount**
Cuenta contable en el módulo de accounting. Representa una entidad financiera (cuenta bancaria, cartera de inversión, préstamo, etc.). Se vincula a `Asset` o `Liability` del net worth (relación auto-link/auto-create/needs_review).

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

**Scoring financiero (fases 1-4)**
Sistema de diagnóstico financiero por áreas:
- Fase 1: Deuda (coste y riesgo estructural)
- Fase 2: Flujo de caja (salud operativa recurrente)
- Fase 3: Fondo de emergencia (meses cubiertos, liquidez)
- Fase 4: Salud patrimonial (respaldo e iliquidez, distribución)
- Fase 5: Independencia financiera (sin runtime aún)

**auto-link / auto-create / needs_review**
Estados de la relación entre un `LedgerAccount` y un `Asset`/`Liability`:
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