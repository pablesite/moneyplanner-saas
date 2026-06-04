# SaaS production deployment - Phase 3: security hardening and private access

## Context
The first production deployment is private. Users must be created by SaaS admins, not through public registration. Django must run with production-safe security settings and strong secrets.

## Area
`backend`

## Stack
`both`

## Scope
1. In scope: harden SaaS and Core backend production settings.
2. In scope: add `SAAS_PUBLIC_REGISTRATION_ENABLED=0` behavior.
3. In scope: document production env vars and secret requirements.
4. Out of scope: replacing JWT localStorage, billing, invite codes, and full security audit remediation beyond deploy blockers.

## Plan
1. Diagnosis
   - Run `python manage.py check --deploy` in current containers to capture existing warnings.
   - Review SaaS and Core settings for `SECURE_*`, cookie, proxy, CORS, and secret validation behavior.
2. Change implementation
   - Add production env-driven settings for SSL proxy header, secure cookies, HSTS, SSL redirect, trusted origins, and CORS.
   - Require strong `DJANGO_SECRET_KEY` and `JWT_SIGNING_KEY` when `DEBUG=0`.
   - Add `SAAS_PUBLIC_REGISTRATION_ENABLED`, defaulting to enabled in dev and disabled in production env docs.
   - When disabled, `POST /api/auth/register/` must return the canonical error shape with code `registration_disabled`.
   - Keep admin user creation through `POST /api/admin/users/` and controlled seed.
3. Validation
   - Run tests for registration enabled and disabled.
   - Run Django deployment checks with production-like env.
   - Verify admin-created member still triggers Core bootstrap.

## Validation
```bash
docker compose exec saas_backend python manage.py test saas_access.tests.test_auth saas_access.tests.test_admin saas_access.tests.test_bootstrap
docker compose exec saas_backend python manage.py check --deploy
docker compose -f core/docker-compose.yml exec backend python manage.py check --deploy
curl -i -X POST https://moneyplanner.codinglab.es/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"blocked","password":"blocked1234","email":"blocked@example.com"}'
```

Expected outcome:
1. SaaS auth/admin/bootstrap tests pass.
2. `check --deploy` has no unresolved production blocker.
3. Public registration returns a controlled disabled-registration error in production.
4. Admin-created users still bootstrap into Core.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - document required secrets and private access policy.
- [ ] `docs/roadmap/saas-pilot-integration-checklist.md` - mark public registration as intentionally disabled for private pilot.
- [ ] `docs/architecture/api-registry.md` - document production behavior for `POST /api/auth/register/`.
- [ ] `docs/project-status.md` - update phase status when closed.

## Risks
1. Disabling public registration can block onboarding if admin creation breaks; mitigate by validating admin-created member flow.
2. HSTS or SSL redirect misconfiguration behind Cloudflare/Traefik can cause redirect loops; keep these settings env-driven.
3. Shared JWT signing key must stay identical across SaaS and Core.

## Completion Criteria
- [ ] Production hardening settings are env-driven.
- [ ] Public registration can be disabled in production.
- [ ] Admin-created member onboarding still works.
- [ ] Validation commands pass.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
