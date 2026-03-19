"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var vitest_1 = require("vitest");
var errors_1 = require("@/domains/people/errors");
(0, vitest_1.describe)('people error mapper', function () {
    (0, vitest_1.it)('returns plain string for non axios errors', function () {
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(false);
        (0, vitest_1.expect)((0, errors_1.toPeopleErrorMessage)('x')).toBe('x');
        spy.mockRestore();
    });
    (0, vitest_1.it)('prefers mapped API message when available', function () {
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        var err = {
            response: { data: { error: { code: 'permission_denied' } } },
            message: 'fallback',
        };
        (0, vitest_1.expect)((0, errors_1.toPeopleErrorMessage)(err)).toContain('permisos');
        spy.mockRestore();
    });
    (0, vitest_1.it)('uses detail/first field or axios message as fallback', function () {
        var spy = vitest_1.vi.spyOn(axios_1.default, 'isAxiosError').mockReturnValue(true);
        (0, vitest_1.expect)((0, errors_1.toPeopleErrorMessage)({ response: { data: { detail: 'detail-msg' } } })).toBe('detail-msg');
        (0, vitest_1.expect)((0, errors_1.toPeopleErrorMessage)({ response: { data: { field: ['first-error'] } } })).toBe('field: first-error');
        (0, vitest_1.expect)((0, errors_1.toPeopleErrorMessage)({ response: { data: null }, message: 'axios-msg' })).toBe('axios-msg');
        spy.mockRestore();
    });
});
