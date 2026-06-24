(function () {
    "use strict";

    const config = window.C12_GRAMMAR_FORM_TYPING_PAGE;
    if (!config || !Array.isArray(config.items)) return;

    const LEVELS = [
        { key: "guide", label: "가이드", note: "규칙을 보고 씁니다." },
        { key: "partial", label: "부분 가이드", note: "힌트만 보고 씁니다." },
        { key: "independent", label: "독립", note: "직접 만들어 씁니다." }
    ];

    const DATA = {
        levels: LEVELS,
        grammar: config.grammar,
        items: config.items
    };

    window.__C12_GRAMMAR_FORM_TYPING_DATA__ = DATA;

    const refs = {
        progressText: document.getElementById("progressText"),
        scoreText: document.getElementById("scoreText"),
        progressBar: document.getElementById("progressBar"),
        levelList: document.getElementById("levelList"),
        taskBody: document.getElementById("taskBody"),
        finishCard: document.getElementById("finishCard"),
        levelBadge: document.getElementById("levelBadge"),
        grammarBadge: document.getElementById("grammarBadge"),
        promptText: document.getElementById("promptText"),
        cueText: document.getElementById("cueText"),
        guideText: document.getElementById("guideText"),
        answerInput: document.getElementById("answerInput"),
        checkBtn: document.getElementById("checkBtn"),
        feedback: document.getElementById("feedback"),
        nextBtn: document.getElementById("nextBtn")
    };

    const state = {
        grammar: config.grammar.key,
        index: 0,
        score: 0,
        answered: false,
        complete: false,
        composing: false,
        advanceTimer: 0,
        logs: []
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

    function isAsciiOnly(value) {
        const trimmed = String(value || "").trim();
        return Boolean(trimmed) && /^[\x00-\x7F]+$/.test(trimmed);
    }

    function currentItem() {
        return DATA.items[state.index];
    }

    function levelFor(item) {
        return LEVELS.find((level) => level.key === item.level) || LEVELS[0];
    }

    function levelProgress(levelKey) {
        const levelItems = DATA.items.filter((item) => item.level === levelKey);
        const completedIds = new Set(state.logs.map((log) => log.id));
        return levelItems.filter((item) => completedIds.has(item.id)).length;
    }

    function renderLevelList() {
        const item = currentItem();
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
        const total = DATA.items.length || 1;
        const answeredCount = state.complete ? total : state.index;
        refs.progressText.textContent = state.complete ? `${total} / ${total}` : `${state.index + 1} / ${total}`;
        refs.scoreText.textContent = String(state.score);
        refs.progressBar.style.width = `${Math.round((answeredCount / total) * 100)}%`;
        renderLevelList();
    }

    function renderTask() {
        const item = currentItem();
        if (!item) return;
        const level = levelFor(item);

        clearAutoAdvance();
        refs.taskBody.classList.remove("hidden");
        refs.finishCard.classList.add("hidden");
        refs.levelBadge.textContent = level.label;
        refs.grammarBadge.textContent = `${config.grammar.label} · ${config.grammar.shortLabel}`;
        refs.promptText.textContent = item.prompt;
        refs.cueText.textContent = item.cue;
        refs.guideText.textContent = item.guide;
        refs.answerInput.value = "";
        refs.answerInput.disabled = false;
        refs.checkBtn.disabled = false;
        refs.feedback.className = "feedback hidden";
        refs.feedback.innerHTML = "";
        refs.nextBtn.classList.add("hidden");
        refs.nextBtn.textContent = state.index >= DATA.items.length - 1 ? "완료" : "다음";
        state.answered = false;
        state.complete = false;
        renderProgress();
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

    function answerCurrent() {
        if (state.answered || state.complete) return;
        const item = currentItem();
        const user = refs.answerInput.value;

        if (isAsciiOnly(user)) {
            showFeedback("warn", "한/영 키를 확인하세요.");
            refs.answerInput.focus();
            return;
        }

        if (!String(user || "").trim()) {
            showFeedback("warn", "활용형을 입력하세요.");
            refs.answerInput.focus();
            return;
        }

        const accepted = [item.answer].concat(item.accepted || []);
        const ok = accepted.some((answer) => normalize(answer) === normalize(user));
        state.answered = true;
        if (ok) state.score += 1;
        state.logs.push({
            id: item.id,
            grammar: item.grammar,
            ok,
            user,
            correct: item.answer,
            rule: item.rule
        });

        refs.answerInput.disabled = true;
        refs.checkBtn.disabled = true;
        refs.nextBtn.classList.remove("hidden");
        renderProgress();

        if (ok) {
            showFeedback("ok", `맞습니다.<p>다음 문항으로 이동합니다.</p>`);
            scheduleAutoAdvance();
            return;
        }
        showFeedback("bad", `정답: <strong>${esc(item.answer)}</strong><p>${esc(item.rule)}</p>`);
    }

    function renderFinish() {
        const total = DATA.items.length;
        const wrong = state.logs.filter((log) => !log.ok);
        clearAutoAdvance();
        refs.taskBody.classList.add("hidden");
        refs.finishCard.classList.remove("hidden");
        refs.finishCard.innerHTML = `
            <h2>${esc(config.grammar.label)} 완료</h2>
            <div class="finish-score">
                <strong>${state.score} / ${total}</strong>
            </div>
            <div class="review-list">
                ${wrong.length ? wrong.map((log) => `
                    <div class="review-item">
                        <strong>정답:</strong> ${esc(log.correct)}<br />
                        <strong>내 답:</strong> ${esc(log.user || "(비어 있음)")}<br />
                        ${esc(log.rule)}
                    </div>
                `).join("") : '<div class="review-item">다시 볼 문항이 없습니다.</div>'}
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

    function nextItem() {
        if (!state.answered && !state.complete) return;
        clearAutoAdvance();
        if (state.index >= DATA.items.length - 1) {
            renderFinish();
            return;
        }
        state.index += 1;
        renderTask();
    }

    function resetActivity() {
        state.index = 0;
        state.score = 0;
        state.logs = [];
        state.answered = false;
        state.complete = false;
        clearAutoAdvance();
        renderTask();
    }

    refs.checkBtn.addEventListener("click", answerCurrent);
    refs.nextBtn.addEventListener("click", nextItem);
    refs.answerInput.addEventListener("compositionstart", () => {
        state.composing = true;
    });
    refs.answerInput.addEventListener("compositionend", () => {
        state.composing = false;
    });
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
            return Object.assign({}, state);
        },
        reset: resetActivity,
        answerCurrentCorrectly() {
            const item = currentItem();
            refs.answerInput.value = item.answer;
            answerCurrent();
        },
        next: nextItem,
        normalize
    };

    renderTask();
})();
