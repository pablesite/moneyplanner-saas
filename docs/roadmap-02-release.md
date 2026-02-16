# Roadmap 02 Release (Refactor Core/SaaS)

## Objetivo
Realizar un refactor completo de `core` y `saas`, incluyendo la creacion de un nuevo repo publico para `core`, elevando calidad tecnica, mantenibilidad y consistencia visual.

## Principios De La Release
- Codigo simple, legible y con responsabilidad clara.
- Comentarios utiles solo donde aporten contexto no obvio.
- Cobertura de tests alta en rutas criticas.
- Reglas de calidad automatizadas (linters + type checks + CI).
- UI consistente y profesional con una base CSS solida.

## Alcance
- Reestructuracion de repositorios (`core` nuevo limpio + `saas` privado).
- Refactor backend (dominio, servicios, serializacion, contratos API).
- Refactor frontend (arquitectura de stores/vistas/componentes + sistema de estilos).
- Endurecimiento de CI/CD y estandares de codigo.

## Fases

### Fase 0: Fundacion De Repos
Estado: pendiente.

- [ ] Crear nuevo repo `core` limpio (sin historial legacy de ownership).
- [ ] Migrar codigo base actual de `core` al repo nuevo.
- [ ] Configurar versionado y politica de releases para `core`.
- [ ] Reapuntar submodulo en `saas` al nuevo repo `core`.
- [ ] Definir estrategia de deprecacion del repo `core` anterior (privado/archivo).

### Fase 1: Refactor Arquitectonico Backend
Estado: completada.

- [x] Revisar y simplificar capas: `views -> serializers -> services`.
  - Avance: `core/backend/accounts` delega persistencia de `UserSettings` a `services.py`.
  - Avance: `core/backend/net_worth` mueve calculo de snapshot/summary a `services.py`.
  - Avance: `core/backend/net_worth` mueve validaciones de `Asset/Liability` de serializers a servicios.
  - Avance: `core/backend/net_worth` mueve `create` de serializers (`Asset/Liability/Snapshot`) a servicios.
  - Avance: `core/backend/net_worth` mueve serializacion de respuesta de `summary` a servicios.
  - Avance: `core/backend/net_worth` mueve conversion de `amount_base` de serializers a servicios.
  - Avance: `backend/memberships` mueve alta/baja de `FamilyMember` a servicios transaccionales.
  - Avance: `backend/memberships` mueve update/delete de `Ownership` a servicios.
  - Avance: `backend/memberships` delega validacion de escritura/sync de `Ownership` desde serializers a servicios.
  - Avance: `backend/memberships` delega create/update de `Ownership` desde serializer a servicios.
  - Avance: `backend/memberships` mueve orquestacion de `OwnershipLink` (`list/sync`) de views a servicios.
  - Avance: `backend/memberships` mueve validacion de `percent` de `OwnershipSplitInputSerializer` a servicios.
  - Avance: `core/backend/net_worth` mueve el queryset dinamico de `financed_asset_id` desde serializer a service+view context.
  - Avance: `core/backend/net_worth` mueve validacion de `NetWorthSnapshotSerializer` a servicios.
  - Avance: `core/backend/net_worth` extrae el helper de error API fuera de la vista (`api.py`).
- [x] Estandarizar manejo de errores y codigos HTTP.
- [x] Consolidar validaciones de negocio en servicios.
  - Avance: aplicado en dominio `memberships` (SaaS).
  - Avance: `core/backend/core` mueve validaciones de FX e inflation de serializers a services.
- [x] Revisar contratos API y documentar cambios.
  - Avance: contrato consolidado en `docs/api-contracts.md`.
- [x] Reducir duplicacion entre `core` y `saas` manteniendo fronteras claras.
  - Avance: inventario inicial completado; la duplicacion backend activa mas clara esta en el manejo uniforme de errores (`custom_exception_handler`) entre `core/backend/config` y `backend/saas`.
  - Avance: fuente canonica definida (`core/backend/config/exceptions.py`) y estrategia de sincronizacion aplicada sin acoplar importaciones cruzadas entre repos.
  - Avance: fronteras y reglas de sincronizacion documentadas en `docs/core-saas-boundaries.md`.

### Fase 2: Refactor Frontend + UI Profesional
Estado: en progreso.

- [x] Reorganizar stores/componentes por dominio funcional.
  - Avance: logica de ownership de net worth extraida a `frontend/src/lib/netWorthOwnership.ts`; `frontend/src/stores/netWorth.ts` reduce responsabilidad de transformacion.
  - Avance: calculo de `byCategoryChart` extraido a `frontend/src/lib/netWorthCharts.ts` y `core/frontend/src/lib/netWorthCharts.ts`; stores delegan la transformacion.
  - Avance: estructura de dominio `net-worth` creada en `frontend/src/domains/net-worth/*` y `core/frontend/src/domains/net-worth/*` con `stores/netWorth.ts` y `lib/netWorth*.ts` mantenidos como reexports de compatibilidad.
  - Avance: estructura de dominio `auth` creada en `frontend/src/domains/auth/*` y `core/frontend/src/domains/auth/*` con `lib/authApi.ts` y `lib/authSession.ts` como reexports de compatibilidad.
  - Avance: estructura de dominio `aux-data` creada en `frontend/src/domains/aux-data/api.ts` y `core/frontend/src/domains/aux-data/api.ts` con `lib/auxDataApi.ts` como reexport de compatibilidad.
  - Avance: componentes de `net-worth` movidos a `frontend/src/domains/net-worth/components/*` y `core/frontend/src/domains/net-worth/components/*`, con imports de vistas actualizados.
  - Avance: dominio `people` en SaaS consolidado en `frontend/src/domains/people/*` (store + componentes), manteniendo `frontend/src/stores/people.ts` como reexport de compatibilidad.
- [ ] Simplificar flujos de estado y side effects.
  - Avance: guard de autenticacion en `frontend/src/router.ts` alineado al patron robusto de `core` (validacion real de token con `coreApi` y memoizacion de chequeo).
  - Avance: `frontend/src/views/AuxDataView.vue` delega llamadas HTTP en `frontend/src/lib/auxDataApi.ts` para reducir side effects en la vista.
  - Avance: `frontend/src/views/AuxDataView.vue` extrae side effects de carga/alta/baja y formateo a `frontend/src/domains/aux-data/composables.ts`.
  - Avance: gestion de tokens centralizada en `frontend/src/lib/authSession.ts`, reutilizada por `frontend/src/lib/api.ts` y `frontend/src/router.ts`.
  - Avance: mismo patron de sesion aplicado en `core/frontend/src/lib/authSession.ts`, `core/frontend/src/lib/api.ts` y `core/frontend/src/router.ts`.
  - Avance: `core/frontend/src/views/AuxDataView.vue` delega llamadas HTTP en `core/frontend/src/lib/auxDataApi.ts`.
  - Avance: `core/frontend/src/views/AuxDataView.vue` extrae side effects de carga/alta/baja y formateo a `core/frontend/src/domains/aux-data/composables.ts`.
  - Avance: manejo de errores HTTP unificado en `frontend/src/lib/errors.ts` y `core/frontend/src/lib/errors.ts`, aplicado en `LoginView`, `AuxDataView` y `stores/netWorth`.
  - Avance: login delega autenticacion en adapters `frontend/src/lib/authApi.ts` y `core/frontend/src/lib/authApi.ts`, usando `authSession` para persistencia de tokens.
  - Avance: dominio `people` extrae side effects de red a `frontend/src/domains/people/api.ts` y normalizacion de errores a `frontend/src/domains/people/errors.ts`; `frontend/src/domains/people/store.ts` queda como orquestador de estado.
  - Avance: side effects UI de `people` extraidos a `frontend/src/domains/people/composables.ts`; `FamilyMemberManager.vue` y `OwnershipManager.vue` quedan mas declarativos.
- [ ] Definir arquitectura sin duplicacion entre core y saas:
  - [ ] extraer paquete compartido `frontend-core` (componentes, stores, tipos y composables base).
  - Avance: por requisito de independencia total de `core`, se establece sincronizacion unidireccional `core -> saas` (sin paquete compartido runtime) para frontend base.
  - Avance: manifest y script de sincronizacion definidos en `scripts/frontend-sync-manifest.txt` y `scripts/sync_frontend_from_core.ps1`.
  - [ ] mantener apps separadas `core-web` y `saas-web` consumiendo el mismo paquete base.
  - [ ] implementar puntos de extension premium (slots/hooks/capability flags) en lugar de copiar vistas.
  - [ ] separar adapters de API (`coreApi` base, `saasApi` premium) con contratos claros.
  - Avance: `frontend/src/lib/netWorthApi.ts` separa adapters de `core` y `premium` para net worth; `frontend/src/stores/netWorth.ts` queda como orquestador de estado.
  - Avance: `core/frontend/src/lib/netWorthApi.ts` extrae adapter base para net worth y `core/frontend/src/stores/netWorth.ts` delega llamadas HTTP.
  - Avance: contratos tipados explicitos en adapters de `net-worth` (`frontend/src/domains/net-worth/api.ts` y `core/frontend/src/domains/net-worth/api.ts`) y modelos compartidos de dominio (`models.ts`) para reducir casts y ambiguedad en `store.ts`.
- [ ] Introducir sistema de estilos profesional:
  - [ ] opcion recomendada: `Tailwind CSS` + tokens CSS propios (color, spacing, typography).
  - [ ] alternativa: `UnoCSS` o `Bootstrap` si prefieres menor personalizacion.
- [ ] Definir guia visual minima (tipografia, grid, espaciados, estados de error/loading).
  - Avance: guia minima inicial en `docs/frontend-visual-guide.md` y tokens base de spacing/radius/focus/error aplicados en `core/frontend/src/styles/app.css` y `frontend/src/styles/app.css`.
- [ ] Homogeneizar componentes base (botones, formularios, tablas, modales).
  - Avance: componentes `net-worth` (`ItemForm.vue` y `ItemList.vue` en `frontend` y `core/frontend`) reducen `any` en props/payloads y se alinean a modelos tipados de dominio.
  - Avance: `NetWorthView.vue` en `frontend` y `core/frontend` reduce `any` en flujo de edicion (`editItem`/handlers) y tipa el acceso a campos extendidos de `summary`.
  - Avance: `LoginView.vue` en `frontend` y `core/frontend` elimina `catch (e: any)` y se normalizan textos mojibake visibles en dominio `people` (SaaS).

### Fase 3: Calidad De Codigo (Linters + Reglas)
Estado: en progreso.

- [x] Backend:
  - [x] `ruff` (lint + formato)
  - [x] `mypy` (tipado gradual)
- [x] Frontend:
  - [x] `eslint` (TS + Vue)
  - [x] `prettier` (formato)
  - [x] `vue-tsc` en CI
- [x] Convenciones de comentarios y complejidad ciclomatica maxima por funcion.
- [x] Hooks pre-commit (lint/format rapido).

### Fase 4: Estrategia De Testing Potente
Estado: pendiente.

- [ ] Backend:
  - [ ] tests unitarios por servicio.
  - [ ] tests API por endpoint critico.
  - [ ] tests de integracion API dual (`core` + `saas`) ampliados.
  - Avance: existe suite API en `backend/memberships/tests.py` y comando `python manage.py test memberships`.
- [ ] Frontend:
  - [ ] tests unitarios de componentes y stores.
  - [ ] tests de integracion de vistas principales.
  - [ ] tests E2E de flujos clave (login, patrimonio, ownership).
- [ ] Objetivo minimo de cobertura:
  - [ ] backend >= 85% lineas.
  - [ ] frontend >= 75% lineas.
  - [ ] 100% cobertura en modulos criticos (`memberships/services`, sincronizacion ownership-links).

### Fase 5: Documentacion Y Release
Estado: pendiente.

- [ ] Actualizar `docs/architecture.md` con arquitectura refactorizada.
- [ ] Actualizar checklists de rollout y recovery.
- [ ] Publicar `release-summary-v2.md` con cambios y breaking changes.
- [ ] Ejecutar smoke test final y criterios de salida.

## Definition Of Done (Release V2)
- [ ] Nuevo `core` publico operativo como producto base y con repo limpio.
- [ ] `saas` privado consume el nuevo `core` sin debt legacy.
- [ ] Linters y type checks bloquean merges en CI.
- [ ] Cobertura minima de tests cumplida y reportada.
- [ ] UI consistente con sistema CSS profesional documentado.
- [ ] Evolucion de frontend `core` y `saas` sin duplicacion estructural de codigo.
- [ ] Codigo simplificado y comentado donde aporte contexto real.

## Riesgos Y Mitigacion
- Riesgo: ruptura por cambio de repo/submodulo `core`.
  - Mitigacion: rollout por ramas + checklist de compatibilidad + rollback documentado.
- Riesgo: refactor masivo con regresiones funcionales.
  - Mitigacion: tests por fases y congelacion de features durante refactor.
- Riesgo: inconsistencia visual en migracion CSS.
  - Mitigacion: migracion por componentes base y revisiones de UI por hitos.

## Orden Recomendado De Ejecucion
1. Fase 0 (repos)
2. Fase 3 (calidad automatizada base)
3. Fase 1 (backend)
4. Fase 2 (frontend/UI)
5. Fase 4 (testing profundo)
6. Fase 5 (documentacion + release)

