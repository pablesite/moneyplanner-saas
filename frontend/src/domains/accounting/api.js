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
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreAccountingApi = void 0;
var api_1 = require("@/lib/api");
exports.coreAccountingApi = {
    getAccounts: function (params) {
        return api_1.coreApi.get('/api/accounting/accounts/', {
            params: params && (params.account_type || typeof params.is_active === 'boolean')
                ? __assign(__assign({}, (params.account_type ? { account_type: params.account_type } : {})), (typeof params.is_active === 'boolean'
                    ? { is_active: String(params.is_active) }
                    : {})) : undefined,
        });
    },
    createAccount: function (payload) {
        return api_1.coreApi.post('/api/accounting/accounts/', payload);
    },
    deleteAccount: function (id) {
        return api_1.coreApi.delete("/api/accounting/accounts/".concat(id, "/"));
    },
    updateAccount: function (id, payload) {
        return api_1.coreApi.patch("/api/accounting/accounts/".concat(id, "/"), payload);
    },
    getTransactions: function (params) {
        return api_1.coreApi.get('/api/accounting/transactions/', {
            params: params && (params.year || params.month || params.status)
                ? __assign(__assign(__assign({}, (params.year ? { year: params.year } : {})), (params.month ? { month: params.month } : {})), (params.status ? { status: params.status } : {})) : undefined,
        });
    },
    createTransaction: function (payload) {
        return api_1.coreApi.post('/api/accounting/transactions/', payload);
    },
    updateTransaction: function (id, payload) {
        return api_1.coreApi.patch("/api/accounting/transactions/".concat(id, "/"), payload);
    },
    deleteTransaction: function (id) {
        return api_1.coreApi.delete("/api/accounting/transactions/".concat(id, "/"));
    },
    createQuickEntry: function (payload) {
        return api_1.coreApi.post('/api/accounting/transactions/quick-entry/', payload);
    },
    previewMoneyWizImport: function (file) {
        var formData = new FormData();
        formData.append('file', file);
        return api_1.coreApi.post('/api/accounting/transactions/import-moneywiz/preview/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    commitMoneyWizImport: function (file) {
        var formData = new FormData();
        formData.append('file', file);
        return api_1.coreApi.post('/api/accounting/transactions/import-moneywiz/commit/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getEntries: function (params) {
        return api_1.coreApi.get('/api/accounting/entries/', {
            params: params && (params.account_id || params.transaction_id || params.year || params.month)
                ? __assign(__assign(__assign(__assign({}, (params.account_id ? { account_id: params.account_id } : {})), (params.transaction_id ? { transaction_id: params.transaction_id } : {})), (params.year ? { year: params.year } : {})), (params.month ? { month: params.month } : {})) : undefined,
        });
    },
    getMonthlySummary: function (year) {
        return api_1.coreApi.get('/api/accounting/transactions/monthly-summary/', {
            params: { year: year },
        });
    },
    getBudgetSuggestions: function (year, lookbackYears) {
        if (lookbackYears === void 0) { lookbackYears = 2; }
        return api_1.coreApi.get('/api/accounting/transactions/budget-suggestions/', {
            params: { year: year, lookback_years: lookbackYears },
        });
    },
    getAccountBalances: function (params) {
        return api_1.coreApi.get('/api/accounting/accounts/balances/', {
            params: params && (params.year || params.month || params.account_type || params.status)
                ? __assign(__assign(__assign(__assign({}, (params.year ? { year: params.year } : {})), (params.month ? { month: params.month } : {})), (params.account_type ? { account_type: params.account_type } : {})), (params.status ? { status: params.status } : {})) : undefined,
        });
    },
};
