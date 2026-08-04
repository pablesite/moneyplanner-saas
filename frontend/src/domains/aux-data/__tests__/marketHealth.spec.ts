import { describe, expect, it } from 'vitest';
import {
  countIncidents,
  describeCoverage,
  latestSuccess,
  worstCoverage,
} from '@/domains/aux-data/marketHealth';
import type { MarketDataState } from '@/domains/aux-data/types';

const TODAY = new Date('2026-08-05T10:00:00Z');

function state(overrides: Partial<MarketDataState> = {}): MarketDataState {
  return {
    scope: 'ES',
    required_start_date: '2020-01-01',
    covered_until: '2026-08-04',
    last_attempt_at: '2026-08-05T06:00:00Z',
    last_success_at: '2026-08-05T06:00:00Z',
    last_error: null,
    ...overrides,
  };
}

describe('marketHealth', () => {
  it('trata el retraso normal del IPC como al día y el de divisas como incidencia', () => {
    // El IPC se publica a mediados del mes siguiente: 30 días de retraso es lo
    // esperado. En divisas, diarias, ese mismo retraso está obsoleto.
    const thirtyDaysBehind = state({ covered_until: '2026-07-06' });

    expect(describeCoverage(thirtyDaysBehind, 'inflation', TODAY).status).toBe('ok');
    expect(describeCoverage(thirtyDaysBehind, 'fx', TODAY).status).toBe('stale');
  });

  it('clasifica la cobertura de divisas por antigüedad', () => {
    expect(describeCoverage(state({ covered_until: '2026-08-04' }), 'fx', TODAY).status).toBe('ok');
    expect(describeCoverage(state({ covered_until: '2026-08-01' }), 'fx', TODAY).status).toBe(
      'warn',
    );
    expect(describeCoverage(state({ covered_until: '2026-07-20' }), 'fx', TODAY).status).toBe(
      'stale',
    );
  });

  it('etiqueta el retraso en días y la ausencia de datos', () => {
    const reading = describeCoverage(state({ covered_until: '2026-08-01' }), 'fx', TODAY);
    expect(reading.daysBehind).toBe(4);
    expect(reading.label).toBe('4 días de retraso');

    const never = describeCoverage(state({ covered_until: null }), 'fx', TODAY);
    expect(never.status).toBe('unknown');
    expect(never.label).toBe('Sin datos');
  });

  it('resume el dataset por su peor scope', () => {
    const states = [
      state({ scope: 'USD->EUR', covered_until: '2026-08-04' }),
      state({ scope: 'BTC->USD', covered_until: '2026-07-01' }),
    ];

    const worst = worstCoverage(states, 'fx', TODAY);
    expect(worst.status).toBe('stale');
    expect(worstCoverage([], 'fx', TODAY).status).toBe('unknown');
  });

  it('cuenta incidencias y toma el último éxito', () => {
    const states = [
      state({ scope: 'a', last_error: 'timeout', last_success_at: '2026-08-01T06:00:00Z' }),
      state({ scope: 'b', last_error: null, last_success_at: '2026-08-05T06:00:00Z' }),
      state({ scope: 'c', last_error: null, last_success_at: null }),
    ];

    expect(countIncidents(states)).toBe(1);
    expect(latestSuccess(states)).toBe('2026-08-05T06:00:00Z');
    expect(latestSuccess([state({ last_success_at: null })])).toBeNull();
  });
});
