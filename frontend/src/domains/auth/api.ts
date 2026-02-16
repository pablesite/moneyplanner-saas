import type { AxiosResponse } from 'axios';
import { api } from '@/lib/api';
import { capabilities } from '@/domains/capabilities';

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh?: string;
};

export type AuthApiAdapter = {
  login(payload: LoginPayload): Promise<AxiosResponse<LoginResponse>>;
  validateSession(): Promise<AxiosResponse<{ base_currency: string }>>;
};

export const coreAuthApi: AuthApiAdapter = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse>('/api/auth/token/', payload);
  },
  validateSession() {
    return api.get<{ base_currency: string }>('/api/auth/settings/');
  },
};

export const premiumAuthApi: AuthApiAdapter = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse>('/api/auth/token/', payload);
  },
  validateSession() {
    return api.get<{ base_currency: string }>('/api/auth/settings/');
  },
};

export const authApi: AuthApiAdapter = capabilities.isPremium ? premiumAuthApi : coreAuthApi;
