export type MonthlyCloseStatus = 'draft' | 'finalized' | 'locked';
export type CoverageMode = 'ledger' | 'checkin' | 'mixed' | 'none';

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
  has_gaps: boolean;
  suggestions: {
    income: Record<string, string>;
    expense: Record<string, string>;
  };
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
    projected_year: number | null;
    target_year: number;
    projected_year_delta: number | null;
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
