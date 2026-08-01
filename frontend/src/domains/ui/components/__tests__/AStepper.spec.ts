import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import AStepper from '../AStepper.vue';

const steps = [
  { id: 'one', label: 'Primero', status: 'done' as const },
  { id: 'two', label: 'Segundo', status: 'current' as const },
  { id: 'three', label: 'Tercero', status: 'pending' as const },
];

describe('AStepper', () => {
  it('centers the active step when the rail overflows', async () => {
    const wrapper = mount(AStepper, { props: { steps, activeId: 'one' } });
    const rail = wrapper.get('.stepper').element as HTMLElement;
    Object.defineProperties(rail, {
      scrollWidth: { configurable: true, value: 600 },
      clientWidth: { configurable: true, value: 300 },
    });

    const scrollIntoView = vi.fn();
    wrapper.findAll<HTMLElement>('.stepper-step').forEach((step) => {
      step.element.scrollIntoView = scrollIntoView;
    });

    await wrapper.setProps({ activeId: 'two' });
    await nextTick();

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  });
});
