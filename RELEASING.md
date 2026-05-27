# Releasing moneyplanner-saas

## Versioning Policy
- Use semantic versioning: `MAJOR.MINOR.PATCH`.
- `MAJOR`: breaking API or behavior changes.
- `MINOR`: backward-compatible feature updates.
- `PATCH`: backward-compatible fixes/docs/tests/internal cleanup.
- Canonical in-repo version is stored in `VERSION`.
- Public release version is the Git tag `vX.Y.Z`.

## Release Process
1. Merge normal feature/fix PRs into `main` only after the local quality matrix passes.
2. On every push to `main`, `.github/workflows/ci-main.yml` runs CI and then `release-please`.
3. `release-please` opens or updates a release PR. That PR is the only place where release metadata is changed:
   - `VERSION`
   - `.release-please-manifest.json`
   - `CHANGELOG.md`
   - `frontend/package.json`
   - `frontend/package-lock.json`
4. Review and merge the release PR when ready to publish. Do not edit version files manually in feature/fix PRs.
5. After the release PR is merged, `release-please` creates the GitHub release and tag.

## Local Quality Matrix
   - `docker compose exec saas_backend ruff check .`
   - `docker compose exec saas_backend ruff format --check .`
   - `docker compose exec saas_backend mypy .`
   - `docker compose exec saas_backend python manage.py test saas_access`
   - `docker compose exec saas_frontend npm run lint`
   - `docker compose exec saas_frontend npm run format:check`
   - `docker compose exec saas_frontend npm run typecheck`
   - `docker compose exec saas_frontend npm run test:unit`

## Breaking Changes Checklist
- Document migration and rollback guidance.
- Update architecture/API contract docs when needed.
- Call out renamed/removed fields, endpoints, and environment flags.
