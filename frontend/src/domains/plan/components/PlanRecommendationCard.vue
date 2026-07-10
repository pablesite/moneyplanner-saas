<script setup lang="ts">
import { computed, ref } from 'vue';
import { AButton } from '@/domains/ui';
import type { PlanRecommendation } from '@/domains/plan/types';

const props = defineProps<{
  recommendation: PlanRecommendation;
  secondary?: boolean;
}>();

const emit = defineEmits<{
  accept: [id: number];
  dismiss: [id: number];
  simulate: [id: number];
}>();

const expanded = ref(false);
const title = computed(() => props.recommendation.action_json.title ?? 'Siguiente acción');
const summary = computed(() => props.recommendation.action_json.summary ?? 'Acción recomendada');
const reason = computed(() => props.recommendation.action_json.reason ?? null);
const rule = computed(() => props.recommendation.action_json.rule ?? props.recommendation.code);
</script>

<template>
  <article class="plan-recommendation" :class="{ secondary }">
    <div>
      <p class="eyebrow">{{ secondary ? 'Acción secundaria' : 'Siguiente acción' }}</p>
      <h3>{{ title }}</h3>
      <p>{{ summary }}</p>
    </div>
    <div class="plan-recommendation-actions">
      <AButton size="sm" variant="primary" @click="emit('simulate', recommendation.id)">
        Simular
      </AButton>
      <AButton size="sm" variant="ghost" @click="emit('accept', recommendation.id)">
        Aceptar
      </AButton>
      <AButton size="sm" variant="ghost" @click="emit('dismiss', recommendation.id)">
        Descartar
      </AButton>
    </div>
    <button class="plan-details-toggle" type="button" @click="expanded = !expanded">
      {{ expanded ? 'Ocultar explicación' : 'Ver explicación' }}
    </button>
    <div v-if="expanded" class="plan-recommendation-detail">
      <p v-if="reason"><strong>Motivo:</strong> {{ reason }}</p>
      <p><strong>Regla:</strong> {{ rule }}</p>
      <p v-if="recommendation.alternatives_json.length">
        <strong>Alternativas:</strong> {{ recommendation.alternatives_json.join(' · ') }}
      </p>
    </div>
  </article>
</template>
