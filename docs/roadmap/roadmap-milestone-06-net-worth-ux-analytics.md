# Roadmap Milestone 06: Net-Worth UX and Analytics

## Status
Completed.

## Objective
Improve the net-worth module experience, navigation clarity, and in-app balance analysis to deliver a more guided and actionable product UX.

## Scope Delivered
1. New global app shell in SaaS frontend with default-collapsed sidebar.
2. New `Inicio` view with guided phase progression (coach-style framing).
3. Phase context moved to `Inicio` while keeping module navigation stable.
4. Navigation shell refined: menu now works as an overlay drawer and account context is shown in header.
5. Header account block upgraded (avatar + role/plan) and drawer interaction improved (ESC close + body scroll lock).
6. Drawer visual hierarchy polished (brand block, section heading, iconized nav items, stronger active state).
7. Drawer readability fixed on mobile: stronger backdrop dimming and near-opaque sidebar surface to avoid background bleed-through.
8. Settings reorganized into a single-page accordion with collapsible sections for family members, IPC data, and conversion rates.
9. Settings layout simplified by removing the extra title header block and the redundant back button.
10. Settings context restored with a plain page title (`Settings`) without reintroducing the boxed header layout.
11. Settings family section now includes `Miembros` and `Titularidades` tabs; direct `Personas` shortcut was removed from Patrimonio.
12. Patrimonio header cleaned up by removing direct shortcuts to `Cuenta SaaS` and `Datos auxiliares`.
13. Patrimonio top area simplified by removing the boxed panel wrapper while preserving title and action buttons.
14. Patrimonio header now uses a plain inline layout (like Settings), removing residual `ui-page-header` panel styling.
15. Settings popover restyled with navigation-aligned turquoise accents (border, gradient surface, focus states, labels).
16. Settings access moved from sidebar to the user account menu (top-right), exposing `Perfil` and `Settings` entries.
17. Inicio redesigned: phase roadmap is now horizontal with 5 phases and per-phase 0-100 donut progress; quick navigation buttons were removed and next action moved below.
18. Account UX streamlined: removed back button from Perfil and moved logout action to account dropdown (`Perfil`, `Settings`, `Cerrar sesion`).
19. Perfil simplified by hiding legacy `Vinculo opcional con core` controls from the SaaS account view.
20. Perfil visual redesign: plain page title (without boxed header), renamed from `Cuenta SaaS` to `Perfil`, and identity data reorganized into cleaner readable cards.
21. Perfil received an alternative visual pass with cleaner row-based identity layout and improved emphasis on plan status.
22. Titularidades view simplified by hiding individual ownership rows and focusing only on shared ownerships.
23. Header brand/title now routes directly to `Inicio` (`/inicio`) to provide a consistent quick return to the financial guide.
24. Net-worth score model introduced and documented with weighted multi-signal penalties and 5-level risk coloring.
25. Net-worth composition UX improved by consolidating analysis in the donut area and reducing duplicated KPIs.

## Outcome
Milestone 06 delivered the planned UX and analytics uplift for the net-worth experience and left the product ready for Milestone 07 (first production demo release).
