# Contrato de Arquitectura Core/SaaS

## Objetivo
- `core` es OSS público y debe poder usarse por sí solo.
- `saas` es privado y agrega capacidades premium sin forzar conceptos premium dentro de `core`.

## Responsabilidades delimitadas

### Core (público)
- Dominio base de patrimonio: activos, pasivos, snapshots, resumen.
- Autenticación básica necesaria para uso standalone.
- Soporte de moneda e inflación para flujos base de patrimonio.
- Contrato de API estable para usuarios base.

### SaaS (privado)
- Modelo premium de titularidad (ownership): miembros familiares, ownerships, splits y restricciones de uso.
- Validaciones avanzadas y flujos premium.
- UI/UX premium y feature gating.

## No objetivos
- `core` no debe contener entidades de dominio exclusivas premium.
- `saas` no debe duplicar lógica de negocio de `core` salvo que sea explícitamente inevitable.

## Estrategia del modelo de datos

### Estado objetivo
- Los modelos de `core` no incluyen entidades de titularidad (ownership).
- `saas` es dueño de las entidades de titularidad (ownership) y las enlaza con entidades base.

### Enlace recomendado
- En `saas`, mantener tablas de enlace premium que referencien IDs de entidades base:
  - `asset_id -> activo de core`
  - `liability_id -> pasivo de core`
  - `ownership_id -> ownership de saas`
- Forzar invariantes premium en servicios/APIs de `saas` (por ejemplo, "titularidad (ownership) en uso").

## Estrategia de contrato de API
- Mantener endpoints base de patrimonio en `core`.
- Exponer endpoints premium desde `saas`.
- El frontend usa clientes explícitos:
  - `coreApi` para dominio base.
  - `api` (saas) para dominio premium.

## Estrategia operativa
- Versionar `core` de forma independiente.
- Actualizar `core` en `saas` mediante bumps controlados (update de submódulo + checks de compatibilidad).
- Evitar cambios rompientes entre repos sin notas de migración.

## Relacionado
- Roadmap actual de refactor y trabajo pendiente: `docs/roadmap/roadmap-02-release.md`.
- Roadmap histórico (V1, completado): `docs/roadmap/roadmap-01-core-saas.md`.
- Contratos API vigentes (core + saas): `docs/architecture/api-contracts.md`.

## Arquitectura funcional relacionada
- Arquitectura de módulos y dependencias funcionales: `docs/architecture/product-architecture.md`.





