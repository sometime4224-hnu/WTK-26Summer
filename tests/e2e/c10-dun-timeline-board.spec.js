const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
    await page.route("https://unpkg.com/**", (route) => route.abort());
    await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
    await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

async function drawLine(page, modeName, yRatio = 0.58) {
    await page.getByRole("button", { name: modeName }).click();
    const board = page.locator("#timelineBoard");
    const box = await board.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * yRatio);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * yRatio, { steps: 8 });
    await page.mouse.up();
}

test("c10 hub links to the -던 timeline placement board", async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto("/c10/index.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator('a[href="grammar1-dun-timeline-board.html"]')).toContainText("시간축 배치");
});

test("c10 -던 timeline board places vocab cards, emojis, and line types", async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto("/c10/grammar1-dun-timeline-board.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1")).toContainText("-던 시간축 배치판");
    await expect(page.locator(".library-item")).toHaveCount(25);
    await expect.poll(async () => {
        return page.locator(".library-item", { hasText: "고백하다" }).locator("img").evaluate((img) => img.naturalWidth);
    }).toBeGreaterThan(0);

    await page.getByRole("button", { name: "현재", exact: true }).click();
    await page.locator(".library-item", { hasText: "고백하다" }).click();
    await expect(page.locator(".board-item", { hasText: "고백하다" })).toBeVisible();
    await expect(page.locator("#itemCount")).toContainText("1개");

    await page.getByRole("tab", { name: "감정 이모지" }).click();
    await page.locator(".library-item", { hasText: "기쁨" }).click();
    await expect(page.locator(".board-item", { hasText: "기쁨" })).toBeVisible();
    await expect(page.locator("#itemCount")).toContainText("2개");

    await drawLine(page, "현재 진행");
    await drawLine(page, "미래 진행", 0.62);
    await drawLine(page, "완료선", 0.66);

    await expect(page.locator("#lineGroup .line-current")).toHaveCount(1);
    await expect(page.locator("#lineGroup .line-future")).toHaveCount(1);
    await expect(page.locator("#lineGroup .line-complete")).toHaveCount(1);
    await expect(page.locator("#lineGroup .line-cap")).toHaveCount(2);
    await expect(page.locator("#lineCount")).toContainText("3선");
});

test("c10 -던 timeline board lets placed cards and lines be dragged freely", async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto("/c10/grammar1-dun-timeline-board.html", { waitUntil: "domcontentloaded" });

    await page.locator(".library-item", { hasText: "고백하다" }).click();
    await page.getByRole("button", { name: "현재 진행" }).click();

    const itemBefore = await page.evaluate(() => ({ ...window.C10_DUN_TIMELINE_APP.state.items[0] }));
    const itemBox = await page.locator(".board-item", { hasText: "고백하다" }).boundingBox();
    expect(itemBox).not.toBeNull();
    await page.mouse.move(itemBox.x + itemBox.width / 2, itemBox.y + itemBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(itemBox.x + itemBox.width / 2 + 140, itemBox.y + itemBox.height / 2 + 48, { steps: 8 });
    await page.mouse.up();

    const itemAfter = await page.evaluate(() => ({
        item: { ...window.C10_DUN_TIMELINE_APP.state.items[0] },
        lineCount: window.C10_DUN_TIMELINE_APP.state.lines.length
    }));
    expect(itemAfter.item.x).toBeGreaterThan(itemBefore.x + 5);
    expect(itemAfter.item.y).toBeGreaterThan(itemBefore.y + 2);
    expect(itemAfter.lineCount).toBe(0);

    await drawLine(page, "현재 진행");
    await page.getByRole("button", { name: "이동", exact: true }).click();

    const lineBefore = await page.evaluate(() => JSON.parse(JSON.stringify(window.C10_DUN_TIMELINE_APP.state.lines[0])));
    const boardBox = await page.locator("#timelineBoard").boundingBox();
    expect(boardBox).not.toBeNull();
    const midX = boardBox.x + boardBox.width * ((lineBefore.start.x + lineBefore.end.x) / 200);
    const midY = boardBox.y + boardBox.height * ((lineBefore.start.y + lineBefore.end.y) / 200);
    await page.mouse.move(midX, midY);
    await page.mouse.down();
    await page.mouse.move(midX + 100, midY + 32, { steps: 8 });
    await page.mouse.up();

    const lineMoved = await page.evaluate(() => JSON.parse(JSON.stringify(window.C10_DUN_TIMELINE_APP.state.lines[0])));
    expect(lineMoved.start.x).toBeGreaterThan(lineBefore.start.x + 2);
    expect(lineMoved.end.x).toBeGreaterThan(lineBefore.end.x + 2);
    await expect(page.locator(".line-handle[data-handle='start']")).toBeVisible();
    await expect(page.locator(".line-handle[data-handle='body']")).toBeVisible();
    await expect(page.locator(".line-handle[data-handle='end']")).toBeVisible();

    const endHandle = await page.locator(".line-handle[data-handle='end']").boundingBox();
    expect(endHandle).not.toBeNull();
    await page.mouse.move(endHandle.x + endHandle.width / 2, endHandle.y + endHandle.height / 2);
    await page.mouse.down();
    await page.mouse.move(endHandle.x + endHandle.width / 2 - 90, endHandle.y + endHandle.height / 2 - 38, { steps: 8 });
    await page.mouse.up();

    const lineResized = await page.evaluate(() => JSON.parse(JSON.stringify(window.C10_DUN_TIMELINE_APP.state.lines[0])));
    expect(lineResized.end.x).toBeLessThan(lineMoved.end.x - 2);
    expect(lineResized.start.x).toBeCloseTo(lineMoved.start.x, 1);
});

test("c10 -던 timeline board keeps controls usable on phone width", async ({ page }) => {
    await blockExternalRequests(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c10/grammar1-dun-timeline-board.html", { waitUntil: "domcontentloaded" });

    await expect(page.locator("#timelineBoard")).toBeVisible();
    await expect(page.locator(".library-item")).toHaveCount(25);

    const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        boardHeight: document.querySelector("#timelineBoard").getBoundingClientRect().height,
        modeButtons: Array.from(document.querySelectorAll(".mode-btn")).every((button) => {
            const box = button.getBoundingClientRect();
            return box.left >= 0 && box.right <= window.innerWidth;
        })
    }));

    expect(layout.overflow).toBeFalsy();
    expect(layout.boardHeight).toBeGreaterThanOrEqual(560);
    expect(layout.modeButtons).toBeTruthy();
});
