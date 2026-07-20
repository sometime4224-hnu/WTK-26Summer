const { test, expect } = require("@playwright/test");

const PAGE_URL = "/c15/vocab-support-home-issues-game.html";
const SAVE_KEY = "c15-house-rescue-save-v1";
const CONTROL_MODE_KEY = "c15-house-rescue-control-mode-v1";

// Keep this list deliberately limited to the eight expressions in the official
// C15 vocabulary set. In particular, older prototype-only TV/air-conditioner
// expressions must never leak into progress, the journal, or persisted state.
const ISSUE_SEQUENCE = [
  { id: "power-outage", expression: "전기가 나가다", cue: "blackout-flicker" },
  { id: "water-supply", expression: "수돗물이 안 나오다", cue: "dry-faucet" },
  { id: "drain", expression: "물이 안 내려가다", cue: "standing-water" },
  { id: "smell", expression: "이상한 냄새가 나다", cue: "rising-odor" },
  { id: "toilet-clog", expression: "변기가 막히다", cue: "rising-bowl-water" },
  { id: "leak", expression: "물이 새다", cue: "falling-drops-puddle" },
  { id: "heating", expression: "난방이 안 되다", cue: "cold-room-snow" },
  { id: "noise", expression: "소음이 심하다", cue: "wall-impact-waves" }
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

async function issueState(page, issueId) {
  const gameState = await snapshot(page);
  const issue = gameState.issues?.[issueId];
  if (!issue) throw new Error(`Missing snapshot issue state for ${issueId}`);
  return issue;
}

async function startNewAndSkipTutorial(page) {
  await callHouseHelper(page, "startNew");
  await expect(page.locator("#startCard")).toBeHidden();
  await expect(page.locator("#controlTutorial")).toBeVisible();
  await page.locator("#tutorialSkip").click();
  await expect(page.locator("#controlTutorial")).toBeHidden();
  await closeDialogue(page);
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

async function canvasVisualMetrics(page) {
  // Read only bitmap pixels. DOM mission copy, toast text, and aria-live text
  // cannot influence this result, so a passing comparison requires a real
  // scene-level visual change rather than an explanatory sentence.
  await page.waitForTimeout(900);
  return page.locator("#houseCanvas").evaluate((canvas) => {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas 2D context is unavailable");

    const columns = 10;
    const rows = 7;
    const tileWidth = canvas.width / columns;
    const tileHeight = canvas.height / rows;
    const tiles = [];
    let luminanceTotal = 0;
    let darkSamples = 0;
    let sampleCount = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const left = Math.floor(column * tileWidth + tileWidth * 0.15);
        const right = Math.floor((column + 1) * tileWidth - tileWidth * 0.15);
        const top = Math.floor(row * tileHeight + tileHeight * 0.15);
        const bottom = Math.floor((row + 1) * tileHeight - tileHeight * 0.15);
        let tileTotal = 0;
        let tileSamples = 0;

        for (let y = top; y < bottom; y += 7) {
          for (let x = left; x < right; x += 7) {
            const pixel = context.getImageData(x, y, 1, 1).data;
            const luminance = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
            tileTotal += luminance;
            luminanceTotal += luminance;
            darkSamples += luminance < 72 ? 1 : 0;
            tileSamples += 1;
            sampleCount += 1;
          }
        }
        tiles.push(tileTotal / tileSamples);
      }
    }

    return {
      meanLuminance: luminanceTotal / sampleCount,
      darkRatio: darkSamples / sampleCount,
      tiles
    };
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

async function closeDialogue(page) {
  await expect(page.locator("#dialogueBox")).toBeVisible();
  await page.locator("#dialogueClose").click();
  await expect(page.locator("#dialogueBox")).toBeHidden();
}

async function repairDiagnosedIssue(page, issue, { assertDialogueBlocks = false } = {}) {
  await callHouseHelper(page, "teleportTo", issue.id);
  let previousStep = (await issueState(page, issue.id)).repairStep;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    await callHouseHelper(page, "interact");
    const afterAction = await issueState(page, issue.id);
    expect(afterAction.repairStep).toBeGreaterThan(previousStep);

    if (afterAction.phase === "resolved" && await page.locator("#endingPanel").isVisible()) {
      return afterAction;
    }

    await expect(page.locator("#dialogueBox")).toBeVisible();

    if (assertDialogueBlocks && afterAction.phase !== "resolved") {
      await callHouseHelper(page, "interact");
      await expect.poll(async () => (await issueState(page, issue.id)).repairStep)
        .toBe(afterAction.repairStep);
    }

    if (afterAction.phase === "resolved") return afterAction;

    await closeDialogue(page);
    previousStep = afterAction.repairStep;
  }

  throw new Error(`${issue.id} did not resolve within four repair actions`);
}

test("C15 hub shows only the upgraded house-problem game", async ({ page }) => {
  await page.goto("/c15/", { waitUntil: "domcontentloaded" });
  const originalLink = page.locator('a[href="vocab-support-home-issues-room-zoom.html"]');
  const upgradedLink = page.locator('a[href="vocab-support-home-issues-game.html"]');

  await expect(originalLink).toHaveCount(0);
  await expect(upgradedLink).toHaveCount(1);
  await expect(upgradedLink).toContainText("우리 집 SOS");

  await upgradedLink.click();
  await expect(page).toHaveURL(/\/c15\/vocab-support-home-issues-game\.html$/);
  await expect(page.locator("#houseGame")).toBeVisible();
});

test("the opening uses a character briefing instead of a fullscreen prompt", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);

  await expect(page.locator("#fullscreenButton")).toHaveCount(0);
  await expect(page.locator("#startButton")).toHaveText("탐험 시작");
  await callHouseHelper(page, "startNew");
  await page.locator("#tutorialSkip").click();

  await expect(page.locator("#dialogueBox")).toBeVisible();
  await expect(page.locator("#dialogueBox")).toHaveAttribute("data-tone", "opening");
  await expect(page.locator("#dialogueSpeaker")).toHaveText("집 지킴이");
  await expect(page.locator("#dialogueText")).toContainText("저와 함께 우리 집을 고쳐주세요!");
  const dialogueLayout = await page.locator("#dialogueBox").evaluate((dialogue) => {
    const textStyle = getComputedStyle(dialogue.querySelector("#dialogueText"));
    const dialogueRect = dialogue.getBoundingClientRect();
    const frameRect = dialogue.closest(".canvas-frame").getBoundingClientRect();
    return {
      centerOffsetX: dialogueRect.left + dialogueRect.width / 2 - (frameRect.left + frameRect.width / 2),
      centerOffsetY: dialogueRect.top + dialogueRect.height / 2 - (frameRect.top + frameRect.height / 2),
      textSize: Number.parseFloat(textStyle.fontSize),
    };
  });
  expect(Math.abs(dialogueLayout.centerOffsetX)).toBeLessThanOrEqual(1);
  expect(Math.abs(dialogueLayout.centerOffsetY)).toBeLessThanOrEqual(1);
  expect(dialogueLayout.textSize).toBeGreaterThanOrEqual(20);
  expect((await snapshot(page)).blackout).toBe(true);

  await closeDialogue(page);
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

test("the first incident must be observed and diagnosed before the breaker can restore power", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);

  await expectMinimumHitTarget(page, "#startButton");
  await startNewAndSkipTutorial(page);

  // The incident exists before the learner touches the repair target. The
  // visible symptom is the light switch; the breaker becomes the target only
  // after the learner identifies "전기가 나가다".
  const incident = await snapshot(page);
  expect(incident.activeIssueId).toBe("power-outage");
  expect(incident.issues["power-outage"]).toMatchObject({ phase: "incident", repairStep: 0 });
  expect(incident.blackout).toBe(true);
  expect(incident.targetLabel).toContain("전등 스위치");
  expect(incident.toolkit).toBe(true);
  expect(incident.discovered).toEqual([]);
  expect(incident.repaired).toEqual([]);

  const outage = ISSUE_SEQUENCE[0];
  await openIssueDiagnosis(page, outage);
  await callHouseHelper(page, "answerCorrect");
  await expect(page.locator("#diagnosisPanel")).toBeHidden();

  const diagnosed = await snapshot(page);
  expect(diagnosed.issues[outage.id]).toMatchObject({ phase: "diagnosed", repairStep: 0 });
  expect(diagnosed.blackout).toBe(true);
  expect(diagnosed.targetLabel).toContain("두꺼비집");
  expect(diagnosed.discovered).toEqual([outage.expression]);

  const resolved = await repairDiagnosedIssue(page, outage, { assertDialogueBlocks: true });
  expect(resolved.phase).toBe("resolved");
  expect((await snapshot(page)).blackout).toBe(false);
});

test("the blackout is recognizable from a broad canvas effect without reading mission text", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  const outage = ISSUE_SEQUENCE[0];
  expect((await snapshot(page)).blackout).toBe(true);
  const blackoutVisual = await canvasVisualMetrics(page);

  await openIssueDiagnosis(page, outage);
  await callHouseHelper(page, "answerCorrect");
  await repairDiagnosedIssue(page, outage);
  expect((await snapshot(page)).blackout).toBe(false);
  const restoredVisual = await canvasVisualMetrics(page);

  const broadlyBrightenedTiles = restoredVisual.tiles.filter((value, index) => (
    value - blackoutVisual.tiles[index] > 18
  )).length;

  // Text occupies only a few tiles. Requiring most of the bitmap to brighten
  // proves the incident is conveyed by scene lighting and powered fixtures,
  // not merely by the warning sentence painted over the room.
  expect(restoredVisual.meanLuminance - blackoutVisual.meanLuminance).toBeGreaterThan(25);
  expect(blackoutVisual.darkRatio - restoredVisual.darkRatio).toBeGreaterThan(0.12);
  expect(broadlyBrightenedTiles / restoredVisual.tiles.length).toBeGreaterThan(0.65);
});

test("the deterministic full loop diagnoses and repairs all eight house issues", async ({ page }) => {
  test.setTimeout(65_000);
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  for (let index = 0; index < ISSUE_SEQUENCE.length; index += 1) {
    const issue = ISSUE_SEQUENCE[index];
    const beforeDiagnosis = await snapshot(page);
    expect(beforeDiagnosis.activeIssueId).toBe(issue.id);
    expect(beforeDiagnosis.issues[issue.id].phase).toBe("incident");
    expect(beforeDiagnosis.visualCue).toMatchObject({
      issueId: issue.id,
      kind: issue.cue,
      phase: "incident",
      strength: 1
    });
    await expect(page.locator("#missionInstruction"))
      .toHaveText("반복해서 움직이는 장면을 찾아 터치하세요.");

    await openIssueDiagnosis(page, issue);
    await expect(page.locator("#diagnosisVisual")).toHaveAttribute("data-issue", issue.id);
    await expect(page.locator("#diagnosisQuestion"))
      .toHaveText("이 장면과 어울리는 표현은 무엇일까요?");

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
    expect((await issueState(page, issue.id)).phase).toBe("diagnosed");

    // Every repair action opens a visible explanation. The learner must close
    // it before the next action; production must not accept hidden rapid-fire
    // interactions behind the dialogue.
    const resolved = await repairDiagnosedIssue(page, issue);
    expect(resolved.phase).toBe("resolved");
    await expect.poll(async () => (await snapshot(page)).repaired)
      .toEqual(OFFICIAL_VOCABULARY.slice(0, index + 1));

    if (index < ISSUE_SEQUENCE.length - 1) {
      await closeDialogue(page);
      const next = await snapshot(page);
      expect(next.activeIssueId).toBe(ISSUE_SEQUENCE[index + 1].id);
      expect(next.issues[ISSUE_SEQUENCE[index + 1].id].phase).toBe("incident");
    }
  }

  const completed = await snapshot(page);
  expect(completed.discovered).toEqual(OFFICIAL_VOCABULARY);
  expect(completed.repaired).toEqual(OFFICIAL_VOCABULARY);
  expect(completed.completed).toBe(true);
  await expect(page.locator("#endingPanel")).toBeVisible();
  await expect(page.locator("#safetyValue")).toHaveText("100%");

  const persisted = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(persisted).toMatchObject({ started: true, completed: true });
  expect(persisted.discoveryOrder).toEqual(ISSUE_SEQUENCE.map(({ id }) => id));
  expect(persisted.repairedOrder).toEqual(ISSUE_SEQUENCE.map(({ id }) => id));

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  const restored = await snapshot(page);
  expect(restored.completed).toBe(true);
  expect(restored.repaired).toEqual(OFFICIAL_VOCABULARY);
});

test("the active incident phase and repair target restore from the upgraded save key", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  const outage = ISSUE_SEQUENCE[0];
  await openIssueDiagnosis(page, outage);
  await callHouseHelper(page, "answerCorrect");

  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)).not.toBeNull();
  const beforeReload = await snapshot(page);
  expect(beforeReload.activeIssueId).toBe(outage.id);
  expect(beforeReload.issues[outage.id]).toMatchObject({ phase: "diagnosed", repairStep: 0 });
  expect(beforeReload.blackout).toBe(true);
  expect(beforeReload.targetLabel).toContain("두꺼비집");

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  const restored = await snapshot(page);
  expect(restored.started).toBe(true);
  expect(restored.activeIssueId).toBe(outage.id);
  expect(restored.issues[outage.id]).toEqual(beforeReload.issues[outage.id]);
  expect(restored.blackout).toBe(true);
  expect(restored.targetLabel).toContain("두꺼비집");
  expect(restored.discovered).toEqual(beforeReload.discovered);
  expect(restored.repaired).toEqual(beforeReload.repaired);
});

test("room map buttons navigate through every doorway instead of teleporting", async ({ page }) => {
  await clearHouseRescueState(page);
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForTestHelper(page);
  await startNewAndSkipTutorial(page);

  expect((await snapshot(page)).room).toBe("living");

  for (const roomId of ["kitchen", "bathroom", "bedroom", "living"]) {
    const before = await snapshot(page);
    await page.locator("#statsToggle").click();
    await expect(page.locator("#statsPanel")).toBeVisible();
    await page.locator(`#roomMap [data-room="${roomId}"]`).click();

    // A teleport would synchronously produce pathLength 0. Keeping a real
    // route here protects the shared door/collision geometry used by tap mode.
    await expect.poll(async () => (await snapshot(page)).pathLength, { timeout: 2_000 })
      .toBeGreaterThan(0);

    await expect.poll(async () => {
      const current = await snapshot(page);
      return current.room === roomId && current.pathLength === 0;
    }, { timeout: 10_000 }).toBe(true);

    const after = await snapshot(page);
    expect(Math.hypot(after.player.x - before.player.x, after.player.y - before.player.y))
      .toBeGreaterThan(80);
  }
});

test.describe("390x844 optional joystick controls", () => {
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

    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForTestHelper(page);
    await expect(page.locator("html")).toHaveAttribute("data-control-mode", "joystick");
  });
});

test.describe("390x844 touch-first default", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("a fresh mobile visit defaults to canvas taps and moves the player", async ({ page }) => {
    await clearHouseRescueState(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await waitForTestHelper(page);
    await startNewAndSkipTutorial(page);

    await expect(page.locator("html")).toHaveAttribute("data-control-mode", "tap");
    await expect(page.locator('input[name="controlMode"][value="tap"]')).toBeChecked();
    await expect(page.locator("#touchJoystick")).toBeHidden();
    await expect(page.locator("#touchAction")).toBeHidden();
    await expect(page.locator("#tapModeHint")).toBeVisible();
    expect(await page.evaluate((key) => localStorage.getItem(key), CONTROL_MODE_KEY)).not.toBe("joystick");

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

    test("keeps the touch-first canvas and hint visible without horizontal overflow", async ({ page }) => {
      await clearHouseRescueState(page);
      await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
      await waitForTestHelper(page);
      await startNewAndSkipTutorial(page);

      await expect(page.locator("#houseGame")).toBeVisible();
      await expect(page.locator("#houseCanvas")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-control-mode", "tap");
      await expectInsideViewport(page, "#touchControls");
      await expectInsideViewport(page, "#tapModeHint", 44);
      await expect(page.locator("#touchJoystick")).toBeHidden();
      await expect(page.locator("#touchAction")).toBeHidden();
      await expectNoHorizontalOverflow(page);
    });
  });
}
