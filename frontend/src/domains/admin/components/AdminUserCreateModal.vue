<script setup lang="ts">
import { AButton, ASelect, BaseModal } from '@/domains/ui';
import type { SaasAdminRole } from '../api';
import type { AdminUsersPageState } from '../useAdminUsersPage';
import { roleOptions } from '../useAdminUsersPage';

const props = defineProps<{ page: AdminUsersPageState }>();
const page = props.page;

// El footer vive fuera del cuerpo con scroll (slot `#footer` de BaseModal), así
// que el submit se enlaza al formulario por atributo `form`.
const FORM_ID = 'a-adm-create-user-form';
</script>

<template>
  <BaseModal
    :open="page.createOpen"
    title="Crear usuario SaaS"
    variant="sheet"
    panel-class="dir-a dir-a-sheet"
    @close="page.closeCreate()"
  >
    <form :id="FORM_ID" class="ui-item-form-grid" @submit.prevent="page.createUser()">
      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Username</span>
        <input v-model="page.createForm.username" class="input" type="text" required />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Email</span>
        <input v-model="page.createForm.email" class="input" type="email" />
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Contraseña temporal</span>
        <input
          v-model="page.createForm.password"
          class="input"
          type="password"
          minlength="8"
          required
        />
        <span class="a-adm-field-hint"> El usuario tendrá que cambiarla en su primer acceso. </span>
      </label>

      <label class="ui-item-form-field">
        <span class="ui-item-form-label">Rol inicial</span>
        <ASelect
          class="select"
          :model-value="page.createForm.role"
          :options="roleOptions"
          :searchable="false"
          @update:model-value="(v) => (page.createForm.role = v as SaasAdminRole)"
        />
      </label>

      <label class="checkbox-row md:col-span-2">
        <input v-model="page.createForm.is_active" type="checkbox" />
        <span>Crear la cuenta activa</span>
      </label>
    </form>

    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="page.actionBusy" @click="page.closeCreate()">
          Cancelar
        </AButton>
        <AButton
          variant="primary"
          type="submit"
          :form="FORM_ID"
          :loading="page.actionBusy"
          :disabled="page.actionBusy"
        >
          Crear usuario
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
