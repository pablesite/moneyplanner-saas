"use strict";
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
var pinia_1 = require("pinia");
var store_1 = require("../store");
var api_1 = require("../api");
vitest_1.vi.mock('../api', function () { return ({
    coreAccountingApi: {
        getAccounts: vitest_1.vi.fn(),
        getTransactions: vitest_1.vi.fn(),
        getMonthlySummary: vitest_1.vi.fn(),
        getAccountBalances: vitest_1.vi.fn(),
        createAccount: vitest_1.vi.fn(),
        createTransaction: vitest_1.vi.fn(),
        createQuickEntry: vitest_1.vi.fn(),
        previewMoneyWizImport: vitest_1.vi.fn(),
        commitMoneyWizImport: vitest_1.vi.fn(),
    },
}); });
(0, vitest_1.describe)('useAccountingStore', function () {
    (0, vitest_1.beforeEach)(function () {
        (0, pinia_1.setActivePinia)((0, pinia_1.createPinia)());
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('refreshes accounts, transactions and monthly summary together', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccounts).mockResolvedValue({
                        data: [{ id: 1, name: 'Banco', is_active: true }],
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getTransactions).mockResolvedValue({
                        data: [{ id: 2, description: 'Nomina' }],
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getMonthlySummary).mockResolvedValue({
                        data: { fiscal_year: 2026, months: [] },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccountBalances).mockResolvedValue({
                        data: {
                            filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
                            totals_by_account_type: { asset: '2100.00' },
                            accounts: [],
                        },
                    });
                    store = (0, store_1.useAccountingStore)();
                    store.selectedYear = 2026;
                    store.selectedMonth = 3;
                    return [4 /*yield*/, store.refreshAll()];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(api_1.coreAccountingApi.getTransactions).toHaveBeenCalledWith({ year: 2026, month: 3 });
                    (0, vitest_1.expect)(api_1.coreAccountingApi.getAccountBalances).toHaveBeenCalledWith({
                        year: 2026,
                        month: 3,
                        account_type: 'asset',
                        status: 'posted',
                    });
                    (0, vitest_1.expect)(store.accounts).toHaveLength(1);
                    (0, vitest_1.expect)(store.transactions).toHaveLength(1);
                    (0, vitest_1.expect)((_a = store.monthlySummary) === null || _a === void 0 ? void 0 : _a.fiscal_year).toBe(2026);
                    (0, vitest_1.expect)((_b = store.accountBalancesSummary) === null || _b === void 0 ? void 0 : _b.totals_by_account_type.asset).toBe('2100.00');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('creates a transaction and reloads data', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    vitest_1.vi.mocked(api_1.coreAccountingApi.createTransaction).mockResolvedValue({ data: {} });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccounts).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getTransactions).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getMonthlySummary).mockResolvedValue({
                        data: { fiscal_year: 2026, months: [] },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccountBalances).mockResolvedValue({
                        data: {
                            filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
                            totals_by_account_type: { asset: '0.00' },
                            accounts: [],
                        },
                    });
                    store = (0, store_1.useAccountingStore)();
                    return [4 /*yield*/, store.createTransaction({
                            booking_date: '2026-03-15',
                            value_date: '2026-03-15',
                            description: 'Nomina marzo',
                            entries: [
                                { account_id: 1, side: 'debit', amount: '100.00' },
                                { account_id: 2, side: 'credit', amount: '100.00' },
                            ],
                        })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(api_1.coreAccountingApi.createTransaction).toHaveBeenCalled();
                    (0, vitest_1.expect)(api_1.coreAccountingApi.getTransactions).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('creates a quick entry and reloads balances', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    vitest_1.vi.mocked(api_1.coreAccountingApi.createQuickEntry).mockResolvedValue({ data: {} });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccounts).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getTransactions).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getMonthlySummary).mockResolvedValue({
                        data: { fiscal_year: 2026, months: [] },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccountBalances).mockResolvedValue({
                        data: {
                            filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
                            totals_by_account_type: { asset: '500.00' },
                            accounts: [{ account_id: 1, name: 'Banco', period_net_change: '500.00' }],
                        },
                    });
                    store = (0, store_1.useAccountingStore)();
                    return [4 /*yield*/, store.createQuickEntry({
                            movement_type: 'income',
                            booking_date: '2026-03-15',
                            value_date: '2026-03-15',
                            description: 'Nomina marzo',
                            amount: '500.00',
                            account_id: 1,
                        })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(api_1.coreAccountingApi.createQuickEntry).toHaveBeenCalled();
                    (0, vitest_1.expect)(api_1.coreAccountingApi.getAccountBalances).toHaveBeenCalled();
                    (0, vitest_1.expect)((_a = store.accountBalancesSummary) === null || _a === void 0 ? void 0 : _a.totals_by_account_type.asset).toBe('500.00');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stores MoneyWiz preview and commit results', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, file;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    vitest_1.vi.mocked(api_1.coreAccountingApi.previewMoneyWizImport).mockResolvedValue({
                        data: {
                            delimiter: ';',
                            row_count: 2,
                            valid_row_count: 2,
                            error_row_count: 0,
                            duplicate_row_count: 0,
                            existing_row_count: 0,
                            warnings: [],
                            stats: {
                                income: 1,
                                expense: 1,
                                transfer: 0,
                                investment_purchase: 0,
                                debt_payment: 0,
                            },
                            detected_accounts: [],
                            rows: [],
                        },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.commitMoneyWizImport).mockResolvedValue({
                        data: {
                            source: 'moneywiz',
                            row_count: 2,
                            created_count: 2,
                            skipped_existing_count: 0,
                            warning_count: 0,
                            rows: [],
                            preview: {
                                delimiter: ';',
                                row_count: 2,
                                valid_row_count: 2,
                                error_row_count: 0,
                                duplicate_row_count: 0,
                                existing_row_count: 0,
                                warnings: [],
                                stats: {
                                    income: 1,
                                    expense: 1,
                                    transfer: 0,
                                    investment_purchase: 0,
                                    debt_payment: 0,
                                },
                                detected_accounts: [],
                                rows: [],
                            },
                            created_transaction_ids: [1, 2],
                        },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccounts).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getTransactions).mockResolvedValue({ data: [] });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getMonthlySummary).mockResolvedValue({
                        data: { fiscal_year: 2026, months: [] },
                    });
                    vitest_1.vi.mocked(api_1.coreAccountingApi.getAccountBalances).mockResolvedValue({
                        data: {
                            filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
                            totals_by_account_type: { asset: '0.00' },
                            accounts: [],
                        },
                    });
                    store = (0, store_1.useAccountingStore)();
                    file = new File(['csv'], 'moneywiz.csv', { type: 'text/csv' });
                    return [4 /*yield*/, store.previewMoneyWizImport(file)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, store.commitMoneyWizImport(file)];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)((_a = store.moneyWizImportPreview) === null || _a === void 0 ? void 0 : _a.row_count).toBe(2);
                    (0, vitest_1.expect)((_b = store.moneyWizImportCommitResult) === null || _b === void 0 ? void 0 : _b.created_count).toBe(2);
                    (0, vitest_1.expect)(api_1.coreAccountingApi.commitMoneyWizImport).toHaveBeenCalledWith(file);
                    return [2 /*return*/];
            }
        });
    }); });
});
