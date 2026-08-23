<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, AState } from '@/domains/ui';
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
type ChartTableRow = {
  period: string;
  portfolio: string | null;
  benchmark: string | null;
  excess: string | null;
};
type ChartMode = 'cumulative' | 'rolling';
const chartMode = ref<ChartMode>('cumulative');

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

const rollingSeries = computed(() => {
  const rows = benchmark.value?.rolling?.points ?? [];
  return {
    portfolio: rows.map((row) => ({ period: row.period, value: toChartValue(row.portfolio) })),
    benchmark: rows.map((row) => ({ period: row.period, value: toChartValue(row.benchmark) })),
    excess: rows.map((row) => ({ period: row.period, value: toChartValue(row.excess) })),
  };
});

function toChartValue(value: string | null | undefined): number | null {
  return value == null ? null : Number(value);
}

const rollingAvailable = computed(() => (benchmark.value?.rolling?.points.length ?? 0) > 0);
const activeSeries = computed(() =>
  chartMode.value === 'rolling' ? rollingSeries.value : chartSeries.value,
);
const activeRows = computed<ChartTableRow[]>(() => {
  if (chartMode.value === 'rolling') return benchmark.value?.rolling?.points ?? [];
  return (benchmark.value?.points ?? []).map((row) => ({
    period: row.period,
    portfolio: row.portfolio,
    benchmark: row.benchmark,
    excess:
      row.portfolio !== null && row.benchmark !== null
        ? String(Number(row.portfolio) - Number(row.benchmark))
        : null,
  }));
});

const comparisonRead = computed(() => {
  const excess = benchmark.value?.excess_return;
  if (excess == null) return null;
  const direction = Number(excess) >= 0 ? 'supera' : 'queda por debajo de';
  return `Tu ejecución ${direction} la política en ${pct(String(Math.abs(Number(excess))))} puntos porcentuales acumulados.`;
});

const chartBounds = computed(() => {
  const values = Object.values(activeSeries.value)
    .flat()
    .map((point) => point.value)
    .filter((value): value is number => value !== null);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const padding = Math.max((max - min) * 0.12, 0.01);
  return { min: min - padding, max: max + padding };
});

function chartX(index: number): number {
  const count = activeRows.value.length;
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
  const points = activeRows.value;
  const stride = Math.max(1, Math.ceil(points.length / 6));
  return points.map((point, index) => ({
    ...point,
    show: index === points.length - 1 || index % stride === 0,
  }));
});

const benchmarkCoverageNote = computed(() => {
  const data = benchmark.value;
  if (!data || !data.points.length) return null;
  if (chartMode.value === 'rolling') {
    const windows = data.rolling.complete_windows;
    const total = data.rolling.points.length;
    return windows === total
      ? `Cada punto compara los mismos ${data.rolling.window_months} meses completos.`
      : `${windows} de ${total} ventanas de ${data.rolling.window_months} meses tienen cobertura completa.`;
  }
  const missing = data.points.filter((point) => point.benchmark === null).length;
  if (!missing)
    return 'Cada punto es el acumulado desde el inicio del tramo, usando cierres mensuales completos.';
  return `${missing} ${missing === 1 ? 'mes' : 'meses'} sin benchmark: el gráfico deja un hueco y no encadena ese salto.`;
});

type MetricRow = { key: string; label: string; hint: string; metric: RiskMetric | undefined };
type AdvancedMetricRow = {
  key: 'value_at_risk' | 'beta' | 'correlation';
  label: string;
  hint: string;
  metric: RiskMetric | undefined;
};

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

const advancedRows = computed<AdvancedMetricRow[]>(() => {
  const advanced = risk.value?.advanced;
  return [
    {
      key: 'value_at_risk',
      label: 'Pérdida mensual histórica (VaR 95%)',
      hint: 'En el peor 5% de meses observados, esta es la pérdida de referencia. Es histórica, no predice una pérdida máxima futura, y requiere dos años completos.',
      metric: advanced?.value_at_risk,
    },
    {
      key: 'beta',
      label: advanced?.beta?.against
        ? `Sensibilidad a ${advanced.beta.against.name}`
        : 'Beta frente a índice',
      hint: 'Cuánto tiende a moverse la cartera cuando lo hace el índice: 1 se mueve parecido; más de 1 amplifica los movimientos. Solo se calcula con el mismo calendario y moneda.',
      metric: advanced?.beta,
    },
    {
      key: 'correlation',
      label: advanced?.correlation?.against
        ? `Correlación con ${advanced.correlation.against.name}`
        : 'Correlación con índice',
      hint: 'Qué parte del movimiento mensual coincide con el índice, entre -1 y 1. No mide si la inversión es buena ni garantiza diversificación futura.',
      metric: advanced?.correlation,
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
  if (metric.reason === 'benchmark_unavailable') {
    return 'Elige un índice con precios mensuales en la política';
  }
  return 'Sin cobertura suficiente';
}

function advancedValue(row: AdvancedMetricRow): string {
  const metric = row.metric;
  if (metric?.status !== 'available') return unavailableText(metric);
  if (row.key === 'value_at_risk') return pct(metric.value);
  return Number(metric.value).toLocaleString('es-ES', { maximumFractionDigits: 2 });
}

const riskContribution = computed(() => risk.value?.advanced.risk_contribution);
const strongestPositionRelations = computed(() =>
  (risk.value?.advanced.position_correlation?.pairs ?? []).slice(0, 3),
);

function advancedCoverageText(metric: {
  coverage?: string;
  included_positions?: number;
  observations?: number;
}): string {
  const positions = metric.included_positions ?? 0;
  const months = metric.observations ?? 0;
  return `Modelo sobre ${positions} ${positions === 1 ? 'posición' : 'posiciones'}, ${months} meses y ${pct(metric.coverage)} del valor actual.`;
}

function positionRiskUnavailableText(metric: {
  reason?: string;
  observations?: number;
  required?: number;
}): string {
  if (metric.reason === 'not_enough_positions') return 'Hace falta más de una posición medible';
  if (metric.reason === 'not_enough_observations') {
    return `Faltan meses (${metric.observations ?? 0} de ${metric.required ?? 12})`;
  }
  if (metric.reason === 'no_variation') return 'Sin variación suficiente que repartir';
  if (metric.reason === 'no_value') return 'Sin valor de cierre para ponderar';
  return 'Sin posiciones con una serie mensual completa';
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
            <h3>
              {{
                chartMode === 'cumulative' ? 'Cartera frente a tu política' : 'Ventanas de 12 meses'
              }}
            </h3>
            <p>
              <template v-if="chartMode === 'cumulative'">
                Rentabilidad acumulada desde el inicio del periodo, sobre cierres mensuales
                completos.
              </template>
              <template v-else>
                Cada punto compara los mismos doce cierres mensuales, sin que un periodo largo pese
                más.
              </template>
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
        <div
          v-if="rollingAvailable"
          class="a-pf-benchmark-mode"
          role="group"
          aria-label="Horizonte del gráfico"
        >
          <AButton
            size="sm"
            :variant="chartMode === 'cumulative' ? 'default' : 'ghost'"
            @click="chartMode = 'cumulative'"
          >
            Desde inicio
          </AButton>
          <AButton
            size="sm"
            :variant="chartMode === 'rolling' ? 'default' : 'ghost'"
            @click="chartMode = 'rolling'"
          >
            12 meses móviles
          </AButton>
        </div>
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
            <path class="is-portfolio" :d="chartPath(activeSeries.portfolio)" />
            <path class="is-policy" :d="chartPath(activeSeries.benchmark)" />
            <path class="is-excess" :d="chartPath(activeSeries.excess)" />
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
              <tr v-for="point in activeRows" :key="point.period">
                <th scope="row">{{ formatShortMonthYear(`${point.period}-01`) }}</th>
                <td class="num mono">{{ pct(point.portfolio) }}</td>
                <td class="num mono">{{ pct(point.benchmark) }}</td>
                <td class="num mono">
                  {{ pct(point.excess) }}
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

      <section v-if="risk" class="a-pf-advanced-risk">
        <header>
          <h3>Riesgo avanzado</h3>
          <p>Solo se completa cuando la serie cumple su umbral de observaciones.</p>
        </header>
        <table class="data-table a-pf-risk-table">
          <tbody>
            <tr v-for="row in advancedRows" :key="row.key">
              <th scope="row">
                {{ row.label }}
                <AInfoHint>{{ row.hint }}</AInfoHint>
              </th>
              <td class="mono" :class="row.metric?.status === 'available' ? '' : 'muted'">
                {{ advancedValue(row) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="a-pf-risk-detail">
          <template v-if="riskContribution?.status === 'available'">
            <div class="a-pf-risk-detail-head">
              <div>
                <h4>Qué posiciones explican la volatilidad</h4>
                <p>
                  {{ advancedCoverageText(riskContribution) }} Volatilidad modelada:
                  <strong class="mono">{{ pct(riskContribution.model_volatility) }}</strong> anual.
                </p>
              </div>
              <AInfoHint>
                Reparte la volatilidad observada entre las posiciones usando sus pesos actuales y
                cómo se han movido juntas. No atribuye el P&amp;L histórico ni predice el futuro.
              </AInfoHint>
            </div>
            <ol class="a-pf-risk-contributions">
              <li v-for="position in riskContribution.by_position" :key="position.position_id">
                <span>{{ position.name }}</span>
                <strong class="mono">{{ pct(position.contribution) }}</strong>
                <small>{{ pct(position.weight) }} del valor medido</small>
              </li>
            </ol>
          </template>
          <p v-else class="a-pf-basket-note">
            Contribución al riesgo: {{ positionRiskUnavailableText(riskContribution ?? {}) }}.
          </p>

          <template v-if="risk?.advanced.position_correlation?.status === 'available'">
            <div class="a-pf-risk-detail-head">
              <div>
                <h4>Relaciones entre activos</h4>
                <p>{{ advancedCoverageText(risk.advanced.position_correlation) }}</p>
              </div>
              <AInfoHint>
                Correlación mensual entre -1 y 1. Cerca de 1 se mueven de forma parecida; cerca de
                -1 tienden a compensarse. Es histórica y puede cambiar.
              </AInfoHint>
            </div>
            <ul v-if="strongestPositionRelations.length" class="a-pf-risk-relations">
              <li
                v-for="pair in strongestPositionRelations"
                :key="`${pair.left_id}-${pair.right_id}`"
              >
                <span>{{ pair.left_name }} · {{ pair.right_name }}</span>
                <strong class="mono">{{
                  Number(pair.value).toLocaleString('es-ES', { maximumFractionDigits: 2 })
                }}</strong>
              </li>
            </ul>
            <p v-else class="a-pf-basket-note">
              No hay dos series con variación suficiente para relacionar.
            </p>
          </template>
          <p v-else class="a-pf-basket-note">
            Relaciones entre activos:
            {{ positionRiskUnavailableText(risk?.advanced.position_correlation ?? {}) }}.
          </p>
        </div>
      </section>

      <p v-if="coverageNote" class="a-pf-basket-note">{{ coverageNote }}</p>
    </template>
  </div>
</template>
