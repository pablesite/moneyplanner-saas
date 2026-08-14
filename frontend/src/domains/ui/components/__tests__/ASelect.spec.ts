/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ASelect from '../ASelect.vue';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ASelect', () => {
  it('supports selecting a null option from its teleported panel', async () => {
    const wrapper = mount(ASelect, {
      attachTo: document.body,
      props: {
        modelValue: 7,
        options: [
          { value: null, label: 'Sin titularidad' },
          { value: 7, label: 'Pablo' },
        ],
      },
    });

    await wrapper.get('.a-select-trigger').trigger('click');
    const options = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.a-select-opt'));
    options.find((option) => option.textContent?.includes('Sin titularidad'))?.click();

    expect(wrapper.emitted('update:modelValue')).toEqual([[null]]);
    wrapper.unmount();
  });

  it('limits its height to the visible space on the selected side of the trigger', async () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 390 });

    const wrapper = mount(ASelect, {
      attachTo: document.body,
      props: {
        modelValue: 1,
        options: Array.from({ length: 12 }, (_, value) => ({ value, label: `Option ${value}` })),
      },
    });
    const trigger = wrapper.get('.a-select-trigger').element;
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      bottom: 324,
      height: 44,
      left: 16,
      right: 374,
      top: 280,
      width: 358,
      x: 16,
      y: 280,
      toJSON: () => ({}),
    });

    await wrapper.get('.a-select-trigger').trigger('click');

    const panel = document.body.querySelector<HTMLElement>('.a-select-panel');
    expect(panel?.style.maxHeight).toBe('272px');
    expect(panel?.style.bottom).toBe('324px');
    wrapper.unmount();
  });
});
