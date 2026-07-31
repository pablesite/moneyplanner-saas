<script setup lang="ts">
import { AInfoHint } from '@/domains/ui';
import type {
  PlanFoundations,
  PlanFoundationScore,
  PlanFoundationStatus,
} from '@/domains/plan/types';
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

// La nota (A-E) también sale de Core, encajada en las mismas bandas: la letra afina
// dentro del color, nunca lo contradice.
function gradeTitle(block: PlanFoundationScore): string {
  return `Nota ${block.grade} · ${block.score}/100`;
}

function money(value: string | null | undefined): string {
  if (value == null) return '-';
  return formatMoney(toNumber(value));
}

function months(value: string | null | undefined): string {
  if (value == null) return '-';
  return `${formatNumber(toNumber(value), 1)} meses`;
}

function pct(value: string | null | undefined): string {
  if (value == null) return '-';
  return formatPct(toNumber(value), 1);
}

// Los campos de cash_flow vienen en anual; aquí se muestran en mensual para
// que se lean junto a "Aportación planificada" y el resto de cifras del plan.
function monthlyMoney(value: string | null | undefined): string {
  if (value == null) return '-';
  return formatMoney(toNumber(value) / 12);
}

// Importe mensual con signo explícito: la tarjeta encadena ingresos − gastos =
// base, y sin el signo no se ve si cada eslabón suma o resta.
function signedMonthly(value: string | null | undefined): string {
  if (value == null) return '-';
  const amount = toNumber(value) / 12;
  return `${amount > 0 ? '+' : ''}${formatMoney(amount)}`;
}

function hasCommitments(cashFlow: PlanFoundations['cash_flow']): boolean {
  return toNumber(cashFlow.temporary_commitment_expense) > 0;
}

// Score 0 en rojo sin deuda alguna se lee como contradicción: sin pasivos no hay
// nada que puntuar, así que el cimiento lo dice en palabras y sin tono crítico.
function hasDebt(debt: PlanFoundations['debt']): boolean {
  return toNumber(debt.total_debt) > 0;
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
  employment_income_end_dates: 'cuándo dejáis de cobrar por trabajar (Editar objetivo)',
  expenses_classified: 'gastos clasificados',
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
    <div v-if="!compact" class="sect-head">
      <div>
        <p class="plan-block-eyebrow">Salud financiera</p>
        <h2 class="sect-title">Diagnóstico compacto</h2>
        <p class="sect-sub">
          Flujo de caja, fondo de emergencia, deuda, aportación, patrimonio y calidad de datos.
        </p>
      </div>
    </div>
    <div v-if="foundations" class="plan-foundation-grid">
      <!-- Cada cimiento abre con su nota: la letra juzga, la cifra de la derecha
           informa. El valor dejó de ser la palabra del estado, que solo repetía el
           color con más letras. -->
      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.cash_flow.grade}`">
            {{ foundations.cash_flow.grade }}
          </span>
          Flujo de caja
        </span>
        <!-- El valor es el resultado del año, no la base: si los compromisos lo dejan
             en negativo, la nota y la cifra tienen que contar lo mismo. -->
        <strong
          :class="tone(foundations.cash_flow.status)"
          :title="gradeTitle(foundations.cash_flow)"
        >
          {{
            signedMonthly(
              hasCommitments(foundations.cash_flow)
                ? foundations.cash_flow.committed_surplus
                : foundations.cash_flow.operating_surplus,
            )
          }}/mes
        </strong>
        <small>
          Base recurrente {{ signedMonthly(foundations.cash_flow.operating_surplus) }}/mes<template
            v-if="foundations.cash_flow.operating_surplus_ratio"
          >
            ({{ pct(foundations.cash_flow.operating_surplus_ratio) }} de tus ingresos)</template
          >
        </small>
        <small v-if="hasCommitments(foundations.cash_flow)">
          − compromisos temporales
          {{ monthlyMoney(foundations.cash_flow.temporary_commitment_expense) }}/mes<template
            v-if="foundations.cash_flow.committed_recovery_year"
          >
            , que vencen en {{ foundations.cash_flow.committed_recovery_year }}</template
          >
        </small>
      </article>

      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.emergency_fund.grade}`">
            {{ foundations.emergency_fund.grade }}
          </span>
          Fondo de emergencia
        </span>
        <strong
          :class="tone(foundations.emergency_fund.status)"
          :title="gradeTitle(foundations.emergency_fund)"
        >
          {{ months(foundations.emergency_fund.coverage_months_base) }}
        </strong>
        <small>
          Objetivo {{ months(foundations.emergency_fund.target_months) }} · caja y depósitos
          {{ money(foundations.emergency_fund.eligible_liquidity) }}
        </small>
      </article>

      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.debt.grade}`">
            {{ foundations.debt.grade }}
          </span>
          Deuda cara
        </span>
        <!-- Lo que juzga la nota es la deuda cara, no el saldo: una hipoteca al 1,5 %
             no es un problema. El total y su coste medio van al desglose. -->
        <strong :class="tone(foundations.debt.status)" :title="gradeTitle(foundations.debt)">
          {{ money(foundations.debt.high_cost_debt) }}
        </strong>
        <small v-if="hasDebt(foundations.debt)">
          {{ money(foundations.debt.total_debt) }} en total<template
            v-if="foundations.debt.weighted_tae_pct"
          >
            · {{ formatNumber(toNumber(foundations.debt.weighted_tae_pct), 1) }} % de interés
            medio</template
          ><template v-if="foundations.debt.debt_payment_to_income">
            · cuotas {{ pct(foundations.debt.debt_payment_to_income) }} de tus ingresos</template
          >
        </small>
        <small v-else>No hay pasivos registrados que vigilar</small>
      </article>

      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.planned_contribution.grade}`">
            {{ foundations.planned_contribution.grade }}
          </span>
          Aportación planificada
        </span>
        <strong
          :class="tone(foundations.planned_contribution.status)"
          :title="gradeTitle(foundations.planned_contribution)"
        >
          {{ money(foundations.planned_contribution.monthly_amount) }}/mes
        </strong>
        <small v-if="foundations.planned_contribution.savings_rate">
          Ahorras el {{ pct(foundations.planned_contribution.savings_rate) }} de tus ingresos ·
          objetivo {{ pct(foundations.planned_contribution.target_savings_rate) }}
        </small>
      </article>

      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.net_worth_health.grade}`">
            {{ foundations.net_worth_health.grade }}
          </span>
          Salud patrimonial
        </span>
        <!-- La nota mide composición (liquidez y concentración), así que el valor es
             la parte poco líquida, no el tamaño del patrimonio. -->
        <strong
          :class="tone(foundations.net_worth_health.status)"
          :title="gradeTitle(foundations.net_worth_health)"
        >
          {{ pct(foundations.net_worth_health.illiquid_assets_share) }} poco líquido
        </strong>
        <small>
          Sobre {{ money(foundations.net_worth_health.assets_value) }} en activos<template
            v-if="foundations.net_worth_health.top_asset_share"
          >
            · mayor categoría {{ pct(foundations.net_worth_health.top_asset_share) }}</template
          >
        </small>
      </article>

      <article>
        <span class="plan-foundation-name">
          <span class="plan-grade" :class="`is-${foundations.data_quality.grade}`">
            {{ foundations.data_quality.grade }}
          </span>
          Calidad de datos
          <AInfoHint
            label="Mide cuánto puedes fiarte del diagnóstico: qué datos tiene el motor para calcularlo."
          />
        </span>
        <strong
          :class="tone(foundations.data_quality.status)"
          :title="gradeTitle(foundations.data_quality)"
        >
          {{ foundations.data_quality.score }}/100
        </strong>
        <small v-if="qualitySummary(foundations.data_quality.flags)">
          {{ qualitySummary(foundations.data_quality.flags) }}
        </small>
      </article>
    </div>
    <p v-else class="plan-muted">Aún no hay cimientos calculados para este plan.</p>
  </section>
</template>
