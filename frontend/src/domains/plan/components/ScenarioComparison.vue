<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PlanScenarioComparison } from '@/domains/plan/types';
import { formatMoney } from '@/lib/format';

const props = defineProps<{
  comparison: PlanScenarioComparison;
}>();

const showTable = ref(false);
const unchanged = computed(() => {
  const delta = props.comparison.delta;
  return (
    (delta.projected_year == null || delta.projected_year === 0) &&
    Number(delta.productive_capital) === 0 &&
    Number(delta.net_worth) === 0 &&
    Number(delta.target_capital) === 0
  );
});

function metricValue(
  key: keyof PlanScenarioComparison['current']['summary'],
  side: 'current' | 'simulated',
) {
  return props.comparison[side].summary[key].value;
}

const rows = computed(() => [
  {
    label: 'Fecha proyectada',
    current: metricValue('projected_year', 'current') ?? 'Sin fecha',
    simulated: metricValue('projected_year', 'simulated') ?? 'Sin fecha',
    delta:
      props.comparison.delta.projected_year == null
        ? 'Sin variación calculable'
        : `${props.comparison.delta.projected_year > 0 ? '+' : ''}${props.comparison.delta.projected_year} años`,
  },
  {
    label: 'Capital productivo',
    current: formatMoney(Number(metricValue('productive_capital', 'current'))),
    simulated: formatMoney(Number(metricValue('productive_capital', 'simulated'))),
    delta: formatMoney(Number(props.comparison.delta.productive_capital)),
  },
  {
    label: 'Patrimonio neto',
    current: formatMoney(Number(metricValue('net_worth', 'current'))),
    simulated: formatMoney(Number(metricValue('net_worth', 'simulated'))),
    delta: formatMoney(Number(props.comparison.delta.net_worth)),
  },
  {
    label: 'Capital objetivo',
    current: formatMoney(Number(metricValue('target_capital', 'current'))),
    simulated: formatMoney(Number(metricValue('target_capital', 'simulated'))),
    delta: formatMoney(Number(props.comparison.delta.target_capital)),
  },
]);
</script>

<template>
  <section class="sect plan-comparison">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Comparación</p>
        <h2 class="sect-title">Plan vigente vs escenario</h2>
      </div>
    </div>

    <div v-if="unchanged && !showTable" class="plan-comparison-unchanged">
      <p class="plan-muted">
        Este escenario no cambia la proyección: los resultados coinciden con el plan vigente.
      </p>
      <button class="plan-details-toggle" type="button" @click="showTable = true">
        Ver comparación completa
      </button>
    </div>
    <div v-else class="plan-comparison-table">
      <div class="plan-comparison-head">
        <span>Métrica</span>
        <span>Vigente</span>
        <span>Simulado</span>
        <span>Diferencia</span>
      </div>
      <div v-for="row in rows" :key="row.label" class="plan-comparison-row">
        <strong>{{ row.label }}</strong>
        <span>{{ row.current }}</span>
        <span>{{ row.simulated }}</span>
        <span>{{ row.delta }}</span>
      </div>
    </div>
  </section>
</template>
