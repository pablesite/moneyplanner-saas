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
  chart_js_1.PointElement,
  chart_js_1.LineElement,
  chart_js_1.Filler,
  chart_js_1.Tooltip,
  chart_js_1.Legend,
);
var props = withDefaults(defineProps(), {
  ariaLabel: 'Grafico de evolucion patrimonial',
  seriesColor: '#4cc3ff',
  expanded: false,
});
function formatNumber(n, decimals) {
  if (decimals === void 0) {
    decimals = 2;
  }
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}
function formatCompact(value) {
  var abs = Math.abs(value);
  if (abs >= 1000000000) return ''.concat(formatNumber(value / 1000000000, 1), 'B');
  if (abs >= 1000000) return ''.concat(formatNumber(value / 1000000, 1), 'M');
  if (abs >= 1000) return ''.concat(formatNumber(value / 1000, 1), 'k');
  return formatNumber(value, 0);
}
var xTickStep = (0, vue_1.computed)(function () {
  if (props.points.length <= 6) return 1;
  return Math.ceil(props.points.length / 6);
});
var chartData = (0, vue_1.computed)(function () {
  return {
    labels: props.points.map(function (point) {
      return point.shortLabel;
    }),
    datasets: [
      {
        label: props.seriesLabel,
        data: props.points.map(function (point) {
          return point.value;
        }),
        borderColor: props.seriesColor,
        backgroundColor: 'rgba(76, 195, 255, 0.12)',
        borderWidth: props.expanded ? 3 : 2.5,
        tension: 0.32,
        fill: true,
        pointRadius: props.points.length > 1 ? 2 : 4,
        pointHoverRadius: 7,
        pointHitRadius: 20,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
        pointBackgroundColor: '#f6fbff',
        pointHoverBackgroundColor: '#ffffff',
        pointBorderColor: props.seriesColor,
        pointHoverBorderColor: props.seriesColor,
      },
    ],
  };
});
var chartOptions = (0, vue_1.computed)(function () {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgba(10, 17, 26, 0.96)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 12,
          weight: 600,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: function (items) {
            var _a, _b, _c, _d;
            var index =
              (_b = (_a = items[0]) === null || _a === void 0 ? void 0 : _a.dataIndex) !== null &&
              _b !== void 0
                ? _b
                : 0;
            return (_d =
              (_c = props.points[index]) === null || _c === void 0 ? void 0 : _c.fullLabel) !==
              null && _d !== void 0
              ? _d
              : '';
          },
          label: function (ctx) {
            var _a;
            return ''
              .concat(props.seriesLabel, ': ')
              .concat(
                formatNumber(Number((_a = ctx.raw) !== null && _a !== void 0 ? _a : 0), 2),
                ' ',
              )
              .concat(props.unit);
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgba(226, 232, 240, 0.72)',
          maxRotation: 0,
          autoSkip: false,
          callback: function (_value, index) {
            var _a, _b, _c, _d;
            if (index === 0 || index === props.points.length - 1) {
              return (_b =
                (_a = props.points[index]) === null || _a === void 0 ? void 0 : _a.shortLabel) !==
                null && _b !== void 0
                ? _b
                : '';
            }
            return index % xTickStep.value === 0
              ? (_d =
                  (_c = props.points[index]) === null || _c === void 0 ? void 0 : _c.shortLabel) !==
                  null && _d !== void 0
                ? _d
                : ''
              : '';
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.12)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: 'rgba(226, 232, 240, 0.72)',
          callback: function (value) {
            return formatCompact(Number(value));
          },
        },
      },
    },
  };
});
var __VLS_defaults = {
  ariaLabel: 'Grafico de evolucion patrimonial',
  seriesColor: '#4cc3ff',
  expanded: false,
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-nw-timeline-chart-card' },
    { class: { 'ui-nw-timeline-chart-card-expanded': __VLS_ctx.expanded } },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-chart-card']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-chart-card-expanded']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(
  __assign(
    { class: 'ui-nw-timeline-chart-canvas' },
    { class: { 'ui-nw-timeline-chart-canvas-expanded': __VLS_ctx.expanded } },
  ),
);
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-chart-canvas']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-timeline-chart-canvas-expanded']} */ var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Line} */
vue_chartjs_1.Line;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(
  __VLS_0,
  new __VLS_0({
    'aria-label': __VLS_ctx.ariaLabel,
    data: __VLS_ctx.chartData,
    options: __VLS_ctx.chartOptions,
  }),
);
var __VLS_2 = __VLS_1.apply(
  void 0,
  __spreadArray(
    [
      {
        'aria-label': __VLS_ctx.ariaLabel,
        data: __VLS_ctx.chartData,
        options: __VLS_ctx.chartOptions,
      },
    ],
    __VLS_functionalComponentArgsRest(__VLS_1),
    false,
  ),
);
// @ts-ignore
[expanded, expanded, ariaLabel, chartData, chartOptions];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __defaults: __VLS_defaults,
  __typeProps: {},
});
exports.default = {};
