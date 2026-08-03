<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, AState, BaseModal } from '@/domains/ui';
import PlanEventImpact from '@/domains/plan/components/PlanEventImpact.vue';
import type {
  PlanEvent,
  PlanEventCancelResponse,
  PlanEventCloseResponse,
  PlanEventMaterializeResponse,
} from '@/domains/plan/types';
import { planEventStatusLabel, scenarioTemplateLabel } from '@/domains/plan/scenarioTemplates';
import { formatShortMonthYear } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';

const props = withDefaults(
  defineProps<{
    events: PlanEvent[];
    saving?: boolean;
    eyebrow?: string;
    title?: string;
    emptyCopy?: string;
    emptyAction?: boolean;
    allowEditing?: boolean;
    closeEvent?: (
      id: number,
      payload: { effective_date: string; note?: string },
    ) => Promise<PlanEventCloseResponse>;
    releaseEvent?: (id: number) => Promise<void>;
    materializeEvent?: (
      id: number,
      payload: { actual_date: string; note?: string },
    ) => Promise<PlanEventMaterializeResponse>;
    cancelEvent?: (id: number) => Promise<PlanEventCancelResponse>;
  }>(),
  {
    eyebrow: 'Acontecimientos',
    title: 'Incorporados al plan',
    emptyCopy: 'Todavía no hay decisiones incorporadas.',
    emptyAction: true,
    allowEditing: false,
  },
);

const closingId = ref<number | null>(null);
const effectiveDate = ref('');
const note = ref('');
const closeError = ref<string | null>(null);
const closeSuccess = ref<string | null>(null);
// La decisión que originó el último éxito, para mantener el resultado en su diálogo.
const successId = ref<number | null>(null);
const releasingId = ref<number | null>(null);
const materializingId = ref<number | null>(null);
const actualDate = ref('');
const cancellingId = ref<number | null>(null);
const selectedId = ref<number | null>(null);

/** El impacto real de la decisión: sus partidas y lo que trajo a Patrimonio. */
function openImpact(event: PlanEvent): void {
  selectedId.value = event.id;
  closeError.value = null;
}

function closeImpact(): void {
  selectedId.value = null;
  closingId.value = null;
  materializingId.value = null;
  cancellingId.value = null;
  releasingId.value = null;
  closeError.value = null;
}

const closingEvent = computed(() => props.events.find((event) => event.id === closingId.value));
const selectedEvent = computed(() => props.events.find((event) => event.id === selectedId.value));
const materializingEvent = computed(() =>
  props.events.find((event) => event.id === materializingId.value),
);

/** Solo los registros retrospectivos pueden deshacerse: devuelven las partidas adoptadas. */
function isRegistered(event: PlanEvent): boolean {
  return Boolean((event.actual_impact_json as { registration?: unknown })?.registration);
}

/** Una previsión: aún no ha pasado, así que puede hacerse realidad o cancelarse. */
function isForecast(event: PlanEvent): boolean {
  return event.status === 'planned' && !event.effective_end_date;
}

function isEditable(event: PlanEvent): boolean {
  const registration = (event.actual_impact_json as { registration?: unknown })?.registration;
  return (
    props.allowEditing &&
    event.status === 'planned' &&
    (event.source_scenario != null ||
      (registration != null &&
        typeof registration === 'object' &&
        Array.isArray((registration as { adopted_lines?: unknown }).adopted_lines)))
  );
}

function beginMaterialize(event: PlanEvent): void {
  materializingId.value = event.id;
  closingId.value = null;
  actualDate.value = todayIso();
  note.value = '';
  closeError.value = null;
  closeSuccess.value = null;
}

async function confirmMaterialize(): Promise<void> {
  if (!materializingEvent.value || !props.materializeEvent) return;
  closeError.value = null;
  try {
    const eventId = materializingEvent.value.id;
    const result = await props.materializeEvent(eventId, {
      actual_date: actualDate.value,
      note: note.value.trim() || undefined,
    });
    const created = [...result.created_liabilities, ...result.created_assets]
      .map((item) => item.name)
      .join(', ');
    const released = result.budget_lines_released.length;
    closeSuccess.value = created
      ? `Creado en Patrimonio: ${created}. ${released} partida${released === 1 ? '' : 's'} vuelve${released === 1 ? '' : 'n'} a ser tuya${released === 1 ? '' : 's'} en Presupuesto.`
      : 'Decisión marcada como ocurrida.';
    successId.value = eventId;
    materializingId.value = null;
  } catch (error) {
    closeError.value = toApiErrorMessage(error);
  }
}

async function cancel(event: PlanEvent): Promise<void> {
  if (!props.cancelEvent) return;
  closeError.value = null;
  closeSuccess.value = null;
  if (cancellingId.value !== event.id) {
    cancellingId.value = event.id;
    return;
  }
  try {
    const result = await props.cancelEvent(event.id);
    const deleted = result.budget_lines_deleted.length;
    closeSuccess.value = `Previsión cancelada: ${deleted} partida${deleted === 1 ? '' : 's'} futura${deleted === 1 ? '' : 's'} eliminada${deleted === 1 ? '' : 's'}. Tu realidad de hoy no cambia.`;
    successId.value = event.id;
  } catch (error) {
    closeError.value = toApiErrorMessage(error);
  } finally {
    cancellingId.value = null;
  }
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
    successId.value = event.id;
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
  materializingId.value = null;
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
    const eventId = closingEvent.value.id;
    const result = await props.closeEvent(eventId, {
      effective_date: effectiveDate.value,
      note: note.value.trim() || undefined,
    });
    const changed = result.budget_changes.changed.length;
    const deleted = result.budget_changes.deleted.length;
    closeSuccess.value = `${changed} partida${changed === 1 ? '' : 's'} ajustada${changed === 1 ? '' : 's'} y ${deleted} retirada${deleted === 1 ? '' : 's'}.`;
    successId.value = eventId;
    closingId.value = null;
  } catch (error) {
    closeError.value = toApiErrorMessage(error);
  }
}

// El mensaje de éxito se ancla a su fila; si la fila ya no existe (p. ej. una
// previsión cancelada desaparece de la lista), cae al bloque superior.
const successRowVisible = computed(
  () => successId.value != null && props.events.some((event) => event.id === successId.value),
);

function shortDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-ES');
}
</script>

<template>
  <section class="sect plan-events">
    <div class="sect-head">
      <div>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 class="sect-title">{{ title }}</h2>
      </div>
    </div>

    <AState v-if="!events.length" status="empty" layout="inline" class="plan-empty-inline">
      <p class="plan-muted">{{ emptyCopy }}</p>
      <RouterLink v-if="emptyAction" class="btn btn-ghost btn-sm" to="/plan/decisiones/nueva">
        Crear previsión
      </RouterLink>
    </AState>
    <!-- Fallback: éxito de una fila que ya no existe (p. ej. previsión cancelada). -->
    <AState v-if="closeSuccess && !successRowVisible" status="success" layout="inline">
      <div class="plan-event-close-result">
        <span>{{ closeSuccess }}</span>
        <RouterLink class="btn btn-ghost btn-sm" to="/presupuesto">Ver presupuesto</RouterLink>
      </div>
    </AState>
    <!-- La lista queda limpia; el detalle y las operaciones viven en un diálogo contextual. -->
    <ol class="plan-event-list">
      <li v-for="event in events" :key="event.id">
        <span class="plan-event-date mono">{{ formatShortMonthYear(event.planned_date) }}</span>
        <button
          type="button"
          class="plan-event-summary"
          aria-haspopup="dialog"
          @click="openImpact(event)"
        >
          <span>
            <strong>{{ event.name }}</strong>
            <span>
              {{ scenarioTemplateLabel(event.event_type) }} ·
              <template v-if="event.effective_end_date">
                Cerrado el {{ shortDate(event.effective_end_date) }}
              </template>
              <template v-else>{{ planEventStatusLabel(event.status) }}</template>
            </span>
          </span>
        </button>
        <span class="plan-event-open" aria-hidden="true">Ver detalle</span>
      </li>
    </ol>

    <BaseModal
      :open="Boolean(selectedEvent)"
      :title="selectedEvent?.name"
      variant="sheet"
      panel-class="max-w-[640px] dir-a dir-a-sheet plan-event-detail-sheet"
      body-class="plan-event-detail-body"
      @close="closeImpact"
    >
      <template v-if="selectedEvent" #header="{ titleId, close }">
        <div class="plan-event-detail-heading">
          <p class="eyebrow">{{ formatShortMonthYear(selectedEvent.planned_date) }}</p>
          <h2 :id="titleId" class="ui-modal-title">{{ selectedEvent.name }}</h2>
          <p>
            {{ scenarioTemplateLabel(selectedEvent.event_type) }} ·
            <template v-if="selectedEvent.effective_end_date">
              Cerrado el {{ shortDate(selectedEvent.effective_end_date) }}
            </template>
            <template v-else>{{ planEventStatusLabel(selectedEvent.status) }}</template>
          </p>
        </div>
        <AButton size="sm" variant="ghost" @click="close">Cerrar</AButton>
      </template>

      <template v-if="selectedEvent">
        <AState
          v-if="closeSuccess && successId === selectedEvent.id"
          status="success"
          layout="inline"
        >
          <div class="plan-event-close-result">
            <span>{{ closeSuccess }}</span>
            <RouterLink class="btn btn-ghost btn-sm" to="/presupuesto">Ver presupuesto</RouterLink>
          </div>
        </AState>

        <div
          v-if="closingId === selectedEvent.id && closingEvent"
          class="plan-scenario-notice plan-event-close-confirm"
        >
          <div>
            <strong>Dar de baja «{{ closingEvent.name }}»</strong>
            <p>
              Se retirarán sus efectos recurrentes desde esa fecha y se recalculará la proyección.
              El histórico se conserva. Esto no modifica Patrimonio: da de baja allí el activo real
              si corresponde.
            </p>
          </div>
          <label>
            <span>Fecha efectiva</span>
            <input
              v-model="effectiveDate"
              class="input"
              type="date"
              :min="closingEvent.planned_date"
            />
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
        <div
          v-else-if="materializingId === selectedEvent.id && materializingEvent"
          class="plan-scenario-notice plan-event-close-confirm"
        >
          <div>
            <strong>«{{ materializingEvent.name }}» ya ha ocurrido</strong>
            <p>
              Se creará en Patrimonio el activo y el pasivo reales, precargados con lo que
              simulaste, y será el pasivo quien genere sus cuotas a partir de ahora. La previsión de
              financiación se retira para no duplicarla; el resto de partidas vuelven a ser tuyas en
              Presupuesto.
            </p>
          </div>
          <label>
            <span>Fecha real</span>
            <input v-model="actualDate" class="input" type="date" />
          </label>
          <label>
            <span>Nota opcional</span>
            <textarea v-model="note" class="textarea" rows="2" maxlength="500" />
          </label>
          <AState v-if="closeError" status="error" layout="inline">{{ closeError }}</AState>
          <div class="plan-scenario-notice-actions">
            <AButton variant="primary" size="sm" :loading="saving" @click="confirmMaterialize">
              Confirmar
            </AButton>
            <AButton variant="ghost" size="sm" :disabled="saving" @click="materializingId = null">
              Cancelar
            </AButton>
          </div>
        </div>
        <!-- Una previsión se hace realidad o se cancela; lo ya ocurrido se da de baja. -->
        <template v-if="closingId !== selectedEvent.id && materializingId !== selectedEvent.id">
          <div v-if="isForecast(selectedEvent)" class="plan-event-actions">
            <RouterLink
              v-if="isEditable(selectedEvent)"
              class="btn btn-ghost btn-sm"
              :to="`/plan/decisiones/eventos/${selectedEvent.id}/editar`"
            >
              Editar
            </RouterLink>
            <AButton
              v-if="materializeEvent"
              variant="ghost"
              size="sm"
              @click="beginMaterialize(selectedEvent)"
            >
              Ya ha ocurrido
            </AButton>
            <AButton
              v-if="cancelEvent"
              variant="ghost"
              size="sm"
              :loading="saving && cancellingId === selectedEvent.id"
              @click="cancel(selectedEvent)"
            >
              {{
                cancellingId === selectedEvent.id ? 'Confirmar cancelación' : 'Cancelar previsión'
              }}
            </AButton>
          </div>
          <div v-else class="plan-event-actions">
            <AButton
              v-if="isRegistered(selectedEvent) && releaseEvent"
              variant="ghost"
              size="sm"
              :loading="saving && releasingId === selectedEvent.id"
              @click="release(selectedEvent)"
            >
              {{ releasingId === selectedEvent.id ? 'Confirmar deshacer' : 'Deshacer registro' }}
            </AButton>
            <AButton
              v-if="!selectedEvent.effective_end_date && closeEvent"
              variant="ghost"
              size="sm"
              @click="beginClose(selectedEvent)"
            >
              Dar de baja
            </AButton>
          </div>
        </template>
        <PlanEventImpact :key="selectedEvent.id" :event-id="selectedEvent.id" />
      </template>
    </BaseModal>
  </section>
</template>
