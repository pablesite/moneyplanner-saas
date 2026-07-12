/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PlanEventsTimeline from '@/domains/plan/components/PlanEventsTimeline.vue';
import type {
  PlanEvent,
  PlanEventCloseResponse,
  PlanEventMaterializeResponse,
} from '@/domains/plan/types';

const event: PlanEvent = {
  id: 1,
  source_scenario: 2,
  name: 'Coche Ana',
  event_type: 'vehicle',
  planned_date: '2027-06-01',
  actual_date: null,
  effective_end_date: null,
  status: 'planned',
  planned_impact_json: {},
  actual_impact_json: {},
  linked_asset_ids: [],
  linked_liability_ids: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

/** Dar de baja solo aplica a lo que ya ocurrió: una previsión se materializa o se cancela. */
const occurred: PlanEvent = { ...event, status: 'occurred', actual_date: '2027-06-01' };

describe('PlanEventsTimeline', () => {
  it('requires inline confirmation before closing an event', async () => {
    const closeEvent = vi.fn().mockResolvedValue({
      event: { ...occurred, effective_end_date: '2030-07-01' },
      projection: {},
      budget_changes: { changed: [{}], deleted: [{}, {}] },
    } as unknown as PlanEventCloseResponse);
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [occurred], closeEvent },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    });

    await wrapper.get('button').trigger('click');
    expect(wrapper.text()).toContain('El histórico se conserva');
    expect(closeEvent).not.toHaveBeenCalled();

    await wrapper.get('input[type="date"]').setValue('2030-07-01');
    const confirm = wrapper.findAll('button').find((button) => button.text() === 'Confirmar baja');
    await confirm!.trigger('click');

    expect(closeEvent).toHaveBeenCalledWith(1, {
      effective_date: '2030-07-01',
      note: undefined,
    });
    expect(wrapper.text()).toContain('1 partida ajustada y 2 retiradas');
  });

  it('shows closed status and removes the destructive action', () => {
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [{ ...event, effective_end_date: '2030-07-01' }] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    });

    expect(wrapper.text()).toContain('Cerrado el');
    expect(wrapper.text()).not.toContain('Dar de baja');
  });

  it('only offers to undo events registered retrospectively, and confirms first', async () => {
    const releaseEvent = vi.fn().mockResolvedValue(undefined);
    const registered: PlanEvent = {
      ...event,
      id: 9,
      status: 'occurred',
      actual_impact_json: { registration: { adopted_lines: [{ id: 7 }] } },
    };
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [event, registered], releaseEvent },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    });

    const undo = wrapper
      .findAll('button')
      .filter((button) => button.text() === 'Deshacer registro');
    expect(undo).toHaveLength(1);

    await undo[0]!.trigger('click');
    expect(releaseEvent).not.toHaveBeenCalled();

    const confirm = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Confirmar deshacer');
    await confirm!.trigger('click');

    expect(releaseEvent).toHaveBeenCalledWith(9);
    expect(wrapper.text()).toContain('Registro deshecho');
  });

  it('offers a forecast the two ways out of a forecast: happen or be cancelled', async () => {
    const materializeEvent = vi.fn().mockResolvedValue({
      event: { ...event, status: 'occurred' },
      projection: {},
      created_assets: [{ id: 1, name: 'Coche Ana' }],
      created_liabilities: [{ id: 2, name: 'Coche Ana' }],
      budget_lines_dropped: [{}],
      budget_lines_released: [{}, {}],
    } as unknown as PlanEventMaterializeResponse);
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [event], materializeEvent, cancelEvent: vi.fn(), closeEvent: vi.fn() },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    });

    const labels = wrapper.findAll('button').map((button) => button.text());
    expect(labels).toContain('Ya ha ocurrido');
    expect(labels).toContain('Cancelar previsión');
    // Dar de baja retira efectos de algo real: no aplica a lo que aún no ha pasado.
    expect(labels).not.toContain('Dar de baja');

    await wrapper.findAll('button')[0]!.trigger('click');
    await wrapper.get('input[type="date"]').setValue('2027-06-15');
    const confirm = wrapper.findAll('button').find((button) => button.text() === 'Confirmar');
    await confirm!.trigger('click');

    expect(materializeEvent).toHaveBeenCalledWith(1, {
      actual_date: '2027-06-15',
      note: undefined,
    });
    expect(wrapper.text()).toContain('Creado en Patrimonio: Coche Ana, Coche Ana');
  });

  it('asks for confirmation before cancelling a forecast', async () => {
    const cancelEvent = vi
      .fn()
      .mockResolvedValue({ budget_lines_deleted: [{}, {}], projection: {} });
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [event], cancelEvent },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    });

    await wrapper.get('button').trigger('click');
    expect(cancelEvent).not.toHaveBeenCalled();

    await wrapper.get('button').trigger('click');

    expect(cancelEvent).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain('2 partidas futuras eliminadas');
  });
});
