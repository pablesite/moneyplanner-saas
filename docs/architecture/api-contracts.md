# API Contracts

## Objective
Document stable API behavior for both stacks.

## Core API (Base)
1. Auth/token/settings endpoints.
2. Net-worth assets/liabilities/snapshots endpoints.
   - Assets and liabilities include `start_date`.
   - Liabilities include fixed-rate `annual_interest_tae` for mortgage/personal loan/credit card.
   - Residential real-estate assets with `valuation_model=real_estate_auto` keep
     `initial_purchase_value` synchronized with the submitted `amount`.
   - Assets and liabilities expose monthly timeline detail endpoints based on effective
     `as_of_date` valuation.
   - Asset/liability valuation checkpoints can be persisted independently from the
     aggregate net-worth snapshots.
   - Investment assets can also persist dated cash events (`contribution`, `withdrawal`,
     `fee`, `passive_income`) that feed the effective valuation and timelines.
   - Cash assets can persist dated liquidity events (`inflow`, `outflow`, `fee`, `interest`)
     that feed the effective balance and monthly timelines between check-ins.
   - Dynamic liabilities can persist dated liability events (`charge`, `payment`, `fee`,
     `interest`, `adjustment`) that feed the effective outstanding balance and timelines.
   - Liquidity monthly check-ins act as manual monthly valuation checkpoints for cash assets.
3. Summary and settings contracts.
   - `/api/net-worth/timeline/` returns aggregate monthly evolution and accepts category
     filters.
   - `/api/net-worth/assets/{id}/timeline/` and `/api/net-worth/liabilities/{id}/timeline/`
     return per-position monthly evolution.
4. Annual income endpoints (`/api/budget/annual-income/` + `/api/budget/annual-income/totals/`).
5. Annual expense endpoints (`/api/budget/annual-expense/` + `/api/budget/annual-expense/totals/`).
   - Entry payloads include `is_active`, enabling UI visibility filters for active/archived/all.
   - System-generated temporary commitments inherit `owner_name` from the linked source
     asset/liability ownership.

## SaaS API (Premium)
1. Membership and ownership endpoints.
2. Admin/RBAC endpoints.
3. Subscription/account-linking endpoints.

## Contract Rules
1. Breaking changes require migration notes.
2. Error shape must be stable and explicit.
3. Field removals/renames must be documented before release.
