import { expect, test, type Page, type Route } from '@playwright/test';

const coverage = {
  value: 'complete',
  opening_positions: { covered: 1, total: 1 },
  closing_positions: { covered: 1, total: 1 },
  cash: 'complete',
  twr: 'exact',
  mwr: 'available',
  realized_pnl: 'complete',
  fx: 'complete',
};
const returns = {
  nominal: '0.10',
  real: '0.08',
  twr: '0.10',
  mwr_xirr: '0.11',
  method: 'twr',
  estimated: false,
};
const performance = {
  period: { from: '2025-01-01', to: '2025-12-31' },
  member_id: null,
  currency: 'EUR',
  opening_value: '10000',
  closing_value: '12000',
  covered_opening_value: '10000',
  covered_closing_value: '12000',
  net_contributed: '1000',
  monetary_result: '1000',
  gross_result: '1010',
  costs: '10',
  income: '50',
  realized_pnl: '100',
  unrealized_pnl: '900',
  return: returns,
  coverage,
  fx_issues: [],
  flows: [],
};

function json(route: Route, payload: unknown) {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  });
}

async function mockPortfolio(page: Page) {
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/token/') return json(route, { access: 'e2e-access' });
    if (path === '/api/auth/me/') {
      return json(route, {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        role: 'saas_member',
        must_change_password: false,
        subscription_status: 'trial',
        premium_enabled: true,
        account_link: null,
      });
    }
    if (path === '/api/family-members/') return json(route, []);
    if (path === '/api/portfolio/instruments/') {
      return json(route, [
        {
          id: 5,
          name: 'Fondo Global',
          asset_class: 'equity',
          instrument_type: 'fund',
          quote_currency: 'EUR',
        },
      ]);
    }
    if (path === '/api/portfolio/workspace/') {
      return json(route, {
        scope: null,
        cash: { value: '0' },
        overview: {
          period: performance.period,
          member_id: null,
          currency: 'EUR',
          value: '12000',
          covered_value: '12000',
          net_contributed: '1000',
          monetary_result: '1000',
          return: returns,
          coverage,
          position_count: 1,
          fresh_position_count: 1,
        },
        performance,
        positions: {
          period: performance.period,
          member_id: null,
          results: [
            {
              position_id: 3,
              instrument_id: 5,
              instrument_name: 'Fondo Global',
              container_id: 2,
              container_name: 'Broker familiar',
              status: 'active',
              tracking_style: 'units_based',
              native_value: '12000',
              native_currency: 'EUR',
              holding_currency: 'EUR',
              observed_on: '2025-12-31',
              asset_class: 'equity',
              class_breakdown: [],
              value_status: 'fresh',
              performance,
              attribution: {
                asset: '1000',
                fx: '0',
                total: '1000',
                method: 'closing_fx_residual',
              },
            },
          ],
        },
        timeline: {
          period: performance.period,
          member_id: null,
          currency: 'EUR',
          results: [
            {
              date: '2025-01-01',
              value: '10000',
              net_contributed: '0',
              contributed_to_date: '0',
              monetary_result: '0',
              coverage: 'complete',
            },
            {
              date: '2025-12-31',
              value: '12000',
              net_contributed: '1000',
              contributed_to_date: '1000',
              monetary_result: '1000',
              coverage: 'complete',
            },
          ],
        },
        quality: {
          period: performance.period,
          status: 'ready',
          positions: { total: 1, fresh: 1, stale: 0, missing: 0, at_cost: 0 },
          ownership_missing: 0,
          ownership_unattributed: 0,
          cash_ownership_missing: false,
          metric_coverage: coverage,
          fx_issues: [],
        },
      });
    }
    if (path === '/api/portfolio/overview/') {
      return json(route, {
        period: performance.period,
        member_id: null,
        currency: 'EUR',
        value: '12000',
        covered_value: '12000',
        net_contributed: '1000',
        monetary_result: '1000',
        return: returns,
        coverage,
        position_count: 1,
        fresh_position_count: 1,
      });
    }
    if (path === '/api/portfolio/performance/') return json(route, performance);
    if (path === '/api/portfolio/positions/performance/') {
      return json(route, {
        period: performance.period,
        member_id: null,
        results: [
          {
            position_id: 3,
            instrument_id: 5,
            instrument_name: 'Fondo Global',
            container_id: 2,
            container_name: 'Broker familiar',
            status: 'active',
            tracking_style: 'units_based',
            native_value: '12000',
            native_currency: 'EUR',
            observed_on: '2025-12-31',
            value_status: 'fresh',
            performance,
            attribution: {
              asset: '1000',
              fx: '0',
              total: '1000',
              method: 'closing_fx_residual',
            },
          },
        ],
      });
    }
    if (path === '/api/portfolio/timeline/') {
      return json(route, {
        period: performance.period,
        member_id: null,
        currency: 'EUR',
        results: [
          {
            date: '2025-01-01',
            value: '10000',
            net_contributed: '0',
            monetary_result: '0',
            coverage: 'complete',
          },
          {
            date: '2025-12-31',
            value: '12000',
            net_contributed: '1000',
            monetary_result: '1000',
            coverage: 'complete',
          },
        ],
      });
    }
    if (path === '/api/portfolio/quality/') {
      return json(route, {
        period: performance.period,
        status: 'ready',
        positions: { total: 1, fresh: 1, stale: 0, missing: 0 },
        ownership_missing: 0,
        cash_ownership_missing: false,
        metric_coverage: coverage,
        fx_issues: [],
      });
    }
    return json(route, {});
  });
}

async function loginAndOpenPortfolio(page: Page) {
  await page.goto('/login');
  await page.locator('input[autocomplete="username"]').fill('demo');
  await page.locator('input[autocomplete="current-password"]').fill('demo');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page
    .locator('button:visible')
    .filter({ hasText: /cartera/i })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Cartera' })).toBeVisible();
}

test.beforeEach(async ({ page }) => mockPortfolio(page));

test('portfolio workspace exposes summary, positions and evolution on desktop', async ({
  page,
}) => {
  await loginAndOpenPortfolio(page);

  await expect(page.getByText('12.000,00 €').first()).toBeVisible();
  await page.getByRole('button', { name: 'Posiciones', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Fondo Global' })).toBeVisible();
  await page.getByRole('button', { name: 'Evolución', exact: true }).click();
  await expect(page.getByRole('img', { name: /Evolución mensual/ })).toBeVisible();
});

test('portfolio stays within 360px and preserves the five mobile destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await loginAndOpenPortfolio(page);

  const portfolioTabs = page.locator('.a-pf-tabs-bar');
  await expect(portfolioTabs.getByRole('button')).toHaveCount(5);
  const tabOverflow = await portfolioTabs.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(tabOverflow.scrollWidth).toBeGreaterThan(tabOverflow.clientWidth);
  await page.getByRole('button', { name: 'Posiciones', exact: true }).click();
  await page.locator('.a-pf-position-list button').click();
  await expect(page.getByRole('dialog')).toContainText('Activo / divisa');
  await page.getByRole('button', { name: 'Cerrar modal' }).click();

  const mobileNav = page.locator('.ui-shell-bottom-nav');
  await expect(mobileNav.locator('.ui-shell-bottom-nav-item')).toHaveCount(5);
  const horizontalLayout = await page.evaluate(() => {
    window.scrollTo({ left: 200, top: window.scrollY });
    return {
      scrollX: window.scrollX,
      documentWidth: document.documentElement.scrollWidth,
    };
  });
  expect(horizontalLayout).toEqual({ scrollX: 0, documentWidth: 360 });
});
