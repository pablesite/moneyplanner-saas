<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
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

function money(value: string | number): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}
function className(key: string): string {
  return portfolioAssetClassLabels[key] ?? key;
}

async function solve() {
  if (!props.ownershipId || !amount.value) return;
  solving.value = true;
  error.value = null;
  solved.value = null;
  try {
    solved.value = (await corePortfolioApi.solveContribution(props.ownershipId, amount.value)).data;
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
      amount.value,
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
    amount.value = '';
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
            {{ money(row.amount) }} · {{ row.reason || 'compromiso' }}
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
            <dt>Invertido</dt>
            <dd class="mono">{{ money(placed) }}</dd>
          </div>
          <div>
            <dt>Liquidez táctica</dt>
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
