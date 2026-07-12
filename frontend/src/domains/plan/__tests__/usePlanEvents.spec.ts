/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { planEventMarkers } from '@/domains/plan/usePlanEvents';
import type { PlanEvent } from '@/domains/plan/types';

function event(overrides: Partial<PlanEvent> & { id: number }): PlanEvent {
  return {
    source_scenario: 1,
    name: `Evento ${overrides.id}`,
    event_type: 'vehicle',
    planned_date: '2027-06-01',
    actual_date: null,
    status: 'planned',
    planned_impact_json: {},
    actual_impact_json: {},
    created_at: '2026-07-11T00:00:00Z',
    updated_at: '2026-07-11T00:00:00Z',
    ...overrides,
    effective_end_date: overrides.effective_end_date ?? null,
  };
}

describe('planEventMarkers', () => {
  it('drops cancelled events', () => {
    const markers = planEventMarkers([event({ id: 1 }), event({ id: 2, status: 'cancelled' })]);
    expect(markers.map((m) => m.id)).toEqual([1]);
  });

  it('prefers actual_date over planned_date and sorts ascending', () => {
    const markers = planEventMarkers([
      event({ id: 1, planned_date: '2030-01-01' }),
      event({ id: 2, planned_date: '2027-01-01', actual_date: '2028-03-01' }),
    ]);
    expect(markers.map((m) => m.date)).toEqual(['2028-03-01', '2030-01-01']);
  });

  it('builds a detail line from the event type and planned impact', () => {
    const markers = planEventMarkers([
      event({
        id: 1,
        name: 'Coche Ana',
        event_type: 'vehicle',
        planned_impact_json: {
          comparison_delta: { net_worth: '15000', projected_year: -2 },
          budget_lines: [{}, {}, {}],
        },
      }),
    ]);
    const marker = markers[0]!;
    expect(marker.label).toBe('Coche Ana');
    expect(marker.detail).toContain('Vehículo');
    expect(marker.detail).toContain('+15.000 EUR');
    expect(marker.detail).toContain('-2 años');
    expect(marker.detail).toContain('3 partidas de presupuesto');
  });

  it('omits zero deltas from the detail', () => {
    const markers = planEventMarkers([
      event({
        id: 1,
        planned_impact_json: {
          comparison_delta: { net_worth: '0', projected_year: 0 },
          budget_lines: [],
        },
      }),
    ]);
    expect(markers[0]!.detail).toBe('Vehículo');
  });

  it('keeps a closed event as a historical marker', () => {
    const markers = planEventMarkers([
      event({ id: 1, planned_date: '2027-01-01', effective_end_date: '2030-07-01' }),
    ]);
    expect(markers).toHaveLength(1);
    expect(markers[0]!.date).toBe('2027-01-01');
  });
});
