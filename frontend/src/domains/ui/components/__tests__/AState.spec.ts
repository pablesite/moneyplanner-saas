/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AState from '../AState.vue';

describe('AState', () => {
  it('renders slot content with default panel/neutral classes', () => {
    const wrapper = mount(AState, { slots: { default: 'Sin datos' } });
    const root = wrapper.get('div');
    expect(root.text()).toBe('Sin datos');
    expect(root.classes()).toContain('a-state-panel');
    expect(root.classes()).toContain('a-state-neutral');
  });

  it('maps status and layout to classes and sets aria for loading', () => {
    const wrapper = mount(AState, {
      props: { status: 'loading', layout: 'inline' },
      slots: { default: 'Cargando…' },
    });
    const root = wrapper.get('div');
    expect(root.classes()).toContain('a-state-inline');
    expect(root.classes()).toContain('a-state-loading');
    expect(root.attributes('aria-busy')).toBe('true');
    expect(root.attributes('aria-live')).toBe('polite');
  });

  it('does not set aria-busy for the empty status', () => {
    const wrapper = mount(AState, { props: { status: 'empty' } });
    expect(wrapper.get('div').attributes('aria-busy')).toBeUndefined();
  });
});
