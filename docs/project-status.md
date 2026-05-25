# Project Status

Current implementation status by feature area. Update this file whenever feature status changes.

**Last review:** 2026-05-20 | **SaaS Version:** 0.20.41 | **Core Version:** 0.23.5

---

## Core Tasks

See `core/docs/project-status.md` for the status and next tasks of Core product modules.

---

## SaaS Pending Work — Pre-production

| Area | Priority | Status | Description |
|------|----------|--------|-------------|
| Production deployment | High | 🔄 | Define final deployment strategy and environment. Not started: design first, then implement. |
| Production secrets management | High | ⚪ | Sensitive production variables (secret manager, cloud provider variables). Decide together with deployment design. |
| Trial user system | High | ⚪ | Create root user and controlled access flow for early adopters. |
| Admin UI | Medium | ⚪ | Admin operations are backend-only for now; UI is still pending. |
| Dynamic capabilities (from backend) | Medium | ⚪ | Currently hardcoded in frontend; connect to backend capability source. |
| Residual Core/SaaS legacy cleanup | Medium | ✅ | Completed 2026-05-20. Removed: Data Input module, `investment_purchase` alias, scalar contribution fields (migration 0042), external `net_worth.services` import, `compat.*` capabilities layer. See `core/docs/roadmap/product-roadmap.md`. |
| v1 functional consolidation (Core-mirror modules) | High | ✅ | Movements view closed as v1. Ad-hoc MoneyWiz importer removed; import traceability preserved in accounting. Budget v1 and Monthly Close mirrored and manually validated. |
| SaaS backend refactor — Phase 1 | High | ✅ | Test coverage baseline complete: suite reorganized by domain, real rollback on register if Core bootstrap fails, 138 tests and 96% coverage on `saas` + `saas_access`. Spec: `docs/tasks/backend-refactor/terminados/phase-1-test-coverage-baseline/backend.md` |
| SaaS backend refactor — Phase 2 | Medium | ✅ | Thin views complete: `auth_views.py` at 122 lines, `admin_views.py` at 96 lines, logic extracted to `saas/auth_services.py`, `saas/auth_link_views.py`, and `saas_access/rbac_services.py`. Spec: `docs/tasks/backend-refactor/terminados/phase-2-thin-views/backend.md` |
| SaaS backend refactor — Phase 3 | Medium | ✅ | Canonical exception handler complete: `{code, message, details}` contract in all endpoints with error-shape contract tests. Spec: `docs/tasks/backend-refactor/terminados/phase-3-error-standardization/backend.md` |
| SaaS auth review | High | ⚪ | Review login, permissions, RBAC, and real flows (register, session, expiration). |
| Security audit | High | ⚪ | SaaS backend vulnerabilities, dependency CVEs, auth/permissions/input validation. |
| CI/CD deployment | High | ⚪ | Automatic production deployment pipeline (build, test, deploy). Complements cloud infrastructure; design together with deployment. |
| PWA-ready frontend | Medium | ⚪ | Adapt frontend to Progressive Web App as a first step toward mobile. Prerequisite before native apps. |
| Pre-launch validation | High | ⚪ | Early-adopter testing after v1 consolidation; gather UX clarity and value feedback before MVP. |
| Open source readiness (Core repo) | Medium | ⚪ | License (EUPL or alternative), contribution guide, technical docs, deployment guide. |

---

## SaaS Backend

### Auth and session
| Feature | Status | Notes |
|--------|--------|-------|
| Login (JWT) | ✅ Implemented | `POST /api/auth/token/` |
| Token refresh | ✅ Implemented | `POST /api/auth/refresh/` |
| User registration | ✅ Implemented | `POST /api/auth/register/` + automatic Core bootstrap |
| Authenticated user profile (`/me`) | ✅ Implemented | Includes role, subscription_status, account_link |
| Auth mode endpoint | ✅ Implemented | `GET /api/auth/mode/` |
| Scope throttling | ✅ Implemented | `auth_login`, `auth_register`, `auth_me`, etc. |
| Auth audit logging | ✅ Implemented | DB + log file |

### Subscriptions
| Feature | Status | Notes |
|--------|--------|-------|
| Default trial status | ✅ Implemented | All new users -> `trial` |
| Subscription status endpoint | ✅ Implemented | `GET /api/auth/subscription/` |
| Billing / payments | ⛔ Out of scope | Pilot without billing. Pending definition. |
| Plan change | ⛔ Out of scope | Pending definition. |

### RBAC
| Feature | Status | Notes |
|--------|--------|-------|
| Roles `saas_admin` / `saas_member` | ✅ Implemented | |
| Admin protection (cannot leave system without admins) | ✅ Implemented | |
| Product access restriction for `saas_admin` | ⚪ Not started | Admin can technically call Core APIs. Pending enforcement. |
| Privilege levels inside `saas_member` | ⚪ Not started | To be defined by future requirements |

### Admin (internal operations)
| Feature | Status | Notes |
|--------|--------|-------|
| List users | ✅ Implemented | `GET /api/admin/users/` |
| Create user (admin) | ✅ Implemented | `POST /api/admin/users/` + Core bootstrap |
| Change user role | ✅ Implemented | `PATCH /api/admin/users/{id}/role/` |
| Activate/deactivate user | ✅ Implemented | `PATCH /api/admin/users/{id}/status/` |
| Delete user | ✅ Implemented | `DELETE /api/admin/users/{id}/` |
| Ops metrics | ✅ Implemented | `GET /api/auth/ops/metrics/` |

### Core integration
| Feature | Status | Notes |
|--------|--------|-------|
| Automatic bootstrap on register | ✅ Implemented | Synchronous; fails if Core is unavailable |
| Manual Core link | ✅ Implemented | Requires `ACCOUNT_LINKING_ENABLED=True` |
| Signed-token Core link | ✅ Implemented | Requires `CORE_LINKING_SHARED_SECRET` |
| Frontend access to Core APIs (shared JWT) | ✅ Implemented | Same `JWT_SIGNING_KEY` |

---

## SaaS Frontend

### Frontend refactor
| Feature | Status | Notes |
|--------|--------|-------|
| SaaS frontend refactor | ✅ Completed | Core-first mirror closed; phases 0-6 completed. See `docs/roadmap/frontend-refactor-roadmap.md` and archived specs in Core. |

### Auth
| Feature | Status | Notes |
|--------|--------|-------|
| Login view | ✅ Implemented | `/login` |
| Automatic token refresh | ✅ Implemented | Interceptor in `lib/api.ts` |
| Redirect to login on session expiration | ✅ Implemented | `?reason=session_expired` |
| Router auth guard | ✅ Implemented | `domains/auth/guard.ts` |
| Account view | ✅ Implemented | `/account` |

### Product domains (Core mirrors)
| Domain | Status | Route | Notes |
|-------|--------|-------|-------|
| Net Worth | ✅ Implemented | `/patrimonio` | |
| Data Input | ✅ Removed | — | Route/module removed. Responsibilities moved to Budget, Net Worth, and Account. |
| Budget | ✅ Implemented | `/presupuesto` | Integrated create/edit/delete flow by category/subcategory mirrored from Core. Executed evolution bars in income/expense react to recurring/one-time filter. YTD category/subcategory bars available for both sections with independent month selector (default: current month). Unbudgeted execution is shown for income/expense with contextual CTA (`Add to budget`) and split KPIs (`executed_budgeted` / `executed_unbudgeted`). Manual review completed on 2026-05-14. |
| Monthly Close | ✅ Implemented | `/cierre-mensual` | Dual mode mirrored from Core and manually reviewed on 2026-05-14. |
| People | ✅ Implemented | `/people` | |
| Guide | ✅ Implemented | `/guia/fases/:phaseId` | |
| Aux Data | ✅ Implemented | `/data` | |
| Accounting Movements | ✅ Implemented | `/movimientos` | View closed as v1. Multi-currency support for investment create/edit quick flows. Ad-hoc MoneyWiz importer removed; imported movement traceability preserved. |

### SaaS-specific
| Feature | Status | Notes |
|--------|--------|-------|
| Capabilities system | ✅ Implemented | Static `community_core` |
| Dynamic capabilities (from backend) | ⚪ Not started | Currently hardcoded in frontend |
| Admin UI | ⚪ Not started | Admin operations are backend-only for now |
| Billing UI | ⛔ Out of pilot scope | |

---

## Infrastructure and operations

| Area | Status | Notes |
|------|--------|-------|
| Local Docker Compose (SaaS) | ✅ Implemented | Root `docker-compose.yml` |
| Local Docker Compose (Core) | ✅ Implemented | `core/docker-compose.yml` |
| Pre-commit hooks (ruff, eslint, prettier) | ✅ Implemented | `.pre-commit-config.yaml` |
| SaaS CI quality checks | ✅ Implemented | `.github/workflows/quality-saas.yml` |
| Cloud deployment | 🔄 In progress | Pilot goal |
| Support runbook | 🔄 In progress | Pending completion for pilot |
| End-to-end smoke test | 🔄 In progress | See `docs/roadmap/saas-pilot-integration-checklist.md` |

---

## Core (`core/`) — Area status

See `core/docs/project-status.md`.

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Implemented and working |
| 🔄 | In progress |
| ⚪ | Not started (future scope) |
| ⛔ | Explicitly out of scope (decision made) |
