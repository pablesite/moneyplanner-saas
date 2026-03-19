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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var data_input_1 = require("@/domains/data-input");
var vue_router_1 = require("vue-router");
var ScoreGradeLabel_vue_1 = require("@/domains/guide/components/ScoreGradeLabel.vue");
var ScoreHealthBadge_vue_1 = require("@/domains/guide/components/ScoreHealthBadge.vue");
var ScoreMeterRow_vue_1 = require("@/domains/guide/components/ScoreMeterRow.vue");
var phaseDiagnostics_1 = require("@/domains/guide/phaseDiagnostics");
var phases_1 = require("@/domains/guide/phases");
var net_worth_1 = require("@/domains/net-worth");
var route = (0, vue_router_1.useRoute)();
var store = (0, net_worth_1.useNetWorthStore)();
var annualIncomeStore = (0, data_input_1.useAnnualIncomeStore)('saas');
var annualExpenseStore = (0, data_input_1.useAnnualExpenseStore)('saas');
var selectedExtraordinaryEventGroup = (0, vue_1.ref)('all');
var guideFiscalYear = (0, vue_1.computed)(function () { return new Date().getFullYear(); });
var phaseId = (0, vue_1.computed)(function () {
    var _a;
    var raw = String((_a = route.params.phaseId) !== null && _a !== void 0 ? _a : '');
    var parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
});
var phase = (0, vue_1.computed)(function () { return (phaseId.value == null ? null : (0, phases_1.findGuidePhaseById)(phaseId.value)); });
var isDebtPhase = (0, vue_1.computed)(function () { var _a; return ((_a = phase.value) === null || _a === void 0 ? void 0 : _a.id) === 1; });
var isCashFlowPhase = (0, vue_1.computed)(function () { var _a; return ((_a = phase.value) === null || _a === void 0 ? void 0 : _a.id) === 2; });
var isEmergencyFundPhase = (0, vue_1.computed)(function () { var _a; return ((_a = phase.value) === null || _a === void 0 ? void 0 : _a.id) === 3; });
var isNetWorthHealthPhase = (0, vue_1.computed)(function () { var _a; return ((_a = phase.value) === null || _a === void 0 ? void 0 : _a.id) === 4; });
var hasDiagnosticPhase = (0, vue_1.computed)(function () {
    return isDebtPhase.value ||
        isCashFlowPhase.value ||
        isEmergencyFundPhase.value ||
        isNetWorthHealthPhase.value;
});
var phaseQuickActions = (0, vue_1.computed)(function () {
    var _a;
    var phaseValue = phase.value;
    if (!phaseValue)
        return [];
    var actionsById = {
        1: [
            {
                id: 'net-worth',
                label: 'Patrimonio',
                to: '/patrimonio',
            },
            {
                id: 'data-input',
                label: 'Datos',
                to: '/introduccion-datos',
            },
            {
                id: 'budget',
                label: 'Presupuesto',
                to: '/presupuesto',
            },
        ],
        2: [
            {
                id: 'budget',
                label: 'Presupuesto',
                to: '/presupuesto',
            },
            {
                id: 'data-input',
                label: 'Datos',
                to: '/introduccion-datos',
            },
            {
                id: 'net-worth',
                label: 'Patrimonio',
                to: '/patrimonio',
            },
        ],
        3: [
            {
                id: 'net-worth',
                label: 'Patrimonio',
                to: '/patrimonio',
            },
            {
                id: 'budget',
                label: 'Presupuesto',
                to: '/presupuesto',
            },
            {
                id: 'data-input',
                label: 'Datos',
                to: '/introduccion-datos',
            },
        ],
        4: [
            {
                id: 'net-worth',
                label: 'Patrimonio',
                to: '/patrimonio',
            },
            {
                id: 'data-input',
                label: 'Datos',
                to: '/introduccion-datos',
            },
            {
                id: 'budget',
                label: 'Presupuesto',
                to: '/presupuesto',
            },
        ],
        5: [
            {
                id: 'net-worth',
                label: 'Patrimonio',
                to: '/patrimonio',
            },
            {
                id: 'budget',
                label: 'Presupuesto',
                to: '/presupuesto',
            },
            {
                id: 'data-input',
                label: 'Datos',
                to: '/introduccion-datos',
            },
        ],
    };
    return ((_a = actionsById[phaseValue.id]) !== null && _a !== void 0 ? _a : [
        {
            id: 'data-input',
            label: 'Datos',
            to: '/introduccion-datos',
        },
        {
            id: 'budget',
            label: 'Presupuesto',
            to: '/presupuesto',
        },
        {
            id: 'net-worth',
            label: 'Patrimonio',
            to: '/patrimonio',
        },
    ]);
});
var summaryExtended = (0, vue_1.computed)(function () { return store.summary; });
var sharedPhaseDiagnostics = (0, vue_1.computed)(function () {
    return (0, phaseDiagnostics_1.computeGuidePhaseDiagnostics)({
        summary: store.summary,
        assets: store.assets,
        liabilities: store.liabilities,
        annualIncomeEntries: annualIncomeStore.entries.value,
        annualExpenseEntries: annualExpenseStore.entries.value,
    });
});
function toNumber(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(/,/g, '.');
    var value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
}
function hasTextValue(raw) {
    return String(raw !== null && raw !== void 0 ? raw : '').trim() !== '';
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function formatNumber(n, decimals) {
    if (decimals === void 0) { decimals = 2; }
    return new Intl.NumberFormat('es-ES', {
        useGrouping: true,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n);
}
function formatPct(n, decimals) {
    if (decimals === void 0) { decimals = 0; }
    if (n == null || !Number.isFinite(n))
        return '-';
    return new Intl.NumberFormat('es-ES', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(n);
}
function formatPctFromPercentValue(n, decimals) {
    if (decimals === void 0) { decimals = 1; }
    if (n == null || !Number.isFinite(n))
        return '-';
    return formatPct(n / 100, decimals);
}
function valueToneFromSignedAmount(value) {
    if (!Number.isFinite(value))
        return 'neutral';
    if (value > 0)
        return 'positive';
    if (value < 0)
        return 'negative';
    return 'neutral';
}
function linearScoreIncreasing(value, min, max) {
    if (value == null || !Number.isFinite(value) || max <= min)
        return 0;
    var normalized = (value - min) / (max - min);
    return clamp(normalized * 100, 0, 100);
}
function linearScoreDecreasing(value, min, max) {
    if (value == null || !Number.isFinite(value) || max <= min)
        return 0;
    var normalized = (max - value) / (max - min);
    return clamp(normalized * 100, 0, 100);
}
function weightedScore(items) {
    var totalWeight = items.reduce(function (acc, item) { return acc + item.weight; }, 0);
    if (totalWeight <= 0)
        return 0;
    var sum = items.reduce(function (acc, item) { return acc + item.score * item.weight; }, 0);
    return clamp(sum / totalWeight, 0, 100);
}
var chartRows = (0, vue_1.computed)(function () {
    var chart = store.byCategoryChart;
    return chart.keys.map(function (key, index) {
        var _a, _b;
        return ({
            key: key,
            assets: Math.max(0, (_a = chart.assets[index]) !== null && _a !== void 0 ? _a : 0),
            liabilities: Math.max(0, (_b = chart.liabilities[index]) !== null && _b !== void 0 ? _b : 0),
        });
    });
});
var assetRows = (0, vue_1.computed)(function () { return chartRows.value.filter(function (row) { return row.assets > 0; }); });
var activeAssets = (0, vue_1.computed)(function () { return store.assets.filter(function (asset) { return asset.is_active; }); });
var activeLiabilities = (0, vue_1.computed)(function () {
    return store.liabilities.filter(function (liability) { return liability.is_active; });
});
var assetsValue = (0, vue_1.computed)(function () { var _a; return Math.max(0, toNumber((_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_assets)); });
var liabilitiesValue = (0, vue_1.computed)(function () { var _a; return Math.max(0, toNumber((_a = store.summary) === null || _a === void 0 ? void 0 : _a.total_liabilities)); });
var netWorthValue = (0, vue_1.computed)(function () { var _a; return toNumber((_a = store.summary) === null || _a === void 0 ? void 0 : _a.net_worth); });
var unbackedDebtValue = (0, vue_1.computed)(function () { var _a; return Math.max(0, toNumber((_a = summaryExtended.value) === null || _a === void 0 ? void 0 : _a.liabilities_unbacked)); });
function isPositiveTae(raw) {
    if (raw == null)
        return false;
    return toNumber(raw) > 0;
}
var illiquidInvestmentSubcategories = new Set([
    'pension_plans',
    'real_estate_crowd',
    'crowdlending',
    'other',
]);
var liquidInvestmentSubcategories = new Set([
    'deposits',
    'funds',
    'etfs',
    'roboadvisor',
    'stocks',
    'cryptocurrencies',
]);
var illiquidAssetsValue = (0, vue_1.computed)(function () {
    return activeAssets.value.reduce(function (acc, asset) {
        var amountBase = Math.max(0, toNumber(asset.amount_base));
        if (amountBase <= 0)
            return acc;
        var illiquidByCategory = asset.category === 'real_estate' ||
            asset.category === 'furnishings' ||
            asset.category === 'other';
        var illiquidByInvestmentSubcategory = asset.category === 'investments' &&
            illiquidInvestmentSubcategories.has(asset.subcategory || 'other');
        var illiquidByCashOtherDeposit = asset.category === 'cash' &&
            asset.subcategory === 'other' &&
            isPositiveTae(asset.annual_interest_tae);
        return illiquidByCategory || illiquidByInvestmentSubcategory || illiquidByCashOtherDeposit
            ? acc + amountBase
            : acc;
    }, 0);
});
var illiquidAssetsShareValue = (0, vue_1.computed)(function () {
    return assetsValue.value > 0 ? illiquidAssetsValue.value / assetsValue.value : null;
});
var emergencyLiquidAssetsValue = (0, vue_1.computed)(function () {
    return activeAssets.value.reduce(function (acc, asset) {
        var amountBase = Math.max(0, toNumber(asset.amount_base));
        if (amountBase <= 0)
            return acc;
        var isCashLiquidity = asset.category === 'cash';
        var isLiquidInvestment = asset.category === 'investments' &&
            liquidInvestmentSubcategories.has(asset.subcategory || 'other');
        return isCashLiquidity || isLiquidInvestment ? acc + amountBase : acc;
    }, 0);
});
var immediateLiquidityAssetsValue = (0, vue_1.computed)(function () {
    return activeAssets.value.reduce(function (acc, asset) {
        if (asset.category !== 'cash')
            return acc;
        var amountBase = Math.max(0, toNumber(asset.amount_base));
        return amountBase > 0 ? acc + amountBase : acc;
    }, 0);
});
var emergencyLiquidityToAssetsRatioValue = (0, vue_1.computed)(function () {
    return assetsValue.value > 0 ? emergencyLiquidAssetsValue.value / assetsValue.value : null;
});
var immediateLiquidityShareWithinEmergencyValue = (0, vue_1.computed)(function () {
    return emergencyLiquidAssetsValue.value > 0
        ? immediateLiquidityAssetsValue.value / emergencyLiquidAssetsValue.value
        : null;
});
var debtRows = (0, vue_1.computed)(function () {
    return activeLiabilities.value
        .map(function (liability) {
        var amountBase = Math.max(0, toNumber(liability.amount_base));
        var tae = liability.annual_interest_tae;
        var taePct = tae == null || String(tae).trim() === '' ? null : toNumber(tae);
        var hasKnownTae = taePct != null && Number.isFinite(taePct) && taePct >= 0;
        var paymentRaw = liability.estimated_monthly_payment_amount;
        var hasMonthlyPaymentInput = hasTextValue(paymentRaw);
        var monthlyPaymentAmount = hasMonthlyPaymentInput ? Math.max(0, toNumber(paymentRaw)) : 0;
        return {
            amountBase: amountBase,
            taePct: hasKnownTae ? taePct : null,
            hasMonthlyPaymentInput: hasMonthlyPaymentInput,
            monthlyPaymentAmount: monthlyPaymentAmount,
        };
    })
        .filter(function (row) { return row.amountBase > 0; });
});
var unbackedDebtToAssetsValue = (0, vue_1.computed)(function () {
    return assetsValue.value > 0 ? unbackedDebtValue.value / assetsValue.value : null;
});
var unbackedDebtToLiabilitiesValue = (0, vue_1.computed)(function () {
    return liabilitiesValue.value > 0 ? unbackedDebtValue.value / liabilitiesValue.value : null;
});
var topAssetShareValue = (0, vue_1.computed)(function () {
    var _a;
    if (assetsValue.value <= 0)
        return null;
    var topAssets = (_a = assetRows.value.map(function (row) { return row.assets; }).sort(function (a, b) { return b - a; })[0]) !== null && _a !== void 0 ? _a : 0;
    return topAssets / assetsValue.value;
});
var diversificationIndexValue = (0, vue_1.computed)(function () {
    if (assetsValue.value <= 0)
        return null;
    var shares = assetRows.value.map(function (row) { return row.assets / assetsValue.value; });
    if (!shares.length)
        return null;
    var hhi = shares.reduce(function (acc, share) { return acc + share * share; }, 0);
    var minHhi = 1 / 5;
    var maxHhi = 1;
    return clamp((maxHhi - hhi) / (maxHhi - minHhi), 0, 1);
});
var topLiabilityShareValue = (0, vue_1.computed)(function () {
    var _a;
    if (liabilitiesValue.value <= 0)
        return null;
    var topLiability = (_a = debtRows.value.map(function (row) { return row.amountBase; }).sort(function (a, b) { return b - a; })[0]) !== null && _a !== void 0 ? _a : 0;
    return topLiability / liabilitiesValue.value;
});
var maxLiabilityTaePctValue = (0, vue_1.computed)(function () {
    var taes = debtRows.value
        .map(function (row) { return row.taePct; })
        .filter(function (value) { return value != null && Number.isFinite(value); });
    if (!taes.length)
        return null;
    return Math.max.apply(Math, taes);
});
var weightedLiabilityTaePctValue = (0, vue_1.computed)(function () {
    var rows = debtRows.value.filter(function (row) { return row.taePct != null; });
    var denominator = rows.reduce(function (acc, row) { return acc + row.amountBase; }, 0);
    if (denominator <= 0)
        return null;
    var numerator = rows.reduce(function (acc, row) { var _a; return acc + row.amountBase * ((_a = row.taePct) !== null && _a !== void 0 ? _a : 0); }, 0);
    return numerator / denominator;
});
var liabilityTaeDispersionPctValue = (0, vue_1.computed)(function () {
    if (maxLiabilityTaePctValue.value == null || weightedLiabilityTaePctValue.value == null)
        return null;
    return Math.max(0, maxLiabilityTaePctValue.value - weightedLiabilityTaePctValue.value);
});
var liabilitiesWithAmountCountValue = (0, vue_1.computed)(function () { return debtRows.value.filter(function (row) { return row.amountBase > 0; }).length; });
var liabilitiesWithPaymentInputCountValue = (0, vue_1.computed)(function () { return debtRows.value.filter(function (row) { return row.hasMonthlyPaymentInput; }).length; });
var hasMissingDebtPaymentInputsValue = (0, vue_1.computed)(function () {
    return liabilitiesWithAmountCountValue.value > 0 &&
        liabilitiesWithPaymentInputCountValue.value < liabilitiesWithAmountCountValue.value;
});
var hasNoDebtPaymentInputsValue = (0, vue_1.computed)(function () {
    return liabilitiesWithAmountCountValue.value > 0 && liabilitiesWithPaymentInputCountValue.value === 0;
});
var totalMonthlyDebtPaymentValue = (0, vue_1.computed)(function () {
    return debtRows.value.reduce(function (acc, row) { return acc + row.monthlyPaymentAmount; }, 0);
});
var recurrentAnnualIncomeValue = (0, vue_1.computed)(function () {
    return annualIncomeStore.entries.value.reduce(function (acc, entry) {
        var _a, _b;
        return ((_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent')) !== 'one_off'
            ? acc + Number((_b = entry.amountAnnual) !== null && _b !== void 0 ? _b : 0)
            : acc;
    }, 0);
});
var oneOffAnnualIncomeValue = (0, vue_1.computed)(function () {
    return annualIncomeStore.entries.value.reduce(function (acc, entry) {
        var _a, _b;
        return ((_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent')) === 'one_off'
            ? acc + Number((_b = entry.amountAnnual) !== null && _b !== void 0 ? _b : 0)
            : acc;
    }, 0);
});
var totalAnnualIncomeValue = (0, vue_1.computed)(function () { return recurrentAnnualIncomeValue.value + oneOffAnnualIncomeValue.value; });
var recurrentAnnualExpenseValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a, _b;
        return ((_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.expenseType === 'one_off' ? 'one_off' : 'structural_recurrent')) !== 'one_off'
            ? acc + Number((_b = entry.amountAnnual) !== null && _b !== void 0 ? _b : 0)
            : acc;
    }, 0);
});
function resolveExpenseRole(entry) {
    if (entry.cashflowRole)
        return entry.cashflowRole;
    if (entry.category === 'savings_allocation')
        return 'savings';
    if (entry.category === 'financial_investments')
        return 'investment';
    if (entry.category === 'real_estate_assets' || entry.category === 'tangible_assets') {
        return entry.subcategory === 'real_estate_fees_taxes' ? 'tax_fee' : 'asset_purchase';
    }
    return 'operating';
}
function resolveExpenseTimeProfile(entry) {
    var _a;
    return ((_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.expenseType === 'one_off' ? 'one_off' : 'structural_recurrent'));
}
var recurrentOperationalExpenseValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) !== 'structural_recurrent')
            return acc;
        return resolveExpenseRole(entry) === 'operating' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc;
    }, 0);
});
var temporaryCommitmentExpenseValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) !== 'term_recurrent')
            return acc;
        return resolveExpenseRole(entry) === 'temporary_commitment'
            ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0)
            : acc;
    }, 0);
});
var recurrentSavingsAllocationValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) === 'one_off')
            return acc;
        return entry.category === 'savings_allocation' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc;
    }, 0);
});
var recurrentFinancialInvestmentAllocationValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) === 'one_off')
            return acc;
        return entry.category === 'financial_investments' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc;
    }, 0);
});
var recurrentRealEstateAllocationValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) === 'one_off')
            return acc;
        return entry.category === 'real_estate_assets' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc;
    }, 0);
});
var recurrentTangibleAllocationValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a;
        if (resolveExpenseTimeProfile(entry) === 'one_off')
            return acc;
        return entry.category === 'tangible_assets' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc;
    }, 0);
});
var oneOffAnnualExpenseValue = (0, vue_1.computed)(function () {
    return annualExpenseStore.entries.value.reduce(function (acc, entry) { var _a; return resolveExpenseTimeProfile(entry) === 'one_off' ? acc + Number((_a = entry.amountAnnual) !== null && _a !== void 0 ? _a : 0) : acc; }, 0);
});
var totalAnnualExpenseValue = (0, vue_1.computed)(function () { return recurrentAnnualExpenseValue.value + oneOffAnnualExpenseValue.value; });
var totalAnnualCashFlowValue = (0, vue_1.computed)(function () { return totalAnnualIncomeValue.value - totalAnnualExpenseValue.value; });
var recurrentExpenseToIncomeRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? recurrentOperationalExpenseValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var recurrentAfterCommitmentsMonthlyValue = (0, vue_1.computed)(function () {
    if (recurrentAnnualIncomeValue.value <= 0)
        return null;
    return ((recurrentAnnualIncomeValue.value -
        recurrentOperationalExpenseValue.value -
        temporaryCommitmentExpenseValue.value) /
        12);
});
var recurrentFinancialInvestmentAllocationRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? recurrentFinancialInvestmentAllocationValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var recurrentTangibleAllocationRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? recurrentTangibleAllocationValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var recurrentRealEstateAllocationRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? recurrentRealEstateAllocationValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var recurrentTotalCashFlowValue = (0, vue_1.computed)(function () { return recurrentAnnualIncomeValue.value - recurrentAnnualExpenseValue.value; });
var recurrentAfterCommitmentsCashFlowValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value -
        recurrentOperationalExpenseValue.value -
        temporaryCommitmentExpenseValue.value;
});
var recurrentPatrimonialAllocationTotalValue = (0, vue_1.computed)(function () {
    return recurrentSavingsAllocationValue.value +
        recurrentFinancialInvestmentAllocationValue.value +
        recurrentTangibleAllocationValue.value +
        recurrentRealEstateAllocationValue.value;
});
var extraordinaryEventGroupOptions = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d;
    var values = new Set();
    for (var _i = 0, _e = annualIncomeStore.entries.value; _i < _e.length; _i++) {
        var entry = _e[_i];
        var profile = (_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent');
        if (profile !== 'one_off')
            continue;
        var group = String((_b = entry.eventGroup) !== null && _b !== void 0 ? _b : '').trim();
        if (group)
            values.add(group);
    }
    for (var _f = 0, _g = annualExpenseStore.entries.value; _f < _g.length; _f++) {
        var entry = _g[_f];
        var profile = (_c = entry.timeProfile) !== null && _c !== void 0 ? _c : (entry.expenseType === 'one_off' ? 'one_off' : 'structural_recurrent');
        if (profile !== 'one_off')
            continue;
        var group = String((_d = entry.eventGroup) !== null && _d !== void 0 ? _d : '').trim();
        if (group)
            values.add(group);
    }
    return Array.from(values).sort(function (a, b) { return a.localeCompare(b, 'es'); });
});
var structuralOperatingMonthlyExpenseValue = (0, vue_1.computed)(function () {
    return recurrentOperationalExpenseValue.value > 0 ? recurrentOperationalExpenseValue.value / 12 : null;
});
var currentCommittedMonthlyExpenseValue = (0, vue_1.computed)(function () {
    var annualCommitted = recurrentOperationalExpenseValue.value + temporaryCommitmentExpenseValue.value;
    return annualCommitted > 0 ? annualCommitted / 12 : null;
});
var emergencyCoverageMonthsBaseValue = (0, vue_1.computed)(function () {
    return structuralOperatingMonthlyExpenseValue.value != null &&
        structuralOperatingMonthlyExpenseValue.value > 0
        ? emergencyLiquidAssetsValue.value / structuralOperatingMonthlyExpenseValue.value
        : null;
});
var emergencyCoverageMonthsCommittedValue = (0, vue_1.computed)(function () {
    return currentCommittedMonthlyExpenseValue.value != null && currentCommittedMonthlyExpenseValue.value > 0
        ? emergencyLiquidAssetsValue.value / currentCommittedMonthlyExpenseValue.value
        : null;
});
var selectedExtraordinaryEventGroupLabel = (0, vue_1.computed)(function () {
    return selectedExtraordinaryEventGroup.value === 'all'
        ? 'Todos los eventos'
        : selectedExtraordinaryEventGroup.value;
});
var filteredOneOffAnnualIncomeValue = (0, vue_1.computed)(function () {
    if (selectedExtraordinaryEventGroup.value === 'all')
        return oneOffAnnualIncomeValue.value;
    return annualIncomeStore.entries.value.reduce(function (acc, entry) {
        var _a, _b, _c;
        var profile = (_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent');
        if (profile !== 'one_off')
            return acc;
        return String((_b = entry.eventGroup) !== null && _b !== void 0 ? _b : '').trim() === selectedExtraordinaryEventGroup.value
            ? acc + Number((_c = entry.amountAnnual) !== null && _c !== void 0 ? _c : 0)
            : acc;
    }, 0);
});
var filteredOneOffAnnualExpenseValue = (0, vue_1.computed)(function () {
    if (selectedExtraordinaryEventGroup.value === 'all')
        return oneOffAnnualExpenseValue.value;
    return annualExpenseStore.entries.value.reduce(function (acc, entry) {
        var _a, _b, _c;
        var profile = (_a = entry.timeProfile) !== null && _a !== void 0 ? _a : (entry.expenseType === 'one_off' ? 'one_off' : 'structural_recurrent');
        if (profile !== 'one_off')
            return acc;
        return String((_b = entry.eventGroup) !== null && _b !== void 0 ? _b : '').trim() === selectedExtraordinaryEventGroup.value
            ? acc + Number((_c = entry.amountAnnual) !== null && _c !== void 0 ? _c : 0)
            : acc;
    }, 0);
});
var filteredExtraordinaryNetCashFlowValue = (0, vue_1.computed)(function () { return filteredOneOffAnnualIncomeValue.value - filteredOneOffAnnualExpenseValue.value; });
var extraordinaryVolumeRatioValue = (0, vue_1.computed)(function () {
    var numerator = Math.abs(oneOffAnnualIncomeValue.value) + Math.abs(oneOffAnnualExpenseValue.value);
    if (totalAnnualIncomeValue.value <= 0)
        return null;
    return numerator / totalAnnualIncomeValue.value;
});
var monthlyIncomeValue = (0, vue_1.computed)(function () {
    var _a;
    var annual = Number((_a = recurrentAnnualIncomeValue.value) !== null && _a !== void 0 ? _a : 0);
    if (!Number.isFinite(annual) || annual <= 0)
        return null;
    return annual / 12;
});
(0, vue_1.watch)(extraordinaryEventGroupOptions, function (options) {
    if (selectedExtraordinaryEventGroup.value !== 'all' &&
        !options.includes(selectedExtraordinaryEventGroup.value)) {
        selectedExtraordinaryEventGroup.value = 'all';
    }
});
function selectExtraordinaryEventGroup(value, event) {
    selectedExtraordinaryEventGroup.value = value;
    var target = event.currentTarget;
    var details = target === null || target === void 0 ? void 0 : target.closest('details');
    if (details)
        details.open = false;
}
var debtPaymentToIncomeValue = (0, vue_1.computed)(function () {
    if (liabilitiesValue.value <= 0)
        return 0;
    if (monthlyIncomeValue.value == null || monthlyIncomeValue.value <= 0)
        return null;
    if (hasNoDebtPaymentInputsValue.value)
        return null;
    return totalMonthlyDebtPaymentValue.value / monthlyIncomeValue.value;
});
var highInterestDebtThresholdPct = 8;
var highInterestDebtValue = (0, vue_1.computed)(function () {
    return debtRows.value.reduce(function (acc, row) {
        return row.taePct != null && row.taePct >= highInterestDebtThresholdPct ? acc + row.amountBase : acc;
    }, 0);
});
var highInterestDebtShareValue = (0, vue_1.computed)(function () {
    return liabilitiesValue.value > 0 ? highInterestDebtValue.value / liabilitiesValue.value : null;
});
var illiquidScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(illiquidAssetsShareValue.value, 0.25, 1);
});
var unbackedDebtScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(unbackedDebtToAssetsValue.value, 0.05, 0.35);
});
var concentrationScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(topAssetShareValue.value, 0.4, 0.9);
});
var diversificationScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(diversificationIndexValue.value, 0.2, 0.8);
});
var phase4SupportScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: unbackedDebtScoreValue.value, weight: 0.5 },
        { score: illiquidScoreValue.value, weight: 0.5 },
    ]);
});
var phase4RiskDistributionScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: concentrationScoreValue.value, weight: 0.5 },
        { score: diversificationScoreValue.value, weight: 0.5 },
    ]);
});
var phase4GlobalScoreValue = (0, vue_1.computed)(function () { return sharedPhaseDiagnostics.value.phase4GlobalScore; });
var debtMaxTaeScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(maxLiabilityTaePctValue.value, 0.5, 10);
});
var debtWeightedTaeScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(weightedLiabilityTaePctValue.value, 0.5, 10);
});
var debtPaymentToIncomeScoreValue = (0, vue_1.computed)(function () {
    return hasNoDebtPaymentInputsValue.value
        ? 100
        : linearScoreDecreasing(debtPaymentToIncomeValue.value, 0.15, 0.6);
});
var debtUnbackedScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(unbackedDebtToLiabilitiesValue.value, 0.01, 0.5);
});
var debtConcentrationScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(topLiabilityShareValue.value, 0.25, 0.95);
});
var debtHighInterestShareScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(highInterestDebtShareValue.value, 0.05, 0.6);
});
var phase1DebtCostScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: debtMaxTaeScoreValue.value, weight: 0.4 },
        { score: debtWeightedTaeScoreValue.value, weight: 0.4 },
        { score: debtPaymentToIncomeScoreValue.value, weight: 0.2 },
    ]);
});
var phase1DebtRiskScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: debtUnbackedScoreValue.value, weight: 0.4 },
        { score: debtConcentrationScoreValue.value, weight: 0.3 },
        { score: debtHighInterestShareScoreValue.value, weight: 0.3 },
    ]);
});
var phase1GlobalScoreValue = (0, vue_1.computed)(function () { return sharedPhaseDiagnostics.value.phase1GlobalScore; });
var cashFlowStructuralOperatingScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(recurrentExpenseToIncomeRatioValue.value, 0.5, 1);
});
var committedLoadToIncomeRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? (recurrentOperationalExpenseValue.value + temporaryCommitmentExpenseValue.value) /
            recurrentAnnualIncomeValue.value
        : null;
});
var temporaryCommitmentToIncomeRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? temporaryCommitmentExpenseValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var cashFlowCommittedLoadScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(committedLoadToIncomeRatioValue.value, 0.65, 1.05);
});
var cashFlowTemporaryCommitmentScoreValue = (0, vue_1.computed)(function () {
    return linearScoreDecreasing(temporaryCommitmentToIncomeRatioValue.value, 0.05, 0.35);
});
var totalAnnualCashFlowToRecurrentIncomeRatioValue = (0, vue_1.computed)(function () {
    return recurrentAnnualIncomeValue.value > 0
        ? totalAnnualCashFlowValue.value / recurrentAnnualIncomeValue.value
        : null;
});
var cashFlowTotalAnnualFlowScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(totalAnnualCashFlowToRecurrentIncomeRatioValue.value, -0.5, 0);
});
var phase2GlobalScoreValue = (0, vue_1.computed)(function () { return sharedPhaseDiagnostics.value.phase2GlobalScore; });
var emergencyCoverageBaseScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(emergencyCoverageMonthsBaseValue.value, 3, 12);
});
var emergencyCoverageCommittedScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(emergencyCoverageMonthsCommittedValue.value, 3, 12);
});
var emergencyLiquidityToAssetsScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(emergencyLiquidityToAssetsRatioValue.value, 0.05, 0.3);
});
var emergencyImmediateLiquidityQualityScoreValue = (0, vue_1.computed)(function () {
    return linearScoreIncreasing(immediateLiquidityShareWithinEmergencyValue.value, 0.4, 0.85);
});
var phase3CoverageScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: emergencyCoverageBaseScoreValue.value, weight: 0.65 },
        { score: emergencyCoverageCommittedScoreValue.value, weight: 0.35 },
    ]);
});
var phase3LiquidityQualityScoreValue = (0, vue_1.computed)(function () {
    return weightedScore([
        { score: emergencyLiquidityToAssetsScoreValue.value, weight: 0.5 },
        { score: emergencyImmediateLiquidityQualityScoreValue.value, weight: 0.5 },
    ]);
});
var phase3GlobalScoreValue = (0, vue_1.computed)(function () { return sharedPhaseDiagnostics.value.phase3GlobalScore; });
function toneFromScore(score) {
    if (score >= 75)
        return 'solid';
    if (score >= 55)
        return 'medium';
    if (score >= 35)
        return 'watch';
    return 'risk';
}
var globalScoreValue = (0, vue_1.computed)(function () {
    if (isDebtPhase.value)
        return phase1GlobalScoreValue.value;
    if (isCashFlowPhase.value)
        return phase2GlobalScoreValue.value;
    if (isEmergencyFundPhase.value)
        return phase3GlobalScoreValue.value;
    if (isNetWorthHealthPhase.value)
        return phase4GlobalScoreValue.value;
    return 0;
});
var globalToneValue = (0, vue_1.computed)(function () { return toneFromScore(globalScoreValue.value); });
var globalLabelValue = (0, vue_1.computed)(function () {
    var tone = globalToneValue.value;
    if (isDebtPhase.value) {
        if (tone === 'solid')
            return 'Deuda saneada';
        if (tone === 'medium')
            return 'Deuda controlada';
        if (tone === 'watch')
            return 'Deuda en vigilancia';
        return 'Deuda critica';
    }
    if (isCashFlowPhase.value) {
        if (tone === 'solid')
            return 'Flujo operativo solido';
        if (tone === 'medium')
            return 'Flujo operativo estable';
        if (tone === 'watch')
            return 'Flujo operativo ajustado';
        return 'Flujo operativo en tension';
    }
    if (isEmergencyFundPhase.value) {
        if (tone === 'solid')
            return 'Colchon robusto';
        if (tone === 'medium')
            return 'Colchon suficiente';
        if (tone === 'watch')
            return 'Colchon justo';
        return 'Colchon insuficiente';
    }
    if (tone === 'solid')
        return 'Salud patrimonial solida';
    if (tone === 'medium')
        return 'Salud patrimonial equilibrada';
    if (tone === 'watch')
        return 'Salud patrimonial mejorable';
    return 'Salud patrimonial vulnerable';
});
var phase4ScoreCards = (0, vue_1.computed)(function () { return [
    {
        id: 'support',
        title: 'Respaldo patrimonial',
        score: phase4SupportScoreValue.value,
        description: 'Calidad de respaldo del patrimonio frente a iliquidez y deuda no respaldada.',
        kpis: [
            {
                id: 'unbacked-debt-assets',
                label: '% deuda sin respaldo / activos',
                valueText: formatPct(unbackedDebtToAssetsValue.value, 0),
                score: unbackedDebtScoreValue.value,
                hint: 'Pasivos sin activo asociado (inverso)',
            },
            {
                id: 'illiquid-assets',
                label: '% activos iliquidos',
                valueText: formatPct(illiquidAssetsShareValue.value, 0),
                score: illiquidScoreValue.value,
                hint: 'Inmuebles + mobiliario + otros + inversiones iliquidas + liquidez/otros con TAE (inverso)',
            },
        ],
    },
    {
        id: 'distribution',
        title: 'Distribucion del riesgo',
        score: phase4RiskDistributionScoreValue.value,
        description: 'Dependencia de un unico bloque frente a reparto patrimonial equilibrado.',
        kpis: [
            {
                id: 'top-share',
                label: 'Concentracion top activo',
                valueText: formatPct(topAssetShareValue.value, 0),
                score: concentrationScoreValue.value,
                hint: 'Peso del activo dominante (inverso)',
            },
            {
                id: 'diversification',
                label: 'Indice de diversificacion',
                valueText: formatPct(diversificationIndexValue.value, 0),
                score: diversificationScoreValue.value,
                hint: 'HHI normalizado',
            },
        ],
    },
]; });
var phase1ScoreCards = (0, vue_1.computed)(function () { return [
    {
        id: 'debt-cost',
        title: 'Coste y visibilidad de deuda',
        score: phase1DebtCostScoreValue.value,
        description: 'Coste financiero de los pasivos y calidad del dato de TAE para priorizar amortizacion.',
        kpis: [
            {
                id: 'max-liability-tae',
                label: 'TAE maxima de pasivos',
                valueText: formatPctFromPercentValue(maxLiabilityTaePctValue.value, 1),
                score: debtMaxTaeScoreValue.value,
                hint: 'Peor pasivo por coste (inverso)',
            },
            {
                id: 'weighted-liability-tae',
                label: 'TAE media ponderada',
                valueText: formatPctFromPercentValue(weightedLiabilityTaePctValue.value, 1),
                score: debtWeightedTaeScoreValue.value,
                hint: 'Coste medio ponderado por importe (inverso)',
            },
            {
                id: 'debt-payment-income',
                label: '% cuota / ingresos',
                valueText: formatPct(debtPaymentToIncomeValue.value, 0),
                score: debtPaymentToIncomeScoreValue.value,
                hint: 'Suma de cuotas mensuales manuales / ingreso mensual recurrente (inverso)',
                incomplete: hasMissingDebtPaymentInputsValue.value,
            },
        ],
    },
    {
        id: 'debt-structure',
        title: 'Riesgo estructural de deuda',
        score: phase1DebtRiskScoreValue.value,
        description: 'Respaldo, concentracion y exposicion a deuda cara para ordenar el plan de reduccion.',
        kpis: [
            {
                id: 'unbacked-debt-liabilities',
                label: '% deuda sin respaldo / pasivos',
                valueText: formatPct(unbackedDebtToLiabilitiesValue.value, 0),
                score: debtUnbackedScoreValue.value,
                hint: 'Pasivo sin activo asociado (inverso)',
            },
            {
                id: 'top-liability-share',
                label: 'Concentracion top pasivo',
                valueText: formatPct(topLiabilityShareValue.value, 0),
                score: debtConcentrationScoreValue.value,
                hint: 'Peso del mayor pasivo sobre el total (inverso)',
            },
            {
                id: 'high-interest-debt-share',
                label: "% deuda con TAE >= ".concat(highInterestDebtThresholdPct, "%"),
                valueText: formatPct(highInterestDebtShareValue.value, 0),
                score: debtHighInterestShareScoreValue.value,
                hint: 'Exposicion a deuda cara (inverso)',
            },
        ],
    },
]; });
var phase2ScoreCards = (0, vue_1.computed)(function () { return [
    {
        id: 'cashflow-recurrent-tension',
        title: 'Tension de caja (recurrente)',
        score: weightedScore([
            { score: cashFlowStructuralOperatingScoreValue.value, weight: 0.4 },
            { score: cashFlowCommittedLoadScoreValue.value, weight: 0.35 },
        ]),
        description: 'Lectura principal de tension recurrente: coste de vida base y carga actual de caja incluyendo compromisos temporales.',
        kpis: [
            {
                id: 'structural-operating-ratio',
                label: 'Base de gasto estructural (% ingresos recurrentes)',
                valueText: formatPct(recurrentExpenseToIncomeRatioValue.value, 0),
                score: cashFlowStructuralOperatingScoreValue.value,
                hint: 'Coste de vida base. Menor es mejor (score inverso).',
            },
            {
                id: 'committed-load-ratio',
                label: 'Tension total actual de caja (% ingresos recurrentes)',
                valueText: formatPct(committedLoadToIncomeRatioValue.value, 0),
                score: cashFlowCommittedLoadScoreValue.value,
                hint: 'Gasto base + cargas temporales de caja. Menor es mejor (score inverso).',
                detailText: recurrentAfterCommitmentsMonthlyValue.value == null
                    ? undefined
                    : "Colchon mensual tras cargas temporales: ".concat(formatNumber(recurrentAfterCommitmentsMonthlyValue.value, 2)),
            },
        ],
    },
    {
        id: 'cashflow-temporality-and-year-close',
        title: 'Temporalidad y cierre anual',
        score: weightedScore([
            { score: cashFlowTemporaryCommitmentScoreValue.value, weight: 0.15 },
            { score: cashFlowTotalAnnualFlowScoreValue.value, weight: 0.1 },
        ]),
        description: 'Complemento del diagnostico: peso de compromisos temporales y resultado anual total (incluye extraordinarios y asignacion patrimonial).',
        kpis: [
            {
                id: 'temporary-commitment-ratio',
                label: 'Peso de cargas temporales de caja (% ingresos recurrentes)',
                valueText: formatPct(temporaryCommitmentToIncomeRatioValue.value, 0),
                score: cashFlowTemporaryCommitmentScoreValue.value,
                hint: 'Parte de la tension que viene de cuotas con fecha fin. Menor es mejor (score inverso).',
            },
            {
                id: 'total-annual-cash-flow-ratio',
                label: 'Resultado anual total (% ingresos recurrentes)',
                valueText: formatPct(totalAnnualCashFlowToRecurrentIncomeRatioValue.value, 0),
                score: cashFlowTotalAnnualFlowScoreValue.value,
                hint: 'Resultado anual completo de caja (recurrente + puntual). Incluye asignacion patrimonial y extraordinarios. Mayor es mejor.',
                detailText: "Ingresos anuales totales ".concat(formatNumber(totalAnnualIncomeValue.value, 2), " \u00B7 Gastos anuales totales ").concat(formatNumber(totalAnnualExpenseValue.value, 2), " \u00B7 Flujo anual total ").concat(formatNumber(totalAnnualCashFlowValue.value, 2)),
            },
        ],
    },
]; });
var phase2DistributionInfoCards = (0, vue_1.computed)(function () { return [
    {
        id: 'cashflow-savings-distribution',
        title: 'Distribucion del ahorro',
        description: 'Indicadores informativos de asignacion recurrente a patrimonio sobre ingresos recurrentes.',
        kpis: [
            {
                id: 'financial-investments-income',
                label: '% inversiones / ingresos recurrentes',
                valueText: formatPct(recurrentFinancialInvestmentAllocationRatioValue.value, 0),
                score: null,
                hint: 'Categoria inversiones financieras / ingresos recurrentes',
            },
            {
                id: 'tangible-assets-income',
                label: '% activos mobiliarios / ingresos recurrentes',
                valueText: formatPct(recurrentTangibleAllocationRatioValue.value, 0),
                score: null,
                hint: 'Categoria activos mobiliarios / ingresos recurrentes',
            },
            {
                id: 'real-estate-assets-income',
                label: '% activos inmobiliarios / ingresos recurrentes',
                valueText: formatPct(recurrentRealEstateAllocationRatioValue.value, 0),
                score: null,
                hint: 'Categoria activos inmobiliarios / ingresos recurrentes',
            },
        ],
    },
]; });
var phase3ScoreCards = (0, vue_1.computed)(function () { return [
    {
        id: 'emergency-coverage',
        title: 'Cobertura del colchon',
        score: phase3CoverageScoreValue.value,
        description: 'Cobertura de liquidez util medida contra gasto base (Fase 2) y carga actual incluyendo compromisos temporales.',
        kpis: [
            {
                id: 'emergency-months-base',
                label: 'Meses de gasto base cubiertos',
                valueText: emergencyCoverageMonthsBaseValue.value == null
                    ? '-'
                    : "".concat(formatNumber(emergencyCoverageMonthsBaseValue.value, 1), " meses"),
                score: emergencyCoverageBaseScoreValue.value,
                hint: 'Liquidez util / gasto operativo estructural mensual. Mayor es mejor.',
            },
            {
                id: 'emergency-months-committed',
                label: 'Meses de gasto actual cubiertos',
                valueText: emergencyCoverageMonthsCommittedValue.value == null
                    ? '-'
                    : "".concat(formatNumber(emergencyCoverageMonthsCommittedValue.value, 1), " meses"),
                score: emergencyCoverageCommittedScoreValue.value,
                hint: 'Liquidez util / (gasto estructural + cargas temporales) mensual. Mayor es mejor.',
                detailText: currentCommittedMonthlyExpenseValue.value == null
                    ? undefined
                    : "Carga mensual actual estimada: ".concat(formatNumber(currentCommittedMonthlyExpenseValue.value, 2)),
            },
        ],
    },
    {
        id: 'emergency-liquidity-quality',
        title: 'Calidad de liquidez',
        score: phase3LiquidityQualityScoreValue.value,
        description: 'Peso de la liquidez dentro del patrimonio y porcentaje de liquidez inmediata dentro del colchon.',
        kpis: [
            {
                id: 'emergency-liquidity-assets-ratio',
                label: '% liquidez util / activos',
                valueText: formatPct(emergencyLiquidityToAssetsRatioValue.value, 0),
                score: emergencyLiquidityToAssetsScoreValue.value,
                hint: 'Liquidez util disponible para emergencia sobre activos totales. Mayor es mejor.',
            },
            {
                id: 'immediate-liquidity-share',
                label: '% liquidez inmediata / liquidez util',
                valueText: formatPct(immediateLiquidityShareWithinEmergencyValue.value, 0),
                score: emergencyImmediateLiquidityQualityScoreValue.value,
                hint: 'Parte del colchon que esta en cash y acceso inmediato. Mayor es mejor.',
            },
        ],
    },
]; });
var scoreCards = (0, vue_1.computed)(function () {
    if (isDebtPhase.value)
        return phase1ScoreCards.value;
    if (isCashFlowPhase.value)
        return phase2ScoreCards.value;
    if (isEmergencyFundPhase.value)
        return phase3ScoreCards.value;
    if (isNetWorthHealthPhase.value)
        return phase4ScoreCards.value;
    return [];
});
var cashFlowSummarySections = (0, vue_1.computed)(function () {
    if (!isCashFlowPhase.value)
        return [];
    return [
        {
            id: 'cashflow-core',
            title: 'Caja Recurrente',
            description: 'Lectura principal de tension de caja: base operativa y cargas temporales de caja.',
            columns: 4,
            cards: [
                {
                    id: 'income-recurrent',
                    label: 'Ingresos recurrentes anuales',
                    valueText: formatNumber(recurrentAnnualIncomeValue.value, 2),
                    valueTone: 'neutral',
                    metaText: recurrentAnnualIncomeValue.value > 0
                        ? "".concat(formatNumber(recurrentAnnualIncomeValue.value / 12, 2), " / mes")
                        : undefined,
                },
                {
                    id: 'expense-operating-structural',
                    label: 'Gasto operativo estructural',
                    valueText: formatNumber(recurrentOperationalExpenseValue.value, 2),
                    valueTone: 'warning',
                    metaText: recurrentOperationalExpenseValue.value > 0
                        ? "".concat(formatNumber(recurrentOperationalExpenseValue.value / 12, 2), " / mes")
                        : undefined,
                },
                {
                    id: 'expense-temporary-commitments',
                    label: 'Cargas temporales de caja',
                    valueText: formatNumber(temporaryCommitmentExpenseValue.value, 2),
                    valueTone: temporaryCommitmentExpenseValue.value > 0 ? 'warning' : 'neutral',
                    metaText: temporaryCommitmentExpenseValue.value > 0
                        ? "".concat(formatNumber(temporaryCommitmentExpenseValue.value / 12, 2), " / mes")
                        : 'Sin carga temporal',
                },
                {
                    id: 'cashflow-recurrent-after-commitments',
                    label: 'Colchon tras cargas temporales',
                    valueText: formatNumber(recurrentAfterCommitmentsCashFlowValue.value, 2),
                    valueTone: valueToneFromSignedAmount(recurrentAfterCommitmentsCashFlowValue.value),
                    metaText: recurrentAfterCommitmentsMonthlyValue.value == null
                        ? undefined
                        : "".concat(formatNumber(recurrentAfterCommitmentsMonthlyValue.value, 2), " / mes"),
                },
            ],
        },
        {
            id: 'cashflow-context',
            title: 'Contexto de Flujo',
            description: 'Contexto anual para no confundir caja operativa con asignacion patrimonial.',
            columns: 4,
            cards: [
                {
                    id: 'expense-recurrent-total',
                    label: 'Salidas recurrentes totales',
                    valueText: formatNumber(recurrentAnnualExpenseValue.value, 2),
                    valueTone: 'warning',
                    metaText: 'Incluye ahorro e inversion',
                },
                {
                    id: 'cashflow-recurrent-annual',
                    label: 'Flujo recurrente neto total',
                    valueText: formatNumber(recurrentTotalCashFlowValue.value, 2),
                    valueTone: valueToneFromSignedAmount(recurrentTotalCashFlowValue.value),
                    metaText: 'Tras todas las salidas recurrentes',
                },
                {
                    id: 'cashflow-total-annual',
                    label: 'Flujo anual total',
                    valueText: formatNumber(totalAnnualCashFlowValue.value, 2),
                    valueTone: valueToneFromSignedAmount(totalAnnualCashFlowValue.value),
                    metaText: 'Incluye extraordinarios',
                },
                {
                    id: 'extraordinary-volume-ratio',
                    label: 'Peso de extraordinarios',
                    valueText: formatPct(extraordinaryVolumeRatioValue.value, 0),
                    valueTone: extraordinaryVolumeRatioValue.value != null &&
                        extraordinaryVolumeRatioValue.value > 0.25
                        ? 'warning'
                        : 'neutral',
                    metaText: 'Volumen de ingresos+gastos puntuales',
                },
            ],
        },
        {
            id: 'cashflow-patrimonial',
            title: 'Asignacion Patrimonial Recurrente',
            description: 'Asignaciones recurrentes no operativas (informativas, no puntuan el score).',
            columns: 4,
            cards: [
                {
                    id: 'patrimonial-total',
                    label: 'Asignacion patrimonial recurrente total',
                    valueText: formatNumber(recurrentPatrimonialAllocationTotalValue.value, 2),
                    valueTone: 'positive',
                    metaText: recurrentAnnualIncomeValue.value > 0
                        ? formatPct(recurrentPatrimonialAllocationTotalValue.value / recurrentAnnualIncomeValue.value, 0) + ' de ingresos recurrentes'
                        : undefined,
                },
                {
                    id: 'savings-allocation-recurrent',
                    label: 'Ahorro recurrente',
                    valueText: formatNumber(recurrentSavingsAllocationValue.value, 2),
                    valueTone: 'positive',
                },
                {
                    id: 'financial-investments-allocation-recurrent',
                    label: 'Inversiones financieras recurrentes',
                    valueText: formatNumber(recurrentFinancialInvestmentAllocationValue.value, 2),
                    valueTone: 'positive',
                },
                {
                    id: 'assets-allocation-mixed',
                    label: 'Activos (mobiliarios + inmobiliarios)',
                    valueText: formatNumber(recurrentTangibleAllocationValue.value + recurrentRealEstateAllocationValue.value, 2),
                    valueTone: 'positive',
                    metaText: "Mobiliarios ".concat(formatNumber(recurrentTangibleAllocationValue.value, 2), " \u00B7 Inmobiliarios ").concat(formatNumber(recurrentRealEstateAllocationValue.value, 2)),
                },
            ],
        },
        {
            id: 'cashflow-extraordinary',
            title: 'Extraordinarios',
            description: 'Eventos puntuales del ano (visibles como contexto, separados del score principal).',
            columns: 4,
            cards: [
                {
                    id: 'income-one-off',
                    label: 'Ingresos extraordinarios',
                    valueText: formatNumber(filteredOneOffAnnualIncomeValue.value, 2),
                    valueTone: filteredOneOffAnnualIncomeValue.value > 0 ? 'positive' : 'neutral',
                    metaText: selectedExtraordinaryEventGroup.value === 'all'
                        ? undefined
                        : "Evento: ".concat(selectedExtraordinaryEventGroupLabel.value),
                },
                {
                    id: 'expense-one-off',
                    label: 'Gastos extraordinarios',
                    valueText: formatNumber(filteredOneOffAnnualExpenseValue.value, 2),
                    valueTone: filteredOneOffAnnualExpenseValue.value > 0 ? 'warning' : 'neutral',
                    metaText: selectedExtraordinaryEventGroup.value === 'all'
                        ? undefined
                        : "Evento: ".concat(selectedExtraordinaryEventGroupLabel.value),
                },
                {
                    id: 'cashflow-one-off-net',
                    label: 'Flujo extraordinario neto',
                    valueText: formatNumber(filteredExtraordinaryNetCashFlowValue.value, 2),
                    valueTone: valueToneFromSignedAmount(filteredExtraordinaryNetCashFlowValue.value),
                    metaText: selectedExtraordinaryEventGroup.value === 'all'
                        ? 'Todos los eventos puntuales'
                        : "Evento: ".concat(selectedExtraordinaryEventGroupLabel.value),
                },
                {
                    id: 'cashflow-one-off-grouping',
                    label: 'Filtro por evento',
                    valueText: selectedExtraordinaryEventGroupLabel.value,
                    valueTone: 'neutral',
                    metaText: 'Usa Grupo de evento para aislar una operacion puntual',
                },
            ],
        },
    ];
});
var cashFlowHeroSummaryCards = (0, vue_1.computed)(function () {
    var _a, _b;
    if (!isCashFlowPhase.value)
        return [];
    return (_b = (_a = cashFlowSummarySections.value[0]) === null || _a === void 0 ? void 0 : _a.cards) !== null && _b !== void 0 ? _b : [];
});
var cashFlowContextSummarySections = (0, vue_1.computed)(function () {
    if (!isCashFlowPhase.value)
        return [];
    return cashFlowSummarySections.value.slice(1);
});
var summaryCards = (0, vue_1.computed)(function () {
    if (isDebtPhase.value) {
        return [
            {
                id: 'liabilities-total',
                label: 'Pasivos totales',
                valueText: formatNumber(liabilitiesValue.value, 2),
            },
            {
                id: 'unbacked-debt',
                label: 'Deuda sin respaldo',
                valueText: formatNumber(unbackedDebtValue.value, 2),
            },
            {
                id: 'high-interest-debt',
                label: "Deuda TAE >= ".concat(highInterestDebtThresholdPct, "%"),
                valueText: formatNumber(highInterestDebtValue.value, 2),
            },
            {
                id: 'tae-dispersion',
                label: 'Dispersion de TAE',
                valueText: formatPctFromPercentValue(liabilityTaeDispersionPctValue.value, 1),
            },
        ];
    }
    if (isNetWorthHealthPhase.value) {
        return [
            {
                id: 'net-worth',
                label: 'Patrimonio neto',
                valueText: formatNumber(netWorthValue.value, 2),
            },
            {
                id: 'assets-total',
                label: 'Activos totales',
                valueText: formatNumber(assetsValue.value, 2),
            },
            {
                id: 'liabilities-total',
                label: 'Pasivos totales',
                valueText: formatNumber(liabilitiesValue.value, 2),
            },
            {
                id: 'unbacked-debt',
                label: 'Deuda sin respaldo',
                valueText: formatNumber(unbackedDebtValue.value, 2),
            },
        ];
    }
    if (isEmergencyFundPhase.value) {
        return [
            {
                id: 'emergency-liquid-assets',
                label: 'Liquidez util para emergencia',
                valueText: formatNumber(emergencyLiquidAssetsValue.value, 2),
            },
            {
                id: 'emergency-immediate-liquidity',
                label: 'Liquidez inmediata',
                valueText: formatNumber(immediateLiquidityAssetsValue.value, 2),
            },
            {
                id: 'emergency-months-base',
                label: 'Meses gasto base',
                valueText: emergencyCoverageMonthsBaseValue.value == null
                    ? '-'
                    : "".concat(formatNumber(emergencyCoverageMonthsBaseValue.value, 1), "m"),
            },
            {
                id: 'emergency-months-committed',
                label: 'Meses carga actual',
                valueText: emergencyCoverageMonthsCommittedValue.value == null
                    ? '-'
                    : "".concat(formatNumber(emergencyCoverageMonthsCommittedValue.value, 1), "m"),
            },
        ];
    }
    if (isCashFlowPhase.value) {
        return [
            {
                id: 'cashflow-recurrent-annual',
                label: 'Flujo anual recurrente',
                valueText: formatNumber(recurrentTotalCashFlowValue.value, 2),
            },
            {
                id: 'cashflow-recurrent-after-commitments',
                label: 'Flujo recurrente tras cargas temporales',
                valueText: formatNumber(recurrentAfterCommitmentsCashFlowValue.value, 2),
            },
            {
                id: 'cashflow-total-annual',
                label: 'Flujo anual total',
                valueText: formatNumber(totalAnnualCashFlowValue.value, 2),
            },
            {
                id: 'savings-allocation-recurrent',
                label: 'Asignacion recurrente a ahorro',
                valueText: formatNumber(recurrentSavingsAllocationValue.value, 2),
            },
        ];
    }
    return [];
});
var cashFlowDistortionWarning = (0, vue_1.computed)(function () {
    if (!isCashFlowPhase.value)
        return null;
    if (extraordinaryVolumeRatioValue.value == null)
        return null;
    if (extraordinaryVolumeRatioValue.value <= 0.25)
        return null;
    return "Ano con eventos extraordinarios (".concat(formatPct(extraordinaryVolumeRatioValue.value, 0), " del ingreso total). El score prioriza tension recurrente estructural y cargas temporales de caja.");
});
var phaseDiagnosticCopy = (0, vue_1.computed)(function () {
    var _a, _b;
    if (isDebtPhase.value) {
        return 'Diagnostico de deuda: coste, respaldo y concentracion para priorizar amortizacion.';
    }
    if (isNetWorthHealthPhase.value) {
        return 'Diagnostico de salud patrimonial: respaldo patrimonial y distribucion del riesgo.';
    }
    if (isCashFlowPhase.value) {
        return 'Diagnostico de flujo de caja: score compuesto de tension recurrente (operativo estructural + cargas temporales de caja) y contexto extraordinario separado.';
    }
    if (isEmergencyFundPhase.value) {
        return 'Diagnostico de fondo de emergencia: cobertura del colchon usando liquidez util (baseline Fase 4) contra gasto base y carga actual (semantica Fase 2).';
    }
    return (_b = (_a = phase.value) === null || _a === void 0 ? void 0 : _a.objective) !== null && _b !== void 0 ? _b : '';
});
function maybeLoadNetWorthContext() {
    if (!hasDiagnosticPhase.value)
        return;
    void store.fetchSettings();
    void store.refreshAll();
    if (isDebtPhase.value || isCashFlowPhase.value) {
        void annualIncomeStore.loadAll(guideFiscalYear.value);
    }
    if (isCashFlowPhase.value || isEmergencyFundPhase.value) {
        void annualExpenseStore.loadAll(guideFiscalYear.value);
    }
}
function phaseDetailTo(phaseIdParam) {
    return "/guia/fases/".concat(phaseIdParam);
}
(0, vue_1.watch)(phaseId, function () {
    maybeLoadNetWorthContext();
}, { immediate: true });
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ui-guide-back-link']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-phase-inline-action-link']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-context-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-context-details']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-context-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-score-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid-cols-4']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-score-top']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid-cols-2']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid-cols-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container ui-pro-page" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-guide-phase-head" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-guide-phase-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-phase-nav-row" }));
/** @type {__VLS_StyleScopedClasses['ui-guide-phase-nav-row']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-phase-nav-links" }));
/** @type {__VLS_StyleScopedClasses['ui-guide-phase-nav-links']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
vue_router_1.RouterLink;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "ui-guide-back-link" }, { to: "/" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "ui-guide-back-link" }, { to: "/" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['ui-guide-back-link']} */ ;
var __VLS_5 = __VLS_3.slots.default;
var __VLS_3;
if (__VLS_ctx.phaseQuickActions.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-phase-inline-actions" }));
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-inline-actions']} */ ;
    for (var _i = 0, _c = __VLS_vFor((__VLS_ctx.phaseQuickActions)); _i < _c.length; _i++) {
        var action = _c[_i][0];
        var __VLS_6 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        vue_router_1.RouterLink;
        // @ts-ignore
        var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign(__assign({ key: (action.id) }, { class: "ui-guide-phase-inline-action-link" }), { to: (action.to) })));
        var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign({ key: (action.id) }, { class: "ui-guide-phase-inline-action-link" }), { to: (action.to) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
        /** @type {__VLS_StyleScopedClasses['ui-guide-phase-inline-action-link']} */ ;
        var __VLS_11 = __VLS_9.slots.default;
        (action.label);
        // @ts-ignore
        [phaseQuickActions, phaseQuickActions,];
        var __VLS_9;
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-phase-switch" }));
/** @type {__VLS_StyleScopedClasses['ui-guide-phase-switch']} */ ;
for (var _d = 0, _e = __VLS_vFor((__VLS_ctx.guidePhases)); _d < _e.length; _d++) {
    var phaseItem = _e[_d][0];
    var __VLS_12 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    vue_router_1.RouterLink;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign(__assign(__assign({ key: (phaseItem.id) }, { class: "ui-guide-phase-switch-link" }), { class: ({ 'ui-guide-phase-switch-link-active': phaseItem.id === ((_a = __VLS_ctx.phase) === null || _a === void 0 ? void 0 : _a.id) }) }), { to: (__VLS_ctx.phaseDetailTo(phaseItem.id)) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign(__assign(__assign({ key: (phaseItem.id) }, { class: "ui-guide-phase-switch-link" }), { class: ({ 'ui-guide-phase-switch-link-active': phaseItem.id === ((_b = __VLS_ctx.phase) === null || _b === void 0 ? void 0 : _b.id) }) }), { to: (__VLS_ctx.phaseDetailTo(phaseItem.id)) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-switch-link']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-switch-link-active']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    (phaseItem.id);
    // @ts-ignore
    [phases_1.guidePhases, phase, phaseDetailTo,];
    var __VLS_15;
    // @ts-ignore
    [];
}
if (__VLS_ctx.phase) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "h1 ui-guide-phase-title ui-guide-phase-title-inline" }));
    /** @type {__VLS_StyleScopedClasses['h1']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-title']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-title-inline']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-pro-kicker ui-guide-phase-title-inline-kicker" }));
    /** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-title-inline-kicker']} */ ;
    (__VLS_ctx.phase.id);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-pro-kicker ui-guide-phase-title-inline-name" }));
    /** @type {__VLS_StyleScopedClasses['ui-pro-kicker']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-title-inline-name']} */ ;
    (__VLS_ctx.phase.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle ui-guide-phase-copy" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-copy']} */ ;
    (__VLS_ctx.phaseDiagnosticCopy);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "h1 ui-guide-phase-title" }));
    /** @type {__VLS_StyleScopedClasses['h1']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-phase-title']} */ ;
}
if (!__VLS_ctx.phase) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
}
else if (!__VLS_ctx.hasDiagnosticPhase) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "h2" }));
    /** @type {__VLS_StyleScopedClasses['h2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtle" }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)(__assign({ class: "list" }));
    /** @type {__VLS_StyleScopedClasses['list']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    (__VLS_ctx.phase.objective);
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
    (__VLS_ctx.phase.focus);
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({});
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-guide-score-panel" }));
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-guide-score-panel']} */ ;
    if (__VLS_ctx.isCashFlowPhase) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-grid ui-guide-summary-grid-cols-4" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid-cols-4']} */ ;
        for (var _f = 0, _g = __VLS_vFor((__VLS_ctx.cashFlowHeroSummaryCards)); _f < _g.length; _f++) {
            var summaryCard = _g[_f][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (summaryCard.id) }, { class: "ui-guide-summary-card" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-card']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-label" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-label']} */ ;
            (summaryCard.label);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-value" }, { class: (summaryCard.valueTone ? "ui-guide-summary-value-".concat(summaryCard.valueTone) : '') }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-value']} */ ;
            (summaryCard.valueText);
            if (summaryCard.metaText) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-meta" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-summary-meta']} */ ;
                (summaryCard.metaText);
            }
            // @ts-ignore
            [phase, phase, phase, phase, phase, phase, phaseDiagnosticCopy, hasDiagnosticPhase, isCashFlowPhase, cashFlowHeroSummaryCards,];
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-grid" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid']} */ ;
        for (var _h = 0, _j = __VLS_vFor((__VLS_ctx.summaryCards)); _h < _j.length; _h++) {
            var summaryCard = _j[_h][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (summaryCard.id) }, { class: "ui-guide-summary-card" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-card']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-label" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-label']} */ ;
            (summaryCard.label);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-value" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-value']} */ ;
            (summaryCard.valueText);
            // @ts-ignore
            [summaryCards,];
        }
    }
    if (__VLS_ctx.cashFlowDistortionWarning) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
        /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
        (__VLS_ctx.cashFlowDistortionWarning);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-top" }));
    /** @type {__VLS_StyleScopedClasses['ui-guide-score-top']} */ ;
    var __VLS_18 = ScoreHealthBadge_vue_1.default;
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        label: (__VLS_ctx.globalLabelValue),
        score: (__VLS_ctx.globalScoreValue),
        tone: (__VLS_ctx.globalToneValue),
        formattedScore: ("".concat(__VLS_ctx.formatNumber(__VLS_ctx.globalScoreValue, 0), "%")),
    }));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
            label: (__VLS_ctx.globalLabelValue),
            score: (__VLS_ctx.globalScoreValue),
            tone: (__VLS_ctx.globalToneValue),
            formattedScore: ("".concat(__VLS_ctx.formatNumber(__VLS_ctx.globalScoreValue, 0), "%")),
        }], __VLS_functionalComponentArgsRest(__VLS_19), false));
    var __VLS_23 = ScoreMeterRow_vue_1.default;
    // @ts-ignore
    var __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        score: (__VLS_ctx.globalScoreValue),
        largeGrade: true,
    }));
    var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
            score: (__VLS_ctx.globalScoreValue),
            largeGrade: true,
        }], __VLS_functionalComponentArgsRest(__VLS_24), false));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-grid" }, { class: ("ui-guide-score-grid-cols-".concat(__VLS_ctx.scoreCards.length)) }));
    /** @type {__VLS_StyleScopedClasses['ui-guide-score-grid']} */ ;
    for (var _k = 0, _l = __VLS_vFor((__VLS_ctx.scoreCards)); _k < _l.length; _k++) {
        var card = _l[_k][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (card.id) }, { class: "ui-guide-score-card" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-card-head" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-head']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-guide-score-card-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-title']} */ ;
        (card.title);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-card-value-wrap" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-value-wrap']} */ ;
        var __VLS_28 = ScoreGradeLabel_vue_1.default;
        // @ts-ignore
        var __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28(__assign({ score: (card.score) }, { class: "ui-guide-score-card-grade" })));
        var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([__assign({ score: (card.score) }, { class: "ui-guide-score-card-grade" })], __VLS_functionalComponentArgsRest(__VLS_29), false));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-grade']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-card-value" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-value']} */ ;
        (__VLS_ctx.formatNumber(card.score, 0));
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-guide-score-card-copy" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-copy']} */ ;
        (card.description);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-list" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-list']} */ ;
        for (var _m = 0, _o = __VLS_vFor((card.kpis)); _m < _o.length; _m++) {
            var kpi = _o[_m][0];
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (kpi.id) }, { class: "ui-guide-score-kpi" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-head" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-head']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (kpi.label);
            __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-guide-score-kpi-value" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-value']} */ ;
            (kpi.valueText);
            if (kpi.incomplete) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-guide-score-kpi-alert" }, { title: "Faltan cuotas por completar", 'aria-label': "Faltan cuotas por completar" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-alert']} */ ;
            }
            if (kpi.score != null) {
                var __VLS_33 = ScoreMeterRow_vue_1.default;
                // @ts-ignore
                var __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
                    score: (kpi.score),
                    rowClass: "ui-guide-meter-row-kpi",
                    trackClass: "ui-guide-score-kpi-track",
                }));
                var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
                        score: (kpi.score),
                        rowClass: "ui-guide-meter-row-kpi",
                        trackClass: "ui-guide-score-kpi-track",
                    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-pending" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-pending']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-hint" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-hint']} */ ;
            (kpi.hint);
            if (kpi.detailText) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-hint" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-hint']} */ ;
                (kpi.detailText);
            }
            // @ts-ignore
            [cashFlowDistortionWarning, cashFlowDistortionWarning, globalLabelValue, globalScoreValue, globalScoreValue, globalScoreValue, globalToneValue, formatNumber, formatNumber, scoreCards, scoreCards,];
        }
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.isCashFlowPhase) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign({ class: "ui-guide-context-details" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-context-details']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign({ class: "ui-guide-context-summary" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-context-summary']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-guide-context-summary-title" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-context-summary-title']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-guide-context-summary-copy" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-context-summary-copy']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-context-details-content" }));
        /** @type {__VLS_StyleScopedClasses['ui-guide-context-details-content']} */ ;
        if (__VLS_ctx.cashFlowContextSummarySections.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-sections" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-summary-sections']} */ ;
            var _loop_1 = function (section) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ key: (section.id) }, { class: "ui-guide-summary-section" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-summary-section']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-section-head" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-summary-section-head']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-guide-summary-section-title" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-summary-section-title']} */ ;
                (section.title);
                if (section.description) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-guide-summary-section-copy" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-summary-section-copy']} */ ;
                    (section.description);
                }
                if (section.id === 'cashflow-extraordinary' && __VLS_ctx.extraordinaryEventGroupOptions.length) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-section-filter" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-section-filter']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-guide-section-filter-label" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-section-filter-label']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.details, __VLS_intrinsics.details)(__assign({ class: "ui-select-popover ui-guide-event-filter" }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.summary, __VLS_intrinsics.summary)(__assign({ class: "ui-select-popover-trigger ui-guide-event-filter-summary" }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-trigger']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-summary']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-text ui-guide-event-filter-summary-text" }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-text']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-summary-text']} */ ;
                    (__VLS_ctx.selectedExtraordinaryEventGroupLabel);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-select-popover-caret ui-guide-event-filter-summary-caret" }, { 'aria-hidden': "true" }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-caret']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-summary-caret']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-select-popover-menu ui-guide-event-filter-menu" }, { role: "listbox", 'aria-label': "Evento" }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-menu']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-menu']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                            var _a = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                _a[_i] = arguments[_i];
                            }
                            var $event = _a[0];
                            if (!!(!__VLS_ctx.phase))
                                return;
                            if (!!(!__VLS_ctx.hasDiagnosticPhase))
                                return;
                            if (!(__VLS_ctx.isCashFlowPhase))
                                return;
                            if (!(__VLS_ctx.cashFlowContextSummarySections.length))
                                return;
                            if (!(section.id === 'cashflow-extraordinary' && __VLS_ctx.extraordinaryEventGroupOptions.length))
                                return;
                            __VLS_ctx.selectExtraordinaryEventGroup('all', $event);
                            // @ts-ignore
                            [isCashFlowPhase, cashFlowContextSummarySections, cashFlowContextSummarySections, extraordinaryEventGroupOptions, selectedExtraordinaryEventGroupLabel, selectExtraordinaryEventGroup,];
                        } }, { type: "button" }), { class: "ui-select-popover-option ui-guide-event-filter-option" }), { class: ({
                            'ui-select-popover-option-active ui-guide-event-filter-option-active': __VLS_ctx.selectedExtraordinaryEventGroup === 'all',
                        }) }));
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-option']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
                    /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-option-active']} */ ;
                    var _loop_2 = function (eventGroup) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign(__assign({ onClick: function () {
                                var _a = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    _a[_i] = arguments[_i];
                                }
                                var $event = _a[0];
                                if (!!(!__VLS_ctx.phase))
                                    return;
                                if (!!(!__VLS_ctx.hasDiagnosticPhase))
                                    return;
                                if (!(__VLS_ctx.isCashFlowPhase))
                                    return;
                                if (!(__VLS_ctx.cashFlowContextSummarySections.length))
                                    return;
                                if (!(section.id === 'cashflow-extraordinary' && __VLS_ctx.extraordinaryEventGroupOptions.length))
                                    return;
                                __VLS_ctx.selectExtraordinaryEventGroup(eventGroup, $event);
                                // @ts-ignore
                                [extraordinaryEventGroupOptions, selectExtraordinaryEventGroup, selectedExtraordinaryEventGroup,];
                            } }, { key: (eventGroup), type: "button" }), { class: "ui-select-popover-option ui-guide-event-filter-option" }), { class: ({
                                'ui-select-popover-option-active ui-guide-event-filter-option-active': __VLS_ctx.selectedExtraordinaryEventGroup === eventGroup,
                            }) }));
                        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option']} */ ;
                        /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-option']} */ ;
                        /** @type {__VLS_StyleScopedClasses['ui-select-popover-option-active']} */ ;
                        /** @type {__VLS_StyleScopedClasses['ui-guide-event-filter-option-active']} */ ;
                        (eventGroup);
                        // @ts-ignore
                        [selectedExtraordinaryEventGroup,];
                    };
                    for (var _v = 0, _w = __VLS_vFor((__VLS_ctx.extraordinaryEventGroupOptions)); _v < _w.length; _v++) {
                        var eventGroup = _w[_v][0];
                        _loop_2(eventGroup);
                    }
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-grid" }, { class: ("ui-guide-summary-grid-cols-".concat(section.columns)) }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-summary-grid']} */ ;
                for (var _x = 0, _y = __VLS_vFor((section.cards)); _x < _y.length; _x++) {
                    var summaryCard = _y[_x][0];
                    __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (summaryCard.id) }, { class: "ui-guide-summary-card" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-summary-card']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-label" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-summary-label']} */ ;
                    (summaryCard.label);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-value" }, { class: (summaryCard.valueTone ? "ui-guide-summary-value-".concat(summaryCard.valueTone) : '') }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-summary-value']} */ ;
                    (summaryCard.valueText);
                    if (summaryCard.metaText) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-summary-meta" }));
                        /** @type {__VLS_StyleScopedClasses['ui-guide-summary-meta']} */ ;
                        (summaryCard.metaText);
                    }
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
            };
            for (var _p = 0, _q = __VLS_vFor((__VLS_ctx.cashFlowContextSummarySections)); _p < _q.length; _p++) {
                var section = _q[_p][0];
                _loop_1(section);
            }
        }
        if (__VLS_ctx.phase2DistributionInfoCards.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-grid ui-guide-score-grid-cols-1 ui-guide-context-score-grid" }));
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-grid']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-guide-score-grid-cols-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-guide-context-score-grid']} */ ;
            for (var _r = 0, _s = __VLS_vFor((__VLS_ctx.phase2DistributionInfoCards)); _r < _s.length; _r++) {
                var card = _s[_r][0];
                __VLS_asFunctionalElement1(__VLS_intrinsics.article, __VLS_intrinsics.article)(__assign({ key: (card.id) }, { class: "ui-guide-score-card" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-card']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-card-head" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-head']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "ui-guide-score-card-title" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-title']} */ ;
                (card.title);
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "ui-guide-score-card-copy" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-card-copy']} */ ;
                (card.description);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-list" }));
                /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-list']} */ ;
                for (var _t = 0, _u = __VLS_vFor((card.kpis)); _t < _u.length; _t++) {
                    var kpi = _u[_t][0];
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (kpi.id) }, { class: "ui-guide-score-kpi" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-head" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-head']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                    (kpi.label);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-guide-score-kpi-value" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-value']} */ ;
                    (kpi.valueText);
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-guide-score-kpi-hint" }));
                    /** @type {__VLS_StyleScopedClasses['ui-guide-score-kpi-hint']} */ ;
                    (kpi.hint);
                    // @ts-ignore
                    [phase2DistributionInfoCards, phase2DistributionInfoCards,];
                }
                // @ts-ignore
                [];
            }
        }
    }
    if (__VLS_ctx.store.loading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
        /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
    }
    else if (__VLS_ctx.store.error) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert" }));
        /** @type {__VLS_StyleScopedClasses['alert']} */ ;
        (__VLS_ctx.store.error);
    }
}
// @ts-ignore
[store, store, store,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
