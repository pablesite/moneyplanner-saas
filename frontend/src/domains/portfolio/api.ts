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
  async getWorkspace(params: PortfolioQuery): Promise<PortfolioWorkspacePayload> {
    const [overview, performance, positions, timeline, quality, instruments] = await Promise.all([
      this.getOverview(params),
      this.getPerformance(params),
      this.getPositions(params),
      this.getTimeline(params),
      this.getQuality(params),
      this.getInstruments(),
    ]);
    return {
      overview: overview.data,
      performance: performance.data,
      positions: positions.data,
      timeline: timeline.data,
      quality: quality.data,
      instruments: instruments.data,
    };
  },
};
