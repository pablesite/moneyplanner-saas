# Fase 6 - Aplicacion de transferencias desde el cierre

## Title

Permitir aceptar, aplicar y conciliar recomendaciones sin abandonar el contexto del cierre.

## Context

Core materializa recomendaciones de forma idempotente en la fase 6 backend. La UI debe hacer visible
la diferencia entre recomendar, crear el asiento y confirmar la transferencia bancaria, sin ocultar
errores ni convertir el cierre en una pantalla de banca.

## Area

`frontend`

## Stack

`saas`

## Scope

### In scope

1. Clientes/tipos de accept, apply, partial apply, reconcile y cancel.
2. Accion primaria unica sobre el conjunto cuando todas las rutas son aplicables; acciones por fila
   para excepciones o ejecucion parcial.
3. Confirmacion contextual con cuentas, ownership, importe y fecha antes de crear movimientos.
4. Estados visuales recommended, accepted, applied, partially applied y cancelled.
5. Mostrar enlace al movimiento creado y remanente exacto.
6. Manejar retries de red sin duplicar, confiando en idempotencia backend y refrescando el servidor.
7. Reopen/lock messaging acorde a la politica backend.
8. Feedback `AState`/`AToast`, proteccion de acciones concurrentes y accesibilidad.
9. Tests de API, componente y flujo integrado.

### Out of scope

1. Iniciar la transferencia bancaria externa.
2. Editar el asiento avanzado dentro de Cierre; enlazar a Movimientos.
3. Hacer matching automatico sin confirmacion cuando Core devuelve varias candidatas.
4. Rediseñar la configuracion de fase 4.

## Plan

1. Extender el estado de dominio y clientes sin calculos monetarios en frontend.
2. Diseñar confirmacion como sheet/modal contextual reutilizando primitivas existentes.
3. Implementar apply global y parcial con refresh autoritativo.
4. Enlazar movimientos y presentar remanentes/errores por ruta.
5. Validar retries, bloqueo y movil junto a `qa.md`.

## Validation

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test:unit
```

## Required Documentation Updates

- [x] `docs/frontend/domain-map.md` - acciones de materializacion y enlaces.
- [x] `docs/architecture/api-registry.md` - endpoints consumidos.
- [x] `docs/project-status.md` - version 2 completada.

## Risks

- Doble click o retry puede parecer aplicado dos veces. Deshabilitar localmente, pero tratar la
  respuesta backend como unica fuente de verdad.
- `Aplicada` no equivale necesariamente a confirmada por el banco. Usar copy preciso.
- Muchas acciones por fila degradan la jerarquia. Mantener una accion principal y revelar excepciones.

## Completion Criteria

- [x] Retrying an apply action never renders duplicate movements.
- [x] Partial execution and exact remainder are understandable on desktop and mobile.
- [x] Created transactions are reachable in Movimientos.
- [x] Locked/reopened states match backend policy.
- [x] All validation commands pass.
- [x] All required documentation updates done.
- [x] Spec moved to `terminados/`.
- [x] Commit created (Conventional Commits).
