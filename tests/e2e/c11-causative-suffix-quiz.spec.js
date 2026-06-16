const { test, expect } = require("@playwright/test");

const STORAGE_KEY = "c11.grammar1.causativeSuffixQuiz.v1";
const LOG_STORAGE_KEY = "c11.grammar1.causativeSuffixQuiz.logs.v1";
const ALL_IDS = Array.from({ length: 29 }, (_, index) => `pair${String(index + 1).padStart(2, "0")}`);

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
}

async function clearSavedPool(page) {
  await page.addInitScript((keys) => {
    if (!window.sessionStorage.getItem("__c11_suffix_quiz_cleared__")) {
      keys.forEach((key) => window.localStorage.removeItem(key));
      window.sessionStorage.setItem("__c11_suffix_quiz_cleared__", "1");
    }
  }, [STORAGE_KEY, LOG_STORAGE_KEY]);
}

async function correctSuffix(page) {
  return page.locator("#dropZone").getAttribute("data-correct-suffix");
}

async function clickCurrentCorrectSuffix(page) {
  const suffix = await correctSuffix(page);
  await page.locator(`.suffix-card[data-suffix="${suffix}"]`).click();
  return suffix;
}

async function answerCorrectAndContinue(page) {
  await clickCurrentCorrectSuffix(page);
  await expect(page.locator("#resultLine .suffix-highlight")).toBeVisible();
  await page.locator("#nextBtn").click();
}

function seededState(firstSix) {
  const rest = ALL_IDS.filter((id) => !firstSix.includes(id));
  const deck = firstSix.concat(rest);
  return {
    version: 1,
    deck,
    deckCursor: firstSix.length,
    roundIds: firstSix,
    roundQueue: firstSix,
    roundIndex: 1,
    completed: [],
    attempts: 0,
    correct: 0,
    wrong: 0,
    completedCycle: false,
    startedAt: Date.now()
  };
}

test("c11 suffix quiz lays out side cards and transforms by click", async ({ page }) => {
  await blockExternalRequests(page);
  await clearSavedPool(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toContainText("사동 접미사 변환 퀴즈");
  await expect(page.locator(".suffix-card")).toHaveCount(7);
  await expect(page.locator(".suffix-column--left .suffix-card")).toHaveCount(3);
  await expect(page.locator(".suffix-column--right .suffix-card")).toHaveCount(4);
  await expect(page.locator("#feedback")).toBeHidden();
  await expect(page.locator(".auto-toggle")).toContainText("자동");
  await expect(page.locator(".auto-toggle")).toContainText("Auto");
  await expect(page.locator("#autoToggle")).toBeChecked();
  await expect(page.locator("#openLogBtn")).toContainText("기록");
  await expect(page.locator("#openLogBtn")).toContainText("Log");

  const leftBox = await page.locator(".suffix-column--left").boundingBox();
  const stageBox = await page.locator(".stage").boundingBox();
  const rightBox = await page.locator(".suffix-column--right").boundingBox();
  const logBox = await page.locator("#openLogBtn").boundingBox();
  const autoBox = await page.locator(".auto-toggle").boundingBox();
  expect(leftBox.x).toBeLessThan(stageBox.x);
  expect(rightBox.x).toBeGreaterThan(stageBox.x);
  expect(logBox.x).toBeLessThan(autoBox.x);

  const suffix = await correctSuffix(page);
  const imageBefore = await page.locator("#baseImage").getAttribute("src");
  const altBefore = await page.locator("#baseImage").getAttribute("alt");
  const hintCard = page.locator(`.suffix-card.hint-wiggle[data-suffix="${suffix}"]`);
  await expect(hintCard).toHaveCount(1);
  await expect(hintCard).toHaveAttribute("data-hint-motion", /^(wiggle|hop|tilt|pulse|peek|tap)$/);

  await page.locator(`.suffix-card[data-suffix="${suffix}"]`).click();
  await expect(page.locator("#resultLine")).toContainText("→");
  await expect(page.locator("#resultLine .suffix-highlight")).toBeVisible();
  await expect(page.locator(".visual-box")).toHaveClass(/is-causative/);
  await expect.poll(async () => page.locator("#baseImage").getAttribute("src")).not.toBe(imageBefore);
  await expect.poll(async () => page.locator("#baseImage").getAttribute("alt")).not.toBe(altBefore);
  await expect(page.locator("#feedback")).toHaveClass(/good/);
  await expect(page.locator(".suffix-card.hint-wiggle")).toHaveCount(0);
});

test("c11 suffix quiz supports drag and restores saved progress", async ({ page }) => {
  await blockExternalRequests(page);
  await clearSavedPool(page);
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  const suffix = await correctSuffix(page);
  const firstId = await page.locator("#dropZone").getAttribute("data-current-id");
  await page.locator(`.suffix-card[data-suffix="${suffix}"]`).dragTo(page.locator("#dropZone"));
  await expect(page.locator("#feedback")).toHaveClass(/good/);
  await page.locator("#nextBtn").click();

  const secondId = await page.locator("#dropZone").getAttribute("data-current-id");
  expect(secondId).not.toBe(firstId);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", secondId);
  await expect(page.locator("#totalProgressText")).toHaveText("전체 1 / 29");
});

test("c11 suffix quiz accepts drops on the picture and question mark", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(({ key, state }) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, {
    key: STORAGE_KEY,
    state: seededState(["pair22", "pair23", "pair24", "pair25", "pair26", "pair27"])
  });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
  await page.locator('.suffix-card[data-suffix="-이"]').dragTo(page.locator(".visual-box"));
  await expect(page.locator("#feedback")).toHaveClass(/good/);
  await expect(page.locator(".visual-box")).toHaveClass(/is-causative/);
  await page.locator("#nextBtn").click();

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair23");
  await page.locator('.suffix-card[data-suffix="-이"]').dragTo(page.locator("#unknownMark"));
  await expect(page.locator("#feedback")).toHaveClass(/good/);
  await expect(page.locator("#resultLine .suffix-highlight")).toBeVisible();
});

test("c11 suffix quiz auto-advances after a correct answer unless the button is clicked", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(({ key, state }) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, {
    key: STORAGE_KEY,
    state: seededState(["pair22", "pair23", "pair24", "pair25", "pair26", "pair27"])
  });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
  await page.locator('.suffix-card[data-suffix="-이"]').click();
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제 (3)");
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제 (2)", { timeout: 1600 });
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제 (1)", { timeout: 1600 });
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair23", { timeout: 4500 });
  await expect(page.locator("#totalProgressText")).toHaveText("전체 1 / 29");

  await page.locator('.suffix-card[data-suffix="-이"]').click();
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제 (3)");
  await page.locator("#nextBtn").click();
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair24");
});

test("c11 suffix quiz can disable and re-enable auto advance", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(({ key, state }) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, {
    key: STORAGE_KEY,
    state: { ...seededState(["pair22", "pair23", "pair24", "pair25", "pair26", "pair27"]), autoAdvance: false }
  });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#autoToggle")).not.toBeChecked();
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
  await page.locator('.suffix-card[data-suffix="-이"]').click();
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제");
  await page.waitForTimeout(3300);
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");

  await page.locator("#nextBtn").click();
  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair23");
  await page.locator("#autoToggle").check();
  await expect(page.locator("#autoToggle")).toBeChecked();
  await expect.poll(async () => page.evaluate((key) => {
    return JSON.parse(window.localStorage.getItem(key)).autoAdvance;
  }, STORAGE_KEY)).toBe(true);
});

test("c11 suffix quiz requeues a wrong answer within the same round", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(({ key, state }) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, {
    key: STORAGE_KEY,
    state: seededState(["pair22", "pair23", "pair24", "pair25", "pair26", "pair27"])
  });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
  await page.locator('.suffix-card[data-suffix="-히"]').click();
  await expect(page.locator("#feedback")).toHaveClass(/bad/);
  await expect(page.locator("#feedback")).toContainText("뒤쪽에서 다시 나옵니다");
  await page.locator("#nextBtn").click();

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair23");
  for (let i = 0; i < 5; i += 1) {
    await answerCorrectAndContinue(page);
  }

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
});

test("c11 suffix quiz saves result logs and shows an accuracy trend graph", async ({ page }) => {
  await blockExternalRequests(page);
  const now = Date.now();
  const previousLog = {
    id: "run-previous",
    completedAt: now - 86400000,
    startedAt: now - 87000000,
    total: 29,
    attempts: 33,
    correct: 29,
    wrong: 4,
    answerLog: [
      {
        pairId: "pair23",
        base: "끓다",
        causative: "끓이다",
        selectedSuffix: "-히",
        correctSuffix: "-이",
        correct: false,
        attempt: 1,
        at: now - 86900000
      }
    ]
  };
  const almostComplete = {
    ...seededState(["pair22"]),
    deck: ALL_IDS.slice(),
    deckCursor: 1,
    roundIds: ["pair22"],
    roundQueue: ["pair22"],
    completed: ALL_IDS.filter((id) => id !== "pair22"),
    attempts: 29,
    correct: 28,
    wrong: 1,
    autoAdvance: false,
    answerLog: [
      {
        pairId: "pair23",
        base: "끓다",
        causative: "끓이다",
        selectedSuffix: "-히",
        correctSuffix: "-이",
        correct: false,
        attempt: 1,
        at: now - 60000
      },
      {
        pairId: "pair23",
        base: "끓다",
        causative: "끓이다",
        selectedSuffix: "-이",
        correctSuffix: "-이",
        correct: true,
        attempt: 2,
        at: now - 50000
      }
    ],
    startedAt: now - 120000
  };

  await page.addInitScript(({ stateKey, logKey, state, logs }) => {
    window.localStorage.setItem(stateKey, JSON.stringify(state));
    window.localStorage.setItem(logKey, JSON.stringify(logs));
  }, {
    stateKey: STORAGE_KEY,
    logKey: LOG_STORAGE_KEY,
    state: almostComplete,
    logs: [previousLog]
  });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#dropZone")).toHaveAttribute("data-current-id", "pair22");
  await page.locator('.suffix-card[data-suffix="-이"]').click();
  await expect(page.locator("#feedback")).toHaveClass(/good/);
  await page.locator("#nextBtn").click();
  await expect(page.locator("#completeScreen")).toHaveClass(/is-visible/);

  const savedLogs = await page.evaluate((key) => JSON.parse(window.localStorage.getItem(key)), LOG_STORAGE_KEY);
  expect(savedLogs).toHaveLength(2);
  expect(savedLogs[1].correct).toBe(29);
  expect(savedLogs[1].wrong).toBe(1);
  expect(savedLogs[1].answerLog.some((entry) => entry.pairId === "pair22" && entry.correct)).toBe(true);

  await page.locator("#openLogBtn").click();
  await expect(page.locator("#logModal")).toBeVisible();
  await expect(page.locator("#logSummaryGrid")).toContainText("점수");
  await expect(page.locator("#logSummaryGrid")).toContainText("29 / 29");
  await expect(page.locator("#answerLogList")).toContainText("정답");
  await expect(page.locator("#answerLogList")).toContainText("오답");
  await expect(page.locator("#answerLogList")).toContainText("먹다");
  await expect(page.locator("#historyList .history-row")).toHaveCount(2);
  await expect(page.locator("#historyChart svg")).toBeVisible();
  await expect(page.locator("#historyChart svg")).toHaveAttribute("aria-label", "정답률 추이 그래프");

  await page.keyboard.press("Escape");
  await expect(page.locator("#logModal")).toBeHidden();
});

test("c11 suffix quiz is mobile-safe, auto-resets completed cycles, and is linked", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, JSON.stringify({ completedCycle: true }));
  }, STORAGE_KEY);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c11/grammar1-causative-suffix-quiz.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#completeScreen")).not.toHaveClass(/is-visible/);
  await expect(page.locator("#totalProgressText")).toHaveText("전체 0 / 29");
  await expect(page.locator(".suffix-card")).toHaveCount(7);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBe(false);

  await page.goto("/c11/index.html", { waitUntil: "domcontentloaded" });
  const drawer = page.locator("details.support-drawer").filter({ hasText: "문법 1 보조 자료" });
  await drawer.locator("summary.support-drawer__summary").click();
  await expect(drawer.locator('a[href="grammar1-causative-suffix-quiz.html"]')).toBeVisible();

  await page.goto("/c11/grammar1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="grammar1-causative-suffix-quiz.html"]')).toContainText("사동 접미사 변환 퀴즈");
});
