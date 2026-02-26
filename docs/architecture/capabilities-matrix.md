# Matriz de Capabilities por Plan / Deployment

## Objetivo
Definir `capabilities` como contrato de producto/tecnologia para el enfoque `Open-Core + SaaS`:
1. `Core` completo (self-hosted)
2. `SaaS` como infraestructura + valor centralizado + colaboracion cloud
3. Evolucion futura a planes comerciales sin romper el boundary tecnico

## Rebaseline (2026-02-26)
### Principio
1. Las `capabilities` no deben usarse para crear bloqueos artificiales del Core.
2. Deben describir:
   - capacidades base del producto (`core.*`)
   - capacidades cloud/operacionales (`cloud.*`)
   - capacidades centralizadas (`central.*`)
   - capacidades de colaboracion/familia cloud (`family_cloud.*`)
3. El empaquetado comercial (planes) puede cambiar; el contrato tecnico debe ser estable y expresivo.

## Hallazgo de codigo actual (importante)
1. Ya existe un contrato `AppCapabilitiesV2` en:
   - `frontend/src/domains/capabilities/index.ts`
   - `core/frontend/src/domains/capabilities/index.ts`
2. El uso real sigue con compat legacy:
   - `compat.isPremium`
   - `compat.people`
   - `compat.ownership`
3. El backend SaaS aun expone `premium_enabled` binario (`/api/auth/me`) y permisos `HasPremiumAccess`.

Conclusion:
1. Mantener el contrato v2 y evolucionarlo.
2. Mantener `compat.*` como puente temporal.
3. Reorganizar el significado de las capabilities antes de expandir features.

## Convenciones de modelado
1. Separar `deployment_mode` de `plan_code`.
2. Separar `plan_code` de `capabilities`.
3. Backend SaaS resuelve capabilities efectivas.
4. Frontend consume capabilities; no empaquetado hardcodeado.
5. `compat.*` solo como migracion, no como fuente de verdad.

## Planes / deployment (propuestos)
### Deployment mode
1. `self_hosted`
2. `cloud`

### Plan code (canonico, futuro-compatible)
1. `community_core`
2. `cloud_basic`
3. `cloud_plus` (placeholder comercial si se necesita antes de Pro/Premium)
4. `cloud_pro`
5. `cloud_premium`
6. `cloud_b2b`

Nota:
1. Para la primera salida SaaS sin pagos, se puede usar `cloud_basic` tecnico aunque no exista billing.

## Matriz objetivo (producto -> tecnologia)
### Leyenda
1. `Y`: habilitado
2. `N`: no habilitado
3. `P`: planificado (no implementado o incompleto)
4. `INT`: interno/operacional

### A. Plataforma / despliegue
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `platform.self_hosted` | Y | N | N | Ejecucion local/self-hosted |
| `platform.cloud_hosted` | N | Y | Y | SaaS |
| `platform.app_auth` | Y | Y | Y | Login/app auth |
| `platform.cloud_managed_ops` | N | Y | Y | Hosting/ops/updates |
| `platform.cloud_backups_auto` | N | P | Y | Backups automaticos |
| `platform.cloud_multi_device_access` | N | Y | Y | Acceso multidispositivo |
| `platform.pwa_minimal` | N | P | Y | PWA minima |
| `platform.mobile_native` | N | N | P | Futuro |

### B. Core funcional (sin bloqueos artificiales)
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `core.net_worth` | Y | Y | Y | Patrimonio |
| `core.budget` | Y | Y | Y | Presupuesto |
| `core.accounting` | Y | Y | Y | Contabilidad / cierres v1 |
| `core.data_input_assisted` | Y | Y | Y | Introduccion de datos + asistentes |
| `core.family_logical_model` | P | P | Y | Modelo hogar/ownership (reorganizacion pendiente) |
| `core.coach_v1` | Y | Y | Y | Coach financiero base |
| `core.coach_phase_5` | P | P | Y | Se difiere del primer lanzamiento |
| `core.financial_simulator_basic` | P | P | Y | Evolucion progresiva |
| `core.investment_portfolio_basic` | P | P | Y | Puede quedar fuera del primer lanzamiento |
| `core.data_portability_basic` | Y | Y | Y | Export/import portable (JSON; CSV si entra) |
| `core.local_automation_hooks` | P | P | Y | OCR/voz/imports/local LLM segun viabilidad |

### C. SaaS colaboracion cloud (no equivalente directo al Core)
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `family_cloud.member_logins` | N | P | Y | Miembros con login propio |
| `family_cloud.member_privacy` | N | P | Y | Privacidad por miembro |
| `family_cloud.shared_family_views` | N | P | Y | Visualizacion familiar centralizada cloud |

### D. SaaS valor centralizado (infraestructura/datos/escala)
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `central.community_benchmark_anonymous` | N | N | P | Opt-in + dataset agregado |
| `central.compute_heavy_simulation` | N | N | P | Montecarlo / calculos pesados |
| `central.llm_conversational_advanced` | N | N | P | LLM cloud |
| `central.astra_modules` | N | N | P | ASTRA cloud-native |
| `central.smart_notifications` | N | P | Y | Requiere servicio central |

### E. SaaS operacion / admin
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `saas.account_page` | N | Y | Y | Cuenta/estado |
| `saas.admin_internal` | N | INT | INT | Consola interna |
| `saas.billing_portal` | N | N | P | Se difiere en salida temprana |
| `saas.plan_management` | N | P | Y | Billing y cambio de plan |

### F. B2B / Ecosistema (futuro)
| Capability | Community/Core | Cloud (sin pagos) | Cloud Pro/Premium (futuro) | Nota |
|---|---|---|---|---|
| `b2b.creator_affiliates` | N | N | P | Codigos afiliacion |
| `b2b.creator_admin_panel` | N | N | P | Panel creadores |
| `b2b.community_management` | N | N | P | Comunidades |
| `b2b.advisor_workspace` | N | N | P | Asesores financieros |

## Corte de lanzamiento temprano (explicito)
Para la primera salida a produccion (Core publico + SaaS cloud sin pagos):
1. `core.investment_portfolio_basic` puede quedar en `P`.
2. `core.coach_phase_5` puede quedar en `P`.
3. `saas.billing_portal` y `saas.plan_management` quedan en `N/P`.
4. El foco es `Core` usable + SaaS operativo con usuarios reales.

## Mapping temporal con el contrato actual (`v2`)
Mientras se completa la reorganizacion:
1. Mantener `AppCapabilitiesV2` actual como shape base para no romper frontend.
2. Seguir exponiendo `compat`:
   - `compat.isPremium`
   - `compat.people`
   - `compat.ownership`
3. Introducir nuevas claves por etapas (backend y frontend tolerantes a claves nuevas/faltantes).

## Propuesta de migracion (corta)
### Paso 1 - Reorganizacion semantica (sin romper runtime)
1. Documentar el nuevo mapa (este archivo).
2. Reemplazar checks `isPremium` por helpers de dominio donde sea facil.
3. Anadir tests de parsing/defaults en frontend para nuevas keys.

### Paso 2 - Backend SaaS (perfil de acceso)
1. Extender `/api/auth/me` con:
   - `plan_code`
   - `capabilities_version`
   - `capabilities`
2. Mantener `premium_enabled` mientras migra UI.
3. Mover permisos desde "premium binario" a capabilities especificas.

### Paso 3 - Reorganizacion Core/SaaS de familia
1. Definir contrato del `family_logical_model` para Core.
2. Mantener en SaaS las extensiones cloud/multiusuario/privacidad.
3. Migrar en etapas con bridge de compatibilidad.

## Riesgos y mitigaciones
1. Riesgo: reusar `isPremium` para decisiones que ya no encajan en la estrategia.
   - Mitigacion: helpers por capability y migracion gradual.
2. Riesgo: desalinear docs y runtime durante la transicion.
   - Mitigacion: tests de payload y tolerancia a contrato parcial.
3. Riesgo: mover familia/titularidad de golpe y romper SaaS.
   - Mitigacion: separar modelo logico vs colaboracion cloud y migrar por fases.

## Referencias
1. `docs/roadmap/roadmap.md`
2. `docs/architecture/core-saas-boundaries.md`
3. `frontend/src/domains/capabilities/index.ts`
4. `core/frontend/src/domains/capabilities/index.ts`
5. `backend/memberships/models.py`
6. `backend/saas/auth_views.py`
