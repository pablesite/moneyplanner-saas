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
Object.defineProperty(exports, '__esModule', { value: true });
/** @vitest-environment jsdom */
var vue_1 = require('vue');
var vitest_1 = require('vitest');
var test_utils_1 = require('@vue/test-utils');
var OwnershipManager_vue_1 = require('../OwnershipManager.vue');
var mockUsePeopleOwnerships = vitest_1.vi.fn();
vitest_1.vi.mock('@/domains/people/composables', function () {
  return {
    usePeopleOwnerships: function () {
      return mockUsePeopleOwnerships();
    },
  };
});
function makeState(overrides) {
  var _this = this;
  if (overrides === void 0) {
    overrides = {};
  }
  return __assign(
    {
      store: { loading: false, error: null },
      showModal: (0, vue_1.ref)(false),
      editId: (0, vue_1.ref)(null),
      successMessage: (0, vue_1.ref)(null),
      form: (0, vue_1.reactive)({ memberIds: [], percents: {} }),
      adults: (0, vue_1.computed)(function () {
        return [];
      }),
      canCreate: (0, vue_1.computed)(function () {
        return false;
      }),
      ownershipsSorted: (0, vue_1.computed)(function () {
        return [];
      }),
      ensureLoaded: vitest_1.vi.fn(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/];
          });
        });
      }),
      refreshOwnerships: vitest_1.vi.fn(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/];
          });
        });
      }),
      resetModal: vitest_1.vi.fn(),
      openCreate: vitest_1.vi.fn(),
      openEdit: vitest_1.vi.fn(),
      toggleMember: vitest_1.vi.fn(),
      setEqualSplit: vitest_1.vi.fn(),
      submit: vitest_1.vi.fn(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/];
          });
        });
      }),
      removeOwnership: vitest_1.vi.fn(function () {
        return __awaiter(_this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/];
          });
        });
      }),
    },
    overrides,
  );
}
(0, vitest_1.describe)('OwnershipManager', function () {
  (0, vitest_1.beforeEach)(function () {
    mockUsePeopleOwnerships.mockReset();
  });
  (0, vitest_1.it)('shows success and empty states', function () {
    mockUsePeopleOwnerships.mockReturnValue(
      makeState({
        successMessage: (0, vue_1.ref)('Titularidad compartida creada correctamente.'),
      }),
    );
    var wrapper = (0, test_utils_1.mount)(OwnershipManager_vue_1.default, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
          OwnershipLabel: { template: '<span>ownership</span>' },
        },
      },
    });
    (0, vitest_1.expect)(wrapper.text()).toContain('Titularidad compartida creada correctamente.');
    (0, vitest_1.expect)(wrapper.text()).toContain('No hay titularidades');
  });
  (0, vitest_1.it)('calls create action from header button', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUsePeopleOwnerships.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(OwnershipManager_vue_1.default, {
              global: {
                stubs: {
                  BaseModal: { template: '<div />' },
                  OwnershipLabel: { template: '<span>ownership</span>' },
                },
              },
            });
            return [4 /*yield*/, wrapper.get('button.btn.btn-primary').trigger('click')];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(state.openCreate).toHaveBeenCalled();
            (0, vitest_1.expect)(state.ensureLoaded).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
});
