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
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var session_1 = require("@/domains/auth/session");
var route = (0, vue_router_1.useRoute)();
var router = (0, vue_router_1.useRouter)();
var sidebarOpen = (0, vue_1.ref)(false);
var accountMenuOpen = (0, vue_1.ref)(false);
var accountMenuRef = (0, vue_1.ref)(null);
var accountLabel = (0, vue_1.ref)('Mi cuenta');
var accountRole = (0, vue_1.ref)('');
var accountPlan = (0, vue_1.ref)('');
var hasToken = (0, vue_1.computed)(function () { return session_1.hasAccessToken.value; });
var isLoginRoute = (0, vue_1.computed)(function () { return route.name === 'login'; });
var navItems = (0, vue_1.computed)(function () {
    var baseItems = [
        { id: 'home', icon: 'GU', label: 'Guia', hint: 'Plan paso a paso', to: '/' },
        {
            id: 'data-input',
            icon: 'IN',
            label: 'Introduccion de datos',
            hint: 'Ingresos, gastos, activos y pasivos',
            to: '/introduccion-datos',
        },
        {
            id: 'net-worth',
            icon: 'PT',
            label: 'Patrimonio',
            hint: 'Estado financiero',
            to: '/patrimonio',
        },
        {
            id: 'budget',
            icon: 'PR',
            label: 'Presupuesto',
            hint: 'Plan anual de ingresos y gastos',
            to: '/presupuesto',
        },
        {
            id: 'monthly-close',
            icon: 'CM',
            label: 'Cierre mensual',
            hint: 'Liquidez, ingresos, gastos y residual',
            to: '/cierre-mensual',
        },
        {
            id: 'accounting-movements',
            icon: 'LD',
            label: 'Movimientos',
            hint: 'Libro diario y cuentas contables',
            to: '/movimientos',
        },
    ];
    return baseItems;
});
var pageTitle = 'moneyplanner';
function isNavItemActive(item) {
    if (item.id === 'home') {
        return route.path === '/' || route.path.startsWith('/guia/');
    }
    return route.path === item.to || route.path.startsWith("".concat(item.to, "/"));
}
var accountInitials = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d;
    var text = accountLabel.value.trim();
    if (!text || text === 'Mi cuenta')
        return 'MC';
    var words = text.split(/\s+/).filter(Boolean);
    var first = (_a = words[0]) !== null && _a !== void 0 ? _a : '';
    var second = (_b = words[1]) !== null && _b !== void 0 ? _b : '';
    if (!second) {
        return first.slice(0, 2).toUpperCase();
    }
    return "".concat((_c = first[0]) !== null && _c !== void 0 ? _c : '').concat((_d = second[0]) !== null && _d !== void 0 ? _d : '').toUpperCase();
});
function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
}
function closeSidebar() {
    sidebarOpen.value = false;
}
function toggleAccountMenu() {
    accountMenuOpen.value = !accountMenuOpen.value;
}
function closeAccountMenu() {
    accountMenuOpen.value = false;
}
function logout() {
    (0, session_1.clearAuthTokens)();
    closeAccountMenu();
    sidebarOpen.value = false;
    router.push('/login');
}
function handleGlobalKeydown(event) {
    if (event.key === 'Escape') {
        if (sidebarOpen.value)
            closeSidebar();
        if (accountMenuOpen.value)
            closeAccountMenu();
    }
}
function handleGlobalClick(event) {
    if (!accountMenuOpen.value)
        return;
    var target = event.target;
    if (!target)
        return;
    if (accountMenuRef.value && !accountMenuRef.value.contains(target)) {
        closeAccountMenu();
    }
}
(0, vue_1.watch)(sidebarOpen, function (open) {
    document.body.style.overflow = open ? 'hidden' : '';
});
(0, vue_1.watch)(function () { return route.fullPath; }, function () {
    sidebarOpen.value = false;
    accountMenuOpen.value = false;
});
(0, vue_1.watch)(hasToken, function (tokenPresent) {
    if (!tokenPresent) {
        accountLabel.value = 'Mi cuenta';
        accountRole.value = '';
        accountPlan.value = '';
        return;
    }
    accountLabel.value = 'Mi cuenta';
    accountRole.value = '';
    accountPlan.value = '';
}, { immediate: true });
window.addEventListener('keydown', handleGlobalKeydown);
document.addEventListener('click', handleGlobalClick);
(0, vue_1.onBeforeUnmount)(function () {
    window.removeEventListener('keydown', handleGlobalKeydown);
    document.removeEventListener('click', handleGlobalClick);
    document.body.style.overflow = '';
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['ui-shell-brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-brand-text']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-link']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-account-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-header']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-account-link']} */ ;
/** @type {__VLS_StyleScopedClasses['ui-shell-account-meta']} */ ;
if (__VLS_ctx.isLoginRoute) {
    var __VLS_0 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.routerView | typeof __VLS_components.RouterView} */
    routerView;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_5 = {};
    var __VLS_3;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell']} */ ;
    if (__VLS_ctx.sidebarOpen) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.closeSidebar) }, { class: "ui-shell-backdrop" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-backdrop']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.aside, __VLS_intrinsics.aside)(__assign({ class: "ui-shell-sidebar" }, { class: ({ 'ui-shell-sidebar-open': __VLS_ctx.sidebarOpen }) }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-sidebar']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-shell-sidebar-open']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-sidebar-top" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-sidebar-top']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-brand" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-brand']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-brand-mark" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-brand-mark']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-brand-text" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-brand-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.closeSidebar) }, { class: "icon-btn ui-shell-icon-btn" }), { type: "button", 'aria-label': "Cerrar menu" }));
    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-shell-icon-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        'aria-hidden': "true",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)(__assign({ class: "ui-shell-nav" }, { 'aria-label': "Navegacion principal" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-nav']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-nav-section" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-nav-section']} */ ;
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.navItems)); _i < _a.length; _i++) {
        var item = _a[_i][0];
        var __VLS_6 = void 0;
        /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
        RouterLink;
        // @ts-ignore
        var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (item.id), to: (item.to) }), { class: "ui-shell-link" }), { class: ({ 'ui-shell-link-active': __VLS_ctx.isNavItemActive(item) }) }), { title: ("".concat(item.label, ": ").concat(item.hint)) })));
        var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (item.id), to: (item.to) }), { class: "ui-shell-link" }), { class: ({ 'ui-shell-link-active': __VLS_ctx.isNavItemActive(item) }) }), { title: ("".concat(item.label, ": ").concat(item.hint)) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
        var __VLS_11 = void 0;
        var __VLS_12 = ({ click: {} },
            { onClick: (__VLS_ctx.closeSidebar) });
        /** @type {__VLS_StyleScopedClasses['ui-shell-link']} */ ;
        /** @type {__VLS_StyleScopedClasses['ui-shell-link-active']} */ ;
        var __VLS_13 = __VLS_9.slots.default;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-link-icon" }, { 'aria-hidden': "true" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-link-icon']} */ ;
        (item.icon);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-link-copy" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-link-copy']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-link-label" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-link-label']} */ ;
        (item.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-link-hint" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-link-hint']} */ ;
        (item.hint);
        // @ts-ignore
        [isLoginRoute, sidebarOpen, sidebarOpen, closeSidebar, closeSidebar, closeSidebar, navItems, isNavItemActive,];
        var __VLS_9;
        var __VLS_10;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-main" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "ui-shell-header" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleSidebar) }, { class: "icon-btn ui-shell-icon-btn" }), { type: "button", 'aria-label': "Abrir menu" }));
    /** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['ui-shell-icon-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        'aria-hidden': "true",
    });
    var __VLS_14 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    var __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14(__assign({ class: "ui-shell-header-title-link" }, { to: "/" })));
    var __VLS_16 = __VLS_15.apply(void 0, __spreadArray([__assign({ class: "ui-shell-header-title-link" }, { to: "/" })], __VLS_functionalComponentArgsRest(__VLS_15), false));
    /** @type {__VLS_StyleScopedClasses['ui-shell-header-title-link']} */ ;
    var __VLS_19 = __VLS_17.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-header-title" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-header-title']} */ ;
    (__VLS_ctx.pageTitle);
    // @ts-ignore
    [toggleSidebar, pageTitle,];
    var __VLS_17;
    if (__VLS_ctx.hasToken) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ ref: "accountMenuRef" }, { class: "ui-shell-account-menu" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-menu']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.toggleAccountMenu) }, { class: "ui-shell-account-link" }), { type: "button", 'aria-expanded': (__VLS_ctx.accountMenuOpen), 'aria-haspopup': "menu" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-link']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-account-avatar" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-avatar']} */ ;
        (__VLS_ctx.accountInitials);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-account-info" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-account-name" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-name']} */ ;
        (__VLS_ctx.accountLabel);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "ui-shell-account-meta" }));
        /** @type {__VLS_StyleScopedClasses['ui-shell-account-meta']} */ ;
        if (__VLS_ctx.accountRole) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.accountRole);
        }
        if (__VLS_ctx.accountRole && __VLS_ctx.accountPlan) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        }
        if (__VLS_ctx.accountPlan) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.accountPlan);
        }
        if (__VLS_ctx.accountMenuOpen) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-shell-account-dropdown" }, { role: "menu" }));
            /** @type {__VLS_StyleScopedClasses['ui-shell-account-dropdown']} */ ;
            var __VLS_20 = void 0;
            /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
            RouterLink;
            // @ts-ignore
            var __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20(__assign(__assign({ 'onClick': {} }, { class: "ui-shell-account-item" }), { to: "/account", role: "menuitem" })));
            var __VLS_22 = __VLS_21.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "ui-shell-account-item" }), { to: "/account", role: "menuitem" })], __VLS_functionalComponentArgsRest(__VLS_21), false));
            var __VLS_25 = void 0;
            var __VLS_26 = ({ click: {} },
                { onClick: (__VLS_ctx.closeAccountMenu) });
            /** @type {__VLS_StyleScopedClasses['ui-shell-account-item']} */ ;
            var __VLS_27 = __VLS_23.slots.default;
            // @ts-ignore
            [hasToken, toggleAccountMenu, accountMenuOpen, accountMenuOpen, accountInitials, accountLabel, accountRole, accountRole, accountRole, accountPlan, accountPlan, accountPlan, closeAccountMenu,];
            var __VLS_23;
            var __VLS_24;
            var __VLS_28 = void 0;
            /** @ts-ignore @type {typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
            RouterLink;
            // @ts-ignore
            var __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28(__assign(__assign({ 'onClick': {} }, { class: "ui-shell-account-item" }), { to: "/data", role: "menuitem" })));
            var __VLS_30 = __VLS_29.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "ui-shell-account-item" }), { to: "/data", role: "menuitem" })], __VLS_functionalComponentArgsRest(__VLS_29), false));
            var __VLS_33 = void 0;
            var __VLS_34 = ({ click: {} },
                { onClick: (__VLS_ctx.closeAccountMenu) });
            /** @type {__VLS_StyleScopedClasses['ui-shell-account-item']} */ ;
            var __VLS_35 = __VLS_31.slots.default;
            // @ts-ignore
            [closeAccountMenu,];
            var __VLS_31;
            var __VLS_32;
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.logout) }, { class: "ui-shell-account-item ui-shell-account-item-btn" }), { type: "button", role: "menuitem" }));
            /** @type {__VLS_StyleScopedClasses['ui-shell-account-item']} */ ;
            /** @type {__VLS_StyleScopedClasses['ui-shell-account-item-btn']} */ ;
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)(__assign({ class: "ui-shell-content" }));
    /** @type {__VLS_StyleScopedClasses['ui-shell-content']} */ ;
    var __VLS_36 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.routerView | typeof __VLS_components.RouterView} */
    routerView;
    // @ts-ignore
    var __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({}));
    var __VLS_38 = __VLS_37.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_37), false));
}
// @ts-ignore
[logout,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
