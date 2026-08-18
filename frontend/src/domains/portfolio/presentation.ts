import { toNumber } from '@/lib/format';
import type { PositionPerformance, PortfolioInstrument } from './types';

// Una sola dimensión: de qué depende que la posición suba o baje. El rol (refugio), la
// estrategia (trading) y el propósito (liquidez para oportunidades) son ejes distintos y
// al mezclarlos aquí sacaban a cada activo de su clase real.
export const portfolioAssetClassLabels: Record<string, string> = {
  equity: 'Renta variable',
  fixed_income: 'Renta fija',
  real_estate: 'Inmobiliario',
  private_debt: 'Deuda privada',
  commodities: 'Materias primas',
  private_equity: 'Capital privado',
  crypto: 'Criptoactivos',
  cash: 'Liquidez',
  other: 'Otros',
};

// Tokens defined in portfolio.css, where the palette and its validation are documented.
// Ocho tonos son el máximo que aguanta el checker, así que las ocho clases reales llevan
// tono propio y "Otros" —que es un cajón, no una clase— toma el neutro.
export const portfolioAssetClassColors: Record<string, string> = {
  equity: 'var(--a-pf-equity)',
  fixed_income: 'var(--a-pf-fixed-income)',
  real_estate: 'var(--a-pf-real-estate)',
  private_debt: 'var(--a-pf-private-debt)',
  commodities: 'var(--a-pf-commodities)',
  private_equity: 'var(--a-pf-private-equity)',
  crypto: 'var(--a-pf-crypto)',
  cash: 'var(--a-pf-cash)',
  other: 'var(--a-pf-neutral)',
};

// Beyond this the palette cannot keep hues apart, so the tail is aggregated.
export const PORTFOLIO_MAX_COMPOSITION_SLICES = 8;

export function instrumentMap(instruments: PortfolioInstrument[]) {
  return new Map(instruments.map((instrument) => [instrument.id, instrument]));
}

export function positionBaseValue(position: PositionPerformance): number {
  return toNumber(position.performance.closing_value ?? position.performance.covered_closing_value);
}

export function freshnessLabel(status: PositionPerformance['value_status']): string {
  if (status === 'fresh') return 'Al día';
  if (status === 'stale') return 'Desactualizada';
  // The balance is today's, so it is not outdated; what is missing is a valuation.
  if (status === 'at_cost') return 'A coste';
  return 'Sin valoración';
}

export function returnLabel(method: string, estimated: boolean): string {
  if (method === 'twr') return 'TWR exacta';
  if (method === 'linked_dietz') return 'TWR encadenada';
  if (method === 'modified_dietz' && estimated) return 'TWR estimada';
  return 'Rentabilidad no disponible';
}
