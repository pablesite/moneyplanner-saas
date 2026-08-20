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

// Enlazar una cuenta mete su saldo en la cartera, así que solo debería enlazarse el
// efectivo que de verdad es munición de inversión: el monedero de una plataforma o una
// cuenta que no se usa para gastar. Una cuenta operativa metería la compra semanal en el
// valor de la cartera y arrastraría la rentabilidad.
const linkAccountId = ref('');
const linking = ref(false);

const cashAccounts = computed(() =>
  (props.options?.cash_accounts ?? []).filter(
    (row) => String(row.container_id) === editingId.value,
  ),
);
// Core decide qué es enlazable: solo cuentas de liquidez y solo las libres. Ofrecer
// cualquier cuenta de activo dejaba elegir la cuenta contable de una posición, que no es
// efectivo de nada.
const accountOptions = computed(() => [
  { value: '', label: 'Elige una cuenta…' },
  ...(props.options?.linkable_cash_accounts ?? []).map((row) => ({
    value: String(row.id),
    label: `${row.name} · ${row.currency}`,
  })),
]);

async function linkCash() {
  const account = (props.options?.linkable_cash_accounts ?? []).find(
    (row) => String(row.id) === linkAccountId.value,
  );
  if (!editing.value || !account) return;
  linking.value = true;
  error.value = null;
  try {
    // Si el contenedor ya tiene efectivo en esa moneda, esto es mudarlo de plataforma:
    // se cambia la cuenta del enlace en vez de crear otro. Desenlazar y volver a
    // enlazar no sirve —una cesta guardada bloquea el borrado— y además choca con el
    // único enlace por contenedor y moneda.
    const current = cashAccounts.value.find((row) => row.currency === account.currency);
    if (current) {
      await corePortfolioApi.changeCashAccount(current.id, {
        ledger_account_id: account.id,
        currency: account.currency,
      });
      linkAccountId.value = '';
      emit('saved', `Ahora el efectivo de ${editing.value.name} es ${account.name}.`);
      return;
    }
    await corePortfolioApi.linkCashAccount({
      container_id: editing.value.id,
      ledger_account_id: account.id,
      currency: account.currency,
    });
    linkAccountId.value = '';
    emit('saved', `Efectivo enlazado a ${editing.value.name}.`);
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    linking.value = false;
  }
}

async function unlinkCash(id: number) {
  linking.value = true;
  error.value = null;
  try {
    await corePortfolioApi.unlinkCashAccount(id);
    emit('saved', 'Efectivo desenlazado.');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    linking.value = false;
  }
}

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

      <section v-if="editing" class="a-pf-container-cash">
        <h3>
          Efectivo del contenedor
          <AInfoHint>
            El dinero que espera dentro de la plataforma antes de invertirse: el monedero de
            Urbanitae, el saldo sin invertir de un exchange. Enlazarlo lo
            <strong>mete en la cartera</strong>, así que solo debería enlazarse el efectivo que de
            verdad es munición de inversión. Una cuenta con la que también pagas la compra metería
            ese gasto en el valor de tu cartera y arrastraría tu rentabilidad.
          </AInfoHint>
        </h3>

        <ul v-if="cashAccounts.length" class="a-pf-container-cash-list">
          <li v-for="row in cashAccounts" :key="row.id">
            <span>{{ row.name }}</span>
            <small class="mono">{{ row.available }} {{ row.currency }}</small>
            <AButton variant="ghost" size="sm" :disabled="linking" @click="unlinkCash(row.id)">
              Desenlazar
            </AButton>
          </li>
        </ul>
        <AState v-else status="empty" layout="inline">
          Sin efectivo enlazado. No hace falta: solo lo necesitas si quieres que ese dinero cuente
          como parte de la cartera.
        </AState>
        <p v-if="cashAccounts.length" class="a-pf-container-cash-hint">
          ¿Has movido el dinero a otra plataforma? Elige la cuenta nueva y pulsa Cambiar: no hace
          falta desenlazar, y las cestas que ya apunten a este efectivo se conservan.
        </p>

        <div class="a-pf-container-cash-add">
          <ASelect
            v-model="linkAccountId"
            :options="accountOptions"
            :searchable="false"
            aria-label="Cuenta a enlazar"
            class="select"
          />
          <AButton variant="ghost" :loading="linking" :disabled="!linkAccountId" @click="linkCash">
            {{ cashAccounts.length ? 'Cambiar' : 'Enlazar' }}
          </AButton>
        </div>
      </section>

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
