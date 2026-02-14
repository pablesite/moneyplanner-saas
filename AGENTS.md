# AGENTS.md

## Objetivo
Este repositorio contiene dos stacks que se trabajan en paralelo:
1. `core/` (base OSS)
2. `saas` (raíz: `backend/` + `frontend/`, con funcionalidades extra)

## Arranque estándar
Para levantar el proyecto entero, seguir este orden:
1. `cd core && docker compose up --build -d`
2. `cd .. && docker compose up --build -d`

## Diagnóstico estándar
Comandos base de diagnóstico:
1. `docker compose ps`
2. `docker compose logs --tail 100 <servicio>`

Comandos adicionales permitidos si ayudan a encontrar causa raíz:
1. `docker compose ps -a`
2. `docker compose logs --tail 200 <servicio>`
3. verificaciones HTTP puntuales (por ejemplo, preflight CORS con `curl`)

## Restricciones operativas
1. No borrar volúmenes de base de datos.
2. No ejecutar comandos destructivos tipo `docker compose down -v` salvo pedido explícito.
3. Se puede modificar `core/` y `saas` (se evolucionan ambos en paralelo).

## Flujo de trabajo acordado
1. Diagnóstico primero.
2. Explicar qué se pretende hacer, preguntar para decidir la mejor opción.
3. Acordada la opción: aplicar cambios.
4. Validar resultado y reportar estado final.
5. Al terminar, actualizar la documentación en `docs/` donde sea necesario.
6. Tras validar y actualizar documentación, terminar con un commit.

## Validación (estado actual)
Actualmente no hay cobertura ni lint estandarizados en ambos repos.
Objetivo futuro:
1. tests en `core` y `saas` (backend y frontend)
2. lint en `core` y `saas` (backend y frontend)

Cuando existan comandos oficiales, agregarlos aquí y ejecutarlos en cada cambio relevante.

## Documentación recomendada
1. Arquitectura de plataforma: `docs/architecture.md`
2. Arquitectura funcional del producto: `docs/product-architecture.md`
3. Operación y troubleshooting: `docs/runbook.md`
4. Configuración de desarrollo: `docs/dev-setup.md`
5. Plantilla de tareas para sesiones nuevas: `docs/task-template.md`
6. Glosario de términos canónicos: `docs/glossary.md`



