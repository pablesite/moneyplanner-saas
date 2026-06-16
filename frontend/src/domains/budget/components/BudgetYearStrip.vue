<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  months: string[];
  income: number[];
  expense: number[];
  currentIdx: number;
}>();

const W = 720;
const baseY = 170;
const maxBarH = 140;

const max = computed(() => Math.max(1, ...props.income, ...props.expense, 6500));

type Bar = {
  key: number;
  label: string;
  x: number;
  colW: number;
  incomeH: number;
  expenseH: number;
  isCurrent: boolean;
  isFuture: boolean;
};

const bars = computed<Bar[]>(() => {
  const n = props.months.length || 1;
  return props.months.map((label, i) => {
    const x = (i / n) * W + 16;
    const colW = W / n - 20;
    return {
      key: i,
      label,
      x,
      colW,
      incomeH: ((props.income[i] ?? 0) / max.value) * maxBarH,
      expenseH: ((props.expense[i] ?? 0) / max.value) * maxBarH,
      isCurrent: i === props.currentIdx,
      isFuture: i > props.currentIdx,
    };
  });
});
</script>

<template>
  <svg class="budget-year-strip" :viewBox="`0 0 ${W} 200`" width="100%" height="200">
    <g v-for="bar in bars" :key="bar.key" :opacity="bar.isFuture ? 0.35 : 1">
      <rect
        :x="bar.x"
        :y="baseY - bar.incomeH"
        :width="bar.colW / 2 - 2"
        :height="bar.incomeH"
        fill="var(--pos)"
        rx="2"
      />
      <rect
        :x="bar.x + bar.colW / 2 + 2"
        :y="baseY - bar.expenseH"
        :width="bar.colW / 2 - 2"
        :height="bar.expenseH"
        fill="var(--neg)"
        rx="2"
        opacity="0.7"
      />
      <text
        :x="bar.x + bar.colW / 2"
        y="190"
        text-anchor="middle"
        class="budget-year-strip-label"
        :fill-opacity="bar.isCurrent ? 1 : 0.5"
      >
        {{ bar.label }}
      </text>
      <line
        v-if="bar.isCurrent"
        :x1="bar.x - 2"
        :x2="bar.x + bar.colW + 2"
        :y1="baseY + 4"
        :y2="baseY + 4"
        stroke="var(--pos)"
        stroke-width="1.5"
      />
    </g>
  </svg>
</template>
