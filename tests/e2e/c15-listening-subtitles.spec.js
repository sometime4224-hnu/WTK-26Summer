const { test, expect } = require('@playwright/test');

const listeningPages = [
  { url: '/c15/listening1.html', lessonId: 'track63' },
  { url: '/c15/listening2.html', lessonId: 'track64' }
];

for (const listeningPage of listeningPages) {
  test(`c15 ${listeningPage.lessonId} makes the full transcript available immediately`, async ({ page }) => {
    await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
    await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
    await page.goto(listeningPage.url, { waitUntil: 'domcontentloaded' });

    const subtitleSection = page.locator(`#subtitle-section-${listeningPage.lessonId}`);
    const stageButtons = subtitleSection.locator('[data-action="set-stage"]');

    await expect(stageButtons).toHaveCount(3);
    await expect(stageButtons).toHaveText(['자막 없음', '핵심어만', '전체 대본']);
    await expect(subtitleSection.locator('[data-action="set-stage"].is-locked')).toHaveCount(0);
    await expect(subtitleSection.locator('[data-stage="3"]')).toHaveCount(0);
    await expect(page.locator(`#listen-status-${listeningPage.lessonId}`)).toContainText('현재 청취 횟수: 0회');
    await expect(page.getByText('청취 횟수와 관계없이 핵심어와 전체 대본을 모두 선택할 수 있습니다.', { exact: true })).toBeVisible();

    await page.evaluate(() => {
      localStorage.setItem(
        `korean3b.listening.v3:${location.pathname.toLowerCase()}:page:instruction-language`,
        JSON.stringify('vi')
      );
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(stageButtons).toHaveText(['Không có phụ đề', 'Chỉ hiện từ khóa', 'Toàn bộ văn bản']);
    await expect(page.locator(`#stage-meta-${listeningPage.lessonId}`)).toContainText(
      'Mức hiện tại: Không có phụ đề · có thể chọn tất cả các mức phụ đề.'
    );
    await expect(page.getByText('Nghe trước khi xem chữ', { exact: true })).toBeVisible();

    await subtitleSection.locator('[data-stage="2"]').click();
    await expect(subtitleSection.locator('.lw-line-text').first()).toBeVisible();
    await expect(subtitleSection.locator('.lw-line-translation')).toHaveCount(0);

    await page.evaluate(({ lessonId }) => {
      localStorage.setItem(`korean3b.listening.v3:${location.pathname.toLowerCase()}:${lessonId}:stage`, '3');
    }, listeningPage);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`#subtitle-section-${listeningPage.lessonId} [data-stage="2"]`)).toHaveClass(/is-active/);
    await expect(page.locator(`#subtitle-section-${listeningPage.lessonId} [data-stage="3"]`)).toHaveCount(0);
  });
}
