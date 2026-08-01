<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, useId } from 'vue';
import { AButton, AInfoHint } from '@/domains/ui';
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

// El gráfico se dibujaba siempre en un lienzo de 960 unidades. En móvil eso
// obligaba a scroll horizontal (nunca se veía la previsión entera) y encogía las
// etiquetas a ~0.4x, por debajo de lo legible. En estrecho el viewBox pasa a
// igualar el ancho real del contenedor: 1 unidad SVG = 1 px CSS, así que la
// tipografía se lee a su tamaño nominal y la serie cabe completa.
const COMPACT_MAX_WIDTH = 560;
const MIN_COMPACT_WIDTH = 260;
const chartWrap = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const compact = computed(
  () => containerWidth.value > 0 && containerWidth.value < COMPACT_MAX_WIDTH,
);

const W = computed(() =>
  compact.value ? Math.max(MIN_COMPACT_WIDTH, Math.round(containerWidth.value)) : 960,
);
const H = 300;
const padL = computed(() => (compact.value ? 40 : 72));
const padR = computed(() => (compact.value ? 40 : 72));
// En compacto los hitos ocupan dos filas de etiqueta sobre el área de trazado.
const padT = computed(() => (compact.value ? 46 : 34));
const padB = computed(() => (compact.value ? 42 : 38));
const hoverIndex = ref<number | null>(null);

let resizeObserver: ResizeObserver | null = null;

function measure(el: HTMLElement): void {
  const next = Math.round(el.clientWidth);
  if (next !== containerWidth.value) containerWidth.value = next;
}

watch(
  chartWrap,
  (el) => {
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (!el) return;
    measure(el);
    if (typeof ResizeObserver === 'undefined') return;
    resizeObserver = new ResizeObserver(() => measure(el));
    resizeObserver.observe(el);
  },
  { flush: 'post' },
);

// La geometría cambia bajo el puntero: un tooltip heredado apuntaría a otro punto.
watch(compact, () => {
  hoverIndex.value = null;
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});
const chartId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const historicalAreaGradientId = `plan-history-area-${chartId}`;
const projectedAreaGradientId = `plan-projection-area-${chartId}`;

type Point = {
  t: number;
  date?: string;
  label: string;
  value: number;
  kind: 'historical' | 'projected';
  year?: number;
};

type RangeOption = { value: number | null; label: string };

const historicalRangeOptions: RangeOption[] = [
  { value: 1, label: '1a' },
  { value: 3, label: '3a' },
  { value: 5, label: '5a' },
  { value: 10, label: '10a' },
  { value: null, label: 'Todo' },
];
const projectionRangeOptions: RangeOption[] = [
  { value: 5, label: '5a' },
  { value: 10, label: '10a' },
  { value: 15, label: '15a' },
  { value: 20, label: '20a' },
  { value: null, label: 'Todo' },
];
const historicalRangeYears = ref<number | null>(null);
const projectionRangeYears = ref<number | null>(null);

const visibleHistoricalRows = computed(() => {
  const rows = props.timeline?.rows ?? [];
  const years = historicalRangeYears.value;
  const lastRow = rows.at(-1);
  if (years == null || !lastRow) return rows;
  const cutoff = new Date(lastRow.date);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - years);
  const cutoffTime = cutoff.getTime();
  return rows.filter((row) => Date.parse(row.date) >= cutoffTime);
});

const historicalPoints = computed<Point[]>(() =>
  visibleHistoricalRows.value.map((row) => ({
    t: Date.parse(row.date),
    date: row.date,
    label: formatMonthYearLabel(row.date),
    value: Number(row.net_worth),
    kind: 'historical' as const,
  })),
);

// Las filas proyectadas son valores a fin de año; se descartan las que quedan
// por detrás del último cierre histórico para que el eje temporal no retroceda.
const availableProjectedRows = computed(() => {
  const history = historicalPoints.value;
  const lastHistorical = history.length ? history[history.length - 1]!.t : Number.NEGATIVE_INFINITY;
  return props.projection.trajectory
    .map((row) => ({ row, t: Date.parse(`${row.year}-12-31`) }))
    .filter((entry) => entry.t > lastHistorical);
});

const projectedRows = computed(() => {
  const years = projectionRangeYears.value;
  return years == null
    ? availableProjectedRows.value
    : availableProjectedRows.value.slice(0, years);
});
const visibleProjectionRows = computed(() => projectedRows.value.map(({ row }) => row));
const projectionTableRangeLabel = computed(() => {
  const rows = visibleProjectionRows.value;
  const first = rows[0];
  const last = rows.at(-1);
  if (!first || !last) return '';
  return `${first.year}–${last.year} · ${rows.length} ${rows.length === 1 ? 'año' : 'años'}`;
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
  visibleHistoricalRows.value.some((row) => row.assets_by_category != null),
);
const historicalProductiveSeries = computed(() =>
  hasHistoricalComposition.value
    ? visibleHistoricalRows.value.map((row) => ({
        t: Date.parse(row.date),
        value: Number(row.assets_by_category?.investments ?? 0),
      }))
    : [],
);
const historicalSecuritySeries = computed(() =>
  hasHistoricalComposition.value
    ? visibleHistoricalRows.value.map((row) => ({
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

function selectHistoricalRange(years: number | null): void {
  historicalRangeYears.value = years;
  hoverIndex.value = null;
}

function selectProjectionRange(years: number | null): void {
  projectionRangeYears.value = years;
  hoverIndex.value = null;
}

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
  return padL.value + ((t - min) / (max - min)) * (W.value - padL.value - padR.value);
}

function scaledY(value: number, bounds: { min: number; max: number }): number {
  const range = bounds.max - bounds.min || 1;
  return padT.value + (1 - (value - bounds.min) / range) * (H - padT.value - padB.value);
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

function buildAreaPath(
  series: Array<{ t: number; value: number }>,
  yScale: (value: number) => number,
): string {
  if (series.length < 2) return '';
  const first = series[0]!;
  const last = series[series.length - 1]!;
  const baseline = H - padB.value;
  return `${buildPath(series, yScale)} L ${tx(last.t)} ${baseline} L ${tx(first.t)} ${baseline} Z`;
}

const historicalPath = computed(() => buildPath(historicalPoints.value, pyNetWorth));
const projectedPath = computed(() => buildPath(projectedPoints.value, pyNetWorth));
const historicalAreaPath = computed(() => buildAreaPath(historicalPoints.value, pyNetWorth));
const projectedAreaPath = computed(() => buildAreaPath(projectedPoints.value, pyNetWorth));
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

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

// Ancho disponible por marca temporal con un paso dado: de él dependen tanto la
// cadencia de las marcas como cuánto texto cabe debajo de cada una.
function widthPerTick(step: number): number {
  const { min, max } = timeBounds.value;
  const years = (max - min) / YEAR_MS;
  const plotWidth = W.value - padL.value - padR.value;
  return years > step ? plotWidth / (years / step) : plotWidth;
}

// Una marca cada 5 años no cabe legible en móvil sobre un recorrido largo:
// el paso se dobla cuando el rango visible no da ancho suficiente por marca.
const xTickStep = computed(() => (!compact.value || widthPerTick(5) >= 62 ? 5 : 10));

const xTicks = computed(() => {
  const { min, max } = timeBounds.value;
  const step = xTickStep.value;
  // Muy justo de ancho, "30/27 años" invade la marca vecina; las edades siguen
  // siendo legibles sin la unidad, que se repite en todas las marcas.
  const withAgeUnit = !compact.value || widthPerTick(step) >= 56;
  const firstYear = new Date(min).getFullYear();
  const lastYear = new Date(max).getFullYear();
  const ticks: Array<{ x: number; year: number; ages: string }> = [];
  for (let year = Math.ceil(firstYear / step) * step; year <= lastYear; year += step) {
    // Las filas proyectadas son cierres anuales: la marca 2040 debe coincidir con
    // el cierre de 2040, no con el cierre de 2039 situado un día antes.
    const t = Date.parse(`${year}-12-31`);
    if (t < min || t > max) continue;
    const ages = props.members
      .map((member) => ageInYear(member.birth_date, year))
      .filter((age): age is number => age != null);
    const joined = ages.join('/');
    ticks.push({
      x: tx(t),
      year,
      ages: ages.length ? `${joined}${withAgeUnit ? ' años' : ''}` : '',
    });
  }
  return ticks;
});

type YearMarker = {
  x: number;
  labelX: number;
  labelY: number;
  label: string;
  kind: 'target' | 'projected';
  anchorClass: '' | 'anchor-start' | 'anchor-end';
};

const yearMarkers = computed<YearMarker[]>(() => {
  const markers: YearMarker[] = [];
  const { min, max } = timeBounds.value;
  const baseLabelY = padT.value - 8;
  // El retiro en R empieza a consumir capital durante R. La preparación se
  // consolida al cierre de R-1, último año completo de acumulación.
  const desiredYear = props.desiredYear ?? props.projection.summary.target_year.value;
  const sustainableYear = props.sustainableYear ?? props.projection.summary.projected_year.value;
  if (desiredYear != null) {
    const readinessYear = desiredYear - 1;
    const desiredT = Date.parse(`${readinessYear}-12-31`);
    if (desiredT >= min && desiredT <= max) {
      markers.push({
        x: tx(desiredT),
        labelX: tx(desiredT),
        labelY: baseLabelY,
        label: compact.value ? `Objetivo · ${readinessYear}` : `Objetivo · cierre ${readinessYear}`,
        kind: 'target',
        anchorClass: '',
      });
    }
  }
  if (sustainableYear != null) {
    const readinessYear = sustainableYear - 1;
    const sustainableT = Date.parse(`${readinessYear}-12-31`);
    if (sustainableT >= min && sustainableT <= max) {
      markers.push({
        x: tx(sustainableT),
        labelX: tx(sustainableT),
        labelY: baseLabelY,
        label: compact.value
          ? `Sostenible · ${readinessYear}`
          : `Sostenible · cierre ${readinessYear}`,
        kind: 'projected',
        anchorClass: '',
      });
    }
  }
  // En estrecho no hay ancho que repartir entre dos etiquetas: cada hito ocupa su
  // propia fila y el texto crece siempre hacia el interior del área de trazado.
  if (compact.value) {
    const pivot = padL.value + (W.value - padL.value - padR.value) * 0.55;
    markers.forEach((marker, index) => {
      const towardsLeft = marker.x > pivot;
      marker.anchorClass = towardsLeft ? 'anchor-end' : 'anchor-start';
      marker.labelX = marker.x + (towardsLeft ? -5 : 5);
      marker.labelY = baseLabelY - (markers.length - 1 - index) * 13;
    });
    return markers;
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
  text: string;
  dateLabel: string;
  detail: string;
  status: PlanTimelineMarker['status'];
};

function truncateLabel(label: string, max = 16): string {
  return label.length > max ? `${label.slice(0, max - 1).trimEnd()}…` : label;
}

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
  // Los umbrales de carril y de borde son proporciones del lienzo, no píxeles
  // fijos: con el viewBox estrecho un valor de 145 abarcaría medio gráfico.
  const laneGap = W.value * 0.15;
  const endThreshold = W.value * 0.16;
  const laneStep = compact.value ? 15 : 18;
  return props.events
    .map((marker) => ({ marker, t: Date.parse(marker.date) }))
    .filter((entry) => Number.isFinite(entry.t) && entry.t >= min && entry.t <= max)
    .sort((a, b) => a.t - b.t)
    .map(({ marker, t }, index) => {
      const x = tx(t);
      let lane = laneEnds.findIndex((lastX) => x - lastX >= laneGap);
      if (lane < 0) lane = index % laneEnds.length;
      laneEnds[lane] = x;
      const anchorAtEnd = x > W.value - padR.value - endThreshold;
      const dateLabel = formatShortMonthYear(marker.date);
      return {
        id: marker.id,
        x,
        y: pyNetWorth(netWorthAt(t)),
        labelX: x + (anchorAtEnd ? -7 : 7),
        labelY: padT.value + 16 + lane * laneStep,
        anchorClass: anchorAtEnd ? ('anchor-end' as const) : ('anchor-start' as const),
        label: marker.label,
        // La fecha va en el tooltip nativo y en el aria-label: en estrecho la
        // etiqueta sola ya ocupa buena parte del ancho útil.
        text: compact.value ? truncateLabel(marker.label) : `${marker.label} · ${dateLabel}`,
        dateLabel,
        detail: marker.detail,
        status: marker.status,
      };
    });
});

const hoverPoint = computed(() =>
  hoverIndex.value == null ? null : (points.value[hoverIndex.value] ?? null),
);
const tooltipOnLeft = computed(() => {
  const point = hoverPoint.value;
  return point ? tx(point.t) > W.value * 0.62 : false;
});

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
  const x = ((event.clientX - rect.left) / rect.width) * W.value;
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
          label="Los hitos se muestran al cierre del último año de trabajo. El retiro y las retiradas empiezan el año siguiente."
        />
      </p>
      <div class="plan-chart-legend" aria-label="Leyenda de la trayectoria patrimonial">
        <div class="plan-chart-legend-group" aria-label="Series">
          <span class="plan-chart-legend-title">Series</span>
          <span class="plan-chart-legend-item"><i class="networth"></i> Patrimonio</span>
          <span class="plan-chart-legend-item"><i class="prod"></i> Capital productivo</span>
          <span class="plan-chart-legend-item"><i class="security"></i> Fondo de emergencia</span>
          <span class="plan-chart-legend-item"><i class="target"></i> Capital objetivo</span>
        </div>
        <div class="plan-chart-legend-group plan-chart-legend-separated" aria-label="Tipo de dato">
          <span class="plan-chart-legend-title">Tramo</span>
          <span class="plan-chart-legend-item"><i class="hist"></i> Histórico</span>
          <span class="plan-chart-legend-item"><i class="proj"></i> Proyección</span>
        </div>
        <div
          v-if="eventMarkers.length"
          class="plan-chart-legend-group plan-chart-legend-separated"
          aria-label="Hitos"
        >
          <span class="plan-chart-legend-title">Hitos</span>
          <span class="plan-chart-legend-item"><i class="event"></i> Decisión</span>
        </div>
      </div>
    </div>

    <div v-if="points.length < 2" class="plan-chart-empty">
      No hay suficientes puntos para dibujar la trayectoria.
    </div>
    <div v-else ref="chartWrap" class="plan-chart-wrap">
      <svg
        class="plan-chart"
        :class="{ 'is-compact': compact }"
        :viewBox="`0 0 ${W} ${H}`"
        role="img"
        aria-label="Trayectoria patrimonial, capital productivo y fondo de emergencia frente al capital objetivo"
        @mousemove="onMove"
        @mouseleave="hoverIndex = null"
      >
        <defs>
          <linearGradient :id="historicalAreaGradientId" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--chart-networth)" stop-opacity="0.24" />
            <stop offset="100%" stop-color="var(--chart-networth)" stop-opacity="0.02" />
          </linearGradient>
          <linearGradient :id="projectedAreaGradientId" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--chart-networth)" stop-opacity="0.13" />
            <stop offset="100%" stop-color="var(--chart-networth)" stop-opacity="0" />
          </linearGradient>
        </defs>
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
          <text
            v-for="tick in yTicks"
            :key="`label-${tick.value}`"
            class="plan-chart-networth-label"
            :x="padL - 8"
            :y="tick.y + 4"
          >
            {{ formatAxisTick(tick.value) }}
          </text>
          <text
            v-for="tick in capitalTicks"
            :key="`capital-label-${tick.value}`"
            class="plan-chart-capital-label"
            :x="W - padR + 8"
            :y="tick.y + 4"
          >
            {{ formatAxisTick(tick.value) }}
          </text>
          <text
            v-for="tick in xTicks"
            :key="`x-${tick.year}`"
            class="plan-chart-x-label"
            :x="tick.x"
            :y="H - (compact ? 24 : 20)"
          >
            <tspan class="plan-chart-x-year">{{ tick.year }}</tspan>
            <tspan v-if="tick.ages" class="plan-chart-x-age" :x="tick.x" :dy="compact ? 14 : 13">
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
          <text :x="marker.labelX" :y="marker.labelY" :class="[marker.kind, marker.anchorClass]">
            {{ marker.label }}
          </text>
        </g>
        <path
          v-if="historicalAreaPath"
          class="plan-chart-area historical"
          :d="historicalAreaPath"
          :fill="`url(#${historicalAreaGradientId})`"
        />
        <path
          v-if="projectedAreaPath"
          class="plan-chart-area projected"
          :d="projectedAreaPath"
          :fill="`url(#${projectedAreaGradientId})`"
        />
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
        <path
          v-if="historicalPath"
          class="plan-chart-line hist"
          :d="historicalPath"
          vector-effect="non-scaling-stroke"
        />
        <path
          v-if="projectedPath"
          class="plan-chart-line proj"
          :d="projectedPath"
          vector-effect="non-scaling-stroke"
        />
        <circle
          v-for="point in historicalPoints"
          :key="`historical-point-${point.date}`"
          class="plan-chart-point historical"
          :cx="tx(point.t)"
          :cy="pyNetWorth(point.value)"
          r="1.35"
          vector-effect="non-scaling-stroke"
        />
        <circle
          v-for="point in projectedPoints"
          :key="`projected-point-${point.year}`"
          class="plan-chart-point projected"
          :cx="tx(point.t)"
          :cy="pyNetWorth(point.value)"
          r="1.8"
          vector-effect="non-scaling-stroke"
        />
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
            {{ marker.text }}
          </text>
        </g>
        <g v-if="hoverPoint && hoverIndex !== null">
          <line
            class="plan-chart-hover-line"
            :x1="tx(hoverPoint.t)"
            :x2="tx(hoverPoint.t)"
            :y1="padT"
            :y2="H - padB"
            vector-effect="non-scaling-stroke"
          />
          <circle
            class="plan-chart-hover-dot"
            :cx="tx(hoverPoint.t)"
            :cy="pyNetWorth(hoverPoint.value)"
            r="5.5"
            vector-effect="non-scaling-stroke"
          />
        </g>
      </svg>
      <div v-if="hoverPoint" class="plan-chart-tooltip" :class="{ 'is-left': tooltipOnLeft }">
        <div class="plan-chart-tooltip-head">
          <div>
            <strong>{{ hoverPoint.label }}</strong>
            <em>{{ hoverPoint.kind === 'historical' ? 'Histórico' : 'Proyección' }}</em>
          </div>
          <span class="plan-chart-tooltip-value">{{ formatMoney(hoverPoint.value) }}</span>
        </div>
        <dl v-if="hoverDetail" class="plan-chart-tooltip-metrics">
          <div class="is-key">
            <dt>Activos</dt>
            <dd>{{ formatMoney(hoverDetail.totalAssets) }}</dd>
          </div>
          <div class="is-key">
            <dt>Deudas</dt>
            <dd>{{ formatMoney(hoverDetail.liabilities) }}</dd>
          </div>
          <div>
            <dt>Liquidez</dt>
            <dd>{{ formatMoney(hoverDetail.liquidity) }}</dd>
          </div>
          <div>
            <dt>Productivo</dt>
            <dd>{{ formatMoney(hoverDetail.productive) }}</dd>
          </div>
          <div>
            <dt>Inmuebles</dt>
            <dd>{{ formatMoney(hoverDetail.realEstate) }}</dd>
          </div>
          <div>
            <dt>Mobiliario y vehículos</dt>
            <dd>{{ formatMoney(hoverDetail.furnishings) }}</dd>
          </div>
          <div v-if="hoverDetail.otherAssets">
            <dt>Otros</dt>
            <dd>{{ formatMoney(hoverDetail.otherAssets) }}</dd>
          </div>
          <div>
            <dt>Fondo de emergencia</dt>
            <dd>{{ formatMoney(hoverDetail.security) }}</dd>
          </div>
          <div v-if="hoverDetail.securityTarget != null">
            <dt>Objetivo del fondo</dt>
            <dd>{{ formatMoney(hoverDetail.securityTarget) }}</dd>
          </div>
          <div v-if="hoverDetail.target != null">
            <dt>Capital objetivo</dt>
            <dd>{{ formatMoney(hoverDetail.target) }}</dd>
          </div>
          <div v-if="hoverDetail.financingGap < 0" class="is-alert">
            <dt>Financiación pendiente</dt>
            <dd>{{ formatMoney(hoverDetail.financingGap) }}</dd>
          </div>
        </dl>
      </div>
    </div>
    <div class="plan-chart-range-controls" aria-label="Rango visible de la trayectoria">
      <div class="plan-chart-range-group">
        <span>Histórico</span>
        <div class="plan-chart-range-options" aria-label="Años de histórico">
          <AButton
            v-for="option in historicalRangeOptions"
            :key="option.label"
            size="sm"
            variant="ghost"
            :class="{ on: historicalRangeYears === option.value }"
            :aria-pressed="historicalRangeYears === option.value"
            @click="selectHistoricalRange(option.value)"
          >
            {{ option.label }}
          </AButton>
        </div>
      </div>
      <div class="plan-chart-range-group">
        <span>Proyección</span>
        <div class="plan-chart-range-options" aria-label="Años de proyección">
          <AButton
            v-for="option in projectionRangeOptions"
            :key="option.label"
            size="sm"
            variant="ghost"
            :class="{ on: projectionRangeYears === option.value }"
            :aria-pressed="projectionRangeYears === option.value"
            @click="selectProjectionRange(option.value)"
          >
            {{ option.label }}
          </AButton>
        </div>
      </div>
    </div>
    <details v-if="visibleProjectionRows.length" class="plan-chart-table">
      <summary>
        <span>Datos anuales de la proyección</span>
        <small>{{ projectionTableRangeLabel }}</small>
      </summary>
      <div class="plan-table-scroll">
        <table class="plan-chart-data-table">
          <thead>
            <tr>
              <th scope="col">Año</th>
              <th scope="col" class="num">Patrimonio neto</th>
              <th scope="col" class="num">Activos</th>
              <th scope="col" class="num">Deudas</th>
              <th scope="col" class="num">Liquidez</th>
              <th scope="col" class="num">Fondo de emergencia</th>
              <th scope="col" class="num">Capital productivo</th>
              <th scope="col" class="num">Inmuebles</th>
              <th scope="col" class="num">Mobiliario y vehículos</th>
              <th scope="col" class="num">Otros activos</th>
              <th scope="col" class="num">Capital objetivo</th>
              <th scope="col" class="num">Financiación pendiente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visibleProjectionRows" :key="row.year">
              <th scope="row" class="year mono">{{ row.year }}</th>
              <td class="num mono is-key">{{ formatMoney(row.net_worth) }}</td>
              <td class="num mono">{{ formatMoney(row.total_assets) }}</td>
              <td class="num mono">{{ formatMoney(row.liabilities) }}</td>
              <td class="num mono">{{ formatMoney(row.liquidity_assets) }}</td>
              <td class="num mono is-security">{{ formatMoney(row.security_capital) }}</td>
              <td class="num mono is-productive">{{ formatMoney(row.productive_capital) }}</td>
              <td class="num mono">{{ formatMoney(row.real_estate_assets) }}</td>
              <td class="num mono">{{ formatMoney(row.furnishings_assets) }}</td>
              <td class="num mono">{{ formatMoney(row.other_assets) }}</td>
              <td class="num mono is-target">{{ formatMoney(row.target_capital) }}</td>
              <td class="num mono" :class="{ 'is-negative': Number(row.financing_gap) < 0 }">
                {{ formatMoney(row.financing_gap) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>
