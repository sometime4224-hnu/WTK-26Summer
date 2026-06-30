const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function selectRequiredChoices(page) {
  const labels = await page.evaluate(() => (
    window.C12_GRAMMAR4_CONDITION_GAME_APP
      .getCurrentRound()
      .choices
      .filter((choice) => choice.required)
      .map((choice) => choice.label)
  ));

  for (const label of labels) {
    await page.locator(".choice-card").filter({ hasText: label }).click();
  }
}

test("c12 grammar4 condition game is linked from chapter, grammar, and support pages", async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto("/c12/index.html", { waitUntil: "domcontentloaded" });
  const grammar4Card = page.locator(".path-card").filter({ hasText: "문법 4" });
  await expect(grammar4Card.locator('a[href="grammar4-support-activity2.html"]')).toContainText("필수 조건 고르기");

  await page.goto("/c12/grammar4.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.resource-link[href="grammar4-support-activity2.html"]')).toContainText("보조활동 2");

  await page.goto("/c12/grammar4-support-activity1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.rail__link[href="grammar4-support-activity2.html"]')).toContainText("필수 조건 고르기");
});

test("c12 grammar4 condition game renders rounds, images, and correct feedback", async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/c12/grammar4-support-activity2.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toContainText("필수 조건 고르기");
  await expect(page.locator(".choice-card")).toHaveCount(4);

  const structure = await page.evaluate(() => ({
    rounds: window.C12_GRAMMAR4_CONDITION_GAME.rounds.length,
    choiceCounts: window.C12_GRAMMAR4_CONDITION_GAME.rounds.map((round) => round.choices.length),
    requiredCounts: window.C12_GRAMMAR4_CONDITION_GAME.rounds.map((round) => round.choices.filter((choice) => choice.required).length),
    requiredDistribution: Array.from(new Set(
      window.C12_GRAMMAR4_CONDITION_GAME.rounds.map((round) => round.choices.filter((choice) => choice.required).length)
    )).sort((a, b) => a - b),
    answerPatterns: window.C12_GRAMMAR4_CONDITION_GAME.rounds.map((round) => (
      round.choices.map((choice) => (choice.required ? "T" : "F")).join("")
    )),
    noticesExposeConditionGrammar: window.C12_GRAMMAR4_CONDITION_GAME.rounds.every((round) => (
      /해야|있어야|받아야|내야|채워야|제출해야|준비해야|확인해야|예약해야|운전해야|보여 줘야/.test(round.notice)
    )),
    firstThreeWithoutOptionalText: window.C12_GRAMMAR4_CONDITION_GAME.rounds.slice(0, 3).every((round) => !round.notice.includes("선택")),
    roundsFromFourWithOptionalText: window.C12_GRAMMAR4_CONDITION_GAME.rounds.slice(3).every((round) => round.notice.includes("선택")),
    uniqueImageCount: new Set(window.C12_GRAMMAR4_CONDITION_GAME.rounds.flatMap((round) => round.choices.map((choice) => choice.src))).size,
    hasAppHandle: Boolean(window.C12_GRAMMAR4_CONDITION_GAME_APP),
  }));
  expect(structure.rounds).toBe(15);
  expect(structure.choiceCounts).toEqual(Array(15).fill(4));
  expect(structure.requiredCounts).toEqual([3, 3, 3, 3, 2, 2, 2, 1, 2, 2, 3, 3, 1, 2, 3]);
  expect(structure.requiredDistribution).toEqual([1, 2, 3]);
  expect(new Set(structure.answerPatterns).size).toBeGreaterThan(1);
  expect(structure.answerPatterns.filter((pattern) => /^T+F+$/.test(pattern))).toEqual([]);
  expect(structure.uniqueImageCount).toBe(60);
  expect(structure.noticesExposeConditionGrammar).toBe(true);
  expect(structure.firstThreeWithoutOptionalText).toBe(true);
  expect(structure.roundsFromFourWithOptionalText).toBe(true);
  expect(structure.hasAppHandle).toBe(true);
  await expect(page.locator("#roundNotice")).toContainText("채워야");
  await expect(page.locator("#roundNotice .grammar-hit")).toHaveCount(3);

  await expect.poll(async () => page.locator(".choice-image").evaluateAll((images) => (
    images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)
  ))).toBe(true);

  const imageReport = await page.evaluate(async () => {
    const config = window.C12_GRAMMAR4_CONDITION_GAME;
    const srcs = Array.from(new Set(config.rounds.flatMap((round) => (
      round.choices.map((choice) => config.assetBase + choice.src)
    ))));
    const results = await Promise.all(srcs.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({ src, loaded: image.naturalWidth > 0 && image.naturalHeight > 0 });
      image.onerror = () => resolve({ src, loaded: false });
      image.src = src;
    })));
    return {
      count: srcs.length,
      failed: results.filter((result) => !result.loaded).map((result) => result.src),
    };
  });
  expect(imageReport.count).toBe(60);
  expect(imageReport.failed).toEqual([]);

  await selectRequiredChoices(page);
  await page.locator("#checkBtn").click();

  await expect(page.locator("#feedbackBox")).toContainText("정답입니다");
  await expect(page.locator("#modelSentence")).toContainText("졸업하려면");
  await expect(page.locator("#nextBtn")).toBeEnabled();
  await expect(page.locator(".choice-card.is-correct")).toHaveCount(3);
});

test("c12 grammar4 condition game explains missing and wrong choices", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c12/grammar4-support-activity2.html", { waitUntil: "domcontentloaded" });

  await page.locator(".choice-card").filter({ hasText: "졸업 학점 채우기" }).click();
  await page.locator(".choice-card").filter({ hasText: "동아리 파티 참석" }).click();
  await page.locator("#checkBtn").click();

  await expect(page.locator("#feedbackBox")).toContainText("빠뜨린 조건");
  await expect(page.locator("#feedbackBox")).toContainText("졸업시험 통과");
  await expect(page.locator("#feedbackBox")).toContainText("잘못 고른 선택");
  await expect(page.locator("#feedbackBox")).toContainText("동아리 파티 참석");
  await expect(page.locator(".choice-card.is-missing")).toHaveCount(2);
  await expect(page.locator(".choice-card.is-wrong")).toHaveCount(1);

  await page.locator("#retryBtn").click();
  await expect(page.locator("#feedbackBox")).toBeHidden();
  await expect(page.locator(".choice-card[aria-pressed='true']")).toHaveCount(0);
});

test("c12 grammar4 condition game completes and restarts", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c12/grammar4-support-activity2.html", { waitUntil: "domcontentloaded" });

  const roundCount = await page.evaluate(() => window.C12_GRAMMAR4_CONDITION_GAME.rounds.length);

  for (let index = 0; index < roundCount; index += 1) {
    await selectRequiredChoices(page);
    await page.locator("#checkBtn").click();
    await expect(page.locator("#feedbackBox")).toContainText("정답입니다");
    await page.locator("#nextBtn").click();
  }

  await expect(page.locator("#resultPanel")).toContainText(`정확히 맞힌 라운드 ${roundCount} / ${roundCount}`);
  await expect(page.locator("#resultPanel .result-list li")).toHaveCount(roundCount);

  await page.locator("#restartGameBtn").click();
  await expect(page.locator("#roundTitle")).toContainText("졸업");
  await expect(page.locator("#scoreBadge")).toContainText(`0 / ${roundCount}`);
});

test("c12 grammar4 condition game keeps the first task usable on phone width", async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c12/grammar4-support-activity2.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#roundTitle")).toBeVisible();
  await expect(page.locator(".choice-card")).toHaveCount(4);
  await expect(page.locator("#checkBtn")).toBeVisible();

  const layout = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll(".choice-card")).map((card) => card.getBoundingClientRect());
    const checkButton = document.querySelector("#checkBtn").getBoundingClientRect();
    return {
      twoColumns: Math.abs(cards[0].top - cards[1].top) < 2 && cards[0].right <= cards[1].left,
      checkFits: checkButton.left >= 0 && checkButton.right <= window.innerWidth,
      firstActionVisible: checkButton.top < window.innerHeight
    };
  });

  expect(layout.twoColumns).toBe(true);
  expect(layout.checkFits).toBe(true);
  expect(layout.firstActionVisible).toBe(true);
  await expectNoHorizontalOverflow(page);
});
