# Product Functional Architecture

## Objective
Describe product modules and their functional dependencies.

## Current Core Module
1. Net worth
   - Assets
   - Liabilities
   - Snapshots
   - Summary and settings

## Premium Module Layer (SaaS)
1. Ownership/memberships and related controls.
2. Role-based administration and subscription-aware access.

## Planned Modules
1. Budget
2. Accounting
3. Investment portfolio
4. Simulator
5. Data input module (annual income/expenses + assets + liabilities)

Reference:
- `docs/architecture/annual-income-taxonomy.md`
- `docs/architecture/annual-expense-taxonomy.md`
- `docs/architecture/capabilities-matrix.md`

## Principles
1. Keep modules cohesive.
2. Minimize cross-module coupling.
3. Keep contracts explicit at module boundaries.
