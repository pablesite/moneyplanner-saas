<script setup lang="ts">
import { computed, ref } from 'vue';
import { BaseModal } from '@/domains/ui';
import {
  NetWorthDonut,
  NetWorthTimelineChart,
  SettingsPopover,
  useNetWorthViewState,
} from '@/domains/net-worth';

const {
  store,
  valueMode,
  currencies,
  assetCategories,
  liabilityCategories,
  prettyError,
  canShowReal,
  confirmDeleteSnapshot,
  formatMoney,
  unitLabel,
  modeLabel,
  realBaseLabel,
  summaryAssets,
  summaryLiabilities,
  summaryNetWorth,
  byCategoryKeys,
  byCategoryLabels,
  byCategoryAssets,
  byCategoryLiabilities,
  summaryAssetBackedLiabilities,
  summaryUnbackedLiabilities,
} = useNetWorthViewState();

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

const assetsValue = computed(() => Math.max(0, toNumber(summaryAssets.value)));
const liabilitiesValue = computed(() => Math.max(0, toNumber(summaryLiabilities.value)));
const netWorthValue = computed(() => toNumber(summaryNetWorth.value));
const backedDebtValue = computed(() => Math.max(0, toNumber(summaryAssetBackedLiabilities.value)));
const unbackedDebtValue = computed(() => Math.max(0, toNumber(summaryUnbackedLiabilities.value)));

const debtRatioValue = computed(() =>
  assetsValue.value > 0 ? liabilitiesValue.value / assetsValue.value : null,
);
const equityRatioValue = computed(() =>
  assetsValue.value > 0 ? netWorthValue.value / assetsValue.value : null,
);

const liquidityAssetsValue = computed(() => {
  const liquidityCategoryIndex = byCategoryLabels.value.findIndex(
    (label) => label.toLowerCase() === 'liquidez',
  );
  if (liquidityCategoryIndex < 0) return 0;
  return Math.max(0, byCategoryAssets.value[liquidityCategoryIndex] ?? 0);
});

const liquidityToDebtRatioValue = computed(() =>
  liabilitiesValue.value > 0 ? liquidityAssetsValue.value / liabilitiesValue.value : null,
);

const analysis = computed(() => ({
  assets: assetsValue.value,
  liabilities: liabilitiesValue.value,
  netWorth: netWorthValue.value,
  backedDebt: backedDebtValue.value,
  unbackedDebt: unbackedDebtValue.value,
  debtRatio: debtRatioValue.value,
  equityRatio: equityRatioValue.value,
  liquidityAssets: liquidityAssetsValue.value,
  liquidityToDebtRatio: liquidityToDebtRatioValue.value,
}));

const selectedTimelineCategory = ref<string | null>(null);
const selectedTimelineCategoryType = ref<'asset' | 'liability'>('asset');
const selectedPositionType = ref<'asset' | 'liability' | null>(null);
const selectedPositionId = ref<number | null>(null);
const timelineExpanded = ref(false);
const selectedTimelinePreset = ref<'1m' | '3m' | '6m' | '1a' | 'all'>('all');
const customTimelineWindow = ref<{ start: number; end: number } | null>(null);
const timelinePresetOptions = ['1m', '3m', '6m', '1a', 'all'] as const;

type TimelinePoint = {
  date: string;
  label: string;
  shortLabel: string;
  fullLabel: string;
  netWorth: number;
  assets: number;
  liabilities: number;
};

type TimelineCategoryOption = {
  value: string | null;
  label: string;
  type: 'asset' | 'liability';
};

const timelineCategoryOptions = computed<TimelineCategoryOption[]>(() => [
  { value: null, label: 'Todo patrimonio', type: 'asset' },
  ...assetCategories.map((category) => ({
    value: category.value,
    label: category.label,
    type: 'asset' as const,
  })),
  ...liabilityCategories.map((category) => ({
    value: category.value,
    label: `Pasivos · ${category.label}`,
    type: 'liability' as const,
  })),
]);

const timelineRows = computed<TimelinePoint[]>(() =>
  (store.timeline?.rows ?? []).map((row) => ({
    date: row.date,
    label: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(
      new Date(row.date),
    ),
    shortLabel: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(
      new Date(row.date),
    ),
    fullLabel: new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
      new Date(row.date),
    ),
    netWorth: toNumber(row.net_worth),
    assets: toNumber(row.total_assets),
    liabilities: toNumber(row.total_liabilities),
  })),
);

const timelineMetric = computed<'net_worth' | 'assets' | 'liabilities'>(() => {
  if (!selectedTimelineCategory.value) return 'net_worth';
  return selectedTimelineCategoryType.value === 'liability' ? 'liabilities' : 'assets';
});

function getTimelineMetricValue(row: TimelinePoint): number {
  if (timelineMetric.value === 'assets') return row.assets;
  if (timelineMetric.value === 'liabilities') return row.liabilities;
  return row.netWorth;
}

const timelineSummaryLabel = computed(() => {
  if (!selectedTimelineCategory.value) return 'Ultimo patrimonio neto';
  return selectedTimelineCategoryType.value === 'liability'
    ? 'Ultimo valor del pasivo'
    : 'Ultimo valor del activo';
});

const timelineDescription = computed(() => {
  if (!selectedTimelineCategory.value) {
    return 'Serie mensual del patrimonio neto calculada desde valoraciones, motores y eventos.';
  }
  if (selectedTimelineCategoryType.value === 'liability') {
    return 'Serie mensual del valor total de la categoria de pasivos seleccionada.';
  }
  return 'Serie mensual del valor total de la categoria de activos seleccionada.';
});

const timelinePresetPointCount: Record<(typeof timelinePresetOptions)[number], number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1a': 12,
  all: Number.POSITIVE_INFINITY,
};

const timelineDefaultWindow = computed(() => {
  const end = Math.max(0, timelineRows.value.length - 1);
  const count = timelinePresetPointCount[selectedTimelinePreset.value];
  if (!Number.isFinite(count)) return { start: 0, end };
  return { start: Math.max(0, end - count + 1), end };
});

const visibleTimelineWindow = computed(() => {
  const length = timelineRows.value.length;
  if (length === 0) return { start: 0, end: 0 };
  const source = customTimelineWindow.value ?? timelineDefaultWindow.value;
  const start = Math.min(Math.max(0, source.start), length - 1);
  const end = Math.min(Math.max(start, source.end), length - 1);
  return { start, end };
});

const visibleTimelineRows = computed(() =>
  timelineRows.value.slice(visibleTimelineWindow.value.start, visibleTimelineWindow.value.end + 1),
);

const visibleTimelineChartPoints = computed(() =>
  visibleTimelineRows.value.map((row) => ({
    date: row.date,
    shortLabel: row.shortLabel,
    fullLabel: row.fullLabel,
    value: getTimelineMetricValue(row),
  })),
);

const latestVisibleTimelinePoint = computed(
  () => visibleTimelineRows.value[visibleTimelineRows.value.length - 1] ?? null,
);

const latestTimelinePoint = computed(() => latestVisibleTimelinePoint.value);

const timelineVisibleRangeLabel = computed(() => {
  if (visibleTimelineRows.value.length === 0) return '-';
  const first = visibleTimelineRows.value[0];
  const last = visibleTimelineRows.value[visibleTimelineRows.value.length - 1];
  if (!first || !last) return '-';
  return `${first.fullLabel} - ${last.fullLabel}`;
});

const timelineSummaryMeta = computed(() => {
  const point = latestTimelinePoint.value;
  if (!point) return '-';
  if (timelineMetric.value === 'assets') {
    return `${point.label} · ${formatNumber(point.assets, 0)} ${store.timeline?.base_currency}`;
  }
  if (timelineMetric.value === 'liabilities') {
    return `${point.label} · ${formatNumber(point.liabilities, 0)} ${store.timeline?.base_currency}`;
  }
  return `${point.label} · Activos ${formatNumber(point.assets, 0)} · Pasivos ${formatNumber(
    point.liabilities,
    0,
  )}`;
});

const timelineSeriesColor = computed(() =>
  timelineMetric.value === 'liabilities' ? '#ff4d73' : '#4cc3ff',
);

type PositionRow = {
  id: number;
  type: 'asset' | 'liability';
  category: string;
  name: string;
  subtitle: string;
  value: number;
  currency: string;
};

type PositionTimelinePoint = {
  date: string;
  label: string;
  value: number;
};

type PositionActivityRow = {
  id: string;
  date: string;
  label: string;
  kind: 'valuation' | 'event';
  amount: number;
  meta: string;
  note: string;
};

function resolvePositionValue(item: {
  amount?: string | null;
  amount_base?: string | null;
  effective_amount?: string | null;
  estimated_outstanding_amount?: string | null;
  currency?: string | null;
}): { value: number; currency: string } {
  const baseCurrency = store.baseCurrency ?? store.summary?.base_currency ?? 'EUR';
  if (item.amount_base != null && String(item.amount_base).trim() !== '') {
    return { value: toNumber(item.amount_base), currency: baseCurrency };
  }
  if (item.effective_amount != null && String(item.effective_amount).trim() !== '') {
    return { value: toNumber(item.effective_amount), currency: item.currency ?? baseCurrency };
  }
  if (
    item.estimated_outstanding_amount != null &&
    String(item.estimated_outstanding_amount).trim() !== ''
  ) {
    return {
      value: toNumber(item.estimated_outstanding_amount),
      currency: item.currency ?? baseCurrency,
    };
  }
  return { value: toNumber(item.amount), currency: item.currency ?? baseCurrency };
}

const assetPositionRows = computed<PositionRow[]>(() =>
  store.assets
    .filter((asset) => asset.is_active !== false)
    .filter((asset) =>
      selectedTimelineCategory.value && selectedTimelineCategoryType.value === 'asset'
        ? asset.category === selectedTimelineCategory.value
        : true,
    )
    .map((asset) => {
      const resolved = resolvePositionValue(asset);
      return {
        id: asset.id,
        type: 'asset' as const,
        category: asset.category,
        name: asset.name,
        subtitle: [asset.category, asset.subcategory].filter(Boolean).join(' / '),
        value: resolved.value,
        currency: resolved.currency,
      };
    })
    .sort((a, b) => b.value - a.value),
);

const liabilityPositionRows = computed<PositionRow[]>(() =>
  store.liabilities
    .filter((liability) => liability.is_active !== false)
    .filter((liability) =>
      selectedTimelineCategory.value && selectedTimelineCategoryType.value === 'liability'
        ? liability.category === selectedTimelineCategory.value
        : true,
    )
    .map((liability) => {
      const resolved = resolvePositionValue(liability);
      return {
        id: liability.id,
        type: 'liability' as const,
        category: liability.category,
        name: liability.name,
        subtitle: liability.category || 'liability',
        value: resolved.value,
        currency: resolved.currency,
      };
    })
    .sort((a, b) => b.value - a.value),
);

const selectedPosition = computed(() => {
  const rows =
    selectedPositionType.value === 'liability'
      ? liabilityPositionRows.value
      : assetPositionRows.value;
  return rows.find((row) => row.id === selectedPositionId.value) ?? null;
});

const positionTimelineRows = computed<PositionTimelinePoint[]>(() =>
  (store.positionTimeline?.rows ?? []).map((row) => ({
    date: row.date,
    label: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(
      new Date(row.date),
    ),
    value: toNumber(row.value_base || row.value),
  })),
);

const positionTimelineRange = computed(() => {
  const values = positionTimelineRows.value.map((row) => row.value);
  if (!values.length) return { min: 0, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return { min: min - 1, max: max + 1 };
  return { min, max };
});

const positionTimelinePath = computed(() => {
  const rows = positionTimelineRows.value;
  if (rows.length < 2) return '';
  const { min, max } = positionTimelineRange.value;
  return rows
    .map((row, index) => {
      const x = (index / (rows.length - 1)) * 100;
      const normalized = (row.value - min) / (max - min);
      const y = 100 - normalized * 100;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
});

const latestPositionTimelinePoint = computed(
  () => positionTimelineRows.value[positionTimelineRows.value.length - 1] ?? null,
);

const positionActivityRows = computed<PositionActivityRow[]>(() => {
  if (selectedPositionType.value === 'asset') {
    const valuations = store.assetValuations.map((row) => ({
      id: `valuation-${row.id}`,
      date: row.valuation_date,
      label: 'Checkpoint',
      kind: 'valuation' as const,
      amount: toNumber(row.value),
      meta: row.source,
      note: row.note ?? '',
    }));
    const investmentEvents = store.investmentEvents.map((row) => ({
      id: `investment-${row.id}`,
      date: row.event_date,
      label: row.event_type,
      kind: 'event' as const,
      amount: toNumber(row.amount),
      meta:
        row.event_type === 'passive_income' && row.is_reinvested === false
          ? 'passive_income · no reinvertido'
          : row.event_type,
      note: row.note ?? '',
    }));
    const liquidityEvents = store.liquidityEvents.map((row) => ({
      id: `liquidity-${row.id}`,
      date: row.event_date,
      label: row.event_type,
      kind: 'event' as const,
      amount: toNumber(row.amount),
      meta: row.event_type,
      note: row.note ?? '',
    }));
    return [...valuations, ...investmentEvents, ...liquidityEvents].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }

  const valuations = store.liabilityValuations.map((row) => ({
    id: `valuation-${row.id}`,
    date: row.valuation_date,
    label: 'Checkpoint',
    kind: 'valuation' as const,
    amount: toNumber(row.value),
    meta: row.source,
    note: row.note ?? '',
  }));
  const events = store.liabilityEvents.map((row) => ({
    id: `liability-event-${row.id}`,
    date: row.event_date,
    label: row.event_type,
    kind: 'event' as const,
    amount: toNumber(row.amount),
    meta: row.event_type,
    note: row.note ?? '',
  }));
  return [...valuations, ...events].sort((a, b) => b.date.localeCompare(a.date));
});

async function applyTimelineCategoryFilter(
  category: string | null,
  categoryType: 'asset' | 'liability' = 'asset',
): Promise<void> {
  selectedTimelineCategory.value = category;
  selectedTimelineCategoryType.value = categoryType;
  selectedTimelinePreset.value = 'all';
  customTimelineWindow.value = null;
  if (
    selectedPositionType.value === 'asset' &&
    selectedPosition.value &&
    categoryType === 'asset' &&
    category &&
    !assetPositionRows.value.some((row) => row.id === selectedPosition.value?.id)
  ) {
    selectedPositionType.value = null;
    selectedPositionId.value = null;
    store.positionTimeline = null;
    store.assetValuations = [];
    store.liabilityValuations = [];
    store.investmentEvents = [];
    store.liquidityEvents = [];
    store.liabilityEvents = [];
  }
  if (
    selectedPositionType.value === 'liability' &&
    selectedPosition.value &&
    categoryType === 'liability' &&
    category &&
    !liabilityPositionRows.value.some((row) => row.id === selectedPosition.value?.id)
  ) {
    selectedPositionType.value = null;
    selectedPositionId.value = null;
    store.positionTimeline = null;
    store.assetValuations = [];
    store.liabilityValuations = [];
    store.investmentEvents = [];
    store.liquidityEvents = [];
    store.liabilityEvents = [];
  }
  await store.fetchTimeline(category, categoryType);
}

async function applyCompositionCategoryFilter(payload: {
  key: string;
  type: 'asset' | 'liability';
}): Promise<void> {
  await applyTimelineCategoryFilter(payload.key, payload.type);
}

async function selectPosition(row: PositionRow): Promise<void> {
  selectedPositionType.value = row.type;
  selectedPositionId.value = row.id;
  await Promise.all([
    store.fetchPositionTimeline(row.type, row.id),
    store.fetchPositionActivity(row.type, row.id, row.type === 'asset' ? row.category : null),
  ]);
}

function setTimelinePreset(preset: (typeof timelinePresetOptions)[number]): void {
  selectedTimelinePreset.value = preset;
  customTimelineWindow.value = null;
}

function updateTimelineWindowStart(rawValue: string): void {
  const nextStart = Number(rawValue);
  const currentEnd = visibleTimelineWindow.value.end;
  customTimelineWindow.value = {
    start: Math.min(nextStart, currentEnd),
    end: currentEnd,
  };
}

function updateTimelineWindowEnd(rawValue: string): void {
  const nextEnd = Number(rawValue);
  const currentStart = visibleTimelineWindow.value.start;
  customTimelineWindow.value = {
    start: currentStart,
    end: Math.max(currentStart, nextEnd),
  };
}
</script>

<template>
  <div class="container ui-pro-page relative">
    <section class="card ui-pro-panel grid gap-2.5 mb-2">
      <p class="ui-pro-kicker">Patrimonio</p>
      <div class="mt-1 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="store.loading"
            aria-label="Refrescar"
            @click="store.refreshAll()"
          >
            <span class="icon" aria-hidden="true">&#8635;</span>
          </button>
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="store.loading"
            aria-label="Guardar snapshot"
            title="Guardar snapshot"
            @click="store.createTodaySnapshot()"
          >
            <span class="icon" aria-hidden="true">&#128190;</span>
          </button>
        </div>

        <div class="ui-pro-toolbar">
          <SettingsPopover
            :loading="store.loading"
            :base-currency="store.baseCurrency ?? 'EUR'"
            :currencies="currencies"
            :value-mode="valueMode"
            :can-show-real="canShowReal()"
            :mode-help="modeLabel()"
            :real-base-label="realBaseLabel"
            :show-refresh="false"
            :show-snapshot="false"
            :icon-only="true"
            @update:base-currency="store.updateBaseCurrency"
            @update:value-mode="(v) => (valueMode = v)"
            @snapshot="store.createTodaySnapshot()"
            @refresh="store.refreshAll()"
          />
        </div>
      </div>

      <div class="ui-nw-balance-kpi-grid mt-2">
        <article class="ui-nw-balance-kpi ui-nw-balance-kpi-main">
          <div class="ui-nw-kpi-label">Patrimonio neto</div>
          <div class="ui-nw-kpi-value">
            {{ formatNumber(analysis.netWorth, 2) }} {{ unitLabel() }}
          </div>
          <div class="ui-nw-kpi-sub">
            Capital propio sobre activos: <strong>{{ formatPct(analysis.equityRatio, 0) }}</strong>
          </div>

          <div class="ui-nw-kpi-inline-grid">
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Activos</div>
              <div class="ui-nw-kpi-inline-value">
                {{ formatNumber(analysis.assets, 2) }} {{ unitLabel() }}
              </div>
            </div>
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Pasivos</div>
              <div class="ui-nw-kpi-inline-value">
                {{ formatNumber(analysis.liabilities, 2) }} {{ unitLabel() }}
              </div>
            </div>
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Ratio deuda / activos</div>
              <div class="ui-nw-kpi-inline-value">{{ formatPct(analysis.debtRatio, 0) }}</div>
            </div>
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Liquidez</div>
              <div class="ui-nw-kpi-inline-value">
                {{ formatNumber(analysis.liquidityAssets, 2) }} {{ unitLabel() }}
              </div>
              <div class="ui-nw-kpi-inline-meta">
                Cobertura: <strong>{{ formatPct(analysis.liquidityToDebtRatio, 0) }}</strong>
              </div>
            </div>
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Deuda sin respaldo</div>
              <div class="ui-nw-kpi-inline-value">
                {{ formatNumber(analysis.unbackedDebt, 2) }} {{ unitLabel() }}
              </div>
              <div class="ui-nw-kpi-inline-meta">
                {{
                  formatPct(
                    analysis.liabilities > 0 ? analysis.unbackedDebt / analysis.liabilities : null,
                    0,
                  )
                }}
                del pasivo
              </div>
            </div>
            <div class="ui-nw-kpi-inline">
              <div class="ui-nw-kpi-inline-label">Deuda con respaldo</div>
              <div class="ui-nw-kpi-inline-value">
                {{ formatNumber(analysis.backedDebt, 2) }} {{ unitLabel() }}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <div v-if="store.error" class="alert mt-3">
      {{ prettyError() }}
    </div>

    <div class="card ui-pro-panel ui-nw-balance-panel section">
      <div class="ui-pro-divider mt-4">
        <NetWorthDonut
          :total-assets="summaryAssets"
          :total-liabilities="summaryLiabilities"
          :asset-backed-liabilities="summaryAssetBackedLiabilities"
          :unbacked-liabilities="summaryUnbackedLiabilities"
          :net-worth="summaryNetWorth"
          :unit="unitLabel()"
          :category-keys="byCategoryKeys"
          :category-labels="byCategoryLabels"
          :category-assets="byCategoryAssets"
          :category-liabilities="byCategoryLiabilities"
          @select-category="applyCompositionCategoryFilter"
        />
      </div>
    </div>

    <section class="section card ui-pro-panel ui-nw-timeline-panel">
      <div class="ui-nw-timeline-head">
        <div>
          <h2 class="mt-0 text-base ui-nw-timeline-title">Evolucion temporal</h2>
          <p class="ui-nw-timeline-copy">{{ timelineDescription }}</p>
        </div>
        <div class="ui-nw-timeline-filters">
          <button
            v-for="option in timelineCategoryOptions"
            :key="`${option.type}-${option.value ?? 'all'}`"
            class="ui-nw-timeline-filter"
            :class="{
              'ui-nw-timeline-filter-active':
                selectedTimelineCategory === option.value &&
                (option.value === null || selectedTimelineCategoryType === option.type),
            }"
            type="button"
            @click="applyTimelineCategoryFilter(option.value, option.type)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div v-if="store.timelineLoading" class="subtle">Cargando evolucion...</div>
      <div v-else-if="timelineRows.length === 0" class="subtle">
        Aun no hay datos suficientes para construir la serie temporal.
      </div>
      <div v-else class="ui-nw-timeline-body">
        <div class="ui-nw-timeline-summary">
          <div class="ui-nw-timeline-summary-label">{{ timelineSummaryLabel }}</div>
          <div class="ui-nw-timeline-summary-value">
            {{
              formatNumber(
                latestVisibleTimelinePoint ? getTimelineMetricValue(latestVisibleTimelinePoint) : 0,
                2,
              )
            }}
            {{ store.timeline?.base_currency }}
          </div>
          <div class="ui-nw-timeline-summary-meta">{{ timelineSummaryMeta }}</div>
        </div>

        <div class="ui-nw-timeline-toolbar">
          <div class="ui-nw-timeline-range-group" role="group" aria-label="Rango temporal">
            <button
              v-for="preset in timelinePresetOptions"
              :key="preset"
              class="ui-nw-timeline-range-button"
              :class="{
                'ui-nw-timeline-range-button-active':
                  customTimelineWindow === null && selectedTimelinePreset === preset,
              }"
              type="button"
              @click="setTimelinePreset(preset)"
            >
              {{ preset }}
            </button>
          </div>

          <div class="ui-nw-timeline-toolbar-actions">
            <span class="ui-nw-timeline-range-caption">{{ timelineVisibleRangeLabel }}</span>
            <button
              class="ui-nw-timeline-expand-button"
              type="button"
              @click="timelineExpanded = true"
            >
              Expandir
            </button>
          </div>
        </div>

        <div class="ui-nw-timeline-chart-shell">
          <NetWorthTimelineChart
            :points="visibleTimelineChartPoints"
            :unit="store.timeline?.base_currency ?? unitLabel()"
            :series-label="timelineSummaryLabel"
            :series-color="timelineSeriesColor"
          />
        </div>

        <div class="ui-nw-timeline-points">
          <div
            v-for="row in visibleTimelineRows.slice(-6)"
            :key="row.date"
            class="ui-nw-timeline-point"
          >
            <span>{{ row.shortLabel }}</span>
            <strong>{{ formatNumber(getTimelineMetricValue(row), 0) }}</strong>
          </div>
        </div>
      </div>
    </section>

    <BaseModal
      :open="timelineExpanded"
      title="Evolucion temporal"
      panel-class="max-w-[1080px]"
      @close="timelineExpanded = false"
    >
      <div class="ui-nw-timeline-modal">
        <div class="ui-nw-timeline-modal-head">
          <div>
            <div class="ui-nw-timeline-modal-title">{{ timelineSummaryLabel }}</div>
            <div class="ui-nw-timeline-modal-copy">{{ timelineVisibleRangeLabel }}</div>
          </div>
          <div class="ui-nw-timeline-modal-value">
            {{
              formatNumber(
                latestVisibleTimelinePoint ? getTimelineMetricValue(latestVisibleTimelinePoint) : 0,
                2,
              )
            }}
            {{ store.timeline?.base_currency }}
          </div>
        </div>

        <div class="ui-nw-timeline-modal-ranges">
          <label class="ui-nw-timeline-slider-group">
            <span>Inicio</span>
            <input
              class="ui-nw-timeline-slider"
              type="range"
              min="0"
              :max="Math.max(0, timelineRows.length - 1)"
              :value="visibleTimelineWindow.start"
              @input="updateTimelineWindowStart(($event.target as HTMLInputElement).value)"
            />
            <strong>{{ visibleTimelineRows[0]?.fullLabel ?? '-' }}</strong>
          </label>

          <label class="ui-nw-timeline-slider-group">
            <span>Fin</span>
            <input
              class="ui-nw-timeline-slider"
              type="range"
              min="0"
              :max="Math.max(0, timelineRows.length - 1)"
              :value="visibleTimelineWindow.end"
              @input="updateTimelineWindowEnd(($event.target as HTMLInputElement).value)"
            />
            <strong>{{ latestVisibleTimelinePoint?.fullLabel ?? '-' }}</strong>
          </label>
        </div>

        <NetWorthTimelineChart
          :points="visibleTimelineChartPoints"
          :unit="store.timeline?.base_currency ?? unitLabel()"
          :series-label="timelineSummaryLabel"
          :series-color="timelineSeriesColor"
          expanded
        />
      </div>
    </BaseModal>

    <section class="section card ui-pro-panel ui-nw-drilldown-panel">
      <div class="ui-nw-drilldown-head">
        <div>
          <h2 class="mt-0 text-base">Detalle por posicion</h2>
          <p class="ui-nw-drilldown-copy">
            Selecciona un activo o pasivo para ver su evolucion mensual por separado.
          </p>
        </div>
      </div>

      <div class="ui-nw-drilldown-grid">
        <div class="ui-nw-position-column">
          <div class="ui-nw-position-column-head">
            <h3 class="ui-nw-position-column-title">Activos</h3>
            <span class="ui-nw-position-column-meta"
              >{{ assetPositionRows.length }} posiciones</span
            >
          </div>
          <div v-if="assetPositionRows.length === 0" class="subtle">
            No hay activos para este filtro.
          </div>
          <div v-else class="ui-nw-position-list">
            <button
              v-for="row in assetPositionRows.slice(0, 8)"
              :key="`asset-${row.id}`"
              class="ui-nw-position-button"
              :class="{
                'ui-nw-position-button-active':
                  selectedPositionType === 'asset' && selectedPositionId === row.id,
              }"
              type="button"
              @click="selectPosition(row)"
            >
              <span class="ui-nw-position-button-main">
                <strong>{{ row.name }}</strong>
                <span>{{ row.subtitle }}</span>
              </span>
              <span class="ui-nw-position-button-value">
                {{ formatNumber(row.value, 2) }} {{ row.currency }}
              </span>
            </button>
          </div>
        </div>

        <div class="ui-nw-position-column">
          <div class="ui-nw-position-column-head">
            <h3 class="ui-nw-position-column-title">Pasivos</h3>
            <span class="ui-nw-position-column-meta"
              >{{ liabilityPositionRows.length }} posiciones</span
            >
          </div>
          <div v-if="liabilityPositionRows.length === 0" class="subtle">
            No hay pasivos activos.
          </div>
          <div v-else class="ui-nw-position-list">
            <button
              v-for="row in liabilityPositionRows.slice(0, 8)"
              :key="`liability-${row.id}`"
              class="ui-nw-position-button"
              :class="{
                'ui-nw-position-button-active':
                  selectedPositionType === 'liability' && selectedPositionId === row.id,
              }"
              type="button"
              @click="selectPosition(row)"
            >
              <span class="ui-nw-position-button-main">
                <strong>{{ row.name }}</strong>
                <span>{{ row.subtitle }}</span>
              </span>
              <span class="ui-nw-position-button-value">
                {{ formatNumber(row.value, 2) }} {{ row.currency }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="ui-nw-position-detail">
        <div v-if="store.positionTimelineLoading" class="subtle">
          Cargando evolucion de la posicion...
        </div>
        <div v-else-if="!selectedPosition" class="subtle">
          Elige una posicion para inspeccionar su curva temporal.
        </div>
        <div v-else-if="positionTimelineRows.length === 0" class="subtle">
          Esta posicion aun no tiene suficientes puntos para construir una serie mensual.
        </div>
        <div v-else class="ui-nw-position-detail-body">
          <div class="ui-nw-position-detail-summary">
            <div class="ui-nw-position-detail-label">
              {{
                selectedPosition.type === 'asset' ? 'Activo seleccionado' : 'Pasivo seleccionado'
              }}
            </div>
            <div class="ui-nw-position-detail-title">{{ selectedPosition.name }}</div>
            <div class="ui-nw-position-detail-meta">
              {{ selectedPosition.subtitle }} | Ultimo valor
              {{ formatNumber(latestPositionTimelinePoint?.value ?? 0, 2) }}
              {{ store.positionTimeline?.base_currency ?? selectedPosition.currency }}
            </div>
          </div>

          <div class="ui-nw-position-detail-chart-shell">
            <svg
              class="ui-nw-position-detail-chart"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-label="Grafico de evolucion de la posicion"
            >
              <path
                class="ui-nw-position-detail-grid"
                d="M 0 20 L 100 20 M 0 50 L 100 50 M 0 80 L 100 80"
              />
              <path
                v-if="positionTimelinePath"
                class="ui-nw-position-detail-line"
                :d="positionTimelinePath"
              />
            </svg>
          </div>

          <div class="ui-nw-position-detail-points">
            <div
              v-for="row in positionTimelineRows.slice(-6)"
              :key="`${selectedPosition.type}-${selectedPosition.id}-${row.date}`"
              class="ui-nw-position-detail-point"
            >
              <span>{{ row.label }}</span>
              <strong>{{ formatNumber(row.value, 0) }}</strong>
            </div>
          </div>

          <div class="ui-nw-position-activity">
            <div class="ui-nw-position-activity-head">
              <h3 class="ui-nw-position-activity-title">Eventos y checkpoints</h3>
              <span v-if="store.positionActivityLoading" class="subtle">Cargando...</span>
            </div>
            <div v-if="positionActivityRows.length === 0" class="subtle">
              No hay eventos ni valoraciones manuales registrados para esta posicion.
            </div>
            <div v-else class="ui-nw-position-activity-list">
              <div
                v-for="row in positionActivityRows"
                :key="row.id"
                class="ui-nw-position-activity-row"
                :class="{
                  'ui-nw-position-activity-row-valuation': row.kind === 'valuation',
                }"
              >
                <div class="ui-nw-position-activity-main">
                  <strong>{{ row.date }}</strong>
                  <span>{{ row.label }} · {{ row.meta }}</span>
                  <span v-if="row.note">{{ row.note }}</span>
                </div>
                <div class="ui-nw-position-activity-amount">
                  {{ formatNumber(row.amount, 2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="section card ui-pro-panel">
      <h2 class="mt-0 text-base">Snapshots</h2>

      <ul v-if="store.snapshots.length" class="m-0 grid list-none gap-2 pl-0">
        <li v-for="s in store.snapshots" :key="s.id" class="ui-nw-snapshot-row">
          <div class="min-w-0">
            {{ s.snapshot_date }} - neto: {{ formatMoney(s.net_worth, 2) }} {{ s.base_currency }}
            <span class="subtle">
              (activos {{ formatMoney(s.total_assets, 2) }} {{ s.base_currency }}, pasivos
              {{ formatMoney(s.total_liabilities, 2) }} {{ s.base_currency }})
            </span>
          </div>
          <button
            class="icon-btn disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            :disabled="store.loading"
            aria-label="Eliminar snapshot"
            title="Eliminar snapshot"
            @click="confirmDeleteSnapshot(s.id)"
          >
            <span class="icon" aria-hidden="true">&#128465;</span>
          </button>
        </li>
      </ul>

      <div v-else class="subtle">No hay snapshots todavia.</div>
    </div>

    <div v-if="store.loading" class="ui-status-line">Cargando...</div>
  </div>
</template>

<style scoped>
.ui-nw-balance-panel {
  padding: 14px;
}

.ui-nw-balance-kpi-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.ui-nw-balance-kpi {
  grid-column: span 4;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-balance-kpi-main {
  grid-column: span 12;
  text-align: center;
  background:
    linear-gradient(90deg, rgba(45, 212, 191, 0.12), rgba(56, 189, 248, 0.08)),
    rgba(7, 14, 26, 0.92);
  border-color: rgba(45, 212, 191, 0.3);
}

.ui-nw-kpi-inline-grid {
  margin-top: 12px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.ui-nw-kpi-inline {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8px 6px;
  min-height: 96px;
}

.ui-nw-kpi-inline-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
}

.ui-nw-kpi-inline-value {
  margin-top: 3px;
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.ui-nw-kpi-inline-meta {
  margin-top: 3px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
}

.ui-nw-kpi-label {
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.ui-nw-kpi-value {
  margin-top: 6px;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 700;
}

.ui-nw-kpi-sub {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
}

.ui-nw-timeline-panel {
  display: grid;
  gap: 1rem;
}

.ui-nw-timeline-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.ui-nw-timeline-title {
  margin-bottom: 0.35rem;
}

.ui-nw-timeline-copy {
  margin: 0;
  color: var(--muted);
}

.ui-nw-timeline-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ui-nw-timeline-filter {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.85rem;
}

.ui-nw-timeline-filter-active {
  border-color: rgba(45, 212, 191, 0.4);
  background: rgba(45, 212, 191, 0.14);
  color: #fff;
}

.ui-nw-timeline-body {
  display: grid;
  gap: 1rem;
}

.ui-nw-timeline-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
}

.ui-nw-timeline-range-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.ui-nw-timeline-range-button,
.ui-nw-timeline-expand-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.82);
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;
}

.ui-nw-timeline-range-button:hover,
.ui-nw-timeline-expand-button:hover {
  border-color: rgba(76, 195, 255, 0.28);
  background: rgba(76, 195, 255, 0.12);
  color: #fff;
}

.ui-nw-timeline-range-button-active {
  border-color: rgba(76, 195, 255, 0.42);
  background: rgba(76, 195, 255, 0.18);
  color: #fff;
}

.ui-nw-timeline-toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.ui-nw-timeline-range-caption {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.ui-nw-timeline-summary {
  border: 1px solid rgba(45, 212, 191, 0.22);
  border-radius: 14px;
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(45, 212, 191, 0.14), transparent 38%),
    rgba(255, 255, 255, 0.02);
}

.ui-nw-timeline-summary-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.58);
}

.ui-nw-timeline-summary-value {
  margin-top: 5px;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 700;
}

.ui-nw-timeline-summary-meta {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
}

.ui-nw-timeline-chart-shell {
  border-radius: 14px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-timeline-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.75rem;
}

.ui-nw-timeline-point {
  display: grid;
  gap: 0.2rem;
  border-radius: 12px;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-timeline-point span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
}

.ui-nw-timeline-point strong {
  font-size: 1rem;
  color: #fff;
}

.ui-nw-timeline-modal {
  display: grid;
  gap: 1rem;
}

.ui-nw-timeline-modal-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 0.9rem;
}

.ui-nw-timeline-modal-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #fff;
}

.ui-nw-timeline-modal-copy {
  margin-top: 0.2rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.64);
}

.ui-nw-timeline-modal-value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
}

.ui-nw-timeline-modal-ranges {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.ui-nw-timeline-slider-group {
  display: grid;
  gap: 0.45rem;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.ui-nw-timeline-slider-group span {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.ui-nw-timeline-slider-group strong {
  font-size: 0.84rem;
  color: #fff;
}

.ui-nw-timeline-slider {
  width: 100%;
}

.ui-nw-drilldown-panel {
  display: grid;
  gap: 1rem;
}

.ui-nw-drilldown-copy {
  margin: 0;
  color: var(--muted);
}

.ui-nw-drilldown-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ui-nw-position-column {
  display: grid;
  gap: 0.85rem;
}

.ui-nw-position-column-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}

.ui-nw-position-column-title {
  margin: 0;
  font-size: 0.95rem;
}

.ui-nw-position-column-meta {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.56);
}

.ui-nw-position-list {
  display: grid;
  gap: 0.65rem;
}

.ui-nw-position-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  text-align: left;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  padding: 0.8rem 0.9rem;
  color: inherit;
}

.ui-nw-position-button-active {
  border-color: rgba(45, 212, 191, 0.42);
  background: rgba(45, 212, 191, 0.1);
}

.ui-nw-position-button-main {
  display: grid;
  gap: 0.18rem;
}

.ui-nw-position-button-main span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
}

.ui-nw-position-button-value {
  font-size: 0.92rem;
  font-weight: 700;
  white-space: nowrap;
}

.ui-nw-position-detail {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1rem;
}

.ui-nw-position-detail-body {
  display: grid;
  gap: 1rem;
}

.ui-nw-position-detail-summary {
  border-radius: 14px;
  border: 1px solid rgba(76, 195, 255, 0.22);
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(76, 195, 255, 0.14), transparent 38%),
    rgba(255, 255, 255, 0.02);
}

.ui-nw-position-detail-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.58);
}

.ui-nw-position-detail-title {
  margin-top: 0.3rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.ui-nw-position-detail-meta {
  margin-top: 0.35rem;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.68);
}

.ui-nw-position-detail-chart-shell {
  border-radius: 14px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-position-detail-chart {
  display: block;
  width: 100%;
  height: 180px;
}

.ui-nw-position-detail-grid {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 0.4;
  vector-effect: non-scaling-stroke;
}

.ui-nw-position-detail-line {
  fill: none;
  stroke: #2dd4bf;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.ui-nw-position-detail-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.75rem;
}

.ui-nw-position-detail-point {
  display: grid;
  gap: 0.2rem;
  border-radius: 12px;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-position-detail-point span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
}

.ui-nw-position-detail-point strong {
  font-size: 1rem;
  color: #fff;
}

.ui-nw-position-activity {
  display: grid;
  gap: 0.85rem;
}

.ui-nw-position-activity-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
}

.ui-nw-position-activity-title {
  margin: 0;
  font-size: 0.95rem;
}

.ui-nw-position-activity-list {
  display: grid;
  gap: 0.65rem;
}

.ui-nw-position-activity-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.ui-nw-position-activity-row-valuation {
  border-color: rgba(76, 195, 255, 0.22);
  background: rgba(76, 195, 255, 0.08);
}

.ui-nw-position-activity-main {
  display: grid;
  gap: 0.2rem;
}

.ui-nw-position-activity-main strong {
  font-size: 0.9rem;
}

.ui-nw-position-activity-main span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.62);
}

.ui-nw-position-activity-amount {
  font-size: 0.92rem;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .ui-nw-balance-kpi-main {
    grid-column: span 12;
    grid-row: auto;
  }

  .ui-nw-kpi-inline {
    grid-column: span 4;
  }

  .ui-nw-drilldown-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .ui-nw-balance-kpi,
  .ui-nw-balance-kpi-main {
    grid-column: span 12;
    grid-row: auto;
  }

  .ui-nw-kpi-inline {
    grid-column: span 12;
  }

  .ui-nw-kpi-value {
    font-size: 22px;
  }

  .ui-nw-timeline-summary-value {
    font-size: 24px;
  }

  .ui-nw-timeline-toolbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .ui-nw-timeline-modal-ranges {
    grid-template-columns: 1fr;
  }
}
</style>
