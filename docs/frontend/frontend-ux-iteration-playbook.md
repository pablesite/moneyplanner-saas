# Frontend UX Iteration Playbook

## Objective
Provide a repeatable way to start frontend UX work from zero context and iterate quickly on a real mockup.

## Scope
Use this workflow when refining global layout, navigation, and UX behavior in `frontend/` (SaaS), then propagate reusable patterns to `core/` when applicable.

## Working Model (From Zero Context)
1. Rebuild context first:
   - Read `AGENTS.md`.
   - Read `docs/frontend/frontend-visual-guide.md`.
   - Inspect current shell and routes:
     - `frontend/src/App.vue`
     - `frontend/src/router.ts`
2. Define UX decisions before code:
   - Navigation model (drawer/sidebar/topbar).
   - Header content policy (what lives in header vs inside screens).
   - Progression policy (guided vs locked by phase).
3. Ship one real mockup slice:
   - Implement directly in app shell/views (not isolated static mockups).
   - Prioritize one vertical slice (example: global shell + Inicio).
4. Iterate in short rounds:
   - Round A: structure and information hierarchy.
   - Round B: interaction behavior (open/close, keyboard, focus, mobile).
   - Round C: visual polish (spacing, active states, copy).

## UX Rules Used in Milestone 06
1. Keep account identity visible in header.
2. Keep logout inside account screen, not global header.
3. Use overlay drawer behavior for navigation:
   - Closed means hidden (no mini-collapsed leftover).
   - Close on route change, backdrop click, and `Esc`.
4. Keep progression context in `Inicio`, not in every header.

## Implementation Checklist
1. Shell:
   - Update `frontend/src/App.vue`.
   - Confirm mobile/desktop behavior.
2. Routing:
   - Add/update routes in `frontend/src/router.ts`.
3. Screen ownership:
   - Keep account actions in `frontend/src/views/AccountView.vue`.
4. Visual hierarchy:
   - Ensure primary nav labels + secondary hints are readable.
   - Ensure active/hover states are unambiguous.

## Validation (Docker Only)
Run from repo root:
```bash
docker compose exec saas_frontend npm run lint
docker compose exec saas_frontend npm run format:check
docker compose exec saas_frontend npm run typecheck
```

## Delivery Checklist
1. Update related docs under `docs/frontend/` and `docs/roadmap/roadmap.md` when milestone progress changes.
2. Bump root `VERSION` by SemVer impact:
   - `PATCH`: UX/docs/internal adjustments without new public feature.
   - `MINOR`: new UX feature or new user-visible module capability.
   - `MAJOR`: breaking UX/API contract.
3. Create a Conventional Commit after validation.

