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

async function pickMeaning(page, { correct = true } = {}) {
  const meaning = await page.evaluate((wantCorrect) => {
    const round = window.C13_GRAMMAR4_DOROK_LAB_APP.getCurrentRound();
    if (wantCorrect) return round.type;
    return window.C13_GRAMMAR4_DOROK_LAB.meanings.find((item) => item.id !== round.type).id;
  }, correct);
  await page.locator(`[data-meaning="${meaning}"]`).click();
}

async function pickEvidence(page, { correct = true } = {}) {
  const evidence = await page.evaluate((wantCorrect) => {
    const round = window.C13_GRAMMAR4_DOROK_LAB_APP.getCurrentRound();
    if (wantCorrect) return round.evidence;
    return window.C13_GRAMMAR4_DOROK_LAB.evidences.find((item) => item.id !== round.evidence).id;
  }, correct);
  await page.locator(`[data-evidence="${evidence}"]`).click();
}

async function answerCurrentRound(page, { correct = true } = {}) {
  const isGuide = await page.evaluate(() => window.C13_GRAMMAR4_DOROK_LAB_APP.state.roundIndex < 3);
  await pickMeaning(page, { correct });
  await expect(page.locator("#checkBtn")).toBeEnabled();
  await page.locator("#checkBtn").click();

  if (isGuide) {
    await expect(page.locator(".guide-panel")).toBeVisible();
    await pickEvidence(page, { correct });
    await expect(page.locator("#checkBtn")).toBeEnabled();
    await page.locator("#checkBtn").click();
  }
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
});

test("c13 grammar4 dorok lab is linked from grammar4 but not the chapter hub", async ({ page }) => {
  await page.goto("/c13/grammar4.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.resource-link[href="grammar4-dorok-lab.html"]')).toBeVisible();

  await page.goto("/c13/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="grammar4-dorok-lab.html"]')).toHaveCount(0);
});

test("c13 grammar4 dorok lab starts with one clear meaning-choice task", async ({ page }) => {
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toContainText("V-");
  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("[data-meaning]")).toHaveCount(3);
  await expect(page.locator("[data-choice]")).toHaveCount(0);
  await expect(page.locator("[data-evidence]")).toHaveCount(0);
  await expect(page.locator(".meaning-map")).toHaveCount(0);
  await expect(page.locator("#checkBtn")).toBeDisabled();

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
        round.lens &&
        round.evidence &&
        round.paraphrase &&
        round.feedback
      )),
      allAnswersExist: data.rounds.every((round) => (
        data.meanings.some((meaning) => meaning.id === round.type) &&
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

test("c13 grammar4 dorok lab guide rounds ask for evidence after meaning", async ({ page }) => {
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await pickMeaning(page);
  await expect(page.locator("#checkBtn")).toContainText(/근거|Evidence|확인/);
  await page.locator("#checkBtn").click();

  await expect(page.locator(".guide-panel")).toBeVisible();
  await expect(page.locator("[data-evidence]")).toHaveCount(3);
  await expect(page.locator("#feedbackBox")).toBeHidden();
  await expect(page.locator("#checkBtn")).toBeDisabled();

  await pickEvidence(page);
  await expect(page.locator("#checkBtn")).toBeEnabled();
  await page.locator("#checkBtn").click();

  await expect(page.locator("#feedbackBox")).toBeVisible();
  await expect(page.locator("#feedbackBox")).toContainText(/바꿔|말하기/);
  await expect(page.locator(".meaning-map")).toBeVisible();
  await expect(page.locator("#nextScenarioBtn")).toBeEnabled();
});

test("c13 grammar4 dorok lab test rounds grade meaning only and show concise result", async ({ page }) => {
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  for (let index = 0; index < 3; index += 1) {
    await answerCurrentRound(page);
    await page.locator("#nextScenarioBtn").click();
  }

  await expect(page.locator(".mode-pill")).toContainText(/시험|Test/);
  await expect(page.locator("[data-meaning]")).toHaveCount(3);
  await expect(page.locator("[data-evidence]")).toHaveCount(0);
  await pickMeaning(page);
  await page.locator("#checkBtn").click();
  await expect(page.locator("#feedbackBox")).toBeVisible();
  await expect(page.locator(".meaning-map")).toBeVisible();

  await page.locator("#nextScenarioBtn").click();
  const roundCount = await page.evaluate(() => window.C13_GRAMMAR4_DOROK_LAB.rounds.length);
  for (let index = 4; index < roundCount; index += 1) {
    await answerCurrentRound(page);
    await page.locator("#nextScenarioBtn").click();
  }

  await expect(page.locator("#resultPanel")).toContainText(`9 / ${roundCount}`);
  await expect(page.locator(".stat-card")).toHaveCount(3);
  await expect(page.locator(".result-details")).toBeVisible();
  await page.locator(".result-details summary").click();
  await expect(page.locator(".result-list li")).toHaveCount(roundCount);

  await page.locator("#restartBtn").click();
  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("#scenarioCard")).toContainText("1 / 9");
  await expect(page.locator("[data-meaning]")).toHaveCount(3);
});

test("c13 grammar4 dorok lab keeps first mobile task and check button in the first viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c13/grammar4-dorok-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#scenarioCard")).toBeVisible();
  await expect(page.locator("[data-meaning]")).toHaveCount(3);
  await expect(page.locator("#checkBtn")).toBeVisible();

  const layout = await page.evaluate(() => {
    const card = document.querySelector("#scenarioCard").getBoundingClientRect();
    const check = document.querySelector("#checkBtn").getBoundingClientRect();
    return {
      cardTop: Math.round(card.top),
      checkBottom: Math.round(check.bottom),
      checkFits: check.left >= 0 && check.right <= window.innerWidth
    };
  });

  expect(layout.cardTop).toBeLessThanOrEqual(140);
  expect(layout.checkBottom).toBeLessThanOrEqual(844);
  expect(layout.checkFits).toBe(true);
  await expectNoHorizontalOverflow(page);
});
