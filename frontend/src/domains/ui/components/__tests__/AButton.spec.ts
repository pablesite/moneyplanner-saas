/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AButton from '../AButton.vue';

describe('AButton', () => {
  it('renders a default button with slot content', () => {
    const wrapper = mount(AButton, { slots: { default: 'Guardar' } });
    const button = wrapper.get('button');
    expect(button.text()).toBe('Guardar');
    expect(button.classes()).toContain('btn');
    expect(button.attributes('type')).toBe('button');
  });

  it('maps variant and size to shared classes', () => {
    const wrapper = mount(AButton, { props: { variant: 'primary', size: 'sm' } });
    const button = wrapper.get('button');
    expect(button.classes()).toContain('btn-primary');
    expect(button.classes()).toContain('btn-sm');
  });

  it('disables and shows a spinner while loading', () => {
    const wrapper = mount(AButton, { props: { loading: true } });
    const button = wrapper.get('button');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.attributes('aria-busy')).toBe('true');
    expect(wrapper.find('.btn-spinner').exists()).toBe(true);
  });

  it('respects an explicit disabled prop', () => {
    const wrapper = mount(AButton, { props: { disabled: true } });
    expect(wrapper.get('button').attributes('disabled')).toBeDefined();
  });
});
