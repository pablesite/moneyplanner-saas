---
name: pre-push-gate
description: Run this skill before any push to GitHub, before evaluating whether a branch is ready to push, or before preparing a production deployment from this repo. It verifies the integrated root stack, executes ./scripts/pre-push-check.sh, summarizes any failures, and blocks push/deploy recommendations until the gate passes.
---

# Pre-push Gate

Use this skill whenever the task involves:

1. Pushing `moneyplanner-saas` or `core` changes to GitHub
2. Checking whether current local changes are ready for CI
3. Preparing a production deployment or release from the integrated repo

## Required workflow

1. Check git status in the root repo and in `./core`
2. Confirm the integrated root stack is the validation target unless the user explicitly asks for standalone Core-only validation
3. Run:

```bash
./scripts/pre-push-check.sh
```

4. If the script fails:
   - do not recommend `git push`
   - do not recommend deploy
   - explain the failing step and whether it looks like a code issue, env issue, or flaky external dependency
5. If the script passes:
   - summarize that the local gate is green
   - report whether root and/or `./core` are ahead of origin
   - only then prepare the push order or production sequence

## Notes

1. `./scripts/pre-push-check.sh` is the canonical gate for this repo
2. It assumes the integrated stack from `docker-compose.dev.yml` is already running
3. It intentionally runs backend tests with CI-like auth/linking flags to avoid false failures caused by the integrated `.env.dev` setup
4. Do not replace this script with ad hoc partial checks unless the user explicitly asks for a narrower audit
