const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const PAGE_PATH = "/c14/vocab-support-symbol-quiz.html";
const STORAGE_KEY = "c14-vocab-symbol-quiz-v1";
const repoRoot = path.resolve(__dirname, "../..");

function sourceVocabularyWords() {
  const source = fs.readFileSync(path.join(repoRoot, "c14", "vocabulary.html"), "utf8");
  const configStart = source.indexOf("window.VOCABULARY_CONFIG =");
  const configEnd = source.indexOf("window.MULTILANG_CONFIG", configStart);
  return [...source.slice(configStart, configEnd).matchAll(/\bko:\s*"([^"]+)"/g)].map((match) => match[1]);
}

async function clearProgress(page) {
  await page.addInitScript(({ key, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    localStorage.removeItem(key);
    sessionStorage.setItem(marker, "true");
  }, { key: STORAGE_KEY, marker: "c14-vocab-symbol-quiz-test-cleared" });
}

test.beforeEach(async ({ page }) => {
  await clearProgress(page);
});

test("14과 28개 원본 어휘를 상징 학습과 퀴즈로 연결한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toHaveText("상징으로 익히는 14과 어휘");
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.locator(".group-button")).toHaveCount(5);

  const data = await page.evaluate(() => window.C14_VOCAB_SYMBOL_QUIZ.words);
  const sourceWords = sourceVocabularyWords();
  expect(data.map((item) => item.word)).toEqual(sourceWords);
  expect(new Set(data.map((item) => item.id)).size).toBe(28);
  expect(data.every((item) => item.tokens.length && item.visualAlt && item.clue && item.meaning)).toBe(true);
  expect(data.every((item) => !item.visualAlt.includes(item.word))).toBe(true);
  expect(data.flatMap((item) => item.tokens).some((token) => /[\p{Extended_Pictographic}]/u.test(token))).toBe(true);
  expect(await page.locator("body").innerText()).not.toMatch(/[A-Za-z]{2,}/);
  await expect(page.locator(".visual-line")).toHaveAttribute("aria-hidden", "true");

  await page.goto("/c14/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="vocab-support-symbol-quiz.html"]')).toContainText("상징으로 익히는 14과 어휘");
  await expect(page.locator(".hero__chip").filter({ hasText: "어휘 4개" })).toHaveCount(1);
  await expect(page.locator(".path-card__badge").filter({ hasText: "어휘 메인 + 활동 3개" })).toHaveCount(1);

  await page.goto("/c14/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="vocab-support-symbol-quiz.html"]')).toContainText("상징 퀴즈");
  await expect(page.locator('.footer-nav a[href="vocab-support-symbol-quiz.html"]')).toContainText("상징 퀴즈");
});

test("상징을 보고 어휘와 쉬운 뜻을 확인한 위치를 복원한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("tab", { name: /상징 익히기/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".study-progress")).toHaveText("1 / 28");
  await expect(page.locator(".visual-stage[role=img]")).toHaveCount(1);
  await page.getByRole("button", { name: "어휘 보기" }).click();
  await expect(page.locator(".study-word")).toHaveText("여유가 있다");
  await expect(page.locator(".study-meaning")).toBeVisible();
  await page.getByRole("button", { name: "다음 →" }).click();
  await expect(page.locator(".study-progress")).toHaveText("2 / 28");

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.study.index).toBe(1);
  expect(saved.study.revealedIds).toEqual(["time-room"]);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".study-progress")).toHaveText("2 / 28");
  await expect(page.locator("#study-count")).toHaveText("1 / 28");
});

test("상징만 보고 오답을 고친 뒤 정답과 시도를 복원한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /표현 맞히기/ }).click();

  const question = await page.evaluate(() => {
    const api = window.C14_VOCAB_SYMBOL_QUIZ;
    const state = api.getState();
    const id = state.quiz.order[state.quiz.index];
    const item = api.words.find((word) => word.id === id);
    return { id, word: item.word, meaning: item.meaning, options: state.quiz.optionsById[id] };
  });
  const quizVisualText = await page.locator(".quiz-visual").innerText();
  expect(quizVisualText).not.toContain(question.word);
  expect(quizVisualText).not.toContain(question.meaning);
  await expect(page.locator(".quiz-option")).toHaveCount(4);

  const wrongId = question.options.find((id) => id !== question.id);
  await page.locator(`[data-option-id="${wrongId}"]`).click();
  await expect(page.locator(".feedback")).toHaveClass(/is-wrong/);
  await expect(page.locator(".quiz-progress")).toHaveText("문제 1 / 28");
  await page.locator(`[data-option-id="${question.id}"]`).click();
  await expect(page.locator(".feedback")).toContainText(`정답 · ${question.word}`);
  await expect(page.locator("[data-quiz-next]")).toBeFocused();

  let saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.quiz.answers[question.id].attemptIds).toEqual([wrongId, question.id]);
  expect(saved.quiz.answers[question.id].firstTry).toBe(false);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".feedback")).toContainText(`정답 · ${question.word}`);
  await expect(page.locator("[data-quiz-next]")).toBeVisible();
});

test("28문항을 끝까지 풀고 결과와 다시 풀기를 제공한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /표현 맞히기/ }).click();

  for (let index = 0; index < 28; index += 1) {
    const answerId = await page.evaluate(() => {
      const state = window.C14_VOCAB_SYMBOL_QUIZ.getState();
      return state.quiz.order[state.quiz.index];
    });
    await page.locator(`[data-option-id="${answerId}"]`).click();
    await expect(page.locator(".feedback")).toHaveClass(/is-correct/);
    await page.locator("[data-quiz-next]").click();
  }

  await expect(page.locator(".result h2")).toHaveText("28문제를 모두 풀었어요");
  await expect(page.locator(".result__score")).toHaveText("첫 시도 정답 28 / 28");
  await expect(page.locator("#quiz-count")).toHaveText("28 / 28");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".result")).toBeVisible();

  await page.getByRole("button", { name: "다시 풀기" }).click();
  await expect(page.locator(".quiz-progress")).toHaveText("문제 1 / 28");
  expect(await page.evaluate(() => Object.keys(window.C14_VOCAB_SYMBOL_QUIZ.getState().quiz.answers))).toEqual([]);
});

test("저장값을 정리하고 키보드 탭과 기록 지우기를 지원한다", async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      mode: "잘못된 값",
      study: { index: 999, revealedIds: ["없는 값", "time-room"] },
      quiz: { order: ["없는 값"], index: 999, optionsById: {}, answers: { "없는 값": { correct: true } } }
    }));
  }, { key: STORAGE_KEY });
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => window.C14_VOCAB_SYMBOL_QUIZ.getState())).toMatchObject({
    mode: "study",
    study: { index: 27, revealedIds: ["time-room"] }
  });

  const studyTab = page.getByRole("tab", { name: /상징 익히기/ });
  const quizTab = page.getByRole("tab", { name: /표현 맞히기/ });
  await studyTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(quizTab).toBeFocused();
  await expect(quizTab).toHaveAttribute("aria-selected", "true");

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-reset-all]").click();
  await expect(page.locator(".study-progress")).toHaveText("1 / 28");
  await expect(page.locator("#study-count")).toHaveText("0 / 28");
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 }
]) {
  test(`${viewport.width}×${viewport.height}에서 넘침 없이 첫 학습 행동을 보여 준다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
    const metrics = await page.evaluate(() => {
      const action = document.querySelector("[data-reveal]").getBoundingClientRect();
      const visual = document.querySelector(".visual-stage").getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        actionBottom: action.bottom,
        actionWidth: action.width,
        actionHeight: action.height,
        visualLeft: visual.left,
        visualRight: visual.right,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight
      };
    });
    expect(metrics.overflow).toBeLessThanOrEqual(1);
    expect(metrics.actionBottom).toBeLessThanOrEqual(metrics.viewportHeight);
    expect(metrics.actionWidth).toBeGreaterThanOrEqual(44);
    expect(metrics.actionHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.visualLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.visualRight).toBeLessThanOrEqual(metrics.viewportWidth);
  });
}
