(function () {
    "use strict";

    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function shuffle(items) {
        return items
            .map(function (value) { return { value: value, sort: Math.random() }; })
            .sort(function (a, b) { return a.sort - b.sort; })
            .map(function (item) { return item.value; });
    }

    function setFeedback(el, kind, html) {
        if (!el) return;
        el.className = "feedback show " + kind;
        el.innerHTML = html;
    }

    function clearFeedback(el) {
        if (!el) return;
        el.className = "feedback";
        el.textContent = "";
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function initTranslationToggle() {
        qsa(".js-vi-toggle").forEach(function (button) {
            const labelOff = button.dataset.labelOff || "Tiếng Việt OFF";
            const labelOn = button.dataset.labelOn || "Tiếng Việt ON";

            function apply(isVisible) {
                document.body.classList.toggle("vi-on", isVisible);
                button.setAttribute("aria-pressed", String(isVisible));
                button.innerHTML = '<i class="fa-solid fa-language"></i> ' + (isVisible ? labelOn : labelOff);
            }

            button.addEventListener("click", function () {
                apply(button.getAttribute("aria-pressed") !== "true");
            });
            apply(false);
        });
    }

    function initTabs() {
        qsa("[data-tab-target]").forEach(function (button) {
            button.addEventListener("click", function () {
                const group = button.dataset.tabGroup || "default";
                const targetId = button.dataset.tabTarget;
                qsa('[data-tab-group="' + group + '"]').forEach(function (tab) {
                    tab.classList.toggle("active", tab === button);
                });
                qsa('[data-tab-panel="' + group + '"]').forEach(function (panel) {
                    panel.hidden = panel.id !== targetId;
                });
            });
        });
    }

    function initVocabulary() {
        const vocab = window.C18_VOCABULARY;
        const grid = qs("#vocabGrid");
        if (!vocab || !grid) return;

        const search = qs("#vocabSearch");
        const cards = [];

        vocab.forEach(function (item) {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            const imageHtml = item.image
                ? '<figure class="vocab-visual">'
                    + '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.imageAlt || (item.term + " 그림 카드")) + '" loading="lazy" decoding="async">'
                    + '<span class="vocab-visual__fallback" aria-hidden="true"><i class="fa-solid fa-image"></i> 이미지 준비 중</span>'
                    + '</figure>'
                : '';
            const card = document.createElement("article");
            card.className = "vocab-card";
            card.dataset.category = item.category;
            card.dataset.search = [item.term, item.meaning, item.vi, item.example, item.imageAlt, tags.join(" ")].join(" ").toLowerCase();
            card.innerHTML = ''
                + imageHtml
                + '<div class="vocab-card__body">'
                + '<span class="badge">' + escapeHtml(item.categoryLabel) + '</span>'
                + '<div class="vocab-term">' + escapeHtml(item.term) + '</div>'
                + '<div class="vocab-meaning">' + escapeHtml(item.meaning) + '</div>'
                + '<div class="vocab-example">' + escapeHtml(item.example) + '</div>'
                + '<div class="vi-text vi-box">' + escapeHtml(item.vi) + '</div>'
                + '</div>';
            const image = qs(".vocab-visual img", card);
            if (image) {
                image.addEventListener("error", function () {
                    card.classList.add("has-image-error");
                    image.remove();
                });
            }
            grid.appendChild(card);
            cards.push(card);
        });

        function applyFilters() {
            const activeFilter = qs("[data-vocab-filter].active");
            const category = activeFilter ? activeFilter.dataset.vocabFilter : "all";
            const query = search ? search.value.trim().toLowerCase() : "";
            let visible = 0;

            cards.forEach(function (card) {
                const categoryMatch = category === "all" || card.dataset.category === category;
                const searchMatch = !query || card.dataset.search.indexOf(query) >= 0;
                const isVisible = categoryMatch && searchMatch;
                card.classList.toggle("is-hidden", !isVisible);
                if (isVisible) visible += 1;
            });

            const count = qs("#vocabVisibleCount");
            if (count) count.textContent = String(visible);
        }

        qsa("[data-vocab-filter]").forEach(function (button) {
            button.addEventListener("click", function () {
                qsa("[data-vocab-filter]").forEach(function (item) { item.classList.remove("active"); });
                button.classList.add("active");
                applyFilters();
            });
        });

        if (search) {
            search.addEventListener("input", applyFilters);
        }

        applyFilters();
        initVocabularyQuiz(vocab);
    }

    function initVocabularyQuiz(vocab) {
        const quizBox = qs("#vocabQuiz");
        if (!quizBox) return;

        const prompt = qs("#vocabQuizPrompt");
        const choices = qs("#vocabQuizChoices");
        const feedback = qs("#vocabQuizFeedback");
        const next = qs("#vocabQuizNext");
        const restart = qs("#vocabQuizRestart");
        const count = qs("#vocabQuizCount");
        const progress = qs("#vocabQuizProgress");
        const quizItems = shuffle(vocab).slice(0, Math.min(8, vocab.length));
        const state = { index: 0, score: 0, answered: false };

        function render() {
            const item = quizItems[state.index];
            state.answered = false;
            prompt.textContent = '"' + item.meaning + '"에 알맞은 18과 어휘는 무엇인가요?';
            count.textContent = (state.index + 1) + " / " + quizItems.length;
            progress.style.width = ((state.index / quizItems.length) * 100) + "%";
            choices.innerHTML = "";
            clearFeedback(feedback);
            next.disabled = true;
            next.innerHTML = state.index === quizItems.length - 1
                ? '결과 보기 <i class="fa-solid fa-check"></i>'
                : '다음 <i class="fa-solid fa-arrow-right"></i>';

            const wrongOptions = shuffle(vocab.filter(function (candidate) {
                return candidate.term !== item.term;
            })).slice(0, 3);
            shuffle([item].concat(wrongOptions)).forEach(function (choice) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "choice";
                button.textContent = choice.term;
                button.addEventListener("click", function () {
                    if (state.answered) return;
                    state.answered = true;
                    const isCorrect = choice.term === item.term;
                    if (isCorrect) state.score += 1;
                    qsa("button", choices).forEach(function (btn) {
                        btn.disabled = true;
                        if (btn.textContent === item.term) btn.classList.add("correct");
                        else if (btn === button) btn.classList.add("wrong");
                        else btn.classList.add("dimmed");
                    });
                    setFeedback(feedback, isCorrect ? "ok" : "bad", '<strong>' + (isCorrect ? "정답!" : "다시 확인!") + '</strong> ' + item.example);
                    progress.style.width = (((state.index + 1) / quizItems.length) * 100) + "%";
                    next.disabled = false;
                });
                choices.appendChild(button);
            });
        }

        function summary() {
            prompt.textContent = "어휘 퀴즈 완료";
            count.textContent = "완료";
            progress.style.width = "100%";
            choices.innerHTML = "";
            setFeedback(feedback, "ok", '<strong>' + state.score + " / " + quizItems.length + '</strong> 맞혔습니다. 틀린 단어는 카드 보기에서 다시 확인하세요.');
            next.disabled = true;
        }

        next.addEventListener("click", function () {
            if (state.index === quizItems.length - 1) {
                summary();
                return;
            }
            state.index += 1;
            render();
        });

        restart.addEventListener("click", function () {
            state.index = 0;
            state.score = 0;
            render();
        });

        render();
    }

    function initGrammar() {
        const config = window.C18_GRAMMAR_PAGE;
        if (!config) return;

        const quizTitle = qs("#quizTitle");
        const quizCount = qs("#quizCount");
        const progressBar = qs("#progressBar");
        const promptEl = qs("#prompt");
        const hintEl = qs("#hint");
        const choicesEl = qs("#choices");
        const feedbackEl = qs("#feedback");
        const nextBtn = qs("#nextBtn");
        const resetBtn = qs("#resetBtn");
        const resultCard = qs("#resultCard");
        const state = { index: 0, score: 0, answered: false };

        if (!quizTitle || !choicesEl) return;

        function renderQuestion() {
            const item = config.quiz[state.index];
            state.answered = false;
            quizTitle.textContent = config.quizTitle || "빠른 확인";
            quizCount.textContent = (state.index + 1) + " / " + config.quiz.length;
            progressBar.style.width = ((state.index / config.quiz.length) * 100) + "%";
            promptEl.textContent = item.prompt;
            hintEl.textContent = item.hint || "";
            choicesEl.innerHTML = "";
            clearFeedback(feedbackEl);
            nextBtn.disabled = true;
            nextBtn.innerHTML = state.index === config.quiz.length - 1
                ? '결과 보기 <i class="fa-solid fa-check"></i>'
                : '다음 <i class="fa-solid fa-arrow-right"></i>';
            resultCard.classList.remove("show");

            item.choices.forEach(function (choice, index) {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "choice";
                button.textContent = choice;
                button.addEventListener("click", function () {
                    if (state.answered) return;
                    state.answered = true;
                    const isCorrect = index === item.answer;
                    if (isCorrect) state.score += 1;
                    qsa("button", choicesEl).forEach(function (btn, btnIndex) {
                        btn.disabled = true;
                        if (btnIndex === item.answer) btn.classList.add("correct");
                        else if (btn === button) btn.classList.add("wrong");
                        else btn.classList.add("dimmed");
                    });
                    setFeedback(feedbackEl, isCorrect ? "ok" : "bad", '<strong>' + (isCorrect ? "정답!" : "다시 확인!") + "</strong> " + item.feedback);
                    progressBar.style.width = (((state.index + 1) / config.quiz.length) * 100) + "%";
                    nextBtn.disabled = false;
                });
                choicesEl.appendChild(button);
            });
        }

        function renderSummary() {
            const percent = Math.round((state.score / config.quiz.length) * 100);
            quizCount.textContent = "완료";
            progressBar.style.width = "100%";
            promptEl.textContent = "연습 완료";
            hintEl.textContent = config.summaryHint || "예문을 다시 보면서 틀린 유형을 확인해 보세요.";
            choicesEl.innerHTML = "";
            clearFeedback(feedbackEl);
            nextBtn.disabled = true;
            resultCard.classList.add("show");
            resultCard.innerHTML = "<strong>" + state.score + " / " + config.quiz.length + "</strong><br>정답률 " + percent + "%입니다. " + (config.summary || "");
        }

        nextBtn.addEventListener("click", function () {
            if (state.index === config.quiz.length - 1) {
                renderSummary();
                return;
            }
            state.index += 1;
            renderQuestion();
        });

        resetBtn.addEventListener("click", function () {
            state.index = 0;
            state.score = 0;
            renderQuestion();
        });

        renderQuestion();
    }

    function initChoiceGroups() {
        qsa("[data-choice-group]").forEach(function (group) {
            const answer = group.dataset.answer;
            const feedback = qs("[data-feedback]", group);
            qsa("[data-choice]", group).forEach(function (button) {
                button.addEventListener("click", function () {
                    const isCorrect = button.dataset.choice === answer;
                    qsa("[data-choice]", group).forEach(function (item) {
                        item.classList.remove("correct", "wrong");
                    });
                    button.classList.add(isCorrect ? "correct" : "wrong");
                    setFeedback(feedback, isCorrect ? "ok" : "bad", isCorrect ? "맞았습니다. 이 장면에서 자연스럽게 쓸 수 있어요." : "다시 생각해 보세요. 장면의 역할과 행동을 먼저 확인하세요.");
                });
            });
        });
    }

    function initSequenceChecks() {
        qsa("[data-sequence-activity]").forEach(function (activity) {
            const button = qs("[data-sequence-check]", activity);
            const feedback = qs("[data-feedback]", activity);
            if (!button) return;
            button.addEventListener("click", function () {
                const selects = qsa("select[data-answer]", activity);
                const isCorrect = selects.every(function (select) {
                    return select.value === select.dataset.answer;
                });
                setFeedback(feedback, isCorrect ? "ok" : "bad", isCorrect ? "순서가 맞습니다. 행동 흐름을 문장으로 말해 보세요." : "아직 순서가 맞지 않습니다. 먼저 무대에서 일어난 일을 시간순으로 배열하세요.");
            });
        });
    }

    function initMockExam() {
        const data = window.C18_MOCK_EXAM;
        const grid = qs("#examGrid");
        if (!data || !grid) return;

        data.questions.forEach(function (question) {
            const card = document.createElement("article");
            card.className = "question-card";
            card.dataset.question = String(question.number);
            card.innerHTML = ''
                + '<span class="badge">' + question.type + '</span>'
                + '<h3>' + question.number + ". " + question.prompt + '</h3>'
                + '<fieldset>'
                + question.options.map(function (option) {
                    const id = "q" + question.number + "-" + option.letter;
                    return '<label for="' + id + '"><input id="' + id + '" type="radio" name="q' + question.number + '" value="' + option.letter + '"> <span>' + option.letter + ". " + option.text + '</span></label>';
                }).join("")
                + '</fieldset>'
                + '<div class="feedback" data-question-feedback></div>';
            grid.appendChild(card);
        });

        const gradeBtn = qs("[data-action='grade']");
        const resetBtn = qs("[data-action='reset']");
        const result = qs("#examResult");

        function grade() {
            let score = 0;
            data.questions.forEach(function (question) {
                const card = qs('.question-card[data-question="' + question.number + '"]');
                const checked = qs('input[name="q' + question.number + '"]:checked');
                const feedback = qs("[data-question-feedback]", card);
                const isCorrect = checked && checked.value === question.answer;
                card.classList.toggle("is-correct", Boolean(isCorrect));
                card.classList.toggle("is-wrong", !isCorrect);
                if (isCorrect) score += 1;
                setFeedback(feedback, isCorrect ? "ok" : "bad", '<strong>' + (isCorrect ? "정답" : "확인") + '</strong> ' + question.explanation);
            });
            result.classList.add("show");
            result.innerHTML = '<strong>' + score + " / " + data.questions.length + '</strong><br>' + data.summary;
        }

        function reset() {
            qsa("input[type='radio']", grid).forEach(function (input) {
                input.checked = false;
            });
            qsa(".question-card", grid).forEach(function (card) {
                card.classList.remove("is-correct", "is-wrong");
                clearFeedback(qs("[data-question-feedback]", card));
            });
            result.classList.remove("show");
            result.textContent = "";
        }

        if (gradeBtn) gradeBtn.addEventListener("click", grade);
        if (resetBtn) resetBtn.addEventListener("click", reset);
    }

    document.addEventListener("DOMContentLoaded", function () {
        initTranslationToggle();
        initTabs();
        initVocabulary();
        initGrammar();
        initChoiceGroups();
        initSequenceChecks();
        initMockExam();
    });
})();
