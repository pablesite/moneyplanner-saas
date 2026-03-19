"use strict";
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/pablo/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var scoreVisuals_1 = require("@/domains/guide/scoreVisuals");
var props = defineProps();
var badgeStyle = (0, vue_1.computed)(function () { return (0, scoreVisuals_1.scoreBadgeStyle)(props.score); });
var __VLS_ctx = __assign(__assign(__assign(__assign({}, {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ class: "ui-guide-health-score-badge" }, { class: ("ui-guide-health-".concat(__VLS_ctx.tone)) }), { style: (__VLS_ctx.badgeStyle) }));
/** @type {__VLS_StyleScopedClasses['ui-guide-health-score-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-guide-health-score-text" }));
/** @type {__VLS_StyleScopedClasses['ui-guide-health-score-text']} */ ;
(__VLS_ctx.label);
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)(__assign({ class: "ui-guide-health-score-value" }));
/** @type {__VLS_StyleScopedClasses['ui-guide-health-score-value']} */ ;
((_a = __VLS_ctx.formattedScore) !== null && _a !== void 0 ? _a : "".concat(Math.round(__VLS_ctx.score), "%"));
// @ts-ignore
[tone, badgeStyle, label, formattedScore, score,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeProps: {},
});
exports.default = {};
