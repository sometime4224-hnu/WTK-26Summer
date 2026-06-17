(function initC11ListeningCuttoonStage() {
    const config = window.C11_LISTENING_CUTTOON_CONFIG;
    if (!config || !config.lessonId || !Array.isArray(config.panels) || !config.panels.length) return;

    const lessonId = config.lessonId;
    const stageZeroLabel = config.stageZeroLabel || "컷툰 듣기";
    const panels = config.panels;

    const escapeHtml = (value) => String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    function getStageButton() {
        return document.querySelector(`[data-action="set-stage"][data-lesson-id="${lessonId}"][data-stage="0"]`);
    }

    function getPanelIndex(time) {
        const safeTime = Number.isFinite(Number(time)) ? Number(time) : 0;
        if (safeTime <= panels[0].start) return 0;
        for (let index = panels.length - 1; index >= 0; index -= 1) {
            if (safeTime >= panels[index].start - 0.05) return index;
        }
        return 0;
    }

    function buildCuttoonMarkup() {
        const frames = panels.map((panel, index) => `
            <article class="lw-cuttoon-frame" data-cuttoon-frame="${index}">
                <img src="${escapeHtml(panel.image)}" alt="${escapeHtml(panel.title)}" loading="${index === 0 ? "eager" : "lazy"}">
                <div class="lw-cuttoon-caption">
                    <span>${index + 1} / ${panels.length}</span>
                    <strong>${escapeHtml(panel.title)}</strong>
                    <p>${escapeHtml(panel.note)}</p>
                </div>
            </article>
        `).join("");
        const thumbs = panels.map((panel, index) => `
            <button type="button" class="lw-cuttoon-thumb" data-cuttoon-index="${index}" aria-label="${escapeHtml(`${index + 1}컷 ${panel.title}`)}">
                <img src="${escapeHtml(panel.image)}" alt="" loading="lazy">
                <span>${index + 1}</span>
            </button>
        `).join("");

        return `
            <div class="lw-cuttoon-listening" data-cuttoon-root="${lessonId}" style="--panel-index:0">
                <div class="lw-cuttoon-main">
                    <div class="lw-cuttoon-track">${frames}</div>
                    <button
                        type="button"
                        class="lw-cuttoon-fullscreen"
                        data-cuttoon-fullscreen
                        aria-label="전체화면"
                        title="전체화면"
                    >
                        <i class="fa-solid fa-expand" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="lw-cuttoon-thumbs">${thumbs}</div>
            </div>
        `;
    }

    function getFullscreenElement() {
        return document.fullscreenElement
            || document.webkitFullscreenElement
            || document.msFullscreenElement
            || null;
    }

    function canUseFullscreen(element) {
        return Boolean(element && (
            element.requestFullscreen
            || element.webkitRequestFullscreen
            || element.msRequestFullscreen
        ));
    }

    function requestFullscreen(element) {
        if (element.requestFullscreen) return element.requestFullscreen();
        if (element.webkitRequestFullscreen) return element.webkitRequestFullscreen();
        if (element.msRequestFullscreen) return element.msRequestFullscreen();
        return Promise.reject(new Error("Fullscreen is not available."));
    }

    function exitFullscreen() {
        if (document.exitFullscreen) return document.exitFullscreen();
        if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
        if (document.msExitFullscreen) return document.msExitFullscreen();
        return Promise.resolve();
    }

    function updateFullscreenState() {
        const activeElement = getFullscreenElement();
        document.querySelectorAll(`[data-cuttoon-root="${lessonId}"]`).forEach((root) => {
            const button = root.querySelector("[data-cuttoon-fullscreen]");
            const supported = canUseFullscreen(root);
            const active = Boolean(activeElement && (activeElement === root || root.contains(activeElement)));
            root.classList.toggle("has-fullscreen", supported);
            root.classList.toggle("is-fullscreen", active);
            if (!button) return;
            if (button.hidden === supported) button.hidden = !supported;
            button.setAttribute("aria-label", active ? "전체화면 종료" : "전체화면");
            button.setAttribute("title", active ? "전체화면 종료" : "전체화면");
            if (button.dataset.fullscreenActive !== String(active)) {
                button.dataset.fullscreenActive = String(active);
                button.innerHTML = `<i class="fa-solid ${active ? "fa-compress" : "fa-expand"}" aria-hidden="true"></i>`;
            }
        });
    }

    function syncActivePanel() {
        const root = document.querySelector(`[data-cuttoon-root="${lessonId}"]`);
        const audio = document.getElementById(`audio-${lessonId}`);
        if (!root || !audio) return;

        const index = getPanelIndex(audio.currentTime);
        root.style.setProperty("--panel-index", String(index));
        root.querySelectorAll("[data-cuttoon-frame]").forEach((frame) => {
            frame.classList.toggle("is-active", Number(frame.dataset.cuttoonFrame) === index);
        });
        root.querySelectorAll("[data-cuttoon-index]").forEach((thumb) => {
            thumb.classList.toggle("is-active", Number(thumb.dataset.cuttoonIndex) === index);
        });
    }

    function renderCuttoonStage() {
        const transcript = document.getElementById(`transcript-${lessonId}`);
        const stageButton = getStageButton();
        if (stageButton && stageButton.textContent.trim() !== stageZeroLabel) {
            stageButton.textContent = stageZeroLabel;
        }
        if (!transcript || !stageButton) return;

        const isCuttoonStage = stageButton.classList.contains("is-active");
        transcript.classList.toggle("is-cuttoon-mode", isCuttoonStage);
        if (!isCuttoonStage) return;

        if (!transcript.querySelector(`[data-cuttoon-root="${lessonId}"]`)) {
            transcript.innerHTML = buildCuttoonMarkup();
        }
        updateFullscreenState();
        syncActivePanel();
    }

    function bindAudio() {
        const audio = document.getElementById(`audio-${lessonId}`);
        if (!audio || audio.dataset.cuttoonBound === "true") return;
        audio.dataset.cuttoonBound = "true";
        ["loadedmetadata", "play", "timeupdate", "seeked", "pause", "ended"].forEach((eventName) => {
            audio.addEventListener(eventName, syncActivePanel);
        });
    }

    document.addEventListener("click", (event) => {
        const thumb = event.target.closest("[data-cuttoon-index]");
        if (thumb) {
            const audio = document.getElementById(`audio-${lessonId}`);
            const index = Number(thumb.dataset.cuttoonIndex);
            if (audio && Number.isInteger(index) && panels[index]) {
                audio.currentTime = panels[index].start + 0.02;
                syncActivePanel();
            }
            return;
        }

        const fullscreenButton = event.target.closest("[data-cuttoon-fullscreen]");
        if (fullscreenButton) {
            const root = fullscreenButton.closest(`[data-cuttoon-root="${lessonId}"]`);
            if (!root || !canUseFullscreen(root)) return;
            event.preventDefault();
            const activeElement = getFullscreenElement();
            const isActive = activeElement && (activeElement === root || root.contains(activeElement));
            const action = isActive ? exitFullscreen() : requestFullscreen(root);
            Promise.resolve(action)
                .then(updateFullscreenState)
                .catch(updateFullscreenState);
            return;
        }

        const button = event.target.closest(`[data-action="set-stage"][data-lesson-id="${lessonId}"]`);
        if (button) window.setTimeout(renderCuttoonStage, 0);
    });

    ["fullscreenchange", "webkitfullscreenchange", "msfullscreenchange"].forEach((eventName) => {
        document.addEventListener(eventName, updateFullscreenState);
    });

    const observer = new MutationObserver(() => {
        bindAudio();
        renderCuttoonStage();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "hidden"]
    });

    window.addEventListener("load", () => {
        bindAudio();
        renderCuttoonStage();
    });
    window.setTimeout(() => {
        bindAudio();
        renderCuttoonStage();
    }, 0);
})();
