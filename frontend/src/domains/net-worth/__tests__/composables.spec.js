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
var vitest_1 = require("vitest");
var vue_1 = require("vue");
var composables_1 = require("@/domains/net-worth/composables");
var mocks = vitest_1.vi.hoisted(function () { return ({
    useNetWorthStore: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('@/stores/netWorth', function () { return ({
    useNetWorthStore: mocks.useNetWorthStore,
}); });
function makeSummary(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ base_currency: 'EUR', total_assets: '1000', total_liabilities: '200', net_worth: '800', assets_by_category: {}, assets_by_subcategory: {}, liabilities_by_category: {}, inflation_region: 'ES', inflation_base_period: '2025-01', inflation_available: true, inflation_status: 'available', total_assets_real: '900', total_liabilities_real: '180', net_worth_real: '720', assets_by_category_real: {}, liabilities_by_category_real: {} }, overrides);
}
function makeItem(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: 1, name: 'Asset', category: 'cash', subcategory: 'bank_account', tracking_mode: 'manual', accounting_account_id: null, currency: 'EUR', amount: '1000.5000', is_active: true, notes: 'N' }, overrides);
}
(0, vitest_1.describe)('useNetWorthViewState (core)', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.stubGlobal('confirm', vitest_1.vi.fn(function () { return true; }));
    });
    (0, vitest_1.it)('loads store on mount and maps submit/delete flows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, vue_1.reactive)({
                        loading: false,
                        error: null,
                        baseCurrency: 'EUR',
                        summary: makeSummary(),
                        byCategoryChart: { keys: [], assets: [], liabilities: [], unit: 'EUR' },
                        fetchSettings: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        refreshAll: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createAsset: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createLiability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteSnapshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateAsset: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateLiability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                    });
                    mocks.useNetWorthStore.mockReturnValue(store);
                    state = (0, composables_1.useNetWorthViewState)();
                    state.showAssetModal.value = true;
                    return [4 /*yield*/, state.submitAsset({ name: 'A' })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(store.createAsset).toHaveBeenCalledWith({ name: 'A' });
                    (0, vitest_1.expect)(state.showAssetModal.value).toBe(false);
                    state.showLiabilityModal.value = true;
                    return [4 /*yield*/, state.submitLiability({ name: 'L' })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(store.createLiability).toHaveBeenCalledWith({ name: 'L' });
                    (0, vitest_1.expect)(state.showLiabilityModal.value).toBe(false);
                    state.confirmDeleteSnapshot(7);
                    (0, vitest_1.expect)(store.deleteSnapshot).toHaveBeenCalledWith(7);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reacts to mode changes, computes labels, edit payloads and error messages', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, state, asset, liability;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    store = (0, vue_1.reactive)({
                        loading: false,
                        error: '{"detail":"boom"}',
                        baseCurrency: 'EUR',
                        summary: __assign(__assign({}, makeSummary()), { assets_by_category_real: {
                                cash: '9',
                                mortgage: '0',
                            }, liabilities_by_category_real: {
                                cash: '0',
                                mortgage: '4',
                            }, liabilities_asset_backed: '100', liabilities_unbacked: '50', liabilities_asset_backed_real: '80', liabilities_unbacked_real: '40' }),
                        byCategoryChart: {
                            keys: ['cash', 'mortgage', 'other'],
                            assets: [10, 0, 0],
                            liabilities: [0, 5, 0],
                            unit: 'EUR',
                        },
                        fetchSettings: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        refreshAll: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createAsset: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createLiability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteSnapshot: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateAsset: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateLiability: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                    });
                    mocks.useNetWorthStore.mockReturnValue(store);
                    state = (0, composables_1.useNetWorthViewState)();
                    (0, vitest_1.expect)(state.prettyError()).toBe('boom');
                    (0, vitest_1.expect)(state.canShowReal()).toBe(true);
                    state.valueMode.value = 'real';
                    (0, vitest_1.expect)(state.unitLabel()).toBe('EUR (2025-01)');
                    (0, vitest_1.expect)(state.modeLabel()).toContain('2025-01');
                    (0, vitest_1.expect)(state.realBaseLabel.value).toBe('Base: 2025-01');
                    (0, vitest_1.expect)(state.summaryAssets.value).toBe('900');
                    (0, vitest_1.expect)(state.summaryAssetBackedLiabilities.value).toBe('80');
                    (0, vitest_1.expect)(state.summaryUnbackedLiabilities.value).toBe('40');
                    (0, vitest_1.expect)(state.byCategoryKeys.value).toEqual(['cash', 'mortgage']);
                    (0, vitest_1.expect)(state.byCategoryLabels.value).toEqual(['Liquidez', 'Hipoteca']);
                    (0, vitest_1.expect)(state.byCategoryAssets.value).toEqual([9, 0]);
                    (0, vitest_1.expect)(state.byCategoryLiabilities.value).toEqual([0, 4]);
                    asset = makeItem({
                        financed_asset_ref: 33,
                        valuation_model: 'real_estate_auto',
                        land_value_share_percent: '42.3',
                        land_annual_appreciation_percent: '3',
                        building_annual_depreciation_percent: '1',
                    });
                    state.openEdit(asset, 'asset');
                    (0, vitest_1.expect)(state.showEditModal.value).toBe(true);
                    (0, vitest_1.expect)(state.editTitle.value).toBe('Editar activo');
                    (0, vitest_1.expect)((_a = state.editInitial.value) === null || _a === void 0 ? void 0 : _a.amount).toBe('1000.5');
                    (0, vitest_1.expect)((_b = state.editInitial.value) === null || _b === void 0 ? void 0 : _b.financed_asset_id).toBe(33);
                    (0, vitest_1.expect)((_c = state.editInitial.value) === null || _c === void 0 ? void 0 : _c.valuation_model).toBe('real_estate_auto');
                    (0, vitest_1.expect)((_d = state.editInitial.value) === null || _d === void 0 ? void 0 : _d.land_value_share_percent).toBe('42.3');
                    (0, vitest_1.expect)((_e = state.editInitial.value) === null || _e === void 0 ? void 0 : _e.land_annual_appreciation_percent).toBe('3');
                    (0, vitest_1.expect)((_f = state.editInitial.value) === null || _f === void 0 ? void 0 : _f.building_annual_depreciation_percent).toBe('1');
                    return [4 /*yield*/, state.submitEdit({ name: 'edited', financed_asset_id: 99 })];
                case 1:
                    _g.sent();
                    (0, vitest_1.expect)(store.updateAsset).toHaveBeenCalledWith(1, { name: 'edited' });
                    (0, vitest_1.expect)(state.showEditModal.value).toBe(false);
                    liability = makeItem({ id: 2, name: 'Liability' });
                    state.openEdit(liability, 'liability');
                    (0, vitest_1.expect)(state.editTitle.value).toBe('Editar pasivo');
                    return [4 /*yield*/, state.submitEdit({ name: 'L2', financed_asset_id: 88 })];
                case 2:
                    _g.sent();
                    (0, vitest_1.expect)(store.updateLiability).toHaveBeenCalledWith(2, { name: 'L2', financed_asset_id: 88 });
                    store.baseCurrency = 'USD';
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 3:
                    _g.sent();
                    (0, vitest_1.expect)(state.valueMode.value).toBe('nominal');
                    return [2 /*return*/];
            }
        });
    }); });
});
