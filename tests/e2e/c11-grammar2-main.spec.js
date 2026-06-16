const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c11 grammar2 main page is responsive and has correct titles', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar2.html', { waitUntil: 'domcontentloaded' });

    // Verify Title & Key Headings
    await expect(page.locator('h1')).toContainText('A/V-(ㄴ/는)다면, N(이)라면');
    await expect(page.locator('body')).toContainText('핵심 개념');
    await expect(page.locator('body')).toContainText('형태 규칙');
    await expect(page.locator('body')).toContainText('헷갈림 비교');

    // Check no horizontal overflow
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 grammar2 translation toggle works', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/c11/grammar2.html', { waitUntil: 'domcontentloaded' });

  // Initial state: scaffold translation box for VI should not be visible
  await expect(page.locator('.multilang-scaffold__box[data-lang="vi"]')).toBeHidden();

  // Click translation toggle to turn ON (using getByRole to find Tiếng Việt button)
  await page.getByRole('button', { name: 'Tiếng Việt' }).click();
  await expect(page.locator('.multilang-scaffold__box[data-lang="vi"]')).toBeVisible();

  // Click translation toggle to turn OFF again (using getByRole to find 번역 끄기 button)
  await page.getByRole('button', { name: '번역 끄기' }).click();
  await expect(page.locator('.multilang-scaffold__box[data-lang="vi"]')).toBeHidden();
});

test('c11 grammar2 tabs switching works', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('/c11/grammar2.html', { waitUntil: 'domcontentloaded' });

  // Initial tab: 학습 (Learn)
  await expect(page.locator('#learnPanel')).toBeVisible();
  await expect(page.locator('#drillPanel')).toBeHidden();
  await expect(page.locator('#quizPanel')).toBeHidden();

  // Switch to 형태 드릴 (Drill)
  await page.locator('#tabDrill').click();
  await expect(page.locator('#learnPanel')).toBeHidden();
  await expect(page.locator('#drillPanel')).toBeVisible();
  await expect(page.locator('#quizPanel')).toBeHidden();
  await expect(page.locator('#drillProgress')).toContainText('1 / 12');

  // Switch to 퀴즈 (Quiz)
  await page.locator('#tabQuiz').click();
  await expect(page.locator('#learnPanel')).toBeHidden();
  await expect(page.locator('#drillPanel')).toBeHidden();
  await expect(page.locator('#quizPanel')).toBeVisible();
  await expect(page.locator('#progress')).toContainText('1 / 10');
});

test('c11 grammar2 explanation photo gallery is responsive and loads the default photo', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar2-explanation-photo-gallery.html#visualExamples', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('문법 2 설명 사진');
    await expect(page.locator('#visualExamples')).toBeVisible();
    await expect(page.locator('#visualExamplesTitle')).toContainText('문법 2 설명 사진');
    await expect(page.locator('#visualTitle')).toContainText('V-는다면 / A-다면 의미');
    await expect(page.getByTestId('visual-main-image')).toHaveAttribute('src', /photos\/01-meaning-overview\.webp$/);
    await expect.poll(async () => page.getByTestId('visual-main-image').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 grammar2 explanation photo gallery switches photos', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('/c11/grammar2-explanation-photo-gallery.html', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: '미래 상황 가정 예시' }).click();
  await expect(page.locator('#visualTag')).toHaveText('용법 2 예시');
  await expect(page.locator('#visualTitle')).toContainText('미래 상황 가정 예시');
  await expect(page.getByTestId('visual-main-image')).toHaveAttribute('src', /photos\/06-usage2-future-hypothesis-examples\.webp$/);

  await page.getByRole('button', { name: '다음 사진' }).click();
  await expect(page.locator('#visualTitle')).toContainText('현실과 다른 상상');
  await expect(page.getByTestId('visual-main-image')).toHaveAttribute('src', /photos\/07-usage3-unreal-imagination\.webp$/);

  await page.getByRole('button', { name: '이전 사진' }).click();
  await expect(page.locator('#visualTitle')).toContainText('미래 상황 가정 예시');
});

test('c11 grammar2 visual examples show examples as a default image overlay', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/c11/grammar2-visual-examples.html#visualExamples', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#visualExamplesTitle')).toContainText('조건 vs 가정 이미지 예시');
  await expect(page.locator('#visualTitle')).toContainText('비 오는 날과 복권 상상');
  await expect(page.getByTestId('visual-main-image')).toHaveAttribute('src', /illustrations\/09-if-rain-lottery\.webp$/);
  await expect.poll(async () => page.getByTestId('visual-main-image').evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.locator('#visualAnswerPanel')).toBeVisible();
  await expect(page.locator('#visualAnswerPanel')).toContainText('비가 오면 우산을 써요.');
  await expect(page.locator('#visualRevealBtn')).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => page.evaluate(() => {
    const image = document.querySelector('[data-testid="visual-main-image"]');
    const panel = document.querySelector('#visualAnswerPanel');
    if (!image || !panel) return false;
    const imageRect = image.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    return panelRect.top >= imageRect.top
      && panelRect.left >= imageRect.left
      && panelRect.right <= imageRect.right
      && panelRect.bottom <= imageRect.bottom;
  })).toBe(true);

  await page.getByRole('button', { name: '예문 숨기기' }).click();
  await expect(page.locator('#visualAnswerPanel')).toBeHidden();
  await expect(page.locator('#visualRevealBtn')).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: '예문 보기' }).click();
  await expect(page.locator('#visualAnswerPanel')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test('c11 index links to grammar2 visual examples copy from the grammar2 card', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  const grammar2Card = page.locator('.path-card').filter({ hasText: '문법 2' });
  const visualLink = grammar2Card.locator('a[href="grammar2-explanation-photo-gallery.html#visualExamples"]');
  await expect(visualLink).toContainText('문법 2 설명 사진');
});

test('c11 grammar2 and visual examples support all 6 languages', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });

  const targets = [
    '/c11/grammar2.html'
  ];

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'mn', name: 'Монгол' },
    { code: 'ar', name: 'العربية' },
    { code: 'kk', name: 'Қазақша' },
    { code: 'th', name: 'ไทย' },
    { code: 'en', name: 'English' }
  ];

  for (const url of targets) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Verify all language buttons exist
    for (const lang of languages) {
      const btn = page.locator(`[data-multilang-btn="${lang.code}"]`);
      await expect(btn).toBeVisible();
      await expect(btn).toContainText(lang.name);

      // Click button and verify the corresponding box becomes visible
      await btn.click();
      const box = page.locator(`.multilang-scaffold__box[data-lang="${lang.code}"]`);
      await expect(box).toBeVisible();
    }

    // Verify 번역 끄기 hides the translation boxes
    await page.locator('[data-multilang-btn="none"]').click();
    for (const lang of languages) {
      const box = page.locator(`.multilang-scaffold__box[data-lang="${lang.code}"]`);
      await expect(box).toBeHidden();
    }
  }
});
