<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import type { PlanAssetFunction, PlanScenarioPayload, PlanScenarioTemplate } from '@/domains/plan';
import {
  defaultScenarioEvent,
  scenarioTemplateLabel,
  scenarioTemplates,
} from '@/domains/plan/scenarioTemplates';
import '@/domains/plan/plan.css';

const router = useRouter();
const { store, error } = usePlan();

const templateOptions: ASelectItem[] = scenarioTemplates.map((item) => ({
  value: item.value,
  label: item.label,
}));
const assetOptions: ASelectItem[] = [
  { value: 'productive', label: 'Productivo' },
  { value: 'security', label: 'Seguridad' },
  { value: 'short_term_goal', label: 'Objetivo corto plazo' },
  { value: 'family_use', label: 'Uso familiar' },
  { value: 'unknown', label: 'Desconocido' },
];

const form = reactive({
  name: '',
  template: 'vehicle' as PlanScenarioTemplate,
  startDate: '',
  endDate: '',
  initialOutflow: '',
  monthlyExpenseDelta: '',
  monthlyIncomeDelta: '',
  monthlyContributionDelta: '',
  newAssetValue: '',
  newAssetType: 'family_use' as PlanAssetFunction,
  newDebtPrincipal: '',
  newDebtInterestRate: '',
  newDebtTermMonths: '',
});

const selectedTemplate = computed(
  () => scenarioTemplates.find((item) => item.value === form.template) ?? scenarioTemplates[0]!,
);

function hydrateTemplate(template: PlanScenarioTemplate): void {
  const event = defaultScenarioEvent(template);
  form.name = scenarioTemplateLabel(template);
  form.startDate = event.start_date;
  form.endDate = '';
  form.initialOutflow = '';
  form.monthlyExpenseDelta = '';
  form.monthlyIncomeDelta = '';
  form.monthlyContributionDelta = '';
  form.newAssetValue = '';
  form.newAssetType = event.new_asset_type ?? 'unknown';
  form.newDebtPrincipal = '';
  form.newDebtInterestRate = '';
  form.newDebtTermMonths = '';
}

function money(value: string): string {
  const parsed = Number(String(value || '0').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
}

function nullableMoney(value: string): string | null {
  if (!String(value).trim()) return null;
  return money(value);
}

function payload(): PlanScenarioPayload {
  return {
    name: form.name.trim() || scenarioTemplateLabel(form.template),
    template_type: form.template,
    events: [
      {
        start_date: form.startDate,
        end_date: form.endDate || null,
        initial_outflow: money(form.initialOutflow),
        monthly_expense_delta: money(form.monthlyExpenseDelta),
        monthly_income_delta: money(form.monthlyIncomeDelta),
        monthly_contribution_delta: money(form.monthlyContributionDelta),
        new_asset_value: money(form.newAssetValue),
        new_asset_type: form.newAssetType,
        new_debt_principal: money(form.newDebtPrincipal),
        new_debt_interest_rate: nullableMoney(form.newDebtInterestRate),
        new_debt_term_months: form.newDebtTermMonths ? Number(form.newDebtTermMonths) : null,
        metadata_json: {
          budget_lines: [],
          budget_defaults: selectedTemplate.value.budgetDefaults,
        },
      },
    ],
  };
}

async function submit(): Promise<void> {
  const scenario = await store.createScenario(payload());
  await router.push(`/plan/escenarios/${scenario.id}`);
}

watch(
  () => form.template,
  (template) => hydrateTemplate(template),
  { immediate: true },
);

onMounted(async () => {
  await store.fetchPlan();
  await store.fetchScenarios();
});
</script>

<template>
  <main class="page plan-page plan-scenarios-page">
    <APageHead title="Escenarios" eyebrow="Mi Plan">
      <template #meta>
        <span>Simulaciones sin contaminar datos reales</span>
      </template>
      <template #actions>
        <RouterLink class="btn btn-ghost" to="/plan">Volver a Mi Plan</RouterLink>
      </template>
    </APageHead>

    <AState v-if="store.scenariosLoading && !store.scenarios.length" status="loading">
      Cargando escenarios...
    </AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <section class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Nuevo escenario</p>
          <h2 class="sect-title">Simular una decisión</h2>
          <p class="sect-sub">{{ selectedTemplate.description }}</p>
        </div>
      </div>

      <form class="plan-setup" @submit.prevent="submit">
        <div class="plan-form-grid">
          <label>
            <span>Plantilla</span>
            <ASelect
              v-model="form.template"
              :options="templateOptions"
              class="filter-ctrl"
              :searchable="false"
            />
          </label>
          <label>
            <span>Nombre</span>
            <input v-model="form.name" class="input" type="text" />
          </label>
          <label>
            <span>Fecha inicio</span>
            <input v-model="form.startDate" class="input" type="date" required />
          </label>
          <label>
            <span>Fecha fin</span>
            <input v-model="form.endDate" class="input" type="date" />
          </label>
          <label>
            <span>Pago inicial</span>
            <input v-model="form.initialOutflow" class="input" type="number" min="0" step="0.01" />
          </label>
          <label>
            <span>Valor activo nuevo</span>
            <input v-model="form.newAssetValue" class="input" type="number" min="0" step="0.01" />
          </label>
          <label>
            <span>Clasificación activo</span>
            <ASelect
              v-model="form.newAssetType"
              :options="assetOptions"
              class="filter-ctrl"
              :searchable="false"
            />
          </label>
          <label>
            <span>Gasto mensual</span>
            <input
              v-model="form.monthlyExpenseDelta"
              class="input"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
          <label>
            <span>Ingreso mensual adicional</span>
            <input
              v-model="form.monthlyIncomeDelta"
              class="input"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
          <label>
            <span>Aportación mensual adicional</span>
            <input
              v-model="form.monthlyContributionDelta"
              class="input"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
          <label>
            <span>Deuda nueva</span>
            <input
              v-model="form.newDebtPrincipal"
              class="input"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
          <label>
            <span>Interés anual deuda</span>
            <input
              v-model="form.newDebtInterestRate"
              class="input"
              type="number"
              min="0"
              max="1"
              step="0.0001"
              placeholder="0.0700"
            />
          </label>
          <label>
            <span>Plazo deuda (meses)</span>
            <input v-model="form.newDebtTermMonths" class="input" type="number" min="1" />
          </label>
        </div>
        <div class="plan-setup-actions">
          <span class="plan-muted"
            >Aceptar incorporará presupuesto futuro, no patrimonio real.</span
          >
          <AButton variant="primary" type="submit" :loading="store.saving">Crear escenario</AButton>
        </div>
      </form>
    </section>

    <section class="sect plan-scenario-list">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Laboratorio</p>
          <h2 class="sect-title">Escenarios guardados</h2>
        </div>
      </div>
      <p v-if="!store.scenarios.length" class="plan-muted">Aún no hay escenarios.</p>
      <RouterLink
        v-for="scenario in store.scenarios"
        v-else
        :key="scenario.id"
        class="plan-scenario-row"
        :to="`/plan/escenarios/${scenario.id}`"
      >
        <div>
          <strong>{{ scenario.name }}</strong>
          <span>{{ scenarioTemplateLabel(scenario.template_type) }}</span>
        </div>
        <span class="mono">{{ scenario.status }}</span>
      </RouterLink>
    </section>
  </main>
</template>
