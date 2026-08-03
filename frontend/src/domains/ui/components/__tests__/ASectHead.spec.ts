/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ASectHead from '../ASectHead.vue';

describe('ASectHead', () => {
  it('renders title and omits eyebrow, subtitle and actions when not given', () => {
    const wrapper = mount(ASectHead, { props: { title: 'Función de cada activo' } });
    expect(wrapper.get('.sect-title').text()).toBe('Función de cada activo');
    expect(wrapper.find('.eyebrow').exists()).toBe(false);
    expect(wrapper.find('.sect-sub').exists()).toBe(false);
    expect(wrapper.find('.actions').exists()).toBe(false);
  });

  it('renders eyebrow and subtitle as plain text', () => {
    const wrapper = mount(ASectHead, {
      props: { eyebrow: 'Paso 1', title: '¿Qué decidiste?', subtitle: 'La fecha es la decisión.' },
    });
    expect(wrapper.get('.eyebrow').text()).toBe('Paso 1');
    expect(wrapper.get('.sect-sub').text()).toBe('La fecha es la decisión.');
  });

  it('prefers the subtitle slot over the prop so rich subtitles keep the primitive', () => {
    const wrapper = mount(ASectHead, {
      props: { title: 'Impacto', subtitle: 'plano' },
      slots: { subtitle: 'valor <em>neto</em> del activo' },
    });
    const sub = wrapper.get('.sect-sub');
    expect(sub.html()).toContain('<em>neto</em>');
    expect(sub.text()).not.toContain('plano');
  });

  it('renders the hint and actions slots', () => {
    const wrapper = mount(ASectHead, {
      props: { title: 'Así cambiaría tu plan' },
      slots: { hint: '<i class="hint" />', actions: '<button>Cerrar</button>' },
    });
    expect(wrapper.get('.sect-title-row').html()).toContain('class="hint"');
    expect(wrapper.get('.actions').text()).toBe('Cerrar');
  });
});
