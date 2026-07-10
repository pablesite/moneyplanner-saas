<script setup lang="ts">
import type { PlanFoundations } from '@/domains/plan/types';
import { formatMoney, formatNumber, formatPct, toNumber } from '@/lib/format';

defineProps<{
  foundations: PlanFoundations | null;
}>();

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
        <strong>{{ scoreLabel(foundations.cash_flow.score) }}</strong>
        <small>Superávit {{ money(foundations.cash_flow.committed_surplus) }}</small>
      </article>
      <article>
        <span>Fondo de emergencia</span>
        <strong>{{ months(foundations.emergency_fund.coverage_months_base) }}</strong>
        <small>Objetivo {{ months(foundations.emergency_fund.target_months) }}</small>
      </article>
      <article>
        <span>Deuda</span>
        <strong>{{ scoreLabel(foundations.debt.score) }}</strong>
        <small>Deuda cara {{ money(foundations.debt.high_cost_debt) }}</small>
      </article>
      <article>
        <span>Aportación planificada</span>
        <strong>{{ money(foundations.planned_contribution.monthly_amount) }}/mes</strong>
      </article>
      <article>
        <span>Calidad de datos</span>
        <strong>{{ scoreLabel(foundations.data_quality.score) }}</strong>
        <small v-if="foundations.cash_flow.operating_surplus_ratio">
          Margen {{ formatPct(toNumber(foundations.cash_flow.operating_surplus_ratio), 1) }}
        </small>
      </article>
    </div>
    <p v-else class="plan-muted">Aún no hay cimientos calculados para este plan.</p>
  </section>
</template>
