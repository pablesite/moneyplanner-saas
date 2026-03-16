# Frontend Visual Contract

## Objective
Turn the visual guide into a small operational contract for reusable frontend work across `core` and `saas`.

## Rules
1. Shared patterns are defined in `core/frontend/src/styles/app.css` and synchronized to SaaS.
2. New page-level layout patterns must use shared classes before introducing local CSS.
3. Inline `style=` is not allowed in Vue templates.
4. New `<style scoped>` blocks require explicit justification; default to shared styles.
5. Loading, empty, error, and success states must use the shared state pattern when possible.

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

## Usage Guidance
1. Use `ui-page-shell` for top-level views instead of composing ad hoc page spacing.
2. Use `ui-section-card` for grouped content that should read like the same product family.
3. Use `ui-action-bar` for filter rows, secondary actions, and header controls.
4. Use `ui-state-block` variants for non-happy-path states instead of one-off alert cards.
5. If a view needs a special visual treatment, layer it on top of the contract rather than replacing the base shell.

## Change Policy
1. Add a new shared pattern only if at least two screens would benefit from it.
2. Update this document when shared visual behavior changes.
3. Keep the contract small; it is a guardrail, not a full design system specification.
