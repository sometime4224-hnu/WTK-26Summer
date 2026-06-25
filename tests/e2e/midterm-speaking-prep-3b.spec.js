const { test, expect } = require("@playwright/test");

test.describe("3B midterm speaking prep", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/exam/midterm-speaking-prep-3b-2026-summer.html");
  });

  test("loads as a compact notebook preparation page", async ({ page }) => {
    await expect(page).toHaveTitle("3B 중간 말하기 시험 준비");
    await expect(page.locator("h1")).toContainText("질문을 보고 공책에 말할 내용을 준비합니다.");
    await expect(page.locator(".scope-badge")).toHaveText("10~13과 · 말하기 중간 수행 평가");
    await expect(page.locator("[data-filter]")).toHaveText(["전체", "문법 문항 1~15", "자유 말하기 10과~13과"]);
    await expect(page.locator("[data-question-strip] .question-button")).toHaveCount(23);
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(page.locator("input")).toHaveCount(0);

    const usesStorageOrSpeech = await page.locator("script").evaluateAll((scripts) =>
      scripts.some((script) => /localStorage|SpeechRecognition|webkitSpeechRecognition/.test(script.textContent))
    );
    expect(usesStorageOrSpeech).toBe(false);
  });

  test("navigates grammar and free-speaking question groups", async ({ page }) => {
    await page.locator('[data-filter="grammar"]').click();
    await expect(page.locator("[data-question-strip] .question-button")).toHaveCount(15);
    await expect(page.locator("[data-title]")).toHaveText("쓰던 물건 경험 말하기");
    await expect(page.locator("[data-grammar]")).toHaveText("A/V-던");
    await expect(page.locator("[data-prompts]")).toContainText("다른 사람이 쓰던 물건을 사용한 적이 있어요?");
    await expect(page.locator("[data-frames]")).toContainText("[사람]이/가 쓰던 [물건]을 받아서 지금까지 ...");

    await page.locator('[data-question-id="q10"]').click();
    await expect(page.locator("[data-title]")).toHaveText("정도를 강하게 말하기");
    await expect(page.locator("[data-grammar]")).toHaveText("얼마나 A/V-(으)ㄴ지/는지 모르다");
    await expect(page.locator("[data-frames]")).toContainText("얼마나 맛있는지 몰라요");

    await page.locator('[data-question-id="q15"]').click();
    await expect(page.locator("[data-title]")).toHaveText("후회되는 일 말하기");
    await expect(page.locator("[data-grammar]")).toHaveText("A/V-았/었어야 했는데");
    await expect(page.locator("[data-prompts]")).toContainText("하지 못해서 후회되는 일");

    await page.locator('[data-filter="free"]').click();
    await expect(page.locator("[data-question-strip] .question-button")).toHaveCount(8);
    await page.locator('[data-question-id="f12a"]').click();
    await expect(page.locator("[data-title]")).toHaveText("스포츠 센터에 다니는 이유");
    await expect(page.locator("[data-grammar]")).toHaveText("자유 말하기 · 이유 설명");
    await expect(page.locator("[data-prompts]")).toContainText("스포츠 센터에 다니는/안 다니는 이유");
  });

  test("marks image questions without embedding original PDF images", async ({ page }) => {
    await page.locator('[data-filter="grammar"]').click();
    await page.locator('[data-question-id="q11"]').click();
    await expect(page.locator("[data-title]")).toHaveText("그림을 보고 추측하기");
    await expect(page.locator("[data-image-note]")).toBeVisible();
    await expect(page.locator("[data-image-note]")).toContainText("시험지 그림을 보고 말하기");
    await expect(page.locator("img")).toHaveCount(0);

    await page.locator('[data-question-id="q14"]').click();
    await expect(page.locator("[data-title]")).toHaveText("입고 있는 옷 말하기");
    await expect(page.locator("[data-image-note]")).toBeVisible();
  });

  test("is linked from the root index and fits mobile", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('a[href="exam/midterm-speaking-prep-3b-2026-summer.html"]');
    await expect(link).toContainText("중간 말하기 준비");
    await link.click();
    await expect(page).toHaveURL(/\/exam\/midterm-speaking-prep-3b-2026-summer\.html$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/exam/midterm-speaking-prep-3b-2026-summer.html");
    await page.locator('[data-filter="free"]').click();
    await page.locator('[data-question-id="f12b"]').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    const verticalOverflow = await page.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
    expect(verticalOverflow).toBeLessThanOrEqual(2);
  });
});
