'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.usePeopleStore = void 0;
var pinia_1 = require('pinia');
var api_1 = require('@/domains/people/api');
var errors_1 = require('@/domains/people/errors');
exports.usePeopleStore = (0, pinia_1.defineStore)('people', {
  state: function () {
    return {
      loading: false,
      error: null,
      members: [],
      ownerships: [],
    };
  },
  getters: {
    activeAdults: function (state) {
      return state.members.filter(function (m) {
        return m.is_active && m.role === 'adult';
      });
    },
  },
  actions: {
    clearError: function () {
      this.error = null;
    },
    // -------- Members --------
    fetchMembers: function () {
      return __awaiter(this, void 0, void 0, function () {
        var data, e_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [4 /*yield*/, api_1.peopleApi.getMembers()];
            case 2:
              data = _a.sent().data;
              this.members = data;
              return [3 /*break*/, 5];
            case 3:
              e_1 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_1);
              return [3 /*break*/, 5];
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    createMember: function (payload) {
      return __awaiter(this, void 0, void 0, function () {
        var data, e_2;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [
                4 /*yield*/,
                api_1.peopleApi.createMember(__assign(__assign({}, payload), { is_active: true })),
              ];
            case 2:
              data = _a.sent().data;
              this.members = __spreadArray(
                __spreadArray([], this.members, true),
                [data],
                false,
              ).sort(function (a, b) {
                if (a.role !== b.role) return a.role === 'adult' ? -1 : 1;
                return a.name.localeCompare(b.name);
              });
              return [2 /*return*/, data];
            case 3:
              e_2 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_2);
              throw e_2;
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    updateMember: function (id, patch) {
      return __awaiter(this, void 0, void 0, function () {
        var data_1, e_3;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [4 /*yield*/, api_1.peopleApi.updateMember(id, patch)];
            case 2:
              data_1 = _a.sent().data;
              this.members = this.members.map(function (m) {
                return m.id === id ? data_1 : m;
              });
              return [2 /*return*/, data_1];
            case 3:
              e_3 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_3);
              throw e_3;
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    deleteMember: function (id) {
      return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [4 /*yield*/, api_1.peopleApi.deleteMember(id)];
            case 2:
              _a.sent();
              this.members = this.members.filter(function (m) {
                return m.id !== id;
              });
              return [3 /*break*/, 5];
            case 3:
              e_4 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_4);
              throw e_4;
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    // -------- Ownerships --------
    fetchOwnerships: function () {
      return __awaiter(this, void 0, void 0, function () {
        var data, e_5;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [4 /*yield*/, api_1.peopleApi.getOwnerships()];
            case 2:
              data = _a.sent().data;
              this.ownerships = data;
              return [3 /*break*/, 5];
            case 3:
              e_5 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_5);
              return [3 /*break*/, 5];
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
    createSharedOwnership: function (payload) {
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
              return [4 /*yield*/, api_1.peopleApi.createSharedOwnership(payload)];
            case 2:
              _a.sent();
              return [4 /*yield*/, this.fetchOwnerships()];
            case 3:
              _a.sent();
              return [3 /*break*/, 6];
            case 4:
              e_6 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_6);
              throw e_6;
            case 5:
              this.loading = false;
              return [7 /*endfinally*/];
            case 6:
              return [2 /*return*/];
          }
        });
      });
    },
    updateSharedOwnership: function (id, payload) {
      return __awaiter(this, void 0, void 0, function () {
        var e_7;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 4, 5, 6]);
              return [4 /*yield*/, api_1.peopleApi.updateSharedOwnership(id, payload)];
            case 2:
              _a.sent();
              return [4 /*yield*/, this.fetchOwnerships()];
            case 3:
              _a.sent();
              return [3 /*break*/, 6];
            case 4:
              e_7 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_7);
              throw e_7;
            case 5:
              this.loading = false;
              return [7 /*endfinally*/];
            case 6:
              return [2 /*return*/];
          }
        });
      });
    },
    deleteOwnership: function (id) {
      return __awaiter(this, void 0, void 0, function () {
        var e_8;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              this.loading = true;
              this.error = null;
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, 4, 5]);
              return [4 /*yield*/, api_1.peopleApi.deleteOwnership(id)];
            case 2:
              _a.sent();
              this.ownerships = this.ownerships.filter(function (o) {
                return o.id !== id;
              });
              return [3 /*break*/, 5];
            case 3:
              e_8 = _a.sent();
              this.error = (0, errors_1.toPeopleErrorMessage)(e_8);
              throw e_8;
            case 4:
              this.loading = false;
              return [7 /*endfinally*/];
            case 5:
              return [2 /*return*/];
          }
        });
      });
    },
  },
});
