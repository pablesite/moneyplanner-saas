// Hitos del progreso de capital anclados al presupuesto real del usuario.
//
// Cada tramo acumula grupos de gasto corriente (recurrente, año en curso) y
// se traduce a capital con la fórmula exacta de la renta sostenible de Core:
// renta mensual = capital × tasa de retirada / 12, luego
// capital necesario = gasto anual acumulado / tasa de retirada.
// Si el presupuesto cambia, los hitos cambian con él.

import type { AnnualExpenseEntry } from '@/domains/budget/annual-entries';

export type BudgetMilestone = {
  label: string;
  /** Gasto anual acumulado hasta este tramo. */
  annualExpense: number;
  /** Equivalente mensual del acumulado. */
  monthlyExpense: number;
  /** Capital cuya renta sostenible paga el acumulado. */
  capitalNeeded: number;
  /** Posición sobre la barra (capital necesario / capital objetivo, en %). Puede superar 100. */
  positionPct: number | null;
  reached: boolean;
};

type Tier = { label: string; match: (entry: AnnualExpenseEntry) => boolean };

const CONSUMPTION = 'consumption_expenses';

function inSubcategories(values: string[]): Tier['match'] {
  const set = new Set(values);
  return (entry) => entry.category === CONSUMPTION && set.has(entry.subcategory);
}

// Orden del camino: primero lo que no puede faltar, después el resto de la
// vida corriente, luego lo prescindible y por último seguir ahorrando.
const TIERS: Tier[] = [
  {
    label: 'Techo, comida, familia y salud',
    match: inSubcategories([
      'housing_home',
      'living_expenses',
      'family_childcare',
      'health_wellbeing',
    ]),
  },
  {
    label: '+ Transporte, formación y compromisos',
    match: inSubcategories([
      'transport_mobility',
      'education_growth',
      'financial_commitments',
      'personal_loan_repayment',
      'other_consumption_expenses',
    ]),
  },
  {
    label: '+ Ocio y regalos',
    match: inSubcategories(['leisure_lifestyle', 'gifts_donations']),
  },
  {
    label: '+ Ahorro e inversión',
    match: (entry) => entry.cashflowRole === 'savings' || entry.cashflowRole === 'investment',
  },
];

/**
 * Hitos acumulados desde el presupuesto de gastos. Devuelve [] cuando no hay
 * datos con los que anclarlos (sin partidas recurrentes del año o sin tasa de
 * retirada): el consumidor decide su fallback.
 */
export function budgetCapitalMilestones(input: {
  entries: AnnualExpenseEntry[];
  fiscalYear: number;
  withdrawalRate: number;
  productiveCapital: number;
  targetCapital: number;
}): BudgetMilestone[] {
  if (!(input.withdrawalRate > 0)) return [];
  const recurrent = input.entries.filter(
    (entry) =>
      entry.fiscalYear === input.fiscalYear &&
      entry.expenseType === 'recurrent' &&
      entry.isActive !== false,
  );
  const milestones: BudgetMilestone[] = [];
  let cumulative = 0;
  for (const tier of TIERS) {
    const tierAnnual = recurrent
      .filter(tier.match)
      .reduce((sum, entry) => sum + entry.amountAnnual, 0);
    // Un tramo sin partidas no aporta hito: dos puntos en el mismo sitio solo confunden.
    if (tierAnnual <= 0) continue;
    cumulative += tierAnnual;
    const capitalNeeded = cumulative / input.withdrawalRate;
    milestones.push({
      label: tier.label,
      annualExpense: cumulative,
      monthlyExpense: cumulative / 12,
      capitalNeeded,
      positionPct: input.targetCapital > 0 ? (capitalNeeded / input.targetCapital) * 100 : null,
      reached: input.productiveCapital >= capitalNeeded,
    });
  }
  return milestones;
}
