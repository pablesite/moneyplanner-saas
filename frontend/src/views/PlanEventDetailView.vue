<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { APageHead, AState } from '@/domains/ui';
import { PlanEventsTimeline } from '@/domains/plan/components';
import { usePlanStore } from '@/domains/plan/store';
import '@/domains/plan/plan.css';

const route = useRoute();
const store = usePlanStore();
const eventId = computed(() => Number(route.params.id));
const event = computed(() => store.events.find((item) => item.id === eventId.value));
const registration = computed(() => {
  const value = event.value?.actual_impact_json.registration;
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
});
const canEdit = computed(
  () =>
    event.value?.status === 'planned' &&
    (event.value.source_scenario != null || Array.isArray(registration.value?.adopted_lines)),
);

onMounted(async () => {
  document.title = 'Detalle de decisión · The Arkenstone';
  await store.fetchEvents();
});
</script>

<template>
  <main class="page plan-page">
    <APageHead :title="event?.name ?? 'Detalle de decisión'">
      <template #actions>
        <RouterLink
          v-if="canEdit"
          class="btn btn-primary"
          :to="`/plan/decisiones/eventos/${eventId}/editar`"
        >
          Editar decisión
        </RouterLink>
        <RouterLink class="btn btn-ghost" to="/plan/decisiones">Volver a decisiones</RouterLink>
      </template>
    </APageHead>
    <AState v-if="!event" status="loading">Cargando decisión...</AState>
    <PlanEventsTimeline
      v-else
      :events="[event]"
      :saving="store.saving"
      :close-event="store.closePlanEvent"
      :release-event="store.releaseEvent"
      :materialize-event="store.materializeEvent"
      :cancel-event="store.cancelEvent"
    />
  </main>
</template>
