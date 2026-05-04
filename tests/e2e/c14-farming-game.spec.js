const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const SAVE_KEY = "soil-village-save-v3";
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
  await page.addInitScript((key) => {
    localStorage.removeItem(key);
  }, SAVE_KEY);
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
  await expect(page.locator("#toast")).toContainText("주말농장");

  const savedState = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(savedState.started).toBeTruthy();
  expect(savedState.unlockedListening).toContain("weekendFarm");

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
    await expect(page.locator("#touchAction")).toBeVisible();
    await expect(page.locator("#touchJoystick")).toBeVisible();

    const actionBox = await page.locator("#touchAction").boundingBox();
    expect(actionBox).not.toBeNull();
    expect(actionBox.width).toBeGreaterThanOrEqual(96);
    expect(actionBox.height).toBeGreaterThanOrEqual(54);

    await page.locator("#journalToggle").click();
    await expect(page.locator("#journalDrawer")).toBeVisible();
    await expect(page.locator("#journalClose")).toBeVisible();
    await expectNoHorizontalOverflow(page);
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
