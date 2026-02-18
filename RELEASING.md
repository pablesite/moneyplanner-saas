# Releasing moneyplanner-saas

## Versioning Policy
- Use semantic versioning: `MAJOR.MINOR.PATCH`.
- `MAJOR`: breaking API or behavior changes.
- `MINOR`: backward-compatible feature updates.
- `PATCH`: backward-compatible fixes/docs/tests/internal cleanup.
- Canonical in-repo version is stored in `VERSION`.
- Public release version is the Git tag `vX.Y.Z`.

## Release Process
1. Ensure `main` is green in CI (`.github/workflows/quality-saas.yml`).
2. Run local quality matrix in Docker:
   - `docker compose exec saas_backend ruff check .`
   - `docker compose exec saas_backend ruff format --check .`
   - `docker compose exec saas_backend mypy .`
   - `docker compose exec saas_backend python manage.py test memberships`
   - `docker compose exec saas_frontend npm run lint`
   - `docker compose exec saas_frontend npm run format:check`
   - `docker compose exec saas_frontend npm run typecheck`
   - `docker compose exec saas_frontend npm run test:unit`
3. Update `VERSION` with `X.Y.Z`.
4. Update release notes/changelog references in docs.
5. Create and push tag:
   - `git tag vX.Y.Z`
   - `git push origin main --tags`
6. Publish GitHub release from that tag.

## Breaking Changes Checklist
- Document migration and rollback guidance.
- Update architecture/API contract docs when needed.
- Call out renamed/removed fields, endpoints, and environment flags.
