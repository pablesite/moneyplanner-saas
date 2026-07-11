# Financial Plan — Fase 9: Errores reales + revelación progresiva y diseño móvil (SaaS frontend)

## Title
Arreglar el manejo de errores del dominio plan y rediseñar Mi Plan para que el usuario reciba primero el titular y luego, bajo demanda, la explicación — con un móvil usable.

## Context

Tercera pasada de UX sobre Mi Plan, a partir de la auditoría en navegador con datos reales: `docs/tasks/financial-plan/browser-audit-2026-07-11.md` (hallazgos **A-6** y **A-9 a A-14**).

Objetivo de producto declarado por el usuario: *«que el usuario no tenga información de más de golpe, pero a la vez encuentre explicabilidad a lo que ve»*. Hoy `/plan` entrega el diagnóstico completo en una sola pantalla (hero con 4 métricas, 2 recomendaciones con 3 acciones cada una, progreso, fechas, gráfico con 6 series, calidad de datos, 5 indicadores de cimientos y acontecimientos), y el móvil hereda esa densidad sin adaptarla.

**Orden importante:** esta fase debe ir **después de la fase 7**. Presentar con más claridad un diagnóstico incorrecto empeora el producto.

## Area
`frontend`

## Stack
`saas`

> Usar la skill `frontend-system` antes de empezar. Referencias: `docs/frontend/frontend-visual-guide.md`, `docs/frontend/frontend-ux-iteration-playbook.md`.

## Scope

### In scope

**Bug — contrato de errores (A-6). Va primero, es corrección, no diseño.**

1. `frontend/src/domains/plan/store.ts:27-32` lee `error.response.data.detail`, pero el backend responde con el contrato canónico `{error: {code, message, details}}`. Resultado: **cualquier** fallo (400 de validación, 500, red) pinta el banner «No se pudo cargar Mi Plan.» en lo alto de la página, lejos de su causa y sin errores por campo. Adaptar el parser al contrato real y, si existe ya un helper compartido de errores en el frontend, usarlo en lugar de duplicarlo.
2. Errores de formulario junto al campo (`details` por campo), no en un banner global.
3. `submit()` en `frontend/src/views/PlanScenariosView.vue:133-136` no captura el error que el store relanza → promesa sin manejar. Capturar y mostrar.
4. Test que cubra: un 400 con `details` por campo produce mensajes por campo y **no** el banner «No se pudo cargar Mi Plan.».

**Revelación progresiva en `/plan` (A-9).**

5. Primera pantalla = **titular + una acción + trayectoria**. Todo lo demás (cimientos, calidad de datos, acontecimientos, acción secundaria) pasa a un nivel de detalle bajo demanda («Ver el diagnóstico completo» / secciones colapsables). El criterio: si el usuario no puede actuar sobre un dato ahora mismo, no compite por la primera pantalla.
6. El titular es la **fecha proyectada** y su distancia al objetivo («2064 · 29 años después de tu objetivo»), no una métrica más entre cuatro del mismo peso.
7. Cada métrica lleva su explicación en contexto, no en un tooltip aparte: «Renta sostenible 79,46 €» necesita su referencia («el 2 % de tu objetivo de 4.000 €/mes») para no leerse como un dato roto.
8. Fusionar la tarjeta «Calidad de datos» con el indicador homónimo de Cimientos (hoy están duplicados y la tarjeta de desktop es un bloque casi vacío).

**Escenarios (A-10, A-11, A-14).**

9. `/plan/escenarios`: los **escenarios guardados van primero**; el formulario «Simular una decisión» se abre bajo demanda desde un CTA. Cada escenario de la lista muestra fecha, plantilla, resumen de impacto y un chip de estado con color; toda la fila es navegable.
10. Formulario: campos de importe con unidad (€) y ayuda breve; eliminar las columnas vacías del layout desktop; reescribir el copy «Al incorporar, solo se actualiza el presupuesto futuro» en términos de lo que le pasa al usuario.
11. Detalle de escenario **incorporado** (`/plan/escenarios/:id`): hoy es casi una página en blanco. Debe mostrar el rastro real del escenario — enlace al acontecimiento, las partidas de presupuesto que generó con su año fiscal (consume `GET /api/plan/events/{id}/budget-lines/`, fase 8) y, cuando exista, la acción de cierre (fase 6).
12. **A-14**: el placeholder de interés sugiere `7` mientras Supuestos declara «Coste de deuda por defecto 4,5 %» (que es lo que aplica el backend si se deja vacío). Alinear los dos números.

**Móvil (A-12, A-13).**

13. `/plan/activos`: grupos colapsados por defecto (al menos «Uso familiar», 32 ítems) y buscador *sticky*. Hoy la página mide ~16.000 px.
14. Trayectoria en móvil: gráfico legible (leyenda compacta o series reducidas; hoy la leyenda ocupa casi tanto como el gráfico).
15. Subnavegación del plan (Objetivo / Hipótesis / Supuestos / Clasificar activos): hoy se apila como texto plano sin jerarquía ni aspecto de control. Convertirla en un control real del sistema de diseño.

### Out of scope
- Cualquier cambio de cálculo (fase 7).
- La protección de partidas en `/presupuesto` (fase 8).
- La acción de cierre de acontecimientos (fase 6): esta fase solo deja el hueco donde encajará.

## Plan
1. **Diagnosis** — Leer el informe de auditoría y las capturas; revisar `frontend/src/domains/plan/` (`store.ts`, `components/`) y las vistas `PlanView.vue`, `PlanScenariosView.vue`, `PlanScenarioDetailView.vue`, `PlanAssetsView.vue`.
2. **Change implementation** — Primero el bug de errores (con su test), luego la reorganización de `/plan`, luego escenarios, luego móvil.
3. **Validation** — Comandos abajo + navegación real en desktop **y** móvil.

## Validation

```
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run lint
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run format:check
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run typecheck
docker compose -f docker-compose.dev.yml --env-file .env.dev exec saas_frontend npm run test
```

Validación en navegador real con datos de `pablesite`, en 1440×900 **y** 390×844 (receta en la memoria de proyecto `playwright-browser-validation`): `/plan`, `/plan/escenarios`, `/plan/escenarios/:id`, `/plan/activos`. Comprobar que ningún error de API se muestra ya como «No se pudo cargar Mi Plan.» cuando no lo es, y que la consola queda limpia de promesas sin manejar.

## Required Documentation Updates
- [x] `docs/frontend/domain-map.md` — si cambia la estructura de vistas/componentes del dominio `plan`
- [x] `docs/frontend/frontend-visual-guide.md` — patrones nuevos que se consoliden (revelación progresiva, chips de estado)
- [x] `docs/project-status.md` — estado de la fase
- [x] `docs/tasks/financial-plan/browser-audit-2026-07-11.md` — marcar A-6 y A-9..A-14 como resueltos

## Risks
- Esconder información puede quitarle a un usuario avanzado datos que ya usaba: colapsar no es borrar; el detalle debe estar siempre a un clic y ser enlazable.
- Reordenar `/plan` toca componentes compartidos: apoyarse en los tests existentes del dominio `plan` (17) y ampliarlos.
- Ejecutar esta fase antes de la 7 daría una interfaz más clara sobre un diagnóstico falso: **no adelantarla**.

## Completion Criteria
- [x] All validation commands pass
- [x] Validación en navegador real (desktop + móvil) ejecutada
- [x] All required documentation updates done
- [x] Spec moved to `terminados/`
- [x] Commit created (Conventional Commits)

## Completion note (2026-07-11)

- `/plan` baja de una pantalla inicial de diagnóstico completo a titular, acción principal y trayectoria; el resto permanece a un clic.
- El parser compartido extrae el contrato `{error:{code,message,details}}`, incluidos campos anidados de `events`, y el submit de escenarios captura el rechazo.
- El detalle incorporado enlaza el `PlanEvent` y lista sus líneas reales; el hueco para cerrar el acontecimiento queda explícito para la Fase 6.
- En móvil, «Uso familiar» nace colapsado, el buscador sigue sticky, la leyenda elimina series redundantes y la subnavegación usa un control compacto de dos columnas.
