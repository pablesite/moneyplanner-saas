<script setup lang="ts">
// Celda de ejecución (barra de progreso + meta) del patrón bdg-row de Direction A.
type BudgetBarModel = {
  tone: 'neutral' | 'good' | 'warn' | 'danger';
  widthPct: number;
  overflow: boolean;
  ratio: number;
  deviation: number;
  executed: number;
  hasData: boolean;
} | null;

defineProps<{
  bar: BudgetBarModel;
  kind: 'income' | 'expense';
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();
</script>

<template>
  <div class="bdg-bar-cell">
    <template v-if="bar">
      <div class="prog" :class="[`prog-${bar.tone}`, { 'prog-over': bar.overflow }]">
        <i :style="{ width: `${bar.overflow ? 100 : bar.widthPct}%` }" />
        <span
          v-if="bar.overflow && bar.ratio > 0"
          class="prog-tick"
          :style="{ left: `${(1 / bar.ratio) * 100}%` }"
        />
      </div>
      <div class="bdg-bar-meta">
        <span>{{ (bar.ratio * 100).toFixed(0) }}%</span>
        <span
          v-if="bar.hasData"
          :class="bar.overflow ? (kind === 'expense' ? 'bdg-diff-neg' : 'bdg-diff-pos') : ''"
        >
          {{ formatSignedMoney(bar.deviation) }}
        </span>
        <span v-else class="bdg-faint">pendiente</span>
      </div>
    </template>
    <template v-else>
      <div class="prog prog-neutral"><i :style="{ width: '0%' }" /></div>
      <div class="bdg-bar-meta"><span class="bdg-faint">—</span><span /></div>
    </template>
  </div>
</template>
