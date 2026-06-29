const { test, expect } = require('@playwright/test');

const pagePath = '/apps/standalone-pages/present.html';

test('records and persists 3B-7 presentation status locally', async ({ page }) => {
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  const cards = page.locator('[data-student-card]');
  await expect(page.locator('h1')).toHaveText('3B-7 발표 기록');
  await expect(cards).toHaveCount(25);
  await expect(page.locator('#done-count')).toHaveText('0');
  await expect(page.locator('#pending-count')).toHaveText('25');

  const firstCard = cards.first();
  await firstCard.locator('[data-field="presented"]').check({ force: true });
  await firstCard.locator('[data-field="note"]').fill('첫 발표 완료');

  await expect(page.locator('#done-count')).toHaveText('1');
  await expect(page.locator('#pending-count')).toHaveText('24');
  await expect(firstCard).toHaveClass(/is-done/);
  await expect(firstCard.locator('[data-field="date"]')).not.toHaveValue('');

  await page.reload({ waitUntil: 'domcontentloaded' });

  const reloadedFirstCard = page.locator('[data-student-card]').first();
  await expect(reloadedFirstCard).toHaveClass(/is-done/);
  await expect(reloadedFirstCard.locator('[data-field="presented"]')).toBeChecked();
  await expect(reloadedFirstCard.locator('[data-field="note"]')).toHaveValue('첫 발표 완료');
  await expect(page.locator('#done-count')).toHaveText('1');
  await expect(page.locator('#pending-count')).toHaveText('24');
});

test('filters and resets presentation records', async ({ page }) => {
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.locator('[data-student-card]').nth(0).locator('[data-field="presented"]').check({ force: true });
  await page.locator('[data-student-card]').nth(1).locator('[data-field="presented"]').check({ force: true });

  await page.locator('[data-filter="done"]').click();
  await expect
    .poll(async () => page.locator('[data-student-card]:visible').count())
    .toBe(2);

  await page.locator('[data-filter="pending"]').click();
  await expect
    .poll(async () => page.locator('[data-student-card]:visible').count())
    .toBe(23);

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-action="reset"]').click();

  await expect(page.locator('#done-count')).toHaveText('0');
  await expect(page.locator('#pending-count')).toHaveText('25');
});
