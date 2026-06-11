import type { AxiosResponse } from 'axios';
import { api } from '@/lib/api';

export type SaasAdminRole = 'saas_admin' | 'saas_member';

export type SaasAdminUser = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: SaasAdminRole;
  core_user_origin: 'core_native' | 'manual_link' | null;
  account_link: {
    core_user_ref: string;
    core_username: string;
    core_email: string;
    is_active: boolean;
    linked_at: string;
  } | null;
  core_connection: {
    status: 'member_bootstrap' | 'core_native' | 'manual_link';
    label: string;
    core_user_ref: string;
    core_username: string;
    core_email: string;
    is_manual: boolean;
  } | null;
};

export type CoreAdminUser = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  origin: 'core_native' | 'saas_bootstrap';
  external_identities: Array<{
    provider: string;
    external_user_id: string;
  }>;
  connection_kind: 'bootstrap' | 'manual_link' | 'unlinked';
  linked_saas_user: {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    role: SaasAdminRole;
  } | null;
};

export type SaasAdminUsersResponse = {
  saas_users: SaasAdminUser[];
  core_users: CoreAdminUser[];
};

export type CreateSaasAdminUserPayload = {
  username: string;
  password: string;
  email?: string;
  role?: SaasAdminRole;
  is_active?: boolean;
};

export const saasAdminApi = {
  listUsers(): Promise<AxiosResponse<SaasAdminUsersResponse>> {
    return api.get<SaasAdminUsersResponse>('/api/admin/users/');
  },
  createUser(payload: CreateSaasAdminUserPayload): Promise<AxiosResponse<SaasAdminUser>> {
    return api.post<SaasAdminUser>('/api/admin/users/', payload);
  },
  updateUserRole(userId: number, role: SaasAdminRole): Promise<AxiosResponse<SaasAdminUser>> {
    return api.patch<SaasAdminUser>(`/api/admin/users/${userId}/role/`, { role });
  },
  updateUserStatus(userId: number, is_active: boolean): Promise<AxiosResponse<SaasAdminUser>> {
    return api.patch<SaasAdminUser>(`/api/admin/users/${userId}/status/`, { is_active });
  },
  deleteUser(userId: number): Promise<AxiosResponse<void>> {
    return api.delete<void>(`/api/admin/users/${userId}/`);
  },
};
