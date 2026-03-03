# Roadmap (actual)

## Objetivo inmediato
Salir a producción en modo piloto cuanto antes con:
1. Repo `core` público y presentable.
2. SaaS en cloud funcionando con usuarios reales (sin pagos).

## Definición de “salir a producción” (ahora)
1. `core` listo para compartir con comunidad (primero círculo cercano).
2. SaaS desplegado con alta/login y uso real de módulos Core.
3. `trial` como estado por defecto para testers.
4. Sin billing/pagos activados.

## Principio de arquitectura
1. Todo dominio Core se implementa en `core/backend`.
2. El backend SaaS solo gestiona extras (`saas_access`).
3. El frontend SaaS puede consumir dominios Core directamente.

## Core (alcance de referencia)
1. Patrimonio
2. Presupuesto
3. Contabilidad (evolutivo)
4. Simulador financiero (evolutivo)
5. Guía / coach v1
6. Introducción de datos asistida
7. Familia / titularidad
8. Cartera de inversión (diferido en salida inicial)
9. Valoración automática de vivienda habitual (fase 1: suelo + construcción, recálculo mensual)

## SaaS (piloto gratis)
1. Hosting gestionado
2. Auth SaaS + RBAC
3. Trial y admin SaaS interno
4. Frontend SaaS usando baseline Core
5. Linking SaaS/Core

## Qué está fuera del corte inicial
1. Pagos / billing
2. Monetización activa
3. B2B (creadores/asesores)
4. Módulos cloud avanzados (benchmark, heavy compute, LLM cloud) como foco principal
5. Cartera de inversión v1 (si retrasa salida)
6. Coach fase 5 (si retrasa salida)

## Documento operativo asociado
1. `docs/roadmap/core-v0-consolidation-parity-checklist.md`

