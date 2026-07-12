<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, AState } from '@/domains/ui';
import type { PlanEvent, PlanEventCloseResponse } from '@/domains/plan/types';
import { planEventStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import { toApiErrorMessage } from '@/lib/errors';

const props = defineProps<{
  events: PlanEvent[];
  saving?: boolean;
  closeEvent?: (
    id: number,
    payload: { effective_date: string; note?: string },
  ) => Promise<PlanEventCloseResponse>;
  releaseEvent?: (id: number) => Promise<void>;
}>();

const closingId = ref<number | null>(null);
const effectiveDate = ref('');
const note = ref('');
const closeError = ref<string | null>(null);
const closeSuccess = ref<string | null>(null);
const releasingId = ref<number | null>(null);

const closingEvent = computed(() => props.events.find((event) => event.id === closingId.value));

/** Solo los registros retrospectivos pueden deshacerse: devuelven las partidas adoptadas. */
function isRegistered(event: PlanEvent): boolean {
  return Boolean((event.actual_impact_json as { registration?: unknown })?.registration);
}

async function release(event: PlanEvent): Promise<void> {
  if (!props.releaseEvent) return;
  closeError.value = null;
  closeSuccess.value = null;
  if (releasingId.value !== event.id) {
    releasingId.value = event.id;
    return;
  }
  try {
    await props.releaseEvent(event.id);
    closeSuccess.value = 'Registro deshecho: las partidas vuelven a ser tuyas en Presupuesto.';
  } catch (error) {
    closeError.value = toApiErrorMessage(error);
  } finally {
    releasingId.value = null;
  }
}

function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function beginClose(event: PlanEvent): void {
  closingId.value = event.id;
  effectiveDate.value = event.planned_date > todayIso() ? event.planned_date : todayIso();
  note.value = '';
  closeError.value = null;
  closeSuccess.value = null;
}

function cancelClose(): void {
  closingId.value = null;
  closeError.value = null;
}

async function confirmClose(): Promise<void> {
  if (!closingEvent.value || !props.closeEvent) return;
  closeError.value = null;
  try {
    const result = await props.closeEvent(closingEvent.value.id, {
      effective_date: effectiveDate.value,
      note: note.value.trim() || undefined,
    });
    const changed = result.budget_changes.changed.length;
    const deleted = result.budget_changes.deleted.length;
    closeSuccess.value = `${changed} partida${changed === 1 ? '' : 's'} ajustada${changed === 1 ? '' : 's'} y ${deleted} retirada${deleted === 1 ? '' : 's'}.`;
    closingId.value = null;
  } catch (error) {
    closeError.value = toApiErrorMessage(error);
  }
}

function shortDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-ES');
}
</script>

<template>
  <section class="sect plan-events">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Acontecimientos</p>
        <h2 class="sect-title">Incorporados al plan</h2>
      </div>
    </div>

    <div v-if="!events.length" class="plan-empty-inline">
      <p class="plan-muted">Todavía no hay decisiones incorporadas.</p>
      <RouterLink class="btn btn-ghost btn-sm" to="/plan/escenarios">Crear escenario</RouterLink>
    </div>
    <AState v-if="closeSuccess" status="success" layout="inline">
      <div class="plan-event-close-result">
        <span>{{ closeSuccess }}</span>
        <RouterLink class="btn btn-ghost btn-sm" to="/presupuesto">Ver presupuesto</RouterLink>
      </div>
    </AState>
    <div v-if="closingEvent" class="plan-scenario-notice plan-event-close-confirm">
      <div>
        <strong>Dar de baja «{{ closingEvent.name }}»</strong>
        <p>
          Se retirarán sus efectos recurrentes desde esa fecha y se recalculará la proyección. El
          histórico se conserva. Esto no modifica Patrimonio: da de baja allí el activo real si
          corresponde.
        </p>
      </div>
      <label>
        <span>Fecha efectiva</span>
        <input v-model="effectiveDate" class="input" type="date" :min="closingEvent.planned_date" />
      </label>
      <label>
        <span>Nota opcional</span>
        <textarea v-model="note" class="textarea" rows="2" maxlength="500" />
      </label>
      <AState v-if="closeError" status="error" layout="inline">{{ closeError }}</AState>
      <div class="plan-scenario-notice-actions">
        <AButton variant="primary" size="sm" :loading="saving" @click="confirmClose">
          Confirmar baja
        </AButton>
        <AButton variant="ghost" size="sm" :disabled="saving" @click="cancelClose">
          Cancelar
        </AButton>
      </div>
    </div>
    <ol v-else class="plan-event-list">
      <li v-for="event in events" :key="event.id">
        <span class="plan-event-date mono">{{ event.planned_date.slice(0, 7) }}</span>
        <div>
          <strong>{{ event.name }}</strong>
          <span>
            {{ scenarioTemplateLabel(event.event_type) }} ·
            <template v-if="event.effective_end_date">
              Cerrado el {{ shortDate(event.effective_end_date) }}
            </template>
            <template v-else>{{ planEventStatusLabel(event.status) }}</template>
          </span>
        </div>
        <div class="plan-event-actions">
          <AButton
            v-if="isRegistered(event) && releaseEvent"
            variant="ghost"
            size="sm"
            :loading="saving && releasingId === event.id"
            @click="release(event)"
          >
            {{ releasingId === event.id ? 'Confirmar deshacer' : 'Deshacer registro' }}
          </AButton>
          <AButton
            v-if="!event.effective_end_date && closeEvent"
            variant="ghost"
            size="sm"
            @click="beginClose(event)"
          >
            Dar de baja
          </AButton>
        </div>
      </li>
    </ol>
  </section>
</template>
