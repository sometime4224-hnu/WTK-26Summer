(() => {
    "use strict";

    const OBJECT_BASE = "../assets/c14/grammar/images/g4-hires-objects";
    const CARD_BASE = "../assets/c14/vocabulary/images/cards";

    const CARDS = [
        {
            id: "care-grow",
            word: "가꾸다",
            lead: "가꾸면",
            tail: "가꿀수록",
            result: "많아져요",
            direction: "grow",
            sceneLabel: "꽃",
            effectCopy: "꽃이 점점 많아져요.",
            baseImage: `${CARD_BASE}/c14-17.webp`,
            baseAlt: "가꾸다 장면 배경",
            spawn: { x: [12, 90], y: [58, 86], w: [9, 15], rotate: [-7, 7], scale: [0.78, 1.04] },
            patches: [
                { src: `${OBJECT_BASE}/care-sunflower.webp`, x: 18, y: 76, w: 15, rotate: -3, scale: 1.02 },
                { src: `${OBJECT_BASE}/care-sunflower-flip.webp`, x: 36, y: 70, w: 14, rotate: 4, scale: 0.96 },
                { src: `${OBJECT_BASE}/care-sunflower.webp`, x: 58, y: 77, w: 13, rotate: 5, scale: 0.9 },
                { src: `${OBJECT_BASE}/care-sunflower-flip.webp`, x: 76, y: 73, w: 12, rotate: -4, scale: 0.86 },
                { src: `${OBJECT_BASE}/care-sunflower.webp`, x: 89, y: 79, w: 11, rotate: 6, scale: 0.8 }
            ]
        },
        {
            id: "plant-grow",
            word: "심다",
            lead: "심으면",
            tail: "심을수록",
            result: "많아져요",
            direction: "grow",
            sceneLabel: "싹",
            effectCopy: "싹이 점점 많아져요.",
            baseImage: `${CARD_BASE}/c14-14.webp`,
            baseAlt: "심다 장면 배경",
            spawn: { x: [12, 88], y: [58, 88], w: [7, 10], rotate: [-6, 6], scale: [0.76, 1.02] },
            patches: [
                { src: `${OBJECT_BASE}/farm-seedling.webp`, x: 18, y: 82, w: 10, rotate: -2, scale: 1 },
                { src: `${OBJECT_BASE}/farm-seedling-flip.webp`, x: 33, y: 74, w: 9, rotate: 3, scale: 0.96 },
                { src: `${OBJECT_BASE}/farm-seedling.webp`, x: 50, y: 85, w: 10, rotate: -5, scale: 0.92 },
                { src: `${OBJECT_BASE}/farm-seedling-flip.webp`, x: 73, y: 78, w: 9, rotate: 5, scale: 0.88 },
                { src: `${OBJECT_BASE}/farm-seedling.webp`, x: 87, y: 86, w: 10, rotate: -4, scale: 0.84 }
            ]
        },
        {
            id: "livestock-grow",
            word: "기르다",
            lead: "기르면",
            tail: "기를수록",
            result: "많아져요",
            direction: "grow",
            sceneLabel: "소",
            effectCopy: "소가 점점 많아져요.",
            baseImage: `${CARD_BASE}/c14-15.webp`,
            baseAlt: "가축 장면 배경",
            spawn: { x: [14, 88], y: [55, 78], w: [10, 18], rotate: [-5, 5], scale: [0.72, 1] },
            patches: [
                { src: `${OBJECT_BASE}/livestock-cow.webp`, x: 19, y: 66, w: 18, rotate: -2, scale: 1 },
                { src: `${OBJECT_BASE}/livestock-cow-flip.webp`, x: 40, y: 72, w: 16, rotate: 3, scale: 0.94 },
                { src: `${OBJECT_BASE}/livestock-cow.webp`, x: 63, y: 62, w: 14, rotate: 2, scale: 0.88 },
                { src: `${OBJECT_BASE}/livestock-cow-flip.webp`, x: 83, y: 73, w: 13, rotate: -4, scale: 0.82 },
                { src: `${OBJECT_BASE}/livestock-cow.webp`, x: 57, y: 83, w: 12, rotate: 5, scale: 0.76 }
            ]
        },
        {
            id: "fish-grow",
            word: "모이다",
            lead: "모이면",
            tail: "모일수록",
            result: "많아져요",
            direction: "grow",
            sceneLabel: "물고기",
            effectCopy: "물고기가 점점 많아져요.",
            baseImage: `${CARD_BASE}/c14-16.webp`,
            baseAlt: "물고기 장면 배경",
            spawn: { x: [12, 90], y: [54, 82], w: [11, 18], rotate: [-7, 7], scale: [0.74, 1] },
            patches: [
                { src: `${OBJECT_BASE}/fish-orange.webp`, x: 17, y: 74, w: 18, rotate: -4, scale: 1 },
                { src: `${OBJECT_BASE}/fish-orange-flip.webp`, x: 35, y: 66, w: 16, rotate: 5, scale: 0.94 },
                { src: `${OBJECT_BASE}/fish-orange.webp`, x: 54, y: 77, w: 15, rotate: -2, scale: 0.9 },
                { src: `${OBJECT_BASE}/fish-orange-flip.webp`, x: 73, y: 68, w: 14, rotate: 3, scale: 0.84 },
                { src: `${OBJECT_BASE}/fish-orange.webp`, x: 88, y: 76, w: 13, rotate: 6, scale: 0.8 }
            ]
        },
        {
            id: "vegetable-grow",
            word: "키우다",
            lead: "키우면",
            tail: "키울수록",
            result: "많아져요",
            direction: "grow",
            sceneLabel: "당근",
            effectCopy: "당근이 점점 많아져요.",
            baseImage: `${CARD_BASE}/c14-13.webp`,
            baseAlt: "채소 장면 배경",
            spawn: { x: [14, 88], y: [62, 88], w: [9, 14], rotate: [-7, 7], scale: [0.76, 1] },
            patches: [
                { src: `${OBJECT_BASE}/vegetable-carrot.webp`, x: 17, y: 83, w: 14, rotate: -4, scale: 1 },
                { src: `${OBJECT_BASE}/vegetable-carrot-flip.webp`, x: 34, y: 74, w: 13, rotate: 3, scale: 0.95 },
                { src: `${OBJECT_BASE}/vegetable-carrot.webp`, x: 53, y: 84, w: 12, rotate: -6, scale: 0.9 },
                { src: `${OBJECT_BASE}/vegetable-carrot-flip.webp`, x: 73, y: 76, w: 12, rotate: 4, scale: 0.86 },
                { src: `${OBJECT_BASE}/vegetable-carrot.webp`, x: 88, y: 85, w: 11, rotate: -5, scale: 0.82 }
            ]
        },
        {
            id: "temperature-rise",
            type: "effect",
            word: "기온",
            effectWord: "올라가다",
            lead: "온도가 올라가면",
            tail: "올라갈수록",
            result: "더워져요",
            direction: "rise",
            modeLabel: "상승",
            sceneLabel: "기온",
            stageUnit: "단계",
            effectCopy: "온도가 점점 더워져요.",
            visual: {
                kind: "rise",
                mainEmoji: "🌡️",
                markerEmoji: "🔥",
                particleEmojis: ["☀️", "🔥", "⬆️"]
            }
        },
        {
            id: "temperature-fall",
            type: "effect",
            word: "기온",
            effectWord: "내려가다",
            lead: "온도가 내려가면",
            tail: "내려갈수록",
            result: "추워져요",
            direction: "fall",
            modeLabel: "하락",
            sceneLabel: "기온",
            stageUnit: "단계",
            effectCopy: "온도가 점점 추워져요.",
            visual: {
                kind: "fall",
                mainEmoji: "🌡️",
                markerEmoji: "❄️",
                particleEmojis: ["❄️", "💧", "⬇️"]
            }
        },
        {
            id: "energy-rise",
            type: "effect",
            word: "쉬다",
            lead: "쉬면",
            tail: "쉴수록",
            result: "기운이 나요",
            direction: "rise",
            modeLabel: "상승",
            sceneLabel: "기운",
            stageUnit: "단계",
            effectCopy: "쉴수록 기운이 나요.",
            visual: {
                kind: "rise",
                mainEmoji: "⚡",
                markerEmoji: "😊",
                particleEmojis: ["✨", "⚡", "⬆️"]
            }
        },
        {
            id: "energy-fall",
            type: "effect",
            word: "일하다",
            lead: "일하면",
            tail: "일할수록",
            result: "피곤해져요",
            direction: "fall",
            modeLabel: "하락",
            sceneLabel: "기운",
            stageUnit: "단계",
            effectCopy: "일할수록 피곤해져요.",
            visual: {
                kind: "fall",
                mainEmoji: "🔋",
                markerEmoji: "😴",
                particleEmojis: ["💤", "⬇️", "💧"]
            }
        },
        {
            id: "money-spend-decrease",
            type: "amount",
            word: "쓰다",
            lead: "쓰면",
            tail: "쓸수록",
            result: "돈이 줄어요",
            direction: "decrease",
            modeLabel: "줄어요",
            sceneLabel: "돈",
            stageUnit: "단계",
            effectCopy: "돈이 점점 줄어요.",
            visual: {
                kind: "decrease",
                mainEmoji: "💸",
                itemEmoji: "💵",
                faceEmoji: "😟"
            }
        },
        {
            id: "money-earn-increase",
            type: "amount",
            word: "벌다",
            lead: "벌면",
            tail: "벌수록",
            result: "돈이 늘어요",
            direction: "increase",
            modeLabel: "늘어요",
            sceneLabel: "돈",
            stageUnit: "단계",
            effectCopy: "돈이 점점 늘어요.",
            visual: {
                kind: "increase",
                mainEmoji: "💰",
                itemEmoji: "💵",
                faceEmoji: "😊"
            }
        },
        {
            id: "people-gather-increase",
            type: "amount",
            word: "모이다",
            lead: "모이면",
            tail: "모일수록",
            result: "사람이 늘어요",
            direction: "increase",
            modeLabel: "늘어요",
            sceneLabel: "사람",
            stageUnit: "단계",
            effectCopy: "사람이 점점 늘어요.",
            visual: {
                kind: "increase",
                mainEmoji: "👥",
                itemEmoji: "🧑",
                faceEmoji: "🙌"
            }
        },
        {
            id: "clothes-wash-decrease",
            type: "amount",
            word: "빨다",
            lead: "옷을 빨면",
            tail: "빨수록",
            result: "옷이 줄어요",
            direction: "decrease",
            modeLabel: "줄어요",
            sceneLabel: "옷",
            stageUnit: "단계",
            effectCopy: "옷이 점점 줄어요.",
            visual: {
                kind: "shrink-object",
                mainEmoji: "👕",
                itemEmoji: "🫧",
                faceEmoji: "😱"
            }
        }
    ];

    const refs = {
        totalProgress: document.getElementById("totalProgress"),
        growCount: document.getElementById("growCount"),
        pulseAllBtn: document.getElementById("pulseAllBtn"),
        resetAllBtn: document.getElementById("resetAllBtn"),
        board: document.getElementById("board")
    };

    const state = {
        stages: Object.fromEntries(CARDS.map((card) => [card.id, 0])),
        activeBursts: new Set()
    };

    refs.pulseAllBtn.addEventListener("click", advanceAllCards);
    refs.resetAllBtn.addEventListener("click", resetAllCards);

    render();

    function render() {
        refs.board.innerHTML = CARDS.map(renderCard).join("");

        refs.board.querySelectorAll("[data-action='advance']").forEach((button) => {
            button.addEventListener("click", () => advanceCard(button.dataset.cardId));
        });

        refs.board.querySelectorAll("[data-action='reset']").forEach((button) => {
            button.addEventListener("click", () => resetCard(button.dataset.cardId));
        });

        updateTopMetrics();
        state.activeBursts.clear();
    }

    function renderCard(card) {
        const stage = state.stages[card.id];
        const energy = Math.min(stage / 12, 1);
        const modeLabel = card.modeLabel || (card.direction === "grow" ? "늘어남" : "줄어듦");
        const stageUnit = card.stageUnit || "개";
        const scene = renderScene(card, stage, energy, state.activeBursts.has(card.id));

        return `
            <article class="motion-card" data-direction="${escapeAttr(card.direction)}" style="--energy:${energy};">
                <div class="card-top">
                    <span class="mode-tag mode-tag--${escapeAttr(card.direction)}">${escapeHtml(modeLabel)}</span>
                    <span class="stage-chip">${stage}${escapeHtml(stageUnit)}</span>
                </div>
                ${scene}
                <div class="copy">
                    <p class="base-word">${escapeHtml(card.word)}</p>
                    <p class="pattern"><span class="pattern-lead">${escapeHtml(card.lead)}</span> <span class="pattern-tail">${escapeHtml(card.tail)}</span> <span class="pattern-result">${escapeHtml(card.result)}</span></p>
                    ${renderTrail(card, stage)}
                    <p class="effect-copy">${escapeHtml(card.effectCopy)}</p>
                </div>
                <div class="card-actions">
                    <button class="step-btn" type="button" data-action="advance" data-card-id="${escapeAttr(card.id)}">
                        ${escapeHtml(`${card.lead} ${card.tail} ${card.result}`)}
                    </button>
                    <button class="reset-btn" type="button" data-action="reset" data-card-id="${escapeAttr(card.id)}" ${stage === 0 ? "disabled" : ""}>
                        처음
                    </button>
                </div>
            </article>
        `;
    }

    function renderScene(card, stage, energy, showBurst) {
        if (card.type === "effect") {
            return renderEffectScene(card, stage, energy, showBurst);
        }
        if (card.type === "amount") {
            return renderAmountScene(card, stage, energy, showBurst);
        }
        return renderImageScene(card, stage, showBurst);
    }

    function renderImageScene(card, stage, showBurst) {
        const patchInstances = buildPatchInstances(card, stage);

        return `
            <div class="media-frame">
                <img class="scene-base" src="${escapeAttr(card.baseImage)}" alt="${escapeAttr(card.baseAlt)}" />
                <div class="frame-top-mask"></div>
                <span class="scene-chip">${escapeHtml(card.sceneLabel)}</span>
                ${showBurst ? renderClickWordEffect(card) : ""}
                <div class="object-layer">
                    ${patchInstances.map((patch) => `
                        <div class="object-patch is-visible" style="left:${patch.x}%;top:${patch.y}%;width:${patch.w}%;--rotate:${patch.rotate}deg;--patch-scale:${patch.scale};">
                            <img src="${escapeAttr(patch.src)}" alt="" />
                        </div>
                    `).join("")}
                </div>
                <div class="frame-top-rim"></div>
            </div>
        `;
    }

    function renderEffectScene(card, stage, energy, showBurst) {
        const level = Math.min(stage, 12);

        return `
            <div class="media-frame effect-frame effect-frame--${escapeAttr(card.visual.kind)}" style="--level:${level};--energy:${energy};">
                <span class="scene-chip">${escapeHtml(card.sceneLabel)}</span>
                ${showBurst ? renderClickWordEffect(card) : ""}
                <div class="effect-orbit" aria-hidden="true">
                    <span>${escapeHtml(card.visual.mainEmoji)}</span>
                </div>
                <div class="effect-track" aria-hidden="true">
                    <div class="effect-scale">
                        ${Array.from({ length: 7 }, () => "<span></span>").join("")}
                    </div>
                    <div class="effect-fill"></div>
                    <div class="effect-marker">${escapeHtml(card.visual.markerEmoji)}</div>
                </div>
                <div class="effect-particles" aria-hidden="true">
                    ${renderEffectParticles(card, stage)}
                </div>
                <div class="effect-arrow" aria-hidden="true">${card.direction === "rise" ? "↑" : "↓"}</div>
                <div class="frame-top-rim"></div>
            </div>
        `;
    }

    function renderAmountScene(card, stage, energy, showBurst) {
        const level = Math.min(stage, 12);
        const amount = card.direction === "increase"
            ? Math.min(stage, 18)
            : Math.max(1, 12 - Math.min(stage, 11));
        const shrinkScale = round(Math.max(0.26, 1 - Math.min(stage, 14) * 0.064));
        const operator = card.direction === "increase" ? "+" : "−";
        const changeValue = Math.min(stage * 2, 99);
        const showAmountChange = stage > 0;

        return `
            <div class="media-frame amount-frame amount-frame--${escapeAttr(card.visual.kind)}" style="--level:${level};--amount:${amount};--energy:${energy};--shrink-scale:${shrinkScale};">
                <span class="scene-chip">${escapeHtml(card.sceneLabel)}</span>
                ${showBurst ? renderClickWordEffect(card) : ""}
                ${showAmountChange ? `<div class="amount-operator amount-operator--${escapeAttr(card.direction)}" aria-hidden="true">${operator}</div>` : ""}
                ${showAmountChange ? `<div class="amount-change-stamp amount-change-stamp--${escapeAttr(card.direction)}" aria-hidden="true">${operator}${changeValue}</div>` : ""}
                <div class="amount-stage" aria-hidden="true">
                    ${card.visual.kind === "shrink-object"
                        ? renderShrinkObject(card, stage)
                        : renderAmountPile(card, stage, amount)}
                </div>
                ${showAmountChange ? `<div class="amount-sign-field" aria-hidden="true">
                    ${renderAmountSigns(card, stage, operator)}
                </div>` : ""}
                <div class="amount-wave" aria-hidden="true"></div>
                <div class="frame-top-rim"></div>
            </div>
        `;
    }

    function renderClickWordEffect(card) {
        const word = card.effectWord || card.word;

        return `
            <div class="word-burst word-burst--${escapeAttr(card.direction)}" aria-hidden="true">
                <span>${escapeHtml(word)}</span>
            </div>
        `;
    }

    function buildPatchInstances(card, count) {
        return Array.from({ length: count }, (_, index) => {
            if (index < card.patches.length) {
                return card.patches[index];
            }
            return createGeneratedPatch(card, index);
        });
    }

    function createGeneratedPatch(card, index) {
        const source = card.patches[index % card.patches.length];
        const spawn = card.spawn;
        const yBand = Math.floor((index - card.patches.length) / 5);
        const bandOffset = (yBand % 4) * 2.8;

        return {
            src: source.src,
            x: round(lerp(spawn.x[0], spawn.x[1], seeded(card.id, index, 1))),
            y: round(Math.min(spawn.y[1], lerp(spawn.y[0], spawn.y[1], seeded(card.id, index, 2)) + bandOffset)),
            w: round(lerp(spawn.w[0], spawn.w[1], seeded(card.id, index, 3))),
            rotate: round(lerp(spawn.rotate[0], spawn.rotate[1], seeded(card.id, index, 4))),
            scale: round(lerp(spawn.scale[0], spawn.scale[1], seeded(card.id, index, 5)))
        };
    }

    function renderTrail(card, stage) {
        if (card.type === "effect" || card.type === "amount") {
            return renderLevelTrail(card, stage);
        }
        return renderCountTrail(stage);
    }

    function renderCountTrail(stage) {
        const visibleDots = Math.min(stage, 12);
        const extraCount = Math.max(stage - visibleDots, 0);

        return `
            <div class="meter meter--count" aria-hidden="true">
                ${Array.from({ length: visibleDots }, () => "<div class=\"meter-dot is-on\"><span></span></div>").join("")}
                ${extraCount > 0 ? `<span class="meter-more">+${extraCount}</span>` : ""}
            </div>
        `;
    }

    function renderLevelTrail(card, stage) {
        const visibleDots = Math.min(stage, 12);
        const extraCount = Math.max(stage - visibleDots, 0);

        return `
            <div class="meter meter--level" data-direction="${escapeAttr(card.direction)}" aria-hidden="true">
                ${Array.from({ length: 12 }, (_, index) => `
                    <div class="meter-dot ${index < visibleDots ? "is-on" : ""}"><span></span></div>
                `).join("")}
                ${extraCount > 0 ? `<span class="meter-more">+${extraCount}</span>` : ""}
            </div>
        `;
    }

    function renderEffectParticles(card, stage) {
        const visibleParticles = Math.min(stage, 18);
        const emojis = card.visual.particleEmojis;

        return Array.from({ length: visibleParticles }, (_, index) => {
            const emoji = emojis[index % emojis.length];
            const x = round(lerp(12, 88, seeded(card.id, index, 11)));
            const drift = round(lerp(-28, 28, seeded(card.id, index, 12)));
            const delay = round(lerp(-0.9, 0, seeded(card.id, index, 13)));
            const size = round(lerp(1.1, 1.9, seeded(card.id, index, 14)));

            return `
                <span class="effect-particle" style="left:${x}%;--drift:${drift}px;--delay:${delay}s;--size:${size};">
                    ${escapeHtml(emoji)}
                </span>
            `;
        }).join("");
    }

    function renderAmountPile(card, stage, amount) {
        const faceShift = card.direction === "increase" ? "happy" : "worried";
        const itemCount = card.direction === "increase" ? amount : Math.max(1, amount);

        return `
            <div class="amount-main amount-main--${escapeAttr(card.direction)}">${escapeHtml(card.visual.mainEmoji)}</div>
            <div class="amount-face amount-face--${escapeAttr(faceShift)}">${escapeHtml(card.visual.faceEmoji)}</div>
            <div class="amount-pile">
                ${Array.from({ length: itemCount }, (_, index) => renderAmountItem(card, index)).join("")}
            </div>
        `;
    }

    function renderShrinkObject(card, stage) {
        const bubbles = Math.min(Math.max(stage, 1), 14);

        return `
            <div class="shrink-clothes">
                <span class="wash-basin">🧺</span>
                <span class="shrink-shirt">${escapeHtml(card.visual.mainEmoji)}</span>
                <span class="oops-face">${escapeHtml(card.visual.faceEmoji)}</span>
                ${Array.from({ length: bubbles }, (_, index) => `
                    <span class="wash-bubble" style="left:${round(lerp(16, 84, seeded(card.id, index, 31)))}%;top:${round(lerp(14, 78, seeded(card.id, index, 32)))}%;--delay:${round(lerp(-0.9, 0, seeded(card.id, index, 33)))}s;--size:${round(lerp(0.72, 1.42, seeded(card.id, index, 34)))};">
                        ${escapeHtml(card.visual.itemEmoji)}
                    </span>
                `).join("")}
            </div>
        `;
    }

    function renderAmountItem(card, index) {
        const x = round(lerp(14, 86, seeded(card.id, index, 21)));
        const y = round(lerp(28, 82, seeded(card.id, index, 22)));
        const rotate = round(lerp(-18, 18, seeded(card.id, index, 23)));
        const scale = round(lerp(0.86, 1.32, seeded(card.id, index, 24)));
        const delay = round(lerp(-0.6, 0, seeded(card.id, index, 25)));

        return `
            <span class="amount-item" style="left:${x}%;top:${y}%;--rotate:${rotate}deg;--item-scale:${scale};--delay:${delay}s;">
                ${escapeHtml(card.visual.itemEmoji)}
            </span>
        `;
    }

    function renderAmountSigns(card, stage, operator) {
        const visibleSigns = Math.min(stage * 3, 28);

        return Array.from({ length: visibleSigns }, (_, index) => {
            const x = round(lerp(10, 90, seeded(card.id, index, 41)));
            const y = round(lerp(14, 86, seeded(card.id, index, 42)));
            const rotate = round(lerp(-24, 24, seeded(card.id, index, 43)));
            const delay = round(lerp(-0.72, 0, seeded(card.id, index, 44)));
            const scale = round(lerp(0.72, 1.36, seeded(card.id, index, 45)));

            return `
                <span class="amount-sign amount-sign--${escapeAttr(card.direction)}" style="left:${x}%;top:${y}%;--rotate:${rotate}deg;--delay:${delay}s;--sign-scale:${scale};">
                    ${operator}
                </span>
            `;
        }).join("");
    }

    function seeded(cardId, index, salt) {
        let value = salt * 1009 + index * 9176;
        for (let i = 0; i < cardId.length; i += 1) {
            value += cardId.charCodeAt(i) * (i + 17);
        }
        const next = Math.sin(value) * 10000;
        return next - Math.floor(next);
    }

    function lerp(min, max, amount) {
        return min + (max - min) * amount;
    }

    function round(value) {
        return Math.round(value * 100) / 100;
    }

    function advanceCard(cardId) {
        if (!(cardId in state.stages)) {
            return;
        }
        state.stages[cardId] += 1;
        state.activeBursts = new Set([cardId]);
        render();
    }

    function resetCard(cardId) {
        if (!(cardId in state.stages)) {
            return;
        }
        state.stages[cardId] = 0;
        state.activeBursts.clear();
        render();
    }

    function advanceAllCards() {
        state.activeBursts = new Set(CARDS.map((card) => card.id));
        CARDS.forEach((card) => {
            state.stages[card.id] += 1;
        });
        render();
    }

    function resetAllCards() {
        state.activeBursts.clear();
        CARDS.forEach((card) => {
            state.stages[card.id] = 0;
        });
        render();
    }

    function updateTopMetrics() {
        const totalCount = CARDS.reduce((sum, card) => sum + state.stages[card.id], 0);
        const activeCount = CARDS.filter((card) => state.stages[card.id] > 0).length;

        refs.totalProgress.textContent = `변화 ${totalCount}회`;
        refs.growCount.textContent = `진행 ${activeCount} / ${CARDS.length}`;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }
})();
