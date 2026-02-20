# API Contracts

## Objective
Document stable API behavior for both stacks.

## Core API (Base)
1. Auth/token/settings endpoints.
2. Net-worth assets/liabilities/snapshots endpoints.
   - Assets and liabilities include `start_date`.
   - Liabilities include fixed-rate `annual_interest_tae` for mortgage/personal loan/credit card.
3. Summary and settings contracts.
4. Annual income endpoints (`/api/budget/annual-income/` + `/api/budget/annual-income/totals/`).
5. Annual expense endpoints (`/api/budget/annual-expense/` + `/api/budget/annual-expense/totals/`).

## SaaS API (Premium)
1. Membership and ownership endpoints.
2. Admin/RBAC endpoints.
3. Subscription/account-linking endpoints.

## Contract Rules
1. Breaking changes require migration notes.
2. Error shape must be stable and explicit.
3. Field removals/renames must be documented before release.
