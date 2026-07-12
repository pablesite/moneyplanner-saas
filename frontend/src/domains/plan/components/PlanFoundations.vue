<script setup lang="ts">
import type { PlanFoundations, PlanFoundationStatus } from '@/domains/plan/types';
import { formatMoney, formatNumber, formatPct, toNumber } from '@/lib/format';

defineProps<{
  foundations: PlanFoundations | null;
}>();

// La banda la decide Core (health_status); aquí solo se traduce a color.
function tone(status: PlanFoundationStatus | undefined): string | null {
  if (status === 'good') return 'pos';
  if (status === 'warning') return 'warn';
  if (status === 'critical') return 'neg';
  return null;
}

function scoreLabel(score: number | null | undefined): string {
  if (score == null) return '-';
  return `${score}/100`;
}

function money(value: string | null | undefined): string {
  if (value == null) return '-';
  return formatMoney(toNumber(value));
}

function months(value: string | null | undefined): string {
  if (value == null) return '-';
  return `${formatNumber(toNumber(value), 1)} meses`;
}

// Un "superávit" negativo se lee como contradicción: se etiqueta como déficit.
function surplusText(value: string | null | undefined): string {
  if (value == null) return 'Superávit -';
  const amount = toNumber(value);
  return amount < 0
    ? `Déficit ${formatMoney(Math.abs(amount))}`
    : `Superávit ${formatMoney(amount)}`;
}
</script>

<template>
  <section class="sect plan-foundations">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Cimientos</p>
        <h2 class="sect-title">Diagnóstico compacto</h2>
        <p class="sect-sub">
          Flujo de caja, fondo de emergencia, deuda, aportación y calidad de datos.
        </p>
      </div>
    </div>
    <div v-if="foundations" class="plan-foundation-grid">
      <article>
        <span>Flujo de caja</span>
        <strong :class="tone(foundations.cash_flow.status)">
          {{ scoreLabel(foundations.cash_flow.score) }}
        </strong>
        <small>{{ surplusText(foundations.cash_flow.committed_surplus) }}</small>
      </article>
      <article>
        <span>Fondo de emergencia</span>
        <strong :class="tone(foundations.emergency_fund.status)">
          {{ months(foundations.emergency_fund.coverage_months_base) }}
        </strong>
        <small>Objetivo {{ months(foundations.emergency_fund.target_months) }}</small>
      </article>
      <article>
        <span>Deuda</span>
        <strong :class="tone(foundations.debt.status)">
          {{ scoreLabel(foundations.debt.score) }}
        </strong>
        <small>Deuda cara {{ money(foundations.debt.high_cost_debt) }}</small>
      </article>
      <article>
        <span>Aportación planificada</span>
        <strong>{{ money(foundations.planned_contribution.monthly_amount) }}/mes</strong>
      </article>
      <article>
        <span>Calidad de datos</span>
        <strong :class="tone(foundations.data_quality.status)">
          {{ scoreLabel(foundations.data_quality.score) }}
        </strong>
        <small v-if="foundations.cash_flow.operating_surplus_ratio">
          Margen {{ formatPct(toNumber(foundations.cash_flow.operating_surplus_ratio), 1) }}
        </small>
      </article>
    </div>
    <p v-else class="plan-muted">Aún no hay cimientos calculados para este plan.</p>
  </section>
</template>
