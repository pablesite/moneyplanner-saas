# SaaS Pilot Integration Checklist

## Objective
Track the minimum integration and operational readiness needed to run the SaaS pilot on top of MoneyPlanner Core.

## Current Baseline
1. Core remains the source of truth for product functionality.
2. SaaS provides managed access, account flows, admin support, and platform operation.
3. SaaS backend integrates with Core for Core-owned bootstrap and domain access flows.
4. Trial is the default state for pilot testers.
5. Billing is not exposed during the pilot stage.

## Pilot Readiness Checklist
1. SaaS signup and login work in the real deployment [ ]
2. Internal admin onboarding flow works reliably [ ]
3. SaaS-to-Core linking works in the real deployment [ ]
4. Core bootstrap flows complete successfully from SaaS [ ]
5. Core-backed user views are reachable from the SaaS experience [ ]
6. No billing UI is exposed to end users [ ]
7. A minimal support runbook exists for pilot incidents [ ]
8. End-to-end smoke validation has been completed in the deployed environment [ ]

## Minimum Smoke Coverage
1. SaaS signup and login
2. Admin-created account onboarding
3. Core bootstrap flow
4. Access to Core-backed product areas through SaaS
5. Basic support and recovery flow for pilot users

## Related Documents
1. `../architecture/architecture.md`
3. `../architecture/core-saas-boundaries.md`
4. `../operations/dev-setup.md`
5. `../../core/docs/README.md`
