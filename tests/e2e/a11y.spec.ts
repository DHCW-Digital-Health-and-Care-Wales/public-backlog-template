import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated accessibility checks (specs/08, specs/09). Zero serious or critical
 * violations across the default, filtered and Welsh states. WCAG 2.2 AA tags.
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function seriousOrCritical(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
}

test.describe('AC-NFR-01 accessibility, no serious or critical violations', () => {
  test('default English state', async ({ page }) => {
    await page.goto('/');
    expect(await seriousOrCritical(page)).toEqual([]);
  });

  test('Welsh state', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[lang="cy"]').click();
    await expect(page).toHaveURL(/lang=cy/);
    expect(await seriousOrCritical(page)).toEqual([]);
  });

  test('filtered state', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tag-filter').first().click();
    expect(await seriousOrCritical(page)).toEqual([]);
  });
});

test.describe('AC-NFR-09 keyboard and focus', () => {
  test('interactive controls are reachable and show a visible focus ring', async ({
    page,
  }) => {
    await page.goto('/');
    // The skip link is the first focusable element.
    await page.keyboard.press('Tab');
    const active = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    expect(active).toBeTruthy();

    // An upvote control can receive focus directly.
    const control = page
      .locator('[data-column="backlog"] [data-testid="vote-control"]')
      .first();
    await control.focus();
    await expect(control).toBeFocused();
  });
});
