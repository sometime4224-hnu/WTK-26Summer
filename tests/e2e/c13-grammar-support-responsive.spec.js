const { test, expect } = require("@playwright/test");

const miniGamePages = [
  "grammar1-mini-game.html",
  "grammar2-mini-game.html",
  "grammar1-2-mini-game.html"
];

const supportPages = [
  ...miniGamePages,
  "grammar1-2-speaking.html",
  "grammar1-3-quiz.html"
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet-landscape", width: 1180, height: 820, isMobile: true, hasTouch: true },
  { name: "phone-portrait", width: 390, height: 844, isMobile: true, hasTouch: true }
];

async function blockAnalytics(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
}

async function openSupportPage(page, file) {
  await page.goto(`/c13/${file}`, { waitUntil: "networkidle" });
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("c13 grammar support responsive layout", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
  });

  for (const viewport of viewports) {
    test(`has no horizontal overflow at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const file of supportPages) {
        await openSupportPage(page, file);
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("puts mobile activity surfaces near the top", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const file of miniGamePages) {
      await openSupportPage(page, file);
      const top = await page.locator("#gameCard").evaluate((node) => Math.round(node.getBoundingClientRect().top));
      expect(top, `${file} #gameCard top`).toBeLessThanOrEqual(220);
    }

    await openSupportPage(page, "grammar1-3-quiz.html");
    const quizTop = await page.locator("#quizPanel").evaluate((node) => Math.round(node.getBoundingClientRect().top));
    expect(quizTop).toBeLessThanOrEqual(320);

    await openSupportPage(page, "grammar1-2-speaking.html");
    const workspaceTop = await page.locator("#workspace").evaluate((node) => Math.round(node.getBoundingClientRect().top));
    expect(workspaceTop).toBeLessThanOrEqual(430);
  });

  for (const viewport of viewports.filter((item) => item.name !== "phone-portrait")) {
    test(`uses two-column mini-game work area at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const file of miniGamePages) {
        await openSupportPage(page, file);
        const layout = await page.evaluate(() => {
          const visual = document.querySelector(".c13-mini-visual").getBoundingClientRect();
          const work = document.querySelector(".c13-mini-work").getBoundingClientRect();
          const firstChoice = document.querySelector("[data-choice]").getBoundingClientRect();
          return {
            visualRight: Math.round(visual.right),
            workLeft: Math.round(work.left),
            topDelta: Math.abs(Math.round(visual.top - work.top)),
            firstChoiceTop: Math.round(firstChoice.top)
          };
        });
        expect(layout.workLeft, `${file} work column`).toBeGreaterThan(layout.visualRight - 4);
        expect(layout.topDelta, `${file} column alignment`).toBeLessThanOrEqual(24);
        expect(layout.firstChoiceTop, `${file} first choice visible`).toBeLessThan(viewport.height);
      }
    });
  }
});

test.describe("c13 grammar support smoke interactions", () => {
  test.beforeEach(async ({ page }) => {
    await blockAnalytics(page);
  });

  for (const file of miniGamePages) {
    test(`${file} selects, checks, and advances`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openSupportPage(page, file);

      await page.locator("[data-choice]").first().click();
      await page.locator("#confirmBtn").click();
      await expect(page.locator("#feedbackBox")).toBeVisible();
      await expect(page.locator("#nextBtn")).toBeEnabled();

      await page.locator("#nextBtn").click();
      await expect(page.locator("#gameCard")).toContainText(/2 \//);
    });
  }

  test("fusion quiz handles choice and short answer flows", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSupportPage(page, "grammar1-3-quiz.html");

    let sawChoice = false;
    let sawShort = false;

    for (let i = 0; i < 20 && (!sawChoice || !sawShort); i += 1) {
      if (await page.locator("#shortWrap").isVisible()) {
        sawShort = true;
        await page.locator("#shortInput").fill("연습 답안");
        await page.locator("#checkShortBtn").click();
      } else {
        sawChoice = true;
        await page.locator("#choices button").first().click();
      }

      await expect(page.locator("#feedbackBox")).toBeVisible();
      await expect(page.locator("#nextBtn")).toBeVisible();

      if (!sawChoice || !sawShort) {
        await page.locator("#nextBtn").click();
      }
    }

    expect(sawChoice).toBe(true);
    expect(sawShort).toBe(true);
  });

  test("fusion speaking supports token build and no speech-recognition fallback", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "SpeechRecognition", { value: undefined, configurable: true });
      Object.defineProperty(window, "webkitSpeechRecognition", { value: undefined, configurable: true });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await openSupportPage(page, "grammar1-2-speaking.html");

    for (let stage = 0; stage < 2; stage += 1) {
      const tokens = await page.locator("[data-token]").all();
      for (const token of tokens) {
        await token.click();
      }
      await page.locator("#checkDraftBtn").click();
      await expect(page.locator("#nextStageBtn")).toBeEnabled();
      await page.locator("#nextStageBtn").click();
    }

    await expect(page.locator("#workspace")).toContainText("이 브라우저에서는 음성 인식을 사용할 수 없습니다.");
  });
});
