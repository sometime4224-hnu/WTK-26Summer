const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

async function openMotionLab(page, viewport, options = {}) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto("/c12/vocabulary-body-motion.html", { waitUntil: "domcontentloaded" });
  await page.evaluate((pcMode) => {
    if (pcMode) {
      localStorage.setItem("c12-pc-mode", "true");
    } else {
      localStorage.removeItem("c12-pc-mode");
    }
  }, Boolean(options.pcMode));
  if (options.pcMode) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveClass(/pc-mode/);
  }
  await page.waitForFunction(() => Boolean(window.__C12_BODY_MOTION_LAB__));
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)
  )).toBe(true);
}

test("c12 body motion lab is linked from chapter and vocabulary pages", async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto("/c12/index.html", { waitUntil: "domcontentloaded" });
  const chapterLink = page.locator('a[href="vocabulary-body-motion.html"]');
  await expect(chapterLink).toHaveCount(1);
  await expect(chapterLink).toContainText("신체 동작 만들기");

  await page.goto("/c12/vocabulary.html", { waitUntil: "domcontentloaded" });
  const topbarLink = page.locator('.topbar a[href="vocabulary-body-motion.html"]');
  await expect(topbarLink).toHaveCount(1);
  await expect(topbarLink).toContainText("신체 동작 만들기");
});

test("c12 body motion lab detects contact extension expressions", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    const labelsFor = (pose) => {
      api.resetPose();
      return api.setPose(pose, { lastPart: "rightHand" }).map((item) => item.label);
    };
    return {
      head: labelsFor({ rightHand: { x: 180, y: 105 } }),
      waist: labelsFor({ rightHand: { x: 180, y: 292 } }),
      ear: labelsFor({ rightHand: { x: 208, y: 105 } }),
    };
  });

  expect(result.head).toContain("손을 머리에 대다");
  expect(result.waist).toContain("손을 허리에 대다");
  expect(result.ear).toContain("손을 귀에 대다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab detects core movement expressions", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    const labelsFor = (pose, lastPart) => {
      api.resetPose();
      return api.setPose(pose, { lastPart }).map((item) => item.label);
    };
    return {
      arm: labelsFor({ rightHand: { x: 332, y: 182 } }, "rightHand"),
      side: labelsFor({ chest: { x: 226, y: 205 } }, "chest"),
      chest: labelsFor({
        leftHand: { x: 46, y: 184 },
        rightHand: { x: 314, y: 184 },
      }, "rightHand"),
      lean: labelsFor({ chest: { x: 180, y: 170 } }, "chest"),
      legs: labelsFor({
        leftFoot: { x: 72, y: 475 },
        rightFoot: { x: 288, y: 475 },
      }, "rightFoot"),
      heel: labelsFor({ rightFoot: { x: 215, y: 420 } }, "rightFoot"),
    };
  });

  expect(result.arm).toContain("팔을 뻗다");
  expect(result.side).toContain("옆구리를 굽히다");
  expect(result.chest).toContain("가슴을 펴다");
  expect(result.lean).toContain("몸을 뒤로 젖히다");
  expect(result.legs).toContain("다리를 벌리다");
  expect(result.heel).toContain("발뒤꿈치를 들다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab uses detailed heel and neck movement metrics", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    const labels = () => api.detectExpressions().map((item) => item.label);

    api.resetPose();
    api.setPose({
      rightToe: { x: 230, y: 475 },
      rightHeel: { x: 200, y: 430 },
    }, { lastPart: "rightHeel" });
    const heelOnly = labels();
    const heelMetrics = api.getMetrics();

    api.resetPose();
    api.setPose({
      rightToe: { x: 230, y: 430 },
      rightHeel: { x: 200, y: 430 },
    }, { lastPart: "rightHeel" });
    const wholeFoot = labels();

    api.resetPose();
    const staticHead = api.setPose({ head: { x: 225, y: 105 } }, { lastPart: "head" }).map((item) => item.label);

    api.clearGesture("head");
    const now = Date.now();
    api.pushGesturePoint("head", { x: 154, y: 104 }, now - 900);
    api.pushGesturePoint("head", { x: 222, y: 108 }, now - 560);
    api.pushGesturePoint("head", { x: 156, y: 102 }, now - 230);
    api.pushGesturePoint("head", { x: 214, y: 106 }, now);
    const movingHead = labels();
    const neckMetrics = api.getMetrics().neckRotation;

    api.resetPose();
    api.setPose({ head: { x: 245, y: 64 } }, { lastPart: "head" });
    const frontHeadNeckDistance = api.getMetrics().frontRig.headNeckDistance;

    return { heelOnly, heelMetrics, wholeFoot, staticHead, movingHead, neckMetrics, frontHeadNeckDistance };
  });

  expect(result.heelOnly).toContain("발뒤꿈치를 들다");
  expect(result.heelMetrics.heelLift).toBeGreaterThanOrEqual(24);
  expect(result.wholeFoot).not.toContain("발뒤꿈치를 들다");
  expect(result.staticHead).not.toContain("목을 돌리다");
  expect(result.movingHead).toContain("목을 돌리다");
  expect(result.neckMetrics.valid).toBe(true);
  expect(result.frontHeadNeckDistance).toBeLessThanOrEqual(31.5);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab supports elbow and knee bending with triangular feet", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  await expect(page.locator('.drag-handle[data-part="rightElbow"]')).toHaveCount(1);
  await expect(page.locator('.drag-handle[data-part="rightKnee"]')).toHaveCount(1);
  await expect(page.locator('.drag-handle[data-part="rightHeel"]')).toHaveCount(1);
  await expect(page.locator("polygon.foot-triangle")).toHaveCount(2);

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;

    api.resetPose();
    api.setPose({ rightElbow: { x: 198, y: 210 } }, { lastPart: "rightElbow" });
    const armLabels = api.detectExpressions().map((item) => item.label);
    const armMetrics = api.getMetrics().armBend;

    api.resetPose();
    api.setPose({ rightKnee: { x: 262, y: 360 } }, { lastPart: "rightKnee" });
    const kneeLabels = api.detectExpressions().map((item) => item.label);
    const kneeMetrics = api.getMetrics().kneeBend;

    api.resetPose();
    const defaultPose = api.getState().pose;
    api.setPose({ rightHeel: { x: 200, y: 430 } }, { lastPart: "rightHeel" });
    const heelPose = api.getState().pose;
    const heelMetrics = api.getMetrics().rightFoot;
    const heelLabels = api.detectExpressions().map((item) => item.label);

    return { armLabels, armMetrics, kneeLabels, kneeMetrics, defaultPose, heelPose, heelMetrics, heelLabels };
  });

  expect(result.armLabels[0]).toBe("팔을 굽히다");
  expect(result.armMetrics.valid).toBe(true);
  expect(result.kneeLabels[0]).toBe("무릎을 굽히다");
  expect(result.kneeMetrics.valid).toBe(true);
  expect(result.defaultPose.leftHeel.x).toBeGreaterThan(result.defaultPose.leftToe.x);
  expect(result.defaultPose.rightHeel.x).toBeLessThan(result.defaultPose.rightToe.x);
  expect(result.heelLabels).toContain("발뒤꿈치를 들다");
  expect(result.heelPose.rightToe.y).toBe(475);
  expect(result.heelPose.rightHeel.y).toBe(430);
  expect(result.heelPose.rightHeel.x).toBeLessThan(result.heelPose.rightToe.x);
  expect(result.heelMetrics.validHeelLift).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab constrains the front rig and exposes frontRig metrics", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;

    api.resetPose();
    const farHandLabels = api.setPose({ rightHand: { x: 328, y: 60 } }, { lastPart: "rightHand" }).map((item) => item.label);
    const farHandPose = api.getState().pose;
    const farHandMetrics = api.getMetrics().frontRig;

    api.resetPose();
    const elbowLabels = api.setPose({ rightElbow: { x: 314, y: 120 } }, { lastPart: "rightElbow" }).map((item) => item.label);
    const elbowMetrics = api.getMetrics().frontRig;

    api.resetPose();
    const spreadLabels = api.setPose({
      leftFoot: { x: 72, y: 447 },
      rightFoot: { x: 288, y: 447 },
    }, { lastPart: "rightFoot" }).map((item) => item.label);
    const spreadMetrics = api.getMetrics().frontRig;

    api.resetPose();
    const kneeLabels = api.setPose({ rightKnee: { x: 262, y: 360 } }, { lastPart: "rightKnee" }).map((item) => item.label);
    const kneeMetrics = api.getMetrics().frontRig;

    return { farHandLabels, farHandPose, farHandMetrics, elbowLabels, elbowMetrics, spreadLabels, spreadMetrics, kneeLabels, kneeMetrics };
  });

  expect(result.farHandLabels).toContain("팔을 뻗다");
  expect(result.farHandMetrics.armReach.right).toBeLessThanOrEqual(166.5);
  expect(result.farHandPose.rightElbow.x).toBeLessThan(result.farHandPose.rightHand.x);
  expect(result.elbowLabels[0]).toBe("팔을 굽히다");
  expect(result.elbowMetrics.rightArmBend.valid).toBe(true);
  expect(result.spreadLabels[0]).toBe("다리를 벌리다");
  expect(result.spreadMetrics.legSpread).toBeGreaterThanOrEqual(124);
  expect(result.spreadLabels).not.toContain("무릎을 굽히다");
  expect(result.kneeLabels[0]).toBe("무릎을 굽히다");
  expect(result.kneeMetrics.rightKneeBend.valid).toBe(true);
  expect(result.kneeLabels).not.toContain("다리를 벌리다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab highlights the active front limb and nearest hand target", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    api.setPose({ rightHand: { x: 180, y: 105 } }, { lastPart: "rightHand" });
  });

  await expect(page.locator("#rightArmLine")).toHaveClass(/is-active-limb/);
  await expect(page.locator('.target-zone[data-target-id="head"]')).toHaveClass(/is-visible/);
  await expect(page.locator("#leftArmLine")).not.toHaveClass(/is-active-limb/);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab separates side bend from translation and detects side chest opening", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    const labels = () => api.detectExpressions().map((item) => item.label);

    api.resetPose();
    api.setPose({
      head: { x: 226, y: 105 },
      chest: { x: 226, y: 205 },
      waist: { x: 226, y: 292 },
    }, { lastPart: "chest" });
    const translated = labels();

    api.resetPose();
    api.setPose({
      head: { x: 236, y: 105 },
      chest: { x: 224, y: 205 },
      waist: { x: 180, y: 292 },
    }, { lastPart: "chest" });
    const curved = labels();
    const frontMetrics = api.getMetrics();

    api.setViewMode("side");
    api.resetPose();
    api.setPose({
      chest: { x: 150, y: 205 },
    }, { lastPart: "chest" });
    const sideChest = labels();
    const sideMetrics = api.getMetrics();

    return { translated, curved, frontMetrics, sideChest, sideMetrics };
  });

  expect(result.translated).not.toContain("옆구리를 굽히다");
  expect(result.curved).toContain("옆구리를 굽히다");
  expect(result.frontMetrics.sideBend).toBe(true);
  expect(result.sideChest).toContain("가슴을 펴다");
  expect(result.sideMetrics.chestOpen).toBe(true);
  expect(result.sideMetrics.chestForward).toBeGreaterThanOrEqual(22);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab side mode is a torso and head posture model", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  await page.locator("#sideViewBtn").click();
  for (const part of ["head", "chest", "waist", "pelvis"]) {
    await expect(page.locator(`.drag-handle[data-part="${part}"]`)).toBeVisible();
  }
  for (const part of ["rightHand", "rightElbow", "rightKnee", "rightHeel"]) {
    await expect(page.locator(`g[data-part="${part}"]`)).toBeHidden();
  }

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    const labels = () => api.detectExpressions().map((item) => item.label);

    api.resetPose();
    const ignored = api.setPose({
      rightHand: { x: 180, y: 105 },
      rightElbow: { x: 198, y: 210 },
      rightKnee: { x: 262, y: 360 },
      rightHeel: { x: 200, y: 430 },
    }, { mode: "side", lastPart: "rightHand" }).map((item) => item.label);

    api.resetPose();
    api.setPose({
      chest: { x: 132, y: 210 },
      head: { x: 130, y: 114 },
    }, { mode: "side", lastPart: "chest" });
    const forward = labels();
    const forwardMetrics = api.getMetrics().sidePosture;

    api.resetPose();
    api.setPose({
      head: { x: 138, y: 132 },
    }, { mode: "side", lastPart: "head" });
    const headBow = labels();

    api.resetPose();
    api.setPose({
      head: { x: 224, y: 88 },
    }, { mode: "side", lastPart: "head" });
    const headBack = labels();
    const headMetrics = api.getMetrics().sidePosture;

    return { ignored, forward, forwardMetrics, headBow, headBack, headMetrics, pose: api.getState().pose };
  });

  expect(result.ignored).not.toContain("손을 머리에 대다");
  expect(result.ignored).not.toContain("팔을 굽히다");
  expect(result.ignored).not.toContain("무릎을 굽히다");
  expect(result.ignored).not.toContain("발뒤꿈치를 들다");
  expect(result.forward[0]).toBe("몸을 앞으로 굽히다");
  expect(result.forwardMetrics.torsoFlexion).toBeGreaterThanOrEqual(34);
  expect(result.headBow[0]).toBe("고개를 숙이다");
  expect(result.headBack[0]).toBe("고개를 뒤로 젖히다");
  expect(result.headMetrics.neckExtension).toBeGreaterThanOrEqual(32);
  expect(result.headMetrics.headNeckDistance).toBeLessThanOrEqual(31.5);
  expect(Object.keys(result.pose).sort()).toEqual(["chest", "head", "pelvis", "waist"]);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab lets the side head and neck follow chest flexion", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;

    api.setViewMode("side");
    const defaultPose = api.getState().pose;

    api.resetPose();
    api.setPose({ chest: { x: 132, y: 210 } }, { mode: "side", lastPart: "chest" });
    const forwardPose = api.getState().pose;
    const forwardLabels = api.detectExpressions().map((item) => item.label);

    api.resetPose();
    api.setPose({ chest: { x: 226, y: 205 } }, { mode: "side", lastPart: "chest" });
    const backPose = api.getState().pose;
    const backLabels = api.detectExpressions().map((item) => item.label);
    const backMetrics = api.getMetrics().sidePosture;

    api.resetPose();
    api.setPose({ head: { x: 138, y: 132 } }, { mode: "side", lastPart: "head" });
    const bowedBefore = api.getState().pose;
    api.setPose({ chest: { x: 150, y: 210 } }, { mode: "side", lastPart: "chest" });
    const bowedAfter = api.getState().pose;

    return { defaultPose, forwardPose, forwardLabels, backPose, backLabels, backMetrics, bowedBefore, bowedAfter };
  });

  expect(result.forwardPose.head.x).toBeLessThan(result.defaultPose.head.x);
  expect(result.forwardPose.head.x).toBeGreaterThan(result.forwardPose.chest.x);
  expect(result.forwardLabels).toContain("몸을 앞으로 굽히다");
  expect(result.backPose.head.x).toBeGreaterThan(result.defaultPose.head.x);
  expect(result.backPose.head.x).toBeLessThan(result.backPose.chest.x);
  expect(result.backLabels).toContain("몸을 뒤로 젖히다");
  expect(result.backMetrics.torsoExtension).toBeGreaterThanOrEqual(34);
  expect(result.bowedAfter.head.x).toBeLessThan(result.bowedBefore.head.x);
  expect(result.bowedAfter.head.y).toBeGreaterThan(result.bowedBefore.head.y);
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab prioritizes expressions tied to the active manipulated part", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const result = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;

    api.resetPose();
    api.setPose({ rightHand: { x: 180, y: 292 } }, { lastPart: "rightHand" });
    const handFirst = api.getState().currentExpression.label;

    api.setPose({ chest: { x: 180, y: 170 } }, { lastPart: "chest" });
    const chestFirst = api.getState().currentExpression.label;
    const chestOrder = api.detectExpressions().map((item) => item.label);

    api.resetPose();
    api.setPose({ rightHand: { x: 180, y: 105 } }, { lastPart: "rightHand" });
    const contactFirst = api.getState().currentExpression.label;
    api.clearGesture("head");
    const now = Date.now();
    api.pushGesturePoint("head", { x: 154, y: 104 }, now - 900);
    api.pushGesturePoint("head", { x: 222, y: 108 }, now - 560);
    api.pushGesturePoint("head", { x: 156, y: 102 }, now - 230);
    api.pushGesturePoint("head", { x: 214, y: 106 }, now);
    const headFirst = api.getState().currentExpression.label;
    const headOrder = api.detectExpressions().map((item) => item.label);

    return { handFirst, chestFirst, chestOrder, contactFirst, headFirst, headOrder };
  });

  expect(result.handFirst).toBe("손을 허리에 대다");
  expect(result.chestFirst).toBe("몸을 뒤로 젖히다");
  expect(result.chestOrder[0]).toBe("몸을 뒤로 젖히다");
  expect(result.chestOrder).toContain("손을 허리에 대다");
  expect(result.contactFirst).toBe("손을 머리에 대다");
  expect(result.headFirst).toBe("목을 돌리다");
  expect(result.headOrder[0]).toBe("목을 돌리다");
  expect(result.headOrder).toContain("손을 머리에 대다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab completes missions and stores discoveries", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const state = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    api.startMission("touch-head");
    api.setPose({ rightHand: { x: 180, y: 105 } }, { lastPart: "rightHand" });
    return api.getState();
  });

  expect(state.completedMissions).toContain("touch-head");
  expect(state.currentExpression.label).toBe("손을 머리에 대다");
  await expect(page.locator("#missionFeedback")).toContainText("완료");
  await expect(page.locator("#discoveryList")).toContainText("손을 머리에 대다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab auto-completes a matching mission on drop", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  await expect(page.locator("#nextMissionTopBtn, #prevMissionBtn, #nextMissionBtn")).toHaveCount(0);

  const target = await page.evaluate(() => {
    const svg = document.querySelector("#poseStage");
    const point = svg.createSVGPoint();
    point.x = 180;
    point.y = 105;
    const screenPoint = point.matrixTransform(svg.getScreenCTM());
    return { x: screenPoint.x, y: screenPoint.y };
  });
  const handle = await page.locator('.drag-handle[data-part="rightHand"]').boundingBox();
  expect(handle).not.toBeNull();

  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 10 });
  await expect(page.locator("#missionFeedback")).toContainText("이대로 놓으면");
  await page.mouse.up();

  const state = await page.evaluate(() => window.__C12_BODY_MOTION_LAB__.getState());
  expect(state.activeMission.id).toBe("touch-head");
  expect(state.completedMissions).toContain("touch-head");
  expect(state.completedMissions).not.toContain("arm-stretch");
  await expect(page.locator("#missionTitle")).toHaveText("손을 머리에 대다");
  await expect(page.locator("#missionFeedback")).toContainText("완료");
  await expect(page.locator("#completionReaction")).toContainText("완료! 손을 머리에 대다");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab has a side view with detailed posture cues", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  await page.locator("#sideViewBtn").click();
  await expect(page.locator("#sideViewBtn")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#poseStage")).toHaveAttribute("data-view-mode", "side");
  await expect(page.locator("#sideDetail")).toBeVisible();
  await expect(page.locator("#stageHint")).toContainText("측면");

  const state = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    api.setPose({
      chest: { x: 226, y: 205 },
      head: { x: 226, y: 105 },
    }, { lastPart: "chest" });
    return api.getState();
  });

  expect(state.viewMode).toBe("side");
  expect(state.currentExpression.label).toBe("몸을 뒤로 젖히다");
  await expect(page.locator("#expressionText")).toHaveText("몸을 뒤로 젖히다");
  await expect(page.locator("#tiltMetric")).toContainText("+");
  await expectNoHorizontalOverflow(page);
});

test("c12 body motion lab keeps front and side models independent", async ({ page }) => {
  await openMotionLab(page, { width: 390, height: 844 });

  const state = await page.evaluate(() => {
    const api = window.__C12_BODY_MOTION_LAB__;
    api.setPose({ rightHand: { x: 180, y: 105 } }, { lastPart: "rightHand" });
    const afterFrontEdit = api.getState();
    api.setViewMode("side");
    const afterSwitch = api.getState();
    api.setPose({
      chest: { x: 226, y: 205 },
      head: { x: 226, y: 105 },
    }, { lastPart: "chest" });
    const afterSideEdit = api.getState();
    api.setViewMode("front");
    return {
      afterFrontEdit,
      afterSwitch,
      afterSideEdit,
      finalFront: api.getState(),
    };
  });

  expect(state.afterFrontEdit.viewMode).toBe("front");
  expect(state.afterFrontEdit.poses.front.rightHand).toEqual({ x: 180, y: 105 });
  expect(state.afterFrontEdit.poses.side.rightHand).toBeUndefined();
  expect(state.afterSwitch.pose.pelvis).toEqual({ x: 180, y: 354 });
  expect(state.afterSideEdit.currentExpression.label).toBe("몸을 뒤로 젖히다");
  expect(state.afterSideEdit.poses.front.chest).toEqual({ x: 180, y: 205 });
  expect(state.afterSideEdit.poses.side.chest).toEqual({ x: 226, y: 205 });
  expect(state.finalFront.pose.rightHand).toEqual({ x: 180, y: 105 });
  await expectNoHorizontalOverflow(page);
});

for (const scenario of [
  { name: "small phone", viewport: { width: 360, height: 640 } },
  { name: "tablet landscape", viewport: { width: 1024, height: 768 } },
  { name: "pc mode", viewport: { width: 1366, height: 768 }, pcMode: true },
]) {
  test(`c12 body motion lab avoids horizontal overflow on ${scenario.name}`, async ({ page }) => {
    await openMotionLab(page, scenario.viewport, { pcMode: scenario.pcMode });
    await expect(page.locator("#poseStage")).toBeVisible();
    await expect(page.locator("#missionTitle")).toContainText("손을 허리에 대다");
    await expectNoHorizontalOverflow(page);
  });
}
