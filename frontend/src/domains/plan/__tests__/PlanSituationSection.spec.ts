/** @vitest-environment jsdom */
import { mount, type VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, ref } from 'vue';
import PlanSituationSection from '@/domains/plan/components/PlanSituationSection.vue';
import type { AnnualIncomeEntry } from '@/domains/budget/annual-entries/annualIncomeStore';
import type { AnnualExpenseEntry } from '@/domains/budget/annual-entries/annualExpenseStore';
import type { PlanFoundations } from '@/domains/plan/types';

// Ambos stores pegan al backend; los mockeamos para controlar los datos y verificar
// que "Guardar" traduce el modo edición a un updateEntry con importe + mes + año.
const fake = vi.hoisted(() => ({ income: null as unknown, expense: null as unknown }));

vi.mock('@/domains/budget/annual-entries/annualIncomeStore', () => ({
  useAnnualIncomeStore: () => fake.income,
}));
vi.mock('@/domains/budget/annual-entries/annualExpenseStore', () => ({
  useAnnualExpenseStore: () => fake.expense,
}));

const currentYear = new Date().getFullYear();

function income(overrides: Partial<AnnualIncomeEntry>): AnnualIncomeEntry {
  return {
    id: 1,
    name: 'Ingreso',
    category: 'other_income' as AnnualIncomeEntry['category'],
    subcategory: 'misc',
    owner: '',
    incomeType: 'one_off',
    timeProfile: 'one_off',
    cashflowRole: 'operating',
    eventGroup: '',
    isPlanManaged: false,
    planEventId: null,
    planEventName: null,
    targetMonth: 6,
    termStartMonth: null,
    termEndMonth: null,
    termEndYear: null,
    amountInputPeriod: 'annual',
    amountAnnual: 1000,
    fiscalYear: currentYear,
    currency: 'EUR',
    notes: '',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function expense(overrides: Partial<AnnualExpenseEntry>): AnnualExpenseEntry {
  return {
    id: 1,
    sourceLiabilityId: null,
    sourceAssetId: null,
    isSystemGenerated: false,
    name: 'Gasto',
    category: 'other' as AnnualExpenseEntry['category'],
    subcategory: 'misc',
    owner: '',
    expenseType: 'one_off',
    timeProfile: 'one_off',
    cashflowRole: 'operating',
    eventGroup: '',
    isPlanManaged: false,
    planEventId: null,
    planEventName: null,
    targetMonth: 3,
    termStartMonth: null,
    termEndMonth: null,
    termEndYear: null,
    amountInputPeriod: 'annual',
    amountAnnual: 2000,
    fiscalYear: currentYear,
    currency: 'EUR',
    notes: '',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

const incomeEntries = [
  income({
    id: 1,
    name: 'Tito Ángel',
    amountAnnual: 8000,
    fiscalYear: currentYear,
    targetMonth: 6,
  }),
  income({ id: 2, name: 'Venta gestionada', isPlanManaged: true, planEventName: 'Venta casa' }),
  income({ id: 3, name: 'Nómina', timeProfile: 'structural_recurrent', incomeType: 'recurrent' }),
  income({ id: 4, name: 'Puntual pasado', fiscalYear: currentYear - 1 }),
];

const expenseEntries = [
  expense({ id: 1, name: 'Reforma baño', amountAnnual: 5000, targetMonth: 3 }),
  expense({ id: 2, name: 'Cuota coche', isSystemGenerated: true }),
  expense({
    id: 3,
    name: 'Alquiler',
    timeProfile: 'structural_recurrent',
    expenseType: 'recurrent',
  }),
];

// Solo se lee `cash_flow`; el resto de cimientos no los usa este componente.
const transientFoundations = {
  cash_flow: {
    score: 60,
    structural_annual_income: '56434.08',
    structural_operating_expense: '36610.00',
    temporary_commitment_expense: '27582.54',
    operating_surplus: '19824.08',
    committed_surplus: '-7758.46',
    operating_surplus_ratio: '0.35',
    committed_status: 'transient',
    committed_recovery_year: 2027,
    temporary_commitments: [
      {
        name: 'Compromiso pasivo: Cuotas de casa Atrio',
        amount: '16488.00',
        end_year: 2026,
        end_month: 9,
      },
    ],
  },
} as unknown as PlanFoundations;

// Stub de ASelect: un botón que al pulsar emite el valor siguiente (mes o año + 1).
const ASelectStub = defineComponent({
  props: { modelValue: { type: Number, required: true } },
  emits: ['update:modelValue'],
  template:
    '<button class="aselect-stub" @click="$emit(\'update:modelValue\', Number(modelValue) + 1)">{{ modelValue }}</button>',
});

function mountSection(props: Record<string, unknown> = {}) {
  return mount(PlanSituationSection, {
    props,
    global: { stubs: { ASelect: ASelectStub, RouterLink: true } },
  });
}

async function openOneOff(wrapper: VueWrapper): Promise<void> {
  await wrapper.find('.plan-tier-toggle').trigger('click');
}

function rowByName(wrapper: VueWrapper, name: string) {
  return wrapper.findAll('tbody tr').find((tr) => tr.text().includes(name))!;
}

describe('PlanSituationSection', () => {
  beforeEach(() => {
    fake.income = {
      entries: ref([...incomeEntries]),
      loading: ref(false),
      error: ref<string | null>(null),
      loadAll: vi.fn().mockResolvedValue(undefined),
      updateEntry: vi.fn().mockResolvedValue({ ok: true }),
      deleteEntry: vi.fn().mockResolvedValue(undefined),
    };
    fake.expense = {
      entries: ref([...expenseEntries]),
      loading: ref(false),
      error: ref<string | null>(null),
      loadAll: vi.fn().mockResolvedValue(undefined),
      updateEntry: vi.fn().mockResolvedValue({ ok: true }),
      deleteEntry: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('lista solo movimientos puntuales próximos (ingresos y gastos) en modo lectura', async () => {
    const wrapper = mountSection();
    await openOneOff(wrapper);

    const text = wrapper.text();
    expect(text).toContain('Tito Ángel');
    expect(text).toContain('Reforma baño');
    expect(text).toContain('Gestionado por Venta casa');
    // Filtrados: recurrentes, año pasado y gasto generado por Patrimonio.
    expect(text).not.toContain('Nómina');
    expect(text).not.toContain('Puntual pasado');
    expect(text).not.toContain('Cuota coche');
    expect(text).not.toContain('Alquiler');
    // Modo lectura: sin selectores ni inputs hasta pulsar Editar.
    expect(wrapper.findAll('.aselect-stub')).toHaveLength(0);
    expect(wrapper.findAll('.plan-oneoff-amount')).toHaveLength(0);
    // Resumen de conteos en la cabecera de la capa.
    expect(text).toContain('2 ingresos · 1 gasto');
  });

  it('editar un ingreso guarda importe + mes + año vía updateEntry del store de ingresos', async () => {
    const wrapper = mountSection();
    await openOneOff(wrapper);
    const store = fake.income as { updateEntry: ReturnType<typeof vi.fn> };

    const row = rowByName(wrapper, 'Tito Ángel');
    await row
      .findAll('button')
      .find((b) => b.text() === 'Editar')!
      .trigger('click');

    await wrapper.find('.plan-oneoff-amount').setValue('9000');
    // Segundo selector de la fila = año → emite currentYear + 1.
    await rowByName(wrapper, 'Tito Ángel').findAll('.aselect-stub')[1]!.trigger('click');
    await rowByName(wrapper, 'Tito Ángel')
      .findAll('button')
      .find((b) => b.text() === 'Guardar')!
      .trigger('click');

    expect(store.updateEntry).toHaveBeenCalledTimes(1);
    const [id, draft] = store.updateEntry.mock.calls[0]!;
    expect(id).toBe(1);
    expect(draft).toMatchObject({
      name: 'Tito Ángel',
      amountAnnual: '9000',
      targetMonth: 6,
      fiscalYear: currentYear + 1,
    });
  });

  it('editar un gasto usa el store de gastos', async () => {
    const wrapper = mountSection();
    await openOneOff(wrapper);
    const store = fake.expense as { updateEntry: ReturnType<typeof vi.fn> };

    const row = rowByName(wrapper, 'Reforma baño');
    await row
      .findAll('button')
      .find((b) => b.text() === 'Editar')!
      .trigger('click');
    await wrapper.find('.plan-oneoff-amount').setValue('4500');
    await rowByName(wrapper, 'Reforma baño')
      .findAll('button')
      .find((b) => b.text() === 'Guardar')!
      .trigger('click');

    expect(store.updateEntry).toHaveBeenCalledTimes(1);
    const [id, draft] = store.updateEntry.mock.calls[0]!;
    expect(id).toBe(1);
    expect(draft).toMatchObject({ name: 'Reforma baño', amountAnnual: '4500', targetMonth: 3 });
  });

  it('una partida gestionada por el plan no ofrece edición', async () => {
    const wrapper = mountSection();
    await openOneOff(wrapper);
    const row = rowByName(wrapper, 'Venta gestionada');
    expect(row.findAll('button').some((b) => b.text() === 'Editar')).toBe(false);
  });

  it('con cash-flow transitorio muestra base recurrente, esfuerzo temporal y el neto', () => {
    const wrapper = mountSection({ foundations: transientFoundations });
    const text = wrapper.text();
    expect(text).toContain('Base recurrente sana');
    expect(text).toContain('Esfuerzo temporal de este año');
    expect(text).toContain('Cuotas de casa Atrio');
    expect(text).toContain('Vuelve a positivo en 2027');
    // Pie con el flujo recurrente neto del año.
    expect(text).toContain('Flujo recurrente neto');
  });
});
