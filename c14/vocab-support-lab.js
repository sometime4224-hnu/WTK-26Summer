(() => {
    "use strict";

    const STORAGE_KEY = "c14-vocab-support-city-change-v1";
    const IMAGE_ROOT = "../assets/c14/vocabulary/images/vocab-support-lab";
    const TARGET_WORDS = [
        "여유가 없다",
        "활기차다",
        "공해가 심하다",
        "편의 시설이 잘되어 있다",
        "사라지다",
        "생기다",
        "변하다",
        "몰라보다",
        "상상이 되다",
        "상상이 안 되다"
    ];
    const FARMING_GAME_WORDS = [
        "여유가 있다",
        "평화롭다",
        "공기가 맑다",
        "따분하다",
        "시간 가는 줄 모르다",
        "불편하다",
        "정원",
        "잔디",
        "채소",
        "농사",
        "가축",
        "물고기",
        "가꾸다",
        "깎다",
        "심다",
        "키우다",
        "짓다",
        "잡다"
    ];

    const ACTIVITIES = [
        {
            id: "city",
            title: "도시 단서 찾기",
            typeLabel: "생활환경 진단",
            icon: "🔎",
            words: ["여유가 없다", "활기차다", "공해가 심하다", "편의 시설이 잘되어 있다"],
            instruction: "중요한 단서 두 개를 먼저 찾으세요.",
            items: [
                {
                    id: "city-busy-work",
                    image: `${IMAGE_ROOT}/city-busy-work.webp`,
                    scene: "민지는 아침부터 저녁까지 회의가 있어요.",
                    prompt: "민지의 상태를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "new-bag", label: "새 가방이 있어요", key: false },
                        { id: "lunch-work", label: "점심에도 일해요", key: true },
                        { id: "rain", label: "창밖에 비가 와요", key: false },
                        { id: "no-break", label: "쉴 시간이 없어요", key: true }
                    ],
                    answer: "여유가 없다",
                    options: ["활기차다", "편의 시설이 잘되어 있다", "여유가 없다", "공해가 심하다"],
                    note: "할 일이 많아 시간과 마음의 공간이 부족한 상태예요.",
                    hint: "시간이 부족하고 계속 바쁜지를 생각해 보세요."
                },
                {
                    id: "city-lively-market",
                    image: `${IMAGE_ROOT}/city-lively-market.webp`,
                    scene: "토요일 시장에 사람들의 웃음소리가 가득해요.",
                    prompt: "시장의 분위기를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "many-people", label: "사람이 많이 오가요", key: true },
                        { id: "closed-door", label: "문 하나가 닫혀 있어요", key: false },
                        { id: "blue-sign", label: "간판이 파란색이에요", key: false },
                        { id: "bright-voices", label: "밝은 목소리가 들려요", key: true }
                    ],
                    answer: "활기차다",
                    options: ["활기차다", "공해가 심하다", "여유가 없다", "편의 시설이 잘되어 있다"],
                    note: "사람과 움직임이 많고 생기가 넘치는 모습이에요.",
                    hint: "생기와 힘이 느껴지는지를 생각해 보세요."
                },
                {
                    id: "city-pollution-road",
                    image: `${IMAGE_ROOT}/city-pollution-road.webp`,
                    scene: "큰길의 하늘이 회색이고 숨쉬기가 답답해요.",
                    prompt: "환경의 문제를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "red-bus", label: "버스가 빨간색이에요", key: false },
                        { id: "many-cars", label: "차에서 매연이 나와요", key: true },
                        { id: "gray-air", label: "공기가 뿌옇고 답답해요", key: true },
                        { id: "wide-road", label: "길이 넓어요", key: false }
                    ],
                    answer: "공해가 심하다",
                    options: ["여유가 없다", "편의 시설이 잘되어 있다", "활기차다", "공해가 심하다"],
                    note: "매연과 오염이 많아 생활 환경이 나쁜 상태예요.",
                    hint: "공기와 물이 오염되었는지를 살펴보세요."
                },
                {
                    id: "city-facilities-home",
                    image: `${IMAGE_ROOT}/city-facilities-home.webp`,
                    scene: "새 집 주변에서 필요한 곳을 모두 걸어서 갈 수 있어요.",
                    prompt: "생활하기 편한 이유를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "hospital", label: "병원과 약국이 가까워요", key: true },
                        { id: "flower", label: "창가에 꽃이 있어요", key: false },
                        { id: "station", label: "마트와 지하철역이 있어요", key: true },
                        { id: "fifth-floor", label: "집이 5층이에요", key: false }
                    ],
                    answer: "편의 시설이 잘되어 있다",
                    options: ["공해가 심하다", "편의 시설이 잘되어 있다", "활기차다", "여유가 없다"],
                    note: "병원, 가게, 교통처럼 생활에 필요한 시설이 잘 갖추어져 있어요.",
                    hint: "생활에 필요한 장소가 충분하고 가까운지를 생각해 보세요."
                },
                {
                    id: "city-busy-student",
                    image: `${IMAGE_ROOT}/city-busy-student.webp`,
                    scene: "수진은 수업이 끝나자마자 아르바이트를 하러 뛰어가요.",
                    prompt: "수진의 바쁜 하루를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "green-book", label: "책 표지가 초록색이에요", key: false },
                        { id: "favorite-song", label: "좋아하는 노래가 있어요", key: false },
                        { id: "class-work", label: "수업 뒤 바로 일해요", key: true },
                        { id: "late-study", label: "밤에는 시험 공부를 해요", key: true }
                    ],
                    answer: "여유가 없다",
                    options: ["편의 시설이 잘되어 있다", "공해가 심하다", "활기차다", "여유가 없다"],
                    note: "해야 할 일이 이어져 쉬거나 천천히 할 시간이 부족해요.",
                    hint: "쉴 시간이 있는지 없는지 살펴보세요."
                },
                {
                    id: "city-lively-festival",
                    image: `${IMAGE_ROOT}/city-lively-festival.webp`,
                    scene: "축제가 시작되자 거리마다 음악과 박수가 들려요.",
                    prompt: "축제 거리의 생기를 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "dance", label: "사람들이 춤을 춰요", key: true },
                        { id: "cheer", label: "박수와 응원이 이어져요", key: true },
                        { id: "stone-road", label: "길에 돌이 있어요", key: false },
                        { id: "long-shadow", label: "그림자가 길어요", key: false }
                    ],
                    answer: "활기차다",
                    options: ["여유가 없다", "활기차다", "편의 시설이 잘되어 있다", "공해가 심하다"],
                    note: "움직임과 즐거운 소리가 많아 힘이 넘치는 분위기예요.",
                    hint: "거리에서 힘과 생기가 느껴지는지를 생각해 보세요."
                },
                {
                    id: "city-pollution-river",
                    image: `${IMAGE_ROOT}/city-pollution-river.webp`,
                    scene: "공장 옆 강에서 나쁜 냄새가 나고 물빛도 어두워요.",
                    prompt: "오염을 알려 주는 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "bridge", label: "다리가 하나 있어요", key: false },
                        { id: "bad-smell", label: "강에서 나쁜 냄새가 나요", key: true },
                        { id: "walking", label: "한 사람이 걸어가요", key: false },
                        { id: "factory-smoke", label: "공장 연기가 퍼져요", key: true }
                    ],
                    answer: "공해가 심하다",
                    options: ["공해가 심하다", "여유가 없다", "편의 시설이 잘되어 있다", "활기차다"],
                    note: "공장 연기와 더러운 물처럼 여러 오염 문제가 함께 보여요.",
                    hint: "나쁜 냄새, 연기, 더러운 물을 찾아보세요."
                },
                {
                    id: "city-facilities-campus",
                    image: `${IMAGE_ROOT}/city-facilities-campus.webp`,
                    scene: "학교 앞에서 공부와 생활에 필요한 일을 모두 할 수 있어요.",
                    prompt: "시설이 잘 갖추어진 단서 두 개는 무엇일까요?",
                    clues: [
                        { id: "library-bank", label: "도서관과 은행이 있어요", key: true },
                        { id: "cloud", label: "구름이 두 개 보여요", key: false },
                        { id: "pharmacy-bus", label: "약국과 버스 정류장이 있어요", key: true },
                        { id: "yellow-chair", label: "의자가 노란색이에요", key: false }
                    ],
                    answer: "편의 시설이 잘되어 있다",
                    options: ["활기차다", "여유가 없다", "공해가 심하다", "편의 시설이 잘되어 있다"],
                    note: "공부, 건강, 교통에 필요한 시설을 가까이에서 이용할 수 있어요.",
                    hint: "생활에 필요한 여러 장소를 찾으세요."
                }
            ]
        },
        {
            id: "existence",
            title: "변화 필름 맞추기",
            typeLabel: "존재 변화",
            icon: "🎞️",
            words: ["사라지다", "생기다"],
            instruction: "단어를 변화 사이에 놓으세요. 단어를 눌러도 됩니다.",
            items: [
                {
                    id: "exist-cloud",
                    image: `${IMAGE_ROOT}/exist-cloud.webp`,
                    before: { label: "구름이 가득한 하늘" },
                    after: { label: "구름이 없는 하늘" },
                    prompt: "있던 구름은 어떻게 되었을까요?",
                    answer: "사라지다",
                    options: ["생기다", "사라지다"],
                    note: "있던 것이 없어지는 방향이에요.",
                    hint: "먼저 있던 것이 나중에도 있는지 확인하세요."
                },
                {
                    id: "exist-park",
                    image: `${IMAGE_ROOT}/exist-park.webp`,
                    before: { label: "아무것도 없는 빈터" },
                    after: { label: "새로 문을 연 공원" },
                    prompt: "빈터에 공원이 어떻게 되었을까요?",
                    answer: "생기다",
                    options: ["사라지다", "생기다"],
                    note: "없던 것이 새로 나타나는 방향이에요.",
                    hint: "나중 장면에 새로 나타난 것이 있는지 확인하세요."
                },
                {
                    id: "exist-snowman",
                    image: `${IMAGE_ROOT}/exist-snowman.webp`,
                    before: { label: "아침의 눈사람" },
                    after: { label: "오후에 남은 물" },
                    prompt: "햇볕이 난 뒤 눈사람은 어떻게 되었을까요?",
                    answer: "사라지다",
                    options: ["사라지다", "생기다"],
                    note: "아침에 있던 눈사람이 오후에는 보이지 않아요.",
                    hint: "있던 대상이 없어졌는지를 생각하세요."
                },
                {
                    id: "exist-bakery",
                    image: `${IMAGE_ROOT}/exist-bakery.webp`,
                    before: { label: "가게가 없는 골목" },
                    after: { label: "새 빵집이 열린 골목" },
                    prompt: "골목에 빵집이 어떻게 되었을까요?",
                    answer: "생기다",
                    options: ["생기다", "사라지다"],
                    note: "전에는 없던 빵집이 새로 나타났어요.",
                    hint: "없던 것이 새로 나타났는지를 생각하세요."
                }
            ]
        },
        {
            id: "change",
            title: "옛사진 탐정",
            typeLabel: "상태 변화·재인식",
            icon: "📷",
            words: ["변하다", "몰라보다"],
            instruction: "나중 사진을 열고 변화의 결과를 고르세요.",
            items: [
                {
                    id: "change-tree",
                    image: `${IMAGE_ROOT}/change-tree.webp`,
                    before: { label: "봄의 초록 잎" },
                    after: { label: "가을의 붉은 잎" },
                    prompt: "같은 나무임을 알지만 색과 모습이 달라졌어요.",
                    answer: "변하다",
                    options: ["몰라보다", "변하다"],
                    note: "같은 대상의 상태가 달라진 사실이 중심이에요.",
                    hint: "알아보지 못한 결과가 있는지 확인하세요."
                },
                {
                    id: "change-wall",
                    image: `${IMAGE_ROOT}/change-wall.webp`,
                    before: { label: "낡은 회색 벽" },
                    after: { label: "새로 칠한 파란 벽" },
                    prompt: "같은 건물의 벽 색과 느낌이 달라졌어요.",
                    answer: "변하다",
                    options: ["변하다", "몰라보다"],
                    note: "대상은 같고 그 상태나 모습이 달라졌어요.",
                    hint: "단순한 변화인지, 알아보지 못한 결과인지 나누어 보세요."
                },
                {
                    id: "change-friend",
                    image: `${IMAGE_ROOT}/change-friend.webp`,
                    before: { label: "어릴 때의 친구" },
                    after: { label: "20년 뒤의 친구" },
                    prompt: "친구가 너무 달라서 처음에는 누구인지 알지 못했어요.",
                    answer: "몰라보다",
                    options: ["변하다", "몰라보다"],
                    note: "너무 달라져서 알아보지 못한 결과가 중심이에요.",
                    hint: "누구인지 알아보았는지 못 알아보았는지 확인하세요."
                },
                {
                    id: "change-town",
                    image: `${IMAGE_ROOT}/change-town.webp`,
                    before: { label: "할머니의 옛 동네" },
                    after: { label: "높은 건물이 선 동네" },
                    prompt: "할머니는 동네가 너무 달라져서 여기가 어디인지 알지 못했어요.",
                    answer: "몰라보다",
                    options: ["몰라보다", "변하다"],
                    note: "큰 변화 때문에 익숙한 장소를 알아보지 못했어요.",
                    hint: "변화 뒤에 알아보지 못한 결과가 이어지는지 살펴보세요."
                }
            ]
        },
        {
            id: "imagine",
            title: "상상 구름 고르기",
            typeLabel: "상상 가능성",
            icon: "💭",
            words: ["상상이 되다", "상상이 안 되다"],
            instruction: "머릿속에 모습이 그려지는지 판단하세요.",
            items: [
                {
                    id: "imagine-old-town",
                    image: `${IMAGE_ROOT}/imagine-old-town.webp`,
                    dialogue: [
                        "옛날 사진과 지도를 같이 보세요.",
                        "그때의 동네 모습이 머릿속에 선명하게 그려져요."
                    ],
                    prompt: "두 번째 사람의 생각에 알맞은 표현은 무엇일까요?",
                    answer: "상상이 되다",
                    options: ["상상이 되다", "상상이 안 되다"],
                    note: "머릿속에 모습이 그림처럼 떠오르는 상태예요.",
                    hint: "모습이 머릿속에 그려지는지 확인하세요."
                },
                {
                    id: "imagine-library",
                    image: `${IMAGE_ROOT}/imagine-library.webp`,
                    dialogue: [
                        "새 도서관의 모형과 그림을 자세히 보여 드릴게요.",
                        "완성된 모습이 눈앞에 있는 것처럼 떠올라요."
                    ],
                    prompt: "두 번째 사람의 생각에 알맞은 표현은 무엇일까요?",
                    answer: "상상이 되다",
                    options: ["상상이 안 되다", "상상이 되다"],
                    note: "자세한 그림과 모형 덕분에 미래 모습이 떠올라요.",
                    hint: "완성된 모습이 떠오르는지를 살펴보세요."
                },
                {
                    id: "imagine-vague",
                    image: `${IMAGE_ROOT}/imagine-vague.webp`,
                    dialogue: [
                        "새 건물은 아주 특별하고 멋질 거예요.",
                        "설명이 너무 짧아서 어떤 모습인지 전혀 그려지지 않아요."
                    ],
                    prompt: "두 번째 사람의 생각에 알맞은 표현은 무엇일까요?",
                    answer: "상상이 안 되다",
                    options: ["상상이 되다", "상상이 안 되다"],
                    note: "정보가 부족해 머릿속에 모습을 그릴 수 없는 상태예요.",
                    hint: "모습이 그려지지 않는다는 말에 주목하세요."
                },
                {
                    id: "imagine-flying-building",
                    image: `${IMAGE_ROOT}/imagine-flying-building.webp`,
                    dialogue: [
                        "미래에는 건물이 하늘을 날 수도 있대요.",
                        "어떻게 날아다니는지 설명을 들어도 전혀 떠오르지 않아요."
                    ],
                    prompt: "두 번째 사람의 생각에 알맞은 표현은 무엇일까요?",
                    answer: "상상이 안 되다",
                    options: ["상상이 안 되다", "상상이 되다"],
                    note: "설명을 들어도 구체적인 모습이 떠오르지 않아요.",
                    hint: "머릿속에 그림이 생겼는지 생기지 않았는지 생각하세요."
                }
            ]
        }
    ];

    const activityById = new Map(ACTIVITIES.map((activity) => [activity.id, activity]));
    const totalQuestionCount = ACTIVITIES.reduce((sum, activity) => sum + activity.items.length, 0);
    const elements = {
        tabs: document.getElementById("activity-tabs"),
        mount: document.getElementById("activity-mount"),
        card: document.getElementById("activity-card"),
        overallText: document.getElementById("overall-progress-text"),
        overallBar: document.getElementById("overall-progress-bar"),
        saveStatus: document.getElementById("save-status"),
        wordGroups: document.getElementById("word-map-groups"),
        resetAll: document.getElementById("reset-all-button"),
        live: document.getElementById("live-region")
    };

    let saveStatusTimer = 0;
    let state = loadState();

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function sceneImageMarkup(item, className) {
        return `<img class="${escapeHtml(className)}" src="${escapeHtml(item.image)}" alt="" aria-hidden="true" width="512" height="384" loading="eager" decoding="async" draggable="false">`;
    }

    function makeActivityState() {
        return {
            index: 0,
            score: 0,
            completed: false,
            answers: {},
            clues: {},
            reveals: {}
        };
    }

    function makeDefaultState() {
        return {
            version: 1,
            currentActivity: ACTIVITIES[0].id,
            activities: Object.fromEntries(ACTIVITIES.map((activity) => [activity.id, makeActivityState()])),
            updatedAt: null
        };
    }

    function sanitizeState(source) {
        const clean = makeDefaultState();
        if (!source || typeof source !== "object") return clean;
        if (activityById.has(source.currentActivity)) clean.currentActivity = source.currentActivity;

        ACTIVITIES.forEach((activity) => {
            const incoming = source.activities?.[activity.id];
            if (!incoming || typeof incoming !== "object") return;
            const target = clean.activities[activity.id];
            const validItemIds = new Set(activity.items.map((item) => item.id));
            target.index = Math.max(0, Math.min(activity.items.length - 1, Number(incoming.index) || 0));
            target.completed = incoming.completed === true;

            Object.entries(incoming.answers || {}).forEach(([itemId, answer]) => {
                if (!validItemIds.has(itemId) || !answer || typeof answer !== "object") return;
                const item = activity.items.find((candidate) => candidate.id === itemId);
                const attempts = Array.isArray(answer.attempts)
                    ? answer.attempts.filter((attempt) => item.options.includes(attempt)).slice(0, 12)
                    : [];
                target.answers[itemId] = {
                    attempts,
                    correct: answer.correct === true && attempts.includes(item.answer),
                    firstTry: answer.firstTry === true && attempts[0] === item.answer
                };
            });

            Object.entries(incoming.clues || {}).forEach(([itemId, selected]) => {
                const item = activity.items.find((candidate) => candidate.id === itemId);
                if (!item?.clues || !Array.isArray(selected)) return;
                const validKeys = new Set(item.clues.filter((clue) => clue.key).map((clue) => clue.id));
                target.clues[itemId] = [...new Set(selected.filter((id) => validKeys.has(id)))];
            });

            Object.entries(incoming.reveals || {}).forEach(([itemId, revealed]) => {
                if (validItemIds.has(itemId) && revealed === true) target.reveals[itemId] = true;
            });

            target.score = Object.values(target.answers).filter((answer) => answer.correct && answer.firstTry).length;
            if (target.completed) {
                const correctCount = Object.values(target.answers).filter((answer) => answer.correct).length;
                target.completed = correctCount === activity.items.length;
            }
        });

        clean.updatedAt = typeof source.updatedAt === "string" ? source.updatedAt : null;
        return clean;
    }

    function loadState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? sanitizeState(JSON.parse(stored)) : makeDefaultState();
        } catch (error) {
            return makeDefaultState();
        }
    }

    function saveState() {
        state.updatedAt = new Date().toISOString();
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            setSaveStatus("저장됨");
        } catch (error) {
            setSaveStatus("현재 화면에 유지됨");
        }
    }

    function setSaveStatus(message) {
        elements.saveStatus.textContent = message;
        window.clearTimeout(saveStatusTimer);
        if (message === "저장됨") {
            saveStatusTimer = window.setTimeout(() => {
                elements.saveStatus.textContent = "자동 저장";
            }, 1400);
        }
    }

    function announce(message) {
        elements.live.textContent = "";
        window.setTimeout(() => {
            elements.live.textContent = message;
        }, 20);
    }

    function getActivityState(activityId = state.currentActivity) {
        return state.activities[activityId];
    }

    function getCorrectCount(activityId) {
        return Object.values(getActivityState(activityId).answers).filter((answer) => answer.correct).length;
    }

    function getOverallCorrectCount() {
        return ACTIVITIES.reduce((sum, activity) => sum + getCorrectCount(activity.id), 0);
    }

    function render() {
        renderTabs();
        renderOverallProgress();
        renderWordMap();
        renderCurrentActivity();
    }

    function renderTabs() {
        elements.tabs.setAttribute("role", "tablist");
        elements.tabs.innerHTML = ACTIVITIES.map((activity, index) => {
            const activityState = getActivityState(activity.id);
            const selected = activity.id === state.currentActivity;
            const stateMark = activityState.completed ? "✓" : String(getCorrectCount(activity.id));
            return `
                <button
                    id="activity-tab-${escapeHtml(activity.id)}"
                    class="activity-tab${activityState.completed ? " is-complete" : ""}"
                    type="button"
                    role="tab"
                    tabindex="${selected ? "0" : "-1"}"
                    aria-selected="${selected}"
                    aria-controls="activity-card"
                    data-activity-id="${escapeHtml(activity.id)}"
                >
                    <span class="activity-tab__number">${index + 1}</span>
                    <span>${escapeHtml(activity.title)}</span>
                    <span class="activity-tab__state" aria-label="${activityState.completed ? "완료" : `${getCorrectCount(activity.id)}문제 완료`}">${stateMark}</span>
                </button>
            `;
        }).join("");

        const tabButtons = [...elements.tabs.querySelectorAll("[data-activity-id]")];
        tabButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const activityId = button.dataset.activityId;
                selectActivity(activityId, true);
                elements.tabs.querySelector(`[data-activity-id="${activityId}"]`)?.focus();
            });
            button.addEventListener("keydown", (event) => {
                if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                event.preventDefault();
                const offset = event.key === "ArrowRight" ? 1 : -1;
                const nextIndex = (index + offset + tabButtons.length) % tabButtons.length;
                const nextActivityId = tabButtons[nextIndex].dataset.activityId;
                selectActivity(nextActivityId, false);
                elements.tabs.querySelector(`[data-activity-id="${nextActivityId}"]`)?.focus();
            });
        });
        window.requestAnimationFrame(ensureActiveTabVisible);
    }

    function renderOverallProgress() {
        const correct = getOverallCorrectCount();
        const percentage = totalQuestionCount ? (correct / totalQuestionCount) * 100 : 0;
        elements.overallText.textContent = `${correct} / ${totalQuestionCount}`;
        elements.overallBar.style.width = `${percentage}%`;
    }

    function renderWordMap() {
        const learned = new Set();
        ACTIVITIES.forEach((activity) => {
            Object.entries(getActivityState(activity.id).answers).forEach(([itemId, answerState]) => {
                if (!answerState.correct) return;
                const item = activity.items.find((candidate) => candidate.id === itemId);
                if (item) learned.add(item.answer);
            });
        });

        elements.wordGroups.innerHTML = ACTIVITIES.map((activity) => `
            <article class="word-group">
                <strong>${escapeHtml(activity.typeLabel)}</strong>
                <div class="word-group__chips">
                    ${activity.words.map((word) => `<span class="word-chip${learned.has(word) ? " is-learned" : ""}">${learned.has(word) ? "✓ " : ""}${escapeHtml(word)}</span>`).join("")}
                </div>
            </article>
        `).join("");
    }

    function activityHeadMarkup(activity) {
        const activityState = getActivityState(activity.id);
        const correct = getCorrectCount(activity.id);
        const itemNumber = Math.min(activityState.index + 1, activity.items.length);
        return `
            <header class="activity-head">
                <div class="activity-head__title">
                    <span class="activity-icon" aria-hidden="true">${activity.icon}</span>
                    <div>
                        <p>${escapeHtml(activity.typeLabel)}</p>
                        <h2>${escapeHtml(activity.title)}</h2>
                    </div>
                </div>
                <div class="activity-head__progress" aria-label="활동 진행">
                    <span>${activityState.completed ? "완료" : `${itemNumber} / ${activity.items.length}`}</span>
                    <div class="mini-progress" aria-hidden="true"><span style="width: ${(correct / activity.items.length) * 100}%"></span></div>
                </div>
            </header>
        `;
    }

    function renderCurrentActivity() {
        const activity = activityById.get(state.currentActivity) || ACTIVITIES[0];
        const activityState = getActivityState(activity.id);
        elements.card.dataset.activity = activity.id;
        elements.card.setAttribute("aria-labelledby", `activity-tab-${activity.id}`);

        if (activityState.completed) {
            renderCompletion(activity);
            return;
        }

        const item = activity.items[activityState.index];
        if (activity.id === "city") renderCityQuestion(activity, item);
        if (activity.id === "existence") renderExistenceQuestion(activity, item);
        if (activity.id === "change") renderChangeQuestion(activity, item);
        if (activity.id === "imagine") renderImagineQuestion(activity, item);
    }

    function answerStateFor(item) {
        return getActivityState().answers[item.id] || { attempts: [], correct: false, firstTry: false };
    }

    function answerClass(answerState, option) {
        if (answerState.correct && option === answerState.attempts.at(-1)) return " is-correct";
        if (answerState.attempts.includes(option)) return " is-wrong";
        return "";
    }

    function feedbackMarkup(item, answerState) {
        if (!answerState.attempts.length) return "";
        if (answerState.correct) {
            return `
                <div class="feedback" role="status">
                    <strong>정답 · ${escapeHtml(item.answer)}</strong>
                    <p>${escapeHtml(item.note)} ${escapeHtml(item.answer)}의 뜻을 장면과 함께 기억하세요.</p>
                </div>
                <div class="question-actions">
                    <button class="primary-button" type="button" data-next-question>${isLastItem() ? "활동 마치기" : "다음 문제"}</button>
                </div>
            `;
        }
        return `
            <div class="feedback is-wrong" role="status">
                <strong>다시 살펴보세요</strong>
                <p>${escapeHtml(item.hint)}</p>
            </div>
        `;
    }

    function isLastItem() {
        const activity = activityById.get(state.currentActivity);
        return getActivityState().index === activity.items.length - 1;
    }

    function bindCommonAnswerButtons(item) {
        elements.mount.querySelectorAll("[data-answer]").forEach((button) => {
            button.addEventListener("click", () => submitAnswer(item, button.dataset.answer));
        });
        elements.mount.querySelector("[data-next-question]")?.addEventListener("click", nextQuestion);
    }

    function renderCityQuestion(activity, item) {
        const activityState = getActivityState();
        const answerState = answerStateFor(item);
        const selectedClues = activityState.clues[item.id] || [];
        const requiredClueCount = item.clues.filter((clue) => clue.key).length;
        const cluesReady = selectedClues.length >= requiredClueCount;
        elements.mount.innerHTML = `
            ${activityHeadMarkup(activity)}
            <div class="question-layout">
                <div class="scene-panel" data-tone="city">
                    ${sceneImageMarkup(item, "scene-image")}
                    <p class="scene-caption">${escapeHtml(item.scene)}</p>
                </div>
                <div class="work-panel">
                    <p class="question-kicker">단서 ${selectedClues.length} / ${requiredClueCount}</p>
                    <h3 class="question-prompt">${escapeHtml(item.prompt)}</h3>
                    <p class="question-guide">${escapeHtml(activity.instruction)}</p>
                    <div class="clue-grid" aria-label="장면 단서">
                        ${item.clues.map((clue) => `
                            <button
                                class="clue-button${selectedClues.includes(clue.id) ? " is-found" : ""}"
                                type="button"
                                data-clue-id="${escapeHtml(clue.id)}"
                                ${selectedClues.includes(clue.id) || answerState.correct ? "disabled" : ""}
                            >${selectedClues.includes(clue.id) ? "✓ " : ""}${escapeHtml(clue.label)}</button>
                        `).join("")}
                    </div>
                    <div class="answer-area" ${cluesReady ? "" : "hidden"}>
                        <p class="answer-area__label">이 장면에 알맞은 표현을 고르세요.</p>
                        <div class="answer-grid">
                            ${item.options.map((option) => `
                                <button class="answer-button${answerClass(answerState, option)}" type="button" data-answer="${escapeHtml(option)}" ${answerState.correct || answerState.attempts.includes(option) ? "disabled" : ""}>${escapeHtml(option)}</button>
                            `).join("")}
                        </div>
                        ${feedbackMarkup(item, answerState)}
                    </div>
                </div>
            </div>
        `;

        elements.mount.querySelectorAll("[data-clue-id]").forEach((button) => {
            button.addEventListener("click", () => chooseClue(item, button));
        });
        bindCommonAnswerButtons(item);
    }

    function chooseClue(item, button) {
        const clue = item.clues.find((candidate) => candidate.id === button.dataset.clueId);
        if (!clue) return;
        if (!clue.key) {
            button.classList.add("is-missed");
            announce("다른 단서를 찾아보세요.");
            window.setTimeout(() => button.classList.remove("is-missed"), 480);
            return;
        }

        const activityState = getActivityState();
        const selected = activityState.clues[item.id] || [];
        if (!selected.includes(clue.id)) activityState.clues[item.id] = [...selected, clue.id];
        saveState();
        render();
        const required = item.clues.filter((candidate) => candidate.key).length;
        if (activityState.clues[item.id].length >= required) {
            focusCurrentAction();
            announce("중요한 단서를 모두 찾았습니다. 표현을 고르세요.");
        } else {
            elements.mount.querySelector("[data-clue-id]:not(:disabled)")?.focus();
        }
    }

    function renderExistenceQuestion(activity, item) {
        const answerState = answerStateFor(item);
        const filled = answerState.correct ? item.answer : "";
        elements.mount.innerHTML = `
            ${activityHeadMarkup(activity)}
            <div class="question-layout">
                <div class="scene-panel" data-tone="existence">
                    <div class="pair-image-wrap">
                        ${sceneImageMarkup(item, "pair-scene-image")}
                    </div>
                    <div class="pair-labels" aria-label="먼저와 나중 장면">
                        <span><strong>먼저</strong>${escapeHtml(item.before.label)}</span>
                        <span class="pair-labels__arrow" aria-hidden="true">→</span>
                        <span><strong>나중</strong>${escapeHtml(item.after.label)}</span>
                    </div>
                </div>
                <div class="work-panel">
                    <p class="question-kicker">존재 방향 찾기</p>
                    <h3 class="question-prompt">${escapeHtml(item.prompt)}</h3>
                    <p class="question-guide">${escapeHtml(activity.instruction)}</p>
                    <div class="film-drop-zone${filled ? " is-filled" : ""}" data-drop-zone>${filled ? escapeHtml(filled) : "여기에 단어 놓기"}</div>
                    <div class="film-word-tray" aria-label="변화 단어">
                        ${item.options.map((option) => `
                            <button class="film-word${answerClass(answerState, option)}" type="button" draggable="${answerState.correct || answerState.attempts.includes(option) ? "false" : "true"}" data-answer="${escapeHtml(option)}" ${answerState.correct || answerState.attempts.includes(option) ? "disabled" : ""}>${escapeHtml(option)}</button>
                        `).join("")}
                    </div>
                    ${feedbackMarkup(item, answerState)}
                </div>
            </div>
        `;

        bindCommonAnswerButtons(item);
        bindDropZone(item);
    }

    function bindDropZone(item) {
        const zone = elements.mount.querySelector("[data-drop-zone]");
        if (!zone) return;
        elements.mount.querySelectorAll(".film-word[data-answer]").forEach((button) => {
            button.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", button.dataset.answer);
                event.dataTransfer.effectAllowed = "move";
            });
        });
        zone.addEventListener("dragover", (event) => {
            event.preventDefault();
            zone.classList.add("is-over");
            event.dataTransfer.dropEffect = "move";
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
        zone.addEventListener("drop", (event) => {
            event.preventDefault();
            zone.classList.remove("is-over");
            submitAnswer(item, event.dataTransfer.getData("text/plain"));
        });
    }

    function renderChangeQuestion(activity, item) {
        const activityState = getActivityState();
        const answerState = answerStateFor(item);
        const revealed = activityState.reveals[item.id] === true || answerState.correct;
        elements.mount.innerHTML = `
            ${activityHeadMarkup(activity)}
            <div class="question-layout">
                <div class="scene-panel" data-tone="change">
                    <div class="pair-image-wrap">
                        ${sceneImageMarkup(item, "pair-scene-image")}
                        ${revealed ? "" : '<div class="pair-image-cover" aria-hidden="true"><span>나중 사진</span></div>'}
                    </div>
                    <div class="pair-labels" aria-label="옛사진과 나중 사진">
                        <span><strong>옛사진</strong>${escapeHtml(item.before.label)}</span>
                        <span class="pair-labels__arrow" aria-hidden="true">→</span>
                        <span><strong>나중</strong>${revealed ? escapeHtml(item.after.label) : "아직 보지 않은 사진"}</span>
                    </div>
                    ${revealed ? "" : '<button class="reveal-button" type="button" data-reveal>나중 사진 보기</button>'}
                </div>
                <div class="work-panel">
                    <p class="question-kicker">변화 결과 구별</p>
                    <h3 class="question-prompt">${escapeHtml(item.prompt)}</h3>
                    <p class="question-guide">${escapeHtml(revealed ? "변화의 결과를 가장 정확하게 나타내는 말을 고르세요." : activity.instruction)}</p>
                    <div class="answer-area" ${revealed ? "" : "hidden"}>
                        <div class="answer-grid">
                            ${item.options.map((option) => `
                                <button class="answer-button${answerClass(answerState, option)}" type="button" data-answer="${escapeHtml(option)}" ${answerState.correct || answerState.attempts.includes(option) ? "disabled" : ""}>${escapeHtml(option)}</button>
                            `).join("")}
                        </div>
                        ${feedbackMarkup(item, answerState)}
                    </div>
                </div>
            </div>
        `;

        elements.mount.querySelector("[data-reveal]")?.addEventListener("click", () => {
            activityState.reveals[item.id] = true;
            saveState();
            render();
            focusCurrentAction();
            announce("나중 사진이 열렸습니다. 두 사진을 비교하세요.");
        });
        bindCommonAnswerButtons(item);
    }

    function renderImagineQuestion(activity, item) {
        const answerState = answerStateFor(item);
        elements.mount.innerHTML = `
            ${activityHeadMarkup(activity)}
            <div class="question-layout">
                <div class="scene-panel" data-tone="imagine">
                    ${sceneImageMarkup(item, "scene-image imagine-scene-image")}
                    <div class="dialogue-card" aria-label="두 사람의 대화">
                        ${item.dialogue.map((line) => `<div class="speech-bubble">${escapeHtml(line)}</div>`).join("")}
                    </div>
                </div>
                <div class="work-panel">
                    <p class="question-kicker">생각 구름 판정</p>
                    <h3 class="question-prompt">${escapeHtml(item.prompt)}</h3>
                    <p class="question-guide">${escapeHtml(activity.instruction)}</p>
                    <div class="cloud-choices" aria-label="상상 표현">
                        ${item.options.map((option) => `
                            <button class="cloud-choice${answerClass(answerState, option)}" type="button" data-answer="${escapeHtml(option)}" ${answerState.correct || answerState.attempts.includes(option) ? "disabled" : ""}>${escapeHtml(option)}</button>
                        `).join("")}
                    </div>
                    ${feedbackMarkup(item, answerState)}
                </div>
            </div>
        `;
        bindCommonAnswerButtons(item);
    }

    function submitAnswer(item, selectedAnswer) {
        if (!item.options.includes(selectedAnswer)) return;
        const activityState = getActivityState();
        const current = activityState.answers[item.id] || { attempts: [], correct: false, firstTry: false };
        if (current.correct) return;
        if (!current.attempts.includes(selectedAnswer)) current.attempts.push(selectedAnswer);
        if (selectedAnswer === item.answer) {
            current.correct = true;
            current.firstTry = current.attempts.length === 1;
            activityState.score = Object.values({ ...activityState.answers, [item.id]: current }).filter((answer) => answer.correct && answer.firstTry).length;
        }
        activityState.answers[item.id] = current;
        saveState();
        render();
        focusCurrentAction();
        announce(current.correct ? `정답입니다. ${item.answer}` : `다시 살펴보세요. ${item.hint}`);
    }

    function nextQuestion() {
        const activity = activityById.get(state.currentActivity);
        const activityState = getActivityState();
        const item = activity.items[activityState.index];
        if (!activityState.answers[item.id]?.correct) return;

        if (activityState.index < activity.items.length - 1) {
            activityState.index += 1;
        } else {
            activityState.completed = true;
        }
        saveState();
        render();
        scrollToElement(elements.card);
        focusCurrentAction();
        announce(activityState.completed ? `${activity.title} 활동을 마쳤습니다.` : "다음 문제입니다.");
    }

    function renderCompletion(activity) {
        const activityState = getActivityState(activity.id);
        const nextActivity = getNextActivity(activity.id);
        elements.mount.innerHTML = `
            <div class="completion">
                <div class="completion__inner">
                    <div class="completion__stamp" aria-hidden="true">✓</div>
                    <h2>${escapeHtml(activity.title)} 완료</h2>
                    <p>첫 선택 정답 ${activityState.score} / ${activity.items.length}<br>틀린 문제도 다시 고쳐서 모두 익혔어요.</p>
                    <div class="completion__words">
                        ${activity.words.map((word) => `<span>${escapeHtml(word)}</span>`).join("")}
                    </div>
                    <div class="completion__actions">
                        <button class="secondary-button" type="button" data-replay>이 활동 다시 하기</button>
                        ${nextActivity
                            ? `<button class="primary-button" type="button" data-next-activity="${escapeHtml(nextActivity.id)}">${escapeHtml(nextActivity.title)} 시작</button>`
                            : '<button class="primary-button" type="button" data-word-map>어휘 지도 보기</button>'}
                    </div>
                </div>
            </div>
        `;
        elements.mount.querySelector("[data-replay]")?.addEventListener("click", () => resetActivity(activity.id, false));
        elements.mount.querySelector("[data-next-activity]")?.addEventListener("click", (event) => selectActivity(event.currentTarget.dataset.nextActivity, true));
        elements.mount.querySelector("[data-word-map]")?.addEventListener("click", () => scrollToElement(document.querySelector(".word-map"), "nearest"));
    }

    function getNextActivity(activityId) {
        const currentIndex = ACTIVITIES.findIndex((activity) => activity.id === activityId);
        return ACTIVITIES.slice(currentIndex + 1).find((activity) => !getActivityState(activity.id).completed)
            || ACTIVITIES.find((activity) => !getActivityState(activity.id).completed)
            || null;
    }

    function selectActivity(activityId, scrollToCard = false) {
        if (!activityById.has(activityId)) return;
        state.currentActivity = activityId;
        saveState();
        render();
        if (scrollToCard) scrollToElement(elements.card);
    }

    function resetActivity(activityId, ask = true) {
        const activity = activityById.get(activityId);
        if (!activity) return;
        if (ask && !window.confirm(`${activity.title} 기록을 지우고 다시 시작할까요?`)) return;
        state.activities[activityId] = makeActivityState();
        state.currentActivity = activityId;
        saveState();
        render();
        announce(`${activity.title} 활동을 처음부터 시작합니다.`);
    }

    function resetAll() {
        if (!window.confirm("네 활동의 기록을 모두 지울까요?")) return;
        state = makeDefaultState();
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            /* 저장소를 사용할 수 없어도 화면 초기화는 계속한다. */
        }
        saveState();
        render();
        scrollToElement(elements.card);
        announce("모든 기록을 지우고 첫 활동으로 돌아왔습니다.");
    }

    function scrollToElement(element, block = "start") {
        if (!element) return;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block });
    }

    function focusCurrentAction() {
        const selectors = [
            "[data-next-question]",
            "[data-answer]:not(:disabled)",
            "[data-reveal]",
            "[data-clue-id]:not(:disabled)",
            "[data-next-activity]",
            "[data-word-map]",
            "[data-replay]"
        ];
        for (const selector of selectors) {
            const target = [...elements.mount.querySelectorAll(selector)].find((element) => element.offsetParent !== null);
            if (!target) continue;
            target.focus();
            return;
        }
    }

    function ensureActiveTabVisible() {
        const activeTab = elements.tabs.querySelector('[aria-selected="true"]');
        if (!activeTab || elements.tabs.scrollWidth <= elements.tabs.clientWidth) return;
        const centeredLeft = activeTab.offsetLeft - (elements.tabs.clientWidth - activeTab.offsetWidth) / 2;
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        elements.tabs.scrollTo({
            left: Math.max(0, centeredLeft),
            behavior: reduceMotion ? "auto" : "smooth"
        });
    }

    elements.resetAll.addEventListener("click", resetAll);
    render();

    window.C14_VOCAB_SUPPORT = Object.freeze({
        storageKey: STORAGE_KEY,
        targetWords: Object.freeze([...TARGET_WORDS]),
        farmingGameWords: Object.freeze([...FARMING_GAME_WORDS]),
        activities: ACTIVITIES,
        getState: () => JSON.parse(JSON.stringify(state)),
        selectActivity,
        resetActivity,
        resetAll
    });
})();
