<script setup lang="ts">
// Borrar un usuario es la acción irreversible del producto. Antes se resolvía
// con `window.confirm` desde un botón fantasma idéntico a los otros dos de la
// fila; aquí la acción se nombra y se pesa antes de ejecutarla.
import { AButton, BaseModal } from '@/domains/ui';
import type { AdminUsersPageState } from '../useAdminUsersPage';

const props = defineProps<{ page: AdminUsersPageState }>();
const page = props.page;
</script>

<template>
  <BaseModal
    :open="Boolean(page.deleteTarget)"
    title="Eliminar usuario"
    variant="sheet"
    panel-class="dir-a dir-a-sheet"
    @close="page.cancelDelete()"
  >
    <div v-if="page.deleteTarget" class="a-adm-confirm">
      <p class="a-adm-confirm-lead">
        Vas a eliminar la cuenta SaaS de
        <strong>{{ page.deleteTarget.username }}</strong>
      </p>
      <p class="a-adm-confirm-copy">
        Perderá el acceso al producto de inmediato. Su cuenta Core y los datos financieros asociados
        no se borran. La acción no se puede deshacer.
      </p>
      <p class="a-adm-confirm-copy">
        Si solo quieres cortar el acceso temporalmente, desactiva la cuenta en vez de eliminarla.
      </p>
    </div>

    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="page.actionBusy" @click="page.cancelDelete()">
          Cancelar
        </AButton>
        <AButton
          variant="primary"
          class="a-adm-danger-strong"
          :loading="page.actionBusy"
          :disabled="page.actionBusy"
          @click="page.confirmDelete()"
        >
          Eliminar usuario
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
