/** @vitest-environment jsdom */
import { computed, reactive, ref } from 'vue';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FamilyMemberManager from '../FamilyMemberManager.vue';

const mockUsePeopleMembers = vi.fn();

vi.mock('@/domains/people/composables', () => ({
  usePeopleMembers: () => mockUsePeopleMembers(),
}));

function makeState(overrides: Record<string, unknown> = {}) {
  return {
    store: { loading: false },
    form: reactive({ name: '', role: 'adult' }),
    saving: ref(false),
    rowBusy: ref<Record<number, boolean>>({}),
    createOpen: ref(false),
    successMessage: ref<string | null>(null),
    editOpen: ref(false),
    editForm: reactive({ id: null as number | null, name: '', role: 'adult' }),
    prettyError: computed(() => null),
    membersSorted: computed(() => []),
    ensureLoaded: vi.fn(async () => {}),
    refreshMembers: vi.fn(async () => {}),
    openCreate: vi.fn(),
    closeCreate: vi.fn(),
    submit: vi.fn(async () => {}),
    toggleActive: vi.fn(async () => {}),
    openEdit: vi.fn(),
    closeEdit: vi.fn(),
    saveEdit: vi.fn(async () => {}),
    memberPendingDelete: ref(null),
    askRemoveMember: vi.fn(),
    cancelRemoveMember: vi.fn(),
    confirmRemoveMember: vi.fn(async () => {}),
    ...overrides,
  };
}

describe('FamilyMemberManager', () => {
  beforeEach(() => {
    mockUsePeopleMembers.mockReset();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('shows empty and success states', () => {
    mockUsePeopleMembers.mockReturnValue(
      makeState({
        successMessage: ref('Miembro creado correctamente.'),
      }),
    );

    const wrapper = mount(FamilyMemberManager, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
        },
      },
    });

    expect(document.body.textContent).toContain('Miembro creado correctamente.');
    expect(wrapper.text()).toContain('No hay miembros');
  });

  it('carga al montar y abre el alta desde la cabecera de sección', async () => {
    const state = makeState();
    mockUsePeopleMembers.mockReturnValue(state);

    const wrapper = mount(FamilyMemberManager, {
      global: {
        stubs: {
          BaseModal: { template: '<div />' },
        },
      },
    });

    expect(state.ensureLoaded).toHaveBeenCalled();
    await wrapper.get('.sect-head button.btn').trigger('click');
    expect(state.openCreate).toHaveBeenCalled();
  });
});
