import { defineStore } from 'pinia';
import { coreNetWorthApi } from '@/domains/net-worth/api';
import type { NetWorthTimeline } from '@/domains/net-worth/models';
import { planApi } from '@/domains/plan/api';
import { getApiErrorFieldMessages, toApiErrorMessage } from '@/lib/errors';
import type {
  AssetFunctionResponse,
  FinancialPlan,
  FinancialPlanPayload,
  OccurredEventPayload,
  PlanAssetFunction,
  PlanEvent,
  PlanFinding,
  PlanFoundations,
  PlanMember,
  PlanMemberPayload,
  PlanRecommendation,
  PlanScenario,
  PlanScenarioComparison,
  PlanScenarioPayload,
  ProjectionResponse,
  ProjectionScenario,
} from '@/domains/plan/types';

function isNotFound(error: unknown): boolean {
  return (error as { response?: { status?: number } })?.response?.status === 404;
}

function toErrorMessage(error: unknown, notFoundMessage = 'No se pudo cargar Mi Plan.'): string {
  const response = (error as { response?: { status?: number } })?.response;
  if (response?.status === 404) return notFoundMessage;
  return toApiErrorMessage(error);
}

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plan: null as FinancialPlan | null,
    projection: null as ProjectionResponse | null,
    netWorthTimeline: null as NetWorthTimeline | null,
    scenarios: [] as PlanScenario[],
    selectedScenario: null as PlanScenario | null,
    scenarioComparison: null as PlanScenarioComparison | null,
    events: [] as PlanEvent[],
    foundations: null as PlanFoundations | null,
    assetFunctions: null as AssetFunctionResponse | null,
    assetFunctionsLoading: false,
    findings: [] as PlanFinding[],
    recommendations: [] as PlanRecommendation[],
    scenario: 'expected' as ProjectionScenario,
    loading: false,
    scenariosLoading: false,
    comparisonLoading: false,
    recommendationsLoading: false,
    saving: false,
    recalculating: false,
    error: null as string | null,
    scenarioFieldErrors: {} as Record<string, string>,
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
        if (isNotFound(error)) {
          this.plan = null;
          this.projection = null;
          this.planMissing = true;
        } else {
          this.error = toErrorMessage(error);
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

    async fetchEvents() {
      try {
        const { data } = await planApi.getEvents();
        this.events = data;
      } catch {
        this.events = [];
      }
    },

    async closePlanEvent(id: number, payload: { effective_date: string; note?: string }) {
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.closeEvent(id, payload);
        this.events = this.events.map((event) => (event.id === id ? data.event : event));
        this.projection = data.projection;
        return data;
      } catch (error) {
        this.error = toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async registerOccurredEvent(payload: OccurredEventPayload) {
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.registerOccurredEvent(payload);
        this.events = [...this.events, data];
        return data;
      } catch (error) {
        this.error = toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async releaseEvent(id: number) {
      this.saving = true;
      this.error = null;
      try {
        await planApi.releaseEvent(id);
        this.events = this.events.filter((event) => event.id !== id);
      } catch (error) {
        this.error = toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async fetchFoundations() {
      try {
        const { data } = await planApi.getFoundations();
        this.foundations = data;
      } catch {
        this.foundations = null;
      }
    },

    async fetchAssetFunctions() {
      this.assetFunctionsLoading = true;
      this.error = null;
      try {
        const { data } = await planApi.getAssetFunctions();
        this.assetFunctions = data;
      } catch (error) {
        this.error = toErrorMessage(error);
      } finally {
        this.assetFunctionsLoading = false;
      }
    },

    async updateAssetFunction(assetId: number, fn: PlanAssetFunction | null) {
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.updateAssetFunctions([{ asset_id: assetId, function: fn }]);
        this.assetFunctions = data;
        return data;
      } catch (error) {
        this.error = toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async fetchFindings() {
      try {
        const { data } = await planApi.getFindings();
        this.findings = data;
      } catch {
        this.findings = [];
      }
    },

    async fetchRecommendations() {
      this.recommendationsLoading = true;
      try {
        const { data } = await planApi.getRecommendations();
        this.recommendations = data;
      } catch {
        this.recommendations = [];
      } finally {
        this.recommendationsLoading = false;
      }
    },

    async loadDashboard(scenario?: ProjectionScenario) {
      await this.fetchPlan();
      if (!this.plan) return;
      await Promise.all([
        this.fetchProjection(scenario ?? this.scenario),
        this.fetchTimeline(),
        this.fetchEvents(),
        this.fetchFoundations(),
        this.fetchFindings(),
        this.fetchRecommendations(),
      ]);
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
      try {
        if (member.id) {
          const { data } = await planApi.updateMember(member.id, member);
          return data;
        }
        const { data } = await planApi.createMember(member);
        return data;
      } catch (error) {
        this.error = toErrorMessage(error, 'No se pudo guardar un adulto del plan.');
        throw error;
      }
    },

    async fetchScenarios() {
      this.scenariosLoading = true;
      this.error = null;
      try {
        const { data } = await planApi.getScenarios();
        this.scenarios = data;
      } catch (error) {
        this.error = toErrorMessage(error);
      } finally {
        this.scenariosLoading = false;
      }
    },

    async createScenario(payload: PlanScenarioPayload): Promise<PlanScenario> {
      this.saving = true;
      this.error = null;
      this.scenarioFieldErrors = {};
      try {
        const { data } = await planApi.createScenario(payload);
        this.selectedScenario = data;
        await this.fetchScenarios();
        return data;
      } catch (error) {
        this.scenarioFieldErrors = getApiErrorFieldMessages(error);
        this.error = Object.keys(this.scenarioFieldErrors).length ? null : toErrorMessage(error);
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async fetchScenario(id: number) {
      this.scenariosLoading = true;
      this.error = null;
      try {
        const { data } = await planApi.getScenario(id);
        this.selectedScenario = data;
      } catch (error) {
        this.error = toErrorMessage(error, 'No se encontró el escenario.');
      } finally {
        this.scenariosLoading = false;
      }
    },

    async fetchScenarioComparison(id: number, scenario?: ProjectionScenario) {
      const selectedScenario = scenario ?? this.scenario;
      this.comparisonLoading = true;
      this.error = null;
      this.scenario = selectedScenario;
      try {
        const { data } = await planApi.getScenarioComparison(id, selectedScenario);
        this.scenarioComparison = data;
      } catch (error) {
        this.error = toErrorMessage(error, 'No se encontró el escenario.');
      } finally {
        this.comparisonLoading = false;
      }
    },

    async acceptScenario(id: number, scenario?: ProjectionScenario) {
      const selectedScenario = scenario ?? this.scenario;
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.acceptScenario(id, selectedScenario);
        this.projection = data.projection;
        await Promise.all([this.fetchScenario(id), this.fetchScenarios(), this.fetchEvents()]);
        return data;
      } catch (error) {
        this.error = toErrorMessage(error, 'No se encontró el escenario.');
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async discardScenario(id: number) {
      this.saving = true;
      this.error = null;
      try {
        const { data } = await planApi.discardScenario(id);
        this.selectedScenario = data;
        await this.fetchScenarios();
        return data;
      } catch (error) {
        this.error = toErrorMessage(error, 'No se encontró el escenario.');
        throw error;
      } finally {
        this.saving = false;
      }
    },

    async acceptRecommendation(id: number) {
      const { data } = await planApi.acceptRecommendation(id);
      this.recommendations = this.recommendations.map((item) => (item.id === id ? data : item));
      return data;
    },

    async dismissRecommendation(id: number) {
      const { data } = await planApi.dismissRecommendation(id);
      this.recommendations = this.recommendations.map((item) => (item.id === id ? data : item));
      return data;
    },

    async simulateRecommendation(id: number) {
      const { data } = await planApi.simulateRecommendation(id);
      this.selectedScenario = data;
      await this.fetchScenarios();
      return data;
    },
  },
});
