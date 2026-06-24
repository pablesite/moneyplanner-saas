<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
import { computed, ref, watch, type PropType } from 'vue';
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

function accountTypeLabel(accountType?: string): string {
  if (accountType === 'asset') return 'Activos';
  if (accountType === 'liability') return 'Pasivos';
  if (accountType === 'equity') return 'Patrimonio neto';
  if (accountType === 'income') return 'Ingresos';
  if (accountType === 'expense') return 'Gastos';
  return 'Otras cuentas';
}

function accountLabel(account: AccountOption): string {
  if (typeof props.page.accountDisplayName === 'function') {
    return props.page.accountDisplayName(account);
  }
  return account.display_name || account.name;
}

function groupAndSortAccounts(accounts: AccountOption[]): AccountGroup[] {
  const order = ['asset', 'liability', 'equity', 'income', 'expense', 'other'];
  const groups = new Map<string, AccountOption[]>();

  for (const account of accounts) {
    const key = account.account_type ?? 'other';
    const existing = groups.get(key) ?? [];
    existing.push(account);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(([key, grouped]) => ({
      key,
      label: accountTypeLabel(key),
      accounts: grouped
        .slice()
        .sort((left, right) =>
          accountLabel(left).localeCompare(accountLabel(right), 'es', { sensitivity: 'base' }),
        ),
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
        label: `${accountLabel(account)} / ${account.currency}`,
      })),
    })),
  ];
}

const liquidityGroups = computed(() => groupAndSortAccounts(props.page.liquidityAccounts));
const operationalGroups = computed(() => groupAndSortAccounts(props.page.editAccountOptions));
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
function typeTone(value: string): 'positive' | 'negative' | 'neutral' {
  if (value === 'income') return 'positive';
  if (value === 'expense' || value === 'debt_payment') return 'negative';
  return 'neutral';
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
    if (open) initialFormSnapshot.value = JSON.stringify(props.page.quickEntryForm);
  },
);

function requestClose(): void {
  const changed = JSON.stringify(props.page.quickEntryForm) !== initialFormSnapshot.value;
  if (changed && !window.confirm('¿Descartar los cambios de este movimiento?')) return;
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
  if (type === 'income' || type === 'expense') {
    return operationalGroups.value;
  }
  if (type === 'transfer') {
    return transferOriginGroups.value;
  }
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
  if (type === 'adjustment') return 'Cuenta a conciliar';
  if (type === 'income' || type === 'expense') return 'Cuenta contable';
  return 'Cuenta de liquidez';
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
</script>

<template>
  <BaseModal
    :open="page.showQuickEntryModal"
    title="Registrar movimiento"
    variant="sheet"
    panel-class="max-w-[920px] dir-a dir-a-sheet a-mov-entry-sheet"
    @close="requestClose"
  >
    <div v-if="!page.liquidityAccounts.length" class="ui-accounting-inline-note">
      Necesitas al menos una cuenta de liquidez para registrar movimientos.
    </div>

    <form
      class="ui-accounting-form ui-accounting-transaction-form ui-accounting-modal-form qe-form"
      @submit.prevent="page.submitQuickEntryFromModal"
    >
      <div class="qe-types" role="group" aria-label="Tipo de movimiento">
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

      <template v-if="page.quickEntryForm.movement_type === 'revaluation'">
        <label class="qe-amount-field">
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

        <label class="qe-amount-field">
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
        <label class="qe-amount-field">
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
        <label class="qe-amount-field">
          <span>{{
            page.quickEntryForm.movement_type === 'adjustment' ? 'Saldo final objetivo' : 'Importe'
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

      <label class="ui-accounting-field">
        <span>Concepto</span>
        <input
          v-model="page.quickEntryForm.description"
          class="input"
          placeholder="Nómina marzo, compra semanal, mover a ahorro..."
          required
        />
      </label>

      <div
        v-if="page.quickEntryNeedsClassification"
        class="ui-accounting-form-grid ui-accounting-form-grid-wide"
      >
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

        <label class="ui-accounting-field">
          <span>Subcategoría</span>
          <ASelect
            v-model="page.quickEntryForm.subcategory_key"
            class="select"
            :options="quickSubcategorySelectOptions"
            :disabled="page.quickSubcategoryLocked"
          />
        </label>
      </div>

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

          <label class="ui-accounting-field">
            <span>Fecha contabilización</span>
            <input v-model="page.quickEntryForm.booking_date" type="date" class="input" required />
          </label>

          <div class="ui-accounting-value-date-row">
            <AButton
              v-if="!showValueDate"
              class="ui-accounting-value-date-toggle"
              @click="showValueDate = true"
            >
              Fecha valor diferente
            </AButton>
            <label v-else class="ui-accounting-field">
              <span>Fecha valor</span>
              <div class="ui-accounting-value-date-input-row">
                <input
                  v-model="page.quickEntryForm.value_date"
                  type="date"
                  class="input"
                  required
                />
                <AButton class="ui-accounting-value-date-close" @click="showValueDate = false">
                  Misma fecha
                </AButton>
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
        <div v-if="isComplexMovement" class="a-mov-entry-confirmation" aria-live="polite">
          <span>Asiento que se registrará</span>
          <strong>{{ confirmationSummary }}</strong>
        </div>
        <p
          v-else-if="!page.quickEntryReady && !page.transactionCreationLoading"
          class="ui-accounting-inline-note qe-footer-note"
        >
          Completa importe, cuenta y concepto.
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
