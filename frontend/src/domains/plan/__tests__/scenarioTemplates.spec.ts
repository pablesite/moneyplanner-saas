/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import {
  assetFunctionLabel,
  defaultScenarioEvent,
  planEventStatusLabel,
  projectionScenarioLabel,
  scenarioStatusLabel,
  scenarioTemplateLabel,
  scenarioTemplates,
} from '@/domains/plan/scenarioTemplates';

describe('scenarioTemplates labels', () => {
  it('translates plan event status', () => {
    expect(planEventStatusLabel('planned')).toBe('Previsto');
    expect(planEventStatusLabel('occurred')).toBe('Ocurrido');
    expect(planEventStatusLabel('cancelled')).toBe('Cancelado');
  });

  it('translates scenario status and projection scenario', () => {
    expect(scenarioStatusLabel('accepted')).toBe('Incorporado');
    expect(scenarioStatusLabel('discarded')).toBe('Descartado');
    expect(projectionScenarioLabel('prudent')).toBe('Prudente');
    expect(projectionScenarioLabel('favorable')).toBe('Favorable');
  });

  it('maps every template to a label and asset-function to a label', () => {
    for (const template of scenarioTemplates) {
      expect(scenarioTemplateLabel(template.value)).toBe(template.label);
    }
    expect(assetFunctionLabel('productive')).toBe('Productivo');
    expect(assetFunctionLabel('unknown')).toBe('Sin clasificar');
  });
});

describe('defaultScenarioEvent', () => {
  it('starts on Jan 1st of next year and zeroes the money fields', () => {
    const event = defaultScenarioEvent('vehicle');
    const nextYear = new Date().getFullYear() + 1;
    expect(event.start_date).toBe(`${nextYear}-01-01`);
    expect(event.end_date).toBeNull();
    expect(event.initial_outflow).toBe('0.00');
    expect(event.monthly_expense_delta).toBe('0.00');
  });

  it('seeds the new-asset function from the template definition', () => {
    expect(defaultScenarioEvent('vehicle').new_asset_type).toBe('family_use');
    expect(defaultScenarioEvent('housing').new_asset_type).toBe('productive');
  });
});
