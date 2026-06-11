const { test, expect } = require("@playwright/test");

test.describe("articulation cue lab", () => {
  test("renders the visual ㄱ ㅋ ㄲ prototype and switches cues", async ({ page }) => {
    await page.goto("/apps/articulation-cue-lab/index.html");

    await expect(page.locator(".brand-mark")).toContainText("ㄱㅋㄲ");
    await expect(page.locator("#visualStage")).toBeVisible();
    await expect(page.locator("#primaryCueImage")).toBeVisible();
    await expect(page.locator(".sound-button")).toHaveCount(3);
    await expect(page.locator(".step-button")).toHaveCount(4);

    await page.locator('.sound-button[data-sound="aspirated"]').click();
    await expect(page.locator("body")).toHaveAttribute("data-sound", "aspirated");
    await expect(page.locator("#currentSyllable")).toHaveText("카");
    await page.locator('.step-button[data-step="1"]').click();
    await expect(page.locator("#primaryCueImage")).toHaveAttribute("src", /air-burst-outside/);

    await page.locator("#compareButton").click();
    await expect(page.locator("#compareButton")).toHaveAttribute("aria-pressed", "true");

    const imageState = await page.locator("#compareView img").evaluateAll((images) => {
      return images.map((image) => ({
        loaded: image.complete && image.naturalWidth > 0,
        src: image.getAttribute("src"),
      }));
    });
    expect(imageState).toHaveLength(3);
    expect(imageState.every((image) => image.loaded)).toBe(true);
    await expect(page.locator('.compare-scene[data-sound="aspirated"]')).toHaveClass(/is-active/);
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/articulation-cue-lab/index.html");

    await expect(page.locator("#visualStage")).toBeVisible();
    await expect(page.locator("#primaryCueImage")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
