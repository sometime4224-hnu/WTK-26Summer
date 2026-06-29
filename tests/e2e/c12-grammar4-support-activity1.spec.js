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

test('c12 grammar4 support activity 1 opens images and checks the current point', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/c12/grammar4-support-activity1.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('보조활동 1');
  await expect(page.locator('.thumb-button')).toHaveCount(4);
  await expect(page.getByTestId('c12-grammar4-support-main-image')).toHaveAttribute('src', /01-core-meaning\.webp$/);
  await expect.poll(async () => page.getByTestId('c12-grammar4-support-main-image').evaluate((img) => img.complete && img.naturalWidth === 1448)).toBe(true);
  await expect(page.locator('#checkPrompt')).toContainText('앞 문장');

  await page.locator('.choice-button').filter({ hasText: '필요한 조건' }).click();
  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다');

  await page.locator('.thumb-button').nth(2).click();
  await expect(page.getByTestId('c12-grammar4-support-main-image')).toHaveAttribute('src', /03-example-conditions\.webp$/);
  await expect(page.locator('#stageTitle')).toContainText('예문으로 이해해요');
  await expect(page.locator('#checkPrompt')).toContainText('버스를 타려면');

  await page.locator('#nextBtn').click();
  await expect(page.getByTestId('c12-grammar4-support-main-image')).toHaveAttribute('src', /04-gap-practice\.webp$/);
  await expect(page.locator('#openAsset')).toHaveAttribute('href', /04-gap-practice\.webp$/);

  const imageFitsViewport = await page.getByTestId('c12-grammar4-support-main-image').evaluate((img) => {
    const rect = img.getBoundingClientRect();
    return rect.width <= window.innerWidth && rect.height <= window.innerHeight;
  });
  expect(imageFitsViewport).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test('c12 index and grammar4 main link to support activity 1', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  const grammar4Card = page.locator('.path-card').filter({ hasText: '문법 4' });
  await expect(grammar4Card.locator('a[href="grammar4-support-activity1.html"]')).toContainText('설명 이미지');

  await page.goto('/c12/grammar4.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.resource-link[href="grammar4-support-activity1.html"]')).toContainText('보조활동 1');
});

test('c12 grammar4 support activity 1 keeps the task usable on phone width', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/c12/grammar4-support-activity1.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('c12-grammar4-support-main-image')).toBeVisible();
  await expect(page.locator('#checkPrompt')).toBeVisible();
  await expect(page.locator('.choice-button')).toHaveCount(3);
  await page.locator('.choice-button').filter({ hasText: '필요한 조건' }).click();
  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
