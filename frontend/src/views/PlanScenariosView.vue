<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { PlanEventsTimeline } from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import type { PlanAssetFunction, PlanScenarioPayload, PlanScenarioTemplate } from '@/domains/plan';
import {
  assetFunctionLabels,
  defaultScenarioEvent,
  scenarioTemplateLabel,
  scenarioTemplates,
} from '@/domains/plan/scenarioTemplates';
import { formatMoney } from '@/lib/format';
import { formatShortMonthYear } from '@/lib/dates';
import '@/domains/plan/plan.css';

const router = useRouter();
const route = useRoute();
const { store, error } = usePlan();
const formOpen = ref(false);
const submitError = ref<string | null>(null);
const validationSummary = computed(
  () => submitError.value ?? Object.values(store.scenarioFieldErrors)[0] ?? null,
);

const assetOptions: ASelectItem[] = Object.entries(assetFunctionLabels).map(([value, label]) => ({
  value,
  label,
}));

const form = reactive({
  name: '',
  template: 'vehicle' as PlanScenarioTemplate,
  startDate: '',
  endDate: '',
  monthlyExpenseDelta: '',
  monthlyIncomeDelta: '',
  monthlyContributionDelta: '',
  newAssetValue: '',
  newAssetType: 'family_use' as PlanAssetFunction,
  newDebtPrincipal: '',
  newDebtInterestRate: '',
  newDebtTermMonths: '',
});
type OneOffItem = { name: string; amount: string };
const oneOffItems = reactive<OneOffItem[]>([]);

const selectedTemplate = computed(
  () => scenarioTemplates.find((item) => item.value === form.template) ?? scenarioTemplates[0]!,
);

const pendingScenarios = computed(() =>
  store.scenarios.filter((scenario) => scenario.status === 'draft'),
);
const discardedScenarios = computed(() =>
  store.scenarios.filter((scenario) => scenario.status === 'discarded'),
);
const activeEvents = computed(() =>
  store.events.filter((event) => event.status !== 'cancelled' || event.effective_end_date),
);
const plannedEvents = computed(
  () => activeEvents.value.filter((event) => event.status === 'planned').length,
);
const occurredEvents = computed(
  () => activeEvents.value.filter((event) => event.status === 'occurred').length,
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
  form.monthlyExpenseDelta = '';
  form.monthlyIncomeDelta = '';
  form.monthlyContributionDelta = '';
  form.newAssetValue = '';
  form.newAssetType = event.new_asset_type ?? 'unknown';
  form.newDebtPrincipal = '';
  form.newDebtInterestRate = '';
  form.newDebtTermMonths = '';
  oneOffItems.splice(0, oneOffItems.length, { name: 'Pago inicial', amount: '' });
}

function startScenario(template: PlanScenarioTemplate): void {
  if (form.template !== template) form.template = template;
  else hydrateTemplate(template);
  formOpen.value = true;
  submitError.value = null;
}

function closeForm(): void {
  formOpen.value = false;
  submitError.value = null;
}

function addOneOffItem(): void {
  oneOffItems.push({ name: '', amount: '' });
}

function removeOneOffItem(index: number): void {
  if (oneOffItems.length > 1) oneOffItems.splice(index, 1);
}

const validOneOffItems = computed(() =>
  oneOffItems.filter((item) => item.name.trim() && Number(money(item.amount)) > 0),
);

const oneOffTotal = computed(() =>
  validOneOffItems.value.reduce((total, item) => total + Number(money(item.amount)), 0),
);

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
        initial_outflow: oneOffTotal.value.toFixed(2),
        monthly_expense_delta: money(form.monthlyExpenseDelta),
        monthly_income_delta: signedIncomeDelta(),
        monthly_contribution_delta: money(form.monthlyContributionDelta),
        new_asset_value: money(form.newAssetValue),
        new_asset_type: form.newAssetType,
        new_debt_principal: money(form.newDebtPrincipal),
        new_debt_interest_rate: nullableRateFromPct(form.newDebtInterestRate),
        new_debt_term_months: form.newDebtTermMonths ? Number(form.newDebtTermMonths) : null,
        metadata_json: {
          one_off_items: validOneOffItems.value.map((item) => ({
            name: item.name.trim(),
            amount: money(item.amount),
          })),
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
    await router.push(`/plan/decisiones/${scenario.id}`);
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
  const incomeDelta = Number(event.monthly_income_delta);
  if (incomeDelta < 0) parts.push(`${formatMoney(Math.abs(incomeDelta))}/mes menos de ingreso`);
  if (incomeDelta > 0) parts.push(`+${formatMoney(incomeDelta)}/mes de ingreso`);
  if (Number(event.monthly_contribution_delta)) {
    parts.push(`+${formatMoney(Number(event.monthly_contribution_delta))}/mes de aportación`);
  }
  if (Number(event.new_debt_principal)) {
    parts.push(`${formatMoney(Number(event.new_debt_principal))} de deuda`);
  }
  return parts.join(' · ') || 'Sin impacto monetario';
}

watch(
  () => form.template,
  (template) => hydrateTemplate(template),
  { immediate: true },
);

onMounted(async () => {
  document.title = 'Decisiones de Mi Plan · The Arkenstone';
  await store.fetchPlan();
  await Promise.all([store.fetchScenarios(), store.fetchEvents()]);
  if (route.query.create === '1') await startScenario(form.template);
});
</script>

<template>
  <main class="page plan-page plan-scenarios-page">
    <APageHead title="Decisiones" eyebrow="Mi Plan">
      <template #meta>
        <span>Prueba primero; incorpora al plan solo cuando lo tengas claro</span>
      </template>
    </APageHead>
    <nav class="plan-tabs-bar" aria-label="Secciones de Mi Plan">
      <div class="tabs">
        <RouterLink class="tab" to="/plan">Resumen</RouterLink>
        <RouterLink class="tab" to="/plan/mejoras">Mejoras</RouterLink>
        <RouterLink class="tab on" to="/plan/decisiones" aria-current="page">Decisiones</RouterLink>
      </div>
    </nav>

    <AState
      v-if="store.scenariosLoading && !store.scenarios.length && !store.events.length"
      status="loading"
    >
      Cargando escenarios...
    </AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <section class="plan-chapter plan-decisions-start" aria-labelledby="decisions-start-title">
      <div class="plan-chapter-label" aria-hidden="true">
        <span>01</span>
        <strong>Empezar</strong>
      </div>
      <div class="plan-decisions-hero">
        <div class="plan-decisions-hero-copy">
          <p class="eyebrow">Simula sin compromiso</p>
          <h2 id="decisions-start-title">¿Qué decisión estás valorando?</h2>
          <p>
            Elige un punto de partida. Verás cómo cambia la fecha de tu objetivo antes de añadir
            nada al plan o al presupuesto.
          </p>
        </div>
        <dl class="plan-decision-kpis" aria-label="Estado de tus decisiones">
          <div>
            <dt>Por decidir</dt>
            <dd>{{ pendingScenarios.length }}</dd>
          </div>
          <div>
            <dt>Previstas</dt>
            <dd>{{ plannedEvents }}</dd>
          </div>
          <div>
            <dt>Ocurridas</dt>
            <dd>{{ occurredEvents }}</dd>
          </div>
        </dl>
      </div>

      <div class="plan-decision-template-grid" aria-label="Tipos de decisión">
        <button
          v-for="template in scenarioTemplates"
          :key="template.value"
          type="button"
          class="plan-decision-template"
          :class="{ 'is-active': formOpen && form.template === template.value }"
          :aria-label="`${template.label}: ${template.description}`"
          :aria-pressed="formOpen && form.template === template.value"
          @click="startScenario(template.value)"
        >
          <strong>{{ template.label }}</strong>
          <span>{{ template.description }}</span>
        </button>
      </div>

      <div class="plan-decision-direct-actions">
        <RouterLink class="plan-decision-direct" to="/plan/decisiones/agrupar">
          <span class="plan-decision-direct-index" aria-hidden="true">A</span>
          <span>
            <strong>Ya está decidida</strong>
            <small>Añade una compra o venta prevista usando partidas existentes.</small>
          </span>
          <span aria-hidden="true">→</span>
        </RouterLink>
        <RouterLink class="plan-decision-direct" to="/plan/decisiones/registrar">
          <span class="plan-decision-direct-index" aria-hidden="true">B</span>
          <span>
            <strong>Ya ocurrió</strong>
            <small>Regístrala y enlázala con Presupuesto o Patrimonio.</small>
          </span>
          <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>

    <BaseModal
      :open="formOpen"
      variant="sheet"
      panel-class="max-w-[640px] self-start dir-a dir-a-sheet plan-scenario-sheet"
      @close="closeForm"
    >
      <template #header="{ titleId, close }">
        <div class="plan-scenario-sheet-heading">
          <h2 :id="titleId" class="ui-modal-title">Nueva simulación</h2>
          <p>
            <strong>{{ selectedTemplate.label }}</strong> · {{ selectedTemplate.description }}
          </p>
        </div>
        <AButton size="sm" variant="ghost" @click="close">Cerrar</AButton>
      </template>

      <form
        id="plan-scenario-form"
        class="plan-setup plan-scenario-sheet-form"
        @submit.prevent="submit"
      >
        <div class="plan-form-grid plan-decision-name-grid">
          <label>
            <span>Nombre de la decisión</span>
            <input v-model="form.name" class="input" type="text" autocomplete="off" />
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
            <div v-if="show.initialOutflow" class="plan-one-off-editor">
              <div class="plan-one-off-head">
                <div>
                  <span>Desembolsos puntuales</span>
                  <small>Entrada, impuestos, muebles u otros conceptos pagados al inicio.</small>
                </div>
                <AButton size="sm" variant="ghost" type="button" @click="addOneOffItem">
                  Añadir concepto
                </AButton>
              </div>
              <div v-for="(item, index) in oneOffItems" :key="index" class="plan-one-off-row">
                <input v-model="item.name" class="input" type="text" placeholder="Concepto" />
                <input
                  v-model="item.amount"
                  class="input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Importe"
                />
                <AButton
                  size="sm"
                  variant="ghost"
                  type="button"
                  :disabled="oneOffItems.length === 1"
                  @click="removeOneOffItem(index)"
                >
                  Quitar
                </AButton>
              </div>
              <strong v-if="oneOffTotal">Total puntual {{ formatMoney(oneOffTotal) }}</strong>
            </div>
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
              <span>Coste de uso mensual (sin cuota)</span>
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

        <AState v-if="validationSummary" status="error" layout="inline">
          {{ validationSummary }}
        </AState>
      </form>
      <template #footer>
        <div class="plan-scenario-sheet-footer">
          <p>Guardar el borrador no cambia tu plan ni tu presupuesto.</p>
          <div class="ui-modal-foot-actions">
            <AButton variant="ghost" type="button" @click="closeForm">Cancelar</AButton>
            <AButton
              variant="primary"
              type="submit"
              form="plan-scenario-form"
              :loading="store.saving"
            >
              Ver resultado
            </AButton>
          </div>
        </div>
      </template>
    </BaseModal>

    <section class="plan-chapter" aria-labelledby="pending-decisions-title">
      <div class="plan-chapter-label" aria-hidden="true">
        <span>02</span>
        <strong>Por decidir</strong>
      </div>
      <section class="plan-decision-worklist">
        <div class="plan-block-head">
          <div>
            <p class="plan-block-eyebrow">Pendientes</p>
            <h2 id="pending-decisions-title" class="sect-title">Decisiones que estás valorando</h2>
          </div>
          <span class="plan-decision-count">{{ pendingScenarios.length }}</span>
        </div>
        <div v-if="!pendingScenarios.length" class="plan-empty-inline plan-decision-empty">
          <p class="plan-muted">No tienes decisiones pendientes.</p>
          <span>Elige arriba una opción para probar su impacto.</span>
        </div>
        <RouterLink
          v-for="scenario in pendingScenarios"
          v-else
          :key="scenario.id"
          class="plan-scenario-row plan-decision-row"
          :to="`/plan/decisiones/${scenario.id}`"
        >
          <span class="plan-decision-row-date mono">
            {{ formatShortMonthYear(scenario.events[0]?.start_date || scenario.created_at) }}
          </span>
          <div>
            <strong>{{ scenario.name }}</strong>
            <span>{{ scenarioTemplateLabel(scenario.template_type) }}</span>
            <small>{{ scenarioImpact(scenario) }}</small>
          </div>
          <span class="plan-decision-row-action"
            >Ver impacto <span aria-hidden="true">→</span></span
          >
        </RouterLink>

        <details v-if="discardedScenarios.length" class="plan-decision-archive">
          <summary>
            Descartadas <span>{{ discardedScenarios.length }}</span>
          </summary>
          <RouterLink
            v-for="scenario in discardedScenarios"
            :key="scenario.id"
            class="plan-scenario-row plan-decision-row is-archived"
            :to="`/plan/decisiones/${scenario.id}`"
          >
            <span class="plan-decision-row-date mono">
              {{ formatShortMonthYear(scenario.events[0]?.start_date || scenario.created_at) }}
            </span>
            <div>
              <strong>{{ scenario.name }}</strong>
              <span>{{ scenarioTemplateLabel(scenario.template_type) }}</span>
            </div>
            <span class="plan-decision-row-action">Consultar</span>
          </RouterLink>
        </details>
      </section>
    </section>

    <section class="plan-chapter" aria-label="Decisiones en tu plan">
      <div class="plan-chapter-label" aria-hidden="true">
        <span>03</span>
        <strong>En tu plan</strong>
      </div>
      <PlanEventsTimeline
        :events="activeEvents"
        :saving="store.saving"
        :close-event="store.closePlanEvent"
        :release-event="store.releaseEvent"
        :materialize-event="store.materializeEvent"
        :cancel-event="store.cancelEvent"
        eyebrow="Seguimiento"
        title="Decisiones que ya cuentan en tu plan"
        empty-copy="Cuando incorpores una simulación o registres una decisión, aparecerá aquí."
        :empty-action="false"
        allow-editing
      />
    </section>
  </main>
</template>
