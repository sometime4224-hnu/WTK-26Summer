const { test, expect } = require('@playwright/test');

const LANGUAGES = [
  { code: 'en', label: 'English', firstText: 'to gain weight' },
  { code: 'vi', label: 'Tiếng Việt', firstText: 'tăng cân' },
  { code: 'ar', label: 'العربية', firstText: 'يزداد وزنه' },
  { code: 'mn', label: 'Монгол', firstText: 'жин нэмэх' },
  { code: 'kk', label: 'Қазақша', firstText: 'салмақ қосу' },
  { code: 'th', label: 'ไทย', firstText: 'น้ำหนักขึ้น' }
];

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

test.describe('c12 vocabulary multilingual support', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c12/vocabulary.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
  });

  test('merges standard translations for every split vocabulary item', async ({ page }) => {
    const coverage = await page.evaluate((languages) => {
      const words = window.VOCABULARY_CONFIG.words;
      return {
        wordCount: words.length,
        activeIds: words.map((word) => word.id),
        staleGroupedIds: words
          .map((word) => word.id)
          .filter((id) => ['c12-vocab-01', 'c12-vocab-02', 'c12-vocab-03', 'c12-vocab-04'].includes(id)),
        missing: words.flatMap((word) => languages
          .filter((lang) => !String(word[lang] || '').trim())
          .map((lang) => `${word.id}:${lang}`))
      };
    }, LANGUAGES.map((lang) => lang.code));

    expect(coverage.wordCount).toBe(24);
    expect(coverage.activeIds).toEqual(expect.arrayContaining([
      'c12-vocab-01a',
      'c12-vocab-01b',
      'c12-vocab-02a',
      'c12-vocab-02b',
      'c12-vocab-03a',
      'c12-vocab-03b',
      'c12-vocab-04a',
      'c12-vocab-04b'
    ]));
    expect(coverage.staleGroupedIds).toEqual([]);
    expect(coverage.missing).toEqual([]);
  });

  test('updates card, list, and quiz UI for the selected language', async ({ page }) => {
    const firstCard = page.locator('.word-card').nth(0);
    await expect(page.locator('.word-card')).toHaveCount(24);

    for (const lang of LANGUAGES) {
      await page.locator(`[data-multilang-btn="${lang.code}"]`).click();
      await firstCard.click();
      await expect(firstCard.locator('.word-card__lang')).toHaveText(lang.label);
      await expect(firstCard.locator('.word-card__translation-text')).toHaveText(lang.firstText);
      await expect(firstCard.locator('.word-card__translation-text')).not.toHaveText('체중이 늘다.');
      await firstCard.click();
    }

    await page.locator('[data-view="list"]').click();
    await expect(page.locator('.list-item').nth(0).locator('.translation-cell')).toHaveCount(6);

    await page.locator(`[data-multilang-btn="ar"]`).click();
    await page.locator('[data-view="quiz"]').click();
    await expect(page.locator('.quiz-option')).toHaveCount(4);
    const optionDirs = await page.locator('.quiz-option').evaluateAll((options) => options.map((option) => option.dir));
    expect(optionDirs).toEqual(['rtl', 'rtl', 'rtl', 'rtl']);
  });
});
