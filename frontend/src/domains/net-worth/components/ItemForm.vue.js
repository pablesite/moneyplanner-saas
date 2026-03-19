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
var _a, _b;
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var props = defineProps();
function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
function parseIsoDate(raw) {
  var value = String(raw !== null && raw !== void 0 ? raw : '').trim();
  var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  var year = Number(match[1]);
  var month = Number(match[2]);
  var day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year: year, month: month, day: day };
}
function simpleDateToIso(value) {
  return ''
    .concat(value.year.toString().padStart(4, '0'), '-')
    .concat(value.month.toString().padStart(2, '0'), '-')
    .concat(value.day.toString().padStart(2, '0'));
}
function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
function addMonthsPreserveDayIso(startIso, months) {
  var start = parseIsoDate(startIso);
  if (!start || !Number.isInteger(months) || months < 0) return null;
  var totalMonth = start.month - 1 + months;
  var year = start.year + Math.floor(totalMonth / 12);
  var month = (totalMonth % 12) + 1;
  var day = Math.min(start.day, lastDayOfMonth(year, month));
  return simpleDateToIso({ year: year, month: month, day: day });
}
function monthsBetweenPreserveDayIso(startIso, endIso) {
  var start = parseIsoDate(startIso);
  var end = parseIsoDate(endIso);
  if (!start || !end) return null;
  var rawMonths = (end.year - start.year) * 12 + (end.month - start.month);
  if (rawMonths < 0) return null;
  var rebuilt = addMonthsPreserveDayIso(startIso, rawMonths);
  return rebuilt === endIso ? rawMonths : null;
}
var currencies = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
];
var ownershipLabel = function (o) {
  if (o.kind === 'individual') {
    return o.member ? 'Individual - '.concat(o.member.name) : 'Individual';
  }
  var parts = (o.splits || []).map(function (s) {
    return ''.concat(s.member.name, ' ').concat(s.percent, '%');
  });
  return 'Compartido - '.concat(parts.join(' - ') || 'sin splits');
};
var ownershipOptions = (0, vue_1.computed)(function () {
  return __spreadArray(
    [{ value: null, label: 'Selecciona titularidad' }],
    (props.ownerships || []).map(function (o) {
      return { value: o.id, label: ownershipLabel(o) };
    }),
    true,
  );
});
/** -------------------------
 * Amount handling
 * - Accept thousands separators (1.234,56 or 1,234.56)
 * - Normalize to dot decimal for API
 * - Limit decimals by currency
 * ------------------------- */
var decimalsByCurrency = {
  EUR: 2,
  USD: 2,
  BTC: 8,
  ETH: 8,
};
var ASSET_CASH_SUBCATEGORIES_REQUIRING_TAE = [
  'bank_account',
  'short_term_deposit',
  'crypto_spot_earn',
  'other',
];
var DEPOSIT_TERM_MONTH_OPTIONS = Array.from({ length: 12 }, function (_, index) {
  return index + 1;
});
var LIABILITY_PAYMENT_FREQUENCIES = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
];
var LIABILITY_EXPENSE_SUBCATEGORY_OPTIONS = [
  { value: 'housing_home', label: 'Vivienda y hogar' },
  { value: 'living_expenses', label: 'Alimentacion' },
  { value: 'family_childcare', label: 'Familia y bebe' },
  { value: 'transport_mobility', label: 'Transporte y movilidad' },
  { value: 'health_wellbeing', label: 'Salud y bienestar' },
  { value: 'education_growth', label: 'Formacion y desarrollo' },
  { value: 'leisure_lifestyle', label: 'Ocio y estilo de vida' },
  { value: 'gifts_donations', label: 'Regalos y donaciones' },
  { value: 'financial_commitments', label: 'Compromisos financieros' },
  { value: 'other_consumption_expenses', label: 'Otros gastos de consumo' },
];
var INVESTMENT_CONTRIBUTION_MODE_OPTIONS = [
  { value: 'one_time', label: 'Aportacion unica' },
  { value: 'periodic_contribution', label: 'Aportacion periodica' },
];
var INVESTMENT_CONTRIBUTION_FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'weekly', label: 'Semanal' },
];
var TRACKING_MODE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'accounting', label: 'Contable (ledger)' },
];
var LIABILITY_CATEGORY_DEFAULTS = {
  mortgage: { paymentFrequency: 'monthly', preferredAssetCategories: ['real_estate'] },
  personal_loan: {
    paymentFrequency: 'monthly',
    preferredAssetCategories: ['furnishings', 'other'],
  },
  credit_card: { paymentFrequency: 'monthly', preferredAssetCategories: [] },
  other: { paymentFrequency: 'monthly', preferredAssetCategories: ['furnishings', 'other'] },
};
var ASSET_AMORTIZATION_METHODS = [
  { value: 'none', label: 'Sin amortizacion' },
  { value: 'straight_line', label: 'Lineal' },
];
var REAL_ESTATE_USAGE_OPTIONS = [
  { value: 'self_use', label: 'Propio' },
  { value: 'rental', label: 'Alquiler' },
];
var PRIMARY_HOME_VALUATION_MODE_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'real_estate_auto', label: 'Automatica (suelo + construccion)' },
];
var PRIMARY_HOME_VALUATION_PROFILES = [
  {
    value: 'conservative',
    label: 'Conservador',
    landAnnualAppreciationPercent: '5.5',
    buildingAnnualDepreciationPercent: '0.4',
  },
  {
    value: 'balanced',
    label: 'Equilibrado',
    landAnnualAppreciationPercent: '6.8',
    buildingAnnualDepreciationPercent: '0.3',
  },
  {
    value: 'dynamic',
    label: 'Dinamico',
    landAnnualAppreciationPercent: '8',
    buildingAnnualDepreciationPercent: '0.2',
  },
];
var PRIMARY_HOME_CUSTOM_PROFILE_VALUE = 'custom';
var PRIMARY_HOME_DEFAULT_PROFILE_VALUE = 'dynamic';
var PRIMARY_HOME_IMPROVEMENT_AMORTIZATION_OPTIONS = [
  { value: 'none', label: 'Sin amortizacion' },
  { value: 'straight_line', label: 'Lineal' },
  { value: 'manual', label: 'Manual' },
];
function buildEmptyPrimaryHomeImprovement() {
  return {
    name: '',
    reform_date: todayIsoDate(),
    amount: '',
    amortization_method: 'none',
    amortization_term_years: '10',
    annual_interest_tae: '',
    capitalize_interest: false,
    manual_current_value: '',
    notes: '',
  };
}
var form = (0, vue_1.reactive)({
  name: '',
  category: '',
  subcategory: '',
  amount: '',
  annual_interest_tae: props.showFinancedAsset ? '0' : '',
  estimated_average_balance_for_interest: '',
  deposit_term_months: '',
  monthly_payment_amount: '',
  start_date: todayIsoDate(),
  expected_end_date: '',
  investment_contribution_mode: 'one_time',
  investment_contribution_frequency: 'monthly',
  investment_contribution_currency: '',
  monthly_contribution_amount: '',
  market_value_override: '',
  market_value_override_date: '',
  term_months: '',
  rate_type: 'fixed',
  payment_frequency: 'monthly',
  amortization_system: 'french',
  opening_fees_amount: '',
  early_repayment_fee_percent: '',
  novation_subrogation_fee_amount: '',
  linked_products_monthly_cost: '',
  cancellation_forecast_enabled: false,
  cancellation_date: '',
  cancellation_fee_amount: '',
  expense_subcategory_override: '',
  amortization_method: 'none',
  amortization_term_years: '',
  valuation_model: 'manual',
  land_value_share_percent: '30',
  land_annual_appreciation_percent: '3',
  building_annual_depreciation_percent: '1',
  notes: '',
  currency: '',
  tracking_mode: 'manual',
  is_active: true,
  ownership_id: null,
  financed_asset_id: null,
});
var isEdit = (0, vue_1.computed)(function () {
  return props.mode === 'edit';
});
var financedAssetOptions = (0, vue_1.computed)(function () {
  var list = Array.isArray(props.assets) ? props.assets : [];
  return __spreadArray(
    [{ value: null, label: 'No financia ningún activo' }],
    list
      .slice()
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(function (a) {
        return { value: a.id, label: a.name };
      }),
    true,
  );
});
var showFinancedAsset = (0, vue_1.computed)(function () {
  return !!props.showFinancedAsset;
});
var isLiabilityForm = (0, vue_1.computed)(function () {
  return showFinancedAsset.value;
});
var isAssetForm = (0, vue_1.computed)(function () {
  return !showFinancedAsset.value;
});
var requiresAssetTae = (0, vue_1.computed)(function () {
  return (
    !!props.subcategories &&
    form.category === 'cash' &&
    ASSET_CASH_SUBCATEGORIES_REQUIRING_TAE.includes(form.subcategory)
  );
});
var showAnnualInterestInput = (0, vue_1.computed)(function () {
  return isLiabilityForm.value || requiresAssetTae.value;
});
var showAssetAnnualInterestInput = (0, vue_1.computed)(function () {
  return isAssetForm.value && showAnnualInterestInput.value;
});
var isShortTermDepositAsset = (0, vue_1.computed)(function () {
  return isAssetForm.value && form.category === 'cash' && form.subcategory === 'short_term_deposit';
});
var showEstimatedAverageBalanceForInterestInput = (0, vue_1.computed)(function () {
  var _a;
  if (!showAssetAnnualInterestInput.value) return false;
  if (isShortTermDepositAsset.value) return false;
  var taeRaw = String((_a = form.annual_interest_tae) !== null && _a !== void 0 ? _a : '')
    .trim()
    .replace(',', '.');
  var taeValue = Number(taeRaw);
  return Number.isFinite(taeValue) && taeValue > 0;
});
var showInvestmentContributionModeField = (0, vue_1.computed)(function () {
  var _a;
  return (
    isAssetForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'investments'
  );
});
var showInvestmentMarketValueFields = (0, vue_1.computed)(function () {
  var _a;
  return (
    isAssetForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'investments'
  );
});
var showInvestmentPeriodicFields = (0, vue_1.computed)(function () {
  var _a;
  return (
    showInvestmentContributionModeField.value &&
    String((_a = form.investment_contribution_mode) !== null && _a !== void 0 ? _a : '').trim() ===
      'periodic_contribution'
  );
});
var isInvestmentPeriodicIndefinite = (0, vue_1.computed)(function () {
  var _a;
  return (
    showInvestmentPeriodicFields.value &&
    !String((_a = form.expected_end_date) !== null && _a !== void 0 ? _a : '').trim()
  );
});
var showDepositTermMonthsInput = (0, vue_1.computed)(function () {
  return isShortTermDepositAsset.value;
});
var showMonthlyPaymentInput = (0, vue_1.computed)(function () {
  return false;
});
var isCreditCardLiability = (0, vue_1.computed)(function () {
  var _a;
  return (
    isLiabilityForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'credit_card'
  );
});
var showLiabilityAdvancedFields = (0, vue_1.computed)(function () {
  return isLiabilityForm.value && !isCreditCardLiability.value;
});
var showLiabilityExpenseSubcategoryField = (0, vue_1.computed)(function () {
  return isLiabilityForm.value && form.category !== 'mortgage' && form.financed_asset_id == null;
});
var showLiabilityTaeOnlyField = (0, vue_1.computed)(function () {
  return isLiabilityForm.value && !showLiabilityAdvancedFields.value;
});
var showMortgageFeeFields = (0, vue_1.computed)(function () {
  return isLiabilityForm.value && form.category === 'mortgage';
});
var showMortgageCancellationForecastFields = (0, vue_1.computed)(function () {
  return isLiabilityForm.value && form.category === 'mortgage';
});
var showAssetAmortizationFields = (0, vue_1.computed)(function () {
  var _a;
  return (
    isAssetForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'furnishings'
  );
});
var isJewelryFurnishings = (0, vue_1.computed)(function () {
  var _a;
  return (
    showAssetAmortizationFields.value &&
    String((_a = form.subcategory) !== null && _a !== void 0 ? _a : '').trim() === 'jewelry'
  );
});
var showPrimaryHomeValuationFields = (0, vue_1.computed)(function () {
  var _a, _b;
  return (
    isAssetForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'real_estate' &&
    ['primary_home', 'second_home', 'rental'].includes(
      String((_b = form.subcategory) !== null && _b !== void 0 ? _b : '').trim(),
    )
  );
});
var showPrimaryHomeAutoValuationFields = (0, vue_1.computed)(function () {
  return showPrimaryHomeValuationFields.value && form.valuation_model === 'real_estate_auto';
});
var requiresAssetAmortizationInputs = (0, vue_1.computed)(function () {
  var _a;
  return (
    showAssetAmortizationFields.value &&
    String((_a = form.amortization_method) !== null && _a !== void 0 ? _a : '').trim() ===
      'straight_line'
  );
});
var useDegressiveResidualProfileForFurnishings = (0, vue_1.computed)(function () {
  var _a;
  if (!showAssetAmortizationFields.value) return false;
  var subcategory = String((_a = form.subcategory) !== null && _a !== void 0 ? _a : '').trim();
  return subcategory === 'vehicles' || subcategory === 'sports_equipment';
});
var assetAmortizationMethodOptions = (0, vue_1.computed)(function () {
  if (isJewelryFurnishings.value) {
    return [{ value: 'none', label: 'Sin amortizacion (joyeria)' }];
  }
  if (!useDegressiveResidualProfileForFurnishings.value) return ASSET_AMORTIZATION_METHODS;
  return ASSET_AMORTIZATION_METHODS.map(function (option) {
    return option.value === 'straight_line'
      ? __assign(__assign({}, option), {
          label: 'Lineal (decreciente + residual por subcategoria)',
        })
      : option;
  });
});
var assetAmortizationModelHint = (0, vue_1.computed)(function () {
  var _a;
  if (isJewelryFurnishings.value) {
    return "En 'Joyeria' no se aplica amortizacion automatica.";
  }
  if (!useDegressiveResidualProfileForFurnishings.value) return '';
  var subcategory = String((_a = form.subcategory) !== null && _a !== void 0 ? _a : '').trim();
  if (subcategory === 'vehicles') {
    return "En 'Vehiculos', este metodo aplica curva decreciente con suelo residual del 15%.";
  }
  if (subcategory === 'sports_equipment') {
    return "En 'Equipamiento deportivo', este metodo aplica curva decreciente con suelo residual del 20%.";
  }
  return '';
});
var defaultDegressiveTermYearsForFurnishings = (0, vue_1.computed)(function () {
  var _a;
  if (!useDegressiveResidualProfileForFurnishings.value) return null;
  var subcategory = String((_a = form.subcategory) !== null && _a !== void 0 ? _a : '').trim();
  if (subcategory === 'vehicles') return 20;
  if (subcategory === 'sports_equipment') return 15;
  return null;
});
var requiresAssetAmortizationTermInput = (0, vue_1.computed)(function () {
  return requiresAssetAmortizationInputs.value && !useDegressiveResidualProfileForFurnishings.value;
});
var financedAssetSuggestion = (0, vue_1.computed)(function () {
  var _a, _b, _c, _d;
  if (!showFinancedAsset.value) return null;
  var assets = Array.isArray(props.assets) ? props.assets : [];
  if (!assets.length) return null;
  var defaults =
    (_b =
      LIABILITY_CATEGORY_DEFAULTS[
        String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim()
      ]) !== null && _b !== void 0
      ? _b
      : {};
  var preferredCategories = new Set(
    (_c = defaults.preferredAssetCategories) !== null && _c !== void 0 ? _c : [],
  );
  var hasPreferredFilter = preferredCategories.size > 0;
  var candidates = assets
    .map(function (asset) {
      var score = scoreAssetNameMatch(form.name, asset.name);
      if (hasPreferredFilter && preferredCategories.has(asset.category)) score += 15;
      return { asset: asset, score: score };
    })
    .sort(function (a, b) {
      return b.score - a.score || a.asset.name.localeCompare(b.asset.name);
    });
  if (!candidates.length) return null;
  var best = candidates[0];
  var second = candidates[1];
  if (!best) return null;
  if (best.score >= 70) return best.asset;
  if (best.score >= 20 && (!second || best.score - second.score >= 15)) return best.asset;
  if (!String((_d = form.name) !== null && _d !== void 0 ? _d : '').trim() && hasPreferredFilter) {
    var preferredOnly = assets.filter(function (asset) {
      return preferredCategories.has(asset.category);
    });
    if (preferredOnly.length === 1) return preferredOnly[0];
  }
  return null;
});
var financedAssetSuggestionHelp = (0, vue_1.computed)(function () {
  if (!showFinancedAsset.value || !financedAssetAutoMatched.value) return null;
  var suggestion = financedAssetSuggestion.value;
  if (!suggestion || form.financed_asset_id !== suggestion.id) return null;
  return 'Activo financiado sugerido automáticamente (editable).';
});
var subcategoriesForCategory = (0, vue_1.computed)(function () {
  if (!props.subcategories || !form.category) return [];
  var options = props.subcategories.filter(function (s) {
    return s.category === form.category;
  });
  if (form.category !== 'real_estate') return options;
  return options.filter(function (option) {
    return option.value !== 'rental';
  });
});
var showRealEstateUsageField = (0, vue_1.computed)(function () {
  var _a, _b;
  return (
    isAssetForm.value &&
    String((_a = form.category) !== null && _a !== void 0 ? _a : '').trim() === 'real_estate' &&
    String((_b = form.subcategory) !== null && _b !== void 0 ? _b : '').trim() === 'second_home'
  );
});
var maxDecimals = (0, vue_1.computed)(function () {
  var _a;
  return (_a = decimalsByCurrency[form.currency]) !== null && _a !== void 0 ? _a : 2;
});
var estimatedAverageBalanceCurrencyLabel = (0, vue_1.computed)(function () {
  var _a;
  var currency = String((_a = form.currency) !== null && _a !== void 0 ? _a : '').trim();
  return currency || 'EUR';
});
var normalizedDefaultCurrency = (0, vue_1.computed)(function () {
  var _a;
  return String((_a = props.defaultCurrency) !== null && _a !== void 0 ? _a : '')
    .trim()
    .toUpperCase();
});
var activeLiabilityFieldGroup = (0, vue_1.ref)(null);
var financedAssetManuallySelected = (0, vue_1.ref)(false);
var financedAssetAutoMatched = (0, vue_1.ref)(false);
var primaryHomeValuationProfile = (0, vue_1.ref)(PRIMARY_HOME_DEFAULT_PROFILE_VALUE);
var realEstateUsage = (0, vue_1.ref)('self_use');
var primaryHomeImprovements = (0, vue_1.ref)([]);
var expandedPrimaryHomeImprovementIndex = (0, vue_1.ref)(null);
var syncingScheduleFields = false;
var syncingPrimaryHomeProfile = false;
(0, vue_1.watch)(
  function () {
    return form.category;
  },
  function () {
    if (!props.subcategories) return;
    var valid = subcategoriesForCategory.value.some(function (s) {
      return s.value === form.subcategory;
    });
    if (!valid) form.subcategory = '';
  },
);
(0, vue_1.watch)(
  function () {
    return form.subcategory;
  },
  function () {
    var _a;
    if (!showRealEstateUsageField.value) {
      realEstateUsage.value = 'self_use';
    }
    if (showAssetAmortizationFields.value) {
      var valid = new Set(
        assetAmortizationMethodOptions.value.map(function (opt) {
          return opt.value;
        }),
      );
      if (
        !valid.has(
          String((_a = form.amortization_method) !== null && _a !== void 0 ? _a : '').trim(),
        )
      ) {
        form.amortization_method = 'none';
      }
    }
    if (!isJewelryFurnishings.value) return;
    form.amortization_method = 'none';
    form.amortization_term_years = '';
  },
);
function normalizeMatchText(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function scoreAssetNameMatch(liabilityName, assetName) {
  var left = normalizeMatchText(liabilityName);
  var right = normalizeMatchText(assetName);
  if (!left || !right) return 0;
  if (left === right) return 100;
  if (left.includes(right) || right.includes(left)) return 70;
  var leftTokens = new Set(left.split(' ').filter(Boolean));
  var rightTokens = new Set(right.split(' ').filter(Boolean));
  if (!leftTokens.size || !rightTokens.size) return 0;
  var overlap = 0;
  leftTokens.forEach(function (token) {
    if (rightTokens.has(token)) overlap += 1;
  });
  if (!overlap) return 0;
  return Math.round((overlap / Math.max(leftTokens.size, rightTokens.size)) * 50);
}
function normalizeLooseNumber(raw) {
  // Allow only digits and separators, remove spaces (including NBSP)
  var s = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '');
  if (props.allowNegative && s.startsWith('-')) {
    s = '-'.concat(s.slice(1).replace(/[^\d.,]/g, ''));
  } else {
    s = s.replace(/[^\d.,]/g, '');
  }
  return s;
}
function sanitizeAmount(raw, decimals) {
  var s = normalizeLooseNumber(raw);
  if (!s) return { value: '', error: '' };
  var isNegative = props.allowNegative && s.startsWith('-');
  if (isNegative) s = s.slice(1);
  // If contains both ',' and '.', assume last separator is decimal and the other is thousands
  var lastComma = s.lastIndexOf(',');
  var lastDot = s.lastIndexOf('.');
  if (lastComma !== -1 && lastDot !== -1) {
    var decimalSep = lastComma > lastDot ? ',' : '.';
    var thousandSep = decimalSep === ',' ? '.' : ',';
    s = s.split(thousandSep).join(''); // remove thousand separators
    s = s.replace(decimalSep, '.'); // normalize decimal to dot
  } else {
    // Only comma -> decimal comma
    s = s.replace(/,/g, '.');
  }
  // More than one dot => invalid
  if ((s.match(/\./g) || []).length > 1) return { value: '', error: 'Importe inválido' };
  // Limit decimals
  var _a = s.split('.'),
    intPart = _a[0],
    _b = _a[1],
    decPart = _b === void 0 ? '' : _b;
  var limitedDec = decPart.slice(0, decimals);
  var normalized = decPart.length ? ''.concat(intPart, '.').concat(limitedDec) : intPart;
  // Avoid weird states
  if (!normalized || normalized === '.') return { value: '', error: '' };
  // If starts with dot, prefix 0
  var finalValue = normalized.startsWith('.') ? '0'.concat(normalized) : normalized;
  var signedValue = isNegative ? '-'.concat(finalValue) : finalValue;
  // Validate numeric
  if (Number.isNaN(Number(signedValue))) return { value: '', error: 'Importe inválido' };
  // Block negatives (we removed '-' already, but keep for safety)
  if (!props.allowNegative && finalValue.includes('-')) {
    return { value: '', error: 'No se permiten importes negativos' };
  }
  return { value: signedValue, error: '' };
}
function formatAmountForEdit(raw, currency) {
  var _a;
  var max = (_a = decimalsByCurrency[currency]) !== null && _a !== void 0 ? _a : 2;
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var n = Number(normalized);
  if (!Number.isFinite(n)) return '';
  return n.toFixed(max).replace(/\.?0+$/, '');
}
function formatAmountFixedForEdit(raw, decimals) {
  if (decimals === void 0) {
    decimals = 2;
  }
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var n = Number(normalized);
  if (!Number.isFinite(n)) return '';
  return n.toFixed(decimals);
}
function formatMonthlyContributionField() {
  var sanitized = sanitizeAmount(form.monthly_contribution_amount, maxDecimals.value);
  if (sanitized.error || !sanitized.value) return;
  var n = Number(sanitized.value);
  if (!Number.isFinite(n)) return;
  form.monthly_contribution_amount = n.toFixed(2);
}
function sanitizePercent(raw) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(',', '.');
  if (!normalized) return { value: '', error: '' };
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return { value: '', error: 'Porcentaje invalido' };
  var n = Number(normalized);
  if (!Number.isFinite(n)) return { value: '', error: 'Porcentaje invalido' };
  return { value: normalized, error: '' };
}
function normalizePercentWithMaxDecimals(
  raw,
  maxDecimals,
  preserveTrailingSeparator,
  outputSeparator,
) {
  if (preserveTrailingSeparator === void 0) {
    preserveTrailingSeparator = false;
  }
  if (outputSeparator === void 0) {
    outputSeparator = 'dot';
  }
  var rawString = String(raw !== null && raw !== void 0 ? raw : '').trim();
  var normalized = rawString.replace(',', '.').replace(/[^\d.-]/g, '');
  if (!normalized) return '';
  var dots = normalized.match(/\./g) || [];
  if (dots.length > 1) return normalized;
  if (preserveTrailingSeparator && /[.,]$/.test(rawString) && dots.length === 1) {
    var _a = normalized.split('.')[0],
      intPart_1 = _a === void 0 ? '' : _a;
    return outputSeparator === 'comma' ? ''.concat(intPart_1, ',') : ''.concat(intPart_1, '.');
  }
  var _b = normalized.split('.'),
    _c = _b[0],
    intPart = _c === void 0 ? '' : _c,
    _d = _b[1],
    decPart = _d === void 0 ? '' : _d;
  var limitedDec = decPart.slice(0, Math.max(0, maxDecimals));
  var out = limitedDec ? ''.concat(intPart, '.').concat(limitedDec) : intPart;
  return outputSeparator === 'comma' ? out.replace('.', ',') : out;
}
function applyPrimaryHomeValuationProfile(profileValue) {
  var profile = PRIMARY_HOME_VALUATION_PROFILES.find(function (p) {
    return p.value === profileValue;
  });
  if (!profile) return;
  syncingPrimaryHomeProfile = true;
  form.land_annual_appreciation_percent = profile.landAnnualAppreciationPercent;
  form.building_annual_depreciation_percent = profile.buildingAnnualDepreciationPercent;
  syncingPrimaryHomeProfile = false;
}
function detectPrimaryHomeValuationProfile() {
  var _a;
  var toComparableNumber = function (raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
      .trim()
      .replace(',', '.');
    if (!normalized) return null;
    var parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  };
  var landGrowth = toComparableNumber(form.land_annual_appreciation_percent);
  var buildingDep = toComparableNumber(form.building_annual_depreciation_percent);
  if (landGrowth == null || buildingDep == null) return PRIMARY_HOME_CUSTOM_PROFILE_VALUE;
  var profile = PRIMARY_HOME_VALUATION_PROFILES.find(function (p) {
    return (
      Number(p.landAnnualAppreciationPercent) === landGrowth &&
      Number(p.buildingAnnualDepreciationPercent) === buildingDep
    );
  });
  return (_a = profile === null || profile === void 0 ? void 0 : profile.value) !== null &&
    _a !== void 0
    ? _a
    : PRIMARY_HOME_CUSTOM_PROFILE_VALUE;
}
function addPrimaryHomeImprovement() {
  primaryHomeImprovements.value.push(buildEmptyPrimaryHomeImprovement());
  expandedPrimaryHomeImprovementIndex.value = primaryHomeImprovements.value.length - 1;
}
function removePrimaryHomeImprovement(index) {
  if (index < 0 || index >= primaryHomeImprovements.value.length) return;
  primaryHomeImprovements.value.splice(index, 1);
  if (!primaryHomeImprovements.value.length) {
    expandedPrimaryHomeImprovementIndex.value = null;
    return;
  }
  if (expandedPrimaryHomeImprovementIndex.value == null) return;
  if (expandedPrimaryHomeImprovementIndex.value > index) {
    expandedPrimaryHomeImprovementIndex.value -= 1;
    return;
  }
  if (expandedPrimaryHomeImprovementIndex.value === index) {
    expandedPrimaryHomeImprovementIndex.value = Math.min(
      index,
      primaryHomeImprovements.value.length - 1,
    );
  }
}
function canCapitalizeImprovementInterest(improvement) {
  var _a;
  var interestRaw = String(
    (_a = improvement.annual_interest_tae) !== null && _a !== void 0 ? _a : '',
  )
    .trim()
    .replace(',', '.');
  if (!interestRaw) return false;
  var interest = Number(interestRaw);
  return Number.isFinite(interest) && interest > 0;
}
function improvementRemoveLabel(improvement) {
  return improvement.id ? 'Eliminar reforma' : 'Descartar reforma';
}
function formatImprovementSummaryDate(raw) {
  var value = String(raw !== null && raw !== void 0 ? raw : '').trim();
  if (!value) return 'Sin fecha';
  var parsed = parseIsoDate(value);
  if (!parsed) return value;
  return ''
    .concat(String(parsed.day).padStart(2, '0'), '/')
    .concat(String(parsed.month).padStart(2, '0'), '/')
    .concat(parsed.year);
}
function currencySymbol(currency) {
  var code = String(currency !== null && currency !== void 0 ? currency : '')
    .trim()
    .toUpperCase();
  if (code === 'EUR') return '€';
  if (code === 'USD') return '$';
  if (code === 'GBP') return '£';
  if (code === 'JPY') return '¥';
  return code || '';
}
function formatImprovementSummaryAmount(raw, currency) {
  var normalized = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var parsed = Number(normalized);
  var amountText = Number.isFinite(parsed)
    ? new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(parsed)
    : raw || '0';
  var symbol = currencySymbol(currency);
  return symbol ? ''.concat(amountText, ' ').concat(symbol) : amountText;
}
function isImprovementExpanded(index) {
  return expandedPrimaryHomeImprovementIndex.value === index;
}
function toggleImprovementExpanded(index) {
  if (expandedPrimaryHomeImprovementIndex.value === index) {
    expandedPrimaryHomeImprovementIndex.value = null;
    return;
  }
  expandedPrimaryHomeImprovementIndex.value = index;
}
function validatePrimaryHomeImprovement(item, index) {
  var _a, _b, _c, _d;
  var label = 'Reforma '.concat(index + 1);
  if (!String((_a = item.name) !== null && _a !== void 0 ? _a : '').trim())
    return ''.concat(label, ': el nombre es obligatorio');
  if (!String((_b = item.reform_date) !== null && _b !== void 0 ? _b : '').trim())
    return ''.concat(label, ': la fecha es obligatoria');
  var amountSanitized = sanitizeAmount(item.amount, maxDecimals.value);
  if (!amountSanitized.value || amountSanitized.error)
    return ''.concat(label, ': importe invalido');
  if (item.amortization_method === 'straight_line') {
    var years = Number(
      String((_c = item.amortization_term_years) !== null && _c !== void 0 ? _c : '').trim(),
    );
    if (!Number.isInteger(years) || years <= 0)
      return ''.concat(label, ': plazo de amortizacion invalido');
  }
  if (item.amortization_method === 'manual') {
    var manualSanitized = sanitizeAmount(item.manual_current_value, maxDecimals.value);
    if (!manualSanitized.value || manualSanitized.error) {
      return ''.concat(label, ': valor actual manual invalido');
    }
  }
  if (!item.capitalize_interest) return '';
  var interestRaw = String((_d = item.annual_interest_tae) !== null && _d !== void 0 ? _d : '')
    .trim()
    .replace(',', '.');
  var interest = Number(interestRaw);
  if (!interestRaw || !Number.isFinite(interest) || interest < 0) {
    return ''.concat(label, ': TAE invalida');
  }
  return '';
}
function buildImprovementPayload(item) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: item.id,
    name: String((_a = item.name) !== null && _a !== void 0 ? _a : '').trim(),
    reform_date: String((_b = item.reform_date) !== null && _b !== void 0 ? _b : '').trim(),
    amount: sanitizeAmount(item.amount, maxDecimals.value).value,
    amortization_method: item.amortization_method,
    amortization_term_years:
      item.amortization_method === 'straight_line' &&
      String((_c = item.amortization_term_years) !== null && _c !== void 0 ? _c : '').trim()
        ? Number(String(item.amortization_term_years).trim())
        : null,
    annual_interest_tae: String(
      (_d = item.annual_interest_tae) !== null && _d !== void 0 ? _d : '',
    ).trim()
      ? String(item.annual_interest_tae).trim().replace(',', '.')
      : null,
    capitalize_interest: !!item.capitalize_interest,
    manual_current_value:
      item.amortization_method === 'manual' &&
      String((_e = item.manual_current_value) !== null && _e !== void 0 ? _e : '').trim()
        ? sanitizeAmount(item.manual_current_value, maxDecimals.value).value
        : null,
    notes: String((_f = item.notes) !== null && _f !== void 0 ? _f : '').trim(),
  };
}
function validatePrimaryHomeValuationFields() {
  var purchase = sanitizeAmount(form.amount, maxDecimals.value);
  if (!purchase.value || purchase.error) return 'Valor de compra invalido';
  var landShare = sanitizePercent(form.land_value_share_percent);
  var landGrowth = sanitizePercent(form.land_annual_appreciation_percent);
  var buildingDep = sanitizePercent(form.building_annual_depreciation_percent);
  if (landShare.error || landGrowth.error || buildingDep.error)
    return 'Parametros de vivienda invalidos';
  var landShareN = Number(landShare.value);
  var landGrowthN = Number(landGrowth.value);
  var buildingDepN = Number(buildingDep.value);
  if (landShare.value === '' || landShareN < 0 || landShareN > 100) {
    return 'El porcentaje de suelo debe estar entre 0 y 100';
  }
  if (landGrowth.value === '' || landGrowthN < -100 || landGrowthN > 200) {
    return 'La revalorizacion del suelo debe estar entre -100 y 200';
  }
  if (buildingDep.value === '' || buildingDepN < 0 || buildingDepN > 100) {
    return 'La depreciacion de construccion debe estar entre 0 y 100';
  }
  return '';
}
function validateLiabilityScheduleFields() {
  var _a, _b, _c;
  var hasTerm =
    String((_a = form.term_months) !== null && _a !== void 0 ? _a : '').trim().length > 0;
  var hasEndDate =
    String((_b = form.expected_end_date) !== null && _b !== void 0 ? _b : '').trim().length > 0;
  var paymentFrequency = String(
    (_c = form.payment_frequency) !== null && _c !== void 0 ? _c : '',
  ).trim();
  if (!hasTerm && !hasEndDate) return 'Indica cuotas o fecha fin (uno de los dos es obligatorio)';
  if (hasTerm) {
    var term = Number(String(form.term_months).trim());
    if (!Number.isInteger(term) || term <= 0) return 'Cuotas/plazo debe ser un entero > 0';
    if (paymentFrequency === 'quarterly' && term % 3 !== 0) {
      return 'En frecuencia trimestral, el plazo se indica en meses y debe ser multiplo de 3 (ej: 12, 24).';
    }
  }
  if (hasEndDate && form.start_date) {
    var inferredMonths = monthsBetweenPreserveDayIso(
      String(form.start_date),
      String(form.expected_end_date),
    );
    if (inferredMonths == null && !liabilityDatesError.value) {
      return 'La fecha fin no encaja con la fecha inicio y una cuota mensual exacta';
    }
  }
  if (hasTerm && hasEndDate && form.start_date) {
    var expectedFromTerm = addMonthsPreserveDayIso(
      String(form.start_date),
      Number(String(form.term_months).trim()),
    );
    if (expectedFromTerm && expectedFromTerm !== String(form.expected_end_date)) {
      return 'Cuotas y fecha fin no coinciden';
    }
  }
  return '';
}
// eslint-disable-next-line complexity
function estimateLiabilityPayment() {
  var _a, _b, _c, _d, _e, _f;
  var paymentFrequency = String(
    (_a = form.payment_frequency) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (paymentFrequency !== 'monthly' && paymentFrequency !== 'quarterly') return null;
  if (String((_b = form.rate_type) !== null && _b !== void 0 ? _b : '') !== 'fixed') return null;
  var amortSystem = String(
    (_c = form.amortization_system) !== null && _c !== void 0 ? _c : '',
  ).trim();
  if (amortSystem && amortSystem !== 'french' && amortSystem !== 'manual') return null;
  var periodMonths = paymentFrequency === 'quarterly' ? 3 : 1;
  var periodsPerYear = paymentFrequency === 'quarterly' ? 4 : 12;
  var amountSanitized = sanitizeAmount(form.amount, maxDecimals.value);
  var principal = Number(
    String((_d = amountSanitized.value) !== null && _d !== void 0 ? _d : '').replace(',', '.'),
  );
  var term = Number(String((_e = form.term_months) !== null && _e !== void 0 ? _e : '').trim());
  var tae = Number(
    String((_f = form.annual_interest_tae) !== null && _f !== void 0 ? _f : '')
      .trim()
      .replace(',', '.'),
  );
  var hasInvalidPrincipal =
    !amountSanitized.value ||
    amountSanitized.error ||
    !Number.isFinite(principal) ||
    principal <= 0;
  var hasInvalidTerm =
    !Number.isFinite(term) || term <= 0 || !Number.isInteger(term) || term % periodMonths !== 0;
  var hasInvalidTae = !Number.isFinite(tae) || tae < 0;
  if (hasInvalidPrincipal || hasInvalidTerm || hasInvalidTae) return null;
  var installments = term / periodMonths;
  if (tae === 0) return principal / installments;
  var periodicRate = tae / 100 / periodsPerYear;
  var denominator = 1 - Math.pow(1 + periodicRate, -installments);
  if (!Number.isFinite(denominator) || denominator === 0) return null;
  var payment = (principal * periodicRate) / denominator;
  return Number.isFinite(payment) ? payment : null;
}
function getFirstSubmitBlockingError() {
  var _a;
  var validations = [
    requiredFieldsError.value,
    annualInterestError.value,
    estimatedAverageBalanceForInterestError.value,
    depositTermMonthsError.value,
    monthlyPaymentError.value,
    assetAmortizationError.value,
    investmentContributionError.value,
    primaryHomeValuationError.value,
    primaryHomeImprovementsError.value,
    liabilityDatesError.value,
    liabilityScheduleError.value,
    cancellationForecastError.value,
  ];
  return (_a = validations.find(function (message) {
    return !!message;
  })) !== null && _a !== void 0
    ? _a
    : '';
}
function buildBaseItemPayload(normalizedAmount) {
  return {
    name: form.name,
    category: form.category,
    subcategory:
      form.subcategory === 'second_home' && realEstateUsage.value === 'rental'
        ? 'rental'
        : form.subcategory || undefined,
    amount: normalizedAmount,
    start_date: form.start_date,
    notes: form.notes,
    currency: form.currency,
    tracking_mode: form.tracking_mode,
    is_active: form.is_active,
    ownership_id: form.ownership_id,
  };
}
function buildInterestPayload() {
  var _a, _b, _c;
  return {
    annual_interest_tae: showAnnualInterestInput.value
      ? String(form.annual_interest_tae).trim().replace(',', '.')
      : undefined,
    estimated_average_balance_for_interest:
      showEstimatedAverageBalanceForInterestInput.value &&
      String(
        (_a = form.estimated_average_balance_for_interest) !== null && _a !== void 0 ? _a : '',
      ).trim()
        ? sanitizeAmount(form.estimated_average_balance_for_interest, 0).value
        : undefined,
    deposit_term_months:
      showDepositTermMonthsInput.value &&
      String((_b = form.deposit_term_months) !== null && _b !== void 0 ? _b : '').trim()
        ? Number(String(form.deposit_term_months).trim())
        : undefined,
    monthly_payment_amount:
      showMonthlyPaymentInput.value &&
      String((_c = form.monthly_payment_amount) !== null && _c !== void 0 ? _c : '').trim()
        ? sanitizeAmount(form.monthly_payment_amount, maxDecimals.value).value
        : undefined,
  };
}
// eslint-disable-next-line complexity
function buildInvestmentPayload(normalizedAmount) {
  var _a, _b, _c, _d, _e, _f, _g;
  var hasMarketValueOverride = !!String(
    (_a = form.market_value_override) !== null && _a !== void 0 ? _a : '',
  ).trim();
  var effectiveMarketValueOverrideDate = hasMarketValueOverride
    ? String((_b = form.market_value_override_date) !== null && _b !== void 0 ? _b : '').trim() ||
      todayIsoDate()
    : null;
  return {
    expected_end_date:
      (showLiabilityAdvancedFields.value || showInvestmentPeriodicFields.value) &&
      String((_c = form.expected_end_date) !== null && _c !== void 0 ? _c : '').trim()
        ? String(form.expected_end_date).trim()
        : undefined,
    investment_contribution_mode: showInvestmentContributionModeField.value
      ? String(
          (_d = form.investment_contribution_mode) !== null && _d !== void 0 ? _d : '',
        ).trim() === 'periodic_contribution'
        ? 'periodic_contribution'
        : 'one_time'
      : undefined,
    investment_contribution_frequency: showInvestmentPeriodicFields.value
      ? String(
          (_e = form.investment_contribution_frequency) !== null && _e !== void 0 ? _e : '',
        ).trim() === 'weekly'
        ? 'weekly'
        : 'monthly'
      : undefined,
    investment_contribution_currency: showInvestmentPeriodicFields.value
      ? String(
          (_f = form.investment_contribution_currency) !== null && _f !== void 0 ? _f : '',
        ).trim() || undefined
      : undefined,
    monthly_contribution_amount:
      showInvestmentPeriodicFields.value &&
      String((_g = form.monthly_contribution_amount) !== null && _g !== void 0 ? _g : '').trim()
        ? sanitizeAmount(form.monthly_contribution_amount, maxDecimals.value).value
        : undefined,
    initial_purchase_value: showInvestmentPeriodicFields.value ? normalizedAmount : undefined,
    market_value_override: showInvestmentMarketValueFields.value
      ? hasMarketValueOverride
        ? sanitizeAmount(form.market_value_override, maxDecimals.value).value
        : null
      : undefined,
    market_value_override_date: showInvestmentMarketValueFields.value
      ? hasMarketValueOverride
        ? effectiveMarketValueOverrideDate
        : null
      : undefined,
  };
}
// eslint-disable-next-line complexity
function buildLiabilityPayload() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  return {
    term_months:
      showLiabilityAdvancedFields.value &&
      String((_a = form.term_months) !== null && _a !== void 0 ? _a : '').trim()
        ? Number(String(form.term_months).trim())
        : undefined,
    rate_type: showLiabilityAdvancedFields.value ? 'fixed' : undefined,
    payment_frequency: showLiabilityAdvancedFields.value ? form.payment_frequency : undefined,
    expense_subcategory_override: showLiabilityExpenseSubcategoryField.value
      ? String(
          (_b = form.expense_subcategory_override) !== null && _b !== void 0 ? _b : '',
        ).trim() || undefined
      : undefined,
    amortization_system:
      showLiabilityAdvancedFields.value &&
      String((_c = form.amortization_system) !== null && _c !== void 0 ? _c : '').trim()
        ? String(form.amortization_system).trim()
        : undefined,
    opening_fees_amount:
      showMortgageFeeFields.value &&
      String((_d = form.opening_fees_amount) !== null && _d !== void 0 ? _d : '').trim()
        ? sanitizeAmount(form.opening_fees_amount, maxDecimals.value).value
        : undefined,
    early_repayment_fee_percent:
      showMortgageFeeFields.value &&
      String((_e = form.early_repayment_fee_percent) !== null && _e !== void 0 ? _e : '').trim()
        ? String(form.early_repayment_fee_percent).trim().replace(',', '.')
        : undefined,
    novation_subrogation_fee_amount:
      showMortgageFeeFields.value &&
      String((_f = form.novation_subrogation_fee_amount) !== null && _f !== void 0 ? _f : '').trim()
        ? sanitizeAmount(form.novation_subrogation_fee_amount, maxDecimals.value).value
        : undefined,
    linked_products_monthly_cost:
      showMortgageFeeFields.value &&
      String((_g = form.linked_products_monthly_cost) !== null && _g !== void 0 ? _g : '').trim()
        ? sanitizeAmount(form.linked_products_monthly_cost, maxDecimals.value).value
        : undefined,
    cancellation_forecast_enabled: showMortgageCancellationForecastFields.value
      ? !!form.cancellation_forecast_enabled
      : undefined,
    cancellation_date:
      showMortgageCancellationForecastFields.value &&
      form.cancellation_forecast_enabled &&
      String((_h = form.cancellation_date) !== null && _h !== void 0 ? _h : '').trim()
        ? String(form.cancellation_date).trim()
        : null,
    cancellation_fee_amount:
      showMortgageCancellationForecastFields.value &&
      form.cancellation_forecast_enabled &&
      String((_j = form.cancellation_fee_amount) !== null && _j !== void 0 ? _j : '').trim()
        ? sanitizeAmount(form.cancellation_fee_amount, maxDecimals.value).value
        : null,
  };
}
function buildAssetValuationPayload() {
  var _a, _b, _c, _d;
  return {
    amortization_method: showAssetAmortizationFields.value ? form.amortization_method : undefined,
    amortization_term_years:
      requiresAssetAmortizationTermInput.value &&
      String((_a = form.amortization_term_years) !== null && _a !== void 0 ? _a : '').trim()
        ? Number(String(form.amortization_term_years).trim())
        : undefined,
    valuation_model: showPrimaryHomeValuationFields.value ? form.valuation_model : undefined,
    land_value_share_percent:
      showPrimaryHomeAutoValuationFields.value &&
      String((_b = form.land_value_share_percent) !== null && _b !== void 0 ? _b : '').trim()
        ? normalizePercentWithMaxDecimals(form.land_value_share_percent, 1)
        : undefined,
    land_annual_appreciation_percent:
      showPrimaryHomeAutoValuationFields.value &&
      String(
        (_c = form.land_annual_appreciation_percent) !== null && _c !== void 0 ? _c : '',
      ).trim()
        ? normalizePercentWithMaxDecimals(form.land_annual_appreciation_percent, 1)
        : undefined,
    building_annual_depreciation_percent:
      showPrimaryHomeAutoValuationFields.value &&
      String(
        (_d = form.building_annual_depreciation_percent) !== null && _d !== void 0 ? _d : '',
      ).trim()
        ? String(form.building_annual_depreciation_percent).trim().replace(',', '.')
        : undefined,
    improvements: showPrimaryHomeAutoValuationFields.value
      ? primaryHomeImprovements.value.map(function (item) {
          return buildImprovementPayload(item);
        })
      : undefined,
  };
}
function buildItemFormPayload(normalizedAmount) {
  var payload = __assign(
    __assign(
      __assign(
        __assign(__assign({}, buildBaseItemPayload(normalizedAmount)), buildInterestPayload()),
        buildInvestmentPayload(normalizedAmount),
      ),
      buildLiabilityPayload(),
    ),
    buildAssetValuationPayload(),
  );
  if (showFinancedAsset.value) payload.financed_asset_id = form.financed_asset_id;
  return payload;
}
function resetFormAfterSubmit() {
  form.name = '';
  form.category = '';
  form.subcategory = '';
  realEstateUsage.value = 'self_use';
  form.amount = '';
  form.annual_interest_tae = props.showFinancedAsset ? '0' : '';
  form.estimated_average_balance_for_interest = '';
  form.deposit_term_months = '';
  form.monthly_payment_amount = '';
  form.start_date = todayIsoDate();
  form.expected_end_date = '';
  form.investment_contribution_mode = 'one_time';
  form.investment_contribution_frequency = 'monthly';
  form.investment_contribution_currency = '';
  form.monthly_contribution_amount = '';
  form.market_value_override = '';
  form.market_value_override_date = '';
  form.term_months = '';
  form.rate_type = 'fixed';
  form.payment_frequency = 'monthly';
  form.amortization_system = 'french';
  form.opening_fees_amount = '';
  form.early_repayment_fee_percent = '';
  form.novation_subrogation_fee_amount = '';
  form.linked_products_monthly_cost = '';
  form.cancellation_forecast_enabled = false;
  form.cancellation_date = '';
  form.cancellation_fee_amount = '';
  form.expense_subcategory_override = 'financial_commitments';
  form.amortization_method = 'none';
  form.amortization_term_years = '';
  form.valuation_model = 'manual';
  form.land_value_share_percent = '30';
  form.land_annual_appreciation_percent = '3';
  form.building_annual_depreciation_percent = '1';
  primaryHomeValuationProfile.value = PRIMARY_HOME_DEFAULT_PROFILE_VALUE;
  primaryHomeImprovements.value = [];
  expandedPrimaryHomeImprovementIndex.value = null;
  form.notes = '';
  form.currency = normalizedDefaultCurrency.value || '';
  form.ownership_id = null;
  form.financed_asset_id = null;
  financedAssetManuallySelected.value = false;
  financedAssetAutoMatched.value = false;
}
function applyLiabilityCategoryDefaults(category) {
  var _a, _b;
  if (!isLiabilityForm.value || isEdit.value) return;
  var defaults =
    LIABILITY_CATEGORY_DEFAULTS[
      String(category !== null && category !== void 0 ? category : '').trim()
    ];
  if (defaults === null || defaults === void 0 ? void 0 : defaults.paymentFrequency)
    form.payment_frequency = defaults.paymentFrequency;
  form.rate_type = 'fixed';
  form.amortization_system = 'french';
  if (!String((_a = form.annual_interest_tae) !== null && _a !== void 0 ? _a : '').trim())
    form.annual_interest_tae = '0';
  if (category !== 'mortgage') {
    form.opening_fees_amount = '';
    form.early_repayment_fee_percent = '';
    form.novation_subrogation_fee_amount = '';
    form.linked_products_monthly_cost = '';
    form.cancellation_forecast_enabled = false;
    form.cancellation_date = '';
    form.cancellation_fee_amount = '';
  }
  if (category === 'mortgage') {
    form.expense_subcategory_override = '';
  } else if (
    !String((_b = form.expense_subcategory_override) !== null && _b !== void 0 ? _b : '').trim()
  ) {
    form.expense_subcategory_override = 'financial_commitments';
  }
}
// eslint-disable-next-line complexity
function populateFormFromInitial(initial) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z,
    _0,
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9,
    _10,
    _11,
    _12,
    _13,
    _14,
    _15;
  form.name = (_a = initial.name) !== null && _a !== void 0 ? _a : '';
  form.category = (_b = initial.category) !== null && _b !== void 0 ? _b : '';
  if (
    String((_c = initial.category) !== null && _c !== void 0 ? _c : '').trim() === 'real_estate' &&
    String((_d = initial.subcategory) !== null && _d !== void 0 ? _d : '').trim() === 'rental'
  ) {
    form.subcategory = 'second_home';
    realEstateUsage.value = 'rental';
  } else {
    form.subcategory = (_e = initial.subcategory) !== null && _e !== void 0 ? _e : '';
    realEstateUsage.value = 'self_use';
  }
  form.amount = (_f = initial.amount) !== null && _f !== void 0 ? _f : '';
  form.annual_interest_tae =
    (_g = initial.annual_interest_tae) !== null && _g !== void 0
      ? _g
      : props.showFinancedAsset
        ? '0'
        : '';
  form.estimated_average_balance_for_interest = String(
    (_j = sanitizeAmount(
      (_h = initial.estimated_average_balance_for_interest) !== null && _h !== void 0 ? _h : '',
      0,
    ).value) !== null && _j !== void 0
      ? _j
      : '',
  );
  form.deposit_term_months =
    initial.deposit_term_months == null ? '' : String(initial.deposit_term_months);
  form.monthly_payment_amount =
    (_k = initial.monthly_payment_amount) !== null && _k !== void 0 ? _k : '';
  form.start_date = (_l = initial.start_date) !== null && _l !== void 0 ? _l : todayIsoDate();
  form.expected_end_date = (_m = initial.expected_end_date) !== null && _m !== void 0 ? _m : '';
  form.investment_contribution_mode =
    (_o = initial.investment_contribution_mode) !== null && _o !== void 0 ? _o : 'one_time';
  form.investment_contribution_frequency =
    (_p = initial.investment_contribution_frequency) !== null && _p !== void 0 ? _p : 'monthly';
  form.investment_contribution_currency =
    (_q = initial.investment_contribution_currency) !== null && _q !== void 0 ? _q : '';
  form.monthly_contribution_amount = formatAmountFixedForEdit(
    (_r = initial.monthly_contribution_amount) !== null && _r !== void 0 ? _r : '',
    2,
  );
  form.market_value_override = formatAmountForEdit(
    (_s = initial.market_value_override) !== null && _s !== void 0 ? _s : '',
    (_t = initial.currency) !== null && _t !== void 0 ? _t : 'EUR',
  );
  form.market_value_override_date =
    (_u = initial.market_value_override_date) !== null && _u !== void 0 ? _u : '';
  form.term_months = initial.term_months == null ? '' : String(initial.term_months);
  form.rate_type = props.showFinancedAsset
    ? 'fixed'
    : (_v = initial.rate_type) !== null && _v !== void 0
      ? _v
      : 'fixed';
  form.payment_frequency =
    (_w = initial.payment_frequency) !== null && _w !== void 0 ? _w : 'monthly';
  form.expense_subcategory_override =
    (_x = initial.expense_subcategory_override) !== null && _x !== void 0
      ? _x
      : 'financial_commitments';
  form.amortization_system = (_y = initial.amortization_system) !== null && _y !== void 0 ? _y : '';
  form.opening_fees_amount = (_z = initial.opening_fees_amount) !== null && _z !== void 0 ? _z : '';
  form.early_repayment_fee_percent =
    (_0 = initial.early_repayment_fee_percent) !== null && _0 !== void 0 ? _0 : '';
  form.novation_subrogation_fee_amount =
    (_1 = initial.novation_subrogation_fee_amount) !== null && _1 !== void 0 ? _1 : '';
  form.linked_products_monthly_cost =
    (_2 = initial.linked_products_monthly_cost) !== null && _2 !== void 0 ? _2 : '';
  form.cancellation_forecast_enabled = !!initial.cancellation_forecast_enabled;
  form.cancellation_date = (_3 = initial.cancellation_date) !== null && _3 !== void 0 ? _3 : '';
  form.cancellation_fee_amount =
    (_4 = initial.cancellation_fee_amount) !== null && _4 !== void 0 ? _4 : '';
  form.amortization_method =
    (_5 = initial.amortization_method) !== null && _5 !== void 0 ? _5 : 'none';
  form.amortization_term_years =
    initial.amortization_term_years == null ? '' : String(initial.amortization_term_years);
  form.valuation_model = (_6 = initial.valuation_model) !== null && _6 !== void 0 ? _6 : 'manual';
  form.land_value_share_percent = normalizePercentWithMaxDecimals(
    (_7 = initial.land_value_share_percent) !== null && _7 !== void 0 ? _7 : '30',
    1,
    false,
    'comma',
  );
  form.land_annual_appreciation_percent = normalizePercentWithMaxDecimals(
    (_8 = initial.land_annual_appreciation_percent) !== null && _8 !== void 0 ? _8 : '3',
    1,
    false,
    'comma',
  );
  form.building_annual_depreciation_percent =
    (_9 = initial.building_annual_depreciation_percent) !== null && _9 !== void 0 ? _9 : '1';
  primaryHomeValuationProfile.value = detectPrimaryHomeValuationProfile();
  primaryHomeImprovements.value = Array.isArray(initial.improvements)
    ? initial.improvements.map(function (row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
          id: row.id,
          name: (_a = row.name) !== null && _a !== void 0 ? _a : '',
          reform_date: (_b = row.reform_date) !== null && _b !== void 0 ? _b : todayIsoDate(),
          amount: formatAmountForEdit(
            (_c = row.amount) !== null && _c !== void 0 ? _c : '',
            (_d = initial.currency) !== null && _d !== void 0 ? _d : 'EUR',
          ),
          amortization_method:
            (_e = row.amortization_method) !== null && _e !== void 0 ? _e : 'none',
          amortization_term_years:
            row.amortization_term_years == null ? '' : String(row.amortization_term_years),
          annual_interest_tae: (_f = row.annual_interest_tae) !== null && _f !== void 0 ? _f : '',
          capitalize_interest: !!row.capitalize_interest,
          manual_current_value: formatAmountForEdit(
            (_g = row.manual_current_value) !== null && _g !== void 0 ? _g : '',
            (_h = initial.currency) !== null && _h !== void 0 ? _h : 'EUR',
          ),
          notes: (_j = row.notes) !== null && _j !== void 0 ? _j : '',
        };
      })
    : [];
  expandedPrimaryHomeImprovementIndex.value = primaryHomeImprovements.value.length
    ? primaryHomeImprovements.value.length - 1
    : null;
  form.notes = (_10 = initial.notes) !== null && _10 !== void 0 ? _10 : '';
  form.currency = (_11 = initial.currency) !== null && _11 !== void 0 ? _11 : '';
  form.tracking_mode = (_12 = initial.tracking_mode) !== null && _12 !== void 0 ? _12 : 'manual';
  form.is_active = (_13 = initial.is_active) !== null && _13 !== void 0 ? _13 : true;
  form.ownership_id = (_14 = initial.ownership_id) !== null && _14 !== void 0 ? _14 : null;
  form.financed_asset_id =
    (_15 = initial.financed_asset_id) !== null && _15 !== void 0 ? _15 : null;
  financedAssetManuallySelected.value = form.financed_asset_id != null;
  financedAssetAutoMatched.value = false;
}
var primaryHomeImprovementsError = (0, vue_1.computed)(function () {
  if (!showPrimaryHomeAutoValuationFields.value) return '';
  for (var i = 0; i < primaryHomeImprovements.value.length; i += 1) {
    var item = primaryHomeImprovements.value[i];
    var error = validatePrimaryHomeImprovement(item, i);
    if (error) return error;
  }
  return '';
});
var amountError = (0, vue_1.computed)(function () {
  var error = sanitizeAmount(form.amount, maxDecimals.value).error;
  return error;
});
var annualInterestError = (0, vue_1.computed)(function () {
  var _a;
  if (!showAnnualInterestInput.value) return '';
  var raw = String((_a = form.annual_interest_tae) !== null && _a !== void 0 ? _a : '')
    .trim()
    .replace(',', '.');
  if (!raw) return 'La TAE es obligatoria para este indicador';
  var n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 'TAE invalida';
  return '';
});
var estimatedAverageBalanceForInterestError = (0, vue_1.computed)(function () {
  if (!showEstimatedAverageBalanceForInterestInput.value) return '';
  var _a = sanitizeAmount(form.estimated_average_balance_for_interest, 0),
    value = _a.value,
    error = _a.error;
  if (error) return error;
  if (!value) return 'Indica el importe anual medio previsto para estimar intereses.';
  var parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 'El importe anual medio previsto debe ser mayor que 0.';
  }
  return '';
});
var depositTermMonthsError = (0, vue_1.computed)(function () {
  var _a;
  if (!showDepositTermMonthsInput.value) return '';
  var raw = String((_a = form.deposit_term_months) !== null && _a !== void 0 ? _a : '').trim();
  if (!raw) return 'Indica la duracion del deposito (1-12 meses).';
  var months = Number(raw);
  if (!Number.isInteger(months) || months < 1 || months > 12) {
    return 'La duracion del deposito debe estar entre 1 y 12 meses.';
  }
  return '';
});
var monthlyPaymentError = (0, vue_1.computed)(function () {
  var _a;
  if (!showMonthlyPaymentInput.value) return '';
  var raw = String((_a = form.monthly_payment_amount) !== null && _a !== void 0 ? _a : '').trim();
  if (!raw) return '';
  var error = sanitizeAmount(raw, maxDecimals.value).error;
  return error;
});
var investmentContributionError = (0, vue_1.computed)(function () {
  var _a, _b;
  if (!showInvestmentPeriodicFields.value) return '';
  if (
    String((_a = form.start_date) !== null && _a !== void 0 ? _a : '').trim() &&
    String((_b = form.expected_end_date) !== null && _b !== void 0 ? _b : '').trim() &&
    String(form.expected_end_date).trim() < String(form.start_date).trim()
  ) {
    return 'Fecha fin estimada debe ser >= fecha inicio.';
  }
  var monthly = sanitizeAmount(form.monthly_contribution_amount, maxDecimals.value);
  if (monthly.error) return monthly.error;
  if (!monthly.value || Number(monthly.value) <= 0) {
    return 'Cuota periodica obligatoria y mayor que 0.';
  }
  var initialAmount = sanitizeAmount(form.amount, maxDecimals.value);
  if (initialAmount.error) return initialAmount.error;
  if (!initialAmount.value || Number(initialAmount.value) < 0) {
    return 'Importe inicial obligatorio para aportacion periodica.';
  }
  return '';
});
var requiredFieldsError = (0, vue_1.computed)(function () {
  var _a, _b, _c, _d, _e, _f;
  if (!String((_a = form.name) !== null && _a !== void 0 ? _a : '').trim())
    return 'Nombre obligatorio';
  if (!String((_b = form.category) !== null && _b !== void 0 ? _b : '').trim())
    return 'Categoria obligatoria';
  if (
    props.subcategories &&
    !String((_c = form.subcategory) !== null && _c !== void 0 ? _c : '').trim()
  ) {
    return 'Subcategoria obligatoria';
  }
  if (!String((_d = form.start_date) !== null && _d !== void 0 ? _d : '').trim())
    return 'Fecha inicio obligatoria';
  if (!String((_e = form.amount) !== null && _e !== void 0 ? _e : '').trim())
    return 'Importe obligatorio';
  if (!String((_f = form.currency) !== null && _f !== void 0 ? _f : '').trim())
    return 'Moneda obligatoria';
  return '';
});
var assetAmortizationError = (0, vue_1.computed)(function () {
  var _a, _b;
  if (!requiresAssetAmortizationInputs.value) return '';
  var amount = String((_a = form.amount) !== null && _a !== void 0 ? _a : '').trim();
  if (!amount) return 'Importe obligatorio para modelar amortizacion';
  if (requiresAssetAmortizationTermInput.value) {
    var term = String(
      (_b = form.amortization_term_years) !== null && _b !== void 0 ? _b : '',
    ).trim();
    if (!term) return 'Plazo de amortizacion (anos) obligatorio';
    var years = Number(term);
    if (!Number.isInteger(years) || years <= 0) return 'Plazo de amortizacion invalido';
  }
  var normalizedPurchase = sanitizeAmount(amount, maxDecimals.value);
  if (!normalizedPurchase.value || normalizedPurchase.error) return 'Valor de compra invalido';
  return '';
});
var primaryHomeValuationError = (0, vue_1.computed)(function () {
  if (!showPrimaryHomeAutoValuationFields.value) return '';
  return validatePrimaryHomeValuationFields();
});
var liabilityDatesError = (0, vue_1.computed)(function () {
  if (!showLiabilityAdvancedFields.value) return '';
  if (!form.expected_end_date || !form.start_date) return '';
  return form.expected_end_date < form.start_date ? 'Fecha fin debe ser >= fecha inicio' : '';
});
var liabilityScheduleError = (0, vue_1.computed)(function () {
  if (!showLiabilityAdvancedFields.value) return '';
  return validateLiabilityScheduleFields();
});
var cancellationForecastError = (0, vue_1.computed)(function () {
  var _a, _b, _c;
  if (!showMortgageCancellationForecastFields.value) return '';
  if (!form.cancellation_forecast_enabled) return '';
  var cancellationDate = String(
    (_a = form.cancellation_date) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (!cancellationDate) return 'Indica la fecha prevista de cancelacion.';
  if (
    String((_b = form.start_date) !== null && _b !== void 0 ? _b : '').trim() &&
    cancellationDate < String(form.start_date).trim()
  ) {
    return 'Fecha de cancelacion debe ser >= fecha inicio.';
  }
  var feeSanitized = sanitizeAmount(form.cancellation_fee_amount, maxDecimals.value);
  if (
    String((_c = form.cancellation_fee_amount) !== null && _c !== void 0 ? _c : '').trim() &&
    (feeSanitized.error || !feeSanitized.value)
  ) {
    return feeSanitized.error || 'Comision de cancelacion invalida.';
  }
  return '';
});
var estimatedMonthlyPaymentPreview = (0, vue_1.computed)(function () {
  if (!showLiabilityAdvancedFields.value) return null;
  return estimateLiabilityPayment();
});
var estimatedMonthlyPaymentPreviewText = (0, vue_1.computed)(function () {
  var value = estimatedMonthlyPaymentPreview.value;
  if (value == null) return null;
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals.value,
  }).format(value);
});
var estimatedPaymentPreviewLabel = (0, vue_1.computed)(function () {
  var _a;
  var paymentFrequency = String(
    (_a = form.payment_frequency) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (paymentFrequency === 'quarterly') return 'Cuota trimestral estimada';
  return 'Cuota mensual estimada';
});
var liabilityTermFieldLabel = (0, vue_1.computed)(function () {
  var _a;
  var paymentFrequency = String(
    (_a = form.payment_frequency) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (paymentFrequency === 'quarterly') return 'Plazo total (meses)';
  return 'Cuotas (meses)';
});
var liabilityTermFieldPlaceholder = (0, vue_1.computed)(function () {
  var _a;
  var paymentFrequency = String(
    (_a = form.payment_frequency) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (paymentFrequency === 'quarterly') return 'Ej: 12 o 24 (multiplo de 3)';
  return 'Ej: 24';
});
var liabilityTermFieldHint = (0, vue_1.computed)(function () {
  var _a;
  var paymentFrequency = String(
    (_a = form.payment_frequency) !== null && _a !== void 0 ? _a : '',
  ).trim();
  if (paymentFrequency !== 'quarterly') return null;
  return 'Trimestral: introduce plazo total en meses (ej: 24 = 8 cuotas trimestrales).';
});
function submit() {
  return __awaiter(this, void 0, void 0, function () {
    var _a, normalizedAmount, error, payload;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (getFirstSubmitBlockingError()) return [2 /*return*/];
          ((_a = sanitizeAmount(form.amount, maxDecimals.value)),
            (normalizedAmount = _a.value),
            (error = _a.error));
          if (!normalizedAmount || error) return [2 /*return*/];
          payload = buildItemFormPayload(normalizedAmount);
          return [4 /*yield*/, props.onSubmit(payload)];
        case 1:
          _b.sent();
          resetFormAfterSubmit();
          return [2 /*return*/];
      }
    });
  });
}
(0, vue_1.watch)(
  function () {
    return props.initial;
  },
  function (initial) {
    if (!initial) return;
    populateFormFromInitial(initial);
  },
  { immediate: true, deep: true },
);
(0, vue_1.watch)(
  function () {
    return primaryHomeImprovements.value.map(function (item) {
      return {
        amortization_method: item.amortization_method,
        annual_interest_tae: item.annual_interest_tae,
      };
    });
  },
  function () {
    var _a;
    for (var _i = 0, _b = primaryHomeImprovements.value; _i < _b.length; _i++) {
      var item = _b[_i];
      if (
        item.amortization_method === 'straight_line' &&
        !String((_a = item.amortization_term_years) !== null && _a !== void 0 ? _a : '').trim()
      ) {
        item.amortization_term_years = '10';
      }
      if (!canCapitalizeImprovementInterest(item) && item.capitalize_interest) {
        item.capitalize_interest = false;
      }
    }
  },
  { deep: true },
);
(0, vue_1.watch)(
  [
    function () {
      return props.defaultCurrency;
    },
    function () {
      return props.initial;
    },
  ],
  function () {
    var _a;
    if (props.initial) return;
    if (
      !String((_a = form.currency) !== null && _a !== void 0 ? _a : '').trim() &&
      normalizedDefaultCurrency.value
    ) {
      form.currency = normalizedDefaultCurrency.value;
    }
  },
  { immediate: true },
);
(0, vue_1.watch)(
  function () {
    return form.currency;
  },
  function (currency) {
    var _a;
    if (!showInvestmentPeriodicFields.value) return;
    if (
      String(
        (_a = form.investment_contribution_currency) !== null && _a !== void 0 ? _a : '',
      ).trim()
    )
      return;
    form.investment_contribution_currency =
      String(currency !== null && currency !== void 0 ? currency : '').trim() || 'EUR';
  },
);
(0, vue_1.watch)(
  function () {
    return form.category;
  },
  function (category) {
    applyLiabilityCategoryDefaults(category);
  },
);
(0, vue_1.watch)(
  function () {
    return form.cancellation_forecast_enabled;
  },
  function (enabled) {
    var _a, _b;
    if (!enabled) {
      form.cancellation_date = '';
      form.cancellation_fee_amount = '';
    } else if (!String((_a = form.cancellation_date) !== null && _a !== void 0 ? _a : '').trim()) {
      form.cancellation_date =
        String((_b = form.start_date) !== null && _b !== void 0 ? _b : '').trim() || todayIsoDate();
    }
  },
);
(0, vue_1.watch)(
  [
    function () {
      return form.category;
    },
    function () {
      return form.subcategory;
    },
  ],
  function () {
    var _a, _b, _c, _d;
    if (!showInvestmentPeriodicFields.value) {
      form.investment_contribution_currency = '';
    } else if (
      !String(
        (_a = form.investment_contribution_currency) !== null && _a !== void 0 ? _a : '',
      ).trim()
    ) {
      form.investment_contribution_currency =
        String((_b = form.currency) !== null && _b !== void 0 ? _b : '').trim() || 'EUR';
    }
    if (!showInvestmentMarketValueFields.value) {
      form.market_value_override = '';
      form.market_value_override_date = '';
    } else if (
      !String((_c = form.market_value_override_date) !== null && _c !== void 0 ? _c : '').trim()
    ) {
      form.market_value_override_date = todayIsoDate();
    }
    if (!showDepositTermMonthsInput.value) {
      form.deposit_term_months = '';
    }
    if (!showPrimaryHomeValuationFields.value) {
      form.valuation_model = 'manual';
      form.land_value_share_percent = '30';
      form.land_annual_appreciation_percent = '3';
      form.building_annual_depreciation_percent = '1';
      primaryHomeValuationProfile.value = PRIMARY_HOME_DEFAULT_PROFILE_VALUE;
      primaryHomeImprovements.value = [];
      expandedPrimaryHomeImprovementIndex.value = null;
    }
    if (!showLiabilityExpenseSubcategoryField.value) {
      form.expense_subcategory_override = '';
    } else if (
      !String((_d = form.expense_subcategory_override) !== null && _d !== void 0 ? _d : '').trim()
    ) {
      form.expense_subcategory_override = 'financial_commitments';
    }
  },
);
(0, vue_1.watch)(
  function () {
    return form.valuation_model;
  },
  function (model) {
    if (model !== 'real_estate_auto') {
      primaryHomeValuationProfile.value = PRIMARY_HOME_DEFAULT_PROFILE_VALUE;
      primaryHomeImprovements.value = [];
      expandedPrimaryHomeImprovementIndex.value = null;
      return;
    }
    if (primaryHomeValuationProfile.value !== PRIMARY_HOME_CUSTOM_PROFILE_VALUE) {
      applyPrimaryHomeValuationProfile(primaryHomeValuationProfile.value);
      return;
    }
    primaryHomeValuationProfile.value = detectPrimaryHomeValuationProfile();
  },
);
(0, vue_1.watch)(
  function () {
    return primaryHomeValuationProfile.value;
  },
  function (profile) {
    if (!showPrimaryHomeAutoValuationFields.value) return;
    if (profile === PRIMARY_HOME_CUSTOM_PROFILE_VALUE) return;
    applyPrimaryHomeValuationProfile(profile);
  },
);
(0, vue_1.watch)(
  [
    function () {
      return form.land_value_share_percent;
    },
    function () {
      return form.land_annual_appreciation_percent;
    },
    function () {
      return form.building_annual_depreciation_percent;
    },
  ],
  function () {
    if (syncingPrimaryHomeProfile || !showPrimaryHomeAutoValuationFields.value) return;
    primaryHomeValuationProfile.value = detectPrimaryHomeValuationProfile();
  },
);
(0, vue_1.watch)(
  function () {
    return form.land_value_share_percent;
  },
  function (value) {
    var normalized = normalizePercentWithMaxDecimals(value, 1, true, 'comma');
    if (String(value !== null && value !== void 0 ? value : '') !== normalized)
      form.land_value_share_percent = normalized;
  },
  { immediate: true },
);
(0, vue_1.watch)(
  function () {
    return form.land_annual_appreciation_percent;
  },
  function (value) {
    var normalized = normalizePercentWithMaxDecimals(value, 1, true, 'comma');
    if (String(value !== null && value !== void 0 ? value : '') !== normalized)
      form.land_annual_appreciation_percent = normalized;
  },
  { immediate: true },
);
(0, vue_1.watch)(
  [
    function () {
      return form.category;
    },
    function () {
      return form.name;
    },
    function () {
      return props.assets;
    },
  ],
  function () {
    if (!showFinancedAsset.value || isEdit.value || financedAssetManuallySelected.value) return;
    financedAssetAutoMatched.value = false;
    var suggestion = financedAssetSuggestion.value;
    if (!suggestion) {
      form.financed_asset_id = null;
      return;
    }
    if (form.financed_asset_id !== suggestion.id) form.financed_asset_id = suggestion.id;
    financedAssetAutoMatched.value = true;
  },
  { deep: true },
);
function syncExpectedEndDateFromTerm() {
  var _a, _b;
  if (!showLiabilityAdvancedFields.value) return;
  var startDate = String((_a = form.start_date) !== null && _a !== void 0 ? _a : '').trim();
  var termRaw = String((_b = form.term_months) !== null && _b !== void 0 ? _b : '').trim();
  if (!startDate || !termRaw) return;
  var term = Number(termRaw);
  if (!Number.isInteger(term) || term <= 0) return;
  var computedEndDate = addMonthsPreserveDayIso(startDate, term);
  if (computedEndDate && form.expected_end_date !== computedEndDate) {
    form.expected_end_date = computedEndDate;
  }
}
function syncTermFromExpectedEndDate() {
  var _a, _b, _c;
  if (!showLiabilityAdvancedFields.value) return;
  var startDate = String((_a = form.start_date) !== null && _a !== void 0 ? _a : '').trim();
  var endDate = String((_b = form.expected_end_date) !== null && _b !== void 0 ? _b : '').trim();
  if (!startDate || !endDate) return;
  var inferredMonths = monthsBetweenPreserveDayIso(startDate, endDate);
  if (inferredMonths == null || inferredMonths <= 0) return;
  var nextTerm = String(inferredMonths);
  if (String((_c = form.term_months) !== null && _c !== void 0 ? _c : '') !== nextTerm) {
    form.term_months = nextTerm;
  }
}
function syncLinkedLiabilityScheduleField(source) {
  if (syncingScheduleFields) return;
  syncingScheduleFields = true;
  try {
    if (source === 'term') syncExpectedEndDateFromTerm();
    else syncTermFromExpectedEndDate();
  } finally {
    syncingScheduleFields = false;
  }
}
function onLiabilityTermInput() {
  activeLiabilityFieldGroup.value = 'term';
  syncLinkedLiabilityScheduleField('term');
}
function onLiabilityEndDateInput() {
  activeLiabilityFieldGroup.value = 'end';
  syncLinkedLiabilityScheduleField('end');
}
function onFinancedAssetChange() {
  financedAssetManuallySelected.value = true;
  financedAssetAutoMatched.value = false;
}
(0, vue_1.watch)(
  function () {
    return form.start_date;
  },
  function () {
    var _a, _b;
    if (!showLiabilityAdvancedFields.value || syncingScheduleFields) return;
    if (activeLiabilityFieldGroup.value === 'end') {
      syncLinkedLiabilityScheduleField('end');
      return;
    }
    if (String((_a = form.term_months) !== null && _a !== void 0 ? _a : '').trim()) {
      syncLinkedLiabilityScheduleField('term');
      return;
    }
    if (String((_b = form.expected_end_date) !== null && _b !== void 0 ? _b : '').trim()) {
      syncLinkedLiabilityScheduleField('end');
    }
  },
);
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid-3']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid-4']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)({});
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-item-form-grid' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(
  __assign({
    class: [
      'ui-item-form-field',
      { 'ui-item-form-field-span-2': __VLS_ctx.isLiabilityForm || !props.subcategories },
    ],
  }),
);
/** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-item-form-label' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(
    { value: __VLS_ctx.form.category },
    { class: ['select ui-data-field', { 'ui-select-placeholder': !__VLS_ctx.form.category }] },
  ),
);
/** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.option,
  __VLS_intrinsics.option,
)({
  value: '',
  disabled: true,
});
for (var _i = 0, _c = __VLS_vFor(__VLS_ctx.categories); _i < _c.length; _i++) {
  var c = _c[_i][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: c.value,
    value: c.value,
  });
  c.label;
  // @ts-ignore
  [isLiabilityForm, form, form, categories];
}
if (props.subcategories) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.subcategory },
      { class: ['select ui-data-field', { 'ui-select-placeholder': !__VLS_ctx.form.subcategory }] },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (var _d = 0, _e = __VLS_vFor(__VLS_ctx.subcategoriesForCategory); _d < _e.length; _d++) {
    var s = _e[_d][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: s.value,
      value: s.value,
    });
    s.label;
    // @ts-ignore
    [form, form, subcategoriesForCategory];
  }
}
if (__VLS_ctx.showRealEstateUsageField) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.realEstateUsage }, { class: 'select ui-data-field' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _f = 0, _g = __VLS_vFor(__VLS_ctx.REAL_ESTATE_USAGE_OPTIONS);
    _f < _g.length;
    _f++
  ) {
    var opt = _g[_f][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: opt.value,
      value: opt.value,
    });
    opt.label;
    // @ts-ignore
    [showRealEstateUsageField, realEstateUsage, REAL_ESTATE_USAGE_OPTIONS];
  }
}
if (__VLS_ctx.showInvestmentContributionModeField) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.investment_contribution_mode },
      { class: 'select ui-data-field' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _h = 0, _j = __VLS_vFor(__VLS_ctx.INVESTMENT_CONTRIBUTION_MODE_OPTIONS);
    _h < _j.length;
    _h++
  ) {
    var option = _j[_h][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [form, showInvestmentContributionModeField, INVESTMENT_CONTRIBUTION_MODE_OPTIONS];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(
  __assign({
    class: ['ui-item-form-field', { 'ui-item-form-field-span-2': __VLS_ctx.isLiabilityForm }],
  }),
);
/** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-item-form-label' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.input,
)(__assign({ placeholder: 'Nombre' }, { class: 'input ui-data-field' }));
__VLS_ctx.form.name;
/** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ if (
  !__VLS_ctx.showInvestmentPeriodicFields
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.isLiabilityForm
    ? 'Fecha inicio préstamo'
    : 'Fecha inicio';
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign({ type: 'date' }, { class: 'input ui-data-field' }),
  );
  __VLS_ctx.form.start_date;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showInvestmentPeriodicFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign({
      class: 'ui-item-form-inline-grid ui-item-form-inline-grid-3 ui-item-form-field-span-2',
    }),
  );
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid-3']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ type: 'date' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.start_date;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Importe' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.currency },
      { class: ['select ui-data-field', { 'ui-select-placeholder': !__VLS_ctx.form.currency }] },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (var _k = 0, _l = __VLS_vFor(__VLS_ctx.currencies); _k < _l.length; _k++) {
    var c = _l[_k][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: c.value,
      value: c.value,
    });
    c.label;
    // @ts-ignore
    [
      isLiabilityForm,
      isLiabilityForm,
      form,
      form,
      form,
      form,
      form,
      form,
      showInvestmentPeriodicFields,
      showInvestmentPeriodicFields,
      currencies,
    ];
  }
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.isLiabilityForm
    ? 'Principal / saldo actual'
    : 'Importe';
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign({ inputmode: 'decimal', placeholder: 'Importe' }, { class: 'input ui-data-field' }),
  );
  __VLS_ctx.form.amount;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (!__VLS_ctx.showInvestmentPeriodicFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.currency },
      { class: ['select ui-data-field', { 'ui-select-placeholder': !__VLS_ctx.form.currency }] },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (var _m = 0, _o = __VLS_vFor(__VLS_ctx.currencies); _m < _o.length; _m++) {
    var c = _o[_m][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: c.value,
      value: c.value,
    });
    c.label;
    // @ts-ignore
    [isLiabilityForm, form, form, form, showInvestmentPeriodicFields, currencies];
  }
}
if (!__VLS_ctx.showInvestmentPeriodicFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.form.tracking_mode }, { class: 'select ui-data-field' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _p = 0, _q = __VLS_vFor(__VLS_ctx.TRACKING_MODE_OPTIONS);
    _p < _q.length;
    _p++
  ) {
    var option = _q[_p][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [form, showInvestmentPeriodicFields, TRACKING_MODE_OPTIONS];
  }
}
if (__VLS_ctx.showLiabilityExpenseSubcategoryField) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.expense_subcategory_override },
      {
        class: [
          'select ui-data-field',
          { 'ui-select-placeholder': !__VLS_ctx.form.expense_subcategory_override },
        ],
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (
    var _r = 0, _s = __VLS_vFor(__VLS_ctx.LIABILITY_EXPENSE_SUBCATEGORY_OPTIONS);
    _r < _s.length;
    _r++
  ) {
    var option = _s[_r][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: option.value,
      value: option.value,
    });
    option.label;
    // @ts-ignore
    [form, form, showLiabilityExpenseSubcategoryField, LIABILITY_EXPENSE_SUBCATEGORY_OPTIONS];
  }
}
if (__VLS_ctx.showInvestmentPeriodicFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign({
      class: 'ui-item-form-inline-grid ui-item-form-inline-grid-4 ui-item-form-field-span-2',
    }),
  );
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid-4']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.investment_contribution_frequency },
      { class: 'select ui-data-field' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _t = 0, _u = __VLS_vFor(__VLS_ctx.INVESTMENT_CONTRIBUTION_FREQUENCY_OPTIONS);
    _t < _u.length;
    _t++
  ) {
    var frequency = _u[_t][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: frequency.value,
      value: frequency.value,
    });
    frequency.label;
    // @ts-ignore
    [form, showInvestmentPeriodicFields, INVESTMENT_CONTRIBUTION_FREQUENCY_OPTIONS];
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.form
    .investment_contribution_frequency === 'weekly'
    ? 'Cuota semanal'
    : 'Cuota mensual';
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        { onBlur: __VLS_ctx.formatMonthlyContributionField },
        { inputmode: 'decimal', placeholder: 'Ej: 500' },
      ),
      { class: 'input ui-data-field' },
    ),
  );
  __VLS_ctx.form.monthly_contribution_amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.investment_contribution_currency },
      {
        class: [
          'select ui-data-field',
          { 'ui-select-placeholder': !__VLS_ctx.form.investment_contribution_currency },
        ],
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (var _v = 0, _w = __VLS_vFor(__VLS_ctx.currencies); _v < _w.length; _v++) {
    var c = _w[_v][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: 'contrib-'.concat(c.value),
      value: c.value,
    });
    c.label;
    // @ts-ignore
    [form, form, form, form, currencies, formatMonthlyContributionField];
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ type: 'date' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.expected_end_date;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showInvestmentPeriodicFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign({ class: 'subtle ui-item-form-note ui-item-form-note-row ui-item-form-field-span-2' }),
  );
  /** @type {__VLS_StyleScopedClasses['subtle']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-note']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-note-row']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */
}
if (__VLS_ctx.showInvestmentMarketValueFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.market_value_override;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showInvestmentMarketValueFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ type: 'date' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.market_value_override_date;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showInvestmentPeriodicFields && __VLS_ctx.isInvestmentPeriodicIndefinite) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign({ class: 'subtle ui-item-form-note ui-item-form-note-row ui-item-form-field-span-2' }),
  );
  /** @type {__VLS_StyleScopedClasses['subtle']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-note']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-note-row']} */
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */
}
if (__VLS_ctx.showPrimaryHomeValuationFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-inline-grid' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.form.valuation_model }, { class: 'select ui-data-field' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _x = 0, _y = __VLS_vFor(__VLS_ctx.PRIMARY_HOME_VALUATION_MODE_OPTIONS);
    _x < _y.length;
    _x++
  ) {
    var opt = _y[_x][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: opt.value,
      value: opt.value,
    });
    opt.label;
    // @ts-ignore
    [
      form,
      form,
      form,
      form,
      showInvestmentPeriodicFields,
      showInvestmentPeriodicFields,
      showInvestmentMarketValueFields,
      showInvestmentMarketValueFields,
      isInvestmentPeriodicIndefinite,
      showPrimaryHomeValuationFields,
      PRIMARY_HOME_VALUATION_MODE_OPTIONS,
    ];
  }
  if (__VLS_ctx.showPrimaryHomeAutoValuationFields) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.select,
      __VLS_intrinsics.select,
    )(
      __assign({ value: __VLS_ctx.primaryHomeValuationProfile }, { class: 'select ui-data-field' }),
    );
    /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
      var _z = 0, _0 = __VLS_vFor(__VLS_ctx.PRIMARY_HOME_VALUATION_PROFILES);
      _z < _0.length;
      _z++
    ) {
      var profile = _0[_z][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.option,
        __VLS_intrinsics.option,
      )({
        key: profile.value,
        value: profile.value,
      });
      profile.label;
      // @ts-ignore
      [
        showPrimaryHomeAutoValuationFields,
        primaryHomeValuationProfile,
        PRIMARY_HOME_VALUATION_PROFILES,
      ];
    }
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      value: __VLS_ctx.PRIMARY_HOME_CUSTOM_PROFILE_VALUE,
    });
  }
  if (__VLS_ctx.showPrimaryHomeAutoValuationFields) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-inline-grid ui-item-form-inline-grid-3 mt-2' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid-3']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(__assign({ inputmode: 'decimal', placeholder: 'Ej: 30' }, { class: 'input ui-data-field' }));
    __VLS_ctx.form.land_value_share_percent;
    /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(__assign({ inputmode: 'decimal', placeholder: 'Ej: 3' }, { class: 'input ui-data-field' }));
    __VLS_ctx.form.land_annual_appreciation_percent;
    /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(__assign({ inputmode: 'decimal', placeholder: 'Ej: 1' }, { class: 'input ui-data-field' }));
    __VLS_ctx.form.building_annual_depreciation_percent;
    /** @type {__VLS_StyleScopedClasses['input']} */
    /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
  }
  if (__VLS_ctx.showPrimaryHomeAutoValuationFields) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */
  }
  if (__VLS_ctx.showPrimaryHomeAutoValuationFields) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-subsection mt-2' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-subsection']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-section-head' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-section-head']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )({});
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-section-title' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-section-title']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-section-subtitle' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-section-subtitle']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-section-actions' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-section-actions']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.button,
      __VLS_intrinsics.button,
    )(
      __assign(__assign({ onClick: __VLS_ctx.addPrimaryHomeImprovement }, { type: 'button' }), {
        class: 'btn ui-item-form-mini-btn',
      }),
    );
    /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-mini-btn']} */ if (
      !__VLS_ctx.primaryHomeImprovements.length
    ) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-form-help' }));
      /** @type {__VLS_StyleScopedClasses['ui-form-help']} */
    }
    var _loop_1 = function (improvement, index) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(
        __assign(
          { key: (_a = improvement.id) !== null && _a !== void 0 ? _a : 'new-'.concat(index) },
          { class: 'ui-item-form-improvement-card' },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['ui-item-form-improvement-card']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-item-form-improvement-head' }));
      /** @type {__VLS_StyleScopedClasses['ui-item-form-improvement-head']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-item-form-improvement-meta' }));
      /** @type {__VLS_StyleScopedClasses['ui-item-form-improvement-meta']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-item-form-section-title' }));
      /** @type {__VLS_StyleScopedClasses['ui-item-form-section-title']} */ improvement.name ||
        'Reforma '.concat(index + 1);
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.span,
        __VLS_intrinsics.span,
      )(__assign({ class: 'subtle' }));
      /** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_ctx.formatImprovementSummaryDate(
        improvement.reform_date,
      );
      __VLS_ctx.formatImprovementSummaryAmount(improvement.amount, __VLS_ctx.form.currency);
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.div,
        __VLS_intrinsics.div,
      )(__assign({ class: 'ui-item-form-improvement-actions' }));
      /** @type {__VLS_StyleScopedClasses['ui-item-form-improvement-actions']} */ __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button,
      )(
        __assign(
          __assign(
            {
              onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!__VLS_ctx.showPrimaryHomeValuationFields) return;
                if (!__VLS_ctx.showPrimaryHomeAutoValuationFields) return;
                __VLS_ctx.removePrimaryHomeImprovement(index);
                // @ts-ignore
                [
                  form,
                  form,
                  form,
                  form,
                  showPrimaryHomeAutoValuationFields,
                  showPrimaryHomeAutoValuationFields,
                  showPrimaryHomeAutoValuationFields,
                  PRIMARY_HOME_CUSTOM_PROFILE_VALUE,
                  addPrimaryHomeImprovement,
                  primaryHomeImprovements,
                  primaryHomeImprovements,
                  formatImprovementSummaryDate,
                  formatImprovementSummaryAmount,
                  removePrimaryHomeImprovement,
                ];
              },
            },
            { type: 'button' },
          ),
          { class: 'btn ui-item-form-mini-btn' },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-mini-btn']} */ __VLS_ctx.improvementRemoveLabel(
        improvement,
      );
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.button,
        __VLS_intrinsics.button,
      )(
        __assign(
          __assign(
            __assign(
              {
                onClick: function () {
                  var _a = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                  }
                  var $event = _a[0];
                  if (!__VLS_ctx.showPrimaryHomeValuationFields) return;
                  if (!__VLS_ctx.showPrimaryHomeAutoValuationFields) return;
                  __VLS_ctx.toggleImprovementExpanded(index);
                  // @ts-ignore
                  [improvementRemoveLabel, toggleImprovementExpanded];
                },
              },
              { type: 'button' },
            ),
            { class: 'icon-btn nw-cat-toggle' },
          ),
          {
            'aria-label': __VLS_ctx.isImprovementExpanded(index)
              ? 'Compactar reforma'
              : 'Expandir reforma',
            title: __VLS_ctx.isImprovementExpanded(index)
              ? 'Compactar reforma'
              : 'Expandir reforma',
          },
        ),
      );
      /** @type {__VLS_StyleScopedClasses['icon-btn']} */ /** @type {__VLS_StyleScopedClasses['nw-cat-toggle']} */ if (
        __VLS_ctx.isImprovementExpanded(index)
      ) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
        /** @type {__VLS_StyleScopedClasses['icon']} */
      } else {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
        /** @type {__VLS_StyleScopedClasses['icon']} */
      }
      if (__VLS_ctx.isImprovementExpanded(index)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-item-form-inline-grid mt-2' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.input,
        )(__assign({ placeholder: 'Ej: Reforma cocina' }, { class: 'input ui-data-field' }));
        improvement.name;
        /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.input,
        )(__assign({ type: 'date' }, { class: 'input ui-data-field' }));
        improvement.reform_date;
        /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.currencySymbol(
          __VLS_ctx.form.currency,
        )
          ? ' ('.concat(__VLS_ctx.currencySymbol(__VLS_ctx.form.currency), ')')
          : '';
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
          __assign(
            { inputmode: 'decimal', placeholder: 'Ej: 12000' },
            { class: 'input ui-data-field' },
          ),
        );
        improvement.amount;
        /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.select,
          __VLS_intrinsics.select,
        )(__assign({ value: improvement.amortization_method }, { class: 'select ui-data-field' }));
        /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
          var _14 = 0, _15 = __VLS_vFor(__VLS_ctx.PRIMARY_HOME_IMPROVEMENT_AMORTIZATION_OPTIONS);
          _14 < _15.length;
          _14++
        ) {
          var opt = _15[_14][0];
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.option,
            __VLS_intrinsics.option,
          )({
            key: opt.value,
            value: opt.value,
          });
          opt.label;
          // @ts-ignore
          [
            form,
            form,
            isImprovementExpanded,
            isImprovementExpanded,
            isImprovementExpanded,
            isImprovementExpanded,
            currencySymbol,
            currencySymbol,
            PRIMARY_HOME_IMPROVEMENT_AMORTIZATION_OPTIONS,
          ];
        }
        if (improvement.amortization_method === 'straight_line') {
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.label,
            __VLS_intrinsics.label,
          )(__assign({ class: 'ui-item-form-field' }));
          /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.span,
            __VLS_intrinsics.span,
          )(__assign({ class: 'ui-item-form-label' }));
          /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.input,
          )(
            __assign(
              { inputmode: 'numeric', placeholder: 'Ej: 10' },
              { class: 'input ui-data-field' },
            ),
          );
          improvement.amortization_term_years;
          /** @type {__VLS_StyleScopedClasses['input']} */
          /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
        }
        if (improvement.amortization_method === 'manual') {
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.label,
            __VLS_intrinsics.label,
          )(__assign({ class: 'ui-item-form-field' }));
          /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.span,
            __VLS_intrinsics.span,
          )(__assign({ class: 'ui-item-form-label' }));
          /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
            __VLS_intrinsics.input,
          )(
            __assign(
              { inputmode: 'decimal', placeholder: 'Ej: 8500' },
              { class: 'input ui-data-field' },
            ),
          );
          improvement.manual_current_value;
          /** @type {__VLS_StyleScopedClasses['input']} */
          /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
        }
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.input,
        )(
          __assign(
            { inputmode: 'decimal', placeholder: 'Opcional' },
            { class: 'input ui-data-field' },
          ),
        );
        improvement.annual_interest_tae;
        /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'checkbox-row mt-1' }));
        /** @type {__VLS_StyleScopedClasses['checkbox-row']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.input,
        )({
          type: 'checkbox',
          disabled: !__VLS_ctx.canCapitalizeImprovementInterest(improvement),
        });
        improvement.capitalize_interest;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        if (!__VLS_ctx.canCapitalizeImprovementInterest(improvement)) {
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.div,
            __VLS_intrinsics.div,
          )(__assign({ class: 'ui-form-help' }));
          /** @type {__VLS_StyleScopedClasses['ui-form-help']} */
        }
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.label,
          __VLS_intrinsics.label,
        )(__assign({ class: 'ui-item-form-field mt-1' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'ui-item-form-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.textarea,
          __VLS_intrinsics.textarea,
        )(
          __assign(__assign({ value: improvement.notes, rows: '2' }, { class: 'textarea' }), {
            placeholder: 'Notas de la reforma',
          }),
        );
        /** @type {__VLS_StyleScopedClasses['textarea']} */
      }
      // @ts-ignore
      [canCapitalizeImprovementInterest, canCapitalizeImprovementInterest];
    };
    for (var _1 = 0, _2 = __VLS_vFor(__VLS_ctx.primaryHomeImprovements); _1 < _2.length; _1++) {
      var _3 = _2[_1],
        improvement = _3[0],
        index = _3[1];
      _loop_1(improvement, index);
    }
  }
}
if (__VLS_ctx.showAssetAnnualInterestInput) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(
      { inputmode: 'decimal', placeholder: 'TAE anual (%)' },
      { class: 'input ui-data-field' },
    ),
  );
  __VLS_ctx.form.annual_interest_tae;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showEstimatedAverageBalanceForInterestInput) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.estimatedAverageBalanceCurrencyLabel;
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      {
        inputmode: 'numeric',
        placeholder: 'Saldo medio anual previsto ('.concat(
          __VLS_ctx.estimatedAverageBalanceCurrencyLabel,
          ')',
        ),
      },
      { class: 'input ui-data-field' },
    ),
  );
  __VLS_ctx.form.estimated_average_balance_for_interest;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showDepositTermMonthsInput) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      { value: __VLS_ctx.form.deposit_term_months },
      {
        class: [
          'select ui-data-field',
          {
            'ui-select-placeholder': !String(
              (_b = __VLS_ctx.form.deposit_term_months) !== null && _b !== void 0 ? _b : '',
            ).trim(),
          },
        ],
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: '',
    disabled: true,
  });
  for (var _4 = 0, _5 = __VLS_vFor(__VLS_ctx.DEPOSIT_TERM_MONTH_OPTIONS); _4 < _5.length; _4++) {
    var month = _5[_4][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: month,
      value: String(month),
    });
    month;
    // @ts-ignore
    [
      form,
      form,
      form,
      form,
      showAssetAnnualInterestInput,
      showEstimatedAverageBalanceForInterestInput,
      estimatedAverageBalanceCurrencyLabel,
      estimatedAverageBalanceCurrencyLabel,
      showDepositTermMonthsInput,
      DEPOSIT_TERM_MONTH_OPTIONS,
    ];
  }
}
if (__VLS_ctx.showLiabilityTaeOnlyField) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(
      { inputmode: 'decimal', placeholder: 'TAE anual (%)' },
      { class: 'input ui-data-field' },
    ),
  );
  __VLS_ctx.form.annual_interest_tae;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showLiabilityAdvancedFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-subtitle' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-subtitle']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.strong,
    __VLS_intrinsics.strong,
  )({});
  __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'badge' }));
  /** @type {__VLS_StyleScopedClasses['badge']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-inline-grid' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(
    __assign(__assign({ onChange: __VLS_ctx.onLiabilityEndDateInput }, { type: 'date' }), {
      class: 'input ui-data-field',
    }),
  );
  __VLS_ctx.form.expected_end_date;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: '0' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.annual_interest_tae;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_ctx.liabilityTermFieldLabel;
  __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
    __assign(
      __assign(
        { onInput: __VLS_ctx.onLiabilityTermInput },
        { inputmode: 'numeric', placeholder: __VLS_ctx.liabilityTermFieldPlaceholder },
      ),
      { class: 'input ui-data-field' },
    ),
  );
  __VLS_ctx.form.term_months;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.form.payment_frequency }, { class: 'select ui-data-field' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _6 = 0, _7 = __VLS_vFor(__VLS_ctx.LIABILITY_PAYMENT_FREQUENCIES);
    _6 < _7.length;
    _6++
  ) {
    var opt = _7[_6][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: opt.value,
      value: opt.value,
    });
    opt.label;
    // @ts-ignore
    [
      form,
      form,
      form,
      form,
      form,
      showLiabilityTaeOnlyField,
      showLiabilityAdvancedFields,
      onLiabilityEndDateInput,
      liabilityTermFieldLabel,
      onLiabilityTermInput,
      liabilityTermFieldPlaceholder,
      LIABILITY_PAYMENT_FREQUENCIES,
    ];
  }
  if (__VLS_ctx.liabilityTermFieldHint) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ __VLS_ctx.liabilityTermFieldHint;
  }
  if (__VLS_ctx.estimatedMonthlyPaymentPreviewText) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-chipline' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-chipline']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-chip' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-chip']} */ __VLS_ctx.estimatedPaymentPreviewLabel;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_ctx.estimatedMonthlyPaymentPreviewText;
    __VLS_ctx.form.currency || '';
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.small,
      __VLS_intrinsics.small,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ if (__VLS_ctx.showMortgageFeeFields) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.small,
        __VLS_intrinsics.small,
      )(__assign({ class: 'subtle' }));
      /** @type {__VLS_StyleScopedClasses['subtle']} */
    }
  }
}
if (__VLS_ctx.showMortgageFeeFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.details,
    __VLS_intrinsics.details,
  )(__assign({ class: 'ui-item-form-section ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.summary,
    __VLS_intrinsics.summary,
  )(__assign({ class: 'ui-item-form-details-summary' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-details-summary']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-inline-grid mt-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.opening_fees_amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.early_repayment_fee_percent;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.novation_subrogation_fee_amount;
  /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )(__assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }));
  __VLS_ctx.form.linked_products_monthly_cost;
  /** @type {__VLS_StyleScopedClasses['input']} */
  /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
}
if (__VLS_ctx.showMortgageCancellationForecastFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.details,
    __VLS_intrinsics.details,
  )(__assign({ class: 'ui-item-form-section ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.summary,
    __VLS_intrinsics.summary,
  )(__assign({ class: 'ui-item-form-details-summary' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-details-summary']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'mt-2' }));
  /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'checkbox-row' }));
  /** @type {__VLS_StyleScopedClasses['checkbox-row']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.input,
  )({
    type: 'checkbox',
  });
  __VLS_ctx.form.cancellation_forecast_enabled;
  __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
  if (__VLS_ctx.form.cancellation_forecast_enabled) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-item-form-inline-grid mt-2' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(__assign({ type: 'date' }, { class: 'input ui-data-field' }));
    __VLS_ctx.form.cancellation_date;
    /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(
      __assign({ inputmode: 'decimal', placeholder: 'Opcional' }, { class: 'input ui-data-field' }),
    );
    __VLS_ctx.form.cancellation_fee_amount;
    /** @type {__VLS_StyleScopedClasses['input']} */
    /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
  }
  if (__VLS_ctx.form.cancellation_forecast_enabled) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */
  }
}
if (__VLS_ctx.showAssetAmortizationFields) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-section-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-section-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-item-form-inline-grid' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-inline-grid']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.form.amortization_method }, { class: 'select ui-data-field' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ for (
    var _8 = 0, _9 = __VLS_vFor(__VLS_ctx.assetAmortizationMethodOptions);
    _8 < _9.length;
    _8++
  ) {
    var opt = _9[_8][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: opt.value,
      value: opt.value,
    });
    opt.label;
    // @ts-ignore
    [
      form,
      form,
      form,
      form,
      form,
      form,
      form,
      form,
      form,
      form,
      form,
      liabilityTermFieldHint,
      liabilityTermFieldHint,
      estimatedMonthlyPaymentPreviewText,
      estimatedMonthlyPaymentPreviewText,
      estimatedPaymentPreviewLabel,
      showMortgageFeeFields,
      showMortgageFeeFields,
      showMortgageCancellationForecastFields,
      showAssetAmortizationFields,
      assetAmortizationMethodOptions,
    ];
  }
  if (__VLS_ctx.requiresAssetAmortizationTermInput) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-item-form-field' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-item-form-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.input,
    )(__assign({ inputmode: 'numeric', placeholder: 'Ej: 10' }, { class: 'input ui-data-field' }));
    __VLS_ctx.form.amortization_term_years;
    /** @type {__VLS_StyleScopedClasses['input']} */
    /** @type {__VLS_StyleScopedClasses['ui-data-field']} */
  }
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ if (
    __VLS_ctx.assetAmortizationModelHint
  ) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ __VLS_ctx.assetAmortizationModelHint;
  }
  if (__VLS_ctx.defaultDegressiveTermYearsForFurnishings != null) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ __VLS_ctx.defaultDegressiveTermYearsForFurnishings;
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-item-form-field ui-item-form-field-span-2' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-item-form-label' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.select,
  __VLS_intrinsics.select,
)(
  __assign(
    { value: __VLS_ctx.form.ownership_id },
    {
      class: [
        'select ui-data-field',
        { 'ui-select-placeholder': __VLS_ctx.form.ownership_id == null },
      ],
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ for (
  var _10 = 0, _11 = __VLS_vFor(__VLS_ctx.ownershipOptions);
  _10 < _11.length;
  _10++
) {
  var o = _11[_10][0];
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    key: String(o.value),
    value: o.value,
  });
  o.label;
  // @ts-ignore
  [
    form,
    form,
    form,
    requiresAssetAmortizationTermInput,
    assetAmortizationModelHint,
    assetAmortizationModelHint,
    defaultDegressiveTermYearsForFurnishings,
    defaultDegressiveTermYearsForFurnishings,
    ownershipOptions,
  ];
}
if (__VLS_ctx.showFinancedAsset) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.label,
    __VLS_intrinsics.label,
  )(__assign({ class: 'ui-item-form-field ui-item-form-field-span-2' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'ui-item-form-label' }));
  /** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(
    __assign(
      __assign(
        { onChange: __VLS_ctx.onFinancedAssetChange },
        { value: __VLS_ctx.form.financed_asset_id },
      ),
      {
        class: [
          'select ui-data-field',
          { 'ui-select-placeholder': __VLS_ctx.form.financed_asset_id == null },
        ],
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ /** @type {__VLS_StyleScopedClasses['ui-select-placeholder']} */ for (
    var _12 = 0, _13 = __VLS_vFor(__VLS_ctx.financedAssetOptions);
    _12 < _13.length;
    _12++
  ) {
    var a = _13[_12][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: String(a.value),
      value: a.value,
    });
    a.label;
    // @ts-ignore
    [form, form, showFinancedAsset, onFinancedAssetChange, financedAssetOptions];
  }
  if (__VLS_ctx.financedAssetSuggestionHelp) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-form-help' }));
    /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ __VLS_ctx.financedAssetSuggestionHelp;
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.label,
  __VLS_intrinsics.label,
)(__assign({ class: 'ui-item-form-field ui-item-form-field-span-2' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-field']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.span,
  __VLS_intrinsics.span,
)(__assign({ class: 'ui-item-form-label' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-label']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.textarea,
  __VLS_intrinsics.textarea,
)(
  __assign(
    { value: __VLS_ctx.form.notes, placeholder: 'Notas', rows: '2' },
    { class: 'textarea ui-data-field' },
  ),
);
/** @type {__VLS_StyleScopedClasses['textarea']} */ /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-item-form-feedback ui-item-form-field-span-2' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-feedback']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ if (
  __VLS_ctx.amountError
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.amountError;
}
if (__VLS_ctx.annualInterestError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.annualInterestError;
}
if (__VLS_ctx.estimatedAverageBalanceForInterestError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.estimatedAverageBalanceForInterestError;
}
if (__VLS_ctx.depositTermMonthsError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.depositTermMonthsError;
}
if (__VLS_ctx.requiredFieldsError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.requiredFieldsError;
}
if (__VLS_ctx.monthlyPaymentError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.monthlyPaymentError;
}
if (__VLS_ctx.assetAmortizationError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.assetAmortizationError;
}
if (__VLS_ctx.investmentContributionError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.investmentContributionError;
}
if (__VLS_ctx.primaryHomeValuationError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.primaryHomeValuationError;
}
if (__VLS_ctx.primaryHomeImprovementsError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.primaryHomeImprovementsError;
}
if (__VLS_ctx.liabilityDatesError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.liabilityDatesError;
}
if (__VLS_ctx.liabilityScheduleError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.liabilityScheduleError;
}
if (__VLS_ctx.cancellationForecastError) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-form-help ui-form-help-error' }));
  /** @type {__VLS_StyleScopedClasses['ui-form-help']} */ /** @type {__VLS_StyleScopedClasses['ui-form-help-error']} */ __VLS_ctx.cancellationForecastError;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-item-form-footer ui-item-form-field-span-2' }));
/** @type {__VLS_StyleScopedClasses['ui-item-form-footer']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-field-span-2']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-form-actions ui-item-form-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-form-actions']} */ /** @type {__VLS_StyleScopedClasses['ui-item-form-actions']} */ if (
  __VLS_ctx.onCancel
) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(__assign({ onClick: __VLS_ctx.onCancel }, { class: 'btn ui-form-action-btn' }), {
      type: 'button',
    }),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */
  /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    __assign({ onClick: __VLS_ctx.submit }, { class: 'btn btn-primary ui-form-action-btn' }),
    {
      disabled:
        !!__VLS_ctx.requiredFieldsError ||
        !!__VLS_ctx.amountError ||
        !!__VLS_ctx.annualInterestError ||
        !!__VLS_ctx.estimatedAverageBalanceForInterestError ||
        !!__VLS_ctx.depositTermMonthsError ||
        !!__VLS_ctx.monthlyPaymentError ||
        !!__VLS_ctx.assetAmortizationError ||
        !!__VLS_ctx.investmentContributionError ||
        !!__VLS_ctx.primaryHomeValuationError ||
        !!__VLS_ctx.primaryHomeImprovementsError ||
        !!__VLS_ctx.liabilityDatesError ||
        !!__VLS_ctx.liabilityScheduleError ||
        !!__VLS_ctx.cancellationForecastError,
    },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */ __VLS_ctx.isEdit
  ? 'Guardar'
  : 'Crear';
// @ts-ignore
[
  form,
  financedAssetSuggestionHelp,
  financedAssetSuggestionHelp,
  amountError,
  amountError,
  amountError,
  annualInterestError,
  annualInterestError,
  annualInterestError,
  estimatedAverageBalanceForInterestError,
  estimatedAverageBalanceForInterestError,
  estimatedAverageBalanceForInterestError,
  depositTermMonthsError,
  depositTermMonthsError,
  depositTermMonthsError,
  requiredFieldsError,
  requiredFieldsError,
  requiredFieldsError,
  monthlyPaymentError,
  monthlyPaymentError,
  monthlyPaymentError,
  assetAmortizationError,
  assetAmortizationError,
  assetAmortizationError,
  investmentContributionError,
  investmentContributionError,
  investmentContributionError,
  primaryHomeValuationError,
  primaryHomeValuationError,
  primaryHomeValuationError,
  primaryHomeImprovementsError,
  primaryHomeImprovementsError,
  primaryHomeImprovementsError,
  liabilityDatesError,
  liabilityDatesError,
  liabilityDatesError,
  liabilityScheduleError,
  liabilityScheduleError,
  liabilityScheduleError,
  cancellationForecastError,
  cancellationForecastError,
  cancellationForecastError,
  onCancel,
  onCancel,
  submit,
  isEdit,
];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeProps: {},
});
exports.default = {};
