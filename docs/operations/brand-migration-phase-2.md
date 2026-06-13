# Brand Migration Phase 2

## Objective

Complete the technical rename after phase 1 branding, without breaking CI, deploy, Docker state, GitHub links, or the Core submodule workflow.

## Phase 1 already completed

1. Visible brand updated to `The Arkenstone`.
2. Primary public domain documented as `https://arkenstone.app`.
3. App titles, visible headers, and user-facing export/backup filenames aligned with the new brand.
4. Canonical product docs updated to reflect the new public brand.

## What still remains technical

These identifiers were intentionally left unchanged in phase 1 because they are coupled to live tooling, registries, or persisted infrastructure:

1. GitHub repository names and URLs:
   - `moneyplanner-saas`
   - `moneyplanner-core`
2. GHCR image names:
   - `ghcr.io/pablesite/moneyplanner-saas-backend`
   - `ghcr.io/pablesite/moneyplanner-saas-frontend`
   - `ghcr.io/pablesite/moneyplanner-core-backend`
   - `ghcr.io/pablesite/moneyplanner-core-frontend`
3. Git submodule remote in `.gitmodules`
4. Docker Compose project/network/volume names such as:
   - `moneyplanner-dev`
   - `moneyplanner-internal`
   - `moneyplanner-core_core_postgres_data`
   - `moneyplanner-saas_saas_postgres_data`
5. Production filesystem paths under `/datos/docker/.../moneyplanner`
6. Environment variable names and JWT issuer/audience defaults such as:
   - `MONEYPLANNER_DOMAIN`
   - `moneyplanner-saas`
   - `moneyplanner-saas-api`
   - `moneyplanner-core`
   - `moneyplanner-core-api`
7. CI/CD workflow references, smoke URLs, and deploy scripts
8. Archived task specs and historical changelog/release references
9. Backend tests that still assert legacy technical hostnames or issuer strings
10. Internal identifiers such as user-agent strings or legacy backup names in backend-only flows

## Recommended execution order

1. Create the new external assets first:
   - GitHub repos if they will be renamed
   - GHCR package targets if names will change
   - DNS and Cloudflare/Tunnel config for `arkenstone.app`
2. Update production secrets and environment variables on the server.
3. Rename CI/CD workflow targets and deployment scripts.
4. Update Docker Compose technical identifiers only with a migration plan for persistent volumes and networks.
5. Rename JWT issuer/audience defaults only after all producers and consumers are updated together.
6. Update tests and archived operational specs after the runtime path is stable.

## Risk notes

1. Renaming Compose volume names without a migration plan can make the app appear to have lost its databases.
2. Renaming GHCR images before publishing replacements will break production pulls.
3. Renaming JWT issuer/audience on only one side will break SaaS-to-Core auth.
4. Renaming the submodule remote without confirming the new Core repository location will break Core update flow.

## Completion criteria for phase 2

1. Production deploy and local integrated startup work end-to-end with the new technical identifiers.
2. `arkenstone.app` is the real production origin in DNS, deploy docs, smoke checks, and live config.
3. CI/CD publishes and deploys from the renamed registry targets.
4. No active runtime, test, or deploy path depends on `moneyplanner*` identifiers except archived history.
