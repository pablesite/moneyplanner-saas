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
var test_utils_1 = require('@vue/test-utils');
var vitest_1 = require('vitest');
var ItemForm_vue_1 = require('@/domains/net-worth/components/ItemForm.vue');
(0, vitest_1.describe)('ItemForm (saas)', function () {
  (0, vitest_1.it)(
    'submits normalized payload including ownership and financed asset',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var onSubmit,
          wrapper,
          selects,
          categorySelect,
          currencySelect,
          ownershipSelect,
          financedAssetSelect;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo pasivo',
                  categories: [{ value: 'other', label: 'Otros' }],
                  ownerships: [
                    {
                      id: 10,
                      kind: 'individual',
                      member: { id: 1, name: 'Pablo', role: 'adult' },
                      splits: [],
                      notes: '',
                    },
                  ],
                  assets: [{ id: 1, name: 'Auto', category: 'real_estate' }],
                  showFinancedAsset: true,
                  onSubmit: onSubmit,
                },
              });
              return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Caja')];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              (0, vitest_1.expect)(selects.length).toBeGreaterThanOrEqual(5);
              categorySelect = selects[0];
              currencySelect = selects[1];
              ownershipSelect = selects.find(function (s) {
                return s.text().includes('Selecciona titularidad');
              });
              financedAssetSelect = selects.find(function (s) {
                return s.text().includes('No financia');
              });
              return [4 /*yield*/, categorySelect.setValue('other')];
            case 2:
              _a.sent();
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 3:
              _a.sent();
              return [
                4 /*yield*/,
                wrapper.find('input[placeholder="Importe"]').setValue('1.234,56'),
              ];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 24"]').setValue('24')];
            case 5:
              _a.sent();
              return [4 /*yield*/, ownershipSelect.setValue('10')];
            case 6:
              _a.sent();
              return [4 /*yield*/, financedAssetSelect.setValue('1')];
            case 7:
              _a.sent();
              return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
            case 8:
              _a.sent();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 9:
              _a.sent();
              (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
                vitest_1.expect.objectContaining({
                  name: 'Caja',
                  category: 'other',
                  currency: 'EUR',
                  amount: '1234.56',
                  term_months: 24,
                  expected_end_date: vitest_1.expect.any(String),
                  ownership_id: 10,
                  financed_asset_id: 1,
                }),
              );
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('links term months and expected end date for liabilities', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, dateInputs;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo pasivo',
                categories: [{ value: 'other', label: 'Otros' }],
                ownerships: [],
                assets: [],
                showFinancedAsset: true,
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[type="date"]').setValue('2024-09-05')];
          case 1:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 24"]').setValue('24')];
          case 2:
            _a.sent();
            dateInputs = wrapper.findAll('input[type="date"]');
            (0, vitest_1.expect)(dateInputs[1].element.value).toBe('2026-09-05');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('shows amount validation errors', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'cash', label: 'Cash' }],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('12.3.4')];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(wrapper.text()).toContain('Importe inv');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'shows required field message and blocks submit when name is missing',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var onSubmit, wrapper, selects, currencySelect;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                  subcategories: [
                    { category: 'furnishings', value: 'technology', label: 'Tecnologia' },
                  ],
                  onSubmit: onSubmit,
                },
              });
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('furnishings')];
            case 1:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('technology')];
            case 2:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 3:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('10000')];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
            case 5:
              _a.sent();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 6:
              _a.sent();
              (0, vitest_1.expect)(onSubmit).not.toHaveBeenCalled();
              (0, vitest_1.expect)(wrapper.text()).toContain('Nombre obligatorio');
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)(
    'allows straight-line amortization without initial purchase value when amount is provided',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var onSubmit, wrapper, selects, currencySelect, amortizationMethodSelect, payload;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                  subcategories: [
                    { category: 'furnishings', value: 'technology', label: 'Tecnologia' },
                  ],
                  onSubmit: onSubmit,
                },
              });
              return [
                4 /*yield*/,
                wrapper.find('input[placeholder="Nombre"]').setValue('Portatil'),
              ];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('furnishings')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('technology')];
            case 3:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('1800')];
            case 5:
              _a.sent();
              amortizationMethodSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Sin amortizacion') && s.text().includes('Lineal');
              });
              return [4 /*yield*/, amortizationMethodSelect.setValue('straight_line')];
            case 6:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 10"]').setValue('4')];
            case 7:
              _a.sent();
              return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
            case 8:
              _a.sent();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 9:
              _a.sent();
              (0, vitest_1.expect)(onSubmit).toHaveBeenCalledTimes(1);
              payload = onSubmit.mock.calls[0][0];
              (0, vitest_1.expect)(payload.amount).toBe('1800');
              (0, vitest_1.expect)(payload.amortization_method).toBe('straight_line');
              (0, vitest_1.expect)(payload.amortization_term_years).toBe(4);
              (0, vitest_1.expect)(payload.initial_purchase_value).toBeUndefined();
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('shows degressive residual hint for sports equipment furnishings', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, selects;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                subcategories: [
                  {
                    category: 'furnishings',
                    value: 'sports_equipment',
                    label: 'Equipamiento deportivo',
                  },
                ],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Bici')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('furnishings')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('sports_equipment')];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(wrapper.text()).toContain(
              'decreciente + residual por subcategoria',
            );
            (0, vitest_1.expect)(wrapper.text()).toContain('suelo residual del 20%');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'does not render initial purchase value field for furnishings amortization',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, selects;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                  subcategories: [
                    { category: 'furnishings', value: 'vehicles', label: 'Vehiculos' },
                  ],
                  onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
                },
              });
              return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Coche')];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('furnishings')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('vehicles')];
            case 3:
              _a.sent();
              (0, vitest_1.expect)(wrapper.text()).not.toContain('Valor compra inicial');
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('forces non-amortized method for jewelry furnishings', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, selects, amortizationMethodSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                subcategories: [{ category: 'furnishings', value: 'jewelry', label: 'Joyeria' }],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Anillo')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('furnishings')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('jewelry')];
          case 3:
            _a.sent();
            amortizationMethodSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Sin amortizacion (joyeria)');
            });
            (0, vitest_1.expect)(amortizationMethodSelect.text()).not.toContain('Lineal');
            (0, vitest_1.expect)(amortizationMethodSelect.text()).not.toContain('Manual');
            (0, vitest_1.expect)(wrapper.text()).toContain(
              "En 'Joyeria' no se aplica amortizacion automatica.",
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('submits sports equipment without manual term years', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, currencySelect, amortizationMethodSelect, payload;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'furnishings', label: 'Mobiliario' }],
                subcategories: [
                  {
                    category: 'furnishings',
                    value: 'sports_equipment',
                    label: 'Equipamiento deportivo',
                  },
                ],
                onSubmit: onSubmit,
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Bici')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('furnishings')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('sports_equipment')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('1800')];
          case 5:
            _a.sent();
            amortizationMethodSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('decreciente + residual por subcategoria');
            });
            return [4 /*yield*/, amortizationMethodSelect.setValue('straight_line')];
          case 6:
            _a.sent();
            (0, vitest_1.expect)(wrapper.text()).not.toContain(
              'Plazo de amortizacion (anos) obligatorio',
            );
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 7:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledTimes(1);
            payload = onSubmit.mock.calls[0][0];
            (0, vitest_1.expect)(payload.amortization_method).toBe('straight_line');
            (0, vitest_1.expect)(payload.amortization_term_years).toBeUndefined();
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('requires deposit duration for short-term deposits', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, currencySelect, depositTermSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'cash', label: 'Liquidez' }],
                subcategories: [
                  {
                    category: 'cash',
                    value: 'short_term_deposit',
                    label: 'Deposito a corto plazo',
                  },
                ],
                onSubmit: onSubmit,
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('Deposito Facto'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('cash')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('short_term_deposit')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('10000')];
          case 5:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="TAE anual (%)"]').setValue('3')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 7:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).not.toHaveBeenCalled();
            (0, vitest_1.expect)(wrapper.text()).toContain('duracion del deposito');
            depositTermSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Selecciona duración');
            });
            return [4 /*yield*/, depositTermSelect.setValue('6')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'cash',
                subcategory: 'short_term_deposit',
                deposit_term_months: 6,
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('updates estimated average balance label with selected currency', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, selects, currencySelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'cash', label: 'Liquidez' }],
                subcategories: [
                  { category: 'cash', value: 'crypto_spot_earn', label: 'Spot/Earn Cripto' },
                ],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('Earn Binance'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('cash')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('crypto_spot_earn')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('USD')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="TAE anual (%)"]').setValue('5')];
          case 5:
            _a.sent();
            (0, vitest_1.expect)(wrapper.text()).toContain('Importe anual medio previsto (USD)');
            (0, vitest_1.expect)(wrapper.text()).not.toContain('Importe anual medio previsto (€)');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('submits primary home auto valuation parameters', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, currencySelect, modelSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                ],
                onSubmit: onSubmit,
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('real_estate')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('primary_home')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
          case 5:
            _a.sent();
            modelSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Automatica (suelo + construccion)');
            });
            return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 30"]').setValue('35')];
          case 7:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 3"]').setValue('4')];
          case 8:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 1"]').setValue('1.2')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'real_estate',
                subcategory: 'primary_home',
                valuation_model: 'real_estate_auto',
                land_value_share_percent: '35',
                land_annual_appreciation_percent: '4',
                building_annual_depreciation_percent: '1.2',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('submits primary home improvements along with auto valuation', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, currencySelect, modelSelect, dateInputs;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                ],
                onSubmit: onSubmit,
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('real_estate')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('primary_home')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
          case 5:
            _a.sent();
            modelSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Automatica (suelo + construccion)');
            });
            return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.ui-item-form-mini-btn').trigger('click')];
          case 7:
            _a.sent();
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Ej: Reforma cocina"]').setValue('Reforma cocina'),
            ];
          case 8:
            _a.sent();
            dateInputs = wrapper.findAll('input[type="date"]');
            return [4 /*yield*/, dateInputs[1].setValue('2025-06-01')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 12000"]').setValue('12000')];
          case 10:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 11:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 12:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                valuation_model: 'real_estate_auto',
                improvements: [
                  vitest_1.expect.objectContaining({
                    name: 'Reforma cocina',
                    reform_date: '2025-06-01',
                    amount: '12000',
                    amortization_method: 'none',
                  }),
                ],
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'uses default term years, disables capitalized interest with TAE 0, and shows discard label for new improvements',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, selects, currencySelect, modelSelect, reformAmortizationSelect, termInput;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                  subcategories: [
                    { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                  ],
                  onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
                },
              });
              return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('real_estate')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('primary_home')];
            case 3:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
            case 5:
              _a.sent();
              modelSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Automatica (suelo + construccion)');
              });
              return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
            case 6:
              _a.sent();
              return [4 /*yield*/, wrapper.find('button.ui-item-form-mini-btn').trigger('click')];
            case 7:
              _a.sent();
              reformAmortizationSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Sin amortizacion') && s.text().includes('Lineal');
              });
              return [4 /*yield*/, reformAmortizationSelect.setValue('straight_line')];
            case 8:
              _a.sent();
              termInput = wrapper.find('input[placeholder="Ej: 10"]');
              (0, vitest_1.expect)(termInput.element.value).toBe('10');
              (0, vitest_1.expect)(wrapper.text()).toContain(
                'Disponible solo cuando la TAE de financiacion es mayor que 0.',
              );
              (0, vitest_1.expect)(wrapper.text()).toContain('Descartar reforma');
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)(
    'autofills valuation parameters when selecting a profile and allows custom edits',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper,
          selects,
          currencySelect,
          modelSelect,
          profileSelect,
          landInput,
          growthInput,
          depreciationInput;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                  subcategories: [
                    { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                  ],
                  onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
                },
              });
              return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('real_estate')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('primary_home')];
            case 3:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
            case 5:
              _a.sent();
              modelSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Automatica (suelo + construccion)');
              });
              return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
            case 6:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 30"]').setValue('35')];
            case 7:
              _a.sent();
              profileSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Conservador') && s.text().includes('Personalizado');
              });
              return [4 /*yield*/, profileSelect.setValue('balanced')];
            case 8:
              _a.sent();
              landInput = wrapper.find('input[placeholder="Ej: 30"]');
              growthInput = wrapper.find('input[placeholder="Ej: 3"]');
              depreciationInput = wrapper.find('input[placeholder="Ej: 1"]');
              (0, vitest_1.expect)(landInput.element.value).toBe('35');
              (0, vitest_1.expect)(growthInput.element.value).toBe('6,8');
              (0, vitest_1.expect)(depreciationInput.element.value).toBe('0.3');
              return [4 /*yield*/, growthInput.setValue('7.1')];
            case 9:
              _a.sent();
              (0, vitest_1.expect)(profileSelect.element.value).toBe('custom');
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)(
    'detects conservative profile in edit mode when backend returns trailing zeros',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, profileSelect;
        return __generator(this, function (_a) {
          wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
            props: {
              title: 'Editar activo',
              mode: 'edit',
              categories: [{ value: 'real_estate', label: 'Inmuebles' }],
              subcategories: [
                { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
              ],
              onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              initial: {
                name: 'Casa',
                category: 'real_estate',
                subcategory: 'primary_home',
                amount: '91000',
                start_date: '2016-02-21',
                valuation_model: 'real_estate_auto',
                land_value_share_percent: '42.6',
                land_annual_appreciation_percent: '5.5',
                building_annual_depreciation_percent: '0.40',
                notes: '',
                currency: 'EUR',
                tracking_mode: 'manual',
                is_active: true,
              },
            },
          });
          profileSelect = wrapper.findAll('select').find(function (s) {
            return s.text().includes('Conservador') && s.text().includes('Personalizado');
          });
          (0, vitest_1.expect)(profileSelect.element.value).toBe('conservative');
          return [2 /*return*/];
        });
      });
    },
  );
  (0, vitest_1.it)('limits land share and land appreciation to one decimal', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, selects, currencySelect, modelSelect, landInput, growthInput;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                ],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('real_estate')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('primary_home')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
          case 5:
            _a.sent();
            modelSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Automatica (suelo + construccion)');
            });
            return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
          case 6:
            _a.sent();
            landInput = wrapper.find('input[placeholder="Ej: 30"]');
            growthInput = wrapper.find('input[placeholder="Ej: 3"]');
            return [4 /*yield*/, landInput.setValue('42.37')];
          case 7:
            _a.sent();
            return [4 /*yield*/, growthInput.setValue('7.58')];
          case 8:
            _a.sent();
            (0, vitest_1.expect)(landInput.element.value).toBe('42,3');
            (0, vitest_1.expect)(growthInput.element.value).toBe('7,5');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'allows typing intermediate decimal values in land appreciation input',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var wrapper, selects, currencySelect, modelSelect, growthInput;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                  subcategories: [
                    { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                  ],
                  onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
                },
              });
              return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Casa')];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('real_estate')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('primary_home')];
            case 3:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 4:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('100000')];
            case 5:
              _a.sent();
              modelSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Automatica (suelo + construccion)');
              });
              return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
            case 6:
              _a.sent();
              growthInput = wrapper.find('input[placeholder="Ej: 3"]');
              return [4 /*yield*/, growthInput.setValue('7.')];
            case 7:
              _a.sent();
              (0, vitest_1.expect)(growthInput.element.value).toBe('7,');
              return [4 /*yield*/, growthInput.setValue('7.5')];
            case 8:
              _a.sent();
              (0, vitest_1.expect)(growthInput.element.value).toBe('7,5');
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('does not require schedule fields for credit card liabilities', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo pasivo',
                categories: [{ value: 'credit_card', label: 'Tarjeta' }],
                showFinancedAsset: true,
                ownerships: [],
                onSubmit: onSubmit,
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('Tarjeta ECI'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('credit_card')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('EUR')];
          case 3:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('213')];
          case 4:
            _a.sent();
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="TAE anual (%)"]').setValue('19.5'),
            ];
          case 5:
            _a.sent();
            (0, vitest_1.expect)(wrapper.text()).not.toContain('Indica cuotas o fecha fin');
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 6:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 7:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'credit_card',
                amount: '213',
                annual_interest_tae: '19.5',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('submits mortgage cancellation forecast fields', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, cancellationToggle, dateInputs, cancellationDetails;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nueva hipoteca',
                categories: [{ value: 'mortgage', label: 'Hipoteca' }],
                showFinancedAsset: true,
                ownerships: [],
                onSubmit: onSubmit,
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('Hipoteca casa'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('mortgage')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('EUR')];
          case 3:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('120000')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 24"]').setValue('360')];
          case 5:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="0"]').setValue('2.5')];
          case 6:
            _a.sent();
            cancellationToggle = wrapper.findAll('input[type="checkbox"]').find(function (input) {
              var _a, _b;
              return (_b =
                (_a = input.element.closest('label')) === null || _a === void 0
                  ? void 0
                  : _a.textContent) === null || _b === void 0
                ? void 0
                : _b.includes('prevision de cancelacion');
            });
            return [4 /*yield*/, cancellationToggle.setValue(true)];
          case 7:
            _a.sent();
            dateInputs = wrapper.findAll('input[type="date"]');
            return [4 /*yield*/, dateInputs[2].setValue('2027-06-15')];
          case 8:
            _a.sent();
            cancellationDetails = wrapper.findAll('details').find(function (details) {
              return details.find('summary').text().includes('Prevision de cancelacion');
            });
            return [
              4 /*yield*/,
              cancellationDetails.find('input[placeholder="Opcional"]').setValue('450'),
            ];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'mortgage',
                cancellation_forecast_enabled: true,
                cancellation_date: '2027-06-15',
                cancellation_fee_amount: '450',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'maps non-habitual real estate usage to rental subcategory on submit',
    function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var onSubmit, wrapper, selects, usageSelect, currencySelect;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
              wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
                props: {
                  title: 'Nuevo activo',
                  categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                  subcategories: [
                    { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                    {
                      category: 'real_estate',
                      value: 'second_home',
                      label: 'Vivienda no habitual',
                    },
                    {
                      category: 'real_estate',
                      value: 'rental',
                      label: 'Vivienda no habitual (alquiler)',
                    },
                  ],
                  onSubmit: onSubmit,
                },
              });
              return [
                4 /*yield*/,
                wrapper.find('input[placeholder="Nombre"]').setValue('Apartamento playa'),
              ];
            case 1:
              _a.sent();
              selects = wrapper.findAll('select');
              return [4 /*yield*/, selects[0].setValue('real_estate')];
            case 2:
              _a.sent();
              return [4 /*yield*/, selects[1].setValue('second_home')];
            case 3:
              _a.sent();
              usageSelect = wrapper.findAll('select').find(function (s) {
                return s.text().includes('Propio') && s.text().includes('Alquiler');
              });
              return [4 /*yield*/, usageSelect.setValue('rental')];
            case 4:
              _a.sent();
              currencySelect = selects.find(function (s) {
                return s.text().includes('Selecciona moneda');
              });
              return [4 /*yield*/, currencySelect.setValue('EUR')];
            case 5:
              _a.sent();
              return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('120000')];
            case 6:
              _a.sent();
              return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
            case 7:
              _a.sent();
              return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
            case 8:
              _a.sent();
              (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
                vitest_1.expect.objectContaining({
                  category: 'real_estate',
                  subcategory: 'rental',
                }),
              );
              return [2 /*return*/];
          }
        });
      });
    },
  );
  (0, vitest_1.it)('allows auto valuation fields for non-habitual real estate', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, currencySelect, modelSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                  { category: 'real_estate', value: 'second_home', label: 'Vivienda no habitual' },
                  {
                    category: 'real_estate',
                    value: 'rental',
                    label: 'Vivienda no habitual (alquiler)',
                  },
                ],
                onSubmit: onSubmit,
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Atico')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('real_estate')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('second_home')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('200000')];
          case 5:
            _a.sent();
            modelSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Automatica (suelo + construccion)');
            });
            return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 30"]').setValue('40')];
          case 7:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 3"]').setValue('5')];
          case 8:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 1"]').setValue('1.1')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'real_estate',
                subcategory: 'second_home',
                valuation_model: 'real_estate_auto',
                land_value_share_percent: '40',
                land_annual_appreciation_percent: '5',
                building_annual_depreciation_percent: '1.1',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('defaults auto valuation profile to dynamic values', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var wrapper, selects, currencySelect, modelSelect, profileSelect;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'real_estate', label: 'Inmuebles' }],
                subcategories: [
                  { category: 'real_estate', value: 'primary_home', label: 'Vivienda habitual' },
                  { category: 'real_estate', value: 'second_home', label: 'Vivienda no habitual' },
                ],
                onSubmit: vitest_1.vi.fn().mockResolvedValue(undefined),
              },
            });
            return [4 /*yield*/, wrapper.find('input[placeholder="Nombre"]').setValue('Piso')];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('real_estate')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('second_home')];
          case 3:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 4:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('180000')];
          case 5:
            _a.sent();
            modelSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Automatica (suelo + construccion)');
            });
            return [4 /*yield*/, modelSelect.setValue('real_estate_auto')];
          case 6:
            _a.sent();
            profileSelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Dinamico') && s.text().includes('Personalizado');
            });
            (0, vitest_1.expect)(profileSelect.element.value).toBe('dynamic');
            (0, vitest_1.expect)(wrapper.find('input[placeholder="Ej: 3"]').element.value).toBe(
              '8',
            );
            (0, vitest_1.expect)(wrapper.find('input[placeholder="Ej: 1"]').element.value).toBe(
              '0.2',
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('submits periodic contribution fields for investment assets', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, modeSelect, currencySelect, dateInputs;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'investments', label: 'Inversiones' }],
                subcategories: [{ category: 'investments', value: 'funds', label: 'Fondos' }],
                onSubmit: onSubmit,
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('Reserva vivienda'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('investments')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('funds')];
          case 3:
            _a.sent();
            modeSelect = wrapper.findAll('select').find(function (s) {
              return (
                s.text().includes('Aportacion unica') && s.text().includes('Aportacion periodica')
              );
            });
            return [4 /*yield*/, modeSelect.setValue('periodic_contribution')];
          case 4:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 5:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('5000')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 500"]').setValue('300')];
          case 7:
            _a.sent();
            dateInputs = wrapper.findAll('input[type="date"]');
            return [4 /*yield*/, dateInputs[0].setValue('2026-01-15')];
          case 8:
            _a.sent();
            return [4 /*yield*/, dateInputs[1].setValue('2027-12-15')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                category: 'investments',
                investment_contribution_mode: 'periodic_contribution',
                expected_end_date: '2027-12-15',
                monthly_contribution_amount: '300',
                investment_contribution_frequency: 'monthly',
                amount: '5000',
                initial_purchase_value: '5000',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('allows indefinite periodic investment with weekly contribution', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var onSubmit, wrapper, selects, modeSelect, frequencySelect, currencySelect, dateInputs;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            onSubmit = vitest_1.vi.fn().mockResolvedValue(undefined);
            wrapper = (0, test_utils_1.mount)(ItemForm_vue_1.default, {
              props: {
                title: 'Nuevo activo',
                categories: [{ value: 'investments', label: 'Inversiones' }],
                subcategories: [{ category: 'investments', value: 'etfs', label: 'ETFs' }],
                onSubmit: onSubmit,
              },
            });
            return [
              4 /*yield*/,
              wrapper.find('input[placeholder="Nombre"]').setValue('ETF Physical Gold'),
            ];
          case 1:
            _a.sent();
            selects = wrapper.findAll('select');
            return [4 /*yield*/, selects[0].setValue('investments')];
          case 2:
            _a.sent();
            return [4 /*yield*/, selects[1].setValue('etfs')];
          case 3:
            _a.sent();
            modeSelect = wrapper.findAll('select').find(function (s) {
              return (
                s.text().includes('Aportacion unica') && s.text().includes('Aportacion periodica')
              );
            });
            return [4 /*yield*/, modeSelect.setValue('periodic_contribution')];
          case 4:
            _a.sent();
            frequencySelect = wrapper.findAll('select').find(function (s) {
              return s.text().includes('Mensual') && s.text().includes('Semanal');
            });
            return [4 /*yield*/, frequencySelect.setValue('weekly')];
          case 5:
            _a.sent();
            currencySelect = selects.find(function (s) {
              return s.text().includes('Selecciona moneda');
            });
            return [4 /*yield*/, currencySelect.setValue('EUR')];
          case 6:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Importe"]').setValue('1645.99')];
          case 7:
            _a.sent();
            return [4 /*yield*/, wrapper.find('input[placeholder="Ej: 500"]').setValue('137.4')];
          case 8:
            _a.sent();
            dateInputs = wrapper.findAll('input[type="date"]');
            return [4 /*yield*/, dateInputs[0].setValue('2026-03-06')];
          case 9:
            _a.sent();
            return [4 /*yield*/, wrapper.find('button.btn-primary').trigger('click')];
          case 10:
            _a.sent();
            return [4 /*yield*/, (0, test_utils_1.flushPromises)()];
          case 11:
            _a.sent();
            (0, vitest_1.expect)(onSubmit).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({
                investment_contribution_mode: 'periodic_contribution',
                investment_contribution_frequency: 'weekly',
                expected_end_date: undefined,
                monthly_contribution_amount: '137.4',
              }),
            );
            return [2 /*return*/];
        }
      });
    });
  });
});
