/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PlanEventsTimeline from '@/domains/plan/components/PlanEventsTimeline.vue';
import type { PlanEvent, PlanEventCloseResponse } from '@/domains/plan/types';

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
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('PlanEventsTimeline', () => {
  it('requires inline confirmation before closing an event', async () => {
    const closeEvent = vi.fn().mockResolvedValue({
      event: { ...event, effective_end_date: '2030-07-01' },
      projection: {},
      budget_changes: { changed: [{}], deleted: [{}, {}] },
    } as unknown as PlanEventCloseResponse);
    const wrapper = mount(PlanEventsTimeline, {
      props: { events: [event], closeEvent },
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
});
