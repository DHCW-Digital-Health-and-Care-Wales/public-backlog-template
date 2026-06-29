import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';

/**
 * Stale-snapshot behaviour (AC-BOARD-15). When the served snapshot is older
 * than the freshness window, the board keeps the last good content and shows a
 * staleness notice. We simulate an old snapshot by rewriting the served file.
 */
const distSnapshot = fileURLToPath(
  new URL('../../dist/backlog.json', import.meta.url),
);

test.describe('AC-BOARD-15 stale snapshot', () => {
  test('an old snapshot keeps the content and shows a staleness notice', async ({
    page,
  }) => {
    const original = readFileSync(distSnapshot, 'utf8');
    const data = JSON.parse(original);
    const old = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString();
    writeFileSync(distSnapshot, JSON.stringify({ ...data, generatedAt: old }));

    try {
      await page.goto('/');
      await expect(page.getByTestId('stale-notice')).toBeVisible();
      // Content is still present.
      expect(
        await page.locator('[data-testid="card"]').count(),
      ).toBeGreaterThan(5);
    } finally {
      writeFileSync(distSnapshot, original);
    }
  });
});
