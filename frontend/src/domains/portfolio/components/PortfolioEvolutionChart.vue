<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { formatCompact, formatMoney, toNumber } from '@/lib/format';
import { formatShortMonthYear } from '@/lib/dates';
import type { PortfolioTimelinePoint } from '../types';

const props = defineProps<{
  points: PortfolioTimelinePoint[];
  currency: string;
}>();

// Misma geometría que el gráfico de Patrimonio: viewBox fijo y ancho 100%, así el SVG
// escala con el contenedor y las dos vistas comparten proporciones.
const W = 1280;
const padL = 78;
const padR = 28;
const padT = 18;
const padB = 34;
const H = 300;

const chartId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const areaGradientId = `a-pf-evo-grad-${chartId}`;
const hoverIndex = ref<number | null>(null);

const usablePoints = computed(() =>
  props.points.filter(
    (point): point is PortfolioTimelinePoint & { value: string } => point.value !== null,
  ),
);

const bounds = computed(() => {
  const values = usablePoints.value.flatMap((point) => [
    toNumber(point.value),
    toNumber(point.contributed_to_date),
  ]);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = Math.max(max - min, 1);
  return { min: min - span * 0.08, max: max + span * 0.08 };
});

const plotWidth = W - padL - padR;
const plotHeight = H - padT - padB;

function x(index: number): number {
  if (usablePoints.value.length <= 1) return padL + plotWidth / 2;
  return padL + (index / (usablePoints.value.length - 1)) * plotWidth;
}

function y(value: number): number {
  const span = bounds.value.max - bounds.value.min || 1;
  return padT + (1 - (value - bounds.value.min) / span) * plotHeight;
}

function linePath(read: (point: PortfolioTimelinePoint) => number): string {
  return usablePoints.value
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(read(point))}`)
    .join(' ');
}

const valuePath = computed(() => linePath((point) => toNumber(point.value)));
const contributionPath = computed(() => linePath((point) => toNumber(point.contributed_to_date)));
const valueAreaPath = computed(() => {
  if (!usablePoints.value.length) return '';
  const baseline = y(Math.max(bounds.value.min, 0));
  const last = usablePoints.value.length - 1;
  return `${valuePath.value} L ${x(last)} ${baseline} L ${x(0)} ${baseline} Z`;
});

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

const activeIndex = computed(() =>
  hoverIndex.value === null ? usablePoints.value.length - 1 : hoverIndex.value,
);
const activePoint = computed(() => usablePoints.value[activeIndex.value] ?? null);

function money(value: string): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}
</script>

<template>
  <div class="a-pf-chart-shell">
    <div class="a-pf-chart-legend">
      <span><i class="is-value"></i> Valor</span>
      <span><i class="is-contributed"></i> Capital aportado</span>
      <strong v-if="activePoint" class="a-pf-chart-readout">
        {{ formatShortMonthYear(activePoint.date) }} · {{ money(activePoint.value) }}
        <small>aportado {{ money(activePoint.contributed_to_date) }}</small>
      </strong>
    </div>
    <svg
      class="a-pf-chart"
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      aria-label="Evolución mensual del valor de cartera frente al capital aportado"
      @mouseleave="hoverIndex = null"
    >
      <defs>
        <linearGradient :id="areaGradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.26" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g class="a-pf-chart-grid">
        <template v-for="tick in yTicks" :key="tick.y">
          <line :x1="padL" :x2="W - padR" :y1="tick.y" :y2="tick.y" />
          <text :x="padL - 12" :y="tick.y + 4" text-anchor="end">
            {{ formatCompact(tick.value) }}
          </text>
        </template>
      </g>

      <path class="a-pf-chart-area" :d="valueAreaPath" :fill="`url(#${areaGradientId})`" />
      <path class="a-pf-chart-line is-contributed" :d="contributionPath" />
      <path class="a-pf-chart-line is-value" :d="valuePath" />

      <g class="a-pf-chart-axis">
        <text
          v-for="tick in xTicks"
          :key="tick.point.date"
          :x="x(tick.index)"
          :y="H - 10"
          text-anchor="middle"
        >
          {{ formatShortMonthYear(tick.point.date) }}
        </text>
      </g>

      <!-- Una marca por punto competía con la propia línea: solo se dibuja la del punto
           bajo el cursor, y por defecto la del cierre. -->
      <g v-if="activePoint" class="a-pf-chart-cursor">
        <line :x1="x(activeIndex)" :x2="x(activeIndex)" :y1="padT" :y2="H - padB" />
        <circle :cx="x(activeIndex)" :cy="y(toNumber(activePoint.value))" r="5" />
      </g>

      <rect
        v-for="(point, index) in usablePoints"
        :key="point.date"
        class="a-pf-chart-hit"
        :x="x(index) - plotWidth / Math.max(usablePoints.length - 1, 1) / 2"
        :y="padT"
        :width="plotWidth / Math.max(usablePoints.length - 1, 1)"
        :height="plotHeight"
        @mouseenter="hoverIndex = index"
      >
        <title>
          {{ formatShortMonthYear(point.date) }}: {{ money(point.value) }} · aportado
          {{ money(point.contributed_to_date) }}
        </title>
      </rect>
    </svg>

    <details class="a-pf-chart-data">
      <summary>Ver datos del gráfico</summary>
      <div class="a-pf-table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th class="num">Valor</th>
              <th class="num">Capital aportado</th>
              <th class="num">Aportado en el periodo</th>
              <th>Datos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="point in points" :key="point.date">
              <td>{{ formatShortMonthYear(point.date) }}</td>
              <td class="num mono">{{ point.value === null ? '—' : money(point.value) }}</td>
              <td class="num mono">{{ money(point.contributed_to_date) }}</td>
              <td class="num mono">{{ money(point.net_contributed) }}</td>
              <td>{{ point.coverage === 'complete' ? 'Completos' : 'Parciales' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>
