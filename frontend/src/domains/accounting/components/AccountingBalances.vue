<script setup lang="ts">
import { ASectHead, ASelect } from '@/domains/ui';
import { computed } from 'vue';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;

const yearOptions = computed(() => state.yearOptions.map((y) => ({ value: y, label: String(y) })));
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

    <div
      class="kpis"
      style="grid-template-columns: 1fr 1fr; padding-top: 16px; border-top: 1px solid var(--line)"
    >
      <div class="kpi" style="padding-left: 0">
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

    <div v-if="state.summaryRows.length" style="margin-top: 20px">
      <div class="a-mov-cashflow-label">Flujo mensual · {{ state.selectedYear }}</div>
      <div class="a-mov-cashflow-grid">
        <div v-for="row in state.summaryRows" :key="row.month" class="a-mov-cashflow-col">
          <div class="a-mov-cashflow-mon">{{ state.monthLabel(row.month) }}</div>
          <div
            class="mono a-mov-cashflow-val"
            :style="{
              color: row.incomeValue - row.expenseValue >= 0 ? 'var(--pos)' : 'var(--neg)',
            }"
          >
            {{ row.incomeValue - row.expenseValue >= 0 ? '+' : '−'
            }}{{ state.formatMoney(Math.abs(row.incomeValue - row.expenseValue)) }}
          </div>
          <div class="a-mov-cashflow-meta">
            <span style="color: var(--pos)">↑{{ state.formatMoney(row.incomeValue) }}</span>
            <span style="color: var(--faint)"> / </span>
            <span style="color: var(--neg)">↓{{ state.formatMoney(row.expenseValue) }}</span>
          </div>
        </div>
      </div>
      <p class="a-mov-cashflow-note">
        Solo incluye cuentas contables activas. No incluye vivienda, mobiliario u otros activos
        fuera del libro contable.
      </p>
    </div>

    <details v-if="state.hasTechnicalAccounts" class="a-mov-technical">
      <summary>
        <span style="font-size: 11px">▸</span>
        Contrapartidas técnicas del sistema
        <span class="chip" style="margin-left: 4px; font-size: 11px">{{
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
            <div style="font-size: 13px">{{ account.name }}</div>
            <div
              style="font-size: 11px; color: var(--faint); margin-top: 2px; display: flex; gap: 6px"
            >
              <span class="chip" style="font-size: 10px">{{ account.currency }}</span>
              <span class="chip" style="font-size: 10px">{{ account.origin }}</span>
            </div>
          </div>
          <div class="mono" style="font-size: 13px; color: var(--muted)">
            {{ state.formatCompact(account.current_balance, account.currency) }}
          </div>
        </div>
      </template>
    </details>
  </div>
</template>
