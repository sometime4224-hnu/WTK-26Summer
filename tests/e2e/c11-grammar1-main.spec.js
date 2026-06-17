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

test('c11 grammar1 main page is responsive and explains causative purpose', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar1.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('사동사');
    await expect(page.locator('body')).toContainText('사동사를 왜 쓰나요?');
    await expect(page.locator('body')).toContainText('누가 그렇게 되게 했어요?');
    await expect(page.locator('.resource-link')).toHaveCount(8);
    await expect(page.locator('.resource-link').first()).toHaveAttribute('href', 'grammar1-causative-sentence-flow.html');
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 grammar1 multilingual scaffold and practice tab work', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/c11/grammar1.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('.multilang-scaffold [data-lang="en"]')).toHaveClass(/lang-visible/);
  await expect(page.locator('.multilang-scaffold [data-lang="en"]')).toContainText('made, helped, allowed');
  await expect(page.locator('.purpose-translation[data-lang="en"].lang-visible')).toHaveCount(5);
  await expect(page.locator('.purpose-translation[data-lang="en"].lang-visible')).toContainText([
    'directs or asks',
    'care or help',
    'lets another person',
    'cause or responsibility',
    'changes or controls'
  ]);

  await page.getByRole('button', { name: 'Tiếng Việt' }).click();
  await expect(page.locator('.multilang-scaffold [data-lang="vi"]')).toHaveClass(/lang-visible/);
  await expect(page.locator('.multilang-scaffold [data-lang="en"]')).not.toHaveClass(/lang-visible/);
  await expect(page.locator('.purpose-translation[data-lang="vi"].lang-visible')).toHaveCount(5);
  await expect(page.locator('.purpose-translation[data-lang="en"].lang-visible')).toHaveCount(0);

  await page.getByRole('button', { name: '번역 끄기' }).click();
  await expect(page.locator('[data-lang].lang-visible')).toHaveCount(0);

  await page.getByRole('button', { name: '연습' }).click();
  await expect(page.locator('#practicePanel')).toBeVisible();
  await expect(page.locator('#learnPanel')).toBeHidden();
  await expect(page.locator('#progress')).toContainText('/ 8');

  if (await page.locator('#shortWrap:not(.hidden)').count()) {
    const questionText = await page.locator('#qText').textContent();
    await page.locator('#shortInput').fill(questionText.includes('사진') ? '보여주셨어요' : '웃기다');
    await page.locator('#checkShortBtn').click();
  } else {
    await page.locator('#choices button').first().click();
  }

  await expect(page.locator('#feedbackBox')).toBeVisible();
});
