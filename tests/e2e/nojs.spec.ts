import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('AC-BOARD-08/AC-NFR-08 no-JS baseline', async ({ page }) => {
  await page.goto('./');
  for (const title of ['New ideas being considered', 'In progress', 'Backlog', 'Not being considered right now']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'Welsh-language SMS reminders by default' })).toHaveAttribute('href', /issues\/14$/);
  await expect(page.getByText('41 people support this')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suggest a feature' }).first()).toBeVisible();
});
