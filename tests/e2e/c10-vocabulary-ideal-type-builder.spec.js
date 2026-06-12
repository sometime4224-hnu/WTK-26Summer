const { test, expect } = require('@playwright/test');

test.describe('c10 ideal type vocabulary builder', () => {
  test('builds beginner and intermediate output from selected vocabulary cards', async ({ page }) => {
    await page.goto('/c10/vocabulary-ideal-type-builder.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.localStorage.removeItem('c10-ideal-type-builder-v1'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('이상형 조건 만들기');
    await expect(page.locator('.vocab-card')).toHaveCount(33);
    await expect(page.locator('#generateBtn')).toBeDisabled();

    await page.locator('[data-category="basic"]').click();
    await expect(page.locator('.vocab-card')).toHaveCount(8);
    await expect(page.locator('.vocab-card[data-id="c10-basic-01"]')).toContainText('예쁘다');
    await page.locator('[data-category="all"]').click();
    await expect(page.locator('.vocab-card')).toHaveCount(33);

    await page.locator('[data-sample="warm"]').click();
    await expect(page.locator('#selectedMetric')).toHaveText('4');

    await page.locator('#generateBtn').click();
    await expect(page.locator('#copyBtn')).toBeEnabled();
    await expect(page.locator('.sentence-list li')).toHaveCount(6);
    await expect(page.locator('#paragraphText')).toContainText('제 이상형은 마음씨가 착하고');
    await expect(page.locator('#paragraphText')).toContainText('그 사람은 저와 말이 잘 통합니다.');

    await page.locator('[data-level="intermediate"]').click();
    await expect(page.locator('#levelMetric')).toHaveText('중급');
    await expect(page.locator('#paragraphText')).toContainText('마음씨가 착해서 주변 사람을 잘 배려하는 사람이면 좋겠습니다.');
  });

  test('is reachable from the c10 hub', async ({ page }) => {
    await page.goto('/c10/index.html', { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="vocabulary-ideal-type-builder.html"]').click();

    await expect(page).toHaveURL(/\/c10\/vocabulary-ideal-type-builder\.html$/);
    await expect(page.locator('h1')).toHaveText('이상형 조건 만들기');
  });
});
