// Salud de los datasets de mercado (IPC y divisas).
//
// La vista mostraba `covered_until` como fecha suelta, así que la pregunta real
// de la pantalla —¿están mis datos al día?— exigía restar fechas a ojo. Aquí se
// traduce a un estado operativo por dataset.
import type { MarketDataState } from '@/domains/aux-data/types';

export type MarketDataset = 'inflation' | 'fx';
export type CoverageStatus = 'ok' | 'warn' | 'stale' | 'unknown';

export type CoverageReading = {
  status: CoverageStatus;
  label: string;
  coveredUntil: string | null;
  daysBehind: number | null;
};

// El IPC se publica a mediados del mes siguiente, así que un retraso de semanas
// es normal; las divisas son diarias y un par de días ya es señal.
const THRESHOLDS: Record<MarketDataset, { ok: number; warn: number }> = {
  inflation: { ok: 45, warn: 75 },
  fx: { ok: 3, warn: 7 },
};

const MS_PER_DAY = 86_400_000;

export function daysBetween(from: string, to: Date): number | null {
  const parsed = new Date(`${from}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  const reference = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.floor((reference - parsed.getTime()) / MS_PER_DAY);
}

export function describeCoverage(
  state: MarketDataState | null | undefined,
  dataset: MarketDataset,
  today: Date = new Date(),
): CoverageReading {
  const coveredUntil = state?.covered_until ?? null;
  if (!coveredUntil) {
    return { status: 'unknown', label: 'Sin datos', coveredUntil: null, daysBehind: null };
  }

  const daysBehind = daysBetween(coveredUntil, today);
  if (daysBehind === null) {
    return { status: 'unknown', label: 'Sin datos', coveredUntil, daysBehind: null };
  }

  const { ok, warn } = THRESHOLDS[dataset];
  if (daysBehind <= ok) {
    return { status: 'ok', label: 'Al día', coveredUntil, daysBehind };
  }
  const suffix = `${daysBehind} días de retraso`;
  return {
    status: daysBehind <= warn ? 'warn' : 'stale',
    label: suffix,
    coveredUntil,
    daysBehind,
  };
}

// El peor estado de todos los scopes del dataset: un solo par de divisas
// atascado ya es una incidencia, aunque el resto vaya al día.
const SEVERITY: Record<CoverageStatus, number> = { ok: 0, unknown: 1, warn: 2, stale: 3 };

export function worstCoverage(
  states: MarketDataState[],
  dataset: MarketDataset,
  today: Date = new Date(),
): CoverageReading {
  if (!states.length) {
    return { status: 'unknown', label: 'Sin datos', coveredUntil: null, daysBehind: null };
  }
  return states
    .map((state) => describeCoverage(state, dataset, today))
    .reduce((worst, current) =>
      SEVERITY[current.status] > SEVERITY[worst.status] ? current : worst,
    );
}

export function countIncidents(states: MarketDataState[]): number {
  return states.filter((state) => Boolean(state.last_error)).length;
}

export function latestSuccess(states: MarketDataState[]): string | null {
  let latest: string | null = null;
  for (const state of states) {
    const value = state.last_success_at;
    if (!value) continue;
    if (!latest || value > latest) latest = value;
  }
  return latest;
}
