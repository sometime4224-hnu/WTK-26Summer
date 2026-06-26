const { test, expect } = require("@playwright/test");

async function resetStorage(page) {
  await page.evaluate(() => {
    localStorage.removeItem("c12_word_shower_v1");
    localStorage.removeItem("c12_writing_shower_v1");
  });
  await page.reload();
}

async function hitText(page, text) {
  await page.locator("#answerInput").fill(text);
  await page.keyboard.press("Enter");
}

test.describe("c12 word shower", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-shower.html");
    await resetStorage(page);
  });

  test("loads the staged word shower game", async ({ page }) => {
    await expect(page).toHaveTitle("12과 단어 소나기");
    await expect(page.locator("h1").first()).toContainText("단어를 치면");
    await expect(page.locator("#overlayTitle")).toContainText("Enter를 눌러");
    await expect(page.locator("#missionTitle")).toHaveText("첫 만남 짧은 어휘");
    await expect(page.locator("#progressText")).toHaveText("1 / 12");
    await expect(page.locator(".stage-chip")).toHaveCount(12);
    await expect(page.locator(".speed-button")).toHaveCount(3);
    await expect(page.locator('[data-speed-mode="slow"]')).toHaveAttribute("aria-pressed", "true");

    const model = await page.evaluate(() => ({
      stages: window.__WORD_SHOWER__.getStages(),
      items: window.__WORD_SHOWER__.getItems()
    }));
    expect(model.stages).toHaveLength(12);
    expect(model.items.map((item) => item.text)).toEqual(expect.arrayContaining(["첫눈에", "반하다", "사랑에 빠지다", "경험이 많다", "몸이 가볍다"]));
  });

  test("starts with Enter and mirrors typing behind the play field", async ({ page }) => {
    await page.locator("#answerInput").press("Enter");
    await expect(page.locator("#boardOverlay")).toBeHidden();
    await expect.poll(() => page.evaluate(() => window.__WORD_SHOWER__.getState().running)).toBe(true);

    await page.locator("#answerInput").fill("첫눈에");
    await expect(page.locator("#inputEcho")).toHaveText("첫눈에");
    const layers = await page.evaluate(() => ({
      echo: Number(getComputedStyle(document.querySelector("#inputEcho")).zIndex),
      words: Number(getComputedStyle(document.querySelector("#fallLayer")).zIndex)
    }));
    expect(layers.echo).toBeLessThan(layers.words);
  });

  test("starts falling words and removes a short word on correct input", async ({ page }) => {
    await page.evaluate(() => {
      window.__WORD_SHOWER__.startStage(0);
      window.__WORD_SHOWER__.forceSpawn("고백");
    });

    await expect(page.locator('[data-text="고백"]')).toBeVisible();
    await hitText(page, "고백");

    await expect(page.locator("#feedbackText")).toContainText("고백 격파");
    await expect(page.locator("#comboValue")).toHaveText("1x");
    await expect(page.locator("#inputEcho")).toHaveText("");
    await expect.poll(() => page.locator('[data-text="고백"]').count()).toBe(0);
    const score = await page.locator("#scoreValue").textContent();
    expect(Number(score)).toBeGreaterThan(0);
  });

  test("makes long expressions fall slower than short words", async ({ page }) => {
    await page.evaluate(() => {
      window.__WORD_SHOWER__.startStage(0);
      window.__WORD_SHOWER__.forceSpawn("고백");
      window.__WORD_SHOWER__.forceSpawn("사랑에 빠지다");
    });

    const speeds = await page.evaluate(() => {
      const shortWord = document.querySelector('[data-text="고백"]');
      const longExpression = document.querySelector('[data-text="사랑에 빠지다"]');
      return {
        short: Number(shortWord.dataset.speed),
        long: Number(longExpression.dataset.speed)
      };
    });
    expect(speeds.long).toBeLessThan(speeds.short);
    expect(speeds.short).toBeLessThan(3.6);
    expect(speeds.long).toBeLessThan(2.1);
  });

  test("lets students adjust the falling speed during play", async ({ page }) => {
    const dropId = await page.evaluate(() => {
      window.__WORD_SHOWER__.startStage(0);
      return window.__WORD_SHOWER__.forceSpawn("고백").dropId;
    });
    const drop = page.locator(`[data-drop-id="${dropId}"]`);
    const speedBefore = await drop.evaluate((node) => Number(node.dataset.speed));

    await page.getByRole("button", { name: "아주 느림", exact: true }).click();
    await expect(page.locator('[data-speed-mode="verySlow"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#feedbackText")).toHaveText("속도: 아주 느림");
    const verySlowSpeed = await drop.evaluate((node) => Number(node.dataset.speed));
    expect(verySlowSpeed).toBeLessThan(speedBefore);
    expect(await page.evaluate(() => window.__WORD_SHOWER__.getState().speedMode)).toBe("verySlow");

    await page.getByRole("button", { name: "보통", exact: true }).click();
    await expect(page.locator('[data-speed-mode="normal"]')).toHaveAttribute("aria-pressed", "true");
    const normalSpeed = await drop.evaluate((node) => Number(node.dataset.speed));
    expect(normalSpeed).toBeGreaterThan(verySlowSpeed);
    expect(normalSpeed).toBeLessThan(4.7);
  });

  test("clears the field for a boss and shows damage feedback", async ({ page }) => {
    await page.evaluate(() => {
      window.__WORD_SHOWER__.startStage(0);
      window.__WORD_SHOWER__.forceSpawn("고백");
      window.__WORD_SHOWER__.setStage(2);
      window.__WORD_SHOWER__.startStage(2);
    });

    await expect(page.locator(".falling-word")).toHaveCount(0);
    await expect(page.locator('[data-testid="boss-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="boss-part"]')).toHaveText("첫눈에 반하다");

    await hitText(page, "첫 눈에 반하다");

    await expect(page.locator("#feedbackText")).toContainText("강타 성공");
    await expect(page.locator('[data-testid="boss-part"]')).toHaveText("사랑에 빠지다");
    await expect(page.locator(".impact")).toContainText("BOSS");
  });

  test("clears the final sentence boss in sequence", async ({ page }) => {
    const parts = await page.evaluate(() => {
      const stages = window.__WORD_SHOWER__.getStages();
      window.__WORD_SHOWER__.startStage(11);
      return stages[11].bossParts;
    });

    expect(parts).toHaveLength(4);
    for (const part of parts) {
      await expect(page.locator('[data-testid="boss-part"]')).toHaveText(part);
      await hitText(page, part);
    }

    await expect(page.locator("#overlayTitle")).toHaveText("스테이지 클리어");
    await expect(page.locator("#reportCleared")).toContainText("1 / 12");
  });

  test("is linked from the C12 writing area and the typing hub", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-shower.html"]');
    await expect(c12Link).toHaveCount(1);
    await expect(c12Link).toContainText("12과 단어 소나기");
    await c12Link.click();
    await expect(page).toHaveURL(/\/c12\/writing-shower\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("첫 만남 짧은 어휘");

    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    const hubLink = page.locator('[data-hub-link="c12-writing-shower"]');
    await expect(hubLink).toHaveCount(1);
    await expect(hubLink).toContainText("12과 단어 소나기");
    await hubLink.click();
    await expect(page).toHaveURL(/\/c12\/writing-shower\.html$/);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-shower.html");
    await resetStorage(page);
    await expect(page.locator("#missionTitle")).toBeVisible();
    await expect(page.locator(".stage-chip")).toHaveCount(12);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
