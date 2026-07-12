<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, AMetaPill, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { ScenarioComparison } from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import { planApi } from '@/domains/plan';
import type { PlanEventBudgetLines, ProjectionScenario } from '@/domains/plan';
import {
  scenarioStatusLabel,
  scenarioTemplateLabel,
  timeProfileLabel,
} from '@/domains/plan/scenarioTemplates';
import { formatMoney, toNumber } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import '@/domains/plan/plan.css';

const route = useRoute();
const router = useRouter();
const { store, error, scenario } = usePlan();

const scenarioId = computed(() => Number(route.params.id));
const selected = computed(() => store.selectedScenario);
const firstEvent = computed(() => selected.value?.events[0] ?? null);
const oneOffItems = computed(() => firstEvent.value?.metadata_json.one_off_items ?? []);

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
    {
      label: oneOffItems.value.length ? 'Total puntual' : 'Pago inicial',
      value: event.initial_outflow,
    },
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

const debtMonthlyPayment = computed(() => {
  const event = firstEvent.value;
  if (!event) return 0;
  const principal = toNumber(event.new_debt_principal);
  const months = Number(event.new_debt_term_months || 0);
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = toNumber(event.new_debt_interest_rate) / 12;
  if (monthlyRate <= 0) return principal / months;
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
});

const recurringMonthlyExpense = computed(() => toNumber(firstEvent.value?.monthly_expense_delta));
const combinedMonthlyImpact = computed(
  () => debtMonthlyPayment.value + recurringMonthlyExpense.value,
);

const activeScenario = computed({
  get: () => scenario.value,
  set: (value) => {
    void store.fetchScenarioComparison(scenarioId.value, value as ProjectionScenario);
  },
});

const confirming = ref<'accept' | 'discard' | null>(null);
const acceptedBudgetEntries = ref<number | null>(null);
const eventTrace = ref<PlanEventBudgetLines | null>(null);
const linkedEvent = computed(() =>
  store.events.find((event) => event.source_scenario === scenarioId.value),
);

const confirmCopy = computed(() =>
  confirming.value === 'accept'
    ? 'El escenario pasará a formar parte del plan vigente: se creará un acontecimiento y se añadirán sus líneas al presupuesto futuro. No modifica movimientos ni datos reales.'
    : 'El escenario se descartará de forma definitiva y quedará solo como referencia. No afecta al plan vigente.',
);

async function confirmAction(): Promise<void> {
  try {
    if (confirming.value === 'accept') {
      const result = await store.acceptScenario(scenarioId.value, scenario.value);
      acceptedBudgetEntries.value = result.budget_entries_created;
    }
    if (confirming.value === 'discard') {
      await store.discardScenario(scenarioId.value);
      confirming.value = null;
      await router.push('/plan/escenarios');
      return;
    }
    confirming.value = null;
  } catch {
    // El error queda visible vía store.error; la confirmación sigue abierta para reintentar.
  }
}

onMounted(async () => {
  await store.fetchPlan();
  await store.fetchScenario(scenarioId.value);
  await store.fetchEvents();
  // Un escenario incorporado ya forma parte del plan vigente: la comparación
  // en vivo lo aplicaría por segunda vez sobre sí mismo.
  if (store.selectedScenario?.status !== 'accepted') {
    await store.fetchScenarioComparison(scenarioId.value, scenario.value);
  } else if (linkedEvent.value) {
    try {
      const { data } = await planApi.getEventBudgetLines(linkedEvent.value.id);
      eventTrace.value = data;
    } catch (error) {
      store.error = toApiErrorMessage(error);
    }
  }
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
          :disabled="store.saving"
          @click="confirming = 'discard'"
        >
          Descartar
        </AButton>
        <AButton
          v-if="selected?.status === 'draft'"
          variant="primary"
          :disabled="store.saving"
          @click="confirming = 'accept'"
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

      <section v-if="confirming" class="plan-scenario-notice">
        <p>{{ confirmCopy }}</p>
        <div class="plan-scenario-notice-actions">
          <AButton size="sm" variant="primary" :loading="store.saving" @click="confirmAction">
            {{ confirming === 'accept' ? 'Confirmar incorporación' : 'Confirmar descarte' }}
          </AButton>
          <AButton size="sm" variant="ghost" :disabled="store.saving" @click="confirming = null">
            Cancelar
          </AButton>
        </div>
      </section>

      <section
        v-else-if="acceptedBudgetEntries !== null"
        class="plan-scenario-notice success"
        role="status"
      >
        <p>
          Escenario incorporado al plan vigente<template v-if="acceptedBudgetEntries"
            >: {{ acceptedBudgetEntries }} línea{{ acceptedBudgetEntries === 1 ? '' : 's' }} de
            presupuesto futuro creada{{ acceptedBudgetEntries === 1 ? '' : 's' }}</template
          >.
        </p>
        <div class="plan-scenario-notice-actions">
          <RouterLink class="btn btn-primary btn-sm" to="/plan">Ver Mi Plan</RouterLink>
          <RouterLink v-if="acceptedBudgetEntries" class="btn btn-ghost btn-sm" to="/presupuesto">
            Ver presupuesto
          </RouterLink>
        </div>
      </section>

      <div v-if="selected.status !== 'accepted'" class="plan-toolbar">
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
        <div v-if="oneOffItems.length" class="plan-one-off-summary">
          <div v-for="item in oneOffItems" :key="item.name">
            <span>{{ item.name }}</span>
            <strong>{{ formatMoney(toNumber(item.amount)) }}</strong>
          </div>
        </div>
        <p v-if="firstEvent && !hasQuantitativeImpact" class="plan-muted">
          Este escenario no define importes: la comparación coincidirá con el plan vigente.
        </p>
        <div v-if="firstEvent && recurringMonthlyExpense" class="plan-impact-explanation">
          <strong>Cómo se calcula el gasto de este escenario</strong>
          <p>
            El gasto recurrente de {{ formatMoney(recurringMonthlyExpense) }}/mes no es una
            estimación automática: es el importe introducido al crear el escenario y continúa
            mientras el coche exista.
          </p>
          <p v-if="debtMonthlyPayment">
            Durante los {{ firstEvent.new_debt_term_months }} meses del préstamo se añaden
            aproximadamente {{ formatMoney(debtMonthlyPayment) }}/mes de financiación. En ese
            periodo, el impacto conjunto ronda {{ formatMoney(combinedMonthlyImpact) }}/mes, además
            del pago inicial.
          </p>
        </div>
      </section>

      <section v-if="selected.status === 'accepted'" class="plan-scenario-notice">
        <p>
          <template v-if="linkedEvent?.effective_end_date">
            Este acontecimiento se cerró el {{ shortDate(linkedEvent.effective_end_date) }}. Su
            histórico se conserva y sus efectos recurrentes posteriores ya no forman parte de la
            proyección.
          </template>
          <template v-else>
            Este escenario ya forma parte del plan vigente: la proyección y el presupuesto de Mi
            Plan reflejan su impacto, por lo que no hay comparación pendiente.
          </template>
        </p>
        <RouterLink class="btn btn-ghost btn-sm" to="/plan">Ver Mi Plan</RouterLink>
      </section>
      <section v-if="selected.status === 'accepted'" class="sect plan-scenario-trace">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Rastro real</p>
            <h2 class="sect-title">Acontecimiento y presupuesto</h2>
            <p class="sect-sub">
              Estas partidas fueron creadas al incorporar la decisión y se gestionan desde Mi Plan.
              Las filas de distintos años son tramos de una misma obligación, no gastos que se sumen
              todos en el mismo ejercicio.
            </p>
          </div>
        </div>
        <RouterLink v-if="linkedEvent" class="plan-event-link" to="/plan">
          Acontecimiento: {{ linkedEvent.name }} · {{ shortDate(linkedEvent.planned_date) }}
        </RouterLink>
        <div v-if="eventTrace" class="plan-budget-trace">
          <article v-for="line in [...eventTrace.income, ...eventTrace.expenses]" :key="line.id">
            <div>
              <strong>{{ line.name }}</strong>
              <span>FY {{ line.fiscal_year }} · {{ timeProfileLabel(line.time_profile) }}</span>
            </div>
            <strong>{{ formatMoney(toNumber(line.amount_annual)) }}</strong>
          </article>
          <p v-if="!eventTrace.income.length && !eventTrace.expenses.length" class="plan-muted">
            Este acontecimiento no generó partidas de presupuesto.
          </p>
        </div>
      </section>
      <template v-else>
        <AState v-if="store.comparisonLoading && !store.scenarioComparison" status="loading">
          Calculando comparación...
        </AState>
        <ScenarioComparison
          v-else-if="store.scenarioComparison"
          :comparison="store.scenarioComparison"
          :members="store.plan?.members"
        />
      </template>
    </template>
  </main>
</template>
