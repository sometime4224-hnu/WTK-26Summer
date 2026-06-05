const { test, expect } = require("@playwright/test");

const deployBase = "https://sometime4224-hnu.github.io/WTK-26Summer/";
const representativePages = [
  "/c10/index.html",
  "/c16/listening1.html",
  "/c17/vocabulary.html",
  "/review/index.html",
  "/apps/grammar-detective/index.html"
];

test.describe("page QR overlay", () => {
  test("injects a PC QR button into a topbar and opens a deploy-url QR panel", async ({ page }) => {
    const expectedUrl = `${deployBase}c10/index.html`;
    await page.goto("/c10/index.html");

    const trigger = page.locator("#page-qr-trigger");
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveText("QR");

    await trigger.click();

    const panel = page.locator("#page-qr-panel");
    await expect(panel).toBeVisible();
    await expect(page.locator("#page-qr-url")).toHaveAttribute("href", expectedUrl);
    await expect(page.locator("#page-qr-canvas")).toHaveAttribute("data-qr-url", expectedUrl);
    await expect.poll(() => page.evaluate(() => typeof window.qrcode)).toBe("function");

    const sizeReadout = page.locator("#page-qr-size-readout");
    const initialSize = Number((await sizeReadout.textContent()).replace("px", ""));
    await page.locator('[data-qr-size="+"]').click();
    await expect(sizeReadout).toHaveText(`${Math.min(initialSize + 30, 420)}px`);

    await page.locator('[data-qr-position="top-center"]').click();
    await expect(panel).toHaveAttribute("data-position", "top-center");
  });

  test("keeps the default QR button hidden on a phone-sized viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c10/index.html");

    await expect(page.locator("#page-qr-trigger")).toBeHidden();

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator("#page-qr-trigger")).toBeVisible();
  });

  for (const pagePath of representativePages) {
    test(`shows on desktop and stays mobile-hidden for ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      await expect(page.locator("#page-qr-trigger")).toBeVisible();

      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.locator("#page-qr-trigger")).toBeHidden();
    });
  }
});
