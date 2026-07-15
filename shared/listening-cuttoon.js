(() => {
    "use strict";

    const CUT_TOLERANCE = 0.05;
    const CHUNK_TOLERANCE = 0.04;
    const LOCAL_AUDIO_DB_NAME = "korean3b.listening.v3.local-audio";
    const LOCAL_AUDIO_DB_VERSION = 1;
    const LOCAL_AUDIO_STORE_NAME = "handles";
    const LOCAL_AUDIO_HANDLE_KEY = "teacher-audio-folder";
    const state = {
        lesson: null,
        sourceType: "original",
        audioMode: "bundled",
        cutAvailability: new Map(),
        cutRanges: [],
        transcriptTimeline: [],
        activeCutIndex: null,
        activeLineIndex: null,
        activeChunkIndex: null,
        transcriptOpen: false,
        audioFallbackTried: false,
        thumbObserver: null,
        pendingSeekTime: null,
        localAudio: {
            supported: Boolean(window.isSecureContext && "showDirectoryPicker" in window),
            canPersist: "indexedDB" in window,
            folderHandle: null,
            folderName: "",
            permissionState: "unsupported",
            objectUrl: null
        }
    };
    const refs = {};

    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        const lessonKey = document.body.dataset.lessonKey;
        const dataset = window.C14_LISTENING_CUTTOON || {};
        const lesson = dataset[lessonKey];
        if (!lesson) return;

        state.lesson = lesson;
        cacheRefs();
        applyTheme(lesson);
        refs.pageTitle.textContent = lesson.title;
        refs.navTitle.textContent = lesson.title;

        bindUi();
        state.cutAvailability = resolveCutAvailability(lesson);
        const audioInfo = await resolveAudioSource(lesson);
        applyAudioSource(audioInfo);

        rebuildTimingState();
        renderThumbs();
        renderTranscript();
        updateCutState(0, true);
        updateTranscriptState(0, true);
        updateLocalAudioControls();
        void restoreSavedLocalAudioFolder();
    }

    function cacheRefs() {
        refs.navTitle = document.getElementById("cuttoonNavTitle");
        refs.pageTitle = document.getElementById("cuttoonPageTitle");
        refs.audioSourceBadge = document.getElementById("audioSourceBadge");
        refs.toggleTranscriptBtn = document.getElementById("toggleTranscriptBtn");
        refs.panelImage = document.getElementById("panelImage");
        refs.cutThumbs = document.getElementById("cutThumbs");
        refs.audioPlayer = document.getElementById("audioPlayer");
        refs.transcriptSection = document.getElementById("transcriptSection");
        refs.transcriptLines = document.getElementById("transcriptLines");
        refs.connectLocalAudioBtn = document.getElementById("connectLocalAudioBtn");
        refs.disconnectLocalAudioBtn = document.getElementById("disconnectLocalAudioBtn");
        refs.localAudioFileName = document.getElementById("localAudioFileName");
        refs.localAudioStatus = document.getElementById("localAudioStatus");
    }

    function bindUi() {
        window.addEventListener("pagehide", cleanupResources, { once: true });

        refs.toggleTranscriptBtn.addEventListener("click", () => {
            state.transcriptOpen = !state.transcriptOpen;
            refs.transcriptSection.hidden = !state.transcriptOpen;
            refs.toggleTranscriptBtn.textContent = state.transcriptOpen ? "대본 닫기" : "대본";
            refs.toggleTranscriptBtn.setAttribute("aria-expanded", String(state.transcriptOpen));
            if (state.transcriptOpen && Number.isInteger(state.activeLineIndex)) {
                scrollLineIntoView(state.activeLineIndex);
            }
        });

        refs.audioPlayer.addEventListener("timeupdate", () => syncToAudio());
        refs.audioPlayer.addEventListener("seeked", () => syncToAudio(true));
        refs.audioPlayer.addEventListener("loadedmetadata", () => {
            applyPendingSeek();
            syncToAudio(true);
        });
        refs.audioPlayer.addEventListener("canplay", applyPendingSeek);
        refs.audioPlayer.addEventListener("error", handleAudioError);
        refs.panelImage.addEventListener("error", handlePanelImageError);
        if (refs.connectLocalAudioBtn) {
            refs.connectLocalAudioBtn.addEventListener("click", connectLocalAudioFolder);
        }
        if (refs.disconnectLocalAudioBtn) {
            refs.disconnectLocalAudioBtn.addEventListener("click", disconnectLocalAudioFolder);
        }
    }

    function applyTheme(lesson) {
        const root = document.documentElement;
        root.style.setProperty("--lc-accent", lesson.theme.accent);
        root.style.setProperty("--lc-accent-dark", lesson.theme.accentDark);
        root.style.setProperty("--lc-frame-ratio", String(lesson.frameRatio || "16 / 9"));
        document.body.style.background = lesson.theme.pageBackground;
    }

    async function resolveAudioSource(lesson) {
        const generatedSrc = lesson.audio && lesson.audio.generatedSrc;
        const originalSrc = lesson.audio && lesson.audio.originalSrc;
        if (lesson.audio && lesson.audio.preferOriginal && originalSrc) {
            return { type: "original", mode: "bundled", src: originalSrc, label: "원음" };
        }
        if (lesson.audio && lesson.audio.preferGenerated && generatedSrc) {
            return { type: "generated", mode: "generated", src: generatedSrc, label: "생성 음성" };
        }
        if (originalSrc && await probeAsset(originalSrc)) {
            return { type: "original", mode: "bundled", src: originalSrc, label: "원음" };
        }
        return {
            type: "generated",
            mode: "generated",
            src: lesson.audio.generatedSrc,
            label: "생성 음성"
        };
    }

    function applyAudioSource(audioInfo, options = {}) {
        const previousType = state.sourceType;
        const previousTime = Number.isFinite(refs.audioPlayer.currentTime) ? refs.audioPlayer.currentTime : 0;
        const previousPosition = Number.isFinite(state.pendingSeekTime) ? state.pendingSeekTime : previousTime;
        const preservePosition = Boolean(options.preservePosition);
        if (options.resetFallback !== false) state.audioFallbackTried = false;
        state.sourceType = audioInfo.type;
        state.audioMode = audioInfo.mode || (audioInfo.type === "generated" ? "generated" : "bundled");
        refs.audioSourceBadge.textContent = audioInfo.label;
        refs.audioPlayer.preload = (state.lesson.audio && state.lesson.audio.preload) || "none";
        refs.audioPlayer.src = audioInfo.src;
        refs.audioPlayer.dataset.sourceType = audioInfo.type;
        refs.audioPlayer.dataset.audioMode = state.audioMode;
        if (preservePosition) {
            state.pendingSeekTime = mapAudioTime(previousPosition, previousType, audioInfo.type);
        }
        rebuildTimingState();
        if (options.load) refs.audioPlayer.load();
    }

    function handleAudioError() {
        const generatedSrc = state.lesson && state.lesson.audio && state.lesson.audio.generatedSrc;
        if (state.sourceType !== "original" || !generatedSrc || state.audioFallbackTried) {
            refs.audioSourceBadge.textContent = "오디오 오류";
            return;
        }

        state.audioFallbackTried = true;
        applyAudioSource(
            { type: "generated", mode: "generated", src: generatedSrc, label: "생성 음성" },
            { preservePosition: true, resetFallback: false, load: true }
        );
        setLocalAudioStatus("원음을 불러오지 못해 생성 음성으로 전환했습니다.", "warn");
    }

    function resolveCutAvailability(lesson) {
        const availability = new Map();
        (lesson.cuts || []).forEach((cut) => {
            const hasCustom = Boolean(cut.src);
            availability.set(cut.id, hasCustom);
        });
        return availability;
    }

    async function probeAsset(src) {
        try {
            const response = await fetch(src, { method: "HEAD", cache: "no-store" });
            return response.ok;
        } catch {
            return false;
        }
    }

    function getExpectedLocalAudioFileName() {
        const trackNumber = Number(state.lesson && state.lesson.audio && state.lesson.audio.trackNumber);
        if (!Number.isInteger(trackNumber) || trackNumber <= 0) return "Seoul Univ_3B_Trk_00.mp3";
        return `Seoul Univ_3B_Trk_${String(trackNumber).padStart(2, "0")}.mp3`;
    }

    function mapAudioTime(currentTime, fromType, toType) {
        const safeTime = Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0;
        if (fromType === toType || !state.lesson || !Array.isArray(state.lesson.transcript)) return safeTime;

        const anchors = [{ from: 0, to: 0 }];
        state.lesson.transcript.forEach((line) => {
            const fromTiming = getTimingEntry(line, fromType);
            const toTiming = getTimingEntry(line, toType);
            anchors.push(
                { from: Number(fromTiming.start), to: Number(toTiming.start) },
                { from: Number(fromTiming.end), to: Number(toTiming.end) }
            );

            const fromChunks = Array.isArray(fromTiming.chunks) ? fromTiming.chunks : [];
            const toChunks = Array.isArray(toTiming.chunks) ? toTiming.chunks : [];
            const chunkCount = Math.min(fromChunks.length, toChunks.length);
            for (let index = 0; index < chunkCount; index += 1) {
                anchors.push(
                    { from: Number(fromChunks[index].start), to: Number(toChunks[index].start) },
                    { from: Number(fromChunks[index].end), to: Number(toChunks[index].end) }
                );
            }
        });

        const usable = anchors
            .filter((anchor) => Number.isFinite(anchor.from) && Number.isFinite(anchor.to))
            .sort((left, right) => left.from - right.from)
            .filter((anchor, index, list) => index === 0 || anchor.from > list[index - 1].from + 0.001);
        if (!usable.length) return safeTime;

        if (safeTime <= usable[0].from) return usable[0].to;
        for (let index = 1; index < usable.length; index += 1) {
            const previous = usable[index - 1];
            const next = usable[index];
            if (safeTime > next.from) continue;
            const sourceSpan = Math.max(next.from - previous.from, 0.001);
            const progress = Math.min(Math.max((safeTime - previous.from) / sourceSpan, 0), 1);
            return previous.to + ((next.to - previous.to) * progress);
        }

        const last = usable[usable.length - 1];
        return Math.max(0, last.to + (safeTime - last.from));
    }

    function openLocalAudioDb() {
        if (!state.localAudio.canPersist) return Promise.resolve(null);
        return new Promise((resolve) => {
            try {
                const request = window.indexedDB.open(LOCAL_AUDIO_DB_NAME, LOCAL_AUDIO_DB_VERSION);
                request.onerror = () => resolve(null);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(LOCAL_AUDIO_STORE_NAME)) {
                        db.createObjectStore(LOCAL_AUDIO_STORE_NAME, { keyPath: "key" });
                    }
                };
                request.onsuccess = () => resolve(request.result);
            } catch {
                resolve(null);
            }
        });
    }

    async function withLocalAudioStore(mode, callback) {
        const db = await openLocalAudioDb();
        if (!db) return null;
        return new Promise((resolve) => {
            try {
                const transaction = db.transaction(LOCAL_AUDIO_STORE_NAME, mode);
                const store = transaction.objectStore(LOCAL_AUDIO_STORE_NAME);
                const result = callback(store, resolve);
                transaction.onerror = () => resolve(null);
                transaction.oncomplete = () => {
                    if (result !== undefined) resolve(result);
                };
            } catch {
                resolve(null);
            }
        }).finally(() => db.close());
    }

    function loadSavedLocalAudioFolder() {
        return withLocalAudioStore("readonly", (store, resolve) => {
            const request = store.get(LOCAL_AUDIO_HANDLE_KEY);
            request.onerror = () => resolve(null);
            request.onsuccess = () => resolve(request.result || null);
        });
    }

    function saveLocalAudioFolder(handle) {
        if (!state.localAudio.canPersist || !handle) return Promise.resolve(false);
        return withLocalAudioStore("readwrite", (store, resolve) => {
            const request = store.put({
                key: LOCAL_AUDIO_HANDLE_KEY,
                handle,
                folderName: handle.name || "",
                savedAt: Date.now()
            });
            request.onerror = () => resolve(false);
            request.onsuccess = () => resolve(true);
        }).then(Boolean);
    }

    function deleteSavedLocalAudioFolder() {
        if (!state.localAudio.canPersist) return Promise.resolve(false);
        return withLocalAudioStore("readwrite", (store, resolve) => {
            const request = store.delete(LOCAL_AUDIO_HANDLE_KEY);
            request.onerror = () => resolve(false);
            request.onsuccess = () => resolve(true);
        }).then(Boolean);
    }

    async function getLocalAudioPermission(handle, requestAccess = false) {
        if (!handle) return "denied";
        const options = { mode: "read" };
        try {
            if (typeof handle.queryPermission === "function") {
                const current = await handle.queryPermission(options);
                if (current === "granted" || !requestAccess || typeof handle.requestPermission !== "function") {
                    return current;
                }
            }
            if (requestAccess && typeof handle.requestPermission === "function") {
                return await handle.requestPermission(options);
            }
        } catch {
            return "denied";
        }
        return "prompt";
    }

    function revokeLocalAudioObjectUrl() {
        if (!state.localAudio.objectUrl) return;
        URL.revokeObjectURL(state.localAudio.objectUrl);
        state.localAudio.objectUrl = null;
    }

    function setLocalAudioStatus(message, tone = "info") {
        if (!refs.localAudioStatus) return;
        refs.localAudioStatus.textContent = message;
        refs.localAudioStatus.dataset.tone = tone;
    }

    function updateLocalAudioControls() {
        if (!refs.connectLocalAudioBtn) return;
        const fileName = getExpectedLocalAudioFileName();
        if (refs.localAudioFileName) refs.localAudioFileName.textContent = fileName;

        if (!state.localAudio.supported) {
            refs.connectLocalAudioBtn.disabled = true;
            refs.disconnectLocalAudioBtn.hidden = true;
            setLocalAudioStatus("로컬 폴더 음원 재생은 데스크톱 Chrome/Edge의 HTTPS 페이지에서만 사용할 수 있습니다.", "warn");
            return;
        }

        refs.connectLocalAudioBtn.disabled = false;
        refs.connectLocalAudioBtn.textContent = state.localAudio.folderHandle
            ? (state.localAudio.permissionState === "granted" ? "폴더 다시 선택" : "권한 다시 연결")
            : "로컬 음원 폴더 연결";
        refs.disconnectLocalAudioBtn.hidden = !state.localAudio.folderHandle;
        if (!state.localAudio.folderHandle) {
            setLocalAudioStatus(`교사용 PC에서 ${fileName} 형식의 MP3가 들어 있는 폴더를 선택하세요.`);
        }
    }

    async function restoreBundledAudio(preservePosition = true) {
        revokeLocalAudioObjectUrl();
        const audioInfo = await resolveAudioSource(state.lesson);
        applyAudioSource(audioInfo, { preservePosition, load: true });
    }

    async function applyLocalAudioFolder(handle, requestAccess = false) {
        if (!handle) return false;
        const fileName = getExpectedLocalAudioFileName();
        state.localAudio.folderHandle = handle;
        state.localAudio.folderName = handle.name || "";
        state.localAudio.permissionState = await getLocalAudioPermission(handle, requestAccess);
        updateLocalAudioControls();

        if (state.localAudio.permissionState !== "granted") {
            setLocalAudioStatus("폴더 읽기 권한이 필요합니다. 권한을 다시 연결하거나 폴더를 다시 선택하세요.", "warn");
            return false;
        }

        try {
            const fileHandle = await handle.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            const objectUrl = URL.createObjectURL(file);
            revokeLocalAudioObjectUrl();
            state.localAudio.objectUrl = objectUrl;
            await saveLocalAudioFolder(handle);
            applyAudioSource(
                { type: "original", mode: "local", src: objectUrl, label: "로컬 원음" },
                { preservePosition: true, load: true }
            );
            setLocalAudioStatus(`연결된 폴더${state.localAudio.folderName ? ` (${state.localAudio.folderName})` : ""}에서 ${fileName} 파일을 사용합니다.`);
            updateLocalAudioControls();
            return true;
        } catch (error) {
            if (error && error.name === "NotAllowedError") {
                state.localAudio.permissionState = "prompt";
                setLocalAudioStatus("폴더 읽기 권한이 필요합니다. 권한을 다시 연결하거나 폴더를 다시 선택하세요.", "warn");
            } else {
                if (state.audioMode === "local") await restoreBundledAudio();
                setLocalAudioStatus(`연결된 폴더${state.localAudio.folderName ? ` (${state.localAudio.folderName})` : ""}에 ${fileName} 파일이 없습니다. 아래 원음을 사용하고, 원음을 불러오지 못하면 생성 음성으로 전환합니다.`, "warn");
            }
            updateLocalAudioControls();
            return false;
        }
    }

    async function connectLocalAudioFolder() {
        if (!state.localAudio.supported || typeof window.showDirectoryPicker !== "function") {
            setLocalAudioStatus("로컬 폴더 음원 재생은 데스크톱 Chrome/Edge의 HTTPS 페이지에서만 사용할 수 있습니다.", "warn");
            return;
        }

        try {
            if (state.localAudio.folderHandle && state.localAudio.permissionState !== "granted") {
                const connected = await applyLocalAudioFolder(state.localAudio.folderHandle, true);
                if (connected) return;
            }
            const handle = await window.showDirectoryPicker({
                id: "korean3b-teacher-audio",
                mode: "read"
            });
            await applyLocalAudioFolder(handle, true);
        } catch (error) {
            if (error && error.name === "AbortError") {
                setLocalAudioStatus("폴더 선택이 취소되었습니다.");
                return;
            }
            setLocalAudioStatus("로컬 음원 폴더를 연결하지 못했습니다.", "warn");
        }
    }

    async function restoreSavedLocalAudioFolder() {
        if (!state.localAudio.supported || !state.localAudio.canPersist) return;
        const saved = await loadSavedLocalAudioFolder();
        if (!saved || !saved.handle) return;
        state.localAudio.folderHandle = saved.handle;
        state.localAudio.folderName = saved.folderName || saved.handle.name || "";
        state.localAudio.permissionState = await getLocalAudioPermission(saved.handle, false);
        updateLocalAudioControls();
        if (state.localAudio.permissionState === "granted") {
            await applyLocalAudioFolder(saved.handle, false);
        } else {
            setLocalAudioStatus("폴더 읽기 권한이 필요합니다. 권한을 다시 연결하거나 폴더를 다시 선택하세요.", "warn");
        }
    }

    async function disconnectLocalAudioFolder() {
        state.localAudio.folderHandle = null;
        state.localAudio.folderName = "";
        state.localAudio.permissionState = state.localAudio.supported ? "prompt" : "unsupported";
        await deleteSavedLocalAudioFolder();
        await restoreBundledAudio();
        updateLocalAudioControls();
    }

    function cleanupResources() {
        disconnectThumbObserver();
        revokeLocalAudioObjectUrl();
    }

    function rebuildTimingState() {
        state.cutRanges = (state.lesson.cuts || []).map((cut) => getCutRange(cut));
        state.transcriptTimeline = (state.lesson.transcript || []).map((line) => buildLineTimeline(line));
    }

    function buildLineTimeline(line) {
        const timing = getTimingEntry(line);
        const start = Number(timing.start);
        const end = Number(timing.end);
        const chunks = Array.isArray(timing.chunks) && timing.chunks.length
            ? timing.chunks
            : [{ text: line.text, start, end }];
        const exactChunks = chunks.map((chunk) => ({
            text: String(chunk.text || ""),
            start: Number(chunk.start),
            end: Number(chunk.end)
        })).filter((chunk) => Number.isFinite(chunk.start) && Number.isFinite(chunk.end));

        return {
            speaker: line.speaker,
            text: line.text,
            start,
            end,
            chunks: exactChunks
        };
    }

    function getTimingEntry(line, sourceType = state.sourceType) {
        if (sourceType === "generated" && line.generated) {
            return line.generated;
        }
        return line;
    }

    function getCutRange(cut) {
        if (state.sourceType === "generated" && cut.generatedRange) {
            return {
                start: Number(cut.generatedRange.start) || 0,
                end: Number(cut.generatedRange.end) || 0
            };
        }
        if (cut.originalRange) {
            return {
                start: Number(cut.originalRange.start) || 0,
                end: Number(cut.originalRange.end) || 0
            };
        }

        const firstLine = state.lesson.transcript[cut.lineStart];
        const lastLine = state.lesson.transcript[cut.lineEnd];
        if (!firstLine || !lastLine) return { start: 0, end: 0 };
        const firstTiming = getTimingEntry(firstLine);
        const lastTiming = getTimingEntry(lastLine);
        return {
            start: Number(firstTiming.start) || 0,
            end: Number(lastTiming.end) || 0
        };
    }

    function renderThumbs() {
        refs.cutThumbs.innerHTML = state.lesson.cuts.map((cut, index) => {
            const visual = getCutVisual(cut);
            const accessibleCutLabel = `컷 ${index + 1}: ${cut.alt || state.lesson.fallbackImage.alt}`;
            return `
                <button class="lc-thumb" type="button" data-cut-index="${index}" aria-label="${escapeHtml(accessibleCutLabel)}">
                    <span class="lc-thumb__index">${index + 1}</span>
                    <span class="lc-thumb__media">
                        <img
                            data-src="${escapeHtml(visual.src)}"
                            alt="${escapeHtml(cut.alt || state.lesson.fallbackImage.alt)}"
                            class="${visual.isFallback ? "is-fallback" : ""}"
                            style="${getImageStyle(visual)}"
                            loading="lazy"
                            decoding="async"
                        >
                    </span>
                </button>
            `;
        }).join("");

        refs.cutThumbs.querySelectorAll(".lc-thumb").forEach((button) => {
            const image = button.querySelector("img");
            if (image) {
                image.addEventListener("error", () => {
                    const cutIndex = Number(button.dataset.cutIndex);
                    handleCutImageError(cutIndex, image);
                }, { once: true });
            }
            button.addEventListener("click", () => {
                const cutIndex = Number(button.dataset.cutIndex);
                const range = state.cutRanges[cutIndex];
                if (!range) return;
                seekAudio(range.start + 0.02);
            });
        });

        ensureThumbImageLoaded(0);
        ensureThumbImageLoaded(1);
        setupThumbLazyLoading();
    }

    function setupThumbLazyLoading() {
        disconnectThumbObserver();
        const images = refs.cutThumbs.querySelectorAll("img[data-src]");
        if (!("IntersectionObserver" in window)) {
            images.forEach((image) => loadThumbImage(image));
            return;
        }

        state.thumbObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                loadThumbImage(entry.target);
                state.thumbObserver.unobserve(entry.target);
            });
        }, {
            root: refs.cutThumbs,
            rootMargin: "0px 140px"
        });
        images.forEach((image) => state.thumbObserver.observe(image));
    }

    function disconnectThumbObserver() {
        if (!state.thumbObserver) return;
        state.thumbObserver.disconnect();
        state.thumbObserver = null;
    }

    function loadThumbImage(image) {
        if (!image || image.getAttribute("src") || !image.dataset.src) return;
        image.src = image.dataset.src;
    }

    function ensureThumbImageLoaded(cutIndex) {
        if (!Number.isInteger(cutIndex) || cutIndex < 0 || cutIndex >= state.lesson.cuts.length) return;
        const cut = state.lesson.cuts[cutIndex];
        const image = refs.cutThumbs.querySelector(`.lc-thumb[data-cut-index="${cutIndex}"] img`);
        if (!cut || !image) return;
        const visual = getCutVisual(cut);
        image.dataset.src = visual.src;
        image.alt = cut.alt || state.lesson.fallbackImage.alt;
        image.classList.toggle("is-fallback", visual.isFallback);
        image.style.cssText = getImageStyle(visual);
        loadThumbImage(image);
    }

    function renderTranscript() {
        refs.transcriptLines.innerHTML = state.transcriptTimeline.map((line, lineIndex) => `
            <article class="lc-line" id="cuttoon-line-${lineIndex}" data-line-index="${lineIndex}">
                <div class="lc-line__speaker">${escapeHtml(line.speaker)}</div>
                <div class="lc-line__text">
                    ${line.chunks.map((chunk, chunkIndex) => `
                        <span class="lc-chunk" id="cuttoon-chunk-${lineIndex}-${chunkIndex}" data-chunk-index="${chunkIndex}">
                            ${escapeHtml(chunk.text)}
                        </span>
                    `).join(" ")}
                </div>
            </article>
        `).join("");
    }

    function syncToAudio(force = false) {
        const currentTime = Number.isFinite(refs.audioPlayer.currentTime) ? refs.audioPlayer.currentTime : 0;
        updateCutState(currentTime, force);
        updateTranscriptState(currentTime, force);
    }

    function seekAudio(targetTime) {
        const safeTime = clampAudioTime(targetTime);
        state.pendingSeekTime = safeTime;
        updateCutState(safeTime, true);
        updateTranscriptState(safeTime, true);

        if (refs.audioPlayer.readyState < 1) {
            refs.audioPlayer.load();
            return;
        }

        applyPendingSeek();
    }

    function applyPendingSeek() {
        if (!Number.isFinite(state.pendingSeekTime)) return;
        const targetTime = clampAudioTime(state.pendingSeekTime);

        try {
            refs.audioPlayer.currentTime = targetTime;
            state.pendingSeekTime = null;
            requestAnimationFrame(() => syncToAudio(true));
        } catch {
            state.pendingSeekTime = targetTime;
        }
    }

    function clampAudioTime(targetTime) {
        const rawTime = Number.isFinite(targetTime) ? targetTime : 0;
        const duration = Number.isFinite(refs.audioPlayer.duration) ? refs.audioPlayer.duration : 0;
        if (duration > 0) {
            return Math.min(Math.max(rawTime, 0), Math.max(duration - 0.05, 0));
        }
        return Math.max(rawTime, 0);
    }

    function updateCutState(currentTime, force = false) {
        const nextIndex = getActiveCutIndex(currentTime);
        if (nextIndex === state.activeCutIndex && !force) return;

        const previousButton = refs.cutThumbs.querySelector(`.lc-thumb[data-cut-index="${state.activeCutIndex}"]`);
        if (previousButton) {
            previousButton.classList.remove("is-active");
            previousButton.removeAttribute("aria-current");
        }

        state.activeCutIndex = nextIndex;
        const nextButton = refs.cutThumbs.querySelector(`.lc-thumb[data-cut-index="${nextIndex}"]`);
        if (nextButton) {
            nextButton.classList.add("is-active");
            nextButton.setAttribute("aria-current", "true");
        }
        ensureThumbImageLoaded(nextIndex - 1);
        ensureThumbImageLoaded(nextIndex);
        ensureThumbImageLoaded(nextIndex + 1);

        const cut = state.lesson.cuts[nextIndex];
        const visual = getCutVisual(cut);
        refs.panelImage.src = visual.src;
        refs.panelImage.alt = cut.alt || state.lesson.fallbackImage.alt;
        refs.panelImage.classList.toggle("is-fallback", visual.isFallback);
        refs.panelImage.style.cssText = getImageStyle(visual);
    }

    function handlePanelImageError() {
        if (!Number.isInteger(state.activeCutIndex)) return;
        const cut = state.lesson.cuts[state.activeCutIndex];
        if (!cut) return;
        state.cutAvailability.set(cut.id, false);
        updateCutState(Number.isFinite(refs.audioPlayer.currentTime) ? refs.audioPlayer.currentTime : 0, true);
        refreshThumbImage(state.activeCutIndex);
    }

    function handleCutImageError(cutIndex, image) {
        const cut = state.lesson.cuts[cutIndex];
        if (!cut) return;
        state.cutAvailability.set(cut.id, false);
        applyFallbackVisualToImage(image, cut);
        if (cutIndex === state.activeCutIndex) {
            updateCutState(Number.isFinite(refs.audioPlayer.currentTime) ? refs.audioPlayer.currentTime : 0, true);
        }
    }

    function refreshThumbImage(cutIndex) {
        const cut = state.lesson.cuts[cutIndex];
        const image = refs.cutThumbs.querySelector(`.lc-thumb[data-cut-index="${cutIndex}"] img`);
        if (!cut || !image) return;
        applyFallbackVisualToImage(image, cut);
    }

    function applyFallbackVisualToImage(image, cut) {
        const visual = getCutVisual(cut);
        image.dataset.src = visual.src;
        image.src = visual.src;
        image.alt = cut.alt || state.lesson.fallbackImage.alt;
        image.classList.toggle("is-fallback", visual.isFallback);
        image.style.cssText = getImageStyle(visual);
    }

    function updateTranscriptState(currentTime, force = false) {
        const target = getActiveTranscriptTarget(currentTime);
        const nextLineIndex = target ? target.lineIndex : null;
        const nextChunkIndex = target ? target.chunkIndex : null;

        if (nextLineIndex === state.activeLineIndex && nextChunkIndex === state.activeChunkIndex && !force) return;

        if (Number.isInteger(state.activeLineIndex)) {
            const previousLine = document.getElementById(`cuttoon-line-${state.activeLineIndex}`);
            if (previousLine) previousLine.classList.remove("is-active");
        }
        if (Number.isInteger(state.activeLineIndex) && Number.isInteger(state.activeChunkIndex)) {
            const previousChunk = document.getElementById(`cuttoon-chunk-${state.activeLineIndex}-${state.activeChunkIndex}`);
            if (previousChunk) previousChunk.classList.remove("is-active");
        }

        state.activeLineIndex = nextLineIndex;
        state.activeChunkIndex = nextChunkIndex;

        if (Number.isInteger(nextLineIndex)) {
            const nextLine = document.getElementById(`cuttoon-line-${nextLineIndex}`);
            if (nextLine) nextLine.classList.add("is-active");
            if (state.transcriptOpen) {
                scrollLineIntoView(nextLineIndex);
            }
        }
        if (Number.isInteger(nextLineIndex) && Number.isInteger(nextChunkIndex)) {
            const nextChunk = document.getElementById(`cuttoon-chunk-${nextLineIndex}-${nextChunkIndex}`);
            if (nextChunk) nextChunk.classList.add("is-active");
        }
    }

    function getActiveCutIndex(currentTime) {
        if (!state.cutRanges.length) return 0;

        let latestStarted = 0;
        for (let index = 0; index < state.cutRanges.length; index += 1) {
            const range = state.cutRanges[index];
            if (currentTime >= Math.max(0, range.start - CUT_TOLERANCE)) {
                latestStarted = index;
            } else {
                break;
            }
            if (currentTime >= Math.max(0, range.start - CUT_TOLERANCE) && currentTime < range.end + CUT_TOLERANCE) {
                return index;
            }
        }

        if (currentTime < state.cutRanges[0].start) return 0;
        return latestStarted;
    }

    function getActiveTranscriptTarget(currentTime) {
        for (let lineIndex = 0; lineIndex < state.transcriptTimeline.length; lineIndex += 1) {
            const line = state.transcriptTimeline[lineIndex];
            if (currentTime < Math.max(0, line.start - CUT_TOLERANCE) || currentTime >= line.end + CUT_TOLERANCE) continue;

            let chunkIndex = null;
            for (let index = 0; index < line.chunks.length; index += 1) {
                const chunk = line.chunks[index];
                if (currentTime >= Math.max(0, chunk.start - CHUNK_TOLERANCE) && currentTime < chunk.end + CHUNK_TOLERANCE) {
                    chunkIndex = index;
                    break;
                }
            }
            return { lineIndex, chunkIndex };
        }

        return null;
    }

    function scrollLineIntoView(lineIndex) {
        const line = document.getElementById(`cuttoon-line-${lineIndex}`);
        if (!line) return;
        const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        line.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }

    function getCutVisual(cut) {
        const hasCustom = state.cutAvailability.get(cut.id) !== false && Boolean(cut.src);
        if (hasCustom) {
            return {
                src: cut.src,
                isFallback: false,
                focus: null
            };
        }
        return {
            src: state.lesson.fallbackImage.src,
            isFallback: true,
            focus: cut.fallbackFocus || null
        };
    }

    function getImageStyle(visual) {
        if (!visual.isFallback || !visual.focus) return "";
        const focusX = visual.focus.x || "50%";
        const focusY = visual.focus.y || "50%";
        const scale = Number.isFinite(visual.focus.scale) ? visual.focus.scale : 1.12;
        return `--lc-panel-focus-x:${focusX};--lc-panel-focus-y:${focusY};--lc-panel-scale:${scale};--lc-thumb-focus-x:${focusX};--lc-thumb-focus-y:${focusY};--lc-thumb-scale:${Math.max(1, scale - 0.06)};`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
