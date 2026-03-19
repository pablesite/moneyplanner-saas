'use strict';
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
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
var _a, _b;
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var BaseModal_vue_1 = require('@/domains/ui/components/BaseModal.vue');
var composables_1 = require('@/domains/people/composables');
var OwnershipLabel_vue_1 = require('@/domains/people/components/OwnershipLabel.vue');
var _c = (0, composables_1.usePeopleOwnerships)(),
  store = _c.store,
  showModal = _c.showModal,
  editId = _c.editId,
  successMessage = _c.successMessage,
  form = _c.form,
  adults = _c.adults,
  canCreate = _c.canCreate,
  ownershipsSorted = _c.ownershipsSorted,
  ensureLoaded = _c.ensureLoaded,
  refreshOwnerships = _c.refreshOwnerships,
  resetModal = _c.resetModal,
  openCreate = _c.openCreate,
  openEdit = _c.openEdit,
  toggleMember = _c.toggleMember,
  setEqualSplit = _c.setEqualSplit,
  submit = _c.submit,
  removeOwnership = _c.removeOwnership;
(0, vue_1.onMounted)(function () {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, ensureLoaded()];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.store.error) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'alert ui-people-alert' }));
  /** @type {__VLS_StyleScopedClasses['alert']} */ /** @type {__VLS_StyleScopedClasses['ui-people-alert']} */ __VLS_ctx
    .store.error;
}
if (__VLS_ctx.successMessage) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-alert-success' }));
  /** @type {__VLS_StyleScopedClasses['ui-alert-success']} */ __VLS_ctx.successMessage;
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.section,
  __VLS_intrinsics.section,
)(__assign({ class: 'section card' }));
/** @type {__VLS_StyleScopedClasses['section']} */ /** @type {__VLS_StyleScopedClasses['card']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'card-header' }));
/** @type {__VLS_StyleScopedClasses['card-header']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h2,
  __VLS_intrinsics.h2,
)(__assign({ class: 'card-header-title' }));
/** @type {__VLS_StyleScopedClasses['card-header-title']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-people-header-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-people-header-actions']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(
    __assign(
      {
        onClick: function () {
          var _a = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
          }
          var $event = _a[0];
          __VLS_ctx.refreshOwnerships();
          // @ts-ignore
          [store, store, successMessage, successMessage, refreshOwnerships];
        },
      },
      { class: 'btn' },
    ),
    { type: 'button', disabled: __VLS_ctx.store.loading },
  ),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(__assign({ onClick: __VLS_ctx.openCreate }, { class: 'btn btn-primary' }), {
    type: 'button',
    disabled: __VLS_ctx.store.loading,
  }),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.table,
  __VLS_intrinsics.table,
)(__assign({ class: 'ui-data-table' }));
/** @type {__VLS_StyleScopedClasses['ui-data-table']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.thead,
  __VLS_intrinsics.thead,
)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.th, __VLS_intrinsics.th)({});
__VLS_asFunctionalElement1(
  __VLS_intrinsics.th,
  __VLS_intrinsics.th,
)(__assign({ class: 'ui-data-table-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-data-table-actions']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.tbody,
  __VLS_intrinsics.tbody,
)({});
var _loop_1 = function (o) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.tr,
    __VLS_intrinsics.tr,
  )({
    key: o.id,
  });
  __VLS_asFunctionalElement1(__VLS_intrinsics.td, __VLS_intrinsics.td)({});
  var __VLS_0 = OwnershipLabel_vue_1.default;
  // @ts-ignore
  var __VLS_1 = __VLS_asFunctionalComponent1(
    __VLS_0,
    new __VLS_0({
      kind: o.kind,
      member: o.member,
      splits: o.splits,
    }),
  );
  var __VLS_2 = __VLS_1.apply(
    void 0,
    __spreadArray(
      [
        {
          kind: o.kind,
          member: o.member,
          splits: o.splits,
        },
      ],
      __VLS_functionalComponentArgsRest(__VLS_1),
      false,
    ),
  );
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.td,
    __VLS_intrinsics.td,
  )(__assign({ class: 'ui-data-table-actions' }));
  /** @type {__VLS_StyleScopedClasses['ui-data-table-actions']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-people-row-actions' }));
  /** @type {__VLS_StyleScopedClasses['ui-people-row-actions']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(
      __assign(
        {
          onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.openEdit(o);
            // @ts-ignore
            [store, store, openCreate, ownershipsSorted, openEdit];
          },
        },
        { class: 'icon-btn' },
      ),
      {
        type: 'button',
        title: 'Editar',
        'aria-label': 'Editar',
        disabled: __VLS_ctx.store.loading,
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['icon-btn']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(
      __assign(
        {
          onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.removeOwnership(o.id);
            // @ts-ignore
            [store, removeOwnership];
          },
        },
        { class: 'icon-btn' },
      ),
      {
        type: 'button',
        title: 'Eliminar',
        'aria-label': 'Eliminar',
        disabled: __VLS_ctx.store.loading || o.is_in_use,
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['icon-btn']} */ if (o.kind === 'shared' && o.is_in_use) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */
  }
  // @ts-ignore
  [store];
};
for (var _i = 0, _d = __VLS_vFor(__VLS_ctx.ownershipsSorted); _i < _d.length; _i++) {
  var o = _d[_i][0];
  _loop_1(o);
}
if (!__VLS_ctx.ownershipsSorted.length) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.tr, __VLS_intrinsics.tr)({});
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.td,
    __VLS_intrinsics.td,
  )(__assign({ colspan: '2' }, { class: 'ui-table-empty' }));
  /** @type {__VLS_StyleScopedClasses['ui-table-empty']} */
}
if (__VLS_ctx.store.loading) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-status-line' }));
  /** @type {__VLS_StyleScopedClasses['ui-status-line']} */
}
var __VLS_5 = BaseModal_vue_1.default || BaseModal_vue_1.default;
// @ts-ignore
var __VLS_6 = __VLS_asFunctionalComponent1(
  __VLS_5,
  new __VLS_5(
    __assign(
      { onClose: {} },
      {
        open: __VLS_ctx.showModal,
        title:
          __VLS_ctx.editId != null
            ? 'Editar titularidad compartida'
            : 'Nueva titularidad compartida',
      },
    ),
  ),
);
var __VLS_7 = __VLS_6.apply(
  void 0,
  __spreadArray(
    [
      __assign(
        { onClose: {} },
        {
          open: __VLS_ctx.showModal,
          title:
            __VLS_ctx.editId != null
              ? 'Editar titularidad compartida'
              : 'Nueva titularidad compartida',
        },
      ),
    ],
    __VLS_functionalComponentArgsRest(__VLS_6),
    false,
  ),
);
var __VLS_10;
var __VLS_11 = ({ close: {} }, { onClose: __VLS_ctx.resetModal });
var __VLS_12 = __VLS_8.slots.default;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'form-grid' }));
/** @type {__VLS_StyleScopedClasses['form-grid']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'subtle' }));
/** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'card ui-people-splits-card' }));
/** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-people-splits-card']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-people-member-list' }));
/** @type {__VLS_StyleScopedClasses['ui-people-member-list']} */ var _loop_2 = function (m) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(
      __assign(
        __assign(
          __assign(
            {
              onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                  _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.toggleMember(m.id);
                // @ts-ignore
                [store, ownershipsSorted, showModal, editId, resetModal, adults, toggleMember];
              },
            },
            { key: m.id },
          ),
          { class: 'btn' },
        ),
        { type: 'button' },
      ),
      { class: { 'ui-people-member-inactive': !__VLS_ctx.form.memberIds.includes(m.id) } },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-people-member-inactive']} */ m.name;
  // @ts-ignore
  [form];
};
for (var _e = 0, _f = __VLS_vFor(__VLS_ctx.adults); _e < _f.length; _e++) {
  var m = _f[_e][0];
  _loop_2(m);
}
if (__VLS_ctx.form.memberIds.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-people-splits' }));
  /** @type {__VLS_StyleScopedClasses['ui-people-splits']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-people-splits-header' }));
  /** @type {__VLS_StyleScopedClasses['ui-people-splits-header']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(__assign(__assign({ onClick: __VLS_ctx.setEqualSplit }, { class: 'btn' }), { type: 'button' }));
  /** @type {__VLS_StyleScopedClasses['btn']} */ var _loop_3 = function (id) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ key: id }, { class: 'ui-people-split-row' }));
    /** @type {__VLS_StyleScopedClasses['ui-people-split-row']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-people-split-name' }));
    /** @type {__VLS_StyleScopedClasses['ui-people-split-name']} */ (
      _b =
        (_a = __VLS_ctx.adults.find(function (a) {
          return a.id === id;
        })) === null || _a === void 0
          ? void 0
          : _a.name
    ) !== null && _b !== void 0
      ? _b
      : 'ID ' + id;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(
      __assign(
        { inputmode: 'decimal', placeholder: '50.00' },
        { class: 'input ui-people-percent-input' },
      ),
    );
    __VLS_ctx.form.percents[id];
    /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-people-percent-input']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */ // @ts-ignore
    [adults, form, form, form, setEqualSplit];
  };
  for (var _g = 0, _h = __VLS_vFor(__VLS_ctx.form.memberIds); _g < _h.length; _g++) {
    var id = _h[_g][0];
    _loop_3(id);
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'ui-form-actions' }));
/** @type {__VLS_StyleScopedClasses['ui-form-actions']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(__assign({ onClick: __VLS_ctx.resetModal }, { class: 'btn ui-form-action-btn' }), {
    type: 'button',
  }),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.button,
  __VLS_intrinsics.button,
)(
  __assign(__assign({ onClick: __VLS_ctx.submit }, { class: 'btn ui-form-action-btn' }), {
    type: 'button',
    disabled: !__VLS_ctx.canCreate || __VLS_ctx.store.loading,
  }),
);
/** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['ui-form-action-btn']} */ __VLS_ctx.editId !=
null
  ? 'Guardar'
  : 'Crear';
// @ts-ignore
[store, editId, resetModal, submit, canCreate];
var __VLS_8;
var __VLS_9;
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({});
exports.default = {};
