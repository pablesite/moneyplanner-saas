# Global Product Roadmap

## Objective
Track high-level product milestones from completed work to upcoming priorities.

## Global Status
The project has moved from technical foundation into product growth and production-readiness.

## Milestones
### Milestone 01 (Completed)
Initial repository and first net-worth module release.

### Milestone 02 (Completed)
Split into two lines: `core` (OSS) and `saas` (premium/private).

### Milestone 03 (Completed)
Improved collaboration and operational workflows with Codex and documentation.

### Milestone 04 (Completed)
Refactor + quality hardening + testing strategy execution.

Current validated baseline:
1. Backend coverage: SaaS 93%, Core 86%.
2. Frontend coverage: SaaS 88.29%, Core 84.73%.
3. Critical module coverage target reached (`memberships/services` 100%).
4. Repo foundation completed (public `core`, release policy, submodule wiring).

Reference:
- `docs/roadmap/roadmap-milestone-04-refactor.md`
- `docs/roadmap/release-summary-v2.md`

### Milestone 05 (Completed)
Separated identity strategy for `core` and `saas`.

### Milestone 05B (Completed)
SaaS multi-role authorization (RBAC).

### Milestone 06
Net-worth module UX and analytics improvements.

Current iteration:
1. New global app shell in SaaS frontend with default-collapsed sidebar.
2. New `Inicio` view with guided phase progression (coach-style framing).
3. Phase context moved to `Inicio` while keeping module navigation stable.
4. Navigation shell refined: menu now works as an overlay drawer and account context is shown in header.
5. Header account block upgraded (avatar + role/plan) and drawer interaction improved (ESC close + body scroll lock).
6. Drawer visual hierarchy polished (brand block, section heading, iconized nav items, stronger active state).
7. Drawer readability fixed on mobile: stronger backdrop dimming and near-opaque sidebar surface to avoid background bleed-through.
8. Settings reorganized into a single-page accordion with collapsible sections for family members, IPC data, and conversion rates.
9. Settings layout simplified by removing the extra title header block and the redundant back button.

### Milestone 07
First production demo release.

### Milestone 08
Mobile strategy and implementation.

### Milestone 09
Landing + payment system for SaaS.

### Milestone 10
Remaining functional modules:
1. Budget
2. Accounting
3. Investment portfolio
4. Simulator

### Milestone 11 (Continuous)
Iterative scaling: observability, performance, security, UX.
