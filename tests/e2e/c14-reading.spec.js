const { test, expect } = require("@playwright/test");

async function blockGoogleTagManager(page) {
    await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({
        status: 204,
        body: ""
    }));
}

async function expectNoDocumentOverflow(page) {
    const layout = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
}

test.beforeEach(async ({ page }) => {
    await blockGoogleTagManager(page);
});

test("c14 hub and companion pages expose the reading route family", async ({ page }) => {
    await page.goto("/c14/index.html", { waitUntil: "domcontentloaded" });

    const readingCard = page.locator('article.path-card[data-tone="reading"]').filter({
        hasText: "도낏자루 썩는 줄 모른다"
    });
    await expect(readingCard).toHaveCount(1);
    await expect(readingCard.locator('a[href="reading.html"]')).toHaveCount(1);
    await expect(readingCard.locator('a[href="mock-reading-exam.html"]')).toHaveCount(1);
    await expect(readingCard.locator('a[href="writing-cut.html"]')).toHaveCount(1);

    await page.goto("/c14/mock-reading-exam.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator('.topbar__links a[href="reading.html"]')).toHaveCount(1);
    await expect(page.locator('.topbar__links a[href="writing-cut.html"]')).toHaveCount(1);

    await page.goto("/c14/writing-cut.html", { waitUntil: "domcontentloaded" });
    await expect(page.locator('.global-nav a[href="./reading.html"]')).toHaveCount(1);
    await expect(page.locator('.global-nav a[href="./mock-reading-exam.html"]')).toHaveCount(1);
});

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

test("c14 reading page exposes route navigation and the four-step anchor flow", async ({ page }) => {
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    const topbar = page.locator(".topbar");
    await expect(topbar.locator(".topbar__nav")).toBeVisible();

    for (const href of ["index.html", "reading.html", "mock-reading-exam.html", "writing-cut.html"]) {
        await expect(topbar.locator(`a[href="${href}"]`)).toHaveCount(1);
    }

    const activityNav = page.locator(".activity-nav");
    await expect(activityNav).toBeVisible();

    for (const id of ["prep", "reading-passage", "vocabulary", "activities"]) {
        const target = page.locator(`#${id}`);
        const link = activityNav.locator(`a[href="#${id}"]`);

        await expect(target).toHaveCount(1);
        await expect(link).toHaveCount(1);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
    }
});

test("c14 reading multiple-choice questions keep their approved correct feedback paths", async ({ page }) => {
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    const correctAnswers = [
        { cardId: "question1", questionId: "q1", value: "na" },
        { cardId: "question2", questionId: "q2", value: "1" },
        { cardId: "question4", questionId: "q4", value: "3" }
    ];

    for (const { cardId, questionId, value } of correctAnswers) {
        const card = page.locator(`#${cardId}`);
        const group = card.locator(`[data-question="${questionId}"]`);
        const correctChoice = group.locator(`[data-value="${value}"]`);

        await correctChoice.click();
        await expect(correctChoice).toHaveClass(/choice-btn--correct/);
        await expect(card.locator(".feedback")).toHaveClass(/feedback--success/);
        await expect(card.locator(".feedback")).toContainText("정답");
    }
});

test("c14 reading sequence activity handles incomplete, correct, and reset states", async ({ page }) => {
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    const feedback = page.locator("#sequenceFeedback");
    await page.locator("#checkSequence").click();
    await expect(feedback).toContainText("모든 그림에 번호를 선택해 주세요.");
    await expect(feedback).toHaveClass(/sequence-feedback--info/);

    const sequenceAnswer = ["1", "2", "4", "5", "3"];
    for (let index = 0; index < sequenceAnswer.length; index += 1) {
        await page.locator(`#sequence${index + 1}`).selectOption(sequenceAnswer[index]);
    }

    await page.locator("#checkSequence").click();
    await expect(feedback).toContainText("정답입니다.");
    await expect(feedback).toHaveClass(/sequence-feedback--success/);

    await page.locator("#resetSequence").click();
    for (let index = 1; index <= sequenceAnswer.length; index += 1) {
        await expect(page.locator(`#sequence${index}`)).toHaveValue("");
    }
    await expect(feedback).toHaveText("");
    await expect(feedback).toHaveClass("sequence-feedback");
});

test("c14 reading writing prompts have accessible labels", async ({ page }) => {
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    const prepTextarea = page.locator("#prep textarea");
    const retellTextarea = page.locator("#activities .retell-box textarea");

    await expect(prepTextarea).toHaveCount(1);
    await expect(prepTextarea).toHaveAccessibleName(/.+/);
    await expect(retellTextarea).toHaveCount(1);
    await expect(retellTextarea).toHaveAccessibleName(/.+/);
});

test("c14 reading sequence stays usable in its own horizontal scroller at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    await expectNoDocumentOverflow(page);

    const sequenceGrid = page.locator(".sequence-grid");
    const metrics = await sequenceGrid.evaluate((grid) => ({
        clientWidth: grid.clientWidth,
        scrollWidth: grid.scrollWidth,
        overflowX: getComputedStyle(grid).overflowX
    }));

    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(["auto", "scroll"]).toContain(metrics.overflowX);

    const cards = sequenceGrid.locator(".sequence-card");
    await expect(cards).toHaveCount(5);

    for (let index = 0; index < 5; index += 1) {
        const card = cards.nth(index);
        const select = card.locator("select");
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();
        await expect(select).toBeVisible();
        await expect(select).toBeEnabled();

        const cardBox = await card.boundingBox();
        expect(cardBox).not.toBeNull();
        expect(cardBox.x).toBeGreaterThanOrEqual(-1);
        expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(391);
    }

    await expectNoDocumentOverflow(page);
});

test("c14 reading page has no document overflow at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    await expectNoDocumentOverflow(page);
});

test("c14 reading page reflows without document overflow at 720px", async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 900 });
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    await expectNoDocumentOverflow(page);
    await expect(page.locator(".topbar__nav")).toBeVisible();

    const columns = await page.evaluate(() => ({
        story: getComputedStyle(document.querySelector(".story-grid")).gridTemplateColumns,
        activities: getComputedStyle(document.querySelector(".activity-grid")).gridTemplateColumns
    }));

    expect(columns.story.trim().split(/\s+/)).toHaveLength(1);
    expect(columns.activities.trim().split(/\s+/)).toHaveLength(1);
});

test("c14 reading page respects reduced-motion preferences", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/c14/reading.html", { waitUntil: "domcontentloaded" });

    const motion = await page.evaluate(() => ({
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        transitionDuration: getComputedStyle(document.querySelector(".choice-btn")).transitionDuration
    }));

    expect(motion.scrollBehavior).toBe("auto");
    expect(Math.max(...motion.transitionDuration.split(",").map((value) => Number.parseFloat(value)))).toBeLessThanOrEqual(0.001);
});

test("c14 reading page reports no console or page errors", async ({ page }) => {
    const errors = [];
    page.on("console", (message) => {
        if (message.type() === "error") {
            errors.push(`console: ${message.text()}`);
        }
    });
    page.on("pageerror", (error) => {
        errors.push(`page: ${error.message}`);
    });

    await page.goto("/c14/reading.html", { waitUntil: "load" });
    await page.locator('[data-question="q1"] [data-value="na"]').click();
    await page.locator("#checkSequence").click();
    await page.evaluate(() => new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));

    expect(errors).toEqual([]);
});
