<script setup lang="ts">
import { computed } from 'vue';
import { AHero, AKpiBand, type AKpiItem } from '@/domains/ui';

const props = defineProps<{
  monthLabel: string;
  eligibleIncome: number;
  totalOutflows: number;
  livingExpense: number;
  financialContributions: number;
  netSavings: number;
  savingsRate: number | null;
  realEstateFormation: number;
  tangibleAssetPurchases: number;
  debtPrincipalRepayment: number;
  formatMoney: (value: number, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();

const kpiItems = computed<AKpiItem[]>(() => [
  { label: 'Ingresos disponibles', value: props.formatMoney(props.eligibleIncome) },
  { label: 'Gasto e intereses', value: props.formatMoney(props.livingExpense) },
  { label: 'Formación inmobiliaria', value: props.formatMoney(props.realEstateFormation) },
]);

const savingsRateLabel = computed(() =>
  props.savingsRate == null ? '—' : `${props.savingsRate.toFixed(0)} %`,
);
</script>

<template>
  <section class="sect mc-hero">
    <div class="a-hero-shell mc-hero-grid">
      <AHero class="mc-hero-main" :eyebrow="`Tasa de ahorro e inversión · ${monthLabel}`">
        <template #value>
          <div class="hero-value mono" :class="netSavings >= 0 ? 'pos' : 'neg'">
            {{ savingsRateLabel }}
          </div>
        </template>
        <template #delta>
          <span>
            <span class="mono" :class="netSavings >= 0 ? 'pos' : 'neg'">
              {{ formatSignedMoney(netSavings) }} €
            </span>
            ahorro e inversión netos
          </span>
          <span class="mc-hero-dot" aria-hidden="true"></span>
          <span>
            <span class="mono">{{ formatMoney(financialContributions) }} €</span>
            aportados a inversión financiera
          </span>
        </template>
      </AHero>

      <AKpiBand class="mc-hero-kpis" :items="kpiItems">
        <template #meta-0> base de la tasa · excluye ventas de activos </template>
        <template #meta-1> salidas totales {{ formatMoney(totalOutflows) }} € </template>
        <template #meta-2>
          <span
            v-if="
              financialContributions > 0 || debtPrincipalRepayment > 0 || tangibleAssetPurchases > 0
            "
          >
            <template v-if="financialContributions > 0">
              inversión financiera {{ formatMoney(financialContributions) }} €
            </template>
            <template v-if="financialContributions > 0 && debtPrincipalRepayment > 0"> · </template>
            <template v-if="debtPrincipalRepayment > 0">
              deuda amortizada {{ formatMoney(debtPrincipalRepayment) }} €
            </template>
            <template
              v-if="
                (financialContributions > 0 || debtPrincipalRepayment > 0) &&
                tangibleAssetPurchases > 0
              "
            >
              ·
            </template>
            <template v-if="tangibleAssetPurchases > 0">
              activos materiales {{ formatMoney(tangibleAssetPurchases) }} €
            </template>
          </span>
          <span v-else>incluye la formación de patrimonio del mes</span>
        </template>
      </AKpiBand>
    </div>
  </section>
</template>
