const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function expectReferencedImagesLoad(page) {
  const imageSources = await page.locator('img[src*="../assets/c11/listening/cuttoon/"]').evaluateAll((images) => (
    images.map((image) => image.getAttribute('src'))
  ));

  const brokenImages = await page.evaluate(async (sources) => {
    const probes = sources.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(null);
      image.onerror = () => resolve(src);
      image.src = src;
    }));

    return (await Promise.all(probes)).filter(Boolean);
  }, imageSources);

  expect(brokenImages).toEqual([]);
}

test('c11 hub links to the public listening cuttoon page', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('a[href="listening-cuttoon.html#listening1"]')).toContainText('듣기 1 컷툰');
  await expect(page.locator('a[href="listening-cuttoon.html#listening2"]')).toContainText('듣기 2 컷툰');
});

test('c11 listening cuttoon page opens listening 1 and listening 2 separately', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/listening-cuttoon.html#listening1', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toHaveText('11과 듣기 1 컷툰');
  await expect(page.locator('[data-panel-card]')).toHaveCount(6);
  await expect(page.locator('#mainPanelImage')).toHaveAttribute('src', /listening1-cuttoon-panel-01\.webp$/);
  await expectReferencedImagesLoad(page);

  await page.locator('[data-lesson-tab="listening2"]').click();

  await expect(page.locator('h1')).toHaveText('11과 듣기 2 컷툰');
  await expect(page.locator('[data-panel-card]')).toHaveCount(8);
  await expect(page.locator('#mainPanelImage')).toHaveAttribute('src', /listening2-cuttoon-panel-01\.webp$/);
  await expectReferencedImagesLoad(page);

  await page.locator('[data-panel-card="7"] button').click();
  await expect(page.locator('#panelTitle')).toContainText('8. 다시 생각하기');
  await expect(page.locator('#mainPanelImage')).toHaveAttribute('src', /listening2-cuttoon-panel-08\.webp$/);
  await expect(page).toHaveURL(/#listening2-cut-08$/);

  await page.goto('/c11/listening-cuttoon.html#listening2-cut-05', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#panelTitle')).toContainText('5. 바라는 새 회사');
  await expect(page.locator('#mainPanelImage')).toHaveAttribute('src', /listening2-cuttoon-panel-05\.webp$/);
});
