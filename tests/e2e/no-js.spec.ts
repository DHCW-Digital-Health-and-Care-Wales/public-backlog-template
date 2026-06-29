import { test, expect } from '@playwright/test';

/**
 * Progressive-enhancement baseline (CLAUDE.md, specs/08). The four areas and
 * their cards must be present in the served HTML with JavaScript disabled.
 */
test.use({ javaScriptEnabled: false });

test.describe('AC-NFR-08 no-JavaScript baseline', () => {
  test('the board and its cards are readable without JavaScript', async ({
    page,
  }) => {
    await page.goto('/');

    // All five areas are present in the pre-rendered HTML.
    await expect(page.locator('[data-testid="column"]')).toHaveCount(5);

    // Cards are present, not just empty columns.
    const cards = page.locator('[data-testid="card"]');
    expect(await cards.count()).toBeGreaterThan(5);

    // Column headings are real text.
    await expect(
      page.getByRole('heading', { name: 'New ideas being considered' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'In progress' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Backlog' })).toBeVisible();

    // The suggestion route is an ordinary link, so it works without JS.
    await expect(page.getByTestId('suggest-header')).toHaveAttribute(
      'href',
      /\/issues\/new\?template=/,
    );

    // Upvote controls are deep links, so they work without JS.
    await expect(
      page
        .locator('[data-column="backlog"] [data-testid="vote-control"]')
        .first(),
    ).toHaveAttribute('href', /\/issues\/\d+$/);
  });
});
