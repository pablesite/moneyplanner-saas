<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { AButton, AKindChip, ARowMenu, ASelect, BaseModal } from '@/domains/ui';
import type { ASelectItem } from '@/domains/ui';
import type { LedgerTransaction } from '@/domains/accounting/models';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';
import { buildMovementPresentation } from '@/domains/accounting/movementPresentation';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;
const dateDropdownOpen = ref(false);
const mobileFiltersOpen = ref(false);
const selectedTransaction = ref<LedgerTransaction | null>(null);

const selectedAccountId = computed(() => {
  const parsed = Number(state.activityFilters.accountId);
  return state.activityFilters.accountId === 'all' || !Number.isFinite(parsed) ? undefined : parsed;
});

const scopedAccount = computed(() =>
  selectedAccountId.value == null
    ? null
    : (state.accounts.find((account) => account.id === selectedAccountId.value) ?? null),
);

const movementRows = computed(() =>
  state.todosTransactions.map((transaction) => ({
    transaction,
    presentation: buildMovementPresentation(transaction, {
      accounts: state.accounts,
      selectedAccountId: selectedAccountId.value,
      accountDisplayName: state.accountDisplayName,
    }),
  })),
);

const movementGroups = computed(() => {
  const groups: Array<{ date: string; label: string; rows: typeof movementRows.value }> = [];
  for (const row of movementRows.value) {
    let group = groups[groups.length - 1];
    if (!group || group.date !== row.transaction.booking_date) {
      group = {
        date: row.transaction.booking_date,
        label: state.formatDate(row.transaction.booking_date),
        rows: [],
      };
      groups.push(group);
    }
    group.rows.push(row);
  }
  return groups;
});

const showCategory = computed(() =>
  ['income', 'expense', 'investment', 'debt_payment'].includes(state.activityFilters.kind),
);
const activeFilterCount = computed(
  () =>
    Number(state.activityFilters.kind !== 'all') +
    Number(Boolean(state.activityFilters.categoryKey)) +
    Number(Boolean(state.activityFilters.subcategoryKey)) +
    Number(state.activityFilters.ownershipId !== 'all') +
    Number(state.activityFilters.reviewState !== 'all') +
    Number(Boolean(state.todosDateFrom || state.todosDateTo)),
);

const accountOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todas las cuentas' },
  ...state.groupedCuentasAccounts.map((group) => ({
    group: `${group.positionType === 'asset' ? 'Activos' : 'Pasivos'} · ${group.label}`,
    options: group.accounts.map((account) => ({
      value: String(account.id),
      label: state.accountDisplayName(account),
    })),
  })),
]);
const kindOptions: ASelectItem[] = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Gastos' },
  { value: 'transfer', label: 'Transferencias' },
  { value: 'investment', label: 'Inversiones' },
  { value: 'debt_payment', label: 'Pagos de deuda' },
  { value: 'adjustment', label: 'Ajustes' },
  { value: 'opening_balance', label: 'Saldos iniciales' },
  { value: 'revaluation', label: 'Revalorizaciones' },
];
const reviewOptions: ASelectItem[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'needs_review', label: 'Por revisar' },
  { value: 'reviewed', label: 'Clasificados' },
];
const ownershipOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Todas las titularidades' },
  ...state.ownershipFilterOptions.map((option) => ({
    value: option.value === null ? 'null' : String(option.value),
    label: option.label,
  })),
]);
const categoryOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Todas las categorías' },
  ...state.filterCategoryOptions.map((option) => ({ value: option.value, label: option.label })),
]);
const subcategoryOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Todas las subcategorías' },
  ...state.filterSubcategoryOptions.map((option) => ({
    value: option.value,
    label: option.label,
  })),
]);

function formattedRowAmount(row: (typeof movementRows.value)[number]['presentation']): string {
  return row.showSign
    ? state.formatSignedMoney(row.amount, row.currency)
    : state.formatMoney(row.amount, row.currency);
}

const selectedTransactionPresentation = computed(() => {
  if (!selectedTransaction.value) return null;
  return (
    movementRows.value.find((r) => r.transaction.id === selectedTransaction.value!.id)
      ?.presentation ?? null
  );
});
// Fecha valor solo se muestra cuando difiere de la contable (evita repetir la misma fecha).
const detailShowValueDate = computed(
  () =>
    !!selectedTransaction.value &&
    selectedTransaction.value.booking_date !== selectedTransaction.value.value_date,
);
// Impacto en € base: útil cuando el movimiento está en otra divisa (p. ej. stocks USD,
// cripto). Para transferencias/inversiones el impacto agregado es 0 y no se muestra.
const detailBaseImpact = computed(() => {
  const presentation = selectedTransactionPresentation.value;
  if (!presentation || presentation.currency === 'EUR' || !presentation.aggregateImpact) {
    return null;
  }
  return presentation.aggregateImpact;
});
function kindTone(tx: LedgerTransaction): 'default' | 'asset' | 'liability' | 'muted' {
  if (tx.activity_kind === 'income') return 'asset';
  if (tx.activity_kind === 'expense' || tx.activity_kind === 'debt_payment') return 'liability';
  return 'muted';
}
const KIND_GLYPHS: Record<string, string> = {
  income: '↓',
  expense: '↑',
  transfer: '⇄',
  investment: '↗',
  debt_payment: '↑',
  adjustment: '±',
  opening_balance: '●',
  revaluation: '↻',
};
function kindGlyph(tx: LedgerTransaction): string {
  return KIND_GLYPHS[tx.activity_kind] ?? '•';
}
function selectDatePreset(preset: (typeof state.datePresetOptions)[number]['value']) {
  state.applyDatePreset(preset);
  if (preset !== 'custom') dateDropdownOpen.value = false;
}
function activeDateLabel(): string {
  return (
    state.datePresetOptions.find((option) => option.value === state.todosDatePreset)?.label ??
    'Período'
  );
}
function setOwnership(value: string | number | null): void {
  state.activityFilters.ownershipId =
    value === 'all' ? 'all' : value === 'null' ? null : Number(value);
}
function clearFilters(): void {
  state.activityFilters.accountId = 'all';
  state.activityFilters.kind = 'all';
  state.activityFilters.categoryKey = '';
  state.activityFilters.subcategoryKey = '';
  state.activityFilters.ownershipId = 'all';
  state.activityFilters.reviewState = 'all';
  state.applyDatePreset('all');
}
function rowMenuItems(tx: LedgerTransaction) {
  if (tx.origin === 'system') return [];
  return [
    { id: 'edit', label: 'Editar' },
    { id: 'duplicate', label: 'Duplicar' },
    { id: 'delete', label: 'Eliminar', danger: true },
  ];
}
function handleMenuSelect(id: string, tx: LedgerTransaction) {
  if (id === 'edit') state.openEditTransactionModal(tx.id);
  else if (id === 'duplicate') state.openDuplicateFromTransaction(tx);
  else if (id === 'delete') state.deleteTransactionFromTimeline(tx.id, tx.description);
}
function editSelected(): void {
  const transaction = selectedTransaction.value;
  if (!transaction) return;
  selectedTransaction.value = null;
  state.openEditTransactionModal(transaction.id);
}
function deleteSelected(): void {
  const transaction = selectedTransaction.value;
  if (!transaction) return;
  selectedTransaction.value = null;
  state.deleteTransactionFromTimeline(transaction.id, transaction.description);
}
function closeDateDropdown(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('.a-mov-date-wrap')) dateDropdownOpen.value = false;
}
document.addEventListener('click', closeDateDropdown, true);
onBeforeUnmount(() => document.removeEventListener('click', closeDateDropdown, true));
</script>

<template>
  <div class="a-mov-ledger">
    <div class="a-mov-toolbar">
      <div class="a-mov-account-picker">
        <ASelect
          v-model="state.activityFilters.accountId"
          :options="accountOptions"
          class="filter-ctrl a-mov-account-select"
          aria-label="Cuenta"
        />
        <span
          v-if="scopedAccount"
          class="a-mov-account-balance mono"
          :class="{ 'is-liability': scopedAccount.account_type === 'liability' }"
        >
          {{ state.formatMoney(Number(scopedAccount.current_balance), scopedAccount.currency) }}
        </span>
      </div>
      <input
        v-model="state.activityFilters.query"
        class="filter-ctrl a-mov-search"
        placeholder="Buscar concepto, nota o cuenta…"
        aria-label="Buscar movimientos"
      />
      <AButton
        class="a-mov-mobile-filter-trigger"
        :class="{ on: mobileFiltersOpen }"
        @click="mobileFiltersOpen = !mobileFiltersOpen"
      >
        Filtros{{ activeFilterCount ? ` · ${activeFilterCount}` : '' }}
      </AButton>
      <div class="a-mov-filter-controls" :class="{ 'is-open': mobileFiltersOpen }">
        <ASelect v-model="state.activityFilters.kind" :options="kindOptions" class="filter-ctrl" />
        <ASelect
          v-if="showCategory"
          v-model="state.activityFilters.categoryKey"
          :options="categoryOptions"
          class="filter-ctrl"
        />
        <ASelect
          v-if="state.filterSubcategoryOptions.length"
          v-model="state.activityFilters.subcategoryKey"
          :options="subcategoryOptions"
          class="filter-ctrl"
        />
        <ASelect
          :model-value="
            state.activityFilters.ownershipId === null
              ? 'null'
              : String(state.activityFilters.ownershipId)
          "
          :options="ownershipOptions"
          class="filter-ctrl"
          @update:model-value="setOwnership"
        />
        <ASelect
          v-model="state.activityFilters.reviewState"
          :options="reviewOptions"
          class="filter-ctrl"
        />
        <div class="a-mov-date-wrap">
          <button
            class="filter-ctrl a-mov-date-trigger"
            type="button"
            :aria-expanded="dateDropdownOpen"
            @click="dateDropdownOpen = !dateDropdownOpen"
          >
            <span>{{ activeDateLabel() }}</span
            ><span aria-hidden="true">▾</span>
          </button>
          <div v-if="dateDropdownOpen" class="filter-popover">
            <button
              v-for="preset in state.datePresetOptions"
              :key="preset.value"
              :class="{ on: state.todosDatePreset === preset.value }"
              type="button"
              @click="selectDatePreset(preset.value)"
            >
              {{ preset.label }}
            </button>
            <div v-if="state.todosDatePreset === 'custom'" class="a-mov-popover-custom">
              <label
                >Desde <input v-model="state.todosDateFrom" class="filter-ctrl" type="date"
              /></label>
              <label
                >Hasta <input v-model="state.todosDateTo" class="filter-ctrl" type="date"
              /></label>
            </div>
          </div>
        </div>
        <div class="a-mov-filter-actions">
          <AButton v-if="activeFilterCount" variant="ghost" @click="clearFilters">Limpiar</AButton>
          <AButton class="a-mov-filters-close" variant="primary" @click="mobileFiltersOpen = false">
            Cerrar
          </AButton>
        </div>
      </div>
    </div>

    <div v-if="state.todosLoading && !state.todosTransactions.length" class="a-mov-loading-state">
      <div class="ui-import-spinner" />
      <span>Cargando movimientos…</span>
    </div>
    <div v-else-if="!state.todosTransactions.length" class="a-mov-todos-empty">
      <div class="a-mov-todos-empty-title">
        {{
          state.activityFilters.reviewState === 'needs_review'
            ? 'No quedan movimientos por revisar'
            : 'Sin movimientos para estos filtros'
        }}
      </div>
      <div>
        {{
          state.activityFilters.reviewState === 'needs_review'
            ? 'La clasificación está al día.'
            : 'Prueba otro período o limpia los filtros.'
        }}
      </div>
    </div>

    <div v-else class="a-mov-table-scroll">
      <table class="a-mov-todos-table a-mov-operations-table">
        <colgroup>
          <col class="a-mov-col-icon" />
          <col class="a-mov-col-concept" />
          <col class="a-mov-col-account" />
          <col class="a-mov-col-classification" />
          <col class="a-mov-col-ownership" />
          <col class="a-mov-col-amount" />
          <col class="a-mov-col-menu" />
        </colgroup>
        <thead>
          <tr>
            <th class="a-mov-row-icon" aria-hidden="true" />
            <th>Fecha y concepto</th>
            <th>Origen → destino</th>
            <th>Clasificación</th>
            <th>Titularidad</th>
            <th class="num">Importe</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <template v-for="group in movementGroups" :key="group.date">
            <tr class="a-mov-date-group">
              <th colspan="7">{{ group.label }}</th>
            </tr>
            <tr
              v-for="row in group.rows"
              :key="row.transaction.id"
              class="clickable"
              :class="{ 'needs-review': row.transaction.needs_review }"
              @click="selectedTransaction = row.transaction"
            >
              <td class="a-mov-row-icon" aria-hidden="true">
                <span class="a-mov-kind-icon" :class="`is-${kindTone(row.transaction)}`">{{
                  kindGlyph(row.transaction)
                }}</span>
              </td>
              <td class="a-mov-row-concept" data-label="Movimiento">
                <strong>{{ row.transaction.description }}</strong>
                <span class="a-mov-kind-chip"
                  ><AKindChip :tone="kindTone(row.transaction)">{{
                    state.activityKindLabel(row.transaction)
                  }}</AKindChip></span
                >
              </td>
              <td class="a-mov-row-account" data-label="Origen → destino">
                <span>{{ row.presentation.accountName }}</span>
                <span v-if="row.presentation.destinationName" class="a-mov-trail-arrow"
                  >→ {{ row.presentation.destinationName }}</span
                >
              </td>
              <td class="a-mov-row-classification" data-label="Clasificación">
                <template v-if="row.presentation.classificationState === 'available'">
                  <div
                    v-for="item in row.presentation.classifications"
                    :key="`${item.category}:${item.subcategory}`"
                    class="a-mov-classification"
                  >
                    <span>{{ item.category }}</span
                    ><span>{{ item.subcategory }}</span>
                  </div>
                </template>
                <button
                  v-else-if="row.transaction.needs_review"
                  class="a-mov-review-chip"
                  type="button"
                  @click.stop="state.openEditTransactionModal(row.transaction.id)"
                >
                  Por revisar
                </button>
                <span v-else>—</span>
              </td>
              <td class="a-mov-row-ownership" data-label="Titularidad">
                {{ state.transactionOwnershipShortLabel(row.transaction) ?? '—' }}
              </td>
              <td
                class="num mono a-mov-row-amount"
                :class="`is-${row.presentation.tone}`"
                data-label="Importe"
              >
                {{ formattedRowAmount(row.presentation) }}
              </td>
              <td class="a-mov-row-menu" data-label="Acciones" @click.stop>
                <ARowMenu
                  v-if="row.transaction.origin !== 'system'"
                  :items="rowMenuItems(row.transaction)"
                  label="Acciones del movimiento"
                  @select="handleMenuSelect($event, row.transaction)"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="state.todosHasMore" class="a-mov-load-more">
      <AButton :disabled="state.todosLoadingMore" @click="state.loadMoreTodos">
        {{ state.todosLoadingMore ? 'Cargando…' : 'Cargar más' }}
      </AButton>
    </div>

    <BaseModal
      :open="selectedTransaction != null"
      :title="selectedTransaction?.description"
      variant="sheet"
      panel-class="dir-a dir-a-sheet a-mov-detail-sheet"
      close-on-backdrop
      @close="selectedTransaction = null"
    >
      <div v-if="selectedTransaction" class="a-mov-detail">
        <div class="a-mov-detail-head">
          <span class="a-mov-kind-icon" :class="`is-${kindTone(selectedTransaction)}`">{{
            kindGlyph(selectedTransaction)
          }}</span>
          <span class="a-mov-detail-kind">{{ state.activityKindLabel(selectedTransaction) }}</span>
          <button
            v-if="selectedTransaction.needs_review"
            class="a-mov-review-chip a-mov-detail-review"
            type="button"
            @click="editSelected"
          >
            Por revisar
          </button>
        </div>

        <div
          v-if="selectedTransactionPresentation"
          class="a-mov-detail-amount mono"
          :class="`is-${selectedTransactionPresentation.tone}`"
        >
          {{ formattedRowAmount(selectedTransactionPresentation) }}
        </div>
        <div v-if="detailBaseImpact != null" class="a-mov-detail-base mono">
          ≈ {{ state.formatSignedMoney(detailBaseImpact, 'EUR') }}
        </div>

        <div v-if="selectedTransactionPresentation" class="a-mov-detail-flow">
          <span>{{ selectedTransactionPresentation.accountName }}</span>
          <span
            v-if="selectedTransactionPresentation.destinationName"
            class="a-mov-detail-flow-arrow"
            >→ {{ selectedTransactionPresentation.destinationName }}</span
          >
        </div>

        <div class="a-mov-detail-summary">
          <div>
            <span>Fecha</span
            ><strong>{{ state.formatDate(selectedTransaction.booking_date) }}</strong>
          </div>
          <div v-if="detailShowValueDate">
            <span>Fecha valor</span
            ><strong>{{ state.formatDate(selectedTransaction.value_date) }}</strong>
          </div>
          <div>
            <span>Titularidad</span
            ><strong>{{
              state.transactionOwnershipLabel(selectedTransaction) || 'Sin titularidad'
            }}</strong>
          </div>
          <div v-if="selectedTransactionPresentation?.classificationState !== 'not_applicable'">
            <span>Clasificación</span>
            <strong v-if="selectedTransactionPresentation?.classificationState === 'available'">{{
              state.transactionClassificationLabel(selectedTransaction)
            }}</strong>
            <button v-else class="a-mov-review-chip" type="button" @click="editSelected">
              Por clasificar
            </button>
          </div>
        </div>

        <p v-if="selectedTransaction.notes" class="a-mov-detail-notes">
          {{ selectedTransaction.notes }}
        </p>

        <details class="a-mov-detail-ledger">
          <summary>Asiento contable</summary>
          <div class="a-mov-detail-entries">
            <div class="a-mov-detail-entry a-mov-detail-entry-head">
              <span>Cuenta</span><span>Debe</span><span>Haber</span>
            </div>
            <div
              v-for="entry in selectedTransaction.entries"
              :key="entry.id"
              class="a-mov-detail-entry"
            >
              <span>{{ entry.account_name }}</span>
              <span class="mono">{{
                entry.side === 'debit'
                  ? state.formatMoney(Number(entry.amount), entry.currency)
                  : '—'
              }}</span>
              <span class="mono">{{
                entry.side === 'credit'
                  ? state.formatMoney(Number(entry.amount), entry.currency)
                  : '—'
              }}</span>
            </div>
          </div>
          <div class="a-mov-detail-origin">
            Registro: {{ selectedTransaction.origin === 'system' ? 'Automático' : 'Manual' }}
          </div>
        </details>
        <div v-if="selectedTransaction.origin !== 'system'" class="a-mov-detail-actions">
          <AButton variant="primary" @click="editSelected">Editar movimiento</AButton>
          <AButton
            @click="
              state.openDuplicateFromTransaction(selectedTransaction);
              selectedTransaction = null;
            "
            >Duplicar</AButton
          >
          <AButton variant="ghost" class="a-mov-detail-delete" @click="deleteSelected"
            >Eliminar</AButton
          >
        </div>
      </div>
    </BaseModal>
  </div>
</template>
