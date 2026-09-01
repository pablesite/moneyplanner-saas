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
  rebaselineSettlement,
  saveOperatingReserveAdjustment,
  saveSettlementConfiguration,
} from '@/domains/budget/api';
import type {
  SettlementConfiguration,
  SettlementConfigurationWrite,
  SettlementReadiness,
  SettlementReadinessItem,
  SettlementWalletReconciliation,
} from '@/domains/budget/settlementTypes';
import { toBudgetErrorMessage } from '@/domains/budget/api';
import { currencySymbol, formatAmount } from '@/lib/format';
import { dateToIso, parseIsoToDate } from '@/lib/dates';

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
const rebaselineMode = ref(false);

const form = reactive({
  baseCurrency: 'EUR',
  startDate: new Date().toISOString().slice(0, 10),
  operatingAssetId: '',
  personalAssetIds: {} as Record<number, string>,
  allocationAssetIds: [] as number[],
  walletAssetIds: [] as number[],
  physicalBalances: {} as Record<number, string>,
  walletAdjustments: {} as Record<string, string>,
  normalizationTransactionIds: [] as number[],
  operatingReserveAdjustment: '0',
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

type ReserveAdjustmentDirection = 'more' | 'less';

function normalizeReserveAdjustment(value: unknown): string {
  return String(value ?? '0').trim();
}

function reserveAdjustmentMagnitude(value: unknown): string {
  return normalizeReserveAdjustment(value).replace(/^-/, '');
}

const reserveAdjustmentDirection = ref<ReserveAdjustmentDirection>('more');

const operatingReserveAdjustmentMagnitude = computed({
  get: () => reserveAdjustmentMagnitude(form.operatingReserveAdjustment),
  set: (value: string) => {
    form.operatingReserveAdjustment =
      reserveAdjustmentDirection.value === 'less' && value.trim() ? `-${value}` : value;
  },
});

function setReserveAdjustmentDirection(direction: ReserveAdjustmentDirection): void {
  reserveAdjustmentDirection.value = direction;
  const magnitude = reserveAdjustmentMagnitude(form.operatingReserveAdjustment);
  form.operatingReserveAdjustment = direction === 'less' && magnitude ? `-${magnitude}` : magnitude;
}

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
const baselineEditable = computed(() => !readOnly.value || rebaselineMode.value);
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
  if (next.start_date) form.startDate = next.start_date;
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
  form.normalizationTransactionIds = next.normalization_transactions.map(
    (row) => row.transaction_id,
  );
  form.operatingReserveAdjustment = normalizeReserveAdjustment(next.operating_reserve_adjustment);
  reserveAdjustmentDirection.value =
    Number(form.operatingReserveAdjustment.replace(',', '.')) < 0 ? 'less' : 'more';
  dirty.value = false;
  rebaselineMode.value = false;
}

function activationPeriod(): { year: number; month: number } {
  const [year, month] = form.startDate.split('-').map(Number);
  if (Number.isInteger(year) && Number.isInteger(month) && month >= 1 && month <= 12) {
    return { year, month };
  }
  return { year: props.year, month: props.month };
}

function baselineDate(): string | undefined {
  if (!form.startDate) return undefined;
  const value = new Date(`${form.startDate}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() - 1);
  return dateToIso(value);
}

async function refreshReadiness(): Promise<void> {
  const period = activationPeriod();
  readiness.value = await getSettlementReadiness(period.year, period.month, baselineDate());
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
    await refreshReadiness();
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
  return {
    base_currency: form.baseCurrency,
    accounts,
    opening_adjustments: openingAdjustments,
    normalization_transaction_ids: form.normalizationTransactionIds,
  };
}

async function save(): Promise<void> {
  if (!canSave.value) return;
  saving.value = true;
  error.value = null;
  try {
    hydrate(await saveSettlementConfiguration(buildPayload()));
    await refreshReadiness();
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function saveReserveAdjustment(): Promise<void> {
  saving.value = true;
  error.value = null;
  try {
    const next = await saveOperatingReserveAdjustment({
      operating_reserve_adjustment: normalizeReserveAdjustment(
        form.operatingReserveAdjustment,
      ).replace(',', '.'),
    });
    hydrate(next);
    emit('changed', next);
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
    const next = await activateSettlement(form.startDate);
    hydrate(next);
    await refreshReadiness();
    emit('changed', next);
  } catch (reason) {
    error.value = toBudgetErrorMessage(reason);
  } finally {
    saving.value = false;
  }
}

async function beginRebaseline(): Promise<void> {
  if (!configuration.value?.can_rebaseline) return;
  if (
    !window.confirm(
      'La recalibración sustituirá el saldo de apertura, pero conservará los movimientos y cierres históricos. ¿Continuar?',
    )
  ) {
    return;
  }
  rebaselineMode.value = true;
  readiness.value = null;
  await refreshReadiness();
}

async function rebaseline(): Promise<void> {
  if (!canSave.value) return;
  saving.value = true;
  error.value = null;
  try {
    const configurationPayload = buildPayload();
    const next = await rebaselineSettlement({
      start_date: form.startDate,
      wallet_balances: configurationPayload.accounts
        .filter((row) => row.role === 'physical_cash')
        .map((row) => ({
          asset_id: row.asset_id,
          accepted_physical_balance: String(row.accepted_physical_balance),
        })),
      opening_adjustments: configurationPayload.opening_adjustments,
      normalization_transaction_ids: form.normalizationTransactionIds,
    });
    hydrate(next);
    await refreshReadiness();
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
    wallet_adjustment_required: `Concilia ${String(item.asset_name ?? 'este monedero')} en la fecha de activación: la diferencia es ${formattedWalletAmount(Number(item.asset_id), item.difference)}.`,
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
  const reconciliation = walletReconciliation(assetId);
  if (reconciliation) return Number(reconciliation.difference);
  const asset = walletAssets.value.find((row) => row.id === assetId);
  const modeled = Number(asset?.effective_amount ?? asset?.amount ?? 0);
  const physical = Number(String(form.physicalBalances[assetId] || 0).replace(',', '.'));
  return modeled - physical;
}

function walletReconciliation(assetId: number): SettlementWalletReconciliation | null {
  return readiness.value?.wallet_reconciliations?.find((row) => row.asset_id === assetId) ?? null;
}

function walletModeledBalance(assetId: number): unknown {
  const reconciliation = walletReconciliation(assetId);
  if (reconciliation) return reconciliation.modeled_balance;
  const asset = walletAssets.value.find((row) => row.id === assetId);
  return asset?.effective_amount ?? asset?.amount ?? 0;
}

function walletBalanceDate(assetId: number): string {
  const raw = walletReconciliation(assetId)?.balance_date ?? baselineDate();
  if (!raw) return 'la fecha de activación';
  return new Intl.DateTimeFormat('es-ES').format(parseIsoToDate(raw));
}

function toggleNormalization(transactionId: number, enabled: boolean): void {
  toggleId(form.normalizationTransactionIds, transactionId, enabled);
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
          Motor activo desde {{ configuration.start_date }}. El saldo base corresponde al
          {{ configuration.baseline_date }}.
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

        <section v-if="configuration.is_enabled" class="mc-settlement-section">
          <p class="eyebrow">Reserva manual</p>
          <h4>Ajuste sobre la reserva calculada de Kutxa</h4>
          <p class="subtle">
            Usa un importe positivo para retener más efectivo o negativo para retener menos. No
            modifica el presupuesto y las transferencias se recalculan al guardar.
          </p>
          <div class="mc-settlement-reserve-direction" role="group" aria-label="Sentido del ajuste">
            <AButton
              :class="{ 'is-active': reserveAdjustmentDirection === 'less' }"
              size="sm"
              variant="ghost"
              @click="setReserveAdjustmentDirection('less')"
            >
              Retener menos
            </AButton>
            <AButton
              :class="{ 'is-active': reserveAdjustmentDirection === 'more' }"
              size="sm"
              variant="ghost"
              @click="setReserveAdjustmentDirection('more')"
            >
              Retener más
            </AButton>
          </div>
          <label class="mc-settlement-field">
            <span>Ajuste manual ({{ currencySymbol(form.baseCurrency) }})</span>
            <input
              v-model="operatingReserveAdjustmentMagnitude"
              class="input"
              inputmode="decimal"
              placeholder="0,00"
            />
          </label>
          <AButton :loading="saving" size="sm" @click="saveReserveAdjustment">
            Recalcular reserva
          </AButton>
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
                Saldo contable a {{ walletBalanceDate(asset.id) }}:
                {{ formattedWalletAmount(asset.id, walletModeledBalance(asset.id)) }}
              </span>
            </label>
            <template v-if="form.walletAssetIds.includes(asset.id)">
              <label class="mc-settlement-field">
                <span>Efectivo real contado</span>
                <input
                  v-model="form.physicalBalances[asset.id]"
                  class="input"
                  inputmode="decimal"
                  :disabled="!baselineEditable"
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
                  :disabled="!baselineEditable"
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
          <div
            v-if="readiness?.wallet_normalization_candidates.length"
            class="mc-settlement-normalizations"
          >
            <h4>Transferencias que solo cerraron el sistema anterior</h4>
            <p class="subtle">
              Márcalas únicamente si no desplazaron efectivo: el motor conservará su fecha y las
              usará para cerrar el desfase contable del monedero.
            </p>
            <label
              v-for="candidate in readiness.wallet_normalization_candidates"
              :key="candidate.transaction_id"
              class="mc-settlement-check"
            >
              <input
                type="checkbox"
                :checked="form.normalizationTransactionIds.includes(candidate.transaction_id)"
                :disabled="!baselineEditable"
                @change="
                  toggleNormalization(
                    candidate.transaction_id,
                    ($event.target as HTMLInputElement).checked,
                  )
                "
              />
              <span>
                {{ candidate.booking_date }} · {{ candidate.description }}
                <small>
                  {{
                    candidate.entries
                      .map((entry) => `${entry.asset_name}: ${entry.amount}`)
                      .join(' · ')
                  }}
                </small>
              </span>
            </label>
          </div>
        </section>

        <section class="mc-settlement-section mc-settlement-readiness">
          <p class="eyebrow">Estado de preparación</p>
          <AState v-if="readiness?.status === 'ready'" status="success" layout="inline">
            Todo listo para activar la liquidación.
          </AState>
          <template v-else-if="readiness?.blockers.length">
            <p>Completa estos puntos antes de activar:</p>
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
          <span>Primer día incluido en la liquidación</span>
          <input
            v-model="form.startDate"
            class="input"
            type="date"
            :disabled="!baselineEditable"
            @input="markDirty"
            @change="refreshReadiness"
          />
          <small v-if="baselineDate()" class="subtle">
            Los saldos de apertura se tomarán al {{ baselineDate() }}.
          </small>
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
          variant="ghost"
          :disabled="saving || !configuration.can_rebaseline || rebaselineMode"
          @click="beginRebaseline"
        >
          Recalibrar apertura
        </AButton>
        <AButton
          v-if="configuration?.is_enabled && rebaselineMode"
          variant="primary"
          :disabled="saving || !canSave"
          @click="rebaseline"
        >
          Confirmar recalibración
        </AButton>
        <AButton
          v-if="configuration?.is_enabled && !rebaselineMode"
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
