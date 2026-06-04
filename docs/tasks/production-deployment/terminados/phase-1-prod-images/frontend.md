# SaaS production deployment - Phase 1: frontend production image

## Context
The current SaaS frontend container is development-only: it installs dependencies at startup and serves Vite dev server. Production needs a static build served by nginx, with runtime routing handled by Traefik and same-origin API calls.

## Area
`frontend`

## Stack
`saas`

## Scope
1. In scope: create the SaaS frontend production image.
2. In scope: build the Vue app with production base URLs suitable for same-origin routing.
3. In scope: add nginx SPA fallback and basic security headers.
4. Out of scope: UI changes, auth storage changes, Traefik labels, and Core frontend deployment.

## Plan
1. Diagnosis
   - Compare `frontend/Dockerfile` with `core/frontend/Dockerfile.prod`.
   - Confirm the SaaS frontend works with `VITE_API_BASE_URL=""` and `VITE_CORE_API_BASE_URL=""`.
2. Change implementation
   - Add `frontend/Dockerfile.prod` as a multi-stage Node -> nginx build.
   - Add `frontend/nginx.prod.conf`.
   - Build args must allow both API clients to use same origin in production.
   - Do not include Playwright browser installation in the production image.
3. Validation
   - Build the image locally.
   - Confirm nginx serves static files and does not run Vite.
   - Run frontend quality checks in the existing dev container or CI.

## Validation
```bash
docker build -f frontend/Dockerfile.prod -t moneyplanner-saas-frontend:prod-test frontend
docker run --rm moneyplanner-saas-frontend:prod-test nginx -t
rg -n "npm run dev|vite --host|playwright install" frontend/Dockerfile.prod frontend/nginx.prod.conf docker-compose.prod.yml
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

Expected outcome:
1. The image builds successfully.
2. `nginx -t` passes.
3. Production files do not start Vite dev server or install Playwright.
4. Existing SaaS frontend quality checks pass.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - document frontend build args and same-origin API routing.
- [ ] `docs/project-status.md` - update phase status when closed.

## Risks
1. Empty Vite API base URLs rely on Traefik path routing being correct; validate this in Phase 2.
2. nginx fallback can mask missing API routes if Traefik priorities are wrong; Phase 2 must test API paths explicitly.

## Completion Criteria
- [ ] Frontend production image builds.
- [ ] nginx config validates.
- [ ] Production image serves static build, not Vite dev server.
- [ ] Validation commands pass.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
