const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c12 grammar3 support activity 1 opens and switches explanation images', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/c12/grammar3-support-activity1.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('보조활동 1');
  await expect(page.locator('.thumb-button')).toHaveCount(4);
  await expect(page.getByTestId('c12-grammar3-support-main-image')).toHaveAttribute('src', /01-inference-overview\.webp$/);
  await expect.poll(async () => page.getByTestId('c12-grammar3-support-main-image').evaluate((img) => img.complete && img.naturalWidth === 1672)).toBe(true);

  await page.locator('.thumb-button').nth(2).click();
  await expect(page.getByTestId('c12-grammar3-support-main-image')).toHaveAttribute('src', /03-expression-compare\.webp$/);
  await expect(page.locator('#stageTitle')).toContainText('비슷한 표현과 차이');

  await page.locator('#nextBtn').click();
  await expect(page.getByTestId('c12-grammar3-support-main-image')).toHaveAttribute('src', /04-practice\.webp$/);
  await expect(page.locator('#openAsset')).toHaveAttribute('href', /04-practice\.webp$/);

  const imageFitsViewport = await page.getByTestId('c12-grammar3-support-main-image').evaluate((img) => {
    const rect = img.getBoundingClientRect();
    return rect.width <= window.innerWidth && rect.height <= window.innerHeight;
  });
  expect(imageFitsViewport).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test('c12 index and grammar3 main link to support activity 1', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  const grammar3Card = page.locator('.path-card').filter({ hasText: '문법 3' });
  await expect(grammar3Card.locator('a[href="grammar3-support-activity1.html"]')).toContainText('설명 이미지');

  await page.goto('/c12/grammar3.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.resource-link[href="grammar3-support-activity1.html"]')).toContainText('보조활동 1');
});
