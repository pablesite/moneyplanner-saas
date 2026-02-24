import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ItemForm from '@/domains/net-worth/components/ItemForm.vue';

describe('ItemForm (saas)', () => {
  it('submits normalized payload including ownership and financed asset', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(ItemForm, {
      props: {
        title: 'Nuevo pasivo',
        categories: [{ value: 'other', label: 'Otros' }],
        ownerships: [
          {
            id: 10,
            kind: 'individual',
            member: { id: 1, name: 'Pablo', role: 'adult' },
            splits: [],
            notes: '',
          },
        ],
        assets: [{ id: 1, name: 'Auto', category: 'real_estate' }],
        showFinancedAsset: true,
        onSubmit,
      },
    });

    await wrapper.find('input[placeholder="Nombre"]').setValue('Caja');
    const selects = wrapper.findAll('select');
    expect(selects.length).toBeGreaterThanOrEqual(5);
    const categorySelect = selects[0]!;
    const currencySelect = selects[1]!;
    const ownershipSelect = selects.find((s) => s.text().includes('Selecciona titularidad'))!;
    const financedAssetSelect = selects.find((s) => s.text().includes('No financia'))!;

    await categorySelect.setValue('other');
    await currencySelect.setValue('EUR');
    await wrapper.find('input[placeholder="Importe"]').setValue('1.234,56');
    await wrapper.find('input[placeholder="Ej: 24"]').setValue('24');
    await ownershipSelect.setValue('10');
    await financedAssetSelect.setValue('1');
    await wrapper.find('button.btn-primary').trigger('click');
    await flushPromises();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Caja',
        category: 'other',
        currency: 'EUR',
        amount: '1234.56',
        term_months: 24,
        expected_end_date: expect.any(String),
        ownership_id: 10,
        financed_asset_id: 1,
      }),
    );
  });

  it('links term months and expected end date for liabilities', async () => {
    const wrapper = mount(ItemForm, {
      props: {
        title: 'Nuevo pasivo',
        categories: [{ value: 'other', label: 'Otros' }],
        ownerships: [],
        assets: [],
        showFinancedAsset: true,
        onSubmit: vi.fn().mockResolvedValue(undefined),
      },
    });

    await wrapper.find('input[type="date"]').setValue('2024-09-05');
    await wrapper.find('input[placeholder="Ej: 24"]').setValue('24');

    const dateInputs = wrapper.findAll('input[type="date"]');
    expect((dateInputs[1]!.element as HTMLInputElement).value).toBe('2026-09-05');
  });

  it('shows amount validation errors', async () => {
    const wrapper = mount(ItemForm, {
      props: {
        title: 'Nuevo activo',
        categories: [{ value: 'cash', label: 'Cash' }],
        onSubmit: vi.fn().mockResolvedValue(undefined),
      },
    });

    await wrapper.find('input[placeholder="Importe"]').setValue('12.3.4');
    expect(wrapper.text()).toContain('Importe inv');
  });
});
