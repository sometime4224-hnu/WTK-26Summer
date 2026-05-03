const { test, expect } = require("@playwright/test");

const NEXT_SAVE_KEY = "sodam-village-next-save-v2";

async function clearNextSave(page) {
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
  }, NEXT_SAVE_KEY);
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBeFalsy();
}

async function expectCanvasHasScenePixels(page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#gameCanvas");
    if (!canvas) {
      return false;
    }
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const points = [
      [0.12, 0.18],
      [0.34, 0.52],
      [0.58, 0.42],
      [0.82, 0.72]
    ];
    const colors = points.map(([xRatio, yRatio]) => {
      const x = Math.floor(canvas.width * xRatio);
      const y = Math.floor(canvas.height * yRatio);
      return Array.from(context.getImageData(x, y, 1, 1).data).join(",");
    });
    return new Set(colors).size >= 3 && colors.some((color) => !color.endsWith(",0"));
  });
}

async function movePlayerTo(page, x, y) {
  await page.evaluate(
    ({ nextX, nextY }) => {
      const state = window.FARMING_NEXT_PROTOTYPE.state;
      state.player.x = nextX;
      state.player.y = nextY;
      state.camera.x = Math.max(0, nextX - 480);
      state.camera.y = Math.max(0, nextY - 320);
    },
    { nextX: x, nextY: y }
  );
}

async function pressAction(page) {
  await page.keyboard.press("Space");
}

async function completeCurrentAction(page, maxPresses = 5) {
  for (let pressCount = 0; pressCount < maxPresses; pressCount += 1) {
    await pressAction(page);
    const stillWorking = await page.evaluate(() => Boolean(window.FARMING_NEXT_PROTOTYPE.state.actionJob));
    if (!stillWorking) {
      return;
    }
  }
  const unfinished = await page.evaluate(() => window.FARMING_NEXT_PROTOTYPE.state.actionJob);
  expect(unfinished).toBeFalsy();
}

test("c14 farming NEXT prototype renders and completes its first loop", async ({ page }) => {
  await clearNextSave(page);
  const localErrors = [];
  page.on("pageerror", (error) => localErrors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/c14/farming-game-next/") && response.status() >= 400) {
      localErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/c14/farming-game-next/");
  await expect(page).toHaveTitle("소담한 마을 NEXT");
  await expect(page.locator("#gameCanvas")).toBeVisible();
  await expect(page.locator("#miniMap")).toBeVisible();
  await expect(page.locator("#questList li")).toHaveCount(9);
  await expectCanvasHasScenePixels(page);
  await expectNoHorizontalOverflow(page);

  await movePlayerTo(page, 220, 542);
  await pressAction(page);
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueText")).toContainText("채소를 심고");
  await expect(page.locator("#toast")).toContainText("시골에 내려가다");
  const companionUnlocked = await page.evaluate(() => window.FARMING_NEXT_PROTOTYPE.state.companion.unlocked);
  expect(companionUnlocked).toBeTruthy();
  await pressAction(page);
  await pressAction(page);
  await expect(page.locator("#questTitle")).toContainText("정원을 가꾸기");

  const gardenPositions = await page.evaluate(() => {
    return window.FARMING_NEXT_PROTOTYPE.state.gardenTasks.map((task) => ({ x: task.x, y: task.y }));
  });

  await movePlayerTo(page, gardenPositions[0].x, gardenPositions[0].y);
  await pressAction(page);
  const activeGardenJob = await page.evaluate(() => ({
    type: window.FARMING_NEXT_PROTOTYPE.state.actionJob?.type,
    mode: window.FARMING_NEXT_PROTOTYPE.state.actionJob?.mode,
    progress: window.FARMING_NEXT_PROTOTYPE.state.actionJob?.progress,
    score: window.FARMING_NEXT_PROTOTYPE.state.actionJob?.score,
    lastQuality: window.FARMING_NEXT_PROTOTYPE.state.actionJob?.lastQuality?.id
  }));
  expect(activeGardenJob.type).toBe("garden");
  expect(activeGardenJob.mode).toBe("quest");
  expect(activeGardenJob.progress).toBe(1);
  expect(activeGardenJob.score).toBeGreaterThanOrEqual(1);
  expect(["ok", "good", "perfect"]).toContain(activeGardenJob.lastQuality);
  await completeCurrentAction(page);
  await expect(page.locator("#actionLog li")).toHaveCount(1);
  await expect(page.locator("#skillSummary")).toContainText("활동 기록");

  for (const task of gardenPositions.slice(1)) {
    await movePlayerTo(page, task.x, task.y);
    await completeCurrentAction(page);
  }
  await expect(page.locator("#questTitle")).toContainText("잔디를 깎기");

  const lawnPositions = await page.evaluate(() => {
    return window.FARMING_NEXT_PROTOTYPE.state.lawnTasks.map((task) => ({ x: task.x, y: task.y }));
  });

  for (const task of lawnPositions) {
    await movePlayerTo(page, task.x, task.y);
    await completeCurrentAction(page);
  }
  await expect(page.locator("#questTitle")).toContainText("채소를 심기");
  await expect(page.locator("#saveStatus")).toContainText("저장");

  const cropPositions = await page.evaluate(() => {
    return window.FARMING_NEXT_PROTOTYPE.state.crops.slice(0, 3).map((crop) => ({ x: crop.x, y: crop.y }));
  });

  for (const crop of cropPositions) {
    await movePlayerTo(page, crop.x, crop.y);
    await completeCurrentAction(page);
  }
  await expect(page.locator("#questTitle")).toContainText("채소를 키우기");

  for (const crop of cropPositions) {
    await movePlayerTo(page, crop.x, crop.y);
    await completeCurrentAction(page);
  }
  await expect(page.locator("#questTitle")).toContainText("바구니에 담기");

  await page.waitForFunction(() => {
    return window.FARMING_NEXT_PROTOTYPE.state.crops.filter((crop) => crop.stage === "ripe").length >= 3;
  });

  for (const crop of cropPositions) {
    await movePlayerTo(page, crop.x, crop.y);
    await completeCurrentAction(page);
  }
  await expect(page.locator("#basketText")).toHaveText("3");
  await expect(page.locator("#questTitle")).toContainText("가축에게 먹이를 주기");

  await movePlayerTo(page, 1018, 730);
  await completeCurrentAction(page);
  await completeCurrentAction(page);
  await expect(page.locator("#questTitle")).toContainText("물고기를 잡기");

  const fishSpot = await page.evaluate(() => {
    const spot = window.FARMING_NEXT_PROTOTYPE.state.fishSpots[0];
    return { x: spot.x, y: spot.y };
  });
  await movePlayerTo(page, fishSpot.x, fishSpot.y);
  await completeCurrentAction(page);
  await expect(page.locator("#basketText")).toHaveText("4");
  await expect(page.locator("#questTitle")).toContainText("저녁상을 차리기");

  await movePlayerTo(page, 492, 286);
  await completeCurrentAction(page);
  await expect(page.locator("#finishCard")).toBeVisible();
  await expect(page.locator("#finishCard")).toContainText("첫 실험 구역 완성");
  await expect(page.locator("#finishSummary")).toContainText("활동");
  await expect(page.locator("#actionLog li")).toHaveCount(18);
  await expect(page.locator("#expressionList li.is-complete")).toHaveCount(8);
  await expect(page.locator("#questList li.is-complete")).toHaveCount(9);

  const savedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), NEXT_SAVE_KEY);
  expect(savedState.finished).toBeTruthy();
  expect(savedState.basket).toBe(4);
  expect(savedState.actionLog.length).toBeGreaterThanOrEqual(8);
  expect(savedState.actionLog[0].type).toBe("deliver");
  expect(savedState.actionLog.some((item) => item.bonus > 0)).toBeTruthy();
  expect(savedState.completedExpressions).toContain("prepareDinner");
  expect(savedState.completedExpressions).toContain("catchFish");

  expect(localErrors).toEqual([]);
});

test("c14 farming NEXT lets players do nearby actions outside the active quest", async ({ page }) => {
  await clearNextSave(page);
  await page.goto("/c14/farming-game-next/");

  const lawnPosition = await page.evaluate(() => {
    const task = window.FARMING_NEXT_PROTOTYPE.state.lawnTasks[0];
    return { x: task.x, y: task.y };
  });

  await movePlayerTo(page, lawnPosition.x, lawnPosition.y);
  const freeInteraction = await page.evaluate(() => {
    const interaction = window.FARMING_NEXT_PROTOTYPE.getInteraction();
    return { type: interaction?.type, mode: interaction?.mode };
  });
  expect(freeInteraction).toEqual({ type: "lawn", mode: "free" });

  await completeCurrentAction(page);

  const freeActionState = await page.evaluate(() => {
    const state = window.FARMING_NEXT_PROTOTYPE.state;
    return {
      questIndex: state.questIndex,
      lawnDone: state.lawnTasks.filter((task) => task.done).length,
      actionLogCount: state.actionLog.length,
      logMode: state.actionLog[0]?.mode
    };
  });
  expect(freeActionState).toEqual({ questIndex: 0, lawnDone: 1, actionLogCount: 1, logMode: "free" });
});

test.describe("c14 farming NEXT mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  test("keeps canvas, HUD, and touch controls usable", async ({ page }) => {
    await clearNextSave(page);
    await page.goto("/c14/farming-game-next/");
    await expect(page.locator("#gameCanvas")).toBeVisible();
    await expect(page.locator("#miniMap")).toBeVisible();
    await expect(page.locator("[data-action='interact']")).toBeVisible();
    await expect(page.locator("[data-dir='up']")).toBeVisible();
    await expectCanvasHasScenePixels(page);
    await expectNoHorizontalOverflow(page);

    const actionBox = await page.locator("[data-action='interact']").boundingBox();
    expect(actionBox).not.toBeNull();
    expect(actionBox.height).toBeGreaterThanOrEqual(48);
    expect(actionBox.width).toBeGreaterThanOrEqual(58);
  });
});
