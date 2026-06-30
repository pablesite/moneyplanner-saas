<script setup lang="ts">
import { AChevron, ASectHead, ASelect } from '@/domains/ui';
import { computed, ref } from 'vue';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;

const yearOptions = computed(() => state.yearOptions.map((y) => ({ value: y, label: String(y) })));
const technicalAccountsOpen = ref(false);

function syncTechnicalAccountsOpen(event: Event): void {
  technicalAccountsOpen.value = (event.currentTarget as HTMLDetailsElement).open;
}
</script>

<template>
  <div>
    <ASectHead title="Estadísticas" subtitle="Balance contable del año">
      <template #actions>
        <ASelect
          v-model="state.selectedYear"
          :options="yearOptions"
          class="filter-ctrl"
          :searchable="false"
          @update:model-value="state.reloadPeriod"
        />
      </template>
    </ASectHead>

    <div class="kpis a-mov-stats-kpis">
      <div class="kpi a-mov-stats-kpi-first">
        <p class="kpi-label">Activos contables</p>
        <div class="kpi-value mono">{{ state.formatMoney(state.accountingAssetsTotal) }}</div>
        <div class="kpi-meta">{{ (state.accountsByType.get('asset') ?? []).length }} cuentas</div>
      </div>
      <div class="kpi">
        <p class="kpi-label">Pasivos contables</p>
        <div class="kpi-value mono">{{ state.formatMoney(state.accountingLiabilitiesTotal) }}</div>
        <div class="kpi-meta">
          {{ (state.accountsByType.get('liability') ?? []).length }} cuentas
        </div>
      </div>
    </div>

    <div v-if="state.summaryRows.length" class="a-mov-cashflow">
      <div class="a-mov-cashflow-label">Flujo mensual · {{ state.selectedYear }}</div>
      <div class="a-mov-cashflow-grid">
        <div v-for="row in state.summaryRows" :key="row.month" class="a-mov-cashflow-col">
          <div class="a-mov-cashflow-mon">{{ state.monthLabel(row.month) }}</div>
          <div
            class="mono a-mov-cashflow-val"
            :class="row.incomeValue - row.expenseValue >= 0 ? 'is-positive' : 'is-negative'"
          >
            {{ row.incomeValue - row.expenseValue >= 0 ? '+' : '−'
            }}{{ state.formatMoney(Math.abs(row.incomeValue - row.expenseValue)) }}
          </div>
          <div class="a-mov-cashflow-meta">
            <span class="is-positive">↑{{ state.formatMoney(row.incomeValue) }}</span>
            <span class="a-mov-cashflow-divider"> / </span>
            <span class="is-negative">↓{{ state.formatMoney(row.expenseValue) }}</span>
          </div>
        </div>
      </div>
      <p class="a-mov-cashflow-note">
        Solo incluye cuentas contables activas. No incluye vivienda, mobiliario u otros activos
        fuera del libro contable.
      </p>
    </div>

    <details
      v-if="state.hasTechnicalAccounts"
      class="a-mov-technical"
      @toggle="syncTechnicalAccountsOpen"
    >
      <summary>
        <AChevron :expanded="technicalAccountsOpen" />
        Contrapartidas técnicas del sistema
        <span class="chip a-mov-technical-count">{{
          state.technicalAccountTypeOptions.length
        }}</span>
      </summary>
      <p class="a-mov-technical-note">
        Estas cuentas siguen existiendo por compatibilidad interna, pero no forman parte del
        catálogo operativo que se gestiona manualmente.
      </p>
      <template v-for="type in state.technicalAccountTypeOptions" :key="type.value">
        <div
          v-for="account in state.accountsByType.get(type.value)"
          :key="account.id"
          class="a-mov-technical-row"
        >
          <div>
            <div class="a-mov-technical-name">{{ account.name }}</div>
            <div class="a-mov-technical-meta">
              <span class="chip">{{ account.currency }}</span>
              <span class="chip">{{ account.origin }}</span>
            </div>
          </div>
          <div class="mono a-mov-technical-balance">
            {{ state.formatCompact(account.current_balance, account.currency) }}
          </div>
        </div>
      </template>
    </details>
  </div>
</template>
