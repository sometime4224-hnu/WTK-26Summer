(function () {
    const config = window.LISTENING_WORKBOOK_CONFIG;
    if (!config || !Array.isArray(config.lessons)) return;

    const stateByLesson = new Map();
    const audioFrameLoops = new Map();
    let syncFrameId = null;

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getLanguage() {
        const active = document.querySelector('[data-action="set-instruction-language"].is-active');
        if (active && active.dataset.instructionLanguage === "vi") return "vi";
        return config.instructionLanguage && config.instructionLanguage.default === "vi" ? "vi" : "ko";
    }

    function usesMinimalTranslationScaffold() {
        const scaffold = config.translationScaffold || {};
        return scaffold.mode === "minimal" || scaffold.minimal === true;
    }

    function getLocalized(source, field, fallback = "") {
        if (!source) return fallback;
        const language = getLanguage();
        const localizedField = language === "vi" ? `${field}Vi` : field;
        return source[localizedField] || source[field] || fallback;
    }

    function getFrameContent(frame, field, fallback = "") {
        if (!frame) return fallback;
        if (usesMinimalTranslationScaffold()) {
            return frame[field] || fallback;
        }
        return getLocalized(frame, field, fallback);
    }

    function getVisualConfig(lesson) {
        if (!lesson || !lesson.syncVisual) return null;
        const visual = lesson.syncVisual;
        const imageSrc = visual.imageSrc || (lesson.activityImage && lesson.activityImage.src) || "";
        const frames = Array.isArray(visual.frames) ? visual.frames.filter((frame) => frame && Number.isFinite(Number(frame.start))) : [];
        if (!imageSrc || !frames.length) return null;
        return { ...visual, imageSrc, frames };
    }

    function getAudio(lessonId) {
        return document.getElementById(`audio-${lessonId}`);
    }

    function getFrameIndex(visual, time) {
        const safeTime = Number.isFinite(time) ? time : 0;
        const frames = visual.frames;
        let lastStartedIndex = 0;
        for (let index = 0; index < frames.length; index += 1) {
            const frame = frames[index];
            const start = Number(frame.start);
            const end = Number.isFinite(Number(frame.end)) ? Number(frame.end) : Infinity;
            if (safeTime < start) return Math.max(lastStartedIndex, 0);
            lastStartedIndex = index;
            if (safeTime >= start && safeTime < end) return index;
        }
        if (safeTime < Number(frames[0].start)) return 0;
        return frames.length - 1;
    }

    function getCoverRevealAt(visual) {
        const revealAt = Number(visual.coverRevealAt);
        return Number.isFinite(revealAt) ? Math.max(revealAt, 0) : 0;
    }

    function getCurrentTime(lessonId) {
        const audio = getAudio(lessonId);
        if (audio && Number.isFinite(audio.currentTime)) return audio.currentTime;
        const state = stateByLesson.get(lessonId);
        return state && Number.isFinite(state.previewTime) ? state.previewTime : 0;
    }

    function renderVisual(lesson, visual) {
        const lessonNode = document.getElementById(`lesson-${lesson.id}`);
        if (!lessonNode) return null;

        let figure = lessonNode.querySelector(".lw-lesson-visual");
        if (!figure) {
            figure = document.createElement("figure");
            const header = lessonNode.querySelector(".lw-lesson-header");
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(figure, header.nextSibling);
            } else {
                lessonNode.prepend(figure);
            }
        }

        if (figure.dataset.cuttoonLessonId === lesson.id) return figure;

        const hasCover = Boolean(visual.coverImageSrc);
        const currentState = stateByLesson.get(lesson.id) || {};
        figure.className = `lw-lesson-visual lw-film${hasCover ? " has-cover" : ""}${currentState.started ? " has-started" : ""}`;
        figure.dataset.cuttoonLessonId = lesson.id;
        figure.dataset.imageStatus = "ready";
        figure.style.setProperty("--lw-film-ratio", visual.aspectRatio || "1.12 / 1");
        const transitionMs = Number(visual.transitionMs);
        figure.style.setProperty("--lw-film-transition", `${Number.isFinite(transitionMs) ? Math.max(transitionMs, 0) : 640}ms`);

        const rail = visual.frames.map((frame, index) => `
            <li>
                <button type="button" class="lw-film__frame-button" data-film-frame="${index}" title="${escapeHtml(getFrameContent(frame, "title", `Frame ${index + 1}`))}">
                    ${escapeHtml(frame.label || String(index + 1))}
                </button>
            </li>
        `).join("");

        figure.innerHTML = `
            <div class="lw-film__header">
                <div>
                    <span class="lw-film__eyebrow">${escapeHtml(getLocalized(visual, "eyebrow", "그림 듣기"))}</span>
                    <h3>${escapeHtml(getLocalized(visual, "title", "그림으로 듣기 흐름 보기"))}</h3>
                    <p>${escapeHtml(getLocalized(visual, "copy", ""))}</p>
                </div>
                <div class="lw-film__counter" id="film-counter-${escapeHtml(lesson.id)}">1/${visual.frames.length}</div>
            </div>
            <div class="lw-film__viewport" id="film-viewport-${escapeHtml(lesson.id)}">
                <img class="lw-film__image" id="film-image-${escapeHtml(lesson.id)}" src="${escapeHtml(visual.imageSrc)}" alt="${escapeHtml(getLocalized(lesson.activityImage, "alt", lesson.title || "listening cuttoon"))}" decoding="async">
                <div class="lw-film__focus" id="film-focus-${escapeHtml(lesson.id)}" aria-hidden="true"></div>
                ${hasCover ? `
                    <div class="lw-film__cover" id="film-cover-${escapeHtml(lesson.id)}">
                        <img src="${escapeHtml(visual.coverImageSrc)}" alt="${escapeHtml(getLocalized(visual, "coverAlt", getLocalized(lesson.activityImage, "alt", lesson.title || "listening cover")))}" decoding="async">
                    </div>
                ` : ""}
            </div>
            <figcaption class="lw-film__caption" id="film-caption-${escapeHtml(lesson.id)}"></figcaption>
            <ol class="lw-film__rail">${rail}</ol>
        `;

        const state = stateByLesson.get(lesson.id) || {};
        state.activeIndex = null;
        stateByLesson.set(lesson.id, state);

        figure.querySelectorAll("[data-film-frame]").forEach((button) => {
            button.addEventListener("click", () => {
                const frameIndex = Number(button.dataset.filmFrame) || 0;
                const frame = visual.frames[frameIndex];
                const audio = getAudio(lesson.id);
                const previewTime = Math.max(Number(frame.start) || 0, 0);
                if (audio) audio.currentTime = previewTime + 0.02;
                const state = stateByLesson.get(lesson.id) || {};
                state.previewTime = previewTime;
                state.activeIndex = null;
                state.manualStarted = true;
                state.started = true;
                stateByLesson.set(lesson.id, state);
                figure.classList.add("has-started");
                applyVisualFrame(lesson, visual, previewTime, true);
            });
        });

        const image = figure.querySelector(".lw-film__image");
        image.addEventListener("load", () => applyVisualFrame(lesson, visual, getCurrentTime(lesson.id), true), { once: true });
        return figure;
    }

    function applyVisualFrame(lesson, visual, time, force = false) {
        const figure = document.querySelector(`[data-cuttoon-lesson-id="${CSS.escape(lesson.id)}"]`);
        if (!figure) return;

        const viewport = figure.querySelector(".lw-film__viewport");
        const image = figure.querySelector(".lw-film__image");
        const focus = figure.querySelector(".lw-film__focus");
        const caption = figure.querySelector(".lw-film__caption");
        if (!viewport || !image || !focus || !caption) return;
        if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;

        const frameIndex = getFrameIndex(visual, time);
        const state = stateByLesson.get(lesson.id) || {};
        figure.classList.toggle("has-started", Boolean(state.started));
        if (!force && state.activeIndex === frameIndex) return;

        const frame = visual.frames[frameIndex];
        const viewportWidth = viewport.clientWidth;
        const viewportHeight = viewport.clientHeight;
        if (!(viewportWidth > 0) || !(viewportHeight > 0)) return;

        const frameWidth = Math.max(Number(frame.width) || image.naturalWidth, 1);
        const frameHeight = Math.max(Number(frame.height) || image.naturalHeight, 1);
        const scale = Math.min(viewportWidth / frameWidth, viewportHeight / frameHeight);
        const x = Number(frame.x) || 0;
        const y = Number(frame.y) || 0;
        const translateX = ((viewportWidth - frameWidth * scale) / 2) - x * scale;
        const translateY = ((viewportHeight - frameHeight * scale) / 2) - y * scale;
        const focusX = x * scale + translateX;
        const focusY = y * scale + translateY;

        image.style.width = `${image.naturalWidth}px`;
        image.style.height = `${image.naturalHeight}px`;
        image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        focus.style.width = `${frameWidth * scale}px`;
        focus.style.height = `${frameHeight * scale}px`;
        focus.style.transform = `translate(${focusX}px, ${focusY}px)`;

        caption.innerHTML = `
            <strong>${escapeHtml(getFrameContent(frame, "title", `Frame ${frameIndex + 1}`))}</strong>
            <span>${escapeHtml(getFrameContent(frame, "caption", ""))}</span>
        `;

        const counter = figure.querySelector(".lw-film__counter");
        if (counter) counter.textContent = `${frame.label || frameIndex + 1}/${visual.frames.length}`;
        figure.querySelectorAll("[data-film-frame]").forEach((button) => {
            button.classList.toggle("is-active", Number(button.dataset.filmFrame) === frameIndex);
        });

        state.activeIndex = frameIndex;
        state.previewTime = Number.isFinite(time) ? time : 0;
        stateByLesson.set(lesson.id, state);
    }

    function bindAudio(lesson, visual) {
        const audio = getAudio(lesson.id);
        if (!audio || audio.dataset.cuttoonBound === "true") return;
        audio.dataset.cuttoonBound = "true";
        const update = (force = false) => {
            const state = stateByLesson.get(lesson.id) || {};
            state.previewTime = audio.currentTime;
            state.started = Boolean(state.manualStarted) || audio.currentTime >= getCoverRevealAt(visual);
            stateByLesson.set(lesson.id, state);
            applyVisualFrame(lesson, visual, audio.currentTime, force);
        };
        const stopLoop = () => {
            const frameId = audioFrameLoops.get(lesson.id);
            if (frameId) window.cancelAnimationFrame(frameId);
            audioFrameLoops.delete(lesson.id);
        };
        const startLoop = () => {
            stopLoop();
            const tick = () => {
                update(false);
                if (!audio.paused && !audio.ended) {
                    audioFrameLoops.set(lesson.id, window.requestAnimationFrame(tick));
                } else {
                    audioFrameLoops.delete(lesson.id);
                }
            };
            audioFrameLoops.set(lesson.id, window.requestAnimationFrame(tick));
        };
        ["loadedmetadata", "timeupdate", "seeked", "pause", "ended"].forEach((eventName) => {
            audio.addEventListener(eventName, () => {
                if (eventName === "pause" || eventName === "ended") stopLoop();
                update(eventName !== "timeupdate");
            });
        });
        audio.addEventListener("play", () => {
            update(true);
            startLoop();
        });
        update(true);
    }

    function syncVisuals() {
        config.lessons.forEach((lesson) => {
            const visual = getVisualConfig(lesson);
            if (!visual) return;
            const figure = renderVisual(lesson, visual);
            if (!figure) return;
            bindAudio(lesson, visual);
            applyVisualFrame(lesson, visual, getCurrentTime(lesson.id), false);
        });
    }

    function scheduleSyncVisuals() {
        if (syncFrameId) return;
        syncFrameId = window.requestAnimationFrame(() => {
            syncFrameId = null;
            syncVisuals();
        });
    }

    function init() {
        syncVisuals();
        const root = document.getElementById("listening-workbook-app");
        if (root) {
            const observer = new MutationObserver(scheduleSyncVisuals);
            observer.observe(root, { childList: true, subtree: true });
        }
        window.addEventListener("resize", scheduleSyncVisuals);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
