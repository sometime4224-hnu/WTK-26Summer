const { test, expect } = require("@playwright/test");

const CORE_TARGETS = [
  "건강을 유지하다",
  "체력을 기르다",
  "스트레스를 해소하다",
  "비만을 예방하다",
  "계단을 이용하다",
  "걷기 운동을 하다",
  "자세를 교정하다",
  "스트레칭을 하다"
];

const EXPANSION_TARGETS = [
  "계단을 오르다",
  "엘리베이터 대신 계단을 이용하다",
  "맑은 공기를 마시며 걷기 운동을 하다",
  "고개를 천천히 돌리다",
  "두 손을 허리에 대다",
  "몸을 뒤로 젖히다",
  "발뒤꿈치를 들다",
  "팔을 쭉 뻗다"
];

const ALL_TARGETS = [...CORE_TARGETS, ...EXPANSION_TARGETS];
const RECALL_TARGETS = [
  "건강을 유지하다",
  "스트레스를 해소하다",
  "계단을 이용하다",
  "자세를 교정하다",
  "계단을 오르다",
  "고개를 천천히 돌리다",
  "발뒤꿈치를 들다",
  "팔을 쭉 뻗다"
];

async function expectFocused(page, id) {
  await expect
    .poll(() => page.evaluate(() => document.activeElement && document.activeElement.id))
    .toBe(id);
}

async function startTrainer(page) {
  await page.locator("#typingInput").fill("어휘");
  await expect(page.locator("#stageTitle")).toHaveText("핵심");
  await expect(page.locator("#missionTitle")).toHaveText("핵심 어휘");
  await expect(page.locator("#targetText")).toHaveText(CORE_TARGETS[0]);
}

async function completePractice(page) {
  for (const [index, target] of ALL_TARGETS.entries()) {
    await expect(page.locator("#targetText")).toHaveText(target);
    await page.locator("#typingInput").fill(target);
    if (index < ALL_TARGETS.length - 1) {
      await expect(page.locator("#targetText")).toHaveText(ALL_TARGETS[index + 1]);
    }
  }
  await expect(page.locator("#stageTitle")).toHaveText("회상");
}

async function completeRecall(page) {
  for (const [index, target] of RECALL_TARGETS.entries()) {
    await page.locator("#typingInput").fill(target);
    await page.keyboard.press("Enter");
    if (index < RECALL_TARGETS.length - 1) {
      await expect(page.locator("#itemMeta")).toContainText(`${index + 2} / ${RECALL_TARGETS.length}`);
    }
  }
  await expect(page.locator("#stageTitle")).toHaveText("리포트");
}

async function trainerState(page) {
  return page.evaluate(() => window.__C12_VOCAB_ANIMATION_TYPING__.getState());
}

async function sampleStates(page, count = 5, interval = 150) {
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    samples.push(await trainerState(page));
    await page.waitForTimeout(interval);
  }
  return samples;
}

function range(samples, reader) {
  const values = samples.map(reader);
  return Math.max(...values) - Math.min(...values);
}

test.describe("c12 vocabulary animation typing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-motion-typing-game.html");
    await page.evaluate(() => localStorage.removeItem("c12_vocab_animation_typing_v1"));
    await page.reload();
  });

  test("loads the five-stage animation typing trainer", async ({ page }) => {
    await expect(page).toHaveTitle("12과 어휘 표현 애니메이션 타이핑");
    await expect(page.locator(".progress-dot")).toHaveCount(5);
    await expect(page.locator("#stageTitle")).toHaveText("준비");
    await expect(page.locator("#missionTitle")).toHaveText("한/영 확인");
    await expect(page.locator("#targetText")).toHaveText("어휘");
    await expect(page.locator("#targetText .target-char.is-next")).toHaveText("어");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "ready");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "ready");
    await expectFocused(page, "typingInput");
  });

  test("warns for English input and starts core vocabulary automatically", async ({ page }) => {
    await page.locator("#typingInput").fill("eohwi");
    await expect(page.locator("#feedbackText")).toContainText("한/영 키 확인");
    await expect(page.locator("#stageTitle")).toHaveText("준비");

    await startTrainer(page);
    await expectFocused(page, "typingInput");
  });

  test("shows symbolic scenes for abstract core vocabulary", async ({ page }) => {
    await startTrainer(page);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "health-maintain");
    await expect(page.locator('[data-scene="health-maintain"]')).toHaveClass(/is-active/);

    await page.locator("#typingInput").fill("건강을 유지하다");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "stamina-build");
    await expect(page.locator('[data-scene="stamina-build"]')).toHaveClass(/is-active/);

    await page.locator("#typingInput").fill("체력을 기르다");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "stress-relief");

    await page.locator("#typingInput").fill("스트레스를 해소하다");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "obesity-prevent");

    await page.locator("#typingInput").fill("비만을 예방하다");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "stairs-use");
  });

  test("advances through core and expansion expressions without game scoring", async ({ page }) => {
    await startTrainer(page);
    await completePractice(page);
    await expect(page.locator("#practicedMetric")).toHaveText("16");
    await expect(page.locator("#correctMetric")).toHaveText("16");
    await expect(page.locator("#targetLabel")).toHaveText("초성 회상");
    await expect(page.locator("#targetText")).toHaveText("ㄱㄱㅇ ㅇㅈㅎㄷ");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-scene-id", "health-maintain");
    await expect(page.locator(".timer")).toHaveCount(0);
  });

  test("keeps long expression chunks together", async ({ page }) => {
    await startTrainer(page);
    for (const target of ALL_TARGETS.slice(0, 10)) {
      await expect(page.locator("#targetText")).toHaveText(target);
      await page.locator("#typingInput").fill(target);
    }
    await expect(page.locator("#targetText")).toHaveText("맑은 공기를 마시며 걷기 운동을 하다");
    await expect(page.locator("#targetText .target-chunk")).toHaveText(["맑은 공기를 마시며", "걷기 운동을 하다"]);
  });

  test("marks matched and multiple wrong positions in copy and recall modes", async ({ page }) => {
    await startTrainer(page);
    await page.locator("#typingInput").fill("건강을 지키다");
    await expect(page.locator("#feedbackText")).toContainText("틀린 위치");
    await expect(page.locator("#targetText .target-char.is-revealed-correct")).toHaveText(["건", "강", "을"]);
    await expect(page.locator("#targetText .target-char.is-wrong")).toHaveCount(3);

    await page.locator("#typingInput").fill("건강을 유지하다");
    await completePractice(page);
    await page.locator("#typingInput").fill("건강을 지키다");
    await page.keyboard.press("Enter");
    await expect(page.locator("#targetText")).toContainText("건강을");
    await expect(page.locator("#targetText .target-char.is-revealed-correct")).toHaveText(["건", "강", "을"]);
    await expect(page.locator("#targetText .target-char.is-wrong")).toHaveCount(3);
  });

  test("briefly reveals recall answers and produces a report", async ({ page }) => {
    await startTrainer(page);
    await completePractice(page);

    await page.locator("#typingInput").fill(RECALL_TARGETS[0]);
    await page.keyboard.press("Enter");
    await expect(page.locator("#targetText")).toHaveText(RECALL_TARGETS[0]);
    await expect(page.locator("#targetText")).toHaveClass(/is-answer-revealed/);
    await expect(page.locator("#itemMeta")).toContainText("2 / 8");

    for (const [offset, target] of RECALL_TARGETS.slice(1).entries()) {
      await expect(page.locator("#itemMeta")).toContainText(`${offset + 2} / ${RECALL_TARGETS.length}`);
      await page.locator("#typingInput").fill(target);
      await page.keyboard.press("Enter");
    }
    await expect(page.locator("#stageTitle")).toHaveText("리포트");
    await expect(page.locator("#reportPanel")).toBeVisible();
    await expect(page.locator("#finalPracticed")).toHaveText("16");
    await expect(page.locator("#finalRecall")).toHaveText("8");
  });

  test("animates motion coordinates and respects reduced motion", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/c12/writing-motion-typing-game.html");
    await startTrainer(page);
    for (const [index, target] of CORE_TARGETS.slice(0, 5).entries()) {
      await expect(page.locator("#targetText")).toHaveText(target);
      await page.locator("#typingInput").fill(target);
      await expect(page.locator("#targetText")).toHaveText(CORE_TARGETS[index + 1]);
    }
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "walking");

    const samples = await sampleStates(page);
    expect(range(samples, (sample) => sample.pose.leftHand.y) + range(samples, (sample) => sample.pose.leftAnkle.x)).toBeGreaterThan(10);
    await page.close();

    const reducedPage = await browser.newPage();
    await reducedPage.emulateMedia({ reducedMotion: "reduce" });
    await reducedPage.goto("/c12/writing-motion-typing-game.html");
    await startTrainer(reducedPage);
    for (const [index, target] of CORE_TARGETS.slice(0, 5).entries()) {
      await expect(reducedPage.locator("#targetText")).toHaveText(target);
      await reducedPage.locator("#typingInput").fill(target);
      await expect(reducedPage.locator("#targetText")).toHaveText(CORE_TARGETS[index + 1]);
    }
    const first = await trainerState(reducedPage);
    await reducedPage.waitForTimeout(400);
    const second = await trainerState(reducedPage);
    expect(first.reducedMotion).toBe(true);
    expect(second.pose.leftHand.x).toBeCloseTo(first.pose.leftHand.x, 1);
    await reducedPage.close();
  });

  test("is linked from the typing activity hub but not from the c12 hub", async ({ page }) => {
    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    const animationLink = page.locator('a[href="../../c12/writing-motion-typing-game.html"]');
    await expect(animationLink).toHaveCount(1);
    await expect(animationLink).toContainText("12과 어휘 표현 애니메이션 타이핑");

    await animationLink.click();
    await expect(page).toHaveURL(/\/c12\/writing-motion-typing-game\.html$/);
    await expect(page.locator("#missionTitle")).toHaveText("한/영 확인");

    await page.goto("/c12/index.html");
    await expect(page.locator('a[href="writing-motion-typing-game.html"]')).toHaveCount(0);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-motion-typing-game.html");
    await expect(page.locator("#missionTitle")).toBeVisible();
    let overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await startTrainer(page);
    await page.locator("#typingInput").fill("건강을 유지하다");
    await expect(page.locator("#targetText")).toHaveText("체력을 기르다");
    overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
