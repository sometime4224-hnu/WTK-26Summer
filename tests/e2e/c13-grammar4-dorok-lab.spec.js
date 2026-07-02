const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function answerCurrentRound(page, { correct = true } = {}) {
  const answer = await page.evaluate((wantCorrect) => {
    const round = window.C13_GRAMMAR4_DOROK_LAB_APP.getCurrentRound();
    const choice = wantCorrect
      ? round.correctChoiceId
      : round.choices.find((item) => item.id !== round.correctChoiceId).id;
    const lens = wantCorrect
      ? round.lens
      : window.C13_GRAMMAR4_DOROK_LAB.lenses.find((item) => item.id !== round.lens).id;
    const evidence = wantCorrect
      ? round.evidence
      : window.C13_GRAMMAR4_DOROK_LAB.evidences.find((item) => item.id !== round.evidence).id;
    return { choice, lens, evidence };
  }, correct);

  await page.locator(`[data-choice="${answer.choice}"]`).click();
  await page.locator(`[data-lens="${answer.lens}"]`).click();
  await page.locator(`[data-evidence="${answer.evidence}"]`).click();
  await expect(page.locator("#checkBtn")).toBeEnabled();
  await page.locator("#checkBtn").click();
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
});

test("c13 grammar4 dorok lab renders balanced scenario data and assets", async ({ page }) => {
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toContainText("V-도록 의미 실험");
  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("[data-choice]")).toHaveCount(3);
  await expect(page.locator("[data-lens]")).toHaveCount(3);
  await expect(page.locator("[data-evidence]")).toHaveCount(3);

  const image = page.getByTestId("dorok-lab-hero-image");
  await expect(image).toHaveAttribute("src", /grammar4-dorok\/dorok-overview-640\.webp$/);
  await expect.poll(async () => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);

  const structure = await page.evaluate(() => {
    const data = window.C13_GRAMMAR4_DOROK_LAB;
    const counts = data.rounds.reduce((acc, round) => {
      acc[round.type] = (acc[round.type] || 0) + 1;
      return acc;
    }, {});
    return {
      total: data.rounds.length,
      counts,
      choices: data.rounds.map((round) => round.choices.length),
      allRequiredFields: data.rounds.every((round) => (
        round.id &&
        round.type &&
        round.context &&
        round.sentence &&
        round.correctChoiceId &&
        round.lens &&
        round.evidence &&
        round.paraphrase &&
        round.feedback
      )),
      allAnswersExist: data.rounds.every((round) => (
        round.choices.some((choice) => choice.id === round.correctChoiceId) &&
        data.lenses.some((lens) => lens.id === round.lens) &&
        data.evidences.some((evidence) => evidence.id === round.evidence)
      )),
      hasAppHandle: Boolean(window.C13_GRAMMAR4_DOROK_LAB_APP)
    };
  });

  expect(structure.total).toBe(9);
  expect(structure.counts).toEqual({ purpose: 3, degree: 3, instruction: 3 });
  expect(structure.choices).toEqual(Array(9).fill(3));
  expect(structure.allRequiredFields).toBe(true);
  expect(structure.allAnswersExist).toBe(true);
  expect(structure.hasAppHandle).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test("c13 grammar4 dorok lab handles wrong feedback, retry, full completion, and restart", async ({ page }) => {
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await answerCurrentRound(page, { correct: false });
  await expect(page.locator("#feedbackBox")).toContainText("다시 구별해 보세요");
  await expect(page.locator(".choice-card.is-wrong")).toHaveCount(1);
  await expect(page.locator(".lens-button.is-wrong")).toHaveCount(1);
  await expect(page.locator(".evidence-button.is-wrong")).toHaveCount(1);

  await page.locator("#retryBtn").click();
  await expect(page.locator("#feedbackBox")).toBeHidden();
  await expect(page.locator("[data-choice][aria-pressed='true']")).toHaveCount(0);

  const roundCount = await page.evaluate(() => window.C13_GRAMMAR4_DOROK_LAB.rounds.length);
  for (let index = 0; index < roundCount; index += 1) {
    await answerCurrentRound(page);
    await expect(page.locator("#feedbackBox")).toContainText("맞아요");
    await page.locator("#nextScenarioBtn").click();
  }

  await expect(page.locator("#resultPanel")).toContainText(`9 / ${roundCount}`);
  await expect(page.locator(".stat-card")).toHaveCount(3);
  await expect(page.locator(".result-list li")).toHaveCount(roundCount);

  await page.locator("#restartBtn").click();
  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("#scenarioCard")).toContainText("1 / 9");
  await expect(page.locator("[data-choice]")).toHaveCount(3);
});

test("c13 grammar4 dorok lab keeps first mobile task near the top", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("[data-choice]")).toHaveCount(3);
  await expect(page.locator("#checkBtn")).toBeVisible();

  const layout = await page.evaluate(() => {
    const card = document.querySelector("#scenarioCard").getBoundingClientRect();
    const check = document.querySelector("#checkBtn").getBoundingClientRect();
    return {
      cardTop: Math.round(card.top),
      checkFits: check.left >= 0 && check.right <= window.innerWidth,
      checkInDocument: check.top > 0
    };
  });

  expect(layout.cardTop).toBeLessThanOrEqual(220);
  expect(layout.checkFits).toBe(true);
  expect(layout.checkInDocument).toBe(true);
  await expectNoHorizontalOverflow(page);
});
