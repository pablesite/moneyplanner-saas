# Frontend CSS Workflow

## Objective
Keep CSS changes predictable and synchronized between `core` and `saas`.

## Canonical Source
1. Base frontend styles live in `core/frontend/src`.
2. SaaS extends behavior/UI through domain extension points.

## Rules
1. Implement base reusable style changes in `core` first.
2. Sync canonical frontend files to SaaS with the sync script.
3. Avoid duplicated scoped styles when shared classes already exist.

## Sync Commands
1. Check drift:
   - `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1`
2. Apply sync:
   - `powershell -ExecutionPolicy Bypass -File scripts/sync_frontend_from_core.ps1 -Apply`

## Validation
After sync, run frontend checks in both stacks.
