<script setup lang="ts">
import type { PlanFoundations, PlanFoundationStatus } from '@/domains/plan/types';
import { formatMoney, formatNumber, formatPct, toNumber } from '@/lib/format';

defineProps<{
  foundations: PlanFoundations | null;
  /** Variante de tarjeta lateral: filas etiqueta-valor en vez de bloques apilados. */
  compact?: boolean;
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

// Los campos de cash_flow vienen en anual; aquí se muestran en mensual para
// que se lean junto a "Aportación planificada" y el resto de cifras del plan.
function monthlyMoney(value: string | null | undefined): string {
  if (value == null) return '-';
  return formatMoney(toNumber(value) / 12);
}

// Score 0 en rojo sin deuda alguna se lee como contradicción: sin pasivos no hay
// nada que puntuar, así que el cimiento lo dice en palabras y sin tono crítico.
function hasDebt(debt: PlanFoundations['debt']): boolean {
  return toNumber(debt.total_debt) > 0;
}

// Un "superávit" negativo se lee como contradicción: se etiqueta como déficit.
function surplusText(value: string | null | undefined): string {
  if (value == null) return 'Superávit -';
  const amount = toNumber(value) / 12;
  return amount < 0
    ? `Déficit ${formatMoney(Math.abs(amount))}/mes`
    : `Superávit ${formatMoney(amount)}/mes`;
}

// Los factores de calidad vienen del motor (DataQualityService); aquí solo
// se traducen para que "faltan: contabilidad, pensiones" sea legible.
const QUALITY_FACTOR_LABELS: Record<string, string> = {
  assets: 'activos',
  liabilities_reviewed: 'pasivos revisados',
  budget: 'presupuesto de ingresos y gastos',
  accounting_history: 'histórico contable',
  pensions: 'pensiones estimadas',
  contributions: 'aportación planificada',
  fresh_data: 'datos recientes',
  employment_income_end_dates: 'fin de ingresos laborales',
  expenses_classified: 'gastos clasificados',
  one_off_income_excluded: 'ingresos puntuales excluidos',
};

function qualitySummary(flags: Record<string, boolean>): string {
  const entries = Object.entries(flags);
  if (!entries.length) return '';
  const missing = entries
    .filter(([, passed]) => !passed)
    .map(([key]) => QUALITY_FACTOR_LABELS[key] ?? key);
  if (!missing.length) return `${entries.length} de ${entries.length} factores cubiertos`;
  const shown = missing.slice(0, 3).join(', ');
  const extra = missing.length > 3 ? ` y ${missing.length - 3} más` : '';
  return `Faltan: ${shown}${extra}`;
}
</script>

<template>
  <section class="sect plan-foundations" :class="{ 'is-compact': compact }">
    <div class="sect-head">
      <div>
        <p class="eyebrow">Cimientos</p>
        <h2 class="sect-title">{{ compact ? 'Diagnóstico' : 'Diagnóstico compacto' }}</h2>
        <p v-if="!compact" class="sect-sub">
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
        <small>
          Ingresos {{ monthlyMoney(foundations.cash_flow.structural_annual_income) }}/mes · Gastos
          {{ monthlyMoney(foundations.cash_flow.structural_operating_expense) }}/mes
        </small>
        <small>
          {{ surplusText(foundations.cash_flow.committed_surplus)
          }}<template v-if="foundations.cash_flow.operating_surplus_ratio">
            · margen {{ formatPct(toNumber(foundations.cash_flow.operating_surplus_ratio), 1) }}
          </template>
        </small>
      </article>
      <article>
        <span>Fondo de emergencia</span>
        <strong :class="tone(foundations.emergency_fund.status)">
          {{ months(foundations.emergency_fund.coverage_months_base) }}
        </strong>
        <small>
          Objetivo {{ months(foundations.emergency_fund.target_months) }} · caja y depósitos
          {{ money(foundations.emergency_fund.eligible_liquidity) }}
        </small>
      </article>
      <article>
        <span>Deuda</span>
        <template v-if="hasDebt(foundations.debt)">
          <strong :class="tone(foundations.debt.status)">
            {{ scoreLabel(foundations.debt.score) }}
          </strong>
          <small>Deuda cara {{ money(foundations.debt.high_cost_debt) }}</small>
        </template>
        <template v-else>
          <strong>Sin deuda</strong>
          <small>No hay pasivos registrados que vigilar</small>
        </template>
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
        <!-- Antes aquí se mostraba el margen del flujo de caja: era de otro cimiento. -->
        <small v-if="qualitySummary(foundations.data_quality.flags)">
          {{ qualitySummary(foundations.data_quality.flags) }}
        </small>
      </article>
    </div>
    <p v-else class="plan-muted">Aún no hay cimientos calculados para este plan.</p>
  </section>
</template>
