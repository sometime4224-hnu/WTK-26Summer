const { test, expect } = require("@playwright/test");

const pages = [
    ["/c14/listening1.html", "listening1-illustration-1600w.webp"],
    ["/c14/listening2.html", "listening2-illustration-1600w.webp"]
];

for (const [pagePath, imageName] of pages) {
    test(`c14 listening page defers audio and uses optimized image for ${pagePath}`, async ({ page }) => {
        await page.goto(pagePath);

        await expect(page.locator("audio")).toHaveAttribute("preload", "none");
        await expect(page.locator(`img[src$="${imageName}"]`)).toHaveCount(1);

        const hasOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(hasOverflow).toBeFalsy();
    });
}

