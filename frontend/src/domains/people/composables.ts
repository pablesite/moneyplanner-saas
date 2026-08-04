import { computed, reactive, ref } from 'vue';
import { usePeopleStore } from '@/domains/people/store';
import { peopleApi } from '@/domains/people/api';
import type {
  FamilyMember,
  OwnershipAllocationBasis,
  OwnershipAllocationPreview,
  OwnershipIncomeRule,
  OwnershipRead,
} from '@/domains/people/types';

type MemberRole = 'adult' | 'child';

export function usePeopleMembers() {
  const store = usePeopleStore();

  const form = reactive({
    name: '',
    role: 'adult' as MemberRole,
  });

  const saving = ref(false);
  const rowBusy = ref<Record<number, boolean>>({});
  const createOpen = ref(false);
  const successMessage = ref<string | null>(null);

  const editOpen = ref(false);
  const editForm = reactive({
    id: null as number | null,
    name: '',
    role: 'adult' as MemberRole,
  });

  const prettyError = computed(() => store.error);

  const membersSorted = computed(() => {
    const arr = [...store.members];
    arr.sort((a, b) => {
      if (a.role !== b.role) return a.role === 'adult' ? -1 : 1;
      if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return arr;
  });

  async function ensureLoaded() {
    if (!store.members.length) await store.fetchMembers();
  }

  async function refreshMembers() {
    await store.fetchMembers();
  }

  function openCreate() {
    store.clearError();
    successMessage.value = null;
    form.name = '';
    form.role = 'adult';
    createOpen.value = true;
  }

  function closeCreate() {
    createOpen.value = false;
  }

  async function submit() {
    const name = form.name.trim();
    if (!name) return;

    saving.value = true;
    store.clearError();
    successMessage.value = null;

    try {
      await store.createMember({ name, role: form.role });
      form.name = '';
      form.role = 'adult';
      createOpen.value = false;
      successMessage.value = 'Miembro creado correctamente.';
    } finally {
      saving.value = false;
    }
  }

  async function withRowBusy(id: number, fn: () => Promise<void>) {
    if (rowBusy.value[id]) return;
    rowBusy.value[id] = true;
    store.clearError();
    successMessage.value = null;
    try {
      await fn();
    } finally {
      rowBusy.value[id] = false;
    }
  }

  async function toggleActive(id: number, next: boolean) {
    await withRowBusy(id, async () => {
      await store.updateMember(id, { is_active: next });
      successMessage.value = next
        ? 'Miembro activado correctamente.'
        : 'Miembro desactivado correctamente.';
    });
  }

  function openEdit(member: FamilyMember) {
    store.clearError();
    successMessage.value = null;
    editForm.id = member.id;
    editForm.name = member.name;
    editForm.role = member.role;
    editOpen.value = true;
  }

  function closeEdit() {
    editOpen.value = false;
  }

  async function saveEdit() {
    if (editForm.id == null) return;
    const name = editForm.name.trim();
    if (!name) return;

    await withRowBusy(editForm.id, async () => {
      await store.updateMember(editForm.id!, { name, role: editForm.role });
      editOpen.value = false;
      successMessage.value = 'Miembro actualizado correctamente.';
    });
  }

  async function removeMember(member: FamilyMember) {
    const ok = window.confirm(`¿Eliminar a "${member.name}"?\n\nSolo se podrá si no está en uso.`);
    if (!ok) return;
    await withRowBusy(member.id, async () => {
      await store.deleteMember(member.id);
      successMessage.value = 'Miembro eliminado correctamente.';
    });
  }

  return {
    store,
    form,
    saving,
    rowBusy,
    createOpen,
    successMessage,
    editOpen,
    editForm,
    prettyError,
    membersSorted,
    ensureLoaded,
    refreshMembers,
    openCreate,
    closeCreate,
    submit,
    toggleActive,
    openEdit,
    closeEdit,
    saveEdit,
    removeMember,
  };
}

export function usePeopleOwnerships() {
  const store = usePeopleStore();

  const showModal = ref(false);
  const editId = ref<number | null>(null);
  const successMessage = ref<string | null>(null);
  const allocationPreview = ref<OwnershipAllocationPreview | null>(null);
  const previewLoading = ref(false);
  const dynamicAllocationPreviews = ref<Record<number, OwnershipAllocationPreview>>({});

  const form = reactive({
    memberIds: [] as number[],
    percents: {} as Record<number, string>,
    allocationBasis: 'explicit_split' as OwnershipAllocationBasis,
    incomeRules: [{ category_key: 'salary', subcategory_key: '' }] as OwnershipIncomeRule[],
  });

  const adults = computed(() => store.activeAdults);

  const canCreate = computed(() => {
    if (form.memberIds.length < 2) return false;

    if (form.allocationBasis === 'recurring_income_12m') return true;
    for (const id of form.memberIds) {
      const p = Number(String(form.percents[id] ?? '').replace(',', '.'));
      if (!Number.isFinite(p) || p <= 0 || p > 100) return false;
    }

    const total = form.memberIds.reduce((acc, id) => {
      const p = Number(String(form.percents[id] ?? '0').replace(',', '.'));
      return acc + (Number.isFinite(p) ? p : 0);
    }, 0);

    return Math.abs(total - 100) < 0.0001;
  });

  const ownershipsSorted = computed(() => {
    const arr = [...store.ownerships].filter((ownership) => ownership.kind === 'shared');
    arr.sort((a, b) => a.id - b.id);
    return arr;
  });

  async function ensureLoaded() {
    if (!store.ownerships.length) await store.fetchOwnerships();
    if (!store.members.length) await store.fetchMembers();
    await refreshDynamicAllocationPreviews();
  }

  async function refreshOwnerships() {
    await store.fetchOwnerships();
    await refreshDynamicAllocationPreviews();
  }

  async function refreshDynamicAllocationPreviews() {
    const dynamicOwnerships = ownershipsSorted.value.filter(
      (ownership) => ownership.allocation_basis === 'recurring_income_12m',
    );
    if (!dynamicOwnerships.length) {
      dynamicAllocationPreviews.value = {};
      return;
    }

    const now = new Date();
    const previews = await Promise.all(
      dynamicOwnerships.map(async (ownership) => {
        try {
          const { data } = await peopleApi.getAllocationPreview(
            ownership.id,
            now.getFullYear(),
            now.getMonth() + 1,
          );
          return [ownership.id, data] as const;
        } catch {
          return null;
        }
      }),
    );
    dynamicAllocationPreviews.value = Object.fromEntries(
      previews.filter(
        (preview): preview is readonly [number, OwnershipAllocationPreview] => preview != null,
      ),
    );
  }

  function resetModal() {
    showModal.value = false;
    form.memberIds = [];
    form.percents = {};
    form.allocationBasis = 'explicit_split';
    form.incomeRules = [{ category_key: 'salary', subcategory_key: '' }];
    editId.value = null;
    allocationPreview.value = null;
  }

  function openCreate() {
    successMessage.value = null;
    editId.value = null;
    form.memberIds = [];
    form.percents = {};
    form.allocationBasis = 'explicit_split';
    form.incomeRules = [{ category_key: 'salary', subcategory_key: '' }];
    allocationPreview.value = null;
    showModal.value = true;
  }

  function openEdit(ownership: OwnershipRead) {
    if (ownership.kind !== 'shared') return;
    successMessage.value = null;
    editId.value = ownership.id;
    form.memberIds = (ownership.splits ?? [])
      .map((split) => split.member?.id)
      .filter((id): id is number => id != null);
    form.percents = {};
    (ownership.splits ?? []).forEach((split) => {
      if (split.member?.id != null) form.percents[split.member.id] = String(split.percent ?? '');
    });
    form.allocationBasis = ownership.allocation_basis ?? 'explicit_split';
    form.incomeRules = ownership.income_rules?.length
      ? ownership.income_rules.map((rule) => ({ ...rule }))
      : [{ category_key: 'salary', subcategory_key: '' }];
    allocationPreview.value = null;
    showModal.value = true;
    if (form.allocationBasis === 'recurring_income_12m') void refreshAllocationPreview();
  }

  function toggleMember(id: number) {
    const idx = form.memberIds.indexOf(id);
    if (idx >= 0) {
      form.memberIds.splice(idx, 1);
      delete form.percents[id];
    } else {
      form.memberIds.push(id);
      form.percents[id] = form.percents[id] ?? '';
    }
  }

  function setEqualSplit() {
    if (form.memberIds.length < 2) return;
    const each = (100 / form.memberIds.length).toFixed(2);
    for (const id of form.memberIds) form.percents[id] = each;

    const sum = (form.memberIds.length - 1) * Number(each);
    const last = (100 - sum).toFixed(2);
    const lastMemberId = form.memberIds[form.memberIds.length - 1];
    if (lastMemberId == null) return;
    form.percents[lastMemberId] = last;
  }

  async function submit() {
    if (!canCreate.value) return;
    successMessage.value = null;

    if (form.allocationBasis === 'recurring_income_12m') setEqualSplit();

    const splits = form.memberIds.map((id) => ({
      member_id: id,
      percent: String(form.percents[id]).replace(',', '.'),
    }));

    if (editId.value != null) {
      const isInUse = store.ownerships.find(
        (ownership) => ownership.id === editId.value,
      )?.is_in_use;
      await store.updateSharedOwnership(editId.value, {
        ...(!isInUse && form.allocationBasis === 'explicit_split' ? { splits } : {}),
        allocation_basis: form.allocationBasis,
        income_rules: form.allocationBasis === 'recurring_income_12m' ? form.incomeRules : [],
      });
      successMessage.value = 'Titularidad compartida actualizada correctamente.';
      if (form.allocationBasis === 'recurring_income_12m') {
        await Promise.all([refreshAllocationPreview(), refreshDynamicAllocationPreviews()]);
        return;
      }
    } else {
      await store.createSharedOwnership({
        splits,
        allocation_basis: form.allocationBasis,
        income_rules: form.allocationBasis === 'recurring_income_12m' ? form.incomeRules : [],
      });
      successMessage.value = 'Titularidad compartida creada correctamente.';
    }

    await refreshDynamicAllocationPreviews();
    resetModal();
  }

  function setIncomeRule(rule: OwnershipIncomeRule, enabled: boolean) {
    const key = `${rule.category_key}:${rule.subcategory_key}`;
    form.incomeRules = enabled
      ? [
          ...form.incomeRules.filter(
            (item) => `${item.category_key}:${item.subcategory_key}` !== key,
          ),
          rule,
        ]
      : form.incomeRules.filter((item) => `${item.category_key}:${item.subcategory_key}` !== key);
    allocationPreview.value = null;
  }

  function setAllocationBasis(value: OwnershipAllocationBasis) {
    form.allocationBasis = value;
    // A shared ownership needs at least two adults. With the usual two-person
    // household, select both when switching to the dynamic method so the form
    // cannot start in a state that can never be submitted.
    if (value === 'recurring_income_12m' && adults.value.length === 2) {
      for (const adult of adults.value) {
        if (!form.memberIds.includes(adult.id)) {
          form.memberIds.push(adult.id);
          form.percents[adult.id] = form.percents[adult.id] ?? '';
        }
      }
    }
    allocationPreview.value = null;
  }

  async function refreshAllocationPreview() {
    if (editId.value == null || form.allocationBasis !== 'recurring_income_12m') return;
    previewLoading.value = true;
    try {
      const now = new Date();
      const { data } = await peopleApi.getAllocationPreview(
        editId.value,
        now.getFullYear(),
        now.getMonth() + 1,
      );
      allocationPreview.value = data;
    } catch {
      allocationPreview.value = null;
    } finally {
      previewLoading.value = false;
    }
  }

  async function removeOwnership(id: number) {
    const ok = window.confirm('¿Eliminar esta titularidad compartida? (Solo si no está en uso)');
    if (!ok) return;
    successMessage.value = null;
    await store.deleteOwnership(id);
    successMessage.value = 'Titularidad compartida eliminada correctamente.';
  }

  return {
    store,
    showModal,
    editId,
    successMessage,
    allocationPreview,
    previewLoading,
    dynamicAllocationPreviews,
    form,
    adults,
    canCreate,
    ownershipsSorted,
    ensureLoaded,
    refreshOwnerships,
    refreshDynamicAllocationPreviews,
    resetModal,
    openCreate,
    openEdit,
    toggleMember,
    setEqualSplit,
    setIncomeRule,
    setAllocationBasis,
    refreshAllocationPreview,
    submit,
    removeOwnership,
  };
}
