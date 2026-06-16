<script setup lang="ts">
import { computed, watch } from 'vue';
import { APageHead, AContextBar } from '@/domains/ui';
import { BudgetAnnualSection, BudgetHero } from '@/domains/budget';
import '@/domains/budget/styles/budget.css';
import '@/domains/budget/styles/dashboard.css';
import { useBudgetView } from './budget/useBudgetView';
import { useBudgetAnnualEntriesPage } from './budget/useBudgetAnnualEntriesPage';

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
  refreshBudgetData,
  refreshBudgetSuggestionData,
  refreshAccountingExecutionData,
  refreshIncomeExecutionData,
  refreshExpenseExecutionData,
} = useBudgetView();

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
        <button class="btn btn-primary" type="button" @click="openNewEntry">+ Nueva partida</button>
      </template>
    </APageHead>

    <AContextBar>
      <label class="context-field">
        <span class="context-field-label">Año fiscal</span>
        <select
          class="filter-ctrl"
          :value="String(fiscalYear)"
          @change="
            selectFiscalYearOption(Number(($event.target as HTMLSelectElement).value), $event)
          "
        >
          <option v-for="year in fiscalYearOptions" :key="year" :value="String(year)">
            {{ year }}
          </option>
        </select>
      </label>

      <div class="context-divider"></div>

      <label class="context-field">
        <span class="context-field-label">Titularidad</span>
        <select
          class="filter-ctrl"
          :value="ownershipFilter"
          @change="selectOwnershipFilterOption(($event.target as HTMLSelectElement).value, $event)"
        >
          <option value="all">Todos</option>
          <option v-for="option in ownershipOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
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

    <!-- WIP: tablas legacy reutilizadas (reskin a bdg-row pendiente). -->
    <BudgetAnnualSection
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
