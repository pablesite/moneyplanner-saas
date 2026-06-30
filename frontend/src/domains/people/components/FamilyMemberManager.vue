<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import { AButton, ASelect, AToast, type ASelectItem } from '@/domains/ui';
import { usePeopleMembers } from '@/domains/people/composables';

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
  prettyError,
  membersSorted,
  ensureLoaded,
  refreshMembers,
  openCreate,
  closeCreate,
  submit,
  toggleActive,
  openEdit,
  closeEdit,
  saveEdit,
  removeMember,
} = usePeopleMembers();

onMounted(async () => {
  await ensureLoaded();
});
</script>

<template>
  <div>
    <div v-if="prettyError" class="alert ui-people-alert">
      {{ prettyError }}
    </div>
    <AToast :open="!!successMessage" @close="successMessage = null">{{ successMessage }}</AToast>
    <!-- Lista -->
    <section class="card">
      <div class="card-header">
        <h2 class="card-header-title">Miembros</h2>
        <div class="ui-people-header-actions">
          <AButton :disabled="store.loading" @click="refreshMembers()"> Refrescar </AButton>
          <AButton variant="primary" :disabled="store.loading" @click="openCreate">
            Nuevo miembro
          </AButton>
        </div>
      </div>

      <table class="ui-data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th class="text-right">Estado</th>
            <th class="ui-data-table-actions">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="m in membersSorted" :key="m.id">
            <td>
              {{ m.name }}
            </td>

            <td>
              <span class="subtle">
                {{ m.role === 'adult' ? 'Adulto' : 'Niño' }}
              </span>
            </td>

            <td class="text-right">
              <AButton
                :disabled="store.loading || rowBusy[m.id]"
                :class="{ 'ui-people-status-inactive': !m.is_active }"
                @click="toggleActive(m.id, !m.is_active)"
              >
                {{ m.is_active ? 'Activo' : 'Inactivo' }}
              </AButton>
            </td>

            <td class="ui-data-table-actions">
              <div class="ui-people-row-actions">
                <button
                  class="icon-btn"
                  type="button"
                  title="Editar"
                  aria-label="Editar"
                  :disabled="store.loading || rowBusy[m.id]"
                  @click="openEdit(m)"
                >
                  &#9998;&#65039;
                </button>
                <button
                  class="icon-btn"
                  type="button"
                  title="Eliminar"
                  aria-label="Eliminar"
                  :disabled="store.loading || rowBusy[m.id]"
                  @click="removeMember(m)"
                >
                  &#128465;&#65039;
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!membersSorted.length">
            <td colspan="4" class="ui-table-empty">No hay miembros todavía.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="store.loading" class="ui-status-line">Cargando miembros...</div>

    <!-- Modal crear -->
    <BaseModal
      :open="createOpen"
      title="Nuevo miembro"
      variant="sheet"
      panel-class="dir-a dir-a-sheet"
      @close="closeCreate"
    >
      <div class="ui-item-form-grid">
        <p class="subtle m-0 pb-1 md:col-span-2">
          Crea miembros de la familia. Al crear un adulto, se generará automáticamente su
          titularidad individual.
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
          <AButton class="ui-form-action-btn" @click="closeCreate"> Cancelar </AButton>
          <AButton
            variant="primary"
            class="ui-form-action-btn"
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
            class="ui-form-action-btn"
            :disabled="store.loading || (editForm.id != null && rowBusy[editForm.id])"
            @click="saveEdit"
          >
            Guardar
          </AButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
