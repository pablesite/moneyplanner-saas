# Contrato de Arquitectura Core/SaaS

## Objetivo
- `core` es OSS publico y debe poder usarse por si solo.
- `saas` es privado y agrega capacidades premium sin forzar conceptos premium dentro de `core`.

## Responsabilidades delimitadas

### Core (publico)
- Dominio base de patrimonio: activos, pasivos, snapshots, resumen.
- Autenticacion basica necesaria para uso standalone.
- Soporte de moneda e inflacion para flujos base de patrimonio.
- Contrato de API estable para usuarios base.

### SaaS (privado)
- Modelo premium de titularidad (ownership): miembros familiares, ownerships, splits y restricciones de uso.
- Validaciones avanzadas y flujos premium.
- UI/UX premium y feature gating.

## No objetivos
- `core` no debe contener entidades de dominio exclusivas premium.
- `saas` no debe duplicar logica de negocio de `core` salvo que sea explicitamente inevitable.

## Estrategia del modelo de datos

### Estado objetivo
- Los modelos de `core` no incluyen entidades de titularidad (ownership).
- `saas` es dueno de las entidades de titularidad (ownership) y las enlaza con entidades base.

### Enlace recomendado
- En `saas`, mantener tablas de enlace premium que referencien IDs de entidades base:
  - `asset_id -> activo de core`
  - `liability_id -> pasivo de core`
  - `ownership_id -> ownership de saas`
- Forzar invariantes premium en servicios/APIs de `saas` (por ejemplo, "titularidad (ownership) en uso").

## Estrategia de contrato de API
- Mantener endpoints base de patrimonio en `core`.
- Exponer endpoints premium desde `saas`.
- El frontend usa clientes explicitos:
  - `coreApi` para dominio base.
  - `api` (saas) para dominio premium.

## Estrategia operativa
- Versionar `core` de forma independiente.
- Actualizar `core` en `saas` mediante bumps controlados (update de submodulo + checks de compatibilidad).
- Evitar cambios rompientes entre repos sin notas de migracion.

## Estado Final Hito 05 (Identidad Separada)
- `core` y `saas` operan con autenticacion local independiente.
- No existe dependencia obligatoria de login entre stacks.
- Los JWT de `core` y `saas` usan `ISSUER`/`AUDIENCE` distintos para evitar aceptacion cruzada.
- El linking de cuentas es opcional y soporta:
  - modo directo (`/api/auth/core-link/`),
  - modo token temporal one-time (`/api/auth/link-token/` + `/api/auth/core-link/from-token/`).
- Operacion de auth reforzada con:
  - throttling por scope,
  - auditoria `auth.audit`,
  - metricas separadas (`/api/auth/ops/metrics/` en ambos stacks).

## Relacionado
- Roadmap actual de refactor y trabajo pendiente: `docs/roadmap/roadmap-hito-04-refactor.md`.
- Roadmap historico (V1, completado): `docs/roadmap/roadmap-hito-02-core-saas.md`.
- Roadmap identidad separada (Hito 05): `docs/roadmap/roadmap-hito-05-identidad-separada.md`.
- Contratos API vigentes (core + saas): `docs/architecture/api-contracts.md`.

## Arquitectura funcional relacionada
- Arquitectura de modulos y dependencias funcionales: `docs/architecture/product-architecture.md`.
