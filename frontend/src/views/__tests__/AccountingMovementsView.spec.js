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
var vitest_1 = require('vitest');
var test_utils_1 = require('@vue/test-utils');
var vue_1 = require('vue');
var AccountingMovementsView_vue_1 = require('../AccountingMovementsView.vue');
var mockUseAccountingMovementsPage = vitest_1.vi.fn();
vitest_1.vi.mock('@/domains/accounting', function () {
  return {
    useAccountingPage: function () {
      return mockUseAccountingMovementsPage();
    },
  };
});
function makeState(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  return __assign(
    {
      loading: (0, vue_1.ref)(false),
      accountCreationLoading: (0, vue_1.ref)(false),
      accountActivationLoading: (0, vue_1.ref)(false),
      transactionCreationLoading: (0, vue_1.ref)(false),
      importPreviewLoading: (0, vue_1.ref)(false),
      importCommitLoading: (0, vue_1.ref)(false),
      error: (0, vue_1.ref)(null),
      successMessage: (0, vue_1.ref)(null),
      accounts: (0, vue_1.ref)([
        {
          id: 1,
          name: 'Cuenta corriente',
          account_type: 'asset',
          currency: 'EUR',
          origin: 'user',
          asset_id: 91,
          liability_id: null,
          is_active: true,
          notes: '',
          current_balance: '2100.00',
          created_at: '',
          updated_at: '',
        },
        {
          id: 2,
          name: 'Ingresos sistema',
          account_type: 'income',
          currency: 'EUR',
          origin: 'system',
          asset_id: null,
          liability_id: null,
          is_active: true,
          notes: '',
          current_balance: '2100.00',
          created_at: '',
          updated_at: '',
        },
      ]),
      transactions: (0, vue_1.ref)([
        {
          id: 7,
          booking_date: '2026-03-15',
          value_date: '2026-03-15',
          description: 'Nomina marzo',
          status: 'posted',
          origin: 'manual',
          notes: '',
          created_at: '',
          updated_at: '',
          entries: [
            {
              id: 1,
              account_id: 1,
              account_name: 'Cuenta corriente',
              side: 'debit',
              amount: '2100.00',
              currency: 'EUR',
              flow_family: 'income',
              category_key: 'salary',
              subcategory_key: 'employee_salary',
              annual_income_entry_id: 11,
              annual_expense_entry_id: null,
              asset_id: null,
              liability_id: null,
              notes: '',
              created_at: '',
              updated_at: '',
            },
          ],
        },
      ]),
      accountBalancesSummary: (0, vue_1.ref)({
        filters: { year: 2026, month: 3, account_type: 'asset', status: 'posted' },
        totals_by_account_type: { asset: '2100.00' },
        accounts: [
          {
            account_id: 1,
            name: 'Cuenta corriente',
            account_type: 'asset',
            currency: 'EUR',
            origin: 'user',
            current_balance: '2100.00',
            period_debit_total: '2100.00',
            period_credit_total: '0.00',
            period_net_change: '2100.00',
          },
        ],
      }),
      moneyWizImportPreview: (0, vue_1.ref)(null),
      moneyWizImportCommitResult: (0, vue_1.ref)(null),
      selectedYear: (0, vue_1.computed)({
        get: function () {
          return 2026;
        },
        set: function () {
          return undefined;
        },
      }),
      selectedMonth: (0, vue_1.computed)({
        get: function () {
          return 3;
        },
        set: function () {
          return undefined;
        },
      }),
      yearOptions: (0, vue_1.computed)(function () {
        return [2026];
      }),
      monthOptions: [
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
      ],
      accountTypeOptions: [
        { value: 'asset', label: 'Activo' },
        { value: 'liability', label: 'Pasivo' },
        { value: 'equity', label: 'Patrimonio neto contable' },
        { value: 'income', label: 'Ingreso' },
        { value: 'expense', label: 'Gasto' },
      ],
      manualPositionTypeOptions: [
        { value: 'asset', label: 'Activo manual' },
        { value: 'liability', label: 'Pasivo manual' },
      ],
      quickMovementTypeOptions: [
        { value: 'income', label: 'Ingreso' },
        { value: 'expense', label: 'Gasto' },
        { value: 'transfer', label: 'Transferencia' },
        { value: 'investment_purchase', label: 'Compra inversion' },
        { value: 'debt_payment', label: 'Pago deuda' },
      ],
      editMovementTypeOptions: [
        { value: 'income', label: 'Ingreso' },
        { value: 'expense', label: 'Gasto' },
        { value: 'transfer', label: 'Transferencia' },
        { value: 'investment_purchase', label: 'Inversion' },
        { value: 'debt_payment', label: 'Deuda' },
        { value: 'balance_adjustment', label: 'Ajuste' },
      ],
      editAccountOptions: (0, vue_1.computed)(function () {
        return [{ id: 1, name: 'Cuenta corriente', currency: 'EUR', account_type: 'asset' }];
      }),
      editCounterpartyOptions: (0, vue_1.computed)(function () {
        return [];
      }),
      editCounterpartyMissingHint: (0, vue_1.computed)(function () {
        return '';
      }),
      editKindNeedsCounterparty: (0, vue_1.computed)(function () {
        return false;
      }),
      editKindNeedsClassification: (0, vue_1.computed)(function () {
        return true;
      }),
      editCounterpartyLabel: (0, vue_1.computed)(function () {
        return 'Contracuenta';
      }),
      editSelectedAccountCurrentBalance: (0, vue_1.computed)(function () {
        return '2100.00';
      }),
      editCategoryOptions: (0, vue_1.computed)(function () {
        return [{ value: 'salary', label: 'Salarios y trabajo' }];
      }),
      editSubcategoryOptions: (0, vue_1.computed)(function () {
        return [{ value: 'employee_salary', label: 'Nomina' }];
      }),
      accountForm: {
        name: '',
        account_type: 'asset',
        currency: 'EUR',
        origin: 'user',
        notes: '',
      },
      activationForm: {
        position_type: 'asset',
        position_id: null,
      },
      moneyWizImportFile: (0, vue_1.ref)(null),
      quickEntryForm: {
        movement_type: 'expense',
        booking_date: '2026-03-15',
        value_date: '2026-03-15',
        description: 'Compra semanal',
        amount: '100.00',
        account_id: 1,
        counterparty_account_id: null,
        liability_account_id: null,
        interest_account_id: null,
        principal_amount: '',
        interest_amount: '',
        flow_family: 'expense',
        category_key: 'consumption_expenses',
        subcategory_key: 'living_expenses',
        annual_income_entry_id: null,
        annual_expense_entry_id: null,
        notes: '',
      },
      transactionForm: {
        booking_date: '2026-03-15',
        value_date: '2026-03-15',
        description: '',
        status: 'posted',
        origin: 'manual',
        notes: '',
        entries: [
          {
            key: 1,
            account_id: 1,
            side: 'debit',
            amount: '100.00',
            currency: 'EUR',
            notes: '',
          },
          {
            key: 2,
            account_id: 1,
            side: 'credit',
            amount: '100.00',
            currency: 'EUR',
            notes: '',
          },
        ],
      },
      editTransactionForm: {
        booking_date: '2026-03-15',
        value_date: '2026-03-15',
        booking_time: '12:00',
        description: 'Nomina marzo',
        notes: '',
        account_id: 1,
        counterparty_account_id: null,
        amount: '2100.00',
        currency: 'EUR',
        kind: 'income',
        initial_kind: 'income',
        category_key: 'salary',
        subcategory_key: 'employee_salary',
        kind_label: 'Ingreso',
      },
      debitTotal: (0, vue_1.computed)(function () {
        return 100;
      }),
      creditTotal: (0, vue_1.computed)(function () {
        return 100;
      }),
      activityFilters: {
        query: '',
        accountId: 'all',
        kind: 'all',
      },
      liquidityAccounts: (0, vue_1.computed)(function () {
        return [
          {
            id: 1,
            name: 'Cuenta corriente',
            account_type: 'asset',
            currency: 'EUR',
          },
        ];
      }),
      accountPositionMetaByAccountId: (0, vue_1.computed)(function () {
        return new Map();
      }),
      availableManualPositionOptions: (0, vue_1.computed)(function () {
        return [
          {
            id: 91,
            name: 'Broker manual',
            category: 'cash',
            currency: 'EUR',
          },
        ];
      }),
      accountDisplayName: vitest_1.vi.fn(function (account) {
        return account.name;
      }),
      hasAvailableManualPositions: (0, vue_1.computed)(function () {
        return true;
      }),
      liquidityBalanceRows: (0, vue_1.computed)(function () {
        return [
          {
            account_id: 1,
            name: 'Cuenta corriente',
            account_type: 'asset',
            currency: 'EUR',
            origin: 'user',
            current_balance: '2100.00',
            period_debit_total: '2100.00',
            period_credit_total: '0.00',
            period_net_change: '2100.00',
          },
        ];
      }),
      liquidityBalanceTotal: (0, vue_1.computed)(function () {
        return 2100;
      }),
      incomeOptions: (0, vue_1.computed)(function () {
        return [{ id: 11, name: 'Nomina' }];
      }),
      expenseOptions: (0, vue_1.computed)(function () {
        return [{ id: 22, name: 'Supermercado' }];
      }),
      annualIncomeOptionsCompatible: (0, vue_1.computed)(function () {
        return [{ id: 11, name: 'Nomina' }];
      }),
      annualExpenseOptionsCompatible: (0, vue_1.computed)(function () {
        return [{ id: 22, name: 'Supermercado' }];
      }),
      quickEntryNeedsClassification: (0, vue_1.computed)(function () {
        return true;
      }),
      quickCategoryOptions: (0, vue_1.computed)(function () {
        return [{ value: 'salary', label: 'Salarios y trabajo' }];
      }),
      quickSubcategoryOptions: (0, vue_1.computed)(function () {
        return [{ value: 'employee_salary', label: 'Nomina' }];
      }),
      transferCounterpartyOptions: (0, vue_1.computed)(function () {
        return [];
      }),
      investmentCounterpartyOptions: (0, vue_1.computed)(function () {
        return [];
      }),
      liabilityCounterpartyOptions: (0, vue_1.computed)(function () {
        return [];
      }),
      debtInterestOptions: (0, vue_1.computed)(function () {
        return [];
      }),
      quickEntryReady: (0, vue_1.computed)(function () {
        return true;
      }),
      editEntryReady: (0, vue_1.computed)(function () {
        return true;
      }),
      transactionBalanced: (0, vue_1.computed)(function () {
        return true;
      }),
      summaryRows: (0, vue_1.computed)(function () {
        return [
          {
            month: 3,
            income_total: '2100.00',
            expense_total: '700.00',
            uncategorized_total: '0.00',
            incomeValue: 2100,
            expenseValue: 700,
            uncategorizedValue: 0,
          },
        ];
      }),
      filteredTransactions: (0, vue_1.computed)(function () {
        return [
          {
            id: 7,
            booking_date: '2026-03-15',
            value_date: '2026-03-15',
            description: 'Nomina marzo',
            status: 'posted',
            origin: 'manual',
            notes: '',
            created_at: '',
            updated_at: '',
            entries: [
              {
                id: 1,
                account_id: 1,
                account_name: 'Cuenta corriente',
                side: 'debit',
                amount: '2100.00',
                currency: 'EUR',
                flow_family: 'income',
                category_key: 'salary',
                subcategory_key: 'employee_salary',
                annual_income_entry_id: 11,
                annual_expense_entry_id: null,
                asset_id: null,
                liability_id: null,
                notes: '',
                created_at: '',
                updated_at: '',
              },
            ],
          },
        ];
      }),
      addEntry: vitest_1.vi.fn(),
      activityKindLabel: vitest_1.vi.fn(function () {
        return 'Ingreso';
      }),
      removeEntry: vitest_1.vi.fn(),
      reloadPeriod: vitest_1.vi.fn(),
      activateNetWorthPosition: vitest_1.vi.fn(),
      activateNetWorthPositions: vitest_1.vi.fn(),
      removeNetWorthTracking: vitest_1.vi.fn(),
      refreshManualPositionOptions: vitest_1.vi.fn(),
      submitAccount: vitest_1.vi.fn(),
      setMoneyWizImportFile: vitest_1.vi.fn(),
      previewMoneyWizImport: vitest_1.vi.fn(),
      commitMoneyWizImport: vitest_1.vi.fn(),
      deleteAccount: vitest_1.vi.fn(),
      deleteTransaction: vitest_1.vi.fn(),
      openTransactionForEditing: vitest_1.vi.fn(function () {
        return true;
      }),
      submitQuickEntry: vitest_1.vi.fn(),
      submitEditedTransaction: vitest_1.vi.fn(),
      submitTransaction: vitest_1.vi.fn(),
    },
    overrides,
  );
}
(0, vitest_1.describe)('AccountingMovementsView', function () {
  (0, vitest_1.beforeEach)(function () {
    mockUseAccountingMovementsPage.mockReset();
  });
  (0, vitest_1.it)('renders accounting workspace with accounts and transactions', function () {
    mockUseAccountingMovementsPage.mockReturnValue(makeState());
    var wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
    (0, vitest_1.expect)(wrapper.text()).toContain('Libro diario operativo');
    (0, vitest_1.expect)(wrapper.text()).toContain('Cuenta corriente');
    (0, vitest_1.expect)(wrapper.text()).toContain('Nomina marzo');
    (0, vitest_1.expect)(wrapper.text()).toContain('Cuentas + historico por cuenta');
    (0, vitest_1.expect)(wrapper.text()).toContain('Saldo neto contable');
    (0, vitest_1.expect)(wrapper.text()).toContain('Activo contable - Pasivo contable');
    (0, vitest_1.expect)(wrapper.text()).not.toContain('Saldos derivados del ledger');
    (0, vitest_1.expect)(wrapper.text()).not.toContain('Entradas');
    (0, vitest_1.expect)(wrapper.text()).not.toContain('Salidas');
    (0, vitest_1.expect)(wrapper.find('button[title="Activar tracking contable"]').exists()).toBe(
      true,
    );
    (0, vitest_1.expect)(wrapper.find('button[title="Importar CSV MoneyWiz"]').exists()).toBe(true);
    (0, vitest_1.expect)(wrapper.find('button[title="Registrar movimiento diario"]').exists()).toBe(
      true,
    );
  });
  (0, vitest_1.it)('shows empty state and error message when needed', function () {
    mockUseAccountingMovementsPage.mockReturnValue(
      makeState({
        error: (0, vue_1.ref)('La transaccion no esta balanceada.'),
        accounts: (0, vue_1.ref)([]),
        transactions: (0, vue_1.ref)([]),
        filteredTransactions: (0, vue_1.computed)(function () {
          return [];
        }),
      }),
    );
    var wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
    (0, vitest_1.expect)(wrapper.text()).toContain('La transaccion no esta balanceada.');
    (0, vitest_1.expect)(wrapper.text()).toContain(
      'Sin cuentas operativas para el periodo seleccionado.',
    );
  });
  (0, vitest_1.it)('opens the quick-entry modal and submits from there', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper, modalForm;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default, {
              attachTo: document.body,
            });
            return [
              4 /*yield*/,
              wrapper.find('button[title="Registrar movimiento diario"]').trigger('click'),
            ];
          case 1:
            _a.sent();
            modalForm = document.body.querySelector(
              'form.ui-accounting-modal-form.ui-accounting-transaction-form',
            );
            modalForm === null || modalForm === void 0
              ? void 0
              : modalForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(state.submitQuickEntry).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('opens the MoneyWiz import modal and triggers preview', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper, previewButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default, {
              attachTo: document.body,
            });
            return [
              4 /*yield*/,
              wrapper.find('button[title="Importar CSV MoneyWiz"]').trigger('click'),
            ];
          case 1:
            _a.sent();
            previewButton = Array.from(document.body.querySelectorAll('button')).find(
              function (button) {
                var _a;
                return (_a = button.textContent) === null || _a === void 0
                  ? void 0
                  : _a.includes('Generar preview');
              },
            );
            previewButton === null || previewButton === void 0 ? void 0 : previewButton.click();
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(state.previewMoneyWizImport).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('shows filter controls and derived transaction label', function () {
    mockUseAccountingMovementsPage.mockReturnValue(makeState());
    var wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
    (0, vitest_1.expect)(
      wrapper.find('input[placeholder="Filtrar por texto o cuenta"]').exists(),
    ).toBe(true);
    (0, vitest_1.expect)(wrapper.text()).toContain('Ingreso');
  });
  (0, vitest_1.it)('opens movement edit modal from timeline and submits changes', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper, editButton, editForm;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default, {
              attachTo: document.body,
            });
            editButton = wrapper.find('button[aria-label="Editar movimiento"]');
            return [
              4 /*yield*/,
              editButton === null || editButton === void 0 ? void 0 : editButton.trigger('click'),
            ];
          case 1:
            _a.sent();
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(state.openTransactionForEditing).toHaveBeenCalledWith(7);
            editForm = document.body.querySelector(
              'form.ui-accounting-modal-form.ui-accounting-transaction-form',
            );
            editForm === null || editForm === void 0
              ? void 0
              : editForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 3:
            _a.sent();
            (0, vitest_1.expect)(state.submitEditedTransaction).toHaveBeenCalled();
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('deletes movement from timeline', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper, deleteButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
            deleteButton = wrapper.find('button[aria-label="Eliminar movimiento"]');
            return [
              4 /*yield*/,
              deleteButton === null || deleteButton === void 0
                ? void 0
                : deleteButton.trigger('click'),
            ];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(state.deleteTransaction).toHaveBeenCalledWith(7, 'Nomina marzo');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)(
    'marks account timeline movement in green when it increases balance',
    function () {
      mockUseAccountingMovementsPage.mockReturnValue(makeState());
      var wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
      var details = wrapper.find('.ui-accounting-account-timeline');
      details.element.setAttribute('open', '');
      var firstDelta = wrapper.find('.ui-accounting-account-timeline .ui-accounting-balance-delta');
      (0, vitest_1.expect)(firstDelta.exists()).toBe(true);
      (0, vitest_1.expect)(firstDelta.classes()).toContain('ui-accounting-balance-delta-positive');
    },
  );
  (0, vitest_1.it)(
    'shows transfer impact in red for origin and green for destination',
    function () {
      mockUseAccountingMovementsPage.mockReturnValue(
        makeState({
          accounts: (0, vue_1.ref)([
            {
              id: 1,
              name: 'Cuenta origen',
              account_type: 'asset',
              currency: 'EUR',
              origin: 'user',
              asset_id: null,
              liability_id: null,
              is_active: true,
              notes: '',
              current_balance: '900.00',
              created_at: '',
              updated_at: '',
            },
            {
              id: 3,
              name: 'Cuenta destino',
              account_type: 'asset',
              currency: 'EUR',
              origin: 'user',
              asset_id: null,
              liability_id: null,
              is_active: true,
              notes: '',
              current_balance: '1200.00',
              created_at: '',
              updated_at: '',
            },
          ]),
          filteredTransactions: (0, vue_1.computed)(function () {
            return [
              {
                id: 9,
                booking_date: '2026-03-17',
                value_date: '2026-03-17',
                description: 'Transferencia interna',
                status: 'posted',
                origin: 'manual',
                notes: '',
                created_at: '',
                updated_at: '',
                entries: [
                  {
                    id: 11,
                    account_id: 1,
                    account_name: 'Cuenta origen',
                    side: 'credit',
                    amount: '100.00',
                    currency: 'EUR',
                    flow_family: '',
                    category_key: '',
                    subcategory_key: '',
                    annual_income_entry_id: null,
                    annual_expense_entry_id: null,
                    asset_id: null,
                    liability_id: null,
                    notes: '',
                    created_at: '',
                    updated_at: '',
                  },
                  {
                    id: 12,
                    account_id: 3,
                    account_name: 'Cuenta destino',
                    side: 'debit',
                    amount: '100.00',
                    currency: 'EUR',
                    flow_family: '',
                    category_key: '',
                    subcategory_key: '',
                    annual_income_entry_id: null,
                    annual_expense_entry_id: null,
                    asset_id: null,
                    liability_id: null,
                    notes: '',
                    created_at: '',
                    updated_at: '',
                  },
                ],
              },
            ];
          }),
          activityKindLabel: vitest_1.vi.fn(function () {
            return 'Transferencia';
          }),
        }),
      );
      var wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
      wrapper.findAll('.ui-accounting-account-timeline').forEach(function (detail) {
        detail.element.setAttribute('open', '');
      });
      var originCard = wrapper.findAll('.ui-accounting-account-timeline').find(function (card) {
        return card.text().includes('Cuenta origen');
      });
      var destinationCard = wrapper
        .findAll('.ui-accounting-account-timeline')
        .find(function (card) {
          return card.text().includes('Cuenta destino');
        });
      (0, vitest_1.expect)(originCard).toBeTruthy();
      (0, vitest_1.expect)(destinationCard).toBeTruthy();
      (0, vitest_1.expect)(
        originCard === null || originCard === void 0
          ? void 0
          : originCard.find('.ui-accounting-balance-delta').classes(),
      ).toContain('ui-accounting-balance-delta-negative');
      (0, vitest_1.expect)(
        destinationCard === null || destinationCard === void 0
          ? void 0
          : destinationCard.find('.ui-accounting-balance-delta').classes(),
      ).toContain('ui-accounting-balance-delta-positive');
    },
  );
  (0, vitest_1.it)('opens the activation modal and allows batch activation', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, wrapper, checkbox, activationForm;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default, {
              attachTo: document.body,
            });
            return [
              4 /*yield*/,
              wrapper.find('button[title="Activar tracking contable"]').trigger('click'),
            ];
          case 1:
            _a.sent();
            checkbox = document.body.querySelector('input.ui-accounting-activation-checkbox');
            checkbox === null || checkbox === void 0 ? void 0 : checkbox.click();
            activationForm =
              checkbox === null || checkbox === void 0 ? void 0 : checkbox.closest('form');
            activationForm === null || activationForm === void 0
              ? void 0
              : activationForm.dispatchEvent(
                  new Event('submit', { bubbles: true, cancelable: true }),
                );
            return [4 /*yield*/, wrapper.vm.$nextTick()];
          case 2:
            _a.sent();
            (0, vitest_1.expect)(state.activateNetWorthPositions).toHaveBeenCalledWith(
              'asset',
              [91],
            );
            (0, vitest_1.expect)(wrapper.text()).toContain('Patrimonio neto contable');
            (0, vitest_1.expect)(wrapper.text()).toContain('Contrapartidas tecnicas del sistema');
            return [2 /*return*/];
        }
      });
    });
  });
  (0, vitest_1.it)('allows removing accounting tracking for linked positions', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var state, confirmSpy, wrapper, untrackButton;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            state = makeState();
            mockUseAccountingMovementsPage.mockReturnValue(state);
            confirmSpy = vitest_1.vi.spyOn(window, 'confirm').mockReturnValue(true);
            wrapper = (0, test_utils_1.mount)(AccountingMovementsView_vue_1.default);
            untrackButton = wrapper.find('button[title="Quitar tracking de patrimonio"]');
            return [
              4 /*yield*/,
              untrackButton === null || untrackButton === void 0
                ? void 0
                : untrackButton.trigger('click'),
            ];
          case 1:
            _a.sent();
            (0, vitest_1.expect)(state.removeNetWorthTracking).toHaveBeenCalledWith(
              vitest_1.expect.objectContaining({ id: 1, asset_id: 91 }),
            );
            confirmSpy.mockRestore();
            return [2 /*return*/];
        }
      });
    });
  });
});
