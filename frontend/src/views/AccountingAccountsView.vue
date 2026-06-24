<script setup lang="ts">
import '@/domains/accounting/styles/movements.css';
import '@/domains/accounting/styles/accounting-movements-view.css';
import { useAccountingMovementsPage } from '@/domains/accounting/useAccountingMovementsPage';
import AccountingAccountCatalog from '@/domains/accounting/components/AccountingAccountCatalog.vue';
import AccountingMovementsActivationModal from '@/domains/accounting/components/AccountingMovementsActivationModal.vue';
import AccountingTabs from '@/domains/accounting/components/AccountingTabs.vue';
import { AButton, APageHead, AState } from '@/domains/ui';

const page = useAccountingMovementsPage();
</script>

<template>
  <div class="page a-mov-page a-mov-accounts-page">
    <APageHead title="Cuentas contables">
      <template #actions>
        <AButton v-if="page.hasAvailableManualPositions" @click="page.openActivationModal">
          + Activar cuenta
        </AButton>
      </template>
    </APageHead>

    <AccountingTabs />

    <AState v-if="page.error" status="error">{{ page.error }}</AState>
    <section class="sect a-mov-accounts-section">
      <AccountingAccountCatalog :page="page" />
    </section>
    <AccountingMovementsActivationModal :page="page" />
  </div>
</template>
