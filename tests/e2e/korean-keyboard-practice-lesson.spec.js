const { test, expect } = require("@playwright/test");

const LAYOUT_KEYS = ["KeyF", "KeyJ", "KeyR", "KeyK"];
const HOME_KEYS = ["KeyF", "KeyJ", "KeyA", "KeyS", "KeyD", "KeyK", "KeyL", "KeyF", "KeyJ", "KeyA", "KeyS", "KeyD", "KeyK", "KeyL"];
const COMMON_KEYS = ["KeyR", "KeyT", "KeyG", "KeyH", "KeyY", "KeyU", "KeyN", "KeyB", "KeyM", "KeyE", "KeyW", "KeyO", "KeyP", "KeyV"];
const SYLLABLE_TARGETS = ["가", "나", "다", "마", "바", "사", "아", "자", "하", "고", "구", "기", "거", "너", "더", "러", "머", "버", "서", "어", "저", "호", "후", "히"];
const WORD_TARGETS = ["한국", "학생", "학교", "이름", "컴퓨터", "전화", "커피", "가방", "친구", "오늘", "사람", "시간", "음식", "운동", "시장", "가족", "사진", "버스"];

async function pressPhysicalKey(page, code, key = code.replace("Key", "").toLowerCase()) {
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

async function expectNextKeyAnimation(page, code) {
  const style = await keyButton(page, code).evaluate((element) => {
    const keyStyle = window.getComputedStyle(element);
    const letterStyle = window.getComputedStyle(element.querySelector(".key-hangul"));
    const rect = element.getBoundingClientRect();
    return {
      animationName: keyStyle.animationName,
      letterAnimationName: letterStyle.animationName,
      zIndex: keyStyle.zIndex,
      width: rect.width,
      height: rect.height
    };
  });
  expect(style.animationName).toContain("nextKeyPulse");
  expect(style.letterAnimationName).toContain("nextKeyLetterPop");
  expect(Number(style.zIndex)).toBeGreaterThanOrEqual(8);
  expect(style.width).toBeGreaterThan(0);
  expect(style.height).toBeGreaterThan(0);
}

async function beginComposition(page, value, data = value) {
  await page.locator("#answerInput").evaluate(
    (input, payload) => {
      input.focus();
      input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true, data: "" }));
      input.value = payload.value;
      input.dispatchEvent(new CompositionEvent("compositionupdate", { bubbles: true, data: payload.data }));
      input.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        data: payload.data,
        inputType: "insertCompositionText",
        isComposing: true
      }));
    },
    { value, data }
  );
}

async function updateComposition(page, value, data = value) {
  await page.locator("#answerInput").evaluate(
    (input, payload) => {
      input.value = payload.value;
      input.dispatchEvent(new CompositionEvent("compositionupdate", { bubbles: true, data: payload.data }));
      input.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        data: payload.data,
        inputType: "insertCompositionText",
        isComposing: true
      }));
    },
    { value, data }
  );
}

async function endComposition(page, value, data = value) {
  await page.locator("#answerInput").evaluate(
    (input, payload) => {
      input.value = payload.value;
      input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: payload.data }));
      input.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        data: payload.data,
        inputType: "insertText",
        isComposing: false
      }));
    },
    { value, data }
  );
}

async function expectTransition(page, nextTitle) {
  await expect(page.locator("#transitionOverlay")).toBeVisible();
  await expect(page.locator("#transitionTitle")).toHaveText("잘했어요");
  await expect(page.locator("#transitionSummary")).toContainText(`다음 ${nextTitle}`);
  await expect(page.locator("#transitionNextButton")).toContainText("Enter");
  await expect(page.locator("#transitionRetryButton")).toContainText("R");
}

async function nextPractice(page, expectedTitle) {
  await page.keyboard.press("Enter");
  await expect(page.locator("#transitionOverlay")).toBeHidden();
  await expect(page.locator("#missionTitle")).toHaveText(expectedTitle);
}

async function completeReady(page) {
  await page.locator("#answerInput").fill("가");
  await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");
  await pressPhysicalKey(page, "KeyF");
  await expect(page.locator("#targetDisplay")).toHaveText("ㅓ");
  await pressPhysicalKey(page, "KeyJ");
  await expectTransition(page, "자판 보기");
}

async function completeKeyStage(page, codes, nextTitle) {
  for (const code of codes) {
    await pressPhysicalKey(page, code);
  }
  await expectTransition(page, nextTitle);
}

async function completeTextStage(page, targets, nextTitle) {
  const input = page.locator("#answerInput");
  for (const target of targets) {
    await input.fill(target);
  }
  await expectTransition(page, nextTitle);
}

async function reachLayout(page) {
  await completeReady(page);
  await nextPractice(page, "자판 보기");
}

async function reachHome(page) {
  await reachLayout(page);
  await completeKeyStage(page, LAYOUT_KEYS, "홈키 자리 찾기");
  await nextPractice(page, "홈키 자리 찾기");
}

async function reachCommon(page) {
  await reachHome(page);
  await completeKeyStage(page, HOME_KEYS, "자주 쓰는 자모 찾기");
  await nextPractice(page, "자주 쓰는 자모 찾기");
}

async function reachSyllables(page) {
  await reachCommon(page);
  await completeKeyStage(page, COMMON_KEYS, "음절 입력");
  await nextPractice(page, "음절 입력");
}

async function reachWords(page) {
  await reachSyllables(page);
  await completeTextStage(page, SYLLABLE_TARGETS, "단어 입력");
  await nextPractice(page, "단어 입력");
}

async function reachRhythm(page) {
  await reachWords(page);
  await completeTextStage(page, WORD_TARGETS, "리듬 단어 입력");
  await nextPractice(page, "리듬 단어 입력");
}

test.describe("korean keyboard 25-minute lesson", () => {
  test("loads the eight-stage lesson flow with total time", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await expect(page.locator(".brand-title")).toContainText("한글 자판 25분 수업");
    await expect(page.locator(".stage-button")).toHaveCount(8);
    await expect(page.locator(".time-summary")).toContainText("총 25분");
    await expect(page.locator("#missionTitle")).toHaveText("준비");
    await expect(page.locator("#targetDisplay")).toHaveText("가");
    await expect(page.locator("#answerInput")).toBeVisible();
    await expect(page.locator(".mission-signal")).toBeVisible();
    await expect(page.locator(".mission-signal span")).toHaveCount(5);
    await expect(page.locator("#missionActions")).toBeHidden();
    await expect(page.locator("#transitionOverlay")).toBeHidden();
    await expect(page.locator('[data-stage-index="5"]')).toContainText("단어 입력");
    await expect(page.locator('[data-stage-index="6"]')).toContainText("리듬 단어 입력");
    await expectKeyHasClass(page, "KeyR", "is-required");
    await expectKeyHasClass(page, "KeyK", "is-required");
    await expectKeyHasClass(page, "KeyR", "is-next-key");
  });

  test("keeps the target input directly above the keyboard on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 720 });
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    const missionBox = await page.locator(".mission-panel").boundingBox();
    const keyboardPanelBox = await page.locator(".keyboard-panel").boundingBox();
    const focusBox = await page.locator(".keyboard-focus-strip").boundingBox();
    const boardBox = await page.locator(".keyboard-board").boundingBox();
    expect(missionBox.y).toBeLessThan(210);
    expect(keyboardPanelBox.y).toBeLessThan(210);
    expect(missionBox.x).toBeLessThan(keyboardPanelBox.x);
    expect(Math.abs(focusBox.x - boardBox.x)).toBeLessThanOrEqual(2);
    expect(focusBox.y).toBeLessThan(boardBox.y);
    await expect(page.locator("#targetDisplay")).toBeInViewport();
    await expect(page.locator("#answerInput")).toBeInViewport();
    await expect(page.locator(".keyboard-board")).toBeInViewport();
  });

  test("practices Hangul/English switching before the home-key warmup", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator("#answerInput").fill("rk");
    await expect(page.locator("#feedbackStrip")).toContainText("한/영 키를 눌러");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await expectKeyHasClass(page, "KeyR", "is-next-key");

    await beginComposition(page, "ㄱ");
    await expectKeyHasClass(page, "KeyK", "is-next-key");
    await expectKeyHasClass(page, "KeyR", "is-typed");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await endComposition(page, "ㄱ");
    await expect(page.locator("#completedCount")).toHaveText("0");

    await page.locator("#answerInput").fill("가");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");
    await expectKeyHasClass(page, "KeyF", "is-target");

    await pressPhysicalKey(page, "KeyF");
    await expect(page.locator("#completedCount")).toHaveText("2");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅓ");
    await expectKeyHasClass(page, "KeyJ", "is-target");

    await pressPhysicalKey(page, "KeyJ");
    await expect(page.locator("#completedCount")).toHaveText("3");
    await expect(page.locator("#feedbackStrip")).toContainText("준비 완료");
    await expectTransition(page, "자판 보기");

    await page.locator("#transitionNextButton").click();
    await expect(page.locator("#transitionOverlay")).toBeVisible();
    await expect(page.locator("#missionTitle")).toHaveText("준비");
    await expect(page.locator("#transitionMessage")).toContainText("마우스 대신");

    await page.keyboard.press("r");
    await expect(page.locator("#transitionOverlay")).toBeHidden();
    await expect(page.locator("#missionTitle")).toHaveText("준비");
    await expect(page.locator("#targetDisplay")).toHaveText("가");
    await expect(page.locator("#completedCount")).toHaveText("0");
  });

  test("does not use the stage list as a mouse navigation control", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await page.locator('[data-stage-index="2"]').dispatchEvent("click");
    await expect(page.locator("#missionTitle")).toHaveText("준비");
    await expect(page.locator("#targetDisplay")).toHaveText("가");
  });

  test("moves through the layout stage with real keys and overlay shortcuts", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await reachLayout(page);
    await expect(page.locator("#missionTitle")).toHaveText("자판 보기");
    await expect(page.locator("#totalCount")).toHaveText("4");
    await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");

    await completeKeyStage(page, LAYOUT_KEYS, "홈키 자리 찾기");
    await page.keyboard.press("Enter");
    await expect(page.locator("#missionTitle")).toHaveText("홈키 자리 찾기");
  });

  test("expands home-key and common-jamo physical key practice", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await reachHome(page);
    await expect(page.locator("#totalCount")).toHaveText("14");
    await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");
    await pressPhysicalKey(page, "KeyF");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅓ");

    for (const code of HOME_KEYS.slice(1)) {
      await pressPhysicalKey(page, code);
    }
    await expectTransition(page, "자주 쓰는 자모 찾기");
    await nextPractice(page, "자주 쓰는 자모 찾기");
    await expect(page.locator("#totalCount")).toHaveText("14");
    await expect(page.locator("#targetDisplay")).toHaveText("ㄱ");
  });

  test("checks Hangul text input and keeps the next-key guide after English warning", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await reachSyllables(page);
    await expect(page.locator("#totalCount")).toHaveText("24");
    await expect(page.locator("#targetDisplay")).toHaveText("가");
    await expectKeyHasClass(page, "KeyR", "is-required");
    await expectKeyHasClass(page, "KeyK", "is-required");
    await expectKeyHasClass(page, "KeyR", "is-next-key");
    await expectNextKeyAnimation(page, "KeyR");

    await beginComposition(page, "ㄱ");
    await expectKeyHasClass(page, "KeyR", "is-typed");
    await expectKeyHasClass(page, "KeyK", "is-next-key");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await endComposition(page, "ㄱ");
    await expect(page.locator("#completedCount")).toHaveText("0");

    await page.locator("#answerInput").fill("ga");
    await expect(page.locator("#feedbackStrip")).toContainText("한/영 키 확인");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await expectKeyHasClass(page, "KeyR", "is-next-key");

    await page.locator("#answerInput").fill("가");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("나");
    await expectKeyHasClass(page, "KeyS", "is-next-key");
    await expectKeyHasClass(page, "KeyK", "is-required");
  });

  test("updates word-stage key guides with the expanded word list", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await reachWords(page);
    await expect(page.locator("#totalCount")).toHaveText("18");
    await expect(page.locator("#targetDisplay")).toHaveText("한국");
    for (const code of ["KeyG", "KeyK", "KeyS", "KeyR", "KeyN"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyHasClass(page, "KeyG", "is-next-key");

    await beginComposition(page, "ㅎ");
    await expectKeyHasClass(page, "KeyG", "is-typed");
    await expectKeyHasClass(page, "KeyK", "is-next-key");

    await updateComposition(page, "하");
    await expectKeyHasClass(page, "KeyS", "is-next-key");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await endComposition(page, "하");

    await page.locator("#answerInput").fill("한");
    await expectKeyHasClass(page, "KeyR", "is-next-key");

    await page.locator("#answerInput").fill("한ㄱ");
    await expectKeyHasClass(page, "KeyN", "is-next-key");

    await page.locator("#answerInput").fill("한구");
    await expectKeyHasClass(page, "KeyR", "is-next-key");

    await page.locator("#answerInput").fill("한국");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("학생");
    await expectKeyHasClass(page, "KeyG", "is-next-key");
    for (const code of ["KeyT", "KeyO", "KeyD"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyNotHasClass(page, "KeyN", "is-required");
  });

  test("runs the rhythm word lane with success, English warning, and summary results", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    await reachRhythm(page);
    await expect(page.locator("#totalCount")).toHaveText("18");
    await expect(page.locator(".rhythm-lane")).toBeVisible();
    await expect(page.locator(".rhythm-judge-line")).toBeVisible();
    await expect(page.locator("#answerInput")).toBeVisible();
    await expect(page.locator("#rhythmWordCard")).toHaveText("한국");
    for (const code of ["KeyG", "KeyK", "KeyS", "KeyR", "KeyN"]) {
      await expectKeyHasClass(page, code, "is-required");
    }
    await expectKeyHasClass(page, "KeyG", "is-next-key");

    await beginComposition(page, "하");
    await expectKeyHasClass(page, "KeyS", "is-next-key");
    await expect(page.locator("#completedCount")).toHaveText("0");
    await endComposition(page, "하");

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

    for (const target of WORD_TARGETS.slice(1)) {
      await page.locator("#answerInput").fill(target);
    }
    await expectTransition(page, "마무리");
    await nextPractice(page, "마무리");
    await expect(page.locator("#stageTask")).toContainText("리듬 성공");
    await expect(page.locator("#stageTask")).toContainText("18");
    await expect(page.locator("#stageTask")).toContainText("한/영 확인");
  });

  test("puts the target input and keyboard before progress info on narrow screens without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");

    const focusBox = await page.locator(".keyboard-focus-strip").boundingBox();
    const boardBox = await page.locator(".keyboard-board").boundingBox();
    const missionBox = await page.locator(".mission-panel").boundingBox();
    expect(focusBox.y).toBeLessThan(boardBox.y);
    expect(boardBox.y).toBeLessThan(missionBox.y);
    await expect(page.locator("#targetDisplay")).toBeInViewport();

    await reachRhythm(page);
    await expect(page.locator("#missionTitle")).toHaveText("리듬 단어 입력");
    await expect(page.locator(".rhythm-lane")).toBeVisible();

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
