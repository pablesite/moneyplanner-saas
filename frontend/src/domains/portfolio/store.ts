import { defineStore } from 'pinia';
import { toApiErrorMessage } from '@/lib/errors';
import type { FamilyMember } from '@/domains/people/types';
import { corePortfolioApi } from './api';
import type {
  PortfolioInstrument,
  PortfolioOverview,
  PortfolioPerformance,
  PortfolioPositionsResponse,
  PortfolioQuality,
  PortfolioQuery,
  PortfolioTimeline,
} from './types';

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    loading: false,
    error: null as string | null,
    overview: null as PortfolioOverview | null,
    performance: null as PortfolioPerformance | null,
    scope: null as number[] | null,
    positions: null as PortfolioPositionsResponse | null,
    timeline: null as PortfolioTimeline | null,
    quality: null as PortfolioQuality | null,
    instruments: [] as PortfolioInstrument[],
    members: [] as FamilyMember[],
    requestSequence: 0,
  }),
  actions: {
    async loadMembers() {
      if (this.members.length) return;
      try {
        const response = await corePortfolioApi.getMembers();
        this.members = response.data.filter((member) => member.is_active);
      } catch {
        this.members = [];
      }
    },
    async refresh(query: PortfolioQuery) {
      const sequence = ++this.requestSequence;
      this.loading = true;
      this.error = null;
      try {
        const payload = await corePortfolioApi.getWorkspace(query);
        if (sequence !== this.requestSequence) return;
        this.overview = payload.overview;
        this.scope = payload.scope;
        this.performance = payload.performance;
        this.positions = payload.positions;
        this.timeline = payload.timeline;
        this.quality = payload.quality;
        this.instruments = payload.instruments;
      } catch (error: unknown) {
        if (sequence !== this.requestSequence) return;
        this.error = toApiErrorMessage(error);
      } finally {
        if (sequence === this.requestSequence) this.loading = false;
      }
    },
  },
});
