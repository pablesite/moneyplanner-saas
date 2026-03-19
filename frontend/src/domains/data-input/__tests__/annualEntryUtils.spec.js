'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var vitest_1 = require('vitest');
var annualEntryUtils_1 = require('../annualEntryUtils');
(0, vitest_1.describe)('annualEntryUtils (core)', function () {
  (0, vitest_1.it)('parses annual amounts with locale/thousand separators', function () {
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)('1.234,56')).toBe(1234.56);
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)('1,234.56')).toBe(1234.56);
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)(' 2 500,00 ')).toBe(2500);
  });
  (0, vitest_1.it)('returns zero for invalid or non-positive amounts', function () {
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)('0')).toBe(0);
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)('-20')).toBe(0);
    (0, vitest_1.expect)((0, annualEntryUtils_1.parseAnnualAmount)('abc')).toBe(0);
  });
  (0, vitest_1.it)('normalizes owner name safely', function () {
    (0, vitest_1.expect)((0, annualEntryUtils_1.normalizeOwnerName)('   Ana   López   ')).toBe(
      'Ana López',
    );
  });
});
