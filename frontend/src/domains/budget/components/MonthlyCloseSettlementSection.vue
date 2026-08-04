<script setup lang="ts">
import { ASectHead, AButton, AInfoHint, AState, AMetaPill } from '@/domains/ui';
import type { SettlementPage } from '../settlementPresentation';

defineProps<{
  page: SettlementPage;
  formatMoney: (value: number, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();

const emit = defineEmits<{
  configure: [];
  transfer: [recommendation: SettlementPage['recommendations'][number]];
}>();

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}
</script>

<template>
  <section v-if="page.isVisible" class="mc-settlement">
    <ASectHead
      eyebrow="Distribución del saldo"
      title="Qué se queda y qué se transfiere"
      subtitle="Core atribuye cada euro por titularidad y conserva primero las obligaciones del próximo mes."
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
      <div class="mc-settlement-summary">
        <article>
          <span>Saldo económico</span>
          <strong>{{ formatMoney(page.summary.distributable) }} {{ page.currency }}</strong>
          <small>Disponible entre todos los miembros</small>
        </article>
        <article>
          <span>Reservado o asignado</span>
          <strong>{{ formatMoney(page.summary.retainedOrAllocated) }} {{ page.currency }}</strong>
          <small>Obligaciones recurrentes del próximo mes</small>
        </article>
        <article>
          <span>Hacia cuentas personales</span>
          <strong>{{ formatMoney(page.summary.towardPersonal) }} {{ page.currency }}</strong>
          <small>Transferencias recomendadas, todavía sin registrar</small>
        </article>
      </div>

      <div class="mc-settlement-destinations">
        <div class="mc-settlement-table-head" aria-hidden="true">
          <span>Destino</span>
          <span>Saldo actual</span>
          <span>Saldo objetivo</span>
          <span>Movimiento</span>
        </div>
        <article
          v-for="destination in page.destinations"
          :key="destination.id"
          class="mc-settlement-destination"
        >
          <div class="mc-settlement-destination-main">
            <AMetaPill>{{ destination.roleLabel }}</AMetaPill>
            <strong>{{ destination.name }}</strong>
            <small>{{ destination.ownership }}</small>
            <small v-if="destination.reasons.length">{{ destination.reasons.join(' · ') }}</small>
          </div>
          <div data-label="Saldo actual">
            <strong>{{ formatMoney(destination.observed) }} {{ page.currency }}</strong>
          </div>
          <div data-label="Saldo objetivo">
            <strong>{{ formatMoney(destination.target) }} {{ page.currency }}</strong>
          </div>
          <div data-label="Movimiento">
            <strong :class="destination.movement < 0 ? 'mc-settlement-out' : 'mc-settlement-in'">
              {{ formatSignedMoney(destination.movement) }} {{ page.currency }}
            </strong>
          </div>
        </article>
      </div>

      <section class="mc-settlement-routes">
        <div class="mc-settlement-subhead">
          <div>
            <p class="eyebrow">Transferencias</p>
            <h3>Rutas recomendadas</h3>
          </div>
          <span>{{ page.recommendations.length }} movimientos</span>
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
            <small>{{ recommendation.reasonLabel }}</small>
            <strong>{{ recommendation.sourceName }} → {{ recommendation.destinationName }}</strong>
            <span v-if="recommendation.memberName">Para {{ recommendation.memberName }}</span>
          </div>
          <strong class="mc-settlement-route-amount">
            {{ formatMoney(recommendation.amountNumber) }} {{ recommendation.currency }}
          </strong>
          <AButton
            size="sm"
            :disabled="
              recommendation.sourceAssetId == null || recommendation.destinationAssetId == null
            "
            @click="emit('transfer', recommendation)"
          >
            Preparar transferencia
          </AButton>
        </article>
      </section>

      <div class="mc-settlement-details">
        <details>
          <summary>Desglose por miembro</summary>
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

        <details v-if="page.allocations.length">
          <summary>Evidencia de titularidad</summary>
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

        <details v-if="page.compensations.length">
          <summary>Compensaciones por pagos cruzados</summary>
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
      </div>
    </div>

    <AState v-else status="error" layout="panel">
      <strong>La liquidación no puede calcularse con precisión todavía.</strong>
      <ul class="mc-settlement-blockers">
        <li v-for="blocker in page.blockers" :key="blocker.key">
          {{ blocker.message }}
        </li>
      </ul>
      <AButton @click="emit('configure')">Revisar configuración</AButton>
    </AState>
  </section>
</template>
