"use strict";
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
exports.normalizeOptionalText = normalizeOptionalText;
exports.normalizeImportedAssetTae = normalizeImportedAssetTae;
exports.normalizeImportedLiabilityTae = normalizeImportedLiabilityTae;
exports.buildImportPreviewMessage = buildImportPreviewMessage;
exports.comparePortableVersions = comparePortableVersions;
exports.evaluateImportCompatibility = evaluateImportCompatibility;
exports.buildImportPreviewMessageWithVersion = buildImportPreviewMessageWithVersion;
exports.buildPortableFilename = buildPortableFilename;
exports.toPortableAnnualIncomeRecord = toPortableAnnualIncomeRecord;
exports.toPortableAnnualExpenseRecord = toPortableAnnualExpenseRecord;
exports.toPortableAssetRecord = toPortableAssetRecord;
exports.toPortableLiabilityRecord = toPortableLiabilityRecord;
exports.toPortableOwnershipRecord = toPortableOwnershipRecord;
exports.toPortableFamilyMemberRecord = toPortableFamilyMemberRecord;
exports.toPortableOwnershipLinkRecord = toPortableOwnershipLinkRecord;
exports.parsePortableDataBundle = parsePortableDataBundle;
function normalizeOptionalText(raw) {
    if (raw == null)
        return null;
    var text = String(raw).trim();
    return text ? text : null;
}
function normalizeImportedAssetTae(asset) {
    var _a, _b;
    var normalized = normalizeOptionalText(asset.annual_interest_tae);
    if (normalized != null)
        return normalized;
    var category = String((_a = asset.category) !== null && _a !== void 0 ? _a : '').trim();
    var subcategory = String((_b = asset.subcategory) !== null && _b !== void 0 ? _b : '').trim();
    var requiresTae = category === 'cash' &&
        (subcategory === 'bank_account' ||
            subcategory === 'short_term_deposit' ||
            subcategory === 'crypto_spot_earn' ||
            subcategory === 'other');
    return requiresTae ? '0' : null;
}
function normalizeImportedLiabilityTae(liability) {
    var _a;
    var normalized = normalizeOptionalText(liability.annual_interest_tae);
    if (normalized != null)
        return normalized;
    var category = String((_a = liability.category) !== null && _a !== void 0 ? _a : '').trim();
    var requiresTae = category === 'mortgage' || category === 'personal_loan' || category === 'credit_card';
    return requiresTae ? '0' : null;
}
function formatImportYearSummary(entries, label) {
    var _a, _b;
    if (!entries.length)
        return "".concat(label, ": 0");
    var totals = new Map();
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var year = Number(entry.fiscal_year);
        var amount = Number((_a = entry.amount_annual) !== null && _a !== void 0 ? _a : 0);
        var prev = (_b = totals.get(year)) !== null && _b !== void 0 ? _b : { count: 0, amount: 0 };
        totals.set(year, {
            count: prev.count + 1,
            amount: prev.amount + (Number.isFinite(amount) ? amount : 0),
        });
    }
    var segments = __spreadArray([], totals.entries(), true).sort(function (a, b) { return a[0] - b[0]; })
        .map(function (_a) {
        var year = _a[0], info = _a[1];
        return "".concat(year, ": ").concat(info.count, " (").concat(new Intl.NumberFormat('es-ES', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        }).format(info.amount), ")");
    });
    return "".concat(label, ": ").concat(segments.join(' | '));
}
function buildImportPreviewMessage(bundle, mode, currentAppVersion) {
    return buildImportPreviewMessageWithVersion(bundle, mode, currentAppVersion);
}
function parseVersion(version) {
    return version
        .split('.')
        .map(function (part) { return Number(part.trim()); })
        .map(function (part) { return (Number.isFinite(part) ? part : 0); });
}
function comparePortableVersions(left, right) {
    var _a, _b;
    var leftParts = parseVersion(left);
    var rightParts = parseVersion(right);
    var maxLength = Math.max(leftParts.length, rightParts.length);
    for (var index = 0; index < maxLength; index += 1) {
        var leftValue = (_a = leftParts[index]) !== null && _a !== void 0 ? _a : 0;
        var rightValue = (_b = rightParts[index]) !== null && _b !== void 0 ? _b : 0;
        if (leftValue < rightValue)
            return -1;
        if (leftValue > rightValue)
            return 1;
    }
    return 0;
}
function evaluateImportCompatibility(bundle, mode, currentAppVersion) {
    var exportedVersion = normalizeOptionalText(bundle.exported_app_version);
    if (mode === 'replace' && exportedVersion == null) {
        return 'legacy_replace_blocked';
    }
    if (exportedVersion == null || !currentAppVersion) {
        return 'unknown';
    }
    if (comparePortableVersions(exportedVersion, currentAppVersion) > 0) {
        return 'newer_than_app';
    }
    return 'compatible';
}
function buildImportPreviewMessageWithVersion(bundle, mode, currentAppVersion) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var snapshots = (_a = bundle.data.snapshots) !== null && _a !== void 0 ? _a : [];
    var sortedDates = snapshots.map(function (s) { return s.snapshot_date; }).sort();
    var snapshotRange = sortedDates.length > 0
        ? "".concat(sortedDates[0], " .. ").concat(sortedDates[sortedDates.length - 1])
        : 'sin snapshots';
    var hasPremium = Boolean(bundle.premium);
    var exportedVersion = normalizeOptionalText(bundle.exported_app_version);
    var compatibility = evaluateImportCompatibility(bundle, mode, currentAppVersion);
    var lines = [
        mode === 'replace'
            ? 'Se reemplazaran los datos actuales por el archivo:'
            : 'Se importaran datos (modo aditivo):',
        "- Origen: ".concat(bundle.source_app),
        "- Version exportada: ".concat(exportedVersion !== null && exportedVersion !== void 0 ? exportedVersion : 'legacy/sin version'),
        "- Version actual: ".concat(currentAppVersion !== null && currentAppVersion !== void 0 ? currentAppVersion : 'no disponible'),
        "- Ingresos: ".concat(bundle.data.annual_income.length),
        "- Gastos: ".concat(bundle.data.annual_expense.length),
        "- Activos: ".concat(bundle.data.assets.length),
        "- Pasivos: ".concat(bundle.data.liabilities.length),
        "- Snapshots: ".concat(snapshots.length, " (").concat(snapshotRange, ")"),
        "- Configuracion base_currency: ".concat((_c = (_b = bundle.settings) === null || _b === void 0 ? void 0 : _b.base_currency) !== null && _c !== void 0 ? _c : 'sin incluir'),
        hasPremium
            ? "- Miembros: ".concat((_e = (_d = bundle.premium) === null || _d === void 0 ? void 0 : _d.family_members.length) !== null && _e !== void 0 ? _e : 0, " | Titularidades: ").concat((_g = (_f = bundle.premium) === null || _f === void 0 ? void 0 : _f.ownerships.length) !== null && _g !== void 0 ? _g : 0, " | Enlaces: ").concat((_j = (_h = bundle.premium) === null || _h === void 0 ? void 0 : _h.ownership_links.length) !== null && _j !== void 0 ? _j : 0)
            : '- Bloque premium: no incluido',
        '',
        formatImportYearSummary(bundle.data.annual_income, 'Ingresos por ano'),
        formatImportYearSummary(bundle.data.annual_expense, 'Gastos por ano'),
        '',
        mode === 'replace'
            ? 'Se borraran primero los datos actuales de estos bloques (incluidos snapshots).'
            : 'La importacion anade registros y actualiza settings/snapshots/relaciones importados.',
        compatibility === 'legacy_replace_blocked'
            ? 'Aviso: este archivo no incluye version exportada. El backend bloqueara `replace` por seguridad.'
            : compatibility === 'newer_than_app'
                ? 'Aviso: el archivo viene de una version mas nueva. El backend bloqueara `replace` para evitar perdida de datos.'
                : compatibility === 'unknown'
                    ? 'Aviso: no se pudo determinar toda la compatibilidad antes de importar.'
                    : 'Compatibilidad preliminar: OK.',
        'Continuar?',
    ];
    return lines.join('\n');
}
function buildPortableFilename() {
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return "moneyplanner-saas-data-".concat(timestamp, ".json");
}
function toPortableAnnualIncomeRecord(entry) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return {
        id: Number(entry.id),
        name: String((_a = entry.name) !== null && _a !== void 0 ? _a : ''),
        category: String((_b = entry.category) !== null && _b !== void 0 ? _b : ''),
        subcategory: String((_c = entry.subcategory) !== null && _c !== void 0 ? _c : ''),
        owner_name: String((_d = entry.owner_name) !== null && _d !== void 0 ? _d : ''),
        income_type: entry.income_type === 'one_off' ? 'one_off' : 'recurrent',
        time_profile: entry.time_profile,
        cashflow_role: entry.cashflow_role,
        event_group: String((_e = entry.event_group) !== null && _e !== void 0 ? _e : ''),
        target_month: (_f = entry.target_month) !== null && _f !== void 0 ? _f : null,
        term_end_month: (_g = entry.term_end_month) !== null && _g !== void 0 ? _g : null,
        term_end_year: (_h = entry.term_end_year) !== null && _h !== void 0 ? _h : null,
        amount_input_period: entry.amount_input_period === 'monthly' ? 'monthly' : 'annual',
        amount_annual: String((_j = entry.amount_annual) !== null && _j !== void 0 ? _j : '0'),
        fiscal_year: Number((_k = entry.fiscal_year) !== null && _k !== void 0 ? _k : 0),
        currency: String((_l = entry.currency) !== null && _l !== void 0 ? _l : 'EUR').toUpperCase(),
        notes: String((_m = entry.notes) !== null && _m !== void 0 ? _m : ''),
        is_active: (_o = entry.is_active) !== null && _o !== void 0 ? _o : true,
    };
}
function toPortableAnnualExpenseRecord(entry) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return {
        id: Number(entry.id),
        name: String((_a = entry.name) !== null && _a !== void 0 ? _a : ''),
        category: String((_b = entry.category) !== null && _b !== void 0 ? _b : ''),
        subcategory: String((_c = entry.subcategory) !== null && _c !== void 0 ? _c : ''),
        owner_name: String((_d = entry.owner_name) !== null && _d !== void 0 ? _d : ''),
        expense_type: entry.expense_type === 'one_off' ? 'one_off' : 'recurrent',
        time_profile: entry.time_profile,
        cashflow_role: entry.cashflow_role,
        event_group: String((_e = entry.event_group) !== null && _e !== void 0 ? _e : ''),
        target_month: (_f = entry.target_month) !== null && _f !== void 0 ? _f : null,
        term_end_month: (_g = entry.term_end_month) !== null && _g !== void 0 ? _g : null,
        term_end_year: (_h = entry.term_end_year) !== null && _h !== void 0 ? _h : null,
        amount_input_period: entry.amount_input_period === 'monthly' ? 'monthly' : 'annual',
        amount_annual: String((_j = entry.amount_annual) !== null && _j !== void 0 ? _j : '0'),
        fiscal_year: Number((_k = entry.fiscal_year) !== null && _k !== void 0 ? _k : 0),
        currency: String((_l = entry.currency) !== null && _l !== void 0 ? _l : 'EUR').toUpperCase(),
        notes: String((_m = entry.notes) !== null && _m !== void 0 ? _m : ''),
        is_active: (_o = entry.is_active) !== null && _o !== void 0 ? _o : true,
    };
}
function toNumberOrNull(raw) {
    return raw == null ? null : Number(raw);
}
function toUpperText(raw, fallback) {
    return String(raw !== null && raw !== void 0 ? raw : fallback).toUpperCase();
}
function toOptionalText(raw) {
    return raw == null ? null : String(raw);
}
function toOptionalDateText(raw) {
    return raw ? String(raw) : undefined;
}
function toAssetContributionMode(raw) {
    return raw == null ? 'one_time' : String(raw);
}
function toAssetContributionFrequency(raw) {
    return raw == null ? 'monthly' : String(raw);
}
function toPortableAssetRecord(raw) {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        id: Number((_a = raw.id) !== null && _a !== void 0 ? _a : 0),
        name: String((_b = raw.name) !== null && _b !== void 0 ? _b : ''),
        category: String((_c = raw.category) !== null && _c !== void 0 ? _c : ''),
        subcategory: String((_d = raw.subcategory) !== null && _d !== void 0 ? _d : 'other'),
        tracking_mode: String((_e = raw.tracking_mode) !== null && _e !== void 0 ? _e : 'manual'),
        accounting_account_id: toNumberOrNull(raw.accounting_account_id),
        currency: toUpperText(raw.currency, 'EUR'),
        start_date: toOptionalDateText(raw.start_date),
        expected_end_date: toOptionalDateText(raw.expected_end_date),
        investment_contribution_mode: toAssetContributionMode(raw.investment_contribution_mode),
        investment_contribution_frequency: toAssetContributionFrequency(raw.investment_contribution_frequency),
        investment_contribution_currency: raw.investment_contribution_currency == null
            ? null
            : toUpperText(raw.investment_contribution_currency, ''),
        monthly_contribution_amount: toOptionalText(raw.monthly_contribution_amount),
        market_value_override: toOptionalText(raw.market_value_override),
        market_value_override_date: toOptionalText(raw.market_value_override_date),
        initial_purchase_value: toOptionalText(raw.initial_purchase_value),
        amortization_method: raw.amortization_method == null ? 'none' : String(raw.amortization_method),
        amortization_term_years: toNumberOrNull(raw.amortization_term_years),
        annual_interest_tae: toOptionalText(raw.annual_interest_tae),
        deposit_term_months: toNumberOrNull(raw.deposit_term_months),
        amount: String((_f = raw.amount) !== null && _f !== void 0 ? _f : '0'),
        is_active: (_g = raw.is_active) !== null && _g !== void 0 ? _g : true,
        notes: raw.notes == null ? '' : String(raw.notes),
    };
}
function toPortableLiabilityRecord(raw) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var financedAssetRef = (_b = (_a = raw.financed_asset_ref) !== null && _a !== void 0 ? _a : raw
        .financed_asset_id) !== null && _b !== void 0 ? _b : null;
    return {
        id: Number((_c = raw.id) !== null && _c !== void 0 ? _c : 0),
        name: String((_d = raw.name) !== null && _d !== void 0 ? _d : ''),
        category: String((_e = raw.category) !== null && _e !== void 0 ? _e : ''),
        tracking_mode: String((_f = raw.tracking_mode) !== null && _f !== void 0 ? _f : 'manual'),
        accounting_account_id: toNumberOrNull(raw.accounting_account_id),
        currency: toUpperText(raw.currency, 'EUR'),
        start_date: toOptionalDateText(raw.start_date),
        expected_end_date: toOptionalDateText(raw.expected_end_date),
        term_months: toNumberOrNull(raw.term_months),
        rate_type: raw.rate_type == null ? 'fixed' : String(raw.rate_type),
        payment_frequency: raw.payment_frequency == null ? 'monthly' : String(raw.payment_frequency),
        amortization_system: toOptionalText(raw.amortization_system),
        annual_interest_tae: toOptionalText(raw.annual_interest_tae),
        monthly_payment_amount: toOptionalText(raw.monthly_payment_amount),
        principal_amount: toOptionalText(raw.principal_amount),
        opening_fees_amount: toOptionalText(raw.opening_fees_amount),
        early_repayment_fee_percent: toOptionalText(raw.early_repayment_fee_percent),
        novation_subrogation_fee_amount: toOptionalText(raw.novation_subrogation_fee_amount),
        linked_products_monthly_cost: toOptionalText(raw.linked_products_monthly_cost),
        amount: String((_g = raw.amount) !== null && _g !== void 0 ? _g : '0'),
        is_active: (_h = raw.is_active) !== null && _h !== void 0 ? _h : true,
        notes: raw.notes == null ? '' : String(raw.notes),
        financed_asset_ref: financedAssetRef == null ? null : Number(financedAssetRef),
    };
}
function toPortableOwnershipRecord(raw) {
    var _a, _b;
    return {
        id: Number((_a = raw.id) !== null && _a !== void 0 ? _a : 0),
        kind: raw.kind === 'shared' ? 'shared' : 'individual',
        member: raw.member
            ? {
                id: Number(raw.member.id),
                name: String((_b = raw.member.name) !== null && _b !== void 0 ? _b : ''),
                role: raw.member.role === 'child' ? 'child' : 'adult',
            }
            : null,
        splits: Array.isArray(raw.splits)
            ? raw.splits.map(function (split) {
                var _a, _b;
                return ({
                    member: {
                        id: Number(split.member.id),
                        name: String((_a = split.member.name) !== null && _a !== void 0 ? _a : ''),
                        role: split.member.role === 'child' ? 'child' : 'adult',
                    },
                    percent: String((_b = split.percent) !== null && _b !== void 0 ? _b : '0'),
                });
            })
            : [],
        notes: raw.notes == null ? undefined : String(raw.notes),
        is_in_use: raw.is_in_use,
    };
}
function toPortableFamilyMemberRecord(raw) {
    var _a, _b, _c;
    return {
        id: Number((_a = raw.id) !== null && _a !== void 0 ? _a : 0),
        name: String((_b = raw.name) !== null && _b !== void 0 ? _b : ''),
        role: raw.role === 'child' ? 'child' : 'adult',
        is_active: (_c = raw.is_active) !== null && _c !== void 0 ? _c : true,
    };
}
function toPortableOwnershipLinkRecord(raw) {
    var _a, _b;
    return {
        target_type: raw.target_type === 'liability' ? 'liability' : 'asset',
        target_id: Number((_a = raw.target_id) !== null && _a !== void 0 ? _a : 0),
        ownership_id: Number((_b = raw.ownership_id) !== null && _b !== void 0 ? _b : 0),
    };
}
function parsePortableDataBundle(raw) {
    var _a, _b;
    var parsed = JSON.parse(raw);
    if ((parsed === null || parsed === void 0 ? void 0 : parsed.schema_version) !== 1 || !parsed.data) {
        throw new Error('Formato de archivo no compatible.');
    }
    var _c = parsed.data, annual_income = _c.annual_income, annual_expense = _c.annual_expense, assets = _c.assets, liabilities = _c.liabilities, snapshots = _c.snapshots;
    if (!Array.isArray(annual_income) ||
        !Array.isArray(annual_expense) ||
        !Array.isArray(assets) ||
        !Array.isArray(liabilities)) {
        throw new Error('El archivo no contiene las colecciones esperadas.');
    }
    var sourceApp = parsed.source_app === 'saas' ? 'saas' : 'core';
    var premium;
    if (parsed.premium != null) {
        var premiumRaw = parsed.premium;
        if (!Array.isArray(premiumRaw.family_members) ||
            !Array.isArray(premiumRaw.ownerships) ||
            !Array.isArray(premiumRaw.ownership_links)) {
            throw new Error('El bloque premium del archivo no es valido.');
        }
        premium = {
            family_members: premiumRaw.family_members.map(function (row) { return toPortableFamilyMemberRecord(row); }),
            ownerships: premiumRaw.ownerships.map(function (row) { return toPortableOwnershipRecord(row); }),
            ownership_links: premiumRaw.ownership_links.map(function (row) { return toPortableOwnershipLinkRecord(row); }),
        };
    }
    return {
        schema_version: 1,
        exported_at: String((_a = parsed.exported_at) !== null && _a !== void 0 ? _a : ''),
        source_app: sourceApp,
        exported_app_version: parsed.exported_app_version == null ? undefined : String(parsed.exported_app_version),
        settings: parsed.settings && typeof parsed.settings === 'object'
            ? { base_currency: String((_b = parsed.settings.base_currency) !== null && _b !== void 0 ? _b : '') }
            : undefined,
        data: {
            annual_income: annual_income.map(function (row) { return toPortableAnnualIncomeRecord(row); }),
            annual_expense: annual_expense.map(function (row) { return toPortableAnnualExpenseRecord(row); }),
            assets: assets.map(function (row) { return toPortableAssetRecord(row); }),
            liabilities: liabilities.map(function (row) { return toPortableLiabilityRecord(row); }),
            snapshots: Array.isArray(snapshots) ? snapshots : [],
        },
        premium: premium,
    };
}
