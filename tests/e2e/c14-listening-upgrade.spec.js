const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..", "..");

function hasOriginalAudio(fileName) {
    if (process.env.C14_TEST_WITHOUT_ORIGINAL_AUDIO === "1") return false;
    return fs.existsSync(path.join(projectRoot, "assets", "c14", "listening", "audio", fileName));
}

const mainPages = [
    {
        path: "/c14/listening1.html",
        track: "track52",
        image: "listening1-illustration-1600w.webp",
        cuttoon: "listening1-cuttoon.html",
        audio: "Seoul%20Univ_3B_Trk_52.mp3",
        originalAssetAvailable: hasOriginalAudio("Seoul Univ_3B_Trk_52.mp3"),
        fallbackAudio: "c14_track52_generated.mp3",
        duration: 99.246,
        generatedDuration: 115.558,
        generatedTime: 13.2,
        generatedLine: 1,
        generatedSeekLine: 1,
        generatedSeekChunk: 1,
        originalSeekTime: 10.41,
        generatedSeekTime: 11.278,
        guideTime: 3.6,
        guideLine: 0,
        bodyTime: 7.4,
        bodyLine: 1,
        quizAnswers: ["2", "1", "3"],
        sequence: ["farm-1", "farm-2", "farm-3", "farm-4"]
    },
    {
        path: "/c14/listening2.html",
        track: "track53",
        image: "listening2-illustration-1600w.webp",
        cuttoon: "listening2-cuttoon.html",
        audio: "Seoul%20Univ_3B_Trk_53.mp3",
        originalAssetAvailable: hasOriginalAudio("Seoul Univ_3B_Trk_53.mp3"),
        fallbackAudio: "c14_track53_generated.mp3",
        duration: 90.124,
        generatedDuration: 108.492,
        generatedTime: 22.7,
        generatedLine: 1,
        generatedSeekLine: 0,
        generatedSeekChunk: 1,
        originalSeekTime: 5.86,
        generatedSeekTime: 6.42,
        guideTime: 3.6,
        guideLine: 0,
        bodyTime: 22.5,
        bodyLine: 2,
        quizAnswers: ["2", "1", "3"],
        sequence: ["exhibit-1", "exhibit-2", "exhibit-3", "exhibit-4"]
    }
];

const cuttoonPages = [
    {
        path: "/c14/listening1-cuttoon.html",
        workbook: "listening1.html",
        audio: "Seoul%20Univ_3B_Trk_52.mp3",
        originalAssetAvailable: hasOriginalAudio("Seoul Univ_3B_Trk_52.mp3"),
        fileName: "Seoul Univ_3B_Trk_52.mp3",
        generatedAudio: "c14_track52_generated.mp3",
        duration: 99.246,
        generatedDuration: 115.558,
        cuts: 5,
        guideTime: 3.6,
        guideLine: 0,
        guideChunk: 0,
        bodyTime: 7.4,
        bodyLine: 1,
        bodyChunk: 0,
        gapTime: 15,
        nextCutTime: 15.8,
        fallbackTime: 11.5,
        fallbackLine: 1,
        fallbackChunk: 1
    },
    {
        path: "/c14/listening2-cuttoon.html",
        workbook: "listening2.html",
        audio: "Seoul%20Univ_3B_Trk_53.mp3",
        originalAssetAvailable: hasOriginalAudio("Seoul Univ_3B_Trk_53.mp3"),
        fileName: "Seoul Univ_3B_Trk_53.mp3",
        generatedAudio: "c14_track53_generated.mp3",
        duration: 90.124,
        generatedDuration: 108.492,
        cuts: 6,
        guideTime: 3.6,
        guideLine: 0,
        guideChunk: 0,
        bodyTime: 22.5,
        bodyLine: 2,
        bodyChunk: 0,
        gapTime: 19,
        nextCutTime: 19.45,
        fallbackTime: 22.6,
        fallbackLine: 1,
        fallbackChunk: 0
    }
];

async function blockExternalRequests(page) {
    await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173\/).*/, (route) => route.abort());
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function expectNoHorizontalOverflow(page) {
    const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectInsideViewport(page, locator) {
    const bounds = await locator.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
            left: rect.left,
            right: rect.right,
            clientWidth: document.documentElement.clientWidth
        };
    });
    expect(bounds.left).toBeGreaterThanOrEqual(-1);
    expect(bounds.right).toBeLessThanOrEqual(bounds.clientWidth + 1);
}

async function expectReducedMotion(page, selector) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const transitionSeconds = await page.locator(selector).evaluateAll((elements) =>
        elements.map((element) => Number.parseFloat(getComputedStyle(element).transitionDuration) || 0)
    );
    expect(Math.max(...transitionSeconds)).toBeLessThanOrEqual(0.001);
}

async function expectResponsiveWidths(page, widths) {
    for (const width of widths) {
        await page.setViewportSize({ width, height: width < 640 ? 844 : 900 });
        await page.reload({ waitUntil: "domcontentloaded" });
        await expectNoHorizontalOverflow(page);
    }
}

async function loadAudioMetadata(page, selector = "audio") {
    await page.locator(selector).evaluate((audio) => {
        audio.load();
        if (audio.readyState >= 1) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const timeout = window.setTimeout(() => reject(new Error("audio metadata timeout")), 10_000);
            audio.addEventListener("loadedmetadata", () => {
                window.clearTimeout(timeout);
                resolve();
            }, { once: true });
        });
    });
}

async function setAudioTime(page, selector, time) {
    await page.locator(selector).evaluate((audio, nextTime) => {
        audio.currentTime = nextTime;
        audio.dispatchEvent(new Event("timeupdate"));
    }, time);
}

async function getTextContrastRatio(locator) {
    return locator.evaluate((element) => {
        const parseRgb = (value) => {
            const parts = String(value).match(/[\d.]+/g) || [];
            return parts.slice(0, 3).map(Number);
        };
        const luminance = (rgb) => {
            const channels = rgb.map((value) => {
                const normalized = value / 255;
                return normalized <= 0.04045
                    ? normalized / 12.92
                    : ((normalized + 0.055) / 1.055) ** 2.4;
            });
            return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
        };
        const style = getComputedStyle(element);
        const foreground = luminance(parseRgb(style.color));
        const background = luminance(parseRgb(style.backgroundColor));
        const lighter = Math.max(foreground, background);
        const darker = Math.min(foreground, background);
        return (lighter + 0.05) / (darker + 0.05);
    });
}

for (const config of mainPages) {
    test(`c14 workbook keeps approved content and a compact local-first path: ${config.path}`, async ({ page }) => {
        await blockExternalRequests(page);
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));

        await page.addInitScript(({ path, track }) => {
            localStorage.setItem(`korean3b.listening.v3:${path}:${track}:listens`, "{broken-json");
        }, { path: config.path, track: config.track });

        await page.setViewportSize({ width: 390, height: 844 });
        const audioRequests = [];
        page.on("request", (request) => {
            if (/\.mp3(?:$|\?)/i.test(request.url())) audioRequests.push(request.url());
        });
        await page.goto(config.path, { waitUntil: "domcontentloaded" });

        await expect(page.locator("body")).toHaveClass(/c14-listening-page/);
        await expect(page.locator("audio")).toHaveAttribute("preload", "none");
        const audio = page.locator(`#audio-${config.track}`);
        await expect(audio).toHaveAttribute("data-remote-source-type", "original");
        await expect(audio.locator("source")).toHaveAttribute("src", new RegExp(`${config.audio}$`));
        await expect(audio).toHaveAttribute("data-fallback-src", new RegExp(`${config.fallbackAudio}$`));
        await expect(page.locator(`img[src$="${config.image}"]`)).toHaveCount(1);
        const cuttoonLink = page.locator(`.listening-mode-link[href="${config.cuttoon}"]`);
        await expect(cuttoonLink).toBeVisible();
        await expectInsideViewport(page, cuttoonLink);
        await expect(page.locator('script[src*="cdn.tailwindcss.com"]')).toHaveCount(0);
        await expect(page.locator('link[href*="font-awesome"]')).toHaveCount(0);
        await expect(page.locator('[data-action="quick-play"]')).toBeVisible();
        await expect(page.locator(".lw-routine")).toBeVisible();
        const mobileRoutineHeight = await page.locator(".lw-routine").evaluate((element) => element.getBoundingClientRect().height);
        expect(mobileRoutineHeight).toBeLessThanOrEqual(300);
        await expectNoHorizontalOverflow(page);
        await page.waitForTimeout(250);
        expect(audioRequests).toEqual([]);

        if (config.originalAssetAvailable) {
            await loadAudioMetadata(page, `#audio-${config.track}`);
            const duration = await audio.evaluate((element) => element.duration);
            expect(duration).toBeCloseTo(config.duration, 1);

            await setAudioTime(page, `#audio-${config.track}`, 0.8);
            await expect(page.locator(".lw-line-card.is-audio-active")).toHaveCount(0);
            await setAudioTime(page, `#audio-${config.track}`, config.guideTime);
            await expect(page.locator(`#line-card-${config.track}-${config.guideLine}`)).toHaveClass(/is-audio-active/);
            await setAudioTime(page, `#audio-${config.track}`, config.bodyTime);
            await expect(page.locator(`#line-card-${config.track}-${config.bodyLine}`)).toHaveClass(/is-audio-active/);
        }

        const contentContract = await page.evaluate(() => {
            const lesson = window.LISTENING_WORKBOOK_CONFIG.lessons[0];
            return {
                quizAnswers: lesson.questions.map((question) => question.answer),
                sequence: lesson.sequenceTask.answerOrder,
                transcriptLength: lesson.transcript.length
            };
        });
        expect(contentContract.quizAnswers).toEqual(config.quizAnswers);
        expect(contentContract.sequence).toEqual(config.sequence);
        expect(contentContract.transcriptLength).toBeGreaterThan(0);

        const quizToggle = page.locator(`[data-action="toggle-quiz-fold"][data-lesson-id="${config.track}"]`);
        await expect(quizToggle).toHaveAttribute("aria-expanded", "false");
        await quizToggle.press("Enter");
        await expect(quizToggle).toHaveAttribute("aria-expanded", "true");

        await page.setViewportSize({ width: 320, height: 844 });
        await page.reload({ waitUntil: "domcontentloaded" });
        await expectNoHorizontalOverflow(page);
        await expect(page.locator(`[data-action="toggle-quiz-fold"][data-lesson-id="${config.track}"]`)).toHaveAttribute("aria-expanded", "true");

        await expectResponsiveWidths(page, [512, 720, 1024, 1440]);
        await expectReducedMotion(page, ".lw-quick-dock__button");
        expect(pageErrors).toEqual([]);
    });

    test(`c14 workbook switches both highlighting and seek controls to generated fallback timing: ${config.path}`, async ({ page }) => {
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        await page.route(new RegExp(`${escapeRegex(config.audio)}(?:$|\\?)`), (route) => route.fulfill({
            status: 404,
            contentType: "text/plain",
            body: "missing original audio"
        }));
        await page.goto(config.path, { waitUntil: "domcontentloaded" });

        const audio = page.locator(`#audio-${config.track}`);
        await loadAudioMetadata(page, `#audio-${config.track}`);
        await expect(audio).toHaveAttribute("data-remote-source-type", "generated");
        await expect(audio).toHaveAttribute("src", new RegExp(`${config.fallbackAudio}$`));
        const duration = await audio.evaluate((element) => element.duration);
        expect(duration).toBeCloseTo(config.generatedDuration, 1);

        await setAudioTime(page, `#audio-${config.track}`, config.generatedTime);
        await expect(page.locator(`#line-card-${config.track}-${config.generatedLine}`)).toHaveClass(/is-audio-active/);

        await page.evaluate(({ track, lineIndex, chunkIndex, originalSeekTime }) => {
            const control = document.createElement("button");
            control.id = "generated-timing-seek-probe";
            control.dataset.action = "seek-audio";
            control.dataset.lessonId = track;
            control.dataset.lineIndex = String(lineIndex);
            control.dataset.chunkIndex = String(chunkIndex);
            control.dataset.seekTime = String(originalSeekTime);
            document.body.append(control);
        }, {
            track: config.track,
            lineIndex: config.generatedSeekLine,
            chunkIndex: config.generatedSeekChunk,
            originalSeekTime: config.originalSeekTime
        });
        await page.locator("#generated-timing-seek-probe").click();
        const seekedTime = await audio.evaluate((element) => {
            element.pause();
            return element.currentTime;
        });
        expect(Math.abs(seekedTime - config.generatedSeekTime)).toBeLessThan(0.4);
        expect(Math.abs(seekedTime - config.originalSeekTime)).toBeGreaterThan(0.4);
        expect(pageErrors).toEqual([]);
    });
}

for (const config of cuttoonPages) {
    test(`c14 cuttoon streams on demand and stays usable on mobile: ${config.path}`, async ({ page }) => {
        await blockExternalRequests(page);
        if (!config.originalAssetAvailable) {
            await page.route(new RegExp(`${escapeRegex(config.audio)}(?:$|\\?)`), (route) => route.fulfill({
                status: 404,
                contentType: "text/plain",
                body: "original audio is not provisioned in this checkout"
            }));
        }
        await page.setViewportSize({ width: 390, height: 844 });

        const audioRequests = [];
        page.on("request", (request) => {
            if (/\.mp3(?:$|\?)/i.test(request.url())) audioRequests.push(request.url());
        });

        await page.goto(config.path, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(300);

        await expect(page.locator("body")).toHaveClass(/c14-cuttoon-page/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("#audioPlayer")).toHaveAttribute("preload", "none");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("src", new RegExp(`${config.audio}$`));
        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-source-type", "original");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-audio-mode", "bundled");
        await expect(page.locator("#audioSourceBadge")).toHaveText("원음");
        await expect(page.locator("#localAudioFileName")).toHaveText(config.fileName);
        await expect(page.locator("#connectLocalAudioBtn")).toBeVisible();
        await expect(page.locator(".lc-thumb")).toHaveCount(config.cuts);
        const lazyLoadingValues = await page.locator(".lc-thumb img").evaluateAll((images) => images.map((image) => image.loading));
        expect(lazyLoadingValues).toEqual(Array(config.cuts).fill("lazy"));
        await expect(page.locator('.lc-thumb[aria-current="true"]')).toHaveAttribute("data-cut-index", "0");
        const workbookLink = page.locator(`.listening-mode-link[href="${config.workbook}"]`);
        await expect(workbookLink).toBeVisible();
        await expectInsideViewport(page, workbookLink);
        await expect(page.locator('link[href*="font-awesome"]')).toHaveCount(0);
        expect(audioRequests).toEqual([]);
        await expectNoHorizontalOverflow(page);

        const transcriptToggle = page.locator("#toggleTranscriptBtn");
        await expect(transcriptToggle).toHaveAttribute("aria-expanded", "false");
        await expect(transcriptToggle).toHaveAttribute("aria-controls", "transcriptSection");
        await transcriptToggle.press("Enter");
        await expect(transcriptToggle).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator("#transcriptSection")).toBeVisible();

        if (config.originalAssetAvailable) {
            await loadAudioMetadata(page, "#audioPlayer");
            const duration = await page.locator("#audioPlayer").evaluate((audio) => audio.duration);
            expect(duration).toBeCloseTo(config.duration, 1);

            await setAudioTime(page, "#audioPlayer", 0.8);
            await expect(page.locator(".lc-line.is-active")).toHaveCount(0);
            await expect(page.locator('.lc-thumb[aria-current="true"]')).toHaveAttribute("data-cut-index", "0");
            await setAudioTime(page, "#audioPlayer", config.guideTime);
            await expect(page.locator(`#cuttoon-line-${config.guideLine}`)).toHaveClass(/is-active/);
            await expect(page.locator(`#cuttoon-chunk-${config.guideLine}-${config.guideChunk}`)).toHaveClass(/is-active/);
            await setAudioTime(page, "#audioPlayer", config.bodyTime);
            await expect(page.locator(`#cuttoon-line-${config.bodyLine}`)).toHaveClass(/is-active/);
            await expect(page.locator(`#cuttoon-chunk-${config.bodyLine}-${config.bodyChunk}`)).toHaveClass(/is-active/);
            await setAudioTime(page, "#audioPlayer", config.gapTime);
            await expect(page.locator('.lc-thumb[aria-current="true"]')).toHaveAttribute("data-cut-index", "0");
            await setAudioTime(page, "#audioPlayer", config.nextCutTime);
            await expect(page.locator('.lc-thumb[aria-current="true"]')).toHaveAttribute("data-cut-index", "1");
        }

        const secondCut = page.locator('.lc-thumb[data-cut-index="1"]');
        await expect(secondCut).toHaveAttribute("aria-label", /^컷 2: .+/);
        await secondCut.press("Enter");
        await expect(secondCut).toHaveAttribute("aria-current", "true");
        await expect.poll(() => audioRequests.length).toBeGreaterThan(0);

        await expectResponsiveWidths(page, [320, 512, 720, 1024, 1440]);
        await expectReducedMotion(page, ".lc-frame__image");
    });

    test(`c14 cuttoon falls back to generated audio with its own timing: ${config.path}`, async ({ page }) => {
        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        await page.route(new RegExp(`${escapeRegex(config.audio)}(?:$|\\?)`), (route) => route.abort());
        await page.goto(config.path, { waitUntil: "domcontentloaded" });

        await loadAudioMetadata(page, "#audioPlayer");
        await expect(page.locator("#audioSourceBadge")).toHaveText("생성 음성");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-source-type", "generated");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("src", new RegExp(`${config.generatedAudio}$`));
        const duration = await page.locator("#audioPlayer").evaluate((audio) => audio.duration);
        expect(duration).toBeCloseTo(config.generatedDuration, 1);

        await page.locator("#toggleTranscriptBtn").click();
        await setAudioTime(page, "#audioPlayer", config.fallbackTime);
        await expect(page.locator(`#cuttoon-line-${config.fallbackLine}`)).toHaveClass(/is-active/);
        const activeChunk = page.locator(`#cuttoon-chunk-${config.fallbackLine}-${config.fallbackChunk}`);
        await expect(activeChunk).toHaveClass(/is-active/);
        await expect.poll(() => getTextContrastRatio(activeChunk)).toBeGreaterThanOrEqual(4.5);
        expect(pageErrors).toEqual([]);
    });

    test(`c14 cuttoon can use and disconnect the teacher local-audio folder: ${config.path}`, async ({ page }) => {
        await page.addInitScript(({ audioPath, fileName }) => {
            const handle = {
                name: "SB",
                queryPermission: async () => "granted",
                requestPermission: async () => "granted",
                getFileHandle: async (requestedName) => {
                    if (requestedName !== fileName) {
                        throw new DOMException("missing", "NotFoundError");
                    }
                    return {
                        getFile: async () => {
                            const response = await fetch(audioPath);
                            const blob = await response.blob();
                            return new File([blob], fileName, { type: "audio/mpeg" });
                        }
                    };
                }
            };
            Object.defineProperty(window, "showDirectoryPicker", {
                configurable: true,
                value: async () => handle
            });
        }, {
            audioPath: config.originalAssetAvailable
                ? `/assets/c14/listening/audio/${config.audio}`
                : `/assets/c14/listening/audio/${config.generatedAudio}`,
            fileName: config.fileName
        });

        const pageErrors = [];
        page.on("pageerror", (error) => pageErrors.push(error.message));
        await page.goto(config.path, { waitUntil: "domcontentloaded" });
        await page.locator("#connectLocalAudioBtn").click();

        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-audio-mode", "local");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-source-type", "original");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("src", /^blob:/);
        await expect(page.locator("#audioSourceBadge")).toHaveText("로컬 원음");
        await expect(page.locator("#localAudioStatus")).toContainText(`(SB)에서 ${config.fileName} 파일을 사용합니다.`);
        await expect(page.locator("#disconnectLocalAudioBtn")).toBeVisible();

        await page.locator("#disconnectLocalAudioBtn").click();
        await expect(page.locator("#audioPlayer")).toHaveAttribute("data-audio-mode", "bundled");
        await expect(page.locator("#audioPlayer")).toHaveAttribute("src", new RegExp(`${config.audio}$`));
        await expect(page.locator("#audioSourceBadge")).toHaveText("원음");
        await expect(page.locator("#localAudioStatus")).toContainText(config.fileName);
        expect(pageErrors).toEqual([]);
    });
}
