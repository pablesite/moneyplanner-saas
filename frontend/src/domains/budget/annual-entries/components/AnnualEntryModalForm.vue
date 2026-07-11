<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import AmountPeriodCurrencyRow from './AmountPeriodCurrencyRow.vue';

type SelectOption = {
  value: string;
  label: string;
};

type OwnerOption = SelectOption & {
  key: string;
};

type AnnualEntryModalFormModel = {
  category: string;
  subcategory: string;
  name: string;
  owner: string;
  timeProfile: string;
  cashflowRole: string;
  eventGroup: string;
  targetMonth: string;
  termEndMonth: string;
  termEndYear: string;
  amountInputPeriod: 'annual' | 'monthly';
  amountAnnual: string;
  currency: string;
  notes: string;
};

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    form: AnnualEntryModalFormModel;
    loading?: boolean;
    error?: string | null;
    submitLabel: string;
    categoryOptions: ReadonlyArray<SelectOption>;
    subcategoryOptions: ReadonlyArray<SelectOption>;
    showOwnerField?: boolean;
    ownerOptions?: ReadonlyArray<OwnerOption>;
    timeProfileOptions: ReadonlyArray<SelectOption>;
    timeProfileFieldLabel?: string;
    cashflowRoleOptions: ReadonlyArray<SelectOption>;
    showCashflowRoleField?: boolean;
    showEventGroupField?: boolean;
    showTermEndYearField?: boolean;
    showRecurringTargetMonthField?: boolean;
    namePlaceholder: string;
    amountPlaceholder: string;
    targetMonthPlaceholder?: string;
    targetMonthRecurringPlaceholder?: string;
    eventGroupPlaceholder?: string;
    termEndYearPlaceholder?: string;
    termEndMonthPlaceholder?: string;
    notesPlaceholder?: string;
    currencyOptions?: string[];
    eventGroupOptions?: ReadonlyArray<string>;
    eventGroupDatalistId?: string;
  }>(),
  {
    loading: false,
    error: null,
    showOwnerField: false,
    showCashflowRoleField: true,
    showEventGroupField: true,
    showTermEndYearField: true,
    showRecurringTargetMonthField: false,
    ownerOptions: () => [],
    timeProfileFieldLabel: '',
    targetMonthPlaceholder: 'Mes objetivo (1-12)',
    targetMonthRecurringPlaceholder: 'Mes previsto (opcional, 1-12)',
    eventGroupPlaceholder: 'Grupo de evento (opcional, ej: vivienda_2026)',
    termEndYearPlaceholder: 'Ano fin compromiso (ej: 2027)',
    termEndMonthPlaceholder: 'Mes fin (1-12)',
    notesPlaceholder: 'Notas (opcional)',
    currencyOptions: () => ['EUR', 'USD'],
    eventGroupOptions: () => [],
    eventGroupDatalistId: 'annual-entry-event-groups',
  },
);

const emit = defineEmits<{
  close: [];
  submit: [];
  patch: [patch: Partial<AnnualEntryModalFormModel>];
}>();
const advancedOpen = ref(false);
watch(
  () => props.open,
  (open) => {
    if (!open) advancedOpen.value = false;
  },
);

const categorySelectOptions = computed<ASelectItem[]>(() =>
  props.categoryOptions.map((option) => ({ value: option.value, label: option.label })),
);
const subcategorySelectOptions = computed<ASelectItem[]>(() =>
  props.subcategoryOptions.map((option) => ({ value: option.value, label: option.label })),
);
const ownerSelectOptions = computed<ASelectItem[]>(() => [
  { value: '', label: '— Opcional —' },
  ...(props.ownerOptions ?? []).map((option) => ({ value: option.value, label: option.label })),
]);
const timeProfileSelectOptions = computed<ASelectItem[]>(() =>
  props.timeProfileOptions.map((option) => ({ value: option.value, label: option.label })),
);
const cashflowRoleSelectOptions = computed<ASelectItem[]>(() =>
  props.cashflowRoleOptions.map((option) => ({ value: option.value, label: option.label })),
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="title"
    variant="sheet"
    panel-class="dir-a dir-a-sheet"
    @close="emit('close')"
  >
    <div class="ui-item-form-grid">
      <div class="ui-item-form-field md:col-span-2">
        <AButton variant="ghost" size="sm" @click="advancedOpen = !advancedOpen">
          {{ advancedOpen ? 'Ocultar opciones avanzadas' : 'Opciones avanzadas' }}
        </AButton>
        <p class="ui-section-subtitle">
          Por defecto, la partida es recurrente estructural. Los compromisos puntuales se gestionan
          desde Mi Plan.
        </p>
      </div>

      <label v-if="advancedOpen" class="ui-item-form-field">
        <span class="ui-item-form-label">Categoría</span>
        <ASelect
          class="select"
          :model-value="form.category"
          :options="categorySelectOptions"
          @update:model-value="(v) => emit('patch', { category: String(v) })"
        />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Subcategoría</span>
        <ASelect
          class="select"
          :model-value="form.subcategory"
          :options="subcategorySelectOptions"
          @update:model-value="(v) => emit('patch', { subcategory: String(v) })"
        />
      </label>

      <label class="ui-item-form-field" :class="{ 'md:col-span-2': !showOwnerField }">
        <span class="ui-item-form-label">Concepto</span>
        <input
          :value="form.name"
          class="input"
          :placeholder="namePlaceholder"
          @input="emit('patch', { name: String(($event.target as HTMLInputElement).value ?? '') })"
        />
      </label>

      <label v-if="showOwnerField" class="ui-item-form-field">
        <span class="ui-item-form-label">Titular</span>
        <ASelect
          class="select"
          :model-value="form.owner"
          :options="ownerSelectOptions"
          @update:model-value="(v) => emit('patch', { owner: String(v) })"
        />
      </label>

      <label class="ui-item-form-field">
        <span v-if="timeProfileFieldLabel" class="ui-item-form-label">{{
          timeProfileFieldLabel
        }}</span>
        <ASelect
          class="select"
          :model-value="form.timeProfile"
          :options="timeProfileSelectOptions"
          @update:model-value="(v) => emit('patch', { timeProfile: String(v) })"
        />
      </label>

      <label v-if="advancedOpen && showCashflowRoleField" class="ui-item-form-field">
        <span class="ui-item-form-label">Rol en flujo de caja</span>
        <ASelect
          class="select"
          :model-value="form.cashflowRole"
          :options="cashflowRoleSelectOptions"
          @update:model-value="(v) => emit('patch', { cashflowRole: String(v) })"
        />
      </label>

      <label
        v-if="advancedOpen && (form.timeProfile === 'one_off' || showRecurringTargetMonthField)"
        class="ui-item-form-field"
      >
        <span class="ui-item-form-label">{{
          form.timeProfile === 'one_off' ? 'Mes objetivo' : 'Mes previsto'
        }}</span>
        <input
          :value="form.targetMonth"
          class="input"
          inputmode="numeric"
          :placeholder="
            form.timeProfile === 'one_off'
              ? targetMonthPlaceholder
              : targetMonthRecurringPlaceholder
          "
          @input="
            emit('patch', { targetMonth: String(($event.target as HTMLInputElement).value ?? '') })
          "
        />
      </label>

      <label
        v-if="advancedOpen && showTermEndYearField && form.timeProfile === 'term_recurrent'"
        class="ui-item-form-field"
      >
        <span class="ui-item-form-label">Mes fin compromiso</span>
        <input
          :value="form.termEndMonth"
          class="input"
          inputmode="numeric"
          :placeholder="termEndMonthPlaceholder"
          @input="
            emit('patch', { termEndMonth: String(($event.target as HTMLInputElement).value ?? '') })
          "
        />
      </label>

      <label
        v-if="advancedOpen && showTermEndYearField && form.timeProfile === 'term_recurrent'"
        class="ui-item-form-field"
      >
        <span class="ui-item-form-label">Año fin compromiso</span>
        <input
          :value="form.termEndYear"
          class="input"
          inputmode="numeric"
          :placeholder="termEndYearPlaceholder"
          @input="
            emit('patch', { termEndYear: String(($event.target as HTMLInputElement).value ?? '') })
          "
        />
      </label>

      <div class="ui-item-form-field md:col-span-2">
        <span class="ui-item-form-label">Importe</span>
        <AmountPeriodCurrencyRow
          :amount-value="form.amountAnnual"
          :period="form.amountInputPeriod"
          :currency="form.currency"
          :placeholder="amountPlaceholder"
          :period-disabled="form.timeProfile === 'one_off'"
          :hide-period-toggle="form.timeProfile === 'one_off'"
          :currency-options="currencyOptions"
          @update:amount-value="emit('patch', { amountAnnual: $event })"
          @update:period="emit('patch', { amountInputPeriod: $event })"
          @update:currency="emit('patch', { currency: $event })"
        />
      </div>

      <label class="ui-item-form-field md:col-span-2">
        <span class="ui-item-form-label">Notas</span>
        <textarea
          :value="form.notes"
          class="textarea ui-notes-field"
          rows="2"
          :placeholder="notesPlaceholder"
          @input="
            emit('patch', { notes: String(($event.target as HTMLTextAreaElement).value ?? '') })
          "
        />
      </label>

      <AState v-if="error" class="md:col-span-2" status="error" layout="inline" role="alert">
        {{ error }}
      </AState>

      <div class="actions md:col-span-2">
        <AButton variant="ghost" @click="emit('close')">Cancelar</AButton>
        <AButton variant="primary" :disabled="loading" @click="emit('submit')">
          {{ submitLabel }}
        </AButton>
      </div>
    </div>
  </BaseModal>
</template>
