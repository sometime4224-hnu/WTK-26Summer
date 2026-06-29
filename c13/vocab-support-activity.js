(function () {
    "use strict";

    const cfg = window.C13_SUPPORT_ACTIVITY;
    const root = document.getElementById("support-app");
    if (!cfg || !root) return;

    const selectedByBoard = new Map();
    let selectedTransformVerb = null;
    let draggedContrastSceneId = null;

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

    function optionLabelForValue(options, value) {
        const option = (options || []).find((candidate) => optionValue(candidate) === value);
        return option ? optionLabel(option) : value;
    }

    function formatTemplate(text, replacements = {}) {
        if (!text) return "";
        return String(text).replace(/\{([a-zA-Z]+)\}/g, (match, key) => replacements[key] ?? match);
    }

    function transformVerbs() {
        return cfg.transform?.verbs || [];
    }

    function transformItems() {
        return cfg.transform?.items || [];
    }

    function transformVerbById(id) {
        return transformVerbs().find((verb) => verb.id === id) || null;
    }

    function transformItemById(id) {
        return transformItems().find((item) => item.id === id) || null;
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
            cfg.showLearn === false ? null : ["learn-section", "학습"],
            cfg.showPractice === false ? null : ["practice-section", "연습"],
            cfg.contrast && cfg.showContrast !== false ? ["contrast-section", "비교"] : null,
            cfg.showCheck === false ? null : ["check-section", "점검"]
        ].filter(Boolean);
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

    function renderTransformVerbTray(transform) {
        return `
            <div class="verb-tray" role="group" aria-label="적용할 동사 선택">
                ${(transform.verbs || []).map((verb) => `
                    <button class="verb-chip" type="button" draggable="true" data-transform-verb="${escapeHtml(verb.id)}" aria-pressed="false">
                        <span>${escapeHtml(verb.label)}</span>
                        <small>${escapeHtml(verb.summary || "")}</small>
                    </button>
                `).join("")}
            </div>
        `;
    }

    function renderTransformCard(item) {
        return `
            <button class="transform-card" type="button" data-transform-card="${escapeHtml(item.id)}" data-answer="${escapeHtml(item.answer)}">
                <span class="transform-image-frame">
                    <img
                        src="${escapeHtml(item.beforeImage)}"
                        alt="${escapeHtml(item.beforeAlt || `${item.label} 전 상태`)}"
                        data-transform-image
                        data-before-image="${escapeHtml(item.beforeImage)}"
                        data-after-image="${escapeHtml(item.afterImage)}"
                        data-before-alt="${escapeHtml(item.beforeAlt || `${item.label} 전 상태`)}"
                        data-after-alt="${escapeHtml(item.afterAlt || `${item.label} 후 상태`)}"
                        loading="lazy"
                        decoding="async"
                    />
                </span>
                <span class="transform-card-copy">
                    <span class="transform-title">${escapeHtml(item.label)}</span>
                    <span class="transform-phrase" data-transform-phrase>${escapeHtml(item.objectPhrase || item.label)} ___</span>
                    <span class="transform-note">${escapeHtml(item.hint || "동사를 넣으면 이미지가 바뀝니다.")}</span>
                </span>
            </button>
        `;
    }

    function renderTransformPractice() {
        const transform = cfg.transform || {};
        return `
            <div class="transform-board" data-transform-board="${escapeHtml(transform.id || "transform")}">
                <div class="section-head transform-control-head">
                    <div>
                        <h2>${escapeHtml(transform.verbTitle || "동사 카드")}</h2>
                        <p class="section-note">${escapeHtml(transform.verbNote || "동사를 선택하거나 목적어 이미지로 끌어 넣으세요.")}</p>
                    </div>
                </div>
                ${renderTransformVerbTray(transform)}
                <div class="transform-grid">
                    ${(transform.items || []).map(renderTransformCard).join("")}
                </div>
                <div class="feedback transform-feedback" role="status" aria-live="polite">
                    ${escapeHtml(transform.hint || "동사를 고른 뒤 목적어 이미지에 넣어 보세요.")}
                </div>
                <button class="reset-btn" type="button" data-reset-transform>다시 해보기</button>
            </div>
        `;
    }

    function renderTransformCheckQuestion(question, index) {
        const options = question.options || cfg.options || transformVerbs();
        return `
            <article class="question-card transform-check-card" data-question-id="${escapeHtml(question.id || `q-${index}`)}" data-answer="${escapeHtml(question.answer)}" data-mode="check">
                <div class="question-image transform-check-image">
                    <img
                        src="${escapeHtml(question.beforeImage)}"
                        alt="${escapeHtml(question.beforeAlt || `${question.label || question.title} 전 상태`)}"
                        data-transform-image
                        data-before-image="${escapeHtml(question.beforeImage)}"
                        data-after-image="${escapeHtml(question.afterImage)}"
                        data-before-alt="${escapeHtml(question.beforeAlt || `${question.label || question.title} 전 상태`)}"
                        data-after-alt="${escapeHtml(question.afterAlt || `${question.label || question.title} 후 상태`)}"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
                <div class="question-body">
                    <h3>${escapeHtml(question.title || `문제 ${index + 1}`)}</h3>
                    ${question.prompt ? `<p class="question-prompt">${escapeHtml(question.prompt)}</p>` : ""}
                    <div class="transform-phrase" data-transform-phrase>${escapeHtml(question.objectPhrase || question.label || "")} ___</div>
                    <div class="option-grid" role="group" aria-label="${escapeHtml(question.title || `문제 ${index + 1}`)} 선택지">
                        ${options.map((option) => {
                            const value = optionValue(option);
                            return `<button class="answer-option" type="button" data-value="${escapeHtml(value)}">${escapeHtml(optionLabel(option))}</button>`;
                        }).join("")}
                    </div>
                    <div class="feedback" role="status" aria-live="polite">${escapeHtml(question.hint || "알맞은 동사를 고르세요.")}</div>
                </div>
            </article>
        `;
    }

    function renderTransformCheck() {
        const items = cfg.check || cfg.checkQuestions || [];
        return `
            <div class="score-strip" data-score-for="check">
                <span>${escapeHtml(cfg.checkTitle || "점검")}</span>
                <strong><span class="score-value">0</span> / ${items.length}</strong>
            </div>
            <div class="question-list" data-choice-set="check">
                ${items.map(renderTransformCheckQuestion).join("")}
            </div>
        `;
    }

    function renderContrast(contrast) {
        return `
            ${contrast.summary ? `<p class="contrast-summary">${escapeHtml(contrast.summary)}</p>` : ""}
            <div class="contrast-group-list">
                ${(contrast.groups || []).map((group) => `
                    <section class="contrast-group" data-contrast-object="${escapeHtml(group.id || group.label)}" data-contrast-board="${escapeHtml(group.id || group.label)}">
                        <div class="contrast-group-head">
                            <div>
                                <p class="eyebrow">${escapeHtml(group.eyebrow || "같은 명사")}</p>
                                <h3>${escapeHtml(group.label)}</h3>
                            </div>
                            ${group.note ? `<p>${escapeHtml(group.note)}</p>` : ""}
                        </div>
                        <div class="contrast-playground">
                            <div class="contrast-stage" data-contrast-stage tabindex="0">
                                <div class="contrast-image">
                                    <img
                                        src="${escapeHtml(group.baseImage || group.scenes?.[0]?.image || "")}"
                                        alt="${escapeHtml(group.baseAlt || `${group.label} 기본 장면`)}"
                                        data-contrast-image
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div class="contrast-card-copy">
                                    <h4 data-contrast-phrase>${escapeHtml(group.placeholderPhrase || `${group.label} ___`)}</h4>
                                    <span class="contrast-focus" data-contrast-focus>${escapeHtml(group.placeholderFocus || "동사를 넣어 보세요")}</span>
                                    <p data-contrast-note>${escapeHtml(group.placeholderNote || "아래 동사를 넣으면 같은 명사의 초점이 어떻게 달라지는지 확인할 수 있습니다.")}</p>
                                </div>
                            </div>
                            <div class="contrast-verb-row" role="group" aria-label="${escapeHtml(group.label)}에 넣을 동사">
                                ${(group.scenes || []).map((scene) => `
                                    <button
                                        class="contrast-verb-chip"
                                        type="button"
                                        draggable="true"
                                        data-contrast-scene="${escapeHtml(scene.id)}"
                                        data-contrast-image-src="${escapeHtml(scene.image)}"
                                        data-contrast-alt="${escapeHtml(scene.alt || scene.phrase)}"
                                        data-contrast-result-phrase="${escapeHtml(scene.phrase)}"
                                        data-contrast-result-focus="${escapeHtml(scene.focus)}"
                                        data-contrast-result-note="${escapeHtml(scene.note || "")}"
                                    >
                                        <span>${escapeHtml(scene.verb || scene.phrase.split(" ").pop())}</span>
                                        <small>${escapeHtml(scene.focus)}</small>
                                    </button>
                                `).join("")}
                            </div>
                            <div class="feedback contrast-feedback" role="status" aria-live="polite">
                                ${escapeHtml(group.hint || "동사를 선택하거나 빈 그림 위로 끌어 놓으세요.")}
                            </div>
                        </div>
                    </section>
                `).join("")}
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
        if (cfg.type === "verb-image-transform") {
            return renderTransformPractice();
        }
        if (cfg.type === "verb-object-sort" || cfg.type === "pair-match") {
            return renderMatchBoard(cfg.match, "practice");
        }
        return renderChoiceSet(cfg.practice || [], "practice");
    }

    function renderCheck() {
        if (cfg.type === "verb-image-transform") {
            return renderTransformCheck();
        }
        const items = cfg.check || cfg.checkQuestions || [];
        return renderChoiceSet(items, "check", cfg.checkTitle || "점검");
    }

    function renderPage() {
        document.title = `${cfg.title} | 13과 어휘 보조`;
        root.innerHTML = `
            <div class="support-shell">
                ${renderHero()}
                ${cfg.showLearn === false ? "" : renderSection("learn-section", cfg.learnTitle || "학습", cfg.learnNote || "", renderLearnCards(cfg.learnCards || []))}
                ${cfg.showPractice === false ? "" : renderSection("practice-section", cfg.practiceTitle || "연습", cfg.practiceNote || "", renderPractice())}
                ${cfg.contrast && cfg.showContrast !== false ? renderSection("contrast-section", cfg.contrastTitle || "비교", cfg.contrastNote || "", renderContrast(cfg.contrast)) : ""}
                ${cfg.showCheck === false ? "" : renderSection("check-section", cfg.checkTitle || "점검", cfg.checkNote || "", renderCheck())}
                <nav class="support-footer" aria-label="하단 이동">
                    <a href="vocab-support-learning.html">유형별 배우기</a>
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

    function transformPhrase(source, verb) {
        return (source.completePhrase || `${source.objectPhrase || source.label || ""} ${verb?.label || ""}`).trim();
    }

    function revealTransformImage(container, source) {
        const image = container.querySelector("[data-transform-image]");
        if (!image || !source?.afterImage) return;
        image.classList.add("is-switching");
        image.src = source.afterImage;
        image.alt = source.afterAlt || image.dataset.afterAlt || image.alt;
        image.addEventListener("load", () => image.classList.remove("is-switching"), { once: true });
    }

    function updateTransformPhrase(container, source, verb) {
        const phrase = container.querySelector("[data-transform-phrase]");
        if (phrase) phrase.textContent = transformPhrase(source, verb);
    }

    function handleChoice(button) {
        const question = button.closest(".question-card");
        if (!question || question.dataset.solved === "true") return;

        const value = button.dataset.value;
        const answer = question.dataset.answer;
        const source = findQuestionConfig(question.dataset.questionId, question.dataset.mode);
        const isCorrect = value === answer;
        const options = source?.options || cfg.options || transformVerbs();
        const choiceLabel = optionLabelForValue(options, value);
        const answerLabel = optionLabelForValue(options, answer);
        const replacements = {
            choice: choiceLabel,
            answer: answerLabel,
            object: source?.label || source?.objectPhrase || ""
        };

        if (isCorrect) {
            button.classList.add("is-correct");
            question.dataset.solved = "true";
            question.querySelectorAll(".answer-option").forEach((option) => {
                option.disabled = true;
                if (option.dataset.value === answer) option.classList.add("is-correct");
            });
            if (cfg.type === "verb-image-transform") {
                const verb = transformVerbById(answer);
                revealTransformImage(question, source);
                updateTransformPhrase(question, source, verb);
            }
            setFeedback(question, formatTemplate(source?.feedback || `정답: ${answerLabel}`, replacements), "correct");
            updateAllScores();
            return;
        }

        button.classList.add("is-wrong");
        setFeedback(question, formatTemplate(source?.wrongFeedback || "아직 아니에요. 단서와 장면을 다시 보세요.", replacements), "wrong");
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

    function setTransformFeedback(board, text, tone) {
        const feedback = board.querySelector(".transform-feedback");
        if (!feedback) return;
        feedback.textContent = text;
        feedback.className = "feedback transform-feedback";
        if (tone === "correct") feedback.classList.add("is-correct");
        if (tone === "wrong") feedback.classList.add("is-wrong");
    }

    function clearTransformSelection() {
        selectedTransformVerb = null;
        document.querySelectorAll("[data-transform-verb]").forEach((button) => {
            button.setAttribute("aria-pressed", "false");
            button.classList.remove("is-selected", "is-dragging");
        });
        document.querySelectorAll("[data-transform-card]").forEach((card) => {
            card.classList.remove("is-ready-target", "is-drop-target");
        });
    }

    function updateTransformTargetHints(board, active) {
        if (!board) return;
        board.querySelectorAll("[data-transform-card]").forEach((card) => {
            const ready = active && card.dataset.solved !== "true" && !card.disabled;
            card.classList.toggle("is-ready-target", ready);
            if (!ready) card.classList.remove("is-drop-target");
        });
    }

    function handleTransformVerb(button) {
        const board = button.closest("[data-transform-board]") || document.querySelector("[data-transform-board]");
        selectedTransformVerb = button.dataset.transformVerb;
        document.querySelectorAll("[data-transform-verb]").forEach((candidate) => {
            const selected = candidate === button;
            candidate.setAttribute("aria-pressed", String(selected));
            candidate.classList.toggle("is-selected", selected);
        });
        updateTransformTargetHints(board, true);
        const verb = transformVerbById(selectedTransformVerb);
        if (board && verb) setTransformFeedback(board, `${verb.label}: 넣을 목적어 이미지를 선택하세요.`, "");
    }

    function applyTransformToCard(card, verbId) {
        const board = card.closest("[data-transform-board]");
        const item = transformItemById(card.dataset.transformCard);
        const verb = transformVerbById(verbId);
        const answerVerb = transformVerbById(card.dataset.answer);
        if (!board || !item) return;

        if (!verb) {
            setTransformFeedback(board, "동사를 먼저 선택하거나 동사 카드를 끌어 넣으세요.", "wrong");
            return;
        }

        if (card.dataset.solved === "true") {
            setTransformFeedback(board, `${item.label}: 이미 완성했어요.`, "correct");
            return;
        }

        const replacements = {
            choice: verb.label,
            answer: answerVerb?.label || "",
            object: item.label
        };
        if (verb.id !== item.answer) {
            setTransformFeedback(
                board,
                formatTemplate(item.wrongFeedback || `${item.label}에는 {choice}보다 {answer}가 자연스러워요.`, replacements),
                "wrong"
            );
            card.classList.add("is-wrong");
            window.setTimeout(() => card.classList.remove("is-wrong"), 450);
            return;
        }

        revealTransformImage(card, item);
        updateTransformPhrase(card, item, verb);
        card.dataset.solved = "true";
        card.classList.add("is-correct");
        card.disabled = true;
        setTransformFeedback(board, formatTemplate(item.feedback || `정답: ${transformPhrase(item, verb)}`, replacements), "correct");
        clearTransformSelection();
    }

    function resetTransformBoard(board) {
        board.querySelectorAll("[data-transform-card]").forEach((card) => {
            const item = transformItemById(card.dataset.transformCard);
            const image = card.querySelector("[data-transform-image]");
            if (item && image) {
                image.src = item.beforeImage;
                image.alt = item.beforeAlt || image.dataset.beforeAlt || image.alt;
            }
            const phrase = card.querySelector("[data-transform-phrase]");
            if (item && phrase) phrase.textContent = `${item.objectPhrase || item.label} ___`;
            card.dataset.solved = "false";
            card.classList.remove("is-correct", "is-wrong", "is-ready-target", "is-drop-target");
            card.disabled = false;
        });
        clearTransformSelection();
        setTransformFeedback(board, cfg.transform?.hint || "동사를 고른 뒤 목적어 이미지에 넣어 보세요.", "");
    }

    function applyContrastScene(button) {
        const board = button.closest("[data-contrast-board]");
        if (!board) return;
        const stage = board.querySelector("[data-contrast-stage]");
        const image = board.querySelector("[data-contrast-image]");
        const phrase = board.querySelector("[data-contrast-phrase]");
        const focus = board.querySelector("[data-contrast-focus]");
        const note = board.querySelector("[data-contrast-note]");
        const feedback = board.querySelector(".contrast-feedback");
        if (!image || !phrase || !focus || !note) return;

        image.classList.add("is-switching");
        image.src = button.dataset.contrastImageSrc;
        image.alt = button.dataset.contrastAlt || button.dataset.contrastResultPhrase || image.alt;
        image.addEventListener("load", () => image.classList.remove("is-switching"), { once: true });
        phrase.textContent = button.dataset.contrastResultPhrase || "";
        focus.textContent = button.dataset.contrastResultFocus || "";
        note.textContent = button.dataset.contrastResultNote || "";
        board.querySelectorAll("[data-contrast-scene]").forEach((candidate) => {
            candidate.classList.toggle("is-selected", candidate === button);
        });
        stage?.classList.add("is-filled");
        stage?.classList.remove("is-drop-target");
        if (feedback) {
            feedback.textContent = `${button.dataset.contrastResultPhrase}: ${button.dataset.contrastResultFocus}`;
            feedback.className = "feedback contrast-feedback is-correct";
        }
    }

    document.addEventListener("click", (event) => {
        const contrastScene = event.target.closest("[data-contrast-scene]");
        if (contrastScene) {
            applyContrastScene(contrastScene);
            return;
        }

        const verb = event.target.closest("[data-transform-verb]");
        if (verb) {
            handleTransformVerb(verb);
            return;
        }

        const transformCard = event.target.closest("[data-transform-card]");
        if (transformCard) {
            applyTransformToCard(transformCard, selectedTransformVerb);
            return;
        }

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

        const transformReset = event.target.closest("[data-reset-transform]");
        if (transformReset) {
            const board = transformReset.closest("[data-transform-board]");
            if (board) resetTransformBoard(board);
        }
    });

    document.addEventListener("dragstart", (event) => {
        const contrastScene = event.target.closest("[data-contrast-scene]");
        if (contrastScene && event.dataTransfer) {
            const board = contrastScene.closest("[data-contrast-board]");
            draggedContrastSceneId = contrastScene.dataset.contrastScene;
            event.dataTransfer.setData("text/x-c13-contrast-scene", contrastScene.dataset.contrastScene);
            event.dataTransfer.setData("text/plain", contrastScene.dataset.contrastScene);
            event.dataTransfer.effectAllowed = "copy";
            contrastScene.classList.add("is-dragging");
            board?.querySelector("[data-contrast-stage]")?.classList.add("is-ready-target");
            return;
        }

        const verb = event.target.closest("[data-transform-verb]");
        if (!verb || !event.dataTransfer) return;
        handleTransformVerb(verb);
        event.dataTransfer.setData("text/plain", selectedTransformVerb);
        event.dataTransfer.effectAllowed = "copy";
        verb.classList.add("is-dragging");
    });

    document.addEventListener("dragend", () => {
        document.querySelectorAll("[data-transform-verb]").forEach((verb) => verb.classList.remove("is-dragging"));
        document.querySelectorAll("[data-transform-card]").forEach((card) => card.classList.remove("is-drop-target"));
        document.querySelectorAll("[data-contrast-scene]").forEach((scene) => scene.classList.remove("is-dragging"));
        document.querySelectorAll("[data-contrast-stage]").forEach((stage) => stage.classList.remove("is-ready-target", "is-drop-target"));
        draggedContrastSceneId = null;
    });

    document.addEventListener("dragover", (event) => {
        const contrastStage = event.target.closest("[data-contrast-stage]");
        const dragTypes = Array.from(event.dataTransfer?.types || []);
        if (contrastStage && (dragTypes.includes("text/x-c13-contrast-scene") || dragTypes.includes("text/plain") || draggedContrastSceneId)) {
            event.preventDefault();
            contrastStage.classList.add("is-drop-target");
            if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
            return;
        }

        const card = event.target.closest("[data-transform-card]");
        if (!card || card.disabled) return;
        event.preventDefault();
        card.classList.add("is-drop-target");
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    });

    document.addEventListener("dragleave", (event) => {
        const contrastStage = event.target.closest("[data-contrast-stage]");
        if (contrastStage && !contrastStage.contains(event.relatedTarget)) {
            contrastStage.classList.remove("is-drop-target");
            return;
        }

        const card = event.target.closest("[data-transform-card]");
        if (card && !card.contains(event.relatedTarget)) card.classList.remove("is-drop-target");
    });

    document.addEventListener("drop", (event) => {
        const contrastStage = event.target.closest("[data-contrast-stage]");
        if (contrastStage) {
            const sceneId = event.dataTransfer?.getData("text/x-c13-contrast-scene") || draggedContrastSceneId || event.dataTransfer?.getData("text/plain");
            if (sceneId) {
                event.preventDefault();
                const board = contrastStage.closest("[data-contrast-board]");
                const button = board?.querySelector(`[data-contrast-scene="${CSS.escape(sceneId)}"]`);
                contrastStage.classList.remove("is-ready-target", "is-drop-target");
                draggedContrastSceneId = null;
                if (button) applyContrastScene(button);
                return;
            }
        }

        const card = event.target.closest("[data-transform-card]");
        if (!card) return;
        event.preventDefault();
        card.classList.remove("is-drop-target");
        const verbId = event.dataTransfer?.getData("text/plain") || selectedTransformVerb;
        applyTransformToCard(card, verbId);
    });

    renderPage();
})();
