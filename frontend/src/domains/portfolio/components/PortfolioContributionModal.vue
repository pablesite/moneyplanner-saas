<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { formatMoney, formatPct, normalizeNumberInput } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import { portfolioAssetClassLabels } from '../presentation';
import type { ContributionSolve, PortfolioOperationOptions } from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
  ownershipId: number | null;
  ownershipLabel: string;
  currency: string;
  suggested: string;
  planned: string;
  contributed: string;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();

const amount = ref('');
const sourceAccountId = ref('');
const solved = ref<ContributionSolve | null>(null);
const solving = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const sourceOptions = computed(() => [
  { value: '', label: 'Sin declarar todavía' },
  ...(props.options?.funding_accounts ?? []).map((row) => ({
    value: String(row.id),
    label: `${row.name} · ${formatMoney(row.balance, row.currency === 'USD' ? 'USD' : 'EUR')}`,
  })),
]);
const placed = computed(() =>
  (solved.value?.lines ?? []).reduce((sum, row) => sum + Number(row.amount), 0),
);
// Lo que se aparca esperando un mínimo de entrada no aparecía en ningún total, así que
// la suma de la caja no llegaba al importe repartido y parecía que faltaba dinero.
const parked = computed(() =>
  (solved.value?.accumulate ?? []).reduce((sum, row) => sum + Number(row.amount), 0),
);

function money(value: string | number): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}
function className(key: string): string {
  return portfolioAssetClassLabels[key] ?? key;
}

function positionName(id: number): string {
  return (props.options?.positions ?? []).find((row) => row.id === id)?.name ?? `#${id}`;
}

// Lo que el reparto aparta tiene que decir por qué, y sobre todo qué hacer: la más
// frecuente —no llega al mínimo y no hay dónde esperar— se arregla enlazando el efectivo
// del contenedor, y eso no se adivina.
function skippedText(row: {
  position_id: number;
  reason: string;
  amount?: string;
  minimum?: string;
  container?: string;
  operation_cost?: string;
}): string {
  const name = positionName(row.position_id);
  if (row.reason === 'below_minimum_no_cash') {
    return `${name}: le tocaban ${money(row.amount ?? '0')} pero su mínimo de entrada es ${money(
      row.minimum ?? '0',
    )}, y ${row.container ?? 'su contenedor'} no tiene efectivo enlazado donde esperar. Ese dinero va a las demás; enlaza su cuenta de liquidez para que se acumule ahí.`;
  }
  if (row.reason === 'cost_exceeds_ticket') {
    return `${name}: la comisión de ${money(row.operation_cost ?? '0')} se comería la operación.`;
  }
  if (row.reason === 'excluded') return `${name}: excluida del reparto por tu regla.`;
  if (row.reason === 'no_target') return `${name}: sin objetivo en la política, no recibe nada.`;
  return `${name}: ${row.reason}`;
}

async function solve() {
  if (!props.ownershipId || !amount.value) return;
  solving.value = true;
  error.value = null;
  solved.value = null;
  try {
    solved.value = (
      await corePortfolioApi.solveContribution(
        props.ownershipId,
        normalizeNumberInput(amount.value),
      )
    ).data;
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    solving.value = false;
  }
}

async function keep() {
  if (!props.ownershipId || !amount.value) return;
  saving.value = true;
  error.value = null;
  try {
    // Guardar no ejecuta nada: crea una cesta pendiente que se revisa y se confirma
    // aparte. Una propuesta que se ejecuta sola no se puede revisar.
    await corePortfolioApi.createBasket(
      props.ownershipId,
      normalizeNumberInput(amount.value),
      sourceAccountId.value ? Number(sourceAccountId.value) : undefined,
    );
    emit('saved', 'Cesta guardada. Nada se ha contabilizado todavía.');
    emit('close');
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    // Se abre con lo que el presupuesto tenía previsto invertir: es el importe que ya
    // habías decidido, y sigue siendo editable.
    amount.value = Number(props.suggested) > 0 ? props.suggested : '';
    sourceAccountId.value = '';
    solved.value = null;
    error.value = null;
  },
);
</script>

<template>
  <BaseModal
    :open="open"
    :title="`Aportación · ${ownershipLabel}`"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <div class="a-pf-contribution-flow a-pf-item-form">
      <p>
        Cuánto vas a aportar, y a dónde debería ir según tu política. Se reparte hacia lo que va
        corto en vez de a partes iguales, y nunca propone vender.
      </p>

      <div class="ui-item-form-grid">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Importe</span>
          <input v-model="amount" class="input" inputmode="decimal" placeholder="0,00" />
          <!-- Sugerir el mes entero cuando ya has aportado la mitad propone aportar dos
               veces lo planeado. Y una recolocación no es dinero nuevo: lo que cuenta es
               lo aportado menos lo desinvertido. -->
          <small v-if="Number(planned) > 0" class="a-pf-contribution-hint">
            El presupuesto preveía {{ money(planned) }} este mes y llevas
            {{ money(contributed) }} aportados, ya descontadas las desinversiones.
            <template v-if="Number(suggested) > 0"> Quedan {{ money(suggested) }}. </template>
            <template v-else> El mes ya está cubierto. </template>
          </small>
        </label>
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">
            Sale de
            <AInfoHint
              label="La cuenta desde la que se pagará al confirmar. Se puede dejar sin declarar para simular; hará falta antes de contabilizar nada."
            />
          </span>
          <ASelect
            v-model="sourceAccountId"
            :options="sourceOptions"
            :searchable="false"
            class="select"
          />
        </label>
      </div>

      <AButton variant="ghost" :loading="solving" :disabled="!amount" @click="solve">
        Calcular reparto
      </AButton>

      <AState v-if="solved?.status === 'no_strategy'" status="empty" layout="inline">
        Este ámbito no tiene política escrita, así que no hay contra qué repartir.
      </AState>
      <AState v-else-if="solved?.status === 'incomplete_strategy'" status="error" layout="inline">
        La política suma {{ solved.declared_percent }}% en vez de 100. Con una política a medias el
        reparto se calcularía sobre una cartera que no es la tuya.
      </AState>

      <template v-else-if="solved?.status === 'ok'">
        <div v-if="solved.commitments?.length" class="a-pf-contribution-note">
          <strong>Compromisos primero</strong>
          <span v-for="row in solved.commitments" :key="row.position_id">
            {{ positionName(row.position_id) }}: {{ money(row.amount) }} ·
            {{ row.reason || 'compromiso' }}
            <!-- Con lo ya aportado delante: 150 sobre un mínimo de 300 no es un
                 incumplimiento si los otros 150 ya estaban dentro este mes. -->
            <template v-if="row.target && Number(row.contributed) > 0">
              (llevas {{ money(row.contributed ?? '0') }} de {{ money(row.target) }}
              {{ row.period === 'year' ? 'este año' : 'este mes' }})
            </template>
          </span>
        </div>

        <!-- Lo que se aparta se explica: una posición que desaparece de la propuesta sin
             motivo parece un fallo del reparto. -->
        <div v-if="solved.skipped?.length" class="a-pf-contribution-note">
          <strong>Fuera del reparto</strong>
          <span v-for="row in solved.skipped" :key="row.position_id">{{ skippedText(row) }}</span>
        </div>

        <!-- Un compromiso sin cubrir no es una línea que falta: es una ventaja que se
             pierde, y suele costar más que la propia aportación. -->
        <div v-if="solved.unmet_commitments?.length" class="a-pf-contribution-note is-warning">
          <strong>Compromisos sin cubrir</strong>
          <span v-for="row in solved.unmet_commitments" :key="row.position_id">
            Faltan {{ money(row.amount) }}{{ row.reason ? ` · ${row.reason}` : '' }}
            <template v-if="Number(row.breach_cost) > 0">
              — no cumplirlo cuesta {{ money(row.breach_cost) }} al año
            </template>
          </span>
        </div>

        <!-- Una clase que no se puede cumplir se dice, no se omite: su parte se la
             acaban repartiendo las demás y sin esto parecía que el reparto ignora la
             política sin motivo. -->
        <div v-if="solved.unreachable?.length" class="a-pf-contribution-note">
          <strong>Sin dónde colocarlo</strong>
          <span v-for="row in solved.unreachable" :key="row.asset_class">
            {{ className(row.asset_class) }} pide un
            {{ formatPct(Number(row.target_percent) / 100, 1) }} y no tienes ningún producto de esa
            clase. Ese dinero va a las demás.
          </span>
        </div>

        <ul class="a-pf-contribution-lines">
          <li v-for="row in solved.lines" :key="row.position_id">
            <span>
              {{ row.name }}
              <small>{{ className(row.asset_class) }}</small>
            </span>
            <strong class="mono">{{ money(row.amount) }}</strong>
          </li>
          <li v-for="row in solved.accumulate ?? []" :key="`cash-${row.cash_account_id}`">
            <span>
              Efectivo · {{ row.container }}
              <small>Acumulando hasta alcanzar su mínimo de entrada</small>
            </span>
            <strong class="mono">{{ money(row.amount) }}</strong>
          </li>
        </ul>

        <dl class="a-pf-contribution-total">
          <div>
            <dt>A invertir</dt>
            <dd class="mono">{{ money(placed) }}</dd>
          </div>
          <div v-if="parked > 0">
            <dt>
              A acumular
              <AInfoHint
                label="Se transfiere al efectivo de esa plataforma y espera ahí hasta que alcance su mínimo de entrada. Es dinero aportado, todavía sin colocar en la posición."
              />
            </dt>
            <dd class="mono">{{ money(parked) }}</dd>
          </div>
          <div>
            <dt>
              Liquidez táctica
              <AInfoHint
                label="La parte que tu política reserva a liquidez. No se contabiliza nada por ella: se queda donde está."
              />
            </dt>
            <dd class="mono">{{ money(solved.reserved_cash ?? '0') }}</dd>
          </div>
          <div v-if="Number(solved.leftover ?? 0) > 0">
            <dt>
              Sin colocar
              <AInfoHint
                label="No cabía en ningún destino: por un mínimo de entrada que no se alcanza, por un redondeo, o porque la comisión se comería la operación."
              />
            </dt>
            <dd class="mono">{{ money(solved.leftover ?? '0') }}</dd>
          </div>
        </dl>
      </template>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </div>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cerrar</AButton>
        <AButton
          variant="primary"
          :loading="saving"
          :disabled="solved?.status !== 'ok'"
          @click="keep"
        >
          Guardar como cesta
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
