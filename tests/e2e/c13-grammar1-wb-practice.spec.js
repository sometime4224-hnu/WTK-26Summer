const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://www.google-analytics.com/**", (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe("c13 grammar1 WB practice", () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test("is responsive and puts the first learning action near the top", async ({ page }) => {
    const viewports = [
      { width: 1280, height: 900 },
      { width: 390, height: 844 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/c13/grammar1-wb-practice.html", { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toContainText("A/V-(으)ㄹ까 봐");
      await expect(page.locator("#stageMatch")).toBeVisible();
      await expect(page.locator("[data-worry]").first()).toBeVisible();
      await expect(page.locator("#matchGuideTitle")).toContainText("걱정 카드 선택");
      await expect(page.locator("#worryColumn")).toHaveClass(/is-guide-target/);
      await expectNoHorizontalOverflow(page);

      const firstActionTop = await page.locator("#stageMatch").evaluate((node) => Math.round(node.getBoundingClientRect().top));
      expect(firstActionTop).toBeLessThanOrEqual(viewport.width < 600 ? 280 : 260);
    }
  });

  test("runs match, dialogue, and blank stages", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c13/grammar1-wb-practice.html", { waitUntil: "domcontentloaded" });

    const pairs = [
      [/음식이 너무 많이 남을 수 있어요/, /음식을 조금만 준비했어요/],
      [/장소가 좁을 수 있어요/, /더 넓은 장소를 빌렸어요/],
      [/건강에 나쁠 수 있어요/, /담배를 피우지 않아요/],
      [/시험이 어려울 수 있어요/, /미리 열심히 공부해요/],
      [/재료가 부족할 수 있어요/, /재료를 충분히 준비했어요/]
    ];

    for (const [worry, action] of pairs) {
      await page.getByRole("button", { name: worry }).click();
      await expect(page.locator("#matchGuideTitle")).toContainText("준비 행동 선택");
      await expect(page.locator("#actionColumn")).toHaveClass(/is-guide-target/);
      await page.getByRole("button", { name: action }).click();
      await expect(page.locator("#matchFeedback")).toHaveClass(/ok/);
    }
    await expect(page.locator("#matchStatus")).toContainText("5 / 5");
    await expect(page.locator('[data-stage-tab="dialogue"]')).toHaveClass(/is-guide-target/);

    await page.locator('[data-stage-tab="dialogue"]').click();
    await expect(page.locator("#dialogueGuideTitle")).toContainText("빈칸 입력");
    await expect(page.locator("#dialogueInput")).toHaveClass(/is-guide-target/);
    const dialogueAnswers = [
      "모자랄까 봐서요",
      "필요할까 봐서요",
      "못 일어날까 봐서요",
      "배탈이 날까 봐서요",
      "실수할까 봐"
    ];

    for (let index = 0; index < dialogueAnswers.length; index += 1) {
      await page.locator("#dialogueInput").fill(dialogueAnswers[index]);
      await expect(page.locator("#dialogueCheck")).toHaveClass(/is-guide-target/);
      await page.locator("#dialogueForm button").click();
      await expect(page.locator("#dialogueFeedback")).toHaveClass(/ok/);
      if (index < dialogueAnswers.length - 1) {
        await expect(page.locator("#dialogueNext")).toHaveClass(/is-guide-target/);
        await page.locator("#dialogueNext").click();
      }
    }
    await expect(page.locator('[data-stage-tab="blank"]')).toHaveClass(/is-guide-target/);

    await page.locator('[data-stage-tab="blank"]').click();
    await expect(page.locator("#blankGuideTitle")).toContainText("빈칸 입력");
    await expect(page.locator('[data-blank-input="0"]')).toHaveClass(/is-guide-target/);
    const blankAnswers = ["떨어질까", "졸까", "아플까", "걱정하실까", "떠날까", "잘 못할까"];
    for (let index = 0; index < blankAnswers.length; index += 1) {
      await page.locator(`[data-blank-input="${index}"]`).fill(blankAnswers[index]);
    }
    await expect(page.locator("#checkBlanks")).toHaveClass(/is-guide-target/);
    await page.locator("#checkBlanks").click();
    await expect(page.locator("#blankFeedback")).toHaveClass(/ok/);
    await expect(page.locator("#completeBox")).toBeVisible();
    await expect(page.locator("#completeBox")).toHaveClass(/is-guide-target/);
    await expect(page.locator("#overallText")).toContainText("16 / 16");
  });
});
