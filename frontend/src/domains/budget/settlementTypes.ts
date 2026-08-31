export type SettlementAccountRole =
  'operating' | 'personal_destination' | 'allocation_destination' | 'physical_cash';

export type SettlementAccount = {
  id: number;
  asset_id: number;
  asset_name: string;
  role: SettlementAccountRole;
  member_id: number | null;
  member_name: string | null;
  currency: string;
  is_primary: boolean;
  accepted_physical_balance: string | null;
  modeled_balance_at_activation: string | null;
  wallet_difference: string | null;
};

export type SettlementOpeningAdjustment = {
  id: number;
  account_id: number;
  asset_id: number;
  member_id: number;
  member_name: string;
  amount: string;
  kind: 'manual' | 'wallet_normalization';
  note: string;
};

export type SettlementWalletNormalization = {
  transaction_id: number;
  booking_date: string;
  description: string;
};

export type SettlementConfiguration = {
  is_enabled: boolean;
  activation_date: string | null;
  baseline_date: string | null;
  start_date: string | null;
  can_rebaseline: boolean;
  base_currency: string;
  operating_reserve_adjustment: string;
  readiness_status: 'not_checked' | 'ready' | 'blocked';
  readiness_checked_at: string | null;
  accounts: SettlementAccount[];
  opening_adjustments: SettlementOpeningAdjustment[];
  opening_balances: {
    account_id: number;
    asset_id: number;
    member_id: number;
    member_name: string;
    amount: string;
    currency: string;
  }[];
  normalization_transactions: SettlementWalletNormalization[];
};

export type SettlementConfigurationWrite = {
  base_currency: string;
  accounts: {
    asset_id: number;
    role: SettlementAccountRole;
    member_id?: number | null;
    is_primary?: boolean;
    accepted_physical_balance?: string | null;
  }[];
  opening_adjustments: {
    asset_id: number;
    member_id: number;
    amount: string;
    kind: 'wallet_normalization';
    note?: string;
  }[];
  normalization_transaction_ids?: number[];
};

export type SettlementRebaselineWrite = {
  start_date: string;
  wallet_balances: { asset_id: number; accepted_physical_balance: string }[];
  opening_adjustments: SettlementConfigurationWrite['opening_adjustments'];
  normalization_transaction_ids: number[];
};

export type SettlementReserveAdjustmentWrite = {
  operating_reserve_adjustment: string;
};

export type SettlementReadinessItem = {
  code: string;
  [key: string]: unknown;
};

export type SettlementWalletReconciliation = {
  account_id: number;
  asset_id: number;
  asset_name: string;
  currency: string;
  balance_date: string;
  modeled_balance: string;
  accepted_physical_balance: string;
  difference: string;
  normalization_recorded: boolean;
};

export type SettlementWalletNormalizationCandidate = SettlementWalletNormalization & {
  selected: boolean;
  entries: { asset_id: number; asset_name: string; amount: string }[];
};

export type SettlementReadiness = {
  status: 'ready' | 'blocked';
  is_enabled: boolean;
  activation_date: string | null;
  baseline_date: string;
  start_date: string | null;
  base_currency: string;
  target_period: { year: number; month: number };
  blockers: SettlementReadinessItem[];
  warnings: SettlementReadinessItem[];
  wallet_reconciliations: SettlementWalletReconciliation[];
  wallet_normalization_candidates: SettlementWalletNormalizationCandidate[];
  allocation_coverage: {
    ownership_id: number;
    allocation_basis: string;
    status: string;
    observed_months: number;
    eligible_transaction_count: number;
    quality_reasons: string[];
  }[];
};
