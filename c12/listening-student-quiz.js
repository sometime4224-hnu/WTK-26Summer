(function initC12ListeningStudentQuiz() {
    const lessons = {
        listen1: {
            id: "listen1",
            title: "듣기 1: 건강 상담과 다리 통증",
            sequenceTitle: "상담 흐름 순서 맞추기",
            tags: ["건강 상담", "백화점", "다리 통증", "스트레칭"],
            panels: [
                { id: "l1-1", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-01.webp", title: "건강 상담 방송 시작" },
                { id: "l1-2", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-02.webp", title: "시청자 고민 연결" },
                { id: "l1-3", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-03.webp", title: "백화점 판매 일" },
                { id: "l1-4", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-04.webp", title: "계단 오르기 힘듦" },
                { id: "l1-5", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-05.webp", title: "밤 10시 귀가" },
                { id: "l1-6", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-06.webp", title: "발목 자주 움직이기" },
                { id: "l1-7", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-07.webp", title: "다리 올리고 스트레칭" },
                { id: "l1-8", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-08.webp", title: "뜨거운 수건 마사지" },
                { id: "l1-9", image: "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-09.webp", title: "3센티미터 구두 굽" }
            ],
            questions: [
                {
                    prompt: "이 대화는 건강 상담 프로그램입니다.",
                    answer: "O",
                    explanation: "도입에서 생활 속 건강 상담 시간이라고 소개합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "여자는 백화점에서 매일 서서 일해서 다리가 아프다고 말합니다.",
                    answer: "O",
                    explanation: "판매 일을 해서 하루 종일 서 있고, 다리가 붓고 무릎이 아프다고 합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자는 다리가 아플 때 찬 수건으로 마사지하라고 조언합니다.",
                    answer: "X",
                    explanation: "찬 수건이 아니라 뜨거운 수건으로 마사지하는 것도 좋다고 했습니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "무슨 프로그램입니까?",
                    answer: "1",
                    explanation: "도입에서 건강 상담 프로그램임을 알 수 있습니다.",
                    options: [["1", "건강 상담"], ["2", "운동 강습"], ["3", "직업 상담"]]
                },
                {
                    prompt: "여자는 어떤 고민이 있습니까?",
                    answer: "3",
                    explanation: "여자는 서서 일해서 다리가 아프다고 말합니다.",
                    options: [["1", "운동을 매우 싫어한다"], ["2", "운동 방법을 잘 모른다"], ["3", "매일 서서 일을 해서 다리가 아프다"]]
                },
                {
                    prompt: "여자가 다리 건강을 위해서 할 수 있는 일은 무엇입니까?",
                    answer: "2",
                    explanation: "자기 전에 다리를 위로 올리고 가볍게 스트레칭하라는 조언이 나옵니다.",
                    options: [["1", "굽이 없는 구두를 신는다"], ["2", "자기 전에 가볍게 스트레칭을 한다"], ["3", "다리가 아플 때에는 찬 수건으로 마사지를 한다"]]
                }
            ]
        },
        listen2: {
            id: "listen2",
            title: "듣기 2: 복근 만들기와 운동 습관",
            sequenceTitle: "운동 상담 흐름 순서 맞추기",
            tags: ["운동 효과", "복근", "줄넘기", "회식"],
            panels: [
                { id: "l2-1", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-01.webp", title: "몸이 좋아짐" },
                { id: "l2-2", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-02.webp", title: "달리기와 근육 운동" },
                { id: "l2-3", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-03.webp", title: "복근 만들기 목표" },
                { id: "l2-4", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-04.webp", title: "윗몸 일으키기 질문" },
                { id: "l2-5", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-05.webp", title: "운동과 음식 조언" },
                { id: "l2-6", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-06.webp", title: "회식 때문에 곤란" },
                { id: "l2-7", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-07.webp", title: "계속 노력하면 효과" },
                { id: "l2-8", image: "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-08.webp", title: "운동 후 회사 변화" }
            ],
            questions: [
                {
                    prompt: "남자는 하루도 빠짐없이 운동했다고 말합니다.",
                    answer: "O",
                    explanation: "남자는 하루도 빠짐없이 달리기와 근육 운동을 했다고 말합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "여자는 윗몸 일으키기만 하면 복근을 만들 수 있다고 말합니다.",
                    answer: "X",
                    explanation: "윗몸 일으키기만 해서는 안 되고 줄넘기나 옆구리 운동도 함께해야 한다고 합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자는 운동을 시작하고 나서 회사에서 인기도 많아졌다고 말합니다.",
                    answer: "O",
                    explanation: "마지막 부분에서 운동 후 달라진 점으로 회사에서 인기가 많아진 일을 말합니다.",
                    options: [["O", "O"], ["X", "X"]]
                },
                {
                    prompt: "남자가 말한 내용과 다른 것은 무엇입니까?",
                    answer: "2",
                    explanation: "남자는 달리기와 근육 운동을 함께 했습니다.",
                    options: [["1", "매일 꾸준히 운동했다"], ["2", "달리기만 했다"], ["3", "근육 운동을 했다"]]
                },
                {
                    prompt: "들은 내용과 맞는 것을 고르십시오.",
                    answer: "3",
                    explanation: "여자는 복근을 만들려면 줄넘기나 옆구리 운동도 하는 것이 좋다고 말합니다.",
                    options: [["1", "복근을 만드는 데에는 윗몸 일으키기가 가장 좋다"], ["2", "복근 운동을 할 때는 무엇이든지 많이 먹는 게 좋다"], ["3", "복근을 만들려면 줄넘기나 옆구리 운동도 하는 것이 좋다"]]
                },
                {
                    prompt: "남자가 운동 후 달라진 점이 아닌 것을 고르십시오.",
                    answer: "1",
                    explanation: "여자 친구가 생겼다는 내용은 나오지 않습니다.",
                    options: [["1", "여자 친구가 생겼다"], ["2", "기분이 상쾌해졌다"], ["3", "배가 들어갔다"]]
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
