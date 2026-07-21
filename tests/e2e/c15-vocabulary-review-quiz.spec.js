const { test, expect } = require("@playwright/test");

const PAGE_URL = "/c15/vocabulary-review-quiz.html";
const STORAGE_KEY = "c15.vocabulary.reviewQuiz.v1";
const OFFICIAL_WORD_IDS = Array.from({ length: 25 }, (_, index) => (
    "c15-vocab-" + String(index + 1).padStart(2, "0")
));

function blankSelector(quizId, blankId) {
    return '[data-action="select-blank"][data-quiz-id="' + quizId + '"][data-blank-id="' + blankId + '"]';
}

function choiceSelector(quizId, choiceId) {
    return '[data-action="choose-word"][data-quiz-id="' + quizId + '"][data-choice-id="' + choiceId + '"]';
}

function checkSelector(quizId) {
    return '[data-action="check-quiz"][data-quiz-id="' + quizId + '"]';
}

async function clearProgress(page) {
    await page.addInitScript((key) => {
        const marker = "c15-vocabulary-review-quiz-e2e-cleared";
        if (sessionStorage.getItem(marker) === "yes") return;
        localStorage.removeItem(key);
        sessionStorage.setItem(marker, "yes");
    }, STORAGE_KEY);
}

async function specFor(page) {
    await page.waitForFunction(() => Boolean(window.__c15VocabularyReviewQuiz));
    return page.evaluate(() => window.__c15VocabularyReviewQuiz.getSpec());
}

async function snapshot(page) {
    return page.evaluate(() => window.__c15VocabularyReviewQuiz.snapshot());
}

function firstUnusedCorrectChoice(quiz, blank, usedChoiceIds) {
    return quiz.choices.find((choice) => (
        choice.wordId === blank.wordId && !usedChoiceIds.has(choice.id)
    ));
}

async function chooseAnswer(page, quizId, blankId, choiceId) {
    await page.locator(blankSelector(quizId, blankId)).click();
    await page.locator(choiceSelector(quizId, choiceId)).click();
}

async function finishQuizCorrectly(page, quiz) {
    const usedChoiceIds = new Set();
    for (const blank of quiz.blanks) {
        const blankButton = page.locator(blankSelector(quiz.id, blank.id));
        if (await blankButton.count()) {
            const correctChoice = firstUnusedCorrectChoice(quiz, blank, usedChoiceIds);
            expect(correctChoice).toBeDefined();
            usedChoiceIds.add(correctChoice.id);
            await chooseAnswer(page, quiz.id, blank.id, correctChoice.id);
        }
    }
    await page.locator(checkSelector(quiz.id)).click();
}

test("C15 review quiz covers every official vocabulary item with a double-sized word bank", async ({ page }) => {
    await clearProgress(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const spec = await specFor(page);

    expect(spec).toHaveLength(6);
    const answerIds = [];
    for (const quiz of spec) {
        expect(quiz.blanks.length).toBeGreaterThanOrEqual(3);
        expect(quiz.choices).toHaveLength(quiz.blanks.length * 2);
        expect(new Set(quiz.choices.map((choice) => choice.id)).size).toBe(quiz.choices.length);
        answerIds.push(...quiz.blanks.map((blank) => blank.wordId));
    }

    expect(answerIds).toHaveLength(27);
    expect(new Set(answerIds).size).toBe(25);
    expect(Array.from(new Set(answerIds)).sort()).toEqual(OFFICIAL_WORD_IDS);

    const utilityQuiz = spec.find((quiz) => quiz.id === "utility-schedule");
    const repeatedBlankIds = utilityQuiz.blanks
        .filter((blank) => blank.wordId === "c15-vocab-13")
        .map((blank) => blank.id);
    const repeatedChoices = utilityQuiz.choices.filter((choice) => choice.wordId === "c15-vocab-13");
    expect(repeatedBlankIds).toHaveLength(2);
    expect(repeatedChoices).toHaveLength(2);
    expect(new Set(repeatedChoices.map((choice) => choice.id)).size).toBe(2);
    await expect(page.locator("h1")).toHaveText("어휘 복습 퀴즈");
    await expect(page.locator(".quiz-card")).toHaveCount(6);
});

test("per-dialogue checking locks correct blanks and retries only incorrect blanks", async ({ page }) => {
    await clearProgress(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const firstQuiz = (await specFor(page))[0];
    const firstBlank = firstQuiz.blanks[0];
    const otherBlanks = firstQuiz.blanks.slice(1);
    const targetIds = new Set(firstQuiz.blanks.map((blank) => blank.wordId));
    const wrongChoice = firstQuiz.choices.find((choice) => !targetIds.has(choice.wordId));

    await chooseAnswer(page, firstQuiz.id, firstBlank.id, wrongChoice.id);
    const usedChoiceIds = new Set([wrongChoice.id]);
    for (const blank of otherBlanks) {
        const correctChoice = firstUnusedCorrectChoice(firstQuiz, blank, usedChoiceIds);
        expect(correctChoice).toBeDefined();
        usedChoiceIds.add(correctChoice.id);
        await chooseAnswer(page, firstQuiz.id, blank.id, correctChoice.id);
    }
    await page.locator(checkSelector(firstQuiz.id)).click();

    await expect(page.locator("#feedback-" + firstQuiz.id)).toHaveText("3개를 맞았어요. 틀린 빈칸만 다시 고르세요.");
    await expect(page.locator("#quiz-" + firstQuiz.id + " .blank.is-locked")).toHaveCount(3);
    await expect(page.locator(blankSelector(firstQuiz.id, firstBlank.id))).toBeVisible();

    const afterWrongCheck = await snapshot(page);
    expect(afterWrongCheck.state.entries[firstQuiz.id]).toMatchObject({
        locked: otherBlanks.map((blank) => blank.id),
        answers: Object.fromEntries(otherBlanks.map((blank) => [
            blank.id,
            firstQuiz.choices.find((choice) => choice.wordId === blank.wordId).id
        ])),
        completed: false,
        attempts: 1
    });

    const firstCorrectChoice = firstUnusedCorrectChoice(firstQuiz, firstBlank, usedChoiceIds);
    await chooseAnswer(page, firstQuiz.id, firstBlank.id, firstCorrectChoice.id);
    await page.locator(checkSelector(firstQuiz.id)).click();
    await expect(page.locator("#quiz-" + firstQuiz.id)).toHaveClass(/is-complete/);
    await expect(page.locator("#quiz-" + firstQuiz.id + " .blank.is-locked")).toHaveCount(4);
});

test("completion, reload restoration, and page-scoped reset work", async ({ page }) => {
    await clearProgress(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const spec = await specFor(page);

    await finishQuizCorrectly(page, spec[0]);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("#progress-label")).toHaveText("완성 4 / 27");
    expect((await snapshot(page)).state.entries[spec[0].id].completed).toBe(true);

    for (const quiz of spec.slice(1)) {
        await finishQuizCorrectly(page, quiz);
    }

    await expect(page.locator("#progress-label")).toHaveText("완성 27 / 27");
    await expect(page.locator("#completion")).toBeVisible();
    expect((await snapshot(page)).completed).toBe(true);

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#reset-button").click();
    await expect(page.locator("#progress-label")).toHaveText("완성 0 / 27");
    await expect(page.locator("#completion")).toBeHidden();
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test("migrates version-1 saved answers to distinct choice chips", async ({ page }) => {
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    const spec = await specFor(page);
    const firstQuiz = spec[0];
    const legacyEntries = Object.fromEntries(spec.map((quiz) => {
        const completed = quiz.id === firstQuiz.id;
        return [quiz.id, {
            answers: completed ? Object.fromEntries(quiz.blanks.map((blank) => [blank.id, blank.wordId])) : {},
            locked: completed ? firstQuiz.blanks.map((blank) => blank.id) : [],
            completed,
            attempts: completed ? 1 : 0,
            bankOrder: quiz.choices.map((choice) => choice.wordId)
        }];
    }));

    await page.addInitScript(({ key, entries }) => {
        localStorage.setItem(key, JSON.stringify({ version: 1, entries }));
    }, { key: STORAGE_KEY, entries: legacyEntries });
    await page.reload({ waitUntil: "domcontentloaded" });

    const restored = (await snapshot(page)).state;
    expect(restored.version).toBe(2);
    expect(restored.entries[firstQuiz.id]).toMatchObject({
        completed: true,
        locked: firstQuiz.blanks.map((blank) => blank.id)
    });
    expect(Object.values(restored.entries[firstQuiz.id].answers).sort()).toEqual(
        firstQuiz.choices
            .filter((choice) => firstQuiz.blanks.some((blank) => blank.wordId === choice.wordId))
            .map((choice) => choice.id)
            .sort()
    );
    await expect(page.locator("#progress-label")).toHaveText("완성 4 / 27");
});

test("a corrupt saved record remains untouched until the learner explicitly resets it", async ({ page }) => {
    await page.addInitScript((key) => {
        localStorage.setItem(key, "{not-valid-json");
    }, STORAGE_KEY);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__c15VocabularyReviewQuiz));

    await expect(page.locator("#storage-status")).toBeVisible();
    await expect(page.locator("#storage-status")).toContainText("저장된 기록을 읽을 수 없습니다");
    expect((await snapshot(page)).storageMode).toBe("corrupt");
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe("{not-valid-json");
});

test("a storage write failure keeps answers in memory and offers recovery copy", async ({ page }) => {
    await page.addInitScript((key) => {
        const originalSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function (storageKey, value) {
            if (storageKey === key) {
                throw new DOMException("Storage full", "QuotaExceededError");
            }
            return originalSetItem.call(this, storageKey, value);
        };
    }, STORAGE_KEY);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const firstQuiz = (await specFor(page))[0];
    const firstBlank = firstQuiz.blanks[0];

    const firstCorrectChoice = firstUnusedCorrectChoice(firstQuiz, firstBlank, new Set());
    await chooseAnswer(page, firstQuiz.id, firstBlank.id, firstCorrectChoice.id);

    await expect(page.locator("#storage-status")).toBeVisible();
    await expect(page.locator("#storage-status")).toContainText("저장하지 못했습니다");
    await expect(page.locator("#copy-recovery")).toBeVisible();
    expect((await snapshot(page)).storageMode).toBe("unsaved");
    await expect(page.locator(blankSelector(firstQuiz.id, firstBlank.id))).toContainText(firstBlank.label);
});

test("the C15 hub links to the vocabulary review quiz", async ({ page }) => {
    await page.goto("/c15/", { waitUntil: "domcontentloaded" });
    const link = page.getByRole("link", { name: "어휘 복습 퀴즈 · 빈칸 채우기" });

    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(/\/c15\/vocabulary-review-quiz\.html$/);
});

test("dragging a word chip onto a blank fills that blank", async ({ page }) => {
    await clearProgress(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const firstQuiz = (await specFor(page))[0];
    const firstBlank = firstQuiz.blanks[0];
    const correctChoice = firstUnusedCorrectChoice(firstQuiz, firstBlank, new Set());
    const source = page.locator(choiceSelector(firstQuiz.id, correctChoice.id));
    const target = page.locator(blankSelector(firstQuiz.id, firstBlank.id));

    await source.dragTo(target);

    await expect(target).toContainText(firstBlank.label);
    await expect(page.locator("#feedback-" + firstQuiz.id)).toContainText("표현을 빈칸에 넣었어요");
    await expect(source).toBeDisabled();
});

test("accepts separate matching chips when the same vocabulary answer appears twice", async ({ page }) => {
    await clearProgress(page);
    await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
    const utilityQuiz = (await specFor(page)).find((quiz) => quiz.id === "utility-schedule");

    await finishQuizCorrectly(page, utilityQuiz);

    await expect(page.locator("#quiz-" + utilityQuiz.id)).toHaveClass(/is-complete/);
    const entry = (await snapshot(page)).state.entries[utilityQuiz.id];
    const repeatedAnswers = utilityQuiz.blanks
        .filter((blank) => blank.wordId === "c15-vocab-13")
        .map((blank) => entry.answers[blank.id]);
    expect(repeatedAnswers).toHaveLength(2);
    expect(new Set(repeatedAnswers).size).toBe(2);
});

test.describe("mobile layout and keyboard path", () => {
    test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

    test("keeps the first task actionable without horizontal overflow", async ({ page }) => {
        await clearProgress(page);
        await page.goto(PAGE_URL, { waitUntil: "domcontentloaded" });
        const firstQuiz = (await specFor(page))[0];
        const firstBlank = page.locator(blankSelector(firstQuiz.id, firstQuiz.blanks[0].id));

        await expect(firstBlank).toBeVisible();
        const layout = await page.evaluate(() => ({
            overflow: Math.max(
                document.documentElement.scrollWidth - window.innerWidth,
                document.body.scrollWidth - window.innerWidth
            ),
            headingTop: document.querySelector("h1").getBoundingClientRect().top,
            blank: document.querySelector('[data-action="select-blank"]').getBoundingClientRect()
        }));
        expect(layout.overflow).toBeLessThanOrEqual(1);
        expect(layout.headingTop).toBeLessThanOrEqual(280);
        expect(layout.blank.top).toBeGreaterThanOrEqual(0);
        expect(layout.blank.bottom).toBeLessThanOrEqual(844);

        await firstBlank.focus();
        await page.keyboard.press("Enter");
        await expect(firstBlank).toHaveAttribute("aria-pressed", "true");
        await page.locator('[data-action="choose-word"][data-quiz-id="' + firstQuiz.id + '"]').first().focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#feedback-" + firstQuiz.id)).toContainText("표현을 넣었어요");
    });
});
