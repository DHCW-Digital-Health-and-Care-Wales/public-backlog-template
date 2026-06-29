import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function scan(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test('AC-BOARD-14/AC-NFR-01 default state', async ({ page }) => {
  await page.goto('./');
  await scan(page);
});

test('AC-NFR-01 filtered state', async ({ page }) => {
  await page.goto('./');
  await page.selectOption('#tagfilter', 'cymraeg');
  await scan(page);
});

test('AC-NFR-01 welsh state', async ({ page }) => {
  await page.goto('./?lang=cy');
  await scan(page);
});
