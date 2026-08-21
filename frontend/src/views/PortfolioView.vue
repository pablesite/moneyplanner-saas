<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  PortfolioEvolutionChart,
  PortfolioImportModal,
  PortfolioOperationModal,
  PortfolioBasketsPanel,
  PortfolioContributionModal,
  PortfolioExposureModal,
  PortfolioRulesModal,
  PortfolioSetupModal,
  PortfolioContainersModal,
  corePortfolioApi,
  freshnessLabel,
  PORTFOLIO_MAX_COMPOSITION_SLICES,
  portfolioAssetClassColors,
  portfolioAssetClassLabels,
  portfolioExposureBucketLabels,
  portfolioExposureDimensionLabels,
  positionBaseValue,
  returnLabel,
  usePortfolioStore,
  type AllocationRow,
  type AllocationScope,
  type PortfolioAllocation,
  type PortfolioExposure,
  type PositionPerformance,
  type PortfolioQuery,
  type PortfolioOperationOptions,
  type PortfolioOperationType,
} from '@/domains/portfolio';
import '@/domains/portfolio/portfolio.css';
import {
  AButton,
  AChevron,
  ADateRange,
  ADonut,
  AHero,
  AInfoHint,
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
import PortfolioStrategyModal from '@/domains/portfolio/components/PortfolioStrategyModal.vue';

type PortfolioTab = 'summary' | 'positions' | 'allocation' | 'exposure' | 'evolution';
type PeriodPreset = '1m' | 'ytd' | '1y' | '3y' | 'all' | 'custom';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();

const validTabs: PortfolioTab[] = ['summary', 'positions', 'allocation', 'exposure', 'evolution'];
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
const strategyOpen = ref(false);
const contributionOpen = ref(false);
const rulesOpen = ref(false);
const exposureOpen = ref(false);
const exposurePositionId = ref<number | null>(null);
const exposure = ref<PortfolioExposure | null>(null);
const exposureLoading = ref(false);
const exposureError = ref<string | null>(null);

// La exposición no depende del periodo ni de los filtros de inventario: describe la
// cartera de hoy, que es la que puedes cambiar.
async function loadExposure() {
  exposureLoading.value = true;
  exposureError.value = null;
  try {
    exposure.value = (await corePortfolioApi.getExposure()).data;
  } catch (error: unknown) {
    exposureError.value = toApiErrorMessage(error);
    exposure.value = null;
  } finally {
    exposureLoading.value = false;
  }
}

function exposureBucketLabel(bucket: string): string {
  return portfolioExposureBucketLabels[bucket] ?? bucket;
}

function coverageLabel(status: string): string {
  return (
    { ready: 'Cobertura suficiente', partial: 'Cobertura parcial', insufficient: 'Sin declarar' }[
      status
    ] ?? status
  );
}

function openExposure(positionId: number | null) {
  exposurePositionId.value = positionId;
  exposureOpen.value = true;
}
const basketsPanel = ref<InstanceType<typeof PortfolioBasketsPanel> | null>(null);
const allocation = ref<PortfolioAllocation | null>(null);
const allocationLoading = ref(false);
const allocationError = ref<string | null>(null);
// La política es de un ámbito de titularidad, no del miembro: "lo de Pablo", "lo de
// Lucas" y "lo compartido" son mandatos distintos y una política única no diría nada.
const ownershipId = ref<number | null>(null);
const scopes = ref<AllocationScope[]>([]);

// El selector dice cuánto hay en cada ámbito, y se aterriza en el que más pesa: es casi
// siempre el que vienes a mirar. Sin esto la vista abría en el primero que llegara, que
// podía ser el de un menor con cuatrocientos euros o el de alguien sin posiciones.
const ownershipOptions = computed<ASelectItem[]>(() =>
  scopes.value.map((row) => ({
    value: String(row.ownership_id),
    label: `${row.label} · ${row.position_count} posiciones`,
  })),
);
const ownershipLabel = computed(
  () => scopes.value.find((row) => row.ownership_id === ownershipId.value)?.label ?? 'la cartera',
);

async function loadOwnerships() {
  if (scopes.value.length) return;
  try {
    scopes.value = (await corePortfolioApi.getAllocationScopes()).data;
    if (ownershipId.value === null && scopes.value.length) {
      ownershipId.value = scopes.value[0]!.ownership_id;
    }
  } catch {
    scopes.value = [];
  }
}

async function loadAllocation() {
  if (ownershipId.value === null) return;
  allocationLoading.value = true;
  allocationError.value = null;
  try {
    allocation.value = (await corePortfolioApi.getAllocation(ownershipId.value)).data;
  } catch (error: unknown) {
    allocationError.value = toApiErrorMessage(error);
    allocation.value = null;
  } finally {
    allocationLoading.value = false;
  }
}

// Son porcentajes, y llegan con tres decimales: sin formatear, una banda de 45 a 65 se
// leía como "45.000–65.000", que en tipografía mono parece decenas de miles.
function bandRange(row: AllocationRow): string {
  if (!row.min_percent && !row.max_percent) return '—';
  const edge = (value: string | null) => (value === null ? '—' : formatPct(Number(value) / 100, 0));
  return `${edge(row.min_percent)} – ${edge(row.max_percent)}`;
}

// Verde dentro de banda, rojo fuera, neutro lo que no se planeó: el color responde a
// "¿tengo que hacer algo?", que es la pregunta que se le hace a esta columna.
function driftTone(band: string): string {
  if (band === 'within') return 'is-positive';
  if (band === 'above' || band === 'below') return 'is-negative';
  return 'is-neutral';
}

function bandLabel(band: string): string {
  return (
    {
      within: 'En banda',
      above: 'Por encima',
      below: 'Por debajo',
      unplanned: 'Sin planear',
      derived: 'Hereda',
    }[band] ?? band
  );
}

function positionsOfClass(assetClass: string) {
  return (allocation.value?.by_position ?? []).filter((row) => row.asset_class === assetClass);
}
const setupPositionId = ref<number | null>(null);
const expandedClasses = ref(new Set<string>());

function closeSetup() {
  setupOpen.value = false;
  setupPositionId.value = null;
}
function toggleClass(key: string) {
  const next = new Set(expandedClasses.value);
  if (!next.delete(key)) next.add(key);
  expandedClasses.value = next;
}
function editPosition(id: number) {
  selectedPosition.value = null;
  setupPositionId.value = id;
  setupOpen.value = true;
}
const containersOpen = ref(false);
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

// Shared geometry for the inline icons, same shape Patrimonio uses.
const iconAttrs = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.8,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
} as const;

function subtractMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
}

const query = computed<PortfolioQuery>(() => {
  const result: PortfolioQuery = {};
  if (memberId.value !== 'all') result.member_id = Number(memberId.value);
  // Los tres filtros de inventario viajan a Core, que recalcula sobre ese subconjunto:
  // una rentabilidad no se suma entre posiciones, así que no es derivable aquí. La tabla
  // filtra además en cliente, pero sobre el mismo conjunto del que habla el resto.
  if (containerId.value !== 'all') result.container_id = Number(containerId.value);
  if (assetClass.value !== 'all') result.asset_class = assetClass.value;
  if (currency.value !== 'all') result.currency = currency.value;
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

const allPositions = computed(() => store.positions?.results ?? []);
const archivedPositions = computed(() =>
  allPositions.value.filter((position) => position.status === 'archived'),
);
const filteredPositions = computed(() =>
  allPositions.value.filter((position) => {
    return (
      position.status !== 'archived' &&
      (containerId.value === 'all' || String(position.container_id) === containerId.value) &&
      (assetClass.value === 'all' || position.asset_class === assetClass.value) &&
      (currency.value === 'all' || position.holding_currency === currency.value)
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

// Una recarga con datos ya en pantalla: las cifras visibles son del filtro anterior y
// se leen como si fueran las nuevas, así que se marcan como en cálculo mientras llegan.
const refreshing = computed(() => store.loading && !!store.overview);

const heroValue = computed(() => {
  if (!store.overview) return '—';
  const value = store.overview.value ?? store.overview.covered_value;
  return `${store.overview.value === null ? '≥ ' : ''}${money(value)}`;
});
// MWR leads: it answers what the investor's own money did, which is the question the
// hero is asked. TWR describes the assets and is kept beside it as context, not hidden.
const headlineReturn = computed(() => pct(store.overview?.return.mwr_xirr));
const returnTone = computed(() => (toNumber(store.overview?.return.mwr_xirr) >= 0 ? 'pos' : 'neg'));
// Plain labels first, acronym only as a footnote: "MWR" and "TWR" said nothing on
// their own. The distinction is carried by a tooltip that explains it with the two
// questions each answers, not by the initials. La banda es de tres columnas: una
// cuarta tarjeta se envolvía bajo la segunda, así que ingresos y costes viajan como
// pie del resultado, que es de donde salen.
const resultMeta = computed(() => {
  const income = toNumber(store.performance?.income);
  const costs = toNumber(store.performance?.costs);
  const parts: string[] = [];
  if (income) parts.push(`${money(store.performance?.income)} de ingresos`);
  if (costs) parts.push(`${money(store.performance?.costs)} de costes`);
  if (!parts.length)
    return store.performance?.gross_result == null ? 'Cobertura parcial' : 'Sin ingresos ni costes';
  return parts.join(' · ');
});
const heroKpis = computed(() => [
  {
    label: 'Ganado o perdido',
    value: signedMoney(store.performance?.monetary_result),
    meta: resultMeta.value,
    cellClass: toNumber(store.performance?.monetary_result) >= 0 ? 'pos' : 'neg',
  },
  {
    label: 'Dinero que has puesto',
    value: signedMoney(store.performance?.net_contributed),
    meta: 'Aportado menos retirado',
  },
  {
    label: 'Rendimiento de tus activos',
    value: pct(store.performance?.return.twr_annualized),
    meta: 'anual',
  },
]);

// Una posición puede repartirse entre varias clases (una cartera de roboadvisor, un
// fondo mixto): sin eso, contarla entera en la dominante desplaza el gráfico tanto como
// pese la posición, y una cartera 60/40 hacía desaparecer toda su renta fija.
function positionSlices(position: PositionPerformance): { key: string; value: number }[] {
  const total = positionBaseValue(position);
  if (!position.class_breakdown.length) {
    return [{ key: position.asset_class || 'other', value: total }];
  }
  return position.class_breakdown.map((row) => ({
    key: row.asset_class,
    value: (total * toNumber(row.percent)) / 100,
  }));
}

const composition = computed(() => {
  const groups = new Map<string, { position: PositionPerformance; value: number }[]>();
  for (const position of filteredPositions.value) {
    for (const slice of positionSlices(position)) {
      const bucket = groups.get(slice.key);
      const entry = { position, value: slice.value };
      if (bucket) bucket.push(entry);
      else groups.set(slice.key, [entry]);
    }
  }
  // El efectivo enlazado cuenta en el valor de la cartera pero no es ninguna posición:
  // sin sumarlo aquí el gráfico daba menos que el hero y la liquidez no salía por ningún
  // lado. Se suma a la clase Liquidez, que puede existir ya con posiciones propias.
  const cash = toNumber(store.cashValue);
  if (cash > 0 && !groups.has('cash')) groups.set('cash', []);
  const rows = [...groups.entries()]
    .map(([key, members]) => ({
      key,
      label: portfolioAssetClassLabels[key] ?? key,
      value: (key === 'cash' ? cash : 0) + members.reduce((sum, member) => sum + member.value, 0),
      color: portfolioAssetClassColors[key] ?? portfolioAssetClassColors.other!,
      members: [...members].sort((a, b) => b.value - a.value),
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
      members: tail.flatMap((row) => row.members).sort((a, b) => b.value - a.value),
    },
  ];
});
const compositionTotal = computed(() =>
  composition.value.reduce((sum, item) => sum + item.value, 0),
);
const donutSlices = computed<ADonutSlice[]>(() =>
  composition.value.map((item) => ({
    ...item,
    hoverValue: `${formatPct(item.value / Math.max(compositionTotal.value, 1), 1)} · ${money(item.value)}`,
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
// Denominations, not valuation currencies: a Bitcoin position is held in BTC and worth
// euros, and the old list only ever offered the latter, so crypto could not be filtered.
const currencyOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: `Todas · convertido a ${baseCurrency.value}` },
  ...[...new Set(allPositions.value.map((row) => row.holding_currency).filter(Boolean))]
    .sort()
    .map((code) => ({ value: code, label: code })),
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

// Registrar dinero es cosa de Contabilidad: aquí solo quedan las operaciones que allí
// no se pueden expresar, porque no mueven dinero sino la propia posición.
const MAINTENANCE_OPERATIONS: PortfolioOperationType[] = [
  'split',
  'position_transfer',
  'identifier_change',
  'adjustment',
];

function openOperation(
  type: PortfolioOperationType = 'split',
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
  // Una sola rentabilidad y con nombre llano: "TWR" y "MWR" no le dicen nada a nadie
  // que no venga del oficio. Se enseña la del dinero, que es la que responde a "¿cómo
  // me ha ido?"; la del activo sigue en la ficha de la posición, explicada.
  { key: 'mwr', label: 'Rentabilidad', numeric: true },
];
const sortKey = ref<SortKey>('value');
const sortDir = ref<'asc' | 'desc'>('desc');

function assetClassLabel(position: PositionPerformance): string {
  const key = position.asset_class || 'other';
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

const sortOptions = computed<ASelectItem[]>(() =>
  positionColumns.map((column) => ({ value: column.key, label: column.label })),
);

// El selector de móvil no alterna dirección: elegir campo la fija en la que se suele
// querer, y el botón de al lado la invierte si hace falta.
function applySort(key: string) {
  if (!positionColumns.some((column) => column.key === key)) return;
  sortKey.value = key as SortKey;
  sortDir.value = textSortKeys.includes(key as SortKey) ? 'asc' : 'desc';
}

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

function signClass(value: number | string | null): string {
  const numeric = toNumber(value);
  if (numeric > 0) return 'is-positive';
  if (numeric < 0) return 'is-negative';
  return 'is-neutral';
}

const visibleTotalValue = computed(() =>
  sortedPositions.value.reduce((total, position) => total + positionBaseValue(position), 0),
);
// Core ya calcula sobre el subconjunto filtrado, así que el pie muestra su rentabilidad
// sin más: una rentabilidad no se suma entre posiciones, pero esta no es una suma.
const totalReturn = computed(() => store.performance?.return ?? null);
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

// Confirmar una cesta escribe en el ledger: la cartera entera cambia, no solo la
// desviación de su ámbito.
async function onBasketSaved(message: string) {
  successMessage.value = message;
  await Promise.all([store.refresh(query.value), loadOperationOptions(), loadAllocation()]);
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

// La asignación se carga al entrar en su pestaña y al cambiar de ámbito: es una lectura
// aparte del workspace, porque su alcance lo decide la titularidad y no el periodo.
// `immediate` porque se puede entrar directo por URL a la pestaña: sin él, al abrir
// /cartera?tab=allocation no se cargaba nada, ya que el watcher espera un cambio.
watch(
  [activeTab, ownershipId],
  async ([tab]) => {
    if (tab !== 'allocation') return;
    await loadOwnerships();
    await loadAllocation();
  },
  { immediate: true },
);

// Mismo motivo que la asignación: es una lectura aparte y se puede entrar por URL.
watch(
  activeTab,
  (tab) => {
    if (tab === 'exposure' && exposure.value === null) void loadExposure();
  },
  { immediate: true },
);
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
        <span v-if="scopeIsFiltered">Todo el panel describe el subconjunto filtrado</span>
      </template>
      <!-- Los tres recurrentes van como icono: se usan a menudo, su etiqueta ocupaba la
           mitad de la cabecera y el nombre completo queda en `title` y `aria-label`. -->
      <template #actions>
        <AButton variant="ghost" @click="importOpen = true">Importar CSV</AButton>
        <AButton variant="ghost" @click="containersOpen = true">Contenedores</AButton>
        <AButton
          variant="icon"
          title="Configurar posiciones"
          :aria-label="
            pendingSetupCount
              ? `Configurar posiciones · ${pendingSetupCount} pendientes`
              : 'Configurar posiciones'
          "
          :class="{ 'has-badge': pendingSetupCount }"
          @click="setupOpen = true"
        >
          <svg v-bind="iconAttrs" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            />
          </svg>
        </AButton>
        <AButton
          variant="icon"
          title="Operaciones de cartera"
          aria-label="Operaciones de cartera: splits, traspasos, identificadores y ajustes"
          @click="openOperation()"
        >
          <svg v-bind="iconAttrs" aria-hidden="true">
            <path d="M8 3v4M16 3v4M4 11h16" />
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        </AButton>
        <AButton
          variant="icon"
          title="Actualizar desde contabilidad"
          aria-label="Actualizar desde contabilidad"
          :loading="resyncing"
          @click="resyncFromAccounting"
        >
          <svg v-bind="iconAttrs" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
        </AButton>
        <AButton
          variant="icon"
          title="Volver a Patrimonio"
          aria-label="Volver a Patrimonio"
          @click="returnToNetWorth"
        >
          <svg v-bind="iconAttrs" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </AButton>
      </template>
    </APageHead>

    <nav class="a-pf-tabs-bar" aria-label="Secciones de cartera">
      <div class="tabs">
        <AButton
          v-for="tab in [
            { id: 'summary', label: 'Resumen' },
            { id: 'positions', label: 'Posiciones' },
            { id: 'allocation', label: 'Asignación' },
            { id: 'exposure', label: 'Diversificación' },
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
              <template v-if="refreshing" #value>
                <div class="hero-value mono"><span class="skel a-pf-skel-hero"></span></div>
              </template>
              <template #delta>
                <div class="a-pf-return-line">
                  <span v-if="refreshing" class="skel a-pf-skel-return"></span>
                  <strong v-else :class="returnTone">{{ headlineReturn }}</strong>
                  <span>
                    ha rendido tu dinero, al año
                    <AInfoHint>
                      Lo que ha rendido <strong>el dinero que tú pusiste</strong>, teniendo en
                      cuenta cuándo lo pusiste: aportar justo antes de una subida no cuenta igual
                      que aportar después. En la ficha técnica se llama MWR o TIR.
                    </AInfoHint>
                  </span>
                  <span v-if="!refreshing && store.overview.return.twr_annualized"
                    >tus activos: {{ pct(store.overview.return.twr_annualized) }} ·
                    {{
                      returnLabel(store.overview.return.method, store.overview.return.estimated)
                    }}</span
                  >
                </div>
              </template>
              <p v-if="!refreshing">
                {{ store.overview.position_count }} posiciones ·
                {{ store.overview.fresh_position_count }} valoradas al día
              </p>
            </AHero>
            <AKpiBand :items="heroKpis" :pending="refreshing">
              <template #meta-2>
                anual
                <AInfoHint>
                  Cuánto han subido o bajado tus activos,
                  <strong>al margen de cuándo pusieras el dinero</strong>. Es la cifra que compara
                  tu cartera con un índice o con otro inversor. En la ficha técnica se llama TWR.
                </AInfoHint>
              </template>
            </AKpiBand>
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
              <div v-for="item in composition" :key="item.key" class="a-pf-composition-group">
                <button
                  type="button"
                  class="a-pf-composition-row"
                  :aria-expanded="expandedClasses.has(item.key)"
                  :disabled="!item.members.length"
                  @click="toggleClass(item.key)"
                >
                  <i :class="`is-${item.key}`"></i>
                  <span>
                    {{ item.label }}
                    <em v-if="item.members.length">{{ item.members.length }}</em>
                    <AInfoHint
                      v-if="item.key === 'unclassified'"
                      label="Nadie ha dicho todavía qué son. Un fondo, un ETF, un plan o una cartera gestionada pueden ser de cualquier clase, así que la app no lo adivina. Ábrelo y clasifícalos: hasta entonces no cuentan en ninguna clase real."
                    />
                    <AInfoHint
                      v-else-if="item.key === 'cash' && !item.members.length"
                      label="El efectivo enlazado a tus contenedores: el dinero que espera dentro de la plataforma antes de invertirse. Cuenta en el valor de la cartera, así que cuenta también aquí."
                    />
                  </span>
                  <strong class="mono">{{ money(item.value) }}</strong>
                  <small>{{ formatPct(item.value / Math.max(compositionTotal, 1), 1) }}</small>
                </button>
                <!-- El peso de dentro es sobre la clase, no sobre la cartera: la pregunta
                     al abrir una clase es cuánto pesa cada activo dentro de ella. -->
                <ul v-if="expandedClasses.has(item.key)" class="a-pf-composition-members">
                  <li v-for="member in item.members" :key="member.position.position_id">
                    <button
                      type="button"
                      class="a-pf-composition-member"
                      :title="`Configurar ${member.position.instrument_name}`"
                      @click="editPosition(member.position.position_id)"
                    >
                      <span>
                        {{ member.position.instrument_name }}
                        <em v-if="member.position.class_breakdown.length">parcial</em>
                      </span>
                      <strong class="mono">{{ money(member.value) }}</strong>
                      <small>{{ formatPct(member.value / Math.max(item.value, 1), 0) }}</small>
                    </button>
                  </li>
                </ul>
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
                    :class="signClass(toNumber(position.performance.return.mwr_xirr))"
                    data-label="Rentabilidad"
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
                  <!-- No es una suma: una rentabilidad no se suma entre posiciones. Core la
                       calcula sobre el filtro activo, así que describe exactamente las filas
                       de arriba; mientras la recalcula no se deja a la vista la anterior. -->
                  <td class="num mono" :class="signClass(toNumber(totalReturn?.mwr_xirr))">
                    <span v-if="refreshing" class="skel"></span>
                    <template v-else>{{ pct(totalReturn?.mwr_xirr) }}</template>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <!-- El orden vivía solo en las cabeceras de la tabla, que en móvil no existen:
               ordenar por rentabilidad o por valor era imposible desde el teléfono. -->
          <div class="a-pf-position-sort">
            <ASelect
              :model-value="sortKey"
              :options="sortOptions"
              :searchable="false"
              aria-label="Ordenar por"
              class="filter-ctrl"
              @update:model-value="(value) => applySort(String(value))"
            />
            <AButton
              variant="ghost"
              size="sm"
              :aria-label="sortDir === 'asc' ? 'Orden ascendente' : 'Orden descendente'"
              @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
            >
              {{ sortDir === 'asc' ? '↑ Menor primero' : '↓ Mayor primero' }}
            </AButton>
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
                  ><span :class="signClass(toNumber(position.performance.return.mwr_xirr))"
                    >{{ pct(position.performance.return.mwr_xirr) }} de rentabilidad</span
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
                }}</small
                ><small class="a-pf-position-returns"
                  ><span v-if="refreshing" class="skel"></span
                  ><span v-else :class="signClass(toNumber(totalReturn?.mwr_xirr))"
                    >{{ pct(totalReturn?.mwr_xirr) }} de rentabilidad</span
                  ></small
                ></span
              >
            </div>
          </div>
        </template>
      </section>

      <section v-else-if="activeTab === 'allocation'" class="sect a-pf-allocation-section">
        <ASectHead
          eyebrow="Asignación"
          title="Dónde quieres estar"
          :subtitle="
            allocation?.strategy
              ? `Política vigente desde ${formatShortMonthYear(allocation.strategy.effective_from)}`
              : 'Sin política escrita todavía: la cartera puede decirte dónde estás, pero no si es donde querías estar.'
          "
        >
          <template #actions>
            <ASelect
              v-model="ownershipId"
              :options="ownershipOptions"
              :searchable="false"
              aria-label="Ámbito de titularidad"
              class="filter-ctrl"
            />
            <AButton variant="ghost" :disabled="!ownershipId" @click="strategyOpen = true">
              {{ allocation?.strategy ? 'Editar política' : 'Escribir política' }}
            </AButton>
            <AButton variant="ghost" @click="rulesOpen = true">Restricciones</AButton>
            <AButton
              variant="primary"
              :disabled="!ownershipId || !allocation?.strategy"
              @click="contributionOpen = true"
            >
              Aportar
            </AButton>
          </template>
        </ASectHead>

        <AState v-if="allocationLoading" status="loading" layout="panel">
          Calculando la desviación…
        </AState>
        <AState v-else-if="allocationError" status="error" layout="panel">
          {{ allocationError }}
        </AState>
        <AState
          v-else-if="!allocation || !allocation.by_class.length"
          status="empty"
          layout="panel"
        >
          Este ámbito no tiene posiciones.
        </AState>
        <div v-else class="a-pf-table-scroll">
          <table class="data-table a-pf-allocation-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th class="num">Valor</th>
                <th class="num">Actual</th>
                <th class="num">Objetivo</th>
                <th class="num">Banda</th>
                <th class="num">Desvío</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row in allocation.by_class" :key="row.asset_class">
                <tr class="a-pf-allocation-class" @click="toggleClass(row.asset_class ?? 'other')">
                  <td>
                    <AChevron :expanded="expandedClasses.has(row.asset_class ?? 'other')" />
                    <i class="a-pf-dot" :class="`is-${row.asset_class}`"></i>
                    {{ portfolioAssetClassLabels[row.asset_class ?? 'other'] ?? row.asset_class }}
                  </td>
                  <td class="num mono">{{ money(row.value) }}</td>
                  <td class="num mono">{{ formatPct(Number(row.actual_percent) / 100, 1) }}</td>
                  <td class="num mono">
                    {{ row.target_percent ? formatPct(Number(row.target_percent) / 100, 1) : '—' }}
                  </td>
                  <td class="num mono">{{ bandRange(row) }}</td>
                  <!-- El color dice si hay que actuar, no si la cifra es positiva: una
                     clase dentro de banda está bien aunque no clave el objetivo. -->
                  <td class="num mono" :class="driftTone(row.band)">
                    {{ row.drift_value ? signedMoney(row.drift_value) : '—' }}
                  </td>
                  <td>
                    <span class="a-pf-band" :class="`is-${row.band}`">{{
                      bandLabel(row.band)
                    }}</span>
                  </td>
                </tr>
                <!-- El segundo nivel: dentro de la clase, qué le toca a cada producto. El
                   objetivo de uno sin línea propia no es cero, es lo que hereda de su
                   clase repartido por lo que ya pesa. -->
                <tr
                  v-for="item in positionsOfClass(row.asset_class ?? 'other')"
                  v-show="expandedClasses.has(row.asset_class ?? 'other')"
                  :key="`${row.asset_class}-${item.position_id}`"
                  class="a-pf-allocation-position"
                >
                  <td>{{ item.name }}</td>
                  <td class="num mono">{{ money(item.value) }}</td>
                  <td class="num mono">{{ formatPct(Number(item.actual_percent) / 100, 1) }}</td>
                  <td class="num mono">
                    {{
                      item.target_percent ? formatPct(Number(item.target_percent) / 100, 1) : '—'
                    }}
                  </td>
                  <td class="num mono">
                    {{
                      item.class_share
                        ? `${formatPct(Number(item.class_share) / 100, 0)} de la clase`
                        : '—'
                    }}
                  </td>
                  <td class="num mono" :class="driftTone(item.band)">
                    {{ item.drift_value ? signedMoney(item.drift_value) : '—' }}
                  </td>
                  <td>
                    <span class="a-pf-band" :class="`is-${item.band}`">{{
                      bandLabel(item.band)
                    }}</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <!-- Fuera de la tabla a propósito: dentro de un contenedor con scroll el globo
             de ayuda se recorta y en móvil no se llega a leer. -->
        <p class="a-pf-allocation-note">
          El desvío es cuánto te separas del objetivo: <strong>positivo</strong> si vas sobrado,
          <strong>negativo</strong> si te quedas corto. Solo se marca en rojo lo que se ha salido de
          su banda, que es lo único que pide una decisión.
        </p>

        <!-- Lo que has decidido aportar y todavía no has ejecutado vive aquí, debajo de
             la desviación que lo justifica. -->
        <PortfolioBasketsPanel
          ref="basketsPanel"
          :ownership-id="ownershipId"
          :options="operationOptionsData"
          :currency="baseCurrency"
          @saved="onBasketSaved"
        />
      </section>

      <section v-else-if="activeTab === 'exposure'" class="sect a-pf-exposure-section">
        <ASectHead
          eyebrow="Diversificación"
          title="Dónde estás metido de verdad"
          subtitle="La clase dice de qué depende que suba o baje; esto dice en qué está invertido por dentro."
        >
          <template #actions>
            <AButton variant="primary" @click="openExposure(null)">Declarar exposición</AButton>
          </template>
        </ASectHead>

        <AState v-if="exposureLoading" status="loading" layout="panel">
          Calculando la exposición…
        </AState>
        <AState v-else-if="exposureError" status="error" layout="panel">{{ exposureError }}</AState>
        <template v-else-if="exposure">
          <section
            v-for="dimension in exposure.dimensions"
            :key="dimension.dimension"
            class="a-pf-exposure-block"
          >
            <header>
              <h3>{{ dimension.label }}</h3>
              <span class="a-pf-band" :class="`is-${dimension.status}`">
                {{ coverageLabel(dimension.status) }}
              </span>
              <small v-if="dimension.status !== 'insufficient'">
                Declarado el {{ formatPct(Number(dimension.covered_percent) / 100, 1) }} de la
                cartera<template v-if="dimension.observed_from">
                  · ficha más antigua {{ formatShortMonthYear(dimension.observed_from) }}</template
                >
              </small>
            </header>
            <!-- El reparto es sobre lo declarado, no sobre el total: si no, las partes no
                 suman cien y el gráfico miente por los dos lados. -->
            <ul v-if="dimension.rows.length" class="a-pf-exposure-bars">
              <li v-for="row in dimension.rows" :key="row.bucket">
                <span>{{ exposureBucketLabel(row.bucket) }}</span>
                <span class="a-pf-exposure-bar" aria-hidden="true">
                  <i :style="{ width: `${Math.min(Number(row.percent), 100)}%` }"></i>
                </span>
                <strong class="mono">{{ formatPct(Number(row.percent) / 100, 1) }}</strong>
                <small class="mono">{{ money(row.value) }}</small>
              </li>
            </ul>
            <AState v-else status="empty" layout="inline">
              Nadie ha declarado todavía esta dimensión. El dato está en la ficha de cada producto:
              se copia una vez y se revisa cada trimestre.
            </AState>
          </section>

          <section class="a-pf-exposure-block">
            <header>
              <h3>Concentración</h3>
              <small>
                <template v-if="exposure.concentration.effective_positions">
                  Reparto equivalente a
                  {{ formatAmount(exposure.concentration.effective_positions, { maxDecimals: 1 }) }}
                  posiciones iguales ·
                </template>
                las cinco mayores pesan
                {{ formatPct(Number(exposure.concentration.top_five_percent) / 100, 1) }}
                <AInfoHint
                  label="Si el dinero estuviera repartido a partes iguales, este es el número de posiciones que harían falta para concentrar lo mismo que concentras hoy. Cuanto más bajo, más depende tu cartera de pocas cosas."
                />
              </small>
            </header>
            <ul class="a-pf-exposure-bars">
              <li v-for="row in exposure.concentration.top_positions" :key="row.position_id">
                <span>{{ row.name }}</span>
                <span class="a-pf-exposure-bar" aria-hidden="true">
                  <i :style="{ width: `${Math.min(Number(row.percent), 100)}%` }"></i>
                </span>
                <strong class="mono">{{ formatPct(Number(row.percent) / 100, 1) }}</strong>
                <small></small>
              </li>
            </ul>
          </section>

          <!-- Lo que se compró como cosas distintas y por dentro es lo mismo. Es la
               pregunta que nadie se hace hasta que ve el número. -->
          <section v-if="exposure.overlap.length" class="a-pf-exposure-block">
            <header>
              <h3>Solapamiento</h3>
              <small>Productos que comparten exposición, de mayor a menor.</small>
            </header>
            <ul class="a-pf-exposure-overlap">
              <li v-for="(row, index) in exposure.overlap" :key="index">
                <span>
                  {{ row.left_name }} <em>y</em> {{ row.right_name }}
                  <small>{{ portfolioExposureDimensionLabels[row.dimension] }}</small>
                </span>
                <strong class="mono">{{ formatPct(Number(row.percent) / 100, 0) }}</strong>
                <small class="mono">{{ money(row.shared_value) }} expuestos a lo mismo</small>
              </li>
            </ul>
          </section>
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
      panel-class="dir-a dir-a-sheet a-pf-detail-sheet"
      @close="selectedPosition = null"
    >
      <div v-if="selectedPosition" class="a-pf-detail-body">
        <!-- Primero cuánto vale y cómo ha ido; el resto es contexto de esa cifra. -->
        <div class="a-pf-detail-headline">
          <span class="a-pf-detail-headline-label">Valor de cierre</span>
          <strong class="mono">{{ money(positionBaseValue(selectedPosition)) }}</strong>
          <small
            v-if="
              selectedPosition.native_currency && selectedPosition.native_currency !== baseCurrency
            "
            class="mono"
          >
            {{ money(selectedPosition.native_value, selectedPosition.native_currency) }}
          </small>
          <em :class="toNumber(selectedPosition.performance.monetary_result) >= 0 ? 'pos' : 'neg'">
            {{ signedMoney(selectedPosition.performance.monetary_result) }} en el periodo
          </em>
        </div>

        <div class="a-pf-detail-returns">
          <div>
            <span class="a-pf-detail-return-label">
              Ha rendido tu dinero
              <AInfoHint>
                Tiene en cuenta cuándo pusiste cada euro. En la ficha técnica, MWR o TIR.
              </AInfoHint>
            </span>
            <strong :class="signClass(selectedPosition.performance.return.mwr_xirr)">
              {{ pct(selectedPosition.performance.return.mwr_xirr) }}
            </strong>
            <small>anual</small>
          </div>
          <div>
            <span class="a-pf-detail-return-label">
              Ha rendido el activo
              <AInfoHint>
                Al margen de cuándo aportaste: sirve para comparar con un índice. En la ficha
                técnica, TWR.
              </AInfoHint>
            </span>
            <strong :class="signClass(selectedPosition.performance.return.nominal)">
              {{ pct(selectedPosition.performance.return.nominal) }}
            </strong>
            <small>
              {{
                returnLabel(
                  selectedPosition.performance.return.method,
                  selectedPosition.performance.return.estimated,
                )
              }}<template
                v-if="
                  selectedPosition.performance.return.twr_annualized &&
                  selectedPosition.performance.return.twr_annualized !==
                    selectedPosition.performance.return.nominal
                "
              >
                · {{ pct(selectedPosition.performance.return.twr_annualized) }} anual</template
              >
            </small>
          </div>
        </div>

        <dl class="a-pf-detail-list">
          <div>
            <dt>Contenedor</dt>
            <dd>{{ selectedPosition.container_name }}</dd>
          </div>
          <div>
            <dt>Clase</dt>
            <dd>
              {{ portfolioAssetClassLabels[selectedPosition.asset_class] ?? 'Otros' }}
            </dd>
          </div>
          <div>
            <dt>Última valoración</dt>
            <dd>
              {{
                selectedPosition.observed_on
                  ? formatShortMonthYear(selectedPosition.observed_on)
                  : 'Sin valoración'
              }}
              <span class="a-pf-freshness" :class="`is-${selectedPosition.value_status}`">{{
                freshnessLabel(selectedPosition.value_status)
              }}</span>
            </dd>
          </div>
          <div v-if="selectedPosition.attribution.method !== 'unavailable'">
            <dt>Activo / divisa</dt>
            <dd class="mono">
              {{ money(selectedPosition.attribution.asset) }} ·
              {{ money(selectedPosition.attribution.fx) }}
            </dd>
          </div>
        </dl>
      </div>
      <template #footer>
        <div v-if="selectedPosition" class="ui-modal-foot-actions">
          <AButton variant="ghost" @click="selectedPosition = null">Cerrar</AButton>
          <AButton variant="primary" @click="editPosition(selectedPosition.position_id)">
            Configurar posición
          </AButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal
      :open="showArchivedModal"
      title="Posiciones archivadas"
      variant="sheet"
      panel-class="dir-a dir-a-sheet a-pf-detail-sheet"
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
      :types="MAINTENANCE_OPERATIONS"
      title="Operaciones de cartera"
      intro="Movimientos de dinero (compras, ventas, dividendos, comisiones, traspasos y valoraciones) se registran en Contabilidad. Aquí quedan las operaciones que cambian la propia posición sin mover dinero."
      @close="operationOpen = false"
      @saved="onPortfolioSaved"
    />
    <PortfolioImportModal
      :open="importOpen"
      @close="importOpen = false"
      @saved="onPortfolioSaved"
    />
    <PortfolioContainersModal
      :open="containersOpen"
      :options="operationOptionsData"
      @close="containersOpen = false"
      @saved="onPortfolioSaved"
    />
    <PortfolioContributionModal
      :open="contributionOpen"
      :options="operationOptionsData"
      :ownership-id="ownershipId"
      :ownership-label="ownershipLabel"
      :currency="baseCurrency"
      :suggested="allocation?.suggested_contribution ?? '0'"
      :planned="allocation?.planned_contribution ?? '0'"
      :contributed="allocation?.contributed_this_month ?? '0'"
      @close="contributionOpen = false"
      @saved="
        (message) => {
          successMessage = message;
          void loadAllocation();
          void basketsPanel?.reload();
        }
      "
    />
    <PortfolioExposureModal
      :open="exposureOpen"
      :options="operationOptionsData"
      :initial-position-id="exposurePositionId"
      @close="exposureOpen = false"
      @saved="
        (message) => {
          successMessage = message;
          void loadExposure();
        }
      "
    />
    <PortfolioRulesModal
      :open="rulesOpen"
      :options="operationOptionsData"
      @close="rulesOpen = false"
      @saved="
        (message) => {
          successMessage = message;
          void loadAllocation();
        }
      "
    />
    <PortfolioStrategyModal
      :open="strategyOpen"
      :options="operationOptionsData"
      :ownership-id="ownershipId"
      :ownership-label="ownershipLabel"
      @close="strategyOpen = false"
      @saved="
        (message) => {
          successMessage = message;
          void loadAllocation();
        }
      "
    />
    <PortfolioSetupModal
      :open="setupOpen"
      :options="operationOptionsData"
      :initial-position-id="setupPositionId"
      @close="closeSetup"
      @saved="onPortfolioSaved"
    />
    <AToast :open="!!successMessage" @close="successMessage = null">
      {{ successMessage }}
    </AToast>
  </div>
</template>
