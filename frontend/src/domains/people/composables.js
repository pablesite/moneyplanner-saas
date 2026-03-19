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
exports.usePeopleMembers = usePeopleMembers;
exports.usePeopleOwnerships = usePeopleOwnerships;
var vue_1 = require("vue");
var store_1 = require("@/domains/people/store");
function usePeopleMembers() {
    var store = (0, store_1.usePeopleStore)();
    var form = (0, vue_1.reactive)({
        name: '',
        role: 'adult',
    });
    var saving = (0, vue_1.ref)(false);
    var rowBusy = (0, vue_1.ref)({});
    var createOpen = (0, vue_1.ref)(false);
    var successMessage = (0, vue_1.ref)(null);
    var editOpen = (0, vue_1.ref)(false);
    var editForm = (0, vue_1.reactive)({
        id: null,
        name: '',
        role: 'adult',
    });
    var prettyError = (0, vue_1.computed)(function () { return store.error; });
    var membersSorted = (0, vue_1.computed)(function () {
        var arr = __spreadArray([], store.members, true);
        arr.sort(function (a, b) {
            if (a.role !== b.role)
                return a.role === 'adult' ? -1 : 1;
            if (a.is_active !== b.is_active)
                return a.is_active ? -1 : 1;
            return a.name.localeCompare(b.name);
        });
        return arr;
    });
    function ensureLoaded() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!store.members.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, store.fetchMembers()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function refreshMembers() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.fetchMembers()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function openCreate() {
        store.clearError();
        successMessage.value = null;
        form.name = '';
        form.role = 'adult';
        createOpen.value = true;
    }
    function closeCreate() {
        createOpen.value = false;
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = form.name.trim();
                        if (!name)
                            return [2 /*return*/];
                        saving.value = true;
                        store.clearError();
                        successMessage.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, store.createMember({ name: name, role: form.role })];
                    case 2:
                        _a.sent();
                        form.name = '';
                        form.role = 'adult';
                        createOpen.value = false;
                        successMessage.value = 'Miembro creado correctamente.';
                        return [3 /*break*/, 4];
                    case 3:
                        saving.value = false;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function withRowBusy(id, fn) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (rowBusy.value[id])
                            return [2 /*return*/];
                        rowBusy.value[id] = true;
                        store.clearError();
                        successMessage.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, fn()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        rowBusy.value[id] = false;
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function toggleActive(id, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, withRowBusy(id, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, store.updateMember(id, { is_active: next })];
                                    case 1:
                                        _a.sent();
                                        successMessage.value = next
                                            ? 'Miembro activado correctamente.'
                                            : 'Miembro desactivado correctamente.';
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function openEdit(member) {
        store.clearError();
        successMessage.value = null;
        editForm.id = member.id;
        editForm.name = member.name;
        editForm.role = member.role;
        editOpen.value = true;
    }
    function closeEdit() {
        editOpen.value = false;
    }
    function saveEdit() {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (editForm.id == null)
                            return [2 /*return*/];
                        name = editForm.name.trim();
                        if (!name)
                            return [2 /*return*/];
                        return [4 /*yield*/, withRowBusy(editForm.id, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, store.updateMember(editForm.id, { name: name, role: editForm.role })];
                                        case 1:
                                            _a.sent();
                                            editOpen.value = false;
                                            successMessage.value = 'Miembro actualizado correctamente.';
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function removeMember(member) {
        return __awaiter(this, void 0, void 0, function () {
            var ok;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ok = window.confirm("\u00BFEliminar a \"".concat(member.name, "\"?\n\nSolo se podr\u00E1 si no est\u00E1 en uso."));
                        if (!ok)
                            return [2 /*return*/];
                        return [4 /*yield*/, withRowBusy(member.id, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, store.deleteMember(member.id)];
                                        case 1:
                                            _a.sent();
                                            successMessage.value = 'Miembro eliminado correctamente.';
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    return {
        store: store,
        form: form,
        saving: saving,
        rowBusy: rowBusy,
        createOpen: createOpen,
        successMessage: successMessage,
        editOpen: editOpen,
        editForm: editForm,
        prettyError: prettyError,
        membersSorted: membersSorted,
        ensureLoaded: ensureLoaded,
        refreshMembers: refreshMembers,
        openCreate: openCreate,
        closeCreate: closeCreate,
        submit: submit,
        toggleActive: toggleActive,
        openEdit: openEdit,
        closeEdit: closeEdit,
        saveEdit: saveEdit,
        removeMember: removeMember,
    };
}
function usePeopleOwnerships() {
    var store = (0, store_1.usePeopleStore)();
    var showModal = (0, vue_1.ref)(false);
    var editId = (0, vue_1.ref)(null);
    var successMessage = (0, vue_1.ref)(null);
    var form = (0, vue_1.reactive)({
        memberIds: [],
        percents: {},
    });
    var adults = (0, vue_1.computed)(function () { return store.activeAdults; });
    var canCreate = (0, vue_1.computed)(function () {
        var _a;
        if (form.memberIds.length < 2)
            return false;
        for (var _i = 0, _b = form.memberIds; _i < _b.length; _i++) {
            var id = _b[_i];
            var p = Number(String((_a = form.percents[id]) !== null && _a !== void 0 ? _a : '').replace(',', '.'));
            if (!Number.isFinite(p) || p <= 0 || p > 100)
                return false;
        }
        var total = form.memberIds.reduce(function (acc, id) {
            var _a;
            var p = Number(String((_a = form.percents[id]) !== null && _a !== void 0 ? _a : '0').replace(',', '.'));
            return acc + (Number.isFinite(p) ? p : 0);
        }, 0);
        return Math.abs(total - 100) < 0.0001;
    });
    var ownershipsSorted = (0, vue_1.computed)(function () {
        var arr = __spreadArray([], store.ownerships, true).filter(function (ownership) { return ownership.kind === 'shared'; });
        arr.sort(function (a, b) { return a.id - b.id; });
        return arr;
    });
    function ensureLoaded() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!store.ownerships.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, store.fetchOwnerships()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!!store.members.length) return [3 /*break*/, 4];
                        return [4 /*yield*/, store.fetchMembers()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function refreshOwnerships() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.fetchOwnerships()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function resetModal() {
        showModal.value = false;
        form.memberIds = [];
        form.percents = {};
        editId.value = null;
    }
    function openCreate() {
        successMessage.value = null;
        editId.value = null;
        form.memberIds = [];
        form.percents = {};
        showModal.value = true;
    }
    function openEdit(ownership) {
        var _a, _b;
        if (ownership.kind !== 'shared')
            return;
        successMessage.value = null;
        editId.value = ownership.id;
        form.memberIds = ((_a = ownership.splits) !== null && _a !== void 0 ? _a : [])
            .map(function (split) { var _a; return (_a = split.member) === null || _a === void 0 ? void 0 : _a.id; })
            .filter(function (id) { return id != null; });
        form.percents = {};
        ((_b = ownership.splits) !== null && _b !== void 0 ? _b : []).forEach(function (split) {
            var _a, _b;
            if (((_a = split.member) === null || _a === void 0 ? void 0 : _a.id) != null)
                form.percents[split.member.id] = String((_b = split.percent) !== null && _b !== void 0 ? _b : '');
        });
        showModal.value = true;
    }
    function toggleMember(id) {
        var _a;
        var idx = form.memberIds.indexOf(id);
        if (idx >= 0) {
            form.memberIds.splice(idx, 1);
            delete form.percents[id];
        }
        else {
            form.memberIds.push(id);
            form.percents[id] = (_a = form.percents[id]) !== null && _a !== void 0 ? _a : '';
        }
    }
    function setEqualSplit() {
        if (form.memberIds.length < 2)
            return;
        var each = (100 / form.memberIds.length).toFixed(2);
        for (var _i = 0, _a = form.memberIds; _i < _a.length; _i++) {
            var id = _a[_i];
            form.percents[id] = each;
        }
        var sum = (form.memberIds.length - 1) * Number(each);
        var last = (100 - sum).toFixed(2);
        var lastMemberId = form.memberIds[form.memberIds.length - 1];
        if (lastMemberId == null)
            return;
        form.percents[lastMemberId] = last;
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var splits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!canCreate.value)
                            return [2 /*return*/];
                        successMessage.value = null;
                        splits = form.memberIds.map(function (id) { return ({
                            member_id: id,
                            percent: String(form.percents[id]).replace(',', '.'),
                        }); });
                        if (!(editId.value != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, store.updateSharedOwnership(editId.value, { splits: splits })];
                    case 1:
                        _a.sent();
                        successMessage.value = 'Titularidad compartida actualizada correctamente.';
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, store.createSharedOwnership({ splits: splits })];
                    case 3:
                        _a.sent();
                        successMessage.value = 'Titularidad compartida creada correctamente.';
                        _a.label = 4;
                    case 4:
                        resetModal();
                        return [2 /*return*/];
                }
            });
        });
    }
    function removeOwnership(id) {
        return __awaiter(this, void 0, void 0, function () {
            var ok;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ok = window.confirm('¿Eliminar esta titularidad compartida? (Solo si no está en uso)');
                        if (!ok)
                            return [2 /*return*/];
                        successMessage.value = null;
                        return [4 /*yield*/, store.deleteOwnership(id)];
                    case 1:
                        _a.sent();
                        successMessage.value = 'Titularidad compartida eliminada correctamente.';
                        return [2 /*return*/];
                }
            });
        });
    }
    return {
        store: store,
        showModal: showModal,
        editId: editId,
        successMessage: successMessage,
        form: form,
        adults: adults,
        canCreate: canCreate,
        ownershipsSorted: ownershipsSorted,
        ensureLoaded: ensureLoaded,
        refreshOwnerships: refreshOwnerships,
        resetModal: resetModal,
        openCreate: openCreate,
        openEdit: openEdit,
        toggleMember: toggleMember,
        setEqualSplit: setEqualSplit,
        submit: submit,
        removeOwnership: removeOwnership,
    };
}
