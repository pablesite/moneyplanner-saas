# Plan De Recuperacion Para Datasets Mixtos/Legacy

## Objetivo
Definir un procedimiento seguro para recuperar consistencia cuando existen datos legacy o mixtos entre `core` y `saas`.

## Escenarios De Riesgo
- Datos de `ownership-links` apuntando a `asset/liability` inexistentes.
- Datos de `ownership-links` apuntando a `ownership` inexistente.
- Titularidades compartidas con `splits` invalidos (suma distinta de 100 o miembros inactivos/no existentes).
- Desfase de submodulo `core` que cambia contrato y deja enlaces huerfanos.

## Deteccion
- Ejecutar chequeos basicos:
  - `docker compose exec saas_backend python manage.py check`
  - `docker compose exec saas_backend python manage.py test memberships`
- Ejecutar consultas SQL de auditoria (en entorno seguro):
  - Links sin ownership valido.
  - Links duplicados por `user + target_type + target_id`.
  - Ownership compartida sin `splits`.

## Protocolo De Saneado
1. Congelar cambios de escritura durante la correccion.
2. Exportar backup previo a cualquier fix:
   - Backup DB completo.
   - Snapshot de versiones (`git rev-parse HEAD` y submodulo `core`).
3. Corregir en este orden:
   - Eliminar links invalidos (target inexistente u ownership inexistente).
   - Reasignar links ambiguos segun regla de negocio.
   - Normalizar ownership compartida para que `splits` sumen 100.
4. Ejecutar migraciones pendientes y revalidar.
5. Rehabilitar escritura.

## Rollback Operativo
- Si el saneado falla:
  - Restaurar backup DB.
  - Volver al commit previo de `saas` y al commit previo del submodulo `core`.
  - Repetir `migrate`, `check` y tests criticos.

## Validacion Post-Recovery
- Smoke test manual:
  - Crear activo/pasivo.
  - Asignar titularidad.
  - Verificar persistencia tras recarga.
  - Verificar bloqueo de borrado de titularidad en uso.
- Confirmar ausencia de enlaces huerfanos con auditoria SQL.

## Recuperacion De Calidad (CI/Local)
- Si fallan checks de formato/lint tras correr tests, limpiar artefactos temporales antes de reintentar:
  - `frontend/test-results/`
  - `frontend/coverage/`
  - `backend/.coverage`
- Reejecutar matriz minima en Docker:
  - Backend: `ruff check`, `ruff format --check`, `mypy`, `manage.py test`
  - Frontend: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run test:unit`
- Si el error persiste, recrear servicio afectado y repetir diagnostico estandar:
  - `docker compose ps`
  - `docker compose logs --tail 200 <servicio>`

## Prevencion
- Mantener este plan junto al checklist de rollout (`docs/operations/release-checklist.md`).
- Ejecutar validaciones de API dual en cada upgrade de submodulo `core`.
- No desplegar cambios de contrato sin migracion y notas de compatibilidad.
