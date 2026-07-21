const { test, expect } = require("@playwright/test");

const GAME_URL = "/c15/grammar4-route-life-game.html";
const SAVE_KEY = "korean3b.c15.grammar4.route-life-game";

const NEXT_DESTINATION = {
  home: "mart",
  mart: "school",
  school: "library",
  library: "station",
  station: "terminal",
  terminal: "home"
};

async function clearSave(page) {
  await page.addInitScript((key) => localStorage.removeItem(key), SAVE_KEY);
}

async function waitForNearbyObject(page) {
  const object = page.locator(".map-object.is-near:not(:disabled)");
  await expect(object).toBeVisible({ timeout: 9_000 });
  return object;
}

test("첫 길 뒤 하나의 파형 목적지를 눌러 두 번째 길과 결과 문장을 완성한다", async ({ page }) => {
  await clearSave(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(GAME_URL);

  await page.locator('[data-destination="home"]').click();
  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveText("집에 가는 길에");

  const first = await waitForNearbyObject(page);
  await expect(first).toContainText("편의점");
  await first.click();
  const second = await waitForNearbyObject(page);
  await expect(second).toContainText("택배함");
  await second.click();

  await expect(page.locator("#mapCanvas")).toHaveAttribute("data-phase", "awaiting-next", { timeout: 16_000 });
  await expect(page.locator("#resultSentence")).toHaveText("집에 가는 길에 우유를 사고 택배를 찾았어요.");
  await expect(page.locator("#resultDetail")).toContainText("마트를 눌러");
  await expect(page.locator("#anotherRouteButton")).toBeHidden();
  await expect(page.locator('[data-destination]:not(:disabled)')).toHaveCount(1);
  await expect(page.locator('[data-destination="mart"]')).toHaveClass(/is-next/);

  await page.locator('[data-destination="mart"]').click();
  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveText("집에서 마트에 가는 길에");
  await expect(page.locator(".map-object")).toHaveCount(2);

  const bank = await waitForNearbyObject(page);
  await expect(bank).toContainText("은행");
  await bank.click();
  const pharmacy = await waitForNearbyObject(page);
  await expect(pharmacy).toContainText("약국");
  await pharmacy.click();

  await expect(page.locator("#mapCanvas")).toHaveAttribute("data-phase", "arrived", { timeout: 16_000 });
  await expect(page.locator("#resultFirstSentence")).toHaveText("집에 가는 길에 우유를 사고 택배를 찾았어요.");
  await expect(page.locator("#resultSentence")).toHaveText("집에서 마트에 가는 길에 은행에서 돈을 찾고 약을 샀어요.");
  await expect(page.locator("#resultSentence .sentence-part--grammar")).toHaveText("집에서 마트에 가는 길에");
  await expect(page.locator("#sentenceOutput .sentence-part--past.sentence-part--fresh")).toHaveText("약을 샀어요.");
  await expect(page.locator("#anotherRouteButton")).toBeVisible();
});

test("각 첫 목적지는 정해진 하나의 다음 목적지만 활성화하고 두 물체를 연다", async ({ page }) => {
  for (const [startId, nextId] of Object.entries(NEXT_DESTINATION)) {
    await page.addInitScript(({ key, saved }) => localStorage.setItem(key, JSON.stringify(saved)), {
      key: SAVE_KEY,
      saved: {
        version: 2,
        completedRouteIds: [startId],
        journeyStartId: startId,
        legIndex: 0,
        firstLeg: { routeId: startId, actionIds: [] },
        activeRouteId: startId,
        phase: "awaiting-next",
        selectedActionIds: [],
        travelProgress: 1
      }
    });
    await page.goto(GAME_URL);
    await expect(page.locator('[data-destination]:not(:disabled)')).toHaveCount(1);
    await expect(page.locator('[data-destination="' + nextId + '"]')).toHaveClass(/is-next/);
    await page.locator('[data-destination="' + nextId + '"]').click();
    await expect(page.locator(".map-object")).toHaveCount(2);
  }
});

test("v1 기록을 첫 길 완료 상태로 옮기고 두 번째 길 진행을 복원한다", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      completedRouteIds: ["school"],
      activeRouteId: "school",
      phase: "arrived",
      selectedActionIds: ["bread"],
      travelProgress: 1
    }));
  }, SAVE_KEY);
  await page.goto(GAME_URL);

  await expect(page.locator("#mapCanvas")).toHaveAttribute("data-phase", "awaiting-next");
  await expect(page.locator('[data-destination="library"]')).toHaveClass(/is-next/);
  await expect(page.locator("#resultSentence")).toHaveText("학교에 가는 길에 빵을 샀어요.");
  await expect(page.locator("#speedLabel")).toHaveText("1×");

  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      completedRouteIds: ["home"],
      journeyStartId: "home",
      legIndex: 1,
      firstLeg: { routeId: "home", actionIds: ["milk"] },
      activeRouteId: "home-to-mart",
      phase: "moving",
      selectedActionIds: ["homeMartBank"],
      travelProgress: 0.4,
      speed: 3
    }));
  }, SAVE_KEY);
  await page.reload();
  await expect(page.locator("#resumePanel")).toBeVisible();
  await expect(page.locator("#sentenceOutput")).toHaveText("집에서 마트에 가는 길에 은행에서 돈을 찾아요.");
  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveText("집에서 마트에 가는 길에");
  await expect(page.locator("#speedLabel")).toHaveText("3×");
});

test("모바일과 키보드에서 첫 목적지와 문법 색상 표시가 보인다", async ({ page }) => {
  await clearSave(page);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(GAME_URL);

  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveText("가는 길에?");
  await expect(page.locator("#speedButton")).toHaveAccessibleName("이동 속도 1배속, 눌러 2배속으로 변경");
  await page.locator("#speedButton").click();
  await expect(page.locator("#speedLabel")).toHaveText("2×");
  await page.locator("#speedButton").click();
  await expect(page.locator("#speedLabel")).toHaveText("3×");
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).speed, SAVE_KEY)).toBe(3);
  await page.locator("#speedButton").click();
  await expect(page.locator("#speedLabel")).toHaveText("1×");
  await page.locator('[data-destination="school"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveText("학교에 가는 길에");
  await expect(page.locator("#sentenceOutput .sentence-part--grammar")).toHaveCSS("color", "rgb(36, 84, 184)");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
