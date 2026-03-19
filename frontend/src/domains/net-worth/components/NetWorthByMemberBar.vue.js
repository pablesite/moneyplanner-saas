'use strict';
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var vue_chartjs_1 = require('vue-chartjs');
var chart_js_1 = require('chart.js');
chart_js_1.Chart.register(
  chart_js_1.CategoryScale,
  chart_js_1.LinearScale,
  chart_js_1.BarElement,
  chart_js_1.Tooltip,
  chart_js_1.Legend,
);
var props = defineProps();
var ASSET_COLOR = 'rgba(92, 192, 255, 0.9)';
var LIABILITY_COLOR = 'rgba(255, 99, 132, 0.85)';
function formatMoney(n, decimals) {
  if (decimals === void 0) {
    decimals = 2;
  }
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}
function formatTickCompact(value) {
  var v = Math.abs(value);
  if (v >= 1000000) return ''.concat(formatMoney(v / 1000000, 1), 'M');
  if (v >= 1000) return ''.concat(formatMoney(v / 1000, 1), 'k');
  return formatMoney(v, 0);
}
var data = (0, vue_1.computed)(function () {
  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Activos',
        data: props.assets,
        backgroundColor: ASSET_COLOR,
        borderRadius: 8,
        barThickness: 28,
      },
      {
        label: 'Pasivos',
        data: props.liabilities.map(function (v) {
          return -Math.abs(v);
        }),
        backgroundColor: LIABILITY_COLOR,
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };
});
var options = (0, vue_1.computed)(function () {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { color: 'rgba(255,255,255,0.75)' },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            var _a;
            var label = (_a = ctx.dataset.label) !== null && _a !== void 0 ? _a : '';
            var raw = typeof ctx.raw === 'number' ? ctx.raw : 0;
            var v = Math.abs(raw);
            return ''.concat(label, ': ').concat(formatMoney(v, 2), ' ').concat(props.unit);
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: 'rgba(255,255,255,0.65)' },
        grid: { display: false },
      },
      y: {
        stacked: true,
        ticks: {
          color: 'rgba(255,255,255,0.65)',
          callback: function (value) {
            var v = typeof value === 'number' ? value : Number(value);
            return formatTickCompact(v);
          },
        },
        grid: { color: 'rgba(255,255,255,0.08)' },
      },
    },
  };
});
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-bar-wrap' }));
/** @type {__VLS_StyleScopedClasses['nw-bar-wrap']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-bar-chart-member' }));
/** @type {__VLS_StyleScopedClasses['nw-bar-chart-member']} */ var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Bar} */
vue_chartjs_1.Bar;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0({
    data: __VLS_ctx.data,
    options: __VLS_ctx.options,
  }),
);
var __VLS_2 = __VLS_1.apply(
  void 0,
  __spreadArray(
    [
      {
        data: __VLS_ctx.data,
        options: __VLS_ctx.options,
      },
    ],
    __VLS_functionalComponentArgsRest(__VLS_1),
    false,
  ),
);
// @ts-ignore
[data, options];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeProps: {},
});
exports.default = {};
