<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { AButton, APageHead, AState, AStepper } from '@/domains/ui';
import { usePlan } from '@/domains/plan';
import { ageAtDate, dateAtAge } from '@/domains/plan/age';
import type { HouseholdType, PlanMember, PlanMemberPayload, PlanProfile } from '@/domains/plan';
import { formatMoney } from '@/lib/format';
import { formatLongMonthYear } from '@/lib/dates';
import '@/domains/plan/plan.css';

type MemberDraft = {
  id?: number;
  name: string;
  birth_date: string;
  estimated_monthly_pension_today_eur: string;
  other_future_income_today_eur: string;
};

type StepId = 'household' | 'horizon' | 'lifestyle' | 'future' | 'profile' | 'summary';

/** Core deriva la jubilación a esta edad y no acepta otra: aquí solo se muestra. */
const LEGAL_RETIREMENT_AGE = 67;
const DEFAULT_INDEPENDENCE_AGE = 60;
const DEFAULT_LONGEVITY_AGE = 95;

const router = useRouter();
const { store, plan, loading, error } = usePlan();

const stepIds: StepId[] = ['household', 'horizon', 'lifestyle', 'future', 'profile', 'summary'];
const stepLabels: Record<StepId, string> = {
  household: 'Quiénes sois',
  horizon: 'Cuándo',
  lifestyle: 'Con cuánto',
  future: 'Ingresos y legado',
  profile: 'Ante una caída',
  summary: 'Tu plan',
};

const stepIndex = ref(0);
const furthestIndex = ref(0);
const submitting = ref(false);

const form = reactive({
  household_type: 'single' as HouseholdType,
  independence_age: DEFAULT_INDEPENDENCE_AGE,
  longevity_age: DEFAULT_LONGEVITY_AGE,
  monthly_income: '',
  wants_legacy: false,
  legacy_amount: '',
  profile: 'balanced' as PlanProfile,
});
const members = reactive<MemberDraft[]>([emptyMember()]);

const currentStep = computed<StepId>(() => stepIds[stepIndex.value]!);
const isLastStep = computed(() => stepIndex.value === stepIds.length - 1);
const maxMembers = computed(() => (form.household_type === 'family' ? 2 : 1));
const activeMembers = computed(() => members.slice(0, maxMembers.value));

/** El primer adulto ancla las edades: las fechas del plan se derivan de su nacimiento. */
const anchorBirthDate = computed(() => activeMembers.value[0]?.birth_date ?? '');
const targetDate = computed(() =>
  anchorBirthDate.value ? dateAtAge(anchorBirthDate.value, form.independence_age) : '',
);
const projectionEndDate = computed(() =>
  anchorBirthDate.value ? dateAtAge(anchorBirthDate.value, form.longevity_age) : '',
);
const yearsToTarget = computed(() => {
  if (!targetDate.value) return null;
  return Number(targetDate.value.slice(0, 4)) - new Date().getFullYear();
});

const suggestedMonthly = computed(() => {
  const annual = Number(store.foundations?.cash_flow?.structural_operating_expense ?? '');
  return Number.isFinite(annual) && annual > 0 ? Math.round(annual / 12) : null;
});
const lifestyleChoices = computed(() => {
  const base = suggestedMonthly.value;
  if (!base) return [];
  return [
    { amount: Math.round(base * 0.8), label: 'Con algo menos', hint: '20% por debajo de hoy' },
    { amount: base, label: 'Como ahora', hint: 'Tu gasto estructural actual' },
    { amount: Math.round(base * 1.2), label: 'Con algo más', hint: '20% por encima de hoy' },
  ];
});

const profileChoices: { value: PlanProfile; label: string; hint: string }[] = [
  {
    value: 'security',
    label: 'Vendería para no perder más',
    hint: 'Perfil seguridad: priorizas dormir tranquilo sobre crecer.',
  },
  {
    value: 'balanced',
    label: 'Aguantaría sin tocar nada',
    hint: 'Perfil equilibrado: asumes la caída como parte del camino.',
  },
  {
    value: 'growth',
    label: 'Aprovecharía para invertir más',
    hint: 'Perfil crecimiento: las caídas te parecen oportunidades.',
  },
];

const householdComplete = computed(() =>
  activeMembers.value.every((member) => member.name.trim() && member.birth_date),
);
const horizonComplete = computed(
  () =>
    Boolean(targetDate.value && projectionEndDate.value) &&
    form.longevity_age > form.independence_age,
);
const lifestyleComplete = computed(() => Number(form.monthly_income) > 0);
const futureComplete = computed(() => !form.wants_legacy || Number(form.legacy_amount) > 0);

const stepComplete = computed<Record<StepId, boolean>>(() => ({
  household: householdComplete.value,
  horizon: horizonComplete.value,
  lifestyle: lifestyleComplete.value,
  future: futureComplete.value,
  profile: true,
  summary: true,
}));
const canAdvance = computed(() => stepComplete.value[currentStep.value]);

const steps = computed(() =>
  stepIds.map((id, index) => ({
    id,
    label: stepLabels[id],
    status: (index === stepIndex.value
      ? 'current'
      : index < stepIndex.value && stepComplete.value[id]
        ? 'done'
        : 'pending') as 'current' | 'done' | 'pending',
  })),
);

const summaryNames = computed(() =>
  activeMembers.value
    .map((member) => member.name.trim())
    .filter(Boolean)
    .join(' y '),
);
const summaryAges = computed(() =>
  activeMembers.value
    .map((member) => {
      const age = member.birth_date ? ageAtDate(member.birth_date, targetDate.value) : null;
      return age == null ? null : `${member.name.trim()} tendrá ${age} años`;
    })
    .filter(Boolean)
    .join(' y '),
);

function emptyMember(): MemberDraft {
  return {
    name: '',
    birth_date: '',
    estimated_monthly_pension_today_eur: '',
    other_future_income_today_eur: '',
  };
}

function toDraft(member: PlanMember): MemberDraft {
  return {
    id: member.id,
    name: member.name,
    birth_date: member.birth_date ?? '',
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
    estimated_monthly_pension_today_eur: member.estimated_monthly_pension_today_eur || null,
    other_future_income_today_eur: member.other_future_income_today_eur || null,
  };
}

function syncFromPlan(current: typeof plan.value): void {
  if (!current) return;
  form.household_type = current.household_type;
  form.monthly_income = current.target_monthly_income_today_eur;
  form.wants_legacy = Number(current.preservation_target_eur ?? 0) > 0;
  form.legacy_amount = current.preservation_target_eur ?? '';
  form.profile = current.profile;
  members.splice(
    0,
    members.length,
    ...(current.members.length ? current.members.map(toDraft) : [emptyMember()]),
  );

  // Las edades son la entrada real del usuario; el plan guardado solo tiene fechas,
  // asi que las reconstruimos desde el nacimiento del adulto ancla.
  const birth = current.members[0]?.birth_date ?? '';
  if (!birth) return;
  form.independence_age = ageAtDate(birth, current.target_date) ?? DEFAULT_INDEPENDENCE_AGE;
  form.longevity_age = ageAtDate(birth, current.projection_end_date) ?? DEFAULT_LONGEVITY_AGE;
}

function selectHousehold(value: HouseholdType): void {
  form.household_type = value;
  if (value === 'family' && members.length < 2) members.push(emptyMember());
}

function goTo(index: number): void {
  if (index < 0 || index >= stepIds.length || index > furthestIndex.value) return;
  stepIndex.value = index;
}

function goToId(id: string): void {
  goTo(stepIds.indexOf(id as StepId));
}

function next(): void {
  if (!canAdvance.value || isLastStep.value) return;
  stepIndex.value += 1;
  furthestIndex.value = Math.max(furthestIndex.value, stepIndex.value);
}

async function submit(): Promise<void> {
  if (submitting.value) return;
  submitting.value = true;
  store.clearError();
  try {
    const savedMembers = [];
    for (const member of activeMembers.value) {
      savedMembers.push(await store.saveMember({ id: member.id, ...toPayload(member) }));
    }
    await store.savePlan({
      household_type: form.household_type,
      target_date: targetDate.value,
      target_monthly_income_today_eur: form.monthly_income,
      projection_end_date: projectionEndDate.value,
      preservation_target_eur: form.wants_legacy ? form.legacy_amount : null,
      preserved_asset_ids: null,
      profile: form.profile,
      member_ids: savedMembers.map((member) => member.id),
    });
    await store.recalculate();
    await router.push('/plan');
  } catch {
    // saveMember/savePlan ya dejan store.error con el detalle; garantizamos un
    // mensaje si el fallo no lo trajo y no navegamos con el guardado a medias.
    if (!store.error) {
      store.error = 'No se pudo guardar el plan. Revisa los datos e inténtalo de nuevo.';
    }
  } finally {
    submitting.value = false;
  }
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
  void store.fetchFoundations();
});
</script>

<template>
  <main class="page plan-page plan-setup-page">
    <APageHead title="Tu plan en seis preguntas" eyebrow="Mi Plan">
      <template #meta>
        <span>Todo en euros de hoy</span><span class="dot"></span
        ><span>Puedes cambiarlo cuando quieras</span>
      </template>
    </APageHead>

    <AState v-if="loading && !plan" status="loading">Cargando tu plan...</AState>
    <AState v-if="error" status="error">{{ error }}</AState>

    <AStepper :steps="steps" :active-id="currentStep" @change="goToId" />

    <section v-if="currentStep === 'household'" class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Pregunta 1</p>
          <h2 class="sect-title">¿Quién forma parte de este plan?</h2>
          <p class="sect-sub">
            Vuestras finanzas se consolidan en una sola unidad. Con la fecha de nacimiento podemos
            hablar de edades en lugar de fechas.
          </p>
        </div>
      </div>

      <div class="plan-choice-grid">
        <button
          type="button"
          class="plan-choice"
          :class="{ 'is-on': form.household_type === 'single' }"
          :aria-pressed="form.household_type === 'single'"
          @click="selectHousehold('single')"
        >
          <strong>Yo solo</strong>
          <small>Un adulto.</small>
        </button>
        <button
          type="button"
          class="plan-choice"
          :class="{ 'is-on': form.household_type === 'family' }"
          :aria-pressed="form.household_type === 'family'"
          @click="selectHousehold('family')"
        >
          <strong>Somos dos</strong>
          <small>Pareja o familia con dos adultos.</small>
        </button>
      </div>

      <div class="plan-members">
        <article v-for="(member, index) in activeMembers" :key="member.id ?? index">
          <div class="plan-form-grid">
            <label>
              <span>{{ index === 0 ? 'Tu nombre' : 'Nombre del segundo adulto' }}</span>
              <input v-model="member.name" class="input" type="text" autocomplete="name" />
            </label>
            <label>
              <span>Fecha de nacimiento</span>
              <input v-model="member.birth_date" class="input" type="date" />
            </label>
          </div>
        </article>
      </div>
    </section>

    <section v-else-if="currentStep === 'horizon'" class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Pregunta 2</p>
          <h2 class="sect-title">¿A qué edad quieres dejar de depender de tu trabajo?</h2>
          <p class="sect-sub">
            Es el momento en el que tu capital debería poder pagar tu vida sin que tengas que
            trabajar por obligación.
          </p>
        </div>
      </div>

      <div class="plan-choice-grid">
        <button
          v-for="age in [50, 55, 60, 65]"
          :key="age"
          type="button"
          class="plan-choice plan-choice-sm"
          :class="{ 'is-on': form.independence_age === age }"
          :aria-pressed="form.independence_age === age"
          @click="form.independence_age = age"
        >
          <strong>{{ age }} años</strong>
        </button>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>O una edad concreta</span>
          <input
            v-model.number="form.independence_age"
            class="input"
            type="number"
            min="30"
            max="90"
          />
        </label>
        <p v-if="targetDate" class="plan-derived-field">
          <span>Sería en</span>
          <strong>{{ formatLongMonthYear(targetDate) }}</strong>
          <small v-if="yearsToTarget !== null">Dentro de {{ yearsToTarget }} años.</small>
        </p>
      </div>

      <div class="sect-head plan-subquestion">
        <div>
          <h2 class="sect-title">¿Hasta qué edad debe durarte el dinero?</h2>
          <p class="sect-sub">
            Hasta aquí llega la proyección. Si te quedas corto, el plan parecerá más fácil de lo que
            es.
          </p>
        </div>
      </div>

      <div class="plan-choice-grid">
        <button
          v-for="age in [85, 90, 95, 100]"
          :key="age"
          type="button"
          class="plan-choice plan-choice-sm"
          :class="{ 'is-on': form.longevity_age === age }"
          :aria-pressed="form.longevity_age === age"
          @click="form.longevity_age = age"
        >
          <strong>{{ age }} años</strong>
        </button>
      </div>

      <div class="plan-form-grid">
        <label>
          <span>O una edad concreta</span>
          <input
            v-model.number="form.longevity_age"
            class="input"
            type="number"
            min="40"
            max="110"
          />
        </label>
        <p v-if="projectionEndDate" class="plan-derived-field">
          <span>Proyectamos hasta</span>
          <strong>{{ formatLongMonthYear(projectionEndDate) }}</strong>
        </p>
      </div>

      <p v-if="form.longevity_age <= form.independence_age" class="plan-field-error">
        El dinero tiene que durar más allá de la edad en la que dejas de trabajar.
      </p>
    </section>

    <section v-else-if="currentStep === 'lifestyle'" class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Pregunta 3</p>
          <h2 class="sect-title">¿Con cuánto quieres vivir cada mes?</h2>
          <p class="sect-sub">
            En euros de hoy: nosotros aplicamos la inflación. Cuenta tu vida cotidiana, no la compra
            de una casa ni una inversión.
          </p>
        </div>
      </div>

      <div v-if="lifestyleChoices.length" class="plan-choice-grid">
        <button
          v-for="choice in lifestyleChoices"
          :key="choice.label"
          type="button"
          class="plan-choice"
          :class="{ 'is-on': Number(form.monthly_income) === choice.amount }"
          :aria-pressed="Number(form.monthly_income) === choice.amount"
          @click="form.monthly_income = String(choice.amount)"
        >
          <strong>{{ formatMoney(choice.amount) }}/mes</strong>
          <small>{{ choice.label }} · {{ choice.hint }}</small>
        </button>
      </div>
      <AState v-else status="empty" layout="inline">
        Aún no podemos calcular tu gasto actual, así que escribe la cifra que tengas en mente.
      </AState>

      <div class="plan-form-grid">
        <label>
          <span>O la cifra que prefieras</span>
          <div class="plan-money-field">
            <input
              v-model="form.monthly_income"
              class="input"
              type="number"
              inputmode="decimal"
              min="0"
              step="50"
            />
            <span aria-hidden="true">€/mes</span>
          </div>
        </label>
      </div>
    </section>

    <section v-else-if="currentStep === 'future'" class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Pregunta 4</p>
          <h2 class="sect-title">¿Con qué ingresos contarás cuando te jubiles?</h2>
          <p class="sect-sub">
            Todo lo que entre por su cuenta reduce lo que tu capital tiene que sostener. Si no lo
            sabes, déjalo vacío: el plan será más conservador.
          </p>
        </div>
      </div>

      <div class="plan-members">
        <article v-for="(member, index) in activeMembers" :key="member.id ?? index">
          <div class="plan-member-head">
            <strong>{{ member.name.trim() || `Adulto ${index + 1}` }}</strong>
            <span v-if="member.birth_date" class="plan-member-meta">
              Se jubila a los {{ LEGAL_RETIREMENT_AGE }} en
              {{ formatLongMonthYear(dateAtAge(member.birth_date, LEGAL_RETIREMENT_AGE)) }}
            </span>
          </div>
          <div class="plan-form-grid">
            <label>
              <span>Pensión pública estimada (al mes)</span>
              <div class="plan-money-field">
                <input
                  v-model="member.estimated_monthly_pension_today_eur"
                  class="input"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  step="50"
                />
                <span aria-hidden="true">€/mes</span>
              </div>
            </label>
            <label>
              <span>Otros ingresos futuros (al mes)</span>
              <div class="plan-money-field">
                <input
                  v-model="member.other_future_income_today_eur"
                  class="input"
                  type="number"
                  inputmode="decimal"
                  min="0"
                  step="50"
                />
                <span aria-hidden="true">€/mes</span>
              </div>
            </label>
          </div>
        </article>
      </div>

      <div class="sect-head plan-subquestion">
        <div>
          <h2 class="sect-title">¿Quieres dejar patrimonio al final del camino?</h2>
          <p class="sect-sub">
            Si dices que sí, el plan no dará por bueno un futuro en el que el dinero llegue justo.
          </p>
        </div>
      </div>

      <div class="plan-choice-grid">
        <button
          type="button"
          class="plan-choice"
          :class="{ 'is-on': !form.wants_legacy }"
          :aria-pressed="!form.wants_legacy"
          @click="form.wants_legacy = false"
        >
          <strong>No hace falta</strong>
          <small>Me vale con que el dinero me dure.</small>
        </button>
        <button
          type="button"
          class="plan-choice"
          :class="{ 'is-on': form.wants_legacy }"
          :aria-pressed="form.wants_legacy"
          @click="form.wants_legacy = true"
        >
          <strong>Sí, quiero preservar</strong>
          <small>Un patrimonio mínimo que no debe tocarse.</small>
        </button>
      </div>

      <div v-if="form.wants_legacy" class="plan-form-grid">
        <label>
          <span>Patrimonio mínimo a preservar</span>
          <div class="plan-money-field">
            <input
              v-model="form.legacy_amount"
              class="input"
              type="number"
              inputmode="decimal"
              min="0"
              step="1000"
            />
            <span aria-hidden="true">€</span>
          </div>
        </label>
      </div>
    </section>

    <section v-else-if="currentStep === 'profile'" class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Pregunta 5</p>
          <h2 class="sect-title">Tus inversiones caen un 30% este año. ¿Qué haces?</h2>
          <p class="sect-sub">
            No hay respuesta correcta. Nos dice cuánto riesgo puedes sostener sin abandonar el plan.
          </p>
        </div>
      </div>

      <div class="plan-choice-grid plan-choice-grid-stack">
        <button
          v-for="choice in profileChoices"
          :key="choice.value"
          type="button"
          class="plan-choice"
          :class="{ 'is-on': form.profile === choice.value }"
          :aria-pressed="form.profile === choice.value"
          @click="form.profile = choice.value"
        >
          <strong>{{ choice.label }}</strong>
          <small>{{ choice.hint }}</small>
        </button>
      </div>
    </section>

    <section v-else class="sect plan-form-section">
      <div class="sect-head">
        <div>
          <p class="eyebrow">Tu plan</p>
          <h2 class="sect-title">Esto es lo que vamos a calcular</h2>
          <p class="sect-sub">Repásalo. Cualquier respuesta se puede cambiar volviendo atrás.</p>
        </div>
      </div>

      <p class="plan-summary">
        <template v-if="summaryNames">{{ summaryNames }}.</template>
        Quieres dejar de depender de tu trabajo a los
        <strong>{{ form.independence_age }} años</strong>
        <template v-if="targetDate">
          ({{ formatLongMonthYear(targetDate)
          }}<template v-if="yearsToTarget !== null">, dentro de {{ yearsToTarget }} años</template
          >)</template
        >, viviendo con <strong>{{ formatMoney(form.monthly_income) }} al mes</strong> en euros de
        hoy, y que el dinero te dure hasta los <strong>{{ form.longevity_age }} años</strong>.
        <template v-if="form.wants_legacy && Number(form.legacy_amount) > 0">
          Además quieres preservar {{ formatMoney(form.legacy_amount) }} de patrimonio.
        </template>
        <template v-else> No necesitas dejar patrimonio al final. </template>
        <template v-if="summaryAges && activeMembers.length > 1">
          En la fecha objetivo, {{ summaryAges }}.
        </template>
      </p>

      <dl class="plan-summary-facts">
        <div>
          <dt>Fecha objetivo</dt>
          <dd class="mono">{{ targetDate ? formatLongMonthYear(targetDate) : '—' }}</dd>
        </div>
        <div>
          <dt>Fin de proyección</dt>
          <dd class="mono">
            {{ projectionEndDate ? formatLongMonthYear(projectionEndDate) : '—' }}
          </dd>
        </div>
        <div>
          <dt>Nivel de vida</dt>
          <dd class="mono">{{ formatMoney(form.monthly_income) }}/mes</dd>
        </div>
        <div>
          <dt>Perfil</dt>
          <dd>{{ profileChoices.find((item) => item.value === form.profile)?.label }}</dd>
        </div>
      </dl>
    </section>

    <div class="plan-setup-actions">
      <AButton v-if="stepIndex > 0" variant="ghost" @click="goTo(stepIndex - 1)">Atrás</AButton>
      <RouterLink v-else class="btn btn-ghost" to="/plan">Cancelar</RouterLink>
      <AButton v-if="!isLastStep" variant="primary" :disabled="!canAdvance" @click="next">
        Continuar
      </AButton>
      <AButton v-else variant="primary" :loading="submitting" @click="submit">
        Guardar y calcular
      </AButton>
    </div>
  </main>
</template>
