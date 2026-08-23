<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { normalizeNumberInput, toNumber } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import {
  portfolioAssetClassLabels,
  portfolioExposureBucketLabels,
  portfolioExposureBuckets,
} from '../presentation';
import type { PortfolioOperationOptions, PositionHolding } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  initialPositionId?: number | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-holdings-form';

type Row = Omit<PositionHolding, 'id' | 'position_id'> & { id?: number };

const positionId = ref('');
const observedOn = ref('');
const rows = ref<Row[]>([]);
const saved = ref<PositionHolding[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const assetClassOptions = Object.entries(portfolioAssetClassLabels).map(([value, label]) => ({
  value,
  label,
}));
const geographyOptions = [
  { value: '', label: 'Sin geografía declarada' },
  ...portfolioExposureBuckets.geography.map((value) => ({
    value,
    label: portfolioExposureBucketLabels[value] ?? value,
  })),
];
const sectorOptions = [
  { value: '', label: 'Sin sector declarado' },
  ...portfolioExposureBuckets.sector.map((value) => ({
    value,
    label: portfolioExposureBucketLabels[value] ?? value,
  })),
];
const positionOptions = computed(() => [
  { value: '', label: 'Elige una posición…' },
  ...(props.options?.positions ?? [])
    .filter((row) => row.status !== 'archived')
    .map((row) => ({ value: String(row.id), label: `${row.name} · ${row.container_name}` })),
]);
const declared = computed(() =>
  rows.value.reduce((sum, row) => sum + toNumber(row.percent || 0), 0),
);
const overDeclared = computed(() => declared.value > 100.001);

function blankRow(): Row {
  return {
    underlying_name: '',
    underlying_identifier: '',
    asset_class: 'equity',
    geography: '',
    sector: '',
    percent: '',
    observed_on: observedOn.value,
  };
}

function addRow() {
  rows.value.push(blankRow());
}

function removeRow(index: number) {
  rows.value.splice(index, 1);
}

function fill() {
  const snapshot = saved.value.filter((row) => row.observed_on === observedOn.value);
  rows.value = snapshot.map((row) => ({ ...row }));
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
    saved.value = (await corePortfolioApi.getPositionHoldings(Number(positionId.value))).data;
    observedOn.value = saved.value[0]?.observed_on ?? new Date().toISOString().slice(0, 10);
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
    error.value = `Estás declarando el ${declared.value.toFixed(2)}%: no puede pasar de 100.`;
    return;
  }
  if (rows.value.some((row) => !row.underlying_name.trim() || toNumber(row.percent) <= 0)) {
    error.value = 'Cada tenencia necesita un nombre y un peso mayor que cero.';
    return;
  }
  saving.value = true;
  error.value = null;
  try {
    const target = Number(positionId.value);
    const keep = new Set<number>();
    for (const row of rows.value) {
      const payload = {
        position_id: target,
        underlying_name: row.underlying_name.trim(),
        underlying_identifier: row.underlying_identifier.trim(),
        asset_class: row.asset_class,
        geography: row.geography,
        sector: row.sector,
        percent: normalizeNumberInput(row.percent),
        observed_on: observedOn.value,
      };
      if (row.id) {
        await corePortfolioApi.updatePositionHolding(row.id, payload);
        keep.add(row.id);
      } else {
        const created = await corePortfolioApi.createPositionHolding(payload);
        keep.add(created.data.id);
      }
    }
    for (const row of saved.value) {
      if (row.observed_on === observedOn.value && !keep.has(row.id)) {
        await corePortfolioApi.deletePositionHolding(row.id);
      }
    }
    emit('saved', 'Tenencias guardadas. La exposición usa esta ficha desde su fecha.');
    await load();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(positionId, load);
watch(observedOn, fill);
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    error.value = null;
    positionId.value = props.initialPositionId ? String(props.initialPositionId) : '';
    void load();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    title="Tenencias de la posición"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-strategy-flow a-pf-item-form" @submit.prevent="save">
      <p>
        Copia una ficha de composición como una foto fechada. ISIN o ticker permite detectar el
        mismo subyacente aunque otro emisor lo nombre distinto; sin él, la coincidencia solo se hace
        por nombre.
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
          <span class="ui-item-form-label">
            Fecha de la ficha
            <AInfoHint
              label="Las filas de una misma fecha forman una foto. Una ficha posterior no borra el histórico."
            />
          </span>
          <input v-model="observedOn" class="input" type="date" required />
        </label>
      </div>

      <AState v-if="loading" status="loading" layout="inline">Cargando tenencias…</AState>
      <template v-else-if="positionId">
        <div class="a-pf-holdings-grid" role="table" aria-label="Tenencias declaradas">
          <div class="a-pf-holdings-head" role="row">
            <span>Subyacente</span><span>ISIN / ticker</span><span>Clase</span><span>Geografía</span
            ><span>Sector</span><span>Peso</span><span></span>
          </div>
          <div
            v-for="(row, index) in rows"
            :key="row.id ?? index"
            class="a-pf-holdings-row"
            role="row"
          >
            <input v-model="row.underlying_name" class="input" placeholder="Ej. NVIDIA" />
            <input v-model="row.underlying_identifier" class="input" placeholder="ISIN o ticker" />
            <ASelect v-model="row.asset_class" :options="assetClassOptions" :searchable="true" />
            <ASelect v-model="row.geography" :options="geographyOptions" :searchable="true" />
            <ASelect v-model="row.sector" :options="sectorOptions" :searchable="true" />
            <input v-model="row.percent" class="input" inputmode="decimal" placeholder="0" />
            <AButton variant="ghost" size="sm" @click="removeRow(index)">Quitar</AButton>
          </div>
        </div>
        <div class="a-pf-strategy-foot">
          <AButton variant="ghost" size="sm" @click="addRow">Añadir tenencia</AButton>
          <strong :class="overDeclared ? 'is-negative' : 'is-neutral'"
            >Cubierto {{ declared.toFixed(2) }}%</strong
          >
          <small v-if="declared < 99.99"
            >La parte no declarada seguirá marcada como cobertura parcial.</small
          >
        </div>
        <AState v-if="!rows.length" status="empty" layout="inline">
          Esta fecha aún no tiene tenencias. Añade las que publique la ficha; no hace falta inventar
          el resto.
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
          >Guardar ficha</AButton
        >
      </div>
    </template>
  </BaseModal>
</template>
