# Operations Runbook

## Objective
Operate, diagnose, and recover the local `moneyplanner` environment safely.

## Startup Order
1. Start `core`:
```bash
cd core
docker compose up --build -d
```
2. Start `saas`:
```bash
cd ..
docker compose up --build -d
```

## Standard Diagnostics
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Optional deeper checks:
   - `docker compose ps -a`
   - `docker compose logs --tail 200 <service>`

## Expected Local Endpoints
1. Core frontend: `http://localhost:5173`
2. Core backend: `http://localhost:8000`
3. SaaS frontend: `http://localhost:5174`
4. SaaS backend: `http://localhost:8001`

## Common Issues
1. Service exited:
   - inspect `docker compose ps -a`
   - inspect logs with `--tail 200`
2. CORS failure:
   - verify `CORS_ALLOWED_ORIGINS`
   - recreate backend service
3. Frontend not updating:
   - inspect frontend logs
   - hard refresh browser
4. Auth throttling (`429`):
   - inspect backend logs
   - adjust throttle env vars for local
5. Missing SaaS user or role changes:
   - review auth audit file: `backend/logs/auth_audit.log`
   - review DB audit table from Django shell:
     `docker compose exec saas_backend python manage.py shell -c "from memberships.models import SaasAuthAuditEvent as E; print(list(E.objects.values('created_at','event','outcome','actor_user_id','metadata')[:20]))"`

## Safe Operations
1. Allowed by default:
   - `docker compose ps`
   - `docker compose logs --tail N <service>`
2. Avoid by default:
   - `docker compose down -v`
3. Never delete DB volumes unless explicitly authorized.

## References
1. `docs/operations/dev-setup.md`
2. `docs/architecture/architecture.md`
3. `docs/architecture/product-architecture.md`
4. `docs/operations/recovery-plan.md`
