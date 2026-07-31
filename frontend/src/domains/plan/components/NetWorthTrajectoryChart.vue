<script setup lang="ts">
import { computed, ref } from 'vue';
import { AInfoHint } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import { formatMonthYearLabel, formatShortMonthYear } from '@/lib/dates';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import type { PlanMember, ProjectionResponse } from '@/domains/plan/types';
import { ageInYear, compactYearWithAges } from '@/domains/plan/age';
import type { PlanTimelineMarker } from '@/domains/plan/usePlanEvents';

const props = withDefaults(
  defineProps<{
    timeline: NetWorthTimeline | null;
    projection: ProjectionResponse;
    members?: PlanMember[];
    events?: PlanTimelineMarker[];
    sustainableYear?: number | null;
    desiredYear?: number | null;
  }>(),
  { events: () => [], members: () => [] },
);

const W = 960;
const H = 300;
const padL = 72;
const padR = 72;
const padT = 34;
const padB = 38;
const hoverIndex = ref<number | null>(null);

type Point = {
  t: number;
  date?: string;
  label: string;
  value: number;
  kind: 'historical' | 'projected';
  year?: number;
};

const historicalPoints = computed<Point[]>(() =>
  (props.timeline?.rows ?? []).map((row) => ({
    t: Date.parse(row.date),
    date: row.date,
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
    label: compactYearWithAges(row.year, props.members),
    value: Number(row.net_worth),
    kind: 'projected' as const,
    year: row.year,
  })),
);

const points = computed<Point[]>(() => [...historicalPoints.value, ...projectedPoints.value]);

const hasHistoricalComposition = computed(() =>
  (props.timeline?.rows ?? []).some((row) => row.assets_by_category != null),
);
const historicalProductiveSeries = computed(() =>
  hasHistoricalComposition.value
    ? (props.timeline?.rows ?? []).map((row) => ({
        t: Date.parse(row.date),
        value: Number(row.assets_by_category?.investments ?? 0),
      }))
    : [],
);
const historicalSecuritySeries = computed(() =>
  hasHistoricalComposition.value
    ? (props.timeline?.rows ?? []).map((row) => ({
        t: Date.parse(row.date),
        value: Number(row.assets_by_category?.cash ?? 0),
      }))
    : [],
);
const projectedProductiveSeries = computed(() =>
  projectedRows.value.map(({ row, t }) => ({ t, value: Number(row.productive_capital) })),
);
const projectedSecuritySeries = computed(() =>
  projectedRows.value.map(({ row, t }) => ({ t, value: Number(row.security_capital) })),
);
const targetSeries = computed(() =>
  projectedRows.value.map(({ row, t }) => ({ t, value: Number(row.target_capital) })),
);

const netWorthValues = computed(() => points.value.map((point) => point.value));
const capitalValues = computed(() => [
  ...historicalProductiveSeries.value.map((entry) => entry.value),
  ...historicalSecuritySeries.value.map((entry) => entry.value),
  ...projectedProductiveSeries.value.map((entry) => entry.value),
  ...projectedSecuritySeries.value.map((entry) => entry.value),
  ...targetSeries.value.map((entry) => entry.value),
]);

type NumericScale = { min: number; max: number; step: number };

function niceStep(span: number, targetIntervals = 10): number {
  const roughStep = span / targetIntervals;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const normalized = roughStep / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function numericScale(values: number[]): NumericScale {
  if (!values.length) return { min: 0, max: 1, step: 1 };
  const rawMin = Math.min(...values, 0);
  const rawMax = Math.max(...values, 0);
  const span = rawMax - rawMin || 1;
  const step = niceStep(span);
  const min = Math.floor(rawMin / step) * step;
  const max = Math.ceil(rawMax / step) * step;
  return { min, max: max === min ? min + step : max, step };
}

function scaleTicks(scale: NumericScale): number[] {
  const count = Math.round((scale.max - scale.min) / scale.step);
  return Array.from({ length: count + 1 }, (_, index) => scale.min + index * scale.step);
}

function formatAxisTick(value: number): string {
  const abs = Math.abs(value);
  const divisor = abs >= 1_000_000 ? 1_000_000 : abs >= 1_000 ? 1_000 : 1;
  const suffix = divisor === 1_000_000 ? 'M' : divisor === 1_000 ? 'k' : '';
  return `${(value / divisor).toLocaleString('es-ES', { maximumFractionDigits: 1 })}${suffix}`;
}

const netWorthScale = computed(() => numericScale(netWorthValues.value));
const capitalScale = computed(() => numericScale(capitalValues.value));
const netWorthBounds = computed(() => netWorthScale.value);
const capitalBounds = computed(() => capitalScale.value);

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

function scaledY(value: number, bounds: { min: number; max: number }): number {
  const range = bounds.max - bounds.min || 1;
  return padT + (1 - (value - bounds.min) / range) * (H - padT - padB);
}

function pyNetWorth(value: number): number {
  return scaledY(value, netWorthBounds.value);
}

function pyCapital(value: number): number {
  return scaledY(value, capitalBounds.value);
}

function buildPath(
  series: Array<{ t: number; value: number }>,
  yScale: (value: number) => number,
): string {
  if (!series.length) return '';
  return series
    .map((entry, index) => `${index === 0 ? 'M' : 'L'} ${tx(entry.t)} ${yScale(entry.value)}`)
    .join(' ');
}

const historicalPath = computed(() => buildPath(historicalPoints.value, pyNetWorth));
const projectedPath = computed(() => buildPath(projectedPoints.value, pyNetWorth));
const historicalProductivePath = computed(() =>
  buildPath(historicalProductiveSeries.value, pyCapital),
);
const historicalSecurityPath = computed(() => buildPath(historicalSecuritySeries.value, pyCapital));
const projectedProductivePath = computed(() =>
  buildPath(projectedProductiveSeries.value, pyCapital),
);
const projectedSecurityPath = computed(() => buildPath(projectedSecuritySeries.value, pyCapital));
const targetPath = computed(() => buildPath(targetSeries.value, pyCapital));

const yTicks = computed(() =>
  scaleTicks(netWorthScale.value).map((value) => ({ value, y: pyNetWorth(value) })),
);
const capitalTicks = computed(() =>
  scaleTicks(capitalScale.value).map((value) => ({ value, y: pyCapital(value) })),
);

const xTicks = computed(() => {
  const { min, max } = timeBounds.value;
  const firstYear = new Date(min).getFullYear();
  const lastYear = new Date(max).getFullYear();
  const ticks: Array<{ x: number; year: number; ages: string }> = [];
  for (let year = Math.ceil(firstYear / 5) * 5; year <= lastYear; year += 5) {
    const t = Date.parse(`${year}-01-01`);
    if (t < min || t > max) continue;
    const ages = props.members
      .map((member) => ageInYear(member.birth_date, year))
      .filter((age): age is number => age != null);
    ticks.push({ x: tx(t), year, ages: ages.length ? `${ages.join('/')} años` : '' });
  }
  return ticks;
});

type YearMarker = {
  x: number;
  labelX: number;
  label: string;
  kind: 'target' | 'projected';
  anchorClass: '' | 'anchor-start' | 'anchor-end';
};

const yearMarkers = computed<YearMarker[]>(() => {
  const markers: YearMarker[] = [];
  const { min, max } = timeBounds.value;
  // Objetivo = aspiración del usuario; Sostenible = jubilación más temprana viable.
  const desiredYear = props.desiredYear ?? props.projection.summary.target_year.value;
  const sustainableYear = props.sustainableYear ?? props.projection.summary.projected_year.value;
  if (desiredYear != null) {
    const desiredT = Date.parse(`${desiredYear}-12-31`);
    if (desiredT >= min && desiredT <= max) {
      markers.push({
        x: tx(desiredT),
        labelX: tx(desiredT),
        label: `Objetivo ${desiredYear}`,
        kind: 'target',
        anchorClass: '',
      });
    }
  }
  if (sustainableYear != null) {
    const sustainableT = Date.parse(`${sustainableYear}-12-31`);
    if (sustainableT >= min && sustainableT <= max) {
      markers.push({
        x: tx(sustainableT),
        labelX: tx(sustainableT),
        label: `Sostenible ${sustainableYear}`,
        kind: 'projected',
        anchorClass: '',
      });
    }
  }
  // Objetivo y Sostenible pueden caer muy juntos (p. ej. 2039 vs 2042): sus
  // etiquetas se solapan. Cuando están cerca, se anclan en direcciones opuestas
  // (la de menor x hacia la izquierda, la de mayor x hacia la derecha) para separarlas.
  const [first, second] = markers;
  if (first && second && Math.abs(first.x - second.x) < 120) {
    const left = first.x <= second.x ? first : second;
    const right = left === first ? second : first;
    left.anchorClass = 'anchor-end';
    left.labelX = left.x - 5;
    right.anchorClass = 'anchor-start';
    right.labelX = right.x + 5;
  }
  return markers;
});

type EventMarker = {
  id: number;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchorClass: 'anchor-start' | 'anchor-end';
  label: string;
  dateLabel: string;
  detail: string;
  status: PlanTimelineMarker['status'];
};

function netWorthAt(t: number): number {
  const series = points.value;
  if (!series.length) return 0;
  if (t <= series[0]!.t) return series[0]!.value;
  for (let index = 1; index < series.length; index += 1) {
    const current = series[index]!;
    const previous = series[index - 1]!;
    if (t <= current.t) {
      const span = current.t - previous.t;
      if (span <= 0) return current.value;
      const progress = (t - previous.t) / span;
      return previous.value + (current.value - previous.value) * progress;
    }
  }
  return series[series.length - 1]!.value;
}

// Acontecimientos incorporados al plan como anotaciones sobre el eje temporal,
// recortados al rango visible; no son una serie más.
const eventMarkers = computed<EventMarker[]>(() => {
  const { min, max } = timeBounds.value;
  const laneEnds = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
  return props.events
    .map((marker) => ({ marker, t: Date.parse(marker.date) }))
    .filter((entry) => Number.isFinite(entry.t) && entry.t >= min && entry.t <= max)
    .sort((a, b) => a.t - b.t)
    .map(({ marker, t }, index) => {
      const x = tx(t);
      let lane = laneEnds.findIndex((lastX) => x - lastX >= 145);
      if (lane < 0) lane = index % laneEnds.length;
      laneEnds[lane] = x;
      const anchorAtEnd = x > W - padR - 150;
      return {
        id: marker.id,
        x,
        y: pyNetWorth(netWorthAt(t)),
        labelX: x + (anchorAtEnd ? -7 : 7),
        labelY: padT + 16 + lane * 18,
        anchorClass: anchorAtEnd ? ('anchor-end' as const) : ('anchor-start' as const),
        label: marker.label,
        dateLabel: formatShortMonthYear(marker.date),
        detail: marker.detail,
        status: marker.status,
      };
    });
});

const hoverPoint = computed(() =>
  hoverIndex.value == null ? null : (points.value[hoverIndex.value] ?? null),
);

const hoverDetail = computed(() => {
  const point = hoverPoint.value;
  if (!point) return null;
  if (point.kind === 'historical' && point.date) {
    const row = props.timeline?.rows.find((entry) => entry.date === point.date);
    if (!row) return null;
    const categories = row.assets_by_category ?? {};
    return {
      totalAssets: Number(row.total_assets),
      liquidity: Number(categories.cash ?? 0),
      productive: Number(categories.investments ?? 0),
      realEstate: Number(categories.real_estate ?? 0),
      furnishings: Number(categories.furnishings ?? 0) + Number(categories.vehicle ?? 0),
      otherAssets: Number(categories.other ?? 0),
      liabilities: Number(row.total_liabilities),
      security: Number(categories.cash ?? 0),
      securityTarget: null,
      target: null,
      financingGap: 0,
    };
  }
  if (point.kind !== 'projected' || point.year == null) return null;
  const row = props.projection.trajectory.find((entry) => entry.year === point.year);
  if (!row) return null;
  return {
    totalAssets: Number(row.total_assets),
    liquidity: Number(row.liquidity_assets),
    productive: Number(row.productive_capital),
    realEstate: Number(row.real_estate_assets),
    furnishings: Number(row.furnishings_assets),
    otherAssets: Number(row.other_assets),
    liabilities: Number(row.liabilities),
    security: Number(row.security_capital),
    securityTarget: Number(row.security_target),
    target: Number(row.target_capital),
    financingGap: Number(row.financing_gap),
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
  <section class="sect plan-trajectory" aria-label="Trayectoria patrimonial">
    <div class="sect-head">
      <!-- El rótulo basta: la leyenda ya dice qué es cada serie y el matiz de la
           fecha vive en la ⓘ, no ocupando dos líneas de cabecera. -->
      <p class="plan-block-eyebrow plan-trajectory-label">
        Trayectoria patrimonial
        <AInfoHint
          label="La fecha llega cuando el capital productivo alcanza el capital objetivo, no cuando lo hace el patrimonio total."
        />
      </p>
      <div class="plan-chart-legend" aria-hidden="true">
        <span><i class="hist"></i> Histórico</span>
        <span><i class="proj"></i> Proyección</span>
        <span><i class="prod"></i> Capital productivo</span>
        <span><i class="security"></i> Fondo de emergencia</span>
        <span><i class="target"></i> Capital objetivo</span>
        <span v-if="eventMarkers.length"><i class="event"></i> Decisión</span>
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
        aria-label="Trayectoria patrimonial, capital productivo y fondo de emergencia frente al capital objetivo"
        @mousemove="onMove"
        @mouseleave="hoverIndex = null"
      >
        <g class="plan-chart-grid">
          <line
            v-for="tick in xTicks"
            :key="`x-grid-${tick.year}`"
            class="plan-chart-x-grid"
            :x1="tick.x"
            :x2="tick.x"
            :y1="padT"
            :y2="H - padB"
          />
          <line
            v-for="tick in yTicks"
            :key="tick.value"
            class="plan-chart-y-grid"
            :x1="padL"
            :x2="W - padR"
            :y1="tick.y"
            :y2="tick.y"
          />
          <text v-for="tick in yTicks" :key="`label-${tick.value}`" :x="8" :y="tick.y + 4">
            {{ formatAxisTick(tick.value) }}
          </text>
          <text
            v-for="tick in capitalTicks"
            :key="`capital-label-${tick.value}`"
            class="plan-chart-capital-label"
            :x="W - 8"
            :y="tick.y + 4"
          >
            {{ formatAxisTick(tick.value) }}
          </text>
          <text
            v-for="tick in xTicks"
            :key="`x-${tick.year}`"
            class="plan-chart-x-label"
            :x="tick.x"
            :y="H - 20"
          >
            <tspan class="plan-chart-x-year">{{ tick.year }}</tspan>
            <tspan v-if="tick.ages" class="plan-chart-x-age" :x="tick.x" dy="13">
              {{ tick.ages }}
            </tspan>
          </text>
        </g>
        <g class="plan-chart-axis-titles" aria-hidden="true">
          <text x="8" y="14">Patrimonio</text>
          <text class="capital" :x="W - 8" y="14">Capital</text>
        </g>
        <g v-for="marker in yearMarkers" :key="marker.label" class="plan-chart-marker">
          <line :x1="marker.x" :x2="marker.x" :y1="padT" :y2="H - padB" :class="marker.kind" />
          <text :x="marker.labelX" :y="padT - 8" :class="[marker.kind, marker.anchorClass]">
            {{ marker.label }}
          </text>
        </g>
        <path v-if="targetPath" class="plan-chart-line target" :d="targetPath" />
        <path
          v-if="historicalProductivePath"
          class="plan-chart-line prod historical-segment"
          :d="historicalProductivePath"
        />
        <path
          v-if="historicalSecurityPath"
          class="plan-chart-line security historical-segment"
          :d="historicalSecurityPath"
        />
        <path
          v-if="projectedProductivePath"
          class="plan-chart-line prod projected-segment"
          :d="projectedProductivePath"
        />
        <path
          v-if="projectedSecurityPath"
          class="plan-chart-line security projected-segment"
          :d="projectedSecurityPath"
        />
        <path v-if="historicalPath" class="plan-chart-line hist" :d="historicalPath" />
        <path v-if="projectedPath" class="plan-chart-line proj" :d="projectedPath" />
        <g
          v-for="marker in eventMarkers"
          :key="`event-${marker.id}`"
          class="plan-chart-event"
          role="img"
          tabindex="0"
          :aria-label="`${marker.label}, ${marker.dateLabel}. ${marker.detail}`"
        >
          <title>{{ marker.label }} · {{ marker.dateLabel }} · {{ marker.detail }}</title>
          <line :x1="marker.x" :x2="marker.x" :y1="padT" :y2="H - padB" />
          <circle :cx="marker.x" :cy="marker.y" r="5" />
          <text :x="marker.labelX" :y="marker.labelY" :class="marker.anchorClass">
            {{ marker.label }} · {{ marker.dateLabel }}
          </text>
        </g>
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
            :cy="pyNetWorth(hoverPoint.value)"
            r="5"
          />
        </g>
      </svg>
      <div v-if="hoverPoint" class="plan-chart-tooltip">
        <strong>{{ hoverPoint.label }}</strong>
        <span>{{ formatMoney(hoverPoint.value) }}</span>
        <template v-if="hoverDetail">
          <span>Activos {{ formatMoney(hoverDetail.totalAssets) }}</span>
          <span>Liquidez {{ formatMoney(hoverDetail.liquidity) }}</span>
          <span>Productivo {{ formatMoney(hoverDetail.productive) }}</span>
          <span>Inmuebles {{ formatMoney(hoverDetail.realEstate) }}</span>
          <span>Mobiliario y vehículos {{ formatMoney(hoverDetail.furnishings) }}</span>
          <span v-if="hoverDetail.otherAssets"
            >Otros {{ formatMoney(hoverDetail.otherAssets) }}</span
          >
          <span>Deudas {{ formatMoney(hoverDetail.liabilities) }}</span>
          <span>Fondo de emergencia {{ formatMoney(hoverDetail.security) }}</span>
          <span v-if="hoverDetail.securityTarget != null"
            >Objetivo del fondo {{ formatMoney(hoverDetail.securityTarget) }}</span
          >
          <span v-if="hoverDetail.target != null"
            >Objetivo {{ formatMoney(hoverDetail.target) }}</span
          >
          <span v-if="hoverDetail.financingGap < 0">
            Financiación pendiente {{ formatMoney(hoverDetail.financingGap) }}
          </span>
        </template>
        <em>{{ hoverPoint.kind === 'historical' ? 'Histórico' : 'Proyección' }}</em>
      </div>
    </div>
    <details v-if="projection.trajectory.length" class="plan-chart-table">
      <summary>Ver los datos en una tabla</summary>
      <div class="plan-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Año</th>
              <th scope="col">Activos</th>
              <th scope="col">Liquidez</th>
              <th scope="col">Inmuebles</th>
              <th scope="col">Capital productivo</th>
              <th scope="col">Mobiliario y vehículos</th>
              <th scope="col">Otros activos</th>
              <th scope="col">Deudas</th>
              <th scope="col">Financiación pendiente</th>
              <th scope="col">Patrimonio neto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in projection.trajectory" :key="row.year">
              <th scope="row">{{ row.year }}</th>
              <td>{{ formatMoney(row.total_assets) }}</td>
              <td>{{ formatMoney(row.liquidity_assets) }}</td>
              <td>{{ formatMoney(row.real_estate_assets) }}</td>
              <td>{{ formatMoney(row.investment_assets) }}</td>
              <td>{{ formatMoney(row.furnishings_assets) }}</td>
              <td>{{ formatMoney(row.other_assets) }}</td>
              <td>{{ formatMoney(row.liabilities) }}</td>
              <td>{{ formatMoney(row.financing_gap) }}</td>
              <td>{{ formatMoney(row.net_worth) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>
