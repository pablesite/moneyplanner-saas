<script setup lang="ts">
import { computed } from 'vue';

// Sparkline de 12 meses (Direction A). Dibuja hasta el último mes con dato y
// marca el mes activo. Si no hay datos, muestra una línea base tenue.
const props = withDefaults(
  defineProps<{
    data: number[];
    activeIdx?: number;
  }>(),
  { activeIdx: -1 },
);

const W = 64;
const H = 18;

const lastNonZero = computed(() => {
  let last = 0;
  props.data.forEach((v, i) => {
    if (v > 0) last = i;
  });
  return last;
});

const max = computed(() => Math.max(1, ...props.data));

function px(i: number): number {
  const n = props.data.length;
  return n > 1 ? (i / (n - 1)) * W : 0;
}

function py(v: number): number {
  return H - 2 - (v / max.value) * (H - 4);
}

const path = computed(() =>
  props.data
    .slice(0, lastNonZero.value + 1)
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`)
    .join(' '),
);

const showDot = computed(
  () => props.activeIdx >= 0 && props.activeIdx <= lastNonZero.value && lastNonZero.value > 0,
);
</script>

<template>
  <svg class="sparkline" :viewBox="`0 0 ${W} ${H}`" role="img" aria-hidden="true">
    <line
      v-if="lastNonZero === 0"
      x1="0"
      :y1="H - 2"
      :x2="W"
      :y2="H - 2"
      stroke="currentColor"
      stroke-opacity="0.25"
    />
    <path v-else :d="path" />
    <circle
      v-if="showDot"
      class="dot-now"
      :cx="px(activeIdx)"
      :cy="py(data[activeIdx] ?? 0)"
      r="2"
    />
  </svg>
</template>
