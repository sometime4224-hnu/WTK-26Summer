const { test, expect } = require("@playwright/test");

const SUPPORT_PAGES = [
  "vocab-support-rumor-contrast.html",
  "vocab-support-meaning-map.html"
];

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
});

test("c17 hub and vocabulary page expose both infographic support pages", async ({ page }) => {
  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="vocab-support-rumor-contrast.html"]:visible')).toHaveCount(1);
  await expect(page.locator('a[href="vocab-support-meaning-map.html"]:visible')).toHaveCount(1);
  await expect(page.getByText("소문 동작 비교 인포그래픽", { exact: true })).toBeVisible();
  await expect(page.getByText("상황으로 보는 핵심 어휘 4개", { exact: true })).toBeVisible();

  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="vocab-support-rumor-contrast.html"]')).toHaveText("소문도식");
  await expect(page.locator('.topbar a[href="vocab-support-meaning-map.html"]')).toHaveText("뜻도식");
});

test("rumor infographic makes state change and human action contrasts explicit", async ({ page }) => {
  await page.goto("/c17/vocab-support-rumor-contrast.html", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("소문이 움직이나, 사람이 움직이나?");
  for (const expression of ["소문이 나다", "소문을 내다", "소문이 퍼지다", "소문을 퍼뜨리다"]) {
    await expect(page.getByText(expression, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/이\/가.*소문에 일어난 변화/)).toBeVisible();
  await expect(page.getByText(/을\/를.*사람이 소문에 한 행동/)).toBeVisible();
  await expect(page.locator('img[src*="rumor-contrast.svg"]')).toHaveAttribute("alt", /화살표|장면|도식/);
});

test("meaning map gives each target word one clear visual rule", async ({ page }) => {
  await page.goto("/c17/vocab-support-meaning-map.html", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("상황을 보면 뜻이 보여요");
  await expect(page.locator(".meaning-card")).toHaveCount(4);
  for (const word of ["우연히", "솔직히", "실망하다", "오해하다"]) {
    await expect(page.getByRole("heading", { level: 2, name: word, exact: true })).toBeVisible();
  }
  await expect(page.getByText("계획 없음 + 뜻밖에 일어남", { exact: true })).toBeVisible();
  await expect(page.getByText("속마음 = 말한 내용", { exact: true })).toBeVisible();
  await expect(page.getByText("기대 ≠ 실제 → 마음이 상함", { exact: true })).toBeVisible();
  await expect(page.getByText("실제 사실 ≠ 내가 이해한 내용", { exact: true })).toBeVisible();
});

for (const viewport of [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 720, height: 450 },
  { width: 1440, height: 900 }
]) {
  test(`infographic pages fit ${viewport.width}x${viewport.height} without clipping`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const filename of SUPPORT_PAGES) {
      const pageErrors = [];
      const onPageError = (error) => pageErrors.push(error.message);
      page.on("pageerror", onPageError);
      await page.goto(`/c17/${filename}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));

      const audit = await page.evaluate(() => {
        const cue = document.querySelector("#first-reading-cue")?.getBoundingClientRect();
        const images = Array.from(document.images);
        return {
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          cueBottom: cue?.bottom ?? Infinity,
          brokenImages: images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          missingAlt: images.filter((image) => !image.alt.trim()).length
        };
      });

      expect(pageErrors, filename).toEqual([]);
      expect(audit.horizontalOverflow, filename).toBe(false);
      expect(audit.brokenImages, filename).toEqual([]);
      expect(audit.missingAlt, filename).toBe(0);
      expect(audit.cueBottom, filename).toBeLessThanOrEqual(viewport.height);
      page.off("pageerror", onPageError);
    }
  });
}
