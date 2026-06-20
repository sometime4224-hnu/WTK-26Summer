const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
}

async function openCheckup(page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto("/c12/vocab-support-body-condition.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("c12-body-condition-checkup");
    window.__C12_BODY_CONDITION__.reset();
  });
  await expect(page.locator("h1")).toHaveText("몸상태 체크업");
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  )).toBe(true);
}

test("c12 hub links to the body condition checkup activity", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c12/index.html", { waitUntil: "domcontentloaded" });

  const link = page.locator('a[href="vocab-support-body-condition.html"]');
  await page.locator(".support-drawer__summary").click();
  await expect(link).toBeVisible();
  await expect(link).toContainText("몸상태 체크업");
});

test("c12 hub keeps vocabulary support activities collapsed by default", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c12/index.html", { waitUntil: "domcontentloaded" });

  const drawer = page.locator("details.support-drawer").first();
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toHaveAttribute("open", "");
  await expect(page.locator('a[href="vocab-support-body-condition.html"]')).not.toBeVisible();

  await page.locator(".support-drawer__summary").click();
  await expect(drawer).toHaveAttribute("open", "");
  await expect(page.locator('a[href="vocab-support-body-condition.html"]')).toBeVisible();
});

for (const scenario of [
  { name: "small phone", viewport: { width: 360, height: 640 } },
  { name: "regular phone", viewport: { width: 390, height: 844 } },
  { name: "tablet landscape", viewport: { width: 1024, height: 768 } },
  { name: "desktop", viewport: { width: 1366, height: 768 } },
]) {
  test(`body condition checkup avoids horizontal overflow on ${scenario.name}`, async ({ page }) => {
    await openCheckup(page, scenario.viewport);
    await expectNoHorizontalOverflow(page);
  });
}

test("diagnosis cards show correct and wrong feedback", async ({ page }) => {
  await openCheckup(page);
  await page.evaluate(() => {
    window.__C12_BODY_CONDITION__.startWithQuestions([{
      id: "fixed-heavy",
      image: "body-heavy",
      text: "몸이 둔하고 움직이기 힘들어요.",
      answer: "몸이 무겁다",
      choices: ["몸이 가볍다", "몸이 무겁다", "기운이 없다", "자세가 좋다"],
      explain: "몸이 둔하고 피곤하게 느껴질 때는 몸이 무겁다를 써요."
    }]);
  });

  await page.locator('[data-option="몸이 가볍다"]').click();
  await expect(page.locator("#feedback")).toContainText("정답: 몸이 무겁다");
  await expect(page.locator('[data-option="몸이 무겁다"]')).toHaveClass(/is-correct/);

  await page.evaluate(() => {
    window.__C12_BODY_CONDITION__.startWithQuestions([{
      id: "fixed-heavy",
      image: "body-heavy",
      text: "몸이 둔하고 움직이기 힘들어요.",
      answer: "몸이 무겁다",
      choices: ["몸이 가볍다", "몸이 무겁다", "기운이 없다", "자세가 좋다"],
      explain: "몸이 둔하고 피곤하게 느껴질 때는 몸이 무겁다를 써요."
    }]);
  });
  await page.locator('[data-option="몸이 무겁다"]').click();
  await expect(page.locator("#feedback")).toContainText("정답!");
});

test("diagnosis choices are shuffled when a question starts", async ({ page }) => {
  await openCheckup(page);

  const renderedChoices = await page.evaluate(() => {
    const originalRandom = Math.random;
    try {
      Math.random = () => 0;
      window.__C12_BODY_CONDITION__.startWithQuestions([{
        id: "shuffle-heavy",
        image: "body-heavy",
        text: "몸이 둔하고 움직이기 힘들어요.",
        answer: "몸이 무겁다",
        choices: ["몸이 무겁다", "몸이 가볍다", "기운이 없다", "자세가 좋다"],
        explain: "테스트 설명"
      }]);
      return window.__C12_BODY_CONDITION__.getRenderedChoices();
    } finally {
      Math.random = originalRandom;
    }
  });

  expect(renderedChoices).toEqual(expect.arrayContaining(["몸이 무겁다", "몸이 가볍다", "기운이 없다", "자세가 좋다"]));
  expect(renderedChoices[0]).not.toBe("몸이 무겁다");
});

test("auto advance moves after three seconds and can be toggled off", async ({ page }) => {
  await openCheckup(page);
  await page.evaluate(() => {
    window.__C12_BODY_CONDITION__.startWithQuestions([
      {
        id: "auto-first",
        image: "body-heavy",
        text: "첫 번째 자동 문제",
        answer: "몸이 무겁다",
        choices: ["몸이 무겁다", "몸이 가볍다", "기운이 없다", "자세가 좋다"],
        explain: "테스트 설명"
      },
      {
        id: "auto-second",
        image: "breathless",
        text: "두 번째 자동 문제",
        answer: "숨이 차다",
        choices: ["숨이 차다", "땀이 나다", "몸이 좋아지다", "기분이 상쾌하다"],
        explain: "테스트 설명"
      }
    ]);
  });

  await expect(page.locator("#auto-advance-toggle")).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-option="몸이 무겁다"]').click();
  await expect(page.locator("#feedback")).toContainText("3초 후 다음 카드");
  await expect(page.locator("#question-text")).toHaveText("두 번째 자동 문제", { timeout: 4500 });

  await page.locator("#auto-advance-toggle").click();
  await expect(page.locator("#auto-advance-toggle")).toHaveAttribute("aria-pressed", "false");

  await page.evaluate(() => {
    window.__C12_BODY_CONDITION__.startWithQuestions([
      {
        id: "manual-first",
        image: "body-heavy",
        text: "자동 꺼짐 문제",
        answer: "몸이 무겁다",
        choices: ["몸이 무겁다", "몸이 가볍다", "기운이 없다", "자세가 좋다"],
        explain: "테스트 설명"
      },
      {
        id: "manual-second",
        image: "breathless",
        text: "넘어가면 안 되는 문제",
        answer: "숨이 차다",
        choices: ["숨이 차다", "땀이 나다", "몸이 좋아지다", "기분이 상쾌하다"],
        explain: "테스트 설명"
      }
    ]);
  });

  await page.locator('[data-option="몸이 무겁다"]').click();
  await expect(page.locator("#feedback")).toContainText("자동 넘김이 꺼져");
  await page.waitForTimeout(3200);
  await expect(page.locator("#question-text")).toHaveText("자동 꺼짐 문제");
});

test("opposite expression switch updates label and image", async ({ page }) => {
  await openCheckup(page);

  const energyCard = page.locator('[data-pair-card="energy"]');
  const label = energyCard.locator('[data-pair-label="energy"]');
  const image = energyCard.locator('[data-pair-image="energy"]');

  await expect(label).toHaveText("기운이 없다");
  await expect(image).toHaveAttribute("src", /energy-low\.webp/);

  await energyCard.locator('[data-pair-toggle="energy"]').click();
  await expect(label).toHaveText("기운이 나다");
  await expect(image).toHaveAttribute("src", /n10\.webp/);
});

test("condition report builds a sentence from selected body states", async ({ page }) => {
  await openCheckup(page);

  await page.locator('[data-report-id="body-heavy"]').click();
  await page.locator('[data-report-id="energy-low"]').click();

  await expect(page.locator("#report-output")).toHaveText("오늘은 몸이 무겁고 기운이 없어요.");
  await expect(page.locator('[data-report-id="body-heavy"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-report-id="energy-low"]')).toHaveAttribute("aria-pressed", "true");
});

test("activity data excludes movement vocabulary from diagnosis choices", async ({ page }) => {
  await openCheckup(page);

  const audit = await page.evaluate(() => {
    const api = window.__C12_BODY_CONDITION__;
    const forbidden = ["목을 돌리다", "팔을 뻗다", "다리를 벌리다", "발뒤꿈치를 들다"];
    const choices = api.getQuestions().flatMap((question) => question.choices);
    return {
      forbiddenInChoices: choices.filter((choice) => forbidden.includes(choice)),
      coreItems: api.getItems().filter((item) => !item.extensionOnly).map((item) => item.label)
    };
  });

  expect(audit.forbiddenInChoices).toEqual([]);
  expect(audit.coreItems).toEqual(expect.arrayContaining(["몸이 무겁다", "기운이 없다", "기운이 나다"]));
  expect(audit.coreItems).not.toEqual(expect.arrayContaining(["목을 돌리다", "팔을 뻗다"]));
});

test("all referenced images load", async ({ page }) => {
  await openCheckup(page);
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete));

  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.getAttribute("src"))
  );

  expect(brokenImages).toEqual([]);
});
