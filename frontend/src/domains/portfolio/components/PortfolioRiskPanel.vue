<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AInfoHint, AState } from '@/domains/ui';
import { formatPct } from '@/lib/format';
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
          <span>Tu cartera</span><strong class="mono">{{ pct(benchmark.portfolio_return) }}</strong>
        </div>
        <div>
          <span>
            Tu política
            <AInfoHint>
              Lo que habrían rendido los pesos objetivo que tenías escritos cada mes, con el
              comportamiento real de tus propias clases. Mide si desviarte del plan ayudó, no si
              elegiste buenos productos.
            </AInfoHint>
          </span>
          <strong class="mono">{{ pct(benchmark.benchmark_return) }}</strong>
        </div>
        <div>
          <span>Diferencia</span>
          <strong class="mono" :class="excessIsPositive ? 'pos' : 'neg'">
            {{ pct(benchmark.excess_return) }}
          </strong>
        </div>
      </div>

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
