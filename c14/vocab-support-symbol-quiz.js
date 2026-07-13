(() => {
    "use strict";

    const STORAGE_KEY = "c14-vocab-symbol-quiz-v1";
    const VERSION = 1;

    const CATEGORIES = [
        { id: "life", name: "생활·분위기", short: "생활" },
        { id: "rural", name: "자연·농촌 대상", short: "대상" },
        { id: "action", name: "농촌 동작", short: "동작" },
        { id: "change", name: "존재·상태 변화", short: "변화" },
        { id: "imagine", name: "상상 가능성", short: "상상" }
    ];

    const WORDS = [
        {
            id: "time-room", word: "여유가 있다", category: "life",
            tokens: ["🕘", "────", "🕔", "＋", "😌☕"],
            visualAlt: "두 시계 사이에 빈 시간이 넉넉하고 사람이 천천히 차를 마시는 모습",
            clue: "시계를 걱정하지 않고 천천히 차를 마셔요.",
            meaning: "쓸 수 있는 시간과 마음의 공간이 넉넉해요.",
            distractors: ["time-none", "peaceful", "boring"]
        },
        {
            id: "time-none", word: "여유가 없다", category: "life",
            tokens: ["🕘🕙🕚🕛", "＋", "🏃💦"],
            visualAlt: "시계가 빽빽하게 이어지고 사람이 급하게 뛰는 모습",
            clue: "할 일이 이어져 시계를 보며 급하게 뛰어요.",
            meaning: "시간이 부족해서 마음이 급하고 바빠요.",
            distractors: ["time-room", "lively", "inconvenient"]
        },
        {
            id: "lively", word: "활기차다", category: "life",
            tokens: ["🌞", "＋", "🙌🏃💃", "＋", "⚡"],
            visualAlt: "밝은 곳에서 여러 사람이 즐겁고 힘차게 움직이는 모습",
            clue: "여러 사람이 밝은 표정으로 힘차게 움직여요.",
            meaning: "생기와 힘이 가득해요.",
            distractors: ["peaceful", "boring", "time-none"]
        },
        {
            id: "peaceful", word: "평화롭다", category: "life",
            tokens: ["🏡🌿", "＋", "🕊️", "＋", "😌"],
            visualAlt: "조용한 집과 나무 옆에서 새가 날고 사람이 편안히 쉬는 모습",
            clue: "조용한 풍경에서 걱정 없이 편안히 쉬어요.",
            meaning: "조용하고 걱정 없이 편안해요.",
            distractors: ["lively", "clean-air", "time-room"]
        },
        {
            id: "clean-air", word: "공기가 맑다", category: "life",
            tokens: ["🏔️🌲", "＋", "🌬️✨", "＋", "😊"],
            visualAlt: "산과 나무 사이로 깨끗하고 반짝이는 바람이 부는 모습",
            clue: "산과 나무 사이에 깨끗한 바람이 불어요.",
            meaning: "공기에 먼지나 나쁜 물질이 거의 없어요.",
            distractors: ["polluted", "peaceful", "facilities"]
        },
        {
            id: "polluted", word: "공해가 심하다", category: "life",
            tokens: ["🏭", "＋", "🚗", "→", "🌫️😷"],
            visualAlt: "공장과 자동차에서 짙은 연기가 나오고 사람이 마스크를 쓴 모습",
            clue: "공장 연기와 자동차 매연 때문에 숨쉬기가 힘들어요.",
            meaning: "연기와 오염 물질이 아주 많아요.",
            distractors: ["clean-air", "inconvenient", "facilities"]
        },
        {
            id: "boring", word: "따분하다", category: "life",
            tokens: ["😐🪑", "…", "🕰️", "…", "🥱"],
            visualAlt: "사람이 할 일 없이 앉아 하품하며 시계를 오래 보는 모습",
            clue: "할 일이 없어 하품하며 시계만 봐요.",
            meaning: "재미가 없어서 시간이 느리게 느껴져요.",
            distractors: ["lose-time", "peaceful", "time-none"]
        },
        {
            id: "lose-time", word: "시간 가는 줄 모르다", category: "life",
            tokens: ["🎨😊", "＋", "🕒", "→", "🕘❓"],
            visualAlt: "한 사람이 그림에 푹 빠진 동안 시계 시간이 크게 지나간 모습",
            clue: "한 가지 일에 푹 빠져 긴 시간이 지난 것도 몰라요.",
            meaning: "어떤 일에 푹 빠져 시간이 지난 것도 깨닫지 못해요.",
            distractors: ["boring", "lively", "time-room"]
        },
        {
            id: "facilities", word: "편의 시설이 잘되어 있다", category: "life",
            tokens: ["🏠", "↔", "🏪🏥🚌", "＋", "✅"],
            visualAlt: "집 가까이에 가게와 병원과 버스 정류장이 모두 있는 모습",
            clue: "집 가까이에 생활에 필요한 여러 장소가 있어요.",
            meaning: "생활에 필요한 곳과 시설을 편하게 이용할 수 있어요.",
            distractors: ["inconvenient", "lively", "clean-air"]
        },
        {
            id: "inconvenient", word: "불편하다", category: "life",
            tokens: ["🏠", "────", "🏪🏥🚌", "＋", "😣"],
            visualAlt: "집과 가게와 병원과 버스 정류장이 아주 멀리 떨어진 모습",
            clue: "필요한 곳이 너무 멀어서 이용하기 힘들어요.",
            meaning: "생활하거나 사용하기가 편하지 않아요.",
            distractors: ["facilities", "time-none", "boring"]
        },
        {
            id: "garden", word: "정원", category: "rural",
            tokens: ["🏠", "│", "🌳🌷🌿", "│", "🦋"],
            visualAlt: "집 옆의 작은 울타리 안에 나무와 꽃이 함께 있는 모습",
            clue: "집 옆 작은 뜰에 꽃과 나무를 꾸며 놓았어요.",
            meaning: "집이나 건물 주변에 꾸며 놓은 작은 뜰이에요.",
            distractors: ["grass", "vegetable", "livestock"]
        },
        {
            id: "grass", word: "잔디", category: "rural",
            tokens: ["🏠", "＋", "🟩", "＋", "🌱🌱🌱"],
            visualAlt: "집 앞 땅을 낮고 촘촘한 초록 풀이 덮은 모습",
            clue: "낮고 촘촘한 초록 풀이 땅을 덮고 있어요.",
            meaning: "땅에 낮고 촘촘하게 나는 풀이에요.",
            distractors: ["garden", "vegetable", "farming"]
        },
        {
            id: "vegetable", word: "채소", category: "rural",
            tokens: ["🥬", "＋", "🥕", "＋", "🥒🍆"],
            visualAlt: "먹을 수 있는 여러 가지 잎과 뿌리 식물이 모인 모습",
            clue: "밭에서 길러 먹는 잎과 뿌리 식물이 모여 있어요.",
            meaning: "밭에서 길러 먹는 식물이에요.",
            distractors: ["grass", "fish", "livestock"]
        },
        {
            id: "farming", word: "농사", category: "rural",
            tokens: ["🌱", "→", "🌾", "→", "🧺👩‍🌾"],
            visualAlt: "농부가 논밭에서 작물을 기르고 거두는 전체 과정",
            clue: "논밭에서 작물을 심고 기르고 거두는 전체 일이에요.",
            meaning: "논이나 밭에서 작물을 기르는 일이에요.",
            distractors: ["garden", "vegetable", "livestock"]
        },
        {
            id: "livestock", word: "가축", category: "rural",
            tokens: ["🏠🌾", "＋", "🐄🐖🐐🐓"],
            visualAlt: "농장 울타리 안에서 소와 돼지와 염소와 닭을 기르는 모습",
            clue: "사람이 농장 안에서 여러 동물을 길러요.",
            meaning: "사람이 집이나 농장에서 기르는 동물이에요.",
            distractors: ["fish", "vegetable", "farming"]
        },
        {
            id: "fish", word: "물고기", category: "rural",
            tokens: ["🌊", "＋", "🐟🐟"],
            visualAlt: "물속에서 지느러미가 있는 동물들이 헤엄치는 모습",
            clue: "지느러미로 물속을 헤엄치는 동물이에요.",
            meaning: "물에서 사는 동물이에요.",
            distractors: ["livestock", "vegetable", "grass"]
        },
        {
            id: "tend", word: "가꾸다", category: "action",
            tokens: ["🌱", "＋", "💧✂️👐", "→", "🌿🌷"],
            visualAlt: "이미 심은 식물에 물을 주고 가지를 다듬어 꽃이 피게 돌보는 모습",
            clue: "물도 주고 가지도 다듬으며 계속 돌봐요.",
            meaning: "보기 좋고 건강하게 자라도록 계속 돌봐요.",
            distractors: ["plant", "raise", "mow"]
        },
        {
            id: "mow", word: "깎다", category: "action",
            tokens: ["🌿🌿🌿", "✂️", "→", "🌱🌱"],
            visualAlt: "길게 자란 풀이 가위 뒤에서 짧아진 모습",
            clue: "길게 자란 풀을 짧게 잘라요.",
            meaning: "풀이나 털을 짧게 잘라요.",
            distractors: ["tend", "plant", "catch"]
        },
        {
            id: "plant", word: "심다", category: "action",
            tokens: ["🖐️", "＋", "🌱", "⬇️", "🟫"],
            visualAlt: "손이 어린 식물을 아래쪽 흙 속에 넣는 모습",
            clue: "씨나 어린 식물을 흙 속에 넣어요.",
            meaning: "씨나 어린 식물을 땅속에 넣어요.",
            distractors: ["tend", "raise", "farm-do"]
        },
        {
            id: "raise", word: "키우다", category: "action",
            tokens: ["👐", "＋", "🌱", "→", "🌿", "→", "🌳"],
            visualAlt: "사람의 보살핌을 받으며 작은 싹이 큰 나무가 되는 모습",
            clue: "작은 것이 돌봄을 받으며 점점 크게 자라요.",
            meaning: "작은 것이 자라도록 해요.",
            distractors: ["tend", "plant", "farm-do"]
        },
        {
            id: "farm-do", word: "짓다", category: "action",
            tokens: ["👩‍🌾💪", "＋", "🚜↔", "＋", "🌾"],
            visualAlt: "농부가 논밭을 오가며 직접 곡식을 기르는 일을 하는 모습",
            clue: "농부가 논밭에서 직접 작물을 기르는 일을 해요.",
            meaning: "논밭에서 작물을 기르는 일을 해요.",
            distractors: ["plant", "raise", "catch"]
        },
        {
            id: "catch", word: "잡다", category: "action",
            tokens: ["🎣", "→", "🐟", "→", "✋🪣"],
            visualAlt: "낚싯줄에 걸린 물속 동물을 사람의 손과 통으로 옮기는 모습",
            clue: "낚싯줄에 걸린 것을 끌어 올려 붙들어요.",
            meaning: "움직이는 것을 붙들거나 낚아채요.",
            distractors: ["mow", "plant", "farm-do"]
        },
        {
            id: "disappear", word: "사라지다", category: "change",
            tokens: ["🔴", "→", "◯", "→", "·", "→", "∅"],
            visualAlt: "먼저 있던 빨간 공이 점점 흐려져 마지막에는 완전히 없어진 모습",
            clue: "먼저 있던 것이 나중에는 완전히 없어져요.",
            meaning: "있던 것이 없어져요.",
            distractors: ["appear", "change", "not-recognize"]
        },
        {
            id: "appear", word: "생기다", category: "change",
            tokens: ["∅", "→", "·", "→", "◯", "→", "🔴"],
            visualAlt: "아무것도 없는 곳에 빨간 공이 점점 새로 나타나는 모습",
            clue: "전에 없던 것이 나중에 새로 나타나요.",
            meaning: "없던 것이 새로 나타나요.",
            distractors: ["disappear", "change", "not-recognize"]
        },
        {
            id: "change", word: "변하다", category: "change",
            tokens: ["🔵■", "→", "🟠▲"],
            visualAlt: "같은 것이 파란 네모에서 주황색 세모로 달라진 모습",
            clue: "같은 대상이지만 모습이나 상태가 달라져요.",
            meaning: "모습이나 상태가 달라져요.",
            distractors: ["not-recognize", "appear", "disappear"]
        },
        {
            id: "not-recognize", word: "몰라보다", category: "change",
            tokens: ["🧒", "→", "🧔", "＋", "👀❓"],
            visualAlt: "한 사람이 크게 달라진 뒤 친구가 보고도 누구인지 알아보지 못하는 모습",
            clue: "모습이 너무 달라서 보고도 누구인지 알지 못해요.",
            meaning: "너무 달라져서 알아보지 못해요.",
            distractors: ["change", "disappear", "appear"]
        },
        {
            id: "imaginable", word: "상상이 되다", category: "imagine",
            tokens: ["🤔", "→", "💭🏡🌳☀️", "＋", "✅"],
            visualAlt: "사람이 생각할 때 생각 구름 안의 미래 모습이 또렷하게 보이는 장면",
            clue: "생각 구름 안에 미래 모습이 또렷하게 보여요.",
            meaning: "어떤 모습을 머릿속에 그릴 수 있어요.",
            distractors: ["not-imaginable", "appear", "change"]
        },
        {
            id: "not-imaginable", word: "상상이 안 되다", category: "imagine",
            tokens: ["🤔", "→", "💭🌫️❓", "＋", "🚫"],
            visualAlt: "사람이 생각하지만 생각 구름 안이 흐리고 물음표만 있는 장면",
            clue: "생각해도 모습이 떠오르지 않고 머릿속이 흐려요.",
            meaning: "어떤 모습을 머릿속에 그리기 어려워요.",
            distractors: ["imaginable", "not-recognize", "disappear"]
        }
    ];

    const WORD_BY_ID = new Map(WORDS.map((item) => [item.id, item]));
    const VALID_MODES = new Set(["study", "quiz"]);
    const MARK_PATTERN = /^[＋→↔…∅│─·⬇️✂️]+$/u;

    const mount = document.getElementById("activity-mount");
    const liveRegion = document.getElementById("live-region");
    const saveStatus = document.getElementById("save-status");
    const studyCount = document.getElementById("study-count");
    const quizCount = document.getElementById("quiz-count");
    const categoryGroups = document.getElementById("category-groups");
    const modeTabs = Array.from(document.querySelectorAll("[data-mode]"));
    let saveTimer = 0;

    function rotate(values, amount) {
        const offset = ((amount % values.length) + values.length) % values.length;
        return values.slice(offset).concat(values.slice(0, offset));
    }

    function makeQuiz(round = 0) {
        let order = WORDS.map((item) => item.id);
        if (round % 2 === 1) order.reverse();
        order = rotate(order, round * 5);
        const optionsById = {};
        WORDS.forEach((item, index) => {
            optionsById[item.id] = rotate([item.id, ...item.distractors], (index + round * 3) % 4);
        });
        return {
            round,
            order,
            optionsById,
            index: 0,
            answers: {},
            hintIds: [],
            finished: false
        };
    }

    function makeDefaultState() {
        return {
            version: VERSION,
            mode: "study",
            study: { index: 0, revealedIds: [] },
            quiz: makeQuiz(0),
            updatedAt: Date.now()
        };
    }

    function validIdList(value) {
        if (!Array.isArray(value)) return [];
        return Array.from(new Set(value.filter((id) => WORD_BY_ID.has(id))));
    }

    function sanitizeQuiz(rawQuiz) {
        const round = Number.isInteger(rawQuiz?.round) && rawQuiz.round >= 0 ? rawQuiz.round : 0;
        const fallback = makeQuiz(round);
        const order = validIdList(rawQuiz?.order);
        const safeOrder = order.length === WORDS.length ? order : fallback.order;
        const optionsById = {};
        WORDS.forEach((item) => {
            const options = validIdList(rawQuiz?.optionsById?.[item.id]);
            optionsById[item.id] = options.length === 4 && options.includes(item.id)
                ? options
                : fallback.optionsById[item.id];
        });
        const answers = {};
        if (rawQuiz?.answers && typeof rawQuiz.answers === "object") {
            Object.entries(rawQuiz.answers).forEach(([id, answer]) => {
                if (!WORD_BY_ID.has(id) || !answer || typeof answer !== "object") return;
                const allowed = new Set(optionsById[id]);
                const attemptIds = Array.from(new Set(validIdList(answer.attemptIds).filter((attemptId) => allowed.has(attemptId))));
                const correct = attemptIds.includes(id) && answer.correct === true;
                answers[id] = {
                    attemptIds,
                    correct,
                    firstTry: correct && attemptIds.length === 1 && answer.firstTry === true
                };
            });
        }
        const maxIndex = safeOrder.length - 1;
        const index = Number.isInteger(rawQuiz?.index)
            ? Math.max(0, Math.min(rawQuiz.index, maxIndex))
            : 0;
        const allCorrect = safeOrder.every((id) => answers[id]?.correct);
        return {
            round,
            order: safeOrder,
            optionsById,
            index,
            answers,
            hintIds: validIdList(rawQuiz?.hintIds),
            finished: rawQuiz?.finished === true && allCorrect
        };
    }

    function sanitizeState(raw) {
        const fallback = makeDefaultState();
        if (!raw || typeof raw !== "object" || raw.version !== VERSION) return fallback;
        const index = Number.isInteger(raw.study?.index)
            ? Math.max(0, Math.min(raw.study.index, WORDS.length - 1))
            : 0;
        return {
            version: VERSION,
            mode: VALID_MODES.has(raw.mode) ? raw.mode : "study",
            study: {
                index,
                revealedIds: validIdList(raw.study?.revealedIds)
            },
            quiz: sanitizeQuiz(raw.quiz),
            updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : Date.now()
        };
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? sanitizeState(JSON.parse(raw)) : makeDefaultState();
        } catch (_error) {
            return makeDefaultState();
        }
    }

    let state = loadState();

    function saveState() {
        state.updatedAt = Date.now();
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            saveStatus.textContent = "저장됨";
            window.clearTimeout(saveTimer);
            saveTimer = window.setTimeout(() => {
                saveStatus.textContent = "자동 저장";
            }, 900);
        } catch (_error) {
            saveStatus.textContent = "현재 화면에 유지됨";
        }
    }

    function announce(message) {
        liveRegion.textContent = "";
        window.setTimeout(() => {
            liveRegion.textContent = message;
        }, 20);
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function isMark(token) {
        return MARK_PATTERN.test(token) || token === "────";
    }

    function visualHtml(item, extraClass = "") {
        const tokens = item.tokens.map((token) => (
            `<span class="visual-token${isMark(token) ? " visual-token--mark" : ""}">${escapeHtml(token)}</span>`
        )).join("");
        return `
            <div class="visual-stage ${extraClass}" role="img" aria-label="${escapeHtml(item.visualAlt)}">
                <div class="visual-line" aria-hidden="true">${tokens}</div>
            </div>
        `;
    }

    function setMode(mode, focusTab = false) {
        if (!VALID_MODES.has(mode)) return;
        state.mode = mode;
        saveState();
        renderAll();
        if (focusTab) document.querySelector(`[data-mode="${mode}"]`)?.focus();
    }

    function renderTabs() {
        modeTabs.forEach((tab) => {
            const selected = tab.dataset.mode === state.mode;
            tab.setAttribute("aria-selected", String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });
    }

    function renderProgress() {
        studyCount.textContent = `${state.study.revealedIds.length} / ${WORDS.length}`;
        const solved = Object.values(state.quiz.answers).filter((answer) => answer.correct).length;
        quizCount.textContent = `${solved} / ${WORDS.length}`;
    }

    function renderStudy() {
        const item = WORDS[state.study.index];
        const category = CATEGORIES.find((entry) => entry.id === item.category);
        const revealed = state.study.revealedIds.includes(item.id);
        const isFirst = state.study.index === 0;
        const isLast = state.study.index === WORDS.length - 1;
        mount.innerHTML = `
            <div class="study-view">
                <div class="activity-head">
                    <span class="activity-head__label">${escapeHtml(category.name)}</span>
                    <span class="study-progress">${state.study.index + 1} / ${WORDS.length}</span>
                </div>
                ${visualHtml(item)}
                <p class="scene-clue">${escapeHtml(item.clue)}</p>
                <div class="study-answer">
                    ${revealed ? `
                        <div class="answer-card">
                            <h2 class="study-word" tabindex="-1">${escapeHtml(item.word)}</h2>
                            <p class="study-meaning">${escapeHtml(item.meaning)}</p>
                        </div>
                    ` : `
                        <div class="answer-cover">
                            <button class="primary-button" type="button" data-reveal>어휘 보기</button>
                        </div>
                    `}
                </div>
                <div class="study-controls">
                    <button class="nav-button" type="button" data-study-previous ${isFirst ? "disabled" : ""}>← 이전</button>
                    <button class="nav-button" type="button" data-study-next>${isLast ? "퀴즈 시작 →" : "다음 →"}</button>
                </div>
            </div>
        `;

        mount.querySelector("[data-reveal]")?.addEventListener("click", (event) => {
            if (!state.study.revealedIds.includes(item.id)) state.study.revealedIds.push(item.id);
            saveState();
            renderAll();
            mount.querySelector(".study-word")?.focus?.();
            announce(`${item.word}. ${item.meaning}`);
            event.preventDefault();
        });
        mount.querySelector("[data-study-previous]")?.addEventListener("click", () => {
            state.study.index = Math.max(0, state.study.index - 1);
            saveState();
            renderAll();
            mount.querySelector("[data-reveal], [data-study-next]")?.focus();
        });
        mount.querySelector("[data-study-next]")?.addEventListener("click", () => {
            if (isLast) {
                setMode("quiz");
                mount.querySelector(".quiz-option, [data-restart-quiz]")?.focus();
                return;
            }
            state.study.index += 1;
            saveState();
            renderAll();
            mount.querySelector("[data-reveal], [data-study-next]")?.focus();
        });
    }

    function currentQuizItem() {
        return WORD_BY_ID.get(state.quiz.order[state.quiz.index]);
    }

    function renderQuiz() {
        if (state.quiz.finished) {
            renderResult();
            return;
        }
        const item = currentQuizItem();
        const answer = state.quiz.answers[item.id] || { attemptIds: [], correct: false, firstTry: false };
        const hintOpen = state.quiz.hintIds.includes(item.id);
        const options = state.quiz.optionsById[item.id];
        const isLast = state.quiz.index === WORDS.length - 1;
        const optionHtml = options.map((id) => {
            const option = WORD_BY_ID.get(id);
            const attempted = answer.attemptIds.includes(id);
            const correct = answer.correct && id === item.id;
            const wrong = attempted && id !== item.id;
            const locked = answer.correct || wrong;
            return `
                <button class="quiz-option${wrong ? " is-wrong" : ""}${correct ? " is-correct" : ""}"
                    type="button" data-option-id="${escapeHtml(id)}" aria-disabled="${locked}">
                    ${escapeHtml(option.word)}
                </button>
            `;
        }).join("");
        let feedback = "상징의 방향과 장면을 천천히 살펴보세요.";
        let feedbackClass = "";
        if (answer.correct) {
            feedback = `정답 · ${item.word} — ${item.meaning}`;
            feedbackClass = " is-correct";
        } else if (answer.attemptIds.length) {
            feedback = "다시 생각해 보세요. 상징의 순서와 방향이 중요해요.";
            feedbackClass = " is-wrong";
        }
        mount.innerHTML = `
            <div class="quiz-view">
                <div class="activity-head">
                    <span class="activity-head__label">상징만 보고 고르기</span>
                    <span class="quiz-progress">문제 ${state.quiz.index + 1} / ${WORDS.length}</span>
                </div>
                ${visualHtml(item, "quiz-visual")}
                <h2 class="quiz-prompt" tabindex="-1">이 표현에 맞는 어휘는 무엇일까요?</h2>
                <div class="quiz-options">${optionHtml}</div>
                <div class="quiz-tools">
                    <button class="hint-button" type="button" data-hint ${hintOpen ? "aria-expanded=\"true\"" : "aria-expanded=\"false\""}>
                        ${hintOpen ? "단서 닫기" : "단서 보기"}
                    </button>
                    <p class="hint-text" ${hintOpen ? "" : "hidden"}>${escapeHtml(item.clue)}</p>
                </div>
                <div class="feedback${feedbackClass}" role="status">${escapeHtml(feedback)}</div>
                <div class="quiz-actions">
                    <button class="primary-button next-button" type="button" data-quiz-next ${answer.correct ? "" : "hidden"}>
                        ${isLast ? "결과 보기" : "다음 문제 →"}
                    </button>
                </div>
            </div>
        `;

        mount.querySelectorAll("[data-option-id]").forEach((button) => {
            button.addEventListener("click", () => handleQuizOption(button, item));
        });
        mount.querySelector("[data-hint]")?.addEventListener("click", () => {
            if (hintOpen) {
                state.quiz.hintIds = state.quiz.hintIds.filter((id) => id !== item.id);
            } else {
                state.quiz.hintIds.push(item.id);
            }
            saveState();
            renderAll();
            mount.querySelector("[data-hint]")?.focus();
        });
        mount.querySelector("[data-quiz-next]")?.addEventListener("click", () => {
            if (isLast) {
                state.quiz.finished = true;
                saveState();
                renderAll();
                mount.querySelector(".result h2")?.focus();
                announce("28문제를 모두 풀었습니다.");
                return;
            }
            state.quiz.index += 1;
            saveState();
            renderAll();
            mount.querySelector(".quiz-prompt")?.focus();
        });
    }

    function handleQuizOption(button, item) {
        const optionId = button.dataset.optionId;
        let answer = state.quiz.answers[item.id];
        if (!answer) {
            answer = { attemptIds: [], correct: false, firstTry: false };
            state.quiz.answers[item.id] = answer;
        }
        if (answer.correct || answer.attemptIds.includes(optionId)) return;
        answer.attemptIds.push(optionId);
        if (optionId === item.id) {
            answer.correct = true;
            answer.firstTry = answer.attemptIds.length === 1;
            saveState();
            renderAll();
            mount.querySelector("[data-quiz-next]")?.focus();
            announce(`정답입니다. ${item.word}. ${item.meaning}`);
        } else {
            button.classList.add("is-wrong");
            button.setAttribute("aria-disabled", "true");
            const feedback = mount.querySelector(".feedback");
            feedback.className = "feedback is-wrong";
            feedback.textContent = "다시 생각해 보세요. 상징의 순서와 방향이 중요해요.";
            saveState();
            renderProgress();
            announce("다시 생각해 보세요. 다른 어휘를 골라 보세요.");
        }
    }

    function renderResult() {
        const answers = Object.values(state.quiz.answers);
        const firstTry = answers.filter((answer) => answer.correct && answer.firstTry).length;
        const missed = state.quiz.order.filter((id) => state.quiz.answers[id]?.correct && !state.quiz.answers[id]?.firstTry);
        const note = missed.length
            ? `한 번 더 볼 어휘가 ${missed.length}개 있어요. 다시 보면 더 오래 기억할 수 있어요.`
            : "모든 어휘를 첫 시도에 맞혔어요. 상징과 뜻을 잘 연결했습니다.";
        mount.innerHTML = `
            <div class="result">
                <div class="result__inner">
                    <div class="result__symbol" aria-hidden="true">🌟</div>
                    <h2 tabindex="-1">28문제를 모두 풀었어요</h2>
                    <p class="result__score">첫 시도 정답 ${firstTry} / ${WORDS.length}</p>
                    <p class="result__note">${escapeHtml(note)}</p>
                    <div class="result__actions">
                        <button class="secondary-button" type="button" data-review-missed>헷갈린 어휘 보기</button>
                        <button class="primary-button" type="button" data-restart-quiz>다시 풀기</button>
                    </div>
                </div>
            </div>
        `;
        mount.querySelector("[data-review-missed]")?.addEventListener("click", () => {
            const targetId = missed[0] || state.quiz.order[0];
            state.study.index = Math.max(0, WORDS.findIndex((item) => item.id === targetId));
            setMode("study");
            mount.querySelector("[data-reveal], [data-study-next]")?.focus();
        });
        mount.querySelector("[data-restart-quiz]")?.addEventListener("click", () => {
            state.quiz = makeQuiz(state.quiz.round + 1);
            state.mode = "quiz";
            saveState();
            renderAll();
            mount.querySelector(".quiz-prompt")?.focus();
        });
    }

    function renderCategoryGroups() {
        const current = state.mode === "study" ? WORDS[state.study.index] : currentQuizItem();
        categoryGroups.innerHTML = CATEGORIES.map((category) => {
            const items = WORDS.filter((item) => item.category === category.id);
            const learned = items.filter((item) => state.study.revealedIds.includes(item.id)).length;
            const complete = learned === items.length;
            return `
                <button class="group-button${current?.category === category.id ? " is-current" : ""}${complete ? " is-complete" : ""}"
                    type="button" data-category="${escapeHtml(category.id)}">
                    <i aria-hidden="true"></i>
                    <b>${escapeHtml(category.name)}</b>
                    <span>${learned} / ${items.length}</span>
                </button>
            `;
        }).join("");
        categoryGroups.querySelectorAll("[data-category]").forEach((button) => {
            button.addEventListener("click", () => {
                const index = WORDS.findIndex((item) => item.category === button.dataset.category);
                if (index < 0) return;
                state.study.index = index;
                state.mode = "study";
                saveState();
                renderAll();
                mount.querySelector("[data-reveal], [data-study-next]")?.focus();
            });
        });
    }

    function renderAll() {
        renderTabs();
        renderProgress();
        if (state.mode === "quiz") renderQuiz();
        else renderStudy();
        renderCategoryGroups();
    }

    modeTabs.forEach((tab, index) => {
        tab.addEventListener("click", () => setMode(tab.dataset.mode));
        tab.addEventListener("keydown", (event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            let nextIndex = index;
            if (event.key === "ArrowRight") nextIndex = (index + 1) % modeTabs.length;
            if (event.key === "ArrowLeft") nextIndex = (index - 1 + modeTabs.length) % modeTabs.length;
            if (event.key === "Home") nextIndex = 0;
            if (event.key === "End") nextIndex = modeTabs.length - 1;
            setMode(modeTabs[nextIndex].dataset.mode, true);
        });
    });

    document.querySelector("[data-reset-all]")?.addEventListener("click", () => {
        const confirmed = window.confirm("상징 학습과 퀴즈 기록을 모두 지울까요?");
        if (!confirmed) return;
        state = makeDefaultState();
        saveState();
        renderAll();
        document.querySelector("[data-reveal]")?.focus();
        announce("모든 학습 기록을 지웠습니다.");
    });

    window.C14_VOCAB_SYMBOL_QUIZ = {
        storageKey: STORAGE_KEY,
        words: WORDS.map((item) => ({ ...item, tokens: [...item.tokens], distractors: [...item.distractors] })),
        categories: CATEGORIES.map((item) => ({ ...item })),
        getState: () => JSON.parse(JSON.stringify(state)),
        selectMode: (mode) => setMode(mode),
        resetAll: () => {
            state = makeDefaultState();
            saveState();
            renderAll();
        }
    };

    renderAll();
})();
