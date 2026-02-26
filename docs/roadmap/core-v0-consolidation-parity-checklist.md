# Checklist de consolidación Core v0 + SaaS mirror (piloto)

## Objetivo
1. Consolidar un baseline funcional en `core` (back + front).
2. Usar ese baseline como base del SaaS piloto gratis.

## Estado actual (resumen)
1. `core/frontend` ya está alineado con el frontend SaaS en vistas base clave.
2. `family/ownership` vive en `core/backend`.
3. Frontend SaaS consume `family/ownership` desde Core.
4. Backend SaaS ya no expone ni mantiene `memberships`; usa `saas_access`.
5. Bootstrap de familia al crear usuarios SaaS se ejecuta en Core (`ensure-primary`).
6. Política piloto: `trial` + admin SaaS interno.

## Pendientes para cierre de piloto
1. `Login/registro` operativos en entorno cloud [ ]
2. `Acceso a vistas baseline Core` en cloud [ ]
3. `Sin billing visible` para usuario final [ ]
4. `Onboarding testers` (alta manual + instrucciones cortas) [ ]
5. `Runbook mínimo de soporte piloto` [ ]
6. `Smoke end-to-end` en despliegue real (SaaS + Core) [ ]

## Smoke mínimo del piloto
1. Registro SaaS / login SaaS
2. Alta desde Admin SaaS
3. Bootstrap familia/titularidad en Core
4. `People`
5. `Patrimonio`
6. `Introducción de datos`
7. `Guía`
8. `Cierre mensual`
