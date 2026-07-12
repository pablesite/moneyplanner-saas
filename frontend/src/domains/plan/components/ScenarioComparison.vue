<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  PlanMember,
  PlanScenarioComparison,
  ProjectionTrajectoryRow,
} from '@/domains/plan/types';
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
  const projectedDelta = props.comparison.delta.projected_year;
  const result: Row[] = [
    {
      label: 'Fecha proyectada',
      current: yearWithAges(
        props.comparison.current.summary.projected_year.value,
        props.members ?? [],
      ),
      simulated: yearWithAges(
        props.comparison.simulated.summary.projected_year.value,
        props.members ?? [],
      ),
      delta:
        projectedDelta == null
          ? 'Sin variación calculable'
          : projectedDelta === 0
            ? 'Sin variación'
            : `${projectedDelta > 0 ? '+' : ''}${projectedDelta} ${Math.abs(projectedDelta) === 1 ? 'año' : 'años'}`,
      deltaTone:
        projectedDelta == null || projectedDelta === 0 ? null : projectedDelta < 0 ? 'pos' : 'neg',
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
    <div class="sect-head">
      <div>
        <p class="eyebrow">Comparación</p>
        <h2 class="sect-title">Plan vigente vs escenario</h2>
        <p class="sect-sub">
          Impacto sobre la trayectoria proyectada, medido en el año objetivo y al final del
          horizonte.
        </p>
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
        <span :class="row.deltaTone">{{ row.delta }}</span>
      </div>
    </div>
  </section>
</template>
