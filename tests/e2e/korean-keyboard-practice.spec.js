const { test, expect } = require("@playwright/test");

async function pressPhysicalKey(page, code, key) {
  await page.evaluate(
    ({ code: eventCode, key: eventKey }) => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          code: eventCode,
          key: eventKey,
          bubbles: true,
          cancelable: true
        })
      );
    },
    { code, key }
  );
}

test.describe("korean keyboard practice", () => {
  test("loads the keyboard layout and finger guide", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice/index.html");

    await expect(page.locator(".brand-title")).toContainText("한글 자판 연습");
    await expect(page.locator(".key-button")).toHaveCount(26);
    await expect(page.locator(".finger-chip")).toHaveCount(8);
    await expect(page.locator('.key-button[data-code="KeyA"]')).toContainText("ㅁ");
    await expect(page.locator('.key-button[data-code="KeyJ"]')).toContainText("ㅓ");
    await expect(page.locator(".home-guide")).toContainText("ㅁ ㄴ ㅇ ㄹ / ㅓ ㅏ ㅣ");
  });

  test("shows the keyboard and current mission together in the first desktop view", async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 720 });
    await page.goto("/apps/korean-keyboard-practice/index.html");

    const keyboardBox = await page.locator(".keyboard-panel").boundingBox();
    const missionBox = await page.locator(".practice-section").boundingBox();
    expect(keyboardBox.y).toBeLessThan(120);
    expect(missionBox.y).toBeLessThan(120);
    expect(keyboardBox.x).toBeLessThan(missionBox.x);
    expect(missionBox.height).toBeGreaterThan(300);
    await expect(page.locator("#targetDisplay")).toBeInViewport();
    await expect(page.locator(".keyboard-board")).toBeInViewport();
  });

  test("puts the mission before the keyboard on narrow screens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/korean-keyboard-practice/index.html");

    const keyboardBox = await page.locator(".keyboard-panel").boundingBox();
    const missionBox = await page.locator(".practice-section").boundingBox();
    expect(missionBox.y).toBeLessThan(keyboardBox.y);
    await expect(page.locator("#targetDisplay")).toBeInViewport();
  });
  test("advances the position practice using physical key codes", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice/index.html");

    await expect(page.locator("#targetDisplay")).toHaveText("ㄹ");
    await pressPhysicalKey(page, "KeyF", "f");
    await expect(page.locator("#completedCount")).toHaveText("1");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅓ");

    await pressPhysicalKey(page, "KeyJ", "j");
    await expect(page.locator("#completedCount")).toHaveText("2");
    await expect(page.locator("#targetDisplay")).toHaveText("ㅁ");
  });

  test("checks Hangul text input and warns for English input", async ({ page }) => {
    await page.goto("/apps/korean-keyboard-practice/index.html");

    await page.locator('.practice-tab[data-mode="syllable"]').click();
    await expect(page.locator("#targetDisplay")).toHaveText("가");

    await page.locator("#answerInput").fill("ga");
    await expect(page.locator("#feedbackStrip")).toContainText("한/영 키 확인");
    await expect(page.locator("#completedCount")).toHaveText("0");

    await page.locator("#answerInput").fill("가");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("나");

    await page.locator('.practice-tab[data-mode="word"]').click();
    await expect(page.locator("#targetDisplay")).toHaveText("한국");
    await page.locator("#answerInput").fill("한국");
    await expect(page.locator("#feedbackStrip")).toContainText("정확해요");
    await expect(page.locator("#targetDisplay")).toHaveText("학생");
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/korean-keyboard-practice/index.html");

    await expect(page.locator(".keyboard-board")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from the common apps hub", async ({ page }) => {
    await page.goto("/apps/index.html");

    const link = page.locator('a[href="korean-keyboard-practice/index.html"]');
    await expect(link).toHaveCount(1);
    await expect(link).toContainText("한글 자판 연습");
  });
});
