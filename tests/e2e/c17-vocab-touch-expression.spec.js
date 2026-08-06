const { test, expect } = require("@playwright/test");

const PAGE_URL = "/c17/vocab-support-touch-expression.html";
const PAGE_ID = "vocab-support-touch-expression";
const STORAGE_KEY = `korean3b.c17.${PAGE_ID}.v1`;
const OTHER_KEY = "korean3b.c17.touch-expression-unrelated.v1";

const EXPRESSIONS = [
  { id: "rumor-appear", sentence: "소문이 나다", actor: "?", subject: "핵심 · 소문", form: "형태 · 이/가" },
  { id: "rumor-start", sentence: "수진이가 소문을 내다", actor: "수진", subject: "핵심 · 수진", form: "형태 · 을/를" },
  { id: "rumor-spread", sentence: "소문이 퍼지다", actor: "?", subject: "핵심 · 소문", form: "형태 · 이/가" },
  { id: "rumor-scatter", sentence: "수진이가 소문을 퍼뜨리다", actor: "수진", subject: "핵심 · 수진", form: "형태 · 을/를" },
  { id: "by-chance", sentence: "우연히 두 사람의 이야기를 듣다" },
  { id: "honestly", sentence: "솔직히 자기 생각을 말하다" },
  { id: "disappointed", sentence: "친구의 거짓말에 실망하다" },
  { id: "misunderstand", sentence: "상대방의 말을 오해하다" }
];

async function blockExternalRequests(page) {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (["127.0.0.1", "localhost"].includes(url.hostname)) {
      await route.continue();
      return;
    }
    await route.fulfill({ status: 204, contentType: "text/plain", body: "" });
  });
}

async function clearTargetStorage(page) {
  await page.addInitScript(({ key }) => {
    const marker = "c17-touch-expression-storage-cleared";
    if (sessionStorage.getItem(marker) === "yes") return;
    localStorage.removeItem(key);
    sessionStorage.setItem(marker, "yes");
  }, { key: STORAGE_KEY });
}

async function openActivity(page) {
  await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => (
    document.querySelectorAll("button[data-expression]").length === 8
      && document.querySelector("#activityStateTools")
      && document.querySelector("#liveSentence")
  ));
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

function expressionButton(page, id) {
  return page.locator(`button[data-expression="${id}"]`);
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
  await clearTargetStorage(page);
});

test("chapter, vocabulary, and scene pages link to the separate touch activity", async ({ page }) => {
  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  const chapterLink = page.locator('a[href="vocab-support-touch-expression.html"]:visible');
  await expect(chapterLink).toHaveCount(1);
  await expect(chapterLink).toContainText("터치 활동");
  await expect(chapterLink).toContainText("눌러서 표현 바꾸기");
  await expect(page.locator(".hero__chip").filter({ hasText: "어휘 자료 6개" })).toHaveCount(1);

  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="vocab-support-touch-expression.html"]')).toContainText("터치활동");

  await page.goto("/c17/vocab-support-rumor-scene.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="vocab-support-touch-expression.html"]')).toContainText("터치 활동");
});

test("touching each object immediately changes the expression and completes all eight", async ({ page }) => {
  await openActivity(page);

  await expect(page.locator('button[data-expression][aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator("#liveSentence")).toHaveText("장면 속 대상을 눌러 보세요.");
  await expect(page.locator("#actorLabel")).toHaveText("?");

  for (let index = 0; index < EXPRESSIONS.length; index += 1) {
    const expression = EXPRESSIONS[index];
    await expressionButton(page, expression.id).click();
    await expect(page.locator('button[data-expression][aria-pressed="true"]')).toHaveCount(1);
    await expect(expressionButton(page, expression.id)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#liveSentence")).toHaveText(expression.sentence);
    await expect(expressionButton(page, expression.id)).toHaveClass(/is-visited/);
    await expect(page.locator("#progressText")).toContainText(`${index + 1}/8`);

    if (expression.actor) {
      await expect(page.locator("#actorLabel")).toHaveText(expression.actor);
      await expect(page.locator("#subjectChip")).toHaveText(expression.subject);
      await expect(page.locator("#particleChip")).toHaveText(expression.form);
    }
  }

  await expect(page.locator("button[data-expression].is-visited")).toHaveCount(8);
  await expect(page.locator("#progressText")).toContainText("활동 완료");
  await expect(page.locator("#completionMessage")).toContainText("8개 표현을 모두");
  await expect(page.locator(".completion-panel")).toHaveClass(/is-complete/);
});

test("native touch targets support keyboard selection with a visible focus", async ({ page }) => {
  await openActivity(page);

  const first = expressionButton(page, "rumor-appear");
  await first.focus();
  await expect(first).toBeFocused();
  expect(await first.evaluate((element) => {
    const style = getComputedStyle(element);
    return element.matches(":focus-visible")
      && Number.parseFloat(style.outlineWidth) > 0
      && style.outlineStyle !== "none";
  })).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.locator("#liveSentence")).toHaveText("소문이 나다");

  const second = expressionButton(page, "rumor-start");
  await second.focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#liveSentence")).toHaveText("수진이가 소문을 내다");
});

test("selection and visited expressions restore while another page record remains isolated", async ({ page }) => {
  const unrelated = JSON.stringify({ keep: "unchanged" });
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
    key: OTHER_KEY,
    value: unrelated
  });
  await openActivity(page);

  await expressionButton(page, "rumor-start").click();
  await expressionButton(page, "honestly").click();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).not.toBeNull();

  const payload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(payload.schemaVersion).toBe(1);
  expect(payload.pageId).toBe(PAGE_ID);
  expect(payload.state).toEqual({ selectedId: "honestly", visited: ["rumor-start", "honestly"] });

  await page.reload({ waitUntil: "domcontentloaded" });
  await openActivity(page);
  await expect(page.locator("#liveSentence")).toHaveText("솔직히 자기 생각을 말하다");
  await expect(page.locator("button[data-expression].is-visited")).toHaveCount(2);
  expect(await page.evaluate((key) => localStorage.getItem(key), OTHER_KEY)).toBe(unrelated);

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#resetActivity").click();
  await expect(page.locator('button[data-expression][aria-pressed="true"]')).toHaveCount(0);
  await expect(page.locator("button[data-expression].is-visited")).toHaveCount(0);
  await expect(page.locator("#liveSentence")).toHaveText("장면 속 대상을 눌러 보세요.");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), OTHER_KEY)).toBe(unrelated);
});

test("corrupt and unknown-version records remain untouched while the activity stays usable", async ({ browser }) => {
  const records = [
    "{not valid json",
    JSON.stringify({ schemaVersion: 88, pageId: PAGE_ID, state: { selectedId: "rumor-start", visited: [] } })
  ];

  for (const record of records) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await blockExternalRequests(page);
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
      key: STORAGE_KEY,
      value: record
    });
    await openActivity(page);
    await expressionButton(page, "rumor-appear").click();
    await expect(page.locator("#liveSentence")).toHaveText("소문이 나다");
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(record);
    await context.close();
  }
});

test("the touch activity remains readable and reachable at target viewports", async ({ page }) => {
  const pageErrors = [];
  const consoleErrors = [];
  const localHttpErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (["127.0.0.1", "localhost"].includes(url.hostname) && response.status() >= 400) {
      localHttpErrors.push(`${response.status()} ${url.pathname}`);
    }
  });

  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 720, height: 450 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await openActivity(page);
    const audit = await page.evaluate(() => {
      const firstAction = document.querySelector("button[data-expression]").getBoundingClientRect();
      const livePanel = document.querySelector("#livePanel").getBoundingClientRect();
      const images = Array.from(document.images);
      const duplicateIds = Object.entries(Array.from(document.querySelectorAll("[id]")).reduce((all, element) => {
        all[element.id] = (all[element.id] || 0) + 1;
        return all;
      }, {})).filter(([, count]) => count > 1).map(([id]) => id);
      return {
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        duplicateIds,
        brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).length,
        firstAction: { top: firstAction.top, bottom: firstAction.bottom, width: firstAction.width, height: firstAction.height },
        livePanelTop: livePanel.top
      };
    });

    expect(audit.overflow, `${viewport.width}x${viewport.height}`).toBe(false);
    expect(audit.duplicateIds, `${viewport.width}x${viewport.height}`).toEqual([]);
    expect(audit.brokenImages, `${viewport.width}x${viewport.height}`).toBe(0);
    expect(audit.firstAction.width).toBeGreaterThanOrEqual(44);
    expect(audit.firstAction.height).toBeGreaterThanOrEqual(44);
    if (viewport.width === 390) {
      expect(audit.firstAction.top).toBeGreaterThanOrEqual(0);
      expect(audit.firstAction.bottom).toBeLessThanOrEqual(viewport.height);
    }

    const last = expressionButton(page, "misunderstand");
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(page.locator("#liveSentence")).toHaveText("상대방의 말을 오해하다");
    const stickyTop = await page.locator("#livePanel").evaluate((element) => element.getBoundingClientRect().top);
    expect(stickyTop, `${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(45);
    expect(stickyTop, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(70);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(localHttpErrors).toEqual([]);
});
