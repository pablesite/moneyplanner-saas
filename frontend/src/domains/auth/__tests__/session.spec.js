'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var vitest_1 = require('vitest');
var session_1 = require('@/domains/auth/session');
(0, vitest_1.describe)('auth session tokens', function () {
  (0, vitest_1.beforeEach)(function () {
    localStorage.clear();
  });
  (0, vitest_1.it)('stores and retrieves access/refresh tokens', function () {
    (0, session_1.setAccessToken)('a1');
    (0, session_1.setRefreshToken)('r1');
    (0, vitest_1.expect)((0, session_1.getAccessToken)()).toBe('a1');
    (0, vitest_1.expect)((0, session_1.getRefreshToken)()).toBe('r1');
  });
  (0, vitest_1.it)('clears stored tokens', function () {
    (0, session_1.setAccessToken)('a1');
    (0, session_1.setRefreshToken)('r1');
    (0, session_1.clearAuthTokens)();
    (0, vitest_1.expect)((0, session_1.getAccessToken)()).toBeNull();
    (0, vitest_1.expect)((0, session_1.getRefreshToken)()).toBeNull();
  });
});
