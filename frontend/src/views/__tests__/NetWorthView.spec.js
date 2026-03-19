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
/** @vitest-environment jsdom */
var vue_1 = require("vue");
var vitest_1 = require("vitest");
var test_utils_1 = require("@vue/test-utils");
var NetWorthView_vue_1 = require("../NetWorthView.vue");
var mockUseNetWorthViewState = vitest_1.vi.fn();
var mockUseNetWorthViewExtensions = vitest_1.vi.fn();
var mockPush = vitest_1.vi.fn();
var mockCoreNetWorthApi = vitest_1.vi.hoisted(function () { return ({
    getAssetTimeline: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ data: { rows: [], base_currency: 'EUR' } })];
    }); }); }),
    getLiabilityTimeline: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ data: { rows: [], base_currency: 'EUR' } })];
    }); }); }),
}); });
var mockCoreAccountingApi = vitest_1.vi.hoisted(function () { return ({
    getTransactions: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ data: [] })];
    }); }); }),
}); });
function makeStub(name) {
    return (0, vue_1.defineComponent)({
        name: name,
        template: "<div data-test=\"".concat(name, "\"><slot /></div>"),
    });
}
vitest_1.vi.mock('@/domains/net-worth', function () { return ({
    ItemForm: makeStub('ItemForm'),
    ItemList: makeStub('ItemList'),
    NetWorthByCategoryBar: makeStub('NetWorthByCategoryBar'),
    NetWorthTimelineChart: makeStub('NetWorthTimelineChart'),
    NetWorthDonut: (0, vue_1.defineComponent)({
        name: 'NetWorthDonut',
        props: {
            showComposition: { type: Boolean, required: false, default: true },
        },
        emits: ['select-category', 'add-type', 'add-category'],
        template: "\n      <div data-test=\"NetWorthDonut\">\n        <div data-test=\"NetWorthDonut-slot\"><slot name=\"side-top\" /></div>\n        <template v-if=\"showComposition\">\n          <button\n          data-test=\"donut-select-asset\"\n          type=\"button\"\n          @click=\"$emit('select-category', { key: 'cash', type: 'asset' })\"\n        >\n          asset\n        </button>\n          <button\n          data-test=\"donut-select-liability\"\n          type=\"button\"\n          @click=\"$emit('select-category', { key: 'mortgage', type: 'liability' })\"\n        >\n          liability\n        </button>\n          <button\n          data-test=\"donut-add-asset\"\n          type=\"button\"\n          @click=\"$emit('add-type', { type: 'asset' })\"\n        >\n          add-asset\n        </button>\n        </template>\n      </div>\n    ",
    }),
    SettingsPopover: makeStub('SettingsPopover'),
    coreNetWorthApi: mockCoreNetWorthApi,
    useNetWorthViewState: function () { return mockUseNetWorthViewState(); },
    useNetWorthViewExtensions: function () { return mockUseNetWorthViewExtensions(); },
}); });
vitest_1.vi.mock('@/domains/ui', function () { return ({
    BaseModal: (0, vue_1.defineComponent)({
        name: 'BaseModal',
        props: {
            open: { type: Boolean, required: true },
            title: { type: String, required: false, default: '' },
            panelClass: { type: String, required: false, default: '' },
        },
        template: '<div><slot v-if="open" /></div>',
    }),
}); });
vitest_1.vi.mock('@/domains/accounting', function () { return ({
    coreAccountingApi: mockCoreAccountingApi,
}); });
function makeState(overrides) {
    if (overrides === void 0) { overrides = {}; }
    var store = {
        loading: false,
        error: null,
        baseCurrency: 'EUR',
        inflationRegion: 'ES',
        summary: {
            base_currency: 'EUR',
            total_assets: '1000',
            total_liabilities: '250',
            net_worth: '750',
            assets_by_category: {},
            assets_by_subcategory: {},
            liabilities_by_category: {},
            inflation_region: 'ES',
            inflation_base_period: '2025-01',
            inflation_available: true,
            inflation_status: 'available',
        },
        assets: [],
        liabilities: [],
        snapshots: [],
        ownerships: [],
        timeline: { rows: [], base_currency: 'EUR' },
        timelineLoading: false,
        positionTimeline: {
            rows: [],
            base_currency: 'EUR',
            position_type: 'asset',
            position_id: 1,
        },
        positionTimelineLoading: false,
        positionActivityLoading: false,
        assetValuations: [],
        liabilityValuations: [],
        investmentEvents: [],
        liquidityEvents: [],
        liabilityEvents: [],
        refreshAll: vitest_1.vi.fn(),
        fetchTimeline: vitest_1.vi.fn(),
        fetchPositionTimeline: vitest_1.vi.fn(),
        fetchPositionActivity: vitest_1.vi.fn(),
        createTodaySnapshot: vitest_1.vi.fn(),
        updateBaseCurrency: vitest_1.vi.fn(),
        updateInflationRegion: vitest_1.vi.fn(),
        updateAsset: vitest_1.vi.fn(),
        archiveAsset: vitest_1.vi.fn(),
        deleteAsset: vitest_1.vi.fn(),
        updateLiability: vitest_1.vi.fn(),
        archiveLiability: vitest_1.vi.fn(),
        deleteLiability: vitest_1.vi.fn(),
    };
    return __assign({ store: store, valueMode: (0, vue_1.ref)('nominal'), currencies: [{ value: 'EUR', label: 'EUR' }], assetCategories: [{ value: 'cash', label: 'Liquidez' }], assetSubcategories: [{ category: 'cash', value: 'bank_account', label: 'Cuenta bancaria' }], liabilityCategories: [{ value: 'mortgage', label: 'Hipoteca' }], prettyError: vitest_1.vi.fn(function () { return 'Error bonito'; }), showAssetModal: (0, vue_1.ref)(false), showLiabilityModal: (0, vue_1.ref)(false), showBreakdown: (0, vue_1.ref)(false), showEditModal: (0, vue_1.ref)(false), editKind: (0, vue_1.ref)(null), canShowReal: vitest_1.vi.fn(function () { return true; }), submitAsset: vitest_1.vi.fn(), submitLiability: vitest_1.vi.fn(), openEdit: vitest_1.vi.fn(), closeEdit: vitest_1.vi.fn(), confirmDeleteSnapshot: vitest_1.vi.fn(), editTitle: 'Editar activo', editCategories: [], editInitial: null, submitEdit: vitest_1.vi.fn(), formatMoney: vitest_1.vi.fn(function (v) { return v; }), unitLabel: vitest_1.vi.fn(function () { return 'EUR'; }), modeLabel: vitest_1.vi.fn(function () { return 'Nominal'; }), realBaseLabel: (0, vue_1.ref)(''), summaryAssets: (0, vue_1.ref)('1000'), summaryLiabilities: (0, vue_1.ref)('250'), summaryNetWorth: (0, vue_1.ref)('750'), byCategoryKeys: (0, vue_1.ref)(['cash']), byCategoryLabels: (0, vue_1.ref)(['Liquidez']), byCategoryAssets: (0, vue_1.ref)([1000]), byCategoryLiabilities: (0, vue_1.ref)([250]), byCategoryUnit: (0, vue_1.ref)('EUR'), summaryAssetBackedLiabilities: (0, vue_1.ref)('150'), summaryUnbackedLiabilities: (0, vue_1.ref)('100') }, overrides);
}
(0, vitest_1.describe)('NetWorthView', function () {
    (0, vitest_1.beforeEach)(function () {
        mockUseNetWorthViewState.mockReset();
        mockUseNetWorthViewExtensions.mockReset();
        mockPush.mockReset();
        mockCoreNetWorthApi.getAssetTimeline.mockClear();
        mockCoreNetWorthApi.getLiabilityTimeline.mockClear();
        mockCoreAccountingApi.getTransactions.mockClear();
    });
    (0, vitest_1.it)('renders key sections and current analytics blocks', function () {
        mockUseNetWorthViewState.mockReturnValue(makeState());
        mockUseNetWorthViewExtensions.mockReturnValue({
            HeaderActions: null,
            itemFormProps: {},
            itemListProps: {},
        });
        var wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default, {
            global: {
                mocks: {
                    $router: { push: mockPush },
                },
            },
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('Patrimonio');
        (0, vitest_1.expect)(wrapper.text()).toContain('Patrimonio neto');
        (0, vitest_1.expect)(wrapper.text()).not.toContain('Detalle por posicion');
        (0, vitest_1.expect)(wrapper.find('select.ui-nw-position-select-input').exists()).toBe(false);
        (0, vitest_1.expect)(wrapper.text()).toContain('Activos');
        (0, vitest_1.expect)(wrapper.text()).toContain('Pasivos');
        (0, vitest_1.expect)(wrapper.text()).not.toContain('Ratio deuda / activos');
        (0, vitest_1.expect)(wrapper.find('[data-test="NetWorthDonut"]').exists()).toBe(true);
        (0, vitest_1.expect)(wrapper.text()).toContain('No hay snapshots');
    });
    (0, vitest_1.it)('filters current net worth metrics by ownership from the header selector', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { ownerships: [
                                {
                                    id: 7,
                                    kind: 'shared',
                                    member: null,
                                    splits: [
                                        { member: { id: 3, name: 'Ana', role: 'adult' }, percent: '60' },
                                        { member: { id: 4, name: 'Lucas', role: 'adult' }, percent: '40' },
                                    ],
                                    notes: '',
                                },
                            ], assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta Ana',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                    ownership_ref: 7,
                                },
                                {
                                    id: 12,
                                    name: 'Cuenta comun',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    amount: '200',
                                    amount_base: '200',
                                    currency: 'EUR',
                                    is_active: true,
                                    ownership_ref: null,
                                },
                            ], liabilities: [
                                {
                                    id: 21,
                                    name: 'Tarjeta Ana',
                                    category: 'credit_card',
                                    amount: '500',
                                    amount_base: '500',
                                    currency: 'EUR',
                                    is_active: true,
                                    ownership_ref: 7,
                                },
                            ] }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="ownership-filter-option-3"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('300,00 €');
                    (0, vitest_1.expect)(wrapper.text()).toContain('600,00 €');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Ana');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('uses the current summary totals in the general timeline highlight instead of the projected month-end row', function () {
        var state = makeState({
            summaryAssets: (0, vue_1.ref)('1000'),
            summaryLiabilities: (0, vue_1.ref)('250'),
            summaryNetWorth: (0, vue_1.ref)('750'),
            store: __assign(__assign({}, makeState().store), { timeline: {
                    base_currency: 'EUR',
                    rows: [
                        {
                            date: '2026-03-31',
                            net_worth: '900',
                            total_assets: '1150',
                            total_liabilities: '250',
                        },
                    ],
                } }),
        });
        mockUseNetWorthViewState.mockReturnValue(state);
        mockUseNetWorthViewExtensions.mockReturnValue({
            HeaderActions: null,
            itemFormProps: {},
            itemListProps: {},
        });
        var wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
        (0, vitest_1.expect)(wrapper.text()).toContain('Expandir');
        (0, vitest_1.expect)(wrapper.text()).toContain('marzo de 2026 - marzo de 2026');
        (0, vitest_1.expect)(wrapper.text()).not.toContain('Ultimo patrimonio neto');
    });
    (0, vitest_1.it)('wires header actions and snapshot deletion callback', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { snapshots: [
                                {
                                    id: 5,
                                    snapshot_date: '2026-01-01',
                                    net_worth: '750',
                                    total_assets: '1000',
                                    total_liabilities: '250',
                                    base_currency: 'EUR',
                                },
                            ] }),
                        confirmDeleteSnapshot: vitest_1.vi.fn(),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default, {
                        global: {
                            mocks: {
                                $router: { push: mockPush },
                            },
                        },
                    });
                    return [4 /*yield*/, wrapper.get('button[aria-label="Refrescar"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('button[aria-label="Guardar snapshot"]').trigger('click')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('button[aria-label="Eliminar snapshot"]').trigger('click')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(state.store.refreshAll).toHaveBeenCalled();
                    (0, vitest_1.expect)(state.store.createTodaySnapshot).toHaveBeenCalled();
                    (0, vitest_1.expect)(state.confirmDeleteSnapshot).toHaveBeenCalledWith(5);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('requests timeline when selecting an asset category from composition', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { positionTimeline: {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            }, assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta nomina',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], timeline: {
                                base_currency: 'EUR',
                                rows: [
                                    {
                                        date: '2026-03-31',
                                        net_worth: '750',
                                        total_assets: '1000',
                                        total_liabilities: '250',
                                    },
                                ],
                            }, fetchTimeline: vitest_1.vi.fn() }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(state.store.fetchTimeline).toHaveBeenCalledWith('cash', 'asset');
                    (0, vitest_1.expect)(wrapper.find('select.ui-nw-position-select-input').exists()).toBe(true);
                    (0, vitest_1.expect)(wrapper.text()).toContain('Liquidez dentro de activos');
                    (0, vitest_1.expect)(wrapper.text()).toContain('1 posiciones');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('opens the asset modal from composition actions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        showAssetModal: (0, vue_1.ref)(false),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-add-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(state.showAssetModal.value).toBe(true);
                    (0, vitest_1.expect)(wrapper.find('[data-test="ItemForm"]').exists()).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('returns to the general timeline when clicking the active composition category again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { positionTimeline: {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            }, assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta nomina',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], fetchTimeline: vitest_1.vi.fn() }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(state.store.fetchTimeline).toHaveBeenNthCalledWith(1, 'cash', 'asset');
                    (0, vitest_1.expect)(state.store.fetchTimeline).toHaveBeenNthCalledWith(2, null, 'asset');
                    (0, vitest_1.expect)(wrapper.find('select.ui-nw-position-select-input').exists()).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('requests liability timeline when selecting a liability category from composition', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { liabilities: [
                                {
                                    id: 21,
                                    name: 'Hipoteca casa',
                                    category: 'mortgage',
                                    amount: '250',
                                    amount_base: '250',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], timeline: {
                                base_currency: 'EUR',
                                rows: [
                                    {
                                        date: '2026-02-28',
                                        net_worth: '750',
                                        total_assets: '1000',
                                        total_liabilities: '250',
                                    },
                                ],
                            }, fetchTimeline: vitest_1.vi.fn() }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-liability"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(state.store.fetchTimeline).toHaveBeenCalledWith('mortgage', 'liability');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('fetches per-position timeline when selecting an asset from the integrated selector', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta nomina',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    tracking_mode: 'accounting',
                                    accounting_account_id: 81,
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], liabilities: [], fetchPositionTimeline: vitest_1.vi.fn(), fetchPositionActivity: vitest_1.vi.fn() }),
                    });
                    state.store.fetchPositionTimeline = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            state.store.positionTimeline = {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            };
                            return [2 /*return*/];
                        });
                    }); });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('select.ui-nw-position-select-input').setValue('11')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(state.store.fetchPositionTimeline).toHaveBeenCalledWith('asset', 11);
                    (0, vitest_1.expect)(state.store.fetchPositionActivity).toHaveBeenCalledWith('asset', 11, 'cash');
                    (0, vitest_1.expect)(mockCoreAccountingApi.getTransactions).toHaveBeenCalledWith({ year: 2026 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows accounting activity for positions tracked through accounting', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockCoreAccountingApi.getTransactions.mockResolvedValue({
                        data: [
                            {
                                id: 91,
                                booking_date: '2026-03-14',
                                value_date: '2026-03-14',
                                description: 'Transferencia a broker',
                                status: 'posted',
                                origin: 'manual',
                                notes: 'Aportacion mensual',
                                created_at: '',
                                updated_at: '',
                                entries: [
                                    {
                                        id: 501,
                                        account_id: 81,
                                        account_name: 'Broker',
                                        side: 'debit',
                                        amount: '250.00',
                                        currency: 'EUR',
                                        annual_income_entry_id: null,
                                        annual_expense_entry_id: null,
                                        asset_id: null,
                                        liability_id: null,
                                        notes: '',
                                        created_at: '',
                                        updated_at: '',
                                    },
                                    {
                                        id: 502,
                                        account_id: 12,
                                        account_name: 'Cuenta corriente',
                                        side: 'credit',
                                        amount: '250.00',
                                        currency: 'EUR',
                                        annual_income_entry_id: null,
                                        annual_expense_entry_id: null,
                                        asset_id: null,
                                        liability_id: null,
                                        notes: '',
                                        created_at: '',
                                        updated_at: '',
                                    },
                                ],
                            },
                        ],
                    });
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { assets: [
                                {
                                    id: 11,
                                    name: 'Broker Indexado',
                                    category: 'cash',
                                    subcategory: 'broker',
                                    tracking_mode: 'accounting',
                                    accounting_account_id: 81,
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], fetchPositionTimeline: vitest_1.vi.fn(), fetchPositionActivity: vitest_1.vi.fn() }),
                    });
                    state.store.fetchPositionTimeline = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            state.store.positionTimeline = {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            };
                            return [2 /*return*/];
                        });
                    }); });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('select.ui-nw-position-select-input').setValue('11')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Actividad contable');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Transferencia a broker');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Contrapartida: Cuenta corriente');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the setup gap when an accounting-tracked position has no linked account', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta puente',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    tracking_mode: 'accounting',
                                    accounting_account_id: null,
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], fetchPositionTimeline: vitest_1.vi.fn(), fetchPositionActivity: vitest_1.vi.fn() }),
                    });
                    state.store.fetchPositionTimeline = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            state.store.positionTimeline = {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            };
                            return [2 /*return*/];
                        });
                    }); });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('select.ui-nw-position-select-input').setValue('11')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Actividad contable');
                    (0, vitest_1.expect)(wrapper.text()).toContain('aun no tiene una cuenta enlazada');
                    (0, vitest_1.expect)(mockCoreAccountingApi.getTransactions).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows needs_review state and keeps fallback when accounting integration is unsafe', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta dudosa',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    tracking_mode: 'accounting',
                                    accounting_account_id: 91,
                                    accounting_integration_state: 'needs_review',
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], fetchPositionTimeline: vitest_1.vi.fn(), fetchPositionActivity: vitest_1.vi.fn() }),
                    });
                    state.store.fetchPositionTimeline = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            state.store.positionTimeline = {
                                base_currency: 'EUR',
                                position_type: 'asset',
                                position_id: 11,
                                rows: [{ date: '2026-03-31', value: '1000', value_base: '1000' }],
                            };
                            return [2 /*return*/];
                        });
                    }); });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('select.ui-nw-position-select-input').setValue('11')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('needs_review');
                    (0, vitest_1.expect)(mockCoreAccountingApi.getTransactions).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('removes the redundant selected summary and exposes edit/delete actions in the category workspace', function () { return __awaiter(void 0, void 0, void 0, function () {
        var confirmSpy, state, wrapper, buttons;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmSpy = vitest_1.vi.spyOn(window, 'confirm').mockReturnValue(true);
                    state = makeState({
                        openEdit: vitest_1.vi.fn(),
                        store: __assign(__assign({}, makeState().store), { assets: [
                                {
                                    id: 11,
                                    name: 'Cuenta nomina',
                                    category: 'cash',
                                    subcategory: 'bank_account',
                                    amount: '1000',
                                    amount_base: '1000',
                                    currency: 'EUR',
                                    is_active: true,
                                },
                            ], deleteAsset: vitest_1.vi.fn(), fetchPositionTimeline: vitest_1.vi.fn(), fetchPositionActivity: vitest_1.vi.fn() }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('[data-test="donut-select-asset"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).not.toContain('Activo seleccionado');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Activo concreto');
                    (0, vitest_1.expect)(wrapper.text()).toContain('1 posiciones - 1.000,00 €');
                    (0, vitest_1.expect)(wrapper.get('button[aria-label="Nuevo activo"]').text()).toContain('+');
                    buttons = wrapper.findAll('.ui-nw-category-item-actions button');
                    (0, vitest_1.expect)(buttons).toHaveLength(2);
                    return [4 /*yield*/, buttons[0].trigger('click')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(state.openEdit).toHaveBeenCalled();
                    return [4 /*yield*/, buttons[1].trigger('click')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(confirmSpy).toHaveBeenCalled();
                    (0, vitest_1.expect)(state.store.deleteAsset).toHaveBeenCalledWith(11);
                    confirmSpy.mockRestore();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('renders euro amounts with the symbol in visible net worth sections', function () {
        var state = makeState({
            store: __assign(__assign({}, makeState().store), { snapshots: [
                    {
                        id: 5,
                        snapshot_date: '2026-01-01',
                        net_worth: '750',
                        total_assets: '1000',
                        total_liabilities: '250',
                        base_currency: 'EUR',
                    },
                ] }),
        });
        mockUseNetWorthViewState.mockReturnValue(state);
        mockUseNetWorthViewExtensions.mockReturnValue({
            HeaderActions: null,
            itemFormProps: {},
            itemListProps: {},
        });
        var wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
        (0, vitest_1.expect)(wrapper.text()).toContain('750,00 €');
        (0, vitest_1.expect)(wrapper.text()).toContain('1.000,00 €');
        (0, vitest_1.expect)(wrapper.text()).not.toContain('750,00 EUR');
    });
    (0, vitest_1.it)('opens the expanded timeline modal and updates the visible range', function () { return __awaiter(void 0, void 0, void 0, function () {
        var state, wrapper, sliders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = makeState({
                        store: __assign(__assign({}, makeState().store), { timeline: {
                                base_currency: 'EUR',
                                rows: [
                                    { date: '2025-11-30', net_worth: '500', total_assets: '700', total_liabilities: '200' },
                                    { date: '2025-12-31', net_worth: '520', total_assets: '720', total_liabilities: '200' },
                                    { date: '2026-01-31', net_worth: '540', total_assets: '750', total_liabilities: '210' },
                                    { date: '2026-02-28', net_worth: '560', total_assets: '780', total_liabilities: '220' },
                                    { date: '2026-03-31', net_worth: '600', total_assets: '830', total_liabilities: '230' },
                                ],
                            } }),
                    });
                    mockUseNetWorthViewState.mockReturnValue(state);
                    mockUseNetWorthViewExtensions.mockReturnValue({
                        HeaderActions: null,
                        itemFormProps: {},
                        itemListProps: {},
                    });
                    wrapper = (0, test_utils_1.mount)(NetWorthView_vue_1.default);
                    return [4 /*yield*/, wrapper.get('button.ui-nw-timeline-range-button').trigger('click')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, wrapper.get('button.ui-nw-timeline-expand-button').trigger('click')];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Inicio');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Fin');
                    sliders = wrapper.findAll('input.ui-nw-timeline-slider');
                    return [4 /*yield*/, sliders[0].setValue('2')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('enero de 2026 - marzo de 2026');
                    return [2 /*return*/];
            }
        });
    }); });
});
