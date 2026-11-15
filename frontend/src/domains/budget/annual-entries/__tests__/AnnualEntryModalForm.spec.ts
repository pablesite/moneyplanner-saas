/** @vitest-environment jsdom */
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AnnualEntryModalForm from '../components/AnnualEntryModalForm.vue';

const baseForm = {
  category: 'consumption_expenses',
  subcategory: 'other_consumption_expenses',
  name: 'Renting móvil',
  owner: 'Pablo',
  timeProfile: 'term_recurrent',
  cashflowRole: 'temporary_commitment',
  eventGroup: '',
  targetMonth: '',
  termStartMonth: '',
  termEndMonth: '',
  termEndYear: '',
  fiscalYear: '2026',
  amountInputPeriod: 'monthly' as const,
  amountAnnual: '36.99',
  currency: 'EUR',
  notes: '',
};

function mountForm(form = baseForm) {
  return mount(AnnualEntryModalForm, {
    attachTo: document.body,
    props: {
      open: true,
      title: 'Nuevo gasto',
      form,
      submitLabel: 'Guardar',
      categoryOptions: [],
      subcategoryOptions: [],
      timeProfileOptions: [],
      cashflowRoleOptions: [],
      namePlaceholder: '',
      amountPlaceholder: '',
    },
  });
}

function fieldInput(label: string): HTMLInputElement | null {
  const field = Array.from(document.body.querySelectorAll('label.ui-item-form-field')).find(
    (node) => node.querySelector('.ui-item-form-label')?.textContent?.trim() === label,
  );
  return field?.querySelector('input') ?? null;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('AnnualEntryModalForm', () => {
  it('asks for the start and end of a temporary commitment without opening advanced options', async () => {
    const wrapper = mountForm();
    await flushPromises();

    const start = fieldInput('Mes inicio compromiso');
    expect(start).not.toBeNull();
    expect(fieldInput('Mes fin compromiso')).not.toBeNull();
    expect(fieldInput('Año fin compromiso')).not.toBeNull();

    start!.value = '11';
    start!.dispatchEvent(new Event('input', { bubbles: true }));
    expect(wrapper.emitted('patch')).toContainEqual([{ termStartMonth: '11' }]);
  });

  it('hides the term months for a structural recurring line', async () => {
    mountForm({ ...baseForm, timeProfile: 'structural_recurrent' });
    await flushPromises();

    expect(fieldInput('Mes inicio compromiso')).toBeNull();
  });
});
