import { expect, test } from '@playwright/test';

const username = process.env.E2E_USERNAME || 'admin';
const password = process.env.E2E_PASSWORD || 'admin';
const realApiEnabled = process.env.E2E_REAL_API === '1';

test.skip(!realApiEnabled, 'Enable real API flow with E2E_REAL_API=1.');

test('real api: login redirects to net worth page', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[autocomplete="username"]').fill(username);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Patrimonio' })).toBeVisible();
});

test('real api: can navigate from net worth to people page', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input[autocomplete="username"]').fill(username);
  await page.locator('input[autocomplete="current-password"]').fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.getByRole('button', { name: 'Personas' }).click();
  await expect(page).toHaveURL(/\/people$/);
  await expect(page.getByRole('heading', { name: 'Personas' })).toBeVisible();
});
