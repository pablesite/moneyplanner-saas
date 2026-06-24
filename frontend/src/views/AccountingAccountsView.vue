<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/domains/accounting/styles/movements.css';
import '@/domains/accounting/styles/accounting-movements-view.css';
import { useAccountingMovementsPage } from '@/domains/accounting/useAccountingMovementsPage';
import AccountingAccountCatalog from '@/domains/accounting/components/AccountingAccountCatalog.vue';
import AccountingMovementsActivationModal from '@/domains/accounting/components/AccountingMovementsActivationModal.vue';
import { AButton, APageHead, AState } from '@/domains/ui';

const route = useRoute();
const router = useRouter();
const page = useAccountingMovementsPage();

const returnTo = computed(() => {
  const raw = Array.isArray(route.query.return_to)
    ? route.query.return_to[0]
    : route.query.return_to;
  return typeof raw === 'string' && raw.startsWith('/contabilidad') ? raw : '/contabilidad';
});

function goBack(): void {
  void router.push(returnTo.value);
}
</script>

<template>
  <div class="page a-mov-page a-mov-accounts-page">
    <APageHead title="Cuentas contables">
      <template #meta>
        <span>Activos, pasivos y contrapartidas técnicas</span>
      </template>
      <template #actions>
        <AButton variant="ghost" @click="goBack">← Volver a movimientos</AButton>
        <AButton v-if="page.hasAvailableManualPositions" @click="page.openActivationModal">
          + Activar cuenta
        </AButton>
      </template>
    </APageHead>

    <AState v-if="page.error" status="error">{{ page.error }}</AState>
    <section class="sect a-mov-accounts-section">
      <AccountingAccountCatalog :page="page" />
    </section>
    <AccountingMovementsActivationModal :page="page" />
  </div>
</template>
