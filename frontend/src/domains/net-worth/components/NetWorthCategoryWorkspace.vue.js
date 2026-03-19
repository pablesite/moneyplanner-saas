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
var _a;
Object.defineProperty(exports, '__esModule', { value: true });
var __VLS_props = defineProps();
var __VLS_ctx = __assign(__assign(__assign({}, {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
if (!__VLS_ctx.showCategoryWorkspace) {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign(
      { class: 'ui-nw-category-workspace ui-nw-category-workspace-empty' },
      { style: __VLS_ctx.timelineSidebarPanelStyle },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-empty']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3,
  )(__assign({ class: 'ui-nw-category-workspace-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-title']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-nw-category-workspace-copy' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-copy']} */
} else {
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(
    __assign(
      { class: 'ui-nw-category-workspace ui-nw-category-workspace-embedded' },
      { style: __VLS_ctx.timelineSidebarPanelStyle },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-embedded']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-nw-category-workspace-head' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-head']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-nw-category-workspace-heading' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-heading']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-nw-category-workspace-kicker' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-kicker']} */ __VLS_ctx.selectedTimelineCategoryType ===
  'liability'
    ? 'Pasivos'
    : 'Activos';
  __VLS_asFunctionalElement1(
    __VLS_intrinsics.div,
    __VLS_intrinsics.div,
  )(__assign({ class: 'ui-nw-category-workspace-title-row' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-title-row']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.h3,
    __VLS_intrinsics.h3,
  )(__assign({ class: 'ui-nw-category-workspace-title' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-title']} */ __VLS_ctx.categoryWorkspaceLabel;
  __VLS_asFunctionalElement1(
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
            if (!!!__VLS_ctx.showCategoryWorkspace) return;
            __VLS_ctx.openCreateModal(
              __VLS_ctx.selectedTimelineCategoryType,
              __VLS_ctx.selectedTimelineCategory,
            );
            // @ts-ignore
            [
              showCategoryWorkspace,
              timelineSidebarPanelStyle,
              timelineSidebarPanelStyle,
              selectedTimelineCategoryType,
              selectedTimelineCategoryType,
              categoryWorkspaceLabel,
              openCreateModal,
              selectedTimelineCategory,
            ];
          },
        },
        { class: 'icon-btn ui-nw-category-add-btn' },
      ),
      {
        type: 'button',
        'aria-label':
          __VLS_ctx.selectedTimelineCategoryType === 'liability' ? 'Nuevo pasivo' : 'Nuevo activo',
        title:
          __VLS_ctx.selectedTimelineCategoryType === 'liability' ? 'Nuevo pasivo' : 'Nuevo activo',
      },
    ),
  );
  /** @type {__VLS_StyleScopedClasses['icon-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-add-btn']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.span,
    __VLS_intrinsics.span,
  )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
  /** @type {__VLS_StyleScopedClasses['icon']} */ __VLS_asFunctionalElement1(
    __VLS_intrinsics.p,
    __VLS_intrinsics.p,
  )(__assign({ class: 'ui-nw-category-workspace-copy' }));
  /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-copy']} */ __VLS_ctx.categoryWorkspaceMeta;
  if (__VLS_ctx.showPositionSelector) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.label,
      __VLS_intrinsics.label,
    )(__assign({ class: 'ui-nw-position-select' }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-position-select']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.span,
      __VLS_intrinsics.span,
    )(__assign({ class: 'ui-nw-position-select-label' }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-position-select-label']} */ __VLS_ctx.selectedTimelineCategoryType ===
    'liability'
      ? 'Pasivo concreto'
      : 'Activo concreto';
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.select,
      __VLS_intrinsics.select,
    )(
      __assign(
        __assign(
          { onChange: __VLS_ctx.onPositionSelection },
          { class: 'input ui-nw-position-select-input' },
        ),
        { value: (_a = __VLS_ctx.selectedPositionId) !== null && _a !== void 0 ? _a : '' },
      ),
    );
    /** @type {__VLS_StyleScopedClasses['input']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-position-select-input']} */ __VLS_asFunctionalElement1(
      __VLS_intrinsics.option,
      __VLS_intrinsics.option,
    )({
      value: '',
    });
    for (var _i = 0, _b = __VLS_vFor(__VLS_ctx.availablePositionRows); _i < _b.length; _i++) {
      var row = _b[_i][0];
      __VLS_asFunctionalElement1(
        __VLS_intrinsics.option,
        __VLS_intrinsics.option,
      )({
        key: row.id,
        value: row.id,
      });
      row.name;
      // @ts-ignore
      [
        selectedTimelineCategoryType,
        selectedTimelineCategoryType,
        selectedTimelineCategoryType,
        categoryWorkspaceMeta,
        showPositionSelector,
        onPositionSelection,
        selectedPositionId,
        availablePositionRows,
      ];
    }
  }
  if (__VLS_ctx.categoryWorkspaceRows.length === 0) {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'subtle' }));
    /** @type {__VLS_StyleScopedClasses['subtle']} */
  } else {
    __VLS_asFunctionalElement1(
      __VLS_intrinsics.div,
      __VLS_intrinsics.div,
    )(__assign({ class: 'ui-nw-category-workspace-list' }));
    /** @type {__VLS_StyleScopedClasses['ui-nw-category-workspace-list']} */ var _loop_1 =
      function (row) {
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.article,
          __VLS_intrinsics.article,
        )(
          __assign(
            __assign(
              { key: ''.concat(row.type, '-').concat(row.id) },
              { class: 'ui-nw-category-item' },
            ),
            {
              class: {
                'ui-nw-category-item-active':
                  __VLS_ctx.selectedPositionType === row.type &&
                  __VLS_ctx.selectedPositionId === row.id,
              },
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-item']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-active']} */ __VLS_asFunctionalElement1(
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
                  if (!!!__VLS_ctx.showCategoryWorkspace) return;
                  if (!!(__VLS_ctx.categoryWorkspaceRows.length === 0)) return;
                  __VLS_ctx.selectPosition(row);
                  // @ts-ignore
                  [
                    selectedPositionId,
                    categoryWorkspaceRows,
                    categoryWorkspaceRows,
                    selectedPositionType,
                    selectPosition,
                  ];
                },
              },
              { class: 'ui-nw-category-item-main' },
            ),
            { type: 'button' },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-main']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-nw-category-selection-label' }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-selection-label']} */ row.type ===
        'liability'
          ? 'Pasivo concreto'
          : 'Activo concreto';
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-nw-category-item-head' }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-head']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.strong,
          __VLS_intrinsics.strong,
        )({});
        row.name;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_ctx.formatNumber(row.value, 2);
        __VLS_ctx.displayCurrencyUnit(row.currency);
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-nw-category-item-meta' }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-meta']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )({});
        row.subtitle;
        if (row.ownershipFraction < 1) {
          __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
          __VLS_ctx.formatPct(row.ownershipFraction, 0);
        }
        if (__VLS_ctx.ownershipBadgeForRow(row)) {
          __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
          __VLS_ctx.ownershipBadgeForRow(row);
        }
        __VLS_asFunctionalElement1(
          __VLS_intrinsics.div,
          __VLS_intrinsics.div,
        )(__assign({ class: 'ui-nw-category-item-actions' }));
        /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-actions']} */ __VLS_asFunctionalElement1(
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
                  if (!!!__VLS_ctx.showCategoryWorkspace) return;
                  if (!!(__VLS_ctx.categoryWorkspaceRows.length === 0)) return;
                  __VLS_ctx.editRow(row);
                  // @ts-ignore
                  [
                    formatNumber,
                    displayCurrencyUnit,
                    formatPct,
                    ownershipBadgeForRow,
                    ownershipBadgeForRow,
                    editRow,
                  ];
                },
              },
              { class: 'icon-btn ui-nw-category-item-action' },
            ),
            { type: 'button', 'aria-label': 'Editar', title: 'Editar' },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-action']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
        /** @type {__VLS_StyleScopedClasses['icon']} */ __VLS_asFunctionalElement1(
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
                  if (!!!__VLS_ctx.showCategoryWorkspace) return;
                  if (!!(__VLS_ctx.categoryWorkspaceRows.length === 0)) return;
                  __VLS_ctx.deleteRow(row);
                  // @ts-ignore
                  [deleteRow];
                },
              },
              { class: 'icon-btn ui-nw-category-item-action' },
            ),
            {
              type: 'button',
              'aria-label': row.type === 'asset' ? 'Eliminar activo' : 'Eliminar pasivo',
              title: 'Eliminar',
            },
          ),
        );
        /** @type {__VLS_StyleScopedClasses['icon-btn']} */ /** @type {__VLS_StyleScopedClasses['ui-nw-category-item-action']} */ __VLS_asFunctionalElement1(
          __VLS_intrinsics.span,
          __VLS_intrinsics.span,
        )(__assign({ class: 'icon' }, { 'aria-hidden': 'true' }));
        /** @type {__VLS_StyleScopedClasses['icon']} */ // @ts-ignore
        [];
      };
    for (var _c = 0, _d = __VLS_vFor(__VLS_ctx.categoryWorkspaceRows); _c < _d.length; _c++) {
      var row = _d[_c][0];
      _loop_1(row);
    }
  }
}
// @ts-ignore
[];
var __VLS_export = (
  await Promise.resolve().then(function () {
    return require('vue');
  })
).defineComponent({
  __typeProps: {},
});
exports.default = {};
