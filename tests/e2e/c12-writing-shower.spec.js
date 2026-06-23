const { test, expect } = require("@playwright/test");

async function expectFocused(page, id) {
  await expect
    .poll(() => page.evaluate(() => document.activeElement && document.activeElement.id))
    .toBe(id);
}

async function resetStorage(page) {
  await page.evaluate(() => {
    localStorage.removeItem("c12_writing_shower_v1");
    localStorage.removeItem("preferred-lang");
  });
  await page.reload();
}

async function submitAnswer(page, text) {
  await page.locator("#answerInput").fill(text);
  await page.keyboard.press("Control+Enter");
}

test.describe("c12 writing shower", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-shower.html");
    await resetStorage(page);
  });

  test("loads the three-level, eighteen-stage writing shower", async ({ page }) => {
    await expect(page).toHaveTitle("12과 쓰기 소나기");
    await expect(page.locator('[data-level-button="basic"]')).toContainText("초급");
    await expect(page.locator('[data-level-button="middle"]')).toContainText("중급");
    await expect(page.locator('[data-level-button="advanced"]')).toContainText("고급");
    await expect(page.locator(".stage-chip")).toHaveCount(18);
    await expect(page.locator("#missionTitle")).toHaveText("초급 쓰기");
    await expect(page.locator("#cueText")).toContainText("운동을 해야 하는 이유");
    await expect(page.locator("#progressText")).toHaveText("1 / 5");
    await expectFocused(page, "answerInput");

    const model = await page.evaluate(() => window.__C12_WRITING_SHOWER__.getLevels());
    expect(model).toHaveLength(3);
    expect(model.flatMap((level) => level.stages)).toHaveLength(18);
    expect(model.flatMap((level) => level.stages.flatMap((stage) => stage.prompts))).toHaveLength(90);
  });

  test("blocks answers shorter than the current minimum", async ({ page }) => {
    await submitAnswer(page, "짧다");
    await expect(page.locator("#feedbackText")).toContainText("조금 더 써 보세요");
    await expect(page.locator("#progressText")).toHaveText("1 / 5");
    await expect(page.locator("#basketCount")).toHaveText("0개");
    await expectFocused(page, "answerInput");
  });

  test("saves an answer with Ctrl+Enter and restores it from localStorage", async ({ page }) => {
    await submitAnswer(page, "운동은 건강을 유지하는 데 도움이 됩니다.");
    await expect(page.locator("#progressText")).toHaveText("2 / 5");
    await expect(page.locator("#basketCount")).toHaveText("1개");
    await expect(page.locator("#basketList")).toContainText("운동은 건강을 유지하는 데 도움이 됩니다.");

    await page.reload();
    await expect(page.locator("#progressText")).toHaveText("2 / 5");
    await expect(page.locator("#basketCount")).toHaveText("1개");
    await expect(page.locator("#basketList")).toContainText("운동은 건강을 유지하는 데 도움이 됩니다.");
    await expectFocused(page, "answerInput");
  });

  test("keeps multilingual helper selection across prompt changes", async ({ page }) => {
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator('[data-lang="en"].lang-visible')).toHaveCount(0);

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('[data-lang="en"].lang-visible')).toContainText("Write one simple reason");

    await submitAnswer(page, "저는 건강을 유지하기 위해서 운동을 합니다.");
    await expect(page.locator("#progressText")).toHaveText("2 / 5");
    await expect(page.locator('[data-lang="en"].lang-visible')).toContainText("Write one easy action");

    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('[data-lang="ar"].lang-visible')).toHaveAttribute("dir", "rtl");
  });

  test("moves between levels and shows the learning report", async ({ page }) => {
    await page.locator('[data-level-button="advanced"]').click();
    await expect(page.locator("#missionTitle")).toHaveText("고급 쓰기");
    await expect(page.locator("#cueText")).toContainText("바빠서 운동을 못 하는 사람");

    await submitAnswer(page, "요즘 너무 바빠서 운동할 시간이 없으면 정말 힘들 수 있습니다.");
    await expect(page.locator("#basketCount")).toHaveText("1개");
    await page.locator("#reportButton").click();
    await expect(page.locator("#reportPanel")).toBeVisible();
    await expect(page.locator("#reportTotal")).toHaveText("1");
    await expect(page.locator("#reportAdvanced")).toHaveText("1");
    await expect(page.locator("#reviewList")).toContainText("0/5개 저장");
  });

  test("is linked from the C12 writing area and the typing hub", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-shower.html"]');
    await expect(c12Link).toHaveCount(1);
    await expect(c12Link).toContainText("12과 쓰기 소나기");
    await c12Link.click();
    await expect(page).toHaveURL(/\/c12\/writing-shower\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("초급 쓰기");

    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    const hubLink = page.locator('[data-hub-link="c12-writing-shower"]');
    await expect(hubLink).toHaveCount(1);
    await expect(hubLink).toContainText("12과 쓰기 소나기");
    await hubLink.click();
    await expect(page).toHaveURL(/\/c12\/writing-shower\.html$/);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-shower.html");
    await resetStorage(page);
    await expect(page.locator("#missionTitle")).toBeVisible();
    await expect(page.locator(".stage-chip")).toHaveCount(18);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
