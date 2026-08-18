<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  PortfolioEvolutionChart,
  PortfolioImportModal,
  PortfolioOperationModal,
  PortfolioSetupModal,
  corePortfolioApi,
  freshnessLabel,
  instrumentMap,
  PORTFOLIO_MAX_COMPOSITION_SLICES,
  portfolioAssetClassColors,
  portfolioAssetClassLabels,
  positionBaseValue,
  returnLabel,
  usePortfolioStore,
  type PositionPerformance,
  type PortfolioQuery,
  type PortfolioOperationOptions,
  type PortfolioOperationType,
} from '@/domains/portfolio';
import '@/domains/portfolio/portfolio.css';
import {
  AButton,
  ADateRange,
  ADonut,
  AHero,
  AKpiBand,
  AMetaPill,
  APageHead,
  ASectHead,
  ASelect,
  AState,
  AToast,
  BaseModal,
  type ADonutSlice,
  type ASelectItem,
} from '@/domains/ui';
import { currencySymbol, formatAmount, formatMoney, formatPct, toNumber } from '@/lib/format';
import { dateToIso, formatShortMonthYear } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';

type PortfolioTab = 'summary' | 'positions' | 'evolution';
type PeriodPreset = '1m' | 'ytd' | '1y' | '3y' | 'all' | 'custom';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();

const validTabs: PortfolioTab[] = ['summary', 'positions', 'evolution'];
const validPeriods: PeriodPreset[] = ['1m', 'ytd', '1y', '3y', 'all', 'custom'];
const activeTab = ref<PortfolioTab>(
  validTabs.includes(route.query.tab as PortfolioTab)
    ? (route.query.tab as PortfolioTab)
    : 'summary',
);
const period = ref<PeriodPreset>(
  validPeriods.includes(route.query.period as PeriodPreset)
    ? (route.query.period as PeriodPreset)
    : '1y',
);
const memberId = ref(String(route.query.member ?? 'all'));
const containerId = ref(String(route.query.container ?? 'all'));
const assetClass = ref(String(route.query.class ?? 'all'));
const currency = ref(String(route.query.currency ?? 'all'));
const customFrom = ref(String(route.query.from ?? ''));
const customTo = ref(String(route.query.to ?? dateToIso(new Date())));
const selectedPosition = ref<PositionPerformance | null>(null);
const operationOptionsData = ref<PortfolioOperationOptions | null>(null);
const operationOpen = ref(false);
const importOpen = ref(false);
const setupOpen = ref(false);
const operationPositionId = ref<number | null>(null);
const operationType = ref<PortfolioOperationType>('buy');
const reviewOnly = ref(false);
const successMessage = ref<string | null>(null);
const resyncing = ref(false);
const actionError = ref<string | null>(null);
const showArchivedModal = ref(false);
const returnTo =
  typeof route.query.return === 'string' &&
  route.query.return.startsWith('/') &&
  !route.query.return.startsWith('/cartera')
    ? route.query.return
    : '/patrimonio';

const today = computed(() => new Date());

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

const query = computed<PortfolioQuery>(() => {
  const result: PortfolioQuery = {};
  if (memberId.value !== 'all') result.member_id = Number(memberId.value);
  if (period.value === 'all') return result;
  if (period.value === 'custom') {
    if (customFrom.value) result.date_from = customFrom.value;
    if (customTo.value) result.date_to = customTo.value;
    return result;
  }
  result.date_to = dateToIso(today.value);
  if (period.value === 'ytd') result.date_from = `${today.value.getFullYear()}-01-01`;
  if (period.value === '1m') result.date_from = dateToIso(subtractMonths(today.value, 1));
  if (period.value === '1y') result.date_from = dateToIso(subtractMonths(today.value, 12));
  if (period.value === '3y') result.date_from = dateToIso(subtractMonths(today.value, 36));
  return result;
});

const instrumentsById = computed(() => instrumentMap(store.instruments));
const allPositions = computed(() => store.positions?.results ?? []);
const archivedPositions = computed(() =>
  allPositions.value.filter((position) => position.status === 'archived'),
);
const filteredPositions = computed(() =>
  allPositions.value.filter((position) => {
    const instrument = instrumentsById.value.get(position.instrument_id);
    return (
      position.status !== 'archived' &&
      (containerId.value === 'all' || String(position.container_id) === containerId.value) &&
      (assetClass.value === 'all' || instrument?.asset_class === assetClass.value) &&
      (currency.value === 'all' || position.native_currency === currency.value)
    );
  }),
);
// "A coste" is a statement about provenance, not a pending task: the balance is current.
const reviewPositions = computed(() =>
  filteredPositions.value.filter(
    (position) => position.value_status !== 'fresh' && position.value_status !== 'at_cost',
  ),
);
const visiblePositions = computed(() =>
  reviewOnly.value ? reviewPositions.value : filteredPositions.value,
);

const baseCurrency = computed(() => store.overview?.currency ?? 'EUR');
const scopeIsFiltered = computed(
  () => containerId.value !== 'all' || assetClass.value !== 'all' || currency.value !== 'all',
);

function money(value: string | number | null | undefined, displayCurrency = baseCurrency.value) {
  if (value == null) return '—';
  if (displayCurrency === 'EUR' || displayCurrency === 'USD') {
    return formatMoney(value, displayCurrency);
  }
  return `${formatAmount(value, { currency: displayCurrency })} ${currencySymbol(displayCurrency)}`;
}

function signedMoney(value: string | number | null | undefined): string {
  if (value == null) return '—';
  const number = toNumber(value);
  return `${number > 0 ? '+' : ''}${money(number)}`;
}

const heroValue = computed(() => {
  if (!store.overview) return '—';
  const value = store.overview.value ?? store.overview.covered_value;
  return `${store.overview.value === null ? '≥ ' : ''}${money(value)}`;
});
// MWR leads: it answers what the investor's own money did, which is the question the
// hero is asked. TWR describes the assets and is kept beside it as context, not hidden.
const headlineReturn = computed(() => pct(store.overview?.return.mwr_xirr));
const returnTone = computed(() => (toNumber(store.overview?.return.mwr_xirr) >= 0 ? 'pos' : 'neg'));
const heroKpis = computed(() => [
  {
    label: 'Resultado del periodo',
    value: signedMoney(store.performance?.monetary_result),
    meta: store.performance?.gross_result == null ? 'Cobertura parcial' : 'Neto de costes',
    cellClass: toNumber(store.performance?.monetary_result) >= 0 ? 'pos' : 'neg',
  },
  {
    label: 'Aportaciones netas',
    value: signedMoney(store.performance?.net_contributed),
    meta: 'Entradas menos retiradas',
  },
  {
    label: 'Rentabilidad del activo',
    value: pct(store.performance?.return.twr_annualized),
    meta: 'TWR anual: neutral a cuándo aportaste',
  },
  {
    label: 'Ingresos / costes',
    value: `${money(store.performance?.income)} / ${money(store.performance?.costs)}`,
    meta: 'Durante el periodo',
  },
]);

const composition = computed(() => {
  const totals = new Map<string, number>();
  for (const position of filteredPositions.value) {
    const key = instrumentsById.value.get(position.instrument_id)?.asset_class ?? 'other';
    totals.set(key, (totals.get(key) ?? 0) + positionBaseValue(position));
  }
  const rows = [...totals.entries()]
    .map(([key, value]) => ({
      key,
      label: portfolioAssetClassLabels[key] ?? key,
      value,
      color: portfolioAssetClassColors[key] ?? portfolioAssetClassColors.other!,
    }))
    .sort((a, b) => b.value - a.value);
  // Only eight hues survive the palette checker, so a longer tail is aggregated rather
  // than given invented colours nobody could tell apart. Each class keeps its own hue
  // whenever it is shown; only the smallest ones merge.
  if (rows.length <= PORTFOLIO_MAX_COMPOSITION_SLICES) return rows;
  const head = rows.slice(0, PORTFOLIO_MAX_COMPOSITION_SLICES - 1);
  const tail = rows.slice(PORTFOLIO_MAX_COMPOSITION_SLICES - 1);
  return [
    ...head,
    {
      key: 'aggregated',
      label: `Otras clases · ${tail.length}`,
      value: tail.reduce((sum, row) => sum + row.value, 0),
      color: 'var(--a-pf-neutral)',
    },
  ];
});
const compositionTotal = computed(() =>
  composition.value.reduce((sum, item) => sum + item.value, 0),
);
const donutSlices = computed<ADonutSlice[]>(() =>
  composition.value.map((item) => ({
    ...item,
    hoverValue: `${formatPct(item.value / Math.max(compositionTotal.value, 1), 0)} · ${money(item.value)}`,
  })),
);

const memberOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Toda la familia' },
  ...store.members.map((member) => ({ value: String(member.id), label: member.name })),
]);
const containerOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos los contenedores' },
  ...[...new Map(allPositions.value.map((row) => [row.container_id, row.container_name])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name]) => ({ value: String(id), label: name })),
]);
const classOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todas las clases' },
  ...[...new Set(store.instruments.map((instrument) => instrument.asset_class))]
    .sort()
    .map((key) => ({ value: key, label: portfolioAssetClassLabels[key] ?? key })),
]);
const currencyOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todas las divisas' },
  ...[...new Set(allPositions.value.map((row) => row.native_currency).filter(Boolean))]
    .sort()
    .map((code) => ({ value: code!, label: code! })),
]);
// Own type rather than ASelectItem: this drives a segmented control, not a select, and
// ASelectItem admits groups that carry no value/label.
const periodOptions: { value: PeriodPreset; label: string }[] = [
  { value: '1m', label: '1 mes' },
  { value: 'ytd', label: 'Este año' },
  { value: '1y', label: '1 año' },
  { value: '3y', label: '3 años' },
  { value: 'all', label: 'Todo' },
  { value: 'custom', label: 'Fechas' },
];

const qualityMessage = computed(() => {
  const quality = store.quality;
  if (!quality || quality.status === 'ready') return '';
  const parts: string[] = [];
  if (quality.positions.stale) parts.push(`${quality.positions.stale} desactualizadas`);
  if (quality.positions.missing) parts.push(`${quality.positions.missing} sin valoración`);
  if (quality.ownership_missing) parts.push(`${quality.ownership_missing} sin titularidad`);
  if (quality.cash_ownership_missing) parts.push('efectivo sin titularidad individual');
  if (quality.fx_issues.length) parts.push(`${quality.fx_issues.length} incidencias de divisa`);
  return parts.join(' · ');
});
const pendingSetupCount = computed(
  () =>
    operationOptionsData.value?.positions.filter((position) => !position.setup_confirmed).length ??
    0,
);

function setTab(tab: PortfolioTab) {
  activeTab.value = tab;
}

async function syncUrl() {
  const nextQuery: Record<string, string> = {};
  if (returnTo !== '/patrimonio') nextQuery.return = returnTo;
  if (activeTab.value !== 'summary') nextQuery.tab = activeTab.value;
  if (period.value !== '1y') nextQuery.period = period.value;
  if (memberId.value !== 'all') nextQuery.member = memberId.value;
  if (containerId.value !== 'all') nextQuery.container = containerId.value;
  if (assetClass.value !== 'all') nextQuery.class = assetClass.value;
  if (currency.value !== 'all') nextQuery.currency = currency.value;
  if (period.value === 'custom') {
    if (customFrom.value) nextQuery.from = customFrom.value;
    if (customTo.value) nextQuery.to = customTo.value;
  }
  await router.replace({ query: nextQuery });
}

function returnToNetWorth() {
  void router.push(returnTo);
}

async function loadOperationOptions() {
  try {
    operationOptionsData.value = (await corePortfolioApi.getOperationOptions()).data;
  } catch {
    operationOptionsData.value = null;
  }
}

function openOperation(
  type: PortfolioOperationType = 'buy',
  position: PositionPerformance | null = null,
) {
  operationType.value = type;
  operationPositionId.value = position?.position_id ?? null;
  operationOpen.value = true;
  if (!operationOptionsData.value) void loadOperationOptions();
}

type SortKey = 'name' | 'container' | 'assetClass' | 'value' | 'result' | 'twr' | 'mwr';
const textSortKeys: SortKey[] = ['name', 'container', 'assetClass'];
const positionColumns: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'name', label: 'Posición', numeric: false },
  { key: 'container', label: 'Contenedor', numeric: false },
  { key: 'assetClass', label: 'Clase', numeric: false },
  { key: 'value', label: 'Valor', numeric: true },
  { key: 'result', label: 'Resultado', numeric: true },
  { key: 'twr', label: 'TWR', numeric: true },
  { key: 'mwr', label: 'MWR', numeric: true },
];
const sortKey = ref<SortKey>('value');
const sortDir = ref<'asc' | 'desc'>('desc');

function assetClassLabel(position: PositionPerformance): string {
  const key = instrumentsById.value.get(position.instrument_id)?.asset_class ?? 'other';
  return portfolioAssetClassLabels[key] ?? key;
}

function sortableValue(position: PositionPerformance, key: SortKey): string | number | null {
  if (key === 'name') return position.instrument_name;
  if (key === 'container') return position.container_name;
  if (key === 'assetClass') return assetClassLabel(position);
  if (key === 'value') return positionBaseValue(position);
  if (key === 'result') {
    const result = position.performance.monetary_result;
    return result == null ? null : toNumber(result);
  }
  const figure =
    key === 'twr' ? position.performance.return.nominal : position.performance.return.mwr_xirr;
  return figure == null ? null : toNumber(figure);
}

const sortedPositions = computed(() => {
  const direction = sortDir.value === 'asc' ? 1 : -1;
  return [...visiblePositions.value].sort((left, right) => {
    const a = sortableValue(left, sortKey.value);
    const b = sortableValue(right, sortKey.value);
    // A row with no figure sinks whichever way the column is sorted: it is missing
    // data, not the smallest value.
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b, 'es') * direction;
    }
    return (Number(a) - Number(b)) * direction;
  });
});

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    return;
  }
  sortKey.value = key;
  // Names read better A→Z; amounts and returns are almost always asked for largest first.
  sortDir.value = textSortKeys.includes(key) ? 'asc' : 'desc';
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortKey.value !== key) return 'none';
  return sortDir.value === 'asc' ? 'ascending' : 'descending';
}

function sortMark(key: SortKey): string {
  if (sortKey.value !== key) return '';
  return sortDir.value === 'asc' ? '↑' : '↓';
}

function signClass(value: number): string {
  if (value > 0) return 'is-positive';
  if (value < 0) return 'is-negative';
  return 'is-neutral';
}

// Amounts in base currency add up; a return does not, so the footer leaves it out.
const visibleTotalValue = computed(() =>
  sortedPositions.value.reduce((total, position) => total + positionBaseValue(position), 0),
);
const totalReturn = computed(() => store.performance?.return);
const visibleTotalResult = computed(() =>
  sortedPositions.value.reduce(
    (total, position) => total + toNumber(position.performance.monetary_result),
    0,
  ),
);

function pct(value: string | null | undefined): string {
  return value == null ? '—' : formatPct(toNumber(value), 1);
}

function showReviewQueue() {
  reviewOnly.value = true;
  selectedPosition.value = null;
  setTab('positions');
}

async function resyncFromAccounting() {
  resyncing.value = true;
  actionError.value = null;
  try {
    const { data } = await corePortfolioApi.resyncValuations();
    await store.refresh(query.value);
    successMessage.value =
      data.valuations_created > 0
        ? `Cartera actualizada: ${data.valuations_created} valoraciones traídas de contabilidad.`
        : 'La cartera ya estaba al día con contabilidad.';
  } catch (caught: unknown) {
    actionError.value = toApiErrorMessage(caught);
  } finally {
    resyncing.value = false;
  }
}

async function restorePosition(position: PositionPerformance) {
  actionError.value = null;
  try {
    await corePortfolioApi.reopenPosition(position.position_id);
    await Promise.all([store.refresh(query.value), loadOperationOptions()]);
    successMessage.value = `${position.instrument_name} vuelve a la cartera.`;
    if (!archivedPositions.value.length) showArchivedModal.value = false;
  } catch (caught: unknown) {
    actionError.value = toApiErrorMessage(caught);
  }
}

function openSelectedValuation() {
  const position = selectedPosition.value;
  if (!position) return;
  selectedPosition.value = null;
  openOperation('valuation', position);
}

async function onPortfolioSaved(message: string) {
  successMessage.value = message;
  await Promise.all([store.refresh(query.value), loadOperationOptions()]);
}

watch(
  [activeTab, period, memberId, containerId, assetClass, currency, customFrom, customTo],
  syncUrl,
);
watch(
  query,
  (nextQuery) => {
    void store.refresh(nextQuery);
  },
  { deep: true },
);

onMounted(() => {
  void store.loadMembers();
  void store.refresh(query.value);
  void loadOperationOptions();
});
</script>

<template>
  <div class="page a-pf-page">
    <APageHead title="Cartera" eyebrow="Patrimonio invertido">
      <template #meta>
        <AMetaPill v-if="store.overview">
          {{ formatShortMonthYear(store.overview.period.from) }}–{{
            formatShortMonthYear(store.overview.period.to)
          }}
        </AMetaPill>
        <AButton
          v-if="archivedPositions.length"
          size="sm"
          variant="ghost"
          @click="showArchivedModal = true"
        >
          {{ archivedPositions.length }} archivadas
        </AButton>
        <span v-if="scopeIsFiltered">Los filtros de inventario no alteran el hero familiar</span>
      </template>
      <template #actions>
        <AButton variant="primary" @click="openOperation()">Registrar</AButton>
        <AButton variant="ghost" @click="importOpen = true">Importar CSV</AButton>
        <AButton variant="ghost" @click="setupOpen = true">
          Configurar posiciones<span v-if="pendingSetupCount"> · {{ pendingSetupCount }}</span>
        </AButton>
        <AButton variant="ghost" :loading="resyncing" @click="resyncFromAccounting">
          Actualizar desde contabilidad
        </AButton>
        <AButton variant="ghost" @click="returnToNetWorth">Volver a Patrimonio</AButton>
      </template>
    </APageHead>

    <nav class="a-pf-tabs-bar" aria-label="Secciones de cartera">
      <div class="tabs">
        <AButton
          v-for="tab in [
            { id: 'summary', label: 'Resumen' },
            { id: 'positions', label: 'Posiciones' },
            { id: 'evolution', label: 'Evolución' },
          ]"
          :key="tab.id"
          class="tab"
          :class="{ on: activeTab === tab.id }"
          :aria-pressed="activeTab === tab.id"
          @click="setTab(tab.id as PortfolioTab)"
        >
          {{ tab.label }}
        </AButton>
      </div>
    </nav>

    <section class="sect a-pf-filter-section" aria-label="Filtros de cartera">
      <div class="context-rail a-pf-filters">
        <label class="context-field">
          <span class="sr-only">Titularidad</span>
          <ASelect
            v-model="memberId"
            class="filter-ctrl"
            aria-label="Titularidad"
            :options="memberOptions"
            :searchable="false"
          />
        </label>
        <label class="context-field">
          <span class="sr-only">Contenedor</span>
          <ASelect
            v-model="containerId"
            class="filter-ctrl"
            aria-label="Contenedor"
            :options="containerOptions"
          />
        </label>
        <label class="context-field">
          <span class="sr-only">Clase de activo</span>
          <ASelect
            v-model="assetClass"
            class="filter-ctrl"
            aria-label="Clase de activo"
            :options="classOptions"
            :searchable="false"
          />
        </label>
        <label class="context-field">
          <span class="sr-only">Divisa</span>
          <ASelect
            v-model="currency"
            class="filter-ctrl"
            aria-label="Divisa"
            :options="currencyOptions"
            :searchable="false"
          />
        </label>
        <div class="context-field mini-seg" role="group" aria-label="Periodo">
          <AButton
            v-for="option in periodOptions"
            :key="option.value"
            size="sm"
            variant="ghost"
            :class="{ on: period === option.value }"
            :aria-pressed="period === option.value"
            @click="period = option.value"
          >
            {{ option.label }}
          </AButton>
        </div>
        <div v-if="period === 'custom'" class="a-pf-custom-range">
          <ADateRange v-model:from="customFrom" v-model:to="customTo" />
        </div>
      </div>
    </section>

    <AState v-if="store.loading && !store.overview" status="loading" layout="panel">
      Calculando la cartera…
    </AState>
    <AState v-else-if="store.error" status="error" layout="panel">
      <strong>No se pudo cargar la cartera.</strong>
      <span>{{ store.error }}</span>
      <AButton size="sm" @click="store.refresh(query)">Reintentar</AButton>
    </AState>
    <AState v-else-if="store.overview?.position_count === 0" status="empty" layout="panel">
      <strong>Aún no hay posiciones en tu cartera.</strong>
      <span
        >Las inversiones registradas en Patrimonio aparecerán aquí cuando estén vinculadas.</span
      >
      <AButton variant="primary" size="sm" @click="router.push('/patrimonio')"
        >Ir a Patrimonio</AButton
      >
    </AState>

    <template v-else-if="store.overview && store.performance && store.quality">
      <AState v-if="store.overview.coverage.value === 'partial'" status="neutral" layout="inline">
        <strong>Lectura parcial.</strong> El valor con cobertura es
        {{ money(store.overview.covered_value) }}; la rentabilidad agregada no se muestra hasta
        completar el inicio y cierre del periodo.
      </AState>
      <AState
        v-if="store.quality.status !== 'ready'"
        :status="store.quality.status === 'needs_review' ? 'error' : 'neutral'"
        layout="inline"
      >
        <strong>{{
          store.quality.status === 'stale' ? 'Valoraciones desactualizadas.' : 'Datos que revisar.'
        }}</strong>
        {{ qualityMessage }}.
        <AButton size="sm" @click="showReviewQueue">Revisar ahora</AButton>
      </AState>
      <AState v-if="actionError" status="error" layout="inline">{{ actionError }}</AState>

      <template v-if="activeTab === 'summary'">
        <section class="sect a-pf-hero-section">
          <div class="a-pf-hero-grid">
            <AHero eyebrow="Valor de cartera" :value="heroValue">
              <template #delta>
                <div class="a-pf-return-line">
                  <strong :class="returnTone">{{ headlineReturn }}</strong>
                  <span>MWR anual · tu dinero</span>
                  <span v-if="store.overview.return.twr_annualized"
                    >TWR {{ pct(store.overview.return.twr_annualized) }} anual ·
                    {{
                      returnLabel(store.overview.return.method, store.overview.return.estimated)
                    }}</span
                  >
                </div>
              </template>
              <p>
                {{ store.overview.position_count }} posiciones ·
                {{ store.overview.fresh_position_count }} valoradas al día
              </p>
            </AHero>
            <AKpiBand :items="heroKpis" />
          </div>
        </section>

        <section class="sect a-pf-composition-section">
          <ASectHead
            eyebrow="Composición"
            title="Dónde está invertida"
            :subtitle="
              scopeIsFiltered
                ? `Vista filtrada · ${filteredPositions.length} posiciones`
                : 'Valor de cierre por clase de activo'
            "
          />
          <AState v-if="!composition.length" status="empty" layout="panel"
            >No hay posiciones para estos filtros.</AState
          >
          <div v-else class="a-pf-composition-grid">
            <ADonut
              :slices="donutSlices"
              center-eyebrow="Valor filtrado"
              :center-value="money(compositionTotal)"
              :size="220"
              :thickness="18"
              aria-label="Composición de la cartera por clase de activo"
            />
            <div class="a-pf-composition-list">
              <div v-for="item in composition" :key="item.key" class="a-pf-composition-row">
                <i :class="`is-${item.key}`"></i>
                <span>{{ item.label }}</span>
                <strong class="mono">{{ money(item.value) }}</strong>
                <small>{{ formatPct(item.value / Math.max(compositionTotal, 1), 0) }}</small>
              </div>
            </div>
          </div>
        </section>

        <section class="sect">
          <ASectHead
            eyebrow="Calidad"
            title="Cobertura de los datos"
            subtitle="Valoración, titularidad y divisas se evalúan por separado."
          >
            <template #actions>
              <AButton v-if="pendingSetupCount" size="sm" variant="ghost" @click="setupOpen = true">
                Configurar {{ pendingSetupCount }} posiciones
              </AButton>
              <AButton
                v-if="reviewPositions.length"
                size="sm"
                variant="primary"
                @click="showReviewQueue"
              >
                Revisar {{ reviewPositions.length }} valoraciones
              </AButton>
            </template>
          </ASectHead>
          <div class="a-pf-quality-grid">
            <div>
              <span>Al día</span
              ><strong class="mono pos">{{ store.quality.positions.fresh }}</strong>
            </div>
            <div>
              <span>Desactualizadas</span
              ><strong class="mono">{{ store.quality.positions.stale }}</strong>
            </div>
            <div>
              <span>Sin valoración</span
              ><strong class="mono neg">{{ store.quality.positions.missing }}</strong>
            </div>
            <div>
              <span>Cobertura TWR</span
              ><strong>{{
                store.quality.metric_coverage.twr === 'exact'
                  ? 'Exacta'
                  : store.quality.metric_coverage.twr === 'estimated'
                    ? 'Estimada'
                    : 'No disponible'
              }}</strong>
            </div>
          </div>
        </section>
      </template>

      <section v-else-if="activeTab === 'positions'" class="sect">
        <ASectHead
          eyebrow="Inventario"
          title="Posiciones"
          :subtitle="
            reviewOnly
              ? `${visiblePositions.length} posiciones necesitan valoración`
              : `${visiblePositions.length} de ${allPositions.length} posiciones`
          "
        >
          <template #actions>
            <AButton
              v-if="reviewPositions.length"
              size="sm"
              variant="ghost"
              @click="reviewOnly = !reviewOnly"
            >
              {{ reviewOnly ? 'Ver todas' : 'Solo por revisar' }}
            </AButton>
          </template>
        </ASectHead>
        <AState v-if="!visiblePositions.length" status="empty" layout="panel"
          >No hay posiciones para estos filtros.</AState
        >
        <template v-else>
          <div class="a-pf-position-table">
            <table class="data-table a-pf-positions-table">
              <thead>
                <tr>
                  <th
                    v-for="column in positionColumns"
                    :key="column.key"
                    :class="{ num: column.numeric }"
                    :aria-sort="ariaSort(column.key)"
                  >
                    <button type="button" class="a-pf-sort" @click="toggleSort(column.key)">
                      {{ column.label
                      }}<span class="a-pf-sort-mark" aria-hidden="true">{{
                        sortMark(column.key)
                      }}</span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="position in sortedPositions"
                  :key="position.position_id"
                  tabindex="0"
                  @click="selectedPosition = position"
                  @keydown.enter="selectedPosition = position"
                >
                  <td data-label="Posición">
                    <strong>{{ position.instrument_name }}</strong
                    ><small
                      >{{ position.native_currency ?? 'Sin divisa'
                      }}<template v-if="position.value_status !== 'fresh'">
                        ·
                        <span class="a-pf-freshness" :class="`is-${position.value_status}`">{{
                          freshnessLabel(position.value_status)
                        }}</span>
                      </template></small
                    >
                  </td>
                  <td data-label="Contenedor">{{ position.container_name }}</td>
                  <td data-label="Clase">{{ assetClassLabel(position) }}</td>
                  <td class="num mono" data-label="Valor">
                    {{ money(positionBaseValue(position)) }}
                  </td>
                  <td
                    class="num mono"
                    :class="signClass(toNumber(position.performance.monetary_result))"
                    data-label="Resultado"
                  >
                    {{ signedMoney(position.performance.monetary_result) }}
                  </td>
                  <td
                    class="num mono"
                    :class="signClass(toNumber(position.performance.return.nominal))"
                    data-label="TWR"
                  >
                    {{ pct(position.performance.return.nominal) }}
                  </td>
                  <td
                    class="num mono"
                    :class="signClass(toNumber(position.performance.return.mwr_xirr))"
                    data-label="MWR"
                  >
                    {{ pct(position.performance.return.mwr_xirr) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td colspan="2">
                    {{ sortedPositions.length }} posiciones{{
                      scopeIsFiltered ? ' · filtrado' : ''
                    }}
                  </td>
                  <td class="num mono">{{ money(visibleTotalValue) }}</td>
                  <td class="num mono" :class="signClass(visibleTotalResult)">
                    {{ signedMoney(visibleTotalResult) }}
                  </td>
                  <!-- Not a sum: a return does not add up across positions. This is the
                       portfolio figure, which Core computes over the whole scope, so an
                       active inventory filter would make it describe something else. -->
                  <td class="num mono" :class="signClass(toNumber(totalReturn?.nominal))">
                    {{ scopeIsFiltered ? '—' : pct(totalReturn?.nominal) }}
                  </td>
                  <td class="num mono" :class="signClass(toNumber(totalReturn?.mwr_xirr))">
                    {{ scopeIsFiltered ? '—' : pct(totalReturn?.mwr_xirr) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="a-pf-position-list">
            <button
              v-for="position in sortedPositions"
              :key="position.position_id"
              type="button"
              @click="selectedPosition = position"
            >
              <span class="a-pf-position-main"
                ><strong>{{ position.instrument_name }}</strong
                ><small
                  >{{ position.container_name }} ·
                  {{ freshnessLabel(position.value_status) }}</small
                ></span
              >
              <span class="a-pf-position-value"
                ><strong class="mono">{{ money(positionBaseValue(position)) }}</strong
                ><small
                  class="mono"
                  :class="signClass(toNumber(position.performance.monetary_result))"
                  >{{ signedMoney(position.performance.monetary_result) }}</small
                ><small class="a-pf-position-returns"
                  ><span :class="signClass(toNumber(position.performance.return.nominal))"
                    >TWR {{ pct(position.performance.return.nominal) }}</span
                  ><span :class="signClass(toNumber(position.performance.return.mwr_xirr))"
                    >MWR {{ pct(position.performance.return.mwr_xirr) }}</span
                  ></small
                ></span
              >
            </button>
            <!-- El móvil pierde las columnas, no los totales: son la misma información
                 que el pie de la tabla, en la única disposición que cabe aquí. -->
            <div class="a-pf-position-total">
              <span class="a-pf-position-main"
                ><strong>Total</strong
                ><small
                  >{{ sortedPositions.length }} posiciones{{
                    scopeIsFiltered ? ' · filtrado' : ''
                  }}</small
                ></span
              >
              <span class="a-pf-position-value"
                ><strong class="mono">{{ money(visibleTotalValue) }}</strong
                ><small class="mono" :class="signClass(visibleTotalResult)">{{
                  signedMoney(visibleTotalResult)
                }}</small></span
              >
            </div>
          </div>
        </template>
      </section>

      <section v-else class="sect">
        <ASectHead
          eyebrow="Evolución"
          title="Valor frente a capital aportado"
          subtitle="Cierres mensuales del periodo seleccionado; los puntos parciales permanecen identificados en los datos."
        />
        <AState
          v-if="!store.timeline?.results.some((point) => point.value !== null)"
          status="empty"
          layout="panel"
          >No hay una serie con cobertura suficiente para este periodo.</AState
        >
        <PortfolioEvolutionChart v-else :points="store.timeline.results" :currency="baseCurrency" />
      </section>
    </template>

    <BaseModal
      :open="selectedPosition !== null"
      :title="selectedPosition?.instrument_name"
      variant="sheet"
      panel-class="a-pf-detail-sheet"
      @close="selectedPosition = null"
    >
      <dl v-if="selectedPosition" class="a-pf-detail-list">
        <div>
          <dt>Valor de cierre</dt>
          <dd class="mono">{{ money(positionBaseValue(selectedPosition)) }}</dd>
        </div>
        <div>
          <dt>Valor nativo</dt>
          <dd class="mono">
            {{
              money(selectedPosition.native_value, selectedPosition.native_currency ?? baseCurrency)
            }}
          </dd>
        </div>
        <div>
          <dt>Resultado</dt>
          <dd
            class="mono"
            :class="toNumber(selectedPosition.performance.monetary_result) >= 0 ? 'pos' : 'neg'"
          >
            {{ signedMoney(selectedPosition.performance.monetary_result) }}
          </dd>
        </div>
        <div>
          <dt>Rentabilidad del activo</dt>
          <dd>
            {{ pct(selectedPosition.performance.return.nominal) }}
            <small
              >{{
                returnLabel(
                  selectedPosition.performance.return.method,
                  selectedPosition.performance.return.estimated,
                )
              }}<template v-if="selectedPosition.performance.return.twr_annualized">
                · {{ pct(selectedPosition.performance.return.twr_annualized) }} anualizada</template
              ></small
            >
          </dd>
        </div>
        <div>
          <dt>Rentabilidad de tu dinero</dt>
          <dd>
            {{ pct(selectedPosition.performance.return.mwr_xirr) }}
            <small>MWR anual: pondera cuándo aportaste</small>
          </dd>
        </div>
        <div>
          <dt>Contenedor</dt>
          <dd>{{ selectedPosition.container_name }}</dd>
        </div>
        <div>
          <dt>Clase</dt>
          <dd>
            {{
              portfolioAssetClassLabels[
                instrumentsById.get(selectedPosition.instrument_id)?.asset_class ?? 'other'
              ]
            }}
          </dd>
        </div>
        <div>
          <dt>Valor observado</dt>
          <dd>
            {{
              selectedPosition.observed_on
                ? formatShortMonthYear(selectedPosition.observed_on)
                : 'Sin valoración'
            }}
          </dd>
        </div>
        <div>
          <dt>Freshness</dt>
          <dd>
            <span class="a-pf-freshness" :class="`is-${selectedPosition.value_status}`">{{
              freshnessLabel(selectedPosition.value_status)
            }}</span>
          </dd>
        </div>
        <div>
          <dt>Atribución activo</dt>
          <dd class="mono">{{ money(selectedPosition.attribution.asset) }}</dd>
        </div>
        <div>
          <dt>Atribución divisa</dt>
          <dd class="mono">{{ money(selectedPosition.attribution.fx) }}</dd>
        </div>
      </dl>
      <template #footer>
        <div v-if="selectedPosition" class="ui-modal-foot-actions">
          <AButton variant="ghost" @click="selectedPosition = null">Cerrar</AButton>
          <AButton variant="primary" @click="openSelectedValuation">
            Actualizar valoración
          </AButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="showArchivedModal"
      title="Posiciones archivadas"
      variant="sheet"
      panel-class="a-pf-detail-sheet"
      @close="showArchivedModal = false"
    >
      <AState v-if="!archivedPositions.length" status="empty">
        No hay posiciones archivadas.
      </AState>
      <dl v-else class="a-pf-detail-grid">
        <div v-for="position in archivedPositions" :key="position.position_id">
          <dt>{{ position.instrument_name }}</dt>
          <dd>
            {{ position.container_name }}
            <AButton variant="ghost" @click="restorePosition(position)">Restaurar</AButton>
          </dd>
        </div>
      </dl>
      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton variant="ghost" @click="showArchivedModal = false">Cerrar</AButton>
        </div>
      </template>
    </BaseModal>

    <PortfolioOperationModal
      :open="operationOpen"
      :options="operationOptionsData"
      :initial-position-id="operationPositionId"
      :initial-type="operationType"
      @close="operationOpen = false"
      @saved="onPortfolioSaved"
    />
    <PortfolioImportModal
      :open="importOpen"
      @close="importOpen = false"
      @saved="onPortfolioSaved"
    />
    <PortfolioSetupModal
      :open="setupOpen"
      :options="operationOptionsData"
      @close="setupOpen = false"
      @saved="onPortfolioSaved"
    />
    <AToast :open="!!successMessage" @close="successMessage = null">
      {{ successMessage }}
    </AToast>
  </div>
</template>
