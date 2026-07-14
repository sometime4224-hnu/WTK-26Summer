(function () {
    "use strict";

    var forms = {
        hot: { base: "덥다", direct: "더워요", stem: "더워", other: "더워해요" },
        cold: { base: "춥다", direct: "추워요", stem: "추워", other: "추워해요" },
        tasty: { base: "맛있다", direct: "맛있어요", stem: "맛있어", other: "맛있어해요" },
        "not-tasty": { base: "맛없다", direct: "맛없어요", stem: "맛없어", other: "맛없어해요" },
        glad: { base: "기쁘다", direct: "기뻐요", stem: "기뻐", other: "기뻐해요" },
        sad: { base: "슬프다", direct: "슬퍼요", stem: "슬퍼", other: "슬퍼해요" },
        miss: { base: "그립다", direct: "그리워요", stem: "그리워", other: "그리워해요" },
        bored: { base: "심심하다", direct: "심심해요", stem: "심심해", other: "심심해해요" },
        dull: { base: "따분하다", direct: "따분해요", stem: "따분해", other: "따분해해요" },
        uncomfortable: { base: "불편하다", direct: "불편해요", stem: "불편해", other: "불편해해요" },
        "tired-hard": { base: "힘들다", direct: "힘들어요", stem: "힘들어", other: "힘들어해요" },
        difficult: { base: "어렵다", direct: "어려워요", stem: "어려워", other: "어려워해요" },
        pleasant: { base: "즐겁다", direct: "즐거워요", stem: "즐거워", other: "즐거워해요" },
        happy: { base: "행복하다", direct: "행복해요", stem: "행복해", other: "행복해해요" },
        fatigued: { base: "피곤하다", direct: "피곤해요", stem: "피곤해", other: "피곤해해요" },
        interesting: { base: "재미있다", direct: "재미있어요", stem: "재미있어", other: "재미있어해요" }
    };

    var sceneAssets = {
        minsu: {
            src: "../assets/c14/grammar/images/grammar3-other-feelings/minsu-self-base.webp",
            alt: "빈 말풍선이 있는 여자와 민수",
            id: "asset.minsu-self-base"
        },
        cheolsu: {
            src: "../assets/c14/grammar/images/grammar3-other-feelings/minsu-cheolsu-neutral-base.webp",
            alt: "빈 말풍선이 있는 여자와 민수, 민수의 생각풍선 속 철수",
            id: "asset.minsu-cheolsu-neutral-base"
        }
    };

    var storageKey = document.body.dataset.storageKey;
    var defaultState = { person: "minsu", adjective: "hot" };
    var state = readState();

    var workspace = document.querySelector("[data-semantic-visual]");
    var focusMap = document.querySelector("[data-sv-graphic]");
    var personChoices = Array.prototype.slice.call(document.querySelectorAll("[data-person]"));
    var feelingChoices = Array.prototype.slice.call(document.querySelectorAll("[data-adjective]"));
    var sceneArt = document.getElementById("sceneArt");
    var sceneImage = document.getElementById("sceneImage");
    var sceneQuestion = document.getElementById("sceneQuestion");
    var sceneReply = document.getElementById("sceneReply");
    var sceneThought = document.getElementById("sceneThought");
    var sceneEnding = document.getElementById("sceneEnding");
    var sceneFallback = document.getElementById("scene-code-fallback");
    var fallbackQuestion = document.getElementById("fallbackQuestion");
    var fallbackAnswer = document.getElementById("fallbackAnswer");
    var fallbackThought = document.getElementById("fallbackThought");
    var fallbackStem = document.getElementById("fallbackStem");
    var sceneCaption = document.getElementById("sceneCaption");
    var directStem = document.getElementById("directStem");
    var reportedStem = document.getElementById("reportedStem");
    var selfContrast = document.getElementById("selfContrast");
    var otherContrast = document.getElementById("otherContrast");
    var sentenceOutput = document.getElementById("sentenceOutput");
    var liveAnnouncement = document.getElementById("liveAnnouncement");
    var helpCopy = document.getElementById("helpCopy");
    var saveStatus = document.getElementById("saveStatus");

    function readState() {
        try {
            var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (!saved || !forms[saved.adjective] || (saved.person !== "minsu" && saved.person !== "cheolsu")) {
                return Object.assign({}, defaultState);
            }
            return { person: saved.person, adjective: saved.adjective };
        } catch (error) {
            return Object.assign({}, defaultState);
        }
    }

    function persist() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
            saveStatus.textContent = "이 기기에 저장됨";
        } catch (error) {
            saveStatus.textContent = "저장할 수 없음";
        }
    }

    function setCurrentCard(card, current) {
        card.classList.toggle("is-current", current);
        if (current) {
            card.setAttribute("aria-current", "true");
        } else {
            card.removeAttribute("aria-current");
        }
    }

    function prepareSceneAsset(scene) {
        if (sceneImage.getAttribute("src") === scene.src) return;

        sceneImage.hidden = false;
        sceneImage.removeAttribute("data-asset-failed");
        sceneArt.classList.remove("is-image-missing");
        sceneFallback.hidden = true;
        sceneFallback.removeAttribute("data-image-fallback-active");
        sceneImage.src = scene.src;
    }

    function render() {
        var form = forms[state.adjective];
        var isOther = state.person === "cheolsu";
        var visualState = isOther ? "observed" : "self";
        var question = isOther ? "철수 씨는 어때요?" : "민수 씨는 어때요?";
        var spokenAnswer = isOther ? "철수는 " + form.other : form.direct;
        var scene = sceneAssets[state.person];

        personChoices.forEach(function (button) {
            var selected = button.dataset.person === state.person;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", selected ? "true" : "false");
        });
        feelingChoices.forEach(function (button) {
            var selected = button.dataset.adjective === state.adjective;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", selected ? "true" : "false");
        });

        workspace.dataset.visualState = visualState;
        focusMap.dataset.visualState = visualState;
        sceneArt.dataset.personState = state.person;

        sceneQuestion.textContent = question;
        sceneReply.textContent = isOther ? "철수는" : form.direct;
        sceneThought.textContent = form.stem;
        sceneThought.hidden = !isOther;
        sceneEnding.hidden = !isOther;

        fallbackQuestion.textContent = question;
        fallbackAnswer.textContent = spokenAnswer;
        fallbackStem.textContent = form.stem;
        fallbackThought.hidden = !isOther;

        directStem.textContent = form.stem;
        reportedStem.textContent = form.stem;
        setCurrentCard(selfContrast, !isOther);
        setCurrentCard(otherContrast, isOther);
        sentenceOutput.setAttribute("aria-label", "저는 " + form.direct + ". 철수는 " + form.other + ".");
        if (liveAnnouncement) liveAnnouncement.textContent = question + " " + spokenAnswer;

        helpCopy.textContent = "민수 자신의 느낌은 “" + form.direct + "”처럼 말해요. 민수가 본 철수의 느낌은 생각풍선 속 말에 “해요”를 붙여 “" + form.other + "”라고 말해요.";
        sceneCaption.textContent = isOther
            ? "여자가 철수의 느낌을 묻고 민수가 생각풍선 속 철수를 떠올리며 " + form.other + "라고 말합니다."
            : "여자가 민수의 느낌을 묻고 민수가 " + form.direct + "라고 말합니다.";

        prepareSceneAsset(scene);
        sceneImage.alt = scene.alt;
        sceneImage.dataset.assetRef = scene.id;
    }

    function selectPerson(person) {
        if (person !== "minsu" && person !== "cheolsu") return;
        state.person = person;
        render();
        persist();
    }

    function selectAdjective(adjective) {
        if (!forms[adjective]) return;
        state.adjective = adjective;
        render();
        persist();
    }

    function wireLinearKeys(buttons, onSelect) {
        buttons.forEach(function (button, index) {
            button.addEventListener("keydown", function (event) {
                var nextIndex = null;
                if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
                if (event.key === "Home") nextIndex = 0;
                if (event.key === "End") nextIndex = buttons.length - 1;
                if (nextIndex === null) return;
                event.preventDefault();
                buttons[nextIndex].focus();
                onSelect(buttons[nextIndex]);
            });
        });
    }

    function feelingColumnCount() {
        var grid = document.querySelector(".feeling-grid");
        if (!grid) return 4;
        var columns = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
        return columns || 4;
    }

    function wireFeelingKeys() {
        feelingChoices.forEach(function (button, index) {
            button.addEventListener("keydown", function (event) {
                var columns = feelingColumnCount();
                var nextIndex = null;
                if (event.key === "ArrowRight") nextIndex = (index + 1) % feelingChoices.length;
                if (event.key === "ArrowLeft") nextIndex = (index - 1 + feelingChoices.length) % feelingChoices.length;
                if (event.key === "ArrowDown") nextIndex = Math.min(index + columns, feelingChoices.length - 1);
                if (event.key === "ArrowUp") nextIndex = Math.max(index - columns, 0);
                if (event.key === "Home") nextIndex = 0;
                if (event.key === "End") nextIndex = feelingChoices.length - 1;
                if (nextIndex === null || nextIndex === index) return;
                event.preventDefault();
                feelingChoices[nextIndex].focus();
                selectAdjective(feelingChoices[nextIndex].dataset.adjective);
            });
        });
    }

    personChoices.forEach(function (button) {
        button.addEventListener("click", function () {
            selectPerson(button.dataset.person);
        });
    });
    feelingChoices.forEach(function (button) {
        button.addEventListener("click", function () {
            selectAdjective(button.dataset.adjective);
        });
    });

    wireLinearKeys(personChoices, function (button) { selectPerson(button.dataset.person); });
    wireFeelingKeys();

    document.getElementById("resetActivity").addEventListener("click", function () {
        state = Object.assign({}, defaultState);
        render();
        persist();
    });

    sceneImage.addEventListener("error", function () {
        sceneArt.classList.add("is-image-missing");
        sceneImage.hidden = true;
        sceneFallback.hidden = false;
        sceneFallback.setAttribute("data-image-fallback-active", "true");
    });
    sceneImage.addEventListener("load", function () {
        sceneImage.hidden = false;
        sceneImage.removeAttribute("data-asset-failed");
        sceneArt.classList.remove("is-image-missing");
        sceneFallback.hidden = true;
        sceneFallback.removeAttribute("data-image-fallback-active");
    });

    if (window.SemanticVisualSystem && typeof window.SemanticVisualSystem.init === "function") {
        window.SemanticVisualSystem.init(document);
    }

    render();

    window.C14Grammar3OtherFeelings = {
        forms: forms,
        getState: function () { return Object.assign({}, state); },
        setState: function (next) {
            if (next && forms[next.adjective] && (next.person === "minsu" || next.person === "cheolsu")) {
                state = { person: next.person, adjective: next.adjective };
                render();
                persist();
            }
        },
        assetManifest: {
            assets: [{
                id: "asset.minsu-self-base",
                origin: "AI_GENERATED",
                path: "../assets/c14/grammar/images/grammar3-other-feelings/minsu-self-base.webp",
                format: "WEBP",
                mime: "image/webp",
                bytes: 41514,
                width: 960,
                height: 640,
                sha256: "ddd589ddf2e4aaa7f8bb3415a5386f02761e5e5c3959d81c7c7e63b1e364f683",
                prompt: "Flat Korean textbook illustration: woman and Minsu in a cafe/classroom lounge; blank white dialogue bubbles; only the shirt name 민수 appears; no thought cloud or Cheolsu.",
                tool: "OpenAI built-in image generation",
                generation_date: "2026-07-14",
                meaning_refs: ["meaning.participant-focus"],
                alt_ref: "copy.alt.minsu-self-base",
                fallback_ref: "scene-code-fallback"
            }, {
                id: "asset.minsu-cheolsu-neutral-base",
                origin: "AI_GENERATED",
                path: "../assets/c14/grammar/images/grammar3-other-feelings/minsu-cheolsu-neutral-base.webp",
                format: "WEBP",
                mime: "image/webp",
                bytes: 47814,
                width: 960,
                height: 640,
                sha256: "083fb7e79d2a7df269bb5c0b30c477ce7343947f0b4bd54c657d354293f1d9ea",
                prompt: "Flat Korean textbook illustration: woman and Minsu in a cafe/classroom lounge; blank white dialogue bubbles; neutral Cheolsu inside a separate Minsu thought cloud; only the shirt names 민수 and 철수 appear.",
                tool: "OpenAI built-in image generation",
                generation_date: "2026-07-14",
                meaning_refs: ["meaning.participant-focus"],
                alt_ref: "copy.alt.minsu-cheolsu-neutral-base",
                fallback_ref: "scene-code-fallback"
            }]
        }
    };
})();
