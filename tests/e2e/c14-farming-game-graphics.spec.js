const { test, expect } = require("@playwright/test");

const GAME_URL = "/c14/farming-game/";
const SAVE_KEY = "soil-village-save-v4";
const CONTROL_TUTORIAL_KEY = "soil-village-controls-tutorial-v1";
const PREVIOUS_SAVE_KEY = "soil-village-improved-save-v1";
const LEGACY_SAVE_KEYS = [
  PREVIOUS_SAVE_KEY,
  "soil-village-graphics-improved-save-v1",
  "soil-village-save-v3"
];

async function clearSave(page) {
  await page.addInitScript(({ key, tutorialKey, legacyKeys }) => {
    [key, tutorialKey, ...legacyKeys].forEach((storageKey) => localStorage.removeItem(storageKey));
  }, { key: SAVE_KEY, tutorialKey: CONTROL_TUTORIAL_KEY, legacyKeys: LEGACY_SAVE_KEYS });
}

async function seedSave(page, data) {
  await page.addInitScript(({ key, tutorialKey, saved }) => {
    localStorage.setItem(key, JSON.stringify(saved));
    localStorage.setItem(tutorialKey, "done");
  }, { key: SAVE_KEY, tutorialKey: CONTROL_TUTORIAL_KEY, saved: data });
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

async function expectCanvasIsRichAndOpaque(page, selector) {
  const stats = await page.locator(selector).evaluate((canvas) => {
    const context = canvas.getContext("2d");
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const colors = new Set();
    let opaque = 0;
    const xStep = Math.max(1, Math.floor(canvas.width / 24));
    const yStep = Math.max(1, Math.floor(canvas.height / 24));
    let samples = 0;
    for (let y = 0; y < canvas.height; y += yStep) {
      for (let x = 0; x < canvas.width; x += xStep) {
        const offset = (y * canvas.width + x) * 4;
        colors.add(`${data[offset] >> 3}-${data[offset + 1] >> 3}-${data[offset + 2] >> 3}`);
        opaque += data[offset + 3] > 245 ? 1 : 0;
        samples += 1;
      }
    }
    return { uniqueColors: colors.size, opaqueRatio: opaque / samples };
  });
  expect(stats.uniqueColors).toBeGreaterThan(24);
  expect(stats.opaqueRatio).toBeGreaterThan(0.96);
}

const deviceProfiles = [
  { name: "320x568 스마트폰 세로", viewport: { width: 320, height: 568 } },
  { name: "390x844 스마트폰 세로", viewport: { width: 390, height: 844 } },
  { name: "430x932 스마트폰 세로", viewport: { width: 430, height: 932 } },
  { name: "480x320 작은 스마트폰 가로", viewport: { width: 480, height: 320 } },
  { name: "568x320 스마트폰 가로", viewport: { width: 568, height: 320 } },
  { name: "667x375 스마트폰 가로", viewport: { width: 667, height: 375 } },
  { name: "844x390 스마트폰 가로", viewport: { width: 844, height: 390 } },
  { name: "768x1024 태블릿 세로", viewport: { width: 768, height: 1024 } },
  { name: "1024x768 태블릿 가로", viewport: { width: 1024, height: 768 } }
];

const activityProfiles = [
  { zoneId: "gardenCare", title: "정원을 가꾸다" },
  { zoneId: "lawnTrim", title: "잔디를 깎다" },
  { zoneId: "vegetablePlant", title: "채소를 심다" },
  { zoneId: "vegetableGrow", title: "채소를 키우다" },
  { zoneId: "farmWork", title: "농사를 짓다" },
  { zoneId: "raiseLivestock", title: "가축을 키우다" },
  { zoneId: "catchFish", title: "물고기를 잡다" }
];

for (const profile of deviceProfiles) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, isMobile: true, hasTouch: true });

    test("세계 그래픽과 조작부가 화면 안에서 또렷하게 렌더링된다", async ({ page }) => {
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await clearSave(page);
      await page.goto(GAME_URL);
      await expectInsideViewport(page, "#fullscreenButton", 44);
      await page.locator("#gameShell").evaluate((shell) => {
        Object.defineProperty(document, "fullscreenElement", { configurable: true, get: () => shell });
        document.querySelector(".top-nav").style.display = "none";
        shell.requestFullscreen = () => {
          document.dispatchEvent(new Event("fullscreenchange"));
          return Promise.resolve();
        };
      });
      await page.locator("#fullscreenButton").click();
      await expectInsideViewport(page, "#controlTutorial");
      await expectInsideViewport(page, "#touchJoystick", 44);
      await expectInsideViewport(page, "#tutorialNext", 44);
      await page.locator("#tutorialNext").click();
      await expectInsideViewport(page, "#touchAction", 44);
      await page.locator("#tutorialNext").click();
      await page.waitForTimeout(300);

      await expectInsideViewport(page, ".canvas-frame", 180);
      await expectInsideViewport(page, "#game", 180);
      await expectInsideViewport(page, "#touchJoystick", 44);
      await expectInsideViewport(page, "#touchAction", 44);
      await expectInsideViewport(page, "#storyToggle", 44);
      await expectCanvasIsRichAndOpaque(page, "#game");

      const layout = await page.evaluate(() => {
        const canvas = document.querySelector("#game").getBoundingClientRect();
        const frame = document.querySelector(".canvas-frame").getBoundingClientRect();
        const promptElement = document.querySelector("#promptBubble");
        const prompt = promptElement.getBoundingClientRect();
        const controls = ["#touchJoystick", "#touchAction"].map((selector) =>
          document.querySelector(selector).getBoundingClientRect()
        );
        const overlaps = (a, b) =>
          a.width > 0 && a.height > 0 && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        return {
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          verticalOverflow: document.documentElement.scrollHeight > window.innerHeight + 1,
          promptOverlapsControls:
            !promptElement.classList.contains("hidden") && controls.some((control) => overlaps(prompt, control)),
          edgeDelta: Math.max(
            Math.abs(canvas.left - frame.left),
            Math.abs(canvas.top - frame.top),
            Math.abs(canvas.right - frame.right),
            Math.abs(canvas.bottom - frame.bottom)
          )
        };
      });
      expect(layout).toEqual({
        horizontalOverflow: false,
        verticalOverflow: false,
        promptOverlapsControls: false,
        edgeDelta: expect.any(Number)
      });
      expect(layout.edgeDelta).toBeLessThan(1.5);
      expect(pageErrors).toEqual([]);
    });
  });
}

test.describe("정식 그래픽 버전 저장과 활동 장면", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("이전 개선판 저장을 보존하며 정식 저장 키로 이전한다", async ({ page }) => {
    const previousMarker = { started: true, marker: "preserve-me" };
    await page.addInitScript(({ previousKey, nextKey, marker }) => {
      localStorage.setItem(previousKey, JSON.stringify(marker));
      localStorage.removeItem(nextKey);
    }, { previousKey: PREVIOUS_SAVE_KEY, nextKey: SAVE_KEY, marker: previousMarker });
    await page.goto(GAME_URL);

    await expect(page.locator("#continueButton")).toBeVisible();
    const stored = await page.evaluate(({ previousKey, nextKey }) => ({
      previous: JSON.parse(localStorage.getItem(previousKey)),
      next: JSON.parse(localStorage.getItem(nextKey))
    }), { previousKey: PREVIOUS_SAVE_KEY, nextKey: SAVE_KEY });
    expect(stored.previous).toEqual(previousMarker);
    expect(stored.next).toEqual(previousMarker);
  });

  test("새로 시작하면 이전 저장을 다시 불러오지 않는다", async ({ page }) => {
    await page.addInitScript(({ previousKey, nextKey }) => {
      localStorage.setItem(previousKey, JSON.stringify({ started: true, marker: "old-walk" }));
      localStorage.removeItem(nextKey);
    }, { previousKey: PREVIOUS_SAVE_KEY, nextKey: SAVE_KEY });
    await page.goto(GAME_URL);

    await expect(page.locator("#continueButton")).toBeVisible();
    await page.locator("#startButton").click();
    await page.locator("#startButton").click();
    await expect(page.locator("#controlTutorial")).toBeVisible();
    await page.locator("#tutorialSkip").click();

    const stored = await page.evaluate(({ nextKey, legacyKeys }) => ({
      next: JSON.parse(localStorage.getItem(nextKey)),
      legacy: legacyKeys.map((key) => localStorage.getItem(key))
    }), { nextKey: SAVE_KEY, legacyKeys: LEGACY_SAVE_KEYS });
    expect(stored.next.started).toBeTruthy();
    expect(stored.next.marker).toBeUndefined();
    expect(stored.legacy).toEqual([null, null, null]);

    await page.reload();
    await expect(page.locator("#continueButton")).toBeVisible();
    await expect(page.locator("#saveSummary")).not.toContainText("old-walk");
  });

  test("정원 활동 배경과 유기적인 작업 지형이 스마트폰에서 렌더링된다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 1,
      flags: ["talkedAunt"],
      activeMiniGame: { zoneId: "gardenCare", snapshot: null }
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await page.waitForTimeout(250);

    await expectInsideViewport(page, "#miniGame");
    await expectInsideViewport(page, ".activity-stage", 180);
    await expectInsideViewport(page, "#activityCanvas", 180);
    await expect(page.locator("#miniGameTitle")).toHaveText("정원을 가꾸다");
    await expect(page.locator(".activity-goal.is-current")).toBeVisible();
    await expectCanvasIsRichAndOpaque(page, "#activityCanvas");
  });

  for (const activity of activityProfiles) {
    test(`${activity.title} 활동이 넓은 논리 화면으로 잘리지 않고 렌더링된다`, async ({ page }) => {
      await seedSave(page, {
        started: true,
        storyIndex: 1,
        flags: ["talkedAunt"],
        activeMiniGame: { zoneId: activity.zoneId, snapshot: null }
      });
      await page.goto(GAME_URL);
      await page.locator("#continueButton").click();
      await page.waitForTimeout(180);

      await expect(page.locator("#miniGameTitle")).toHaveText(activity.title);
      await expectInsideViewport(page, "#activityCanvas", 180);
      await expectCanvasIsRichAndOpaque(page, "#activityCanvas");
      const canvasSize = await page.locator("#activityCanvas").evaluate((canvas) => ({
        width: canvas.width,
        height: canvas.height
      }));
      expect(canvasSize.width).toBeGreaterThanOrEqual(640);
      expect(canvasSize.height).toBeGreaterThanOrEqual(360);
    });
  }

  test("첫 화면은 음성 파일을 미리 요청하지 않는다", async ({ page }) => {
    const audioRequests = [];
    page.on("request", (request) => {
      if (/\.(?:mp3|wav|ogg)(?:\?|$)/i.test(request.url())) {
        audioRequests.push(request.url());
      }
    });
    await clearSave(page);
    await page.goto(GAME_URL);
    await page.waitForTimeout(350);
    expect(audioRequests).toEqual([]);
  });

  test("밤 시각과 시간대 색상 단계가 같은 시각을 가리킨다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      player: { x: 1320, y: 1120, facing: "down", step: 0 },
      camera: { x: 1100, y: 660 },
      storyIndex: 1,
      flags: ["talkedAunt"],
      dayCycle: 0.82,
      dayStage: 4
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await expect(page.locator("#timeOfDayValue")).toHaveText("밤");
    await expect(page.locator("#timeOfDayDetail")).toHaveText(/21:|22:/);
    await expectCanvasIsRichAndOpaque(page, "#game");
  });
});

test.describe("스마트폰 가로 활동 조작", () => {
  test.use({ viewport: { width: 667, height: 375 }, isMobile: true, hasTouch: true });

  test("활동 장면을 확보하고 양쪽 엄지 조작부와 겹치지 않는다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 1,
      flags: ["talkedAunt"],
      activeMiniGame: { zoneId: "gardenCare", snapshot: null }
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await page.waitForTimeout(250);

    await expectInsideViewport(page, "#miniGame");
    await expectInsideViewport(page, "#activityCanvas", 150);
    await expectInsideViewport(page, "#touchJoystick", 44);
    await expectInsideViewport(page, "#touchAction", 44);

    const overlap = await page.evaluate(() => {
      const stage = document.querySelector(".activity-stage").getBoundingClientRect();
      const controls = ["#touchJoystick", "#touchAction"].map((selector) =>
        document.querySelector(selector).getBoundingClientRect()
      );
      return controls.some((control) =>
        stage.left < control.right && stage.right > control.left && stage.top < control.bottom && stage.bottom > control.top
      );
    });
    expect(overlap).toBeFalsy();
  });
});
