const { test, expect } = require("@playwright/test");

const PHASE_ONE = [
  { noun: "케이크", verb: "먹다", route: "self-to-other", sentence: "제가 친구에게 케이크를 먹게 해요." },
  { noun: "물", verb: "마시다", route: "direct-self", sentence: "제가 물을 마셔요." },
  { noun: "책", verb: "읽다", route: "self-to-other", sentence: "제가 동생에게 책을 읽게 해요." },
  { noun: null, verb: "울다", route: "self-to-other", sentence: "제가 동생을 울게 해요." },
  { noun: "영화", verb: "보다", route: "direct-self", sentence: "제가 영화를 봐요." },
  { noun: "책", verb: "고르다", route: "direct-self", sentence: "제가 책을 골라요." },
  { noun: "케이크", verb: "사다", route: "self-to-other", sentence: "제가 친구에게 케이크를 사게 해요." },
  { noun: "신문", verb: "읽다", route: "self-to-other", sentence: "제가 부하직원에게 신문을 읽게 해요." },
  { noun: "드라마", verb: "보다", route: "self-to-other", sentence: "제가 친구에게 드라마를 보게 해요." }
];

const PHASE_TWO = [
  { other: "friend", noun: "빵", verb: "먹다", route: "direct-other", sentence: "친구가 빵을 먹어요." },
  { other: "sibling", noun: "드라마", verb: "보다", route: "other-to-self", sentence: "동생이 저에게 드라마를 보게 해요." },
  { other: "staff", noun: "물", verb: "마시다", route: "direct-other", sentence: "부하직원이 물을 마셔요." },
  // A direct-self answer must not depend on which other-person tab is active.
  { other: "staff", noun: "밥", verb: "먹다", route: "direct-self", sentence: "제가 밥을 먹어요." },
  { other: "friend", noun: null, verb: "웃다", route: "self-to-other", sentence: "제가 친구를 웃게 해요." },
  { other: "staff", noun: null, verb: "울다", route: "other-to-self", sentence: "부하직원이 저를 울게 해요." },
  { other: "sibling", noun: "케이크", verb: "사다", route: "direct-other", sentence: "동생이 케이크를 사요." },
  { other: "friend", noun: "신문", verb: "읽다", route: "other-to-self", sentence: "친구가 저에게 신문을 읽게 해요." },
  { other: "staff", noun: "책", verb: "고르다", route: "self-to-other", sentence: "제가 부하직원에게 책을 고르게 해요." }
];

async function blockGoogleTagManager(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({
    status: 200,
    contentType: "application/javascript",
    body: ""
  }));
}

async function openGame(page) {
  await blockGoogleTagManager(page);
  await page.goto("/c15/grammar1-ge-hada-game.html", { waitUntil: "domcontentloaded" });
}

async function chooseTokens(page, answer) {
  if (answer.other) {
    await page.locator(`.other-tab[data-other="${answer.other}"]`).click();
  }

  // Choose the verb first so a previous objectless verb cannot leave noun buttons disabled.
  await page.locator(`[data-kind="verb"][data-value="${answer.verb}"]`).click();
  if (answer.noun !== null) {
    await page.locator(`[data-kind="noun"][data-value="${answer.noun}"]`).click();
  }
}

function routeSelector(route) {
  if (route === "direct-self") {
    return "#selfZone";
  }
  if (route === "direct-other") {
    return "#otherZone";
  }
  return `[data-route="${route}"]`;
}

async function submitByClick(page, answer) {
  await chooseTokens(page, answer);
  await page.locator(routeSelector(answer.route)).click();
}

async function pointerDragThrough(page, route) {
  const routeZones = {
    "direct-self": ["#selfZone"],
    "direct-other": ["#otherZone"],
    "self-to-other": ["#selfZone", "#otherZone"],
    "other-to-self": ["#otherZone", "#selfZone"]
  };
  const source = page.locator("#sentenceCard");
  await source.scrollIntoViewIfNeeded();

  const sourceBox = await source.boundingBox();
  expect(sourceBox).not.toBeNull();
  const zoneBoxes = [];
  for (const selector of routeZones[route]) {
    const box = await page.locator(selector).boundingBox();
    expect(box).not.toBeNull();
    zoneBoxes.push(box);
  }

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  for (const box of zoneBoxes) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
  }
  await page.mouse.up();
}

async function expectCleanDragState(page) {
  await expect(page.locator(".drag-ghost")).toHaveCount(0);
  await expect(page.locator("#sentenceCard")).not.toHaveClass(/is-dragging/);
  const dirtyZones = await page.locator("#selfZone, #otherZone").evaluateAll((zones) => (
    zones.filter((zone) => zone.classList.contains("is-hover") || zone.classList.contains("is-pass")).length
  ));
  expect(dirtyZones).toBe(0);
  await expect(page.locator("#commandBeam")).not.toHaveClass(/is-visible|is-active/);
}

async function cancelPointerDrag(page) {
  const source = page.locator("#sentenceCard");
  const target = page.locator("#selfZone");
  await source.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  expect(sourceBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  await page.evaluate(() => {
    window.__c15TestPointerId = null;
    document.getElementById("sentenceCard").addEventListener("pointerdown", (event) => {
      window.__c15TestPointerId = event.pointerId;
    }, { once: true });
  });
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 8 });
  await page.evaluate(() => {
    document.dispatchEvent(new PointerEvent("pointercancel", {
      bubbles: true,
      pointerId: window.__c15TestPointerId,
      pointerType: "mouse",
      isPrimary: true
    }));
  });
  await page.mouse.up();
}

async function pointerDragOutside(page) {
  const source = page.locator("#sentenceCard");
  await source.scrollIntoViewIfNeeded();
  const sourceBox = await source.boundingBox();
  expect(sourceBox).not.toBeNull();
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(8, 8, { steps: 12 });
  await page.mouse.up();
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test("c15 hub and grammar page keep links to the upgraded drag game", async ({ page }) => {
  await blockGoogleTagManager(page);
  await page.goto("/c15/index.html", { waitUntil: "domcontentloaded" });

  await page.locator('a[href="grammar1-ge-hada-game.html"]').click();
  await expect(page).toHaveURL(/\/c15\/grammar1-ge-hada-game\.html$/);
  await expect(page.locator("h1")).toContainText("누가 하게");

  await page.goto("/c15/grammar1.html", { waitUntil: "domcontentloaded" });
  await page.locator('a[href="grammar1-ge-hada-game.html"]').click();
  await expect(page).toHaveURL(/\/c15\/grammar1-ge-hada-game\.html$/);
  await expect(page.locator("#sentenceCard")).toBeVisible();
});

test("pointer drag records self-to-other direction and direct action remains clickable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openGame(page);

  await expect(page.locator("#missionText")).toHaveText("친구가 케이크를 먹게 하세요.");
  await expect(page.locator("#missionText")).not.toHaveText(PHASE_ONE[0].sentence);
  await expect(page.locator("#resultSentence")).toBeEmpty();

  await cancelPointerDrag(page);
  await expectCleanDragState(page);
  await pointerDragOutside(page);
  await expectCleanDragState(page);
  await expect(page.locator("#progressText")).toContainText("1단계 1 / 9");
  await expect(page.locator("#nextBtn")).toBeHidden();

  await pointerDragThrough(page, "self-to-other");
  await expect(page.locator("#resultPopup")).toHaveClass(/is-visible/);
  await expect(page.locator("#resultSentence")).toHaveText("제가 친구에게 케이크를 먹게 해요.");
  await expect(page.locator("#composer")).toBeHidden();
  await expect(page.locator("#nextBtn")).toBeVisible();
  await expect(page.locator("#selfRole")).toHaveText("원인자");
  await expect(page.locator("#otherRole")).toHaveText("행위자");
  await expect(page.locator("#selfLine")).toContainText("하게");
  await expect(page.locator("#otherLine")).toContainText("실제로");
  await expect(page.locator("#scoreText")).toContainText(/첫 시도\s*1\s*\/\s*18/);
  await page.locator('[data-route="self-to-other"]').dispatchEvent("click");
  await expect(page.locator("#scoreText")).toContainText(/첫 시도\s*1\s*\/\s*18/);
  await expect(page.locator("#nextBtn")).toHaveText("다음 문제");
  await page.locator("#nextBtn").click();
  await expect(page.locator("#composer")).toBeVisible();

  await chooseTokens(page, PHASE_ONE[1]);
  await pointerDragThrough(page, "direct-self");
  await expect(page.locator("#resultSentence")).toHaveText("제가 물을 마셔요.");
  await expect(page.locator("#selfRole")).toHaveText("직접 행동");
  await expect(page.locator("#otherRole")).toHaveText("관찰자");
});

test("a wrong direction stays on the question and a retry earns no first-attempt point", async ({ page }) => {
  await openGame(page);

  await page.locator("#selfZone").click();
  await expect(page.locator("#progressText")).toContainText("1단계 1 / 9");
  await expect(page.locator("#feedbackBox")).toContainText(/방향|친구|하게/);
  await expect(page.locator("#nextBtn")).toBeHidden();

  await page.locator('[data-route="self-to-other"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#resultSentence")).toHaveText("제가 친구에게 케이크를 먹게 해요.");
  await expect(page.locator("#scoreText")).toContainText(/첫 시도\s*0\s*\/\s*18/);
  await expect(page.locator("#nextBtn")).toBeVisible();
});

test("objectless verbs disable noun controls and restore them for transitive verbs", async ({ page }) => {
  await openGame(page);

  for (const answer of PHASE_ONE.slice(0, 3)) {
    await submitByClick(page, answer);
    await expect(page.locator("#resultPopup")).toHaveClass(/is-visible/);
    await page.locator("#nextBtn").click();
  }

  await page.locator('[data-kind="verb"][data-value="울다"]').click();
  await expect(page.locator('[data-kind="verb"][data-value="울다"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-kind="noun"]:not(:disabled)')).toHaveCount(0);
  await expect(page.locator("#sentenceCard")).toContainText("울다");
  await page.locator("#sentenceCard").focus();
  await page.keyboard.press("Tab");
  const disabledNounReceivedFocus = await page.evaluate(() => (
    document.activeElement && document.activeElement.matches('[data-kind="noun"]')
  ));
  expect(disabledNounReceivedFocus).toBe(false);

  await page.locator('[data-kind="verb"][data-value="먹다"]').click();
  await expect(page.locator('[data-kind="noun"]:disabled')).toHaveCount(0);
});

test("all 18 questions cover both causal directions, phase change, final score, and restart", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openGame(page);

  for (let index = 0; index < PHASE_ONE.length; index += 1) {
    const answer = PHASE_ONE[index];
    await submitByClick(page, answer);
    await expect(page.locator("#resultPopup")).toHaveClass(/is-visible/);
    await expect(page.locator("#resultSentence")).toHaveText(answer.sentence);
    if (index === PHASE_ONE.length - 1) {
      await expect(page.locator("#nextBtn")).toHaveText("다음 단계");
    }
    await page.locator("#nextBtn").click();
  }

  await expect(page.locator("#progressText")).toContainText("2단계 1 / 9");
  await expect(page.locator(".other-tab")).toHaveCount(3);

  for (let index = 0; index < PHASE_TWO.length; index += 1) {
    const answer = PHASE_TWO[index];
    await chooseTokens(page, answer);
    if ((answer.route === "direct-other" && index === 0)
      || (answer.route === "other-to-self" && index === 1)) {
      await pointerDragThrough(page, answer.route);
    } else {
      await page.locator(routeSelector(answer.route)).click();
    }

    await expect(page.locator("#resultSentence")).toHaveText(answer.sentence);
    if (index < PHASE_TWO.length - 1) {
      await page.locator("#nextBtn").click();
    } else {
      await expect(page.locator("#nextBtn")).toHaveText("결과 보기");
      await page.locator("#nextBtn").click();
    }
  }

  await expect(page.locator("#progressText")).toContainText("최종");
  await expect(page.locator("#resultSentence")).toContainText(/18\s*\/\s*18/);
  await expect(page.locator("#restartBtn")).toBeVisible();
  await expect(page.locator("#nextBtn")).toBeHidden();

  await page.locator("#restartBtn").click();
  await expect(page.locator("#progressText")).toContainText("1단계 1 / 9");
  await expect(page.locator("#missionText")).toContainText("친구");
  await expect(page.locator("#scoreText")).toContainText(/첫 시도\s*0\s*\/\s*18/);
  await expect(page.locator("#restartBtn")).toBeHidden();
  await expect(page.locator('[data-kind="noun"][data-value="케이크"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-kind="verb"][data-value="먹다"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.other-tab[data-other="friend"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#resultPopup")).not.toHaveClass(/is-visible/);
  await expectCleanDragState(page);
});

test("desktop and mobile layouts have accessible controls without overflow or runtime errors", async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.emulateMedia({
      reducedMotion: viewport.width === 390 ? "reduce" : "no-preference"
    });
    await page.setViewportSize(viewport);
    await openGame(page);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#statusText")).toHaveAttribute("aria-live", /polite|assertive/);
    await expect(page.locator("#feedbackBox")).toHaveAttribute("aria-live", /polite|assertive/);
    await expect(page.locator("#sentenceCard")).toHaveAttribute("role", "button");
    await expect(page.locator("#sentenceCard")).toHaveAttribute("tabindex", "0");
    await expect(page.locator('[data-kind="noun"][aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('[data-kind="verb"][aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator(".other-tab[data-other]")).toHaveCount(3);
    await expect(page.locator(".other-tab[data-other]").first()).toHaveAttribute("aria-pressed", /true|false/);
    await expect(page.locator("[data-route]")).toHaveCount(2);
    await expect(page.locator("#selfZone, #otherZone")).toHaveCount(2);
    await expectNoHorizontalOverflow(page);

    await expect.poll(() => page.locator("#selfZone img, #otherZone img").evaluateAll((images) => (
      images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)
    ))).toBe(true);

    const controlsStayWithinViewport = await page.locator("#selfZone, #otherZone, #sentenceCard").evaluateAll((elements) => (
      elements.every((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= -1 && rect.right <= window.innerWidth + 1;
      })
    ));
    expect(controlsStayWithinViewport).toBe(true);

    await page.locator("#sentenceCard").focus();
    await expect(page.locator("#sentenceCard")).toBeFocused();
    const focusOutlineWidth = await page.locator("#sentenceCard").evaluate((element) => (
      Number.parseFloat(window.getComputedStyle(element).outlineWidth)
    ));
    expect(focusOutlineWidth).toBeGreaterThan(0);
    await page.keyboard.press("Enter");
    const keyboardMovedToRoute = await page.evaluate(() => (
      document.activeElement && document.activeElement.matches("[data-route]")
    ));
    expect(keyboardMovedToRoute).toBe(true);
    await expect(page.locator("#statusText")).toContainText(/경로|방향|선택/);

    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewportMeta || "").not.toMatch(/maximum-scale\s*=\s*1|user-scalable\s*=\s*no/i);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
