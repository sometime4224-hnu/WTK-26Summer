const { test, expect } = require("@playwright/test");

test.describe("korean keyboard writing standalone hub", () => {
  test("loads the hub with both activity links", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await expect(page).toHaveTitle("한글 입력 수업 허브");
    await expect(page.locator("h1")).toHaveText("한글 입력 수업 허브");
    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toContainText("한글 자판 25분 수업");
    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toHaveAttribute("href", "../korean-keyboard-practice-lesson/index.html");
    await expect(page.locator('[data-hub-link="c12-writing"]')).toContainText("12과 표현 타이핑 연습");
    await expect(page.locator('[data-hub-link="c12-writing"]')).toHaveAttribute("href", "../../c12/writing-keyboard-builder.html");
    await expect(page.locator(".mini-key.is-next")).toContainText("ㄱ");
  });

  test("opens the keyboard lesson from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="keyboard-lesson"]').click();
    await expect(page).toHaveURL(/\/apps\/korean-keyboard-practice-lesson\/index\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("준비");
  });

  test("opens the C12 expression typing builder from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-writing"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-keyboard-builder\.html$/);
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
  });

  test("is linked from the common apps hub", async ({ page }) => {
    await page.goto("/apps/index.html");

    const hubLink = page.locator('a[href="standalone-pages/korean-keyboard-writing-hub.html"]');
    await expect(hubLink).toHaveCount(1);
    await expect(hubLink).toContainText("한글 입력 수업 허브");
  });

  test("keeps the two activity cards visible on mobile without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toBeInViewport();
    await expect(page.locator('[data-hub-link="c12-writing"]')).toBeInViewport();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
