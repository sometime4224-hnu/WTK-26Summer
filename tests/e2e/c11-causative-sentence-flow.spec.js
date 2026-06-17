const { test, expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c11 causative sentence flow support page loads slides and advances', async ({ page }) => {
  const viewports = [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar1-causative-sentence-flow.html', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: '사동 문장 만들기 흐름' })).toBeVisible();
    await expect(page.locator('#stepCounter')).toHaveText('1 / 8');
    await expect(page.locator('.thumb-button')).toHaveCount(8);

    const slideImage = page.locator('#slideImage');
    await expect(slideImage).toBeVisible();
    await expect.poll(() => slideImage.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('#loadingText')).toBeHidden();
    await expect(page.locator('#fullscreenBtn')).toBeVisible();
    await expect.poll(async () => {
      const imageBox = await slideImage.boundingBox();
      const buttonBox = await page.locator('#fullscreenBtn').boundingBox();
      if (!imageBox || !buttonBox) return false;
      return (
        buttonBox.x >= imageBox.x &&
        buttonBox.y >= imageBox.y &&
        buttonBox.x + buttonBox.width <= imageBox.x + imageBox.width + 1 &&
        buttonBox.y + buttonBox.height <= imageBox.y + imageBox.height + 1
      );
    }).toBe(true);

    await page.getByRole('button', { name: '다음 단계' }).click();
    await expect(page.locator('#stepCounter')).toHaveText('2 / 8');
    await expect(page.locator('#slideTitle')).toContainText('B가 C를 하는 말');
    await expect(slideImage).toBeVisible();

    await page.locator('#fullscreenBtn').click();
    await expect(page.locator('#imageWrap')).toHaveClass(/is-fullscreen/);
    await expect(page.locator('#fullscreenBtn')).toHaveText('나가기');

    await page.locator('#fullscreenNextZone').click({ force: true });
    await expect(page.locator('#stepCounter')).toHaveText('3 / 8');

    await page.locator('#fullscreenPrevZone').click({ force: true });
    await expect(page.locator('#stepCounter')).toHaveText('2 / 8');

    await page.locator('#fullscreenBtn').click();
    await expect(page.locator('#fullscreenBtn')).toHaveText('전체화면');

    await expectNoHorizontalOverflow(page);
  }
});
