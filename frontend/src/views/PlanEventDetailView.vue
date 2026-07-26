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

onMounted(async () => {
  document.title = 'Detalle de decisión · The Arkenstone';
  await store.fetchEvents();
});
</script>

<template>
  <main class="page plan-page">
    <APageHead :title="event?.name ?? 'Detalle de decisión'">
      <template #actions>
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
