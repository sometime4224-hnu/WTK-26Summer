/* Learner-first layout and retryable quick-check behaviour for C16 grammar. */
(function () {
    "use strict";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeState(value, length) {
        const state = value && typeof value === "object" ? value : {};
        const index = Number.isInteger(state.index) && state.index >= 0 && state.index < length ? state.index : 0;
        const results = state.results && typeof state.results === "object" && !Array.isArray(state.results)
            ? state.results
            : {};
        Object.keys(results).forEach(function (key) {
            const result = results[key];
            if (!result || typeof result !== "object" || !["retry", "correct", "revealed"].includes(result.status)) {
                delete results[key];
                return;
            }
            result.attempts = Array.isArray(result.attempts)
                ? result.attempts.filter(function (attempt) { return Number.isInteger(attempt) && attempt >= 0; })
                : [];
        });
        return { index: index, results: results, complete: state.complete === true };
    }

    function initQuiz(config) {
        if (!window.C16GrammarState || !config || !Array.isArray(config.quiz) || !config.quiz.length) return;

        const elements = config.elements || {};
        const promptEl = document.querySelector(elements.prompt);
        const hintEl = elements.hint ? document.querySelector(elements.hint) : null;
        const choicesEl = document.querySelector(elements.choices);
        const feedbackEl = document.querySelector(elements.feedback);
        const countEl = document.querySelector(elements.count);
        const nextBtn = document.querySelector(elements.next);
        const restartBtn = document.querySelector(elements.restart);
        const revealBtn = document.querySelector(elements.reveal);
        const progressEl = elements.progress ? document.querySelector(elements.progress) : null;
        const stateTools = document.querySelector(elements.stateTools || "[data-c16-state-tools]");
        if (!promptEl || !choicesEl || !feedbackEl || !countEl || !nextBtn || !restartBtn || !revealBtn) return;

        const initial = { index: 0, results: {}, complete: false };
        let state;
        const store = window.C16GrammarState.create(config.pageId, initial, {
            validate: function (saved) {
                return Boolean(saved && typeof saved === "object" && saved.results && typeof saved.results === "object");
            },
            onReset: function () {
                state = clone(initial);
                render();
            }
        });
        state = normalizeState(store.get(), config.quiz.length);

        feedbackEl.setAttribute("role", "status");
        feedbackEl.setAttribute("aria-live", "polite");
        choicesEl.setAttribute("role", "group");
        choicesEl.setAttribute("aria-label", "정답 선택");
        revealBtn.classList.add("c16-reveal-answer");
        revealBtn.hidden = true;

        function save() {
            store.save(state);
        }

        function score() {
            return Object.keys(state.results).filter(function (key) {
                return state.results[key] && state.results[key].status === "correct";
            }).length;
        }

        function resolvedCount() {
            return Object.keys(state.results).filter(function (key) {
                const result = state.results[key];
                return result && (result.status === "correct" || result.status === "revealed");
            }).length;
        }

        function setFeedback(kind, text) {
            feedbackEl.hidden = false;
            feedbackEl.className = (config.feedbackBase || "feedback") + " show " + kind;
            feedbackEl.textContent = text;
        }

        function clearFeedback() {
            feedbackEl.hidden = true;
            feedbackEl.className = config.feedbackBase || "feedback";
            feedbackEl.textContent = "";
        }

        function renderCount() {
            if (typeof config.renderCount === "function") {
                config.renderCount(countEl, state, config.quiz.length);
            } else {
                countEl.textContent = state.complete ? "완료" : (state.index + 1) + " / " + config.quiz.length;
            }
            if (progressEl) {
                progressEl.style.width = Math.round((resolvedCount() / config.quiz.length) * 100) + "%";
            }
        }

        function renderSummary() {
            const result = score();
            promptEl.textContent = "퀴즈 완료: " + result + " / " + config.quiz.length;
            if (hintEl) hintEl.textContent = config.summaryHint || "정답을 확인한 뒤, 다음 활동에서 문장을 직접 말해 보세요.";
            choicesEl.innerHTML = "";
            const summary = document.createElement("div");
            summary.className = config.summaryClass || "sentence";
            summary.textContent = config.summaryText || "정답을 확인한 뒤, 다음 활동에서 문장을 직접 말해 보세요.";
            choicesEl.appendChild(summary);
            clearFeedback();
            revealBtn.hidden = true;
            nextBtn.disabled = true;
            nextBtn.textContent = "완료";
            renderCount();
        }

        function renderQuestion() {
            const item = config.quiz[state.index];
            const result = state.results[state.index] || { status: "pending", attempts: [] };
            promptEl.textContent = item.prompt;
            if (hintEl) hintEl.textContent = item.hint || "가장 자연스러운 문장을 고르세요.";
            clearFeedback();
            revealBtn.hidden = result.status !== "retry";
            nextBtn.disabled = !(result.status === "correct" || result.status === "revealed");
            nextBtn.textContent = state.index === config.quiz.length - 1 ? "결과 보기" : "다음";
            renderCount();
            choicesEl.innerHTML = "";

            item.choices.forEach(function (choice, choiceIndex) {
                const button = document.createElement("button");
                button.className = (config.choiceClass || "choice") + " c16-quiz-choice";
                button.type = "button";
                button.textContent = choice;
                button.setAttribute("aria-pressed", "false");
                const attemptedWrong = result.attempts.indexOf(choiceIndex) !== -1 && choiceIndex !== item.answer;
                const locked = result.status === "correct" || result.status === "revealed";

                if (attemptedWrong) {
                    button.classList.add("wrong");
                    button.disabled = true;
                    button.setAttribute("aria-pressed", "true");
                }
                if (locked && choiceIndex === item.answer) {
                    button.classList.add("correct");
                    button.setAttribute("aria-pressed", "true");
                }
                if (locked && choiceIndex !== item.answer && !attemptedWrong) {
                    button.classList.add("dimmed");
                    button.disabled = true;
                }
                if (locked && choiceIndex === item.answer) button.disabled = true;

                button.addEventListener("click", function () {
                    const current = state.results[state.index] || { status: "pending", attempts: [] };
                    if (current.status === "correct" || current.status === "revealed") return;
                    if (current.attempts.indexOf(choiceIndex) !== -1) return;
                    current.attempts.push(choiceIndex);
                    if (choiceIndex === item.answer) {
                        current.status = "correct";
                    } else {
                        current.status = "retry";
                    }
                    state.results[state.index] = current;
                    save();
                    renderQuestion();
                    if (current.status === "correct") {
                        setFeedback("ok", "정답! " + item.feedback);
                    } else {
                        setFeedback("bad", "아직 아니에요. 다른 문장을 골라 보거나 ‘정답 보기’를 누르세요.");
                    }
                });
                choicesEl.appendChild(button);
            });

            if (result.status === "correct") {
                setFeedback("ok", "정답! " + item.feedback);
            } else if (result.status === "revealed") {
                setFeedback("ok", "정답: " + item.choices[item.answer] + ". " + item.feedback);
            } else if (result.status === "retry") {
                setFeedback("bad", "아직 아니에요. 다른 문장을 골라 보거나 ‘정답 보기’를 누르세요.");
            }
        }

        function render() {
            if (state.complete) renderSummary();
            else renderQuestion();
        }

        revealBtn.addEventListener("click", function () {
            const item = config.quiz[state.index];
            const current = state.results[state.index];
            if (!current || current.status !== "retry") return;
            current.status = "revealed";
            state.results[state.index] = current;
            save();
            renderQuestion();
        });

        nextBtn.addEventListener("click", function () {
            const current = state.results[state.index];
            if (!current || (current.status !== "correct" && current.status !== "revealed")) return;
            if (state.index === config.quiz.length - 1) {
                state.complete = true;
            } else {
                state.index += 1;
            }
            save();
            render();
        });

        restartBtn.addEventListener("click", function () {
            state = clone(initial);
            save();
            render();
        });

        store.mount(stateTools, function () { return state; });
        store.track(function () { return state; });
        render();
    }

    function moveTranslationAfterQuiz() {
        const quiz = document.getElementById("learning-task");
        const panel = document.querySelector("[data-multilang-scaffold='auto']");
        if (!quiz || !panel || panel.closest(".c16-translation-help")) return Boolean(panel);
        const details = document.createElement("details");
        details.className = "c16-translation-help";
        const summary = document.createElement("summary");
        summary.textContent = "필요하면 번역 도움말 보기";
        details.appendChild(summary);
        panel.parentNode.insertBefore(details, panel);
        details.appendChild(panel);
        quiz.insertAdjacentElement("afterend", details);
        return true;
    }

    function arrangePage() {
        const main = document.querySelector("main");
        const hero = document.querySelector("[data-c16-hero]");
        const quiz = document.getElementById("learning-task");
        if (main && hero && quiz && hero.nextElementSibling !== quiz) {
            hero.insertAdjacentElement("afterend", quiz);
        }

        if (main) {
            const explainers = Array.from(main.children).filter(function (child) {
                return child.hasAttribute("data-c16-explanation");
            });
            if (explainers.length && !explainers[0].parentElement.classList.contains("c16-optional-help")) {
                const details = document.createElement("details");
                details.className = "c16-optional-help";
                const summary = document.createElement("summary");
                summary.textContent = "표현을 더 살펴보기";
                details.appendChild(summary);
                explainers[0].parentNode.insertBefore(details, explainers[0]);
                explainers.forEach(function (section) { details.appendChild(section); });
            }
        }

        moveTranslationAfterQuiz();
    }

    function initLayoutWhenReady() {
        arrangePage();
        if (moveTranslationAfterQuiz()) return;
        const observer = new MutationObserver(function () {
            if (moveTranslationAfterQuiz()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(function () { observer.disconnect(); }, 2000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLayoutWhenReady);
    } else {
        initLayoutWhenReady();
    }

    window.C16GrammarMainUX = { initQuiz: initQuiz, arrangePage: arrangePage };
})();
