<script setup lang="ts">
import { onMounted } from 'vue';
import BaseModal from '@/domains/ui/components/BaseModal.vue';
import { usePeopleMembers } from '@/domains/people/composables';

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
    <div v-if="prettyError" class="alert member-alert">
      {{ prettyError }}
    </div>
    <div v-if="successMessage" class="ui-alert-success">
      {{ successMessage }}
    </div>
    <!-- Lista -->
    <section class="card member-section">
      <div class="card-header">
        <h2 class="card-header-title">Miembros</h2>
        <div class="member-header-actions">
          <button class="btn" type="button" :disabled="store.loading" @click="refreshMembers()">
            Refrescar
          </button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="store.loading"
            @click="openCreate"
          >
            Nuevo miembro
          </button>
        </div>
      </div>

      <table class="member-table">
        <thead>
          <tr>
            <th class="member-th">Nombre</th>
            <th class="member-th">Rol</th>
            <th class="member-th member-th-right">Estado</th>
            <th class="member-th member-th-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="m in membersSorted" :key="m.id">
            <td class="member-td">
              {{ m.name }}
            </td>

            <td class="member-td">
              <span class="subtle">
                {{ m.role === 'adult' ? 'Adulto' : 'Nino' }}
              </span>
            </td>

            <td class="member-td member-td-right">
              <button
                class="btn"
                type="button"
                :disabled="store.loading || rowBusy[m.id]"
                :class="{ 'member-status-inactive': !m.is_active }"
                @click="toggleActive(m.id, !m.is_active)"
              >
                {{ m.is_active ? 'Activo' : 'Inactivo' }}
              </button>
            </td>

            <td class="member-td member-td-right">
              <div class="member-actions">
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
            <td colspan="4" class="ui-table-empty">No hay miembros todavia.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <div v-if="store.loading" class="ui-status-line">Cargando miembros...</div>

    <!-- Modal crear -->
    <BaseModal :open="createOpen" title="Nuevo miembro" @close="closeCreate">
      <div class="member-edit-grid">
        <div class="subtle member-card-subtitle">
          Crea miembros de la familia. Al crear un adulto, se generara automaticamente su
          titularidad individual.
        </div>

        <div>
          <div class="subtle member-field-label">Nombre</div>
          <input v-model="form.name" placeholder="Nombre (ej. Pablo)" />
        </div>

        <div>
          <div class="subtle member-field-label">Rol</div>
          <select v-model="form.role">
            <option value="adult">Adulto</option>
            <option value="child">Nino</option>
          </select>
        </div>

        <div class="member-edit-actions">
          <button class="btn" type="button" @click="closeCreate">Cancelar</button>
          <button
            class="btn btn-primary"
            type="button"
            :disabled="saving || store.loading"
            @click="submit"
          >
            Crear
          </button>
        </div>
      </div>
    </BaseModal>

    <!-- Modal editar -->
    <BaseModal :open="editOpen" title="Editar miembro" @close="closeEdit">
      <div class="member-edit-grid">
        <div>
          <div class="subtle member-field-label">Nombre</div>
          <input v-model="editForm.name" />
        </div>

        <div>
          <div class="subtle member-field-label">Rol</div>
          <select v-model="editForm.role">
            <option value="adult">Adulto</option>
            <option value="child">Nino</option>
          </select>
        </div>

        <div class="member-edit-actions">
          <button class="btn" type="button" @click="closeEdit">Cancelar</button>
          <button
            class="btn"
            type="button"
            :disabled="store.loading || (editForm.id != null && rowBusy[editForm.id])"
            @click="saveEdit"
          >
            Guardar
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.member-alert {
  margin-bottom: 12px;
}

.member-card-subtitle {
  margin-bottom: 10px;
}

.member-header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.member-table {
  width: 100%;
  border-collapse: collapse;
}

.member-th {
  text-align: left;
  padding: 8px 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.member-th-right {
  text-align: right;
}

.member-td {
  padding: 8px 6px;
}

.member-td-right {
  text-align: right;
}

.member-actions {
  display: inline-flex;
  gap: 10px;
}

.member-status-inactive {
  opacity: 0.7;
}

.member-edit-grid {
  display: grid;
  gap: 12px;
}

.member-field-label {
  margin-bottom: 6px;
}

.member-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>


