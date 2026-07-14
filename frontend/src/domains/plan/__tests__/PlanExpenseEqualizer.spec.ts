import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PlanExpenseEqualizer from '@/domains/plan/components/PlanExpenseEqualizer.vue';

const fields = [
  { value: 'housing_home', label: 'Vivienda y hogar' },
  { value: 'living_expenses', label: 'Alimentación' },
];

describe('PlanExpenseEqualizer', () => {
  it('muestra el resumen de ingresos, asignado y libre', () => {
    const wrapper = mount(PlanExpenseEqualizer, {
      props: {
        fields,
        modelValue: { housing_home: '600', living_expenses: '250' },
        monthlyIncome: 1000,
      },
    });
    const summary = wrapper.find('.plan-eq-summary').text();
    expect(summary).toContain('Asignado');
    expect(summary).toContain('850,00');
    expect(summary).toContain('150,00');
    expect(wrapper.findAll('.plan-eq-col')).toHaveLength(2);
  });

  it('frena una barra en lo que queda libre para no rebasar los ingresos', async () => {
    const wrapper = mount(PlanExpenseEqualizer, {
      props: {
        fields,
        modelValue: { housing_home: '', living_expenses: '800' },
        monthlyIncome: 1000,
      },
    });
    const slider = wrapper.findAll('.plan-eq-slider')[0]!;
    await slider.setValue('500');
    const emitted = wrapper.emitted('update:modelValue')!;
    // Con 800 ya asignados a alimentación, vivienda solo puede llegar a 200.
    expect(emitted[0]![0]).toEqual({ housing_home: '200', living_expenses: '800' });
  });

  it('sin ingresos declarados no hay tope ni resumen', async () => {
    const wrapper = mount(PlanExpenseEqualizer, {
      props: {
        fields,
        modelValue: { housing_home: '', living_expenses: '800' },
        monthlyIncome: null,
      },
    });
    expect(wrapper.find('.plan-eq-summary').exists()).toBe(false);
    const slider = wrapper.findAll('.plan-eq-slider')[0]!;
    await slider.setValue('2500');
    const emitted = wrapper.emitted('update:modelValue')!;
    expect(emitted[0]![0]).toEqual({ housing_home: '2500', living_expenses: '800' });
  });
});
