import { toNumber } from '@/lib/format';
import type { PositionPerformance, PortfolioInstrument } from './types';

export const portfolioAssetClassLabels: Record<string, string> = {
  cash: 'Efectivo',
  fixed_income: 'Renta fija',
  equity: 'Renta variable',
  mixed: 'Mixto',
  real_assets: 'Activos reales',
  crypto: 'Cripto',
  other: 'Otros',
};

// Tokens defined in portfolio.css, where the palette and its validation are documented.
export const portfolioAssetClassColors: Record<string, string> = {
  cash: 'var(--a-pf-cash)',
  fixed_income: 'var(--a-pf-fixed-income)',
  equity: 'var(--a-pf-equity)',
  mixed: 'var(--a-pf-mixed)',
  real_assets: 'var(--a-pf-real-assets)',
  crypto: 'var(--a-pf-crypto)',
  other: 'var(--a-pf-other)',
};

export function instrumentMap(instruments: PortfolioInstrument[]) {
  return new Map(instruments.map((instrument) => [instrument.id, instrument]));
}

export function positionBaseValue(position: PositionPerformance): number {
  return toNumber(position.performance.closing_value ?? position.performance.covered_closing_value);
}

export function freshnessLabel(status: PositionPerformance['value_status']): string {
  if (status === 'fresh') return 'Al día';
  if (status === 'stale') return 'Desactualizada';
  return 'Sin valoración';
}

export function returnLabel(method: string, estimated: boolean): string {
  if (method === 'twr') return 'TWR exacta';
  if (method === 'linked_dietz') return 'TWR encadenada';
  if (method === 'modified_dietz' && estimated) return 'TWR estimada';
  return 'Rentabilidad no disponible';
}
