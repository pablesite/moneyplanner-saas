# Arquitectura (SaaS + Core)

## Objetivo
Describir la arquitectura actual del repo y la relacion entre `core/` y el stack SaaS.

## Resumen
1. `core/` es la base funcional del producto y concentra el dominio principal.
2. El SaaS anade infraestructura, acceso cloud y operacion sobre ese baseline.
3. El frontend SaaS consume capacidades Core y se apoya en servicios SaaS solo para extras de plataforma.

## Stacks
1. Core:
   - `core/backend` (Django/DRF)
   - `core/frontend` (Vue)
2. SaaS:
   - `backend` (Django, `saas_access`)
   - `frontend` (Vue)

## Principio de diseno
1. Todo dominio funcional compartido vive en `core/backend`.
2. El backend SaaS solo gestiona extras de plataforma:
   - auth
   - RBAC
   - estado de cuenta
   - linking con Core
   - administracion SaaS
3. El SaaS no debe duplicar dominio Core en su backend.

## Alcance funcional actual
1. Core concentra el baseline de producto:
   - patrimonio
   - presupuesto y cierre mensual
   - introduccion de datos
   - guia / coach v1
   - familia / titularidad
   - simulacion y modulos base evolutivos
2. SaaS aporta valor operativo y de plataforma:
   - hosting gestionado
   - acceso cloud
   - administracion SaaS
   - trial y operacion de usuarios

## Integracion entre stacks
1. `core/backend` expone el dominio que usan ambos frontends.
2. `backend/saas_access` resuelve autenticacion, linking y control de acceso SaaS.
3. `frontend` SaaS combina flujos propios con vistas y helpers apoyados en Core.

## Documentos relacionados
1. `docs/architecture/core-saas-boundaries.md`
2. `docs/architecture/capabilities-matrix.md`
3. `docs/operations/dev-setup.md`
4. `docs/roadmap/roadmap.md`
