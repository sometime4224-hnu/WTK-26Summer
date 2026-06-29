const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://cdn.tailwindcss.com/**", (route) => route.abort());
}

async function openGrammarCardGame(page, viewport) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto("/c12/grammar1-card-game.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.__C12_GRAMMAR_CARD_GAME__));
}

async function startFixedQuestion(page, stage = "stage1", index = 0) {
  await page.evaluate(({ stage, index }) => {
    const api = window.__C12_GRAMMAR_CARD_GAME__;
    const question = api.getStages()[stage][index];
    api.startWithQuestions([question]);
  }, { stage, index });
  await expect(page.locator("#screen-game")).toHaveClass(/active/);
}

async function startFixedQuestions(page, stages) {
  await page.evaluate((stageSpecs) => {
    const api = window.__C12_GRAMMAR_CARD_GAME__;
    const stageData = api.getStages();
    api.startWithQuestions(stageSpecs.map(({ stage, index }) => stageData[stage][index]));
  }, stages);
  await expect(page.locator("#screen-game")).toHaveClass(/active/);
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  )).toBe(true);
}

async function expectChoicesUsable(page, minimumVisible = 4) {
  await page.locator("#choicesGrid").scrollIntoViewIfNeeded();
  const visibleCount = await page.locator("#choicesGrid .choice-card").evaluateAll((cards) => {
    const viewportHeight = document.documentElement.clientHeight;
    return cards.filter((card) => {
      const rect = card.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < viewportHeight;
    }).length;
  });
  expect(visibleCount).toBeGreaterThanOrEqual(minimumVisible);
}

async function placeByTap(page, cardId, slotKey) {
  await page.locator(`#choice-${cardId}`).click();
  await page.locator(`[data-slot="${slotKey}"]`).click();
}

async function answerCurrentQuestionCorrectlyWithApi(page) {
  await page.evaluate(() => {
    const api = window.__C12_GRAMMAR_CARD_GAME__;
    const state = api.getState();
    const question = state.questions[state.current];
    question.slots.forEach((slot) => api.place(slot.answer, slot.key));
    api.check();
  });
}

test("c12 grammar card game links stay on the canonical page", async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto("/c12/grammar1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="grammar1-card-game.html"]')).toContainText("문법 카드 게임");

  await page.goto("/c12/index.html", { waitUntil: "domcontentloaded" });
  const gameLink = page.locator('a[href="grammar1-card-game.html"]').filter({ hasText: "문법 카드 게임" });
  await expect(gameLink).toBeVisible();
  await gameLink.click();
  await expect(page).toHaveURL(/\/c12\/grammar1-card-game\.html$/);
});

test("c12 grammar card game uses button choice cards and stays usable on a regular phone", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page);

  await expect(page.locator(".game-sheet")).toHaveCount(0);
  await expect(page.locator("#choicesGrid .choice-card")).toHaveCount(5);
  await expect(page.locator("#choicesGrid .choice-card").first()).toHaveJSProperty("tagName", "BUTTON");
  await expect(page.locator("#checkBtn")).toBeDisabled();
  await expectChoicesUsable(page, 4);
  await expectNoHorizontalOverflow(page);
});

test("c12 grammar card game avoids clipped controls on a small phone", async ({ page }) => {
  await openGrammarCardGame(page, { width: 360, height: 640 });
  await startFixedQuestion(page);

  await expect(page.locator("#board")).toBeVisible();
  await expect(page.locator("#choicesGrid .choice-card")).toHaveCount(5);
  await expectChoicesUsable(page, 4);
  await page.locator("#checkBtn").scrollIntoViewIfNeeded();
  await expect(page.locator("#checkBtn")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("c12 grammar card game keeps tablet and desktop layouts readable", async ({ page }) => {
  await openGrammarCardGame(page, { width: 768, height: 1024 });
  await startFixedQuestion(page);
  await expectChoicesUsable(page, 5);
  await expectNoHorizontalOverflow(page);

  await openGrammarCardGame(page, { width: 1366, height: 768 });
  await startFixedQuestion(page);
  const columnCount = await page.locator(".game-layout").evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns.trim();
    return columns ? columns.split(/\s+/).length : 0;
  });
  expect(columnCount).toBeGreaterThanOrEqual(2);
  await expectChoicesUsable(page, 5);
  await expectNoHorizontalOverflow(page);
});

test("c12 grammar card game supports tap placement, grading, and next action", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page);

  await page.locator("#choice-v03").click();
  await expect(page.locator("#choice-v03")).toHaveClass(/selected/);
  await page.locator('[data-slot="before"]').click();
  await expect(page.locator('[data-slot="before"]')).toContainText("스트레칭을 하다");
  await expect(page.locator("#choice-v03")).toBeDisabled();

  await placeByTap(page, "n09", "after");
  await expect(page.locator("#checkBtn")).toBeEnabled();
  await page.locator("#checkBtn").click();

  await expect(page.locator("#feedbackBox")).toContainText("정답이에요");
  await expect(page.locator("#feedbackBox")).toContainText("뒤 결과: 기분이 상쾌하다");
  await expect(page.locator("#changeStage")).toContainText("스트레칭을 하다");
  await expect(page.locator("#changeStage")).toContainText("기분이 상쾌하다");
  await expect(page.locator("#nextBtn")).toBeVisible();
});

test("c12 grammar card game supports drag placement and slot removal", async ({ page }) => {
  await openGrammarCardGame(page, { width: 1024, height: 768 });
  await startFixedQuestion(page);

  await page.locator("#choice-v03").dragTo(page.locator('[data-slot="before"]'));
  await expect(page.locator('[data-slot="before"]')).toContainText("스트레칭을 하다");
  await expect(page.locator("#choice-v03")).toBeDisabled();

  await page.locator('[data-slot="before"]').click();
  await expect(page.locator('[data-slot="before"]')).not.toContainText("스트레칭을 하다");
  await expect(page.locator("#choice-v03")).toBeEnabled();
});

test("c12 grammar card game marks wrong and correct slots with answer labels", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page);

  await placeByTap(page, "v03", "before");
  await placeByTap(page, "n11", "after");
  await page.locator("#checkBtn").click();

  await expect(page.locator('[data-slot="before"]')).toHaveClass(/correct/);
  await expect(page.locator('[data-slot="after"]')).toHaveClass(/wrong/);
  await expect(page.locator("#feedbackBox")).toContainText("구조를 다시 확인해 보세요");
  await expect(page.locator("#feedbackBox")).toContainText("뒤 결과: 기분이 상쾌하다");
});

test("c12 grammar card game shows the stage-two break screen", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestions(page, [
    { stage: "stage1", index: 0 },
    { stage: "stage2", index: 0 },
  ]);

  await placeByTap(page, "v03", "before");
  await placeByTap(page, "n09", "after");
  await page.locator("#checkBtn").click();
  await page.locator("#nextBtn").click();

  await expect(page.locator("#screen-break")).toHaveClass(/active/);
  await expect(page.locator("#screen-break")).toContainText("2단계 시작");
  await page.locator("#continueBtn").click();
  await expect(page.locator("#screen-game")).toHaveClass(/active/);
  await expect(page.locator("#stageChip")).toHaveText("2단계");
  await expect(page.locator('[data-slot="shared"]')).toContainText("공통 행동");
});

test("c12 grammar card game renders the configured change effect for each stage-one question", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });

  const expectedEffects = ["flow-wave", "glow-rise", "heal-pulse", "gauge-shift", "gauge-shift"];
  for (let index = 0; index < expectedEffects.length; index += 1) {
    await startFixedQuestion(page, "stage1", index);
    await answerCurrentQuestionCorrectlyWithApi(page);

    await expect(page.locator("#changeStage")).toHaveAttribute("data-effect", expectedEffects[index]);
    const effect = await page.evaluate(() => window.__C12_GRAMMAR_CARD_GAME__.getLastEffect());
    expect(effect.effect).toBe(expectedEffects[index]);
    expect(effect.auto).toBe(true);
  }
});

test("c12 grammar card game replays and reveals change flows from feedback", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page, "stage1", 1);
  await answerCurrentQuestionCorrectlyWithApi(page);

  await expect(page.locator("#replayEffectBtn")).toBeVisible();
  await page.locator("#replayEffectBtn").click();
  await expect(page.locator("#changeStage")).toHaveAttribute("data-effect", "glow-rise");
  await expect(page.locator("#changeStage")).toContainText("일찍 자다");
  await expect(page.locator("#changeStage")).toContainText("기운이 나다");

  await startFixedQuestion(page, "stage1", 0);
  await placeByTap(page, "v03", "before");
  await placeByTap(page, "n11", "after");
  await page.locator("#checkBtn").click();

  await expect(page.locator("#changeStage")).toHaveClass(/hidden/);
  await expect(page.locator("#revealEffectBtn")).toBeVisible();
  await page.locator("#revealEffectBtn").click();
  await expect(page.locator("#changeStage")).toHaveAttribute("data-effect", "flow-wave");
  await expect(page.locator("#changeStage")).toContainText("기분이 상쾌하다");
});

test("c12 grammar card game uses split-compare for stage two change visualization", async ({ page }) => {
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page, "stage2", 0);
  await answerCurrentQuestionCorrectlyWithApi(page);

  await expect(page.locator("#changeStage")).toHaveAttribute("data-effect", "split-compare");
  await expect(page.locator("#changeStage")).toContainText("-아/어서");
  await expect(page.locator("#changeStage")).toContainText("-았/었더니");
  await expect(page.locator("#changeStage")).toContainText("이어서 한 행동");
  await expect(page.locator("#changeStage")).toContainText("해 보니 생긴 결과");
});

test("c12 grammar card game keeps the change stage accessible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openGrammarCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page, "stage1", 2);
  await answerCurrentQuestionCorrectlyWithApi(page);

  await expect(page.locator("#changeStage")).toHaveAttribute("aria-live", "polite");
  await expect(page.locator("#changeStage")).toHaveAttribute("data-effect", "heal-pulse");
  await expect(page.locator("#changeStage")).toContainText("푹 쉬다");
  await expect(page.locator("#changeStage")).toContainText("몸이 좋아지다");
  await expectNoHorizontalOverflow(page);
});
