# Glosario

## Objetivo
Unificar términos funcionales y técnicos para evitar ambigüedades en código, documentación y conversaciones.

## Términos de plataforma
1. `core`:
Producto OSS base, usable de forma standalone.

2. `saas`:
Capa privada que extiende `core` con capacidades premium.

3. Límite `core`/`saas`:
Regla de separación de responsabilidades definida en `docs/architecture/architecture.md`.

## Términos funcionales
1. Patrimonio:
Módulo de activos, pasivos, resumen y snapshots de patrimonio neto.

2. Contabilidad:
Módulo de cuentas, movimientos y cierres (realidad financiera).

3. Presupuesto:
Módulo de planificación (qué debería pasar) y comparación real vs plan.

4. Cartera de Inversión:
Módulo de posiciones de inversión y su impacto en patrimonio/contabilidad.

5. Simulador:
Módulo de escenarios futuros y análisis "what-if".

## Términos premium de Patrimonio
1. Titularidad (canonical):
Término de negocio recomendado en documentación y conversación.

2. Ownership:
Nombre técnico legado/en código para titularidad.

3. Enlace de titularidad (`OwnershipLink`):
Relación SaaS entre una titularidad premium y una entidad base (`asset`/`liability`) de `core`.

4. Miembro familiar (`FamilyMember`):
Entidad SaaS para representar personas dentro del dominio premium de titularidad.

## Términos de API
1. `coreApi`:
Cliente/API para endpoints base en `core`.

2. `saasApi` (o `api` en frontend SaaS):
Cliente/API para endpoints premium en `saas`.

3. Contrato API:
Forma estable de input/output entre frontend y backend; cambios rompientes requieren nota de migración.

## Términos de estado
1. `planned`:
Definido pero no iniciado.

2. `in_progress`:
En implementación/refactor activo.

3. `done`:
Implementado y validado según criterios de terminado.

## Convenciones de lenguaje recomendadas
1. Documentación de negocio: español.
2. Identificadores técnicos (modelos/campos/endpoints): respetar idioma del código existente.
3. Cuando exista dualidad, usar formato: `Titularidad (Ownership)` en primeras menciones.

## Referencias
1. `docs/architecture/architecture.md`
2. `docs/architecture/product-architecture.md`
3. `docs/standards/task-template.md`

