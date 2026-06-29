(function () {
    "use strict";

    const cfg = window.C13_SUPPORT_ACTIVITY;
    const root = document.getElementById("support-app");
    if (!cfg || !root) return;

    const selectedByBoard = new Map();

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function optionValue(option) {
        if (typeof option === "string") return option;
        return option.value || option.id || option.label || "";
    }

    function optionLabel(option) {
        if (typeof option === "string") return option;
        return option.label || option.value || option.id || "";
    }

    function imageFrame(item, className = "visual-frame") {
        if (!item.image) return "";
        return `
            <div class="${className}">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.title || item.label || "활동 이미지")}" loading="lazy" decoding="async" />
            </div>
        `;
    }

    function renderChips(values, className = "cue-chip") {
        return (values || []).map((value) => `<span class="${className}">${escapeHtml(value)}</span>`).join("");
    }

    function renderHero() {
        const flow = [
            ["learn-section", "학습"],
            ["practice-section", "연습"],
            ["check-section", "점검"]
        ];
        return `
            <section class="support-hero">
                <div>
                    <p class="eyebrow">${escapeHtml(cfg.eyebrow || "Chapter 13 Vocabulary Support")}</p>
                    <h1>${escapeHtml(cfg.title)}</h1>
                    <p>${escapeHtml(cfg.subtitle || "")}</p>
                </div>
                <nav class="flow-nav" aria-label="활동 단계">
                    ${flow.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
                </nav>
            </section>
        `;
    }

    function renderLearnCards(cards) {
        return `
            <div class="learn-grid">
                ${(cards || []).map((card) => `
                    <article class="concept-card">
                        ${imageFrame(card)}
                        <div class="concept-title">
                            ${(card.cues || []).map((cue, index) => `
                                ${index > 0 ? "<span>+</span>" : ""}
                                <span class="mini-chip">${escapeHtml(cue)}</span>
                            `).join("")}
                            ${card.result ? `<span>=</span><span class="concept-result">${escapeHtml(card.result)}</span>` : ""}
                            ${!card.cues?.length && card.label ? `<span>${escapeHtml(card.label)}</span>` : ""}
                        </div>
                        ${card.note ? `<p class="question-prompt">${escapeHtml(card.note)}</p>` : ""}
                    </article>
                `).join("")}
            </div>
        `;
    }

    function renderChoiceQuestion(question, index, mode) {
        const options = question.options || cfg.options || [];
        return `
            <article class="question-card${question.image ? "" : " question-card--text-only"}" data-question-id="${escapeHtml(question.id || `q-${index}`)}" data-answer="${escapeHtml(question.answer)}" data-mode="${escapeHtml(mode)}">
                ${question.image ? imageFrame(question, "question-image") : ""}
                <div class="question-body">
                    <h3>${escapeHtml(question.title || `문제 ${index + 1}`)}</h3>
                    ${question.prompt ? `<p class="question-prompt">${escapeHtml(question.prompt)}</p>` : ""}
                    ${question.cues?.length ? `<div class="cue-row">${renderChips(question.cues)}</div>` : ""}
                    ${question.metrics?.length ? `<div class="metric-row">${renderChips(question.metrics, "metric-chip")}</div>` : ""}
                    <div class="option-grid" role="group" aria-label="${escapeHtml(question.title || `문제 ${index + 1}`)} 선택지">
                        ${options.map((option) => {
                            const value = optionValue(option);
                            return `<button class="answer-option" type="button" data-value="${escapeHtml(value)}">${escapeHtml(optionLabel(option))}</button>`;
                        }).join("")}
                    </div>
                    <div class="feedback" role="status" aria-live="polite">${escapeHtml(question.hint || "알맞은 답을 고르세요.")}</div>
                </div>
            </article>
        `;
    }

    function renderChoiceSet(items, mode, title, note) {
        return `
            ${mode === "check" ? `
                <div class="score-strip" data-score-for="${escapeHtml(mode)}">
                    <span>${escapeHtml(title || "점검")}</span>
                    <strong><span class="score-value">0</span> / ${(items || []).length}</strong>
                </div>
            ` : ""}
            <div class="question-list" data-choice-set="${escapeHtml(mode)}">
                ${(items || []).map((item, index) => renderChoiceQuestion(item, index, mode)).join("")}
            </div>
            ${note ? `<p class="section-note">${escapeHtml(note)}</p>` : ""}
        `;
    }

    function renderMatchBoard(match, mode) {
        const boardId = `${mode}-${match.id || "match"}`;
        return `
            <div class="match-layout" data-match-board="${escapeHtml(boardId)}">
                <div>
                    <div class="section-head">
                        <div>
                            <h2>${escapeHtml(match.bankTitle || "카드")}</h2>
                            <p class="section-note">${escapeHtml(match.bankNote || "카드를 고른 뒤 알맞은 칸을 누르세요.")}</p>
                        </div>
                    </div>
                    <div class="object-bank">
                        ${(match.items || []).map((item) => `
                            <button class="object-card" type="button" data-match-card="${escapeHtml(item.id)}" data-answer="${escapeHtml(item.answer)}" aria-pressed="false">
                                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt || item.label)}" loading="lazy" decoding="async" />` : ""}
                                <span class="object-label">${escapeHtml(item.label)}</span>
                            </button>
                        `).join("")}
                    </div>
                </div>
                <div>
                    <div class="section-head">
                        <div>
                            <h2>${escapeHtml(match.targetTitle || "분류 칸")}</h2>
                            <p class="section-note">${escapeHtml(match.targetNote || "선택한 카드를 받을 칸을 누르세요.")}</p>
                        </div>
                    </div>
                    <div class="target-grid">
                        ${(match.targets || []).map((target) => `
                            <button class="target-zone" type="button" data-match-target="${escapeHtml(target.id)}">
                                <span class="target-title">${escapeHtml(target.label)}</span>
                                <span class="target-summary">${escapeHtml(target.summary || "")}</span>
                                <span class="placed-list" data-placed-list="${escapeHtml(target.id)}"></span>
                            </button>
                        `).join("")}
                    </div>
                </div>
                <div class="feedback match-feedback" role="status" aria-live="polite">
                    ${escapeHtml(match.hint || "카드를 먼저 고른 다음 알맞은 칸을 누르세요.")}
                </div>
                <button class="reset-btn" type="button" data-reset-match="${escapeHtml(boardId)}">다시 배치하기</button>
            </div>
        `;
    }

    function renderSection(id, title, note, body) {
        return `
            <section id="${escapeHtml(id)}" class="support-section">
                <div class="section-head">
                    <div>
                        <p class="eyebrow">${escapeHtml(id.replace("-section", ""))}</p>
                        <h2>${escapeHtml(title)}</h2>
                        ${note ? `<p class="section-note">${escapeHtml(note)}</p>` : ""}
                    </div>
                </div>
                ${body}
            </section>
        `;
    }

    function renderPractice() {
        if (cfg.type === "verb-object-sort" || cfg.type === "pair-match") {
            return renderMatchBoard(cfg.match, "practice");
        }
        return renderChoiceSet(cfg.practice || [], "practice");
    }

    function renderCheck() {
        const items = cfg.check || cfg.checkQuestions || [];
        return renderChoiceSet(items, "check", cfg.checkTitle || "점검");
    }

    function renderPage() {
        document.title = `${cfg.title} | 13과 어휘 보조`;
        root.innerHTML = `
            <div class="support-shell">
                ${renderHero()}
                ${renderSection("learn-section", cfg.learnTitle || "학습", cfg.learnNote || "", renderLearnCards(cfg.learnCards || []))}
                ${renderSection("practice-section", cfg.practiceTitle || "연습", cfg.practiceNote || "", renderPractice())}
                ${renderSection("check-section", cfg.checkTitle || "점검", cfg.checkNote || "", renderCheck())}
                <nav class="support-footer" aria-label="하단 이동">
                    <a href="vocabulary.html">어휘 카드</a>
                    <a href="vocabulary-crossword.html">낱말퍼즐</a>
                    <a href="index.html">13과 목록</a>
                    <a href="../index.html">전체 목록</a>
                </nav>
            </div>
        `;
        updateAllScores();
    }

    function setFeedback(question, text, tone) {
        const feedback = question.querySelector(".feedback");
        if (!feedback) return;
        feedback.textContent = text;
        feedback.classList.toggle("is-correct", tone === "correct");
        feedback.classList.toggle("is-wrong", tone === "wrong");
    }

    function handleChoice(button) {
        const question = button.closest(".question-card");
        if (!question || question.dataset.solved === "true") return;

        const value = button.dataset.value;
        const answer = question.dataset.answer;
        const source = findQuestionConfig(question.dataset.questionId, question.dataset.mode);
        const isCorrect = value === answer;

        if (isCorrect) {
            button.classList.add("is-correct");
            question.dataset.solved = "true";
            question.querySelectorAll(".answer-option").forEach((option) => {
                option.disabled = true;
                if (option.dataset.value === answer) option.classList.add("is-correct");
            });
            setFeedback(question, source?.feedback || `정답: ${answer}`, "correct");
            updateAllScores();
            return;
        }

        button.classList.add("is-wrong");
        setFeedback(question, source?.wrongFeedback || "아직 아니에요. 단서와 장면을 다시 보세요.", "wrong");
    }

    function findQuestionConfig(id, mode) {
        const list = mode === "check" ? (cfg.check || cfg.checkQuestions || []) : (cfg.practice || []);
        return list.find((item, index) => String(item.id || `q-${index}`) === id) || null;
    }

    function updateAllScores() {
        document.querySelectorAll("[data-score-for]").forEach((strip) => {
            const mode = strip.dataset.scoreFor;
            const questions = [...document.querySelectorAll(`.question-card[data-mode="${mode}"]`)];
            const solved = questions.filter((question) => question.dataset.solved === "true").length;
            const scoreValue = strip.querySelector(".score-value");
            if (scoreValue) scoreValue.textContent = String(solved);
        });
    }

    function clearMatchSelection(board) {
        const boardId = board.dataset.matchBoard;
        selectedByBoard.delete(boardId);
        board.querySelectorAll(".object-card").forEach((card) => card.setAttribute("aria-pressed", "false"));
        board.querySelectorAll(".target-zone").forEach((target) => target.classList.remove("is-active"));
    }

    function selectedCardFor(board) {
        const id = selectedByBoard.get(board.dataset.matchBoard);
        return id ? board.querySelector(`[data-match-card="${CSS.escape(id)}"]`) : null;
    }

    function handleMatchCard(card) {
        if (card.classList.contains("is-used")) return;
        const board = card.closest("[data-match-board]");
        if (!board) return;
        clearMatchSelection(board);
        selectedByBoard.set(board.dataset.matchBoard, card.dataset.matchCard);
        card.setAttribute("aria-pressed", "true");
        board.querySelectorAll(`[data-match-target="${CSS.escape(card.dataset.answer)}"]`).forEach((target) => {
            target.classList.add("is-active");
        });
        const feedback = board.querySelector(".match-feedback");
        feedback.textContent = `${card.querySelector(".object-label")?.textContent || "카드"}: 알맞은 칸을 선택하세요.`;
        feedback.className = "feedback match-feedback";
    }

    function handleMatchTarget(target) {
        const board = target.closest("[data-match-board]");
        const card = selectedCardFor(board);
        const feedback = board.querySelector(".match-feedback");
        if (!card) {
            feedback.textContent = "카드를 먼저 선택하세요.";
            feedback.className = "feedback match-feedback is-wrong";
            return;
        }

        const label = card.querySelector(".object-label")?.textContent || "";
        const ok = card.dataset.answer === target.dataset.matchTarget;
        if (!ok) {
            feedback.textContent = `${label}: 그 칸은 어울리지 않아요. 의미를 다시 비교해 보세요.`;
            feedback.className = "feedback match-feedback is-wrong";
            return;
        }

        const placedList = target.querySelector("[data-placed-list]");
        placedList.insertAdjacentHTML("beforeend", `<span class="placed-chip">${escapeHtml(label)}</span>`);
        card.classList.add("is-used");
        card.disabled = true;
        feedback.textContent = `${label}: 맞아요.`;
        feedback.className = "feedback match-feedback is-correct";
        clearMatchSelection(board);
    }

    function resetMatchBoard(board) {
        board.querySelectorAll(".object-card").forEach((card) => {
            card.classList.remove("is-used");
            card.disabled = false;
            card.setAttribute("aria-pressed", "false");
        });
        board.querySelectorAll("[data-placed-list]").forEach((list) => {
            list.innerHTML = "";
        });
        clearMatchSelection(board);
        const feedback = board.querySelector(".match-feedback");
        feedback.textContent = cfg.match?.hint || "카드를 먼저 고른 다음 알맞은 칸을 누르세요.";
        feedback.className = "feedback match-feedback";
    }

    document.addEventListener("click", (event) => {
        const option = event.target.closest(".answer-option");
        if (option) {
            handleChoice(option);
            return;
        }

        const card = event.target.closest("[data-match-card]");
        if (card) {
            handleMatchCard(card);
            return;
        }

        const target = event.target.closest("[data-match-target]");
        if (target) {
            handleMatchTarget(target);
            return;
        }

        const reset = event.target.closest("[data-reset-match]");
        if (reset) {
            const board = document.querySelector(`[data-match-board="${CSS.escape(reset.dataset.resetMatch)}"]`);
            if (board) resetMatchBoard(board);
        }
    });

    renderPage();
})();
