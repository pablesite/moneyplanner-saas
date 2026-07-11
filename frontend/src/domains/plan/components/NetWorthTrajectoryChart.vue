<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatCompact, formatMoney } from '@/lib/format';
import { formatMonthYearLabel } from '@/lib/dates';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import type { ProjectionResponse } from '@/domains/plan/types';
import type { PlanTimelineMarker } from '@/domains/plan/usePlanEvents';

const props = withDefaults(
  defineProps<{
    timeline: NetWorthTimeline | null;
    projection: ProjectionResponse;
    events?: PlanTimelineMarker[];
  }>(),
  { events: () => [] },
);

const W = 960;
const H = 280;
const padL = 72;
const padR = 24;
const padT = 22;
const padB = 34;
const hoverIndex = ref<number | null>(null);

type Point = {
  t: number;
  label: string;
  value: number;
  kind: 'historical' | 'projected';
  year?: number;
};

const historicalPoints = computed<Point[]>(() =>
  (props.timeline?.rows ?? []).slice(-36).map((row) => ({
    t: Date.parse(row.date),
    label: formatMonthYearLabel(row.date),
    value: Number(row.net_worth),
    kind: 'historical' as const,
  })),
);

// Las filas proyectadas son valores a fin de año; se descartan las que quedan
// por detrás del último cierre histórico para que el eje temporal no retroceda.
const projectedRows = computed(() => {
  const history = historicalPoints.value;
  const lastHistorical = history.length ? history[history.length - 1]!.t : Number.NEGATIVE_INFINITY;
  return props.projection.trajectory
    .map((row) => ({ row, t: Date.parse(`${row.year}-12-31`) }))
    .filter((entry) => entry.t > lastHistorical);
});

const projectedPoints = computed<Point[]>(() =>
  projectedRows.value.map(({ row, t }) => ({
    t,
    label: String(row.year),
    value: Number(row.net_worth),
    kind: 'projected' as const,
    year: row.year,
  })),
);

const points = computed<Point[]>(() => [...historicalPoints.value, ...projectedPoints.value]);

const productiveSeries = computed(() =>
  projectedRows.value.map(({ row, t }) => ({ t, value: Number(row.productive_capital) })),
);
const targetSeries = computed(() =>
  projectedRows.value.map(({ row, t }) => ({ t, value: Number(row.target_capital) })),
);

const values = computed(() => [
  ...points.value.map((point) => point.value),
  ...productiveSeries.value.map((entry) => entry.value),
  ...targetSeries.value.map((entry) => entry.value),
]);
const bounds = computed(() => {
  if (!values.value.length) return { min: 0, max: 1 };
  const min = Math.min(...values.value, 0);
  const max = Math.max(...values.value, 1);
  if (min === max) return { min: min - 1, max: max + 1 };
  return { min, max };
});
const range = computed(() => bounds.value.max - bounds.value.min || 1);

const timeBounds = computed(() => {
  if (!points.value.length) return { min: 0, max: 1 };
  const min = points.value[0]!.t;
  const max = points.value[points.value.length - 1]!.t;
  return { min, max: max === min ? min + 1 : max };
});

function tx(t: number): number {
  const { min, max } = timeBounds.value;
  return padL + ((t - min) / (max - min)) * (W - padL - padR);
}

function py(value: number): number {
  return padT + (1 - (value - bounds.value.min) / range.value) * (H - padT - padB);
}

function buildPath(series: Array<{ t: number; value: number }>): string {
  if (!series.length) return '';
  return series
    .map((entry, index) => `${index === 0 ? 'M' : 'L'} ${tx(entry.t)} ${py(entry.value)}`)
    .join(' ');
}

const historicalPath = computed(() => buildPath(historicalPoints.value));
const projectedPath = computed(() => buildPath(projectedPoints.value));
const productivePath = computed(() => buildPath(productiveSeries.value));
const targetPath = computed(() => buildPath(targetSeries.value));

const yTicks = computed(() =>
  [0, 1, 2, 3].map((i) => {
    const value = bounds.value.min + range.value * (i / 3);
    return { value, y: py(value) };
  }),
);

const xTicks = computed(() => {
  const { min, max } = timeBounds.value;
  const firstYear = new Date(min).getFullYear();
  const lastYear = new Date(max).getFullYear();
  const span = Math.max(1, lastYear - firstYear);
  const step = Math.max(1, Math.ceil(span / 7));
  const ticks: Array<{ x: number; label: number }> = [];
  for (let year = Math.ceil(firstYear / step) * step; year <= lastYear; year += step) {
    const t = Date.parse(`${year}-01-01`);
    if (t < min || t > max) continue;
    ticks.push({ x: tx(t), label: year });
  }
  return ticks;
});

type YearMarker = { x: number; label: string; kind: 'target' | 'projected' };

const yearMarkers = computed<YearMarker[]>(() => {
  const markers: YearMarker[] = [];
  const { min, max } = timeBounds.value;
  const targetYear = props.projection.summary.target_year.value;
  const projectedYear = props.projection.summary.projected_year.value;
  const targetT = Date.parse(`${targetYear}-12-31`);
  if (targetT >= min && targetT <= max) {
    markers.push({ x: tx(targetT), label: `Objetivo ${targetYear}`, kind: 'target' });
  }
  if (projectedYear != null) {
    const projectedT = Date.parse(`${projectedYear}-12-31`);
    if (projectedT >= min && projectedT <= max) {
      markers.push({ x: tx(projectedT), label: `Estimada ${projectedYear}`, kind: 'projected' });
    }
  }
  return markers;
});

type EventMarker = {
  id: number;
  x: number;
  label: string;
  detail: string;
  status: PlanTimelineMarker['status'];
};

// Acontecimientos incorporados al plan como anotaciones sobre el eje temporal,
// recortados al rango visible; no son una serie más.
const eventMarkers = computed<EventMarker[]>(() => {
  const { min, max } = timeBounds.value;
  return props.events
    .map((marker) => ({ marker, t: Date.parse(marker.date) }))
    .filter((entry) => Number.isFinite(entry.t) && entry.t >= min && entry.t <= max)
    .map(({ marker, t }) => ({
      id: marker.id,
      x: tx(t),
      label: marker.label,
      detail: marker.detail,
      status: marker.status,
    }));
});

const hoverPoint = computed(() =>
  hoverIndex.value == null ? null : (points.value[hoverIndex.value] ?? null),
);

const hoverDetail = computed(() => {
  const point = hoverPoint.value;
  if (!point || point.kind !== 'projected' || point.year == null) return null;
  const row = props.projection.trajectory.find((entry) => entry.year === point.year);
  if (!row) return null;
  return {
    productive: Number(row.productive_capital),
    target: Number(row.target_capital),
  };
});

function onMove(event: MouseEvent): void {
  if (!points.value.length) return;
  const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * W;
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  points.value.forEach((point, index) => {
    const distance = Math.abs(tx(point.t) - x);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = index;
    }
  });
  hoverIndex.value = nearest;
}
</script>

<template>
  <section class="sect plan-trajectory">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Trayectoria patrimonial</p>
        <h2 class="sect-title">Histórico y proyección</h2>
        <p class="sect-sub">
          La fecha llega cuando el capital productivo alcanza el capital objetivo, no cuando lo hace
          el patrimonio total.
        </p>
      </div>
      <div class="plan-chart-legend" aria-hidden="true">
        <span><i class="hist"></i> Histórico</span>
        <span><i class="proj"></i> Proyección</span>
        <span><i class="prod"></i> Capital productivo</span>
        <span><i class="target"></i> Capital objetivo</span>
        <span v-if="eventMarkers.length"><i class="event"></i> Acontecimiento</span>
      </div>
    </div>

    <div v-if="points.length < 2" class="plan-chart-empty">
      No hay suficientes puntos para dibujar la trayectoria.
    </div>
    <div v-else class="plan-chart-wrap">
      <svg
        class="plan-chart"
        :viewBox="`0 0 ${W} ${H}`"
        role="img"
        aria-label="Trayectoria patrimonial histórica y proyectada frente al capital objetivo"
        @mousemove="onMove"
        @mouseleave="hoverIndex = null"
      >
        <g class="plan-chart-grid">
          <line
            v-for="tick in yTicks"
            :key="tick.value"
            :x1="padL"
            :x2="W - padR"
            :y1="tick.y"
            :y2="tick.y"
          />
          <text v-for="tick in yTicks" :key="`label-${tick.value}`" :x="8" :y="tick.y + 4">
            {{ formatCompact(tick.value) }}
          </text>
          <text
            v-for="tick in xTicks"
            :key="`x-${tick.label}`"
            class="plan-chart-x-label"
            :x="tick.x"
            :y="H - 10"
          >
            {{ tick.label }}
          </text>
        </g>
        <g v-for="marker in yearMarkers" :key="marker.label" class="plan-chart-marker">
          <line :x1="marker.x" :x2="marker.x" :y1="padT" :y2="H - padB" :class="marker.kind" />
          <text :x="marker.x" :y="padT - 8" :class="marker.kind">{{ marker.label }}</text>
        </g>
        <g v-for="marker in eventMarkers" :key="`event-${marker.id}`" class="plan-chart-event">
          <title>{{ marker.label }} · {{ marker.detail }}</title>
          <line :x1="marker.x" :x2="marker.x" :y1="padT" :y2="H - padB" />
          <circle :cx="marker.x" :cy="H - padB" r="4" />
          <text :x="marker.x" :y="H - padB - 8">{{ marker.label }}</text>
        </g>
        <path v-if="targetPath" class="plan-chart-line target" :d="targetPath" />
        <path v-if="productivePath" class="plan-chart-line prod" :d="productivePath" />
        <path v-if="historicalPath" class="plan-chart-line hist" :d="historicalPath" />
        <path v-if="projectedPath" class="plan-chart-line proj" :d="projectedPath" />
        <g v-if="hoverPoint && hoverIndex !== null">
          <line
            class="plan-chart-hover-line"
            :x1="tx(hoverPoint.t)"
            :x2="tx(hoverPoint.t)"
            :y1="padT"
            :y2="H - padB"
          />
          <circle
            class="plan-chart-hover-dot"
            :cx="tx(hoverPoint.t)"
            :cy="py(hoverPoint.value)"
            r="5"
          />
        </g>
      </svg>
      <div v-if="hoverPoint" class="plan-chart-tooltip">
        <strong>{{ hoverPoint.label }}</strong>
        <span>{{ formatMoney(hoverPoint.value) }}</span>
        <template v-if="hoverDetail">
          <span>Productivo {{ formatMoney(hoverDetail.productive) }}</span>
          <span>Objetivo {{ formatMoney(hoverDetail.target) }}</span>
        </template>
        <em>{{ hoverPoint.kind === 'historical' ? 'Histórico' : 'Proyección' }}</em>
      </div>
    </div>
  </section>
</template>
