import { computed } from 'vue';
import { type BudgetDashboardMode, useBudgetDashboardPage } from './useBudgetDashboardPage';

// Superficie fina para la vista de Cierre mensual (`/cierre-mensual`): fija el
// modo y reutiliza el motor de lógica compartido `useBudgetDashboardPage`.
export function useMonthlyCloseView() {
  return useBudgetDashboardPage(computed<BudgetDashboardMode>(() => 'monthly-close'));
}
