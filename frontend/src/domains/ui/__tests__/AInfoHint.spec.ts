/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AInfoHint from '@/domains/ui/components/AInfoHint.vue';

describe('AInfoHint', () => {
  it('sin slot usa `label` como contenido del tooltip', () => {
    // Pasar solo `label` pintaba el bocadillo vacío: el texto llegaba al
    // aria-label pero no había nada que leer al pasar el ratón.
    const wrapper = mount(AInfoHint, { props: { label: 'Cómo se calcula esto' } });

    expect(wrapper.get('[role="tooltip"]').text()).toBe('Cómo se calcula esto');
    expect(wrapper.attributes('aria-label')).toBe('Cómo se calcula esto');
  });

  it('con slot manda el slot y `label` queda como nombre accesible', () => {
    const wrapper = mount(AInfoHint, {
      props: { label: 'Sobre este paso' },
      slots: { default: 'Explicación larga del paso.' },
    });

    expect(wrapper.get('[role="tooltip"]').text()).toBe('Explicación larga del paso.');
    expect(wrapper.attributes('aria-label')).toBe('Sobre este paso');
  });
});
