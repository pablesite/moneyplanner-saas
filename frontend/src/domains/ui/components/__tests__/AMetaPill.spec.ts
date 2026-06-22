/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AMetaPill from '../AMetaPill.vue';

describe('AMetaPill', () => {
  it('renders slot content inside a .meta-pill span', () => {
    const wrapper = mount(AMetaPill, { slots: { default: 'FY 2026' } });
    const span = wrapper.get('span');
    expect(span.classes()).toContain('meta-pill');
    expect(span.text()).toBe('FY 2026');
  });
});
