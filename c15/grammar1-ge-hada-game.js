(function () {
    "use strict";

    const NO_OBJECT_VERBS = new Set(["웃다", "울다"]);
    const VALID_ROUTES = new Set(["direct-self", "direct-other", "self-to-other", "other-to-self"]);
    const VALID_OTHERS = new Set(["friend", "sibling", "staff"]);
    const FLIGHT_DURATION = 520;

    const castAssets = {
        self: {
            label: "나",
            normal: "../assets/c15/grammar/images/ge-hada-cast/self_main_01.webp",
            bad: "../assets/c15/grammar/images/ge-hada-cast-bad/self_main_01_bad.webp",
            laugh: "../assets/c15/grammar/images/ge-hada-cast-laugh/self_main_01_laugh.webp",
            sad: "../assets/c15/grammar/images/ge-hada-cast-sad/self_main_01_sad.webp",
            alt: "나 캐릭터"
        },
        friend: {
            label: "친구",
            normal: "../assets/c15/grammar/images/ge-hada-cast/friend_female_01.webp",
            bad: "../assets/c15/grammar/images/ge-hada-cast-bad/friend_female_01_bad.webp",
            laugh: "../assets/c15/grammar/images/ge-hada-cast-laugh/friend_female_01_laugh.webp",
            sad: "../assets/c15/grammar/images/ge-hada-cast-sad/friend_female_01_sad.webp",
            alt: "친구 캐릭터"
        },
        sibling: {
            label: "동생",
            normal: "../assets/c15/grammar/images/ge-hada-cast/boy_02.webp",
            bad: "../assets/c15/grammar/images/ge-hada-cast-bad/boy_02_bad.webp",
            laugh: "../assets/c15/grammar/images/ge-hada-cast-laugh/boy_02_laugh.webp",
            sad: "../assets/c15/grammar/images/ge-hada-cast-sad/boy_02_sad.webp",
            alt: "동생 캐릭터"
        },
        staff: {
            label: "부하직원",
            normal: "../assets/c15/grammar/images/ge-hada-cast/office_man_glasses_01.webp",
            bad: "../assets/c15/grammar/images/ge-hada-cast-bad/office_man_glasses_01_bad.webp",
            laugh: "../assets/c15/grammar/images/ge-hada-cast-laugh/office_man_glasses_01_laugh.webp",
            sad: "../assets/c15/grammar/images/ge-hada-cast-sad/office_man_glasses_01_sad.webp",
            alt: "부하직원 캐릭터"
        }
    };

    const phases = [
        {
            id: 1,
            missions: [
                { id: "p1-01", phase: 1, prompt: "친구가 케이크를 먹게 하세요.", other: "friend", route: "self-to-other", noun: "케이크", verb: "먹다" },
                { id: "p1-02", phase: 1, prompt: "물을 마시세요.", other: "friend", route: "direct-self", noun: "물", verb: "마시다" },
                { id: "p1-03", phase: 1, prompt: "동생이 책을 읽게 하세요.", other: "sibling", route: "self-to-other", noun: "책", verb: "읽다" },
                { id: "p1-04", phase: 1, prompt: "동생을 울게 하세요.", other: "sibling", route: "self-to-other", noun: null, verb: "울다" },
                { id: "p1-05", phase: 1, prompt: "영화를 보세요.", other: "friend", route: "direct-self", noun: "영화", verb: "보다" },
                { id: "p1-06", phase: 1, prompt: "책을 고르세요.", other: "friend", route: "direct-self", noun: "책", verb: "고르다" },
                { id: "p1-07", phase: 1, prompt: "친구가 케이크를 사게 하세요.", other: "friend", route: "self-to-other", noun: "케이크", verb: "사다" },
                { id: "p1-08", phase: 1, prompt: "부하직원이 신문을 읽게 하세요.", other: "staff", route: "self-to-other", noun: "신문", verb: "읽다" },
                { id: "p1-09", phase: 1, prompt: "친구가 드라마를 보게 하세요.", other: "friend", route: "self-to-other", noun: "드라마", verb: "보다" }
            ]
        },
        {
            id: 2,
            missions: [
                { id: "p2-01", phase: 2, prompt: "친구가 빵을 직접 먹도록 놓으세요.", other: "friend", route: "direct-other", noun: "빵", verb: "먹다" },
                { id: "p2-02", phase: 2, prompt: "동생 → 나: 제가 드라마를 보게 하세요.", other: "sibling", route: "other-to-self", noun: "드라마", verb: "보다" },
                { id: "p2-03", phase: 2, prompt: "부하직원이 물을 직접 마시도록 놓으세요.", other: "staff", route: "direct-other", noun: "물", verb: "마시다" },
                { id: "p2-04", phase: 2, prompt: "제가 밥을 직접 먹도록 놓으세요.", other: "staff", route: "direct-self", noun: "밥", verb: "먹다" },
                { id: "p2-05", phase: 2, prompt: "나 → 친구: 친구를 웃게 하세요.", other: "friend", route: "self-to-other", noun: null, verb: "웃다" },
                { id: "p2-06", phase: 2, prompt: "부하직원 → 나: 저를 울게 하세요.", other: "staff", route: "other-to-self", noun: null, verb: "울다" },
                { id: "p2-07", phase: 2, prompt: "동생이 케이크를 직접 사도록 놓으세요.", other: "sibling", route: "direct-other", noun: "케이크", verb: "사다" },
                { id: "p2-08", phase: 2, prompt: "친구 → 나: 제가 신문을 읽게 하세요.", other: "friend", route: "other-to-self", noun: "신문", verb: "읽다" },
                { id: "p2-09", phase: 2, prompt: "나 → 부하직원: 부하직원이 책을 고르게 하세요.", other: "staff", route: "self-to-other", noun: "책", verb: "고르다" }
            ]
        }
    ];

    const refs = {
        progressText: document.getElementById("progressText"),
        scoreText: document.getElementById("scoreText"),
        missionText: document.getElementById("missionText"),
        statusText: document.getElementById("statusText"),
        otherTabs: document.getElementById("otherTabs"),
        selfZone: document.getElementById("selfZone"),
        otherZone: document.getElementById("otherZone"),
        selfRole: document.getElementById("selfRole"),
        otherRole: document.getElementById("otherRole"),
        selfImage: document.getElementById("selfImage"),
        otherImage: document.getElementById("otherImage"),
        selfName: document.getElementById("selfName"),
        otherName: document.getElementById("otherName"),
        selfLine: document.getElementById("selfLine"),
        otherLine: document.getElementById("otherLine"),
        routeRail: document.getElementById("routeRail"),
        routeArrow: document.getElementById("routeArrow"),
        resultPopup: document.getElementById("resultPopup"),
        resultLabel: document.getElementById("resultLabel"),
        resultSentence: document.getElementById("resultSentence"),
        feedbackBox: document.getElementById("feedbackBox"),
        nextBtn: document.getElementById("nextBtn"),
        restartBtn: document.getElementById("restartBtn"),
        composer: document.getElementById("composer"),
        sentenceCard: document.getElementById("sentenceCard"),
        previewNounIcon: document.getElementById("previewNounIcon"),
        actionPreviewText: document.getElementById("actionPreviewText"),
        previewVerbIcon: document.getElementById("previewVerbIcon"),
        nounRow: document.getElementById("nounRow"),
        resetBtn: document.getElementById("resetBtn"),
        commandBeam: document.getElementById("commandBeam")
    };

    const nounButtons = Array.from(document.querySelectorAll('[data-kind="noun"]'));
    const verbButtons = Array.from(document.querySelectorAll('[data-kind="verb"]'));
    const otherButtons = Array.from(document.querySelectorAll(".other-tab[data-other]"));
    const routeButtons = Array.from(document.querySelectorAll("[data-route]"));
    const totalMissionCount = phases.reduce((sum, phase) => sum + phase.missions.length, 0);

    let currentPhaseIndex = 0;
    let missionIndex = 0;
    let selectedNoun = nounButtons[0];
    let selectedVerb = verbButtons[0];
    let selectedOther = "friend";
    let firstTryEligible = true;
    let firstTryScore = 0;
    let isLocked = false;
    let dragState = null;
    let beamTimer = null;
    let wrongTimer = null;

    function hasFinalConsonant(word) {
        const text = String(word || "").trim();
        if (!text) return false;
        const code = text.charCodeAt(text.length - 1);
        return code >= 0xac00 && code <= 0xd7a3 && ((code - 0xac00) % 28) !== 0;
    }

    function subjectParticle(word) {
        return hasFinalConsonant(word) ? "이" : "가";
    }

    function objectParticle(word) {
        return hasFinalConsonant(word) ? "을" : "를";
    }

    function currentPhase() {
        return phases[currentPhaseIndex];
    }

    function currentMission() {
        return currentPhase().missions[missionIndex];
    }

    function nounButtonFor(value) {
        return nounButtons.find((button) => button.dataset.value === value) || null;
    }

    function verbButtonFor(value) {
        return verbButtons.find((button) => button.dataset.value === value) || null;
    }

    function objectPhrase(nounValue) {
        if (nounValue == null) return "";
        const noun = nounButtonFor(nounValue);
        return nounValue + (noun ? noun.dataset.particle : objectParticle(nounValue)) + " ";
    }

    function sentenceFor(mission) {
        const other = castAssets[mission.other].label;
        const verb = verbButtonFor(mission.verb);
        const present = verb.dataset.present;
        const ge = verb.dataset.ge;
        const object = objectPhrase(mission.noun);

        if (mission.route === "direct-self") {
            return "제가 " + object + present + ".";
        }
        if (mission.route === "direct-other") {
            return other + subjectParticle(other) + " " + object + present + ".";
        }
        if (mission.route === "self-to-other") {
            if (mission.noun == null) {
                return "제가 " + other + objectParticle(other) + " " + ge + " 해요.";
            }
            return "제가 " + other + "에게 " + object + ge + " 해요.";
        }
        if (mission.noun == null) {
            return other + subjectParticle(other) + " 저를 " + ge + " 해요.";
        }
        return other + subjectParticle(other) + " 저에게 " + object + ge + " 해요.";
    }

    function validateMissionData() {
        const missions = phases.flatMap((phase) => phase.missions);
        const nounValues = new Set(nounButtons.map((button) => button.dataset.value));
        const verbValues = new Set(verbButtons.map((button) => button.dataset.value));
        const ids = new Set();
        const errors = [];

        if (missions.length !== 18 || phases.some((phase) => phase.missions.length !== 9)) {
            errors.push("문항 수는 단계별 9개, 전체 18개여야 합니다.");
        }
        phases.forEach((phase) => phase.missions.forEach((mission) => {
            if (ids.has(mission.id)) errors.push("중복 문항 ID: " + mission.id);
            ids.add(mission.id);
            if (mission.phase !== phase.id || !mission.id.startsWith("p" + phase.id + "-")) {
                errors.push("단계/문항 ID 불일치: " + mission.id);
            }
            if (typeof mission.prompt !== "string" || !mission.prompt.trim()) errors.push("지시문 누락: " + mission.id);
            if (!VALID_ROUTES.has(mission.route)) errors.push("잘못된 경로: " + mission.id);
            if (!VALID_OTHERS.has(mission.other)) errors.push("잘못된 타인: " + mission.id);
            if (!verbValues.has(mission.verb)) errors.push("없는 동사: " + mission.id);
            if (mission.noun != null && !nounValues.has(mission.noun)) errors.push("없는 명사: " + mission.id);
            if ((mission.noun == null) !== NO_OBJECT_VERBS.has(mission.verb)) {
                errors.push("자동사/명사 규칙 불일치: " + mission.id);
            }
        }));
        if (errors.length) throw new Error(errors.join("\n"));
    }

    function setPressed(buttons, selected) {
        buttons.forEach((button) => {
            const active = button === selected;
            button.classList.toggle("is-selected", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    function selectedActionText() {
        if (NO_OBJECT_VERBS.has(selectedVerb.dataset.value)) return selectedVerb.dataset.value;
        return selectedNoun.dataset.value + selectedNoun.dataset.particle + " " + selectedVerb.dataset.value;
    }

    function updatePreview() {
        const objectless = NO_OBJECT_VERBS.has(selectedVerb.dataset.value);
        refs.previewNounIcon.textContent = objectless ? "" : selectedNoun.dataset.icon;
        refs.previewNounIcon.classList.toggle("is-hidden", objectless);
        refs.previewVerbIcon.textContent = selectedVerb.dataset.icon;
        refs.actionPreviewText.textContent = selectedActionText();
        refs.sentenceCard.setAttribute("aria-label", selectedActionText() + " 행동 카드. 엔터를 누르면 경로 선택으로 이동합니다.");
        nounButtons.forEach((button) => {
            button.disabled = objectless || isLocked;
            button.setAttribute("aria-pressed", String(!objectless && button === selectedNoun));
        });
    }

    function updateScore() {
        refs.scoreText.textContent = "첫 시도 " + firstTryScore + " / " + totalMissionCount;
    }

    function updateOtherCharacter() {
        const other = castAssets[selectedOther];
        refs.otherName.textContent = other.label;
        refs.otherImage.src = other.normal;
        refs.otherImage.alt = other.alt;
        refs.otherZone.setAttribute("aria-label", other.label + "의 직접 행동 제출");
        refs.otherLine.textContent = "누르면 " + other.label + subjectParticle(other.label) + " 직접 해요";
        routeButtons.forEach((button) => {
            button.textContent = button.dataset.route === "self-to-other"
                ? "나 → " + other.label
                : other.label + " → 나";
        });
        otherButtons.forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.other === selectedOther));
        });
    }

    function clearTimers() {
        if (beamTimer) window.clearTimeout(beamTimer);
        if (wrongTimer) window.clearTimeout(wrongTimer);
        beamTimer = null;
        wrongTimer = null;
    }

    function clearFlyingIcons() {
        document.querySelectorAll(".flying-icon").forEach((node) => node.remove());
    }

    function hideBeam() {
        refs.commandBeam.classList.remove("is-visible");
    }

    function clearStageState() {
        if (wrongTimer) window.clearTimeout(wrongTimer);
        wrongTimer = null;
        refs.selfZone.classList.remove("is-hover", "is-pass", "is-result", "is-command", "is-wrong");
        refs.otherZone.classList.remove("is-hover", "is-pass", "is-result", "is-command", "is-wrong");
        refs.routeRail.classList.remove("is-forward", "is-reverse");
        refs.routeArrow.textContent = "•";
        refs.selfRole.textContent = "직접 행동";
        refs.otherRole.textContent = "직접 행동";
        refs.selfLine.textContent = "누르면 내가 직접 해요";
        refs.selfImage.src = castAssets.self.normal;
        refs.selfImage.alt = castAssets.self.alt;
        updateOtherCharacter();
        hideBeam();
    }

    function hideResult() {
        refs.resultPopup.hidden = true;
        refs.resultPopup.classList.remove("is-visible", "is-summary");
        refs.resultLabel.textContent = "완성 문장";
        refs.resultSentence.textContent = "";
    }

    function setFeedback(kind, label, answer, meta) {
        refs.feedbackBox.classList.remove("is-correct", "is-wrong", "is-summary");
        if (kind) refs.feedbackBox.classList.add("is-" + kind);
        refs.feedbackBox.replaceChildren();
        const labelNode = document.createElement("span");
        labelNode.className = "feedback__label";
        labelNode.textContent = label;
        const answerNode = document.createElement("span");
        answerNode.className = "feedback__answer";
        answerNode.textContent = answer;
        refs.feedbackBox.append(labelNode, answerNode);
        if (meta) {
            const metaNode = document.createElement("span");
            metaNode.className = "feedback__meta";
            metaNode.textContent = meta;
            refs.feedbackBox.append(metaNode);
        }
    }

    function setLocked(locked) {
        isLocked = locked;
        refs.composer.hidden = locked;
        verbButtons.forEach((button) => { button.disabled = locked; });
        otherButtons.forEach((button) => { button.disabled = locked; });
        routeButtons.forEach((button) => { button.disabled = locked; });
        refs.selfZone.disabled = locked;
        refs.otherZone.disabled = locked;
        refs.sentenceCard.setAttribute("aria-disabled", String(locked));
        updatePreview();
    }

    function loadMission() {
        clearTimers();
        cancelDrag();
        clearFlyingIcons();
        clearStageState();
        hideResult();
        refs.nextBtn.hidden = true;
        refs.restartBtn.hidden = true;
        refs.composer.hidden = false;
        firstTryEligible = true;
        setLocked(false);

        const phase = currentPhase();
        const mission = currentMission();
        if (phase.id === 1) selectedOther = mission.other;
        refs.otherTabs.hidden = phase.id === 1;
        updateOtherCharacter();
        refs.progressText.textContent = phase.id + "단계 " + (missionIndex + 1) + " / " + phase.missions.length;
        refs.missionText.textContent = mission.prompt;
        refs.statusText.textContent = phase.id === 1
            ? "행동을 고른 뒤 직접 놓거나 나를 거쳐 타인에게 옮겨 보세요."
            : "타인을 고르고 직접 행동 또는 원인자 → 행위자 경로를 만드세요.";
        setFeedback(null, "도전", "명사와 동사를 고른 뒤 행동 경로를 만들어 보세요.");
        updatePreview();
    }

    function attemptedTarget(route) {
        return route === "direct-self" || route === "other-to-self" ? refs.selfZone : refs.otherZone;
    }

    function wrongMessage(route) {
        const mission = currentMission();
        const other = castAssets[mission.other].label;
        if (mission.noun != null && selectedNoun.dataset.value !== mission.noun) {
            return { answer: "문장에 나온 명사는 ‘" + mission.noun + "’예요.", meta: "명사 카드를 다시 골라 보세요." };
        }
        if (selectedVerb.dataset.value !== mission.verb) {
            return { answer: "문장에 나온 동사는 ‘" + mission.verb + "’예요.", meta: "동사 카드를 다시 골라 보세요." };
        }
        if (mission.route !== "direct-self" && selectedOther !== mission.other) {
            return { answer: "이번 문장의 타인은 ‘" + other + "’예요.", meta: "타인 탭을 다시 확인해 보세요." };
        }
        if (route !== mission.route) {
            if (mission.route === "direct-self") {
                return { answer: "이번에는 제가 직접 해야 해요.", meta: "다른 인물을 거치지 않고 나에게 바로 놓으세요." };
            }
            if (mission.route === "direct-other") {
                return { answer: "이번에는 " + other + subjectParticle(other) + " 직접 해야 해요.", meta: other + "에게 바로 놓으세요." };
            }
            if (mission.route === "self-to-other") {
                return { answer: "이번 문장은 나 → " + other + " 방향의 -게 하다예요.", meta: "나를 먼저 지나 " + other + "에게 놓으세요." };
            }
            return { answer: "방향이 반대예요. " + other + " → 나로 옮겨야 해요.", meta: other + "을 먼저 지나 나에게 놓으세요." };
        }
        return { answer: "다시 한 번 확인해 보세요.", meta: "문장과 행동 경로를 차례로 비교해 보세요." };
    }

    function showWrong(route) {
        firstTryEligible = false;
        clearStageState();
        hideResult();
        refs.nextBtn.hidden = true;
        const target = attemptedTarget(route);
        target.classList.add("is-wrong");
        const castKey = target === refs.selfZone ? "self" : selectedOther;
        const image = target === refs.selfZone ? refs.selfImage : refs.otherImage;
        image.src = castAssets[castKey].bad;
        const message = wrongMessage(route);
        setFeedback("wrong", "다시 시도", message.answer, message.meta);
        refs.statusText.textContent = "같은 문항에서 다시 시도할 수 있어요.";
        wrongTimer = window.setTimeout(() => {
            target.classList.remove("is-wrong");
            image.src = castAssets[castKey].normal;
            wrongTimer = null;
        }, 520);
    }

    function centerOf(element) {
        const rect = element.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function drawBeam(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.hypot(dx, dy);
        if (length < 20) {
            hideBeam();
            return;
        }
        refs.commandBeam.style.left = start.x + "px";
        refs.commandBeam.style.top = start.y + "px";
        refs.commandBeam.style.width = length + "px";
        refs.commandBeam.style.transform = "rotate(" + (Math.atan2(dy, dx) * 180 / Math.PI) + "deg)";
        refs.commandBeam.classList.add("is-visible");
    }

    function pulseBeam(source, target) {
        if (beamTimer) window.clearTimeout(beamTimer);
        drawBeam(centerOf(source), centerOf(target));
        beamTimer = window.setTimeout(() => {
            hideBeam();
            beamTimer = null;
        }, 1050);
    }

    function animateActionFlight(target) {
        const mission = currentMission();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const actionButton = mission.noun == null ? verbButtonFor(mission.verb) : nounButtonFor(mission.noun);
        if (!actionButton) return;
        const startElement = mission.noun == null ? refs.previewVerbIcon : refs.previewNounIcon;
        const start = startElement.getBoundingClientRect();
        const end = target.getBoundingClientRect();
        if (!start.width || !end.width) return;
        const flyer = document.createElement("span");
        flyer.className = "flying-icon";
        flyer.setAttribute("aria-hidden", "true");
        flyer.textContent = actionButton.dataset.icon;
        document.body.appendChild(flyer);
        const startX = start.left + start.width / 2 - 31;
        const startY = start.top + start.height / 2 - 31;
        const endX = end.left + end.width / 2 - 31;
        const endY = end.top + end.height * 0.42 - 31;
        const cleanup = () => flyer.remove();
        if (typeof flyer.animate === "function") {
            const motion = flyer.animate([
                { transform: "translate(" + startX + "px," + startY + "px) scale(.9)", opacity: 1 },
                { transform: "translate(" + endX + "px," + endY + "px) scale(.7)", opacity: 0.1 }
            ], { duration: FLIGHT_DURATION, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
            motion.onfinish = cleanup;
            motion.oncancel = cleanup;
        } else {
            flyer.style.transform = "translate(" + endX + "px," + endY + "px)";
            window.setTimeout(cleanup, FLIGHT_DURATION);
        }
    }

    function showCorrect(route) {
        const mission = currentMission();
        const actorZone = attemptedTarget(route);
        const sourceZone = route === "self-to-other" ? refs.selfZone : refs.otherZone;
        if (firstTryEligible) firstTryScore += 1;
        updateScore();
        clearStageState();
        setLocked(true);

        if (route === "direct-self" || route === "direct-other") {
            actorZone.classList.add("is-result");
            (actorZone === refs.selfZone ? refs.selfRole : refs.otherRole).textContent = "직접 행동";
            if (actorZone === refs.selfZone) {
                refs.otherRole.textContent = "관찰자";
                refs.selfLine.textContent = "내가 직접 행동해요.";
                refs.otherLine.textContent = castAssets[selectedOther].label + "는 이번에는 기다려요.";
            } else {
                refs.selfRole.textContent = "관찰자";
                refs.selfLine.textContent = "나는 이번에는 기다려요.";
                refs.otherLine.textContent = castAssets[selectedOther].label + subjectParticle(castAssets[selectedOther].label) + " 직접 행동해요.";
            }
        } else {
            sourceZone.classList.add("is-command");
            actorZone.classList.add("is-result");
            (sourceZone === refs.selfZone ? refs.selfRole : refs.otherRole).textContent = "원인자";
            (actorZone === refs.selfZone ? refs.selfRole : refs.otherRole).textContent = "행위자";
            refs.routeRail.classList.add(route === "self-to-other" ? "is-forward" : "is-reverse");
            refs.routeArrow.textContent = route === "self-to-other" ? "→" : "←";
            if (sourceZone === refs.selfZone) {
                refs.selfLine.textContent = "내가 행동하게 해요.";
                refs.otherLine.textContent = castAssets[selectedOther].label + subjectParticle(castAssets[selectedOther].label) + " 실제로 행동해요.";
            } else {
                refs.otherLine.textContent = castAssets[selectedOther].label + subjectParticle(castAssets[selectedOther].label) + " 행동하게 해요.";
                refs.selfLine.textContent = "내가 실제로 행동해요.";
            }
            pulseBeam(sourceZone, actorZone);
        }

        const actorKey = actorZone === refs.selfZone ? "self" : selectedOther;
        const actorImage = actorZone === refs.selfZone ? refs.selfImage : refs.otherImage;
        actorImage.src = mission.verb === "울다" ? castAssets[actorKey].sad : castAssets[actorKey].laugh;
        animateActionFlight(actorZone);
        refs.resultPopup.hidden = false;
        refs.resultPopup.classList.add("is-visible");
        refs.resultSentence.textContent = sentenceFor(mission);
        setFeedback("correct", "정답", "원인자와 실제 행동한 사람을 잘 구분했어요.", firstTryEligible ? "첫 시도 정답으로 기록했어요." : "힌트 뒤에 끝까지 완성했어요.");
        refs.statusText.textContent = "완성 문장을 확인한 뒤 다음으로 이동하세요.";
        refs.nextBtn.hidden = false;
        const isLastMission = missionIndex === currentPhase().missions.length - 1;
        if (currentPhaseIndex === phases.length - 1 && isLastMission) {
            refs.nextBtn.textContent = "결과 보기";
        } else if (isLastMission) {
            refs.nextBtn.textContent = "다음 단계";
        } else {
            refs.nextBtn.textContent = "다음 문제";
        }
    }

    function submitRoute(route) {
        if (isLocked || !VALID_ROUTES.has(route)) return;
        const mission = currentMission();
        const nounOk = mission.noun == null || selectedNoun.dataset.value === mission.noun;
        const verbOk = selectedVerb.dataset.value === mission.verb;
        const otherOk = mission.route === "direct-self" || selectedOther === mission.other;
        if (nounOk && verbOk && otherOk && route === mission.route) {
            showCorrect(route);
        } else {
            showWrong(route);
        }
    }

    function openSummary() {
        clearTimers();
        cancelDrag();
        clearFlyingIcons();
        clearStageState();
        setLocked(true);
        refs.progressText.textContent = "최종 결과";
        refs.missionText.textContent = "18문제를 모두 마쳤어요.";
        refs.statusText.textContent = "첫 시도 점수를 확인하고 다시 도전할 수 있어요.";
        refs.resultPopup.hidden = false;
        refs.resultPopup.classList.add("is-visible", "is-summary");
        refs.resultLabel.textContent = "첫 시도 점수";
        refs.resultSentence.textContent = firstTryScore + " / " + totalMissionCount;
        setFeedback("summary", "완료", "직접 행동과 양방향 -게 하다를 모두 연습했어요.", "다시 하기를 누르면 처음부터 시작합니다.");
        refs.composer.hidden = true;
        refs.nextBtn.hidden = true;
        refs.restartBtn.hidden = false;
    }

    function advanceGame() {
        if (!isLocked) return;
        const atLast = missionIndex === currentPhase().missions.length - 1;
        if (currentPhaseIndex === phases.length - 1 && atLast) {
            openSummary();
            return;
        }
        if (atLast) {
            currentPhaseIndex += 1;
            missionIndex = 0;
        } else {
            missionIndex += 1;
        }
        loadMission();
    }

    function zoneAtPoint(x, y) {
        const element = document.elementFromPoint(x, y);
        return element ? element.closest("[data-zone]") : null;
    }

    function appendTrail(zone) {
        if (!dragState || !zone) return;
        const key = zone.dataset.zone;
        const last = dragState.trail[dragState.trail.length - 1];
        if (last !== key) dragState.trail.push(key);
        zone.classList.add("is-pass");
    }

    function makeGhost(x, y) {
        const ghost = document.createElement("div");
        ghost.className = "drag-ghost";
        const left = document.createElement("span");
        left.textContent = NO_OBJECT_VERBS.has(selectedVerb.dataset.value) ? "" : selectedNoun.dataset.icon;
        const text = document.createElement("span");
        text.textContent = selectedActionText();
        const right = document.createElement("span");
        right.textContent = selectedVerb.dataset.icon;
        ghost.append(left, text, right);
        document.body.appendChild(ghost);
        moveGhost(ghost, x, y);
        return ghost;
    }

    function moveGhost(ghost, x, y) {
        ghost.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
    }

    function activateDrag() {
        if (!dragState || dragState.active) return;
        dragState.active = true;
        dragState.beamStart = centerOf(refs.sentenceCard);
        dragState.ghost = makeGhost(dragState.x, dragState.y);
        refs.sentenceCard.classList.add("is-dragging");
        refs.statusText.textContent = "한 인물에 바로 놓거나 원인자를 지나 행위자에게 놓으세요.";
    }

    function moveDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        dragState.x = event.clientX;
        dragState.y = event.clientY;
        const distance = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
        if (!dragState.active && distance > 5) activateDrag();
        if (!dragState.active) return;
        moveGhost(dragState.ghost, event.clientX, event.clientY);
        drawBeam(dragState.beamStart, { x: event.clientX, y: event.clientY });
        refs.selfZone.classList.remove("is-hover");
        refs.otherZone.classList.remove("is-hover");
        const zone = zoneAtPoint(event.clientX, event.clientY);
        if (zone) {
            zone.classList.add("is-hover");
            appendTrail(zone);
        }
        event.preventDefault();
    }

    function removeDragListeners() {
        document.removeEventListener("pointermove", moveDrag);
        document.removeEventListener("pointerup", endDrag);
        document.removeEventListener("pointercancel", cancelDrag);
        window.removeEventListener("blur", cancelDrag);
    }

    function cleanupDrag() {
        const state = dragState;
        removeDragListeners();
        dragState = null;
        refs.sentenceCard.classList.remove("is-dragging");
        refs.selfZone.classList.remove("is-hover", "is-pass");
        refs.otherZone.classList.remove("is-hover", "is-pass");
        hideBeam();
        if (state && state.ghost) state.ghost.remove();
        if (state && refs.sentenceCard.hasPointerCapture && refs.sentenceCard.hasPointerCapture(state.pointerId)) {
            try { refs.sentenceCard.releasePointerCapture(state.pointerId); } catch (error) { /* capture already released */ }
        }
    }

    function cancelDrag(event) {
        if (event && dragState && event.pointerId != null && event.pointerId !== dragState.pointerId) return;
        if (!dragState) return;
        cleanupDrag();
        refs.statusText.textContent = "드래그가 취소됐어요. 다시 시도해 보세요.";
    }

    function routeFromTrail(trail) {
        if (trail.length === 1) return trail[0] === "self" ? "direct-self" : "direct-other";
        if (trail.length < 2) return null;
        const source = trail[trail.length - 2];
        const target = trail[trail.length - 1];
        if (source === "self" && target === "other") return "self-to-other";
        if (source === "other" && target === "self") return "other-to-self";
        return target === "self" ? "direct-self" : "direct-other";
    }

    function endDrag(event) {
        if (!dragState || event.pointerId !== dragState.pointerId) return;
        const wasActive = dragState.active;
        const finalZone = wasActive ? zoneAtPoint(event.clientX, event.clientY) : null;
        if (finalZone) appendTrail(finalZone);
        const trail = dragState.trail.slice();
        cleanupDrag();
        if (!wasActive) {
            refs.statusText.textContent = "카드를 끌거나 아래 경로 버튼을 선택하세요.";
            return;
        }
        if (!finalZone) {
            refs.statusText.textContent = "인물 위에 놓이지 않았어요. 점수에는 반영되지 않습니다.";
            return;
        }
        const route = routeFromTrail(trail);
        if (route) submitRoute(route);
    }

    function startDrag(event) {
        if (isLocked || dragState || (event.button != null && event.button !== 0)) return;
        dragState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            x: event.clientX,
            y: event.clientY,
            active: false,
            beamStart: null,
            ghost: null,
            trail: []
        };
        try { refs.sentenceCard.setPointerCapture(event.pointerId); } catch (error) { /* capture unavailable */ }
        document.addEventListener("pointermove", moveDrag);
        document.addEventListener("pointerup", endDrag);
        document.addEventListener("pointercancel", cancelDrag);
        window.addEventListener("blur", cancelDrag);
        event.preventDefault();
    }

    function resetGame() {
        clearTimers();
        cancelDrag();
        currentPhaseIndex = 0;
        missionIndex = 0;
        firstTryScore = 0;
        selectedOther = "friend";
        selectedNoun = nounButtons[0];
        selectedVerb = verbButtons[0];
        setPressed(nounButtons, selectedNoun);
        setPressed(verbButtons, selectedVerb);
        updateScore();
        loadMission();
    }

    nounButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (isLocked || button.disabled) return;
            selectedNoun = button;
            setPressed(nounButtons, button);
            updatePreview();
        });
    });

    verbButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (isLocked) return;
            selectedVerb = button;
            setPressed(verbButtons, button);
            updatePreview();
        });
    });

    otherButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (isLocked || currentPhase().id === 1) return;
            selectedOther = button.dataset.other;
            clearStageState();
            updateOtherCharacter();
        });
    });

    routeButtons.forEach((button) => {
        button.addEventListener("click", () => submitRoute(button.dataset.route));
    });

    refs.selfZone.addEventListener("click", () => submitRoute("direct-self"));
    refs.otherZone.addEventListener("click", () => submitRoute("direct-other"));
    refs.sentenceCard.addEventListener("pointerdown", startDrag);
    refs.sentenceCard.addEventListener("lostpointercapture", () => {
        if (dragState) cancelDrag();
    });
    refs.sentenceCard.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const routeButton = routeButtons[0];
        if (routeButton && !routeButton.disabled) routeButton.focus();
        refs.statusText.textContent = "경로 버튼을 선택하거나 인물 버튼으로 직접 행동을 제출하세요.";
    });
    refs.nextBtn.addEventListener("click", advanceGame);
    refs.restartBtn.addEventListener("click", resetGame);
    refs.resetBtn.addEventListener("click", resetGame);

    validateMissionData();
    resetGame();
})();
