const fs = require("node:fs");
const path = require("node:path");
const { test, expect } = require("@playwright/test");

const PAGE_PATH = "/c14/vocab-support-lab.html";
const STORAGE_KEY = "c14-vocab-support-city-change-v1";
const repoRoot = path.resolve(__dirname, "../..");
const TARGET_WORDS = [
  "여유가 없다",
  "활기차다",
  "공해가 심하다",
  "편의 시설이 잘되어 있다",
  "사라지다",
  "생기다",
  "변하다",
  "몰라보다",
  "상상이 되다",
  "상상이 안 되다"
];

function sourceVocabularyWords() {
  const source = fs.readFileSync(path.join(repoRoot, "c14", "vocabulary.html"), "utf8");
  const configStart = source.indexOf("window.VOCABULARY_CONFIG =");
  const configEnd = source.indexOf("window.MULTILANG_CONFIG", configStart);
  const configSource = source.slice(configStart, configEnd);
  return [...configSource.matchAll(/\bko:\s*"([^"]+)"/g)].map((match) => match[1]);
}

function sourceFarmingGameWords() {
  const source = fs.readFileSync(path.join(repoRoot, "c14", "farming-game", "game.js"), "utf8");
  return ["nounWords", "verbWords", "moodExpressions"].flatMap((name) => {
    const arrayMatch = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\n\\];`));
    if (!arrayMatch) throw new Error(`${name} 배열을 찾을 수 없습니다.`);
    return [...arrayMatch[1].matchAll(/\blabel:\s*"([^"]+)"/g)].map((match) => match[1]);
  });
}

async function clearProgress(page) {
  await page.addInitScript(({ key, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    localStorage.removeItem(key);
    sessionStorage.setItem(marker, "true");
  }, { key: STORAGE_KEY, marker: "c14-vocab-support-test-cleared" });
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test.beforeEach(async ({ page }) => {
  await clearProgress(page);
});

test("남은 10개 어휘만 네 가지 의미 활동으로 구성하고 두 어휘 화면에서 연결한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  await expect(page.locator("h1")).toHaveText("도시와 변화 어휘 연구소");
  await expect(page.locator(".activity-tab")).toHaveCount(4);
  await expect(page.locator(".word-chip")).toHaveCount(10);

  const scope = await page.evaluate(() => {
    const support = window.C14_VOCAB_SUPPORT;
    const answers = support.activities.flatMap((activity) => activity.items.map((item) => item.answer));
    return {
      targets: [...support.targetWords].sort(),
      farmingWords: [...support.farmingGameWords].sort(),
      answerWords: [...new Set(answers)].sort(),
      overlap: support.targetWords.filter((word) => support.farmingGameWords.includes(word)),
      itemCount: support.activities.reduce((sum, activity) => sum + activity.items.length, 0)
    };
  });
  const vocabularyWords = sourceVocabularyWords();
  const farmingWords = sourceFarmingGameWords();
  const sourceTargets = vocabularyWords.filter((word) => !farmingWords.includes(word));
  expect(vocabularyWords).toHaveLength(28);
  expect(farmingWords).toHaveLength(18);
  expect(sourceTargets.sort()).toEqual([...TARGET_WORDS].sort());
  expect(scope.targets).toEqual([...TARGET_WORDS].sort());
  expect(scope.targets).toEqual(sourceTargets.sort());
  expect(scope.farmingWords).toEqual(farmingWords.sort());
  expect(scope.answerWords).toEqual([...TARGET_WORDS].sort());
  expect(scope.overlap).toEqual([]);
  expect(scope.itemCount).toBe(20);

  await page.goto("/c14/index.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('a[href="vocab-support-lab.html"]')).toContainText("도시와 변화 어휘 연구소");

  await page.goto("/c14/vocabulary.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator('.topbar a[href="vocab-support-lab.html"]')).toContainText("유형별 활동");
  await expect(page.locator('.footer-nav a[href="vocab-support-lab.html"]')).toContainText("유형별 활동");
});

test("좌측 장면은 20개의 경량 WebP 에셋을 현재 문항에만 불러온다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  const imageSources = await page.evaluate(() =>
    window.C14_VOCAB_SUPPORT.activities.flatMap((activity) => activity.items.map((item) => item.image))
  );
  expect(imageSources).toHaveLength(20);
  expect(new Set(imageSources).size).toBe(20);
  expect(imageSources.every((source) => source.endsWith(".webp"))).toBe(true);

  let totalBytes = 0;
  for (const source of imageSources) {
    const filePath = path.resolve(repoRoot, "c14", source);
    expect(fs.existsSync(filePath), source).toBe(true);
    const bytes = fs.statSync(filePath).size;
    expect(bytes, source).toBeLessThanOrEqual(64 * 1024);
    totalBytes += bytes;
  }
  expect(totalBytes).toBeLessThanOrEqual(640 * 1024);

  const initiallyLoaded = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((entry) => entry.name.includes("/vocab-support-lab/") && entry.name.endsWith(".webp")).length);
  expect(initiallyLoaded).toBe(1);

  const decoded = await page.evaluate(async (sources) => Promise.all(sources.map((source) => new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ source, loaded: true, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({ source, loaded: false });
    image.src = source;
  }))), imageSources);
  expect(decoded.filter((image) => !image.loaded)).toEqual([]);
  expect(new Set(decoded.map((image) => `${image.width}×${image.height}`))).toEqual(new Set(["512×384"]));

  await expect(page.locator(".scene-panel img")).toHaveCount(1);
  await expect(page.locator(".scene-symbol, .frame-symbol")).toHaveCount(0);
  expect(await page.locator(".scene-panel img").evaluate((image) =>
    image.complete &&
    image.naturalWidth === 512 &&
    image.naturalHeight === 384 &&
    image.alt === "" &&
    image.getAttribute("aria-hidden") === "true" &&
    image.loading === "eager" &&
    image.decoding === "async"
  )).toBe(true);

  for (const activityId of ["city", "existence", "change", "imagine"]) {
    await page.evaluate((id) => window.C14_VOCAB_SUPPORT.selectActivity(id, false), activityId);
    await expect(page.locator(".scene-panel img")).toHaveCount(1);
    await expect(page.locator(".scene-panel img")).toHaveJSProperty("complete", true);
    await expect(page.locator(".scene-symbol, .frame-symbol")).toHaveCount(0);
  }

});

test("도시 단서를 찾고 오답을 고친 뒤 진행을 새로고침해 복원한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "새 가방이 있어요" }).click();
  await expect(page.locator("#live-region")).toContainText("다른 단서");
  await page.getByRole("button", { name: "점심에도 일해요" }).click();
  await page.getByRole("button", { name: "쉴 시간이 없어요" }).click();

  await expect(page.locator(".answer-area")).toBeVisible();
  await page.getByRole("button", { name: "활기차다", exact: true }).click();
  await expect(page.locator(".feedback")).toHaveClass(/is-wrong/);
  await page.getByRole("button", { name: "여유가 없다", exact: true }).click();
  await expect(page.locator(".feedback")).toContainText("정답 · 여유가 없다");

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.activities.city.answers["city-busy-work"].attempts).toEqual(["활기차다", "여유가 없다"]);
  expect(saved.activities.city.answers["city-busy-work"].correct).toBe(true);
  expect(saved.activities.city.clues["city-busy-work"]).toHaveLength(2);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator(".feedback")).toContainText("정답 · 여유가 없다");
  await expect(page.getByRole("button", { name: "다음 문제" })).toBeVisible();
  await page.getByRole("button", { name: "다음 문제" }).click();
  await expect(page.locator(".scene-caption")).toContainText("토요일 시장");
});

test("존재 변화는 누르기와 놓기 방식으로 방향을 구별한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /변화 필름 맞추기/ }).click();

  await expect(page.locator(".film-drop-zone")).toContainText("여기에 단어 놓기");
  await page.getByRole("button", { name: "생기다", exact: true }).click();
  await expect(page.locator(".feedback")).toHaveClass(/is-wrong/);
  await page.getByRole("button", { name: "사라지다", exact: true }).click();
  await expect(page.locator(".film-drop-zone")).toHaveClass(/is-filled/);
  await expect(page.locator(".film-drop-zone")).toHaveText("사라지다");
});

test("옛사진 탐정은 나중 장면을 연 뒤 변하다와 몰라보다를 판단한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /옛사진 탐정/ }).click();

  await expect(page.locator(".answer-area")).toBeHidden();
  await page.getByRole("button", { name: "나중 사진 보기" }).click();
  await expect(page.locator(".answer-area")).toBeVisible();
  await page.getByRole("button", { name: "변하다", exact: true }).click();
  await expect(page.locator(".feedback")).toContainText("정답 · 변하다");

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("tab", { name: /옛사진 탐정/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".answer-area")).toBeVisible();
  await expect(page.locator(".feedback")).toContainText("정답 · 변하다");
});

test("상상 구름은 가능과 불가능 표현을 즉시 피드백한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: /상상 구름 고르기/ }).click();

  await expect(page.locator(".speech-bubble")).toHaveCount(2);
  await page.getByRole("button", { name: "상상이 되다", exact: true }).click();
  await expect(page.locator(".feedback")).toContainText("정답 · 상상이 되다");
});

test("학습자 화면은 한국어로 안내하고 활동 탭은 방향키 초점을 유지한다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  const visibleText = await page.locator("body").innerText();
  expect(visibleText).not.toMatch(/[A-Za-z]{2,}/);

  const firstTab = page.getByRole("tab", { name: /도시 단서 찾기/ });
  const secondTab = page.getByRole("tab", { name: /변화 필름 맞추기/ });
  await expect(page.locator("#activity-card")).toHaveAttribute("role", "tabpanel");
  await expect(page.locator("#activity-card")).toHaveAttribute("aria-labelledby", "activity-tab-city");
  expect(await page.locator(".activity-tab").evaluateAll((tabs) => tabs.map((tab) => tab.tabIndex))).toEqual([0, -1, -1, -1]);
  await firstTab.focus();
  const focusStyle = await firstTab.evaluate((node) => {
    const style = getComputedStyle(node);
    return { outlineWidth: style.outlineWidth, boxShadow: style.boxShadow };
  });
  expect(focusStyle.outlineWidth).toBe("0px");
  expect(focusStyle.boxShadow).not.toBe("none");
  await page.keyboard.press("ArrowRight");
  await expect(secondTab).toHaveAttribute("aria-selected", "true");
  await expect(secondTab).toBeFocused();
  await expect(page.locator("#activity-card")).toHaveAttribute("aria-labelledby", "activity-tab-existence");
  expect(await page.locator(".activity-tab").evaluateAll((tabs) => tabs.map((tab) => tab.tabIndex))).toEqual([-1, 0, -1, -1]);
});

test("키보드 선택 뒤 다음 학습 행동으로 초점이 이어진다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

  await page.getByRole("button", { name: "점심에도 일해요" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".clue-button:focus")).toHaveCount(1);

  await page.getByRole("button", { name: "쉴 시간이 없어요" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".answer-button:focus")).toHaveCount(1);

  await page.getByRole("button", { name: "활기차다", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".answer-button:focus")).toHaveCount(1);

  await page.getByRole("button", { name: "여유가 없다", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "다음 문제" })).toBeFocused();

  await page.getByRole("tab", { name: /옛사진 탐정/ }).click();
  await page.getByRole("button", { name: "나중 사진 보기" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".answer-button:focus")).toHaveCount(1);
});

test("20문항을 끝까지 풀면 네 활동과 10개 어휘가 모두 완료 상태로 복원된다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  const activities = await page.evaluate(() => window.C14_VOCAB_SUPPORT.activities);

  for (const activity of activities) {
    await page.getByRole("tab", { name: new RegExp(activity.title) }).click();
    for (const item of activity.items) {
      if (activity.id === "city") {
        for (const clue of item.clues.filter((candidate) => candidate.key)) {
          await page.locator(`[data-clue-id="${clue.id}"]`).click();
        }
      }
      if (activity.id === "change") {
        await page.getByRole("button", { name: "나중 사진 보기" }).click();
      }
      await page.getByRole("button", { name: item.answer, exact: true }).click();
      await expect(page.locator(".feedback")).toContainText(`정답 · ${item.answer}`);
      await page.getByRole("button", { name: /다음 문제|활동 마치기/ }).click();
    }
    await expect(page.locator(".completion h2")).toContainText(`${activity.title} 완료`);
  }

  await expect(page.locator("#overall-progress-text")).toHaveText("20 / 20");
  await expect(page.locator(".activity-tab.is-complete")).toHaveCount(4);
  await expect(page.locator(".word-chip.is-learned")).toHaveCount(10);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#overall-progress-text")).toHaveText("20 / 20");
  await expect(page.locator(".activity-tab.is-complete")).toHaveCount(4);
  await expect(page.locator(".completion h2")).toContainText("상상 구름 고르기 완료");
});

for (const viewport of [
  { width: 360, height: 740 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 }
]) {
  test(`${viewport.width}×${viewport.height} 화면에서 첫 학습 행동과 터치 영역이 안정적이다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
    await expectNoHorizontalOverflow(page);

    const firstClue = page.locator(".clue-button").first();
    const metrics = await firstClue.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, height: rect.height, width: rect.width, viewportHeight: window.innerHeight };
    });
    expect(metrics.top / metrics.viewportHeight).toBeLessThan(0.9);
    expect(metrics.height).toBeGreaterThanOrEqual(44);
    expect(metrics.width).toBeGreaterThanOrEqual(44);
  });
}

test("짧은 스마트폰 화면에서도 네 활동의 첫 행동과 선택 탭이 화면 안에 있다", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const actionSelectors = {
    city: ".clue-button",
    existence: ".film-word",
    change: ".reveal-button",
    imagine: ".cloud-choice"
  };

  for (const viewport of [{ width: 375, height: 667 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });

    for (const [activityId, actionSelector] of Object.entries(actionSelectors)) {
      await page.evaluate(({ key, activityId }) => {
        const saved = JSON.parse(localStorage.getItem(key)) || window.C14_VOCAB_SUPPORT.getState();
        saved.currentActivity = activityId;
        localStorage.setItem(key, JSON.stringify(saved));
      }, { key: STORAGE_KEY, activityId });
      await page.reload({ waitUntil: "domcontentloaded" });

      await expect.poll(() => page.evaluate(() => {
        const tabs = document.querySelector("#activity-tabs").getBoundingClientRect();
        const activeTab = document.querySelector('.activity-tab[aria-selected="true"]').getBoundingClientRect();
        return activeTab.left >= tabs.left - 1 && activeTab.right <= tabs.right + 1;
      })).toBe(true);

      const metrics = await page.evaluate((selector) => {
        const tabs = document.querySelector("#activity-tabs").getBoundingClientRect();
        const activeTab = document.querySelector('.activity-tab[aria-selected="true"]').getBoundingClientRect();
        const action = document.querySelector(selector).getBoundingClientRect();
        return { tabs, activeTab, actionBottom: action.bottom, height: window.innerHeight };
      }, actionSelector);

      expect(metrics.activeTab.left).toBeGreaterThanOrEqual(metrics.tabs.left - 1);
      expect(metrics.activeTab.right).toBeLessThanOrEqual(metrics.tabs.right + 1);
      expect(metrics.actionBottom).toBeLessThanOrEqual(metrics.height);
      await expectNoHorizontalOverflow(page);

      expect(await page.locator(".scene-panel").evaluate((panel) => {
        const panelRect = panel.getBoundingClientRect();
        return [...panel.querySelectorAll("img")].every((image) => {
          const rect = image.getBoundingClientRect();
          return rect.left >= panelRect.left - 1 &&
            rect.right <= panelRect.right + 1 &&
            rect.top >= panelRect.top - 1 &&
            rect.bottom <= panelRect.bottom + 1;
        });
      })).toBe(true);

      if (activityId === "existence") {
        expect(await page.locator(".pair-image-wrap").evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      }
      if (activityId === "change") {
        expect(await page.locator(".pair-image-wrap").evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      }
    }
  }

  await page.setViewportSize({ width: 375, height: 667 });
  await page.getByRole("tab", { name: /변화 필름 맞추기/ }).click();
  await expect.poll(() => page.locator("#activity-card").evaluate((node) => node.getBoundingClientRect().top)).toBeGreaterThanOrEqual(58);
});

test("전체 기록 지우기는 확인 뒤 저장 상태와 화면을 함께 초기화한다", async ({ page }) => {
  await page.goto(PAGE_PATH, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "점심에도 일해요" }).click();
  await expect(page.locator("#overall-progress-text")).toHaveText("0 / 20");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "전체 기록 지우기" }).click();

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.activities.city.clues).toEqual({});
  expect(saved.currentActivity).toBe("city");
  await expect(page.locator(".clue-button.is-found")).toHaveCount(0);
});
