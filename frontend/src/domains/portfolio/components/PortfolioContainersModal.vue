<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PortfolioContainer, PortfolioOperationOptions } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-container-form';

// '' is the "new container" slot, so creating and editing share one form instead of two
// nearly identical ones.
const editingId = ref('');
const name = ref('');
const containerType = ref('broker');
const isActive = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);

const containers = computed(() => props.options?.containers ?? []);
const typeOptions = computed<ASelectItem[]>(() =>
  (props.options?.container_types ?? []).map((row) => ({ value: row.value, label: row.label })),
);
const targetOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Nuevo contenedor' },
  ...containers.value.map((row) => ({
    value: String(row.id),
    label: `${row.name}${row.is_active ? '' : ' · inactivo'}`,
  })),
]);
const editing = computed<PortfolioContainer | null>(
  () => containers.value.find((row) => String(row.id) === editingId.value) ?? null,
);

function typeLabel(value: string): string {
  return props.options?.container_types?.find((row) => row.value === value)?.label ?? value;
}

function load() {
  error.value = null;
  const target = editing.value;
  if (!target) {
    name.value = '';
    containerType.value = props.options?.container_types?.[0]?.value ?? 'broker';
    isActive.value = true;
    return;
  }
  name.value = target.name;
  containerType.value = target.container_type;
  isActive.value = target.is_active;
}

watch(editingId, load);
watch(
  [() => props.open, containers],
  ([open]) => {
    if (open) {
      editingId.value = '';
      load();
    }
  },
  { immediate: true },
);

async function save() {
  const trimmed = name.value.trim();
  if (!trimmed) {
    error.value = 'Indica un nombre para el contenedor.';
    return;
  }
  saving.value = true;
  error.value = null;
  try {
    const payload = {
      name: trimmed,
      container_type: containerType.value,
      is_active: isActive.value,
    };
    if (editing.value) {
      await corePortfolioApi.updateContainer(editing.value.id, payload);
      emit('saved', `Contenedor "${trimmed}" actualizado.`);
    } else {
      await corePortfolioApi.createContainer(payload);
      emit('saved', `Contenedor "${trimmed}" creado.`);
    }
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
    title="Contenedores"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-setup-flow" @submit.prevent="save">
      <p>
        Un contenedor es dónde está depositada la posición: el bróker, banco, exchange, wallet o
        plataforma. Agrupa y filtra el inventario y enlaza el efectivo desde el que se compra; no
        entra en ningún cálculo de rentabilidad.
      </p>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Contenedor</span>
        <ASelect v-model="editingId" :options="targetOptions" :searchable="false" />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Nombre</span>
        <input v-model="name" class="input" type="text" maxlength="120" required />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Tipo</span>
        <ASelect v-model="containerType" :options="typeOptions" :searchable="false" />
      </label>

      <label v-if="editing" class="ui-item-form-field">
        <span class="ui-item-form-label">
          Activo
          <AInfoHint
            label="Un contenedor inactivo deja de ofrecerse al clasificar posiciones, pero no se borra ni afecta a las que ya lo usan."
          />
        </span>
        <ASelect
          :model-value="isActive ? 'yes' : 'no'"
          :options="[
            { value: 'yes', label: 'Sí' },
            { value: 'no', label: 'No' },
          ]"
          :searchable="false"
          @update:model-value="(value) => (isActive = value === 'yes')"
        />
      </label>

      <AState v-if="editing && editing.position_count" status="neutral" layout="inline">
        {{ editing.position_count }}
        {{ editing.position_count === 1 ? 'posición usa' : 'posiciones usan' }} este contenedor.
      </AState>

      <dl v-if="containers.length" class="a-pf-setup-context">
        <div v-for="row in containers" :key="row.id">
          <dt>{{ row.name }}</dt>
          <dd>{{ typeLabel(row.container_type) }} · {{ row.position_count }}</dd>
        </div>
      </dl>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </form>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cancelar</AButton>
        <AButton variant="primary" type="submit" :form="FORM_ID" :loading="saving">
          {{ editing ? 'Guardar cambios' : 'Crear contenedor' }}
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
