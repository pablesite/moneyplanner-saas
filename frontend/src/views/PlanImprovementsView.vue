<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const preview = ref<ActionImpactPreview | null>(null);
const previewingId = ref<number | null>(null);
const actionMessage = ref('');

const recommendations = computed(() =>
  [...store.recommendations].sort((a, b) => a.priority - b.priority),
);

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

async function showImpact(item: PlanRecommendation): Promise<void> {
  if (!item.action_json.scenario_event) {
    await router.push(destinationPath(item));
    return;
  }
  previewingId.value = item.id;
  actionMessage.value = '';
  try {
    const { data } = await planApi.previewRecommendation(item.id, store.scenario);
    preview.value = data;
  } finally {
    previewingId.value = null;
  }
}

async function incorporate(item: PlanRecommendation): Promise<void> {
  const scenario = await store.simulateRecommendation(item.id);
  await router.push({ name: 'plan-decision-detail', params: { id: scenario.id } });
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
  await Promise.all([store.fetchPlan(), store.fetchRecommendations()]);
  const requested = Number(route.query.action);
  const item = store.recommendations.find((candidate) => candidate.id === requested);
  if (item) void showImpact(item);
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Plan de mejoras">
      <template #meta>
        <span>Acciones ordenadas para reforzar primero lo que desbloquea lo demás</span>
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
    <section v-else class="plan-improvement-list" aria-label="Mejoras del plan">
      <article
        v-for="(item, index) in recommendations"
        :key="item.id"
        class="sect plan-improvement-card"
        :class="{ 'is-muted': item.status !== 'open' }"
      >
        <div class="plan-improvement-order">{{ index + 1 }}</div>
        <div class="plan-improvement-content">
          <div class="plan-improvement-heading">
            <div>
              <p class="eyebrow">{{ stateLabel(item) }}</p>
              <h2 class="sect-title">{{ item.action_json.title }}</h2>
            </div>
            <span class="plan-status-chip" :class="`is-${item.status}`">
              {{ stateLabel(item) }}
            </span>
          </div>
          <p>{{ item.action_json.summary }}</p>
          <dl class="plan-improvement-facts">
            <div>
              <dt>Por qué aparece</dt>
              <dd>{{ item.action_json.reason }}</dd>
            </div>
            <div v-if="item.impact_json.monthly_action">
              <dt>Esfuerzo orientativo</dt>
              <dd>{{ formatMoney(String(item.impact_json.monthly_action)) }} al mes</dd>
            </div>
            <div>
              <dt>Confianza</dt>
              <dd>Estimación basada en los datos actuales</dd>
            </div>
          </dl>
          <p v-if="item.alternatives_json.length" class="plan-muted">
            Alternativa: {{ item.alternatives_json[0] }}
          </p>
          <div v-if="item.status === 'open'" class="plan-recommendation-actions">
            <AButton
              variant="primary"
              :loading="previewingId === item.id"
              @click="showImpact(item)"
            >
              {{ item.action_json.scenario_event ? 'Ver impacto' : 'Completar ahora' }}
            </AButton>
            <AButton variant="ghost" @click="snooze(item)">Ahora no</AButton>
            <AButton variant="ghost" @click="dismiss(item)">No me interesa</AButton>
          </div>
        </div>
      </article>
    </section>

    <section v-if="preview" class="sect plan-impact-preview" aria-live="polite">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Antes de decidir</p>
          <h2 class="sect-title">Así cambiaría tu plan</h2>
        </div>
        <AButton variant="ghost" @click="preview = null">Cerrar</AButton>
      </div>
      <div v-if="preview.after" class="plan-impact-grid">
        <div>
          <span>Fecha estimada</span>
          <strong>
            {{ preview.before.projected_year ?? 'Sin fecha' }} →
            {{ preview.after.projected_year ?? 'Sin fecha' }}
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
          <strong>{{
            preview.reaches_target ? 'Alcanza el objetivo' : 'Mejora, pero no basta'
          }}</strong>
        </div>
      </div>
      <div class="plan-recommendation-actions">
        <AButton
          variant="primary"
          @click="
            incorporate(recommendations.find((item) => item.id === preview?.recommendation_id)!)
          "
        >
          Ajustar e incorporar
        </AButton>
        <AButton variant="ghost" @click="preview = null">Seguir revisando</AButton>
      </div>
      <p class="plan-muted">
        Esto es una simulación. Tu plan no cambia hasta que incorpores la decisión.
      </p>
    </section>
  </main>
</template>
