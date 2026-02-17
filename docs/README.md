# Documentacion Del Proyecto

## Objetivo
Centralizar la documentacion en una estructura simple, evitando duplicacion y facilitando encontrar la fuente canonica de cada tema.

## Estructura
1. `docs/architecture/`: limites de plataforma, arquitectura funcional y contratos.
2. `docs/operations/`: setup, runbook, recovery y checklist de rollout.
3. `docs/roadmap/`: roadmap global e historico por hitos/releases.
4. `docs/frontend/`: guia visual y flujo CSS/Tailwind.
5. `docs/standards/`: calidad de codigo, glosario y plantilla de tareas.

## Documentos Canonicos Por Tema
1. Limites `core` vs `saas`: `docs/architecture/architecture.md`
2. Arquitectura funcional: `docs/architecture/product-architecture.md`
3. Contratos API: `docs/architecture/api-contracts.md`
4. Arranque, diagnostico y troubleshooting: `docs/operations/runbook.md`
5. Setup local y comandos de calidad: `docs/operations/dev-setup.md`
6. Roadmap de producto: `docs/roadmap/roadmap.md`
7. Roadmap de release actual: `docs/roadmap/roadmap-hito-04-refactor.md`
8. Convenciones de calidad: `docs/standards/code-quality-conventions.md`

## Criterio De Mantenimiento
1. Si una regla operativa afecta ejecucion diaria, actualizar `docs/operations/runbook.md`.
2. Si una regla afecta setup o calidad, actualizar `docs/operations/dev-setup.md`.
3. Si una regla afecta limites/contratos `core`-`saas`, actualizar `docs/architecture/`.
4. Si una decision cambia planificacion, actualizar `docs/roadmap/`.
