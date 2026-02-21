<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { findGuidePhaseById, getActiveGuidePhase, guidePhases } from '@/domains/guide/phases';
import { useNetWorthStore } from '@/stores/netWorth';

type ScoreTone = 'solid' | 'medium' | 'watch' | 'risk';

type SummaryExtended = {
  liabilities_asset_backed?: string | null;
  liabilities_unbacked?: string | null;
};

type ScoreKpi = {
  id: string;
  label: string;
  valueText: string;
  score: number;
  hint: string;
};

type ScoreCard = {
  id: string;
  title: string;
  score: number;
  description: string;
  kpis: ScoreKpi[];
};

const route = useRoute();
const store = useNetWorthStore();

const phaseId = computed(() => {
  const raw = String(route.params.phaseId ?? '');
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
});

const phase = computed(() => (phaseId.value == null ? null : findGuidePhaseById(phaseId.value)));
const activePhase = computed(() => getActiveGuidePhase());
const isNetWorthHealthPhase = computed(() => phase.value?.id === 4);
const summaryExtended = computed(() => store.summary as SummaryExtended | null);

function toNumber(raw: unknown): number {
  const normalized = String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatPct(n: number | null, decimals = 0): string {
  if (n == null || !Number.isFinite(n)) return '-';
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function linearScoreIncreasing(value: number | null, min: number, max: number): number {
  if (value == null || !Number.isFinite(value) || max <= min) return 0;
  const normalized = (value - min) / (max - min);
  return clamp(normalized * 100, 0, 100);
}

function linearScoreDecreasing(value: number | null, min: number, max: number): number {
  if (value == null || !Number.isFinite(value) || max <= min) return 0;
  const normalized = (max - value) / (max - min);
  return clamp(normalized * 100, 0, 100);
}

function weightedScore(items: { score: number; weight: number }[]): number {
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  if (totalWeight <= 0) return 0;
  const sum = items.reduce((acc, item) => acc + item.score * item.weight, 0);
  return clamp(sum / totalWeight, 0, 100);
}

function kpiFillStyle(score: number): Record<string, string> {
  const normalized = clamp(score, 0, 100);
  const hue = (normalized / 100) * 120;
  return {
    width: `${normalized}%`,
    backgroundColor: `hsl(${hue} 82% 52%)`,
  };
}

const chartRows = computed(() => {
  const chart = store.byCategoryChart;
  return chart.keys.map((key, index) => ({
    key,
    assets: Math.max(0, chart.assets[index] ?? 0),
    liabilities: Math.max(0, chart.liabilities[index] ?? 0),
  }));
});

const assetRows = computed(() => chartRows.value.filter((row) => row.assets > 0));

const assetsValue = computed(() => Math.max(0, toNumber(store.summary?.total_assets)));
const liabilitiesValue = computed(() => Math.max(0, toNumber(store.summary?.total_liabilities)));
const netWorthValue = computed(() => toNumber(store.summary?.net_worth));
const backedDebtValue = computed(() =>
  Math.max(0, toNumber(summaryExtended.value?.liabilities_asset_backed)),
);
const unbackedDebtValue = computed(() =>
  Math.max(0, toNumber(summaryExtended.value?.liabilities_unbacked)),
);

const equityRatioValue = computed(() =>
  assetsValue.value > 0 ? netWorthValue.value / assetsValue.value : null,
);
const debtToAssetsValue = computed(() =>
  assetsValue.value > 0 ? liabilitiesValue.value / assetsValue.value : null,
);

const productiveAssetsValue = computed(() => {
  const productiveKeys = new Set(['investments', 'real_estate']);
  return assetRows.value
    .filter((row) => productiveKeys.has(row.key))
    .reduce((acc, row) => acc + row.assets, 0);
});

const productiveAssetsShareValue = computed(() =>
  assetsValue.value > 0 ? productiveAssetsValue.value / assetsValue.value : null,
);

const illiquidAssetsValue = computed(() => {
  const illiquidKeys = new Set(['real_estate', 'furnishings', 'other']);
  return assetRows.value
    .filter((row) => illiquidKeys.has(row.key))
    .reduce((acc, row) => acc + row.assets, 0);
});

const illiquidAssetsShareValue = computed(() =>
  assetsValue.value > 0 ? illiquidAssetsValue.value / assetsValue.value : null,
);

const topAssetShareValue = computed(() => {
  if (assetsValue.value <= 0) return null;
  const topAssets = assetRows.value.map((row) => row.assets).sort((a, b) => b - a)[0] ?? 0;
  return topAssets / assetsValue.value;
});

const diversificationIndexValue = computed(() => {
  if (assetsValue.value <= 0) return null;
  const shares = assetRows.value.map((row) => row.assets / assetsValue.value);
  if (!shares.length) return null;
  const hhi = shares.reduce((acc, share) => acc + share * share, 0);
  const minHhi = 1 / 5;
  const maxHhi = 1;
  return clamp((maxHhi - hhi) / (maxHhi - minHhi), 0, 1);
});

const equityScoreValue = computed(() => linearScoreIncreasing(equityRatioValue.value, 0.2, 0.8));
const debtScoreValue = computed(() => linearScoreDecreasing(debtToAssetsValue.value, 0.2, 0.8));

const productiveScoreValue = computed(() =>
  linearScoreIncreasing(productiveAssetsShareValue.value, 0.2, 0.7),
);
const illiquidScoreValue = computed(() =>
  linearScoreDecreasing(illiquidAssetsShareValue.value, 0.25, 0.8),
);

const concentrationScoreValue = computed(() =>
  linearScoreDecreasing(topAssetShareValue.value, 0.4, 0.9),
);
const diversificationScoreValue = computed(() =>
  linearScoreIncreasing(diversificationIndexValue.value, 0.2, 0.8),
);

const structuralScoreValue = computed(() =>
  weightedScore([
    { score: equityScoreValue.value, weight: 0.6 },
    { score: debtScoreValue.value, weight: 0.4 },
  ]),
);

const qualityScoreValue = computed(() =>
  weightedScore([
    { score: productiveScoreValue.value, weight: 0.5 },
    { score: illiquidScoreValue.value, weight: 0.5 },
  ]),
);

const riskDistributionScoreValue = computed(() =>
  weightedScore([
    { score: concentrationScoreValue.value, weight: 0.5 },
    { score: diversificationScoreValue.value, weight: 0.5 },
  ]),
);

const globalScoreValue = computed(() =>
  weightedScore([
    { score: structuralScoreValue.value, weight: 0.4 },
    { score: qualityScoreValue.value, weight: 0.3 },
    { score: riskDistributionScoreValue.value, weight: 0.3 },
  ]),
);

function toneFromScore(score: number): ScoreTone {
  if (score >= 75) return 'solid';
  if (score >= 55) return 'medium';
  if (score >= 35) return 'watch';
  return 'risk';
}

const globalToneValue = computed(() => toneFromScore(globalScoreValue.value));

const globalLabelValue = computed(() => {
  const tone = globalToneValue.value;
  if (tone === 'solid') return 'Salud patrimonial solida';
  if (tone === 'medium') return 'Salud patrimonial equilibrada';
  if (tone === 'watch') return 'Salud patrimonial mejorable';
  return 'Salud patrimonial vulnerable';
});

const scoreCards = computed<ScoreCard[]>(() => [
  {
    id: 'structural',
    title: 'Solidez estructural',
    score: structuralScoreValue.value,
    description: 'Cuanta estructura propia sostiene el balance frente al pasivo.',
    kpis: [
      {
        id: 'equity-ratio',
        label: 'Equity ratio',
        valueText: formatPct(equityRatioValue.value, 0),
        score: equityScoreValue.value,
        hint: 'Patrimonio / activos',
      },
      {
        id: 'debt-assets',
        label: 'Debt-to-assets',
        valueText: formatPct(debtToAssetsValue.value, 0),
        score: debtScoreValue.value,
        hint: 'Pasivo / activos (inverso)',
      },
    ],
  },
  {
    id: 'quality',
    title: 'Calidad de la estructura',
    score: qualityScoreValue.value,
    description: 'Peso relativo de activos utiles frente a carga iliquida.',
    kpis: [
      {
        id: 'productive-assets',
        label: '% activos productivos',
        valueText: formatPct(productiveAssetsShareValue.value, 0),
        score: productiveScoreValue.value,
        hint: 'Inversiones + inmuebles',
      },
      {
        id: 'illiquid-assets',
        label: '% activos iliquidos',
        valueText: formatPct(illiquidAssetsShareValue.value, 0),
        score: illiquidScoreValue.value,
        hint: 'Inmuebles + mobiliario + otros (inverso)',
      },
    ],
  },
  {
    id: 'distribution',
    title: 'Distribucion del riesgo',
    score: riskDistributionScoreValue.value,
    description: 'Dependencia de un unico bloque frente a reparto equilibrado.',
    kpis: [
      {
        id: 'top-share',
        label: 'Concentracion top activo',
        valueText: formatPct(topAssetShareValue.value, 0),
        score: concentrationScoreValue.value,
        hint: 'Peso del activo dominante (inverso)',
      },
      {
        id: 'diversification',
        label: 'Indice de diversificacion',
        valueText: formatPct(diversificationIndexValue.value, 0),
        score: diversificationScoreValue.value,
        hint: 'HHI normalizado',
      },
    ],
  },
]);

function maybeLoadNetWorthContext() {
  if (!isNetWorthHealthPhase.value) return;
  void store.fetchSettings();
  void store.refreshAll();
}

function phaseDetailTo(phaseIdParam: number): string {
  return `/guia/fases/${phaseIdParam}`;
}

onMounted(() => {
  maybeLoadNetWorthContext();
});

watch(isNetWorthHealthPhase, () => {
  maybeLoadNetWorthContext();
});
</script>

<template>
  <div class="container ui-pro-page">
    <section class="card ui-pro-panel ui-guide-phase-head">
      <div class="ui-guide-phase-nav-row">
        <RouterLink class="ui-guide-back-link" to="/inicio">Ver ruta completa</RouterLink>
        <div class="ui-guide-phase-switch">
          <RouterLink
            v-for="phaseItem in guidePhases"
            :key="phaseItem.id"
            class="ui-guide-phase-switch-link"
            :class="{ 'ui-guide-phase-switch-link-active': phaseItem.id === phase?.id }"
            :to="phaseDetailTo(phaseItem.id)"
          >
            F{{ phaseItem.id }}
          </RouterLink>
        </div>
      </div>

      <template v-if="phase">
        <p class="ui-pro-kicker">Fase {{ phase.id }}</p>
        <h1 class="h1 ui-guide-phase-title">{{ phase.title }}</h1>
        <p class="subtle ui-guide-phase-copy">{{ phase.objective }}</p>

        <div class="ui-guide-phase-meta">
          <span class="ui-pro-chip">Foco: {{ phase.focus }}</span>
          <span class="ui-pro-chip">Progreso: {{ phase.progress }}%</span>
          <span class="ui-pro-chip">Fase activa: F{{ activePhase.id }}</span>
        </div>
      </template>

      <template v-else>
        <h1 class="h1 ui-guide-phase-title">Fase no encontrada</h1>
      </template>
    </section>

    <section v-if="!phase" class="card ui-pro-panel">
      <p class="subtle">La fase seleccionada no existe en la guia actual.</p>
    </section>

    <section v-else-if="!isNetWorthHealthPhase" class="card ui-pro-panel">
      <h2 class="h2">Detalle en construccion</h2>
      <p class="subtle">
        Esta fase ya tiene su contexto funcional, pero el diagnostico detallado se publicara en
        siguientes entregas del roadmap.
      </p>
      <ul class="list">
        <li>Objetivo: {{ phase.objective }}</li>
        <li>Foco operativo: {{ phase.focus }}</li>
        <li>Prerrequisito: completar antes la fase activa en Guia.</li>
      </ul>
    </section>

    <section v-else class="card ui-pro-panel ui-guide-score-panel">
      <div class="ui-guide-score-top">
        <div class="ui-guide-health-badge" :class="`ui-guide-health-${globalToneValue}`">
          {{ globalLabelValue }}
        </div>

        <div class="ui-guide-global-score-wrap">
          <div class="ui-guide-global-score-label">Score global Fase 4</div>
          <div class="ui-guide-global-score-value">{{ formatNumber(globalScoreValue, 0) }}/100</div>
        </div>

        <div class="ui-guide-health-copy">
          Diagnostico estructural del patrimonio: solidez, calidad de la estructura y distribucion
          del riesgo.
        </div>
      </div>

      <div class="ui-guide-global-meter" :class="`ui-guide-global-meter-${globalToneValue}`">
        <span class="ui-guide-global-meter-fill" :style="{ width: `${globalScoreValue}%` }"></span>
      </div>

      <div class="ui-guide-score-grid">
        <article v-for="card in scoreCards" :key="card.id" class="ui-guide-score-card">
          <div class="ui-guide-score-card-head">
            <h3 class="ui-guide-score-card-title">{{ card.title }}</h3>
            <div class="ui-guide-score-card-value">{{ formatNumber(card.score, 0) }}/100</div>
          </div>
          <p class="ui-guide-score-card-copy">{{ card.description }}</p>

          <div class="ui-guide-score-kpi-list">
            <div v-for="kpi in card.kpis" :key="kpi.id" class="ui-guide-score-kpi">
              <div class="ui-guide-score-kpi-head">
                <span>{{ kpi.label }}</span>
                <strong>{{ kpi.valueText }}</strong>
              </div>
              <div class="ui-guide-score-kpi-track">
                <span class="ui-guide-score-kpi-fill" :style="kpiFillStyle(kpi.score)"></span>
              </div>
              <div class="ui-guide-score-kpi-hint">{{ kpi.hint }}</div>
            </div>
          </div>
        </article>
      </div>

      <div class="ui-guide-summary-grid">
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Patrimonio neto</div>
          <div class="ui-guide-summary-value">{{ formatNumber(netWorthValue, 2) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Activos totales</div>
          <div class="ui-guide-summary-value">{{ formatNumber(assetsValue, 2) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Pasivos totales</div>
          <div class="ui-guide-summary-value">{{ formatNumber(liabilitiesValue, 2) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Deuda sin respaldo</div>
          <div class="ui-guide-summary-value">{{ formatNumber(unbackedDebtValue, 2) }}</div>
          <div class="ui-guide-summary-meta">
            Con respaldo: {{ formatNumber(backedDebtValue, 2) }}
          </div>
        </article>
      </div>

      <div v-if="store.loading" class="ui-status-line">Cargando diagnostico...</div>
      <div v-else-if="store.error" class="alert">{{ store.error }}</div>
    </section>
  </div>
</template>

<style scoped>
.ui-guide-phase-head {
  display: grid;
  gap: 10px;
}

.ui-guide-phase-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.ui-guide-back-link {
  color: rgba(45, 212, 191, 0.95);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.ui-guide-back-link:hover {
  text-decoration: underline;
}

.ui-guide-phase-switch {
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ui-guide-phase-switch-link {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  text-decoration: none;
  color: var(--text);
  background: rgba(255, 255, 255, 0.02);
}

.ui-guide-phase-switch-link-active {
  border-color: rgba(45, 212, 191, 0.72);
  background: rgba(45, 212, 191, 0.12);
}

.ui-guide-phase-title {
  margin-bottom: 2px;
}

.ui-guide-phase-copy {
  margin: 0;
}

.ui-guide-phase-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ui-guide-score-panel {
  padding: 16px;
}

.ui-guide-score-top {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.ui-guide-health-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 11px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.ui-guide-health-solid {
  background: rgba(74, 222, 128, 0.16);
  color: rgba(134, 239, 172, 0.95);
}

.ui-guide-health-medium {
  background: rgba(163, 230, 53, 0.18);
  color: rgba(190, 242, 100, 0.95);
}

.ui-guide-health-watch {
  background: rgba(250, 204, 21, 0.16);
  color: rgba(253, 224, 71, 0.95);
}

.ui-guide-health-risk {
  background: rgba(251, 113, 133, 0.16);
  color: rgba(251, 113, 133, 0.95);
}

.ui-guide-global-score-wrap {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 11px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
}

.ui-guide-global-score-label {
  font-size: 11px;
  color: var(--muted);
}

.ui-guide-global-score-value {
  margin-top: 1px;
  font-size: 20px;
  font-weight: 700;
}

.ui-guide-health-copy {
  font-size: 14px;
  color: var(--muted);
}

.ui-guide-global-meter {
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.ui-guide-global-meter-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(74, 222, 128, 0.95), rgba(45, 212, 191, 0.95));
}

.ui-guide-global-meter-medium .ui-guide-global-meter-fill {
  background: linear-gradient(90deg, rgba(132, 204, 22, 0.95), rgba(163, 230, 53, 0.95));
}

.ui-guide-global-meter-watch .ui-guide-global-meter-fill {
  background: linear-gradient(90deg, rgba(250, 204, 21, 0.95), rgba(251, 191, 36, 0.95));
}

.ui-guide-global-meter-risk .ui-guide-global-meter-fill {
  background: linear-gradient(90deg, rgba(251, 113, 133, 0.95), rgba(244, 63, 94, 0.95));
}

.ui-guide-score-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.ui-guide-score-card {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  padding: 12px;
}

.ui-guide-score-card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.ui-guide-score-card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.ui-guide-score-card-value {
  font-size: 14px;
  font-weight: 700;
}

.ui-guide-score-card-copy {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.ui-guide-score-kpi-list {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.ui-guide-score-kpi-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.ui-guide-score-kpi-track {
  margin-top: 4px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.ui-guide-score-kpi-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  width: 0%;
  background: hsl(0 82% 52%);
}

.ui-guide-score-kpi-hint {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.ui-guide-summary-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ui-guide-summary-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 11px;
}

.ui-guide-summary-label {
  font-size: 12px;
  color: var(--muted);
}

.ui-guide-summary-value {
  margin-top: 3px;
  font-size: 20px;
  font-weight: 700;
}

.ui-guide-summary-meta {
  margin-top: 4px;
  font-size: 11px;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .ui-guide-score-grid {
    grid-template-columns: 1fr;
  }

  .ui-guide-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .ui-guide-score-top {
    grid-template-columns: 1fr;
  }

  .ui-guide-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
