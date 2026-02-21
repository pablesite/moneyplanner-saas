<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { findGuidePhaseById, getActiveGuidePhase } from '@/domains/guide/phases';
import { useNetWorthStore } from '@/stores/netWorth';

type InsightTone = 'stable' | 'warn' | 'danger';
type CurvePoint = { x: number; y: number };
type SummaryExtended = {
  liabilities_asset_backed?: string | null;
  liabilities_unbacked?: string | null;
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

const categoryLabelMap = new Map<string, string>([
  ['cash', 'Liquidez'],
  ['investments', 'Inversiones'],
  ['real_estate', 'Inmuebles'],
  ['furnishings', 'Mobiliario'],
  ['other', 'Otros'],
  ['mortgage', 'Hipoteca'],
  ['personal_loan', 'Prestamo personal'],
  ['credit_card', 'Tarjeta'],
]);

function toNumber(raw: unknown): number {
  const normalized = String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
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

function toneByThreshold(
  value: number | null,
  warnAt: number,
  dangerAt: number,
  reverse = false,
): InsightTone {
  if (value == null) return 'warn';
  if (reverse) {
    if (value <= dangerAt) return 'danger';
    if (value <= warnAt) return 'warn';
    return 'stable';
  }
  if (value >= dangerAt) return 'danger';
  if (value >= warnAt) return 'warn';
  return 'stable';
}

function interpolatePenalty(value: number | null, curve: CurvePoint[], fallback = 12.5): number {
  if (value == null || !Number.isFinite(value) || curve.length === 0) return fallback;
  const sorted = [...curve].sort((a, b) => a.x - b.x);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return fallback;
  if (value <= first.x) return first.y;
  if (value >= last.x) return last.y;

  for (let i = 0; i < sorted.length - 1; i++) {
    const left = sorted[i];
    const right = sorted[i + 1];
    if (!left || !right) continue;
    if (value >= left.x && value <= right.x) {
      const range = right.x - left.x;
      if (range <= 0) return left.y;
      const t = (value - left.x) / range;
      return left.y + (right.y - left.y) * t;
    }
  }

  return fallback;
}

const chartRows = computed(() => {
  const chart = store.byCategoryChart;
  return chart.keys.map((key, index) => ({
    key,
    label: categoryLabelMap.get(key) ?? key,
    assets: Math.max(0, chart.assets[index] ?? 0),
    liabilities: Math.max(0, chart.liabilities[index] ?? 0),
  }));
});

const assetsValue = computed(() => Math.max(0, toNumber(store.summary?.total_assets)));
const liabilitiesValue = computed(() => Math.max(0, toNumber(store.summary?.total_liabilities)));
const netWorthValue = computed(() => toNumber(store.summary?.net_worth));
const backedDebtValue = computed(() =>
  Math.max(0, toNumber(summaryExtended.value?.liabilities_asset_backed)),
);
const unbackedDebtValue = computed(() =>
  Math.max(0, toNumber(summaryExtended.value?.liabilities_unbacked)),
);

const debtRatioValue = computed(() =>
  assetsValue.value > 0 ? liabilitiesValue.value / assetsValue.value : null,
);
const equityRatioValue = computed(() =>
  assetsValue.value > 0 ? netWorthValue.value / assetsValue.value : null,
);

const liquidityAssetsValue = computed(() => {
  const row = chartRows.value.find((item) => item.label.toLowerCase() === 'liquidez');
  return row ? row.assets : 0;
});

const liquidityToDebtRatioValue = computed(() =>
  liabilitiesValue.value > 0 ? liquidityAssetsValue.value / liabilitiesValue.value : null,
);

const topAssetCategoryValue = computed(
  () => chartRows.value.filter((row) => row.assets > 0).sort((a, b) => b.assets - a.assets)[0],
);

const assetConcentrationValue = computed(() => {
  if (assetsValue.value <= 0 || !topAssetCategoryValue.value) return null;
  return topAssetCategoryValue.value.assets / assetsValue.value;
});

const unbackedDebtShareValue = computed(() =>
  liabilitiesValue.value > 0 ? unbackedDebtValue.value / liabilitiesValue.value : null,
);

const scorePenaltiesValue = computed(() => ({
  leverage: interpolatePenalty(debtRatioValue.value, [
    { x: 0, y: 0 },
    { x: 0.2, y: 0 },
    { x: 0.4, y: 6.7 },
    { x: 0.6, y: 15 },
    { x: 0.8, y: 25 },
    { x: 1.2, y: 25 },
  ]),
  unbacked: interpolatePenalty(unbackedDebtShareValue.value, [
    { x: 0, y: 0 },
    { x: 0.05, y: 0 },
    { x: 0.15, y: 7.5 },
    { x: 0.3, y: 17.5 },
    { x: 0.5, y: 25 },
    { x: 1, y: 25 },
  ]),
  concentration: interpolatePenalty(assetConcentrationValue.value, [
    { x: 0, y: 0 },
    { x: 0.35, y: 0 },
    { x: 0.5, y: 6.25 },
    { x: 0.7, y: 15 },
    { x: 0.85, y: 22.5 },
    { x: 1, y: 25 },
  ]),
  liquidity: interpolatePenalty(liquidityToDebtRatioValue.value, [
    { x: 0, y: 25 },
    { x: 0.25, y: 22.5 },
    { x: 0.5, y: 15 },
    { x: 0.8, y: 7.5 },
    { x: 1.2, y: 0 },
    { x: 2, y: 0 },
  ]),
}));

const healthScoreValue = computed(() => {
  const totalPenalty =
    scorePenaltiesValue.value.leverage +
    scorePenaltiesValue.value.unbacked +
    scorePenaltiesValue.value.concentration +
    scorePenaltiesValue.value.liquidity;
  return Math.max(0, Math.min(100, 100 - totalPenalty));
});

function healthToneFromScore(score: number) {
  if (score <= 20) return 'critico';
  if (score <= 40) return 'alto';
  if (score <= 60) return 'medio';
  if (score <= 80) return 'bajo';
  return 'solido';
}

const healthToneValue = computed(() => healthToneFromScore(healthScoreValue.value));

const healthLabelValue = computed(() => {
  if (healthToneValue.value === 'critico') return 'Riesgo patrimonial critico';
  if (healthToneValue.value === 'alto') return 'Riesgo patrimonial alto';
  if (healthToneValue.value === 'medio') return 'Riesgo patrimonial medio';
  if (healthToneValue.value === 'bajo') return 'Riesgo patrimonial bajo';
  return 'Patrimonio solido';
});

const riskDimensions = computed<
  { id: string; label: string; value: string; tone: InsightTone; hint: string }[]
>(() => [
  {
    id: 'debt',
    label: 'Apalancamiento',
    value: formatPct(debtRatioValue.value, 0),
    tone: toneByThreshold(debtRatioValue.value, 0.4, 0.65),
    hint: 'Pasivo sobre activo total',
  },
  {
    id: 'unbacked',
    label: 'Deuda sin respaldo',
    value: formatPct(unbackedDebtShareValue.value, 0),
    tone: toneByThreshold(unbackedDebtShareValue.value, 0.1, 0.35),
    hint: 'Pasivo no ligado a activos',
  },
  {
    id: 'concentration',
    label: 'Concentracion activo',
    value: formatPct(assetConcentrationValue.value, 0),
    tone: toneByThreshold(assetConcentrationValue.value, 0.7, 0.85),
    hint: topAssetCategoryValue.value?.label ?? 'Sin categoria dominante',
  },
  {
    id: 'liquidity',
    label: 'Cobertura liquidez',
    value: formatPct(liquidityToDebtRatioValue.value, 0),
    tone: toneByThreshold(liquidityToDebtRatioValue.value, 0.6, 0.35, true),
    hint: 'Liquidez / pasivo total',
  },
]);

function maybeLoadNetWorthContext() {
  if (!isNetWorthHealthPhase.value) return;
  void store.fetchSettings();
  void store.refreshAll();
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
      <div class="ui-guide-phase-back-wrap">
        <RouterLink class="ui-guide-back-link" to="/inicio">Volver a Guia</RouterLink>
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

    <section v-else class="card ui-pro-panel ui-guide-risk-panel">
      <div class="ui-guide-risk-top">
        <div class="ui-guide-health-badge" :class="`ui-guide-health-${healthToneValue}`">
          {{ healthLabelValue }}
        </div>

        <div class="ui-guide-risk-score-wrap">
          <div class="ui-guide-risk-score-label">Score de balance</div>
          <div class="ui-guide-risk-score-value">{{ formatNumber(healthScoreValue, 0) }}/100</div>
        </div>

        <div class="ui-guide-health-copy">
          <strong>Diagnostico:</strong> estado actual del balance por apalancamiento, respaldo de
          deuda, concentracion y liquidez.
        </div>
      </div>

      <div class="ui-guide-risk-meter" :class="`ui-guide-risk-meter-${healthToneValue}`">
        <span class="ui-guide-risk-meter-fill" :style="{ width: `${healthScoreValue}%` }"></span>
      </div>

      <div class="ui-guide-dimensions-grid">
        <article
          v-for="dimension in riskDimensions"
          :key="dimension.id"
          class="ui-guide-dimension"
          :class="`ui-guide-dimension-${dimension.tone}`"
        >
          <div class="ui-guide-dimension-head">
            <span>{{ dimension.label }}</span>
            <strong>{{ dimension.value }}</strong>
          </div>
          <div class="ui-guide-dimension-hint">{{ dimension.hint }}</div>
        </article>
      </div>

      <div class="ui-guide-summary-grid">
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Patrimonio neto</div>
          <div class="ui-guide-summary-value">{{ formatNumber(netWorthValue, 2) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Capital propio / activos</div>
          <div class="ui-guide-summary-value">{{ formatPct(equityRatioValue, 0) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Deuda sin respaldo</div>
          <div class="ui-guide-summary-value">{{ formatNumber(unbackedDebtValue, 2) }}</div>
        </article>
        <article class="ui-guide-summary-card">
          <div class="ui-guide-summary-label">Deuda con respaldo</div>
          <div class="ui-guide-summary-value">{{ formatNumber(backedDebtValue, 2) }}</div>
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

.ui-guide-phase-back-wrap {
  margin-bottom: 2px;
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

.ui-guide-risk-panel {
  padding: 16px;
}

.ui-guide-risk-top {
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

.ui-guide-health-solido {
  background: rgba(74, 222, 128, 0.16);
  color: rgba(134, 239, 172, 0.95);
}

.ui-guide-health-bajo {
  background: rgba(163, 230, 53, 0.18);
  color: rgba(190, 242, 100, 0.95);
}

.ui-guide-health-medio {
  background: rgba(250, 204, 21, 0.16);
  color: rgba(253, 224, 71, 0.95);
}

.ui-guide-health-alto {
  background: rgba(251, 146, 60, 0.18);
  color: rgba(251, 191, 36, 0.95);
}

.ui-guide-health-critico {
  background: rgba(251, 113, 133, 0.16);
  color: rgba(251, 113, 133, 0.95);
}

.ui-guide-risk-score-wrap {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 11px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
}

.ui-guide-risk-score-label {
  font-size: 11px;
  color: var(--muted);
}

.ui-guide-risk-score-value {
  margin-top: 1px;
  font-size: 20px;
  font-weight: 700;
}

.ui-guide-health-copy {
  font-size: 14px;
  color: var(--muted);
}

.ui-guide-risk-meter {
  margin-top: 12px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.ui-guide-risk-meter-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(74, 222, 128, 0.95), rgba(45, 212, 191, 0.95));
}

.ui-guide-risk-meter-bajo .ui-guide-risk-meter-fill {
  background: linear-gradient(90deg, rgba(132, 204, 22, 0.95), rgba(163, 230, 53, 0.95));
}

.ui-guide-risk-meter-medio .ui-guide-risk-meter-fill {
  background: linear-gradient(90deg, rgba(250, 204, 21, 0.95), rgba(251, 191, 36, 0.95));
}

.ui-guide-risk-meter-alto .ui-guide-risk-meter-fill {
  background: linear-gradient(90deg, rgba(251, 146, 60, 0.95), rgba(249, 115, 22, 0.95));
}

.ui-guide-risk-meter-critico .ui-guide-risk-meter-fill {
  background: linear-gradient(90deg, rgba(251, 113, 133, 0.95), rgba(244, 63, 94, 0.95));
}

.ui-guide-dimensions-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.ui-guide-dimension {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 11px;
}

.ui-guide-dimension-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
}

.ui-guide-dimension-head strong {
  font-size: 15px;
}

.ui-guide-dimension-hint {
  margin-top: 4px;
  font-size: 12px;
  color: var(--muted);
}

.ui-guide-dimension-stable {
  border-color: rgba(74, 222, 128, 0.28);
}

.ui-guide-dimension-warn {
  border-color: rgba(250, 204, 21, 0.34);
}

.ui-guide-dimension-danger {
  border-color: rgba(251, 113, 133, 0.36);
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

@media (max-width: 1024px) {
  .ui-guide-dimensions-grid,
  .ui-guide-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .ui-guide-risk-top {
    grid-template-columns: 1fr;
  }

  .ui-guide-dimensions-grid,
  .ui-guide-summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
