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

async function holdControl(page, testId = "causer-button", duration = 2600) {
  const locator = page.getByTestId(testId);
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(duration);
  await page.mouse.up();
}

async function dragCauserTo(page, xPercent, yPercent) {
  const board = await page.getByTestId("stage-board").boundingBox();
  const causer = await page.getByTestId("causer-button").boundingBox();
  expect(board).not.toBeNull();
  expect(causer).not.toBeNull();
  await page.mouse.move(causer.x + causer.width / 2, causer.y + causer.height / 2);
  await page.mouse.down();
  await page.mouse.move(board.x + board.width * xPercent / 100, board.y + board.height * yPercent / 100, { steps: 10 });
  await page.mouse.up();
}

async function readStageNumber(page, name) {
  return Number(await page.getByTestId("stage-board").evaluate((board, key) => board.dataset[key], name));
}

test("c15 hub opens the V-게 하다 influence lab", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c15/index.html", { waitUntil: "domcontentloaded" });

  await page.getByRole("link", { name: /영향력 실험실/ }).click();

  await expect(page).toHaveURL(/grammar1-ge-hada-influence-lab\.html$/);
  await expect(page.locator("h1")).toContainText("V-게 하다 영향력 실험실");
});

test("holding the causer pushes the causee into the action zone", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.getByTestId("sentence-line")).toHaveText("선생님이 학생에게 숙제를 하게 했어요.");
  await expect(page.getByTestId("result-piece")).not.toHaveClass(/is-complete/);
  await holdControl(page);

  await expect(page.getByTestId("result-piece")).toHaveClass(/is-complete/);
  await expect(page.locator("#feedbackText")).toContainText("숙제를 하게 했다");
  await expect(page.locator("#progressText")).toHaveText("1 / 6");
});

test("wind and boat example completes and restores from local save", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

  await page.locator('.scenario-card[data-id="wind"]').click();
  await expect(page.getByTestId("sentence-line")).toHaveText("바람이 배를 가게 했어요.");
  await expect(page.locator("#sceneImage")).toHaveAttribute("src", /bg-sea\.webp$/);
  await expect(page.locator("#causerArt")).toHaveAttribute("src", /sprites\/wind\.webp$/);
  await expect(page.locator("#causeeArt")).toHaveAttribute("src", /sprites\/boat\.webp$/);
  await holdControl(page, "hold-button");
  await expect(page.getByTestId("result-piece")).toHaveClass(/is-complete/);
  await expect(page.locator("#feedbackText")).toContainText("가게 했다");
  await expect(page.locator("#saveState")).toHaveText("저장됨");

  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.getByTestId("sentence-line")).toHaveText("바람이 배를 가게 했어요.");
  await expect(page.getByTestId("result-piece")).toHaveClass(/is-complete/);
  await expect(page.locator('.scenario-card[data-id="wind"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#progressText")).toHaveText("1 / 6");
});

test("influence lab is responsive and keeps images loaded", async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("stage-board")).toBeVisible();
    await expect(page.getByTestId("causer-button")).toBeInViewport();
    await expectNoHorizontalOverflow(page);

    const loaded = await page.locator("#sceneImage, #causerArt, #causeeArt").evaluateAll((images) => (
      images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)
    ));
    expect(loaded).toBe(true);
  }
});

test("reduced motion still shows the core state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator(".motion-note")).toBeVisible();
  await holdControl(page);
  await expect(page.getByTestId("result-piece")).toHaveClass(/is-complete/);
  await expect(page.getByTestId("sentence-line")).toContainText("하게 했어요");
});

test("causer can be dragged and nearby influence moves the causee faster", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });
  await page.locator('.scenario-card[data-id="wind"]').click();

  await dragCauserTo(page, 72, 66);
  await expect.poll(() => readStageNumber(page, "causerX")).toBeGreaterThan(68);
  await expect.poll(() => readStageNumber(page, "causerY")).toBeGreaterThan(62);
  await expect.poll(() => readStageNumber(page, "distanceBoost")).toBeGreaterThan(1.5);

  await page.locator("#retryButton").click();
  await page.locator('.scenario-card[data-id="wind"]').click();
  await dragCauserTo(page, 10, 20);
  await holdControl(page, "hold-button", 700);
  const farProgress = await readStageNumber(page, "progress");

  await page.locator("#retryButton").click();
  await dragCauserTo(page, 52, 65);
  await holdControl(page, "hold-button", 700);
  const nearProgress = await readStageNumber(page, "progress");

  expect(nearProgress).toBeGreaterThan(farProgress + 0.08);
});

test("homework causee starts by moving away from the action zone", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

  const initialX = await readStageNumber(page, "causeeX");
  await page.waitForTimeout(900);
  const escapedX = await readStageNumber(page, "causeeX");
  const escape = await readStageNumber(page, "escape");

  expect(initialX).toBeLessThan(59.5);
  expect(escapedX).toBeLessThan(initialX - 4);
  expect(escape).toBeGreaterThan(0.5);
});

test("strong wave and beam are visible while influence is charging", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });

  const hold = page.getByTestId("hold-button");
  await hold.scrollIntoViewIfNeeded();
  const box = await hold.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);

  await expect(page.getByTestId("stage-board")).toHaveClass(/is-charging/);
  await expect(page.locator(".wave-field span")).toHaveCount(4);
  const waveBox = await page.locator(".wave-field").boundingBox();
  expect(waveBox.width).toBeGreaterThan(240);
  const beamHeight = await page.locator("#pathLine").evaluate((line) => parseFloat(getComputedStyle(line).height));
  expect(beamHeight).toBeGreaterThanOrEqual(16);
  await page.mouse.up();
});

test("blocked entry approaches the door then bounces away", async ({ page }) => {
  await page.goto("/c15/grammar1-ge-hada-influence-lab.html", { waitUntil: "domcontentloaded" });
  await page.locator('.scenario-card[data-id="guard"]').click();

  const hold = page.getByTestId("hold-button");
  await hold.scrollIntoViewIfNeeded();
  const box = await hold.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(1300);
  const approachX = await readStageNumber(page, "causeeX");
  await page.waitForTimeout(1800);
  await page.mouse.up();

  await expect(page.getByTestId("result-piece")).toHaveClass(/is-complete/);
  await expect(page.getByTestId("causee-node")).toHaveClass(/is-bouncing/);
  const bouncedX = await readStageNumber(page, "causeeX");
  expect(approachX).toBeLessThan(58);
  expect(bouncedX).toBeGreaterThan(approachX + 18);
});
