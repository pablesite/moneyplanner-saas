"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetWorthPageMetrics = useNetWorthPageMetrics;
var vue_1 = require("vue");
function toNumber(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(/,/g, '.');
    var value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
}
function formatMonthYearLabel(date) {
    return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(new Date(date));
}
function resolvePositionValue(item, baseCurrency) {
    var _a, _b, _c;
    if (item.amount_base != null && String(item.amount_base).trim() !== '') {
        return { value: toNumber(item.amount_base), currency: baseCurrency };
    }
    if (item.effective_amount != null && String(item.effective_amount).trim() !== '') {
        return { value: toNumber(item.effective_amount), currency: (_a = item.currency) !== null && _a !== void 0 ? _a : baseCurrency };
    }
    if (item.estimated_outstanding_amount != null &&
        String(item.estimated_outstanding_amount).trim() !== '') {
        return {
            value: toNumber(item.estimated_outstanding_amount),
            currency: (_b = item.currency) !== null && _b !== void 0 ? _b : baseCurrency,
        };
    }
    return { value: toNumber(item.amount), currency: (_c = item.currency) !== null && _c !== void 0 ? _c : baseCurrency };
}
function buildCategoryTotals(rows) {
    var _a;
    var totals = new Map();
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        totals.set(row.category, ((_a = totals.get(row.category)) !== null && _a !== void 0 ? _a : 0) + row.value);
    }
    return totals;
}
function buildCategoryCounts(rows) {
    var _a;
    var counts = new Map();
    for (var _i = 0, rows_2 = rows; _i < rows_2.length; _i++) {
        var row = rows_2[_i];
        counts.set(row.category, ((_a = counts.get(row.category)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    return counts;
}
function useNetWorthPageMetrics(params) {
    var categoryLabelMap = (0, vue_1.computed)(function () {
        var entries = new Map();
        params.assetCategories.forEach(function (category) { return entries.set("asset:".concat(category.value), category.label); });
        params.liabilityCategories.forEach(function (category) {
            return entries.set("liability:".concat(category.value), category.label);
        });
        return entries;
    });
    var selectedCategoryLabel = (0, vue_1.computed)(function () {
        var _a;
        if (!params.selectedTimelineCategory.value)
            return 'Todo patrimonio';
        return ((_a = categoryLabelMap.value.get("".concat(params.selectedTimelineCategoryType.value, ":").concat(params.selectedTimelineCategory.value))) !== null && _a !== void 0 ? _a : params.selectedTimelineCategory.value);
    });
    var ownershipFilteredAssets = (0, vue_1.computed)(function () {
        return params.assets.value
            .filter(function (asset) { return asset.is_active !== false; })
            .filter(function (asset) { return params.matchesOwnershipFilter(asset.ownership_ref); });
    });
    var ownershipFilteredLiabilities = (0, vue_1.computed)(function () {
        return params.liabilities.value
            .filter(function (liability) { return liability.is_active !== false; })
            .filter(function (liability) { return params.matchesOwnershipFilter(liability.ownership_ref); });
    });
    var allAssetPositionRows = (0, vue_1.computed)(function () {
        return ownershipFilteredAssets.value
            .map(function (asset) {
            var _a, _b, _c;
            var resolved = resolvePositionValue(asset, (_c = (_a = params.baseCurrency.value) !== null && _a !== void 0 ? _a : (_b = params.summary.value) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'EUR');
            var ownershipFraction = params.allocationFractionForNetWorthOwner(asset.ownership_ref, params.ownershipFilter.value);
            return {
                id: asset.id,
                type: 'asset',
                category: asset.category,
                name: asset.name,
                subtitle: [asset.category, asset.subcategory].filter(Boolean).join(' / '),
                value: resolved.value * ownershipFraction,
                currency: resolved.currency,
                ownershipFraction: ownershipFraction,
            };
        })
            .filter(function (asset) { return asset.ownershipFraction > 0; })
            .sort(function (a, b) { return b.value - a.value; });
    });
    var assetPositionRows = (0, vue_1.computed)(function () {
        return allAssetPositionRows.value.filter(function (asset) {
            return params.selectedTimelineCategory.value &&
                params.selectedTimelineCategoryType.value === 'asset'
                ? asset.category === params.selectedTimelineCategory.value
                : true;
        });
    });
    var allLiabilityPositionRows = (0, vue_1.computed)(function () {
        return ownershipFilteredLiabilities.value
            .map(function (liability) {
            var _a, _b, _c;
            var resolved = resolvePositionValue(liability, (_c = (_a = params.baseCurrency.value) !== null && _a !== void 0 ? _a : (_b = params.summary.value) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'EUR');
            var ownershipFraction = params.allocationFractionForNetWorthOwner(liability.ownership_ref, params.ownershipFilter.value);
            return {
                id: liability.id,
                type: 'liability',
                category: liability.category,
                name: liability.name,
                subtitle: liability.category || 'liability',
                value: resolved.value * ownershipFraction,
                currency: resolved.currency,
                ownershipFraction: ownershipFraction,
            };
        })
            .filter(function (liability) { return liability.ownershipFraction > 0; })
            .sort(function (a, b) { return b.value - a.value; });
    });
    var liabilityPositionRows = (0, vue_1.computed)(function () {
        return allLiabilityPositionRows.value.filter(function (liability) {
            return params.selectedTimelineCategory.value &&
                params.selectedTimelineCategoryType.value === 'liability'
                ? liability.category === params.selectedTimelineCategory.value
                : true;
        });
    });
    var filteredAssetCategoryTotals = (0, vue_1.computed)(function () { return buildCategoryTotals(allAssetPositionRows.value); });
    var filteredLiabilityCategoryTotals = (0, vue_1.computed)(function () {
        return buildCategoryTotals(allLiabilityPositionRows.value);
    });
    var effectiveCategoryKeys = (0, vue_1.computed)(function () {
        if (params.ownershipFilter.value === 'all')
            return params.byCategoryKeys.value;
        return Array.from(new Set(__spreadArray(__spreadArray([], filteredAssetCategoryTotals.value.keys(), true), filteredLiabilityCategoryTotals.value.keys(), true)));
    });
    var effectiveCategoryLabels = (0, vue_1.computed)(function () {
        return effectiveCategoryKeys.value.map(function (key) { var _a; return (_a = categoryLabelMap.value.get("asset:".concat(key))) !== null && _a !== void 0 ? _a : key; });
    });
    var effectiveCategoryAssets = (0, vue_1.computed)(function () {
        if (params.ownershipFilter.value === 'all')
            return params.byCategoryAssets.value;
        return effectiveCategoryKeys.value.map(function (key) { var _a; return (_a = filteredAssetCategoryTotals.value.get(key)) !== null && _a !== void 0 ? _a : 0; });
    });
    var effectiveCategoryLiabilities = (0, vue_1.computed)(function () {
        if (params.ownershipFilter.value === 'all')
            return params.byCategoryLiabilities.value;
        return effectiveCategoryKeys.value.map(function (key) { var _a; return (_a = filteredLiabilityCategoryTotals.value.get(key)) !== null && _a !== void 0 ? _a : 0; });
    });
    var filteredAssetCategoryCounts = (0, vue_1.computed)(function () { return buildCategoryCounts(allAssetPositionRows.value); });
    var filteredLiabilityCategoryCounts = (0, vue_1.computed)(function () {
        return buildCategoryCounts(allLiabilityPositionRows.value);
    });
    var effectiveCategoryAssetCounts = (0, vue_1.computed)(function () {
        return effectiveCategoryKeys.value.map(function (key) { var _a; return (_a = filteredAssetCategoryCounts.value.get(key)) !== null && _a !== void 0 ? _a : 0; });
    });
    var effectiveCategoryLiabilityCounts = (0, vue_1.computed)(function () {
        return effectiveCategoryKeys.value.map(function (key) { var _a; return (_a = filteredLiabilityCategoryCounts.value.get(key)) !== null && _a !== void 0 ? _a : 0; });
    });
    var filteredAssetsValue = (0, vue_1.computed)(function () {
        return allAssetPositionRows.value.reduce(function (total, row) { return total + row.value; }, 0);
    });
    var filteredLiabilitiesValue = (0, vue_1.computed)(function () {
        return allLiabilityPositionRows.value.reduce(function (total, row) { return total + row.value; }, 0);
    });
    var filteredBackedDebtValue = (0, vue_1.computed)(function () {
        return ownershipFilteredLiabilities.value.reduce(function (total, liability) {
            var _a, _b, _c;
            var resolved = resolvePositionValue(liability, (_c = (_a = params.baseCurrency.value) !== null && _a !== void 0 ? _a : (_b = params.summary.value) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'EUR');
            var fraction = params.allocationFractionForNetWorthOwner(liability.ownership_ref, params.ownershipFilter.value);
            return total + (liability.financed_asset_ref != null ? resolved.value * fraction : 0);
        }, 0);
    });
    var filteredUnbackedDebtValue = (0, vue_1.computed)(function () {
        return ownershipFilteredLiabilities.value.reduce(function (total, liability) {
            var _a, _b, _c;
            var resolved = resolvePositionValue(liability, (_c = (_a = params.baseCurrency.value) !== null && _a !== void 0 ? _a : (_b = params.summary.value) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'EUR');
            var fraction = params.allocationFractionForNetWorthOwner(liability.ownership_ref, params.ownershipFilter.value);
            return total + (liability.financed_asset_ref == null ? resolved.value * fraction : 0);
        }, 0);
    });
    var assetsValue = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? Math.max(0, toNumber(params.summaryAssets.value))
            : Math.max(0, filteredAssetsValue.value);
    });
    var liabilitiesValue = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? Math.max(0, toNumber(params.summaryLiabilities.value))
            : Math.max(0, filteredLiabilitiesValue.value);
    });
    var netWorthValue = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? toNumber(params.summaryNetWorth.value)
            : filteredAssetsValue.value - filteredLiabilitiesValue.value;
    });
    var backedDebtValue = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? Math.max(0, toNumber(params.summaryAssetBackedLiabilities.value))
            : Math.max(0, filteredBackedDebtValue.value);
    });
    var unbackedDebtValue = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? Math.max(0, toNumber(params.summaryUnbackedLiabilities.value))
            : Math.max(0, filteredUnbackedDebtValue.value);
    });
    var debtRatioValue = (0, vue_1.computed)(function () {
        return assetsValue.value > 0 ? liabilitiesValue.value / assetsValue.value : null;
    });
    var equityRatioValue = (0, vue_1.computed)(function () {
        return assetsValue.value > 0 ? netWorthValue.value / assetsValue.value : null;
    });
    var liquidityAssetsValue = (0, vue_1.computed)(function () {
        var _a;
        var liquidityCategoryIndex = effectiveCategoryLabels.value.findIndex(function (label) { return label.toLowerCase() === 'liquidez'; });
        if (liquidityCategoryIndex < 0)
            return 0;
        return Math.max(0, (_a = effectiveCategoryAssets.value[liquidityCategoryIndex]) !== null && _a !== void 0 ? _a : 0);
    });
    var liquidityToDebtRatioValue = (0, vue_1.computed)(function () {
        return liabilitiesValue.value > 0 ? liquidityAssetsValue.value / liabilitiesValue.value : null;
    });
    var analysis = (0, vue_1.computed)(function () { return ({
        assets: assetsValue.value,
        liabilities: liabilitiesValue.value,
        netWorth: netWorthValue.value,
        backedDebt: backedDebtValue.value,
        unbackedDebt: unbackedDebtValue.value,
        debtRatio: debtRatioValue.value,
        equityRatio: equityRatioValue.value,
        liquidityAssets: liquidityAssetsValue.value,
        liquidityToDebtRatio: liquidityToDebtRatioValue.value,
    }); });
    var availablePositionRows = (0, vue_1.computed)(function () {
        if (!params.selectedTimelineCategory.value)
            return [];
        return params.selectedTimelineCategoryType.value === 'liability'
            ? liabilityPositionRows.value
            : assetPositionRows.value;
    });
    var activeAssets = (0, vue_1.computed)(function () {
        return ownershipFilteredAssets.value.map(function (asset) { return ({
            id: asset.id,
            name: asset.name,
            category: asset.category,
        }); });
    });
    var categoryWorkspaceRows = (0, vue_1.computed)(function () {
        return params.selectedTimelineCategoryType.value === 'liability'
            ? liabilityPositionRows.value
            : assetPositionRows.value;
    });
    var categoryWorkspaceCount = (0, vue_1.computed)(function () { return categoryWorkspaceRows.value.length; });
    var categoryWorkspaceTotal = (0, vue_1.computed)(function () {
        return categoryWorkspaceRows.value.reduce(function (total, row) { return total + row.value; }, 0);
    });
    var showCategoryWorkspace = (0, vue_1.computed)(function () { return !!params.selectedTimelineCategory.value; });
    function sourceItemForRow(row) {
        var _a, _b;
        return row.type === 'asset'
            ? ((_a = ownershipFilteredAssets.value.find(function (item) { return item.id === row.id; })) !== null && _a !== void 0 ? _a : null)
            : ((_b = ownershipFilteredLiabilities.value.find(function (item) { return item.id === row.id; })) !== null && _b !== void 0 ? _b : null);
    }
    var selectedPosition = (0, vue_1.computed)(function () {
        var _a;
        var rows = params.selectedPositionType.value === 'liability'
            ? liabilityPositionRows.value
            : assetPositionRows.value;
        return (_a = rows.find(function (row) { return row.id === params.selectedPositionId.value; })) !== null && _a !== void 0 ? _a : null;
    });
    var selectedPositionSource = (0, vue_1.computed)(function () {
        var row = selectedPosition.value;
        return row ? sourceItemForRow(row) : null;
    });
    var positionTimelineRows = (0, vue_1.computed)(function () {
        return params.positionTimelineRowsSource.value.map(function (row) {
            var _a, _b;
            return ({
                date: row.date,
                label: formatMonthYearLabel(row.date),
                value: toNumber(row.value_base || row.value) * ((_b = (_a = selectedPosition.value) === null || _a === void 0 ? void 0 : _a.ownershipFraction) !== null && _b !== void 0 ? _b : 1),
            });
        });
    });
    return {
        selectedCategoryLabel: selectedCategoryLabel,
        ownershipFilteredAssets: ownershipFilteredAssets,
        ownershipFilteredLiabilities: ownershipFilteredLiabilities,
        allAssetPositionRows: allAssetPositionRows,
        assetPositionRows: assetPositionRows,
        allLiabilityPositionRows: allLiabilityPositionRows,
        liabilityPositionRows: liabilityPositionRows,
        effectiveCategoryKeys: effectiveCategoryKeys,
        effectiveCategoryLabels: effectiveCategoryLabels,
        effectiveCategoryAssets: effectiveCategoryAssets,
        effectiveCategoryLiabilities: effectiveCategoryLiabilities,
        effectiveCategoryAssetCounts: effectiveCategoryAssetCounts,
        effectiveCategoryLiabilityCounts: effectiveCategoryLiabilityCounts,
        assetsValue: assetsValue,
        liabilitiesValue: liabilitiesValue,
        netWorthValue: netWorthValue,
        analysis: analysis,
        availablePositionRows: availablePositionRows,
        activeAssets: activeAssets,
        categoryWorkspaceRows: categoryWorkspaceRows,
        categoryWorkspaceCount: categoryWorkspaceCount,
        categoryWorkspaceTotal: categoryWorkspaceTotal,
        showCategoryWorkspace: showCategoryWorkspace,
        sourceItemForRow: sourceItemForRow,
        selectedPosition: selectedPosition,
        selectedPositionSource: selectedPositionSource,
        positionTimelineRows: positionTimelineRows,
    };
}
