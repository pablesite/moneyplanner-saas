<script setup lang="ts">
import { computed } from 'vue';
import { AHero, AKpiBand, type AKpiItem } from '@/domains/ui';

const props = defineProps<{
  monthLabel: string;
  eligibleIncome: number;
  totalOutflows: number;
  livingExpense: number;
  financialContributions: number;
  financialSavings: number;
  savingsRate: number | null;
  realEstateFormation: number;
  tangibleAssetPurchases: number;
  formatMoney: (value: number, decimals?: number) => string;
  formatSignedMoney: (value: number, decimals?: number) => string;
}>();

const kpiItems = computed<AKpiItem[]>(() => [
  { label: 'Ingresos disponibles', value: props.formatMoney(props.eligibleIncome) },
  { label: 'Gasto y compromisos', value: props.formatMoney(props.livingExpense) },
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
          <div class="hero-value mono" :class="financialSavings >= 0 ? 'pos' : 'neg'">
            {{ savingsRateLabel }}
          </div>
        </template>
        <template #delta>
          <span>
            <span class="mono" :class="financialSavings >= 0 ? 'pos' : 'neg'">
              {{ formatSignedMoney(financialSavings) }} €
            </span>
            ahorro financiero
          </span>
          <span class="mc-hero-dot" aria-hidden="true"></span>
          <span>
            <span class="mono">{{ formatMoney(financialContributions) }} €</span>
            aportados a ahorro e inversión
          </span>
        </template>
      </AHero>

      <AKpiBand class="mc-hero-kpis" :items="kpiItems">
        <template #meta-0> base de la tasa · excluye ventas de activos </template>
        <template #meta-1> salidas totales {{ formatMoney(totalOutflows) }} € </template>
        <template #meta-2>
          <span v-if="tangibleAssetPurchases > 0">
            mobiliario {{ formatMoney(tangibleAssetPurchases) }} € no incluido en la tasa
          </span>
          <span v-else>se muestra aparte del ahorro financiero</span>
        </template>
      </AKpiBand>
    </div>
  </section>
</template>
