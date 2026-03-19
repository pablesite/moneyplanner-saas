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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var net_worth_1 = require("@/domains/net-worth");
var NetWorthCategoryWorkspace_vue_1 = require("@/domains/net-worth/components/NetWorthCategoryWorkspace.vue");
var NetWorthHeroSection_vue_1 = require("@/domains/net-worth/components/NetWorthHeroSection.vue");
var NetWorthItemModals_vue_1 = require("@/domains/net-worth/components/NetWorthItemModals.vue");
var NetWorthSnapshotsSection_vue_1 = require("@/domains/net-worth/components/NetWorthSnapshotsSection.vue");
var NetWorthTimelineMain_vue_1 = require("@/domains/net-worth/components/NetWorthTimelineMain.vue");
require("@/domains/net-worth/net-worth-view.css");
var useNetWorthAccountingActivity_1 = require("@/domains/net-worth/useNetWorthAccountingActivity");
var useNetWorthOwnership_1 = require("@/domains/net-worth/useNetWorthOwnership");
var useNetWorthPageMetrics_1 = require("@/domains/net-worth/useNetWorthPageMetrics");
var useNetWorthPositionActivity_1 = require("@/domains/net-worth/useNetWorthPositionActivity");
var useNetWorthPageActions_1 = require("@/domains/net-worth/useNetWorthPageActions");
var useNetWorthTimeline_1 = require("@/domains/net-worth/useNetWorthTimeline");
var useNetWorthTimelineLayout_1 = require("@/domains/net-worth/useNetWorthTimelineLayout");
var ui_1 = require("@/domains/ui");
var _s = (0, net_worth_1.useNetWorthViewState)(), store = _s.store, valueMode = _s.valueMode, currencies = _s.currencies, assetCategories = _s.assetCategories, liabilityCategories = _s.liabilityCategories, prettyError = _s.prettyError, canShowReal = _s.canShowReal, confirmDeleteSnapshot = _s.confirmDeleteSnapshot, showAssetModal = _s.showAssetModal, showLiabilityModal = _s.showLiabilityModal, showEditModal = _s.showEditModal, editKind = _s.editKind, formatMoney = _s.formatMoney, unitLabel = _s.unitLabel, modeLabel = _s.modeLabel, realBaseLabel = _s.realBaseLabel, assetSubcategories = _s.assetSubcategories, summaryAssets = _s.summaryAssets, summaryLiabilities = _s.summaryLiabilities, summaryNetWorth = _s.summaryNetWorth, byCategoryKeys = _s.byCategoryKeys, byCategoryAssets = _s.byCategoryAssets, byCategoryLiabilities = _s.byCategoryLiabilities, summaryAssetBackedLiabilities = _s.summaryAssetBackedLiabilities, summaryUnbackedLiabilities = _s.summaryUnbackedLiabilities, submitAsset = _s.submitAsset, submitLiability = _s.submitLiability, openEdit = _s.openEdit, closeEdit = _s.closeEdit, editTitle = _s.editTitle, editCategories = _s.editCategories, editInitial = _s.editInitial, submitEdit = _s.submitEdit;
var itemFormProps = (0, net_worth_1.useNetWorthViewExtensions)(store).itemFormProps;
var inflationRegions = [
    { code: 'ES', label: 'Espana' },
    { code: 'ES-AN', label: 'Andalucia' },
    { code: 'ES-AR', label: 'Aragon' },
    { code: 'ES-AS', label: 'Asturias' },
    { code: 'ES-IB', label: 'Illes Balears' },
    { code: 'ES-CN', label: 'Canarias' },
    { code: 'ES-CB', label: 'Cantabria' },
    { code: 'ES-CL', label: 'Castilla y Leon' },
    { code: 'ES-CM', label: 'Castilla-La Mancha' },
    { code: 'ES-CT', label: 'Cataluna' },
    { code: 'ES-VC', label: 'Comunitat Valenciana' },
    { code: 'ES-EX', label: 'Extremadura' },
    { code: 'ES-GA', label: 'Galicia' },
    { code: 'ES-MD', label: 'Comunidad de Madrid' },
    { code: 'ES-MC', label: 'Region de Murcia' },
    { code: 'ES-NC', label: 'Comunidad Foral de Navarra' },
    { code: 'ES-PV', label: 'Pais Vasco' },
    { code: 'ES-RI', label: 'La Rioja' },
    { code: 'ES-CE', label: 'Ceuta' },
    { code: 'ES-ML', label: 'Melilla' },
];
function toNumber(raw) {
    var normalized = String(raw !== null && raw !== void 0 ? raw : '')
        .trim()
        .replace(/\s/g, '')
        .replace(/,/g, '.');
    var value = Number(normalized);
    return Number.isFinite(value) ? value : 0;
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
function displayCurrencyUnit(currency) {
    return currency === 'EUR' ? '€' : String(currency !== null && currency !== void 0 ? currency : '').trim();
}
var _t = (0, useNetWorthOwnership_1.useNetWorthOwnership)({
    ownerships: (0, vue_1.computed)(function () { return store.ownerships; }),
    valueMode: valueMode,
}), ownershipFilter = _t.ownershipFilter, ownershipOptions = _t.ownershipOptions, selectedOwnershipFilterLabel = _t.selectedOwnershipFilterLabel, ownershipFilterDisabled = _t.ownershipFilterDisabled, allocationFractionForNetWorthOwner = _t.allocationFractionForNetWorthOwner, matchesOwnershipFilter = _t.matchesOwnershipFilter, ownershipBadge = _t.ownershipBadge, setOwnershipFilter = _t.setOwnershipFilter, setValueMode = _t.setValueMode;
var heroUnitLabel = (0, vue_1.computed)(function () { return displayCurrencyUnit(unitLabel()); });
(0, vue_1.watch)(ownershipFilter, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clearPositionSelection();
                if (!(selectedTimelineCategory.value &&
                    !effectiveCategoryKeys.value.includes(selectedTimelineCategory.value))) return [3 /*break*/, 2];
                selectedTimelineCategory.value = null;
                selectedTimelineCategoryType.value = 'asset';
                return [4 /*yield*/, store.fetchTimeline(null, 'asset')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
var selectedTimelineCategory = (0, vue_1.ref)(null);
var selectedTimelineCategoryType = (0, vue_1.ref)('asset');
var selectedPositionType = (0, vue_1.ref)(null);
var selectedPositionId = (0, vue_1.ref)(null);
var createAssetCategory = (0, vue_1.ref)(null);
var createLiabilityCategory = (0, vue_1.ref)(null);
var timelineExpanded = (0, vue_1.ref)(false);
var selectedTimelinePreset = (0, vue_1.ref)('all');
var customTimelineWindow = (0, vue_1.ref)(null);
var timelinePresetOptions = ['1m', '3m', '6m', '1a', 'all'];
var timelineMetric = (0, vue_1.computed)(function () {
    if (!selectedTimelineCategory.value)
        return 'net_worth';
    return selectedTimelineCategoryType.value === 'liability' ? 'liabilities' : 'assets';
});
function getTimelineMetricValue(row) {
    if (timelineMetric.value === 'assets')
        return row.assets;
    if (timelineMetric.value === 'liabilities')
        return row.liabilities;
    return row.netWorth;
}
var timelineRows = (0, vue_1.computed)(function () {
    var _a, _b;
    return ((_b = (_a = store.timeline) === null || _a === void 0 ? void 0 : _a.rows) !== null && _b !== void 0 ? _b : []).map(function (row) { return ({
        date: row.date,
        label: new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(new Date(row.date)),
        netWorth: toNumber(row.net_worth),
        assets: toNumber(row.total_assets),
        liabilities: toNumber(row.total_liabilities),
    }); });
});
var _u = (0, useNetWorthPageMetrics_1.useNetWorthPageMetrics)({
    assets: (0, vue_1.computed)(function () { return store.assets; }),
    liabilities: (0, vue_1.computed)(function () { return store.liabilities; }),
    baseCurrency: (0, vue_1.computed)(function () { return store.baseCurrency; }),
    summary: (0, vue_1.computed)(function () { return store.summary; }),
    positionTimelineRowsSource: (0, vue_1.computed)(function () { var _a, _b; return (_b = (_a = store.positionTimeline) === null || _a === void 0 ? void 0 : _a.rows) !== null && _b !== void 0 ? _b : []; }),
    assetCategories: assetCategories,
    liabilityCategories: liabilityCategories,
    byCategoryKeys: byCategoryKeys,
    byCategoryAssets: byCategoryAssets,
    byCategoryLiabilities: byCategoryLiabilities,
    summaryAssets: summaryAssets,
    summaryLiabilities: summaryLiabilities,
    summaryNetWorth: summaryNetWorth,
    summaryAssetBackedLiabilities: summaryAssetBackedLiabilities,
    summaryUnbackedLiabilities: summaryUnbackedLiabilities,
    ownershipFilter: ownershipFilter,
    selectedTimelineCategory: selectedTimelineCategory,
    selectedTimelineCategoryType: selectedTimelineCategoryType,
    selectedPositionType: selectedPositionType,
    selectedPositionId: selectedPositionId,
    matchesOwnershipFilter: matchesOwnershipFilter,
    allocationFractionForNetWorthOwner: allocationFractionForNetWorthOwner,
}), selectedCategoryLabel = _u.selectedCategoryLabel, allAssetPositionRows = _u.allAssetPositionRows, allLiabilityPositionRows = _u.allLiabilityPositionRows, effectiveCategoryKeys = _u.effectiveCategoryKeys, effectiveCategoryLabels = _u.effectiveCategoryLabels, effectiveCategoryAssets = _u.effectiveCategoryAssets, effectiveCategoryLiabilities = _u.effectiveCategoryLiabilities, effectiveCategoryAssetCounts = _u.effectiveCategoryAssetCounts, effectiveCategoryLiabilityCounts = _u.effectiveCategoryLiabilityCounts, analysis = _u.analysis, availablePositionRows = _u.availablePositionRows, activeAssets = _u.activeAssets, categoryWorkspaceRows = _u.categoryWorkspaceRows, categoryWorkspaceCount = _u.categoryWorkspaceCount, categoryWorkspaceTotal = _u.categoryWorkspaceTotal, showCategoryWorkspace = _u.showCategoryWorkspace, sourceItemForRow = _u.sourceItemForRow, selectedPosition = _u.selectedPosition, selectedPositionSource = _u.selectedPositionSource, positionTimelineRows = _u.positionTimelineRows;
function ownershipBadgeForRow(row) {
    var _a;
    return ownershipBadge((_a = sourceItemForRow(row)) === null || _a === void 0 ? void 0 : _a.ownership_ref);
}
function editRow(row) {
    var item = sourceItemForRow(row);
    if (!item)
        return;
    openEdit(item, row.type);
}
function deleteRow(row) {
    return __awaiter(this, void 0, void 0, function () {
        var label;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    label = row.type === 'asset' ? 'activo' : 'pasivo';
                    if (!confirm("Eliminar este ".concat(label, "? Esta accion no se puede deshacer.")))
                        return [2 /*return*/];
                    if (!(row.type === 'asset')) return [3 /*break*/, 2];
                    return [4 /*yield*/, store.deleteAsset(row.id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, store.deleteLiability(row.id)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var categoryWorkspaceLabel = (0, vue_1.computed)(function () {
    if (!selectedTimelineCategory.value)
        return '';
    var scope = selectedTimelineCategoryType.value === 'liability' ? 'pasivos' : 'activos';
    return "".concat(selectedCategoryLabel.value, " dentro de ").concat(scope);
});
var categoryWorkspaceMeta = (0, vue_1.computed)(function () {
    if (!selectedTimelineCategory.value)
        return '';
    return "".concat(categoryWorkspaceCount.value, " posiciones - ").concat(formatNumber(categoryWorkspaceTotal.value, 2), " ").concat(heroUnitLabel.value);
});
var showPositionSelector = (0, vue_1.computed)(function () { return !!selectedTimelineCategory.value && availablePositionRows.value.length > 0; });
var timelineColumnRef = (0, vue_1.ref)(null);
var _v = (0, useNetWorthAccountingActivity_1.useNetWorthAccountingActivity)({
    selectedPositionSource: selectedPositionSource,
    sourceItemForRow: sourceItemForRow,
    toNumber: toNumber,
}), accountingActivityLoading = _v.accountingActivityLoading, accountingActivityError = _v.accountingActivityError, accountingActivityRows = _v.accountingActivityRows, accountingActivityYear = _v.accountingActivityYear, showAccountingActivitySetupGap = _v.showAccountingActivitySetupGap, showAccountingActivityNeedsReview = _v.showAccountingActivityNeedsReview, showAccountingActivityBlock = _v.showAccountingActivityBlock, resetAccountingActivity = _v.resetAccountingActivity, loadAccountingActivity = _v.loadAccountingActivity;
var positionActivityRows = (0, useNetWorthPositionActivity_1.useNetWorthPositionActivity)({
    selectedPositionType: selectedPositionType,
    assetValuations: (0, vue_1.computed)(function () { return store.assetValuations; }),
    investmentEvents: (0, vue_1.computed)(function () { return store.investmentEvents; }),
    liquidityEvents: (0, vue_1.computed)(function () { return store.liquidityEvents; }),
    liabilityValuations: (0, vue_1.computed)(function () { return store.liabilityValuations; }),
    liabilityEvents: (0, vue_1.computed)(function () { return store.liabilityEvents; }),
    toNumber: toNumber,
}).positionActivityRows;
function clearPositionSelection() {
    selectedPositionType.value = null;
    selectedPositionId.value = null;
    store.positionTimeline = null;
    store.assetValuations = [];
    store.liabilityValuations = [];
    store.investmentEvents = [];
    store.liquidityEvents = [];
    store.liabilityEvents = [];
    resetAccountingActivity();
}
function closeAssetModal() {
    showAssetModal.value = false;
    createAssetCategory.value = null;
}
function closeLiabilityModal() {
    showLiabilityModal.value = false;
    createLiabilityCategory.value = null;
}
var _w = (0, useNetWorthTimeline_1.useNetWorthTimeline)({
    ownershipFilter: ownershipFilter,
    selectedPosition: selectedPosition,
    selectedPositionType: selectedPositionType,
    selectedPositionId: selectedPositionId,
    selectedTimelineCategory: selectedTimelineCategory,
    selectedTimelineCategoryType: selectedTimelineCategoryType,
    selectedTimelinePreset: selectedTimelinePreset,
    customTimelineWindow: customTimelineWindow,
    timelineRows: timelineRows,
    availablePositionRows: availablePositionRows,
    allAssetPositionRows: allAssetPositionRows,
    allLiabilityPositionRows: allLiabilityPositionRows,
    positionTimelineRows: positionTimelineRows,
    storeTimelineLoading: (0, vue_1.computed)(function () { return store.timelineLoading; }),
    storePositionTimelineLoading: (0, vue_1.computed)(function () { return store.positionTimelineLoading; }),
    setStoreError: function (message) {
        store.error = message;
    },
    resetPositionSelection: clearPositionSelection,
    getTimelineMetricValue: getTimelineMetricValue,
}), displayedTimelineLoading = _w.displayedTimelineLoading, visibleTimelineRows = _w.visibleTimelineRows, timelineWindow = _w.timelineWindow, timelineChartRows = _w.timelineChartRows, timelineChartPoints = _w.timelineChartPoints, timelineRangeCaption = _w.timelineRangeCaption, latestTimelineChartPoint = _w.latestTimelineChartPoint, timelineSummaryLabel = _w.timelineSummaryLabel, displayedTimelineSeriesColor = _w.displayedTimelineSeriesColor;
var timelineSidebarPanelStyle = (0, useNetWorthTimelineLayout_1.useNetWorthTimelineLayout)({
    showCategoryWorkspace: showCategoryWorkspace,
    visibleTimelineRows: visibleTimelineRows,
    selectedPosition: selectedPosition,
    timelineColumnRef: timelineColumnRef,
}).timelineSidebarPanelStyle;
var _x = (0, useNetWorthPageActions_1.useNetWorthPageActions)({
    store: store,
    selectedPositionType: selectedPositionType,
    selectedPositionId: selectedPositionId,
    selectedTimelineCategory: selectedTimelineCategory,
    selectedTimelineCategoryType: selectedTimelineCategoryType,
    selectedTimelinePreset: selectedTimelinePreset,
    customTimelineWindow: customTimelineWindow,
    createAssetCategory: createAssetCategory,
    createLiabilityCategory: createLiabilityCategory,
    showAssetModal: showAssetModal,
    showLiabilityModal: showLiabilityModal,
    availablePositionRows: availablePositionRows,
    timelineWindow: timelineWindow,
    submitAsset: submitAsset,
    submitLiability: submitLiability,
    resetAccountingActivity: resetAccountingActivity,
    loadAccountingActivity: loadAccountingActivity,
}), openCreateModal = _x.openCreateModal, submitAssetFromView = _x.submitAssetFromView, submitLiabilityFromView = _x.submitLiabilityFromView, resetTimelineSelection = _x.resetTimelineSelection, applyCompositionCategoryFilter = _x.applyCompositionCategoryFilter, handleCompositionAddType = _x.handleCompositionAddType, selectPosition = _x.selectPosition, setTimelinePreset = _x.setTimelinePreset, updateTimelineWindowStart = _x.updateTimelineWindowStart, updateTimelineWindowEnd = _x.updateTimelineWindowEnd, onPositionSelection = _x.onPositionSelection, assetCreateInitial = _x.assetCreateInitial, liabilityCreateInitial = _x.liabilityCreateInitial;
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container ui-pro-page relative" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-page']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
var __VLS_0 = NetWorthHeroSection_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    store: (__VLS_ctx.store),
    currencies: (__VLS_ctx.currencies),
    inflationRegions: (__VLS_ctx.inflationRegions),
    valueMode: (__VLS_ctx.valueMode),
    setValueMode: (__VLS_ctx.setValueMode),
    canShowReal: (__VLS_ctx.canShowReal()),
    modeLabel: (__VLS_ctx.modeLabel()),
    realBaseLabel: (__VLS_ctx.realBaseLabel),
    heroUnitLabel: (__VLS_ctx.heroUnitLabel),
    analysis: (__VLS_ctx.analysis),
    ownershipFilter: (__VLS_ctx.ownershipFilter),
    setOwnershipFilter: (__VLS_ctx.setOwnershipFilter),
    ownershipOptions: (__VLS_ctx.ownershipOptions),
    ownershipFilterDisabled: (__VLS_ctx.ownershipFilterDisabled),
    selectedOwnershipFilterLabel: (__VLS_ctx.selectedOwnershipFilterLabel),
    formatNumber: (__VLS_ctx.formatNumber),
    formatPct: (__VLS_ctx.formatPct),
    resetTimelineSelection: (__VLS_ctx.resetTimelineSelection),
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        store: (__VLS_ctx.store),
        currencies: (__VLS_ctx.currencies),
        inflationRegions: (__VLS_ctx.inflationRegions),
        valueMode: (__VLS_ctx.valueMode),
        setValueMode: (__VLS_ctx.setValueMode),
        canShowReal: (__VLS_ctx.canShowReal()),
        modeLabel: (__VLS_ctx.modeLabel()),
        realBaseLabel: (__VLS_ctx.realBaseLabel),
        heroUnitLabel: (__VLS_ctx.heroUnitLabel),
        analysis: (__VLS_ctx.analysis),
        ownershipFilter: (__VLS_ctx.ownershipFilter),
        setOwnershipFilter: (__VLS_ctx.setOwnershipFilter),
        ownershipOptions: (__VLS_ctx.ownershipOptions),
        ownershipFilterDisabled: (__VLS_ctx.ownershipFilterDisabled),
        selectedOwnershipFilterLabel: (__VLS_ctx.selectedOwnershipFilterLabel),
        formatNumber: (__VLS_ctx.formatNumber),
        formatPct: (__VLS_ctx.formatPct),
        resetTimelineSelection: (__VLS_ctx.resetTimelineSelection),
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "card ui-pro-panel ui-nw-hero-shell grid gap-2.5 mb-2" }));
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-shell']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-hero-timeline" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-hero-timeline']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-layout" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-layout']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ ref: "timelineColumnRef" }, { class: "ui-nw-timeline-column" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-column']} */ ;
var __VLS_5 = NetWorthTimelineMain_vue_1.default;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    analysis: (__VLS_ctx.analysis),
    heroUnitLabel: (__VLS_ctx.heroUnitLabel),
    effectiveCategoryKeys: (__VLS_ctx.effectiveCategoryKeys),
    effectiveCategoryLabels: (__VLS_ctx.effectiveCategoryLabels),
    effectiveCategoryAssets: (__VLS_ctx.effectiveCategoryAssets),
    effectiveCategoryLiabilities: (__VLS_ctx.effectiveCategoryLiabilities),
    effectiveCategoryAssetCounts: (__VLS_ctx.effectiveCategoryAssetCounts),
    effectiveCategoryLiabilityCounts: (__VLS_ctx.effectiveCategoryLiabilityCounts),
    selectedTimelineCategory: (__VLS_ctx.selectedTimelineCategory),
    selectedTimelineCategoryType: (__VLS_ctx.selectedTimelineCategoryType),
    applyCompositionCategoryFilter: (__VLS_ctx.applyCompositionCategoryFilter),
    handleCompositionAddType: (__VLS_ctx.handleCompositionAddType),
    displayedTimelineLoading: (__VLS_ctx.displayedTimelineLoading),
    visibleTimelineRows: (__VLS_ctx.visibleTimelineRows),
    selectedPosition: (__VLS_ctx.selectedPosition),
    timelinePresetOptions: (__VLS_ctx.timelinePresetOptions),
    customTimelineWindow: (__VLS_ctx.customTimelineWindow),
    selectedTimelinePreset: (__VLS_ctx.selectedTimelinePreset),
    setTimelinePreset: (__VLS_ctx.setTimelinePreset),
    timelineRangeCaption: (__VLS_ctx.timelineRangeCaption),
    setTimelineExpanded: (function (value) { return (__VLS_ctx.timelineExpanded = value); }),
    timelineChartPoints: (__VLS_ctx.timelineChartPoints),
    displayedTimelineUnit: (__VLS_ctx.displayCurrencyUnit((_b = (_a = __VLS_ctx.store.timeline) === null || _a === void 0 ? void 0 : _a.base_currency) !== null && _b !== void 0 ? _b : __VLS_ctx.unitLabel())),
    timelineSummaryLabel: (__VLS_ctx.timelineSummaryLabel),
    displayedTimelineSeriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
    formatNumber: (__VLS_ctx.formatNumber),
    timelineChartRows: (__VLS_ctx.timelineChartRows),
    showAccountingActivityBlock: (__VLS_ctx.showAccountingActivityBlock),
    accountingActivityLoading: (__VLS_ctx.accountingActivityLoading),
    accountingActivityYear: (__VLS_ctx.accountingActivityYear),
    showAccountingActivityNeedsReview: (__VLS_ctx.showAccountingActivityNeedsReview),
    showAccountingActivitySetupGap: (__VLS_ctx.showAccountingActivitySetupGap),
    accountingActivityError: (__VLS_ctx.accountingActivityError),
    accountingActivityRows: (__VLS_ctx.accountingActivityRows),
    positionActivityLoading: (__VLS_ctx.store.positionActivityLoading),
    positionActivityRows: (__VLS_ctx.positionActivityRows),
}));
var __VLS_7 = __VLS_6.apply(void 0, __spreadArray([{
        analysis: (__VLS_ctx.analysis),
        heroUnitLabel: (__VLS_ctx.heroUnitLabel),
        effectiveCategoryKeys: (__VLS_ctx.effectiveCategoryKeys),
        effectiveCategoryLabels: (__VLS_ctx.effectiveCategoryLabels),
        effectiveCategoryAssets: (__VLS_ctx.effectiveCategoryAssets),
        effectiveCategoryLiabilities: (__VLS_ctx.effectiveCategoryLiabilities),
        effectiveCategoryAssetCounts: (__VLS_ctx.effectiveCategoryAssetCounts),
        effectiveCategoryLiabilityCounts: (__VLS_ctx.effectiveCategoryLiabilityCounts),
        selectedTimelineCategory: (__VLS_ctx.selectedTimelineCategory),
        selectedTimelineCategoryType: (__VLS_ctx.selectedTimelineCategoryType),
        applyCompositionCategoryFilter: (__VLS_ctx.applyCompositionCategoryFilter),
        handleCompositionAddType: (__VLS_ctx.handleCompositionAddType),
        displayedTimelineLoading: (__VLS_ctx.displayedTimelineLoading),
        visibleTimelineRows: (__VLS_ctx.visibleTimelineRows),
        selectedPosition: (__VLS_ctx.selectedPosition),
        timelinePresetOptions: (__VLS_ctx.timelinePresetOptions),
        customTimelineWindow: (__VLS_ctx.customTimelineWindow),
        selectedTimelinePreset: (__VLS_ctx.selectedTimelinePreset),
        setTimelinePreset: (__VLS_ctx.setTimelinePreset),
        timelineRangeCaption: (__VLS_ctx.timelineRangeCaption),
        setTimelineExpanded: (function (value) { return (__VLS_ctx.timelineExpanded = value); }),
        timelineChartPoints: (__VLS_ctx.timelineChartPoints),
        displayedTimelineUnit: (__VLS_ctx.displayCurrencyUnit((_d = (_c = __VLS_ctx.store.timeline) === null || _c === void 0 ? void 0 : _c.base_currency) !== null && _d !== void 0 ? _d : __VLS_ctx.unitLabel())),
        timelineSummaryLabel: (__VLS_ctx.timelineSummaryLabel),
        displayedTimelineSeriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
        formatNumber: (__VLS_ctx.formatNumber),
        timelineChartRows: (__VLS_ctx.timelineChartRows),
        showAccountingActivityBlock: (__VLS_ctx.showAccountingActivityBlock),
        accountingActivityLoading: (__VLS_ctx.accountingActivityLoading),
        accountingActivityYear: (__VLS_ctx.accountingActivityYear),
        showAccountingActivityNeedsReview: (__VLS_ctx.showAccountingActivityNeedsReview),
        showAccountingActivitySetupGap: (__VLS_ctx.showAccountingActivitySetupGap),
        accountingActivityError: (__VLS_ctx.accountingActivityError),
        accountingActivityRows: (__VLS_ctx.accountingActivityRows),
        positionActivityLoading: (__VLS_ctx.store.positionActivityLoading),
        positionActivityRows: (__VLS_ctx.positionActivityRows),
    }], __VLS_functionalComponentArgsRest(__VLS_6), false));
var __VLS_10;
/** @ts-ignore @type {typeof __VLS_components.BaseModal | typeof __VLS_components.BaseModal} */
ui_1.BaseModal;
// @ts-ignore
var __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10(__assign({ 'onClose': {} }, { open: (__VLS_ctx.timelineExpanded), title: "Evolucion temporal", panelClass: "max-w-[1080px]" })));
var __VLS_12 = __VLS_11.apply(void 0, __spreadArray([__assign({ 'onClose': {} }, { open: (__VLS_ctx.timelineExpanded), title: "Evolucion temporal", panelClass: "max-w-[1080px]" })], __VLS_functionalComponentArgsRest(__VLS_11), false));
var __VLS_15;
var __VLS_16 = ({ close: {} },
    { onClose: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.timelineExpanded = false;
            // @ts-ignore
            [store, store, store, currencies, inflationRegions, valueMode, setValueMode, canShowReal, modeLabel, realBaseLabel, heroUnitLabel, heroUnitLabel, analysis, analysis, ownershipFilter, setOwnershipFilter, ownershipOptions, ownershipFilterDisabled, selectedOwnershipFilterLabel, formatNumber, formatNumber, formatPct, resetTimelineSelection, effectiveCategoryKeys, effectiveCategoryLabels, effectiveCategoryAssets, effectiveCategoryLiabilities, effectiveCategoryAssetCounts, effectiveCategoryLiabilityCounts, selectedTimelineCategory, selectedTimelineCategoryType, applyCompositionCategoryFilter, handleCompositionAddType, displayedTimelineLoading, visibleTimelineRows, selectedPosition, timelinePresetOptions, customTimelineWindow, selectedTimelinePreset, setTimelinePreset, timelineRangeCaption, timelineExpanded, timelineExpanded, timelineExpanded, timelineChartPoints, displayCurrencyUnit, unitLabel, timelineSummaryLabel, displayedTimelineSeriesColor, timelineChartRows, showAccountingActivityBlock, accountingActivityLoading, accountingActivityYear, showAccountingActivityNeedsReview, showAccountingActivitySetupGap, accountingActivityError, accountingActivityRows, positionActivityRows,];
        } });
var __VLS_17 = __VLS_13.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal-head" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal-head']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal-title" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal-title']} */ ;
(__VLS_ctx.timelineSummaryLabel);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal-copy" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal-copy']} */ ;
(__VLS_ctx.timelineRangeCaption);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal-value" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal-value']} */ ;
(__VLS_ctx.formatNumber((_f = (_e = __VLS_ctx.latestTimelineChartPoint) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : 0, 2));
(__VLS_ctx.displayCurrencyUnit((_h = (_g = __VLS_ctx.store.timeline) === null || _g === void 0 ? void 0 : _g.base_currency) !== null && _h !== void 0 ? _h : __VLS_ctx.unitLabel()));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-nw-timeline-modal-ranges" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-modal-ranges']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-nw-timeline-slider-group" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-slider-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onInput: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.updateTimelineWindowStart($event.target.value);
        // @ts-ignore
        [store, formatNumber, timelineRangeCaption, displayCurrencyUnit, unitLabel, timelineSummaryLabel, latestTimelineChartPoint, updateTimelineWindowStart,];
    } }, { class: "ui-nw-timeline-slider" }), { type: "range", min: "0", max: (Math.max(0, __VLS_ctx.visibleTimelineRows.length - 1)), value: (__VLS_ctx.timelineWindow.start) }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-slider']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
((_k = (_j = __VLS_ctx.timelineChartPoints[0]) === null || _j === void 0 ? void 0 : _j.fullLabel) !== null && _k !== void 0 ? _k : '-');
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)(__assign({ class: "ui-nw-timeline-slider-group" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-slider-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onInput: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.updateTimelineWindowEnd($event.target.value);
        // @ts-ignore
        [visibleTimelineRows, timelineChartPoints, timelineWindow, updateTimelineWindowEnd,];
    } }, { class: "ui-nw-timeline-slider" }), { type: "range", min: "0", max: (Math.max(0, __VLS_ctx.visibleTimelineRows.length - 1)), value: (__VLS_ctx.timelineWindow.end) }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-slider']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
((_m = (_l = __VLS_ctx.latestTimelineChartPoint) === null || _l === void 0 ? void 0 : _l.fullLabel) !== null && _m !== void 0 ? _m : '-');
var __VLS_18;
/** @ts-ignore @type {typeof __VLS_components.NetWorthTimelineChart} */
net_worth_1.NetWorthTimelineChart;
// @ts-ignore
var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    points: (__VLS_ctx.timelineChartPoints),
    unit: (__VLS_ctx.displayCurrencyUnit((_p = (_o = __VLS_ctx.store.timeline) === null || _o === void 0 ? void 0 : _o.base_currency) !== null && _p !== void 0 ? _p : __VLS_ctx.unitLabel())),
    seriesLabel: (__VLS_ctx.timelineSummaryLabel),
    seriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
    expanded: true,
}));
var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([{
        points: (__VLS_ctx.timelineChartPoints),
        unit: (__VLS_ctx.displayCurrencyUnit((_r = (_q = __VLS_ctx.store.timeline) === null || _q === void 0 ? void 0 : _q.base_currency) !== null && _r !== void 0 ? _r : __VLS_ctx.unitLabel())),
        seriesLabel: (__VLS_ctx.timelineSummaryLabel),
        seriesColor: (__VLS_ctx.displayedTimelineSeriesColor),
        expanded: true,
    }], __VLS_functionalComponentArgsRest(__VLS_19), false));
// @ts-ignore
[store, visibleTimelineRows, timelineChartPoints, displayCurrencyUnit, unitLabel, timelineSummaryLabel, displayedTimelineSeriesColor, latestTimelineChartPoint, timelineWindow,];
var __VLS_13;
var __VLS_14;
__VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "ui-nw-timeline-sidebar" }));
/** @type {__VLS_StyleScopedClasses['ui-nw-timeline-sidebar']} */ ;
var __VLS_23 = NetWorthCategoryWorkspace_vue_1.default;
// @ts-ignore
var __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    showCategoryWorkspace: (__VLS_ctx.showCategoryWorkspace),
    timelineSidebarPanelStyle: (__VLS_ctx.timelineSidebarPanelStyle),
    selectedTimelineCategoryType: (__VLS_ctx.selectedTimelineCategoryType),
    selectedTimelineCategory: (__VLS_ctx.selectedTimelineCategory),
    categoryWorkspaceLabel: (__VLS_ctx.categoryWorkspaceLabel),
    categoryWorkspaceMeta: (__VLS_ctx.categoryWorkspaceMeta),
    openCreateModal: (__VLS_ctx.openCreateModal),
    showPositionSelector: (__VLS_ctx.showPositionSelector),
    selectedPositionId: (__VLS_ctx.selectedPositionId),
    onPositionSelection: (__VLS_ctx.onPositionSelection),
    availablePositionRows: (__VLS_ctx.availablePositionRows),
    categoryWorkspaceRows: (__VLS_ctx.categoryWorkspaceRows),
    selectedPositionType: (__VLS_ctx.selectedPositionType),
    formatNumber: (__VLS_ctx.formatNumber),
    formatPct: (__VLS_ctx.formatPct),
    displayCurrencyUnit: (__VLS_ctx.displayCurrencyUnit),
    ownershipBadgeForRow: (__VLS_ctx.ownershipBadgeForRow),
    selectPosition: (__VLS_ctx.selectPosition),
    editRow: (__VLS_ctx.editRow),
    deleteRow: (__VLS_ctx.deleteRow),
}));
var __VLS_25 = __VLS_24.apply(void 0, __spreadArray([{
        showCategoryWorkspace: (__VLS_ctx.showCategoryWorkspace),
        timelineSidebarPanelStyle: (__VLS_ctx.timelineSidebarPanelStyle),
        selectedTimelineCategoryType: (__VLS_ctx.selectedTimelineCategoryType),
        selectedTimelineCategory: (__VLS_ctx.selectedTimelineCategory),
        categoryWorkspaceLabel: (__VLS_ctx.categoryWorkspaceLabel),
        categoryWorkspaceMeta: (__VLS_ctx.categoryWorkspaceMeta),
        openCreateModal: (__VLS_ctx.openCreateModal),
        showPositionSelector: (__VLS_ctx.showPositionSelector),
        selectedPositionId: (__VLS_ctx.selectedPositionId),
        onPositionSelection: (__VLS_ctx.onPositionSelection),
        availablePositionRows: (__VLS_ctx.availablePositionRows),
        categoryWorkspaceRows: (__VLS_ctx.categoryWorkspaceRows),
        selectedPositionType: (__VLS_ctx.selectedPositionType),
        formatNumber: (__VLS_ctx.formatNumber),
        formatPct: (__VLS_ctx.formatPct),
        displayCurrencyUnit: (__VLS_ctx.displayCurrencyUnit),
        ownershipBadgeForRow: (__VLS_ctx.ownershipBadgeForRow),
        selectPosition: (__VLS_ctx.selectPosition),
        editRow: (__VLS_ctx.editRow),
        deleteRow: (__VLS_ctx.deleteRow),
    }], __VLS_functionalComponentArgsRest(__VLS_24), false));
if (__VLS_ctx.store.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "alert mt-3" }));
    /** @type {__VLS_StyleScopedClasses['alert']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
    (__VLS_ctx.prettyError());
}
var __VLS_28 = NetWorthSnapshotsSection_vue_1.default;
// @ts-ignore
var __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    snapshots: (__VLS_ctx.store.snapshots),
    loading: (__VLS_ctx.store.loading),
    formatMoney: (__VLS_ctx.formatMoney),
    displayCurrencyUnit: (__VLS_ctx.displayCurrencyUnit),
    confirmDeleteSnapshot: (__VLS_ctx.confirmDeleteSnapshot),
}));
var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([{
        snapshots: (__VLS_ctx.store.snapshots),
        loading: (__VLS_ctx.store.loading),
        formatMoney: (__VLS_ctx.formatMoney),
        displayCurrencyUnit: (__VLS_ctx.displayCurrencyUnit),
        confirmDeleteSnapshot: (__VLS_ctx.confirmDeleteSnapshot),
    }], __VLS_functionalComponentArgsRest(__VLS_29), false));
var __VLS_33 = NetWorthItemModals_vue_1.default;
// @ts-ignore
var __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    showAssetModal: (__VLS_ctx.showAssetModal),
    showLiabilityModal: (__VLS_ctx.showLiabilityModal),
    showEditModal: (__VLS_ctx.showEditModal),
    editTitle: (__VLS_ctx.editTitle),
    assetCategories: (__VLS_ctx.assetCategories),
    liabilityCategories: (__VLS_ctx.liabilityCategories),
    assetSubcategories: (__VLS_ctx.assetSubcategories),
    assetCreateInitial: (__VLS_ctx.assetCreateInitial),
    liabilityCreateInitial: (__VLS_ctx.liabilityCreateInitial),
    editInitial: (__VLS_ctx.editInitial),
    editCategories: (__VLS_ctx.editCategories),
    editKind: (__VLS_ctx.editKind),
    activeAssets: (__VLS_ctx.activeAssets),
    itemFormProps: (__VLS_ctx.itemFormProps),
    submitAssetFromView: (__VLS_ctx.submitAssetFromView),
    submitLiabilityFromView: (__VLS_ctx.submitLiabilityFromView),
    submitEdit: (__VLS_ctx.submitEdit),
    closeEdit: (__VLS_ctx.closeEdit),
    onCloseAssetModal: (__VLS_ctx.closeAssetModal),
    onCloseLiabilityModal: (__VLS_ctx.closeLiabilityModal),
}));
var __VLS_35 = __VLS_34.apply(void 0, __spreadArray([{
        showAssetModal: (__VLS_ctx.showAssetModal),
        showLiabilityModal: (__VLS_ctx.showLiabilityModal),
        showEditModal: (__VLS_ctx.showEditModal),
        editTitle: (__VLS_ctx.editTitle),
        assetCategories: (__VLS_ctx.assetCategories),
        liabilityCategories: (__VLS_ctx.liabilityCategories),
        assetSubcategories: (__VLS_ctx.assetSubcategories),
        assetCreateInitial: (__VLS_ctx.assetCreateInitial),
        liabilityCreateInitial: (__VLS_ctx.liabilityCreateInitial),
        editInitial: (__VLS_ctx.editInitial),
        editCategories: (__VLS_ctx.editCategories),
        editKind: (__VLS_ctx.editKind),
        activeAssets: (__VLS_ctx.activeAssets),
        itemFormProps: (__VLS_ctx.itemFormProps),
        submitAssetFromView: (__VLS_ctx.submitAssetFromView),
        submitLiabilityFromView: (__VLS_ctx.submitLiabilityFromView),
        submitEdit: (__VLS_ctx.submitEdit),
        closeEdit: (__VLS_ctx.closeEdit),
        onCloseAssetModal: (__VLS_ctx.closeAssetModal),
        onCloseLiabilityModal: (__VLS_ctx.closeLiabilityModal),
    }], __VLS_functionalComponentArgsRest(__VLS_34), false));
if (__VLS_ctx.store.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-status-line" }));
    /** @type {__VLS_StyleScopedClasses['ui-status-line']} */ ;
}
// @ts-ignore
[store, store, store, store, formatNumber, formatPct, selectedTimelineCategory, selectedTimelineCategoryType, displayCurrencyUnit, displayCurrencyUnit, showCategoryWorkspace, timelineSidebarPanelStyle, categoryWorkspaceLabel, categoryWorkspaceMeta, openCreateModal, showPositionSelector, selectedPositionId, onPositionSelection, availablePositionRows, categoryWorkspaceRows, selectedPositionType, ownershipBadgeForRow, selectPosition, editRow, deleteRow, prettyError, formatMoney, confirmDeleteSnapshot, showAssetModal, showLiabilityModal, showEditModal, editTitle, assetCategories, liabilityCategories, assetSubcategories, assetCreateInitial, liabilityCreateInitial, editInitial, editCategories, editKind, activeAssets, itemFormProps, submitAssetFromView, submitLiabilityFromView, submitEdit, closeEdit, closeAssetModal, closeLiabilityModal,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
