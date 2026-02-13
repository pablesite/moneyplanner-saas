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

## Related
- Pending work and migration tasks are tracked in `docs/roadmap.md`.
