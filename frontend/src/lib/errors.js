"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiErrorCode = getApiErrorCode;
exports.toApiErrorMessage = toApiErrorMessage;
var axios_1 = require("axios");
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function getApiErrorCode(error) {
    var _a, _b;
    if (!axios_1.default.isAxiosError(error))
        return null;
    var data = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data;
    if (!isRecord(data))
        return null;
    var envelope = data;
    return typeof ((_b = envelope.error) === null || _b === void 0 ? void 0 : _b.code) === 'string' ? envelope.error.code : null;
}
function humanMessageForApiCode(code) {
    if (code === 'permission_denied') {
        return 'No tienes permisos para realizar esta accion.';
    }
    if (code === 'subscription_blocked') {
        return 'Tu suscripcion no habilita esta funcionalidad premium.';
    }
    return null;
}
function humanMessageForAuthFailure(error) {
    var _a, _b, _c, _d;
    if (!axios_1.default.isAxiosError(error))
        return null;
    var status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
    var url = (_c = (_b = error.config) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : '';
    if (status === 401 && url.includes('/api/auth/token/')) {
        return 'Usuario o contrasena incorrectos.';
    }
    var data = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data;
    if (isRecord(data) && typeof data.detail === 'string') {
        if (data.detail.toLowerCase().includes('no active account found')) {
            return 'Usuario o contrasena incorrectos.';
        }
    }
    return null;
}
function firstValidationMessage(data) {
    if (!isRecord(data))
        return null;
    for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
        var _b = _a[_i], field = _b[0], raw = _b[1];
        if (field === 'error' || field === 'detail')
            continue;
        if (typeof raw === 'string' && raw.trim()) {
            return "".concat(field, ": ").concat(raw);
        }
        if (Array.isArray(raw)) {
            var first = raw.find(function (item) { return typeof item === 'string' && item.trim(); });
            if (typeof first === 'string' && first.trim()) {
                return "".concat(field, ": ").concat(first);
            }
        }
    }
    if (typeof data.detail === 'string' && data.detail.trim())
        return data.detail;
    return null;
}
function toApiErrorMessage(error) {
    var _a, _b, _c;
    var code = getApiErrorCode(error);
    var mapped = humanMessageForApiCode(code);
    if (mapped)
        return mapped;
    var authMessage = humanMessageForAuthFailure(error);
    if (authMessage)
        return authMessage;
    var maybe = error;
    var data = (_a = maybe === null || maybe === void 0 ? void 0 : maybe.response) === null || _a === void 0 ? void 0 : _a.data;
    if (isRecord(data)) {
        var envelope = data;
        var detailsMessage = firstValidationMessage((_b = envelope.error) === null || _b === void 0 ? void 0 : _b.details);
        if (detailsMessage)
            return detailsMessage;
        if (typeof ((_c = envelope.error) === null || _c === void 0 ? void 0 : _c.message) === 'string' && envelope.error.message.length > 0) {
            return envelope.error.message;
        }
        var validation = firstValidationMessage(data);
        if (validation)
            return validation;
    }
    if (typeof data === 'string')
        return data;
    if (maybe === null || maybe === void 0 ? void 0 : maybe.message)
        return maybe.message;
    return 'Error';
}
