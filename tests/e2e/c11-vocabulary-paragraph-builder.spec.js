const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

const orderedWordIds = [
  'c11-vocab-01',
  'c11-vocab-02',
  'c11-vocab-03',
  'c11-vocab-04',
  'c11-vocab-05',
  'c11-vocab-06',
  'c11-vocab-07',
  'c11-vocab-08',
  'c11-vocab-09',
  'c11-vocab-10',
  'c11-vocab-11',
  'c11-vocab-12',
  'c11-vocab-13',
  'c11-vocab-14',
  'c11-vocab-23',
  'c11-vocab-15',
  'c11-vocab-16',
  'c11-vocab-17',
  'c11-vocab-18',
  'c11-vocab-19',
  'c11-vocab-20',
  'c11-vocab-21',
  'c11-vocab-28',
  'c11-vocab-22',
  'c11-vocab-24',
  'c11-vocab-25',
  'c11-vocab-26',
  'c11-vocab-27'
];

test.describe('c11 vocabulary paragraph builder', () => {
  test('assembles two workplace vocabulary texts from grouped picture chips', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocabulary-paragraph-builder.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.localStorage.removeItem('c11.vocabulary.paragraphBuilder.progress.v1'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toHaveText('그림 문장 조립');
    await expect(page.locator('.word-chip')).toHaveCount(28);
    await expect(page.locator('.word-group')).toHaveCount(2);
    await expect(page.locator('.word-group')).toContainText(['글 1. 아르바이트 지원 후보', '글 2. 회사 근무와 조건 후보']);
    await expect(page.locator('#matched-count')).toHaveText('0 / 28');
    await expect(page.locator('#sentence-count')).toHaveText('0 / 7');
    await expect(page.locator('#current-sentence-card')).toContainText('채용 공고');

    await page.locator('[data-word-id="c11-vocab-01"]').click();
    await page.locator('#drop-zone').click();
    await expect(page.locator('#matched-count')).toHaveText('1 / 28');
    await expect(page.locator('#current-sentence-card')).toContainText('아르바이트');

    for (const wordId of orderedWordIds.slice(1)) {
      await page.locator(`[data-word-id="${wordId}"]`).click();
      await page.locator('#drop-zone').click();
    }

    await expect(page.locator('#matched-count')).toHaveText('28 / 28');
    await expect(page.locator('#sentence-count')).toHaveText('7 / 7');
    await expect(page.locator('#completion-banner')).toHaveClass(/is-visible/);
    await expect(page.locator('#paragraph-list')).toContainText('민지는 방학 동안 할 아르바이트를 찾다가');
    await expect(page.locator('#paragraph-list')).toContainText('수진은 중소기업에 신입 사원으로 들어가');
    await expect(page.locator('#paragraph-list')).toContainText('수진은 나중에 대기업으로 옮기면');
  });

  test('is reachable from the c11 hub', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

    await page.locator('summary.support-drawer__summary').first().click();
    await page.getByRole('link', { name: /그림 문장 조립/ }).click();

    await expect(page).toHaveURL(/\/c11\/vocabulary-paragraph-builder\.html$/);
    await expect(page.locator('h1')).toHaveText('그림 문장 조립');
  });
});
