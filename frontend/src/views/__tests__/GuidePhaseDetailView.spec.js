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
var GuidePhaseDetailView_vue_1 = require("../GuidePhaseDetailView.vue");
var mockRoute = { params: { phaseId: '2' } };
var mockNetWorthStore = {
    loading: false,
    error: null,
    summary: {
        base_currency: 'EUR',
        total_assets: '50000',
        total_liabilities: '10000',
        net_worth: '40000',
        liabilities_unbacked: '10000',
        assets_by_category: { cash: '50000' },
        assets_by_subcategory: {},
        liabilities_by_category: { mortgage: '10000' },
    },
    assets: [],
    liabilities: [],
    byCategoryChart: { keys: [], assets: [], liabilities: [] },
    fetchSettings: vitest_1.vi.fn(),
    refreshAll: vitest_1.vi.fn(),
};
var mockAnnualIncomeEntries = (0, vue_1.ref)([]);
var mockAnnualExpenseEntries = (0, vue_1.ref)([]);
var mockAnnualIncomeLoadAll = vitest_1.vi.fn();
var mockAnnualExpenseLoadAll = vitest_1.vi.fn();
vitest_1.vi.mock('vue-router', function () { return ({
    useRoute: function () { return mockRoute; },
    RouterLink: (0, vue_1.defineComponent)({
        name: 'RouterLink',
        props: { to: { type: [String, Object], required: false, default: '' } },
        template: '<a><slot /></a>',
    }),
}); });
vitest_1.vi.mock('@/domains/net-worth', function () { return ({
    useNetWorthStore: function () { return mockNetWorthStore; },
}); });
vitest_1.vi.mock('@/domains/data-input', function () { return ({
    useAnnualIncomeStore: function () { return ({
        entries: mockAnnualIncomeEntries,
        loadAll: mockAnnualIncomeLoadAll,
    }); },
    useAnnualExpenseStore: function () { return ({
        entries: mockAnnualExpenseEntries,
        loadAll: mockAnnualExpenseLoadAll,
    }); },
}); });
(0, vitest_1.describe)('GuidePhaseDetailView (fase 2)', function () {
    (0, vitest_1.beforeEach)(function () {
        mockRoute.params.phaseId = '2';
        mockNetWorthStore.loading = false;
        mockNetWorthStore.error = null;
        mockNetWorthStore.fetchSettings.mockReset();
        mockNetWorthStore.refreshAll.mockReset();
        mockAnnualIncomeLoadAll.mockReset();
        mockAnnualExpenseLoadAll.mockReset();
        mockNetWorthStore.liabilities = [
            {
                id: 1,
                is_active: true,
                amount_base: '10000',
                annual_interest_tae: '3.5',
                monthly_payment_amount: '200',
            },
        ];
        mockAnnualIncomeEntries.value = [
            { incomeType: 'recurrent', amountAnnual: 30000 },
            { incomeType: 'one_off', amountAnnual: 5000 },
        ];
        mockAnnualExpenseEntries.value = [
            { category: 'consumption_expenses', expenseType: 'recurrent', amountAnnual: 17100 },
            { category: 'savings_allocation', expenseType: 'recurrent', amountAnnual: 3000 },
            { category: 'financial_investments', expenseType: 'recurrent', amountAnnual: 6000 },
            { category: 'tangible_assets', expenseType: 'recurrent', amountAnnual: 300 },
            { category: 'real_estate_assets', expenseType: 'recurrent', amountAnnual: 1200 },
            { category: 'consumption_expenses', expenseType: 'one_off', amountAnnual: 20000 },
        ];
    });
    (0, vitest_1.it)('renders phase 2 summary, operational score and savings distribution info', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(GuidePhaseDetailView_vue_1.default);
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Tension de caja');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Ingresos recurrentes anuales');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Flujo anual total');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Distribucion del ahorro');
                    (0, vitest_1.expect)(wrapper.text()).toContain('% inversiones / ingresos recurrentes');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Colchon mensual tras cargas temporales');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Ano con eventos extraordinarios');
                    (0, vitest_1.expect)(mockNetWorthStore.fetchSettings).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockNetWorthStore.refreshAll).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockAnnualIncomeLoadAll).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockAnnualExpenseLoadAll).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('omits warning and monthly capacity detail when recurrent income is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockAnnualIncomeEntries.value = [];
                    mockAnnualExpenseEntries.value = [
                        { category: 'consumption_expenses', expenseType: 'recurrent', amountAnnual: 500 },
                    ];
                    wrapper = (0, test_utils_1.mount)(GuidePhaseDetailView_vue_1.default);
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Tension de caja');
                    (0, vitest_1.expect)(wrapper.text()).not.toContain('Capacidad de asignacion recurrente mensual');
                    (0, vitest_1.expect)(wrapper.text()).not.toContain('Ano con eventos extraordinarios');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('GuidePhaseDetailView (fase 3)', function () {
    (0, vitest_1.beforeEach)(function () {
        mockRoute.params.phaseId = '3';
        mockNetWorthStore.loading = false;
        mockNetWorthStore.error = null;
        mockNetWorthStore.fetchSettings.mockReset();
        mockNetWorthStore.refreshAll.mockReset();
        mockAnnualIncomeLoadAll.mockReset();
        mockAnnualExpenseLoadAll.mockReset();
        mockNetWorthStore.assets = [
            {
                id: 1,
                is_active: true,
                category: 'cash',
                subcategory: 'bank_account',
                amount_base: '6000',
            },
            { id: 2, is_active: true, category: 'investments', subcategory: 'etfs', amount_base: '4000' },
            {
                id: 3,
                is_active: true,
                category: 'real_estate',
                subcategory: 'primary_home',
                amount_base: '90000',
            },
        ];
        mockNetWorthStore.liabilities = [];
        mockNetWorthStore.summary = __assign(__assign({}, mockNetWorthStore.summary), { total_assets: '100000', total_liabilities: '0', net_worth: '100000', liabilities_unbacked: '0', assets_by_category: { cash: '6000', investments: '4000', real_estate: '90000' }, liabilities_by_category: {} });
        mockAnnualIncomeEntries.value = [];
        mockAnnualExpenseEntries.value = [
            {
                category: 'consumption_expenses',
                expenseType: 'recurrent',
                timeProfile: 'structural_recurrent',
                cashflowRole: 'operating',
                amountAnnual: 12000,
            },
            {
                category: 'consumption_expenses',
                expenseType: 'recurrent',
                timeProfile: 'term_recurrent',
                cashflowRole: 'temporary_commitment',
                amountAnnual: 2400,
            },
        ];
    });
    (0, vitest_1.it)('renders phase 3 emergency-fund diagnostics and loads expense context', function () { return __awaiter(void 0, void 0, void 0, function () {
        var wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapper = (0, test_utils_1.mount)(GuidePhaseDetailView_vue_1.default);
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(wrapper.text()).toContain('Fase 3');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Fondo de emergencia');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Cobertura del colchon');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Calidad de liquidez');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Meses de gasto base cubiertos');
                    (0, vitest_1.expect)(wrapper.text()).toContain('Liquidez util para emergencia');
                    (0, vitest_1.expect)(mockNetWorthStore.fetchSettings).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockNetWorthStore.refreshAll).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockAnnualExpenseLoadAll).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(mockAnnualIncomeLoadAll).toHaveBeenCalledTimes(0);
                    return [2 /*return*/];
            }
        });
    }); });
});
