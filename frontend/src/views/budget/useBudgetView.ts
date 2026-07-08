import { computed } from 'vue';
import { type BudgetDashboardMode, useBudgetDashboardPage } from './useBudgetDashboardPage';

// Superficie fina para la vista de Presupuesto (`/presupuesto`): fija el modo y
// reutiliza el motor de lógica compartido `useBudgetDashboardPage` sin duplicarlo.
export function useBudgetView() {
  return useBudgetDashboardPage(computed<BudgetDashboardMode>(() => 'budget'));
}

// Estado completo de la vista de Presupuesto, consumido como un único objeto `:page`
// por los componentes hijos (mismo patrón que `AccountingMovementsPageState`).
export type BudgetPageState = ReturnType<typeof useBudgetView>;
