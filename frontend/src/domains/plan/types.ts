export type HouseholdType = 'single' | 'family';
export type PlanProfile = 'security' | 'balanced' | 'growth';
export type ProjectionScenario = 'prudent' | 'expected' | 'favorable';
export type DataQualityLevel = 'initial' | 'medium' | 'high' | 'needs_review';
export type PlanScenarioTemplate =
  | 'housing'
  | 'vehicle'
  | 'studies'
  | 'renovation'
  | 'sabbatical'
  | 'reduced_hours'
  | 'business'
  | 'debt_payoff'
  | 'generic';
export type PlanScenarioStatus = 'draft' | 'accepted' | 'discarded';

export type PlanMember = {
  id: number;
  name: string;
  role: 'adult';
  is_active: boolean;
  birth_date: string | null;
  employment_income_end_date: string | null;
  pension_start_date: string | null;
  estimated_monthly_pension_today_eur: string | null;
  other_future_income_today_eur: string | null;
};

// Core deriva `employment_income_end_date` y `pension_start_date` desde `birth_date`
// con la edad legal de jubilación, e ignora lo que mande el cliente: no se envían.
export type PlanMemberPayload = Omit<
  PlanMember,
  'id' | 'employment_income_end_date' | 'pension_start_date'
>;

export type FinancialPlan = {
  id: number;
  household_type: HouseholdType;
  target_date: string;
  target_monthly_income_today_eur: string;
  projection_end_date: string;
  preservation_target_eur: string | null;
  preserved_asset_ids: number[] | null;
  profile: PlanProfile;
  status: 'active' | 'archived';
  members: PlanMember[];
  created_at: string;
  updated_at: string;
};

export type FinancialPlanPayload = {
  household_type: HouseholdType;
  target_date: string;
  target_monthly_income_today_eur: string;
  projection_end_date: string;
  preservation_target_eur: string | null;
  preserved_asset_ids: number[] | null;
  profile: PlanProfile;
  member_ids?: number[];
};

export type PlanMetric<T = string | number | null> = {
  value: T;
  unit: 'EUR' | 'percent' | 'year';
  assumptions: ProjectionAssumptions;
  calculated_at: string | null;
  quality_level: DataQualityLevel;
};

export type ProjectionAssumptions = {
  name: ProjectionScenario;
  inflation_rate: string;
  productive_return_rate: string;
  non_productive_appreciation_rate: string;
  income_growth_rate: string;
  contribution_growth_rate: string;
  withdrawal_rate: string;
  default_liability_rate: string;
};

export type ProjectionSummary = {
  target_capital: PlanMetric<string>;
  target_capital_denominator: PlanMetric<string>;
  productive_capital: PlanMetric<string>;
  security_capital: PlanMetric<string>;
  net_worth: PlanMetric<string>;
  monthly_sustainable_income: PlanMetric<string>;
  progress_percent: PlanMetric<string>;
  projected_year: PlanMetric<number | null>;
  target_year: PlanMetric<number>;
  preservation_target_eur: PlanMetric<string | null>;
};

export type ProjectionTrajectoryRow = {
  year: number;
  productive_capital: string;
  security_capital: string;
  non_productive_assets: string;
  liabilities: string;
  net_worth: string;
  target_capital: string;
  annual_target_income: string;
  future_income: string;
  annual_withdrawals: string;
  preservation_ok: boolean;
};

export type ClassifiedPlanAsset = {
  asset_id: number;
  name: string;
  category: string;
  subcategory: string;
  function: PlanAssetFunction;
  inferred_function: PlanAssetFunction;
  override_function: PlanAssetFunction | null;
  gross_value: string;
  associated_liabilities: string;
  net_value: string;
  currency: string;
};

export type PlanAssetFunction =
  | 'productive'
  | 'security'
  | 'short_term_goal'
  | 'family_use'
  | 'unknown';

export type AssetFunctionResponse = {
  productive_capital: string;
  security_capital: string;
  family_use_capital: string;
  short_term_goal_capital: string;
  unknown_capital: string;
  total_assets: string;
  total_liabilities: string;
  net_worth: string;
  assets: ClassifiedPlanAsset[];
};

export type AssetFunctionUpdate = {
  asset_id: number;
  function: PlanAssetFunction | null;
};

export type ProjectionResponse = {
  scenario: ProjectionScenario;
  input_hash: string;
  calculated_at: string | null;
  quality_level: DataQualityLevel;
  quality_factors: Record<string, boolean>;
  assumptions: ProjectionAssumptions;
  summary: ProjectionSummary;
  trajectory: ProjectionTrajectoryRow[];
  classification: AssetFunctionResponse;
};

export type ProjectionSnapshot = {
  id: number;
  assumption_set: ProjectionScenario;
  calculated_at: string;
  input_hash: string;
  quality_level: DataQualityLevel;
  is_official: boolean;
  result_json: ProjectionResponse;
};

export type PlanBudgetLinePayload = {
  kind: 'expense' | 'income';
  name: string;
  category: string;
  subcategory: string;
  amount: string;
  fiscal_year: number;
  target_month: number | null;
  term_start_month: number | null;
  term_end_year: number | null;
  term_end_month: number | null;
  cashflow_role: string;
};

export type ScenarioEventPayload = {
  start_date: string;
  end_date: string | null;
  initial_outflow: string;
  monthly_expense_delta: string;
  monthly_income_delta: string;
  monthly_contribution_delta: string;
  new_asset_value: string;
  new_asset_type: PlanAssetFunction | null;
  new_debt_principal: string;
  new_debt_interest_rate: string | null;
  new_debt_term_months: number | null;
  metadata_json: {
    budget_lines?: PlanBudgetLinePayload[];
    one_off_items?: Array<{ name: string; amount: string }>;
    [key: string]: unknown;
  };
};

export type PlanScenario = {
  id: number;
  name: string;
  template_type: PlanScenarioTemplate;
  status: PlanScenarioStatus;
  events: (ScenarioEventPayload & { id: number })[];
  created_at: string;
  accepted_at: string | null;
};

export type PlanScenarioPayload = {
  name: string;
  template_type: PlanScenarioTemplate;
  events: ScenarioEventPayload[];
};

export type PlanScenarioComparison = {
  scenario: Pick<PlanScenario, 'id' | 'name' | 'template_type' | 'status'>;
  assumption_set: ProjectionScenario;
  current: ProjectionResponse;
  simulated: ProjectionResponse;
  delta: {
    projected_year: number | null;
    productive_capital: string;
    net_worth: string;
    target_capital: string;
  };
  snapshot_id: number;
};

export type PlanEvent = {
  id: number;
  source_scenario: number | null;
  name: string;
  event_type: PlanScenarioTemplate;
  planned_date: string;
  actual_date: string | null;
  effective_end_date: string | null;
  status: 'planned' | 'occurred' | 'cancelled';
  planned_impact_json: Record<string, unknown>;
  actual_impact_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

/** Decisión ya tomada: no genera presupuesto, adopta el que ya existe. */
export type OccurredEventPayload = {
  name: string;
  event_type: PlanScenarioTemplate;
  decision_date: string;
  expense_entry_ids: number[];
  income_entry_ids: number[];
  note?: string;
};

export type PlanEventCloseResponse = {
  event: PlanEvent;
  projection: ProjectionResponse;
  budget_changes: {
    changed: Array<Record<string, unknown>>;
    deleted: Array<Record<string, unknown>>;
  };
};

export type PlanManagedBudgetLine = {
  id: number;
  name: string;
  fiscal_year: number;
  amount_annual: string;
  time_profile: string;
  cashflow_role: string;
};

export type PlanEventBudgetLines = {
  event: { id: number; name: string };
  income: PlanManagedBudgetLine[];
  expenses: PlanManagedBudgetLine[];
};

export type PlanFoundations = {
  period: string;
  cash_flow: {
    score: number;
    structural_annual_income: string;
    structural_operating_expense: string;
    operating_surplus: string;
    committed_surplus: string;
    operating_surplus_ratio: string | null;
  };
  emergency_fund: {
    score: number;
    eligible_liquidity: string;
    coverage_months_base: string | null;
    coverage_months_committed: string | null;
    target_months: string;
  };
  debt: {
    score: number;
    total_debt: string;
    unbacked_debt: string;
    high_cost_debt: string;
    weighted_tae_pct: string | null;
    debt_payment_to_income: string | null;
  };
  net_worth_health: {
    score: number;
    assets_value: string;
    illiquid_assets_share: string | null;
    top_asset_share: string | null;
    diversification_index: string | null;
  };
  planned_contribution: {
    annual_amount: string;
    monthly_amount: string;
  };
  data_quality: {
    score: number;
    flags: Record<string, boolean>;
  };
};

export type PlanFinding = {
  id: number;
  code: string;
  severity: 'info' | 'warning' | 'critical';
  period: string;
  evidence_json: Record<string, unknown>;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
};

export type PlanRecommendation = {
  id: number;
  finding: number;
  code: string;
  priority: number;
  action_json: {
    title?: string;
    summary?: string;
    reason?: string;
    rule?: string;
    [key: string]: unknown;
  };
  impact_json: Record<string, unknown>;
  alternatives_json: string[];
  status: 'open' | 'accepted' | 'dismissed' | 'snoozed';
  created_at: string;
  updated_at: string;
};
