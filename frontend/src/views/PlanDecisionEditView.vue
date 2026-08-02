<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { planApi } from '@/domains/plan/api';
import { usePlanStore } from '@/domains/plan/store';
import { scenarioTemplates } from '@/domains/plan/scenarioTemplates';
import type {
  PlanEventBudgetLines,
  PlanScenarioTemplate,
  PlannedDecisionPreviewResponse,
  PlannedDecisionImpact,
} from '@/domains/plan/types';
import { parseAnnualAmount } from '@/domains/budget/annual-entries/annualEntryUtils';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

type DecisionKind = 'sale' | 'purchase';

const route = useRoute();
const router = useRouter();
const store = usePlanStore();
const eventId = computed(() => Number(route.params.id));
const event = computed(() => store.events.find((item) => item.id === eventId.value));
const context = ref<PlanEventBudgetLines | null>(null);
const loading = ref(true);
const submitting = ref(false);
const editable = ref(false);
const preview = ref<PlannedDecisionPreviewResponse | null>(null);
const previewLoading = ref(false);
let previewTimer: ReturnType<typeof setTimeout> | undefined;
let previewRequest = 0;

const currentYear = new Date().getFullYear();
const form = reactive({
  name: '',
  event_type: 'housing' as PlanScenarioTemplate,
  kind: 'purchase' as DecisionKind,
  decision_date: '',
  transaction_year: currentYear,
  transaction_month: 1,
  note: '',
});
const impact = reactive({
  proceeds: '',
  disposed_asset_value: '',
  disposed_asset_type: 'family_use' as NonNullable<PlannedDecisionImpact['disposed_asset_type']>,
  disposed_liability_value: '',
  initial_outflow: '',
  new_asset_value: '',
  new_asset_type: 'family_use' as NonNullable<PlannedDecisionImpact['new_asset_type']>,
  new_debt_principal: '',
  new_debt_interest_rate: '',
  new_debt_term_years: '',
  monthly_expense_delta: '',
});

const kindOptions: ASelectItem[] = [
  { value: 'purchase', label: 'Compra de activo' },
  { value: 'sale', label: 'Venta de activo' },
];
const templateOptions: ASelectItem[] = scenarioTemplates.map((template) => ({
  value: template.value,
  label: template.label,
}));
const assetTypeOptions: ASelectItem[] = [
  { value: 'productive', label: 'Productivo' },
  { value: 'security', label: 'Seguridad' },
  { value: 'family_use', label: 'Uso familiar' },
  { value: 'short_term_goal', label: 'Objetivo a corto' },
  { value: 'unknown', label: 'Sin clasificar' },
];
const yearOptions: ASelectItem[] = Array.from({ length: 41 }, (_, index) => {
  const year = currentYear - 5 + index;
  return { value: year, label: String(year) };
});
const monthOptions: ASelectItem[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
].map((label, index) => ({ value: index + 1, label }));

const isSale = computed(() => form.kind === 'sale');
const scenarioBacked = computed(() => event.value?.source_scenario != null);
const debtNeedsTerm = computed(
  () =>
    !isSale.value && amountNum(impact.new_debt_principal) > 0 && !impact.new_debt_term_years.trim(),
);
const purchaseNetWorthGain = computed(() => {
  if (isSale.value) return 0;
  return (
    amountNum(impact.new_asset_value) -
    amountNum(impact.new_debt_principal) -
    amountNum(impact.initial_outflow)
  );
});
const purchaseWarning = computed(
  () => !isSale.value && Math.abs(purchaseNetWorthGain.value) > 1000,
);
const canSubmit = computed(
  () =>
    editable.value &&
    Boolean(form.name.trim() && form.decision_date) &&
    !debtNeedsTerm.value &&
    !submitting.value,
);
const preservedCount = computed(
  () => (context.value?.expenses.length ?? 0) + (context.value?.income.length ?? 0),
);

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function textValue(value: unknown): string {
  return value == null ? '' : String(value);
}
function normalizeMoneyInput(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  return /^\d{1,3}(\.\d{3})+$/.test(trimmed) ? trimmed.replace(/\./g, '') : trimmed;
}
function amountNum(raw: string): number {
  return parseAnnualAmount(normalizeMoneyInput(raw));
}
function money(raw: string): string {
  return amountNum(raw).toFixed(2);
}
function rate(raw: string): string {
  return parseAnnualAmount(raw).toFixed(4);
}
function buildImpact(): PlannedDecisionImpact {
  if (isSale.value) {
    return {
      proceeds: money(impact.proceeds),
      disposed_asset_value: money(impact.disposed_asset_value),
      disposed_asset_type: impact.disposed_asset_type,
      disposed_liability_value: money(impact.disposed_liability_value),
    };
  }
  return {
    initial_outflow: money(impact.initial_outflow),
    new_asset_value: money(impact.new_asset_value),
    new_asset_type: impact.new_asset_type,
    new_debt_principal: money(impact.new_debt_principal),
    new_debt_interest_rate: rate(impact.new_debt_interest_rate),
    new_debt_term_years: impact.new_debt_term_years ? Number(impact.new_debt_term_years) : null,
    monthly_expense_delta: money(impact.monthly_expense_delta),
  };
}

async function refreshPreview(): Promise<void> {
  if (!editable.value || !form.decision_date || debtNeedsTerm.value) return;
  const request = ++previewRequest;
  previewLoading.value = true;
  try {
    const { data } = await planApi.previewPlannedDecision({
      name: form.name.trim() || event.value?.name || 'Decisión',
      event_type: form.event_type,
      decision_date: form.decision_date,
      transaction_year: Number(form.transaction_year),
      transaction_month: Number(form.transaction_month),
      expense_entry_ids: [],
      income_entry_ids: [],
      asset_ids: [],
      liability_ids: [],
      impact: buildImpact(),
      note: form.note.trim(),
      replaced_event_id: eventId.value,
    });
    if (request === previewRequest) preview.value = data;
  } catch {
    // La vista previa no bloquea editar ni ensucia el formulario con un error transitorio.
  } finally {
    if (request === previewRequest) previewLoading.value = false;
  }
}

function schedulePreview(): void {
  if (previewTimer) clearTimeout(previewTimer);
  previewTimer = setTimeout(() => void refreshPreview(), 500);
}

function initialize(): void {
  const current = event.value;
  if (!current) return;
  const registration = record(current.actual_impact_json.registration);
  const adopted = registration.adopted_lines;
  editable.value =
    current.status === 'planned' && (current.source_scenario != null || Array.isArray(adopted));
  if (!editable.value) return;

  const events = current.planned_impact_json.events;
  const projected = record(Array.isArray(events) ? events[0] : null);
  const sale =
    Number(projected.proceeds ?? 0) > 0 || Number(projected.disposed_asset_value ?? 0) > 0;
  form.name = current.name;
  form.event_type = current.event_type;
  form.kind = sale ? 'sale' : 'purchase';
  form.decision_date = textValue(registration.decision_date || current.planned_date);
  form.transaction_year = Number(projected.start_year || registration.transaction_year);
  form.transaction_month = Number(projected.start_month || registration.transaction_month || 1);
  form.note = textValue(registration.note);
  impact.proceeds = textValue(projected.proceeds);
  impact.disposed_asset_value = textValue(projected.disposed_asset_value);
  impact.disposed_asset_type =
    (projected.disposed_asset_type as typeof impact.disposed_asset_type) || 'family_use';
  impact.disposed_liability_value = textValue(projected.disposed_liability_value);
  impact.initial_outflow = textValue(projected.initial_outflow);
  impact.new_asset_value = textValue(projected.new_asset_value);
  impact.new_asset_type =
    (projected.new_asset_type as typeof impact.new_asset_type) || 'family_use';
  impact.new_debt_principal = textValue(projected.new_debt_principal);
  impact.new_debt_interest_rate = textValue(projected.new_debt_interest_rate);
  impact.new_debt_term_years = textValue(projected.new_debt_term_years);
  impact.monthly_expense_delta = textValue(projected.monthly_expense_delta);
  schedulePreview();
}

watch(
  () => [
    form.event_type,
    form.decision_date,
    form.transaction_year,
    form.transaction_month,
    impact.proceeds,
    impact.disposed_asset_value,
    impact.disposed_asset_type,
    impact.disposed_liability_value,
    impact.initial_outflow,
    impact.new_asset_value,
    impact.new_asset_type,
    impact.new_debt_principal,
    impact.new_debt_interest_rate,
    impact.new_debt_term_years,
    impact.monthly_expense_delta,
  ],
  schedulePreview,
);

onBeforeUnmount(() => {
  if (previewTimer) clearTimeout(previewTimer);
});

async function submit(): Promise<void> {
  if (!canSubmit.value) return;
  submitting.value = true;
  store.clearError();
  try {
    await store.updatePlannedDecision(eventId.value, {
      name: form.name.trim(),
      event_type: form.event_type,
      decision_date: form.decision_date,
      transaction_year: Number(form.transaction_year),
      transaction_month: Number(form.transaction_month),
      impact: buildImpact(),
      note: form.note.trim(),
    });
    await store.loadDashboard();
    await router.push('/plan');
  } catch {
    if (!store.error) store.error = 'No se pudo actualizar la decisión.';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  document.title = 'Editar decisión · The Arkenstone';
  try {
    const [, lines] = await Promise.all([
      store.fetchEvents(),
      planApi.getEventBudgetLines(eventId.value),
    ]);
    context.value = lines.data;
    initialize();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="page plan-page plan-setup-page">
    <APageHead :title="event ? `Editar ${event.name}` : 'Editar decisión'" eyebrow="Mi Plan">
      <template #meta>
        <span>Corrige la previsión</span><span class="dot"></span
        ><span>{{
          scenarioBacked ? 'Se regeneran las partidas futuras' : 'Las partidas agrupadas no cambian'
        }}</span>
      </template>
      <template #actions>
        <RouterLink class="btn btn-ghost" :to="`/plan/decisiones/eventos/${eventId}`">
          Cancelar
        </RouterLink>
      </template>
    </APageHead>

    <AState v-if="loading" status="loading">Cargando decisión...</AState>
    <AState v-else-if="!event" status="empty">No se ha encontrado esta decisión.</AState>
    <AState v-else-if="!editable" status="error">
      Esta decisión ya no es una previsión agrupada y no se puede editar desde aquí.
    </AState>
    <template v-else>
      <AState v-if="store.error" status="error">{{ store.error }}</AState>

      <section class="sect plan-form-section">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Previsión</p>
            <h2 class="sect-title">Qué cambia y cuándo</h2>
            <p class="sect-sub">
              Ajusta la fecha, el mes de la operación y sus importes. Al guardar se recalculan caja,
              deuda y patrimonio desde ese mes. Las partidas futuras se sincronizan con la
              previsión.
            </p>
          </div>
        </div>
        <div class="plan-form-grid">
          <label>
            <span>Nombre de la decisión</span>
            <input v-model="form.name" class="input" type="text" />
          </label>
          <label>
            <span>Tipo de decisión</span>
            <ASelect v-model="form.kind" :options="kindOptions" :searchable="false" />
          </label>
          <label>
            <span>Categoría</span>
            <ASelect v-model="form.event_type" :options="templateOptions" :searchable="false" />
          </label>
          <label>
            <span>Fecha de la decisión</span>
            <input v-model="form.decision_date" class="input" type="date" />
          </label>
          <label>
            <span>Mes de la transacción</span>
            <ASelect v-model="form.transaction_month" :options="monthOptions" :searchable="false" />
          </label>
          <label>
            <span>Año de la transacción</span>
            <ASelect v-model="form.transaction_year" :options="yearOptions" :searchable="false" />
          </label>
          <label>
            <span>Nota (opcional)</span>
            <input v-model="form.note" class="input" type="text" />
          </label>
        </div>
      </section>

      <section class="plan-decision-live-preview" aria-live="polite">
        <p class="eyebrow">Impacto en tu plan</p>
        <template v-if="preview">
          <strong>
            {{
              preview.sustainable_year.simulated
                ? `Año ${preview.sustainable_year.simulated}`
                : 'No alcanzable en el horizonte'
            }}
          </strong>
          <span>
            Objetivo sostenible · antes {{ preview.sustainable_year.current ?? 'no alcanzable' }}
            <template v-if="preview.delta.sustainable_year !== null">
              ·
              {{
                preview.delta.sustainable_year === 0
                  ? 'sin cambio'
                  : preview.delta.sustainable_year > 0
                    ? `se retrasa ${preview.delta.sustainable_year} años`
                    : `se adelanta ${Math.abs(preview.delta.sustainable_year)} años`
              }}
            </template>
          </span>
        </template>
        <span v-else>{{
          previewLoading
            ? 'Recalculando con tus cambios...'
            : 'Introduce los importes para ver el impacto.'
        }}</span>
      </section>

      <section class="sect plan-form-section">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Impacto</p>
            <h2 class="sect-title">{{ isSale ? 'Venta prevista' : 'Compra prevista' }}</h2>
            <p class="sect-sub">
              El valor del activo es únicamente la parte que aún debe incorporarse al patrimonio; no
              vuelvas a sumar reservas o pagos que ya estén registrados.
            </p>
          </div>
        </div>

        <p v-if="purchaseWarning" class="plan-decision-warn">
          <strong>Variación patrimonial implícita:</strong>
          {{ formatMoney(purchaseNetWorthGain) }}. Es la diferencia entre el nuevo valor incorporado
          y la suma de deuda más desembolso. Puede ser correcta por revalorización, pero conviene
          comprobar que no contiene importes ya registrados.
        </p>

        <div v-if="isSale" class="plan-form-grid">
          <label>
            <span>Cobro pendiente que llegará a tu cuenta</span>
            <input v-model="impact.proceeds" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Valor bruto del activo que se da de baja</span>
            <input v-model="impact.disposed_asset_value" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Función del activo</span>
            <ASelect
              v-model="impact.disposed_asset_type"
              :options="assetTypeOptions"
              :searchable="false"
            />
          </label>
          <label>
            <span>Deuda que desaparece del patrimonio</span>
            <input v-model="impact.disposed_liability_value" class="input" inputmode="decimal" />
          </label>
        </div>
        <p v-if="isSale" class="plan-decision-preview">
          Este cobro es el efectivo que aún entrará en tu cuenta, después de que el banco retenga la
          hipoteca y de los costes incluidos en el cálculo. No sumes reservas ya cobradas ni restes
          otra vez la deuda: el segundo campo ya elimina ese pasivo del balance.
        </p>
        <div v-else class="plan-form-grid">
          <label>
            <span>Desembolso pendiente (caja)</span>
            <input v-model="impact.initial_outflow" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Valor del activo que se incorpora</span>
            <input v-model="impact.new_asset_value" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Función del activo</span>
            <ASelect
              v-model="impact.new_asset_type"
              :options="assetTypeOptions"
              :searchable="false"
            />
          </label>
          <label>
            <span>Nueva deuda</span>
            <input v-model="impact.new_debt_principal" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Interés anual (0-1)</span>
            <input v-model="impact.new_debt_interest_rate" class="input" inputmode="decimal" />
          </label>
          <label>
            <span>Plazo (años)</span>
            <input v-model="impact.new_debt_term_years" class="input" inputmode="numeric" />
          </label>
          <label v-if="scenarioBacked">
            <span>Coste de uso mensual (sin cuota)</span>
            <input v-model="impact.monthly_expense_delta" class="input" inputmode="decimal" />
          </label>
        </div>
        <p v-if="debtNeedsTerm" class="plan-decision-warn">
          Indica el plazo de la hipoteca para que la deuda no se amortice de forma irreal.
        </p>
      </section>

      <section class="sect plan-form-section">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Se conserva</p>
            <h2 class="sect-title">Partidas y posiciones vinculadas</h2>
            <p class="sect-sub">
              <template v-if="scenarioBacked">
                Al guardar se regeneran las partidas futuras gestionadas por la decisión.
              </template>
              <template v-else>
                No se desagrupa ni modifica nada del presupuesto. Se mantienen
              </template>
              {{ preservedCount }} partidas, {{ context?.linked.assets.length ?? 0 }} activos y
              {{ context?.linked.liabilities.length ?? 0 }} pasivos vinculados.
            </p>
          </div>
        </div>
        <div class="plan-choice-grid">
          <div
            v-for="line in [...(context?.expenses ?? []), ...(context?.income ?? [])]"
            :key="`${line.name}:${line.id}`"
            class="plan-choice plan-choice-sm"
          >
            <strong>{{ line.name }}</strong>
            <small>{{ line.fiscal_year }} · {{ formatMoney(line.amount_annual) }}</small>
          </div>
        </div>
      </section>

      <div class="plan-setup-actions">
        <RouterLink class="btn btn-ghost" :to="`/plan/decisiones/eventos/${eventId}`">
          Cancelar
        </RouterLink>
        <AButton variant="primary" :loading="submitting" :disabled="!canSubmit" @click="submit">
          Guardar y ver mi plan
        </AButton>
      </div>
    </template>
  </main>
</template>
