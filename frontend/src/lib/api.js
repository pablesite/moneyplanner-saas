"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreApi = exports.api = void 0;
var axios_1 = require("axios");
var authSession_1 = require("@/lib/authSession");
var baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';
var coreBaseURL = import.meta.env.VITE_CORE_API_BASE_URL || 'http://localhost:8000';
exports.api = axios_1.default.create({ baseURL: baseURL });
exports.coreApi = axios_1.default.create({ baseURL: coreBaseURL });
var refreshClient = axios_1.default.create({ baseURL: baseURL });
var isRefreshing = false;
var pending = [];
function logAuthDebug(event, context) {
    if (typeof console === 'undefined')
        return;
    console.warn("[auth] ".concat(event), context);
}
function redirectToLoginWithSessionExpiredReason() {
    if (typeof window !== 'undefined') {
        window.location.href = '/login?reason=session_expired';
    }
}
function notifyPending(token) {
    pending.forEach(function (cb) { return cb(token); });
    pending = [];
}
function refreshAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var refresh, res, access, nextRefresh, error_1, status_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    refresh = (0, authSession_1.getRefreshToken)();
                    if (!refresh)
                        return [2 /*return*/, null];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, refreshClient.post('/api/auth/refresh/', { refresh: refresh })];
                case 2:
                    res = _d.sent();
                    access = (_a = res.data) === null || _a === void 0 ? void 0 : _a.access;
                    nextRefresh = (_b = res.data) === null || _b === void 0 ? void 0 : _b.refresh;
                    if (access) {
                        (0, authSession_1.setAccessToken)(access);
                        if (typeof nextRefresh === 'string' && nextRefresh.length > 0) {
                            (0, authSession_1.setRefreshToken)(nextRefresh);
                        }
                        return [2 /*return*/, access];
                    }
                    logAuthDebug('refresh_missing_access', {
                        url: '/api/auth/refresh/',
                    });
                    return [2 /*return*/, null];
                case 3:
                    error_1 = _d.sent();
                    status_1 = (_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _c === void 0 ? void 0 : _c.status;
                    logAuthDebug('refresh_failed', {
                        url: '/api/auth/refresh/',
                        status: status_1 !== null && status_1 !== void 0 ? status_1 : null,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function installAuthInterceptors(client) {
    var _this = this;
    client.interceptors.request.use(function (config) {
        var token = (0, authSession_1.getAccessToken)();
        if (token)
            config.headers.Authorization = "Bearer ".concat(token);
        return config;
    });
    client.interceptors.response.use(function (r) { return r; }, function (error) { return __awaiter(_this, void 0, void 0, function () {
        var status, original, requestUrl, isRefreshCall, isTokenCall, refresh, newToken;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
                    original = error.config || {};
                    requestUrl = String((_b = original.url) !== null && _b !== void 0 ? _b : '');
                    isRefreshCall = requestUrl.includes('/api/auth/refresh/');
                    isTokenCall = requestUrl.includes('/api/auth/token/');
                    if (status !== 401 || isRefreshCall || isTokenCall || original._retry) {
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    logAuthDebug('request_401', {
                        source: 'core',
                        url: requestUrl,
                        method: String((_c = original.method) !== null && _c !== void 0 ? _c : 'get').toUpperCase(),
                    });
                    refresh = (0, authSession_1.getRefreshToken)();
                    if (!refresh) {
                        logAuthDebug('logout_no_refresh_token', {
                            source: 'core',
                            url: requestUrl,
                        });
                        (0, authSession_1.clearAuthTokens)();
                        redirectToLoginWithSessionExpiredReason();
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    original._retry = true;
                    if (!!isRefreshing) return [3 /*break*/, 2];
                    isRefreshing = true;
                    return [4 /*yield*/, refreshAccessToken()];
                case 1:
                    newToken = _d.sent();
                    isRefreshing = false;
                    if (!newToken) {
                        logAuthDebug('logout_refresh_failed', {
                            source: 'core',
                            url: requestUrl,
                        });
                        (0, authSession_1.clearAuthTokens)();
                        notifyPending(null);
                        redirectToLoginWithSessionExpiredReason();
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    notifyPending(newToken);
                    original.headers = original.headers || {};
                    original.headers.Authorization = "Bearer ".concat(newToken);
                    return [2 /*return*/, client(original)];
                case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                        pending.push(function (token) {
                            if (!token) {
                                reject(error);
                                return;
                            }
                            original.headers = original.headers || {};
                            original.headers.Authorization = "Bearer ".concat(token);
                            resolve(client(original));
                        });
                    })];
            }
        });
    }); });
}
installAuthInterceptors(exports.api);
installAuthInterceptors(exports.coreApi);
