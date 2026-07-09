<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatCompact, formatMoney } from '@/lib/format';
import { formatMonthYearLabel } from '@/lib/dates';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import type { ProjectionResponse } from '@/domains/plan/types';

const props = defineProps<{
  timeline: NetWorthTimeline | null;
  projection: ProjectionResponse;
}>();

const W = 960;
const H = 280;
const padL = 72;
const padR = 24;
const padT = 22;
const padB = 34;
const hoverIndex = ref<number | null>(null);

type Point = { date: string; label: string; value: number; kind: 'historical' | 'projected' };

const points = computed<Point[]>(() => {
  const historical = (props.timeline?.rows ?? []).map((row) => ({
    date: row.date,
    label: formatMonthYearLabel(row.date),
    value: Number(row.net_worth),
    kind: 'historical' as const,
  }));
  const projected = props.projection.trajectory.map((row) => ({
    date: `${row.year}-01-01`,
    label: String(row.year),
    value: Number(row.net_worth),
    kind: 'projected' as const,
  }));
  return [...historical.slice(-36), ...projected];
});

const values = computed(() => points.value.map((point) => point.value));
const bounds = computed(() => {
  if (!values.value.length) return { min: 0, max: 1 };
  const min = Math.min(...values.value, 0);
  const max = Math.max(...values.value, 1);
  if (min === max) return { min: min - 1, max: max + 1 };
  return { min, max };
});
const range = computed(() => bounds.value.max - bounds.value.min || 1);

function px(index: number): number {
  if (points.value.length <= 1) return padL + (W - padL - padR) / 2;
  return padL + (index / (points.value.length - 1)) * (W - padL - padR);
}

function py(value: number): number {
  return padT + (1 - (value - bounds.value.min) / range.value) * (H - padT - padB);
}

function buildPath(kind: Point['kind']): string {
  const indexed = points.value
    .map((point, index) => ({ point, index }))
    .filter((entry) => entry.point.kind === kind);
  if (!indexed.length) return '';
  return indexed
    .map(
      (entry, localIndex) =>
        `${localIndex === 0 ? 'M' : 'L'} ${px(entry.index)} ${py(entry.point.value)}`,
    )
    .join(' ');
}

const historicalPath = computed(() => buildPath('historical'));
const projectedPath = computed(() => buildPath('projected'));
const yTicks = computed(() =>
  [0, 1, 2, 3].map((i) => {
    const value = bounds.value.min + range.value * (i / 3);
    return { value, y: py(value) };
  }),
);
const hoverPoint = computed(() =>
  hoverIndex.value == null ? null : (points.value[hoverIndex.value] ?? null),
);

function onMove(event: MouseEvent): void {
  const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * W;
  const idx = Math.round(((x - padL) / (W - padL - padR)) * (points.value.length - 1));
  hoverIndex.value = Math.max(0, Math.min(points.value.length - 1, idx));
}
</script>

<template>
  <section class="sect plan-trajectory">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Trayectoria patrimonial</p>
        <h2 class="sect-title">Histórico y proyección</h2>
        <p class="sect-sub">Histórico de Patrimonio más tramo proyectado del escenario activo.</p>
      </div>
      <div class="plan-chart-legend" aria-hidden="true">
        <span><i class="hist"></i> Histórico</span>
        <span><i class="proj"></i> Proyección</span>
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
        aria-label="Trayectoria patrimonial histórica y proyectada"
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
        </g>
        <path v-if="historicalPath" class="plan-chart-line hist" :d="historicalPath" />
        <path v-if="projectedPath" class="plan-chart-line proj" :d="projectedPath" />
        <g v-if="hoverPoint && hoverIndex !== null">
          <line
            class="plan-chart-hover-line"
            :x1="px(hoverIndex)"
            :x2="px(hoverIndex)"
            :y1="padT"
            :y2="H - padB"
          />
          <circle
            class="plan-chart-hover-dot"
            :cx="px(hoverIndex)"
            :cy="py(hoverPoint.value)"
            r="5"
          />
        </g>
      </svg>
      <div v-if="hoverPoint" class="plan-chart-tooltip">
        <strong>{{ hoverPoint.label }}</strong>
        <span>{{ formatMoney(hoverPoint.value) }}</span>
        <em>{{ hoverPoint.kind === 'historical' ? 'Histórico' : 'Proyección' }}</em>
      </div>
    </div>
  </section>
</template>
