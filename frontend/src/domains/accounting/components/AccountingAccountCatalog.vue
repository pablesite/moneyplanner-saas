<script setup lang="ts">
import { AButton, ASectHead, AKindChip } from '@/domains/ui';
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
          <th class="a-mov-catalog-menu-head"></th>
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
              <td class="a-mov-catalog-kind">
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
                class="num mono a-mov-catalog-balance"
                :style="{
                  color: group.positionType === 'liability' ? 'var(--neg)' : 'var(--text)',
                }"
              >
                {{ state.formatCompact(account.current_balance, account.currency) }}
              </td>
              <td>
                <AButton variant="icon" @click.stop="toggleAccount(account.id)">
                  <span aria-hidden="true">{{
                    state.cuentasSelectedAccountId === account.id ? '▾' : '▸'
                  }}</span>
                </AButton>
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
                    <AButton
                      variant="ghost"
                      class="a-mov-compact-action"
                      @click.stop="goToTodos(account.id)"
                    >
                      Ver todos →
                    </AButton>
                  </div>

                  <div v-if="state.cuentasLoading" class="a-mov-expansion-state">
                    Cargando movimientos...
                  </div>
                  <div v-else-if="!state.cuentasTransactions.length" class="a-mov-expansion-state">
                    Sin movimientos para este periodo.
                  </div>
                  <div v-else class="a-mov-expansion-list">
                    <div
                      v-for="mov in state.cuentasTransactions.slice(0, 6)"
                      :key="mov.id"
                      class="a-mov-expansion-row"
                    >
                      <span class="mono a-mov-expansion-date">
                        {{ state.formatDate(mov.booking_date) }}
                      </span>
                      <div>
                        <div class="a-mov-expansion-concept">{{ mov.description }}</div>
                        <div class="a-mov-expansion-trail">
                          {{ state.transactionAccountTrailLabel(mov) }}
                        </div>
                      </div>
                      <AKindChip class="a-mov-expansion-kind">
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
                    class="a-mov-expansion-more"
                  >
                    <AButton
                      variant="ghost"
                      class="a-mov-compact-action"
                      @click.stop="goToTodos(account.id)"
                    >
                      Ver todos los movimientos →
                    </AButton>
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
