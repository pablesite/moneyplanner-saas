/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PortfolioEvolutionChart from '../PortfolioEvolutionChart.vue';
import type { PortfolioTimelinePoint } from '../../types';

function point(
  date: string,
  value: string | null,
  contributedToDate: string,
): PortfolioTimelinePoint {
  return {
    date,
    value,
    net_contributed: '0',
    contributed_to_date: contributedToDate,
    monetary_result: null,
    return: { nominal: '0.1', twr_annualized: '0.1', method: 'twr', estimated: false },
    coverage: 'complete',
  };
}

function months(count: number): PortfolioTimelinePoint[] {
  return Array.from({ length: count }, (_, index) => {
    const month = String((index % 12) + 1).padStart(2, '0');
    const year = 2020 + Math.floor(index / 12);
    return point(`${year}-${month}-28`, String(1000 + index * 10), String(1000 + index * 5));
  });
}

describe('PortfolioEvolutionChart', () => {
  it('splits each month into what was contributed and what the market did', () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: {
        currency: 'EUR',
        // 1.000 → 1.600 aportando 400: los otros 200 son revalorización.
        points: [point('2026-01-31', '1000', '500'), point('2026-02-28', '1600', '900')],
      },
    });

    const rows = wrapper.findAll('.a-pf-chart-data tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[1]!.text()).toContain('+400,00');
    expect(rows[1]!.text()).toContain('+200,00');
  });

  it('reports a fall as revaluation when the contribution kept flowing in', () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: {
        currency: 'EUR',
        // Aportas 300 y aun así cierras 100 por debajo: el mercado se llevó 400.
        points: [point('2026-01-31', '5000', '4000'), point('2026-02-28', '4900', '4300')],
      },
    });

    const row = wrapper.findAll('.a-pf-chart-data tbody tr')[1]!;
    expect(row.text()).toContain('+300,00');
    expect(row.text()).toContain('-400,00');
  });

  it('labels every month in a short window and thins them out in a long one', () => {
    const short = mount(PortfolioEvolutionChart, {
      props: { currency: 'EUR', points: months(13) },
    });
    const long = mount(PortfolioEvolutionChart, {
      props: { currency: 'EUR', points: months(96) },
    });

    // Trece cierres caben rotulados; noventa y seis no, y ahí se dejan unas ocho fechas
    // en vez de las tres fijas —inicio, medio y fin— que no situaban nada.
    expect(short.findAll('.a-pf-chart-axis text')).toHaveLength(13);
    const longLabels = long.findAll('.a-pf-chart-axis text');
    expect(longLabels.length).toBeGreaterThanOrEqual(7);
    expect(longLabels.length).toBeLessThanOrEqual(9);
  });

  it('keeps the floating readout out of the way until the chart is hovered', async () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: { currency: 'EUR', points: months(13) },
    });
    // jsdom no mide: sin un ancho real el cursor no se puede resolver, así que se
    // simula el que tendría el panel.
    wrapper.element.getBoundingClientRect = () =>
      ({ left: 0, width: 1280, top: 0, height: 400 }) as DOMRect;

    expect(wrapper.find('.a-pf-chart-tip').exists()).toBe(false);
    expect(wrapper.find('.a-pf-chart-readout').text()).toContain('1.120,00');

    await wrapper.get('.a-pf-chart-plot').trigger('mousemove', { clientX: 640 });

    expect(wrapper.find('.a-pf-chart-tip').exists()).toBe(true);
    expect(wrapper.find('.a-pf-chart-readout').exists()).toBe(false);
  });

  it('separates cumulative return from value and contributions', async () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: { currency: 'EUR', points: months(13) },
    });

    await wrapper.get('[aria-label="Lectura del gráfico"] button:last-child').trigger('click');

    expect(wrapper.text()).toContain('Rentabilidad acumulada del activo');
    expect(wrapper.find('.a-pf-chart-line.is-return').exists()).toBe(true);
    expect(wrapper.find('.a-pf-return-data').text()).toContain('Anualizada');
    expect(wrapper.find('.a-pf-return-data').text()).not.toContain('Revalorización del mes');
  });

  it('survives a container with no width instead of losing the active point', async () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: { currency: 'EUR', points: months(13) },
    });

    await wrapper.trigger('mousemove', { clientX: 0 });

    expect(wrapper.find('.a-pf-chart-readout').exists()).toBe(true);
  });

  it('ignores months with no value instead of plotting them as zero', () => {
    const wrapper = mount(PortfolioEvolutionChart, {
      props: {
        currency: 'EUR',
        points: [
          point('2026-01-31', '1000', '1000'),
          point('2026-02-28', null, '1000'),
          point('2026-03-31', '1200', '1000'),
        ],
      },
    });

    expect(wrapper.findAll('.a-pf-chart-data tbody tr')).toHaveLength(2);
  });
});
