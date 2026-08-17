export type PortfolioPeriod = {
  from: string;
  to: string;
};

export type PortfolioReturn = {
  nominal: string | null;
  real: string | null;
  twr: string | null;
  mwr_xirr: string | null;
  twr_annualized: string | null;
  method: 'twr' | 'linked_dietz' | 'modified_dietz' | 'unavailable';
  estimated: boolean;
};

export type PortfolioCoverage = {
  value: 'complete' | 'partial';
  opening_positions: { covered: number; total: number };
  closing_positions: { covered: number; total: number };
  cash: 'complete' | 'partial' | 'ownership_unavailable';
  twr: 'exact' | 'estimated' | 'unavailable';
  mwr: 'available' | 'unavailable';
  realized_pnl: 'complete' | 'partial';
  fx: 'complete' | 'partial';
};

export type PortfolioOverview = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  value: string | null;
  covered_value: string;
  net_contributed: string;
  monetary_result: string | null;
  return: PortfolioReturn;
  coverage: PortfolioCoverage;
  position_count: number;
  fresh_position_count: number;
};

export type PortfolioPerformance = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  opening_value: string | null;
  closing_value: string | null;
  covered_opening_value: string;
  covered_closing_value: string;
  net_contributed: string;
  monetary_result: string | null;
  gross_result: string | null;
  costs: string;
  income: string;
  realized_pnl: string | null;
  unrealized_pnl: string | null;
  return: PortfolioReturn;
  coverage: PortfolioCoverage;
  fx_issues: string[];
};

export type PositionPerformance = {
  position_id: number;
  instrument_id: number;
  instrument_name: string;
  container_id: number;
  container_name: string;
  status: 'active' | 'archived';
  tracking_style: string;
  native_value: string | null;
  native_currency: string | null;
  observed_on: string | null;
  value_status: 'fresh' | 'stale' | 'missing' | 'at_cost';
  performance: PortfolioPerformance;
  attribution: {
    asset: string | null;
    fx: string | null;
    total: string | null;
    method: 'closing_fx_residual' | 'unavailable';
  };
};

export type PortfolioPositionsResponse = {
  period: PortfolioPeriod;
  member_id: number | null;
  results: PositionPerformance[];
};

export type PortfolioTimelinePoint = {
  date: string;
  value: string | null;
  net_contributed: string;
  monetary_result: string | null;
  coverage: 'complete' | 'partial';
};

export type PortfolioTimeline = {
  period: PortfolioPeriod;
  member_id: number | null;
  currency: string;
  results: PortfolioTimelinePoint[];
};

export type PortfolioQuality = {
  period: PortfolioPeriod;
  status: 'ready' | 'stale' | 'needs_review';
  positions: { total: number; fresh: number; stale: number; missing: number; at_cost: number };
  ownership_missing: number;
  cash_ownership_missing: boolean;
  metric_coverage: PortfolioCoverage;
  fx_issues: string[];
};

export type PortfolioInstrument = {
  id: number;
  name: string;
  asset_class: string;
  instrument_type: string;
  quote_currency: string;
};

export type PortfolioQuery = {
  date_from?: string;
  date_to?: string;
  member_id?: number;
};

export type PortfolioWorkspacePayload = {
  overview: PortfolioOverview;
  performance: PortfolioPerformance;
  positions: PortfolioPositionsResponse;
  timeline: PortfolioTimeline;
  quality: PortfolioQuality;
  instruments: PortfolioInstrument[];
};

export type PortfolioOperationType =
  | 'transfer'
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'interest'
  | 'fee'
  | 'valuation'
  | 'split'
  | 'identifier_change'
  | 'position_transfer'
  | 'adjustment';

export type PortfolioOperationPosition = {
  id: number;
  name: string;
  container_id: number;
  container_name: string;
  tracking_style: string;
  status: 'active' | 'archived';
  operational: boolean;
  history_mode: 'reconstructed' | 'cutoff';
  history_start_date: string | null;
  setup_confirmed: boolean;
  asset_class: string;
  instrument_is_custom: boolean;
  performance_coverage: {
    status: 'complete' | 'partial' | 'missing';
    start_date: string | null;
    has_flows: boolean;
    has_valuations: boolean;
  };
  position_detail_coverage: {
    status: 'complete' | 'partial' | 'missing' | 'value_only';
    tracks_units: boolean;
  };
};

export type PortfolioPositionSetupPayload = {
  tracking_style: 'value_based' | 'units_based';
  history_mode: 'reconstructed' | 'cutoff';
  history_start_date: string | null;
  container_id?: number;
  asset_class?: string;
};

export type PortfolioCashAccount = {
  id: number;
  container_id: number;
  name: string;
  currency: string;
  available: string;
};

export type PortfolioOperationOptions = {
  positions: PortfolioOperationPosition[];
  cash_accounts: PortfolioCashAccount[];
  containers: { id: number; name: string; container_type: string }[];
  asset_classes: { value: string; label: string }[];
};

export type PortfolioOperationPayload = {
  operation_type: PortfolioOperationType;
  booking_date: string;
  position_id?: number;
  target_position_id?: number;
  cash_account_id?: number;
  target_cash_account_id?: number;
  amount?: string;
  destination_amount?: string;
  units?: string;
  unit_price?: string;
  fee?: string;
  currency?: string;
  new_identifier?: string;
  ratio_denominator?: string;
  description?: string;
  external_id?: string;
  note?: string;
  preview_token?: string;
};

export type PortfolioOperationPreview = {
  preview: {
    operation_type: PortfolioOperationType;
    position: { id: number; name: string } | null;
    amount: string;
    fee: string;
    booking_date: string;
    cash?: {
      id: number;
      name: string;
      currency: string;
      available_before: string;
    };
  };
  preview_token: string;
};

export type PortfolioImportRow = {
  id: number;
  row_number: number;
  raw_data: Record<string, string>;
  normalized_data: Record<string, string | number>;
  status: 'pending' | 'valid' | 'error' | 'duplicate' | 'confirmed';
  errors: Record<string, string>;
};

export type PortfolioImportBatch = {
  id: number;
  filename: string;
  status: 'uploaded' | 'previewed' | 'partial' | 'confirmed' | 'failed';
  headers: string[];
  mapping: Record<string, string>;
  row_count: number;
  confirmed_count: number;
  duplicate_file?: boolean;
  rows: PortfolioImportRow[];
};

export type PortfolioValuationResync = {
  positions_checked: number;
  valuations_created: number;
};
