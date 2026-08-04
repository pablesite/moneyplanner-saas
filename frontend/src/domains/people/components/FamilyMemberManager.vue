<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import {
  AButton,
  ARowMenu,
  ASectHead,
  ASelect,
  AState,
  AToast,
  type ASelectItem,
} from '@/domains/ui';
import { usePeopleMembers } from '@/domains/people/composables';
import type { FamilyMember } from '@/domains/people/types';

const memberRoleOptions: ASelectItem[] = [
  { value: 'adult', label: 'Adulto' },
  { value: 'child', label: 'Niño' },
];

const {
  store,
  form,
  saving,
  rowBusy,
  createOpen,
  successMessage,
  editOpen,
  editForm,
  memberPendingDelete,
  prettyError,
  membersSorted,
  ensureLoaded,
  openCreate,
  closeCreate,
  submit,
  toggleActive,
  openEdit,
  closeEdit,
  saveEdit,
  askRemoveMember,
  cancelRemoveMember,
  confirmRemoveMember,
} = usePeopleMembers();

function rowMenuItems(member: FamilyMember) {
  const busy = store.loading || rowBusy.value[member.id];
  return [
    { id: 'edit', label: 'Editar miembro', disabled: busy },
    { id: 'delete', label: 'Eliminar miembro', danger: true, disabled: busy },
  ];
}

function onRowAction(member: FamilyMember, action: string): void {
  if (action === 'edit') openEdit(member);
  else if (action === 'delete') askRemoveMember(member);
}

onMounted(async () => {
  await ensureLoaded();
});
</script>

<template>
  <section class="sect">
    <ASectHead
      title="Miembros"
      subtitle="Quién forma la unidad familiar. Cada adulto genera su titularidad individual."
    >
      <template #actions>
        <AButton variant="primary" :disabled="store.loading" @click="openCreate">
          Nuevo miembro
        </AButton>
      </template>
    </ASectHead>

    <AToast :open="!!successMessage" @close="successMessage = null">{{ successMessage }}</AToast>

    <AState v-if="prettyError" status="error">{{ prettyError }}</AState>

    <AState v-else-if="store.loading && !membersSorted.length" status="loading">
      Cargando miembros…
    </AState>

    <AState v-else-if="!membersSorted.length" status="empty">
      No hay miembros todavía. Crea el primero para poder repartir titularidades.
    </AState>

    <table v-else class="data-table a-aux-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Rol</th>
          <th>Estado</th>
          <th class="a-aux-menu-head"><span class="sr-only">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in membersSorted" :key="m.id">
          <td class="a-aux-cell-primary a-aux-name">{{ m.name }}</td>
          <td class="a-aux-muted" data-label="Rol">{{ m.role === 'adult' ? 'Adulto' : 'Niño' }}</td>
          <td data-label="Estado">
            <button
              type="button"
              class="chip a-aux-toggle"
              :class="m.is_active ? 'a-aux-toggle-on' : 'a-aux-toggle-off'"
              :disabled="store.loading || rowBusy[m.id]"
              :aria-pressed="m.is_active"
              :title="m.is_active ? 'Desactivar miembro' : 'Activar miembro'"
              @click="toggleActive(m.id, !m.is_active)"
            >
              {{ m.is_active ? 'Activo' : 'Inactivo' }}
            </button>
          </td>
          <td class="a-aux-cell-menu">
            <ARowMenu
              :items="rowMenuItems(m)"
              :label="`Acciones de ${m.name}`"
              @select="(action) => onRowAction(m, action)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal crear -->
    <BaseModal
      :open="createOpen"
      title="Nuevo miembro"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="closeCreate"
    >
      <div class="ui-item-form-grid">
        <p class="a-aux-hint md:col-span-2">
          Al crear un adulto se generará automáticamente su titularidad individual.
        </p>

        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Nombre</span>
          <input v-model="form.name" placeholder="Nombre (ej. Pablo)" class="input" />
        </label>

        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Rol</span>
          <ASelect
            class="select"
            :model-value="form.role"
            :options="memberRoleOptions"
            :searchable="false"
            @update:model-value="(v) => (form.role = v as 'adult' | 'child')"
          />
        </label>
      </div>
      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="closeCreate">Cancelar</AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn"
            :loading="saving"
            :disabled="saving || store.loading"
            @click="submit"
          >
            Crear
          </AButton>
        </div>
      </template>
    </BaseModal>

    <!-- Modal editar -->
    <BaseModal
      :open="editOpen"
      title="Editar miembro"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="closeEdit"
    >
      <div class="ui-item-form-grid">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Nombre</span>
          <input v-model="editForm.name" class="input" />
        </label>

        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Rol</span>
          <ASelect
            class="select"
            :model-value="editForm.role"
            :options="memberRoleOptions"
            :searchable="false"
            @update:model-value="(v) => (editForm.role = v as 'adult' | 'child')"
          />
        </label>
      </div>
      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="closeEdit">Cancelar</AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn"
            :disabled="store.loading || (editForm.id != null && rowBusy[editForm.id])"
            @click="saveEdit"
          >
            Guardar
          </AButton>
        </div>
      </template>
    </BaseModal>

    <!-- Confirmación de borrado -->
    <BaseModal
      :open="Boolean(memberPendingDelete)"
      title="Eliminar miembro"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="cancelRemoveMember"
    >
      <div v-if="memberPendingDelete" class="a-aux-confirm">
        <p class="a-aux-confirm-lead">
          Vas a eliminar a <strong>{{ memberPendingDelete.name }}</strong>
        </p>
        <p class="a-aux-confirm-copy">
          Solo se puede eliminar si no está en uso por ninguna titularidad, posición o movimiento.
          Si lo está, la operación fallará y no se perderá nada.
        </p>
        <p class="a-aux-confirm-copy">
          Si solo quieres que deje de aparecer en los repartos, desactívalo en vez de eliminarlo.
        </p>
      </div>

      <template #footer>
        <div class="ui-modal-foot-actions">
          <AButton class="ui-form-action-btn" @click="cancelRemoveMember">Cancelar</AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn a-aux-danger"
            :disabled="store.loading"
            @click="confirmRemoveMember"
          >
            Eliminar
          </AButton>
        </div>
      </template>
    </BaseModal>
  </section>
</template>
