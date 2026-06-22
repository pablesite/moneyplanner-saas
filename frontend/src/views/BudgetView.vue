<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { APageHead, AContextBar, AInfoHint, ASelect, type ASelectItem } from '@/domains/ui';
import { BudgetAnnualSection, BudgetHero } from '@/domains/budget';
import '@/domains/budget/styles/budget.css';
import { useBudgetView } from './budget/useBudgetView';
import { useBudgetAnnualEntriesPage } from './budget/useBudgetAnnualEntriesPage';

// Estado de presentación local (no toca el motor): controla la vista activa.
type BudgetPresentationView = 'annual' | 'exec' | 'sugg';
const presentationView = ref<BudgetPresentationView>('annual');

const {
  fiscalYear,
  ownershipFilter,
  incomeViewMode,
  monthLabels,
  selectedExecutionMonth,
  selectedExecutionMonthLabel,
  fiscalYearOptions,
  ownershipOptions,
  selectedOwnershipFilterLabel,
  isLoading,
  firstError,
  expenseExecutionError,
  plannedIncomeTotal,
  plannedExpenseTotal,
  plannedBalanceTotal,
  incomeExecutionYtdTotals,
  expenseExecutionYtdTotals,
  incomeMonthlySummary,
  expenseMonthlySummary,
  sections,
  hasAnyPlannedData,
  incomeEvolutionMonths,
  incomeEvolutionBaseMonthly,
  expenseEvolutionMonths,
  expenseEvolutionBaseMonthly,
  budgetDetailMonth,
  budgetDetailMonthLabel,
  filteredIncomeEntries,
  filteredExpenseEntries,
  selectFiscalYearOption,
  selectOwnershipFilterOption,
  updateIncomeViewMode,
  updateExpenseViewMode,
  updateBudgetDetailMonth,
  budgetSectionActualExecution,
  budgetCategoryActualExecution,
  budgetSubcategoryActualExecution,
  incomeInvestmentRotationCategoryAdjustment,
  incomeInvestmentRotationSubcategoryAdjustment,
  executionPreview,
  isSectionExpanded,
  toggleSectionExpanded,
  formatMoney,
  formatCompactMoney,
  formatPercent,
  formatSignedMoney,
  incomeBudgetSuggestions,
  expenseBudgetSuggestions,
  budgetSuggestionsLoading,
  budgetSuggestionsError,
  refreshBudgetData,
  refreshBudgetSuggestionData,
  refreshAccountingExecutionData,
  refreshIncomeExecutionData,
  refreshExpenseExecutionData,
} = useBudgetView();

const suggestionsCount = computed(
  () => incomeBudgetSuggestions.value.length + expenseBudgetSuggestions.value.length,
);

const annualEntriesPage = useBudgetAnnualEntriesPage();

watch(
  fiscalYear,
  (year) => {
    annualEntriesPage.fiscalYear.value = year;
  },
  { immediate: true },
);

function parseMoney(raw: unknown): number {
  const n = Number(String(raw ?? '').trim());
  return Number.isFinite(n) ? n : 0;
}

// Series mensuales ejecutadas (1-12) para el year-strip del hero.
function monthlyExecutedSeries(
  summary: { months?: Array<{ month: number; executed: string }> } | null,
): number[] {
  const series = new Array<number>(12).fill(0);
  for (const row of summary?.months ?? []) {
    const idx = Number(row.month) - 1;
    if (idx >= 0 && idx < 12) series[idx] = parseMoney(row.executed);
  }
  return series;
}

const incomeMonthlyExecuted = computed(() => monthlyExecutedSeries(incomeMonthlySummary.value));
const expenseMonthlyExecuted = computed(() => monthlyExecutedSeries(expenseMonthlySummary.value));
const currentMonthIdx = computed(() => Math.max(0, Math.min(11, selectedExecutionMonth.value - 1)));

async function refreshAllBudgetData(): Promise<void> {
  await Promise.all([
    refreshBudgetData(fiscalYear.value),
    refreshBudgetSuggestionData(),
    refreshAccountingExecutionData(),
    refreshIncomeExecutionData(),
    refreshExpenseExecutionData(),
  ]);
}

async function submitAnnualIncomeAndRefresh(): Promise<void> {
  await annualEntriesPage.submitAnnualIncome();
  await refreshAllBudgetData();
}

async function submitAnnualExpenseAndRefresh(): Promise<void> {
  await annualEntriesPage.submitAnnualExpense();
  await refreshAllBudgetData();
}

async function removeAnnualIncomeAndRefresh(entryId: number): Promise<void> {
  await annualEntriesPage.removeAnnualIncome(entryId);
  await refreshAllBudgetData();
}

async function removeAnnualExpenseAndRefresh(entryId: number): Promise<void> {
  await annualEntriesPage.removeAnnualExpense(entryId);
  await refreshAllBudgetData();
}

function openNewEntry(): void {
  annualEntriesPage.openIncomeModal();
}

const fiscalYearSelectOptions = computed<ASelectItem[]>(() =>
  fiscalYearOptions.value.map((year) => ({ value: String(year), label: String(year) })),
);

const ownershipSelectOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos' },
  ...ownershipOptions.value.map((option) => ({ value: option.value, label: option.label })),
]);
</script>

<template>
  <div class="page a-budget-page">
    <APageHead title="Presupuesto">
      <template #meta>
        <span class="a-budget-meta-pill">FY {{ fiscalYear }}</span>
        <span class="dot"></span>
        <span>Mes activo · {{ selectedExecutionMonthLabel }}</span>
        <span class="dot"></span>
        <span>Base EUR</span>
      </template>
      <template #actions>
        <button
          class="btn btn-ghost bdg-sect-action"
          type="button"
          @click="presentationView = 'sugg'"
        >
          {{ suggestionsCount }} sugerencias
        </button>
        <button class="btn btn-primary" type="button" @click="openNewEntry">+ Nueva partida</button>
      </template>
    </APageHead>

    <AContextBar>
      <label class="context-field">
        <span class="context-field-label">Año fiscal</span>
        <ASelect
          class="filter-ctrl"
          :model-value="String(fiscalYear)"
          :options="fiscalYearSelectOptions"
          :searchable="false"
          @update:model-value="(v) => selectFiscalYearOption(Number(v))"
        />
      </label>

      <div class="context-divider"></div>

      <label class="context-field">
        <span class="context-field-label">Titularidad</span>
        <ASelect
          class="filter-ctrl"
          :model-value="ownershipFilter"
          :options="ownershipSelectOptions"
          :searchable="false"
          @update:model-value="(v) => selectOwnershipFilterOption(String(v))"
        />
      </label>

      <div class="context-divider"></div>

      <div class="context-field">
        <span class="context-field-label">Tipo de partida</span>
        <div class="seg">
          <button
            type="button"
            :class="{ on: incomeViewMode === 'all' }"
            @click="
              updateIncomeViewMode('all');
              updateExpenseViewMode('all');
            "
          >
            Todos
          </button>
          <button
            type="button"
            :class="{ on: incomeViewMode === 'recurrent' }"
            @click="
              updateIncomeViewMode('recurrent');
              updateExpenseViewMode('recurrent');
            "
          >
            Recurrentes
          </button>
          <button
            type="button"
            :class="{ on: incomeViewMode === 'one_off' }"
            @click="
              updateIncomeViewMode('one_off');
              updateExpenseViewMode('one_off');
            "
          >
            Puntuales
          </button>
        </div>
      </div>

      <div class="context-divider"></div>

      <div class="context-field">
        <span class="context-field-label">Vista</span>
        <div class="seg">
          <button
            type="button"
            :class="{ on: presentationView === 'annual' }"
            @click="presentationView = 'annual'"
          >
            Anual
          </button>
          <button
            type="button"
            :class="{ on: presentationView === 'exec' }"
            @click="presentationView = 'exec'"
          >
            Ejecución
          </button>
          <button
            type="button"
            :class="{ on: presentationView === 'sugg' }"
            @click="presentationView = 'sugg'"
          >
            Sugerencias
          </button>
        </div>
      </div>
    </AContextBar>

    <BudgetHero
      :fiscal-year="fiscalYear"
      :month-labels="monthLabels"
      :current-month-idx="currentMonthIdx"
      :planned-income-total="plannedIncomeTotal"
      :planned-expense-total="plannedExpenseTotal"
      :planned-balance-total="plannedBalanceTotal"
      :income-executed-ytd="incomeExecutionYtdTotals.executedTotal"
      :expense-executed-ytd="expenseExecutionYtdTotals.executedTotal"
      :income-monthly-executed="incomeMonthlyExecuted"
      :expense-monthly-executed="expenseMonthlyExecuted"
      :format-money="formatMoney"
      :format-percent="formatPercent"
    />

    <div v-if="firstError" class="alert mt-3">{{ firstError }}</div>
    <div v-if="expenseExecutionError" class="alert mt-3">{{ expenseExecutionError }}</div>

    <!-- Divisor de zona: separa el hero del detalle (tabla / sugerencias). -->
    <div class="bdg-zone-divider"></div>

    <!-- Tab Sugerencias (acciones deshabilitadas — sin backing en el motor). -->
    <section v-if="presentationView === 'sugg'" class="sect">
      <div class="sect-head">
        <div class="title-hint">
          <h2 class="sect-title">Sugerencias de presupuesto</h2>
          <AInfoHint label="Qué son las sugerencias">
            Importes recomendados para tus partidas a partir de la media de lo que has ejecutado en
            los últimos meses. Te ayudan a ajustar el presupuesto a tu gasto real. Aplicar/Ignorar
            llegará próximamente.
          </AInfoHint>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-ghost" @click="presentationView = 'annual'">
            ← Volver al detalle
          </button>
        </div>
      </div>

      <div v-if="budgetSuggestionsError" class="alert">{{ budgetSuggestionsError }}</div>
      <div v-else-if="budgetSuggestionsLoading" class="bdg-loading">Calculando sugerencias…</div>
      <p v-else-if="suggestionsCount === 0" class="sect-sub">
        No hay sugerencias con desviación relevante para el periodo seleccionado.
      </p>
      <template v-else>
        <div
          v-for="row in [
            ...incomeBudgetSuggestions.map((r) => ({ ...r, kind: 'income' as const })),
            ...expenseBudgetSuggestions.map((r) => ({ ...r, kind: 'expense' as const })),
          ]"
          :key="`${row.kind}-${row.key}`"
          class="bdg-sugg-row"
        >
          <div>
            <div>{{ row.subcategoryLabel }}</div>
            <div class="bdg-sugg-kind">{{ row.kind === 'income' ? 'Ingreso' : 'Gasto' }}</div>
          </div>
          <div class="bdg-sugg-reason">
            Media de {{ row.observedMonths }} {{ row.observedMonths === 1 ? 'mes' : 'meses' }} de
            ejecución
          </div>
          <div class="bdg-num">
            <div class="bdg-num-muted">{{ formatMoney(row.plannedAnnual) }} EUR</div>
            <div class="bdg-pct">previsto</div>
          </div>
          <div class="bdg-num">
            <div class="bdg-num-strong">{{ formatMoney(row.suggestedAnnual) }} EUR</div>
            <div
              class="bdg-pct"
              :class="
                row.suggestedAnnual - row.plannedAnnual >= 0 ? 'bdg-diff-pos' : 'bdg-diff-neg'
              "
            >
              {{ formatSignedMoney(row.suggestedAnnual - row.plannedAnnual) }}
            </div>
          </div>
          <div class="bdg-sugg-actions">
            <button type="button" class="btn btn-ghost" disabled title="Próximamente">
              Ignorar
            </button>
            <button type="button" class="btn btn-primary" disabled title="Próximamente">
              Aplicar
            </button>
          </div>
        </div>
      </template>
    </section>

    <BudgetAnnualSection
      v-else
      :is-monthly-close-view="false"
      :has-any-planned-data="hasAnyPlannedData"
      :is-loading="isLoading"
      :fiscal-year="fiscalYear"
      :sections="sections"
      :month-labels="monthLabels"
      :income-evolution-months="incomeEvolutionMonths"
      :income-evolution-base-monthly="incomeEvolutionBaseMonthly"
      :expense-evolution-months="expenseEvolutionMonths"
      :expense-evolution-base-monthly="expenseEvolutionBaseMonthly"
      :selected-execution-month-label="selectedExecutionMonthLabel"
      :budget-detail-month="budgetDetailMonth"
      :budget-detail-month-label="budgetDetailMonthLabel"
      :update-budget-detail-month="updateBudgetDetailMonth"
      :budget-section-actual-execution="budgetSectionActualExecution"
      :format-money="formatMoney"
      :format-compact-money="formatCompactMoney"
      :format-percent="formatPercent"
      :format-signed-money="formatSignedMoney"
      :is-section-expanded="isSectionExpanded"
      :toggle-section-expanded="toggleSectionExpanded"
      :budget-category-actual-execution="budgetCategoryActualExecution"
      :budget-subcategory-actual-execution="budgetSubcategoryActualExecution"
      :income-investment-rotation-category-adjustment="incomeInvestmentRotationCategoryAdjustment"
      :income-investment-rotation-subcategory-adjustment="
        incomeInvestmentRotationSubcategoryAdjustment
      "
      :income-execution-ytd-totals="incomeExecutionYtdTotals"
      :expense-execution-ytd-totals="expenseExecutionYtdTotals"
      :execution-preview="executionPreview"
      :update-income-view-mode="updateIncomeViewMode"
      :update-expense-view-mode="updateExpenseViewMode"
      :annual-entries-page="annualEntriesPage"
      :on-submit-annual-income="submitAnnualIncomeAndRefresh"
      :on-submit-annual-expense="submitAnnualExpenseAndRefresh"
      :on-remove-annual-income="removeAnnualIncomeAndRefresh"
      :on-remove-annual-expense="removeAnnualExpenseAndRefresh"
      :filtered-income-entries="filteredIncomeEntries"
      :filtered-expense-entries="filteredExpenseEntries"
      :ownership-filter="ownershipFilter"
      :selected-ownership-filter-label="selectedOwnershipFilterLabel"
    />
  </div>
</template>
