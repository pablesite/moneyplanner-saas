# Frontend Visual Guide

## Objective
Define how to build a frontend that feels coherent, elegant, modern, and easy to use across `core` and `saas`.

## What Good Looks Like
1. The interface should feel calm, clear, and financially credible.
2. UX quality matters more than decorative visuals.
3. Visual polish should support comprehension, not compete with it.
4. Every screen should feel like part of the same product family.

## Visual Direction
1. Prefer elegant minimalism over dense or flashy layouts.
2. Keep information density controlled: rich enough to be useful, never crowded.
3. Use strong hierarchy through spacing, typography, and grouping before adding extra color or ornament.
4. Aim for a modern look: clean surfaces, restrained accents, subtle contrast, and deliberate layout rhythm.
5. Avoid UI that feels generic, noisy, or inconsistent between views.

## Design Principles
1. Consistency over local one-off styles.
2. Shared tokens first, component-level style second.
3. Navigation clarity over visual cleverness.
4. One primary action per screen context whenever possible.
5. Clear states for loading, empty, error, and success.
6. Desktop and mobile behavior must both be intentional, never incidental.

## UX Priorities
1. The user should quickly understand where they are, what they are seeing, and what to do next.
2. Important flows should reduce friction instead of demanding too much precision up front.
3. Complex financial views should stay understandable by exposing detail progressively.
4. Interactions should happen in the most relevant visual context instead of forcing unnecessary page changes.
5. Empty states, errors, and partial-data states must guide the user, not just report status.

## Working With an Agent
1. Start by defining the UX problem, not the final component structure.
2. Describe the user goal, the screen in scope, and what should feel easier after the change.
3. Ask the agent first for structure and interaction proposals before polishing details.
4. Validate one thing at a time:
   - information architecture,
   - interaction model,
   - visual hierarchy,
   - responsive behavior,
   - edge states.
5. Prefer iterative changes in the real app over isolated mockups disconnected from production code.
6. When in doubt, ask the agent to simplify the flow rather than add more UI.

## Layout
1. Prefer stable page shells and predictable section order.
2. Use a consistent max width and grid rhythm across major views.
3. Keep sections visually separated, but avoid fragmented dashboards made of too many unrelated cards.
4. Use proximity and spacing to show relationships before introducing borders or heavy backgrounds.

## Typography and Spacing
1. Use shared typography and spacing tokens from app styles.
2. Keep heading hierarchy clear and predictable.
3. Avoid ad-hoc spacing in single components.
4. Use typography to mark importance, not just size differences.
5. Long screens should still feel scannable in a few seconds.

## Components
1. Reuse shared UI primitives where available.
2. Keep visual behavior aligned across `core` and `saas` base components.
3. Prefer simple cards, clean tables, and charts without unnecessary visual noise.
4. Avoid introducing new component variants unless they solve a clear UX problem.
5. Do not duplicate components when composition or extension is enough.

## Styling Rules
1. Do not introduce inline styles unless there is a clear, temporary reason.
2. Favor shared classes, tokens, and reusable patterns.
3. Keep shadows, borders, and accent colors restrained.
4. Avoid saturated colors, thick borders, and decorative effects that reduce trust or readability.

## Interaction and States
1. Loading: visible and non-blocking where possible.
2. Empty: explicit explanation and next action.
3. Error: clear message, no hidden failures.
4. Success: concise positive feedback.
5. Filters and drilldowns should preserve user context whenever possible.
6. Responsive changes should adapt hierarchy, not just stack everything mechanically.

## Review Checklist
1. Is the primary task obvious within a few seconds?
2. Is the visual hierarchy clearer than before?
3. Does the screen match the rest of the product?
4. Is the flow simpler, not just prettier?
5. Are desktop and mobile both intentionally designed?
6. Are loading, empty, error, and success states covered?

## Workflow Reference
1. For iterative UX implementation from zero context, use:
   - `docs/frontend/frontend-ux-iteration-playbook.md`
