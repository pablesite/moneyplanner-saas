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
var vitest_1 = require("vitest");
var vue_1 = require("vue");
var composables_1 = require("@/domains/people/composables");
var mocks = vitest_1.vi.hoisted(function () { return ({
    usePeopleStore: vitest_1.vi.fn(),
}); });
vitest_1.vi.mock('@/domains/people/store', function () { return ({
    usePeopleStore: mocks.usePeopleStore,
}); });
function makeMember(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: 1, name: 'Ada', role: 'adult', is_active: true }, overrides);
}
function makeOwnership(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ id: 1, kind: 'shared', member: null, splits: [
            { member: { id: 1, name: 'Ada', role: 'adult' }, percent: '50' },
            { member: { id: 2, name: 'Bob', role: 'adult' }, percent: '50' },
        ], is_in_use: false }, overrides);
}
(0, vitest_1.describe)('people composables (saas)', function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.clearAllMocks();
        vitest_1.vi.stubGlobal('confirm', vitest_1.vi.fn(function () { return true; }));
    });
    (0, vitest_1.it)('handles member flows and success messages', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, members, member;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store = (0, vue_1.reactive)({
                        error: null,
                        members: [],
                        ownerships: [],
                        activeAdults: [makeMember(), makeMember({ id: 2, name: 'Bob' })],
                        clearError: vitest_1.vi.fn(),
                        fetchMembers: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        fetchOwnerships: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateSharedOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createSharedOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                    });
                    mocks.usePeopleStore.mockReturnValue(store);
                    members = (0, composables_1.usePeopleMembers)();
                    return [4 /*yield*/, members.ensureLoaded()];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(store.fetchMembers).toHaveBeenCalled();
                    members.openCreate();
                    (0, vitest_1.expect)(members.createOpen.value).toBe(true);
                    members.form.name = ' Ada ';
                    members.form.role = 'adult';
                    return [4 /*yield*/, members.submit()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(store.createMember).toHaveBeenCalledWith({ name: 'Ada', role: 'adult' });
                    (0, vitest_1.expect)(members.successMessage.value).toContain('creado');
                    member = makeMember();
                    members.openEdit(member);
                    members.editForm.name = ' Ada Lovelace ';
                    return [4 /*yield*/, members.saveEdit()];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(store.updateMember).toHaveBeenCalledWith(1, { name: 'Ada Lovelace', role: 'adult' });
                    (0, vitest_1.expect)(members.editOpen.value).toBe(false);
                    return [4 /*yield*/, members.toggleActive(1, false)];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(store.updateMember).toHaveBeenCalledWith(1, { is_active: false });
                    return [4 /*yield*/, members.removeMember(member)];
                case 5:
                    _a.sent();
                    (0, vitest_1.expect)(store.deleteMember).toHaveBeenCalledWith(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('sorts and validates ownership flows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var store, ownerships;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    store = (0, vue_1.reactive)({
                        error: null,
                        members: [makeMember(), makeMember({ id: 2, name: 'Bob' })],
                        ownerships: [
                            makeOwnership({ id: 2, kind: 'shared' }),
                            makeOwnership({ id: 1, kind: 'individual', member: { id: 1, name: 'Ada', role: 'adult' } }),
                        ],
                        activeAdults: [makeMember(), makeMember({ id: 2, name: 'Bob' })],
                        clearError: vitest_1.vi.fn(),
                        fetchMembers: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteMember: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        fetchOwnerships: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        updateSharedOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        createSharedOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                        deleteOwnership: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, undefined];
                        }); }); }),
                    });
                    mocks.usePeopleStore.mockReturnValue(store);
                    ownerships = (0, composables_1.usePeopleOwnerships)();
                    return [4 /*yield*/, ownerships.ensureLoaded()];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(store.fetchOwnerships).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(store.fetchMembers).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(ownerships.ownershipsSorted.value.map(function (item) { return item.id; })).toEqual([2]);
                    (0, vitest_1.expect)((_a = ownerships.ownershipsSorted.value[0]) === null || _a === void 0 ? void 0 : _a.kind).toBe('shared');
                    ownerships.openCreate();
                    ownerships.toggleMember(1);
                    ownerships.toggleMember(2);
                    ownerships.setEqualSplit();
                    (0, vitest_1.expect)(ownerships.canCreate.value).toBe(true);
                    return [4 /*yield*/, ownerships.submit()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(store.createSharedOwnership).toHaveBeenCalled();
                    ownerships.openEdit(makeOwnership({ id: 9 }));
                    (0, vitest_1.expect)(ownerships.editId.value).toBe(9);
                    ownerships.form.percents[1] = '60';
                    ownerships.form.percents[2] = '40';
                    return [4 /*yield*/, ownerships.submit()];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(store.updateSharedOwnership).toHaveBeenCalledWith(9, {
                        splits: [
                            { member_id: 1, percent: '60' },
                            { member_id: 2, percent: '40' },
                        ],
                    });
                    return [4 /*yield*/, ownerships.removeOwnership(9)];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(store.deleteOwnership).toHaveBeenCalledWith(9);
                    return [2 /*return*/];
            }
        });
    }); });
});
