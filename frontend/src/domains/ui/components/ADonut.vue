<script setup lang="ts">
import { computed, ref } from 'vue';

// Donut SVG genérico Direction A: anillo de fondo + sectores proporcionales con
// hover (el sector activo manda sobre el texto del centro). Sin librería de
// gráficos. El consumidor aporta los `slices` (valor + color + etiqueta) y el
// texto de centro por defecto; cada slice puede traer `hoverValue` para el centro.
export interface ADonutSlice {
  key: string;
  label: string;
  value: number;
  color: string;
  hoverValue?: string;
}

const props = withDefaults(
  defineProps<{
    slices: ADonutSlice[];
    centerEyebrow?: string;
    centerValue?: string;
    size?: number;
    thickness?: number;
    ariaLabel?: string;
  }>(),
  { size: 200, thickness: 14, ariaLabel: 'Donut' },
);

const positiveSlices = computed(() => props.slices.filter((s) => s.value > 0));
const sum = computed(() => positiveSlices.value.reduce((acc, s) => acc + s.value, 0));

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.thickness) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

type Arc = ADonutSlice & { dash: number; offset: number };

const arcs = computed<Arc[]>(() => {
  let off = 0;
  const total = sum.value || 1;
  return positiveSlices.value.map((s) => {
    const dash = (s.value / total) * circumference.value;
    const arc: Arc = { ...s, dash, offset: -off };
    off += dash;
    return arc;
  });
});

const hoveredIndex = ref(-1);

const displayEyebrow = computed(() =>
  hoveredIndex.value >= 0
    ? (positiveSlices.value[hoveredIndex.value]?.label ?? props.centerEyebrow ?? '')
    : (props.centerEyebrow ?? ''),
);

const displayValue = computed(() =>
  hoveredIndex.value >= 0
    ? (positiveSlices.value[hoveredIndex.value]?.hoverValue ?? props.centerValue ?? '')
    : (props.centerValue ?? ''),
);
</script>

<template>
  <div class="a-donut">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="a-donut-svg"
      role="img"
      :aria-label="ariaLabel"
    >
      <circle
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="none"
        stroke="currentColor"
        stroke-opacity="0.1"
        :stroke-width="thickness"
      />
      <circle
        v-for="(arc, index) in arcs"
        :key="arc.key"
        :cx="cx"
        :cy="cy"
        :r="radius"
        fill="none"
        :stroke="arc.color"
        :stroke-opacity="hoveredIndex >= 0 && hoveredIndex !== index ? 0.18 : 1"
        :stroke-width="hoveredIndex === index ? thickness + 4 : thickness"
        :stroke-dasharray="`${arc.dash} ${circumference - arc.dash}`"
        :stroke-dashoffset="arc.offset"
        :transform="`rotate(-90 ${cx} ${cy})`"
        stroke-linecap="butt"
        class="a-donut-arc"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = hoveredIndex === index ? -1 : hoveredIndex"
      />
      <g class="a-donut-center">
        <text
          v-if="displayEyebrow"
          :x="cx"
          :y="cy - 6"
          text-anchor="middle"
          class="a-donut-center-eyebrow"
        >
          {{ displayEyebrow }}
        </text>
        <text
          v-if="displayValue"
          :x="cx"
          :y="cy + 18"
          text-anchor="middle"
          class="a-donut-center-value"
        >
          {{ displayValue }}
        </text>
      </g>
    </svg>
  </div>
</template>
