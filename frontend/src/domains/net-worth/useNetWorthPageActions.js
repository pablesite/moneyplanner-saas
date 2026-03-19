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
exports.useNetWorthPageActions = useNetWorthPageActions;
var vue_1 = require("vue");
function useNetWorthPageActions(params) {
    function resetPositionSelection() {
        params.selectedPositionType.value = null;
        params.selectedPositionId.value = null;
        params.store.positionTimeline = null;
        params.store.assetValuations = [];
        params.store.liabilityValuations = [];
        params.store.investmentEvents = [];
        params.store.liquidityEvents = [];
        params.store.liabilityEvents = [];
        params.resetAccountingActivity();
    }
    function openCreateModal(type, category) {
        if (category === void 0) { category = null; }
        resetPositionSelection();
        if (type === 'asset') {
            params.createAssetCategory.value = category;
            params.showAssetModal.value = true;
            return;
        }
        params.createLiabilityCategory.value = category;
        params.showLiabilityModal.value = true;
    }
    function submitAssetFromView(payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, params.submitAsset(payload)];
                    case 1:
                        _a.sent();
                        params.createAssetCategory.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    function submitLiabilityFromView(payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, params.submitLiability(payload)];
                    case 1:
                        _a.sent();
                        params.createLiabilityCategory.value = null;
                        return [2 /*return*/];
                }
            });
        });
    }
    function applyTimelineCategoryFilter(category_1) {
        return __awaiter(this, arguments, void 0, function (category, categoryType) {
            if (categoryType === void 0) { categoryType = 'asset'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params.selectedTimelineCategory.value = category;
                        params.selectedTimelineCategoryType.value = categoryType;
                        params.selectedTimelinePreset.value = 'all';
                        params.customTimelineWindow.value = null;
                        resetPositionSelection();
                        return [4 /*yield*/, params.store.fetchTimeline(category, categoryType)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function resetTimelineSelection() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, applyTimelineCategoryFilter(null, 'asset')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function applyCompositionCategoryFilter(payload) {
        return __awaiter(this, void 0, void 0, function () {
            var isSelectedCategory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isSelectedCategory = params.selectedTimelineCategory.value === payload.key &&
                            params.selectedTimelineCategoryType.value === payload.type;
                        if (!isSelectedCategory) return [3 /*break*/, 2];
                        return [4 /*yield*/, applyTimelineCategoryFilter(null, 'asset')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, applyTimelineCategoryFilter(payload.key, payload.type)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleCompositionAddType(payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                openCreateModal(payload.type, null);
                return [2 /*return*/];
            });
        });
    }
    function selectPosition(row) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params.selectedPositionType.value = row.type;
                        params.selectedPositionId.value = row.id;
                        params.selectedTimelinePreset.value = 'all';
                        params.customTimelineWindow.value = null;
                        return [4 /*yield*/, Promise.all([
                                params.store.fetchPositionTimeline(row.type, row.id),
                                params.store.fetchPositionActivity(row.type, row.id, row.type === 'asset' ? row.category : null),
                                params.loadAccountingActivity(row),
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function setTimelinePreset(preset) {
        params.selectedTimelinePreset.value = preset;
        params.customTimelineWindow.value = null;
    }
    function updateTimelineWindowStart(rawValue) {
        var nextStart = Number(rawValue);
        var currentEnd = params.timelineWindow.value.end;
        params.customTimelineWindow.value = {
            start: Math.min(nextStart, currentEnd),
            end: currentEnd,
        };
    }
    function updateTimelineWindowEnd(rawValue) {
        var nextEnd = Number(rawValue);
        var currentStart = params.timelineWindow.value.start;
        params.customTimelineWindow.value = {
            start: currentStart,
            end: Math.max(currentStart, nextEnd),
        };
    }
    function onPositionSelection(event) {
        var _a;
        var target = event.target;
        var rawValue = (_a = target === null || target === void 0 ? void 0 : target.value) !== null && _a !== void 0 ? _a : '';
        if (!rawValue) {
            resetPositionSelection();
            return;
        }
        var selectedId = Number(rawValue);
        var row = params.availablePositionRows.value.find(function (item) { return item.id === selectedId; });
        if (!row) {
            resetPositionSelection();
            return;
        }
        void selectPosition(row);
    }
    var assetCreateInitial = (0, vue_1.computed)(function () {
        return params.createAssetCategory.value ? { category: params.createAssetCategory.value } : undefined;
    });
    var liabilityCreateInitial = (0, vue_1.computed)(function () {
        return params.createLiabilityCategory.value
            ? { category: params.createLiabilityCategory.value }
            : undefined;
    });
    return {
        resetPositionSelection: resetPositionSelection,
        openCreateModal: openCreateModal,
        submitAssetFromView: submitAssetFromView,
        submitLiabilityFromView: submitLiabilityFromView,
        applyTimelineCategoryFilter: applyTimelineCategoryFilter,
        resetTimelineSelection: resetTimelineSelection,
        applyCompositionCategoryFilter: applyCompositionCategoryFilter,
        handleCompositionAddType: handleCompositionAddType,
        selectPosition: selectPosition,
        setTimelinePreset: setTimelinePreset,
        updateTimelineWindowStart: updateTimelineWindowStart,
        updateTimelineWindowEnd: updateTimelineWindowEnd,
        onPositionSelection: onPositionSelection,
        assetCreateInitial: assetCreateInitial,
        liabilityCreateInitial: liabilityCreateInitial,
    };
}
