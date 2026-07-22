const { test, expect } = require("@playwright/test");

const STORAGE_KEY = "korean3b:c15:passive-sentence-transform:v1";

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function advanceToPhase(page, phase) {
  await page.locator("#stageNextBtn").click();
  await expect(page.locator("#sentenceBoard")).toHaveAttribute("data-phase", String(phase));
}

async function finishActiveScenario(page) {
  await advanceToPhase(page, 1);
  await advanceToPhase(page, 2);
  await advanceToPhase(page, 3);
}

function relativeLuminance([red, green, blue]) {
  const channels = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

async function expectPrimaryGradientAA(button) {
  const style = await button.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { color: computed.color, backgroundImage: computed.backgroundImage };
  });
  expect(style.color).toBe("rgb(255, 255, 255)");
  const stops = [...style.backgroundImage.matchAll(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g)]
    .map((match) => match.slice(1).map(Number));
  expect(stops.length).toBeGreaterThanOrEqual(2);
  for (const stop of stops) {
    expect(contrastRatio([255, 255, 255], stop)).toBeGreaterThanOrEqual(4.5);
  }
}

test("C15 hub opens the passive sentence transformation support page", async ({ page }) => {
  await page.goto("/c15/index.html", { waitUntil: "domcontentloaded" });

  const link = page.getByRole("link", { name: "피동 문장 변환 애니메이션" });
  await expect(link).toBeVisible();
  await link.click();

  await expect(page).toHaveURL(/c15\/passive-sentence-transform\.html$/);
  await expect(page.getByRole("heading", { name: "피동 문장 바꾸기" })).toBeVisible();
  await expect(page.locator("#startTransformBtn")).toHaveCount(0);
});

test("scenario tabs use roving focus and preserve focus after keyboard and pointer selection", async ({ page }) => {
  await page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });

  const catchTab = page.locator("#scenario-catch");
  const hugTab = page.locator("#scenario-hug");
  const openTab = page.locator("#scenario-open");
  const repairTab = page.locator("#scenario-repair");

  await expect(catchTab).toHaveAttribute("aria-selected", "true");
  await expect(catchTab).toHaveAttribute("tabindex", "0");
  await expect(page.locator("#scenarioTabs [tabindex='0']")).toHaveCount(1);
  await catchTab.focus();
  await catchTab.press("ArrowRight");
  await expect(hugTab).toHaveAttribute("aria-selected", "true");
  await expect(hugTab).toHaveAttribute("tabindex", "0");
  await expect(hugTab).toBeFocused();

  await hugTab.press("End");
  await expect(repairTab).toHaveAttribute("aria-selected", "true");
  await expect(repairTab).toBeFocused();
  await repairTab.press("Home");
  await expect(catchTab).toBeFocused();
  await catchTab.press("ArrowLeft");
  await expect(repairTab).toBeFocused();

  await openTab.click();
  await expect(openTab).toHaveAttribute("aria-selected", "true");
  await expect(openTab).toHaveAttribute("tabindex", "0");
  await expect(openTab).toBeFocused();
  await expect(page.locator("#sentenceBoard")).toHaveAttribute("role", "tabpanel");
  await expect(page.locator("#sentenceBoard")).toHaveAttribute("aria-labelledby", "scenario-open");
  await expect(page.locator("#scenarioTabs [tabindex='0']")).toHaveCount(1);
  await expectPrimaryGradientAA(page.locator("#stageNextBtn"));
});

test("passive sentence is built visibly from verb, active subject, then active object", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#transformPanel")).toBeVisible();
  await expect(page.locator("#scenarioTabs button")).toHaveCount(5);
  await expect(page.locator("#passiveSentence [data-passive-slot]")).toHaveCount(3);
  expect(await page.locator("#passiveSentence").textContent()).toBe("");
  await expect(page.locator("#buildPanel")).toHaveCount(0);
  await expect(page.locator("#activeSentence .term-noun")).toHaveCount(2);
  await expect(page.locator("#activeSentence .term-particle")).toHaveCount(2);
  await expect(page.locator("#sceneViewer")).not.toHaveAttribute("open", "");
  await page.locator("#sceneViewer summary").click();
  await expect(page.locator("#sceneViewer")).toHaveAttribute("open", "");
  await expect(page.locator("#activeSceneImage")).toHaveAttribute("src", /catch-pair\.webp$/);
  await expect(page.locator("#passiveSceneImage")).toHaveAttribute("src", /catch-pair\.webp$/);
  await expect(page.locator("#activeSceneCaption")).toHaveText("경찰이 도둑을 잡았어요.");
  await expect(page.locator("#passiveSceneCaption")).toHaveText("도둑이 경찰에게 잡혔어요.");
  await page.locator("#scenario-write").click();
  await expect(page.locator("#activeSceneImage")).toHaveAttribute("src", /write-pair\.webp$/);
  await expect(page.locator("#passiveSceneCaption")).toHaveText("책이 작가에 의해 쓰였어요.");
  await page.locator("#scenario-catch").click();
  await expectNoHorizontalOverflow(page);

  await page.locator("#stageNextBtn").click();
  await expect(page.locator("#animationLayer .moving-copy")).toBeVisible();
  await expect(page.locator("#sentenceBoard")).toHaveAttribute("data-phase", "1");
  await expect(page.locator("#passiveSentence [data-passive-slot='verb']")).toHaveText("잡혔어요.");
  expect(await page.locator("#passiveSentence [data-passive-slot='target']").textContent()).toBe("");
  expect(await page.locator("#passiveSentence [data-passive-slot='agent']").textContent()).toBe("");
  await expect(page.locator("#stepLabel")).toContainText("동사가 피동형");

  await advanceToPhase(page, 2);
  await expect(page.locator("#passiveSentence [data-passive-slot='agent']")).toHaveText("경찰에게");
  await expect(page.locator("#stepLabel")).toContainText("능동문 주어");

  await advanceToPhase(page, 3);
  await expect(page.locator("#passiveSentence [data-passive-slot='target']")).toHaveText("도둑이");
  await expect(page.locator("#passiveSentence")).toHaveText("도둑이경찰에게잡혔어요.");
  await expect(page.locator("#stepLabel")).toContainText("피동문이 완성");
  await expect(page.locator("#stageNextBtn")).toHaveText("다음 예문 보기");
  await expectNoHorizontalOverflow(page);
});

test("each completed animation moves straight to the next example, then reveals omissions", async ({ page }) => {
  await page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });

  for (let index = 0; index < 5; index += 1) {
    await finishActiveScenario(page);
    if (index < 4) {
      await page.locator("#stageNextBtn").click();
      await expect(page.locator("#sentenceBoard")).toHaveAttribute("data-phase", "0");
    }
  }

  await expect(page.locator("#progressSummary")).toContainText("5 / 5 완료");
  await expect(page.locator("#stageNextBtn")).toHaveText("행위자 생략 보기");
  await page.locator("#stageNextBtn").click();
  await expect(page.locator("#omissionPanel")).toBeVisible();
  const omissionButton = page.getByRole("button", { name: "방값에 전기 요금이 포함되어 있어요." });
  await omissionButton.click();
  await expect(omissionButton).toHaveAttribute("aria-pressed", "true");
  await expect(omissionButton).toBeFocused();
  await expect(page.locator("#omissionExplanation")).toContainText("회사가 전기 요금을 방값에 포함했어요");
  await expect(page.locator(".form-list")).toContainText("포함하다 → 포함되다");
});

test("v1 progress restarts at the new first step and v2 completion becomes the final animation state", async ({ browser }) => {
  const v1Context = await browser.newContext();
  const v1Page = await v1Context.newPage();
  await v1Page.addInitScript(({ key, payload }) => {
    localStorage.setItem(key, JSON.stringify(payload));
  }, {
    key: STORAGE_KEY,
    payload: {
      schemaVersion: 1,
      started: true,
      activeId: "catch",
      phase: 3,
      completed: { hug: true },
      selections: { hug: { subject: "동생이" } },
      activeOmissionId: null
    }
  });
  await v1Page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });
  await expect(v1Page.locator("#restoreNotice")).toContainText("새 순서에 맞춰");
  await expect(v1Page.locator("#sentenceBoard")).toHaveAttribute("data-phase", "0");
  await expect(v1Page.locator("#passiveSentence")).toHaveText("");
  await expect.poll(() => v1Page.evaluate((key) => JSON.parse(localStorage.getItem(key)).schemaVersion, STORAGE_KEY)).toBe(3);
  await expect(v1Page.locator("#scenario-hug")).toHaveClass(/is-complete/);
  await v1Context.close();

  const v2Context = await browser.newContext();
  const v2Page = await v2Context.newPage();
  await v2Page.addInitScript(({ key, payload }) => {
    localStorage.setItem(key, JSON.stringify(payload));
  }, {
    key: STORAGE_KEY,
    payload: { schemaVersion: 2, started: true, activeId: "catch", phase: 4, completed: {}, selections: {}, activeOmissionId: null }
  });
  await v2Page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });
  await expect(v2Page.locator("#sentenceBoard")).toHaveAttribute("data-phase", "3");
  await expect(v2Page.locator("#scenario-catch")).toHaveClass(/is-complete/);
  await expect.poll(() => v2Page.evaluate((key) => JSON.parse(localStorage.getItem(key)).schemaVersion, STORAGE_KEY)).toBe(3);
  await v2Context.close();
});

test("unreadable storage preserves current work and reduced motion switches immediately", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "not-json");
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("storage full");
      return originalSetItem.call(this, name, value);
    };
  }, STORAGE_KEY);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/c15/passive-sentence-transform.html", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#restoreNotice")).toContainText("읽을 수 없어 그대로 보관했습니다");
  await expect(page.locator("#saveStatus")).toContainText("이전 기록 보관");
  await expect(page.locator("#copyRecoveryBtn")).toBeVisible();
  await page.locator("#stageNextBtn").press("Enter");
  await expect(page.locator("#sentenceBoard")).toHaveAttribute("data-phase", "1");
  await expect(page.locator("#passiveSentence [data-passive-slot='verb']")).toHaveText("잡혔어요.");
  await page.locator("#sceneViewer summary").press("Enter");
  await expect(page.locator("#sceneViewer")).toHaveAttribute("open", "");
  await expect(page.locator("#activeSceneImage")).toHaveAttribute("src", /catch-pair\.webp$/);
  await expectNoHorizontalOverflow(page);
});
