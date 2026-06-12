const { test, expect } = require('@playwright/test');

test.describe('c10 ideal type vocabulary builder', () => {
  test('builds beginner and intermediate output from selected vocabulary cards', async ({ page }) => {
    await page.goto('/c10/vocabulary-ideal-type-builder.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.localStorage.removeItem('c10-ideal-type-builder-v1'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('이상형 조건 만들기');
    await expect(page.locator('.vocab-card')).toHaveCount(41);
    await expect(page.locator('#generateBtn')).toBeDisabled();

    await page.locator('[data-category="basic"]').click();
    await expect(page.locator('.vocab-card')).toHaveCount(8);
    await expect(page.locator('.vocab-card[data-id="c10-basic-01"]')).toContainText('예쁘다');

    await page.locator('[data-category="condition"]').click();
    await expect(page.locator('.vocab-card')).toHaveCount(8);
    await expect(page.locator('.vocab-card[data-id="c10-condition-01"]')).toContainText('돈이 많다');

    await page.locator('[data-category="all"]').click();
    await expect(page.locator('.vocab-card')).toHaveCount(41);

    await page.locator('[data-sample="condition"]').click();
    await expect(page.locator('#selectedMetric')).toHaveText('5');
    await expect(page.locator('#importantCount')).toHaveText('3');
    await expect(page.locator('#notImportantCount')).toHaveText('2');

    await page.locator('#generateBtn').click();
    await expect(page.locator('.bank-panel')).toBeHidden();
    await expect(page.locator('.output-panel')).toBeVisible();
    await expect(page.locator('#copyBtn')).toBeEnabled();
    await expect(page.locator('#paragraphText')).toContainText('저는 돈이 많은 것을 중요하게 생각합니다.');
    await expect(page.locator('#paragraphText')).toContainText('저는 집이 큰 것을 중요하게 생각하지 않습니다.');

    await page.locator('[data-level="intermediate"]').click();
    await expect(page.locator('#levelMetric')).toHaveText('중급');
    await expect(page.locator('#paragraphText')).toContainText('돈이 많은 것은 제 이상형에서 중요한 조건입니다.');
    await expect(page.locator('#paragraphText')).toContainText('집이 큰 것은 있으면 좋지만 꼭 중요하지는 않습니다.');

    await page.locator('#editCardsBtn').click();
    await expect(page.locator('.bank-panel')).toBeVisible();
    await expect(page.locator('.output-panel')).toBeHidden();
  });

  test('is reachable from the c10 hub', async ({ page }) => {
    await page.goto('/c10/index.html', { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="vocabulary-ideal-type-builder.html"]').click();

    await expect(page).toHaveURL(/\/c10\/vocabulary-ideal-type-builder\.html$/);
    await expect(page.locator('h1')).toHaveText('이상형 조건 만들기');
  });
});
