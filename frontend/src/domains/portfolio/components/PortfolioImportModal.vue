<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PortfolioImportBatch } from '../types';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const file = ref<File | null>(null);
const batch = ref<PortfolioImportBatch | null>(null);
const mapping = ref<Record<string, string>>({});
const busy = ref(false);
const error = ref<string | null>(null);
const mappingFields = [
  { key: 'operation_type', label: 'Tipo de operación', required: true },
  { key: 'booking_date', label: 'Fecha', required: true },
  { key: 'position_id', label: 'ID de posición', required: true },
  { key: 'cash_account_id', label: 'ID de efectivo', required: false },
  { key: 'amount', label: 'Importe', required: true },
  { key: 'units', label: 'Unidades', required: false },
  { key: 'unit_price', label: 'Precio unitario', required: false },
  { key: 'fee', label: 'Comisión', required: false },
  { key: 'currency', label: 'Divisa', required: false },
  { key: 'external_id', label: 'Identificador externo', required: false },
];
const headerOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'No importar' },
  ...(batch.value?.headers ?? []).map((header) => ({ value: header, label: header })),
]);
const validRows = computed(() => batch.value?.rows.filter((row) => row.status === 'valid') ?? []);
const invalidRows = computed(
  () => batch.value?.rows.filter((row) => ['error', 'duplicate'].includes(row.status)) ?? [],
);

function reset() {
  file.value = null;
  batch.value = null;
  mapping.value = {};
  error.value = null;
}
function onFile(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] ?? null;
}
function inferMapping(headers: string[]) {
  const normalized = new Map(headers.map((header) => [header.toLowerCase().trim(), header]));
  mapping.value = Object.fromEntries(
    mappingFields.map((field) => [field.key, normalized.get(field.key) ?? '']),
  );
}
async function upload() {
  if (!file.value) return;
  busy.value = true;
  error.value = null;
  try {
    batch.value = (await corePortfolioApi.uploadImport(file.value)).data;
    inferMapping(batch.value.headers);
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = false;
  }
}
async function preview() {
  if (!batch.value) return;
  busy.value = true;
  error.value = null;
  try {
    batch.value = (await corePortfolioApi.previewImport(batch.value.id, mapping.value)).data;
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = false;
  }
}
async function confirm() {
  if (!batch.value || !validRows.value.length) return;
  busy.value = true;
  error.value = null;
  try {
    batch.value = (
      await corePortfolioApi.confirmImport(
        batch.value.id,
        validRows.value.map((row) => row.id),
      )
    ).data;
    emit('saved', `${batch.value.confirmed_count} operaciones importadas y contabilizadas.`);
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
</script>

<template>
  <BaseModal
    :open="open"
    title="Importar operaciones CSV"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-import-sheet"
    @close="emit('close')"
  >
    <div class="a-pf-import-flow">
      <AState status="neutral" layout="inline">
        El fichero se prepara primero. Ninguna fila modifica la cartera hasta que revises el preview
        y confirmes explícitamente.
      </AState>
      <label v-if="!batch" class="ui-item-form-field">
        <span class="ui-item-form-label">Fichero CSV</span>
        <input class="input" type="file" accept=".csv,text/csv" @change="onFile" />
      </label>
      <template v-else-if="batch.status === 'uploaded'">
        <div class="a-pf-import-heading">
          <strong>{{ batch.filename }}</strong>
          <span>{{ batch.row_count }} filas detectadas</span>
        </div>
        <div class="ui-item-form-grid">
          <label v-for="field in mappingFields" :key="field.key" class="ui-item-form-field">
            <span class="ui-item-form-label">
              {{ field.label }}{{ field.required ? ' · obligatorio' : '' }}
            </span>
            <ASelect
              :model-value="mapping[field.key] ?? ''"
              :options="headerOptions"
              :searchable="false"
              @update:model-value="(value) => (mapping[field.key] = String(value))"
            />
          </label>
        </div>
      </template>
      <template v-else>
        <div class="a-pf-import-summary">
          <div>
            <span>Listas</span><strong>{{ validRows.length }}</strong>
          </div>
          <div>
            <span>Con incidencia</span><strong>{{ invalidRows.length }}</strong>
          </div>
          <div>
            <span>Confirmadas</span><strong>{{ batch.confirmed_count }}</strong>
          </div>
        </div>
        <div class="a-pf-import-rows">
          <div v-for="row in batch.rows" :key="row.id">
            <span>Fila {{ row.row_number }}</span>
            <strong>{{ row.normalized_data.operation_type ?? 'Sin tipo' }}</strong>
            <small :class="`is-${row.status}`">{{ row.status }}</small>
            <p v-if="Object.keys(row.errors).length">{{ Object.values(row.errors).join(' · ') }}</p>
          </div>
        </div>
      </template>
      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </div>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="busy" @click="emit('close')">Cancelar</AButton>
        <AButton v-if="!batch" variant="primary" :disabled="!file" :loading="busy" @click="upload">
          Cargar CSV
        </AButton>
        <AButton
          v-else-if="batch.status === 'uploaded'"
          variant="primary"
          :loading="busy"
          @click="preview"
        >
          Generar preview
        </AButton>
        <AButton
          v-else
          variant="primary"
          :disabled="!validRows.length"
          :loading="busy"
          @click="confirm"
        >
          Confirmar {{ validRows.length }} filas
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
