import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { usePlanStore } from '@/domains/plan/store';
import type { PlanMember } from '@/domains/plan/types';

const mocks = vi.hoisted(() => ({
  planApi: {
    getMembers: vi.fn(),
    updateMember: vi.fn(),
  },
}));

vi.mock('@/domains/plan/api', () => ({ planApi: mocks.planApi }));
vi.mock('@/domains/net-worth/api', () => ({ coreNetWorthApi: {} }));

const member: PlanMember = {
  id: 7,
  name: 'Ada',
  role: 'adult',
  is_active: true,
  birth_date: '1980-06-15',
  employment_income_end_date: null,
  pension_start_date: null,
  estimated_monthly_pension_today_eur: null,
  other_future_income_today_eur: null,
};

describe('plan member store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('loads the existing adult candidates', async () => {
    mocks.planApi.getMembers.mockResolvedValue({ data: [member] });
    const store = usePlanStore();

    await store.fetchMembers();

    expect(store.members).toEqual([member]);
  });

  it('updates a selected identity instead of creating a member', async () => {
    mocks.planApi.updateMember.mockResolvedValue({ data: member });
    const store = usePlanStore();
    store.members = [member];

    await store.saveMember({ ...member, pension_start_age: 67 });

    expect(mocks.planApi.updateMember).toHaveBeenCalledWith(7, {
      ...member,
      pension_start_age: 67,
    });
  });

  it('rejects drafts without an existing member id', async () => {
    const store = usePlanStore();

    await expect(
      store.saveMember({
        name: 'Nueva',
        role: 'adult',
        is_active: true,
        birth_date: null,
        employment_income_end_date: null,
        pension_start_date: null,
        estimated_monthly_pension_today_eur: null,
        other_future_income_today_eur: null,
      }),
    ).rejects.toThrow('El adulto debe existir antes de añadirlo al plan.');
    expect(mocks.planApi.updateMember).not.toHaveBeenCalled();
  });
});
