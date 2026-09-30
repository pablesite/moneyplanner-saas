<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, ASectHead, ASelect, AState, BaseModal } from '@/domains/ui';
import { currencySymbol, formatAmount, toNumber } from '@/lib/format';
import { formatShortDate } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PositionIncomeLinks, PositionIncomeLinkType, PositionIncomeMovement } from '../types';

const props = defineProps<{
  open: boolean;
  positionId: number | null;
  positionName?: string;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();

const links = ref<PositionIncomeLinks>({ linked: [], candidates: [] });
const selected = ref<number[]>([]);
const includeAll = ref(false);
const operationType = ref<PositionIncomeLinkType>('dividend');
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const typeOptions = [
  { value: 'dividend', label: 'Dividendo' },
  { value: 'interest', label: 'Interés' },
];
const typeLabels: Record<PositionIncomeLinkType, string> = {
  dividend: 'Dividendo',
  interest: 'Interés',
};

const linkedTotal = computed(() =>
  links.value.linked.reduce((sum, row) => sum + toNumber(row.amount), 0),
);

function amount(row: PositionIncomeMovement): string {
  return `${formatAmount(row.amount, { maxDecimals: 2 })} ${currencySymbol(row.currency)}`;
}

async function load() {
  if (!props.positionId) return;
  loading.value = true;
  error.value = null;
  try {
    links.value = (
      await corePortfolioApi.getPositionIncomeLinks(props.positionId, includeAll.value)
    ).data;
    const available = new Set(links.value.candidates.map((row) => row.transaction_id));
    selected.value = selected.value.filter((id) => available.has(id));
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    loading.value = false;
  }
}

async function link() {
  if (!props.positionId || !selected.value.length) return;
  saving.value = true;
  error.value = null;
  try {
    const count = selected.value.length;
    await corePortfolioApi.linkPositionIncome(
      props.positionId,
      selected.value,
      operationType.value,
    );
    selected.value = [];
    await load();
    emit('saved', `${count} ${count === 1 ? 'ingreso vinculado' : 'ingresos vinculados'}.`);
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

async function unlink(row: PositionIncomeMovement) {
  if (!props.positionId) return;
  saving.value = true;
  error.value = null;
  try {
    await corePortfolioApi.unlinkPositionIncome(props.positionId, row.transaction_id);
    await load();
    emit('saved', 'Ingreso desvinculado. El movimiento sigue en Contabilidad.');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(includeAll, load);
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    selected.value = [];
    includeAll.value = false;
    operationType.value = 'dividend';
    void load();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="positionName ? `Rentas de ${positionName}` : 'Rentas de la posición'"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <div class="a-pf-strategy-flow">
      <p>
        Dividendos e intereses que esta posición pagó en una cuenta fuera de la cartera. Vincularlos
        no crea movimientos: solo le dice a la cartera qué posición generó ese dinero, para que
        cuente en su rentabilidad.
      </p>

      <AState v-if="loading" status="loading" layout="inline">Cargando ingresos…</AState>
      <template v-else>
        <section>
          <ASectHead
            title="Vinculados"
            :subtitle="
              links.linked.length
                ? `${links.linked.length} · ${formatAmount(linkedTotal, { maxDecimals: 2 })} en total`
                : undefined
            "
          />
          <AState v-if="!links.linked.length" status="empty" layout="inline">
            Todavía no hay rentas vinculadas a esta posición.
          </AState>
          <ul v-else class="a-pf-income-list">
            <li v-for="row in links.linked" :key="row.transaction_id" class="a-pf-income-row">
              <span class="a-pf-income-main">
                <strong>{{ row.description }}</strong>
                <small>
                  {{ formatShortDate(row.booking_date) }} · {{ row.account_name }} ·
                  {{ row.operation_type ? typeLabels[row.operation_type] : '' }}
                </small>
              </span>
              <span class="mono">{{ amount(row) }}</span>
              <AButton variant="ghost" size="sm" :disabled="saving" @click="unlink(row)">
                Quitar
              </AButton>
            </li>
          </ul>
        </section>

        <section>
          <ASectHead title="Sin vincular">
            <template #actions>
              <label class="checkbox-row">
                <input v-model="includeAll" type="checkbox" />
                <span>Todos los ingresos</span>
              </label>
            </template>
          </ASectHead>
          <AState v-if="!links.candidates.length" status="empty" layout="inline">
            {{
              includeAll
                ? 'No quedan ingresos por vincular desde la apertura de la posición.'
                : 'No hay rentas pasivas por vincular. Marca «Todos los ingresos» si la anotaste con otra categoría.'
            }}
          </AState>
          <ul v-else class="a-pf-income-list">
            <li v-for="row in links.candidates" :key="row.transaction_id" class="a-pf-income-row">
              <label class="a-pf-income-main a-pf-income-pick">
                <input v-model="selected" type="checkbox" :value="row.transaction_id" />
                <span>
                  <strong>{{ row.description }}</strong>
                  <small>{{ formatShortDate(row.booking_date) }} · {{ row.account_name }}</small>
                </span>
              </label>
              <span class="mono">{{ amount(row) }}</span>
            </li>
          </ul>
        </section>
      </template>
      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </div>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cerrar</AButton>
        <ASelect
          v-model="operationType"
          :options="typeOptions"
          :searchable="false"
          aria-label="Tipo de renta"
        />
        <AButton variant="primary" :loading="saving" :disabled="!selected.length" @click="link">
          Vincular{{ selected.length ? ` (${selected.length})` : '' }}
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
