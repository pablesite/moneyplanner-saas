"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var format_1 = require("@/lib/format");
(0, vitest_1.describe)('format helpers', function () {
    (0, vitest_1.it)('normalizes number input with spaces and commas', function () {
        (0, vitest_1.expect)((0, format_1.normalizeNumberInput)(' 1 234,56 ')).toBe('1234.56');
        (0, vitest_1.expect)((0, format_1.normalizeNumberInput)(undefined)).toBe('');
    });
    (0, vitest_1.it)('resolves max decimals by currency with fallback', function () {
        (0, vitest_1.expect)((0, format_1.getMaxDecimals)('EUR')).toBe(2);
        (0, vitest_1.expect)((0, format_1.getMaxDecimals)('BTC')).toBe(8);
        (0, vitest_1.expect)((0, format_1.getMaxDecimals)('UNKNOWN')).toBe(2);
        (0, vitest_1.expect)((0, format_1.getMaxDecimals)()).toBe(2);
    });
    (0, vitest_1.it)('formats amount and money values', function () {
        (0, vitest_1.expect)((0, format_1.formatAmount)('1234,567', { currency: 'EUR' })).toBe('1.234,57');
        (0, vitest_1.expect)((0, format_1.formatAmount)('0.12345678', { currency: 'BTC' })).toBe('0,12345678');
        (0, vitest_1.expect)((0, format_1.formatAmount)('abc')).toBe('abc');
        var eur = (0, format_1.formatMoney)('1234,5', 'EUR');
        var usd = (0, format_1.formatMoney)('1234,5', 'USD');
        (0, vitest_1.expect)(eur).toContain('1.234,50');
        (0, vitest_1.expect)(usd).toContain('1.234,50');
        (0, vitest_1.expect)((0, format_1.formatMoney)('abc')).toBe('abc');
    });
});
