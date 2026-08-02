import { expect, test, type Page, type Route } from '@playwright/test';

function json(route: Route, payload: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  });
}

const scenarioEvent = {
  id: 11,
  start_date: '2027-06-01',
  end_date: null,
  initial_outflow: '12000.00',
  monthly_expense_delta: '180.00',
  monthly_income_delta: '0.00',
  monthly_contribution_delta: '0.00',
  new_asset_value: '28000.00',
  new_asset_type: 'family_use',
  new_debt_principal: '16000.00',
  new_debt_interest_rate: '0.045',
  new_debt_term_months: 60,
  metadata_json: {},
};

async function mockDecisionsApi(page: Page) {
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path === '/api/auth/refresh/' && request.method() === 'POST') {
      return json(route, { access: 'e2e-access' });
    }
    if (path === '/api/auth/me/') {
      return json(route, {
        id: 1,
        username: 'ana',
        email: 'ana@example.com',
        role: 'saas_member',
        must_change_password: false,
        subscription_status: 'active',
        premium_enabled: true,
        account_link: null,
      });
    }
    if (path === '/api/plan/') {
      return json(route, {
        id: 1,
        household_type: 'family',
        target_date: '2049-01-01',
        target_monthly_income_today_eur: '3000.00',
        projection_end_date: '2060-01-01',
        preservation_target_eur: null,
        preserved_asset_ids: [],
        profile: 'balanced',
        status: 'active',
        members: [],
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      });
    }
    if (path === '/api/plan/scenarios/') {
      return json(route, [
        {
          id: 1,
          name: 'Cambiar de coche',
          template_type: 'vehicle',
          status: 'draft',
          events: [scenarioEvent],
          created_at: '2026-01-01T00:00:00Z',
          accepted_at: null,
        },
        {
          id: 2,
          name: 'Reforma incorporada',
          template_type: 'renovation',
          status: 'accepted',
          events: [{ ...scenarioEvent, id: 12 }],
          created_at: '2026-01-01T00:00:00Z',
          accepted_at: '2026-02-01T00:00:00Z',
        },
        {
          id: 3,
          name: 'Excedencia descartada',
          template_type: 'sabbatical',
          status: 'discarded',
          events: [{ ...scenarioEvent, id: 13 }],
          created_at: '2026-01-01T00:00:00Z',
          accepted_at: null,
        },
      ]);
    }
    if (path === '/api/plan/events/') {
      return json(route, [
        {
          id: 21,
          source_scenario: 2,
          name: 'Reforma incorporada',
          event_type: 'renovation',
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
        },
      ]);
    }
    return json(route, {});
  });
}

test.beforeEach(async ({ page }) => {
  await mockDecisionsApi(page);
});

test('decisions separates pending work from incorporated events and starts in one click', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/plan/decisiones');

  await expect(page.getByRole('heading', { name: 'Decisiones', exact: true })).toBeVisible();
  await expect(page.getByText('Cambiar de coche', { exact: true })).toBeVisible();
  await expect(page.getByText('Reforma incorporada', { exact: true })).toHaveCount(1);
  await expect(page.getByText('Excedencia descartada', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: /Coche: Compra de vehículo/ }).click();
  await expect(page.getByRole('heading', { name: 'Cuéntanos cómo sería' })).toBeVisible();
  await expect(page.getByLabel('Nombre de la decisión')).toHaveValue('Coche');
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
});
