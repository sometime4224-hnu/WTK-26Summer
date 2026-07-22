(function () {
    "use strict";

    const STORAGE_KEY = "korean3b:c15:passive-sentence-transform:v1";
    const SCHEMA_VERSION = 3;
    const TRANSITION_MS = 900;
    const PARTICLES = ["에 의해", "에게", "을", "를", "이", "가"];

    const scenarios = [
        {
            id: "catch",
            shortLabel: "잡히다",
            active: { agent: "경찰이", target: "도둑을", verb: "잡았어요." },
            passive: { agent: "경찰에게", target: "도둑이", verb: "잡혔어요." },
            sceneImage: "catch-pair.webp",
            form: "-히",
            agentNote: "사람인 행위자는 일상적인 피동문에서 ‘에게’를 쓸 수 있어요."
        },
        {
            id: "hug",
            shortLabel: "안기다",
            active: { agent: "형이", target: "동생을", verb: "안았어요." },
            passive: { agent: "형에게", target: "동생이", verb: "안겼어요." },
            sceneImage: "hug-pair.webp",
            form: "-기",
            agentNote: "사람인 행위자에게 행동을 당했음을 말할 때 ‘에게’를 쓸 수 있어요."
        },
        {
            id: "write",
            shortLabel: "쓰이다",
            active: { agent: "작가가", target: "책을", verb: "썼어요." },
            passive: { agent: "작가에 의해", target: "책이", verb: "쓰였어요." },
            sceneImage: "write-pair.webp",
            form: "-이",
            agentNote: "글이나 공식적인 설명에서는 행위자 뒤에 ‘에 의해’를 자주 써요."
        },
        {
            id: "open",
            shortLabel: "열리다",
            active: { agent: "바람이", target: "창문을", verb: "열었어요." },
            passive: { agent: "바람에 의해", target: "창문이", verb: "열렸어요." },
            sceneImage: "open-pair.webp",
            form: "-리",
            agentNote: "행위자가 사람이나 사물이 아니어도, 원인을 강조하면 ‘에 의해’를 쓸 수 있어요."
        },
        {
            id: "repair",
            shortLabel: "고쳐지다",
            active: { agent: "관리인이", target: "변기를", verb: "고쳤어요." },
            passive: { agent: "관리인에 의해", target: "변기가", verb: "고쳐졌어요." },
            sceneImage: "repair-pair.webp",
            form: "-아/어지다",
            agentNote: "수리 결과를 설명하는 문장에서는 ‘에 의해’로 행위자를 덧붙일 수 있어요."
        }
    ];

    const omissions = [
        {
            id: "unknown-door",
            group: "unknown",
            passive: "문이 열렸어요.",
            active: "누군가가 문을 열었어요.",
            reason: "누가 문을 열었는지 모르기 때문에 행위자를 말하지 않았어요."
        },
        {
            id: "unknown-contract",
            group: "unknown",
            passive: "계약서가 작성되었어요.",
            active: "누군가가 계약서를 작성했어요.",
            reason: "작성한 사람이 누구인지 알 수 없을 때는 계약서와 결과만 말할 수 있어요."
        },
        {
            id: "unknown-toilet",
            group: "unknown",
            passive: "변기가 고쳐졌어요.",
            active: "누군가가 변기를 고쳤어요.",
            reason: "고친 사람이 중요하지 않거나 알 수 없을 때 결과만 말해요."
        },
        {
            id: "unneeded-bill",
            group: "unneeded",
            passive: "방값에 전기 요금이 포함되어 있어요.",
            active: "회사가 전기 요금을 방값에 포함했어요.",
            reason: "방값 정보가 중요하므로 포함한 회사를 말하지 않아도 자연스러워요."
        },
        {
            id: "unneeded-subway",
            group: "unneeded",
            passive: "지하철 문이 열렸어요.",
            active: "직원이 지하철 문을 열었어요.",
            reason: "지금은 문이 열린 상태가 중요해서 행위자를 생략해도 돼요."
        },
        {
            id: "unneeded-trash",
            group: "unneeded",
            passive: "쓰레기가 이미 치워졌어요.",
            active: "누군가가 쓰레기를 치웠어요.",
            reason: "청소가 끝났다는 결과가 중요해서 행위자를 말할 필요가 없어요."
        }
    ];

    const refs = {
        page: document.getElementById("page"),
        transformPanel: document.getElementById("transformPanel"),
        omissionPanel: document.getElementById("omissionPanel"),
        scenarioCount: document.getElementById("scenarioCount"),
        scenarioTabs: document.getElementById("scenarioTabs"),
        stepLabel: document.getElementById("stepLabel"),
        stepDescription: document.getElementById("stepDescription"),
        sentenceBoard: document.getElementById("sentenceBoard"),
        activeSentence: document.getElementById("activeSentence"),
        passiveSentence: document.getElementById("passiveSentence"),
        activeSceneImage: document.getElementById("activeSceneImage"),
        passiveSceneImage: document.getElementById("passiveSceneImage"),
        activeSceneCaption: document.getElementById("activeSceneCaption"),
        passiveSceneCaption: document.getElementById("passiveSceneCaption"),
        animationLayer: document.getElementById("animationLayer"),
        stageNext: document.getElementById("stageNextBtn"),
        unknownOmissions: document.getElementById("unknownOmissionChoices"),
        unneededOmissions: document.getElementById("unneededOmissionChoices"),
        omissionExplanation: document.getElementById("omissionExplanation"),
        progressSummary: document.getElementById("progressSummary"),
        resetProgress: document.getElementById("resetProgressBtn"),
        copyRecovery: document.getElementById("copyRecoveryBtn"),
        restoreNotice: document.getElementById("restoreNotice"),
        saveStatus: document.getElementById("saveStatus")
    };

    let storageBlocked = false;
    let storageAvailable = true;
    let needsMigration = false;
    let isTransitioning = false;
    let transitionTimer = null;
    let state = loadState();

    function createDefaultState() {
        return {
            schemaVersion: SCHEMA_VERSION,
            activeId: scenarios[0].id,
            phase: 0,
            completed: {},
            activeOmissionId: null
        };
    }

    function normalizedFields(candidate) {
        const fallback = createDefaultState();
        const ids = new Set(scenarios.map((scenario) => scenario.id));
        fallback.activeId = ids.has(candidate.activeId) ? candidate.activeId : fallback.activeId;
        fallback.phase = Number.isInteger(candidate.phase) && candidate.phase >= 0 && candidate.phase <= 3 ? candidate.phase : 0;
        fallback.completed = candidate.completed && typeof candidate.completed === "object" ? candidate.completed : {};
        fallback.activeOmissionId = omissions.some((item) => item.id === candidate.activeOmissionId) ? candidate.activeOmissionId : null;
        return fallback;
    }

    function normalizeState(candidate) {
        if (!candidate || typeof candidate !== "object") return null;
        if (candidate.schemaVersion === SCHEMA_VERSION) return normalizedFields(candidate);
        if (candidate.schemaVersion === 1) {
            const migrated = normalizedFields(candidate);
            migrated.phase = 0;
            needsMigration = true;
            return migrated;
        }
        if (candidate.schemaVersion === 2) {
            const migrated = normalizedFields({ ...candidate, phase: Math.min(candidate.phase, 3) });
            if (candidate.phase >= 3 && scenarios.some((scenario) => scenario.id === migrated.activeId)) {
                migrated.completed[migrated.activeId] = true;
            }
            needsMigration = true;
            return migrated;
        }
        return null;
    }

    function showRestoreNotice(message) {
        refs.restoreNotice.textContent = message;
        refs.restoreNotice.hidden = false;
    }

    function loadState() {
        const fallback = createDefaultState();
        let raw;
        try {
            raw = window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            storageAvailable = false;
            showRestoreNotice("이 브라우저에서는 학습 기록을 저장할 수 없어요. 현재 화면의 학습은 계속할 수 있습니다.");
            return fallback;
        }

        if (!raw) return fallback;

        try {
            const restored = normalizeState(JSON.parse(raw));
            if (!restored) {
                storageBlocked = true;
                updateStorageStatus("이전 기록 보관 중", true);
                showRestoreNotice("이전 학습 기록의 형식을 확인할 수 없어 그대로 보관했습니다. 필요하면 이 페이지 기록만 초기화한 뒤 새로 저장할 수 있어요.");
                return fallback;
            }
            return restored;
        } catch (error) {
            storageBlocked = true;
            updateStorageStatus("이전 기록 보관 중", true);
            showRestoreNotice("이전 학습 기록을 읽을 수 없어 그대로 보관했습니다. 필요하면 이 페이지 기록만 초기화한 뒤 새로 저장할 수 있어요.");
            return fallback;
        }
    }

    function saveState() {
        if (storageBlocked) return;
        if (!storageAvailable) {
            updateStorageStatus("저장할 수 없음 · 현재 화면에는 유지됨", true);
            return;
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            updateStorageStatus("저장됨", false);
        } catch (error) {
            storageAvailable = false;
            updateStorageStatus("저장하지 못했어요 · 현재 화면에는 유지됨", true);
            showRestoreNotice("학습 기록을 저장하지 못했어요. 아래 ‘현재 학습 기록 복사’로 내용을 보관할 수 있습니다.");
        }
    }

    function updateStorageStatus(text, hasError) {
        refs.saveStatus.textContent = text;
        refs.saveStatus.classList.toggle("has-error", Boolean(hasError));
    }

    function activeScenario() {
        return scenarios.find((scenario) => scenario.id === state.activeId) || scenarios[0];
    }

    function isComplete(scenarioId) {
        return state.completed[scenarioId] === true;
    }

    function completedCount() {
        return scenarios.filter((scenario) => isComplete(scenario.id)).length;
    }

    function allComplete() {
        return completedCount() === scenarios.length;
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        }[character]));
    }

    function splitNounParticle(text) {
        const particle = PARTICLES.find((item) => text.endsWith(item));
        return particle
            ? { noun: text.slice(0, -particle.length), particle }
            : { noun: text, particle: "" };
    }

    function tokenInnerMarkup(kind, text) {
        if (kind === "verb") return escapeHtml(text);
        const parts = splitNounParticle(text);
        return '<span class="term-noun">' + escapeHtml(parts.noun) + '</span>' + (parts.particle ? '<span class="term-particle">' + escapeHtml(parts.particle) + "</span>" : "");
    }

    function tokenMarkup(kind, text, sourcePart) {
        const sourceAttribute = sourcePart ? ' data-source-part="' + sourcePart + '"' : "";
        const sourceClass = sourcePart ? " source-token" : "";
        return '<span class="role-token role-token--' + kind + sourceClass + '"' + sourceAttribute + ">" + tokenInnerMarkup(kind, text) + "</span>";
    }

    function passiveSlotMarkup(kind, text) {
        return '<span class="passive-slot passive-slot--' + kind + '" data-passive-slot="' + kind + '">' + (text ? tokenMarkup(kind, text) : "") + "</span>";
    }

    function phaseContent(scenario) {
        const content = [
            {
                label: "동사를 먼저 옮겨 볼까요?",
                description: "능동문의 동사를 복사해 아래 피동문 끝자리로 내려보내세요.",
                next: "동사 바꾸기",
                nextPart: "verb"
            },
            {
                label: "1. 동사가 피동형으로 바뀌었어요.",
                description: "동사가 아래 피동문 끝자리로 내려오며 ‘" + scenario.active.verb + "’ → ‘" + scenario.passive.verb + "’로 바뀝니다.",
                next: "주어 옮기기",
                nextPart: "agent"
            },
            {
                label: "2. 능동문 주어가 행위자 자리로 가요.",
                description: "능동문의 주어 ‘" + scenario.active.agent + "’는 아래 가운데로 내려와 ‘" + scenario.passive.agent + "’가 됩니다. " + scenario.agentNote,
                next: "목적어 옮기기",
                nextPart: "target"
            },
            {
                label: "피동문이 완성되었어요.",
                description: "‘" + scenario.active.target + "’이 새 주어가 되어 대상 + 행위자 + 피동 동사의 순서가 완성됐어요.",
                next: allComplete() ? "행위자 생략 보기" : "다음 예문 보기",
                nextPart: ""
            }
        ];
        return content[state.phase];
    }

    function focusScenarioTab(id) {
        const button = refs.scenarioTabs.querySelector('[data-scenario-id="' + id + '"]');
        if (button) button.focus();
    }

    function handleScenarioTabKeydown(event) {
        const currentIndex = scenarios.findIndex((scenario) => scenario.id === event.currentTarget.dataset.scenarioId);
        if (currentIndex < 0) return;

        let targetIndex;
        if (event.key === "ArrowRight") targetIndex = (currentIndex + 1) % scenarios.length;
        else if (event.key === "ArrowLeft") targetIndex = (currentIndex - 1 + scenarios.length) % scenarios.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = scenarios.length - 1;
        else return;

        event.preventDefault();
        const targetId = scenarios[targetIndex].id;
        if (targetId === state.activeId) {
            focusScenarioTab(targetId);
            return;
        }
        selectScenario(targetId, true);
    }

    function renderTabs() {
        const current = activeScenario();
        refs.scenarioTabs.innerHTML = scenarios.map((scenario, index) => (
            '<button class="scenario-tab' + (isComplete(scenario.id) ? " is-complete" : "") + '" type="button" role="tab" id="scenario-' + scenario.id + '" aria-controls="sentenceBoard" aria-selected="' + (scenario.id === current.id ? "true" : "false") + '" tabindex="' + (scenario.id === current.id ? "0" : "-1") + '" data-scenario-id="' + scenario.id + '">' + (index + 1) + ". " + scenario.shortLabel + "</button>"
        )).join("");
        refs.scenarioTabs.querySelectorAll("[data-scenario-id]").forEach((button) => {
            button.addEventListener("click", () => selectScenario(button.dataset.scenarioId, true));
            button.addEventListener("keydown", handleScenarioTabKeydown);
        });
    }

    function renderActiveSentence(scenario) {
        refs.activeSentence.innerHTML = [
            tokenMarkup("agent", scenario.active.agent, "agent"),
            tokenMarkup("target", scenario.active.target, "target"),
            tokenMarkup("verb", scenario.active.verb, "verb")
        ].join("");
    }

    function renderPassiveSentence(scenario) {
        const parts = {
            target: state.phase >= 3 ? scenario.passive.target : "",
            agent: state.phase >= 2 ? scenario.passive.agent : "",
            verb: state.phase >= 1 ? scenario.passive.verb : ""
        };
        refs.passiveSentence.innerHTML = [
            passiveSlotMarkup("target", parts.target),
            passiveSlotMarkup("agent", parts.agent),
            passiveSlotMarkup("verb", parts.verb)
        ].join("");
        refs.passiveSentence.setAttribute(
            "aria-label",
            state.phase === 0
                ? "아직 비어 있는 피동문"
                : [parts.target, parts.agent, parts.verb].filter(Boolean).join(" ")
        );
    }

    function sentenceText(sentence, isPassive) {
        return isPassive
            ? sentence.target + " " + sentence.agent + " " + sentence.verb
            : sentence.agent + " " + sentence.target + " " + sentence.verb;
    }

    function renderSceneViewer(scenario) {
        const imagePath = "assets/passive-sentence-transform/" + scenario.sceneImage;
        const activeText = sentenceText(scenario.active, false);
        const passiveText = sentenceText(scenario.passive, true);
        refs.activeSceneImage.src = imagePath;
        refs.passiveSceneImage.src = imagePath;
        refs.activeSceneImage.alt = activeText + " 장면";
        refs.passiveSceneImage.alt = passiveText + " 장면";
        refs.activeSceneCaption.textContent = activeText;
        refs.passiveSceneCaption.textContent = passiveText;
    }

    function renderStage() {
        const scenario = activeScenario();
        const content = phaseContent(scenario);
        refs.scenarioCount.textContent = "행위자 명시형 " + (scenarios.indexOf(scenario) + 1) + " / " + scenarios.length;
        refs.stepLabel.textContent = content.label;
        refs.stepDescription.textContent = content.description;
        refs.sentenceBoard.dataset.phase = String(state.phase);
        refs.sentenceBoard.dataset.nextPart = content.nextPart;
        refs.sentenceBoard.setAttribute("aria-labelledby", "scenario-" + scenario.id);
        renderActiveSentence(scenario);
        renderPassiveSentence(scenario);
        renderSceneViewer(scenario);
        refs.stageNext.textContent = content.next;
        refs.stageNext.disabled = isTransitioning;
    }

    function renderOmissions() {
        const renderGroup = (group) => omissions.filter((item) => item.group === group).map((item) => (
            '<button class="omission-button" type="button" data-omission-id="' + item.id + '" aria-pressed="' + (item.id === state.activeOmissionId ? "true" : "false") + '">' + item.passive + "</button>"
        )).join("");
        refs.unknownOmissions.innerHTML = renderGroup("unknown");
        refs.unneededOmissions.innerHTML = renderGroup("unneeded");
        [refs.unknownOmissions, refs.unneededOmissions].forEach((container) => {
            container.querySelectorAll("[data-omission-id]").forEach((button) => {
                button.addEventListener("click", () => showOmission(button.dataset.omissionId, true));
            });
        });
        const item = omissions.find((omission) => omission.id === state.activeOmissionId);
        refs.omissionExplanation.textContent = item
            ? "능동문: " + item.active + " " + item.reason
            : "예문을 누르면 능동문과 생략 이유를 확인할 수 있어요.";
    }

    function renderProgress() {
        const count = completedCount();
        refs.progressSummary.textContent = count
            ? "행위자 명시형 " + count + " / " + scenarios.length + " 완료"
            : "아직 완료한 예문이 없어요.";
        refs.omissionPanel.hidden = !allComplete();
        refs.copyRecovery.hidden = storageAvailable && !storageBlocked;
    }

    function render(focusTarget) {
        const requestedFocus = focusTarget || {};
        renderTabs();
        renderStage();
        renderOmissions();
        renderProgress();
        if (requestedFocus.scenarioId) focusScenarioTab(requestedFocus.scenarioId);
        if (requestedFocus.omissionId) {
            const button = refs.omissionPanel.querySelector('[data-omission-id="' + requestedFocus.omissionId + '"]');
            if (button) button.focus();
        }
    }

    function useReducedMotion() {
        return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function clearMovingCopies() {
        if (transitionTimer) window.clearTimeout(transitionTimer);
        transitionTimer = null;
        refs.animationLayer.replaceChildren();
        isTransitioning = false;
    }

    function animateTransfer(part, scenario, finish) {
        const source = refs.activeSentence.querySelector('[data-source-part="' + part + '"]');
        const destination = refs.passiveSentence.querySelector('[data-passive-slot="' + part + '"]');
        if (!source || !destination || useReducedMotion()) {
            finish();
            return;
        }

        isTransitioning = true;
        refs.stageNext.disabled = true;
        source.classList.add("is-copying");
        destination.classList.add("is-receiving");

        const sourceRect = source.getBoundingClientRect();
        const destinationRect = destination.getBoundingClientRect();
        const copy = source.cloneNode(true);
        copy.classList.add("moving-copy");
        copy.removeAttribute("data-source-part");
        copy.setAttribute("aria-hidden", "true");
        copy.style.left = sourceRect.left + "px";
        copy.style.top = sourceRect.top + "px";
        copy.style.width = sourceRect.width + "px";
        refs.animationLayer.appendChild(copy);

        requestAnimationFrame(() => {
            const destinationX = destinationRect.left + (destinationRect.width - sourceRect.width) / 2;
            const destinationY = destinationRect.top + (destinationRect.height - sourceRect.height) / 2;
            copy.style.transform = "translate(" + (destinationX - sourceRect.left) + "px, " + (destinationY - sourceRect.top) + "px)";
        });

        window.setTimeout(() => {
            copy.innerHTML = tokenInnerMarkup(part, scenario.passive[part]);
            copy.classList.add("is-form-changed");
        }, Math.round(TRANSITION_MS * 0.48));

        transitionTimer = window.setTimeout(() => {
            copy.remove();
            isTransitioning = false;
            transitionTimer = null;
            finish();
        }, TRANSITION_MS);
    }

    function advanceStage() {
        if (isTransitioning) return;
        if (state.phase === 3) {
            nextScenario();
            return;
        }

        const part = ["verb", "agent", "target"][state.phase];
        animateTransfer(part, activeScenario(), () => {
            state.phase += 1;
            if (state.phase === 3) state.completed[activeScenario().id] = true;
            saveState();
            render();
        });
    }

    function selectScenario(id, restoreFocus) {
        if (isTransitioning || !scenarios.some((scenario) => scenario.id === id)) return;
        state.activeId = id;
        state.phase = 0;
        saveState();
        render(restoreFocus ? { scenarioId: id } : null);
    }

    function nextScenario() {
        if (allComplete()) {
            refs.omissionPanel.hidden = false;
            refs.omissionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        const index = scenarios.findIndex((scenario) => scenario.id === state.activeId);
        const orderedCandidates = scenarios.slice(index + 1).concat(scenarios.slice(0, index + 1));
        const nextIncomplete = orderedCandidates.find((scenario) => !isComplete(scenario.id));
        if (!nextIncomplete) return;
        state.activeId = nextIncomplete.id;
        state.phase = 0;
        saveState();
        render();
        refs.transformPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showOmission(id, restoreFocus) {
        if (!omissions.some((item) => item.id === id)) return;
        state.activeOmissionId = id;
        saveState();
        render(restoreFocus ? { omissionId: id } : null);
    }

    function resetProgress() {
        if (!window.confirm("이 페이지의 피동 문장 학습 기록만 초기화할까요?")) return;
        clearMovingCopies();
        try {
            window.localStorage.removeItem(STORAGE_KEY);
            storageBlocked = false;
            storageAvailable = true;
            needsMigration = false;
            refs.restoreNotice.hidden = true;
        } catch (error) {
            storageAvailable = false;
        }
        state = createDefaultState();
        render();
        updateStorageStatus(storageAvailable ? "초기화됨" : "저장할 수 없음", !storageAvailable);
        refs.stageNext.focus();
    }

    function copyRecovery() {
        const content = JSON.stringify(state, null, 2);
        const finish = (message) => {
            showRestoreNotice(message);
            refs.copyRecovery.focus();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(content).then(
                () => finish("현재 학습 기록을 클립보드에 복사했어요."),
                () => downloadRecovery(content, finish)
            );
        } else {
            downloadRecovery(content, finish);
        }
    }

    function downloadRecovery(content, finish) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([content], { type: "application/json" }));
        link.download = "c15-passive-sentence-transform-progress.json";
        link.click();
        URL.revokeObjectURL(link.href);
        finish("현재 학습 기록 파일을 내려받기 시작했어요.");
    }

    refs.stageNext.addEventListener("click", advanceStage);
    refs.resetProgress.addEventListener("click", resetProgress);
    refs.copyRecovery.addEventListener("click", copyRecovery);
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") saveState();
    });
    window.addEventListener("pagehide", saveState);

    if (needsMigration) {
        showRestoreNotice("피동문 변환 흐름을 간결하게 바꾸어 저장한 예문을 새 순서에 맞춰 불러왔어요.");
        saveState();
    }
    render();
})();
