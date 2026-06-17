<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  type AnnualExpenseEntry,
  type AnnualIncomeEntry,
  AnnualEntryModalForm,
} from '@/domains/budget/annual-entries';
import { normalizeExpenseTaxonomy } from '@/domains/budget/taxonomy';
import { effectiveAnnualAmountForEntry } from '@/domains/budget/annual-entries/annualEntryUtils';
import BudgetBarCell from './BudgetBarCell.vue';

const router = useRouter();

type BudgetSection = {
  id: 'income' | 'expense';
  title: string;
  subtitle: string;
  emptyMessage: string;
  toneClass: string;
  totalAnnual: number;
  filterMode: 'all' | 'recurrent' | 'one_off';
  categoryCount: number;
  subcategoryCount: number;
  groups: any[];
};

type BudgetRow = {
  key: string;
  categoryKey: string;
  categoryLabel: string;
  subcategoryKey: string;
  subcategoryLabel: string;
  plannedAnnual: number;
  itemsCount: number;
};

type ContextPanel = {
  sectionId: 'income' | 'expense';
  row: BudgetRow;
};

type RowEntry = AnnualIncomeEntry | AnnualExpenseEntry;
type BudgetExecutionTone = 'neutral' | 'good' | 'warn' | 'danger';
type BudgetExecutionPreview = {
  ratio: number;
  widthPct: number;
  tone: BudgetExecutionTone;
  overflow: boolean;
};
type BudgetActualExecution = BudgetExecutionPreview & {
  planned: number;
  executed: number;
  deviation: number;
  completionRatio: number;
};

const props = defineProps<{
  isMonthlyCloseView: boolean;
  showMonthBar?: boolean;
  hasAnyPlannedData: boolean;
  isLoading: boolean;
  fiscalYear: number;
  sections: BudgetSection[];
  monthLabels: string[];
  incomeEvolutionMonths: any[];
  incomeEvolutionBaseMonthly: number;
  expenseEvolutionMonths: any[];
  expenseEvolutionBaseMonthly: number;
  selectedExecutionMonthLabel: string;
  budgetDetailMonth: number;
  budgetDetailMonthLabel: string;
  updateBudgetDetailMonth: (month: number) => void;
  budgetSectionActualExecution: (sectionId: 'income' | 'expense') => BudgetActualExecution | null;
  formatMoney: (value: number, decimals?: number) => string;
  formatCompactMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
  isSectionExpanded: (sectionId: 'income' | 'expense') => boolean;
  toggleSectionExpanded: (sectionId: 'income' | 'expense') => void;
  budgetCategoryActualExecution: (...args: any[]) => any;
  budgetSubcategoryActualExecution: (...args: any[]) => any;
  incomeInvestmentRotationCategoryAdjustment?: (...args: any[]) => number;
  incomeInvestmentRotationSubcategoryAdjustment?: (...args: any[]) => number;
  incomeExecutionYtdTotals: {
    planned: number;
    executedBudgeted: number;
    executedUnbudgeted: number;
    executedTotal: number;
  };
  expenseExecutionYtdTotals: {
    planned: number;
    executedBudgeted: number;
    executedUnbudgeted: number;
    executedTotal: number;
  };
  executionPreview: (...args: any[]) => any;
  updateIncomeViewMode: (mode: 'all' | 'recurrent' | 'one_off') => void;
  updateExpenseViewMode: (mode: 'all' | 'recurrent' | 'one_off') => void;
  onSubmitAnnualIncome?: () => Promise<void> | void;
  onSubmitAnnualExpense?: () => Promise<void> | void;
  onRemoveAnnualIncome?: (entryId: number) => Promise<void> | void;
  onRemoveAnnualExpense?: (entryId: number) => Promise<void> | void;
  annualEntriesPage: any | null;
  filteredIncomeEntries: AnnualIncomeEntry[];
  filteredExpenseEntries: AnnualExpenseEntry[];
  ownershipFilter: string;
  selectedOwnershipFilterLabel: string;
}>();

const activeContext = ref<ContextPanel | null>(null);
const expandedGroups = ref<Record<string, boolean>>({});

function isGroupExpanded(categoryKey: string): boolean {
  return !!expandedGroups.value[categoryKey];
}

function toggleGroup(categoryKey: string): void {
  expandedGroups.value = {
    ...expandedGroups.value,
    [categoryKey]: !expandedGroups.value[categoryKey],
  };
}

function goToMovements(categoryKey: string, subcategoryKey?: string): void {
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const dateFrom = fmt(new Date(props.fiscalYear, 0, 1));
  const dateTo = fmt(new Date(props.fiscalYear, props.budgetDetailMonth, 0));
  const query: Record<string, string> = {
    tab: 'todos',
    date_from: dateFrom,
    date_to: dateTo,
    category_key: categoryKey,
  };
  if (subcategoryKey) query.subcategory_key = subcategoryKey;
  router.push({ name: 'accounting-movements', query });
}

function matchesRowTaxonomy(
  sectionId: 'income' | 'expense',
  entry: RowEntry,
  row: BudgetRow,
): boolean {
  if (sectionId === 'income') {
    return entry.category === row.categoryKey && entry.subcategory === row.subcategoryKey;
  }
  const normalized = normalizeExpenseTaxonomy(entry.category, entry.subcategory);
  return normalized.category === row.categoryKey && normalized.subcategory === row.subcategoryKey;
}

const contextIncomeEntries = computed(() => {
  const context = activeContext.value;
  if (!context || context.sectionId !== 'income') return [];
  return props.filteredIncomeEntries.filter((entry) => {
    if (!matchesRowTaxonomy('income', entry, context.row)) return false;
    if (props.sections.find((section) => section.id === 'income')?.filterMode === 'recurrent') {
      return entry.incomeType === 'recurrent';
    }
    if (props.sections.find((section) => section.id === 'income')?.filterMode === 'one_off') {
      return entry.incomeType === 'one_off';
    }
    return true;
  });
});

const contextExpenseEntries = computed(() => {
  const context = activeContext.value;
  if (!context || context.sectionId !== 'expense') return [];
  return props.filteredExpenseEntries.filter((entry) => {
    if (!matchesRowTaxonomy('expense', entry, context.row)) return false;
    if (props.sections.find((section) => section.id === 'expense')?.filterMode === 'recurrent') {
      return entry.expenseType === 'recurrent';
    }
    if (props.sections.find((section) => section.id === 'expense')?.filterMode === 'one_off') {
      return entry.expenseType === 'one_off';
    }
    return true;
  });
});

function isContextOpen(sectionId: 'income' | 'expense', rowKey: string): boolean {
  return activeContext.value?.sectionId === sectionId && activeContext.value?.row.key === rowKey;
}

function toggleContext(sectionId: 'income' | 'expense', row: BudgetRow): void {
  if (isContextOpen(sectionId, row.key)) {
    activeContext.value = null;
    return;
  }
  activeContext.value = { sectionId, row };
}

// Modelo normalizado de barra de ejecución para `BudgetBarCell` (columna Ejecución).
type BudgetBarModel = {
  tone: BudgetExecutionTone;
  widthPct: number;
  overflow: boolean;
  ratio: number;
  deviation: number;
  executed: number;
  planned: number;
  hasData: boolean;
} | null;

function sectionBar(sectionId: 'income' | 'expense'): BudgetBarModel {
  const exec = props.budgetSectionActualExecution(sectionId);
  if (!exec) return null;
  return {
    tone: exec.tone,
    widthPct: exec.widthPct,
    overflow: exec.overflow,
    ratio: exec.ratio,
    deviation: exec.deviation,
    executed: exec.executed,
    planned: exec.planned,
    hasData: true,
  };
}

function categoryBar(
  sectionId: 'income' | 'expense',
  group: { categoryKey: string; plannedAnnual: number; rows: any[] },
): BudgetBarModel {
  const exec = props.budgetCategoryActualExecution(sectionId, group.categoryKey);
  if (exec) {
    return {
      tone: exec.tone,
      widthPct: exec.widthPct,
      overflow: exec.overflow,
      ratio: exec.ratio,
      deviation: exec.deviation,
      executed: exec.executed,
      planned: exec.planned,
      hasData: true,
    };
  }
  if (group.plannedAnnual > 0 || group.rows.some((r: any) => r.detectedUnbudgeted)) {
    const preview = groupExecutionPreview(sectionId, group);
    return {
      tone: preview.tone,
      widthPct: preview.widthPct,
      overflow: preview.overflow,
      ratio: preview.ratio,
      deviation: 0,
      executed: 0,
      planned: group.plannedAnnual,
      hasData: false,
    };
  }
  return null;
}

function subcategoryBar(sectionId: 'income' | 'expense', row: BudgetRow): BudgetBarModel {
  const exec = props.budgetSubcategoryActualExecution(sectionId, row.key);
  if (exec) {
    return {
      tone: exec.tone,
      widthPct: exec.widthPct,
      overflow: exec.overflow,
      ratio: exec.ratio,
      deviation: exec.deviation,
      executed: exec.executed,
      planned: exec.planned,
      hasData: true,
    };
  }
  if (row.itemsCount > 0) {
    return {
      tone: 'neutral',
      widthPct: 0,
      overflow: false,
      ratio: 0,
      deviation: 0,
      executed: 0,
      planned: row.plannedAnnual,
      hasData: false,
    };
  }
  return null;
}

function openCreateForSection(sectionId: 'income' | 'expense'): void {
  if (!props.annualEntriesPage) return;
  const owner = props.ownershipFilter === 'all' ? '' : props.selectedOwnershipFilterLabel;
  if (sectionId === 'income') {
    props.annualEntriesPage.openIncomeModal();
    props.annualEntriesPage.patchAnnualIncomeForm({ owner });
    return;
  }
  props.annualEntriesPage.openExpenseModal();
  props.annualEntriesPage.patchAnnualExpenseForm({ owner });
}

function openCreateForCategory(sectionId: 'income' | 'expense', categoryKey: string): void {
  if (!props.annualEntriesPage) return;
  if (sectionId === 'income') {
    props.annualEntriesPage.openIncomeModal();
    props.annualEntriesPage.patchAnnualIncomeForm({
      category: categoryKey,
      owner: props.ownershipFilter === 'all' ? '' : props.selectedOwnershipFilterLabel,
    });
    return;
  }
  props.annualEntriesPage.openExpenseModal();
  props.annualEntriesPage.patchAnnualExpenseForm({
    category: categoryKey,
    owner: props.ownershipFilter === 'all' ? '' : props.selectedOwnershipFilterLabel,
  });
}

function openCreateDirect(sectionId: 'income' | 'expense', row: BudgetRow): void {
  if (!props.annualEntriesPage) return;
  if (sectionId === 'income') {
    props.annualEntriesPage.openIncomeModal();
    props.annualEntriesPage.patchAnnualIncomeForm({
      category: row.categoryKey,
      subcategory: row.subcategoryKey,
      owner: props.ownershipFilter === 'all' ? '' : props.selectedOwnershipFilterLabel,
    });
    return;
  }
  props.annualEntriesPage.openExpenseModal();
  props.annualEntriesPage.patchAnnualExpenseForm({
    category: row.categoryKey,
    subcategory: row.subcategoryKey,
    owner: props.ownershipFilter === 'all' ? '' : props.selectedOwnershipFilterLabel,
  });
}

function isOneOffEntry(entry: RowEntry): boolean {
  if ('incomeType' in entry) return entry.incomeType === 'one_off';
  return entry.expenseType === 'one_off';
}

function targetMonthLabel(targetMonth?: number | null): string {
  const month = Number(targetMonth ?? 0);
  if (Number.isFinite(month) && month >= 1 && month <= 12) {
    return props.monthLabels[month - 1] ?? `mes ${month}`;
  }
  return 'mes objetivo';
}

function recurringMonthlyPlannedAmount(entry: RowEntry): number {
  const annual = effectiveAnnualAmountForEntry(entry, entry.fiscalYear);
  if (!Number.isFinite(annual) || annual <= 0 || isOneOffEntry(entry)) return 0;
  if (
    'timeProfile' in entry &&
    entry.timeProfile === 'term_recurrent' &&
    (entry.termEndYear == null || entry.termEndYear === entry.fiscalYear)
  ) {
    const months = Math.min(12, Math.max(1, Number(entry.termEndMonth ?? 12)));
    return annual / months;
  }
  return annual / 12;
}

function entriesForRow(sectionId: 'income' | 'expense', row: BudgetRow): RowEntry[] {
  const source =
    sectionId === 'income' ? props.filteredIncomeEntries : props.filteredExpenseEntries;
  return source.filter((entry) => matchesRowTaxonomy(sectionId, entry, row));
}

function rowPlannedMeta(sectionId: 'income' | 'expense', row: BudgetRow): string {
  const entries = entriesForRow(sectionId, row);
  const total = entries.reduce(
    (sum, entry) => sum + effectiveAnnualAmountForEntry(entry, entry.fiscalYear),
    0,
  );
  const count = entries.length || row.itemsCount;
  const countText = `${count} registro${count === 1 ? '' : 's'}`;
  if (!entries.length) {
    return `${countText} - ${props.formatMoney(row.plannedAnnual / 12)} EUR/mes previsto`;
  }
  const oneOffEntries = entries.filter((entry) => isOneOffEntry(entry));
  if (oneOffEntries.length === entries.length) {
    const uniqueMonths = new Set<number>(
      oneOffEntries
        .map((entry) => Number(entry.targetMonth))
        .filter((month) => Number.isFinite(month) && month >= 1 && month <= 12),
    );
    if (uniqueMonths.size === 1) {
      const month = Array.from(uniqueMonths)[0];
      return `${countText} - ${props.formatMoney(total)} EUR en ${targetMonthLabel(month)} previsto`;
    }
    return `${countText} - ${props.formatMoney(total)} EUR puntual previsto`;
  }
  if (oneOffEntries.length > 0) {
    const recurringEntries = entries.filter((entry) => !isOneOffEntry(entry));
    const recurringMonthly = recurringEntries.reduce(
      (sum, entry) => sum + recurringMonthlyPlannedAmount(entry),
      0,
    );
    const oneOffTotal = oneOffEntries.reduce(
      (sum, entry) => sum + Number(entry.amountAnnual ?? 0),
      0,
    );
    const uniqueMonths = new Set<number>(
      oneOffEntries
        .map((entry) => Number(entry.targetMonth))
        .filter((month) => Number.isFinite(month) && month >= 1 && month <= 12),
    );
    if (recurringMonthly > 0 && uniqueMonths.size === 1) {
      const month = Array.from(uniqueMonths)[0];
      return `${countText} - ${props.formatMoney(recurringMonthly)} EUR/mes + ${props.formatMoney(oneOffTotal)} EUR en ${targetMonthLabel(month)}`;
    }
    if (recurringMonthly > 0) {
      return `${countText} - ${props.formatMoney(recurringMonthly)} EUR/mes + ${props.formatMoney(oneOffTotal)} EUR puntual`;
    }
  }
  const entriesWithTargetMonth = entries.filter((entry) => entry.targetMonth != null);
  if (entriesWithTargetMonth.length === entries.length) {
    const uniqueMonths = new Set<number>(
      entriesWithTargetMonth
        .map((entry) => Number(entry.targetMonth))
        .filter((month) => Number.isFinite(month) && month >= 1 && month <= 12),
    );
    if (uniqueMonths.size === 1) {
      const month = Array.from(uniqueMonths)[0];
      return `${countText} - ${props.formatMoney(total)} EUR en ${targetMonthLabel(month)} previsto`;
    }
    return `${countText} - ${props.formatMoney(total)} EUR en meses previstos`;
  }
  return `${countText} - ${props.formatMoney(total / 12)} EUR/mes previsto`;
}

function groupExecutionPreview(
  sectionId: 'income' | 'expense',
  group: { categoryKey: string; plannedAnnual: number },
): BudgetExecutionPreview {
  if ((Number(group.plannedAnnual) || 0) <= 0) {
    return { ratio: 0, widthPct: 0, tone: 'neutral', overflow: false };
  }
  return props.executionPreview(sectionId, `group:${group.categoryKey}`) as BudgetExecutionPreview;
}

function sectionYtdTotals(sectionId: 'income' | 'expense') {
  return sectionId === 'income' ? props.incomeExecutionYtdTotals : props.expenseExecutionYtdTotals;
}

function execBarClass(point: any, sectionId: 'income' | 'expense'): string {
  if (!('hasExecuted' in point) || !point.hasExecuted) return 'bdg-evo-exec-pending';
  const planned = Number(point.planned ?? 0);
  const executed = Number(point.executed ?? 0);
  if (planned <= 0) return 'bdg-evo-exec-good';
  const ratio = executed / planned;
  if (sectionId === 'income') {
    if (ratio >= 1) return 'bdg-evo-exec-good';
    if (ratio >= 0.85) return 'bdg-evo-exec-warn';
    return 'bdg-evo-exec-danger';
  } else {
    if (ratio > 1.05) return 'bdg-evo-exec-danger';
    if (ratio >= 0.95) return 'bdg-evo-exec-warn';
    return 'bdg-evo-exec-good';
  }
}

function visibleEvolutionMonths(sectionId: 'income' | 'expense') {
  const months =
    sectionId === 'income' ? props.incomeEvolutionMonths : props.expenseEvolutionMonths;
  const visible = months.slice(0, props.budgetDetailMonth);
  const maxVal = Math.max(
    1,
    ...visible.map((m: any) => Math.max(Number(m.planned ?? 0), Number(m.executed ?? 0))),
  );
  return visible.map((m: any) => ({
    ...m,
    planHeightPct:
      Number(m.planned) > 0 ? Math.max(6, Math.min(100, (Number(m.planned) / maxVal) * 100)) : 0,
    execHeightPct:
      Number(m.executed) > 0 ? Math.max(6, Math.min(100, (Number(m.executed) / maxVal) * 100)) : 0,
  }));
}

function openEditIncome(entry: AnnualIncomeEntry): void {
  props.annualEntriesPage?.openIncomeModal(entry);
}

function openEditExpense(entry: AnnualExpenseEntry): void {
  props.annualEntriesPage?.openExpenseModal(entry);
}

async function removeIncome(entry: AnnualIncomeEntry): Promise<void> {
  if (!props.annualEntriesPage) return;
  if (props.onRemoveAnnualIncome) {
    await props.onRemoveAnnualIncome(entry.id);
    return;
  }
  await props.annualEntriesPage.removeAnnualIncome(entry.id);
}

async function removeExpense(entry: AnnualExpenseEntry): Promise<void> {
  if (!props.annualEntriesPage) return;
  if (props.onRemoveAnnualExpense) {
    await props.onRemoveAnnualExpense(entry.id);
    return;
  }
  await props.annualEntriesPage.removeAnnualExpense(entry.id);
}
</script>

<template>
  <div v-if="!hasAnyPlannedData && !isLoading" class="bdg-empty">
    <p class="eyebrow">Presupuesto anual</p>
    <h2>Sin presupuesto anual para {{ fiscalYear }}</h2>
    <p>Usa «+ Nueva partida» para añadir ingresos y gastos previstos para {{ fiscalYear }}.</p>
  </div>

  <div v-show="showMonthBar && sections.some((s) => s.groups.length > 0)" class="bdg-month-bar">
    <span class="bdg-month-bar-label">Ver acumulado hasta</span>
    <div class="seg" role="group" aria-label="Mes de detalle">
      <button
        v-for="(label, i) in monthLabels"
        :key="i"
        type="button"
        :class="{ on: budgetDetailMonth === i + 1 }"
        @click="updateBudgetDetailMonth(i + 1)"
      >
        {{ label }}
      </button>
    </div>
  </div>

  <section
    v-for="section in sections"
    :key="section.id"
    class="sect"
    :class="`bdg-sect-${section.id}`"
  >
    <div class="sect-head">
      <div>
        <h2 class="sect-title">
          {{ section.title }}
          <span class="sect-count">
            {{ section.categoryCount }} categorías · {{ formatMoney(section.totalAnnual) }} EUR
            previsto · {{ formatMoney(section.totalAnnual / 12) }} EUR/mes
          </span>
        </h2>
        <p class="sect-sub">{{ section.subtitle }}</p>
      </div>
      <div class="actions">
        <button
          type="button"
          class="btn btn-ghost bdg-sect-action"
          @click="openCreateForSection(section.id)"
        >
          + Añadir partida
        </button>
      </div>
    </div>

    <div class="bdg-coverage">
      <div class="bdg-coverage-kpi">
        <span class="bdg-coverage-label">Ejecutado real (YTD)</span>
        <strong>{{ formatMoney(sectionYtdTotals(section.id).executedTotal) }} EUR</strong>
      </div>
      <div class="bdg-coverage-kpi">
        <span class="bdg-coverage-label">Previsto (YTD)</span>
        <strong>{{ formatMoney(sectionYtdTotals(section.id).planned) }} EUR</strong>
      </div>
      <div class="bdg-coverage-kpi bdg-coverage-kpi-alert">
        <span class="bdg-coverage-label">Fuera de presupuesto (YTD)</span>
        <strong>{{ formatMoney(sectionYtdTotals(section.id).executedUnbudgeted) }} EUR</strong>
      </div>
    </div>

    <div class="bdg-evolution">
      <div class="bdg-evolution-head">
        <div>
          <h3>Evolución previsto vs ejecutado</h3>
          <p v-if="section.id === 'income'">
            Por mes, según los check-ins del cierre mensual
            {{
              section.filterMode === 'recurrent'
                ? '(ingresos recurrentes).'
                : section.filterMode === 'one_off'
                  ? '(ingresos puntuales).'
                  : '(todos los ingresos).'
            }}
          </p>
          <p v-else>
            Por mes, según los check-ins del cierre mensual
            {{
              section.filterMode === 'recurrent'
                ? '(gastos recurrentes).'
                : section.filterMode === 'one_off'
                  ? '(gastos puntuales).'
                  : '(todos los gastos).'
            }}
          </p>
        </div>
      </div>

      <div
        class="bdg-evolution-bars"
        :style="{ gridTemplateColumns: `repeat(${budgetDetailMonth}, minmax(0, 1fr))` }"
        :aria-label="
          section.id === 'income'
            ? 'Barras de evolución de ingresos previsto vs ejecutado por mes'
            : 'Barras de evolución de gastos previsto vs ejecutado por mes'
        "
      >
        <div
          v-for="point in visibleEvolutionMonths(section.id)"
          :key="`${section.id}-${point.label}`"
          class="bdg-evo-col"
        >
          <div class="bdg-evo-rail">
            <div
              class="bdg-evo-plan"
              :style="'planHeightPct' in point ? { height: `${point.planHeightPct}%` } : undefined"
              :title="
                'planned' in point
                  ? `Previsto ${point.label}: ${formatMoney(Number(point.planned))} EUR`
                  : undefined
              "
            />
            <div
              class="bdg-evo-exec"
              :class="execBarClass(point, section.id)"
              :style="'execHeightPct' in point ? { height: `${point.execHeightPct}%` } : undefined"
              :title="
                'executed' in point
                  ? `Ejecutado ${point.label}: ${formatMoney(Number(point.executed))} EUR`
                  : undefined
              "
            />
          </div>
          <span class="bdg-evo-label">{{ point.label }}</span>
        </div>
      </div>

      <div class="bdg-evolution-legend">
        <span><i class="dot dot-plan" /> Previsto</span>
        <span><i class="dot dot-exec" /> Ejecutado</span>
        <span>
          {{ section.id === 'income' ? 'Base recurrente mensual:' : 'Base mensual orientativa:' }}
          <strong>
            {{
              formatCompactMoney(
                section.id === 'income' ? incomeEvolutionBaseMonthly : expenseEvolutionBaseMonthly,
              )
            }}
            EUR
          </strong>
        </span>
      </div>
    </div>

    <div
      v-if="section.groups.length"
      class="bdg-rollup"
      :aria-label="`Resumen YTD ${section.title}`"
    >
      <div v-if="sectionBar(section.id)" class="bdg-richbar">
        <div class="bdg-richbar-track">
          <div
            class="bdg-richbar-fill"
            :class="`bdg-fill-${sectionBar(section.id)!.tone}`"
            :style="{
              width: `${sectionBar(section.id)!.overflow ? 100 : sectionBar(section.id)!.widthPct}%`,
            }"
          />
          <span
            v-if="sectionBar(section.id)!.overflow"
            class="bdg-richbar-overflow"
            :style="{ left: `${(1 / sectionBar(section.id)!.ratio) * 100}%` }"
            aria-hidden="true"
          />
          <span class="bdg-richbar-exec">
            {{ formatMoney(sectionYtdTotals(section.id).executedTotal) }} EUR
          </span>
          <span class="bdg-richbar-plan">
            {{ formatMoney(sectionYtdTotals(section.id).planned) }} EUR previsto
          </span>
        </div>
        <span class="bdg-richbar-dev" :class="`bdg-dev-${sectionBar(section.id)!.tone}`">
          {{ formatSignedMoney(sectionBar(section.id)!.deviation) }} EUR
        </span>
      </div>
      <button
        type="button"
        class="bdg-expand-link"
        :aria-expanded="isSectionExpanded(section.id)"
        @click="toggleSectionExpanded(section.id)"
      >
        {{ isSectionExpanded(section.id) ? 'Ocultar ↑' : 'Ver desglose ↓' }}
      </button>
    </div>

    <div v-if="section.groups.length && isSectionExpanded(section.id)">
      <div class="bdg-colhead">
        <span>Partida</span>
        <span class="num">Previsto</span>
        <span>Ejecución (YTD)</span>
        <span class="num">Ejecutado (YTD)</span>
        <span />
      </div>

      <template v-for="group in section.groups" :key="`${section.id}-${group.categoryKey}`">
        <div class="bdg-row bdg-row-cat">
          <div class="bdg-row-lead">
            <button
              type="button"
              class="bdg-chev bdg-chev-cat"
              :aria-expanded="isGroupExpanded(group.categoryKey)"
              :title="isGroupExpanded(group.categoryKey) ? 'Contraer' : 'Expandir'"
              @click="toggleGroup(group.categoryKey)"
            >
              {{ isGroupExpanded(group.categoryKey) ? '▾' : '▸' }}
            </button>
            <div class="bdg-row-lead-body">
              <div>
                <span
                  class="bdg-kind"
                  :class="section.id === 'income' ? 'bdg-kind-asset' : 'bdg-kind-liability'"
                >
                  {{ section.id === 'income' ? 'Ingresos' : 'Gastos' }}
                </span>
                <button
                  type="button"
                  class="bdg-name bdg-name-link"
                  @click="goToMovements(group.categoryKey)"
                >
                  {{ group.categoryLabel }}
                </button>
                <button
                  type="button"
                  class="bdg-add-btn"
                  :title="`Añadir en ${group.categoryLabel}`"
                  @click="openCreateForCategory(section.id, group.categoryKey)"
                >
                  +
                </button>
              </div>
              <p
                v-if="
                  (incomeInvestmentRotationCategoryAdjustment?.(section.id, group.categoryKey) ??
                    0) > 0
                "
                class="bdg-note"
              >
                Cambio neto en depósitos aplicado (YTD): -{{
                  formatMoney(
                    incomeInvestmentRotationCategoryAdjustment?.(section.id, group.categoryKey) ??
                      0,
                  )
                }}
                EUR
              </p>
            </div>
          </div>
          <div class="bdg-num bdg-num-strong">
            <template v-if="categoryBar(section.id, group)">
              {{ formatMoney(categoryBar(section.id, group)!.planned) }} EUR
            </template>
            <span v-else class="bdg-faint">—</span>
          </div>
          <BudgetBarCell
            :bar="categoryBar(section.id, group)"
            :kind="section.id"
            :format-signed-money="formatSignedMoney"
          />
          <div class="bdg-num bdg-num-strong">
            <template v-if="categoryBar(section.id, group)?.hasData">
              {{ formatMoney(categoryBar(section.id, group)!.executed) }} EUR
            </template>
            <span v-else class="bdg-faint">—</span>
          </div>
          <div />
        </div>

        <template v-for="row in group.rows" :key="row.key">
          <div
            v-show="isGroupExpanded(group.categoryKey)"
            class="bdg-row bdg-row-sub"
            :class="{ 'bdg-row-clickable': !row.detectedUnbudgeted && row.itemsCount > 0 }"
            :aria-expanded="
              !row.detectedUnbudgeted && row.itemsCount > 0
                ? isContextOpen(section.id, row.key)
                : undefined
            "
            @click="!row.detectedUnbudgeted && row.itemsCount > 0 && toggleContext(section.id, row)"
          >
            <div class="bdg-row-lead">
              <span class="bdg-chev">
                {{
                  !row.detectedUnbudgeted && row.itemsCount > 0
                    ? isContextOpen(section.id, row.key)
                      ? '▾'
                      : '▸'
                    : ''
                }}
              </span>
              <div class="bdg-row-lead-body">
                <div>
                  <button
                    type="button"
                    class="bdg-name bdg-name-link"
                    @click.stop="goToMovements(group.categoryKey, row.subcategoryKey)"
                  >
                    {{ row.subcategoryLabel }}
                  </button>
                  <button
                    type="button"
                    class="bdg-add-btn"
                    :title="`Añadir en ${row.subcategoryLabel}`"
                    @click.stop="openCreateDirect(section.id, row)"
                  >
                    +
                  </button>
                  <span
                    v-if="row.detectedUnbudgeted"
                    class="pill-unbudgeted"
                    :title="`${formatMoney(row.detectedExecutedYtd ?? 0)} EUR ejecutado sin presupuestar`"
                  >
                    +{{ formatMoney(row.detectedExecutedYtd ?? 0) }} fuera
                  </span>
                </div>
                <div class="bdg-sub">
                  <template v-if="row.detectedUnbudgeted">
                    Detectado en movimientos · fuera de presupuesto (YTD)
                  </template>
                  <template v-else>{{ rowPlannedMeta(section.id, row) }}</template>
                </div>
                <button
                  v-if="row.detectedUnbudgeted"
                  type="button"
                  class="bdg-detected-add"
                  @click.stop="openCreateDirect(section.id, row)"
                >
                  Añadir al presupuesto
                </button>
                <p
                  v-if="
                    (incomeInvestmentRotationSubcategoryAdjustment?.(section.id, row.key) ?? 0) > 0
                  "
                  class="bdg-note"
                >
                  Cambio neto en depósitos aplicado (YTD): -{{
                    formatMoney(
                      incomeInvestmentRotationSubcategoryAdjustment?.(section.id, row.key) ?? 0,
                    )
                  }}
                  EUR
                </p>
              </div>
            </div>
            <div class="bdg-num bdg-num-muted">
              <template v-if="subcategoryBar(section.id, row)">
                {{ formatMoney(subcategoryBar(section.id, row)!.planned) }} EUR
              </template>
              <template v-else-if="row.plannedAnnual > 0">
                {{ formatMoney(row.plannedAnnual) }} EUR
              </template>
              <span v-else class="bdg-faint">—</span>
            </div>
            <BudgetBarCell
              :bar="subcategoryBar(section.id, row)"
              :kind="section.id"
              :format-signed-money="formatSignedMoney"
            />
            <div class="bdg-num">
              <template v-if="subcategoryBar(section.id, row)?.hasData">
                {{ formatMoney(subcategoryBar(section.id, row)!.executed) }} EUR
              </template>
              <template v-else-if="row.detectedUnbudgeted">
                {{ formatMoney(row.detectedExecutedYtd ?? 0) }} EUR
              </template>
              <span v-else class="bdg-faint">—</span>
            </div>
            <div />

            <div
              v-if="isContextOpen(section.id, row.key) && !row.detectedUnbudgeted"
              class="bdg-context"
              @click.stop
            >
              <ul
                v-if="section.id === 'income' && contextIncomeEntries.length"
                class="bdg-context-list"
              >
                <li
                  v-for="entry in contextIncomeEntries"
                  :key="`income-${entry.id}`"
                  class="bdg-context-item"
                >
                  <div class="bdg-context-main">
                    <strong>{{ entry.name }}</strong>
                    <small>
                      {{ entry.incomeType === 'recurrent' ? 'Recurrente' : 'Puntual' }}
                      <template v-if="entry.owner"> · {{ entry.owner }}</template>
                    </small>
                  </div>
                  <div class="bdg-context-actions">
                    <span class="bdg-context-amount">
                      {{ formatMoney(entry.amountAnnual) }} {{ entry.currency }}
                    </span>
                    <div class="bdg-rowmenu">
                      <button type="button" title="Editar" @click="openEditIncome(entry)">
                        &#9998;
                      </button>
                      <button type="button" title="Eliminar" @click="removeIncome(entry)">
                        &#128465;
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <ul
                v-else-if="section.id === 'expense' && contextExpenseEntries.length"
                class="bdg-context-list"
              >
                <li
                  v-for="entry in contextExpenseEntries"
                  :key="`expense-${entry.id}`"
                  class="bdg-context-item"
                >
                  <div class="bdg-context-main">
                    <strong>{{ entry.name }}</strong>
                    <small>
                      {{ entry.expenseType === 'recurrent' ? 'Recurrente' : 'Puntual' }}
                      <template v-if="entry.owner"> · {{ entry.owner }}</template>
                    </small>
                  </div>
                  <div class="bdg-context-actions">
                    <span class="bdg-context-amount">
                      {{ formatMoney(entry.amountAnnual) }} {{ entry.currency }}
                    </span>
                    <div class="bdg-rowmenu">
                      <button type="button" title="Editar" @click="openEditExpense(entry)">
                        &#9998;
                      </button>
                      <button type="button" title="Eliminar" @click="removeExpense(entry)">
                        &#128465;
                      </button>
                    </div>
                  </div>
                </li>
              </ul>

              <p v-else class="bdg-context-empty">
                No hay registros con los filtros actuales para esta subcategoría.
              </p>
            </div>
          </div>
        </template>
      </template>

      <div class="bdg-row bdg-row-cat bdg-row-total">
        <div class="bdg-row-lead">
          <span class="bdg-chev" />
          <span class="bdg-name bdg-num-strong">Total {{ section.title.toLowerCase() }}</span>
        </div>
        <div class="bdg-num bdg-num-strong">
          {{ formatMoney(sectionYtdTotals(section.id).planned) }} EUR
        </div>
        <BudgetBarCell
          :bar="sectionBar(section.id)"
          :kind="section.id"
          :format-signed-money="formatSignedMoney"
        />
        <div class="bdg-num bdg-num-strong">
          {{ formatMoney(sectionYtdTotals(section.id).executedTotal) }} EUR
        </div>
        <div />
      </div>
    </div>

    <p v-if="!section.groups.length" class="sect-sub">
      {{ section.emptyMessage }}
      <template v-if="section.filterMode !== 'all'">
        Prueba con la vista «Todos» si quieres incluir movimientos puntuales.
      </template>
    </p>
  </section>

  <div v-if="isLoading" class="bdg-loading">Cargando presupuesto…</div>

  <AnnualEntryModalForm
    v-if="annualEntriesPage"
    :open="annualEntriesPage.showIncomeModal.value"
    :title="annualEntriesPage.incomeModalTitle.value"
    :form="annualEntriesPage.annualIncomeForm"
    :loading="annualEntriesPage.annualIncomeLoading.value"
    :error="
      annualEntriesPage.annualIncomeError?.value || annualEntriesPage.annualIncomeApiError?.value
    "
    :submit-label="annualEntriesPage.incomeSubmitLabel.value"
    :category-options="annualEntriesPage.incomeCategories"
    :subcategory-options="annualEntriesPage.annualSubcategoryOptions.value"
    :show-owner-field="annualEntriesPage.showOwnerField.value"
    :owner-options="annualEntriesPage.ownerOptions.value"
    :time-profile-options="annualEntriesPage.incomeTimeProfileOptions.value"
    :cashflow-role-options="annualEntriesPage.incomeCashflowRoleOptions"
    :show-cashflow-role-field="false"
    :show-recurring-target-month-field="true"
    :event-group-options="annualEntriesPage.annualEventGroupOptions.value"
    event-group-datalist-id="budget-income-event-groups"
    name-placeholder="Concepto (ej: Nomina, Regalo)"
    :amount-placeholder="annualEntriesPage.incomeAmountInputPlaceholder.value"
    @patch="annualEntriesPage.patchAnnualIncomeForm"
    @close="annualEntriesPage.closeIncomeModal"
    @submit="onSubmitAnnualIncome ? onSubmitAnnualIncome() : annualEntriesPage.submitAnnualIncome()"
  />

  <AnnualEntryModalForm
    v-if="annualEntriesPage"
    :open="annualEntriesPage.showExpenseModal.value"
    :title="annualEntriesPage.expenseModalTitle.value"
    :form="annualEntriesPage.annualExpenseForm"
    :loading="annualEntriesPage.annualExpenseLoading.value"
    :error="
      annualEntriesPage.annualExpenseError?.value || annualEntriesPage.annualExpenseApiError?.value
    "
    :submit-label="annualEntriesPage.expenseSubmitLabel.value"
    :category-options="annualEntriesPage.expenseCategories"
    :subcategory-options="annualEntriesPage.annualExpenseSubcategoryOptions.value"
    :show-owner-field="annualEntriesPage.showOwnerField.value"
    :owner-options="annualEntriesPage.ownerOptions.value"
    :time-profile-options="annualEntriesPage.expenseTimeProfileOptions"
    time-profile-field-label="Tipo de salida"
    :cashflow-role-options="annualEntriesPage.filteredExpenseCashflowRoleOptions.value"
    :show-cashflow-role-field="annualEntriesPage.showExpenseCashflowRoleField.value"
    :show-event-group-field="!annualEntriesPage.editingSystemGeneratedLiabilityExpense.value"
    :show-term-end-year-field="!annualEntriesPage.editingSystemGeneratedLiabilityExpense.value"
    :event-group-options="annualEntriesPage.annualEventGroupOptions.value"
    event-group-datalist-id="budget-expense-event-groups"
    name-placeholder="Concepto (ej: Alimentacion, Hipoteca)"
    :amount-placeholder="annualEntriesPage.expenseAmountInputPlaceholder.value"
    :notes-placeholder="annualEntriesPage.expenseBulkEditHint.value"
    @patch="annualEntriesPage.patchAnnualExpenseForm"
    @close="annualEntriesPage.closeExpenseModal"
    @submit="
      onSubmitAnnualExpense ? onSubmitAnnualExpense() : annualEntriesPage.submitAnnualExpense()
    "
  />
</template>
