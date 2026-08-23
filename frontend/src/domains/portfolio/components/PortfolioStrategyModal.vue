<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { normalizeNumberInput, toNumber } from '@/lib/format';
import { portfolioAssetClassLabels } from '../presentation';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type {
  AllocationStrategy,
  AllocationStrategyPayload,
  AllocationTarget,
  PortfolioInstrument,
  PortfolioOperationOptions,
} from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  ownershipId: number | null;
  ownershipLabel: string;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-strategy-form';

const strategy = ref<AllocationStrategy | null>(null);
const effectiveFrom = ref('');
const minLineAmount = ref('0');
const benchmarkInstrumentId = ref('');
const instruments = ref<PortfolioInstrument[]>([]);
const rows = ref<AllocationTarget[]>([]);
// Segundo nivel: dentro de una clase, qué parte va a cada producto. Se declara en % de
// la clase, no de la cartera, que es como se piensa ("de mi renta variable, un 60% al
// indexado") y lo único que no se descuadra solo al cambiar el objetivo de la clase.
const positionRows = ref<{ position_id: number | string; target_percent: string }[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

// "Sin clasificar" no es una clase sino una pregunta sin contestar, así que no se le
// puede poner objetivo: hay que clasificar el activo primero.
const classOptions = computed(() =>
  (props.options?.asset_classes ?? [])
    .filter((row) => row.value !== 'unclassified')
    .map((row) => ({ value: row.value, label: row.label })),
);
// `toNumber` y no `Number`: el teclado numérico del iPhone en español escribe coma, y
// `Number("12,5")` es NaN, así que la política no llegaba a sumar 100 y no se dejaba
// guardar sin que nada explicara por qué.
const total = computed(() =>
  rows.value.reduce((sum, row) => sum + toNumber(row.target_percent || 0), 0),
);
// La política se guarda entera o no se guarda: una que no suma 100 calcularía el ideal
// sobre una cartera que no es la tuya, y el reparto resultante sería inventado.
const balanced = computed(() => Math.abs(total.value - 100) < 0.001);

const positionOptions = computed(() =>
  (props.options?.positions ?? [])
    .filter((row) => row.status !== 'archived')
    .map((row) => ({ value: String(row.id), label: row.name })),
);
const benchmarkOptions = computed(() => [
  { value: '', label: 'Sin índice de referencia' },
  ...instruments.value.map((row) => ({
    value: String(row.id),
    label: `${row.name} · ${row.quote_currency}`,
  })),
]);

function positionClass(id: number | string): string {
  const position = (props.options?.positions ?? []).find((row) => String(row.id) === String(id));
  return position ? (portfolioAssetClassLabels[position.asset_class] ?? position.asset_class) : '—';
}

// Dentro de una clase no se puede repartir más del 100%: sería repartir un pastel que no
// existe. Se avisa aquí en vez de dejar que lo rechace el servidor.
const overAllocated = computed(() => {
  const claimed = new Map<string, number>();
  for (const row of positionRows.value) {
    const position = (props.options?.positions ?? []).find(
      (item) => String(item.id) === String(row.position_id),
    );
    if (!position) continue;
    const key = position.asset_class;
    claimed.set(key, (claimed.get(key) ?? 0) + toNumber(row.target_percent || 0));
  }
  return [...claimed.entries()]
    .filter(([, value]) => value > 100.001)
    .map(([key]) => portfolioAssetClassLabels[key] ?? key);
});

function addPositionRow() {
  const used = new Set(positionRows.value.map((row) => String(row.position_id)));
  const next = positionOptions.value.find((option) => !used.has(String(option.value)));
  if (!next) return;
  positionRows.value.push({ position_id: next.value, target_percent: '' });
}
function removePositionRow(index: number) {
  positionRows.value.splice(index, 1);
}

function addRow() {
  const used = new Set(rows.value.map((row) => row.asset_class));
  const next = classOptions.value.find((option) => !used.has(String(option.value)));
  if (!next) return;
  rows.value.push({
    asset_class: String(next.value),
    target_percent: '',
    min_percent: null,
    max_percent: null,
  });
}
function removeRow(index: number) {
  rows.value.splice(index, 1);
}

async function load() {
  if (!props.ownershipId) return;
  loading.value = true;
  error.value = null;
  try {
    const [response, instrumentResponse] = await Promise.all([
      corePortfolioApi.getStrategies(props.ownershipId),
      corePortfolioApi.getInstruments(),
    ]);
    const current = response.data[0] ?? null;
    strategy.value = current;
    instruments.value = instrumentResponse.data;
    effectiveFrom.value = current?.effective_from ?? new Date().toISOString().slice(0, 10);
    minLineAmount.value = current?.min_line_amount ?? '0';
    benchmarkInstrumentId.value = current?.benchmark_instrument_id
      ? String(current.benchmark_instrument_id)
      : '';
    rows.value = (current?.targets ?? [])
      .filter((row) => row.asset_class)
      .map((row) => ({ ...row }));
    positionRows.value = (current?.targets ?? [])
      .filter((row) => row.position_id)
      .map((row) => ({
        position_id: row.position_id!,
        target_percent: String(row.target_percent),
      }));
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!props.ownershipId) return;
  if (!balanced.value) {
    error.value = 'Los objetivos tienen que sumar 100%.';
    return;
  }
  if (overAllocated.value.length) {
    error.value = `Dentro de ${overAllocated.value.join(', ')} estás repartiendo más del 100%.`;
    return;
  }
  saving.value = true;
  error.value = null;
  const payload: AllocationStrategyPayload = {
    ownership_id: props.ownershipId,
    effective_from: effectiveFrom.value,
    min_line_amount: normalizeNumberInput(minLineAmount.value) || '0',
    benchmark_instrument_id: benchmarkInstrumentId.value
      ? Number(benchmarkInstrumentId.value)
      : null,
    targets: rows.value.map((row) => ({
      asset_class: row.asset_class,
      target_percent: normalizeNumberInput(row.target_percent),
      min_percent: normalizeNumberInput(row.min_percent) || null,
      max_percent: normalizeNumberInput(row.max_percent) || null,
    })),
  };
  payload.targets.push(
    ...positionRows.value
      .filter((row) => toNumber(row.target_percent) > 0)
      .map((row) => ({
        position_id: Number(row.position_id),
        target_percent: normalizeNumberInput(row.target_percent),
      })),
  );
  try {
    // Editar la vigente en vez de crear otra versión: una versión nueva se escribe
    // cambiando la fecha, y eso es una decisión distinta que se toma a propósito.
    if (strategy.value && strategy.value.effective_from === effectiveFrom.value) {
      await corePortfolioApi.updateStrategy(strategy.value.id, payload);
    } else {
      await corePortfolioApi.createStrategy(payload);
    }
    emit('saved', `Política guardada para ${props.ownershipLabel}.`);
    emit('close');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(
  [() => props.open, () => props.ownershipId],
  ([open]) => {
    if (open) void load();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="`Política de inversión · ${ownershipLabel}`"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-strategy-flow a-pf-item-form" @submit.prevent="save">
      <p>
        Qué parte de esta cartera quieres en cada clase. La banda es lo que dispara una
        recomendación: dentro de ella el sistema calla, porque si no te pediría rebalancear cada mes
        por ruido de mercado.
      </p>

      <AState v-if="loading" status="loading" layout="inline">Cargando la política…</AState>

      <template v-else>
        <div class="ui-item-form-grid">
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Vigente desde
              <AInfoHint
                label="La política se versiona por fecha. Cambiar esta fecha crea una versión nueva y conserva la anterior, para que una decisión pasada se juzgue contra lo que estaba escrito entonces."
              />
            </span>
            <input v-model="effectiveFrom" class="input" type="date" required />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Línea mínima
              <AInfoHint
                label="Por debajo de este importe no se propone una compra. Sin él el reparto puede proponer operaciones de céntimos, que ningún bróker ejecuta."
              />
            </span>
            <input v-model="minLineAmount" class="input" inputmode="decimal" />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Índice de referencia
              <AInfoHint
                label="Opcional. Hace medibles beta y correlación contra un índice externo. Debe cotizar en la moneda de tu cartera y tener cierres mensuales completos."
              />
            </span>
            <ASelect
              v-model="benchmarkInstrumentId"
              :options="benchmarkOptions"
              :searchable="true"
              class="select"
            />
          </label>
        </div>

        <div class="a-pf-strategy-targets">
          <div class="a-pf-strategy-head">
            <span>Clase</span>
            <span>Objetivo</span>
            <span>Mínimo</span>
            <span>Máximo</span>
            <span></span>
          </div>
          <div v-for="(row, index) in rows" :key="index" class="a-pf-strategy-row">
            <ASelect
              v-model="row.asset_class"
              :options="classOptions"
              :searchable="false"
              class="select"
            />
            <input v-model="row.target_percent" class="input" inputmode="decimal" placeholder="0" />
            <input v-model="row.min_percent" class="input" inputmode="decimal" placeholder="—" />
            <input v-model="row.max_percent" class="input" inputmode="decimal" placeholder="—" />
            <AButton variant="ghost" size="sm" @click="removeRow(index)">Quitar</AButton>
          </div>
          <div class="a-pf-strategy-foot">
            <AButton variant="ghost" size="sm" @click="addRow">Añadir clase</AButton>
            <strong :class="balanced ? 'is-positive' : 'is-negative'">
              Suma {{ total.toFixed(2) }}%
            </strong>
            <small v-if="!balanced">Tiene que sumar 100 para poder guardarse.</small>
          </div>
        </div>

        <div class="a-pf-strategy-targets">
          <h3 class="a-pf-rules-heading">
            Dentro de una clase
            <AInfoHint>
              Opcional. Sin esto, lo que quieres en una clase se reparte entre sus productos según
              lo que ya pesa cada uno. Aquí decides tú: el porcentaje es
              <strong>de la clase</strong>, no de la cartera, así que un 60% del indexado con la
              renta variable al 55% son 33 puntos de cartera. Lo que no repartas se lo queda el
              resto de la clase.
            </AInfoHint>
          </h3>
          <div
            v-for="(row, index) in positionRows"
            :key="`p-${index}`"
            class="a-pf-strategy-row is-position"
          >
            <ASelect
              v-model="row.position_id"
              :options="positionOptions"
              :searchable="true"
              class="select"
            />
            <input v-model="row.target_percent" class="input" inputmode="decimal" placeholder="0" />
            <small class="a-pf-strategy-class">de {{ positionClass(row.position_id) }}</small>
            <AButton variant="ghost" size="sm" @click="removePositionRow(index)">Quitar</AButton>
          </div>
          <div class="a-pf-strategy-foot">
            <AButton variant="ghost" size="sm" @click="addPositionRow">Añadir producto</AButton>
            <strong v-if="overAllocated.length" class="is-negative">
              Te pasas del 100% en {{ overAllocated.join(', ') }}
            </strong>
          </div>
        </div>

        <AState v-if="!rows.length" status="empty" layout="inline">
          Todavía no has escrito ninguna política para este ámbito. Hasta que lo hagas, la cartera
          puede decirte dónde estás pero no si es donde querías estar.
        </AState>
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
          :disabled="!balanced || !rows.length"
        >
          Guardar política
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
