<script setup lang="ts">
import { computed, ref, useId } from 'vue';

export type NetWorthEvolutionPoint = {
  date: string;
  shortLabel: string;
  fullLabel: string;
  value: number;
  isCurrent?: boolean;
};

type Props = {
  points: NetWorthEvolutionPoint[];
  unit: string;
  seriesLabel: string;
  seriesColor?: string;
  yAxisMinZero?: boolean;
  expanded?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  seriesColor: 'var(--accent)',
  yAxisMinZero: false,
  expanded: false,
});

// Geometría del prototipo (handoff/direction-a.jsx · AInteractiveChart).
// viewBox fijo y ancho 100%: el SVG escala con el contenedor, así que el modo
// "expanded" sólo se ve más grande porque su contenedor es más ancho.
const W = 1280;
const padL = 56;
const padR = 16;
const padT = 12;
const padB = 18;
const gap = 12;
const lineH = 280;
const deltaH = 72;
const totalH = lineH + gap + deltaH;

const wrapRef = ref<HTMLElement | null>(null);
const hoverIndex = ref<number | null>(null);
const chartId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const areaGradientId = `a-nw-evo-grad-${chartId}`;
const zoneLineGradientId = `a-nw-evo-zone-line-${chartId}`;

const displayUnit = computed(() => (props.unit === 'EUR' ? '€' : props.unit));

function formatNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${formatNumber(value / 1_000_000, 1)}M`;
  if (abs >= 1_000) return `${formatNumber(value / 1_000, 0)}k`;
  return formatNumber(value, 0);
}

const values = computed(() => props.points.map((p) => p.value));
const hasNegative = computed(() => values.value.some((v) => v < 0));
const hasPositive = computed(() => values.value.some((v) => v > 0));

const bounds = computed(() => {
  if (!values.value.length) return { min: 0, max: 1 };
  let min = Math.min(...values.value);
  const max = Math.max(...values.value);
  if (props.yAxisMinZero && !hasNegative.value && min > 0) min = 0;
  if (min === max) {
    // Evita rango 0: deja aire arriba y abajo.
    const pad = Math.abs(max) * 0.1 || 1;
    return { min: min - pad, max: max + pad };
  }
  return { min, max };
});

const range = computed(() => bounds.value.max - bounds.value.min || 1);

function px(i: number): number {
  const n = props.points.length;
  if (n <= 1) return padL + (W - padL - padR) / 2;
  return padL + (i / (n - 1)) * (W - padL - padR);
}

function py(v: number): number {
  return padT + (1 - (v - bounds.value.min) / range.value) * (lineH - padT - padB);
}

const pts = computed(() => props.points.map((p, i) => ({ x: px(i), y: py(p.value) })));
const zeroLineVisible = computed(() => hasNegative.value && hasPositive.value);
const zeroY = computed(() => py(0));

function zoneColor(value: number): string {
  if (value < 0) return 'var(--neg)';
  if (value > 0) return 'var(--pos)';
  return 'var(--muted)';
}

const lineStops = computed(() => {
  const points = props.points;
  if (!points.length) return [{ offset: 0, color: 'var(--muted)' }];
  if (points.length === 1) return [{ offset: 0, color: zoneColor(points[0]!.value) }];

  const stops: { offset: number; color: string }[] = [
    { offset: 0, color: zoneColor(points[0]!.value) },
  ];

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1]!;
    const current = points[i]!;
    if (previous.value === 0 || current.value === 0 || previous.value * current.value >= 0) {
      continue;
    }

    const t = Math.abs(previous.value) / (Math.abs(previous.value) + Math.abs(current.value));
    const offset = (i - 1 + t) / (points.length - 1);
    stops.push({ offset, color: zoneColor(previous.value) });
    stops.push({ offset, color: zoneColor(current.value) });
  }

  stops.push({ offset: 1, color: zoneColor(points[points.length - 1]!.value) });
  return stops;
});

// Eje Y: 8 ticks "bonitos" repartidos entre min y max.
const yTicks = computed(() =>
  [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const v = bounds.value.min + range.value * (i / 7);
    return { v, y: py(v), strong: i === 0 };
  }),
);

// Línea suave: Catmull-Rom → bézier cúbica (tensión 0.22), igual que el prototipo.
const linePath = computed(() => {
  const p = pts.value;
  if (!p.length) return '';
  if (p.length === 1) return `M ${p[0]!.x} ${p[0]!.y}`;
  const tension = 0.22;
  let d = `M ${p[0]!.x} ${p[0]!.y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]!;
    const p1 = p[i]!;
    const p2 = p[i + 1]!;
    const p3 = p[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
});

const areaPath = computed(() => {
  const p = pts.value;
  if (p.length < 2) return '';
  const baseline = lineH - padB;
  return `${linePath.value} L ${p[p.length - 1]!.x} ${baseline} L ${p[0]!.x} ${baseline} Z`;
});

const deltas = computed(() =>
  props.points.map((p, i) => (i === 0 ? 0 : p.value - props.points[i - 1]!.value)),
);

const maxDelta = computed(() => Math.max(1, ...deltas.value.map((d) => Math.abs(d))));
const deltaCenter = lineH + gap + deltaH / 2;

function deltaOffset(delta: number): number {
  return (delta / maxDelta.value) * (deltaH / 2 - 4);
}

const barWidth = computed(() => ((W - padL - padR) / Math.max(1, props.points.length)) * 0.4);

// Calcula etiquetas del eje X. En períodos cortos (≤14 puntos) usa el mes; en períodos
// largos muestra solo la primera aparición de cada año.
// ≤12 puntos (hasta 1a): todos los meses. >12 puntos (5a, all): una etiqueta por año.
const xAxisLabels = computed<{ label: string; show: boolean }[]>(() => {
  const n = props.points.length;
  if (n <= 12) {
    return props.points.map((p) => ({ label: p.shortLabel, show: true }));
  }
  const seenYears = new Set<string>();
  return props.points.map((p) => {
    const year = /^\d{4}/.test(p.date) ? p.date.slice(0, 4) : '';
    if (!year) return { label: '', show: false };
    const show = !seenYears.has(year);
    seenYears.add(year);
    return { label: year, show };
  });
});

const hoverPoint = computed(() =>
  hoverIndex.value != null ? (props.points[hoverIndex.value] ?? null) : null,
);
const hoverDelta = computed(() =>
  hoverIndex.value != null ? (deltas.value[hoverIndex.value] ?? 0) : 0,
);
const hoverLeftPct = computed(() =>
  hoverIndex.value != null ? (px(hoverIndex.value) / W) * 100 : 0,
);

function handleMove(event: MouseEvent): void {
  const el = wrapRef.value;
  const n = props.points.length;
  if (!el || n === 0) return;
  const rect = el.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * W;
  const idx = Math.round(((x - padL) / (W - padL - padR)) * (n - 1));
  hoverIndex.value = Math.max(0, Math.min(n - 1, idx));
}

function handleLeave(): void {
  hoverIndex.value = null;
}
</script>

<template>
  <div
    ref="wrapRef"
    class="a-nw-evo"
    :style="{ color: seriesColor }"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  >
    <svg
      class="a-nw-evo-svg"
      :viewBox="`0 0 ${W} ${totalH}`"
      :aria-label="`Evolución de ${seriesLabel}`"
      role="img"
    >
      <defs>
        <linearGradient :id="areaGradientId" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.32" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          :id="zoneLineGradientId"
          :x1="padL"
          :x2="W - padR"
          y1="0"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            v-for="(stop, index) in lineStops"
            :key="`line-stop-${index}`"
            :offset="`${stop.offset * 100}%`"
            :stop-color="stop.color"
          />
        </linearGradient>
      </defs>

      <!-- Eje Y: 8 ticks con etiqueta compacta -->
      <g v-for="(tick, i) in yTicks" :key="`y-${i}`">
        <line
          :x1="padL"
          :x2="W - padR"
          :y1="tick.y"
          :y2="tick.y"
          stroke="currentColor"
          :stroke-opacity="tick.strong ? 0.14 : 0.07"
        />
        <text :x="padL - 8" :y="tick.y + 3" text-anchor="end" class="a-nw-evo-axis">
          {{ formatCompact(tick.v) }}
        </text>
      </g>

      <!-- Cero patrimonial: solo aparece cuando el rango cruza de negativo a positivo. -->
      <g v-if="zeroLineVisible" class="a-nw-evo-zero">
        <line
          :x1="padL"
          :x2="W - padR"
          :y1="zeroY"
          :y2="zeroY"
          vector-effect="non-scaling-stroke"
        />
        <text :x="padL - 8" :y="zeroY - 7" text-anchor="end" class="a-nw-evo-zero-label">
          0 {{ displayUnit }}
        </text>
      </g>

      <!-- Área + línea suave (trazo de grosor constante a cualquier escala) -->
      <path :d="areaPath" :fill="`url(#${areaGradientId})`" />
      <path
        :d="linePath"
        fill="none"
        :stroke="`url(#${zoneLineGradientId})`"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />

      <!-- Puntos sutiles -->
      <circle
        v-for="(p, i) in pts"
        :key="`pt-${i}`"
        :cx="p.x"
        :cy="p.y"
        :r="hoverIndex === i ? 0 : 2"
        :fill="zoneColor(props.points[i]?.value ?? 0)"
        fill-opacity="0.7"
      />

      <!-- Crosshair + marcador al hover -->
      <g v-if="hoverPoint">
        <line
          :x1="px(hoverIndex as number)"
          :x2="px(hoverIndex as number)"
          :y1="padT"
          :y2="lineH + gap + deltaH - 4"
          stroke="currentColor"
          stroke-opacity="0.42"
          stroke-dasharray="3 3"
          vector-effect="non-scaling-stroke"
        />
        <circle
          :cx="px(hoverIndex as number)"
          :cy="py(hoverPoint.value)"
          r="6"
          fill="var(--bg)"
          :stroke="zoneColor(hoverPoint.value)"
          stroke-width="2.5"
          vector-effect="non-scaling-stroke"
        />
      </g>

      <!-- Línea cero de la región de delta -->
      <line
        :x1="padL"
        :x2="W - padR"
        :y1="deltaCenter"
        :y2="deltaCenter"
        stroke="currentColor"
        stroke-opacity="0.18"
      />

      <!-- Barras de variación mensual -->
      <template v-for="(delta, i) in deltas" :key="`d-${i}`">
        <rect
          v-if="i !== 0"
          :x="px(i) - barWidth / 2"
          :y="delta >= 0 ? deltaCenter - deltaOffset(delta) : deltaCenter"
          :width="barWidth"
          :height="Math.abs(deltaOffset(delta)) || 1"
          :fill="delta >= 0 ? 'var(--pos)' : 'var(--neg)'"
          :fill-opacity="hoverIndex === i ? 1 : 0.62"
          rx="1.5"
        />
      </template>

      <!-- Etiquetas eje X: solo se renderizan los nodos visibles -->
      <template v-for="(entry, i) in xAxisLabels" :key="`x-${i}`">
        <text
          v-if="entry.show || hoverIndex === i"
          :x="px(i)"
          :y="totalH - 2"
          text-anchor="middle"
          class="a-nw-evo-axis"
          :fill-opacity="hoverIndex === i ? 0.95 : 0.5"
        >
          {{ hoverIndex === i ? (props.points[i]?.shortLabel ?? entry.label) : entry.label }}
        </text>
      </template>
    </svg>

    <!-- Tooltip: patrimonio neto + variación -->
    <div v-if="hoverPoint" class="a-nw-evo-tip" :style="{ left: `${hoverLeftPct}%`, top: '0' }">
      <div class="a-nw-evo-tip-label">{{ hoverPoint.fullLabel }}</div>
      <div class="a-nw-evo-tip-value">
        {{ formatNumber(hoverPoint.value, 2) }} {{ displayUnit }}
      </div>
      <div
        v-if="hoverIndex && hoverIndex > 0"
        class="a-nw-evo-tip-delta"
        :class="hoverDelta >= 0 ? 'pos' : 'neg'"
      >
        {{ hoverDelta >= 0 ? '+' : '' }}{{ formatNumber(hoverDelta, 0) }} {{ displayUnit }}
      </div>
    </div>
  </div>
</template>
