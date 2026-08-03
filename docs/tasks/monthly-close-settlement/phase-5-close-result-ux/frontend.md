# Fase 5 - Resultado de liquidacion en el cierre

## Title

Explicar reservas, compensaciones y transferencias dentro del paso Resultado de Cierre mensual.

## Context

La fase 3 de Core devuelve un preview completo, pero no crea movimientos. Esta fase cierra la version
1 utilizable en SaaS: el usuario comprende el calculo, ejecuta transferencias en el banco y las
registra manualmente en Movimientos.

## Area

`frontend`

## Stack

`saas`

## UX contract

La vista mantiene la composicion consolidada:

```text
APageHead
-> controles compactos Mes / Titularidad
-> AStepper de 4 pasos
-> MonthlyCloseHero
-> contenido del paso activo
-> Resultado: conciliacion actual
-> Distribucion del saldo: disponible -> destinos -> transferencias
```

No se añade un quinto paso, una pagina paralela ni una rejilla de tarjetas independientes. La
liquidacion se lee como continuacion del resultado financiero.

## Scope

### In scope

1. Tipos y cliente para `ownership_settlement` aditivo del cierre.
2. Componente de dominio `MonthlyCloseSettlementSection` con un objeto `page` o contrato compacto,
   evitando ampliar de forma incontrolada las props del Result actual.
3. Resumen principal: saldo distribuible, total retenido/asignado y total hacia cuentas personales.
4. Filas por destino con ownership efectivo, motivo, saldo actual, saldo objetivo y movimiento.
5. Desglose por miembro: apertura, ingresos, gastos, compensaciones, requisitos y excedente.
6. Evidencia del porcentaje dinamico: ventana, ingresos ponderables y reparto congelable.
7. Compensaciones expandibles enlazadas conceptualmente al movimiento origen.
8. Estados `disabled`, `not_ready`, `ready` y `finalized`, con acciones adecuadas.
9. CTA por recomendacion para abrir Movimientos con transferencia pre-rellenada sin guardarla
   automaticamente; conservar contexto de vuelta al cierre.
10. Integrar finalize/reopen/lock sin perder el snapshot mostrado.
11. Responsive intencional: desktop en filas alineadas; movil como registros etiquetados sin scroll.
12. Tests de componentes, contrato de payload y regresion de los cuatro pasos actuales.

### Out of scope

1. Crear la transferencia automaticamente.
2. Marcar como aplicada sin movimiento ledger correspondiente.
3. Rediseñar el bridge, hero o secciones de ingreso/gasto fuera del encaje necesario.
4. Mostrar settlement cuando el perfil esta desactivado, salvo la accion discreta de configuracion.
5. Implementar `core/frontend/`.

## Plan

1. Extender el composable fino `useMonthlyCloseView` y mantener calculos de dominio fuera del template.
2. Construir primero jerarquia de informacion y estados; despues estilos.
3. Componer primitivas Direction A y patrones de filas de Patrimonio/Movimientos.
4. Añadir deep-link seguro a alta de transferencia en Movimientos.
5. Integrar lifecycle y feedback con `AState`/`AToast`.
6. Ejecutar QA automatizado y el gate visual de `qa.md`.

## Validation

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test -- --run
```

## Required Documentation Updates

- [ ] `docs/frontend/domain-map.md` - resultado settlement y deep-link a Movimientos.
- [ ] `docs/frontend/frontend-visual-contract.md` - patron solo si se reutiliza fuera del cierre.
- [ ] `docs/project-status.md` - version 1 disponible.
- [ ] `core/docs/project-status.md` - referencia al frontend SaaS consumidor.

## Risks

- Sobrecargar Resultado puede ocultar la accion principal. Mostrar primero tres cifras y rutas; dejar
  formula, miembros y evidencia bajo expansion progresiva.
- Un CTA que guarda al abrir Movimientos puede duplicar transferencias. Solo pre-rellenar.
- El filtro de titularidad existente puede competir con el settlement familiar completo. La seccion
  muestra el hogar completo y permite destacar un miembro, pero nunca recalcula el solver en cliente.

## Completion Criteria

- [ ] The existing four-step flow and lifecycle remain intact.
- [ ] Ready settlement explains every retained and transferred euro.
- [ ] Not-ready state lists concrete corrective actions without blocking normal close.
- [ ] Dynamic and explicit ownerships are visually distinguishable and evidenced.
- [ ] Movement deep-link pre-fills but never auto-saves.
- [ ] Desktop and 360 px mobile gates pass.
- [ ] All validation commands pass.
- [ ] All required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created (Conventional Commits).
