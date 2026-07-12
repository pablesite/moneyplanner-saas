<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import type { PlanAssetFunction, PlanScenarioPayload, PlanScenarioTemplate } from '@/domains/plan';
import {
  assetFunctionLabels,
  defaultScenarioEvent,
  scenarioStatusLabel,
  scenarioTemplateLabel,
  scenarioTemplates,
} from '@/domains/plan/scenarioTemplates';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

const router = useRouter();
const route = useRoute();
const { store, error } = usePlan();
const formOpen = ref(false);
const submitError = ref<string | null>(null);
const validationSummary = computed(
  () => submitError.value ?? Object.values(store.scenarioFieldErrors)[0] ?? null,
);

const templateOptions: ASelectItem[] = scenarioTemplates.map((item) => ({
  value: item.value,
  label: item.label,
}));
const assetOptions: ASelectItem[] = Object.entries(assetFunctionLabels).map(([value, label]) => ({
  value,
  label,
}));

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

const show = computed(() => {
  const fields = new Set(selectedTemplate.value.fields);
  return {
    endDate: fields.has('endDate'),
    initialOutflow: fields.has('initialOutflow'),
    newAsset: fields.has('newAsset'),
    monthlyExpense: fields.has('monthlyExpense'),
    monthlyIncome: fields.has('monthlyIncome'),
    monthlyContribution: fields.has('monthlyContribution'),
    debt: fields.has('debt'),
    initialGroup: fields.has('initialOutflow') || fields.has('newAsset'),
    monthlyGroup:
      fields.has('monthlyExpense') ||
      fields.has('monthlyIncome') ||
      fields.has('monthlyContribution'),
  };
});

const incomeAsReduction = computed(() => selectedTemplate.value.incomeAsReduction === true);
const incomeLabel = computed(() =>
  incomeAsReduction.value ? 'Reducción de ingreso mensual' : 'Cambio de ingreso mensual',
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

// El usuario introduce el interés en % (7 = 7 %); el backend espera fracción.
function nullableRateFromPct(value: string): string | null {
  if (!String(value).trim()) return null;
  const parsed = Number(String(value).replace(',', '.'));
  if (!Number.isFinite(parsed)) return null;
  return (parsed / 100).toFixed(4);
}

function signedIncomeDelta(): string {
  const value = money(form.monthlyIncomeDelta);
  if (!incomeAsReduction.value) return value;
  const parsed = Number(value);
  return (parsed > 0 ? -parsed : parsed).toFixed(2);
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
        monthly_income_delta: signedIncomeDelta(),
        monthly_contribution_delta: money(form.monthlyContributionDelta),
        new_asset_value: money(form.newAssetValue),
        new_asset_type: form.newAssetType,
        new_debt_principal: money(form.newDebtPrincipal),
        new_debt_interest_rate: nullableRateFromPct(form.newDebtInterestRate),
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
  submitError.value = null;
  try {
    const scenario = await store.createScenario(payload());
    await router.push(`/plan/escenarios/${scenario.id}`);
  } catch {
    submitError.value = error.value;
  }
}

function fieldError(field: string): string | null {
  return store.scenarioFieldErrors[field] ?? null;
}

function scenarioImpact(scenario: (typeof store.scenarios)[number]): string {
  const event = scenario.events[0];
  if (!event) return 'Sin impacto cuantificado';
  const parts: string[] = [];
  if (Number(event.initial_outflow))
    parts.push(`${formatMoney(Number(event.initial_outflow))} inicial`);
  if (Number(event.monthly_expense_delta))
    parts.push(`+${formatMoney(Number(event.monthly_expense_delta))}/mes de gasto`);
  if (Number(event.monthly_income_delta))
    parts.push(`${formatMoney(Number(event.monthly_income_delta))}/mes de ingreso`);
  return parts.join(' · ') || 'Sin impacto monetario';
}

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString('es-ES');
}

watch(
  () => form.template,
  (template) => hydrateTemplate(template),
  { immediate: true },
);

onMounted(async () => {
  formOpen.value = route.query.create === '1';
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
        <AButton variant="primary" @click="formOpen = !formOpen">
          {{ formOpen ? 'Cerrar simulador' : 'Simular una decisión' }}
        </AButton>
        <RouterLink class="btn btn-ghost" to="/plan">Volver a Mi Plan</RouterLink>
      </template>
    </APageHead>

    <AState v-if="store.scenariosLoading && !store.scenarios.length" status="loading">
      Cargando escenarios...
    </AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <section v-if="formOpen" class="sect plan-form-section">
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
            <small v-if="fieldError('name')" class="plan-field-error">{{
              fieldError('name')
            }}</small>
          </label>
        </div>

        <fieldset class="plan-form-group">
          <legend>Cuándo</legend>
          <div class="plan-form-grid">
            <label>
              <span>Fecha inicio</span>
              <input v-model="form.startDate" class="input" type="date" required />
              <small v-if="fieldError('start_date')" class="plan-field-error">{{
                fieldError('start_date')
              }}</small>
            </label>
            <label v-if="show.endDate">
              <span>Fecha fin</span>
              <input v-model="form.endDate" class="input" type="date" />
            </label>
          </div>
        </fieldset>

        <fieldset v-if="show.initialGroup" class="plan-form-group">
          <legend>Impacto inicial</legend>
          <div class="plan-form-grid">
            <label v-if="show.initialOutflow">
              <span>Pago inicial</span>
              <input
                v-model="form.initialOutflow"
                class="input"
                type="number"
                min="0"
                step="0.01"
              />
              <small>Importe en euros que sale de tu capital al comenzar.</small>
            </label>
            <label v-if="show.newAsset">
              <span>Valor activo nuevo</span>
              <input v-model="form.newAssetValue" class="input" type="number" min="0" step="0.01" />
              <small>Valor estimado en euros en la fecha de inicio.</small>
            </label>
            <label v-if="show.newAsset">
              <span>Clasificación activo</span>
              <ASelect
                v-model="form.newAssetType"
                :options="assetOptions"
                class="filter-ctrl"
                :searchable="false"
              />
            </label>
          </div>
        </fieldset>

        <fieldset v-if="show.monthlyGroup" class="plan-form-group">
          <legend>Cambios mensuales</legend>
          <div class="plan-form-grid">
            <label v-if="show.monthlyExpense">
              <span>Gasto mensual adicional</span>
              <input
                v-model="form.monthlyExpenseDelta"
                class="input"
                type="number"
                min="0"
                step="0.01"
              />
            </label>
            <label v-if="show.monthlyIncome">
              <span>{{ incomeLabel }}</span>
              <input
                v-model="form.monthlyIncomeDelta"
                class="input"
                type="number"
                :min="incomeAsReduction ? 0 : undefined"
                step="0.01"
              />
            </label>
            <label v-if="show.monthlyContribution">
              <span>Aportación mensual adicional</span>
              <input
                v-model="form.monthlyContributionDelta"
                class="input"
                type="number"
                min="0"
                step="0.01"
              />
            </label>
          </div>
        </fieldset>

        <fieldset v-if="show.debt" class="plan-form-group">
          <legend>Financiación</legend>
          <div class="plan-form-grid">
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
              <span>Interés anual deuda (%)</span>
              <input
                v-model="form.newDebtInterestRate"
                class="input"
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="4,5"
              />
            </label>
            <label>
              <span>Plazo deuda (meses)</span>
              <input v-model="form.newDebtTermMonths" class="input" type="number" min="1" />
            </label>
          </div>
        </fieldset>

        <div class="plan-setup-actions">
          <span class="plan-muted">
            Crear el escenario no cambia tus datos. Solo al incorporarlo pasará a Mi Plan y generará
            sus partidas futuras de presupuesto.
          </span>
          <AButton variant="primary" type="submit" :loading="store.saving">Crear escenario</AButton>
        </div>
        <AState v-if="validationSummary" status="error" layout="inline">
          {{ validationSummary }}
        </AState>
      </form>
    </section>

    <section class="sect plan-scenario-list">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Laboratorio</p>
          <h2 class="sect-title">Escenarios guardados</h2>
        </div>
      </div>
      <div v-if="!store.scenarios.length" class="plan-empty-inline">
        <p class="plan-muted">Aún no hay escenarios.</p>
        <span>Simula una decisión para comparar su impacto antes de incorporarla al plan.</span>
      </div>
      <RouterLink
        v-for="scenario in store.scenarios"
        v-else
        :key="scenario.id"
        class="plan-scenario-row"
        :to="`/plan/escenarios/${scenario.id}`"
      >
        <div>
          <strong>{{ scenario.name }}</strong>
          <span>
            {{ scenarioTemplateLabel(scenario.template_type) }} ·
            {{ shortDate(scenario.events[0]?.start_date || scenario.created_at) }}
          </span>
          <small>{{ scenarioImpact(scenario) }}</small>
        </div>
        <span class="plan-status-chip" :class="`is-${scenario.status}`">
          {{ scenarioStatusLabel(scenario.status) }}
        </span>
      </RouterLink>
    </section>
  </main>
</template>
