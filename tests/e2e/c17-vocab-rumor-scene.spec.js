const { test, expect } = require("@playwright/test");

const PAGE_URL = "/c17/vocab-support-rumor-scene.html";
const PAGE_ID = "vocab-support-rumor-scene";
const STORAGE_KEY = "korean3b.c17.vocab-support-rumor-scene.v1";
const OTHER_PAGE_KEY = "korean3b.c17.unrelated-learning-page.v1";

const FLOW_ARROW_MAP = {
  "rumor-appear": [],
  "rumor-start": ["arrow-flow1"],
  "rumor-spread-i": ["arrow-flow4", "arrow-flow5", "arrow-flow6"],
  "rumor-spread-t": ["arrow-flow1", "arrow-flow2", "arrow-flow3"]
};

const VOCABULARY = [
  {
    id: "rumor-appear",
    korean: "소문이 나다",
    meaning: "어떤 이야기가 사람들 사이에 알려지기 시작하다",
    example: "아키라 씨가 바라 씨와 사귄다는 소문이 났어요."
  },
  {
    id: "rumor-start",
    korean: "소문을 내다",
    meaning: "어떤 이야기를 다른 사람들에게 말해서 알려지게 하다",
    example: "누가 그런 소문을 냈을까요?"
  },
  {
    id: "rumor-spread-i",
    korean: "소문이 퍼지다",
    meaning: "이야기가 여러 사람에게 자연스럽게 널리 알려지다",
    example: "잘못된 소문이 금방 퍼졌어요."
  },
  {
    id: "rumor-spread-t",
    korean: "소문을 퍼뜨리다",
    meaning: "이야기를 여기저기에 의도적으로 전하다",
    example: "확인하지 않은 소문을 퍼뜨리면 안 돼요."
  },
  {
    id: "misunderstand",
    korean: "오해하다",
    meaning: "잘못 이해하다",
    example: "제 말을 오해하지 마세요."
  },
  {
    id: "argue",
    korean: "다투다",
    meaning: "서로 말이나 행동으로 싸우다",
    example: "오해 때문에 두 사람이 다퉜어요."
  },
  {
    id: "solve",
    korean: "오해를 풀다",
    meaning: "잘못 이해한 것을 바로잡다",
    example: "서로 이야기해서 오해를 풀었어요."
  },
  {
    id: "reconcile",
    korean: "화해하다",
    meaning: "다툰 뒤 관계를 다시 좋게 하다",
    example: "두 사람은 다시 화해했어요."
  }
];

async function blockExternalRequests(page) {
  // The document includes optional third-party analytics and icon resources.
  // Fulfill them locally so these visual/interaction checks never depend on a
  // network connection or on third-party timing.
  await page.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(requestUrl.hostname)) {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 204, contentType: "text/plain", body: "" });
  });
}

async function clearSceneStorageOnFirstNavigation(page) {
  await page.addInitScript(({ storageKey }) => {
    const marker = "c17-rumor-scene-e2e-storage-cleared";
    if (sessionStorage.getItem(marker) === "yes") return;
    localStorage.removeItem(storageKey);
    sessionStorage.setItem(marker, "yes");
  }, { storageKey: STORAGE_KEY });
}

async function waitForSceneReady(page) {
  await page.waitForFunction(() => (
    document.querySelectorAll("button[data-vocab]").length === 8
      && document.querySelector("#info-box")
      && document.querySelector("#reset-btn")
      && document.querySelector("svg")
  ));
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function openScene(page) {
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await waitForSceneReady(page);
}

function vocabButton(page, vocabId) {
  return page.locator(`button[data-vocab="${vocabId}"]`);
}

async function expectSelected(page, vocabulary) {
  const selected = page.locator('button[data-vocab][aria-pressed="true"]');
  await expect(selected).toHaveCount(1);
  await expect(vocabButton(page, vocabulary.id)).toHaveAttribute("aria-pressed", "true");

  const infoBox = page.locator("#info-box");
  await expect(infoBox).toContainText(vocabulary.korean);
  await expect(infoBox).toContainText(vocabulary.meaning);
  await expect(infoBox).toContainText(vocabulary.example);
}

async function visibleHighlightCount(page, vocabId) {
  return page.locator(`svg [data-highlight-for="${vocabId}"]`).evaluateAll((elements) => (
    elements.filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none"
        && style.visibility !== "hidden"
        && Number.parseFloat(style.opacity || "1") > 0.01
        && box.width > 0
        && box.height > 0;
    }).length
  ));
}

async function expectVisibleHighlight(page, vocabId) {
  await expect(page.locator(`svg [data-highlight-for="${vocabId}"]`)).not.toHaveCount(0);
  await expect.poll(() => visibleHighlightCount(page, vocabId)).toBeGreaterThan(0);
}

async function expectNoVisibleHighlights(page) {
  await expect.poll(async () => page.locator("svg [data-highlight-for]").evaluateAll((elements) => (
    elements.filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none"
        && style.visibility !== "hidden"
        && Number.parseFloat(style.opacity || "1") > 0.01
        && box.width > 0
        && box.height > 0;
    }).length
  ))).toBe(0);
}

async function focusWithKeyboard(page, button) {
  await button.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(button).toBeFocused();

  const indicator = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(":focus-visible"),
      outline: Number.parseFloat(style.outlineWidth) > 0 && style.outlineStyle !== "none",
      shadow: style.boxShadow !== "none"
    };
  });
  expect(indicator.focusVisible).toBe(true);
  expect(indicator.outline || indicator.shadow).toBe(true);
}

function legacySelectionRecord(vocabId) {
  return JSON.stringify({
    schemaVersion: 1,
    pageId: PAGE_ID,
    updatedAt: "2026-08-06T00:00:00.000Z",
    state: {
      actions: [{
        type: "data",
        tag: "button",
        pairs: [["data-vocab", vocabId]]
      }],
      inputs: {},
      completed: false
    }
  });
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
  await clearSceneStorageOnFirstNavigation(page);
});

test("chapter and vocabulary hubs promote the rumor scene as the current vocabulary support", async ({ page }) => {
  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  const chapterLink = page.locator('a[href="vocab-support-rumor-scene.html"]:visible');
  await expect(chapterLink).toHaveCount(1);
  await expect(chapterLink).toContainText("현재 어휘 보조");
  await expect(chapterLink).toContainText("소문 흐름을 따라 말해요");

  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  const vocabularyLink = page.locator('.topbar a[href="vocab-support-rumor-scene.html"]');
  await expect(vocabularyLink).toBeVisible();
  await vocabularyLink.click();
  await expect(page).toHaveURL(/\/c17\/vocab-support-rumor-scene\.html$/);
  await waitForSceneReady(page);
});

test("rumor scene exposes eight grouped expressions and keeps one selected scene", async ({ page }) => {
  await openScene(page);

  const buttons = page.locator("button[data-vocab]");
  await expect(buttons).toHaveCount(VOCABULARY.length);
  const ids = await buttons.evaluateAll((elements) => elements.map((element) => element.dataset.vocab).sort());
  expect(ids).toEqual(VOCABULARY.map(({ id }) => id).sort());
  for (const vocabulary of VOCABULARY) {
    await expect(vocabButton(page, vocabulary.id)).toHaveCount(1);
    await expect(vocabButton(page, vocabulary.id)).toContainText(vocabulary.korean);
  }

  const groupText = await page.locator(".panel-label, .vocab-group__label, [data-vocab-group], [role='group'][aria-label], section[aria-label]")
    .allTextContents();
  expect(groupText.join(" ")).toMatch(/소문/);
  expect(groupText.join(" ")).toMatch(/반응|오해|관계/);

  await expectSelected(page, VOCABULARY[0]);
  await expectVisibleHighlight(page, VOCABULARY[0].id);

  for (const vocabulary of VOCABULARY) {
    const button = vocabButton(page, vocabulary.id);
    await button.click();
    await expectSelected(page, vocabulary);
    await expectVisibleHighlight(page, vocabulary.id);

    // A second click confirms the current choice instead of accidentally
    // removing the learner's visual cue.
    await button.click();
    await expectSelected(page, vocabulary);
    await expectVisibleHighlight(page, vocabulary.id);
  }

  await page.locator("#reset-btn").click();
  await expect(page.locator('button[data-vocab][aria-pressed="true"]')).toHaveCount(0);
  expect(await buttons.evaluateAll((elements) => elements.every((element) => (
    element.getAttribute("aria-pressed") === "false"
  )))).toBe(true);
  await expectNoVisibleHighlights(page);
});

test("state-change and actor-action rumor expressions use distinct arrow paths", async ({ page }) => {
  await openScene(page);

  for (const [vocabId, expectedArrowIds] of Object.entries(FLOW_ARROW_MAP)) {
    await vocabButton(page, vocabId).click();
    const activeArrowIds = await page.locator("svg .flow-arrow.show")
      .evaluateAll((elements) => elements.map((element) => element.id).sort());
    expect(activeArrowIds, vocabId).toEqual([...expectedArrowIds].sort());
  }
});

test("mobile learners receive a readable selected-scene diagram instead of a shrunken overview", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await openScene(page);

  const mobileScene = page.locator("#mobile-scene");
  await expect(mobileScene).toBeVisible();
  await expect(page.locator(".diagram-svg-wrap > svg")).toBeHidden();

  for (const vocabulary of VOCABULARY) {
    await vocabButton(page, vocabulary.id).click();
    await expect(mobileScene).toHaveAttribute("data-active-vocab", vocabulary.id);
    await expect(mobileScene).toContainText(vocabulary.korean);
    await expect(mobileScene).toHaveAttribute("aria-label", /.+/);

    const audit = await mobileScene.evaluate((element) => {
      const textElements = Array.from(element.querySelectorAll(
        ".mobile-scene__node, .mobile-scene__caption"
      )).filter((item) => item.textContent.trim());
      return {
        minTextSize: Math.min(...textElements.map((item) => Number.parseFloat(getComputedStyle(item).fontSize))),
        overflows: element.scrollWidth > element.clientWidth + 1
      };
    });
    expect(audit.minTextSize, vocabulary.id).toBeGreaterThanOrEqual(12);
    expect(audit.overflows, vocabulary.id).toBe(false);
  }
});

test("vocabulary controls retain a visible keyboard focus and support Enter and Space", async ({ page }) => {
  await openScene(page);

  const enterTarget = VOCABULARY[1];
  const enterButton = vocabButton(page, enterTarget.id);
  await focusWithKeyboard(page, enterButton);
  await page.keyboard.press("Enter");
  await expectSelected(page, enterTarget);
  await expectVisibleHighlight(page, enterTarget.id);

  const spaceTarget = VOCABULARY[5];
  const spaceButton = vocabButton(page, spaceTarget.id);
  await focusWithKeyboard(page, spaceButton);
  await page.keyboard.press("Space");
  await expectSelected(page, spaceTarget);
  await expectVisibleHighlight(page, spaceTarget.id);
});

test("an existing partial selection restores without changing another page's record", async ({ page }) => {
  const savedSelection = VOCABULARY[5];
  const followUpSelection = VOCABULARY[6];
  const legacyRecord = legacySelectionRecord(savedSelection.id);
  const unrelatedRecord = JSON.stringify({ keep: "this-page-must-not-change" });

  await page.addInitScript(({ storageKey, savedRecord, otherKey, otherRecord }) => {
    const marker = "c17-rumor-scene-e2e-legacy-record-seeded";
    if (sessionStorage.getItem(marker) === "yes") return;
    localStorage.setItem(storageKey, savedRecord);
    localStorage.setItem(otherKey, otherRecord);
    sessionStorage.setItem(marker, "yes");
  }, {
    storageKey: STORAGE_KEY,
    savedRecord: legacyRecord,
    otherKey: OTHER_PAGE_KEY,
    otherRecord: unrelatedRecord
  });
  await openScene(page);

  await expectSelected(page, savedSelection);
  await expectVisibleHighlight(page, savedSelection.id);
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), OTHER_PAGE_KEY))
    .toBe(unrelatedRecord);

  await vocabButton(page, followUpSelection.id).click();
  await expectSelected(page, followUpSelection);
  await expect.poll(async () => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
    .not.toBe(legacyRecord);

  await page.reload({ waitUntil: "domcontentloaded" });
  await waitForSceneReady(page);
  await expectSelected(page, followUpSelection);
  await expectVisibleHighlight(page, followUpSelection.id);
  expect(await page.evaluate((key) => localStorage.getItem(key), OTHER_PAGE_KEY)).toBe(unrelatedRecord);
});

test("corrupt and unknown-version scene records are not overwritten", async ({ page }) => {
  await openScene(page);

  const records = [
    "{this is not valid JSON",
    JSON.stringify({ schemaVersion: 99, pageId: PAGE_ID, state: { selectedVocab: "argue" } })
  ];

  for (const rawRecord of records) {
    await page.evaluate(({ storageKey, value }) => localStorage.setItem(storageKey, value), {
      storageKey: STORAGE_KEY,
      value: rawRecord
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await waitForSceneReady(page);

    await vocabButton(page, "rumor-start").click();
    await expectSelected(page, VOCABULARY[1]);
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
      .toBe(rawRecord);
  }
});

test("the scene remains usable at target viewports without errors, broken assets, duplicate IDs, or horizontal overflow", async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];
  const localHttpErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    const responseUrl = new URL(response.url());
    if (["127.0.0.1", "localhost"].includes(responseUrl.hostname) && response.status() >= 400) {
      localHttpErrors.push(`${response.status()} ${responseUrl.pathname}`);
    }
  });

  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 720, height: 450 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await openScene(page);
    await expectSelected(page, VOCABULARY[0]);

    const audit = await page.evaluate(() => {
      const duplicateIds = Object.entries(Array.from(document.querySelectorAll("[id]")).reduce((counts, element) => {
        counts[element.id] = (counts[element.id] || 0) + 1;
        return counts;
      }, {})).filter(([, count]) => count > 1).map(([id]) => id);
      const images = Array.from(document.images);
      const firstAction = document.querySelector("button[data-vocab]")?.getBoundingClientRect();
      const heading = document.querySelector("h1")?.getBoundingClientRect();
      const pageWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const visibleSelectionIndicators = Array.from(document.querySelectorAll(".selection-state"))
        .filter((indicator) => getComputedStyle(indicator).display !== "none").length;
      return {
        duplicateIds,
        brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
        horizontalOverflow: pageWidth > window.innerWidth + 1,
        visibleSelectionIndicators,
        headingTop: heading?.top ?? Infinity,
        firstAction: firstAction && {
          left: firstAction.left,
          right: firstAction.right,
          top: firstAction.top,
          bottom: firstAction.bottom,
          width: firstAction.width,
          height: firstAction.height
        }
      };
    });

    expect(audit.duplicateIds, `${viewport.width}x${viewport.height}`).toEqual([]);
    expect(audit.brokenImages, `${viewport.width}x${viewport.height}`).toEqual([]);
    expect(audit.horizontalOverflow, `${viewport.width}x${viewport.height}`).toBe(false);
    expect(audit.visibleSelectionIndicators, `${viewport.width}x${viewport.height}`).toBe(1);

    if (viewport.width === 390) {
      expect(audit.headingTop).toBeLessThanOrEqual(280);
      expect(audit.firstAction).not.toBeNull();
      expect(audit.firstAction.left).toBeGreaterThanOrEqual(-1);
      expect(audit.firstAction.right).toBeLessThanOrEqual(viewport.width + 1);
      expect(audit.firstAction.top).toBeGreaterThanOrEqual(-1);
      expect(audit.firstAction.bottom).toBeLessThanOrEqual(viewport.height + 1);
      expect(audit.firstAction.width).toBeGreaterThan(0);
      expect(audit.firstAction.height).toBeGreaterThan(0);
    }
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(localHttpErrors).toEqual([]);
});

test("the SVG has an accessible text alternative and stops flow animation for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openScene(page);

  const svg = page.locator("svg").first();
  await expect(svg).toHaveCount(1);
  const svgAccessibility = await svg.evaluate((element) => {
    const title = element.querySelector("title");
    const description = element.querySelector("desc");
    const labelledBy = (element.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean);
    const describedBy = (element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    return {
      title: title?.textContent?.trim() || "",
      description: description?.textContent?.trim() || "",
      titleId: title?.id || "",
      descriptionId: description?.id || "",
      labelledBy,
      describedBy
    };
  });
  expect(svgAccessibility.title).not.toBe("");
  expect(svgAccessibility.description).not.toBe("");
  expect(svgAccessibility.labelledBy).toContain(svgAccessibility.titleId);
  expect([...svgAccessibility.labelledBy, ...svgAccessibility.describedBy])
    .toContain(svgAccessibility.descriptionId);

  await vocabButton(page, "rumor-spread-i").click();
  await expectVisibleHighlight(page, "rumor-spread-i");
  const activeFlowArrows = await page.locator("svg .flow-arrow").evaluateAll((elements) => (
    elements.filter((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none"
        && style.visibility !== "hidden"
        && Number.parseFloat(style.opacity || "1") > 0.01
        && box.width > 0
        && box.height > 0;
    }).map((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        animationPlayState: style.animationPlayState
      };
    })
  ));
  expect(activeFlowArrows.length).toBeGreaterThan(0);
  expect(activeFlowArrows.every((arrow) => (
    arrow.animationName === "none"
      || arrow.animationDuration === "0s"
      || arrow.animationPlayState === "paused"
  ))).toBe(true);
});
