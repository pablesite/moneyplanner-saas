// Estado de la vista de usuarios del panel admin (`/account` para `saas_admin`).
// Sigue el patron de `useAccountingMovementsPage` / `useBudgetDashboardPage`:
// devuelve un objeto `reactive` que los componentes consumen como prop `:page`.
import { computed, reactive, ref } from 'vue';
import { toAuthErrorMessage } from '@/domains/auth';
import type { ASelectItem } from '@/domains/ui';
import {
  saasAdminApi,
  type CoreAdminUser,
  type CreateSaasAdminUserPayload,
  type SaasAdminRole,
  type SaasAdminUser,
} from './api';

// Un unico eje de conexion. Antes la fila mostraba dos pares de badges
// solapados (`En SaaS`/`Solo Core` y `En Core`/`Solo SaaS`), que para una
// identidad solo-Core se contradecian entre si.
export type AdminConnection = 'linked' | 'saas_only' | 'core_only';
export type AdminConnectionFilter = 'all' | AdminConnection;
export type AdminStatusFilter = 'all' | 'active' | 'inactive';

export type AdminIdentityRow = {
  key: string;
  displayName: string;
  displayEmail: string;
  connection: AdminConnection;
  connectionLabel: string;
  connectionDetail: string;
  role: SaasAdminRole | null;
  roleLabel: string;
  isActive: boolean;
  // `null` cuando la identidad no tiene cuenta SaaS: la contrasena la gobierna
  // el SaaS, asi que en Core la columna no aplica.
  passwordPending: boolean | null;
  externalIdentities: string[];
  saasUser: SaasAdminUser | null;
  coreUser: CoreAdminUser | null;
};

export function roleLabel(role: SaasAdminRole): string {
  return role === 'saas_admin' ? 'Admin SaaS' : 'Miembro SaaS';
}

export function statusLabel(isActive: boolean): string {
  return isActive ? 'Activa' : 'Desactivada';
}

export function passwordLabel(pending: boolean | null): string {
  if (pending === null) return '—';
  return pending ? 'Temporal' : 'Definida';
}

export function coreOriginLabel(user: CoreAdminUser): string {
  return user.origin === 'core_native' ? 'Creado en Core' : 'Provisionado desde SaaS';
}

const CONNECTION_LABELS: Record<AdminConnection, string> = {
  linked: 'Conectada',
  saas_only: 'Solo SaaS',
  core_only: 'Solo Core',
};

export const connectionFilterOptions: ASelectItem[] = [
  { value: 'all', label: 'Toda conexión' },
  { value: 'linked', label: 'Conectadas' },
  { value: 'saas_only', label: 'Solo SaaS' },
  { value: 'core_only', label: 'Solo Core' },
];

export const statusFilterOptions: ASelectItem[] = [
  { value: 'all', label: 'Todo estado' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Desactivadas' },
];

export const roleOptions: ASelectItem[] = [
  { value: 'saas_member', label: 'Miembro SaaS' },
  { value: 'saas_admin', label: 'Admin SaaS' },
];

function connectionDetailFor(row: {
  connection: AdminConnection;
  saasUser: SaasAdminUser | null;
}): string {
  if (row.connection === 'saas_only') return 'Sin cuenta Core asociada';
  if (row.connection === 'core_only') return 'Sin cuenta SaaS asociada';
  return row.saasUser?.core_connection?.label ?? 'Vinculada con Core';
}

export function useAdminUsersPage() {
  const saasUsers = ref<SaasAdminUser[]>([]);
  const coreUsers = ref<CoreAdminUser[]>([]);
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const actionBusy = ref(false);

  const query = ref('');
  const connectionFilter = ref<AdminConnectionFilter>('all');
  const statusFilter = ref<AdminStatusFilter>('all');

  const createOpen = ref(false);
  const createForm = reactive({
    username: '',
    password: '',
    email: '',
    role: 'saas_member' as SaasAdminRole,
    is_active: true,
  });

  const detailRowKey = ref<string | null>(null);
  const deleteTarget = ref<SaasAdminUser | null>(null);

  const rows = computed<AdminIdentityRow[]>(() => {
    const linkedCoreBySaasId = new Map<number, CoreAdminUser>();
    for (const coreUser of coreUsers.value) {
      if (coreUser.linked_saas_user) linkedCoreBySaasId.set(coreUser.linked_saas_user.id, coreUser);
    }

    const result: AdminIdentityRow[] = [];

    for (const saasUser of saasUsers.value) {
      const coreUser = linkedCoreBySaasId.get(saasUser.id) ?? null;
      const connection: AdminConnection = coreUser ? 'linked' : 'saas_only';
      result.push({
        key: `saas-${saasUser.id}`,
        displayName: saasUser.username || coreUser?.username || `Usuario ${saasUser.id}`,
        displayEmail: saasUser.email || coreUser?.email || 'sin email',
        connection,
        connectionLabel: CONNECTION_LABELS[connection],
        connectionDetail: connectionDetailFor({ connection, saasUser }),
        role: saasUser.role,
        roleLabel: roleLabel(saasUser.role),
        // Cuando hay cuenta SaaS manda su `is_active`: es la que abre o cierra el
        // acceso al producto. El calculo anterior (`saas || core`) marcaba como
        // activa una cuenta SaaS desactivada cuya contraparte Core seguia viva.
        isActive: saasUser.is_active,
        passwordPending: saasUser.must_change_password,
        externalIdentities:
          coreUser?.external_identities.map(
            (identity) => `${identity.provider}:${identity.external_user_id}`,
          ) ?? [],
        saasUser,
        coreUser,
      });
    }

    for (const coreUser of coreUsers.value) {
      if (coreUser.linked_saas_user) continue;
      result.push({
        key: `core-${coreUser.id}`,
        displayName: coreUser.username || `Core ${coreUser.id}`,
        displayEmail: coreUser.email || 'sin email',
        connection: 'core_only',
        connectionLabel: CONNECTION_LABELS.core_only,
        connectionDetail: connectionDetailFor({ connection: 'core_only', saasUser: null }),
        role: null,
        roleLabel: '—',
        isActive: coreUser.is_active,
        passwordPending: null,
        externalIdentities: coreUser.external_identities.map(
          (identity) => `${identity.provider}:${identity.external_user_id}`,
        ),
        saasUser: null,
        coreUser,
      });
    }

    return result.sort((left, right) => left.displayName.localeCompare(right.displayName, 'es'));
  });

  const filteredRows = computed<AdminIdentityRow[]>(() => {
    const needle = query.value.trim().toLocaleLowerCase('es');
    return rows.value.filter((row) => {
      if (connectionFilter.value !== 'all' && row.connection !== connectionFilter.value)
        return false;
      if (statusFilter.value === 'active' && !row.isActive) return false;
      if (statusFilter.value === 'inactive' && row.isActive) return false;
      if (!needle) return true;
      return (
        row.displayName.toLocaleLowerCase('es').includes(needle) ||
        row.displayEmail.toLocaleLowerCase('es').includes(needle)
      );
    });
  });

  const hasActiveFilters = computed(
    () =>
      Boolean(query.value.trim()) ||
      connectionFilter.value !== 'all' ||
      statusFilter.value !== 'all',
  );

  const linkedCount = computed(() => rows.value.filter((r) => r.connection === 'linked').length);
  const saasOnlyCount = computed(
    () => rows.value.filter((r) => r.connection === 'saas_only').length,
  );
  const coreOnlyCount = computed(
    () => rows.value.filter((r) => r.connection === 'core_only').length,
  );
  const adminCount = computed(() => rows.value.filter((r) => r.role === 'saas_admin').length);
  const memberCount = computed(() => rows.value.filter((r) => r.role === 'saas_member').length);
  const pendingPasswordCount = computed(
    () => rows.value.filter((r) => r.passwordPending === true).length,
  );
  const inactiveCount = computed(() => rows.value.filter((r) => !r.isActive).length);

  const detailRow = computed<AdminIdentityRow | null>(
    () => rows.value.find((row) => row.key === detailRowKey.value) ?? null,
  );

  function resetFilters(): void {
    query.value = '';
    connectionFilter.value = 'all';
    statusFilter.value = 'all';
  }

  function openDetail(key: string): void {
    detailRowKey.value = key;
  }

  function closeDetail(): void {
    detailRowKey.value = null;
  }

  function resetCreateForm(): void {
    createForm.username = '';
    createForm.password = '';
    createForm.email = '';
    createForm.role = 'saas_member';
    createForm.is_active = true;
  }

  function openCreate(): void {
    error.value = null;
    successMessage.value = null;
    createOpen.value = true;
  }

  function closeCreate(): void {
    createOpen.value = false;
    resetCreateForm();
  }

  function askDelete(user: SaasAdminUser): void {
    deleteTarget.value = user;
  }

  function cancelDelete(): void {
    deleteTarget.value = null;
  }

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await saasAdminApi.listUsers();
      saasUsers.value = response.data?.saas_users ?? [];
      coreUsers.value = response.data?.core_users ?? [];
      loaded.value = true;
    } catch (e: unknown) {
      error.value = toAuthErrorMessage(e);
    } finally {
      loading.value = false;
    }
  }

  function reset(): void {
    saasUsers.value = [];
    coreUsers.value = [];
    loaded.value = false;
    error.value = null;
    successMessage.value = null;
  }

  async function runAction(action: () => Promise<string>): Promise<void> {
    actionBusy.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const message = await action();
      await load();
      successMessage.value = message;
    } catch (e: unknown) {
      error.value = toAuthErrorMessage(e);
    } finally {
      actionBusy.value = false;
    }
  }

  async function createUser(): Promise<void> {
    const payload: CreateSaasAdminUserPayload = {
      username: createForm.username.trim(),
      password: createForm.password,
      email: createForm.email.trim(),
      role: createForm.role,
      is_active: createForm.is_active,
    };
    await runAction(async () => {
      const response = await saasAdminApi.createUser(payload);
      return `Usuario ${response.data.username} creado.`;
    });
    if (!error.value) closeCreate();
  }

  async function switchRole(user: SaasAdminUser): Promise<void> {
    const nextRole: SaasAdminRole = user.role === 'saas_admin' ? 'saas_member' : 'saas_admin';
    await runAction(async () => {
      const response = await saasAdminApi.updateUserRole(user.id, nextRole);
      return `${response.data.username} ahora es ${roleLabel(nextRole)}.`;
    });
  }

  async function toggleStatus(user: SaasAdminUser): Promise<void> {
    await runAction(async () => {
      const response = await saasAdminApi.updateUserStatus(user.id, !user.is_active);
      return `Cuenta de ${response.data.username} ${user.is_active ? 'desactivada' : 'activada'}.`;
    });
  }

  async function confirmDelete(): Promise<void> {
    const user = deleteTarget.value;
    if (!user) return;
    await runAction(async () => {
      await saasAdminApi.deleteUser(user.id);
      return `Usuario ${user.username} eliminado.`;
    });
    deleteTarget.value = null;
    if (detailRowKey.value === `saas-${user.id}`) closeDetail();
  }

  return reactive({
    loading,
    loaded,
    error,
    successMessage,
    actionBusy,
    query,
    connectionFilter,
    statusFilter,
    createOpen,
    createForm,
    deleteTarget,
    detailRow,
    rows,
    filteredRows,
    hasActiveFilters,
    linkedCount,
    saasOnlyCount,
    coreOnlyCount,
    adminCount,
    memberCount,
    pendingPasswordCount,
    inactiveCount,
    load,
    reset,
    resetFilters,
    openDetail,
    closeDetail,
    openCreate,
    closeCreate,
    createUser,
    switchRole,
    toggleStatus,
    askDelete,
    cancelDelete,
    confirmDelete,
  });
}

export type AdminUsersPageState = ReturnType<typeof useAdminUsersPage>;
