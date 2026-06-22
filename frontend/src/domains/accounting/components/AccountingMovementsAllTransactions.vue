<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import { AButton, AKindChip, ARowMenu, ASelect } from '@/domains/ui';
import type { ASelectItem } from '@/domains/ui';
import type { LedgerTransaction } from '@/domains/accounting/models';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';
import { buildMovementPresentation } from '@/domains/accounting/movementPresentation';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;

const dateDropdownOpen = ref(false);

function toggleDateDropdown() {
  dateDropdownOpen.value = !dateDropdownOpen.value;
}

function selectDatePreset(preset: (typeof state.datePresetOptions)[number]['value']) {
  state.applyDatePreset(preset);
  if (preset !== 'custom') {
    dateDropdownOpen.value = false;
  }
}

function closeDateDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.a-mov-date-wrap')) {
    dateDropdownOpen.value = false;
  }
}

document.addEventListener('click', closeDateDropdown, true);
onBeforeUnmount(() => document.removeEventListener('click', closeDateDropdown, true));

const activeDateLabel = () => {
  const opt = state.datePresetOptions.find((o) => o.value === state.todosDatePreset);
  return opt?.label ?? 'Período';
};

function kindTone(tx: LedgerTransaction): 'default' | 'asset' | 'liability' | 'muted' {
  if (tx.activity_kind === 'income') return 'asset';
  if (tx.activity_kind === 'expense' || tx.activity_kind === 'debt_payment') return 'liability';
  return 'muted';
}

const selectedAccountId = computed(() => {
  const parsed = Number(state.activityFilters.accountId);
  return state.activityFilters.accountId === 'all' || !Number.isFinite(parsed) ? undefined : parsed;
});

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

const netDelta = computed(() =>
  movementRows.value.reduce((sum, row) => sum + row.presentation.aggregateImpact, 0),
);

const netCurrency = computed(() => {
  if (selectedAccountId.value == null) return state.dailyBalanceSeriesUnit || 'EUR';
  return (
    state.accounts.find((account) => account.id === selectedAccountId.value)?.currency ?? 'EUR'
  );
});

const netLabel = computed(() =>
  selectedAccountId.value == null ? 'resultado' : 'variación de la cuenta',
);

const netTone = computed(() => {
  if (netDelta.value > 0) return 'is-positive';
  if (netDelta.value < 0) return 'is-negative';
  return 'is-neutral';
});

function formattedRowAmount(row: (typeof movementRows.value)[number]['presentation']): string {
  return row.showSign
    ? state.formatSignedMoney(row.amount, row.currency)
    : state.formatMoney(row.amount, row.currency);
}

const showCategory = computed(() =>
  ['income', 'expense', 'investment', 'debt_payment'].includes(state.activityFilters.kind),
);

const accountOptions = computed<ASelectItem[]>(() => [
  { value: 'all', label: 'Cuenta' },
  ...state.groupedCuentasAccounts.map((group) => ({
    group: `${group.positionType === 'asset' ? 'Activos' : 'Pasivos'} · ${group.label}`,
    options: group.accounts.map((a) => ({
      value: String(a.id),
      label: state.accountDisplayName(a),
    })),
  })),
]);

const kindOptions: ASelectItem[] = [
  { value: 'all', label: 'Tipo' },
  { value: 'income', label: 'Ingresos' },
  { value: 'expense', label: 'Gastos' },
  { value: 'transfer', label: 'Transferencias' },
  { value: 'adjustment', label: 'Ajustes' },
  { value: 'investment', label: 'Inversión' },
  { value: 'debt_payment', label: 'Pago deuda' },
  { value: 'opening_balance', label: 'Saldo inicial' },
  { value: 'revaluation', label: 'Revalorizaciones' },
];

const categoryOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Categoría' },
  ...state.filterCategoryOptions.map((c) => ({ value: c.value, label: c.label })),
]);

const subcategoryOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Subcategoría' },
  ...state.filterSubcategoryOptions.map((s) => ({ value: s.value, label: s.label })),
]);

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
</script>

<template>
  <div>
    <!-- Filter bar -->
    <div class="filter-bar">
      <input
        v-model="state.activityFilters.query"
        class="filter-ctrl a-mov-search"
        placeholder="Buscar…"
      />
      <!-- Cuenta -->
      <ASelect
        v-model="state.activityFilters.accountId"
        :options="accountOptions"
        class="filter-ctrl"
      />
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
      <!-- Date popover -->
      <div class="a-mov-date-wrap">
        <button
          class="filter-ctrl a-mov-date-trigger"
          type="button"
          :aria-expanded="dateDropdownOpen ? 'true' : 'false'"
          @click="toggleDateDropdown"
        >
          <span>{{ activeDateLabel() }}</span>
          <span class="a-mov-date-caret" aria-hidden="true">▾</span>
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
          <template v-if="state.todosDatePreset === 'custom'">
            <hr />
            <div class="a-mov-popover-custom">
              <span class="a-mov-popover-label">Rango manual</span>
              <input v-model="state.todosDateFrom" class="filter-ctrl" type="date" title="Desde" />
              <input v-model="state.todosDateTo" class="filter-ctrl" type="date" title="Hasta" />
            </div>
          </template>
        </div>
      </div>
      <!-- Count + net -->
      <span class="filter-count">
        <strong>{{ state.todosTransactions.length }}</strong>
        <span class="a-mov-filter-faint"> de </span>
        {{ state.todosTotalCount }}
        <span class="dot" />
        <span class="mono a-mov-filter-net" :class="netTone">
          {{ state.formatSignedMoney(netDelta, netCurrency) }}
        </span>
        {{ netLabel }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="state.todosLoading && !state.todosTransactions.length" class="a-mov-loading-state">
      <div class="ui-import-spinner"></div>
      <span>Cargando movimientos...</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="!state.todosTransactions.length" class="a-mov-todos-empty">
      <div class="a-mov-todos-empty-title">Sin movimientos para estos filtros</div>
      <div>Prueba otro periodo o ajusta la búsqueda para ver actividad.</div>
    </div>

    <!-- Movements table -->
    <div v-else class="a-mov-table-scroll">
      <table class="a-mov-todos-table">
        <thead>
          <tr>
            <th class="a-mov-col-date">Fecha</th>
            <th class="a-mov-col-concept">Concepto</th>
            <th>Tipo</th>
            <th>Cuenta / origen</th>
            <th>Destino</th>
            <th>Categoría</th>
            <th class="num">Importe</th>
            <th class="a-mov-col-menu"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in movementRows"
            :key="row.transaction.id"
            class="clickable"
            @click="
              row.transaction.origin !== 'system' &&
              state.openEditTransactionModal(row.transaction.id)
            "
          >
            <td class="mono a-mov-row-date" data-label="Fecha">
              {{ state.formatDate(row.transaction.booking_date) }}
            </td>
            <td class="a-mov-row-concept" data-label="Concepto">
              {{ row.transaction.description }}
            </td>
            <td data-label="Tipo">
              <AKindChip :tone="kindTone(row.transaction)">
                {{ state.activityKindLabel(row.transaction) }}
              </AKindChip>
            </td>
            <td class="a-mov-row-account" data-label="Cuenta / origen">
              {{ row.presentation.accountName }}
            </td>
            <td class="a-mov-row-account" data-label="Destino">
              {{ row.presentation.destinationName ?? '—' }}
            </td>
            <td class="a-mov-row-classification" data-label="Categoría">
              <template v-if="row.presentation.classificationState === 'available'">
                <div
                  v-for="classification in row.presentation.classifications"
                  :key="`${classification.category}:${classification.subcategory}`"
                  class="a-mov-classification"
                >
                  <span>{{ classification.category }}</span>
                  <span>{{ classification.subcategory }}</span>
                </div>
              </template>
              <span
                v-else-if="row.presentation.classificationState === 'missing'"
                class="is-missing"
              >
                Sin categoría
              </span>
              <span v-else>—</span>
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
        </tbody>
      </table>
    </div>

    <div v-if="state.todosHasMore" class="a-mov-load-more">
      <AButton :disabled="state.todosLoadingMore" @click="state.loadMoreTodos">
        {{ state.todosLoadingMore ? 'Cargando...' : 'Cargar más' }}
      </AButton>
    </div>
    <p v-else-if="state.todosTransactions.length" class="a-mov-load-hint">
      Todos los movimientos cargados
    </p>
  </div>
</template>
