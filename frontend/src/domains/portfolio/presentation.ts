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
  // El satélite: una bolsa acotada para experimentar, no una clase de riesgo. Lo que
  // importa de ella es cuánto pesa, no de qué está hecha.
  trading: 'Trading',
  other: 'Otros',
  // Distinta de "Otros": aquella es una respuesta —lo miraste y no encaja— y esta es su
  // ausencia. Un fondo o un ETF pueden ser cualquier cosa, así que aterrizan aquí hasta
  // que alguien lo diga, en vez de colarse en "Otros" como si estuviera decidido.
  unclassified: 'Sin clasificar',
};

// Tokens defined in portfolio.css, where the palette and its validation are documented.
// Nueve tonos, todos validados con el checker en claro y oscuro; "Otros" —que es un
// cajón, no una clase— toma el neutro, y "Sin clasificar" el mismo neutro con borde
// discontinuo, porque tampoco es una clase sino una pregunta sin contestar.
export const portfolioAssetClassColors: Record<string, string> = {
  equity: 'var(--a-pf-equity)',
  fixed_income: 'var(--a-pf-fixed-income)',
  real_estate: 'var(--a-pf-real-estate)',
  private_debt: 'var(--a-pf-private-debt)',
  commodities: 'var(--a-pf-commodities)',
  private_equity: 'var(--a-pf-private-equity)',
  crypto: 'var(--a-pf-crypto)',
  cash: 'var(--a-pf-cash)',
  trading: 'var(--a-pf-trading)',
  other: 'var(--a-pf-neutral)',
  unclassified: 'var(--a-pf-neutral)',
};

// Beyond this the palette cannot keep hues apart, so the tail is aggregated.
export const PORTFOLIO_MAX_COMPOSITION_SLICES = 9;

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

// Etiquetas de exposición. Son las que usan las fichas de fondo, para que copiar el dato
// sea leerlo y escribirlo sin traducir nada.
export const portfolioExposureBucketLabels: Record<string, string> = {
  north_america: 'Norteamérica',
  europe: 'Europa',
  spain: 'España',
  japan: 'Japón',
  asia_pacific: 'Asia-Pacífico',
  emerging: 'Emergentes',
  global: 'Global',
  technology: 'Tecnología',
  financials: 'Financiero',
  health_care: 'Salud',
  consumer_discretionary: 'Consumo discrecional',
  consumer_staples: 'Consumo básico',
  industrials: 'Industrial',
  energy: 'Energía',
  materials: 'Materiales',
  utilities: 'Servicios públicos',
  real_estate_sector: 'Inmobiliario',
  communication: 'Comunicación',
  index_fund: 'Fondo indexado',
  active_fund: 'Fondo activo',
  etf: 'ETF',
  pension_plan: 'Plan de pensiones',
  direct_equity: 'Acciones directas',
  crowdfunding: 'Crowdfunding',
  crypto: 'Criptoactivo',
  deposit: 'Depósito',
  other: 'Otros',
};

// Qué buckets se ofrecen en cada dimensión: mezclarlos dejaría poner "Tecnología" como
// geografía, que no significa nada.
export const portfolioExposureBuckets: Record<string, string[]> = {
  geography: [
    'north_america',
    'europe',
    'spain',
    'japan',
    'asia_pacific',
    'emerging',
    'global',
    'other',
  ],
  sector: [
    'technology',
    'financials',
    'health_care',
    'consumer_discretionary',
    'consumer_staples',
    'industrials',
    'energy',
    'materials',
    'utilities',
    'real_estate_sector',
    'communication',
    'other',
  ],
  vehicle: [
    'index_fund',
    'active_fund',
    'etf',
    'pension_plan',
    'direct_equity',
    'crowdfunding',
    'crypto',
    'deposit',
    'other',
  ],
};

export const portfolioExposureDimensionLabels: Record<string, string> = {
  geography: 'Geografía',
  sector: 'Sector',
  vehicle: 'Vehículo',
};
