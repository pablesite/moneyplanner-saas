'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.normalizeNumberInput = normalizeNumberInput;
exports.getMaxDecimals = getMaxDecimals;
exports.formatAmount = formatAmount;
exports.formatMoney = formatMoney;
var decimalsByCurrency = {
  EUR: 2,
  USD: 2,
  BTC: 8,
  ETH: 8,
};
function normalizeNumberInput(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}
function getMaxDecimals(currency) {
  var _a;
  if (!currency) return 2;
  return (_a = decimalsByCurrency[currency]) !== null && _a !== void 0 ? _a : 2;
}
// Para cantidades (con separador de miles, sin símbolo)
function formatAmount(value, opts) {
  var _a;
  if (opts === void 0) {
    opts = {};
  }
  var s = normalizeNumberInput(value);
  var n = Number(s);
  if (Number.isNaN(n)) return String(value !== null && value !== void 0 ? value : '');
  var max = (_a = opts.maxDecimals) !== null && _a !== void 0 ? _a : getMaxDecimals(opts.currency);
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: max,
  }).format(n);
}
// Para dinero fiat con símbolo opcional (si lo quieres)
function formatMoney(value, currency) {
  if (currency === void 0) {
    currency = 'EUR';
  }
  var s = normalizeNumberInput(value);
  var n = Number(s);
  if (Number.isNaN(n)) return String(value !== null && value !== void 0 ? value : '');
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
