import type {
  PlanAssetFunction,
  PlanBudgetLinePayload,
  PlanScenarioStatus,
  PlanScenarioTemplate,
  ProjectionScenario,
  ScenarioEventPayload,
} from '@/domains/plan/types';

export type ScenarioFieldKey =
  | 'endDate'
  | 'initialOutflow'
  | 'newAsset'
  | 'monthlyExpense'
  | 'monthlyIncome'
  | 'monthlyContribution'
  | 'debt';

export type ScenarioTemplateDefinition = {
  value: PlanScenarioTemplate;
  label: string;
  description: string;
  assetFunction: PlanAssetFunction | null;
  fields: ScenarioFieldKey[];
  incomeAsReduction?: boolean;
  budgetDefaults: Pick<
    PlanBudgetLinePayload,
    'kind' | 'category' | 'subcategory' | 'cashflow_role'
  >;
};

export const scenarioTemplates: ScenarioTemplateDefinition[] = [
  {
    value: 'vehicle',
    label: 'Coche',
    description: 'Compra de vehículo con entrada, financiación y gasto de uso.',
    assetFunction: 'family_use',
    fields: ['initialOutflow', 'newAsset', 'monthlyExpense', 'debt'],
    budgetDefaults: {
      kind: 'expense',
      category: 'tangible_assets',
      subcategory: 'vehicle_purchase',
      cashflow_role: 'asset_purchase',
    },
  },
  {
    value: 'housing',
    label: 'Vivienda',
    description: 'Compra de inmueble o segunda vivienda con posible financiación.',
    assetFunction: 'productive',
    fields: ['initialOutflow', 'newAsset', 'monthlyExpense', 'debt'],
    budgetDefaults: {
      kind: 'expense',
      category: 'real_estate_assets',
      subcategory: 'property_purchase',
      cashflow_role: 'asset_purchase',
    },
  },
  {
    value: 'renovation',
    label: 'Reforma',
    description: 'Desembolso de mejora o reforma con impacto temporal.',
    assetFunction: 'family_use',
    fields: ['endDate', 'initialOutflow', 'newAsset', 'monthlyExpense', 'debt'],
    budgetDefaults: {
      kind: 'expense',
      category: 'real_estate_assets',
      subcategory: 'property_improvements',
      cashflow_role: 'asset_purchase',
    },
  },
  {
    value: 'studies',
    label: 'Estudios',
    description: 'Formación con gasto temporal o cambio de ingresos.',
    assetFunction: null,
    fields: ['endDate', 'initialOutflow', 'monthlyExpense', 'monthlyIncome'],
    budgetDefaults: {
      kind: 'expense',
      category: 'consumption_expenses',
      subcategory: 'education_growth',
      cashflow_role: 'operating',
    },
  },
  {
    value: 'sabbatical',
    label: 'Excedencia',
    description: 'Pausa laboral con reducción de ingresos durante un periodo.',
    assetFunction: null,
    fields: ['endDate', 'monthlyExpense', 'monthlyIncome'],
    incomeAsReduction: true,
    budgetDefaults: {
      kind: 'expense',
      category: 'consumption_expenses',
      subcategory: 'other_consumption_expenses',
      cashflow_role: 'operating',
    },
  },
  {
    value: 'reduced_hours',
    label: 'Reducción jornada',
    description: 'Menos ingresos laborales de forma temporal o indefinida.',
    assetFunction: null,
    fields: ['endDate', 'monthlyIncome'],
    incomeAsReduction: true,
    budgetDefaults: {
      kind: 'expense',
      category: 'consumption_expenses',
      subcategory: 'other_consumption_expenses',
      cashflow_role: 'operating',
    },
  },
  {
    value: 'business',
    label: 'Negocio',
    description: 'Inversión o cambio recurrente asociado a actividad propia.',
    assetFunction: 'productive',
    fields: [
      'initialOutflow',
      'newAsset',
      'monthlyExpense',
      'monthlyIncome',
      'monthlyContribution',
      'debt',
    ],
    budgetDefaults: {
      kind: 'expense',
      category: 'financial_investments',
      subcategory: 'other_financial_investments',
      cashflow_role: 'investment',
    },
  },
  {
    value: 'debt_payoff',
    label: 'Amortizar deuda',
    description: 'Cancelación o reducción de una deuda prevista.',
    assetFunction: null,
    fields: ['initialOutflow', 'monthlyContribution'],
    budgetDefaults: {
      kind: 'expense',
      category: 'consumption_expenses',
      subcategory: 'personal_loan_repayment',
      cashflow_role: 'temporary_commitment',
    },
  },
  {
    value: 'generic',
    label: 'Genérico',
    description: 'Decisión financiera sin plantilla específica.',
    assetFunction: 'unknown',
    fields: [
      'endDate',
      'initialOutflow',
      'newAsset',
      'monthlyExpense',
      'monthlyIncome',
      'monthlyContribution',
      'debt',
    ],
    budgetDefaults: {
      kind: 'expense',
      category: 'consumption_expenses',
      subcategory: 'other_consumption_expenses',
      cashflow_role: 'operating',
    },
  },
];

export function scenarioTemplateLabel(value: PlanScenarioTemplate): string {
  return scenarioTemplates.find((item) => item.value === value)?.label ?? value;
}

export const assetFunctionLabels: Record<PlanAssetFunction, string> = {
  productive: 'Productivo',
  security: 'Seguridad',
  short_term_goal: 'Objetivo corto plazo',
  family_use: 'Uso familiar',
  unknown: 'Sin clasificar',
};

export function assetFunctionLabel(value: PlanAssetFunction): string {
  return assetFunctionLabels[value] ?? value;
}

export function projectionScenarioLabel(value: ProjectionScenario): string {
  const labels: Record<ProjectionScenario, string> = {
    prudent: 'Prudente',
    expected: 'Esperado',
    favorable: 'Favorable',
  };
  return labels[value] ?? value;
}

export function scenarioStatusLabel(value: PlanScenarioStatus): string {
  const labels: Record<PlanScenarioStatus, string> = {
    draft: 'Borrador',
    accepted: 'Incorporado',
    discarded: 'Descartado',
  };
  return labels[value] ?? value;
}

export function defaultScenarioEvent(template: PlanScenarioTemplate): ScenarioEventPayload {
  const definition =
    scenarioTemplates.find((item) => item.value === template) ??
    scenarioTemplates[scenarioTemplates.length - 1]!;
  const start = new Date();
  start.setFullYear(start.getFullYear() + 1, 0, 1);
  const startDate = start.toISOString().slice(0, 10);
  return {
    start_date: startDate,
    end_date: null,
    initial_outflow: '0.00',
    monthly_expense_delta: '0.00',
    monthly_income_delta: '0.00',
    monthly_contribution_delta: '0.00',
    new_asset_value: '0.00',
    new_asset_type: definition.assetFunction,
    new_debt_principal: '0.00',
    new_debt_interest_rate: null,
    new_debt_term_months: null,
    metadata_json: {
      budget_lines: [],
      budget_defaults: definition.budgetDefaults,
    },
  };
}
