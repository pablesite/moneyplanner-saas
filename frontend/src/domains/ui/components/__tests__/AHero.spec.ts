/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AHero from '../AHero.vue';

describe('AHero', () => {
  it('renders eyebrow and value when provided', () => {
    const wrapper = mount(AHero, { props: { eyebrow: 'Residual', value: '1.234 €' } });
    expect(wrapper.get('.eyebrow').text()).toBe('Residual');
    expect(wrapper.get('.hero-value').text()).toBe('1.234 €');
  });

  it('omits the delta block when no delta slot is given', () => {
    const wrapper = mount(AHero, { props: { value: '0 €' } });
    expect(wrapper.find('.hero-delta').exists()).toBe(false);
    expect(wrapper.find('.eyebrow').exists()).toBe(false);
  });

  it('lets a value slot override the value prop', () => {
    const wrapper = mount(AHero, {
      props: { value: '0 €' },
      slots: { value: '<button class="custom">9 €</button>' },
    });
    expect(wrapper.find('.custom').exists()).toBe(true);
    expect(wrapper.find('.hero-value').exists()).toBe(false);
  });

  it('renders delta and default slots', () => {
    const wrapper = mount(AHero, {
      props: { value: '0 €' },
      slots: { delta: '<span class="d">delta</span>', default: '<div class="k">kpis</div>' },
    });
    expect(wrapper.get('.hero-delta .d').text()).toBe('delta');
    expect(wrapper.get('.k').text()).toBe('kpis');
  });
});
