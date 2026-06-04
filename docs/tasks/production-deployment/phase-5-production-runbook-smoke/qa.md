# SaaS production deployment - Phase 5: runbook and production smoke

## Context
After images, compose, hardening, and CI/CD exist, production still needs an operator-facing runbook and a real smoke validation from outside the LAN. This phase closes pilot readiness for the private SaaS deployment.

## Area
`qa`

## Stack
`both`

## Scope
1. In scope: complete `docs/operations/production-deploy.md`.
2. In scope: document Cloudflare CNAME and tunnel assumptions.
3. In scope: document Restic backup/restore expectations.
4. In scope: execute and record final smoke validation.
5. Out of scope: implementing new monitoring tools, billing, invite codes, or Core frontend deployment.

## Plan
1. Diagnosis
   - Confirm server-side files: `docker-compose.prod.yml`, `.env.prod`, GHCR auth, external `proxy` network, and Restic coverage.
   - Confirm Cloudflare CNAME `moneyplanner.codinglab.es` points to the tunnel.
2. Change implementation
   - Finalize the production runbook with deploy, rollback, logs, diagnostics, and restore notes.
   - Update the pilot checklist with what is validated and what remains pending.
3. Validation
   - Execute production smoke from outside the LAN.
   - Capture command outputs or checklist notes in the runbook/checklist.

## Validation
```bash
curl -I https://moneyplanner.codinglab.es/
curl -I https://moneyplanner.codinglab.es/api/auth/mode/
curl -I https://moneyplanner.codinglab.es/api/core/market-data/status/
docker compose -f docker-compose.prod.yml --env-file .env.prod ps
docker compose -f docker-compose.prod.yml --env-file .env.prod logs --tail 100 saas_backend
docker compose -f docker-compose.prod.yml --env-file .env.prod logs --tail 100 core_backend
```

Manual smoke:
1. Log in as SaaS admin.
2. Create a `saas_member`.
3. Confirm Core bootstrap succeeds.
4. Log in as the created member.
5. Open net worth, budget, monthly close, and accounting movements.
6. Confirm no billing UI is exposed.

Expected outcome:
1. Public URL serves the SaaS frontend.
2. SaaS API and Core API paths route correctly.
3. Admin onboarding works.
4. Core-backed product views are reachable.
5. Runbook gives clear rollback and restore paths.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - final runbook.
- [ ] `docs/roadmap/saas-pilot-integration-checklist.md` - update readiness checklist.
- [ ] `docs/project-status.md` - update deployment/support/smoke status.

## Risks
1. Smoke can pass locally but fail externally if Cloudflare/Tunnel DNS is wrong; validate from outside the LAN.
2. Restic backups of volumes are useful only if restore is practiced; document a restore drill as a follow-up.
3. Admin-only onboarding requires credential handling discipline; rotate seed password after first deploy.

## Completion Criteria
- [ ] Runbook covers deploy, rollback, logs, diagnostics, and restore.
- [ ] Cloudflare CNAME/tunnel path is documented.
- [ ] Production smoke passes from outside the LAN.
- [ ] Pilot checklist updated.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
