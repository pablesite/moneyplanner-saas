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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var api_1 = require("@/lib/api");
var errors_1 = require("@/lib/errors");
var net_worth_1 = require("@/domains/net-worth");
var ui_1 = require("@/domains/ui");
var data_input_1 = require("@/domains/data-input");
var portableBundle_1 = require("@/domains/data-input/portableBundle");
var _9 = (0, net_worth_1.useNetWorthViewState)(), store = _9.store, assetCategories = _9.assetCategories, assetSubcategories = _9.assetSubcategories, liabilityCategories = _9.liabilityCategories, prettyError = _9.prettyError, showAssetModal = _9.showAssetModal, showLiabilityModal = _9.showLiabilityModal, showEditModal = _9.showEditModal, editItem = _9.editItem, editKind = _9.editKind, openEdit = _9.openEdit, closeEdit = _9.closeEdit, editTitle = _9.editTitle, editCategories = _9.editCategories, editInitial = _9.editInitial, submitEdit = _9.submitEdit;
var _10 = (0, net_worth_1.useNetWorthViewExtensions)(store), itemFormProps = _10.itemFormProps, itemListProps = _10.itemListProps;
var _11 = (0, data_input_1.useAnnualIncomeStore)('core'), annualIncomeEntries = _11.entries, annualIncomeLoading = _11.loading, annualIncomeApiError = _11.error, loadAnnualIncome = _11.loadAll, addIncomeEntry = _11.addEntry, updateIncomeEntry = _11.updateEntry, deleteIncomeEntry = _11.deleteEntry;
var _12 = (0, data_input_1.useAnnualExpenseStore)('core'), annualExpenseEntries = _12.entries, annualExpenseLoading = _12.loading, annualExpenseApiError = _12.error, loadAnnualExpense = _12.loadAll, addExpenseEntry = _12.addEntry, updateExpenseEntry = _12.updateEntry, deleteExpenseEntry = _12.deleteEntry, listBySourceLiability = _12.listBySourceLiability;
var annualIncomeError = (0, vue_1.ref)(null);
var annualExpenseError = (0, vue_1.ref)(null);
var showIncomeModal = (0, vue_1.ref)(false);
var editingIncomeId = (0, vue_1.ref)(null);
var editingExpenseId = (0, vue_1.ref)(null);
var showExpenseModal = (0, vue_1.ref)(false);
var showGeneratedLiabilityExpenseModal = (0, vue_1.ref)(false);
var bulkEditingGeneratedLiabilityId = (0, vue_1.ref)(null);
var bulkEditingGeneratedExpenseIds = (0, vue_1.ref)([]);
var hydratingAnnualIncomeForm = (0, vue_1.ref)(false);
var hydratingAnnualExpenseForm = (0, vue_1.ref)(false);
var expandedIncomeCats = (0, vue_1.ref)(new Set());
var expandedExpenseCats = (0, vue_1.ref)(new Set());
var globalOwnershipFilter = (0, vue_1.ref)('all');
var assetOwnershipFilter = (0, vue_1.ref)('all');
var liabilityOwnershipFilter = (0, vue_1.ref)('all');
var visibilityFilterMode = (0, vue_1.ref)('active');
var generatedLiabilityExpenseReview = (0, vue_1.ref)(null);
var generatedLiabilityExpenseReviewChangeMessage = (0, vue_1.ref)(null);
var annualIncomeForm = (0, vue_1.reactive)({
    category: 'salary',
    subcategory: 'employee_salary',
    name: '',
    owner: '',
    isRecurrent: true,
    timeProfile: 'structural_recurrent',
    cashflowRole: 'operating',
    eventGroup: '',
    targetMonth: '',
    termEndMonth: '',
    termEndYear: '',
    amountInputPeriod: 'annual',
    amountAnnual: '',
    currency: 'EUR',
    notes: '',
});
var annualExpenseForm = (0, vue_1.reactive)({
    category: 'consumption_expenses',
    subcategory: 'living_expenses',
    name: '',
    owner: '',
    isRecurrent: true,
    timeProfile: 'structural_recurrent',
    cashflowRole: 'operating',
    eventGroup: '',
    targetMonth: '',
    termEndMonth: '',
    termEndYear: '',
    amountInputPeriod: 'annual',
    amountAnnual: '',
    currency: 'EUR',
    notes: '',
});
function patchAnnualIncomeForm(patch) {
    Object.assign(annualIncomeForm, patch);
}
function patchAnnualExpenseForm(patch) {
    Object.assign(annualExpenseForm, patch);
    normalizeExpenseCashflowRoleForCurrentTimeProfile();
}
var annualSubcategoryOptions = (0, vue_1.computed)(function () {
    return data_input_1.incomeSubcategories.filter(function (row) { return row.category === annualIncomeForm.category; });
});
var LEGACY_SAVINGS_SUBCATEGORIES = new Set(['short_term_savings', 'long_term_savings']);
function normalizeExpenseSubcategoryForUi(category, subcategory) {
    if (category === 'savings_allocation' && LEGACY_SAVINGS_SUBCATEGORIES.has(subcategory)) {
        return 'other_savings_allocation';
    }
    return subcategory;
}
var annualExpenseSubcategoryOptions = (0, vue_1.computed)(function () {
    return data_input_1.expenseSubcategories.filter(function (row) {
        return row.category === annualExpenseForm.category &&
            !(row.category === 'savings_allocation' && LEGACY_SAVINGS_SUBCATEGORIES.has(row.value));
    });
});
var annualEventGroupOptions = (0, vue_1.computed)(function () {
    var _a, _b;
    var groups = new Set();
    for (var _i = 0, _c = annualIncomeEntries.value; _i < _c.length; _i++) {
        var entry = _c[_i];
        var group = String((_a = entry.eventGroup) !== null && _a !== void 0 ? _a : '').trim();
        if (group)
            groups.add(group);
    }
    for (var _d = 0, _e = annualExpenseEntries.value; _d < _e.length; _d++) {
        var entry = _e[_d];
        var group = String((_b = entry.eventGroup) !== null && _b !== void 0 ? _b : '').trim();
        if (group)
            groups.add(group);
    }
    return Array.from(groups).sort(function (a, b) { return a.localeCompare(b, 'es', { sensitivity: 'base' }); });
});
var incomeTimeProfileOptions = (0, vue_1.computed)(function () {
    if (annualIncomeForm.category === 'capital_gains') {
        return [{ value: 'one_off', label: 'Puntual / extraordinario' }];
    }
    return [
        { value: 'structural_recurrent', label: 'Recurrente estructural (base)' },
        { value: 'term_recurrent', label: 'Recurrente temporal (con fin)' },
        { value: 'one_off', label: 'Puntual / extraordinario' },
    ];
});
var incomeCashflowRoleOptions = [
    { value: 'operating', label: 'Naturaleza: Operativo' },
    { value: 'transfer', label: 'Naturaleza: Transferencia/apoyo' },
    { value: 'asset_sale', label: 'Naturaleza: Venta de activo' },
    { value: 'tax_adjustment', label: 'Naturaleza: Ajuste fiscal' },
    { value: 'other', label: 'Naturaleza: Otro' },
];
var expenseTimeProfileOptions = [
    { value: 'structural_recurrent', label: 'Gasto recurrente' },
    { value: 'term_recurrent', label: 'Cuotas o compromisos temporales' },
    { value: 'one_off', label: 'Gasto puntual o extraordinario' },
];
var expenseCashflowRoleOptions = [
    { value: 'operating', label: 'Naturaleza: Operativo' },
    { value: 'temporary_commitment', label: 'Naturaleza: Compromiso temporal' },
    { value: 'savings', label: 'Naturaleza: Ahorro' },
    { value: 'investment', label: 'Naturaleza: Inversion' },
    { value: 'asset_purchase', label: 'Naturaleza: Compra de activo' },
    { value: 'tax_fee', label: 'Naturaleza: Impuestos/gastos' },
    { value: 'transfer', label: 'Naturaleza: Transferencia' },
    { value: 'other', label: 'Naturaleza: Otro' },
];
var EXPENSE_STRUCTURAL_ALLOWED_CASHFLOW_ROLES = [
    'operating',
    'savings',
    'investment',
    'tax_fee',
    'other',
];
var EXPENSE_ONE_OFF_ALLOWED_CASHFLOW_ROLES = [
    'savings',
    'investment',
    'tax_fee',
    'asset_purchase',
    'transfer',
    'other',
];
function allowedExpenseCashflowRolesForTimeProfile(timeProfile) {
    if (timeProfile === 'term_recurrent')
        return ['temporary_commitment'];
    if (timeProfile === 'one_off')
        return EXPENSE_ONE_OFF_ALLOWED_CASHFLOW_ROLES;
    return EXPENSE_STRUCTURAL_ALLOWED_CASHFLOW_ROLES;
}
var filteredExpenseCashflowRoleOptions = (0, vue_1.computed)(function () {
    var allowed = new Set(allowedExpenseCashflowRolesForTimeProfile(annualExpenseForm.timeProfile));
    return expenseCashflowRoleOptions.filter(function (option) {
        return allowed.has(option.value);
    });
});
var showExpenseCashflowRoleField = (0, vue_1.computed)(function () { return annualExpenseForm.timeProfile !== 'term_recurrent'; });
function normalizeExpenseCashflowRoleForCurrentTimeProfile() {
    var allowed = allowedExpenseCashflowRolesForTimeProfile(annualExpenseForm.timeProfile);
    if (!allowed.length)
        return;
    if (allowed.includes(annualExpenseForm.cashflowRole))
        return;
    if (annualExpenseForm.timeProfile === 'term_recurrent') {
        annualExpenseForm.cashflowRole = 'temporary_commitment';
        return;
    }
    var suggested = defaultExpenseCashflowRole(annualExpenseForm.category, annualExpenseForm.subcategory);
    annualExpenseForm.cashflowRole = allowed.includes(suggested) ? suggested : allowed[0];
}
function formatOwnershipPercent(raw) {
    var value = Number(String(raw).replace(',', '.'));
    if (!Number.isFinite(value))
        return "".concat(raw, "%");
    var rounded = Math.round(value * 100) / 100;
    var normalized = Number.isInteger(rounded)
        ? String(rounded)
        : String(rounded).replace(/\.?0+$/, '');
    return "".concat(normalized, "%");
}
function sharedOwnershipLabel(splits) {
    if (!splits.length)
        return 'Compartido';
    var details = splits.map(function (split) { return "".concat(split.member.name, " ").concat(formatOwnershipPercent(split.percent)); });
    return "Compartido (".concat(details.join(' / '), ")");
}
var ownerOptions = (0, vue_1.computed)(function () {
    var _a, _b;
    var options = new Map();
    for (var _i = 0, _c = (_a = store.ownerships) !== null && _a !== void 0 ? _a : []; _i < _c.length; _i++) {
        var ownership = _c[_i];
        if (ownership.kind === 'individual' && ownership.member) {
            var value = ownership.member.name;
            options.set("individual:".concat(ownership.member.id), {
                key: "individual:".concat(ownership.member.id),
                value: value,
                label: value,
            });
        }
        if (ownership.kind === 'shared') {
            var label = sharedOwnershipLabel((_b = ownership.splits) !== null && _b !== void 0 ? _b : []);
            options.set("shared:".concat(ownership.id), {
                key: "shared:".concat(ownership.id),
                value: label,
                label: label,
            });
        }
    }
    return Array.from(options.values()).sort(function (a, b) { return a.label.localeCompare(b.label); });
});
var sharedOwnershipAllocationsByLabel = (0, vue_1.computed)(function () {
    var _a, _b, _c;
    var map = new Map();
    for (var _i = 0, _d = (_a = store.ownerships) !== null && _a !== void 0 ? _a : []; _i < _d.length; _i++) {
        var ownership = _d[_i];
        if (ownership.kind !== 'shared')
            continue;
        var label = sharedOwnershipLabel((_b = ownership.splits) !== null && _b !== void 0 ? _b : []);
        var shares = ((_c = ownership.splits) !== null && _c !== void 0 ? _c : [])
            .map(function (split) {
            var _a, _b, _c, _d;
            var share = Number(String((_a = split.percent) !== null && _a !== void 0 ? _a : '').replace(',', '.'));
            var name = (_d = (_c = (_b = split.member) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : '';
            if (!name || !Number.isFinite(share) || share <= 0)
                return null;
            return { name: name, share: share };
        })
            .filter(function (row) { return row != null; });
        if (shares.length) {
            map.set(label, shares);
        }
    }
    return map;
});
function normalizeOwnerKey(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
}
var annualOwnerFilterOptions = (0, vue_1.computed)(function () {
    return ownerOptions.value
        .filter(function (option) { return option.key.startsWith('individual:'); })
        .sort(function (a, b) { return a.label.localeCompare(b.label); });
});
var globalOwnershipFilterOptions = (0, vue_1.computed)(function () {
    return annualOwnerFilterOptions.value
        .map(function (option) {
        var id = Number(option.key.replace('individual:', ''));
        return Number.isInteger(id) ? { id: id, label: option.label } : null;
    })
        .filter(function (option) { return option != null; });
});
var showOwnerField = (0, vue_1.computed)(function () { return ownerOptions.value.length > 1; });
var fiscalYear = (0, vue_1.ref)(2026);
var fiscalYearOptions = (0, vue_1.computed)(function () {
    var current = new Date().getFullYear();
    var years = new Set([current - 1, current, current + 1, 2026]);
    return Array.from(years).sort(function (a, b) { return b - a; });
});
function parseSharedOwnerShares(ownerLabel) {
    var text = String(ownerLabel !== null && ownerLabel !== void 0 ? ownerLabel : '').trim();
    if (!text)
        return [];
    var match = text.match(/^Compartido\s*\((.*)\)$/i);
    if (!(match === null || match === void 0 ? void 0 : match[1]))
        return [];
    return match[1]
        .split(/\s*(?:\/|,|;)\s*/)
        .map(function (part) {
        var piece = part.trim();
        var parsed = piece.match(/^(.*)\s+(\d+(?:[.,]\d+)?)\s*%?$/);
        if (!(parsed === null || parsed === void 0 ? void 0 : parsed[1]) || !parsed[2])
            return null;
        var name = parsed[1].trim();
        var share = Number(parsed[2].replace(',', '.'));
        if (!name || !Number.isFinite(share) || share <= 0)
            return null;
        return { name: name, share: share };
    })
        .filter(function (row) { return row != null; });
}
function allocatedFractionForAnnualOwner(ownerLabel, selectedOwner) {
    var _a, _b, _c;
    if (selectedOwner === 'all')
        return 1;
    var text = String(ownerLabel !== null && ownerLabel !== void 0 ? ownerLabel : '').trim();
    if (!text)
        return 0;
    if (text.localeCompare(selectedOwner, 'es', { sensitivity: 'base' }) === 0)
        return 1;
    var normalizedText = normalizeOwnerKey(text);
    var sharedEntries = Array.from(sharedOwnershipAllocationsByLabel.value.entries());
    var sharedFromOwnerships = (_a = sharedEntries.find(function (_a) {
        var label = _a[0];
        return normalizeOwnerKey(label) === normalizedText;
    })) === null || _a === void 0 ? void 0 : _a[1];
    var fallbackBareShared = normalizeOwnerKey(text) === 'compartido' && sharedEntries.length === 1
        ? (_b = sharedEntries[0]) === null || _b === void 0 ? void 0 : _b[1]
        : null;
    var shared = (_c = sharedFromOwnerships !== null && sharedFromOwnerships !== void 0 ? sharedFromOwnerships : fallbackBareShared) !== null && _c !== void 0 ? _c : parseSharedOwnerShares(text);
    if (!shared.length)
        return 0;
    var totalShare = shared.reduce(function (sum, row) { return sum + row.share; }, 0);
    var matchedShare = shared
        .filter(function (row) { return normalizeOwnerKey(row.name) === normalizeOwnerKey(selectedOwner); })
        .reduce(function (sum, row) { return sum + row.share; }, 0);
    if (!Number.isFinite(matchedShare) || matchedShare <= 0)
        return 0;
    if (totalShare > 0 && totalShare <= 1.0001) {
        return matchedShare / totalShare;
    }
    if (totalShare > 0 && totalShare <= 100.0001) {
        return matchedShare / 100;
    }
    return matchedShare / totalShare;
}
function filterAnnualEntriesByOwner(list, selectedOwner) {
    if (selectedOwner === 'all')
        return list;
    if (selectedOwner === 'unassigned') {
        return list.filter(function (entry) { var _a; return !String((_a = entry.owner) !== null && _a !== void 0 ? _a : '').trim(); });
    }
    return list
        .map(function (entry) {
        var fraction = allocatedFractionForAnnualOwner(entry.owner, selectedOwner);
        return fraction > 0 ? __assign(__assign({}, entry), { amountAnnual: entry.amountAnnual * fraction }) : null;
    })
        .filter(function (entry) { return entry != null && entry.amountAnnual > 0; });
}
function roundToMoney(value) {
    return Math.round(value * 100) / 100;
}
function effectiveAnnualAmountForSelectedYear(entry, selectedYear) {
    var _a;
    if (entry.timeProfile !== 'term_recurrent')
        return entry.amountAnnual;
    if (entry.termEndYear == null || entry.termEndYear !== selectedYear)
        return entry.amountAnnual;
    var months = Math.min(12, Math.max(1, Number((_a = entry.termEndMonth) !== null && _a !== void 0 ? _a : 12)));
    return roundToMoney((entry.amountAnnual * months) / 12);
}
function isVisibleByFilterMode(isActive) {
    if (visibilityFilterMode.value === 'all')
        return true;
    if (visibilityFilterMode.value === 'archived')
        return isActive === false;
    return isActive !== false;
}
var annualIncomeEntriesByVisibility = (0, vue_1.computed)(function () {
    return annualIncomeEntries.value
        .filter(function (entry) { return isVisibleByFilterMode(entry.isActive); })
        .map(function (entry) { return (__assign(__assign({}, entry), { amountAnnual: effectiveAnnualAmountForSelectedYear(entry, fiscalYear.value) })); });
});
var annualExpenseEntriesByVisibility = (0, vue_1.computed)(function () {
    return annualExpenseEntries.value
        .filter(function (entry) { return isVisibleByFilterMode(entry.isActive); })
        .map(function (entry) { return (__assign(__assign({}, entry), { amountAnnual: effectiveAnnualAmountForSelectedYear(entry, fiscalYear.value) })); });
});
var annualOwnerFilterValue = (0, vue_1.computed)(function () {
    var _a;
    if (globalOwnershipFilter.value === 'all')
        return 'all';
    if (globalOwnershipFilter.value === 'unassigned')
        return 'unassigned';
    var member = globalOwnershipFilterOptions.value.find(function (option) { return option.id === globalOwnershipFilter.value; });
    return (_a = member === null || member === void 0 ? void 0 : member.label) !== null && _a !== void 0 ? _a : 'all';
});
var filteredAnnualIncomeEntries = (0, vue_1.computed)(function () {
    return filterAnnualEntriesByOwner(annualIncomeEntriesByVisibility.value, annualOwnerFilterValue.value);
});
var filteredAnnualExpenseEntries = (0, vue_1.computed)(function () {
    return filterAnnualEntriesByOwner(annualExpenseEntriesByVisibility.value, annualOwnerFilterValue.value);
});
var filteredAnnualIncomeTotal = (0, vue_1.computed)(function () {
    return filteredAnnualIncomeEntries.value.reduce(function (sum, entry) { return sum + entry.amountAnnual; }, 0);
});
var filteredAnnualExpenseTotal = (0, vue_1.computed)(function () {
    return filteredAnnualExpenseEntries.value.reduce(function (sum, entry) { return sum + entry.amountAnnual; }, 0);
});
var annualBalanceTotal = (0, vue_1.computed)(function () { return filteredAnnualIncomeTotal.value - filteredAnnualExpenseTotal.value; });
var activeAssets = (0, vue_1.computed)(function () { return store.assets.filter(function (item) { return item.is_active !== false; }); });
var activeLiabilities = (0, vue_1.computed)(function () {
    return store.liabilities.filter(function (item) { return item.is_active !== false; });
});
var archivedAssets = (0, vue_1.computed)(function () { return store.assets.filter(function (item) { return item.is_active === false; }); });
var archivedLiabilities = (0, vue_1.computed)(function () {
    return store.liabilities.filter(function (item) { return item.is_active === false; });
});
var visibleAssets = (0, vue_1.computed)(function () {
    return visibilityFilterMode.value === 'all'
        ? store.assets
        : visibilityFilterMode.value === 'archived'
            ? archivedAssets.value
            : activeAssets.value;
});
var visibleLiabilities = (0, vue_1.computed)(function () {
    return visibilityFilterMode.value === 'all'
        ? store.liabilities
        : visibilityFilterMode.value === 'archived'
            ? archivedLiabilities.value
            : activeLiabilities.value;
});
var visibleAssetsByOwner = (0, vue_1.computed)(function () {
    return visibleAssets.value.filter(function (item) { return allocatedFractionForNetWorthOwner(item.ownership_ref, assetOwnershipFilter.value) > 0; });
});
var visibleLiabilitiesByOwner = (0, vue_1.computed)(function () {
    return visibleLiabilities.value.filter(function (item) {
        return allocatedFractionForNetWorthOwner(item.ownership_ref, liabilityOwnershipFilter.value) > 0;
    });
});
var annualIncomeCount = (0, vue_1.computed)(function () { return filteredAnnualIncomeEntries.value.length; });
var annualExpenseCount = (0, vue_1.computed)(function () { return filteredAnnualExpenseEntries.value.length; });
var assetsCount = (0, vue_1.computed)(function () { return visibleAssetsByOwner.value.length; });
var liabilitiesCount = (0, vue_1.computed)(function () { return visibleLiabilitiesByOwner.value.length; });
var hasIncomeData = (0, vue_1.computed)(function () { return annualIncomeCount.value > 0; });
var hasExpenseData = (0, vue_1.computed)(function () { return annualExpenseCount.value > 0; });
var hasAssetData = (0, vue_1.computed)(function () { return assetsCount.value > 0; });
var hasLiabilityData = (0, vue_1.computed)(function () { return liabilitiesCount.value > 0; });
var hasCompleteDataInput = (0, vue_1.computed)(function () { return hasIncomeData.value && hasExpenseData.value && hasAssetData.value && hasLiabilityData.value; });
var dataInputCheckTitle = (0, vue_1.computed)(function () {
    return hasCompleteDataInput.value ? 'Check de datos: completo' : 'Check de datos: pendiente';
});
var dataInputSummary = (0, vue_1.computed)(function () {
    var incomePart = hasIncomeData.value
        ? "".concat(annualIncomeCount.value, " ingresos registrados")
        : 'sin ingresos registrados';
    var expensePart = hasExpenseData.value
        ? "".concat(annualExpenseCount.value, " gastos registrados")
        : 'sin gastos registrados';
    var assetsPart = hasAssetData.value
        ? "".concat(assetsCount.value, " activos registrados")
        : 'sin activos registrados';
    var liabilitiesPart = hasLiabilityData.value
        ? "".concat(liabilitiesCount.value, " pasivos registrados")
        : 'sin pasivos registrados';
    return "Estado actual: ".concat(incomePart, ", ").concat(expensePart, ", ").concat(assetsPart, " y ").concat(liabilitiesPart, ". Completa los cuatro bloques para un diagnostico patrimonial fiable.");
});
(0, vue_1.watch)(function () { return annualIncomeForm.category; }, function () {
    var options = annualSubcategoryOptions.value;
    if (!options.length)
        return;
    var isCurrentValid = options.some(function (row) { return row.value === annualIncomeForm.subcategory; });
    if (!isCurrentValid) {
        annualIncomeForm.subcategory = options[0].value;
    }
});
(0, vue_1.watch)(function () { return annualExpenseForm.category; }, function () {
    var options = annualExpenseSubcategoryOptions.value;
    if (!options.length)
        return;
    var isCurrentValid = options.some(function (row) { return row.value === annualExpenseForm.subcategory; });
    if (!isCurrentValid) {
        annualExpenseForm.subcategory = options[0].value;
    }
});
(0, vue_1.watch)(ownerOptions, function (options) {
    var _a, _b;
    var singleOwner = options[0];
    if (options.length === 1) {
        annualIncomeForm.owner = (_a = singleOwner === null || singleOwner === void 0 ? void 0 : singleOwner.value) !== null && _a !== void 0 ? _a : '';
        annualExpenseForm.owner = (_b = singleOwner === null || singleOwner === void 0 ? void 0 : singleOwner.value) !== null && _b !== void 0 ? _b : '';
        return;
    }
    if (options.length === 0) {
        annualIncomeForm.owner = '';
        annualExpenseForm.owner = '';
        return;
    }
    if (annualIncomeForm.owner &&
        !options.some(function (option) { return option.value === annualIncomeForm.owner; })) {
        annualIncomeForm.owner = '';
    }
    if (annualExpenseForm.owner &&
        !options.some(function (option) { return option.value === annualExpenseForm.owner; })) {
        annualExpenseForm.owner = '';
    }
}, { immediate: true });
(0, vue_1.watch)(globalOwnershipFilterOptions, function (options) {
    var filter = globalOwnershipFilter.value;
    if (filter === 'all' || filter === 'unassigned')
        return;
    if (!options.some(function (option) { return option.id === filter; })) {
        globalOwnershipFilter.value = 'all';
    }
}, { immediate: true });
(0, vue_1.watch)(globalOwnershipFilter, function (value) {
    assetOwnershipFilter.value = value;
    liabilityOwnershipFilter.value = value;
}, { immediate: true });
function formatMoneyAmount(value, currency) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
function parseNumeric(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(',', '.');
    var value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
}
var ownershipById = (0, vue_1.computed)(function () {
    var _a;
    var map = new Map();
    for (var _i = 0, _b = (_a = store.ownerships) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
        var ownership = _b[_i];
        map.set(ownership.id, ownership);
    }
    return map;
});
function normalizeOwnershipSharePercent(raw) {
    var value = parseNumeric(raw);
    if (!Number.isFinite(value) || value <= 0)
        return 0;
    return value <= 1 ? value * 100 : value;
}
function allocatedFractionForNetWorthOwner(ownershipRef, selectedOwner) {
    var _a, _b;
    if (selectedOwner === 'all')
        return 1;
    if (selectedOwner === 'unassigned')
        return ownershipRef == null ? 1 : 0;
    if (ownershipRef == null)
        return 0;
    var ownership = ownershipById.value.get(ownershipRef);
    if (!ownership)
        return 0;
    if (ownership.kind === 'individual') {
        return ((_a = ownership.member) === null || _a === void 0 ? void 0 : _a.id) === selectedOwner ? 1 : 0;
    }
    var split = ((_b = ownership.splits) !== null && _b !== void 0 ? _b : []).find(function (row) { var _a; return ((_a = row.member) === null || _a === void 0 ? void 0 : _a.id) === selectedOwner; });
    if (!split)
        return 0;
    return normalizeOwnershipSharePercent(split.percent) / 100;
}
function annualOwnerLabelFromOwnershipId(ownershipId) {
    var _a, _b, _c, _d;
    if (ownershipId == null)
        return '';
    var ownership = ownershipById.value.get(ownershipId);
    if (!ownership)
        return '';
    if (ownership.kind === 'individual') {
        return (_c = (_b = (_a = ownership.member) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
    }
    if (ownership.kind === 'shared') {
        return sharedOwnershipLabel((_d = ownership.splits) !== null && _d !== void 0 ? _d : []);
    }
    return '';
}
function filteredNetWorthTotalBase(items, selectedOwner) {
    var _a;
    var total = 0;
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var amountBase = parseNumeric((_a = item.amount_base) !== null && _a !== void 0 ? _a : '0');
        if (!Number.isFinite(amountBase) || amountBase === 0)
            continue;
        var fraction = allocatedFractionForNetWorthOwner(item.ownership_ref, selectedOwner);
        if (fraction <= 0)
            continue;
        total += amountBase * fraction;
    }
    return total;
}
var assetsTotalBase = (0, vue_1.computed)(function () {
    var _a, _b;
    return assetOwnershipFilter.value === 'all'
        ? parseNumeric((_b = (_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_assets) !== null && _b !== void 0 ? _b : '0')
        : filteredNetWorthTotalBase(store.assets, assetOwnershipFilter.value);
});
var liabilitiesTotalBase = (0, vue_1.computed)(function () {
    var _a, _b;
    return liabilityOwnershipFilter.value === 'all'
        ? parseNumeric((_b = (_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_liabilities) !== null && _b !== void 0 ? _b : '0')
        : filteredNetWorthTotalBase(store.liabilities, liabilityOwnershipFilter.value);
});
var netAssetsBase = (0, vue_1.computed)(function () { return assetsTotalBase.value - liabilitiesTotalBase.value; });
var netAssetsCurrency = (0, vue_1.computed)(function () { var _a, _b, _c; return (_c = (_a = store.baseCurrency) !== null && _a !== void 0 ? _a : (_b = store.summary) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'EUR'; });
var incomeCategoryOrder = new Map(data_input_1.incomeCategories.map(function (category, index) { return [category.value, index]; }));
var expenseCategoryOrder = new Map(data_input_1.expenseCategories.map(function (category, index) { return [category.value, index]; }));
function incomeCategoryLabel(key) {
    var _a, _b;
    return (_b = (_a = data_input_1.incomeCategories.find(function (category) { return category.value === key; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : key;
}
function incomeSubcategoryLabel(key) {
    var _a, _b;
    return (_b = (_a = data_input_1.incomeSubcategories.find(function (subcategory) { return subcategory.value === key; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : key;
}
function expenseCategoryLabel(key) {
    var _a, _b;
    return (_b = (_a = data_input_1.expenseCategories.find(function (category) { return category.value === key; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : key;
}
function expenseSubcategoryLabel(key) {
    var _a, _b;
    if (LEGACY_SAVINGS_SUBCATEGORIES.has(key))
        return 'Ahorro general';
    return (_b = (_a = data_input_1.expenseSubcategories.find(function (subcategory) { return subcategory.value === key; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : key;
}
function timeProfileLabel(type) {
    if (type === 'structural_recurrent')
        return 'Recurrente estructural';
    if (type === 'term_recurrent')
        return 'Recurrente temporal';
    return 'Puntual';
}
function expenseCashflowRoleLabel(role) {
    if (role === 'operating')
        return 'Operativo';
    if (role === 'temporary_commitment')
        return 'Compromiso temporal';
    if (role === 'savings')
        return 'Ahorro';
    if (role === 'investment')
        return 'Inversion';
    if (role === 'asset_purchase')
        return 'Compra de activo';
    if (role === 'tax_fee')
        return 'Impuestos/gastos';
    if (role === 'transfer')
        return 'Transferencia';
    return 'Otro';
}
function eventGroupLabel(eventGroup) {
    var principalCancellation = /^liability_(\d+)_cancellation_principal$/;
    var feeCancellation = /^liability_(\d+)_cancellation_fee$/;
    if (principalCancellation.test(eventGroup))
        return 'Cancelacion anticipada principal';
    if (feeCancellation.test(eventGroup))
        return 'Cancelacion anticipada comision';
    return eventGroup;
}
function formatTermEndLabel(termEndYear, termEndMonth) {
    if (termEndYear == null)
        return null;
    if (termEndMonth == null)
        return "Fin ".concat(termEndYear);
    return "Fin ".concat(String(termEndMonth).padStart(2, '0'), "/").concat(termEndYear);
}
function amountInputValueFromAnnual(annualAmount, period) {
    if (period === 'monthly')
        return String(Math.round((annualAmount / 12) * 100) / 100);
    return String(annualAmount);
}
function shouldHideExpenseCashflowRoleLabel(params) {
    return ((params.timeProfile === 'term_recurrent' && params.cashflowRole === 'temporary_commitment') ||
        (params.timeProfile === 'one_off' && params.cashflowRole === 'temporary_commitment'));
}
function timeProfileDotClass(timeProfile) {
    if (timeProfile === 'term_recurrent')
        return 'income-rec-dot-recurrent-term';
    if (timeProfile === 'one_off')
        return 'income-rec-dot-one-off';
    return 'income-rec-dot-recurrent';
}
function defaultIncomeCashflowRole(category) {
    if (category === 'capital_gains')
        return 'asset_sale';
    if (category === 'transfers_support' || category === 'public_benefits')
        return 'transfer';
    if (category === 'other_income')
        return 'other';
    return 'operating';
}
function defaultExpenseCashflowRole(category, subcategory) {
    if (category === 'savings_allocation')
        return 'savings';
    if (category === 'financial_investments')
        return 'investment';
    if (category === 'real_estate_assets' || category === 'tangible_assets') {
        return subcategory === 'real_estate_fees_taxes' ? 'tax_fee' : 'asset_purchase';
    }
    return 'operating';
}
function sumByCurrency(entries) {
    var _a;
    var totals = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var currency = entry.currency || 'EUR';
        totals[currency] = ((_a = totals[currency]) !== null && _a !== void 0 ? _a : 0) + entry.amountAnnual;
    }
    return totals;
}
function formatTotalsLine(totals) {
    return Object.entries(totals)
        .filter(function (_a) {
        var amount = _a[1];
        return amount !== 0;
    })
        .map(function (_a) {
        var currency = _a[0], amount = _a[1];
        return formatMoneyAmount(amount, currency);
    })
        .join(' | ');
}
function incomeCategoryClass(category) {
    return "income-cat-".concat(category || 'other_income');
}
function expenseCategoryClass(category) {
    return "expense-cat-".concat(category || 'consumption_expenses');
}
function incomeCategoryPercent(entries) {
    if (!filteredAnnualIncomeTotal.value)
        return null;
    var categoryTotal = entries.reduce(function (sum, entry) { return sum + entry.amountAnnual; }, 0);
    if (!categoryTotal)
        return null;
    var pct = (categoryTotal / filteredAnnualIncomeTotal.value) * 100;
    return new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
    }).format(pct);
}
function expenseCategoryPercent(entries) {
    if (!filteredAnnualExpenseTotal.value)
        return null;
    var categoryTotal = entries.reduce(function (sum, entry) { return sum + entry.amountAnnual; }, 0);
    if (!categoryTotal)
        return null;
    var pct = (categoryTotal / filteredAnnualExpenseTotal.value) * 100;
    return new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 0,
    }).format(pct);
}
function isIncomeGroupExpanded(category) {
    return expandedIncomeCats.value.has(category);
}
function toggleIncomeCategory(category) {
    var next = new Set(expandedIncomeCats.value);
    if (next.has(category))
        next.delete(category);
    else
        next.add(category);
    expandedIncomeCats.value = next;
}
function isExpenseGroupExpanded(category) {
    return expandedExpenseCats.value.has(category);
}
function toggleExpenseCategory(category) {
    var next = new Set(expandedExpenseCats.value);
    if (next.has(category))
        next.delete(category);
    else
        next.add(category);
    expandedExpenseCats.value = next;
}
var annualIncomeGroups = (0, vue_1.computed)(function () {
    var categoryMap = new Map();
    for (var _i = 0, _a = filteredAnnualIncomeEntries.value; _i < _a.length; _i++) {
        var entry = _a[_i];
        if (!categoryMap.has(entry.category))
            categoryMap.set(entry.category, []);
        categoryMap.get(entry.category).push(entry);
    }
    return Array.from(categoryMap.entries())
        .sort(function (_a, _b) {
        var _c, _d;
        var a = _a[0];
        var b = _b[0];
        var aOrder = (_c = incomeCategoryOrder.get(a)) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
        var bOrder = (_d = incomeCategoryOrder.get(b)) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder)
            return aOrder - bOrder;
        return incomeCategoryLabel(a).localeCompare(incomeCategoryLabel(b));
    })
        .map(function (_a) {
        var category = _a[0], entries = _a[1];
        var sortedEntries = entries.slice().sort(function (x, y) { return x.name.localeCompare(y.name); });
        var subcategoryMap = new Map();
        for (var _i = 0, sortedEntries_1 = sortedEntries; _i < sortedEntries_1.length; _i++) {
            var entry = sortedEntries_1[_i];
            var subcategory = entry.subcategory || 'other';
            if (!subcategoryMap.has(subcategory))
                subcategoryMap.set(subcategory, []);
            subcategoryMap.get(subcategory).push(entry);
        }
        var subgroups = Array.from(subcategoryMap.entries())
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return incomeSubcategoryLabel(a).localeCompare(incomeSubcategoryLabel(b));
        })
            .map(function (_a) {
            var subcategory = _a[0], subgroupEntries = _a[1];
            return ({
                subcategory: subcategory,
                label: incomeSubcategoryLabel(subcategory),
                entries: subgroupEntries,
                totals: sumByCurrency(subgroupEntries),
            });
        });
        return {
            category: category,
            label: incomeCategoryLabel(category),
            entries: sortedEntries,
            subgroups: subgroups,
            totals: sumByCurrency(sortedEntries),
        };
    });
});
var annualExpenseGroups = (0, vue_1.computed)(function () {
    var categoryMap = new Map();
    for (var _i = 0, _a = filteredAnnualExpenseEntries.value; _i < _a.length; _i++) {
        var entry = _a[_i];
        if (!categoryMap.has(entry.category))
            categoryMap.set(entry.category, []);
        categoryMap.get(entry.category).push(entry);
    }
    return Array.from(categoryMap.entries())
        .sort(function (_a, _b) {
        var _c, _d;
        var a = _a[0];
        var b = _b[0];
        var aOrder = (_c = expenseCategoryOrder.get(a)) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
        var bOrder = (_d = expenseCategoryOrder.get(b)) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder)
            return aOrder - bOrder;
        return expenseCategoryLabel(a).localeCompare(expenseCategoryLabel(b));
    })
        .map(function (_a) {
        var category = _a[0], entries = _a[1];
        var sortedEntries = entries.slice().sort(function (x, y) { return x.name.localeCompare(y.name); });
        var subcategoryMap = new Map();
        for (var _i = 0, sortedEntries_2 = sortedEntries; _i < sortedEntries_2.length; _i++) {
            var entry = sortedEntries_2[_i];
            var subcategory = entry.subcategory || 'other_consumption_expenses';
            if (!subcategoryMap.has(subcategory))
                subcategoryMap.set(subcategory, []);
            subcategoryMap.get(subcategory).push(entry);
        }
        var subgroups = Array.from(subcategoryMap.entries())
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return expenseSubcategoryLabel(a).localeCompare(expenseSubcategoryLabel(b));
        })
            .map(function (_a) {
            var subcategory = _a[0], subgroupEntries = _a[1];
            return ({
                subcategory: subcategory,
                label: expenseSubcategoryLabel(subcategory),
                entries: subgroupEntries,
                totals: sumByCurrency(subgroupEntries),
            });
        });
        return {
            category: category,
            label: expenseCategoryLabel(category),
            entries: sortedEntries,
            subgroups: subgroups,
            totals: sumByCurrency(sortedEntries),
        };
    });
});
function resetIncomeForm() {
    var _a;
    var singleOwner = ownerOptions.value[0];
    annualIncomeForm.category = 'salary';
    annualIncomeForm.subcategory = 'employee_salary';
    annualIncomeForm.name = '';
    annualIncomeForm.owner = ownerOptions.value.length === 1 ? ((_a = singleOwner === null || singleOwner === void 0 ? void 0 : singleOwner.value) !== null && _a !== void 0 ? _a : '') : '';
    annualIncomeForm.isRecurrent = true;
    annualIncomeForm.timeProfile = 'structural_recurrent';
    annualIncomeForm.cashflowRole = defaultIncomeCashflowRole(annualIncomeForm.category);
    annualIncomeForm.eventGroup = '';
    annualIncomeForm.targetMonth = '';
    annualIncomeForm.termEndMonth = '';
    annualIncomeForm.termEndYear = '';
    annualIncomeForm.amountInputPeriod = 'annual';
    annualIncomeForm.amountAnnual = '';
    annualIncomeForm.currency = 'EUR';
    annualIncomeForm.notes = '';
}
function resetExpenseForm() {
    var _a;
    var singleOwner = ownerOptions.value[0];
    annualExpenseForm.category = 'consumption_expenses';
    annualExpenseForm.subcategory = 'living_expenses';
    annualExpenseForm.name = '';
    annualExpenseForm.owner = ownerOptions.value.length === 1 ? ((_a = singleOwner === null || singleOwner === void 0 ? void 0 : singleOwner.value) !== null && _a !== void 0 ? _a : '') : '';
    annualExpenseForm.isRecurrent = true;
    annualExpenseForm.timeProfile = 'structural_recurrent';
    annualExpenseForm.cashflowRole = defaultExpenseCashflowRole(annualExpenseForm.category, annualExpenseForm.subcategory);
    annualExpenseForm.eventGroup = '';
    annualExpenseForm.targetMonth = '';
    annualExpenseForm.termEndMonth = '';
    annualExpenseForm.termEndYear = '';
    annualExpenseForm.amountInputPeriod = 'annual';
    annualExpenseForm.amountAnnual = '';
    annualExpenseForm.currency = 'EUR';
    annualExpenseForm.notes = '';
}
function openIncomeModal(entry) {
    var _a;
    annualIncomeError.value = null;
    hydratingAnnualIncomeForm.value = true;
    if (entry) {
        editingIncomeId.value = entry.id;
        annualIncomeForm.category = entry.category;
        annualIncomeForm.subcategory = entry.subcategory;
        annualIncomeForm.name = entry.name;
        annualIncomeForm.owner = entry.owner || '';
        annualIncomeForm.isRecurrent = entry.incomeType === 'recurrent';
        annualIncomeForm.timeProfile =
            entry.category === 'capital_gains' ? 'one_off' : entry.timeProfile;
        annualIncomeForm.cashflowRole = entry.cashflowRole;
        annualIncomeForm.eventGroup = entry.eventGroup || '';
        annualIncomeForm.targetMonth =
            entry.targetMonth == null ? '' : String(Number(entry.targetMonth));
        annualIncomeForm.termEndMonth =
            entry.termEndMonth == null ? '' : String(Number(entry.termEndMonth));
        annualIncomeForm.termEndYear =
            entry.termEndYear == null ? '' : String(Number(entry.termEndYear));
        annualIncomeForm.amountInputPeriod = (_a = entry.amountInputPeriod) !== null && _a !== void 0 ? _a : 'annual';
        annualIncomeForm.amountAnnual = amountInputValueFromAnnual(entry.amountAnnual, annualIncomeForm.amountInputPeriod);
        annualIncomeForm.currency = entry.currency;
        annualIncomeForm.notes = entry.notes || '';
    }
    else {
        editingIncomeId.value = null;
        resetIncomeForm();
    }
    showIncomeModal.value = true;
    void (0, vue_1.nextTick)(function () {
        hydratingAnnualIncomeForm.value = false;
    });
}
function openExpenseModal(entry) {
    var _a;
    annualExpenseError.value = null;
    hydratingAnnualExpenseForm.value = true;
    if (entry) {
        editingExpenseId.value = entry.id;
        annualExpenseForm.category = entry.category;
        annualExpenseForm.subcategory = normalizeExpenseSubcategoryForUi(entry.category, entry.subcategory);
        annualExpenseForm.name = entry.name;
        annualExpenseForm.owner = entry.owner || '';
        annualExpenseForm.isRecurrent = entry.expenseType === 'recurrent';
        annualExpenseForm.timeProfile = entry.timeProfile;
        annualExpenseForm.cashflowRole = entry.cashflowRole;
        annualExpenseForm.eventGroup = entry.eventGroup || '';
        annualExpenseForm.targetMonth =
            entry.targetMonth == null ? '' : String(Number(entry.targetMonth));
        annualExpenseForm.termEndMonth =
            entry.termEndMonth == null ? '' : String(Number(entry.termEndMonth));
        annualExpenseForm.termEndYear =
            entry.termEndYear == null ? '' : String(Number(entry.termEndYear));
        annualExpenseForm.amountInputPeriod = (_a = entry.amountInputPeriod) !== null && _a !== void 0 ? _a : 'annual';
        annualExpenseForm.amountAnnual = amountInputValueFromAnnual(entry.amountAnnual, annualExpenseForm.amountInputPeriod);
        annualExpenseForm.currency = entry.currency;
        annualExpenseForm.notes = entry.notes || '';
        normalizeExpenseCashflowRoleForCurrentTimeProfile();
    }
    else {
        editingExpenseId.value = null;
        resetExpenseForm();
    }
    showExpenseModal.value = true;
    void (0, vue_1.nextTick)(function () {
        hydratingAnnualExpenseForm.value = false;
    });
}
function closeIncomeModal() {
    showIncomeModal.value = false;
    editingIncomeId.value = null;
    resetIncomeForm();
}
function closeExpenseModal() {
    showExpenseModal.value = false;
    editingExpenseId.value = null;
    bulkEditingGeneratedLiabilityId.value = null;
    bulkEditingGeneratedExpenseIds.value = [];
    resetExpenseForm();
}
var incomeAmountInputPlaceholder = (0, vue_1.computed)(function () {
    return annualIncomeForm.amountInputPeriod === 'monthly' ? 'Importe mensual' : 'Importe anual';
});
var incomeModalTitle = (0, vue_1.computed)(function () {
    return editingIncomeId.value === null ? 'Nuevo ingreso anual' : 'Editar ingreso anual';
});
var incomeSubmitLabel = (0, vue_1.computed)(function () {
    return editingIncomeId.value === null ? 'Guardar ingreso' : 'Guardar cambios';
});
var expenseAmountInputPlaceholder = (0, vue_1.computed)(function () {
    return annualExpenseForm.amountInputPeriod === 'monthly' ? 'Importe mensual' : 'Importe anual';
});
var expenseModalTitle = (0, vue_1.computed)(function () {
    return editingExpenseId.value === null
        ? 'Nueva salida anual'
        : bulkEditingGeneratedLiabilityId.value != null
            ? 'Editar salida generada (todos los ejercicios)'
            : 'Editar salida anual';
});
var expenseSubmitLabel = (0, vue_1.computed)(function () {
    return editingExpenseId.value === null
        ? 'Guardar salida'
        : bulkEditingGeneratedLiabilityId.value != null
            ? 'Aplicar a todos'
            : 'Guardar cambios';
});
var editingSystemGeneratedLiabilityExpense = (0, vue_1.computed)(function () {
    if (bulkEditingGeneratedLiabilityId.value != null)
        return true;
    if (editingExpenseId.value == null)
        return false;
    var entry = annualExpenseEntries.value.find(function (row) { return row.id === editingExpenseId.value; });
    return Boolean((entry === null || entry === void 0 ? void 0 : entry.isSystemGenerated) && (entry === null || entry === void 0 ? void 0 : entry.sourceLiabilityId) != null);
});
var expenseBulkEditHint = (0, vue_1.computed)(function () {
    return bulkEditingGeneratedLiabilityId.value != null
        ? 'Se aplicará en todos los ejercicios de este pasivo. Se mantiene el importe y el año de cada ejercicio.'
        : 'Notas (opcional)';
});
var generatedLiabilityExpenseReviewTitle = (0, vue_1.computed)(function () {
    return generatedLiabilityExpenseReview.value
        ? "Gasto generado por pasivo: ".concat(generatedLiabilityExpenseReview.value.liabilityName)
        : 'Gasto generado por pasivo';
});
function setGeneratedLiabilityExpenseReview(liabilityId, liabilityName, entries) {
    generatedLiabilityExpenseReview.value = {
        liabilityId: liabilityId,
        liabilityName: liabilityName,
        entries: entries.map(function (entry) { return ({
            id: entry.id,
            fiscalYear: entry.fiscalYear,
            name: entry.name,
            owner: entry.owner,
            category: entry.category,
            subcategory: entry.subcategory,
            expenseType: entry.expenseType,
            cashflowRole: entry.cashflowRole,
            timeProfile: entry.timeProfile,
            eventGroup: entry.eventGroup,
            targetMonth: entry.targetMonth,
            termEndMonth: entry.termEndMonth,
            termEndYear: entry.termEndYear,
            amountInputPeriod: entry.amountInputPeriod,
            amountAnnual: entry.amountAnnual,
            currency: entry.currency,
            notes: entry.notes,
        }); }),
    };
}
function summarizeGeneratedLiabilityExpenseChanges(beforeEntries, afterEntries) {
    var _a, _b;
    var toYearTotals = function (rows) {
        var _a, _b;
        var totals = new Map();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            totals.set(row.fiscalYear, ((_a = totals.get(row.fiscalYear)) !== null && _a !== void 0 ? _a : 0) + Number((_b = row.amountAnnual) !== null && _b !== void 0 ? _b : 0));
        }
        return totals;
    };
    var beforeTotals = toYearTotals(beforeEntries);
    var afterTotals = toYearTotals(afterEntries);
    var years = Array.from(new Set(__spreadArray(__spreadArray([], beforeTotals.keys(), true), afterTotals.keys(), true))).sort(function (a, b) { return a - b; });
    var changedYears = [];
    for (var _i = 0, years_1 = years; _i < years_1.length; _i++) {
        var year = years_1[_i];
        var before = (_a = beforeTotals.get(year)) !== null && _a !== void 0 ? _a : 0;
        var after = (_b = afterTotals.get(year)) !== null && _b !== void 0 ? _b : 0;
        if (Math.abs(before - after) > 0.009)
            changedYears.push(year);
    }
    var addedYears = years.filter(function (year) { var _a, _b; return ((_a = beforeTotals.get(year)) !== null && _a !== void 0 ? _a : 0) <= 0 && ((_b = afterTotals.get(year)) !== null && _b !== void 0 ? _b : 0) > 0; });
    var removedYears = years.filter(function (year) { var _a, _b; return ((_a = beforeTotals.get(year)) !== null && _a !== void 0 ? _a : 0) > 0 && ((_b = afterTotals.get(year)) !== null && _b !== void 0 ? _b : 0) <= 0; });
    if (!changedYears.length && !addedYears.length && !removedYears.length)
        return null;
    var chunks = [];
    if (changedYears.length) {
        chunks.push("Importes actualizados en: ".concat(changedYears.join(', ')));
    }
    if (addedYears.length) {
        chunks.push("Nuevas anualidades: ".concat(addedYears.join(', ')));
    }
    if (removedYears.length) {
        chunks.push("Anualidades eliminadas: ".concat(removedYears.join(', ')));
    }
    return chunks.join(' | ');
}
function closeGeneratedLiabilityExpenseModal() {
    showGeneratedLiabilityExpenseModal.value = false;
    generatedLiabilityExpenseReview.value = null;
    generatedLiabilityExpenseReviewChangeMessage.value = null;
}
function openGeneratedExpenseReviewEntryFromVisibleYear() {
    var review = generatedLiabilityExpenseReview.value;
    if (!review)
        return;
    var entry = annualExpenseEntries.value.find(function (row) { return row.sourceLiabilityId === review.liabilityId && row.isSystemGenerated; });
    if (!entry)
        return;
    closeGeneratedLiabilityExpenseModal();
    openExpenseModal(entry);
}
function openGeneratedExpenseBulkEdit() {
    var _a;
    var review = generatedLiabilityExpenseReview.value;
    if (!(review === null || review === void 0 ? void 0 : review.entries.length))
        return;
    var first = review.entries[0];
    annualExpenseError.value = null;
    hydratingAnnualExpenseForm.value = true;
    editingExpenseId.value = first.id;
    bulkEditingGeneratedLiabilityId.value = review.liabilityId;
    bulkEditingGeneratedExpenseIds.value = review.entries.map(function (entry) { return entry.id; });
    annualExpenseForm.category = first.category;
    annualExpenseForm.subcategory = normalizeExpenseSubcategoryForUi(first.category, first.subcategory);
    annualExpenseForm.name = first.name;
    annualExpenseForm.owner = first.owner || '';
    annualExpenseForm.isRecurrent = first.expenseType === 'recurrent';
    annualExpenseForm.timeProfile = first.timeProfile;
    annualExpenseForm.cashflowRole = first.cashflowRole;
    annualExpenseForm.eventGroup = first.eventGroup || '';
    annualExpenseForm.targetMonth =
        first.targetMonth == null ? '' : String(Number(first.targetMonth));
    annualExpenseForm.termEndMonth =
        first.termEndMonth == null ? '' : String(Number(first.termEndMonth));
    annualExpenseForm.termEndYear =
        first.termEndYear == null ? '' : String(Number(first.termEndYear));
    annualExpenseForm.amountInputPeriod = (_a = first.amountInputPeriod) !== null && _a !== void 0 ? _a : 'annual';
    annualExpenseForm.amountAnnual = amountInputValueFromAnnual(first.amountAnnual, annualExpenseForm.amountInputPeriod);
    annualExpenseForm.currency = first.currency;
    annualExpenseForm.notes = first.notes || '';
    normalizeExpenseCashflowRoleForCurrentTimeProfile();
    showGeneratedLiabilityExpenseModal.value = false;
    showExpenseModal.value = true;
    void (0, vue_1.nextTick)(function () {
        hydratingAnnualExpenseForm.value = false;
    });
}
function submitLiabilityWithExpenseReview(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var createdLiability, generatedEntries, systemGeneratedEntries, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.createLiability(payload)];
                case 1:
                    createdLiability = _a.sent();
                    if (!createdLiability)
                        return [2 /*return*/];
                    showLiabilityModal.value = false;
                    void loadAnnualExpense(fiscalYear.value);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, listBySourceLiability(createdLiability.id)];
                case 3:
                    generatedEntries = _a.sent();
                    systemGeneratedEntries = generatedEntries
                        .filter(function (entry) { return entry.isSystemGenerated && entry.sourceLiabilityId === createdLiability.id; })
                        .sort(function (a, b) { return a.fiscalYear - b.fiscalYear; });
                    if (!systemGeneratedEntries.length)
                        return [2 /*return*/];
                    generatedLiabilityExpenseReviewChangeMessage.value = null;
                    setGeneratedLiabilityExpenseReview(createdLiability.id, createdLiability.name, systemGeneratedEntries);
                    showGeneratedLiabilityExpenseModal.value = true;
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    annualExpenseError.value = "Pasivo creado, pero no se pudo cargar el gasto generado: ".concat((0, errors_1.toApiErrorMessage)(e_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateLiabilityAndShowExpenseReview(id, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var beforeEntries, refreshedEntries, systemGeneratedEntries, liabilityName;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, listBySourceLiability(id)];
                case 1:
                    beforeEntries = _c.sent();
                    return [4 /*yield*/, store.updateLiability(id, payload)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, listBySourceLiability(id)];
                case 4:
                    refreshedEntries = _c.sent();
                    systemGeneratedEntries = refreshedEntries
                        .filter(function (entry) { return entry.isSystemGenerated && entry.sourceLiabilityId === id; })
                        .sort(function (a, b) { return a.fiscalYear - b.fiscalYear; });
                    if (!systemGeneratedEntries.length)
                        return [2 /*return*/];
                    liabilityName = (_b = (_a = store.liabilities.find(function (item) { return item.id === id; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'Pasivo';
                    generatedLiabilityExpenseReviewChangeMessage.value = summarizeGeneratedLiabilityExpenseChanges(beforeEntries.filter(function (entry) { return entry.isSystemGenerated && entry.sourceLiabilityId === id; }), systemGeneratedEntries);
                    setGeneratedLiabilityExpenseReview(id, liabilityName, systemGeneratedEntries);
                    showGeneratedLiabilityExpenseModal.value = true;
                    return [2 /*return*/];
            }
        });
    });
}
function submitEditWithExpenseReview(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var current;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    current = editItem.value;
                    if (!current || !editKind.value)
                        return [2 /*return*/];
                    if (!(editKind.value === 'asset')) return [3 /*break*/, 3];
                    return [4 /*yield*/, submitEdit(payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, updateLiabilityAndShowExpenseReview(current.id, payload)];
                case 4:
                    _a.sent();
                    closeEdit();
                    return [2 /*return*/];
            }
        });
    });
}
function parseLooseDecimal(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(',', '.');
    if (!normalized)
        return null;
    var value = Number(normalized);
    return Number.isFinite(value) ? value : null;
}
function roundToCents(value) {
    return Math.round(value * 100) / 100;
}
var INTEREST_WITHHOLDING_RATE = 0.19;
function applyInterestWithholding(grossInterest) {
    return roundToCents(grossInterest * (1 - INTEREST_WITHHOLDING_RATE));
}
function isRemuneratedLiquidityAsset(payload) {
    var _a;
    var category = String((_a = payload.category) !== null && _a !== void 0 ? _a : '').trim();
    var tae = parseLooseDecimal(payload.annual_interest_tae);
    return category === 'cash' && tae != null && tae > 0;
}
function estimateRemuneratedLiquidityInterest(payload) {
    var _a, _b, _c;
    var category = String((_a = payload.category) !== null && _a !== void 0 ? _a : '').trim();
    var subcategory = String((_b = payload.subcategory) !== null && _b !== void 0 ? _b : '').trim();
    var tae = parseLooseDecimal(payload.annual_interest_tae);
    if (tae == null || tae <= 0)
        return null;
    if (category === 'cash' && subcategory === 'short_term_deposit') {
        var principalAmount = parseLooseDecimal(payload.amount);
        var depositTermMonths = Number((_c = payload.deposit_term_months) !== null && _c !== void 0 ? _c : 0);
        if (principalAmount == null ||
            principalAmount <= 0 ||
            !Number.isInteger(depositTermMonths) ||
            depositTermMonths < 1 ||
            depositTermMonths > 12) {
            return null;
        }
        return roundToCents((principalAmount * tae * depositTermMonths) / 1200);
    }
    var averageBalance = parseLooseDecimal(payload.estimated_average_balance_for_interest);
    if (averageBalance == null || averageBalance <= 0)
        return null;
    return roundToCents((averageBalance * tae) / 100);
}
function normalizeAmountForMatch(raw) {
    var value = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(',', '.');
    return value;
}
function findLikelyCreatedAsset(payload, previousAssetIds) {
    var _a, _b, _c, _d, _e;
    var targetName = String((_a = payload.name) !== null && _a !== void 0 ? _a : '').trim();
    var targetCategory = String((_b = payload.category) !== null && _b !== void 0 ? _b : '').trim();
    var targetSubcategory = String((_c = payload.subcategory) !== null && _c !== void 0 ? _c : '').trim();
    var targetCurrency = String((_d = payload.currency) !== null && _d !== void 0 ? _d : '')
        .trim()
        .toUpperCase();
    var targetStartDate = String((_e = payload.start_date) !== null && _e !== void 0 ? _e : '').trim();
    var targetAmount = normalizeAmountForMatch(payload.amount);
    var candidates = store.assets
        .filter(function (asset) { return !previousAssetIds.has(asset.id); })
        .filter(function (asset) { var _a; return String((_a = asset.name) !== null && _a !== void 0 ? _a : '').trim() === targetName; })
        .filter(function (asset) { var _a; return String((_a = asset.category) !== null && _a !== void 0 ? _a : '').trim() === targetCategory; })
        .filter(function (asset) { var _a; return String((_a = asset.subcategory) !== null && _a !== void 0 ? _a : '').trim() === targetSubcategory; })
        .filter(function (asset) {
        var _a;
        return String((_a = asset.currency) !== null && _a !== void 0 ? _a : '')
            .trim()
            .toUpperCase() === targetCurrency;
    })
        .filter(function (asset) { var _a; return String((_a = asset.start_date) !== null && _a !== void 0 ? _a : '').trim() === targetStartDate; })
        .filter(function (asset) { return normalizeAmountForMatch(asset.amount) === targetAmount; })
        .sort(function (a, b) { return b.id - a.id; });
    var picked = candidates[0];
    return picked ? { id: picked.id, name: picked.name } : null;
}
function submitAsset(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var previousAssetIds, createdAsset, createdOrMatchedAsset, estimatedAnnualInterestGross, currency, assetName, estimatedAnnualInterestNet, estimatedWithholdingAmount, ownerLabel, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    previousAssetIds = new Set(store.assets.map(function (asset) { return asset.id; }));
                    return [4 /*yield*/, store.createAsset(payload)];
                case 1:
                    createdAsset = _c.sent();
                    createdOrMatchedAsset = createdAsset !== null && createdAsset !== void 0 ? createdAsset : findLikelyCreatedAsset(payload, previousAssetIds);
                    if (!createdOrMatchedAsset)
                        return [2 /*return*/];
                    showAssetModal.value = false;
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 2:
                    _c.sent();
                    if (!isRemuneratedLiquidityAsset(payload))
                        return [2 /*return*/];
                    estimatedAnnualInterestGross = estimateRemuneratedLiquidityInterest(payload);
                    currency = String((_a = payload.currency) !== null && _a !== void 0 ? _a : '')
                        .trim()
                        .toUpperCase() || 'EUR';
                    assetName = String((_b = createdOrMatchedAsset.name) !== null && _b !== void 0 ? _b : '').trim() || 'Activo remunerado';
                    if (estimatedAnnualInterestGross == null || estimatedAnnualInterestGross <= 0)
                        return [2 /*return*/];
                    estimatedAnnualInterestNet = applyInterestWithholding(estimatedAnnualInterestGross);
                    if (!(estimatedAnnualInterestNet > 0))
                        return [2 /*return*/];
                    estimatedWithholdingAmount = roundToCents(estimatedAnnualInterestGross - estimatedAnnualInterestNet);
                    ownerLabel = annualOwnerLabelFromOwnershipId(payload.ownership_id);
                    return [4 /*yield*/, addIncomeEntry({
                            name: "Intereses estimados - ".concat(assetName),
                            category: 'passive_income',
                            subcategory: 'interest_income',
                            owner: ownerLabel,
                            incomeType: 'recurrent',
                            timeProfile: 'structural_recurrent',
                            cashflowRole: 'operating',
                            eventGroup: '',
                            termEndMonth: null,
                            termEndYear: null,
                            amountAnnual: estimatedAnnualInterestNet.toFixed(2),
                            fiscalYear: fiscalYear.value,
                            currency: currency,
                            notes: "Generado automaticamente desde activo de liquidez remunerado (".concat(assetName, "). Interes bruto estimado: ").concat(estimatedAnnualInterestGross.toFixed(2), " ").concat(currency, ". Retencion estimada (19%): ").concat(estimatedWithholdingAmount.toFixed(2), " ").concat(currency, ". Interes neto estimado: ").concat(estimatedAnnualInterestNet.toFixed(2), " ").concat(currency, "."),
                        }, fiscalYear.value)];
                case 3:
                    result = _c.sent();
                    if (!result.ok) {
                        annualIncomeError.value = "Activo creado, pero no se pudo generar el ingreso anual estimado: ".concat(result.error);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updateAssetAndReloadExpenses(id, payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.updateAsset(id, payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteAssetAndReloadExpenses(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, store.deleteAsset(id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteLiabilityAndReloadExpenses(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, store.deleteLiability(id)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 2:
                    _b.sent();
                    if (((_a = generatedLiabilityExpenseReview.value) === null || _a === void 0 ? void 0 : _a.liabilityId) === id) {
                        closeGeneratedLiabilityExpenseModal();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
(0, vue_1.watch)(function () { return annualIncomeForm.isRecurrent; }, function (isRecurrent) {
    if (!isRecurrent)
        annualIncomeForm.amountInputPeriod = 'annual';
    if (!isRecurrent)
        annualIncomeForm.timeProfile = 'one_off';
    else if (annualIncomeForm.timeProfile === 'one_off')
        annualIncomeForm.timeProfile = 'structural_recurrent';
});
(0, vue_1.watch)(function () { return annualExpenseForm.isRecurrent; }, function (isRecurrent) {
    if (!isRecurrent)
        annualExpenseForm.amountInputPeriod = 'annual';
    if (!isRecurrent)
        annualExpenseForm.timeProfile = 'one_off';
    else if (annualExpenseForm.timeProfile === 'one_off')
        annualExpenseForm.timeProfile = 'structural_recurrent';
});
(0, vue_1.watch)(function () { return annualIncomeForm.timeProfile; }, function (timeProfile) {
    annualIncomeForm.isRecurrent = timeProfile !== 'one_off';
    if (timeProfile !== 'term_recurrent')
        annualIncomeForm.termEndMonth = '';
    if (timeProfile !== 'term_recurrent')
        annualIncomeForm.termEndYear = '';
    if (timeProfile !== 'one_off')
        annualIncomeForm.targetMonth = '';
});
(0, vue_1.watch)(function () { return annualExpenseForm.timeProfile; }, function (timeProfile) {
    annualExpenseForm.isRecurrent = timeProfile !== 'one_off';
    if (timeProfile !== 'term_recurrent')
        annualExpenseForm.termEndMonth = '';
    if (timeProfile !== 'term_recurrent')
        annualExpenseForm.termEndYear = '';
    if (timeProfile !== 'one_off')
        annualExpenseForm.targetMonth = '';
    normalizeExpenseCashflowRoleForCurrentTimeProfile();
});
(0, vue_1.watch)([function () { return annualIncomeForm.category; }], function () {
    if (hydratingAnnualIncomeForm.value)
        return;
    if (annualIncomeForm.category === 'capital_gains') {
        annualIncomeForm.timeProfile = 'one_off';
    }
    annualIncomeForm.cashflowRole = defaultIncomeCashflowRole(annualIncomeForm.category);
});
(0, vue_1.watch)([function () { return annualExpenseForm.category; }, function () { return annualExpenseForm.subcategory; }], function () {
    if (hydratingAnnualExpenseForm.value)
        return;
    annualExpenseForm.cashflowRole = defaultExpenseCashflowRole(annualExpenseForm.category, annualExpenseForm.subcategory);
    normalizeExpenseCashflowRoleForCurrentTimeProfile();
});
function submitAnnualIncome() {
    return __awaiter(this, void 0, void 0, function () {
        var rawAmount, normalizedAmount, draft, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    rawAmount = Number(String(annualIncomeForm.amountAnnual).replace(',', '.'));
                    normalizedAmount = Number.isFinite(rawAmount)
                        ? annualIncomeForm.amountInputPeriod === 'monthly'
                            ? Math.round(rawAmount * 12 * 100) / 100
                            : rawAmount
                        : annualIncomeForm.amountAnnual;
                    draft = {
                        name: annualIncomeForm.name,
                        category: annualIncomeForm.category,
                        subcategory: annualIncomeForm.subcategory,
                        owner: annualIncomeForm.owner,
                        incomeType: (annualIncomeForm.isRecurrent ? 'recurrent' : 'one_off'),
                        timeProfile: annualIncomeForm.timeProfile,
                        cashflowRole: defaultIncomeCashflowRole(annualIncomeForm.category),
                        eventGroup: annualIncomeForm.eventGroup,
                        targetMonth: annualIncomeForm.timeProfile === 'one_off' && String(annualIncomeForm.targetMonth).trim()
                            ? Number(annualIncomeForm.targetMonth)
                            : null,
                        termEndMonth: annualIncomeForm.timeProfile === 'term_recurrent' &&
                            String(annualIncomeForm.termEndMonth).trim()
                            ? Number(annualIncomeForm.termEndMonth)
                            : null,
                        termEndYear: annualIncomeForm.timeProfile === 'term_recurrent' &&
                            String(annualIncomeForm.termEndYear).trim()
                            ? Number(annualIncomeForm.termEndYear)
                            : null,
                        amountInputPeriod: annualIncomeForm.amountInputPeriod,
                        amountAnnual: String(normalizedAmount),
                        fiscalYear: fiscalYear.value,
                        currency: annualIncomeForm.currency,
                        notes: annualIncomeForm.notes,
                    };
                    if (!(editingIncomeId.value === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, addIncomeEntry(draft, fiscalYear.value)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, updateIncomeEntry(editingIncomeId.value, draft, fiscalYear.value)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    result = _a;
                    if (!result.ok) {
                        annualIncomeError.value = result.error;
                        return [2 /*return*/];
                    }
                    annualIncomeError.value = null;
                    closeIncomeModal();
                    resetIncomeForm();
                    return [2 /*return*/];
            }
        });
    });
}
function removeAnnualIncome(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deleteIncomeEntry(id, fiscalYear.value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function submitAnnualExpense() {
    return __awaiter(this, void 0, void 0, function () {
        var rawAmount, normalizedAmount, draft, _i, _a, id, refreshedEntries, systemGeneratedEntries, e_2, result, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    normalizeExpenseCashflowRoleForCurrentTimeProfile();
                    rawAmount = Number(String(annualExpenseForm.amountAnnual).replace(',', '.'));
                    normalizedAmount = Number.isFinite(rawAmount)
                        ? annualExpenseForm.amountInputPeriod === 'monthly'
                            ? Math.round(rawAmount * 12 * 100) / 100
                            : rawAmount
                        : annualExpenseForm.amountAnnual;
                    draft = {
                        name: annualExpenseForm.name,
                        category: annualExpenseForm.category,
                        subcategory: annualExpenseForm.subcategory,
                        owner: annualExpenseForm.owner,
                        expenseType: (annualExpenseForm.isRecurrent ? 'recurrent' : 'one_off'),
                        timeProfile: annualExpenseForm.timeProfile,
                        cashflowRole: annualExpenseForm.cashflowRole,
                        eventGroup: annualExpenseForm.eventGroup,
                        targetMonth: annualExpenseForm.timeProfile === 'one_off' && String(annualExpenseForm.targetMonth).trim()
                            ? Number(annualExpenseForm.targetMonth)
                            : null,
                        termEndYear: annualExpenseForm.timeProfile === 'term_recurrent' &&
                            String(annualExpenseForm.termEndYear).trim()
                            ? Number(annualExpenseForm.termEndYear)
                            : null,
                        termEndMonth: annualExpenseForm.timeProfile === 'term_recurrent' &&
                            String(annualExpenseForm.termEndMonth).trim()
                            ? Number(annualExpenseForm.termEndMonth)
                            : null,
                        amountInputPeriod: annualExpenseForm.amountInputPeriod,
                        amountAnnual: String(normalizedAmount),
                        fiscalYear: fiscalYear.value,
                        currency: annualExpenseForm.currency,
                        notes: annualExpenseForm.notes,
                    };
                    if (!(bulkEditingGeneratedLiabilityId.value != null &&
                        bulkEditingGeneratedExpenseIds.value.length)) return [3 /*break*/, 10];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, , 10]);
                    _i = 0, _a = bulkEditingGeneratedExpenseIds.value;
                    _d.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    id = _a[_i];
                    return [4 /*yield*/, api_1.coreApi.patch("/api/budget/annual-expense/".concat(id, "/"), {
                            name: draft.name,
                            category: draft.category,
                            subcategory: draft.subcategory,
                            owner_name: draft.owner,
                            expense_type: draft.expenseType,
                            time_profile: draft.timeProfile,
                            cashflow_role: draft.cashflowRole,
                            event_group: draft.eventGroup,
                            target_month: draft.targetMonth,
                            term_end_month: draft.termEndMonth,
                            term_end_year: draft.termEndYear,
                            amount_input_period: draft.amountInputPeriod,
                            notes: draft.notes,
                        })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, loadAnnualExpense(fiscalYear.value)];
                case 6:
                    _d.sent();
                    if (!(((_c = generatedLiabilityExpenseReview.value) === null || _c === void 0 ? void 0 : _c.liabilityId) === bulkEditingGeneratedLiabilityId.value)) return [3 /*break*/, 8];
                    return [4 /*yield*/, listBySourceLiability(generatedLiabilityExpenseReview.value.liabilityId)];
                case 7:
                    refreshedEntries = _d.sent();
                    systemGeneratedEntries = refreshedEntries
                        .filter(function (entry) {
                        var _a;
                        return entry.isSystemGenerated &&
                            entry.sourceLiabilityId === ((_a = generatedLiabilityExpenseReview.value) === null || _a === void 0 ? void 0 : _a.liabilityId);
                    })
                        .sort(function (a, b) { return a.fiscalYear - b.fiscalYear; });
                    setGeneratedLiabilityExpenseReview(generatedLiabilityExpenseReview.value.liabilityId, generatedLiabilityExpenseReview.value.liabilityName, systemGeneratedEntries);
                    _d.label = 8;
                case 8:
                    annualExpenseError.value = null;
                    closeExpenseModal();
                    resetExpenseForm();
                    showGeneratedLiabilityExpenseModal.value = true;
                    return [2 /*return*/];
                case 9:
                    e_2 = _d.sent();
                    annualExpenseError.value = (0, errors_1.toApiErrorMessage)(e_2);
                    return [2 /*return*/];
                case 10:
                    if (!(editingExpenseId.value === null)) return [3 /*break*/, 12];
                    return [4 /*yield*/, addExpenseEntry(draft, fiscalYear.value)];
                case 11:
                    _b = _d.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, updateExpenseEntry(editingExpenseId.value, draft, fiscalYear.value)];
                case 13:
                    _b = _d.sent();
                    _d.label = 14;
                case 14:
                    result = _b;
                    if (!result.ok) {
                        annualExpenseError.value = result.error;
                        return [2 /*return*/];
                    }
                    annualExpenseError.value = null;
                    closeExpenseModal();
                    resetExpenseForm();
                    return [2 /*return*/];
            }
        });
    });
}
function removeAnnualExpense(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deleteExpenseEntry(id, fiscalYear.value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var dataTransferBusy = (0, vue_1.ref)(false);
var dataTransferBusyLabel = (0, vue_1.ref)(null);
var dataTransferStatus = (0, vue_1.ref)(null);
var dataTransferError = (0, vue_1.ref)(null);
var dataTransferToastMessage = (0, vue_1.ref)(null);
var dataTransferToastKind = (0, vue_1.ref)('success');
var importFileInputRef = (0, vue_1.ref)(null);
var pendingImportMode = (0, vue_1.ref)('append');
var portableDataAppVersion = (0, vue_1.ref)(null);
var dataTransferToastTimer = null;
var dataTransferUiBusy = (0, vue_1.computed)(function () {
    return dataTransferBusy.value ||
        store.loading ||
        annualIncomeLoading.value ||
        annualExpenseLoading.value;
});
function clearDataTransferFeedback() {
    dataTransferStatus.value = null;
    dataTransferError.value = null;
}
function clearDataTransferToast() {
    if (dataTransferToastTimer != null) {
        window.clearTimeout(dataTransferToastTimer);
        dataTransferToastTimer = null;
    }
    dataTransferToastMessage.value = null;
}
function showDataTransferToast(message, kind) {
    if (kind === void 0) { kind = 'success'; }
    clearDataTransferToast();
    dataTransferToastKind.value = kind;
    dataTransferToastMessage.value = message;
    dataTransferToastTimer = window.setTimeout(function () {
        dataTransferToastMessage.value = null;
        dataTransferToastTimer = null;
    }, 5000);
}
function triggerImportDialog(mode) {
    var _a;
    if (mode === void 0) { mode = 'append'; }
    clearDataTransferFeedback();
    pendingImportMode.value = mode;
    (_a = importFileInputRef.value) === null || _a === void 0 ? void 0 : _a.click();
}
function ensurePortableDataAppVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (portableDataAppVersion.value)
                        return [2 /*return*/, portableDataAppVersion.value];
                    return [4 /*yield*/, api_1.coreApi.get('/api/core/portable-data/meta/')];
                case 1:
                    response = _a.sent();
                    portableDataAppVersion.value = response.data.app_version;
                    return [2 /*return*/, portableDataAppVersion.value];
            }
        });
    });
}
function exportDataBundle() {
    return __awaiter(this, void 0, void 0, function () {
        var appVersion, _a, incomeRes, expenseRes, assetsRes, liabilitiesRes, snapshotsRes, settingsRes, membersRes, ownershipsRes, linksRes, payload, blob, url, link, e_3;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    clearDataTransferFeedback();
                    dataTransferBusyLabel.value = 'Exportando datos...';
                    dataTransferBusy.value = true;
                    _s.label = 1;
                case 1:
                    _s.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, ensurePortableDataAppVersion()];
                case 2:
                    appVersion = _s.sent();
                    return [4 /*yield*/, Promise.all([
                            api_1.coreApi.get('/api/budget/annual-income/'),
                            api_1.coreApi.get('/api/budget/annual-expense/'),
                            api_1.coreApi.get('/api/net-worth/assets/'),
                            api_1.coreApi.get('/api/net-worth/liabilities/'),
                            api_1.coreApi.get('/api/net-worth/snapshots/'),
                            api_1.coreApi.get('/api/auth/settings/'),
                            api_1.coreApi.get('/api/family-members/'),
                            api_1.coreApi.get('/api/ownerships/'),
                            api_1.coreApi.get('/api/ownership-links/'),
                        ])];
                case 3:
                    _a = _s.sent(), incomeRes = _a[0], expenseRes = _a[1], assetsRes = _a[2], liabilitiesRes = _a[3], snapshotsRes = _a[4], settingsRes = _a[5], membersRes = _a[6], ownershipsRes = _a[7], linksRes = _a[8];
                    payload = {
                        schema_version: 1,
                        exported_at: new Date().toISOString(),
                        source_app: 'core',
                        exported_app_version: appVersion,
                        settings: (_b = settingsRes.data) !== null && _b !== void 0 ? _b : undefined,
                        data: {
                            annual_income: ((_c = incomeRes.data) !== null && _c !== void 0 ? _c : []).map(portableBundle_1.toPortableAnnualIncomeRecord),
                            annual_expense: ((_d = expenseRes.data) !== null && _d !== void 0 ? _d : []).map(portableBundle_1.toPortableAnnualExpenseRecord),
                            assets: ((_e = assetsRes.data) !== null && _e !== void 0 ? _e : []).map(function (row) { return (0, portableBundle_1.toPortableAssetRecord)(row); }),
                            liabilities: ((_f = liabilitiesRes.data) !== null && _f !== void 0 ? _f : []).map(function (row) { return (0, portableBundle_1.toPortableLiabilityRecord)(row); }),
                            snapshots: ((_g = snapshotsRes.data) !== null && _g !== void 0 ? _g : []).slice(),
                        },
                        premium: {
                            family_members: ((_h = membersRes.data) !== null && _h !== void 0 ? _h : []).slice(),
                            ownerships: ((_j = ownershipsRes.data) !== null && _j !== void 0 ? _j : []).map(function (row) { return (0, portableBundle_1.toPortableOwnershipRecord)(row); }),
                            ownership_links: ((_k = linksRes.data) !== null && _k !== void 0 ? _k : []).slice(),
                        },
                    };
                    blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                    url = URL.createObjectURL(blob);
                    link = document.createElement('a');
                    link.href = url;
                    link.download = (0, portableBundle_1.buildPortableFilename)();
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url);
                    dataTransferStatus.value = "Exportacion completada: ".concat(payload.data.annual_income.length, " ingresos, ").concat(payload.data.annual_expense.length, " gastos, ").concat(payload.data.assets.length, " activos, ").concat(payload.data.liabilities.length, " pasivos, ").concat((_m = (_l = payload.data.snapshots) === null || _l === void 0 ? void 0 : _l.length) !== null && _m !== void 0 ? _m : 0, " snapshots, ").concat((_p = (_o = payload.premium) === null || _o === void 0 ? void 0 : _o.family_members.length) !== null && _p !== void 0 ? _p : 0, " miembros y ").concat((_r = (_q = payload.premium) === null || _q === void 0 ? void 0 : _q.ownerships.length) !== null && _r !== void 0 ? _r : 0, " titularidades.");
                    return [3 /*break*/, 6];
                case 4:
                    e_3 = _s.sent();
                    dataTransferError.value = "No se pudo exportar: ".concat((0, errors_1.toApiErrorMessage)(e_3));
                    return [3 /*break*/, 6];
                case 5:
                    dataTransferBusy.value = false;
                    dataTransferBusyLabel.value = null;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function setDataImportBusyState(importMode) {
    dataTransferBusyLabel.value =
        importMode === 'replace'
            ? 'Reemplazando datos... Esto puede tardar unos segundos.'
            : 'Importando datos...';
    dataTransferBusy.value = true;
}
function refreshImportedDataViews() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        store.refreshAll(),
                        loadAnnualIncome(fiscalYear.value),
                        loadAnnualExpense(fiscalYear.value),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function buildImportCompletionStatus(params) {
    var importMode = params.importMode, response = params.response;
    var counts = response.counts;
    return importMode === 'replace'
        ? "Reemplazo completado: ".concat(counts.annual_income, " ingresos, ").concat(counts.annual_expense, " gastos, ").concat(counts.assets, " activos, ").concat(counts.liabilities, " pasivos, ").concat(counts.snapshots, " snapshots, ").concat(counts.family_members, " miembros, ").concat(counts.ownerships, " titularidades y ").concat(counts.ownership_links, " enlaces de titularidad.")
        : "Importacion completada: ".concat(counts.annual_income, " ingresos, ").concat(counts.annual_expense, " gastos, ").concat(counts.assets, " activos, ").concat(counts.liabilities, " pasivos, ").concat(counts.snapshots, " snapshots, ").concat(counts.family_members, " miembros, ").concat(counts.ownerships, " titularidades y ").concat(counts.ownership_links, " enlaces de titularidad.");
}
function importDataFromFile(event) {
    return __awaiter(this, void 0, void 0, function () {
        var input, file, appVersion, content, bundle, importMode, proceed, response, e_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    input = event.target;
                    file = (_a = input === null || input === void 0 ? void 0 : input.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file)
                        return [2 /*return*/];
                    clearDataTransferFeedback();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, ensurePortableDataAppVersion()];
                case 2:
                    appVersion = _b.sent();
                    return [4 /*yield*/, file.text()];
                case 3:
                    content = _b.sent();
                    bundle = (0, portableBundle_1.parsePortableDataBundle)(content);
                    importMode = pendingImportMode.value;
                    proceed = window.confirm((0, portableBundle_1.buildImportPreviewMessage)(bundle, importMode, appVersion));
                    if (!proceed)
                        return [2 /*return*/];
                    setDataImportBusyState(importMode);
                    return [4 /*yield*/, api_1.coreApi.post('/api/core/portable-data/import/', {
                            mode: importMode,
                            bundle: bundle,
                        })];
                case 4:
                    response = _b.sent();
                    return [4 /*yield*/, refreshImportedDataViews()];
                case 5:
                    _b.sent();
                    dataTransferStatus.value = buildImportCompletionStatus({
                        importMode: importMode,
                        response: response.data,
                    });
                    return [3 /*break*/, 8];
                case 6:
                    e_4 = _b.sent();
                    dataTransferError.value = "No se pudo importar: ".concat((0, errors_1.toApiErrorMessage)(e_4));
                    return [3 /*break*/, 8];
                case 7:
                    dataTransferBusy.value = false;
                    dataTransferBusyLabel.value = null;
                    if (input)
                        input.value = '';
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
(0, vue_1.watch)(dataTransferStatus, function (message) {
    if (message)
        showDataTransferToast(message, 'success');
});
(0, vue_1.watch)(dataTransferError, function (message) {
    if (message)
        showDataTransferToast(message, 'error');
});
(0, vue_1.onBeforeUnmount)(function () {
    clearDataTransferToast();
});
(0, vue_1.watch)(fiscalYear, function (year) {
    loadAnnualIncome(year);
    loadAnnualExpense(year);
}, { immediate: true });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container ui-pro-page" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel grid gap-2.5" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-pro-kicker" }));
/** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "h1 m-0" }));
/** @type {__VLS_StyleScopedClasses['h1']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
(__VLS_ctx.dataInputCheckTitle);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle m-0" }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
(__VLS_ctx.dataInputSummary);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle m-0" }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "actions m-0" }));
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['m-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.exportDataBundle) }, { class: "btn btn-ghost" }), { type: "button", disabled: (__VLS_ctx.dataTransferUiBusy) }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.triggerImportDialog('append');
        // @ts-ignore
        [dataInputCheckTitle, dataInputSummary, exportDataBundle, dataTransferUiBusy, triggerImportDialog,];
    } }, { class: "btn btn-primary" }), { type: "button", disabled: (__VLS_ctx.dataTransferUiBusy) }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.triggerImportDialog('replace');
        // @ts-ignore
        [dataTransferUiBusy, triggerImportDialog,];
    } }, { class: "btn btn-ghost" }), { type: "button", disabled: (__VLS_ctx.dataTransferUiBusy) }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onChange: (__VLS_ctx.importDataFromFile) }, { ref: "importFileInputRef", type: "file", accept: "application/json,.json" }), { class: "sr-only" }));
/** @type {__VLS_StyleScopedClasses['sr-only']} */ ;
if (__VLS_ctx.dataTransferStatus) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle m-0" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    (__VLS_ctx.dataTransferStatus);
}
if (__VLS_ctx.dataTransferError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "alert m-0" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    (__VLS_ctx.dataTransferError);
}
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    enterActiveClass: "transition duration-200 ease-out",
    enterFromClass: "-translate-y-2 opacity-0",
    enterToClass: "translate-y-0 opacity-100",
    leaveActiveClass: "transition duration-150 ease-in",
    leaveFromClass: "translate-y-0 opacity-100",
    leaveToClass: "-translate-y-2 opacity-0",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        enterActiveClass: "transition duration-200 ease-out",
        enterFromClass: "-translate-y-2 opacity-0",
        enterToClass: "translate-y-0 opacity-100",
        leaveActiveClass: "transition duration-150 ease-in",
        leaveFromClass: "translate-y-0 opacity-100",
        leaveToClass: "-translate-y-2 opacity-0",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.dataTransferToastMessage) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ class: "fixed right-4 top-4 z-[80] max-w-[min(92vw,560px)] rounded-xl px-4 py-3 text-sm shadow-2xl backdrop-blur" }, { class: (__VLS_ctx.dataTransferToastKind === 'error'
            ? 'border border-rose-300/30 bg-rose-950/90 text-rose-100'
            : 'border border-emerald-300/30 bg-emerald-950/90 text-emerald-100') }), { role: "status", 'aria-live': "polite" }));
    /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-[80]']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-[min(92vw,560px)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-start gap-2.5" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "mt-0.5 inline-block h-2.5 w-2.5 rounded-full" }, { class: (__VLS_ctx.dataTransferToastKind === 'error' ? 'bg-rose-300' : 'bg-emerald-300') }));
    /** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.dataTransferToastMessage);
}
// @ts-ignore
[dataTransferUiBusy, importDataFromFile, dataTransferStatus, dataTransferStatus, dataTransferError, dataTransferError, dataTransferToastMessage, dataTransferToastMessage, dataTransferToastKind, dataTransferToastKind,];
var __VLS_3;
if (__VLS_ctx.dataTransferBusy) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]" }, { role: "status", 'aria-live': "polite", 'aria-busy': "true" }));
    /** @type {__VLS_StyleScopedClasses['fixed']} */ ;
    /** @type {__VLS_StyleScopedClasses['inset-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-[70]']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-black/45']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur-[2px]']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "w-full max-w-md rounded-2xl border border-white/15 bg-[#111827f2] p-4 shadow-2xl" }));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/15']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-[#111827f2]']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex items-center gap-3" }));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)(__assign({ class: "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-teal-300" }, { 'aria-hidden': "true" }));
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-5']} */ ;
    /** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-white/30']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-teal-300']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "m-0 text-sm font-medium text-white" }));
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white']} */ ;
    ((_a = __VLS_ctx.dataTransferBusyLabel) !== null && _a !== void 0 ? _a : 'Procesando datos...');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "m-0 text-xs text-white/65" }));
    /** @type {__VLS_StyleScopedClasses['m-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/65']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid-2" }));
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "section ui-flow-air md:col-span-2" }));
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air']} */ ;
/** @type {__VLS_StyleScopedClasses['md:col-span-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header ui-flow-air-header" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-left ui-flow-air-left" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-flow-air-title" }));
/** @type {__VLS_StyleScopedClasses['ui-flow-air-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-flow-air-meta" }));
/** @type {__VLS_StyleScopedClasses['ui-flow-air-meta']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-flow-air-subtitle" }));
/** @type {__VLS_StyleScopedClasses['ui-flow-air-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ id: "fiscal-year-income-expense", value: (__VLS_ctx.fiscalYear) }, { class: "select nw-select-sm ui-flow-air-year-select" }), { 'aria-label': "Ejercicio" }));
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-year-select']} */ ;
for (var _i = 0, _13 = __VLS_vFor((__VLS_ctx.fiscalYearOptions)); _i < _13.length; _i++) {
    var year = _13[_i][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (year),
        value: (year),
    });
    (year);
    // @ts-ignore
    [dataTransferBusy, dataTransferBusyLabel, fiscalYear, fiscalYearOptions,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ id: "visibility-filter-mode", value: (__VLS_ctx.visibilityFilterMode) }, { class: "select nw-select-sm ui-flow-air-year-select" }), { 'aria-label': "Filtro de visibilidad" }));
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-year-select']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "active",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "archived",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "all",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)(__assign(__assign({ id: "ownership-filter-mode", value: (__VLS_ctx.globalOwnershipFilter) }, { class: "select nw-select-sm ui-flow-air-year-select" }), { 'aria-label': "Filtro de ownership" }));
/** @type {__VLS_StyleScopedClasses['select']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-select-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-year-select']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "all",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "unassigned",
});
for (var _14 = 0, _15 = __VLS_vFor((__VLS_ctx.globalOwnershipFilterOptions)); _14 < _15.length; _14++) {
    var option = _15[_14][0];
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: ("global-owner-".concat(option.id)),
        value: (option.id),
    });
    (option.label);
    // @ts-ignore
    [visibilityFilterMode, globalOwnershipFilter, globalOwnershipFilterOptions,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-right ui-flow-air-right" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-inline ui-flow-air-total" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-flow-air-total']} */ ;
(__VLS_ctx.formatMoneyAmount(__VLS_ctx.annualBalanceTotal, 'EUR'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-details" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-details']} */ ;
(__VLS_ctx.fiscalYear);
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "card ui-pro-panel" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-left" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "card-header-title mt-0" }));
/** @type {__VLS_StyleScopedClasses['card-header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-right" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-inline" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-inline']} */ ;
(__VLS_ctx.formatMoneyAmount(__VLS_ctx.filteredAnnualIncomeTotal, 'EUR'));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (function () { return __VLS_ctx.openIncomeModal(); }) }, { class: "btn btn-primary btn-sm nw-list-add-icon-only" }), { type: "button", 'aria-label': "Anadir ingreso", disabled: (__VLS_ctx.annualIncomeLoading) }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-list-add-icon-only']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "btn-icon" }));
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-totals" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-totals']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-details" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-details']} */ ;
if (__VLS_ctx.annualIncomeError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.annualIncomeError);
}
else if (__VLS_ctx.annualIncomeApiError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.annualIncomeApiError);
}
if (!__VLS_ctx.annualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle mt-3" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
}
else if (!__VLS_ctx.filteredAnnualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle mt-3" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-3 grid gap-4" }));
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    var _loop_1 = function (group) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign(__assign({ key: (group.category) }, { class: "nw-cat-block" }), { class: (__VLS_ctx.incomeCategoryClass(group.category)) }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-block']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-header" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-left" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-left']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (group.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
        /** @type {__VLS_StyleScopedClasses['badge']} */ ;
        (group.entries.length);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-right" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-total']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total-primary" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-total-primary']} */ ;
        (__VLS_ctx.formatTotalsLine(group.totals));
        if (__VLS_ctx.incomeCategoryPercent(group.entries)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-cat-percent" }));
            /** @type {__VLS_StyleScopedClasses['nw-cat-percent']} */ ;
            (__VLS_ctx.incomeCategoryPercent(group.entries));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(!__VLS_ctx.annualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading))
                    return;
                if (!!(!__VLS_ctx.filteredAnnualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading))
                    return;
                __VLS_ctx.toggleIncomeCategory(group.category);
                // @ts-ignore
                [fiscalYear, formatMoneyAmount, formatMoneyAmount, annualBalanceTotal, filteredAnnualIncomeTotal, openIncomeModal, annualIncomeLoading, annualIncomeLoading, annualIncomeLoading, annualIncomeError, annualIncomeError, annualIncomeApiError, annualIncomeApiError, annualIncomeEntries, filteredAnnualIncomeEntries, annualIncomeGroups, incomeCategoryClass, formatTotalsLine, incomeCategoryPercent, incomeCategoryPercent, toggleIncomeCategory,];
            } }, { class: "icon-btn nw-cat-toggle" }), { type: "button", 'aria-label': (__VLS_ctx.isIncomeGroupExpanded(group.category) ? 'Ocultar desglose' : 'Mostrar desglose'), title: (__VLS_ctx.isIncomeGroupExpanded(group.category) ? 'Ocultar desglose' : 'Mostrar desglose') }));
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['nw-cat-toggle']} */ ;
        if (__VLS_ctx.isIncomeGroupExpanded(group.category)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
            /** @type {__VLS_StyleScopedClasses['icon']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
            /** @type {__VLS_StyleScopedClasses['icon']} */ ;
        }
        if (__VLS_ctx.isIncomeGroupExpanded(group.category)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subcat-list" }));
            /** @type {__VLS_StyleScopedClasses['subcat-list']} */ ;
            for (var _22 = 0, _23 = __VLS_vFor((group.subgroups)); _22 < _23.length; _22++) {
                var subgroup = _23[_22][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: ("".concat(group.category, ":").concat(subgroup.subcategory)) }, { class: "nw-subcat-block" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-block']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-header" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-header']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-title" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-title']} */ ;
                (subgroup.label);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-total']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total-primary" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-total-primary']} */ ;
                (__VLS_ctx.formatTotalsLine(subgroup.totals));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-actions-spacer" }, { 'aria-hidden': "true" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-actions-spacer']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "list list-plain nw-subcat-items" }));
                /** @type {__VLS_StyleScopedClasses['list']} */ ;
                /** @type {__VLS_StyleScopedClasses['list-plain']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-subcat-items']} */ ;
                var _loop_3 = function (entry) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                        key: (entry.id),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-row income-item-row" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-row']} */ ;
                    /** @type {__VLS_StyleScopedClasses['income-item-row']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-main" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-main']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-name income-item-name" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-name']} */ ;
                    /** @type {__VLS_StyleScopedClasses['income-item-name']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign(__assign({ class: "income-rec-dot" }, { class: (__VLS_ctx.timeProfileDotClass(entry.timeProfile)) }), { 'aria-hidden': "true" }));
                    /** @type {__VLS_StyleScopedClasses['income-rec-dot']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "item-name-text" }));
                    /** @type {__VLS_StyleScopedClasses['item-name-text']} */ ;
                    (entry.name);
                    if (entry.owner) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
                        /** @type {__VLS_StyleScopedClasses['badge']} */ ;
                        (entry.owner);
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-submeta" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-submeta']} */ ;
                    (__VLS_ctx.timeProfileLabel(entry.timeProfile));
                    if (entry.eventGroup) {
                        (__VLS_ctx.eventGroupLabel(entry.eventGroup));
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-amount" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-amount']} */ ;
                    (__VLS_ctx.formatMoneyAmount(entry.amountAnnual, entry.currency));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-actions" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-actions']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (function () { return __VLS_ctx.openIncomeModal(entry); }) }, { class: "icon-btn" }), { title: "Editar", disabled: (__VLS_ctx.annualIncomeLoading) }));
                    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!!(!__VLS_ctx.annualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading))
                                return;
                            if (!!(!__VLS_ctx.filteredAnnualIncomeEntries.length && !__VLS_ctx.annualIncomeLoading))
                                return;
                            if (!(__VLS_ctx.isIncomeGroupExpanded(group.category)))
                                return;
                            __VLS_ctx.removeAnnualIncome(entry.id);
                            // @ts-ignore
                            [formatMoneyAmount, openIncomeModal, annualIncomeLoading, formatTotalsLine, isIncomeGroupExpanded, isIncomeGroupExpanded, isIncomeGroupExpanded, isIncomeGroupExpanded, timeProfileDotClass, timeProfileLabel, eventGroupLabel, removeAnnualIncome,];
                        } }, { class: "icon-btn" }), { title: "Eliminar", disabled: (__VLS_ctx.annualIncomeLoading) }));
                    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
                    // @ts-ignore
                    [annualIncomeLoading,];
                };
                for (var _24 = 0, _25 = __VLS_vFor((subgroup.entries)); _24 < _25.length; _24++) {
                    var entry = _25[_24][0];
                    _loop_3(entry);
                }
                // @ts-ignore
                [];
            }
        }
        // @ts-ignore
        [];
    };
    for (var _16 = 0, _17 = __VLS_vFor((__VLS_ctx.annualIncomeGroups)); _16 < _17.length; _16++) {
        var group = _17[_16][0];
        _loop_1(group);
    }
}
if (__VLS_ctx.annualIncomeLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line mt-2" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ class: "card ui-pro-panel" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-left" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "card-header-title mt-0" }));
/** @type {__VLS_StyleScopedClasses['card-header-title']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-right" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-inline" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-inline']} */ ;
(__VLS_ctx.formatMoneyAmount(__VLS_ctx.filteredAnnualExpenseTotal, 'EUR'));
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (function () { return __VLS_ctx.openExpenseModal(); }) }, { class: "btn btn-primary btn-sm nw-list-add-icon-only" }), { type: "button", 'aria-label': "Anadir salida", disabled: (__VLS_ctx.annualExpenseLoading) }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['nw-list-add-icon-only']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "btn-icon" }));
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-totals" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-totals']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-details" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-details']} */ ;
if (__VLS_ctx.annualExpenseError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.annualExpenseError);
}
else if (__VLS_ctx.annualExpenseApiError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.annualExpenseApiError);
}
if (!__VLS_ctx.annualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle mt-3" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
}
else if (!__VLS_ctx.filteredAnnualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subtle mt-3" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-3 grid gap-4" }));
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    var _loop_2 = function (group) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign(__assign({ key: (group.category) }, { class: "nw-cat-block" }), { class: (__VLS_ctx.expenseCategoryClass(group.category)) }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-block']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-header" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-left" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-left']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (group.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
        /** @type {__VLS_StyleScopedClasses['badge']} */ ;
        (group.entries.length);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-right" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-total']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-cat-total-primary" }));
        /** @type {__VLS_StyleScopedClasses['nw-cat-total-primary']} */ ;
        (__VLS_ctx.formatTotalsLine(group.totals));
        if (__VLS_ctx.expenseCategoryPercent(group.entries)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "nw-cat-percent" }));
            /** @type {__VLS_StyleScopedClasses['nw-cat-percent']} */ ;
            (__VLS_ctx.expenseCategoryPercent(group.entries));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(!__VLS_ctx.annualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading))
                    return;
                if (!!(!__VLS_ctx.filteredAnnualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading))
                    return;
                __VLS_ctx.toggleExpenseCategory(group.category);
                // @ts-ignore
                [formatMoneyAmount, annualIncomeLoading, formatTotalsLine, filteredAnnualExpenseTotal, openExpenseModal, annualExpenseLoading, annualExpenseLoading, annualExpenseLoading, annualExpenseError, annualExpenseError, annualExpenseApiError, annualExpenseApiError, annualExpenseEntries, filteredAnnualExpenseEntries, annualExpenseGroups, expenseCategoryClass, expenseCategoryPercent, expenseCategoryPercent, toggleExpenseCategory,];
            } }, { class: "icon-btn nw-cat-toggle" }), { type: "button", 'aria-label': (__VLS_ctx.isExpenseGroupExpanded(group.category) ? 'Ocultar desglose' : 'Mostrar desglose'), title: (__VLS_ctx.isExpenseGroupExpanded(group.category) ? 'Ocultar desglose' : 'Mostrar desglose') }));
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['nw-cat-toggle']} */ ;
        if (__VLS_ctx.isExpenseGroupExpanded(group.category)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
            /** @type {__VLS_StyleScopedClasses['icon']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "icon" }, { 'aria-hidden': "true" }));
            /** @type {__VLS_StyleScopedClasses['icon']} */ ;
        }
        if (__VLS_ctx.isExpenseGroupExpanded(group.category)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "subcat-list" }));
            /** @type {__VLS_StyleScopedClasses['subcat-list']} */ ;
            for (var _26 = 0, _27 = __VLS_vFor((group.subgroups)); _26 < _27.length; _26++) {
                var subgroup = _27[_26][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: ("".concat(group.category, ":").concat(subgroup.subcategory)) }, { class: "nw-subcat-block" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-block']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-header" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-header']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-title" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-title']} */ ;
                (subgroup.label);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-total']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-total-primary" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-total-primary']} */ ;
                (__VLS_ctx.formatTotalsLine(subgroup.totals));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-subcat-actions-spacer" }, { 'aria-hidden': "true" }));
                /** @type {__VLS_StyleScopedClasses['nw-subcat-actions-spacer']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "list list-plain nw-subcat-items" }));
                /** @type {__VLS_StyleScopedClasses['list']} */ ;
                /** @type {__VLS_StyleScopedClasses['list-plain']} */ ;
                /** @type {__VLS_StyleScopedClasses['nw-subcat-items']} */ ;
                var _loop_4 = function (entry) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                        key: (entry.id),
                    });
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-row income-item-row" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-row']} */ ;
                    /** @type {__VLS_StyleScopedClasses['income-item-row']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-main" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-main']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-name income-item-name" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-name']} */ ;
                    /** @type {__VLS_StyleScopedClasses['income-item-name']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign(__assign({ class: "income-rec-dot" }, { class: (__VLS_ctx.timeProfileDotClass(entry.timeProfile)) }), { 'aria-hidden': "true" }));
                    /** @type {__VLS_StyleScopedClasses['income-rec-dot']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "item-name-text" }));
                    /** @type {__VLS_StyleScopedClasses['item-name-text']} */ ;
                    (entry.name);
                    if (entry.owner) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
                        /** @type {__VLS_StyleScopedClasses['badge']} */ ;
                        (entry.owner);
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-submeta" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-submeta']} */ ;
                    (__VLS_ctx.timeProfileLabel(entry.timeProfile));
                    if (!__VLS_ctx.shouldHideExpenseCashflowRoleLabel({
                        timeProfile: entry.timeProfile,
                        cashflowRole: entry.cashflowRole,
                    })) {
                        (__VLS_ctx.expenseCashflowRoleLabel(entry.cashflowRole));
                    }
                    if (entry.eventGroup) {
                        (__VLS_ctx.eventGroupLabel(entry.eventGroup));
                    }
                    if (__VLS_ctx.formatTermEndLabel(entry.termEndYear, entry.termEndMonth)) {
                        (__VLS_ctx.formatTermEndLabel(entry.termEndYear, entry.termEndMonth));
                    }
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-amount" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-amount']} */ ;
                    (__VLS_ctx.formatMoneyAmount(entry.amountAnnual, entry.currency));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-item-actions" }));
                    /** @type {__VLS_StyleScopedClasses['nw-item-actions']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (function () { return __VLS_ctx.openExpenseModal(entry); }) }, { class: "icon-btn" }), { title: "Editar", disabled: (__VLS_ctx.annualExpenseLoading) }));
                    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!!(!__VLS_ctx.annualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading))
                                return;
                            if (!!(!__VLS_ctx.filteredAnnualExpenseEntries.length && !__VLS_ctx.annualExpenseLoading))
                                return;
                            if (!(__VLS_ctx.isExpenseGroupExpanded(group.category)))
                                return;
                            __VLS_ctx.removeAnnualExpense(entry.id);
                            // @ts-ignore
                            [formatMoneyAmount, formatTotalsLine, timeProfileDotClass, timeProfileLabel, eventGroupLabel, openExpenseModal, annualExpenseLoading, isExpenseGroupExpanded, isExpenseGroupExpanded, isExpenseGroupExpanded, isExpenseGroupExpanded, shouldHideExpenseCashflowRoleLabel, expenseCashflowRoleLabel, formatTermEndLabel, formatTermEndLabel, removeAnnualExpense,];
                        } }, { class: "icon-btn" }), { title: "Eliminar", disabled: (__VLS_ctx.annualExpenseLoading) }));
                    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
                    // @ts-ignore
                    [annualExpenseLoading,];
                };
                for (var _28 = 0, _29 = __VLS_vFor((subgroup.entries)); _28 < _29.length; _28++) {
                    var entry = _29[_28][0];
                    _loop_4(entry);
                }
                // @ts-ignore
                [];
            }
        }
        // @ts-ignore
        [];
    };
    for (var _18 = 0, _19 = __VLS_vFor((__VLS_ctx.annualExpenseGroups)); _18 < _19.length; _18++) {
        var group = _19[_18][0];
        _loop_2(group);
    }
}
if (__VLS_ctx.annualExpenseLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line mt-2" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
}
if (__VLS_ctx.store.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.prettyError());
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "section ui-balance-air" }));
/** @type {__VLS_StyleScopedClasses['section']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-balance-air']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header ui-balance-air-header" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-balance-air-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-left ui-balance-air-left" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-balance-air-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "ui-balance-air-title" }));
/** @type {__VLS_StyleScopedClasses['ui-balance-air-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-balance-air-subtitle" }));
/** @type {__VLS_StyleScopedClasses['ui-balance-air-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-header-right ui-balance-air-right" }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-right']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-balance-air-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-inline ui-balance-air-total" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-inline']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-balance-air-total']} */ ;
(__VLS_ctx.formatMoneyAmount(__VLS_ctx.netAssetsBase, __VLS_ctx.netAssetsCurrency));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nw-list-total-details" }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-details']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid-2" }));
/** @type {__VLS_StyleScopedClasses['grid-2']} */ ;
var __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.ItemList} */
net_worth_1.ItemList;
// @ts-ignore
var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign(__assign({ ownershipFilterValue: (__VLS_ctx.assetOwnershipFilter), title: "Activos", items: (__VLS_ctx.visibleAssets), showArchived: (__VLS_ctx.visibilityFilterMode !== 'active'), showOwnershipFilter: (false), categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories), baseCurrency: ((_d = (_b = __VLS_ctx.store.baseCurrency) !== null && _b !== void 0 ? _b : (_c = __VLS_ctx.store.summary) === null || _c === void 0 ? void 0 : _c.base_currency) !== null && _d !== void 0 ? _d : 'EUR'), categoryTotalsBase: ((_f = (_e = __VLS_ctx.store.summary) === null || _e === void 0 ? void 0 : _e.assets_by_category) !== null && _f !== void 0 ? _f : {}), subcategoryTotalsBase: ((_h = (_g = __VLS_ctx.store.summary) === null || _g === void 0 ? void 0 : _g.assets_by_subcategory) !== null && _h !== void 0 ? _h : {}), totalBase: ((_k = (_j = __VLS_ctx.store.summary) === null || _j === void 0 ? void 0 : _j.total_assets) !== null && _k !== void 0 ? _k : '0') }, (__VLS_ctx.itemListProps)), { onUpdate: (__VLS_ctx.updateAssetAndReloadExpenses), onArchive: (__VLS_ctx.store.archiveAsset), onDelete: (__VLS_ctx.deleteAssetAndReloadExpenses), onAdd: (function () { return (__VLS_ctx.showAssetModal = true); }), onEdit: (function (it) { return __VLS_ctx.openEdit(it, 'asset'); }) })));
var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign({ ownershipFilterValue: (__VLS_ctx.assetOwnershipFilter), title: "Activos", items: (__VLS_ctx.visibleAssets), showArchived: (__VLS_ctx.visibilityFilterMode !== 'active'), showOwnershipFilter: (false), categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories), baseCurrency: ((_o = (_l = __VLS_ctx.store.baseCurrency) !== null && _l !== void 0 ? _l : (_m = __VLS_ctx.store.summary) === null || _m === void 0 ? void 0 : _m.base_currency) !== null && _o !== void 0 ? _o : 'EUR'), categoryTotalsBase: ((_q = (_p = __VLS_ctx.store.summary) === null || _p === void 0 ? void 0 : _p.assets_by_category) !== null && _q !== void 0 ? _q : {}), subcategoryTotalsBase: ((_s = (_r = __VLS_ctx.store.summary) === null || _r === void 0 ? void 0 : _r.assets_by_subcategory) !== null && _s !== void 0 ? _s : {}), totalBase: ((_u = (_t = __VLS_ctx.store.summary) === null || _t === void 0 ? void 0 : _t.total_assets) !== null && _u !== void 0 ? _u : '0') }, (__VLS_ctx.itemListProps)), { onUpdate: (__VLS_ctx.updateAssetAndReloadExpenses), onArchive: (__VLS_ctx.store.archiveAsset), onDelete: (__VLS_ctx.deleteAssetAndReloadExpenses), onAdd: (function () { return (__VLS_ctx.showAssetModal = true); }), onEdit: (function (it) { return __VLS_ctx.openEdit(it, 'asset'); }) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
var __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.ItemList} */
net_worth_1.ItemList;
// @ts-ignore
var __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11(__assign(__assign({ ownershipFilterValue: (__VLS_ctx.liabilityOwnershipFilter), title: "Pasivos", items: (__VLS_ctx.visibleLiabilities), showArchived: (__VLS_ctx.visibilityFilterMode !== 'active'), showOwnershipFilter: (false), categories: (__VLS_ctx.liabilityCategories), baseCurrency: ((_x = (_v = __VLS_ctx.store.baseCurrency) !== null && _v !== void 0 ? _v : (_w = __VLS_ctx.store.summary) === null || _w === void 0 ? void 0 : _w.base_currency) !== null && _x !== void 0 ? _x : 'EUR'), categoryTotalsBase: ((_z = (_y = __VLS_ctx.store.summary) === null || _y === void 0 ? void 0 : _y.liabilities_by_category) !== null && _z !== void 0 ? _z : {}), totalBase: ((_1 = (_0 = __VLS_ctx.store.summary) === null || _0 === void 0 ? void 0 : _0.total_liabilities) !== null && _1 !== void 0 ? _1 : '0') }, (__VLS_ctx.itemListProps)), { assets: (__VLS_ctx.activeAssets), onUpdate: (__VLS_ctx.updateLiabilityAndShowExpenseReview), onArchive: (__VLS_ctx.store.archiveLiability), onDelete: (__VLS_ctx.deleteLiabilityAndReloadExpenses), onAdd: (function () { return (__VLS_ctx.showLiabilityModal = true); }), onEdit: (function (it) { return __VLS_ctx.openEdit(it, 'liability'); }) })));
var __VLS_13 = __VLS_12.apply(void 0, __spreadArray([__assign(__assign({ ownershipFilterValue: (__VLS_ctx.liabilityOwnershipFilter), title: "Pasivos", items: (__VLS_ctx.visibleLiabilities), showArchived: (__VLS_ctx.visibilityFilterMode !== 'active'), showOwnershipFilter: (false), categories: (__VLS_ctx.liabilityCategories), baseCurrency: ((_4 = (_2 = __VLS_ctx.store.baseCurrency) !== null && _2 !== void 0 ? _2 : (_3 = __VLS_ctx.store.summary) === null || _3 === void 0 ? void 0 : _3.base_currency) !== null && _4 !== void 0 ? _4 : 'EUR'), categoryTotalsBase: ((_6 = (_5 = __VLS_ctx.store.summary) === null || _5 === void 0 ? void 0 : _5.liabilities_by_category) !== null && _6 !== void 0 ? _6 : {}), totalBase: ((_8 = (_7 = __VLS_ctx.store.summary) === null || _7 === void 0 ? void 0 : _7.total_liabilities) !== null && _8 !== void 0 ? _8 : '0') }, (__VLS_ctx.itemListProps)), { assets: (__VLS_ctx.activeAssets), onUpdate: (__VLS_ctx.updateLiabilityAndShowExpenseReview), onArchive: (__VLS_ctx.store.archiveLiability), onDelete: (__VLS_ctx.deleteLiabilityAndReloadExpenses), onAdd: (function () { return (__VLS_ctx.showLiabilityModal = true); }), onEdit: (function (it) { return __VLS_ctx.openEdit(it, 'liability'); }) })], __VLS_functionalComponentArgsRest(__VLS_12), false));
if (__VLS_ctx.store.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
}
var __VLS_16;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showAssetModal), title: "Nuevo activo" })));
var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showAssetModal), title: "Nuevo activo" })], __VLS_functionalComponentArgsRest(__VLS_17), false));
var __VLS_21;
var __VLS_22 = ({ close: {} },
    { onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.showAssetModal = false;
            // @ts-ignore
            [visibilityFilterMode, visibilityFilterMode, formatMoneyAmount, annualExpenseLoading, store, store, store, store, store, store, store, store, store, store, store, store, store, prettyError, netAssetsBase, netAssetsCurrency, assetOwnershipFilter, visibleAssets, assetCategories, assetSubcategories, itemListProps, itemListProps, updateAssetAndReloadExpenses, deleteAssetAndReloadExpenses, showAssetModal, showAssetModal, showAssetModal, openEdit, openEdit, liabilityOwnershipFilter, visibleLiabilities, liabilityCategories, activeAssets, updateLiabilityAndShowExpenseReview, deleteLiabilityAndReloadExpenses, showLiabilityModal,];
        } });
var __VLS_23 = __VLS_19.slots.default;
var __VLS_24;
/** @ts-ignore @type {typeof __VLS_components.ItemForm} */
net_worth_1.ItemForm;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ title: "Nuevo activo", categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories) }, (__VLS_ctx.itemFormProps)), { allowNegative: (true), onSubmit: (__VLS_ctx.submitAsset), onCancel: (function () { return (__VLS_ctx.showAssetModal = false); }) })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ title: "Nuevo activo", categories: (__VLS_ctx.assetCategories), subcategories: (__VLS_ctx.assetSubcategories) }, (__VLS_ctx.itemFormProps)), { allowNegative: (true), onSubmit: (__VLS_ctx.submitAsset), onCancel: (function () { return (__VLS_ctx.showAssetModal = false); }) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
// @ts-ignore
[assetCategories, assetSubcategories, showAssetModal, itemFormProps, submitAsset,];
var __VLS_19;
var __VLS_20;
var __VLS_29;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showLiabilityModal), title: "Nuevo pasivo" })));
var __VLS_31 = __VLS_30.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showLiabilityModal), title: "Nuevo pasivo" })], __VLS_functionalComponentArgsRest(__VLS_30), false));
var __VLS_34;
var __VLS_35 = ({ close: {} },
    { onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.showLiabilityModal = false;
            // @ts-ignore
            [showLiabilityModal, showLiabilityModal,];
        } });
var __VLS_36 = __VLS_32.slots.default;
var __VLS_37;
/** @ts-ignore @type {typeof __VLS_components.ItemForm} */
net_worth_1.ItemForm;
// @ts-ignore
var __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37(__assign(__assign({ title: "Nuevo pasivo", categories: (__VLS_ctx.liabilityCategories) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.activeAssets), showFinancedAsset: (true), onSubmit: (__VLS_ctx.submitLiabilityWithExpenseReview), onCancel: (function () { return (__VLS_ctx.showLiabilityModal = false); }) })));
var __VLS_39 = __VLS_38.apply(void 0, __spreadArray([__assign(__assign({ title: "Nuevo pasivo", categories: (__VLS_ctx.liabilityCategories) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.activeAssets), showFinancedAsset: (true), onSubmit: (__VLS_ctx.submitLiabilityWithExpenseReview), onCancel: (function () { return (__VLS_ctx.showLiabilityModal = false); }) })], __VLS_functionalComponentArgsRest(__VLS_38), false));
// @ts-ignore
[liabilityCategories, activeAssets, showLiabilityModal, itemFormProps, submitLiabilityWithExpenseReview,];
var __VLS_32;
var __VLS_33;
var __VLS_42;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showGeneratedLiabilityExpenseModal), title: (__VLS_ctx.generatedLiabilityExpenseReviewTitle) })));
var __VLS_44 = __VLS_43.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showGeneratedLiabilityExpenseModal), title: (__VLS_ctx.generatedLiabilityExpenseReviewTitle) })], __VLS_functionalComponentArgsRest(__VLS_43), false));
var __VLS_47;
var __VLS_48 = ({ close: {} },
    { onClose: (__VLS_ctx.closeGeneratedLiabilityExpenseModal) });
var __VLS_49 = __VLS_45.slots.default;
if (__VLS_ctx.generatedLiabilityExpenseReview) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid gap-3" }));
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    if (__VLS_ctx.generatedLiabilityExpenseReviewChangeMessage) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-sm text-white/90" }));
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-amber-300/20']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-amber-400/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
        (__VLS_ctx.generatedLiabilityExpenseReviewChangeMessage);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "rounded-xl border border-teal-300/20 bg-teal-400/10 px-3 py-2 text-sm text-white/90" }));
    /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-teal-300/20']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-teal-400/10']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
    (__VLS_ctx.generatedLiabilityExpenseReview.entries.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "grid gap-2" }));
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    for (var _20 = 0, _21 = __VLS_vFor((__VLS_ctx.generatedLiabilityExpenseReview.entries)); _20 < _21.length; _20++) {
        var entry = _21[_20][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (entry.id) }, { class: "rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5" }));
        /** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-white/[0.03]']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-2.5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "flex flex-wrap items-center justify-between gap-2" }));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-sm font-medium" }));
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        (entry.fiscalYear);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "text-sm text-white/90" }));
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/90']} */ ;
        (__VLS_ctx.formatMoneyAmount(entry.amountAnnual, entry.currency));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-1 text-xs text-white/70" }));
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-white/70']} */ ;
        (__VLS_ctx.expenseCategoryLabel(entry.category));
        (__VLS_ctx.expenseSubcategoryLabel(entry.subcategory));
        if (!__VLS_ctx.shouldHideExpenseCashflowRoleLabel({
            timeProfile: entry.timeProfile,
            cashflowRole: entry.cashflowRole,
        })) {
            (__VLS_ctx.expenseCashflowRoleLabel(entry.cashflowRole));
        }
        (__VLS_ctx.timeProfileLabel(entry.timeProfile));
        if (entry.notes) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mt-1 text-xs text-white/55" }));
            /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-white/55']} */ ;
            (entry.notes);
        }
        // @ts-ignore
        [formatMoneyAmount, timeProfileLabel, shouldHideExpenseCashflowRoleLabel, expenseCashflowRoleLabel, showGeneratedLiabilityExpenseModal, generatedLiabilityExpenseReviewTitle, closeGeneratedLiabilityExpenseModal, generatedLiabilityExpenseReview, generatedLiabilityExpenseReview, generatedLiabilityExpenseReview, generatedLiabilityExpenseReviewChangeMessage, generatedLiabilityExpenseReviewChangeMessage, expenseCategoryLabel, expenseSubcategoryLabel,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "actions justify-end" }));
    /** @type {__VLS_StyleScopedClasses['actions']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.openGeneratedExpenseBulkEdit) }, { class: "btn" }), { type: "button", disabled: (!__VLS_ctx.generatedLiabilityExpenseReview.entries.length) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.closeGeneratedLiabilityExpenseModal) }, { class: "btn btn-ghost" }), { type: "button" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-ghost']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.openGeneratedExpenseReviewEntryFromVisibleYear) }, { class: "btn btn-primary" }), { type: "button", disabled: (!__VLS_ctx.annualExpenseEntries.some(function (entry) {
            var _a;
            return entry.sourceLiabilityId === ((_a = __VLS_ctx.generatedLiabilityExpenseReview) === null || _a === void 0 ? void 0 : _a.liabilityId) &&
                entry.isSystemGenerated;
        })) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
// @ts-ignore
[annualExpenseEntries, closeGeneratedLiabilityExpenseModal, generatedLiabilityExpenseReview, generatedLiabilityExpenseReview, openGeneratedExpenseBulkEdit, openGeneratedExpenseReviewEntryFromVisibleYear,];
var __VLS_45;
var __VLS_46;
var __VLS_50;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50(__assign({ 'onClose': {} }, { open: (__VLS_ctx.showEditModal), title: (__VLS_ctx.editTitle) })));
var __VLS_52 = __VLS_51.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.showEditModal), title: (__VLS_ctx.editTitle) })], __VLS_functionalComponentArgsRest(__VLS_51), false));
var __VLS_55;
var __VLS_56 = ({ close: {} },
    { onClose: (__VLS_ctx.closeEdit) });
var __VLS_57 = __VLS_53.slots.default;
if (__VLS_ctx.editInitial) {
    var __VLS_58 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.ItemForm} */
    net_worth_1.ItemForm;
    // @ts-ignore
    var __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58(__assign(__assign({ title: (__VLS_ctx.editTitle), categories: (__VLS_ctx.editCategories), subcategories: (__VLS_ctx.editKind === 'asset' ? __VLS_ctx.assetSubcategories : undefined) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.editKind === 'liability' ? __VLS_ctx.activeAssets : []), showFinancedAsset: (__VLS_ctx.editKind === 'liability'), allowNegative: (__VLS_ctx.editKind === 'asset'), mode: "edit", initial: (__VLS_ctx.editInitial), onSubmit: (__VLS_ctx.submitEditWithExpenseReview), onCancel: (__VLS_ctx.closeEdit) })));
    var __VLS_60 = __VLS_59.apply(void 0, __spreadArray([__assign(__assign({ title: (__VLS_ctx.editTitle), categories: (__VLS_ctx.editCategories), subcategories: (__VLS_ctx.editKind === 'asset' ? __VLS_ctx.assetSubcategories : undefined) }, (__VLS_ctx.itemFormProps)), { assets: (__VLS_ctx.editKind === 'liability' ? __VLS_ctx.activeAssets : []), showFinancedAsset: (__VLS_ctx.editKind === 'liability'), allowNegative: (__VLS_ctx.editKind === 'asset'), mode: "edit", initial: (__VLS_ctx.editInitial), onSubmit: (__VLS_ctx.submitEditWithExpenseReview), onCancel: (__VLS_ctx.closeEdit) })], __VLS_functionalComponentArgsRest(__VLS_59), false));
}
// @ts-ignore
[assetSubcategories, activeAssets, itemFormProps, showEditModal, editTitle, editTitle, closeEdit, closeEdit, editInitial, editInitial, editCategories, editKind, editKind, editKind, editKind, submitEditWithExpenseReview,];
var __VLS_53;
var __VLS_54;
var __VLS_63;
/** @ts-ignore @type {typeof __VLS_components.AnnualEntryModalForm} */
data_input_1.AnnualEntryModalForm;
// @ts-ignore
var __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63(__assign(__assign(__assign({ 'onPatch': {} }, { 'onClose': {} }), { 'onSubmit': {} }), { open: (__VLS_ctx.showIncomeModal), title: (__VLS_ctx.incomeModalTitle), form: (__VLS_ctx.annualIncomeForm), loading: (__VLS_ctx.annualIncomeLoading), submitLabel: (__VLS_ctx.incomeSubmitLabel), categoryOptions: (__VLS_ctx.incomeCategories), subcategoryOptions: (__VLS_ctx.annualSubcategoryOptions), showOwnerField: (__VLS_ctx.showOwnerField), ownerOptions: (__VLS_ctx.ownerOptions), timeProfileOptions: (__VLS_ctx.incomeTimeProfileOptions), cashflowRoleOptions: (__VLS_ctx.incomeCashflowRoleOptions), showCashflowRoleField: (false), eventGroupOptions: (__VLS_ctx.annualEventGroupOptions), eventGroupDatalistId: "income-event-groups", namePlaceholder: "Concepto (ej: CTN, Regalos Pablo)", amountPlaceholder: (__VLS_ctx.incomeAmountInputPlaceholder) })));
var __VLS_65 = __VLS_64.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onPatch': {} }, { 'onClose': {} }), { 'onSubmit': {} }), { open: (__VLS_ctx.showIncomeModal), title: (__VLS_ctx.incomeModalTitle), form: (__VLS_ctx.annualIncomeForm), loading: (__VLS_ctx.annualIncomeLoading), submitLabel: (__VLS_ctx.incomeSubmitLabel), categoryOptions: (__VLS_ctx.incomeCategories), subcategoryOptions: (__VLS_ctx.annualSubcategoryOptions), showOwnerField: (__VLS_ctx.showOwnerField), ownerOptions: (__VLS_ctx.ownerOptions), timeProfileOptions: (__VLS_ctx.incomeTimeProfileOptions), cashflowRoleOptions: (__VLS_ctx.incomeCashflowRoleOptions), showCashflowRoleField: (false), eventGroupOptions: (__VLS_ctx.annualEventGroupOptions), eventGroupDatalistId: "income-event-groups", namePlaceholder: "Concepto (ej: CTN, Regalos Pablo)", amountPlaceholder: (__VLS_ctx.incomeAmountInputPlaceholder) })], __VLS_functionalComponentArgsRest(__VLS_64), false));
var __VLS_68;
var __VLS_69 = ({ patch: {} },
    { onPatch: (__VLS_ctx.patchAnnualIncomeForm) });
var __VLS_70 = ({ close: {} },
    { onClose: (__VLS_ctx.closeIncomeModal) });
var __VLS_71 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.submitAnnualIncome) });
var __VLS_66;
var __VLS_67;
var __VLS_72;
/** @ts-ignore @type {typeof __VLS_components.AnnualEntryModalForm} */
data_input_1.AnnualEntryModalForm;
// @ts-ignore
var __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72(__assign(__assign(__assign({ 'onPatch': {} }, { 'onClose': {} }), { 'onSubmit': {} }), { open: (__VLS_ctx.showExpenseModal), title: (__VLS_ctx.expenseModalTitle), form: (__VLS_ctx.annualExpenseForm), loading: (__VLS_ctx.annualExpenseLoading), submitLabel: (__VLS_ctx.expenseSubmitLabel), categoryOptions: (__VLS_ctx.expenseCategories), subcategoryOptions: (__VLS_ctx.annualExpenseSubcategoryOptions), showOwnerField: (__VLS_ctx.showOwnerField), ownerOptions: (__VLS_ctx.ownerOptions), timeProfileOptions: (__VLS_ctx.expenseTimeProfileOptions), timeProfileFieldLabel: "Tipo de salida", cashflowRoleOptions: (__VLS_ctx.filteredExpenseCashflowRoleOptions), showCashflowRoleField: (__VLS_ctx.showExpenseCashflowRoleField), showEventGroupField: (!__VLS_ctx.editingSystemGeneratedLiabilityExpense), showTermEndYearField: (!__VLS_ctx.editingSystemGeneratedLiabilityExpense), eventGroupOptions: (__VLS_ctx.annualEventGroupOptions), eventGroupDatalistId: "expense-event-groups", namePlaceholder: "Concepto (ej: Alimentacion, Hipoteca)", amountPlaceholder: (__VLS_ctx.expenseAmountInputPlaceholder), notesPlaceholder: (__VLS_ctx.expenseBulkEditHint) })));
var __VLS_74 = __VLS_73.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onPatch': {} }, { 'onClose': {} }), { 'onSubmit': {} }), { open: (__VLS_ctx.showExpenseModal), title: (__VLS_ctx.expenseModalTitle), form: (__VLS_ctx.annualExpenseForm), loading: (__VLS_ctx.annualExpenseLoading), submitLabel: (__VLS_ctx.expenseSubmitLabel), categoryOptions: (__VLS_ctx.expenseCategories), subcategoryOptions: (__VLS_ctx.annualExpenseSubcategoryOptions), showOwnerField: (__VLS_ctx.showOwnerField), ownerOptions: (__VLS_ctx.ownerOptions), timeProfileOptions: (__VLS_ctx.expenseTimeProfileOptions), timeProfileFieldLabel: "Tipo de salida", cashflowRoleOptions: (__VLS_ctx.filteredExpenseCashflowRoleOptions), showCashflowRoleField: (__VLS_ctx.showExpenseCashflowRoleField), showEventGroupField: (!__VLS_ctx.editingSystemGeneratedLiabilityExpense), showTermEndYearField: (!__VLS_ctx.editingSystemGeneratedLiabilityExpense), eventGroupOptions: (__VLS_ctx.annualEventGroupOptions), eventGroupDatalistId: "expense-event-groups", namePlaceholder: "Concepto (ej: Alimentacion, Hipoteca)", amountPlaceholder: (__VLS_ctx.expenseAmountInputPlaceholder), notesPlaceholder: (__VLS_ctx.expenseBulkEditHint) })], __VLS_functionalComponentArgsRest(__VLS_73), false));
var __VLS_77;
var __VLS_78 = ({ patch: {} },
    { onPatch: (__VLS_ctx.patchAnnualExpenseForm) });
var __VLS_79 = ({ close: {} },
    { onClose: (__VLS_ctx.closeExpenseModal) });
var __VLS_80 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.submitAnnualExpense) });
var __VLS_75;
var __VLS_76;
// @ts-ignore
[annualIncomeLoading, annualExpenseLoading, showIncomeModal, incomeModalTitle, annualIncomeForm, incomeSubmitLabel, data_input_1.incomeCategories, annualSubcategoryOptions, showOwnerField, showOwnerField, ownerOptions, ownerOptions, incomeTimeProfileOptions, incomeCashflowRoleOptions, annualEventGroupOptions, annualEventGroupOptions, incomeAmountInputPlaceholder, patchAnnualIncomeForm, closeIncomeModal, submitAnnualIncome, showExpenseModal, expenseModalTitle, annualExpenseForm, expenseSubmitLabel, data_input_1.expenseCategories, annualExpenseSubcategoryOptions, expenseTimeProfileOptions, filteredExpenseCashflowRoleOptions, showExpenseCashflowRoleField, editingSystemGeneratedLiabilityExpense, editingSystemGeneratedLiabilityExpense, expenseAmountInputPlaceholder, expenseBulkEditHint, patchAnnualExpenseForm, closeExpenseModal, submitAnnualExpense,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
