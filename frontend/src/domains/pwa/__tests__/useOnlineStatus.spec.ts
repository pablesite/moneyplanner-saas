import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useOnlineStatus } from '@/domains/pwa/useOnlineStatus';

const Harness = defineComponent({
  setup() {
    const { online } = useOnlineStatus();
    return { online };
  },
  render() {
    return h('span', this.online ? 'on' : 'off');
  },
});

function setOnLine(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { value, configurable: true });
}

describe('useOnlineStatus', () => {
  it('reflects the initial navigator.onLine value on mount', () => {
    setOnLine(false);
    const wrapper = mount(Harness);
    expect(wrapper.text()).toBe('off');
    wrapper.unmount();
  });

  it('reacts to offline and online events', async () => {
    setOnLine(true);
    const wrapper = mount(Harness);
    expect(wrapper.text()).toBe('on');

    window.dispatchEvent(new Event('offline'));
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('off');

    window.dispatchEvent(new Event('online'));
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toBe('on');

    wrapper.unmount();
  });

  it('stops reacting after unmount (listeners cleaned up)', async () => {
    setOnLine(true);
    const wrapper = mount(Harness);
    wrapper.unmount();

    // Si los listeners no se limpiaran, esto lanzaría sobre un componente desmontado.
    window.dispatchEvent(new Event('offline'));
    await Promise.resolve();
    expect(wrapper.text()).toBe('on');
  });
});
