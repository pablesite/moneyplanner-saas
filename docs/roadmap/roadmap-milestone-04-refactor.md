# Roadmap Milestone 04 Refactor (Core/SaaS)

## Objective
Complete a broad refactor across `core` and `saas` with strong quality gates, consistent architecture, and robust testing.

## Phase Status
1. Phase 0 (Repository Foundation): Completed
2. Phase 1 (Backend Refactor): Completed
3. Phase 2 (Frontend/UI Refactor): Completed
4. Phase 3 (Quality Rules/Linters): Completed
5. Phase 4 (Testing Strategy): Completed
6. Phase 5 (Docs and Release): Completed

## Key Outcomes
1. Public `core` repository operational with independent lifecycle.
2. Clear `core`/`saas` boundaries and explicit API adapters.
3. CI quality gates active for both stacks.
4. Frontend and backend coverage targets reached.
5. Critical backend service coverage completed (`memberships/services` at 100%).
6. Data Input annual income UI aligned with Net Worth style (category/subcategory grouping, owner badges, recurrent marker).

## Coverage Snapshot
1. SaaS backend: 93%
2. Core backend: 86%
3. SaaS frontend: 88.29%
4. Core frontend: 84.73%

## Definition of Done (Release V2)
- [x] Public `core` repo operational with clean base.
- [x] `saas` consumes public `core` via submodule.
- [x] Linters and type checks block merges in CI.
- [x] Minimum coverage targets achieved and reported.
- [x] UI consistency documented and applied.
- [x] Frontend evolution without structural duplication.
- [x] Code simplified with contextual comments where needed.

