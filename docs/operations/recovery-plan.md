# Recovery Plan (Mixed/Legacy Data)

## Objective
Recover consistency safely when mixed or legacy data states appear.

## Risk Scenarios
1. Ownership links pointing to missing targets.
2. Ownership links pointing to missing ownership records.
3. Invalid shared ownership splits.
4. Contract drift between `core` and `saas`.

## Detection
1. Run service checks and critical tests.
2. Run SQL audits for orphan/duplicate links.

## Recovery Protocol
1. Freeze write operations.
2. Take full backup and snapshot versions.
3. Repair in order:
   - remove invalid links,
   - resolve ambiguous links,
   - normalize shared splits.
4. Re-run migrations and validations.
5. Re-enable writes.

## Rollback
If recovery fails:
1. Restore DB backup.
2. Restore previous app and submodule commits.
3. Re-run `migrate`, `check`, and critical tests.

## Post-Recovery Validation
1. Create/edit net-worth entities.
2. Verify ownership persistence rules.
3. Verify no orphan links remain.

## Quality Recovery Note
If quality checks fail due to generated artifacts, clear temporary coverage/test files and rerun Docker checks.
