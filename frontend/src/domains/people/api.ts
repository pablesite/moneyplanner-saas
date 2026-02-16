import { api } from '@/lib/api';
import type { FamilyMember, OwnershipRead } from '@/domains/people/types';

export const peopleApi = {
  getMembers() {
    return api.get<FamilyMember[]>('/api/family-members/');
  },
  createMember(payload: { name: string; role: 'adult' | 'child'; is_active: boolean }) {
    return api.post<FamilyMember>('/api/family-members/', payload);
  },
  updateMember(id: number, patch: Partial<Pick<FamilyMember, 'name' | 'role' | 'is_active'>>) {
    return api.patch<FamilyMember>(`/api/family-members/${id}/`, patch);
  },
  deleteMember(id: number) {
    return api.delete(`/api/family-members/${id}/`);
  },
  getOwnerships() {
    return api.get<OwnershipRead[]>('/api/ownerships/');
  },
  createSharedOwnership(payload: { splits: { member_id: number; percent: string }[] }) {
    return api.post('/api/ownerships/', {
      kind: 'shared',
      member: null,
      splits: payload.splits,
    });
  },
  updateSharedOwnership(id: number, payload: { splits: { member_id: number; percent: string }[] }) {
    return api.patch(`/api/ownerships/${id}/`, {
      kind: 'shared',
      member: null,
      splits: payload.splits,
    });
  },
  deleteOwnership(id: number) {
    return api.delete(`/api/ownerships/${id}/`);
  },
};
