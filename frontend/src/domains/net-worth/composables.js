'use strict';
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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.useNetWorthViewState = useNetWorthViewState;
var vue_1 = require('vue');
var netWorth_1 = require('@/stores/netWorth');
var charts_1 = require('@/domains/net-worth/charts');
var currencies = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
];
var assetCategories = [
  { value: 'cash', label: 'Liquidez' },
  { value: 'investments', label: 'Inversiones' },
  { value: 'real_estate', label: 'Inmuebles' },
  { value: 'furnishings', label: 'Mobiliario' },
  { value: 'other', label: 'Otros' },
];
var assetSubcategories = [
  { category: 'cash', value: 'bank_account', label: 'Cuenta bancaria' },
  { category: 'cash', value: 'short_term_deposit', label: 'Deposito a corto plazo' },
  { category: 'cash', value: 'wallet', label: 'Monedero' },
  { category: 'cash', value: 'crypto_spot_earn', label: 'Spot/Earn Cripto' },
  { category: 'cash', value: 'other', label: 'Otros' },
  { category: 'investments', value: 'deposits', label: 'Depósitos' },
  { category: 'investments', value: 'funds', label: 'Fondos' },
  { category: 'investments', value: 'etfs', label: 'ETFs' },
  { category: 'investments', value: 'roboadvisor', label: 'Roboadvisor' },
  { category: 'investments', value: 'stocks', label: 'Stocks' },
  { category: 'investments', value: 'pension_plans', label: 'Planes de pensiones' },
  { category: 'investments', value: 'cryptocurrencies', label: 'Criptomonedas' },
  { category: 'investments', value: 'real_estate_crowd', label: 'Crowdfunding Inmobiliario' },
  { category: 'investments', value: 'crowdlending', label: 'Crowdlending' },
  { category: 'investments', value: 'other', label: 'Otros' },
  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
  { category: 'real_estate', value: 'second_home', label: 'Vivienda no habitual' },
  { category: 'real_estate', value: 'rental', label: 'Vivienda no habitual (alquiler)' },
  { category: 'real_estate', value: 'other', label: 'Otros' },
  { category: 'furnishings', value: 'vehicles', label: 'Vehículos' },
  { category: 'furnishings', value: 'technology', label: 'Tecnología' },
  { category: 'furnishings', value: 'home_furnishings', label: 'Muebles vivienda' },
  { category: 'furnishings', value: 'sports_equipment', label: 'Equipamiento deportivo' },
  { category: 'furnishings', value: 'jewelry', label: 'Joyería' },
  { category: 'furnishings', value: 'other', label: 'Otros' },
  { category: 'other', value: 'other', label: 'Otros' },
];
var liabilityCategories = [
  { value: 'mortgage', label: 'Hipoteca' },
  { value: 'personal_loan', label: 'Prestamo personal' },
  { value: 'credit_card', label: 'Tarjeta' },
  { value: 'other', label: 'Otros' },
];
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
function formatEditAmount(raw, currency) {
  var _a;
  var max = (_a = decimalsByCurrency[currency]) !== null && _a !== void 0 ? _a : 2;
  var s = normalizeNumberInput(raw);
  if (!s) return '';
  var isNegative = s.startsWith('-');
  if (isNegative) s = s.slice(1);
  if ((s.match(/\./g) || []).length > 1) {
    return isNegative ? '-'.concat(s) : s;
  }
  var _b = s.split('.'),
    _c = _b[0],
    i = _c === void 0 ? '' : _c,
    _d = _b[1],
    d = _d === void 0 ? '' : _d;
  var out = d ? ''.concat(i, '.').concat(d.slice(0, max)) : i;
  out = out.replace(/\.?0+$/, '');
  if (out.startsWith('.')) out = '0'.concat(out);
  return isNegative ? '-'.concat(out) : out;
}
function formatMoney(v, decimals) {
  if (decimals === void 0) {
    decimals = 2;
  }
  if (v == null) return '-';
  var s = normalizeNumberInput(v);
  var n = Number(s);
  if (Number.isNaN(n)) return v;
  return new Intl.NumberFormat('es-ES', {
    useGrouping: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}
function buildEditScheduleFields(item) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
  return {
    deposit_term_months: (_a = item.deposit_term_months) !== null && _a !== void 0 ? _a : '',
    monthly_payment_amount: (_b = item.monthly_payment_amount) !== null && _b !== void 0 ? _b : '',
    start_date: (_c = item.start_date) !== null && _c !== void 0 ? _c : '',
    expected_end_date: (_d = item.expected_end_date) !== null && _d !== void 0 ? _d : '',
    term_months: (_e = item.term_months) !== null && _e !== void 0 ? _e : '',
    rate_type: (_f = item.rate_type) !== null && _f !== void 0 ? _f : 'fixed',
    payment_frequency: (_g = item.payment_frequency) !== null && _g !== void 0 ? _g : 'monthly',
    expense_subcategory_override:
      (_h = item.expense_subcategory_override) !== null && _h !== void 0 ? _h : '',
    amortization_system: (_j = item.amortization_system) !== null && _j !== void 0 ? _j : '',
    opening_fees_amount: (_k = item.opening_fees_amount) !== null && _k !== void 0 ? _k : '',
    early_repayment_fee_percent:
      (_l = item.early_repayment_fee_percent) !== null && _l !== void 0 ? _l : '',
    novation_subrogation_fee_amount:
      (_m = item.novation_subrogation_fee_amount) !== null && _m !== void 0 ? _m : '',
    linked_products_monthly_cost:
      (_o = item.linked_products_monthly_cost) !== null && _o !== void 0 ? _o : '',
    cancellation_forecast_enabled:
      (_p = item.cancellation_forecast_enabled) !== null && _p !== void 0 ? _p : false,
    cancellation_date: (_q = item.cancellation_date) !== null && _q !== void 0 ? _q : '',
    cancellation_fee_amount:
      (_r = item.cancellation_fee_amount) !== null && _r !== void 0 ? _r : '',
  };
}
function buildEditInvestmentFields(item) {
  var _a, _b, _c, _d, _e, _f, _g;
  return {
    investment_contribution_mode:
      (_a = item.investment_contribution_mode) !== null && _a !== void 0 ? _a : 'one_time',
    investment_contribution_frequency:
      (_b = item.investment_contribution_frequency) !== null && _b !== void 0 ? _b : 'monthly',
    investment_contribution_currency:
      (_c = item.investment_contribution_currency) !== null && _c !== void 0 ? _c : '',
    monthly_contribution_amount:
      (_d = item.monthly_contribution_amount) !== null && _d !== void 0 ? _d : '',
    market_value_override: (_e = item.market_value_override) !== null && _e !== void 0 ? _e : '',
    market_value_override_date:
      (_f = item.market_value_override_date) !== null && _f !== void 0 ? _f : '',
    initial_purchase_value: (_g = item.initial_purchase_value) !== null && _g !== void 0 ? _g : '',
  };
}
function buildEditValuationFields(item) {
  var _a, _b, _c, _d, _e, _f, _g;
  return {
    amortization_method: (_a = item.amortization_method) !== null && _a !== void 0 ? _a : 'none',
    amortization_term_years:
      (_b = item.amortization_term_years) !== null && _b !== void 0 ? _b : '',
    valuation_model: (_c = item.valuation_model) !== null && _c !== void 0 ? _c : 'manual',
    land_value_share_percent:
      (_d = item.land_value_share_percent) !== null && _d !== void 0 ? _d : '',
    land_annual_appreciation_percent:
      (_e = item.land_annual_appreciation_percent) !== null && _e !== void 0 ? _e : '',
    building_annual_depreciation_percent:
      (_f = item.building_annual_depreciation_percent) !== null && _f !== void 0 ? _f : '',
    improvements: (_g = item.improvements) !== null && _g !== void 0 ? _g : [],
  };
}
function buildEditInitialPayload(item) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
  return __assign(
    __assign(
      __assign(
        __assign(
          {
            name: (_a = item.name) !== null && _a !== void 0 ? _a : '',
            category: (_b = item.category) !== null && _b !== void 0 ? _b : '',
            subcategory: (_c = item.subcategory) !== null && _c !== void 0 ? _c : '',
            amount: formatEditAmount(
              item.amount,
              (_d = item.currency) !== null && _d !== void 0 ? _d : 'EUR',
            ),
            annual_interest_tae:
              (_e = item.annual_interest_tae) !== null && _e !== void 0 ? _e : '',
            estimated_average_balance_for_interest:
              (_f = item.estimated_average_balance_for_interest) !== null && _f !== void 0
                ? _f
                : '',
          },
          buildEditScheduleFields(item),
        ),
        buildEditInvestmentFields(item),
      ),
      buildEditValuationFields(item),
    ),
    {
      notes: (_g = item.notes) !== null && _g !== void 0 ? _g : '',
      currency: (_h = item.currency) !== null && _h !== void 0 ? _h : '',
      tracking_mode: (_j = item.tracking_mode) !== null && _j !== void 0 ? _j : 'manual',
      is_active: (_k = item.is_active) !== null && _k !== void 0 ? _k : true,
      ownership_id: (_l = item.ownership_ref) !== null && _l !== void 0 ? _l : null,
      financed_asset_id: (_m = item.financed_asset_ref) !== null && _m !== void 0 ? _m : null,
    },
  );
}
function filterByCategoryRows(chart) {
  var _a, _b;
  var out = [];
  for (var i = 0; i < chart.keys.length; i += 1) {
    var key = chart.keys[i];
    if (!key) continue;
    var assetValue = (_a = chart.assets[i]) !== null && _a !== void 0 ? _a : 0;
    var liabilityValue = (_b = chart.liabilities[i]) !== null && _b !== void 0 ? _b : 0;
    if (assetValue !== 0 || liabilityValue !== 0) {
      out.push({ key: key, a: assetValue, l: liabilityValue });
    }
  }
  return out;
}
function useNetWorthViewState() {
  var _this = this;
  var store = (0, netWorth_1.useNetWorthStore)();
  var valueMode = (0, vue_1.ref)('nominal');
  var showAssetModal = (0, vue_1.ref)(false);
  var showLiabilityModal = (0, vue_1.ref)(false);
  var showBreakdown = (0, vue_1.ref)(false);
  var showEditModal = (0, vue_1.ref)(false);
  var editItem = (0, vue_1.ref)(null);
  var editKind = (0, vue_1.ref)(null);
  var canShowReal = function () {
    var _a, _b;
    return (
      store.baseCurrency === 'EUR' &&
      !!((_a = store.summary) === null || _a === void 0 ? void 0 : _a.inflation_available) &&
      ((_b = store.summary) === null || _b === void 0 ? void 0 : _b.net_worth_real) !== null
    );
  };
  (0, vue_1.watch)(
    function () {
      return store.baseCurrency;
    },
    function (c) {
      if (c !== 'EUR' && valueMode.value === 'real') valueMode.value = 'nominal';
    },
  );
  (0, vue_1.watch)(
    function () {
      var _a;
      return (_a = store.summary) === null || _a === void 0 ? void 0 : _a.inflation_base_period;
    },
    function () {
      if (!canShowReal() && valueMode.value === 'real') valueMode.value = 'nominal';
    },
  );
  var prettyError = function () {
    if (!store.error) return null;
    try {
      var parsed = JSON.parse(store.error);
      if (parsed === null || parsed === void 0 ? void 0 : parsed.detail) return parsed.detail;
      return store.error;
    } catch (_a) {
      return store.error;
    }
  };
  function submitAsset(payload) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, store.createAsset(payload)];
          case 1:
            _a.sent();
            showAssetModal.value = false;
            return [2 /*return*/];
        }
      });
    });
  }
  function submitLiability(payload) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, store.createLiability(payload)];
          case 1:
            _a.sent();
            showLiabilityModal.value = false;
            return [2 /*return*/];
        }
      });
    });
  }
  function openEdit(item, kind) {
    editItem.value = item;
    editKind.value = kind;
    showEditModal.value = true;
  }
  function closeEdit() {
    showEditModal.value = false;
    editItem.value = null;
    editKind.value = null;
  }
  function confirmDeleteSnapshot(id) {
    if (store.loading) return;
    if (confirm('Eliminar este snapshot?')) {
      store.deleteSnapshot(id);
    }
  }
  var editTitle = (0, vue_1.computed)(function () {
    return editKind.value === 'liability' ? 'Editar pasivo' : 'Editar activo';
  });
  var editCategories = (0, vue_1.computed)(function () {
    return editKind.value === 'liability' ? liabilityCategories : assetCategories;
  });
  var editInitial = (0, vue_1.computed)(function () {
    var item = editItem.value;
    if (!item) return null;
    return buildEditInitialPayload(item);
  });
  function submitEdit(payload) {
    return __awaiter(this, void 0, void 0, function () {
      var id;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!editItem.value || !editKind.value) return [2 /*return*/];
            id = editItem.value.id;
            if (!(editKind.value === 'asset')) return [3 /*break*/, 2];
            delete payload.financed_asset_id;
            return [4 /*yield*/, store.updateAsset(id, payload)];
          case 1:
            _a.sent();
            return [3 /*break*/, 4];
          case 2:
            return [4 /*yield*/, store.updateLiability(id, payload)];
          case 3:
            _a.sent();
            _a.label = 4;
          case 4:
            closeEdit();
            return [2 /*return*/];
        }
      });
    });
  }
  var unitLabel = function () {
    var _a, _b;
    var c = (_a = store.baseCurrency) !== null && _a !== void 0 ? _a : '';
    if (valueMode.value !== 'real') return c;
    var base = (_b = store.summary) === null || _b === void 0 ? void 0 : _b.inflation_base_period;
    return base ? ''.concat(c, ' (').concat(base, ')') : ''.concat(c, ' (IPC)');
  };
  var modeLabel = function () {
    var _a;
    if (valueMode.value === 'nominal') return 'Nominal (euros de hoy)';
    var base = (_a = store.summary) === null || _a === void 0 ? void 0 : _a.inflation_base_period;
    return base ? 'IPC: euros de '.concat(base) : 'IPC: euros del mes base';
  };
  var realBaseLabel = (0, vue_1.computed)(function () {
    var _a;
    return ((_a = store.summary) === null || _a === void 0 ? void 0 : _a.inflation_base_period)
      ? 'Base: '.concat(store.summary.inflation_base_period)
      : '';
  });
  var summaryAssets = (0, vue_1.computed)(function () {
    var _a, _b;
    return valueMode.value === 'real'
      ? (_a = store.summary) === null || _a === void 0
        ? void 0
        : _a.total_assets_real
      : (_b = store.summary) === null || _b === void 0
        ? void 0
        : _b.total_assets;
  });
  var summaryLiabilities = (0, vue_1.computed)(function () {
    var _a, _b;
    return valueMode.value === 'real'
      ? (_a = store.summary) === null || _a === void 0
        ? void 0
        : _a.total_liabilities_real
      : (_b = store.summary) === null || _b === void 0
        ? void 0
        : _b.total_liabilities;
  });
  var summaryNetWorth = (0, vue_1.computed)(function () {
    var _a, _b;
    return valueMode.value === 'real'
      ? (_a = store.summary) === null || _a === void 0
        ? void 0
        : _a.net_worth_real
      : (_b = store.summary) === null || _b === void 0
        ? void 0
        : _b.net_worth;
  });
  var byCategoryChart = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d;
    return (0, charts_1.buildByCategoryChart)(
      valueMode.value === 'real'
        ? __assign(__assign({}, store.summary), {
            assets_by_category:
              (_b =
                (_a = store.summary) === null || _a === void 0
                  ? void 0
                  : _a.assets_by_category_real) !== null && _b !== void 0
                ? _b
                : {},
            liabilities_by_category:
              (_d =
                (_c = store.summary) === null || _c === void 0
                  ? void 0
                  : _c.liabilities_by_category_real) !== null && _d !== void 0
                ? _d
                : {},
          })
        : store.summary,
      store.baseCurrency,
    );
  });
  var categoryLabelMap = (0, vue_1.computed)(function () {
    var m = new Map();
    assetCategories.forEach(function (c) {
      return m.set(c.value, c.label);
    });
    liabilityCategories.forEach(function (c) {
      return m.set(c.value, c.label);
    });
    return m;
  });
  var byCategoryFiltered = (0, vue_1.computed)(function () {
    return filterByCategoryRows(byCategoryChart.value);
  });
  var byCategoryLabels = (0, vue_1.computed)(function () {
    return byCategoryFiltered.value.map(function (r) {
      var _a;
      return (_a = categoryLabelMap.value.get(r.key)) !== null && _a !== void 0 ? _a : r.key;
    });
  });
  var byCategoryKeys = (0, vue_1.computed)(function () {
    return byCategoryFiltered.value.map(function (r) {
      return r.key;
    });
  });
  var byCategoryAssets = (0, vue_1.computed)(function () {
    return byCategoryFiltered.value.map(function (r) {
      return r.a;
    });
  });
  var byCategoryLiabilities = (0, vue_1.computed)(function () {
    return byCategoryFiltered.value.map(function (r) {
      return r.l;
    });
  });
  var byCategoryUnit = (0, vue_1.computed)(function () {
    return byCategoryChart.value.unit;
  });
  var summaryExtended = (0, vue_1.computed)(function () {
    return store.summary;
  });
  var summaryAssetBackedLiabilities = (0, vue_1.computed)(function () {
    var _a, _b;
    return valueMode.value === 'real'
      ? (_a = summaryExtended.value) === null || _a === void 0
        ? void 0
        : _a.liabilities_asset_backed_real
      : (_b = summaryExtended.value) === null || _b === void 0
        ? void 0
        : _b.liabilities_asset_backed;
  });
  var summaryUnbackedLiabilities = (0, vue_1.computed)(function () {
    var _a, _b;
    return valueMode.value === 'real'
      ? (_a = summaryExtended.value) === null || _a === void 0
        ? void 0
        : _a.liabilities_unbacked_real
      : (_b = summaryExtended.value) === null || _b === void 0
        ? void 0
        : _b.liabilities_unbacked;
  });
  (0, vue_1.onMounted)(function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, store.fetchSettings()];
          case 1:
            _a.sent();
            return [4 /*yield*/, store.refreshAll()];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
  return {
    store: store,
    valueMode: valueMode,
    currencies: currencies,
    assetCategories: assetCategories,
    assetSubcategories: assetSubcategories,
    liabilityCategories: liabilityCategories,
    prettyError: prettyError,
    showAssetModal: showAssetModal,
    showLiabilityModal: showLiabilityModal,
    showBreakdown: showBreakdown,
    showEditModal: showEditModal,
    editItem: editItem,
    editKind: editKind,
    canShowReal: canShowReal,
    submitAsset: submitAsset,
    submitLiability: submitLiability,
    openEdit: openEdit,
    closeEdit: closeEdit,
    confirmDeleteSnapshot: confirmDeleteSnapshot,
    editTitle: editTitle,
    editCategories: editCategories,
    editInitial: editInitial,
    submitEdit: submitEdit,
    formatMoney: formatMoney,
    unitLabel: unitLabel,
    modeLabel: modeLabel,
    realBaseLabel: realBaseLabel,
    summaryAssets: summaryAssets,
    summaryLiabilities: summaryLiabilities,
    summaryNetWorth: summaryNetWorth,
    byCategoryKeys: byCategoryKeys,
    byCategoryLabels: byCategoryLabels,
    byCategoryAssets: byCategoryAssets,
    byCategoryLiabilities: byCategoryLiabilities,
    byCategoryUnit: byCategoryUnit,
    summaryAssetBackedLiabilities: summaryAssetBackedLiabilities,
    summaryUnbackedLiabilities: summaryUnbackedLiabilities,
  };
}
