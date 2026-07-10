/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NetWorthEvolutionChart from '../NetWorthEvolutionChart.vue';

const baseProps = {
  unit: 'EUR',
  seriesLabel: 'Patrimonio total',
};

describe('NetWorthEvolutionChart', () => {
  it('shows a labelled zero line and positive/negative line stops when the series crosses zero', () => {
    const wrapper = mount(NetWorthEvolutionChart, {
      props: {
        ...baseProps,
        points: [
          { date: '2026-01-31', shortLabel: 'ene 26', fullLabel: 'enero 2026', value: -120 },
          { date: '2026-02-28', shortLabel: 'feb 26', fullLabel: 'febrero 2026', value: 80 },
        ],
      },
    });

    expect(wrapper.find('.a-nw-evo-zero').exists()).toBe(true);
    expect(wrapper.text()).toContain('0 €');
    expect(wrapper.find('stop[stop-color="var(--neg)"]').exists()).toBe(true);
    expect(wrapper.find('stop[stop-color="var(--pos)"]').exists()).toBe(true);
  });

  it('does not show the zero line when all values are positive', () => {
    const wrapper = mount(NetWorthEvolutionChart, {
      props: {
        ...baseProps,
        points: [
          { date: '2026-01-31', shortLabel: 'ene 26', fullLabel: 'enero 2026', value: 120 },
          { date: '2026-02-28', shortLabel: 'feb 26', fullLabel: 'febrero 2026', value: 180 },
        ],
      },
    });

    expect(wrapper.find('.a-nw-evo-zero').exists()).toBe(false);
  });

  it('renders plan markers on the matching month', () => {
    const wrapper = mount(NetWorthEvolutionChart, {
      props: {
        ...baseProps,
        points: [
          { date: '2028-01-31', shortLabel: 'ene 28', fullLabel: 'enero 2028', value: 120 },
          { date: '2028-02-29', shortLabel: 'feb 28', fullLabel: 'febrero 2028', value: 180 },
        ],
        markers: [
          {
            id: 1,
            date: '2028-02-01',
            label: 'Comprar coche',
            detail: 'Vehículo · 1 partida de presupuesto',
            status: 'planned',
          },
        ],
      },
    });

    expect(wrapper.find('.a-nw-evo-marker').exists()).toBe(true);
    expect(wrapper.text()).toContain('Comprar coche');
  });
});
