const { test, expect } = require('@playwright/test');

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
  { code: 'mn', name: 'Монгол' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'th', name: 'ไทย' }
];

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function answerCurrentQuestionWrong(page) {
  if (await page.locator('#shortWrap:not(.hidden)').count()) {
    await page.locator('#shortInput').fill('__wrong__');
    await page.locator('#checkShortBtn').click();
    return;
  }

  const wrongChoice = await page.evaluate(() => {
    const prompt = document.getElementById('qText').textContent;
    const item = window.C12_GRAMMAR2_VISUAL_PAGE.quiz.find((q) => q.q === prompt);
    const choices = Array.from(document.querySelectorAll('#choices button')).map((button) => button.textContent);
    return choices.find((choice) => choice !== item.answer) || choices[0];
  });
  await page.locator('#choices button').filter({ hasText: wrongChoice }).first().click();
}

test.describe('c12 grammar2 visual version', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c12/grammar2.html', { waitUntil: 'domcontentloaded' });
  });

  test('renders without horizontal overflow across viewports', async ({ page }) => {
    const viewports = [
      { width: 1280, height: 900 },
      { width: 820, height: 1180 },
      { width: 390, height: 844 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1')).toContainText('얼마나 -(으)ㄴ/는지 모르다');
      await expect(page.locator('.story-card')).toHaveCount(6);
      await expectNoHorizontalOverflow(page);
    }
  });

  test('loads every storyboard image', async ({ page }) => {
    await expect(page.locator('.story-card img')).toHaveCount(6);
    const loaded = await page.locator('.story-card img').evaluateAll((images) => (
      images.map((img) => ({
        src: img.getAttribute('src'),
        width: img.naturalWidth,
        height: img.naturalHeight
      }))
    ));

    expect(loaded.map((item) => item.src)).toEqual([
      '../assets/c12/grammar/images/grammar2-visual/meaning-overview.webp',
      '../assets/c12/grammar/images/grammar2-visual/feeling-focus.webp',
      '../assets/c12/grammar/images/grammar2-visual/adjective-form.webp',
      '../assets/c12/grammar/images/grammar2-visual/verb-form.webp',
      '../assets/c12/grammar/images/grammar2-visual/comparison.webp',
      '../assets/c12/grammar/images/grammar2-visual/review-summary.webp'
    ]);
    for (const image of loaded) {
      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
    }
  });

  test('opens storyboard images in a fullscreen viewer', async ({ page }) => {
    await expect(page.locator('.fullscreen-btn')).toHaveCount(6);

    const firstButton = page.locator('.story-card').first().locator('.fullscreen-btn');
    await expect(firstButton).toBeVisible();
    await firstButton.click();

    await expect(page.locator('#imageLightbox')).toBeVisible();
    await expect(page.locator('#lightboxTitle')).toContainText('모른다는 뜻이 아니라 강한 감탄이에요');
    await expect(page.locator('#lightboxImage')).toHaveAttribute('src', '../assets/c12/grammar/images/grammar2-visual/meaning-overview.webp');

    const lightboxImageSize = await page.locator('#lightboxImage').evaluate((img) => ({
      width: img.naturalWidth,
      height: img.naturalHeight
    }));
    expect(lightboxImageSize.width).toBeGreaterThan(0);
    expect(lightboxImageSize.height).toBeGreaterThan(0);

    await page.keyboard.press('Escape');
    await expect(page.locator('#imageLightbox')).toBeHidden();

    await firstButton.click();
    await page.locator('#lightboxCloseBtn').click();
    await expect(page.locator('#imageLightbox')).toBeHidden();
  });

  test('supports the six shared translation languages', async ({ page }) => {
    for (const lang of LANGUAGES) {
      const button = page.locator(`[data-multilang-btn="${lang.code}"]`);
      await expect(button).toBeVisible();
      await expect(button).toContainText(lang.name);
      await button.click();
      await expect(page.locator('body')).toHaveAttribute('data-active-lang', lang.code);

      await expect(page.locator(`.story-card .lang-box[data-lang="${lang.code}"].lang-visible`)).toHaveCount(6);
      for (const other of LANGUAGES.filter((item) => item.code !== lang.code)) {
        await expect(page.locator(`.story-card .lang-box[data-lang="${other.code}"].lang-visible`)).toHaveCount(0);
      }
      await expectNoHorizontalOverflow(page);
    }

    await expect(page.locator('.story-card .lang-box[data-lang="ar"]').first()).toHaveAttribute('dir', 'rtl');
    await page.locator('[data-multilang-btn="none"]').click();
    await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
    await expect(page.locator('.story-card .lang-box.lang-visible')).toHaveCount(0);
  });

  test('keeps drill and quiz interactions working', async ({ page }) => {
    await expect(page.locator('#drillPanel')).toBeVisible();
    await expect(page.locator('#drillProgress')).toContainText('1 / 8');
    await page.locator('#drillFace').click();
    await expect(page.locator('#drillActions')).toBeVisible();

    for (let i = 0; i < 8; i += 1) {
      if (!(await page.locator('#drillActions:not(.hidden)').count())) {
        await page.locator('#drillFace').click();
      }
      await page.locator('#drillRetryBtn').click();
    }
    await expect(page.locator('#drillResult')).toBeVisible();
    await expect(page.locator('#restartDrillBtn')).toBeVisible();
    await expect(page.locator('#reviewDrillBtn')).toBeEnabled();

    await page.locator('#tabQuiz').click();
    await expect(page.locator('#quizPanel')).toBeVisible();
    await expect(page.locator('#quizProgress')).toContainText('1 / 8');

    for (let i = 0; i < 8; i += 1) {
      await answerCurrentQuestionWrong(page);
      await expect(page.locator('#feedbackBox')).toBeVisible();
      await page.locator('#nextBtn').click();
    }

    await expect(page.locator('#resultPanel')).toBeVisible();
    await expect(page.locator('#restartQuizBtn')).toBeVisible();
    await expect(page.locator('#retryWrongBtn')).toBeEnabled();
  });

  test('keeps the classic version available', async ({ page }) => {
    await page.goto('/c12/grammar2-classic.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('얼마나 -(으)ㄴ/는지 모르다');
    await expect(page.locator('.hero-panel')).toBeVisible();
    await expect(page.locator('#learnPanel')).toBeVisible();
    await expect(page.locator('#tabLearn')).toBeVisible();
    await expect(page.locator('a[href="grammar2.html"]')).toContainText('새 버전');
  });
});
