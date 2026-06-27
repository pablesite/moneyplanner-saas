<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import '@/domains/accounting/styles/movements.css';
import '@/domains/accounting/styles/accounting-movements-view.css';
import { useAccountingMovementsPage } from '@/domains/accounting/useAccountingMovementsPage';
import AccountingAccountCatalog from '@/domains/accounting/components/AccountingAccountCatalog.vue';
import AccountingMovementsActivationModal from '@/domains/accounting/components/AccountingMovementsActivationModal.vue';
import AccountingTabs from '@/domains/accounting/components/AccountingTabs.vue';
import { AButton, APageHead, AState } from '@/domains/ui';

const page = useAccountingMovementsPage();

// Pista de uso: popover que abre al tocar (en móvil el `title` nativo no aparece).
const showHint = ref(false);
function closeHint(event: MouseEvent): void {
  if (!(event.target as HTMLElement).closest('.a-mov-catalog-hint-wrap')) showHint.value = false;
}
onMounted(() => {
  document.addEventListener('click', closeHint, true);
  // Cargar las archivadas para que el total cuente activas + archivadas.
  page.ensureInactiveCatalogLoaded();
});
onBeforeUnmount(() => document.removeEventListener('click', closeHint, true));
</script>

<template>
  <div class="page a-mov-page a-mov-accounts-page">
    <APageHead title="Cuentas contables">
      <template #meta>
        <span class="a-mov-head-count">
          <strong class="mono">{{ page.totalUserAccounts }}</strong> cuentas
        </span>
        <span class="a-mov-catalog-hint-wrap">
          <button
            type="button"
            class="a-mov-catalog-hint"
            :aria-expanded="showHint"
            aria-label="Cómo usar esta vista"
            @click.stop="showHint = !showHint"
          >
            ⓘ
          </button>
          <span v-if="showHint" class="a-mov-catalog-hint-pop" role="tooltip">
            Toca una cuenta para ver sus movimientos
          </span>
        </span>
      </template>
      <template #actions>
        <AButton
          v-if="page.hasAvailableManualPositions"
          class="a-mov-header-create"
          @click="page.openActivationModal"
        >
          + Activar cuenta
        </AButton>
      </template>
    </APageHead>

    <AccountingTabs />

    <AState v-if="page.error" status="error">{{ page.error }}</AState>
    <section class="sect a-mov-accounts-section">
      <AccountingAccountCatalog :page="page" />
    </section>

    <AButton
      v-if="page.hasAvailableManualPositions"
      variant="primary"
      class="a-mov-mobile-create"
      aria-label="Activar cuenta"
      @click="page.openActivationModal"
    >
      <span class="a-mov-fab-plus" aria-hidden="true">+</span>
      <span class="a-mov-fab-label">Activar cuenta</span>
    </AButton>

    <AccountingMovementsActivationModal :page="page" />
  </div>
</template>
