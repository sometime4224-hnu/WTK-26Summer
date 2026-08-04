const { test, expect } = require('@playwright/test');

async function noOverflow(page) {
  expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
}

test('hub has five tasks and links the long writing task without treating it as a quiz', async ({ page }) => {
  await page.addInitScript(() => {
    window.__review5Reads = [];
    const getItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) { window.__review5Reads.push(String(key)); return getItem.call(this, key); };
  });
  await page.goto('/review/review5-html/index.html');
  await expect(page.locator('.section-card')).toHaveCount(5);
  await expect(page.locator('a[href="long-writing.html"]')).toHaveCount(1);
  expect(await page.evaluate(() => window.__review5Reads.some((key) => key.includes('longWriting')))).toBe(false);
});

for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 844 }, { width: 1440, height: 900 }]) {
  test(`responsive quiz remains reachable at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/review/review5-html/confirm.html');
    await page.locator('#studentNameInput').fill('김학생');
    await expect(page.locator('[data-action="start"]')).toBeVisible();
    await page.locator('[data-action="start"]').press('Enter');
    await expect(page.locator('.question-card')).toBeVisible();
    await noOverflow(page);
  });
}

test('manual automatic smartphone and tablet controls work', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'desktop');
  await page.getByLabel('스마트폰').click();
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'phone');
  await page.getByLabel('태블릿').click();
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'tablet');
  await page.getByRole('button', { name: '자동' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-layout', 'desktop');
});

test('200% zoom equivalent keeps the first action fully visible and keyboard-reachable', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  const box = await page.locator('[data-action="start"]').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(450);
  await noOverflow(page);
  await page.locator('[data-action="start"]').press('Enter');
  await expect(page.locator('.question-card')).toBeVisible();
});
