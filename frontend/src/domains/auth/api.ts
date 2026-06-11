import type { AxiosResponse } from 'axios';
import { api } from '@/lib/api';

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh?: string;
};

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  role: 'saas_admin' | 'saas_member';
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled';
  premium_enabled: boolean;
  account_link: {
    core_user_ref: string;
    core_username: string;
    core_email: string;
    is_active: boolean;
    linked_at: string;
  } | null;
};

export type AuthApiAdapter = {
  login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>>;
  validateSession(): Promise<AxiosResponse<CurrentUser>>;
};

export const coreAuthApi: AuthApiAdapter = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse>('/api/auth/token/', payload);
  },
  validateSession() {
    return api.get<CurrentUser>('/api/auth/me/');
  },
};

export const authApi: AuthApiAdapter = coreAuthApi;
