"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var test_utils_1 = require("@vue/test-utils");
var vitest_1 = require("vitest");
var useNetWorthOwnership_1 = require("@/domains/net-worth/useNetWorthOwnership");
var useNetWorthPageMetrics_1 = require("@/domains/net-worth/useNetWorthPageMetrics");
var useNetWorthTimeline_1 = require("@/domains/net-worth/useNetWorthTimeline");
var mocks = vitest_1.vi.hoisted(function () { return ({
    coreNetWorthApi: {
        getAssetTimeline: vitest_1.vi.fn(),
        getLiabilityTimeline: vitest_1.vi.fn(),
    },
}); });
vitest_1.vi.mock('@/domains/net-worth', function () { return ({
    coreNetWorthApi: mocks.coreNetWorthApi,
}); });
function makeSummary(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ base_currency: 'EUR', total_assets: '1500', total_liabilities: '400', net_worth: '1100', assets_by_category: {}, assets_by_subcategory: {}, liabilities_by_category: {}, inflation_region: 'ES', inflation_base_period: '2025-01', inflation_available: true, inflation_status: 'available', total_assets_real: '1400', total_liabilities_real: '350', net_worth_real: '1050', assets_by_category_real: {}, liabilities_by_category_real: {} }, overrides);
}
function makeAsset(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: 1, name: 'Cuenta', category: 'cash', subcategory: 'bank', tracking_mode: 'manual', accounting_account_id: null, currency: 'EUR', amount: '1000', is_active: true, notes: '' }, overrides);
}
function makeOwnerships() {
    return [
        {
            id: 1,
            kind: 'individual',
            member: { id: 7, name: 'Ana', role: 'adult' },
            splits: [],
            notes: '',
        },
        {
            id: 2,
            kind: 'shared',
            member: null,
            splits: [
                { member: { id: 7, name: 'Ana', role: 'adult' }, percent: '75' },
                { member: { id: 9, name: 'Luis', role: 'adult' }, percent: '25' },
            ],
            notes: '',
        },
    ];
}
(0, vitest_1.describe)('net-worth page refactor composables', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        mocks.coreNetWorthApi.getAssetTimeline.mockResolvedValue({
            data: {
                rows: [
                    { date: '2025-01-01', value: '100', value_base: '100' },
                    { date: '2025-02-01', value: '120', value_base: '120' },
                ],
            },
        });
        mocks.coreNetWorthApi.getLiabilityTimeline.mockResolvedValue({
            data: {
                rows: [
                    { date: '2025-01-01', value: '40', value_base: '40' },
                    { date: '2025-02-01', value: '30', value_base: '30' },
                ],
            },
        });
    });
    (0, vitest_1.it)('computes ownership options, fractions and resets filter in real mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var valueMode, ownerships, ownership;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valueMode = (0, vue_1.ref)('nominal');
                    ownerships = (0, vue_1.ref)(makeOwnerships());
                    ownership = (0, useNetWorthOwnership_1.useNetWorthOwnership)({ ownerships: ownerships, valueMode: valueMode });
                    (0, vitest_1.expect)(ownership.ownershipOptions.value.map(function (row) { return row.label; })).toEqual(['Ana', 'Luis']);
                    (0, vitest_1.expect)(ownership.allocationFractionForNetWorthOwner(2, 7)).toBe(0.75);
                    (0, vitest_1.expect)(ownership.matchesOwnershipFilter(1)).toBe(true);
                    (0, vitest_1.expect)(ownership.ownershipBadge(2)).toBe('Ana + Luis');
                    ownership.setOwnershipFilter(7);
                    ownership.setValueMode('real');
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(ownership.ownershipFilter.value).toBe('all');
                    (0, vitest_1.expect)(ownership.ownershipFilterDisabled.value).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('derives page metrics and workspace rows from ownership-filtered data', function () {
        var ownershipFilter = (0, vue_1.ref)(7);
        var selectedTimelineCategory = (0, vue_1.ref)('cash');
        var selectedTimelineCategoryType = (0, vue_1.ref)('asset');
        var selectedPositionType = (0, vue_1.ref)(null);
        var selectedPositionId = (0, vue_1.ref)(null);
        var metrics = (0, useNetWorthPageMetrics_1.useNetWorthPageMetrics)({
            assets: (0, vue_1.ref)([
                makeAsset({ id: 1, name: 'Cuenta comun', ownership_ref: 2, amount_base: '800' }),
                makeAsset({ id: 2, name: 'Cuenta Ana', ownership_ref: 1, amount_base: '200' }),
            ]),
            liabilities: (0, vue_1.ref)([
                makeAsset({
                    id: 3,
                    name: 'Hipoteca',
                    category: 'mortgage',
                    subcategory: '',
                    ownership_ref: 2,
                    amount_base: '400',
                    financed_asset_ref: 1,
                }),
            ]),
            baseCurrency: (0, vue_1.ref)('EUR'),
            summary: (0, vue_1.ref)(makeSummary()),
            positionTimelineRowsSource: (0, vue_1.ref)([
                { date: '2025-01-01', value: '100', value_base: '100' },
            ]),
            assetCategories: [{ value: 'cash', label: 'Liquidez' }],
            liabilityCategories: [{ value: 'mortgage', label: 'Hipoteca' }],
            byCategoryKeys: (0, vue_1.ref)(['cash', 'mortgage']),
            byCategoryAssets: (0, vue_1.ref)([1000, 0]),
            byCategoryLiabilities: (0, vue_1.ref)([0, 400]),
            summaryAssets: (0, vue_1.ref)('1000'),
            summaryLiabilities: (0, vue_1.ref)('400'),
            summaryNetWorth: (0, vue_1.ref)('600'),
            summaryAssetBackedLiabilities: (0, vue_1.ref)('400'),
            summaryUnbackedLiabilities: (0, vue_1.ref)('0'),
            ownershipFilter: ownershipFilter,
            selectedTimelineCategory: selectedTimelineCategory,
            selectedTimelineCategoryType: selectedTimelineCategoryType,
            selectedPositionType: selectedPositionType,
            selectedPositionId: selectedPositionId,
            matchesOwnershipFilter: function (ownershipRef) { return ownershipRef === 1 || ownershipRef === 2; },
            allocationFractionForNetWorthOwner: function (ownershipRef, selectedOwner) {
                if (selectedOwner === 'all')
                    return 1;
                if (ownershipRef === 1 && selectedOwner === 7)
                    return 1;
                if (ownershipRef === 2 && selectedOwner === 7)
                    return 0.75;
                return 0;
            },
        });
        (0, vitest_1.expect)(metrics.assetsValue.value).toBe(800);
        (0, vitest_1.expect)(metrics.liabilitiesValue.value).toBe(300);
        (0, vitest_1.expect)(metrics.analysis.value.netWorth).toBe(500);
        (0, vitest_1.expect)(metrics.selectedCategoryLabel.value).toBe('Liquidez');
        (0, vitest_1.expect)(metrics.availablePositionRows.value).toHaveLength(2);
        (0, vitest_1.expect)(metrics.categoryWorkspaceRows.value).toHaveLength(2);
        (0, vitest_1.expect)(metrics.activeAssets.value).toEqual([
            { id: 1, name: 'Cuenta comun', category: 'cash' },
            { id: 2, name: 'Cuenta Ana', category: 'cash' },
        ]);
    });
    (0, vitest_1.it)('builds ownership-scoped timeline rows and chart metadata', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ownershipFilter, selectedPositionType, selectedPositionId, selectedTimelineCategory, selectedTimelineCategoryType, selectedTimelinePreset, customTimelineWindow, resetPositionSelection, setStoreError, timeline;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ownershipFilter = (0, vue_1.ref)(7);
                    selectedPositionType = (0, vue_1.ref)(null);
                    selectedPositionId = (0, vue_1.ref)(null);
                    selectedTimelineCategory = (0, vue_1.ref)(null);
                    selectedTimelineCategoryType = (0, vue_1.ref)('asset');
                    selectedTimelinePreset = (0, vue_1.ref)('all');
                    customTimelineWindow = (0, vue_1.ref)(null);
                    resetPositionSelection = vitest_1.vi.fn();
                    setStoreError = vitest_1.vi.fn();
                    timeline = (0, useNetWorthTimeline_1.useNetWorthTimeline)({
                        ownershipFilter: ownershipFilter,
                        selectedPosition: (0, vue_1.computed)(function () { return null; }),
                        selectedPositionType: selectedPositionType,
                        selectedPositionId: selectedPositionId,
                        selectedTimelineCategory: selectedTimelineCategory,
                        selectedTimelineCategoryType: selectedTimelineCategoryType,
                        selectedTimelinePreset: selectedTimelinePreset,
                        customTimelineWindow: customTimelineWindow,
                        timelineRows: (0, vue_1.computed)(function () { return [
                            { date: '2025-01-01', label: 'ene 25', netWorth: 60, assets: 100, liabilities: 40 },
                        ]; }),
                        availablePositionRows: (0, vue_1.computed)(function () { return []; }),
                        allAssetPositionRows: (0, vue_1.computed)(function () { return [
                            {
                                id: 1,
                                type: 'asset',
                                category: 'cash',
                                name: 'Cuenta',
                                subtitle: 'cash / bank',
                                value: 80,
                                currency: 'EUR',
                                ownershipFraction: 0.75,
                            },
                        ]; }),
                        allLiabilityPositionRows: (0, vue_1.computed)(function () { return [
                            {
                                id: 3,
                                type: 'liability',
                                category: 'mortgage',
                                name: 'Hipoteca',
                                subtitle: 'mortgage',
                                value: 30,
                                currency: 'EUR',
                                ownershipFraction: 0.75,
                            },
                        ]; }),
                        positionTimelineRows: (0, vue_1.computed)(function () { return []; }),
                        storeTimelineLoading: (0, vue_1.ref)(false),
                        storePositionTimelineLoading: (0, vue_1.ref)(false),
                        setStoreError: setStoreError,
                        resetPositionSelection: resetPositionSelection,
                        getTimelineMetricValue: function (row) { return row.netWorth; },
                    });
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(mocks.coreNetWorthApi.getAssetTimeline).toHaveBeenCalledWith(1);
                    (0, vitest_1.expect)(mocks.coreNetWorthApi.getLiabilityTimeline).toHaveBeenCalledWith(3);
                    (0, vitest_1.expect)(timeline.visibleTimelineRows.value.map(function (row) { return row.value; })).toEqual([45, 67.5]);
                    (0, vitest_1.expect)((_a = timeline.timelineChartPoints.value[timeline.timelineChartPoints.value.length - 1]) === null || _a === void 0 ? void 0 : _a.fullLabel).toBe('febrero de 2025');
                    (0, vitest_1.expect)(timeline.timelineRangeCaption.value).toBe('enero de 2025 - febrero de 2025');
                    (0, vitest_1.expect)(timeline.timelineSummaryLabel.value).toBe('Ultimo patrimonio neto');
                    (0, vitest_1.expect)(timeline.displayedTimelineSeriesColor.value).toBe('#4cc3ff');
                    (0, vitest_1.expect)(setStoreError).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(resetPositionSelection).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
