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
exports.useAnnualIncomeStore = useAnnualIncomeStore;
var vue_1 = require("vue");
var api_1 = require("@/lib/api");
var errors_1 = require("@/lib/errors");
var incomeTaxonomy_1 = require("@/domains/data-input/incomeTaxonomy");
var annualEntryUtils_1 = require("@/domains/data-input/annualEntryUtils");
function mapApiItem(item) {
    var _a, _b, _c;
    var timeProfile = (_a = item.time_profile) !== null && _a !== void 0 ? _a : (item.income_type === 'one_off' ? 'one_off' : 'structural_recurrent');
    return {
        id: item.id,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        owner: item.owner_name || '',
        incomeType: item.income_type,
        timeProfile: timeProfile,
        cashflowRole: (_b = item.cashflow_role) !== null && _b !== void 0 ? _b : 'operating',
        eventGroup: (_c = item.event_group) !== null && _c !== void 0 ? _c : '',
        targetMonth: item.target_month == null ? null : Number(item.target_month),
        termEndMonth: item.term_end_month == null ? null : Number(item.term_end_month),
        termEndYear: item.term_end_year == null ? null : Number(item.term_end_year),
        amountInputPeriod: item.amount_input_period === 'monthly' ? 'monthly' : 'annual',
        amountAnnual: Number(item.amount_annual),
        fiscalYear: Number(item.fiscal_year),
        currency: item.currency,
        notes: item.notes || '',
        isActive: item.is_active !== false,
        createdAt: item.created_at,
    };
}
function useAnnualIncomeStore(_scope) {
    if (_scope === void 0) { _scope = 'saas'; }
    var entries = (0, vue_1.ref)([]);
    var totalAnnual = (0, vue_1.ref)(0);
    var loading = (0, vue_1.ref)(false);
    var error = (0, vue_1.ref)(null);
    function loadAll(year) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, listRes, totalsRes, e_1;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([
                                api_1.api.get('/api/budget/annual-income/', {
                                    params: year ? { year: year } : undefined,
                                }),
                                api_1.api.get('/api/budget/annual-income/totals/', {
                                    params: year ? { year: year } : undefined,
                                }),
                            ])];
                    case 2:
                        _a = _e.sent(), listRes = _a[0], totalsRes = _a[1];
                        entries.value = ((_b = listRes.data) !== null && _b !== void 0 ? _b : []).map(mapApiItem);
                        totalAnnual.value = Number((_d = (_c = totalsRes.data) === null || _c === void 0 ? void 0 : _c.total_annual) !== null && _d !== void 0 ? _d : '0');
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _e.sent();
                        error.value = (0, errors_1.toApiErrorMessage)(e_1);
                        return [3 /*break*/, 5];
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function addEntry(draft, year) {
        return __awaiter(this, void 0, void 0, function () {
            var name, validSubcategory, amount, e_2, message;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        name = draft.name.trim();
                        if (!name)
                            return [2 /*return*/, { ok: false, error: 'El nombre es obligatorio.' }];
                        validSubcategory = incomeTaxonomy_1.incomeSubcategories.some(function (row) { return row.category === draft.category && row.value === draft.subcategory; });
                        if (!validSubcategory) {
                            return [2 /*return*/, { ok: false, error: 'La subcategoria no corresponde con la categoria elegida.' }];
                        }
                        amount = (0, annualEntryUtils_1.parseAnnualAmount)(draft.amountAnnual);
                        if (amount <= 0)
                            return [2 /*return*/, { ok: false, error: 'El importe anual debe ser mayor que cero.' }];
                        loading.value = true;
                        error.value = null;
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, api_1.api.post('/api/budget/annual-income/', {
                                name: name,
                                category: draft.category,
                                subcategory: draft.subcategory,
                                owner_name: (0, annualEntryUtils_1.normalizeOwnerName)((_a = draft.owner) !== null && _a !== void 0 ? _a : ''),
                                income_type: draft.incomeType,
                                time_profile: (_b = draft.timeProfile) !== null && _b !== void 0 ? _b : (draft.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent'),
                                cashflow_role: (_c = draft.cashflowRole) !== null && _c !== void 0 ? _c : 'operating',
                                event_group: ((_d = draft.eventGroup) !== null && _d !== void 0 ? _d : '').trim(),
                                target_month: (_e = draft.targetMonth) !== null && _e !== void 0 ? _e : null,
                                term_end_month: (_f = draft.termEndMonth) !== null && _f !== void 0 ? _f : null,
                                term_end_year: (_g = draft.termEndYear) !== null && _g !== void 0 ? _g : null,
                                amount_input_period: draft.amountInputPeriod === 'monthly' ? 'monthly' : 'annual',
                                amount_annual: amount.toFixed(2),
                                fiscal_year: draft.fiscalYear,
                                currency: (draft.currency || 'EUR').toUpperCase(),
                                notes: draft.notes.trim(),
                                is_active: true,
                            })];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, loadAll(year !== null && year !== void 0 ? year : draft.fiscalYear)];
                    case 3:
                        _h.sent();
                        return [2 /*return*/, { ok: true }];
                    case 4:
                        e_2 = _h.sent();
                        message = (0, errors_1.toApiErrorMessage)(e_2);
                        error.value = message;
                        return [2 /*return*/, { ok: false, error: message }];
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function updateEntry(id, draft, year) {
        return __awaiter(this, void 0, void 0, function () {
            var name, validSubcategory, amount, e_3, message;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        name = draft.name.trim();
                        if (!name)
                            return [2 /*return*/, { ok: false, error: 'El nombre es obligatorio.' }];
                        validSubcategory = incomeTaxonomy_1.incomeSubcategories.some(function (row) { return row.category === draft.category && row.value === draft.subcategory; });
                        if (!validSubcategory) {
                            return [2 /*return*/, { ok: false, error: 'La subcategoria no corresponde con la categoria elegida.' }];
                        }
                        amount = (0, annualEntryUtils_1.parseAnnualAmount)(draft.amountAnnual);
                        if (amount <= 0)
                            return [2 /*return*/, { ok: false, error: 'El importe anual debe ser mayor que cero.' }];
                        loading.value = true;
                        error.value = null;
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, api_1.api.patch("/api/budget/annual-income/".concat(id, "/"), {
                                name: name,
                                category: draft.category,
                                subcategory: draft.subcategory,
                                owner_name: (0, annualEntryUtils_1.normalizeOwnerName)((_a = draft.owner) !== null && _a !== void 0 ? _a : ''),
                                income_type: draft.incomeType,
                                time_profile: (_b = draft.timeProfile) !== null && _b !== void 0 ? _b : (draft.incomeType === 'one_off' ? 'one_off' : 'structural_recurrent'),
                                cashflow_role: (_c = draft.cashflowRole) !== null && _c !== void 0 ? _c : 'operating',
                                event_group: ((_d = draft.eventGroup) !== null && _d !== void 0 ? _d : '').trim(),
                                target_month: (_e = draft.targetMonth) !== null && _e !== void 0 ? _e : null,
                                term_end_month: (_f = draft.termEndMonth) !== null && _f !== void 0 ? _f : null,
                                term_end_year: (_g = draft.termEndYear) !== null && _g !== void 0 ? _g : null,
                                amount_input_period: draft.amountInputPeriod === 'monthly' ? 'monthly' : 'annual',
                                amount_annual: amount.toFixed(2),
                                fiscal_year: draft.fiscalYear,
                                currency: (draft.currency || 'EUR').toUpperCase(),
                                notes: draft.notes.trim(),
                            })];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, loadAll(year !== null && year !== void 0 ? year : draft.fiscalYear)];
                    case 3:
                        _h.sent();
                        return [2 /*return*/, { ok: true }];
                    case 4:
                        e_3 = _h.sent();
                        message = (0, errors_1.toApiErrorMessage)(e_3);
                        error.value = message;
                        return [2 /*return*/, { ok: false, error: message }];
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function deleteEntry(id, year) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, api_1.api.delete("/api/budget/annual-income/".concat(id, "/"))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loadAll(year)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_4 = _a.sent();
                        error.value = (0, errors_1.toApiErrorMessage)(e_4);
                        return [3 /*break*/, 6];
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return {
        entries: entries,
        totalAnnual: totalAnnual,
        loading: loading,
        error: error,
        loadAll: loadAll,
        addEntry: addEntry,
        updateEntry: updateEntry,
        deleteEntry: deleteEntry,
    };
}
