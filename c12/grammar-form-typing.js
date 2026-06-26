(function () {
    "use strict";

    const config = window.C12_GRAMMAR_FORM_TYPING_PAGE;
    if (!config || !Array.isArray(config.items)) return;

    const LEVELS = [
        { key: "guide", label: "가이드", note: "규칙을 보고 씁니다." },
        { key: "partial", label: "부분 가이드", note: "힌트만 보고 씁니다." },
        { key: "independent", label: "독립", note: "직접 만들어 씁니다." }
    ];

    const KEY_LAYOUT = [
        { code: "KeyQ", latin: "Q", hangul: "ㅂ", shiftHangul: "ㅃ", finger: "left-pinky", row: "top" },
        { code: "KeyW", latin: "W", hangul: "ㅈ", shiftHangul: "ㅉ", finger: "left-ring", row: "top" },
        { code: "KeyE", latin: "E", hangul: "ㄷ", shiftHangul: "ㄸ", finger: "left-middle", row: "top" },
        { code: "KeyR", latin: "R", hangul: "ㄱ", shiftHangul: "ㄲ", finger: "left-index", row: "top" },
        { code: "KeyT", latin: "T", hangul: "ㅅ", shiftHangul: "ㅆ", finger: "left-index", row: "top" },
        { code: "KeyY", latin: "Y", hangul: "ㅛ", shiftHangul: "", finger: "right-index", row: "top" },
        { code: "KeyU", latin: "U", hangul: "ㅕ", shiftHangul: "", finger: "right-index", row: "top" },
        { code: "KeyI", latin: "I", hangul: "ㅑ", shiftHangul: "", finger: "right-middle", row: "top" },
        { code: "KeyO", latin: "O", hangul: "ㅐ", shiftHangul: "ㅒ", finger: "right-ring", row: "top" },
        { code: "KeyP", latin: "P", hangul: "ㅔ", shiftHangul: "ㅖ", finger: "right-pinky", row: "top" },
        { code: "KeyA", latin: "A", hangul: "ㅁ", shiftHangul: "", finger: "left-pinky", row: "home" },
        { code: "KeyS", latin: "S", hangul: "ㄴ", shiftHangul: "", finger: "left-ring", row: "home" },
        { code: "KeyD", latin: "D", hangul: "ㅇ", shiftHangul: "", finger: "left-middle", row: "home" },
        { code: "KeyF", latin: "F", hangul: "ㄹ", shiftHangul: "", finger: "left-index", row: "home" },
        { code: "KeyG", latin: "G", hangul: "ㅎ", shiftHangul: "", finger: "left-index", row: "home" },
        { code: "KeyH", latin: "H", hangul: "ㅗ", shiftHangul: "", finger: "right-index", row: "home" },
        { code: "KeyJ", latin: "J", hangul: "ㅓ", shiftHangul: "", finger: "right-index", row: "home" },
        { code: "KeyK", latin: "K", hangul: "ㅏ", shiftHangul: "", finger: "right-middle", row: "home" },
        { code: "KeyL", latin: "L", hangul: "ㅣ", shiftHangul: "", finger: "right-ring", row: "home" },
        { code: "KeyZ", latin: "Z", hangul: "ㅋ", shiftHangul: "", finger: "left-pinky", row: "bottom" },
        { code: "KeyX", latin: "X", hangul: "ㅌ", shiftHangul: "", finger: "left-ring", row: "bottom" },
        { code: "KeyC", latin: "C", hangul: "ㅊ", shiftHangul: "", finger: "left-middle", row: "bottom" },
        { code: "KeyV", latin: "V", hangul: "ㅍ", shiftHangul: "", finger: "left-index", row: "bottom" },
        { code: "KeyB", latin: "B", hangul: "ㅠ", shiftHangul: "", finger: "left-index", row: "bottom" },
        { code: "KeyN", latin: "N", hangul: "ㅜ", shiftHangul: "", finger: "right-index", row: "bottom" },
        { code: "KeyM", latin: "M", hangul: "ㅡ", shiftHangul: "", finger: "right-index", row: "bottom" }
    ];

    const ROWS = {
        top: KEY_LAYOUT.filter((key) => key.row === "top"),
        home: KEY_LAYOUT.filter((key) => key.row === "home"),
        bottom: KEY_LAYOUT.filter((key) => key.row === "bottom")
    };

    const HOME_CODES = new Set(["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"]);
    const FINGER_LABELS = {
        "left-pinky": "왼손 새끼",
        "left-ring": "왼손 약지",
        "left-middle": "왼손 중지",
        "left-index": "왼손 검지",
        "right-index": "오른손 검지",
        "right-middle": "오른손 중지",
        "right-ring": "오른손 약지",
        "right-pinky": "오른손 새끼"
    };

    const INITIALS = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const MEDIALS = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    const FINALS = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const COMPOUND_JAMO = {
        "ㅘ": ["ㅗ", "ㅏ"],
        "ㅙ": ["ㅗ", "ㅐ"],
        "ㅚ": ["ㅗ", "ㅣ"],
        "ㅝ": ["ㅜ", "ㅓ"],
        "ㅞ": ["ㅜ", "ㅔ"],
        "ㅟ": ["ㅜ", "ㅣ"],
        "ㅢ": ["ㅡ", "ㅣ"],
        "ㄳ": ["ㄱ", "ㅅ"],
        "ㄵ": ["ㄴ", "ㅈ"],
        "ㄶ": ["ㄴ", "ㅎ"],
        "ㄺ": ["ㄹ", "ㄱ"],
        "ㄻ": ["ㄹ", "ㅁ"],
        "ㄼ": ["ㄹ", "ㅂ"],
        "ㄽ": ["ㄹ", "ㅅ"],
        "ㄾ": ["ㄹ", "ㅌ"],
        "ㄿ": ["ㄹ", "ㅍ"],
        "ㅀ": ["ㄹ", "ㅎ"],
        "ㅄ": ["ㅂ", "ㅅ"]
    };

    const sentenceItems = Array.isArray(config.sentenceItems) ? config.sentenceItems : [];
    const hasSentenceStage = sentenceItems.length > 0;
    const STAGES = [
        { key: "form", label: "활용형", note: "빈칸에 맞는 활용형만 입력합니다.", emptyMessage: "활용형을 입력하세요." }
    ].concat(hasSentenceStage ? [
        { key: "sentence", label: "문장", note: "문장 전체를 보고 그대로 입력합니다.", emptyMessage: "문장을 입력하세요." }
    ] : []);

    const DATA = {
        levels: LEVELS,
        grammar: config.grammar,
        items: config.items,
        sentenceItems,
        stages: STAGES
    };

    window.__C12_GRAMMAR_FORM_TYPING_DATA__ = DATA;

    const refs = {
        progressText: document.getElementById("progressText"),
        scoreText: document.getElementById("scoreText"),
        progressBar: document.getElementById("progressBar"),
        levelList: document.getElementById("levelList"),
        stageStrip: document.getElementById("stageStrip"),
        taskBody: document.getElementById("taskBody"),
        finishCard: document.getElementById("finishCard"),
        levelBadge: document.getElementById("levelBadge"),
        grammarBadge: document.getElementById("grammarBadge"),
        promptText: document.getElementById("promptText"),
        cueText: document.getElementById("cueText"),
        guideText: document.getElementById("guideText"),
        targetPreview: document.getElementById("targetPreview"),
        answerInput: document.getElementById("answerInput"),
        checkBtn: document.getElementById("checkBtn"),
        feedback: document.getElementById("feedback"),
        nextBtn: document.getElementById("nextBtn"),
        keyboardAid: document.getElementById("keyboardAid"),
        keyboardBoard: document.getElementById("keyboardBoard"),
        nextJamo: document.getElementById("nextJamo"),
        nextKeyLabel: document.getElementById("nextKeyLabel")
    };

    const state = {
        grammar: config.grammar.key,
        stage: "form",
        index: 0,
        score: 0,
        stageScores: { form: 0, sentence: 0 },
        answered: false,
        complete: false,
        composing: false,
        advanceTimer: 0,
        logs: [],
        stageLogs: { form: [], sentence: [] }
    };

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalize(value) {
        return String(value || "")
            .normalize("NFC")
            .toLowerCase()
            .replace(/[\s.,!?~`"'“”‘’()[\]{}<>:;·…/\\|-]/g, "");
    }

    function normalizeExact(value) {
        return String(value || "")
            .normalize("NFC")
            .trim()
            .replace(/\s+/g, " ");
    }

    function containsAsciiLetters(value) {
        return /[A-Za-z]/.test(String(value || ""));
    }

    function activeStageConfig() {
        return STAGES.find((stage) => stage.key === state.stage) || STAGES[0];
    }

    function activeItems() {
        return state.stage === "sentence" ? DATA.sentenceItems : DATA.items;
    }

    function activeLogs() {
        return state.stageLogs[state.stage] || state.stageLogs.form;
    }

    function syncActiveScore() {
        state.score = state.stageScores[state.stage] || 0;
        state.logs = activeLogs();
    }

    function currentItem() {
        return activeItems()[state.index];
    }

    function levelFor(item) {
        return LEVELS.find((level) => level.key === item.level) || LEVELS[0];
    }

    function levelProgress(levelKey) {
        const levelItems = DATA.items.filter((item) => item.level === levelKey);
        const completedIds = new Set(state.stageLogs.form.map((log) => log.id));
        return levelItems.filter((item) => completedIds.has(item.id)).length;
    }

    function stageDoneCount(stageKey) {
        return (state.stageLogs[stageKey] || []).length;
    }

    function renderStageStrip() {
        if (!refs.stageStrip || !hasSentenceStage) return;
        refs.stageStrip.innerHTML = STAGES.map((stage, index) => {
            const total = stage.key === "form" ? DATA.items.length : DATA.sentenceItems.length;
            const done = Math.min(stageDoneCount(stage.key), total);
            const classes = ["stage-step"];
            if (stage.key === state.stage) classes.push("is-active");
            if (total && done >= total) classes.push("is-done");
            return `
                <div class="${classes.join(" ")}">
                    <span>${index + 1}</span>
                    <strong>${esc(stage.label)}</strong>
                    <small>${done} / ${total}</small>
                </div>
            `;
        }).join("");
    }

    function renderLevelList() {
        const item = currentItem();
        if (!refs.levelList) return;

        if (!hasSentenceStage) {
            refs.levelList.innerHTML = LEVELS.map((level, index) => {
                const done = levelProgress(level.key);
                const total = DATA.items.filter((dataItem) => dataItem.level === level.key).length;
                const active = item && item.level === level.key;
                const className = "level-item" + (active ? " is-active" : "") + (total && done >= total ? " is-done" : "");
                return `
                    <div class="${className}">
                        <span class="level-count">${index + 1}</span>
                        <div class="level-copy">
                            <strong>${esc(level.label)} ${done} / ${total}</strong>
                            <span>${esc(level.note)}</span>
                        </div>
                    </div>
                `;
            }).join("");
            return;
        }

        if (state.stage === "sentence") {
            const total = DATA.sentenceItems.length;
            const done = stageDoneCount("sentence");
            refs.levelList.innerHTML = `
                <div class="level-item is-active">
                    <span class="level-count">2</span>
                    <div class="level-copy">
                        <strong>문장 입력 ${done} / ${total}</strong>
                        <span>문장부호와 띄어쓰기까지 따라 입력합니다.</span>
                    </div>
                </div>
                <div class="level-item ${stageDoneCount("form") >= DATA.items.length ? "is-done" : ""}">
                    <span class="level-count">1</span>
                    <div class="level-copy">
                        <strong>활용형 ${stageDoneCount("form")} / ${DATA.items.length}</strong>
                        <span>1단계 활용형 입력 기록입니다.</span>
                    </div>
                </div>
            `;
            return;
        }

        refs.levelList.innerHTML = LEVELS.map((level, index) => {
            const done = levelProgress(level.key);
            const total = DATA.items.filter((dataItem) => dataItem.level === level.key).length;
            const active = item && item.level === level.key;
            const className = "level-item" + (active ? " is-active" : "") + (total && done >= total ? " is-done" : "");
            return `
                <div class="${className}">
                    <span class="level-count">${index + 1}</span>
                    <div class="level-copy">
                        <strong>${esc(level.label)} ${done} / ${total}</strong>
                        <span>${esc(level.note)}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderProgress() {
        const total = activeItems().length || 1;
        const answeredCount = state.complete ? total : state.index;
        syncActiveScore();
        refs.progressText.textContent = state.complete ? `${total} / ${total}` : `${state.index + 1} / ${total}`;
        refs.scoreText.textContent = String(state.score);
        refs.progressBar.style.width = `${Math.round((answeredCount / total) * 100)}%`;
        renderStageStrip();
        renderLevelList();
    }

    function targetForItem(item) {
        return item && item.answer ? item.answer : "";
    }

    function setTargetPreviewHidden(hidden) {
        if (!refs.targetPreview) return;
        refs.targetPreview.classList.toggle("hidden", hidden);
    }

    function renderTargetPreview() {
        if (!refs.targetPreview) return;
        const item = currentItem();
        if (!item || state.stage !== "sentence") {
            setTargetPreviewHidden(true);
            refs.targetPreview.innerHTML = "";
            return;
        }

        const target = targetForItem(item);
        const user = refs.answerInput.value || "";
        const info = nextInputInfo(target, user);
        const userChars = Array.from(user);
        refs.targetPreview.innerHTML = `
            <span class="target-preview-label">목표 문장</span>
            <strong aria-label="${esc(target)}">
                ${Array.from(target).map((char, index) => {
                    const classes = ["target-char"];
                    if (userChars[index] === char) classes.push("is-done");
                    if (index === info.charIndex) classes.push("is-next");
                    if (userChars[index] && userChars[index] !== char) classes.push("is-wrong");
                    if (/[\s]/.test(char)) return `<span class="${classes.join(" ")} is-space" data-char-index="${index}"> </span>`;
                    return `<span class="${classes.join(" ")}" data-char-index="${index}">${esc(char)}</span>`;
                }).join("")}
            </strong>
        `;
        setTargetPreviewHidden(false);
    }

    function renderTask() {
        const item = currentItem();
        if (!item) return;
        const stage = activeStageConfig();
        const level = state.stage === "sentence" ? { label: "문장 입력" } : levelFor(item);

        clearAutoAdvance();
        refs.taskBody.classList.remove("hidden");
        refs.finishCard.classList.add("hidden");
        refs.levelBadge.textContent = level.label;
        refs.grammarBadge.textContent = `${config.grammar.label} · ${config.grammar.shortLabel}`;
        refs.promptText.textContent = item.prompt;
        refs.cueText.textContent = item.cue;
        refs.guideText.textContent = item.guide || stage.note;
        refs.answerInput.value = "";
        refs.answerInput.disabled = false;
        refs.checkBtn.disabled = false;
        refs.feedback.className = "feedback hidden";
        refs.feedback.innerHTML = "";
        refs.nextBtn.classList.add("hidden");
        refs.nextBtn.textContent = state.index >= activeItems().length - 1
            ? (state.stage === "form" && hasSentenceStage ? "문장 입력" : "완료")
            : "다음";
        state.answered = false;
        state.complete = false;
        renderProgress();
        renderTargetPreview();
        updateTypingAid();
        window.setTimeout(() => refs.answerInput.focus(), 0);
    }

    function showFeedback(kind, html) {
        refs.feedback.className = `feedback ${kind}`;
        refs.feedback.innerHTML = html;
    }

    function clearAutoAdvance() {
        if (!state.advanceTimer) return;
        window.clearTimeout(state.advanceTimer);
        state.advanceTimer = 0;
    }

    function scheduleAutoAdvance() {
        clearAutoAdvance();
        state.advanceTimer = window.setTimeout(() => {
            state.advanceTimer = 0;
            nextItem();
        }, 1500);
    }

    function itemAcceptsAnswer(item, user) {
        const accepted = [item.answer].concat(item.accepted || []);
        if (item.strict) {
            return accepted.some((answer) => normalizeExact(answer) === normalizeExact(user));
        }
        return accepted.some((answer) => normalize(answer) === normalize(user));
    }

    function answerCurrent() {
        if (state.answered || state.complete) return;
        const item = currentItem();
        const user = refs.answerInput.value;
        const stage = activeStageConfig();

        if (containsAsciiLetters(user)) {
            showFeedback("warn", "한/영 키를 확인하세요.");
            refs.answerInput.focus();
            updateTypingAid();
            return;
        }

        if (!String(user || "").trim()) {
            showFeedback("warn", stage.emptyMessage);
            refs.answerInput.focus();
            updateTypingAid();
            return;
        }

        const ok = itemAcceptsAnswer(item, user);
        state.answered = true;
        if (ok) state.stageScores[state.stage] += 1;
        activeLogs().push({
            id: item.id,
            grammar: item.grammar,
            stage: state.stage,
            ok,
            user,
            correct: item.answer,
            rule: item.rule
        });

        refs.answerInput.disabled = true;
        refs.checkBtn.disabled = true;
        refs.nextBtn.classList.remove("hidden");
        renderProgress();
        updateTypingAid();

        if (ok) {
            showFeedback("ok", `맞습니다.<p>${state.index >= activeItems().length - 1 ? "다음 단계로 이동합니다." : "다음 문항으로 이동합니다."}</p>`);
            scheduleAutoAdvance();
            return;
        }

        const detail = item.strict ? "문장부호와 띄어쓰기도 함께 확인하세요." : item.rule;
        showFeedback("bad", `정답: <strong>${esc(item.answer)}</strong><p>${esc(detail)}</p>`);
    }

    function renderReviewItems(logs) {
        const wrong = logs.filter((log) => !log.ok);
        if (!wrong.length) return '<div class="review-item">다시 볼 문항이 없습니다.</div>';
        return wrong.map((log) => `
            <div class="review-item">
                <strong>정답:</strong> ${esc(log.correct)}<br />
                <strong>내 답:</strong> ${esc(log.user || "(비어 있음)")}<br />
                ${esc(log.rule)}
            </div>
        `).join("");
    }

    function renderLegacyFinish() {
        const total = DATA.items.length;
        const logs = state.stageLogs.form;
        clearAutoAdvance();
        refs.taskBody.classList.add("hidden");
        refs.finishCard.classList.remove("hidden");
        refs.finishCard.innerHTML = `
            <h2>${esc(config.grammar.label)} 완료</h2>
            <div class="finish-score">
                <strong>${state.stageScores.form} / ${total}</strong>
            </div>
            <div class="review-list">
                ${renderReviewItems(logs)}
            </div>
            <div class="action-row">
                <button id="restartBtn" class="btn secondary" type="button">다시 하기</button>
                <a class="btn primary" href="${esc(config.grammar.siblingHref)}">${esc(config.grammar.siblingLabel)}</a>
            </div>
        `;
        state.complete = true;
        renderProgress();
        document.getElementById("restartBtn").addEventListener("click", resetActivity);
    }

    function renderStageTransition() {
        clearAutoAdvance();
        refs.taskBody.classList.add("hidden");
        refs.finishCard.classList.remove("hidden");
        refs.finishCard.innerHTML = `
            <h2>활용형 입력 완료</h2>
            <div class="finish-score">
                <span>1단계 점수</span>
                <strong>${state.stageScores.form} / ${DATA.items.length}</strong>
            </div>
            <div class="review-list">
                ${renderReviewItems(state.stageLogs.form)}
            </div>
            <div class="action-row">
                <button id="restartFormBtn" class="btn secondary" type="button">활용형 다시</button>
                <button id="startSentenceBtn" class="btn primary" type="button">문장 입력 시작</button>
            </div>
        `;
        state.complete = true;
        renderProgress();
        document.getElementById("restartFormBtn").addEventListener("click", resetFormStage);
        document.getElementById("startSentenceBtn").addEventListener("click", startSentenceStage);
    }

    function renderFinalFinish() {
        clearAutoAdvance();
        refs.taskBody.classList.add("hidden");
        refs.finishCard.classList.remove("hidden");
        refs.finishCard.innerHTML = `
            <h2>${esc(config.grammar.label)} 타이핑 완료</h2>
            <div class="finish-score-grid">
                <div class="finish-score">
                    <span>활용형</span>
                    <strong>${state.stageScores.form} / ${DATA.items.length}</strong>
                </div>
                <div class="finish-score">
                    <span>문장</span>
                    <strong>${state.stageScores.sentence} / ${DATA.sentenceItems.length}</strong>
                </div>
            </div>
            <div class="review-list">
                ${renderReviewItems(state.stageLogs.form.concat(state.stageLogs.sentence))}
            </div>
            <div class="action-row">
                <button id="restartFormBtn" class="btn secondary" type="button">활용형 다시</button>
                <button id="restartSentenceBtn" class="btn secondary" type="button">문장 다시</button>
                <a class="btn primary" href="${esc(config.grammar.siblingHref)}">${esc(config.grammar.siblingLabel || "다른 문법으로 이동")}</a>
            </div>
        `;
        state.complete = true;
        renderProgress();
        document.getElementById("restartFormBtn").addEventListener("click", resetFormStage);
        document.getElementById("restartSentenceBtn").addEventListener("click", resetSentenceStage);
    }

    function renderFinish() {
        if (!hasSentenceStage) {
            renderLegacyFinish();
            return;
        }
        if (state.stage === "form") {
            renderStageTransition();
            return;
        }
        renderFinalFinish();
    }

    function nextItem() {
        if (!state.answered && !state.complete) return;
        clearAutoAdvance();
        if (state.index >= activeItems().length - 1) {
            renderFinish();
            return;
        }
        state.index += 1;
        renderTask();
    }

    function resetActivity() {
        state.stage = "form";
        state.index = 0;
        state.stageScores = { form: 0, sentence: 0 };
        state.logs = [];
        state.stageLogs = { form: [], sentence: [] };
        state.answered = false;
        state.complete = false;
        clearAutoAdvance();
        syncActiveScore();
        renderTask();
    }

    function resetFormStage() {
        state.stage = "form";
        state.index = 0;
        state.stageScores.form = 0;
        state.stageLogs.form = [];
        state.answered = false;
        state.complete = false;
        clearAutoAdvance();
        syncActiveScore();
        renderTask();
    }

    function startSentenceStage() {
        state.stage = "sentence";
        state.index = 0;
        state.answered = false;
        state.complete = false;
        clearAutoAdvance();
        syncActiveScore();
        renderTask();
    }

    function resetSentenceStage() {
        state.stage = "sentence";
        state.index = 0;
        state.stageScores.sentence = 0;
        state.stageLogs.sentence = [];
        state.answered = false;
        state.complete = false;
        clearAutoAdvance();
        syncActiveScore();
        renderTask();
    }

    function decomposeJamo(jamo) {
        return COMPOUND_JAMO[jamo] || (jamo ? [jamo] : []);
    }

    function decomposeChar(char) {
        const code = char.charCodeAt(0);
        if (code < 0xac00 || code > 0xd7a3) {
            return decomposeJamo(char);
        }
        const offset = code - 0xac00;
        const initial = Math.floor(offset / 588);
        const medial = Math.floor((offset % 588) / 28);
        const final = offset % 28;
        return []
            .concat(decomposeJamo(INITIALS[initial]))
            .concat(decomposeJamo(MEDIALS[medial]))
            .concat(decomposeJamo(FINALS[final]));
    }

    function keyForJamo(jamo) {
        return KEY_LAYOUT.find((key) => key.hangul === jamo || key.shiftHangul === jamo) || null;
    }

    function nextInputInfo(target, user) {
        const targetChars = Array.from(target || "");
        const userChars = Array.from(user || "");
        const max = Math.max(targetChars.length, userChars.length);

        for (let index = 0; index < max; index += 1) {
            const targetChar = targetChars[index] || "";
            const userChar = userChars[index] || "";
            if (!targetChar) {
                return { charIndex: targetChars.length, char: "", jamo: "", key: null };
            }
            if (targetChar === userChar) continue;

            const targetJamos = decomposeChar(targetChar);
            const userJamos = decomposeChar(userChar);
            let jamoIndex = 0;
            while (jamoIndex < targetJamos.length && targetJamos[jamoIndex] === userJamos[jamoIndex]) {
                jamoIndex += 1;
            }
            const nextJamo = targetJamos[jamoIndex] || targetJamos[0] || "";
            return {
                charIndex: index,
                char: targetChar,
                jamo: nextJamo,
                key: keyForJamo(nextJamo)
            };
        }

        return { charIndex: targetChars.length, char: "", jamo: "", key: null };
    }

    function renderKeyboard() {
        if (!refs.keyboardBoard) return;
        refs.keyboardBoard.innerHTML = "";
        Object.entries(ROWS).forEach(([rowName, keys]) => {
            const row = document.createElement("div");
            row.className = `keyboard-row keyboard-row--${rowName}`;
            row.style.setProperty("--key-count", String(keys.length));

            keys.forEach((key) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = `key-button finger-${key.finger}`;
                button.dataset.code = key.code;
                button.dataset.hangul = key.hangul;
                button.setAttribute("aria-label", `${key.latin} 자리 ${key.hangul}`);
                if (HOME_CODES.has(key.code)) button.classList.add("is-home");
                button.innerHTML = `
                    <span class="key-latin">${key.latin}</span>
                    <span class="key-hangul">${key.hangul}</span>
                    <span class="key-shift">${key.shiftHangul || "&nbsp;"}</span>
                `;
                row.appendChild(button);
            });

            refs.keyboardBoard.appendChild(row);
        });
    }

    function updateTypingAid() {
        if (!refs.keyboardAid) return;
        const item = currentItem();
        const target = targetForItem(item);
        const info = nextInputInfo(target, refs.answerInput.value || "");

        if (refs.nextJamo) {
            refs.nextJamo.textContent = info.jamo || (info.char ? info.char : "완료");
        }
        if (refs.nextKeyLabel) {
            if (info.key) {
                const shift = info.key.shiftHangul === info.jamo ? "Shift + " : "";
                refs.nextKeyLabel.textContent = `${FINGER_LABELS[info.key.finger]} · ${shift}${info.key.latin} 자리`;
            } else if (info.char && /\s/.test(info.char)) {
                refs.nextKeyLabel.textContent = "띄어쓰기 자리";
            } else if (info.char) {
                refs.nextKeyLabel.textContent = "문장부호를 그대로 입력합니다.";
            } else {
                refs.nextKeyLabel.textContent = "입력이 끝났습니다.";
            }
        }
        if (refs.keyboardBoard) {
            refs.keyboardBoard.querySelectorAll(".key-button").forEach((button) => {
                button.classList.toggle("is-next-key", Boolean(info.key) && button.dataset.code === info.key.code);
            });
        }
        renderTargetPreview();
    }

    refs.checkBtn.addEventListener("click", answerCurrent);
    refs.nextBtn.addEventListener("click", nextItem);
    refs.answerInput.addEventListener("compositionstart", () => {
        state.composing = true;
    });
    refs.answerInput.addEventListener("compositionend", () => {
        state.composing = false;
        updateTypingAid();
    });
    refs.answerInput.addEventListener("input", updateTypingAid);
    refs.answerInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (event.isComposing || state.composing) return;
        event.preventDefault();
        event.stopPropagation();
        if (state.answered) {
            nextItem();
            return;
        }
        answerCurrent();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        if (event.isComposing || state.composing || !state.answered || state.complete) return;
        event.preventDefault();
        nextItem();
    });

    window.__C12_GRAMMAR_FORM_TYPING__ = {
        getState() {
            syncActiveScore();
            return Object.assign({}, state, {
                stageScores: Object.assign({}, state.stageScores),
                logs: activeLogs().slice()
            });
        },
        reset: resetActivity,
        resetForm: resetFormStage,
        resetSentence: resetSentenceStage,
        startSentence: startSentenceStage,
        answerCurrentCorrectly() {
            const item = currentItem();
            refs.answerInput.value = item.answer;
            updateTypingAid();
            answerCurrent();
        },
        next: nextItem,
        normalize,
        currentAnswer() {
            const item = currentItem();
            return item ? item.answer : "";
        },
        nextInputInfo() {
            const item = currentItem();
            return nextInputInfo(targetForItem(item), refs.answerInput.value || "");
        }
    };

    renderKeyboard();
    syncActiveScore();
    renderTask();
})();
