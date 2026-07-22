const { test, expect } = require("@playwright/test");

test("c15 grammar2 bubble sort game compares nuance in practice and grades quiz", async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept());
    await page.goto("/c15/grammar2-bubble-sort-game.html");

    await expect(page.locator("h1")).toContainText("말풍선을 알맞은 칸에 놓아 보세요.");
    await expect(page.locator("#progressText")).toHaveText("연습 1 / 3");
    await expect(page.locator("#scoreText")).toHaveText("비교 연습");
    await expect(page.locator("#practiceGuide")).toBeVisible();
    await expect(page.locator(".practice-guide__card")).toHaveCount(4);
    await expect(page.locator("#mobileStepNav")).toBeHidden();
    await expect(page.locator("#explainStage")).toBeVisible();
    await expect(page.locator("#actionStage")).toBeVisible();
    await expect(page.locator(".move-guide")).toContainText("움직이는 방법");
    await expect(page.locator("#moveGuideMode")).toContainText("여러 칸에 다시 놓으며");
    await expect(page.locator(".drop-direction")).toContainText("아래 칸으로 옮기세요");

    await expect.poll(async () => {
        return page.locator('.zone[data-form="geolyo"] .zone__drop').evaluate((element) => {
            return window.getComputedStyle(element, "::before").content;
        });
    }).toContain("여기에 놓기");

    await page.locator('.zone[data-form="geolyo"]').click();
    await expect(page.locator("#feedbackBox")).toContainText("지금 놓은 말의 느낌");
    await expect(page.locator("#feedbackBox")).toContainText("계좌이체로 내도 될걸요.");
    await expect(page.locator("#optionReview")).toContainText("계좌이체로 내도 될 거예요.");
    await expect(page.locator("#optionReview")).not.toContainText("최적 정답");
    await expect(page.locator('.practice-guide__card.is-active[data-form="geolyo"]')).toBeVisible();

    await page.locator('.zone[data-form="tendeyo"]').click();
    await expect(page.locator("#feedbackBox")).toContainText("계좌이체로 내도 될 텐데요.");
    await expect(page.locator("#feedbackBox")).toContainText("다른 칸에 다시 놓아도 됩니다.");
    await expect(page.locator('.practice-guide__card.is-active[data-form="tendeyo"]')).toBeVisible();
    await expect(page.locator("#nextBtn")).toHaveText("다음 예문");
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geotgathayo"]').click();
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geoyeyo"]').click();
    await expect(page.locator("#nextBtn")).toHaveText("문제 시작");
    await page.locator("#nextBtn").click();

    await expect(page.locator("#progressText")).toHaveText("문제 1 / 6");
    await expect(page.locator("#scoreText")).toHaveText("최적 0 · 부분 0 · 오답 0");
    await expect(page.locator("#practiceGuide")).toBeHidden();
    await expect(page.locator("#moveGuideMode")).toContainText("한 칸을 고르면 바로 판정");

    await page.locator('.zone[data-form="geoyeyo"]').click();
    await expect(page.locator("#feedbackBox")).toContainText("부분 정답");
    await expect(page.locator("#optionReview")).toContainText("최적 정답");
    await expect(page.locator('#optionReview [data-form="geolyo"]')).toContainText("최적 정답");
    await expect(page.locator('#optionReview [data-form="geoyeyo"]')).toContainText("부분 정답");
    await expect(page.locator('#optionReview [data-form="tendeyo"]')).toContainText("오답");
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geoyeyo"]').click();
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geotgathayo"]').click();
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geoyeyo"]').click();
    await expect(page.locator("#feedbackBox")).toContainText("오답");
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geolyo"]').click();
    await page.locator("#nextBtn").click();

    await page.locator('.zone[data-form="geolyo"]').click();
    await page.locator("#nextBtn").click();

    await expect(page.locator("#resultScreen")).toContainText("최적 정답");
    await expect(page.locator("#resultScreen")).toContainText("부분 정답");
    await expect(page.locator("#resultScreen")).toContainText("오답");
    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator("#resultScreen")).toContainText("Complete");
    await expect(page.locator("#resultScreen")).toContainText("Best answer");

    await page.locator('[data-multilang-btn="none"]').click();
    await page.locator("#restartBtn").click();
    await expect(page.locator("#progressText")).toHaveText("연습 1 / 3");
    await expect(page.locator("#scoreText")).toHaveText("비교 연습");
    await expect(page.locator("#practiceGuide")).toBeVisible();
});

test("c15 grammar2 bubble sort game splits explanation and action on smartphone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c15/grammar2-bubble-sort-game.html");

    await expect(page.locator("#progressText")).toHaveText("연습 1 / 3");
    await expect(page.locator("#mobileStepNav")).toBeVisible();
    await expect(page.locator("#mobileExplainBtn")).toHaveClass(/is-active/);
    await expect(page.locator("#mobileActBtn")).not.toHaveClass(/is-active/);
    await expect(page.locator("#explainStage")).toBeVisible();
    await expect(page.locator("#actionStage")).toBeHidden();
    await expect(page.locator("#practiceGuide")).toBeVisible();
    await expect(page.locator("#mobileContinueBtn")).toBeVisible();
    await expect(page.locator("#mobileContinueBtn")).toHaveText("이제 느낌 비교하기");

    const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBeFalsy();

    await page.locator("#mobileContinueBtn").click();
    await expect(page.locator("#mobileExplainBtn")).not.toHaveClass(/is-active/);
    await expect(page.locator("#mobileActBtn")).toHaveClass(/is-active/);
    await expect(page.locator("#explainStage")).toBeHidden();
    await expect(page.locator("#actionStage")).toBeVisible();
    await expect(page.locator("#mobileActionSummary")).toBeVisible();
    await expect(page.locator("#mobileActionSummary")).toContainText("수행 화면 요약");
    await expect(page.locator("#bubbleCard")).toBeVisible();
    await expect(page.locator(".zone")).toHaveCount(4);

    const bubbleBox = await page.locator("#bubbleCard").boundingBox();
    expect(bubbleBox).not.toBeNull();
    expect(bubbleBox.width).toBeLessThanOrEqual(370);

    await page.locator('.zone[data-form="geolyo"]').click();
    await expect(page.locator("#nextBtn")).toBeVisible();
    await expect(page.locator("#feedbackBox")).toContainText("지금 놓은 말의 느낌");

    await page.locator("#mobileExplainBtn").click();
    await expect(page.locator("#explainStage")).toBeVisible();
    await expect(page.locator("#actionStage")).toBeHidden();

    await page.locator("#mobileActBtn").click();
    await expect(page.locator("#actionStage")).toBeVisible();
    await page.locator("#nextBtn").click();

    await expect(page.locator("#progressText")).toHaveText("연습 2 / 3");
    await expect(page.locator("#mobileExplainBtn")).toHaveClass(/is-active/);
    await expect(page.locator("#mobileActBtn")).not.toHaveClass(/is-active/);
    await expect(page.locator("#explainStage")).toBeVisible();
    await expect(page.locator("#actionStage")).toBeHidden();

    await page.locator("#mobileContinueBtn").click();
    await expect(page.locator("#actionStage")).toBeVisible();
    await page.locator('.zone[data-form="geotgathayo"]').click();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("#nextBtn")).toBeInViewport();

    const nextBox = await page.locator("#nextBtn").boundingBox();
    expect(nextBox).not.toBeNull();
    expect(nextBox.height).toBeGreaterThanOrEqual(56);
});

test("c15 grammar2 bubble sort game replaces legacy Vietnamese output with shared multilingual help", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.addInitScript(() => {
        localStorage.removeItem("preferred-lang");
        localStorage.removeItem("korean3bimprove:c15:grammar2-bubble-sort-game:v1");
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/c15/grammar2-bubble-sort-game.html");

    await expect(page.locator("[data-multilang-btn]")).toHaveCount(7);
    await expect(page.locator("#sceneViText")).toHaveCount(0);
    await expect(page.locator(".option-card__vi, .feedback__vi, .review-card__vi")).toHaveCount(0);
    await expect(page.locator("#sceneTranslationText")).toBeHidden();

    await page.locator('[data-multilang-btn="en"]').click();
    await expect(page.locator("body")).toHaveAttribute("data-active-lang", "en");
    await expect(page.locator(".i18n-inline").first()).toContainText("Chapter 15");
    await expect(page.locator("#sceneTranslationText")).toContainText("same sentence stem");
    await page.locator("#mobileContinueBtn").click();
    await page.locator('.zone[data-form="geolyo"]').click();
    await expect(page.locator(".feedback__translation").first()).toContainText("soft");

    await page.locator('[data-multilang-btn="vi"]').click();
    await expect(page.locator("body")).toHaveAttribute("data-active-lang", "vi");
    await expect(page.locator(".feedback__translation").first()).toContainText("Câu này");
    await expect(page.locator(".feedback__translation").first()).not.toContainText("This sounds");

    await page.locator('[data-multilang-btn="ar"]').click();
    await expect(page.locator("body")).toHaveAttribute("data-active-lang", "ar");
    await expect(page.locator(".feedback__translation").first()).toHaveAttribute("dir", "rtl");

    for (const code of ["mn", "kk", "th"]) {
        await page.locator(`[data-multilang-btn="${code}"]`).click();
        await expect(page.locator("body")).toHaveAttribute("data-active-lang", code);
        await expect(page.locator(".feedback__translation").first()).toHaveAttribute("lang", code);
    }

    await page.locator('[data-multilang-btn="none"]').click();
    await expect(page.locator("body")).toHaveAttribute("data-active-lang", "none");
    await expect(page.locator("#sceneTranslationText")).toBeHidden();
    await expect(page.locator(".feedback__translation")).toHaveCount(0);

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(hasOverflow).toBe(false);
    expect(pageErrors).toEqual([]);
});

test("c15 grammar2 bubble sort game restores a selected practice response after reload", async ({ page }) => {
    await page.goto("/c15/grammar2-bubble-sort-game.html");
    await page.evaluate(() => {
        localStorage.removeItem("preferred-lang");
        localStorage.removeItem("korean3bimprove:c15:grammar2-bubble-sort-game:v1");
    });
    await page.reload();

    await page.locator('.zone[data-form="geolyo"]').click();
    await expect(page.locator("#feedbackBox")).toContainText("지금 놓은 말의 느낌");
    await page.reload();

    await expect(page.locator("#progressText")).toHaveText("연습 1 / 3");
    await expect(page.locator("#feedbackBox")).toContainText("지금 놓은 말의 느낌");
    await expect(page.locator('.zone[data-form="geolyo"] .zone__drop .bubble')).toBeVisible();
});

test("c15 grammar2 bubble sort game stays reachable at narrow and enlarged layouts", async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.removeItem("preferred-lang");
        localStorage.removeItem("korean3bimprove:c15:grammar2-bubble-sort-game:v1");
    });

    for (const viewport of [{ width: 320, height: 844 }, { width: 1440, height: 900 }]) {
        await page.setViewportSize(viewport);
        await page.goto("/c15/grammar2-bubble-sort-game.html");
        if (viewport.width === 1440) {
            await page.evaluate(() => {
                document.documentElement.style.zoom = "2";
            });
        } else {
            await page.locator("#mobileContinueBtn").click();
        }

        const layout = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
            headingVisible: Boolean(document.querySelector("h1")?.getBoundingClientRect().width),
            firstZoneReachable: Boolean(document.querySelector(".zone")?.getBoundingClientRect().width)
        }));
        expect(layout.overflow).toBe(false);
        expect(layout.headingVisible).toBe(true);
        expect(layout.firstZoneReachable).toBe(true);
    }
});
