# Roadmap Global Del Producto

## Objetivo
Mantener una vision de alto nivel de los hitos del producto, desde lo ya completado hasta lo que sigue.

## Estado global
- Proyecto en transicion de fase de base tecnica hacia fase de crecimiento de producto y salida a produccion.

## Linea temporal de hitos

### Hito 01 (completado)
Lanzar el primer repositorio y construir el modulo de Patrimonio base.

Resultado:
- Primera version funcional de patrimonio (activos, pasivos, resumen, snapshots).

### Hito 02 (completado)
Separar en dos repositorios/lineas: `core` (OSS) y `saas` (privado premium).

Resultado:
- Frontera `core`/`saas` definida y aplicada en dominio de titularidad premium.

Referencias:
- `docs/roadmap/roadmap-hito-02-core-saas.md`
- `docs/architecture/architecture.md`

### Hito 03 (completado)
Mejorar el flujo de trabajo del proyecto con Codex.

Resultado:
- Documentacion base de operacion y colaboracion.
- Plantillas y scripts para acelerar sesiones.

Referencias:
- `AGENTS.md`
- `docs/operations/runbook.md`
- `docs/operations/dev-setup.md`
- `docs/standards/task-template.md`
- `docs/standards/glossary.md`
- `scripts/dev.ps1`

## Proximos hitos (alto nivel)

### Hito 04 (en progreso)
Ejecutar Roadmap 02: refactorizacion y anadir tests + linters.

Referencia:
- `docs/roadmap/roadmap-hito-04-release.md`

### Hito 05 (completado)
Disenar identidad separada para `core` OSS y `saas` premium.

Objetivo:
1. Mantener `core` 100% usable de forma standalone desde GitHub.
2. Mantener auth propia en `saas` para usuarios de suscripcion premium.
3. Definir vinculacion opcional de cuentas `core` <-> `saas` sin dependencia obligatoria.

Referencia:
- `docs/roadmap/roadmap-hito-05-identidad-separada.md`
- `docs/operations/release-summary-2-roadmap03-identity.md`

### Hito 06
Mejorar modulo Patrimonio (especialmente frontend):
1. Anadir visualizaciones/graficos con mas informacion util.
2. Mejorar UX de analisis de evolucion y composicion.

### Hito 07
Poner en produccion la primera version para demo y validacion con usuarios.

Entregables sugeridos:
1. Entorno productivo estable.
2. Checklist de despliegue y rollback validado.
3. Demo funcional guiada.

### Hito 08
Version movil.

Objetivo:
- Definir e implementar estrategia mobile (responsive avanzado, PWA o app nativa/hibrida).

### Hito 09
Landing y sistema de pagos para SaaS.

Objetivo:
1. Landing comercial clara (valor, pricing, CTA).
2. Flujo de alta/checkout y activacion de plan.
3. Integracion de facturacion/pagos.

### Hito 10
Construccion del resto de modulos funcionales.

Modulos pendientes (despues de Patrimonio):
1. Presupuesto
2. Contabilidad
3. Cartera de Inversion
4. Simulador

Referencia funcional:
- `docs/architecture/product-architecture.md`

### Hito 11 (continuo)
Escalar calidad y producto de forma iterativa.

Lineas continuas:
1. Observabilidad y metricas de uso.
2. Mejora de rendimiento.
3. Seguridad y hardening.
4. Mejora UX/UI basada en feedback real.

## Orden recomendado de ejecucion
1. Hito 04 (refactor + calidad automatica)
2. Hito 05 (identidad separada `core`/`saas` + linking opcional)
3. Hito 06 (mejora de patrimonio frontend)
4. Hito 07 (produccion v1 para ensenar)
5. Hito 09 (landing + pagos)
6. Hito 08 (movil)
7. Hito 10 (resto de modulos)
8. Hito 11 (iteracion continua)

## Criterio de actualizacion
Actualizar este documento cuando:
1. Se completa un hito.
2. Cambia prioridad de negocio.
3. Aparece un nuevo bloque estrategico relevante.

