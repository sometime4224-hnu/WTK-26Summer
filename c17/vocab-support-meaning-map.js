(function () {
    "use strict";

    const PAIRS = {
        "by-chance": {
            base: {
                title: "우연히",
                equation: "계획 없음 + 뜻밖에 일어남",
                image: "../assets/c17/vocabulary/infographics/by-chance-20260806.svg?v=20260806-3",
                alt: "약속하지 않은 두 사람이 각자의 길을 가다가 한 지점에서 뜻밖에 만나는 우연히 도식",
                caption: "미리 계획하거나 예상하지 않았는데 어떤 일이 일어납니다.",
                example: ["", "우연히", " 두 사람의 이야기를 들었어요."]
            },
            opposite: {
                title: "일부러",
                equation: "목적 있음 + 의도해서 행동함",
                image: "../assets/c17/vocabulary/infographics/intentionally.svg?v=20260806-1",
                alt: "미리 약속한 두 사람이 계획한 길을 따라 약속 장소로 가서 의도적으로 만나는 일부러 도식",
                caption: "미리 정한 목적이 있어서 의도적으로 행동합니다.",
                example: ["친구를 만나려고 ", "일부러", " 그 길로 갔어요."]
            }
        },
        honestly: {
            base: {
                title: "솔직히",
                equation: "속마음 = 말한 내용",
                image: "../assets/c17/vocabulary/infographics/honestly.svg?v=20260806-3",
                alt: "마음속 진짜 생각과 입 밖으로 말한 내용이 같은 솔직히 도식",
                caption: "생각이나 사실을 숨기지 않고 그대로 말합니다.",
                example: ["", "솔직히", " 말해서 저는 믿기 어려워요."]
            },
            opposite: {
                title: "솔직하지 않게",
                equation: "속마음 ≠ 말한 내용",
                image: "../assets/c17/vocabulary/infographics/not-honestly.svg?v=20260806-1",
                alt: "마음속 진짜 생각을 숨기고 입 밖으로는 다른 내용을 말하는 솔직하지 않게 도식",
                caption: "진짜 마음을 숨기고 속마음과 다르게 말합니다.",
                example: ["", "솔직하지 않게", " 괜찮다고 말했어요."]
            }
        },
        disappointed: {
            base: {
                title: "실망하다",
                equation: "기대 ≠ 실제 → 마음이 상함",
                image: "../assets/c17/vocabulary/infographics/disappointed-20260806.svg?v=20260806-3",
                alt: "친구가 올 것이라는 기대와 빈 의자만 있는 실제 결과가 달라 마음이 내려앉는 실망하다 도식",
                caption: "기대했던 결과와 실제 결과가 달라 마음이 상합니다.",
                example: ["친구가 거짓말해서 너무 ", "실망했어요.", ""]
            },
            opposite: {
                title: "만족하다",
                equation: "기대 = 실제 → 마음에 듦",
                image: "../assets/c17/vocabulary/infographics/satisfied.svg?v=20260806-1",
                alt: "친구가 올 것이라는 기대와 실제로 친구가 온 결과가 같아 마음에 들어 하는 만족하다 도식",
                caption: "기대한 결과와 실제 결과가 같아서 마음에 듭니다.",
                example: ["결과가 기대와 같아서 ", "만족했어요.", ""]
            }
        },
        misunderstand: {
            base: {
                title: "오해하다",
                equation: "실제 사실 ≠ 내가 이해한 내용",
                image: "../assets/c17/vocabulary/infographics/misunderstand.svg?v=20260806-3",
                alt: "깜짝 선물을 준비하는 실제 상황을 자기 흉을 보는 것으로 잘못 이해한 오해하다 도식",
                caption: "본 상황이나 들은 말을 실제 뜻과 다르게 이해합니다.",
                example: ["제 말을 ", "오해하지", " 마세요."]
            },
            opposite: {
                title: "제대로 이해하다",
                equation: "실제 사실 = 내가 이해한 내용",
                image: "../assets/c17/vocabulary/infographics/understand-correctly.svg?v=20260806-1",
                alt: "깜짝 선물을 준비하는 실제 상황을 그 뜻에 맞게 정확히 이해한 제대로 이해하다 도식",
                caption: "본 상황이나 들은 말을 실제 뜻에 맞게 이해합니다.",
                example: ["설명을 듣고 상황을 ", "제대로 이해했어요.", ""]
            }
        }
    };

    const CARD_IDS = Object.keys(PAIRS);
    const cards = new Map(CARD_IDS.map(function (id) {
        return [id, document.getElementById(id)];
    }));
    const initialState = {
        sides: Object.fromEntries(CARD_IDS.map(function (id) {
            return [id, "base"];
        }))
    };

    function validateState(value) {
        if (!value || typeof value !== "object" || !value.sides || typeof value.sides !== "object") {
            return false;
        }
        const keys = Object.keys(value.sides);
        return keys.length === CARD_IDS.length
            && CARD_IDS.every(function (id) {
                return value.sides[id] === "base" || value.sides[id] === "opposite";
            });
    }

    function renderExample(element, parts) {
        const emphasis = document.createElement("b");
        emphasis.textContent = parts[1];
        element.replaceChildren(
            document.createTextNode("“" + parts[0]),
            emphasis,
            document.createTextNode(parts[2] + "”")
        );
    }

    function renderCard(card, side, announce) {
        const item = PAIRS[card.id][side];
        const button = card.querySelector("[data-meaning-toggle]");
        const buttonLabel = card.querySelector("[data-meaning-toggle-label]");
        const image = card.querySelector("[data-meaning-image]");

        card.dataset.side = side;
        card.classList.toggle("is-opposite", side === "opposite");
        card.querySelector("[data-meaning-title]").textContent = item.title;
        card.querySelector("[data-meaning-equation]").textContent = item.equation;
        image.src = item.image;
        image.alt = item.alt;
        card.querySelector("[data-meaning-caption]").textContent = item.caption;
        renderExample(card.querySelector("[data-meaning-example]"), item.example);

        button.hidden = false;
        button.setAttribute("aria-pressed", String(side === "opposite"));
        buttonLabel.textContent = side === "opposite" ? "원래 말 보기" : "반대 상황 보기";
        button.setAttribute(
            "aria-label",
            item.title + " 카드에서 " + (side === "opposite" ? "원래 말 보기" : "반대 상황 보기")
        );

        if (announce) {
            card.querySelector("[data-meaning-status]").textContent = "현재 " + item.title + " 그림입니다.";
            card.classList.remove("is-changing");
            window.requestAnimationFrame(function () {
                card.classList.add("is-changing");
            });
        }
    }

    function applyState(state, announce) {
        CARD_IDS.forEach(function (id) {
            renderCard(cards.get(id), state.sides[id], Boolean(announce));
        });
    }

    function collectState() {
        return {
            sides: Object.fromEntries(CARD_IDS.map(function (id) {
                return [id, cards.get(id).dataset.side || "base"];
            }))
        };
    }

    let stateStore = null;
    if (window.C17ActivityState) {
        stateStore = window.C17ActivityState.create("vocab-support-meaning-map", initialState, {
            validate: validateState,
            onReset: function (state) {
                applyState(state, true);
            }
        });
    }

    const restoredState = stateStore ? stateStore.get() : initialState;
    applyState(validateState(restoredState) ? restoredState : initialState, false);

    cards.forEach(function (card) {
        const button = card.querySelector("[data-meaning-toggle]");
        button.addEventListener("click", function () {
            const nextSide = card.dataset.side === "opposite" ? "base" : "opposite";
            renderCard(card, nextSide, true);
            if (stateStore) {
                stateStore.save(collectState());
            }
        });
        card.addEventListener("animationend", function () {
            card.classList.remove("is-changing");
        });
    });

    if (stateStore) {
        stateStore.mount(document.getElementById("activityStateTools"), collectState);
    }
})();
