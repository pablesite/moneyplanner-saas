<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AButton, AInfoHint, ASelect, AState, BaseModal } from '@/domains/ui';
import { normalizeNumberInput, toNumber } from '@/lib/format';
import { toApiErrorMessage } from '@/lib/errors';
import { corePortfolioApi } from '../api';
import type {
  ContributionCommitment,
  PortfolioOperationOptions,
  PositionAllocationRule,
} from '../types';

const props = defineProps<{
  open: boolean;
  options: PortfolioOperationOptions | null;
}>();
const emit = defineEmits<{ close: []; saved: [message: string] }>();
const FORM_ID = 'portfolio-rules-form';

// El destino es un producto (`p:<id>`) o una plataforma (`c:<id>`): las restricciones de
// compra son del producto, pero el mínimo mensual suele ser de la plataforma entera.
const targetId = ref('');
const positionId = computed(() => (targetId.value.startsWith('p:') ? targetId.value.slice(2) : ''));
const containerId = computed(() =>
  targetId.value.startsWith('c:') ? targetId.value.slice(2) : '',
);
const rules = ref<PositionAllocationRule[]>([]);
const commitments = ref<ContributionCommitment[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const excluded = ref(false);
const minContribution = ref('0');
const roundingStep = ref('0');
const operationCost = ref('0');
const feeFreePlan = ref(false);
const commitmentPeriod = ref<'month' | 'year'>('month');
const commitmentAmount = ref('');
const commitmentReason = ref('');
const breachCost = ref('');

const positionOptions = computed(() => [
  { value: '', label: 'Elige dónde se aplica…' },
  ...(props.options?.containers ?? [])
    .filter((row) => row.is_active)
    .map((row) => ({ value: `c:${row.id}`, label: `Plataforma · ${row.name}` })),
  ...(props.options?.positions ?? [])
    .filter((row) => row.status !== 'archived')
    .map((row) => ({ value: `p:${row.id}`, label: `${row.name} · ${row.container_name}` })),
]);
const periodOptions = [
  { value: 'month', label: 'Cada mes' },
  { value: 'year', label: 'Cada año' },
];
const yesNo = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Sí' },
];

const rule = computed(
  () => rules.value.find((row) => String(row.position_id) === positionId.value) ?? null,
);
const commitment = computed(
  () =>
    commitments.value.find(
      (row) =>
        row.is_active &&
        (containerId.value
          ? String(row.container_id) === containerId.value
          : String(row.position_id) === positionId.value),
    ) ?? null,
);
function ruleDetail(row: PositionAllocationRule): string {
  const parts: string[] = [];
  if (row.excluded) parts.push('excluida del reparto');
  if (toNumber(row.min_contribution) > 0) parts.push(`mínimo ${row.min_contribution} €`);
  if (toNumber(row.rounding_step) > 0) parts.push(`múltiplos de ${row.rounding_step} €`);
  if (toNumber(row.operation_cost) > 0) parts.push(`comisión ${row.operation_cost} €`);
  if (row.fee_free_plan) parts.push('plan periódico sin comisión');
  return parts.join(' · ');
}

function commitmentDetail(row: ContributionCommitment): string {
  return (
    `${row.amount} € ${row.period === 'year' ? 'al año' : 'al mes'}` +
    (toNumber(row.breach_cost) > 0 ? ` · romperlo cuesta ${row.breach_cost} €/año` : '') +
    (row.reason ? ` · ${row.reason}` : '')
  );
}

// Lo ya configurado, para no tener que ir posición por posición averiguando qué hay.
const configured = computed(() => {
  const names = new Map((props.options?.positions ?? []).map((row) => [row.id, row.name] as const));
  const containers = new Map(
    (props.options?.containers ?? []).map((row) => [row.id, row.name] as const),
  );
  const rows: { id: string; name: string; detail: string }[] = [];
  for (const row of rules.value) {
    const detail = ruleDetail(row);
    if (!detail) continue;
    rows.push({
      id: `rule-${row.id}`,
      name: names.get(row.position_id) ?? `Posición ${row.position_id}`,
      detail,
    });
  }
  for (const row of commitments.value.filter((item) => item.is_active)) {
    rows.push({
      id: `commitment-${row.id}`,
      name: row.container_id
        ? `Plataforma · ${containers.get(row.container_id) ?? row.container_id}`
        : (names.get(row.position_id ?? 0) ?? `Posición ${row.position_id}`),
      detail: commitmentDetail(row),
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name, 'es'));
});

function loadForm() {
  const current = rule.value;
  excluded.value = current?.excluded ?? false;
  minContribution.value = current?.min_contribution ?? '0';
  roundingStep.value = current?.rounding_step ?? '0';
  operationCost.value = current?.operation_cost ?? '0';
  feeFreePlan.value = current?.fee_free_plan ?? false;
  const pledge = commitment.value;
  commitmentPeriod.value = pledge?.period ?? 'month';
  commitmentAmount.value = pledge && toNumber(pledge.amount) > 0 ? pledge.amount : '';
  commitmentReason.value = pledge?.reason ?? '';
  breachCost.value = pledge && toNumber(pledge.breach_cost) > 0 ? pledge.breach_cost : '';
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const [ruleRows, commitmentRows] = await Promise.all([
      corePortfolioApi.getAllocationRules(),
      corePortfolioApi.getCommitments(),
    ]);
    rules.value = ruleRows.data;
    commitments.value = commitmentRows.data;
    loadForm();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!targetId.value) {
    error.value = 'Elige dónde se aplica.';
    return;
  }
  saving.value = true;
  error.value = null;
  const target = Number(positionId.value || containerId.value);
  try {
    // Las restricciones de compra son de un producto: una plataforma no tiene mínimo de
    // entrada ni comisión propia, solo el suelo que exige cada mes.
    if (positionId.value) {
      const payload = {
        position_id: target,
        excluded: excluded.value,
        min_contribution: normalizeNumberInput(minContribution.value) || '0',
        rounding_step: normalizeNumberInput(roundingStep.value) || '0',
        operation_cost: normalizeNumberInput(operationCost.value) || '0',
        fee_free_plan: feeFreePlan.value,
      };
      if (rule.value) await corePortfolioApi.updateAllocationRule(rule.value.id, payload);
      else await corePortfolioApi.createAllocationRule(payload);
    }

    // Un compromiso sin importe es no tener compromiso: se desactiva en vez de quedarse
    // reclamando cero cada mes.
    const amount = normalizeNumberInput(commitmentAmount.value);
    if (toNumber(amount) > 0) {
      const pledge = {
        ...(positionId.value ? { position_id: target } : { container_id: target }),
        period: commitmentPeriod.value,
        amount,
        reason: commitmentReason.value.trim(),
        breach_cost: normalizeNumberInput(breachCost.value) || '0',
        is_active: true,
      };
      if (commitment.value) await corePortfolioApi.updateCommitment(commitment.value.id, pledge);
      else await corePortfolioApi.createCommitment(pledge);
    } else if (commitment.value) {
      await corePortfolioApi.deleteCommitment(commitment.value.id);
    }
    emit('saved', 'Restricciones guardadas.');
    await load();
  } catch (caught: unknown) {
    error.value = toApiErrorMessage(caught);
  } finally {
    saving.value = false;
  }
}

watch(targetId, loadForm);
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    targetId.value = '';
    error.value = null;
    void load();
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :open="open"
    title="Restricciones de compra"
    variant="sheet"
    panel-class="dir-a dir-a-sheet a-pf-operation-sheet"
    @close="emit('close')"
  >
    <form :id="FORM_ID" class="a-pf-strategy-flow a-pf-item-form" @submit.prevent="save">
      <p>
        Lo que hace que una propuesta se pueda ejecutar de verdad: mínimos de entrada, comisiones
        que se comerían la operación y lo que tiene que llegar sí o sí a una posición aunque la
        desviación diga otra cosa.
      </p>

      <AState v-if="loading" status="loading" layout="inline">Cargando restricciones…</AState>

      <template v-else>
        <label class="ui-item-form-field">
          <span class="ui-item-form-label">
            Se aplica a
            <AInfoHint
              label="Un producto concreto, o la plataforma entera. El mínimo mensual de MyInvestor son 300 € en la plataforma y da igual si van al plan o al roboadvisor: eso se escribe sobre la plataforma, y el reparto se ocupa de repartirlo entre sus productos."
            />
          </span>
          <ASelect
            v-model="targetId"
            :options="positionOptions"
            :searchable="true"
            class="select"
          />
        </label>

        <template v-if="positionId">
          <div class="ui-item-form-grid">
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Mínimo de entrada
                <AInfoHint
                  label="Por debajo de esto la plataforma no deja invertir: Urbanitae pide 500 € por proyecto, por ejemplo. Lo que no llegue se acumula en el efectivo del contenedor hasta alcanzarlo."
                />
              </span>
              <input v-model="minContribution" class="input" inputmode="decimal" />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Múltiplos de
                <AInfoHint
                  label="Si solo se puede comprar de N en N euros. Deja 0 si admite cualquier importe."
                />
              </span>
              <input v-model="roundingStep" class="input" inputmode="decimal" />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Comisión por operación
                <AInfoHint
                  label="Lo que cuesta cada compra. Si se lleva más de lo que la política tolera, el reparto no propone esa línea: pagar 1 € por invertir 20 es tirar un 5%."
                />
              </span>
              <input v-model="operationCost" class="input" inputmode="decimal" />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Plan periódico sin comisión
                <AInfoHint
                  label="El DCA de TradeRepublic y equivalentes: la compra programada no paga comisión aunque la suelta sí. Con esto activado el reparto deja de penalizar la operación."
                />
              </span>
              <ASelect
                :model-value="feeFreePlan ? 'yes' : 'no'"
                :options="yesNo"
                :searchable="false"
                @update:model-value="(value) => (feeFreePlan = value === 'yes')"
              />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">
                Excluir del reparto
                <AInfoHint
                  label="La posición deja de recibir aportaciones: sigue contando para la composición, pero el reparto no la propone."
                />
              </span>
              <ASelect
                :model-value="excluded ? 'yes' : 'no'"
                :options="yesNo"
                :searchable="false"
                @update:model-value="(value) => (excluded = value === 'yes')"
              />
            </label>
          </div>
        </template>

        <!-- El compromiso vale para las dos formas del destino: un producto tiene su cupo
             y una plataforma tiene su suelo mensual. -->
        <template v-if="targetId">
          <h3 class="a-pf-rules-heading">
            Compromiso
            <AInfoHint>
              Lo que tiene que llegar aquí <strong>pase lo que pase</strong> con la desviación: los
              1.500 € al año que desgravan en el plan de pensiones, o el mínimo mensual que conserva
              la cuenta remunerada de tu banco. Un cupo anual es además un techo, porque aportar de
              más ya no desgrava.
            </AInfoHint>
          </h3>
          <div class="ui-item-form-grid">
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">Importe</span>
              <input
                v-model="commitmentAmount"
                class="input"
                inputmode="decimal"
                placeholder="Sin compromiso"
              />
            </label>
            <label class="ui-item-form-field">
              <span class="ui-item-form-label">Cada</span>
              <ASelect v-model="commitmentPeriod" :options="periodOptions" :searchable="false" />
            </label>
          </div>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">
              Si no lo cumples, cuesta
              <AInfoHint>
                Al año, y en euros. Un compromiso no vale por su importe sino por lo que se pierde
                al romperlo: dejar la aportación periódica del roboadvisor puede tirar la
                remuneración del <strong>saldo entero</strong> de tu cuenta del banco, que es mucho
                más dinero que la aportación. Con 12.000 € al 2,5 % frente al 0 % sin plan, aquí van
                300 €. Cuando la aportación no llegue para todos los compromisos, se atiende primero
                al más caro de romper.
              </AInfoHint>
            </span>
            <input v-model="breachCost" class="input" inputmode="decimal" placeholder="0" />
          </label>
          <label class="ui-item-form-field">
            <span class="ui-item-form-label">Por qué</span>
            <input
              v-model="commitmentReason"
              class="input"
              type="text"
              maxlength="200"
              placeholder="Tope deducible, cuenta remunerada…"
            />
          </label>
        </template>

        <section v-if="configured.length" class="a-pf-rules-summary">
          <h3>Ya configurado</h3>
          <ul>
            <li v-for="row in configured" :key="row.id">
              <span>{{ row.name }}</span>
              <small>{{ row.detail }}</small>
            </li>
          </ul>
        </section>
        <AState v-else status="empty" layout="inline">
          Todavía no hay ninguna restricción escrita. Sin ellas el reparto solo respeta la línea
          mínima de la política.
        </AState>
      </template>

      <AState v-if="error" status="error" layout="inline">{{ error }}</AState>
    </form>
    <template #footer>
      <div class="ui-modal-foot-actions">
        <AButton variant="ghost" :disabled="saving" @click="emit('close')">Cerrar</AButton>
        <AButton
          variant="primary"
          type="submit"
          :form="FORM_ID"
          :loading="saving"
          :disabled="!targetId"
        >
          Guardar
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
