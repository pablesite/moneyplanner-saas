<script setup lang="ts">
import { ASectHead, AKindChip } from '@/domains/ui';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;

function toggleAccount(accountId: number) {
  state.cuentasSelectedAccountId = state.cuentasSelectedAccountId === accountId ? null : accountId;
}

function goToTodos(accountId: number) {
  state.activeTab = 'todos';
  state.activityFilters.accountId = String(accountId);
}
</script>

<template>
  <div>
    <ASectHead
      title="Cuentas"
      :subtitle="`${state.accounts.length} cuentas · click para ver movimientos`"
    />

    <div
      v-if="state.cuentasLoading && !state.groupedCuentasAccounts.length"
      class="a-mov-loading-state"
    >
      <div class="ui-import-spinner"></div>
      <span>Cargando cuentas...</span>
    </div>

    <table v-else class="a-mov-catalog-table">
      <thead>
        <tr>
          <th>Cuenta</th>
          <th>Tipo</th>
          <th class="num">Saldo</th>
          <th style="width: 36px"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="group in state.groupedCuentasAccounts" :key="group.key">
          <!-- Group header row -->
          <tr class="grp-row">
            <td colspan="4">
              <span class="grp-kind" :class="`grp-kind-${group.positionType}`">
                {{ group.positionType === 'asset' ? 'ACTIVOS' : 'PASIVOS' }}
              </span>
              {{ group.label }}
            </td>
          </tr>

          <!-- Account rows -->
          <template v-for="account in group.accounts" :key="account.id">
            <tr
              class="clickable"
              :class="{ 'row-active': state.cuentasSelectedAccountId === account.id }"
              @click="toggleAccount(account.id)"
            >
              <td>
                <div class="name">
                  <span class="swatch" :class="{ lia: group.positionType === 'liability' }" />
                  <div>
                    <div class="nameMain">{{ state.accountDisplayName(account) }}</div>
                  </div>
                </div>
              </td>
              <td>
                <AKindChip :tone="group.positionType === 'asset' ? 'asset' : 'liability'">
                  {{ group.positionType === 'asset' ? 'Activo' : 'Pasivo' }} · {{ group.label }}
                </AKindChip>
              </td>
              <td
                class="num mono"
                :style="{
                  color: group.positionType === 'liability' ? 'var(--neg)' : 'var(--text)',
                }"
              >
                {{ state.formatCompact(account.current_balance, account.currency) }}
              </td>
              <td>
                <button class="btn btn-icon" type="button" @click.stop="toggleAccount(account.id)">
                  <span aria-hidden="true">{{
                    state.cuentasSelectedAccountId === account.id ? '▾' : '▸'
                  }}</span>
                </button>
              </td>
            </tr>

            <!-- Expansion row -->
            <tr v-if="state.cuentasSelectedAccountId === account.id" class="a-mov-expansion">
              <td colspan="4">
                <div class="a-mov-expansion-inner">
                  <div class="a-mov-expansion-header">
                    <span class="a-mov-expansion-label">
                      Movimientos · {{ state.accountDisplayName(account) }}
                    </span>
                    <button
                      class="btn btn-ghost"
                      style="font-size: 12px"
                      type="button"
                      @click.stop="goToTodos(account.id)"
                    >
                      Ver todos →
                    </button>
                  </div>

                  <div
                    v-if="state.cuentasLoading"
                    style="color: var(--muted); font-size: 13px; padding: 8px 0"
                  >
                    Cargando movimientos...
                  </div>
                  <div
                    v-else-if="!state.cuentasTransactions.length"
                    style="color: var(--muted); font-size: 13px; padding: 8px 0"
                  >
                    Sin movimientos para este periodo.
                  </div>
                  <div v-else class="a-mov-expansion-list">
                    <div
                      v-for="mov in state.cuentasTransactions.slice(0, 6)"
                      :key="mov.id"
                      class="a-mov-expansion-row"
                    >
                      <span class="mono" style="color: var(--muted); font-size: 12px">
                        {{ state.formatDate(mov.booking_date) }}
                      </span>
                      <div>
                        <div style="font-size: 13.5px">{{ mov.description }}</div>
                        <div style="font-size: 11px; color: var(--muted)">
                          {{ state.transactionAccountTrailLabel(mov) }}
                        </div>
                      </div>
                      <AKindChip style="font-size: 11px">
                        {{ state.activityKindLabel(mov) }}
                      </AKindChip>
                      <span
                        class="mono a-mov-expansion-amount"
                        :style="{
                          color:
                            mov.tone === 'positive'
                              ? 'var(--pos)'
                              : mov.tone === 'negative'
                                ? 'var(--neg)'
                                : 'var(--muted)',
                        }"
                      >
                        {{
                          state.formatSignedMoney(
                            mov.impactValue,
                            state.cuentasSelectedAccount?.currency,
                          )
                        }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="state.cuentasTransactions.length > 6 || state.cuentasHasMore"
                    style="padding-top: 10px"
                  >
                    <button
                      class="btn btn-ghost"
                      style="font-size: 12px"
                      type="button"
                      @click.stop="goToTodos(account.id)"
                    >
                      Ver todos los movimientos →
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
