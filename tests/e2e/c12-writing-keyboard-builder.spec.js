const { test, expect } = require("@playwright/test");

async function expectFocused(page, id) {
  await expect
    .poll(() => page.evaluate(() => document.activeElement && document.activeElement.id))
    .toBe(id);
}

async function completeWarmup(page) {
  await page.locator("#warmupInput").fill("운동");
  await expect(page.locator("#stageTitle")).toHaveText("핵심어 타이핑");
  await expectFocused(page, "wordInput");
}

async function completeWords(page) {
  const targets = ["스트레칭", "계단", "걷기", "자세 교정"];
  for (const word of targets) {
    await expect(page.locator("#targetWord")).toHaveText(word);
    await page.locator("#wordInput").fill(word);
  }
  await expect(page.locator("#stageTitle")).toHaveText("문장 만들기");
  await expect(page.locator("#sentenceTarget")).toHaveText("건강 노력");
  await expectFocused(page, "sentenceInput");
}

async function completeFirstThreeStages(page) {
  await completeWarmup(page);
  await completeWords(page);
}

test.describe("c12 life exercise keyboard writing builder", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-keyboard-builder.html");
    await page.evaluate(() => localStorage.removeItem("c12_life_exercise_keyboard_builder_v1"));
    await page.reload();
  });

  test("loads the focused five-stage typing workspace", async ({ page }) => {
    await expect(page.locator(".mission-panel.is-current-task")).toBeVisible();
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#missionPrompt")).toContainText("운동");
    await expect(page.locator(".progress-dot")).toHaveCount(5);
    await expectFocused(page, "warmupInput");

    await expect(page.locator(".visual-panel")).toHaveCount(0);
    await expect(page.locator(".hero-metrics")).toHaveCount(0);
    await expect(page.locator(".stage-rail")).toHaveCount(0);
    await expect(page.locator(".keyboard-panel")).toHaveCount(0);
    await expect(page.locator(".draft-panel")).toHaveCount(0);
  });

  test("warns for English input and auto-advances from warmup", async ({ page }) => {
    await page.locator("#warmupInput").fill("undong");
    await expect(page.locator("#feedbackText")).toContainText("한/영 키 확인");
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expectFocused(page, "warmupInput");

    await page.locator("#warmupInput").fill("운동");
    await expect(page.locator("#feedbackText")).toContainText("핵심어로 넘어갑니다");
    await expect(page.locator("#stageTitle")).toHaveText("핵심어 타이핑");
    await expect(page.locator("#targetWord")).toHaveText("스트레칭");
    await expectFocused(page, "wordInput");
  });

  test("auto-advances through four keywords without clicks", async ({ page }) => {
    await completeWarmup(page);

    await page.locator("#wordInput").fill("스트레칭");
    await expect(page.locator("#targetWord")).toHaveText("계단");
    await expect(page.locator("#typedWordCount")).toHaveText("1");
    await expect(page.locator("#wordInput")).toHaveValue("");

    await page.locator("#wordInput").fill("계단");
    await expect(page.locator("#targetWord")).toHaveText("걷기");

    await page.locator("#wordInput").fill("걷기");
    await expect(page.locator("#targetWord")).toHaveText("자세 교정");

    await page.locator("#wordInput").fill("자세 교정");
    await expect(page.locator("#stageTitle")).toHaveText("문장 만들기");
    await expect(page.locator("#sentenceTarget")).toHaveText("건강 노력");
    await expectFocused(page, "sentenceInput");
  });

  test("uses Ctrl+Enter to move sentence prompts and finalizes the reply", async ({ page }) => {
    await completeFirstThreeStages(page);

    await page.locator("#sentenceInput").fill("물을 자주 마시고 채소와 과일을 먹습니다.");
    await page.keyboard.press("Control+Enter");
    await expect(page.locator("#sentenceTarget")).toHaveText("생활 속 운동 방법");
    await expectFocused(page, "sentenceInput");

    await page.locator("#sentenceInput").fill("쉬는 시간에 스트레칭을 하고 계단을 이용해 보세요.");
    await page.keyboard.press("Control+Enter");
    await expect(page.locator("#sentenceTarget")).toHaveText("운동 효과");

    await page.locator("#sentenceInput").fill("스트레스가 풀리고 몸이 가벼워집니다.");
    await page.keyboard.press("Control+Enter");
    await expect(page.locator("#stageTitle")).toHaveText("답글 다듬기");
    await expectFocused(page, "draftInput");
    await expect(page.locator("#draftInput")).toHaveValue(/계단을 이용/);
    await expect(page.locator("#draftInput")).toHaveValue(/스트레스가 풀리고 몸이 가벼워집니다\./);

    await page.keyboard.press("Control+Enter");
    await expect(page.locator("#stageTitle")).toHaveText("복사 준비");
    await expectFocused(page, "finalOutput");
    await expect(page.locator("#finalOutput")).toHaveValue(/처음에는 짧게 시작/);
  });

  test("auto-advances a sentence after an ending punctuation pause", async ({ page }) => {
    await completeFirstThreeStages(page);

    await page.locator("#sentenceInput").fill("물을 자주 마시고 채소와 과일을 먹습니다.");
    await expect(page.locator("#sentenceTarget")).toHaveText("생활 속 운동 방법");
    await expect(page.locator("#sentenceInput")).toHaveValue("");
    await expectFocused(page, "sentenceInput");
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-keyboard-builder.html");
    await page.evaluate(() => localStorage.removeItem("c12_life_exercise_keyboard_builder_v1"));
    await page.reload();

    await expect(page.locator("#stageTitle")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from the c12 hub and both keyboard pages", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-keyboard-builder.html"]');
    await expect(c12Link).toHaveCount(1);
    await expect(c12Link).toContainText("생활 속 운동 답글 쓰기");

    await page.goto("/apps/korean-keyboard-practice/index.html");
    const basicLink = page.locator('a[href="../../c12/writing-keyboard-builder.html"]');
    await expect(basicLink).toHaveCount(1);
    await expect(basicLink).toContainText("쓰기 시작");

    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");
    const lessonLink = page.locator('a[href="../../c12/writing-keyboard-builder.html"]');
    await expect(lessonLink).toHaveCount(1);
    await expect(lessonLink).toContainText("쓰기 시작");
  });
});
