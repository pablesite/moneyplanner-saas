// Hitos del progreso de capital anclados al presupuesto real del usuario.
//
// Cada tramo acumula grupos de gasto corriente (recurrente, año en curso). El
// capital que paga cada tramo NO se calcula aquí: lo devuelve Core vía
// GET /api/plan/capital-requirements/ con la misma matemática que el capital
// objetivo (inflación, pensiones como offset, periodo puente y tasa de
// retirada), para que hitos y denominador compartan eje. Si el presupuesto
// cambia, los tramos cambian y el capital se repide a Core.

import type { AnnualExpenseEntry } from '@/domains/budget/annual-entries';
import type { CapitalRequirementsResponse } from '@/domains/plan/types';

export type BudgetExpenseTier = {
  label: string;
  /** Gasto anual acumulado hasta este tramo. */
  annualExpense: number;
  /** Equivalente mensual del acumulado (lo que se pide a Core). */
  monthlyExpense: number;
};

export type BudgetMilestone = BudgetExpenseTier & {
  /** Capital requerido según Core para sostener el acumulado. */
  capitalNeeded: number;
  /** Posición sobre la barra (capital necesario / capital objetivo, en %). Puede superar 100. */
  positionPct: number | null;
  reached: boolean;
};

type TierSpec = { label: string; match: (entry: AnnualExpenseEntry) => boolean };

const CONSUMPTION = 'consumption_expenses';

function inSubcategories(values: string[]): TierSpec['match'] {
  const set = new Set(values);
  return (entry) => entry.category === CONSUMPTION && set.has(entry.subcategory);
}

// Orden del camino: primero lo que no puede faltar, después el resto de la
// vida corriente, luego lo prescindible y por último seguir ahorrando.
const TIERS: TierSpec[] = [
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
 * Tramos acumulados desde el presupuesto de gastos recurrentes del año dado.
 * Devuelve [] cuando no hay partidas que ancle los tramos.
 */
export function budgetExpenseTiers(
  entries: AnnualExpenseEntry[],
  fiscalYear: number,
): BudgetExpenseTier[] {
  const recurrent = entries.filter(
    (entry) =>
      entry.fiscalYear === fiscalYear &&
      entry.expenseType === 'recurrent' &&
      entry.isActive !== false,
  );
  const tiers: BudgetExpenseTier[] = [];
  let cumulative = 0;
  for (const tier of TIERS) {
    const tierAnnual = recurrent
      .filter(tier.match)
      .reduce((sum, entry) => sum + entry.amountAnnual, 0);
    // Un tramo sin partidas no aporta hito: dos puntos en el mismo sitio solo confunden.
    if (tierAnnual <= 0) continue;
    cumulative += tierAnnual;
    tiers.push({
      label: tier.label,
      annualExpense: cumulative,
      monthlyExpense: cumulative / 12,
    });
  }
  return tiers;
}

/**
 * Une los tramos con los capitales devueltos por Core (por posición: los
 * importes pedidos son los mensuales de cada tramo, en el mismo orden).
 * Devuelve [] si la respuesta no casa con los tramos: mejor el fallback que
 * hitos con capitales de otra petición.
 */
export function mergeTierCapitals(input: {
  tiers: BudgetExpenseTier[];
  requirements: CapitalRequirementsResponse['requirements'];
  productiveCapital: number;
  targetCapital: number;
}): BudgetMilestone[] {
  if (!input.tiers.length || input.tiers.length !== input.requirements.length) return [];
  return input.tiers.map((tier, index) => {
    const capitalNeeded = Number(input.requirements[index]!.capital_required_eur);
    return {
      ...tier,
      capitalNeeded,
      positionPct: input.targetCapital > 0 ? (capitalNeeded / input.targetCapital) * 100 : null,
      reached: input.productiveCapital >= capitalNeeded,
    };
  });
}
