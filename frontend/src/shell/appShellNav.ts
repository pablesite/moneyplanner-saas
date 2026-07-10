export type NavItem = {
  id: string;
  iconKey: 'status' | 'wealth' | 'budget' | 'movements' | 'close';
  label: string;
  mobileLabel: string;
  hint: string;
  to: string;
};

export const appShellNavItems: NavItem[] = [
  {
    id: 'plan',
    iconKey: 'status',
    label: 'Mi Plan',
    mobileLabel: 'Plan',
    hint: 'Proyección, cimientos y próximos pasos',
    to: '/plan',
  },
  {
    id: 'net-worth',
    iconKey: 'wealth',
    label: 'Patrimonio',
    mobileLabel: 'Patrimonio',
    hint: 'Activos, pasivos y evolución',
    to: '/patrimonio',
  },
  {
    id: 'budget',
    iconKey: 'budget',
    label: 'Presupuesto',
    mobileLabel: 'Presupuesto',
    hint: 'Plan anual de ingresos y gastos',
    to: '/presupuesto',
  },
  {
    id: 'accounting-movements',
    iconKey: 'movements',
    label: 'Contabilidad',
    mobileLabel: 'Movimientos',
    hint: 'Libro diario y cuentas contables',
    to: '/contabilidad',
  },
  {
    id: 'monthly-close',
    iconKey: 'close',
    label: 'Cierre mensual',
    mobileLabel: 'Cierre',
    hint: 'Liquidez, ingresos, gastos y residual',
    to: '/cierre-mensual',
  },
];
