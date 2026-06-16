# Frontend Visual Contract

## Objective
Turn the visual guide into a small operational contract for reusable frontend work across `core` and `saas`.

## Rules
1. Shared patterns and design tokens are defined in `core/frontend/src/styles/app.css`.
2. `core/frontend/src/styles/app.css` is the canonical source; SaaS synchronization is explicit and should only happen when the scope includes SaaS.
3. Direction A SaaS experimentation can live in `frontend/src/styles/design-system.css` as long as it remains namespaced under `.dir-a`.
4. New page-level layout patterns must use shared classes before introducing local CSS.
5. Inline `style=` is not allowed in Vue templates.
6. New `<style scoped>` blocks require explicit justification; default to shared styles.
7. Loading, empty, error, and success states must use the shared state pattern when possible.

## Design Tokens
1. Semantic color tokens:
   - `--color-canvas`, `--color-canvas-subtle`
   - `--color-surface`, `--color-surface-muted`, `--color-surface-strong`
   - `--color-border`, `--color-border-strong`
   - `--color-text`, `--color-text-muted`, `--color-text-soft`
   - `--color-accent`, `--color-accent-muted`, `--color-accent-alt`
   - `--color-positive`, `--color-negative`, `--color-info`, `--color-warning`
2. Layout and shape tokens:
   - `--container-max`
   - `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`
   - `--radius-sm`, `--radius-md`, `--radius-lg`
   - `--shadow-surface`, `--shadow-surface-soft`
3. Compatibility aliases:
   - `--bg`, `--panel`, `--border`, `--text`, `--muted`
   - These remain available for existing CSS, but new shared styles should prefer semantic tokens.

## Required Shared Patterns
1. Page shell:
   - `ui-page-shell`
   - `ui-page-head`
   - `ui-page-eyebrow`
   - `ui-page-title`
   - `ui-page-lead`
   - `ui-page-actions`
2. Section shell:
   - `ui-section-card`
   - `ui-section-card-padded`
   - `ui-section-head`
   - `ui-section-copy`
   - `ui-section-title`
   - `ui-section-subtitle`
   - `ui-section-actions`
3. Surface variants:
   - `ui-surface-muted`
   - `ui-surface-strong`
4. Action rows:
   - `ui-action-bar`
5. State blocks:
   - `ui-state-block`
   - `ui-state-empty`
   - `ui-state-error`
   - `ui-state-success`
   - `ui-state-loading`
6. Controls:
   - `btn`
   - `btn-primary`
   - `btn-ghost`
   - `btn-sm`
   - `icon-btn`
   - `input`
   - `textarea`
7. Modal shell:
   - `ui-modal-backdrop`
   - `ui-modal-panel`
   - `ui-modal-head`
   - `ui-modal-title`
   - `ui-modal-close`
   - `ui-modal-body`

## Usage Guidance
1. Use `ui-page-shell` for top-level views instead of composing ad hoc page spacing.
2. Use `ui-section-card` for grouped content that should read like the same product family; add `ui-section-card-padded` when the section does not provide its own internal spacing.
3. Use `ui-action-bar` for filter rows, secondary actions, and header controls.
4. Use `ui-state-block` variants for non-happy-path states instead of one-off alert cards.
5. If a view needs a special visual treatment, layer it on top of the contract rather than replacing the base shell.
6. Treat `card` and `ui-pro-*` as compatibility classes while views migrate to `ui-page-*`, `ui-section-*`, and token-driven controls.
7. Use the `ui-modal-*` shell for shared modal chrome; domain-specific modal classes should only style the modal content or adjust panel width.

## Change Policy
1. Add a new shared pattern only if at least two screens would benefit from it.
2. Update this document when shared visual behavior changes.
3. Keep the contract small; it is a guardrail, not a full design system specification.
4. Direction A phase 0 introduces these shell-level reusable classes: `.topbar`, `.topnav-brand`, `.topnav-list`, `.topnav-item`, `.topnav-right`, and `.avatar`.
