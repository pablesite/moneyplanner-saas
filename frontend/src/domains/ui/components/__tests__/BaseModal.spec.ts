import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';
import BaseModal from '../BaseModal.vue';

describe('BaseModal', () => {
  it('creates unique accessible title ids without relying on Web Crypto', () => {
    const wrapper = mount(
      defineComponent({
        components: { BaseModal },
        template: `
          <BaseModal :open="true" title="Primero" />
          <BaseModal :open="true" title="Segundo" />
        `,
      }),
      { global: { stubs: { teleport: true } } },
    );

    const dialogs = wrapper.findAll('[role="dialog"]');
    const labelledByIds = dialogs.map((dialog) => dialog.attributes('aria-labelledby'));

    expect(labelledByIds).toHaveLength(2);
    expect(new Set(labelledByIds).size).toBe(2);
    labelledByIds.forEach((id) => expect(wrapper.find(`#${id}`).exists()).toBe(true));
  });
});
