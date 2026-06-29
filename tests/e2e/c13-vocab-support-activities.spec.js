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
  { path: "/c13/vocab-support-wearing-match.html", title: "옷차림·착용 매칭" },
  { path: "/c13/vocab-support-learning.html", title: "유형별 어휘 배우기" }
];

const QUIZ_PAGES = [
  "/c13/vocab-support-events.html",
  "/c13/vocab-support-prep-actions.html",
  "/c13/vocab-support-amount.html",
  "/c13/vocab-support-wearing-match.html"
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
    await expect(page.locator(".support-activity-list .lesson-link").last()).toContainText("유형별 어휘 배우기");
    await page.locator('a[href="vocab-support-events.html"]').click();
    await expect(page).toHaveURL(/\/c13\/vocab-support-events\.html$/);
    await expect(page.locator("h1")).toHaveText("모임 이름 찾기");

    await page.goto("/c13/vocabulary.html", { waitUntil: "domcontentloaded" });
    await page.locator('a[href="vocab-support-amount.html"]').first().click();
    await expect(page).toHaveURL(/\/c13\/vocab-support-amount\.html$/);
    await expect(page.locator("h1")).toHaveText("양·충분함");
  });

  test("quiz pages no longer render the learning section", async ({ page }) => {
    for (const quizPage of QUIZ_PAGES) {
      await page.goto(quizPage, { waitUntil: "domcontentloaded" });
      await expect(page.locator("#learn-section")).toHaveCount(0);
      await expect(page.locator(".flow-nav")).not.toContainText("학습");
      await expect(page.locator("#practice-section")).toBeVisible();
      await expect(page.locator("#check-section")).toBeVisible();
    }
  });

  test("learning page gathers the study cards and links to quiz pages", async ({ page }) => {
    await page.goto("/c13/vocab-support-learning.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#events-learn")).toContainText("집들이");
    await expect(page.locator("#prep-learn")).toContainText("마련하다");
    await expect(page.locator("#amount-learn")).toContainText("부족하다");
    await expect(page.locator("#wearing-learn")).toContainText("배낭");
    await expect(page.locator('.support-footer a[href="vocab-support-wearing-match.html"]')).toContainText("착용 매칭 퀴즈");
    await expect(page.locator('a[href="vocab-support-wearing-verbs.html"]')).toContainText("착용 동사 자료 열기");
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

  test("prep activity loads before and after transform images", async ({ page }) => {
    await page.goto("/c13/vocab-support-prep-actions.html", { waitUntil: "domcontentloaded" });
    const failures = await page.evaluate(async () => {
      const urls = [...new Set([...document.querySelectorAll("[data-transform-image]")].flatMap((image) => [
        image.src,
        new URL(image.dataset.afterImage, window.location.href).href
      ]))];
      const results = await Promise.all(urls.map((url) => new Promise((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve({ url, ok: probe.naturalWidth > 0 && probe.naturalHeight > 0 });
        probe.onerror = () => resolve({ url, ok: false });
        probe.src = url;
      })));
      return results.filter((result) => !result.ok);
    });
    expect(failures).toEqual([]);
  });

  test("prep contrast section compares shared nouns across three verbs", async ({ page }) => {
    await page.goto("/c13/vocab-support-prep-actions.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#contrast-section")).toBeVisible();
    await expect(page.locator(".flow-nav")).toContainText("비교");
    await expect(page.locator("[data-contrast-card]")).toHaveCount(9);
    await expect(page.locator('[data-contrast-object="food"]')).toContainText("음식을 차리다");
    await expect(page.locator('[data-contrast-object="food"]')).toContainText("음식을 마련하다");
    await expect(page.locator('[data-contrast-object="food"]')).toContainText("음식을 대접하다");
    await expect(page.locator('[data-contrast-object="meal"]')).toContainText("식사를 대접하다");
    await expect(page.locator('[data-contrast-object="refreshments"]')).toContainText("다과를 마련하다");
    await expect(page.locator('[data-contrast-card="food-set"] img')).toHaveAttribute("src", /prep-actions-overlap\/food-set\.webp$/);
  });

  test("prep activity transforms object images by applying verbs", async ({ page }) => {
    await page.goto("/c13/vocab-support-prep-actions.html", { waitUntil: "domcontentloaded" });

    const gift = page.locator('[data-transform-card="gift"]');
    const giftImage = gift.locator("[data-transform-image]");
    await expect(giftImage).toHaveAttribute("src", /before\/gift\.webp$/);

    await page.locator('[data-transform-verb="set"]').click();
    await gift.click();
    await expect(page.locator(".transform-feedback")).toHaveClass(/is-wrong/);
    await expect(giftImage).toHaveAttribute("src", /before\/gift\.webp$/);

    await page.locator('[data-transform-verb="prepare"]').click();
    await gift.click();
    await expect(page.locator(".transform-feedback")).toHaveClass(/is-correct/);
    await expect(giftImage).toHaveAttribute("src", /after\/gift\.webp$/);
    await expect(gift.locator("[data-transform-phrase]")).toContainText("선물을 마련하다");

    await page.locator('[data-transform-verb="set"]').dragTo(page.locator('[data-transform-card="low-table"]'));
    await expect(page.locator('[data-transform-card="low-table"] [data-transform-image]')).toHaveAttribute("src", /after\/low-table\.webp$/);
    await expect(page.locator('[data-transform-card="low-table"] [data-transform-phrase]')).toContainText("상을 차리다");

    await page.locator('[data-transform-verb="decorate"]').click();
    await page.locator('[data-transform-card="room"]').click();
    await expect(page.locator('[data-transform-card="room"] [data-transform-phrase]')).toContainText("방을 꾸미다");

    await page.locator('[data-transform-verb="treat"]').click();
    await page.locator('[data-transform-card="guest"]').click();
    await expect(page.locator('[data-transform-card="guest"] [data-transform-phrase]')).toContainText("손님을 대접하다");
  });

  test("prep check transforms an image and updates score", async ({ page }) => {
    await page.goto("/c13/vocab-support-prep-actions.html", { waitUntil: "domcontentloaded" });
    const card = page.locator('[data-question-id="check-gift"]');
    await expect(card.locator("[data-transform-image]")).toHaveAttribute("src", /before\/gift\.webp$/);
    await card.locator(".answer-option", { hasText: "마련하다" }).click();
    await expect(card.locator(".feedback")).toHaveClass(/is-correct/);
    await expect(card.locator("[data-transform-image]")).toHaveAttribute("src", /after\/gift\.webp$/);
    await expect(card.locator("[data-transform-phrase]")).toContainText("선물을 마련하다");
    await expect(page.locator('[data-score-for="check"] .score-value')).toHaveText("1");
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
