const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
});

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasOverflow).toBeFalsy();
}

async function expectCanvasHasScenePixels(page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#gameCanvas");
    if (!canvas) {
      return false;
    }
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const points = [
      [0.12, 0.18],
      [0.38, 0.55],
      [0.64, 0.28],
      [0.82, 0.74]
    ];
    const colors = points.map(([xRatio, yRatio]) => {
      const x = Math.floor(canvas.width * xRatio);
      const y = Math.floor(canvas.height * yRatio);
      return Array.from(context.getImageData(x, y, 1, 1).data).join(",");
    });
    return new Set(colors).size >= 3 && colors.some((color) => !color.endsWith(",0"));
  });
}

async function movePlayerTo(page, x, y) {
  await page.evaluate(
    ({ nextX, nextY }) => {
      const state = window.RUMOR_GAME_NEXT.state;
      state.player.x = nextX;
      state.player.y = nextY;
      state.camera.x = Math.max(0, nextX - 480);
      state.camera.y = Math.max(0, nextY - 320);
    },
    { nextX: x, nextY: y }
  );
}

async function startGame(page) {
  await page.evaluate(() => window.RUMOR_GAME_NEXT.actions.startGame({ fullscreen: false }));
  await expect(page.locator("#titleScreen")).toBeHidden();
  await expect(page.locator("body")).toHaveClass(/game-active/);
}

test("c17 rumor game NEXT entry buttons are visibly disabled", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const rootChapterLink = page.locator('a[href="c17/index.html"]');
  await expect(rootChapterLink).toHaveCount(1);
  await expect(rootChapterLink).toContainText("17");

  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="rumor-game-next/index.html"]')).toHaveCount(0);
  const chapterGameButton = page.getByRole("button", { name: "소문 무마 게임 NEXT 현재 비활성화됨" });
  await expect(chapterGameButton).toBeVisible();
  await expect(chapterGameButton).toBeDisabled();
  await expect(chapterGameButton).toContainText("보조 놀이 · 비활성");

  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="rumor-game-next/index.html"]')).toHaveCount(0);
  const vocabGameButton = page.getByRole("button", { name: "보조놀이 현재 비활성화됨" });
  await expect(vocabGameButton).toBeVisible();
  await expect(vocabGameButton).toBeDisabled();

  await page.goto("/c17/vocab-support-rumor-scene.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="rumor-game-next/index.html"]')).toHaveCount(0);
  const sceneGameButton = page.getByRole("button", { name: "보조놀이 현재 비활성화됨" });
  await expect(sceneGameButton).toBeVisible();
  await expect(sceneGameButton).toBeDisabled();
});

test("c17 rumor game NEXT renders and exposes vocabulary systems", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/c17/rumor-game-next/") && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/c17/rumor-game-next/");
  await expect(page).toHaveTitle("소문 무마 게임 NEXT | 17과");
  await expect(page.locator("#titleScreen")).toBeVisible();
  await expect(page.locator("#startButton")).toContainText("시작하기");
  await expect(page.locator("body")).not.toHaveClass(/game-active/);
  await expect(page.locator("#gameCanvas")).toBeVisible();
  await expect(page.locator("#gameCanvas")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("#gameCanvas")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator(".side-panel")).toHaveCount(0);
  await expect(page.locator("#miniMap")).toBeVisible();
  await expect(page.locator("#missionTitle")).toContainText("오해");
  await expect(page.locator("#victoryList li")).toHaveCount(4);
  await expect(page.locator("#expressionToggle")).toContainText("표현·기록");
  await expect(page.locator("#expressionOverlayList li")).toHaveCount(11);
  await expect(page.locator('#expressionOverlayList li[data-fit="clean"]')).toHaveCount(4);
  await expect(page.locator('#expressionOverlayList li[data-fit="state"]')).toHaveCount(3);
  await expect(page.locator('#expressionOverlayList li[data-fit="reference"]')).toHaveCount(4);
  await expect(page.locator("#actionLog")).toContainText("소문");
  await page.locator("#startButton").click();
  await expect(page.locator("#titleScreen")).toBeHidden();
  await expect(page.locator("body")).toHaveClass(/game-active/);
  await expect(page.locator("#gameCanvas")).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("#gameCanvas")).toHaveAttribute("tabindex", "0");
  await page.locator("#expressionToggle").click();
  await expect(page.locator("#expressionOverlay")).toBeVisible();
  await expect(page.locator("#expressionOverlayList li")).toHaveCount(11);
  await expect(page.locator('#expressionOverlayList li[data-fit="clean"]')).toHaveCount(4);
  await page.locator("#expressionClose").click();
  await expect(page.locator("#expressionOverlay")).toBeHidden();
  await expectCanvasHasScenePixels(page);
  await expectNoHorizontalOverflow(page);
  const startedCheckpoint = await page.evaluate(() => (
    JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1"))
  ));
  expect(startedCheckpoint.state.checkpointVersion).toBe(2);
  expect(startedCheckpoint.state.started).toBe(true);
  expect(startedCheckpoint.state.slimes).toHaveLength(2);
  expect(startedCheckpoint.state.villain).toMatchObject({ mode: "seeking" });
  await page.evaluate(() => window.RUMOR_GAME_NEXT.actions.restart());
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#startButton")).toContainText("이어하기");
  const restartedCheckpoint = await page.evaluate(() => (
    JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1"))
  ));
  expect(restartedCheckpoint.state.started).toBe(true);
  expect(restartedCheckpoint.state.won).toBe(false);
  expect(errors).toEqual([]);
});

test("c17 rumor game NEXT lets player resolve an NPC with possibility and emotion expressions", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const firstNpc = await page.evaluate(() => {
    const npc = window.RUMOR_GAME_NEXT.state.npcs[0];
    return {
      x: npc.x,
      y: npc.y,
      answer: npc.answer,
      emotionAnswer: npc.emotionAnswer,
      resolutionAnswer: npc.resolutionAnswer,
      id: npc.id
    };
  });

  await movePlayerTo(page, firstNpc.x, firstNpc.y);
  await page.keyboard.press("Space");
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueStep")).toContainText("가능성");
  await expect(page.locator("#dialogueText")).toContainText("저를 싫어하는 것 같아요");
  await expect(page.locator("#dialogueClue")).toContainText("가능성 표현을 고르세요");
  await expect(page.locator("[data-expression]")).toHaveCount(2);
  await expect(page.locator('[data-expression="no-reason"]')).toContainText("그럴 리가 없어요");
  await page.locator('[data-expression="possible"]').click();
  await expect(page.locator("#dialogueClue")).toContainText("단서 다시 보기");
  const wrongFeedback = await page.evaluate((npcId) => {
    const state = window.RUMOR_GAME_NEXT.state;
    const npc = state.npcs.find((item) => item.id === npcId);
    return {
      mood: npc.mood,
      cueKinds: state.visualCues.map((cue) => cue.kind)
    };
  }, firstNpc.id);
  expect(wrongFeedback.mood).toBe("confused");
  expect(wrongFeedback.cueKinds).toContain("confused");
  await page.locator(`[data-expression="${firstNpc.answer}"]`).click();
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueStep")).toHaveText("확인 완료");
  await expect(page.locator("#dialogueClue")).toContainText("그럴 리가 없어요");
  await expect(page.locator("#dialogueFeedback")).toContainText("실망했어요");
  await expect(page.locator("#dialogueFeedback")).toContainText("화해해요");
  await page.locator("[data-dialogue-continue]").click();
  await expect(page.locator("#dialogue")).toBeHidden();

  const result = await page.evaluate((npcId) => {
    const npc = window.RUMOR_GAME_NEXT.state.npcs.find((item) => item.id === npcId);
    return {
      status: npc.status,
      emotion: npc.emotion,
      mood: npc.mood,
      cueKinds: window.RUMOR_GAME_NEXT.state.visualCues.map((cue) => cue.kind),
      allies: window.RUMOR_GAME_NEXT.state.npcs.filter((item) => item.status === "ally").length,
      log: window.RUMOR_GAME_NEXT.state.actionLog[0]
    };
  }, firstNpc.id);
  expect(result.status).toBe("ally");
  expect(result.emotion).toBe("화해하다");
  expect(result.mood).toBe("relieved");
  expect(result.cueKinds).toEqual(expect.arrayContaining(["heart", "spark"]));
  expect(result.allies).toBe(1);
  expect(result.log).toContain("화해하다");
});

test("c17 rumor game NEXT lets allies request emotional support and improve efficiency", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const allyInfo = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const npc = state.npcs[0];
    npc.status = "ally";
    npc.allyLevel = 1;
    npc.distressed = true;
    npc.supportNeed = {
      id: "test-support",
      answer: "disappointed",
      line: "소문 슬라임이 계속 와요. 조금 실망했어요.",
      clue: "기대와 달라서 마음이 상한 상태입니다."
    };
    state.slimes.push(window.RUMOR_GAME_NEXT.actions.createSlime(npc.x + 20, npc.y + 20, npc.id, 55));
    return { x: npc.x, y: npc.y, id: npc.id };
  });

  await movePlayerTo(page, allyInfo.x, allyInfo.y);
  await page.keyboard.press("Space");
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueStep")).toContainText("상태 확인");
  await expect(page.locator("#dialogueText")).toContainText("실망했어요");
  await expect(page.locator("[data-repair]")).toHaveCount(3);
  await expect(page.locator('[data-repair="disappointed"]')).toContainText("실망했어요");
  await page.locator('[data-repair="disappointed"]').click();

  const result = await page.evaluate((npcId) => {
    const npc = window.RUMOR_GAME_NEXT.state.npcs.find((item) => item.id === npcId);
    return {
      allyLevel: npc.allyLevel,
      distressed: npc.distressed,
      mood: npc.mood,
      cueKinds: window.RUMOR_GAME_NEXT.state.visualCues.map((cue) => cue.kind),
      log: window.RUMOR_GAME_NEXT.state.actionLog[0]
    };
  }, allyInfo.id);
  expect(result.allyLevel).toBe(2);
  expect(result.distressed).toBeFalsy();
  expect(result.mood).toBe("confident");
  expect(result.cueKinds).toContain("level");
  expect(result.log).toContain("우군 효율 Lv.2");
});

test("c17 rumor game NEXT lets players actively encourage allies to raise efficiency", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const allyInfo = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const npc = state.npcs[0];
    npc.status = "ally";
    npc.allyLevel = 1;
    npc.distressed = false;
    npc.distressTimer = 999;
    npc.encourageTimer = 0;
    state.slimes = [];
    npc.supportNeed = {
      id: "test-encourage",
      answer: "misunderstand",
      line: "제가 또 잘못 들은 것 같아요. 헷갈려요.",
      clue: "상황을 잘못 이해한 상태입니다."
    };
    return { x: npc.x, y: npc.y, id: npc.id, answer: npc.supportNeed.answer };
  });

  await movePlayerTo(page, allyInfo.x, allyInfo.y);
  await page.keyboard.press("Space");
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueStep")).toContainText("우군 훈련");
  await expect(page.locator("#dialogueClue")).toContainText("훈련 단서");
  await page.locator(`[data-repair="${allyInfo.answer}"]`).click();

  const result = await page.evaluate((npcId) => {
    const npc = window.RUMOR_GAME_NEXT.state.npcs.find((item) => item.id === npcId);
    return {
      allyLevel: npc.allyLevel,
      encourageTimer: npc.encourageTimer,
      log: window.RUMOR_GAME_NEXT.state.actionLog[0]
    };
  }, allyInfo.id);
  expect(result.allyLevel).toBe(2);
  expect(result.encourageTimer).toBeGreaterThan(0);
  expect(result.log).toContain("우군 격려");
});

test("c17 rumor game NEXT shows villain spreading rumors through a whisper loop", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const targetInfo = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const target = state.npcs[1];
    state.slimes = [];
    state.rumorMotes = [];
    state.villain.x = target.x - 70;
    state.villain.y = target.y - 18;
    state.villain.targetId = target.id;
    state.villain.mode = "seeking";
    state.villain.cooldown = 0;
    return { id: target.id };
  });

  await page.waitForFunction(() => window.RUMOR_GAME_NEXT.state.villain.mode === "whisper");
  await page.waitForFunction(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const target = state.npcs.find((npc) => npc.id === state.villain.targetId);
    return target && target.whisperProgress > 0.15 && target.whisperProgress < 1;
  });
  const whisperState = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const target = state.npcs.find((npc) => npc.id === state.villain.targetId);
    return {
      mode: state.villain.mode,
      targetProgress: target?.whisperProgress ?? 0
    };
  });
  expect(whisperState.mode).toBe("whisper");
  expect(whisperState.targetProgress).toBeGreaterThan(0.15);
  expect(whisperState.targetProgress).toBeLessThan(1);

  await page.waitForFunction(() => window.RUMOR_GAME_NEXT.state.slimes.length >= 2);
  const spreadResult = await page.evaluate((npcId) => {
    const state = window.RUMOR_GAME_NEXT.state;
    const target = state.npcs.find((npc) => npc.id === npcId);
    return {
      slimes: state.slimes.length,
      doubt: target.doubt,
      targetMood: target.mood,
      villainMood: state.villain.mood,
      cueKinds: state.visualCues.map((cue) => cue.kind),
      log: state.actionLog[0]
    };
  }, targetInfo.id);
  expect(spreadResult.slimes).toBeGreaterThanOrEqual(2);
  expect(spreadResult.doubt).toBeGreaterThan(100);
  expect(spreadResult.targetMood).toBe("worried");
  expect(spreadResult.villainMood).toBe("smug");
  expect(spreadResult.cueKinds).toEqual(expect.arrayContaining(["rumor", "spawn"]));
  expect(spreadResult.log).toContain("빌런");
});

test("c17 rumor game NEXT supports direct rumor slime clearing", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const slime = await page.evaluate(() => {
    const target = window.RUMOR_GAME_NEXT.state.slimes[0];
    target.x = 260;
    target.y = 520;
    return { x: target.x, y: target.y, before: window.RUMOR_GAME_NEXT.state.slimes.length };
  });
  await movePlayerTo(page, slime.x, slime.y);
  await page.keyboard.press("Space");

  const after = await page.evaluate(() => ({
    count: window.RUMOR_GAME_NEXT.state.slimes.length,
    playerMood: window.RUMOR_GAME_NEXT.state.player.mood,
    cueKinds: window.RUMOR_GAME_NEXT.state.visualCues.map((cue) => cue.kind),
    log: window.RUMOR_GAME_NEXT.state.actionLog[0]
  }));
  expect(after.count).toBeLessThan(slime.before);
  expect(after.playerMood).toBe("confirm");
  expect(after.cueKinds).toContain("clear");
  expect(after.log).toContain("직접 확인");
});

test("c17 rumor game NEXT gives stubborn rumor slimes a two-check interaction", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const slime = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    state.slimes = [];
    const stubborn = window.RUMOR_GAME_NEXT.actions.createSlime(260, 520, "test", 2);
    stubborn.vx = 0;
    stubborn.vy = 0;
    state.slimes.push(stubborn);
    return { x: stubborn.x, y: stubborn.y, id: stubborn.id };
  });

  await movePlayerTo(page, slime.x, slime.y);
  await page.keyboard.press("Space");
  const afterFirst = await page.evaluate((slimeId) => {
    const slime = window.RUMOR_GAME_NEXT.state.slimes.find((item) => item.id === slimeId);
    return {
      count: window.RUMOR_GAME_NEXT.state.slimes.length,
      hp: slime?.hp,
      log: window.RUMOR_GAME_NEXT.state.actionLog[0]
    };
  }, slime.id);
  expect(afterFirst.count).toBe(1);
  expect(afterFirst.hp).toBe(1);
  expect(afterFirst.log).toContain("한 번 더");

  await page.keyboard.press("Space");
  const afterSecond = await page.evaluate(() => ({
    count: window.RUMOR_GAME_NEXT.state.slimes.length,
    log: window.RUMOR_GAME_NEXT.state.actionLog[0]
  }));
  expect(afterSecond.count).toBe(0);
  expect(afterSecond.log).toContain("끈질긴 소문");
});

test("c17 rumor game NEXT keeps the learning target and first action visible at required sizes", async ({ page }) => {
  const sizes = [
    { width: 390, height: 844, label: "mobile" },
    { width: 320, height: 844, label: "narrow mobile" },
    { width: 1440, height: 900, label: "desktop" },
    { width: 720, height: 450, label: "desktop at 200 percent equivalent" }
  ];

  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto("/c17/rumor-game-next/", { waitUntil: "domcontentloaded" });
    const layout = await page.evaluate(() => {
      const title = document.querySelector(".title-screen h1").getBoundingClientRect();
      const action = document.querySelector("#startButton").getBoundingClientRect();
      return {
        titleTop: title.top,
        actionTop: action.top,
        actionBottom: action.bottom,
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1
      };
    });
    expect(layout.titleTop, size.label).toBeLessThanOrEqual(280);
    expect(layout.actionTop, size.label).toBeGreaterThanOrEqual(0);
    expect(layout.actionBottom, size.label).toBeLessThanOrEqual(size.height);
    expect(layout.overflow, size.label).toBeFalsy();
  }
});

test("c17 rumor game NEXT centers the world on an ultrawide play surface", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#gameCanvas");
    const rect = canvas.getBoundingClientRect();
    return canvas.width === Math.round(rect.width * Math.min(devicePixelRatio || 1, 2))
      && canvas.height === Math.round(rect.height * Math.min(devicePixelRatio || 1, 2));
  });
  await page.waitForTimeout(80);
  await expectCanvasHasScenePixels(page);
  const gutters = await page.evaluate(() => {
    const canvas = document.querySelector("#gameCanvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const scaleX = canvas.width / canvas.getBoundingClientRect().width;
    const scaleY = canvas.height / canvas.getBoundingClientRect().height;
    const sample = (x, y) => Array.from(context.getImageData(Math.floor(x * scaleX), Math.floor(y * scaleY), 1, 1).data);
    return {
      left: sample(12, 720),
      right: sample(2548, 720),
      middle: sample(1280, 720)
    };
  });
  expect(gutters.left[3]).toBe(255);
  expect(gutters.right[3]).toBe(255);
  expect(gutters.left.slice(0, 3)).toEqual(gutters.right.slice(0, 3));
  expect(gutters.left.slice(0, 3)).not.toEqual([247, 239, 226]);
  expect(gutters.middle.slice(0, 3)).not.toEqual(gutters.left.slice(0, 3));
});

test("c17 rumor game NEXT supports keyboard activation and restores focus", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await page.locator("#startButton").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#titleScreen")).toBeHidden();
  await expect(page.locator("#gameCanvas")).toBeFocused();

  const firstNpc = await page.evaluate(() => {
    const npc = window.RUMOR_GAME_NEXT.state.npcs[0];
    return { id: npc.id, x: npc.x, y: npc.y, answer: npc.answer };
  });
  await movePlayerTo(page, firstNpc.x, firstNpc.y);
  await page.keyboard.press("Space");
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueOptions button").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("#dialogueOptions button").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#dialogueOptions button").first()).toBeFocused();
  await page.locator(`[data-expression="${firstNpc.answer}"]`).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#dialogueStep")).toHaveText("확인 완료");
  await expect(page.locator("[data-dialogue-continue]")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#dialogue")).toBeHidden();
  await expect(page.locator("#gameCanvas")).toBeFocused();

  await page.locator("#expressionToggle").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#expressionOverlay")).toBeVisible();
  await expect(page.locator("#expressionClose")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#expressionClose")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#expressionOverlay")).toBeHidden();
  await expect(page.locator("#expressionToggle")).toBeFocused();
});

test("c17 rumor game NEXT balances correct option positions as choices expand", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);

  const positions = [];
  const optionCounts = [];
  for (let index = 0; index < 5; index += 1) {
    const answer = await page.evaluate((targetIndex) => {
      const state = window.RUMOR_GAME_NEXT.state;
      state.activeDialogue = null;
      state.npcs.forEach((npc, npcIndex) => {
        npc.status = npcIndex < targetIndex ? "ally" : "misled";
        npc.allyLevel = npcIndex < targetIndex ? 1 : 0;
      });
      const target = state.npcs[targetIndex];
      window.RUMOR_GAME_NEXT.actions.openDialogue(target);
      return target.answer;
    }, index);
    const ids = await page.locator("[data-expression]").evaluateAll((buttons) => buttons.map((button) => button.dataset.expression));
    positions.push(ids.indexOf(answer));
    optionCounts.push(ids.length);
  }

  expect(optionCounts).toEqual([2, 3, 3, 4, 4]);
  expect(positions).toEqual([0, 1, 2, 3, 0]);
  expect(new Set(positions).size).toBe(4);
});

test("c17 rumor game NEXT restores world, slime, and in-dialogue progress", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  const expected = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    state.player.x = 777;
    state.player.y = 555;
    state.villain.x = 888;
    state.villain.y = 222;
    state.villain.mode = "cooldown";
    state.villain.cooldown = 4.5;
    state.villain.targetId = null;
    const slime = window.RUMOR_GAME_NEXT.actions.createSlime(704, 608, "checkpoint-test", 2);
    slime.hp = 1;
    slime.vx = 12;
    slime.vy = -8;
    state.slimes = [slime];
    const npc = state.npcs[1];
    window.RUMOR_GAME_NEXT.actions.openDialogue(npc);
    window.RUMOR_GAME_NEXT.actions.handleOption("possibility", "possible");
    window.dispatchEvent(new PageTransitionEvent("pagehide"));
    return { slimeId: slime.id, npcId: npc.id };
  });

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1")));
  expect(saved.state).toMatchObject({ checkpointVersion: 2, started: true, won: false });
  expect(saved.state.slimes).toHaveLength(1);
  expect(saved.state.activeDialogue).toMatchObject({ npcId: expected.npcId, missCount: 1 });

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#startButton")).toHaveText("이어하기");
  const restored = await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    return {
      player: state.player,
      villain: state.villain,
      slime: state.slimes[0],
      dialogue: state.activeDialogue,
      running: state.running
    };
  });
  expect(restored.player).toMatchObject({ x: 777, y: 555 });
  expect(restored.villain).toMatchObject({ x: 888, y: 222, mode: "cooldown" });
  expect(restored.slime).toMatchObject({ id: expected.slimeId, x: 704, y: 608, hp: 1 });
  expect(restored.dialogue).toMatchObject({ npcId: expected.npcId, missCount: 1 });
  expect(restored.running).toBeFalsy();

  await page.locator("#startButton").click();
  await expect(page.locator("#dialogue")).toBeVisible();
  await expect(page.locator("#dialogueClue")).toContainText("단서 다시 보기");
  await expect(page.locator("#dialogueOptions button").first()).toBeFocused();
});

test("c17 rumor game NEXT upgrades a compatible legacy checkpoint without losing resume state", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("korean3b.c17.rumor-game-next.v1", JSON.stringify({
      schemaVersion: 1,
      pageId: "rumor-game-next",
      state: {
        started: true,
        won: false,
        player: { x: 510, y: 420 },
        npcs: [{ id: "minji", status: "ally", allyLevel: 1, emotion: "화해하다" }],
        actionLog: ["이전 버전 기록"]
      }
    }));
  });
  await page.goto("/c17/rumor-game-next/");
  await expect(page.locator("#startButton")).toHaveText("이어하기");
  expect(await page.evaluate(() => window.RUMOR_GAME_NEXT.state.npcs[0].status)).toBe("ally");

  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  const upgraded = await page.evaluate(() => JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1")));
  expect(upgraded.state.checkpointVersion).toBe(2);
  expect(upgraded.state.started).toBe(true);
  expect(upgraded.state.npcs[0].status).toBe("ally");
  expect(upgraded.state.slimes).toHaveLength(2);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#startButton")).toHaveText("이어하기");
});

test("c17 rumor game NEXT preserves an unsupported checkpoint byte for byte", async ({ page }) => {
  const raw = JSON.stringify({
    schemaVersion: 1,
    pageId: "rumor-game-next",
    state: {
      checkpointVersion: 99,
      started: true,
      won: false,
      player: { x: 240, y: 520 },
      npcs: [],
      actionLog: []
    }
  });
  await page.addInitScript((record) => localStorage.setItem("korean3b.c17.rumor-game-next.v1", record), raw);
  await page.goto("/c17/rumor-game-next/");
  await expect(page.locator("#activityStateTools")).toContainText("읽을 수 없습니다");
  await page.locator("#startButton").click();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide")));
  expect(await page.evaluate(() => localStorage.getItem("korean3b.c17.rumor-game-next.v1"))).toBe(raw);
});

test("c17 rumor game NEXT restores completion and restarts from the result action", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    state.slimes = [];
    state.npcs.slice(0, 4).forEach((npc) => {
      npc.status = "ally";
      npc.allyLevel = 2;
      npc.distressed = false;
    });
    const last = state.npcs[4];
    window.RUMOR_GAME_NEXT.actions.resolveNpc(last, last.answer);
  });
  await expect(page.locator("#finishCard")).toBeVisible();
  await expect(page.locator("#restartButton")).toBeFocused();
  const completed = await page.evaluate(() => JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1")));
  expect(completed.state.won).toBe(true);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#startButton")).toHaveText("완료 결과 보기");
  await page.locator("#startButton").click();
  await expect(page.locator("#finishCard")).toBeVisible();
  await expect(page.locator("#finishSummary")).toContainText("우군 효율 합계 9");
  await expect(page.locator("#restartButton")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("link", { name: "어휘로 돌아가기" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#restartButton")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#finishCard")).toBeHidden();
  await expect(page.locator("#gameCanvas")).toBeFocused();
  const restarted = await page.evaluate(() => ({
    won: window.RUMOR_GAME_NEXT.state.won,
    running: window.RUMOR_GAME_NEXT.state.running,
    saved: JSON.parse(localStorage.getItem("korean3b.c17.rumor-game-next.v1")).state
  }));
  expect(restarted.won).toBe(false);
  expect(restarted.running).toBe(true);
  expect(restarted.saved).toMatchObject({ started: true, won: false, checkpointVersion: 2 });
});

test("c17 rumor game NEXT pauses rumor spread while a learning overlay is open", async ({ page }) => {
  await page.goto("/c17/rumor-game-next/");
  await startGame(page);
  await page.evaluate(() => {
    const state = window.RUMOR_GAME_NEXT.state;
    const target = state.npcs[0];
    state.slimes = [];
    state.villain.targetId = target.id;
    state.villain.mode = "whisper";
    state.villain.whisperTimer = 1.2;
    state.villain.moteTimer = 0.1;
  });
  await page.locator("#expressionToggle").click();
  const before = await page.evaluate(() => window.RUMOR_GAME_NEXT.state.villain.whisperTimer);
  await page.waitForTimeout(700);
  const after = await page.evaluate(() => ({
    timer: window.RUMOR_GAME_NEXT.state.villain.whisperTimer,
    slimes: window.RUMOR_GAME_NEXT.state.slimes.length,
    mode: window.RUMOR_GAME_NEXT.state.villain.mode
  }));
  expect(Math.abs(after.timer - before)).toBeLessThan(0.03);
  expect(after.slimes).toBe(0);
  expect(after.mode).toBe("whisper");
});

test("c17 rumor game NEXT uses an accessible immersive mobile direction pad", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c17/rumor-game-next/");
  await expect(page.locator("#titleScreen")).toBeVisible();
  await page.locator("#startButton").click();
  await expect(page.locator("#titleScreen")).toBeHidden();
  await expect(page.locator(".mobile-controls")).toBeVisible();
  await expect(page.locator("[data-action='move']")).toHaveCount(4);

  const safeLayout = await page.evaluate(() => {
    const goals = document.querySelector(".victory-card").getBoundingClientRect();
    const toast = document.querySelector("#toast").getBoundingClientRect();
    const prompt = document.querySelector("#prompt").getBoundingClientRect();
    const map = document.querySelector(".mini-map-card").getBoundingClientRect();
    return {
      toastBelowGoals: toast.top >= goals.bottom,
      promptLeftOfMap: prompt.right <= map.left
    };
  });
  expect(safeLayout.toastBelowGoals).toBeTruthy();
  expect(safeLayout.promptLeftOfMap).toBeTruthy();

  const before = await page.evaluate(() => window.RUMOR_GAME_NEXT.state.player.x);
  const rightButton = page.getByRole("button", { name: "오른쪽으로 이동" });
  const box = await rightButton.boundingBox();
  expect(box).toBeTruthy();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.waitForFunction((startX) => window.RUMOR_GAME_NEXT.state.player.x > startX + 20, before);
  await page.mouse.up();

  const after = await page.evaluate(() => ({
    x: window.RUMOR_GAME_NEXT.state.player.x,
    bodyClass: document.body.className,
    controlsVisible: getComputedStyle(document.querySelector(".mobile-controls")).display !== "none",
    fullscreen: Boolean(document.fullscreenElement)
  }));
  expect(after.x).toBeGreaterThan(before);
  expect(after.bodyClass).toContain("game-active");
  expect(after.controlsVisible).toBeTruthy();
  expect(after.fullscreen).toBeFalsy();
  await expectNoHorizontalOverflow(page);
});
