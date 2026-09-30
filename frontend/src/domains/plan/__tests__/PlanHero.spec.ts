/** @vitest-environment jsdom */
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PlanHero from '@/domains/plan/components/PlanHero.vue';
import type { FinancialPlan, PlanOverview } from '@/domains/plan/types';
import { makeProjection } from './planFixtures';

const plan = {
  target_monthly_income_today_eur: '3000.00',
  members: [
    { name: 'Ana', birth_date: '1988-01-01' },
    { name: 'Pablo', birth_date: '1984-01-01' },
  ],
} as unknown as FinancialPlan;

const overview = {
  status: 'off_track',
  desired_year: 2038,
  sustainable_year: 2041,
  gap_years: 3,
  sustainable_range: {
    favorable_year: 2040,
    central_year: 2041,
    prudent_year: 2042,
  },
} as unknown as PlanOverview;

describe('PlanHero', () => {
  it('shows the readiness close while explaining retirement starts the following year', () => {
    const wrapper = mount(PlanHero, {
      props: { plan, overview, projection: makeProjection() },
    });

    expect(wrapper.find('.plan-hero-date').text()).toBe('2040');
    // Las edades acompañan a la fecha en una línea propia, no dentro del titular.
    expect(wrapper.find('.plan-hero-ages').text()).toBe('Ana 52 años · Pablo 56 años');
    expect(wrapper.find('.plan-delta-main').text()).toContain(
      '3 años más tarde que el cierre objetivo de 2037',
    );
    expect(wrapper.find('.plan-delta-main').text()).toContain('podrías dejar de trabajar en 2041');
  });

  it('names the month the capital is ready when the engine provides it', () => {
    const wrapper = mount(PlanHero, {
      props: {
        plan,
        overview: { ...overview, sustainable_readiness_month: 10 },
        projection: makeProjection(),
      },
    });

    expect(wrapper.find('.plan-hero-date').text()).toBe('Octubre de 2040');
    expect(wrapper.find('.plan-delta-main').text()).toContain(
      'podrías dejar de trabajar desde noviembre de 2040',
    );
  });

  it('starts retirement in January when the capital is ready in December', () => {
    const wrapper = mount(PlanHero, {
      props: {
        plan,
        overview: { ...overview, sustainable_readiness_month: 12 },
        projection: makeProjection(),
      },
    });

    expect(wrapper.find('.plan-hero-date').text()).toBe('Diciembre de 2040');
    expect(wrapper.find('.plan-delta-main').text()).toContain(
      'podrías dejar de trabajar desde enero de 2041',
    );
  });
});
