import { api } from '@/lib/api';

export type SaasRole = 'saas_admin' | 'saas_member';

export type SaasAdminUser = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  role: SaasRole;
};

export type SaasAdminCreateUserPayload = {
  username: string;
  password: string;
  email?: string;
  role: SaasRole;
  is_active: boolean;
};

export async function listSaasAdminUsers() {
  return api.get<SaasAdminUser[]>('/api/admin/users/');
}

export async function createSaasAdminUser(payload: SaasAdminCreateUserPayload) {
  return api.post<SaasAdminUser>('/api/admin/users/', payload);
}

export async function patchSaasAdminUserRole(userId: number, role: SaasRole) {
  return api.patch<SaasAdminUser>(`/api/admin/users/${userId}/role/`, { role });
}

export async function patchSaasAdminUserStatus(userId: number, isActive: boolean) {
  return api.patch<SaasAdminUser>(`/api/admin/users/${userId}/status/`, { is_active: isActive });
}
