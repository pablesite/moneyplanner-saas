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

## Validation

Run the frontend checks for the affected SaaS worktree. Validate Core separately only when the task explicitly touches Core.
