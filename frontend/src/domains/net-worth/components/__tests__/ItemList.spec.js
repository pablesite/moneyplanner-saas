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
var test_utils_1 = require("@vue/test-utils");
var vitest_1 = require("vitest");
var ItemList_vue_1 = require("@/domains/net-worth/components/ItemList.vue");
var stubs = {
    ItemCategoryHeader: {
        props: ['label'],
        template: '<button data-test="toggle" @click="$emit(\'toggle\')">{{ label }}</button>',
    },
    ItemSubgroupHeader: {
        template: '<div data-test="subgroup"></div>',
    },
    ItemDisplayRow: {
        template: '<div><button data-test="edit" @click="$emit(\'edit\')">edit</button><button data-test="archive" @click="$emit(\'archive\')">archive</button><button data-test="delete" @click="$emit(\'delete\')">delete</button></div>',
    },
    EditableItemRow: {
        template: '<div><button data-test="save" @click="$emit(\'save\')">save</button><button data-test="cancel" @click="$emit(\'cancel\')">cancel</button></div>',
    },
};
(0, vitest_1.describe)('ItemList (core)', function () {
    (0, vitest_1.it)('handles add, archive, delete and edit/update flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onAdd, onArchive, onDelete, onUpdate, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onAdd = vitest_1.vi.fn();
                    onArchive = vitest_1.vi.fn().mockResolvedValue(undefined);
                    onDelete = vitest_1.vi.fn().mockResolvedValue(undefined);
                    onUpdate = vitest_1.vi.fn().mockResolvedValue(undefined);
                    vitest_1.vi.spyOn(window, 'confirm').mockReturnValue(true);
                    wrapper = (0, test_utils_1.mount)(ItemList_vue_1.default, {
                        props: {
                            title: 'Activos',
                            items: [
                                {
                                    id: 1,
                                    name: 'Caja',
                                    category: 'cash',
                                    subcategory: 'wallet',
                                    amount: '100.00',
                                    currency: 'EUR',
                                    notes: '',
                                    is_active: true,
                                    tracking_mode: 'manual',
                                    accounting_account_id: null,
                                },
                                {
                                    id: 2,
                                    name: 'Archivado',
                                    category: 'cash',
                                    subcategory: 'wallet',
                                    amount: '1.00',
                                    currency: 'EUR',
                                    notes: '',
                                    is_active: false,
                                    tracking_mode: 'manual',
                                    accounting_account_id: null,
                                },
                            ],
                            categories: [{ value: 'cash', label: 'Cash' }],
                            subcategories: [{ value: 'wallet', label: 'Wallet', category: 'cash' }],
                            onUpdate: onUpdate,
                            onArchive: onArchive,
                            onDelete: onDelete,
                            onAdd: onAdd,
                        },
                        global: { stubs: stubs },
                    });
                    return [4 /*yield*/, wrapper.find('button[aria-label="Anadir"]').trigger('click')];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onAdd).toHaveBeenCalled();
                    return [4 /*yield*/, wrapper.find('[data-test="toggle"]').trigger('click')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, wrapper.find('[data-test="archive"]').trigger('click')];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(onArchive).toHaveBeenCalledWith(1);
                    return [4 /*yield*/, wrapper.find('[data-test="delete"]').trigger('click')];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(onDelete).toHaveBeenCalledWith(1);
                    return [4 /*yield*/, wrapper.find('[data-test="edit"]').trigger('click')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, wrapper.find('[data-test="save"]').trigger('click')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
                case 7:
                    _a.sent();
                    (0, vitest_1.expect)(onUpdate).toHaveBeenCalledWith(1, vitest_1.expect.objectContaining({
                        name: 'Caja',
                        category: 'cash',
                        amount: '100',
                    }));
                    (0, vitest_1.expect)(wrapper.findAll('[data-test="edit"]')).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('applies ownership share over effective_amount when present', function () {
        var amountRowStub = {
            props: ['formattedAmount'],
            template: '<div data-test="amount">{{ formattedAmount }}</div>',
        };
        var wrapper = (0, test_utils_1.mount)(ItemList_vue_1.default, {
            props: {
                title: 'Activos',
                ownershipFilterValue: 1,
                items: [
                    {
                        id: 10,
                        name: 'Palmito',
                        category: 'real_estate',
                        subcategory: 'primary_home',
                        amount: '91000.00',
                        effective_amount: '145905.37',
                        currency: 'EUR',
                        notes: '',
                        is_active: true,
                        tracking_mode: 'manual',
                        accounting_account_id: null,
                        ownership_ref: 22,
                    },
                ],
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                    { value: 'primary_home', label: 'Vivienda habitual', category: 'real_estate' },
                ],
                ownerships: [
                    {
                        id: 22,
                        kind: 'shared',
                        member: null,
                        splits: [
                            { member: { id: 1, name: 'Ana', role: 'adult' }, percent: '50.00' },
                            { member: { id: 2, name: 'Pablo', role: 'adult' }, percent: '50.00' },
                        ],
                        notes: '',
                    },
                ],
                onUpdate: vitest_1.vi.fn().mockResolvedValue(undefined),
                onArchive: vitest_1.vi.fn().mockResolvedValue(undefined),
            },
            global: {
                stubs: __assign(__assign({}, stubs), { ItemDisplayRow: amountRowStub }),
            },
        });
        (0, vitest_1.expect)(wrapper.text()).toContain('72.952,69');
    });
});
