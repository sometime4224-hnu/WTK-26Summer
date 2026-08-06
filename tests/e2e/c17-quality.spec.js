const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const C17_PAGES = [
  "index.html",
  "grammar1.html",
  "grammar1-support-quiz.html",
  "grammar1-speaking-pro.html",
  "grammar2.html",
  "grammar2-support-quiz.html",
  "grammar2-speaking-pro.html",
  "grammar3.html",
  "grammar3-support-material1.html",
  "grammar3-speaking-pro.html",
  "grammar4.html",
  "grammar4-support-material1.html",
  "grammar4-speaking-pro.html",
  "listening1.html",
  "listening2.html",
  "reading.html",
  "reading-cuttoon.html",
  "writing-cut.html",
  "writing-cut-teacher.html",
  "vocabulary.html",
  "vocab-support-adverb-tone.html",
  "vocab-support-meaning-map.html",
  "vocab-support-misunderstanding-sequence.html",
  "vocab-support-picture-quiz.html",
  "vocab-support-possibility-meter.html",
  "vocab-support-rumor-flow.html",
  "vocab-support-rumor-contrast.html",
  "vocab-support-rumor-scene.html",
  "rumor-game-next/index.html"
];

const MULTILANG_PAGES = [
  "grammar1.html",
  "grammar2.html",
  "grammar3.html",
  "grammar4.html",
  "reading.html",
  "reading-cuttoon.html",
  "vocabulary.html"
];

const LANGS = ["en", "vi", "ar", "mn", "kk", "th"];

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

test("all c17 static local links and assets resolve", () => {
  const repoRoot = path.resolve(__dirname, "../..");
  const missing = [];

  for (const filename of C17_PAGES) {
    const sourcePath = path.join(repoRoot, "c17", ...filename.split("/"));
    const source = fs.readFileSync(sourcePath, "utf8");
    expect(source, filename).not.toMatch(/maximum-scale\s*=\s*1|user-scalable\s*=\s*no/i);
    expect(source, filename).not.toMatch(/cdn\.tailwindcss\.com/i);
    const references = Array.from(source.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi), (match) => match[1]);

    for (const reference of references) {
      if (/^(?:https?:|data:|blob:|mailto:|tel:|javascript:|#)/i.test(reference)) continue;
      const cleanReference = decodeURIComponent(reference.split(/[?#]/)[0]);
      if (!cleanReference || cleanReference.includes("${")) continue;
      let target = path.resolve(path.dirname(sourcePath), cleanReference);
      if (cleanReference.endsWith("/")) target = path.join(target, "index.html");
      if (!fs.existsSync(target)) missing.push(`${filename} -> ${reference}`);
    }
  }

  expect(missing).toEqual([]);
  expect(fs.readFileSync(path.join(repoRoot, "c17", "reading.html"), "utf8")).not.toContain('href="listening.html"');
  expect(fs.readFileSync(path.join(repoRoot, "c17", "grammar2-speaking-pro.html"), "utf8")).toContain("처음부터 다시");
});

test("all 29 c17 pages load without page errors, duplicate IDs, or horizontal overflow", async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 320, height: 844 });

  for (const filename of C17_PAGES) {
    const errors = [];
    const failedLocalResponses = [];
    const onPageError = (error) => errors.push(error.message);
    const onResponse = (response) => {
      if (response.url().startsWith("http://127.0.0.1:4173/") && response.status() >= 400) {
        failedLocalResponses.push(`${response.status()} ${response.url()}`);
      }
    };
    page.on("pageerror", onPageError);
    page.on("response", onResponse);
    await page.goto(`/c17/${filename}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(80);

    const audit = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll("[id]")).map((element) => element.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      return {
        duplicates: Array.from(new Set(duplicates)),
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        brokenImages: Array.from(document.images)
          .filter((image) => image.complete && image.naturalWidth === 0 && (image.currentSrc || image.src))
          .map((image) => image.currentSrc || image.src)
      };
    });
    expect(errors, filename).toEqual([]);
    expect(failedLocalResponses, filename).toEqual([]);
    expect(audit.duplicates, filename).toEqual([]);
    expect(audit.brokenImages, filename).toEqual([]);
    expect(audit.overflow, filename).toBe(false);
    page.off("pageerror", onPageError);
    page.off("response", onResponse);
  }
});

test("c17 current multilingual pages expose one selected language with direction metadata", async ({ page }) => {
  await blockExternalRequests(page);

  for (const filename of MULTILANG_PAGES) {
    await page.goto(`/c17/${filename}`, { waitUntil: "domcontentloaded" });
    const disclosure = page.locator(".multilang-disclosure");
    if (await disclosure.count()) {
      await expect(disclosure).not.toHaveAttribute("open", "");
      const followsHero = await disclosure.evaluate((details) => (
        Boolean(details.previousElementSibling?.classList.contains("hero"))
      ));
      expect(followsHero, filename).toBe(true);
      await disclosure.locator("summary").click();
    }

    for (const lang of LANGS) {
      await page.locator(`[data-multilang-btn="${lang}"]`).first().click();
      await page.waitForTimeout(70);
      const result = await page.evaluate((selected) => {
        const blocks = Array.from(document.querySelectorAll("[data-lang]"));
        return {
          blocks: blocks.map((block) => ({
            lang: block.dataset.lang,
            htmlLang: block.getAttribute("lang"),
            dir: block.getAttribute("dir"),
            hidden: block.getAttribute("aria-hidden"),
            visible: getComputedStyle(block).display !== "none",
            text: block.textContent
          })),
          koTerms: Array.from(document.querySelectorAll(".ko-term")).map((term) => ({
            lang: term.getAttribute("lang"),
            dir: term.getAttribute("dir")
          })),
          activeTranslations: Array.from(document.querySelectorAll(".word-card__translation")).map((block) => ({
            lang: block.getAttribute("lang"),
            dir: block.getAttribute("dir"),
            text: block.textContent
          }))
        };
      }, lang);

      const selectedBlocks = result.blocks.filter((item) => item.lang === lang);
      const selectedTranslations = result.activeTranslations.filter((item) => item.lang === lang);
      expect(selectedBlocks.length + selectedTranslations.length, `${filename}:${lang}`).toBeGreaterThan(0);
      expect(result.blocks.filter((item) => item.visible).every((item) => item.lang === lang), `${filename}:${lang}`).toBe(true);
      expect(selectedBlocks.every((item) => item.htmlLang === lang), `${filename}:${lang}`).toBe(true);
      expect(selectedBlocks.every((item) => item.hidden === "false"), `${filename}:${lang}`).toBe(true);
      expect(result.blocks.filter((item) => item.lang !== lang).every((item) => item.hidden === "true"), `${filename}:${lang}`).toBe(true);
      expect(result.koTerms.every((item) => item.lang === "ko" && item.dir === "ltr"), `${filename}:${lang}:ko-term`).toBe(true);
      if (lang === "ar") {
        expect(selectedBlocks.concat(selectedTranslations).every((item) => item.dir === "rtl"), filename).toBe(true);
      }
      if (lang === "vi") {
        const vietnameseText = selectedBlocks.concat(selectedTranslations).map((item) => item.text).join(" ");
        expect(vietnameseText, filename).toMatch(/[ăâđêôơư]/i);
      }
    }

    await page.locator('[data-multilang-btn="kk"]').first().click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-multilang-btn="kk"]').first()).toHaveAttribute("aria-pressed", "true");
    const restoredDisclosure = page.locator(".multilang-disclosure");
    if (await restoredDisclosure.count()) {
      await restoredDisclosure.locator("summary").click();
    }
    await page.locator('[data-multilang-btn="none"]').first().click();
    await expect(page.locator("[data-lang].lang-visible")).toHaveCount(0);
  }
});

test("c17 Vietnamese text is accented and listening/support pages expose no legacy Vietnamese scaffold", async ({ page, request }) => {
  await blockExternalRequests(page);
  await page.goto("/c17/grammar2.html", { waitUntil: "domcontentloaded" });
  await page.locator(".multilang-disclosure summary").click();
  await page.locator('[data-multilang-btn="vi"]').click();
  await expect(page.locator('[data-lang="vi"].lang-visible')).toContainText("Hỗ trợ tiếng Việt");

  for (const filename of ["listening1.html", "listening2.html", "grammar1-support-quiz.html", "grammar2-support-quiz.html"]) {
    await page.goto(`/c17/${filename}`, { waitUntil: "domcontentloaded" });
    const sourceState = await page.evaluate(() => ({
      legacyNodes: document.querySelectorAll(".vi-text, #viToggle, #contextVi, [data-vi-panel]").length,
      hasInstructionToggle: document.querySelectorAll('[data-action="set-instruction-language"]').length
    }));
    expect(sourceState.legacyNodes, filename).toBe(0);
    expect(sourceState.hasInstructionToggle, filename).toBe(0);
  }

  const listeningSource = await (await request.get("/c17/listening-data.js")).text();
  expect(listeningSource).not.toMatch(/\b(?:title|description|featureList|context)?Vi\s*:/);
  expect(listeningSource).not.toMatch(/\bvi\s*:/);

  for (const filename of ["grammar1-support-quiz.html", "grammar2-support-quiz.html", "vocab-support-possibility-meter.html"]) {
    const source = await (await request.get(`/c17/${filename}`)).text();
    expect(source, filename).not.toMatch(/viToggle|vi-text|contextVi|data-vi-panel/);
  }
});

test("teacher writing renders the full activity and keeps a separate state key", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c17/writing-cut-teacher.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("교사용");
  await expect(page.locator("#cutRail button")).toHaveCount(9);
  await expect(page.locator("#modeRow button")).toHaveCount(4);
  await page.locator('[data-choice-index="0"]').click();
  await page.locator("#checkBtn").click();
  await expect(page.locator("#feedback")).toContainText("정답");
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("korean3b.c17.writing-cut")));
  expect(keys).toContain("korean3b.c17.writing-cut-teacher.v1");
  expect(keys).not.toContain("korean3b.c17.writing-cut-student.v1");
});

test("C17ActivityState preserves unknown records and isolates page reset", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => {
    if (sessionStorage.getItem("c17-unknown-state-seeded")) {
      return;
    }
    sessionStorage.setItem("c17-unknown-state-seeded", "true");
    localStorage.setItem("korean3b.c17.grammar1.v1", JSON.stringify({
      schemaVersion: 99,
      pageId: "grammar1",
      state: { future: true }
    }));
    localStorage.setItem("korean3b.c17.keep.v1", "keep");
  });
  await page.goto("/c17/grammar1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#activityStateTools")).toContainText("다른 버전");
  const before = await page.evaluate(() => localStorage.getItem("korean3b.c17.grammar1.v1"));
  await page.locator("#tabPractice").click();
  const after = await page.evaluate(() => ({
    record: localStorage.getItem("korean3b.c17.grammar1.v1"),
    keep: localStorage.getItem("korean3b.c17.keep.v1")
  }));
  expect(after.record).toBe(before);
  expect(after.keep).toBe("keep");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "이 페이지 기록 초기화" }).click();
  const reset = await page.evaluate(() => ({
    record: localStorage.getItem("korean3b.c17.grammar1.v1"),
    keep: localStorage.getItem("korean3b.c17.keep.v1")
  }));
  if (reset.record !== null) {
    const resetPayload = JSON.parse(reset.record);
    expect(resetPayload.schemaVersion).toBe(1);
    expect(resetPayload.pageId).toBe("grammar1");
    expect(resetPayload.state).toMatchObject({ index: 0, score: 0, complete: false, tab: "learn" });
  }
  expect(reset.keep).toBe("keep");

  await page.evaluate(() => localStorage.setItem("korean3b.c17.grammar2.v1", "{broken-json"));
  await page.goto("/c17/grammar2.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#activityStateTools")).toContainText("읽을 수 없습니다");
  await page.locator("#tabPractice").click();
  const corruptRecord = await page.evaluate(() => localStorage.getItem("korean3b.c17.grammar2.v1"));
  expect(corruptRecord).toBe("{broken-json");
});

test("C17ActivityState keeps progress in memory when storage writes fail", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (String(key).startsWith("korean3b.c17.")) {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return nativeSetItem.call(this, key, value);
    };
  });
  await page.goto("/c17/grammar1.html", { waitUntil: "domcontentloaded" });
  await page.locator("#tabPractice").click();
  await page.locator("#choices .choice").first().click();
  await expect(page.locator("#activityStateTools")).toContainText("저장하지 못했습니다");
  await expect(page.getByRole("button", { name: "현재 기록 내려받기" })).toBeVisible();
});

test("C17ActivityState reports an unavailable browser store without breaking the activity", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => {
    const nativeGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (String(key).startsWith("korean3b.c17.")) {
        throw new DOMException("Storage unavailable", "SecurityError");
      }
      return nativeGetItem.call(this, key);
    };
  });
  await page.goto("/c17/grammar1.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#activityStateTools")).toContainText("저장소를 사용할 수 없습니다");
  await page.locator("#tabPractice").click();
  await expect(page.locator("#practicePanel")).toBeVisible();
});

test("grammar and vocabulary support activities restore partial progress", async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto("/c17/grammar3-support-material1.html", { waitUntil: "domcontentloaded" });
  await page.locator(".image-reveal").first().click();
  await expect(page.locator(".image-reveal").first()).toHaveClass(/is-revealed/);
  await page.waitForFunction(() => {
    const raw = localStorage.getItem("korean3b.c17.grammar3-support-material1.v1");
    return raw && JSON.parse(raw).state.actions.length === 1;
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".image-reveal").first()).toHaveClass(/is-revealed/);

  await page.goto("/c17/grammar4-support-material1.html", { waitUntil: "domcontentloaded" });
  await page.locator(".reveal-mask").first().click();
  await page.waitForFunction(() => {
    const raw = localStorage.getItem("korean3b.c17.grammar4-support-material1.v1");
    return raw && JSON.parse(raw).state.actions.length === 1;
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".reveal-mask").first()).toHaveClass(/is-revealed/);

  await page.goto("/c17/vocab-support-possibility-meter.html", { waitUntil: "domcontentloaded" });
  await page.locator('[data-expression="no-reason"]').click();
  await page.locator("#check-btn").click();
  await page.waitForFunction(() => {
    const raw = localStorage.getItem("korean3b.c17.vocab-support-possibility-meter.v1");
    return raw && JSON.parse(raw).state.actions.length >= 2;
  });
  const feedback = await page.locator("#feedback").textContent();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#feedback")).toHaveText(feedback);
  await page.locator("#reset-btn").click();
  await page.waitForFunction(() => {
    const raw = localStorage.getItem("korean3b.c17.vocab-support-possibility-meter.v1");
    return raw && JSON.parse(raw).state.actions.length === 0;
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#feedback")).toContainText("표현을 선택하세요");
});

test("listening normalizes an old Vietnamese preference and keeps the state API stable", async ({ page }) => {
  await blockExternalRequests(page);
  const languageKey = "korean3b.listening.v3:/c17/listening1.html:page:instruction-language";
  await page.addInitScript((key) => {
    localStorage.setItem(key, JSON.stringify("vi"));
  }, languageKey);
  await page.goto("/c17/listening1.html", { waitUntil: "domcontentloaded" });
  const normalized = await page.evaluate((key) => localStorage.getItem(key), languageKey);
  expect(normalized).toBe(JSON.stringify("ko"));
  await expect(page.locator('[data-action="set-instruction-language"]')).toHaveCount(0);

  await page.goto("/c17/grammar1.html", { waitUntil: "domcontentloaded" });
  const methods = await page.evaluate(() => {
    const store = window.C17ActivityState.create("api-contract-test", { ok: true });
    return Object.keys(store).sort();
  });
  expect(methods).toEqual(["exportRecovery", "flush", "get", "mount", "reset", "save"]);
});

test("grammar quiz completion survives reload", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c17/grammar1.html", { waitUntil: "domcontentloaded" });
  await page.locator("#tabPractice").click();
  const questionCount = await page.evaluate(() => window.C17_GRAMMAR_PAGE.quiz.length);

  for (let index = 0; index < questionCount; index += 1) {
    const answer = await page.evaluate((questionIndex) => (
      window.C17_GRAMMAR_PAGE.quiz[questionIndex].answer
    ), index);
    await page.locator("#choices .choice").nth(answer).click();
    await page.locator("#nextBtn").click();
  }

  await expect(page.locator("#resultCard")).toHaveClass(/show/);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#practicePanel")).toBeVisible();
  await expect(page.locator("#resultCard")).toHaveClass(/show/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("korean3b.c17.grammar1.v1")));
  expect(saved.state.complete).toBe(true);
  expect(saved.state.score).toBe(questionCount);
});

test("vocabulary flip and speech controls are sibling buttons with correct hidden state", async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("button button")).toHaveCount(0);
  const firstCard = page.locator(".word-card").first();
  const flipButton = firstCard.locator(".word-card__flip");
  const speakButton = firstCard.locator(".card-action--speak");
  await expect(firstCard.locator(".word-card__back")).toHaveAttribute("aria-hidden", "true");
  await expect(speakButton).toHaveAttribute("aria-hidden", "true");
  await expect(speakButton).toHaveAttribute("tabindex", "-1");
  await flipButton.click();
  await expect(flipButton).toHaveAttribute("aria-pressed", "true");
  await expect(firstCard.locator(".word-card__front")).toHaveAttribute("aria-hidden", "true");
  await expect(firstCard.locator(".word-card__back")).toHaveAttribute("aria-hidden", "false");
  await expect(speakButton).toHaveAttribute("aria-hidden", "false");
  await expect(speakButton).toHaveAttribute("tabindex", "0");
});

test("validated legacy writing state migrates without deleting its rollback key", async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => {
    localStorage.setItem("korean3b.c17.writing-cut.v1", JSON.stringify({
      cutIndex: 2,
      stageIndex: 1,
      done: { "1:choice": true }
    }));
    localStorage.setItem("korean3b.c17.reading.rumor-note", "검증된 이전 읽기 메모");
  });
  await page.goto("/c17/writing-cut.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#stageEyebrow")).toContainText("Cut 3 · Step 2");
  const records = await page.evaluate(() => ({
    legacy: localStorage.getItem("korean3b.c17.writing-cut.v1"),
    current: JSON.parse(localStorage.getItem("korean3b.c17.writing-cut-student.v1"))
  }));
  expect(records.legacy).not.toBeNull();
  expect(records.current.schemaVersion).toBe(1);
  expect(records.current.pageId).toBe("writing-cut-student");
  expect(records.current.state.cutIndex).toBe(2);
  expect(records.current.state.stageIndex).toBe(1);

  await page.goto("/c17/reading.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#rumorNote")).toHaveValue("검증된 이전 읽기 메모");
  const readingRecords = await page.evaluate(() => ({
    legacy: localStorage.getItem("korean3b.c17.reading.rumor-note"),
    current: JSON.parse(localStorage.getItem("korean3b.c17.reading.v1"))
  }));
  expect(readingRecords.legacy).toBe("검증된 이전 읽기 메모");
  expect(readingRecords.current.state.note).toBe("검증된 이전 읽기 메모");
});

test("representative c17 layouts remain usable on desktop and at 200 percent zoom equivalent", async ({ page }) => {
  await blockExternalRequests(page);
  const pages = ["index.html", "grammar2.html", "reading.html", "vocabulary.html", "writing-cut.html", "rumor-game-next/index.html"];
  for (const viewport of [{ width: 1440, height: 900 }, { width: 720, height: 450 }]) {
    await page.setViewportSize(viewport);
    for (const filename of pages) {
      await page.goto(`/c17/${filename}`, { waitUntil: "domcontentloaded" });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        focusable: Boolean(document.querySelector("main button, main a, #startButton, [data-multilang-btn]"))
      }));
      expect(layout.overflow, `${filename}:${viewport.width}`).toBe(false);
      expect(layout.focusable, `${filename}:${viewport.width}`).toBe(true);
    }
  }
});

test("hub and game keep the learning goal and first action in the 320px first viewport", async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 320, height: 844 });

  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  const hub = await page.evaluate(() => {
    const heading = document.querySelector(".hero h1").getBoundingClientRect();
    const action = document.querySelector(".hero a").getBoundingClientRect();
    return { headingBottom: heading.bottom, actionBottom: action.bottom, actionHeight: action.height };
  });
  expect(hub.headingBottom).toBeLessThan(844);
  expect(hub.actionBottom).toBeLessThan(844);
  expect(hub.actionHeight).toBeGreaterThanOrEqual(44);

  await page.goto("/c17/rumor-game-next/index.html", { waitUntil: "domcontentloaded" });
  const start = await page.locator("#startButton").boundingBox();
  expect(start.y + start.height).toBeLessThan(844);
  expect(start.height).toBeGreaterThanOrEqual(44);
});

test("keyboard focus remains visible and reduced-motion preferences are honored", async ({ page }) => {
  await blockExternalRequests(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/c17/grammar2.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector("link[data-c17-quality]")?.sheet);
  await page.locator("#tabPractice").focus();
  const accessibility = await page.locator("#tabPractice").evaluate((button) => {
    const style = getComputedStyle(button);
    const seconds = style.transitionDuration
      .split(",")
      .map((value) => value.trim().endsWith("ms") ? parseFloat(value) / 1000 : parseFloat(value))
      .filter(Number.isFinite);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: parseFloat(style.outlineWidth),
      maxTransitionSeconds: seconds.length ? Math.max(...seconds) : 0
    };
  });
  expect(accessibility.outlineStyle).not.toBe("none");
  expect(accessibility.outlineWidth).toBeGreaterThan(0);
  expect(accessibility.maxTransitionSeconds).toBeLessThanOrEqual(0.001);
});
