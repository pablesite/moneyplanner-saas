"use strict";
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var BudgetHeroSection_vue_1 = require("@/domains/budget/components/BudgetHeroSection.vue");
var BudgetMonthlyCloseLiquiditySection_vue_1 = require("@/domains/budget/components/BudgetMonthlyCloseLiquiditySection.vue");
var accounting_1 = require("@/domains/accounting");
var api_1 = require("@/lib/api");
var errors_1 = require("@/lib/errors");
var data_input_1 = require("@/domains/data-input");
var props = withDefaults(defineProps(), {
    mode: 'budget',
});
var route = (0, vue_router_1.useRoute)();
var incomeStore = (0, data_input_1.useAnnualIncomeStore)('saas');
var expenseStore = (0, data_input_1.useAnnualExpenseStore)('saas');
var fiscalYear = (0, vue_1.ref)(new Date().getFullYear());
var ownershipFilter = (0, vue_1.ref)('all');
var incomeViewMode = (0, vue_1.ref)('all');
var expenseViewMode = (0, vue_1.ref)('all');
var incomeDetailsExpanded = (0, vue_1.ref)(false);
var expenseDetailsExpanded = (0, vue_1.ref)(false);
var currentCalendarYear = new Date().getFullYear();
var monthLabels = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
];
var selectedExecutionMonth = (0, vue_1.ref)(new Date().getMonth() + 1);
var expenseMonthlySummary = (0, vue_1.ref)(null);
var incomeMonthlySummary = (0, vue_1.ref)(null);
var expenseCheckinsByEntryId = (0, vue_1.ref)({});
var expenseExecutionLoading = (0, vue_1.ref)(false);
var expenseExecutionBusyEntryId = (0, vue_1.ref)(null);
var expenseExecutionError = (0, vue_1.ref)(null);
var expenseAdjustAmounts = (0, vue_1.ref)({});
var incomeCheckinsByEntryId = (0, vue_1.ref)({});
var incomeCheckinsByEntryMonth = (0, vue_1.ref)({});
var incomeExecutionLoading = (0, vue_1.ref)(false);
var incomeExecutionBusyEntryId = (0, vue_1.ref)(null);
var incomeExecutionError = (0, vue_1.ref)(null);
var incomeAdjustAmounts = (0, vue_1.ref)({});
var accountingExecutionLoading = (0, vue_1.ref)(false);
var accountingExecutionError = (0, vue_1.ref)(null);
var accountingMonthlySummary = (0, vue_1.ref)(null);
var accountingPostedEntries = (0, vue_1.ref)([]);
var budgetSuggestionsLoading = (0, vue_1.ref)(false);
var budgetSuggestionsError = (0, vue_1.ref)(null);
var budgetSuggestions = (0, vue_1.ref)(null);
var liquidityMonthlySummary = (0, vue_1.ref)(null);
var liquidityExecutionLoading = (0, vue_1.ref)(false);
var liquidityExecutionBusyAssetId = (0, vue_1.ref)(null);
var liquidityExecutionError = (0, vue_1.ref)(null);
var liquidityAdjustAmounts = (0, vue_1.ref)({});
var activeMonthlyCloseStep = (0, vue_1.ref)('liq');
var incomeCategoryLabels = new Map(data_input_1.incomeCategories.map(function (row) { return [row.value, row.label]; }));
var incomeSubcategoryLabels = new Map(data_input_1.incomeSubcategories.map(function (row) { return [row.value, row.label]; }));
var expenseCategoryLabels = new Map(data_input_1.expenseCategories.map(function (row) { return [row.value, row.label]; }));
var expenseSubcategoryLabels = new Map(data_input_1.expenseSubcategories.map(function (row) { return [row.value, row.label]; }));
var isMonthlyCloseView = (0, vue_1.computed)(function () {
    return props.mode === 'monthly-close' ||
        route.name === 'monthly-close' ||
        route.path === '/cierre-mensual' ||
        route.path.startsWith('/cierre-mensual/');
});
var monthlyCloseFlowSteps = (0, vue_1.computed)(function () { return [
    { id: 'liq', label: 'Liquidez', subtitle: 'Saldo real de cuentas' },
    { id: 'income', label: 'Ingresos', subtitle: 'Confirmar / ajustar' },
    { id: 'expense', label: 'Gastos', subtitle: 'Confirmar / ajustar' },
    { id: 'result', label: 'Resultado', subtitle: 'Residual y KPIs' },
]; });
var monthlyCloseStepIds = (0, vue_1.computed)(function () { return monthlyCloseFlowSteps.value.map(function (s) { return s.id; }); });
var activeMonthlyCloseStepIndex = (0, vue_1.computed)(function () {
    return monthlyCloseStepIds.value.findIndex(function (id) { return id === activeMonthlyCloseStep.value; });
});
var previousMonthlyCloseStep = (0, vue_1.computed)(function () {
    var _a;
    var idx = activeMonthlyCloseStepIndex.value;
    if (idx <= 0)
        return null;
    return (_a = monthlyCloseStepIds.value[idx - 1]) !== null && _a !== void 0 ? _a : null;
});
var nextMonthlyCloseStep = (0, vue_1.computed)(function () {
    var _a;
    var idx = activeMonthlyCloseStepIndex.value;
    if (idx < 0 || idx >= monthlyCloseStepIds.value.length - 1)
        return null;
    return (_a = monthlyCloseStepIds.value[idx + 1]) !== null && _a !== void 0 ? _a : null;
});
var fiscalYearOptions = (0, vue_1.computed)(function () {
    var years = new Set([
        currentCalendarYear - 1,
        currentCalendarYear,
        currentCalendarYear + 1,
        2026,
    ]);
    for (var _i = 0, _a = incomeStore.entries.value; _i < _a.length; _i++) {
        var entry = _a[_i];
        years.add(entry.fiscalYear);
    }
    for (var _b = 0, _c = expenseStore.entries.value; _b < _c.length; _b++) {
        var entry = _c[_b];
        years.add(entry.fiscalYear);
    }
    years.add(fiscalYear.value);
    return Array.from(years).sort(function (a, b) { return b - a; });
});
var selectedOwnershipFilterLabel = (0, vue_1.computed)(function () {
    var _a, _b;
    if (ownershipFilter.value === 'all')
        return 'Todos';
    return ((_b = (_a = ownershipOptions.value.find(function (option) { return option.value === ownershipFilter.value; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : ownershipFilter.value);
});
var selectedFiscalYearLabel = (0, vue_1.computed)(function () { return String(fiscalYear.value); });
var isLoading = (0, vue_1.computed)(function () { return incomeStore.loading.value || expenseStore.loading.value; });
var firstError = (0, vue_1.computed)(function () { return incomeStore.error.value || expenseStore.error.value; });
var incomeEntries = (0, vue_1.computed)(function () { return incomeStore.entries.value; });
var expenseEntries = (0, vue_1.computed)(function () { return expenseStore.entries.value; });
function parseSharedOwnerShares(ownerLabel) {
    var text = ownerLabel.trim();
    if (!text)
        return [];
    var match = text.match(/^Compartido\s*\((.*)\)$/i);
    if (!(match === null || match === void 0 ? void 0 : match[1]))
        return [];
    return match[1]
        .split(/\s*\/\s*/)
        .map(function (part) {
        var piece = part.trim();
        var m = piece.match(/^(.*)\s+(\d+(?:[.,]\d+)?)\s*%$/);
        if (!(m === null || m === void 0 ? void 0 : m[1]) || !m[2])
            return null;
        var name = m[1].trim();
        var share = Number(m[2].replace(',', '.'));
        if (!name || !Number.isFinite(share) || share <= 0)
            return null;
        return { name: name, share: share };
    })
        .filter(function (row) { return row != null; });
}
function ownerNamesFromLabel(ownerLabel) {
    var text = ownerLabel.trim();
    if (!text)
        return [];
    var shared = parseSharedOwnerShares(text);
    if (shared.length > 0)
        return shared.map(function (row) { return row.name; });
    return [text];
}
function allocationFractionForOwnerLabel(ownerLabel, selectedOwner) {
    if (selectedOwner === 'all')
        return 1;
    var text = ownerLabel.trim();
    if (!text)
        return 0;
    if (text.localeCompare(selectedOwner, 'es', { sensitivity: 'base' }) === 0)
        return 1;
    var shared = parseSharedOwnerShares(text);
    if (!shared.length)
        return 0;
    var totalShare = shared.reduce(function (sum, row) { return sum + row.share; }, 0);
    var matchedShare = shared
        .filter(function (row) { return row.name.localeCompare(selectedOwner, 'es', { sensitivity: 'base' }) === 0; })
        .reduce(function (sum, row) { return sum + row.share; }, 0);
    if (!Number.isFinite(matchedShare) || matchedShare <= 0)
        return 0;
    // Compatibility: older labels may encode shares as 0-1 fractions instead of 0-100 percentages.
    if (totalShare > 0 && totalShare <= 1.0001) {
        return clamp(matchedShare / totalShare, 0, 1);
    }
    if (totalShare > 0 && totalShare <= 100.0001) {
        return clamp(matchedShare / 100, 0, 1);
    }
    return clamp(matchedShare / totalShare, 0, 1);
}
var ownershipOptions = (0, vue_1.computed)(function () {
    var _a, _b;
    var names = new Set();
    for (var _i = 0, _c = incomeEntries.value; _i < _c.length; _i++) {
        var entry = _c[_i];
        for (var _d = 0, _e = ownerNamesFromLabel((_a = entry.owner) !== null && _a !== void 0 ? _a : ''); _d < _e.length; _d++) {
            var name_1 = _e[_d];
            names.add(name_1);
        }
    }
    for (var _f = 0, _g = expenseEntries.value; _f < _g.length; _f++) {
        var entry = _g[_f];
        for (var _h = 0, _j = ownerNamesFromLabel((_b = entry.owner) !== null && _b !== void 0 ? _b : ''); _h < _j.length; _h++) {
            var name_2 = _j[_h];
            names.add(name_2);
        }
    }
    return Array.from(names)
        .sort(function (a, b) { return a.localeCompare(b, 'es'); })
        .map(function (name) { return ({ value: name, label: name }); });
});
(0, vue_1.watch)(ownershipOptions, function (options) {
    if (ownershipFilter.value === 'all')
        return;
    if (!options.some(function (option) { return option.value === ownershipFilter.value; })) {
        ownershipFilter.value = 'all';
    }
});
function closePopoverFromClick(event) {
    var target = event.currentTarget;
    var details = target === null || target === void 0 ? void 0 : target.closest('details');
    if (details)
        details.open = false;
}
function setActiveMonthlyCloseStep(step) {
    activeMonthlyCloseStep.value = step;
}
function goToPreviousMonthlyCloseStep() {
    if (previousMonthlyCloseStep.value)
        activeMonthlyCloseStep.value = previousMonthlyCloseStep.value;
}
function goToNextMonthlyCloseStep() {
    if (nextMonthlyCloseStep.value)
        activeMonthlyCloseStep.value = nextMonthlyCloseStep.value;
}
function selectOwnershipFilterOption(value, event) {
    ownershipFilter.value = value;
    closePopoverFromClick(event);
}
function selectFiscalYearOption(year, event) {
    fiscalYear.value = year;
    closePopoverFromClick(event);
}
function updateSelectedExecutionMonth(month) {
    selectedExecutionMonth.value = month;
}
var ownerAdjustedIncomeEntries = (0, vue_1.computed)(function () {
    return incomeEntries.value
        .map(function (entry) {
        var _a;
        var fraction = allocationFractionForOwnerLabel((_a = entry.owner) !== null && _a !== void 0 ? _a : '', ownershipFilter.value);
        return __assign(__assign({}, entry), { amountAnnual: entry.amountAnnual * fraction });
    })
        .filter(function (entry) { return entry.amountAnnual > 0; });
});
var ownerAdjustedExpenseEntries = (0, vue_1.computed)(function () {
    return expenseEntries.value
        .map(function (entry) {
        var _a;
        var fraction = allocationFractionForOwnerLabel((_a = entry.owner) !== null && _a !== void 0 ? _a : '', ownershipFilter.value);
        return __assign(__assign({}, entry), { amountAnnual: entry.amountAnnual * fraction });
    })
        .filter(function (entry) { return entry.amountAnnual > 0; });
});
function matchesIncomeViewMode(entry, mode) {
    if (mode === 'all')
        return true;
    return mode === 'recurrent' ? entry.incomeType === 'recurrent' : entry.incomeType === 'one_off';
}
function matchesExpenseViewMode(entry, mode) {
    if (mode === 'all')
        return true;
    return mode === 'recurrent' ? entry.expenseType === 'recurrent' : entry.expenseType === 'one_off';
}
function sumPlanned(entries) {
    return entries.reduce(function (sum, entry) { return sum + (Number.isFinite(entry.amountAnnual) ? entry.amountAnnual : 0); }, 0);
}
var filteredIncomeEntries = (0, vue_1.computed)(function () {
    return ownerAdjustedIncomeEntries.value.filter(function (entry) {
        return matchesIncomeViewMode(entry, incomeViewMode.value);
    });
});
var filteredExpenseEntries = (0, vue_1.computed)(function () {
    return ownerAdjustedExpenseEntries.value.filter(function (entry) {
        return matchesExpenseViewMode(entry, expenseViewMode.value);
    });
});
var plannedIncomeTotal = (0, vue_1.computed)(function () { return sumPlanned(filteredIncomeEntries.value); });
var plannedExpenseTotal = (0, vue_1.computed)(function () { return sumPlanned(filteredExpenseEntries.value); });
var plannedBalanceTotal = (0, vue_1.computed)(function () { return plannedIncomeTotal.value - plannedExpenseTotal.value; });
function toNumberOrZero(raw) {
    var n = Number(raw !== null && raw !== void 0 ? raw : 0);
    return Number.isFinite(n) ? n : 0;
}
function budgetTaxonomyKey(category, subcategory) {
    return "".concat(category, "::").concat(subcategory);
}
function resolveLedgerEntryFlowFamily(entry) {
    if (entry.flow_family === 'income' || entry.flow_family === 'expense')
        return entry.flow_family;
    if (entry.annual_income_entry_id != null)
        return 'income';
    if (entry.annual_expense_entry_id != null)
        return 'expense';
    return '';
}
function isPositiveExecutionLedgerEntry(entry, flowFamily) {
    return ((flowFamily === 'income' && entry.side === 'credit') ||
        (flowFamily === 'expense' && entry.side === 'debit'));
}
function monthlyPlannedAmountForExpenseEntry(entry, month) {
    if (entry.expenseType === 'one_off') {
        return entry.targetMonth === month ? toNumberOrZero(entry.amountAnnual) : 0;
    }
    return toNumberOrZero(entry.amountAnnual) / 12;
}
function monthlyPlannedAmountForIncomeEntry(entry, _month) {
    if (entry.incomeType === 'one_off')
        return 0;
    return toNumberOrZero(entry.amountAnnual) / 12;
}
var expenseSummaryByMonth = (0, vue_1.computed)(function () {
    var _a, _b;
    var map = new Map();
    for (var _i = 0, _c = (_b = (_a = expenseMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.months) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
        var row = _c[_i];
        map.set(row.month, row);
    }
    return map;
});
var incomeSummaryByMonth = (0, vue_1.computed)(function () {
    var _a, _b;
    var map = new Map();
    for (var _i = 0, _c = (_b = (_a = incomeMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.months) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
        var row = _c[_i];
        map.set(row.month, row);
    }
    return map;
});
var accountingSummaryByMonth = (0, vue_1.computed)(function () {
    var _a, _b;
    var map = new Map();
    for (var _i = 0, _c = (_b = (_a = accountingMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.months) !== null && _b !== void 0 ? _b : []; _i < _c.length; _i++) {
        var row = _c[_i];
        map.set(row.month, row);
    }
    return map;
});
var accountingExecutionBuckets = (0, vue_1.computed)(function () {
    var _a, _b, _c;
    var incomeCategorizedByTaxonomy = new Map();
    var expenseCategorizedByTaxonomy = new Map();
    var incomeLegacyByEntryId = new Map();
    var expenseLegacyByEntryId = new Map();
    var incomeUnclassifiedTotal = 0;
    var expenseUnclassifiedTotal = 0;
    for (var _i = 0, _d = accountingPostedEntries.value; _i < _d.length; _i++) {
        var entry = _d[_i];
        var flowFamily = resolveLedgerEntryFlowFamily(entry);
        if (!flowFamily || !isPositiveExecutionLedgerEntry(entry, flowFamily))
            continue;
        var amount = toNumberOrZero(entry.amount);
        if (entry.category_key && entry.subcategory_key) {
            var key = budgetTaxonomyKey(entry.category_key, entry.subcategory_key);
            var targetMap = flowFamily === 'income' ? incomeCategorizedByTaxonomy : expenseCategorizedByTaxonomy;
            targetMap.set(key, ((_a = targetMap.get(key)) !== null && _a !== void 0 ? _a : 0) + amount);
            continue;
        }
        if (flowFamily === 'income' && entry.annual_income_entry_id != null) {
            incomeLegacyByEntryId.set(entry.annual_income_entry_id, ((_b = incomeLegacyByEntryId.get(entry.annual_income_entry_id)) !== null && _b !== void 0 ? _b : 0) + amount);
            continue;
        }
        if (flowFamily === 'expense' && entry.annual_expense_entry_id != null) {
            expenseLegacyByEntryId.set(entry.annual_expense_entry_id, ((_c = expenseLegacyByEntryId.get(entry.annual_expense_entry_id)) !== null && _c !== void 0 ? _c : 0) + amount);
            continue;
        }
        if (flowFamily === 'income')
            incomeUnclassifiedTotal += amount;
        if (flowFamily === 'expense')
            expenseUnclassifiedTotal += amount;
    }
    return {
        incomeCategorizedByTaxonomy: incomeCategorizedByTaxonomy,
        expenseCategorizedByTaxonomy: expenseCategorizedByTaxonomy,
        incomeLegacyByEntryId: incomeLegacyByEntryId,
        expenseLegacyByEntryId: expenseLegacyByEntryId,
        incomeUnclassifiedTotal: incomeUnclassifiedTotal,
        expenseUnclassifiedTotal: expenseUnclassifiedTotal,
    };
});
var incomeTaxonomyLineCounts = (0, vue_1.computed)(function () {
    var _a;
    var map = new Map();
    for (var _i = 0, _b = incomeEntries.value; _i < _b.length; _i++) {
        var entry = _b[_i];
        if (entry.fiscalYear !== fiscalYear.value || entry.incomeType === 'one_off')
            continue;
        var planned = monthlyPlannedAmountForIncomeEntry(entry, selectedExecutionMonth.value);
        if (planned <= 0)
            continue;
        var key = budgetTaxonomyKey(entry.category, entry.subcategory);
        map.set(key, ((_a = map.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    return map;
});
var expenseTaxonomyLineCounts = (0, vue_1.computed)(function () {
    var _a;
    var map = new Map();
    for (var _i = 0, _b = expenseEntries.value; _i < _b.length; _i++) {
        var entry = _b[_i];
        var planned = monthlyPlannedAmountForExpenseEntry(entry, selectedExecutionMonth.value);
        if (planned <= 0)
            continue;
        var key = budgetTaxonomyKey(entry.category, entry.subcategory);
        map.set(key, ((_a = map.get(key)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    return map;
});
var selectedExpenseSummaryMonth = (0, vue_1.computed)(function () {
    var _a;
    return (_a = expenseSummaryByMonth.value.get(selectedExecutionMonth.value)) !== null && _a !== void 0 ? _a : null;
});
var selectedExpenseMonthPlanned = (0, vue_1.computed)(function () { var _a; return toNumberOrZero((_a = selectedExpenseSummaryMonth.value) === null || _a === void 0 ? void 0 : _a.planned); });
var selectedExpenseMonthDeviation = (0, vue_1.computed)(function () { return selectedExpenseMonthExecuted.value - selectedExpenseMonthPlanned.value; });
var monthlyIncomeExecutionEntries = (0, vue_1.computed)(function () {
    return incomeEntries.value
        .filter(function (entry) { return entry.fiscalYear === fiscalYear.value && entry.incomeType !== 'one_off'; })
        .map(function (entry) {
        var _a, _b, _c, _d;
        var checkin = (_a = incomeCheckinsByEntryId.value[entry.id]) !== null && _a !== void 0 ? _a : null;
        var planned = monthlyPlannedAmountForIncomeEntry(entry, selectedExecutionMonth.value);
        var taxonomyKey = budgetTaxonomyKey(entry.category, entry.subcategory);
        var categorizedLedgerExecuted = (_b = accountingExecutionBuckets.value.incomeCategorizedByTaxonomy.get(taxonomyKey)) !== null && _b !== void 0 ? _b : null;
        var legacyLedgerExecuted = (_c = accountingExecutionBuckets.value.incomeLegacyByEntryId.get(entry.id)) !== null && _c !== void 0 ? _c : null;
        var taxonomyLineCount = (_d = incomeTaxonomyLineCounts.value.get(taxonomyKey)) !== null && _d !== void 0 ? _d : 0;
        var fallbackExecuted = checkin && checkin.status !== 'skipped' ? toNumberOrZero(checkin.executed_amount) : 0;
        var uniqueCategorizedLedgerExecuted = categorizedLedgerExecuted != null && taxonomyLineCount === 1
            ? categorizedLedgerExecuted
            : 0;
        var executionOrigin = 'none';
        var executionSource = 'none';
        var executed = null;
        if (uniqueCategorizedLedgerExecuted > 0 || legacyLedgerExecuted != null) {
            executionOrigin =
                uniqueCategorizedLedgerExecuted > 0 ? 'categorized_ledger' : 'legacy_ledger';
            executionSource =
                uniqueCategorizedLedgerExecuted > 0 ? 'categorized_ledger' : 'legacy_fallback';
            executed = uniqueCategorizedLedgerExecuted + (legacyLedgerExecuted !== null && legacyLedgerExecuted !== void 0 ? legacyLedgerExecuted : 0);
        }
        else if (categorizedLedgerExecuted != null && taxonomyLineCount > 1) {
            executionOrigin = 'ambiguous_taxonomy';
            executionSource = 'pending_classification';
        }
        else if (checkin) {
            executionOrigin = 'legacy_checkin';
            executionSource = 'legacy_fallback';
            executed = fallbackExecuted;
        }
        return {
            entry: entry,
            planned: planned,
            checkin: checkin,
            executed: executed,
            executionOrigin: executionOrigin,
            categorizedLedgerExecuted: categorizedLedgerExecuted,
            legacyLedgerExecuted: legacyLedgerExecuted,
            executionSource: executionSource,
        };
    })
        .filter(function (row) { return row.planned > 0; })
        .sort(function (a, b) { return b.planned - a.planned || a.entry.name.localeCompare(b.entry.name, 'es'); });
});
var selectedIncomeMonthPlanned = (0, vue_1.computed)(function () {
    return monthlyIncomeExecutionEntries.value.reduce(function (sum, row) { return sum + row.planned; }, 0);
});
var selectedIncomeMonthExecuted = (0, vue_1.computed)(function () {
    return monthlyIncomeExecutionEntries.value.reduce(function (sum, row) { var _a; return sum + ((_a = row.executed) !== null && _a !== void 0 ? _a : 0); }, 0);
});
var selectedIncomeMonthDeviation = (0, vue_1.computed)(function () { return selectedIncomeMonthExecuted.value - selectedIncomeMonthPlanned.value; });
var selectedIncomeMonthCompletionRatio = (0, vue_1.computed)(function () {
    var total = monthlyIncomeExecutionEntries.value.length;
    if (!total)
        return 1;
    var checked = monthlyIncomeExecutionEntries.value.filter(function (row) { return row.executionSource !== 'none'; }).length;
    return checked / total;
});
var incomeEvolutionMonths = (0, vue_1.computed)(function () {
    var rows = monthLabels.map(function (label, index) {
        var _a;
        var month = index + 1;
        var summary = incomeSummaryByMonth.value.get(month);
        var planned = toNumberOrZero(summary === null || summary === void 0 ? void 0 : summary.planned);
        var executed = toNumberOrZero(summary === null || summary === void 0 ? void 0 : summary.executed);
        return {
            month: month,
            label: label,
            planned: planned,
            executed: executed,
            hasExecuted: ((_a = summary === null || summary === void 0 ? void 0 : summary.checkins_confirmed) !== null && _a !== void 0 ? _a : 0) > 0 || executed > 0,
        };
    });
    var maxMonthAmount = Math.max.apply(Math, __spreadArray([1], rows.map(function (row) { return Math.max(row.planned, row.executed); }), false));
    var toHeightPct = function (value) {
        if (value <= 0)
            return 0;
        return Math.max(6, Math.min(100, (value / maxMonthAmount) * 100));
    };
    return rows.map(function (row) { return (__assign(__assign({}, row), { planHeightPct: toHeightPct(row.planned), execHeightPct: toHeightPct(row.executed) })); });
});
var incomeEvolutionBaseMonthly = (0, vue_1.computed)(function () {
    if (incomeMonthlySummary.value)
        return toNumberOrZero(incomeMonthlySummary.value.planned_total) / 12;
    return plannedIncomeTotal.value / 12;
});
var selectedLiquidityMonthPlanned = (0, vue_1.computed)(function () { var _a; return toNumberOrZero((_a = liquidityMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.planned_total); });
var selectedLiquidityMonthExecuted = (0, vue_1.computed)(function () { var _a; return toNumberOrZero((_a = liquidityMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.executed_total); });
var selectedLiquidityMonthDeviation = (0, vue_1.computed)(function () { return selectedLiquidityMonthExecuted.value - selectedLiquidityMonthPlanned.value; });
var selectedLiquidityStartBase = (0, vue_1.computed)(function () { return selectedLiquidityMonthPlanned.value; });
var selectedMonthlyCloseExpected = (0, vue_1.computed)(function () {
    return selectedLiquidityStartBase.value +
        selectedIncomeMonthExecuted.value -
        selectedExpenseMonthExecuted.value;
});
var selectedMonthlyCloseResidual = (0, vue_1.computed)(function () { return selectedLiquidityMonthExecuted.value - selectedMonthlyCloseExpected.value; });
var selectedMonthlyCloseCompletionRatio = (0, vue_1.computed)(function () {
    var _a, _b;
    var ratios = [
        monthlyLiquidityExecutionRows.value.length
            ? ((_b = (_a = liquidityMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.completion_ratio) !== null && _b !== void 0 ? _b : 0)
            : 1,
        selectedIncomeMonthCompletionRatio.value,
        monthlyExpenseCoverageSummary.value.ratio,
    ];
    return ratios.reduce(function (sum, r) { return sum + r; }, 0) / ratios.length;
});
var monthlyLiquidityExecutionRows = (0, vue_1.computed)(function () {
    var _a, _b;
    return ((_b = (_a = liquidityMonthlySummary.value) === null || _a === void 0 ? void 0 : _a.rows) !== null && _b !== void 0 ? _b : []).map(function (row) {
        var planned = toNumberOrZero(row.planned_closing_balance);
        var executed = row.checkin ? toNumberOrZero(row.executed_closing_balance) : null;
        return __assign(__assign({}, row), { planned: planned, executed: executed });
    });
});
var monthlyExpenseExecutionEntries = (0, vue_1.computed)(function () {
    var month = selectedExecutionMonth.value;
    return expenseEntries.value
        .filter(function (entry) {
        if (entry.expenseType === 'one_off')
            return entry.targetMonth === month;
        return true;
    })
        .map(function (entry) {
        var _a, _b, _c, _d;
        var checkin = (_a = expenseCheckinsByEntryId.value[entry.id]) !== null && _a !== void 0 ? _a : null;
        var planned = monthlyPlannedAmountForExpenseEntry(entry, month);
        var taxonomyKey = budgetTaxonomyKey(entry.category, entry.subcategory);
        var categorizedLedgerExecuted = (_b = accountingExecutionBuckets.value.expenseCategorizedByTaxonomy.get(taxonomyKey)) !== null && _b !== void 0 ? _b : null;
        var legacyLedgerExecuted = (_c = accountingExecutionBuckets.value.expenseLegacyByEntryId.get(entry.id)) !== null && _c !== void 0 ? _c : null;
        var taxonomyLineCount = (_d = expenseTaxonomyLineCounts.value.get(taxonomyKey)) !== null && _d !== void 0 ? _d : 0;
        var fallbackExecuted = checkin && checkin.status !== 'skipped' ? toNumberOrZero(checkin.executed_amount) : 0;
        var uniqueCategorizedLedgerExecuted = categorizedLedgerExecuted != null && taxonomyLineCount === 1
            ? categorizedLedgerExecuted
            : 0;
        var executionOrigin = 'none';
        var executionSource = 'none';
        var executed = null;
        if (uniqueCategorizedLedgerExecuted > 0 || legacyLedgerExecuted != null) {
            executionOrigin =
                uniqueCategorizedLedgerExecuted > 0 ? 'categorized_ledger' : 'legacy_ledger';
            executionSource =
                uniqueCategorizedLedgerExecuted > 0 ? 'categorized_ledger' : 'legacy_fallback';
            executed = uniqueCategorizedLedgerExecuted + (legacyLedgerExecuted !== null && legacyLedgerExecuted !== void 0 ? legacyLedgerExecuted : 0);
        }
        else if (categorizedLedgerExecuted != null && taxonomyLineCount > 1) {
            executionOrigin = 'ambiguous_taxonomy';
            executionSource = 'pending_classification';
        }
        else if (checkin) {
            executionOrigin = 'legacy_checkin';
            executionSource = 'legacy_fallback';
            executed = fallbackExecuted;
        }
        return {
            entry: entry,
            planned: planned,
            checkin: checkin,
            executed: executed,
            executionOrigin: executionOrigin,
            categorizedLedgerExecuted: categorizedLedgerExecuted,
            legacyLedgerExecuted: legacyLedgerExecuted,
            executionSource: executionSource,
        };
    })
        .filter(function (row) { return row.planned > 0; })
        .sort(function (a, b) {
        return expenseCheckinCategorySortWeight(a.entry.category) -
            expenseCheckinCategorySortWeight(b.entry.category) ||
            b.planned - a.planned ||
            a.entry.name.localeCompare(b.entry.name, 'es');
    });
});
var selectedExpenseMonthExecuted = (0, vue_1.computed)(function () {
    return monthlyExpenseExecutionEntries.value.reduce(function (sum, row) { var _a; return sum + ((_a = row.executed) !== null && _a !== void 0 ? _a : 0); }, 0);
});
var groupedMonthlyExpenseExecutionEntries = (0, vue_1.computed)(function () {
    var groups = new Map();
    for (var _i = 0, _a = monthlyExpenseExecutionEntries.value; _i < _a.length; _i++) {
        var row = _a[_i];
        var key = row.entry.category;
        var group = groups.get(key);
        if (!group) {
            group = {
                categoryKey: key,
                categoryLabel: shortExpenseCategoryLabel(key),
                rows: [],
                plannedTotal: 0,
                executedTotal: 0,
                checkedCount: 0,
            };
            groups.set(key, group);
        }
        group.rows.push(row);
        group.plannedTotal += row.planned;
        if (row.executionSource !== 'none') {
            group.checkedCount += 1;
            if (row.executed != null) {
                group.executedTotal += row.executed;
            }
        }
    }
    return Array.from(groups.values())
        .map(function (group) { return (__assign(__assign({}, group), { deviation: group.executedTotal - group.plannedTotal, completionRatio: group.rows.length ? group.checkedCount / group.rows.length : 0 })); })
        .sort(function (a, b) {
        return expenseCheckinCategorySortWeight(a.categoryKey) -
            expenseCheckinCategorySortWeight(b.categoryKey) || b.plannedTotal - a.plannedTotal;
    });
});
function buildMonthlyResultBreakdown(rows, categoryLabels, subcategoryLabels, executedSectionTotal) {
    var _a, _b;
    var groups = new Map();
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        var categoryKey = row.entry.category;
        var subcategoryKey = row.entry.subcategory;
        var planned = Number.isFinite(row.planned) ? row.planned : 0;
        var executed = row.executed != null && Number.isFinite(row.executed) ? row.executed : 0;
        var isChecked = row.executionSource !== 'none';
        var group = groups.get(categoryKey);
        if (!group) {
            group = {
                key: categoryKey,
                categoryKey: categoryKey,
                categoryLabel: (_a = categoryLabels.get(categoryKey)) !== null && _a !== void 0 ? _a : categoryKey,
                lineCount: 0,
                plannedTotal: 0,
                executedTotal: 0,
                checkedCount: 0,
                rows: new Map(),
            };
            groups.set(categoryKey, group);
        }
        group.lineCount += 1;
        group.plannedTotal += planned;
        group.executedTotal += executed;
        if (isChecked)
            group.checkedCount += 1;
        var subrow = group.rows.get(subcategoryKey);
        if (!subrow) {
            subrow = {
                key: "".concat(categoryKey, "::").concat(subcategoryKey),
                subcategoryKey: subcategoryKey,
                subcategoryLabel: (_b = subcategoryLabels.get(subcategoryKey)) !== null && _b !== void 0 ? _b : subcategoryKey,
                lineCount: 0,
                plannedTotal: 0,
                executedTotal: 0,
                checkedCount: 0,
            };
            group.rows.set(subcategoryKey, subrow);
        }
        subrow.lineCount += 1;
        subrow.plannedTotal += planned;
        subrow.executedTotal += executed;
        if (isChecked)
            subrow.checkedCount += 1;
    }
    return Array.from(groups.values())
        .map(function (group) {
        var rowsSorted = Array.from(group.rows.values())
            .map(function (subrow) { return (__assign(__assign({}, subrow), { deviation: subrow.executedTotal - subrow.plannedTotal, completionRatio: subrow.lineCount ? subrow.checkedCount / subrow.lineCount : 0, shareOfExecuted: executedSectionTotal > 0 ? subrow.executedTotal / executedSectionTotal : 0 })); })
            .sort(function (a, b) {
            return b.executedTotal - a.executedTotal ||
                b.plannedTotal - a.plannedTotal ||
                a.subcategoryLabel.localeCompare(b.subcategoryLabel, 'es');
        });
        return {
            key: group.key,
            categoryKey: group.categoryKey,
            categoryLabel: group.categoryLabel,
            lineCount: group.lineCount,
            plannedTotal: group.plannedTotal,
            executedTotal: group.executedTotal,
            deviation: group.executedTotal - group.plannedTotal,
            checkedCount: group.checkedCount,
            completionRatio: group.lineCount ? group.checkedCount / group.lineCount : 0,
            shareOfExecuted: executedSectionTotal > 0 ? group.executedTotal / executedSectionTotal : 0,
            rows: rowsSorted,
        };
    })
        .sort(function (a, b) {
        return b.executedTotal - a.executedTotal ||
            b.plannedTotal - a.plannedTotal ||
            a.categoryLabel.localeCompare(b.categoryLabel, 'es');
    });
}
var monthlyIncomeResultBreakdown = (0, vue_1.computed)(function () {
    return buildMonthlyResultBreakdown(monthlyIncomeExecutionEntries.value, incomeCategoryLabels, incomeSubcategoryLabels, selectedIncomeMonthExecuted.value);
});
var monthlyExpenseResultBreakdown = (0, vue_1.computed)(function () {
    return buildMonthlyResultBreakdown(monthlyExpenseExecutionEntries.value, expenseCategoryLabels, expenseSubcategoryLabels, selectedExpenseMonthExecuted.value);
});
var selectedExecutionMonthLabel = (0, vue_1.computed)(function () { var _a; return (_a = monthLabels[selectedExecutionMonth.value - 1]) !== null && _a !== void 0 ? _a : String(selectedExecutionMonth.value); });
var incomeYtdActualByCategory = (0, vue_1.computed)(function () {
    var monthsCount = Math.max(0, Math.min(12, selectedExecutionMonth.value));
    var map = new Map();
    for (var _i = 0, _a = filteredIncomeEntries.value; _i < _a.length; _i++) {
        var entry = _a[_i];
        if (entry.incomeType === 'one_off')
            continue;
        var categoryKey = entry.category;
        var monthlyPlanned = monthlyPlannedAmountForIncomeEntry(entry, selectedExecutionMonth.value);
        var row = map.get(categoryKey);
        if (!row) {
            row = { planned: 0, executed: 0, checkedCount: 0, expectedCount: 0 };
            map.set(categoryKey, row);
        }
        row.planned += monthlyPlanned * monthsCount;
        row.expectedCount += monthsCount;
        for (var month = 1; month <= monthsCount; month++) {
            var checkin = incomeCheckinsByEntryMonth.value[incomeEntryMonthKey(entry.id, month)];
            if (!checkin)
                continue;
            row.checkedCount += 1;
            if (checkin.status !== 'skipped')
                row.executed += toNumberOrZero(checkin.executed_amount);
        }
    }
    return map;
});
var incomeYtdActualBySubcategoryKey = (0, vue_1.computed)(function () {
    var monthsCount = Math.max(0, Math.min(12, selectedExecutionMonth.value));
    var map = new Map();
    for (var _i = 0, _a = filteredIncomeEntries.value; _i < _a.length; _i++) {
        var entry = _a[_i];
        if (entry.incomeType === 'one_off')
            continue;
        var key = "".concat(entry.category, "::").concat(entry.subcategory);
        var monthlyPlanned = monthlyPlannedAmountForIncomeEntry(entry, selectedExecutionMonth.value);
        var row = map.get(key);
        if (!row) {
            row = { planned: 0, executed: 0, checkedCount: 0, expectedCount: 0 };
            map.set(key, row);
        }
        row.planned += monthlyPlanned * monthsCount;
        row.expectedCount += monthsCount;
        for (var month = 1; month <= monthsCount; month++) {
            var checkin = incomeCheckinsByEntryMonth.value[incomeEntryMonthKey(entry.id, month)];
            if (!checkin)
                continue;
            row.checkedCount += 1;
            if (checkin.status !== 'skipped')
                row.executed += toNumberOrZero(checkin.executed_amount);
        }
    }
    return map;
});
function buildActualExecution(sectionId, planned, executed, completionRatio) {
    if (!Number.isFinite(planned) || planned <= 0)
        return null;
    var ratio = executed / planned;
    return {
        planned: planned,
        executed: executed,
        deviation: executed - planned,
        completionRatio: completionRatio,
        ratio: ratio,
        widthPct: ratio <= 0 ? 0 : clamp(ratio * 100, 4, 100),
        tone: executionToneFor(sectionId, ratio),
        overflow: ratio > 1,
    };
}
function budgetCategoryActualExecution(sectionId, categoryKey) {
    if (sectionId !== 'income')
        return null;
    var row = incomeYtdActualByCategory.value.get(categoryKey);
    if (!row)
        return null;
    return buildActualExecution(sectionId, row.planned, row.executed, row.expectedCount > 0 ? row.checkedCount / row.expectedCount : 0);
}
function budgetSubcategoryActualExecution(sectionId, rowKey) {
    if (sectionId !== 'income')
        return null;
    var row = incomeYtdActualBySubcategoryKey.value.get(rowKey);
    if (!row)
        return null;
    return buildActualExecution(sectionId, row.planned, row.executed, row.expectedCount > 0 ? row.checkedCount / row.expectedCount : 0);
}
var selectedMonthlyExecutedVolume = (0, vue_1.computed)(function () { return selectedIncomeMonthExecuted.value + selectedExpenseMonthExecuted.value; });
var selectedMonthlyResidualAbs = (0, vue_1.computed)(function () { return Math.abs(selectedMonthlyCloseResidual.value); });
var selectedMonthlyResidualVolumeRatio = (0, vue_1.computed)(function () {
    return selectedMonthlyExecutedVolume.value > 0
        ? selectedMonthlyResidualAbs.value / selectedMonthlyExecutedVolume.value
        : null;
});
var selectedMonthlyResidualIncomeRatio = (0, vue_1.computed)(function () {
    return selectedIncomeMonthExecuted.value > 0
        ? selectedMonthlyResidualAbs.value / selectedIncomeMonthExecuted.value
        : null;
});
var selectedMonthlyResidualExpenseRatio = (0, vue_1.computed)(function () {
    return selectedExpenseMonthExecuted.value > 0
        ? selectedMonthlyResidualAbs.value / selectedExpenseMonthExecuted.value
        : null;
});
var selectedMonthlyResidualExpectedCloseRatio = (0, vue_1.computed)(function () {
    return Math.abs(selectedMonthlyCloseExpected.value) > 0
        ? selectedMonthlyResidualAbs.value / Math.abs(selectedMonthlyCloseExpected.value)
        : null;
});
var selectedMonthlyResidualSeverity = (0, vue_1.computed)(function () {
    var ratio = selectedMonthlyResidualVolumeRatio.value;
    if (ratio == null)
        return 'ok';
    if (ratio <= 0.01)
        return 'ok';
    if (ratio <= 0.03)
        return 'watch';
    return 'alert';
});
var selectedMonthlyResidualSeverityLabel = (0, vue_1.computed)(function () {
    if (selectedMonthlyResidualSeverity.value === 'ok')
        return 'Conciliacion OK';
    if (selectedMonthlyResidualSeverity.value === 'watch')
        return 'Revisar residual';
    return 'Residual alto';
});
var resultReconciliationFlowRows = (0, vue_1.computed)(function () { return [
    {
        id: 'start',
        label: 'Liquidez inicio (referencia)',
        amount: selectedLiquidityStartBase.value,
        tone: 'neutral',
        meta: 'Base de referencia del paso de liquidez',
    },
    {
        id: 'income',
        label: 'Ingresos ejecutados',
        amount: selectedIncomeMonthExecuted.value,
        tone: 'positive',
        meta: selectedMonthlyExecutedVolume.value > 0
            ? "".concat(formatPercent(selectedIncomeMonthExecuted.value / selectedMonthlyExecutedVolume.value, 0), " del volumen")
            : undefined,
    },
    {
        id: 'expense',
        label: 'Gastos ejecutados',
        amount: -selectedExpenseMonthExecuted.value,
        tone: 'warning',
        meta: selectedMonthlyExecutedVolume.value > 0
            ? "".concat(formatPercent(selectedExpenseMonthExecuted.value / selectedMonthlyExecutedVolume.value, 0), " del volumen")
            : undefined,
    },
    {
        id: 'expected-close',
        label: 'Cierre esperado',
        amount: selectedMonthlyCloseExpected.value,
        tone: 'neutral',
        meta: 'Liquidez inicio + ingresos - gastos',
        isResult: true,
    },
    {
        id: 'residual',
        label: 'Ajuste de conciliacion (residual)',
        amount: selectedMonthlyCloseResidual.value,
        tone: selectedMonthlyCloseResidual.value < 0 ? 'negative' : 'positive',
        meta: selectedMonthlyResidualVolumeRatio.value == null
            ? 'Sin volumen ejecutado'
            : "".concat(formatPercent(selectedMonthlyResidualVolumeRatio.value, 1), " del volumen ejecutado"),
    },
    {
        id: 'real-close',
        label: 'Cierre real',
        amount: selectedLiquidityMonthExecuted.value,
        tone: 'neutral',
        meta: 'Cierre de liquidez confirmado',
        isResult: true,
    },
]; });
var resultReconciliationCompositionRows = (0, vue_1.computed)(function () {
    var volume = selectedMonthlyExecutedVolume.value;
    return [
        {
            id: 'income',
            label: 'Ingresos ejecutados',
            amount: selectedIncomeMonthExecuted.value,
            shareOfVolume: volume > 0 ? selectedIncomeMonthExecuted.value / volume : null,
            tone: 'positive',
        },
        {
            id: 'expense',
            label: 'Gastos ejecutados',
            amount: selectedExpenseMonthExecuted.value,
            shareOfVolume: volume > 0 ? selectedExpenseMonthExecuted.value / volume : null,
            tone: 'warning',
        },
        {
            id: 'residual',
            label: 'Ajuste de conciliacion (residual)',
            amount: selectedMonthlyCloseResidual.value,
            shareOfVolume: volume > 0 ? selectedMonthlyResidualAbs.value / volume : null,
            tone: selectedMonthlyCloseResidual.value < 0 ? 'negative' : 'neutral',
        },
    ];
});
var executionStatusLabel = (0, vue_1.computed)(function () {
    if (accountingExecutionLoading.value)
        return 'Sincronizando ledger';
    if (accountingExecutionError.value)
        return 'Fallback legacy';
    var monthsWithLedger = Array.from(accountingSummaryByMonth.value.values()).filter(function (row) { return toNumberOrZero(row.income_total) > 0 || toNumberOrZero(row.expense_total) > 0; }).length;
    if (monthsWithLedger > 0)
        return 'Ledger categorizado + fallback';
    if (!expenseMonthlySummary.value)
        return 'Cargando ejecucion';
    if (expenseMonthlySummary.value.has_executed_data)
        return 'Fallback legacy';
    return 'Sin ejecucion';
});
var executionStatusDetail = (0, vue_1.computed)(function () {
    if (accountingExecutionError.value) {
        return 'No se pudo leer accounting. El cierre mensual sigue usando check-ins legacy como fallback.';
    }
    var monthsWithLedger = Array.from(accountingSummaryByMonth.value.values()).filter(function (row) { return toNumberOrZero(row.income_total) > 0 || toNumberOrZero(row.expense_total) > 0; }).length;
    if (monthsWithLedger > 0) {
        return "Ledger categorizado en ".concat(monthsWithLedger, "/12 meses. BudgetDashboardView usa taxonomia compartida como fuente primaria y fallback legacy solo cuando falta clasificacion nueva.");
    }
    if (!expenseMonthlySummary.value) {
        return 'Cargando agregados mensuales para ledger y check-ins legacy.';
    }
    return "Sin cobertura ledger todavia. Check-ins legacy disponibles en ".concat(expenseMonthlySummary.value.months_with_checkins, "/12 meses para gastos.");
});
var monthlyIncomeCoverageSummary = (0, vue_1.computed)(function () {
    var total = monthlyIncomeExecutionEntries.value.length;
    var viaLedger = monthlyIncomeExecutionEntries.value.filter(function (row) { return row.executionSource === 'categorized_ledger'; }).length;
    var viaFallback = monthlyIncomeExecutionEntries.value.filter(function (row) { return row.executionSource === 'legacy_fallback'; }).length;
    var pending = total - viaLedger - viaFallback;
    return {
        total: total,
        viaLedger: viaLedger,
        viaFallback: viaFallback,
        pending: pending,
        ratio: total > 0 ? (viaLedger + viaFallback) / total : 1,
    };
});
var monthlyExpenseCoverageSummary = (0, vue_1.computed)(function () {
    var total = monthlyExpenseExecutionEntries.value.length;
    var viaLedger = monthlyExpenseExecutionEntries.value.filter(function (row) { return row.executionSource === 'categorized_ledger'; }).length;
    var viaFallback = monthlyExpenseExecutionEntries.value.filter(function (row) { return row.executionSource === 'legacy_fallback'; }).length;
    var pending = total - viaLedger - viaFallback;
    return {
        total: total,
        viaLedger: viaLedger,
        viaFallback: viaFallback,
        pending: pending,
        ratio: total > 0 ? (viaLedger + viaFallback) / total : 1,
    };
});
var monthlyIncomePendingClassification = (0, vue_1.computed)(function () {
    var ambiguousRows = monthlyIncomeExecutionEntries.value.filter(function (row) { return row.executionSource === 'pending_classification'; }).length;
    var ambiguousAmount = monthlyIncomeExecutionEntries.value.reduce(function (sum, row) {
        var _a;
        if (row.executionSource !== 'pending_classification')
            return sum;
        return sum + ((_a = row.categorizedLedgerExecuted) !== null && _a !== void 0 ? _a : 0);
    }, 0);
    return {
        amount: ambiguousAmount + accountingExecutionBuckets.value.incomeUnclassifiedTotal,
        ambiguousRows: ambiguousRows,
    };
});
var monthlyExpensePendingClassification = (0, vue_1.computed)(function () {
    var ambiguousRows = monthlyExpenseExecutionEntries.value.filter(function (row) { return row.executionSource === 'pending_classification'; }).length;
    var ambiguousAmount = monthlyExpenseExecutionEntries.value.reduce(function (sum, row) {
        var _a;
        if (row.executionSource !== 'pending_classification')
            return sum;
        return sum + ((_a = row.categorizedLedgerExecuted) !== null && _a !== void 0 ? _a : 0);
    }, 0);
    return {
        amount: ambiguousAmount + accountingExecutionBuckets.value.expenseUnclassifiedTotal,
        ambiguousRows: ambiguousRows,
    };
});
function isLockedExecutionRow(row) {
    return row.executionOrigin === 'categorized_ledger' || row.executionOrigin === 'legacy_ledger';
}
function resolveCoverageMode(summary) {
    if (summary.total === 0 || summary.viaLedger + summary.viaFallback === 0)
        return 'none';
    if (summary.pending > 0)
        return 'partial';
    if (summary.viaLedger > 0 && summary.viaFallback > 0)
        return 'mixed';
    if (summary.viaLedger > 0)
        return 'ledger';
    return 'fallback';
}
function coverageBadgeLabel(summary) {
    var mode = resolveCoverageMode(summary);
    if (mode === 'ledger')
        return 'Cobertura ledger completa';
    if (mode === 'fallback')
        return 'Cobertura fallback legacy';
    if (mode === 'mixed')
        return 'Cobertura mixta completa';
    if (mode === 'partial')
        return 'Cobertura parcial';
    return 'Sin cobertura';
}
function coverageDetail(summary) {
    var mode = resolveCoverageMode(summary);
    if (mode === 'ledger') {
        return 'Todas las lineas del mes estan cubiertas por ledger y las acciones legacy quedan bloqueadas.';
    }
    if (mode === 'fallback') {
        return 'Todas las lineas cubiertas usan check-ins legacy; puedes editar cada fila.';
    }
    if (mode === 'mixed') {
        return 'Hay lineas con ledger y lineas legacy; solo se pueden editar las filas en fallback.';
    }
    if (mode === 'partial') {
        return 'Hay lineas cubiertas y lineas pendientes; completa solo las filas sin cobertura.';
    }
    return 'Todavia no hay lineas ejecutadas para este mes.';
}
function executionSourceLabel(origin) {
    if (origin === 'categorized_ledger')
        return 'Ledger categorizado';
    if (origin === 'legacy_ledger' || origin === 'legacy_checkin')
        return 'Fallback legacy';
    if (origin === 'ambiguous_taxonomy')
        return 'Pendiente clasificar';
    return '';
}
var monthlyExpenseCoverageLabel = (0, vue_1.computed)(function () {
    return coverageBadgeLabel(monthlyExpenseCoverageSummary.value);
});
var monthlyExpenseCoverageDetail = (0, vue_1.computed)(function () {
    return coverageDetail(monthlyExpenseCoverageSummary.value);
});
var monthlyIncomeCoverageLabel = (0, vue_1.computed)(function () {
    return coverageBadgeLabel(monthlyIncomeCoverageSummary.value);
});
var monthlyIncomeCoverageDetail = (0, vue_1.computed)(function () {
    return coverageDetail(monthlyIncomeCoverageSummary.value);
});
function refreshAccountingExecutionData() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, summaryResponse, transactionsResponse, e_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    accountingExecutionLoading.value = true;
                    accountingExecutionError.value = null;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            accounting_1.coreAccountingApi.getMonthlySummary(fiscalYear.value),
                            accounting_1.coreAccountingApi.getTransactions({
                                year: fiscalYear.value,
                                month: selectedExecutionMonth.value,
                                status: 'posted',
                            }),
                        ])];
                case 2:
                    _a = _d.sent(), summaryResponse = _a[0], transactionsResponse = _a[1];
                    accountingMonthlySummary.value = (_b = summaryResponse.data) !== null && _b !== void 0 ? _b : null;
                    accountingPostedEntries.value = ((_c = transactionsResponse.data) !== null && _c !== void 0 ? _c : []).flatMap(function (transaction) { return transaction.entries; });
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _d.sent();
                    accountingExecutionError.value = (0, errors_1.toApiErrorMessage)(e_1);
                    accountingMonthlySummary.value = null;
                    accountingPostedEntries.value = [];
                    return [3 /*break*/, 5];
                case 4:
                    accountingExecutionLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function refreshBudgetSuggestionData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    budgetSuggestionsLoading.value = true;
                    budgetSuggestionsError.value = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, accounting_1.coreAccountingApi.getBudgetSuggestions(fiscalYear.value, 2)];
                case 2:
                    response = _b.sent();
                    budgetSuggestions.value = (_a = response.data) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 5];
                case 3:
                    e_2 = _b.sent();
                    budgetSuggestionsError.value = (0, errors_1.toApiErrorMessage)(e_2);
                    budgetSuggestions.value = null;
                    return [3 /*break*/, 5];
                case 4:
                    budgetSuggestionsLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function formatMoney(value, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
    }).format(Number.isFinite(value) ? value : 0);
}
function formatSignedMoney(value, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return "".concat(value > 0 ? '+' : '').concat(formatMoney(value, decimals));
}
function formatPercent(value, decimals) {
    if (decimals === void 0) { decimals = 0; }
    if (value == null || !Number.isFinite(value))
        return '-';
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}
function formatCompactMoney(value) {
    var abs = Math.abs(value);
    if (abs >= 1000000)
        return "".concat(formatMoney(value / 1000000, 1), " M");
    if (abs >= 1000)
        return "".concat(formatMoney(value / 1000, 1), " k");
    return formatMoney(value, 0);
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function hashToUnitInterval(input) {
    var hash = 0;
    for (var i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
    }
    return (hash % 1000) / 1000;
}
function executionToneFor(sectionId, ratio) {
    if (!Number.isFinite(ratio) || ratio <= 0)
        return 'neutral';
    if (sectionId === 'expense') {
        if (ratio > 1)
            return 'danger';
        if (ratio > 0.85)
            return 'warn';
        return 'good';
    }
    if (ratio >= 1)
        return 'good';
    if (ratio >= 0.85)
        return 'warn';
    return 'danger';
}
function mockExecutionRatio(sectionId, seedKey) {
    var u = hashToUnitInterval(seedKey);
    if (sectionId === 'expense') {
        if (u < 0.34)
            return 0.62 + u * 0.55;
        if (u < 0.72)
            return 0.86 + (u - 0.34) * 0.34;
        return 1.01 + (u - 0.72) * 0.62;
    }
    if (u < 0.34)
        return 0.62 + u * 0.5;
    if (u < 0.72)
        return 0.85 + (u - 0.34) * 0.34;
    return 1.0 + (u - 0.72) * 0.72;
}
function executionPreview(sectionId, seedKey) {
    var ratio = mockExecutionRatio(sectionId, seedKey);
    return {
        ratio: ratio,
        widthPct: clamp(ratio * 100, 8, 100),
        tone: executionToneFor(sectionId, ratio),
        overflow: ratio > 1,
    };
}
function aggregateBudgetRows(entries, categoryLabels, subcategoryLabels) {
    var _a, _b, _c;
    var bucket = new Map();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var amount = Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0);
        if (!Number.isFinite(amount) || amount <= 0)
            continue;
        var key = "".concat(entry.category, "::").concat(entry.subcategory);
        var prev = bucket.get(key);
        if (prev) {
            prev.plannedAnnual += amount;
            prev.itemsCount += 1;
            continue;
        }
        bucket.set(key, {
            key: key,
            categoryKey: entry.category,
            categoryLabel: (_b = categoryLabels.get(entry.category)) !== null && _b !== void 0 ? _b : entry.category,
            subcategoryKey: entry.subcategory,
            subcategoryLabel: (_c = subcategoryLabels.get(entry.subcategory)) !== null && _c !== void 0 ? _c : entry.subcategory,
            plannedAnnual: amount,
            itemsCount: 1,
        });
    }
    var rows = Array.from(bucket.values()).sort(function (a, b) {
        if (b.plannedAnnual !== a.plannedAnnual)
            return b.plannedAnnual - a.plannedAnnual;
        return a.subcategoryLabel.localeCompare(b.subcategoryLabel, 'es');
    });
    var sectionTotal = rows.reduce(function (sum, row) { return sum + row.plannedAnnual; }, 0);
    var byCategory = new Map();
    for (var _d = 0, rows_2 = rows; _d < rows_2.length; _d++) {
        var row = rows_2[_d];
        var group = byCategory.get(row.categoryKey);
        if (group) {
            group.plannedAnnual += row.plannedAnnual;
            group.rows.push(row);
            continue;
        }
        byCategory.set(row.categoryKey, {
            categoryKey: row.categoryKey,
            categoryLabel: row.categoryLabel,
            plannedAnnual: row.plannedAnnual,
            shareOfSection: 0,
            rows: [row],
        });
    }
    return Array.from(byCategory.values())
        .map(function (group) { return (__assign(__assign({}, group), { rows: group.rows.sort(function (a, b) { return b.plannedAnnual - a.plannedAnnual; }), shareOfSection: sectionTotal > 0 ? group.plannedAnnual / sectionTotal : 0 })); })
        .sort(function (a, b) { return b.plannedAnnual - a.plannedAnnual; });
}
var incomeGroups = (0, vue_1.computed)(function () {
    return aggregateBudgetRows(filteredIncomeEntries.value, incomeCategoryLabels, incomeSubcategoryLabels);
});
var expenseGroups = (0, vue_1.computed)(function () {
    return aggregateBudgetRows(filteredExpenseEntries.value, expenseCategoryLabels, expenseSubcategoryLabels);
});
function viewModeLabel(mode) {
    if (mode === 'recurrent')
        return 'Solo recurrentes';
    if (mode === 'one_off')
        return 'Solo puntuales';
    return 'Todos';
}
function isSectionExpanded(sectionId) {
    return sectionId === 'income' ? incomeDetailsExpanded.value : expenseDetailsExpanded.value;
}
function toggleSectionExpanded(sectionId) {
    if (sectionId === 'income') {
        incomeDetailsExpanded.value = !incomeDetailsExpanded.value;
        return;
    }
    expenseDetailsExpanded.value = !expenseDetailsExpanded.value;
}
var sections = (0, vue_1.computed)(function () { return [
    {
        id: 'income',
        title: 'Ingresos',
        subtitle: 'Detalle previsto por categorias y subcategorias del balance anual',
        emptyMessage: 'No hay ingresos anuales cargados para este ejercicio.',
        toneClass: 'ui-budget-section-income',
        totalAnnual: plannedIncomeTotal.value,
        filterMode: incomeViewMode.value,
        categoryCount: incomeGroups.value.length,
        subcategoryCount: incomeGroups.value.reduce(function (sum, group) { return sum + group.rows.length; }, 0),
        groups: incomeGroups.value,
    },
    {
        id: 'expense',
        title: 'Gastos',
        subtitle: 'Detalle previsto por categorias y subcategorias del balance anual',
        emptyMessage: 'No hay gastos anuales cargados para este ejercicio.',
        toneClass: 'ui-budget-section-expense',
        totalAnnual: plannedExpenseTotal.value,
        filterMode: expenseViewMode.value,
        categoryCount: expenseGroups.value.length,
        subcategoryCount: expenseGroups.value.reduce(function (sum, group) { return sum + group.rows.length; }, 0),
        groups: expenseGroups.value,
    },
]; });
var budgetSuggestionBySubcategory = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d;
    var income = new Map();
    var expense = new Map();
    for (var _i = 0, _e = (_b = (_a = budgetSuggestions.value) === null || _a === void 0 ? void 0 : _a.income.subcategories) !== null && _b !== void 0 ? _b : []; _i < _e.length; _i++) {
        var row = _e[_i];
        income.set("".concat(row.category, ":").concat(row.subcategory), row);
    }
    for (var _f = 0, _g = (_d = (_c = budgetSuggestions.value) === null || _c === void 0 ? void 0 : _c.expense.subcategories) !== null && _d !== void 0 ? _d : []; _f < _g.length; _f++) {
        var row = _g[_f];
        expense.set("".concat(row.category, ":").concat(row.subcategory), row);
    }
    return { income: income, expense: expense };
});
var incomeBudgetSuggestions = (0, vue_1.computed)(function () {
    return incomeGroups.value
        .flatMap(function (group) {
        return group.rows.map(function (row) {
            var key = "".concat(row.categoryKey, ":").concat(row.subcategoryKey);
            var suggestion = budgetSuggestionBySubcategory.value.income.get(key);
            if (!suggestion)
                return null;
            return {
                key: key,
                subcategoryLabel: row.subcategoryLabel,
                plannedAnnual: row.plannedAnnual,
                suggestedAnnual: toNumberOrZero(suggestion.suggested_annual),
                observedMonths: suggestion.observed_months,
            };
        });
    })
        .filter(function (row) { return row != null; })
        .sort(function (a, b) {
        return Math.abs(b.suggestedAnnual - b.plannedAnnual) -
            Math.abs(a.suggestedAnnual - a.plannedAnnual);
    })
        .slice(0, 6);
});
var expenseBudgetSuggestions = (0, vue_1.computed)(function () {
    return expenseGroups.value
        .flatMap(function (group) {
        return group.rows.map(function (row) {
            var key = "".concat(row.categoryKey, ":").concat(row.subcategoryKey);
            var suggestion = budgetSuggestionBySubcategory.value.expense.get(key);
            if (!suggestion)
                return null;
            return {
                key: key,
                subcategoryLabel: row.subcategoryLabel,
                plannedAnnual: row.plannedAnnual,
                suggestedAnnual: toNumberOrZero(suggestion.suggested_annual),
                observedMonths: suggestion.observed_months,
            };
        });
    })
        .filter(function (row) { return row != null; })
        .sort(function (a, b) {
        return Math.abs(b.suggestedAnnual - b.plannedAnnual) -
            Math.abs(a.suggestedAnnual - a.plannedAnnual);
    })
        .slice(0, 6);
});
var hasAnyPlannedData = (0, vue_1.computed)(function () { return plannedIncomeTotal.value > 0 || plannedExpenseTotal.value > 0; });
var activeViewSummary = (0, vue_1.computed)(function () {
    return "Ingresos: ".concat(viewModeLabel(incomeViewMode.value), " \u00B7 Gastos: ").concat(viewModeLabel(expenseViewMode.value));
});
function refreshBudgetData() {
    return __awaiter(this, arguments, void 0, function (year) {
        if (year === void 0) { year = fiscalYear.value; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([incomeStore.loadAll(year), expenseStore.loadAll(year)])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadIncomeCheckinsForSelectedMonth() {
    return __awaiter(this, void 0, void 0, function () {
        var response, nextMap, _i, _a, row, e_3;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/budget/annual-income-checkins/', {
                            params: { year: fiscalYear.value, month: selectedExecutionMonth.value },
                        })];
                case 1:
                    response = _c.sent();
                    nextMap = {};
                    for (_i = 0, _a = (_b = response.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        nextMap[row.annual_income_entry_id] = row;
                    }
                    incomeCheckinsByEntryId.value = nextMap;
                    return [3 /*break*/, 3];
                case 2:
                    e_3 = _c.sent();
                    incomeExecutionError.value = (0, errors_1.toApiErrorMessage)(e_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function incomeEntryMonthKey(entryId, month) {
    return "".concat(entryId, ":").concat(month);
}
function loadIncomeCheckinsForYear() {
    return __awaiter(this, void 0, void 0, function () {
        var response, nextMap, _i, _a, row, e_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/budget/annual-income-checkins/', {
                            params: { year: fiscalYear.value },
                        })];
                case 1:
                    response = _c.sent();
                    nextMap = {};
                    for (_i = 0, _a = (_b = response.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        nextMap[incomeEntryMonthKey(row.annual_income_entry_id, row.month)] = row;
                    }
                    incomeCheckinsByEntryMonth.value = nextMap;
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _c.sent();
                    incomeExecutionError.value = (0, errors_1.toApiErrorMessage)(e_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadIncomeExecutionSummary() {
    return __awaiter(this, arguments, void 0, function (year) {
        var response, e_5;
        var _a;
        if (year === void 0) { year = fiscalYear.value; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/budget/annual-income/monthly-summary/', { params: { year: year } })];
                case 1:
                    response = _b.sent();
                    incomeMonthlySummary.value = (_a = response.data) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 3];
                case 2:
                    e_5 = _b.sent();
                    incomeExecutionError.value = (0, errors_1.toApiErrorMessage)(e_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshIncomeExecutionData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    incomeExecutionLoading.value = true;
                    incomeExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.all([
                            loadIncomeExecutionSummary(),
                            loadIncomeCheckinsForYear(),
                            loadIncomeCheckinsForSelectedMonth(),
                        ])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    incomeExecutionLoading.value = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadExpenseExecutionSummary() {
    return __awaiter(this, arguments, void 0, function (year) {
        var response, e_6;
        var _a;
        if (year === void 0) { year = fiscalYear.value; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/budget/annual-expense/monthly-summary/', { params: { year: year } })];
                case 1:
                    response = _b.sent();
                    expenseMonthlySummary.value = (_a = response.data) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 3];
                case 2:
                    e_6 = _b.sent();
                    expenseExecutionError.value = (0, errors_1.toApiErrorMessage)(e_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadExpenseCheckinsForSelectedMonth() {
    return __awaiter(this, void 0, void 0, function () {
        var response, nextMap, _i, _a, row, e_7;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/budget/annual-expense-checkins/', {
                            params: { year: fiscalYear.value, month: selectedExecutionMonth.value },
                        })];
                case 1:
                    response = _c.sent();
                    nextMap = {};
                    for (_i = 0, _a = (_b = response.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        nextMap[row.annual_expense_entry_id] = row;
                    }
                    expenseCheckinsByEntryId.value = nextMap;
                    return [3 /*break*/, 3];
                case 2:
                    e_7 = _c.sent();
                    expenseExecutionError.value = (0, errors_1.toApiErrorMessage)(e_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshExpenseExecutionData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expenseExecutionLoading.value = true;
                    expenseExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, Promise.all([loadExpenseExecutionSummary(), loadExpenseCheckinsForSelectedMonth()])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    expenseExecutionLoading.value = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function suggestedExecutedAmountForRow(row) {
    var _a;
    if (((_a = row.checkin) === null || _a === void 0 ? void 0 : _a.status) === 'skipped')
        return '0.00';
    if (row.executed != null)
        return row.executed.toFixed(2);
    return row.planned.toFixed(2);
}
function ensureExpenseAdjustAmountPrefilled(row) {
    var _a;
    var current = String((_a = expenseAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim();
    if (current)
        return;
    expenseAdjustAmounts.value[row.entry.id] = suggestedExecutedAmountForRow(row);
}
function parseDecimalInput(raw) {
    var normalized = raw.trim().replace(',', '.');
    if (!normalized)
        return null;
    var value = Number(normalized);
    if (!Number.isFinite(value) || value < 0)
        return null;
    return value;
}
function checkinStatusLabel(status) {
    if (status === 'confirmed')
        return 'Confirmado';
    if (status === 'adjusted')
        return 'Ajustado';
    return 'No ocurrió';
}
function incomeCheckinRowSummary(row) {
    var _a;
    var subcategory = (_a = incomeSubcategoryLabels.get(row.entry.subcategory)) !== null && _a !== void 0 ? _a : row.entry.subcategory;
    return "".concat(subcategory, " \u00B7 ").concat(row.entry.name);
}
function suggestedIncomeExecutedAmountForRow(row) {
    var _a;
    if (((_a = row.checkin) === null || _a === void 0 ? void 0 : _a.status) === 'skipped')
        return '0.00';
    if (row.executed != null)
        return row.executed.toFixed(2);
    return row.planned.toFixed(2);
}
function ensureIncomeAdjustAmountPrefilled(row) {
    var _a;
    var current = String((_a = incomeAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim();
    if (current)
        return;
    incomeAdjustAmounts.value[row.entry.id] = suggestedIncomeExecutedAmountForRow(row);
}
function clearIncomeCheckin(row) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existing = incomeCheckinsByEntryId.value[row.entry.id];
                    if (!existing)
                        return [2 /*return*/];
                    incomeExecutionBusyEntryId.value = row.entry.id;
                    incomeExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, api_1.coreApi.delete("/api/budget/annual-income-checkins/".concat(existing.id, "/"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshIncomeExecutionData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_8 = _a.sent();
                    incomeExecutionError.value = (0, errors_1.toApiErrorMessage)(e_8);
                    return [3 /*break*/, 6];
                case 5:
                    incomeExecutionBusyEntryId.value = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function upsertIncomeCheckin(row, status) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, payload, existing, e_9;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    incomeExecutionError.value = null;
                    incomeExecutionBusyEntryId.value = row.entry.id;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    parsed = parseDecimalInput(String((_a = incomeAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim());
                    if (parsed == null) {
                        incomeExecutionError.value = 'Indica un importe valido para confirmar (por ejemplo 123,45).';
                        return [2 /*return*/];
                    }
                    incomeAdjustAmounts.value[row.entry.id] = parsed.toFixed(2);
                    payload = {
                        annual_income_entry_id: row.entry.id,
                        fiscal_year: fiscalYear.value,
                        month: selectedExecutionMonth.value,
                        status: status,
                        executed_amount: parsed.toFixed(2),
                    };
                    existing = incomeCheckinsByEntryId.value[row.entry.id];
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, api_1.coreApi.patch("/api/budget/annual-income-checkins/".concat(existing.id, "/"), payload)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, api_1.coreApi.post('/api/budget/annual-income-checkins/', payload)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [4 /*yield*/, refreshIncomeExecutionData()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e_9 = _b.sent();
                    incomeExecutionError.value = (0, errors_1.toApiErrorMessage)(e_9);
                    return [3 /*break*/, 9];
                case 8:
                    incomeExecutionBusyEntryId.value = null;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function saveIncomeCheckinFromInput(row) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ensureIncomeAdjustAmountPrefilled(row);
                    parsed = parseDecimalInput(String((_a = incomeAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim());
                    if (parsed == null) {
                        incomeExecutionError.value = 'Indica un importe valido para confirmar (por ejemplo 123,45).';
                        return [2 /*return*/];
                    }
                    incomeAdjustAmounts.value[row.entry.id] = parsed.toFixed(2);
                    status = amountsEqualCents(parsed, row.planned) ? 'confirmed' : 'adjusted';
                    return [4 /*yield*/, upsertIncomeCheckin(row, status)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onIncomeCheckinCheckboxToggle(row, checked) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!checked) return [3 /*break*/, 2];
                    return [4 /*yield*/, saveIncomeCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, clearIncomeCheckin(row)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onIncomeAdjustAmountBlur(row) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!incomeCheckinsByEntryId.value[row.entry.id])
                        return [2 /*return*/];
                    return [4 /*yield*/, saveIncomeCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function resetIncomeCheckinDraftValue(row, mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    incomeAdjustAmounts.value[row.entry.id] = mode === 'zero' ? '0.00' : row.planned.toFixed(2);
                    if (!incomeCheckinsByEntryId.value[row.entry.id]) return [3 /*break*/, 2];
                    return [4 /*yield*/, clearIncomeCheckin(row)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function cleanedExpenseCheckinName(name) {
    return name.replace(/^Compromiso pasivo:\s*/i, '').trim();
}
function shortExpenseCategoryLabel(category) {
    var _a;
    if (category === 'real_estate_assets')
        return 'Act. Inm';
    if (category === 'tangible_assets')
        return 'Act. Mob';
    if (category === 'consumption_expenses')
        return 'Gastos';
    if (category === 'financial_investments')
        return 'Inv. Fin';
    if (category === 'savings_allocation')
        return 'Ahorro';
    return ((_a = expenseCategoryLabels.get(category)) !== null && _a !== void 0 ? _a : category);
}
function expenseCheckinCategorySortWeight(category) {
    if (category === 'real_estate_assets')
        return 0; // Act. Inm
    if (category === 'tangible_assets')
        return 1; // Act. mob
    if (category === 'financial_investments')
        return 2; // Inversiones
    if (category === 'consumption_expenses')
        return 3; // Gastos
    if (category === 'savings_allocation')
        return 4; // Ahorro
    return 99;
}
function amountsEqualCents(left, right) {
    return Math.round(left * 100) === Math.round(right * 100);
}
function expenseCheckinRowSummary(row) {
    var _a;
    var name = cleanedExpenseCheckinName(row.entry.name);
    var subcategory = (_a = expenseSubcategoryLabels.get(row.entry.subcategory)) !== null && _a !== void 0 ? _a : row.entry.subcategory;
    return "".concat(subcategory, " \u00B7 ").concat(name);
}
function clearExpenseCheckin(row) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    existing = expenseCheckinsByEntryId.value[row.entry.id];
                    if (!existing)
                        return [2 /*return*/];
                    expenseExecutionBusyEntryId.value = row.entry.id;
                    expenseExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, api_1.coreApi.delete("/api/budget/annual-expense-checkins/".concat(existing.id, "/"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshExpenseExecutionData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_10 = _a.sent();
                    expenseExecutionError.value = (0, errors_1.toApiErrorMessage)(e_10);
                    return [3 /*break*/, 6];
                case 5:
                    expenseExecutionBusyEntryId.value = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function setExpenseAdjustAmountZero(row) {
    expenseAdjustAmounts.value[row.entry.id] = '0.00';
}
function setExpenseAdjustAmountPlanned(row) {
    expenseAdjustAmounts.value[row.entry.id] = row.planned.toFixed(2);
}
function resetExpenseCheckinDraftValue(row, mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (mode === 'zero')
                        setExpenseAdjustAmountZero(row);
                    else
                        setExpenseAdjustAmountPlanned(row);
                    if (!expenseCheckinsByEntryId.value[row.entry.id]) return [3 /*break*/, 2];
                    return [4 /*yield*/, clearExpenseCheckin(row)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function saveExpenseCheckinFromInput(row) {
    return __awaiter(this, void 0, void 0, function () {
        var rawAdjusted, parsedAdjusted, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ensureExpenseAdjustAmountPrefilled(row);
                    rawAdjusted = String((_a = expenseAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim();
                    parsedAdjusted = parseDecimalInput(rawAdjusted);
                    if (parsedAdjusted == null) {
                        expenseExecutionError.value = 'Indica un importe valido para confirmar (por ejemplo 123,45).';
                        return [2 /*return*/];
                    }
                    expenseAdjustAmounts.value[row.entry.id] = parsedAdjusted.toFixed(2);
                    status = amountsEqualCents(parsedAdjusted, row.planned) ? 'confirmed' : 'adjusted';
                    return [4 /*yield*/, upsertExpenseCheckin(row, status)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onExpenseCheckinCheckboxToggle(row, checked) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!checked) return [3 /*break*/, 2];
                    return [4 /*yield*/, saveExpenseCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, clearExpenseCheckin(row)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onExpenseAdjustAmountBlur(row) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!expenseCheckinsByEntryId.value[row.entry.id])
                        return [2 /*return*/];
                    return [4 /*yield*/, saveExpenseCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function upsertExpenseCheckin(row, status) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, draftAmount, payload, e_11;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    expenseExecutionError.value = null;
                    expenseExecutionBusyEntryId.value = row.entry.id;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    existing = expenseCheckinsByEntryId.value[row.entry.id];
                    draftAmount = String((_a = expenseAdjustAmounts.value[row.entry.id]) !== null && _a !== void 0 ? _a : '').trim();
                    payload = {
                        annual_expense_entry_id: row.entry.id,
                        fiscal_year: fiscalYear.value,
                        month: selectedExecutionMonth.value,
                        status: status,
                        executed_amount: draftAmount || null,
                    };
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, api_1.coreApi.patch("/api/budget/annual-expense-checkins/".concat(existing.id, "/"), payload)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, api_1.coreApi.post('/api/budget/annual-expense-checkins/', payload)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [4 /*yield*/, refreshExpenseExecutionData()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e_11 = _b.sent();
                    expenseExecutionError.value = (0, errors_1.toApiErrorMessage)(e_11);
                    return [3 /*break*/, 9];
                case 8:
                    expenseExecutionBusyEntryId.value = null;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function shortLiquiditySubcategoryLabel(subcategory) {
    if (subcategory === 'bank_account')
        return 'Cuenta bancaria';
    if (subcategory === 'short_term_deposit')
        return 'Deposito corto plazo';
    if (subcategory === 'wallet')
        return 'Monedero';
    if (subcategory === 'crypto_spot_earn')
        return 'Spot/Earn';
    return 'Liquidez';
}
function liquidityCheckinRowSummary(row) {
    return "".concat(shortLiquiditySubcategoryLabel(row.asset_subcategory), " \u00B7 ").concat(row.asset_name);
}
function suggestedLiquidityClosingBalanceForRow(row) {
    if (row.executed != null)
        return row.executed.toFixed(2);
    return row.planned.toFixed(2);
}
function ensureLiquidityAdjustAmountPrefilled(row) {
    var _a;
    var current = String((_a = liquidityAdjustAmounts.value[row.asset_id]) !== null && _a !== void 0 ? _a : '').trim();
    if (current)
        return;
    liquidityAdjustAmounts.value[row.asset_id] = suggestedLiquidityClosingBalanceForRow(row);
}
function loadLiquidityExecutionSummary() {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_12;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api_1.coreApi.get('/api/net-worth/liquidity/monthly-summary/', { params: { year: fiscalYear.value, month: selectedExecutionMonth.value } })];
                case 1:
                    response = _b.sent();
                    liquidityMonthlySummary.value = (_a = response.data) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 3];
                case 2:
                    e_12 = _b.sent();
                    liquidityExecutionError.value = (0, errors_1.toApiErrorMessage)(e_12);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function refreshLiquidityExecutionData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    liquidityExecutionLoading.value = true;
                    liquidityExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, loadLiquidityExecutionSummary()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    liquidityExecutionLoading.value = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function clearLiquidityCheckin(row) {
    return __awaiter(this, void 0, void 0, function () {
        var e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!row.checkin)
                        return [2 /*return*/];
                    liquidityExecutionBusyAssetId.value = row.asset_id;
                    liquidityExecutionError.value = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, api_1.coreApi.delete("/api/net-worth/liquidity-checkins/".concat(row.checkin.id, "/"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, refreshLiquidityExecutionData()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    e_13 = _a.sent();
                    liquidityExecutionError.value = (0, errors_1.toApiErrorMessage)(e_13);
                    return [3 /*break*/, 6];
                case 5:
                    liquidityExecutionBusyAssetId.value = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function setLiquidityAdjustAmountZero(row) {
    liquidityAdjustAmounts.value[row.asset_id] = '0.00';
}
function setLiquidityAdjustAmountPlanned(row) {
    liquidityAdjustAmounts.value[row.asset_id] = row.planned.toFixed(2);
}
function resetLiquidityCheckinDraftValue(row, mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (mode === 'zero')
                        setLiquidityAdjustAmountZero(row);
                    else
                        setLiquidityAdjustAmountPlanned(row);
                    if (!row.checkin) return [3 /*break*/, 2];
                    return [4 /*yield*/, clearLiquidityCheckin(row)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function upsertLiquidityCheckin(row, status) {
    return __awaiter(this, void 0, void 0, function () {
        var rawAdjusted, parsedAdjusted, payload, e_14;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    liquidityExecutionError.value = null;
                    liquidityExecutionBusyAssetId.value = row.asset_id;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, 8, 9]);
                    rawAdjusted = String((_a = liquidityAdjustAmounts.value[row.asset_id]) !== null && _a !== void 0 ? _a : '').trim();
                    parsedAdjusted = parseDecimalInput(rawAdjusted);
                    if (parsedAdjusted == null) {
                        liquidityExecutionError.value =
                            'Indica un saldo válido para confirmar (por ejemplo 1234,56).';
                        return [2 /*return*/];
                    }
                    liquidityAdjustAmounts.value[row.asset_id] = parsedAdjusted.toFixed(2);
                    payload = {
                        asset_id: row.asset_id,
                        fiscal_year: fiscalYear.value,
                        month: selectedExecutionMonth.value,
                        status: status,
                        closing_balance_real: parsedAdjusted.toFixed(2),
                    };
                    if (!row.checkin) return [3 /*break*/, 3];
                    return [4 /*yield*/, api_1.coreApi.patch("/api/net-worth/liquidity-checkins/".concat(row.checkin.id, "/"), payload)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, api_1.coreApi.post('/api/net-worth/liquidity-checkins/', payload)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5: return [4 /*yield*/, refreshLiquidityExecutionData()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e_14 = _b.sent();
                    liquidityExecutionError.value = (0, errors_1.toApiErrorMessage)(e_14);
                    return [3 /*break*/, 9];
                case 8:
                    liquidityExecutionBusyAssetId.value = null;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function saveLiquidityCheckinFromInput(row) {
    return __awaiter(this, void 0, void 0, function () {
        var rawAdjusted, parsedAdjusted, status;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ensureLiquidityAdjustAmountPrefilled(row);
                    rawAdjusted = String((_a = liquidityAdjustAmounts.value[row.asset_id]) !== null && _a !== void 0 ? _a : '').trim();
                    parsedAdjusted = parseDecimalInput(rawAdjusted);
                    if (parsedAdjusted == null) {
                        liquidityExecutionError.value = 'Indica un saldo válido para confirmar (por ejemplo 1234,56).';
                        return [2 /*return*/];
                    }
                    status = amountsEqualCents(parsedAdjusted, row.planned) ? 'confirmed' : 'adjusted';
                    return [4 /*yield*/, upsertLiquidityCheckin(row, status)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onLiquidityCheckinCheckboxToggle(row, checked) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!checked) return [3 /*break*/, 2];
                    return [4 /*yield*/, saveLiquidityCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, clearLiquidityCheckin(row)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onLiquidityAdjustAmountBlur(row) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!row.checkin)
                        return [2 /*return*/];
                    return [4 /*yield*/, saveLiquidityCheckinFromInput(row)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, vue_1.watch)(monthlyIncomeExecutionEntries, function (rows) {
    for (var _i = 0, rows_3 = rows; _i < rows_3.length; _i++) {
        var row = rows_3[_i];
        ensureIncomeAdjustAmountPrefilled(row);
    }
}, { immediate: true });
(0, vue_1.watch)(monthlyExpenseExecutionEntries, function (rows) {
    for (var _i = 0, rows_4 = rows; _i < rows_4.length; _i++) {
        var row = rows_4[_i];
        ensureExpenseAdjustAmountPrefilled(row);
    }
}, { immediate: true });
(0, vue_1.watch)(monthlyLiquidityExecutionRows, function (rows) {
    for (var _i = 0, rows_5 = rows; _i < rows_5.length; _i++) {
        var row = rows_5[_i];
        ensureLiquidityAdjustAmountPrefilled(row);
    }
}, { immediate: true });
(0, vue_1.watch)(fiscalYear, function (year) {
    void Promise.all([
        refreshBudgetData(year),
        refreshBudgetSuggestionData(),
        refreshAccountingExecutionData(),
        refreshIncomeExecutionData(),
        refreshExpenseExecutionData(),
        refreshLiquidityExecutionData(),
    ]);
}, { immediate: true });
(0, vue_1.watch)(selectedExecutionMonth, function () {
    void Promise.all([
        refreshAccountingExecutionData(),
        loadIncomeCheckinsForSelectedMonth(),
        loadExpenseCheckinsForSelectedMonth(),
        refreshLiquidityExecutionData(),
    ]);
});
(0, vue_1.watch)(isMonthlyCloseView, function (enabled) {
    if (enabled)
        activeMonthlyCloseStep.value = 'liq';
}, { immediate: true });
var __VLS_defaults = {
    mode: 'budget',
};
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-col']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-col']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-col']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-flow']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-headline']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-year-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-owner-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-owner-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-year-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-owner-picker']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-value']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-main']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-main']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-rows']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-execution-note']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-adjust']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-kpis']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-adjust']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-checkin-quick-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-total']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-total']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-detail-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-evolution-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-evolution-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row-metric']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-group-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-kpis']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-hero-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-evolution-head']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-group-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-header-side']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-section-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-detail-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-suggestions-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-filter-segment']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-kpi']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-residual-kpis']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-evolution-bars']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-month-rail']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row-metrics']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-budget-row-metric']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container ui-pro-page relative" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
var __VLS_0 = BudgetHeroSection_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    isMonthlyCloseView: (__VLS_ctx.isMonthlyCloseView),
    monthLabels: (__VLS_ctx.monthLabels),
    selectedExecutionMonth: (__VLS_ctx.selectedExecutionMonth),
    selectedOwnershipFilterLabel: (__VLS_ctx.selectedOwnershipFilterLabel),
    ownershipFilter: (__VLS_ctx.ownershipFilter),
    ownershipOptions: (__VLS_ctx.ownershipOptions),
    selectedFiscalYearLabel: (__VLS_ctx.selectedFiscalYearLabel),
    fiscalYear: (__VLS_ctx.fiscalYear),
    fiscalYearOptions: (__VLS_ctx.fiscalYearOptions),
    isLoading: (__VLS_ctx.isLoading),
    monthlyCloseFlowSteps: (__VLS_ctx.monthlyCloseFlowSteps),
    activeMonthlyCloseStep: (__VLS_ctx.activeMonthlyCloseStep),
    budgetSuggestionsLoading: (__VLS_ctx.budgetSuggestionsLoading),
    budgetSuggestionsError: (__VLS_ctx.budgetSuggestionsError),
    budgetSuggestions: (__VLS_ctx.budgetSuggestions),
    incomeBudgetSuggestions: (__VLS_ctx.incomeBudgetSuggestions),
    expenseBudgetSuggestions: (__VLS_ctx.expenseBudgetSuggestions),
    plannedIncomeTotal: (__VLS_ctx.plannedIncomeTotal),
    plannedExpenseTotal: (__VLS_ctx.plannedExpenseTotal),
    plannedBalanceTotal: (__VLS_ctx.plannedBalanceTotal),
    executionStatusLabel: (__VLS_ctx.executionStatusLabel),
    executionStatusDetail: (__VLS_ctx.executionStatusDetail),
    activeViewSummary: (__VLS_ctx.activeViewSummary),
    incomeViewMode: (__VLS_ctx.incomeViewMode),
    expenseViewMode: (__VLS_ctx.expenseViewMode),
    formatMoney: (__VLS_ctx.formatMoney),
    formatPercent: (__VLS_ctx.formatPercent),
    viewModeLabel: (__VLS_ctx.viewModeLabel),
    setActiveMonthlyCloseStep: (__VLS_ctx.setActiveMonthlyCloseStep),
    updateSelectedExecutionMonth: (__VLS_ctx.updateSelectedExecutionMonth),
    selectOwnershipFilterOption: (__VLS_ctx.selectOwnershipFilterOption),
    selectFiscalYearOption: (__VLS_ctx.selectFiscalYearOption),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        isMonthlyCloseView: (__VLS_ctx.isMonthlyCloseView),
        monthLabels: (__VLS_ctx.monthLabels),
        selectedExecutionMonth: (__VLS_ctx.selectedExecutionMonth),
        selectedOwnershipFilterLabel: (__VLS_ctx.selectedOwnershipFilterLabel),
        ownershipFilter: (__VLS_ctx.ownershipFilter),
        ownershipOptions: (__VLS_ctx.ownershipOptions),
        selectedFiscalYearLabel: (__VLS_ctx.selectedFiscalYearLabel),
        fiscalYear: (__VLS_ctx.fiscalYear),
        fiscalYearOptions: (__VLS_ctx.fiscalYearOptions),
        isLoading: (__VLS_ctx.isLoading),
        monthlyCloseFlowSteps: (__VLS_ctx.monthlyCloseFlowSteps),
        activeMonthlyCloseStep: (__VLS_ctx.activeMonthlyCloseStep),
        budgetSuggestionsLoading: (__VLS_ctx.budgetSuggestionsLoading),
        budgetSuggestionsError: (__VLS_ctx.budgetSuggestionsError),
        budgetSuggestions: (__VLS_ctx.budgetSuggestions),
        incomeBudgetSuggestions: (__VLS_ctx.incomeBudgetSuggestions),
        expenseBudgetSuggestions: (__VLS_ctx.expenseBudgetSuggestions),
        plannedIncomeTotal: (__VLS_ctx.plannedIncomeTotal),
        plannedExpenseTotal: (__VLS_ctx.plannedExpenseTotal),
        plannedBalanceTotal: (__VLS_ctx.plannedBalanceTotal),
        executionStatusLabel: (__VLS_ctx.executionStatusLabel),
        executionStatusDetail: (__VLS_ctx.executionStatusDetail),
        activeViewSummary: (__VLS_ctx.activeViewSummary),
        incomeViewMode: (__VLS_ctx.incomeViewMode),
        expenseViewMode: (__VLS_ctx.expenseViewMode),
        formatMoney: (__VLS_ctx.formatMoney),
        formatPercent: (__VLS_ctx.formatPercent),
        viewModeLabel: (__VLS_ctx.viewModeLabel),
        setActiveMonthlyCloseStep: (__VLS_ctx.setActiveMonthlyCloseStep),
        updateSelectedExecutionMonth: (__VLS_ctx.updateSelectedExecutionMonth),
        selectOwnershipFilterOption: (__VLS_ctx.selectOwnershipFilterOption),
        selectFiscalYearOption: (__VLS_ctx.selectFiscalYearOption),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
if (!__VLS_ctx.isMonthlyCloseView && __VLS_ctx.firstError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.firstError);
}
if (!__VLS_ctx.isMonthlyCloseView && __VLS_ctx.expenseExecutionError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.expenseExecutionError);
}
if (!__VLS_ctx.isMonthlyCloseView && __VLS_ctx.liquidityExecutionError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.liquidityExecutionError);
}
if (__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-checkin mt-3" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.isMonthlyCloseView) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-monthly-close-step-headline" }));
        /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-headline']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                    return;
                if (!(__VLS_ctx.isMonthlyCloseView))
                    return;
                __VLS_ctx.goToPreviousMonthlyCloseStep();
                // @ts-ignore
                [isMonthlyCloseView, isMonthlyCloseView, isMonthlyCloseView, isMonthlyCloseView, isMonthlyCloseView, isMonthlyCloseView, monthLabels, selectedExecutionMonth, selectedOwnershipFilterLabel, ownershipFilter, ownershipOptions, selectedFiscalYearLabel, fiscalYear, fiscalYearOptions, isLoading, monthlyCloseFlowSteps, activeMonthlyCloseStep, activeMonthlyCloseStep, budgetSuggestionsLoading, budgetSuggestionsError, budgetSuggestions, incomeBudgetSuggestions, expenseBudgetSuggestions, plannedIncomeTotal, plannedExpenseTotal, plannedBalanceTotal, executionStatusLabel, executionStatusDetail, activeViewSummary, incomeViewMode, expenseViewMode, formatMoney, formatPercent, viewModeLabel, setActiveMonthlyCloseStep, updateSelectedExecutionMonth, selectOwnershipFilterOption, selectFiscalYearOption, firstError, firstError, expenseExecutionError, expenseExecutionError, liquidityExecutionError, liquidityExecutionError, goToPreviousMonthlyCloseStep,];
            } }, { type: "button" }), { class: "btn ui-monthly-close-step-nav-btn" }));
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-budget-checkin-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                    return;
                if (!(__VLS_ctx.isMonthlyCloseView))
                    return;
                __VLS_ctx.goToNextMonthlyCloseStep();
                // @ts-ignore
                [goToNextMonthlyCloseStep,];
            } }, { type: "button" }), { class: "btn ui-monthly-close-step-nav-btn" }));
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-budget-checkin-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-checkin-subtitle ui-budget-checkin-subtitle-note" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle-note']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-checkin-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ ;
    if (!__VLS_ctx.isMonthlyCloseView) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-controls" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-controls']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ value: (__VLS_ctx.selectedExecutionMonth) }, { class: "select ui-data-field" }), { disabled: (__VLS_ctx.expenseExecutionLoading) }));
        /** @type {__VLS_StyleScopedClasses['select']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
        for (var _i = 0, _4 = __VLS_vFor((__VLS_ctx.monthLabels)); _i < _4.length; _i++) {
            var _5 = _4[_i], label = _5[0], index = _5[1];
            __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
                key: (label),
                value: (index + 1),
            });
            (label);
            // @ts-ignore
            [isMonthlyCloseView, monthLabels, selectedExecutionMonth, expenseExecutionLoading,];
        }
    }
    if (__VLS_ctx.expenseMonthlySummary) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-summary-grid" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-summary-grid']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedExpenseMonthPlanned));
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedExpenseMonthExecuted));
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }, { class: ({
                'ui-budget-checkin-kpi-danger': __VLS_ctx.selectedExpenseMonthDeviation > 0,
                'ui-budget-checkin-kpi-good': __VLS_ctx.selectedExpenseMonthDeviation < 0,
            }) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.selectedExpenseMonthDeviation > 0 ? '+' : '');
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedExpenseMonthDeviation));
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.formatPercent(__VLS_ctx.monthlyExpenseCoverageSummary.ratio, 0));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-list" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-list']} */ ;
    if (__VLS_ctx.expenseExecutionLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else if (!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-groups-box" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-groups-box']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-note" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-note-main" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.monthlyExpenseCoverageSummary.viaLedger);
        (__VLS_ctx.monthlyExpenseCoverageSummary.viaFallback);
        (__VLS_ctx.monthlyExpenseCoverageSummary.pending);
        __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)(__assign({ class: "ui-budget-execution-note-detail" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note-detail']} */ ;
        (__VLS_ctx.monthlyExpenseCoverageDetail);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-execution-badge" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-badge']} */ ;
        (__VLS_ctx.monthlyExpenseCoverageLabel);
        if (__VLS_ctx.monthlyExpensePendingClassification.amount > 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-state-block ui-state-error" }));
            /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-state-error']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(__VLS_ctx.monthlyExpensePendingClassification.amount));
            if (__VLS_ctx.monthlyExpensePendingClassification.ambiguousRows > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
                (__VLS_ctx.monthlyExpensePendingClassification.ambiguousRows);
            }
        }
        for (var _6 = 0, _7 = __VLS_vFor((__VLS_ctx.groupedMonthlyExpenseExecutionEntries)); _6 < _7.length; _6++) {
            var group = _7[_6][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign(__assign({ key: ("expense-checkin-group-".concat(group.categoryKey)) }, { class: "ui-budget-checkin-group" }), { open: true }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign({ class: "ui-budget-checkin-group-summary" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-summary']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-title-wrap" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title-wrap']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-budget-checkin-group-title" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title']} */ ;
            (group.categoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-group-meta" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-meta']} */ ;
            (group.rows.length);
            (Math.round(group.completionRatio * 100));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-kpis" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-kpis']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.plannedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.executedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                    'ui-budget-checkin-group-dev-pos': group.deviation > 0,
                    'ui-budget-checkin-group-dev-neg': group.deviation < 0,
                }) }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
            (group.deviation > 0 ? '+' : '');
            (__VLS_ctx.formatMoney(group.deviation));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-rows" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-rows']} */ ;
            var _loop_1 = function (row) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: ("expense-checkin-".concat(row.entry.id)) }, { class: "ui-budget-checkin-row" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-main" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-main']} */ ;
                if (row.executionSource !== 'none') {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-chip" }, { class: ({
                            'ui-budget-execution-chip-ledger': row.executionOrigin === 'categorized_ledger',
                        }) }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-execution-chip']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-budget-execution-chip-ledger']} */ ;
                    (__VLS_ctx.executionSourceLabel(row.executionOrigin));
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-title" }, { title: (__VLS_ctx.expenseCheckinRowSummary(row)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-title']} */ ;
                (__VLS_ctx.expenseCheckinRowSummary(row));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-planned" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-planned']} */ ;
                (__VLS_ctx.formatMoney(row.planned));
                if (row.entry.expenseType === 'one_off') {
                }
                if (row.executionOrigin === 'categorized_ledger' ||
                    row.executionOrigin === 'legacy_ledger' ||
                    row.executionOrigin === 'ambiguous_taxonomy') {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-state" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                    (__VLS_ctx.executionSourceLabel(row.executionOrigin));
                    if (row.executed != null) {
                        (__VLS_ctx.formatMoney(row.executed));
                    }
                    if (row.executionOrigin === 'categorized_ledger' ||
                        row.executionOrigin === 'legacy_ledger') {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-lock-note" }));
                        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-lock-note']} */ ;
                    }
                    else {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-lock-note" }));
                        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-lock-note']} */ ;
                    }
                }
                if (row.checkin) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-state" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                    (__VLS_ctx.checkinStatusLabel(row.checkin.status));
                    if (row.checkin.status !== 'skipped' && row.executed != null) {
                        (__VLS_ctx.formatMoney(row.executed));
                    }
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-actions" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-actions']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-adjust" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-adjust']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-quick-actions" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-quick-actions']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.resetExpenseCheckinDraftValue(row, 'zero');
                        // @ts-ignore
                        [formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatPercent, expenseExecutionLoading, expenseMonthlySummary, selectedExpenseMonthPlanned, selectedExpenseMonthExecuted, selectedExpenseMonthDeviation, selectedExpenseMonthDeviation, selectedExpenseMonthDeviation, selectedExpenseMonthDeviation, monthlyExpenseCoverageSummary, monthlyExpenseCoverageSummary, monthlyExpenseCoverageSummary, monthlyExpenseCoverageSummary, groupedMonthlyExpenseExecutionEntries, groupedMonthlyExpenseExecutionEntries, monthlyExpenseCoverageDetail, monthlyExpenseCoverageLabel, monthlyExpensePendingClassification, monthlyExpensePendingClassification, monthlyExpensePendingClassification, monthlyExpensePendingClassification, executionSourceLabel, executionSourceLabel, expenseCheckinRowSummary, expenseCheckinRowSummary, checkinStatusLabel, resetExpenseCheckinDraftValue,];
                    } }, { type: "button" }), { class: "btn ui-budget-checkin-mini-btn" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.expenseExecutionBusyEntryId === row.entry.id), title: "Poner importe ejecutado a 0" }));
                /** @type {__VLS_StyleScopedClasses['btn']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.resetExpenseCheckinDraftValue(row, 'planned');
                        // @ts-ignore
                        [resetExpenseCheckinDraftValue, isLockedExecutionRow, expenseExecutionBusyEntryId,];
                    } }, { type: "button" }), { class: "btn ui-budget-checkin-mini-btn" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.expenseExecutionBusyEntryId === row.entry.id), title: "Restaurar importe previsto del mes" }));
                /** @type {__VLS_StyleScopedClasses['btn']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign(__assign(__assign(__assign({ onFocus: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.ensureExpenseAdjustAmountPrefilled(row);
                        // @ts-ignore
                        [isLockedExecutionRow, expenseExecutionBusyEntryId, ensureExpenseAdjustAmountPrefilled,];
                    } }, { onBlur: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.onExpenseAdjustAmountBlur(row);
                        // @ts-ignore
                        [onExpenseAdjustAmountBlur,];
                    } }), { onKeydown: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.saveExpenseCheckinFromInput(row);
                        // @ts-ignore
                        [saveExpenseCheckinFromInput,];
                    } }), { inputmode: "decimal" }), { class: "input ui-data-field" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row)), placeholder: "Importe ejecutado" }));
                (__VLS_ctx.expenseAdjustAmounts[row.entry.id]);
                /** @type {__VLS_StyleScopedClasses['input']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-budget-checkin-confirm" }, { title: "Confirmar check-in del mes" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-confirm']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ onChange: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'expense'))
                            return;
                        if (!!(__VLS_ctx.expenseExecutionLoading))
                            return;
                        if (!!(!__VLS_ctx.groupedMonthlyExpenseExecutionEntries.length))
                            return;
                        __VLS_ctx.onExpenseCheckinCheckboxToggle(row, Boolean($event.target.checked));
                        // @ts-ignore
                        [isLockedExecutionRow, expenseAdjustAmounts, onExpenseCheckinCheckboxToggle,];
                    } }, { type: "checkbox", checked: (row.executionSource !== 'none'), disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.expenseExecutionBusyEntryId === row.entry.id), 'aria-label': "Confirmar check-in del mes" }));
                // @ts-ignore
                [isLockedExecutionRow, expenseExecutionBusyEntryId,];
            };
            for (var _8 = 0, _9 = __VLS_vFor((group.rows)); _8 < _9.length; _8++) {
                var row = _9[_8][0];
                _loop_1(row);
            }
            // @ts-ignore
            [];
        }
    }
}
var __VLS_5 = BudgetMonthlyCloseLiquiditySection_vue_1.default;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    isMonthlyCloseView: (__VLS_ctx.isMonthlyCloseView),
    activeMonthlyCloseStep: (__VLS_ctx.activeMonthlyCloseStep),
    previousMonthlyCloseStep: (__VLS_ctx.previousMonthlyCloseStep),
    monthLabels: (__VLS_ctx.monthLabels),
    selectedExecutionMonth: (__VLS_ctx.selectedExecutionMonth),
    liquidityMonthlySummary: (__VLS_ctx.liquidityMonthlySummary),
    liquidityExecutionLoading: (__VLS_ctx.liquidityExecutionLoading),
    liquidityExecutionBusyAssetId: (__VLS_ctx.liquidityExecutionBusyAssetId),
    monthlyLiquidityExecutionRows: (__VLS_ctx.monthlyLiquidityExecutionRows),
    selectedLiquidityMonthPlanned: (__VLS_ctx.selectedLiquidityMonthPlanned),
    selectedLiquidityMonthExecuted: (__VLS_ctx.selectedLiquidityMonthExecuted),
    selectedLiquidityMonthDeviation: (__VLS_ctx.selectedLiquidityMonthDeviation),
    liquidityAdjustAmounts: (__VLS_ctx.liquidityAdjustAmounts),
    formatMoney: (__VLS_ctx.formatMoney),
    formatPercent: (__VLS_ctx.formatPercent),
    checkinStatusLabel: (__VLS_ctx.checkinStatusLabel),
    liquidityCheckinRowSummary: (__VLS_ctx.liquidityCheckinRowSummary),
    goToPreviousMonthlyCloseStep: (__VLS_ctx.goToPreviousMonthlyCloseStep),
    goToNextMonthlyCloseStep: (__VLS_ctx.goToNextMonthlyCloseStep),
    updateSelectedExecutionMonth: (__VLS_ctx.updateSelectedExecutionMonth),
    resetLiquidityCheckinDraftValue: (__VLS_ctx.resetLiquidityCheckinDraftValue),
    ensureLiquidityAdjustAmountPrefilled: (__VLS_ctx.ensureLiquidityAdjustAmountPrefilled),
    onLiquidityAdjustAmountBlur: (__VLS_ctx.onLiquidityAdjustAmountBlur),
    saveLiquidityCheckinFromInput: (__VLS_ctx.saveLiquidityCheckinFromInput),
    onLiquidityCheckinCheckboxToggle: (__VLS_ctx.onLiquidityCheckinCheckboxToggle),
}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
        isMonthlyCloseView: (__VLS_ctx.isMonthlyCloseView),
        activeMonthlyCloseStep: (__VLS_ctx.activeMonthlyCloseStep),
        previousMonthlyCloseStep: (__VLS_ctx.previousMonthlyCloseStep),
        monthLabels: (__VLS_ctx.monthLabels),
        selectedExecutionMonth: (__VLS_ctx.selectedExecutionMonth),
        liquidityMonthlySummary: (__VLS_ctx.liquidityMonthlySummary),
        liquidityExecutionLoading: (__VLS_ctx.liquidityExecutionLoading),
        liquidityExecutionBusyAssetId: (__VLS_ctx.liquidityExecutionBusyAssetId),
        monthlyLiquidityExecutionRows: (__VLS_ctx.monthlyLiquidityExecutionRows),
        selectedLiquidityMonthPlanned: (__VLS_ctx.selectedLiquidityMonthPlanned),
        selectedLiquidityMonthExecuted: (__VLS_ctx.selectedLiquidityMonthExecuted),
        selectedLiquidityMonthDeviation: (__VLS_ctx.selectedLiquidityMonthDeviation),
        liquidityAdjustAmounts: (__VLS_ctx.liquidityAdjustAmounts),
        formatMoney: (__VLS_ctx.formatMoney),
        formatPercent: (__VLS_ctx.formatPercent),
        checkinStatusLabel: (__VLS_ctx.checkinStatusLabel),
        liquidityCheckinRowSummary: (__VLS_ctx.liquidityCheckinRowSummary),
        goToPreviousMonthlyCloseStep: (__VLS_ctx.goToPreviousMonthlyCloseStep),
        goToNextMonthlyCloseStep: (__VLS_ctx.goToNextMonthlyCloseStep),
        updateSelectedExecutionMonth: (__VLS_ctx.updateSelectedExecutionMonth),
        resetLiquidityCheckinDraftValue: (__VLS_ctx.resetLiquidityCheckinDraftValue),
        ensureLiquidityAdjustAmountPrefilled: (__VLS_ctx.ensureLiquidityAdjustAmountPrefilled),
        onLiquidityAdjustAmountBlur: (__VLS_ctx.onLiquidityAdjustAmountBlur),
        saveLiquidityCheckinFromInput: (__VLS_ctx.saveLiquidityCheckinFromInput),
        onLiquidityCheckinCheckboxToggle: (__VLS_ctx.onLiquidityCheckinCheckboxToggle),
    }], __VLS_functionalComponentArgsRest(__VLS_6), false));
if (__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-checkin mt-3" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-monthly-close-step-headline" }));
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-headline']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                return;
            __VLS_ctx.goToPreviousMonthlyCloseStep();
            // @ts-ignore
            [isMonthlyCloseView, isMonthlyCloseView, monthLabels, selectedExecutionMonth, activeMonthlyCloseStep, activeMonthlyCloseStep, formatMoney, formatPercent, updateSelectedExecutionMonth, goToPreviousMonthlyCloseStep, goToPreviousMonthlyCloseStep, goToNextMonthlyCloseStep, checkinStatusLabel, previousMonthlyCloseStep, liquidityMonthlySummary, liquidityExecutionLoading, liquidityExecutionBusyAssetId, monthlyLiquidityExecutionRows, selectedLiquidityMonthPlanned, selectedLiquidityMonthExecuted, selectedLiquidityMonthDeviation, liquidityAdjustAmounts, liquidityCheckinRowSummary, resetLiquidityCheckinDraftValue, ensureLiquidityAdjustAmountPrefilled, onLiquidityAdjustAmountBlur, saveLiquidityCheckinFromInput, onLiquidityCheckinCheckboxToggle,];
        } }, { type: "button" }), { class: "btn ui-monthly-close-step-nav-btn" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-budget-checkin-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                return;
            __VLS_ctx.goToNextMonthlyCloseStep();
            // @ts-ignore
            [goToNextMonthlyCloseStep,];
        } }, { type: "button" }), { class: "btn ui-monthly-close-step-nav-btn" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-checkin-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-checkin-subtitle ui-budget-checkin-subtitle-note" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle-note']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-summary-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-summary-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthPlanned));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthExecuted));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }, { class: ({
            'ui-budget-checkin-kpi-good': __VLS_ctx.selectedIncomeMonthDeviation > 0,
            'ui-budget-checkin-kpi-danger': __VLS_ctx.selectedIncomeMonthDeviation < 0,
        }) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.selectedIncomeMonthDeviation > 0 ? '+' : '');
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthDeviation));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedIncomeMonthCompletionRatio, 0));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-list" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-list']} */ ;
    if (__VLS_ctx.incomeExecutionLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else if (__VLS_ctx.incomeExecutionError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle text-red-400" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
        (__VLS_ctx.incomeExecutionError);
    }
    else if (!__VLS_ctx.monthlyIncomeExecutionEntries.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-groups-box" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-groups-box']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-note" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-note-main" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.monthlyIncomeCoverageSummary.viaLedger);
        (__VLS_ctx.monthlyIncomeCoverageSummary.viaFallback);
        (__VLS_ctx.monthlyIncomeCoverageSummary.pending);
        __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)(__assign({ class: "ui-budget-execution-note-detail" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-note-detail']} */ ;
        (__VLS_ctx.monthlyIncomeCoverageDetail);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-execution-badge" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-execution-badge']} */ ;
        (__VLS_ctx.monthlyIncomeCoverageLabel);
        if (__VLS_ctx.monthlyIncomePendingClassification.amount > 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-state-block ui-state-error" }));
            /** @type {__VLS_StyleScopedClasses['ui-state-block']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-state-error']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(__VLS_ctx.monthlyIncomePendingClassification.amount));
            if (__VLS_ctx.monthlyIncomePendingClassification.ambiguousRows > 0) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
                (__VLS_ctx.monthlyIncomePendingClassification.ambiguousRows);
            }
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-summary" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-summary']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-title-wrap" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title-wrap']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-budget-checkin-group-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-group-meta" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-meta']} */ ;
        (__VLS_ctx.monthlyIncomeExecutionEntries.length);
        (__VLS_ctx.formatPercent(__VLS_ctx.selectedIncomeMonthCompletionRatio, 0));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-kpis" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-kpis']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthPlanned));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthExecuted));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                'ui-budget-checkin-group-dev-pos': __VLS_ctx.selectedIncomeMonthDeviation > 0,
                'ui-budget-checkin-group-dev-neg': __VLS_ctx.selectedIncomeMonthDeviation < 0,
            }) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
        (__VLS_ctx.selectedIncomeMonthDeviation > 0 ? '+' : '');
        (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthDeviation));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-group-rows" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-rows']} */ ;
        var _loop_2 = function (row) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: ("income-checkin-".concat(row.entry.id)) }, { class: "ui-budget-checkin-row" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-main" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-main']} */ ;
            if (row.executionSource !== 'none') {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-execution-chip" }, { class: ({
                        'ui-budget-execution-chip-ledger': row.executionOrigin === 'categorized_ledger',
                    }) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-execution-chip']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-execution-chip-ledger']} */ ;
                (__VLS_ctx.executionSourceLabel(row.executionOrigin));
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-title" }, { title: (__VLS_ctx.incomeCheckinRowSummary(row)) }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-title']} */ ;
            (__VLS_ctx.incomeCheckinRowSummary(row));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-planned" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-planned']} */ ;
            (__VLS_ctx.formatMoney(row.planned));
            if (row.executionOrigin === 'categorized_ledger' ||
                row.executionOrigin === 'legacy_ledger' ||
                row.executionOrigin === 'ambiguous_taxonomy') {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-state" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (__VLS_ctx.executionSourceLabel(row.executionOrigin));
                if (row.executed != null) {
                    (__VLS_ctx.formatMoney(row.executed));
                }
                if (row.executionOrigin === 'categorized_ledger' ||
                    row.executionOrigin === 'legacy_ledger') {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-lock-note" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-lock-note']} */ ;
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-checkin-row-lock-note" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-lock-note']} */ ;
                }
            }
            if (row.executionOrigin === 'legacy_checkin' && row.checkin) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-state" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-state']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (__VLS_ctx.checkinStatusLabel(row.checkin.status));
                if (row.checkin.status !== 'skipped' && row.executed != null) {
                    (__VLS_ctx.formatMoney(row.executed));
                }
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-row-actions" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-row-actions']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-adjust" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-adjust']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-quick-actions" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-quick-actions']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.resetIncomeCheckinDraftValue(row, 'zero');
                    // @ts-ignore
                    [formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatPercent, formatPercent, executionSourceLabel, executionSourceLabel, checkinStatusLabel, selectedIncomeMonthPlanned, selectedIncomeMonthPlanned, selectedIncomeMonthExecuted, selectedIncomeMonthExecuted, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthDeviation, selectedIncomeMonthCompletionRatio, selectedIncomeMonthCompletionRatio, incomeExecutionLoading, incomeExecutionError, incomeExecutionError, monthlyIncomeExecutionEntries, monthlyIncomeExecutionEntries, monthlyIncomeExecutionEntries, monthlyIncomeCoverageSummary, monthlyIncomeCoverageSummary, monthlyIncomeCoverageSummary, monthlyIncomeCoverageDetail, monthlyIncomeCoverageLabel, monthlyIncomePendingClassification, monthlyIncomePendingClassification, monthlyIncomePendingClassification, monthlyIncomePendingClassification, incomeCheckinRowSummary, incomeCheckinRowSummary, resetIncomeCheckinDraftValue,];
                } }, { type: "button" }), { class: "btn ui-budget-checkin-mini-btn" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.incomeExecutionBusyEntryId === row.entry.id) }));
            /** @type {__VLS_StyleScopedClasses['btn']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.resetIncomeCheckinDraftValue(row, 'planned');
                    // @ts-ignore
                    [isLockedExecutionRow, resetIncomeCheckinDraftValue, incomeExecutionBusyEntryId,];
                } }, { type: "button" }), { class: "btn ui-budget-checkin-mini-btn" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.incomeExecutionBusyEntryId === row.entry.id) }));
            /** @type {__VLS_StyleScopedClasses['btn']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-mini-btn']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign(__assign(__assign(__assign({ onFocus: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.ensureIncomeAdjustAmountPrefilled(row);
                    // @ts-ignore
                    [isLockedExecutionRow, incomeExecutionBusyEntryId, ensureIncomeAdjustAmountPrefilled,];
                } }, { onBlur: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.onIncomeAdjustAmountBlur(row);
                    // @ts-ignore
                    [onIncomeAdjustAmountBlur,];
                } }), { onKeydown: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.saveIncomeCheckinFromInput(row);
                    // @ts-ignore
                    [saveIncomeCheckinFromInput,];
                } }), { inputmode: "decimal" }), { class: "input ui-data-field" }), { disabled: (__VLS_ctx.isLockedExecutionRow(row)), placeholder: "Importe ejecutado" }));
            (__VLS_ctx.incomeAdjustAmounts[row.entry.id]);
            /** @type {__VLS_StyleScopedClasses['input']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-data-field']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-budget-checkin-confirm" }, { title: "Confirmar check-in del mes" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-confirm']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ onChange: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'income'))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionLoading))
                        return;
                    if (!!(__VLS_ctx.incomeExecutionError))
                        return;
                    if (!!(!__VLS_ctx.monthlyIncomeExecutionEntries.length))
                        return;
                    __VLS_ctx.onIncomeCheckinCheckboxToggle(row, Boolean($event.target.checked));
                    // @ts-ignore
                    [isLockedExecutionRow, incomeAdjustAmounts, onIncomeCheckinCheckboxToggle,];
                } }, { type: "checkbox", checked: (row.executionSource !== 'none'), disabled: (__VLS_ctx.isLockedExecutionRow(row) || __VLS_ctx.incomeExecutionBusyEntryId === row.entry.id) }));
            // @ts-ignore
            [isLockedExecutionRow, incomeExecutionBusyEntryId,];
        };
        for (var _10 = 0, _11 = __VLS_vFor((__VLS_ctx.monthlyIncomeExecutionEntries)); _10 < _11.length; _10++) {
            var row = _11[_10][0];
            _loop_2(row);
        }
    }
}
if (__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'result') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-checkin mt-3" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-monthly-close-step-headline" }));
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-headline']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isMonthlyCloseView && __VLS_ctx.activeMonthlyCloseStep === 'result'))
                return;
            __VLS_ctx.goToPreviousMonthlyCloseStep();
            // @ts-ignore
            [isMonthlyCloseView, activeMonthlyCloseStep, goToPreviousMonthlyCloseStep,];
        } }, { type: "button" }), { class: "btn ui-monthly-close-step-nav-btn" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-budget-checkin-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ type: "button" }, { class: "btn ui-monthly-close-step-nav-btn" }), { disabled: true }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-monthly-close-step-nav-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-checkin-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-subtitle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-checkin-summary-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-summary-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityStartBase));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedMonthlyCloseExpected));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthExecuted));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }, { class: ({
            'ui-budget-checkin-kpi-danger': __VLS_ctx.selectedMonthlyCloseResidual < 0,
            'ui-budget-checkin-kpi-good': __VLS_ctx.selectedMonthlyCloseResidual > 0,
        }) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-danger']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi-good']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.selectedMonthlyCloseResidual > 0 ? '+' : '');
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedMonthlyCloseResidual));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedIncomeMonthExecuted));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedExpenseMonthExecuted));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedMonthlyCloseCompletionRatio, 0));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-checkin-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.selectedLiquidityMonthDeviation > 0 ? '+' : '');
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedLiquidityMonthDeviation));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-grid" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-grid']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "ui-budget-result-card" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-budget-result-card-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-meta']} */ ;
    (__VLS_ctx.formatMoney(__VLS_ctx.selectedMonthlyExecutedVolume));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-recon-flow" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow']} */ ;
    for (var _12 = 0, _13 = __VLS_vFor((__VLS_ctx.resultReconciliationFlowRows)); _12 < _13.length; _12++) {
        var row = _13[_12][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (row.id) }, { class: "ui-budget-recon-flow-row" }), { class: ({
                'ui-budget-recon-flow-row-result': !!row.isResult,
                'ui-budget-recon-flow-row-positive': row.tone === 'positive',
                'ui-budget-recon-flow-row-warning': row.tone === 'warning',
                'ui-budget-recon-flow-row-negative': row.tone === 'negative',
            }) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row-result']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row-positive']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row-warning']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row-negative']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-recon-flow-row-main" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-row-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-recon-flow-label" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-label']} */ ;
        (row.label);
        if (row.meta) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-recon-flow-meta" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-meta']} */ ;
            (row.meta);
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-budget-recon-flow-value" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-recon-flow-value']} */ ;
        (__VLS_ctx.formatSignedMoney(row.amount));
        // @ts-ignore
        [formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatPercent, selectedExpenseMonthExecuted, selectedLiquidityMonthExecuted, selectedLiquidityMonthDeviation, selectedLiquidityMonthDeviation, selectedIncomeMonthExecuted, selectedLiquidityStartBase, selectedMonthlyCloseExpected, selectedMonthlyCloseResidual, selectedMonthlyCloseResidual, selectedMonthlyCloseResidual, selectedMonthlyCloseResidual, selectedMonthlyCloseCompletionRatio, selectedMonthlyExecutedVolume, resultReconciliationFlowRows, formatSignedMoney,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "ui-budget-result-card" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-budget-result-card-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-badge" }, { class: ("ui-budget-result-badge-".concat(__VLS_ctx.selectedMonthlyResidualSeverity)) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-badge']} */ ;
    (__VLS_ctx.selectedMonthlyResidualSeverityLabel);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-residual-kpis" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-residual-kpis']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatSignedMoney(__VLS_ctx.selectedMonthlyCloseResidual));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedMonthlyResidualVolumeRatio, 1));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedMonthlyResidualIncomeRatio, 1));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedMonthlyResidualExpenseRatio, 1));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatPercent(__VLS_ctx.selectedMonthlyResidualExpectedCloseRatio, 1));
    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "ui-budget-result-mini-kpi" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-mini-kpi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.selectedMonthlyCloseResidual < 0
        ? 'Falta caja vs explicado'
        : __VLS_ctx.selectedMonthlyCloseResidual > 0
            ? 'Sobra caja vs explicado'
            : 'Sin diferencia');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-composition" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition']} */ ;
    for (var _14 = 0, _15 = __VLS_vFor((__VLS_ctx.resultReconciliationCompositionRows)); _14 < _15.length; _14++) {
        var row = _15[_14][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (row.id) }, { class: "ui-budget-result-composition-row" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-row']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-composition-main" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-main']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (row.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
        (__VLS_ctx.formatSignedMoney(row.amount));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-composition-bar" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-bar']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-result-composition-fill" }, { class: ({
                'ui-budget-result-composition-fill-positive': row.tone === 'positive',
                'ui-budget-result-composition-fill-warning': row.tone === 'warning',
                'ui-budget-result-composition-fill-negative': row.tone === 'negative',
            }) }), { style: ({
                width: "".concat(row.shareOfVolume == null || row.shareOfVolume <= 0
                    ? 0
                    : Math.max(4, Math.min(100, row.shareOfVolume * 100)), "%"),
            }) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-fill']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-fill-positive']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-fill-warning']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-fill-negative']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-composition-share" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-composition-share']} */ ;
        (__VLS_ctx.formatPercent(row.shareOfVolume, 1));
        // @ts-ignore
        [formatPercent, formatPercent, formatPercent, formatPercent, formatPercent, selectedMonthlyCloseResidual, selectedMonthlyCloseResidual, selectedMonthlyCloseResidual, formatSignedMoney, formatSignedMoney, selectedMonthlyResidualSeverity, selectedMonthlyResidualSeverityLabel, selectedMonthlyResidualVolumeRatio, selectedMonthlyResidualIncomeRatio, selectedMonthlyResidualExpenseRatio, selectedMonthlyResidualExpectedCloseRatio, resultReconciliationCompositionRows,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-grid ui-budget-result-grid-detail" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-grid-detail']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "ui-budget-result-card" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-budget-result-card-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-meta']} */ ;
    (__VLS_ctx.monthlyIncomeExecutionEntries.length);
    if (!__VLS_ctx.monthlyIncomeResultBreakdown.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-list" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-list']} */ ;
        for (var _16 = 0, _17 = __VLS_vFor((__VLS_ctx.monthlyIncomeResultBreakdown)); _16 < _17.length; _16++) {
            var group = _17[_16][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: ("result-income-".concat(group.key)) }, { class: "ui-budget-result-breakdown-group" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-group-head" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-group-head']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
            (group.categoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-submeta" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-submeta']} */ ;
            (group.lineCount);
            (__VLS_ctx.formatPercent(group.completionRatio, 0));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-kpis" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-kpis']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.executedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.plannedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                    'ui-budget-checkin-group-dev-pos': group.deviation > 0,
                    'ui-budget-checkin-group-dev-neg': group.deviation < 0,
                }) }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
            (__VLS_ctx.formatSignedMoney(group.deviation));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatPercent(group.shareOfExecuted, 0));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-rows" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-rows']} */ ;
            for (var _18 = 0, _19 = __VLS_vFor((group.rows.slice(0, 5))); _18 < _19.length; _18++) {
                var row = _19[_18][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (row.key) }, { class: "ui-budget-result-breakdown-row" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-row']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-result-breakdown-name" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-name']} */ ;
                (row.subcategoryLabel);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatMoney(row.executedTotal));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatPercent(row.shareOfExecuted, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                        'ui-budget-checkin-group-dev-pos': row.deviation > 0,
                        'ui-budget-checkin-group-dev-neg': row.deviation < 0,
                    }) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
                (__VLS_ctx.formatSignedMoney(row.deviation));
                // @ts-ignore
                [formatMoney, formatMoney, formatMoney, formatPercent, formatPercent, formatPercent, monthlyIncomeExecutionEntries, formatSignedMoney, formatSignedMoney, monthlyIncomeResultBreakdown, monthlyIncomeResultBreakdown,];
            }
            if (group.rows.length > 5) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-more" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-more']} */ ;
                (group.rows.length - 5);
            }
            // @ts-ignore
            [];
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "ui-budget-result-card" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-budget-result-card-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-card-meta" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-result-card-meta']} */ ;
    (__VLS_ctx.monthlyExpenseExecutionEntries.length);
    if (!__VLS_ctx.monthlyExpenseResultBreakdown.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-list" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-list']} */ ;
        for (var _20 = 0, _21 = __VLS_vFor((__VLS_ctx.monthlyExpenseResultBreakdown)); _20 < _21.length; _20++) {
            var group = _21[_20][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: ("result-expense-".concat(group.key)) }, { class: "ui-budget-result-breakdown-group" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-group-head" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-group-head']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
            (group.categoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-submeta" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-submeta']} */ ;
            (group.lineCount);
            (__VLS_ctx.formatPercent(group.completionRatio, 0));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-kpis" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-kpis']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.executedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatMoney(group.plannedTotal));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                    'ui-budget-checkin-group-dev-pos': group.deviation > 0,
                    'ui-budget-checkin-group-dev-neg': group.deviation < 0,
                }) }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
            (__VLS_ctx.formatSignedMoney(group.deviation));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.formatPercent(group.shareOfExecuted, 0));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-rows" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-rows']} */ ;
            for (var _22 = 0, _23 = __VLS_vFor((group.rows.slice(0, 5))); _22 < _23.length; _22++) {
                var row = _23[_22][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (row.key) }, { class: "ui-budget-result-breakdown-row" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-row']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-result-breakdown-name" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-name']} */ ;
                (row.subcategoryLabel);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatMoney(row.executedTotal));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatPercent(row.shareOfExecuted, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ({
                        'ui-budget-checkin-group-dev-pos': row.deviation > 0,
                        'ui-budget-checkin-group-dev-neg': row.deviation < 0,
                    }) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-pos']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-checkin-group-dev-neg']} */ ;
                (__VLS_ctx.formatSignedMoney(row.deviation));
                // @ts-ignore
                [formatMoney, formatMoney, formatMoney, formatPercent, formatPercent, formatPercent, formatSignedMoney, formatSignedMoney, monthlyExpenseExecutionEntries, monthlyExpenseResultBreakdown, monthlyExpenseResultBreakdown,];
            }
            if (group.rows.length > 5) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-result-breakdown-more" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-result-breakdown-more']} */ ;
                (group.rows.length - 5);
            }
            // @ts-ignore
            [];
        }
    }
}
if (!__VLS_ctx.isMonthlyCloseView && !__VLS_ctx.hasAnyPlannedData && !__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-budget-empty mt-3" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-empty']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "mt-0" }));
    /** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
    (__VLS_ctx.fiscalYear);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle mb-0" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-0']} */ ;
    var __VLS_10 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    var __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10(__assign({ class: "ui-budget-empty-link" }, { to: "/introduccion-datos" })));
    var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ class: "ui-budget-empty-link" }, { to: "/introduccion-datos" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
    /** @type {__VLS_StyleScopedClasses['ui-budget-empty-link']} */ ;
    var __VLS_15 = __VLS_13.slots.default;
    // @ts-ignore
    [isMonthlyCloseView, fiscalYear, isLoading, hasAnyPlannedData,];
    var __VLS_13;
}
var _loop_3 = function (section) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign(__assign({ key: (section.id) }, { class: "card ui-pro-panel ui-budget-section mt-3" }), { class: (section.toneClass) }));
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, __assign(__assign({}, __VLS_directiveBindingRestFields), { value: (!__VLS_ctx.isMonthlyCloseView) }), null, null);
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-section']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-section-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-budget-section-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-title']} */ ;
    (section.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-budget-section-subtitle" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-subtitle']} */ ;
    (section.subtitle);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-section-header-side" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-header-side']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-section-controls" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-controls']} */ ;
    if (section.groups.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(section.groups.length))
                    return;
                __VLS_ctx.toggleSectionExpanded(section.id);
                // @ts-ignore
                [isMonthlyCloseView, sections, toggleSectionExpanded,];
            } }, { type: "button" }), { class: "ui-budget-detail-toggle" }), { 'aria-expanded': (__VLS_ctx.isSectionExpanded(section.id)) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-detail-toggle']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-detail-toggle-icon" }, { 'aria-hidden': "true" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-detail-toggle-icon']} */ ;
        (__VLS_ctx.isSectionExpanded(section.id) ? '−' : '+');
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.isSectionExpanded(section.id)
            ? 'Ocultar detalle'
            : "Ver detalle (".concat(section.categoryCount, " categorias \u00B7 ").concat(section.subcategoryCount, " subcategorias)"));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-filter-segment" }, { role: "tablist", 'aria-label': ("Filtro de ".concat(section.title)) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-segment']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            section.id === 'income' ? (__VLS_ctx.incomeViewMode = 'all') : (__VLS_ctx.expenseViewMode = 'all');
            // @ts-ignore
            [incomeViewMode, expenseViewMode, isSectionExpanded, isSectionExpanded, isSectionExpanded,];
        } }, { type: "button" }), { class: "ui-budget-filter-btn" }), { class: ({ 'ui-budget-filter-btn-active': section.filterMode === 'all' }) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            section.id === 'income'
                ? (__VLS_ctx.incomeViewMode = 'recurrent')
                : (__VLS_ctx.expenseViewMode = 'recurrent');
            // @ts-ignore
            [incomeViewMode, expenseViewMode,];
        } }, { type: "button" }), { class: "ui-budget-filter-btn" }), { class: ({ 'ui-budget-filter-btn-active': section.filterMode === 'recurrent' }) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            section.id === 'income'
                ? (__VLS_ctx.incomeViewMode = 'one_off')
                : (__VLS_ctx.expenseViewMode = 'one_off');
            // @ts-ignore
            [incomeViewMode, expenseViewMode,];
        } }, { type: "button" }), { class: "ui-budget-filter-btn" }), { class: ({ 'ui-budget-filter-btn-active': section.filterMode === 'one_off' }) }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-filter-btn-active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-section-total" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-section-total']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatMoney(section.totalAnnual));
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    (__VLS_ctx.formatMoney(section.totalAnnual / 12));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-evolution-card" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-evolution-card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-evolution-head" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-evolution-head']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    if (section.id === 'income') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-pill" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-pill']} */ ;
    (section.id === 'income' ? 'Cierre mensual activo' : 'Pendiente contabilidad');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-evolution-bars" }, { 'aria-label': (section.id === 'income'
            ? 'Barras de evolucion de ingresos previsto vs ejecutado por mes'
            : 'Placeholder de barras de evolucion') }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-evolution-bars']} */ ;
    for (var _26 = 0, _27 = __VLS_vFor((section.id === 'income'
        ? __VLS_ctx.incomeEvolutionMonths
        : __VLS_ctx.monthLabels.map(function (label) { return ({ label: label }); }))); _26 < _27.length; _26++) {
        var point = _27[_26][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: ("".concat(section.id, "-").concat(point.label)) }, { class: "ui-budget-month-col" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-month-col']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-month-rail" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-month-rail']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-month-plan" }, { style: (section.id === 'income' && 'planHeightPct' in point
                ? { height: "".concat(point.planHeightPct, "%") }
                : undefined) }), { title: (section.id === 'income' && 'planned' in point
                ? "Previsto ".concat(point.label, ": ").concat(__VLS_ctx.formatMoney(Number(point.planned)), " EUR")
                : undefined) }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-month-plan']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: (section.id === 'income' && 'hasExecuted' in point && point.hasExecuted
                ? 'ui-budget-month-exec'
                : 'ui-budget-month-exec-pending') }, { style: (section.id === 'income' && 'execHeightPct' in point
                ? { height: "".concat(point.execHeightPct, "%") }
                : undefined) }), { title: (section.id === 'income' && 'executed' in point
                ? "Ejecutado ".concat(point.label, ": ").concat(__VLS_ctx.formatMoney(Number(point.executed)), " EUR")
                : undefined) }));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-month-label" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-month-label']} */ ;
        (point.label);
        // @ts-ignore
        [monthLabels, formatMoney, formatMoney, formatMoney, formatMoney, incomeEvolutionMonths,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-evolution-legend" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-evolution-legend']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)(__assign({ class: "ui-budget-legend-dot ui-budget-legend-plan" }));
    /** @type {__VLS_StyleScopedClasses['ui-budget-legend-dot']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-budget-legend-plan']} */ ;
    if (section.id === 'income') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)(__assign({ class: "ui-budget-legend-dot ui-budget-legend-exec-solid" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-legend-dot']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-legend-exec-solid']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)(__assign({ class: "ui-budget-legend-dot ui-budget-legend-exec" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-legend-dot']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-budget-legend-exec']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (section.id === 'income' ? 'Base recurrente mensual:' : 'Base mensual orientativa:');
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.formatCompactMoney(section.id === 'income' ? __VLS_ctx.incomeEvolutionBaseMonthly : section.totalAnnual / 12));
    if (section.groups.length && __VLS_ctx.isSectionExpanded(section.id)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-groups" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-groups']} */ ;
        for (var _28 = 0, _29 = __VLS_vFor((section.groups)); _28 < _29.length; _28++) {
            var group = _29[_28][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: ("".concat(section.id, "-").concat(group.categoryKey)) }, { class: "ui-budget-group" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-group']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "ui-budget-group-header" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-group-header']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-group-title-wrap" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-group-title-wrap']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-group-kicker" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-group-kicker']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
            (group.categoryLabel);
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
            (group.rows.length);
            (__VLS_ctx.formatPercent(group.shareOfSection, 0));
            (section.title.toLowerCase());
            if (__VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress" }, { 'aria-label': ("Ejecucion YTD categoria ".concat(group.categoryLabel)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-labels" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-labels']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.selectedExecutionMonthLabel);
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.formatPercent((_b = (_a = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _a === void 0 ? void 0 : _a.completionRatio) !== null && _b !== void 0 ? _b : null, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-preview-pill" }, { class: ("ui-budget-inline-progress-preview-pill-".concat((_c = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _c === void 0 ? void 0 : _c.tone)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-preview-pill']} */ ;
                (__VLS_ctx.formatPercent((_e = (_d = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _d === void 0 ? void 0 : _d.ratio) !== null && _e !== void 0 ? _e : null, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-track ui-budget-inline-progress-track-lg" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track-lg']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-inline-progress-fill" }, { class: ("ui-budget-inline-progress-fill-".concat((_f = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _f === void 0 ? void 0 : _f.tone)) }), { style: ({
                        width: "".concat((_h = (_g = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _g === void 0 ? void 0 : _g.widthPct) !== null && _h !== void 0 ? _h : 8, "%"),
                    }) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-fill']} */ ;
                if ((_j = __VLS_ctx.budgetCategoryActualExecution(section.id, group.categoryKey)) === null || _j === void 0 ? void 0 : _j.overflow) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-overflow-marker" }, { 'aria-hidden': "true" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-overflow-marker']} */ ;
                }
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress" }, { 'aria-label': "Placeholder ejecucion categoria" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-labels" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-labels']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-preview-pill" }, { class: ("ui-budget-inline-progress-preview-pill-".concat(__VLS_ctx.executionPreview(section.id, "group:".concat(group.categoryKey)).tone)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-preview-pill']} */ ;
                (__VLS_ctx.formatPercent(__VLS_ctx.executionPreview(section.id, "group:".concat(group.categoryKey)).ratio, 0));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-track ui-budget-inline-progress-track-lg" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track']} */ ;
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track-lg']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-inline-progress-fill" }, { class: ("ui-budget-inline-progress-fill-".concat(__VLS_ctx.executionPreview(section.id, "group:".concat(group.categoryKey)).tone)) }), { style: ({
                        width: "".concat(__VLS_ctx.executionPreview(section.id, "group:".concat(group.categoryKey)).widthPct, "%"),
                    }) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-fill']} */ ;
                if (__VLS_ctx.executionPreview(section.id, "group:".concat(group.categoryKey)).overflow) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-overflow-marker" }, { 'aria-hidden': "true" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-overflow-marker']} */ ;
                }
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-group-amount" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-group-amount']} */ ;
            (__VLS_ctx.formatMoney(group.plannedAnnual));
            __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "ui-budget-rows" }));
            /** @type {__VLS_StyleScopedClasses['ui-budget-rows']} */ ;
            for (var _30 = 0, _31 = __VLS_vFor((group.rows)); _30 < _31.length; _30++) {
                var row = _31[_30][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)(__assign({ key: (row.key) }, { class: "ui-budget-row" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-main" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-main']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-kicker" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-kicker']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-title" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-title']} */ ;
                (row.subcategoryLabel);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-meta" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-meta']} */ ;
                (row.itemsCount);
                (row.itemsCount === 1 ? '' : 's');
                (__VLS_ctx.formatMoney(row.plannedAnnual / 12));
                if (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress ui-budget-inline-progress-row" }, { 'aria-label': ("Ejecucion YTD subcategoria ".concat(row.subcategoryLabel)) }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-row']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-track" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-inline-progress-fill" }, { class: ("ui-budget-inline-progress-fill-".concat((_k = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _k === void 0 ? void 0 : _k.tone)) }), { style: ({
                            width: "".concat((_m = (_l = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _l === void 0 ? void 0 : _l.widthPct) !== null && _m !== void 0 ? _m : 8, "%"),
                        }) }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-fill']} */ ;
                    if ((_o = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _o === void 0 ? void 0 : _o.overflow) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-overflow-marker" }, { 'aria-hidden': "true" }));
                        /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-overflow-marker']} */ ;
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-caption" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-caption']} */ ;
                    (__VLS_ctx.selectedExecutionMonthLabel);
                    (__VLS_ctx.formatPercent((_q = (_p = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _p === void 0 ? void 0 : _p.completionRatio) !== null && _q !== void 0 ? _q : null, 0));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ("ui-budget-inline-progress-caption-tone-".concat((_r = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _r === void 0 ? void 0 : _r.tone)) }));
                    (__VLS_ctx.formatPercent((_t = (_s = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _s === void 0 ? void 0 : _s.ratio) !== null && _t !== void 0 ? _t : null, 0));
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress ui-budget-inline-progress-row" }, { 'aria-label': "Placeholder ejecucion subcategoria" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-row']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-track" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-track']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign(__assign({ class: "ui-budget-inline-progress-fill" }, { class: ("ui-budget-inline-progress-fill-".concat(__VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).tone)) }), { style: ({
                            width: "".concat(__VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).widthPct, "%"),
                        }) }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-fill']} */ ;
                    if (__VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).overflow) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "ui-budget-inline-progress-overflow-marker" }, { 'aria-hidden': "true" }));
                        /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-overflow-marker']} */ ;
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-inline-progress-caption" }));
                    /** @type {__VLS_StyleScopedClasses['ui-budget-inline-progress-caption']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: ("ui-budget-inline-progress-caption-tone-".concat(__VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).tone)) }));
                    (__VLS_ctx.formatPercent(__VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).ratio, 0));
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-metrics" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-metrics']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-metric" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-metric']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? 'Previsto YTD'
                    : 'Previsto');
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? "".concat(__VLS_ctx.formatMoney((_v = (_u = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _u === void 0 ? void 0 : _u.planned) !== null && _v !== void 0 ? _v : 0), " EUR")
                    : "".concat(__VLS_ctx.formatMoney(row.plannedAnnual), " EUR"));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-metric" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-metric']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? 'Ejecutado YTD'
                    : 'Ejecutado');
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-budget-pending-text" }, { class: ("ui-budget-pending-text-".concat((_x = (_w = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _w === void 0 ? void 0 : _w.tone) !== null && _x !== void 0 ? _x : __VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).tone)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-pending-text']} */ ;
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? "".concat(__VLS_ctx.formatMoney((_z = (_y = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _y === void 0 ? void 0 : _y.executed) !== null && _z !== void 0 ? _z : 0), " EUR")
                    : 'Pendiente');
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-row-metric" }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-row-metric']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? 'Desviacion YTD'
                    : 'Desviacion');
                __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-budget-pending-text" }, { class: ("ui-budget-pending-text-".concat((_1 = (_0 = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _0 === void 0 ? void 0 : _0.tone) !== null && _1 !== void 0 ? _1 : __VLS_ctx.executionPreview(section.id, "row:".concat(row.key)).tone)) }));
                /** @type {__VLS_StyleScopedClasses['ui-budget-pending-text']} */ ;
                (__VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)
                    ? "".concat(__VLS_ctx.formatSignedMoney((_3 = (_2 = __VLS_ctx.budgetSubcategoryActualExecution(section.id, row.key)) === null || _2 === void 0 ? void 0 : _2.deviation) !== null && _3 !== void 0 ? _3 : 0), " EUR")
                    : 'Pendiente');
                // @ts-ignore
                [formatMoney, formatMoney, formatMoney, formatMoney, formatMoney, formatPercent, formatPercent, formatPercent, formatPercent, formatPercent, formatPercent, formatPercent, formatSignedMoney, isSectionExpanded, formatCompactMoney, incomeEvolutionBaseMonthly, budgetCategoryActualExecution, budgetCategoryActualExecution, budgetCategoryActualExecution, budgetCategoryActualExecution, budgetCategoryActualExecution, budgetCategoryActualExecution, budgetCategoryActualExecution, selectedExecutionMonthLabel, selectedExecutionMonthLabel, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, executionPreview, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution, budgetSubcategoryActualExecution,];
            }
            // @ts-ignore
            [];
        }
    }
    else if (section.groups.length && !__VLS_ctx.isSectionExpanded(section.id)) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-budget-detail-collapsed-note" }));
        /** @type {__VLS_StyleScopedClasses['ui-budget-detail-collapsed-note']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle" }));
        /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
        (section.emptyMessage);
        if (section.filterMode !== 'all') {
        }
    }
    // @ts-ignore
    [isSectionExpanded,];
};
for (var _24 = 0, _25 = __VLS_vFor((__VLS_ctx.sections)); _24 < _25.length; _24++) {
    var section = _25[_24][0];
    _loop_3(section);
}
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
}
// @ts-ignore
[isLoading,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
exports.default = {};
