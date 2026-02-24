import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ItemForm from '@/domains/net-worth/components/ItemForm.vue';

describe('ItemForm (saas)', () => {
  it('submits normalized payload including ownership and financed asset', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(ItemForm, {
      props: {
        title: 'Nuevo activo',
        categories: [{ value: 'cash', label: 'Cash' }],
        subcategories: [{ value: 'wallet', label: 'Wallet', category: 'cash' }],
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
    const subcategorySelect = selects[1]!;
    const currencySelect = selects[2]!;
    const ownershipSelect = selects.find((s) => s.text().includes('Selecciona titularidad'))!;
    const financedAssetSelect = selects.find((s) => s.text().includes('No financia'))!;

    await categorySelect.setValue('cash');
    await subcategorySelect.setValue('wallet');
    await currencySelect.setValue('EUR');
    await wrapper.find('input[placeholder="Importe"]').setValue('1.234,56');
    await ownershipSelect.setValue('10');
    await financedAssetSelect.setValue('1');
    await wrapper.find('button.btn-primary').trigger('click');
    await flushPromises();

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Caja',
        category: 'cash',
        subcategory: 'wallet',
        currency: 'EUR',
        amount: '1234.56',
        ownership_id: 10,
        financed_asset_id: 1,
      }),
    );
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
    expect(wrapper.text()).toContain('Importe inválido');
  });
});
