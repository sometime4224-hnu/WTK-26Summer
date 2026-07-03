const { test, expect } = require('@playwright/test');

test.describe('Review 4 listening transcripts', () => {
  test('renders every listening transcript and filters the list', async ({ page }) => {
    await page.goto('/review/review4-html/listening-transcripts.html', { waitUntil: 'load' });

    await expect(page.getByRole('heading', { name: '듣기 지문' })).toBeVisible();
    await expect(page.locator('.transcript-card')).toHaveCount(16);
    await expect(page.locator('.transcript-card').first()).toContainText('track 05 · 1번');
    await expect(page.locator('.transcript-card').first()).toContainText('자, 똑바로 서서 오른발을 왼쪽 다리에 붙이세요.');

    await page.locator('#transcriptSearch').fill('은행장');
    await expect(page.locator('.transcript-card:visible')).toHaveCount(2);
    await expect(page.locator('#transcriptFilterStatus')).toContainText('검색 결과 2개');

    await page.locator('#transcriptSearch').fill('없는검색어');
    await expect(page.locator('.transcript-card:visible')).toHaveCount(0);
    await expect(page.locator('#transcriptEmpty')).toBeVisible();
  });

  test('links to the transcript page from the listening start screen', async ({ page }) => {
    await page.goto('/review/review4-html/listening.html', { waitUntil: 'load' });

    const transcriptLink = page.locator('a[href="listening-transcripts.html"]');
    await expect(transcriptLink).toBeVisible();
    await expect(transcriptLink).toContainText('듣기 지문 보기');

    await transcriptLink.click();
    await expect(page).toHaveURL(/listening-transcripts\.html$/);
    await expect(page.getByRole('heading', { name: '듣기 지문' })).toBeVisible();
  });
});
