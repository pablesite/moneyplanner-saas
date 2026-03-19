"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var vitest_1 = require("vitest");
var errors_1 = require("@/lib/errors");
(0, vitest_1.describe)('core api error helper', function () {
    (0, vitest_1.it)('extracts API code from axios envelope', function () {
        var err = { response: { data: { error: { code: 'permission_denied' } } } };
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.getApiErrorCode)(err)).toBe('permission_denied');
        spy.mockRestore();
    });
    (0, vitest_1.it)('maps known API codes to human messages', function () {
        var err = { response: { data: { error: { code: 'subscription_blocked' } } } };
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)(err)).toContain('suscripcion');
        spy.mockRestore();
    });
    (0, vitest_1.it)('prioritizes validation details from API envelope', function () {
        var err = {
            response: {
                data: {
                    error: {
                        code: 'validation_error',
                        message: 'Request failed.',
                        details: {
                            market_value_override_date: ['Requerida si se informa valor de mercado manual.'],
                        },
                    },
                },
            },
            message: 'fallback',
        };
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)(err)).toBe('market_value_override_date: Requerida si se informa valor de mercado manual.');
        spy.mockRestore();
    });
    (0, vitest_1.it)('falls back to envelope message, validation payload, string payload, error message and default', function () {
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)({ response: { data: { error: { message: 'boom' } } }, message: 'x' })).toBe('boom');
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)({ response: { data: { detail: 'x' } }, message: 'fallback' })).toBe('x');
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)({ response: { data: 'plain' }, message: 'x' })).toBe('plain');
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)({ message: 'fallback' })).toBe('fallback');
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)({})).toBe('Error');
        spy.mockRestore();
    });
    (0, vitest_1.it)('maps 401 token endpoint to invalid credentials message', function () {
        var err = {
            response: {
                status: 401,
                data: { detail: 'No active account found with the given credentials' },
            },
            config: { url: '/api/auth/token/' },
            message: 'Request failed with status code 401',
        };
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.toApiErrorMessage)(err)).toBe('Usuario o contrasena incorrectos.');
        spy.mockRestore();
    });
    (0, vitest_1.it)('returns null code for non axios errors', function () {
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(false);
        (0, vitest_1.expect)((0, errors_1.getApiErrorCode)(new Error('x'))).toBeNull();
        spy.mockRestore();
    });
});
