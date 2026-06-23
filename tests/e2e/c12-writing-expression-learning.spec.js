const { test, expect } = require("@playwright/test");

test.describe("C12 writing topic expression learning", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-expression-learning.html");
    await page.evaluate(() => localStorage.removeItem("c12_writing_expression_learning_v1"));
    await page.reload();
  });

  test("loads with focus, stages, categories, and multilingual controls", async ({ page }) => {
    await expect(page).toHaveTitle("12과 쓰기 주제 표현 학습");
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#typingInput")).toBeFocused();
    await expect(page.locator("#progressDots button")).toHaveCount(6);
    await expect(page.locator(".category-pill")).toHaveText([
      "건강 노력",
      "생활 운동 방법",
      "운동 효과",
      "공감",
      "권유",
      "연결 표현"
    ]);
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator("[data-lang].lang-visible")).toHaveCount(0);
  });

  test("blocks English input and then advances through choosing and typing", async ({ page }) => {
    await page.locator("#typingInput").fill("exercise");
    await expect(page.locator("#feedbackText")).toContainText("한/영 키");

    await page.locator("#typingInput").fill("운동");
    await expect(page.locator("#stageTitle")).toHaveText("상황 보고 표현 고르기");
    await expect(page.locator("#choiceGrid .choice-btn")).toHaveCount(3);

    const target = await page.evaluate(() => window.__C12_WRITING_EXPRESSION_LEARNING__.expressions[0].target);
    await page.locator("#choiceGrid .choice-btn", { hasText: target }).click();
    await expect(page.locator("#stageTitle")).toHaveText("정확히 타이핑");

    await page.locator("#typingInput").fill(target.slice(0, 2) + "가");
    await expect(page.locator("#targetText .is-wrong")).not.toHaveCount(0);

    await page.locator("#typingInput").fill(target);
    await expect(page.locator("#stageTitle")).toHaveText("상황 보고 표현 고르기");
    await expect(page.locator("#itemMeta")).toContainText("2 /");
    await expect(page.locator("#statCorrect")).toHaveText("1");
  });

  test("keeps selected translation language after item changes", async ({ page }) => {
    await page.locator("#typingInput").fill("운동");
    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('[data-lang="en"].lang-visible')).toContainText("Drink plenty of water");

    const target = await page.evaluate(() => window.__C12_WRITING_EXPRESSION_LEARNING__.expressions[0].target);
    await page.locator("#choiceGrid .choice-btn", { hasText: target }).click();
    await page.locator("#typingInput").fill(target);
    await expect(page.locator('[data-lang="en"].lang-visible')).toBeVisible();
  });

  test("recall stage shows hint and report", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("c12_writing_expression_learning_v1", JSON.stringify({
        stageIndex: 3,
        itemIndex: 33,
        recallIndex: 0,
        selectedChoice: "",
        stats: { practiced: {}, correct: {}, choices: {}, wrong: {}, hints: {} }
      }));
    });
    await page.reload();

    await expect(page.locator("#stageTitle")).toHaveText("초성 회상");
    await expect(page.locator("#hintButton")).toBeVisible();
    await page.locator("#hintButton").click();
    await expect(page.locator("#feedbackText")).toContainText("건강 노력");

    const answer = await page.evaluate(() => window.__C12_WRITING_EXPRESSION_LEARNING__.expressions.find((item) => item.id === "health-water").target);
    await page.locator("#typingInput").fill(answer);
    await page.locator("#checkButton").click();
    await expect(page.locator("#statCorrect")).toHaveText("1");

    await page.locator("#reportButton").click();
    await expect(page.locator("#stageTitle")).toHaveText("학습 리포트");
    await expect(page.locator("#reportPanel")).toBeVisible();
  });

  test("is linked from C12 index and mobile has no horizontal overflow", async ({ page }) => {
    await page.goto("/c12/index.html");
    const link = page.locator('a[href="writing-expression-learning.html"]');
    await expect(link).toContainText("12과 쓰기 주제 표현 학습");
    await link.click();
    await expect(page).toHaveURL(/\/c12\/writing-expression-learning\.html$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-expression-learning.html");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
