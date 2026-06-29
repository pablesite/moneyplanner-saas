<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NetWorthEvolutionChart,
  useNetWorthViewExtensions,
  useNetWorthViewState,
} from '@/domains/net-worth';
import NetWorthItemModals from '@/domains/net-worth/components/NetWorthItemModals.vue';
import type {
  NetWorthWritePayload,
  TimelineComparisonPoint,
  TimelineComparisons,
} from '@/domains/net-worth/models';
import '@/domains/net-worth/net-worth-view.css';
import { useNetWorthOwnership } from '@/domains/net-worth/useNetWorthOwnership';
import {
  useNetWorthPageMetrics,
  type PositionRow,
} from '@/domains/net-worth/useNetWorthPageMetrics';
import { useNetWorthPageActions } from '@/domains/net-worth/useNetWorthPageActions';
import { useNetWorthTimeline } from '@/domains/net-worth/useNetWorthTimeline';
import {
  AButton,
  AHero,
  AInfoHint,
  AMetaPill,
  APageHead,
  ARowMenu,
  ASectHead,
  ASelect,
  AState,
  type ASelectItem,
  BaseModal,
} from '@/domains/ui';
import { useAnnualExpenseStore } from '@/domains/budget/annual-entries';
import { toApiErrorMessage } from '@/lib/errors';
import { coreAccountingApi } from '@/domains/accounting/api';
import type { LedgerDailyBalanceSeriesRow } from '@/domains/accounting/models';
import { coreNetWorthApi } from '@/domains/net-worth/api';

const route = useRoute();
const router = useRouter();

const {
  store,
  valueMode,
  currencies,
  assetCategories,
  liabilityCategories,
  prettyError,
  canShowReal,
  showAssetModal,
  showLiabilityModal,
  showEditModal,
  editItem,
  editKind,
  unitLabel,
  modeLabel,
  realBaseLabel,
  assetSubcategories,
  summaryAssets,
  summaryLiabilities,
  summaryNetWorth,
  byCategoryKeys,
  byCategoryAssets,
  byCategoryLiabilities,
  summaryAssetBackedLiabilities,
  summaryUnbackedLiabilities,
  submitAsset,
  openEdit,
  closeEdit,
  editTitle,
  editCategories,
  editInitial,
  submitEdit,
  editError,
} = useNetWorthViewState();
const annualExpenseStore = useAnnualExpenseStore('core');

const { itemFormProps } = useNetWorthViewExtensions(store);

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

function displayCurrencyUnit(currency: string | null | undefined): string {
  return currency === 'EUR' ? '€' : String(currency ?? '').trim();
}

type GeneratedLiabilityExpensePreview = {
  id: number;
  fiscalYear: number;
  name: string;
  category: string;
  subcategory: string;
  amountAnnual: number;
  currency: string;
};

const showGeneratedLiabilityExpenseModal = ref(false);
const generatedLiabilityExpenseReview = ref<{
  liabilityId: number;
  liabilityName: string;
  entries: GeneratedLiabilityExpensePreview[];
} | null>(null);
const generatedLiabilityExpenseReviewChangeMessage = ref<string | null>(null);
const generatedLiabilityExpenseReviewTitle = computed(() =>
  generatedLiabilityExpenseReview.value
    ? `Gasto generado por pasivo: ${generatedLiabilityExpenseReview.value.liabilityName}`
    : 'Gasto generado por pasivo',
);

function setGeneratedLiabilityExpenseReview(
  liabilityId: number,
  liabilityName: string,
  entries: GeneratedLiabilityExpensePreview[],
): void {
  generatedLiabilityExpenseReview.value = {
    liabilityId,
    liabilityName,
    entries: entries.map((entry) => ({ ...entry })),
  };
}

function mapGeneratedExpenseEntries(
  entries: Awaited<ReturnType<typeof annualExpenseStore.listBySourceLiability>>,
): GeneratedLiabilityExpensePreview[] {
  return entries
    .filter((entry) => entry.isSystemGenerated && entry.sourceLiabilityId != null)
    .sort((a, b) => a.fiscalYear - b.fiscalYear)
    .map((entry) => ({
      id: entry.id,
      fiscalYear: entry.fiscalYear,
      name: entry.name,
      category: entry.category,
      subcategory: entry.subcategory,
      amountAnnual: entry.amountAnnual,
      currency: entry.currency,
    }));
}

function summarizeGeneratedLiabilityExpenseChanges(
  beforeEntries: GeneratedLiabilityExpensePreview[],
  afterEntries: GeneratedLiabilityExpensePreview[],
): string | null {
  const toYearTotals = (rows: GeneratedLiabilityExpensePreview[]) => {
    const totals = new Map<number, number>();
    for (const row of rows) {
      totals.set(row.fiscalYear, (totals.get(row.fiscalYear) ?? 0) + Number(row.amountAnnual ?? 0));
    }
    return totals;
  };
  const beforeTotals = toYearTotals(beforeEntries);
  const afterTotals = toYearTotals(afterEntries);
  const years = Array.from(new Set([...beforeTotals.keys(), ...afterTotals.keys()])).sort(
    (a, b) => a - b,
  );
  const changedYears: number[] = [];
  for (const year of years) {
    const before = beforeTotals.get(year) ?? 0;
    const after = afterTotals.get(year) ?? 0;
    if (Math.abs(before - after) > 0.009) changedYears.push(year);
  }
  const addedYears = years.filter(
    (year) => (beforeTotals.get(year) ?? 0) <= 0 && (afterTotals.get(year) ?? 0) > 0,
  );
  const removedYears = years.filter(
    (year) => (beforeTotals.get(year) ?? 0) > 0 && (afterTotals.get(year) ?? 0) <= 0,
  );
  if (!changedYears.length && !addedYears.length && !removedYears.length) return null;
  const chunks: string[] = [];
  if (changedYears.length) chunks.push(`Importes actualizados en: ${changedYears.join(', ')}`);
  if (addedYears.length) chunks.push(`Nuevas anualidades: ${addedYears.join(', ')}`);
  if (removedYears.length) chunks.push(`Anualidades eliminadas: ${removedYears.join(', ')}`);
  return chunks.join(' | ');
}

function closeGeneratedLiabilityExpenseModal(): void {
  showGeneratedLiabilityExpenseModal.value = false;
  generatedLiabilityExpenseReview.value = null;
  generatedLiabilityExpenseReviewChangeMessage.value = null;
}

function openGeneratedExpensesInBudget(): void {
  closeGeneratedLiabilityExpenseModal();
  window.location.assign('/presupuesto');
}

async function submitLiabilityWithExpenseReview(
  payload: NetWorthWritePayload & { ownership_id?: number | null },
): Promise<void> {
  const createdLiability = await store.createLiability(payload);
  if (!createdLiability) return;
  showLiabilityModal.value = false;
  try {
    const generatedEntries = await annualExpenseStore.listBySourceLiability(createdLiability.id);
    const systemGeneratedEntries = mapGeneratedExpenseEntries(generatedEntries);
    if (!systemGeneratedEntries.length) return;
    generatedLiabilityExpenseReviewChangeMessage.value = null;
    setGeneratedLiabilityExpenseReview(
      createdLiability.id,
      createdLiability.name,
      systemGeneratedEntries,
    );
    showGeneratedLiabilityExpenseModal.value = true;
  } catch (e: unknown) {
    store.error = `Pasivo creado, pero no se pudo cargar el gasto generado: ${toApiErrorMessage(e)}`;
  }
}

async function updateLiabilityAndShowExpenseReview(
  id: number,
  payload: NetWorthWritePayload & { ownership_id?: number | null },
): Promise<void> {
  let beforeEntries: GeneratedLiabilityExpensePreview[] = [];
  try {
    beforeEntries = mapGeneratedExpenseEntries(await annualExpenseStore.listBySourceLiability(id));
  } catch {
    beforeEntries = [];
  }
  await store.updateLiability(id, payload);
  if (store.error) return;
  try {
    const refreshedEntries = mapGeneratedExpenseEntries(
      await annualExpenseStore.listBySourceLiability(id),
    );
    if (!refreshedEntries.length) return;
    const liabilityName = store.liabilities.find((item) => item.id === id)?.name ?? 'Pasivo';
    generatedLiabilityExpenseReviewChangeMessage.value = summarizeGeneratedLiabilityExpenseChanges(
      beforeEntries,
      refreshedEntries,
    );
    setGeneratedLiabilityExpenseReview(id, liabilityName, refreshedEntries);
    showGeneratedLiabilityExpenseModal.value = true;
  } catch (e: unknown) {
    store.error = `Pasivo actualizado, pero no se pudo cargar el gasto generado: ${toApiErrorMessage(e)}`;
  }
}

async function submitEditWithExpenseReview(
  payload: NetWorthWritePayload & { ownership_id?: number | null },
): Promise<void> {
  const current = editItem.value;
  if (!current || !editKind.value) return;
  if (editKind.value === 'asset') {
    await submitEdit(payload);
    return;
  }
  await updateLiabilityAndShowExpenseReview(current.id, payload);
  closeEdit();
}

const {
  ownershipFilter,
  ownershipOptions,
  ownershipFilterDisabled,
  allocationFractionForNetWorthOwner,
  matchesOwnershipFilter,
  ownershipBadge,
  setOwnershipFilter,
  setValueMode,
} = useNetWorthOwnership({
  ownerships: computed(() => store.ownerships),
  valueMode,
});
const heroUnitLabel = computed(() => displayCurrencyUnit(unitLabel()));

type ArchivedItemRow = {
  id: number;
  name: string;
  type: 'asset' | 'liability';
  category: string;
  owner: string;
};

function formatMetaDate(raw: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(raw));
}

const snapshotEntries = computed(() => {
  const rawStore = store as unknown as {
    snapshots?: Array<{ id: number; snapshot_date: string }>;
  };
  return [...(rawStore.snapshots ?? [])].sort((a, b) =>
    b.snapshot_date.localeCompare(a.snapshot_date),
  );
});
const asOfLabel = computed(() =>
  snapshotEntries.value[0]?.snapshot_date
    ? `Base ${formatMetaDate(snapshotEntries.value[0].snapshot_date)}`
    : 'Hoy',
);
const showArchivedModal = ref(false);
const archivedItemsCount = computed(
  () =>
    store.assets.filter((item) => item.is_active === false).length +
    store.liabilities.filter((item) => item.is_active === false).length,
);

watch(ownershipFilter, async () => {
  clearPositionSelection();
  if (
    selectedTimelineCategory.value &&
    !effectiveCategoryKeys.value.includes(selectedTimelineCategory.value)
  ) {
    selectedTimelineCategory.value = null;
    selectedTimelineCategoryType.value = 'asset';
    await store.fetchTimeline(null, 'asset');
  }
});

const selectedTimelineCategory = ref<string | null>(null);
const selectedTimelineCategoryType = ref<'asset' | 'liability'>('asset');
const selectedPositionType = ref<'asset' | 'liability' | null>(null);
const selectedPositionId = ref<number | null>(null);
const createAssetCategory = ref<string | null>(null);
const createLiabilityCategory = ref<string | null>(null);
type TimelinePreset = '3m' | '6m' | '1a' | '3a' | '5a' | 'all' | 'custom';
const customTimelineWindow = ref<{ start: number; end: number } | null>(null);
const timelinePresetOptions = ['3m', '6m', '1a', '3a', '5a', 'all', 'custom'] as const;
function parseTimelinePreset(raw: unknown): TimelinePreset {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return timelinePresetOptions.includes(value as TimelinePreset) ? (value as TimelinePreset) : '5a';
}

const selectedTimelinePreset = ref<TimelinePreset>(parseTimelinePreset(route.query.range));
const timelineScopeOptions = [
  { value: 'total', label: 'Total' },
  { value: 'operational', label: 'Operativo' },
] as const;
const activeTimelinePreset = computed(() => selectedTimelinePreset.value);
type NetWorthTab = 'general' | 'evolution' | 'balance';
const netWorthTabOptions: { id: NetWorthTab; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'evolution', label: 'Evolución' },
  { id: 'balance', label: 'Balance' },
];

function parseNetWorthTab(raw: unknown): NetWorthTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'evolution' || value === 'balance' || value === 'general' ? value : 'general';
}

const activeNetWorthTab = ref<NetWorthTab>(parseNetWorthTab(route.query.tab));
const evolutionReturnTab = ref<NetWorthTab | null>(null);

function setNetWorthTab(tab: NetWorthTab): void {
  activeNetWorthTab.value = tab;
  if (tab !== 'evolution') evolutionReturnTab.value = null;
  const query = { ...route.query };
  if (tab === 'general') delete query.tab;
  else query.tab = tab;
  void router.replace({ query });
}

async function openEvolutionFromComposition(row: HeroCompositionRow): Promise<void> {
  await applyCompositionCategoryFilter({ key: row.key, type: row.kind });
  evolutionReturnTab.value = 'general';
  setNetWorthTab('evolution');
}

function returnFromEvolution(): void {
  setNetWorthTab(evolutionReturnTab.value ?? 'general');
}

type TimelineScope = 'total' | 'operational';
type TimelineGranularity = 'monthly' | 'daily';
type ScopedPosition = {
  key: string;
  type: 'asset' | 'liability';
  id: number;
  name: string;
  category: string;
  trackingMode: string;
  accountId: number | null;
  ownershipRef: number | null;
};
type ScopeChartPoint = {
  date: string;
  shortLabel: string;
  fullLabel: string;
  value: number;
};

const timelineScope = ref<TimelineScope>(
  String(route.query.scope) === 'operational' ? 'operational' : 'total',
);
const timelineGranularity = computed<TimelineGranularity>(() =>
  timelineScope.value === 'operational' ? 'daily' : 'monthly',
);
const customTimelineDateFrom = ref(
  typeof route.query.date_from === 'string' ? route.query.date_from : '',
);
const customTimelineDateTo = ref(
  typeof route.query.date_to === 'string' ? route.query.date_to : '',
);
const scopedTimelineLoading = ref(false);
const scopedTimelineError = ref<string | null>(null);
const scopedMonthlyPoints = ref<ScopeChartPoint[]>([]);
const dailyBalanceRows = ref<LedgerDailyBalanceSeriesRow[]>([]);

type TimelinePoint = {
  date: string;
  label: string;
  netWorth: number;
  assets: number;
  liabilities: number;
};

const timelineMetric = computed<'net_worth' | 'assets' | 'liabilities'>(() => {
  if (!selectedTimelineCategory.value) return 'net_worth';
  return selectedTimelineCategoryType.value === 'liability' ? 'liabilities' : 'assets';
});

function getTimelineMetricValue(row: TimelinePoint): number {
  if (timelineMetric.value === 'assets') return row.assets;
  if (timelineMetric.value === 'liabilities') return row.liabilities;
  return row.netWorth;
}

const timelineRows = computed<TimelinePoint[]>(() =>
  (store.timeline?.rows ?? []).map((row) => ({
    date: row.date,
    label: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(
      new Date(row.date),
    ),
    netWorth: toNumber(row.net_worth),
    assets: toNumber(row.total_assets),
    liabilities: toNumber(row.total_liabilities),
  })),
);

const globalTimelineRows = ref<TimelinePoint[]>([]);
const globalTimelineComparisons = ref<TimelineComparisons | null>(null);
watch(
  [timelineRows, selectedTimelineCategory],
  ([rows, cat]) => {
    if (cat === null) {
      globalTimelineRows.value = rows;
      globalTimelineComparisons.value = store.timeline?.comparisons ?? null;
    }
  },
  { immediate: true },
);

type NetWorthComparison = {
  value: number;
  pct: number | null;
  baselineLabel: string;
  baselineDate: string;
};

const {
  selectedCategoryLabel,
  allAssetPositionRows,
  allLiabilityPositionRows,
  effectiveCategoryKeys,
  effectiveCategoryLabels,
  effectiveCategoryAssets,
  effectiveCategoryLiabilities,
  effectiveCategoryAssetCounts,
  effectiveCategoryLiabilityCounts,
  analysis,
  availablePositionRows,
  activeAssets,
  sourceItemForRow,
  selectedPosition,
  positionTimelineRows,
} = useNetWorthPageMetrics({
  assets: computed(() => store.assets),
  liabilities: computed(() => store.liabilities),
  baseCurrency: computed(() => store.baseCurrency),
  summary: computed(() => store.summary),
  positionTimelineRowsSource: computed(() => store.positionTimeline?.rows ?? []),
  assetCategories,
  liabilityCategories,
  byCategoryKeys,
  byCategoryAssets,
  byCategoryLiabilities,
  summaryAssets,
  summaryLiabilities,
  summaryNetWorth,
  summaryAssetBackedLiabilities,
  summaryUnbackedLiabilities,
  ownershipFilter,
  selectedTimelineCategory,
  selectedTimelineCategoryType,
  selectedPositionType,
  selectedPositionId,
  matchesOwnershipFilter,
  allocationFractionForNetWorthOwner,
});

function parseDate(raw: string): Date {
  return new Date(`${raw}T00:00:00`);
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function sameDayMonthsAgo(date: Date, months: number): Date | null {
  const target = new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
  return target.getDate() === date.getDate() ? target : null;
}

function sameDayYearsAgo(date: Date, years: number): Date | null {
  const target = new Date(date);
  target.setFullYear(date.getFullYear() - years);
  return target.getMonth() === date.getMonth() && target.getDate() === date.getDate()
    ? target
    : null;
}

function comparisonFromBaseline(baseline: TimelinePoint | null): NetWorthComparison | null {
  if (!baseline) return null;
  const value = analysis.value.netWorth - baseline.netWorth;
  const pct = baseline.netWorth !== 0 ? value / Math.abs(baseline.netWorth) : null;
  return { value, pct, baselineLabel: baseline.label, baselineDate: baseline.date };
}

function formatComparisonDateLabel(date: string | Date | null, includeYear = false): string {
  if (!date) return 'fecha equivalente';
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    ...(includeYear ? { year: 'numeric' } : {}),
  }).format(date instanceof Date ? date : parseDate(date));
}

function comparisonPointToTimelinePoint(
  point: TimelineComparisonPoint | null,
): TimelinePoint | null {
  if (!point) return null;
  return {
    date: point.date,
    label: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(
      new Date(point.date),
    ),
    netWorth: toNumber(point.net_worth),
    assets: toNumber(point.total_assets),
    liabilities: toNumber(point.total_liabilities),
  };
}

function latestBefore(rows: TimelinePoint[], date: Date): TimelinePoint | null {
  const target = isoDate(date);
  return [...rows].reverse().find((row) => row.date < target) ?? null;
}

function exactPoint(rows: TimelinePoint[], date: Date | null): TimelinePoint | null {
  if (!date) return null;
  const target = isoDate(date);
  return rows.find((row) => row.date === target) ?? null;
}

const currentComparisonDate = computed(() => {
  const rawDate = snapshotEntries.value[0]?.snapshot_date ?? new Date().toISOString().slice(0, 10);
  return parseDate(rawDate);
});

const previousMonthCloseDelta = computed(() =>
  comparisonFromBaseline(
    (ownershipFilter.value === 'all'
      ? comparisonPointToTimelinePoint(
          globalTimelineComparisons.value?.previous_month_close ?? null,
        )
      : null) ??
      latestBefore(comparisonTimelineRows.value, startOfMonth(currentComparisonDate.value)),
  ),
);
const sameDayPreviousMonthDelta = computed(() =>
  comparisonFromBaseline(
    (ownershipFilter.value === 'all'
      ? comparisonPointToTimelinePoint(
          globalTimelineComparisons.value?.same_day_previous_month ?? null,
        )
      : null) ??
      exactPoint(comparisonTimelineRows.value, sameDayMonthsAgo(currentComparisonDate.value, 1)),
  ),
);
const sameDayPreviousMonthLabel = computed(() => {
  const target =
    sameDayPreviousMonthDelta.value?.baselineDate ??
    sameDayMonthsAgo(currentComparisonDate.value, 1);
  return `vs ${formatComparisonDateLabel(target)}`;
});
const previousYearCloseDelta = computed(() =>
  comparisonFromBaseline(
    (ownershipFilter.value === 'all'
      ? comparisonPointToTimelinePoint(globalTimelineComparisons.value?.previous_year_close ?? null)
      : null) ??
      latestBefore(comparisonTimelineRows.value, startOfYear(currentComparisonDate.value)),
  ),
);
const sameDayPreviousYearDelta = computed(() =>
  comparisonFromBaseline(
    (ownershipFilter.value === 'all'
      ? comparisonPointToTimelinePoint(
          globalTimelineComparisons.value?.same_day_previous_year ?? null,
        )
      : null) ??
      exactPoint(comparisonTimelineRows.value, sameDayYearsAgo(currentComparisonDate.value, 1)),
  ),
);
const sameDayPreviousYearLabel = computed(() => {
  const target =
    sameDayPreviousYearDelta.value?.baselineDate ?? sameDayYearsAgo(currentComparisonDate.value, 1);
  return `vs ${formatComparisonDateLabel(target, true)}`;
});
const equityRatioPercent = computed(() => {
  const ratio = analysis.value.equityRatio;
  if (typeof ratio !== 'number' || !Number.isFinite(ratio)) return 0;
  return Math.max(0, Math.min(100, ratio * 100));
});

function ownershipBadgeForRow(row: PositionRow): string | null {
  return ownershipBadge(sourceItemForRow(row)?.ownership_ref);
}

function editRow(row: PositionRow): void {
  const item = sourceItemForRow(row);
  if (!item) return;
  openEdit(item, row.type);
}

const archivedItems = computed<ArchivedItemRow[]>(() => {
  const assets = store.assets
    .filter((item) => item.is_active === false)
    .filter((item) => matchesOwnershipFilter(item.ownership_ref))
    .map((item) => ({
      id: item.id,
      name: item.name,
      type: 'asset' as const,
      category:
        assetCategories.find((category) => category.value === item.category)?.label ??
        item.category,
      owner: ownershipBadge(item.ownership_ref) ?? 'Sin asignar',
    }));
  const liabilities = store.liabilities
    .filter((item) => item.is_active === false)
    .filter((item) => matchesOwnershipFilter(item.ownership_ref))
    .map((item) => ({
      id: item.id,
      name: item.name,
      type: 'liability' as const,
      category:
        liabilityCategories.find((category) => category.value === item.category)?.label ??
        item.category,
      owner: ownershipBadge(item.ownership_ref) ?? 'Sin asignar',
    }));

  return [...assets, ...liabilities].sort((a, b) => a.name.localeCompare(b.name, 'es'));
});

async function archiveRow(row: PositionRow): Promise<void> {
  if (row.type === 'asset') {
    await store.archiveAsset(row.id);
  } else {
    await store.archiveLiability(row.id);
  }
}

async function unarchiveItem(item: { id: number; type: 'asset' | 'liability' }): Promise<void> {
  if (item.type === 'asset') {
    await store.unarchiveAsset(item.id);
  } else {
    await store.unarchiveLiability(item.id);
  }
}

async function deleteRow(row: PositionRow): Promise<void> {
  const label = row.type === 'asset' ? 'activo' : 'pasivo';
  if (!confirm(`Eliminar este ${label}? Esta acción no se puede deshacer.`)) return;
  if (row.type === 'asset') {
    await store.deleteAsset(row.id);
  } else {
    await store.deleteLiability(row.id);
  }
}

type BalanceGroup = {
  key: string;
  label: string;
  kind: 'asset' | 'liability';
  rows: PositionRow[];
  total: number;
};

type BalanceSection = {
  kind: 'asset' | 'liability';
  label: string;
  groups: BalanceGroup[];
  total: number;
  count: number;
};

const balanceGroups = computed<BalanceGroup[]>(() => {
  const assetLabelMap = new Map(
    assetCategories.map((category) => [category.value, category.label]),
  );
  const liabilityLabelMap = new Map(
    liabilityCategories.map((category) => [category.value, category.label]),
  );

  const makeGroups = (
    rows: PositionRow[],
    kind: 'asset' | 'liability',
    labelMap: Map<string, string>,
    order: string[],
  ) =>
    order
      .map((categoryKey) => {
        const categoryRows = rows.filter((row) => row.category === categoryKey);
        if (!categoryRows.length) return null;
        return {
          key: categoryKey,
          label: labelMap.get(categoryKey) ?? categoryKey,
          kind,
          rows: categoryRows,
          total: categoryRows.reduce((sum, row) => sum + row.value, 0),
        } satisfies BalanceGroup;
      })
      .filter((group): group is BalanceGroup => group !== null);

  return [
    ...makeGroups(
      allAssetPositionRows.value,
      'asset',
      assetLabelMap,
      assetCategories.map((category) => category.value),
    ),
    ...makeGroups(
      allLiabilityPositionRows.value,
      'liability',
      liabilityLabelMap,
      liabilityCategories.map((category) => category.value),
    ),
  ];
});

const balanceSearch = ref('');
const collapsedBalanceGroups = ref<Set<string>>(new Set());
const mobileCreateMenuOpen = ref(false);
const selectedBalanceDetailRow = ref<PositionRow | null>(null);

function balanceRowMatchesMobileFilters(row: PositionRow): boolean {
  const query = balanceSearch.value.trim().toLocaleLowerCase('es');
  if (!query) return true;
  return [row.name, row.subtitle, ownershipBadgeForRow(row) ?? 'Sin asignar']
    .join(' ')
    .toLocaleLowerCase('es')
    .includes(query);
}

const mobileBalanceGroups = computed<BalanceGroup[]>(() =>
  balanceGroups.value
    .map((group) => {
      const rows = group.rows.filter(balanceRowMatchesMobileFilters);
      return {
        ...group,
        rows,
        total: rows.reduce((sum, row) => sum + row.value, 0),
      };
    })
    .filter((group) => group.rows.length > 0),
);

const mobileBalanceRowCount = computed(() =>
  mobileBalanceGroups.value.reduce((total, group) => total + group.rows.length, 0),
);

function makeBalanceSections(groups: BalanceGroup[]): BalanceSection[] {
  return (['asset', 'liability'] as const)
    .map((kind) => {
      const sectionGroups = groups.filter((group) => group.kind === kind);
      return {
        kind,
        label: kind === 'asset' ? 'Activos' : 'Pasivos',
        groups: sectionGroups,
        total: sectionGroups.reduce((sum, group) => sum + group.total, 0),
        count: sectionGroups.reduce((sum, group) => sum + group.rows.length, 0),
      };
    })
    .filter((section) => section.groups.length > 0);
}

const balanceSections = computed<BalanceSection[]>(() => makeBalanceSections(balanceGroups.value));
const mobileBalanceSections = computed<BalanceSection[]>(() =>
  makeBalanceSections(mobileBalanceGroups.value),
);

function balanceGroupKey(group: BalanceGroup): string {
  return `${group.kind}:${group.key}`;
}

function isBalanceGroupCollapsed(group: BalanceGroup): boolean {
  return collapsedBalanceGroups.value.has(balanceGroupKey(group));
}

function toggleBalanceGroup(group: BalanceGroup): void {
  const next = new Set(collapsedBalanceGroups.value);
  const key = balanceGroupKey(group);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  collapsedBalanceGroups.value = next;
}

type HeroCompositionRow = {
  key: string;
  label: string;
  kind: 'asset' | 'liability';
  value: number;
  share: number;
  count: number;
};

function buildHeroCompositionRows(kind: 'asset' | 'liability'): HeroCompositionRow[] {
  const values =
    kind === 'asset' ? effectiveCategoryAssets.value : effectiveCategoryLiabilities.value;
  const counts =
    kind === 'asset' ? effectiveCategoryAssetCounts.value : effectiveCategoryLiabilityCounts.value;
  const total = values.reduce((sum, value) => sum + Math.max(0, value ?? 0), 0);

  return effectiveCategoryKeys.value
    .map((key, index) => {
      const value = Math.max(0, values[index] ?? 0);
      const count = Math.max(0, counts[index] ?? 0);
      return {
        key,
        label: effectiveCategoryLabels.value[index] ?? key,
        kind,
        value,
        count,
        share: total > 0 ? value / total : 0,
      };
    })
    .filter((row) => row.value > 0 || row.count > 0);
}

const heroAssetRows = computed(() => buildHeroCompositionRows('asset'));
const heroLiabilityRows = computed(() => buildHeroCompositionRows('liability'));

const assetCompositionHues = [148, 178, 210, 24, 80];
const liabilityCompositionHues = [24, 345, 12, 45, 80];

function heroCompositionColor(row: HeroCompositionRow, index: number): string {
  const hue =
    row.kind === 'asset'
      ? assetCompositionHues[index % assetCompositionHues.length]
      : liabilityCompositionHues[index % liabilityCompositionHues.length];
  return `oklch(0.72 0.12 ${hue})`;
}

const timelineFilterLabel = computed(() => {
  if (selectedPosition.value) return selectedPosition.value.name;
  return selectedTimelineCategory.value ? selectedCategoryLabel.value : null;
});

function toggleMobileCreateMenu(): void {
  mobileCreateMenuOpen.value = !mobileCreateMenuOpen.value;
}

function openMobileCreateModal(type: 'asset' | 'liability'): void {
  mobileCreateMenuOpen.value = false;
  openCreateModal(type, null);
}

function isBalanceRowActive(row: PositionRow): boolean {
  return selectedPositionType.value === row.type && selectedPositionId.value === row.id;
}

function isHeroCategoryActive(row: HeroCompositionRow): boolean {
  return (
    selectedTimelineCategory.value === row.key && selectedTimelineCategoryType.value === row.kind
  );
}

function isCryptoPosition(row: PositionRow): boolean {
  const source = sourceItemForRow(row);
  return (
    row.type === 'asset' &&
    ['crypto_spot_earn', 'cryptocurrencies'].includes(String(source?.subcategory ?? ''))
  );
}

function foreignAmountLabel(row: PositionRow): string | null {
  const source = sourceItemForRow(row);
  if (!source) return null;
  const baseCurrency = store.baseCurrency ?? 'EUR';
  const sourceCurrency = String(source.currency ?? row.currency ?? '').trim();
  if (!sourceCurrency || sourceCurrency === baseCurrency) return null;
  const rawAmount = source.effective_amount ?? source.estimated_outstanding_amount ?? source.amount;
  if (rawAmount == null || String(rawAmount).trim() === '') return null;
  return `(${formatNumber(toNumber(rawAmount), isCryptoPosition(row) ? 8 : 2)} ${sourceCurrency})`;
}

function positionSourceLabel(row: PositionRow): string {
  const source = sourceItemForRow(row);
  if (source?.tracking_mode === 'accounting' && source.accounting_account_id) return 'Contable';
  return 'Manual';
}

function balanceDetailTitle(row: PositionRow | null): string {
  if (!row) return 'Detalle de posición';
  return row.type === 'asset' ? 'Detalle de activo' : 'Detalle de pasivo';
}

function positionKindLabel(row: PositionRow): string {
  return row.type === 'asset' ? 'Activo' : 'Pasivo';
}

function detailMetaLine(row: PositionRow): string {
  return [row.subtitle, ownershipBadgeForRow(row) ?? 'Sin asignar', positionSourceLabel(row)].join(
    ' · ',
  );
}

function rowMenuItems(row: PositionRow) {
  return [
    { id: 'focus', label: 'Ver evolucion' },
    { id: 'edit', label: 'Editar' },
    { id: 'archive', label: row.type === 'asset' ? 'Archivar activo' : 'Archivar pasivo' },
    { id: 'delete', label: 'Eliminar', danger: true },
  ];
}

async function handleRowMenuAction(row: PositionRow, actionId: string): Promise<void> {
  if (actionId === 'focus') {
    await selectPosition(row);
    return;
  }
  if (actionId === 'edit') {
    editRow(row);
    return;
  }
  if (actionId === 'archive') {
    await archiveRow(row);
    return;
  }
  if (actionId === 'delete') {
    await deleteRow(row);
  }
}

async function openBalanceDetail(row: PositionRow): Promise<void> {
  selectedBalanceDetailRow.value = row;
  await selectPosition(row);
}

function closeBalanceDetail(): void {
  selectedBalanceDetailRow.value = null;
}

function editBalanceDetail(row: PositionRow): void {
  closeBalanceDetail();
  editRow(row);
}

async function archiveBalanceDetail(row: PositionRow): Promise<void> {
  closeBalanceDetail();
  await archiveRow(row);
}

async function deleteBalanceDetail(row: PositionRow): Promise<void> {
  closeBalanceDetail();
  await deleteRow(row);
}

function resetAccountingActivity(): void {}

async function loadAccountingActivity(): Promise<void> {}

function clearPositionSelection(): void {
  selectedPositionType.value = null;
  selectedPositionId.value = null;
  store.positionTimeline = null;
  store.assetValuations = [];
  store.liabilityValuations = [];
  store.investmentEvents = [];
  store.liquidityEvents = [];
  store.liabilityEvents = [];
  resetAccountingActivity();
}

function closeAssetModal(): void {
  showAssetModal.value = false;
  createAssetCategory.value = null;
}

function closeLiabilityModal(): void {
  showLiabilityModal.value = false;
  createLiabilityCategory.value = null;
}

const {
  activeTimelineRows,
  displayedTimelineLoading,
  timelineWindow,
  timelineChartPoints,
  timelineSummaryLabel,
  displayedTimelineSeriesColor,
  timelineYAxisStartsAtZero,
} = useNetWorthTimeline({
  ownershipFilter,
  selectedPosition,
  selectedPositionType,
  selectedPositionId,
  selectedTimelineCategory,
  selectedTimelineCategoryType,
  selectedTimelinePreset,
  customTimelineWindow,
  timelineRows,
  availablePositionRows,
  allAssetPositionRows,
  allLiabilityPositionRows,
  positionTimelineRows,
  storeTimelineLoading: computed(() => store.timelineLoading),
  storePositionTimelineLoading: computed(() => store.positionTimelineLoading),
  setStoreError: (message) => {
    store.error = message;
  },
  resetPositionSelection: clearPositionSelection,
  getTimelineMetricValue,
});
const comparisonTimelineRows = computed(() =>
  ownershipFilter.value === 'all' ? globalTimelineRows.value : activeTimelineRows.value,
);

const {
  openCreateModal,
  submitAssetFromView,
  submitLiabilityFromView,
  resetTimelineSelection,
  applyCompositionCategoryFilter,
  selectPosition,
  setTimelinePreset,
  assetCreateInitial,
  liabilityCreateInitial,
} = useNetWorthPageActions({
  store,
  selectedPositionType,
  selectedPositionId,
  selectedTimelineCategory,
  selectedTimelineCategoryType,
  selectedTimelinePreset,
  customTimelineWindow,
  createAssetCategory,
  createLiabilityCategory,
  showAssetModal,
  showLiabilityModal,
  availablePositionRows,
  timelineWindow,
  submitAsset,
  submitLiability: submitLiabilityWithExpenseReview,
  resetAccountingActivity,
  loadAccountingActivity,
});

const ownershipSelectOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos' },
  ...ownershipOptions.value.map((option) => ({
    value: String(option.value),
    label: option.label,
  })),
]);

const currencySelectOptions = computed<ASelectItem[]>(() =>
  currencies.map((currency) => ({ value: currency.value, label: currency.label })),
);

const allScopedPositions = computed<ScopedPosition[]>(() => [
  ...store.assets
    .filter((item) => item.is_active !== false && matchesOwnershipFilter(item.ownership_ref))
    .map((item) => ({
      key: `asset:${item.id}`,
      type: 'asset' as const,
      id: item.id,
      name: item.name,
      category: item.category,
      trackingMode: item.tracking_mode,
      accountId: item.accounting_account_id,
      ownershipRef: item.ownership_ref ?? null,
    })),
  ...store.liabilities
    .filter((item) => item.is_active !== false && matchesOwnershipFilter(item.ownership_ref))
    .map((item) => ({
      key: `liability:${item.id}`,
      type: 'liability' as const,
      id: item.id,
      name: item.name,
      category: item.category,
      trackingMode: item.tracking_mode,
      accountId: item.accounting_account_id,
      ownershipRef: item.ownership_ref ?? null,
    })),
]);

const selectedScopePositions = computed(() => {
  if (timelineScope.value === 'total') return allScopedPositions.value;
  return allScopedPositions.value.filter(
    (position) =>
      position.trackingMode === 'accounting' &&
      position.accountId != null &&
      (position.type === 'liability' || ['cash', 'investments'].includes(position.category)),
  );
});

const accountingScopePositions = computed(() =>
  selectedScopePositions.value.filter(
    (position) => position.trackingMode === 'accounting' && position.accountId != null,
  ),
);
const dailyTimelineAvailable = computed(
  () => timelineScope.value === 'operational' && accountingScopePositions.value.length > 0,
);
const timelineScopeLabel = computed(() => {
  if (timelineScope.value === 'operational') return 'Operativo';
  return 'Patrimonio total';
});

function dailyDateFrom(): string | undefined {
  if (selectedTimelinePreset.value === 'custom') return customTimelineDateFrom.value || undefined;
  if (selectedTimelinePreset.value === 'all') return undefined;
  const daysByPreset = { '3m': 92, '6m': 183, '1a': 366, '3a': 1096, '5a': 1826 } as const;
  const date = new Date();
  date.setDate(date.getDate() - daysByPreset[selectedTimelinePreset.value]);
  return date.toISOString().slice(0, 10);
}

function dailyDateTo(): string | undefined {
  return selectedTimelinePreset.value === 'custom'
    ? customTimelineDateTo.value || undefined
    : undefined;
}

async function fetchDailyScopeTimeline(): Promise<void> {
  if (timelineGranularity.value !== 'daily' || !dailyTimelineAvailable.value) {
    dailyBalanceRows.value = [];
    return;
  }
  scopedTimelineLoading.value = true;
  scopedTimelineError.value = null;
  try {
    const response = await coreAccountingApi.getDailyBalanceSeries({
      date_from: dailyDateFrom(),
      date_to: dailyDateTo(),
      account_ids: accountingScopePositions.value.map((position) => position.accountId!),
      ownership_id:
        ownershipFilter.value === 'all'
          ? undefined
          : store.ownerships.find(
              (ownership) =>
                ownership.kind === 'individual' && ownership.member?.id === ownershipFilter.value,
            )?.id,
    });
    dailyBalanceRows.value = response.data.rows;
  } catch (error: unknown) {
    scopedTimelineError.value = toApiErrorMessage(error);
    dailyBalanceRows.value = [];
  } finally {
    scopedTimelineLoading.value = false;
  }
}

async function fetchMonthlyScopeTimeline(): Promise<void> {
  if (timelineGranularity.value !== 'monthly' || timelineScope.value === 'total') {
    scopedMonthlyPoints.value = [];
    return;
  }
  const positions = selectedScopePositions.value;
  if (!positions.length) {
    scopedMonthlyPoints.value = [];
    return;
  }
  scopedTimelineLoading.value = true;
  scopedTimelineError.value = null;
  try {
    const timelines = await Promise.all(
      positions.map(async (position) => ({
        position,
        timeline:
          position.type === 'asset'
            ? (await coreNetWorthApi.getAssetTimeline(position.id)).data.rows
            : (await coreNetWorthApi.getLiabilityTimeline(position.id)).data.rows,
      })),
    );
    const dates = Array.from(
      new Set(timelines.flatMap(({ timeline }) => timeline.map((row) => row.date))),
    ).sort();
    scopedMonthlyPoints.value = dates.map((date) => {
      let value = 0;
      for (const { position, timeline } of timelines) {
        const row = [...timeline].reverse().find((point) => point.date <= date);
        if (!row) continue;
        const fraction = allocationFractionForNetWorthOwner(
          position.ownershipRef,
          ownershipFilter.value,
        );
        const signed = position.type === 'liability' ? -1 : 1;
        value += Number(row.value_base || row.value || 0) * fraction * signed;
      }
      const parsedDate = new Date(date);
      return {
        date,
        shortLabel: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(parsedDate),
        fullLabel: new Intl.DateTimeFormat('es-ES', {
          month: 'long',
          year: 'numeric',
        }).format(parsedDate),
        value,
      };
    });
  } catch (error: unknown) {
    scopedTimelineError.value = toApiErrorMessage(error);
    scopedMonthlyPoints.value = [];
  } finally {
    scopedTimelineLoading.value = false;
  }
}

function filterTimelinePointsByCustomDates<TPoint extends ScopeChartPoint>(
  points: TPoint[],
): TPoint[] {
  if (selectedTimelinePreset.value !== 'custom') return points;
  const dateFrom = customTimelineDateFrom.value;
  const dateTo = customTimelineDateTo.value;
  return points.filter((point) => {
    if (dateFrom && point.date < dateFrom) return false;
    if (dateTo && point.date > dateTo) return false;
    return true;
  });
}

const scopedMonthlyVisiblePoints = computed(() => {
  const countByPreset = {
    '3m': 3,
    '6m': 6,
    '1a': 12,
    '3a': 36,
    '5a': 60,
    all: Infinity,
    custom: Infinity,
  } as const;
  const count = countByPreset[selectedTimelinePreset.value];
  const points = Number.isFinite(count)
    ? scopedMonthlyPoints.value.slice(-count)
    : scopedMonthlyPoints.value;
  return filterTimelinePointsByCustomDates(points);
});
const dailyTimelinePoints = computed<ScopeChartPoint[]>(() =>
  dailyBalanceRows.value.map((row) => {
    const date = new Date(`${row.date}T00:00:00`);
    return {
      date: row.date,
      shortLabel: new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' }).format(date),
      fullLabel: new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date),
      value: Number(row.net_balance),
    };
  }),
);
const activeEvolutionPoints = computed(() => {
  if (timelineGranularity.value === 'daily')
    return filterTimelinePointsByCustomDates(dailyTimelinePoints.value);
  if (timelineScope.value !== 'total') return scopedMonthlyVisiblePoints.value;
  return filterTimelinePointsByCustomDates(timelineChartPoints.value);
});
const activeEvolutionLoading = computed(
  () =>
    scopedTimelineLoading.value ||
    (timelineGranularity.value === 'monthly' &&
      timelineScope.value === 'total' &&
      displayedTimelineLoading.value),
);
const activeEvolutionLatest = computed(
  () => activeEvolutionPoints.value[activeEvolutionPoints.value.length - 1] ?? null,
);
const activeEvolutionPrevious = computed(() => {
  const points = activeEvolutionPoints.value;
  return points.length >= 2 ? (points[points.length - 2] ?? null) : null;
});
const activeEvolutionYtdBaseline = computed(() => {
  const latest = activeEvolutionLatest.value;
  if (!latest) return null;
  const currentYear = new Date(latest.date).getFullYear();
  return (
    activeEvolutionPoints.value.find(
      (point) => new Date(point.date).getFullYear() === currentYear,
    ) ??
    activeEvolutionPoints.value[0] ??
    null
  );
});
function evolutionDelta(
  latest: ScopeChartPoint | null,
  baseline: ScopeChartPoint | null,
): { value: number; pct: number | null } | null {
  if (!latest || !baseline || latest === baseline) return null;
  const value = latest.value - baseline.value;
  const pct = baseline.value !== 0 ? value / Math.abs(baseline.value) : null;
  return { value, pct };
}
const activeEvolutionMonthlyDelta = computed(() =>
  evolutionDelta(activeEvolutionLatest.value, activeEvolutionPrevious.value),
);
const activeEvolutionYtdDelta = computed(() =>
  evolutionDelta(activeEvolutionLatest.value, activeEvolutionYtdBaseline.value),
);
const activeEvolutionPeriodDelta = computed(() =>
  evolutionDelta(activeEvolutionLatest.value, activeEvolutionPoints.value[0] ?? null),
);
const activeEvolutionCaption = computed(() => {
  const points = activeEvolutionPoints.value;
  if (!points.length) return '-';
  return `${points[0]!.fullLabel} - ${points[points.length - 1]!.fullLabel}`;
});
const activeEvolutionPresetLabel = computed(() => {
  const labels: Record<(typeof timelinePresetOptions)[number], string> = {
    '3m': '3 meses',
    '6m': '6 meses',
    '1a': '1 año',
    '3a': '3 años',
    '5a': '5 años',
    all: 'todo el histórico',
    custom:
      customTimelineDateFrom.value || customTimelineDateTo.value
        ? 'el rango seleccionado'
        : 'todo el histórico',
  };
  return labels[selectedTimelinePreset.value];
});
function timelinePresetLabel(preset: (typeof timelinePresetOptions)[number]): string {
  if (preset === 'custom') return 'Fechas';
  return preset === 'all' ? 'Todo' : preset;
}
const activeEvolutionLabel = computed(() =>
  timelineGranularity.value === 'daily'
    ? `Saldo contable · ${timelineScopeLabel.value}`
    : timelineScope.value === 'total'
      ? timelineSummaryLabel.value
      : `Patrimonio · ${timelineScopeLabel.value}`,
);

function setTimelineScope(scope: TimelineScope): void {
  timelineScope.value = scope;
  clearPositionSelection();
  if (scope === 'operational') void resetTimelineSelection();
}

function handleTimelinePreset(preset: TimelinePreset): void {
  setTimelinePreset(preset);
}

watch(
  [
    timelineGranularity,
    timelineScope,
    selectedTimelinePreset,
    customTimelineDateFrom,
    customTimelineDateTo,
    ownershipFilter,
    () => selectedScopePositions.value.map((position) => position.key).join('|'),
  ],
  () => {
    if (timelineGranularity.value === 'daily') void fetchDailyScopeTimeline();
    else void fetchMonthlyScopeTimeline();
  },
  { immediate: true },
);
watch(
  [timelineScope, selectedTimelinePreset, customTimelineDateFrom, customTimelineDateTo],
  () => {
    const query = { ...route.query };
    if (timelineScope.value === 'total') delete query.scope;
    else query.scope = timelineScope.value;
    delete query.granularity;
    delete query.positions;
    if (selectedTimelinePreset.value === '5a') delete query.range;
    else query.range = selectedTimelinePreset.value;
    if (selectedTimelinePreset.value === 'custom' && customTimelineDateFrom.value)
      query.date_from = customTimelineDateFrom.value;
    else delete query.date_from;
    if (selectedTimelinePreset.value === 'custom' && customTimelineDateTo.value)
      query.date_to = customTimelineDateTo.value;
    else delete query.date_to;
    void router.replace({ query });
  },
  { deep: true },
);

watch(
  () => route.query.tab,
  (tab) => {
    activeNetWorthTab.value = parseNetWorthTab(tab);
  },
);
</script>

<template>
  <div class="page a-nw-page">
    <APageHead title="Patrimonio">
      <template v-if="archivedItemsCount || asOfLabel !== 'Hoy' || valueMode === 'real'" #meta>
        <button
          v-if="archivedItemsCount"
          class="a-nw-archived-trigger"
          type="button"
          @click="showArchivedModal = true"
        >
          <strong class="mono">{{ archivedItemsCount }}</strong> archivadas
        </button>
        <span
          v-if="archivedItemsCount && (asOfLabel !== 'Hoy' || valueMode === 'real')"
          class="dot"
        ></span>
        <AMetaPill v-if="asOfLabel !== 'Hoy'">{{ asOfLabel }}</AMetaPill>
        <span v-if="asOfLabel !== 'Hoy' && valueMode === 'real'" class="dot"></span>
        <span v-if="valueMode === 'real'">{{ modeLabel() }}</span>
      </template>
    </APageHead>

    <nav class="a-nw-tabs-bar" aria-label="Secciones de patrimonio">
      <div class="tabs">
        <button
          v-for="tab in netWorthTabOptions"
          :key="tab.id"
          class="tab"
          type="button"
          :class="{ on: activeNetWorthTab === tab.id }"
          @click="setNetWorthTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <section class="sect a-nw-read-section" aria-label="Opciones de lectura de patrimonio">
      <div class="a-nw-read-controls">
        <label class="context-field a-nw-control-chip" data-test="ownership-filter">
          <span class="a-nw-sr-only">Titularidad</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Titularidad"
            :model-value="String(ownershipFilter)"
            :options="ownershipSelectOptions"
            :disabled="ownershipFilterDisabled"
            :searchable="false"
            @update:model-value="(v) => setOwnershipFilter(v === 'all' ? 'all' : Number(v))"
          />
        </label>

        <label class="context-field a-nw-control-chip">
          <span class="a-nw-sr-only">Moneda</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Moneda"
            :model-value="store.baseCurrency ?? 'EUR'"
            :options="currencySelectOptions"
            :searchable="false"
            @update:model-value="(v) => store.updateBaseCurrency(String(v))"
          />
        </label>

        <div class="context-field a-nw-control-chip a-nw-valuation-control">
          <span class="a-nw-sr-only">Valoración</span>
          <div class="seg" role="group" aria-label="Valoración">
            <AButton
              :aria-pressed="valueMode === 'nominal'"
              :class="{ on: valueMode === 'nominal' }"
              @click="setValueMode('nominal')"
            >
              Nominal
            </AButton>
            <AButton
              v-if="canShowReal()"
              :aria-pressed="valueMode === 'real'"
              :class="{ on: valueMode === 'real' }"
              @click="setValueMode('real')"
            >
              Real
            </AButton>
          </div>
          <span v-if="valueMode === 'real' && realBaseLabel" class="a-nw-context-note">
            {{ realBaseLabel }}
          </span>
        </div>
      </div>
    </section>

    <section v-if="activeNetWorthTab === 'general'" class="sect">
      <div class="hero">
        <div class="hero-top">
          <AHero class="hero-headline" eyebrow="Patrimonio neto">
            <template #value>
              <button class="hero-value-button" type="button" @click="resetTimelineSelection">
                <div class="hero-value">
                  {{ formatNumber(analysis.netWorth, 2)
                  }}<span class="hero-value-unit">{{ heroUnitLabel }}</span>
                </div>
              </button>
            </template>
            <template #delta>
              <div class="hero-delta-grid">
                <div class="hero-equity-chip">
                  <span class="hero-delta-label">
                    Capital propio
                    <AInfoHint label="Cómo se calcula el capital propio">
                      Porcentaje de tus activos que queda cubierto por patrimonio neto: patrimonio
                      neto dividido entre activos totales. Sirve para leer cuánto de tus activos no
                      está financiado por deuda.
                    </AInfoHint>
                  </span>
                  <progress
                    class="hero-equity-meter"
                    :value="equityRatioPercent"
                    max="100"
                    aria-label="Capital propio"
                  />
                  <strong class="mono">{{ formatPct(analysis.equityRatio, 0) }}</strong>
                </div>

                <div class="hero-comparison-grid">
                  <section class="hero-delta-group">
                    <h3>
                      Mes
                      <AInfoHint label="Cómo se calcula el cambio mensual">
                        Compara tu patrimonio actual contra el último cierre mensual disponible y,
                        si existe histórico diario, contra la fecha equivalente del mes anterior.
                      </AInfoHint>
                    </h3>
                    <div class="hero-delta-row">
                      <span>vs cierre anterior</span>
                      <strong
                        v-if="previousMonthCloseDelta"
                        :class="previousMonthCloseDelta.value >= 0 ? 'pos mono' : 'neg mono'"
                      >
                        {{ previousMonthCloseDelta.value > 0 ? '+' : ''
                        }}{{ formatNumber(previousMonthCloseDelta.value, 0) }} {{ heroUnitLabel }}
                        <small v-if="previousMonthCloseDelta.pct !== null">
                          {{ previousMonthCloseDelta.value > 0 ? '+' : ''
                          }}{{ formatPct(previousMonthCloseDelta.pct, 1) }}
                        </small>
                      </strong>
                      <strong v-else class="hero-delta-empty">Sin cierre</strong>
                    </div>
                    <div class="hero-delta-row">
                      <span>{{ sameDayPreviousMonthLabel }}</span>
                      <strong
                        v-if="sameDayPreviousMonthDelta"
                        :class="sameDayPreviousMonthDelta.value >= 0 ? 'pos mono' : 'neg mono'"
                      >
                        {{ sameDayPreviousMonthDelta.value > 0 ? '+' : ''
                        }}{{ formatNumber(sameDayPreviousMonthDelta.value, 0) }} {{ heroUnitLabel }}
                        <small v-if="sameDayPreviousMonthDelta.pct !== null">
                          {{ sameDayPreviousMonthDelta.value > 0 ? '+' : ''
                          }}{{ formatPct(sameDayPreviousMonthDelta.pct, 1) }}
                        </small>
                      </strong>
                      <strong v-else class="hero-delta-empty">Sin histórico diario</strong>
                    </div>
                  </section>

                  <section class="hero-delta-group">
                    <h3>
                      Año
                      <AInfoHint label="Cómo se calcula el año en curso">
                        Compara tu patrimonio actual contra el cierre del año anterior y, si existe
                        histórico diario, contra la fecha equivalente del año anterior.
                      </AInfoHint>
                    </h3>
                    <div class="hero-delta-row">
                      <span>vs cierre anterior</span>
                      <strong
                        v-if="previousYearCloseDelta"
                        :class="previousYearCloseDelta.value >= 0 ? 'pos mono' : 'neg mono'"
                      >
                        {{ previousYearCloseDelta.value > 0 ? '+' : ''
                        }}{{ formatNumber(previousYearCloseDelta.value, 0) }} {{ heroUnitLabel }}
                        <small v-if="previousYearCloseDelta.pct !== null">
                          {{ previousYearCloseDelta.value > 0 ? '+' : ''
                          }}{{ formatPct(previousYearCloseDelta.pct, 1) }}
                        </small>
                      </strong>
                      <strong v-else class="hero-delta-empty">Sin cierre</strong>
                    </div>
                    <div class="hero-delta-row">
                      <span>{{ sameDayPreviousYearLabel }}</span>
                      <strong
                        v-if="sameDayPreviousYearDelta"
                        :class="sameDayPreviousYearDelta.value >= 0 ? 'pos mono' : 'neg mono'"
                      >
                        {{ sameDayPreviousYearDelta.value > 0 ? '+' : ''
                        }}{{ formatNumber(sameDayPreviousYearDelta.value, 0) }} {{ heroUnitLabel }}
                        <small v-if="sameDayPreviousYearDelta.pct !== null">
                          {{ sameDayPreviousYearDelta.value > 0 ? '+' : ''
                          }}{{ formatPct(sameDayPreviousYearDelta.pct, 1) }}
                        </small>
                      </strong>
                      <strong v-else class="hero-delta-empty">Sin histórico diario</strong>
                    </div>
                  </section>
                </div>
              </div>
            </template>
          </AHero>

          <div class="hero-breakdown">
            <div class="hero-comp-side">
              <div class="hero-comp-title">
                <span>Activos</span>
                <b>{{ formatNumber(analysis.assets, 2) }} {{ heroUnitLabel }}</b>
              </div>
              <div class="comp-list">
                <button
                  v-for="(row, index) in heroAssetRows"
                  :key="`asset-${row.key}`"
                  type="button"
                  class="comp-row"
                  :class="{ 'row-active': isHeroCategoryActive(row) }"
                  @click="openEvolutionFromComposition(row)"
                >
                  <span
                    class="comp-dot"
                    :style="{ background: heroCompositionColor(row, index) }"
                  />
                  <span class="comp-label">{{ row.label }}</span>
                  <span class="comp-val mono">
                    {{ formatNumber(row.value, 2) }} {{ heroUnitLabel }}
                    <span class="comp-val-share">· {{ Math.round(row.share * 100) }}%</span>
                  </span>
                </button>
              </div>
              <p v-if="!heroAssetRows.length" class="comp-empty">
                Sin activos para el filtro actual.
              </p>
            </div>

            <div class="hero-comp-side">
              <div class="hero-comp-title">
                <span>Pasivos</span>
                <b>{{ formatNumber(analysis.liabilities, 2) }} {{ heroUnitLabel }}</b>
              </div>
              <div class="comp-list">
                <button
                  v-for="(row, index) in heroLiabilityRows"
                  :key="`liability-${row.key}`"
                  type="button"
                  class="comp-row"
                  :class="{ 'row-active': isHeroCategoryActive(row) }"
                  @click="openEvolutionFromComposition(row)"
                >
                  <span
                    class="comp-dot"
                    :style="{ background: heroCompositionColor(row, index) }"
                  />
                  <span class="comp-label">{{ row.label }}</span>
                  <span class="comp-val mono">
                    {{ formatNumber(row.value, 2) }} {{ heroUnitLabel }}
                    <span class="comp-val-share">· {{ Math.round(row.share * 100) }}%</span>
                  </span>
                </button>
              </div>
              <p v-if="!heroLiabilityRows.length" class="comp-empty">
                Sin pasivos para el filtro actual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeNetWorthTab === 'evolution'" class="sect a-nw-evolution-section">
      <AState v-if="scopedTimelineError" status="error">{{ scopedTimelineError }}</AState>

      <AState v-if="activeEvolutionLoading && activeEvolutionPoints.length === 0" status="loading">
        Cargando evolución...
      </AState>
      <div v-else class="a-nw-evolution-stack">
        <template v-if="activeEvolutionPoints.length > 0">
          <div class="a-nw-evolution-summary">
            <div class="a-nw-evolution-headline">
              <div class="a-nw-evolution-title-row">
                <AButton
                  v-if="evolutionReturnTab"
                  variant="ghost"
                  size="sm"
                  class="a-nw-evolution-back"
                  aria-label="Volver a General"
                  @click="returnFromEvolution"
                >
                  ← General
                </AButton>
                <span class="a-nw-chart-label">{{ activeEvolutionLabel }}</span>
                <div class="a-nw-evolution-scope-inline" aria-label="Ámbito de evolución">
                  <AButton
                    v-for="option in timelineScopeOptions"
                    :key="option.value"
                    size="sm"
                    variant="ghost"
                    :class="{ on: timelineScope === option.value }"
                    @click="setTimelineScope(option.value)"
                  >
                    {{ option.label }}
                  </AButton>
                </div>
              </div>
              <strong>
                {{ formatNumber(activeEvolutionLatest?.value ?? 0, 2) }}
                {{ displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel()) }}
              </strong>
              <p
                v-if="activeEvolutionPeriodDelta"
                class="a-nw-evolution-delta"
                :class="activeEvolutionPeriodDelta.value >= 0 ? 'pos' : 'neg'"
              >
                <span class="mono">
                  {{ activeEvolutionPeriodDelta.value > 0 ? '+' : ''
                  }}{{ formatNumber(activeEvolutionPeriodDelta.value, 0) }}
                  {{ displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel()) }}
                </span>
                <span v-if="activeEvolutionPeriodDelta.pct !== null" class="mono">
                  {{ activeEvolutionPeriodDelta.value > 0 ? '+' : ''
                  }}{{ formatPct(activeEvolutionPeriodDelta.pct, 1) }}
                </span>
                <span>en {{ activeEvolutionPresetLabel }}</span>
              </p>
              <p class="a-nw-evolution-caption">{{ activeEvolutionCaption }}</p>
            </div>
          </div>

          <div class="a-nw-chart-shell">
            <NetWorthEvolutionChart
              :points="activeEvolutionPoints"
              :unit="displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel())"
              :series-label="activeEvolutionLabel"
              :series-color="displayedTimelineSeriesColor"
              :y-axis-min-zero="timelineYAxisStartsAtZero"
            />
          </div>
        </template>

        <AState v-else status="empty">
          No hay historial suficiente para la selección actual.
        </AState>

        <div class="a-nw-evolution-chart-actions">
          <div class="a-nw-evolution-control-group a-nw-evolution-range-group">
            <div class="a-nw-evolution-mini-seg" aria-label="Rango de evolución">
              <AButton
                v-for="preset in timelinePresetOptions"
                :key="preset"
                size="sm"
                variant="ghost"
                :class="{ on: activeTimelinePreset === preset }"
                @click="handleTimelinePreset(preset)"
              >
                {{ timelinePresetLabel(preset) }}
              </AButton>
            </div>
            <div v-if="selectedTimelinePreset === 'custom'" class="a-nw-evolution-date-range">
              <label>
                <span>Desde</span>
                <input v-model="customTimelineDateFrom" class="filter-ctrl" type="date" />
              </label>
              <label>
                <span>Hasta</span>
                <input v-model="customTimelineDateTo" class="filter-ctrl" type="date" />
              </label>
            </div>
          </div>
          <AButton
            v-if="
              timelineFilterLabel && timelineScope === 'total' && timelineGranularity === 'monthly'
            "
            variant="ghost"
            size="sm"
            class="a-nw-evolution-inline-action a-nw-evolution-inline-action-wide"
            @click="resetTimelineSelection"
          >
            Quitar filtro
          </AButton>
        </div>
      </div>
    </section>

    <section v-if="activeNetWorthTab === 'balance'" class="sect">
      <div class="a-nw-mobile-tools" aria-label="Herramientas de balance">
        <input
          v-model="balanceSearch"
          class="filter-ctrl a-nw-mobile-search"
          type="search"
          placeholder="Buscar posición"
          aria-label="Buscar posición patrimonial"
        />
        <span class="a-nw-mobile-count">{{ mobileBalanceRowCount }} posiciones</span>
      </div>

      <AState v-if="balanceGroups.length === 0" status="empty">
        No hay posiciones para el filtro actual.
      </AState>

      <div v-else class="a-nw-balance-wrap">
        <AState v-if="mobileBalanceSections.length === 0" class="a-nw-mobile-empty" status="empty">
          No hay posiciones que coincidan con la búsqueda.
        </AState>

        <div v-else class="a-nw-mobile-balance-list">
          <section
            v-for="section in mobileBalanceSections"
            :key="`mobile-section-${section.kind}`"
            class="a-nw-mobile-section"
          >
            <div
              class="a-nw-mobile-section-head"
              :class="section.kind === 'asset' ? 'is-asset' : 'is-liability'"
            >
              <span>{{ section.label }}</span>
              <span class="mono">
                {{ section.kind === 'liability' ? '−' : '' }}{{ formatNumber(section.total, 0) }}
                {{ heroUnitLabel }}
              </span>
            </div>

            <section
              v-for="group in section.groups"
              :key="`mobile-${group.kind}-${group.key}`"
              class="a-nw-mobile-group"
            >
              <button
                type="button"
                class="a-nw-mobile-group-head"
                :aria-expanded="!isBalanceGroupCollapsed(group)"
                @click="toggleBalanceGroup(group)"
              >
                <span>
                  <strong>{{ group.label }}</strong>
                </span>
                <span class="a-nw-group-head-right">
                  <span class="mono">
                    {{ group.kind === 'liability' ? '−' : '' }}{{ formatNumber(group.total, 0) }}
                    {{ heroUnitLabel }}
                  </span>
                  <span class="a-nw-group-chevron" aria-hidden="true">
                    {{ isBalanceGroupCollapsed(group) ? '▸' : '▾' }}
                  </span>
                </span>
              </button>

              <template v-if="!isBalanceGroupCollapsed(group)">
                <button
                  v-for="row in group.rows"
                  :key="`mobile-row-${row.type}-${row.id}`"
                  type="button"
                  class="a-nw-mobile-row"
                  :class="{ 'row-active': isBalanceRowActive(row) }"
                  @click="openBalanceDetail(row)"
                >
                  <span class="swatch" :class="{ lia: row.type === 'liability' }" />
                  <span class="a-nw-mobile-row-main">
                    <strong>{{ row.name }}</strong>
                    <small>
                      {{ row.subtitle }} · {{ ownershipBadgeForRow(row) ?? 'Sin asignar' }} ·
                      {{ positionSourceLabel(row) }}
                    </small>
                  </span>
                  <span class="a-nw-mobile-row-value mono">
                    <small v-if="foreignAmountLabel(row)">{{ foreignAmountLabel(row) }}</small>
                    <strong :class="{ 'account-value-neg': row.type === 'liability' }">
                      {{ formatNumber(row.value, 0) }} {{ displayCurrencyUnit(row.currency) }}
                    </strong>
                  </span>
                </button>
              </template>
            </section>
          </section>
        </div>

        <table class="tbl a-nw-balance-table">
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Categoría / Subcategoría</th>
              <th>Titular</th>
              <th class="num">Valor</th>
              <th class="a-nw-actions-col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="section in balanceSections" :key="`section-${section.kind}`">
              <tr class="kind-row">
                <td colspan="3">
                  <div
                    class="kind-name"
                    :class="section.kind === 'asset' ? 'kind-name-asset' : 'kind-name-liability'"
                  >
                    {{ section.label }}
                  </div>
                </td>
                <td class="num">
                  <span class="grp-total">
                    {{ section.kind === 'liability' ? '−' : ''
                    }}{{ formatNumber(section.total, 2) }}
                    {{ heroUnitLabel }}
                  </span>
                </td>
                <td></td>
              </tr>

              <template v-for="group in section.groups" :key="`${group.kind}-${group.key}`">
                <tr
                  class="grp-row clickable"
                  :aria-expanded="!isBalanceGroupCollapsed(group)"
                  @click="toggleBalanceGroup(group)"
                >
                  <td colspan="3">
                    <div class="grp-name">
                      <span class="a-nw-group-chevron" aria-hidden="true">
                        {{ isBalanceGroupCollapsed(group) ? '▸' : '▾' }}
                      </span>
                      <span>{{ group.label }}</span>
                    </div>
                  </td>
                  <td class="num">
                    <span class="grp-total">
                      {{ group.kind === 'liability' ? '−' : '' }}{{ formatNumber(group.total, 2) }}
                      {{ heroUnitLabel }}
                    </span>
                  </td>
                  <td></td>
                </tr>

                <template v-if="!isBalanceGroupCollapsed(group)">
                  <tr
                    v-for="row in group.rows"
                    :key="`${row.type}-${row.id}`"
                    class="clickable"
                    :class="{ 'row-active': isBalanceRowActive(row) }"
                    @click="selectPosition(row)"
                  >
                    <td>
                      <div class="name">
                        <span class="swatch" :class="{ lia: row.type === 'liability' }" />
                        <div class="nameMain">{{ row.name }}</div>
                      </div>
                    </td>
                    <td class="tbl-cell-muted">{{ row.subtitle }}</td>
                    <td class="tbl-cell-muted">{{ ownershipBadgeForRow(row) ?? 'Sin asignar' }}</td>
                    <td class="num">
                      <span v-if="foreignAmountLabel(row)" class="foreign-amount">
                        {{ foreignAmountLabel(row) }}
                      </span>
                      <span
                        class="account-value mono"
                        :class="{ 'account-value-neg': row.type === 'liability' }"
                      >
                        {{ formatNumber(row.value, 2) }} {{ displayCurrencyUnit(row.currency) }}
                      </span>
                    </td>
                    <td class="a-nw-actions-col" @click.stop>
                      <ARowMenu
                        :items="rowMenuItems(row)"
                        @select="handleRowMenuAction(row, $event)"
                      />
                    </td>
                  </tr>
                </template>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="activeNetWorthTab === 'balance'" class="a-nw-mobile-create-wrap">
      <div v-if="mobileCreateMenuOpen" class="a-nw-mobile-create-menu">
        <AButton variant="ghost" size="sm" @click="openMobileCreateModal('asset')">
          Añadir activo
        </AButton>
        <AButton variant="ghost" size="sm" @click="openMobileCreateModal('liability')">
          Añadir pasivo
        </AButton>
      </div>
      <AButton
        class="a-nw-mobile-create"
        variant="primary"
        :aria-expanded="mobileCreateMenuOpen"
        aria-label="Añadir posición"
        @click="toggleMobileCreateMenu"
      >
        <span class="a-nw-fab-plus" aria-hidden="true">+</span>
        <span class="a-nw-fab-label">Añadir posición</span>
      </AButton>
    </div>

    <AState v-if="store.error" status="error">
      {{ prettyError() }}
    </AState>

    <NetWorthItemModals
      :show-asset-modal="showAssetModal"
      :show-liability-modal="showLiabilityModal"
      :show-edit-modal="showEditModal"
      :edit-title="editTitle"
      :asset-categories="assetCategories"
      :liability-categories="liabilityCategories"
      :asset-subcategories="assetSubcategories"
      :asset-create-initial="assetCreateInitial"
      :liability-create-initial="liabilityCreateInitial"
      :edit-initial="editInitial"
      :edit-categories="editCategories"
      :edit-kind="editKind"
      :active-assets="activeAssets"
      :item-form-props="itemFormProps"
      :submit-asset-from-view="submitAssetFromView"
      :submit-liability-from-view="submitLiabilityFromView"
      :submit-edit="submitEditWithExpenseReview"
      :close-edit="closeEdit"
      :on-close-asset-modal="closeAssetModal"
      :on-close-liability-modal="closeLiabilityModal"
      :edit-error="editError"
    />

    <BaseModal
      :open="selectedBalanceDetailRow !== null"
      :title="balanceDetailTitle(selectedBalanceDetailRow)"
      variant="sheet"
      panel-class="a-nw-modal-panel a-nw-detail-sheet dir-a dir-a-sheet"
      @close="closeBalanceDetail"
    >
      <template #header="{ titleId, close }">
        <div :id="titleId" class="ui-modal-title a-nw-detail-modal-title">
          {{ balanceDetailTitle(selectedBalanceDetailRow) }}
        </div>
        <div class="a-nw-detail-header-actions">
          <button
            v-if="selectedBalanceDetailRow"
            class="a-nw-detail-header-btn"
            type="button"
            aria-label="Editar posición"
            title="Editar posición"
            @click="editBalanceDetail(selectedBalanceDetailRow)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            class="a-nw-detail-header-btn"
            type="button"
            aria-label="Cerrar detalle"
            title="Cerrar"
            @click="close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </template>

      <div v-if="selectedBalanceDetailRow" class="a-nw-detail">
        <div class="a-nw-detail-head">
          <div class="a-nw-detail-title-row">
            <span
              class="a-nw-detail-kind"
              :class="selectedBalanceDetailRow.type === 'asset' ? 'is-asset' : 'is-liability'"
            >
              {{ positionKindLabel(selectedBalanceDetailRow) }}
            </span>
            <span class="a-nw-detail-source">
              {{ positionSourceLabel(selectedBalanceDetailRow) }}
            </span>
          </div>
          <div>
            <h3>{{ selectedBalanceDetailRow.name }}</h3>
            <p>{{ detailMetaLine(selectedBalanceDetailRow) }}</p>
          </div>
          <div class="a-nw-detail-value-block">
            <strong
              class="mono"
              :class="{ 'account-value-neg': selectedBalanceDetailRow.type === 'liability' }"
            >
              {{ formatNumber(selectedBalanceDetailRow.value, 2) }}
              {{ displayCurrencyUnit(selectedBalanceDetailRow.currency) }}
            </strong>
            <span v-if="foreignAmountLabel(selectedBalanceDetailRow)" class="foreign-amount">
              {{ foreignAmountLabel(selectedBalanceDetailRow) }}
            </span>
          </div>
        </div>

        <div class="a-nw-detail-kpis">
          <div>
            <span>Último valor</span>
            <strong class="mono">
              {{ formatNumber(activeEvolutionLatest?.value ?? selectedBalanceDetailRow.value, 2) }}
              {{ displayCurrencyUnit(selectedBalanceDetailRow.currency) }}
            </strong>
            <small>{{ activeEvolutionLatest?.fullLabel ?? 'Valor actual' }}</small>
          </div>
          <div>
            <span>Cambio mensual</span>
            <strong
              v-if="activeEvolutionMonthlyDelta"
              class="mono"
              :class="activeEvolutionMonthlyDelta.value >= 0 ? 'pos' : 'neg'"
            >
              {{ activeEvolutionMonthlyDelta.value > 0 ? '+' : ''
              }}{{ formatNumber(activeEvolutionMonthlyDelta.value, 0) }}
              {{ displayCurrencyUnit(selectedBalanceDetailRow.currency) }}
            </strong>
            <strong v-else class="mono">-</strong>
            <small v-if="activeEvolutionMonthlyDelta && activeEvolutionMonthlyDelta.pct !== null">
              {{ activeEvolutionMonthlyDelta.value > 0 ? '+' : ''
              }}{{ formatPct(activeEvolutionMonthlyDelta.pct, 1) }}
            </small>
            <small v-else>Sin comparativa</small>
          </div>
          <div>
            <span>Cambio YTD</span>
            <strong
              v-if="activeEvolutionYtdDelta"
              class="mono"
              :class="activeEvolutionYtdDelta.value >= 0 ? 'pos' : 'neg'"
            >
              {{ activeEvolutionYtdDelta.value > 0 ? '+' : ''
              }}{{ formatNumber(activeEvolutionYtdDelta.value, 0) }}
              {{ displayCurrencyUnit(selectedBalanceDetailRow.currency) }}
            </strong>
            <strong v-else class="mono">-</strong>
            <small v-if="activeEvolutionYtdDelta && activeEvolutionYtdDelta.pct !== null">
              {{ activeEvolutionYtdDelta.value > 0 ? '+' : ''
              }}{{ formatPct(activeEvolutionYtdDelta.pct, 1) }}
            </small>
            <small v-else>Sin comparativa</small>
          </div>
        </div>

        <details class="a-nw-detail-more-actions">
          <summary>Más acciones</summary>
          <div class="actions">
            <AButton variant="ghost" @click="archiveBalanceDetail(selectedBalanceDetailRow)">
              Archivar
            </AButton>
            <AButton variant="ghost" @click="deleteBalanceDetail(selectedBalanceDetailRow)">
              Eliminar
            </AButton>
          </div>
        </details>

        <div class="a-nw-detail-grid" role="list" aria-label="Datos de la posición">
          <div role="listitem">
            <span>Categoría</span>
            <strong>{{ selectedBalanceDetailRow.subtitle }}</strong>
          </div>
          <div role="listitem">
            <span>Titularidad</span>
            <strong>{{ ownershipBadgeForRow(selectedBalanceDetailRow) ?? 'Sin asignar' }}</strong>
          </div>
          <div role="listitem">
            <span>Fuente</span>
            <strong>{{ positionSourceLabel(selectedBalanceDetailRow) }}</strong>
          </div>
          <div role="listitem">
            <span>Moneda</span>
            <strong>{{ displayCurrencyUnit(selectedBalanceDetailRow.currency) }}</strong>
          </div>
        </div>

        <div class="a-nw-detail-chart">
          <ASectHead
            title="Evolución propia"
            :subtitle="activeEvolutionPoints.length ? activeEvolutionCaption : undefined"
          />
          <AState
            v-if="activeEvolutionLoading && activeEvolutionPoints.length === 0"
            status="loading"
          >
            Cargando evolución...
          </AState>
          <AState v-else-if="activeEvolutionPoints.length === 0" status="empty">
            No hay historial suficiente para esta posición.
          </AState>
          <NetWorthEvolutionChart
            v-else
            :points="activeEvolutionPoints"
            :unit="displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel())"
            :series-label="activeEvolutionLabel"
            :series-color="displayedTimelineSeriesColor"
            :y-axis-min-zero="timelineYAxisStartsAtZero"
          />
        </div>
      </div>
    </BaseModal>

    <BaseModal
      :open="showArchivedModal"
      title="Cuentas archivadas"
      variant="sheet"
      panel-class="a-nw-modal-panel dir-a"
      @close="showArchivedModal = false"
    >
      <div class="a-nw-modal-stack">
        <AState v-if="archivedItems.length === 0" status="empty">
          No hay cuentas archivadas para el filtro actual.
        </AState>
        <div v-else class="a-nw-archived-list">
          <article
            v-for="item in archivedItems"
            :key="`${item.type}-${item.id}`"
            class="a-nw-archived-card"
          >
            <div>
              <div class="a-nw-archived-title">{{ item.name }}</div>
              <div class="a-nw-archived-meta">
                {{ item.type === 'asset' ? 'Activo' : 'Pasivo' }} · {{ item.category }} ·
                {{ item.owner }}
              </div>
            </div>
            <AButton variant="ghost" @click="unarchiveItem(item)"> Restaurar </AButton>
          </article>
        </div>
      </div>
    </BaseModal>

    <BaseModal
      :open="showGeneratedLiabilityExpenseModal"
      :title="generatedLiabilityExpenseReviewTitle"
      variant="sheet"
      panel-class="a-nw-modal-panel dir-a"
      @close="closeGeneratedLiabilityExpenseModal"
    >
      <div v-if="generatedLiabilityExpenseReview" class="a-nw-modal-stack">
        <div
          v-if="generatedLiabilityExpenseReviewChangeMessage"
          class="a-nw-info-card a-nw-info-card-warn"
        >
          {{ generatedLiabilityExpenseReviewChangeMessage }}
        </div>
        <div class="a-nw-info-card a-nw-info-card-accent">
          Este pasivo generó gastos recurrentes en
          {{ generatedLiabilityExpenseReview.entries.length }}
          anualidades. Revisa su clasificación desde Presupuesto.
        </div>
        <div class="a-nw-generated-list">
          <div
            v-for="entry in generatedLiabilityExpenseReview.entries"
            :key="entry.id"
            class="a-nw-generated-card"
          >
            <div class="a-nw-generated-head">
              <div class="a-nw-generated-title">Ejercicio {{ entry.fiscalYear }}</div>
              <div class="a-nw-generated-amount">
                {{ formatNumber(entry.amountAnnual, 2) }} {{ entry.currency }}
              </div>
            </div>
            <div class="a-nw-generated-meta">
              {{ entry.name }} ·
              {{ assetCategories.find((c) => c.value === entry.category)?.label ?? entry.category }}
              /
              {{
                assetSubcategories.find((s) => s.value === entry.subcategory)?.label ??
                entry.subcategory
              }}
            </div>
          </div>
        </div>
        <div class="actions a-nw-modal-actions">
          <AButton variant="ghost" @click="closeGeneratedLiabilityExpenseModal"> Cerrar </AButton>
          <AButton variant="primary" @click="openGeneratedExpensesInBudget">
            Revisar en Presupuesto
          </AButton>
        </div>
      </div>
    </BaseModal>

    <div v-if="store.loading" class="a-nw-page-status">Actualizando patrimonio...</div>
  </div>
</template>
