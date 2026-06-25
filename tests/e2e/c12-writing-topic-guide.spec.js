const { test, expect } = require("@playwright/test");

test.describe("C12 manuscript-paper writing prompt guide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-topic-guide.html");
    await page.evaluate(() => localStorage.removeItem("c12_writing_topic_guide_v1"));
    await page.reload();
  });

  test("loads as a paper-writing prompt guide with multilingual controls", async ({ page }) => {
    await expect(page).toHaveTitle("12과 400~500자 생활 속 운동 제안 글쓰기 가이드");
    await expect(page.locator("h1")).toContainText("원고지에 쓰기 전에");
    await expect(page.locator(".scenario")).toContainText("생활 속에서 운동하기 어려운 사람들");
    await expect(page.locator(".goal-board")).toContainText("400~500자");
    await expect(page.locator(".goal-board")).toContainText("운동 방법");
    await expect(page.locator(".stage-goal")).toHaveCount(6);
    await expect(page.locator('[data-stage-button="stage-5"]')).toHaveText("문단 설계");
    await expect(page.locator('[data-stage-button="stage-6"]')).toHaveText("최종 점검");

    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(page.locator("input")).toHaveCount(0);
    await expect(page.locator("#saveStatus")).toHaveCount(0);
    await expect(page.locator("#totalCount")).toHaveCount(0);
    await expect(page.locator("#shortDraft")).toHaveCount(0);
    await expect(page.locator("#finalDraft")).toHaveCount(0);

    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator("[data-lang].lang-visible")).toHaveCount(0);

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('.lead [data-lang="en"].lang-visible')).toContainText("Do not type your essay");
    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('.lead [data-lang="ar"].lang-visible')).toHaveAttribute("dir", "rtl");
  });

  test("keeps Korean prompts while translating scaffold explanations", async ({ page }) => {
    const audienceCard = page.locator("#stage-1 .idea-card").first();
    await expect(audienceCard.locator("strong")).toHaveText("누구에게 보여 줄 글인가요?");
    await expect(audienceCard.locator(".scaffold-ko").first()).toContainText("운동을 해야 한다고");
    await expect(audienceCard.locator('[data-lang="en"].scaffold-lang').first()).toBeHidden();

    await page.locator('[data-multilang-btn="en"]').click();

    await expect(audienceCard.locator("strong")).toHaveText("누구에게 보여 줄 글인가요?");
    await expect(audienceCard.locator(".scaffold-ko").first()).toBeHidden();
    await expect(audienceCard.locator('[data-lang="en"].scaffold-lang').first()).toBeVisible();
    await expect(audienceCard).toContainText("Show it to people who think they should exercise");
    await expect(page.locator("#stage-1 .stage-goal")).toContainText("Before writing paragraph 1");
  });

  test("translates method and outline support without replacing Korean sentence frames", async ({ page }) => {
    await page.locator('[data-multilang-btn="en"]').click();

    await page.locator('[data-stage-button="stage-3"]').click();
    const stairsCard = page.locator("#stage-3 .idea-card").first();
    await expect(stairsCard.locator("strong")).toHaveText("계단 이용하기");
    await expect(stairsCard).toContainText("Using stairs instead of the elevator");
    await expect(stairsCard).toContainText("먼저 엘리베이터 대신 계단을 이용해 보세요.");

    await page.locator('[data-stage-button="stage-5"]').click();
    const firstParagraph = page.locator("[data-paragraph-card]").first();
    await expect(firstParagraph.locator(".question")).toHaveText("운동을 못하는 이유에는 무엇이 있나요?");
    await expect(firstParagraph).toContainText("요즘 사람들은 ... 때문에 운동할 시간이 부족합니다.");
    await expect(firstParagraph).toContainText("Choose one or two reasons");
    await expect(firstParagraph).toContainText("On the manuscript paper, first write who cannot exercise and why.");
  });

  test("shows rtl scaffold text for Arabic while preserving Korean labels", async ({ page }) => {
    await page.locator('[data-multilang-btn="ar"]').click();

    const audienceCard = page.locator("#stage-1 .idea-card").first();
    await expect(audienceCard.locator("strong")).toHaveText("누구에게 보여 줄 글인가요?");
    await expect(audienceCard.locator('[data-lang="ar"].scaffold-lang').first()).toBeVisible();
    await expect(audienceCard.locator('[data-lang="ar"].scaffold-lang').first()).toHaveAttribute("dir", "rtl");

    await page.locator('[data-stage-button="stage-6"]').click();
    await expect(page.locator(".phrase-panel")).toContainText("운동할 시간이 없더라도");
    await expect(page.locator('.phrase-panel [data-lang="ar"].phrase-gloss').first()).toBeVisible();
    await expect(page.locator('.phrase-panel [data-lang="ar"].phrase-gloss').first()).toHaveAttribute("dir", "rtl");
  });

  test("reveals each writing-preparation stage", async ({ page }) => {
    await expect(page.locator("#stage-1")).toBeVisible();
    await expect(page.locator("#stage-2")).toBeHidden();

    await page.locator('[data-stage-button="stage-2"]').click();
    await expect(page.locator("#stage-2")).toBeVisible();
    await expect(page.locator("#stage-2")).toContainText("바쁜 생활");
    await expect(page.locator("#stage-2")).toContainText("오래 앉아 있기");
    await expect(page.locator('[data-stage-button="stage-2"]')).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('[data-stage-button="stage-1"]')).toHaveAttribute("aria-expanded", "false");

    await page.locator('[data-stage-button="stage-3"]').click();
    await expect(page.locator("#stage-3")).toBeVisible();
    await expect(page.locator("#stage-3")).toContainText("계단 이용하기");
    await expect(page.locator("#stage-3")).toContainText("한 정거장 먼저 내리기");

    await page.locator('[data-stage-button="stage-4"]').click();
    await expect(page.locator("#stage-4")).toBeVisible();
    await expect(page.locator("#stage-4")).toContainText("몸이 가벼워집니다");
    await expect(page.locator("#stage-4")).toContainText("건강을 지킬 수 있습니다");
  });

  test("shows the four-paragraph manuscript outline and final checklist", async ({ page }) => {
    await page.locator('[data-stage-button="stage-5"]').click();

    await expect(page.locator("#stage-5 .eyebrow")).toHaveText("문단 설계");
    await expect(page.locator("#stage-5 .stage-goal")).toContainText("400~500자");
    await expect(page.locator("[data-paragraph-card]")).toHaveCount(4);
    await expect(page.locator("[data-paragraph-card] h3")).toHaveText([
      "도입: 운동을 못하는 이유",
      "생활 속 운동 방법",
      "운동의 효과",
      "마지막 제안과 정리"
    ]);
    await expect(page.locator("[data-paragraph-card] .question")).toHaveText([
      "운동을 못하는 이유에는 무엇이 있나요?",
      "생활 속에서 쉽게 할 수 있는 운동은 무엇인가요?",
      "그 운동을 하면 어떤 점이 좋아지나요?",
      "마지막에 어떻게 실천을 권할까요?"
    ]);
    await expect(page.locator("[data-paragraph-card] .target")).toHaveText([
      "80~100자",
      "110~130자",
      "100~120자",
      "80~100자"
    ]);

    await page.locator('[data-stage-button="stage-6"]').click();
    await expect(page.locator("#stage-6 .eyebrow")).toHaveText("최종 점검");
    await expect(page.locator("#stage-6 .stage-goal")).toContainText("400~500자");
    await expect(page.locator(".check-panel")).toContainText("400~500자인가요?");
    await expect(page.locator(".check-panel")).toContainText("운동 효과를 2개 이상 썼나요?");
    await expect(page.locator(".phrase-panel")).toContainText("작은 운동부터 시작하는 것이 좋다");
  });

  test("does not create the old autosave data while navigating stages", async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("c12_writing_topic_guide_v1"));

    await page.locator('[data-stage-button="stage-2"]').click();
    await page.locator('[data-stage-button="stage-5"]').click();
    await page.locator('[data-stage-button="stage-6"]').click();

    const savedDraft = await page.evaluate(() => localStorage.getItem("c12_writing_topic_guide_v1"));
    expect(savedDraft).toBeNull();
  });

  test("is linked from C12 index and mobile has no horizontal overflow", async ({ page }) => {
    await page.goto("/c12/index.html");
    const link = page.locator('a[href="writing-topic-guide.html"]');
    await expect(link).toContainText("400~500자");
    await link.click();
    await expect(page).toHaveURL(/\/c12\/writing-topic-guide\.html$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-topic-guide.html");
    await page.locator('[data-multilang-btn="ar"]').click();
    await page.locator('[data-stage-button="stage-5"]').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
