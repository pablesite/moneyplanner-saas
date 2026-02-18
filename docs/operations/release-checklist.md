# Release Checklist (Core/Submodule in SaaS)

## Objective
Upgrade `core` in `saas` safely without breaking compatibility.

## 1. Preflight
- [ ] Clean status in main repo (`git status`)
- [ ] Clean status in submodule (`git -C core status`)
- [ ] Review delta between current and target `core` commit
- [ ] Review API contract impact (`docs/architecture/api-contracts.md`)

## 2. Submodule Update
- [ ] Move `core` to target commit/tag
- [ ] Commit updated submodule pointer in `saas`

## 3. Migrations and Startup
- [ ] Recreate affected services
- [ ] Run migrations
- [ ] Run Django `check`

## 4. Automated Validation
- [ ] SaaS backend quality + tests
- [ ] Core backend quality + tests
- [ ] SaaS frontend quality + tests
- [ ] Core frontend quality + tests

## 5. Smoke Tests
- [ ] Login flow
- [ ] Net worth CRUD
- [ ] Ownership flow (SaaS)
- [ ] Snapshot/settings flows

## 6. Rollback
- [ ] Identify previous stable submodule commit
- [ ] Revert pointer if needed
- [ ] Re-run critical checks

## 7. Closeout
- [ ] Update roadmap/release docs
- [ ] Tag release when stable
