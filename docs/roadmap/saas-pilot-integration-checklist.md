# SaaS Pilot Integration Checklist

## Objective
Track the minimum integration and operational readiness needed to run the SaaS pilot on top of MoneyPlanner Core.

## Current Baseline
1. Core remains the source of truth for product functionality.
2. SaaS provides managed access, account flows, admin support, and platform operation.
3. SaaS backend integrates with Core for Core-owned bootstrap and domain access flows.
4. Trial is the default state for pilot testers.
5. Billing is not exposed during the pilot stage.
6. Production target is `https://moneyplanner.codinglab.es`.
7. Network path is Cloudflare Tunnel -> Traefik -> Docker services attached to external `proxy`.
8. Initial production access is private: public registration is intentionally disabled and users are created by SaaS admins.
9. Disabled public registration is an expected behavior in the pilot: `/api/auth/register/` should return a controlled `registration_disabled` error instead of onboarding a user.

## Pilot Readiness Checklist
1. SaaS admin-created onboarding and login work in the real deployment [ ]
2. Internal admin onboarding flow works reliably [ ]
3. SaaS-to-Core linking works in the real deployment [ ]
4. Core bootstrap flows complete successfully from SaaS [ ]
5. Core-backed user views are reachable from the SaaS experience [ ]
6. No billing UI is exposed to end users [ ]
7. A minimal support runbook exists for pilot incidents [ ]
8. End-to-end smoke validation has been completed in the deployed environment [ ]
9. Cloudflare CNAME `moneyplanner.codinglab.es` points to the tunnel [ ]
10. Traefik routes SaaS and Core API paths correctly [ ]

## Minimum Smoke Coverage
1. SaaS admin-created account and login
2. Admin-created account onboarding
3. Core bootstrap flow
4. Access to Core-backed product areas through SaaS
5. Basic support and recovery flow for pilot users

## Execution Plan
1. Phase 1: production images (`docs/tasks/production-deployment/phase-1-prod-images/`)
2. Phase 2: unified compose and Traefik routing (`docs/tasks/production-deployment/phase-2-prod-compose-traefik/qa.md`)
3. Phase 3: security hardening and private access (`docs/tasks/production-deployment/phase-3-security-private-access/backend.md`)
4. Phase 4: GitHub CI/CD (`docs/tasks/production-deployment/phase-4-github-ci-cd/qa.md`)
5. Phase 5: runbook and production smoke (`docs/tasks/production-deployment/phase-5-production-runbook-smoke/qa.md`)

## Related Documents
1. `../architecture/architecture.md`
3. `../architecture/core-saas-boundaries.md`
4. `../operations/dev-setup.md`
5. `../../core/docs/README.md`
6. `../operations/production-deploy.md`
