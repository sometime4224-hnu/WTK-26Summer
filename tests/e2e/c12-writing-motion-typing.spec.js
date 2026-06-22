const { test, expect } = require("@playwright/test");

const MOTION_TARGETS = [
  "계단을 이용하다",
  "걷기 운동을 하다",
  "스트레칭을 하다",
  "계단을 오르다",
  "엘리베이터 대신 계단을 이용하다",
  "맑은 공기를 마시며 걷기 운동을 하다",
  "고개를 천천히 돌리다",
  "두 손을 허리에 대다",
  "몸을 뒤로 젖히다",
  "발뒤꿈치를 들다",
  "팔을 쭉 뻗다"
];

const MOTION_IDS = [
  "stairs-use",
  "walking",
  "stretching",
  "stairs-climb",
  "stairs-instead",
  "fresh-walk",
  "neck-turn",
  "hands-waist",
  "lean-back",
  "heel-lift",
  "arm-stretch"
];

const RECALL1_FIRST_DISPLAY = "ㄱㄷㅇ ㅇㅇㅎㄷ";
const RECALL2_FIRST_DISPLAY = "계단? ????";

async function expectFocused(page, id) {
  await expect
    .poll(() => page.evaluate(() => document.activeElement && document.activeElement.id))
    .toBe(id);
}

async function completeWarmup(page) {
  await page.locator("#typingInput").fill("동작");
  await expect(page.locator("#stageTitle")).toHaveText("동작 표현");
  await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[0]);
  await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", MOTION_IDS[0]);
  await expectFocused(page, "typingInput");
}

async function completeMotionItems(page, stopBeforeIndex = MOTION_TARGETS.length) {
  for (let index = 0; index < stopBeforeIndex; index += 1) {
    await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index]);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", MOTION_IDS[index]);
    await page.locator("#typingInput").fill(MOTION_TARGETS[index]);
    if (index < stopBeforeIndex - 1) {
      await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index + 1]);
    }
  }
}

async function reachRecall1(page) {
  await completeWarmup(page);
  await completeMotionItems(page);
  await expect(page.locator("#stageTitle")).toHaveText("회상 1: 초성 회상");
}

async function completeRecall1(page) {
  for (const [index, target] of MOTION_TARGETS.entries()) {
    await expect(page.locator("#itemMeta")).toContainText(`${index + 1} / 11`);
    await page.locator("#typingInput").fill(target);
    await page.keyboard.press("Enter");
    await expect(page.locator("#targetText")).toHaveText(target);
  }
  await expect(page.locator("#stageTitle")).toHaveText("회상 2: 부분 가림 회상");
}

async function motionState(page) {
  return page.evaluate(() => window.__C12_MOTION_TYPING__.getMotionState());
}

async function sampleMotionStates(page, count = 5, interval = 160) {
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    samples.push(await motionState(page));
    await page.waitForTimeout(interval);
  }
  return samples;
}

function numericRange(samples, reader) {
  const values = samples.map(reader);
  return Math.max(...values) - Math.min(...values);
}

async function reachMotionIndex(page, index) {
  await completeWarmup(page);
  if (index > 0) await completeMotionItems(page, index);
  await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index]);
  await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", MOTION_IDS[index]);
}

async function advanceMotionItem(page, index) {
  await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index]);
  await page.locator("#typingInput").fill(MOTION_TARGETS[index]);
  if (index < MOTION_TARGETS.length - 1) {
    await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index + 1]);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", MOTION_IDS[index + 1]);
  }
}

test.describe("c12 motion expression typing trainer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/c12/writing-motion-typing.html");
    await page.evaluate(() => {
      localStorage.removeItem("c12_motion_expression_typing_trainer_v1");
      localStorage.removeItem("preferred-lang");
    });
    await page.reload();
  });

  test("loads the focused five-stage motion typing page", async ({ page }) => {
    await expect(page).toHaveTitle("12과 동작 표현 타이핑 연습");
    await expect(page.locator(".mission-panel.is-current-task")).toBeVisible();
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expect(page.locator(".progress-dot")).toHaveCount(5);
    await expect(page.locator("#targetText")).toHaveText("동작");
    await expect(page.locator("#targetText .target-char.is-next")).toHaveText("동");
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "ready");
    await expectFocused(page, "typingInput");
  });

  test("keeps the standard multilingual toggle behavior", async ({ page }) => {
    await expect(page.locator("[data-multilang-bar]")).toBeVisible();
    await expect(page.locator("[data-multilang-btn]")).toHaveCount(9);
    await expect(page.locator('[data-lang="en"]')).toBeHidden();

    await page.locator('[data-multilang-btn="en"]').click();
    await page.locator("#typingInput").fill("동작");
    await expect(page.locator("#stageTitle")).toHaveText("동작 표현");
    await expect(page.locator('[data-lang="en"]')).toBeVisible();
    await expect(page.locator('[data-lang="en"]')).toContainText("Use the stairs");

    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator('[data-lang="ar"]')).toBeVisible();
    await expect(page.locator('[data-lang="ar"]')).toHaveAttribute("dir", "rtl");
  });

  test("warns for English input and auto-advances from warmup", async ({ page }) => {
    await page.locator("#typingInput").fill("dongjak");
    await expect(page.locator("#feedbackText")).toContainText("한/영 키 확인");
    await expect(page.locator("#stageTitle")).toHaveText("한/영 확인");
    await expectFocused(page, "typingInput");

    await completeWarmup(page);
  });

  test("auto-advances through all eleven motion expressions with matching animations", async ({ page }) => {
    await completeWarmup(page);

    const representative = new Map([
      ["walking", "legs"],
      ["stairs-climb", "stairs"],
      ["neck-turn", "head"],
      ["hands-waist", "waist"],
      ["heel-lift", "heels"],
      ["arm-stretch", "arms"]
    ]);

    for (let index = 0; index < MOTION_TARGETS.length; index += 1) {
      await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[index]);
      await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", MOTION_IDS[index]);
      if (representative.has(MOTION_IDS[index])) {
        await expect(page.locator(`[data-motion-part="${representative.get(MOTION_IDS[index])}"].is-focus`).first()).toBeVisible();
      }
      await page.locator("#typingInput").fill(MOTION_TARGETS[index]);
    }

    await expect(page.locator("#stageTitle")).toHaveText("회상 1: 초성 회상");
    await expect(page.locator("#targetText")).toHaveText(RECALL1_FIRST_DISPLAY);
  });

  test("animates walking and fresh-air walking through changing joint coordinates", async ({ page }) => {
    await reachMotionIndex(page, 1);
    const walkingSamples = await sampleMotionStates(page);
    expect(walkingSamples[0].motionId).toBe("walking");
    expect(
      numericRange(walkingSamples, (sample) => sample.pose.leftHand.y) +
      numericRange(walkingSamples, (sample) => sample.pose.leftAnkle.x)
    ).toBeGreaterThan(12);

    for (let index = 1; index < 5; index += 1) await advanceMotionItem(page, index);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "fresh-walk");

    const freshSamples = await sampleMotionStates(page);
    expect(
      numericRange(freshSamples, (sample) => sample.pose.rightHand.y) +
      numericRange(freshSamples, (sample) => sample.pose.airOffset)
    ).toBeGreaterThan(16);
    await expect(page.locator('[data-motion-part="air"].is-focus')).toBeVisible();
  });

  test("moves the figure up stairs and turns only the head for neck turning", async ({ page }) => {
    await reachMotionIndex(page, 3);
    const stairsSamples = await sampleMotionStates(page);
    expect(stairsSamples[0].motionId).toBe("stairs-climb");
    expect(numericRange(stairsSamples, (sample) => sample.pose.waist.x)).toBeGreaterThan(8);
    expect(numericRange(stairsSamples, (sample) => sample.pose.waist.y)).toBeGreaterThan(8);

    for (let index = 3; index < 6; index += 1) await advanceMotionItem(page, index);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "neck-turn");

    const neckSamples = await sampleMotionStates(page);
    expect(numericRange(neckSamples, (sample) => sample.pose.head.x)).toBeGreaterThan(12);
    expect(numericRange(neckSamples, (sample) => sample.pose.chest.x)).toBeLessThan(1);
    expect(numericRange(neckSamples, (sample) => sample.pose.waist.x)).toBeLessThan(1);
  });

  test("renders hands-waist, heel-lift, and arm-stretch with pose-specific geometry", async ({ page }) => {
    await reachMotionIndex(page, 7);
    const waistPose = (await motionState(page)).pose;
    expect(Math.abs(waistPose.leftHand.x - waistPose.leftHip.x)).toBeLessThan(16);
    expect(Math.abs(waistPose.rightHand.x - waistPose.rightHip.x)).toBeLessThan(16);
    expect(Math.abs(waistPose.leftHand.y - waistPose.waist.y)).toBeLessThan(8);
    expect(Math.abs(waistPose.rightHand.y - waistPose.waist.y)).toBeLessThan(8);

    for (let index = 7; index < 9; index += 1) await advanceMotionItem(page, index);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "heel-lift");
    const heelSamples = await sampleMotionStates(page, 7, 130);
    expect(numericRange(heelSamples, (sample) => sample.pose.leftToe.y)).toBeLessThan(1);
    expect(Math.min(...heelSamples.map((sample) => sample.pose.leftHeel.y))).toBeLessThan(Math.min(...heelSamples.map((sample) => sample.pose.leftToe.y)) - 8);

    await advanceMotionItem(page, 9);
    await expect(page.locator("#motionPanel")).toHaveAttribute("data-motion-id", "arm-stretch");
    const armPose = (await sampleMotionStates(page, 4, 160)).at(-1).pose;
    expect(armPose.leftHand.x).toBeLessThan(armPose.leftShoulder.x - 70);
    expect(armPose.rightHand.x).toBeGreaterThan(armPose.rightShoulder.x + 70);
    await expect(page.locator('[data-motion-part="arms"].is-focus').first()).toBeVisible();
  });

  test("shows the representative pose without a running loop when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await reachMotionIndex(page, 1);

    const first = await motionState(page);
    await page.waitForTimeout(450);
    const second = await motionState(page);
    expect(first.reducedMotion).toBe(true);
    expect(second.reducedMotion).toBe(true);
    expect(second.pose.leftHand.x).toBeCloseTo(first.pose.leftHand.x, 1);
    expect(second.pose.leftAnkle.x).toBeCloseTo(first.pose.leftAnkle.x, 1);
  });

  test("renders fresh-air walking as a meaning chunk and marks wrong positions", async ({ page }) => {
    await completeWarmup(page);
    await completeMotionItems(page, 5);
    await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[5]);
    await expect(page.locator(".target-chunk").filter({ hasText: "걷기 운동을 하다" })).toHaveCount(1);

    await page.locator("#typingInput").fill("맑은 공기를 마시며 걷기 산책을 하다");
    await expect(page.locator("#targetText .target-char.is-wrong")).toHaveText(["운", "동"]);
  });

  test("reveals recall feedback and briefly shows correct answers before advancing", async ({ page }) => {
    await reachRecall1(page);
    await expect(page.locator("#targetText")).toHaveText(RECALL1_FIRST_DISPLAY);
    await expect(page.locator("#targetText")).not.toHaveText(MOTION_TARGETS[0]);

    await page.locator("#typingInput").fill("계단을 쓰다");
    await page.keyboard.press("Enter");
    await expect(page.locator("#feedbackText")).toContainText("다시 입력하세요");
    await expect(page.locator("#targetText")).toContainText("계단을");
    await expect(page.locator("#targetText .target-char.is-revealed-correct")).toHaveText(["계", "단", "을"]);
    await expect(page.locator("#targetText .target-char.is-wrong")).toHaveText(["ㅇ", "ㅇ"]);
    await expect(page.locator("#targetText")).not.toHaveText(MOTION_TARGETS[0]);

    await page.locator("#typingInput").fill(MOTION_TARGETS[0]);
    await page.keyboard.press("Enter");
    await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[0]);
    await expect(page.locator("#targetText")).toHaveClass(/is-answer-revealed/);
    await expect(page.locator("#itemMeta")).toContainText("2 / 11");

    for (const [offset, target] of MOTION_TARGETS.slice(1).entries()) {
      await expect(page.locator("#itemMeta")).toContainText(`${offset + 2} / 11`);
      await page.locator("#typingInput").fill(target);
      await page.keyboard.press("Enter");
      await expect(page.locator("#targetText")).toHaveText(target);
    }

    await expect(page.locator("#stageTitle")).toHaveText("회상 2: 부분 가림 회상");
    await expect(page.locator("#targetText")).toHaveText(RECALL2_FIRST_DISPLAY);
    await expect(page.locator("#targetText")).not.toHaveText(MOTION_TARGETS[0]);

    await page.locator("#typingInput").fill("계단을 쓰다");
    await page.keyboard.press("Enter");
    await expect(page.locator("#targetText")).toContainText("계단을");
    await expect(page.locator("#targetText .target-char.is-revealed-correct")).toHaveText(["계", "단", "을"]);
    await expect(page.locator("#targetText .target-char.is-wrong")).toHaveText(["?", "?"]);
  });

  test("shows the report after recall practice", async ({ page }) => {
    await reachRecall1(page);
    await completeRecall1(page);
    for (const [index, target] of MOTION_TARGETS.entries()) {
      await expect(page.locator("#itemMeta")).toContainText(`${index + 1} / 11`);
      await page.locator("#typingInput").fill(target);
      await page.keyboard.press("Enter");
      await expect(page.locator("#targetText")).toHaveText(target);
    }

    await expect(page.locator("#stageTitle")).toHaveText("학습 리포트");
    await expect(page.locator("#totalMetric")).toHaveText("33");
    await expect(page.locator("#correctMetric")).toHaveText("33");
    await expect(page.locator("#retryButton")).toBeVisible();
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c12/writing-motion-typing.html");
    await page.evaluate(() => localStorage.removeItem("c12_motion_expression_typing_trainer_v1"));
    await page.reload();

    await expect(page.locator("#stageTitle")).toBeVisible();
    let overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);

    await completeWarmup(page);
    await completeMotionItems(page, 5);
    await expect(page.locator("#targetText")).toHaveText(MOTION_TARGETS[5]);
    overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from the c12 hub and typing activity hub", async ({ page }) => {
    await page.goto("/c12/index.html");
    const c12Link = page.locator('a[href="writing-motion-typing.html"]');
    await expect(c12Link).toHaveCount(1);
    await expect(c12Link).toContainText("12과 동작 표현 타이핑 연습");

    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    const typingHubLink = page.locator('a[href="../../c12/writing-motion-typing.html"]');
    await expect(typingHubLink).toHaveCount(1);
    await expect(typingHubLink).toContainText("12과 동작 표현 타이핑 연습");

    await page.goto("/apps/korean-keyboard-practice/index.html");
    await expect(page.locator('a[href="../../c12/writing-motion-typing.html"]')).toHaveCount(0);

    await page.goto("/apps/korean-keyboard-practice-lesson/index.html");
    await expect(page.locator('a[href="../../c12/writing-motion-typing.html"]')).toHaveCount(0);
  });
});
