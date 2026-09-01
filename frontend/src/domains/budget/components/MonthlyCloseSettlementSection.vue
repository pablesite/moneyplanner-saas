<script setup lang="ts">
import { computed } from 'vue';
import { ASectHead, AButton, AInfoHint, AState, AMetaPill } from '@/domains/ui';
import type { SettlementPage } from '../settlementPresentation';

const props = defineProps<{
  page: SettlementPage;
  busy?: boolean;
  locked?: boolean;
  formatMoney: (value: number, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();

const operatingDestination = computed(() =>
  props.page.destinations.find((destination) => destination.role === 'operating'),
);
const operatingReserveGroups = computed(() =>
  props.page.reserveOwnershipGroups.filter(
    (group) => group.destinationName === operatingDestination.value?.name,
  ),
);

const emit = defineEmits<{
  configure: [];
  transfer: [recommendation: SettlementPage['recommendations'][number]];
  manage: [recommendation: SettlementPage['recommendations'][number]];
  applyAll: [];
  movement: [transactionId: number];
}>();

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function blockerTransactionId(blocker: SettlementPage['blockers'][number]): number | null {
  const transactionId = Number(blocker.transaction_id);
  return Number.isInteger(transactionId) && transactionId > 0 ? transactionId : null;
}

function openBlockerMovement(blocker: SettlementPage['blockers'][number]): void {
  const transactionId = blockerTransactionId(blocker);
  if (transactionId !== null) emit('movement', transactionId);
}
</script>

<template>
  <section v-if="page.isVisible" class="mc-settlement">
    <ASectHead
      eyebrow="Distribución del saldo"
      title="Prepara las transferencias"
      subtitle="La reserva compartida se conserva primero; el resto vuelve a las cuentas personales."
    >
      <template #hint>
        <AInfoHint label="Cómo se calcula">
          Las transferencias solo cambian dónde está el dinero. No crean ingresos ni gastos y no se
          guardan hasta que confirmes el movimiento en Contabilidad.
        </AInfoHint>
      </template>
      <template #actions>
        <AMetaPill v-if="page.isFrozen">Cálculo congelado</AMetaPill>
        <AMetaPill v-else-if="page.isReady">Cálculo provisional</AMetaPill>
        <AButton variant="ghost" size="sm" @click="emit('configure')">Configurar</AButton>
      </template>
    </ASectHead>

    <div v-if="page.isReady" class="mc-settlement-body">
      <section class="mc-settlement-routes">
        <div class="mc-settlement-subhead">
          <div>
            <p class="eyebrow">Transferencias</p>
            <h3>Rutas recomendadas</h3>
          </div>
          <div class="mc-settlement-route-actions">
            <span>{{ page.recommendations.length }} movimientos</span>
            <AButton
              v-if="page.canApply"
              variant="primary"
              size="sm"
              :loading="busy"
              :disabled="locked"
              @click="emit('applyAll')"
            >
              Registrar todas
            </AButton>
          </div>
        </div>
        <AState v-if="!page.recommendations.length" status="success" layout="inline">
          El dinero ya está en sus cuentas objetivo. No hace falta transferir nada.
        </AState>
        <article
          v-for="recommendation in page.recommendations"
          :key="`${recommendation.from_account_id}-${recommendation.to_account_id}-${recommendation.member_id}`"
          class="mc-settlement-route"
        >
          <div class="mc-settlement-route-path">
            <small>{{ recommendation.reasonLabel }} · {{ recommendation.statusLabel }}</small>
            <strong>{{ recommendation.sourceName }} → {{ recommendation.destinationName }}</strong>
            <span v-if="recommendation.memberName">Para {{ recommendation.memberName }}</span>
            <AButton
              v-for="movement in recommendation.transactions"
              :key="movement.id"
              variant="ghost"
              size="sm"
              @click="emit('movement', movement.id)"
            >
              Movimiento #{{ movement.id }} · {{ movement.action }}
            </AButton>
          </div>
          <div class="mc-settlement-route-totals">
            <strong class="mc-settlement-route-amount">
              {{ formatMoney(recommendation.amountNumber) }} {{ recommendation.currency }}
            </strong>
            <small v-if="recommendation.appliedAmountNumber > 0">
              {{ formatMoney(recommendation.remainingAmountNumber) }} pendientes
            </small>
          </div>
          <AButton
            v-if="page.isFinalized"
            size="sm"
            variant="ghost"
            :disabled="busy || locked"
            @click="emit('manage', recommendation)"
          >
            Gestionar
          </AButton>
          <AButton
            v-else
            size="sm"
            :disabled="
              recommendation.sourceAssetId == null || recommendation.destinationAssetId == null
            "
            @click="emit('transfer', recommendation)"
          >
            Preparar transferencia
          </AButton>
        </article>
        <AState v-if="page.hasSettlementHistory" status="success" layout="inline">
          El cierre conserva el histórico de liquidación y ya no puede reabrirse. Un reverso crea un
          movimiento nuevo; nunca elimina el original.
        </AState>
      </section>

      <section v-if="operatingDestination" class="mc-settlement-fund">
        <div>
          <p class="eyebrow">Después de transferir</p>
          <h3>{{ operatingDestination.name }}</h3>
          <small>Reserva compartida neta de tarjetas para el próximo mes.</small>
        </div>
        <strong>{{ formatMoney(operatingDestination.target) }} {{ page.currency }}</strong>
      </section>

      <div class="mc-settlement-details">
        <details v-if="operatingReserveGroups.length">
          <summary>Qué compone la reserva compartida</summary>
          <div class="mc-settlement-reserve-groups">
            <article v-for="group in operatingReserveGroups" :key="group.key">
              <div>
                <strong>{{ group.ownershipLabel }}</strong>
                <small>{{ group.destinationName }}</small>
              </div>
              <strong>{{ formatMoney(group.totalNumber) }} {{ page.currency }}</strong>
              <p>
                <span v-if="group.reserveNumber > 0">
                  Gastos {{ formatMoney(group.reserveNumber) }}
                </span>
                <span v-if="group.reserveNumber > 0 && group.allocationNumber > 0"> · </span>
                <span v-if="group.allocationNumber > 0">
                  Inversión {{ formatMoney(group.allocationNumber) }}
                </span>
              </p>
              <p v-if="group.memberAmounts.length">
                <span v-for="(member, index) in group.memberAmounts" :key="member.memberId">
                  <span v-if="index > 0"> · </span>{{ member.name }}
                  {{ formatMoney(member.value) }}
                </span>
              </p>
            </article>
          </div>
        </details>

        <details>
          <summary>Cómo se reparte entre vosotros</summary>
          <div class="mc-settlement-member-list">
            <article v-for="member in page.members" :key="member.member_id">
              <div class="mc-settlement-member-head">
                <strong>{{ member.name }}</strong>
                <span>{{ formatMoney(member.closingNumber) }} {{ page.currency }}</span>
              </div>
              <dl>
                <div>
                  <dt>Apertura</dt>
                  <dd>{{ formatMoney(member.openingNumber) }}</dd>
                </div>
                <div>
                  <dt>Ingresos</dt>
                  <dd>+{{ formatMoney(member.incomeNumber) }}</dd>
                </div>
                <div>
                  <dt>Gastos</dt>
                  <dd>−{{ formatMoney(member.expenseNumber) }}</dd>
                </div>
                <div>
                  <dt>Compensación</dt>
                  <dd>{{ formatSignedMoney(member.compensationNumber) }}</dd>
                </div>
                <div>
                  <dt>Requisitos</dt>
                  <dd>{{ formatMoney(member.requirementNumber) }}</dd>
                </div>
                <div>
                  <dt>Excedente</dt>
                  <dd>{{ formatSignedMoney(member.excessNumber) }}</dd>
                </div>
              </dl>
            </article>
          </div>
        </details>

        <details v-if="page.compensations.length">
          <summary>Ajustes de movimientos del mes</summary>
          <div class="mc-settlement-compensations">
            <article v-for="compensation in page.compensations" :key="compensation.transaction_id">
              <div>
                <strong>{{ compensation.description }}</strong>
                <small
                  >{{ formatDate(compensation.booking_date) }} · Movimiento #{{
                    compensation.transaction_id
                  }}</small
                >
              </div>
              <span v-for="member in compensation.members" :key="member.member_id">
                {{ member.name }} {{ formatSignedMoney(member.amountNumber) }} {{ page.currency }}
              </span>
            </article>
          </div>
        </details>

        <details v-if="page.allocations.length">
          <summary>Criterio de titularidad</summary>
          <div class="mc-settlement-evidence">
            <article v-for="allocation in page.allocations" :key="allocation.ownership_id">
              <div>
                <strong>{{ allocation.label }}</strong>
                <small>{{ allocation.basisLabel }}</small>
              </div>
              <p v-if="allocation.allocation_basis === 'recurring_income_12m'">
                {{ formatDate(allocation.window_start) }} –
                {{ formatDate(allocation.window_end) }} ·
                {{ formatMoney(allocation.totalIncomeNumber) }} {{ allocation.base_currency }} ·
                {{ allocation.eligible_transaction_count ?? 0 }} ingresos ponderables
              </p>
              <p v-else>Porcentaje pactado, independiente de los ingresos del periodo.</p>
            </article>
          </div>
        </details>
      </div>
    </div>

    <AState v-else status="error" layout="panel">
      <strong>La liquidación no puede calcularse con precisión todavía.</strong>
      <ul class="mc-settlement-blockers">
        <li v-for="blocker in page.blockers" :key="blocker.key">
          <span>{{ blocker.message }}</span>
          <AButton
            v-if="blockerTransactionId(blocker) !== null"
            variant="ghost"
            size="sm"
            @click="openBlockerMovement(blocker)"
          >
            Abrir movimiento
          </AButton>
        </li>
      </ul>
      <AButton @click="emit('configure')">Revisar configuración</AButton>
    </AState>
  </section>
</template>
