/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AToast from '../AToast.vue';

describe('AToast', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders the message (teleported to body) when open', () => {
    mount(AToast, { props: { open: true, message: 'Guardado' } });
    const toast = document.body.querySelector('.ui-toast');
    expect(toast?.textContent).toContain('Guardado');
    expect(toast?.getAttribute('role')).toBe('status');
  });

  it('does not render when closed', () => {
    const wrapper = mount(AToast, { props: { open: false, message: 'Guardado' } });
    expect(wrapper.find('.ui-toast').exists()).toBe(false);
  });

  it('emits close after the duration elapses', () => {
    const wrapper = mount(AToast, { props: { open: true, duration: 1000 } });
    expect(wrapper.emitted('close')).toBeUndefined();
    vi.advanceTimersByTime(1000);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('applies the error tone class', () => {
    mount(AToast, { props: { open: true, tone: 'error', message: 'Error' } });
    expect(document.body.querySelector('.ui-toast-error')).not.toBeNull();
  });
});
