/** @vitest-environment jsdom */
import { afterEach, describe, expect, it } from 'vitest';
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
});
