import { coreApi } from '@/lib/api';
import type { FamilyMember } from '@/domains/people/types';
import type {
  PortfolioInstrument,
  PortfolioOverview,
  PortfolioPerformance,
  PortfolioPositionsResponse,
  PortfolioQuality,
  PortfolioQuery,
  PortfolioTimeline,
  PortfolioWorkspacePayload,
  PortfolioImportBatch,
  PortfolioOperationOptions,
  PortfolioOperationPayload,
  PortfolioOperationPreview,
  PortfolioPositionSetupPayload,
  PortfolioValuationResync,
  PortfolioCashAccount,
  PortfolioContainer,
  PortfolioContainerPayload,
  PositionOwnershipPeriod,
  PositionOwnershipPeriodPayload,
  AllocationStrategy,
  AllocationStrategyPayload,
  AllocationScope,
  PortfolioAllocation,
  ContributionSolve,
  ContributionBasket,
  ContributionCommitment,
  PositionAllocationRule,
} from './types';

export const corePortfolioApi = {
  getOverview(params: PortfolioQuery) {
    return coreApi.get<PortfolioOverview>('/api/portfolio/overview/', { params });
  },
  getPerformance(params: PortfolioQuery) {
    return coreApi.get<PortfolioPerformance>('/api/portfolio/performance/', { params });
  },
  getPositions(params: PortfolioQuery) {
    return coreApi.get<PortfolioPositionsResponse>('/api/portfolio/positions/performance/', {
      params,
    });
  },
  getTimeline(params: PortfolioQuery) {
    return coreApi.get<PortfolioTimeline>('/api/portfolio/timeline/', { params });
  },
  getQuality(params: PortfolioQuery) {
    return coreApi.get<PortfolioQuality>('/api/portfolio/quality/', { params });
  },
  getInstruments() {
    return coreApi.get<PortfolioInstrument[]>('/api/portfolio/instruments/');
  },
  getMembers() {
    return coreApi.get<FamilyMember[]>('/api/family-members/');
  },
  getOperationOptions() {
    return coreApi.get<PortfolioOperationOptions>('/api/portfolio/operations/options/');
  },
  previewOperation(payload: PortfolioOperationPayload) {
    return coreApi.post<PortfolioOperationPreview>('/api/portfolio/operations/preview/', payload);
  },
  confirmOperation(payload: PortfolioOperationPayload) {
    return coreApi.post<Record<string, number | string>>(
      '/api/portfolio/operations/confirm/',
      payload,
    );
  },
  confirmPositionSetup(positionId: number, payload: PortfolioPositionSetupPayload) {
    return coreApi.post<PortfolioOperationOptions['positions'][number]>(
      `/api/portfolio/positions/${positionId}/confirm-setup/`,
      payload,
    );
  },
  resyncValuations() {
    return coreApi.post<PortfolioValuationResync>('/api/portfolio/positions/resync-valuations/');
  },
  createContainer(payload: PortfolioContainerPayload) {
    return coreApi.post<PortfolioContainer>('/api/portfolio/containers/', payload);
  },
  updateContainer(id: number, payload: PortfolioContainerPayload) {
    return coreApi.patch<PortfolioContainer>(`/api/portfolio/containers/${id}/`, payload);
  },
  reopenPosition(positionId: number) {
    return coreApi.post<void>(`/api/portfolio/positions/${positionId}/reopen/`);
  },
  uploadImport(file: File) {
    const body = new FormData();
    body.append('file', file);
    return coreApi.post<PortfolioImportBatch>('/api/portfolio/imports/upload/', body);
  },
  previewImport(batchId: number, mapping: Record<string, string>) {
    return coreApi.post<PortfolioImportBatch>(`/api/portfolio/imports/${batchId}/preview/`, {
      mapping,
    });
  },
  confirmImport(batchId: number, rowIds?: number[]) {
    return coreApi.post<PortfolioImportBatch>(`/api/portfolio/imports/${batchId}/confirm/`, {
      row_ids: rowIds,
    });
  },
  // One request instead of five: each of the old endpoints rebuilt the whole performance
  // context, so every filter change paid that cost five times over. Instruments stay
  // separate because they are a catalogue, not part of the period read.
  getStrategies(ownershipId: number) {
    return coreApi.get<AllocationStrategy[]>('/api/portfolio/strategies/', {
      params: { ownership_id: ownershipId },
    });
  },
  createStrategy(payload: AllocationStrategyPayload) {
    return coreApi.post<AllocationStrategy>('/api/portfolio/strategies/', payload);
  },
  updateStrategy(id: number, payload: Partial<AllocationStrategyPayload>) {
    return coreApi.patch<AllocationStrategy>(`/api/portfolio/strategies/${id}/`, payload);
  },
  linkCashAccount(payload: { container_id: number; ledger_account_id: number; currency: string }) {
    return coreApi.post<PortfolioCashAccount>('/api/portfolio/cash-accounts/', payload);
  },
  // Mudar el efectivo de un contenedor a otra plataforma es cambiar la cuenta, no
  // desenlazar y volver a enlazar: la cesta que ya apunte a este efectivo sigue
  // hablando del mismo contenedor.
  changeCashAccount(id: number, payload: { ledger_account_id: number; currency: string }) {
    return coreApi.patch<PortfolioCashAccount>(`/api/portfolio/cash-accounts/${id}/`, payload);
  },
  unlinkCashAccount(id: number) {
    return coreApi.delete(`/api/portfolio/cash-accounts/${id}/`);
  },
  getAllocationRules() {
    return coreApi.get<PositionAllocationRule[]>('/api/portfolio/allocation-rules/');
  },
  createAllocationRule(payload: Partial<PositionAllocationRule> & { position_id: number }) {
    return coreApi.post<PositionAllocationRule>('/api/portfolio/allocation-rules/', payload);
  },
  updateAllocationRule(id: number, payload: Partial<PositionAllocationRule>) {
    return coreApi.patch<PositionAllocationRule>(`/api/portfolio/allocation-rules/${id}/`, payload);
  },
  getCommitments() {
    return coreApi.get<ContributionCommitment[]>('/api/portfolio/commitments/');
  },
  createCommitment(payload: Omit<ContributionCommitment, 'id'>) {
    return coreApi.post<ContributionCommitment>('/api/portfolio/commitments/', payload);
  },
  updateCommitment(id: number, payload: Partial<ContributionCommitment>) {
    return coreApi.patch<ContributionCommitment>(`/api/portfolio/commitments/${id}/`, payload);
  },
  deleteCommitment(id: number) {
    return coreApi.delete(`/api/portfolio/commitments/${id}/`);
  },
  getAllocationScopes() {
    return coreApi.get<AllocationScope[]>('/api/portfolio/allocation/scopes/');
  },
  getAllocation(ownershipId: number, onDate?: string) {
    return coreApi.get<PortfolioAllocation>('/api/portfolio/allocation/', {
      params: { ownership_id: ownershipId, ...(onDate ? { on_date: onDate } : {}) },
    });
  },
  solveContribution(ownershipId: number, amount: string) {
    return coreApi.post<ContributionSolve>('/api/portfolio/contribution/solve/', {
      ownership_id: ownershipId,
      amount,
    });
  },
  getBaskets(params: { ownership_id?: number; status?: string } = {}) {
    return coreApi.get<ContributionBasket[]>('/api/portfolio/baskets/', { params });
  },
  createBasket(ownershipId: number, amount: string, sourceAccountId?: number) {
    return coreApi.post<ContributionBasket>('/api/portfolio/baskets/', {
      ownership_id: ownershipId,
      amount,
      ...(sourceAccountId ? { source_account_id: sourceAccountId } : {}),
    });
  },
  confirmBasket(id: number, lineIds?: number[], sourceAccountId?: number) {
    return coreApi.post<ContributionBasket>(`/api/portfolio/baskets/${id}/confirm/`, {
      ...(lineIds ? { line_ids: lineIds } : {}),
      ...(sourceAccountId ? { source_account_id: sourceAccountId } : {}),
    });
  },
  discardBasket(id: number) {
    return coreApi.post<ContributionBasket>(`/api/portfolio/baskets/${id}/discard/`, {});
  },
  getOwnershipPeriods(positionId: number) {
    return coreApi.get<PositionOwnershipPeriod[]>('/api/portfolio/ownership-periods/', {
      params: { position_id: positionId },
    });
  },
  createOwnershipPeriod(payload: PositionOwnershipPeriodPayload) {
    return coreApi.post<PositionOwnershipPeriod>('/api/portfolio/ownership-periods/', payload);
  },
  deleteOwnershipPeriod(id: number) {
    return coreApi.delete(`/api/portfolio/ownership-periods/${id}/`);
  },
  async getWorkspace(params: PortfolioQuery): Promise<PortfolioWorkspacePayload> {
    const [workspace, instruments] = await Promise.all([
      coreApi.get<Omit<PortfolioWorkspacePayload, 'instruments'>>('/api/portfolio/workspace/', {
        params,
      }),
      this.getInstruments(),
    ]);
    return { ...workspace.data, instruments: instruments.data };
  },
};
