<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { AButton, ASelect, AState, BaseModal, type ASelectItem } from '@/domains/ui';
import { usePeopleStore } from '@/domains/people/store';
import { useNetWorthStore } from '@/domains/net-worth/store';
import {
  activateSettlement,
  disableSettlement,
  getSettlementConfiguration,
  getSettlementReadiness,
  saveSettlementConfiguration,
} from '@/domains/budget/api';
import type {
  SettlementConfiguration,
  SettlementConfigurationWrite,
  SettlementReadiness,
  SettlementReadinessItem,
} from '@/domains/budget/settlementTypes';
import { toBudgetErrorMessage } from '@/domains/budget/api';
import { currencySymbol, formatAmount } from '@/lib/format';

const props = defineProps<{ open: boolean; year: number; month: number }>();
const emit = defineEmits<{ close: []; changed: [configuration: SettlementConfiguration] }>();

const people = usePeopleStore();
const netWorth = useNetWorthStore();
const configuration = ref<SettlementConfiguration | null>(null);
const readiness = ref<SettlementReadiness | null>(null);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const dirty = ref(false);

const form = reactive({
  baseCurrency: 'EUR',
  activationDate: new Date().toISOString().slice(0, 10),
  operatingAssetId: '',
  personalAssetIds: {} as Record<number, string>,
  allocationAssetIds: [] as number[],
  walletAssetIds: [] as number[],
  physicalBalances: {} as Record<number, string>,
  walletAdjustments: {} as Record<string, string>,
});

const adults = computed(() => people.activeAdults);
const activeAssets = computed(() => netWorth.assets.filter((asset) => asset.is_active));
const cashAssets = computed(() => activeAssets.value.filter((asset) => asset.category === 'cash'));
const walletAssets = computed(() =>
  cashAssets.value.filter((asset) => asset.subcategory === 'wallet'),
);
const operatingAssets = computed(() =>
  cashAssets.value.filter((asset) => asset.subcategory !== 'wallet'),
);
const allocationAssets = computed(() =>
  activeAssets.value.filter(
    (asset) => asset.category === 'cash' || asset.category === 'investments',
  ),
);
const operatingOptions = computed<ASelectItem[]>(() => [
  { value: '', label: 'Selecciona la cuenta operativa' },
  ...operatingAssets.value.map((asset) => ({ value: String(asset.id), label: asset.name })),
]);

function individualOwnershipId(memberId: number): number | null {
  return (
    netWorth.ownerships.find(
      (ownership) => ownership.kind === 'individual' && ownership.member?.id === memberId,
    )?.id ?? null
  );
}

function personalOptions(memberId: number): ASelectItem[] {
  const ownershipId = individualOwnershipId(memberId);
  return [
    { value: '', label: 'Selecciona su cuenta personal' },
    ...cashAssets.value
      .filter((asset) => asset.ownership_ref === ownershipId)
      .map((asset) => ({ value: String(asset.id), label: asset.name })),
  ];
}

const existingBaseline = computed(() => Boolean(configuration.value?.opening_balances.length));
const readOnly = computed(() => Boolean(configuration.value?.is_enabled || existingBaseline.value));
const selectedAssetIds = computed(() => {
  const ids = new Set<number>();
  if (form.operatingAssetId) ids.add(Number(form.operatingAssetId));
  Object.values(form.personalAssetIds).forEach((id) => id && ids.add(Number(id)));
  form.allocationAssetIds.forEach((id) => ids.add(id));
  form.walletAssetIds.forEach((id) => ids.add(id));
  return ids;
});
const canSave = computed(() => {
  if (!form.operatingAssetId || adults.value.some((member) => !form.personalAssetIds[member.id])) {
    return false;
  }
  const expectedCount =
    1 + adults.value.length + form.allocationAssetIds.length + form.walletAssetIds.length;
  if (selectedAssetIds.value.size !== expectedCount) return false;
  return form.walletAssetIds.every((assetId) => {
    if (form.physicalBalances[assetId] === '') return false;
    const total = adults.value.reduce(
      (sum, member) => sum + Number(form.walletAdjustments[`${assetId}:${member.id}`] || 0),
      0,
    );
    return Math.abs(total) < 0.005;
  });
});

function hydrate(next: SettlementConfiguration): void {
  configuration.value = next;
  form.baseCurrency = next.base_currency;
  form.activationDate = next.activation_date ?? new Date().toISOString().slice(0, 10);
  form.operatingAssetId = String(
    next.accounts.find((row) => row.role === 'operating')?.asset_id ?? '',
  );
  form.personalAssetIds = {};
  next.accounts
    .filter((row) => row.role === 'personal_destination' && row.member_id != null)
    .forEach((row) => (form.personalAssetIds[row.member_id!] = String(row.asset_id)));
  form.allocationAssetIds = next.accounts
    .filter((row) => row.role === 'allocation_destination')
    .map((row) => row.asset_id);
  form.walletAssetIds = next.accounts
    .filter((row) => row.role === 'physical_cash')
    .map((row) => row.asset_id);
  form.physicalBalances = {};
  form.walletAdjustments = {};
  next.accounts
    .filter((row) => row.role === 'physical_cash')
    .forEach((row) => (form.physicalBalances[row.asset_id] = row.accepted_physical_balance ?? ''));
  next.opening_adjustments.forEach((row) => {
    form.walletAdjustments[`${row.asset_id}:${row.member_id}`] = row.amount;
  });
  dirty.value = false;
}

async function load(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    await Promise.all([
      people.members.length ? Promise.resolve() : people.fetchMembers(),
      netWorth.refreshAll(),
    ]);
    const next = await getSettlementConfiguration();
    hydrate(next);
    readiness.value = await getSettlementReadiness(props.year, props.month);
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.open,
  (open) => open && void load(),
  { immediate: true },
);

function markDirty(): void {
  dirty.value = true;
  readiness.value = null;
}

function toggleId(list: number[], id: number, enabled: boolean): void {
  const index = list.indexOf(id);
  if (enabled && index < 0) list.push(id);
  if (!enabled && index >= 0) list.splice(index, 1);
  markDirty();
}

function buildPayload(): SettlementConfigurationWrite {
  const accounts: SettlementConfigurationWrite['accounts'] = [
    { asset_id: Number(form.operatingAssetId), role: 'operating' },
    ...adults.value.map((member) => ({
      asset_id: Number(form.personalAssetIds[member.id]),
      role: 'personal_destination' as const,
      member_id: member.id,
      is_primary: true,
    })),
    ...form.allocationAssetIds.map((assetId) => ({
      asset_id: assetId,
      role: 'allocation_destination' as const,
    })),
    ...form.walletAssetIds.map((assetId) => ({
      asset_id: assetId,
      role: 'physical_cash' as const,
      accepted_physical_balance: String(form.physicalBalances[assetId]).replace(',', '.'),
    })),
  ];
  const openingAdjustments = form.walletAssetIds.flatMap((assetId) =>
    adults.value
      .map((member) => ({
        asset_id: assetId,
        member_id: member.id,
        amount: String(form.walletAdjustments[`${assetId}:${member.id}`] || '0').replace(',', '.'),
        kind: 'wallet_normalization' as const,
        note: 'Conciliación inicial del efectivo físico',
      }))
      .filter((row) => Math.abs(Number(row.amount)) > 0.000001),
  );
  return { base_currency: form.baseCurrency, accounts, opening_adjustments: openingAdjustments };
}

async function save(): Promise<void> {
  if (!canSave.value) return;
  saving.value = true;
  error.value = null;
  try {
    hydrate(await saveSettlementConfiguration(buildPayload()));
    readiness.value = await getSettlementReadiness(props.year, props.month);
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function activate(): Promise<void> {
  saving.value = true;
  error.value = null;
  try {
    const next = await activateSettlement(form.activationDate);
    hydrate(next);
    readiness.value = await getSettlementReadiness(props.year, props.month);
    emit('changed', next);
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function disable(): Promise<void> {
  saving.value = true;
  error.value = null;
  try {
    const next = await disableSettlement();
    hydrate(next);
    emit('changed', next);
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    saving.value = false;
  }
}

function blockerLabel(item: SettlementReadinessItem): string {
  const labels: Record<string, string> = {
    missing_operating_account: 'Selecciona la cuenta compartida operativa.',
    account_missing_ownership: `Asigna titularidad a ${String(item.asset_name ?? 'una cuenta seleccionada')}.`,
    missing_personal_destination: `Selecciona la cuenta personal de ${String(item.member_name ?? 'cada miembro')}.`,
    income_missing_ownership: `Asigna titularidad al ingreso “${String(item.name ?? '')}”.`,
    expense_missing_ownership: `Asigna titularidad al gasto “${String(item.name ?? '')}”.`,
    expense_missing_settlement_account: `Indica la cuenta destino del gasto “${String(item.name ?? '')}”.`,
    settlement_ownership_mismatch: 'La titularidad de un gasto no coincide con su cuenta destino.',
    wallet_adjustment_required: 'Completa la compensación del monedero para conciliar el efectivo.',
    opening_adjustments_not_zero: 'Las compensaciones iniciales deben sumar exactamente cero.',
    allocation_blocked: 'Faltan ingresos recurrentes válidos para calcular un reparto dinámico.',
  };
  return labels[item.code] ?? item.code.replaceAll('_', ' ');
}

function blockerTarget(item: SettlementReadinessItem) {
  const entryId = Number(item.entry_id);
  if (!Number.isInteger(entryId) || entryId <= 0) return null;
  if (item.code === 'income_missing_ownership') {
    return { name: 'budget-dashboard', query: { editIncome: String(entryId) } };
  }
  if (
    [
      'expense_missing_ownership',
      'expense_missing_settlement_account',
      'expense_invalid_settlement_account',
      'settlement_ownership_mismatch',
    ].includes(item.code)
  ) {
    return { name: 'budget-dashboard', query: { editExpense: String(entryId) } };
  }
  return null;
}

function walletDifference(assetId: number): number {
  const asset = walletAssets.value.find((row) => row.id === assetId);
  const modeled = Number(asset?.effective_amount ?? asset?.amount ?? 0);
  const physical = Number(String(form.physicalBalances[assetId] || 0).replace(',', '.'));
  return modeled - physical;
}

function formattedWalletAmount(assetId: number, value: unknown): string {
  const asset = walletAssets.value.find((row) => row.id === assetId);
  const currency = asset?.currency ?? form.baseCurrency;
  return `${formatAmount(value, { currency })} ${currencySymbol(currency)}`;
}

function walletAdjustmentTotal(assetId: number): number {
  return adults.value.reduce(
    (sum, member) =>
      sum +
      Number(String(form.walletAdjustments[`${assetId}:${member.id}`] || 0).replace(',', '.')),
    0,
  );
}

function requestClose(): void {
  if (dirty.value && !window.confirm('Hay cambios sin guardar. ¿Cerrar igualmente?')) return;
  emit('close');
}
</script>

<template>
  <BaseModal
    :open="open"
    title="Configurar liquidación"
    variant="sheet"
    panel-class="dir-a dir-a-sheet mc-settlement-sheet"
    @close="requestClose"
  >
    <div class="mc-settlement-body">
      <header class="mc-settlement-intro">
        <p class="eyebrow">Antes de calcular transferencias</p>
        <h3>Define por dónde se mueve el dinero familiar</h3>
        <p>
          El cierre reservará lo previsto en cada cuenta compartida y solo propondrá devolver el
          sobrante que corresponda a cada miembro. No crea movimientos ni modifica históricos.
        </p>
      </header>

      <AState v-if="loading" status="loading">Cargando configuración…</AState>
      <AState v-else-if="error" status="error" role="alert">{{ error }}</AState>

      <template v-else-if="configuration">
        <AState v-if="configuration.is_enabled" status="success" layout="inline">
          Motor activo desde {{ configuration.activation_date }}. La configuración queda en solo
          lectura para preservar la trazabilidad.
        </AState>
        <AState v-else-if="existingBaseline" status="neutral" layout="inline">
          Existe un saldo de apertura. Puedes reactivar el motor, pero no reescribir su base.
        </AState>

        <section class="mc-settlement-section">
          <p class="eyebrow">1 · Cuenta operativa</p>
          <h4>¿Dónde entra y se reserva el dinero compartido?</h4>
          <ASelect
            :model-value="form.operatingAssetId"
            :options="operatingOptions"
            :disabled="readOnly"
            @update:model-value="
              (value) => {
                form.operatingAssetId = String(value);
                markDirty();
              }
            "
          />
        </section>

        <section class="mc-settlement-section">
          <p class="eyebrow">2 · Destinos personales</p>
          <h4>Cuenta privada principal de cada miembro</h4>
          <label v-for="member in adults" :key="member.id" class="mc-settlement-field">
            <span>{{ member.name }}</span>
            <ASelect
              :model-value="form.personalAssetIds[member.id] ?? ''"
              :options="personalOptions(member.id)"
              :disabled="readOnly"
              @update:model-value="
                (value) => {
                  form.personalAssetIds[member.id] = String(value);
                  markDirty();
                }
              "
            />
          </label>
        </section>

        <section class="mc-settlement-section">
          <p class="eyebrow">3 · Destinos compartidos previstos</p>
          <h4>Cuentas 50/50 u otras asignaciones</h4>
          <p class="subtle">Márcalas si reciben ahorro o inversión desde el presupuesto.</p>
          <label v-for="asset in allocationAssets" :key="asset.id" class="mc-settlement-check">
            <input
              type="checkbox"
              :checked="form.allocationAssetIds.includes(asset.id)"
              :disabled="readOnly"
              @change="
                toggleId(
                  form.allocationAssetIds,
                  asset.id,
                  ($event.target as HTMLInputElement).checked,
                )
              "
            />
            <span>{{ asset.name }}</span>
          </label>
        </section>

        <section v-if="walletAssets.length" class="mc-settlement-section">
          <p class="eyebrow">4 · Efectivo físico</p>
          <h4>Separa monederos reales de ajustes ficticios</h4>
          <p class="subtle">
            Selecciona los monederos que formarán parte de la liquidación e indica el efectivo
            contado en la fecha de activación. El saldo contable se actualiza al abrir este panel e
            incluye los reajustes ya registrados en Movimientos.
          </p>
          <div v-for="asset in walletAssets" :key="asset.id" class="mc-settlement-wallet">
            <label class="mc-settlement-check">
              <input
                type="checkbox"
                :checked="form.walletAssetIds.includes(asset.id)"
                :disabled="readOnly"
                @change="
                  toggleId(
                    form.walletAssetIds,
                    asset.id,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              <strong>{{ asset.name }}</strong>
              <span class="subtle">
                Saldo contable actualizado:
                {{ formattedWalletAmount(asset.id, asset.effective_amount ?? asset.amount) }}
              </span>
            </label>
            <template v-if="form.walletAssetIds.includes(asset.id)">
              <label class="mc-settlement-field">
                <span>Efectivo real contado</span>
                <input
                  v-model="form.physicalBalances[asset.id]"
                  class="input"
                  inputmode="decimal"
                  :disabled="readOnly"
                  @input="markDirty"
                />
              </label>
              <label v-for="member in adults" :key="member.id" class="mc-settlement-field">
                <span>Compensación de {{ member.name }}</span>
                <input
                  v-model="form.walletAdjustments[`${asset.id}:${member.id}`]"
                  class="input"
                  inputmode="decimal"
                  placeholder="0,00"
                  :disabled="readOnly"
                  @input="markDirty"
                />
              </label>
              <p class="subtle mc-settlement-wallet-summary">
                Diferencia frente al saldo contable:
                {{ formattedWalletAmount(asset.id, walletDifference(asset.id)) }} · compensaciones:
                {{ formattedWalletAmount(asset.id, walletAdjustmentTotal(asset.id)) }} (debe ser
                0,00 {{ currencySymbol(asset.currency) }})
              </p>
            </template>
          </div>
        </section>

        <section class="mc-settlement-section mc-settlement-readiness">
          <p class="eyebrow">Estado de preparación</p>
          <AState v-if="readiness?.status === 'ready'" status="success" layout="inline">
            Todo listo para activar la liquidación.
          </AState>
          <template v-else-if="readiness?.blockers.length">
            <p>
              Estas comprobaciones corresponden a partidas de Presupuesto, no a movimientos.
              Completa estos puntos antes de activar:
            </p>
            <ul>
              <li v-for="(item, index) in readiness.blockers" :key="`${item.code}-${index}`">
                <span>{{ blockerLabel(item) }}</span>
                <RouterLink
                  v-if="blockerTarget(item)"
                  class="btn btn-ghost btn-sm mc-settlement-fix-link"
                  :to="blockerTarget(item)!"
                >
                  Abrir partida
                </RouterLink>
              </li>
            </ul>
          </template>
          <p v-else class="subtle">Guarda la configuración para comprobarla.</p>
        </section>

        <label class="mc-settlement-field">
          <span>Fecha de activación</span>
          <input
            v-model="form.activationDate"
            class="input"
            type="date"
            :disabled="configuration.is_enabled"
          />
        </label>
      </template>
    </div>

    <template #footer>
      <div class="ui-modal-foot-actions mc-settlement-actions">
        <AButton variant="ghost" @click="requestClose">Cerrar</AButton>
        <AButton v-if="configuration && !readOnly" :disabled="saving || !canSave" @click="save">
          Guardar y comprobar
        </AButton>
        <AButton
          v-if="configuration && !configuration.is_enabled"
          variant="primary"
          :disabled="saving || dirty || readiness?.status !== 'ready'"
          @click="activate"
        >
          Activar liquidación
        </AButton>
        <AButton
          v-if="configuration?.is_enabled"
          class="mc-danger-btn"
          :disabled="saving"
          @click="disable"
        >
          Desactivar
        </AButton>
      </div>
    </template>
  </BaseModal>
</template>
