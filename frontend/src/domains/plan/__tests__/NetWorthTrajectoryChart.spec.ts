/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import NetWorthTrajectoryChart from '@/domains/plan/components/NetWorthTrajectoryChart.vue';
import type { PlanTimelineMarker } from '@/domains/plan/usePlanEvents';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import type { PlanMember } from '@/domains/plan/types';
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

const members: PlanMember[] = [
  {
    id: 1,
    name: 'Pablo',
    role: 'adult',
    is_active: true,
    birth_date: '1980-01-01',
    employment_income_end_date: null,
    pension_start_date: null,
    estimated_monthly_pension_today_eur: null,
    other_future_income_today_eur: null,
  },
  {
    id: 2,
    name: 'Ana',
    role: 'adult',
    is_active: true,
    birth_date: '1982-01-01',
    employment_income_end_date: null,
    pension_start_date: null,
    estimated_monthly_pension_today_eur: null,
    other_future_income_today_eur: null,
  },
];

describe('NetWorthTrajectoryChart', () => {
  it('renders historical and projected series paths and year axis labels', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection, members },
    });
    expect(wrapper.find('.plan-chart-line.hist').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.proj').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-area.historical').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-area.projected').exists()).toBe(true);
    expect(wrapper.findAll('.plan-chart-point.historical')).toHaveLength(2);
    expect(wrapper.findAll('.plan-chart-point.projected')).toHaveLength(2);
    expect(wrapper.find('.plan-chart-line.prod.historical-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.prod.projected-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.security.historical-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.security.projected-segment').exists()).toBe(true);
    expect(wrapper.find('.plan-chart-line.target').exists()).toBe(true);
    const capitalLabels = wrapper.findAll('.plan-chart-capital-label').map((node) => node.text());
    expect(capitalLabels).toContain('100k');
    expect(capitalLabels).not.toContain('100,0k');
    expect(wrapper.findAll('.plan-chart-y-grid').length).toBeGreaterThan(4);
    expect(wrapper.findAll('.plan-chart-x-grid')).toHaveLength(3);
    expect(wrapper.find('.plan-chart-axis-titles').text()).toContain('Patrimonio');
    expect(wrapper.find('.plan-chart-axis-titles').text()).toContain('Capital');
    const seriesLegend = wrapper.find('[aria-label="Series"]');
    const readingLegend = wrapper.find('[aria-label="Tipo de dato"]');
    expect(seriesLegend.text()).toContain('Patrimonio');
    expect(seriesLegend.text()).toContain('Capital productivo');
    expect(seriesLegend.text()).toContain('Fondo de emergencia');
    expect(seriesLegend.text()).toContain('Capital objetivo');
    expect(readingLegend.text()).toContain('Histórico');
    expect(readingLegend.text()).toContain('Proyección');
    const years = wrapper.findAll('.plan-chart-x-year').map((node) => node.text());
    const ages = wrapper.findAll('.plan-chart-x-age').map((node) => node.text());
    expect(years).toEqual(['2025', '2030', '2035']);
    expect(ages).toEqual(['45/43 años', '50/48 años', '55/53 años']);
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

  it('selects historical and projected ranges independently', async () => {
    const rows = Array.from({ length: 12 }, (_, index) => ({
      date: `${2015 + index}-01-31`,
      net_worth: String(100000 + index * 10000),
      assets_by_category: { cash: '20000', investments: '30000' },
    }));
    const projection = makeProjection({
      trajectory: Array.from({ length: 20 }, (_, index) =>
        trajectoryRow({
          year: 2027 + index,
          net_worth: String(220000 + index * 20000),
          productive_capital: String(50000 + index * 10000),
        }),
      ),
    });
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: timeline(rows), projection },
    });
    const historicalButtons = wrapper.findAll('[aria-label="Años de histórico"] button');
    const projectionButtons = wrapper.findAll('[aria-label="Años de proyección"] button');
    const history3Years = historicalButtons.find((button) => button.text() === '3a');
    const projection5Years = projectionButtons.find((button) => button.text() === '5a');

    expect(wrapper.findAll('.plan-chart-point.historical')).toHaveLength(12);
    expect(wrapper.findAll('.plan-chart-point.projected')).toHaveLength(20);
    expect(wrapper.findAll('.plan-chart-table tbody tr')).toHaveLength(20);

    await history3Years?.trigger('click');
    await projection5Years?.trigger('click');

    expect(history3Years?.attributes('aria-pressed')).toBe('true');
    expect(projection5Years?.attributes('aria-pressed')).toBe('true');
    expect(wrapper.findAll('.plan-chart-point.historical')).toHaveLength(4);
    expect(wrapper.findAll('.plan-chart-point.projected')).toHaveLength(5);
    expect(wrapper.findAll('.plan-chart-table tbody tr')).toHaveLength(5);
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
    expect(markerText.some((t) => t.includes('Objetivo · cierre 2034'))).toBe(true);
  });

  it('aligns annual forecast points with the matching end-of-year ticks', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection, members },
    });
    const tick2035 = wrapper
      .findAll('.plan-chart-x-label')
      .find((node) => node.find('.plan-chart-x-year').text() === '2035');
    const projected2035 = wrapper.findAll('.plan-chart-point.projected').at(1);

    expect(tick2035).toBeDefined();
    expect(projected2035).toBeDefined();
    expect(tick2035?.attributes('x')).toBe(projected2035?.attributes('cx'));
  });

  it('marks readiness at the close before withdrawals begin', () => {
    const projection = makeProjection({
      trajectory: [
        trajectoryRow({ year: 2037, net_worth: '500000' }),
        trajectoryRow({ year: 2038, net_worth: '480000', annual_withdrawals: '40000' }),
      ],
    });
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: {
        timeline: baseTimeline,
        projection,
        desiredYear: 2038,
        sustainableYear: 2038,
      },
    });
    const labels = wrapper.findAll('.plan-chart-marker text').map((node) => node.text());
    const readinessX = wrapper.find('.plan-chart-point.projected').attributes('cx');

    expect(labels).toContain('Objetivo · cierre 2037');
    expect(labels).toContain('Sostenible · cierre 2037');
    expect(
      wrapper
        .findAll('.plan-chart-marker line')
        .every((line) => line.attributes('x1') === readinessX),
    ).toBe(true);
  });

  it('keeps future years hoverable when the tooltip overlaps the chart', async () => {
    const projection = makeProjection({
      trajectory: [
        trajectoryRow({ year: 2035, net_worth: '400000' }),
        trajectoryRow({ year: 2041, net_worth: '500000' }),
        trajectoryRow({ year: 2042, net_worth: '520000' }),
      ],
    });
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection },
    });
    const svg = wrapper.find('.plan-chart');
    Object.defineProperty(svg.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 960 }),
    });

    await svg.trigger('mousemove', { clientX: 959 });

    expect(wrapper.find('.plan-chart-tooltip strong').text()).toContain('2042');
    expect(wrapper.find('.plan-chart-tooltip').classes()).toContain('is-left');
    expect(wrapper.find('.plan-chart-tooltip-metrics').text()).toContain('Activos');
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
    expect(wrapper.find('[aria-label="Hitos"]').text()).toContain('Decisión');
  });

  it('hides the event legend entry when there are no events', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-legend').text()).not.toContain('Decisión');
    expect(wrapper.find('[aria-label="Hitos"]').exists()).toBe(false);
  });

  it('offers the projected data as an accessible table', () => {
    const wrapper = mount(NetWorthTrajectoryChart, {
      props: { timeline: baseTimeline, projection: baseProjection },
    });
    expect(wrapper.find('.plan-chart-table').exists()).toBe(true);
    expect(wrapper.findAll('.plan-chart-table tbody tr')).toHaveLength(2);
    expect(wrapper.find('.plan-chart-table summary').text()).toContain('2027–2035 · 2 años');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Activos');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Liquidez');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Fondo de emergencia');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Inmuebles');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Capital productivo');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Capital objetivo');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Mobiliario y vehículos');
    expect(wrapper.find('.plan-chart-table').text()).toContain('Patrimonio neto');
    expect(wrapper.find('.plan-chart-table .is-productive').text()).toContain('40.000');
  });
});
