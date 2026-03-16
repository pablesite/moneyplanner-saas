---
name: frontend-system
description: Workflow for implementing or refining frontend UI in this repo with visual coherence across core and saas. Use when changing layouts, views, components, CSS, interaction flows, or UX behavior in frontend code.
---

# Frontend System

Use this skill when working on `core/frontend/` or `frontend/`.

## Goal

Keep the UI coherent across screens and across `core` and `saas`.

## Required Read Order

1. `AGENTS.md`
2. `docs/frontend/frontend-visual-guide.md`
3. `docs/frontend/frontend-visual-contract.md`
4. `docs/frontend/frontend-ux-iteration-playbook.md`
5. `docs/frontend/frontend-css-workflow.md`

## Source Of Truth

1. Base visual patterns live in `core/frontend/src/styles/app.css`.
2. Reusable behavior and base styles should be implemented in `core/frontend/` first.
3. Equivalent SaaS changes must be replicated in `frontend/` unless the task is explicitly Core-only.

## Workflow

1. Inspect the current shell, shared styles, and the affected view before proposing changes.
2. Define the UX problem in terms of:
   - page structure,
   - interaction model,
   - visual hierarchy,
   - loading/empty/error/success states.
3. Prefer changing shared primitives and shared classes over adding per-view styling.
4. Reuse the visual contract classes before creating new variants.
5. Avoid local CSS when a shared class or token can solve the issue.
6. If a new pattern is genuinely reusable, add it to `core/frontend/src/styles/app.css` and document it in `docs/frontend/frontend-visual-contract.md`.

## Rules

1. Do not introduce inline `style=` in Vue templates.
2. Do not add new `<style scoped>` blocks unless there is a clear component-isolation reason and the change cannot live in shared styles.
3. Prefer tokens and shared classes over hardcoded spacing, widths, and radii.
4. Keep one clear primary action per screen context where possible.
5. Cover loading, empty, error, and success states when touching a user flow.

## Review Checklist

1. Does the page use the shared page shell and section patterns when applicable?
2. Is the layout rhythm consistent with surrounding screens?
3. Are typography and spacing driven by shared classes or tokens?
4. Is the same behavior mirrored in `frontend/` when the change belongs to shared UI?
5. Are Docker validations run for the affected frontend stack?
