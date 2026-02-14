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
Estado: en progreso.

- [ ] Revisar y simplificar capas: `views -> serializers -> services`.
  - Avance: `core/backend/accounts` delega persistencia de `UserSettings` a `services.py`.
  - Avance: `core/backend/net_worth` mueve calculo de snapshot/summary a `services.py`.
  - Avance: `backend/memberships` mueve alta/baja de `FamilyMember` a servicios transaccionales.
  - Avance: `backend/memberships` mueve update/delete de `Ownership` a servicios.
- [x] Estandarizar manejo de errores y codigos HTTP.
- [ ] Consolidar validaciones de negocio en servicios.
  - Avance: aplicado en dominio `memberships` (SaaS).
- [ ] Revisar contratos API y documentar cambios.
- [ ] Reducir duplicacion entre `core` y `saas` manteniendo fronteras claras.

### Fase 2: Refactor Frontend + UI Profesional
Estado: pendiente.

- [ ] Reorganizar stores/componentes por dominio funcional.
- [ ] Simplificar flujos de estado y side effects.
- [ ] Definir arquitectura sin duplicacion entre core y saas:
  - [ ] extraer paquete compartido `frontend-core` (componentes, stores, tipos y composables base).
  - [ ] mantener apps separadas `core-web` y `saas-web` consumiendo el mismo paquete base.
  - [ ] implementar puntos de extension premium (slots/hooks/capability flags) en lugar de copiar vistas.
  - [ ] separar adapters de API (`coreApi` base, `saasApi` premium) con contratos claros.
- [ ] Introducir sistema de estilos profesional:
  - [ ] opcion recomendada: `Tailwind CSS` + tokens CSS propios (color, spacing, typography).
  - [ ] alternativa: `UnoCSS` o `Bootstrap` si prefieres menor personalizacion.
- [ ] Definir guia visual minima (tipografia, grid, espaciados, estados de error/loading).
- [ ] Homogeneizar componentes base (botones, formularios, tablas, modales).

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
