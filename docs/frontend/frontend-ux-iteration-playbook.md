# Frontend UX Iteration Playbook

## Objective
Define a generic collaboration method to build and evolve the frontend interface with Codex from zero context.

## Scope
Use this playbook for UI/UX work in `frontend/` (SaaS) and reuse the same approach for `core/` when patterns become stable.

## Collaboration Model (Codex + Product Owner)
1. Product owner defines intent:
   - What UX problem is being solved.
   - Which screen or flow is in scope.
   - What level of user should benefit first (basic/intermediate/advanced).
2. Codex proposes options:
   - 2-3 structural alternatives.
   - Tradeoffs for each option.
   - Recommended direction.
3. Product owner selects direction.
4. Codex implements a real in-app mockup (not static-only design).
5. Product owner gives focused feedback.
6. Repeat in short cycles until the behavior and visual hierarchy are clear.

## Zero-Context Start Checklist
1. Read `AGENTS.md`.
2. Read `docs/frontend/frontend-visual-guide.md`.
3. Inspect current app shell and routing:
   - `frontend/src/App.vue`
   - `frontend/src/router.ts`
4. Confirm current milestone and UX goal in:
   - `docs/roadmap/roadmap.md`

## Iteration Framework
Work in micro-rounds, each round with one clear outcome:
1. Round A: information architecture.
   - Sections, labels, and navigation order.
2. Round B: interaction model.
   - Open/close behavior, keyboard, focus, responsive behavior.
3. Round C: visual hierarchy.
   - Typography scale, spacing rhythm, active/hover/disabled states.
4. Round D: production hardening.
   - Accessibility, copy clarity, edge states (loading/empty/error/success).

## Design Principles (Generic)
1. Prioritize clarity of navigation over visual density.
2. Keep one primary user action per screen context.
3. Make progression visible, but avoid locking users without context.
4. Keep global layout patterns consistent and local decisions screen-specific.
5. Optimize first for comprehension, then for polish.

## Implementation Checklist
1. Apply structural changes in shell/routes first.
2. Keep screen responsibilities explicit (no duplicated control logic).
3. Ensure desktop and mobile behavior are both intentional.
4. Use small, reviewable commits per iteration.

## Validation (Docker Only)
Run from repo root:
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

## Delivery Checklist
1. Update related docs under `docs/frontend/` and `docs/roadmap/roadmap.md` when scope or direction changes.
2. Bump root `VERSION` by SemVer impact:
   - `PATCH`: UX/docs/internal adjustments without new public feature.
   - `MINOR`: new UX feature or new user-visible module capability.
   - `MAJOR`: breaking UX/API contract.
3. Create a Conventional Commit after validation.
