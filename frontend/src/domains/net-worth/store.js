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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetWorthStore = void 0;
var pinia_1 = require("pinia");
var errors_1 = require("@/lib/errors");
var api_1 = require("@/domains/net-worth/api");
var charts_1 = require("@/domains/net-worth/charts");
var ownership_1 = require("@/domains/net-worth/ownership");
exports.useNetWorthStore = (0, pinia_1.defineStore)('netWorth', {
    state: function () { return ({
        loading: false,
        error: null,
        baseCurrency: null,
        inflationRegion: 'ES',
        summary: null,
        assets: [],
        liabilities: [],
        snapshots: [],
        timeline: null,
        timelineLoading: false,
        timelineCategoryFilter: null,
        timelineCategoryFilterType: 'asset',
        positionTimeline: null,
        positionTimelineLoading: false,
        positionActivityLoading: false,
        assetValuations: [],
        liabilityValuations: [],
        investmentEvents: [],
        liquidityEvents: [],
        liabilityEvents: [],
        ownerships: [],
    }); },
    getters: {
        byCategoryChart: function (state) {
            return (0, charts_1.buildByCategoryChart)(state.summary, state.baseCurrency);
        },
    },
    actions: {
        refreshAll: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, summaryRes, assetsRes, liabilitiesRes, snapshotsRes, _b, ownershipsRes, linksRes, links, _c, assetOwnership, liabilityOwnership, e_1;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _d.label = 1;
                        case 1:
                            _d.trys.push([1, 5, 6, 7]);
                            return [4 /*yield*/, Promise.all([
                                    api_1.coreNetWorthApi.getSummary(),
                                    api_1.coreNetWorthApi.getAssets(),
                                    api_1.coreNetWorthApi.getLiabilities(),
                                    api_1.coreNetWorthApi.getSnapshots(),
                                ])];
                        case 2:
                            _a = _d.sent(), summaryRes = _a[0], assetsRes = _a[1], liabilitiesRes = _a[2], snapshotsRes = _a[3];
                            return [4 /*yield*/, Promise.all([
                                    api_1.premiumOwnershipApi.getOwnerships(),
                                    api_1.premiumOwnershipApi.getOwnershipLinks(),
                                ])];
                        case 3:
                            _b = _d.sent(), ownershipsRes = _b[0], linksRes = _b[1];
                            links = linksRes.data;
                            _c = (0, ownership_1.buildOwnershipMaps)(links), assetOwnership = _c.assetOwnership, liabilityOwnership = _c.liabilityOwnership;
                            this.summary = summaryRes.data;
                            this.baseCurrency = summaryRes.data.base_currency;
                            this.assets = (0, ownership_1.attachOwnershipRef)(assetsRes.data, assetOwnership);
                            this.liabilities = (0, ownership_1.attachOwnershipRef)(liabilitiesRes.data, liabilityOwnership);
                            this.snapshots = snapshotsRes.data;
                            this.ownerships = ownershipsRes.data;
                            return [4 /*yield*/, this.fetchTimeline(this.timelineCategoryFilter, this.timelineCategoryFilterType)];
                        case 4:
                            _d.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            e_1 = _d.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_1);
                            return [3 /*break*/, 7];
                        case 6:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        fetchTimeline: function () {
            return __awaiter(this, arguments, void 0, function (category, categoryType) {
                var timelineRes, e_2;
                if (category === void 0) { category = null; }
                if (categoryType === void 0) { categoryType = 'asset'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.timelineLoading = true;
                            this.timelineCategoryFilter = category;
                            this.timelineCategoryFilterType = categoryType;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.getTimeline({
                                    asset_category: categoryType === 'asset' ? category : null,
                                    liability_category: categoryType === 'liability' ? category : null,
                                })];
                        case 2:
                            timelineRes = _a.sent();
                            this.timeline = timelineRes.data;
                            return [3 /*break*/, 5];
                        case 3:
                            e_2 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_2);
                            return [3 /*break*/, 5];
                        case 4:
                            this.timelineLoading = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        fetchPositionTimeline: function (positionType, id) {
            return __awaiter(this, void 0, void 0, function () {
                var timelineRes, _a, e_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.positionTimelineLoading = true;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            if (!(positionType === 'asset')) return [3 /*break*/, 3];
                            return [4 /*yield*/, api_1.coreNetWorthApi.getAssetTimeline(id)];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, api_1.coreNetWorthApi.getLiabilityTimeline(id)];
                        case 4:
                            _a = _b.sent();
                            _b.label = 5;
                        case 5:
                            timelineRes = _a;
                            this.positionTimeline = timelineRes.data;
                            return [3 /*break*/, 8];
                        case 6:
                            e_3 = _b.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_3);
                            return [3 /*break*/, 8];
                        case 7:
                            this.positionTimelineLoading = false;
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        fetchPositionActivity: function (positionType, id, category) {
            return __awaiter(this, void 0, void 0, function () {
                var requests, shouldLoadInvestment, shouldLoadLiquidity, _a, valuationsRes, maybeInvestmentRes, maybeLiquidityRes, valuations, _b, valuationsRes, eventsRes, e_4;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.positionActivityLoading = true;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 6, 7, 8]);
                            if (!(positionType === 'asset')) return [3 /*break*/, 3];
                            requests = [api_1.coreNetWorthApi.getAssetValuations()];
                            shouldLoadInvestment = category === 'investments';
                            shouldLoadLiquidity = category === 'cash';
                            if (shouldLoadInvestment)
                                requests.push(api_1.coreNetWorthApi.getInvestmentEvents());
                            if (shouldLoadLiquidity)
                                requests.push(api_1.coreNetWorthApi.getLiquidityEvents());
                            return [4 /*yield*/, Promise.all(requests)];
                        case 2:
                            _a = _c.sent(), valuationsRes = _a[0], maybeInvestmentRes = _a[1], maybeLiquidityRes = _a[2];
                            valuations = valuationsRes.data;
                            this.assetValuations = valuations.filter(function (row) { return row.asset_ref === id; });
                            this.investmentEvents = shouldLoadInvestment
                                ? maybeInvestmentRes.data.filter(function (row) { return row.asset_ref === id; })
                                : [];
                            this.liquidityEvents = shouldLoadLiquidity
                                ? (shouldLoadInvestment ? maybeLiquidityRes : maybeInvestmentRes).data.filter(function (row) { return row.asset_ref === id; })
                                : [];
                            this.liabilityValuations = [];
                            this.liabilityEvents = [];
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, Promise.all([
                                api_1.coreNetWorthApi.getLiabilityValuations(),
                                api_1.coreNetWorthApi.getLiabilityEvents(),
                            ])];
                        case 4:
                            _b = _c.sent(), valuationsRes = _b[0], eventsRes = _b[1];
                            this.liabilityValuations = valuationsRes.data.filter(function (row) { return row.liability_ref === id; });
                            this.liabilityEvents = eventsRes.data.filter(function (row) { return row.liability_ref === id; });
                            this.assetValuations = [];
                            this.investmentEvents = [];
                            this.liquidityEvents = [];
                            _c.label = 5;
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_4 = _c.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_4);
                            return [3 /*break*/, 8];
                        case 7:
                            this.positionActivityLoading = false;
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        },
        createTodaySnapshot: function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.createSnapshotFromCurrent()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_5 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_5);
                            this.loading = false;
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        deleteSnapshot: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var e_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.deleteSnapshot(id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            e_6 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_6);
                            return [3 /*break*/, 6];
                        case 5:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        createAsset: function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var createdAsset, _a, ownership_id, corePayload, res, e_7, _b;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            createdAsset = null;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 12, 13]);
                            _a = payload.ownership_id, ownership_id = _a === void 0 ? null : _a, corePayload = __rest(payload, ["ownership_id"]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.createAsset(corePayload)];
                        case 2:
                            res = _e.sent();
                            createdAsset = (_c = res === null || res === void 0 ? void 0 : res.data) !== null && _c !== void 0 ? _c : null;
                            if (!((_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, api_1.premiumOwnershipApi.syncOwnershipLink({
                                    target_type: 'asset',
                                    target_id: res.data.id,
                                    ownership_id: ownership_id,
                                })];
                        case 3:
                            _e.sent();
                            _e.label = 4;
                        case 4: return [4 /*yield*/, this.refreshAll()];
                        case 5:
                            _e.sent();
                            return [2 /*return*/, createdAsset];
                        case 6:
                            e_7 = _e.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_7);
                            if (!createdAsset) return [3 /*break*/, 11];
                            _e.label = 7;
                        case 7:
                            _e.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.refreshAll()];
                        case 8:
                            _e.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _b = _e.sent();
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/, createdAsset];
                        case 11: return [2 /*return*/, null];
                        case 12:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        },
        updateAsset: function (id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, ownership_id, corePayload, e_8;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, 6, 7]);
                            _a = payload.ownership_id, ownership_id = _a === void 0 ? null : _a, corePayload = __rest(payload, ["ownership_id"]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.updateAsset(id, corePayload)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, api_1.premiumOwnershipApi.syncOwnershipLink({
                                    target_type: 'asset',
                                    target_id: id,
                                    ownership_id: ownership_id,
                                })];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            e_8 = _b.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_8);
                            return [3 /*break*/, 7];
                        case 6:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        archiveAsset: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateAsset(id, { is_active: false })];
                });
            });
        },
        deleteAsset: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var e_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.deleteAsset(id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            e_9 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_9);
                            return [3 /*break*/, 6];
                        case 5:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        createLiability: function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var createdLiability, _a, ownership_id, corePayload, res, e_10, _b;
                var _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            createdLiability = null;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 12, 13]);
                            _a = payload.ownership_id, ownership_id = _a === void 0 ? null : _a, corePayload = __rest(payload, ["ownership_id"]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.createLiability(corePayload)];
                        case 2:
                            res = _e.sent();
                            createdLiability = (_c = res === null || res === void 0 ? void 0 : res.data) !== null && _c !== void 0 ? _c : null;
                            if (!((_d = res === null || res === void 0 ? void 0 : res.data) === null || _d === void 0 ? void 0 : _d.id)) return [3 /*break*/, 4];
                            return [4 /*yield*/, api_1.premiumOwnershipApi.syncOwnershipLink({
                                    target_type: 'liability',
                                    target_id: res.data.id,
                                    ownership_id: ownership_id,
                                })];
                        case 3:
                            _e.sent();
                            _e.label = 4;
                        case 4: return [4 /*yield*/, this.refreshAll()];
                        case 5:
                            _e.sent();
                            return [2 /*return*/, createdLiability];
                        case 6:
                            e_10 = _e.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_10);
                            if (!createdLiability) return [3 /*break*/, 11];
                            _e.label = 7;
                        case 7:
                            _e.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.refreshAll()];
                        case 8:
                            _e.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            _b = _e.sent();
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/, createdLiability];
                        case 11: return [2 /*return*/, null];
                        case 12:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        },
        updateLiability: function (id, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, ownership_id, corePayload, e_11;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, 6, 7]);
                            _a = payload.ownership_id, ownership_id = _a === void 0 ? null : _a, corePayload = __rest(payload, ["ownership_id"]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.updateLiability(id, corePayload)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, api_1.premiumOwnershipApi.syncOwnershipLink({
                                    target_type: 'liability',
                                    target_id: id,
                                    ownership_id: ownership_id,
                                })];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            e_11 = _b.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_11);
                            return [3 /*break*/, 7];
                        case 6:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        archiveLiability: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateLiability(id, { is_active: false })];
                });
            });
        },
        deleteLiability: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var e_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.deleteLiability(id)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.refreshAll()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            e_12 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_12);
                            return [3 /*break*/, 6];
                        case 5:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        fetchSettings: function () {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.getSettings()];
                        case 1:
                            res = _a.sent();
                            this.baseCurrency = res.data.base_currency;
                            this.inflationRegion = res.data.inflation_region;
                            return [3 /*break*/, 3];
                        case 2:
                            e_13 = _a.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_13);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        updateSettings: function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var res, e_14;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            this.loading = true;
                            this.error = null;
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, api_1.coreNetWorthApi.updateSettings({
                                    base_currency: (_b = (_a = payload.base_currency) !== null && _a !== void 0 ? _a : this.baseCurrency) !== null && _b !== void 0 ? _b : 'EUR',
                                    inflation_region: (_d = (_c = payload.inflation_region) !== null && _c !== void 0 ? _c : this.inflationRegion) !== null && _d !== void 0 ? _d : 'ES',
                                })];
                        case 2:
                            res = _e.sent();
                            this.baseCurrency = res.data.base_currency;
                            this.inflationRegion = res.data.inflation_region;
                            return [4 /*yield*/, this.refreshAll()];
                        case 3:
                            _e.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            e_14 = _e.sent();
                            this.error = (0, errors_1.toApiErrorMessage)(e_14);
                            return [3 /*break*/, 6];
                        case 5:
                            this.loading = false;
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        },
        updateBaseCurrency: function (currency) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.updateSettings({ base_currency: currency })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        updateInflationRegion: function (region) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.updateSettings({ inflation_region: region })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
});
