<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { toApiErrorMessage } from '@/lib/errors';
import { peopleApi } from '@/domains/people/api';
import type { OwnershipRead } from '@/domains/people/types';
import { formatShortDate } from '@/lib/dates';
import { corePortfolioApi } from '../api';
import type {
  PortfolioClassBreakdownRow,
  PortfolioOperationOptions,
  PortfolioPositionSetupPayload,
  PositionOwnershipPeriod,
} from '../types';

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

// Reparto interno. Una cartera de roboadvisor o un fondo mixto no son de una sola clase,
// y contarlos enteros en la dominante desplaza el gráfico tanto como pesen.
const breakdown = ref<PortfolioClassBreakdownRow[]>([]);
const breakdownTotal = computed(() =>
  breakdown.value.reduce((sum, row) => sum + Number(row.percent || 0), 0),
);
const breakdownValid = computed(
  () => breakdown.value.length === 0 || Math.abs(breakdownTotal.value - 100) < 0.001,
);

function addBreakdownRow() {
  const used = new Set(breakdown.value.map((row) => row.asset_class));
  const next = assetClassOptions.value.find((option) => !used.has(String(option.value)));
  breakdown.value.push({
    asset_class: String(next?.value ?? assetClass.value),
    percent: breakdown.value.length ? '' : '100',
  });
}
function removeBreakdownRow(index: number) {
  breakdown.value.splice(index, 1);
}

// Titularidad por tramos. El backend la guarda desde siempre y nunca hubo dónde tocarla,
// así que un activo que se compartió y luego dejó de compartirse no se podía contar.
const ownerships = ref<OwnershipRead[]>([]);
const periods = ref<PositionOwnershipPeriod[]>([]);
const periodOwnershipId = ref('');
const periodStartDate = ref('');
const periodBusy = ref(false);
const periodError = ref<string | null>(null);

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
const assetClassOptions = computed(() =>
  (props.options?.asset_classes ?? []).map((row) => ({ value: row.value, label: row.label })),
);

const ownershipOptions = computed(() =>
  ownerships.value.map((row) => ({
    value: String(row.id),
    label:
      row.kind === 'individual'
        ? (row.member?.name ?? 'Individual')
        : `Compartida · ${row.splits.map((split) => split.member.name).join(' + ')}`,
  })),
);
const sortedPeriods = computed(() =>
  [...periods.value].sort((a, b) => b.start_date.localeCompare(a.start_date)),
);

function ownershipLabel(id: number): string {
  return (
    ownershipOptions.value.find((option) => option.value === String(id))?.label ?? 'Titularidad'
  );
}
function periodRange(period: PositionOwnershipPeriod): string {
  const from = formatShortDate(period.start_date);
  return period.end_date ? `${from} – ${formatShortDate(period.end_date)}` : `desde ${from}`;
}

async function loadOwnershipData(id: string) {
  periodError.value = null;
  periods.value = [];
  if (!id) return;
  try {
    const [periodRows, ownershipRows] = await Promise.all([
      corePortfolioApi.getOwnershipPeriods(Number(id)),
      ownerships.value.length ? null : peopleApi.getOwnerships(),
    ]);
    periods.value = periodRows.data;
    if (ownershipRows) ownerships.value = ownershipRows.data;
  } catch (caught: unknown) {
    periodError.value = toApiErrorMessage(caught);
  }
}

async function addPeriod() {
  const position = selectedPosition.value;
  const ownership = ownerships.value.find((row) => String(row.id) === periodOwnershipId.value);
  if (!position || !ownership || !periodStartDate.value) {
    periodError.value = 'Indica desde cuándo manda esta titularidad y cuál es.';
    return;
  }
  // Los tramos guardan el reparto explícito, así que se copia el de la titularidad
  // elegida: quien la define es Personas, aquí solo se dice desde cuándo aplica.
  const shares =
    ownership.kind === 'individual' && ownership.member
      ? [{ member_id: ownership.member.id, percent: '100' }]
      : ownership.splits.map((split) => ({
          member_id: split.member.id,
          percent: split.percent,
        }));
  periodBusy.value = true;
  periodError.value = null;
  try {
    await corePortfolioApi.createOwnershipPeriod({
      position_id: position.id,
      ownership_id: ownership.id,
      start_date: periodStartDate.value,
      shares,
    });
    periodOwnershipId.value = '';
    periodStartDate.value = '';
    await loadOwnershipData(positionId.value);
    emit('saved', `Titularidad actualizada en ${position.name}.`);
  } catch (caught: unknown) {
    periodError.value = toApiErrorMessage(caught);
  } finally {
    periodBusy.value = false;
  }
}

async function removePeriod(id: number) {
  periodBusy.value = true;
  periodError.value = null;
  try {
    await corePortfolioApi.deleteOwnershipPeriod(id);
    await loadOwnershipData(positionId.value);
  } catch (caught: unknown) {
    periodError.value = toApiErrorMessage(caught);
  } finally {
    periodBusy.value = false;
  }
}

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
  breakdown.value = position.class_breakdown.map((row) => ({ ...row }));
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

watch(positionId, (id) => {
  loadPosition(id);
  void loadOwnershipData(id);
});
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
  if (!breakdownValid.value) {
    error.value = 'El reparto interno debe sumar 100%.';
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
      class_breakdown: breakdown.value
        .filter((row) => row.percent !== '')
        .map((row) => ({ asset_class: row.asset_class, percent: String(row.percent) })),
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
        <!-- Antes había dos filas de estado siempre visibles: una decía "Confirmada",
             que habla del formulario y no de la posición, y la otra decía "Operativa"
             cuando todo iba bien, que es decoración. Solo se avisa de lo accionable. -->
        <AState v-if="!selectedPosition.operational" status="neutral" layout="inline">
          Esta posición no tiene cuenta contable enlazada, así que no se le pueden registrar compras
          ni ventas desde Contabilidad. Su valor sí cuenta.
        </AState>

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
          <label class="ui-item-form-field a-pf-breakdown-toggle is-wide">
            <span class="ui-item-form-label">
              Reparto interno
              <AInfoHint
                label="Para posiciones que no son de una sola clase: una cartera de roboadvisor o un fondo mixto. Sin esto se cuentan enteras en la clase dominante y el gráfico de composición se desplaza tanto como pese la posición. Solo afecta a la composición; el resto de cálculos usa la clase de arriba."
              />
            </span>
            <div class="a-pf-breakdown">
              <div v-for="(row, index) in breakdown" :key="index" class="a-pf-breakdown-row">
                <ASelect
                  v-model="row.asset_class"
                  :options="assetClassOptions"
                  :searchable="false"
                  class="select"
                />
                <input v-model="row.percent" class="input" inputmode="decimal" placeholder="0" />
                <span>%</span>
                <AButton variant="ghost" size="sm" @click="removeBreakdownRow(index)">
                  Quitar
                </AButton>
              </div>
              <div class="a-pf-breakdown-foot">
                <AButton variant="ghost" size="sm" @click="addBreakdownRow">Añadir clase</AButton>
                <small v-if="breakdown.length" :class="{ 'is-negative': !breakdownValid }">
                  Suma {{ breakdownTotal }}%
                </small>
                <small v-else>Sin reparto: cuenta entera en su clase.</small>
              </div>
            </div>
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
        </div>

        <!-- El histórico se decide una vez, al incorporar la posición, y no se vuelve a
             mirar. Ocupaba sitio permanente entre los campos que sí se tocan. -->
        <details class="a-pf-setup-advanced" :open="historyMode === 'cutoff'">
          <summary>Histórico de rentabilidad</summary>
          <div class="ui-item-form-grid">
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Desde cuándo cuenta
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
        </details>

        <!-- La titularidad no se edita: se escriben tramos. Por eso aquí solo se dice
             desde cuándo manda cuál, y el tramo anterior se cierra la víspera. -->
        <section class="a-pf-ownership">
          <h3>
            Titularidad
            <AInfoHint
              label="De quién es la posición y desde cuándo. Si cambió con el tiempo —empezó compartida y luego dejó de serlo— se añade un tramo nuevo desde la fecha del cambio, sin reescribir el pasado. Las titularidades se definen en Personas."
            />
          </h3>
          <ul v-if="sortedPeriods.length" class="a-pf-ownership-list">
            <li v-for="period in sortedPeriods" :key="period.id">
              <span>{{ ownershipLabel(period.ownership_id) }}</span>
              <small>{{ periodRange(period) }}</small>
              <AButton
                variant="ghost"
                size="sm"
                :disabled="periodBusy"
                @click="removePeriod(period.id)"
              >
                Deshacer
              </AButton>
            </li>
          </ul>
          <AState v-else status="empty" layout="inline">
            Sin tramos registrados: la posición hereda la titularidad del activo en Patrimonio.
          </AState>

          <div class="a-pf-ownership-add">
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">Pasa a ser</span>
              <ASelect
                v-model="periodOwnershipId"
                :options="ownershipOptions"
                :searchable="false"
                class="select"
              />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">Desde</span>
              <input v-model="periodStartDate" class="input" type="date" />
            </label>
            <AButton
              variant="ghost"
              :loading="periodBusy"
              :disabled="!periodOwnershipId || !periodStartDate"
              @click="addPeriod"
            >
              Añadir tramo
            </AButton>
          </div>
          <AState v-if="periodError" status="error" layout="inline">{{ periodError }}</AState>
        </section>

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
