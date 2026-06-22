const { test, expect } = require("@playwright/test");

async function pressPhysicalKey(page, code, key) {
  await page.evaluate(
    ({ code: eventCode, key: eventKey }) => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          code: eventCode,
          key: eventKey,
          bubbles: true,
          cancelable: true
        })
      );
    },
    { code, key }
  );
}

function keyButton(page, code) {
  return page.locator(`[data-code="${code}"]`);
}

async function expectKeyHasClass(page, code, className) {
  await expect(keyButton(page, code)).toHaveClass(new RegExp(`\\b${className}\\b`));
}

async function expectKeyNotHasClass(page, code, className) {
  await expect(keyButton(page, code)).not.toHaveClass(new RegExp(`\\b${className}\\b`));
}

test.describe("korean keyboard 25-minute lesson", () => {
  test("loads the eight-stage lesson flow with total time", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await expect(page.locator(".brand-title")).toContainText("한글 자판 25분 수업");
    await expect(page.locator(".stage-button")).toHaveCount(8);
    await expect(page.locator(".time-summary")).toContainText("총 25분");
    await expect(page.locator("#missionTitle")).toHaveText("준비");
    await expect(page.locator("#targetDisplay")).toHaveText("한/영");
    await expect(page.locator(".mission-signal")).toBeVisible();
    await expect(page.locator(".mission-signal span")).toHaveCount(5);
    await expect(page.locator('[data-stage-index="5"]')).toContainText("단어 입력");
    await expect(page.locator('[data-stage-index="6"]')).toContainText("리듬 단어 입력");
  });

  test("shows the current mission and keyboard together in the first desktop view", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 720 });
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    const missionBox = await page.locator(".mission-panel").boundingBox();
    const keyboardBox = await page.locator(".keyboard-panel").boundingBox();
    expect(missionBox.y).toBeLessThan(210);
    expect(keyboardBox.y).toBeLessThan(210);
    expect(missionBox.x).toBeLessThan(keyboardBox.x);
    await expect(page.locator("#targetDisplay")).toBeInViewport();
    await expect(page.locator(".keyboard-board")).toBeInViewport();
  });

  test("advances home-key practice with physical key codes", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator('[data-stage-index="2"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("홈키 자리 찾기");
    await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");
    await expectKeyHasClass(page, "KeyF", "is-target");

    await pressPhysicalKey(page, "KeyF", "f");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅓ");
    await expectKeyHasClass(page, "KeyJ", "is-target");

    await pressPhysicalKey(page, "KeyJ", "j");
    await expect(page.locator("#completedCount")).toHaveText("2");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅁ");
  });

  test("checks Hangul text input and warns for English input", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator('[data-stage-index="4"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("음절 입력");
    await expect(page.locator("#targetDisplay")).toHaveText("가");
    await expectKeyHasClass(page, "KeyR", "is-required");
    await expectKeyHasClass(page, "KeyK", "is-required");
    await expectKeyHasClass(page, "KeyR", "is-next-key");
    await page.locator("#answerInput").fill("ga");
    await expect(page.locator("#feedbackStrip")).toContainText("한/영 키 확인");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await expectKeyHasClass(page, "KeyR", "is-next-key");

    await page.locator("#answerInput").fill("가");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("나");
    await expectKeyHasClass(page, "KeyS", "is-next-key");
    await expectKeyHasClass(page, "KeyK", "is-required");

    await page.locator('[data-stage-index="5"]').click();
    await expect(page.locator("#targetDisplay")).toHaveText("한국");
    for (const code of ["KeyG", "KeyK", "KeyS", "KeyR", "KeyN"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyHasClass(page, "KeyG", "is-next-key");
    await page.locator("#answerInput").fill("한국");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("학생");
    await expectKeyHasClass(page, "KeyG", "is-next-key");
    for (const code of ["KeyT", "KeyO", "KeyD"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyNotHasClass(page, "KeyN", "is-required");
  });

  test("runs the rhythm word lane with success and English warning", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator('[data-stage-index="6"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("리듬 단어 입력");
    await expect(page.locator(".rhythm-lane")).toBeVisible();
    await expect(page.locator(".rhythm-judge-line")).toBeVisible();
    await expect(page.locator("#answerInput")).toBeVisible();
    await expect(page.locator("#rhythmWordCard")).toHaveText("한국");
    for (const code of ["KeyG", "KeyK", "KeyS", "KeyR", "KeyN"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyHasClass(page, "KeyG", "is-next-key");

    await page.locator("#answerInput").fill("한국");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expect(page.locator("#rhythmWordCard")).toHaveText("학생");
    await expectKeyHasClass(page, "KeyG", "is-next-key");
    await expectKeyHasClass(page, "KeyT", "is-required");
    await expectKeyNotHasClass(page, "KeyN", "is-required");

    await page.locator("#answerInput").fill("hanguk");
    await expect(page.locator("#feedbackStrip")).toContainText("한/영 키 확인");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expectKeyHasClass(page, "KeyG", "is-next-key");
  });

  test("allows skipping unfinished stages and summarizes them", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator("#nextStageButton").click();
    await expect(page.locator("#missionTitle")).toHaveText("자판 보기");
    await page.locator('[data-stage-index="7"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("마무리");
    await expect(page.locator("#stageTask")).toContainText("넘어간 단계");
    await expect(page.locator("#stageTask")).toContainText("리듬 성공");
    await expect(page.locator("#stageTask")).toContainText("놓친 단어");
  });

  test("puts the mission before the keyboard on narrow screens without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    const missionBox = await page.locator(".mission-panel").boundingBox();
    const keyboardBox = await page.locator(".keyboard-panel").boundingBox();
    expect(missionBox.y).toBeLessThan(keyboardBox.y);
    await expect(page.locator("#targetDisplay")).toBeInViewport();

    await page.locator('[data-stage-index="6"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("리듬 단어 입력");
    await expect(page.locator(".rhythm-lane")).toBeInViewport();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from the common apps hub without replacing the basic practice card", async ({ page }) => {
    await page.goto("/apps/index.html");

    await expect(page.locator('a[href="korean-keyboard-practice/index.html"]')).toHaveCount(1);
    const lessonLink = page.locator('a[href="korean-keyboard-practice-lesson/index.html"]');
    await expect(lessonLink).toHaveCount(1);
    await expect(lessonLink).toContainText("한글 자판 25분 수업");
  });
});