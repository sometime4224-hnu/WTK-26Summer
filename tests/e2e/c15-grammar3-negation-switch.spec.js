const { test, expect } = require("@playwright/test");

const pagePath = "/c15/grammar3-negation-switch.html";
const storageKey = "korean3b-c15-grammar3-negation-switch-v1";

async function openFresh(page) {
  await page.goto(pagePath, { waitUntil: "domcontentloaded" });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "domcontentloaded" });
}

test("c15 grammar3 negation switch changes whole sentence and illustration by polarity", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);

  await expect(page.locator("h1")).toContainText("부정을 뒤집어 봐");
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻어요.");
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("기본 뜻");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-base\.webp$/);
  await expect.poll(async () => page.getByTestId("negation-switch-image").evaluate((image) => image.complete && image.naturalWidth === 568)).toBe(true);

  const firstAction = page.getByTestId("add-negation");
  await expect(firstAction).toBeVisible();
  expect(await firstAction.boundingBox()).toBeTruthy();

  await firstAction.click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않아요.");
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("부정 뜻");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-negative\.webp$/);

  await firstAction.click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않지 않아요.");
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("기본 뜻");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-base\.webp$/);

  await page.getByRole("button", { name: "처음 문장으로" }).click();
  await page.getByTestId("add-condition").click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻으면 안 돼요.");
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("금지");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-prohibited\.webp$/);
  await expect(firstAction).toBeDisabled();

  await page.getByTestId("undo-step").click();
  await firstAction.click();
  await page.getByTestId("add-condition").click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않으면 안 돼요.");
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("안 하는 것은 금지");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-negative-prohibited\.webp$/);
  await page.getByTestId("show-required-image").click();
  await expect(page.getByTestId("negation-switch-visual-label")).toHaveText("꼭 해야 함");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wash-hands-required\.webp$/);

  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBeFalsy();
});

test("c15 grammar3 negation switch keeps an experiment for each scene and restores it", async ({ page }) => {
  await openFresh(page);
  await page.getByTestId("add-negation").click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않아요.");

  await page.getByRole("button", { name: "마스크를 써요. 장면" }).click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("마스크를 써요.");
  await page.getByTestId("add-negation").click();
  await page.getByTestId("add-condition").click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("마스크를 쓰지 않으면 안 돼요.");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wear-mask-negative-prohibited\.webp$/);
  await page.getByTestId("show-required-image").click();
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wear-mask-required\.webp$/);

  await page.getByRole("button", { name: "손을 씻어요. 장면" }).click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않아요.");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("손을 씻지 않아요.");

  await page.getByRole("button", { name: "마스크를 써요. 장면" }).click();
  await expect(page.getByTestId("negation-switch-sentence")).toHaveText("마스크를 쓰지 않으면 안 돼요.");
  await expect(page.getByTestId("negation-switch-image")).toHaveAttribute("src", /wear-mask-required\.webp$/);
});

test("c15 grammar3 negation switch does not overwrite unreadable saved state until confirmed reset", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "{broken"), storageKey);
  await page.goto(pagePath, { waitUntil: "domcontentloaded" });

  await expect(page.locator("#storageNote")).toContainText("읽을 수 없어요");
  await page.getByTestId("add-negation").click();
  await expect.poll(async () => page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe("{broken");

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "저장한 실험 모두 지우기" }).click();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).version, storageKey)).toBe(1);
});

test("c15 grammar3 negation switch shows recovery when saving is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = function () { throw new Error("storage disabled"); };
  });
  await page.goto(pagePath, { waitUntil: "domcontentloaded" });

  await page.getByTestId("add-negation").click();
  await expect(page.locator("#storageNote")).toContainText("저장할 수 없어요");
  await expect(page.getByRole("button", { name: "현재 문장 복사하기" })).toBeVisible();
});

test("c15 grammar3 links expose the new picture-switch activity", async ({ page }) => {
  await page.goto("/c15/grammar3.html", { waitUntil: "domcontentloaded" });
  const mainLink = page.locator('a[href="grammar3-negation-switch.html"]');
  await expect(mainLink).toContainText("그림 스위치 열기");

  await page.goto("/c15/index.html", { waitUntil: "domcontentloaded" });
  const grammarCard = page.locator(".path-card").filter({ hasText: "A/V-지 않으면 안 되다" });
  await expect(grammarCard.locator('a[href="grammar3-negation-switch.html"]')).toContainText("부정을 뒤집어 봐");
});

test("c15 grammar3 negation switch remains reachable at narrow and zoomed layouts", async ({ browser }) => {
  for (const viewport of [{ width: 320, height: 844 }, { width: 390, height: 844 }]) {
    const layoutContext = await browser.newContext({ viewport: viewport });
    const layoutPage = await layoutContext.newPage();
    await layoutPage.goto(pagePath, { waitUntil: "domcontentloaded" });
    await expect(layoutPage.getByTestId("add-negation")).toBeVisible();
    await layoutPage.getByTestId("add-negation").click();
    await layoutPage.getByTestId("add-condition").click();
    await expect(layoutPage.getByTestId("show-required-image")).toBeVisible();
    expect(await layoutPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBeFalsy();
    await layoutContext.close();
  }

  const zoomContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const zoomPage = await zoomContext.newPage();
  await zoomPage.goto(pagePath, { waitUntil: "domcontentloaded" });
  await zoomPage.evaluate(() => { document.body.style.zoom = "2"; });
  await expect(zoomPage.getByTestId("add-negation")).toBeVisible();
  await zoomPage.getByTestId("add-negation").click();
  await zoomPage.getByTestId("add-condition").click();
  await expect(zoomPage.getByTestId("show-required-image")).toBeVisible();
  expect(await zoomPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBeFalsy();
  await zoomContext.close();
});
