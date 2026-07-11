<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, AMetaPill, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { ScenarioComparison } from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import type { ProjectionScenario } from '@/domains/plan';
import { scenarioStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import { formatMoney, toNumber } from '@/lib/format';
import '@/domains/plan/plan.css';

const route = useRoute();
const router = useRouter();
const { store, error, scenario } = usePlan();

const scenarioId = computed(() => Number(route.params.id));
const selected = computed(() => store.selectedScenario);
const firstEvent = computed(() => selected.value?.events[0] ?? null);

const scenarioOptions: ASelectItem[] = [
  { value: 'prudent', label: 'Prudente' },
  { value: 'expected', label: 'Esperado' },
  { value: 'favorable', label: 'Favorable' },
];

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString('es-ES');
}

const statusCopy = computed(() => {
  if (!selected.value) return '';
  const label = scenarioStatusLabel(selected.value.status);
  if (selected.value.status === 'accepted' && selected.value.accepted_at) {
    return `${label} el ${shortDate(selected.value.accepted_at)}`;
  }
  return label;
});

type ImpactMetric = { label: string; value: string };

function signedMonthly(value: string): string {
  const amount = toNumber(value);
  return `${amount > 0 ? '+' : ''}${formatMoney(amount)}/mes`;
}

const impactMetrics = computed<ImpactMetric[]>(() => {
  const event = firstEvent.value;
  if (!event) return [];
  const metrics: ImpactMetric[] = [{ label: 'Inicio', value: shortDate(event.start_date) }];
  if (event.end_date) metrics.push({ label: 'Fin', value: shortDate(event.end_date) });
  const moneyRows: Array<{ label: string; value: string; monthly?: boolean }> = [
    { label: 'Pago inicial', value: event.initial_outflow },
    { label: 'Activo nuevo', value: event.new_asset_value },
    { label: 'Deuda nueva', value: event.new_debt_principal },
    { label: 'Gasto mensual', value: event.monthly_expense_delta, monthly: true },
    { label: 'Ingreso mensual', value: event.monthly_income_delta, monthly: true },
    { label: 'Aportación mensual', value: event.monthly_contribution_delta, monthly: true },
  ];
  for (const row of moneyRows) {
    if (toNumber(row.value) === 0) continue;
    metrics.push({
      label: row.label,
      value: row.monthly ? signedMonthly(row.value) : formatMoney(toNumber(row.value)),
    });
  }
  return metrics;
});

const hasQuantitativeImpact = computed(() =>
  impactMetrics.value.some((metric) => !['Inicio', 'Fin'].includes(metric.label)),
);

const activeScenario = computed({
  get: () => scenario.value,
  set: (value) => {
    void store.fetchScenarioComparison(scenarioId.value, value as ProjectionScenario);
  },
});

async function accept(): Promise<void> {
  await store.acceptScenario(scenarioId.value, scenario.value);
}

async function discard(): Promise<void> {
  await store.discardScenario(scenarioId.value);
  await router.push('/plan/escenarios');
}

onMounted(async () => {
  await store.fetchPlan();
  await store.fetchScenario(scenarioId.value);
  await store.fetchScenarioComparison(scenarioId.value, scenario.value);
});
</script>

<template>
  <main class="page plan-page plan-scenario-detail">
    <APageHead
      :title="selected?.name ?? 'Escenario'"
      :eyebrow="selected ? scenarioTemplateLabel(selected.template_type) : 'Mi Plan'"
    >
      <template #meta>
        <AMetaPill v-if="selected">{{ statusCopy }}</AMetaPill>
      </template>
      <template #actions>
        <RouterLink class="btn btn-ghost" to="/plan/escenarios">Escenarios</RouterLink>
        <AButton
          v-if="selected?.status === 'draft'"
          variant="ghost"
          :loading="store.saving"
          @click="discard"
        >
          Descartar
        </AButton>
        <AButton
          v-if="selected?.status === 'draft'"
          variant="primary"
          :loading="store.saving"
          @click="accept"
        >
          Incorporar al plan
        </AButton>
      </template>
    </APageHead>

    <AState v-if="store.scenariosLoading && !selected" status="loading">
      Cargando escenario...
    </AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <template v-if="selected">
      <section v-if="selected.status === 'discarded'" class="plan-scenario-notice">
        <p>
          Este escenario se descartó y no afecta al plan vigente. Se conserva solo como referencia
          (creado el {{ shortDate(selected.created_at) }}).
        </p>
        <RouterLink class="btn btn-ghost btn-sm" to="/plan/escenarios">
          Crear un escenario nuevo
        </RouterLink>
      </section>

      <div class="plan-toolbar">
        <label class="context-field">
          <span>Hipótesis</span>
          <ASelect
            v-model="activeScenario"
            :options="scenarioOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
      </div>

      <section class="sect plan-scenario-summary">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Inputs</p>
            <h2 class="sect-title">Impacto definido</h2>
          </div>
        </div>
        <div v-if="firstEvent" class="plan-scenario-metrics">
          <article v-for="metric in impactMetrics" :key="metric.label">
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </article>
        </div>
        <p v-if="firstEvent && !hasQuantitativeImpact" class="plan-muted">
          Este escenario no define importes: la comparación coincidirá con el plan vigente.
        </p>
      </section>

      <AState v-if="store.comparisonLoading && !store.scenarioComparison" status="loading">
        Calculando comparación...
      </AState>
      <ScenarioComparison
        v-else-if="store.scenarioComparison"
        :comparison="store.scenarioComparison"
      />
    </template>
  </main>
</template>
