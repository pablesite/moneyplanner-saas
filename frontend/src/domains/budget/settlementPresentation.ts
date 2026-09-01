import type { FamilyMember } from '@/domains/people/types';
import type { OwnershipSettlement, SettlementAllocation, SettlementQualityItem } from './types';

function amount(value: string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function allocationLabel(allocation: SettlementAllocation | undefined): string {
  if (!allocation) return 'Titularidad pendiente';
  return allocation.shares
    .map((share) => `${share.member_name} ${amount(share.percent).toLocaleString('es-ES')} %`)
    .join(' · ');
}

function blockerMessage(item: SettlementQualityItem): string {
  const messages: Record<string, string> = {
    account_missing_ownership: 'Asigna una titularidad a todas las cuentas participantes.',
    allocation_missing_destination:
      'Una aportación prevista no tiene cuenta destino y no se incluirá en las recomendaciones.',
    allocation_blocked: 'Revisa el histórico de ingresos usado para calcular el reparto dinámico.',
    expense_missing_ownership: 'Asigna una titularidad a las partidas recurrentes pendientes.',
    expense_missing_settlement_account: 'Elige una cuenta destino para cada partida recurrente.',
    household_total_mismatch: 'Revisa los saldos: el total físico no concilia con el económico.',
    missing_budget_fx_rate: 'Falta un tipo de cambio para una reserva del próximo mes.',
    missing_fx_rate: 'Falta un tipo de cambio para uno de los movimientos del periodo.',
    missing_primary_personal_account: 'Configura una cuenta personal principal para cada adulto.',
    reserve_missing_inputs: 'Completa la titularidad y el destino de las reservas recurrentes.',
    settlement_not_active_for_period: 'La liquidación todavía no estaba activa en este periodo.',
    settlement_ownership_mismatch:
      'La titularidad de una reserva no coincide con su cuenta destino.',
    transaction_missing_ownership: 'Hay movimientos sin titularidad dentro del periodo.',
    transaction_outside_perimeter: 'Hay una transferencia que cruza el perímetro configurado.',
    unreconciled_account_balance:
      'El saldo observado de una cuenta no concilia con sus movimientos.',
    unsupported_settlement_currency: 'Todas las cuentas deben usar la moneda base para liquidar.',
  };
  return messages[item.code] ?? item.code.replaceAll('_', ' ');
}

export type SettlementPage = ReturnType<typeof buildSettlementPage>;

type SettlementAccountRow = NonNullable<OwnershipSettlement['accounts']>[number];
type SettlementReserveRow = NonNullable<OwnershipSettlement['reserves']>[number];
type SettlementRecommendationRow = NonNullable<OwnershipSettlement['recommendations']>[number];
type SettlementMemberRow = NonNullable<OwnershipSettlement['economic_balances']>[number];

function buildDestinations(
  accounts: SettlementAccountRow[],
  reserves: SettlementReserveRow[],
  allocationById: Map<number, SettlementAllocation>,
) {
  return accounts
    .map((account) => {
      const relatedReserves = reserves.filter(
        (reserve) => reserve.settlement_account_id === account.account_id,
      );
      return {
        id: account.account_id,
        name: account.name,
        role: account.role,
        roleLabel: {
          operating: 'Reserva operativa',
          personal_destination: 'Cuenta personal',
          allocation_destination: 'Asignación prevista',
          physical_cash: 'Efectivo físico',
          credit_card: 'Tarjeta de crédito',
          investment_position: 'Posición de inversión',
          investment_cash: 'Efectivo de bróker',
        }[account.role],
        ownership: allocationLabel(
          account.ownership_id == null ? undefined : allocationById.get(account.ownership_id),
        ),
        observed: amount(account.observed_close),
        target: amount(account.target_close),
        movement: amount(account.target_close) - amount(account.observed_close),
        reasons: relatedReserves.map((reserve) => reserve.name),
      };
    })
    .filter(
      (row) =>
        ['credit_card', 'investment_position', 'investment_cash'].includes(row.role) ||
        row.reasons.length > 0 ||
        Math.abs(row.movement) >= 0.005,
    );
}

function buildRecommendations(
  recommendations: SettlementRecommendationRow[],
  accountById: Map<number, SettlementAccountRow>,
  memberById: Map<number, FamilyMember>,
) {
  return recommendations.map((recommendation) => {
    const source = accountById.get(recommendation.from_account_id);
    const destination = accountById.get(recommendation.to_account_id);
    return {
      ...recommendation,
      amountNumber: amount(recommendation.amount),
      appliedAmountNumber: amount(recommendation.applied_amount),
      remainingAmountNumber: amount(recommendation.remaining_amount ?? recommendation.amount),
      status: recommendation.status ?? 'recommended',
      statusLabel:
        {
          recommended: 'Recomendada',
          accepted: 'Aceptada',
          applied: 'Registrada',
          partially_applied: 'Parcial',
          cancelled: 'Cancelada',
        }[recommendation.status ?? 'recommended'] ?? 'Recomendada',
      transactions: recommendation.transactions ?? [],
      sourceName: source?.name ?? `Cuenta ${recommendation.from_account_id}`,
      destinationName: destination?.name ?? `Cuenta ${recommendation.to_account_id}`,
      sourceAssetId: source?.asset_id ?? null,
      destinationAssetId: destination?.asset_id ?? null,
      memberName:
        recommendation.member_id == null
          ? null
          : (memberById.get(recommendation.member_id)?.name ?? null),
      reasonLabel:
        {
          member_residual: 'Excedente personal',
          next_month_reserve: 'Reserva del próximo mes',
          planned_allocation: 'Asignación prevista',
          physical_cash: 'Efectivo físico',
          settlement: 'Ajuste de liquidación',
        }[recommendation.reason] ?? 'Liquidación',
    };
  });
}

function buildMemberRows(rows: SettlementMemberRow[], memberById: Map<number, FamilyMember>) {
  return rows.map((balance) => ({
    ...balance,
    name: memberById.get(balance.member_id)?.name ?? `Miembro ${balance.member_id}`,
    openingNumber: amount(balance.opening),
    incomeNumber: amount(balance.income),
    expenseNumber: amount(balance.expense),
    compensationNumber: amount(balance.compensation),
    requirementNumber: amount(balance.requirement),
    closingNumber: amount(balance.closing),
    excessNumber:
      amount(balance.excess ?? balance.closing) -
      (balance.excess ? 0 : amount(balance.requirement)),
  }));
}

function buildReserveOwnershipGroups(
  reserves: SettlementReserveRow[],
  allocationById: Map<number, SettlementAllocation>,
  accountById: Map<number, SettlementAccountRow>,
  memberById: Map<number, FamilyMember>,
) {
  const groups = new Map<
    string,
    {
      key: string;
      ownershipId: number;
      destinationName: string;
      totalNumber: number;
      reserveNumber: number;
      allocationNumber: number;
      memberAmounts: Map<number, number>;
    }
  >();

  for (const reserve of reserves) {
    const key = `${reserve.ownership_id}:${reserve.settlement_account_id}`;
    const group = groups.get(key) ?? {
      key,
      ownershipId: reserve.ownership_id,
      destinationName:
        accountById.get(reserve.settlement_account_id)?.name ??
        `Cuenta ${reserve.settlement_account_id}`,
      totalNumber: 0,
      reserveNumber: 0,
      allocationNumber: 0,
      memberAmounts: new Map<number, number>(),
    };
    const reserveAmount = amount(reserve.amount);
    group.totalNumber += reserveAmount;
    if (reserve.kind === 'allocation') group.allocationNumber += reserveAmount;
    else group.reserveNumber += reserveAmount;
    reserve.members.forEach((member) => {
      group.memberAmounts.set(
        member.member_id,
        (group.memberAmounts.get(member.member_id) ?? 0) + amount(member.amount),
      );
    });
    groups.set(key, group);
  }

  return [...groups.values()]
    .map((group) => {
      const allocation = allocationById.get(group.ownershipId);
      const memberAmounts = [...group.memberAmounts.entries()].map(([memberId, value]) => ({
        memberId,
        name: memberById.get(memberId)?.name ?? `Miembro ${memberId}`,
        value,
      }));
      return {
        ...group,
        ownershipLabel:
          allocation == null
            ? memberAmounts.map((member) => member.name).join(' · ') || 'Titularidad sin reparto'
            : allocationLabel(allocation),
        memberAmounts,
      };
    })
    .sort((left, right) => right.totalNumber - left.totalNumber);
}

function buildAllocationRows(allocations: SettlementAllocation[]) {
  return allocations.map((allocation) => ({
    ...allocation,
    label: allocationLabel(allocation),
    basisLabel:
      allocation.allocation_basis === 'recurring_income_12m'
        ? 'Promedio de ingresos recurrentes'
        : 'Reparto pactado',
    totalIncomeNumber: amount(allocation.total_qualifying_income),
  }));
}

function buildQualityRows(
  items: SettlementQualityItem[],
): Array<SettlementQualityItem & { key: string; message: string }> {
  return items.map((item, index) => ({
    ...item,
    key: `${item.code}-${String(item.account_id ?? item.entry_id ?? index)}`,
    message: blockerMessage(item),
  }));
}

function normalizeSettlement(settlement: OwnershipSettlement | null | undefined) {
  if (!settlement) {
    return {
      state: 'disabled' as const,
      calculationStatus: 'not_ready' as const,
      isFrozen: false,
      currency: 'EUR',
      targetPeriod: null,
      reconciliation: undefined,
      accounts: [],
      allocations: [],
      recommendations: [],
      reserves: [],
      economicBalances: [],
      compensations: [],
      blockers: [],
      warnings: [],
    };
  }
  return {
    state: settlement.status,
    calculationStatus: settlement.calculation_status ?? 'not_ready',
    isFrozen: settlement.is_frozen,
    currency: settlement.base_currency ?? 'EUR',
    targetPeriod: settlement.target_period ?? null,
    reconciliation: settlement.reconciliation,
    accounts: settlement.accounts ?? [],
    allocations: settlement.allocations ?? [],
    recommendations: settlement.recommendations ?? [],
    reserves: settlement.reserves ?? [],
    economicBalances: settlement.economic_balances ?? [],
    compensations: settlement.compensations ?? [],
    blockers: settlement.quality.blockers,
    warnings: settlement.quality.warnings,
  };
}

function buildSummary(
  reconciliation: OwnershipSettlement['reconciliation'],
  reserves: SettlementReserveRow[],
  recommendations: SettlementRecommendationRow[],
  personalAccountIds: Set<number>,
  operatingAccountIds: Set<number>,
) {
  const retainedOrAllocated = reserves.reduce(
    (total, reserve) => total + amount(reserve.amount),
    0,
  );
  const sharedOperatingReserve = reserves
    .filter((reserve) => operatingAccountIds.has(reserve.settlement_account_id))
    .reduce((total, reserve) => total + amount(reserve.amount), 0);
  return {
    distributable: amount(reconciliation?.economic_total),
    retainedOrAllocated,
    sharedOperatingReserve,
    personalOrAllocated: retainedOrAllocated - sharedOperatingReserve,
    towardPersonal: recommendations
      .filter((recommendation) => personalAccountIds.has(recommendation.to_account_id))
      .reduce((total, recommendation) => total + amount(recommendation.amount), 0),
  };
}

function buildCompensationRows(
  compensations: NonNullable<OwnershipSettlement['compensations']>,
  memberById: Map<number, FamilyMember>,
) {
  return compensations.map((compensation) => ({
    ...compensation,
    members: compensation.members.map((member) => ({
      ...member,
      name: memberById.get(member.member_id)?.name ?? `Miembro ${member.member_id}`,
      amountNumber: amount(member.amount),
    })),
  }));
}

export function buildSettlementPage(
  settlement: OwnershipSettlement | null | undefined,
  members: FamilyMember[],
) {
  const normalized = normalizeSettlement(settlement);
  const { state, accounts, allocations, recommendations, reserves } = normalized;
  const accountById = new Map(accounts.map((account) => [account.account_id, account]));
  const allocationById = new Map(
    allocations.map((allocation) => [allocation.ownership_id, allocation]),
  );
  const memberById = new Map(members.map((member) => [member.id, member]));
  const personalAccountIds = new Set(
    accounts
      .filter((account) => account.role === 'personal_destination')
      .map((account) => account.account_id),
  );
  const operatingAccountIds = new Set(
    accounts.filter((account) => account.role === 'operating').map((account) => account.account_id),
  );

  const destinations = buildDestinations(accounts, reserves, allocationById);

  return {
    state,
    isVisible: state !== 'disabled',
    isReady:
      state === 'ready' || (state === 'finalized' && normalized.calculationStatus === 'ready'),
    isFinalized: state === 'finalized',
    hasSettlementHistory: recommendations.some(
      (recommendation) => (recommendation.transactions?.length ?? 0) > 0,
    ),
    canApply:
      state === 'finalized' &&
      recommendations.some(
        (recommendation) =>
          (recommendation.status ?? 'recommended') !== 'cancelled' &&
          amount(recommendation.remaining_amount ?? recommendation.amount) > 0,
      ),
    isFrozen: normalized.isFrozen,
    currency: normalized.currency,
    targetPeriod: normalized.targetPeriod,
    summary: buildSummary(
      normalized.reconciliation,
      reserves,
      recommendations,
      personalAccountIds,
      operatingAccountIds,
    ),
    destinations,
    recommendations: buildRecommendations(recommendations, accountById, memberById),
    members: buildMemberRows(normalized.economicBalances, memberById),
    reserveOwnershipGroups: buildReserveOwnershipGroups(
      reserves,
      allocationById,
      accountById,
      memberById,
    ),
    allocations: buildAllocationRows(allocations),
    compensations: buildCompensationRows(normalized.compensations, memberById),
    blockers: buildQualityRows(normalized.blockers),
    warnings: buildQualityRows(normalized.warnings),
  };
}
