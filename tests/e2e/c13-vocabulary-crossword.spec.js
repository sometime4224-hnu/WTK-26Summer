const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

async function clickLetters(page, text) {
  for (const letter of Array.from(text)) {
    await page
      .locator(".letter-tile:not(.is-used)")
      .filter({ hasText: new RegExp(`^${letter}$`) })
      .first()
      .click();
  }
}

async function expectTrackText(page, expected) {
  const actual = await page.locator("#word-track").textContent();
  expect(actual.replace(/\s+/g, "")).toBe(expected);
}

async function expectCellText(page, row, col, expected) {
  await expect(page.locator(`.grid-cell[data-row="${row}"][data-col="${col}"] .grid-cell__value`)).toHaveText(expected);
}

async function dragLetterToCell(page, letter, row, col) {
  await page
    .locator(".letter-tile:not(.is-used)")
    .filter({ hasText: new RegExp(`^${letter}$`) })
    .first()
    .dragTo(page.locator(`.grid-cell[data-row="${row}"][data-col="${col}"]`));
}

async function touchDragLetterToCell(page, letter, row, col) {
  const tile = page
    .locator(".letter-tile:not(.is-used)")
    .filter({ hasText: new RegExp(`^${letter}$`) })
    .first();
  const target = page.locator(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
  const tileBox = await tile.boundingBox();
  const targetBox = await target.boundingBox();
  expect(tileBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  const start = {
    clientX: tileBox.x + tileBox.width / 2,
    clientY: tileBox.y + tileBox.height / 2
  };
  const end = {
    clientX: targetBox.x + targetBox.width / 2,
    clientY: targetBox.y + targetBox.height / 2
  };
  const startTouch = { identifier: 1, ...start };
  const endTouch = { identifier: 1, ...end };

  await tile.dispatchEvent("touchstart", {
    bubbles: true,
    cancelable: true,
    touches: [startTouch],
    changedTouches: [startTouch]
  });
  await tile.dispatchEvent("touchmove", {
    bubbles: true,
    cancelable: true,
    touches: [endTouch],
    changedTouches: [endTouch]
  });
  await tile.dispatchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    touches: [],
    changedTouches: [endTouch]
  });
}

test.describe("c13 vocabulary crossword", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("rejects wrong drag drops and keeps click entry working", async ({ page }) => {
    await page.goto("/c13/vocabulary-crossword.html", { waitUntil: "domcontentloaded" });

    await dragLetterToCell(page, "가", 0, 2);
    await expectCellText(page, 0, 2, "");
    await expect(page.locator(".letter-tile.is-used").filter({ hasText: /^가$/ })).toHaveCount(0);
    await expect(page.locator("#word-track-hint")).toHaveText("맞는 칸에 놓아 보세요.");

    await dragLetterToCell(page, "동", 0, 2);
    await expectCellText(page, 0, 2, "동");
    await expect(page.locator(".letter-tile.is-used").filter({ hasText: /^동$/ })).toHaveCount(1);

    await clickLetters(page, "창회");
    await expectTrackText(page, "동창회");
    await expect(page.locator("#word-track-hint")).toContainText("동창회 완성");
  });

  test("uses particle-preserving answers for core expressions", async ({ page }) => {
    await page.goto("/c13/vocabulary-crossword.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".set-tab")).toHaveCount(5);

    await page.locator(".set-tab", { hasText: "준비" }).click();
    await page.locator('.grid-cell[data-row="1"][data-col="5"]').click();
    await expect(page.locator("#word-track-label")).toContainText("조사 포함");
    await expect(page.locator("[data-word-index]")).toHaveCount(5);

    await clickLetters(page, "방을꾸미다");
    await expectTrackText(page, "방을꾸미다");
    await expect(page.locator("#word-track-hint")).toContainText("(방을) 꾸미다 완성");

    await page.locator(".set-tab", { hasText: "차림" }).click();
    await page.locator('.grid-cell[data-row="0"][data-col="5"]').click();
    await expect(page.locator("#active-clue-text")).toHaveText("한글: 어깨에 배낭을 메다");
    await expect(page.locator("#word-track-label")).toContainText("조사 포함");

    await clickLetters(page, "배낭을메다");
    await expectTrackText(page, "배낭을메다");
    await expect(page.locator("#word-track-hint")).toContainText("(배낭을) 메다 완성");
  });

  test("main vocabulary card uses 메다 for the backpack expression", async ({ page }) => {
    await page.goto("/c13/vocabulary.html", { waitUntil: "domcontentloaded" });

    const backpackEntry = await page.evaluate(() => {
      return window.VOCABULARY_CONFIG.words.find((word) => word.id === "c13-vocab-20");
    });
    expect(backpackEntry.ko).toBe("(배낭을) 메다");

    await page.locator("#search-input").fill("배낭");
    await expect(page.locator(".word-card")).toHaveCount(1);
    await expect(page.locator(".word-card__front-headword")).toHaveText("(배낭을) 메다");
  });
});

test.describe("c13 vocabulary crossword mobile touch", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("does not consume a wrong tile on touch drag", async ({ page }) => {
    await page.goto("/c13/vocabulary-crossword.html", { waitUntil: "domcontentloaded" });
    await page.locator("#mobile-bank-toggle").click();

    await touchDragLetterToCell(page, "가", 0, 2);
    await expectCellText(page, 0, 2, "");
    await expect(page.locator(".letter-tile.is-used").filter({ hasText: /^가$/ })).toHaveCount(0);
    await expect(page.locator("#word-track-hint")).toHaveText("맞는 칸에 놓아 보세요.");
  });
});
