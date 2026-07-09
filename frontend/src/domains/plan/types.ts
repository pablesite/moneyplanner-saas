export type HouseholdType = 'single' | 'family';
export type PlanProfile = 'security' | 'balanced' | 'growth';
export type ProjectionScenario = 'prudent' | 'expected' | 'favorable';
export type DataQualityLevel = 'initial' | 'medium' | 'high' | 'needs_review';

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

export type PlanMemberPayload = Omit<PlanMember, 'id'>;

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
