/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import NetWorthTrajectoryChart from '@/domains/plan/components/NetWorthTrajectoryChart.vue';
import type { PlanTimelineMarker } from '@/domains/plan/usePlanEvents';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import { makeProjection, trajectoryRow } from './planFixtures';

function timeline(
  rows: Array<{
    date: string;
    net_worth: string;
    assets_by_category?: Record<string, string>;
  }>,
): NetWorthTimeline {
  return { rows } as unknown as NetWorthTimeline;
}

const baseTimeline = timeline([
  {
    date: '2025-01-31',
    net_worth: '100000',
    assets_by_category: { cash: '20000', investments: '30000' },
  },
  {
    date: '2026-01-31',
    net_worth: '120000',
    assets_by_category: { cash: '25000', investments: '40000' },
  },
]);

const baseProjection = makeProjection({
  trajectory: [
    trajectoryRow({ year: 2025, net_worth: '90000' }), // behind last historical -> dropped
    trajectoryRow({
      year: 2027,
      net_worth: '150000',
      productive_capital: '40000',
      security_capital: '25000',
      target_capital: '900000',
    }),
    trajectoryRow({
      year: 2035,
      net_worth: '400000',
      productive_capital: '120000',
      security_capital: '30000',
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
    expect(wrapper.find('.plan-chart-line.prod.historical-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.prod.projected-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.security.historical-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.security.projected-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.target').exists()).toBe(true);
    expect(wrapper.findAll('.plan-chart-capital-label')).toHaveLength(4);
    expect(wrapper.find('.plan-chart-axis-titles').text()).toContain('Patrimonio');
    expect(wrapper.find('.plan-chart-axis-titles').text()).toContain('Capital');
    expect(wrapper.find('.plan-chart-legend').text()).toContain('Fondo de emergencia');
    const xLabels = wrapper.findAll('.plan-chart-x-label').map((n) => n.text());
    expect(xLabels.length).toBeGreaterThan(0);
  });

  it('keeps every historical point instead of truncating the chart to 36 closes', () => {
    const rows = Array.from({ length: 40 }, (_, index) => ({
      date: `${2000 + index}-01-31`,
      net_worth: String(100000 + index * 1000),
      assets_by_category: { cash: '20000', investments: '30000' },
    }));
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: timeline(rows), projection: baseProjection },
    });

    const historicalPath = wrapper.find('.plan-chart-line.hist').attributes('d') ?? '';
    expect(historicalPath.match(/[ML]/g) ?? []).toHaveLength(40);
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
    expect(wrapper.find('.plan-chart-event text').text()).toContain('Coche Ana');
    expect(wrapper.find('.plan-chart-event text').text()).toContain('jun 2027');
    expect(wrapper.find('.plan-chart-event circle').attributes('cy')).not.toBe('262');
    expect(wrapper.find('.plan-chart-event title').text()).toContain('Coche Ana');
    expect(wrapper.find('.plan-chart-event title').text()).toContain('Vehículo');
    expect(wrapper.find('.plan-chart-event').attributes('aria-label')).toContain('Coche Ana');
    expect(wrapper.find('.plan-chart-legend').text()).toContain('Decisión');
  });

  it('hides the event legend entry when there are no events', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-legend').text()).not.toContain('Decisión');
  });

  it('offers the projected data as an accessible table', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-table').exists()).toBe(true);
    expect(wrapper.findAll('.plan-chart-table tbody tr')).toHaveLength(3);
    expect(wrapper.find('.plan-chart-table').text()).toContain('Activos');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Liquidez');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Inmuebles');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Capital productivo');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Mobiliario y vehículos');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Patrimonio neto');
  });
});
