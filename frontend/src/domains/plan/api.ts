import { coreApi } from '@/lib/api';
import type {
  AssetFunctionResponse,
  AssetFunctionUpdate,
  CapitalRequirementsResponse,
  FinancialPlan,
  FinancialPlanPayload,
  OccurredEventPayload,
  PlanMember,
  PlanMemberPayload,
  PlanEvent,
  PlanEventBudgetLines,
  PlanEventCancelResponse,
  PlanEventCloseResponse,
  PlanEventMaterializeResponse,
  PlanFinding,
  PlanFoundations,
  ProjectionResponse,
  ProjectionScenario,
  ProjectionSnapshot,
  PlanRecommendation,
  PlanScenario,
  PlanScenarioComparison,
  PlanScenarioPayload,
} from '@/domains/plan/types';

export const planApi = {
  getPlan() {
    return coreApi.get<FinancialPlan>('/api/plan/');
  },
  savePlan(payload: FinancialPlanPayload) {
    return coreApi.post<FinancialPlan>('/api/plan/', payload);
  },
  patchPlan(payload: Partial<FinancialPlanPayload>) {
    return coreApi.patch<FinancialPlan>('/api/plan/', payload);
  },
  getProjection(scenario: ProjectionScenario = 'expected') {
    return coreApi.get<ProjectionResponse>('/api/plan/projection/', {
      params: { scenario },
    });
  },
  recalculate(scenario: ProjectionScenario = 'expected') {
    return coreApi.post<ProjectionResponse>('/api/plan/recalculate/', { scenario });
  },
  getHistory() {
    return coreApi.get<ProjectionSnapshot[]>('/api/plan/history/');
  },
  getCapitalRequirements(monthlyAmounts: number[], scenario: ProjectionScenario = 'expected') {
    return coreApi.get<CapitalRequirementsResponse>('/api/plan/capital-requirements/', {
      params: {
        monthly_amounts: monthlyAmounts.map((amount) => amount.toFixed(2)).join(','),
        scenario,
      },
    });
  },
  createMember(payload: PlanMemberPayload) {
    return coreApi.post<PlanMember>('/api/plan/members/', payload);
  },
  updateMember(id: number, payload: Partial<PlanMemberPayload>) {
    return coreApi.patch<PlanMember>(`/api/plan/members/${id}/`, payload);
  },
  getAssetFunctions() {
    return coreApi.get<AssetFunctionResponse>('/api/plan/asset-functions/');
  },
  updateAssetFunctions(items: AssetFunctionUpdate[]) {
    return coreApi.put<AssetFunctionResponse>('/api/plan/asset-functions/', items);
  },
  getScenarios() {
    return coreApi.get<PlanScenario[]>('/api/plan/scenarios/');
  },
  createScenario(payload: PlanScenarioPayload) {
    return coreApi.post<PlanScenario>('/api/plan/scenarios/', payload);
  },
  updateScenario(id: number, payload: Partial<PlanScenarioPayload>) {
    return coreApi.patch<PlanScenario>(`/api/plan/scenarios/${id}/`, payload);
  },
  getScenario(id: number) {
    return coreApi.get<PlanScenario>(`/api/plan/scenarios/${id}/`);
  },
  getScenarioComparison(id: number, scenario: ProjectionScenario = 'expected') {
    return coreApi.get<PlanScenarioComparison>(`/api/plan/scenarios/${id}/comparison/`, {
      params: { scenario },
    });
  },
  acceptScenario(id: number, scenario: ProjectionScenario = 'expected') {
    return coreApi.post<{
      event: PlanEvent;
      projection: ProjectionResponse;
      budget_entries_created: number;
    }>(`/api/plan/scenarios/${id}/accept/`, { scenario });
  },
  discardScenario(id: number) {
    return coreApi.post<PlanScenario>(`/api/plan/scenarios/${id}/discard/`, {});
  },
  getEvents() {
    return coreApi.get<PlanEvent[]>('/api/plan/events/');
  },
  getEventBudgetLines(id: number) {
    return coreApi.get<PlanEventBudgetLines>(`/api/plan/events/${id}/budget-lines/`);
  },
  closeEvent(id: number, payload: { effective_date: string; note?: string }) {
    return coreApi.post<PlanEventCloseResponse>(`/api/plan/events/${id}/close/`, payload);
  },
  registerOccurredEvent(payload: OccurredEventPayload) {
    return coreApi.post<PlanEvent>('/api/plan/events/occurred/', payload);
  },
  materializeEvent(id: number, payload: { actual_date: string; note?: string }) {
    return coreApi.post<PlanEventMaterializeResponse>(
      `/api/plan/events/${id}/materialize/`,
      payload,
    );
  },
  cancelEvent(id: number) {
    return coreApi.post<PlanEventCancelResponse>(`/api/plan/events/${id}/cancel/`, {});
  },
  releaseEvent(id: number) {
    return coreApi.delete<{ released_lines: unknown[] }>(`/api/plan/events/${id}/`);
  },
  getFoundations() {
    return coreApi.get<PlanFoundations>('/api/plan/foundations/');
  },
  getFindings() {
    return coreApi.get<PlanFinding[]>('/api/plan/findings/');
  },
  getRecommendations() {
    return coreApi.get<PlanRecommendation[]>('/api/plan/recommendations/');
  },
  acceptRecommendation(id: number) {
    return coreApi.post<PlanRecommendation>(`/api/plan/recommendations/${id}/accept/`, {});
  },
  dismissRecommendation(id: number) {
    return coreApi.post<PlanRecommendation>(`/api/plan/recommendations/${id}/dismiss/`, {});
  },
  simulateRecommendation(id: number) {
    return coreApi.post<PlanScenario>(`/api/plan/recommendations/${id}/simulate/`, {});
  },
};
