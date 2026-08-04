<script setup lang="ts">
import { computed } from 'vue';
import { AButton, AKpiBand, ARowMenu, ASectHead, ASelect, AState } from '@/domains/ui';
import type { AKpiItem } from '@/domains/ui';
import type { AdminUsersPageState } from '../useAdminUsersPage';
import {
  connectionFilterOptions,
  passwordLabel,
  statusFilterOptions,
  statusLabel,
  type AdminConnectionFilter,
  type AdminIdentityRow,
  type AdminStatusFilter,
} from '../useAdminUsersPage';

const props = defineProps<{ page: AdminUsersPageState }>();
const page = props.page;

const kpis = computed<AKpiItem[]>(() => [
  {
    label: 'Identidades',
    value: String(page.rows.length),
    meta: `${page.adminCount} admin · ${page.memberCount} miembros`,
  },
  {
    label: 'Conectadas',
    value: String(page.linkedCount),
    meta: `${page.saasOnlyCount} solo SaaS · ${page.coreOnlyCount} solo Core`,
  },
  {
    label: 'Requieren atención',
    value: String(page.pendingPasswordCount + page.inactiveCount),
    meta: `${page.pendingPasswordCount} contraseña temporal · ${page.inactiveCount} desactivadas`,
  },
]);

function rowMenuItems(row: AdminIdentityRow) {
  if (!row.saasUser) return [];
  return [
    {
      id: 'role',
      label: row.saasUser.role === 'saas_admin' ? 'Pasar a miembro' : 'Dar rol admin',
      disabled: page.actionBusy,
    },
    {
      id: 'status',
      label: row.saasUser.is_active ? 'Desactivar cuenta' : 'Activar cuenta',
      disabled: page.actionBusy,
    },
    { id: 'delete', label: 'Eliminar usuario', danger: true, disabled: page.actionBusy },
  ];
}

function onRowAction(row: AdminIdentityRow, action: string): void {
  const user = row.saasUser;
  if (!user) return;
  if (action === 'role') void page.switchRole(user);
  else if (action === 'status') void page.toggleStatus(user);
  else if (action === 'delete') page.askDelete(user);
}
</script>

<template>
  <section id="users" class="sect a-adm-users">
    <ASectHead
      title="Usuarios"
      subtitle="Identidades del producto: cada fila cruza la cuenta SaaS con su cuenta Core."
    >
      <template #actions>
        <AButton variant="primary" :disabled="page.actionBusy" @click="page.openCreate()">
          Nuevo usuario
        </AButton>
      </template>
    </ASectHead>

    <AKpiBand :items="kpis" />

    <div class="a-adm-toolbar">
      <input
        v-model="page.query"
        class="filter-ctrl a-adm-search"
        type="search"
        placeholder="Buscar por nombre o email…"
        aria-label="Buscar identidad"
      />
      <ASelect
        class="filter-ctrl a-adm-filter"
        :model-value="page.connectionFilter"
        :options="connectionFilterOptions"
        :searchable="false"
        aria-label="Filtrar por conexión"
        @update:model-value="(v) => (page.connectionFilter = v as AdminConnectionFilter)"
      />
      <ASelect
        class="filter-ctrl a-adm-filter"
        :model-value="page.statusFilter"
        :options="statusFilterOptions"
        :searchable="false"
        aria-label="Filtrar por estado"
        @update:model-value="(v) => (page.statusFilter = v as AdminStatusFilter)"
      />
      <span class="a-adm-count">{{ page.filteredRows.length }} de {{ page.rows.length }}</span>
    </div>

    <AState v-if="page.error" status="error">{{ page.error }}</AState>

    <AState v-else-if="page.loading && !page.loaded" status="loading">
      Cargando identidades…
    </AState>

    <AState v-else-if="!page.rows.length" status="empty">
      Todavía no hay identidades. Crea el primer usuario SaaS para empezar.
    </AState>

    <AState v-else-if="!page.filteredRows.length" status="empty">
      Ninguna identidad coincide con la búsqueda o los filtros activos.
      <AButton variant="ghost" size="sm" @click="page.resetFilters()">Quitar filtros</AButton>
    </AState>

    <table v-else class="data-table a-adm-table">
      <thead>
        <tr>
          <th>Identidad</th>
          <th>Conexión</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Contraseña</th>
          <th class="a-adm-menu-head"><span class="sr-only">Acciones</span></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in page.filteredRows"
          :key="row.key"
          class="clickable"
          :class="{ 'row-active': page.detailRow?.key === row.key }"
          @click="page.openDetail(row.key)"
        >
          <td class="a-adm-cell-identity">
            <span class="a-adm-user-name">{{ row.displayName }}</span>
            <span class="a-adm-user-email">{{ row.displayEmail }}</span>
          </td>
          <td class="a-adm-cell-conn" data-label="Conexión">
            <span class="chip a-adm-conn" :class="`a-adm-conn-${row.connection}`">
              {{ row.connectionLabel }}
            </span>
          </td>
          <td class="a-adm-cell-role" data-label="Rol">{{ row.roleLabel }}</td>
          <td data-label="Estado">
            <span :class="row.isActive ? 'a-adm-ok' : 'a-adm-warn'">
              {{ statusLabel(row.isActive) }}
            </span>
          </td>
          <td data-label="Contraseña">
            <span :class="{ 'a-adm-warn': row.passwordPending === true }">
              {{ passwordLabel(row.passwordPending) }}
            </span>
          </td>
          <td class="a-adm-cell-menu">
            <ARowMenu
              v-if="row.saasUser"
              :items="rowMenuItems(row)"
              :label="`Acciones de ${row.displayName}`"
              @select="(action) => onRowAction(row, action)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
