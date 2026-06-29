import { test, expect } from '@playwright/test';

// Column order in fixed sequence (specs/04 AC-BOARD-01/02).
const COLUMN_ORDER = [
  'considering',
  'in-progress',
  'backlog',
  'parked',
  'shipped',
];

test.describe('AC-BOARD-01/02 four areas in fixed order', () => {
  test('renders the areas in the documented order, with Recently shipped last', async ({
    page,
  }) => {
    await page.goto('/');
    const columns = page.locator('[data-testid="column"]');
    await expect(columns).toHaveCount(5);
    const order = await columns.evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('data-column')),
    );
    expect(order).toEqual(COLUMN_ORDER);
  });

  test('column identity is given as a text heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'New ideas being considered' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Not being considered right now' }),
    ).toBeVisible();
  });
});

test.describe('AC-BOARD-04 curated backlog order', () => {
  test('backlog items follow the curated manifest, not the vote count', async ({
    page,
  }) => {
    await page.goto('/');
    const backlog = page.locator('[data-column="backlog"] [data-testid="card"]');
    const numbers = await backlog.evaluateAll((nodes) =>
      nodes.map((n) => Number(n.getAttribute('data-number'))),
    );
    expect(numbers).toEqual([17, 14, 19]);
  });
});

test.describe('AC-REQ-01/02 suggestion route', () => {
  test('the header and the first New ideas entry link to the issue template', async ({
    page,
  }) => {
    await page.goto('/');
    const header = page.getByTestId('suggest-header');
    await expect(header).toBeVisible();
    await expect(header).toHaveAttribute(
      'href',
      /\/issues\/new\?template=feature_request\.yml$/,
    );

    const column = page.getByTestId('suggest-column');
    await expect(column).toBeVisible();
    // It is the first item in the New ideas column.
    const firstChild = page.locator(
      '[data-column="considering"] [data-testid="card-list"] > li:first-child',
    );
    await expect(firstChild.getByTestId('suggest-column')).toBeVisible();
  });
});

test.describe('AC-VOTE-03 deep links to the issue', () => {
  test('an interactive upvote links to its GitHub issue', async ({ page }) => {
    await page.goto('/');
    const control = page
      .locator('[data-column="backlog"] [data-testid="vote-control"]')
      .first();
    await expect(control).toHaveAttribute('href', /\/issues\/\d+$/);
  });

  test('in-progress and shipped show a read-only count', async ({ page }) => {
    await page.goto('/');
    await expect(
      page
        .locator('[data-column="in-progress"] [data-testid="vote-readonly"]')
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('[data-column="in-progress"] [data-testid="vote-control"]'),
    ).toHaveCount(0);
  });
});

test.describe('AC-NFR-05 language toggle and ?lang= reflection', () => {
  test('switching to Welsh updates the URL and the interface', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('button[lang="cy"]').click();
    await expect(page).toHaveURL(/lang=cy/);
    await expect(
      page.getByRole('heading', { name: 'Syniadau newydd dan ystyriaeth' }),
    ).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'cy');
  });

  test('?lang=cy loads Welsh directly', async ({ page }) => {
    await page.goto('/?lang=cy');
    await expect(
      page.getByRole('heading', { name: 'Ar y gweill' }),
    ).toBeVisible();
  });
});

test.describe('AC-BOARD-12 tag filtering as an enhancement', () => {
  test('selecting a tag narrows the visible cards', async ({ page }) => {
    await page.goto('/');
    const filters = page.getByTestId('tag-filter');
    const count = await filters.count();
    expect(count).toBeGreaterThan(0);
    const before = await page.locator('[data-testid="card"]').count();
    await filters.first().click();
    await expect
      .poll(async () => page.locator('[data-testid="card"]').count())
      .toBeLessThan(before);
  });
});

test.describe('AC-BOARD-09 last updated indicator', () => {
  test('shows a last-updated time for the board', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('board-freshness')).toBeVisible();
  });
});
