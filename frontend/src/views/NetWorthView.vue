<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  NetWorthDonut,
  NetWorthEvolutionChart,
  useNetWorthViewExtensions,
  useNetWorthViewState,
} from '@/domains/net-worth';
import NetWorthItemModals from '@/domains/net-worth/components/NetWorthItemModals.vue';
import type { NetWorthWritePayload } from '@/domains/net-worth/models';
import '@/domains/net-worth/net-worth-view.css';
import { useNetWorthOwnership } from '@/domains/net-worth/useNetWorthOwnership';
import {
  useNetWorthPageMetrics,
  type PositionRow,
} from '@/domains/net-worth/useNetWorthPageMetrics';
import { useNetWorthPageActions } from '@/domains/net-worth/useNetWorthPageActions';
import { useNetWorthTimeline } from '@/domains/net-worth/useNetWorthTimeline';
import {
  AContextBar,
  AHero,
  AInfoHint,
  AMetaPill,
  APageHead,
  ARowMenu,
  ASectHead,
  ASelect,
  type ASelectItem,
  BaseModal,
} from '@/domains/ui';
import { useAnnualExpenseStore } from '@/domains/budget/annual-entries';
import { toApiErrorMessage } from '@/lib/errors';

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
const timelineExpanded = ref(false);
const selectedTimelinePreset = ref<'1m' | '3m' | '6m' | '1a' | '5a' | 'all'>('5a');
const customTimelineWindow = ref<{ start: number; end: number } | null>(null);
const timelinePresetOptions = ['1m', '3m', '6m', '1a', '5a', 'all'] as const;
const activeTimelinePreset = computed(() => selectedTimelinePreset.value);

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
watch(
  [timelineRows, selectedTimelineCategory],
  ([rows, cat]) => {
    if (cat === null) globalTimelineRows.value = rows;
  },
  { immediate: true },
);

const monthlyDelta = computed<{
  value: number;
  pct: number | null;
  lastLabel: string;
  prevLabel: string;
} | null>(() => {
  const rows = globalTimelineRows.value;
  const last = rows[rows.length - 1];
  const prev = rows[rows.length - 2];
  if (!last || !prev) return null;
  const value = last.netWorth - prev.netWorth;
  const pct = prev.netWorth !== 0 ? value / Math.abs(prev.netWorth) : null;
  return { value, pct, lastLabel: last.label, prevLabel: prev.label };
});

const ytdDelta = computed<{ value: number; pct: number | null } | null>(() => {
  const rows = globalTimelineRows.value;
  const last = rows[rows.length - 1];
  if (!last) return null;
  const currentYear = new Date(last.date).getFullYear();
  // Base YTD: primer punto del año en curso; si no hay, el primer punto disponible.
  const baseline = rows.find((row) => new Date(row.date).getFullYear() === currentYear) ?? rows[0];
  if (!baseline || baseline === last) return null;
  const value = last.netWorth - baseline.netWorth;
  const pct = baseline.netWorth !== 0 ? value / Math.abs(baseline.netWorth) : null;
  return { value, pct };
});

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

function openPrimaryCreateModal(): void {
  openCreateModal('asset', null);
}

function isBalanceGroupActive(group: BalanceGroup): boolean {
  return (
    selectedTimelineCategory.value === group.key &&
    selectedTimelineCategoryType.value === group.kind
  );
}

function isBalanceRowActive(row: PositionRow): boolean {
  return selectedPositionType.value === row.type && selectedPositionId.value === row.id;
}

function isHeroCategoryActive(row: HeroCompositionRow): boolean {
  return (
    selectedTimelineCategory.value === row.key && selectedTimelineCategoryType.value === row.kind
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
  return `(${formatNumber(toNumber(rawAmount), 2)} ${sourceCurrency})`;
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
  displayedTimelineLoading,
  visibleTimelineRows,
  timelineWindow,
  timelineChartPoints,
  timelineRangeCaption,
  latestTimelineChartPoint,
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

const {
  openCreateModal,
  submitAssetFromView,
  submitLiabilityFromView,
  resetTimelineSelection,
  applyCompositionCategoryFilter,
  selectPosition,
  setTimelinePreset,
  updateTimelineWindowStart,
  updateTimelineWindowEnd,
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
</script>

<template>
  <div class="page a-nw-page">
    <APageHead title="Patrimonio">
      <template #meta>
        <AMetaPill>{{ asOfLabel }}</AMetaPill>
        <span class="dot"></span>
        <span>Base {{ store.baseCurrency ?? 'EUR' }}</span>
        <span v-if="valueMode === 'real' || archivedItemsCount" class="dot"></span>
        <span v-if="valueMode === 'real'">{{ modeLabel() }}</span>
        <button
          v-if="archivedItemsCount"
          class="btn btn-ghost a-nw-archived-trigger"
          type="button"
          @click="showArchivedModal = true"
        >
          Archivadas {{ archivedItemsCount }}
        </button>
      </template>
      <template #actions>
        <button class="btn btn-primary" type="button" @click="openPrimaryCreateModal">
          + Añadir cuenta
        </button>
      </template>
    </APageHead>

    <AContextBar>
      <label class="context-field" data-test="ownership-filter">
        <span class="context-field-label">Titularidad</span>
        <ASelect
          class="filter-ctrl"
          :model-value="String(ownershipFilter)"
          :options="ownershipSelectOptions"
          :disabled="ownershipFilterDisabled"
          :searchable="false"
          @update:model-value="(v) => setOwnershipFilter(v === 'all' ? 'all' : Number(v))"
        />
      </label>

      <div class="context-divider"></div>

      <label class="context-field">
        <span class="context-field-label">Moneda</span>
        <ASelect
          class="filter-ctrl"
          :model-value="store.baseCurrency ?? 'EUR'"
          :options="currencySelectOptions"
          :searchable="false"
          @update:model-value="(v) => store.updateBaseCurrency(String(v))"
        />
      </label>

      <div class="context-divider"></div>

      <div class="context-field">
        <span class="context-field-label">Valoración</span>
        <div class="seg">
          <button
            type="button"
            :class="{ on: valueMode === 'nominal' }"
            @click="setValueMode('nominal')"
          >
            Nominal
          </button>
          <button
            v-if="canShowReal()"
            type="button"
            :class="{ on: valueMode === 'real' }"
            @click="setValueMode('real')"
          >
            Real
          </button>
        </div>
        <span v-if="valueMode === 'real' && realBaseLabel" class="a-nw-context-note">
          {{ realBaseLabel }}
        </span>
      </div>
    </AContextBar>

    <section class="sect">
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
              <template v-if="monthlyDelta">
                <span>
                  <span :class="monthlyDelta.value >= 0 ? 'pos mono' : 'neg mono'">
                    {{ monthlyDelta.value > 0 ? '+' : '' }}{{ formatNumber(monthlyDelta.value, 0) }}
                    {{ heroUnitLabel }}
                  </span>
                  <span
                    v-if="monthlyDelta.pct !== null"
                    :class="
                      monthlyDelta.value >= 0
                        ? 'pos mono hero-delta-pct'
                        : 'neg mono hero-delta-pct'
                    "
                  >
                    ({{ monthlyDelta.value > 0 ? '+' : '' }}{{ formatPct(monthlyDelta.pct, 1) }})
                  </span>
                  <span class="hero-delta-copy">este mes</span>
                </span>
              </template>
              <template v-else>
                <span>Sin comparativa mensual todavía</span>
              </template>
              <template v-if="ytdDelta">
                <span class="hero-delta-sep">·</span>
                <span>
                  <span :class="ytdDelta.value >= 0 ? 'pos mono' : 'neg mono'">
                    {{ ytdDelta.value > 0 ? '+' : '' }}{{ formatNumber(ytdDelta.value, 0) }}
                    {{ heroUnitLabel }}
                  </span>
                  <span
                    v-if="ytdDelta.pct !== null"
                    :class="
                      ytdDelta.value >= 0 ? 'pos mono hero-delta-pct' : 'neg mono hero-delta-pct'
                    "
                  >
                    ({{ ytdDelta.value > 0 ? '+' : '' }}{{ formatPct(ytdDelta.pct, 1) }})
                  </span>
                  <span class="hero-delta-copy">YTD</span>
                </span>
              </template>
            </template>
          </AHero>

          <div class="hero-donut">
            <NetWorthDonut
              :total-assets="analysis.assets"
              :total-liabilities="analysis.liabilities"
              :asset-backed-liabilities="analysis.backedDebt"
              :unbacked-liabilities="analysis.unbackedDebt"
              :net-worth="analysis.netWorth"
              :unit="heroUnitLabel"
              :show-composition="false"
              center-label="Capital propio"
              :center-value="formatPct(analysis.equityRatio, 0)"
            />
          </div>

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
                  @click="applyCompositionCategoryFilter({ key: row.key, type: row.kind })"
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
                  @click="applyCompositionCategoryFilter({ key: row.key, type: row.kind })"
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

    <section class="sect">
      <ASectHead
        title="Evolución"
        :subtitle="timelineFilterLabel ? `Filtrando: ${timelineFilterLabel}` : undefined"
      >
        <template #hint>
          <AInfoHint label="Sobre la evolución">Patrimonio neto en el tiempo.</AInfoHint>
        </template>
        <template #actions>
          <div class="actions">
            <button
              v-if="timelineFilterLabel"
              class="btn btn-ghost"
              type="button"
              @click="resetTimelineSelection"
            >
              Quitar filtro
            </button>
            <div class="seg">
              <button
                v-for="preset in timelinePresetOptions"
                :key="preset"
                type="button"
                :class="{ on: activeTimelinePreset === preset }"
                @click="setTimelinePreset(preset)"
              >
                {{ preset }}
              </button>
            </div>
            <button
              v-if="timelineChartPoints.length > 1"
              class="btn btn-ghost"
              type="button"
              @click="timelineExpanded = true"
            >
              Ampliar
            </button>
          </div>
        </template>
      </ASectHead>

      <div
        v-if="displayedTimelineLoading && timelineChartPoints.length === 0"
        class="a-nw-state a-nw-state-loading"
      >
        Cargando evolución...
      </div>
      <div v-else-if="timelineChartPoints.length === 0" class="a-nw-state a-nw-state-empty">
        No hay historial suficiente para la selección actual.
      </div>
      <div v-else class="a-nw-chart-stack">
        <div class="a-nw-chart-summary">
          <div>
            <span class="a-nw-chart-label">{{ timelineSummaryLabel }}</span>
            <strong>
              {{ formatNumber(latestTimelineChartPoint?.value ?? 0, 2) }}
              {{ displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel()) }}
            </strong>
          </div>
          <span>{{ timelineRangeCaption }}</span>
        </div>
        <div class="a-nw-chart-shell">
          <NetWorthEvolutionChart
            :points="timelineChartPoints"
            :unit="displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel())"
            :series-label="timelineSummaryLabel"
            :series-color="displayedTimelineSeriesColor"
            :y-axis-min-zero="timelineYAxisStartsAtZero"
          />
        </div>
      </div>

      <BaseModal
        :open="timelineExpanded"
        title="Evolución temporal"
        variant="sheet"
        panel-class="a-nw-modal-panel dir-a"
        @close="timelineExpanded = false"
      >
        <div class="a-nw-modal-stack">
          <div class="a-nw-chart-summary">
            <div>
              <span class="a-nw-chart-label">{{ timelineSummaryLabel }}</span>
              <strong>
                {{ formatNumber(latestTimelineChartPoint?.value ?? 0, 2) }}
                {{ displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel()) }}
              </strong>
            </div>
            <span>{{ timelineRangeCaption }}</span>
          </div>

          <div class="a-nw-range-grid">
            <label class="a-nw-range-field">
              <span>Inicio</span>
              <input
                class="a-nw-range-input"
                type="range"
                min="0"
                :max="Math.max(0, visibleTimelineRows.length - 1)"
                :value="timelineWindow.start"
                @input="updateTimelineWindowStart(($event.target as HTMLInputElement).value)"
              />
              <strong>{{ timelineChartPoints[0]?.fullLabel ?? '-' }}</strong>
            </label>
            <label class="a-nw-range-field">
              <span>Fin</span>
              <input
                class="a-nw-range-input"
                type="range"
                min="0"
                :max="Math.max(0, visibleTimelineRows.length - 1)"
                :value="timelineWindow.end"
                @input="updateTimelineWindowEnd(($event.target as HTMLInputElement).value)"
              />
              <strong>{{ latestTimelineChartPoint?.fullLabel ?? '-' }}</strong>
            </label>
          </div>

          <div class="a-nw-chart-shell a-nw-chart-shell-expanded">
            <NetWorthEvolutionChart
              :points="timelineChartPoints"
              :unit="displayCurrencyUnit(store.timeline?.base_currency ?? unitLabel())"
              :series-label="timelineSummaryLabel"
              :series-color="displayedTimelineSeriesColor"
              :y-axis-min-zero="timelineYAxisStartsAtZero"
              expanded
            />
          </div>
        </div>
      </BaseModal>
    </section>

    <section class="sect">
      <ASectHead title="Balance">
        <template #hint>
          <AInfoHint label="Sobre el balance">
            Activos y pasivos por categoría con filtrado cruzado hacia la evolución.
          </AInfoHint>
        </template>
      </ASectHead>

      <div v-if="balanceGroups.length === 0" class="a-nw-state a-nw-state-empty">
        No hay posiciones para el filtro actual.
      </div>

      <div v-else class="a-nw-balance-wrap">
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
            <template v-for="group in balanceGroups" :key="`${group.kind}-${group.key}`">
              <tr
                class="grp-row clickable"
                :class="{ 'row-active': isBalanceGroupActive(group) }"
                @click="applyCompositionCategoryFilter({ key: group.key, type: group.kind })"
              >
                <td colspan="3">
                  <div class="grp-name">
                    <span
                      class="grp-kind"
                      :class="group.kind === 'asset' ? 'grp-kind-asset' : 'grp-kind-liability'"
                    >
                      {{ group.kind === 'asset' ? 'ACTIVOS' : 'PASIVOS' }}
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
                  <ARowMenu :items="rowMenuItems(row)" @select="handleRowMenuAction(row, $event)" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="store.error" class="a-nw-state a-nw-state-error">
      {{ prettyError() }}
    </div>

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
      :open="showArchivedModal"
      title="Cuentas archivadas"
      variant="sheet"
      panel-class="a-nw-modal-panel dir-a"
      @close="showArchivedModal = false"
    >
      <div class="a-nw-modal-stack">
        <div v-if="archivedItems.length === 0" class="a-nw-state a-nw-state-empty">
          No hay cuentas archivadas para el filtro actual.
        </div>
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
            <button class="btn btn-ghost" type="button" @click="unarchiveItem(item)">
              Restaurar
            </button>
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
          <button class="btn btn-ghost" type="button" @click="closeGeneratedLiabilityExpenseModal">
            Cerrar
          </button>
          <button class="btn btn-primary" type="button" @click="openGeneratedExpensesInBudget">
            Revisar en Presupuesto
          </button>
        </div>
      </div>
    </BaseModal>

    <div v-if="store.loading" class="a-nw-page-status">Actualizando patrimonio...</div>
  </div>
</template>
