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
exports.useNetWorthAccountingActivity = useNetWorthAccountingActivity;
var vue_1 = require("vue");
var accounting_1 = require("@/domains/accounting");
var errors_1 = require("@/lib/errors");
function summarizeCounterparts(transaction, selectedAccountId, selectedEntryId) {
    var counterparts = transaction.entries.filter(function (entry) { return entry.account_id !== selectedAccountId && entry.id !== selectedEntryId; });
    if (!counterparts.length)
        return 'Sin contrapartida visible';
    var names = Array.from(new Set(counterparts.map(function (entry) { return entry.account_name; }).filter(Boolean)));
    if (names.length <= 2)
        return names.join(' + ');
    return "".concat(names.slice(0, 2).join(' + '), " +").concat(names.length - 2);
}
function useNetWorthAccountingActivity(params) {
    var accountingActivityLoading = (0, vue_1.ref)(false);
    var accountingActivityError = (0, vue_1.ref)(null);
    var accountingActivityRows = (0, vue_1.ref)([]);
    var accountingActivityYear = (0, vue_1.ref)(new Date().getFullYear());
    var selectedPositionUsesAccounting = (0, vue_1.computed)(function () { var _a; return ((_a = params.selectedPositionSource.value) === null || _a === void 0 ? void 0 : _a.tracking_mode) === 'accounting'; });
    var selectedPositionAccountingIntegrationState = (0, vue_1.computed)(function () { var _a, _b; return (_b = (_a = params.selectedPositionSource.value) === null || _a === void 0 ? void 0 : _a.accounting_integration_state) !== null && _b !== void 0 ? _b : null; });
    var selectedPositionAccountingAccountId = (0, vue_1.computed)(function () { var _a, _b; return (_b = (_a = params.selectedPositionSource.value) === null || _a === void 0 ? void 0 : _a.accounting_account_id) !== null && _b !== void 0 ? _b : null; });
    var showAccountingActivitySetupGap = (0, vue_1.computed)(function () {
        return selectedPositionUsesAccounting.value &&
            selectedPositionAccountingIntegrationState.value !== 'needs_review' &&
            selectedPositionAccountingAccountId.value == null;
    });
    var showAccountingActivityNeedsReview = (0, vue_1.computed)(function () {
        return selectedPositionUsesAccounting.value &&
            selectedPositionAccountingIntegrationState.value === 'needs_review';
    });
    var showAccountingActivityBlock = (0, vue_1.computed)(function () { return selectedPositionUsesAccounting.value; });
    function resetAccountingActivity() {
        accountingActivityLoading.value = false;
        accountingActivityError.value = null;
        accountingActivityRows.value = [];
        accountingActivityYear.value = new Date().getFullYear();
    }
    function loadAccountingActivity(row) {
        return __awaiter(this, void 0, void 0, function () {
            var source, response, relevantRows, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        source = params.sourceItemForRow(row);
                        if (!source || source.tracking_mode !== 'accounting') {
                            resetAccountingActivity();
                            return [2 /*return*/];
                        }
                        accountingActivityYear.value = new Date().getFullYear();
                        if (source.accounting_integration_state === 'needs_review' || !source.accounting_account_id) {
                            accountingActivityError.value = null;
                            accountingActivityRows.value = [];
                            return [2 /*return*/];
                        }
                        accountingActivityLoading.value = true;
                        accountingActivityError.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, accounting_1.coreAccountingApi.getTransactions({
                                year: accountingActivityYear.value,
                            })];
                    case 2:
                        response = _a.sent();
                        relevantRows = response.data
                            .flatMap(function (transaction) {
                            return transaction.entries
                                .filter(function (entry) { return entry.account_id === source.accounting_account_id; })
                                .map(function (entry) {
                                var _a;
                                return ({
                                    id: "accounting-".concat(transaction.id, "-").concat(entry.id),
                                    date: transaction.booking_date,
                                    description: transaction.description,
                                    sideLabel: entry.side === 'debit' ? 'Debe' : 'Haber',
                                    amount: params.toNumber(entry.amount),
                                    currency: entry.currency,
                                    counterpartLabel: summarizeCounterparts(transaction, (_a = source.accounting_account_id) !== null && _a !== void 0 ? _a : 0, entry.id),
                                    note: entry.notes || transaction.notes || '',
                                });
                            });
                        })
                            .sort(function (a, b) { return b.date.localeCompare(a.date); })
                            .slice(0, 6);
                        accountingActivityRows.value = relevantRows;
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        accountingActivityError.value = (0, errors_1.toApiErrorMessage)(error_1);
                        accountingActivityRows.value = [];
                        return [3 /*break*/, 5];
                    case 4:
                        accountingActivityLoading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return {
        accountingActivityLoading: accountingActivityLoading,
        accountingActivityError: accountingActivityError,
        accountingActivityRows: accountingActivityRows,
        accountingActivityYear: accountingActivityYear,
        showAccountingActivitySetupGap: showAccountingActivitySetupGap,
        showAccountingActivityNeedsReview: showAccountingActivityNeedsReview,
        showAccountingActivityBlock: showAccountingActivityBlock,
        resetAccountingActivity: resetAccountingActivity,
        loadAccountingActivity: loadAccountingActivity,
    };
}
