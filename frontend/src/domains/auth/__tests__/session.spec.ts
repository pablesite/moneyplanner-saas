import { beforeEach, describe, expect, it } from 'vitest';
import { clearAuthTokens, getAccessToken, setAccessToken } from '@/domains/auth/session';

describe('auth session token', () => {
  beforeEach(() => clearAuthTokens());

  it('keeps the access token in memory only', () => {
    setAccessToken('a1');
    expect(getAccessToken()).toBe('a1');
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('clears the in-memory token', () => {
    setAccessToken('a1');
    clearAuthTokens();
    expect(getAccessToken()).toBeNull();
  });
});
