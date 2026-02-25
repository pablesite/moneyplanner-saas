# Matriz de Capabilities por Plan

## Objetivo
Definir una matriz de capacidades (`capabilities`) 1:1 entre producto y tecnologia para:
1. `Community/Core`
2. `Cloud Basic`
3. `Cloud Pro`
4. `Cloud Premium`

Esta matriz sirve como contrato de referencia para:
1. Backend (planes, permisos, gating de endpoints/acciones)
2. Frontend (rutas, menus, CTAs, visibilidad de modulos)
3. Roadmap (que entra y no entra en cada fase)

## Decisiones de producto (base)
1. `Community/Core` es `self-hosted` y no se conecta al Cloud.
2. `Cloud Basic` comparte el mismo valor funcional base que `Community/Core`, pero en SaaS gestionado.
3. `Cloud Pro` anade mejora guiada (`Guia`, fases, scores, agente basico, objetivos, simulacion simple).
4. `Cloud Premium` anade optimizacion avanzada (familia, simulacion avanzada, analitica avanzada, inputs premium, ASTRA informativo).

## Convenciones de modelado
1. Separar `plan_code` (comercial) de `capabilities` (tecnicas).
2. Evitar flags ambiguos como `isPremium` para decisiones de producto futuras.
3. Mantener flags de compatibilidad temporal mientras se migra (`isPremium`, `people`, `ownership`).
4. Agrupar capabilities por dominio funcional para facilitar mantenimiento.

## Planes (identificadores propuestos)
### Plan code canonico
1. `community_core`
2. `cloud_basic`
3. `cloud_pro`
4. `cloud_premium`

### Notas de runtime
1. En `Community/Core`, el `plan_code` puede resolverse localmente (constante build-time o config local).
2. En Cloud, el `plan_code` debe venir de backend (suscripcion activa + reglas de estado).

## Matriz de capabilities (producto -> tecnologia)
### Leyenda
1. `Y`: habilitado
2. `N`: deshabilitado
3. `INT`: interno/operacional (no comercial, puede existir en SaaS aunque no se anuncie)

### A. Plataforma / Operacion (modulos)
| Capability | Community/Core | Cloud Basic | Cloud Pro | Cloud Premium | Nota |
|---|---|---|---|---|---|
| `platform.self_hosted` | Y | N | N | N | Core local/self-hosted |
| `platform.cloud_hosted` | N | Y | Y | Y | SaaS |
| `platform.app_auth` | Y | Y | Y | Y | Login/autenticacion de la app (Core y Cloud) |
| `platform.cloud_managed_services` | N | Y | Y | Y | Hosting/ops/backups/updates |
| `platform.cloud_multi_device_access` | N | Y | Y | Y | Acceso multi-dispositivo gestionado (Cloud) |
| `platform.pwa_minimal` | N | Y | Y | Y | PWA minima funcional |
| `platform.mobile_app_native` | N | N | N | N | App movil nativa (futuro canal) |

### B. Base funcional (Fase A) (modulos)
| Capability | Community/Core | Cloud Basic | Cloud Pro | Cloud Premium | Nota |
|---|---|---|---|---|---|
| `core.net_worth` | Y | Y | Y | Y | Patrimonio base |
| `core.data_input` | Y | Y | Y | Y | Introduccion de datos |
| `core.budget` | Y | Y | Y | Y | Presupuesto (plan + ejecutado cuando aplique) |
| `core.accounting_basic` | Y | Y | Y | Y | Contabilidad mensual + cierre de mes (v1) |
| `core.accounting_movements_manual` | Y | Y | Y | Y | Modo detalle opcional (decision A0: entra en Fase A) |
| `core.investment_portfolio_basic` | Y | Y | Y | Y | Cartera v1 basica |
| `core.stats_basic` | Y | Y | Y | Y | Totales/distribuciones simples |
| `core.data_portability_basic` | Y | Y | Y | Y | Export/import portable JSON; CSV basico si entra |
| `core.onboarding_assisted` | Y | Y | Y | Y | Checklist/wizard asistido (decision A0: entra en Fase A) |

### C. Pro (mejora guiada) (modulos)
| Capability | Community/Core | Cloud Basic | Cloud Pro | Cloud Premium | Nota |
|---|---|---|---|---|---|
| `pro.guide` | N | N | Y | Y | `Guia` + fases + progreso + scores |
| `pro.guidance_basic` | N | N | Y | Y | Consejos + alertas + checks basicos |
| `pro.goals` | N | N | Y | Y | Objetivos y seguimiento |
| `pro.simulator_basic` | N | N | Y | Y | Proyecciones 3-5 anos |
| `pro.smart_notifications_basic` | N | N | Y | Y | Notificaciones basicas |
| `pro.assisted_monthly_close` | N | N | Y | Y | Cierre mensual asistido (incluye insights/senales sobre movimientos) |

### D. Premium (optimizacion y aceleracion) (modulos)
| Capability | Community/Core | Cloud Basic | Cloud Pro | Cloud Premium | Nota |
|---|---|---|---|---|---|
| `premium.family_mode` | N | N | N | Y | Hogar/familia |
| `premium.agent_advanced` | N | N | N | Y | Agente avanzado |
| `premium.simulator_advanced` | N | N | N | Y | Montecarlo/FIRE/etc |
| `premium.portfolio_analytics_advanced` | N | N | N | Y | Riesgo/retorno/rebalanceo |
| `premium.community_benchmarking_anonymous` | N | N | N | Y | Benchmarking anonimo con cohortes (opt-in + dataset) |
| `premium.input_capture_advanced` | N | N | N | Y | Foto/voz/OCR para datos/movimientos |
| `premium.import_bulk_advanced` | N | N | N | Y | Importaciones avanzadas |
| `premium.astra_signals_info` | N | N | N | Y | ASTRA informativo |

### E. SaaS plataforma / operacion (usuario Cloud + interno)
| Capability | Community/Core | Cloud Basic | Cloud Pro | Cloud Premium | Nota |
|---|---|---|---|---|---|
| `saas.account_page` | N | Y | Y | Y | Cuenta/plan |
| `saas.admin_internal` | N | INT | INT | INT | Consola/admin interna + RBAC operacional |
| `saas.billing_portal` | N | Y | Y | Y | Cuando se implemente pagos |

## Matiz importante sobre `Guia` y `ownership`
Segun la decision actual de roadmap:
1. `Guia`/fases ya estan implementadas en frontend y se preservan, pero salen de Fase A.
2. `ownership` / `People` ya funcionan en SaaS y se preservan, pero salen de Fase A.
3. En la matriz objetivo quedan asignadas a tiers superiores:
   - `Guia`/fases -> `Cloud Pro`
   - `ownership/People` / familia -> `Cloud Premium`

## Propuesta de contrato backend (v1)
## Payload recomendado (`/api/auth/me` o endpoint de perfil de acceso)
```json
{
  "deployment_mode": "cloud",
  "plan_code": "cloud_basic",
  "plan_status": "active",
  "capabilities_version": 1,
  "capabilities": {
    "platform": {
      "self_hosted": false,
      "cloud_hosted": true,
      "app_auth": true,
      "cloud_managed_services": true,
      "cloud_multi_device_access": true,
      "pwa_minimal": false,
      "mobile_app_native": false
    },
    "core": {
      "net_worth": true,
      "data_input": true,
      "budget": true,
      "accounting_basic": true,
      "accounting_movements_manual": false,
      "investment_portfolio_basic": false,
      "stats_basic": true,
      "data_portability_basic": true,
      "onboarding_assisted": false
    },
    "pro": {
      "guide": false,
      "guidance_basic": false,
      "goals": false,
      "simulator_basic": false,
      "smart_notifications_basic": false,
      "assisted_monthly_close": false
    },
    "premium": {
      "family_mode": false,
      "agent_advanced": false,
      "simulator_advanced": false,
      "portfolio_analytics_advanced": false,
      "community_benchmarking_anonymous": false,
      "input_capture_advanced": false,
      "import_bulk_advanced": false,
      "astra_signals_info": false
    },
    "saas": {
      "account_page": true,
      "admin_internal": false,
      "billing_portal": false
    },
    "compat": {
      "isPremium": false,
      "people": false,
      "ownership": false
    }
  }
}
```

## Reglas backend (recomendadas)
1. `compat.isPremium` es temporal y debe derivarse, no almacenarse como fuente canonica.
2. Los permisos de endpoints deben mirar capabilities funcionales (`pro.*`, `premium.*`) y no `plan_code` directamente, salvo en billing/admin.
3. `plan_status` (`trial`, `active`, `past_due`, `canceled`) debe combinarse con `plan_code` para resolver capabilities efectivas.
4. `Community/Core` no necesita endpoint Cloud; sus capabilities pueden ser fijas en build/config local.

## Propuesta de tipo frontend (v2)
## Tipo sugerido (`frontend` y `core/frontend`)
```ts
export type AppCapabilitiesV2 = {
  deploymentMode: 'self_hosted' | 'cloud';
  planCode: 'community_core' | 'cloud_basic' | 'cloud_pro' | 'cloud_premium';
  capabilitiesVersion: number;
  platform: {
    selfHosted: boolean;
    cloudHosted: boolean;
    appAuth: boolean;
    cloudManagedServices: boolean;
    cloudMultiDeviceAccess: boolean;
    pwaMinimal: boolean;
    mobileAppNative: boolean;
  };
  core: {
    netWorth: boolean;
    dataInput: boolean;
    budget: boolean;
    accountingBasic: boolean; // incluye cierre mensual v1
    accountingMovementsManual: boolean;
    investmentPortfolioBasic: boolean;
    statsBasic: boolean;
    dataPortabilityBasic: boolean;
    onboardingAssisted: boolean;
  };
  pro: {
    guide: boolean;
    guidanceBasic: boolean;
    goals: boolean;
    simulatorBasic: boolean;
    smartNotificationsBasic: boolean;
    assistedMonthlyClose: boolean;
  };
  premium: {
    familyMode: boolean;
    agentAdvanced: boolean;
    simulatorAdvanced: boolean;
    portfolioAnalyticsAdvanced: boolean;
    communityBenchmarkingAnonymous: boolean;
    inputCaptureAdvanced: boolean;
    importBulkAdvanced: boolean;
    astraSignalsInfo: boolean;
  };
  saas: {
    accountPage: boolean;
    adminInternal: boolean;
    billingPortal: boolean;
  };
  compat: {
    isPremium: boolean;
    people: boolean;
    ownership: boolean;
  };
};
```

## Compatibilidad con el estado actual (`isPremium`, `people`, `ownership`)
### Mapping temporal recomendado
1. `compat.isPremium = plan_code in {'cloud_pro', 'cloud_premium'}`
2. `compat.people = capabilities.premium.family_mode`
3. `compat.ownership = capabilities.premium.family_mode`

Nota:
1. Si cambias el packaging en el futuro, ajusta `compat.people/ownership` sin romper el contrato `v2`.

## Plan de implementacion recomendado (corto)
### Paso 1 - Documentacion y decision de packaging
1. Decision cerrada: `ownership/People` en `Cloud Premium`.
2. Cerrar alcance de `Guia` en `Cloud Pro` (hub + details + scores).
3. Decision cerrada: `core.accounting_movements_manual` entra en Fase A (modo detalle opcional).
4. Decision cerrada: `core.onboarding_assisted` entra en Fase A.
5. `core.investment_portfolio_basic`: capability de Fase A, implementacion cuando llegue su momento dentro del roadmap de ejecucion.

### Paso 2 - Backend SaaS (modelo de plan)
1. Introducir `plan_code` en suscripcion/perfil de acceso.
2. Resolver `capabilities` efectivas por usuario.
3. Exponer endpoint de perfil/capabilities.
4. Mantener compatibilidad con checks actuales mientras se migra.

### Paso 3 - Frontend SaaS (gating)
1. Sustituir checks de `isPremium` por capabilities funcionales donde aplique.
2. Gatear rutas:
   - `Guia` (Pro+)
   - `People` / `ownership` (`Premium`)
   - `admin` (solo interno)
3. Ajustar menus y CTAs de upgrade.

### Paso 4 - Frontend Core (build baseline Fase A)
1. Fijar capabilities locales de `Community/Core`.
2. Asegurar que el baseline de Fase A no depende de features `Pro/Premium`.

## Riesgos y mitigaciones
1. Riesgo: mezclar "feature implementada" con "feature vendida".
   - Mitigacion: capabilities como contrato canonico; roadmap y UI consumen el mismo mapa.
2. Riesgo: seguir usando `isPremium` para todo y bloquear escalado a 4 planes.
   - Mitigacion: mantener `compat.*` solo como puente, no como fuente principal.
3. Riesgo: hardcodear gating distinto en backend y frontend.
   - Mitigacion: backend emite capabilities efectivas; frontend solo consume.
4. Riesgo: convertir movimientos manuales en requisito para obtener valor.
   - Mitigacion: mantener `check-ins` como modo base y movimientos como `modo detalle` opcional.

## Referencias
1. `docs/roadmap/roadmap.md`
2. `docs/architecture/product-architecture.md`
3. `frontend/src/domains/capabilities/index.ts`
4. `core/frontend/src/domains/capabilities/index.ts`
5. `backend/memberships/models.py`
