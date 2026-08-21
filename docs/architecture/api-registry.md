# API Registry

## SaaS Backend APIs (`http://localhost:8001`)

Production origin: `https://arkenstone.app`. In production, Traefik routes SaaS backend paths from the same origin to the SaaS backend service, except the Core-owned auth exceptions documented below.

### Auth — `/api/auth/`

| Method | Route | View | Auth | Throttle | Description |
|--------|-------|------|------|----------|-------------|
| `POST` | `/api/auth/token/` | `SaasTokenObtainPairView` | None | `auth_login` | Login. Returns the short-lived `access` JWT and sets the rotating refresh token in an `HttpOnly` cookie. Repeated failures trigger a per-account temporary lock without revealing whether the account exists. |
| `POST` | `/api/auth/refresh/` | `SaasTokenRefreshView` | Refresh cookie | `auth_refresh` | Rotates the `HttpOnly` refresh cookie and returns a new `access` token. |
| `POST` | `/api/auth/logout/` | `SaasLogoutAPIView` | Bearer + refresh cookie | `auth_refresh` | Blacklists the current refresh token and clears its cookie. |
| `POST` | `/api/auth/register/` | `SaasRegisterAPIView` | None | `auth_register` | Registers a new user when public registration is enabled. Initial private production must set `SAAS_PUBLIC_REGISTRATION_ENABLED=0`; in that mode the endpoint returns canonical error `{code: "registration_disabled", ...}` and admin-created users are the onboarding path. |
| `GET` | `/api/auth/me/` | `SaasMeAPIView` | Bearer | `auth_me` | Returns authenticated user data: id, username, email, role, `must_change_password`, subscription_status, premium_enabled, account_link. |
| `POST` | `/api/auth/password/change/` | `SaasPasswordChangeAPIView` | Bearer | `auth_me` | Changes the current user's password using `current_password` + `new_password`, blacklists existing refresh sessions, issues a replacement session immediately and clears `must_change_password` in the same response cycle. |
| `POST` | `/api/auth/internal/session/` | `SaasInternalSessionAPIView` | `X-SaaS-Bridge-Secret` | — | Internal Core-to-SaaS JWT introspection. Rejects inactive users and password-revoked tokens, and reports `must_change_password`. |
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
| `GET` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Returns `{saas_users, core_users}`. `saas_users` includes roles, `must_change_password`, `account_link`, `core_user_origin` and derived `core_connection`; `core_users` includes all Core users plus their external identities and any detected SaaS connection. |
| `POST` | `/api/admin/users/` | `SaasAdminUserListCreateAPIView` | Creates a user after Django password validation. New admin-created users start with `must_change_password=true`; on their first session they can only read `/api/auth/me/`, change their password or log out. If role is `saas_member`, creation also triggers Core bootstrap. |
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
| `GET/POST` | `/api/ownerships/` | List and create ownership relationships. Dynamic shared records include `effective_splits`, resolved from the current previous-12-complete-month income allocation; `splits` remain the configured participant set. |
| `GET/PATCH/DELETE` | `/api/ownerships/{id}/` | Ownership detail |
| `GET` | `/api/ownerships/{id}/allocation-preview/?year=YYYY&month=M` | Resolves an explicit or previous-12-complete-month recurring-income allocation. Dynamic previews persist a recomputable draft snapshot and return quality, coverage, exclusions, source hash and per-member shares; frozen snapshots remain immutable. |
| `GET/POST` | `/api/ownership-links/` | Ownership links (asset <-> person) |
| `GET/PATCH/DELETE` | `/api/ownership-links/{id}/` | Ownership link detail |

Settlement configuration is opt-in and Core-owned. Annual income/expense payloads expose nullable
`ownership_id`; annual expense payloads also expose nullable `settlement_account_id`.
The SaaS frontend consumes these contracts from `/cierre-mensual`, `/people` and the annual budget
forms; it does not duplicate settlement calculations. Ledger movements are created only by the
Core settlement execution endpoints after explicit confirmation.

| Method | Route | Description |
|--------|-------|-------------|
| `GET/PUT` | `/api/budget/settlement/configuration/` | Reads or atomically replaces the disabled profile's participating accounts and zero-sum opening adjustments. |
| `GET` | `/api/budget/settlement/readiness/?year=YYYY&month=M&balance_date=YYYY-MM-DD` | Returns blockers, warnings, ownership coverage and per-wallet reconciliation for the exact optional activation date without changing balances. |
| `POST` | `/api/budget/settlement/activate/` | Activates a ready profile and captures its immutable member/account opening baseline; repeated calls are idempotent. |
| `POST` | `/api/budget/settlement/disable/` | Disables settlement without changing the existing monthly-close behavior or deleting its audit baseline. |
| `POST` | `/api/budget/monthly-closes/{id}/settlement/apply/` | Atomically applies every remaining non-cancelled recommendation for a finalized close. |
| `POST` | `/api/budget/monthly-closes/{id}/settlement/recommendations/{recommendation_id}/{action}/` | Executes `accept`, `apply`, `reconcile`, `cancel` or `reverse`; apply/reverse accept date, optional partial amount and idempotency key. |
| `GET` | `/api/budget/monthly-closes/{id}/settlement/recommendations/{recommendation_id}/candidates/` | Lists conservatively matched posted transfers eligible for explicit reconciliation. |

`GET /api/budget/monthly-close/{year}/{month}/` includes additive `ownership_settlement`,
`liquidity_adjustments` and `financial_result`. The latter is the role-aware monthly outcome:
eligible income excludes asset sales; `financial_savings` is retained cash after financial
contributions, while `net_savings` also includes real-estate/tangible formation and debt-principal
repayments. Ledger account type separates principal from interest; the detailed formation fields are
`real_estate_formation`, `tangible_asset_purchases` and `debt_principal_repayment`.
`liquidity_adjustments` lists posted `adjustment` entries within the liquidity
perimeter and their signed base-currency total, which is already included in the expected close.
Disabled profiles return `status=disabled`. Active drafts return `ready` or `not_ready` with
allocations, per-member economic balances, account targets, recurrent reserves, transaction-traced
compensations, transfer recommendations, reconciliation and quality. Finalized/locked closes return
the immutable snapshot as `status=finalized`. Saved recommendations also expose lifecycle,
applied/remaining amounts, linked movements and post-application account reconciliation.

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
| `GET` | `/api/net-worth/timeline/` | Net worth timeline. Monthly `rows` include `assets_by_category` in the user's base currency; `comparisons` exposes the baselines `previous_month_close`, `same_day_previous_month`, `previous_year_close`, and `same_day_previous_year` for summary UIs. |
| `GET` | `/api/net-worth/liquidity/monthly-summary/` | Monthly liquidity summary; includes cash, cards, and interest-bearing investments. Asset rows include `annual_interest_tae` to identify remunerated liquidity. |

### Investment Portfolio — `/api/portfolio/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET/POST` | `/api/portfolio/provider-mappings/` | User-owned provider mappings. Automatic prices require explicit symbol, quote currency, market where applicable, and confirmation. |
| `GET/PATCH/DELETE` | `/api/portfolio/provider-mappings/{id}/` | Maintains a custom instrument mapping; canonical mappings are not user-editable. |
| `GET` | `/api/portfolio/prices/` | Read-only daily closes visible through the authenticated user's positions. |
| `POST` | `/api/portfolio/instruments/{id}/refresh/` | Refreshes confirmed mappings on demand. A failed provider call preserves the last valid close and returns an explicit error. |
| `GET` | `/api/portfolio/positions/{id}/valuation/` | Resolves the effective dated value with freshness and provenance. |
| `GET/POST` | `/api/portfolio/valuations/` | Lists total valuations and creates dated manual values for user-owned positions. |
| `GET/PATCH/DELETE` | `/api/portfolio/valuations/{id}/` | Maintains manual values; legacy-derived rows are read-only. |
| `GET` | `/api/portfolio/valuation-health/` | Aggregates fresh/stale/missing counts plus mapping, price and provenance issues. |
| `GET` | `/api/portfolio/overview/?date_from=&date_to=&member_id=` | Portfolio hero read model: value, net contribution, monetary result, nominal/real return and per-metric coverage. |
| `POST` | `/api/accounting/transactions/quick-entry/` | Now also accepts `investment_units`, `investment_unit_price` and `fee_amount` on `investment` movements. When the movement pairs a position's ledger account with the cash of that position's own container, Core leaves a `PortfolioTrade` for it — booking money is Contabilidad's job, so the operation record has to come from there too. `fee_amount` books the broker's commission as its own expense movement (`consumption_expenses/financial_commitments`) against the account that funds the movement, linked through `fee_for`: the invested amount stays clean, the funding account matches the statement, and the trade record carries the cost. `GET`/`PUT` on `/api/accounting/transactions/{id}/` read and write the same `fee_amount`, so a commission is corrected where it was registered — omitted leaves it, `0` deletes it, a new amount rewrites it in place. An `expense` may now be charged to an asset account of category `investments` (a crypto exchange charging its fee out of the balance). A reinversión also accepts `destination_fee_amount`, the purchase-side commission charged to the position that receives the money; outside a reinversión it is rejected. |
| `GET/POST/PATCH/DELETE` | `/api/portfolio/strategies/?ownership_id=` | Investment policy per ownership scope, versioned by `effective_from`. Writing a strategy writes its targets in the same call; a target belongs to an asset class or to a position, never both, and `unclassified` is refused because it is the absence of an answer. A class target is a share of the portfolio and they must total 100; a position target is a share **of its class** ("of my equity, 60% to the index fund"), so it does not count towards that 100 and several of them cannot exceed 100 within one class. Carries `max_cost_share` and `min_line_amount`, which are policy, not constants. |
| `GET/POST/PATCH/DELETE` | `/api/portfolio/allocation-rules/` | Per-position constraints: exclusion, minimum contribution, rounding step, operation cost and whether a fee-free recurring plan applies. |
| `GET/POST/PATCH/DELETE` | `/api/portfolio/commitments/` | Amounts that must be contributed regardless of drift, hanging from a `position_id` **or** a `container_id` — never both: a platform's monthly minimum belongs to the platform, and the split across its products is the engine's job. An annual quota is claimed paced over the months left in the year, so it lasts to December instead of being emptied in January: a monthly floor that keeps a broker perk, or an annual quota — which is a ceiling too, since contributing above a deductible cap does not deduct. `breach_cost` is what breaking it costs per year, and it is what decides who gets served when the contribution cannot cover every commitment: dropping a recurring plan can cost the remuneration of a whole bank balance, far more than the contribution itself. |
| `GET` | `/api/portfolio/allocation/?ownership_id=&on_date=` | Actual against target for one scope, by class and by position, with the band each one sits in. `by_position` carries every position's effective target, whether it was written or inherited from its class split by current weight (`band: derived`), so the second level is answerable without writing a line per product. Drift is positive when a slice runs ahead of its target and negative when it falls short. What you hold without having planned it shows as `unplanned` rather than hidden. Linked container cash counts as liquidity, so the policy line for cash reads against real money. `planned_contribution` carries what the budget planned to invest that month, `contributed_this_month` what has actually gone in **net of divestments** —selling a fund to buy another is not new money, and counting only the inflows let a reshuffle eat the month's budget without a euro leaving your pocket— and `suggested_contribution` the difference, which is what is left to contribute. All read-only: choosing another figure does not rewrite the budget. |
| `GET/POST/PATCH/DELETE` | `/api/portfolio/exposures/?position_id=` | What a position holds inside, by dimension (geography, sector, vehicle) and bucket, with the reference date of the factsheet it was copied from. A dimension cannot be split beyond 100%; below that is normal and the rest is reported as uncovered. |
| `GET` | `/api/portfolio/exposure/?on_date=` | Aggregate exposure of the portfolio per dimension, computed over the **declared** value with its coverage beside it, plus concentration (top five, effective number of equal positions) and overlap between products that share exposure. |
| `GET` | `/api/portfolio/allocation/scopes/` | The ownership scopes that actually hold positions, largest first, with their count, value and whether they already have a policy. Without it the UI landed on whichever scope came first, which could be a toddler's 411 € crypto sleeve or someone with no positions at all. |
| `POST` | `/api/portfolio/contribution/solve/` | Simulates the split of a contribution without saving anything. `unreachable` names the classes that have a target and no product to put the money in: their share ends up spread over the rest, and saying so is the difference between a decision and a surprise. `unmet_commitments` names what this contribution does not cover, with the yearly cost of breaking it — the figure that says whether it is worth contributing more this month. |
| `GET/POST` | `/api/portfolio/baskets/?ownership_id=&status=` | Contribution baskets. `POST` solves and persists a proposal; nothing reaches accounting until confirmed. `GET` filters by scope and by status, because the screen asks what is still open in one scope, not for the whole history of proposals. |
| `POST` | `/api/portfolio/baskets/{id}/confirm/` | Turns lines into real operations. Accepts `line_ids` for partial confirmation: what you do not confirm stays pending and the basket only closes when nothing is left to decide. A line to a container's cash is a transfer (loading the platform's wallet is not buying anything); a line to a position is a purchase funded from `source_account_id`. |
| `POST` | `/api/portfolio/baskets/{id}/discard/` | Discards without deleting: the proposal you did not follow is also information. |
| `GET/POST` | `/api/portfolio/ownership-periods/?position_id=` | Ownership stretches of a position. Creating one closes the open stretch on the eve of its start, which is how a change of ownership is recorded; `DELETE` undoes the last stretch and reopens the previous one. Stretches remain otherwise immutable. |
| `GET` | `/api/portfolio/positions/performance/?date_from=&date_to=&member_id=` | Position read models with native/base values, freshness, TWR/Dietz/MWR, P&L/cost and asset/FX attribution. `holding_currency` is what the position is denominated in (BTC, ETH, USD…), as opposed to `native_currency`, which is what it is valued in — filtering by currency needs the former. |
| `GET` | `/api/portfolio/timeline/?date_from=&date_to=&member_id=` | Bounded monthly value/contribution/result series; maximum requested range is 20 years and gaps stay explicit. |
| `GET` | `/api/portfolio/performance/?date_from=&date_to=&member_id=` | Detailed aggregate flows, reconciliation, nominal/real TWR or declared Dietz fallback, MWR/XIRR and coverage. |
| `GET` | `/api/portfolio/quality/?date_from=&date_to=&member_id=` | Value, ownership, FX and metric readiness for the requested historical perimeter. |
| `POST` | `/api/portfolio/positions/{id}/archive/` | Archives a position and its backing asset without deleting history. |
| `POST` | `/api/portfolio/positions/{id}/reopen/` | Reopens an archived position and its backing asset. |
| `POST` | `/api/portfolio/operations/confirm/` | An operation is funded either from a container's cash (`cash_account_id`) or straight from any of your own asset accounts (`source_account_id`), and requires exactly one. A bank has no investment wallet: forcing container cash meant inventing an account that does not exist and pulling day-to-day spending money into the portfolio. |
| `POST` | `/api/portfolio/positions/{id}/confirm-setup/` | Also accepts `class_breakdown`, a list of `{asset_class, percent}` that must add up to 100 (empty clears it): the look-through of a position that is not of a single class. Confirms tracking style and reconstructed/cutoff history mode without mutating ledger history, and optionally reassigns `container_id` and the instrument's `asset_class`. Reclassifying is refused for canonical instruments, which are shared across portfolios. Re-callable: confirming does not lock the position. |
| `POST` | `/api/portfolio/positions/resync-valuations/` | Pulls into the portfolio any revaluation the ledger already holds, for drift that reached the database underneath the ORM (a restore or bulk load fires no signal). Returns `positions_checked` and `valuations_created`. |
| `GET` | `/api/portfolio/workspace/?container_id=&asset_class=&currency=` | Overview, performance, positions, timeline and quality for one period off a single context load. An inventory filter scopes **all** of them and the payload echoes the surviving position ids in `scope`; only the positions list stays whole, since the table filters client-side over the same set. The context spans from inception so the timeline can share it, and the metric block and position rows are computed once and reused across outputs. |
| `GET/POST/PATCH/DELETE` | `/api/portfolio/cash-accounts/` | The cash of a container: one link per container and currency. Moving that cash to another platform is a `PATCH` of `ledger_account_id`, not delete-and-recreate — the unique link blocks recreating before releasing, and `DELETE` is refused with a readable message when a saved basket already points at that cash. |
| `GET` | `/api/portfolio/operations/options/` | User-scoped positions, independent performance/detail coverage and available container cash. `linkable_cash_accounts` are the unlinked liquidity accounts a container can adopt; `funding_accounts` are every own liquidity account money can come out of — the two differ precisely on the wallet of the platform you are buying inside. |
| — | `contributed_to_date` on timeline points | Capital contributed since inception, so the series is comparable with `value` on any window. `net_contributed` stays period-scoped and drives the period result; plotting it against `value` restarts the line at zero and misreads a one-year window as if nothing had been contributed before. |
| — | `value_status` on position reads | `fresh`, `stale`, `missing` or `at_cost`. `at_cost` means the value is the posted ledger balance rather than a valuation: current by definition, so never stale, and excluded from the review counters. `quality.positions` counts it in its own `at_cost` bucket. |
| — | `return.method` on every performance read | `twr` (exact chain), `linked_dietz` (Modified Dietz inside each observed subperiod, then chained) or `modified_dietz` (whole-period, money-weighted last resort). Only the first two may be presented as a time-weighted return. `return.mwr_xirr` is the money-weighted counterpart and is already annualized; `return.twr_annualized` is the annual rate of the cumulative `return.twr`, so the two can be compared. |
| `POST` | `/api/portfolio/operations/preview/` | Validates an operation and returns the signed token required for direct confirmation. For a valuation it adds `ledger_effect` with the revaluation delta to be posted, or `syncs_accounting=false` plus a reason. |
| `POST` | `/api/portfolio/operations/confirm/` | Atomically confirms the unchanged previewed transfer, trade, income, fee, valuation or corporate action. A manual valuation returns `ledger_transaction_id` with the revaluation it posted, or `null` when it stays analytic. |
| `POST` | `/api/portfolio/imports/upload/` | Stages a generic UTF-8 CSV and returns detected headers and rows; exact file reuploads are idempotent. |
| `GET` | `/api/portfolio/imports/{id}/` | Returns a user-owned import batch and its row-level status/errors. |
| `POST` | `/api/portfolio/imports/{id}/preview/` | Applies explicit column mapping, normalization, duplicate detection and row validation. |
| `POST` | `/api/portfolio/imports/{id}/confirm/` | Atomically confirms all or selected valid rows through the portfolio operation service. |

### Financial Plan — `/api/plan/`
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/plan/` | Returns the authenticated user's financial plan. |
| `POST` | `/api/plan/` | Creates or idempotently updates the user's single financial plan. |
| `PATCH` | `/api/plan/` | Partially updates the user's financial plan. |
| `POST` | `/api/plan/recalculate/` | Recalculates the projection and persists an official `ProjectionSnapshot`. Optional `scenario=prudent|expected|favorable`; default `expected`. |
| `GET` | `/api/plan/projection/` | Calculates a projection without persisting a snapshot. Optional `scenario=prudent|expected|favorable`; default `expected`. |
| `GET` | `/api/plan/overview/` | UX aggregate: status, projection, prudent-to-favorable range, confidence, compact foundations and highest-priority next action. Without `scenario`, the profile selects prudent/expected/favorable. |
| `GET` | `/api/plan/history/` | Returns recent official projection snapshots. |
| `GET` | `/api/plan/capital-requirements/` | Capital required at the target date to sustain each requested monthly need (`monthly_amounts=a,b,...` in today's EUR, 1–8 values; optional `scenario` and `target_year`). Same math as the projection's target capital (inflation, pension offsets, bridge period, withdrawal rate) without plan-event deltas. Used by the SaaS "Qué cubre ya tu capital" milestones, which pass `target_year` = the horizon of the denominator on screen (the overview's sustainable retirement year), since the capital required depends on how much bridge is left until the pension. |
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
| `POST` | `/api/plan/events/planned-decision/` | Groups existing one-off budget rows into a projected purchase/sale. `transaction_year` + `transaction_month` define the impact month; new debt service is prorated from that month. Projection trajectory rows expose negative `financing_gap` until future free cash covers an unfunded outflow. |
| `PATCH` | `/api/plan/events/{id}/planned-decision/` | Edits a grouped decision while it remains `planned`. Rebuilds only its future impact and recalculates the official projection; adopted budget rows and linked net-worth positions are preserved. |
| `GET` | `/api/plan/events/{id}/budget-lines/` | Returns the user-owned event, its exact annual income/expense lines, and under `linked` the assets/liabilities the decision brought with the annual expense each one generates. |
| `POST` | `/api/plan/events/{id}/close/` | Closes an active event from `effective_date`, retires/shortens its managed recurrent budget rows, records trace details and returns the recalculated official projection. |
| `POST` | `/api/plan/events/{id}/materialize/` | The forecast became real: creates the `Asset`/`Liability` prefilled from the scenario (principal, rate, term), deletes the plan's forecast financing rows (the liability regenerates them) and releases the rest back to the user. The event becomes `occurred` and stops feeding the projection. Only valid while `planned`. |
| `POST` | `/api/plan/events/{id}/cancel/` | Changed your mind about something that has not happened: deletes the forecast budget rows whole, deletes the event, returns the source scenario to `draft` and restores the projection. Present-day reality is untouched. Only valid while `planned`. |
| `GET` | `/api/plan/foundations/` | Returns backend-owned plan foundations: cash flow, emergency fund, debt, net-worth health, planned contribution and data quality. Scored blocks include a `status` band (`good`/`warning`/`critical`) so the frontend colors without owning thresholds. |
| `GET` | `/api/plan/findings/` | Evaluates and returns current deterministic plan findings. |
| `GET` | `/api/plan/recommendations/` | Evaluates and returns deterministic recommendations with explanation payloads. |
| `POST` | `/api/plan/recommendations/{id}/accept/` | Compatibility endpoint. New clients accept by incorporating the linked scenario. |
| `POST` | `/api/plan/recommendations/{id}/dismiss/` | Marks a user-owned recommendation as dismissed. |
| `POST` | `/api/plan/recommendations/{id}/simulate/` | Creates a draft scenario preconfigured from the recommendation and returns it. An adjustable contribution recommendation accepts optional `monthly_contribution_delta` and `start_date` overrides, but rejects values above its estimated margin or before its recovery date. |
| `GET` | `/api/plan/recommendations/{id}/preview/` | Returns before/after impact without creating scenarios, snapshots or budget rows. Optional `monthly_contribution_delta` and `start_date` query parameters recalculate an adjustable recommendation and expose affordability before it is incorporated. |
| `POST` | `/api/plan/recommendations/{id}/snooze/` | Postpones a recommendation until a future `snoozed_until` date. |

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
| `SAAS_AUTH_INTROSPECTION_URL` | Core | — | Internal SaaS endpoint used by Core to validate external sessions |
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
