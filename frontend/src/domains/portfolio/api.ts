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
