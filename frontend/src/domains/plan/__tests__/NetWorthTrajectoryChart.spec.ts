/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import NetWorthTrajectoryChart from '@/domains/plan/components/NetWorthTrajectoryChart.vue';
import type { PlanTimelineMarker } from '@/domains/plan/usePlanEvents';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import { makeProjection, trajectoryRow } from './planFixtures';

function timeline(rows: Array<{ date: string; net_worth: string }>): NetWorthTimeline {
  return { rows } as unknown as NetWorthTimeline;
}

const baseTimeline = timeline([
  { date: '2025-01-31', net_worth: '100000' },
  { date: '2026-01-31', net_worth: '120000' },
]);

const baseProjection = makeProjection({
  trajectory: [
    trajectoryRow({ year: 2025, net_worth: '90000' }), // behind last historical -> dropped
    trajectoryRow({
      year: 2027,
      net_worth: '150000',
      productive_capital: '40000',
      target_capital: '900000',
    }),
    trajectoryRow({
      year: 2035,
      net_worth: '400000',
      productive_capital: '120000',
      target_capital: '1000000',
    }),
  ],
  summary: { target_year: makeProjection().summary.target_year },
});

describe('NetWorthTrajectoryChart', () => {
  it('renders historical and projected series paths and year axis labels', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-line.hist').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.proj').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.prod').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.target').exists()).toBe(true);
    const xLabels = wrapper.findAll('.plan-chart-x-label').map((n) => n.text());
    expect(xLabels.length).toBeGreaterThan(0);
  });

  it('drops projected rows that fall behind the last historical close', () => {
    // 2025 projected row is before the last historical date (2026-01) -> excluded,
    // so the projected path only spans 2027 and 2035.
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    const projPath = wrapper.find('.plan-chart-line.proj').attributes('d') ?? '';
    // A two-point path has exactly one move and one line command.
    expect((projPath.match(/[ML]/g) ?? []).length).toBe(2);
  });

  it('renders the target-year marker', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    const markerText = wrapper.findAll('.plan-chart-marker text').map((n) => n.text());
    expect(markerText.some((t) => t.includes('Objetivo 2035'))).toBe(true);
  });

  it('renders event markers clipped to the visible range with native detail', () => {
    const events: PlanTimelineMarker[] = [
      { id: 1, date: '2027-06-01', label: 'Coche Ana', detail: 'Vehículo', status: 'planned' },
      { id: 2, date: '2099-01-01', label: 'Fuera de rango', detail: 'x', status: 'planned' },
    ];
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection, events },
    });
    const eventGroups = wrapper.findAll('.plan-chart-event');
    expect(eventGroups).toHaveLength(1);
    // Sin <text> visible: el nombre vive en el tooltip nativo, como en Patrimonio.
    expect(wrapper.find('.plan-chart-event text').exists()).toBe(false);
    expect(wrapper.find('.plan-chart-event title').text()).toContain('Coche Ana');
    expect(wrapper.find('.plan-chart-event title').text()).toContain('Vehículo');
    expect(wrapper.find('.plan-chart-legend').text()).toContain('Acontecimiento');
  });

  it('hides the event legend entry when there are no events', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-legend').text()).not.toContain('Acontecimiento');
  });
});
