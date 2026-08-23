<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AInfoHint, AState } from '@/domains/ui';
import { formatPct } from '@/lib/format';
import { formatShortMonthYear } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PortfolioBenchmark, PortfolioRisk, RiskMetric } from '../types';

const props = defineProps<{
  ownershipId: number | null;
  dateFrom: string;
  dateTo: string;
}>();

const benchmark = ref<PortfolioBenchmark | null>(null);
const risk = ref<PortfolioRisk | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

async function load(): Promise<void> {
  if (!props.ownershipId) return;
  loading.value = true;
  error.value = null;
  try {
    const params = { date_from: props.dateFrom, date_to: props.dateTo };
    const [comparison, metrics] = await Promise.all([
      corePortfolioApi.getBenchmark(props.ownershipId, params),
      corePortfolioApi.getRisk(props.ownershipId, params),
    ]);
    benchmark.value = comparison.data;
    risk.value = metrics.data;
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.ownershipId, props.dateFrom, props.dateTo],
  () => void load(),
  { immediate: true },
);

function pct(value: string | null | undefined): string {
  return value == null ? '—' : formatPct(Number(value), 2);
}

// Por qué no hay comparación, dicho con lo que de verdad pasó. "Datos insuficientes" no
// le dice a nadie qué hacer; "tu política es más nueva que el periodo" sí.
const benchmarkGap = computed(() => {
  const rows = benchmark.value;
  if (!rows || rows.status === 'ok') return null;
  if (rows.reason === 'not_enough_full_months') {
    return 'El periodo elegido no llega a dos cierres de mes completos, así que todavía no hay serie mensual que comparar.';
  }
  const points = rows.points ?? [];
  const withoutStrategy = points.filter((row) => row.reason === 'no_strategy').length;
  if (withoutStrategy === points.length && points.length > 0) {
    return 'Tu política es más reciente que este periodo, así que no hay nada escrito contra lo que medir estos meses. La comparación aparecerá en cuanto se cierre el primer mes completo bajo ella.';
  }
  const missing = points.filter((row) => row.reason === 'class_return_unavailable').length;
  if (missing > 0) {
    return `Faltan valoraciones en ${missing} ${missing === 1 ? 'mes' : 'meses'} del periodo. Repartir el peso de una clase sin dato entre las demás daría una cifra continua sobre datos que no existen.`;
  }
  return 'No hay cobertura suficiente para comparar este periodo con tu política.';
});

const excessIsPositive = computed(() => Number(benchmark.value?.excess_return ?? 0) >= 0);

type BenchmarkLine = 'portfolio' | 'benchmark';
type BenchmarkChartPoint = { period: string; value: number | null };

const chartWidth = 720;
const chartHeight = 240;
const chartPad = { top: 20, right: 18, bottom: 34, left: 48 };
const chartInnerWidth = chartWidth - chartPad.left - chartPad.right;
const chartInnerHeight = chartHeight - chartPad.top - chartPad.bottom;

function cumulativeSeries(line: BenchmarkLine): BenchmarkChartPoint[] {
  let cumulative = 0;
  let open = false;
  return (benchmark.value?.points ?? []).map((point) => {
    const raw = line === 'portfolio' ? point.portfolio : point.benchmark;
    if (raw === null) {
      open = false;
      return { period: point.period, value: null };
    }
    if (!open) cumulative = 0;
    cumulative = (1 + cumulative) * (1 + Number(raw)) - 1;
    open = true;
    return { period: point.period, value: cumulative };
  });
}

// El exceso no es una tercera rentabilidad que se pueda encadenar sumando los diferenciales
// de cada mes. Es, en cada cierre, la distancia exacta entre las dos curvas compuestas.
function excessSeries(
  portfolio: BenchmarkChartPoint[],
  benchmark: BenchmarkChartPoint[],
): BenchmarkChartPoint[] {
  return portfolio.map((point, index) => ({
    period: point.period,
    value:
      point.value !== null && benchmark[index]?.value !== null
        ? point.value - benchmark[index].value
        : null,
  }));
}

const chartSeries = computed(() => {
  const portfolio = cumulativeSeries('portfolio');
  const policy = cumulativeSeries('benchmark');
  return { portfolio, benchmark: policy, excess: excessSeries(portfolio, policy) };
});

const comparisonRead = computed(() => {
  const excess = benchmark.value?.excess_return;
  if (excess == null) return null;
  const direction = Number(excess) >= 0 ? 'supera' : 'queda por debajo de';
  return `Tu ejecución ${direction} la política en ${pct(String(Math.abs(Number(excess))))} puntos porcentuales acumulados.`;
});

const chartBounds = computed(() => {
  const values = Object.values(chartSeries.value)
    .flat()
    .map((point) => point.value)
    .filter((value): value is number => value !== null);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const padding = Math.max((max - min) * 0.12, 0.01);
  return { min: min - padding, max: max + padding };
});

function chartX(index: number): number {
  const count = benchmark.value?.points.length ?? 0;
  return (
    chartPad.left + (count <= 1 ? chartInnerWidth / 2 : (index / (count - 1)) * chartInnerWidth)
  );
}

function chartY(value: number): number {
  const span = chartBounds.value.max - chartBounds.value.min || 1;
  return chartPad.top + (1 - (value - chartBounds.value.min) / span) * chartInnerHeight;
}

function chartPath(points: BenchmarkChartPoint[]): string {
  let path = '';
  points.forEach((point, index) => {
    if (point.value === null) return;
    path += `${path && points[index - 1]?.value !== null ? 'L' : 'M'} ${chartX(index)} ${chartY(point.value)} `;
  });
  return path.trim();
}

const chartLabels = computed(() => {
  const points = benchmark.value?.points ?? [];
  const stride = Math.max(1, Math.ceil(points.length / 6));
  return points.map((point, index) => ({
    ...point,
    show: index === points.length - 1 || index % stride === 0,
  }));
});

const benchmarkCoverageNote = computed(() => {
  const data = benchmark.value;
  if (!data || !data.points.length) return null;
  const missing = data.points.filter((point) => point.benchmark === null).length;
  if (!missing)
    return 'Cada punto es el acumulado desde el inicio del tramo, usando cierres mensuales completos.';
  return `${missing} ${missing === 1 ? 'mes' : 'meses'} sin benchmark: el gráfico deja un hueco y no encadena ese salto.`;
});

type MetricRow = { key: string; label: string; hint: string; metric: RiskMetric | undefined };

const rows = computed<MetricRow[]>(() => {
  const data = risk.value;
  return [
    {
      key: 'annualized_return',
      label: 'Rentabilidad anual del tramo medido',
      hint: 'La tasa compuesta de los meses completos medidos. No incluye los días parciales al principio y al final del periodo, por lo que puede no coincidir exactamente con la anualizada del Resumen. No es lo que rendirá el próximo.',
      metric: data?.annualized_return,
    },
    {
      key: 'volatility',
      label: 'Cuánto se mueve',
      hint: 'Volatilidad anual: cuánto se separan los meses de su media. Más alta no significa peor; significa que el camino tiene más baches.',
      metric: data?.volatility,
    },
    {
      key: 'max_drawdown',
      label: 'La peor caída',
      hint: 'Lo que llegó a perder desde un máximo hasta el fondo posterior, medido sobre la rentabilidad y no sobre el valor: así una aportación no se cuenta como recuperación.',
      metric: data?.max_drawdown,
    },
    {
      key: 'best_period',
      label: 'Mejor mes',
      hint: 'El mes que más rindió dentro del periodo.',
      metric: data?.best_period,
    },
    {
      key: 'worst_period',
      label: 'Peor mes',
      hint: 'El mes que peor rindió dentro del periodo.',
      metric: data?.worst_period,
    },
    {
      key: 'sharpe',
      label: 'Rentabilidad por unidad de riesgo',
      hint: `Sharpe: cuánto excedes al activo sin riesgo (${pct(data?.risk_free_rate)} anual) por cada punto de volatilidad. Por encima de 1 se considera bueno; por debajo de 0, no compensa el riesgo asumido.`,
      metric: data?.sharpe,
    },
  ];
});

// Un motivo por métrica, no un "no disponible" mudo: uno se arregla esperando y el otro
// rellenando una valoración, y son cosas distintas.
function unavailableText(metric: RiskMetric | undefined): string {
  if (!metric) return 'Sin datos';
  if (metric.reason === 'not_enough_observations') {
    return `Faltan meses (${metric.observations ?? 0} de ${metric.required ?? 12})`;
  }
  if (metric.reason === 'gaps_in_series') return 'La serie tiene huecos';
  if (metric.reason === 'no_variation') return 'Sin variación que medir';
  if (metric.reason === 'non_positive_growth') return 'No aplica con esta trayectoria';
  if (metric.reason === 'no_strategy') return 'Aún no hay política escrita';
  return 'Sin cobertura suficiente';
}

const coverageNote = computed(() => {
  const coverage = risk.value?.coverage;
  if (!coverage || coverage.months_used === 0) return null;
  const window = `${coverage.window.from} → ${coverage.window.to}`;
  if (coverage.months_used === coverage.months_in_period) {
    return `Medido sobre los ${coverage.months_used} meses completos del periodo (${window}). El Resumen incluye los extremos exactos del periodo, así que ambas anualizadas pueden diferir ligeramente.`;
  }
  return `Medido sobre ${coverage.months_used} de ${coverage.months_in_period} meses (${window}). Sin datos en ${coverage.months_without_data.join(', ')}. El Resumen incluye los extremos exactos del periodo, así que ambas anualizadas pueden diferir ligeramente.`;
});
</script>

<template>
  <div class="a-pf-baskets">
    <AState v-if="loading" status="loading" layout="inline">Calculando…</AState>
    <AState v-else-if="error" status="error" layout="inline">{{ error }}</AState>

    <template v-else>
      <!-- La comparación principal no es contra un índice: es contra lo que tú escribiste
           que ibas a hacer. Responde a "desviarme del plan, ¿ayudó?", que es lo accionable. -->
      <AState v-if="benchmarkGap" status="empty" layout="panel">{{ benchmarkGap }}</AState>
      <div v-else-if="benchmark" class="a-pf-quality-grid">
        <div>
          <span>Tu cartera · acumulada</span
          ><strong class="mono">{{ pct(benchmark.portfolio_return) }}</strong>
          <small v-if="risk?.annualized_return.status === 'available'">
            {{ pct(risk.annualized_return.value) }} anualizada
          </small>
        </div>
        <div>
          <span>
            Tu política · acumulada
            <AInfoHint>
              Lo que habrían rendido los pesos objetivo que tenías escritos cada mes, con el
              comportamiento real de tus propias clases. Mide si desviarte del plan ayudó, no si
              elegiste buenos productos.
            </AInfoHint>
          </span>
          <strong class="mono">{{ pct(benchmark.benchmark_return) }}</strong>
          <small v-if="benchmark.benchmark_annualized_return?.status === 'available'">
            {{ pct(benchmark.benchmark_annualized_return.value) }} anualizada
          </small>
        </div>
        <div>
          <span>Exceso frente a tu política</span>
          <strong class="mono" :class="excessIsPositive ? 'pos' : 'neg'">
            {{ pct(benchmark.excess_return) }}
          </strong>
          <small>puntos porcentuales acumulados</small>
        </div>
      </div>

      <section v-if="benchmark?.points?.length" class="a-pf-benchmark-history">
        <header class="a-pf-benchmark-history-head">
          <div>
            <h3>Cartera frente a tu política</h3>
            <p>
              Rentabilidad acumulada desde el inicio del periodo, sobre cierres mensuales completos.
            </p>
          </div>
          <AInfoHint>
            La cartera y la política se encadenan multiplicando cada mes. La diferencia es el exceso
            acumulado, no la resta de dos valores monetarios.
          </AInfoHint>
        </header>
        <p
          v-if="comparisonRead"
          class="a-pf-benchmark-read"
          :class="excessIsPositive ? 'pos' : 'neg'"
        >
          {{ comparisonRead }}
        </p>
        <div class="a-pf-benchmark-legend" aria-label="Series del gráfico">
          <span><i class="is-portfolio"></i> Cartera</span>
          <span><i class="is-policy"></i> Política</span>
          <span><i class="is-excess"></i> Exceso en puntos porcentuales</span>
        </div>
        <div class="a-pf-benchmark-chart-wrap">
          <svg
            class="a-pf-benchmark-chart"
            :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
            role="img"
            aria-label="Rentabilidad acumulada de la cartera frente a la política de inversión"
          >
            <g class="a-pf-benchmark-grid">
              <line
                :x1="chartPad.left"
                :x2="chartWidth - chartPad.right"
                :y1="chartY(0)"
                :y2="chartY(0)"
                class="is-zero"
              />
              <text :x="chartPad.left - 8" :y="chartY(0) + 4" text-anchor="end">0 %</text>
            </g>
            <path class="is-portfolio" :d="chartPath(chartSeries.portfolio)" />
            <path class="is-policy" :d="chartPath(chartSeries.benchmark)" />
            <path class="is-excess" :d="chartPath(chartSeries.excess)" />
            <g class="a-pf-benchmark-axis">
              <template v-for="(point, index) in chartLabels" :key="point.period">
                <text
                  v-if="point.show"
                  :x="chartX(index)"
                  :y="chartHeight - 8"
                  text-anchor="middle"
                >
                  {{ formatShortMonthYear(`${point.period}-01`) }}
                </text>
              </template>
            </g>
          </svg>
        </div>
        <p class="a-pf-basket-note">{{ benchmarkCoverageNote }}</p>
        <div class="a-pf-benchmark-table-wrap">
          <table class="data-table a-pf-benchmark-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th class="num">Cartera</th>
                <th class="num">Política</th>
                <th class="num">Exceso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="point in benchmark.points" :key="point.period">
                <th scope="row">{{ formatShortMonthYear(`${point.period}-01`) }}</th>
                <td class="num mono">{{ pct(point.portfolio) }}</td>
                <td class="num mono">{{ pct(point.benchmark) }}</td>
                <td class="num mono">
                  {{
                    point.portfolio !== null && point.benchmark !== null
                      ? pct(String(Number(point.portfolio) - Number(point.benchmark)))
                      : '—'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <p v-if="benchmark?.cash_excluded" class="a-pf-basket-note">
        La liquidez queda fuera de los dos lados: tu serie son las posiciones, y el efectivo de
        contenedor no pertenece a ninguna clase.
      </p>
      <p v-if="benchmark?.unreachable_classes?.length" class="a-pf-basket-note">
        Sin producto para {{ benchmark.unreachable_classes.join(', ') }}: su peso se reparte entre
        las clases que sí existen.
      </p>
      <p v-if="benchmark?.secondary?.status === 'available'" class="a-pf-basket-note">
        Índice de referencia ({{ benchmark.secondary.instrument?.name }}):
        {{ pct(benchmark.secondary.cumulative_return) }} en el mismo calendario.
      </p>

      <table v-if="risk" class="data-table a-pf-risk-table">
        <tbody>
          <tr v-for="row in rows" :key="row.key">
            <th scope="row">
              {{ row.label }}
              <AInfoHint>{{ row.hint }}</AInfoHint>
            </th>
            <td class="mono">
              <template v-if="row.metric?.status === 'available'">
                {{ pct(row.metric.value) }}
                <small v-if="row.metric.period">· {{ row.metric.period }}</small>
                <small v-else-if="row.metric.trough_period">
                  · fondo en {{ row.metric.trough_period }}
                </small>
              </template>
              <!-- Nunca un cero donde no hay dato: un cero es una medición. -->
              <em v-else class="muted">{{ unavailableText(row.metric) }}</em>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="coverageNote" class="a-pf-basket-note">{{ coverageNote }}</p>
    </template>
  </div>
</template>
