import { coreApi } from '@/lib/api';
import type {
  MonthlyClosePlanImpact,
  MonthlyCloseStateResponse,
  SettlementCandidate,
  SettlementRecommendation,
} from './types';
import type {
  SettlementConfiguration,
  SettlementConfigurationWrite,
  SettlementReadiness,
  SettlementRebaselineWrite,
} from './settlementTypes';

export const budgetApi = coreApi;
export { toApiErrorMessage as toBudgetErrorMessage } from '@/lib/errors';

export async function getMonthlyClose(
  year: number,
  month: number,
): Promise<MonthlyCloseStateResponse> {
  const response = await coreApi.get<MonthlyCloseStateResponse>(
    `/api/budget/monthly-close/${year}/${month}/`,
  );
  return response.data;
}

export async function patchMonthlyClose(
  year: number,
  month: number,
  payload: Record<string, unknown>,
): Promise<MonthlyCloseStateResponse> {
  const response = await coreApi.patch<MonthlyCloseStateResponse>(
    `/api/budget/monthly-close/${year}/${month}/`,
    payload,
  );
  return response.data;
}

export async function finalizeMonthlyClose(year: number, month: number): Promise<void> {
  await coreApi.post(`/api/budget/monthly-close/${year}/${month}/finalize/`);
}

export async function reopenMonthlyClose(year: number, month: number): Promise<void> {
  await coreApi.post(`/api/budget/monthly-close/${year}/${month}/reopen/`);
}

export async function lockMonthlyClose(year: number, month: number): Promise<void> {
  await coreApi.post(`/api/budget/monthly-close/${year}/${month}/lock/`);
}

export async function getMonthlyClosePlanImpact(
  monthlyCloseId: number,
): Promise<MonthlyClosePlanImpact | null> {
  const response = await coreApi.get<MonthlyClosePlanImpact>(
    `/api/budget/monthly-closes/${monthlyCloseId}/plan-impact/`,
    { validateStatus: (status) => status === 200 || status === 204 },
  );
  return response.status === 204 ? null : response.data;
}

export async function getSettlementConfiguration(): Promise<SettlementConfiguration> {
  const response = await coreApi.get<SettlementConfiguration>(
    '/api/budget/settlement/configuration/',
  );
  return response.data;
}

export async function saveSettlementConfiguration(
  payload: SettlementConfigurationWrite,
): Promise<SettlementConfiguration> {
  const response = await coreApi.put<SettlementConfiguration>(
    '/api/budget/settlement/configuration/',
    payload,
  );
  return response.data;
}

export async function getSettlementReadiness(
  year: number,
  month: number,
  balanceDate?: string,
): Promise<SettlementReadiness> {
  const params: { year: number; month: number; balance_date?: string } = { year, month };
  if (balanceDate) params.balance_date = balanceDate;
  const response = await coreApi.get<SettlementReadiness>('/api/budget/settlement/readiness/', {
    params,
  });
  return response.data;
}

export async function activateSettlement(startDate: string): Promise<SettlementConfiguration> {
  const response = await coreApi.post<SettlementConfiguration>('/api/budget/settlement/activate/', {
    start_date: startDate,
  });
  return response.data;
}

export async function rebaselineSettlement(
  payload: SettlementRebaselineWrite,
): Promise<SettlementConfiguration> {
  const response = await coreApi.post<SettlementConfiguration>(
    '/api/budget/settlement/rebaseline/',
    payload,
  );
  return response.data;
}

export async function disableSettlement(): Promise<SettlementConfiguration> {
  const response = await coreApi.post<SettlementConfiguration>('/api/budget/settlement/disable/');
  return response.data;
}

function recommendationActionUrl(closeId: number, recommendationId: number, action: string) {
  return `/api/budget/monthly-closes/${closeId}/settlement/recommendations/${recommendationId}/${action}/`;
}

export async function applyAllSettlementRecommendations(
  closeId: number,
  executionDate: string,
): Promise<SettlementRecommendation[]> {
  const response = await coreApi.post<{ recommendations: SettlementRecommendation[] }>(
    `/api/budget/monthly-closes/${closeId}/settlement/apply/`,
    { execution_date: executionDate },
  );
  return response.data.recommendations;
}

export async function applySettlementRecommendation(
  closeId: number,
  recommendationId: number,
  payload: { execution_date: string; amount?: string; idempotency_key: string },
): Promise<SettlementRecommendation> {
  const response = await coreApi.post<SettlementRecommendation>(
    recommendationActionUrl(closeId, recommendationId, 'apply'),
    payload,
  );
  return response.data;
}

export async function acceptSettlementRecommendation(closeId: number, recommendationId: number) {
  const response = await coreApi.post<SettlementRecommendation>(
    recommendationActionUrl(closeId, recommendationId, 'accept'),
  );
  return response.data;
}

export async function cancelSettlementRecommendation(closeId: number, recommendationId: number) {
  const response = await coreApi.post<SettlementRecommendation>(
    recommendationActionUrl(closeId, recommendationId, 'cancel'),
  );
  return response.data;
}

export async function reverseSettlementRecommendation(
  closeId: number,
  recommendationId: number,
  payload: { execution_date: string; amount?: string; idempotency_key: string },
) {
  const response = await coreApi.post<SettlementRecommendation>(
    recommendationActionUrl(closeId, recommendationId, 'reverse'),
    payload,
  );
  return response.data;
}

export async function getSettlementCandidates(closeId: number, recommendationId: number) {
  const response = await coreApi.get<{ candidates: SettlementCandidate[] }>(
    `/api/budget/monthly-closes/${closeId}/settlement/recommendations/${recommendationId}/candidates/`,
  );
  return response.data.candidates;
}

export async function reconcileSettlementRecommendation(
  closeId: number,
  recommendationId: number,
  transactionId: number,
) {
  const response = await coreApi.post<SettlementRecommendation>(
    recommendationActionUrl(closeId, recommendationId, 'reconcile'),
    { transaction_id: transactionId },
  );
  return response.data;
}
