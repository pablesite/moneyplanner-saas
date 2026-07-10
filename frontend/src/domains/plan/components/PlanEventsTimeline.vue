<script setup lang="ts">
import type { PlanEvent } from '@/domains/plan/types';
import { scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';

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

    <p v-if="!events.length" class="plan-muted">Todavía no hay decisiones incorporadas.</p>
    <ol v-else class="plan-event-list">
      <li v-for="event in events" :key="event.id">
        <span class="plan-event-date mono">{{ event.planned_date.slice(0, 7) }}</span>
        <div>
          <strong>{{ event.name }}</strong>
          <span>{{ scenarioTemplateLabel(event.event_type) }} · {{ event.status }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>
