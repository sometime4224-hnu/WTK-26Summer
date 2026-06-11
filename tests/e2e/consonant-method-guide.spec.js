const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

function appFileUrl() {
  return pathToFileURL(path.resolve(__dirname, "../../apps/consonant-method-guide/index.html")).href;
}

test.describe("consonant method visual guide", () => {
  test("loads 14 basic consonants with visual cue assets only", async ({ page }) => {
    await page.goto("/apps/consonant-method-guide/index.html");

    await expect(page.locator(".brand-lockup")).toContainText("기본 자음 소리 지도");
    await expect(page.locator(".letter-button")).toHaveCount(14);
    await expect(page.locator(".visual-board img")).toHaveCount(4);
    await expect(page.locator(".channel-grid img")).toHaveCount(4);
    await expect(page.locator(".cue-strip img")).toHaveCount(4);
    await expect(page.locator("audio, video, canvas")).toHaveCount(0);

    const mediaText = await page.evaluate(() => document.body.textContent);
    expect(mediaText).not.toContain("녹음");
    expect(mediaText).not.toContain("마이크");
    expect(mediaText).not.toContain("음성인식");

    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".focus-panel img")).every(
        (image) => image.complete && image.naturalWidth > 0
      )
    );
  });

  test("switches consonants and filters by articulation place", async ({ page }) => {
    await page.goto("/apps/consonant-method-guide/index.html");

    await page.locator('.letter-button[data-id="onset-pieup"]').click();
    await expect(page.locator("#focusLetter")).toHaveText("ㅍ");
    await expect(page.locator("#energyValue")).toHaveText("거센소리");

    await page.locator('.mode-button[data-filter="lip"]').click();
    await expect(page.locator(".mode-button.is-active")).toHaveText("입술");
    await expect(page.locator(".letter-button:not(.is-hidden)")).toHaveCount(3);
    await expect(page.locator("#placeValue")).toHaveText("입술");

    await page.locator("#familyGrid").getByRole("button", { name: "ㅎ" }).click();
    await expect(page.locator("#focusLetter")).toHaveText("ㅎ");
    await expect(page.locator("#placeValue")).toHaveText("목");
  });

  test("separates front consonant contrasts, tense consonants, and coda mode", async ({ page }) => {
    await page.goto("/apps/consonant-method-guide/index.html");

    await page.locator('.letter-button[data-id="onset-digeut"]').click();
    await expect(page.locator("#contrastValue")).toContainText("ㄴ");

    await page.locator('.letter-button[data-id="onset-rieul"]').click();
    await expect(page.locator("#contrastValue")).toContainText("ㄷ");

    await page.locator('.view-button[data-mode="tense"]').click();
    await expect(page.locator(".view-button.is-active")).toHaveText("된소리");
    await expect(page.locator(".letter-button")).toHaveCount(5);
    await page.locator('.letter-button[data-id="tense-ssangbieup"]').click();
    await expect(page.locator("#focusLetter")).toHaveText("ㅃ");
    await expect(page.locator("#energyValue")).toHaveText("된소리");
    await expect(page.locator("#contrastValue")).toContainText("큰 숨");

    await page.locator('.view-button[data-mode="coda"]').click();
    await expect(page.locator(".view-button.is-active")).toHaveText("받침");
    await expect(page.locator(".letter-button")).toHaveCount(7);
    await page.locator('.letter-button[data-id="coda-ieung"]').click();
    await expect(page.locator("#focusLetter")).toHaveText("ㅇ");
    await expect(page.locator("#contrastValue")).toContainText("초성 ㅇ");
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/consonant-method-guide/index.html");

    await expect(page.locator(".visual-board")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("loads visual assets when opened directly from the file system", async ({ page }) => {
    await page.goto(appFileUrl());

    await expect(page.locator(".visual-board img")).toHaveCount(4);
    await expect(page.locator(".channel-grid img")).toHaveCount(4);
    await expect(page.locator(".cue-strip img")).toHaveCount(4);
    await expect(page.getByText("에셋 로드 실패")).toHaveCount(0);
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll(".focus-panel img")).every(
        (image) => image.complete && image.naturalWidth > 0
      )
    );
  });

  test("uses normalized image assets throughout every consonant mode", async ({ page }) => {
    await page.goto("/apps/consonant-method-guide/index.html");

    const tallAssets = [];
    for (const mode of ["onset", "tense", "coda"]) {
      await page.locator(`.view-button[data-mode="${mode}"]`).click();
      const ids = await page.locator(".letter-button").evaluateAll((buttons) =>
        buttons.map((button) => button.dataset.id)
      );

      for (const id of ids) {
        await page.locator(`.letter-button[data-id="${id}"]`).click();
        await page.waitForFunction(() =>
          Array.from(document.querySelectorAll(".focus-panel img")).every(
            (image) => image.complete && image.naturalWidth > 0
          )
        );
        const tooTall = await page.evaluate(() =>
          Array.from(document.querySelectorAll(".focus-panel img"))
            .filter((image) => image.naturalHeight / image.naturalWidth > 1.22)
            .map((image) => image.alt)
        );
        tallAssets.push(...tooTall.map((alt) => `${mode}:${id}:${alt}`));
      }
    }

    expect(tallAssets).toEqual([]);
  });

  test("opens a clicked pronunciation image in a centered viewer", async ({ page }) => {
    await page.goto("/apps/consonant-method-guide/index.html");

    await page.locator(".visual-board .cue-image-button").first().click();
    await expect(page.locator("#imageLightbox")).toBeVisible();
    await expect(page.locator("#lightboxImage")).toBeVisible();
    await expect(page.locator("#lightboxCaption")).toContainText("ㄱ");

    const panelBox = await page.locator(".lightbox-panel").boundingBox();
    const viewport = page.viewportSize();
    expect(panelBox.x + panelBox.width / 2).toBeGreaterThan(viewport.width * 0.35);
    expect(panelBox.x + panelBox.width / 2).toBeLessThan(viewport.width * 0.65);

    await page.keyboard.press("Escape");
    await expect(page.locator("#imageLightbox")).toBeHidden();
  });
});
