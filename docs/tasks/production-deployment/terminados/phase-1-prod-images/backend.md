# SaaS production deployment - Phase 1: backend production image

## Context
The current SaaS backend container is development-only: it mounts the source tree and runs `python manage.py runserver`. Production needs a deterministic image that starts through Gunicorn, runs migrations safely, and can be built by GitHub Actions before deploy.

## Area
`backend`

## Stack
`saas`

## Scope
1. In scope: create the SaaS backend production image and entrypoint.
2. In scope: add production server dependencies if missing.
3. In scope: validate the image starts without relying on bind-mounted source.
4. Out of scope: Traefik labels, remote deployment, public registration policy, and Core backend changes.

## Plan
1. Diagnosis
   - Compare `backend/Dockerfile` with `core/backend/Dockerfile.prod`.
   - Confirm whether `gunicorn` and static-file support are present in `backend/requirements.txt`.
2. Change implementation
   - Add `backend/Dockerfile.prod`.
   - Add `backend/entrypoint.prod.sh`.
   - The entrypoint must run `python manage.py migrate --noinput`, then start `gunicorn saas.wsgi:application --bind 0.0.0.0:8000`.
   - Do not run `seed` automatically from the entrypoint unless explicitly controlled by production env vars in the final compose.
3. Validation
   - Build the image locally.
   - Run Django deployment checks in the container with production-like env vars.
   - Confirm no production command uses `runserver`.

## Validation
```bash
docker build -f backend/Dockerfile.prod -t moneyplanner-saas-backend:prod-test backend
docker run --rm moneyplanner-saas-backend:prod-test sh -lc "gunicorn --version"
rg -n "runserver|npm run dev|vite --host" backend/Dockerfile.prod backend/entrypoint.prod.sh docker-compose.prod.yml
```

Expected outcome:
1. The image builds successfully.
2. `gunicorn --version` works inside the image.
3. The `rg` command finds no production backend `runserver` usage.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - document the backend production image and startup command.
- [ ] `docs/project-status.md` - update phase status when closed.

## Risks
1. Running migrations on every boot can fail deploy if the DB is unavailable; mitigate with DB healthchecks and clear rollback instructions.
2. Missing production dependencies will only surface at build/start time; validate the image before touching compose.

## Completion Criteria
- [ ] Backend production image builds.
- [ ] Entrypoint starts Gunicorn, not Django `runserver`.
- [ ] Validation commands pass.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
