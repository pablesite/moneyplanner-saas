'use strict';
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
var vitest_1 = require('vitest');
var test_utils_1 = require('@vue/test-utils');
var ItemDisplayRow_vue_1 = require('../ItemDisplayRow.vue');
(0, vitest_1.describe)('ItemDisplayRow', function () {
  (0, vitest_1.it)('renders main item data', function () {
    var wrapper = (0, test_utils_1.mount)(ItemDisplayRow_vue_1.default, {
      props: {
        item: { id: 7, name: 'Cuenta corriente', is_active: true, currency: 'EUR' },
        formattedAmount: '1,000.00',
        isLiabilitiesList: false,
        financedAssetName: null,
      },
    });
    (0, vitest_1.expect)(wrapper.text()).toContain('Cuenta corriente');
    (0, vitest_1.expect)(wrapper.text()).toContain('1,000.00');
  });
  (0, vitest_1.it)('emits edit, archive and delete events with item id', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemDisplayRow_vue_1.default, {
              props: {
                item: { id: 11, name: 'Hipoteca', is_active: false, currency: 'EUR' },
                formattedAmount: '800.00',
                isLiabilitiesList: true,
                financedAssetName: 'Casa',
                ownershipLabel: 'Ana',
                sharePercent: 50,
              },
            });
            return [4 /*yield*/, wrapper.get('button[aria-label="Editar"]').trigger('click')];
          case 1:
            _d.sent();
            return [4 /*yield*/, wrapper.get('button[aria-label="Archivar"]').trigger('click')];
          case 2:
            _d.sent();
            return [4 /*yield*/, wrapper.get('button[aria-label="Eliminar"]').trigger('click')];
          case 3:
            _d.sent();
            (0, vitest_1.expect)(
              (_a = wrapper.emitted('edit')) === null || _a === void 0 ? void 0 : _a[0],
            ).toEqual([11]);
            (0, vitest_1.expect)(
              (_b = wrapper.emitted('archive')) === null || _b === void 0 ? void 0 : _b[0],
            ).toEqual([11]);
            (0, vitest_1.expect)(
              (_c = wrapper.emitted('delete')) === null || _c === void 0 ? void 0 : _c[0],
            ).toEqual([11]);
            (0, vitest_1.expect)(wrapper.text()).toContain('Financia: Casa');
            return [2 /*return*/];
        }
      });
    });
  });
});
