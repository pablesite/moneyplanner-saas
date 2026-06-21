<script setup lang="ts">
import { computed, ref } from 'vue';

type Props = {
  totalAssets: string | number | null | undefined;
  totalLiabilities?: string | number | null | undefined;
  netWorth: string | number | null | undefined;
  unit: string;
  assetBackedLiabilities?: string | number | null | undefined;
  unbackedLiabilities?: string | number | null | undefined;
  centerLabel?: string | undefined;
  centerValue?: string | undefined;
  size?: number | undefined;
  thickness?: number | undefined;
  // Aceptado por compatibilidad con la composición previa; ya no se renderiza.
  showComposition?: boolean | undefined;
};

const props = withDefaults(defineProps<Props>(), {
  size: 200,
  thickness: 14,
});

function normalizeNumberInput(raw: unknown) {
  return String(raw ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}

function toNumber(v: unknown) {
  const n = Number(normalizeNumberInput(v));
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n: number, decimals = 2) {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

const displayUnit = computed(() => (props.unit === 'EUR' ? '€' : props.unit));

const assets = computed(() => Math.max(0, toNumber(props.totalAssets)));
const backedRaw = computed(() => Math.max(0, toNumber(props.assetBackedLiabilities)));
const unbackedRaw = computed(() => Math.max(0, toNumber(props.unbackedLiabilities)));

const backedSlice = computed(() => Math.min(backedRaw.value, assets.value));
const unbackedSlice = computed(() => {
  const room = Math.max(assets.value - backedSlice.value, 0);
  return Math.min(unbackedRaw.value, room);
});
const equitySlice = computed(() =>
  Math.max(assets.value - backedSlice.value - unbackedSlice.value, 0),
);

type Slice = { key: string; label: string; value: number; color: string };

// Composición estructural: capital propio + deuda respaldada + deuda no respaldada
// (juntas suman el total de activos). Tonos del handoff (NW_STRUCTURE).
const slices = computed<Slice[]>(() =>
  [
    {
      key: 'equity',
      label: 'Capital propio',
      value: equitySlice.value,
      color: 'oklch(0.74 0.13 148)',
    },
    {
      key: 'backed',
      label: 'Deuda respaldada',
      value: backedSlice.value,
      color: 'oklch(0.74 0.13 45)',
    },
    {
      key: 'unbacked',
      label: 'Deuda no respaldada',
      value: unbackedSlice.value,
      color: 'oklch(0.74 0.13 24)',
    },
  ].filter((s) => s.value > 0),
);

const sum = computed(() => slices.value.reduce((acc, s) => acc + s.value, 0));

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.thickness) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

type Arc = Slice & { dash: number; offset: number };

const arcs = computed<Arc[]>(() => {
  let off = 0;
  const total = sum.value || 1;
  return slices.value.map((s) => {
    const dash = (s.value / total) * circumference.value;
    const arc: Arc = { ...s, dash, offset: -off };
    off += dash;
    return arc;
  });
});

const hoveredIndex = ref(-1);

// El hover sobre un sector manda sobre el valor por defecto del centro.
const centerEyebrow = computed(() => {
  if (hoveredIndex.value >= 0) return slices.value[hoveredIndex.value]?.label ?? '';
  return props.centerLabel ?? 'Patrimonio neto';
});

const centerBig = computed(() => {
  if (hoveredIndex.value >= 0) {
    const slice = slices.value[hoveredIndex.value];
    return slice ? `${formatMoney(slice.value, 0)} ${displayUnit.value}` : '';
  }
  if (props.centerValue !== undefined) return props.centerValue;
  return `${formatMoney(toNumber(props.netWorth), 2)} ${displayUnit.value}`;
});
</script>

<template>
  <div class="nw-donut">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="nw-donut-svg"
      role="img"
      aria-label="Composición del patrimonio"
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
        class="nw-donut-arc"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = hoveredIndex === index ? -1 : hoveredIndex"
      />
      <g class="nw-donut-center">
        <text :x="cx" :y="cy - 6" text-anchor="middle" class="nw-donut-center-eyebrow">
          {{ centerEyebrow }}
        </text>
        <text :x="cx" :y="cy + 18" text-anchor="middle" class="nw-donut-center-value">
          {{ centerBig }}
        </text>
      </g>
    </svg>
  </div>
</template>
