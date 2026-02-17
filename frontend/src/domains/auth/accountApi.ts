import { api } from '@/lib/api';

export type AuthModeResponse = {
  auth_mode: string;
  auth_mode_enabled: boolean;
  account_linking_enabled: boolean;
};

export type CoreAccountLinkResponse = {
  core_user_ref: string;
  core_username: string;
  core_email: string;
  is_active: boolean;
  linked_at: string;
};

export type SaasMeResponse = {
  id: number;
  username: string;
  email: string;
  role: 'saas_admin' | 'saas_member';
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled';
  premium_enabled: boolean;
  account_link: CoreAccountLinkResponse | null;
};

export type SaasSubscriptionResponse = {
  status: 'trial' | 'active' | 'past_due' | 'canceled';
  started_at: string;
  updated_at: string;
  premium_enabled: boolean;
};

export type CoreAccountLinkPayload = {
  core_user_ref: string;
  core_username?: string;
  core_email?: string;
};

export async function getAuthMode() {
  return api.get<AuthModeResponse>('/api/auth/mode/');
}

export async function getSaasMe() {
  return api.get<SaasMeResponse>('/api/auth/me/');
}

export async function getSaasSubscription() {
  return api.get<SaasSubscriptionResponse>('/api/auth/subscription/');
}

export async function upsertCoreLink(payload: CoreAccountLinkPayload) {
  return api.post<CoreAccountLinkResponse>('/api/auth/core-link/', payload);
}

export async function deleteCoreLink() {
  return api.delete('/api/auth/core-link/');
}
