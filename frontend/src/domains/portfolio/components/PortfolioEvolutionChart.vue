<script setup lang="ts">
import { computed } from 'vue';
import { formatCompact, formatMoney, toNumber } from '@/lib/format';
import { formatShortMonthYear } from '@/lib/dates';
import type { PortfolioTimelinePoint } from '../types';

const props = defineProps<{
  points: PortfolioTimelinePoint[];
  currency: string;
}>();

const width = 960;
const height = 330;
const padding = { top: 24, right: 24, bottom: 42, left: 72 };

const usablePoints = computed(() =>
  props.points.filter(
    (point): point is PortfolioTimelinePoint & { value: string } => point.value !== null,
  ),
);
const values = computed(() =>
  usablePoints.value.flatMap((point) => [toNumber(point.value), toNumber(point.net_contributed)]),
);
const bounds = computed(() => {
  const min = Math.min(...values.value, 0);
  const max = Math.max(...values.value, 1);
  const span = Math.max(max - min, 1);
  return { min: min - span * 0.08, max: max + span * 0.08 };
});
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;

function x(index: number): number {
  if (usablePoints.value.length <= 1) return padding.left + plotWidth / 2;
  return padding.left + (index / (usablePoints.value.length - 1)) * plotWidth;
}

function y(value: number): number {
  const span = bounds.value.max - bounds.value.min || 1;
  return padding.top + (1 - (value - bounds.value.min) / span) * plotHeight;
}

const valuePath = computed(() =>
  usablePoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(toNumber(point.value))}`)
    .join(' '),
);
const contributionPath = computed(() =>
  usablePoints.value
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(toNumber(point.net_contributed))}`,
    )
    .join(' '),
);
const yTicks = computed(() =>
  [0, 1, 2, 3, 4].map((index) => {
    const value = bounds.value.min + ((bounds.value.max - bounds.value.min) * index) / 4;
    return { value, y: y(value) };
  }),
);
const xTicks = computed(() => {
  const total = usablePoints.value.length;
  if (!total) return [];
  const indexes =
    total <= 6
      ? usablePoints.value.map((_, index) => index)
      : [0, Math.floor((total - 1) / 2), total - 1];
  return [...new Set(indexes)].map((index) => ({ index, point: usablePoints.value[index]! }));
});

function money(value: string): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}
</script>

<template>
  <div class="a-pf-chart-shell">
    <div class="a-pf-chart-legend" aria-hidden="true">
      <span><i class="is-value"></i> Valor</span>
      <span><i class="is-contributed"></i> Aportado neto</span>
    </div>
    <svg
      class="a-pf-chart"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      aria-label="Evolución mensual del valor de cartera y las aportaciones netas"
    >
      <g class="a-pf-chart-grid">
        <template v-for="tick in yTicks" :key="tick.y">
          <line :x1="padding.left" :x2="width - padding.right" :y1="tick.y" :y2="tick.y" />
          <text :x="padding.left - 12" :y="tick.y + 4" text-anchor="end">
            {{ formatCompact(tick.value) }}
          </text>
        </template>
      </g>
      <path class="a-pf-chart-line is-contributed" :d="contributionPath" />
      <path class="a-pf-chart-line is-value" :d="valuePath" />
      <g class="a-pf-chart-axis">
        <text
          v-for="tick in xTicks"
          :key="tick.point.date"
          :x="x(tick.index)"
          :y="height - 10"
          text-anchor="middle"
        >
          {{ formatShortMonthYear(tick.point.date) }}
        </text>
      </g>
      <g class="a-pf-chart-points">
        <circle
          v-for="(point, index) in usablePoints"
          :key="point.date"
          :cx="x(index)"
          :cy="y(toNumber(point.value))"
          r="4"
        >
          <title>{{ formatShortMonthYear(point.date) }}: {{ money(point.value) }}</title>
        </circle>
      </g>
    </svg>

    <details class="a-pf-chart-data">
      <summary>Ver datos del gráfico</summary>
      <div class="a-pf-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th class="num">Valor</th>
              <th class="num">Aportado neto</th>
              <th>Datos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="point in points" :key="point.date">
              <td>{{ formatShortMonthYear(point.date) }}</td>
              <td class="num mono">{{ point.value === null ? '—' : money(point.value) }}</td>
              <td class="num mono">{{ money(point.net_contributed) }}</td>
              <td>{{ point.coverage === 'complete' ? 'Completos' : 'Parciales' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
