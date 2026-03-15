# Code Quality Conventions

## Objective
Define quality standards enforced locally and in CI for both stacks.

## Baseline Rules
1. Keep functions focused and avoid hidden side effects.
2. Keep comments meaningful and contextual.
3. Favor explicit types and domain models over `any`.
4. Reduce duplication between `core` and `saas` with clear boundaries.

## Backend
1. Lint and format with `ruff`.
2. Type-check with `mypy`.
3. Keep business rules in service layer.
4. Keep HTTP error shape consistent.

## Frontend
1. Lint with `eslint`.
2. Format with `prettier`.
3. Type-check with `vue-tsc`.
4. Keep domain-driven structure under `src/domains/*`.

## Required Checks
Run checks in Docker for the affected stack(s) before merge.

## CI References
1. SaaS: `.github/workflows/quality-saas.yml`
2. Core: use the Core repo's own CI configuration if present; otherwise rely on the Docker validation matrix documented in `core/RELEASING.md` and `core/docs/operations/dev-setup.md`
