'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/** @vitest-environment jsdom */
var vitest_1 = require('vitest');
var test_utils_1 = require('@vue/test-utils');
var ItemSubgroupHeader_vue_1 = require('../ItemSubgroupHeader.vue');
(0, vitest_1.describe)('ItemSubgroupHeader', function () {
  (0, vitest_1.it)('renders labels and totals', function () {
    var wrapper = (0, test_utils_1.mount)(ItemSubgroupHeader_vue_1.default, {
      props: {
        label: 'Inversiones',
        totalsLine: '600 EUR',
        baseLabel: '600 EUR',
        percent: '50',
        showBaseTotal: true,
      },
    });
    (0, vitest_1.expect)(wrapper.text()).toContain('Inversiones');
    (0, vitest_1.expect)(wrapper.text()).toContain('600 EUR');
    (0, vitest_1.expect)(wrapper.text()).toContain('50%');
  });
  (0, vitest_1.it)('hides base label when showBaseTotal is false', function () {
    var wrapper = (0, test_utils_1.mount)(ItemSubgroupHeader_vue_1.default, {
      props: {
        label: 'Efectivo',
        totalsLine: '300 EUR',
        baseLabel: '300 EUR',
        percent: '20',
        showBaseTotal: false,
      },
    });
    (0, vitest_1.expect)(wrapper.text()).toContain('300 EUR');
    (0, vitest_1.expect)(wrapper.text()).not.toContain('20%');
  });
});
