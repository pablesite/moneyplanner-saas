/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ADateRange from '../ADateRange.vue';

describe('ADateRange', () => {
  it('renders the from/to values', () => {
    const wrapper = mount(ADateRange, { props: { from: '2026-01-01', to: '2026-02-01' } });
    const inputs = wrapper.findAll('input[type="date"]');
    expect((inputs[0]!.element as HTMLInputElement).value).toBe('2026-01-01');
    expect((inputs[1]!.element as HTMLInputElement).value).toBe('2026-02-01');
  });

  it('emits update:from and update:to on input', async () => {
    const wrapper = mount(ADateRange, { props: { from: '', to: '' } });
    const inputs = wrapper.findAll('input[type="date"]');
    await inputs[0]!.setValue('2026-03-01');
    await inputs[1]!.setValue('2026-04-01');
    expect(wrapper.emitted('update:from')?.[0]).toEqual(['2026-03-01']);
    expect(wrapper.emitted('update:to')?.[0]).toEqual(['2026-04-01']);
  });
});
