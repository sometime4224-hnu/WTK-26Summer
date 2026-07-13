const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const SAVE_KEY = "soil-village-save-v4";
const CONTROL_TUTORIAL_KEY = "soil-village-controls-tutorial-v1";
const LEGACY_SAVE_KEYS = [
  "soil-village-improved-save-v1",
  "soil-village-graphics-improved-save-v1",
  "soil-village-save-v3"
];
const repoRoot = path.resolve(__dirname, "../..");
const gameRoot = path.join(repoRoot, "c14", "farming-game");

function collectFiles(directory, extensions) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath, extensions);
    }
    return extensions.includes(path.extname(entry.name).toLowerCase()) ? [fullPath] : [];
  });
}

async function clearFarmingSave(page) {
  await page.addInitScript(({ key, legacyKeys, tutorialKey }) => {
    [key, tutorialKey, ...legacyKeys].forEach((storageKey) => localStorage.removeItem(storageKey));
  }, { key: SAVE_KEY, legacyKeys: LEGACY_SAVE_KEYS, tutorialKey: CONTROL_TUTORIAL_KEY });
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
  expect(hasOverflow).toBeFalsy();
}

async function expectCanvasHasScenePixels(page, selector) {
  await page.waitForFunction((canvasSelector) => {
    const canvas = document.querySelector(canvasSelector);
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      return false;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return false;
    }

    const samplePoints = [
      [0.12, 0.18],
      [0.32, 0.34],
      [0.5, 0.5],
      [0.68, 0.42],
      [0.84, 0.76]
    ];
    const colors = samplePoints.map(([xRatio, yRatio]) => {
      const x = Math.min(canvas.width - 1, Math.floor(canvas.width * xRatio));
      const y = Math.min(canvas.height - 1, Math.floor(canvas.height * yRatio));
      return Array.from(context.getImageData(x, y, 1, 1).data).join(",");
    });

    return new Set(colors).size >= 3 && colors.some((color) => !color.endsWith(",0"));
  }, selector);
}

test("c14 hub opens the promoted canonical farming game", async ({ page }) => {
  await page.goto("/c14/");
  const gameLink = page.getByRole("link", { name: "농촌 마을 산책 게임" });
  await expect(gameLink).toHaveAttribute("href", "farming-game/index.html");
  await gameLink.click();
  await expect(page).toHaveURL(/\/c14\/farming-game\/(?:index\.html)?$/);
  await expect(page.locator("h1")).toContainText("소담한 마을");
});

test("c14 farming game starts, draws the world, and opens core panels", async ({ page }) => {
  await clearFarmingSave(page);
  const localErrors = [];
  page.on("pageerror", (error) => localErrors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/c14/farming-game/") && response.status() >= 400) {
      localErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/c14/farming-game/");

  await expect(page.locator("h1")).toContainText("소담한 마을");
  await expect(page.locator("#game")).toBeVisible();
  await expectCanvasHasScenePixels(page, "#game");
  await expectNoHorizontalOverflow(page);

  await expect(page.locator("#startButton")).toBeVisible();
  await page.locator("#startButton").click();
  await expect(page.locator("#startCard")).toHaveClass(/hidden/);
  await expect(page.locator("#toast")).toContainText("첫 부탁");

  const savedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(savedState.started).toBeTruthy();
  expect(savedState.unlockedListening).toEqual([]);

  await page.keyboard.press("KeyE");
  await expect(page.locator("#dialogueBox")).toBeVisible();
  await expect(page.locator("#dialogueSpeaker")).toContainText("이모");
  await page.locator("#dialogueClose").click();
  await expect(page.locator("#dialogueBox")).toHaveClass(/hidden/);

  await page.locator("#storyToggle").click();
  await expect(page.locator("#storyPanel")).toBeVisible();
  await expect(page.locator("#storyTitle")).not.toHaveText("");

  await page.locator("#statsToggle").click();
  await expect(page.locator("#statsPanel")).toBeVisible();
  await expect(page.locator("#miniMap")).toBeVisible();

  await page.locator("#journalToggle").click();
  await expect(page.locator("#journalDrawer")).toBeVisible();
  await expect(page.locator("#nounsList .chip")).toHaveCount(6);
  await expect(page.locator("#verbsList .chip")).toHaveCount(6);
  await page.locator("#journalClose").click();
  await expect(page.locator("#journalDrawer")).toHaveClass(/hidden/);

  await page.locator("#voiceToggle").click();
  await expect(page.locator("#voiceToggle")).toContainText("꺼짐");
  await page.locator("#voiceToggle").click();
  await expect(page.locator("#voiceToggle")).toContainText("켜짐");

  expect(localErrors).toEqual([]);
});

test.describe("c14 farming game mobile layout", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  test("keeps the first actions visible on a phone-sized screen", async ({ page }) => {
    await clearFarmingSave(page);
    await page.goto("/c14/farming-game/");

    await expect(page.locator("h1")).toContainText("소담한 마을");
    await expect(page.locator("#game")).toBeVisible();
    await expectCanvasHasScenePixels(page, "#game");
    await expectNoHorizontalOverflow(page);

    const startBox = await page.locator("#startButton").boundingBox();
    expect(startBox).not.toBeNull();
    expect(startBox.height).toBeGreaterThanOrEqual(44);

    await page.locator("#startButton").click();
    await expect(page.locator("#controlTutorial")).toBeVisible();
    await page.locator("#tutorialNext").click();
    await page.locator("#tutorialNext").click();
    await expect(page.locator("#touchAction")).toBeVisible();
    await expect(page.locator("#touchJoystick")).toBeVisible();

    const actionBox = await page.locator("#touchAction").boundingBox();
    expect(actionBox).not.toBeNull();
    expect(actionBox.width).toBeGreaterThanOrEqual(96);
    expect(actionBox.height).toBeGreaterThanOrEqual(44);

    await page.locator("#journalToggle").click();
    await expect(page.locator("#journalDrawer")).toBeVisible();
    await expect(page.locator("#journalClose")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("전체화면 요청 뒤 첫 방문 조작 안내를 마치고 바로 시작한다", async ({ page }) => {
    await clearFarmingSave(page);
    await page.goto("/c14/farming-game/");
    await page.locator("#gameShell").evaluate((shell) => {
      window.__fullscreenRequestCount = 0;
      window.__testFullscreenElement = null;
      Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        get: () => window.__testFullscreenElement
      });
      shell.requestFullscreen = () => {
        window.__fullscreenRequestCount += 1;
        window.__testFullscreenElement = shell;
        document.querySelector(".top-nav").style.display = "none";
        document.dispatchEvent(new Event("fullscreenchange"));
        return Promise.resolve();
      };
      document.exitFullscreen = () => {
        window.__testFullscreenElement = null;
        document.querySelector(".top-nav").style.display = "";
        document.dispatchEvent(new Event("fullscreenchange"));
        return Promise.resolve();
      };
    });

    await expect(page.locator("#fullscreenButton")).toContainText("전체화면으로 시작");
    await page.locator("#fullscreenButton").click();

    await expect.poll(() => page.evaluate(() => window.__fullscreenRequestCount)).toBe(1);
    await expect(page.locator("html")).toHaveAttribute("data-fullscreen", "on");
    await expect(page.locator("#controlTutorial")).toBeVisible();
    await expect(page.locator("body")).toHaveClass(/is-control-tutorial/);
    await expect(page.locator("#tutorialStepLabel")).toHaveText("조작 안내 1 / 2");
    await expect(page.locator("#touchJoystick")).toHaveClass(/is-tutorial-target/);
    await expect(page.locator("#touchAction")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.locator("#tutorialSkip")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#tutorialNext")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#tutorialSkip")).toBeFocused();

    const joystick = await page.locator("#touchJoystick").boundingBox();
    const centerX = joystick.x + joystick.width / 2;
    const centerY = joystick.y + joystick.height / 2;
    await page.locator("#touchJoystick").dispatchEvent("pointerdown", { pointerId: 7, clientX: centerX, clientY: centerY });
    await page.locator("#touchJoystick").dispatchEvent("pointermove", {
      pointerId: 7,
      clientX: joystick.x + joystick.width * 0.8,
      clientY: centerY
    });
    await page.locator("#touchJoystick").dispatchEvent("pointerup", {
      pointerId: 7,
      clientX: joystick.x + joystick.width * 0.8,
      clientY: centerY
    });
    await expect(page.locator("#tutorialStepLabel")).toHaveText("조작 안내 2 / 2");
    await expect(page.locator("#touchAction")).toHaveClass(/is-tutorial-target/);
    const actionHitTarget = await page.locator("#touchAction").evaluate((button) => {
      const rect = button.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      return hit === button || button.contains(hit);
    });
    expect(actionHitTarget).toBeTruthy();
    await page.locator("#touchAction").dispatchEvent("pointerdown", { pointerId: 8 });

    await expect(page.locator("#controlTutorial")).toBeHidden();
    await expect(page.locator("body")).toHaveClass(/is-game-started/);
    await expect(page.locator("#touchJoystick")).toBeVisible();
    await expect(page.locator("#touchAction")).toBeVisible();
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), CONTROL_TUTORIAL_KEY)).toBe("done");

    await page.locator("#fullscreenToggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-fullscreen", "off");
    await page.evaluate(() => resetState());
    await expect(page.locator("#fullscreenStatus")).toContainText("주소창");
    await page.locator("#fullscreenButton").click();
    await expect(page.locator("#controlTutorial")).toBeHidden();
    await expect(page.locator("body")).toHaveClass(/is-game-started/);
  });

  test("전체화면 API가 없어도 안내 후 일반 화면에서 계속한다", async ({ page }) => {
    await clearFarmingSave(page);
    await page.goto("/c14/farming-game/");
    await page.locator("#gameShell").evaluate((shell) => {
      Object.defineProperty(shell, "requestFullscreen", { value: undefined, configurable: true });
      Object.defineProperty(shell, "webkitRequestFullscreen", { value: undefined, configurable: true });
    });

    await page.locator("#fullscreenButton").click();
    await expect(page.locator("#controlTutorial")).toBeVisible();
    await expect(page.locator("#tutorialStatus")).toContainText("지원하지 않아요");
    await page.locator("#tutorialSkip").click();
    await expect(page.locator("body")).toHaveClass(/is-game-started/);
  });

  test("브라우저가 전체화면 요청을 거부해도 게임 진입을 막지 않는다", async ({ page }) => {
    await clearFarmingSave(page);
    await page.goto("/c14/farming-game/");
    await page.locator("#gameShell").evaluate((shell) => {
      shell.requestFullscreen = () => Promise.reject(new DOMException("denied", "NotAllowedError"));
    });

    await page.locator("#fullscreenButton").click();
    await expect(page.locator("#tutorialStatus")).toContainText("허용되지 않았어요");
    await page.locator("#tutorialSkip").click();
    await expect(page.locator("body")).toHaveClass(/is-game-started/);
  });

  test("구형 WebKit 방식의 전체화면 전환도 확인한 뒤 안내를 연다", async ({ page }) => {
    await clearFarmingSave(page);
    await page.goto("/c14/farming-game/");
    await page.locator("#gameShell").evaluate((shell) => {
      window.__webkitFullscreenElement = null;
      Object.defineProperty(shell, "requestFullscreen", { value: undefined, configurable: true });
      Object.defineProperty(document, "webkitFullscreenElement", {
        configurable: true,
        get: () => window.__webkitFullscreenElement
      });
      shell.webkitRequestFullscreen = () => {
        window.__webkitFullscreenElement = shell;
        document.dispatchEvent(new Event("webkitfullscreenchange"));
      };
    });

    await page.locator("#fullscreenButton").click();
    await expect(page.locator("html")).toHaveAttribute("data-fullscreen", "on");
    await expect(page.locator("#controlTutorial")).toBeVisible();
    await page.locator("#tutorialSkip").click();
    await expect(page.locator("body")).toHaveClass(/is-game-started/);
  });
});

test("c14 farming game local media assets are present", async () => {
  const gameScript = fs.readFileSync(path.join(gameRoot, "game.js"), "utf8");
  const imageFiles = collectFiles(path.join(gameRoot, "assets"), [".png"]);
  const audioFiles = collectFiles(path.join(gameRoot, "audio"), [".mp3", ".wav"]);
  const audioReferences = new Set();
  const audioPattern = /[`"]\.\/(audio\/[^`"']+\.(?:mp3|wav))[`"]/g;
  let audioMatch;

  while ((audioMatch = audioPattern.exec(gameScript)) !== null) {
    audioReferences.add(audioMatch[1]);
  }

  expect(gameScript).toContain('const IMAGE_ASSET_ROOT = "assets/images"');
  expect(imageFiles.length).toBeGreaterThanOrEqual(30);
  expect(audioFiles.length).toBeGreaterThanOrEqual(20);

  for (const filePath of [...imageFiles, ...audioFiles]) {
    expect(fs.statSync(filePath).size).toBeGreaterThan(0);
  }

  for (const audioPath of audioReferences) {
    expect(fs.existsSync(path.join(gameRoot, audioPath))).toBeTruthy();
  }
});
