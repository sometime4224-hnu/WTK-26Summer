const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const assetDir = path.join(repoRoot, "assets", "c13", "vocabulary", "images", "wearing-verbs");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

test.describe("c13 wearing verbs support page", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("uses optimized webp assets and switches the viewer", async ({ page }) => {
    const files = [
      "wearing-verbs-01.webp",
      "wearing-verbs-02.webp",
      "wearing-verbs-03.webp",
      "wearing-verbs-04.webp",
      "wearing-verbs-05.webp"
    ];
    for (const file of files) {
      const stat = fs.statSync(path.join(assetDir, file));
      expect(stat.size).toBeLessThan(130_000);
    }

    await page.goto("/c13/vocab-support-wearing-verbs.html", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "의류·장신구 착용 동사", exact: true })).toBeVisible();
    await expect(page.locator("#viewer-image")).toHaveAttribute("src", /wearing-verbs-01\.webp$/);

    await page.getByRole("tab", { name: /매다·메다·들다/ }).click();
    await expect(page.locator("#figure-title")).toHaveText("의류·장신구 착용 동사 2");
    await expect(page.locator("#viewer-image")).toHaveAttribute("src", /wearing-verbs-02\.webp$/);

    await page.getByRole("tab", { name: /자주 쓰는 표현/ }).click();
    await expect(page.locator("#figure-title")).toHaveText("의류·장신구 착용 동사 3");
    await expect(page.locator("#viewer-image")).toHaveAttribute("src", /wearing-verbs-03\.webp$/);

    await page.getByRole("tab", { name: /매다·메다 기억 1/ }).click();
    await expect(page.locator("#figure-title")).toHaveText("매다·메다 쉽게 외우기 1");
    await expect(page.locator("#viewer-image")).toHaveAttribute("src", /wearing-verbs-04\.webp$/);
    await expect(page.locator("#viewer-image")).toHaveAttribute("height", "1125");

    await page.getByRole("tab", { name: /매다·메다 기억 2/ }).click();
    await expect(page.locator("#figure-title")).toHaveText("매다·메다 쉽게 외우기 2");
    await expect(page.locator("#viewer-image")).toHaveAttribute("src", /wearing-verbs-05\.webp$/);

    const naturalWidth = await page.locator("#viewer-image").evaluate((img) => img.naturalWidth);
    expect(naturalWidth).toBe(900);
  });

  test("is linked from the chapter hub vocabulary area", async ({ page }) => {
    await page.goto("/c13/index.html", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("link", { name: /의류·장신구 착용 동사/ })).toHaveAttribute(
      "href",
      "vocab-support-wearing-verbs.html"
    );

    await page.goto("/c13/vocabulary.html", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: "착용 동사" }).first()).toHaveAttribute(
      "href",
      "vocab-support-wearing-verbs.html"
    );
  });
});
