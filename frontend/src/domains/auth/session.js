'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.hasAccessToken = void 0;
exports.getAccessToken = getAccessToken;
exports.getRefreshToken = getRefreshToken;
exports.setAccessToken = setAccessToken;
exports.setRefreshToken = setRefreshToken;
exports.clearAuthTokens = clearAuthTokens;
var vue_1 = require('vue');
var ACCESS_TOKEN_KEY = 'access_token';
var REFRESH_TOKEN_KEY = 'refresh_token';
var accessToken = (0, vue_1.ref)(null);
var refreshToken = (0, vue_1.ref)(null);
var hydrated = false;
function hydrateFromStorage() {
  if (hydrated) return;
  hydrated = true;
  accessToken.value = localStorage.getItem(ACCESS_TOKEN_KEY);
  refreshToken.value = localStorage.getItem(REFRESH_TOKEN_KEY);
}
exports.hasAccessToken = (0, vue_1.computed)(function () {
  hydrateFromStorage();
  return !!accessToken.value;
});
function getAccessToken() {
  hydrateFromStorage();
  return accessToken.value;
}
function getRefreshToken() {
  hydrateFromStorage();
  return refreshToken.value;
}
function setAccessToken(token) {
  hydrateFromStorage();
  accessToken.value = token;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
function setRefreshToken(token) {
  hydrateFromStorage();
  refreshToken.value = token;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}
function clearAuthTokens() {
  hydrateFromStorage();
  accessToken.value = null;
  refreshToken.value = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
