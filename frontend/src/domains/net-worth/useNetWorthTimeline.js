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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNetWorthTimeline = useNetWorthTimeline;
var vue_1 = require("vue");
var net_worth_1 = require("@/domains/net-worth");
function formatMonthYearLabel(date) {
    return new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit' }).format(new Date(date));
}
function useNetWorthTimeline(params) {
    var _this = this;
    var ownershipTimelineCache = (0, vue_1.ref)({});
    var ownershipTimelineLoading = (0, vue_1.ref)(false);
    var cachedDisplayedTimelineRows = (0, vue_1.ref)([]);
    var cachedDisplayedTimelineSeriesColor = (0, vue_1.ref)('#4cc3ff');
    function positionCacheKey(type, id) {
        return "".concat(type, ":").concat(id);
    }
    var ownershipScopedRows = (0, vue_1.computed)(function () {
        if (params.ownershipFilter.value === 'all' || params.selectedPosition.value)
            return [];
        if (params.selectedTimelineCategory.value)
            return params.availablePositionRows.value;
        return __spreadArray(__spreadArray([], params.allAssetPositionRows.value, true), params.allLiabilityPositionRows.value, true);
    });
    function ensureOwnershipTimelineCache(rows) {
        return __awaiter(this, void 0, void 0, function () {
            var missingRows, results, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        missingRows = rows.filter(function (row) { return !ownershipTimelineCache.value[positionCacheKey(row.type, row.id)]; });
                        if (!missingRows.length)
                            return [2 /*return*/];
                        ownershipTimelineLoading.value = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all(missingRows.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                var response, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!(row.type === 'asset')) return [3 /*break*/, 2];
                                            return [4 /*yield*/, net_worth_1.coreNetWorthApi.getAssetTimeline(row.id)];
                                        case 1:
                                            _a = _b.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, net_worth_1.coreNetWorthApi.getLiabilityTimeline(row.id)];
                                        case 3:
                                            _a = _b.sent();
                                            _b.label = 4;
                                        case 4:
                                            response = _a;
                                            return [2 /*return*/, { row: row, timeline: response.data }];
                                    }
                                });
                            }); }))];
                    case 2:
                        results = _a.sent();
                        ownershipTimelineCache.value = results.reduce(function (cache, entry) {
                            var _a;
                            cache[positionCacheKey(entry.row.type, entry.row.id)] = {
                                positionType: entry.row.type,
                                rows: ((_a = entry.timeline.rows) !== null && _a !== void 0 ? _a : []).map(function (timelineRow) { return ({
                                    date: timelineRow.date,
                                    label: formatMonthYearLabel(timelineRow.date),
                                    value: Number(timelineRow.value_base || timelineRow.value || 0),
                                }); }),
                            };
                            return cache;
                        }, __assign({}, ownershipTimelineCache.value));
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        params.setStoreError(error_1 instanceof Error ? error_1.message : 'No se pudo cargar la timeline filtrada');
                        return [3 /*break*/, 5];
                    case 4:
                        ownershipTimelineLoading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    (0, vue_1.watch)(function () { return ownershipScopedRows.value.map(function (row) { return positionCacheKey(row.type, row.id); }).join('|'); }, function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (params.ownershipFilter.value === 'all' || params.selectedPosition.value)
                        return [2 /*return*/];
                    return [4 /*yield*/, ensureOwnershipTimelineCache(ownershipScopedRows.value)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, { immediate: true });
    (0, vue_1.watch)(params.availablePositionRows, function (rows) {
        if (!params.selectedPositionId.value || !params.selectedPositionType.value)
            return;
        if (!rows.some(function (row) {
            return row.id === params.selectedPositionId.value &&
                row.type === params.selectedPositionType.value;
        })) {
            params.resetPositionSelection();
        }
    });
    var ownershipTimelineRows = (0, vue_1.computed)(function () {
        var _a;
        if (params.ownershipFilter.value === 'all')
            return [];
        var byDate = new Map();
        for (var _i = 0, _b = ownershipScopedRows.value; _i < _b.length; _i++) {
            var row = _b[_i];
            var cached = ownershipTimelineCache.value[positionCacheKey(row.type, row.id)];
            if (!cached)
                continue;
            for (var _c = 0, _d = cached.rows; _c < _d.length; _c++) {
                var point = _d[_c];
                var current = (_a = byDate.get(point.date)) !== null && _a !== void 0 ? _a : {
                    date: point.date,
                    label: point.label,
                    netWorth: 0,
                    assets: 0,
                    liabilities: 0,
                };
                if (row.type === 'asset') {
                    current.assets += point.value * row.ownershipFraction;
                }
                else {
                    current.liabilities += point.value * row.ownershipFraction;
                }
                current.netWorth = current.assets - current.liabilities;
                byDate.set(point.date, current);
            }
        }
        return Array.from(byDate.values()).sort(function (a, b) { return a.date.localeCompare(b.date); });
    });
    var activeTimelineRows = (0, vue_1.computed)(function () {
        return params.ownershipFilter.value === 'all'
            ? params.timelineRows.value
            : ownershipTimelineRows.value;
    });
    var displayedTimelineRows = (0, vue_1.computed)(function () {
        if (params.selectedPosition.value) {
            return params.positionTimelineRows.value.map(function (row) { return ({
                date: row.date,
                label: row.label,
                value: row.value,
            }); });
        }
        return activeTimelineRows.value.map(function (row) { return ({
            date: row.date,
            label: row.label,
            value: params.getTimelineMetricValue(row),
        }); });
    });
    var displayedTimelineLoading = (0, vue_1.computed)(function () {
        return params.selectedPosition.value
            ? params.storePositionTimelineLoading.value
            : params.ownershipFilter.value === 'all'
                ? params.storeTimelineLoading.value
                : ownershipTimelineLoading.value;
    });
    var currentTimelineSeriesColor = (0, vue_1.computed)(function () {
        var _a, _b;
        if (((_a = params.selectedPosition.value) === null || _a === void 0 ? void 0 : _a.type) === 'liability')
            return '#ff4d73';
        if (params.selectedTimelineCategoryType.value === 'liability')
            return '#ff4d73';
        if (((_b = params.selectedPosition.value) === null || _b === void 0 ? void 0 : _b.type) === 'asset')
            return '#2dd4bf';
        return '#4cc3ff';
    });
    (0, vue_1.watch)([displayedTimelineRows, displayedTimelineLoading], function (_a) {
        var rows = _a[0], loading = _a[1];
        if (!loading && rows.length > 0) {
            cachedDisplayedTimelineRows.value = rows;
            cachedDisplayedTimelineSeriesColor.value = currentTimelineSeriesColor.value;
        }
    }, { immediate: true });
    var visibleTimelineRows = (0, vue_1.computed)(function () {
        if (displayedTimelineLoading.value && cachedDisplayedTimelineRows.value.length > 0) {
            return cachedDisplayedTimelineRows.value;
        }
        return displayedTimelineRows.value.length > 0
            ? displayedTimelineRows.value
            : cachedDisplayedTimelineRows.value;
    });
    var timelinePresetPointCount = {
        '1m': 1,
        '3m': 3,
        '6m': 6,
        '1a': 12,
        all: Number.POSITIVE_INFINITY,
    };
    var timelineDefaultWindow = (0, vue_1.computed)(function () {
        var end = Math.max(0, visibleTimelineRows.value.length - 1);
        var count = timelinePresetPointCount[params.selectedTimelinePreset.value];
        if (!Number.isFinite(count))
            return { start: 0, end: end };
        return { start: Math.max(0, end - count + 1), end: end };
    });
    var timelineWindow = (0, vue_1.computed)(function () {
        var _a;
        var length = visibleTimelineRows.value.length;
        if (length === 0)
            return { start: 0, end: 0 };
        var source = (_a = params.customTimelineWindow.value) !== null && _a !== void 0 ? _a : timelineDefaultWindow.value;
        var start = Math.min(Math.max(0, source.start), length - 1);
        var end = Math.min(Math.max(start, source.end), length - 1);
        return { start: start, end: end };
    });
    var timelineChartRows = (0, vue_1.computed)(function () {
        return visibleTimelineRows.value.slice(timelineWindow.value.start, timelineWindow.value.end + 1);
    });
    var timelineChartPoints = (0, vue_1.computed)(function () {
        return timelineChartRows.value.map(function (row) { return ({
            date: row.date,
            shortLabel: row.label,
            fullLabel: row.date === 'current'
                ? row.label
                : new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(row.date)),
            value: row.value,
        }); });
    });
    var timelineRangeCaption = (0, vue_1.computed)(function () {
        if (timelineChartPoints.value.length === 0)
            return '-';
        var first = timelineChartPoints.value[0];
        var last = timelineChartPoints.value[timelineChartPoints.value.length - 1];
        if (!first || !last)
            return '-';
        return "".concat(first.fullLabel, " - ").concat(last.fullLabel);
    });
    var latestTimelineChartPoint = (0, vue_1.computed)(function () { var _a; return (_a = timelineChartPoints.value[timelineChartPoints.value.length - 1]) !== null && _a !== void 0 ? _a : null; });
    var displayedTimelineSummaryLabel = (0, vue_1.computed)(function () {
        if (params.selectedPosition.value) {
            return params.selectedPosition.value.type === 'liability'
                ? 'Ultimo valor del pasivo'
                : 'Ultimo valor del activo';
        }
        if (!params.selectedTimelineCategory.value)
            return 'Ultimo patrimonio neto';
        return 'Ultimo valor de la categoria';
    });
    var displayedTimelineSeriesColor = (0, vue_1.computed)(function () {
        if (displayedTimelineLoading.value && cachedDisplayedTimelineRows.value.length > 0) {
            return cachedDisplayedTimelineSeriesColor.value;
        }
        return currentTimelineSeriesColor.value;
    });
    return {
        displayedTimelineLoading: displayedTimelineLoading,
        visibleTimelineRows: visibleTimelineRows,
        timelineWindow: timelineWindow,
        timelineChartRows: timelineChartRows,
        timelineChartPoints: timelineChartPoints,
        timelineRangeCaption: timelineRangeCaption,
        latestTimelineChartPoint: latestTimelineChartPoint,
        timelineSummaryLabel: displayedTimelineSummaryLabel,
        displayedTimelineSeriesColor: displayedTimelineSeriesColor,
    };
}
