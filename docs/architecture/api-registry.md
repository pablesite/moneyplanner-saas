# API Registry

## SaaS Backend APIs (`http://localhost:8001`)

Production origin: `https://arkenstone.app`. In production, Traefik routes SaaS backend paths from the same origin to the SaaS backend service, except the Core-owned auth exceptions documented below.

### Auth — `/api/auth/`

| Method | Route | View | Auth | Throttle | Description |
|--------|-------|------|------|----------|-------------|
| `POST` | `/api/auth/token/` | `SaasTokenObtainPairView` | None | `auth_login` | Login. Returns `access` and `refresh` JWT tokens. |
| `POST` | `/api/auth/refresh/` | `SaasTokenRefreshView` | None | `auth_refresh` | Refreshes the `access` token using `refresh`. |
| `POST` | `/api/auth/register/` | `SaasRegisterAPIView` | None | `auth_register` | Registers a new user when public registration is enabled. Initial private production must set `SAAS_PUBLIC_REGISTRATION_ENABLED=0`; in that mode the endpoint returns canonical error `{code: "registration_disabled", ...}` and admin-created users are the onboarding path. |
| `GET` | `/api/auth/me/` | `SaasMeAPIView` | Bearer | `auth_me` | Returns authenticated user data: id, username, email, role, subscription_status, premium_enabled, account_link. |
| `GET` | `/api/auth/subscription/` | `SaasSubscriptionAPIView` | Bearer | `auth_subscription` | Returns user subscription status. |
| `GET` | `/api/auth/mode/` | `SaasAuthModeAPIView` | None | — | Returns auth mode config (`saas_local`, `account_linking_enabled`, `public_registration_enabled`, `transition_mode`). |
| `GET` | `/api/auth/ops/metrics/` | `SaasAuthOpsMetricsAPIView` | Bearer + Admin | `auth_ops_metrics` | Ops metrics: user totals, subscriptions, links, RBAC. `saas_admin` only. |
| `GET` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Returns active Core link for the user. 204 if missing. Requires `ACCOUNT_LINKING_ENABLED=True`. |
| `POST` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Creates or updates manual Core link (`core_user_ref`, `core_username`, `core_email`). |
| `DELETE` | `/api/auth/core-link/` | `SaasCoreAccountLinkAPIView` | Bearer | `auth_core_link` | Removes the user's Core link. |
| `POST` | `/api/auth/core-link/from-token/` | `SaasCoreAccountLinkFromTokenAPIView` | Bearer | `auth_core_link_token` | Links a Core account using a token signed with `CORE_LINKING_SHARED_SECRET`. Single-use token. |

### Admin — `/api/admin/`
All endpoints require `Bearer` + `saas_admin` role. Throttle: `saas_admin_api`.

| Method | Route | View | Description |
|--------|-------|------|-------------|
| `GET` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Returns `{saas_users, core_users}`. `saas_users` includes roles, `account_link`, `core_user_origin` and derived `core_connection`; `core_users` includes all Core users plus their external identities and any detected SaaS connection. |
| `POST` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Creates a user. If role is `saas_member`, triggers Core bootstrap. |
| `PATCH` | `/api/admin/users/{id}/role/` | `SaasAdminUserRoleAPIView` | Changes user role. If upgraded to `saas_member`, triggers Core bootstrap. |
| `PATCH` | `/api/admin/users/{id}/status/` | `SaasAdminUserStatusAPIView` | Activates or deactivates a user. |
| `DELETE` | `/api/admin/users/{id}/` | `SaasAdminUserDeleteAPIView` | Deletes a user. Prevents leaving the platform without active admins. |

### Utilities

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/schema/` | OpenAPI schema (drf-spectacular) |
| `GET` | `/api/docs/` | Interactive Swagger UI |

---

## Core Backend APIs (`http://localhost:8000`)

Core exposes its own complete API. The SaaS frontend consumes it directly using the same JWT.

Production origin: `https://arkenstone.app`. In production, Traefik routes Core product API paths from the same origin to the Core backend service. The Core frontend is not deployed for the SaaS product.

### Auth — `/api/auth/`
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/token/` | Core login (unused in SaaS; SaaS uses its own token) |
| `POST` | `/api/auth/refresh/` | Core token refresh |
| `GET` | `/api/auth/me/` | Core user profile: `base_currency`, settings |
| `GET/PATCH` | `/api/auth/settings/` | User settings (same view as `/me/`) |
| `GET` | `/api/auth/mode/` | Core auth mode |
| `GET` | `/api/auth/ops/metrics/` | Ops metrics (admin) |
| `GET` | `/api/auth/admin/users/` | Internal bridge endpoint for the SaaS admin panel. Returns all Core users plus `external_identities`. Protected with `X-SaaS-Bridge-Secret` using `CORE_LINKING_SHARED_SECRET`. |
| `POST` | `/api/auth/link-token/` | Generates a signed token to link account with SaaS |

### Memberships (family and ownership) — `/api/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/family-members/` | List and create family members |
| `GET/PATCH/DELETE` | `/api/family-members/{id}/` | Family member detail |
| `POST` | `/api/family-members/ensure-primary/` | **Used by SaaS bootstrap.** Creates primary family member if missing. Idempotent. |
| `GET/POST` | `/api/ownerships/` | List and create ownership relationships |
| `GET/PATCH/DELETE` | `/api/ownerships/{id}/` | Ownership detail |
| `GET/POST` | `/api/ownership-links/` | Ownership links (asset <-> person) |
| `GET/PATCH/DELETE` | `/api/ownership-links/{id}/` | Ownership link detail |

### Net Worth — `/api/net-worth/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/net-worth/assets/` | Assets |
| `GET/POST` | `/api/net-worth/liabilities/` | Liabilities |
| `GET/POST` | `/api/net-worth/asset-valuations/` | Asset valuations |
| `GET/POST` | `/api/net-worth/liability-valuations/` | Liability valuations |
| `GET/POST` | `/api/net-worth/investment-events/` | Investment events |
| `GET/POST` | `/api/net-worth/liability-events/` | Liability events (amortizations, etc.) |
| `GET/POST` | `/api/net-worth/liquidity-events/` | Liquidity events |
| `GET/POST` | `/api/net-worth/liquidity-checkins/` | Monthly liquidity check-ins |
| `GET/POST` | `/api/net-worth/snapshots/` | Net worth snapshots |
| `GET` | `/api/net-worth/summary/` | Aggregated net worth summary |
| `GET` | `/api/net-worth/timeline/` | Net worth timeline. Includes monthly `rows` plus `comparisons` baselines (`previous_month_close`, `same_day_previous_month`, `previous_year_close`, `same_day_previous_year`) for summary UIs. |
| `GET` | `/api/net-worth/liquidity/monthly-summary/` | Monthly liquidity summary; includes cash, cards, and interest-bearing investments. Asset rows include `annual_interest_tae` to identify remunerated liquidity. |

### Financial Plan — `/api/plan/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/plan/` | Returns the authenticated user's financial plan. |
| `POST` | `/api/plan/` | Creates or idempotently updates the user's single financial plan. |
| `PATCH` | `/api/plan/` | Partially updates the user's financial plan. |
| `POST` | `/api/plan/recalculate/` | Recalculates the projection and persists an official `ProjectionSnapshot`. Optional `scenario=prudent|expected|favorable`; default `expected`. |
| `GET` | `/api/plan/projection/` | Calculates a projection without persisting a snapshot. Optional `scenario=prudent|expected|favorable`; default `expected`. |
| `GET` | `/api/plan/history/` | Returns recent official projection snapshots. |
| `GET/POST` | `/api/plan/members/` | Lists or creates adult `FamilyMember` rows linked to the plan. MVP allows at most two adults. |
| `PATCH` | `/api/plan/members/{id}/` | Updates plan-relevant fields on an adult family member owned by the user. |
| `GET/PUT` | `/api/plan/asset-functions/` | Returns effective asset classification (inferred + override) and updates `PlanAssetFunction` overrides. |
| `GET/POST` | `/api/plan/scenarios/` | Lists or creates draft financial-plan scenarios with nested scenario events. |
| `GET/PATCH` | `/api/plan/scenarios/{id}/` | Returns or edits a user-owned draft scenario. Accepted/discarded scenarios are read-only. |
| `GET` | `/api/plan/scenarios/{id}/comparison/` | Compares the current plan against the simulated scenario. Optional `scenario=prudent|expected|favorable`; default `expected`. Persists only non-official projection snapshots. |
| `POST` | `/api/plan/scenarios/{id}/accept/` | Accepts a scenario transactionally, creates a `PlanEvent`, creates future budget entries, and recalculates an official projection. |
| `POST` | `/api/plan/scenarios/{id}/discard/` | Discards a draft scenario without plan, budget, net-worth, or accounting side effects. |
| `GET` | `/api/plan/events/` | Lists planned/occurred/cancelled plan events for projection markers. |
| `PATCH` | `/api/plan/events/{id}/` | Updates a user-owned plan event, including actual date/impact when the event has occurred. |
| `DELETE` | `/api/plan/events/{id}/` | Releases an occurred (retrospective) event: adopted budget rows return to their previous `event_group` and the event is deleted. |
| `POST` | `/api/plan/events/occurred/` | Registers a decision already taken: creates a `PlanEvent` with `status=occurred`, creates no budget rows, and adopts the existing ones passed in `expense_entry_ids`/`income_entry_ids`. `asset_ids`/`liability_ids` are **linked**, not adopted: net worth keeps generating their rows. Rows generated by an asset or liability, or already owned by another event, are rejected. Excluded from the projection because its effects are already in current net worth and budget. |
| `GET` | `/api/plan/events/{id}/budget-lines/` | Returns the user-owned event, its exact annual income/expense lines, and under `linked` the assets/liabilities the decision brought with the annual expense each one generates. |
| `POST` | `/api/plan/events/{id}/close/` | Closes an active event from `effective_date`, retires/shortens its managed recurrent budget rows, records trace details and returns the recalculated official projection. |
| `GET` | `/api/plan/foundations/` | Returns backend-owned plan foundations: cash flow, emergency fund, debt, net-worth health, planned contribution and data quality. |
| `GET` | `/api/plan/findings/` | Evaluates and returns current deterministic plan findings. |
| `GET` | `/api/plan/recommendations/` | Evaluates and returns deterministic recommendations with explanation payloads. |
| `POST` | `/api/plan/recommendations/{id}/accept/` | Marks a user-owned recommendation as accepted. |
| `POST` | `/api/plan/recommendations/{id}/dismiss/` | Marks a user-owned recommendation as dismissed. |
| `POST` | `/api/plan/recommendations/{id}/simulate/` | Creates a draft scenario preconfigured from the recommendation and returns it. |

### Budget — `/api/budget/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/budget/annual-income/` | Annual income entries. Rows expose `is_plan_managed`, `plan_event_id`, and `plan_event_name`; manual writes cannot reserve `plan_event:` lineage. |
| `GET/POST` | `/api/budget/annual-expense/` | Annual expense entries with the same plan-lineage fields and reserved-prefix rule. Managed rows reject `PUT`/`PATCH`/`DELETE` with `403 plan_managed_entry`. |
| `GET` | `/api/budget/annual-income/monthly-summary/` | Monthly planned vs executed income + budget coverage (`executed_budgeted`, `executed_unbudgeted`, `executed_total`) and category/subcategory `income_execution_breakdown`. |
| `GET` | `/api/budget/annual-expense/monthly-summary/` | Monthly planned vs executed expense + budget coverage (`executed_budgeted`, `executed_unbudgeted`, `executed_total`) and category/subcategory `expense_execution_breakdown`. |
| `GET/POST` | `/api/budget/annual-income-checkins/` | Monthly income check-ins |
| `GET/POST` | `/api/budget/annual-expense-checkins/` | Monthly expense check-ins |
| `GET` | `/api/budget/monthly-closes/{id}/plan-impact/` | Returns plan impact for a user-owned finalized/locked monthly close, or `204` when the user has no plan. |

### Accounting — `/api/accounting/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/accounting/accounts/` | Ledger accounts (`LedgerAccount`) |
| `GET/PATCH/DELETE` | `/api/accounting/accounts/{id}/` | Account detail |
| `GET/POST` | `/api/accounting/transactions/` | Transactions (`LedgerTransaction`). List supports cursor pagination, operational filters, `review_state=needs_review|reviewed`, calculated row `needs_review`, and filtered `needs_review_count`. |
| `GET/PATCH/DELETE` | `/api/accounting/transactions/{id}/` | Transaction detail |
| `GET` | `/api/accounting/transactions/daily-balance-series/` | Daily asset/liability/net ledger balance; optional validated comma-separated `account_ids` and ownership filter. |
| `GET/POST` | `/api/accounting/entries/` | Ledger entries (`LedgerEntry`) |
| `GET/PATCH/DELETE` | `/api/accounting/entries/{id}/` | Entry detail |

### Core (auxiliary data, portability) — `/api/core/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/core/fx-rates/` | FX rates |
| `GET` | `/api/core/fx/convert/` | Currency conversion (crypto precision; on-demand sync + nearest-date fallback). Consumed by the quick-entry investment flow to auto-fill the destination amount. |
| `GET` | `/api/core/inflation/` | CPI indexes (national + autonomous regions) |
| `GET` | `/api/core/market-data/status/` | Market-data synchronization status |
| `GET` | `/api/core/portable-data/meta/` | Portable bundle metadata (version, etc.) |
| `POST` | `/api/core/portable-data/import/` | Portable data import |

---

## Core APIs consumed by SaaS backend (server-to-server)

SaaS calls Core directly server-to-server in two ways:

1. user-scoped JWT (`AccessToken.for_user(user)`) for member bootstrap flows,
2. shared-secret bridge (`X-SaaS-Bridge-Secret`) for SaaS admin visibility over Core users.

| Method | Core Route | Called from | When | Description |
|--------|------------|-------------|------|-------------|
| `POST` | `/api/family-members/ensure-primary/` | `core_bootstrap.ensure_primary_family_member_in_core_for_saas_user()` | User registration / admin user creation / role assignment to `saas_member` | Ensures the user has a primary `FamilyMember` in Core. Idempotent. |
| `GET` | `/api/auth/admin/users/` | `core_admin_client.list_core_admin_users()` | SaaS admin panel refresh | Returns all Core users and external identities so SaaS can cross-reference native Core users, bootstrap users, and manual links. |

> **Note:** if `CORE_API_BASE_URL` is not configured or Core is unavailable, user registration fails with HTTP 400. See [integration flow](./saas-core-integration-flow.md) for details.

---

## Core APIs consumed by SaaS frontend

SaaS frontend accesses Core directly via `coreApi` (Axios with `VITE_CORE_API_BASE_URL`). The same SaaS session JWT is used to authenticate against Core.

In production, `VITE_CORE_API_BASE_URL` is empty so `coreApi` uses the same browser origin and Traefik handles the path split.

These endpoints are canonically defined in `core/docs/`. Frontend domains that consume them:

| Domain | Axios client | Core APIs consumed |
|--------|--------------|-------------------|
| `net-worth` | `coreApi` | Net worth items, groups, subgroups |
| `people` | `coreApi` | Family members, ownership |
| `data-input` | `coreApi` | Annual income/expense entries |
| `accounting` | `coreApi` | Accounting movements |
| `aux-data` | `coreApi` | FX rates, CPI data |
| `plan` | `coreApi` | Financial plan, projections, snapshots, members, asset function overrides, scenarios, events, foundations, findings and recommendations |
| `auth` | `api` (SaaS) | Login, me, refresh |

> The `auth` domain uses the SaaS `api` client, not `coreApi`.

---

## Required configuration

| Variable | SaaS Backend | SaaS Frontend | Description |
|----------|--------------|---------------|-------------|
| `CORE_API_BASE_URL` | ✓ | — | Core backend URL (server-to-server) |
| `JWT_SIGNING_KEY` | ✓ | — | Must match Core value |
| `ACCOUNT_LINKING_ENABLED` | ✓ | — | Enables manual core-link endpoints |
| `CORE_LINKING_SHARED_SECRET` | ✓ | — | Secret for linking tokens |
| `VITE_API_BASE_URL` | — | ✓ | SaaS backend URL (default: `http://localhost:8001`) |
| `VITE_CORE_API_BASE_URL` | — | ✓ | Browser Core backend URL (default: `http://localhost:8000`) |
| `SAAS_PUBLIC_REGISTRATION_ENABLED` | ✓ | — | Disable public registration for private production (`0`) |

## Production route ownership

| Public path | Routed to | Notes |
|-------------|-----------|-------|
| `/` and app routes | SaaS frontend | SPA fallback. |
| `/api/auth/` | SaaS backend | Login, refresh, `/me`, subscription, registration policy. |
| `/api/auth/settings/`, `/api/auth/link-token/` | Core backend | Higher-priority Core auth exceptions needed by product flows and account-linking support. |
| `/api/admin/` | SaaS backend | SaaS admin operations. |
| `/api/schema/`, `/api/docs/` | SaaS backend | SaaS API schema/docs. |
| `/admin/` | SaaS backend | Django admin for SaaS. |
| `/api/net-worth/` | Core backend | Core product API. |
| `/api/budget/` | Core backend | Core product API. |
| `/api/accounting/` | Core backend | Core product API. |
| `/api/plan/` | Core backend | Core financial plan and projection API. |
| `/api/core/` | Core backend | Auxiliary Core APIs. |
| `/api/family-members/`, `/api/ownerships/`, `/api/ownership-links/` | Core backend | Membership and ownership APIs. |
