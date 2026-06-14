const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

const quizPages = [
  { path: '/c11/vocabulary-quiz-meaning.html', h1: '뜻 퀴즈', overlay: false, image: false, term: true },
  { path: '/c11/vocabulary-quiz-choseong.html', h1: '초성 퀴즈', overlay: true, image: true, term: false },
  { path: '/c11/vocabulary-quiz-image.html', h1: '그림 퀴즈', overlay: false, image: true, term: false }
];

test.describe('c11 vocabulary separated quiz pages', () => {
  test('keeps quiz entry points on the card page but not on the c11 hub', async ({ page }) => {
    await blockExternalRequests(page);

    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href*="vocabulary-quiz"]')).toHaveCount(0);

    await page.goto('/c11/vocabulary.html', { waitUntil: 'load' });
    await expect(page.locator('[data-view="quiz"]')).toHaveCount(0);
    await expect(page.locator('#quiz-view')).toHaveCount(0);
    await expect(page.locator('#cards-view a[href*="vocabulary-quiz"]')).toHaveCount(3);
    await expect(page.locator('#cards-view a[href="vocabulary-quiz-meaning.html"]')).toHaveCount(1);
    await expect(page.locator('#cards-view a[href="vocabulary-quiz-choseong.html"]')).toHaveCount(1);
    await expect(page.locator('#cards-view a[href="vocabulary-quiz-image.html"]')).toHaveCount(1);
  });

  test('renders each quiz type from shared c11 data and excludes 직급', async ({ page }) => {
    await blockExternalRequests(page);

    for (const quizPage of quizPages) {
      await page.goto(quizPage.path, { waitUntil: 'load' });

      await expect(page.locator('h1')).toHaveText(quizPage.h1);
      await expect(page.locator('.quiz-option')).toHaveCount(4);
      await expect(page.locator('.quiz-option', { hasText: '직급' })).toHaveCount(0);
      await expect(page.locator('.quiz-choseong-overlay')).toHaveCount(quizPage.overlay ? 1 : 0);
      await expect(page.locator('.quiz-term')).toHaveCount(quizPage.term ? 1 : 0);
      await expect(page.locator('.quiz-image')).toHaveCount(quizPage.image ? 1 : 0);

      const dataState = await page.evaluate(() => ({
        wordCount: window.VOCABULARY_CONFIG.words.length,
        quizSourceCount: window.VOCABULARY_CONFIG.words.filter((word) => word.quiz !== false).length,
        jikgeupQuiz: window.VOCABULARY_CONFIG.words.find((word) => word.ko === '직급')?.quiz
      }));
      expect(dataState).toEqual({ wordCount: 28, quizSourceCount: 27, jikgeupQuiz: false });

      if (quizPage.image) {
        const loaded = await page.locator('.quiz-image').evaluate((image) => image.complete && image.naturalWidth > 0);
        expect(loaded).toBe(true);
      }

      await page.locator('.quiz-option').first().click();
      await expect(page.locator('#next-question-btn')).toBeVisible();
    }
  });
});
