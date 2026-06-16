const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c11 grammar2 balance game page is responsive', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar2-if-balance-game.html', { waitUntil: 'domcontentloaded' });

    // Verify Title & Key Elements
    await expect(page.locator('h1')).toContainText('만약(IF) 밸런스 게임 연구소');
    await expect(page.locator('body')).toContainText('연구소 진행도');
    await expect(page.locator('body')).toContainText('나의 밸런스 기록');
    await expect(page.locator('#selectBoard')).toBeVisible();
    await expect(page.locator('#roundTab1')).toBeVisible();

    // Check no horizontal overflow
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 grammar2 balance game gameplay flow works', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('/c11/grammar2-if-balance-game.html', { waitUntil: 'domcontentloaded' });

  // 1. Initial State: select board is visible, round tabs are visible, builder board is hidden
  await expect(page.locator('#selectBoard')).toBeVisible();
  await expect(page.locator('#roundTab1')).toBeVisible();
  await expect(page.locator('#builderBoard')).toBeHidden();
  await expect(page.locator('#dilemmaTitle')).toContainText('만약 내가 로또 1등에 당첨된다면?');

  // 2. Click Option A on Dilemma 1
  await page.locator('#optACard button').click();
  await expect(page.locator('#selectBoard')).toBeHidden();
  await expect(page.locator('#builderBoard')).toBeVisible();

  // 3. Verify target words pool is visible
  await expect(page.locator('#wordPool')).toBeVisible();
  await expect(page.locator('#emptyPrompt')).toBeVisible();

  // 4. Click word chips to assemble: "내가 로또에 당첨된다면 회사를 그만두겠어요"
  await page.getByRole('button', { name: '내가' }).click();
  await page.getByRole('button', { name: '로또에' }).click();
  await page.getByRole('button', { name: '당첨된다면' }).click();
  await page.getByRole('button', { name: '회사를' }).click();
  await page.getByRole('button', { name: '그만두겠어요' }).click();

  // 5. Click Check Answer button
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다!');

  // 6. Click navbar link to return to round select (resets round progress)
  await page.locator('#injected-global-nav a').filter({ hasText: '라운드 선택' }).click();
  await expect(page.locator('#selectBoard')).toBeVisible();
  await expect(page.locator('#dilemmaTitle')).toContainText('만약 내가 로또 1등에 당첨된다면?');

  // 7. Select Round 2 and verify Dilemma 6
  await page.locator('#roundTab2').click();
  await expect(page.locator('#selectBoard')).toBeVisible();
  await expect(page.locator('#dilemmaTitle')).toContainText('만약 내가 초능력을 하나 얻는다면?');
});

test('c11 grammar2 balance game supports all 6 languages', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/c11/grammar2-if-balance-game.html', { waitUntil: 'domcontentloaded' });

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'mn', name: 'Монгол' },
    { code: 'ar', name: 'العربية' },
    { code: 'kk', name: 'Қазақша' },
    { code: 'th', name: 'ไทย' },
    { code: 'en', name: 'English' }
  ];

  for (const lang of languages) {
    const btn = page.locator(`[data-multilang-btn="${lang.code}"]`);
    await expect(btn).toBeVisible();
    await expect(btn).toContainText(lang.name);

    // Click button and verify the corresponding box is visible
    await btn.click();
    const box = page.locator(`.multilang-scaffold__box[data-lang="${lang.code}"]`);
    await expect(box).toBeVisible();
  }

  // Click 번역 끄기 button
  await page.locator('[data-multilang-btn="none"]').click();
  for (const lang of languages) {
    const box = page.locator(`.multilang-scaffold__box[data-lang="${lang.code}"]`);
    await expect(box).toBeHidden();
  }
});
