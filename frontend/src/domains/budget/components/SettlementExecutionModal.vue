<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import type { SettlementCandidate } from '../types';
import type { SettlementPage } from '../settlementPresentation';

const props = defineProps<{
  open: boolean;
  recommendation: SettlementPage['recommendations'][number] | null;
  candidates: SettlementCandidate[];
  loadingCandidates?: boolean;
  busy?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  close: [];
  apply: [payload: { amount?: string; executionDate: string }];
  accept: [];
  cancel: [];
  reverse: [payload: { amount?: string; executionDate: string }];
  reconcile: [transactionId: number];
}>();

const executionDate = ref(new Date().toISOString().slice(0, 10));
const amount = ref('');
const candidateId = ref('');

watch(
  () => [props.open, props.recommendation?.id],
  ([open]) => {
    if (!open) return;
    executionDate.value = new Date().toISOString().slice(0, 10);
    amount.value = props.recommendation?.remaining_amount ?? props.recommendation?.amount ?? '';
    candidateId.value = '';
  },
);

const candidateOptions = computed<ASelectItem[]>(() =>
  props.candidates.map((candidate) => ({
    value: String(candidate.transaction_id),
    label: `${candidate.booking_date} · ${candidate.description} · ${candidate.amount} ${candidate.currency}`,
  })),
);

const isApplied = computed(() => props.recommendation?.status === 'applied');
const canCancel = computed(
  () =>
    props.recommendation?.status !== 'cancelled' &&
    (props.recommendation?.appliedAmountNumber ?? 0) === 0,
);

function optionalAmount(): string | undefined {
  const value = amount.value.trim();
  return value === props.recommendation?.remaining_amount || value === props.recommendation?.amount
    ? undefined
    : value;
}
</script>

<template>
  <BaseModal
    :open="open"
    title="Gestionar transferencia"
    variant="sheet"
    panel-class="dir-a mc-settlement-execution-modal"
    @close="emit('close')"
  >
    <div v-if="recommendation" class="mc-settlement-execution-body">
      <div class="mc-settlement-execution-route">
        <span>{{ recommendation.statusLabel }}</span>
        <strong>{{ recommendation.sourceName }} → {{ recommendation.destinationName }}</strong>
        <p>
          {{ recommendation.remaining_amount ?? recommendation.amount }}
          {{ recommendation.currency }} pendientes de {{ recommendation.amount }}
          {{ recommendation.currency }}
        </p>
      </div>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>

      <template v-if="recommendation.status !== 'cancelled' && !isApplied">
        <div class="mc-settlement-execution-fields">
          <label>
            <span>Fecha contable</span>
            <input v-model="executionDate" class="input" type="date" :disabled="busy" />
          </label>
          <label>
            <span>Importe a registrar</span>
            <input
              v-model="amount"
              class="input"
              type="number"
              min="0.01"
              step="0.01"
              :max="recommendation.remaining_amount ?? recommendation.amount"
              :disabled="busy"
            />
          </label>
        </div>
        <p class="mc-settlement-execution-note">
          Esto crea una transferencia contable. No ordena una transferencia bancaria.
        </p>
        <AButton
          variant="primary"
          :loading="busy"
          block
          @click="emit('apply', { amount: optionalAmount(), executionDate })"
        >
          Registrar transferencia
        </AButton>
      </template>

      <div v-if="recommendation.transactions.length" class="mc-settlement-execution-history">
        <strong>Movimientos vinculados</strong>
        <slot name="transactions" :transactions="recommendation.transactions" />
      </div>

      <details v-if="recommendation.status !== 'cancelled' && !isApplied">
        <summary>Ya hice la transferencia</summary>
        <AState v-if="loadingCandidates" status="loading" layout="inline">
          Buscando movimientos compatibles…
        </AState>
        <AState v-else-if="!candidates.length" status="empty" layout="inline">
          No hay transferencias compatibles para conciliar.
        </AState>
        <div v-else class="mc-settlement-reconcile">
          <ASelect
            v-model="candidateId"
            :options="candidateOptions"
            placeholder="Elige un movimiento"
            aria-label="Movimiento para conciliar"
          />
          <AButton :disabled="!candidateId || busy" @click="emit('reconcile', Number(candidateId))">
            Vincular movimiento
          </AButton>
        </div>
      </details>

      <div class="mc-settlement-execution-secondary">
        <AButton
          v-if="recommendation.status === 'recommended'"
          variant="ghost"
          :disabled="busy"
          @click="emit('accept')"
        >
          Marcar como aceptada
        </AButton>
        <AButton v-if="canCancel" variant="ghost" :disabled="busy" @click="emit('cancel')">
          Cancelar recomendación
        </AButton>
        <AButton
          v-if="recommendation.appliedAmountNumber > 0"
          variant="ghost"
          :disabled="busy"
          @click="emit('reverse', { executionDate })"
        >
          Registrar reverso
        </AButton>
      </div>
    </div>
  </BaseModal>
</template>
