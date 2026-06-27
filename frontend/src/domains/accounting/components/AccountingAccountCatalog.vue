<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AButton, AKindChip } from '@/domains/ui';
import type { AccountingMovementsPageState } from '@/domains/accounting/useAccountingMovementsPage';

const props = defineProps<{ page: AccountingMovementsPageState }>();
const state = props.page;
const router = useRouter();
const query = ref('');

const filteredGroups = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase('es');
  if (!needle) return state.groupedCatalogAccounts;
  return state.groupedCatalogAccounts
    .map((group) => ({
      ...group,
      accounts: group.accounts.filter((account) =>
        state.accountDisplayName(account).toLocaleLowerCase('es').includes(needle),
      ),
    }))
    .filter((group) => group.accounts.length > 0);
});

const technicalAccounts = computed(() => state.catalogTechnicalAccounts);

// Resumen de saldos del ámbito visible (reutiliza los subtotales que ya calcula
// buildCuentasGroups, convertidos a la moneda base vía amount_base).
const operationalCount = computed(() =>
  filteredGroups.value.reduce((total, group) => total + group.accounts.length, 0),
);
const summaryCurrency = computed(() => filteredGroups.value[0]?.baseCurrency ?? 'EUR');
const assetsTotal = computed(() =>
  filteredGroups.value
    .filter((group) => group.positionType === 'asset')
    .reduce((sum, group) => sum + group.subtotal, 0),
);
const liabilitiesTotal = computed(() =>
  filteredGroups.value
    .filter((group) => group.positionType === 'liability')
    .reduce((sum, group) => sum + group.subtotal, 0),
);
const netTotal = computed(() => assetsTotal.value - liabilitiesTotal.value);

const collapsedGroups = ref(new Set<string>());
function isGroupCollapsed(key: string): boolean {
  return collapsedGroups.value.has(key);
}
function toggleGroup(key: string): void {
  const groups = collapsedGroups.value;
  if (groups.has(key)) groups.delete(key);
  else groups.add(key);
}

function toggleAccount(accountId: number) {
  state.cuentasSelectedAccountId = state.cuentasSelectedAccountId === accountId ? null : accountId;
}

function goToTodos(accountId: number) {
  void router.push({ name: 'accounting-movements', query: { account_id: String(accountId) } });
}
</script>

<template>
  <div>
    <div class="a-mov-account-tools">
      <div class="a-mov-account-scope-row">
        <span class="a-mov-catalog-summary-count">
          {{ operationalCount }}
          {{ state.accountCatalogScope === 'active' ? 'activas' : 'cuentas' }}
        </span>
        <div class="a-mov-catalog-scope" role="group" aria-label="Ámbito de cuentas">
          <button
            type="button"
            :class="{ on: state.accountCatalogScope === 'active' }"
            @click="state.setAccountCatalogScope('active')"
          >
            Activas
          </button>
          <button
            type="button"
            :class="{ on: state.accountCatalogScope === 'all' }"
            @click="state.setAccountCatalogScope('all')"
          >
            Todas
          </button>
        </div>
      </div>
      <input
        v-model="query"
        class="filter-ctrl a-mov-account-search"
        placeholder="Buscar cuenta…"
      />
    </div>

    <div class="a-mov-catalog-summary">
      <div class="a-mov-catalog-summary-figs">
        <div class="a-mov-catalog-summary-fig">
          <span>Activos</span>
          <strong class="mono">{{
            state.formatCompact(String(assetsTotal), summaryCurrency)
          }}</strong>
        </div>
        <div class="a-mov-catalog-summary-fig">
          <span>Pasivos</span>
          <strong class="mono is-liability">{{
            state.formatCompact(String(liabilitiesTotal), summaryCurrency)
          }}</strong>
        </div>
        <div class="a-mov-catalog-summary-fig">
          <span>Neto</span>
          <strong class="mono">{{ state.formatCompact(String(netTotal), summaryCurrency) }}</strong>
        </div>
      </div>
    </div>

    <div
      v-if="
        (state.cuentasLoading || state.accountCatalogLoading) &&
        !state.groupedCatalogAccounts.length
      "
      class="a-mov-loading-state"
    >
      <div class="ui-import-spinner"></div>
      <span>Cargando cuentas...</span>
    </div>

    <div v-else class="a-mov-catalog-scroll">
      <table class="a-mov-catalog-table">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th class="num">Saldo</th>
            <th class="a-mov-catalog-menu-head"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in filteredGroups" :key="group.key">
            <!-- Group header row (collapsible) -->
            <tr class="grp-row">
              <td colspan="3">
                <button
                  type="button"
                  class="a-mov-grp-toggle"
                  :aria-expanded="!isGroupCollapsed(group.key)"
                  @click="toggleGroup(group.key)"
                >
                  <span class="a-mov-grp-chevron" aria-hidden="true">{{
                    isGroupCollapsed(group.key) ? '▸' : '▾'
                  }}</span>
                  <span class="grp-kind" :class="`grp-kind-${group.positionType}`">
                    {{ group.positionType === 'asset' ? 'ACTIVOS' : 'PASIVOS' }}
                  </span>
                  {{ group.label }}
                  <span class="a-mov-grp-meta">
                    <span class="a-mov-grp-count">{{ group.accounts.length }}</span>
                    <span
                      class="a-mov-grp-subtotal mono"
                      :class="{ 'is-liability': group.positionType === 'liability' }"
                      >{{ state.formatCompact(String(group.subtotal), group.baseCurrency) }}</span
                    >
                  </span>
                </button>
              </td>
            </tr>

            <!-- Account rows -->
            <template
              v-for="account in isGroupCollapsed(group.key) ? [] : group.accounts"
              :key="account.id"
            >
              <tr
                class="clickable"
                :class="{ 'row-active': state.cuentasSelectedAccountId === account.id }"
                @click="toggleAccount(account.id)"
              >
                <td class="a-mov-catalog-kind">
                  <div class="name">
                    <span class="swatch" :class="{ lia: group.positionType === 'liability' }" />
                    <div>
                      <div class="nameMain">
                        {{ state.accountDisplayName(account) }}
                        <span v-if="!account.is_active" class="a-mov-account-inactive-tag"
                          >Inactiva</span
                        >
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="num mono a-mov-catalog-balance"
                  :class="{ 'is-liability': group.positionType === 'liability' }"
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
                <td colspan="3">
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
                    <div
                      v-else-if="!state.cuentasTransactions.length"
                      class="a-mov-expansion-state"
                    >
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
                        <span class="mono a-mov-expansion-amount" :class="`is-${mov.tone}`">
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

    <details v-if="technicalAccounts.length" class="a-mov-technical a-mov-account-technical">
      <summary>
        <span>Cuentas técnicas</span>
        <span class="a-mov-technical-count">{{ technicalAccounts.length }}</span>
      </summary>
      <p class="a-mov-technical-note">
        Contrapartidas internas usadas para mantener la partida doble. No forman parte del saldo
        operativo.
      </p>
      <button
        v-for="account in technicalAccounts"
        :key="account.id"
        class="a-mov-technical-row"
        type="button"
        @click="goToTodos(account.id)"
      >
        <span class="a-mov-technical-name">{{ state.accountDisplayName(account) }}</span>
        <span class="a-mov-technical-meta"
          >{{ account.account_type }} · {{ account.currency }}</span
        >
        <span class="mono a-mov-technical-balance">
          {{ state.formatCompact(account.current_balance, account.currency) }}
        </span>
      </button>
    </details>
  </div>
</template>
