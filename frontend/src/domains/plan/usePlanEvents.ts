import { computed, ref } from 'vue';
import { planApi } from '@/domains/plan/api';
import type { PlanEvent, PlanScenarioTemplate } from '@/domains/plan/types';
import { toApiErrorMessage } from '@/lib/errors';
import { formatNumber, toNumber } from '@/lib/format';

export type PlanTimelineMarker = {
  id: number;
  date: string;
  label: string;
  detail: string;
  status: PlanEvent['status'];
};

const eventTypeLabels: Record<PlanScenarioTemplate, string> = {
  housing: 'Vivienda',
  vehicle: 'Vehículo',
  studies: 'Estudios',
  renovation: 'Reforma',
  sabbatical: 'Sabbatical',
  reduced_hours: 'Reducción de jornada',
  business: 'Negocio',
  debt_payoff: 'Cancelación de deuda',
  generic: 'Evento planificado',
};

function eventLabel(type: PlanScenarioTemplate): string {
  return eventTypeLabels[type] ?? 'Evento planificado';
}

function impactValue(payload: Record<string, unknown>, key: string): unknown {
  const delta = payload.comparison_delta;
  if (!delta || typeof delta !== 'object') return null;
  return (delta as Record<string, unknown>)[key];
}

function formatSignedAmount(value: number): string {
  return `${value > 0 ? '+' : ''}${formatNumber(value, 0)} EUR`;
}

function markerDetail(event: PlanEvent): string {
  const details = [eventLabel(event.event_type)];
  const netWorthDelta = toNumber(impactValue(event.planned_impact_json, 'net_worth'));
  const projectedYearDelta = impactValue(event.planned_impact_json, 'projected_year');
  const lines = event.planned_impact_json.budget_lines;
  const budgetLineCount = Array.isArray(lines) ? lines.length : 0;

  if (netWorthDelta !== 0) {
    details.push(`Patrimonio objetivo ${formatSignedAmount(netWorthDelta)}`);
  }
  if (typeof projectedYearDelta === 'number' && projectedYearDelta !== 0) {
    details.push(
      `Fecha proyectada ${projectedYearDelta > 0 ? '+' : ''}${projectedYearDelta} año${Math.abs(projectedYearDelta) === 1 ? '' : 's'}`,
    );
  }
  if (budgetLineCount > 0) {
    details.push(`${budgetLineCount} partida${budgetLineCount === 1 ? '' : 's'} de presupuesto`);
  }
  return details.join(' · ');
}

export function usePlanEvents() {
  const events = ref<PlanEvent[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function refresh(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await planApi.getEvents();
      events.value = response.data;
    } catch (unknownError: unknown) {
      error.value = toApiErrorMessage(unknownError);
    } finally {
      loading.value = false;
    }
  }

  const markers = computed<PlanTimelineMarker[]>(() =>
    events.value
      .filter((event) => event.status !== 'cancelled')
      .map((event) => ({
        id: event.id,
        date: event.actual_date ?? event.planned_date,
        label: event.name,
        detail: markerDetail(event),
        status: event.status,
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  );

  void refresh();

  return {
    events,
    markers,
    loading,
    error,
    refresh,
  };
}
