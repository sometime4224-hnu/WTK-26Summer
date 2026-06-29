const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

async function expectImagesLoaded(page) {
  const images = page.locator("main img");
  const count = await images.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(async () => image.evaluate((node) => node.complete && node.naturalWidth > 0 && node.naturalHeight > 0)).toBe(true);
  }
}

const SUPPORT_PAGES = [
  { path: "/c13/vocab-support-events.html", title: "모임 이름 찾기" },
  { path: "/c13/vocab-support-prep-actions.html", title: "준비·대접 동작" },
  { path: "/c13/vocab-support-amount.html", title: "양·충분함" },
  { path: "/c13/vocab-support-wearing-match.html", title: "옷차림·착용 매칭" }
];

test.describe("c13 vocabulary support activities", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("loads all support pages and their images", async ({ page }) => {
    for (const supportPage of SUPPORT_PAGES) {
      await page.goto(supportPage.path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toHaveText(supportPage.title);
      await expectImagesLoaded(page);
    }
  });

  test("links support pages from the c13 hub and vocabulary page", async ({ page }) => {
    await page.goto("/c13/index.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".support-activity-group")).not.toHaveAttribute("open", "");
    await expect(page.locator('a[href="vocab-support-events.html"]')).toBeHidden();
    await page.locator(".support-activity-group summary").click();
    await expect(page.locator(".support-activity-group")).toHaveAttribute("open", "");
    await expect(page.locator(".support-activity-list .lesson-link")).toHaveCount(5);
    await page.locator('a[href="vocab-support-events.html"]').click();
    await expect(page).toHaveURL(/\/c13\/vocab-support-events\.html$/);
    await expect(page.locator("h1")).toHaveText("모임 이름 찾기");

    await page.goto("/c13/vocabulary.html", { waitUntil: "domcontentloaded" });
    await page.locator('a[href="vocab-support-amount.html"]').first().click();
    await expect(page).toHaveURL(/\/c13\/vocab-support-amount\.html$/);
    await expect(page.locator("h1")).toHaveText("양·충분함");
  });

  test("event activity gives feedback for wrong and correct choices", async ({ page }) => {
    await page.goto("/c13/vocab-support-events.html", { waitUntil: "domcontentloaded" });
    const card = page.locator('[data-question-id="practice-housewarming"]');

    await card.locator(".answer-option", { hasText: "돌잔치" }).click();
    await expect(card.locator(".feedback")).toHaveClass(/is-wrong/);

    await card.locator(".answer-option", { hasText: "집들이" }).click();
    await expect(card.locator(".feedback")).toHaveClass(/is-correct/);
    await expect(card.locator(".feedback")).toContainText("집들이");
  });

  test("prep activity sorts representative objects by verb meaning", async ({ page }) => {
    await page.goto("/c13/vocab-support-prep-actions.html", { waitUntil: "domcontentloaded" });

    await page.locator('[data-match-card="gift"]').click();
    await page.locator('[data-match-target="set"]').click();
    await expect(page.locator(".match-feedback")).toHaveClass(/is-wrong/);
    await page.locator('[data-match-target="prepare"]').click();
    await expect(page.locator('[data-match-target="prepare"] .placed-chip')).toContainText("선물");

    await page.locator('[data-match-card="low-table"]').click();
    await page.locator('[data-match-target="set"]').click();
    await expect(page.locator('[data-match-target="set"] .placed-chip')).toContainText("상");

    await page.locator('[data-match-card="guest"]').click();
    await page.locator('[data-match-target="treat"]').click();
    await expect(page.locator('[data-match-target="treat"] .placed-chip')).toContainText("손님");
  });

  test("amount activity distinguishes short quantity and leftovers", async ({ page }) => {
    await page.goto("/c13/vocab-support-amount.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-question-id="check-cups-short"]')).toContainText("필요 6개");
    await expect(page.locator('[data-question-id="check-cups-short"]')).toContainText("있음 4개");

    const shortCard = page.locator('[data-question-id="check-cups-short"]');
    await shortCard.locator(".answer-option", { hasText: "모자라다" }).click();
    await expect(shortCard.locator(".feedback")).toHaveClass(/is-correct/);

    const leftoverCard = page.locator('[data-question-id="check-party-leftovers"]');
    await leftoverCard.locator(".answer-option", { hasText: "남다" }).click();
    await expect(leftoverCard.locator(".feedback")).toHaveClass(/is-correct/);
  });

  test("wearing activity matches confusing wearing verbs", async ({ page }) => {
    await page.goto("/c13/vocab-support-wearing-match.html", { waitUntil: "domcontentloaded" });

    await page.locator('[data-match-card="necktie"]').click();
    await page.locator('[data-match-target="tie"]').click();
    await expect(page.locator('[data-match-target="tie"] .placed-chip')).toContainText("넥타이");

    await page.locator('[data-match-card="backpack"]').click();
    await page.locator('[data-match-target="shoulder"]').click();
    await expect(page.locator('[data-match-target="shoulder"] .placed-chip')).toContainText("배낭");

    await page.locator('[data-match-card="bag"]').click();
    await page.locator('[data-match-target="hold"]').click();
    await expect(page.locator('[data-match-target="hold"] .placed-chip')).toContainText("가방");
  });
});

test.describe("c13 vocabulary support activities mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  for (const supportPage of SUPPORT_PAGES) {
    test(`${supportPage.title} has no horizontal overflow on phone width`, async ({ page }) => {
      await page.goto(supportPage.path, { waitUntil: "domcontentloaded" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }
});
