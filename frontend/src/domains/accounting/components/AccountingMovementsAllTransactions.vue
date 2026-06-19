<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import { AKindChip, ARowMenu, ASelect } from '@/domains/ui';
import type { ASelectItem } from '@/domains/ui';
import type { LedgerTransaction } from '@/domains/accounting/models';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';

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

function signedImpactForRow(transaction: LedgerTransaction): number {
  const baseAmount = state.transactionMainAmount(transaction);
  if (transaction.activity_kind === 'income') return baseAmount;
  if (transaction.activity_kind === 'expense' || transaction.activity_kind === 'debt_payment') {
    return -baseAmount;
  }
  if (transaction.activity_kind === 'investment') return 0;
  if (
    transaction.activity_kind === 'revaluation' ||
    transaction.activity_kind === 'opening_balance'
  ) {
    const linkedEntry = transaction.entries.find(
      (entry) => entry.asset_id != null || entry.liability_id != null,
    );
    if (linkedEntry) return linkedEntry.side === 'debit' ? baseAmount : -baseAmount;
    const flowEntry = transaction.entries.find((e) => e.flow_family !== '');
    if (flowEntry) return flowEntry.side === 'credit' ? baseAmount : -baseAmount;
    const firstEntry = transaction.entries[0];
    if (firstEntry) return firstEntry.side === 'debit' ? baseAmount : -baseAmount;
    return 0;
  }
  return 0;
}

function amountColor(tx: LedgerTransaction): string {
  const v = signedImpactForRow(tx);
  if (v > 0) return 'var(--pos)';
  if (v < 0) return 'var(--neg)';
  return 'var(--muted)';
}

function debitAccount(tx: LedgerTransaction): string {
  return tx.entries.find((e) => e.side === 'debit')?.account_name ?? '—';
}

function creditAccount(tx: LedgerTransaction): string {
  return tx.entries.find((e) => e.side === 'credit')?.account_name ?? '—';
}

const netDelta = computed(() =>
  state.todosTransactions.reduce((sum, tx) => sum + signedImpactForRow(tx), 0),
);

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
        class="filter-ctrl"
        style="min-width: 200px; flex: 0 1 240px"
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
        <button class="filter-ctrl" type="button" @click="toggleDateDropdown">
          {{ activeDateLabel() }} ▾
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
              <input v-model="state.todosDateFrom" class="filter-ctrl" type="date" title="Desde" />
              <input v-model="state.todosDateTo" class="filter-ctrl" type="date" title="Hasta" />
            </div>
          </template>
        </div>
      </div>
      <!-- Count + net -->
      <span class="filter-count">
        <strong>{{ state.todosTransactions.length }}</strong>
        <span style="color: var(--faint)"> de </span>
        {{ state.todosTotalCount }}
        <span class="dot" />
        <span class="mono" :style="{ color: netDelta >= 0 ? 'var(--pos)' : 'var(--neg)' }">
          {{ state.formatSignedMoney(netDelta) }}
        </span>
        neto
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
    <table v-else class="a-mov-todos-table">
      <thead>
        <tr>
          <th style="width: 90px">Fecha</th>
          <th style="width: 30%">Concepto</th>
          <th>Tipo</th>
          <th>Debe</th>
          <th>Haber</th>
          <th class="num">Importe</th>
          <th style="width: 36px"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="transaction in state.todosTransactions"
          :key="transaction.id"
          class="clickable"
          @click="transaction.origin !== 'system' && state.openEditTransactionModal(transaction.id)"
        >
          <td class="mono" style="color: var(--muted); font-size: 12.5px">
            {{ state.formatDate(transaction.booking_date) }}
          </td>
          <td>
            <div style="font-size: 14px">{{ transaction.description }}</div>
          </td>
          <td>
            <AKindChip :tone="kindTone(transaction)">
              {{ state.activityKindLabel(transaction) }}
            </AKindChip>
          </td>
          <td style="color: var(--muted); font-size: 12.5px">{{ debitAccount(transaction) }}</td>
          <td style="color: var(--muted); font-size: 12.5px">{{ creditAccount(transaction) }}</td>
          <td class="num mono" :style="{ color: amountColor(transaction) }">
            {{ state.formatSignedMoney(signedImpactForRow(transaction)) }}
          </td>
          <td @click.stop>
            <ARowMenu
              v-if="transaction.origin !== 'system'"
              :items="rowMenuItems(transaction)"
              label="Acciones del movimiento"
              @select="handleMenuSelect($event, transaction)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="state.todosHasMore" class="a-mov-load-more">
      <button
        class="btn"
        type="button"
        :disabled="state.todosLoadingMore"
        @click="state.loadMoreTodos"
      >
        {{ state.todosLoadingMore ? 'Cargando...' : 'Cargar más' }}
      </button>
    </div>
    <p v-else-if="state.todosTransactions.length" class="a-mov-load-hint">
      Todos los movimientos cargados
    </p>
  </div>
</template>
