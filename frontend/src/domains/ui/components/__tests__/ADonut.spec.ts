/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ADonut from '../ADonut.vue';

const slices = [
  { key: 'a', label: 'Activos', value: 70, color: '#0f0', hoverValue: '70 €' },
  { key: 'b', label: 'Pasivos', value: 30, color: '#f00', hoverValue: '30 €' },
];

describe('ADonut', () => {
  it('renders one arc per positive slice plus the background ring', () => {
    const wrapper = mount(ADonut, { props: { slices } });
    expect(wrapper.findAll('.a-donut-arc')).toHaveLength(2);
    expect(wrapper.findAll('circle')).toHaveLength(3); // background + 2 arcs
  });

  it('omits slices with non-positive value', () => {
    const wrapper = mount(ADonut, {
      props: { slices: [...slices, { key: 'c', label: 'Zero', value: 0, color: '#00f' }] },
    });
    expect(wrapper.findAll('.a-donut-arc')).toHaveLength(2);
  });

  it('shows the default center, then the hovered slice', async () => {
    const wrapper = mount(ADonut, {
      props: { slices, centerEyebrow: 'Saldo neto', centerValue: '40 €' },
    });
    expect(wrapper.get('.a-donut-center-eyebrow').text()).toBe('Saldo neto');
    expect(wrapper.get('.a-donut-center-value').text()).toBe('40 €');
    await wrapper.findAll('.a-donut-arc')[0]!.trigger('mouseenter');
    expect(wrapper.get('.a-donut-center-eyebrow').text()).toBe('Activos');
    expect(wrapper.get('.a-donut-center-value').text()).toBe('70 €');
  });
});
