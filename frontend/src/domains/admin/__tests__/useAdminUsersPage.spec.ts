import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAdminUsersPage } from '@/domains/admin/useAdminUsersPage';

const mocks = vi.hoisted(() => ({
  listUsers: vi.fn(),
  updateUserStatus: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('@/domains/admin/api', () => ({
  saasAdminApi: {
    listUsers: mocks.listUsers,
    updateUserStatus: mocks.updateUserStatus,
    deleteUser: mocks.deleteUser,
  },
}));

vi.mock('@/domains/auth', () => ({
  toAuthErrorMessage: vi.fn(() => 'mapped-error'),
}));

function saasUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    username: 'ana',
    email: 'ana@example.com',
    is_active: true,
    role: 'saas_member',
    must_change_password: false,
    core_user_origin: 'core_native',
    account_link: null,
    core_connection: null,
    ...overrides,
  };
}

function coreUser(overrides: Record<string, unknown> = {}) {
  return {
    id: 10,
    username: 'ana',
    email: 'ana@example.com',
    is_active: true,
    is_staff: false,
    origin: 'core_native',
    external_identities: [],
    connection_kind: 'unlinked',
    linked_saas_user: null,
    ...overrides,
  };
}

function respond(saas_users: unknown[], core_users: unknown[]) {
  mocks.listUsers.mockResolvedValueOnce({ data: { saas_users, core_users } });
}

describe('useAdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('cruza identidades en un unico eje de conexion', async () => {
    respond(
      [saasUser({ id: 1, username: 'ana' }), saasUser({ id: 2, username: 'bruno' })],
      [
        coreUser({
          id: 10,
          username: 'ana',
          connection_kind: 'bootstrap',
          linked_saas_user: {
            id: 1,
            username: 'ana',
            email: '',
            is_active: true,
            role: 'saas_member',
          },
        }),
        coreUser({ id: 11, username: 'carla', email: 'carla@example.com' }),
      ],
    );
    const page = useAdminUsersPage();

    await page.load();

    expect(page.rows.map((row) => [row.displayName, row.connection])).toEqual([
      ['ana', 'linked'],
      ['bruno', 'saas_only'],
      ['carla', 'core_only'],
    ]);
    expect(page.linkedCount).toBe(1);
    expect(page.saasOnlyCount).toBe(1);
    expect(page.coreOnlyCount).toBe(1);
  });

  it('deja mandar al estado SaaS cuando la identidad existe en los dos lados', async () => {
    // El calculo anterior era `saas.is_active || core.is_active`, asi que una
    // cuenta SaaS desactivada con contraparte Core viva se listaba como activa.
    respond(
      [saasUser({ id: 1, username: 'ana', is_active: false })],
      [
        coreUser({
          id: 10,
          is_active: true,
          linked_saas_user: {
            id: 1,
            username: 'ana',
            email: '',
            is_active: false,
            role: 'saas_member',
          },
        }),
      ],
    );
    const page = useAdminUsersPage();

    await page.load();

    expect(page.rows[0]?.isActive).toBe(false);
    expect(page.inactiveCount).toBe(1);
  });

  it('filtra por texto, conexion y estado', async () => {
    respond(
      [
        saasUser({ id: 1, username: 'ana', is_active: true }),
        saasUser({ id: 2, username: 'bruno', email: 'bruno@example.com', is_active: false }),
      ],
      [coreUser({ id: 11, username: 'carla', email: 'carla@example.com' })],
    );
    const page = useAdminUsersPage();
    await page.load();

    page.query = 'bruno@';
    expect(page.filteredRows.map((row) => row.displayName)).toEqual(['bruno']);

    page.query = '';
    page.connectionFilter = 'core_only';
    expect(page.filteredRows.map((row) => row.displayName)).toEqual(['carla']);

    page.connectionFilter = 'all';
    page.statusFilter = 'inactive';
    expect(page.filteredRows.map((row) => row.displayName)).toEqual(['bruno']);

    expect(page.hasActiveFilters).toBe(true);
    page.resetFilters();
    expect(page.hasActiveFilters).toBe(false);
    expect(page.filteredRows).toHaveLength(3);
  });

  it('cuenta las identidades que requieren atencion', async () => {
    respond(
      [
        saasUser({ id: 1, username: 'ana', must_change_password: true }),
        saasUser({ id: 2, username: 'bruno', role: 'saas_admin', is_active: false }),
      ],
      [],
    );
    const page = useAdminUsersPage();

    await page.load();

    expect(page.pendingPasswordCount).toBe(1);
    expect(page.inactiveCount).toBe(1);
    expect(page.adminCount).toBe(1);
    expect(page.memberCount).toBe(1);
  });

  it('recarga y confirma el borrado solo tras la confirmacion explicita', async () => {
    respond([saasUser({ id: 1, username: 'ana' })], []);
    const page = useAdminUsersPage();
    await page.load();

    page.askDelete(page.rows[0]!.saasUser!);
    expect(page.deleteTarget?.username).toBe('ana');

    page.cancelDelete();
    expect(page.deleteTarget).toBeNull();
    expect(mocks.deleteUser).not.toHaveBeenCalled();

    page.askDelete(page.rows[0]!.saasUser!);
    mocks.deleteUser.mockResolvedValueOnce({ data: undefined });
    respond([], []);
    await page.confirmDelete();

    expect(mocks.deleteUser).toHaveBeenCalledWith(1);
    expect(page.deleteTarget).toBeNull();
    expect(page.rows).toHaveLength(0);
    expect(page.successMessage).toBe('Usuario ana eliminado.');
  });

  it('mapea el error de la API y no deja mensaje de exito', async () => {
    mocks.listUsers.mockRejectedValueOnce(new Error('boom'));
    const page = useAdminUsersPage();

    await page.load();

    expect(page.error).toBe('mapped-error');
    expect(page.successMessage).toBeNull();
    expect(page.loading).toBe(false);
  });
});
