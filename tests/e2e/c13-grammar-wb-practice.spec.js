const { test, expect } = require("@playwright/test");

const pages = [
  {
    path: "/c13/grammar3-wb-practice.html",
    title: "A/V-았/었어야 했는데 WB 보조활동",
    sample: "더 일찍 왔어야 했는데..."
  },
  {
    path: "/c13/grammar4-wb-practice.html",
    title: "V-도록 WB 보조활동",
    sample: "건강해지도록 열심히 운동하세요."
  }
];

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("c13 grammar WB subjective practice", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  for (const target of pages) {
    test(`${target.path} is responsive and uses example-only checking`, async ({ page }) => {
      const viewports = [
        { width: 1280, height: 900 },
        { width: 390, height: 844 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(target.path, { waitUntil: "domcontentloaded" });

        await expect(page.locator("h1")).toContainText(target.title);
        await expect(page.locator(".stage-tab")).toHaveCount(4);
        await expect(page.locator("#answerInput")).toBeVisible();
        await expect(page.locator("#checkAnswerBtn")).toBeDisabled();
        await expectNoHorizontalOverflow(page);

        await page.locator("#answerInput").fill(target.sample);
        await expect(page.locator("#checkAnswerBtn")).toBeEnabled();
        await page.locator("#checkAnswerBtn").click();

        await expect(page.locator(".example-panel")).toBeVisible();
        await expect(page.locator(".example-panel")).toContainText("가능한 답변 예시");
        await expect(page.locator(".stored-answer")).toContainText(target.sample);
        await expect(page.locator(".example-panel")).not.toContainText("오답");
        await expect(page.locator(".example-panel")).not.toContainText("정답");

        await page.locator("#nextTaskBtn").click();
        await expect(page.locator(".status-pill").first()).toContainText("2 /");
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("learners can jump stages without being blocked by grading", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c13/grammar4-wb-practice.html", { waitUntil: "domcontentloaded" });

    await page.locator('[data-stage-index="2"]').click();
    await expect(page.locator("h2")).toContainText("시간·정도");
    await expect(page.locator("#nextTaskBtn")).toBeEnabled();
    await page.locator("#nextTaskBtn").click();
    await expect(page.locator(".status-pill").first()).toContainText("2 / 4");
  });
});
