<script setup lang="ts">
import { computed } from 'vue';
import { AHero, AKpiBand, type AKpiItem } from '@/domains/ui';
import BudgetYearStrip from './BudgetYearStrip.vue';

const props = defineProps<{
  fiscalYear: number;
  monthLabels: string[];
  currentMonthIdx: number;
  plannedIncomeTotal: number;
  plannedExpenseTotal: number;
  plannedBalanceTotal: number;
  incomeExecutedYtd: number;
  expenseExecutedYtd: number;
  incomeMonthlyExecuted: number[];
  expenseMonthlyExecuted: number[];
  formatMoney: (value: number, decimals?: number) => string;
  formatPercent: (value: number | null, decimals?: number) => string;
}>();

const savingsRate = computed(() =>
  props.plannedIncomeTotal > 0 ? 1 - props.plannedExpenseTotal / props.plannedIncomeTotal : null,
);

// Previsto YTD = previsto anual escalado a los meses transcurridos.
const monthsElapsed = computed(() => props.currentMonthIdx + 1);
const incomePlannedYtd = computed(() => (props.plannedIncomeTotal * monthsElapsed.value) / 12);
const expensePlannedYtd = computed(() => (props.plannedExpenseTotal * monthsElapsed.value) / 12);
const incomeYtdRatio = computed(() =>
  incomePlannedYtd.value > 0 ? props.incomeExecutedYtd / incomePlannedYtd.value : null,
);
const expenseYtdRatio = computed(() =>
  expensePlannedYtd.value > 0 ? props.expenseExecutedYtd / expensePlannedYtd.value : null,
);

const residualMonth = computed(
  () =>
    (props.incomeMonthlyExecuted[props.currentMonthIdx] ?? 0) -
    (props.expenseMonthlyExecuted[props.currentMonthIdx] ?? 0),
);
const currentMonthLabel = computed(() => props.monthLabels[props.currentMonthIdx] ?? '');

const kpiItems = computed<AKpiItem[]>(() => [
  {
    label: 'Ingresos · YTD',
    value: `${props.formatMoney(props.incomeExecutedYtd)} €`,
    meta: `${props.formatPercent(incomeYtdRatio.value, 0)} de lo previsto a ${currentMonthLabel.value}`,
  },
  {
    label: 'Gastos · YTD',
    value: `${props.formatMoney(props.expenseExecutedYtd)} €`,
    meta: `${props.formatPercent(expenseYtdRatio.value, 0)} de lo previsto a ${currentMonthLabel.value}`,
  },
  {
    label: 'Residual mes',
    value: `${props.formatMoney(residualMonth.value)} €`,
    meta: `${currentMonthLabel.value} ${props.fiscalYear}`,
  },
]);
</script>

<template>
  <section class="sect">
    <div class="budget-hero">
      <AHero
        class="budget-hero-main"
        eyebrow="Balance previsto del año"
        :value="`${formatMoney(plannedBalanceTotal)} €`"
      >
        <template #delta>
          <span>
            <span class="pos mono">{{ formatMoney(plannedIncomeTotal) }} €</span>
            <span class="budget-hero-delta-copy">ingresos</span>
          </span>
          <span class="hero-delta-sep">·</span>
          <span>
            <span class="neg mono">{{ formatMoney(plannedExpenseTotal) }} €</span>
            <span class="budget-hero-delta-copy">gastos</span>
          </span>
          <span class="hero-delta-sep">·</span>
          <span>
            <span class="mono budget-hero-rate">{{ formatPercent(savingsRate, 0) }}</span>
            <span class="budget-hero-delta-copy">tasa de ahorro</span>
          </span>
        </template>

        <AKpiBand class="budget-hero-kpis" :items="kpiItems" />
      </AHero>

      <div class="budget-hero-strip">
        <p class="eyebrow budget-hero-eyebrow">Ejecución mensual · {{ fiscalYear }}</p>
        <BudgetYearStrip
          :months="monthLabels"
          :income="incomeMonthlyExecuted"
          :expense="expenseMonthlyExecuted"
          :current-idx="currentMonthIdx"
        />
        <div class="budget-hero-legend">
          <span><span class="budget-hero-legend-dot budget-hero-legend-dot-income" />Ingresos</span>
          <span><span class="budget-hero-legend-dot budget-hero-legend-dot-expense" />Gastos</span>
          <span class="budget-hero-legend-spacer">FY {{ fiscalYear }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
