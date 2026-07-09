import { coreApi } from '@/lib/api';
import type {
  AssetFunctionResponse,
  AssetFunctionUpdate,
  FinancialPlan,
  FinancialPlanPayload,
  PlanMember,
  PlanMemberPayload,
  ProjectionResponse,
  ProjectionScenario,
  ProjectionSnapshot,
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
};
