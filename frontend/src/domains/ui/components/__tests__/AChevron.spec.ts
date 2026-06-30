/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AChevron from '../AChevron.vue';

describe('AChevron', () => {
  it('shows the open glyph when expanded', () => {
    const wrapper = mount(AChevron, { props: { expanded: true } });
    expect(wrapper.get('.ui-chevron').text()).toBe('▾');
  });

  it('shows the collapsed glyph when not expanded', () => {
    const wrapper = mount(AChevron, { props: { expanded: false } });
    expect(wrapper.get('.ui-chevron').text()).toBe('▸');
  });
});
