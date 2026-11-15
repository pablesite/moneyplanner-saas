import { describe, expect, it } from 'vitest';
import type { Ownership } from '@/domains/net-worth';
import { ownershipDisplayLabel } from '@/domains/people/ownershipPresentation';
import { ownershipIdForOwnerOption } from '../useBudgetAnnualEntriesPage';

const ownerships = [
  { id: 1, kind: 'individual', member: { id: 1, name: 'Pablo' }, splits: [] },
  { id: 3, kind: 'individual', member: { id: 3, name: 'Ana' }, splits: [] },
  {
    id: 4,
    kind: 'shared',
    member: null,
    allocation_basis: 'explicit_split',
    splits: [
      { member: { id: 1, name: 'Pablo' }, percent: '50' },
      { member: { id: 3, name: 'Ana' }, percent: '50' },
    ],
  },
] as unknown as Ownership[];

describe('ownershipIdForOwnerOption', () => {
  it('turns the owner chosen in the form into its ownership', () => {
    expect(ownershipIdForOwnerOption(ownerships, 'Pablo')).toBe('1');
    expect(ownershipIdForOwnerOption(ownerships, ' Ana ')).toBe('3');
    expect(ownershipIdForOwnerOption(ownerships, ownershipDisplayLabel(ownerships[2]!))).toBe('4');
  });

  it('leaves the ownership empty when the owner is unknown or blank', () => {
    expect(ownershipIdForOwnerOption(ownerships, 'Desconocido')).toBe('');
    expect(ownershipIdForOwnerOption(ownerships, '')).toBe('');
  });
});
