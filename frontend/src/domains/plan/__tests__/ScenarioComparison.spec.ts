/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ScenarioComparison from '@/domains/plan/components/ScenarioComparison.vue';
import type { PlanScenarioComparison, ProjectionTrajectoryRow } from '@/domains/plan/types';
import { makeProjection, trajectoryRow } from './planFixtures';

function comparison(
  current: ProjectionTrajectoryRow[],
  simulated: ProjectionTrajectoryRow[],
): PlanScenarioComparison {
  return {
    scenario: { id: 1, name: 'Coche', template_type: 'vehicle', status: 'draft' },
    assumption_set: 'expected',
    current: makeProjection({ trajectory: current }),
    simulated: makeProjection({ trajectory: simulated }),
    delta: {
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

  it('does not treat a differing trajectory length as unchanged', () => {
    const wrapper = mount(ScenarioComparison, {
      props: {
        comparison: comparison(currentTrajectory, currentTrajectory.slice(0, 2)),
      },
    });
    expect(wrapper.find('.plan-comparison-unchanged').exists()).toBe(false);
  });
});
