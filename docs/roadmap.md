# Roadmap Global Del Producto

## Objetivo
Mantener una visión de alto nivel de los hitos del producto, desde lo ya completado hasta lo que sigue.

## Estado global
- Proyecto en transición de fase de base técnica hacia fase de crecimiento de producto y salida a producción.

## Línea temporal de hitos

### Hito 01 (completado)
Lanzar el primer repositorio y construir el módulo de Patrimonio base.

Resultado:
- Primera versión funcional de patrimonio (activos, pasivos, resumen, snapshots).

### Hito 02 (completado)
Separar en dos repositorios/líneas: `core` (OSS) y `saas` (privado premium).

Resultado:
- Frontera `core`/`saas` definida y aplicada en dominio de titularidad premium.

Referencias:
- `docs/roadmap-01-core-saas.md`
- `docs/architecture.md`

### Hito 03 (completado)
Mejorar el flujo de trabajo del proyecto con Codex.

Resultado:
- Documentación base de operación y colaboración.
- Plantillas y scripts para acelerar sesiones.

Referencias:
- `AGENTS.md`
- `docs/runbook.md`
- `docs/dev-setup.md`
- `docs/task-template.md`
- `docs/glossary.md`
- `scripts/dev.ps1`

## Próximos hitos (alto nivel)

### Hito 04 (siguiente)
Ejecutar Roadmap 02: refactorización y añadir tests + linters.

Referencia:
- `docs/roadmap-02-release.md`

### Hito 05
Diseñar identidad centralizada: `core` como IdP para usuario único real.

Objetivo:
1. Definir modelo de autenticación unificado `core` + `saas`.
2. Planificar migración gradual sin romper flujo actual.

### Hito 06
Mejorar módulo Patrimonio (especialmente frontend):
1. Añadir visualizaciones/gráficos con más información útil.
2. Mejorar UX de análisis de evolución y composición.

### Hito 07
Poner en producción la primera versión para demo y validación con usuarios.

Entregables sugeridos:
1. Entorno productivo estable.
2. Checklist de despliegue y rollback validado.
3. Demo funcional guiada.

### Hito 08
Versión móvil.

Objetivo:
- Definir e implementar estrategia mobile (responsive avanzado, PWA o app nativa/híbrida).

### Hito 09
Landing y sistema de pagos para SaaS.

Objetivo:
1. Landing comercial clara (valor, pricing, CTA).
2. Flujo de alta/checkout y activación de plan.
3. Integración de facturación/pagos.

### Hito 10
Construcción del resto de módulos funcionales.

Módulos pendientes (después de Patrimonio):
1. Presupuesto
2. Contabilidad
3. Cartera de Inversión
4. Simulador

Referencia funcional:
- `docs/product-architecture.md`

### Hito 11 (continuo)
Escalar calidad y producto de forma iterativa.

Líneas continuas:
1. Observabilidad y métricas de uso.
2. Mejora de rendimiento.
3. Seguridad y hardening.
4. Mejora UX/UI basada en feedback real.

## Orden recomendado de ejecución
1. Hito 04 (refactor + calidad automática)
2. Hito 05 (diseño IdP centralizado en core)
3. Hito 06 (mejora de patrimonio frontend)
4. Hito 07 (producción v1 para enseñar)
5. Hito 09 (landing + pagos)
6. Hito 08 (móvil)
7. Hito 10 (resto de módulos)
8. Hito 11 (iteración continua)

## Criterio de actualización
Actualizar este documento cuando:
1. Se completa un hito.
2. Cambia prioridad de negocio.
3. Aparece un nuevo bloque estratégico relevante.
