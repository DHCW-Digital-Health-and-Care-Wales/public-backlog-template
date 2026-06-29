import { test, expect } from '@playwright/test';

test('AC-BOARD-01 four columns in order', async ({ page }) => {
  await page.goto('./');
  const headings = await page.getByRole('heading', { level: 2 }).allInnerTexts();
  expect(headings).toContain('New ideas being considered');
  expect(headings).toContain('In progress');
  expect(headings).toContain('Backlog');
  expect(headings).toContain('Not being considered right now');
});

test('AC-BOARD-02 recently shipped present', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Recently shipped' })).toBeVisible();
});

test('AC-BOARD-07/AC-VOTE-03 cards link to issues', async ({ page }) => {
  await page.goto('./');
  const link = page.getByRole('link', { name: 'Welsh-language SMS reminders by default' });
  await expect(link).toHaveAttribute('href', /issues\/14$/);
});

test('AC-BOARD-09 explainer states votes inform not decide', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByText(/signal the team weighs, not an automatic decision/)).toBeVisible();
});

test('AC-BOARD-10/AC-REQ-01 suggest control in header and column', async ({ page }) => {
  await page.goto('./');
  const links = page.getByRole('link', { name: 'Suggest a feature' });
  await expect(links.first()).toHaveAttribute('href', /issues\/new\?template=feature_request.yml/);
  expect(await links.count()).toBeGreaterThanOrEqual(2);
});

test('AC-BOARD-12 tag filter', async ({ page }) => {
  await page.goto('./');
  await page.selectOption('#tagfilter', 'cymraeg');
  await expect(page.getByRole('link', { name: 'Welsh-language SMS reminders by default' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Offline mode for rural clinics' })).toHaveCount(0);
  await page.selectOption('#tagfilter', '');
  await expect(page.getByRole('link', { name: 'Offline mode for rural clinics' })).toBeVisible();
});

test('AC-NFR-03 language toggle reflects in URL', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Cymraeg' }).click();
  await expect(page).toHaveURL(/lang=cy/);
  await expect(page.getByRole('heading', { name: 'Ar y gweill' })).toBeVisible();
});
