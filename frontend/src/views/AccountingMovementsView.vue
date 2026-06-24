<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/domains/accounting/styles/movements.css';
import '@/domains/accounting/styles/accounting-movements-view.css';
import { useAccountingMovementsPage } from '@/domains/accounting/useAccountingMovementsPage';
import AccountingMovementsAllTransactions from '@/domains/accounting/components/AccountingMovementsAllTransactions.vue';
import AccountingMovementsEditTransactionModal from '@/domains/accounting/components/AccountingMovementsEditTransactionModal.vue';
import AccountingMovementsQuickEntryModal from '@/domains/accounting/components/AccountingMovementsQuickEntryModal.vue';
import AccountingTabs from '@/domains/accounting/components/AccountingTabs.vue';
import { AButton, APageHead, AState } from '@/domains/ui';

const route = useRoute();
const router = useRouter();
const page = useAccountingMovementsPage();
const routeReady = ref(false);
let applyingRoute = false;

function queryValue(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
}

async function applyRouteQuery(): Promise<void> {
  applyingRoute = true;
  const query = route.query;
  page.activityFilters.query = queryValue(query.q);
  page.activityFilters.accountId = queryValue(query.account_id) || 'all';
  page.activityFilters.kind = (queryValue(query.kind) || 'all') as typeof page.activityFilters.kind;
  await nextTick();
  page.activityFilters.categoryKey = queryValue(query.category_key);
  await nextTick();
  page.activityFilters.subcategoryKey = queryValue(query.subcategory_key);
  const ownership = queryValue(query.ownership_id);
  page.activityFilters.ownershipId =
    !ownership || ownership === 'all' ? 'all' : ownership === 'null' ? null : Number(ownership);
  page.activityFilters.reviewState =
    queryValue(query.review_state) === 'needs_review' ? 'needs_review' : 'all';
  page.todosDateFrom = queryValue(query.date_from);
  page.todosDateTo = queryValue(query.date_to);
  if (page.todosDateFrom || page.todosDateTo) page.todosDatePreset = 'custom';
  await nextTick();
  applyingRoute = false;
}

function currentQuery(): Record<string, string> {
  const query: Record<string, string> = {};
  if (page.activityFilters.query.trim()) query.q = page.activityFilters.query.trim();
  if (page.activityFilters.accountId !== 'all') query.account_id = page.activityFilters.accountId;
  if (page.activityFilters.kind !== 'all') query.kind = page.activityFilters.kind;
  if (page.activityFilters.categoryKey) query.category_key = page.activityFilters.categoryKey;
  if (page.activityFilters.subcategoryKey)
    query.subcategory_key = page.activityFilters.subcategoryKey;
  if (page.activityFilters.ownershipId !== 'all')
    query.ownership_id =
      page.activityFilters.ownershipId === null ? 'null' : String(page.activityFilters.ownershipId);
  if (page.activityFilters.reviewState === 'needs_review') query.review_state = 'needs_review';
  if (page.todosDateFrom) query.date_from = page.todosDateFrom;
  if (page.todosDateTo) query.date_to = page.todosDateTo;
  return query;
}

function reviewPending(): void {
  page.activityFilters.reviewState = 'needs_review';
}

onMounted(async () => {
  await applyRouteQuery();
  routeReady.value = true;
});

watch(
  () => route.query,
  () => {
    if (routeReady.value && !applyingRoute) void applyRouteQuery();
  },
  { deep: true },
);

watch(
  [
    () => page.activityFilters.query,
    () => page.activityFilters.accountId,
    () => page.activityFilters.kind,
    () => page.activityFilters.categoryKey,
    () => page.activityFilters.subcategoryKey,
    () => page.activityFilters.ownershipId,
    () => page.activityFilters.reviewState,
    () => page.todosDateFrom,
    () => page.todosDateTo,
  ],
  () => {
    if (!routeReady.value || applyingRoute) return;
    const next = currentQuery();
    const existing = Object.fromEntries(
      Object.entries(route.query).map(([key, value]) => [key, queryValue(value)]),
    );
    if (JSON.stringify(next) !== JSON.stringify(existing)) {
      void router.replace({ name: 'accounting-movements', query: next });
    }
  },
);
</script>

<template>
  <div class="page a-mov-page a-mov-operations-page">
    <APageHead title="Contabilidad">
      <template #meta>
        <span class="a-mov-head-count">
          <strong class="mono">{{ page.todosTotalCount }}</strong> movimientos
        </span>
        <button
          v-if="page.todosNeedsReviewCount > 0"
          class="a-mov-review-badge"
          type="button"
          @click="reviewPending"
        >
          {{ page.todosNeedsReviewCount }} por revisar
        </button>
      </template>
      <template #actions>
        <AButton
          variant="primary"
          class="a-mov-header-create"
          :disabled="!page.liquidityAccounts.length"
          @click="page.showQuickEntryModal = true"
        >
          + Nuevo movimiento
        </AButton>
      </template>
    </APageHead>

    <AccountingTabs />

    <AState v-if="page.error" status="error">{{ page.error }}</AState>
    <AState v-if="page.successMessage" status="success">{{ page.successMessage }}</AState>

    <section class="sect a-mov-ledger-section">
      <AccountingMovementsAllTransactions :page="page" />
    </section>

    <AButton
      variant="primary"
      class="a-mov-mobile-create"
      :disabled="!page.liquidityAccounts.length"
      aria-label="Nuevo movimiento"
      @click="page.showQuickEntryModal = true"
    >
      <span class="a-mov-fab-plus" aria-hidden="true">+</span>
      <span class="a-mov-fab-label">Nuevo movimiento</span>
    </AButton>

    <AccountingMovementsEditTransactionModal :page="page" />
    <AccountingMovementsQuickEntryModal :page="page" />
  </div>
</template>
