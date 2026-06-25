const { test, expect } = require("@playwright/test");

test.describe("C12 writing paragraph planner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-paragraph-planner.html");
  });

  test("loads as a standalone paper paragraph planner", async ({ page }) => {
    await expect(page).toHaveTitle("12과 생활 속 운동 제안 글쓰기 문단 설계");
    await expect(page.locator("h1")).toContainText("4문단 질문 설계");
    await expect(page.locator(".goal-badge")).toHaveText("400~500자 · 4문단");
    await expect(page.locator("[data-page-button]")).toHaveText(["1문단", "2문단", "3문단", "4문단", "점검"]);
    await expect(page.locator('[data-page-button="0"]')).toHaveAttribute("aria-current", "page");
    await expect(page.locator("textarea")).toHaveCount(0);
    await expect(page.locator("input")).toHaveCount(0);
    const usesLocalStorage = await page.locator("script").evaluateAll((scripts) =>
      scripts.some((script) => script.textContent.includes("localStorage"))
    );
    expect(usesLocalStorage).toBe(false);

    await expect(page.locator("[data-planner-paragraph]")).toHaveCount(4);
    await expect(page.locator('[data-planner-page="0"]')).toBeVisible();
    await expect(page.locator('[data-planner-page="1"]')).toBeHidden();
    await expect(page.locator("[data-planner-paragraph] h2")).toHaveText([
      "도입: 운동을 못하는 이유",
      "생활 속 운동 방법",
      "운동의 효과",
      "마지막 제안과 정리"
    ]);
    await expect(page.locator(".question-card h3")).toHaveCount(16);
    await expect(page.locator('[data-scaffold="p1q1"] .scaffold-ko')).toContainText("운동이 필요하지만");
  });

  test("keeps Korean questions and sentence frames when scaffold language changes", async ({ page }) => {
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('.lead [data-lang="en"].lang-visible')).toContainText("Answer the questions");

    const firstQuestion = page.locator("[data-planner-paragraph]").first().locator(".question-card").first();
    await expect(firstQuestion.locator("h3")).toHaveText("누가 운동을 못하나요?");
    await expect(firstQuestion).toContainText("요즘 사람들은 ... 때문에 운동할 시간이 부족합니다.");
    await expect(firstQuestion.locator(".choice-bank")).toContainText("학생");
    await expect(firstQuestion.locator('[data-scaffold="p1q1"] .scaffold-ko')).toBeHidden();
    await expect(firstQuestion.locator('[data-scaffold="p1q1"] [data-lang="en"].lang-visible')).toContainText("needs exercise");

    await page.locator('[data-page-button="2"]').click();
    const thirdParagraph = page.locator('[data-planner-page="2"]');
    await expect(thirdParagraph.locator("h2")).toHaveText("운동의 효과");
    await expect(thirdParagraph.locator('[data-scaffold="p3q3"] [data-lang="en"].lang-visible')).toContainText("reduces long sitting");
    await expect(thirdParagraph.locator(".choice-bank").first()).toContainText("몸이 가벼워지다");
    await expect(thirdParagraph.locator(".answer-frame p").first()).toHaveText("이렇게 하면 ... 수 있습니다.");

    await page.locator('[data-page-button="4"]').click();
    await expect(page.locator('[data-scaffold="check3"] [data-lang="en"].lang-visible')).toContainText("at least two exercise methods");

    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('.lead [data-lang="ar"].lang-visible')).toHaveAttribute("dir", "rtl");
    await expect(page.locator('[data-scaffold="p3q3"] [data-lang="ar"].lang-visible')).toHaveAttribute("dir", "rtl");
    await expect(firstQuestion.locator("h3")).toHaveText("누가 운동을 못하나요?");
  });

  test("guides each paragraph through answerable questions", async ({ page }) => {
    const paragraphs = page.locator("[data-planner-paragraph]");

    await expect(paragraphs.nth(0)).toContainText("왜 운동할 시간이 부족한가요?");
    await expect(paragraphs.nth(0)).toContainText("그래서 생활 속에서 할 수 있는 작은 운동이 필요합니다.");

    await page.locator("[data-page-next]").click();
    await expect(page.locator('[data-planner-page="1"]')).toBeVisible();
    await expect(paragraphs.nth(1)).toContainText("첫 번째 운동 방법은 무엇인가요?");
    await expect(paragraphs.nth(1)).toContainText("또 ... 수도 있습니다.");

    await page.locator("[data-page-next]").click();
    await expect(page.locator('[data-planner-page="2"]')).toBeVisible();
    await expect(paragraphs.nth(2)).toContainText("몸은 어떻게 좋아지나요?");
    await expect(paragraphs.nth(2)).toContainText("그래서 ...에 도움이 됩니다.");

    await page.locator("[data-page-next]").click();
    await expect(page.locator('[data-planner-page="3"]')).toBeVisible();
    await expect(paragraphs.nth(3)).toContainText("무엇부터 시작하라고 권할까요?");
    await expect(paragraphs.nth(3)).toContainText("오늘부터 생활 속 작은 운동을 시작해 보세요.");

    await page.locator("[data-page-next]").click();
    await expect(page.locator('[data-planner-page="4"]')).toBeVisible();
    await expect(page.locator("[data-page-next]")).toBeDisabled();
  });

  test("is linked from the guide page and C12 index, and fits mobile", async ({ page }) => {
    await page.goto("/c12/writing-topic-guide.html");
    await page.locator('[data-stage-button="stage-5"]').click();
    const guideLink = page.locator('a[href="writing-paragraph-planner.html"]');
    await expect(guideLink).toContainText("문단 설계 페이지 열기");
    await guideLink.click();
    await expect(page).toHaveURL(/\/c12\/writing-paragraph-planner\.html$/);

    await page.goto("/c12/index.html");
    const indexLink = page.locator('a[href="writing-paragraph-planner.html"]');
    await expect(indexLink).toContainText("생활 속 운동 제안 글쓰기 문단 설계");
    await expect(page.locator('[data-writing-group="paper"] h3')).toHaveText("원고지 쓰기 활동");
    await expect(page.locator('[data-writing-group="typing"] .path-card__badge')).toContainText("타이핑 쓰기");
    await expect(page.locator("[data-writing-group]")).toHaveCount(2);
    const writingGroups = await page.locator("[data-writing-group]").evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-writing-group"))
    );
    expect(writingGroups).toEqual(["paper", "typing"]);

    const paperWriting = page.locator('[data-writing-group="paper"]');
    const typingWriting = page.locator('[data-writing-group="typing"]');
    await expect(paperWriting.locator('a[href="writing-expression-learning.html"]')).toHaveCount(0);
    await expect(paperWriting.locator('a[href="writing-expression-assembly.html"]')).toHaveCount(0);
    await expect(paperWriting.locator('a[href="writing-keyboard-builder.html"]')).toHaveCount(0);
    await expect(paperWriting.locator('a[href="writing-motion-typing.html"]')).toHaveCount(0);
    await expect(typingWriting.locator('a[href="writing-expression-learning.html"]')).toContainText("12과 쓰기 주제 표현 학습");
    await expect(typingWriting.locator('a[href="writing-expression-assembly.html"]')).toContainText("12과 쓰기 표현 조립 연습");
    await expect(typingWriting.locator('a[href="writing-keyboard-builder.html"]')).toContainText("12과 표현 타이핑 연습");
    await expect(typingWriting.locator('a[href="writing-motion-typing.html"]')).toContainText("12과 동작 표현 타이핑 연습");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/index.html");
    const indexOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(indexOverflow).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-paragraph-planner.html");
    await page.locator('[data-multilang-btn="ar"]').click();
    for (const pageIndex of [0, 1, 2, 3, 4]) {
      await page.locator(`[data-page-button="${pageIndex}"]`).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(2);
      const verticalOverflow = await page.evaluate(() => document.documentElement.scrollHeight - document.documentElement.clientHeight);
      expect(verticalOverflow).toBeLessThanOrEqual(2);
    }
  });
});
