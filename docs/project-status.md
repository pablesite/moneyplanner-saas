# Project Status

Current implementation status by feature area. Update this file whenever feature status changes.

**Last review:** 2026-06-23 | **SaaS Version:** see `VERSION` | **Core Version:** see `core/VERSION`

---

## Core Tasks

See `core/docs/project-status.md` for the status and next tasks of Core product modules.

---

## SaaS Pending Work — Pre-production

| Area                                              | Priority | Status | Description                                                                                                                                                                                                                                                              |
| ------------------------------------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production deployment                             | High     | 🔄     | Planned as phased module `docs/tasks/production-deployment/`: prod images, unified compose, hardening, CI/CD, runbook and smoke. Product target domain is `https://arkenstone.app`; technical infra rename remains tracked separately for phase 2.                      |
| Production secrets management                     | High     | 🔄     | Production `.env.prod` stays on the server, outside git. Secrets and required variables are documented in `docs/operations/production-deploy.md`; implementation remains pending.                                                                                        |
| Trial user system                                 | High     | ⚪     | Create root user and controlled access flow for early adopters.                                                                                                                                                                                                          |
| Admin UI                                          | Medium   | 🔄     | `/account` for `saas_admin` already soporta CRUD basico de usuarios SaaS y ahora cruza tambien todos los usuarios Core; broader internal tooling is still pending.                                                                                                                                           |
| Dynamic capabilities (from backend)               | Medium   | ⚪     | Currently hardcoded in frontend; connect to backend capability source.                                                                                                                                                                                                   |
| Residual Core/SaaS legacy cleanup                 | Medium   | ✅     | Completed 2026-05-20. Removed: Data Input module, `investment_purchase` alias, scalar contribution fields (migration 0042), external `net_worth.services` import, `compat.*` capabilities layer. See `core/docs/roadmap/product-roadmap.md`.                             |
| v1 functional consolidation (Core-mirror modules) | High     | ✅     | Movements view closed as v1. Ad-hoc MoneyWiz importer removed; import traceability preserved in accounting. Budget v1 and Monthly Close mirrored and manually validated.                                                                                                 |
| SaaS backend refactor — Phase 1                   | High     | ✅     | Test coverage baseline complete: suite reorganized by domain, real rollback on register if Core bootstrap fails, 138 tests and 96% coverage on `saas` + `saas_access`. Spec: `docs/tasks/backend-refactor/terminados/phase-1-test-coverage-baseline/backend.md`          |
| SaaS backend refactor — Phase 2                   | Medium   | ✅     | Thin views complete: `auth_views.py` at 122 lines, `admin_views.py` at 96 lines, logic extracted to `saas/auth_services.py`, `saas/auth_link_views.py`, and `saas_access/rbac_services.py`. Spec: `docs/tasks/backend-refactor/terminados/phase-2-thin-views/backend.md` |
| SaaS backend refactor — Phase 3                   | Medium   | ✅     | Canonical exception handler complete: `{code, message, details}` contract in all endpoints with error-shape contract tests. Spec: `docs/tasks/backend-refactor/terminados/phase-3-error-standardization/backend.md`                                                      |
| SaaS auth review                                  | High     | ⚪     | Review login, permissions, RBAC, and real flows (register, session, expiration).                                                                                                                                                                                         |
| Security audit                                    | High     | ⚪     | SaaS backend vulnerabilities, dependency CVEs, auth/permissions/input validation.                                                                                                                                                                                        |
| CI/CD deployment                                  | High     | 🔄     | Planned in `docs/tasks/production-deployment/phase-4-github-ci-cd/qa.md`: quality, security scans, production image push to GHCR and SSH deploy.                                                                                                                         |
| Frontend redesign "Direction A" — Phase 0         | Medium   | ✅     | Visual foundation completed on 2026-06-16: namespaced `.dir-a` tokens (Geist/oklch), Geist fonts, and shell migration sidebar → topbar without touching domain logic. Branding stays "The Arkenstone". Spec: `docs/tasks/frontend-redesign-direction-a/terminados/phase-0-foundation-topbar/frontend.md` |
| Frontend redesign "Direction A" — Phase 1         | Medium   | ✅     | Patrimonio (`NetWorthView`) se da por cerrado con el rework Direction A aceptado. El gate visual final y la homogeneización transversal de detalles se agrupan en la Fase 5. Spec: `docs/tasks/frontend-redesign-direction-a/terminados/phase-1-networth-pilot/frontend.md` · Método: `docs/tasks/frontend-redesign-direction-a/README.md` |
| Frontend redesign "Direction A" — Phase 2         | Medium   | ✅     | Presupuesto + Cierre mensual (`BudgetView` / `MonthlyCloseView`) se dan por cerrados con la presentación desacoplada y el reskin Direction A aceptados. El gate visual final y la homogeneización transversal de detalles se agrupan en la Fase 5. Spec: `docs/tasks/frontend-redesign-direction-a/terminados/phase-2-budget-monthly-close/frontend.md` |
| Frontend redesign "Direction A" — Phase 3         | Medium   | ✅     | Contabilidad evolucionó a workspace de operativa diaria en `/contabilidad`: libro agrupado, filtros URL, cola `needs_review`, detalle avanzado y catálogo separado. El análisis diario vive en Patrimonio mediante ámbitos contables. Spec histórica: `docs/tasks/frontend-redesign-direction-a/terminados/phase-3-accounting/frontend.md` |
| Frontend redesign "Direction A" — Phase 4         | Medium   | ✅     | Estado financiero (`/estado-financiero` + `/estado-financiero/ambitos/:phaseId`) se da por cerrado con el port Direction A y el renombrado de la antigua Guía aceptados. El gate visual happy-path y la homogeneización transversal de detalles se agrupan en la Fase 5. Spec: `docs/tasks/frontend-redesign-direction-a/terminados/phase-4-financial-state/frontend.md` |
| Frontend redesign "Direction A" — Phase 5         | Medium   | ✅     | Gate visual + consistencia transversal completados el 2026-06-23. Happy-path validado manualmente en las vistas Direction A y formularios afectados; librería compartida consolidada en `@/domains/ui`, `ASelect` unificado en filtros/formularios, heroes/KPI bands/estados/donut resueltos como primitivas y barrida adicional de CSS legacy muerto. Spec: `docs/tasks/frontend-redesign-direction-a/terminados/phase-5-visual-polish-consistency/frontend.md` |
| PWA — Phase 1 (instalable)                        | Medium   | ✅     | Completada 2026-06-23. Frontend instalable como PWA: `vite-plugin-pwa` (Workbox `generateSW`, `registerType: 'prompt'`) tras flag `VITE_PWA_ENABLED`, manifest + iconos placeholder Direction A, precache del shell, runtime caching solo de imágenes same-origin y toast de actualización (`PwaUpdatePrompt`). **API `/api/*` nunca cacheada** (verificado en `sw.js`). nginx sirve `sw.js`/manifest con `no-cache`. Spec: `docs/tasks/pwa/terminados/phase-1-installable/frontend.md`                              |
| PWA — Phase 2 (offline)                           | Medium   | ✅     | Completada 2026-06-23. Resiliencia offline del shell: navegación offline vía `navigateFallback` al shell precacheado (con `/api/*` en denylist), fuentes Geist **auto-hospedadas** (woff2 variable latino en `public/fonts/`, fuera de la CDN de Google) y precacheadas, composable `useOnlineStatus` + `OfflineBanner` global. **API sigue sin cachearse** (verificado en `sw.js`). Spec: `docs/tasks/pwa/terminados/phase-2-offline/frontend.md`                                                                   |
| Cierre mensual — filtro Titularidad (detalle)     | Medium   | 🔄     | El filtro de Titularidad de `/cierre-mensual` ya reparte previsto + ejecutado de ingresos/gastos por la titularidad del movimiento (`transaction.ownership_id`; commits `8b5893b`/`4d3ed00`/`f8bff66` en `useBudgetDashboardPage.ts`). **Pendiente:** validar el filtro a nivel de detalle del cierre — el **residual** del mes y el **cierre de liquidez/cuentas** (paso 1 "Perímetro") aún no se prorratean por titular. Modelo: titularidad del movimiento (dueño económico) ≠ titularidad de la cuenta; las transferencias no tienen `ownership_id`. |
| Pre-launch validation                             | High     | ⚪     | Early-adopter testing after v1 consolidation; gather UX clarity and value feedback before MVP.                                                                                                                                                                           |
| Open source readiness (Core repo)                 | Medium   | ⚪     | License (EUPL or alternative), contribution guide, technical docs, deployment guide.                                                                                                                                                                                     |

---

## Financial Plan Module Tasks (Mi Plan)

New planning layer on top of net worth / budget / accounting / monthly close. Validated spec and binding design decisions: `core/docs/tasks/financial-plan/README.md` + `spec.md`. Engine lives in Core backend (app `plan`, capability `core.plan`); MVP UI lives only in the SaaS frontend. Phases are sequential.

| Phase | Type  | Status | Description                                                                                                                   | Spec                                                                                      |
| ----- | ----- | ------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1     | Agent | ⚪     | Projection engine in Core backend (no UI): `plan` app, deterministic projection, asset classification, data quality, API.     | `core/docs/tasks/financial-plan/phase-1-projection-engine/backend.md`                     |
| 2     | Agent | ⚪     | Mi Plan UI + onboarding in SaaS frontend: `plan` domain, capability `core.plan`, `/plan` + `/plan/setup`, trajectory chart.   | `docs/tasks/financial-plan/phase-2-mi-plan-ui/frontend.md`                                |
| 3     | Agent | ⚪     | Scenario lab: backend models/services + UI (`/plan/escenarios`), comparison, accept into plan, markers in Patrimonio.         | `core/docs/tasks/financial-plan/phase-3-scenarios/backend.md` + `docs/tasks/financial-plan/phase-3-scenarios/frontend.md` |
| 4     | Agent | ⚪     | Foundations + findings/recommendations (guide scoring ported to backend) + monthly close plan-impact, backend + UI.           | `core/docs/tasks/financial-plan/phase-4-findings-close/backend.md` + `docs/tasks/financial-plan/phase-4-findings-close/frontend.md` |
| 5     | Agent | ⚪     | Mi Plan absorbs Estado financiero: redirect `/estado-financiero` → `/plan`, remove `guide/` domain, capability supersede.     | `docs/tasks/financial-plan/phase-5-absorb-financial-state/frontend.md`                    |

---

## SaaS Production Deployment Tasks

| Phase | Type  | Status | Description                                                                                                                                                                                                              | Spec                                                                                                                                                         |
| ----- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Agent | ✅     | SaaS production backend/frontend images created and locally validated (`Dockerfile.prod`, Gunicorn entrypoint, nginx SPA image with same-origin API build args).                                                         | `docs/tasks/production-deployment/terminados/phase-1-prod-images/backend.md` + `docs/tasks/production-deployment/terminados/phase-1-prod-images/frontend.md` |
| 2     | Agent | 🔄     | Root `docker-compose.prod.yml` implemented and locally validated with Traefik labels, shared same-origin routing, and no Core frontend. External DNS/tunnel validation for `arkenstone.app` is still pending, plus the phase 2 technical rename checklist. | `docs/tasks/production-deployment/phase-2-prod-compose-traefik/qa.md`                                                                                        |
| 3     | Agent | 🔄     | Django hardening and private-access controls are implemented and locally validated in SaaS/Core backends; external production smoke is still pending.                                                                    | `docs/tasks/production-deployment/phase-3-security-private-access/backend.md`                                                                                |
| 4     | Agent | 🔄     | GitHub Actions are being aligned with production images, GHCR publish, gated SSH deploy, and post-deploy smoke checks; real server validation is still pending.                                                          | `docs/tasks/production-deployment/phase-4-github-ci-cd/qa.md`                                                                                                |
| 5     | Agent | ⚪     | Complete production runbook and external smoke validation.                                                                                                                                                               | `docs/tasks/production-deployment/phase-5-production-runbook-smoke/qa.md`                                                                                    |

---

## SaaS Backend

### Auth and session

| Feature                            | Status         | Notes                                                 |
| ---------------------------------- | -------------- | ----------------------------------------------------- |
| Login (JWT)                        | ✅ Implemented | `POST /api/auth/token/`                               |
| Token refresh                      | ✅ Implemented | `POST /api/auth/refresh/`                             |
| User registration                  | ✅ Implemented | `POST /api/auth/register/` + automatic Core bootstrap |
| Authenticated user profile (`/me`) | ✅ Implemented | Includes role, subscription_status, account_link      |
| Auth mode endpoint                 | ✅ Implemented | `GET /api/auth/mode/`                                 |
| Scope throttling                   | ✅ Implemented | `auth_login`, `auth_register`, `auth_me`, etc.        |
| Auth audit logging                 | ✅ Implemented | DB + log file                                         |

### Subscriptions

| Feature                      | Status          | Notes                                      |
| ---------------------------- | --------------- | ------------------------------------------ |
| Default trial status         | ✅ Implemented  | All new users -> `trial`                   |
| Subscription status endpoint | ✅ Implemented  | `GET /api/auth/subscription/`              |
| Billing / payments           | ⛔ Out of scope | Pilot without billing. Pending definition. |
| Plan change                  | ⛔ Out of scope | Pending definition.                        |

### RBAC

| Feature                                               | Status         | Notes                                                      |
| ----------------------------------------------------- | -------------- | ---------------------------------------------------------- |
| Roles `saas_admin` / `saas_member`                    | ✅ Implemented |                                                            |
| Admin protection (cannot leave system without admins) | ✅ Implemented |                                                            |
| Product access restriction for `saas_admin`           | ⚪ Not started | Admin can technically call Core APIs. Pending enforcement. |
| Privilege levels inside `saas_member`                 | ⚪ Not started | To be defined by future requirements                       |

### Admin (internal operations)

| Feature                  | Status         | Notes                                     |
| ------------------------ | -------------- | ----------------------------------------- |
| List users               | ✅ Implemented | `GET /api/admin/users/` returns `saas_users` + `core_users` |
| Create user (admin)      | ✅ Implemented | `POST /api/admin/users/` + Core bootstrap |
| Change user role         | ✅ Implemented | `PATCH /api/admin/users/{id}/role/`       |
| Activate/deactivate user | ✅ Implemented | `PATCH /api/admin/users/{id}/status/`     |
| Delete user              | ✅ Implemented | `DELETE /api/admin/users/{id}/`           |
| Ops metrics              | ✅ Implemented | `GET /api/auth/ops/metrics/`              |

### Core integration

| Feature                                   | Status         | Notes                                     |
| ----------------------------------------- | -------------- | ----------------------------------------- |
| Automatic bootstrap on register           | ✅ Implemented | Synchronous; fails if Core is unavailable |
| Manual Core link                          | ✅ Implemented | Requires `ACCOUNT_LINKING_ENABLED=True`   |
| Signed-token Core link                    | ✅ Implemented | Requires `CORE_LINKING_SHARED_SECRET`     |
| Frontend access to Core APIs (shared JWT) | ✅ Implemented | Same `JWT_SIGNING_KEY`                    |

---

## SaaS Frontend

### Frontend refactor

| Feature                | Status       | Notes                                                                                                                     |
| ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| SaaS frontend refactor | ✅ Completed | SaaS frontend now evolves independently from `core/frontend/`; historical mirror phases remain archived for traceability. |

### Auth

| Feature                                 | Status         | Notes                       |
| --------------------------------------- | -------------- | --------------------------- |
| Login view                              | ✅ Implemented | `/login`                    |
| Automatic token refresh                 | ✅ Implemented | Interceptor in `lib/api.ts` |
| Redirect to login on session expiration | ✅ Implemented | `?reason=session_expired`   |
| Router auth guard                       | ✅ Implemented | `domains/auth/guard.ts`     |
| Account view                            | ✅ Implemented | `/account`                  |

### Product domains (Core-backed)

| Domain               | Status         | Route                  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Net Worth            | ✅ Implemented | `/patrimonio`          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Data Input           | ✅ Removed     | —                      | Route/module removed. Responsibilities moved to Budget, Net Worth, and Account.                                                                                                                                                                                                                                                                                                                                                                                               |
| Budget               | ✅ Implemented | `/presupuesto`         | Integrated create/edit/delete flow by category/subcategory on top of Core APIs. Executed evolution bars in income/expense react to recurring/one-time filter. YTD category/subcategory bars available for both sections with independent month selector (default: current month). Unbudgeted execution is shown for income/expense with contextual CTA (`Add to budget`) and split KPIs (`executed_budgeted` / `executed_unbudgeted`). Manual review completed on 2026-05-14. |
| Monthly Close        | ✅ Implemented | `/cierre-mensual`      | Dual mode on top of Core APIs and manually reviewed on 2026-05-14.                                                                                                                                                                                                                                                                                                                                                                                                            |
| People               | ✅ Implemented | `/people`              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Estado financiero    | ✅ Implemented | `/estado-financiero` + `/estado-financiero/ambitos/:phaseId` |                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Aux Data             | ✅ Implemented | `/data`                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Accounting Movements | ✅ Implemented | `/contabilidad` + `/contabilidad/cuentas` | Daily operations workspace with URL-synced filters, calculated review queue, grouped ledger, advanced entry detail, adaptive create/edit sheets and separate account management. Legacy `/movimientos` redirects compatibly. Daily ledger evolution moved to Net Worth scopes. |

### SaaS-specific

| Feature                             | Status                | Notes                                                                                             |
| ----------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| Capabilities system                 | ✅ Implemented        | Static `community_core`                                                                           |
| Dynamic capabilities (from backend) | ⚪ Not started        | Currently hardcoded in frontend                                                                   |
| Admin UI                            | 🔄 In progress        | `/account` already centralizes SaaS user CRUD and Core user visibility for `saas_admin`; dedicated internal views remain pending |
| Billing UI                          | ⛔ Out of pilot scope |                                                                                                   |

---

## Infrastructure and operations

| Area                                      | Status         | Notes                                                                                                                                                          |
| ----------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local Docker Compose (integrated root)    | ✅ Implemented | Root `docker-compose.dev.yml` with shared `moneyplanner-dev` network and reused standalone data volumes                                                      |
| Local Docker Compose (Core standalone)    | ✅ Implemented | `core/docker-compose.yml` remains available for open-core standalone/community work                                                                            |
| Pre-commit hooks (ruff, eslint, prettier) | ✅ Implemented | `.pre-commit-config.yaml`                                                                                                                                      |
| SaaS CI quality checks                    | ✅ Implemented | `.github/workflows/quality.yml`                                                                                                                                |
| Cloud deployment                          | 🔄 In progress | Planned for private SaaS at `https://arkenstone.app`; see `docs/operations/production-deploy.md` and production deployment task specs.                           |
| Support runbook                           | 🔄 In progress | Draft runbook created at `docs/operations/production-deploy.md`; finalization tracked in phase 5.                                                              |
| End-to-end smoke test                     | 🔄 In progress | Production smoke planned in `docs/tasks/production-deployment/phase-5-production-runbook-smoke/qa.md`; see `docs/roadmap/saas-pilot-integration-checklist.md`. |

---

## Core (`core/`) — Area status

See `core/docs/project-status.md`.

---

## Legend

| Symbol | Meaning                                 |
| ------ | --------------------------------------- |
| ✅     | Implemented and working                 |
| 🔄     | In progress                             |
| ⚪     | Not started (future scope)              |
| ⛔     | Explicitly out of scope (decision made) |
