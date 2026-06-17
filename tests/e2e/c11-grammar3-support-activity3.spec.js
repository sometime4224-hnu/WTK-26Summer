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

test('c11 grammar3 support activity 3 fits tablet landscape and switches cards', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/c11/grammar3-support-activity3.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('보조 활동 3');
  await expect(page.locator('#cardTag')).toContainText('의문사-든지');
  await expect(page.locator('#cardTitle')).toContainText('무엇이든지');
  await expect(page.getByTestId('grammar3-support-main-image')).toHaveAttribute('src', /02-mueos-ideunji\.webp$/);
  await expect.poll(async () => page.getByTestId('grammar3-support-main-image').evaluate((img) => img.complete && img.naturalWidth === 1280)).toBe(true);
  await expectNoHorizontalOverflow(page);

  const imageFitsViewport = await page.getByTestId('grammar3-support-main-image').evaluate((img) => {
    const rect = img.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.right <= window.innerWidth + 1 && rect.bottom <= window.innerHeight + 1;
  });
  expect(imageFitsViewport).toBe(true);

  await page.getByRole('button', { name: '누구든지' }).click();
  await expect(page.locator('#cardTitle')).toContainText('누구든지');
  await expect(page.getByTestId('grammar3-support-main-image')).toHaveAttribute('src', /03-nugu-deunji\.webp$/);

  await page.getByRole('button', { name: '아무도' }).click();
  await expect(page.locator('#cardTag')).toContainText('의문사-도');
  await expect(page.locator('#cardTitle')).toContainText('아무도');
  await expect(page.locator('#assetCount')).toContainText('5 / 5');
  await expect(page.getByTestId('grammar3-support-main-image')).toHaveAttribute('src', /05-amudo\.webp$/);
});

test('c11 index links to grammar3 support activity 3', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  const grammar3Card = page.locator('.path-card').filter({ hasText: '문법 3' });
  const supportLink = grammar3Card.locator('a[href="grammar3-support-activity3.html"]');
  await expect(supportLink).toContainText('의문사 + 든지 이미지 카드');
});
