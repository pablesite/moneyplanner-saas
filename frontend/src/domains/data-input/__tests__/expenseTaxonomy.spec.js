'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var vitest_1 = require('vitest');
var expenseTaxonomy_1 = require('../expenseTaxonomy');
(0, vitest_1.describe)('expense taxonomy (core)', function () {
  (0, vitest_1.it)('defines subcategories for every category', function () {
    var categories = expenseTaxonomy_1.expenseCategories.map(function (c) {
      return c.value;
    });
    var _loop_1 = function (category) {
      var rows = expenseTaxonomy_1.expenseSubcategories.filter(function (sub) {
        return sub.category === category;
      });
      (0, vitest_1.expect)(rows.length).toBeGreaterThan(0);
    };
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
      var category = categories_1[_i];
      _loop_1(category);
    }
  });
  (0, vitest_1.it)('includes at least one fallback subcategory per category', function () {
    var categories = expenseTaxonomy_1.expenseCategories.map(function (c) {
      return c.value;
    });
    var _loop_2 = function (category) {
      var rows = expenseTaxonomy_1.expenseSubcategories.filter(function (sub) {
        return sub.category === category;
      });
      var hasFallback = rows.some(function (sub) {
        return sub.value.startsWith('other') || sub.value === 'other';
      });
      (0, vitest_1.expect)(hasFallback).toBe(true);
    };
    for (var _i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
      var category = categories_2[_i];
      _loop_2(category);
    }
  });
});
