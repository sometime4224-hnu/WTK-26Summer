const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

function appFileUrl() {
  return pathToFileURL(path.resolve(__dirname, "../../apps/articulation-asset-sandbox/index.html")).href;
}

test.describe("articulation asset sandbox", () => {
  test("loads pronunciation assets and manipulates a stage layer", async ({ page }) => {
    await page.goto("/apps/articulation-asset-sandbox/index.html");

    await expect(page.locator(".brand-mark")).toContainText("발음 에셋 샌드박스");
    await expect(page.locator(".asset-card")).toHaveCount(219);
    await expect(page.locator(".stage-layer")).toHaveCount(3);

    await page.locator('.filter-button[data-filter="air"]').click();
    await expect(page.locator(".filter-button.is-active")).toHaveText("숨");
    await expect(page.locator('.asset-card[data-asset-id="airflow-soft-out"]')).toBeVisible();

    await page.locator('.asset-card[data-asset-id="airflow-soft-out"]').click();
    await expect(page.locator(".stage-layer")).toHaveCount(4);

    await page.locator('.filter-button[data-filter="mouth"]').click();
    await expect(page.locator(".filter-button.is-active")).toHaveText("입술");
    await expect(page.locator('.asset-card[data-asset-id="mouth-front-wide-open"]')).toBeVisible();

    await page.locator('.filter-button[data-filter="nasal"]').click();
    await expect(page.locator(".filter-button.is-active")).toHaveText("코");
    await expect(page.locator('.asset-card[data-asset-id="nasal-route-blue"]')).toBeVisible();

    await page.locator("#scaleControl").fill("72");
    await expect(page.locator(".stage-layer.is-selected")).toHaveCSS("width", /[0-9.]+px/);

    await page.locator('[data-preset="compare"]').click();
    await expect(page.locator(".stage-layer")).toHaveCount(3);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/articulation-asset-sandbox/index.html");

    await expect(page.locator(".asset-stage")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("loads asset cards when opened directly from the file system", async ({ page }) => {
    await page.goto(appFileUrl());

    await expect(page.locator(".asset-card")).toHaveCount(219);
    await expect(page.getByText("에셋 로드 실패")).toHaveCount(0);
    await page.waitForFunction(() =>
      Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
    );
  });
});
