<script setup lang="ts">
import { computed } from 'vue';

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
</script>

<template>
  <section class="sect mc-hero">
    <div class="mc-hero-grid">
      <div class="mc-hero-main">
        <p class="eyebrow mc-hero-eyebrow">Residual del mes · {{ monthLabel }}</p>
        <div class="hero-value mono">{{ formatMoney(residual) }}</div>
        <div class="hero-delta">
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
        </div>
      </div>

      <div class="kpis mc-hero-kpis">
        <div class="kpi">
          <p class="kpi-label">Ingresos</p>
          <div class="kpi-value mono">{{ formatMoney(incomeExecuted) }}</div>
          <div class="kpi-meta">
            previsto {{ formatMoney(incomePlanned) }} ·
            <span :class="incomeDelta >= 0 ? 'pos' : 'neg'">{{
              formatSignedMoney(incomeDelta)
            }}</span>
          </div>
        </div>
        <div class="kpi">
          <p class="kpi-label">Gastos</p>
          <div class="kpi-value mono">{{ formatMoney(expenseExecuted) }}</div>
          <div class="kpi-meta">
            previsto {{ formatMoney(expensePlanned) }} ·
            <span :class="expenseDelta <= 0 ? 'pos' : 'neg'">{{
              formatSignedMoney(expenseDelta)
            }}</span>
          </div>
        </div>
        <div class="kpi">
          <p class="kpi-label">Tasa de ahorro</p>
          <div class="kpi-value mono">{{ savingsRate.toFixed(0) }}%</div>
          <div class="kpi-meta">ingresos − gastos del mes</div>
        </div>
      </div>
    </div>
  </section>
</template>
