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

export type SettlementConfiguration = {
  is_enabled: boolean;
  activation_date: string | null;
  base_currency: string;
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
};

export type SettlementReadinessItem = {
  code: string;
  [key: string]: unknown;
};

export type SettlementReadiness = {
  status: 'ready' | 'blocked';
  is_enabled: boolean;
  activation_date: string | null;
  base_currency: string;
  target_period: { year: number; month: number };
  blockers: SettlementReadinessItem[];
  warnings: SettlementReadinessItem[];
  allocation_coverage: {
    ownership_id: number;
    allocation_basis: string;
    status: string;
    observed_months: number;
    eligible_transaction_count: number;
    quality_reasons: string[];
  }[];
};
