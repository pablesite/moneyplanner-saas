export type MonthlyCloseStatus = 'draft' | 'finalized' | 'locked';
export type CoverageMode = 'ledger' | 'checkin' | 'mixed' | 'none';

export type SettlementQualityItem = {
  code: string;
  [key: string]: unknown;
};

export type SettlementAllocation = {
  ownership_id: number;
  allocation_basis: 'explicit_split' | 'recurring_income_12m';
  fiscal_year: number;
  month: number;
  window_start: string;
  window_end: string;
  base_currency: string;
  status: 'ready' | 'provisional' | 'blocked';
  quality_reasons: string[];
  observed_months: number | null;
  eligible_transaction_count: number | null;
  excluded_transaction_count: number | null;
  total_qualifying_income: string | null;
  source_hash: string | null;
  is_frozen: boolean;
  shares: Array<{
    member_id: number;
    member_name: string;
    qualifying_income: string | null;
    percent: string | null;
  }>;
};

export type SettlementRecommendationStatus =
  'recommended' | 'accepted' | 'applied' | 'partially_applied' | 'cancelled';

export type SettlementTransaction = {
  id: number;
  booking_date: string;
  origin: string;
  action: 'application' | 'reconciliation' | 'reversal';
  amount: string;
  idempotency_key: string;
};

export type SettlementRecommendation = {
  id?: number;
  from_account_id: number;
  to_account_id: number;
  member_id: number | null;
  ownership_id: number;
  amount: string;
  currency: string;
  reason: string;
  status?: SettlementRecommendationStatus;
  applied_amount?: string;
  remaining_amount?: string;
  accepted_at?: string | null;
  cancelled_at?: string | null;
  transactions?: SettlementTransaction[];
  account_reconciliation?: {
    source_balance: string;
    destination_balance: string;
    target_reached: boolean;
  } | null;
};

export type SettlementCandidate = {
  transaction_id: number;
  booking_date: string;
  description: string;
  origin: string;
  amount: string;
  currency: string;
};

export type OwnershipSettlement = {
  status: 'disabled' | 'not_ready' | 'ready' | 'finalized';
  calculation_status?: 'not_ready' | 'ready';
  is_frozen: boolean;
  computed_at?: string;
  period?: { start: string; end: string };
  target_period?: { year: number; month: number };
  base_currency?: string;
  opening_source?: 'activation' | 'previous_close';
  allocations?: SettlementAllocation[];
  economic_balances?: Array<{
    member_id: number;
    opening?: string;
    income?: string;
    expense?: string;
    compensation?: string;
    requirement?: string;
    closing: string;
    excess?: string;
  }>;
  accounts?: Array<{
    account_id: number;
    asset_id: number | null;
    liability_id?: number | null;
    name: string;
    role:
      | 'operating'
      | 'personal_destination'
      | 'allocation_destination'
      | 'physical_cash'
      | 'credit_card'
      | 'investment_position'
      | 'investment_cash';
    ownership_id: number | null;
    opening: string;
    physical_delta: string;
    observed_close: string;
    target_close: string;
    closing_by_member: Array<{ member_id: number; amount: string }>;
    target_by_member: Array<{ member_id: number; amount: string }>;
  }>;
  reserves?: Array<{
    entry_id: number;
    name: string;
    kind: 'reserve' | 'allocation';
    cashflow_role: string;
    ownership_id: number;
    settlement_account_id: number;
    amount: string;
    currency: string;
    members: Array<{ member_id: number; amount: string }>;
  }>;
  compensations?: Array<{
    transaction_id: number;
    booking_date: string;
    description: string;
    ownership_id: number;
    members: Array<{ member_id: number; amount: string }>;
  }>;
  recommendations?: SettlementRecommendation[];
  reconciliation?: {
    physical_total: string;
    economic_total: string;
    target_total: string;
    physical_vs_economic: string;
    economic_vs_target: string;
  };
  quality: { blockers: SettlementQualityItem[]; warnings: SettlementQualityItem[] };
  source_hash?: string;
};

export type MonthlyCloseStateResponse = {
  monthly_close: {
    id: number;
    fiscal_year: number;
    month: number;
    status: MonthlyCloseStatus;
    finalized_at: string | null;
    locked_at: string | null;
    income_total_snapshot: string | null;
    expense_total_snapshot: string | null;
    liquidity_total_snapshot: string | null;
    notes: string;
  };
  income: {
    executed: string;
    planned: string;
    coverage_mode: CoverageMode;
    completion_ratio: number;
  };
  expense: {
    executed: string;
    planned: string;
    coverage_mode: CoverageMode;
    completion_ratio: number;
  };
  liquidity: {
    current_total: string | null;
    previous_total: string | null;
    delta: string | null;
    completion_ratio: number;
    has_checkins: boolean;
  };
  liquidity_adjustments?: {
    total: string;
    count: number;
    entries: Array<{
      transaction_id: number;
      booking_date: string;
      description: string;
      account_name: string;
      amount: string;
    }>;
  };
  financial_result?: {
    eligible_income: string;
    total_outflows: string;
    living_expense: string;
    financial_contributions: string;
    financial_savings: string;
    net_savings: string;
    savings_rate: string | null;
    real_estate_formation: string;
    tangible_asset_purchases: string;
    debt_principal_repayment: string;
    other_outflows: string;
  };
  has_gaps: boolean;
  suggestions: {
    income: Record<string, string>;
    expense: Record<string, string>;
  };
  ownership_settlement: OwnershipSettlement;
};

export type MonthlyClosePlanImpact = {
  monthly_close: {
    id: number;
    fiscal_year: number;
    month: number;
    status: MonthlyCloseStatus;
  };
  calculated_at: string;
  trajectory: {
    status: 'on_track' | 'delayed' | 'off_track';
    // Fecha que titula el plan y con la que se juzga el estado de la trayectoria.
    sustainable_year: number | null;
    projected_year: number | null;
    target_year: number;
    sustainable_year_delta: number | null;
  };
  capital: {
    productive_capital: string;
    productive_capital_delta: string | null;
    net_worth: string;
    net_worth_delta: string | null;
  };
  data_quality: string;
  findings: Array<{
    id: number;
    code: string;
    severity: 'info' | 'warning' | 'critical';
    period: string;
    evidence_json: Record<string, unknown>;
    status: string;
  }>;
  recommended_action: {
    id: number;
    code: string;
    priority: number;
    action_json: {
      title?: string;
      summary?: string;
      reason?: string;
      [key: string]: unknown;
    };
    impact_json: Record<string, unknown>;
    alternatives_json: string[];
    status: string;
  } | null;
};
