const { test, expect } = require("@playwright/test");

const GAME_URL = "/c14/farming-game-improved/";
const SAVE_KEY = "soil-village-improved-save-v1";

async function clearSave(page) {
  await page.addInitScript((key) => localStorage.removeItem(key), SAVE_KEY);
}

async function seedSave(page, data) {
  await page.addInitScript(({ key, saved }) => {
    localStorage.setItem(key, JSON.stringify(saved));
  }, { key: SAVE_KEY, saved: data });
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
    expect(box.width + 0.01).toBeGreaterThanOrEqual(minimumSize);
    expect(box.height + 0.01).toBeGreaterThanOrEqual(minimumSize);
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

async function expectCanvasAspectMatchesDisplay(page) {
  const aspectDelta = await page.locator("#game").evaluate((canvas) => {
    const box = canvas.getBoundingClientRect();
    return Math.abs(canvas.width / canvas.height - box.width / box.height);
  });
  expect(aspectDelta).toBeLessThan(0.02);
}

async function expectCanvasFillsFrame(page) {
  const edgeDelta = await page.evaluate(() => {
    const canvas = document.querySelector("#game").getBoundingClientRect();
    const frame = document.querySelector(".canvas-frame").getBoundingClientRect();
    return Math.max(
      Math.abs(canvas.left - frame.left),
      Math.abs(canvas.top - frame.top),
      Math.abs(canvas.right - frame.right),
      Math.abs(canvas.bottom - frame.bottom)
    );
  });
  expect(edgeDelta).toBeLessThan(1.5);
}

const touchProfiles = [
  { name: "320x568 작은 스마트폰 세로", viewport: { width: 320, height: 568 } },
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
      await expectCanvasAspectMatchesDisplay(page);
      await expectCanvasFillsFrame(page);

      const navBottom = await page.locator(".top-nav").evaluate((element) => element.getBoundingClientRect().bottom);
      const heroTop = await page.locator("#heroToggle").evaluate((element) => element.getBoundingClientRect().top);
      expect(heroTop).toBeGreaterThanOrEqual(navBottom);

      await page.locator("#storyToggle").click();
      await expectInsideViewport(page, "#storyPanel");
      await page.locator("#statsToggle").click();
      await expect(page.locator("#storyPanel")).toBeHidden();
      await expectInsideViewport(page, "#statsPanel");
      await page.locator("#statsToggle").click();
      await expect(page.locator("#statsPanel")).toBeHidden();

      await page.locator("#heroToggle").click();
      await expect(page.locator("#heroPanel")).toHaveClass(/is-expanded/);
      await expectInsideViewport(page, "#heroPanel");
      await expectInsideViewport(page, "#resetButton", 44);
      await expectInsideViewport(page, "#voiceToggle", 44);
      await page.locator("#heroToggle").click();
      await expect(page.locator("#heroDetails")).toBeHidden();

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

    await page.locator("#journalToggle").click();
    await expect(page.locator("#listeningList .progress-item.is-complete")).toHaveCount(0);
    await expect(page.locator("#listeningList")).toContainText("아직 못 만남 · 주말농장");
    await page.locator("#journalClose").click();

    await expect(page.locator("#promptBubble")).toContainText("행동 버튼");
    await expect(page.locator("#promptBubble")).not.toContainText("E");
    await page.locator("#touchAction").click();
    await expect(page.locator("#dialogueBox")).toBeVisible();
    await expect(page.locator("#touchAction")).not.toBeVisible();

    const dialogueBox = await page.locator("#dialogueBox").boundingBox();
    const viewport = page.viewportSize();
    expect(dialogueBox.y).toBeGreaterThan(viewport.height * 0.45);
    expect(dialogueBox.y + dialogueBox.height).toBeLessThanOrEqual(viewport.height + 1);
    await expect
      .poll(() =>
        page.locator(".canvas-frame").evaluate((element) =>
          Number.parseFloat(getComputedStyle(element, "::after").opacity)
        )
      )
      .toBeGreaterThan(0.9);

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
    expect(saved.unlockedListening).toEqual(expect.arrayContaining(["weekendFarm", "goCountryside", "growDirectly", "firstFarm"]));
  });

  test("마지막 손동작 뒤 전체 표현과 바뀐 장면을 잠시 유지한다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 1,
      flags: ["talkedAunt"],
      activeMiniGame: {
        zoneId: "gardenCare",
        snapshot: {
          kind: "gardenCare",
          player: { xRatio: 0.65, yRatio: 0.77, carrying: "shears", facing: "right", step: 0 },
          shrubs: [
            { trimmed: true, trimProgress: 1, shake: 0 },
            { trimmed: true, trimProgress: 1, shake: 0 },
            { trimmed: false, trimProgress: 0.5, shake: 0 }
          ]
        }
      }
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expect(page.locator("#miniGameTitle")).toHaveText("정원을 가꾸다");
    await page.locator("#touchAction").click();
    await expect(page.locator("#miniGame")).toHaveClass(/is-complete/);
    await expect(page.locator("#miniGameType")).toHaveText("장면에 남은 표현");
    await expect(page.locator("#miniGameInstruction")).toContainText("전후 변화");
    await expect(page.locator("#miniGameClose")).toBeDisabled();
    await expect(page.locator("#touchAction")).toBeDisabled();
    await expect(page.locator("#miniGame")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#miniGame")).toBeVisible();

    await expect(page.locator("#miniGame")).toBeHidden({ timeout: 4_000 });
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(saved.completedTasks).toContain("gardenCare");
    expect(saved.basket).toContain("꽃단장");
  });

  test("이동으로 진행하는 활동은 행동 버튼 대신 조이스틱을 안내한다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 1,
      flags: ["talkedAunt"],
      activeMiniGame: {
        zoneId: "lawnTrim",
        snapshot: {
          kind: "lawnTrim",
          player: { xRatio: 0.18, yRatio: 0.53, carrying: "mower", facing: "right", step: 0 },
          mower: { attached: true, tilt: 0 }
        }
      }
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expect(page.locator("#touchAction")).toHaveText("이동");
    await expect(page.locator("#touchAction")).toHaveClass(/is-idle/);
    await expect(page.locator("#touchAction")).toHaveAttribute("aria-label", /조이스틱/);
    await page.locator("#touchAction").click();
    await expect(page.locator("#activityHint")).toContainText("잔디를 깎다");
    await expect(page.locator("#miniGame")).toBeVisible();
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

  test("진행 중인 작업을 복원하고 저장한 뒤 나갈 수 있다", async ({ page, context }) => {
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
    await expect(page.locator(".activity-goal.is-current")).toHaveCount(1);
    await expectInsideViewport(page, "#miniGameClose", 44);
    await page.locator("#miniGameClose").click();
    await expect(page.locator("#miniGame")).toBeHidden();

    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(saved.activeMiniGame).toBeNull();
    expect(saved.pausedActivity.zoneId).toBe("gardenCare");

    const restoredPage = await context.newPage();
    await restoredPage.goto(GAME_URL);
    const diskBeforeRestore = await restoredPage.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(diskBeforeRestore.activeMiniGame).toBeNull();
    expect(diskBeforeRestore.pausedActivity.zoneId).toBe("gardenCare");
    await restoredPage.locator("#continueButton").click();
    await expect(restoredPage.locator("#miniGame")).toBeHidden();
    await restoredPage.evaluate(() => document.querySelector("#voiceToggle").click());
    const persistedAfterRestore = await restoredPage.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(persistedAfterRestore.pausedActivity.zoneId).toBe("gardenCare");
    await restoredPage.reload();
    const restoredSave = await restoredPage.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
    expect(restoredSave.pausedActivity.zoneId).toBe("gardenCare");
    await expect(restoredPage.locator("#saveSummary")).toContainText("하던 활동 이어서 하기");
    await restoredPage.close();
  });
});

test.describe("표현 장면과 회상 순서", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("들판 끝에 가면 공기가 맑다는 장면 연출이 열린다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      player: { x: 1600, y: 700, facing: "up", step: 0 },
      storyIndex: 1,
      flags: ["talkedAunt"]
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expect(page.locator("#game")).toHaveAttribute("data-expression-moment", "cleanAir");
    await expect(page.locator("#game")).toHaveAttribute("aria-description", /공기가 맑다/);
  });

  test("활동 전에는 해당 팻말 퀴즈가 열리지 않는다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      player: { x: 536, y: 384, facing: "down", step: 0 },
      storyIndex: 1,
      flags: ["talkedAunt"]
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expect(page.locator("#quizCard")).toBeHidden();
    await expect(page.locator("#promptBubble")).not.toContainText("팻말 퀴즈");
    await page.locator("#journalToggle").click();
    await expect(page.locator("#taskList")).toContainText("활동을 마치면 팻말이 열림");
  });

  test("마지막 언덕의 평화로운 장면을 느낀 뒤 엔딩이 열린다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      player: { x: 1730, y: 194, facing: "down", step: 0 },
      storyIndex: 5,
      flags: ["talkedAunt", "benchRest", "talkedChild", "dinnerServed"],
      completedTasks: ["gardenCare", "lawnTrim", "vegetablePlant", "vegetableGrow", "farmWork", "raiseLivestock", "catchFish"]
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await page.locator("#touchAction").click();

    await expect(page.locator("#game")).toHaveAttribute("data-expression-moment", "peaceful");
    await expect(page.locator("#endingCard")).toBeHidden();
    await expect(page.locator("#endingCard")).toBeVisible({ timeout: 5_500 });
    await expect(page.locator("#game")).not.toHaveAttribute("data-expression-moment", "peaceful");
  });

  test("이전 저장의 선해금 기록은 실제 장면 기준으로 정리한다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 0,
      flags: [],
      completedTasks: [],
      unlockedListening: ["weekendFarm", "goCountryside", "growDirectly", "firstFarm"],
      unlockedMood: ["peaceful", "relaxed", "loseTrack", "inconvenient", "boring"]
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await page.locator("#journalToggle").click();

    await expect(page.locator("#listeningList .progress-item.is-complete")).toHaveCount(0);
    await expect(page.locator("#moodList .progress-item.is-complete")).toHaveCount(0);
    await expect(page.locator("#listeningList")).toContainText("아직 못 만남 · 주말농장");
    await expect(page.locator("#moodList")).toContainText("아직 못 느낌 · 평화롭다");
  });

  test("아침과 밤 마당 대사의 전용 음성 파일이 제공된다", async ({ page, request }) => {
    await page.goto(GAME_URL);
    for (const path of [
      "audio/porch-aunt-morning-1.mp3",
      "audio/porch-aunt-morning-2.mp3",
      "audio/porch-aunt-night-1.mp3",
      "audio/porch-aunt-night-2.mp3"
    ]) {
      const response = await request.get(`${GAME_URL}${path}`);
      expect(response.ok()).toBeTruthy();
      expect((await response.body()).length).toBeGreaterThan(10_000);
      const duration = await page.evaluate((source) => new Promise((resolve, reject) => {
        const audio = new Audio(source);
        const timer = window.setTimeout(() => reject(new Error("음성 메타데이터 시간 초과")), 5_000);
        audio.addEventListener("loadedmetadata", () => {
          window.clearTimeout(timer);
          resolve(audio.duration);
        }, { once: true });
        audio.addEventListener("error", () => {
          window.clearTimeout(timer);
          reject(new Error("음성 디코딩 실패"));
        }, { once: true });
      }), path);
      expect(duration).toBeGreaterThan(1);
    }
  });
});

const completedActivityCases = [
  {
    taskId: "lawnTrim",
    title: "잔디를 깎다",
    reward: "잔디향",
    snapshot: {
      kind: "lawnTrim",
      mower: { attached: true, tilt: 0 },
      lanes: Array.from({ length: 3 }, () => ({ cut: 1, reaction: 0, cells: Array(18).fill(1) }))
    }
  },
  {
    taskId: "vegetablePlant",
    title: "채소를 심다",
    reward: "모종상자",
    snapshot: {
      kind: "vegetablePlant",
      tray: { taken: true, seedlings: 0 },
      plots: Array.from({ length: 4 }, () => ({ planted: true, pop: 0 }))
    }
  },
  {
    taskId: "vegetableGrow",
    title: "채소를 키우다",
    reward: "싱싱한 채소",
    snapshot: {
      kind: "vegetableGrow",
      bucket: { taken: true, water: 0, capacity: 2, filledTrips: 2 },
      plants: Array.from({ length: 4 }, () => ({ watered: true, bounce: 0, droop: 0 }))
    }
  },
  {
    taskId: "farmWork",
    title: "농사를 짓다",
    reward: "반듯한 고랑",
    snapshot: {
      kind: "farmWork",
      player: { carrying: "hoe" },
      rows: Array.from({ length: 3 }, () => ({ progress: 1, ripple: 0, cells: Array(18).fill(1) }))
    }
  },
  {
    taskId: "raiseLivestock",
    title: "가축을 키우다",
    reward: "달걀 꾸러미",
    snapshot: {
      kind: "raiseLivestock",
      feedBag: { taken: true, servings: 0 },
      troughs: Array.from({ length: 2 }, () => ({ filled: true, fillLevel: 1, reaction: 0 }))
    }
  },
  {
    taskId: "catchFish",
    title: "물고기를 잡다",
    reward: "은빛 물고기",
    snapshot: {
      kind: "catchFish",
      net: { taken: true },
      basket: { stored: 2 }
    }
  }
];

test.describe("일곱 활동 공통 완료 연출", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  for (const activity of completedActivityCases) {
    test(`${activity.title}의 마지막 변화가 표현과 함께 남는다`, async ({ page }) => {
      await seedSave(page, {
        started: true,
        storyIndex: 1,
        flags: ["talkedAunt", "benchRest"],
        activeMiniGame: {
          zoneId: activity.taskId,
          snapshot: activity.snapshot
        }
      });
      await page.goto(GAME_URL);
      await page.locator("#continueButton").click();

      await expect(page.locator("#miniGameTitle")).toHaveText(activity.title);
      await expect(page.locator("#miniGame")).toHaveClass(/is-complete/);
      await expect(page.locator("#miniGameType")).toHaveText("장면에 남은 표현");
      await expect(page.locator("#miniGame")).toBeHidden({ timeout: 4_000 });

      const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
      expect(saved.completedTasks).toContain(activity.taskId);
      expect(saved.basket).toContain(activity.reward);
    });
  }
});

test.describe("작은 스마트폰 활동 화면", () => {
  test.use({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true });

  test("핵심 활동 장면을 180px 이상 확보한다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 1,
      flags: ["talkedAunt"],
      activeMiniGame: { zoneId: "gardenCare", snapshot: null }
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();

    await expectInsideViewport(page, "#miniGame");
    await expectInsideViewport(page, ".activity-stage", 180);
    await expectInsideViewport(page, "#activityCanvas", 180);
    await expect(page.locator(".activity-goal.is-current")).toBeVisible();
    await expect(page.locator(".activity-goal.is-pending")).toBeHidden();
    await expect(page.locator("#activityHint")).toBeHidden();
    await expectInsideViewport(page, "#touchAction", 44);
  });
});

test.describe("스마트폰 홈 표시줄 안전영역", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("34px 하단 안전영역에서도 캔버스와 조작부가 겹치지 않는다", async ({ page }) => {
    await clearSave(page);
    await page.goto(GAME_URL);
    await page.locator("#startButton").click();
    await page.evaluate(() => {
      document.documentElement.style.setProperty("--safe-bottom", "34px");
      window.syncPhoneCanvasToFrame();
    });

    await expectCanvasAspectMatchesDisplay(page);
    await expectCanvasFillsFrame(page);
    await expectInsideViewport(page, "#touchAction", 44);
    const bottomGap = await page.locator("#touchAction").evaluate((element) =>
      window.innerHeight - element.getBoundingClientRect().bottom
    );
    expect(bottomGap).toBeGreaterThanOrEqual(41);
  });
});

const tabletActivityProfiles = [
  { name: "태블릿 세로 활동", viewport: { width: 768, height: 1024 } },
  { name: "태블릿 가로 활동", viewport: { width: 1024, height: 768 } }
];

for (const profile of tabletActivityProfiles) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, isMobile: true, hasTouch: true });

    test("활동 장면과 목표가 조작부 위에 유지된다", async ({ page }) => {
      await seedSave(page, {
        started: true,
        storyIndex: 1,
        flags: ["talkedAunt"],
        activeMiniGame: { zoneId: "gardenCare", snapshot: null }
      });
      await page.goto(GAME_URL);
      await page.locator("#continueButton").click();

      await expectInsideViewport(page, "#miniGame");
      await expectInsideViewport(page, ".activity-stage", 200);
      await expectInsideViewport(page, ".activity-sidebar");
      await expect(page.locator(".activity-goal.is-current")).toHaveCount(1);
      await expectInsideViewport(page, "#miniGameClose", 44);
      await expectInsideViewport(page, "#touchAction", 44);
      await expectCenterHitTarget(page, "#touchAction");
    });
  });
}

test.describe("태블릿 오버레이 시각 회귀", () => {
  test.use({ viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true });

  test("대화는 읽기 폭을 유지한다", async ({ page }) => {
    await clearSave(page);
    await page.goto(GAME_URL);
    await page.locator("#startButton").click();
    await expect(page.locator("#promptBubble")).toContainText("행동 버튼");
    await page.locator("#touchAction").click();
    await expectInsideViewport(page, "#dialogueBox");
    const dialogueWidth = await page.locator("#dialogueBox").evaluate((element) =>
      element.getBoundingClientRect().width
    );
    expect(dialogueWidth).toBeLessThanOrEqual(801);
    await expectInsideViewport(page, "#dialogueNext", 44);
    await page.locator("#dialogueClose").click();
  });

  test("바구니가 가득 차도 현황 패널이 화면 안에 머문다", async ({ page }) => {
    await seedSave(page, {
      started: true,
      storyIndex: 5,
      flags: ["talkedAunt", "benchRest", "talkedChild"],
      basket: ["꽃단장", "잔디결", "모종상자", "싱싱한 채소", "반듯한 고랑", "달걀 꾸러미", "저녁 한 상"]
    });
    await page.goto(GAME_URL);
    await page.locator("#continueButton").click();
    await page.locator("#statsToggle").click();

    await expectInsideViewport(page, "#statsPanel");
    await expect(page.locator(".basket-chip")).toHaveCount(7);
    const panelHeight = await page.locator("#statsPanel").evaluate((element) =>
      element.getBoundingClientRect().height
    );
    expect(panelHeight).toBeLessThanOrEqual(381);
    await page.locator("#saveStatus").scrollIntoViewIfNeeded();
    await expectInsideViewport(page, "#saveStatus");
  });
});

const quizProfiles = [
  { name: "작은 스마트폰 퀴즈", viewport: { width: 320, height: 568 } },
  { name: "태블릿 가로 퀴즈", viewport: { width: 1024, height: 768 } }
];

for (const profile of quizProfiles) {
  test.describe(profile.name, () => {
    test.use({ viewport: profile.viewport, isMobile: true, hasTouch: true });

    test("글자 조각과 퀴즈 버튼이 44px 터치 크기를 유지한다", async ({ page }) => {
      await seedSave(page, {
        started: true,
        player: { x: 536, y: 384, facing: "down", step: 0 },
        camera: { x: 0, y: 0 },
        storyIndex: 1,
        flags: ["talkedAunt"],
        completedTasks: ["gardenCare"]
      });
      await page.goto(GAME_URL);
      await page.locator("#continueButton").click();
      await expect(page.locator("#promptBubble")).toContainText("행동 버튼");
      await page.locator("#touchAction").click();
      await expectInsideViewport(page, "#quizCard");
      await expect(page.locator(".quiz-slot").first()).toBeVisible();
      const slotBox = await page.locator(".quiz-slot").first().boundingBox();
      expect(slotBox.width).toBeGreaterThanOrEqual(44);
      expect(slotBox.height).toBeGreaterThanOrEqual(44);
      await page.locator(".quiz-choice").first().scrollIntoViewIfNeeded();
      await expectInsideViewport(page, ".quiz-choice:first-child", 44);
      await page.locator("#quizClose").scrollIntoViewIfNeeded();
      await expectInsideViewport(page, "#quizClose", 44);
    });
  });
}
