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
Object.defineProperty(exports, '__esModule', { value: true });
var vue_1 = require('vue');
var format_1 = require('@/lib/format');
var EditableItemRow_vue_1 = require('./EditableItemRow.vue');
var ItemCategoryHeader_vue_1 = require('./ItemCategoryHeader.vue');
var ItemDisplayRow_vue_1 = require('./ItemDisplayRow.vue');
var ItemSubgroupHeader_vue_1 = require('./ItemSubgroupHeader.vue');
var props = defineProps();
var emit = defineEmits();
var currencies = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'BTC', label: 'BTC' },
  { value: 'ETH', label: 'ETH' },
];
var editingId = (0, vue_1.ref)(null);
var draft = (0, vue_1.ref)({});
function normalizeOwnershipFilterValue(raw) {
  if (raw === 'all' || raw === 'unassigned') return raw;
  if (typeof raw === 'number' && Number.isInteger(raw)) return raw;
  if (typeof raw === 'string' && raw.trim() !== '') {
    var parsed = Number(raw);
    if (Number.isInteger(parsed)) return parsed;
  }
  return 'all';
}
var ownershipFilter = (0, vue_1.ref)(normalizeOwnershipFilterValue(props.ownershipFilterValue));
var expandedCats = (0, vue_1.ref)(new Set());
var isLiabilitiesList = (0, vue_1.computed)(function () {
  return props.title === 'Pasivos';
});
var ownershipLabel = function (o) {
  if (!o) return '';
  if (o.kind === 'individual') {
    var m = o.member;
    if (m && typeof m === 'object') return m.name;
    if (typeof m === 'number') return '#'.concat(m);
    return 'Individual';
  }
  var splits = Array.isArray(o.splits) ? o.splits : [];
  var parts = splits.map(function (s) {
    var _a;
    var m = s.member;
    var name = m && typeof m === 'object' ? m.name : typeof m === 'number' ? '#'.concat(m) : '?';
    return ''
      .concat(name, ' ')
      .concat((_a = s.percent) !== null && _a !== void 0 ? _a : '', '%')
      .trim();
  });
  return 'Compartido | '.concat(parts.join(' | ') || 'sin splits');
};
var ownershipOptions = (0, vue_1.computed)(function () {
  var list = Array.isArray(props.ownerships) ? props.ownerships : [];
  return __spreadArray(
    [{ value: null, label: 'Sin asignar' }],
    list.map(function (o) {
      return {
        value: o.id,
        label: ownershipLabel(o) || 'Ownership #'.concat(o.id),
      };
    }),
    true,
  );
});
var memberFilterOptions = (0, vue_1.computed)(function () {
  var list = Array.isArray(props.ownerships) ? props.ownerships : [];
  var members = list
    .filter(function (o) {
      return o.kind === 'individual' && o.member;
    })
    .map(function (o) {
      return o.member;
    })
    .filter(function (m) {
      return m != null;
    });
  var unique = new Map();
  for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
    var m = members_1[_i];
    if (!unique.has(m.id)) unique.set(m.id, { id: m.id, name: m.name });
  }
  return Array.from(unique.values()).sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
});
var ownershipById = (0, vue_1.computed)(function () {
  var _a;
  var m = new Map();
  ((_a = props.ownerships) !== null && _a !== void 0 ? _a : []).forEach(function (o) {
    return m.set(o.id, o);
  });
  return m;
});
function ownershipShortLabel(ownershipRef) {
  var _a, _b;
  if (ownershipRef == null) return null;
  var o = ownershipById.value.get(ownershipRef);
  if (!o) return 'own #'.concat(ownershipRef);
  if (o.kind === 'individual') {
    var name_1 =
      (_b = (_a = o.member) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0
        ? _b
        : '#'.concat(ownershipRef);
    return name_1;
  }
  var splits = Array.isArray(o.splits) ? o.splits : [];
  if (!splits.length) return 'Compartido';
  var first = splits[0];
  var second = splits[1];
  var isAllHalf =
    splits.length === 2 &&
    first != null &&
    second != null &&
    String(first.percent) === '50.00' &&
    String(second.percent) === '50.00';
  var names = splits.map(function (s) {
    var _a, _b;
    return (_b = (_a = s.member) === null || _a === void 0 ? void 0 : _a.name) !== null &&
      _b !== void 0
      ? _b
      : '?';
  });
  if (isAllHalf) return names.join('/');
  var parts = splits.map(function (s) {
    var _a, _b;
    return ''
      .concat(
        (_b = (_a = s.member) === null || _a === void 0 ? void 0 : _a.name) !== null &&
          _b !== void 0
          ? _b
          : '?',
        ' ',
      )
      .concat(s.percent, '%');
  });
  return parts.join(' | ');
}
// ---- financed asset helpers (solo pasivos) ----
var assetsById = (0, vue_1.computed)(function () {
  var _a;
  var m = new Map();
  ((_a = props.assets) !== null && _a !== void 0 ? _a : []).forEach(function (a) {
    return m.set(a.id, a);
  });
  return m;
});
function financedAssetName(financedAssetRef) {
  if (!financedAssetRef) return null;
  var a = assetsById.value.get(financedAssetRef);
  return a ? a.name : '#'.concat(financedAssetRef);
}
var financedAssetOptions = (0, vue_1.computed)(function () {
  var list = Array.isArray(props.assets) ? props.assets : [];
  return __spreadArray(
    [{ value: null, label: 'No financia ningun activo' }],
    list
      .slice()
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .map(function (a) {
        return {
          value: a.id,
          label: a.name,
        };
      }),
    true,
  );
});
var decimalsByCurrency = {
  EUR: 2,
  USD: 2,
  BTC: 8,
  ETH: 8,
};
function getMaxDecimals(currency) {
  var _a;
  return (_a =
    decimalsByCurrency[String(currency !== null && currency !== void 0 ? currency : '')]) !==
    null && _a !== void 0
    ? _a
    : 2;
}
var amountHint = (0, vue_1.computed)(function () {
  var max = getMaxDecimals(draft.value.currency);
  return 'Hasta '.concat(max, ' decimales');
});
function normalizeAmountInput(raw) {
  return String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}
function clampDecimals(amount, maxDecimals) {
  var s = normalizeAmountInput(amount);
  if (!s) return '';
  if ((s.match(/\./g) || []).length > 1) return s;
  var _a = s.split('.'),
    _b = _a[0],
    i = _b === void 0 ? '' : _b,
    _c = _a[1],
    d = _c === void 0 ? '' : _c;
  return d ? ''.concat(i, '.').concat(d.slice(0, maxDecimals)) : i;
}
function trimTrailingZeros(amount) {
  if (!amount.includes('.')) return amount;
  return amount.replace(/\.?0+$/, '');
}
var amountError = (0, vue_1.computed)(function () {
  var max = getMaxDecimals(draft.value.currency);
  var clamped = clampDecimals(draft.value.amount, max);
  if (!draft.value.amount) return '';
  if ((normalizeAmountInput(draft.value.amount).match(/\./g) || []).length > 1)
    return 'Importe invalido';
  if (Number.isNaN(Number(normalizeAmountInput(clamped)))) return 'Importe invalido';
  return '';
});
var categoryLabel = function (key) {
  var _a;
  var found = props.categories.find(function (c) {
    return c.value === key;
  });
  return (_a = found === null || found === void 0 ? void 0 : found.label) !== null && _a !== void 0
    ? _a
    : key;
};
var subcategoryLabel = function (key) {
  var _a, _b;
  var list = (_a = props.subcategories) !== null && _a !== void 0 ? _a : [];
  var found = list.find(function (c) {
    return c.value === key;
  });
  return (_b = found === null || found === void 0 ? void 0 : found.label) !== null && _b !== void 0
    ? _b
    : key;
};
function categoryClass(category) {
  if (isLiabilitiesList.value) {
    return 'liab-cat-'.concat(category || 'other');
  }
  return 'asset-cat-'.concat(category || 'other');
}
var filteredItems = (0, vue_1.computed)(function () {
  var _a, _b;
  var rawList = Array.isArray(props.items) ? props.items : [];
  var list = props.showArchived
    ? rawList
    : rawList.filter(function (it) {
        return it.is_active !== false;
      });
  if (ownershipFilter.value === 'all') return list;
  if (ownershipFilter.value === 'unassigned') {
    return list.filter(function (it) {
      return it.ownership_ref == null;
    });
  }
  var memberId = ownershipFilter.value;
  if (typeof memberId !== 'number') return list;
  var out = [];
  for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var it = list_1[_i];
    if (it.ownership_ref == null) continue;
    var o = ownershipById.value.get(it.ownership_ref);
    if (!o) continue;
    var pct = 0;
    if (
      o.kind === 'individual' &&
      ((_a = o.member) === null || _a === void 0 ? void 0 : _a.id) === memberId
    ) {
      pct = 100;
    } else if (o.kind === 'shared') {
      var split = ((_b = o.splits) !== null && _b !== void 0 ? _b : []).find(function (s) {
        var _a;
        return ((_a = s.member) === null || _a === void 0 ? void 0 : _a.id) === memberId;
      });
      if (split) pct = Number(normalizeAmountInput(split.percent));
    }
    if (!pct || pct <= 0) continue;
    var sourceAmount =
      it.effective_amount != null && String(it.effective_amount).trim() !== ''
        ? toNumberAmount(String(it.effective_amount))
        : toNumberAmount(String(it.amount));
    var displayAmount_1 = sourceAmount * (pct / 100);
    out.push(
      __assign(__assign({}, it), {
        _displayAmount: displayAmount_1,
        _sharePercent: pct,
        _source: it,
      }),
    );
  }
  return out;
});
var grouped = (0, vue_1.computed)(function () {
  var _a;
  var list = filteredItems.value;
  var map = new Map();
  for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
    var it = list_2[_i];
    var key = (_a = it.category) !== null && _a !== void 0 ? _a : 'other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  var orderedAssetCats = ['cash', 'investments', 'real_estate', 'furnishings', 'other'];
  var orderedLiabCats = ['credit_card', 'personal_loan', 'mortgage', 'other'];
  var assetOrder = new Map(
    orderedAssetCats.map(function (k, i) {
      return [k, i];
    }),
  );
  var liabOrder = new Map(
    orderedLiabCats.map(function (k, i) {
      return [k, i];
    }),
  );
  return Array.from(map.entries())
    .sort(function (_a, _b) {
      var _c, _d, _e, _f;
      var a = _a[0];
      var b = _b[0];
      if (!isLiabilitiesList.value) {
        var ai = (_c = assetOrder.get(a)) !== null && _c !== void 0 ? _c : Number.MAX_SAFE_INTEGER;
        var bi = (_d = assetOrder.get(b)) !== null && _d !== void 0 ? _d : Number.MAX_SAFE_INTEGER;
        if (ai !== bi) return ai - bi;
      } else {
        var ai = (_e = liabOrder.get(a)) !== null && _e !== void 0 ? _e : Number.MAX_SAFE_INTEGER;
        var bi = (_f = liabOrder.get(b)) !== null && _f !== void 0 ? _f : Number.MAX_SAFE_INTEGER;
        if (ai !== bi) return ai - bi;
      }
      return categoryLabel(a).localeCompare(categoryLabel(b));
    })
    .map(function (_a) {
      var category = _a[0],
        items = _a[1];
      var base = {
        category: category,
        label: categoryLabel(category),
        items: items.sort(function (x, y) {
          return x.name.localeCompare(y.name);
        }),
        subgroups: [],
        hasSubgroups: false,
      };
      if (!props.subcategories) {
        base.subgroups = [
          {
            subcategory: null,
            label: null,
            items: base.items,
          },
        ];
        return base;
      }
      var subMap = new Map();
      for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var it = items_1[_i];
        var subKey = it.subcategory || 'other';
        if (!subMap.has(subKey)) subMap.set(subKey, []);
        subMap.get(subKey).push(it);
      }
      base.subgroups = Array.from(subMap.entries())
        .sort(function (_a, _b) {
          var a = _a[0];
          var b = _b[0];
          return subcategoryLabel(a).localeCompare(subcategoryLabel(b));
        })
        .map(function (_a) {
          var subcategory = _a[0],
            subitems = _a[1];
          return {
            subcategory: subcategory,
            label: subcategoryLabel(subcategory),
            items: subitems.sort(function (x, y) {
              return x.name.localeCompare(y.name);
            }),
          };
        });
      base.hasSubgroups = true;
      return base;
    });
});
function shouldShowGroupDetails(group) {
  if (group.hasSubgroups) return expandedCats.value.has(group.category);
  return !isLiabilitiesList.value || expandedCats.value.has(group.category);
}
function subgroupKey(group, subgroup, index) {
  var _a;
  if (group.hasSubgroups)
    return (_a = subgroup.subcategory) !== null && _a !== void 0 ? _a : 'sub-'.concat(index);
  return ''.concat(group.category, '-all');
}
var headerTotals = (0, vue_1.computed)(function () {
  return categoryTotals(filteredItems.value);
});
var headerBaseValue = (0, vue_1.computed)(function () {
  return totalBaseAll();
});
function headerBaseLabel() {
  if (!props.baseCurrency) return null;
  var v = headerBaseValue.value;
  if (v == null) return null;
  return formatAmountWithUnit(v, props.baseCurrency);
}
function toNumberAmount(raw) {
  var s = String(raw !== null && raw !== void 0 ? raw : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
  var n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
function categoryTotals(items) {
  var _a;
  var acc = {};
  for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
    var it = items_2[_i];
    var cur = it.currency || '???';
    acc[cur] =
      ((_a = acc[cur]) !== null && _a !== void 0 ? _a : 0) +
      toNumberAmount(String(displayAmount(it)));
  }
  return acc;
}
function formatTotalsLine(totals) {
  var parts = Object.entries(totals)
    .filter(function (_a) {
      var v = _a[1];
      return v !== 0;
    })
    .map(function (_a) {
      var cur = _a[0],
        v = _a[1];
      return formatAmountWithUnit(v, cur);
    });
  return parts.join(' | ');
}
function formatAmountWithUnit(value, currency) {
  var amount = (0, format_1.formatAmount)(String(value), { currency: currency });
  if (currency === 'EUR') return ''.concat(amount, ' \u20AC');
  if (currency === 'USD') return ''.concat(amount, ' $');
  return ''.concat(amount, ' ').concat(currency).trim();
}
function rawValue(v) {
  return String(v !== null && v !== void 0 ? v : '')
    .trim()
    .replace(/\s/g, '')
    .replace(/,/g, '.');
}
function displayAmountBase(it) {
  if (!it.amount_base) return null;
  var base = toNumberAmount(String(it.amount_base));
  if (!Number.isFinite(base)) return null;
  if (it._sharePercent != null) {
    return base * (it._sharePercent / 100);
  }
  return base;
}
function totalBaseForItems(items) {
  var sum = 0;
  var hasAny = false;
  for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
    var it = items_3[_i];
    var v = displayAmountBase(it);
    if (v == null) continue;
    hasAny = true;
    sum += v;
  }
  return hasAny ? sum : null;
}
function totalBaseAll() {
  if (ownershipFilter.value === 'all') {
    if (!props.totalBase) return null;
    var total = Number(rawValue(props.totalBase));
    return Number.isFinite(total) ? total : null;
  }
  return totalBaseForItems(filteredItems.value);
}
function categoryBaseValue(category, items) {
  if (ownershipFilter.value === 'all') {
    if (!props.categoryTotalsBase) return null;
    var raw = props.categoryTotalsBase[category];
    if (!raw) return null;
    var v = Number(rawValue(raw));
    return Number.isFinite(v) ? v : null;
  }
  return totalBaseForItems(items);
}
function subcategoryBaseValue(category, subcategory, items) {
  var subKey = subcategory !== null && subcategory !== void 0 ? subcategory : 'other';
  if (ownershipFilter.value === 'all') {
    if (!props.subcategoryTotalsBase) return null;
    var raw = props.subcategoryTotalsBase[''.concat(category, ':').concat(subKey)];
    if (!raw) return null;
    var v = Number(rawValue(raw));
    return Number.isFinite(v) ? v : null;
  }
  return totalBaseForItems(items);
}
function shouldShowBaseTotal(totals, baseValue) {
  if (!props.baseCurrency) return false;
  if (baseValue == null) return false;
  var nonZero = Object.entries(totals)
    .filter(function (_a) {
      var v = _a[1];
      return v !== 0;
    })
    .map(function (_a) {
      var cur = _a[0];
      return cur;
    });
  if (nonZero.length === 0) return false;
  return !(nonZero.length === 1 && nonZero[0] === props.baseCurrency);
}
function baseTotalLabel(category, items) {
  if (!props.baseCurrency) return null;
  var v = categoryBaseValue(category, items);
  if (v == null) return null;
  return formatAmountWithUnit(v, props.baseCurrency);
}
function subcategoryBaseLabel(category, subcategory, items) {
  if (!props.baseCurrency) return null;
  var v = subcategoryBaseValue(category, subcategory, items);
  if (v == null) return null;
  return formatAmountWithUnit(v, props.baseCurrency);
}
function subcategoryPercent(category, subcategory, items, categoryItems) {
  var sub = subcategoryBaseValue(category, subcategory, items);
  if (sub == null) return null;
  var cat = categoryBaseValue(category, categoryItems);
  if (cat == null || cat === 0) return null;
  var pct = (sub / cat) * 100;
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(pct);
}
function categoryPercent(category, items) {
  var v = categoryBaseValue(category, items);
  if (v == null) return null;
  var total = totalBaseAll();
  if (total == null || total === 0) return null;
  var pct = (v / total) * 100;
  return new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(pct);
}
function startEdit(item) {
  var _a, _b, _c;
  editingId.value = item.id;
  var max = getMaxDecimals(item.currency);
  var prettyAmount = trimTrailingZeros(clampDecimals(item.amount, max));
  draft.value = {
    name: item.name,
    category: item.category,
    subcategory: (_a = item.subcategory) !== null && _a !== void 0 ? _a : '',
    amount: prettyAmount,
    currency: item.currency,
    notes: item.notes,
    is_active: item.is_active,
    ownership_id: (_b = item.ownership_ref) !== null && _b !== void 0 ? _b : null,
    // SOLO pasivos
    financed_asset_id: (_c = item.financed_asset_ref) !== null && _c !== void 0 ? _c : null,
  };
}
function editTarget(it) {
  var _a;
  return (_a = it._source) !== null && _a !== void 0 ? _a : it;
}
function displayAmount(it) {
  var _a;
  var base = (_a = it._displayAmount) !== null && _a !== void 0 ? _a : it.amount;
  if (!it._displayAmount && it.effective_amount) {
    return it.effective_amount;
  }
  return base;
}
function toggleCategory(key) {
  var next = new Set(expandedCats.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  expandedCats.value = next;
}
function handleDelete(id) {
  return __awaiter(this, void 0, void 0, function () {
    var label;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!props.onDelete) return [2 /*return*/];
          label = isLiabilitiesList.value ? 'pasivo' : 'activo';
          if (
            !confirm(
              'Eliminar este '.concat(
                label,
                ' de forma permanente? Esta accion no se puede deshacer.',
              ),
            )
          ) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, props.onDelete(id)];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
(0, vue_1.watch)(
  function () {
    return [draft.value.currency, draft.value.category];
  },
  function () {
    var _a;
    if (!((_a = draft.value) === null || _a === void 0 ? void 0 : _a.amount)) return;
    var max = getMaxDecimals(draft.value.currency);
    draft.value.amount = trimTrailingZeros(clampDecimals(draft.value.amount, max));
  },
);
(0, vue_1.watch)(
  function () {
    return [ownershipFilter.value, filteredItems.value.length];
  },
  function () {
    expandedCats.value = new Set();
  },
);
(0, vue_1.watch)(
  function () {
    return props.ownershipFilterValue;
  },
  function (next) {
    var normalized = normalizeOwnershipFilterValue(next);
    if (ownershipFilter.value !== normalized) {
      ownershipFilter.value = normalized;
    }
  },
);
(0, vue_1.watch)(
  ownershipFilter,
  function (next) {
    emit('update:ownershipFilterValue', next);
  },
  { immediate: true },
);
function cancelEdit() {
  editingId.value = null;
  draft.value = {};
}
function isValidAmountString(amount) {
  var s = normalizeAmountInput(amount);
  if (!s) return false;
  if ((s.match(/\./g) || []).length > 1) return false;
  if (s === '.' || s === '-' || s === '-.') return false;
  return !Number.isNaN(Number(s));
}
function saveEdit(id) {
  return __awaiter(this, void 0, void 0, function () {
    var max, normalized, clamped, payload;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          max = getMaxDecimals(draft.value.currency);
          normalized = normalizeAmountInput(draft.value.amount);
          clamped = clampDecimals(normalized, max);
          if (!isValidAmountString(clamped)) return [2 /*return*/];
          payload = __assign(__assign({}, draft.value), {
            amount: clamped,
            subcategory: draft.value.subcategory || undefined,
          });
          // Seguridad: si no es lista de pasivos, no mandes financed_asset_id
          if (!isLiabilitiesList.value) {
            delete payload.financed_asset_id;
          }
          return [4 /*yield*/, props.onUpdate(id, payload)];
        case 1:
          _a.sent();
          cancelEdit();
          return [2 /*return*/];
      }
    });
  });
}
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'card ui-pro-panel ui-nw-list-panel' }));
/** @type {__VLS_StyleScopedClasses['card']} */ /** @type {__VLS_StyleScopedClasses['ui-pro-panel']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-list-panel']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-header' }));
/** @type {__VLS_StyleScopedClasses['nw-list-header']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-header-left' }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-left']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.h2,
  __VLS_intrinsics.h2,
)(__assign({ class: 'card-header-title mt-0' }));
/** @type {__VLS_StyleScopedClasses['card-header-title']} */ /** @type {__VLS_StyleScopedClasses['mt-0']} */ __VLS_ctx.title;
if (__VLS_ctx.showOwnershipFilter !== false) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.select,
    __VLS_intrinsics.select,
  )(__assign({ value: __VLS_ctx.ownershipFilter }, { class: 'select nw-select-sm' }));
  /** @type {__VLS_StyleScopedClasses['select']} */ /** @type {__VLS_StyleScopedClasses['nw-select-sm']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'all',
  });
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.option,
    __VLS_intrinsics.option,
  )({
    value: 'unassigned',
  });
  for (var _i = 0, _a = __VLS_vFor(__VLS_ctx.memberFilterOptions); _i < _a.length; _i++) {
    var m = _a[_i][0];
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      key: String(m.id),
      value: m.id,
    });
    m.name;
    // @ts-ignore
    [title, showOwnershipFilter, ownershipFilter, memberFilterOptions];
  }
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-header-right' }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-right']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-total-inline' }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-inline']} */ if (__VLS_ctx.headerBaseLabel()) {
  __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
  __VLS_ctx.headerBaseLabel();
} else {
  __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
  __VLS_ctx.formatTotalsLine(__VLS_ctx.headerTotals);
}
if (__VLS_ctx.onAdd) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.button,
    __VLS_intrinsics.button,
  )(
    __assign(
      __assign(
        { onClick: __VLS_ctx.onAdd },
        { class: 'btn btn-primary btn-sm nw-list-add-icon-only' },
      ),
      { type: 'button', 'aria-label': 'Anadir' },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['btn-sm']} */ /** @type {__VLS_StyleScopedClasses['nw-list-add-icon-only']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'btn-icon' }));
  /** @type {__VLS_StyleScopedClasses['btn-icon']} */
}
__VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-header-totals' }));
/** @type {__VLS_StyleScopedClasses['nw-list-header-totals']} */ __VLS_asFunctionalElement1(
  __VLS_intrinsics.div,
  __VLS_intrinsics.div,
)(__assign({ class: 'nw-list-total-details' }));
/** @type {__VLS_StyleScopedClasses['nw-list-total-details']} */ __VLS_ctx.formatTotalsLine(
  __VLS_ctx.headerTotals,
);
if (!__VLS_ctx.items.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */
} else if (!__VLS_ctx.filteredItems.length) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'subtle' }));
  /** @type {__VLS_StyleScopedClasses['subtle']} */
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'grid gap-4' }));
  /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ var _loop_1 =
    function (g) {
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.section,
        __VLS_intrinsics.section,
      )(
        __assign(__assign({ key: g.category }, { class: 'nw-cat-block' }), {
          class: __VLS_ctx.categoryClass(g.category),
        }),
      );
      /** @type {__VLS_StyleScopedClasses['nw-cat-block']} */ var __VLS_0 =
        ItemCategoryHeader_vue_1.default;
      // @ts-ignore
      var __VLS_1 = __VLS_asFunctionalComponent1(
        __VLS_0,
        new __VLS_0(
          __assign(
            { onToggle: {} },
            {
              label: g.label,
              count: g.items.length,
              totalsLine: __VLS_ctx.formatTotalsLine(__VLS_ctx.categoryTotals(g.items)),
              baseLabel: __VLS_ctx.baseTotalLabel(g.category, g.items),
              percent: __VLS_ctx.categoryPercent(g.category, g.items),
              showBaseTotal: __VLS_ctx.shouldShowBaseTotal(
                __VLS_ctx.categoryTotals(g.items),
                __VLS_ctx.categoryBaseValue(g.category, g.items),
              ),
              showToggle: g.hasSubgroups || __VLS_ctx.isLiabilitiesList,
              expanded: __VLS_ctx.expandedCats.has(g.category),
            },
          ),
        ),
      );
      var __VLS_2 = __VLS_1.apply(
        void 0,
        __spreadArray(
          [
            __assign(
              { onToggle: {} },
              {
                label: g.label,
                count: g.items.length,
                totalsLine: __VLS_ctx.formatTotalsLine(__VLS_ctx.categoryTotals(g.items)),
                baseLabel: __VLS_ctx.baseTotalLabel(g.category, g.items),
                percent: __VLS_ctx.categoryPercent(g.category, g.items),
                showBaseTotal: __VLS_ctx.shouldShowBaseTotal(
                  __VLS_ctx.categoryTotals(g.items),
                  __VLS_ctx.categoryBaseValue(g.category, g.items),
                ),
                showToggle: g.hasSubgroups || __VLS_ctx.isLiabilitiesList,
                expanded: __VLS_ctx.expandedCats.has(g.category),
              },
            ),
          ],
          __VLS_functionalComponentArgsRest(__VLS_1),
          false,
        ),
      );
      var __VLS_5 = void 0;
      var __VLS_6 =
        ({ toggle: {} },
        {
          onToggle: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!!__VLS_ctx.items.length) return;
            if (!!!__VLS_ctx.filteredItems.length) return;
            __VLS_ctx.toggleCategory(g.category);
            // @ts-ignore
            [
              headerBaseLabel,
              headerBaseLabel,
              formatTotalsLine,
              formatTotalsLine,
              formatTotalsLine,
              headerTotals,
              headerTotals,
              onAdd,
              onAdd,
              items,
              filteredItems,
              grouped,
              categoryClass,
              categoryTotals,
              categoryTotals,
              baseTotalLabel,
              categoryPercent,
              shouldShowBaseTotal,
              categoryBaseValue,
              isLiabilitiesList,
              expandedCats,
              toggleCategory,
            ];
          },
        });
      if (__VLS_ctx.shouldShowGroupDetails(g)) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: g.hasSubgroups ? 'subcat-list' : '' }));
        for (var _d = 0, _e = __VLS_vFor(g.subgroups); _d < _e.length; _d++) {
          var _f = _e[_d],
            sg = _f[0],
            sgIndex = _f[1];
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.div,
            __VLS_intrinsics.div,
          )(
            __assign(
              { key: __VLS_ctx.subgroupKey(g, sg, sgIndex) },
              { class: g.hasSubgroups ? 'nw-subcat-block' : '' },
            ),
          );
          if (g.hasSubgroups) {
            var __VLS_7 = ItemSubgroupHeader_vue_1.default;
            // @ts-ignore
            var __VLS_8 = __VLS_asFunctionalComponent1(
              __VLS_7,
              new __VLS_7({
                label: sg.label,
                totalsLine: __VLS_ctx.formatTotalsLine(__VLS_ctx.categoryTotals(sg.items)),
                baseLabel: __VLS_ctx.subcategoryBaseLabel(g.category, sg.subcategory, sg.items),
                percent: __VLS_ctx.subcategoryPercent(
                  g.category,
                  sg.subcategory,
                  sg.items,
                  g.items,
                ),
                showBaseTotal: __VLS_ctx.shouldShowBaseTotal(
                  __VLS_ctx.categoryTotals(sg.items),
                  __VLS_ctx.subcategoryBaseValue(g.category, sg.subcategory, sg.items),
                ),
              }),
            );
            var __VLS_9 = __VLS_8.apply(
              void 0,
              __spreadArray(
                [
                  {
                    label: sg.label,
                    totalsLine: __VLS_ctx.formatTotalsLine(__VLS_ctx.categoryTotals(sg.items)),
                    baseLabel: __VLS_ctx.subcategoryBaseLabel(g.category, sg.subcategory, sg.items),
                    percent: __VLS_ctx.subcategoryPercent(
                      g.category,
                      sg.subcategory,
                      sg.items,
                      g.items,
                    ),
                    showBaseTotal: __VLS_ctx.shouldShowBaseTotal(
                      __VLS_ctx.categoryTotals(sg.items),
                      __VLS_ctx.subcategoryBaseValue(g.category, sg.subcategory, sg.items),
                    ),
                  },
                ],
                __VLS_functionalComponentArgsRest(__VLS_8),
                false,
              ),
            );
          }
          __VLS_asFunctionalElement1(
            __VLS_intrinsics.ul,
            __VLS_intrinsics.ul,
          )(__assign({ class: 'list list-plain nw-subcat-items' }));
          /** @type {__VLS_StyleScopedClasses['list']} */ /** @type {__VLS_StyleScopedClasses['list-plain']} */ /** @type {__VLS_StyleScopedClasses['nw-subcat-items']} */ var _loop_2 =
            function (it) {
              __VLS_asFunctionalElement1(
                __VLS_intrinsics.li,
                __VLS_intrinsics.li,
              )({
                key: it.id,
              });
              if (__VLS_ctx.editingId !== it.id) {
                var __VLS_12 = ItemDisplayRow_vue_1.default;
                // @ts-ignore
                var __VLS_13 = __VLS_asFunctionalComponent1(
                  __VLS_12,
                  new __VLS_12(
                    __assign(
                      __assign(__assign({ onEdit: {} }, { onArchive: {} }), { onDelete: {} }),
                      {
                        item: it,
                        formattedAmount: __VLS_ctx.formatAmountWithUnit(
                          __VLS_ctx.displayAmount(it),
                          it.currency,
                        ),
                        isLiabilitiesList: __VLS_ctx.isLiabilitiesList,
                        financedAssetName: __VLS_ctx.financedAssetName(it.financed_asset_ref),
                        ownershipLabel: __VLS_ctx.ownershipShortLabel(it.ownership_ref),
                        sharePercent: it._sharePercent,
                      },
                    ),
                  ),
                );
                var __VLS_14 = __VLS_13.apply(
                  void 0,
                  __spreadArray(
                    [
                      __assign(
                        __assign(__assign({ onEdit: {} }, { onArchive: {} }), { onDelete: {} }),
                        {
                          item: it,
                          formattedAmount: __VLS_ctx.formatAmountWithUnit(
                            __VLS_ctx.displayAmount(it),
                            it.currency,
                          ),
                          isLiabilitiesList: __VLS_ctx.isLiabilitiesList,
                          financedAssetName: __VLS_ctx.financedAssetName(it.financed_asset_ref),
                          ownershipLabel: __VLS_ctx.ownershipShortLabel(it.ownership_ref),
                          sharePercent: it._sharePercent,
                        },
                      ),
                    ],
                    __VLS_functionalComponentArgsRest(__VLS_13),
                    false,
                  ),
                );
                var __VLS_17 = void 0;
                var __VLS_18 =
                  ({ edit: {} },
                  {
                    onEdit: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (!!!__VLS_ctx.items.length) return;
                      if (!!!__VLS_ctx.filteredItems.length) return;
                      if (!__VLS_ctx.shouldShowGroupDetails(g)) return;
                      if (!(__VLS_ctx.editingId !== it.id)) return;
                      __VLS_ctx.onEdit
                        ? __VLS_ctx.onEdit(__VLS_ctx.editTarget(it))
                        : __VLS_ctx.startEdit(__VLS_ctx.editTarget(it));
                      // @ts-ignore
                      [
                        formatTotalsLine,
                        categoryTotals,
                        categoryTotals,
                        shouldShowBaseTotal,
                        isLiabilitiesList,
                        shouldShowGroupDetails,
                        subgroupKey,
                        subcategoryBaseLabel,
                        subcategoryPercent,
                        subcategoryBaseValue,
                        editingId,
                        formatAmountWithUnit,
                        displayAmount,
                        financedAssetName,
                        ownershipShortLabel,
                        onEdit,
                        onEdit,
                        editTarget,
                        editTarget,
                        startEdit,
                      ];
                    },
                  });
                var __VLS_19 =
                  ({ archive: {} },
                  {
                    onArchive: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (!!!__VLS_ctx.items.length) return;
                      if (!!!__VLS_ctx.filteredItems.length) return;
                      if (!__VLS_ctx.shouldShowGroupDetails(g)) return;
                      if (!(__VLS_ctx.editingId !== it.id)) return;
                      __VLS_ctx.onArchive(it.id);
                      // @ts-ignore
                      [onArchive];
                    },
                  });
                var __VLS_20 =
                  ({ delete: {} },
                  {
                    onDelete: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (!!!__VLS_ctx.items.length) return;
                      if (!!!__VLS_ctx.filteredItems.length) return;
                      if (!__VLS_ctx.shouldShowGroupDetails(g)) return;
                      if (!(__VLS_ctx.editingId !== it.id)) return;
                      __VLS_ctx.handleDelete(it.id);
                      // @ts-ignore
                      [handleDelete];
                    },
                  });
              } else {
                var __VLS_21 = EditableItemRow_vue_1.default;
                // @ts-ignore
                var __VLS_22 = __VLS_asFunctionalComponent1(
                  __VLS_21,
                  new __VLS_21(
                    __assign(__assign({ onSave: {} }, { onCancel: {} }), {
                      draft: __VLS_ctx.draft,
                      categories: __VLS_ctx.categories,
                      subcategories: props.subcategories,
                      currencies: __VLS_ctx.currencies,
                      ownershipOptions: __VLS_ctx.ownershipOptions,
                      showFinancedAsset: __VLS_ctx.isLiabilitiesList,
                      financedAssetOptions: __VLS_ctx.financedAssetOptions,
                      amountHint: __VLS_ctx.amountHint,
                      amountError: __VLS_ctx.amountError,
                    }),
                  ),
                );
                var __VLS_23 = __VLS_22.apply(
                  void 0,
                  __spreadArray(
                    [
                      __assign(__assign({ onSave: {} }, { onCancel: {} }), {
                        draft: __VLS_ctx.draft,
                        categories: __VLS_ctx.categories,
                        subcategories: props.subcategories,
                        currencies: __VLS_ctx.currencies,
                        ownershipOptions: __VLS_ctx.ownershipOptions,
                        showFinancedAsset: __VLS_ctx.isLiabilitiesList,
                        financedAssetOptions: __VLS_ctx.financedAssetOptions,
                        amountHint: __VLS_ctx.amountHint,
                        amountError: __VLS_ctx.amountError,
                      }),
                    ],
                    __VLS_functionalComponentArgsRest(__VLS_22),
                    false,
                  ),
                );
                var __VLS_26 = void 0;
                var __VLS_27 =
                  ({ save: {} },
                  {
                    onSave: function () {
                      var _a = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                      }
                      var $event = _a[0];
                      if (!!!__VLS_ctx.items.length) return;
                      if (!!!__VLS_ctx.filteredItems.length) return;
                      if (!__VLS_ctx.shouldShowGroupDetails(g)) return;
                      if (!!(__VLS_ctx.editingId !== it.id)) return;
                      __VLS_ctx.saveEdit(it.id);
                      // @ts-ignore
                      [
                        isLiabilitiesList,
                        draft,
                        categories,
                        currencies,
                        ownershipOptions,
                        financedAssetOptions,
                        amountHint,
                        amountError,
                        saveEdit,
                      ];
                    },
                  });
                var __VLS_28 = ({ cancel: {} }, { onCancel: __VLS_ctx.cancelEdit });
              }
              // @ts-ignore
              [cancelEdit];
            };
          for (var _g = 0, _h = __VLS_vFor(sg.items); _g < _h.length; _g++) {
            var it = _h[_g][0];
            _loop_2(it);
          }
          // @ts-ignore
          [];
        }
      }
      // @ts-ignore
      [];
    };
  var __VLS_3, __VLS_4, __VLS_15, __VLS_16, __VLS_24, __VLS_25;
  for (var _b = 0, _c = __VLS_vFor(__VLS_ctx.grouped); _b < _c.length; _b++) {
    var g = _c[_b][0];
    _loop_1(g);
  }
}
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeEmits: {},
  __typeProps: {},
});
exports.default = {};
