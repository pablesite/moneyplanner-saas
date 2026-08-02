<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, AState } from '@/domains/ui';
import { planApi } from '@/domains/plan/api';
import { usePlanStore } from '@/domains/plan/store';
import type { ActionImpactPreview, PlanRecommendation } from '@/domains/plan/types';
import { formatMoney } from '@/lib/format';
import '@/domains/plan/plan.css';

const store = usePlanStore();
const route = useRoute();
const router = useRouter();
type AdjustablePreview = ActionImpactPreview & {
  start_date?: string;
  available_monthly_margin?: string;
  minimum_start_date?: string;
  is_affordable?: boolean;
  funding_source?: string;
};

type RecommendationEvent = {
  start_date?: string;
  monthly_contribution_delta?: string;
};

const preview = ref<AdjustablePreview | null>(null);
const previewingId = ref<number | null>(null);
const incorporatingId = ref<number | null>(null);
const previewError = ref<string | null>(null);
const actionMessage = ref('');
const adjustment = reactive({ monthlyAmount: '', startDate: '' });

const recommendations = computed(() =>
  [...store.recommendations].sort((a, b) => a.priority - b.priority),
);
const cashFlow = computed(() => store.foundations?.cash_flow ?? null);
const adjustmentValid = computed(
  () =>
    Number.isFinite(Number(adjustment.monthlyAmount.replace(',', '.'))) &&
    Number(adjustment.monthlyAmount.replace(',', '.')) > 0 &&
    Boolean(adjustment.startDate),
);
const previewHasImpact = computed(() => {
  if (!preview.value?.delta) return false;
  const delta = preview.value.delta as unknown as Record<string, unknown>;
  return ['sustainable_year', 'projected_year', 'productive_capital', 'net_worth'].some((key) => {
    const value = delta[key];
    return value != null && Number(value) !== 0;
  });
});

function stateLabel(item: PlanRecommendation): string {
  if (item.status === 'accepted') return 'Incorporada';
  if (item.status === 'snoozed') return 'Pospuesta';
  if (item.status === 'dismissed') return 'Descartada';
  if (previewingId.value === item.id) return 'Simulando';
  return 'Por revisar';
}

function destinationPath(item: PlanRecommendation): string {
  const destination = item.action_json.destination;
  if (destination === 'budget') return '/presupuesto';
  if (destination === 'plan_setup') return '/plan/setup';
  return '/plan/decisiones/nueva';
}

function isTemporaryLiquidityGuidance(item: PlanRecommendation): boolean {
  return item.code === 'RESTORE_CASH_FLOW' && cashFlow.value?.committed_status === 'transient';
}

function improvementTitle(item: PlanRecommendation): string {
  if (isTemporaryLiquidityGuidance(item) && cashFlow.value?.committed_recovery_year) {
    return `Protege tu liquidez hasta ${cashFlow.value.committed_recovery_year}`;
  }
  return item.action_json.title ?? 'Mejora recomendada';
}

function monthlyMoney(value: string | undefined, sign = false): string {
  const amount = Number(value ?? 0) / 12;
  const formatted = formatMoney(amount);
  return sign && amount > 0 ? `+${formatted}` : formatted;
}

function primaryActionLabel(item: PlanRecommendation): string {
  if (item.action_json.scenario_event) return 'Ver impacto';
  if (item.action_json.destination === 'budget') return 'Revisar compromisos';
  if (item.action_json.destination === 'plan_setup') return 'Completar datos';
  return 'Continuar';
}

function scenarioEvent(item: PlanRecommendation): RecommendationEvent | null {
  return (item.action_json.scenario_event as RecommendationEvent | undefined) ?? null;
}

function adjustmentPayload(): { monthly_contribution_delta: string; start_date: string } {
  return {
    monthly_contribution_delta: Number(adjustment.monthlyAmount.replace(',', '.')).toFixed(2),
    start_date: adjustment.startDate,
  };
}

function formatStartDate(value: unknown): string {
  if (typeof value !== 'string' || !value) return '';
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  );
}

async function showImpact(item: PlanRecommendation, reset = true): Promise<void> {
  const event = scenarioEvent(item);
  if (!event) {
    await router.push(destinationPath(item));
    return;
  }
  if (reset) {
    adjustment.monthlyAmount = String(event.monthly_contribution_delta ?? '');
    adjustment.startDate = String(event.start_date ?? '');
  }
  previewingId.value = item.id;
  previewError.value = null;
  actionMessage.value = '';
  try {
    const { data } = await planApi.previewRecommendation(
      item.id,
      store.scenario,
      adjustmentPayload(),
    );
    preview.value = data;
  } catch {
    previewError.value = 'No se pudo recalcular el impacto. Revisa el importe y la fecha.';
  } finally {
    previewingId.value = null;
  }
}

async function incorporate(item: PlanRecommendation): Promise<void> {
  incorporatingId.value = item.id;
  previewError.value = null;
  try {
    const scenario = await store.simulateRecommendation(item.id, adjustmentPayload());
    await router.push({ name: 'plan-decision-detail', params: { id: scenario.id } });
  } catch {
    previewError.value = 'No se pudo crear la decisión con estos valores.';
  } finally {
    incorporatingId.value = null;
  }
}

async function snooze(item: PlanRecommendation): Promise<void> {
  const until = new Date();
  until.setDate(until.getDate() + 30);
  await store.snoozeRecommendation(item.id, until.toISOString().slice(0, 10));
  actionMessage.value = 'La mejora volverá a aparecer dentro de 30 días.';
}

async function dismiss(item: PlanRecommendation): Promise<void> {
  await store.dismissRecommendation(item.id);
  actionMessage.value = 'La mejora se ha descartado.';
}

onMounted(async () => {
  document.title = 'Mejoras de Mi Plan · The Arkenstone';
  await Promise.all([store.fetchPlan(), store.fetchFoundations(), store.fetchRecommendations()]);
  const requested = Number(route.query.action);
  const item = store.recommendations.find((candidate) => candidate.id === requested);
  if (item) void showImpact(item);
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Mejoras">
      <template #meta>
        <span>Qué conviene hacer ahora, explicado con los datos de tu plan</span>
      </template>
    </APageHead>
    <nav class="plan-tabs-bar" aria-label="Secciones de Mi Plan">
      <div class="tabs">
        <RouterLink class="tab" to="/plan">Resumen</RouterLink>
        <RouterLink class="tab on" to="/plan/mejoras" aria-current="page">Mejoras</RouterLink>
        <RouterLink class="tab" to="/plan/decisiones">Decisiones</RouterLink>
      </div>
    </nav>

    <p class="sr-only" aria-live="polite">{{ actionMessage }}</p>
    <AState v-if="store.recommendationsLoading" status="loading">Buscando mejoras...</AState>
    <AState v-else-if="!recommendations.length" status="empty">
      No hay mejoras pendientes. Tu plan se actualizará cuando cambien tus datos.
    </AState>
    <section v-else class="plan-chapter plan-improvements-chapter" aria-label="Mejoras del plan">
      <div class="plan-chapter-label" aria-hidden="true">
        <span>01</span>
        <strong>Prioridad actual</strong>
      </div>
      <div class="plan-improvement-list">
        <article
          v-for="(item, index) in recommendations"
          :key="item.id"
          class="plan-improvement-card"
          :class="{ 'is-muted': item.status !== 'open' }"
        >
          <header class="plan-improvement-heading">
            <p class="eyebrow">Prioridad {{ index + 1 }} · {{ stateLabel(item) }}</p>
            <h2>{{ improvementTitle(item) }}</h2>
            <p class="plan-improvement-lead">{{ item.action_json.summary }}</p>
          </header>

          <template v-if="isTemporaryLiquidityGuidance(item) && cashFlow">
            <div class="plan-cashflow-equation" aria-label="Cómo queda tu margen mensual">
              <div>
                <span>Base recurrente</span>
                <strong class="pos">{{ monthlyMoney(cashFlow.operating_surplus, true) }}</strong>
                <small>después de tus gastos habituales</small>
              </div>
              <div>
                <span>Compromisos temporales</span>
                <strong class="neg"
                  >−{{ monthlyMoney(cashFlow.temporary_commitment_expense) }}</strong
                >
                <small>cuotas que tienen fecha de fin</small>
              </div>
              <div class="is-result">
                <span>Margen durante el esfuerzo</span>
                <strong class="neg">{{ monthlyMoney(cashFlow.committed_surplus) }}</strong>
                <small>se cubre temporalmente con liquidez</small>
              </div>
            </div>

            <div class="plan-recovery-track">
              <span>Ahora</span>
              <i aria-hidden="true"></i>
              <strong>Margen recuperado · {{ cashFlow.committed_recovery_year }}</strong>
            </div>

            <div class="plan-improvement-guidance">
              <div>
                <span>Qué significa</span>
                <p>
                  Tu economía habitual genera margen. El saldo negativo viene de pagos temporales,
                  no de un problema permanente de ingresos y gastos.
                </p>
              </div>
              <div>
                <span>Qué conviene hacer</span>
                <p>
                  Evita añadir nuevas cuotas o aportaciones extra y conserva el fondo de emergencia
                  disponible hasta recuperar el margen.
                </p>
              </div>
            </div>
          </template>

          <dl v-else class="plan-improvement-facts">
            <div>
              <dt>Por qué aparece</dt>
              <dd>{{ item.action_json.reason }}</dd>
            </div>
            <div v-if="item.impact_json.monthly_action">
              <dt>Esfuerzo orientativo</dt>
              <dd>{{ formatMoney(String(item.impact_json.monthly_action)) }} al mes</dd>
            </div>
            <div v-if="item.impact_json.deferred_until">
              <dt>Cuándo empezaría</dt>
              <dd>{{ formatStartDate(item.impact_json.deferred_until) }}</dd>
            </div>
            <div v-if="item.impact_json.funding_source">
              <dt>De dónde sale</dt>
              <dd>{{ item.impact_json.funding_source }}</dd>
            </div>
          </dl>

          <p v-if="item.alternatives_json.length" class="plan-improvement-secondary">
            <span>{{ isTemporaryLiquidityGuidance(item) ? 'Mientras tanto' : 'Otra vía' }}</span>
            {{ item.alternatives_json[0] }}
          </p>
          <div v-if="item.status === 'open'" class="plan-recommendation-actions">
            <AButton
              variant="primary"
              :loading="previewingId === item.id"
              @click="showImpact(item)"
            >
              {{ primaryActionLabel(item) }}
            </AButton>
            <AButton variant="ghost" @click="snooze(item)">Recordármelo después</AButton>
            <AButton variant="ghost" @click="dismiss(item)">Descartar</AButton>
          </div>
        </article>
      </div>
    </section>

    <section v-if="preview" class="sect plan-impact-preview" aria-live="polite">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Antes de decidir</p>
          <h2 class="sect-title">Así cambiaría tu plan</h2>
        </div>
        <AButton variant="ghost" @click="preview = null">Cerrar</AButton>
      </div>
      <div class="plan-impact-adjustment">
        <div>
          <p class="eyebrow">Ajusta la prueba</p>
          <h3>Elige cuánto aportar y desde cuándo</h3>
          <p class="plan-muted">
            Solo cambia esta simulación. No se descontará nada del presupuesto hasta que incorpores
            la decisión.
          </p>
        </div>
        <div class="plan-impact-form">
          <label class="plan-impact-field">
            <span>Aportación adicional al mes</span>
            <span class="plan-money-input">
              <input
                v-model="adjustment.monthlyAmount"
                class="input"
                type="number"
                inputmode="decimal"
                min="0.01"
                step="10"
              />
              <span>€</span>
            </span>
          </label>
          <label class="plan-impact-field">
            <span>Empezar el</span>
            <input
              v-model="adjustment.startDate"
              class="input"
              type="date"
              :min="preview.minimum_start_date"
            />
          </label>
        </div>
        <p v-if="preview.funding_source" class="plan-impact-funding">
          <strong>Origen previsto:</strong> {{ preview.funding_source }}
          <template v-if="preview.available_monthly_margin">
            Margen estimado al empezar:
            {{ formatMoney(preview.available_monthly_margin) }} al mes.
          </template>
        </p>
        <p v-if="preview.is_affordable === false" class="plan-impact-warning" role="alert">
          Esta combinación no cabe en el margen previsto. Puedes verla como simulación, pero no
          incorporarla al presupuesto.
        </p>
        <AButton
          variant="default"
          :disabled="!adjustmentValid"
          :loading="previewingId === preview.recommendation_id"
          @click="
            showImpact(
              recommendations.find((item) => item.id === preview?.recommendation_id)!,
              false,
            )
          "
        >
          Recalcular impacto
        </AButton>
      </div>
      <AState v-if="previewError" status="error">{{ previewError }}</AState>
      <div v-if="preview.after" class="plan-impact-grid">
        <div>
          <span>Fecha sostenible</span>
          <strong>
            {{ preview.before.sustainable_year ?? 'Sin fecha' }} →
            {{ preview.after.sustainable_year ?? 'Sin fecha' }}
          </strong>
        </div>
        <div>
          <span>Renta sostenible</span>
          <strong>{{ formatMoney(preview.after.monthly_sustainable_income) }} / mes</strong>
        </div>
        <div>
          <span>Compromiso</span>
          <strong>{{ formatMoney(preview.monthly_commitment ?? 0) }} / mes</strong>
        </div>
        <div>
          <span>Resultado</span>
          <strong>
            {{
              !previewHasImpact
                ? 'No cambia la trayectoria'
                : preview.reaches_target
                  ? 'Alcanza el objetivo'
                  : 'Mejora, pero no basta'
            }}
          </strong>
        </div>
      </div>
      <div class="plan-recommendation-actions">
        <AButton
          variant="primary"
          :disabled="!adjustmentValid || !previewHasImpact || preview.is_affordable === false"
          :loading="incorporatingId === preview.recommendation_id"
          @click="
            incorporate(recommendations.find((item) => item.id === preview?.recommendation_id)!)
          "
        >
          Incorporar esta decisión
        </AButton>
        <AButton variant="ghost" @click="preview = null">Seguir revisando</AButton>
      </div>
      <p class="plan-muted">
        Esto es una simulación. Tu plan no cambia hasta que incorpores la decisión.
      </p>
    </section>
  </main>
</template>
