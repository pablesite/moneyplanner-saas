<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  PlanMember,
  PlanScenarioComparison,
  ProjectionTrajectoryRow,
} from '@/domains/plan/types';
import { ASectHead } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import { yearWithAges } from '@/domains/plan/age';

const props = defineProps<{
  comparison: PlanScenarioComparison;
  members?: PlanMember[];
}>();

const showTable = ref(false);

type Side = 'current' | 'simulated';
type Row = {
  label: string;
  current: string;
  simulated: string;
  delta: string;
  // Tono por mejora, no por signo: adelantar la fecha es 'pos' aunque el delta sea negativo.
  deltaTone?: 'pos' | 'neg' | null;
};

// La comparación se hace sobre la trayectoria: las métricas del summary son
// valores de hoy y un escenario futuro nunca las cambia.
const unchanged = computed(() => {
  const current = props.comparison.current.trajectory;
  const simulated = props.comparison.simulated.trajectory;
  if (current.length !== simulated.length) return false;
  return current.every((row, index) => {
    const other = simulated[index];
    return (
      other != null &&
      row.net_worth === other.net_worth &&
      row.productive_capital === other.productive_capital
    );
  });
});

function trajectoryRow(side: Side, year: number): ProjectionTrajectoryRow | null {
  return props.comparison[side].trajectory.find((row) => row.year === year) ?? null;
}

const milestoneYears = computed<number[]>(() => {
  const years: number[] = [];
  const target = Number(props.comparison.current.summary.target_year.value);
  const trajectory = props.comparison.current.trajectory;
  const horizon = trajectory.length ? trajectory[trajectory.length - 1]!.year : null;
  if (Number.isFinite(target) && trajectoryRow('current', target)) years.push(target);
  if (horizon != null && horizon !== target) years.push(horizon);
  return years;
});

function signedMoney(value: number): string {
  if (value === 0) return 'Sin variación';
  return `${value > 0 ? '+' : ''}${formatMoney(value)}`;
}

function moneyRow(
  label: string,
  year: number,
  key: 'net_worth' | 'productive_capital',
): Row | null {
  const current = trajectoryRow('current', year);
  const simulated = trajectoryRow('simulated', year);
  if (!current || !simulated) return null;
  const currentValue = Number(current[key]);
  const simulatedValue = Number(simulated[key]);
  const delta = simulatedValue - currentValue;
  return {
    label: `${label} en ${yearWithAges(year, props.members ?? [])}`,
    current: formatMoney(currentValue),
    simulated: formatMoney(simulatedValue),
    delta: signedMoney(delta),
    deltaTone: delta === 0 ? null : delta > 0 ? 'pos' : 'neg',
  };
}

const rows = computed<Row[]>(() => {
  // La misma fecha que titula el plan ("podrías dejar de trabajar en X"), no la del
  // summary: aquella responde a otra pregunta y en un plan que aún no llega se queda
  // clavada, de modo que la tabla decía "sin variación" mientras todo lo demás se movía.
  const sustainableDelta = props.comparison.delta.sustainable_year;
  const result: Row[] = [
    {
      label: 'Fecha sostenible',
      current: yearWithAges(props.comparison.sustainable_year.current, props.members ?? []),
      simulated: yearWithAges(props.comparison.sustainable_year.simulated, props.members ?? []),
      delta:
        sustainableDelta == null
          ? 'Sin variación calculable'
          : sustainableDelta === 0
            ? 'Sin variación'
            : `${sustainableDelta > 0 ? '+' : ''}${sustainableDelta} ${Math.abs(sustainableDelta) === 1 ? 'año' : 'años'}`,
      deltaTone:
        sustainableDelta == null || sustainableDelta === 0
          ? null
          : sustainableDelta < 0
            ? 'pos'
            : 'neg',
    },
  ];
  for (const year of milestoneYears.value) {
    const netWorth = moneyRow('Patrimonio neto', year, 'net_worth');
    const productive = moneyRow('Capital productivo', year, 'productive_capital');
    if (netWorth) result.push(netWorth);
    if (productive) result.push(productive);
  }
  return result;
});
</script>

<template>
  <section class="sect plan-comparison">
    <ASectHead
      eyebrow="Comparación"
      title="Plan vigente vs escenario"
      subtitle="Impacto sobre la trayectoria proyectada, medido en el año objetivo y al final del horizonte."
    />

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
      <!-- Los tags solo se muestran cuando la fila se apila (móvil): sin la cabecera
           de columnas, tres valores sin etiqueta no dicen cuál es cuál. -->
      <div v-for="row in rows" :key="row.label" class="plan-comparison-row">
        <strong>{{ row.label }}</strong>
        <span><small class="plan-comparison-tag">Vigente</small>{{ row.current }}</span>
        <span><small class="plan-comparison-tag">Simulado</small>{{ row.simulated }}</span>
        <span :class="row.deltaTone">
          <small class="plan-comparison-tag">Diferencia</small>{{ row.delta }}
        </span>
      </div>
    </div>
  </section>
</template>
