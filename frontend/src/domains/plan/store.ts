import { defineStore } from 'pinia';
import { coreNetWorthApi } from '@/domains/net-worth/api';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import { planApi } from '@/domains/plan/api';
import type {
  FinancialPlan,
  FinancialPlanPayload,
  PlanMember,
  PlanMemberPayload,
  ProjectionResponse,
  ProjectionScenario,
} from '@/domains/plan/types';

function toErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { detail?: string } } })
    ?.response;
  if (response?.status === 404) return 'not_found';
  return response?.data?.detail ?? 'No se pudo cargar Mi Plan.';
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plan: null as FinancialPlan | null,
    projection: null as ProjectionResponse | null,
    netWorthTimeline: null as NetWorthTimeline | null,
    scenario: 'expected' as ProjectionScenario,
    loading: false,
    saving: false,
    recalculating: false,
    error: null as string | null,
    planMissing: false,
  }),

  getters: {
    hasPlan(state) {
      return Boolean(state.plan);
    },
  },

  actions: {
    clearError() {
      this.error = null;
    },

    async fetchPlan() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await planApi.getPlan();
        this.plan = data;
        this.planMissing = false;
      } catch (error) {
        const message = toErrorMessage(error);
        if (message === 'not_found') {
          this.plan = null;
          this.projection = null;
          this.planMissing = true;
        } else {
          this.error = message;
        }
      } finally {
        this.loading = false;
      }
    },

    async fetchProjection(scenario?: ProjectionScenario) {
      if (!this.plan) return;
      const selectedScenario = scenario ?? this.scenario;
      this.loading = true;
      this.error = null;
      this.scenario = selectedScenario;
      try {
        const { data } = await planApi.getProjection(selectedScenario);
        this.projection = data;
      } catch (error) {
        this.error = toErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchTimeline() {
      try {
        const { data } = await coreNetWorthApi.getTimeline();
        this.netWorthTimeline = data;
      } catch {
        this.netWorthTimeline = null;
      }
    },

    async loadDashboard(scenario?: ProjectionScenario) {
      await this.fetchPlan();
      if (!this.plan) return;
      await Promise.all([this.fetchProjection(scenario ?? this.scenario), this.fetchTimeline()]);
    },

    async recalculate(scenario?: ProjectionScenario) {
      if (!this.plan) return;
      const selectedScenario = scenario ?? this.scenario;
      this.recalculating = true;
      this.error = null;
      try {
        const { data } = await planApi.recalculate(selectedScenario);
        this.projection = data;
      } catch (error) {
        this.error = toErrorMessage(error);
      } finally {
        this.recalculating = false;
      }
    },

    async savePlan(payload: FinancialPlanPayload) {
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.savePlan(payload);
        this.plan = data;
        this.planMissing = false;
        return data;
      } catch (error) {
        this.error = toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async saveMember(member: Partial<PlanMember> & PlanMemberPayload): Promise<PlanMember> {
      if (member.id) {
        const { data } = await planApi.updateMember(member.id, member);
        return data;
      }
      const { data } = await planApi.createMember(member);
      return data;
    },
  },
});
