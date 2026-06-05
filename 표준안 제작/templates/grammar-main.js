/**
 * grammar-main.js  ─  문법 메인 페이지 공유 로직 (표준안 버전)
 *
 * 변경 이력:
 *   c17 원본(C17_GRAMMAR_PAGE) → 표준 명칭(GRAMMAR_PAGE_CONFIG)으로 변경
 *   viToggle / vi-on 제거 → multilang-toggle.js 로 위임
 *
 * 사용법:
 *   1. HTML 페이지에서 window.GRAMMAR_PAGE_CONFIG = { ... } 정의 후 이 파일 로드
 *   2. multilang-toggle.js 를 함께 로드하면 번역 토글 자동 처리
 */
(function () {
    "use strict";

    // 구 명칭(C17_GRAMMAR_PAGE)도 폴백으로 지원하여 c17 기존 파일과 호환
    const config = window.GRAMMAR_PAGE_CONFIG || window.C17_GRAMMAR_PAGE;

    if (!config) {
        return;
    }

    const tabLearn    = document.getElementById("tabLearn");
    const tabPractice = document.getElementById("tabPractice");
    const learnPanel  = document.getElementById("learnPanel");
    const practicePanel = document.getElementById("practicePanel");
    const quizTitle   = document.getElementById("quizTitle");
    const quizCount   = document.getElementById("quizCount");
    const progressBar = document.getElementById("progressBar");
    const promptEl    = document.getElementById("prompt");
    const hintEl      = document.getElementById("hint");
    const choicesEl   = document.getElementById("choices");
    const feedbackEl  = document.getElementById("feedback");
    const nextBtn     = document.getElementById("nextBtn");
    const resetBtn    = document.getElementById("resetBtn");
    const resultCard  = document.getElementById("resultCard");

    const state = {
        index: 0,
        score: 0,
        answered: false,
        started: false
    };

    /* ── 탭 전환 ───────────────────────────────────────── */
    function showTab(name) {
        const isLearn = name === "learn";
        learnPanel.hidden  = !isLearn;
        practicePanel.hidden = isLearn;
        tabLearn.classList.toggle("active", isLearn);
        tabPractice.classList.toggle("active", !isLearn);

        if (!isLearn && !state.started) {
            state.started = true;
            renderQuestion();
        }
    }

    /* ── 피드백 ────────────────────────────────────────── */
    function setFeedback(kind, html) {
        feedbackEl.className = "feedback show " + kind;
        feedbackEl.innerHTML = html;
    }
    function clearFeedback() {
        feedbackEl.className = "feedback";
        feedbackEl.textContent = "";
    }

    /* ── 문항 렌더링 ───────────────────────────────────── */
    function renderQuestion() {
        const item = config.quiz[state.index];
        state.answered = false;

        if (quizTitle) quizTitle.textContent = config.quizTitle || "빠른 확인";
        quizCount.textContent = (state.index + 1) + " / " + config.quiz.length;
        progressBar.style.width = ((state.index / config.quiz.length) * 100) + "%";

        promptEl.innerHTML  = item.prompt;
        hintEl.textContent  = item.hint || "";
        choicesEl.innerHTML = "";
        clearFeedback();
        nextBtn.disabled = true;
        nextBtn.innerHTML = state.index === config.quiz.length - 1
            ? '결과 보기 <i class="fa-solid fa-check"></i>'
            : '다음 <i class="fa-solid fa-arrow-right"></i>';
        resultCard.classList.remove("show");

        item.choices.forEach(function (choice, i) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "choice";
            btn.innerHTML = choice;
            btn.addEventListener("click", function () { handleChoice(i); });
            choicesEl.appendChild(btn);
        });
    }

    /* ── 선택지 처리 ───────────────────────────────────── */
    function handleChoice(choiceIndex) {
        if (state.answered) return;

        const item     = config.quiz[state.index];
        const buttons  = Array.from(choicesEl.querySelectorAll("button"));
        const isCorrect = choiceIndex === item.answer;

        state.answered = true;
        if (isCorrect) state.score += 1;

        buttons.forEach(function (btn, i) {
            btn.disabled = true;
            if (i === item.answer)     btn.classList.add("correct");
            else if (i === choiceIndex) btn.classList.add("wrong");
            else                        btn.classList.add("dimmed");
        });

        setFeedback(
            isCorrect ? "ok" : "bad",
            "<strong>" + (isCorrect ? "정답!" : "다시 확인!") + "</strong> " + item.feedback
        );
        nextBtn.disabled = false;
        progressBar.style.width = (((state.index + 1) / config.quiz.length) * 100) + "%";
    }

    /* ── 결과 카드 ─────────────────────────────────────── */
    function renderSummary() {
        const pct = Math.round((state.score / config.quiz.length) * 100);
        quizCount.textContent = "완료";
        progressBar.style.width = "100%";
        promptEl.textContent = "연습 완료";
        hintEl.textContent   = config.summaryHint || "예문을 다시 보면서 틀린 유형을 확인해 보세요.";
        choicesEl.innerHTML  = "";
        clearFeedback();
        nextBtn.disabled = true;
        resultCard.classList.add("show");
        resultCard.innerHTML =
            "<h2>" + state.score + " / " + config.quiz.length + "</h2>" +
            "<p>정답률 " + pct + "%. " + (config.summary || "") + "</p>";
    }

    /* ── 이벤트 ────────────────────────────────────────── */
    tabLearn.addEventListener("click", function () { showTab("learn"); });
    tabPractice.addEventListener("click", function () { showTab("practice"); });

    nextBtn.addEventListener("click", function () {
        if (state.index === config.quiz.length - 1) {
            renderSummary();
        } else {
            state.index += 1;
            renderQuestion();
        }
    });

    resetBtn.addEventListener("click", function () {
        state.index   = 0;
        state.score   = 0;
        state.started = true;
        renderQuestion();
    });

})();
