<script setup lang="ts">
// Detalle completo de una identidad. El listado enseña solo lo accionable
// (conexión, rol, estado, contraseña); lo técnico —origen, identidades externas
// del proveedor— vive aquí, a un toque, en vez de ocupar la fila siempre.
import { AButton, BaseModal } from '@/domains/ui';
import type { AdminUsersPageState } from '../useAdminUsersPage';
import { coreOriginLabel, passwordLabel, statusLabel } from '../useAdminUsersPage';

const props = defineProps<{ page: AdminUsersPageState }>();
const page = props.page;
</script>

<template>
  <BaseModal
    :open="Boolean(page.detailRow)"
    :title="page.detailRow?.displayName ?? 'Identidad'"
    variant="sheet"
    panel-class="dir-a dir-a-sheet"
    @close="page.closeDetail()"
  >
    <div v-if="page.detailRow" class="a-adm-detail">
      <div class="a-adm-detail-head">
        <span class="chip a-adm-conn" :class="`a-adm-conn-${page.detailRow.connection}`">
          {{ page.detailRow.connectionLabel }}
        </span>
        <span class="a-adm-detail-hint">{{ page.detailRow.connectionDetail }}</span>
      </div>

      <div class="a-adm-detail-block">
        <p class="a-adm-detail-title">Cuenta SaaS</p>
        <dl v-if="page.detailRow.saasUser" class="a-adm-facts">
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Usuario</dt>
            <dd class="a-adm-fact-value">{{ page.detailRow.saasUser.username }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Email</dt>
            <dd class="a-adm-fact-value">{{ page.detailRow.saasUser.email || 'sin email' }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Rol</dt>
            <dd class="a-adm-fact-value">{{ page.detailRow.roleLabel }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Estado</dt>
            <dd class="a-adm-fact-value">
              <span :class="page.detailRow.isActive ? 'a-adm-ok' : 'a-adm-warn'">
                {{ statusLabel(page.detailRow.isActive) }}
              </span>
            </dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Contraseña</dt>
            <dd class="a-adm-fact-value">
              <span :class="{ 'a-adm-warn': page.detailRow.passwordPending === true }">
                {{ passwordLabel(page.detailRow.passwordPending) }}
              </span>
            </dd>
          </div>
        </dl>
        <p v-else class="a-adm-detail-empty">
          Esta identidad solo existe en Core. No puede acceder al SaaS hasta que se le cree una
          cuenta.
        </p>
      </div>

      <div class="a-adm-detail-block">
        <p class="a-adm-detail-title">Cuenta Core</p>
        <dl v-if="page.detailRow.coreUser" class="a-adm-facts">
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Usuario</dt>
            <dd class="a-adm-fact-value">
              {{ page.detailRow.coreUser.username || 'sin username' }}
            </dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Email</dt>
            <dd class="a-adm-fact-value">{{ page.detailRow.coreUser.email || 'sin email' }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Origen</dt>
            <dd class="a-adm-fact-value">{{ coreOriginLabel(page.detailRow.coreUser) }}</dd>
          </div>
          <div class="a-adm-fact">
            <dt class="a-adm-fact-label">Identidades externas</dt>
            <dd class="a-adm-fact-value">
              <span v-if="!page.detailRow.externalIdentities.length">ninguna</span>
              <span
                v-for="identity in page.detailRow.externalIdentities"
                v-else
                :key="identity"
                class="a-adm-identity mono"
              >
                {{ identity }}
              </span>
            </dd>
          </div>
        </dl>
        <p v-else class="a-adm-detail-empty">
          Sin cuenta Core asociada. El usuario tendrá una al entrar por primera vez.
        </p>
      </div>
    </div>

    <template v-if="page.detailRow?.saasUser" #footer>
      <!-- Variante `default`, no `ghost`: en el footer del sheet no hay contexto
           de fila que las delate como acciones, y sin borde se leían como texto. -->
      <div class="a-adm-detail-actions">
        <AButton :disabled="page.actionBusy" @click="page.switchRole(page.detailRow!.saasUser!)">
          {{ page.detailRow.saasUser.role === 'saas_admin' ? 'Pasar a miembro' : 'Dar rol admin' }}
        </AButton>
        <AButton :disabled="page.actionBusy" @click="page.toggleStatus(page.detailRow!.saasUser!)">
          {{ page.detailRow.saasUser.is_active ? 'Desactivar cuenta' : 'Activar cuenta' }}
        </AButton>
        <AButton
          class="a-adm-danger"
          :disabled="page.actionBusy"
          @click="page.askDelete(page.detailRow!.saasUser!)"
        >
          Eliminar
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
