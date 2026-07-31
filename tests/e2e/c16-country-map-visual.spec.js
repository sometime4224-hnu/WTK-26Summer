const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const countries = [
  {
    country: 'vietnam',
    path: '/c16/grammar4-vietnam-map-match.html'
  },
  {
    country: 'mongolia',
    path: '/c16/grammar4-mongolia-map-match.html'
  },
  {
    country: 'kazakhstan',
    path: '/c16/grammar4-kazakhstan-map-match.html'
  },
  {
    country: 'syria',
    path: '/c16/grammar4-syria-map-match.html'
  },
  {
    country: 'thailand',
    path: '/c16/grammar4-thailand-map-match.html'
  }
];
const outputDir = path.resolve('test-results', 'c16-country-map-visual');

test.beforeAll(() => {
  fs.mkdirSync(outputDir, { recursive: true });
});

for (const { country, path: target } of countries) {
  test(`${country} visual QA captures desktop, mobile, and activity layout`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(target, { waitUntil: 'domcontentloaded' });
    await page.locator('.map-image').evaluate((image) => image.decode());
    await expect(page.locator('.map-image')).toBeVisible();
    await page.screenshot({
      path: path.join(outputDir, `${country}-desktop.png`)
    });
    await page.locator('.layout').screenshot({
      path: path.join(outputDir, `${country}-layout.png`)
    });

    const regionIds = await page.locator('[data-region]').evaluateAll(
      (buttons) => buttons.map((button) => button.dataset.region)
    );
    for (const regionId of regionIds) {
      await page.locator(`[data-region="${regionId}"]`).click();
      await expect(page.locator(`[data-region="${regionId}"]`))
        .toHaveAttribute('aria-pressed', 'true');
      await page.locator('#mapCanvas').screenshot({
        path: path.join(outputDir, `${country}-${regionId}-desktop.png`)
      });
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.map-image').evaluate((image) => image.decode());
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: path.join(outputDir, `${country}-mobile.png`)
    });

    for (const regionId of regionIds) {
      await page.locator(`[data-region="${regionId}"]`).click();
      await expect(page.locator(`[data-region="${regionId}"]`))
        .toHaveAttribute('aria-pressed', 'true');
      await page.locator('#mapCanvas').screenshot({
        path: path.join(outputDir, `${country}-${regionId}-mobile.png`)
      });
    }
  });
}
