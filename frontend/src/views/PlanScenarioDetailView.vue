<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { ScenarioComparison } from '@/domains/plan/components';
import { usePlan } from '@/domains/plan';
import type { ProjectionScenario } from '@/domains/plan';
import { scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import { formatMoney } from '@/lib/format';
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
        <span v-if="selected">{{ selected.status }}</span>
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
          <article>
            <span>Inicio</span>
            <strong>{{ firstEvent.start_date }}</strong>
          </article>
          <article>
            <span>Pago inicial</span>
            <strong>{{ formatMoney(Number(firstEvent.initial_outflow)) }} €</strong>
          </article>
          <article>
            <span>Activo nuevo</span>
            <strong>{{ formatMoney(Number(firstEvent.new_asset_value)) }} €</strong>
          </article>
          <article>
            <span>Deuda nueva</span>
            <strong>{{ formatMoney(Number(firstEvent.new_debt_principal)) }} €</strong>
          </article>
        </div>
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
