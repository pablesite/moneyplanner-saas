# SaaS production deployment - Phase 4: GitHub CI/CD

## Context
The SaaS repo already has quality, security, image build, GHCR push, and release-please pieces. Production needs those workflows aligned with the new production Dockerfiles and an SSH deploy step to the home server.

## Area
`qa`

## Stack
`saas`

## Scope
1. In scope: update GitHub Actions to build production images.
2. In scope: scan images before publishing or deploying.
3. In scope: add deploy by SSH to the server.
4. In scope: document required GitHub secrets and server files.
5. Out of scope: changing release-please strategy, migrating to Kubernetes, or storing production app secrets in GitHub.

## Plan
1. Diagnosis
   - Review `.github/workflows/quality.yml`, `.github/workflows/ci-main.yml`, CodeQL, Dependabot, and GHCR image names.
   - Confirm which jobs currently use development Dockerfiles.
2. Change implementation
   - Update build matrix to use `backend/Dockerfile.prod` and `frontend/Dockerfile.prod`.
   - Keep PR quality checks and security scans.
   - On `main`, build and push SHA-tagged and `latest` images to GHCR.
   - Add deploy job using `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, and `DEPLOY_PATH`.
   - Remote deploy command: `docker compose -f docker-compose.prod.yml --env-file .env.prod pull && docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --remove-orphans`.
   - Add post-deploy smoke checks against `https://moneyplanner.codinglab.es`.
3. Validation
   - Validate workflow syntax through PR.
   - Run the workflow on a branch or manual dispatch before relying on automatic deploy.

## Validation
```bash
git diff --check
docker build -f backend/Dockerfile.prod -t moneyplanner-saas-backend:ci-test backend
docker build -f frontend/Dockerfile.prod -t moneyplanner-saas-frontend:ci-test frontend
```

Expected outcome:
1. GitHub Actions builds production images, not dev images.
2. Trivy uploads SARIF and blocks critical/high findings according to policy.
3. Deploy updates the server via SSH without exposing production secrets in the repo.
4. Smoke checks pass after deploy.

## Required Documentation Updates
- [ ] `docs/operations/production-deploy.md` - document CI/CD flow, GitHub secrets, and rollback.
- [ ] `docs/project-status.md` - update phase status when closed.

## Risks
1. SSH deploy can fail after images are published; rollback instructions must use previous SHA tags.
2. `latest` can hide which version is deployed; log SHA tags during deploy.
3. Security scans can block release because of base image CVEs; document triage policy.

## Completion Criteria
- [ ] Workflows build production images.
- [ ] GHCR publish works.
- [ ] SSH deploy works against the server.
- [ ] Post-deploy smoke check runs.
- [ ] Required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created with Conventional Commit.
