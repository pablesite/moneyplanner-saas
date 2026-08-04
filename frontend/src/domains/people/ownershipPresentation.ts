type OwnershipMember = { id: number; name: string; role?: 'adult' | 'child' };

type OwnershipPresentationSource = {
  kind: 'individual' | 'shared';
  member: OwnershipMember | null;
  splits?: { member: OwnershipMember; percent: string }[];
  allocation_basis?: 'explicit_split' | 'recurring_income_12m';
  effective_splits?: { member_id: number; member_name: string; percent: string | null }[] | null;
};

export type OwnershipDisplaySplit = {
  memberId: number;
  memberName: string;
  percent: string | null;
};

export function isDynamicOwnership(ownership: OwnershipPresentationSource): boolean {
  return ownership.kind === 'shared' && ownership.allocation_basis === 'recurring_income_12m';
}

export function ownershipDisplaySplits(
  ownership: OwnershipPresentationSource,
): OwnershipDisplaySplit[] {
  if (isDynamicOwnership(ownership)) {
    return (ownership.effective_splits ?? []).map((split) => ({
      memberId: split.member_id,
      memberName: split.member_name,
      percent: split.percent,
    }));
  }

  return (ownership.splits ?? []).map((split) => ({
    memberId: split.member.id,
    memberName: split.member.name,
    percent: split.percent,
  }));
}

export function formatOwnershipPercent(percent: string | null): string {
  if (percent == null) return 'sin datos';
  const value = Number(percent);
  return Number.isFinite(value)
    ? `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(value)}%`
    : `${percent}%`;
}

export function ownershipDisplayLabel(
  ownership: OwnershipPresentationSource,
  options: { individualPrefix?: boolean; compact?: boolean } = {},
): string {
  if (ownership.kind === 'individual') {
    const name = ownership.member?.name?.trim() || 'Titularidad individual';
    return options.individualPrefix ? `Individual - ${name}` : name;
  }

  const splits = ownershipDisplaySplits(ownership);
  if (isDynamicOwnership(ownership)) {
    const allocation = splits.length
      ? splits
          .map((split) => `${split.memberName} ${formatOwnershipPercent(split.percent)}`)
          .join(' - ')
      : 'calculando reparto';
    return options.compact
      ? `Dinámico: ${allocation}`
      : `Compartido dinámico (últimos 12 meses) - ${allocation}`;
  }

  const allocation = splits
    .map((split) => `${split.memberName} ${formatOwnershipPercent(split.percent)}`)
    .join(' - ');
  return allocation ? `Compartido - ${allocation}` : 'Compartido';
}
