/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ARowMenu from '../ARowMenu.vue';

const items = [
  { id: 'edit', label: 'Editar' },
  { id: 'delete', label: 'Borrar', danger: true },
];

describe('ARowMenu', () => {
  it('toggles the menu and reflects it on aria-expanded', async () => {
    const wrapper = mount(ARowMenu, { props: { items } });
    const trigger = wrapper.get('button.btn-icon');
    expect(wrapper.find('.row-menu').exists()).toBe(false);
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    expect(wrapper.findAll('.row-menu [role="menuitem"]')).toHaveLength(2);
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('emits the item id on select and closes', async () => {
    const wrapper = mount(ARowMenu, { props: { items } });
    await wrapper.get('button.btn-icon').trigger('click');
    await wrapper.findAll('.row-menu [role="menuitem"]')[1]?.trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual(['delete']);
    expect(wrapper.find('.row-menu').exists()).toBe(false);
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    const wrapper = mount(ARowMenu, { props: { items }, attachTo: document.body });
    await wrapper.get('button.btn-icon').trigger('click');
    expect(wrapper.find('.row-menu').exists()).toBe(true);

    await wrapper.get('.row-menu-wrap').trigger('keydown.esc');
    expect(wrapper.find('.row-menu').exists()).toBe(false);
    expect(document.activeElement).toBe(wrapper.get('button.btn-icon').element);
    wrapper.unmount();
  });

  it('marks danger and disabled items', async () => {
    const wrapper = mount(ARowMenu, {
      props: { items: [{ id: 'delete', label: 'Borrar', danger: true, disabled: true }] },
    });
    await wrapper.get('button.btn-icon').trigger('click');
    const item = wrapper.get('.row-menu [role="menuitem"]');
    expect(item.classes()).toContain('danger');
    expect(item.attributes('disabled')).toBeDefined();
  });
});
