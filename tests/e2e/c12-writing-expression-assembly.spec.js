const { test, expect } = require("@playwright/test");

test.describe("C12 writing expression assembly", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-expression-assembly.html");
    await page.evaluate(() => localStorage.removeItem("c12_writing_expression_assembly_v1"));
    await page.reload();
  });

  test("loads stages, focuses input, and shows multilingual controls", async ({ page }) => {
    await expect(page).toHaveTitle("12과 쓰기 표현 조립 연습");
    await expect(page.locator("#stageTitle")).toHaveText("상황 파악");
    await expect(page.locator("#answerInput")).toBeFocused();
    await expect(page.locator("#progressDots button")).toHaveCount(7);
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator("[data-lang].lang-visible")).toHaveCount(0);

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator('[data-lang="en"].lang-visible')).toContainText("Write a reply");
    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('[data-lang="ar"].lang-visible')).toHaveAttribute("dir", "rtl");
  });

  test("blocks short answers and missing required expressions", async ({ page }) => {
    await page.locator("#answerInput").fill("운동");
    await page.locator("#saveButton").click();
    await expect(page.locator("#feedbackText")).toContainText("조금 더");

    await page.locator("#answerInput").fill("요즘 일이 많아서 마음이 복잡할 것 같습니다.");
    await page.locator("#saveButton").click();
    await expect(page.locator("#feedbackText")).toContainText("표현 은행");
  });

  test("saves sentences, inserts chips, builds preview, and restores state", async ({ page }) => {
    await page.locator('[data-insert="요즘 바빠서"]').click();
    await page.locator('[data-insert="건강이 나빠진 것 같아서"]').click();
    await page.locator("#answerInput").fill("요즘 바빠서 운동을 못 하고 건강과 체중이 걱정되는 것 같습니다.");
    await page.locator("#saveButton").click();

    await expect(page.locator("#stageTitle")).toHaveText("공감 문장 조립");
    await expect(page.locator("#basketCount")).toHaveText("1개");
    await expect(page.locator("#paragraphPreview")).toContainText("건강과 체중이 걱정");

    await page.locator('[data-insert="많이 걱정되시겠어요"]').click();
    await page.locator("#answerInput").fill("요즘 건강 때문에 많이 걱정되시겠어요.");
    await page.locator("#saveButton").click();
    await expect(page.locator("#basketCount")).toHaveText("2개");

    await page.reload();
    await expect(page.locator("#stageTitle")).toHaveText("생활 운동 방법 1");
    await expect(page.locator("#basketCount")).toHaveText("2개");
    await expect(page.locator("#paragraphPreview")).toContainText("많이 걱정되시겠어요");
  });

  test("creates final reply paragraph and exposes copy button", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem("c12_writing_expression_assembly_v1", JSON.stringify({
        stepIndex: 6,
        answers: {
          situation: "요즘 바빠서 운동을 못 하고 건강과 체중이 걱정되는 것 같습니다.",
          empathy: "요즘 건강 때문에 많이 걱정되시겠어요.",
          method1: "먼저 가까운 거리는 걸어가 보세요.",
          method2: "또 쉬는 시간마다 몸을 풀어 보세요.",
          effect: "이렇게 하면 몸이 가벼워지고 건강을 지킬 수 있습니다.",
          advice: "무리하지 말고 조금씩 해 보세요."
        },
        finalDraft: ""
      }));
    });
    await page.reload();

    await expect(page.locator("#stageTitle")).toHaveText("답글 문단 다듬기");
    await expect(page.locator("#answerInput")).toHaveValue(/가까운 거리는 걸어가/);
    await page.locator("#answerInput").fill("요즘 건강 때문에 많이 걱정되시겠어요. 운동할 시간이 없더라도 가까운 거리는 걸어가고 쉬는 시간마다 몸을 풀어 보세요. 이렇게 하면 몸이 가벼워지고 건강을 지킬 수 있습니다. 무리하지 말고 조금씩 해 보세요.");
    await page.locator("#saveButton").click();
    await expect(page.locator("#feedbackText")).toContainText("최종 답글");
    await expect(page.locator("#copyButton")).toBeEnabled();
  });

  test("is linked from C12 index and mobile has no horizontal overflow", async ({ page }) => {
    await page.goto("/c12/index.html");
    const link = page.locator('a[href="writing-expression-assembly.html"]');
    await expect(link).toContainText("12과 쓰기 표현 조립 연습");
    await link.click();
    await expect(page).toHaveURL(/\/c12\/writing-expression-assembly\.html$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-expression-assembly.html");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
