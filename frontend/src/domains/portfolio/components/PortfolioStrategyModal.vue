<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { AllocationStrategy, AllocationTarget, PortfolioOperationOptions } from '../types';

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
const rows = ref<AllocationTarget[]>([]);
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
const total = computed(() =>
  rows.value.reduce((sum, row) => sum + Number(row.target_percent || 0), 0),
);
// La política se guarda entera o no se guarda: una que no suma 100 calcularía el ideal
// sobre una cartera que no es la tuya, y el reparto resultante sería inventado.
const balanced = computed(() => Math.abs(total.value - 100) < 0.001);

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
    const response = await corePortfolioApi.getStrategies(props.ownershipId);
    const current = response.data[0] ?? null;
    strategy.value = current;
    effectiveFrom.value = current?.effective_from ?? new Date().toISOString().slice(0, 10);
    minLineAmount.value = current?.min_line_amount ?? '0';
    rows.value = (current?.targets ?? []).map((row) => ({ ...row }));
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
  saving.value = true;
  error.value = null;
  const payload = {
    ownership_id: props.ownershipId,
    effective_from: effectiveFrom.value,
    min_line_amount: minLineAmount.value || '0',
    targets: rows.value.map((row) => ({
      asset_class: row.asset_class,
      target_percent: String(row.target_percent),
      min_percent: row.min_percent === '' ? null : row.min_percent,
      max_percent: row.max_percent === '' ? null : row.max_percent,
    })),
  };
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
