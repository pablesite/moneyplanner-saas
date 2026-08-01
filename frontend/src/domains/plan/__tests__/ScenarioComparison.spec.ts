/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ScenarioComparison from '@/domains/plan/components/ScenarioComparison.vue';
import type { PlanScenarioComparison, ProjectionTrajectoryRow } from '@/domains/plan/types';
import { makeProjection, trajectoryRow } from './planFixtures';

function comparison(
  current: ProjectionTrajectoryRow[],
  simulated: ProjectionTrajectoryRow[],
  sustainable: { current: number | null; simulated: number | null } = {
    current: null,
    simulated: null,
  },
): PlanScenarioComparison {
  const delta =
    sustainable.current == null || sustainable.simulated == null
      ? null
      : sustainable.simulated - sustainable.current;
  return {
    scenario: { id: 1, name: 'Coche', template_type: 'vehicle', status: 'draft' },
    assumption_set: 'expected',
    current: makeProjection({ trajectory: current }),
    simulated: makeProjection({ trajectory: simulated }),
    sustainable_year: sustainable,
    delta: {
      sustainable_year: delta,
      projected_year: null,
      productive_capital: '0.00',
      net_worth: '0.00',
      target_capital: '0.00',
    },
    snapshot_id: 1,
  };
}

// target_year defaults to 2035 in the fixtures; horizon = last trajectory year.
const currentTrajectory = [
  trajectoryRow({ year: 2027, net_worth: '100000', productive_capital: '40000' }),
  trajectoryRow({ year: 2035, net_worth: '400000', productive_capital: '160000' }),
  trajectoryRow({ year: 2040, net_worth: '600000', productive_capital: '300000' }),
];

describe('ScenarioComparison', () => {
  it('reports no change when the trajectories are identical', () => {
    const wrapper = mount(ScenarioComparison, {
      props: {
        comparison: comparison(
          currentTrajectory,
          currentTrajectory.map((r) => ({ ...r })),
        ),
      },
    });
    expect(wrapper.find('.plan-comparison-unchanged').exists()).toBe(true);
    expect(wrapper.text()).toContain('no cambia la proyección');
  });

  it('shows signed trajectory deltas at the target year and horizon when they differ', () => {
    const simulated = [
      trajectoryRow({ year: 2027, net_worth: '100000', productive_capital: '40000' }),
      trajectoryRow({ year: 2035, net_worth: '415000', productive_capital: '175000' }),
      trajectoryRow({ year: 2040, net_worth: '720000', productive_capital: '420000' }),
    ];
    const wrapper = mount(ScenarioComparison, {
      props: { comparison: comparison(currentTrajectory, simulated) },
    });
    expect(wrapper.find('.plan-comparison-unchanged').exists()).toBe(false);
    const text = wrapper.text();
    // Rows are built for the target year (2035) and the horizon (2040).
    expect(text).toContain('Patrimonio neto en 2035');
    expect(text).toContain('Capital productivo en 2040');
    // Signed deltas: +15.000 at 2035 net worth, +120.000 at 2040 net worth.
    const rows = wrapper.findAll('.plan-comparison-row').map((r) => r.text());
    const nw2035 = rows.find((r) => r.includes('Patrimonio neto en 2035')) ?? '';
    expect(nw2035).toMatch(/\+.*15\.000/);
  });

  it('compares the sustainable date, which is the one the plan headline uses', () => {
    const simulated = [
      trajectoryRow({ year: 2027, net_worth: '100000', productive_capital: '40000' }),
      trajectoryRow({ year: 2035, net_worth: '380000', productive_capital: '140000' }),
      trajectoryRow({ year: 2040, net_worth: '560000', productive_capital: '260000' }),
    ];
    const wrapper = mount(ScenarioComparison, {
      props: {
        comparison: comparison(currentTrajectory, simulated, { current: 2043, simulated: 2045 }),
      },
    });
    const row = wrapper
      .findAll('.plan-comparison-row')
      .map((node) => node.text())
      .find((text) => text.includes('Fecha sostenible'));

    expect(row).toBeDefined();
    expect(row).toContain('2043');
    expect(row).toContain('2045');
    // Retrasar la fecha es empeorar: el delta se marca en negativo.
    expect(row).toContain('+2 años');
    expect(wrapper.find('.plan-comparison-row .neg').exists()).toBe(true);
  });

  it('does not treat a differing trajectory length as unchanged', () => {
    const wrapper = mount(ScenarioComparison, {
      props: {
        comparison: comparison(currentTrajectory, currentTrajectory.slice(0, 2)),
      },
    });
    expect(wrapper.find('.plan-comparison-unchanged').exists()).toBe(false);
  });
});
