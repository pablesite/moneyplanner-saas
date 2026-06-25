<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, nextTick, onMounted, ref, watch, type PropType } from 'vue';
import { AButton, ASelect, BaseModal, type ASelectItem } from '@/domains/ui';

const props = defineProps({
  page: {
    type: Object as PropType<any>,
    required: true,
  },
});

type AccountOption = {
  id: number;
  name: string;
  currency: string;
  account_type?: string;
  asset_id?: number | null;
  liability_id?: number | null;
  display_name?: string;
};

type AccountGroup = {
  key: string;
  label: string;
  accounts: AccountOption[];
};

function accountLabel(account: AccountOption): string {
  if (typeof props.page.accountDisplayName === 'function') {
    return props.page.accountDisplayName(account);
  }
  return account.display_name || account.name;
}

type CuentasGroup = {
  key: string;
  label: string;
  positionType: 'asset' | 'liability';
  accounts: AccountOption[];
};

// Agrupa por tipo de activo/pasivo (Liquidez, Criptomonedas, Préstamos…) usando
// la misma función que el filtro de cuentas de la vista de movimientos, para que
// el desplegable del modal y el de la lista se comporten de forma idéntica.
function groupAndSortAccounts(accounts: AccountOption[]): AccountGroup[] {
  const groups = props.page.buildCuentasGroups(accounts) as CuentasGroup[];
  return groups.map((group) => ({
    key: group.key,
    label: `${group.positionType === 'asset' ? 'Activos' : 'Pasivos'} · ${group.label}`,
    accounts: group.accounts,
  }));
}

function accountSelectItems(
  groups: AccountGroup[],
  placeholder: string,
  placeholderDisabled = true,
): ASelectItem[] {
  return [
    { value: null, label: placeholder, disabled: placeholderDisabled },
    ...groups.map((group) => ({
      group: group.label,
      options: group.accounts.map((account) => ({
        value: account.id,
        label: accountLabel(account),
      })),
    })),
  ];
}

const liquidityGroups = computed(() => groupAndSortAccounts(props.page.liquidityAccounts));
// Ingreso: el backend admite cualquier activo (incluida inversión, p. ej. EARN) o pasivo.
const incomeGroups = computed(() => groupAndSortAccounts(props.page.editAccountOptions));
// Gasto: pasivos (tarjetas) + liquidez/operativas, sin activos de inversión.
const expenseGroups = computed(() => groupAndSortAccounts(props.page.quickExpenseAccountOptions));
const revaluationGroups = computed(() =>
  groupAndSortAccounts(props.page.revaluationAccountOptions),
);
const transferGroups = computed(() => groupAndSortAccounts(props.page.transferCounterpartyOptions));
const transferOriginGroups = computed(() => groupAndSortAccounts(props.page.transferOriginOptions));
const adjustmentGroups = computed(() =>
  groupAndSortAccounts(props.page.quickAdjustmentAccountOptions),
);
const investmentGroups = computed(() =>
  groupAndSortAccounts(props.page.investmentCounterpartyOptions),
);
const liabilityGroups = computed(() =>
  groupAndSortAccounts(props.page.liabilityCounterpartyOptions),
);

type MovementTypeOption = { value: string; label: string };
const movementTypeOptions = computed<MovementTypeOption[]>(
  () => props.page.quickMovementTypeOptions as MovementTypeOption[],
);
const QE_TYPE_GLYPHS: Record<string, string> = {
  income: '↓',
  expense: '↑',
  transfer: '⇄',
  adjustment: '±',
  investment: '↗',
  debt_payment: '↘',
  revaluation: '↻',
};
function typeGlyph(value: string): string {
  return QE_TYPE_GLYPHS[value] ?? '•';
}
function typeTone(value: string): string {
  return value;
}
const QE_TYPE_ORDER = [
  'expense',
  'income',
  'transfer',
  'investment',
  'debt_payment',
  'revaluation',
  'adjustment',
];
const orderedTypeOptions = computed<MovementTypeOption[]>(() => {
  const rank = (value: string) => {
    const index = QE_TYPE_ORDER.indexOf(value);
    return index === -1 ? QE_TYPE_ORDER.length : index;
  };
  return [...movementTypeOptions.value].sort((a, b) => rank(a.value) - rank(b.value));
});

const showValueDate = ref(false);
const initialFormSnapshot = ref('');

watch(
  () => props.page.showQuickEntryModal,
  (open: boolean) => {
    if (open) {
      initialFormSnapshot.value = JSON.stringify(props.page.quickEntryForm);
      // Limpiar cualquier error previo para que el formulario abra en limpio.
      props.page.error = null;
    }
  },
);

function requestClose(): void {
  const changed = JSON.stringify(props.page.quickEntryForm) !== initialFormSnapshot.value;
  if (changed && !window.confirm('¿Descartar los cambios de este movimiento?')) return;
  // No dejar un banner de error colgando en la lista tras cancelar.
  props.page.error = null;
  props.page.showQuickEntryModal = false;
}

watch(
  () => props.page.quickEntryForm.booking_date,
  (date: string) => {
    if (!showValueDate.value) {
      props.page.quickEntryForm.value_date = date;
    }
  },
);

watch(showValueDate, (show: boolean) => {
  if (!show) {
    props.page.quickEntryForm.value_date = props.page.quickEntryForm.booking_date;
  }
});

const quickMainAccountGroups = computed(() => {
  const type = props.page.quickEntryForm.movement_type;
  if (type === 'income') return incomeGroups.value;
  if (type === 'expense') return expenseGroups.value;
  if (type === 'transfer') return transferOriginGroups.value;
  return liquidityGroups.value;
});

const revaluationSelectOptions = computed(() =>
  accountSelectItems(revaluationGroups.value, 'Seleccionar'),
);
const investmentOriginSelectOptions = computed(() =>
  accountSelectItems(
    props.page.quickEntryForm.investment_direction === 'reinvestment'
      ? groupAndSortAccounts(props.page.investmentOriginOptions)
      : liquidityGroups.value,
    'Seleccionar',
  ),
);
const investmentSelectOptions = computed(() =>
  accountSelectItems(investmentGroups.value, 'Seleccionar'),
);
const liquiditySelectOptions = computed(() =>
  accountSelectItems(liquidityGroups.value, 'Seleccionar'),
);
const liabilitySelectOptions = computed(() =>
  accountSelectItems(liabilityGroups.value, 'Seleccionar'),
);
const mainAccountPlaceholder = computed(() => {
  const type = props.page.quickEntryForm.movement_type;
  if (type === 'adjustment') return 'A conciliar';
  return 'Cuenta';
});
const mainAccountSelectOptions = computed(() =>
  accountSelectItems(
    props.page.quickEntryForm.movement_type === 'adjustment'
      ? adjustmentGroups.value
      : quickMainAccountGroups.value,
    'Seleccionar',
  ),
);
const transferSelectOptions = computed(() =>
  accountSelectItems(transferGroups.value, 'Seleccionar'),
);
const quickCategorySelectOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Seleccionar' },
  ...props.page.quickCategoryOptions,
]);
const quickSubcategorySelectOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Seleccionar' },
  ...props.page.quickSubcategoryOptions,
]);
const isComplexMovement = computed(() =>
  ['transfer', 'investment', 'debt_payment'].includes(props.page.quickEntryForm.movement_type),
);

const quickEntryCurrency = computed(() => {
  const accountId = props.page.quickEntryForm.account_id;
  if (!accountId) return null;
  const account = (props.page.accounts as AccountOption[]).find((a) => a.id === accountId);
  return account?.currency ?? null;
});
const confirmationSummary = computed(() => {
  if (!isComplexMovement.value) return '';
  const form = props.page.quickEntryForm;
  const accounts = props.page.accounts as AccountOption[];
  const origin = accounts.find((account) => account.id === form.account_id);
  const destinationId =
    form.movement_type === 'debt_payment'
      ? form.liability_account_id
      : form.counterparty_account_id;
  const destination = accounts.find((account) => account.id === destinationId);
  const amount = form.amount || '—';
  return `${accountLabel(origin ?? ({ name: 'Cuenta pendiente' } as AccountOption))} → ${accountLabel(destination ?? ({ name: 'Destino pendiente' } as AccountOption))} · ${amount}`;
});

// Chips carousel arrow navigation (desktop only — mobile uses touch scroll)
const chipsRef = ref<HTMLElement | null>(null);
const chipsCanScrollLeft = ref(false);
const chipsCanScrollRight = ref(false);

function updateChipsArrows() {
  const el = chipsRef.value;
  if (!el) return;
  chipsCanScrollLeft.value = el.scrollLeft > 4;
  chipsCanScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;
}

function scrollChips(direction: 1 | -1) {
  const el = chipsRef.value;
  if (!el) return;
  el.scrollBy({ left: direction * Math.round(el.clientWidth * 0.7), behavior: 'smooth' });
  setTimeout(updateChipsArrows, 320);
}

onMounted(() => nextTick(updateChipsArrows));
watch(
  () => props.page.showQuickEntryModal,
  (open) => {
    if (open) nextTick(updateChipsArrows);
    if (!open) editingClassification.value = false;
  },
);

const editingClassification = ref(false);

const selectedCategoryLabel = computed(() => {
  const key = props.page.quickEntryForm.category_key;
  if (!key) return null;
  const item = (quickCategorySelectOptions.value as any[]).find((o) => o.value === key);
  return item?.label ?? null;
});

const selectedSubcategoryLabel = computed(() => {
  const key = props.page.quickEntryForm.subcategory_key;
  if (!key) return null;
  const item = (quickSubcategorySelectOptions.value as any[]).find((o) => o.value === key);
  return item?.label ?? null;
});

const classificationSummary = computed(() =>
  selectedCategoryLabel.value && selectedSubcategoryLabel.value
    ? `${selectedCategoryLabel.value} / ${selectedSubcategoryLabel.value}`
    : null,
);

watch(
  () => props.page.quickEntryForm.subcategory_key,
  (key: string) => {
    if (key) editingClassification.value = false;
  },
);

function resetClassification(): void {
  props.page.quickEntryForm.category_key = '';
  props.page.quickEntryForm.subcategory_key = '';
  editingClassification.value = false;
}

const quickEntryHint = computed(() => {
  const type = props.page.quickEntryForm.movement_type;
  return type === 'income' || type === 'expense'
    ? 'Completa importe, cuenta, concepto y categoría.'
    : 'Completa importe, cuenta y concepto.';
});
</script>

<template>
  <BaseModal
    :open="page.showQuickEntryModal"
    title="Registrar movimiento"
    variant="sheet"
    panel-class="max-w-[540px] dir-a dir-a-sheet a-mov-entry-sheet"
    @close="requestClose"
  >
    <div v-if="!page.liquidityAccounts.length" class="ui-accounting-inline-note">
      Necesitas al menos una cuenta de liquidez para registrar movimientos.
    </div>

    <form
      class="ui-accounting-form ui-accounting-transaction-form ui-accounting-modal-form qe-form"
      @submit.prevent="page.submitQuickEntryFromModal"
    >
      <div class="qe-types-wrap">
        <button
          type="button"
          class="qe-types-arrow"
          :disabled="!chipsCanScrollLeft"
          aria-label="Ver tipos anteriores"
          @click="scrollChips(-1)"
        >
          ‹
        </button>

        <div
          ref="chipsRef"
          class="qe-types"
          role="group"
          aria-label="Tipo de movimiento"
          @scroll.passive="updateChipsArrows"
        >
          <button
            v-for="option in orderedTypeOptions"
            :key="option.value"
            type="button"
            class="qe-type-chip"
            :class="[
              `qe-tone-${typeTone(option.value)}`,
              { 'is-active': page.quickEntryForm.movement_type === option.value },
            ]"
            @click="page.quickEntryForm.movement_type = option.value"
          >
            <span class="qe-type-glyph" aria-hidden="true">{{ typeGlyph(option.value) }}</span>
            <span>{{ option.label }}</span>
          </button>
        </div>

        <button
          type="button"
          class="qe-types-arrow"
          :disabled="!chipsCanScrollRight"
          aria-label="Ver más tipos"
          @click="scrollChips(1)"
        >
          ›
        </button>
      </div>

      <template v-if="page.quickEntryForm.movement_type === 'revaluation'">
        <label class="qe-amount-field ui-accounting-field">
          <span>Nuevo valor del activo</span>
          <input
            v-model="page.quickEntryForm.revaluation_new_value"
            class="input qe-amount"
            inputmode="decimal"
            placeholder="0,00"
            required
          />
        </label>

        <label class="ui-accounting-field">
          <span>Cuenta de inversión</span>
          <ASelect
            v-model="page.quickEntryForm.account_id"
            class="select"
            :options="revaluationSelectOptions"
          />
        </label>

        <p class="ui-accounting-balance-feedback">
          <template v-if="page.revaluationCurrentBalance != null">
            Saldo actual:
            <strong>{{ page.revaluationCurrentBalance.toFixed(2) }}</strong
            >.
            <template v-if="page.revaluationDelta != null">
              Revalorización:
              <strong
                :class="
                  page.revaluationDelta > 0
                    ? 'ui-accounting-tone-positive'
                    : page.revaluationDelta < 0
                      ? 'ui-accounting-tone-negative'
                      : ''
                "
              >
                {{ page.revaluationDelta >= 0 ? '+' : '' }}{{ page.revaluationDelta.toFixed(2) }}
              </strong>
            </template>
          </template>
          <template v-else>Selecciona la cuenta de inversión para ver el saldo actual.</template>
        </p>
      </template>

      <template v-else-if="page.quickEntryForm.movement_type === 'investment'">
        <div class="qe-subtypes" role="group" aria-label="Dirección de la inversión">
          <button
            type="button"
            class="qe-subtype"
            :class="{ 'is-active': page.quickEntryForm.investment_direction === 'inflow' }"
            @click="page.quickEntryForm.investment_direction = 'inflow'"
          >
            Aporte
          </button>
          <button
            type="button"
            class="qe-subtype"
            :class="{ 'is-active': page.quickEntryForm.investment_direction === 'reinvestment' }"
            @click="page.quickEntryForm.investment_direction = 'reinvestment'"
          >
            Reinversión
          </button>
          <button
            type="button"
            class="qe-subtype"
            :class="{ 'is-active': page.quickEntryForm.investment_direction === 'outflow' }"
            @click="page.quickEntryForm.investment_direction = 'outflow'"
          >
            Retirada
          </button>
        </div>

        <label class="qe-amount-field ui-accounting-field">
          <span
            >Importe{{
              page.quickInvestmentOriginCurrency ? ` (${page.quickInvestmentOriginCurrency})` : ''
            }}</span
          >
          <input
            v-model="page.quickEntryForm.amount"
            class="input qe-amount"
            inputmode="decimal"
            placeholder="0,00"
            required
          />
        </label>
        <label v-if="page.quickInvestmentIsCrossCurrency" class="ui-accounting-field">
          <span
            >Importe destino ({{
              page.quickInvestmentDestinationCurrency || 'moneda destino'
            }})</span
          >
          <input
            v-model="page.quickEntryForm.destination_amount"
            class="input"
            inputmode="decimal"
            placeholder="0,00"
            required
          />
        </label>

        <div class="ui-accounting-form-grid ui-accounting-form-grid-wide">
          <label class="ui-accounting-field">
            <span>
              {{
                page.quickEntryForm.investment_direction === 'reinvestment'
                  ? 'Cuenta de inversion (origen)'
                  : `Cuenta de liquidez ${page.quickEntryForm.investment_direction === 'inflow' ? '(origen)' : '(destino)'}`
              }}
            </span>
            <ASelect
              v-model="page.quickEntryForm.account_id"
              class="select"
              :options="investmentOriginSelectOptions"
            />
          </label>
          <label class="ui-accounting-field">
            <span>
              Cuenta de inversión
              {{
                page.quickEntryForm.investment_direction === 'outflow' ? '(origen)' : '(destino)'
              }}
            </span>
            <ASelect
              v-model="page.quickEntryForm.counterparty_account_id"
              class="select"
              :options="investmentSelectOptions"
            />
          </label>
        </div>

        <div
          v-if="page.quickEntryForm.investment_direction === 'outflow'"
          class="ui-accounting-form-grid ui-accounting-form-grid-wide"
        >
          <label class="ui-accounting-field">
            <span>Coste de adquisición (opcional)</span>
            <input
              v-model="page.quickEntryForm.realized_cost_basis"
              class="input"
              inputmode="decimal"
              placeholder="0,00"
            />
          </label>
          <label class="ui-accounting-field">
            <span>Ganancia/pérdida realizada (opcional)</span>
            <input
              v-model="page.quickEntryForm.realized_gain_loss"
              class="input"
              inputmode="decimal"
              placeholder="0,00"
            />
          </label>
        </div>
      </template>

      <template v-else-if="page.quickEntryForm.movement_type === 'debt_payment'">
        <label class="qe-amount-field ui-accounting-field">
          <span>Total pagado</span>
          <input
            v-model="page.quickEntryForm.amount"
            class="input qe-amount"
            inputmode="decimal"
            placeholder="0,00"
            required
          />
        </label>

        <div class="ui-accounting-form-grid ui-accounting-form-grid-2col">
          <label class="ui-accounting-field">
            <span>Cuenta de liquidez</span>
            <ASelect
              v-model="page.quickEntryForm.account_id"
              class="select"
              :options="liquiditySelectOptions"
            />
          </label>
          <label class="ui-accounting-field">
            <span>Cuenta de pasivo</span>
            <ASelect
              v-model="page.quickEntryForm.liability_account_id"
              class="select"
              :options="liabilitySelectOptions"
            />
          </label>
        </div>

        <div class="ui-accounting-debt-block">
          <p class="ui-accounting-debt-hint">
            Indica el total y una de las dos partidas; la otra se calcula automáticamente.
          </p>
          <div class="ui-accounting-form-grid ui-accounting-form-grid-2col">
            <label class="ui-accounting-field">
              <span>Principal amortizado</span>
              <input
                v-model="page.quickEntryForm.principal_amount"
                class="input"
                inputmode="decimal"
                placeholder="Parte que reduce deuda"
              />
            </label>
            <label class="ui-accounting-field">
              <span>Interés</span>
              <input
                v-model="page.quickEntryForm.interest_amount"
                class="input"
                inputmode="decimal"
                placeholder="Coste financiero"
              />
            </label>
          </div>
        </div>
      </template>

      <template v-else>
        <label class="qe-amount-field ui-accounting-field">
          <span>{{
            page.quickEntryForm.movement_type === 'adjustment'
              ? 'Saldo final objetivo'
              : quickEntryCurrency
                ? `Importe (${quickEntryCurrency})`
                : 'Importe'
          }}</span>
          <input
            v-model="page.quickEntryForm.amount"
            class="input qe-amount"
            inputmode="decimal"
            placeholder="0,00"
            required
          />
        </label>

        <label v-if="page.quickTransferIsCrossCurrency" class="ui-accounting-field">
          <span>Importe destino ({{ page.quickTransferDestinationCurrency }})</span>
          <input
            v-model="page.quickEntryForm.destination_amount"
            class="input"
            inputmode="decimal"
            placeholder="0,00"
          />
        </label>

        <label class="ui-accounting-field">
          <span>Concepto</span>
          <input
            v-model="page.quickEntryForm.description"
            class="input"
            placeholder="¿Qué fue este movimiento?"
            required
          />
        </label>

        <label class="ui-accounting-field">
          <span>{{ mainAccountPlaceholder }}</span>
          <ASelect
            v-model="page.quickEntryForm.account_id"
            class="select"
            :options="mainAccountSelectOptions"
          />
        </label>

        <label v-if="page.quickEntryForm.movement_type === 'transfer'" class="ui-accounting-field">
          <span>Cuenta destino</span>
          <ASelect
            v-model="page.quickEntryForm.counterparty_account_id"
            class="select"
            :options="transferSelectOptions"
          />
        </label>
      </template>
      <p
        v-if="page.quickEntryForm.movement_type === 'adjustment'"
        class="ui-accounting-balance-feedback"
      >
        <template v-if="page.quickAdjustmentCurrentBalance != null">
          Saldo actual:
          <strong>{{
            page.quickAdjustmentCurrentBalance.toFixed(page.quickAdjustmentDisplayDecimals)
          }}</strong
          >.
          <template v-if="page.quickAdjustmentDelta != null">
            Ajuste calculado:
            <strong
              :class="
                page.quickAdjustmentDelta > 0
                  ? 'ui-accounting-tone-positive'
                  : page.quickAdjustmentDelta < 0
                    ? 'ui-accounting-tone-negative'
                    : ''
              "
            >
              {{ page.quickAdjustmentDelta >= 0 ? '+' : ''
              }}{{ page.quickAdjustmentDelta.toFixed(page.quickAdjustmentDisplayDecimals) }}
            </strong>
          </template>
        </template>
        <template v-else>
          Selecciona la cuenta y el saldo final objetivo para calcular el ajuste automáticamente.
        </template>
      </p>

      <label
        v-if="
          ['revaluation', 'investment', 'debt_payment'].includes(page.quickEntryForm.movement_type)
        "
        class="ui-accounting-field"
      >
        <span>Concepto</span>
        <input
          v-model="page.quickEntryForm.description"
          class="input"
          placeholder="¿Qué fue este movimiento?"
          required
        />
      </label>

      <template v-if="page.quickEntryNeedsClassification">
        <div
          v-if="classificationSummary && !editingClassification"
          class="ui-accounting-field qe-classification-field"
        >
          <span>Categoría</span>
          <div class="qe-classification-chip">
            <button
              type="button"
              class="qe-classification-value"
              @click="editingClassification = true"
            >
              <span class="qe-classification-cat">{{ selectedCategoryLabel }}</span>
              <span class="qe-classification-subcat">{{ selectedSubcategoryLabel }}</span>
            </button>
            <button
              type="button"
              class="qe-classification-clear"
              aria-label="Limpiar categoría"
              @click="resetClassification"
            >
              ✕
            </button>
          </div>
        </div>

        <template v-else>
          <label class="ui-accounting-field">
            <span>Categoría</span>
            <ASelect
              v-model="page.quickEntryForm.category_key"
              class="select"
              :options="quickCategorySelectOptions"
              :disabled="page.quickCategoryLocked"
              :searchable="false"
            />
          </label>

          <label v-if="page.quickEntryForm.category_key" class="ui-accounting-field">
            <span>Subcategoría</span>
            <ASelect
              v-model="page.quickEntryForm.subcategory_key"
              class="select"
              :options="quickSubcategorySelectOptions"
              :disabled="page.quickSubcategoryLocked"
            />
          </label>
        </template>
      </template>

      <details class="qe-more">
        <summary class="qe-more-summary">Más detalles (titularidad, fecha, nota)</summary>
        <div class="qe-more-body">
          <label class="ui-accounting-field">
            <span>Titularidad</span>
            <ASelect
              v-model="page.quickEntryForm.ownership_id"
              class="select"
              :options="page.ownershipOptions"
              :searchable="false"
            />
          </label>

          <div class="qe-date-block">
            <label class="ui-accounting-field">
              <span>Fecha</span>
              <input
                v-model="page.quickEntryForm.booking_date"
                type="date"
                class="input"
                required
              />
            </label>

            <div v-if="!showValueDate" class="qe-value-date-hint">
              <span class="qe-value-date-spacer" aria-hidden="true" />
              <button type="button" class="qe-value-date-hint-btn" @click="showValueDate = true">
                ↳ fecha valor
                <span class="qe-value-date-equal">igual</span>
              </button>
            </div>

            <label v-else class="ui-accounting-field">
              <span>Fecha valor</span>
              <div class="ui-accounting-value-date-input-row">
                <input
                  v-model="page.quickEntryForm.value_date"
                  type="date"
                  class="input"
                  required
                />
                <button
                  type="button"
                  class="ui-accounting-value-date-close"
                  @click="showValueDate = false"
                >
                  ×
                </button>
              </div>
            </label>
          </div>

          <label class="ui-accounting-field">
            <span>Nota</span>
            <textarea
              v-model="page.quickEntryForm.notes"
              class="textarea"
              rows="2"
              placeholder="Nota opcional para el movimiento"
            />
          </label>
        </div>
      </details>

      <div class="qe-footer">
        <p v-if="page.error" class="qe-error" role="alert">
          <span class="qe-error-icon" aria-hidden="true">!</span>
          <span>{{ page.error }}</span>
        </p>
        <div v-if="isComplexMovement" class="a-mov-entry-confirmation" aria-live="polite">
          <span>Asiento que se registrará</span>
          <strong>{{ confirmationSummary }}</strong>
        </div>
        <p
          v-else-if="!page.quickEntryReady && !page.transactionCreationLoading"
          class="ui-accounting-inline-note qe-footer-note"
        >
          {{ quickEntryHint }}
        </p>
        <AButton
          variant="primary"
          type="submit"
          block
          :disabled="page.transactionCreationLoading || !page.quickEntryReady"
        >
          {{ page.transactionCreationLoading ? 'Guardando...' : 'Registrar movimiento' }}
        </AButton>
      </div>
    </form>
  </BaseModal>
</template>
