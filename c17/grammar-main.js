(function () {
    "use strict";

    const config = window.C17_GRAMMAR_PAGE;
    if (!config) {
        return;
    }

    const pageId = (window.location.pathname.match(/grammar(\d+)\.html$/i) || [null, "page"])[1];
    const initialState = {
        index: 0,
        score: 0,
        answered: false,
        started: false,
        selectedChoice: null,
        complete: false,
        tab: "learn"
    };
    const stateStore = window.C17ActivityState.create("grammar" + pageId, initialState, {
        validate: function (value) {
            return Boolean(value)
                && Number.isInteger(value.index)
                && value.index >= 0
                && value.index < config.quiz.length
                && Number.isInteger(value.score)
                && value.score >= 0
                && value.score <= config.quiz.length
                && typeof value.answered === "boolean"
                && typeof value.started === "boolean"
                && (value.selectedChoice === null || Number.isInteger(value.selectedChoice))
                && typeof value.complete === "boolean"
                && (value.tab === "learn" || value.tab === "practice");
        },
        onReset: function () {
            window.location.reload();
        }
    });
    const state = stateStore.get();

    const tabLearn = document.getElementById("tabLearn");
    const tabPractice = document.getElementById("tabPractice");
    const learnPanel = document.getElementById("learnPanel");
    const practicePanel = document.getElementById("practicePanel");
    const quizTitle = document.getElementById("quizTitle");
    const quizCount = document.getElementById("quizCount");
    const progressBar = document.getElementById("progressBar");
    const promptEl = document.getElementById("prompt");
    const hintEl = document.getElementById("hint");
    const choicesEl = document.getElementById("choices");
    const feedbackEl = document.getElementById("feedback");
    const nextBtn = document.getElementById("nextBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultCard = document.getElementById("resultCard");

    function saveState() {
        stateStore.save(state);
    }

    function showTab(name) {
        const isLearn = name === "learn";
        state.tab = isLearn ? "learn" : "practice";
        learnPanel.hidden = !isLearn;
        practicePanel.hidden = isLearn;
        tabLearn.classList.toggle("active", isLearn);
        tabPractice.classList.toggle("active", !isLearn);
        tabLearn.setAttribute("aria-selected", String(isLearn));
        tabPractice.setAttribute("aria-selected", String(!isLearn));

        if (!isLearn) {
            state.started = true;
            if (state.complete) {
                renderSummary();
            } else {
                renderQuestion();
            }
        }
        saveState();
    }

    function setFeedback(kind, html) {
        feedbackEl.className = "feedback show " + kind;
        feedbackEl.innerHTML = html;
    }

    function clearFeedback() {
        feedbackEl.className = "feedback";
        feedbackEl.textContent = "";
    }

    function paintAnswer(choiceIndex) {
        const item = config.quiz[state.index];
        const isCorrect = choiceIndex === item.answer;
        Array.from(choicesEl.querySelectorAll("button")).forEach(function (button, index) {
            button.disabled = true;
            if (index === item.answer) {
                button.classList.add("correct");
            } else if (index === choiceIndex) {
                button.classList.add("wrong");
            } else {
                button.classList.add("dimmed");
            }
        });
        setFeedback(
            isCorrect ? "ok" : "bad",
            "<strong>" + (isCorrect ? "정답!" : "다시 확인!") + "</strong> " + item.feedback
        );
        nextBtn.disabled = false;
        progressBar.style.width = (((state.index + 1) / config.quiz.length) * 100) + "%";
    }

    function renderQuestion() {
        const item = config.quiz[state.index];
        quizTitle.textContent = config.quizTitle || "빠른 확인";
        quizCount.textContent = (state.index + 1) + " / " + config.quiz.length;
        progressBar.style.width = ((state.index / config.quiz.length) * 100) + "%";
        promptEl.textContent = item.prompt;
        hintEl.textContent = item.hint || "";
        choicesEl.innerHTML = "";
        clearFeedback();
        nextBtn.disabled = true;
        nextBtn.innerHTML = state.index === config.quiz.length - 1
            ? '결과 보기 <i class="fa-solid fa-check"></i>'
            : '다음 <i class="fa-solid fa-arrow-right"></i>';
        resultCard.classList.remove("show");

        item.choices.forEach(function (choice, choiceIndex) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice";
            button.textContent = choice;
            button.addEventListener("click", function () {
                handleChoice(choiceIndex);
            });
            choicesEl.appendChild(button);
        });

        if (state.answered && state.selectedChoice !== null) {
            paintAnswer(state.selectedChoice);
        }
    }

    function handleChoice(choiceIndex) {
        if (state.answered) {
            return;
        }

        const item = config.quiz[state.index];
        state.answered = true;
        state.selectedChoice = choiceIndex;
        if (choiceIndex === item.answer) {
            state.score += 1;
        }
        paintAnswer(choiceIndex);
        saveState();
    }

    function renderSummary() {
        const percent = Math.round((state.score / config.quiz.length) * 100);
        state.complete = true;
        quizCount.textContent = "완료";
        progressBar.style.width = "100%";
        promptEl.textContent = "연습 완료";
        hintEl.textContent = config.summaryHint || "예문을 다시 보면서 틀린 유형을 확인해 보세요.";
        choicesEl.innerHTML = "";
        clearFeedback();
        nextBtn.disabled = true;
        resultCard.classList.add("show");
        resultCard.innerHTML = ""
            + "<h2>" + state.score + " / " + config.quiz.length + "</h2>"
            + "<p>정답률 " + percent + "%입니다. " + (config.summary || "") + "</p>";
        saveState();
    }

    tabLearn.addEventListener("click", function () {
        showTab("learn");
    });

    tabPractice.addEventListener("click", function () {
        showTab("practice");
    });

    nextBtn.addEventListener("click", function () {
        if (state.index === config.quiz.length - 1) {
            renderSummary();
            return;
        }
        state.index += 1;
        state.answered = false;
        state.selectedChoice = null;
        saveState();
        renderQuestion();
    });

    resetBtn.addEventListener("click", function () {
        state.index = 0;
        state.score = 0;
        state.answered = false;
        state.started = true;
        state.selectedChoice = null;
        state.complete = false;
        state.tab = "practice";
        saveState();
        renderQuestion();
    });

    stateStore.mount(document.getElementById("activityStateTools"), function () {
        return state;
    });
    showTab(state.tab);
})();
