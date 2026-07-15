(() => {
    "use strict";

    const ASSET_BASE = "../assets/c14/misc/images/living-things-common";
    const STORAGE_KEY = "c14-grammar4-gradual-change-assets-candidate-v1";
    const STORAGE_VERSION = 1;

    const asset = (path) => `${ASSET_BASE}/${path}`;

    function animalGrowthCard(options) {
        return {
            id: options.id,
            word: "크다",
            lead: options.lead,
            tail: "클수록",
            result: options.result,
            direction: "grow",
            modeLabel: options.modeLabel || "성장",
            sceneLabel: options.sceneLabel,
            sceneKind: "pasture",
            effectWord: options.effectWord,
            effectCopy: options.effectCopy,
            showBridge: true,
            maxStage: options.maxStage || 10,
            maxItems: 10,
            spawn: { x: [13, 87], y: [76, 88], w: [5, 8], rotate: [-6, 6], scale: [0.72, 1] },
            features: [
                {
                    src: asset(options.babySrc),
                    x: options.babyX || 31,
                    y: options.babyY || 64,
                    w: options.babyW || 22,
                    minScale: 1.02,
                    maxScale: 0.8,
                    opacityFrom: 1,
                    opacityTo: 0.56,
                    label: options.babyLabel || "새끼"
                },
                {
                    src: asset(options.adultSrc),
                    x: options.adultX || 68,
                    y: options.adultY || 59,
                    w: options.adultW || 31,
                    minScale: 0.58,
                    maxScale: 1.08,
                    opacityFrom: 0.48,
                    opacityTo: 1,
                    label: options.adultLabel || "성체"
                }
            ],
            patches: [
                patch("plants/generated-small/plant-15-emerald-grass.png", 15, 85, 8, -3, 0.86),
                patch("plants/generated-small/plant-18-meadow-grass.png", 47, 85, 8, 4, 0.82),
                patch("plants/generated-small/plant-25-lawn-tuft.png", 82, 86, 7, -5, 0.8)
            ],
            assetPool: [
                asset("plants/generated-small/plant-15-emerald-grass.png"),
                asset("plants/generated-small/plant-18-meadow-grass.png"),
                asset("plants/generated-small/plant-25-lawn-tuft.png"),
                asset("plants/generated-small/plant-21-clover.png")
            ]
        };
    }

    const CARDS = [
        {
            id: "flower-garden-assets",
            word: "가꾸다",
            lead: "꽃을 가꾸면",
            tail: "가꿀수록",
            result: "꽃밭이 풍성해져요",
            direction: "increase",
            modeLabel: "꽃밭",
            sceneLabel: "가꾸기",
            sceneKind: "garden",
            effectWord: "풍성",
            effectCopy: "꽃을 가꾸면 가꿀수록 꽃밭이 점점 풍성해져요.",
            itemsPerStage: 2,
            maxItems: 22,
            spawn: { x: [10, 90], y: [55, 86], w: [8, 14], rotate: [-8, 8], scale: [0.82, 1.08] },
            patches: [
                patch("plants/sheet-small/sheet-plant-15-sunflower.png", 17, 78, 15, -4, 1.04),
                patch("plants/sheet-small/sheet-plant-06-pink-rose.png", 31, 69, 13, 5, 0.98),
                patch("plants/sheet-small/sheet-plant-01-red-tulip.png", 48, 82, 12, -3, 0.94),
                patch("plants/sheet-small/sheet-plant-09-lavender-sprig.png", 64, 72, 12, 6, 0.92),
                patch("plants/sheet-small/sheet-plant-19-yellow-daisy.png", 80, 80, 13, -5, 0.9)
            ],
            assetPool: [
                asset("plants/sheet-small/sheet-plant-15-sunflower.png"),
                asset("plants/sheet-small/sheet-plant-06-pink-rose.png"),
                asset("plants/sheet-small/sheet-plant-01-red-tulip.png"),
                asset("plants/sheet-small/sheet-plant-12-blue-cornflower.png"),
                asset("plants/sheet-small/sheet-plant-19-yellow-daisy.png"),
                asset("plants/sheet-small/sheet-plant-31-lavender-bush.png")
            ]
        },
        {
            id: "seedling-field-assets",
            word: "심다",
            lead: "씨앗을 심으면",
            tail: "심을수록",
            result: "싹이 많아져요",
            direction: "increase",
            modeLabel: "새싹",
            sceneLabel: "심기",
            sceneKind: "field",
            effectWord: "싹",
            effectCopy: "씨앗을 심으면 심을수록 새싹이 여기저기 올라와요.",
            itemsPerStage: 2,
            maxItems: 24,
            spawn: { x: [11, 90], y: [58, 88], w: [6, 11], rotate: [-6, 6], scale: [0.78, 1.08] },
            patches: [
                patch("plants/sheet-small/sheet-plant-23-green-sprout.png", 18, 82, 11, -2, 1),
                patch("plants/sheet-small/sheet-plant-24-green-sprout-tall.png", 34, 72, 10, 3, 0.96),
                patch("plants/generated-small/plant-14-mint-sprout.png", 51, 84, 9, -5, 0.94),
                patch("plants/generated-small/plant-21-clover.png", 70, 78, 10, 4, 0.9),
                patch("plants/generated-small/plant-25-lawn-tuft.png", 86, 85, 10, -4, 0.86)
            ],
            assetPool: [
                asset("plants/sheet-small/sheet-plant-23-green-sprout.png"),
                asset("plants/sheet-small/sheet-plant-24-green-sprout-tall.png"),
                asset("plants/generated-small/plant-14-mint-sprout.png"),
                asset("plants/generated-small/plant-21-clover.png"),
                asset("plants/generated-small/plant-25-lawn-tuft.png")
            ]
        },
        {
            id: "vegetable-harvest-assets",
            word: "키우다",
            lead: "채소를 키우면",
            tail: "키울수록",
            result: "수확이 많아져요",
            direction: "increase",
            modeLabel: "채소",
            sceneLabel: "텃밭",
            sceneKind: "field",
            effectWord: "수확",
            effectCopy: "채소를 키우면 키울수록 수확할 것이 많아져요.",
            itemsPerStage: 2,
            maxItems: 22,
            spawn: { x: [12, 88], y: [58, 86], w: [9, 15], rotate: [-7, 7], scale: [0.78, 1.06] },
            patches: [
                patch("plants/produce-vegetable/produce-vegetable-02-carrot.png", 16, 78, 14, -5, 1),
                patch("plants/produce-vegetable/produce-vegetable-12-lettuce.png", 33, 69, 13, 3, 0.96),
                patch("plants/produce-vegetable/produce-vegetable-10-radish.png", 51, 82, 13, -4, 0.92),
                patch("plants/produce-vegetable/produce-vegetable-08-broccoli.png", 69, 72, 13, 5, 0.9),
                patch("plants/produce-vegetable/produce-vegetable-28-corn.png", 85, 80, 14, -3, 0.88)
            ],
            assetPool: [
                asset("plants/produce-vegetable/produce-vegetable-02-carrot.png"),
                asset("plants/produce-vegetable/produce-vegetable-12-lettuce.png"),
                asset("plants/produce-vegetable/produce-vegetable-10-radish.png"),
                asset("plants/produce-vegetable/produce-vegetable-08-broccoli.png"),
                asset("plants/produce-vegetable/produce-vegetable-28-corn.png"),
                asset("plants/produce-vegetable/produce-vegetable-25-cucumber.png")
            ]
        },
        {
            id: "fruit-basket-assets",
            word: "수확하다",
            lead: "과일을 수확하면",
            tail: "수확할수록",
            result: "과일이 많아져요",
            direction: "increase",
            modeLabel: "과일",
            sceneLabel: "수확",
            sceneKind: "orchard",
            effectWord: "과일",
            effectCopy: "과일을 수확하면 수확할수록 과일이 가득해져요.",
            itemsPerStage: 2,
            maxItems: 24,
            spawn: { x: [12, 88], y: [58, 86], w: [8, 13], rotate: [-10, 10], scale: [0.78, 1.08] },
            patches: [
                patch("plants/produce-fruit/produce-fruit-01-red-apple.png", 16, 79, 12, -5, 1),
                patch("plants/produce-fruit/produce-fruit-04-strawberry.png", 30, 70, 11, 6, 0.96),
                patch("plants/produce-fruit/produce-fruit-11-purple-grapes.png", 48, 82, 12, -4, 0.94),
                patch("plants/produce-fruit/produce-fruit-21-pineapple.png", 67, 72, 13, 4, 0.9),
                patch("plants/produce-fruit/produce-fruit-18-cherry.png", 84, 80, 10, -7, 0.88)
            ],
            assetPool: [
                asset("plants/produce-fruit/produce-fruit-01-red-apple.png"),
                asset("plants/produce-fruit/produce-fruit-04-strawberry.png"),
                asset("plants/produce-fruit/produce-fruit-11-purple-grapes.png"),
                asset("plants/produce-fruit/produce-fruit-21-pineapple.png"),
                asset("plants/produce-fruit/produce-fruit-18-cherry.png"),
                asset("plants/produce-fruit/produce-fruit-10-orange.png")
            ]
        },
        {
            id: "tree-growth-assets",
            word: "자라다",
            lead: "나무가 자라면",
            tail: "자랄수록",
            result: "커져요",
            direction: "grow",
            modeLabel: "성장",
            sceneLabel: "나무",
            sceneKind: "orchard",
            effectWord: "커져요",
            effectCopy: "나무가 자라면 자랄수록 더 크고 든든해져요.",
            maxItems: 8,
            spawn: { x: [18, 84], y: [70, 86], w: [7, 10], rotate: [-6, 6], scale: [0.82, 1] },
            features: [
                {
                    src: asset("plants/medium/medium-plant-08-apple-tree.png"),
                    x: 50,
                    y: 56,
                    w: 42,
                    minScale: 0.42,
                    maxScale: 1.04,
                    label: "자라다"
                }
            ],
            patches: [
                patch("plants/generated-small/plant-14-mint-sprout.png", 19, 83, 9, -2, 0.9),
                patch("plants/generated-small/plant-21-clover.png", 34, 84, 8, 3, 0.86),
                patch("plants/produce-fruit/produce-fruit-01-red-apple.png", 63, 75, 8, -5, 0.8),
                patch("plants/produce-fruit/produce-fruit-02-green-apple.png", 78, 81, 8, 5, 0.78)
            ],
            assetPool: [
                asset("plants/generated-small/plant-14-mint-sprout.png"),
                asset("plants/generated-small/plant-21-clover.png"),
                asset("plants/produce-fruit/produce-fruit-01-red-apple.png"),
                asset("plants/produce-fruit/produce-fruit-02-green-apple.png")
            ]
        },
        {
            id: "farm-animal-assets",
            word: "기르다",
            lead: "가축을 기르면",
            tail: "기를수록",
            result: "가축이 많아져요",
            direction: "increase",
            modeLabel: "가축",
            sceneLabel: "목장",
            sceneKind: "pasture",
            effectWord: "가축",
            effectCopy: "가축을 기르면 기를수록 목장이 더 활기차져요.",
            maxItems: 14,
            spawn: { x: [12, 88], y: [55, 80], w: [13, 21], rotate: [-5, 5], scale: [0.74, 1.04] },
            patches: [
                patch("animals/farm-medium/farm-01-cow.png", 18, 67, 20, -2, 1),
                patch("animals/farm-medium/farm-04-sheep.png", 38, 74, 16, 3, 0.94),
                patch("animals/farm-medium/farm-06-pig.png", 59, 70, 16, -4, 0.9),
                patch("animals/farm-medium/farm-02-horse.png", 80, 63, 20, 2, 0.88)
            ],
            assetPool: [
                asset("animals/farm-medium/farm-01-cow.png"),
                asset("animals/farm-medium/farm-04-sheep.png"),
                asset("animals/farm-medium/farm-06-pig.png"),
                asset("animals/farm-medium/farm-02-horse.png"),
                asset("animals/farm-medium/farm-09-deer.png")
            ]
        },
        {
            id: "calf-growth-assets",
            word: "크다",
            lead: "송아지가 크면",
            tail: "클수록",
            result: "튼튼해져요",
            direction: "grow",
            modeLabel: "새끼 동물",
            sceneLabel: "성장",
            sceneKind: "pasture",
            effectWord: "튼튼",
            effectCopy: "송아지가 크면 클수록 몸이 더 튼튼해져요.",
            showBridge: true,
            features: [
                {
                    src: asset("animals/baby-small/baby-07-calf.png"),
                    x: 31,
                    y: 62,
                    w: 23,
                    minScale: 1.02,
                    maxScale: 0.82,
                    opacityFrom: 1,
                    opacityTo: 0.58,
                    label: "처음"
                },
                {
                    src: asset("animals/farm-medium/farm-01-cow.png"),
                    x: 68,
                    y: 58,
                    w: 31,
                    minScale: 0.58,
                    maxScale: 1.08,
                    opacityFrom: 0.48,
                    opacityTo: 1,
                    label: "나중"
                }
            ],
            maxItems: 10,
            spawn: { x: [15, 85], y: [76, 86], w: [5, 8], rotate: [-6, 6], scale: [0.72, 1] },
            patches: [
                patch("plants/generated-small/plant-15-emerald-grass.png", 18, 84, 8, -3, 0.86),
                patch("plants/generated-small/plant-18-meadow-grass.png", 48, 84, 8, 4, 0.82),
                patch("plants/generated-small/plant-25-lawn-tuft.png", 80, 85, 7, -5, 0.8)
            ],
            assetPool: [
                asset("plants/generated-small/plant-15-emerald-grass.png"),
                asset("plants/generated-small/plant-18-meadow-grass.png"),
                asset("plants/generated-small/plant-25-lawn-tuft.png")
            ]
        },
        animalGrowthCard({
            id: "piglet-growth-assets",
            lead: "아기 돼지가 크면",
            result: "건강해져요",
            sceneLabel: "돼지",
            effectWord: "건강",
            effectCopy: "아기 돼지가 크면 클수록 몸이 더 건강해져요.",
            babySrc: "animals/baby-small/baby-06-piglet.png",
            adultSrc: "animals/farm-medium/farm-06-pig.png",
            babyLabel: "아기",
            adultLabel: "성체",
            babyW: 23,
            adultW: 31,
            adultY: 62
        }),
        animalGrowthCard({
            id: "lamb-growth-assets",
            lead: "어린 양이 크면",
            result: "복슬복슬해져요",
            sceneLabel: "양",
            effectWord: "복슬",
            effectCopy: "어린 양이 크면 클수록 털이 더 복슬복슬해져요.",
            babySrc: "animals/baby-small/baby-08-lamb.png",
            adultSrc: "animals/farm-medium/farm-04-sheep.png",
            babyLabel: "어린 양",
            adultLabel: "어른 양",
            babyW: 22,
            adultW: 30,
            adultY: 60
        }),
        animalGrowthCard({
            id: "foal-growth-assets",
            lead: "망아지가 크면",
            result: "힘이 세져요",
            sceneLabel: "말",
            effectWord: "힘",
            effectCopy: "망아지가 크면 클수록 달릴 힘이 세져요.",
            babySrc: "animals/baby-small/baby-10-foal.png",
            adultSrc: "animals/farm-medium/farm-02-horse.png",
            babyLabel: "망아지",
            adultLabel: "말",
            babyW: 22,
            adultW: 34,
            adultY: 57
        }),
        animalGrowthCard({
            id: "fawn-growth-assets",
            lead: "새끼 사슴이 크면",
            result: "민첩해져요",
            sceneLabel: "사슴",
            effectWord: "민첩",
            effectCopy: "새끼 사슴이 크면 클수록 더 빠르고 민첩해져요.",
            babySrc: "animals/baby-small/baby-11-fawn.png",
            adultSrc: "animals/farm-medium/farm-09-deer.png",
            babyLabel: "새끼",
            adultLabel: "성체",
            babyW: 22,
            adultW: 33,
            adultY: 57
        }),
        animalGrowthCard({
            id: "goat-kid-growth-assets",
            lead: "새끼 염소가 크면",
            result: "튼튼해져요",
            sceneLabel: "염소",
            effectWord: "튼튼",
            effectCopy: "새끼 염소가 크면 클수록 다리가 더 튼튼해져요.",
            babySrc: "animals/baby-small/baby-09-goat-kid.png",
            adultSrc: "animals/cartoon-small/cartoon-15-goat.png",
            babyLabel: "새끼",
            adultLabel: "염소",
            babyW: 23,
            adultW: 28,
            adultY: 61
        }),
        animalGrowthCard({
            id: "chick-growth-assets",
            lead: "병아리가 크면",
            result: "닭이 돼요",
            sceneLabel: "닭",
            effectWord: "닭",
            effectCopy: "병아리가 크면 클수록 어른 닭의 모습에 가까워져요.",
            babySrc: "animals/baby-small/baby-04-chick.png",
            adultSrc: "animals/cartoon-small/cartoon-02-hen.png",
            babyLabel: "병아리",
            adultLabel: "닭",
            babyW: 20,
            adultW: 29,
            adultY: 60
        }),
        animalGrowthCard({
            id: "hamster-growth-assets",
            lead: "아기 햄스터가 크면",
            result: "통통해져요",
            sceneLabel: "햄스터",
            effectWord: "통통",
            effectCopy: "아기 햄스터가 크면 클수록 몸이 더 통통해져요.",
            babySrc: "animals/baby-small/baby-23-hamster-pup.png",
            adultSrc: "animals/cartoon-small/cartoon-10-hamster.png",
            babyLabel: "아기",
            adultLabel: "성체",
            babyW: 21,
            adultW: 27,
            adultY: 62
        }),
        animalGrowthCard({
            id: "squirrel-growth-assets",
            lead: "새끼 다람쥐가 크면",
            result: "재빨라져요",
            sceneLabel: "다람쥐",
            effectWord: "재빨라",
            effectCopy: "새끼 다람쥐가 크면 클수록 더 재빨라져요.",
            babySrc: "animals/baby-small/baby-21-squirrel-kit.png",
            adultSrc: "animals/cartoon-small/cartoon-09-squirrel.png",
            babyLabel: "새끼",
            adultLabel: "성체",
            babyW: 21,
            adultW: 27,
            adultY: 61
        }),
        {
            id: "grass-water-assets",
            word: "물을 주다",
            lead: "물을 주면",
            tail: "줄수록",
            result: "풀이 잘 자라요",
            direction: "grow",
            modeLabel: "풀",
            sceneLabel: "물 주기",
            sceneKind: "field",
            effectWord: "쑥쑥",
            effectCopy: "물을 주면 줄수록 풀이 쑥쑥 자라요.",
            itemsPerStage: 2,
            maxItems: 26,
            spawn: { x: [8, 92], y: [58, 88], w: [7, 13], rotate: [-8, 8], scale: [0.74, 1.08] },
            patches: [
                patch("plants/generated-small/plant-15-emerald-grass.png", 15, 82, 12, -4, 1),
                patch("plants/generated-small/plant-16-lime-grass.png", 29, 75, 11, 4, 0.96),
                patch("plants/generated-small/plant-18-meadow-grass.png", 45, 85, 12, -3, 0.92),
                patch("plants/sheet-small/sheet-plant-29-grass-tuft.png", 63, 78, 13, 5, 0.9),
                patch("plants/sheet-small/sheet-plant-30-ornamental-grass.png", 82, 84, 12, -5, 0.86)
            ],
            assetPool: [
                asset("plants/generated-small/plant-15-emerald-grass.png"),
                asset("plants/generated-small/plant-16-lime-grass.png"),
                asset("plants/generated-small/plant-18-meadow-grass.png"),
                asset("plants/sheet-small/sheet-plant-29-grass-tuft.png"),
                asset("plants/sheet-small/sheet-plant-30-ornamental-grass.png")
            ]
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
        stages: loadStages(),
        activeBursts: new Set()
    };

    refs.pulseAllBtn.addEventListener("click", advanceAllCards);
    refs.resetAllBtn.addEventListener("click", resetAllCards);
    refs.board.addEventListener("error", handleAssetError, true);

    render();

    function patch(path, x, y, w, rotate, scale) {
        return {
            src: asset(path),
            x,
            y,
            w,
            rotate,
            scale
        };
    }

    function render(focusRequest = null) {
        const savedScrollLeft = refs.board.scrollLeft;
        refs.board.setAttribute("aria-busy", "true");
        refs.board.innerHTML = CARDS.map(renderCard).join("");

        refs.board.querySelectorAll("[data-action='advance']").forEach((button) => {
            button.addEventListener("click", () => advanceCard(button.dataset.cardId, "advance"));
        });

        refs.board.querySelectorAll("[data-action='reset']").forEach((button) => {
            button.addEventListener("click", () => resetCard(button.dataset.cardId, "reset"));
        });

        updateTopMetrics();
        refs.board.scrollLeft = savedScrollLeft;
        refs.board.setAttribute("aria-busy", "false");
        restoreFocus(focusRequest, savedScrollLeft);
        state.activeBursts.clear();
    }

    function renderCard(card) {
        const stage = state.stages[card.id];
        const maxStage = getMaxStage(card);
        const energy = maxStage > 0 ? Math.min(stage / maxStage, 1) : 0;
        const scene = renderAssetScene(card, stage, energy, state.activeBursts.has(card.id));
        const completeClass = stage >= maxStage ? " is-complete" : "";
        const visualState = getVisualState(stage, maxStage);

        return `
            <article class="motion-card${completeClass}" data-card-id="${escapeAttr(card.id)}" data-direction="${escapeAttr(card.direction)}" data-visual-state="${visualState}" data-stage="${stage}" style="--energy:${energy};">
                <div class="card-top">
                    <span class="mode-tag mode-tag--${escapeAttr(card.direction)}" data-copy-layer="PRIMARY">${escapeHtml(card.modeLabel)}</span>
                    <span class="stage-chip" data-copy-layer="PRIMARY">${stage}${escapeHtml(card.stageUnit || "단계")}</span>
                </div>
                ${scene}
                <div class="copy">
                    <p class="base-word" data-copy-layer="PRIMARY">${escapeHtml(card.word)}</p>
                    <p class="pattern" data-copy-layer="PRIMARY"><span class="pattern-lead">${escapeHtml(card.lead)}</span> <span class="pattern-tail">${escapeHtml(card.tail)}</span> <span class="pattern-result">${escapeHtml(card.result)}</span></p>
                    ${renderTrail(card, stage)}
                    <p class="effect-copy" data-copy-layer="PRIMARY">${escapeHtml(card.effectCopy)}</p>
                </div>
                <div class="card-actions">
                    <button class="step-btn" type="button" data-action="advance" data-card-id="${escapeAttr(card.id)}" data-copy-layer="PRIMARY" ${stage >= maxStage ? "disabled" : ""}>
                        ${escapeHtml(`${card.lead} ${card.tail} ${card.result}`)}
                    </button>
                    <button class="reset-btn" type="button" data-action="reset" data-card-id="${escapeAttr(card.id)}" data-copy-layer="PRIMARY" ${stage === 0 ? "disabled" : ""}>
                        처음
                    </button>
                </div>
                <span class="done-stamp" data-copy-layer="PRIMARY">완성</span>
            </article>
        `;
    }

    function renderAssetScene(card, stage, energy, showBurst) {
        const frameClass = `asset-frame asset-frame--${card.sceneKind || "field"}`;
        const patchCount = Math.min(stage * (card.itemsPerStage || 1), card.maxItems || getMaxStage(card));
        const patchInstances = buildPatchInstances(card, patchCount);

        return `
            <div class="media-frame ${escapeAttr(frameClass)}" data-nontext-visual data-visual-state="${getVisualState(stage, getMaxStage(card))}" data-copy-layer="PRIMARY" style="--energy:${energy};">
                <span class="scene-chip" data-copy-layer="PRIMARY">${escapeHtml(card.sceneLabel)}</span>
                ${showBurst ? renderClickWordEffect(card) : ""}
                ${renderScenery(card)}
                <div class="asset-ground-line" aria-hidden="true"></div>
                <div class="asset-field-row" style="bottom:22%;" aria-hidden="true"></div>
                <div class="asset-field-row" style="bottom:34%;" aria-hidden="true"></div>
                <div class="asset-field-row" style="bottom:46%;" aria-hidden="true"></div>
                ${card.showBridge ? "<div class=\"asset-pair-bridge\" aria-hidden=\"true\"></div>" : ""}
                ${(card.features || []).map((feature) => renderFeature(feature, energy)).join("")}
                <div class="object-layer">
                    ${patchInstances.map(renderPatch).join("")}
                </div>
                <div class="frame-top-rim"></div>
            </div>
        `;
    }

    function renderScenery(card) {
        const showFence = card.sceneKind === "pasture";
        const showTrees = card.sceneKind === "pasture" || card.sceneKind === "orchard" || card.sceneKind === "garden";
        const showPath = card.sceneKind === "garden" || card.sceneKind === "orchard";

        return `
            <div class="asset-scenery" aria-hidden="true">
                ${showTrees ? "<div class=\"asset-tree-line\"></div>" : ""}
                ${showFence ? "<div class=\"asset-fence\"></div>" : ""}
                ${showPath ? "<div class=\"asset-path\"></div>" : ""}
            </div>
        `;
    }

    function renderFeature(feature, energy) {
        const minScale = feature.minScale == null ? 1 : feature.minScale;
        const maxScale = feature.maxScale == null ? minScale : feature.maxScale;
        const scale = round(lerp(minScale, maxScale, energy));
        const opacityFrom = feature.opacityFrom == null ? 1 : feature.opacityFrom;
        const opacityTo = feature.opacityTo == null ? opacityFrom : feature.opacityTo;
        const opacity = round(lerp(opacityFrom, opacityTo, energy));

        return `
            <div class="asset-feature" style="left:${feature.x}%;top:${feature.y}%;width:${feature.w}%;--feature-scale:${scale};opacity:${opacity};">
                <img src="${escapeAttr(feature.src)}" alt="" decoding="async" fetchpriority="auto" />
                ${feature.label ? `<span class="asset-feature-label" data-copy-layer="PRIMARY">${escapeHtml(feature.label)}</span>` : ""}
            </div>
        `;
    }

    function renderPatch(patchItem) {
        return `
            <div class="object-patch is-visible" style="left:${patchItem.x}%;top:${patchItem.y}%;width:${patchItem.w}%;--rotate:${patchItem.rotate}deg;--patch-scale:${patchItem.scale};">
                <img src="${escapeAttr(patchItem.src)}" alt="" decoding="async" fetchpriority="auto" />
            </div>
        `;
    }

    function renderClickWordEffect(card) {
        return `
            <div class="word-burst word-burst--${escapeAttr(card.direction)}" aria-hidden="true">
                <span>${escapeHtml(card.effectWord || card.word)}</span>
            </div>
        `;
    }

    function renderTrail(card, stage) {
        const maxStage = getMaxStage(card);
        const visibleDots = Math.min(stage, maxStage);

        return `
            <div class="meter meter--level" data-direction="${escapeAttr(card.direction)}" aria-hidden="true">
                ${Array.from({ length: maxStage }, (_, index) => `
                    <div class="meter-dot ${index < visibleDots ? "is-on" : ""}"><span></span></div>
                `).join("")}
            </div>
        `;
    }

    function buildPatchInstances(card, count) {
        if (!card.patches || card.patches.length === 0 || count <= 0) {
            return [];
        }

        return Array.from({ length: count }, (_, index) => {
            if (index < card.patches.length) {
                return card.patches[index];
            }
            return createGeneratedPatch(card, index);
        });
    }

    function createGeneratedPatch(card, index) {
        const pool = card.assetPool && card.assetPool.length > 0
            ? card.assetPool
            : card.patches.map((patchItem) => patchItem.src);
        const source = pool[index % pool.length];
        const spawn = card.spawn;
        const yBand = Math.floor((index - card.patches.length) / 6);
        const bandOffset = (yBand % 4) * 2.4;

        return {
            src: source,
            x: round(lerp(spawn.x[0], spawn.x[1], seeded(card.id, index, 1))),
            y: round(Math.min(spawn.y[1], lerp(spawn.y[0], spawn.y[1], seeded(card.id, index, 2)) + bandOffset)),
            w: round(lerp(spawn.w[0], spawn.w[1], seeded(card.id, index, 3))),
            rotate: round(lerp(spawn.rotate[0], spawn.rotate[1], seeded(card.id, index, 4))),
            scale: round(lerp(spawn.scale[0], spawn.scale[1], seeded(card.id, index, 5)))
        };
    }

    function getMaxStage(card) {
        return card.maxStage || 12;
    }

    function advanceCard(cardId, focusAction = null) {
        if (!(cardId in state.stages)) {
            return;
        }
        state.stages[cardId] = Math.min(state.stages[cardId] + 1, getMaxStageById(cardId));
        state.activeBursts = new Set([cardId]);
        saveStages();
        const nextAction = state.stages[cardId] >= getMaxStageById(cardId) ? "reset" : focusAction;
        render(nextAction ? { cardId, action: nextAction } : null);
    }

    function resetCard(cardId, focusAction = null) {
        if (!(cardId in state.stages)) {
            return;
        }
        state.stages[cardId] = 0;
        state.activeBursts.clear();
        saveStages();
        render(focusAction ? { cardId, action: "advance" } : null);
    }

    function advanceAllCards() {
        state.activeBursts = new Set(CARDS.map((card) => card.id));
        CARDS.forEach((card) => {
            state.stages[card.id] = Math.min(state.stages[card.id] + 1, getMaxStage(card));
        });
        saveStages();
        render();
    }

    function resetAllCards() {
        state.activeBursts.clear();
        CARDS.forEach((card) => {
            state.stages[card.id] = 0;
        });
        saveStages();
        render();
    }

    function getMaxStageById(cardId) {
        const card = CARDS.find((item) => item.id === cardId);
        return card ? getMaxStage(card) : 12;
    }

    function updateTopMetrics() {
        const totalCount = CARDS.reduce((sum, card) => sum + state.stages[card.id], 0);
        const activeCount = CARDS.filter((card) => state.stages[card.id] > 0).length;

        refs.totalProgress.textContent = `에셋 변화 ${totalCount}회`;
        refs.growCount.textContent = `진행 ${activeCount} / ${CARDS.length}`;
    }

    function getVisualState(stage, maxStage) {
        if (stage <= 0) {
            return "initial";
        }
        return stage >= maxStage ? "complete" : "changing";
    }

    function createEmptyStages() {
        return Object.fromEntries(CARDS.map((card) => [card.id, 0]));
    }

    function loadStages() {
        const empty = createEmptyStages();

        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return empty;
            }

            const parsed = JSON.parse(raw);
            if (!parsed || parsed.version !== STORAGE_VERSION || typeof parsed.stages !== "object") {
                return empty;
            }

            CARDS.forEach((card) => {
                const value = Number(parsed.stages[card.id]);
                empty[card.id] = Number.isFinite(value)
                    ? Math.min(Math.max(Math.trunc(value), 0), getMaxStage(card))
                    : 0;
            });
        } catch (error) {
            return empty;
        }

        return empty;
    }

    function saveStages() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
                version: STORAGE_VERSION,
                stages: state.stages
            }));
        } catch (error) {
            // 저장할 수 없어도 활동은 계속 진행한다.
        }
    }

    function restoreFocus(request, scrollLeft) {
        if (!request) {
            return;
        }

        window.requestAnimationFrame(() => {
            const selector = `[data-action="${request.action}"][data-card-id="${request.cardId}"]`;
            const target = refs.board.querySelector(selector);
            if (target && !target.disabled) {
                target.focus({ preventScroll: true });
            }
            refs.board.scrollLeft = scrollLeft;
        });
    }

    function handleAssetError(event) {
        const image = event.target;
        if (!(image instanceof HTMLImageElement)) {
            return;
        }

        image.hidden = true;
        const frame = image.closest(".media-frame");
        if (frame) {
            frame.classList.add("is-asset-error");
            frame.dataset.assetFallback = "true";
        }
    }

    window.__c14Grammar4Candidate = {
        storageKey: STORAGE_KEY,
        getStages: () => ({ ...state.stages }),
        reset: resetAllCards
    };

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
