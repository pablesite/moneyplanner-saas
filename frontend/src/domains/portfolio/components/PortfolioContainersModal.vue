<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  AButton,
  AChevron,
  AInfoHint,
  ASelect,
  AState,
  BaseModal,
  type ASelectItem,
} from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { PortfolioContainer, PortfolioOperationOptions } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-container-form';

// Lista y detalle en vez de un desplegable: antes elegías el contenedor arriba mientras
// abajo se veía la lista entera sin poder pulsarla, que es justo lo contrario de lo que
// cualquiera intenta hacer al verla.
type View = 'list' | 'edit' | 'create';
const view = ref<View>('list');
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
const movingCash = ref(false);

const containers = computed(() => props.options?.containers ?? []);
const typeOptions = computed<ASelectItem[]>(() =>
  (props.options?.container_types ?? []).map((row) => ({ value: row.value, label: row.label })),
);
const editing = computed<PortfolioContainer | null>(
  () => containers.value.find((row) => String(row.id) === editingId.value) ?? null,
);
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
    label: `${row.name} · ${money(row.balance, row.currency)}`,
  })),
]);

function money(value: string, currency: string): string {
  return formatMoney(value, currency === 'USD' ? 'USD' : 'EUR');
}

function typeLabel(value: string): string {
  return props.options?.container_types?.find((row) => row.value === value)?.label ?? value;
}

function cashOf(container: PortfolioContainer): string | null {
  const rows = (props.options?.cash_accounts ?? []).filter(
    (row) => row.container_id === container.id,
  );
  if (!rows.length) return null;
  return rows.map((row) => money(row.available, row.currency)).join(' · ');
}

function positionsLabel(container: PortfolioContainer): string {
  const count = container.position_count;
  return count === 1 ? '1 posición' : `${count} posiciones`;
}

function openContainer(container: PortfolioContainer) {
  editingId.value = String(container.id);
  name.value = container.name;
  containerType.value = container.container_type;
  isActive.value = container.is_active;
  linkAccountId.value = '';
  movingCash.value = false;
  error.value = null;
  view.value = 'edit';
}

function startCreate() {
  editingId.value = '';
  name.value = '';
  containerType.value = props.options?.container_types?.[0]?.value ?? 'broker';
  isActive.value = true;
  error.value = null;
  view.value = 'create';
}

function backToList() {
  view.value = 'list';
  editingId.value = '';
  error.value = null;
}

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
      movingCash.value = false;
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
    backToList();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) backToList();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="view === 'list' ? 'Contenedores' : (editing?.name ?? 'Nuevo contenedor')"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <div v-if="view === 'list'" class="a-pf-container-browser">
      <p>
        Dónde está depositada cada posición, y desde qué efectivo se compra. Agrupa el inventario;
        no entra en ningún cálculo de rentabilidad.
      </p>

      <ul class="a-pf-container-list">
        <li v-for="container in containers" :key="container.id">
          <button type="button" @click="openContainer(container)">
            <span class="a-pf-container-name">
              {{ container.name }}
              <small>
                {{ typeLabel(container.container_type) }} · {{ positionsLabel(container) }}
                <template v-if="!container.is_active"> · inactivo</template>
              </small>
            </span>
            <!-- El efectivo enlazado se ve desde la lista: es el dato por el que se entra
                 aquí, y antes había que abrir uno por uno para saber cuál lo tenía. -->
            <!-- En blanco y no un guion: una columna de guiones llama la atención sobre
                 lo que no hay, y aquí lo que importa es dónde sí hay efectivo. -->
            <span v-if="cashOf(container)" class="a-pf-container-cash-tag mono">
              {{ cashOf(container) }}
            </span>
            <span v-else></span>
            <AChevron :expanded="false" />
          </button>
        </li>
      </ul>

      <AState v-if="!containers.length" status="empty" layout="inline">
        Todavía no hay contenedores. Se crean solos al clasificar posiciones, o puedes añadir uno.
      </AState>
      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </div>

    <form v-else :id="FORM_ID" class="a-pf-setup-flow a-pf-item-form" @submit.prevent="save">
      <AButton variant="ghost" size="sm" class="a-pf-container-back" @click="backToList">
        ← Todos los contenedores
      </AButton>

      <div class="ui-item-form-grid">
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
      </div>

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
            <small class="mono">{{ money(row.available, row.currency) }}</small>
            <AButton
              variant="ghost"
              size="sm"
              :disabled="linking"
              @click="movingCash = !movingCash"
            >
              {{ movingCash ? 'Cancelar' : 'Cambiar cuenta' }}
            </AButton>
            <AButton variant="ghost" size="sm" :disabled="linking" @click="unlinkCash(row.id)">
              Desenlazar
            </AButton>
          </li>
        </ul>

        <AState v-if="!cashAccounts.length" status="empty" layout="inline">
          Sin efectivo enlazado. No hace falta: solo lo necesitas si quieres que ese dinero cuente
          como parte de la cartera.
        </AState>

        <!-- El selector solo aparece cuando vas a usarlo: enlazar es algo que se hace una
             vez, y tenerlo siempre delante convertía el bloque en un formulario. -->
        <template v-if="!cashAccounts.length || movingCash">
          <p v-if="movingCash" class="a-pf-container-cash-hint">
            Elige la cuenta nueva: el enlace sigue siendo el de este contenedor, así que las cestas
            que ya apunten a este efectivo se conservan.
          </p>
          <div class="a-pf-container-cash-add">
            <ASelect
              v-model="linkAccountId"
              :options="accountOptions"
              :searchable="false"
              aria-label="Cuenta a enlazar"
              class="select"
            />
            <AButton
              variant="ghost"
              :loading="linking"
              :disabled="!linkAccountId"
              @click="linkCash"
            >
              {{ movingCash ? 'Cambiar' : 'Enlazar' }}
            </AButton>
          </div>
        </template>
      </section>

      <AState v-if="editing && editing.position_count" status="neutral" layout="inline">
        {{ positionsLabel(editing) }} {{ editing.position_count === 1 ? 'usa' : 'usan' }} este
        contenedor.
      </AState>
      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </form>

    <template #footer>
      <div class="ui-modal-foot-actions">
        <template v-if="view === 'list'">
          <AButton variant="ghost" @click="emit('close')">Cerrar</AButton>
          <AButton variant="primary" @click="startCreate">Nuevo contenedor</AButton>
        </template>
        <template v-else>
          <AButton variant="ghost" :disabled="saving" @click="backToList">Cancelar</AButton>
          <AButton variant="primary" type="submit" :form="FORM_ID" :loading="saving">
            {{ editing ? 'Guardar cambios' : 'Crear contenedor' }}
          </AButton>
        </template>
      </div>
    </template>
  </BaseModal>
</template>
