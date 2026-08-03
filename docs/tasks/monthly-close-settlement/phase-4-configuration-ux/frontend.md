# Fase 4 - Configuracion y readiness de liquidacion

## Title

Permitir activar y configurar la liquidacion familiar sin añadir friccion al cierre normal.

## Context

Core expone en las fases 1-2 reparto dinamico, perfil opt-in, cuentas, destinos, baseline y readiness.
La configuracion afecta ownership, presupuesto, cuentas y monederos, pero no debe convertirse en un
wizard obligatorio ni degradar la vista para usuarios individuales o de bolsa comun.

## Area

`frontend`

## Stack

`saas`

## UX contract

1. Con settlement desactivado, `/cierre-mensual` conserva exactamente sus cuatro pasos y acciones.
2. Si hay varios miembros, el paso Resultado puede mostrar una accion secundaria discreta
   `Configurar liquidacion`; no se abre automaticamente ni bloquea el cierre.
3. La configuracion usa un sheet contextual read-first, siguiendo Movimientos: estado actual,
   explicacion, campos progresivos, resumen y confirmacion.
4. El ownership dinamico muestra antes de guardar la ventana analizada, ingresos por miembro,
   exclusiones y porcentaje resultante. No presenta solo un 61/39 sin evidencia.
5. Los ownership `explicit_split` muestran su reparto pactado y no ofrecen fuentes de ingreso.
6. El split de monederos pregunta efectivo fisico real por monedero y presenta la compensacion de
   apertura resultante antes de confirmar.
7. La configuracion incompleta termina en una checklist accionable, no en errores genericos.

## Scope

### In scope

1. Tipos y clientes Core para allocation preview, settlement profile, account routes, baseline y
   readiness.
2. Extender la gestion de ownership para elegir `Reparto pactado` o `Proporcional a ingresos`, con
   preview de doce meses y seleccion explicita de fuentes recurrentes.
3. Sheet de activacion desde Cierre mensual con:
   - cuenta operativa;
   - cuenta personal destino por miembro;
   - cuentas 50/50 u otros destinos compartidos;
   - fecha de activacion;
   - conciliacion inicial de monederos.
4. Extender formularios de Presupuesto con ownership y cuenta objetivo bajo revelacion progresiva;
   ocultar esos campos cuando settlement no esta activo salvo que el ownership ya exista.
5. Mostrar validacion de compatibilidad ownership/cuenta antes de enviar.
6. Preservar lineas gestionadas por Mi Plan como read-only.
7. Estados loading, empty, error, success y dirty-close protection.
8. Tests de composable, API y componentes en desktop/mobile.

### Out of scope

1. Mostrar recomendaciones del cierre, fase 5.
2. Crear transferencias, fase 6.
3. Rediseñar `/people`, Presupuesto o Cierre fuera de los controles necesarios.
4. Replicar la interfaz en `core/frontend/`.
5. Añadir capability o gating por plan.

## Plan

1. Ampliar tipos/clientes y mantener la logica de red fuera de componentes.
2. Diseñar el sheet sobre primitivas `AButton`, `ASelect`, `AState`, `ASectHead` y patrones de sheet
   consolidados; no crear una pagina o card dashboard nueva.
3. Implementar preview dinamico y readiness antes de permitir activacion.
4. Incorporar ownership/destino a los formularios presupuestarios existentes.
5. Implementar conciliacion de monederos con resumen irreversible explicito.
6. Validar 360, 560, 820 y escritorio, teclado, focus y cierre sucio.

## Validation

```bash
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test -- --run
```

Manual:

1. Usuario individual no ve configuracion intrusiva y completa el cierre actual.
2. Usuario multi-member puede cancelar el sheet sin cambios.
3. Ownership dinamico explica los doce meses y las exclusiones.
4. Ownership 50/50 conserva 50/50.
5. Cuenta incompatible muestra como corregirla.
6. Monedero mixto muestra efectivo y compensacion antes de confirmar.
7. Layout usable a 360 px sin overflow horizontal.

## Required Documentation Updates

- [ ] `docs/frontend/domain-map.md` - configuracion settlement en budget/people.
- [ ] `docs/frontend/frontend-visual-contract.md` - solo si nace un patron reutilizable real.
- [ ] `docs/architecture/api-registry.md` - clientes Core consumidos.
- [ ] `docs/project-status.md` - cerrar fase y habilitar Resultado.

## Risks

- Exponer todos los campos a la vez convierte el cierre en configuracion contable. Usar revelacion
  progresiva y una sola decision por bloque.
- Cambiar ownership desde Presupuesto puede alterar Patrimonio. Mostrar alcance y exigir confirmacion.
- La conciliacion de monederos puede leerse como borrado. Explicar que el historico permanece intacto
  y que solo cambia el baseline desde la fecha de activacion.

## Completion Criteria

- [ ] Disabled users see no new mandatory flow.
- [ ] Dynamic preview exposes source period, totals, exclusions and effective percentages.
- [ ] Configuration cannot activate while readiness has blocking issues.
- [ ] Budget ownership/destination fields preserve form state on backend errors.
- [ ] Wallet split requires explicit confirmation and is not silently repeated.
- [ ] Desktop and 360 px mobile reviews pass.
- [ ] All validation commands pass.
- [ ] All required documentation updates done.
- [ ] Spec moved to `terminados/`.
- [ ] Commit created (Conventional Commits).
