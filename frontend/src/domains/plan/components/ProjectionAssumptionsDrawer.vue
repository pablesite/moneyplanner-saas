<script setup lang="ts">
import { BaseModal } from '@/domains/ui';
import { formatPct } from '@/lib/format';
import type { ProjectionAssumptions } from '@/domains/plan/types';

defineProps<{
  open: boolean;
  assumptions: ProjectionAssumptions;
}>();

defineEmits<{ close: [] }>();

const rows: Array<{ key: keyof ProjectionAssumptions; label: string }> = [
  { key: 'inflation_rate', label: 'Inflación' },
  { key: 'productive_return_rate', label: 'Retorno productivo' },
  { key: 'non_productive_appreciation_rate', label: 'Revalorización no productiva' },
  { key: 'income_growth_rate', label: 'Crecimiento de ingresos' },
  { key: 'contribution_growth_rate', label: 'Crecimiento de aportaciones' },
  { key: 'withdrawal_rate', label: 'Tasa de retirada' },
  { key: 'default_liability_rate', label: 'Coste de deuda por defecto' },
];
</script>

<template>
  <BaseModal :open="open" title="Supuestos del cálculo" variant="sheet" @close="$emit('close')">
    <div class="plan-assumptions">
      <p>
        Valores globales de solo lectura de la hipótesis activa. Cada snapshot congela los supuestos
        usados en el cálculo.
      </p>
      <dl>
        <div v-for="row in rows" :key="row.key">
          <dt>{{ row.label }}</dt>
          <dd>{{ formatPct(Number(assumptions[row.key]), 1) }}</dd>
        </div>
      </dl>
    </div>
  </BaseModal>
</template>
