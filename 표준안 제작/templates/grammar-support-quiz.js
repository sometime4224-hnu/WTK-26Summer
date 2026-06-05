/**
 * grammar-support-quiz.js  ─  문법 보조퀴즈 공유 로직 (표준안 버전)
 *
 * 변경 이력:
 *   c17 원본(C17_GRAMMAR_SUPPORT) → 표준 명칭(GRAMMAR_SUPPORT_CONFIG)으로 변경
 *   공개 앱 참조명도 GRAMMAR_SUPPORT_APP 으로 정리
 */
(function () {
    "use strict";

    // 구 명칭(C17_GRAMMAR_SUPPORT)도 폴백으로 지원
    const config = window.GRAMMAR_SUPPORT_CONFIG || window.C17_GRAMMAR_SUPPORT;

    if (!config) { return; }

    const els = {
        stageNav:      document.getElementById("stageNav"),
        stageList:     document.getElementById("stageList"),
        quizPanel:     document.getElementById("quizPanel"),
        stageLabel:    document.getElementById("stageLabel"),
        stageTitle:    document.getElementById("stageTitle"),
        stageFocus:    document.getElementById("stageFocus"),
        questionCount: document.getElementById("questionCount"),
        progressBar:   document.getElementById("progressBar"),
        contextGrid:   document.getElementById("contextGrid"),
        contextKo:     document.getElementById("contextKo"),
        contextVi:     document.getElementById("contextVi"),
        prompt:        document.getElementById("prompt"),
        hint:          document.getElementById("hint"),
        choices:       document.getElementById("choices"),
        feedback:      document.getElementById("feedback"),
        nextBtn:       document.getElementById("nextBtn"),
        resetBtn:      document.getElementById("resetBtn"),
        resultCard:    document.getElementById("resultCard")
    };

    const state = {
        stageIndex: 0,
        questionIndex: 0,
        unlockedStage: 0,
        selectedAnswers: config.stages.map(function (stage) {
            return stage.questions.map(function () { return null; });
        })
    };

    window.GRAMMAR_SUPPORT_APP = { state: state };

    function getCurrentStage()    { return config.stages[state.stageIndex]; }
    function getCurrentQuestion() { return getCurrentStage().questions[state.questionIndex]; }

    function getStageAnsweredCount(si) {
        return state.selectedAnswers[si].filter(function (a) { return a !== null; }).length;
    }
    function getStageScore(si) {
        return state.selectedAnswers[si].reduce(function (s, a, qi) {
            return s + (a === config.stages[si].questions[qi].answer ? 1 : 0);
        }, 0);
    }
    function getTotalScore() {
        return config.stages.reduce(function (t, _s, si) { return t + getStageScore(si); }, 0);
    }
    function getTotalQuestions() {
        return config.stages.reduce(function (t, s) { return t + s.questions.length; }, 0);
    }

    function renderStageNav() {
        els.stageNav.innerHTML = "";
        config.stages.forEach(function (stage, i) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "stage-step" + (i === state.stageIndex ? " is-active" : "");
            btn.disabled = i > state.unlockedStage;
            btn.innerHTML = "<span>" + stage.label + "</span>" + stage.title;
            btn.addEventListener("click", function () {
                state.stageIndex = i;
                const answered = getStageAnsweredCount(i);
                state.questionIndex = answered < stage.questions.length ? answered : 0;
                renderQuestion();
            });
            els.stageNav.appendChild(btn);
        });
    }

    function renderStageList() {
        if (!els.stageList) return;
        els.stageList.innerHTML = "";
        config.stages.forEach(function (stage, i) {
            const card = document.createElement("article");
            card.className = "stage-card" + (i === state.stageIndex ? " is-active" : "");
            card.innerHTML =
                "<p class=\"eyebrow\">" + stage.label + "</p>" +
                "<h3>" + stage.title + "</h3>" +
                "<p>" + stage.focus + "</p>" +
                "<span class=\"stage-score\">" + getStageScore(i) + " / " + stage.questions.length + " 정답</span>";
            els.stageList.appendChild(card);
        });
    }

    function renderContext(q) {
        const has = Boolean(q.contextKo || q.contextVi);
        els.contextGrid.hidden = !has;
        if (!has) { els.contextKo.textContent = ""; els.contextVi.textContent = ""; return; }
        els.contextKo.textContent = q.contextKo || "";
        els.contextVi.textContent = q.contextVi || "";
    }

    function renderChoices(q) {
        const selected = state.selectedAnswers[state.stageIndex][state.questionIndex];
        const answered  = selected !== null;
        els.choices.innerHTML = "";
        q.choices.forEach(function (choice, ci) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "choice-btn";
            btn.textContent = choice;
            if (answered) {
                btn.disabled = true;
                if (ci === q.answer)   btn.classList.add("is-correct");
                else if (ci === selected) btn.classList.add("is-wrong");
                else                   btn.classList.add("is-dimmed");
            } else {
                btn.addEventListener("click", function () { chooseAnswer(ci); });
            }
            els.choices.appendChild(btn);
        });
    }

    function renderFeedback(q) {
        const selected = state.selectedAnswers[state.stageIndex][state.questionIndex];
        if (selected === null) { els.feedback.className = "feedback"; els.feedback.textContent = ""; return; }
        const ok = selected === q.answer;
        els.feedback.className = "feedback is-visible " + (ok ? "is-correct" : "is-wrong");
        els.feedback.innerHTML = "<strong>" + (ok ? "정답!" : "다시 확인!") + "</strong> " + q.feedback;
    }

    function renderQuestion() {
        const stage    = getCurrentStage();
        const q        = getCurrentQuestion();
        const answered = getStageAnsweredCount(state.stageIndex);
        const selected = state.selectedAnswers[state.stageIndex][state.questionIndex];
        const lastQ    = state.questionIndex === stage.questions.length - 1;
        const lastS    = state.stageIndex    === config.stages.length - 1;

        els.quizPanel.hidden = false;
        els.resultCard.classList.remove("is-visible");
        els.resultCard.innerHTML = "";

        els.stageLabel.textContent    = stage.label;
        els.stageTitle.textContent    = stage.title;
        els.stageFocus.innerHTML      = stage.focus;
        els.questionCount.textContent = (state.questionIndex + 1) + " / " + stage.questions.length;
        els.progressBar.style.width   = Math.round((answered / stage.questions.length) * 100) + "%";
        els.prompt.innerHTML          = q.prompt;
        els.hint.innerHTML            = q.hint || "";

        renderContext(q);
        renderChoices(q);
        renderFeedback(q);
        renderStageNav();
        renderStageList();

        els.nextBtn.disabled = (selected === null);
        els.nextBtn.innerHTML = lastQ && lastS
            ? "결과 보기 <i class=\"fa-solid fa-check\"></i>"
            : lastQ
                ? "다음 단계 <i class=\"fa-solid fa-arrow-right\"></i>"
                : "다음 문제 <i class=\"fa-solid fa-arrow-right\"></i>";
    }

    function chooseAnswer(ci) {
        state.selectedAnswers[state.stageIndex][state.questionIndex] = ci;
        renderQuestion();
    }

    function goNext() {
        const stage = getCurrentStage();
        const lastQ = state.questionIndex === stage.questions.length - 1;
        const lastS = state.stageIndex    === config.stages.length - 1;

        if (!lastQ) { state.questionIndex += 1; renderQuestion(); return; }
        if (!lastS) {
            state.stageIndex   += 1;
            state.unlockedStage = Math.max(state.unlockedStage, state.stageIndex);
            state.questionIndex = 0;
            renderQuestion(); return;
        }
        renderFinalResult();
    }

    function resetCurrentStage() {
        state.selectedAnswers[state.stageIndex] = getCurrentStage().questions.map(function () { return null; });
        state.questionIndex = 0;
        renderQuestion();
    }

    function resetAll() {
        state.stageIndex = 0; state.questionIndex = 0; state.unlockedStage = 0;
        state.selectedAnswers = config.stages.map(function (s) { return s.questions.map(function () { return null; }); });
        renderQuestion();
    }

    function renderFinalResult() {
        const total = getTotalQuestions(); const score = getTotalScore();
        const pct = Math.round((score / total) * 100);
        els.quizPanel.hidden = true;
        renderStageNav(); renderStageList();
        const items = config.stages.map(function (s, i) {
            return "<li>" + s.label + " " + s.title + ": " + getStageScore(i) + "/" + s.questions.length + "</li>";
        }).join("");
        els.resultCard.classList.add("is-visible");
        els.resultCard.innerHTML =
            "<p class=\"eyebrow\">완료</p>" +
            "<h2>" + score + " / " + total + " 정답</h2>" +
            "<p>정답률 " + pct + "%. 틀린 단계를 다시 풀어 보세요.</p>" +
            "<ul class=\"result-list\">" + items + "</ul>" +
            "<button id=\"restartQuizBtn\" class=\"next-btn\" type=\"button\"><i class=\"fa-solid fa-rotate-left\"></i> 처음부터 다시</button>";
        document.getElementById("restartQuizBtn").addEventListener("click", resetAll);
    }

    els.nextBtn.addEventListener("click", goNext);
    els.resetBtn.addEventListener("click", resetCurrentStage);
    renderQuestion();
})();
