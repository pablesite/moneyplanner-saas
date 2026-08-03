import { coreApi } from '@/lib/api';
import { canUsePeople } from '@/domains/capabilities';
import type {
  FamilyMember,
  OwnershipAllocationBasis,
  OwnershipAllocationPreview,
  OwnershipIncomeRule,
  OwnershipRead,
} from '@/domains/people/types';

type MemberCreatePayload = { name: string; role: 'adult' | 'child'; is_active: boolean };
type MemberPatchPayload = Partial<Pick<FamilyMember, 'name' | 'role' | 'is_active'>>;
export type OwnershipWritePayload = {
  splits?: { member_id: number; percent: string }[];
  allocation_basis?: OwnershipAllocationBasis;
  income_rules?: OwnershipIncomeRule[];
};

export type PeopleApiAdapter = {
  getMembers(): ReturnType<typeof coreApi.get<FamilyMember[]>>;
  createMember(payload: MemberCreatePayload): ReturnType<typeof coreApi.post<FamilyMember>>;
  updateMember(
    id: number,
    patch: MemberPatchPayload,
  ): ReturnType<typeof coreApi.patch<FamilyMember>>;
  deleteMember(id: number): ReturnType<typeof coreApi.delete>;
  getOwnerships(): ReturnType<typeof coreApi.get<OwnershipRead[]>>;
  createSharedOwnership(
    payload: OwnershipWritePayload,
  ): ReturnType<typeof coreApi.post<OwnershipRead>>;
  updateSharedOwnership(
    id: number,
    payload: OwnershipWritePayload,
  ): ReturnType<typeof coreApi.patch<OwnershipRead>>;
  getAllocationPreview(
    id: number,
    year: number,
    month: number,
  ): ReturnType<typeof coreApi.get<OwnershipAllocationPreview>>;
  deleteOwnership(id: number): ReturnType<typeof coreApi.delete>;
};

export const premiumPeopleApi: PeopleApiAdapter = {
  getMembers() {
    return coreApi.get<FamilyMember[]>('/api/family-members/');
  },
  createMember(payload: MemberCreatePayload) {
    return coreApi.post<FamilyMember>('/api/family-members/', payload);
  },
  updateMember(id: number, patch: MemberPatchPayload) {
    return coreApi.patch<FamilyMember>(`/api/family-members/${id}/`, patch);
  },
  deleteMember(id: number) {
    return coreApi.delete(`/api/family-members/${id}/`);
  },
  getOwnerships() {
    return coreApi.get<OwnershipRead[]>('/api/ownerships/');
  },
  createSharedOwnership(payload: OwnershipWritePayload) {
    return coreApi.post('/api/ownerships/', {
      kind: 'shared',
      member: null,
      splits: payload.splits,
      ...(payload.allocation_basis ? { allocation_basis: payload.allocation_basis } : {}),
      ...(payload.income_rules ? { income_rules: payload.income_rules } : {}),
    });
  },
  updateSharedOwnership(id: number, payload: OwnershipWritePayload) {
    return coreApi.patch(`/api/ownerships/${id}/`, {
      kind: 'shared',
      member: null,
      splits: payload.splits,
      ...(payload.allocation_basis ? { allocation_basis: payload.allocation_basis } : {}),
      ...(payload.income_rules ? { income_rules: payload.income_rules } : {}),
    });
  },
  getAllocationPreview(id: number, year: number, month: number) {
    return coreApi.get<OwnershipAllocationPreview>(`/api/ownerships/${id}/allocation-preview/`, {
      params: { year, month },
    });
  },
  deleteOwnership(id: number) {
    return coreApi.delete(`/api/ownerships/${id}/`);
  },
};

// Transitional behavior for Core v0 consolidation:
// use the same endpoint contract as SaaS while the backend domain is ported into Core.
export const corePeopleApi: PeopleApiAdapter = premiumPeopleApi;

export const peopleApi: PeopleApiAdapter = canUsePeople() ? premiumPeopleApi : corePeopleApi;
