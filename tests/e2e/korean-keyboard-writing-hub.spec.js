const { test, expect } = require("@playwright/test");

test.describe("korean keyboard writing standalone hub", () => {
  test("loads the hub with all typing activity links", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await expect(page).toHaveTitle("한글 입력 수업 허브");
    await expect(page.locator("h1")).toHaveText("한글 입력 수업 허브");
    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toContainText("한글 자판 25분 수업");
    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toHaveAttribute("href", "../korean-keyboard-practice-lesson/index.html");
    await expect(page.locator('[data-hub-link="c12-writing"]')).toContainText("12과 표현 타이핑 연습");
    await expect(page.locator('[data-hub-link="c12-writing"]')).toHaveAttribute("href", "../../c12/writing-keyboard-builder.html");
    await expect(page.locator('[data-hub-link="c12-writing-expression-learning"]')).toContainText("12과 쓰기 주제 표현 학습");
    await expect(page.locator('[data-hub-link="c12-writing-expression-learning"]')).toHaveAttribute("href", "../../c12/writing-expression-learning.html");
    await expect(page.locator('[data-hub-link="c12-writing-expression-assembly"]')).toContainText("12과 쓰기 표현 조립 연습");
    await expect(page.locator('[data-hub-link="c12-writing-expression-assembly"]')).toHaveAttribute("href", "../../c12/writing-expression-assembly.html");
    await expect(page.locator('a[href="../../c12/writing-expression-reference.html"]')).toHaveCount(0);
    await expect(page.locator('[data-hub-link="c12-motion-typing"]')).toContainText("12과 동작 표현 타이핑 연습");
    await expect(page.locator('[data-hub-link="c12-motion-typing"]')).toHaveAttribute("href", "../../c12/writing-motion-typing.html");
    await expect(page.locator('[data-hub-link="c12-motion-typing-game"]')).toContainText("12과 어휘 표현 애니메이션 타이핑");
    await expect(page.locator('[data-hub-link="c12-motion-typing-game"]')).toHaveAttribute("href", "../../c12/writing-motion-typing-game.html");
    await expect(page.locator('[data-hub-link="c12-writing-shower"]')).toContainText("12과 쓰기 소나기");
    await expect(page.locator('[data-hub-link="c12-writing-shower"]')).toHaveAttribute("href", "../../c12/writing-shower.html");
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

  test("opens the C12 writing topic expression learning page from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-writing-expression-learning"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-expression-learning\.html$/);
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
  });

  test("opens the C12 writing expression assembly page from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-writing-expression-assembly"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-expression-assembly\.html$/);
    await expect(page.locator("#stageTitle")).toHaveText("상황 파악");
  });

  test("opens the C12 motion expression typing trainer from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-motion-typing"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-motion-typing\.html$/);
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "ready");
  });

  test("opens the C12 vocabulary animation typing trainer from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-motion-typing-game"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-motion-typing-game\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "ready");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "ready");
  });

  test("opens the C12 writing shower from the hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await page.locator('[data-hub-link="c12-writing-shower"]').click();
    await expect(page).toHaveURL(/\/c12\/writing-shower\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("초급 쓰기");
    await expect(page.locator(".stage-chip")).toHaveCount(18);
  });

  test("is linked from the common apps hub", async ({ page }) => {
    await page.goto("/apps/index.html");

    const hubLink = page.locator('a[href="standalone-pages/korean-keyboard-writing-hub.html"]');
    await expect(hubLink).toHaveCount(1);
    await expect(hubLink).toContainText("한글 입력 수업 허브");
  });

  test("keeps the typing activity cards visible on mobile without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");

    await expect(page.locator('[data-hub-link="keyboard-lesson"]')).toBeInViewport();
    await expect(page.locator('[data-hub-link="c12-writing"]')).toBeInViewport();
    await expect(page.locator('[data-hub-link="c12-writing-expression-learning"]')).toBeVisible();
    await expect(page.locator('[data-hub-link="c12-writing-expression-assembly"]')).toBeVisible();
    await expect(page.locator('[data-hub-link="c12-motion-typing"]')).toBeVisible();
    await expect(page.locator('[data-hub-link="c12-motion-typing-game"]')).toBeVisible();
    await expect(page.locator('[data-hub-link="c12-writing-shower"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
