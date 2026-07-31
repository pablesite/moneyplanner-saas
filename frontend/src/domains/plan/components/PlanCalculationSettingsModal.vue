<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ASelect, BaseModal, type ASelectItem } from '@/domains/ui';
import { formatMoney, formatPct } from '@/lib/format';
import type { ProjectionAssumptions, ProjectionScenario } from '@/domains/plan/types';

// Todo lo que altera el cálculo, en un solo sitio abierto desde la cabecera. Antes
// vivía en un `<details>` al final de la página con un segundo botón que abría los
// parámetros en otro modal: dos pasos para algo que se consulta de un vistazo.
defineProps<{
  open: boolean;
  scenario: ProjectionScenario;
  assumptions: ProjectionAssumptions;
  preservationTarget?: string | number | null;
}>();

defineEmits<{ close: []; 'update:scenario': [ProjectionScenario] }>();

const scenarioOptions: ASelectItem[] = [
  { value: 'prudent', label: 'Prudente' },
  { value: 'expected', label: 'Esperado' },
  { value: 'favorable', label: 'Favorable' },
];

const assumptionRows: Array<{ key: keyof ProjectionAssumptions; label: string }> = [
  { key: 'inflation_rate', label: 'Inflación' },
  { key: 'productive_return_rate', label: 'Retorno productivo' },
  { key: 'non_productive_appreciation_rate', label: 'Revalorización inmobiliaria' },
  { key: 'furnishings_depreciation_rate', label: 'Depreciación de mobiliario y vehículos' },
  { key: 'income_growth_rate', label: 'Crecimiento de ingresos' },
  { key: 'contribution_growth_rate', label: 'Crecimiento de aportaciones' },
  { key: 'withdrawal_rate', label: 'Tasa de retirada' },
  { key: 'default_liability_rate', label: 'Coste de deuda por defecto' },
];
</script>

<template>
  <BaseModal :open="open" title="Ajustes del cálculo" @close="$emit('close')">
    <div class="plan-settings">
      <label class="context-field plan-settings-field">
        <span>Escenario</span>
        <ASelect
          :model-value="scenario"
          :options="scenarioOptions"
          :searchable="false"
          class="filter-ctrl"
          @update:model-value="$emit('update:scenario', $event as ProjectionScenario)"
        />
      </label>
      <p class="plan-settings-note">
        Al cambiarlo, el plan se recalcula con los parámetros de esa hipótesis.
      </p>

      <div v-if="preservationTarget" class="plan-settings-row">
        <span>Capital que no quieres consumir</span>
        <strong class="mono">{{ formatMoney(preservationTarget) }}</strong>
        <RouterLink class="plan-blocker-link" to="/plan/setup">Cambiar</RouterLink>
      </div>

      <div class="plan-settings-params">
        <p class="plan-block-eyebrow">Parámetros de la hipótesis</p>
        <div class="plan-tier-table plan-table-scroll">
          <table>
            <tbody>
              <tr v-for="row in assumptionRows" :key="row.key">
                <td>{{ row.label }}</td>
                <td class="num mono">{{ formatPct(Number(assumptions[row.key]), 1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="plan-settings-note">
          Valores globales de solo lectura. Cada cálculo guardado congela los que usó.
        </p>
      </div>
    </div>
  </BaseModal>
</template>
