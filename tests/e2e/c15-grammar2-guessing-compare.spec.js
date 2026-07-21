const { test, expect } = require("@playwright/test");

const PAGE_PATH = "/c15/grammar2-guessing-compare.html";
const STORAGE_KEY = "korean3bimprove:c15:grammar2:compare-quiz:v1";

test("c15 grammar2 and the lesson hub link to the comparison quiz", async ({ page }) => {
  await page.goto("/c15/grammar2.html");
  const grammarLink = page.locator('a[href="grammar2-guessing-compare.html"]');
  await expect(grammarLink).toHaveCount(1);
  await expect(grammarLink).toContainText("비교 퀴즈");

  await page.goto("/c15/index.html");
  const hubLink = page.locator('a[href="grammar2-guessing-compare.html"]');
  await expect(hubLink).toHaveCount(1);
  await expect(hubLink).toContainText("것 같아요? 걸요? 비교 퀴즈");
});

test("c15 grammar2 comparison quiz explains, grades, restores, and restarts", async ({ page }) => {
  await page.goto(PAGE_PATH);

  await expect(page.locator("h1")).toHaveText("것 같아요? 걸요?");
  await expect(page.locator(".expression-card")).toHaveCount(2);
  await expect(page.locator(".expression-card").first()).toContainText("상대에게 내 생각을 조심스럽게 말해요");
  await expect(page.locator(".expression-card").last()).toContainText("상대의 예상에 바로 반응해");
  await expect(page.locator(".contrast-emphasis")).toHaveText("다른 생각");
  await expect(page.locator(".expression-card").first()).toContainText("조금 늦을 것 같아요");
  await expect(page.locator(".expression-card").last()).toContainText("사람이 많을걸요");
  await expect(page.locator(".expression-card").last()).toContainText("사람이 많이 없겠죠?");
  await expect(page.locator("#progress")).toHaveText("1 / 15");
  await expect(page.locator("#choices .choice")).toHaveCount(2);

  await page.locator('[data-form="geol"]').click();
  await expect(page.locator("#feedback")).toHaveClass(/try/);
  await expect(page.locator("#feedback")).toContainText("길이 막혀서 조금 늦을 것 같아요");
  await expect(page.locator("#choices .choice").first()).toBeDisabled();
  await expect(page.locator("#choices .choice").last()).toBeDisabled();
  await expect(page.locator("#nextButton")).toBeVisible();

  await page.reload();
  await expect(page.locator("#feedback")).toContainText("길이 막혀서 조금 늦을 것 같아요");
  await expect(page.locator("#nextButton")).toBeVisible();

  const remainingAnswers = [
    "geot", "geot", "geol", "geol", "geol",
    "geot", "geol", "geot", "geol", "geot",
    "geol", "geot", "geol", "geot"
  ];
  for (const answer of remainingAnswers) {
    await page.locator("#nextButton").click();
    await page.locator(`[data-form="${answer}"]`).click();
  }
  await page.locator("#nextButton").click();

  await expect(page.locator("#resultSection")).toBeVisible();
  await expect(page.locator("#resultText")).toContainText("15문항 중 14문항");

  await page.locator("#retryButton").click();
  await expect(page.locator("#quizSection")).toBeVisible();
  await expect(page.locator("#progress")).toHaveText("1 / 15");
  await expect(page.locator("#feedback")).toBeHidden();
});

test("c15 grammar2 comparison quiz migrates saved six-question progress", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      schemaVersion: 1,
      currentIndex: 5,
      answers: ["geot", "geot", "geot", "geol", "geol", "geol"],
      completed: true
    }));
  }, STORAGE_KEY);
  await page.goto(PAGE_PATH);

  await expect(page.locator("#progress")).toHaveText("7 / 15");
  await expect(page.locator("#scene")).toContainText("유진 씨가 발표를 잘했겠죠?");
  await expect(page.locator("#storageStatus")).toContainText("기존 6문항 진행을 이어서 저장했어요");
});

test("c15 grammar2 comparison quiz keeps the first action usable on narrow screens and by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGE_PATH);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBeFalsy();
  await expect(page.locator("#quizSection")).toBeInViewport();
  await expect(page.locator("#choices .choice").first()).toBeVisible();

  const lastChoiceBox = await page.locator("#choices .choice").last().boundingBox();
  expect(lastChoiceBox).not.toBeNull();
  expect(lastChoiceBox.height).toBeGreaterThanOrEqual(54);
  expect(lastChoiceBox.y + lastChoiceBox.height).toBeLessThanOrEqual(844);

  await page.locator('[data-form="geot"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#feedback")).toContainText("맞아요");
  await expect(page.locator("#nextButton")).toBeFocused();

  await page.setViewportSize({ width: 320, height: 844 });
  await page.reload();
  const narrowOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(narrowOverflow).toBeFalsy();
  await expect(page.locator("#choices .choice").first()).toBeVisible();
});

test("c15 grammar2 comparison quiz keeps work in memory when storage fails and supports confirmed reset", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
    Storage.prototype.setItem = () => { throw new Error("storage full"); };
  }, STORAGE_KEY);
  await page.goto(PAGE_PATH);

  await page.locator('[data-form="geot"]').click();
  await expect(page.locator("#storageStatus")).toContainText("저장할 수 없어요");
  await expect(page.locator("#copyButton")).toBeVisible();
  await expect(page.locator("#feedback")).toContainText("맞아요");

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#resetButton").click();
  await expect(page.locator("#progress")).toHaveText("1 / 15");
  await expect(page.locator("#feedback")).toBeHidden();
});
