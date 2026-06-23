const { test, expect } = require("@playwright/test");

test.describe("C12 writing expression reference", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-expression-reference.html");
  });

  test("loads reference cards with meaning, usage, examples, and roles", async ({ page }) => {
    await expect(page).toHaveTitle("표현 자료");
    await expect(page.locator(".topbar strong")).toHaveText("표현 자료");
    await expect(page.locator(".topbar span")).toHaveText("의미 · 쓰임 · 예문");
    await expect(page.locator("h1")).toHaveText("생활 속 운동");
    await expect(page.locator(".scenario p")).toHaveText("답글 표현");
    await expect(page.locator("[data-expression-card]")).toHaveCount(35);
    await expect(page.locator("#totalCount")).toHaveText("35");

    const firstCard = page.locator("[data-expression-card]").filter({ hasText: "물을 많이 마시다" });
    await expect(firstCard).toContainText("뜻");
    await expect(firstCard).toContainText("건강을 위해 평소에 하는 노력");
    await expect(firstCard).toContainText("언제 쓰나요?");
    await expect(firstCard).toContainText("활용 예");
    await expect(firstCard).toContainText("문단에서의 역할");
  });

  test("filters by category and searches expression content", async ({ page }) => {
    await expect(page.locator(".filter-btn")).toHaveText([
      "전체",
      "건강 노력",
      "생활 운동 방법",
      "운동 효과",
      "공감",
      "권유",
      "연결 표현"
    ]);

    await page.locator(".filter-btn", { hasText: "생활 운동 방법" }).click();
    await expect(page.locator('[data-category-section="생활 운동 방법"]')).toBeVisible();
    await expect(page.locator("[data-expression-card]")).toHaveCount(7);
    await expect(page.locator("[data-expression-card]").first()).toContainText("제자리 뛰기를 하다");

    await page.locator("#searchInput").fill("스트레스");
    await expect(page.locator("[data-expression-card]")).toHaveCount(0);
    await expect(page.locator("#emptyState")).toBeVisible();

    await page.locator(".filter-btn", { hasText: "전체" }).click();
    await expect(page.locator("[data-expression-card]")).toHaveCount(1);
    await expect(page.locator("[data-expression-card]")).toContainText("스트레스가 풀리다");
  });

  test("uses standard multilingual toggle with hidden default and rtl Arabic", async ({ page }) => {
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator("[data-lang].lang-visible")).toHaveCount(0);

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('[data-lang="en"].lang-visible').first()).toContainText("Drink plenty of water");

    await page.locator('[data-multilang-btn="ar"]').click();
    const arabicBox = page.locator('[data-lang="ar"].lang-visible').first();
    await expect(arabicBox).toHaveAttribute("dir", "rtl");
    await expect(arabicBox).toContainText("شرب");
  });

  test("is linked from C12 index but not from the typing hub", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-expression-reference.html"]');
    await expect(c12Link).toContainText("표현 자료");
    await c12Link.click();
    await expect(page).toHaveURL(/\/c12\/writing-expression-reference\.html$/);

    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    await expect(page.locator('a[href="../../c12/writing-expression-reference.html"]')).toHaveCount(0);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-expression-reference.html");

    await expect(page.locator("[data-expression-card]").first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
