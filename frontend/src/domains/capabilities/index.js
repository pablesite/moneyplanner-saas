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
Object.defineProperty(exports, '__esModule', { value: true });
exports.capabilities = void 0;
exports.hasCapability = hasCapability;
exports.isCloudDeployment = isCloudDeployment;
exports.canUseGuide = canUseGuide;
exports.canUseFamilyMode = canUseFamilyMode;
exports.canUsePeople = canUsePeople;
exports.canUseOwnership = canUseOwnership;
exports.canUseAdminInternal = canUseAdminInternal;
function buildCompat(capabilities) {
  return {
    isPremium: capabilities.planCode === 'cloud_pro' || capabilities.planCode === 'cloud_premium',
    people:
      capabilities.core.familyLogicalModel ||
      capabilities.familyCloud.sharedFamilyViews ||
      capabilities.premium.familyMode,
    ownership: capabilities.core.familyLogicalModel || capabilities.premium.familyMode,
  };
}
function withCompat(base) {
  var compat = buildCompat(base);
  return __assign(__assign(__assign({}, base), { compat: compat }), compat);
}
exports.capabilities = withCompat({
  deploymentMode: 'self_hosted',
  planCode: 'community_core',
  capabilitiesVersion: 1,
  platform: {
    selfHosted: true,
    cloudHosted: false,
    appAuth: true,
    cloudManagedServices: false,
    cloudMultiDeviceAccess: false,
    pwaMinimal: false,
    mobileAppNative: false,
  },
  core: {
    netWorth: true,
    dataInput: true,
    budget: true,
    accountingBasic: true,
    accountingMovementsManual: false,
    investmentPortfolioBasic: false,
    statsBasic: true,
    dataPortabilityBasic: true,
    onboardingAssisted: false,
    familyLogicalModel: true,
    coachV1: true,
    coachPhase5: false,
    financialSimulatorBasic: false,
    localAutomationHooks: false,
  },
  familyCloud: {
    memberLogins: false,
    memberPrivacy: false,
    sharedFamilyViews: false,
  },
  central: {
    communityBenchmarkAnonymous: false,
    computeHeavySimulation: false,
    llmConversationalAdvanced: false,
    astraModules: false,
    smartNotifications: false,
  },
  pro: {
    guide: true,
    guidanceBasic: false,
    goals: false,
    simulatorBasic: false,
    smartNotificationsBasic: false,
    assistedMonthlyClose: false,
  },
  premium: {
    familyMode: false,
    agentAdvanced: false,
    simulatorAdvanced: false,
    portfolioAnalyticsAdvanced: false,
    communityBenchmarkingAnonymous: false,
    inputCaptureAdvanced: false,
    importBulkAdvanced: false,
    astraSignalsInfo: false,
  },
  saas: {
    accountPage: false,
    adminInternal: false,
    billingPortal: false,
    planManagement: false,
  },
});
function getByPath(source, path) {
  return path.split('.').reduce(function (acc, key) {
    if (!acc || typeof acc !== 'object') return undefined;
    return acc[key];
  }, source);
}
function hasCapability(path, source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return getByPath(source, path) === true;
}
function isCloudDeployment(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return source.deploymentMode === 'cloud';
}
function canUseGuide(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return source.core.coachV1 || source.pro.guide;
}
function canUseFamilyMode(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return source.familyCloud.sharedFamilyViews || source.premium.familyMode;
}
function canUsePeople(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return (
    source.core.familyLogicalModel || source.familyCloud.sharedFamilyViews || source.compat.people
  );
}
function canUseOwnership(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return source.core.familyLogicalModel || source.compat.ownership;
}
function canUseAdminInternal(source) {
  if (source === void 0) {
    source = exports.capabilities;
  }
  return source.saas.adminInternal;
}
