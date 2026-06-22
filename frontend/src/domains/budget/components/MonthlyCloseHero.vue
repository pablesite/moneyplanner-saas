<script setup lang="ts">
import { computed } from 'vue';
import { AHero, AKpiBand, type AKpiItem } from '@/domains/ui';

// Hero del Cierre mensual (Direction A): residual grande + variación de
// liquidez + 3 KPIs (Ingresos / Gastos / Tasa de ahorro) vs previsto.
const props = defineProps<{
  monthLabel: string;
  residual: number;
  liquidityStart: number;
  liquidityEnd: number;
  incomeExecuted: number;
  incomePlanned: number;
  expenseExecuted: number;
  expensePlanned: number;
  formatMoney: (value: number, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();

const liquidityDelta = computed(() => props.liquidityEnd - props.liquidityStart);
const incomeDelta = computed(() => props.incomeExecuted - props.incomePlanned);
const expenseDelta = computed(() => props.expenseExecuted - props.expensePlanned);
const savingsRate = computed(() =>
  props.incomeExecuted > 0
    ? ((props.incomeExecuted - props.expenseExecuted) / props.incomeExecuted) * 100
    : 0,
);

const kpiItems = computed<AKpiItem[]>(() => [
  { label: 'Ingresos', value: props.formatMoney(props.incomeExecuted) },
  { label: 'Gastos', value: props.formatMoney(props.expenseExecuted) },
  { label: 'Tasa de ahorro', value: `${savingsRate.value.toFixed(0)}%` },
]);
</script>

<template>
  <section class="sect mc-hero">
    <div class="a-hero-shell mc-hero-grid">
      <AHero
        class="mc-hero-main"
        :eyebrow="`Residual del mes · ${monthLabel}`"
        :value="formatMoney(residual)"
      >
        <template #delta>
          <span
            >Liquidez inicial · <span class="mono">{{ formatMoney(liquidityStart) }}</span></span
          >
          <span class="mc-hero-dot" aria-hidden="true"></span>
          <span
            >Liquidez final · <span class="mono">{{ formatMoney(liquidityEnd) }}</span></span
          >
          <span class="mc-hero-dot" aria-hidden="true"></span>
          <span class="mono" :class="liquidityDelta >= 0 ? 'pos' : 'neg'">
            {{ formatSignedMoney(liquidityDelta) }}
          </span>
          <span>variación</span>
        </template>
      </AHero>

      <AKpiBand class="mc-hero-kpis" :items="kpiItems">
        <template #meta-0>
          previsto {{ formatMoney(incomePlanned) }} ·
          <span :class="incomeDelta >= 0 ? 'pos' : 'neg'">{{
            formatSignedMoney(incomeDelta)
          }}</span>
        </template>
        <template #meta-1>
          previsto {{ formatMoney(expensePlanned) }} ·
          <span :class="expenseDelta <= 0 ? 'pos' : 'neg'">{{
            formatSignedMoney(expenseDelta)
          }}</span>
        </template>
        <template #meta-2> ingresos − gastos del mes </template>
      </AKpiBand>
    </div>
  </section>
</template>
