# Core/SaaS Roadmap

## Scope
Execution backlog for moving to the target architecture defined in `docs/architecture.md`.

## Current Status
- Frontend split between `coreApi` and `saas api`.
- Frontend build is green.
- Architecture contract documented.

## Phases

### Phase 1: Compatibility Layer in SaaS
- Create a dedicated service layer in `saas` for ownership assignment and usage checks.
- Remove ownership rule duplication from view/serializer layers.
- Add tests for edit/delete constraints when ownership is in use.

### Phase 2: Remove Premium Domain from Core
- [x] Remove ownership/member models from `core`.
- [x] Remove ownership/member endpoints from `core` net-worth API.
- [x] Keep `core` workflows usable with unassigned/basic ownership semantics.
- [ ] Release with migration notes and version bump.

### Phase 3: Finalize Premium Extension in SaaS
- Add/activate premium link tables from ownership to base entities.
- Ensure `is_in_use` is computed from real links (not hardcoded).
- Adapt frontend premium views to consume only SaaS ownership APIs.

### Phase 4: Hardening
- Add integration tests for cross-domain flows (`core` + `saas`).
- Add rollout checklist for submodule upgrade and compatibility verification.
- Document recovery plan for mixed/legacy datasets.

## Acceptance Criteria
- `core` runs standalone as a full basic product.
- `saas` delivers ownership premium features without reintroducing premium entities into `core`.
- Frontend has explicit and unambiguous endpoint boundaries between base and premium domains.
