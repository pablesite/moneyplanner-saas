# Core/SaaS Boundaries

## Objective
Define non-overlapping implementation boundaries between base and premium layers.

## Data Boundaries
1. `core` does not own premium ownership/member entities.
2. `saas` owns ownership/member entities and links them to core entities.

## Frontend Boundaries
1. `core/frontend` is the canonical base implementation.
2. `frontend` (saas) extends through explicit extension points.
3. Avoid full-view duplication when extension hooks can be used.

## Synchronization
1. Canonical sync direction: `core -> saas`.
2. Sync manifest: `scripts/frontend-sync-manifest.txt`.
3. Sync script: `scripts/sync_frontend_from_core.ps1`.

## API Boundaries
1. Base endpoints remain in `core`.
2. Premium endpoints remain in `saas`.
3. Keep adapters explicit (`coreApi` vs premium adapters).
