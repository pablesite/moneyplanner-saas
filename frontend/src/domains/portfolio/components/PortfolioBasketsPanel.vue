<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState } from '@/domains/ui';
import { formatMoney } from '@/lib/format';
import { formatShortDate } from '@/lib/dates';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type { ContributionBasket, PortfolioOperationOptions } from '../types';

const props = defineProps<{
  ownershipId: number | null;
  options: PortfolioOperationOptions | null;
  currency: string;
}>();
const emit = defineEmits<{ saved: [message: string] }>();

const baskets = ref<ContributionBasket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
// Qué líneas se van a contabilizar de cada cesta. Vacío significa "todas": confirmar una
// cesta entera es el caso normal y no debería exigir marcar nada.
const picked = ref(new Map<number, Set<number>>());
const sources = ref(new Map<number, string>());
const armed = ref<number | null>(null);
const busy = ref<number | null>(null);
const showHistory = ref(false);

const sourceOptions = computed(() => [
  { value: '', label: 'Elige la cuenta…' },
  // Con el saldo, porque hay cuentas que se llaman igual y porque la pregunta real al
  // elegir es si ahí queda dinero para pagar esto.
  ...(props.options?.funding_accounts ?? []).map((row) => ({
    value: String(row.id),
    label: `${row.name} · ${formatMoney(row.balance, row.currency === 'USD' ? 'USD' : 'EUR')}`,
  })),
]);

function money(value: string | number): string {
  return formatMoney(value, props.currency === 'USD' ? 'USD' : 'EUR');
}

// El motivo se guarda como código; "policy" es el caso normal y no dice nada que la
// línea no diga ya.
const reasonLabels: Record<string, string> = {
  policy: '',
  below_minimum: 'Acumula en la plataforma hasta llegar a su mínimo de entrada',
};

function lineReason(reason: string): string {
  return reasonLabels[reason] ?? reason;
}

function pendingLines(basket: ContributionBasket) {
  return basket.lines.filter((line) => line.status === 'pending');
}

function selection(basket: ContributionBasket): Set<number> {
  return picked.value.get(basket.id) ?? new Set<number>();
}

function isPicked(basket: ContributionBasket, lineId: number): boolean {
  const chosen = selection(basket);
  return chosen.size === 0 || chosen.has(lineId);
}

function toggleLine(basket: ContributionBasket, lineId: number) {
  const pending = pendingLines(basket).map((line) => line.id);
  const chosen = selection(basket);
  // El estado vacío es "todas", así que la primera desmarca parte de un conjunto lleno.
  const next = new Set(chosen.size === 0 ? pending : chosen);
  if (next.has(lineId)) next.delete(lineId);
  else next.add(lineId);
  picked.value = new Map(picked.value).set(
    basket.id,
    next.size === pending.length ? new Set<number>() : next,
  );
  armed.value = null;
}

function chosenLines(basket: ContributionBasket): number[] {
  const pending = pendingLines(basket).map((line) => line.id);
  const chosen = selection(basket);
  return chosen.size === 0 ? pending : pending.filter((id) => chosen.has(id));
}

function chosenAmount(basket: ContributionBasket): number {
  const chosen = new Set(chosenLines(basket));
  return pendingLines(basket)
    .filter((line) => chosen.has(line.id))
    .reduce((sum, line) => sum + Number(line.amount), 0);
}

function sourceFor(basket: ContributionBasket): string {
  return (
    sources.value.get(basket.id) ??
    (basket.source_account_id ? String(basket.source_account_id) : '')
  );
}

function setSource(basket: ContributionBasket, value: string | number | null) {
  sources.value = new Map(sources.value).set(basket.id, value === null ? '' : String(value));
  armed.value = null;
}

async function load() {
  if (!props.ownershipId) {
    baskets.value = [];
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    baskets.value = (
      await corePortfolioApi.getBaskets({
        ownership_id: props.ownershipId,
        ...(showHistory.value ? {} : { status: 'draft' }),
      })
    ).data;
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
    baskets.value = [];
  } finally {
    loading.value = false;
  }
}

async function confirm(basket: ContributionBasket) {
  const lines = chosenLines(basket);
  const source = sourceFor(basket);
  if (!lines.length || !source) return;
  busy.value = basket.id;
  error.value = null;
  try {
    const all = lines.length === pendingLines(basket).length;
    await corePortfolioApi.confirmBasket(basket.id, all ? undefined : lines, Number(source));
    armed.value = null;
    picked.value = new Map(picked.value);
    picked.value.delete(basket.id);
    emit(
      'saved',
      all
        ? `Cesta contabilizada: ${money(chosenAmount(basket))}.`
        : `${lines.length} ${lines.length === 1 ? 'línea contabilizada' : 'líneas contabilizadas'}.`,
    );
    await load();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = null;
  }
}

async function discard(basket: ContributionBasket) {
  busy.value = basket.id;
  error.value = null;
  try {
    await corePortfolioApi.discardBasket(basket.id);
    emit('saved', 'Cesta descartada. La propuesta se conserva.');
    await load();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    busy.value = null;
  }
}

const statusLabels: Record<ContributionBasket['status'], string> = {
  draft: 'Pendiente',
  confirmed: 'Contabilizada',
  discarded: 'Descartada',
};

defineExpose({ reload: load });

watch([() => props.ownershipId, showHistory], load, { immediate: true });
</script>

<template>
  <div class="a-pf-baskets">
    <div class="a-pf-baskets-head">
      <h3>
        Cestas
        <AInfoHint
          label="Un reparto guardado que todavía no ha tocado la contabilidad. Se revisa, y al confirmarlo se crean los movimientos reales: las compras desde la cuenta que elijas y los traspasos al efectivo de cada plataforma."
        />
      </h3>
      <AButton variant="ghost" size="sm" @click="showHistory = !showHistory">
        {{ showHistory ? 'Solo pendientes' : 'Ver historial' }}
      </AButton>
    </div>

    <AState v-if="loading" status="loading" layout="inline">Cargando cestas…</AState>
    <AState v-else-if="error" status="error" layout="inline">{{ error }}</AState>
    <AState v-else-if="!baskets.length" status="empty" layout="inline">
      {{
        showHistory
          ? 'Este ámbito todavía no tiene ninguna cesta.'
          : 'No hay cestas pendientes. Calcula una aportación y guárdala para revisarla aquí.'
      }}
    </AState>

    <article v-for="basket in baskets" v-else :key="basket.id" class="a-pf-basket">
      <header>
        <div>
          <strong class="mono">{{ money(basket.amount) }}</strong>
          <small>{{ formatShortDate(basket.booking_date) }}</small>
        </div>
        <span class="a-pf-basket-state" :class="`is-${basket.status}`">
          {{ statusLabels[basket.status] }}
        </span>
      </header>

      <ul class="a-pf-basket-lines">
        <li
          v-for="line in basket.lines"
          :key="line.id"
          :class="{ 'is-done': line.status !== 'pending' }"
        >
          <label v-if="basket.status === 'draft' && line.status === 'pending'">
            <input
              type="checkbox"
              :checked="isPicked(basket, line.id)"
              :aria-label="`Contabilizar ${line.name}`"
              @change="toggleLine(basket, line.id)"
            />
            <span>
              {{ line.name }}
              <small v-if="lineReason(line.reason)">{{ lineReason(line.reason) }}</small>
            </span>
          </label>
          <span v-else>
            {{ line.name }}
            <small>{{ line.status === 'confirmed' ? 'Contabilizada' : 'No ejecutada' }}</small>
          </span>
          <strong class="mono">{{ money(line.amount) }}</strong>
        </li>
      </ul>

      <!-- Lo que no aparece como línea también forma parte del reparto: la liquidez que
           se queda quieta no genera ningún movimiento, y por eso no se confirma. -->
      <p v-if="Number(basket.reserved_cash) > 0" class="a-pf-basket-note">
        {{ money(basket.reserved_cash) }} se quedan como liquidez, sin movimiento.
      </p>
      <p v-if="Number(basket.leftover) > 0" class="a-pf-basket-note">
        {{ money(basket.leftover) }} sin colocar: no cabían en ningún destino.
      </p>

      <div v-if="basket.status === 'draft'" class="a-pf-basket-actions">
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">Sale de</span>
          <ASelect
            :model-value="sourceFor(basket)"
            :options="sourceOptions"
            :searchable="false"
            class="select"
            @update:model-value="(value) => setSource(basket, value)"
          />
        </label>
        <div class="a-pf-basket-buttons">
          <AButton
            variant="ghost"
            size="sm"
            :disabled="busy === basket.id"
            @click="discard(basket)"
          >
            Descartar
          </AButton>
          <AButton
            v-if="armed !== basket.id"
            variant="primary"
            size="sm"
            :disabled="!sourceFor(basket) || !chosenLines(basket).length"
            @click="armed = basket.id"
          >
            Contabilizar {{ money(chosenAmount(basket)) }}
          </AButton>
          <AButton
            v-else
            variant="primary"
            size="sm"
            :loading="busy === basket.id"
            @click="confirm(basket)"
          >
            Sí, crear los movimientos
          </AButton>
        </div>
        <!-- Confirmar escribe en la contabilidad y no se deshace desde aquí: el segundo
             clic existe para que no ocurra por un roce. -->
        <p v-if="armed === basket.id" class="a-pf-basket-note">
          Se crearán movimientos reales por {{ money(chosenAmount(basket)) }}.
        </p>
        <p v-else-if="!sourceFor(basket)" class="a-pf-basket-note">
          Falta decir de qué cuenta sale el dinero.
        </p>
      </div>
    </article>
  </div>
</template>
