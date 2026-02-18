# Core/SaaS Architecture Contract

## Objective
Define platform boundaries and responsibilities between `core` and `saas`.

## Responsibilities
### Core (public OSS)
1. Base net-worth domain (assets, liabilities, snapshots, summaries).
2. Standalone authentication and settings.
3. Stable base API contracts.

### SaaS (private)
1. Premium ownership and membership domain.
2. Premium validation, access control, and advanced flows.
3. Premium UX and feature gating.

## Operational Strategy
1. Version `core` independently.
2. Consume `core` in `saas` through controlled submodule updates.
3. Avoid breaking changes without migration notes.

## Milestone 04 Status (as of 2026-02-18)
1. Backend architecture aligned to `views -> serializers -> services`.
2. Frontend base architecture aligned and synchronized from `core`.
3. Quality checks active in CI for both stacks.
4. Coverage targets achieved for backend and frontend.

## Related Docs
1. `docs/architecture/api-contracts.md`
2. `docs/architecture/product-architecture.md`
3. `docs/roadmap/roadmap-milestone-04-refactor.md`

