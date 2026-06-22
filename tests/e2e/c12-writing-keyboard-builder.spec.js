const { test, expect } = require("@playwright/test");

const CORE_TARGETS = [
  "건강을 유지하다",
  "체력을 기르다",
  "스트레스를 해소하다",
  "비만을 예방하다",
  "계단을 이용하다",
  "걷기 운동을 하다",
  "자세를 교정하다",
  "스트레칭을 하다"
];

const EXPANSION_TARGETS = [
  "계단을 오르다",
  "엘리베이터 대신 계단을 이용하다",
  "맑은 공기를 마시며 걷기 운동을 하다",
  "고개를 천천히 돌리다",
  "두 손을 허리에 대다",
  "몸을 뒤로 젖히다",
  "발뒤꿈치를 들다",
  "팔을 쭉 뻗다"
];

const GRAMMAR_TARGETS = [
  "운동을 했더니 몸이 가벼워졌어요.",
  "목을 천천히 돌렸더니 기분이 상쾌해졌어요.",
  "운동을 하면 땀이 얼마나 많이 나는지 몰라요.",
  "요즘 몸이 얼마나 좋아졌는지 몰라요.",
  "친구가 계속 하품해요. 어젯밤에 잠을 못 잔 모양이에요.",
  "꾸준히 운동해야 건강을 지킬 수 있어요."
];

const RECALL_TARGETS = [
  "건강을 유지하다",
  "계단을 이용하다",
  "계단을 오르다",
  "고개를 천천히 돌리다",
  "운동을 했더니 몸이 가벼워졌어요.",
  "꾸준히 운동해야 건강을 지킬 수 있어요."
];
const RECALL1_FIRST_DISPLAY = "ㄱㄱㅇ ㅇㅈㅎㄷ";
const RECALL2_FIRST_DISPLAY = "건강? ????";

async function expectFocused(page, id) {
  await expect
    .poll(() => page.evaluate(() => document.activeElement && document.activeElement.id))
    .toBe(id);
}

async function completeWarmup(page) {
  await page.locator("#typingInput").fill("운동");
  await expect(page.locator("#stageTitle")).toHaveText("핵심 어휘");
  await expect(page.locator("#targetText")).toHaveText(CORE_TARGETS[0]);
  await expectFocused(page, "typingInput");
}

async function completeCopyStage(page, targets, nextTitle) {
  for (let index = 0; index < targets.length; index += 1) {
    await expect(page.locator("#targetText")).toHaveText(targets[index]);
    await page.locator("#typingInput").fill(targets[index]);
    if (index < targets.length - 1) {
      await expect(page.locator("#targetText")).toHaveText(targets[index + 1]);
      await expect(page.locator("#typingInput")).toHaveValue("");
    }
  }
  await expect(page.locator("#stageTitle")).toHaveText(nextTitle);
  await expectFocused(page, "typingInput");
}

async function reachRecall(page) {
  await completeWarmup(page);
  await completeCopyStage(page, CORE_TARGETS, "확장 표현");
  await completeCopyStage(page, EXPANSION_TARGETS, "문법 문장");
  await completeCopyStage(page, GRAMMAR_TARGETS, "회상 1: 초성 회상");
}

test.describe("c12 expression typing trainer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-keyboard-builder.html");
    await page.evaluate(() => {
      localStorage.removeItem("c12_expression_typing_trainer_v1");
      localStorage.removeItem("preferred-lang");
    });
    await page.reload();
  });

  test("loads the focused seven-stage expression trainer", async ({ page }) => {
    await expect(page.locator(".mission-panel.is-current-task")).toBeVisible();
    await expect.poll(() => page.title()).toBe("12과 표현 타이핑 연습");
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#missionPrompt")).toContainText("운동");
    await expect(page.locator(".progress-dot")).toHaveCount(7);
    await expect(page.locator("#targetText")).toHaveText("운동");
    await expectFocused(page, "typingInput");
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);

    await expect(page.locator(".preview-drawer")).toHaveCount(0);
    await expect(page.locator("#draftInput")).toHaveCount(0);
    await expect(page.locator("#finalOutput")).toHaveCount(0);
  });

  test("uses the standard multilingual toggle for helper translations", async ({ page }) => {
    await expect(page.locator("[data-multilang-bar]")).toBeVisible();
    await expect(page.locator('[data-multilang-btn="none"]')).toContainText("번역 끄기");
    for (const lang of ["vi", "mn", "ar", "kk", "th", "en", "ja", "zh"]) {
      await expect(page.locator(`[data-multilang-btn="${lang}"]`)).toHaveCount(1);
    }

    await expect(page.locator('[data-lang="vi"]')).toBeHidden();

    await page.locator('[data-multilang-btn="vi"]').click();
    await expect(page.locator('[data-lang="vi"]')).toBeVisible();
    await expect(page.locator('[data-lang="vi"]')).toContainText("Kiểm tra chế độ gõ tiếng Hàn");
    await expect(page.locator('[data-lang="en"]')).toBeHidden();

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('[data-lang="en"]')).toBeVisible();
    await expect(page.locator('[data-lang="en"]')).toContainText("Check that Korean input mode is on");
    await expect(page.locator('[data-lang="vi"]')).toBeHidden();

    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('[data-lang="ar"]')).toBeVisible();
    await expect(page.locator('[data-lang="ar"]')).toHaveAttribute("dir", "rtl");

    await page.locator('[data-multilang-btn="en"]').click();
    await page.locator("#typingInput").fill("운동");
    await expect(page.locator("#stageTitle")).toHaveText("핵심 어휘");
    await expect(page.locator('[data-lang="en"]')).toBeVisible();
    await expect(page.locator('[data-lang="en"]')).toContainText("Maintain health");

    await page.locator("#typingInput").fill(CORE_TARGETS[0]);
    await expect(page.locator("#targetText")).toHaveText(CORE_TARGETS[1]);
    await expect(page.locator('[data-lang="en"]')).toContainText("Build physical strength");
  });

  test("warns for English input and auto-advances from warmup", async ({ page }) => {
    await page.locator("#typingInput").fill("undong");
    await expect(page.locator("#feedbackText")).toContainText("한/영 키 확인");
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expectFocused(page, "typingInput");

    await completeWarmup(page);
  });

  test("auto-advances through core vocabulary and includes expansion expressions", async ({ page }) => {
    await completeWarmup(page);
    await completeCopyStage(page, CORE_TARGETS, "확장 표현");

    await expect(page.locator("#targetText")).toHaveText("계단을 오르다");
    await expect(page.locator("#cueKo")).toContainText("계단");
  });

  test("auto-advances through expansion and grammar sentences", async ({ page }) => {
    await completeWarmup(page);
    await completeCopyStage(page, CORE_TARGETS, "확장 표현");
    await completeCopyStage(page, EXPANSION_TARGETS, "문법 문장");

    await expect(page.locator("#targetText")).toHaveText("운동을 했더니 몸이 가벼워졌어요.");
    await completeCopyStage(page, GRAMMAR_TARGETS, "회상 1: 초성 회상");
    await expect(page.locator("#targetText")).toHaveText(RECALL1_FIRST_DISPLAY);
  });

  test("runs two recall stages, keeps hint hotkeys visible, and shows the learning report", async ({ page }) => {
    await reachRecall(page);

    await expect(page.locator("#stageTitle")).toHaveText("회상 1: 초성 회상");
    await expect(page.locator("#targetText")).toHaveText(RECALL1_FIRST_DISPLAY);
    await expect(page.locator("#targetText")).not.toHaveText(RECALL_TARGETS[0]);
    await expect(page.locator("#hintPanel")).toBeHidden();
    await expect(page.locator("#hintButton")).toBeVisible();
    await expect(page.locator("#hintButton")).toContainText("Ctrl+H");
    await expect(page.locator("#shortcutText")).toContainText("Ctrl+H");

    await page.locator("#typingInput").fill("건강을 지키다");
    await page.keyboard.press("Enter");
    await expect(page.locator("#feedbackText")).toContainText("다시 입력하세요");

    await page.keyboard.press("Control+H");
    await expect(page.locator("#hintPanel")).toBeVisible();
    await expect(page.locator("#hintText")).toContainText("글자 수: 7자");
    await expect(page.locator("#hintText")).not.toContainText(RECALL_TARGETS[0]);

    await page.locator("#typingInput").fill(RECALL_TARGETS[0]);
    await page.keyboard.press("Enter");
    await expect(page.locator("#itemMeta")).toContainText("2 / 6");
    await expect(page.locator("#shortcutText")).toContainText("Ctrl+H");
    await expect(page.locator("#targetText")).not.toHaveText(RECALL_TARGETS[1]);

    for (const [offset, target] of RECALL_TARGETS.slice(1).entries()) {
      await expect(page.locator("#itemMeta")).toContainText(`${offset + 2} / 6`);
      await page.locator("#typingInput").fill(target);
      await page.keyboard.press("Enter");
    }

    await expect(page.locator("#stageTitle")).toHaveText("회상 2: 부분 가림 회상");
    await expect(page.locator("#targetText")).toHaveText(RECALL2_FIRST_DISPLAY);
    await expect(page.locator("#targetText")).not.toHaveText(RECALL_TARGETS[0]);
    await expect(page.locator("#shortcutText")).toContainText("Ctrl+H");

    await page.keyboard.press("Control+H");
    await expect(page.locator("#hintPanel")).toBeVisible();
    await expect(page.locator("#hintText")).toContainText("글자 수: 7자");
    await expect(page.locator("#hintText")).not.toContainText(RECALL_TARGETS[0]);

    for (const [index, target] of RECALL_TARGETS.entries()) {
      await expect(page.locator("#itemMeta")).toContainText(`${index + 1} / 6`);
      await page.locator("#typingInput").fill(target);
      await page.keyboard.press("Enter");
      if (index < RECALL_TARGETS.length - 1) {
        await expect(page.locator("#shortcutText")).toContainText("Ctrl+H");
      }
    }

    await expect(page.locator("#stageTitle")).toHaveText("학습 리포트");
    await expect(page.locator("#reportPanel")).toBeVisible();
    await expect(page.locator("#totalMetric")).toHaveText("34");
    await expect(page.locator("#correctMetric")).toHaveText("34");
    await expect(page.locator("#hintMetric")).toHaveText("2");
    await expect(page.locator("#reviewList")).toContainText(RECALL_TARGETS[0]);
    await expect(page.locator("#retryButton")).toBeVisible();
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-keyboard-builder.html");
    await page.evaluate(() => localStorage.removeItem("c12_expression_typing_trainer_v1"));
    await page.reload();

    await expect(page.locator("#stageTitle")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from the c12 hub and both keyboard pages with the new activity name", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-keyboard-builder.html"]');
    await expect(c12Link).toHaveCount(1);
    await expect(c12Link).toContainText("12과 표현 타이핑 연습");

    await page.goto("/apps/korean-keyboard-practice/index.html");
    const basicLink = page.locator('a[href="../../c12/writing-keyboard-builder.html"]');
    await expect(basicLink).toHaveCount(1);
    await expect(page.locator("#nextWritingTitle")).toHaveText("12과 표현 타이핑 연습");
    await expect(basicLink).toContainText("표현 연습 시작");

    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");
    const lessonLink = page.locator('a[href="../../c12/writing-keyboard-builder.html"]');
    await expect(lessonLink).toHaveCount(1);
    await expect(page.locator("#nextWritingLessonTitle")).toHaveText("12과 표현 타이핑 연습");
    await expect(lessonLink).toContainText("표현 연습 시작");
  });
});
