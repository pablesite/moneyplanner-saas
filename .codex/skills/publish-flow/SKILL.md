---
name: publish-flow
description: Run this skill before any push to GitHub, before evaluating whether root and core are ready to push, or before preparing a production deployment from this repo. It runs the canonical local gate, decides the correct push order between core and saas, waits for core quality when changes touch code or contracts, and blocks push or deploy recommendations until the flow is green.
---

# Publish Flow

Use this skill whenever the task involves:

1. Pushing `moneyplanner-saas` or `core` changes to GitHub
2. Checking whether current local changes are ready for CI
3. Preparing a production deployment or release from the integrated repo

## Required workflow

1. Check git status in the root repo and in `./core`
2. Confirm the integrated root stack is the validation target unless the user explicitly asks for standalone Core-only validation
3. Run the canonical local gate:

```bash
./scripts/pre-push-check.sh
```

4. If the gate fails:
   - do not recommend `git push`
   - do not recommend deploy
   - explain the failing step and whether it looks like a code issue, env issue, or flaky external dependency
5. If the gate passes:
   - determine whether there are commits to push in `./core`, in root, or both
   - push `core` before root whenever the root repo points to a new submodule commit
6. Waiting policy after pushing `core`:
   - if `core` changes touch backend/frontend code, tests, settings, contracts, or workflows that affect release confidence, wait for `quality-core`
   - if `core` changes are docs-only or similarly low risk, waiting is optional
7. After `core` is safely published, push `moneyplanner-saas`
8. Summarize:
   - local gate result
   - what was pushed
   - whether `core` workflows were awaited
   - any remaining GitHub Actions or production smoke follow-up

## Notes

1. `./scripts/pre-push-check.sh` is the canonical local gate for this repo
2. It assumes the integrated stack from `docker-compose.dev.yml` is already running
3. It intentionally runs backend tests with CI-like auth/linking flags to avoid false failures caused by the integrated `.env.dev` setup
4. A root push that updates the submodule pointer is only safe after the referenced `core` commit exists on GitHub
5. Do not replace this flow with ad hoc partial checks unless the user explicitly asks for a narrower audit
