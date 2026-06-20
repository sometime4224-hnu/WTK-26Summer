const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://cdn.tailwindcss.com/**", (route) => route.abort());
}

async function openCardGame(page, viewport, options = {}) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto("/c12/vocabulary-card-game.html", { waitUntil: "domcontentloaded" });
  await page.evaluate((pcMode) => {
    if (pcMode) {
      localStorage.setItem("c12-pc-mode", "true");
    } else {
      localStorage.removeItem("c12-pc-mode");
    }
  }, Boolean(options.pcMode));
  if (options.pcMode) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveClass(/pc-mode/);
  }
}

async function startGame(page) {
  await page.locator(".start-btn").click();
  await expect(page.locator("#screen-game")).toHaveClass(/active/);
  await expect(page.locator("#choices-grid .choice-card")).toHaveCount(4);
}

async function answerFirstChoice(page) {
  await page.locator("#choices-grid .choice-card").first().click();
  await expect(page.locator("#next-btn")).toBeVisible();
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  )).toBe(true);
}

async function expectLocatorInViewport(page, locator) {
  const viewport = page.viewportSize();
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

async function expectAllChoicesInViewport(page) {
  const choices = page.locator("#choices-grid .choice-card");
  const count = await choices.count();
  expect(count).toBe(4);
  for (let index = 0; index < count; index += 1) {
    await expectLocatorInViewport(page, choices.nth(index));
  }
}

async function expectChoiceColumns(page, expected) {
  const columnCount = await page.locator("#choices-grid").evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns.trim();
    return columns ? columns.split(/\s+/).length : 0;
  });
  expect(columnCount).toBe(expected);
}

async function expectGameLayoutColumns(page, minColumns) {
  const columnCount = await page.locator(".game-layout").evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns.trim();
    return columns ? columns.split(/\s+/).length : 0;
  });
  expect(columnCount).toBeGreaterThanOrEqual(minColumns);
}

test("c12 vocabulary card game keeps start controls and one-screen play visible on a small phone", async ({ page }) => {
  await openCardGame(page, { width: 360, height: 640 });

  await expect(page.locator(".mode-panel")).toHaveCount(0);
  await expectLocatorInViewport(page, page.locator(".start-btn"));

  await startGame(page);
  await expect(page.locator("#choices-grid .choice-card").first()).toHaveJSProperty("tagName", "BUTTON");
  await expectChoiceColumns(page, 2);
  await answerFirstChoice(page);

  await expectLocatorInViewport(page, page.locator(".formula-row"));
  await expectLocatorInViewport(page, page.locator("#next-btn"));
  await expectAllChoicesInViewport(page);
  await expectNoHorizontalOverflow(page);
});

test("c12 vocabulary card game stays in view after an answer on a regular phone", async ({ page }) => {
  await openCardGame(page, { width: 390, height: 844 });

  await startGame(page);
  await answerFirstChoice(page);

  await expectLocatorInViewport(page, page.locator(".formula-row"));
  await expectLocatorInViewport(page, page.locator("#next-btn"));
  await expectAllChoicesInViewport(page);
  await expectNoHorizontalOverflow(page);
});

test("c12 vocabulary card game uses a two-column tablet landscape layout with all choices visible", async ({ page }) => {
  await openCardGame(page, { width: 1024, height: 768 });

  await startGame(page);
  await expectGameLayoutColumns(page, 2);
  await expectChoiceColumns(page, 4);
  await answerFirstChoice(page);

  await expectLocatorInViewport(page, page.locator("#next-btn"));
  await expectAllChoicesInViewport(page);
  await expectNoHorizontalOverflow(page);
});

test("c12 vocabulary card game keeps four choices visible in existing PC mode", async ({ page }) => {
  await openCardGame(page, { width: 1366, height: 768 }, { pcMode: true });

  await startGame(page);
  await expectGameLayoutColumns(page, 2);
  await expectChoiceColumns(page, 4);
  await answerFirstChoice(page);

  await expectLocatorInViewport(page, page.locator("#next-btn"));
  await expectAllChoicesInViewport(page);
  await expectNoHorizontalOverflow(page);
});
