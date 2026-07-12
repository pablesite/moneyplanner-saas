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
const confirming = ref<'accept' | 'dismiss' | null>(null);
const title = computed(() => props.recommendation.action_json.title ?? 'Siguiente acción');
const summary = computed(() => props.recommendation.action_json.summary ?? 'Acción recomendada');
const reason = computed(() => props.recommendation.action_json.reason ?? null);

const confirmCopy = computed(() =>
  confirming.value === 'accept'
    ? 'Se marcará como aceptada y dejará de aparecer aquí. No cambia el plan por sí sola: usa Simular si quieres ver su impacto antes.'
    : 'Se descartará y dejará de aparecer en Mi Plan.',
);

function confirmAction(): void {
  if (confirming.value === 'accept') emit('accept', props.recommendation.id);
  if (confirming.value === 'dismiss') emit('dismiss', props.recommendation.id);
  confirming.value = null;
}
</script>

<template>
  <!-- Sin eyebrow propio: la sección que la envuelve ya titula "Siguiente acción"
       o "Acción secundaria" y la tarjeta lo duplicaba justo debajo. -->
  <article class="plan-recommendation" :class="{ secondary }">
    <div>
      <h3>{{ title }}</h3>
      <p>{{ summary }}</p>
    </div>
    <div v-if="confirming" class="plan-recommendation-confirm">
      <p>{{ confirmCopy }}</p>
      <div class="plan-recommendation-actions">
        <AButton size="sm" variant="primary" @click="confirmAction">
          {{ confirming === 'accept' ? 'Confirmar aceptación' : 'Confirmar descarte' }}
        </AButton>
        <AButton size="sm" variant="ghost" @click="confirming = null">Cancelar</AButton>
      </div>
    </div>
    <div v-else class="plan-recommendation-actions">
      <AButton size="sm" variant="primary" @click="emit('simulate', recommendation.id)">
        Simular
      </AButton>
      <AButton size="sm" variant="ghost" @click="confirming = 'accept'">Aceptar</AButton>
      <AButton size="sm" variant="ghost" @click="confirming = 'dismiss'">Descartar</AButton>
    </div>
    <button class="plan-details-toggle" type="button" @click="expanded = !expanded">
      {{ expanded ? 'Ocultar explicación' : 'Ver explicación' }}
    </button>
    <!-- Sin la línea "Regla": era el enum interno (p. ej. EMERGENCY_FUND_BELOW_TARGET). -->
    <div v-if="expanded" class="plan-recommendation-detail">
      <p v-if="reason"><strong>Motivo:</strong> {{ reason }}</p>
      <p v-if="recommendation.alternatives_json.length">
        <strong>Alternativas:</strong> {{ recommendation.alternatives_json.join(' · ') }}
      </p>
    </div>
  </article>
</template>
