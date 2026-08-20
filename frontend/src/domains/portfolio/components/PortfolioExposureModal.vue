<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { normalizeNumberInput, toNumber } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import {
  portfolioExposureBucketLabels,
  portfolioExposureBuckets,
  portfolioExposureDimensionLabels,
} from '../presentation';
import type { PortfolioOperationOptions, PositionExposure } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  initialPositionId?: number | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-exposure-form';

type Row = { id?: number; bucket: string; percent: string };

const positionId = ref('');
const dimension = ref<'geography' | 'sector' | 'vehicle'>('geography');
const observedOn = ref('');
const rows = ref<Row[]>([]);
const saved = ref<PositionExposure[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const positionOptions = computed(() => [
  { value: '', label: 'Elige una posición…' },
  ...(props.options?.positions ?? [])
    .filter((row) => row.status !== 'archived')
    .map((row) => ({ value: String(row.id), label: `${row.name} · ${row.container_name}` })),
]);
const dimensionOptions = Object.entries(portfolioExposureDimensionLabels).map(([value, label]) => ({
  value,
  label,
}));
const bucketOptions = computed(() =>
  (portfolioExposureBuckets[dimension.value] ?? []).map((bucket) => ({
    value: bucket,
    label: portfolioExposureBucketLabels[bucket] ?? bucket,
  })),
);
const declared = computed(() =>
  rows.value.reduce((sum, row) => sum + toNumber(row.percent || 0), 0),
);
// Menos de 100 vale y es lo normal —una ficha reparte el 95% y agrupa el resto—, pero
// más de 100 sería declarar más cartera de la que hay.
const overDeclared = computed(() => declared.value > 100.001);

function addRow() {
  const used = new Set(rows.value.map((row) => row.bucket));
  const next = bucketOptions.value.find((option) => !used.has(option.value));
  if (!next) return;
  rows.value.push({ bucket: next.value, percent: '' });
}
function removeRow(index: number) {
  rows.value.splice(index, 1);
}

function fill() {
  const current = saved.value.filter((row) => row.dimension === dimension.value);
  rows.value = current.map((row) => ({ id: row.id, bucket: row.bucket, percent: row.percent }));
  observedOn.value = current[0]?.observed_on ?? new Date().toISOString().slice(0, 10);
}

async function load() {
  if (!positionId.value) {
    saved.value = [];
    rows.value = [];
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    saved.value = (await corePortfolioApi.getPositionExposures(Number(positionId.value))).data;
    fill();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!positionId.value) {
    error.value = 'Elige la posición.';
    return;
  }
  if (overDeclared.value) {
    error.value = `Estás repartiendo el ${declared.value.toFixed(2)}%: no puede pasar de 100.`;
    return;
  }
  saving.value = true;
  error.value = null;
  try {
    const target = Number(positionId.value);
    const keep = new Set<number>();
    // Se borra primero lo que sobra y luego se escribe: el reparto de una dimensión se
    // sustituye entero, que es como llega el dato de la ficha.
    for (const row of rows.value) {
      if (toNumber(row.percent) <= 0) continue;
      const payload = {
        position_id: target,
        dimension: dimension.value,
        bucket: row.bucket,
        percent: normalizeNumberInput(row.percent),
        observed_on: observedOn.value,
      };
      if (row.id) {
        await corePortfolioApi.updatePositionExposure(row.id, payload);
        keep.add(row.id);
      } else {
        const created = await corePortfolioApi.createPositionExposure(payload);
        keep.add(created.data.id);
      }
    }
    for (const row of saved.value) {
      if (row.dimension === dimension.value && !keep.has(row.id)) {
        await corePortfolioApi.deletePositionExposure(row.id);
      }
    }
    emit('saved', 'Exposición guardada.');
    await load();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(positionId, load);
watch(dimension, fill);
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    error.value = null;
    dimension.value = 'geography';
    positionId.value = props.initialPositionId ? String(props.initialPositionId) : '';
    void load();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    title="Exposición de la posición"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-strategy-flow a-pf-item-form" @submit.prevent="save">
      <p>
        Qué hay dentro de este producto. El dato está en su ficha y cambia despacio: se copia una
        vez y se revisa cada trimestre. Sirve para saber de verdad lo diversificada que está la
        cartera, y para ver que dos productos que compraste como cosas distintas son casi el mismo
        riesgo.
      </p>

      <div class="ui-item-form-grid">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Posición</span>
          <ASelect
            v-model="positionId"
            :options="positionOptions"
            :searchable="true"
            class="select"
          />
        </label>
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Dimensión</span>
          <ASelect v-model="dimension" :options="dimensionOptions" :searchable="false" />
        </label>
      </div>

      <AState v-if="loading" status="loading" layout="inline">Cargando la exposición…</AState>

      <template v-else-if="positionId">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">
            Fecha de la ficha
            <AInfoHint
              label="De cuándo es el dato que estás copiando. Una exposición sin fecha envejece sin avisar, y una desactualizada engaña más que no tenerla."
            />
          </span>
          <input v-model="observedOn" class="input" type="date" required />
        </label>

        <div class="a-pf-strategy-targets">
          <div v-for="(row, index) in rows" :key="index" class="a-pf-strategy-row is-position">
            <ASelect
              v-model="row.bucket"
              :options="bucketOptions"
              :searchable="false"
              class="select"
            />
            <input v-model="row.percent" class="input" inputmode="decimal" placeholder="0" />
            <small class="a-pf-strategy-class">% del producto</small>
            <AButton variant="ghost" size="sm" @click="removeRow(index)">Quitar</AButton>
          </div>
          <div class="a-pf-strategy-foot">
            <AButton variant="ghost" size="sm" @click="addRow">Añadir</AButton>
            <strong :class="overDeclared ? 'is-negative' : 'is-neutral'">
              Declarado {{ declared.toFixed(2) }}%
            </strong>
            <small v-if="!overDeclared && declared < 99.99">
              Lo que no declares queda como sin cubrir, no se reparte solo.
            </small>
          </div>
        </div>

        <AState v-if="!rows.length" status="empty" layout="inline">
          Este producto no tiene declarada su {{ portfolioExposureDimensionLabels[dimension] }}.
          Hasta que la tenga, no cuenta en el desglose de la cartera.
        </AState>
      </template>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </form>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cerrar</AButton>
        <AButton
          variant="primary"
          type="submit"
          :form="FORM_ID"
          :loading="saving"
          :disabled="!positionId || overDeclared"
        >
          Guardar
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
