# Core/SaaS Architecture Contract

## Goal
- `core` is public OSS and must be usable on its own.
- `saas` is private and adds premium capabilities without forcing premium concepts into `core`.

## Bounded Responsibilities

### Core (public)
- Basic net-worth domain: assets, liabilities, snapshots, summary.
- Auth basics required for standalone use.
- Currency and inflation support used by base net-worth flows.
- Stable API contract for basic users.

### SaaS (private)
- Premium ownership model: family members, ownerships, splits, usage constraints.
- Advanced validations and premium workflows.
- Premium UI/UX and feature gating.

## Non-Goals
- `core` must not contain premium-only domain entities.
- `saas` should not duplicate core business logic unless explicitly unavoidable.

## Data Model Strategy

### Target state
- `core` models do not include ownership entities.
- `saas` owns ownership entities and links them to base entities.

### Recommended linkage
- In `saas`, keep premium link tables referencing base entity IDs:
  - `asset_id -> core asset`
  - `liability_id -> core liability`
  - `ownership_id -> saas ownership`
- Enforce premium invariants in `saas` services/APIs (for example, "ownership in use").

## API Contract Strategy
- Keep base net-worth endpoints in `core`.
- Expose premium endpoints from `saas`.
- Frontend uses explicit clients:
  - `coreApi` for base domain.
  - `api` (saas) for premium domain.

## Operational Strategy
- Version `core` independently.
- Upgrade `core` in `saas` through controlled bumps (submodule update + compatibility checks).
- Avoid cross-repo breaking changes without migration notes.

## Migration Plan

### Phase 0: Stabilize (completed)
- Frontend split between `coreApi` and `saas api`.
- Build is green.

### Phase 1: Define compatibility layer
- Add explicit service layer in `saas` for ownership assignment/use checks.
- Keep current behavior, but centralize rules.

### Phase 2: Remove premium domain from core
- Delete ownership/member models and endpoints from `core`.
- Keep `core` fully usable with unassigned/basic ownership semantics.
- Release as a new major/minor version depending on API impact.

### Phase 3: Finalize premium extension in saas
- Implement/activate link tables and premium constraints in `saas`.
- Ensure premium UI consumes only `saas` ownership APIs.

### Phase 4: Hardening
- Add integration tests for cross-domain flows.
- Document upgrade path from previous mixed model.

## Acceptance Criteria
- `core` can run alone and cover a complete basic net-worth workflow.
- `saas` can run with premium ownership features without reintroducing premium entities into `core`.
- Frontend has no endpoint ambiguity between base and premium domains.
