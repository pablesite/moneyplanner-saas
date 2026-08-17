<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { AButton, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { dateToIso } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type {
  PortfolioOperationOptions,
  PortfolioOperationPayload,
  PortfolioOperationPreview,
  PortfolioOperationType,
} from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  initialPositionId?: number | null;
  initialType?: PortfolioOperationType;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-operation-form';

const operationOptions: ASelectItem[] = [
  { value: 'buy', label: 'Compra' },
  { value: 'sell', label: 'Venta' },
  { value: 'dividend', label: 'Dividendo' },
  { value: 'interest', label: 'Interés' },
  { value: 'fee', label: 'Comisión' },
  { value: 'valuation', label: 'Actualizar valoración' },
  { value: 'transfer', label: 'Transferencia de efectivo' },
  { value: 'split', label: 'Split / contrasplit' },
  { value: 'position_transfer', label: 'Traspaso entre posiciones' },
  { value: 'identifier_change', label: 'Cambio de identificador' },
  { value: 'adjustment', label: 'Ajuste auditado' },
];

const form = reactive({
  operationType: 'buy' as PortfolioOperationType,
  bookingDate: dateToIso(new Date()),
  positionId: '',
  targetPositionId: '',
  cashAccountId: '',
  targetCashAccountId: '',
  amount: '',
  destinationAmount: '',
  units: '',
  unitPrice: '',
  fee: '',
  currency: 'EUR',
  newIdentifier: '',
  ratioDenominator: '',
  description: '',
  note: '',
});
const preview = ref<PortfolioOperationPreview | null>(null);
const busy = ref(false);
const error = ref<string | null>(null);

const needsPosition = computed(() => form.operationType !== 'transfer');
const needsCash = computed(() =>
  ['buy', 'sell', 'dividend', 'interest', 'fee', 'transfer'].includes(form.operationType),
);
const isTrade = computed(() => ['buy', 'sell'].includes(form.operationType));
const positionOptions = computed<Array<{ value: string; label: string }>>(() =>
  (props.options?.positions ?? []).map((row) => ({
    value: String(row.id),
    label: `${row.name} · ${row.container_name}${row.operational ? '' : ' · revisar'}`,
  })),
);
const selectedPosition = computed(() =>
  props.options?.positions.find((row) => String(row.id) === form.positionId),
);
const cashOptions = computed<Array<{ value: string; label: string }>>(() =>
  (props.options?.cash_accounts ?? [])
    .filter(
      (row) =>
        form.operationType === 'transfer' ||
        row.container_id === selectedPosition.value?.container_id,
    )
    .map((row) => ({
      value: String(row.id),
      label: `${row.name} · ${row.available} ${row.currency}`,
    })),
);
const targetCashOptions = computed<Array<{ value: string; label: string }>>(() =>
  (props.options?.cash_accounts ?? [])
    .filter((row) => String(row.id) !== form.cashAccountId)
    .map((row) => ({ value: String(row.id), label: `${row.name} · ${row.currency}` })),
);
const targetPositionOptions = computed<Array<{ value: string; label: string }>>(() =>
  positionOptions.value.filter((row) => row.value !== form.positionId),
);
const amountLabel = computed(() => {
  if (form.operationType === 'valuation') return 'Valor total';
  if (form.operationType === 'split') return 'Nuevas por cada…';
  if (form.operationType === 'adjustment') return 'Variación de unidades o valor';
  return 'Importe';
});

function reset() {
  form.operationType = props.initialType ?? 'buy';
  form.bookingDate = dateToIso(new Date());
  form.positionId = props.initialPositionId ? String(props.initialPositionId) : '';
  form.targetPositionId = '';
  form.cashAccountId = '';
  form.targetCashAccountId = '';
  form.amount = '';
  form.destinationAmount = '';
  form.units = '';
  form.unitPrice = '';
  form.fee = '';
  form.currency = 'EUR';
  form.newIdentifier = '';
  form.ratioDenominator = '';
  form.description = '';
  form.note = '';
  preview.value = null;
  error.value = null;
}

function payload(): PortfolioOperationPayload {
  return {
    operation_type: form.operationType,
    booking_date: form.bookingDate,
    position_id: form.positionId ? Number(form.positionId) : undefined,
    target_position_id: form.targetPositionId ? Number(form.targetPositionId) : undefined,
    cash_account_id: form.cashAccountId ? Number(form.cashAccountId) : undefined,
    target_cash_account_id: form.targetCashAccountId ? Number(form.targetCashAccountId) : undefined,
    amount: form.amount || undefined,
    destination_amount: form.destinationAmount || undefined,
    units: form.units || undefined,
    unit_price: form.unitPrice || undefined,
    fee: form.fee || undefined,
    currency: form.currency || undefined,
    new_identifier: form.newIdentifier || undefined,
    ratio_denominator: form.ratioDenominator || undefined,
    description: form.description || undefined,
    note: form.note || undefined,
  };
}

async function previewOperation() {
  busy.value = true;
  error.value = null;
  try {
    preview.value = (await corePortfolioApi.previewOperation(payload())).data;
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = false;
  }
}

async function confirmOperation() {
  if (!preview.value) return;
  busy.value = true;
  error.value = null;
  try {
    await corePortfolioApi.confirmOperation({
      ...payload(),
      preview_token: preview.value.preview_token,
    });
    emit('saved', 'Operación contabilizada y cartera recalculada.');
    emit('close');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = false;
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) reset();
  },
);
watch(
  form,
  () => {
    preview.value = null;
  },
  { deep: true },
);
watch([() => form.positionId, () => form.operationType], () => {
  if (!needsCash.value || form.operationType === 'transfer') return;
  if (!cashOptions.value.some((row) => row.value === form.cashAccountId)) {
    form.cashAccountId = String(cashOptions.value[0]?.value ?? '');
  }
});
</script>

<template>
  <BaseModal
    :open="open"
    title="Registrar en cartera"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="ui-item-form-grid" @submit.prevent="previewOperation">
      <label class="ui-item-form-field md:col-span-2">
        <span class="ui-item-form-label">Operación</span>
        <ASelect v-model="form.operationType" :options="operationOptions" :searchable="false" />
      </label>
      <label v-if="needsPosition" class="ui-item-form-field md:col-span-2">
        <span class="ui-item-form-label">Posición</span>
        <ASelect v-model="form.positionId" :options="positionOptions" />
      </label>
      <label v-if="needsCash" class="ui-item-form-field">
        <span class="ui-item-form-label">Efectivo del contenedor</span>
        <ASelect v-model="form.cashAccountId" :options="cashOptions" />
      </label>
      <label v-if="form.operationType === 'transfer'" class="ui-item-form-field">
        <span class="ui-item-form-label">Cuenta destino</span>
        <ASelect v-model="form.targetCashAccountId" :options="targetCashOptions" />
      </label>
      <label
        v-if="form.operationType === 'position_transfer'"
        class="ui-item-form-field md:col-span-2"
      >
        <span class="ui-item-form-label">Posición destino</span>
        <ASelect v-model="form.targetPositionId" :options="targetPositionOptions" />
      </label>
      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Fecha</span>
        <input v-model="form.bookingDate" class="input" type="date" required />
      </label>
      <label v-if="form.operationType !== 'identifier_change'" class="ui-item-form-field">
        <span class="ui-item-form-label">{{ amountLabel }}</span>
        <input v-model="form.amount" class="input" inputmode="decimal" required />
      </label>
      <label v-if="isTrade" class="ui-item-form-field">
        <span class="ui-item-form-label">Unidades (opcional)</span>
        <input v-model="form.units" class="input" inputmode="decimal" />
      </label>
      <label v-if="isTrade" class="ui-item-form-field">
        <span class="ui-item-form-label">Precio unitario (opcional)</span>
        <input v-model="form.unitPrice" class="input" inputmode="decimal" />
      </label>
      <label v-if="isTrade" class="ui-item-form-field">
        <span class="ui-item-form-label">Comisión</span>
        <input v-model="form.fee" class="input" inputmode="decimal" placeholder="0" />
      </label>
      <label v-if="form.operationType === 'split'" class="ui-item-form-field">
        <span class="ui-item-form-label">…cada unidades anteriores</span>
        <input v-model="form.ratioDenominator" class="input" inputmode="decimal" required />
      </label>
      <label
        v-if="form.operationType === 'identifier_change'"
        class="ui-item-form-field md:col-span-2"
      >
        <span class="ui-item-form-label">Nuevo ISIN o ticker</span>
        <input v-model="form.newIdentifier" class="input" required />
      </label>
      <label class="ui-item-form-field md:col-span-2">
        <span class="ui-item-form-label">Concepto</span>
        <input v-model="form.description" class="input" placeholder="Descripción opcional" />
      </label>
      <AState v-if="error" status="error" layout="inline" class="md:col-span-2">
        {{ error }}
      </AState>
      <AState v-if="preview" status="neutral" layout="panel" class="md:col-span-2">
        <strong>Lista para contabilizar</strong>
        <span>
          {{ preview.preview.position?.name ?? 'Movimiento de efectivo' }} ·
          {{ preview.preview.amount || 'sin importe monetario' }}
          <template v-if="preview.preview.fee !== '0'">
            · comisión {{ preview.preview.fee }}</template
          >
        </span>
        <span v-if="preview.preview.cash">
          Disponible antes: {{ preview.preview.cash.available_before }}
          {{ preview.preview.cash.currency }}
        </span>
      </AState>
    </form>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="busy" @click="emit('close')">Cancelar</AButton>
        <AButton v-if="!preview" variant="primary" type="submit" :form="FORM_ID" :loading="busy">
          Previsualizar
        </AButton>
        <AButton v-else variant="primary" :loading="busy" @click="confirmOperation">
          Confirmar y contabilizar
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
