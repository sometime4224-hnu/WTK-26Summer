const { test, expect } = require("@playwright/test");

const PAGE_URL = "/c15/vocab-support-home-issues-game.html";
const SAVE_KEY = "c15-house-rescue-save-v1";
const CONTROL_MODE_KEY = "c15-house-rescue-control-mode-v1";

// Keep this list deliberately limited to the eight expressions in the official
// C15 vocabulary set. In particular, older prototype-only TV/air-conditioner
// expressions must never leak into progress, the journal, or persisted state.
const ISSUE_SEQUENCE = [
  { id: "water-supply", expression: "수돗물이 안 나오다" },
  { id: "power-outage", expression: "전기가 나가다" },
  { id: "toilet-clog", expression: "변기가 막히다" },
  { id: "leak", expression: "물이 새다" },
  { id: "noise", expression: "소음이 심하다" },
  { id: "heating", expression: "난방이 안 되다" },
  { id: "smell", expression: "이상한 냄새가 나다" },
  { id: "drain", expression: "물이 안 내려가다" }
];
const OFFICIAL_VOCABULARY = ISSUE_SEQUENCE.map(({ expression }) => expression);

async function clearHouseRescueState(page, controlMode) {
  await page.addInitScript(({ saveKey, modeKey, mode }) => {
    const marker = "c15-house-rescue-e2e-state-cleared";
    if (sessionStorage.getItem(marker) === "yes") return;
    localStorage.removeItem(saveKey);
    localStorage.removeItem(modeKey);
    if (mode) localStorage.setItem(modeKey, mode);
    sessionStorage.setItem(marker, "yes");
  }, { saveKey: SAVE_KEY, modeKey: CONTROL_MODE_KEY, mode: controlMode });
}

async function waitForTestHelper(page) {
  // Production exposes this intentionally small test seam so E2E tests do not
  // depend on animation timing or private module variables. Methods may be
  // synchronous or return promises; callHouseHelper supports either form.
  await page.waitForFunction(() => {
    const helper = window.__houseRescueTest;
    return helper && ["startNew", "teleportTo", "interact", "answerCorrect", "snapshot"]
      .every((method) => typeof helper[method] === "function");
  });
}

async function callHouseHelper(page, method, ...args) {
  return page.evaluate(async ({ helperMethod, helperArgs }) => {
    const helper = window.__houseRescueTest;
    if (!helper || typeof helper[helperMethod] !== "function") {
      throw new Error(`Missing window.__houseRescueTest.${helperMethod}()`);
    }
    return await helper[helperMethod](...helperArgs);
  }, { helperMethod: method, helperArgs: args });
}

async function snapshot(page) {
  return callHouseHelper(page, "snapshot");
}

async function startNewAndSkipTutorial(page) {
  await callHouseHelper(page, "startNew");
  await expect(page.locator("#startCard")).toBeHidden();
  await expect(page.locator("#controlTutorial")).toBeVisible();
  await page.locator("#tutorialSkip").click();
  await expect(page.locator("#controlTutorial")).toBeHidden();
  await expect.poll(async () => (await snapshot(page)).started).toBe(true);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - window.innerWidth,
    body: document.body.scrollWidth - window.innerWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

async function expectInsideViewport(page, selector, minimumSize = 0) {
  const locator = page.locator(selector);
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  if (minimumSize) {
    expect(box.width).toBeGreaterThanOrEqual(minimumSize);
    expect(box.height).toBeGreaterThanOrEqual(minimumSize);
  }
}

async function expectMinimumHitTarget(page, selector, minimumSize = 44) {
  const locator = page.locator(selector);
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(minimumSize);
  expect(box.height).toBeGreaterThanOrEqual(minimumSize);

  const centerIsClickable = await locator.evaluate((target) => {
    const rect = target.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return hit === target || target.contains(hit);
  });
  expect(centerIsClickable).toBe(true);
}

async function expectCanvasHasScene(page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#houseCanvas");
    if (!(canvas instanceof HTMLCanvasElement) || !canvas.width || !canvas.height) return false;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return false;

    const colors = new Set();
    let visibleSamples = 0;
    let samples = 0;
    const xStep = Math.max(1, Math.floor(canvas.width / 20));
    const yStep = Math.max(1, Math.floor(canvas.height / 14));
    for (let y = Math.floor(yStep / 2); y < canvas.height; y += yStep) {
      for (let x = Math.floor(xStep / 2); x < canvas.width; x += xStep) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        colors.add(`${pixel[0] >> 4}-${pixel[1] >> 4}-${pixel[2] >> 4}`);
        visibleSamples += pixel[3] > 8 ? 1 : 0;
        samples += 1;
      }
    }
    return colors.size >= 10 && visibleSamples / samples >= 0.75;
  });
}

async function openIssueDiagnosis(page, issue) {
  await callHouseHelper(page, "teleportTo", issue.id);
  await expect(page.locator("#interactionPrompt")).toBeVisible();
  await callHouseHelper(page, "interact");
  await expect(page.locator("#diagnosisPanel")).toBeVisible();
  const options = page.locator("#diagnosisOptions button");
  await expect(options).toHaveCount(3);
  const optionText = (await options.allTextContents()).join("\n");
  expect(optionText).toContain(issue.expression);
  for (let index = 0; index < await options.count(); index += 1) {
    await expectMinimumHitTarget(page, `#diagnosisOptions button:nth-of-type(${index + 1})`);
  }
}

test("C15 hub keeps the original room-zoom activity and links separately to the upgraded game", async ({ page }) => {
  await page.goto("/c15/", { waitUntil: "domcontentloaded" });
  const originalLink = page.locator('a[href="vocab-support-home-issues-room-zoom.html"]');
  const upgradedLink = page.locator('a[href="vocab-support-home-issues-game.html"]');

  await expect(originalLink).toHaveCount(1);
  await expect(originalLink).toContainText("집 탐험 어휘 보조 활동");
  await expect(upgradedLink).toHaveCount(1);
  await expect(upgradedLink).toContainText("우리 집 SOS");

  await upgradedLink.click();
  await expect(page).toHaveURL(/\/c15\/vocab-support-home-issues-game\.html$/);
  await expect(page.locator("#houseGame")).toBeVisible();
});

test("original room-zoom activity remains available", async ({ page }) => {
  await page.goto("/c15/vocab-support-home-issues-room-zoom.html", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/c15\/vocab-support-home-issues-room-zoom\.html$/);
  await expect(page.locator("#gameCanvas")).toBeVisible();
});

test("upgraded page draws a real scene without runtime errors or local HTTP failures", async ({ page }) => {
  await clearHouseRescueState(page);
  const pageErrors = [];
  const localHttpErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (["127.0.0.1", "localhost"].includes(url.hostname) && response.status() >= 400) {
      localHttpErrors.push(`${response.status()} ${url.pathname}`);
    }
  });

  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await expect(page.locator("#houseCanvas")).toBeVisible();
  await expectCanvasHasScene(page);
  await expectNoHorizontalOverflow(page);
  expect(pageErrors).toEqual([]);
  expect(localHttpErrors).toEqual([]);
});

test("new rescue starts with the toolkit, then discovers exactly the official eight expressions", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);

  await expectMinimumHitTarget(page, "#startButton");
  await callHouseHelper(page, "startNew");
  await expect(page.locator("#controlTutorial")).toBeVisible();
  await expectMinimumHitTarget(page, "#tutorialSkip");
  await page.locator("#tutorialSkip").click();

  // Helper snapshot contract used below:
  // - toolkit: boolean
  // - discovered/repaired: official expression strings in discovery order
  // - player: serializable { x, y }
  // - controlMode and controls: stable input state for touch assertions
  // These fields intentionally expose state, not implementation functions.
  await callHouseHelper(page, "teleportTo", "toolkit");
  await expect(page.locator("#interactionPrompt")).toBeVisible();
  await page.keyboard.press("KeyE");
  await expect.poll(async () => (await snapshot(page)).toolkit).toBe(true);
  expect((await snapshot(page)).discovered).toEqual([]);

  for (let index = 0; index < ISSUE_SEQUENCE.length; index += 1) {
    const issue = ISSUE_SEQUENCE[index];
    await openIssueDiagnosis(page, issue);
    await callHouseHelper(page, "answerCorrect");
    await expect(page.locator("#diagnosisPanel")).toBeHidden();
    await expect.poll(async () => (await snapshot(page)).discovered)
      .toEqual(OFFICIAL_VOCABULARY.slice(0, index + 1));
  }

  const finalState = await snapshot(page);
  expect(finalState.discovered).toEqual(OFFICIAL_VOCABULARY);
  expect(new Set(finalState.discovered).size).toBe(8);

  await page.locator("#storyToggle").click();
  await expect(page.locator("#storyPanel")).toBeVisible();
  await page.locator("#statsToggle").click();
  await expect(page.locator("#statsPanel")).toBeVisible();
  await page.locator("#journalToggle").click();
  await expect(page.locator("#journalDrawer")).toBeVisible();
  const journalText = await page.locator("#journalDrawer").innerText();
  for (const expression of OFFICIAL_VOCABULARY) expect(journalText).toContain(expression);
  await expectMinimumHitTarget(page, "#journalClose");
  await page.locator("#journalClose").click();
  await expect(page.locator("#journalDrawer")).toBeHidden();
});

test("the deterministic full loop diagnoses and repairs all eight house issues", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  await callHouseHelper(page, "teleportTo", "toolkit");
  await callHouseHelper(page, "interact");
  await expect.poll(async () => (await snapshot(page)).toolkit).toBe(true);

  for (let index = 0; index < ISSUE_SEQUENCE.length; index += 1) {
    const issue = ISSUE_SEQUENCE[index];
    await openIssueDiagnosis(page, issue);

    // Exercise one real wrong choice before using the deterministic helper for
    // the correct answer. A wrong answer must teach without changing progress.
    if (index === 0) {
      const options = page.locator("#diagnosisOptions button");
      const wrongIndex = await options.evaluateAll((buttons, correctExpression) => (
        buttons.findIndex((button) => button.dataset.answer !== correctExpression)
      ), issue.expression);
      expect(wrongIndex).toBeGreaterThanOrEqual(0);
      await options.nth(wrongIndex).click();
      await expect(page.locator("#diagnosisPanel")).toBeVisible();
      await expect(page.locator("#diagnosisFeedback")).toContainText("핵심 단서를 다시 살펴보세요");
      await expect(page.locator("#diagnosisFeedback")).toHaveAttribute("data-tone", "bad");
      expect((await snapshot(page)).discovered).toEqual([]);
    }

    await callHouseHelper(page, "answerCorrect");
    await expect(page.locator("#diagnosisPanel")).toBeHidden();

    // The learner performs two visible repair actions after diagnosing each
    // issue; teleportTo has already put the player in deterministic reach.
    await callHouseHelper(page, "interact");
    await callHouseHelper(page, "interact");
    await expect.poll(async () => (await snapshot(page)).repaired)
      .toEqual(OFFICIAL_VOCABULARY.slice(0, index + 1));
  }

  const completed = await snapshot(page);
  expect(completed.discovered).toEqual(OFFICIAL_VOCABULARY);
  expect(completed.repaired).toEqual(OFFICIAL_VOCABULARY);
  expect(completed.completed).toBe(true);
  await expect(page.locator("#endingPanel")).toBeVisible();
  await expect(page.locator("#safetyValue")).toHaveText("100%");

  const persisted = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(persisted).toMatchObject({ started: true, completed: true, toolkit: true });
  expect(persisted.discoveryOrder).toEqual(ISSUE_SEQUENCE.map(({ id }) => id));
  expect(persisted.repairedOrder).toEqual(ISSUE_SEQUENCE.map(({ id }) => id));

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  const restored = await snapshot(page);
  expect(restored.completed).toBe(true);
  expect(restored.repaired).toEqual(OFFICIAL_VOCABULARY);
});

test("discovery progress and toolkit restore from the upgraded save key", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  await callHouseHelper(page, "teleportTo", "toolkit");
  await callHouseHelper(page, "interact");
  for (const issue of ISSUE_SEQUENCE.slice(0, 2)) {
    await openIssueDiagnosis(page, issue);
    await callHouseHelper(page, "answerCorrect");
  }

  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)).not.toBeNull();
  const beforeReload = await snapshot(page);
  expect(beforeReload.toolkit).toBe(true);
  expect(beforeReload.discovered).toEqual(OFFICIAL_VOCABULARY.slice(0, 2));

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  const restored = await snapshot(page);
  expect(restored.started).toBe(true);
  expect(restored.toolkit).toBe(true);
  expect(restored.discovered).toEqual(beforeReload.discovered);
  expect(restored.repaired).toEqual(beforeReload.repaired);
});

test.describe("390x844 joystick touch controls", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("controls stay tappable and pointercancel clears held input", async ({ page }) => {
    await clearHouseRescueState(page, "joystick");
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await waitForTestHelper(page);
    await startNewAndSkipTutorial(page);

    await expect(page.locator("html")).toHaveAttribute("data-control-mode", "joystick");
    await expectInsideViewport(page, "#touchControls");
    await expectInsideViewport(page, "#touchJoystick", 44);
    await expectInsideViewport(page, "#touchAction", 44);
    await expectMinimumHitTarget(page, "#touchAction");
    for (const selector of ["#storyToggle", "#statsToggle", "#journalToggle", "#resetButton"]) {
      await expectMinimumHitTarget(page, selector);
    }
    await expectNoHorizontalOverflow(page);

    const joystick = page.locator("#touchJoystick");
    const box = await joystick.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    await joystick.dispatchEvent("pointerdown", {
      pointerId: 31, pointerType: "touch", isPrimary: true, buttons: 1,
      clientX: centerX, clientY: centerY
    });
    await joystick.dispatchEvent("pointermove", {
      pointerId: 31, pointerType: "touch", isPrimary: true, buttons: 1,
      clientX: box.x + box.width * 0.82, clientY: centerY
    });
    await expect(joystick).toHaveClass(/is-active/);
    await expect.poll(async () => (await snapshot(page)).controls.joystickActive).toBe(true);
    expect((await snapshot(page)).controls.joystickX).toBeGreaterThan(0.2);

    await joystick.dispatchEvent("pointercancel", {
      pointerId: 31, pointerType: "touch", isPrimary: true,
      clientX: box.x + box.width * 0.82, clientY: centerY
    });
    await expect(joystick).not.toHaveClass(/is-active/);
    await expect.poll(async () => (await snapshot(page)).controls).toMatchObject({
      joystickActive: false,
      joystickX: 0,
      joystickY: 0
    });

    const action = page.locator("#touchAction");
    await action.dispatchEvent("pointerdown", { pointerId: 32, pointerType: "touch", isPrimary: true });
    await expect.poll(async () => (await snapshot(page)).controls.actionPressed).toBe(true);
    await action.dispatchEvent("pointercancel", { pointerId: 32, pointerType: "touch", isPrimary: true });
    await expect.poll(async () => (await snapshot(page)).controls.actionPressed).toBe(false);
  });
});

test.describe("390x844 canvas-tap mode", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("a canvas pointer moves the player and the selected mode persists", async ({ page }) => {
    await clearHouseRescueState(page, "tap");
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await waitForTestHelper(page);
    await startNewAndSkipTutorial(page);

    await expect(page.locator("html")).toHaveAttribute("data-control-mode", "tap");
    await expect(page.locator("#touchJoystick")).toBeHidden();
    await expect(page.locator("#touchAction")).toBeHidden();
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), CONTROL_MODE_KEY)).toBe("tap");

    const before = (await snapshot(page)).player;
    const canvasBox = await page.locator("#houseCanvas").boundingBox();
    await page.touchscreen.tap(
      canvasBox.x + canvasBox.width * 0.78,
      canvasBox.y + canvasBox.height * 0.72
    );
    await expect.poll(async () => {
      const player = (await snapshot(page)).player;
      return Math.hypot(player.x - before.x, player.y - before.y);
    }, { timeout: 8_000 }).toBeGreaterThan(6);

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForTestHelper(page);
    await expect(page.locator("html")).toHaveAttribute("data-control-mode", "tap");
  });
});

for (const profile of [
  { name: "768x1024 touch tablet", viewport: { width: 768, height: 1024 } },
  { name: "844x390 touch landscape", viewport: { width: 844, height: 390 } }
]) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, isMobile: true, hasTouch: true });

    test("keeps the canvas controls visible without horizontal overflow", async ({ page }) => {
      await clearHouseRescueState(page, "joystick");
      await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
      await waitForTestHelper(page);
      await startNewAndSkipTutorial(page);

      await expect(page.locator("#houseGame")).toBeVisible();
      await expect(page.locator("#houseCanvas")).toBeVisible();
      await expectInsideViewport(page, "#touchControls");
      await expectInsideViewport(page, "#touchJoystick", 44);
      await expectInsideViewport(page, "#touchAction", 44);
      await expectNoHorizontalOverflow(page);
    });
  });
}
