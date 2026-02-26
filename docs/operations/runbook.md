# Runbook local (SaaS + Core)

## Arranque
1. Levantar `core` primero.
2. Levantar SaaS después.

## Comandos de diagnóstico
1. `docker compose ps`
2. `docker compose logs --tail 100 <service>`
3. Profundo: `docker compose ps -a`, `docker compose logs --tail 200 <service>`

## Problemas frecuentes
1. Frontend no refresca -> recarga dura / revisar logs del frontend.
2. Error CORS -> revisar `CORS_ALLOWED_ORIGINS`.
3. Error SaaS al crear usuario/member -> revisar `CORE_API_BASE_URL` y conectividad SaaS -> Core.
4. Auth/admin SaaS -> revisar `backend/logs/auth_audit.log`.

## Operación segura
1. No borrar volúmenes.
2. No usar `docker compose down -v` salvo petición explícita.
3. Tests/calidad siempre dentro de Docker.

## Pilotaje SaaS (trial)
1. Usuarios testers en `trial`.
2. Alta manual desde Admin SaaS si hace falta.
3. `family/ownership` se crea en Core automáticamente durante alta/registro.
