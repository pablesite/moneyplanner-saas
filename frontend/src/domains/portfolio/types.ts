export type PortfolioPeriod = {
  from: string;
  to: string;
};

export type PortfolioReturn = {
  nominal: string | null;
  real: string | null;
  twr: string | null;
  mwr_xirr: string | null;
  method: 'twr' | 'modified_dietz' | 'unavailable';
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
  value_status: 'fresh' | 'stale' | 'missing';
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
  positions: { total: number; fresh: number; stale: number; missing: number };
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
