<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { PlanEvent } from '@/domains/plan/types';
import { planEventStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';

defineProps<{
  events: PlanEvent[];
}>();
</script>

<template>
  <section class="sect plan-events">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Acontecimientos</p>
        <h2 class="sect-title">Incorporados al plan</h2>
      </div>
    </div>

    <div v-if="!events.length" class="plan-empty-inline">
      <p class="plan-muted">Todavía no hay decisiones incorporadas.</p>
      <RouterLink class="btn btn-ghost btn-sm" to="/plan/escenarios">Crear escenario</RouterLink>
    </div>
    <ol v-else class="plan-event-list">
      <li v-for="event in events" :key="event.id">
        <span class="plan-event-date mono">{{ event.planned_date.slice(0, 7) }}</span>
        <div>
          <strong>{{ event.name }}</strong>
          <span>
            {{ scenarioTemplateLabel(event.event_type) }} · {{ planEventStatusLabel(event.status) }}
          </span>
        </div>
      </li>
    </ol>
  </section>
</template>
