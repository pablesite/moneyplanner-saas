import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Router } from 'vue-router';

type GuardFn = (to: { path: string; meta: Record<string, unknown> }) => Promise<unknown>;

let mockValidateSession: ReturnType<typeof vi.fn>;
let mockGetSaasMe: ReturnType<typeof vi.fn>;
let mockGetAccessToken: ReturnType<typeof vi.fn>;
let mockClearAuthTokens: ReturnType<typeof vi.fn>;

async function setupGuard(): Promise<GuardFn> {
  vi.resetModules();

  mockValidateSession = vi.fn();
  mockGetSaasMe = vi.fn();
  mockGetAccessToken = vi.fn();
  mockClearAuthTokens = vi.fn();

  vi.doMock('@/domains/auth/api', () => ({
    authApi: {
      validateSession: mockValidateSession,
    },
  }));
  vi.doMock('@/domains/auth/accountApi', () => ({
    getSaasMe: mockGetSaasMe,
  }));
  vi.doMock('@/domains/auth/session', () => ({
    getAccessToken: mockGetAccessToken,
    clearAuthTokens: mockClearAuthTokens,
  }));

  const { registerAuthGuard } = await import('../guard');

  let guard: GuardFn | null = null;
  const router = {
    beforeEach(fn: GuardFn) {
      guard = fn;
    },
  };
  registerAuthGuard(router as unknown as Router);

  if (!guard) throw new Error('Guard not registered');
  return guard;
}

describe('registerAuthGuard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to login when no token is available', async () => {
    const guard = await setupGuard();
    mockGetAccessToken.mockReturnValue(null);

    const result = await guard({ path: '/', meta: {} });
    expect(result).toEqual({ path: '/login' });
  }, 15000);

  it('blocks admin route for non-admin role', async () => {
    const guard = await setupGuard();
    mockGetAccessToken.mockReturnValue('token');
    mockValidateSession.mockResolvedValue({});
    mockGetSaasMe.mockResolvedValue({ data: { role: 'saas_member' } });

    const result = await guard({ path: '/admin/users', meta: { requiresSaasAdmin: true } });
    expect(result).toEqual({ path: '/account', query: { reason: 'permission_denied' } });
  }, 15000);

  it('allows admin route for saas_admin', async () => {
    const guard = await setupGuard();
    mockGetAccessToken.mockReturnValue('token');
    mockValidateSession.mockResolvedValue({});
    mockGetSaasMe.mockResolvedValue({ data: { role: 'saas_admin' } });

    const result = await guard({ path: '/admin/users', meta: { requiresSaasAdmin: true } });
    expect(result).toBe(true);
  }, 15000);
});
