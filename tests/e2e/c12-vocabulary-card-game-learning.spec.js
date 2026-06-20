const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://cdn.tailwindcss.com/**", (route) => route.abort());
}

async function openCardGame(page, viewport, options = {}) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto("/c12/vocabulary-card-game.html", { waitUntil: "domcontentloaded" });
  await page.evaluate((pcMode) => {
    if (pcMode) {
      localStorage.setItem("c12-pc-mode", "true");
    } else {
      localStorage.removeItem("c12-pc-mode");
    }
  }, Boolean(options.pcMode));
  if (options.pcMode) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveClass(/pc-mode/);
  }
  await page.waitForFunction(() => Boolean(window.__C12_VOCAB_CARD_GAME__));
}

async function startFixedQuestion(page, spec) {
  await page.evaluate((questionSpec) => {
    window.__C12_VOCAB_CARD_GAME__.startWithQuestions([questionSpec]);
  }, spec);
  await expect(page.locator("#screen-game")).toHaveClass(/active/);
  await expect(page.locator("#choices-grid .choice-card")).toHaveCount(4);
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  )).toBe(true);
}

async function answerAndContinue(page, locator) {
  await locator.click();
  await expect(page.locator("#next-btn")).toBeVisible();
  await page.locator("#next-btn").click();
}

test("c12 vocabulary card game shows a role prompt and same-role choices", async ({ page }) => {
  await openCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page, {
    eqIndex: 0,
    blankIdx: 1,
    choices: ["v03", "v04", "v05", "v06"],
  });

  await expect(page.locator("#question-prompt")).toHaveText("빈칸에 들어갈 방법 카드를 고르세요.");
  await expect(page.locator(".blank-role")).toHaveText("방법 카드");
  await expect(page.locator("#choices-grid .card-role-badge")).toHaveText([
    "방법",
    "방법",
    "방법",
    "방법",
  ]);

  const roles = await page.locator("#choices-grid .choice-card").evaluateAll((cards) =>
    cards.map((card) => card.dataset.role)
  );
  expect(roles).toEqual(["action", "action", "action", "action"]);
  await expectNoHorizontalOverflow(page);
});

test("c12 vocabulary card game explains both wrong and correct answers", async ({ page }) => {
  await openCardGame(page, { width: 390, height: 844 });
  await startFixedQuestion(page, {
    eqIndex: 0,
    blankIdx: 1,
    choices: ["v03", "v04", "v05", "v06"],
  });

  await page.locator("#choice-v03").click();
  await expect(page.locator("#feedback-text")).toContainText("틀렸어요. 정답: 푹 쉬다");
  await expect(page.locator("#feedback-text")).toContainText("몸이 무거울 때 푹 쉬면 몸이 좋아져요.");
  await expect(page.locator("#choice-v04")).toHaveClass(/reveal-correct/);

  await startFixedQuestion(page, {
    eqIndex: 1,
    blankIdx: 0,
    choices: ["v01", "v02", "n04a", "n08"],
  });

  await page.locator("#choice-v01").click();
  await expect(page.locator("#feedback-text")).toContainText("정답! +10점");
  await expect(page.locator("#feedback-text")).toContainText("기운이 없을 때 일찍 자면 기분이 상쾌해져요.");
  await expect(page.locator("#next-btn")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("c12 vocabulary card game reports role accuracy and weakest role", async ({ page }) => {
  await openCardGame(page, { width: 390, height: 844 });
  await page.evaluate(() => {
    window.__C12_VOCAB_CARD_GAME__.startWithQuestions([
      { eqIndex: 0, blankIdx: 0, choices: ["n04a", "v01", "v02", "n08"] },
      { eqIndex: 0, blankIdx: 1, choices: ["v03", "v04", "v05", "v06"] },
      { eqIndex: 0, blankIdx: 2, choices: ["n09", "n10", "n11", "n12"] },
    ]);
  });

  await answerAndContinue(page, page.locator("#choice-n04a"));
  await answerAndContinue(page, page.locator("#choice-v03"));
  await answerAndContinue(page, page.locator("#choice-n11"));

  await expect(page.locator("#screen-result")).toHaveClass(/active/);
  await expect(page.locator("#result-role-summary")).toContainText("상태");
  await expect(page.locator("#result-role-summary")).toContainText("1/1 · 100%");
  await expect(page.locator("#result-role-summary")).toContainText("방법");
  await expect(page.locator("#result-role-summary")).toContainText("0/1 · 0%");
  await expect(page.locator("#result-role-summary")).toContainText("결과");
  await expect(page.locator("#result-advice")).toHaveText("이번에는 방법 카드를 더 연습해 보세요.");
  await expect(page.locator("#result-list")).toContainText("빈칸: 방법");
  await expect(page.locator("#result-list")).toContainText("몸이 무거울 때 푹 쉬면 몸이 좋아져요.");
  await expectNoHorizontalOverflow(page);
});

for (const scenario of [
  { name: "small phone", viewport: { width: 360, height: 640 } },
  { name: "regular phone", viewport: { width: 390, height: 844 } },
  { name: "tablet landscape", viewport: { width: 1024, height: 768 } },
  { name: "pc mode", viewport: { width: 1366, height: 768 }, pcMode: true },
]) {
  test(`c12 vocabulary card game learning UI avoids horizontal overflow on ${scenario.name}`, async ({ page }) => {
    await openCardGame(page, scenario.viewport, { pcMode: scenario.pcMode });
    await startFixedQuestion(page, {
      eqIndex: 0,
      blankIdx: 1,
      choices: ["v03", "v04", "v05", "v06"],
    });
    await page.locator("#choice-v04").click();
    await expect(page.locator("#feedback-text")).toContainText("몸이 무거울 때 푹 쉬면 몸이 좋아져요.");
    await expect(page.locator("#next-btn")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
