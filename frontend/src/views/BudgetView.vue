<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  AButton,
  APageHead,
  AInfoHint,
  AMetaPill,
  ASelect,
  AState,
  AToast,
  type ASelectItem,
} from '@/domains/ui';
import { BudgetAnnualSection, BudgetHero } from '@/domains/budget';
import '@/domains/budget/styles/budget.css';
import { useBudgetView } from './budget/useBudgetView';
import { useBudgetAnnualEntriesPage } from './budget/useBudgetAnnualEntriesPage';

// Estado de presentación local (no toca el motor): controla la vista activa.
type BudgetPresentationView = 'annual' | 'sugg';
const presentationView = ref<BudgetPresentationView>('annual');

// Feedback de éxito (patrón AToast de Movimientos/Patrimonio).
const successMessage = ref<string | null>(null);

// Menú de alta compartido por el botón del head y el FAB móvil (Ingreso/Gasto).
const createMenuOpen = ref(false);
function toggleCreateMenu(): void {
  createMenuOpen.value = !createMenuOpen.value;
}

// Estado completo de la vista. Se pasa como objeto único `:page` a los hijos pesados
// (BudgetAnnualSection) y se desestructura solo lo que consume esta vista directamente
// (head, barra de contexto, hero, sugerencias, feedback y refresh).
const page = useBudgetView();
const {
  fiscalYear,
  ownershipFilter,
  incomeViewMode,
  monthLabels,
  selectedExecutionMonth,
  selectedExecutionMonthLabel,
  fiscalYearOptions,
  ownershipOptions,
  firstError,
  expenseExecutionError,
  plannedIncomeTotal,
  plannedExpenseTotal,
  plannedBalanceTotal,
  incomeExecutionYtdTotals,
  expenseExecutionYtdTotals,
  incomeMonthlySummary,
  expenseMonthlySummary,
  selectFiscalYearOption,
  selectOwnershipFilterOption,
  updateIncomeViewMode,
  updateExpenseViewMode,
  formatMoney,
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
} = page;

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
  // El modal solo se cierra en éxito; si sigue abierto hubo error (visible en el modal).
  if (annualEntriesPage.showIncomeModal.value) return;
  await refreshAllBudgetData();
  successMessage.value = 'Partida de ingreso guardada';
}

async function submitAnnualExpenseAndRefresh(): Promise<void> {
  await annualEntriesPage.submitAnnualExpense();
  if (annualEntriesPage.showExpenseModal.value) return;
  await refreshAllBudgetData();
  successMessage.value = 'Partida de gasto guardada';
}

async function removeAnnualIncomeAndRefresh(entryId: number): Promise<void> {
  await annualEntriesPage.removeAnnualIncome(entryId);
  await refreshAllBudgetData();
  successMessage.value = 'Partida de ingreso eliminada';
}

async function removeAnnualExpenseAndRefresh(entryId: number): Promise<void> {
  await annualEntriesPage.removeAnnualExpense(entryId);
  await refreshAllBudgetData();
  successMessage.value = 'Partida de gasto eliminada';
}

function openNewEntry(kind: 'income' | 'expense'): void {
  createMenuOpen.value = false;
  if (kind === 'income') annualEntriesPage.openIncomeModal();
  else annualEntriesPage.openExpenseModal();
}

const fiscalYearSelectOptions = computed<ASelectItem[]>(() =>
  fiscalYearOptions.value.map((year) => ({ value: String(year), label: String(year) })),
);

const ownershipSelectOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todos' },
  ...ownershipOptions.value.map((option) => ({ value: option.value, label: option.label })),
]);

// Tipo de partida como select-chip (multi-opción), coherente con los otros chips de la fila.
const entryTypeSelectOptions: ASelectItem[] = [
  { value: 'all', label: 'Todos' },
  { value: 'recurrent', label: 'Recurrentes' },
  { value: 'one_off', label: 'Puntuales' },
];
function setEntryViewMode(mode: string): void {
  const value = mode as 'all' | 'recurrent' | 'one_off';
  updateIncomeViewMode(value);
  updateExpenseViewMode(value);
}
</script>

<template>
  <div class="page a-budget-page">
    <APageHead title="Presupuesto">
      <template #meta>
        <AMetaPill>FY {{ fiscalYear }}</AMetaPill>
        <span class="dot"></span>
        <span>Mes activo · {{ selectedExecutionMonthLabel }}</span>
      </template>
      <template #actions>
        <div class="bdg-create">
          <div v-if="createMenuOpen" class="bdg-create-menu">
            <AButton variant="ghost" size="sm" @click="openNewEntry('income')">Ingreso</AButton>
            <AButton variant="ghost" size="sm" @click="openNewEntry('expense')">Gasto</AButton>
          </div>
          <AButton
            variant="primary"
            :aria-expanded="createMenuOpen"
            aria-haspopup="menu"
            @click="toggleCreateMenu"
          >
            + Nueva partida
          </AButton>
        </div>
      </template>
    </APageHead>

    <nav class="a-budget-tabs-bar" aria-label="Vistas de presupuesto">
      <div class="tabs">
        <button
          class="tab"
          type="button"
          :class="{ on: presentationView === 'annual' }"
          @click="presentationView = 'annual'"
        >
          Detalle anual
        </button>
        <button
          class="tab"
          type="button"
          :class="{ on: presentationView === 'sugg' }"
          @click="presentationView = 'sugg'"
        >
          Sugerencias<template v-if="suggestionsCount"> · {{ suggestionsCount }}</template>
        </button>
      </div>
    </nav>

    <section class="a-budget-read-section" aria-label="Filtros de presupuesto">
      <div class="a-budget-read-controls">
        <label class="context-field a-budget-control-chip">
          <span class="a-budget-sr-only">Año fiscal</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Año fiscal"
            :model-value="String(fiscalYear)"
            :options="fiscalYearSelectOptions"
            :searchable="false"
            @update:model-value="(v) => selectFiscalYearOption(Number(v))"
          />
        </label>

        <label class="context-field a-budget-control-chip">
          <span class="a-budget-sr-only">Titularidad</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Titularidad"
            :model-value="ownershipFilter"
            :options="ownershipSelectOptions"
            :searchable="false"
            @update:model-value="(v) => selectOwnershipFilterOption(String(v))"
          />
        </label>

        <label class="context-field a-budget-control-chip">
          <span class="a-budget-sr-only">Tipo de partida</span>
          <ASelect
            class="filter-ctrl"
            aria-label="Tipo de partida"
            :model-value="incomeViewMode"
            :options="entryTypeSelectOptions"
            :searchable="false"
            @update:model-value="(v) => setEntryViewMode(String(v))"
          />
        </label>
      </div>
    </section>

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

    <AState v-if="firstError" status="error">{{ firstError }}</AState>
    <AState v-if="expenseExecutionError" status="error">{{ expenseExecutionError }}</AState>

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
      </div>

      <AState v-if="budgetSuggestionsError" status="error">{{ budgetSuggestionsError }}</AState>
      <AState v-else-if="budgetSuggestionsLoading" status="loading" layout="inline"
        >Calculando sugerencias…</AState
      >
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
            <div class="bdg-num-muted">{{ formatMoney(row.plannedAnnual) }} €</div>
            <div class="bdg-pct">previsto</div>
          </div>
          <div class="bdg-num">
            <div class="bdg-num-strong">{{ formatMoney(row.suggestedAnnual) }} €</div>
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
            <AButton variant="ghost" disabled title="Próximamente"> Ignorar </AButton>
            <AButton variant="primary" disabled title="Próximamente"> Aplicar </AButton>
          </div>
        </div>
      </template>
    </section>

    <BudgetAnnualSection
      v-else
      :page="page"
      :annual-entries-page="annualEntriesPage"
      :on-submit-annual-income="submitAnnualIncomeAndRefresh"
      :on-submit-annual-expense="submitAnnualExpenseAndRefresh"
      :on-remove-annual-income="removeAnnualIncomeAndRefresh"
      :on-remove-annual-expense="removeAnnualExpenseAndRefresh"
    />

    <!-- FAB de alta móvil (patrón Patrimonio/Movimientos): menú Ingreso/Gasto. -->
    <div class="bdg-mobile-create-wrap">
      <div v-if="createMenuOpen" class="bdg-mobile-create-menu">
        <AButton variant="ghost" size="sm" @click="openNewEntry('income')">Añadir ingreso</AButton>
        <AButton variant="ghost" size="sm" @click="openNewEntry('expense')">Añadir gasto</AButton>
      </div>
      <AButton
        class="bdg-mobile-create"
        variant="primary"
        :aria-expanded="createMenuOpen"
        aria-haspopup="menu"
        aria-label="Nueva partida"
        @click="toggleCreateMenu"
      >
        <span class="bdg-fab-plus" aria-hidden="true">+</span>
        <span class="bdg-fab-label">Nueva partida</span>
      </AButton>
    </div>

    <AToast :open="!!successMessage" @close="successMessage = null">{{ successMessage }}</AToast>
  </div>
</template>
