---
name: frontend-system
description: Workflow for implementing or refining frontend UI in this repo with visual coherence across core and saas. Use when changing layouts, views, components, CSS, interaction flows, or UX behavior in frontend code.
---

# Frontend System

Use this skill when working on `core/frontend/` or `frontend/`.

## Goal

Keep the SaaS UI coherent across screens while respecting the current separation between `core` and `saas`.

## Required Read Order

1. `AGENTS.md`
2. `docs/frontend/frontend-visual-guide.md`
3. `docs/frontend/frontend-visual-contract.md`
4. `docs/frontend/frontend-ux-iteration-playbook.md`
5. `docs/frontend/frontend-css-workflow.md`

## Source Of Truth

1. Base visual patterns currently reused by SaaS live in `frontend/src/styles/app.css`.
2. Trabajar directamente en `frontend/` cuando el scope sea SaaS.
3. Consultar `core/frontend/` solo como referencia visual o funcional cuando ayude a entender un flujo que consume APIs de Core.
4. No asumir espejo obligatorio con Core: cualquier adaptación del frontend SaaS se decide por producto SaaS, no por sincronización automática.

## Workflow

1. Antes de tocar cualquier fichero, localizar la vista o componente equivalente dentro de `frontend/` y revisar el shell y las primitivas compartidas del SaaS.
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
4. ¿La solución respeta los patrones compartidos del SaaS sin depender de un espejo manual con Core?
5. Are Docker validations run for the affected frontend stack?
