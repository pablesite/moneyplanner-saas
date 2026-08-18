<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PortfolioOperationOptions, PortfolioPositionSetupPayload } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  initialPositionId?: number | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-setup-form';

const positionId = ref('');
const trackingStyle = ref<PortfolioPositionSetupPayload['tracking_style']>('value_based');
const historyMode = ref<PortfolioPositionSetupPayload['history_mode']>('reconstructed');
const historyStartDate = ref('');
const containerId = ref('');
const assetClass = ref('');
const saving = ref(false);
const error = ref<string | null>(null);

const positions = computed(() => props.options?.positions ?? []);
const selectedPosition = computed(() =>
  positions.value.find((position) => String(position.id) === positionId.value),
);
const positionOptions = computed<ASelectItem[]>(() =>
  positions.value.map((position) => ({
    value: String(position.id),
    label: `${position.name}${position.setup_confirmed ? '' : ' · Pendiente'}`,
  })),
);
const trackingOptions: ASelectItem[] = [
  { value: 'value_based', label: 'Seguimiento por valor' },
  { value: 'units_based', label: 'Seguimiento por unidades' },
];
const historyOptions: ASelectItem[] = [
  { value: 'reconstructed', label: 'Reconstruir el histórico disponible' },
  { value: 'cutoff', label: 'Empezar desde una fecha de corte' },
];
const containerOptions = computed<ASelectItem[]>(() =>
  (props.options?.containers ?? []).map((row) => ({ value: String(row.id), label: row.name })),
);
const assetClassOptions = computed<ASelectItem[]>(() =>
  (props.options?.asset_classes ?? []).map((row) => ({ value: row.value, label: row.label })),
);

function coverageLabel(status: string): string {
  return (
    {
      complete: 'Completa',
      partial: 'Parcial',
      missing: 'Sin datos',
      value_only: 'Solo valor',
    }[status] ?? status
  );
}

function loadPosition(id: string) {
  const position = positions.value.find((row) => String(row.id) === id);
  if (!position) return;
  trackingStyle.value = position.tracking_style as PortfolioPositionSetupPayload['tracking_style'];
  historyMode.value = position.history_mode;
  historyStartDate.value = position.history_start_date ?? '';
  containerId.value = String(position.container_id);
  assetClass.value = position.asset_class;
  error.value = null;
}

function reset() {
  const requested = props.initialPositionId
    ? positions.value.find((position) => position.id === props.initialPositionId)
    : null;
  const position =
    requested ?? positions.value.find((row) => !row.setup_confirmed) ?? positions.value[0];
  positionId.value = position ? String(position.id) : '';
  loadPosition(positionId.value);
}

watch(positionId, loadPosition);
watch(
  [() => props.open, positions],
  ([open]) => {
    if (open) reset();
  },
  { immediate: true },
);

async function save() {
  if (!selectedPosition.value) return;
  if (historyMode.value === 'cutoff' && !historyStartDate.value) {
    error.value = 'Indica la fecha desde la que comenzará el seguimiento.';
    return;
  }
  saving.value = true;
  error.value = null;
  try {
    await corePortfolioApi.confirmPositionSetup(selectedPosition.value.id, {
      tracking_style: trackingStyle.value,
      history_mode: historyMode.value,
      history_start_date: historyMode.value === 'cutoff' ? historyStartDate.value : null,
      container_id: Number(containerId.value),
      asset_class: assetClass.value,
    });
    emit('saved', `Configuración guardada para ${selectedPosition.value.name}.`);
    emit('close');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <BaseModal
    :open="open"
    title="Configurar posición"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-setup-flow a-pf-item-form" @submit.prevent="save">
      <p>
        Define qué es cada posición y cómo seguirla, sin reescribir sus movimientos históricos.
        Puedes volver aquí y cambiarlo tantas veces como quieras: confirmar no cierra nada.
      </p>
      <div class="ui-item-form-grid">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Posición</span>
          <ASelect v-model="positionId" :options="positionOptions" class="select" />
        </label>
      </div>

      <template v-if="selectedPosition">
        <dl class="a-pf-setup-context">
          <div>
            <dt>Estado contable</dt>
            <dd>{{ selectedPosition.operational ? 'Operativa' : 'Sin cuenta enlazada' }}</dd>
          </div>
          <div>
            <dt>Configuración</dt>
            <dd>{{ selectedPosition.setup_confirmed ? 'Confirmada' : 'Pendiente' }}</dd>
          </div>
        </dl>

        <div class="ui-item-form-grid">
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Contenedor
              <AInfoHint
                label="Dónde está depositada: el bróker, banco, exchange o plataforma. Agrupa y filtra el inventario; no afecta a los cálculos."
              />
            </span>
            <ASelect v-model="containerId" :options="containerOptions" class="select" />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Clase de activo
              <AInfoHint
                label="Qué tipo de activo es. Es lo que alimenta el gráfico de composición de la cartera, así que clasificar bien cambia lo que ese gráfico te cuenta."
              />
            </span>
            <ASelect
              v-model="assetClass"
              :options="assetClassOptions"
              :searchable="false"
              class="select"
            />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Detalle
              <AInfoHint>
                <strong>Por valor:</strong> solo registras cuánto vale en total. Sirve para fondos,
                planes o productos sin precio público. <strong>Por unidades:</strong> registras
                cuántas participaciones tienes, y el valor sale de multiplicarlas por su precio de
                mercado. Requiere que el instrumento tenga precio, pero da precio diario automático
                y coste por operación.
              </AInfoHint>
            </span>
            <ASelect
              v-model="trackingStyle"
              :options="trackingOptions"
              :searchable="false"
              class="select"
            />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Histórico
              <AInfoHint
                label="Reconstruir usa todos los movimientos y valoraciones que ya existen. Empezar desde una fecha de corte ignora lo anterior para el cálculo de rentabilidad, sin borrar nada."
              />
            </span>
            <ASelect
              v-model="historyMode"
              :options="historyOptions"
              :searchable="false"
              class="select"
            />
          </label>
          <label v-if="historyMode === 'cutoff'" class="ui-item-form-field">
            <span class="ui-item-form-label">Fecha de corte</span>
            <input v-model="historyStartDate" class="input" type="date" required />
          </label>
        </div>

        <div class="a-pf-setup-coverage">
          <div>
            <span>Rentabilidad</span>
            <strong>{{ coverageLabel(selectedPosition.performance_coverage.status) }}</strong>
            <small>Flujos y valoraciones disponibles.</small>
          </div>
          <div>
            <span>Detalle de posición</span>
            <strong>{{ coverageLabel(selectedPosition.position_detail_coverage.status) }}</strong>
            <small>Unidades y trazabilidad operativa.</small>
          </div>
        </div>
      </template>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </form>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cancelar</AButton>
        <AButton
          variant="primary"
          type="submit"
          :form="FORM_ID"
          :loading="saving"
          :disabled="!selectedPosition"
        >
          Confirmar configuración
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
