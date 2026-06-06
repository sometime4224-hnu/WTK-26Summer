const { test, expect } = require("@playwright/test");

test("c14 reading page loads webp story images on smartphone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c14/reading.html");

    await expect(page.locator("h1")).toContainText("도낏자루 썩는 줄 모른다");
    const images = page.locator('img[src$=".webp"]');
    await expect(images).toHaveCount(7);

    const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBeFalsy();

    for (let index = 0; index < 7; index += 1) {
        await images.nth(index).evaluate((img) => img.scrollIntoView({ block: "center" }));
        await page.waitForFunction((imageIndex) => {
            const img = document.querySelectorAll('img[src$=".webp"]')[imageIndex];
            return Boolean(img && img.complete && img.naturalWidth > 0 && img.currentSrc.endsWith(".webp"));
        }, index);
    }

    const imageState = await images.evaluateAll((images) => {
        return images.map((img) => ({
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            currentSrc: img.currentSrc
        }));
    });

    for (const item of imageState) {
        expect(item.complete).toBeTruthy();
        expect(item.naturalWidth).toBeGreaterThan(0);
        expect(item.currentSrc.endsWith(".webp")).toBeTruthy();
    }
});
