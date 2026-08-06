(function () {
    "use strict";

    const expressionData = {
        "rumor-appear": {
            sentence: "소문이 나다",
            subject: "소문",
            particle: "이/가",
            actor: "?",
            explanation: "누가 시작했는지 몰라도 소문이 새로 알려지는 상태예요.",
            color: "#2563eb",
            soft: "#eaf2ff"
        },
        "rumor-start": {
            sentence: "수진이가 소문을 내다",
            subject: "수진",
            particle: "을/를",
            actor: "수진",
            explanation: "수진이가 소문을 처음 말하는 행동이에요.",
            color: "#ea580c",
            soft: "#fff0e5"
        },
        "rumor-spread": {
            sentence: "소문이 퍼지다",
            subject: "소문",
            particle: "이/가",
            actor: "?",
            explanation: "같은 소문이 사람에서 사람으로 자연스럽게 넓어지는 상태예요.",
            color: "#2563eb",
            soft: "#eaf2ff"
        },
        "rumor-scatter": {
            sentence: "수진이가 소문을 퍼뜨리다",
            subject: "수진",
            particle: "을/를",
            actor: "수진",
            explanation: "수진이가 같은 소문을 여러 사람에게 적극적으로 보내는 행동이에요.",
            color: "#ea580c",
            soft: "#fff0e5"
        },
        "by-chance": {
            sentence: "우연히 두 사람의 이야기를 듣다",
            subject: "우연히",
            particle: "부사",
            actor: "—",
            explanation: "미리 계획하거나 예상하지 않았는데 뜻밖에 일어난 일이에요.",
            color: "#2563eb",
            soft: "#eaf2ff"
        },
        "honestly": {
            sentence: "솔직히 자기 생각을 말하다",
            subject: "솔직히",
            particle: "부사",
            actor: "—",
            explanation: "생각이나 사실을 숨기지 않고 그대로 말해요.",
            color: "#0f766e",
            soft: "#e5f7f2"
        },
        "disappointed": {
            sentence: "친구의 거짓말에 실망하다",
            subject: "실망하다",
            particle: "동사",
            actor: "—",
            explanation: "기대했던 결과와 실제 결과가 달라 마음이 상해요.",
            color: "#b45309",
            soft: "#fff5d6"
        },
        "misunderstand": {
            sentence: "상대방의 말을 오해하다",
            subject: "오해하다",
            particle: "동사",
            actor: "—",
            explanation: "본 상황이나 들은 말을 실제 뜻과 다르게 이해해요.",
            color: "#be123c",
            soft: "#fff0f3"
        }
    };
    const expressionIds = Object.keys(expressionData);
    const initialState = { selectedId: null, visited: [] };
    let state = null;
    let ready = false;

    const store = window.C17ActivityState.create("vocab-support-touch-expression", initialState, {
        validate: function (value) {
            return Boolean(value)
                && (value.selectedId === null || expressionIds.includes(value.selectedId))
                && Array.isArray(value.visited)
                && value.visited.every(function (id) { return expressionIds.includes(id); })
                && new Set(value.visited).size === value.visited.length;
        },
        onReset: function (nextState) {
            state = nextState;
            if (ready) render();
        }
    });

    state = store.get();

    const livePanel = document.getElementById("livePanel");
    const liveSentence = document.getElementById("liveSentence");
    const liveExplanation = document.getElementById("liveExplanation");
    const subjectChip = document.getElementById("subjectChip");
    const particleChip = document.getElementById("particleChip");
    const actorLabel = document.getElementById("actorLabel");
    const progressText = document.getElementById("progressText");
    const completionPanel = document.querySelector(".completion-panel");
    const completionMessage = document.getElementById("completionMessage");
    const expressionButtons = Array.from(document.querySelectorAll("button[data-expression]"));

    function render() {
        const selected = state.selectedId ? expressionData[state.selectedId] : null;
        expressionButtons.forEach(function (button) {
            const id = button.dataset.expression;
            const isSelected = id === state.selectedId;
            button.setAttribute("aria-pressed", String(isSelected));
            button.classList.toggle("is-visited", state.visited.includes(id));
        });

        progressText.textContent = state.visited.length + "/" + expressionIds.length
            + (state.visited.length === expressionIds.length ? " · 활동 완료" : " 살펴봄");

        if (!selected) {
            livePanel.style.removeProperty("--live-color");
            livePanel.style.removeProperty("--live-soft");
            liveSentence.textContent = "장면 속 대상을 눌러 보세요.";
            liveExplanation.textContent = "누른 대상이 문장의 주인공이나 핵심 표현이 됩니다.";
            subjectChip.textContent = "주어 · 아직 없음";
            particleChip.textContent = "조사 · —";
            actorLabel.textContent = "?";
        } else {
            livePanel.style.setProperty("--live-color", selected.color);
            livePanel.style.setProperty("--live-soft", selected.soft);
            liveSentence.textContent = selected.sentence;
            liveExplanation.textContent = selected.explanation;
            subjectChip.textContent = "핵심 · " + selected.subject;
            particleChip.textContent = "형태 · " + selected.particle;
            actorLabel.textContent = selected.actor;
        }

        const complete = state.visited.length === expressionIds.length;
        completionPanel.classList.toggle("is-complete", complete);
        completionMessage.textContent = complete
            ? "8개 표현을 모두 바꿔 보았습니다. 활동 완료!"
            : "8개 대상을 모두 눌러 표현을 바꿔 보세요.";
    }

    function chooseExpression(id) {
        if (!expressionData[id]) return;
        state.selectedId = id;
        if (!state.visited.includes(id)) state.visited.push(id);
        render();
        store.save(state);
    }

    expressionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            chooseExpression(button.dataset.expression);
        });
    });

    document.getElementById("resetActivity").addEventListener("click", function () {
        if (window.confirm("이 터치 활동의 기록만 처음부터 다시 시작할까요?")) {
            store.reset(false);
        }
    });

    store.mount(document.getElementById("activityStateTools"), function () { return state; });
    ready = true;
    render();
})();
