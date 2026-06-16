const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
}

test.describe('c11 copied job posting blank-fill activity', () => {
  test('hub support button opens the copied blank-fill activity', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

    const drawer = page.locator('details.support-drawer').filter({ hasText: '어휘 보조 활동 및 자료' });
    await expect(drawer).toHaveCount(1);
    await drawer.locator('summary.support-drawer__summary').click();

    const link = drawer.locator('a[href="vocab-support-job-posting-fill.html"]');
    await expect(link).toHaveCount(1);
    await expect(link).toContainText('구인공고 빈칸 채우기');
    await link.click();
    await expect(page).toHaveURL(/\/c11\/vocab-support-job-posting-fill\.html$/);
  });

  test('keeps original page separate and fills blanks by drag or touch', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-job-posting.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#posting-stage')).toHaveCount(0);

    await page.goto('/c11/vocab-support-job-posting-fill.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#page-title')).toHaveText('구인공고 빈칸 채우기');
    await expect(page.locator('#posting-stage .floating-person')).toHaveCount(2);
    await expect(page.locator('[data-posting-slot]')).toHaveCount(6);
    await expect(page.locator('#posting-progress')).toHaveText('0 / 6');

    await page.locator('[data-word-id="word-annual-salary"]').click();
    await page.locator('[data-posting-slot="type"]').click();
    await expect(page.locator('[data-posting-slot="type"]')).toContainText('빈칸');
    await expect(page.locator('#posting-progress')).toHaveText('0 / 6');

    await page.locator('[data-word-id="word-part-time"]').dragTo(page.locator('[data-posting-slot="type"]'));
    await expect(page.locator('[data-posting-slot="type"]')).toContainText('아르바이트');
    await expect(page.locator('#posting-progress')).toHaveText('1 / 6');

    const touchPairs = [
      ['word-hours', 'hours', '근무 시간'],
      ['word-wage', 'wage', '시급'],
      ['word-task', 'task', '업무'],
      ['word-experience', 'experience', '경험이 많다'],
      ['word-diligent', 'diligent', '성실하다']
    ];

    for (const [wordId, slotId, expectedText] of touchPairs) {
      await page.locator(`[data-word-id="${wordId}"]`).click();
      await page.locator(`[data-posting-slot="${slotId}"]`).click();
      await expect(page.locator(`[data-posting-slot="${slotId}"]`)).toContainText(expectedText);
    }

    await expect(page.locator('#posting-progress')).toHaveText('6 / 6');
    await expect(page.locator('#posting-stage')).toHaveClass(/is-complete/);
  });

  test('copied blank-fill page avoids horizontal overflow on phone width', async ({ page }) => {
    await blockExternalRequests(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/c11/vocab-support-job-posting-fill.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#posting-stage')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
