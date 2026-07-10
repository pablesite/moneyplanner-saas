<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AButton, APageHead, ASelect, AState, type ASelectItem } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import type { HouseholdType, PlanMember, PlanMemberPayload, PlanProfile } from '@/domains/plan';
import '@/domains/plan/plan.css';

type MemberDraft = {
  id?: number;
  name: string;
  birth_date: string;
  employment_income_end_date: string;
  pension_start_date: string;
  estimated_monthly_pension_today_eur: string;
  other_future_income_today_eur: string;
};

const router = useRouter();
const { store, plan, loading, error } = usePlan();

const form = reactive({
  household_type: 'single' as HouseholdType,
  target_date: '',
  target_monthly_income_today_eur: '',
  projection_end_date: '',
  preservation_target_eur: '',
  profile: 'balanced' as PlanProfile,
});
const members = reactive<MemberDraft[]>([emptyMember()]);

const householdOptions: ASelectItem[] = [
  { value: 'single', label: 'Individual' },
  { value: 'family', label: 'Pareja / familia' },
];
const profileOptions: ASelectItem[] = [
  { value: 'security', label: 'Seguridad' },
  { value: 'balanced', label: 'Equilibrado' },
  { value: 'growth', label: 'Crecimiento' },
];

const maxMembers = computed(() => (form.household_type === 'family' ? 2 : 1));
const canAddMember = computed(() => members.length < maxMembers.value);
const canSubmit = computed(
  () =>
    form.target_date &&
    form.target_monthly_income_today_eur &&
    form.projection_end_date &&
    members.some((member) => member.name.trim()),
);

function emptyMember(): MemberDraft {
  return {
    name: '',
    birth_date: '',
    employment_income_end_date: '',
    pension_start_date: '',
    estimated_monthly_pension_today_eur: '',
    other_future_income_today_eur: '',
  };
}

function syncFromPlan(current: typeof plan.value): void {
  if (!current) return;
  form.household_type = current.household_type;
  form.target_date = current.target_date;
  form.target_monthly_income_today_eur = current.target_monthly_income_today_eur;
  form.projection_end_date = current.projection_end_date;
  form.preservation_target_eur = current.preservation_target_eur ?? '';
  form.profile = current.profile;
  members.splice(
    0,
    members.length,
    ...(current.members.length ? current.members.map(toDraft) : [emptyMember()]),
  );
}

function toDraft(member: PlanMember): MemberDraft {
  return {
    id: member.id,
    name: member.name,
    birth_date: member.birth_date ?? '',
    employment_income_end_date: member.employment_income_end_date ?? '',
    pension_start_date: member.pension_start_date ?? '',
    estimated_monthly_pension_today_eur: member.estimated_monthly_pension_today_eur ?? '',
    other_future_income_today_eur: member.other_future_income_today_eur ?? '',
  };
}

function toPayload(member: MemberDraft): PlanMemberPayload {
  return {
    name: member.name.trim(),
    role: 'adult',
    is_active: true,
    birth_date: member.birth_date || null,
    employment_income_end_date: member.employment_income_end_date || null,
    pension_start_date: member.pension_start_date || null,
    estimated_monthly_pension_today_eur: member.estimated_monthly_pension_today_eur || null,
    other_future_income_today_eur: member.other_future_income_today_eur || null,
  };
}

function addMember(): void {
  if (canAddMember.value) members.push(emptyMember());
}

function removeMember(index: number): void {
  if (members.length <= 1) return;
  members.splice(index, 1);
}

async function submit(): Promise<void> {
  const savedMembers = [];
  for (const member of members.slice(0, maxMembers.value).filter((row) => row.name.trim())) {
    savedMembers.push(await store.saveMember({ id: member.id, ...toPayload(member) }));
  }
  await store.savePlan({
    household_type: form.household_type,
    target_date: form.target_date,
    target_monthly_income_today_eur: form.target_monthly_income_today_eur,
    projection_end_date: form.projection_end_date,
    preservation_target_eur: form.preservation_target_eur || null,
    preserved_asset_ids: null,
    profile: form.profile,
    member_ids: savedMembers.map((member) => member.id),
  });
  await store.recalculate();
  await router.push('/plan');
}

watch(
  () => form.household_type,
  () => {
    while (members.length > maxMembers.value) members.pop();
  },
);

watch(plan, syncFromPlan, { immediate: true });

onMounted(() => {
  void store.fetchPlan();
});
</script>

<template>
  <main class="page plan-page plan-setup-page">
    <APageHead title="Configurar Mi Plan" eyebrow="Onboarding">
      <template #meta>
        <span>Un único plan vigente</span><span class="dot"></span><span>Euros actuales</span>
      </template>
    </APageHead>

    <AState v-if="loading && !plan" status="loading">Cargando configuración...</AState>
    <AState v-if="error && error !== 'not_found'" status="error">{{ error }}</AState>

    <form class="plan-setup" @submit.prevent="submit">
      <section class="sect plan-form-section">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Unidad financiera</p>
            <h2 class="sect-title">Adultos del plan</h2>
            <p class="sect-sub">Uno o dos adultos consolidados en una sola unidad financiera.</p>
          </div>
        </div>

        <div class="plan-form-grid">
          <label>
            <span>Tipo de unidad</span>
            <ASelect
              v-model="form.household_type"
              :options="householdOptions"
              class="filter-ctrl"
              :searchable="false"
            />
          </label>
          <label>
            <span>Perfil</span>
            <ASelect
              v-model="form.profile"
              :options="profileOptions"
              class="filter-ctrl"
              :searchable="false"
            />
          </label>
        </div>

        <div class="plan-members">
          <article v-for="(member, index) in members" :key="member.id ?? index" class="plan-member">
            <div class="plan-member-head">
              <strong>Adulto {{ index + 1 }}</strong>
              <button
                v-if="members.length > 1"
                type="button"
                class="btn btn-ghost btn-sm"
                @click="removeMember(index)"
              >
                Quitar
              </button>
            </div>
            <div class="plan-form-grid">
              <label>
                <span>Nombre</span>
                <input v-model="member.name" class="input" type="text" autocomplete="name" />
              </label>
              <label>
                <span>Fecha de nacimiento</span>
                <input v-model="member.birth_date" class="input" type="date" />
              </label>
              <label>
                <span>Fin de ingresos laborales</span>
                <input v-model="member.employment_income_end_date" class="input" type="date" />
              </label>
              <label>
                <span>Inicio de pensión</span>
                <input v-model="member.pension_start_date" class="input" type="date" />
              </label>
              <label>
                <span>Pensión mensual estimada</span>
                <input
                  v-model="member.estimated_monthly_pension_today_eur"
                  class="input"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </label>
              <label>
                <span>Otros ingresos futuros</span>
                <input
                  v-model="member.other_future_income_today_eur"
                  class="input"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </label>
            </div>
          </article>
        </div>
        <AButton v-if="canAddMember" variant="ghost" @click="addMember">Añadir adulto</AButton>
      </section>

      <section class="sect plan-form-section">
        <div class="sect-head">
          <div>
            <p class="eyebrow">Objetivo</p>
            <h2 class="sect-title">Horizonte y nivel de vida</h2>
            <p class="sect-sub">El gasto objetivo se expresa en euros actuales.</p>
          </div>
        </div>

        <div class="plan-form-grid">
          <label>
            <span>Fecha objetivo</span>
            <input v-model="form.target_date" class="input" type="date" required />
          </label>
          <label>
            <span>Fin de proyección</span>
            <input v-model="form.projection_end_date" class="input" type="date" required />
          </label>
          <label>
            <span>Nivel de vida mensual</span>
            <input
              v-model="form.target_monthly_income_today_eur"
              class="input"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </label>
          <label>
            <span>Patrimonio mínimo a preservar</span>
            <input
              v-model="form.preservation_target_eur"
              class="input"
              type="number"
              min="0"
              step="0.01"
            />
          </label>
        </div>
      </section>

      <div class="plan-setup-actions">
        <RouterLink class="btn btn-ghost" to="/plan">Cancelar</RouterLink>
        <AButton type="submit" variant="primary" :loading="store.saving" :disabled="!canSubmit">
          Guardar y calcular
        </AButton>
      </div>
    </form>
  </main>
</template>
