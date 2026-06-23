# Frontend CSS Workflow

## Objective

Keep CSS changes predictable and coherent inside the SaaS frontend.

## Canonical Source

1. The active SaaS frontend source of truth lives in `frontend/src`.
2. `core/frontend/src` may still be consulted as historical or product reference, but it is not a synchronization source for SaaS work.

## Rules

1. Implement reusable style changes directly in `frontend/src/styles/app.css` when they belong to SaaS.
2. Use existing shared classes before adding view-local CSS.
3. Consult Core styles only when a Core-backed flow needs visual continuity, never as an automatic sync step.

## Responsive Rules

1. Default to `@container page (...)` for view content; reserve `@media (...)` for the global shell (`app.css`). See the Responsive System section in `frontend/frontend-visual-guide.md`.
2. Use the canonical breakpoints `lg 1180 / md 820 / sm 560 / xs 400`. Do not add new intermediate cutoffs without a documented reason.
3. Minimum supported width is `360px`. No primary content may overflow horizontally below it.
4. When editing a file with stray breakpoint values, consolidate them toward the nearest canonical token instead of adding more.

## Validation

Run the frontend checks for the affected SaaS worktree. Validate Core separately only when the task explicitly touches Core.
