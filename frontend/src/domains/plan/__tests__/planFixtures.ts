import type {
  AssetFunctionResponse,
  PlanMetric,
  ProjectionAssumptions,
  ProjectionResponse,
  ProjectionScenario,
  ProjectionSummary,
  ProjectionTrajectoryRow,
} from '@/domains/plan/types';

const assumptions: ProjectionAssumptions = {
  name: 'expected',
  inflation_rate: '0.0250',
  productive_return_rate: '0.0500',
  non_productive_appreciation_rate: '0.0150',
  income_growth_rate: '0.0200',
  contribution_growth_rate: '0.0200',
  withdrawal_rate: '0.0350',
  default_liability_rate: '0.0450',
};

export function metric<T>(value: T): PlanMetric<T> {
  return { value, unit: 'EUR', assumptions, calculated_at: null, quality_level: 'high' };
}

export function trajectoryRow(
  overrides: Partial<ProjectionTrajectoryRow> & { year: number },
): ProjectionTrajectoryRow {
  return {
    productive_capital: '0.00',
    security_capital: '0.00',
    non_productive_assets: '0.00',
    liabilities: '0.00',
    net_worth: '0.00',
    target_capital: '0.00',
    annual_target_income: '0.00',
    future_income: '0.00',
    annual_withdrawals: '0.00',
    preservation_ok: true,
    ...overrides,
  };
}

const emptyClassification: AssetFunctionResponse = {
  productive_capital: '0.00',
  security_capital: '0.00',
  family_use_capital: '0.00',
  short_term_goal_capital: '0.00',
  unknown_capital: '0.00',
  total_assets: '0.00',
  total_liabilities: '0.00',
  net_worth: '0.00',
  assets: [],
};

export function makeSummary(overrides: Partial<ProjectionSummary> = {}): ProjectionSummary {
  return {
    target_capital: metric('1000000.00'),
    target_capital_denominator: metric('1000000.00'),
    productive_capital: metric('50000.00'),
    security_capital: metric('10000.00'),
    net_worth: metric('200000.00'),
    monthly_sustainable_income: metric('150.00'),
    progress_percent: metric('5'),
    projected_year: metric<number | null>(null),
    target_year: metric<number>(2035),
    preservation_target_eur: metric<string | null>(null),
    ...overrides,
  };
}

export function makeProjection(
  overrides: {
    scenario?: ProjectionScenario;
    trajectory?: ProjectionTrajectoryRow[];
    summary?: Partial<ProjectionSummary>;
    classification?: Partial<AssetFunctionResponse>;
  } = {},
): ProjectionResponse {
  return {
    scenario: overrides.scenario ?? 'expected',
    input_hash: 'hash',
    calculated_at: null,
    quality_level: 'high',
    quality_factors: {},
    assumptions,
    summary: makeSummary(overrides.summary),
    trajectory: overrides.trajectory ?? [],
    classification: { ...emptyClassification, ...overrides.classification },
  };
}
