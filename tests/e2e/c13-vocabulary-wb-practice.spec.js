const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

function exactText(value) {
  return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
}

async function expectImagesLoaded(page) {
  const images = page.locator("main img");
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    await expect(images.nth(index)).toBeVisible();
    const loaded = await images.nth(index).evaluate((image) => image.complete && image.naturalWidth > 0);
    expect(loaded).toBe(true);
  }
}

async function currentAnswer(page) {
  return page.evaluate(() => {
    const api = window.__c13WbVocabPractice;
    const state = api.getState();
    return api.data[state.stageIndex].questions[state.questionIndex].answer;
  });
}

async function answerCurrentCorrectly(page) {
  const answer = await currentAnswer(page);
  await page.locator(".answer-option").filter({ hasText: exactText(answer) }).click();
}

test.describe("c13 WB vocabulary practice", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("is linked from the c13 hub and vocabulary page", async ({ page }) => {
    await page.goto("/c13/index.html", { waitUntil: "domcontentloaded" });
    const hubLink = page.locator('a[href="vocabulary-wb-practice.html"]').filter({ hasText: "WB 어휘 연습" });
    await expect(hubLink).toBeVisible();
    await hubLink.click();
    await expect(page).toHaveURL(/\/c13\/vocabulary-wb-practice\.html$/);
    await expect(page.getByRole("heading", { name: "13과 WB 어휘 연습" })).toBeVisible();

    await page.goto("/c13/vocabulary.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href="vocabulary-wb-practice.html"]')).toHaveCount(2);
    await page.locator('nav.topbar a[href="vocabulary-wb-practice.html"]').click();
    await expect(page).toHaveURL(/\/c13\/vocabulary-wb-practice\.html$/);
  });

  test("loads the four WB stages with visible first action", async ({ page }) => {
    await page.goto("/c13/vocabulary-wb-practice.html", { waitUntil: "domcontentloaded" });

    const practiceData = await page.evaluate(() => {
      const api = window.__c13WbVocabPractice;
      return {
        stageCount: api.data.length,
        labels: api.data.map((stage) => stage.label),
        questionCount: api.getState().totalQuestions
      };
    });

    expect(practiceData.stageCount).toBe(4);
    expect(practiceData.labels).toEqual(["모임", "준비", "착용", "수량"]);
    expect(practiceData.questionCount).toBe(22);
    await expect(page.locator("#scoreText")).toHaveText("0 / 22");
    await expect(page.locator(".stage-tab")).toHaveCount(4);
    await expect(page.locator(".visual-guide")).toBeVisible();
    await expect(page.locator(".guide-chip")).toHaveCount(3);
    await expect(page.locator(".guide-chip").first()).toHaveClass(/is-active/);
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "0");
    await expect(page.locator(".answer-option")).toHaveCount(5);
    await expect(page.locator(".answer-option").first()).toBeVisible();
    await expect(page.locator(".progress-pill")).toHaveText("1 / 5");
    await expectImagesLoaded(page);
  });

  test("moves the visual guide from scene to clue to choices", async ({ page }) => {
    await page.goto("/c13/vocabulary-wb-practice.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator("[data-guide-message]")).toContainText("장면:");
    await expect(page.locator("#guideNextButton")).toHaveText("단서 보기");

    await page.locator("#guideNextButton").click();
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "1");
    await expect(page.locator(".guide-chip").nth(0)).toHaveClass(/is-done/);
    await expect(page.locator(".guide-chip").nth(1)).toHaveClass(/is-active/);
    await expect(page.locator("[data-guide-message]")).toContainText("단서:");
    await expect(page.locator("#guideNextButton")).toHaveText("선택 보기");

    await page.locator("#guideNextButton").click();
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "2");
    await expect(page.locator(".guide-chip").nth(2)).toHaveClass(/is-active/);
    await expect(page.locator("[data-guide-message]")).toContainText("선택:");
    await expect(page.locator("#guideNextButton")).toBeHidden();
  });

  test("gives immediate feedback for wrong and correct choices", async ({ page }) => {
    await page.goto("/c13/vocabulary-wb-practice.html", { waitUntil: "domcontentloaded" });

    await page.locator('.answer-option[data-answer-option="돌잔치"]').click();
    await expect(page.locator("[data-feedback]")).toHaveClass(/is-wrong/);
    await expect(page.locator("[data-feedback]")).toContainText("새 집");
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "1");
    await expect(page.locator("#scoreText")).toHaveText("0 / 22");

    let state = await page.evaluate(() => window.__c13WbVocabPractice.getState());
    expect(state.solved).toEqual([]);
    expect(state.guideStep).toBe(1);
    expect(state.wrongCounts.events).toBe(1);

    await page.locator('.answer-option[data-answer-option="집들이"]').click();
    await expect(page.locator("[data-feedback]")).toHaveClass(/is-correct/);
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "2");
    await expect(page.locator("#scoreText")).toHaveText("1 / 22");
    await expect(page.locator("#nextButton")).toBeEnabled();

    state = await page.evaluate(() => window.__c13WbVocabPractice.getState());
    expect(state.solved).toEqual(["event-housewarming"]);
    expect(state.guideStep).toBe(2);
    await page.locator("#nextButton").click();
    await expect(page.locator(".question-card")).toHaveAttribute("data-question-id", "event-first-birthday");
    await expect(page.locator(".question-card")).toHaveAttribute("data-guide-step", "0");
    await expect(page.locator(".progress-pill")).toHaveText("2 / 5");
  });

  test("can complete all 22 questions and show a result summary", async ({ page }) => {
    await page.goto("/c13/vocabulary-wb-practice.html", { waitUntil: "domcontentloaded" });

    const totalQuestions = await page.evaluate(() => window.__c13WbVocabPractice.getState().totalQuestions);
    for (let index = 0; index < totalQuestions; index += 1) {
      await answerCurrentCorrectly(page);
      await page.locator("#nextButton").click();
    }

    await expect(page.locator("#summaryPanel")).toBeVisible();
    await expect(page.locator("#summaryPanel")).toContainText("어휘 연습 완료");
    await expect(page.locator("#summaryPanel")).toContainText("22 / 22");
    await expect(page.locator(".weak-list")).toContainText("틀린 선택 없이");
    await expect(page.locator(".summary-link")).toHaveCount(6);
  });
});

test.describe("c13 WB vocabulary practice mobile", () => {
  test.use({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("keeps answer controls visible and touch sized", async ({ page }) => {
    await page.goto("/c13/vocabulary-wb-practice.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".answer-option").first()).toBeVisible();
    const metrics = await page.evaluate(() => {
      const answers = [...document.querySelectorAll(".answer-option")].map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          scrollWidth: button.scrollWidth,
          clientWidth: button.clientWidth
        };
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        answers
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(metrics.answers[0].top).toBeLessThan(740);
    for (const answer of metrics.answers) {
      expect(answer.height).toBeGreaterThanOrEqual(44);
      expect(answer.width).toBeGreaterThanOrEqual(44);
      expect(answer.scrollWidth).toBeLessThanOrEqual(answer.clientWidth + 1);
    }
  });
});
