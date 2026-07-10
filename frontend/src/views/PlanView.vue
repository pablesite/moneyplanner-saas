<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, AMetaPill, type ASelectItem } from '@/domains/ui';
import {
  DataQualityCard,
  NetWorthTrajectoryChart,
  PlanFoundations,
  PlanHero,
  PlanEventsTimeline,
  ProductiveCapitalProgress,
  ProjectedDateCard,
  ProjectionAssumptionsDrawer,
  PlanRecommendationCard,
} from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import type { ProjectionScenario } from '@/domains/plan';
import '@/domains/plan/plan.css';

const { store, loading, error, plan, planMissing, projection, netWorthTimeline, scenario } =
  usePlan();
const router = useRouter();
const assumptionsOpen = ref(false);

const scenarioOptions: ASelectItem[] = [
  { value: 'prudent', label: 'Prudente' },
  { value: 'expected', label: 'Esperado' },
  { value: 'favorable', label: 'Favorable' },
];

const activeScenario = computed({
  get: () => scenario.value,
  set: (value) => {
    void store.fetchProjection(value as ProjectionScenario);
  },
});

const visibleRecommendations = computed(() =>
  store.recommendations.filter((item) => item.status === 'open').slice(0, 2),
);

async function simulateRecommendation(id: number): Promise<void> {
  const scenario = await store.simulateRecommendation(id);
  await router.push({ name: 'plan-scenario-detail', params: { id: scenario.id } });
}

onMounted(() => {
  void store.loadDashboard();
});
</script>

<template>
  <main class="page plan-page">
    <APageHead title="Mi Plan" eyebrow="Planificación financiera">
      <template #meta>
        <span>Motor Core</span><span class="dot"></span><span>Estimaciones deterministas</span>
      </template>
      <template #actions>
        <RouterLink class="btn btn-ghost" to="/plan/escenarios">Escenarios</RouterLink>
        <RouterLink class="btn btn-ghost" to="/plan/setup">Editar plan</RouterLink>
        <AButton
          v-if="projection"
          variant="primary"
          :loading="store.recalculating"
          @click="store.recalculate()"
        >
          Recalcular
        </AButton>
      </template>
    </APageHead>

    <AState v-if="loading && !projection && !planMissing" status="loading">
      Cargando Mi Plan...
    </AState>

    <AState v-else-if="error" status="error">
      {{ error }}
    </AState>

    <AState v-else-if="planMissing || !plan" status="empty">
      <div class="plan-empty">
        <p class="eyebrow">Primer paso</p>
        <h2>Crea tu plan financiero</h2>
        <p>
          Define fecha objetivo, nivel de vida y adultos del plan para generar la primera
          proyección.
        </p>
        <RouterLink class="btn btn-primary" to="/plan/setup">Configurar Mi Plan</RouterLink>
      </div>
    </AState>

    <template v-else-if="projection">
      <div class="plan-toolbar">
        <AMetaPill>Objetivo {{ plan.target_date.slice(0, 4) }}</AMetaPill>
        <label class="context-field">
          <span>Escenario</span>
          <ASelect
            v-model="activeScenario"
            :options="scenarioOptions"
            class="filter-ctrl"
            :searchable="false"
          />
        </label>
        <AButton variant="ghost" @click="assumptionsOpen = true">Hipótesis</AButton>
      </div>

      <PlanHero :plan="plan" :projection="projection" />

      <div class="plan-main-grid">
        <ProductiveCapitalProgress :projection="projection" />
        <ProjectedDateCard :projection="projection" />
      </div>

      <NetWorthTrajectoryChart :timeline="netWorthTimeline" :projection="projection" />

      <div class="plan-side-grid">
        <DataQualityCard :projection="projection" />
        <PlanFoundations :foundations="store.foundations" />
      </div>

      <section v-if="visibleRecommendations.length" class="sect plan-recommendations">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Recomendaciones</p>
            <h2 class="sect-title">Siguiente acción</h2>
            <p class="sect-sub">
              Máximo una acción principal y una secundaria, generadas por reglas.
            </p>
          </div>
        </div>
        <div class="plan-recommendation-list">
          <PlanRecommendationCard
            v-for="(recommendation, index) in visibleRecommendations"
            :key="recommendation.id"
            :recommendation="recommendation"
            :secondary="index > 0"
            @accept="store.acceptRecommendation"
            @dismiss="store.dismissRecommendation"
            @simulate="simulateRecommendation"
          />
        </div>
      </section>

      <PlanEventsTimeline :events="store.events" />

      <ProjectionAssumptionsDrawer
        :open="assumptionsOpen"
        :assumptions="projection.assumptions"
        @close="assumptionsOpen = false"
      />
    </template>
  </main>
</template>
