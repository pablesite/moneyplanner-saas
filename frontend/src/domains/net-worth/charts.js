'use strict';
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
exports.buildByCategoryChart = buildByCategoryChart;
function normalizeNumberInput(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}
function toNumber(v) {
  var n = Number(normalizeNumberInput(v));
  return Number.isFinite(n) ? n : 0;
}
function buildByCategoryChart(summary, baseCurrency) {
  var _a, _b, _c;
  var unit =
    (_a =
      baseCurrency !== null && baseCurrency !== void 0
        ? baseCurrency
        : summary === null || summary === void 0
          ? void 0
          : summary.base_currency) !== null && _a !== void 0
      ? _a
      : 'EUR';
  var assetsBy =
    (_b = summary === null || summary === void 0 ? void 0 : summary.assets_by_category) !== null &&
    _b !== void 0
      ? _b
      : {};
  var liabsBy =
    (_c = summary === null || summary === void 0 ? void 0 : summary.liabilities_by_category) !==
      null && _c !== void 0
      ? _c
      : {};
  var keys = Array.from(
    new Set(
      __spreadArray(__spreadArray([], Object.keys(assetsBy), true), Object.keys(liabsBy), true),
    ),
  );
  return {
    unit: unit,
    keys: keys,
    assets: keys.map(function (key) {
      return Math.max(0, toNumber(assetsBy[key]));
    }),
    liabilities: keys.map(function (key) {
      return Math.max(0, toNumber(liabsBy[key]));
    }),
  };
}
