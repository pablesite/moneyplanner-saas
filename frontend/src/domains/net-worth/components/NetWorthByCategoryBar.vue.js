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
var ASSET_COLOR_BY_LABEL = {
  liquidez: 'rgba(92, 192, 255, 0.9)',
  inversiones: 'rgba(74, 209, 179, 0.9)',
  inmuebles: 'rgba(111, 211, 122, 0.9)',
  mobiliario: 'rgba(138, 203, 136, 0.85)',
  otros: 'rgba(122, 161, 194, 0.85)',
};
var LIAB_COLOR_BY_LABEL = {
  hipoteca: 'rgba(255, 99, 132, 0.85)',
  'préstamo personal': 'rgba(255, 120, 150, 0.85)',
  'prestamo personal': 'rgba(255, 120, 150, 0.85)',
  tarjeta: 'rgba(255, 140, 110, 0.85)',
  otros: 'rgba(255, 130, 130, 0.8)',
};
function labelKey(label) {
  return (label || '').trim().toLowerCase();
}
function assetColorFor(label) {
  var _a;
  return (_a = ASSET_COLOR_BY_LABEL[labelKey(label)]) !== null && _a !== void 0
    ? _a
    : 'rgba(92, 192, 255, 0.9)';
}
function liabilityColorFor(label) {
  var _a;
  return (_a = LIAB_COLOR_BY_LABEL[labelKey(label)]) !== null && _a !== void 0
    ? _a
    : 'rgba(255, 99, 132, 0.85)';
}
function formatMoney(n, decimals) {
  if (decimals === void 0) {
    decimals = 0;
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
    labels: orderedLabels.value,
    datasets: [
      {
        label: 'Activos',
        data: orderedAssets.value,
        backgroundColor: orderedLabels.value.map(function (l) {
          return assetColorFor(l);
        }),
        borderRadius: 8,
        barThickness: 18,
      },
      {
        label: 'Pasivos',
        data: orderedLiabilities.value.map(function (v) {
          return -Math.abs(v);
        }),
        backgroundColor: orderedLabels.value.map(function (l) {
          return liabilityColorFor(l);
        }),
        borderRadius: 8,
        barThickness: 18,
      },
    ],
  };
});
var ASSET_ORDER = ['liquidez', 'inversiones', 'inmuebles', 'mobiliario', 'otros'];
var LIAB_ORDER = ['tarjeta', 'préstamo personal', 'prestamo personal', 'hipoteca', 'otros'];
var assetRank = new Map(
  ASSET_ORDER.map(function (k, i) {
    return [k, i];
  }),
);
var liabRank = new Map(
  LIAB_ORDER.map(function (k, i) {
    return [k, i];
  }),
);
var orderedIndex = (0, vue_1.computed)(function () {
  var indexed = props.labels.map(function (label, i) {
    return { label: label, i: i };
  });
  return indexed.sort(function (a, b) {
    var _a, _b, _c, _d;
    var ak = labelKey(a.label);
    var bk = labelKey(b.label);
    var aIsAsset = assetRank.has(ak);
    var bIsAsset = assetRank.has(bk);
    var aIsLiab = liabRank.has(ak);
    var bIsLiab = liabRank.has(bk);
    // 1) Activos primero, luego pasivos, luego resto
    var aGroup = aIsAsset ? 0 : aIsLiab ? 1 : 2;
    var bGroup = bIsAsset ? 0 : bIsLiab ? 1 : 2;
    if (aGroup !== bGroup) return aGroup - bGroup;
    // 2) Dentro de activos/pasivos, usar su orden fijo
    if (aGroup === 0) {
      var ai = (_a = assetRank.get(ak)) !== null && _a !== void 0 ? _a : Number.MAX_SAFE_INTEGER;
      var bi = (_b = assetRank.get(bk)) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER;
      if (ai !== bi) return ai - bi;
    } else if (aGroup === 1) {
      var ai = (_c = liabRank.get(ak)) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
      var bi = (_d = liabRank.get(bk)) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
      if (ai !== bi) return ai - bi;
    }
    return a.label.localeCompare(b.label);
  });
});
var orderedLabels = (0, vue_1.computed)(function () {
  return orderedIndex.value.map(function (x) {
    return x.label;
  });
});
var orderedAssets = (0, vue_1.computed)(function () {
  return orderedIndex.value.map(function (x) {
    var _a;
    return (_a = props.assets[x.i]) !== null && _a !== void 0 ? _a : 0;
  });
});
var orderedLiabilities = (0, vue_1.computed)(function () {
  return orderedIndex.value.map(function (x) {
    var _a;
    return (_a = props.liabilities[x.i]) !== null && _a !== void 0 ? _a : 0;
  });
});
var options = (0, vue_1.computed)(function () {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: true,
        labels: { color: 'rgba(255,255,255,0.75)' },
      },
      tooltip: {
        callbacks: {
          title: function (items) {
            var _a, _b;
            return (_b =
              (_a = items === null || items === void 0 ? void 0 : items[0]) === null ||
              _a === void 0
                ? void 0
                : _a.label) !== null && _b !== void 0
              ? _b
              : '';
          },
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
      y: {
        stacked: true,
        ticks: {
          color: 'rgba(255,255,255,0.70)',
          font: { size: 12 },
        },
        grid: { display: false },
      },
      x: {
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
)(__assign({ class: 'nw-bar-chart-category' }));
/** @type {__VLS_StyleScopedClasses['nw-bar-chart-category']} */ var __VLS_0;
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
