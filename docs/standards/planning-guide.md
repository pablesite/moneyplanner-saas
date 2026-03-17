# Planning Guide

Instructions for planning a module or feature area. Follow this guide whenever the user asks to plan work on a module.

## When to use this guide
When the user says "quiero planificar el módulo X" or equivalent. This guide applies to both Core and SaaS modules.

## Step 1 — Read before speaking
Before presenting anything to the user, read:
1. `core/docs/project-status.md` or `docs/project-status.md` — current task status for the relevant stack
2. The relevant section in `core/docs/roadmap/product-roadmap.md` (Core) or `docs/roadmap/` (SaaS)
3. Any architecture doc directly related to the module (e.g. `core/docs/architecture/accounting-movements-architecture.md`)
4. Existing task specs in `core/docs/tasks/<module>/` if present

## Step 2 — Present your interpretation
Summarize to the user:
- What the roadmap says is pending for this module
- What is already implemented (from project-status.md)
- How you propose to break it into phases and tasks
- Any ambiguities or gaps you found in the documentation

Wait for the user's input before generating anything.

## Step 3 — Incorporate user input
The user will correct, add detail, or reframe scope. Adjust your proposed breakdown accordingly. Ask targeted follow-up questions if needed. Do not proceed to Step 4 until the breakdown is agreed.

## Step 4 — Generate task specs
Create the task spec files using the template at `docs/standards/task-template.md`.

### File location
```
core/docs/tasks/<module>/phase-N-<short-name>/
  backend.md      (if the phase touches backend)
  frontend.md     (if the phase touches frontend)
  qa.md           (only if validation is complex enough to warrant its own spec)
```

For SaaS modules:
```
docs/tasks/<module>/phase-N-<short-name>/
```

### Naming conventions
- `<module>`: lowercase, hyphenated. E.g. `budget`, `net-worth`, `importer`
- `phase-N`: sequential starting at `phase-1`
- `<short-name>`: 2-4 words describing the phase goal. E.g. `phase-1-data-migration`

### When to split backend / frontend / qa
| Situation | Files to create |
|-----------|----------------|
| Phase only touches backend | `backend.md` only |
| Phase only touches frontend | `frontend.md` only |
| Phase touches both significantly | `backend.md` + `frontend.md` |
| Validation is complex or cross-cutting | add `qa.md` |

Do not create empty or near-empty specs. If a file would be fewer than 5 meaningful lines, merge it into the other spec for that phase.

## Step 5 — Update project-status.md
After generating the specs, add the new tasks to the "Siguiente tarea disponible" table in the relevant `project-status.md`:
- Type: `Agente`
- Description: one line per phase
- Spec: relative path to the spec file(s)

## Output
At the end of the planning session the following must exist:
- Task spec files under `core/docs/tasks/<module>/` (or `docs/tasks/<module>/` for SaaS)
- Updated `project-status.md` with the new tasks listed
- No code changes — planning produces documentation only

Generating these files directly is the natural close of the session. No additional confirmation is needed after the user approves the plan in plan mode.
