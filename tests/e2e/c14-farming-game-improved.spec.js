const { test, expect } = require("@playwright/test");

const GAME_URL = "/c14/farming-game-improved/";
const SAVE_KEY = "soil-village-improved-save-v1";

async function clearSave(page) {
  await page.addInitScript((key) => localStorage.removeItem(key), SAVE_KEY);
}

async function expectInsideViewport(page, selector, minimumSize = 0) {
  const locator = page.locator(selector);
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
  if (minimumSize > 0) {
    expect(box.width).toBeGreaterThanOrEqual(minimumSize);
    expect(box.height).toBeGreaterThanOrEqual(minimumSize);
  }
}

async function expectCenterHitTarget(page, selector) {
  const hit = await page.evaluate((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return false;
    const box = target.getBoundingClientRect();
    const hitTarget = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return Boolean(hitTarget && (hitTarget === target || target.contains(hitTarget)));
  }, selector);
  expect(hit).toBeTruthy();
}

async function expectNoPageOverflow(page) {
  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > window.innerWidth + 1,
    vertical: document.documentElement.scrollHeight > window.innerHeight + 1
  }));
  expect(overflow).toEqual({ horizontal: false, vertical: false });
}

const touchProfiles = [
  { name: "360x800 스마트폰 세로", viewport: { width: 360, height: 800 } },
  { name: "430x932 스마트폰 세로", viewport: { width: 430, height: 932 } },
  { name: "768x1024 태블릿 세로", viewport: { width: 768, height: 1024 } },
  { name: "1024x768 태블릿 가로", viewport: { width: 1024, height: 768 } }
];

for (const profile of touchProfiles) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, isMobile: true, hasTouch: true });

    test("시작과 터치 조작이 한 화면 안에 머문다", async ({ page }) => {
      await clearSave(page);
      await page.goto(GAME_URL);

      await expect(page.locator("html")).toHaveAttribute("data-input-mode", "touch");
      await expectInsideViewport(page, "#startCard");
      await expectInsideViewport(page, "#startButton", 44);
      await expectCenterHitTarget(page, "#startButton");
      await expectNoPageOverflow(page);

      await page.locator("#startButton").click();
      await expect(page.locator("body")).toHaveClass(/is-game-started/);
      await expectInsideViewport(page, "#touchJoystick", 44);
      await expectInsideViewport(page, "#touchAction", 44);
      await expectInsideViewport(page, "#heroToggle", 44);
      await expectInsideViewport(page, "#storyToggle", 44);
      await expectCenterHitTarget(page, "#heroToggle");
      await expectCenterHitTarget(page, "#touchAction");
      await expectNoPageOverflow(page);

      const navBottom = await page.locator(".top-nav").evaluate((element) => element.getBoundingClientRect().bottom);
      const heroTop = await page.locator("#heroToggle").evaluate((element) => element.getBoundingClientRect().top);
      expect(heroTop).toBeGreaterThanOrEqual(navBottom);

      await page.locator("#journalToggle").click();
      await expect(page.locator("#journalDrawer")).toBeVisible();
      await expect(page.locator("#touchAction")).not.toBeVisible();
      await expectInsideViewport(page, "#journalClose", 44);
      await page.locator("#journalClose").click();
      await expect(page.locator("#journalDrawer")).toBeHidden();
    });
  });
}

test.describe("개선된 터치 학습 흐름", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("행동 버튼으로 대화하고 마지막 줄에서만 진행을 저장한다", async ({ page }) => {
    await clearSave(page);
    await page.goto(GAME_URL);
    await page.locator("#startButton").click();

    await expect(page.locator("#promptBubble")).toContainText("행동 버튼");
    await page.locator("#touchAction").click();
    await expect(page.locator("#dialogueBox")).toBeVisible();

    let saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(saved.flags).not.toContain("talkedAunt");
    expect(saved.activeDialogue.zoneId).toBe("busStop");

    await page.locator("#dialogueNext").click();
    await expect(page.locator("#dialogueNext")).toContainText("대화 마치기");
    await page.locator("#dialogueNext").click();
    await expect(page.locator("#dialogueBox")).toBeHidden();

    saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(saved.flags).toContain("talkedAunt");
    expect(saved.activeDialogue).toBeNull();
  });

  test("조이스틱이 누르는 동안 반응하고 놓으면 돌아온다", async ({ page }) => {
    await clearSave(page);
    await page.goto(GAME_URL);
    await page.locator("#startButton").click();

    const box = await page.locator("#touchJoystick").boundingBox();
    await page.dispatchEvent("#touchJoystick", "pointerdown", {
      pointerId: 7,
      pointerType: "touch",
      clientX: box.x + box.width * 0.8,
      clientY: box.y + box.height * 0.5,
      isPrimary: true
    });
    await expect(page.locator("#touchJoystick")).toHaveClass(/is-active/);
    await page.dispatchEvent("#touchJoystick", "pointerup", {
      pointerId: 7,
      pointerType: "touch",
      clientX: box.x + box.width * 0.8,
      clientY: box.y + box.height * 0.5,
      isPrimary: true
    });
    await expect(page.locator("#touchJoystick")).not.toHaveClass(/is-active/);
  });

  test("진행 중인 작업을 복원하고 저장한 뒤 나갈 수 있다", async ({ page }) => {
    await page.addInitScript(({ key }) => {
      localStorage.setItem(key, JSON.stringify({
        started: true,
        storyIndex: 1,
        flags: ["talkedAunt"],
        activeMiniGame: { zoneId: "gardenCare", snapshot: null }
      }));
    }, { key: SAVE_KEY });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expect(page.locator("#miniGame")).toBeVisible();
    await expect(page.locator("#miniGameTitle")).toContainText("정원을 가꾸다");
    await expectInsideViewport(page, "#miniGameClose", 44);
    await page.locator("#miniGameClose").click();
    await expect(page.locator("#miniGame")).toBeHidden();

    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(saved.activeMiniGame).toBeNull();
    expect(saved.pausedActivity.zoneId).toBe("gardenCare");
  });
});
