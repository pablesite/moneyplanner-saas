import { toNumber } from '@/lib/format';
import type { PositionPerformance, PortfolioInstrument } from './types';

export const portfolioAssetClassLabels: Record<string, string> = {
  fixed_income: 'Renta fija',
  equity: 'Renta variable',
  real_estate: 'Inmobiliario',
  private_equity: 'Capital privado',
  safe_haven: 'Activos refugio',
  commodities: 'Materias primas',
  alternatives: 'Inversiones alternativas',
  trading: 'Trading',
  opportunity_cash: 'Liquidez para oportunidades',
  other: 'Otros',
};

// Tokens defined in portfolio.css, where the palette and its validation are documented.
// Only eight categorical hues survive the palette checker, so the two classes least
// likely to share a chart with the rest take the neutral token and the donut folds
// anything past eight into a single "Otras clases" slice.
export const portfolioAssetClassColors: Record<string, string> = {
  fixed_income: 'var(--a-pf-fixed-income)',
  equity: 'var(--a-pf-equity)',
  real_estate: 'var(--a-pf-real-estate)',
  safe_haven: 'var(--a-pf-safe-haven)',
  commodities: 'var(--a-pf-commodities)',
  alternatives: 'var(--a-pf-alternatives)',
  trading: 'var(--a-pf-trading)',
  other: 'var(--a-pf-other)',
  private_equity: 'var(--a-pf-neutral)',
  opportunity_cash: 'var(--a-pf-neutral)',
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
