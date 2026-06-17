(function initC11ListeningStudentQuiz() {
    const lessons = {
        listen1: {
            id: "listen1",
            title: "듣기 1: 아웃도어 매장 첫날",
            sequenceTitle: "그림 순서 맞추기",
            tags: ["첫 출근", "업무 지시", "마네킹", "포스터 위치"],
            panels: [
                { id: "l1-1", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-01.webp", title: "첫 출근 인사" },
                { id: "l1-2", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-02.webp", title: "첫날 업무 안내" },
                { id: "l1-3", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-03.webp", title: "점퍼 입히기" },
                { id: "l1-4", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-04.webp", title: "모자와 등산화" },
                { id: "l1-5", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-05.webp", title: "포스터 위치" },
                { id: "l1-6", image: "../assets/c11/listening/cuttoon/listening1/listening1-cuttoon-panel-06.webp", title: "창고에 다녀오기" }
            ],
            questions: [
                {
                    prompt: "남자는 오늘 처음 매장에 출근했습니다.",
                    answer: "O",
                    explanation: "여자가 오늘은 첫날이라고 말합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "마네킹에는 운동화를 신겨야 합니다.",
                    answer: "X",
                    explanation: "운동화가 아니라 등산화로 갈아 신기라고 했습니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "포스터는 계산대 아래에 붙이는 것이 좋습니다.",
                    answer: "O",
                    explanation: "여자가 문 앞보다 계산대 아래가 좋겠다고 정정합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자는 전에 어디에서 일했습니까?",
                    answer: "2",
                    explanation: "여자는 남자가 전에도 옷가게에서 일한 적이 있다고 말합니다.",
                    options: [["1", "신발 가게"], ["2", "옷가게"], ["3", "모자 가게"], ["4", "서점"]]
                },
                {
                    prompt: "여자가 남자에게 가장 먼저 시킨 일은 무엇입니까?",
                    answer: "3",
                    explanation: "우선 마네킹의 옷을 벗기고 점퍼를 입히라고 했습니다.",
                    options: [["1", "포스터 붙이기"], ["2", "신발 갈아 신기기"], ["3", "마네킹 옷 입히기"], ["4", "창고 다녀오기"]]
                },
                {
                    prompt: "포스터는 어디에 붙이는 것이 좋다고 했습니까?",
                    answer: "3",
                    explanation: "가게 문 앞보다 계산대 아래에 붙이는 것이 좋다고 했습니다.",
                    options: [["1", "가게 문 앞"], ["2", "창고 문"], ["3", "계산대 아래"], ["4", "마네킹 옆"]]
                },
                {
                    prompt: "대화 내용과 다른 것은 무엇입니까?",
                    answer: "4",
                    explanation: "대화에서는 운동화가 아니라 등산화로 갈아 신기라고 했습니다.",
                    options: [["1", "오늘은 남자가 일하는 첫날입니다."], ["2", "남자는 마네킹에 모자를 씌워야 합니다."], ["3", "여자는 창고에 물건을 가지러 갑니다."], ["4", "남자는 마네킹에 운동화를 신겨야 합니다."]]
                }
            ]
        },
        listen2: {
            id: "listen2",
            title: "듣기 2: 이직을 고민하는 직장인",
            sequenceTitle: "그림 순서 맞추기",
            tags: ["이직 고민", "연봉", "휴가와 야근", "회사 장점"],
            panels: [
                { id: "l2-1", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-01.webp", title: "이직 고민" },
                { id: "l2-2", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-02.webp", title: "연봉은 좋지만" },
                { id: "l2-3", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-03.webp", title: "바쁜 회사 생활" },
                { id: "l2-4", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-04.webp", title: "옮긴다면?" },
                { id: "l2-5", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-05.webp", title: "바라는 새 회사" },
                { id: "l2-6", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-06.webp", title: "현실적인 조언" },
                { id: "l2-7", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-07.webp", title: "좋은 점 생각하기" },
                { id: "l2-8", image: "../assets/c11/listening/cuttoon/listening2/listening2-cuttoon-panel-08.webp", title: "다시 생각하기" }
            ],
            questions: [
                {
                    prompt: "남자는 연봉이 낮아서 회사를 옮기고 싶어 합니다.",
                    answer: "X",
                    explanation: "연봉은 마음에 들지만 너무 바빠서 고민한다고 했습니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자는 휴가가 길고 야근이 없는 회사를 원합니다.",
                    answer: "O",
                    explanation: "남자가 새 회사의 조건으로 직접 말한 내용입니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "현재 회사의 좋은 점으로 동료와 상사가 나옵니다.",
                    answer: "O",
                    explanation: "동료들이 마음에 들고 새 상사도 잘해 준다고 했습니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자가 이직을 고민하는 가장 큰 이유는 무엇입니까?",
                    answer: "2",
                    explanation: "너무 바빠서 자기 생활이 없다고 말합니다.",
                    options: [["1", "연봉이 너무 낮아서"], ["2", "너무 바빠서"], ["3", "동료들과 갈등이 있어서"], ["4", "집에서 너무 멀어서"]]
                },
                {
                    prompt: "남자가 새 회사에서 바라는 조건으로 맞는 것은 무엇입니까?",
                    answer: "2",
                    explanation: "휴가가 길고 야근이 없는 회사를 원한다고 말합니다.",
                    options: [["1", "연봉이 지금보다 훨씬 높다"], ["2", "휴가가 길다"], ["3", "사무실이 더 넓다"], ["4", "집에서 훨씬 더 가깝다"]]
                },
                {
                    prompt: "남자가 현재 회사의 장점으로 말하지 않은 것은 무엇입니까?",
                    answer: "4",
                    explanation: "집에서 가깝고 동료, 상사, 분위기가 좋다고 했지만 월급이 많다고는 말하지 않았습니다.",
                    options: [["1", "집에서 가깝다"], ["2", "동료들이 좋다"], ["3", "상사가 잘해준다"], ["4", "월급이 많다"]]
                },
                {
                    prompt: "대화 마지막에 남자는 어떻게 하기로 했습니까?",
                    answer: "3",
                    explanation: "이직 문제를 다시 한 번 생각해 보겠다고 했습니다.",
                    options: [["1", "바로 회사를 그만두기로 했다"], ["2", "친구에게 회사를 소개해 달라고 했다"], ["3", "이직 문제를 다시 생각해 보기로 했다"], ["4", "상사에게 휴가를 달라고 하기로 했다"]]
                }
            ]
        }
    };

    const root = document.getElementById("app");
    if (!root) return;

    const pageDefault = document.body.dataset.defaultLesson;
    const isSingleLesson = document.body.dataset.singleLesson === "true";
    const state = {
        activeLesson: lessons[pageDefault] ? pageDefault : "listen1",
        selectedPanelId: null,
        lessons: {}
    };

    function shuffle(items) {
        const copy = [...items];
        for (let index = copy.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
        }
        return copy;
    }

    function ensureLessonState(lessonId) {
        if (!state.lessons[lessonId]) resetLessonState(lessonId);
        return state.lessons[lessonId];
    }

    function resetLessonState(lessonId) {
        const lesson = lessons[lessonId];
        state.lessons[lessonId] = {
            pool: shuffle(lesson.panels.map((panel) => panel.id)),
            slots: Array(lesson.panels.length).fill(null),
            sequenceSubmitted: false,
            quizSubmitted: false,
            answers: {}
        };
        state.selectedPanelId = null;
    }

    function getPanel(lessonId, panelId) {
        return lessons[lessonId].panels.find((panel) => panel.id === panelId);
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderPictureCard(lessonId, panelId, location, slotIndex = "") {
        const panel = getPanel(lessonId, panelId);
        const selected = state.selectedPanelId === panelId ? " is-selected" : "";
        return `
            <button
                type="button"
                class="picture-card${selected}"
                data-panel-id="${escapeHtml(panelId)}"
                data-location="${escapeHtml(location)}"
                data-slot-index="${escapeHtml(slotIndex)}"
                aria-label="${escapeHtml(panel.title)}"
            >
                <img src="${escapeHtml(panel.image)}" alt="">
                <span class="picture-card__title">${escapeHtml(panel.title)}</span>
            </button>
        `;
    }

    function renderSequence(lessonId) {
        const lesson = lessons[lessonId];
        const lessonState = ensureLessonState(lessonId);
        const correctOrder = lesson.panels.map((panel) => panel.id);
        const slots = lessonState.slots.map((panelId, index) => {
            const resultClass = lessonState.sequenceSubmitted
                ? (panelId === correctOrder[index] ? " is-correct" : " is-wrong")
                : "";
            return `
                <div class="drop-slot${resultClass}" data-slot-index="${index}" aria-label="${index + 1}번째 칸">
                    <span class="slot-index">${index + 1}</span>
                    ${panelId ? renderPictureCard(lessonId, panelId, "slot", index) : `<div class="empty-slot">${index + 1}번째</div>`}
                </div>
            `;
        }).join("");
        const pool = lessonState.pool.map((panelId) => renderPictureCard(lessonId, panelId, "pool")).join("");
        const score = getSequenceScore(lessonId);
        const note = lessonState.sequenceSubmitted
            ? `${lesson.panels.length}컷 중 ${score}컷을 알맞은 자리에 놓았습니다.`
            : state.selectedPanelId
                ? "선택한 그림을 넣을 칸을 누르세요."
                : "그림을 듣기 순서대로 위 칸에 배치하세요.";

        return `
            <section class="panel">
                <div class="panel__head">
                    <h2>${escapeHtml(lesson.sequenceTitle)}</h2>
                    <span>${lesson.panels.length}컷</span>
                </div>
                <div class="panel__body sequence-work">
                    <div class="slot-row">${slots}</div>
                    <div class="card-bank" aria-label="그림 카드 모음">
                        ${pool || `<div class="empty-slot">모든 그림을 배치했습니다.</div>`}
                    </div>
                    <div class="actions">
                        <button class="btn sky" type="button" data-action="check-sequence">순서 확인</button>
                        <button class="btn secondary" type="button" data-action="reset-sequence">그림 다시 섞기</button>
                    </div>
                    <div class="result-note" data-tone="${lessonState.sequenceSubmitted && score === lesson.panels.length ? "success" : lessonState.sequenceSubmitted ? "warn" : "info"}">
                        ${escapeHtml(note)}
                    </div>
                </div>
            </section>
        `;
    }

    function renderQuiz(lessonId) {
        const lesson = lessons[lessonId];
        const lessonState = ensureLessonState(lessonId);
        const score = getQuizScore(lessonId);
        const note = lessonState.quizSubmitted
            ? `${lesson.questions.length}문제 중 ${score}문제를 맞혔습니다.`
            : "들은 내용을 바탕으로 답을 고르세요.";
        const questions = lesson.questions.map((question, questionIndex) => {
            const selected = lessonState.answers[questionIndex] || "";
            const isCorrect = selected === question.answer;
            const cardClass = lessonState.quizSubmitted ? (isCorrect ? " is-correct is-submitted" : " is-wrong is-submitted") : "";
            const options = question.options.map(([value, label]) => `
                <label class="option">
                    <input type="radio" name="${lessonId}-q${questionIndex}" value="${escapeHtml(value)}" ${selected === value ? "checked" : ""}>
                    <span>${escapeHtml(label)}</span>
                </label>
            `).join("");
            return `
                <article class="question-card${cardClass}" data-question-index="${questionIndex}">
                    <strong>${questionIndex + 1}. ${escapeHtml(question.prompt)}</strong>
                    ${options}
                    <div class="feedback">${escapeHtml(question.explanation)}</div>
                </article>
            `;
        }).join("");

        return `
            <section class="panel">
                <div class="panel__head">
                    <h2>듣고 문제 풀기</h2>
                    <span>${lesson.questions.length}문제</span>
                </div>
                <div class="panel__body">
                    <div class="quiz-list">${questions}</div>
                    <div class="actions" style="margin-top:10px">
                        <button class="btn" type="button" data-action="check-quiz">채점하기</button>
                        <button class="btn secondary" type="button" data-action="reset-quiz">답 지우기</button>
                    </div>
                    <div class="result-note" data-tone="${lessonState.quizSubmitted && score === lesson.questions.length ? "success" : lessonState.quizSubmitted ? "warn" : "info"}" style="margin-top:10px">
                        ${escapeHtml(note)}
                    </div>
                </div>
            </section>
        `;
    }

    function renderLessonTabs() {
        if (isSingleLesson) return "";
        return `
            <div class="lesson-summary" role="tablist" aria-label="듣기 선택">
                ${Object.values(lessons).map((lesson) => `
                    <button class="btn ${lesson.id === state.activeLesson ? "sky" : "secondary"}" type="button" data-tab="${escapeHtml(lesson.id)}" aria-selected="${lesson.id === state.activeLesson}">
                        ${escapeHtml(lesson.title)}
                    </button>
                `).join("")}
            </div>
        `;
    }

    function renderLesson() {
        const lessonId = state.activeLesson;
        const lesson = lessons[lessonId];
        ensureLessonState(lessonId);
        root.innerHTML = `
            ${renderLessonTabs()}
            <div class="lesson-summary">
                <span class="chip">${escapeHtml(lesson.title)}</span>
                ${lesson.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <div class="lesson-grid">
                ${renderSequence(lessonId)}
                ${renderQuiz(lessonId)}
            </div>
        `;
        updateTotalScore();
    }

    function getSequenceScore(lessonId) {
        const lesson = lessons[lessonId];
        const lessonState = ensureLessonState(lessonId);
        return lessonState.slots.reduce((score, panelId, index) => (
            score + (panelId === lesson.panels[index].id ? 1 : 0)
        ), 0);
    }

    function getQuizScore(lessonId) {
        const lesson = lessons[lessonId];
        const lessonState = ensureLessonState(lessonId);
        return lesson.questions.reduce((score, question, index) => (
            score + (lessonState.answers[index] === question.answer ? 1 : 0)
        ), 0);
    }

    function updateTotalScore() {
        const scoreEl = document.getElementById("total-score");
        if (!scoreEl) return;
        const lessonId = state.activeLesson;
        const lesson = lessons[lessonId];
        const lessonState = ensureLessonState(lessonId);
        const sequenceScore = lessonState.sequenceSubmitted ? getSequenceScore(lessonId) : null;
        const quizScore = lessonState.quizSubmitted ? getQuizScore(lessonId) : null;
        const parts = [];
        if (sequenceScore != null) parts.push(`순서 ${sequenceScore}/${lesson.panels.length}`);
        if (quizScore != null) parts.push(`문제 ${quizScore}/${lesson.questions.length}`);
        scoreEl.textContent = parts.length ? parts.join(" · ") : "결과 대기";
    }

    function removePanelFromCurrentLocation(lessonState, panelId) {
        lessonState.pool = lessonState.pool.filter((id) => id !== panelId);
        lessonState.slots = lessonState.slots.map((id) => id === panelId ? null : id);
    }

    function getPanelSlotIndex(lessonState, panelId) {
        return lessonState.slots.findIndex((id) => id === panelId);
    }

    function placePanel(lessonId, panelId, slotIndex) {
        const lessonState = ensureLessonState(lessonId);
        if (!panelId || slotIndex < 0 || slotIndex >= lessonState.slots.length) return;
        const sourceSlotIndex = getPanelSlotIndex(lessonState, panelId);
        const replaced = lessonState.slots[slotIndex];

        if (sourceSlotIndex === slotIndex) {
            state.selectedPanelId = null;
            renderLesson();
            return;
        }

        lessonState.pool = lessonState.pool.filter((id) => id !== panelId);
        if (sourceSlotIndex >= 0) {
            lessonState.slots[sourceSlotIndex] = replaced || null;
        } else if (replaced && replaced !== panelId && !lessonState.pool.includes(replaced)) {
            lessonState.pool.push(replaced);
        }
        lessonState.slots[slotIndex] = panelId;
        lessonState.sequenceSubmitted = false;
        state.selectedPanelId = null;
        renderLesson();
    }

    function returnPanelToPool(lessonId, panelId) {
        const lessonState = ensureLessonState(lessonId);
        removePanelFromCurrentLocation(lessonState, panelId);
        if (!lessonState.pool.includes(panelId)) lessonState.pool.push(panelId);
        lessonState.sequenceSubmitted = false;
        state.selectedPanelId = null;
        renderLesson();
    }

    document.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-tab]");
        if (tab) {
            state.activeLesson = tab.dataset.tab;
            state.selectedPanelId = null;
            renderLesson();
            return;
        }

        const card = event.target.closest(".picture-card");
        if (card) {
            const panelId = card.dataset.panelId;
            const slotIndex = card.dataset.location === "slot" ? Number(card.dataset.slotIndex) : null;
            if (state.selectedPanelId && state.selectedPanelId !== panelId && slotIndex != null) {
                placePanel(state.activeLesson, state.selectedPanelId, slotIndex);
                return;
            }
            state.selectedPanelId = state.selectedPanelId === panelId ? null : panelId;
            renderLesson();
            return;
        }

        const slot = event.target.closest(".drop-slot");
        if (slot && state.selectedPanelId) {
            placePanel(state.activeLesson, state.selectedPanelId, Number(slot.dataset.slotIndex));
            return;
        }

        const bank = event.target.closest(".card-bank");
        if (bank && state.selectedPanelId) {
            returnPanelToPool(state.activeLesson, state.selectedPanelId);
            return;
        }

        const action = event.target.closest("[data-action]")?.dataset.action;
        if (!action) return;
        const lessonState = ensureLessonState(state.activeLesson);
        if (action === "check-sequence") {
            lessonState.sequenceSubmitted = true;
            renderLesson();
        } else if (action === "reset-sequence") {
            const answers = lessonState.answers;
            const quizSubmitted = lessonState.quizSubmitted;
            resetLessonState(state.activeLesson);
            state.lessons[state.activeLesson].answers = answers;
            state.lessons[state.activeLesson].quizSubmitted = quizSubmitted;
            renderLesson();
        } else if (action === "check-quiz") {
            lessonState.quizSubmitted = true;
            renderLesson();
        } else if (action === "reset-quiz") {
            lessonState.answers = {};
            lessonState.quizSubmitted = false;
            renderLesson();
        }
    });

    document.addEventListener("change", (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
        const card = input.closest("[data-question-index]");
        if (!card) return;
        const lessonState = ensureLessonState(state.activeLesson);
        lessonState.answers[card.dataset.questionIndex] = input.value;
        lessonState.quizSubmitted = false;
        updateTotalScore();
    });

    renderLesson();
})();
