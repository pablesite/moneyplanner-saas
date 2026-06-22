/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AKpiBand from '../AKpiBand.vue';

describe('AKpiBand', () => {
  it('renders one cell per item with label, value and string meta', () => {
    const wrapper = mount(AKpiBand, {
      props: {
        items: [
          { label: 'Ingresos', value: '1.000 €', meta: 'previsto 900 €' },
          { label: 'Gastos', value: '500 €' },
        ],
      },
    });
    expect(wrapper.findAll('.kpi')).toHaveLength(2);
    expect(wrapper.findAll('.kpi-label').map((n) => n.text())).toEqual(['Ingresos', 'Gastos']);
    expect(wrapper.findAll('.kpi-value').map((n) => n.text())).toEqual(['1.000 €', '500 €']);
    const metas = wrapper.findAll('.kpi-meta');
    expect(metas).toHaveLength(1);
    expect(metas[0]?.text()).toBe('previsto 900 €');
  });

  it('prefers a per-index meta slot over the meta string', () => {
    const wrapper = mount(AKpiBand, {
      props: { items: [{ label: 'Ingresos', value: '1.000 €', meta: 'plano' }] },
      slots: { 'meta-0': '<span class="pos">+100</span>' },
    });
    expect(wrapper.get('.kpi-meta').html()).toContain('class="pos"');
    expect(wrapper.get('.kpi-meta').text()).toBe('+100');
  });
});
